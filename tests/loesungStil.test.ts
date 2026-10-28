import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { Markdown } from '../src/components/Markdown';
import MathMarkdown from '../src/components/MathMarkdown';
import { istErgebnis, istSummenZeile, istZahlZelle, punkteArt } from '../src/lib/loesungStil';
import { solutionMarkdown } from '../src/lib/sheets';

const loesung = (md: string) => renderToStaticMarkup(createElement(MathMarkdown, { children: md, loesung: true, source: false }));
const plain = (md: string) => renderToStaticMarkup(createElement(Markdown, { children: md }));
const ERGEBNIS = /<span class="ergebnis"><span class="ergebnis-label">Ergebnis<\/span><strong>(.*?)<\/strong><\/span>/g;
const ergebnisse = (html: string) => [...html.matchAll(ERGEBNIS)].map((m) => m[1]);

describe('punkteArt', () => {
  it('kurze Punkteangaben werden Abzeichen, lange ein Hinweis', () => {
    expect(punkteArt('(3 P)')).toBe('abzeichen');
    expect(punkteArt('(1,5 P)')).toBe('abzeichen');
    expect(punkteArt('(je 2 P)')).toBe('abzeichen');
    expect(punkteArt('(je 4 P: 1 P Formel, 2 P Rechenweg, 1 P Ergebnis)')).toBe('hinweis');
    expect(punkteArt('(2 P Berechnung, 2 P Beurteilung)')).toBe('hinweis');
  });

  it('anderer kursiver Text bleibt', () => {
    expect(punkteArt('(siehe oben)')).toBeNull();
    expect(punkteArt('Prüferkommentar: 3 P')).toBeNull();
    expect(punkteArt('3 P')).toBeNull();
  });
});

describe('istErgebnis (vorsichtig)', () => {
  it('Zahl mit Einheit direkt nach =, ≈ oder →', () => {
    expect(istErgebnis('70,00 Minuten', 'Arithmetisches Mittel = 770 / 11 = ')).toBe(true);
    expect(istErgebnis('93,33 %', '= 840/900 = ')).toBe(true);
    expect(istErgebnis('1.080,00 €', 'Kosten = ')).toBe(true);
    expect(istErgebnis('4 (Tage²)', 'σ² = 20 / 5 = ')).toBe(true);
    expect(istErgebnis('+15,00 %', '= 0,15 = ')).toBe(true);
    expect(istErgebnis('55 Minuten', 'Position 6 → ')).toBe(true);
    expect(istErgebnis('5,40 € je Auftrag', '1.080 € / 200 = ')).toBe(true);
  });

  it('fette Gleichung oder Angabe, die auf Zahl + Einheit endet', () => {
    expect(istErgebnis('IQR = 70 − 40 = 30 Minuten', '- ')).toBe(true);
    expect(istErgebnis('Projektdauer: 25 Tage', '')).toBe(true);
  });

  it('gewöhnlicher Fettdruck bleibt', () => {
    expect(istErgebnis('84 %', 'decken kumuliert ')).toBe(false); // kein „=“ davor
    expect(istErgebnis('nominal', 'Kundennummer → ')).toBe(false); // keine Zahl
    expect(istErgebnis('Drei', '')).toBe(false);
    expect(istErgebnis('−5', 'Unterer Zaun = 40 − 45 = ')).toBe(false); // ohne Einheit
    expect(istErgebnis('Q1 = 40', '→ ')).toBe(false);
    expect(istErgebnis('TP = 90', '')).toBe(false);
    expect(istErgebnis('−2 P', '→ ')).toBe(false); // Punkteabzug ist kein Ergebnis
    expect(istErgebnis('Recht auf Löschung (Art. 17):', '')).toBe(false);
    expect(istErgebnis('Pareto-Prinzip (80/20-Regel)', '')).toBe(false);
  });
});

describe('Tabellen-Hilfen', () => {
  it('istZahlZelle', () => {
    for (const t of ['18', '36,0', '1.000', '−3', 'Σ 25', '12,5 %', '2.299,75 €', '4 P']) expect(istZahlZelle(t), t).toBe(true);
    for (const t of ['Transportschaden', '01.03.2026', 'K-001', '1:n', '2 von 5', '']) expect(istZahlZelle(t), t).toBe(false);
  });

  it('istSummenZeile', () => {
    for (const t of ['Summe', '**Summe**', 'Σ 25', 'Gesamt', 'Gesamtkosten']) expect(istSummenZeile(t.replace(/\*/g, '')), t).toBe(true);
    for (const t of ['Transportschaden', 'Zwischensumme A']) expect(istSummenZeile(t), t).toBe(false);
  });
});

describe('rehypeLoesung (gerendert)', () => {
  it('Punkte am Zeilenende rechts, danach neue Zeile; mitten im Satz inline', () => {
    const html = loesung('Satz eins. *(2 P)*\nSatz zwei *(je 1 P)*: weiter. *(3 P)*');
    expect(html).toContain('<p class="mit-punkte">Satz eins. <span class="punkte rechts">2 P</span><br/>');
    expect(html).toContain('Satz zwei <span class="punkte">je 1 P</span>: weiter. <span class="punkte rechts">3 P</span></p>');
    expect(html).not.toContain('<em>');
  });

  it('lange Punkteangabe bleibt als Hinweis im Text', () => {
    expect(loesung('**B2 (20 P):** *(je 4 P: 1 P Formel, 2 P Rechenweg, 1 P Ergebnis)*')).toContain(
      '<span class="punkte-hinweis">(je 4 P: 1 P Formel, 2 P Rechenweg, 1 P Ergebnis)</span>',
    );
  });

  it('Ergebnis-Kasten nur für echte Endergebnisse', () => {
    const md = [
      '- Arithmetisches Mittel = 770 / 11 = **70,00 Minuten** *(3 P)*',
      '- Modus = **40 Minuten** (einziger doppelt vorkommender Wert) *(2 P)*',
      '- **Accuracy** = (TP + TN) / n = **93,00 %**',
      '',
      '**Drei** Fehlerarten decken kumuliert **84 %** ab.',
      '',
      '| Grund | h |',
      '|---|---|',
      '| **Summe** | **50** = **50 Stück** |',
    ].join('\n');
    expect(ergebnisse(loesung(md))).toEqual(['70,00 Minuten', '40 Minuten', '93,00 %']);
  });

  it('Rechenweg als Formel ($…$), Endergebnis fett dahinter: Kasten bleibt, Formel wird gesetzt (Roadmap 4.4)', () => {
    const md = [
      '- Arithmetisches Mittel: $\\bar{x} = \\frac{\\sum x_i}{n} = \\frac{770}{11}$ = **70,00 Minuten** *(3 P)*',
      '- Standardabweichung: $\\sigma = \\sqrt{4}$ = **2,00 Tage**',
      '- Unterer Zaun: $Q_1 - 1{,}5 \\cdot \\text{IQR} = 40 - 45$ = **−5** *(2 P)*',
      '- Quote: $\\frac{18}{20} = 0{,}9$ ≈ **90,0 %**',
    ].join('\n');
    const html = loesung(md);
    expect(ergebnisse(html)).toEqual(['70,00 Minuten', '2,00 Tage', '90,0 %']);
    expect(html.match(/class="katex"/g)).toHaveLength(4);
    expect(html).not.toContain('katex-error');
    expect(html.match(/class="punkte rechts"/g)).toHaveLength(2);
    // Ein Ergebnis in der Formel (\mathbf) wird nicht erkannt – deshalb steht es im Lernblatt dahinter.
    expect(ergebnisse(loesung('$\\bar{x} = \\mathbf{70{,}00\\ \\text{min}}$ *(3 P)*'))).toEqual([]);
  });

  it('Prüferkommentar als Absatz und als Zitat (Lösungsblatt) wird ein Kasten', () => {
    const box =
      '<aside class="pk-box"><div class="pk-label">Prüferkommentar</div><p>2 P Ansatz, 2 P Ergebnis. Nicht <strong>(45+70)/2</strong>.</p></aside>';
    expect(loesung('Text\n\n*Prüferkommentar: 2 P Ansatz, 2 P Ergebnis. Nicht **(45+70)/2**.*')).toContain(box);
    expect(loesung('> *Prüferkommentar: 2 P Ansatz, 2 P Ergebnis. Nicht **(45+70)/2**.*')).toBe(`<div class="md ">${box}</div>`);
    // Ergebnisse im Kommentar (oft falsche Werte) werden nicht hervorgehoben.
    expect(ergebnisse(loesung('*Prüferkommentar: falsch wäre = **75 %**.*'))).toEqual([]);
  });

  it('ohne loesung und im normalen Markdown bleibt der Text unverändert', () => {
    const md = 'Mittel = **70 Minuten** *(3 P)*\n\n*Prüferkommentar: x*';
    for (const html of [plain(md), renderToStaticMarkup(createElement(MathMarkdown, { children: md }))]) {
      expect(html).toContain('<strong>70 Minuten</strong> <em>(3 P)</em>');
      expect(html).not.toContain('pk-box');
    }
  });
});

describe('rehypeTabellen (überall)', () => {
  it('Zahlenspalten rechtsbündig, Summenzeile markiert, ausdrücklich ausgerichtete Spalten bleiben', () => {
    const html = plain(
      [
        '| Grund | h | f in % | Anm. | x |',
        '|---|---|---|---|:-:|',
        '| Transport | 18 | 36,0 | – | 1 |',
        '| Montage | 15 | 30,0 | neu | 2 |',
        '| **Summe** | **33** | **66,0** | | 3 |',
      ].join('\n'),
    );
    expect(html).toContain(
      '<th>Grund</th><th class="num">h</th><th class="num">f in %</th><th>Anm.</th><th style="text-align:center">x</th>',
    );
    expect(html).toContain('<tr class="sum-row"><td><strong>Summe</strong></td><td class="num"><strong>33</strong></td>');
    expect(html).toContain('<tr><td>Transport</td><td class="num">18</td>');
  });

  it('leere Ecke oben links: erste Spalte wird Zeilenkopf', () => {
    const html = plain(['| | Klassifikation | Regression |', '|---|---|---|', '| Zielvariable | Kategorie | Zahl |'].join('\n'));
    expect(html).toContain('<tr><th scope="row">Zielvariable</th><td>Kategorie</td><td>Zahl</td></tr>');
    expect(plain(['| A | B |', '|---|---|', '| x | y |'].join('\n'))).toContain('<tr><td>x</td><td>y</td></tr>');
  });
});

describe('Echte Musterlösungen in content/', () => {
  const content = loadContent(CONTENT_DIR);
  const render = (id: string) => loesung(solutionMarkdown(content.tasks[id]));

  it('DD3 C1 und DD7 B2: Ergebnisse im Kasten, Punkte als Abzeichen, Prüferkommentar im Kasten', () => {
    const c1 = render('03-B1');
    expect(ergebnisse(c1)).toEqual(['70,00 Minuten', '55 Minuten', '40 Minuten']);
    expect(c1.match(/class="punkte rechts"/g)).toHaveLength(4);
    expect(c1).toContain('<div class="pk-label">Prüferkommentar</div><p>Wer nicht sortiert');
    expect(ergebnisse(render('07-B2'))).toEqual(['93,00 %', '60,00 %', '90,00 %', '72,00 %', '93,33 %']);
  });

  it('DD3 E2: Zäune ohne Einheit bleiben normaler Fettdruck', () => {
    expect(ergebnisse(render('03-D2'))).toEqual([]);
  });

  it('jede kurze Punkteangabe *(… P)* wird umgewandelt', () => {
    for (const t of Object.values(content.tasks)) {
      const html = render(t.id);
      expect(html, t.id).not.toMatch(/<em>\([^<]*\d P\)<\/em>/);
    }
  });
});
