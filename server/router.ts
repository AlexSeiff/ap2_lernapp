// Kleiner Router für die lokale API: Routentabelle, Request-Body lesen und mit zod prüfen.
// Bewusst ohne Abhängigkeit zum Claude-SDK, damit Tests ihn direkt nutzen können.

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { z } from 'zod';
import type { ApiResponses } from '../shared/api';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export interface RouteContext {
  req: IncomingMessage;
  /** Treffer der Klammergruppen, wenn der Pfad ein regulärer Ausdruck ist (bereits URL-dekodiert). */
  params: string[];
}

export interface Route {
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  /** Exakter Pfad oder regulärer Ausdruck für den ganzen Pfad (mit ^…$). */
  path: string | RegExp;
  /** Rückgabewert wird als JSON mit Status 200 gesendet; Fehler als HttpError werfen. */
  handler: (ctx: RouteContext) => unknown;
}

/**
 * Legt eine Route zu einem Eintrag aus ApiResponses an („GET /api/content“) – der Handler muss genau den
 * dort vereinbarten Antworttyp liefern. `pattern` ersetzt den Pfad für Routen mit Parametern (z. B. :id).
 */
export function defineRoute<K extends keyof ApiResponses>(
  key: K,
  handler: (ctx: RouteContext) => ApiResponses[K] | Promise<ApiResponses[K]>,
  pattern?: RegExp,
): Route {
  const [method, path] = key.split(' ') as [Route['method'], string];
  return { method, path: pattern ?? path, handler };
}

/** Sucht die passende Route; rein, damit testbar. */
export function matchRoute(routes: readonly Route[], method: string, pathname: string): { route: Route; params: string[] } | undefined {
  for (const route of routes) {
    if (route.method !== method) continue;
    if (typeof route.path === 'string') {
      if (route.path === pathname) return { route, params: [] };
      continue;
    }
    const m = route.path.exec(pathname);
    if (m) return { route, params: m.slice(1).map((p) => decodeURIComponent(p)) };
  }
  return undefined;
}

/** Browser senden bei schreibenden, ursprungsübergreifenden Requests den Origin-Header. */
export function pruefeHerkunft(method: string | undefined, origin: string | undefined, host: string | undefined, https: boolean) {
  if (method === 'GET' || origin === undefined) return;
  if (origin !== `${https ? 'https' : 'http'}://${host}`) throw new HttpError(403, 'Diese Anfrage stammt von einer anderen Website.');
}

export async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new HttpError(400, 'Ungültiges JSON im Request.');
  }
}

export function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

/** Prüft einen Request-Body; bei Fehlern HTTP 400 mit deutscher Meldung. */
export function parseBody<S extends z.ZodType>(schema: S, body: unknown): z.infer<S> {
  const parsed = schema.safeParse(body);
  if (parsed.success) return parsed.data;
  const details = parsed.error.issues
    .slice(0, 3)
    .map((i) => (i.path.length ? `${i.path.join('.')}: ${i.message}` : i.message))
    .join('; ');
  throw new HttpError(400, `Ungültige Anfrage – ${details}`);
}
