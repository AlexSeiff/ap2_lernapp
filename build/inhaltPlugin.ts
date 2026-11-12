// Vite-Plugin: stellt die geparsten Lernblätter aus content/ als JSON-Dateien neben die App.
// Im Build werden sie nach dist/ geschrieben, im Entwicklungsserver (`npm run dev`) aus dem Speicher ausgeliefert und nach jeder
// Änderung an einem Lernblatt neu gebaut. Welche Dateien es gibt, steht an einer Stelle: inhaltDateien().

import type { Plugin } from 'vite';
import { teileInhalt } from '../shared/texte.ts';
import type { ImportIssue } from '../shared/types.ts';
import { CONTENT_DIR, isContentSource, ladeInhalt } from './inhalt.ts';

export interface InhaltDateien {
  /** Dateiname relativ zur App (z. B. `content.json`, `texte/03.json`) → JSON-Text. */
  dateien: Map<string, string>;
  themen: number;
  issues: ImportIssue[];
}

/** Liest content/ und teilt den Inhalt in die Dateien, die die App lädt. */
export function inhaltDateien(dir = CONTENT_DIR): InhaltDateien {
  const { content, seiten } = ladeInhalt(dir);
  const dateien = new Map<string, string>();
  // Start ohne Texte: Die App zeigt die Übersicht, sobald er da ist. Karten- und Aufgabentexte (details.json) und die
  // Abschnittstexte je Thema lädt sie nach.
  const { kern, details, texte } = teileInhalt(content);
  dateien.set('content.json', JSON.stringify(kern));
  dateien.set('details.json', JSON.stringify(details));
  for (const [id, t] of Object.entries(texte)) dateien.set(`texte/${id}.json`, JSON.stringify(t));
  // Begriffsseiten getrennt (etwa 1,6 MB): Die App lädt sie erst, wenn eine Begriffsseite oder die Suche sie braucht.
  dateien.set('begriffe.json', JSON.stringify(seiten));
  return { dateien, themen: content.topics.length, issues: content.issues };
}

export function contentJsonPlugin(): Plugin {
  let cache: InhaltDateien | undefined;
  return {
    name: 'ap2-content-json',
    generateBundle() {
      const { dateien, themen, issues } = inhaltDateien();
      if (themen === 0) this.error(`Keine Lernblätter in ${CONTENT_DIR}.`);
      // Ein fehlerhafter Eintrag (fehlendes Pflichtfeld, doppelte ID, toter Verweis) darf nicht veröffentlicht werden.
      if (issues.length)
        this.error(
          `Die Lernblätter haben ${issues.length} Importhinweis(e) – \`npm run import-report\` zeigt alle:\n` +
            issues
              .slice(0, 10)
              .map((i) => `  - ${i.file}: ${i.message}`)
              .join('\n'),
        );
      for (const [fileName, source] of dateien) this.emitFile({ type: 'asset', fileName, source });
    },
    configureServer(server) {
      server.watcher.add(CONTENT_DIR);
      const geaendert = (file: string) => {
        if (!isContentSource(file)) return;
        cache = undefined;
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', geaendert).on('change', geaendert).on('unlink', geaendert);
      server.middlewares.use((req, res, next) => {
        const name = decodeURIComponent((req.url ?? '').split('?')[0]).replace(/^\//, '');
        if (!/^(?:[\w-]+\/)?[\w-]+\.json$/.test(name)) return next();
        let source: string | undefined;
        try {
          source = (cache ??= inhaltDateien()).dateien.get(name);
        } catch (e) {
          res.statusCode = 500;
          return res.end(`Lernblätter konnten nicht gelesen werden: ${(e as Error).message}`);
        }
        if (source === undefined) return next();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(source);
      });
    },
    // content.json gleich mit dem HTML anfordern, parallel zum JavaScript – sonst beginnt der Download erst, wenn die App läuft.
    // crossorigin passt zu fetch() (mode cors, credentials same-origin), sonst lädt der Browser die Datei doppelt.
    transformIndexHtml: () => [
      { tag: 'link', attrs: { rel: 'preload', href: './content.json', as: 'fetch', crossorigin: '' }, injectTo: 'head' },
    ],
  };
}
