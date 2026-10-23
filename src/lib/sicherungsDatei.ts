// „In feste Sicherungsdatei speichern“ (File System Access API, nur Chromium-Browser): Die Datei wird einmal gewählt (z. B. in OneDrive
// oder auf einem USB-Stick); ihr Handle liegt im IndexedDB. Jeder weitere Klick überschreibt sie – ohne neuen Download-Dialog.
// Der Browser fragt nach einem Neustart einmal erneut nach der Schreibberechtigung (muss eine Nutzeraktion sein, deshalb kein Hintergrund-Speichern).

const DB = 'ap2-sicherungsdatei';
const STORE = 'handle';
const KEY = 'datei';

type DateiHandle = {
  name: string;
  createWritable: () => Promise<{ write: (d: string) => Promise<void>; close: () => Promise<void> }>;
  queryPermission?: (o: { mode: 'readwrite' }) => Promise<PermissionState>;
  requestPermission?: (o: { mode: 'readwrite' }) => Promise<PermissionState>;
};

type Picker = (o: { suggestedName: string; types: { description: string; accept: Record<string, string[]> }[] }) => Promise<DateiHandle>;

export const unterstuetzt = () => typeof window !== 'undefined' && 'showSaveFilePicker' in window && typeof indexedDB !== 'undefined';

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

async function lies(): Promise<DateiHandle | undefined> {
  const d = await db();
  return new Promise((resolve) => {
    const r = d.transaction(STORE).objectStore(STORE).get(KEY);
    r.onsuccess = () => resolve(r.result as DateiHandle | undefined);
    r.onerror = () => resolve(undefined);
  });
}

async function merke(h: DateiHandle | undefined): Promise<void> {
  const d = await db();
  await new Promise<void>((resolve) => {
    const t = d.transaction(STORE, 'readwrite');
    if (h) t.objectStore(STORE).put(h, KEY);
    else t.objectStore(STORE).delete(KEY);
    t.oncomplete = () => resolve();
    t.onerror = () => resolve();
  });
}

/** Name der gemerkten Sicherungsdatei, falls vorhanden. */
export async function gemerkteDatei(): Promise<string | undefined> {
  try {
    return (await lies())?.name;
  } catch {
    return undefined;
  }
}

/**
 * Schreibt `text` in die gemerkte Datei (bei `neu` oder ohne gemerkte Datei nach Auswahl). Liefert den Dateinamen,
 * `undefined` bei Abbruch; wirft bei Schreibfehlern.
 */
export async function schreibeSicherung(text: string, vorschlag: string, neu = false): Promise<string | undefined> {
  let h = neu ? undefined : await lies().catch(() => undefined);
  if (
    h &&
    (await h.queryPermission?.({ mode: 'readwrite' })) !== 'granted' &&
    (await h.requestPermission?.({ mode: 'readwrite' })) !== 'granted'
  )
    h = undefined;
  if (!h) {
    try {
      h = await (window as unknown as { showSaveFilePicker: Picker }).showSaveFilePicker({
        suggestedName: vorschlag,
        types: [{ description: 'Sicherung (JSON)', accept: { 'application/json': ['.json'] } }],
      });
    } catch {
      return undefined; // Auswahl abgebrochen
    }
    await merke(h).catch(() => {});
  }
  const w = await h.createWritable();
  await w.write(text);
  await w.close();
  return h.name;
}
