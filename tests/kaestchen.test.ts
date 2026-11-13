import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Kaestchen, kaestchenFuellung, Strichliste } from '../src/components/Kaestchen';

// Zeichnungen im Notizbuch: Fortschritt als ausgemalte Kästchen, Lernserie als Strichliste.

describe('Kästchen', () => {
  it('füllt von links: ganze Kästchen, höchstens ein angefangenes, der Rest leer', () => {
    expect(kaestchenFuellung(0, 10)).toEqual(Array(10).fill(0));
    expect(kaestchenFuellung(1, 4)).toEqual([1, 1, 1, 1]);
    expect(kaestchenFuellung(0.5, 4)).toEqual([1, 1, 0, 0]);
    const f = kaestchenFuellung(0.36, 10);
    expect(f.slice(0, 3)).toEqual([1, 1, 1]);
    expect(f[3]).toBeCloseTo(0.6);
    expect(f.slice(4)).toEqual(Array(6).fill(0));
  });

  it('rundet Haarstriche und fast volle Kästchen, begrenzt auf 0–1', () => {
    expect(kaestchenFuellung(0.001, 10)).toEqual(Array(10).fill(0));
    expect(kaestchenFuellung(0.199, 10).slice(0, 3)).toEqual([1, 1, 0]);
    expect(kaestchenFuellung(-1, 3)).toEqual([0, 0, 0]);
    expect(kaestchenFuellung(7, 3)).toEqual([1, 1, 1]);
  });

  it('zeichnet eine breite und eine schmale Fassung und nennt den Wert für Screenreader', () => {
    const html = renderToString(createElement(Kaestchen, { anteil: 0.25, label: 'Karten sicher 25 %', farbe: 'rot' }));
    expect(html).toContain('class="kaestchen-balken k-rot" role="img" aria-label="Karten sicher 25 %"');
    expect(html.match(/<i/g)).toHaveLength(30);
    // 20 Kästchen: 5 voll; 10 Kästchen: 2 voll und eins halb
    expect(html.match(/class="voll"/g)).toHaveLength(7);
    expect(html).toContain('class="teil" style="--f:0.5"');
  });
});

describe('Strichliste', () => {
  const striche = (n: number) => renderToString(createElement(Strichliste, { n }));

  it('bündelt je fünf: vier Striche und ein Querstrich', () => {
    expect(striche(0)).toBe('');
    expect(striche(3).match(/<path/g)).toHaveLength(3);
    expect(striche(5).match(/<path/g)).toHaveLength(5);
    expect(striche(5).match(/<svg/g)).toHaveLength(1);
    expect(striche(7).match(/<svg/g)).toHaveLength(2);
    expect(striche(7).match(/<path/g)).toHaveLength(7);
  });

  it('zeichnet höchstens 20 Striche und ist für Screenreader ausgeblendet', () => {
    expect(striche(365).match(/<path/g)).toHaveLength(20);
    expect(striche(4)).toContain('aria-hidden="true"');
  });
});
