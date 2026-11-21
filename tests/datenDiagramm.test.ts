import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { deZahl, diagrammBloecke, kumuliertProzent, leseDiagramm } from '../domain/datenDiagramm';
import { pruefeDiagramme } from '../domain/parser';
import { yAchse } from '../src/components/DatenDiagramm';
import { Markdown } from '../src/components/Markdown';
import MathMarkdown from '../src/components/MathMarkdown';
import { klartext } from '../src/lib/suche';

// Datendiagramme aus ```diagramm-Blöcken: Datenangabe lesen, zeichnen, Werte unverändert zeigen, Inhalt gültig.

const BLOCK = `typ: linie
titel: Mittlere Holzfeuchte im Lager
x: Monat
y: Holzfeuchte in %
kategorien: 1; 2; 3; 4; 5; 6
reihe: Holzfeuchte | 28; 22; 22; 21; 16; 11`;

const plain = (md: string) => renderToStaticMarkup(createElement(Markdown, { children: md }));

describe('leseDiagramm', () => {
  it('liest Typ, Achsen, Kategorien und Reihen', () => {
    const { diagramm, fehler } = leseDiagramm(BLOCK);
    expect(fehler).toBeUndefined();
    expect(diagramm!.typ).toBe('linie');
    expect(diagramm!.reihen[0].werte.map((w) => w.wert)).toEqual([28, 22, 22, 21, 16, 11]);
    expect(diagramm!.xZahlen).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('liest deutsche Zahlen und behält die Schreibweise', () => {
    expect(deZahl('1.000.000')).toBe(1_000_000);
    expect(deZahl('4,80')).toBe(4.8);
    expect(deZahl('−5')).toBe(-5);
    expect(deZahl('Jahr 1')).toBeUndefined();
    const { diagramm } = leseDiagramm('typ: saeulen\ntitel: U\nkategorien: A; B\nreihe: U | 4,80; 5,10\ny-min: 4,70\nschritt: 0,10');
    expect(diagramm!.reihen[0].werte.map((w) => w.text)).toEqual(['4,80', '5,10']);
    expect(diagramm!.yMin).toBe(4.7);
  });

  it('meldet Fehler statt zu raten', () => {
    expect(leseDiagramm('typ: torte\ntitel: T\nkategorien: a; b\nreihe: r | 1; 2').fehler).toMatch(/typ/);
    expect(leseDiagramm('typ: linie\ntitel: T\nkategorien: a; b; c\nreihe: r | 1; 2').fehler).toMatch(/2 Werte/);
    expect(leseDiagramm('typ: linie\ntitel: T\nkategorien: a; b\nreihe: r | 1; zwei').fehler).toMatch(/keine Zahl/);
    expect(leseDiagramm('typ: linie\ntitel: T\nkategorien: a; b\nreihe: r | 1; 9\ny-max: 5').fehler).toMatch(/y-max/);
    expect(leseDiagramm('typ: linie\ntitel: T\nkategorien: a; b\nreihe: r | 1; 2\nfarbe: rot').fehler).toMatch(/Unbekannt/);
    expect(leseDiagramm('typ: linie\ntitel: T\nkategorien: a; b\nreihe: r | 1; 2\npunkt: c | 1 | X').fehler).toMatch(/Punkt/);
  });

  it('y-Achse: Schritt und Bereich, auch abgeschnitten', () => {
    const a = yAchse(leseDiagramm(BLOCK).diagramm!);
    expect(a.unten).toBe(0);
    expect(a.oben).toBeGreaterThanOrEqual(28);
    const b = yAchse(
      leseDiagramm('typ: saeulen\ntitel: U\nkategorien: A; B; C\nreihe: U | 4,80; 4,95; 5,10\ny-min: 4,70\ny-max: 5,10\nschritt: 0,10')
        .diagramm!,
    );
    expect(b.ticks.map((t) => b.fmt.format(t))).toEqual(['4,70', '4,80', '4,90', '5,00', '5,10']);
  });

  it('Pareto: kumulierte Anteile', () => {
    expect(kumuliertProzent([18, 15, 9, 6, 2])).toEqual([36, 66, 84, 96, 100]);
  });
});

describe('Darstellung', () => {
  it('zeichnet ein SVG mit Titel und Wertetabelle', () => {
    const html = plain('```diagramm\n' + BLOCK + '\n```');
    expect(html).toContain('<figure class="diagramm daten-diagramm"');
    expect(html).toContain('<figcaption');
    expect(html).toContain('Mittlere Holzfeuchte im Lager');
    expect(html).toContain('<polyline');
    expect(html).toContain('<summary>Werte als Tabelle</summary>');
    for (const w of ['28', '22', '21', '16', '11']) expect(html).toContain(`<td>${w}</td>`);
  });

  it('ein fehlerhafter Block bleibt Code', () => {
    const html = plain('```diagramm\ntyp: torte\n```');
    expect(html).not.toContain('<figure');
    expect(html).toContain('language-diagramm');
  });

  it('auch in der Formel-Variante und mit gestapelten Säulen und Pareto', () => {
    const md =
      '```diagramm\ntyp: gestapelt\ntitel: S\nkategorien: 1; 2\nreihe: A | 1; 2\nreihe: B | 3; 4\n```\n\n```diagramm\ntyp: pareto\ntitel: P\nkategorien: a; b\nreihe: n | 3; 1\n```';
    const html = renderToStaticMarkup(createElement(MathMarkdown, { children: md }));
    expect(html.match(/daten-diagramm/g)?.length).toBe(2);
    expect(html).toContain('kumuliert in %');
  });

  it('die Suche liest nur den Titel', () => {
    expect(klartext('Vor\n```diagramm\n' + BLOCK + '\n```\nNach')).toBe('Vor Mittlere Holzfeuchte im Lager Nach');
  });
});

describe('Inhalt', () => {
  const content = loadContent(CONTENT_DIR);

  it('alle ```diagramm-Blöcke sind gültig', () => {
    expect(pruefeDiagramme(content)).toEqual([]);
  });

  it('die Holzfeuchte in Prozessanalyse IV, D3, steht als Diagramm mit den Originalwerten', () => {
    const d3 = Object.values(content.tasks).find((t) => t.topicId === '27' && t.code === 'D3')!;
    const [block] = diagrammBloecke(d3.markdown);
    expect(leseDiagramm(block).diagramm!.reihen[0].werte.map((w) => w.text)).toEqual(['28', '22', '22', '21', '16', '11']);
  });
});
