// Inhalte aus JSON-Dateien, Fortschritt im Browser.

import { isSuspiciousAttemptDrop, migrateProgress, ProgressSchema, type Progress } from '../../domain/progress';
import { mergeProgress } from '../../domain/mergeProgress';
import type { Details, StartInhalt, ThemaTexte } from '../../domain/texte';
import type { BegriffsSeite } from '../../domain/types';
import { createBrowserBackups, openIndexedDbBackups, type BrowserBackups } from './browserBackups';
import { createPersistRequest } from './persistentStorage';
import { localDate } from './progress';

/** Schlüssel des Fortschritts im localStorage. Inhalt: dasselbe JSON wie eine heruntergeladene Sicherung. */
export const PROGRESS_KEY = 'ap2-fortschritt';
/** Hier landet ein nicht lesbarer Stand, bevor er überschrieben wird. */
export const BROKEN_KEY = 'ap2-fortschritt-defekt';

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Fortschritt im Browser lesen und speichern. `storage` als Funktion, weil schon der Zugriff auf localStorage werfen kann. */
export function createLocalProgressStore(storage: () => KeyValueStorage) {
  let known: Progress | undefined;
  function readRaw(): unknown {
    const raw = storage().getItem(PROGRESS_KEY);
    if (raw === null) return null;
    try {
      return JSON.parse(raw);
    } catch {
      storage().setItem(BROKEN_KEY, raw);
      return null;
    }
  }

  function write(body: unknown, replace = false): void {
    const parsed = ProgressSchema.safeParse(body);
    if (!parsed.success) {
      const where = parsed.error.issues
        .slice(0, 3)
        .map((issue) => issue.path.join('.') || '(gesamt)')
        .join(', ');
      throw new Error(`Fortschritt nicht gespeichert: Die Daten sind ungültig (Fehler bei ${where}).`);
    }
    const { revision: _revision, ...data } = parsed.data;
    const progress = data as Progress;
    try {
      const stored = migrateProgress(readRaw());
      const baseline = known ?? stored;
      if (!replace && isSuspiciousAttemptDrop(baseline.attempts.length, progress.attempts.length)) {
        throw new Error(
          `Fortschritt nicht gespeichert: Er enthält nur ${progress.attempts.length} statt ${baseline.attempts.length} Versuche. ` +
            'Zum bewussten Zurücksetzen nutze „Fortschritt zurücksetzen“ oder „Sicherung einspielen“ auf der Seite Daten & Import. ' +
            'Ist die App in einem anderen Tab offen? Dann bitte diese Seite neu laden.',
        );
      }
      // Nur fremde Änderungen zusammenführen: sonst würden z. B. entfernte Antworten und Lernziele wieder auftauchen.
      const next = JSON.stringify(stored) === JSON.stringify(baseline) ? progress : mergeProgress(progress, stored);
      storage().setItem(PROGRESS_KEY, JSON.stringify(next));
      known = migrateProgress(progress);
    } catch (e) {
      if ((e as Error).message.startsWith('Fortschritt nicht gespeichert:')) throw e;
      throw new Error(`Speichern im Browser fehlgeschlagen (${(e as Error).message}). Lade zur Sicherheit eine Sicherung herunter.`, {
        cause: e,
      });
    }
  }

  return {
    /** Gespeicherter Stand als Text (für die Tagessicherung) oder null. */
    readText(): string | null {
      try {
        return storage().getItem(PROGRESS_KEY);
      } catch {
        return null;
      }
    },
    /** Gespeicherter Stand oder null (noch nichts gespeichert oder localStorage nicht verfügbar). */
    read(): unknown {
      try {
        const raw = readRaw();
        known = migrateProgress(raw);
        return raw;
      } catch {
        return null;
      }
    },
    save: (body: unknown) => write(body),
    /** Bewusstes Ersetzen aus Daten & Import; inzwischen fremd gespeicherte Änderungen bleiben erhalten. */
    replace: (body: unknown) => write(body, true),
  };
}

export function createStaticApi(
  store = createLocalProgressStore(() => localStorage),
  requestPersist: () => Promise<unknown> = createPersistRequest(),
  backups: BrowserBackups = createBrowserBackups(() => openIndexedDbBackups()),
) {
  const persist = async (p: Progress, write: (p: Progress) => void) => {
    const before = store.readText();
    write(p);
    // Die Tagessicherung und die Speicherfreigabe dürfen das Speichern nicht aufhalten.
    void backups.backupBeforeSave(before, localDate());
    void requestPersist().catch(() => {});
  };
  return {
    content: async () => {
      const res = await fetch(`${import.meta.env.BASE_URL}content.json`);
      if (!res.ok) throw new Error(`Die Lernblätter konnten nicht geladen werden (Fehler ${res.status}).`);
      return (await res.json()) as StartInhalt;
    },
    details: async () => {
      const res = await fetch(`${import.meta.env.BASE_URL}details.json`);
      if (!res.ok) throw new Error(`Karten und Aufgaben konnten nicht geladen werden (Fehler ${res.status}).`);
      return (await res.json()) as Details;
    },
    begriffe: async () => {
      const res = await fetch(`${import.meta.env.BASE_URL}begriffe.json`);
      if (!res.ok) throw new Error(`Die Begriffsseiten konnten nicht geladen werden (Fehler ${res.status}).`);
      return (await res.json()) as BegriffsSeite[];
    },
    texte: async (topicId: string) => {
      const res = await fetch(`${import.meta.env.BASE_URL}texte/${encodeURIComponent(topicId)}.json`);
      if (!res.ok) throw new Error(`Das Lernblatt konnte nicht geladen werden (Fehler ${res.status}).`);
      return (await res.json()) as ThemaTexte;
    },
    progress: async () => store.read(),
    saveProgress: (p: Progress) => persist(p, store.save),
    replaceProgress: (p: Progress) => persist(p, store.replace),
    backups: () => backups.info(),
    readBackup: (date: string) => backups.read(date),
    watchOtherTabs: (onChange: () => void) => {
      // Das storage-Ereignis kommt nur in den anderen Tabs an – dieser Tab ist dann veraltet.
      const listener = (e: StorageEvent) => {
        if (e.key === PROGRESS_KEY) onChange();
      };
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
  };
}
