import { describe, expect, it } from 'vitest';
import { HEUTE_KARTEN_BLOCK, HEUTE_MINUTEN } from '../shared/config';
import { emptyProgress, type Progress } from '../shared/progress';
import type { Content, Flashcard, RechenUebung, SqlExercise, Task, Topic } from '../shared/types';
import type { DiagrammUebung } from '../shared/diagrammUebungen';
import { letzterStand } from '../src/lib/wiederholung';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { aufgabeMinuten, planeHeute, verschraenke } from '../src/lib/heute';
import {
  aktuellerSchritt,
  beende,
  istFertig,
  leseSitzung,
  schonDran,
  sitzungVonHeute,
  starteSitzung,
  weiter,
} from '../src/lib/heuteSitzung';

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
    // Der Planer braucht von einer Diagramm-Übung nur id und Titel.
    diagrammUebungen: [{ id: 'DG-1', titel: 'Bestellprozess' } as DiagrammUebung],
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
    // Zwei Aufgaben aus verschiedenen Themen.
    const aufgaben = p.items.filter((i) => i.art === 'aufgabe');
    expect(aufgaben).toHaveLength(2);
    expect(new Set(aufgaben.map((i) => i.thema)).size).toBe(2);
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

  it('zweite Aufgabe aus dem am längsten nicht geübten Thema, neue Karten aus mehreren Themen', () => {
    const p: Progress = {
      ...emptyProgress(),
      attempts: [
        { taskId: '01-A1', date: '2026-09-29', points: 1, max: 5, mode: 'einzel' },
        { taskId: '02-A1', date: '2026-09-25', points: 3, max: 5, mode: 'einzel' },
      ],
    };
    const r = plan(p);
    const themen = r.items.filter((i) => i.art === 'aufgabe').map((i) => i.thema);
    expect(themen[0]).toBe('01');
    expect(themen[1]).toBe('03'); // nie geübt vor dem länger zurückliegenden Thema 02
    const kartenThemen = new Set(r.items.filter((i) => i.art === 'karten').map((i) => i.thema));
    expect(kartenThemen.size).toBeGreaterThan(1);
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

  it('Übungen: nur zuletzt nicht richtig gelöste (auch Diagramme) – zuletzt richtige nie, auch wenn fällig', () => {
    const p: Progress = {
      ...emptyProgress(),
      sql: { 'SQL-1': { attempts: 2, hintsUsed: 0, solvedAt: '2026-09-20', stage: 2, due: '2026-09-28', zuletztRichtig: true } },
      rechnen: { 'RE-2': { attempts: 1, hintsUsed: 0, lastCheckedAt: '2026-09-29', stage: 1, due: '2026-09-30', zuletztRichtig: false } },
      diagramme: { 'DG-1': { attempts: 1, hintsUsed: 0, solutionShown: true, stage: 1, due: '2026-09-29', zuletztRichtig: false } },
    };
    const uebungen = plan(p).items.filter((i) => ['sql', 'rechnen', 'diagramm'].includes(i.art));
    expect(uebungen.map((i) => i.ids[0]).sort()).toEqual(['DG-1', 'RE-2']);
    const dg = uebungen.find((i) => i.art === 'diagramm')!;
    expect(dg.link).toBe('/diagramme/DG-1');
    expect(dg.titel).toBe('Diagramm: Bestellprozess');
  });

  it('Übungen: ohne falsche eine neue; ist alles zuletzt richtig, gar keine', () => {
    const richtig = { attempts: 1, hintsUsed: 0, solvedAt: '2026-09-20', lastCheckedAt: '2026-09-20', zuletztRichtig: true };
    const neu = plan({ ...emptyProgress(), rechnen: { 'RE-2': richtig } }).items.filter((i) => i.art !== 'karten' && i.art !== 'aufgabe');
    expect(neu).toHaveLength(1);
    expect(neu[0].ids[0]).not.toBe('RE-2');
    const alles: Progress = {
      ...emptyProgress(),
      sql: { 'SQL-1': richtig },
      rechnen: { 'RE-1': richtig, 'RE-2': richtig },
      diagramme: { 'DG-1': richtig },
    };
    expect(plan(alles).items.filter((i) => ['sql', 'rechnen', 'diagramm'].includes(i.art))).toEqual([]);
  });

  it('Fehlerjournal und Zusatzaufgabe: nichts, was zuletzt mit voller Punktzahl gelöst wurde', () => {
    const p: Progress = {
      ...emptyProgress(),
      attempts: [
        { taskId: '01-A1', date: '2026-09-20', points: 5, max: 5, mode: 'einzel' },
        { taskId: '01-A2', date: '2026-09-20', points: 5, max: 5, mode: 'einzel' },
      ],
      journal: {
        '03-A1': { taskId: '03-A1', addedAt: '2026-09-20', stage: 0, due: '2026-09-21', lastPoints: 1, max: 5 },
        // Beim letzten Mal voll gelöst, Wiederholungsstufe 2 fällig – kommt trotzdem nicht.
        '02-A1': { taskId: '02-A1', addedAt: '2026-09-10', stage: 1, due: '2026-09-25', lastPoints: 5, max: 5 },
      },
    };
    const r = plan(p);
    expect(r.items.filter((i) => i.art === 'wiederholung').map((i) => i.ids[0])).toEqual(['03-A1']);
    // Schwächstes Thema 01 ist durch (beide Aufgaben beantwortet) → die Zusatzaufgabe kommt aus einem anderen Thema.
    expect(r.schwaechstesThema).toBe('01');
    const aufgaben = r.items.filter((i) => i.art === 'aufgabe').flatMap((i) => i.ids);
    expect(aufgaben.length).toBeGreaterThan(0);
    for (const id of aufgaben) expect(['01-A1', '01-A2', '03-A1']).not.toContain(id);
  });

  it('letzterStand: neu, falsch, richtig – auch für ältere Stände ohne zuletztRichtig', () => {
    expect(letzterStand(undefined)).toBe('neu');
    expect(letzterStand({ attempts: 0 })).toBe('neu');
    expect(letzterStand({ attempts: 1, zuletztRichtig: false })).toBe('falsch');
    expect(letzterStand({ attempts: 0, zuletztRichtig: false })).toBe('falsch');
    expect(letzterStand({ attempts: 3, solvedAt: 'x', stage: 1, due: 'y', zuletztRichtig: true })).toBe('richtig');
    // ohne Feld: nie gelöst / nach dem Lösen wieder auf Stufe 1 → falsch; gelöst und weiter → richtig
    expect(letzterStand({ attempts: 1, stage: 1, due: 'y' })).toBe('falsch');
    expect(letzterStand({ attempts: 0, solutionShown: true, stage: 1, due: 'y' })).toBe('falsch');
    expect(letzterStand({ attempts: 2, solvedAt: 'x', stage: 1, due: 'y' })).toBe('falsch');
    expect(letzterStand({ attempts: 2, solvedAt: 'x', stage: 2, due: 'y' })).toBe('richtig');
    expect(letzterStand({ attempts: 4, solvedAt: 'x' })).toBe('richtig');
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

  it('„Noch eine Runde“: nichts aus früheren Runden von heute noch einmal', () => {
    const erste = plan(emptyProgress());
    const ids = erste.items.flatMap((i) => i.ids);
    const zweite = plan(emptyProgress(), { ausschliessen: ids });
    expect(zweite.items.length).toBeGreaterThan(0);
    for (const id of zweite.items.flatMap((i) => i.ids)) expect(ids).not.toContain(id);
  });

  it('heute bearbeitete Aufgaben und geprüfte Übungen kommen nicht noch einmal', () => {
    // 01-A1 heute mit halber Punktzahl: wäre sonst die schlechteste und damit die Zusatzaufgabe.
    const p: Progress = {
      ...emptyProgress(),
      attempts: [
        { taskId: '01-A1', date: `${TODAY}T08:00:00`, points: 1, max: 5, mode: 'einzel' },
        { taskId: '01-A2', date: '2026-09-20', points: 4, max: 5, mode: 'einzel' },
      ],
      rechnen: { 'RE-2': { attempts: 1, hintsUsed: 0, lastCheckedAt: TODAY } },
      sql: { 'SQL-1': { attempts: 2, hintsUsed: 0, lastCheckedAt: TODAY, stage: 0, due: TODAY } },
    };
    const r = plan(p);
    // Beantwortete Aufgaben kommen nicht als Zusatzaufgabe (falsche über das Fehlerjournal), die von heute schon gar nicht.
    const aufgaben = r.items.filter((i) => i.art === 'aufgabe').flatMap((i) => i.ids);
    expect(aufgaben).not.toContain('01-A1');
    expect(aufgaben).not.toContain('01-A2');
    const uebungen = r.items.filter((i) => i.art === 'sql' || i.art === 'rechnen').flatMap((i) => i.ids);
    expect(uebungen).not.toContain('SQL-1');
    expect(uebungen).not.toContain('RE-2');
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

  it('merkt sich über Runden hinweg, was heute schon dran war – auch beim Beenden', () => {
    const erste = weiter(weiter(starteSitzung(items, TODAY)));
    // Beendet im dritten Schritt: die ersten drei zählen als schon dran.
    const beendet = beende(erste);
    expect(istFertig(beendet)).toBe(true);
    expect(beendet.frueher).toEqual([...new Set(items.slice(0, 3).flatMap((i) => i.ids))]);
    const zweite = starteSitzung(items.slice(3), TODAY, beendet);
    let s = zweite;
    while (!istFertig(s)) s = weiter(s);
    expect(new Set(schonDran(s))).toEqual(new Set(items.flatMap((i) => i.ids)));
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
