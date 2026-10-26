import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { pruefeDiagramme } from '../shared/parser';
import { pruefeSvg, svgBloecke, svgIds } from '../shared/svgDiagramm';
import { defaultSettings } from '../shared/progress';
import { Markdown } from '../src/components/Markdown';
import MathMarkdown from '../src/components/MathMarkdown';
import { baueGlossar } from '../src/lib/glossar';
import { GLOSSAR_PLATZHALTER, ergaenzeGlossarThema, glossarZeile } from '../src/lib/glossarThema';
import { baueSuchIndex, klartext } from '../src/lib/suche';

// Glossar & Diagramme (Deep Dive 17): ```svg-Diagramme (Positivliste, Darstellung) und die beim Laden eingesetzte Begriffsliste A–Z.

const content = loadContent(CONTENT_DIR);
const plain = (md: string) => renderToStaticMarkup(createElement(Markdown, { children: md }));
const OK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><defs><marker id="m"><path d="M0,0 L1,1" class="dg-voll"/></marker></defs><line x1="0" y1="0" x2="5" y2="5" class="dg-linie" marker-end="url(#m)"/><text x="1" y="1">a &lt; b</text></svg>';

describe('pruefeSvg', () => {
  it('lässt Zeichen-Elemente, Klassen und lokale Marker zu', () => {
    expect(pruefeSvg(OK)).toBeUndefined();
  });

  it.each([
    ['Skript', '<svg><script>alert(1)</script></svg>'],
    ['Ereignis', '<svg><rect onload="alert(1)"/></svg>'],
    ['Fremdinhalt', '<svg><foreignObject><div/></foreignObject></svg>'],
    ['Link', '<svg><a href="https://x.de"><text>x</text></a></svg>'],
    ['Bild', '<svg><image href="x.png"/></svg>'],
    ['externer Verweis', '<svg><line marker-end="url(https://x.de/m.svg#a)"/></svg>'],
    ['Stil-Attribut', '<svg><rect style="fill:red"/></svg>'],
    ['Kommentar', '<svg><!-- x --><rect/></svg>'],
    ['kein SVG', '<div></div>'],
  ])('lehnt ab: %s', (_, svg) => {
    expect(pruefeSvg(svg)).toBeDefined();
  });

  it('findet ```svg-Blöcke und ihre ids', () => {
    const md = `Text\n\n\`\`\`svg\n${OK}\n\`\`\`\n\n\`\`\`sql\nSELECT 1;\n\`\`\``;
    expect(svgBloecke(md)).toEqual([OK]);
    expect(svgIds(OK)).toEqual(['m']);
  });
});

describe('Darstellung', () => {
  it('zeigt ein gültiges SVG als Abbildung, ein ungültiges als Code', () => {
    expect(plain('```svg\n' + OK + '\n```')).toContain('<figure class="diagramm"><svg');
    const boese = plain('```svg\n<svg><script>alert(1)</script></svg>\n```');
    expect(boese).not.toContain('<figure');
    expect(boese).toContain('<pre><code class="language-svg">&lt;svg&gt;&lt;script&gt;');
  });

  it('gibt die Breite ans CSS weiter (Mindestgröße auf dem Handy), ohne width-Attribut nicht', () => {
    const breit = OK.replace('viewBox="0 0 10 10"', 'viewBox="0 0 760 400" width="760" height="400"');
    expect(plain('```svg\n' + breit + '\n```')).toContain('<figure class="diagramm" style="--dg-breite:760"><svg');
    expect(plain('```svg\n' + OK + '\n```')).not.toContain('--dg-breite');
  });

  it('auch in der Formel-Variante (Lernen)', () => {
    expect(renderToStaticMarkup(createElement(MathMarkdown, { children: '```svg\n' + OK + '\n```' }))).toContain(
      '<figure class="diagramm">',
    );
  });
});

describe('Inhalt', () => {
  const dd17 = content.topics.find((t) => t.id === '17');

  it('alle Diagramme in content/ sind gültig und haben eindeutige ids', () => {
    expect(pruefeDiagramme(content)).toEqual([]);
    const anzahl = content.topics.flatMap((t) => t.sections).reduce((n, s) => n + svgBloecke(s.markdown).length, 0);
    expect(anzahl).toBeGreaterThanOrEqual(30);
  });

  it('Deep Dive 17 ist ein Thema ohne Klausur, mit Lernzielen, Prüferfragen und Fachgespräch', () => {
    expect(dd17?.title).toBe('Glossar & Diagramme');
    expect(dd17?.exam).toBeUndefined();
    expect(dd17?.lernziele.length).toBeGreaterThan(5);
    const karten = content.flashcards.filter((c) => c.topicId === '17');
    expect(karten.some((c) => c.kind === 'prueferfrage')).toBe(true);
    expect(karten.some((c) => c.kind === 'fachgespraech')).toBe(true);
    expect(content.issues.filter((i) => i.file.startsWith('DeepDive_17'))).toEqual([]);
  });

  it('jeder Diagrammtyp der Übersicht hat einen Abschnitt mit Diagramm', () => {
    for (const titel of [
      'BPMN',
      'EPK',
      'Use-Case',
      'Klassendiagramm',
      'Aktivitätsdiagramm',
      'Sequenzdiagramm',
      'Zustandsdiagramm',
      'Chen',
      'Min-Max',
      'Krähenfuß',
      'Star-Schema',
      'Snowflake',
      'Programmablaufplan',
      'Struktogramm',
      'Netzplan',
      'Gantt',
      'Boxplot',
      'Histogramm',
      'Pareto',
      'ROC',
    ]) {
      const s = dd17?.sections.find((x) => x.title.includes(titel));
      expect(s, titel).toBeDefined();
      expect(svgBloecke(s!.markdown).length, titel).toBeGreaterThan(0);
    }
  });
});

describe('Begriffe A–Z', () => {
  const dd17 = content.topics.find((t) => t.id === '17')!;
  const generiert = dd17.sections.filter((s) => s.generiert);
  const glossar = baueGlossar(content);

  it('setzt einen Abschnitt je Anfangsbuchstabe mit allen Glossar-Einträgen ein', () => {
    expect(dd17.sections.some((s) => s.markdown.includes(GLOSSAR_PLATZHALTER))).toBe(false);
    expect(generiert.map((s) => s.title)).toContain('Begriffe A');
    const zeilen = generiert.flatMap((s) => s.markdown.split('\n'));
    expect(zeilen.length).toBe(glossar.length);
    // Begriffe mit Begriffsseite sind verlinkt (Umsetzungsplan Phase 3)
    expect(zeilen.some((z) => z.startsWith('- [Sequenzdiagramm](#/glossar/sequnzdiagramm) – '))).toBe(true);
    expect(zeilen.filter((z) => z.startsWith('- [')).length).toBe(content.begriffe!.length);
  });

  it('die Liste enthält keinen Fettdruck und verändert das Glossar daher nicht', () => {
    expect(generiert.every((s) => !s.markdown.includes('**'))).toBe(true);
    const ohne = {
      ...content,
      topics: content.topics.map((t) => (t.id === '17' ? { ...t, sections: t.sections.filter((s) => !s.generiert) } : t)),
    };
    expect(baueGlossar(ohne).map((e) => e.begriff)).toEqual(glossar.map((e) => e.begriff));
  });

  it('mit Begriffsseite: Begriff als Link, eckige Klammern maskiert', () => {
    const e = { id: 'a-b', begriff: 'Wert [x]', quellen: [], buchstabe: 'W' };
    expect(glossarZeile(e, true)).toBe(String.raw`- [Wert \[x\]](#/glossar/a-b)`);
    expect(glossarZeile(e)).toBe('- Wert [x]');
  });

  it('Zeilenformat: Begriff – Definition (einzeilig) *(Fundstellen)*', () => {
    expect(
      glossarZeile({
        id: 'x',
        begriff: 'X',
        definition: 'Erste **fette**\nZeile',
        quellen: [{ art: 'abschnitt', titel: 'Deep Dive 3 · 2.1', link: '' }],
        buchstabe: 'X',
      }),
    ).toBe('- X – Erste fette Zeile *(DD 3)*');
  });

  it('ohne Platzhalter bleibt der Inhalt unverändert', () => {
    const kopie = structuredClone({ ...content, topics: content.topics.filter((t) => t.id !== '17') });
    const vorher = JSON.stringify(kopie);
    ergaenzeGlossarThema(kopie);
    expect(JSON.stringify(kopie)).toBe(vorher);
  });

  it('die Suche indexiert weder die eingesetzte Liste noch SVG-Markup', () => {
    const index = baueSuchIndex(content, defaultSettings());
    expect(index.some((e) => e.link.includes('stelle=17-begriffe-'))).toBe(false);
    expect(klartext('Vor\n```svg\n<svg><text>Kunde</text></svg>\n```\nNach')).toBe('Vor Nach');
  });
});
