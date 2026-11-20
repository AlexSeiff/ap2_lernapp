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

/** Was beide Speicher können (der localStorage-Speicher synchron, der IndexedDB-Speicher asynchron – `await` passt für beide). */
export interface FortschrittsSpeicher {
  readText(): Promise<string | null> | string | null;
  read(): Promise<unknown> | unknown;
  save(body: unknown): Promise<void> | void;
  replace(body: unknown): Promise<void> | void;
}

type LokalerSpeicher = ReturnType<typeof createLocalProgressStore>;

/** Merkt im localStorage, wann der Stand nach IndexedDB umgezogen ist (nur zur Information; der Fortschritt selbst bleibt unberührt). */
export const UMZUG_KEY = 'ap2-fortschritt-in-indexeddb';

export type Umzug = 'nichts' | 'vorhanden' | 'uebernommen';

export async function uebernehmeAusLocalStorage(
  idb: Pick<IdbFortschritt, 'readText' | 'uebernehme'>,
  lokal: Pick<LokalerSpeicher, 'readText' | 'read'>,
  nachUebernahme?: () => void,
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
  nachUebernahme?.();
  return 'uebernommen';
}

export type SpeicherArt = 'indexeddb' | 'localstorage';

export function createAutoProgressStore(
  lokal: LokalerSpeicher = createLocalProgressStore(() => localStorage),
  oeffneIdb: () => Promise<IdbFortschritt> = async () => createIdbFortschritt(await oeffneDb()),
) {
  let wahl: Promise<{ art: SpeicherArt; speicher: FortschrittsSpeicher; idb?: IdbFortschritt }> | undefined;
  const waehle = () =>
    (wahl ??= (async () => {
      let idb: IdbFortschritt | undefined;
      try {
        idb = await oeffneIdb();
        await uebernehmeAusLocalStorage(idb, lokal, () => {
          try {
            localStorage.setItem(UMZUG_KEY, new Date().toISOString());
          } catch {
            /* nur Information */
          }
        });
        return { art: 'indexeddb' as const, speicher: idb, idb };
      } catch {
        try {
          idb?.close();
        } catch {
          /* egal */
        }
        return { art: 'localstorage' as const, speicher: lokal as FortschrittsSpeicher };
      }
    })());

  return {
    /** Welcher Speicher gerade benutzt wird (für Anzeige und Tests). */
    art: async (): Promise<SpeicherArt> => (await waehle()).art,
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
