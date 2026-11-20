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

/** So lange ohne Bedienung (Navigation, Antippen, Taste) gilt die Seite als ruhig. */
export const RUHE_MS = 4000;
/** Längstens so lange wird auf Ruhe gewartet; danach wird trotzdem registriert. */
export const WARTEN_HOECHSTENS_MS = 60 * 1000;

/**
 * Wartet, bis der Nutzer kurz nichts bedient hat. Beim allerersten Besuch lädt der Service Worker rund 3 MB vor (der Vorabspeicher für
 * den Offline-Betrieb), und das bremst auf einem langsamen Netz jede Seite, die der Nutzer in dieser Zeit öffnet. Wer gerade klickt,
 * wartet deshalb nicht auch noch darauf; gelesen wird beim Lesen vorab gespeichert.
 */
export function wartebisRuhig(ruheMs = RUHE_MS, hoechstens = WARTEN_HOECHSTENS_MS): Promise<void> {
  return new Promise((fertig) => {
    const start = Date.now();
    let zuletzt = start;
    const bump = () => (zuletzt = Date.now());
    const ereignisse = ['hashchange', 'pointerdown', 'keydown'] as const;
    for (const e of ereignisse) window.addEventListener(e, bump, { passive: true });
    const timer = setInterval(() => {
      const jetzt = Date.now();
      if (jetzt - zuletzt >= ruheMs || jetzt - start >= hoechstens) {
        clearInterval(timer);
        for (const e of ereignisse) window.removeEventListener(e, bump);
        fertig();
      }
    }, 500);
  });
}

export async function registriereServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    // Wer die App schon hatte, registriert sofort (nichts Großes zu laden, die Update-Prüfung soll früh laufen). Der erste Besuch wartet auf Ruhe.
    const vorhanden = await navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL);
    if (!vorhanden) await wartebisRuhig();
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
