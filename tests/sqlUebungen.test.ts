import { describe, expect, it } from 'vitest';
import { parseSqlUebungen, verknuepfeSqlUebungen } from '../shared/sqlUebungen';
import type { Flashcard, Task } from '../shared/types';

const topics = new Map([
  ['01', 'SQL'],
  ['09', 'Datenqualität'],
]);

const dataset = { id: 'mini', titel: 'Mini', quelle: 'Deep Dive 1', setup: 'CREATE TABLE t (x INTEGER);' };
const exercise = (over: Record<string, unknown> = {}) => ({
  id: 'SQL-T-001',
  datensatz: 'mini',
  thema: 'Deep Dive 9',
  titel: 'Alles aus t',
  aufgabe: 'Gib x aus.',
  schwierigkeit: 1,
  tags: ['select'],
  loesung: 'SELECT x FROM t;',
  hinweise: ['Eine Tabelle reicht.'],
  quelle_aufgabe: 'Test A1',
  ...over,
});
const file = (uebungen: unknown[], datensaetze: unknown[] = [dataset]) => JSON.stringify({ meta: {}, datensaetze, uebungen });

describe('parseSqlUebungen', () => {
  it('liest gültige Datensätze und Übungen und ordnet Deep Dives zu', () => {
    const r = parseSqlUebungen(
      'AP2_SQL_Uebungen.json',
      file([
        exercise(),
        exercise({
          id: 'SQL-T-002',
          thema: 'Deep Dive 1',
          schwierigkeit: 3,
          vergleich: { reihenfolge: 'streng', spaltennamen: ['x'], toleranz: 0.01 },
          pruefabfrage: 'SELECT COUNT(*) FROM t;',
          leerErlaubt: true,
          erklaerung: 'Weil.',
        }),
      ]),
      topics,
    );
    expect(r.issues).toEqual([]);
    expect(r.datasets).toEqual([{ ...dataset, beschreibung: undefined, variante: undefined, topicId: '01' }]);
    expect(r.exercises).toHaveLength(2);
    expect(r.exercises[0]).toMatchObject({
      id: 'SQL-T-001',
      topicId: '09',
      vergleich: { reihenfolge: 'auto' },
      quelleAufgabe: 'Test A1',
      hinweise: ['Eine Tabelle reicht.'],
    });
    expect(r.exercises[0].leerErlaubt).toBeUndefined();
    expect(r.exercises[0].pruefabfrage).toBeUndefined();
    expect(r.exercises[1]).toMatchObject({
      topicId: '01',
      schwierigkeit: 3,
      vergleich: { reihenfolge: 'streng', spaltennamen: ['x'], toleranz: 0.01 },
      pruefabfrage: 'SELECT COUNT(*) FROM t;',
      leerErlaubt: true,
      erklaerung: 'Weil.',
    });
  });

  it('überspringt ungültige Übungen mit Hinweis', () => {
    const r = parseSqlUebungen(
      'x.json',
      file([
        exercise({ schwierigkeit: 5 }),
        exercise({ id: 'SQL-T-002', loesung: '   ' }),
        exercise({ id: 'SQL-T-003', vergleich: { reihenfolge: 'manchmal' } }),
        'kein Objekt',
        exercise({ id: 'SQL-T-004' }),
      ]),
    );
    expect(r.exercises.map((e) => e.id)).toEqual(['SQL-T-004']);
    expect(r.issues).toHaveLength(4);
    expect(r.issues[0]).toEqual({ file: 'x.json', message: expect.stringMatching(/^Übung SQL-T-001 übersprungen \(schwierigkeit/) });
    expect(r.issues[1].message).toMatch(/SQL-T-002.*loesung/);
    expect(r.issues[2].message).toMatch(/SQL-T-003.*vergleich\.reihenfolge/);
    expect(r.issues[3].message).toMatch(/^Übung \? übersprungen/);
  });

  it('meldet doppelte IDs und behält die erste', () => {
    const r = parseSqlUebungen('x.json', file([exercise(), exercise({ titel: 'Zweite' })], [dataset, { ...dataset, titel: 'Doppelt' }]));
    expect(r.exercises).toHaveLength(1);
    expect(r.exercises[0].titel).toBe('Alles aus t');
    expect(r.datasets).toHaveLength(1);
    expect(r.issues.map((i) => i.message)).toEqual([
      'Doppelte Datensatz-ID mini übersprungen.',
      'Doppelte Übungs-ID SQL-T-001 übersprungen.',
    ]);
  });

  it('meldet unbekannte Datensätze', () => {
    const r = parseSqlUebungen('x.json', file([exercise({ datensatz: 'gibtsnicht' })]));
    expect(r.exercises).toEqual([]);
    expect(r.issues.map((i) => i.message)).toEqual(['Übung SQL-T-001: unbekannter Datensatz „gibtsnicht" – übersprungen.']);
  });

  it('überspringt Datensätze ohne Setup – deren Übungen gelten dann als unbekannt', () => {
    const r = parseSqlUebungen('x.json', file([exercise()], [{ ...dataset, setup: '' }]));
    expect(r.datasets).toEqual([]);
    expect(r.exercises).toEqual([]);
    expect(r.issues).toHaveLength(2);
    expect(r.issues[0].message).toMatch(/^Datensatz mini übersprungen \(setup/);
  });

  it('meldet kaputtes JSON und fehlende Felder, ohne zu werfen', () => {
    expect(parseSqlUebungen('x.json', '{').issues[0].message).toMatch(/^Ungültiges JSON/);
    expect(parseSqlUebungen('x.json', '{}').issues).toEqual([{ file: 'x.json', message: 'Kein Feld „datensaetze" gefunden.' }]);
    const ohneUebungen = parseSqlUebungen('x.json', JSON.stringify({ datensaetze: [dataset] }));
    expect(ohneUebungen.datasets).toHaveLength(1);
    expect(ohneUebungen.issues.map((i) => i.message)).toEqual(['Kein Feld „uebungen" gefunden.']);
  });

  it('ohne Deep Dive in der Quelle bleibt topicId leer', () => {
    const r = parseSqlUebungen(
      'x.json',
      file([exercise({ thema: 'Zusatzmaterial' })], [{ ...dataset, quelle: 'Deep_Dive_SQL_KW28_29' }]),
      topics,
    );
    expect(r.datasets[0].topicId).toBeUndefined();
    expect(r.exercises[0].topicId).toBeUndefined();
  });
});

describe('verknuepfeSqlUebungen (Felder „aufgaben“ und „karten“)', () => {
  const parse = (over: Record<string, unknown>) => parseSqlUebungen('AP2_SQL_Uebungen.json', file([exercise(over)]), topics);

  it('liest aufgaben, karten, teilaufgabe und spalten_frei', () => {
    const r = parse({ aufgaben: ['01-B1'], karten: ['SQL-011'], teilaufgabe: true, spalten_frei: true });
    expect(r.issues).toEqual([]);
    expect(r.exercises[0]).toMatchObject({ aufgaben: ['01-B1'], karten: ['SQL-011'], teilaufgabe: true, spaltenFrei: true });
    const ohne = parse({});
    expect(ohne.exercises[0]).not.toHaveProperty('aufgaben');
    expect(ohne.exercises[0]).not.toHaveProperty('karten');
    expect(ohne.exercises[0]).not.toHaveProperty('spaltenFrei');
  });

  it('meldet teilaufgabe/spalten_frei ohne aufgaben', () => {
    expect(parse({ spalten_frei: true }).issues.map((i) => i.message)).toEqual([expect.stringMatching(/nur mit „aufgaben“/)]);
  });

  it('setzt Task.sqlUebung und Flashcard.sqlUebungen, unbekannte und doppelte ids werden gemeldet', () => {
    const tasks: Record<string, Task> = {
      '01-B1': { id: '01-B1', code: 'B1', topicId: '01', block: 'B', points: 5, markdown: '…', type: 'offen' },
    };
    const flashcards: Flashcard[] = [{ id: 'SQL-011', kind: 'lernkarte', question: '?' }];
    const ex = (id: string, aufgaben: string[], karten: string[]) => ({ ...parse({ id, aufgaben, karten }).exercises[0] });
    const sqlExercises = [ex('SQL-T-001', ['01-B1', '99-X'], ['SQL-011', 'NIX']), ex('SQL-T-002', ['01-B1'], ['SQL-011'])];
    const issues = verknuepfeSqlUebungen({ tasks, flashcards, sqlExercises }, 'AP2_SQL_Uebungen.json').map((i) => i.message);
    expect(tasks['01-B1'].sqlUebung).toBe('SQL-T-001');
    expect(flashcards[0].sqlUebungen).toEqual(['SQL-T-001', 'SQL-T-002']);
    expect(issues).toEqual([
      'Übung SQL-T-001: unbekannte Aufgabe „99-X“ in „aufgaben“.',
      'Übung SQL-T-001: unbekannte Karte „NIX“ in „karten“.',
      'Übung SQL-T-002: Aufgabe 01-B1 ist schon mit SQL-T-001 verknüpft.',
    ]);
  });
});
