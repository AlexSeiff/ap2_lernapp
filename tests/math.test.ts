import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import katex from 'katex';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR } from '../build/inhalt';
import MathMarkdown from '../src/components/MathMarkdown';
import { escapeStrayDollars } from '../src/lib/mathDollar';

const render = (md: string) => renderToStaticMarkup(createElement(MathMarkdown, { children: md }));

describe('escapeStrayDollars', () => {
  it('lässt echte Formeln unverändert', () => {
    for (const md of [
      '$\\bar{x} = \\frac{770}{11} = \\mathbf{70{,}00\\ \\text{min}}$ *(3 P)*',
      'Mittel $x$ und Median $y$.',
      '$$\n\\sigma = \\sqrt{4}\n$$',
      'Blockformel $$a^2 + b^2$$ inline',
      'Schon maskiert: 5 \\$ und 3 \\$',
    ])
      expect(escapeStrayDollars(md)).toBe(md);
  });

  it('maskiert Dollarzeichen, die keine Formel begrenzen (Preise)', () => {
    expect(escapeStrayDollars('Kosten 5 $ und 3 $')).toBe('Kosten 5 \\$ und 3 \\$');
    expect(escapeStrayDollars('Preis $5 bis $10')).toBe('Preis \\$5 bis \\$10');
    expect(escapeStrayDollars('Nur ein $ hier')).toBe('Nur ein \\$ hier');
    expect(escapeStrayDollars('$x$5')).toBe('\\$x\\$5');
  });

  it('lässt Code unverändert (Inline-Code und ```-Blöcke)', () => {
    const md = 'Parameter `$1` und ``a $ b``\n\n```sql\nSELECT $1, 5 $;\n```\n\nText 5 $';
    expect(escapeStrayDollars(md)).toBe('Parameter `$1` und ``a $ b``\n\n```sql\nSELECT $1, 5 $;\n```\n\nText 5 \\$');
  });

  it('echte Inhalte in content/ enthalten kein Dollarzeichen, das umgedeutet würde', () => {
    for (const f of readdirSync(CONTENT_DIR).filter((f) => /\.(md|json)$/.test(f))) {
      const text = readFileSync(join(CONTENT_DIR, f), 'utf8');
      expect(escapeStrayDollars(text), f).toBe(text);
    }
  });
});

describe('MathMarkdown (KaTeX)', () => {
  it('setzt $…$ und $$…$$ mit KaTeX', () => {
    const html = render('Mittel: $\\bar{x} = \\frac{770}{11}$\n\n$$\n\\sigma^2 = 4\n$$');
    expect(html).toContain('class="katex"');
    expect(html).toContain('katex-display');
    expect(html).toContain('<annotation encoding="application/x-tex">\\bar{x} = \\frac{770}{11}</annotation>');
  });

  it('macht aus Preisen keine Formel', () => {
    const html = render('Kosten 5 $ und 3 $');
    expect(html).not.toContain('katex');
    expect(html).toContain('Kosten 5 $ und 3 $');
  });

  it('ein Formelfehler bricht nicht ab', () => {
    expect(render('Kaputt: $\\frac{1$')).toContain('Kaputt');
  });
});

/** Alle Inline-Formeln `$…$` einer Datei (außerhalb von Code), nach der Pandoc-Regel wie `escapeStrayDollars`. */
function formeln(markdown: string): string[] {
  const out: string[] = [];
  let fence = false;
  for (const line of markdown.split('\n')) {
    if (/^\s{0,3}(`{3,}|~{3,})/.test(line)) fence = !fence;
    if (fence) continue;
    const ohneCode = line.replace(/`+[^`]*`+/g, '');
    for (const m of ohneCode.matchAll(/(?<![\\$])\$(?!\s)([^$]+?)(?<!\s)\$(?![\d$])/g)) out.push(m[1]);
  }
  return out;
}

describe('Formeln in content/ (Roadmap 4.4)', () => {
  const dateien = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));

  it('jede Formel lässt sich mit KaTeX setzen', () => {
    let anzahl = 0;
    for (const f of dateien) {
      for (const tex of formeln(readFileSync(join(CONTENT_DIR, f), 'utf8'))) {
        anzahl++;
        expect(() => katex.renderToString(tex, { throwOnError: true, strict: 'ignore' }), `${f}: ${tex}`).not.toThrow();
      }
    }
    expect(anzahl).toBeGreaterThanOrEqual(180); // Stand Roadmap 4.4: 182 Formeln in Lösungen und Theorie
  });

  it('Endergebnisse stehen fett hinter der Formel, nicht als \\mathbf in ihr (sonst kein Ergebnis-Kasten)', () => {
    for (const f of dateien) {
      for (const tex of formeln(readFileSync(join(CONTENT_DIR, f), 'utf8'))) expect(tex, `${f}: ${tex}`).not.toMatch(/\\mathbf|\\boxed/);
    }
  });
});
