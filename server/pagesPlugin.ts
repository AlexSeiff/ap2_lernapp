// Vite-Plugin für `npm run build:pages`: legt die geparsten Lernblätter als content.json neben die App.
// Quelle ist content/ im Repository (npm run sync-content), nicht der Ordner AP-2 – so baut GitHub Actions dasselbe wie lokal.
// KI-Aufgaben aus data/ kommen bewusst nicht hinein (data/ ist privat).

import type { Plugin } from 'vite';
import { teileInhalt } from '../shared/texte.ts';
import { CONTENT_DIR, ladeInhalt } from './loadContent.ts';

export function contentJsonPlugin(): Plugin {
  return {
    name: 'ap2-content-json',
    apply: 'build',
    generateBundle() {
      const { content, seiten } = ladeInhalt(CONTENT_DIR);
      if (content.topics.length === 0) this.error(`Keine Lernblätter in ${CONTENT_DIR} – zuerst \`npm run sync-content\` ausführen.`);
      // Kern ohne Abschnittstexte (Umsetzungsplan Phase 10): Die App startet, sobald er da ist; die Texte je Thema lädt sie nach.
      const { kern, texte } = teileInhalt(content);
      this.emitFile({ type: 'asset', fileName: 'content.json', source: JSON.stringify(kern) });
      for (const [id, t] of Object.entries(texte))
        this.emitFile({ type: 'asset', fileName: `texte/${id}.json`, source: JSON.stringify(t) });
      // Begriffsseiten getrennt (etwa 1,6 MB): Die App lädt sie erst, wenn eine Begriffsseite oder die Suche sie braucht.
      this.emitFile({ type: 'asset', fileName: 'begriffe.json', source: JSON.stringify(seiten) });
    },
    // content.json gleich mit dem HTML anfordern, parallel zum JavaScript – sonst beginnt der Download erst, wenn die App läuft.
    // crossorigin passt zu fetch() (mode cors, credentials same-origin), sonst lädt der Browser die Datei doppelt.
    transformIndexHtml: () => [
      { tag: 'link', attrs: { rel: 'preload', href: './content.json', as: 'fetch', crossorigin: '' }, injectTo: 'head' },
    ],
  };
}
