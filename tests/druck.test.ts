import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import type { MarkdownProps } from '../src/components/markdownComponents';

// Rauchtest der Druckansicht /druck mit den echten Lernblättern (Server-Rendering ohne Browser).
// <Markdown math> lädt KaTeX sonst lazy (beim Server-Rendering bliebe der Text ohne Formelsatz) – hier direkt die Formel-Variante.

const content = loadContent(CONTENT_DIR);

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {} }),
  useStartStore: () => ({ content, progress: emptyProgress(), update: () => {} }),
}));
vi.mock('../src/components/Markdown', async () => {
  const { default: MathMarkdown } = await import('../src/components/MathMarkdown');
  return { Markdown: (props: MarkdownProps & { math?: boolean }) => createElement(MathMarkdown, props) };
});

const { Druck } = await import('../src/pages/Druck');

function render(path: string): string {
  const routes = createElement(Routes, null, createElement(Route, { path: '/druck', element: createElement(Druck) }));
  return renderToString(createElement(MemoryRouter, { initialEntries: [path] }, routes)).replace(/<!-- -->/g, '');
}

describe('Druckansicht /druck', () => {
  it('jedes Lösungsblatt rendert ohne Formelfehler', () => {
    for (const t of content.topics.filter((x) => x.exam)) {
      const html = render(`/druck?thema=${t.id}&art=loesungen`);
      expect(html, t.id).toContain('Lösungsblatt');
      expect(html, t.id).not.toContain('katex-error');
    }
  });

  it('Lösungsblatt DD3: Formeln gesetzt, Ergebnisse im Kasten', () => {
    const html = render('/druck?thema=03&art=loesungen');
    expect(html).toContain('<span class="ergebnis-label">Ergebnis</span><strong>70,00 Minuten</strong>');
    expect(html).toContain('pk-box');
    expect(html).toContain('class="katex"');
    expect(html).toContain('class="punkte rechts"');
  });

  it('Aufgabenblatt rendert', () => {
    expect(render('/druck?thema=03&art=aufgaben')).toContain('Aufgabenblatt');
  });

  it('gemischte Probeklausur (Umsetzungsplan Phase 6): ?misch= wie ?thema=, Deckblatt mit Punkten je Block, Blöcke auf neuen Seiten', () => {
    const id = 'mix-gemischt-4711';
    const html = render(`/druck?misch=${id}&art=aufgaben`);
    // gleich bis auf den Link zum Lösungsblatt, der den Parameter übernimmt
    const ohneLink = (h: string) => h.replace(/href="\/druck\?[^"]*"/g, '');
    expect(ohneLink(html)).toBe(ohneLink(render(`/druck?thema=${id}&art=aufgaben`)));
    expect(html).toContain(`href="/druck?misch=${id}&amp;art=loesungen"`);
    expect(html).toContain('class="deckblatt"');
    expect(html).toContain('Bearbeitungszeit');
    expect(html).toMatch(/<tr class="summe"><th scope="row" colSpan="2">Summe<\/th><td class="num">100<\/td>/);
    expect(html).toContain('sheet-group neuer-block');
    expect(html).toContain('@page :first');
    expect(html).toContain('counter(pages)');
    expect(html).toContain(`href="/klausur/${id}"`);
  });

  it('Lösungsblatt einer Klausur: Bewertungsbogen mit jeder Aufgabe und dem Notenschlüssel', () => {
    const html = render('/druck?thema=06&art=loesungen');
    expect(html).toContain('Bewertungsbogen');
    for (const id of content.topics.find((t) => t.id === '06')!.exam!.blocks.flatMap((b) => b.taskIds)) {
      expect(html, id).toContain(`<th scope="row">${content.tasks[id].code}</th>`);
    }
    expect(html).toContain('100–92 = 1 · 91–81 = 2 · 80–67 = 3 · 66–50 = 4 · 49–30 = 5 · 29–0 = 6');
    expect(html).not.toContain('class="deckblatt"');
  });

  it('freie Auswahl: kein Deckblatt, kein Bewertungsbogen', () => {
    const id = Object.keys(content.tasks)[0];
    const html = render(`/druck?ids=${id}&art=aufgaben`);
    expect(html).not.toContain('deckblatt');
    expect(html).not.toContain('neuer-block');
  });
});
