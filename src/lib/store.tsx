import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { KernInhalt } from '../../shared/texte';
import { api } from './api';
import { createProgressSaver, type SaveState } from './progressSaver';
import { emptyProgress, migrateProgress, type Progress } from '../../shared/progress';

interface Store {
  /** Ohne Abschnittstexte – die brauchen nur wenige Seiten, sie holen sie mit useThemaTexte/useVollerInhalt (lib/texte.ts). */
  content: KernInhalt;
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  replaceProgress: (p: Progress) => void;
  /** Erster Besuch: noch kein gespeicherter Fortschritt (bis zur ersten Änderung) – dann zeigt die Übersicht die Willkommensseite. */
  firstVisit: boolean;
}

interface SpeicherStand {
  saveState: SaveState;
  /** Meldung, wenn das Speichern abgelehnt wurde. */
  saveError: string | null;
}

const StoreContext = createContext<Store | null>(null);
// Eigener Kontext (Umsetzungsplan Phase 10): Jedes Speichern wechselt den Stand zweimal (speichert → gespeichert). Steckte er im
// Store, würde dabei jedes Mal die ganze Seite neu rendern – so nur die Kopfleiste und der Fehlerhinweis.
const SpeicherContext = createContext<SpeicherStand>({ saveState: 'gespeichert', saveError: null });

export function useStore(): Store {
  const s = useContext(StoreContext);
  if (!s) throw new Error('useStore außerhalb des StoreProvider');
  return s;
}

/** Speicherstand für Kopfleiste und Fehlerhinweis. */
export const useSpeicherStand = () => useContext(SpeicherContext);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<KernInhalt | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('gespeichert');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [firstVisit, setFirstVisit] = useState(false);
  // Immer der neueste Stand – auch wenn mehrere update()-Aufrufe vor dem nächsten Rendern kommen.
  const progressRef = useRef<Progress | null>(null);
  const [saver] = useState(() =>
    createProgressSaver({
      send: api.saveProgress,
      onState: (state, err) => {
        setSaveState(state);
        if (err !== undefined) setSaveError(err);
      },
    }),
  );

  useEffect(() => {
    Promise.all([api.content(), api.progress()])
      .then(([c, p]) => {
        setContent(c);
        setFirstVisit(p === null || p === undefined);
        progressRef.current = migrateProgress(p);
        saver.setBaseRevision(progressRef.current.revision);
        setProgress(progressRef.current);
      })
      .catch((e: Error) => setError(e.message));
  }, [saver]);

  // Beim Schließen des Tabs noch nicht bestätigte Änderungen senden.
  useEffect(() => {
    const flush = () => {
      const body = saver.flushBody();
      if (body !== undefined) api.saveProgressOnUnload(body);
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [saver]);

  // Hat ein anderer Tab gespeichert, ist dieser veraltet – gleich den Hinweis „anderer Tab“ zeigen.
  useEffect(() => api.watchOtherTabs(() => saver.markConflict()), [saver]);

  // Den neuen Stand außerhalb des State-Updaters berechnen und speichern – Updater müssen rein sein (StrictMode ruft sie doppelt auf).
  const commit = useCallback(
    (next: Progress, reset = false) => {
      progressRef.current = next;
      setProgress(next);
      setFirstVisit(false);
      saver.schedule(next, reset);
    },
    [saver],
  );

  const update = useCallback((fn: (p: Progress) => Progress) => commit(fn(progressRef.current ?? emptyProgress())), [commit]);

  const replaceProgress = useCallback((p: Progress) => commit(migrateProgress(p), true), [commit]);

  // Gleiches Objekt, solange sich nichts ändert – sonst rendert jeder useStore()-Nutzer bei jedem Rendern des Providers neu.
  const store = useMemo(
    () => ({
      content: content!,
      progress: progress!,
      update,
      replaceProgress,
      firstVisit,
    }),
    [content, progress, update, replaceProgress, firstVisit],
  );
  const speicher = useMemo(() => ({ saveState, saveError }), [saveState, saveError]);

  if (error) {
    return (
      <div className="page">
        <h1>Fehler beim Laden</h1>
        <p className="error">{error}</p>
        <p>Prüf deine Internetverbindung und lade die Seite neu.</p>
      </div>
    );
  }
  if (!content || !progress) return <div className="page loading">Lade Lernblätter …</div>;

  return (
    <StoreContext.Provider value={store}>
      <SpeicherContext.Provider value={speicher}>{children}</SpeicherContext.Provider>
    </StoreContext.Provider>
  );
}
