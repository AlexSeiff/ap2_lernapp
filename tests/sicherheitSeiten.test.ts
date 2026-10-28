import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, type Progress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { ConfirmContext } from '../src/hooks/useConfirm';

// Rauchtest „Wie sicher bist du?“ (ROADMAP 8.3): Einzelaufgabe, laufende Klausur, Kalibrierung auf der Übersicht.

const content = loadContent(CONTENT_DIR);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { Aufgabe } = await import('../src/pages/Aufgabe');
const { Klausur } = await import('../src/pages/Klausur');
const { Dashboard } = await import('../src/pages/Dashboard');

function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/aufgabe/:taskId', element: createElement(Aufgabe) }),
    createElement(Route, { path: '/klausur/:topicId', element: createElement(Klausur) }),
    createElement(Route, { path: '/', element: createElement(Dashboard) }),
  );
  const app = createElement(MemoryRouter, { initialEntries: [path] }, routes);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, app)).replace(/<!-- -->/g, '');
}

describe('Selbsteinschätzung in den Seiten', () => {
  it('Einzelaufgabe fragt vor dem Abgeben', () => {
    progress = emptyProgress();
    expect(render('/aufgabe/03-B1')).toContain('Wie sicher bist du?');
  });

  it('laufende Klausur: je Aufgabe eine Frage, gewählte Stufe gedrückt', () => {
    const exam = content.topics.find((t) => t.id === '03')!.exam!;
    const ids = exam.blocks.flatMap((b) => b.taskIds);
    progress = {
      ...emptyProgress(),
      activeExam: {
        id: 'ex',
        topicId: '03',
        startedAt: new Date().toISOString(),
        answers: {},
        scores: {},
        max: 100,
        sicherheit: { [ids[0]]: 3 },
      },
    };
    const html = render('/klausur/03');
    expect(html.match(/>Wie sicher bist du\?</g)).toHaveLength(ids.length);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
  });

  it('Übersicht zeigt die Kalibrierung erst mit Einschätzungen', () => {
    progress = emptyProgress();
    expect(render('/')).not.toContain('Selbsteinschätzung');
    progress = {
      ...emptyProgress(),
      attempts: [
        { taskId: '03-B1', date: '2026-09-29', points: 10, max: 10, mode: 'einzel', sicherheit: 3 },
        { taskId: '03-B2', date: '2026-09-29', points: 1, max: 6, mode: 'einzel', sicherheit: 3 },
      ],
    };
    const html = render('/');
    expect(html).toContain('Selbsteinschätzung');
    expect(html).toContain('Bei „sicher“ lagst du in <b>50 %</b> richtig');
  });
});
