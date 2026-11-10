// Vite-Plugin: stellt die lokale API unter /api bereit (Inhalte, Fortschritt, KI).
// So startet die gesamte App mit einem einzigen `npm run dev` – oder gebaut mit `npm start` (vite preview).

import { watch } from 'node:fs';
import { TLSSocket } from 'node:tls';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { GenerateRequestSchema, GradeRequestSchema, type ErrorResponse } from '../shared/api';
import { checkProgressPut } from '../shared/progress';
import { teileInhalt } from '../shared/texte';
import type { Content } from '../shared/types';
import { aiEnabled, generateTasks, gradeAnswer, MODEL } from './ai';
import { createContentCache, withGenerated } from './contentCache';
import { isContentSource, ladeInhalt, SOURCE_DIR } from './loadContent';
import { defineRoute, HttpError, matchRoute, parseBody, pruefeHerkunft, readBody, send, type Route } from './router';
import { backupInfo, readGenerated, readProgress, writeGenerated, writeProgress } from './store';

// Mit Kern (ohne Abschnittstexte) und Texten je Thema, wie content.json und texte/<id>.json in der Pages-Version (shared/texte.ts).
const contentCache = createContentCache(() => {
  const inhalt = ladeInhalt();
  return { ...inhalt, ...teileInhalt(inhalt.content) };
});

/** Generierte Aufgaben werden bei jedem Request frisch aus data/ gelesen, nur die Lernblätter kommen aus dem Cache. */
function contentWithGenerated(): Content {
  return withGenerated(contentCache.get().content, readGenerated());
}

// Antworttypen je Route stehen in shared/api.ts (ApiResponses) und werden von defineRoute erzwungen.
const routes: Route[] = [
  defineRoute('GET /api/content', () => withGenerated(contentCache.get().kern, readGenerated())),
  defineRoute(
    'GET /api/texte/:id',
    ({ params: [id] }) => {
      const texte = contentCache.get().texte[id];
      if (!texte) throw new HttpError(404, 'Thema nicht gefunden.');
      return texte;
    },
    /^\/api\/texte\/(.+)$/,
  ),
  defineRoute('GET /api/begriffe', () => contentCache.get().seiten),
  defineRoute('GET /api/progress', () => readProgress()),
  defineRoute('GET /api/progress/backups', () => backupInfo()),
  defineRoute('PUT /api/progress', async ({ req }) => {
    // Nie ungeprüft schreiben: leere/kaputte Daten, ein versehentlich geleerter Stand oder ein veralteter Tab (409)
    // würden echten Fortschritt überschreiben. Lesen, Prüfen und Schreiben laufen synchron – also ohne Wettlauf zweier PUTs.
    const checked = checkProgressPut(await readBody(req), readProgress());
    if (!checked.ok) throw new HttpError(checked.status, checked.error);
    writeProgress(checked.progress);
    return { ok: true as const, revision: checked.progress.revision };
  }),
  defineRoute('GET /api/ai/status', () => ({ enabled: aiEnabled(), model: MODEL })),
  defineRoute('POST /api/ai/generate', async ({ req }) => {
    const { topicId, count, types } = parseBody(GenerateRequestSchema, await readBody(req));
    const tasks = await generateTasks(contentWithGenerated(), topicId, count, types);
    writeGenerated([...readGenerated(), ...tasks]);
    return tasks;
  }),
  defineRoute('POST /api/ai/grade', async ({ req }) => {
    const { taskId, answer } = parseBody(GradeRequestSchema, await readBody(req));
    const task = contentWithGenerated().tasks[taskId];
    if (!task) throw new HttpError(404, 'Aufgabe nicht gefunden.');
    return gradeAnswer(task, answer);
  }),
  defineRoute(
    'DELETE /api/generated/:id',
    ({ params: [id] }) => {
      writeGenerated(readGenerated().filter((t) => t.id !== id));
      return { ok: true as const };
    },
    /^\/api\/generated\/(.+)$/,
  ),
];

export function apiPlugin(): Plugin {
  return {
    name: 'ap2-api',
    configureServer(server) {
      // Lernblatt geändert, neu oder gelöscht → Cache leeren und Seite neu laden, Inhalte werden dabei neu importiert.
      server.watcher.add([join(SOURCE_DIR, '*.md'), join(SOURCE_DIR, '*Lernkarten*.json')]);
      const onSourceEvent = (file: string) => {
        if (!isContentSource(file)) return;
        contentCache.invalidate();
        server.ws.send({ type: 'full-reload' });
      };
      for (const event of ['change', 'add', 'unlink'] as const) server.watcher.on(event, onSourceEvent);

      server.middlewares.use(apiMiddleware);
    },
    configurePreviewServer(server) {
      // npm start / vite preview: gebaute App, aber dieselbe API mit denselben Daten (data/) und Lernblättern (AP-2) wie im
      // Dev-Server. Die Vorschau hat keinen Vite-Watcher: fs.watch leert nur den Cache, neu laden (F5) musst du selbst.
      try {
        const watcher = watch(SOURCE_DIR, (_event, name) => {
          if (name && isContentSource(join(SOURCE_DIR, name.toString()))) contentCache.invalidate();
        });
        server.httpServer.once('close', () => watcher.close());
      } catch (err) {
        // Ohne Watcher bleiben geänderte Lernblätter bis zum Neustart unsichtbar – kein Grund, nicht zu starten.
        console.warn(`Lernblätter werden nicht überwacht: ${err instanceof Error ? err.message : String(err)}`);
      }
      server.middlewares.use(apiMiddleware);
    },
  };
}

/** Middleware für /api/* – dieselbe für Dev-Server und Vorschau. */
async function apiMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (!url.pathname.startsWith('/api/')) return next();
  try {
    const match = matchRoute(routes, req.method ?? 'GET', url.pathname);
    if (!match) return send(res, 404, { error: `Unbekannte Route ${req.method} ${url.pathname}` } satisfies ErrorResponse);
    pruefeHerkunft(req.method, req.headers.origin, req.headers.host, req.socket instanceof TLSSocket && req.socket.encrypted);
    send(res, 200, await match.route.handler({ req, params: match.params }));
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof Error ? err.message : String(err);
    if (status === 500) console.error(err);
    send(res, status, { error: message } satisfies ErrorResponse);
  }
}
