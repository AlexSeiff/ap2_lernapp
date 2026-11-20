// Der Lernstand im localStorage (der Rückfall, wenn IndexedDB nicht geht, und die Quelle des einmaligen Umzugs nach IndexedDB).
// Inhalt: dasselbe JSON wie eine heruntergeladene Sicherung.

import { migrateProgress, type Progress } from '../../domain/progress';
import { alsSpeicherFehler, berechneSpeicherstand } from './progressSchreiben';

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

  /** Schreibt und liefert den Text, der vorher gespeichert war (für die Tagessicherung), oder null. */
  function write(body: unknown, replace = false): string | null {
    try {
      const vorher = storage().getItem(PROGRESS_KEY);
      const { text, progress } = berechneSpeicherstand(body, readRaw(), known, replace);
      storage().setItem(PROGRESS_KEY, text);
      known = progress;
      return vorher;
    } catch (e) {
      throw alsSpeicherFehler(e);
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
