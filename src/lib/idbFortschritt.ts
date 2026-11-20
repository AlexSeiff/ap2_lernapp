// Der Lernstand in IndexedDB statt im localStorage: mehr Platz (der localStorage ist auf etwa 5 MB begrenzt) und Lesen + Schreiben
// in EINER Transaktion – zwei Tabs können sich dadurch nicht mehr gegenseitig überschreiben.
//
// Gespeichert wird derselbe JSON-Text wie in einer heruntergeladenen Sicherung (ein Eintrag, Schlüssel „fortschritt“). Die Rechenlogik
// (prüfen, vor Versuchs-Rückgang schützen, fremde Änderungen zusammenführen) steckt in progressSchreiben.ts und ist dieselbe wie beim
// localStorage-Speicher. Andere Tabs erfahren von einer Änderung über einen BroadcastChannel (IndexedDB meldet selbst nichts).

import { migrateProgress, type Progress } from '../../domain/progress';
import { alsSpeicherFehler, berechneSpeicherstand } from './progressSchreiben';

export const IDB_NAME = 'ap2-lernstand';
const STORE = 'kv';
const KEY = 'fortschritt';
/** Hier landet ein nicht lesbarer Stand, bevor er überschrieben wird (wie BROKEN_KEY im localStorage). */
const KEY_DEFEKT = 'fortschritt-defekt';
const KANAL = 'ap2-lernstand';

type ChannelLike = Pick<BroadcastChannel, 'postMessage' | 'close' | 'onmessage'>;

export interface IdbFortschritt {
  /** Gespeicherter Stand als Text (für die Tagessicherung) oder null. */
  readText(): Promise<string | null>;
  /** Gespeicherter Stand oder null (noch nichts gespeichert). */
  read(): Promise<unknown>;
  /** Speichert und liefert den Text, der vorher gespeichert war (für die Tagessicherung), oder null. */
  save(body: unknown): Promise<string | null>;
  /** Bewusstes Ersetzen aus Daten & Import; inzwischen fremd gespeicherte Änderungen bleiben erhalten. */
  replace(body: unknown): Promise<string | null>;
  /**
   * Übernimmt einen fertigen Stand (Text), aber nur, wenn noch nichts gespeichert ist – für den einmaligen Umzug aus dem localStorage.
   * Liefert 'uebernommen' oder 'vorhanden' (es war schon etwas da, nichts wurde überschrieben).
   */
  uebernehme(text: string): Promise<'uebernommen' | 'vorhanden'>;
  /** Meldet, wenn ein ANDERER Tab gespeichert hat. Liefert die Funktion zum Abmelden. */
  watch(onChange: () => void): () => void;
  close(): void;
}

function anfrage<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB-Fehler'));
  });
}

/** Öffnet die Datenbank. Wirft, wenn IndexedDB fehlt, gesperrt ist (z. B. manche privaten Fenster) oder nicht antwortet. */
export function oeffneDb(factory: () => IDBFactory = () => indexedDB, timeoutMs = 4000): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let open: IDBOpenDBRequest;
    try {
      open = factory().open(IDB_NAME, 1);
    } catch (e) {
      reject(e);
      return;
    }
    // Nach Ablauf der Zeit (oder blockiert) gilt das Öffnen als gescheitert. Öffnet die Verbindung später doch noch, wird sie sofort geschlossen, damit sie
    // nicht ohne Besitzer offen bleibt und eine spätere Datenbankänderung blockiert.
    let aufgegeben = false;
    const gibAuf = (fehler: Error) => {
      aufgegeben = true;
      clearTimeout(timer);
      reject(fehler);
    };
    const timer = setTimeout(() => gibAuf(new Error('IndexedDB antwortet nicht')), timeoutMs);
    open.onupgradeneeded = () => {
      if (!open.result.objectStoreNames.contains(STORE)) open.result.createObjectStore(STORE);
    };
    open.onsuccess = () => {
      clearTimeout(timer);
      if (aufgegeben) {
        open.result.close();
        return;
      }
      open.result.onversionchange = () => open.result.close();
      resolve(open.result);
    };
    open.onerror = () => gibAuf(open.error ?? new Error('IndexedDB konnte nicht geöffnet werden'));
    open.onblocked = () => gibAuf(new Error('IndexedDB ist blockiert (die App ist in einem alten Tab geöffnet)'));
  });
}

export function createIdbFortschritt(
  db: IDBDatabase,
  kanal: ChannelLike | undefined = typeof BroadcastChannel === 'undefined' ? undefined : new BroadcastChannel(KANAL),
): IdbFortschritt {
  /** Der Stand, den dieser Tab zuletzt gelesen oder gespeichert hat (Vergleichsbasis für „hat ein anderer Tab etwas geändert?“). */
  let known: Progress | undefined;

  /**
   * Eine Transaktion: `arbeit` bekommt den Speicher und den gespeicherten Text und läuft synchron im Ereignis der Abfrage – in dieser
   * Zeit kann kein anderer Tab dazwischen schreiben. Wirft `arbeit`, wird die Transaktion abgebrochen und nichts geschrieben.
   */
  function laufe<T>(
    modus: IDBTransactionMode,
    arbeit: (store: IDBObjectStore, text: string | null) => T,
    nachCommit?: (ergebnis: T) => void,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction(STORE, modus);
      } catch (e) {
        reject(e);
        return;
      }
      const store = tx.objectStore(STORE);
      let ergebnis: T;
      const get = store.get(KEY);
      get.onsuccess = () => {
        try {
          ergebnis = arbeit(store, (get.result ?? null) as string | null);
        } catch (e) {
          reject(e);
          try {
            tx.abort();
          } catch {
            /* schon abgebrochen */
          }
        }
      };
      tx.oncomplete = () => {
        nachCommit?.(ergebnis);
        resolve(ergebnis);
      };
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB-Fehler'));
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB-Transaktion abgebrochen'));
    });
  }

  const melde = () => {
    try {
      kanal?.postMessage('geaendert');
    } catch {
      /* ohne Kanal bemerken andere Tabs die Änderung erst beim nächsten Laden */
    }
  };

  /** Text → Objekt; ein kaputter Text wird unter KEY_DEFEKT gesichert, bevor er überschrieben werden kann. */
  const lese = (store: IDBObjectStore, text: string | null): unknown => {
    if (text === null) return null;
    try {
      return JSON.parse(text);
    } catch {
      store.put(text, KEY_DEFEKT);
      return null;
    }
  };

  async function schreibe(body: unknown, replace: boolean): Promise<string | null> {
    try {
      return await laufe(
        'readwrite',
        (store, text) => {
          const { text: neu, progress } = berechneSpeicherstand(body, lese(store, text), known, replace);
          store.put(neu, KEY);
          return { progress, vorher: text };
        },
        ({ progress }) => {
          known = progress;
          melde();
        },
      ).then((r) => r.vorher);
    } catch (e) {
      throw alsSpeicherFehler(e);
    }
  }

  return {
    async readText() {
      try {
        return await laufe('readonly', (_store, text) => text);
      } catch {
        return null;
      }
    },
    async read() {
      try {
        const text = await anfrage(db.transaction(STORE, 'readonly').objectStore(STORE).get(KEY));
        if (text === undefined || text === null) {
          known = migrateProgress(null);
          return null;
        }
        let raw: unknown;
        try {
          raw = JSON.parse(text as string);
        } catch {
          // Den kaputten Text sichern; ein Fehler dabei darf das Lesen nicht verhindern.
          await anfrage(db.transaction(STORE, 'readwrite').objectStore(STORE).put(text, KEY_DEFEKT)).catch(() => undefined);
          known = migrateProgress(null);
          return null;
        }
        known = migrateProgress(raw);
        return raw;
      } catch {
        return null;
      }
    },
    save: (body) => schreibe(body, false),
    replace: (body) => schreibe(body, true),
    async uebernehme(text) {
      try {
        return await laufe(
          'readwrite',
          (store, vorhanden) => {
            if (vorhanden !== null) return 'vorhanden' as const;
            store.put(text, KEY);
            return 'uebernommen' as const;
          },
          (ergebnis) => {
            if (ergebnis === 'uebernommen') melde();
          },
        );
      } catch (e) {
        throw alsSpeicherFehler(e);
      }
    },
    watch(onChange) {
      if (!kanal) return () => {};
      const vorher = kanal.onmessage;
      const listener = () => onChange();
      // Mehrere Zuhörer: addEventListener, wenn der Kanal es kann (BroadcastChannel kann es).
      const ziel = kanal as unknown as EventTarget;
      if (typeof ziel.addEventListener === 'function') {
        ziel.addEventListener('message', listener);
        return () => ziel.removeEventListener('message', listener);
      }
      kanal.onmessage = listener;
      return () => {
        kanal.onmessage = vorher;
      };
    },
    close() {
      try {
        kanal?.close();
      } catch {
        /* egal */
      }
      db.close();
    },
  };
}
