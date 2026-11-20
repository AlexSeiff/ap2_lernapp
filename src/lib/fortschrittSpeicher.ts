// Welcher Speicher hält den Lernstand? IndexedDB, wenn der Browser sie zulässt; sonst weiter der localStorage (z. B. manche private
// Fenster). Beim ersten Start mit IndexedDB zieht der alte localStorage-Stand verlustfrei um.
//
// Sicherheit beim Umzug:
//  - Es wird nur übernommen, wenn IndexedDB noch leer ist; vorhandener Fortschritt wird nie überschrieben.
//  - Der Text wird 1:1 kopiert und nach dem Schreiben zurückgelesen und verglichen.
//  - Der alte localStorage-Eintrag bleibt stehen (Rückfall, falls IndexedDB später nicht geht). Gelöscht wird er hier nicht.
//  - Schlägt irgendetwas fehl, arbeitet die App in dieser Sitzung mit dem localStorage weiter – es geht nichts verloren.

import { createIdbFortschritt, oeffneDb, type IdbFortschritt } from './idbFortschritt';
import { createLocalProgressStore, PROGRESS_KEY } from './localFortschritt';
import { mergeProgress } from '../../domain/mergeProgress';
import { migrateProgress, type Progress } from '../../domain/progress';
import { arbeiteNachtragEin } from './nachtrag';

/** Was beide Speicher können (der localStorage-Speicher synchron, der IndexedDB-Speicher asynchron – `await` passt für beide). */
export interface FortschrittsSpeicher {
  readText(): Promise<string | null> | string | null;
  read(): Promise<unknown> | unknown;
  /** Beide liefern den vorher gespeicherten Text (für die Tagessicherung), ohne zusätzlichen Lesevorgang davor. */
  save(body: unknown): Promise<string | null | void> | string | null | void;
  replace(body: unknown): Promise<string | null | void> | string | null | void;
}

type LokalerSpeicher = ReturnType<typeof createLocalProgressStore>;

/** Merkt im localStorage, wann der Stand nach IndexedDB umgezogen ist (nur zur Information; der Fortschritt selbst bleibt unberührt). */
export const UMZUG_KEY = 'ap2-fortschritt-in-indexeddb';

export type Umzug = 'nichts' | 'vorhanden' | 'uebernommen';

/** Kleiner Fingerabdruck eines Texts (FNV-1a, 32 Bit, dazu die Länge): reicht für die Frage „hat sich der Text geändert?“. */
export function textHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${(h >>> 0).toString(16)}:${text.length}`;
}

type KeyValue = Pick<Storage, 'getItem' | 'setItem'>;

/** Die Marke im localStorage: wann der Lernstand nach IndexedDB umgezogen ist und welchen Text der localStorage dabei hatte (Fingerabdruck). */
export function leseUmzugsMarke(kv: () => KeyValue = () => localStorage): { am: string; hash: string } | null {
  try {
    const roh = kv().getItem(UMZUG_KEY);
    if (roh === null) return null;
    const marke = JSON.parse(roh) as { am?: unknown; hash?: unknown };
    return typeof marke.hash === 'string' ? { am: String(marke.am ?? ''), hash: marke.hash } : null;
  } catch {
    return null;
  }
}

export function schreibeUmzugsMarke(text: string, kv: () => KeyValue = () => localStorage): void {
  try {
    kv().setItem(UMZUG_KEY, JSON.stringify({ am: new Date().toISOString(), hash: textHash(text) }));
  } catch {
    /* nur eine Hilfe: ohne Marke wird eine spätere Änderung des localStorage nicht bemerkt */
  }
}

/**
 * Wurde der localStorage-Eintrag nach dem Umzug verändert? Das passiert, wenn IndexedDB in einer Sitzung nicht ging und die App mit dem localStorage weiterlief:
 * Diese Eingaben sind sonst verloren, sobald IndexedDB wieder geht (Review-Befund 3). Sie werden mit dem IndexedDB-Stand zusammengeführt (der jüngere, also der
 * localStorage-Stand, zuerst: seine Einstellungen gelten). Ohne Marke (Umzug durch eine ältere Version) wird nur der Ausgangspunkt gemerkt, nichts zusammengeführt.
 */
export async function arbeiteAusfallAenderungenEin(
  speicher: FortschrittsSpeicher,
  lokalText: string | null,
  kv: () => KeyValue = () => localStorage,
): Promise<'nichts' | 'markiert' | 'eingearbeitet'> {
  if (lokalText === null) return 'nichts';
  const marke = leseUmzugsMarke(kv);
  if (!marke) {
    schreibeUmzugsMarke(lokalText, kv);
    return 'markiert';
  }
  if (marke.hash === textHash(lokalText)) return 'nichts';
  let lokal: Progress;
  try {
    lokal = migrateProgress(JSON.parse(lokalText));
  } catch {
    return 'nichts'; // unlesbar: nicht anfassen (der Rückfall-Speicher sichert ihn unter BROKEN_KEY)
  }
  const gespeichert = migrateProgress(await speicher.read());
  await speicher.save(mergeProgress(lokal, gespeichert));
  schreibeUmzugsMarke(lokalText, kv);
  return 'eingearbeitet';
}

export async function uebernehmeAusLocalStorage(
  idb: Pick<IdbFortschritt, 'readText' | 'uebernehme'>,
  lokal: Pick<LokalerSpeicher, 'readText' | 'read'>,
  nachUebernahme?: (text: string) => void,
): Promise<Umzug> {
  if ((await idb.readText()) !== null) return 'vorhanden';
  const text = lokal.readText();
  if (text === null) return 'nichts';
  try {
    JSON.parse(text);
  } catch {
    lokal.read(); // sichert den kaputten Text unter BROKEN_KEY, wie bisher
    return 'nichts';
  }
  if ((await idb.uebernehme(text)) === 'vorhanden') return 'vorhanden';
  // Gegenprobe: Es muss genau derselbe Text angekommen sein.
  if ((await idb.readText()) !== text) throw new Error('Der Lernstand konnte nicht sicher nach IndexedDB übernommen werden.');
  nachUebernahme?.(text);
  return 'uebernommen';
}

export type SpeicherArt = 'indexeddb' | 'localstorage';

/** Eine übrig gebliebene Sicherheitskopie vom Schließen einarbeiten; ein Fehler dabei darf den Start nicht verhindern (die Kopie bleibt dann liegen). */
async function arbeiteNachtragEinSicher(speicher: FortschrittsSpeicher): Promise<void> {
  try {
    await arbeiteNachtragEin(speicher);
  } catch {
    /* bleibt für den nächsten Start liegen */
  }
}

export function createAutoProgressStore(
  lokal: LokalerSpeicher = createLocalProgressStore(() => localStorage),
  oeffneIdb: () => Promise<IdbFortschritt> = async () => createIdbFortschritt(await oeffneDb()),
) {
  let wahl: Promise<{ art: SpeicherArt; speicher: FortschrittsSpeicher; idb?: IdbFortschritt; umgezogen: boolean }> | undefined;
  const waehle = () =>
    (wahl ??= (async () => {
      let idb: IdbFortschritt | undefined;
      try {
        idb = await oeffneIdb();
        const umzug = await uebernehmeAusLocalStorage(idb, lokal, (text) => schreibeUmzugsMarke(text));
        // War IndexedDB schon früher dran und lief eine Sitzung ohne sie weiter, stehen ihre Eingaben im localStorage und werden jetzt zusammengeführt.
        if (umzug === 'vorhanden') {
          try {
            await arbeiteAusfallAenderungenEin(idb, lokal.readText());
          } catch {
            /* der IndexedDB-Stand ist unversehrt; beim nächsten Start wird es erneut versucht */
          }
        }
        await arbeiteNachtragEinSicher(idb);
        return { art: 'indexeddb' as const, speicher: idb, idb, umgezogen: true };
      } catch {
        try {
          idb?.close();
        } catch {
          /* egal */
        }
        await arbeiteNachtragEinSicher(lokal);
        // Schon umgezogen? Dann ist der localStorage-Stand nur eine ältere Kopie, und diese Sitzung arbeitet darauf (siehe speicherInfo).
        return { art: 'localstorage' as const, speicher: lokal as FortschrittsSpeicher, umgezogen: leseUmzugsMarke() !== null };
      }
    })());

  return {
    /** Welcher Speicher gerade benutzt wird (für Anzeige und Tests). */
    art: async (): Promise<SpeicherArt> => (await waehle()).art,
    /** Für die Anzeige: Welcher Speicher, und ist der Lernstand schon nach IndexedDB umgezogen (dann ist der localStorage nur eine ältere Kopie)? */
    speicherInfo: async (): Promise<{ art: SpeicherArt; umgezogen: boolean }> => {
      const { art, umgezogen } = await waehle();
      return { art, umgezogen };
    },
    readText: async () => (await waehle()).speicher.readText(),
    read: async () => (await waehle()).speicher.read(),
    save: async (body: unknown) => (await waehle()).speicher.save(body),
    replace: async (body: unknown) => (await waehle()).speicher.replace(body),
    /**
     * Meldet, wenn ein anderer Tab gespeichert hat. Der storage-Listener hängt sofort (er gilt für den localStorage-Rückfall und kostet
     * nichts), der Kanal der IndexedDB, sobald der Speicher gewählt ist.
     */
    watch(onChange: () => void): () => void {
      const listener = (e: StorageEvent) => {
        if (e.key === PROGRESS_KEY) onChange();
      };
      window.addEventListener('storage', listener);
      let abmelden: (() => void) | undefined;
      let fertig = false;
      void waehle().then(({ idb }) => {
        if (!fertig && idb) abmelden = idb.watch(onChange);
      });
      return () => {
        fertig = true;
        window.removeEventListener('storage', listener);
        abmelden?.();
      };
    },
  };
}

export type AutoProgressStore = ReturnType<typeof createAutoProgressStore>;
