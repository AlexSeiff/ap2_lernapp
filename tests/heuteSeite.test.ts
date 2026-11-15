import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { HEUTE_MINUTEN } from '../shared/config';
import { emptyProgress, type Progress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { useHeuteSitzung } from '../src/hooks/useHeute';
import { planeHeute } from '../src/lib/heute';
import { starteSitzung, weiter } from '../src/lib/heuteSitzung';
import { localDate } from '../src/lib/progress';

// Rauchtest „Heute lernen“ (ROADMAP 8.1): Seite, Knopf auf der Übersicht, Karten-Auswahl per ?karten=.

const content = loadContent(CONTENT_DIR);
const progress: Progress = { ...emptyProgress(), attempts: [{ taskId: '03-B1', date: '2026-09-20', points: 2, max: 10, mode: 'einzel' }] };

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, firstVisit: false }),
  useStartStore: () => ({ content, progress, update: () => {}, firstVisit: false }),
}));

vi.mock('../src/hooks/useHeute', () => ({ useHeuteSitzung: vi.fn() }));

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

  it('Übersicht zeigt den Plan von „Heute lernen“ und lässt den aktuellen Schritt abhaken', () => {
    const html = render('/');
    const knopf = html.match(/<a\b[^>]*href="\/heute"[^>]*>.*?<\/a>/)?.[0] ?? '';
    expect(knopf).toContain('Weiterlernen');
    expect(knopf).toContain('Tagesrunde');
    expect(knopf).toContain(`${HEUTE_MINUTEN} Minuten`);
    const liste = html.match(/<ol class="heute-liste".*?<\/ol>/)?.[0] ?? '';
    const plan = planeHeute(content, progress, { today: localDate() });
    expect(liste.match(/type="checkbox"/g)).toHaveLength(plan.items.length);
    expect(liste.match(/<input[^>]*disabled/g)).toHaveLength(plan.items.length - 1);
    for (const it of plan.items) expect(liste).toContain(it.titel.replace(/&/g, '&amp;'));
  });

  it('lässt Häkchen auf der Übersicht auch nach Abschluss der Runde wieder entfernen', () => {
    const today = localDate();
    const items = planeHeute(content, progress, { today }).items.slice(0, 2);
    const fertig = weiter(weiter(starteSitzung(items, today)));
    vi.mocked(useHeuteSitzung).mockReturnValueOnce(fertig);
    const html = render('/');
    const liste = html.match(/<ol class="heute-liste".*?<\/ol>/)?.[0] ?? '';
    const felder = liste.match(/<input[^>]*type="checkbox"[^>]*>/g) ?? [];
    expect(felder).toHaveLength(2);
    for (const feld of felder) {
      expect(feld).toContain('checked');
      expect(feld).not.toContain('disabled');
    }
  });

  it('Karteikarten mit ?karten=: genau diese Karten', () => {
    const ids = content.flashcards.slice(0, 3).map((c) => c.id);
    const html = render(`/karteikarten?karten=${ids.join(',')}`);
    expect(html).toContain('Heute lernen: 3 Karten für diesen Schritt.');
    expect(html).toContain('Alle 3 durchgehen');
  });
});
