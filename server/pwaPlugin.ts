// PWA für `npm run build:pages` (Roadmap 7.1): Manifest + Service Worker (Workbox, generateSW), nur in der Pages-Version.
// Die lokale App (dev/preview/build) bekommt keinen Service Worker – dort wäre veralteter Code im Cache nur hinderlich.
//
// Vorab gespeichert (precache) wird alles, was die App offline braucht: App-Shell (index.html, JS, CSS), content.json,
// die Lazy-Chunks (SQL, Rechnen, KaTeX), sql-wasm.wasm, die KaTeX-Schriften (woff2), Manifest und Icons.
// Jede Datei hat im sw.js eine Revision (Hash). Ändert sich etwas – auch nur content.json –, ändert sich sw.js, der Browser
// installiert den neuen Service Worker, und die App zeigt „Neue Version verfügbar – neu laden“ (registerType 'prompt',
// Registrierung und Hinweis selbst gebaut in src/lib/pwa.ts + components/UpdateHinweis.tsx).
// Alle Pfade relativ (base './'), damit es unter https://alexseiff.github.io/ap2_lernapp/ funktioniert.

import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa';

export const PWA_OPTIONS = {
  registerType: 'prompt',
  // Registriert wird in src/lib/pwa.ts (workbox-window), nicht per eingefügtem Skript.
  injectRegister: false,
  // Manifest-Icons und Manifest nimmt das Plugin selbst in den Precache, dazu das Icon für iOS.
  includeAssets: ['icons/apple-touch-icon.png'],
  manifest: {
    id: './',
    name: 'AP2 Lern-App',
    short_name: 'AP2 Lernen',
    description: 'Lern-App für die IHK-Abschlussprüfung Teil 2 – Fachinformatiker/-in Daten- und Prozessanalyse.',
    lang: 'de',
    start_url: './',
    scope: './',
    display: 'standalone',
    background_color: '#f2f2f7',
    theme_color: '#f2f2f7',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    // Nur woff2 der KaTeX-Schriften: jeder aktuelle Browser nimmt woff2, woff/ttf blieben ungenutzt im Cache.
    globPatterns: ['**/*.{html,js,css,json,wasm,woff2}'],
    // Spielraum über der Workbox-Grenze von 2 MiB pro Datei (heute: content.json ~ 0,9 MB, sql-wasm.wasm ~ 0,7 MB, größter Chunk ~ 0,5 MB).
    maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
    // HashRouter: jede Navigation ist index.html; offline kommt sie aus dem Cache.
    navigateFallback: 'index.html',
    cleanupOutdatedCaches: true,
    // Kein skipWaiting/clientsClaim: der neue Service Worker übernimmt erst nach „Neu laden“ (oder wenn alle Tabs zu sind).
  },
} satisfies Partial<VitePWAOptions>;

export function pwaPlugin() {
  return VitePWA(PWA_OPTIONS);
}
