import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, type Progress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { planeHeute } from '../src/lib/heute';
import { localDate } from '../src/lib/progress';

// Rauchtest „Heute lernen“ (ROADMAP 8.1): Seite, Knopf auf der Übersicht, Karten-Auswahl per ?karten=.

const content = loadContent(CONTENT_DIR);
const progress: Progress = { ...emptyProgress(), attempts: [{ taskId: '03-B1', date: '2026-09-20', points: 2, max: 10, mode: 'einzel' }] };

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { Heute } = await import('../src/pages/Heute');
const { Dashboard } = await import('../src/pages/Dashboard');
const { Karteikarten } = await import('../src/pages/Karteikarten');

function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/heute', element: createElement(Heute) }),
    createElement(Route, { path: '/', element: createElement(Dashboard) }),
    createElement(Route, { path: '/karteikarten', element: createElement(Karteikarten) }),
  );
  return renderToString(createElement(MemoryRouter, { initialEntries: [path] }, routes)).replace(/<!-- -->/g, '');
}

describe('Heute lernen – Seiten', () => {
  it('zeigt den Plan mit Start-Knopf', () => {
    const plan = planeHeute(content, progress, { today: localDate() });
    const html = render('/heute');
    expect(html).toContain('Heute lernen');
    expect(html).toContain('Los geht&#x27;s');
    for (const it of plan.items) expect(html).toContain(it.titel.replace(/&/g, '&amp;'));
  });

  it('Übersicht hat den Knopf „Heute lernen“', () => {
    const html = render('/');
    expect(html).toContain('href="/heute"');
    expect(html).toContain('Heute lernen');
  });

  it('Karteikarten mit ?karten=: genau diese Karten', () => {
    const ids = content.flashcards.slice(0, 3).map((c) => c.id);
    const html = render(`/karteikarten?karten=${ids.join(',')}`);
    expect(html).toContain('Heute lernen: 3 Karten für diesen Schritt.');
    expect(html).toContain('Alle 3 durchgehen');
  });
});
