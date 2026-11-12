import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../build/inhalt';

// Durchblättern der Karteikarten (?blaettern=1): ohne Bewertung, Begriffskarten als Hauptfall.

const content = loadContent(CONTENT_DIR);
const progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { Karteikarten } = await import('../src/pages/Karteikarten');

function render(path: string): string {
  const routes = createElement(Routes, null, createElement(Route, { path: '/karteikarten', element: createElement(Karteikarten) }));
  return renderToString(createElement(MemoryRouter, { initialEntries: [path] }, routes)).replace(/<!-- -->/g, '');
}

describe('Karteikarten durchblättern', () => {
  const begriffe = content.flashcards.filter((c) => c.typ === 'begriff');

  it('Knopf auf der Übersicht zählt die gefilterten Karten', () => {
    expect(render('/karteikarten?typ=begriff')).toContain(`Durchblättern (${begriffe.length})`);
  });

  it('?blaettern=1 zeigt die erste Karte der Auswahl, ohne Bewertungsknöpfe', () => {
    const html = render('/karteikarten?typ=begriff&blaettern=1');
    expect(html).toContain(`Karte 1 / ${begriffe.length}`);
    expect(html).toContain(begriffe[0].question);
    expect(html).toContain('Weiter →');
    expect(html).toContain('aria-label="Zu Karte springen"');
    expect(html).not.toContain('✓ Gewusst');
  });

  it('mit einem Deck: nur dessen Karten', () => {
    const fb01 = begriffe.filter((c) => c.deckId === 'fb01');
    expect(render('/karteikarten?deck=fb01&blaettern=1')).toContain(`Karte 1 / ${fb01.length}`);
  });
});
