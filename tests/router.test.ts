import { describe, expect, it } from 'vitest';
import { pruefeHerkunft, defineRoute, HttpError, matchRoute, parseBody, type Route } from '../server/router';
import { GenerateRequestSchema, GradeRequestSchema } from '../shared/api';

const handler = () => null;
const routes: Route[] = [
  { method: 'GET', path: '/api/progress', handler },
  { method: 'GET', path: '/api/progress/backups', handler },
  { method: 'PUT', path: '/api/progress', handler },
  { method: 'DELETE', path: /^\/api\/generated\/(.+)$/, handler },
];

describe('matchRoute', () => {
  it('unterscheidet Methode und exakten Pfad', () => {
    expect(matchRoute(routes, 'GET', '/api/progress')?.route).toBe(routes[0]);
    expect(matchRoute(routes, 'PUT', '/api/progress')?.route).toBe(routes[2]);
    expect(matchRoute(routes, 'GET', '/api/progress/backups')?.route).toBe(routes[1]);
    expect(matchRoute(routes, 'POST', '/api/progress')).toBeUndefined();
    expect(matchRoute(routes, 'GET', '/api/progress/')).toBeUndefined();
    expect(matchRoute(routes, 'GET', '/api/unbekannt')).toBeUndefined();
  });

  it('liefert Parameter aus regulären Ausdrücken URL-dekodiert', () => {
    const m = matchRoute(routes, 'DELETE', `/api/generated/${encodeURIComponent('gen-01-abc 1/2')}`);
    expect(m?.route).toBe(routes[3]);
    expect(m?.params).toEqual(['gen-01-abc 1/2']);
    expect(matchRoute(routes, 'DELETE', '/api/generated/')).toBeUndefined();
    expect(matchRoute(routes, 'GET', '/api/generated/x')).toBeUndefined();
  });
});

describe('defineRoute', () => {
  it('liest Methode und Pfad aus dem Schlüssel, Muster ersetzt Pfade mit Parametern', () => {
    expect(defineRoute('GET /api/progress/backups', () => ({ newest: null, count: 0 }))).toMatchObject({
      method: 'GET',
      path: '/api/progress/backups',
    });
    const del = defineRoute('DELETE /api/generated/:id', () => ({ ok: true as const }), /^\/api\/generated\/(.+)$/);
    expect(matchRoute([del], 'DELETE', '/api/generated/gen-1')?.params).toEqual(['gen-1']);
  });
});

function error(fn: () => unknown): HttpError {
  try {
    fn();
  } catch (e) {
    if (e instanceof HttpError) return e;
    throw e;
  }
  throw new Error('kein Fehler geworfen');
}

describe('Request-Schemas', () => {
  it('generate: gültige Anfrage, Vorgaben für count und types', () => {
    expect(parseBody(GenerateRequestSchema, { topicId: '03', count: 5, types: ['mc', 'rechnen'] })).toEqual({
      topicId: '03',
      count: 5,
      types: ['mc', 'rechnen'],
    });
    expect(parseBody(GenerateRequestSchema, { topicId: '03' })).toEqual({ topicId: '03', count: 3, types: [] });
  });

  it('generate: count nur 1–10, ganze Zahl', () => {
    for (const count of [0, 11, 2.5, '3', null]) {
      const e = error(() => parseBody(GenerateRequestSchema, { topicId: '03', count }));
      expect(e.status).toBe(400);
      expect(e.message).toMatch(/^Ungültige Anfrage – count: Anzahl/);
    }
    expect(parseBody(GenerateRequestSchema, { topicId: '03', count: 10 }).count).toBe(10);
    expect(parseBody(GenerateRequestSchema, { topicId: '03', count: 1 }).count).toBe(1);
  });

  it('generate: unbekannte Aufgabentypen und fehlendes Thema werden abgelehnt', () => {
    expect(error(() => parseBody(GenerateRequestSchema, { topicId: '03', types: ['essay'] })).message).toContain('Unbekannter Aufgabentyp');
    expect(error(() => parseBody(GenerateRequestSchema, { topicId: '03', types: 'mc' })).message).toContain('Liste');
    expect(error(() => parseBody(GenerateRequestSchema, { count: 3 })).message).toContain('topicId: Thema fehlt.');
    expect(error(() => parseBody(GenerateRequestSchema, { topicId: '' })).message).toContain('Thema fehlt.');
  });

  it('grade: Antwort ist optional (leer), taskId Pflicht', () => {
    expect(parseBody(GradeRequestSchema, { taskId: '01-A1' })).toEqual({ taskId: '01-A1', answer: '' });
    expect(parseBody(GradeRequestSchema, { taskId: '01-A1', answer: 'SELECT 1' })).toEqual({ taskId: '01-A1', answer: 'SELECT 1' });
    expect(error(() => parseBody(GradeRequestSchema, { answer: 'x' })).message).toContain('taskId: Aufgabe fehlt.');
    expect(error(() => parseBody(GradeRequestSchema, { taskId: '01-A1', answer: 42 })).message).toContain(
      'answer: Antwort muss Text sein.',
    );
  });

  it('kein JSON-Objekt → deutsche Meldung', () => {
    for (const body of [null, [], 'text']) {
      expect(error(() => parseBody(GradeRequestSchema, body)).message).toBe('Ungültige Anfrage – Die Anfrage muss ein JSON-Objekt sein.');
    }
  });
});

it('schützt schreibende lokale Routen vor fremden Browser-Ursprüngen', () => {
  const host = 'localhost:5178';
  for (const methode of ['POST', 'PUT', 'DELETE']) {
    for (const origin of ['http://example.invalid', 'http://localhost:9000', 'https://localhost:5178', 'null']) {
      expect(() => pruefeHerkunft(methode, origin, host, false)).toThrow(expect.objectContaining({ status: 403 }));
    }
    expect(() => pruefeHerkunft(methode, 'http://localhost:5178', host, false)).not.toThrow();
    expect(() => pruefeHerkunft(methode, 'https://localhost:5178', host, true)).not.toThrow();
    expect(() => pruefeHerkunft(methode, undefined, host, false)).not.toThrow();
  }
});
