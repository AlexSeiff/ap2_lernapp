import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { OPERATOREN } from '../src/lib/operatoren';

// Rauchtest Operatoren-Trainer (ROADMAP 8.4): Seite, Kachel unter Material, Markierung in Einzelaufgabe und Klausur.

const content = loadContent(CONTENT_DIR);
const progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '' }),
}));

const { Operatoren } = await import('../src/pages/Operatoren');
const { Material } = await import('../src/pages/Material');
const { Aufgabe } = await import('../src/pages/Aufgabe');

function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/material/operatoren', element: createElement(Operatoren) }),
    createElement(Route, { path: '/material', element: createElement(Material) }),
    createElement(Route, { path: '/aufgabe/:taskId', element: createElement(Aufgabe) }),
  );
  const app = createElement(MemoryRouter, { initialEntries: [path] }, routes);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, app)).replace(/<!-- -->/g, '');
}

describe('Operatoren-Trainer – Seiten', () => {
  it('Trainer: Quizfrage mit 4 Antworten und Tabelle aller Operatoren', () => {
    const html = render('/material/operatoren');
    expect(html).toContain('Operatoren-Trainer');
    expect(html).toMatch(/Was verlangt der Operator „[^“]+“ hier\?/);
    expect(html.match(/class="leicht-option /g)).toHaveLength(4);
    for (const o of OPERATOREN) expect(html).toContain(`id="op-${o.id}"`);
  });

  it('Material verlinkt den Trainer', () => {
    expect(render('/material')).toContain('href="/material/operatoren"');
  });

  it('Einzelaufgabe: Operatoren markiert, Musterlösung nicht betroffen', () => {
    const html = render('/aufgabe/03-B2');
    expect(html).toMatch(/<span class="operator"[^>]*>Vergleichen<span role="tooltip"/);
    expect(html).toMatch(/<span class="operator"[^>]*>Erläutern<span role="tooltip"/);
  });
});
