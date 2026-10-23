import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import {
  bewerteDiagramm,
  type DiagrammUebung,
  formregeln,
  musterBelegung,
  parseDiagrammUebungen,
  slotsVon,
} from '../shared/diagrammUebungen';
import { mergeProgress } from '../shared/mergeProgress';
import { checkProgressPut, emptyProgress, migrateProgress, PROGRESS_VERSION, ProgressSchema } from '../shared/progress';
import { diagrammStatus, diagrammSummary, recordDiagrammCheck, recordDiagrammLoesung } from '../src/lib/diagramme';
import { einsetzen } from '../src/pages/DiagrammUebung';
import { ohneAntworten } from './ohneAntworten';

// Diagramm-Übungen (Umsetzungsplan Phase 7): Import mit Prüfung, Bewertung je Lücke mit Varianten, Formregeln, Fortschritt.

/** Kleine EPK: Ereignis → [s1] → [s2] → zwei Ereignisse; s1 Funktion, s2 XOR. */
const epk = (extra: Partial<DiagrammUebung> = {}): DiagrammUebung => ({
  id: 'T-1',
  typ: 'epk',
  stufe: 1,
  titel: 'Test',
  szenario: 'Text',
  breite: 400,
  hoehe: 400,
  knoten: [
    { id: 'e1', form: 'ereignis', x: 100, y: 0, w: 160, h: 40, text: 'Bestellung ist eingegangen' },
    { id: 'f1', x: 100, y: 70, w: 160, h: 40, slot: 's1' },
    { id: 'k1', x: 160, y: 140, w: 36, h: 36, slot: 's2' },
    { id: 'e2', form: 'ereignis', x: 0, y: 220, w: 160, h: 40, text: 'freigegeben' },
    { id: 'e3', form: 'ereignis', x: 200, y: 220, w: 160, h: 40, text: 'abgelehnt' },
  ],
  kanten: [
    { von: 'e1', nach: 'f1', art: 'fluss' },
    { von: 'f1', nach: 'k1', art: 'fluss' },
    { von: 'k1', nach: 'e2', art: 'fluss' },
    { von: 'k1', nach: 'e3', art: 'fluss' },
  ],
  palette: [
    { id: 'p1', form: 'funktion', text: 'Bestellung prüfen' },
    { id: 'p2', form: 'xor', text: 'XOR', mehrfach: true },
    { id: 'd1', form: 'ereignis', text: 'Bestellung ist geprüft' },
    { id: 'd2', form: 'and', text: 'AND' },
  ],
  loesung: { s1: ['p1'], s2: ['p2'] },
  varianten: [],
  hinweise: [],
  tags: [],
  ...extra,
});

const datei = (uebungen: unknown[]) => JSON.stringify({ uebungen });

describe('Import', () => {
  it('liest gültige Übungen; Lösung als String oder Liste', () => {
    const roh = { ...epk(), loesung: { s1: 'p1', s2: ['p2'] } };
    const { uebungen, issues } = parseDiagrammUebungen('X.json', datei([roh]));
    expect(issues).toEqual([]);
    expect(uebungen[0].loesung).toEqual({ s1: ['p1'], s2: ['p2'] });
    expect(slotsVon(uebungen[0])).toEqual(['s1', 's2']);
  });

  it('meldet und überspringt fehlerhafte Übungen', () => {
    const fehler = [
      { ...epk({ id: 'A' }), loesung: { s1: ['p1'] } }, // s2 ohne Lösung
      { ...epk({ id: 'B' }), loesung: { s1: ['p9'], s2: ['p2'] } }, // unbekanntes Element
      { ...epk({ id: 'C' }), kanten: [{ von: 'e1', nach: 'x', art: 'fluss' }] }, // Kante ins Leere
      { ...epk({ id: 'D' }), typ: 'uml' }, // unbekannter Typ
      { ...epk({ id: 'E' }), knoten: [...epk().knoten, { id: 'z', form: 'ereignis', x: 390, y: 0, w: 50, h: 10 }] }, // außerhalb
      epk({ id: 'F' }),
      epk({ id: 'F' }), // doppelt
    ];
    const { uebungen, issues } = parseDiagrammUebungen('X.json', datei(fehler));
    expect(uebungen.map((u) => u.id)).toEqual(['F']);
    expect(issues.map((i) => i.message)).toEqual([
      expect.stringContaining('A übersprungen: loesung: Slot s2 ohne Lösung'),
      expect.stringContaining('B übersprungen: loesung: Element p9 fehlt in der Palette'),
      expect.stringContaining('C übersprungen: Kante e1 → x: Knoten fehlt'),
      expect.stringContaining('D übersprungen: typ'),
      expect.stringContaining('E übersprungen: Knoten z liegt außerhalb'),
      expect.stringContaining('F übersprungen: ID doppelt'),
    ]);
    expect(parseDiagrammUebungen('X.json', '{').issues[0].message).toContain('Kein gültiges JSON');
  });

  it('Kanten-Slots brauchen Kanten-Elemente, Knoten-Slots Knoten-Elemente', () => {
    const u = {
      ...epk(),
      kanten: [...epk().kanten.slice(0, 3), { von: 'k1', nach: 'e3', art: 'fluss', slot: 's3' }],
      loesung: { s1: 'p1', s2: 'p2', s3: 'd1' },
    };
    expect(parseDiagrammUebungen('X.json', datei([u])).issues[0].message).toContain('Slot s3: Element d1 passt nicht');
  });
});

describe('Bewertung', () => {
  it('je Lücke; leere Lücken sind falsch', () => {
    const r = bewerteDiagramm(epk(), { s1: 'p1' });
    expect(r).toMatchObject({ slots: { s1: true, s2: false }, richtig: 1, gesamt: 2, ok: false });
    expect(bewerteDiagramm(epk(), musterBelegung(epk())).ok).toBe(true);
  });

  it('Varianten: die Lösung mit den meisten Treffern zählt (z. B. vertauschte Zweige)', () => {
    const u = epk({
      knoten: [
        ...epk().knoten.slice(0, 3),
        { ...epk().knoten[3], slot: 's3', form: undefined },
        { ...epk().knoten[4], slot: 's4', form: undefined },
      ],
      palette: [...epk().palette, { id: 'a', form: 'ereignis', text: 'A' }, { id: 'b', form: 'ereignis', text: 'B' }],
      loesung: { s1: ['p1'], s2: ['p2'], s3: ['a'], s4: ['b'] },
      varianten: [{ s1: ['p1'], s2: ['p2'], s3: ['b'], s4: ['a'] }],
    });
    expect(bewerteDiagramm(u, { s1: 'p1', s2: 'p2', s3: 'b', s4: 'a' }).ok).toBe(true);
    // gemischt: an der besseren Lösung gemessen
    expect(bewerteDiagramm(u, { s1: 'p1', s2: 'p2', s3: 'b', s4: 'b' }).richtig).toBe(3);
  });

  it('Einsetzen: einfache Elemente wandern, mehrfache bleiben auch in der alten Lücke', () => {
    const u = epk();
    expect(einsetzen(u, { s1: 'd1' }, 'd1', 's2')).toEqual({ s2: 'd1' });
    expect(einsetzen(u, { s1: 'p2' }, 'p2', 's2')).toEqual({ s1: 'p2', s2: 'p2' });
    expect(einsetzen(u, { s1: 'p1' }, 'd1', 's1')).toEqual({ s1: 'd1' });
  });
});

describe('Formregeln', () => {
  it('EPK: zwei Ereignisse hintereinander, XOR-Split nach einem Ereignis', () => {
    const r = formregeln(epk(), { s1: 'd1', s2: 'p2' });
    expect(r).toContainEqual(expect.stringContaining('Ereignis und Funktion wechseln sich ab'));
    expect(r).toContainEqual(expect.stringContaining('Nach einem Ereignis darf kein XOR- oder OR-Split folgen'));
    expect(formregeln(epk(), { s1: 'p1', s2: 'p2' })).toEqual([]);
    // AND-Split nach einem Ereignis ist erlaubt (nur XOR/OR nicht)
    expect(formregeln(epk(), { s1: 'd1', s2: 'd2' }).some((m) => m.includes('Split'))).toBe(false);
  });

  it('Verzweigung mit anderem Typ geschlossen (XOR auf, AND zu → Deadlock)', () => {
    const u: DiagrammUebung = {
      ...epk(),
      typ: 'bpmn',
      knoten: [
        { id: 'a', form: 'task', x: 0, y: 0, w: 50, h: 30 },
        { id: 'g1', x: 0, y: 50, w: 40, h: 40, slot: 's1' },
        { id: 'b', form: 'task', x: 0, y: 100, w: 50, h: 30 },
        { id: 'c', form: 'task', x: 100, y: 100, w: 50, h: 30 },
        { id: 'g2', x: 0, y: 150, w: 40, h: 40, slot: 's2' },
      ],
      kanten: [
        { von: 'a', nach: 'g1', art: 'fluss' },
        { von: 'g1', nach: 'b', art: 'fluss' },
        { von: 'g1', nach: 'c', art: 'fluss' },
        { von: 'b', nach: 'g2', art: 'fluss' },
        { von: 'c', nach: 'g2', art: 'fluss' },
      ],
      palette: [
        { id: 'x', form: 'gw-xor', text: 'x' },
        { id: 'y', form: 'gw-and', text: 'y' },
      ],
      loesung: { s1: ['x'], s2: ['x'] },
    };
    expect(formregeln(u, { s1: 'x', s2: 'y' })).toEqual([expect.stringContaining('Deadlock')]);
    expect(formregeln(u, { s1: 'y', s2: 'y' })).toEqual([]);
  });

  it('EPK beginnt und endet mit einem Ereignis', () => {
    const u = epk({
      knoten: [{ ...epk().knoten[0], form: undefined, slot: 's0' }, ...epk().knoten.slice(1)],
      loesung: { s0: ['d1'], s1: ['p1'], s2: ['p2'] },
    });
    expect(formregeln(u, { s0: 'p1', s1: 'd1', s2: 'p2' })).toContainEqual(expect.stringContaining('beginnt und endet mit einem Ereignis'));
  });
});

describe('Echte Übungen (AP2_Diagramm_Uebungen.json)', () => {
  const content = loadContent(CONTENT_DIR);
  const alle = content.diagrammUebungen ?? [];

  it('alle importiert, je Typ mindestens 4, beide Stufen', () => {
    expect(content.issues.filter((i) => i.file.includes('Diagramm'))).toEqual([]);
    for (const t of ['epk', 'bpmn', 'aktivitaet', 'sequenz', 'zustand']) {
      expect(alle.filter((u) => u.typ === t).length, t).toBeGreaterThanOrEqual(4);
    }
    expect(alle.some((u) => u.stufe === 1) && alle.some((u) => u.stufe === 2)).toBe(true);
  });

  it('jede Musterlösung ist richtig und verletzt keine Formregel; jede Variante auch', () => {
    for (const u of alle) {
      expect(bewerteDiagramm(u, musterBelegung(u)).ok, u.id).toBe(true);
      expect(formregeln(u, musterBelegung(u)), u.id).toEqual([]);
      for (const v of u.varianten) {
        const b = Object.fromEntries(Object.entries(v).map(([s, e]) => [s, e[0]]));
        expect(bewerteDiagramm(u, b).ok, u.id).toBe(true);
      }
    }
  });

  it('Stufe 1 hat Ablenker in der Palette; jede Übung hat eine Erklärung und eine Quelle', () => {
    for (const u of alle) {
      const genutzt = new Set(Object.values(u.loesung).flat());
      if (u.stufe === 1)
        expect(
          u.palette.some((p) => !genutzt.has(p.id)),
          u.id,
        ).toBe(true);
      expect(u.erklaerung, u.id).toBeTruthy();
      expect(u.quelle, u.id).toBeTruthy();
    }
  });
});

describe('Fortschritt (Version 8)', () => {
  const fixture = (name: string) => JSON.parse(readFileSync(join(import.meta.dirname, 'fixtures', name), 'utf8'));

  it('Version 7 → 8: leere Diagramm-Übungen, Version 8 lädt unverändert', () => {
    expect(PROGRESS_VERSION).toBe(8);
    const v7 = fixture('fortschritt-v7-2026-10-09.json');
    expect(migrateProgress(v7)).toEqual(ohneAntworten({ ...v7, version: 8, diagramme: {}, diagrammDays: {} }));
    const v8 = fixture('fortschritt-v8-2026-10-09.json');
    expect(migrateProgress(v8)).toEqual(ohneAntworten(v8));
    expect(ProgressSchema.safeParse(v8).success).toBe(true);
    expect(checkProgressPut(migrateProgress(v8), v8)).toMatchObject({ ok: true, progress: { revision: 46 } });
  });

  it('ungültige Einträge fallen weg, eine alte gespeicherte Belegung auch (Wiederholung beginnt leer)', () => {
    const m = migrateProgress({
      version: 8,
      attempts: [],
      diagramme: { a: { attempts: 1, hintsUsed: 0, zuletztRichtig: false, belegung: { s1: 'p1', s2: 3 } }, b: 'x' },
    });
    expect(m.diagramme).toEqual({ a: { attempts: 1, hintsUsed: 0, zuletztRichtig: false } });
  });

  it('Prüfen, Lösung, Status, Wiederholung', () => {
    let p = recordDiagrammCheck(emptyProgress(), 'U', false, '2026-10-09');
    expect(p.diagramme.U).toMatchObject({ attempts: 1, stage: 1, due: '2026-10-10', zuletztRichtig: false });
    expect(p.diagramme.U).not.toHaveProperty('belegung');
    expect(p.diagrammDays).toEqual({ '2026-10-09': 1 });
    expect(diagrammStatus(p.diagramme.U, '2026-10-10')).toBe('faellig');
    p = recordDiagrammCheck(p, 'U', true, '2026-10-10');
    expect(p.diagramme.U).toMatchObject({ solvedAt: '2026-10-10', zuletztRichtig: true });
    expect(diagrammSummary(p, ['U', 'V'], '2026-10-10')).toEqual({ solved: 1, total: 2, due: 0 });
    const l = recordDiagrammLoesung(emptyProgress(), 'V', '2026-10-09');
    expect(diagrammStatus(l.diagramme.V, '2026-10-09')).toBe('mit-loesung');
    expect(l.diagramme.V.zuletztRichtig).toBe(false);
    // mit gezeigter Lösung zählt richtig nicht als gelöst
    expect(recordDiagrammCheck(l, 'V', true, '2026-10-09').diagramme.V.solvedAt).toBeUndefined();
  });

  it('Zusammenführen: neuere Prüfung gewinnt, gelöst bleibt gelöst, Lerntage als Maximum', () => {
    const a = recordDiagrammCheck(emptyProgress(), 'U', true, '2026-10-01');
    const b = recordDiagrammCheck(recordDiagrammCheck(emptyProgress(), 'U', false, '2026-10-05'), 'U', false, '2026-10-05');
    const m = mergeProgress(a, b);
    expect(m.diagramme.U).toMatchObject({ lastCheckedAt: '2026-10-05', solvedAt: '2026-10-01', attempts: 2 });
    expect(m.diagrammDays).toEqual({ '2026-10-01': 1, '2026-10-05': 2 });
  });
});
