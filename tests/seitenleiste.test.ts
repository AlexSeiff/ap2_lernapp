import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Seitenleiste } from '../src/components/Seitenleiste';

const render = (path: string) =>
  renderToString(
    createElement(
      MemoryRouter,
      { initialEntries: [path] },
      createElement(Seitenleiste, {
        badges: { sql: 2, rechnen: 0, diagramme: 0, journal: 3 },
        onSuche: () => {},
      }),
    ),
  ).replace(/<!-- -->/g, '');

describe('Desktop-Lernraum', () => {
  it('macht Lernen, Nachschlagen und Sicherungen direkt erreichbar', () => {
    const html = render('/');
    for (const path of ['/heute', '/karteikarten', '/lernen', '/sql', '/glossar', '/daten', '/einstellungen']) {
      expect(html).toContain(`href="${path}"`);
    }
    expect(html).toContain('aria-label="Alle Lernbereiche"');
    expect(html).toContain('Alles durchsuchen');
  });

  it('markiert beim Kartenstand genau diesen Eintrag, nicht die übergeordnete Kartenliste', () => {
    const html = render('/karteikarten/stand');
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toMatch(/class="seitenleiste-ziel active" aria-current="page" href="\/karteikarten\/stand"/);
  });

  it('markiert SQL-Übungen auch in einer einzelnen Übung und erklärt fällige Badges', () => {
    const html = render('/sql/uebung/SQL-MH-001');
    expect(html).toMatch(/class="seitenleiste-ziel active" aria-current="page" href="\/sql\/uebungen"/);
    expect(html).toContain('aria-label="2 fällig"');
    expect(html).toContain('aria-label="3 fällig"');
  });
});
