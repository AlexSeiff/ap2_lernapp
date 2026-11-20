import { describe, expect, it } from 'vitest';
import { buildContent } from '../domain/parser';
import { parseRechenUebungen } from '../domain/rechenUebungen';

const topics = new Map([
  ['03', 'Statistik I'],
  ['07', 'Modellgüte'],
]);

const exercise = (over: Record<string, unknown> = {}) => ({
  id: 'RE-T-001',
  thema: 'Deep Dive 3',
  titel: 'Mittelwert',
  schwierigkeit: 1,
  tags: ['lagemaße'],
  vorlage: 'lagemasse',
  daten: { werte: [1, 2, 3] },
  aufgabe: 'Berechne den Mittelwert von {{werte}}.',
  eingaben: ['mittel', { id: 'median', label: 'Median', einheit: 'min', runden: 2 }],
  hinweise: ['Summe durch n.'],
  quelleAufgabe: 'DD3 C1',
  ...over,
});
const file = (uebungen: unknown[]) => JSON.stringify({ meta: { version: '1.0' }, uebungen });

describe('parseRechenUebungen', () => {
  it('liest Übungen mit Vorlage, normalisiert Eingaben und ordnet Deep Dives zu', () => {
    const r = parseRechenUebungen('AP2_Rechen_Uebungen.json', file([exercise()]), topics);
    expect(r.issues).toEqual([]);
    expect(r.exercises).toHaveLength(1);
    expect(r.exercises[0]).toMatchObject({
      id: 'RE-T-001',
      topicId: '03',
      vorlage: 'lagemasse',
      neueZahlen: true,
      daten: { werte: [1, 2, 3] },
      eingaben: [{ id: 'mittel' }, { id: 'median', label: 'Median', einheit: 'min', runden: 2 }],
      quelleAufgabe: 'DD3 C1',
    });
  });

  it('akzeptiert quelle_aufgabe wie in der SQL-Datei und neueZahlen: false', () => {
    const r = parseRechenUebungen('x.json', file([exercise({ quelleAufgabe: undefined, quelle_aufgabe: 'DD3 E1', neueZahlen: false })]));
    expect(r.exercises[0]).toMatchObject({ quelleAufgabe: 'DD3 E1', neueZahlen: false });
  });

  it('Übung ohne Vorlage braucht eine Lösung je Eingabe und keine Platzhalter', () => {
    const ok = exercise({
      id: 'RE-T-002',
      vorlage: undefined,
      daten: undefined,
      aufgabe: 'Wie viel ist 2 + 2?',
      eingaben: [{ id: 'summe', label: 'Summe', loesung: 4 }],
    });
    const ohneLoesung = exercise({ id: 'RE-T-003', vorlage: undefined, aufgabe: 'x', eingaben: [{ id: 'a' }] });
    const platzhalter = exercise({ id: 'RE-T-004', vorlage: undefined, eingaben: [{ id: 'a', loesung: 1 }] });
    const r = parseRechenUebungen('x.json', file([ok, ohneLoesung, platzhalter]));
    expect(r.exercises.map((e) => e.id)).toEqual(['RE-T-002']);
    expect(r.exercises[0].neueZahlen).toBe(false);
    expect(r.issues.map((i) => i.message)).toEqual([
      'Übung RE-T-003 übersprungen (ohne Vorlage braucht jede Eingabe eine „loesung“ (fehlt bei a)).',
      'Übung RE-T-004 übersprungen (Platzhalter {{…}} gibt es nur mit Vorlage).',
    ]);
  });

  it('meldet ungültige, doppelte und von der Prüffunktion abgelehnte Übungen', () => {
    const r = parseRechenUebungen(
      'x.json',
      file([
        exercise(),
        exercise(),
        exercise({ id: 'RE-T-005', schwierigkeit: 4 }),
        exercise({ id: 'RE-T-006', eingaben: ['a', 'a'] }),
        exercise({ id: 'RE-T-007', vorlage: 'gibtsnicht' }),
      ]),
      topics,
      (u) => (u.vorlage === 'gibtsnicht' ? 'unbekannte Vorlage „gibtsnicht“' : undefined),
    );
    expect(r.exercises.map((e) => e.id)).toEqual(['RE-T-001']);
    expect(r.issues.map((i) => i.message)).toEqual([
      'Doppelte Übungs-ID RE-T-001 übersprungen.',
      expect.stringMatching(/^Übung RE-T-005 übersprungen \(schwierigkeit/),
      'Übung RE-T-006: Eingabe „a“ doppelt – übersprungen.',
      'Übung RE-T-007 übersprungen (unbekannte Vorlage „gibtsnicht“).',
    ]);
  });

  it('meldet kaputtes JSON und fehlende uebungen', () => {
    expect(parseRechenUebungen('x.json', '{').issues[0].message).toMatch(/^Ungültiges JSON/);
    expect(parseRechenUebungen('x.json', '{}').issues[0].message).toBe('Kein Feld „uebungen" gefunden.');
  });

  it('buildContent liest *Rechen_Uebungen*.json in Content.rechenUebungen', () => {
    const c = buildContent([{ name: 'AP2_Rechen_Uebungen.json', text: file([exercise()]) }]);
    expect(c.rechenUebungen.map((u) => u.id)).toEqual(['RE-T-001']);
    const abgelehnt = buildContent([{ name: 'AP2_Rechen_Uebungen.json', text: file([exercise()]) }], {
      pruefeRechenUebung: () => 'passt nicht',
    });
    expect(abgelehnt.rechenUebungen).toEqual([]);
    expect(abgelehnt.issues).toEqual([{ file: 'AP2_Rechen_Uebungen.json', message: 'Übung RE-T-001 übersprungen (passt nicht).' }]);
  });
});
