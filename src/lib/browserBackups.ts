// Automatische Tagessicherungen im IndexedDB des Browsers:
// Vor dem ersten Speichern eines Tages wird der bisher gespeicherte Stand (also der Stand vom Tagesbeginn) gesichert,
// höchstens eine Sicherung pro Tag, die letzten BROWSER_BACKUP_KEEP Tage bleiben.
// Die Rotation ist rein (planBackup), der Speicher austauschbar (BackupStorage), damit alles ohne Browser testbar ist.
// Fehler beim Sichern werden verschluckt: Eine fehlende Sicherung darf das Speichern nie verhindern.

import type { BackupInfo, BackupItem } from '../../shared/api';

/** Anzahl der aufbewahrten Tagessicherungen im Browser. */
export const BROWSER_BACKUP_KEEP = 7;

/** Eine gespeicherte Sicherung: Tag (YYYY-MM-DD, Schlüssel), Zeitpunkt und der Fortschritt als JSON-Text. */
export interface BackupRecord {
  date: string;
  savedAt: string;
  json: string;
}

/** Was die Sicherungslogik vom Speicher braucht (IndexedDB oder im Test eine Map). */
export interface BackupStorage {
  list(): Promise<BackupRecord[]>;
  get(date: string): Promise<BackupRecord | undefined>;
  put(record: BackupRecord): Promise<void>;
  remove(dates: string[]): Promise<void>;
}

/**
 * Rotation: Gibt es heute noch keine Sicherung, kommt eine dazu (`add`); danach bleiben nur die neuesten `keep` Tage,
 * `remove` nennt die zu löschenden (älteste zuerst).
 */
export function planBackup(existing: string[], today: string, keep = BROWSER_BACKUP_KEEP): { add: boolean; remove: string[] } {
  const add = !existing.includes(today);
  const after = [...new Set(add ? [...existing, today] : existing)].sort();
  return { add, remove: after.slice(0, Math.max(0, after.length - keep)) };
}

/** Kurzinfo für die Liste auf Daten & Import. Nicht lesbare Sicherungen zählen mit 0. */
export function summarizeBackup(record: BackupRecord): BackupItem {
  let attempts = 0;
  let cards = 0;
  try {
    const data = JSON.parse(record.json) as { attempts?: unknown; cards?: unknown };
    if (Array.isArray(data.attempts)) attempts = data.attempts.length;
    if (data.cards && typeof data.cards === 'object') cards = Object.keys(data.cards).length;
  } catch {
    // bleibt 0
  }
  return { date: record.date, savedAt: record.savedAt, attempts, cards };
}

export function createBrowserBackups(openStorage: () => Promise<BackupStorage>) {
  let storage: Promise<BackupStorage> | undefined;
  let queue: Promise<unknown> = Promise.resolve();
  /** Tag, für den die Sicherung schon erledigt ist – spart den IndexedDB-Zugriff bei jedem weiteren Speichern. */
  let backedUpDay: string | undefined;
  const get = () =>
    (storage ??= openStorage().catch((e: unknown) => {
      storage = undefined; // beim nächsten Mal neu versuchen
      throw e;
    }));

  return {
    /**
     * Sichert `previousJson` (den Stand vor dem Überschreiben), falls es heute noch keine Sicherung gibt, und rotiert.
     * Lehnt nie ab; liefert, ob gesichert wurde.
     */
    backupBeforeSave(previousJson: string | null, today: string, now = new Date().toISOString()): Promise<boolean> {
      // Nacheinander ausführen: Zwei schnelle Speichervorgänge dürfen die Sicherung des Tages nicht doppelt schreiben.
      const run = queue.then(async () => {
        if (previousJson === null || backedUpDay === today) return false;
        try {
          JSON.parse(previousJson); // kaputte Stände nicht sichern – sie landen schon unter BROKEN_KEY
          const db = await get();
          const plan = planBackup(
            (await db.list()).map((r) => r.date),
            today,
          );
          if (plan.add) await db.put({ date: today, savedAt: now, json: previousJson });
          if (plan.remove.length) await db.remove(plan.remove);
          backedUpDay = today;
          return plan.add;
        } catch {
          return false;
        }
      });
      queue = run;
      return run;
    },
    /** Übersicht für Daten & Import, neueste zuerst. Ohne IndexedDB: leer. */
    async info(): Promise<BackupInfo> {
      await queue; // eine gerade laufende Sicherung abwarten
      try {
        const items = (await (await get()).list()).map(summarizeBackup).sort((a, b) => b.date.localeCompare(a.date));
        return { newest: items[0]?.date ?? null, count: items.length, items };
      } catch {
        return { newest: null, count: 0, items: [] };
      }
    },
    /** JSON-Text der Sicherung eines Tages; wirft mit deutscher Meldung, wenn es sie nicht gibt. */
    async read(date: string): Promise<string> {
      let record: BackupRecord | undefined;
      await queue;
      try {
        record = await (await get()).get(date);
      } catch (e) {
        throw new Error(`Die Sicherung konnte nicht gelesen werden (${(e as Error).message}).`, { cause: e });
      }
      if (!record) throw new Error(`Keine Sicherung vom ${date} gefunden.`);
      return record.json;
    },
  };
}

export type BrowserBackups = ReturnType<typeof createBrowserBackups>;

const DB_NAME = 'ap2-lernapp';
const STORE = 'sicherungen';

const done = <T>(req: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB-Fehler'));
  });

/** BackupStorage auf IndexedDB. Wirft (bzw. lehnt ab), wenn IndexedDB fehlt oder gesperrt ist (z. B. privates Fenster). */
export async function openIndexedDbBackups(factory: () => IDBFactory = () => indexedDB): Promise<BackupStorage> {
  const open = factory().open(DB_NAME, 1);
  open.onupgradeneeded = () => {
    if (!open.result.objectStoreNames.contains(STORE)) open.result.createObjectStore(STORE, { keyPath: 'date' });
  };
  const db = await done(open);
  const tx = (mode: IDBTransactionMode) => db.transaction(STORE, mode).objectStore(STORE);
  return {
    list: async () => (await done(tx('readonly').getAll())) as BackupRecord[],
    get: async (date) => (await done(tx('readonly').get(date))) as BackupRecord | undefined,
    put: async (record) => void (await done(tx('readwrite').put(record))),
    remove: async (dates) => {
      const store = tx('readwrite');
      await Promise.all(dates.map((d) => done(store.delete(d))));
    },
  };
}
