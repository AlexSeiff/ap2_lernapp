import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, FEHLERGRUENDE, type Attempt, type ExamRun, type Progress } from '../shared/progress';
import type { Task } from '../shared/types';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { FEHLERGRUND_INFO, fehlerStatistik, letzterFehlergrund } from '../src/lib/fehlergruende';
import { finishExam, recordAttempt, setzeFehlergrund } from '../src/lib/progress';

// Fehlergründe im Fehlerjournal (ROADMAP 8.7): Auswertung, Speichern am Versuch, Klausur, Seiten.

const content = loadContent(CONTENT_DIR);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { Klausur } = await import('../src/pages/Klausur');
const { Fehlerjournal } = await import('../src/pages/Fehlerjournal');
const { Dashboard } = await import('../src/pages/Dashboard');

function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/klausur/:topicId', element: createElement(Klausur) }),
    createElement(Route, { path: '/fehlerjournal', element: createElement(Fehlerjournal) }),
    createElement(Route, { path: '/', element: createElement(Dashboard) }),
  );
  const app = createElement(MemoryRouter, { initialEntries: [path] }, routes);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, app)).replace(/<!-- -->/g, '');
}

const versuch = (taskId: string, date: string, points: number, extra: Partial<Attempt> = {}): Attempt => ({
  taskId,
  date,
  points,
  max: 6,
  mode: 'einzel',
  ...extra,
});

describe('Auswertung', () => {
  it('zählt nur Versuche unter voller Punktzahl, häufigster zuerst', () => {
    const s = fehlerStatistik([
      versuch('a', '1', 2, { fehlergrund: 'operator' }),
      versuch('b', '2', 3, { fehlergrund: 'operator' }),
      versuch('c', '3', 1, { fehlergrund: 'zeit' }),
      versuch('d', '4', 6, { fehlergrund: 'zeit' }), // volle Punkte: zählt nicht
      versuch('e', '5', 0),
    ]);
    expect(s).toEqual({
      anzahl: 3,
      je: [
        { grund: 'operator', anzahl: 2 },
        { grund: 'zeit', anzahl: 1 },
      ],
      haeufigster: 'operator',
    });
  });

  it('Gleichstand an der Spitze → kein häufigster; ohne Daten leer', () => {
    const s = fehlerStatistik([versuch('a', '1', 0, { fehlergrund: 'formel' }), versuch('b', '1', 0, { fehlergrund: 'begriff' })]);
    expect(s.haeufigster).toBeUndefined();
    expect(s.je.map((x) => x.grund)).toEqual(['begriff', 'formel']);
    expect(fehlerStatistik([])).toEqual({ anzahl: 0, je: [] });
  });

  it('letzter Grund je Aufgabe; jeder Grund hat Text, Tipp und Link', () => {
    const list = [versuch('a', '1', 0, { fehlergrund: 'formel' }), versuch('a', '2', 1)];
    expect(letzterFehlergrund(list, 'a')).toBeUndefined();
    expect(letzterFehlergrund(list.slice(0, 1), 'a')).toBe('formel');
    for (const g of FEHLERGRUENDE)
      expect(FEHLERGRUND_INFO[g]).toMatchObject({ id: g, label: expect.any(String), tipp: expect.any(String) });
  });
});

describe('Speichern', () => {
  const date = '2026-10-01T10:00:00.000Z';
  const p = recordAttempt(emptyProgress(), versuch('03-B1', date, 2), '2026-10-01');

  it('setzeFehlergrund setzt und entfernt den Grund am passenden Versuch', () => {
    const mit = setzeFehlergrund(p, '03-B1', date, 'rechenfehler');
    expect(mit.attempts[0].fehlergrund).toBe('rechenfehler');
    const ohne = setzeFehlergrund(mit, '03-B1', date, undefined);
    expect('fehlergrund' in ohne.attempts[0]).toBe(false);
    expect(setzeFehlergrund(p, '03-B1', 'anderes Datum', 'zeit')).toBe(p);
    const voll = recordAttempt(emptyProgress(), versuch('03-B1', date, 6), '2026-10-01');
    expect(setzeFehlergrund(voll, '03-B1', date, 'zeit')).toBe(voll);
  });

  it('finishExam übernimmt den Grund nur unter voller Punktzahl', () => {
    const tasks: Task[] = ['A1', 'A2'].map((c) => ({
      id: `01-${c}`,
      code: c,
      topicId: '01',
      block: 'A',
      points: 4,
      markdown: '',
      type: 'offen',
    }));
    const run: ExamRun = {
      id: 'ex',
      topicId: '01',
      startedAt: date,
      submittedAt: date,
      answers: {},
      scores: { '01-A1': 2, '01-A2': 4 },
      max: 8,
      fehlergrund: { '01-A1': 'operator', '01-A2': 'zeit' },
    };
    const done = finishExam({ ...emptyProgress(), activeExam: run }, run, tasks, date);
    expect(done.attempts.map((a) => a.fehlergrund)).toEqual(['operator', undefined]);
    expect(done.exams[0].fehlergrund).toEqual(run.fehlergrund);
  });
});

describe('Seiten', () => {
  it('Klausur: nach der Abgabe „Woran lag’s?“ nur bei Aufgaben unter voller Punktzahl', () => {
    const exam = content.topics.find((t) => t.id === '03')!.exam!;
    const ids = exam.blocks.flatMap((b) => b.taskIds);
    progress = {
      ...emptyProgress(),
      activeExam: {
        id: 'ex',
        topicId: '03',
        startedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        answers: {},
        scores: { [ids[0]]: 0, [ids[1]]: content.tasks[ids[1]].points },
        max: 100,
        fehlergrund: { [ids[0]]: 'begriff' },
      },
    };
    const html = render('/klausur/03');
    expect(html.match(/Woran lag&#x27;s\? \(optional\)/g)).toHaveLength(1);
    expect(html).toMatch(/aria-pressed="true"[^>]*><svg.*?<\/svg> (<!-- -->)?Begriff verwechselt/);
  });

  it('Fehlerjournal und Übersicht zeigen den häufigsten Grund, das Journal den Grund je Eintrag', () => {
    const d = (n: number) => `2026-09-2${n}T10:00:00.000Z`;
    progress = [
      versuch('03-B1', d(1), 2, { fehlergrund: 'operator' }),
      versuch('03-B2', d(2), 1, { fehlergrund: 'operator' }),
      versuch('04-A1', d(3), 0, { fehlergrund: 'formel' }),
    ].reduce((p, a) => recordAttempt(p, a, a.date.slice(0, 10)), emptyProgress());
    const journal = render('/fehlerjournal');
    expect(journal).toContain('Woran es meistens liegt');
    expect(journal).toMatch(/Häufigster Grund: <b><svg.*?<\/svg> (<!-- -->)?Operator nicht beachtet<\/b> \(2 von 3\)/);
    expect(journal).toContain('href="/material/operatoren"');
    expect(journal.match(/class="badge fehlergrund-badge"/g)).toHaveLength(3);
    expect(render('/')).toContain('Woran es meistens liegt');

    progress = emptyProgress();
    expect(render('/fehlerjournal')).not.toContain('Woran es meistens liegt');
  });
});
