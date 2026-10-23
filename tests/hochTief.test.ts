import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { teileHochTief } from '../src/lib/hochTief';
import { Markdown } from '../src/components/Markdown';
import { HochTief } from '../src/components/HochTief';

// Hoch- und Tiefstellung in Klartext-Formeln der Karteikarten („e^(−z)“, „x_i“).

describe('teileHochTief', () => {
  it('Hochstellung mit und ohne Klammern', () => {
    expect(teileHochTief('1 / (1 + e^(−z))')).toEqual([{ text: '1 / (1 + e' }, { text: '−z', art: 'sup' }, { text: ')' }]);
    expect(teileHochTief('1,5^(1/7) − 1')).toEqual([{ text: '1,5' }, { text: '1/7', art: 'sup' }, { text: ' − 1' }]);
    expect(teileHochTief('e^z.')).toEqual([{ text: 'e' }, { text: 'z', art: 'sup' }, { text: '.' }]);
  });

  it('Tiefstellung nur nach einem einzelnen Kleinbuchstaben', () => {
    expect(teileHochTief('Σ (x_i − x̄)')).toEqual([{ text: 'Σ (x' }, { text: 'i', art: 'sub' }, { text: ' − x̄)' }]);
    expect(teileHochTief('s_xy / s_x²')).toEqual([
      { text: 's' },
      { text: 'xy', art: 'sub' },
      { text: ' / s' },
      { text: 'x', art: 'sub' },
      { text: '²' },
    ]);
  });

  it('lässt Bezeichner und gewöhnlichen Text in Ruhe', () => {
    for (const t of ['kunden_id', 'b.bestell_id', 'M_ID PK', 'A_ID', 'Spalte_1', 'ONLY_FULL_GROUP_BY', 'ohne Formel'])
      expect(teileHochTief(t)).toEqual([{ text: t }]);
  });
});

describe('Darstellung', () => {
  it('Markdown setzt <sup>/<sub>, Code bleibt wörtlich', () => {
    const html = renderToStaticMarkup(createElement(Markdown, null, 'σ(z) = 1 / (1 + e^(−z)), r_s und `x_i ^2`'));
    expect(html).toContain('e<sup>−z</sup>');
    expect(html).toContain('r<sub>s</sub>');
    expect(html).toContain('<code>x_i ^2</code>');
  });

  it('auch ohne andere Markdown-Zeichen (kein schneller Weg an ^ vorbei)', () => {
    expect(renderToStaticMarkup(createElement(Markdown, null, '(180 / 120)^(1/7) − 1'))).toContain('<sup>1/7</sup>');
  });

  it('HochTief für Klartext (Leicht-Modus)', () => {
    expect(renderToStaticMarkup(createElement(HochTief, { text: 'p_i gegeben' }))).toBe('p<sub>i</sub> gegeben');
    expect(renderToStaticMarkup(createElement(HochTief, { text: 'schlicht' }))).toBe('schlicht');
  });
});
