// Inhalte aus JSON-Dateien, Fortschritt im Browser.

import type { Progress } from '../../domain/progress';
import type { Details, StartInhalt, ThemaTexte } from '../../domain/texte';
import type { BegriffsSeite } from '../../domain/types';
import { createBrowserBackups, openIndexedDbBackups, type BrowserBackups } from './browserBackups';
import { createAutoProgressStore, type FortschrittsSpeicher } from './fortschrittSpeicher';
import { createPersistRequest } from './persistentStorage';
import { localDate } from './progress';
import { PROGRESS_KEY } from './localFortschritt';

// Weiter von hier erreichbar (Tests und ältere Importe).
export { BROKEN_KEY, createLocalProgressStore, PROGRESS_KEY } from './localFortschritt';

export function createStaticApi(
  store: FortschrittsSpeicher & { watch?: (onChange: () => void) => () => void } = createAutoProgressStore(),
  requestPersist: () => Promise<unknown> = createPersistRequest(),
  backups: BrowserBackups = createBrowserBackups(() => openIndexedDbBackups()),
) {
  const persist = async (p: Progress, write: (p: Progress) => Promise<void> | void) => {
    const before = await store.readText();
    await write(p);
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
      if (store.watch) return store.watch(onChange);
      // Das storage-Ereignis kommt nur in den anderen Tabs an – dieser Tab ist dann veraltet.
      const listener = (e: StorageEvent) => {
        if (e.key === PROGRESS_KEY) onChange();
      };
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
  };
}
