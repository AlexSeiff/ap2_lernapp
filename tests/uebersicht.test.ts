import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, type Progress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { cardPool } from '../src/lib/cards';
import { leseLeseStelle, obersterAbschnitt } from '../src/lib/leseStelle';
import { UNTERBEREICHE } from '../src/lib/mischKlausur';
import { PRUEFUNGSBEREICHE, begriffDesTages, bereichFortschritt, faellig, klausurVerlauf, quote } from '../src/lib/uebersicht';
import { Ringe, MiniRing } from '../src/components/Ring';

// Neue Übersicht (Umsetzungsplan Phase 9): Auswertungen für die Widgets, Lesestelle, Ringe und die Seite selbst.

const content = loadContent(CONTENT_DIR);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { Dashboard } = await import('../src/pages/Dashboard');
const render = () => renderToString(createElement(MemoryRouter, null, createElement(Dashboard))).replace(/<!-- -->/g, '');

describe('Prüfungsbereiche', () => {
  it('jeder Deep Dive mit Klausur zählt genau einmal, DD17 nirgends', () => {
    const alle = PRUEFUNGSBEREICHE.flatMap((b) => b.themen);
    expect(new Set(alle).size).toBe(alle.length);
    for (const t of content.topics) {
      if (t.id === '17') expect(alle).not.toContain(t.id);
      else expect(alle, t.id).toContain(t.id);
    }
    expect(PRUEFUNGSBEREICHE.find((b) => b.id === 'wiso')!.themen).toEqual(['13', '14', '20']);
  });

  it('passt zu den Unterbereichen der gemischten Klausur', () => {
    for (const b of PRUEFUNGSBEREICHE.filter((x) => x.id !== 'wiso')) {
      const quellen = new Set(UNTERBEREICHE.filter((u) => u.bereich === b.id).flatMap((u) => u.quellen.map((q) => q.topicId)));
      for (const t of b.themen) expect(quellen.has(t), `${b.id} ${t}`).toBe(true);
    }
  });

  it('ohne Fortschritt: alles 0, aber jeder Bereich hat Karten und Übungen', () => {
    for (const b of bereichFortschritt(content, emptyProgress())) {
      expect(b.karten.erreicht).toBe(0);
      expect(b.uebungen.erreicht).toBe(0);
      expect(b.karten.gesamt).toBeGreaterThan(0);
      expect(b.uebungen.gesamt).toBeGreaterThan(0);
      expect(quote(b.karten)).toBe(0);
    }
  });

  it('zählt Karten ab Fach 3, Aufgaben ab 80 % und gelöste Übungen', () => {
    const pool = cardPool(content.flashcards, emptyProgress().settings);
    const karte3 = pool.find((c) => c.topicId === '05')!;
    const karte2 = pool.find((c) => c.topicId === '05' && c.id !== karte3.id)!;
    const sql = content.sqlExercises.find((e) => e.topicId === '01')!;
    const diagramm = content.diagrammUebungen![0];
    const [a1, a2] = Object.values(content.tasks).filter((t) => t.topicId === '01' && !t.generated);
    const p: Progress = {
      ...emptyProgress(),
      cards: { [karte3.id]: { box: 3, due: '2099-01-01', reviews: 3 }, [karte2.id]: { box: 2, due: '2099-01-01', reviews: 2 } },
      attempts: [
        { taskId: a1.id, date: '2026-10-01', points: 8, max: 10, mode: 'einzel' },
        { taskId: a2.id, date: '2026-10-01', points: 7, max: 10, mode: 'einzel' },
      ],
      sql: { [sql.id]: { attempts: 1, hintsUsed: 0, solvedAt: '2026-10-01' } },
      diagramme: { [diagramm.id]: { attempts: 1, hintsUsed: 0, solvedAt: '2026-10-01' } },
    };
    const [prozess, qualitaet, wiso] = bereichFortschritt(content, p);
    expect(prozess.karten.erreicht).toBe(1);
    expect(prozess.uebungen.erreicht).toBe(1); // die Diagramm-Übung
    expect(qualitaet.uebungen.erreicht).toBe(2); // a1 (80 %) und die SQL-Übung, a2 (70 %) nicht
    expect(wiso.uebungen.erreicht).toBe(0);
  });
});

describe('Fällig', () => {
  it('ohne Fortschritt sind alle Karten fällig (neu), sonst nichts', () => {
    const f = faellig(content, emptyProgress(), '2026-10-10');
    expect(f).toEqual({
      journal: 0,
      karten: cardPool(content.flashcards, emptyProgress().settings).length,
      sql: 0,
      rechnen: 0,
      diagramme: 0,
    });
  });

  it('zählt Fehlerjournal und Diagramm-Wiederholungen', () => {
    const task = Object.values(content.tasks)[0];
    const d = content.diagrammUebungen![0];
    const p: Progress = {
      ...emptyProgress(),
      journal: { [task.id]: { taskId: task.id, addedAt: '2026-10-01', stage: 0, due: '2026-10-02', lastPoints: 1, max: 4 } },
      diagramme: { [d.id]: { attempts: 2, hintsUsed: 0, stage: 1, due: '2026-10-09' } },
    };
    const f = faellig(content, p, '2026-10-10');
    expect(f.journal).toBe(1);
    expect(f.diagramme).toBe(1);
  });
});

describe('Begriff des Tages', () => {
  it('fest je Tag, wechselt über die Tage, mit Kurzdefinition', () => {
    const heute = begriffDesTages(content, '2026-10-10')!;
    expect(begriffDesTages(content, '2026-10-10')!.begriff.id).toBe(heute.begriff.id);
    expect(heute.karte?.answer).toBeTruthy();
    expect(content.begriffe!.some((b) => b.id === heute.begriff.id)).toBe(true);
    const tage = Array.from({ length: 14 }, (_, i) => begriffDesTages(content, `2026-11-${String(i + 1).padStart(2, '0')}`)!.begriff.id);
    expect(new Set(tage).size).toBeGreaterThanOrEqual(10);
  });

  it('ohne Begriffsseiten: keiner', () => {
    expect(begriffDesTages({ begriffe: [], flashcards: content.flashcards })).toBeUndefined();
  });
});

describe('Klausurverlauf', () => {
  it('nur abgeschlossene, älteste zuerst, mit Durchschnitt und Namen gemischter Klausuren', () => {
    const lauf = (id: string, topicId: string, finishedAt: string | undefined, total: number | undefined) => ({
      id,
      topicId,
      startedAt: '2026-09-01T10:00:00Z',
      ...(finishedAt ? { finishedAt } : {}),
      answers: {},
      scores: {},
      ...(total !== undefined ? { total } : {}),
      max: 100,
    });
    const p: Progress = {
      ...emptyProgress(),
      exams: [
        lauf('b', '01', '2026-09-20T10:00:00Z', 60),
        lauf('a', 'mix-gemischt-7', '2026-09-10T10:00:00Z', 40),
        lauf('c', '02', undefined, undefined),
      ],
    };
    const { laeufe, schnitt } = klausurVerlauf(content, p);
    expect(laeufe.map((l) => l.id)).toEqual(['a', 'b']);
    expect(laeufe[0].name).toBe('Gemischt (gemischt)');
    expect(schnitt).toBe(50);
    expect(klausurVerlauf(content, emptyProgress()).schnitt).toBeUndefined();
  });
});

describe('Lesestelle', () => {
  it('liest tolerant', () => {
    expect(leseLeseStelle({ topicId: '03', sectionId: '03-2', am: 'x' })).toEqual({ topicId: '03', sectionId: '03-2', am: 'x' });
    expect(leseLeseStelle({ topicId: '03' })).toBeUndefined();
    expect(leseLeseStelle('kaputt')).toBeUndefined();
    expect(leseLeseStelle(null)).toBeUndefined();
  });

  it('oberster Abschnitt: der letzte über der Linie, sonst der erste', () => {
    const tops = [
      { id: 'a', top: -500 },
      { id: 'b', top: 100 },
      { id: 'c', top: 600 },
    ];
    expect(obersterAbschnitt(tops, 136)).toBe('b');
    expect(obersterAbschnitt(tops, 50)).toBe('a');
    expect(obersterAbschnitt([{ id: 'a', top: 300 }], 136)).toBe('a');
    expect(obersterAbschnitt([], 136)).toBeUndefined();
  });
});

describe('Ringe', () => {
  it('Wert als Bogen, Beschriftung für Screenreader, leerer Ring ohne Bogen', () => {
    const html = renderToString(
      createElement(Ringe, {
        werte: [
          { wert: 0.25, klasse: 'ring-karten' },
          { wert: 0, klasse: 'ring-uebungen' },
        ],
        label: 'Test: 25 %',
      }),
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Test: 25 %"');
    expect(html).toContain('stroke-dasharray="25 100"');
    expect(html.match(/class="ring-wert"/g)).toHaveLength(1);
  });

  it('Mini-Ring färbt nach Notenstufe, ohne Wert ein Strich', () => {
    expect(renderToString(createElement(MiniRing, { pct: 95 }))).toContain('ring good');
    expect(renderToString(createElement(MiniRing, { pct: 70 }))).toContain('ring mid');
    expect(renderToString(createElement(MiniRing, { pct: 19 }))).toContain('ring low');
    expect(renderToString(createElement(MiniRing, {}))).toContain('–');
  });
});

describe('Übersichtsseite', () => {
  it('zeigt alle Widgets und keine alten Balken', () => {
    progress = emptyProgress();
    const html = render();
    for (const text of ['Weiterlernen', 'Heute lernen', 'Prüfungsbereiche', 'Fällig', 'Übungen', 'Markiert', 'Begriff des Tages']) {
      expect(html, text).toContain(text);
    }
    expect(html).toContain('Übungsklausuren');
    expect(html).toContain('Noch keine Übungsklausur abgeschlossen.');
    expect(html).toContain('Prüfungstermin eintragen →');
    expect(html).toContain('Diagramm-Übungen gelöst');
    expect(html).toMatch(/aria-label="Prozessanalyse: Karten sicher 0 %, Übungen gelöst 0 %"/);
    expect(html).not.toContain('class="bar"');
    expect(html).toContain('Lernblätter ansehen');
  });

  it('Fortschritt je Thema: jedes Thema mit allen Werten', () => {
    progress = { ...emptyProgress(), attempts: [{ taskId: '03-C1', date: '2026-10-01', points: 5, max: 10, mode: 'einzel' }] };
    const html = render();
    for (const t of content.topics) expect(html).toContain(`href="/lernen/${t.id}"`);
    expect(html).toContain('aria-label="Ø Aufgaben: 50 %"');
    expect(html.match(/class="tf-label">Lernziele</g)).toHaveLength(content.topics.length);
  });

  it('Countdown, Klausuren und Schwächen mit Daten', () => {
    progress = {
      ...emptyProgress(),
      settings: { ...emptyProgress().settings, examDate: '2099-11-25' },
      exams: [
        {
          id: 'x',
          topicId: '01',
          startedAt: '2026-09-01T10:00:00Z',
          finishedAt: '2026-09-01T11:30:00Z',
          answers: {},
          scores: {},
          total: 19,
          max: 100,
        },
      ],
    };
    const html = render();
    expect(html).toContain('Tage bis zur Prüfung (25.11.2099)');
    expect(html).toContain('19 %');
    expect(html).toContain('Note 6');
    expect(html).toContain('Schwächste Themen');
    expect(html).toContain('Klausur-Trend je Thema');
  });
});
