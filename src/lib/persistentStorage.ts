// Dauerhafter Speicher: navigator.storage.persist() bittet den Browser, localStorage und IndexedDB
// dieser Seite nicht von selbst zu löschen (Safari/iOS löscht sonst nach etwa 7 Tagen ohne Besuch).
// Die Storage-API ist injizierbar, damit Tests ohne Browser laufen. Fehlt sie oder wirft sie, passiert einfach nichts.

/** Der Teil von navigator.storage, den die App nutzt. */
export type StorageManagerLike = {
  persist?: () => Promise<boolean>;
  persisted?: () => Promise<boolean>;
};

/** navigator.storage oder undefined (älterer Browser, Tests in Node). */
export const browserStorageManager = (): StorageManagerLike | undefined =>
  typeof navigator === 'undefined' ? undefined : (navigator.storage as StorageManagerLike | undefined);

/** Ist der Speicher dauerhaft? undefined = nicht feststellbar (API fehlt oder Fehler). */
export async function isStoragePersisted(manager = browserStorageManager()): Promise<boolean | undefined> {
  try {
    if (!manager?.persisted) return undefined;
    return await manager.persisted();
  } catch {
    return undefined;
  }
}

/**
 * Liefert eine Funktion, die höchstens einmal (pro Seitenaufruf) um dauerhaften Speicher bittet – gedacht für nach dem ersten Speichern.
 * Ist der Speicher schon dauerhaft, wird nicht noch einmal gefragt. Ergebnis: true/false oder undefined (nicht unterstützt, schon gefragt).
 */
export function createPersistRequest(getManager: () => StorageManagerLike | undefined = browserStorageManager) {
  let requested = false;
  return async (): Promise<boolean | undefined> => {
    if (requested) return undefined;
    requested = true;
    try {
      const manager = getManager();
      if (!manager?.persist) return undefined;
      if (await manager.persisted?.()) return true;
      return await manager.persist();
    } catch {
      return undefined;
    }
  };
}
