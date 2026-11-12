// Datenquelle der App: kein Server.
// Inhalte kommen aus content.json (aus content/ erzeugt), der Fortschritt aus dem localStorage des Browsers.
// Vor dem Speichern prüft checkProgressPut den Stand (Schema, Revision → 409, Versuchs-Rückgang).

import type { SaveProgressRequest } from '../../shared/api';
import { checkProgressPut } from '../../shared/progress';
import type { KernInhalt, ThemaTexte } from '../../shared/texte';
import type { BegriffsSeite } from '../../shared/types';
import type { DataSource } from './api';
import { ApiError } from './apiError';
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
        return readRaw();
      } catch {
        return null;
      }
    },
    /** Prüft den Body und speichert ihn mit der nächsten Revision. Wirft ApiError. */
    save(body: SaveProgressRequest): { ok: true; revision: number } {
      let checked: ReturnType<typeof checkProgressPut>;
      try {
        checked = checkProgressPut(body, readRaw());
        if (checked.ok) storage().setItem(PROGRESS_KEY, JSON.stringify(checked.progress));
      } catch (e) {
        throw new ApiError(
          500,
          `Speichern im Browser fehlgeschlagen (${(e as Error).message}). Lade zur Sicherheit eine Sicherung herunter.`,
        );
      }
      if (!checked.ok) throw new ApiError(checked.status, checked.error);
      return { ok: true, revision: checked.progress.revision };
    },
  };
}

export function createStaticApi(
  store = createLocalProgressStore(() => localStorage),
  requestPersist: () => Promise<unknown> = createPersistRequest(),
  backups: BrowserBackups = createBrowserBackups(() => openIndexedDbBackups()),
): DataSource {
  return {
    content: async () => {
      const res = await fetch(`${import.meta.env.BASE_URL}content.json`);
      if (!res.ok) throw new ApiError(res.status, `Die Lernblätter konnten nicht geladen werden (Fehler ${res.status}).`);
      return (await res.json()) as KernInhalt;
    },
    begriffe: async () => {
      const res = await fetch(`${import.meta.env.BASE_URL}begriffe.json`);
      if (!res.ok) throw new ApiError(res.status, `Die Begriffsseiten konnten nicht geladen werden (Fehler ${res.status}).`);
      return (await res.json()) as BegriffsSeite[];
    },
    texte: async (topicId) => {
      const res = await fetch(`${import.meta.env.BASE_URL}texte/${encodeURIComponent(topicId)}.json`);
      if (!res.ok) throw new ApiError(res.status, `Das Lernblatt konnte nicht geladen werden (Fehler ${res.status}).`);
      return (await res.json()) as ThemaTexte;
    },
    progress: async () => store.read(),
    saveProgress: async (p) => {
      const before = store.readText();
      const result = store.save(p);
      // Tagessicherung: den überschriebenen Stand (vom Tagesbeginn) ins IndexedDB, höchstens einmal pro Tag.
      // Nicht abwarten – ein hängendes IndexedDB darf das Speichern nicht aufhalten; Fehler werden dort verschluckt.
      void backups.backupBeforeSave(before, localDate());
      // Nach dem ersten Speichern um dauerhaften Speicher bitten (einmal pro Seitenaufruf, Fehler egal).
      void requestPersist().catch(() => {});
      return result;
    },
    saveProgressOnUnload: (p) => {
      try {
        store.save(p);
      } catch {
        // Beim Schließen lässt sich kein Fehler mehr anzeigen.
      }
    },
    backups: () => backups.info(),
    readBackup: (date) => backups.read(date),
    watchOtherTabs: (onChange) => {
      // Das storage-Ereignis kommt nur in den anderen Tabs an – dieser Tab ist dann veraltet.
      const listener = (e: StorageEvent) => {
        if (e.key === PROGRESS_KEY) onChange();
      };
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
  };
}
