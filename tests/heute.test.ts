import { describe, expect, it } from 'vitest';
import { HEUTE_KARTEN_BLOCK, HEUTE_MINUTEN } from '../shared/config';
import { emptyProgress, type Progress } from '../shared/progress';
import type { Content, Flashcard, RechenUebung, SqlExercise, Task, Topic } from '../shared/types';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { aufgabeMinuten, planeHeute, verschraenke } from '../src/lib/heute';
import { aktuellerSchritt, istFertig, leseSitzung, sitzungVonHeute, starteSitzung, weiter } from '../src/lib/heuteSitzung';

// „Heute lernen“ (ROADMAP 8.1): Planer und Sitzung.

const TODAY = '2026-10-01';

function topic(id: string, taskIds: string[]): Topic {
  return {
    id,
    number: Number(id),
    title: `Thema ${id}`,
    file: `DeepDive_${id}.md`,
    sections: [],
    lernziele: [],
    exam: {
      title: 'Klausur',
      intro: '',
      attachments: [],
      blocks: [{ letter: 'A', title: 'A', points: 10, intro: '', taskIds }],
      totalPoints: 10,
    },
  };
}

const task = (topicId: string, code: string, points = 5): Task => ({
  id: `${topicId}-${code}`,
  code,
  topicId,
  block: 'A',
  points,
  markdown: 'Nennen Sie …',
  type: 'offen',
});

const card = (id: string, topicId: string, kind: Flashcard['kind'] = 'lernkarte'): Flashcard => ({
  id,
  topicId,
  kind,
  question: `Frage ${id}`,
  answer: `Antwort ${id}`,
  typ: 'wissen',
  deckId: `deck${topicId}`,
});

function makeContent(): Content {
  const tasks = [task('01', 'A1'), task('01', 'A2'), task('02', 'A1'), task('02', 'A2', 10), task('03', 'A1')];
  const sql: SqlExercise = {
    id: 'SQL-1',
    datensatz: 'x',
    thema: 'Deep Dive 1',
    topicId: '01',
    titel: 'Join',
    aufgabe: '',
    schwierigkeit: 1,
    tags: [],
    loesung: 'SELECT 1',
    vergleich: { reihenfolge: 'auto' },
    hinweise: [],
  };
  const rechnen = (id: string, topicId: string): RechenUebung => ({
    id,
    thema: `Deep Dive ${Number(topicId)}`,
    topicId,
    titel: `Rechnen ${id}`,
    schwierigkeit: 1,
    tags: [],
    neueZahlen: false,
    aufgabe: '',
    eingaben: [],
    hinweise: [],
  });
  return {
    importedAt: '',
    topics: [topic('01', ['01-A1', '01-A2']), topic('02', ['02-A1', '02-A2']), topic('03', ['03-A1'])],
    tasks: Object.fromEntries(tasks.map((t) => [t.id, t])),
    flashcards: [
      ...Array.from({ length: 12 }, (_, i) => card(`K1-${i}`, '01')),
      ...Array.from({ length: 12 }, (_, i) => card(`K2-${i}`, '02')),
      card('PF-1', '03', 'prueferfrage'),
      card('FG-1', '03', 'fachgespraech'),
    ],
    decks: [],
    cardHints: [],
    materials: [],
    sqlDatasets: [],
    sqlExercises: [sql],
    rechenUebungen: [rechnen('RE-1', '02'), rechnen('RE-2', '03')],
    issues: [],
  };
}

const content = makeContent();
const fix = () => 0; // Zufall fest auf den ersten Kandidaten
const plan = (p: Progress, extra = {}) => planeHeute(content, p, { today: TODAY, zufall: fix, ...extra });

describe('verschraenke', () => {
  it('wechselt die Themen, solange es geht, und behält die Reihenfolge je Thema', () => {
    const items = ['a1', 'a2', 'a3', 'b1', 'b2', 'c1'].map((k) => ({ k, thema: k[0] }));
    const out = verschraenke(items).map((x) => x.k);
    expect(out).toHaveLength(6);
    for (let i = 1; i < out.length; i++) expect(out[i][0]).not.toBe(out[i - 1][0]);
    expect(out.filter((k) => k[0] === 'a')).toEqual(['a1', 'a2', 'a3']);
  });

  it('nur ein Thema → unverändert', () => {
    const items = [1, 2, 3].map((k) => ({ k, thema: 'x' }));
    expect(verschraenke(items).map((x) => x.k)).toEqual([1, 2, 3]);
  });
});

describe('planeHeute', () => {
  it('neuer Stand: Aufgabe, eine ungelöste Übung, neue Karten; etwa HEUTE_MINUTEN', () => {
    const p = plan(emptyProgress());
    const arten = p.items.map((i) => i.art);
    expect(arten.filter((a) => a === 'aufgabe')).toHaveLength(1);
    expect(arten.filter((a) => a === 'sql' || a === 'rechnen')).toHaveLength(1);
    expect(arten).toContain('karten');
    expect(arten).not.toContain('wiederholung');
    expect(p.minuten).toBeGreaterThan(HEUTE_MINUTEN - 3);
    expect(p.minuten).toBeLessThanOrEqual(HEUTE_MINUTEN + 1);
    // Ohne Daten: Thema mit den wenigsten Versuchen (alle 0 → das erste).
    expect(p.schwaechstesThema).toBe('01');
    expect(new Set(p.items.map((i) => i.key)).size).toBe(p.items.length);
  });

  it('schwächstes Thema nach Ergebnis; bevorzugt eine noch nie bearbeitete Aufgabe', () => {
    const p: Progress = {
      ...emptyProgress(),
      attempts: [
        { taskId: '01-A1', date: '2026-09-20', points: 5, max: 5, mode: 'einzel' },
        { taskId: '02-A1', date: '2026-09-20', points: 1, max: 5, mode: 'einzel' },
      ],
    };
    const r = plan(p);
    expect(r.schwaechstesThema).toBe('02');
    const aufgabe = r.items.find((i) => i.art === 'aufgabe')!;
    expect(aufgabe.ids).toEqual(['02-A2']);
    expect(aufgabe.minuten).toBe(aufgabeMinuten(10));
    expect(aufgabe.link).toBe('/aufgabe/02-A2');
    // Ungelöste Übung bevorzugt aus dem schwächsten Thema.
    expect(r.items.find((i) => i.art === 'rechnen')?.ids).toEqual(['RE-1']);
  });

  it('bereits beantwortete Aufgaben kommen nicht mehr; ist das schwächste Thema durch, das nächste', () => {
    const p: Progress = {
      ...emptyProgress(),
      attempts: [
        { taskId: '02-A1', date: '2026-09-20', points: 1, max: 5, mode: 'einzel' },
        { taskId: '02-A2', date: '2026-09-20', points: 1, max: 10, mode: 'einzel' },
        { taskId: '01-A1', date: '2026-09-20', points: 5, max: 5, mode: 'einzel' },
      ],
    };
    const r = plan(p);
    expect(r.schwaechstesThema).toBe('02');
    expect(r.items.find((i) => i.art === 'aufgabe')?.ids).toEqual(['01-A2']);
  });

  it('fällige Wiederholungen und Übungen kommen dran, Wiederholung mit ?modus=wiederholung', () => {
    const p: Progress = {
      ...emptyProgress(),
      journal: {
        '03-A1': { taskId: '03-A1', addedAt: '2026-09-28', stage: 0, due: '2026-09-29', lastPoints: 1, max: 5 },
        '01-A2': { taskId: '01-A2', addedAt: '2026-09-28', stage: 0, due: '2026-10-05', lastPoints: 1, max: 5 },
      },
      sql: { 'SQL-1': { attempts: 1, hintsUsed: 0, stage: 1, due: '2026-09-30' } },
      rechnen: { 'RE-2': { attempts: 1, hintsUsed: 0, stage: 1, due: '2026-10-01' } },
    };
    const r = plan(p);
    const wdh = r.items.filter((i) => i.art === 'wiederholung');
    expect(wdh.map((i) => i.ids[0])).toEqual(['03-A1']);
    expect(wdh[0].link).toBe('/aufgabe/03-A1?modus=wiederholung');
    expect(
      r.items
        .filter((i) => i.art === 'sql' || i.art === 'rechnen')
        .map((i) => i.ids[0])
        .sort(),
    ).toEqual(['RE-2', 'SQL-1']);
    // Die Zusatzaufgabe ist keine der geplanten Wiederholungen.
    expect(r.items.find((i) => i.art === 'aufgabe')?.ids[0]).not.toBe('03-A1');
  });

  it('höchstens 2 Übungen und Fehlerjournal bis etwa zur halben Zeit (mindestens eine)', () => {
    const journal = Object.fromEntries(
      ['01-A1', '01-A2', '02-A1', '02-A2', '03-A1'].map((id) => [
        id,
        { taskId: id, addedAt: '2026-09-01', stage: 0, due: '2026-09-02', lastPoints: 0, max: content.tasks[id].points },
      ]),
    );
    const r = plan({ ...emptyProgress(), journal });
    const minuten = r.items.filter((i) => i.art === 'wiederholung').reduce((s, i) => s + i.minuten, 0);
    expect(minuten).toBeLessThanOrEqual(HEUTE_MINUTEN / 2);
    expect(minuten).toBeGreaterThan(0);
  });

  it('Karten: fällige zuerst (am längsten fällig), Blöcke je Thema, Link mit ?karten=', () => {
    const cards = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`K2-${i}`, { box: 2, due: `2026-09-${10 + i}`, reviews: 1 }]));
    const r = plan({ ...emptyProgress(), cards });
    const kartenItems = r.items.filter((i) => i.art === 'karten');
    for (const k of kartenItems) {
      expect(k.ids.length).toBeLessThanOrEqual(HEUTE_KARTEN_BLOCK);
      expect(k.link).toBe(`/karteikarten?karten=${k.ids.join(',')}`);
    }
    const alle = kartenItems.flatMap((k) => k.ids);
    expect(alle.slice(0, 3)).toEqual(['K2-0', 'K2-1', 'K2-2']);
    expect(alle.every((id) => id.startsWith('K2-') || id.startsWith('K1-'))).toBe(true);
  });

  it('respektiert Prüferfragen/Fachgespräch-Einstellungen und den Leicht-Modus', () => {
    // Alle Lernkarten schon gelernt und nicht fällig – übrig bleiben die beiden Karten aus dem Lernblatt.
    const gelernt = Object.fromEntries(
      content.flashcards.filter((c) => c.kind === 'lernkarte').map((c) => [c.id, { box: 3, due: '2026-12-01', reviews: 2 }]),
    );
    const viel = planeHeute(content, { ...emptyProgress(), cards: gelernt }, { today: TODAY, zufall: fix, minuten: 200 });
    const ids = viel.items.flatMap((i) => (i.art === 'karten' ? i.ids : []));
    expect(ids).toContain('PF-1');
    expect(ids).toContain('FG-1');
    const aus: Progress = {
      ...emptyProgress(),
      cards: gelernt,
      settings: { ...emptyProgress().settings, prueferfragen: false, fachgespraech: false },
    };
    const ohne = planeHeute(content, aus, { today: TODAY, zufall: fix, minuten: 200 }).items.flatMap((i) =>
      i.art === 'karten' ? i.ids : [],
    );
    expect(ohne).not.toContain('PF-1');
    expect(ohne).not.toContain('FG-1');
    // Leicht-Modus ohne automatische Antworten: keine Karte hat 4 Antworten → keine Karten.
    const leicht: Progress = { ...emptyProgress(), settings: { ...emptyProgress().settings, leichtModus: true, leichtAutomatisch: false } };
    expect(planeHeute(content, leicht, { today: TODAY, zufall: fix }).items.some((i) => i.art === 'karten')).toBe(false);
  });

  it('verschränkt: nie zweimal dasselbe Thema hintereinander, wenn vermeidbar', () => {
    const r = plan(emptyProgress());
    const themen = r.items.map((i) => i.thema);
    const max = Math.max(...[...new Set(themen)].map((t) => themen.filter((x) => x === t).length));
    if (max <= Math.ceil(themen.length / 2)) for (let i = 1; i < themen.length; i++) expect(themen[i]).not.toBe(themen[i - 1]);
  });

  it('gleicher Tag → gleicher Plan (Tages-Seed)', () => {
    const a = planeHeute(content, emptyProgress(), { today: TODAY });
    const b = planeHeute(content, emptyProgress(), { today: TODAY });
    expect(a).toEqual(b);
  });

  it('läuft mit den echten Inhalten (content/)', () => {
    const real = loadContent(CONTENT_DIR);
    const r = planeHeute(real, emptyProgress(), { today: TODAY });
    expect(r.items.length).toBeGreaterThan(2);
    for (const it of r.items) expect(it.link.startsWith('/')).toBe(true);
    expect(r.minuten).toBeLessThanOrEqual(HEUTE_MINUTEN + 10);
  });
});

describe('Heute-Sitzung', () => {
  const items = plan(emptyProgress()).items;

  it('weiter / überspringen bis fertig', () => {
    let s = starteSitzung(items, TODAY);
    expect(aktuellerSchritt(s)).toBe(items[0]);
    s = weiter(s);
    s = weiter(s, true);
    expect(s.erledigt).toEqual([items[0].key]);
    expect(s.uebersprungen).toEqual([items[1].key]);
    while (!istFertig(s)) s = weiter(s);
    expect(weiter(s)).toBe(s);
    expect(aktuellerSchritt(s)).toBeUndefined();
  });

  it('gilt nur am selben Tag', () => {
    const s = starteSitzung(items, TODAY);
    expect(sitzungVonHeute(s, TODAY)).toBe(s);
    expect(sitzungVonHeute(s, '2026-10-02')).toBeUndefined();
  });

  it('liest gespeicherte Sitzungen tolerant', () => {
    const s = weiter(starteSitzung(items, TODAY));
    expect(leseSitzung(JSON.parse(JSON.stringify(s)))).toEqual(s);
    expect(leseSitzung(null)).toBeUndefined();
    expect(leseSitzung({ datum: TODAY })).toBeUndefined();
    const kaputt = leseSitzung({
      datum: TODAY,
      items: [items[0], { key: 'x', art: 'quatsch', link: '/' }, { key: 'y', art: 'sql', link: 'http://x' }],
      index: 99,
    });
    expect(kaputt?.items).toEqual([items[0]]);
    expect(kaputt?.index).toBe(1);
  });
});
