// Service Worker (Roadmap 7.1): registrieren und melden, wenn eine neue Version wartet.
// Wird nur im gebauten Stand registriert (main.tsx); der Entwicklungsserver hat keinen Service Worker.
// Der neue Service Worker übernimmt erst, wenn du „Neu laden“ klickst – mitten in einer Klausur lädt nichts von selbst neu.

type Listener = () => void;

/** Zustand für den Update-Hinweis; als kleiner Store für useSyncExternalStore. */
export function createUpdateState() {
  let wartet = false;
  const listeners = new Set<Listener>();
  return {
    subscribe(l: Listener) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    get: () => wartet,
    set(v: boolean) {
      if (v === wartet) return;
      wartet = v;
      listeners.forEach((l) => l());
    },
  };
}

export const updateState = createUpdateState();

let neuLaden: () => void = () => window.location.reload();

/** Neue Version aktivieren und die Seite neu laden (Button im Update-Hinweis). */
export function aktualisieren() {
  neuLaden();
}

/** Wie oft eine offene App nach einer neuen Version fragt (der HashRouter navigiert nie, sonst prüft der Browser selbst). */
const PRUEF_INTERVALL_MS = 60 * 60 * 1000;

export async function registriereServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const { Workbox } = await import('workbox-window');
    const wb = new Workbox(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL });
    // Auch beim Start gemeldet, wenn schon eine neue Version aus einem früheren Besuch wartet.
    wb.addEventListener('waiting', () => updateState.set(true));
    neuLaden = () => {
      wb.addEventListener('controlling', () => window.location.reload());
      wb.messageSkipWaiting();
      // Falls kein Service Worker wartet (oder „controlling“ ausbleibt), trotzdem neu laden.
      setTimeout(() => window.location.reload(), 3000);
    };
    const reg = await wb.register();
    if (!reg) return;
    let zuletzt = Date.now();
    const pruefen = () => {
      // Beim Zurückkehren in den Tab höchstens alle 10 Minuten nachfragen.
      if (navigator.onLine === false || Date.now() - zuletzt < 10 * 60 * 1000) return;
      zuletzt = Date.now();
      reg.update().catch(() => {});
    };
    setInterval(pruefen, PRUEF_INTERVALL_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') pruefen();
    });
  } catch {
    // Ohne Service Worker (z. B. privates Fenster, blockiert) läuft die App wie bisher online.
  }
}
