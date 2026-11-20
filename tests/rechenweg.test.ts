import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { formatErgebnis, formatZahl, latexZahl, type RechenSchritt, rundungsHinweis } from '../domain/rechenweg';
import { Rechenweg } from '../src/components/Rechenweg';

describe('formatZahl', () => {
  it('deutsches Format mit fester Stellenzahl', () => {
    expect(formatZahl(70, 2)).toBe('70,00');
    expect(formatZahl(1080.5, 2)).toBe('1.080,50');
    expect(formatZahl(12000, 0)).toBe('12.000');
    expect(formatZahl(0.9333333, 4)).toBe('0,9333');
    expect(formatZahl(2.5)).toBe('2,5');
    expect(formatZahl(1 / 3)).toBe('0,3333');
  });

  it('typografisches Minus, kein „−0,00“', () => {
    expect(formatZahl(-5)).toBe('−5');
    expect(formatZahl(-1.2, 2)).toBe('−1,20');
    expect(formatZahl(-0.001, 2)).toBe('0,00');
  });
});

describe('formatErgebnis und rundungsHinweis', () => {
  it('Einheit mit Leerzeichen, auch vor %', () => {
    expect(formatErgebnis({ ergebnis: 70, einheit: 'min', runden: 2 })).toBe('70,00 min');
    expect(formatErgebnis({ ergebnis: 93.333333, einheit: '%', runden: 2 })).toBe('93,33 %');
    expect(formatErgebnis({ ergebnis: 55 })).toBe('55');
  });

  it('Hinweis nur, wenn wirklich gerundet wurde', () => {
    expect(rundungsHinweis(70, 2)).toBeUndefined();
    expect(rundungsHinweis(0.1 + 0.2, 1)).toBeUndefined();
    expect(rundungsHinweis(93.333333, 2)).toBe('gerundet auf 2 Nachkommastellen');
    expect(rundungsHinweis(2.24, 1)).toBe('gerundet auf 1 Nachkommastelle');
    expect(rundungsHinweis(2.5, 0)).toBe('gerundet auf eine ganze Zahl');
    expect(rundungsHinweis(1 / 3)).toBe('gerundet auf 4 Nachkommastellen');
  });

  it('latexZahl: Dezimalkomma in geschweiften Klammern', () => {
    expect(latexZahl(70, 2)).toBe('70{,}00');
    expect(latexZahl(-1.2, 2)).toBe('-1{,}20');
    expect(latexZahl(1000)).toBe('1.000');
  });
});

describe('Rechenweg (Komponente)', () => {
  // DD3 C1 und DD7 B2 als Beispiel, so wie die Rechenübungen (Phase 5) ihre Schritte liefern.
  const schritte: RechenSchritt[] = [
    {
      titel: 'Arithmetisches Mittel',
      formel: String.raw`\bar{x} = \frac{\sum x_i}{n}`,
      einsetzen: String.raw`\bar{x} = \frac{770}{11}`,
      ergebnis: 70,
      einheit: 'min',
      runden: 2,
    },
    {
      titel: 'Spezifität',
      formel: String.raw`\text{Spezifität} = \frac{TN}{TN + FP}`,
      einsetzen: String.raw`\frac{840}{840 + 60} = \frac{840}{900} = ${latexZahl(0.933333, 4)}`,
      ergebnis: (840 / 900) * 100,
      einheit: '%',
      runden: 2,
      hinweis: 'In Prozent umgerechnet.',
    },
  ];
  const html = renderToStaticMarkup(createElement(Rechenweg, { schritte }));

  it('nummerierte Schritte mit Formel, Einsetzen und Ergebnis', () => {
    expect(html.startsWith('<ol class="rechenweg">')).toBe(true);
    expect(html.match(/<li class="rw-schritt">/g)).toHaveLength(2);
    expect(html.match(/<dt>Formel<\/dt>/g)).toHaveLength(2);
    expect(html.match(/<dt>Einsetzen<\/dt>/g)).toHaveLength(2);
    expect(html).toContain('<strong class="rw-ergebnis">70,00 min</strong></dd>');
    expect(html).toContain('<strong class="rw-ergebnis">93,33 %</strong><span class="hint"> (gerundet auf 2 Nachkommastellen)</span>');
    expect(html).toContain('<p class="hint">In Prozent umgerechnet.</p>');
  });

  it('setzt Formeln mit KaTeX', () => {
    expect(html).toContain('class="katex"');
    expect(html).toContain('<annotation encoding="application/x-tex">\\bar{x} = \\frac{\\sum x_i}{n}</annotation>');
    expect(html).not.toContain('katex-error');
  });

  it('ohne Einsetzen-Zeile, wenn keine angegeben ist', () => {
    const one = renderToStaticMarkup(
      createElement(Rechenweg, { schritte: [{ titel: 'Modus', formel: 'x_{mod}', ergebnis: 40, einheit: 'min' }] }),
    );
    expect(one).not.toContain('Einsetzen');
    expect(one).toContain('40 min');
  });
});
