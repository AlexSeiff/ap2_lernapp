// Ausgangssituation jederzeit einblendbar: Knopf und Bedingung im Anhang-Panel (components/Belegsatz.tsx).

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { Section } from '../shared/types';
import { AnhangPanel, hatAnhang } from '../src/components/Belegsatz';

const anlage = (id: string, title: string): Section => ({ id, title, level: 3, markdown: 'Text' });
const html = (props: Parameters<typeof AnhangPanel>[0]) =>
  renderToString(createElement(MemoryRouter, null, createElement(AnhangPanel, props)));

describe('hatAnhang', () => {
  it('ist wahr, sobald SQL-Belegsatz, Formeln oder Anlagen vorhanden sind', () => {
    expect(hatAnhang({})).toBe(false);
    expect(hatAnhang({ situation: [] })).toBe(false);
    expect(hatAnhang({ sql: true })).toBe(true);
    expect(hatAnhang({ formeln: true })).toBe(true);
    expect(hatAnhang({ situation: [anlage('a', 'Ausgangssituation')] })).toBe(true);
  });
});

describe('AnhangPanel mit Ausgangssituation', () => {
  it('zeigt den Knopf mit Kurzbefehl A, das Panel ist zunächst zu', () => {
    const h = html({ situation: [anlage('a', 'Ausgangssituation')] });
    expect(h).toContain('Ausgangssituation');
    expect(h).toContain('<kbd>A</kbd>');
    expect(h).toContain('aria-expanded="false"');
    expect(h).not.toContain('belegsatz-panel');
  });

  it('steht vor SQL-Belegsatz und Formelübersicht', () => {
    const h = html({ sql: true, formeln: true, situation: [anlage('a', 'Ausgangssituation')] });
    expect(h.indexOf('Ausgangssituation')).toBeLessThan(h.indexOf('SQL-Belegsatz'));
    expect(h.indexOf('SQL-Belegsatz')).toBeLessThan(h.indexOf('Formelübersicht'));
  });

  it('ohne Anlagen kein Knopf (und ohne alles: nichts)', () => {
    expect(html({ sql: true })).not.toContain('Ausgangssituation');
    expect(html({ situation: [] })).toBe('');
  });
});
