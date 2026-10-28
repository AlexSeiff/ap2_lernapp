import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { emptyProgress } from '../shared/progress';
import { ConfirmContext } from '../src/hooks/useConfirm';
import {
  achse,
  ausreisserListe,
  boxplotZahlen,
  gleicheBoxplotAb,
  leereBoxplotAntwort,
  musterBoxplot,
  pruefeBoxplot,
  type BoxplotAntwort,
} from '../src/lib/boxplotAntwort';
import { antwortAlsText, editorFuer, leseEditorAntwort, schreibeEditorAntwort } from '../src/lib/editorAufgabe';

// Boxplot als Antwort (03-D3 „Skizzieren Sie den Boxplot maßstäblich“): Kennwerte eintragen, die App zeichnet.

const content = loadContent(CONTENT_DIR);
const task = (id: string) => content.tasks[id];

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { default: EditorAntwort, EditorPruefung } = await import('../src/components/EditorAntwort');

const html = (el: ReturnType<typeof createElement>) =>
  renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, el)).replace(/<!-- -->/g, '');

const antwort = (min: string, q1: string, median: string, q3: string, max: string, ausreisser = ''): BoxplotAntwort => ({
  editor: 'boxplot',
  werte: { min, q1, median, q3, max },
  ausreisser,
});
const richtig = antwort('35', '40', '55', '70', '90', '220');

describe('Erkennung und Musterlösung', () => {
  it('Boxplot skizzieren → Boxplot-Eingabe, Boxplot erklären → Textfeld', () => {
    expect(editorFuer(task('03-D3'))).toBe('boxplot');
    expect(editorFuer({ markdown: '*Erläutern* Sie, was ein Boxplot zeigt.', type: 'offen' })).toBeUndefined();
  });

  it('Kennwerte aus den erforderlichen Elementen der Lösung 03-D3', () => {
    expect(musterBoxplot(task('03-D3'))).toEqual({ min: 35, q1: 40, median: 55, q3: 70, max: 90, ausreisser: [220] });
    expect(musterBoxplot({ solution: { markdown: 'Keine Angaben.' } })).toBeUndefined();
  });
});

describe('Eingabe und Formprüfung', () => {
  it('Zahlen mit Komma, Ausreißer mit ; oder Leerzeichen', () => {
    expect(ausreisserListe('220; 5 und 7,5')).toEqual({ zahlen: [5, 7.5, 220], ungueltig: [] });
    expect(ausreisserListe('220, 5').ungueltig).toEqual([]);
    expect(boxplotZahlen(antwort('35', '40', '55,5', '70', '90'))?.median).toBe(55.5);
    expect(boxplotZahlen(antwort('35', '40', '', '70', '90'))).toBeUndefined();
  });

  it('meldet Logikfehler, verrät aber nichts über die Lösung', () => {
    expect(pruefeBoxplot(richtig)).toEqual([]);
    // Typischer Fehler: oberer Whisker bis zum Zaun – formal in Ordnung, erst der Abgleich zeigt ihn.
    expect(pruefeBoxplot(antwort('35', '40', '55', '70', '115', '220'))).toEqual([]);
    expect(pruefeBoxplot(antwort('35', '70', '55', '40', '90')).join(' ')).toMatch(/aufsteigen/);
    expect(pruefeBoxplot(antwort('35', '40', '55', '70', '90', '80')).join(' ')).toMatch(/80 liegt innerhalb/);
    expect(pruefeBoxplot(antwort('35', 'vierzig', '55', '70', '90')).join(' ')).toMatch(/keine Zahl/);
  });

  it('leer bleibt leer, Inhalt übersteht den Weg über den String, Text für die KI', () => {
    expect(schreibeEditorAntwort(leereBoxplotAntwort())).toBe('');
    expect(leseEditorAntwort('boxplot', task('03-D3'), schreibeEditorAntwort(richtig))).toEqual(richtig);
    expect(leseEditorAntwort('boxplot', task('03-D3'), 'Box von 40 bis 70').notiz).toBe('Box von 40 bis 70');
    expect(antwortAlsText(task('03-D3'), JSON.stringify(richtig))).toBe(
      'Boxplot – unteres Whisker-Ende: 35 · Q1 (Box links): 40 · Median: 55 · Q3 (Box rechts): 70 · oberes Whisker-Ende: 90 · Ausreißer: 220',
    );
  });

  it('Achse mit runden Teilstrichen schließt alle Werte ein', () => {
    expect(achse([35, 220])).toEqual({ von: 0, bis: 250, schritt: 50, striche: [0, 50, 100, 150, 200, 250] });
    const a = achse([2, 8]);
    expect(a.von).toBeLessThanOrEqual(2);
    expect(a.bis).toBeGreaterThanOrEqual(8);
  });
});

describe('Abgleich und Darstellung', () => {
  it('richtiger Boxplot passt überall, Whisker bis zum Zaun fällt auf', () => {
    expect(gleicheBoxplotAb(task('03-D3'), richtig)!.zeilen.every((z) => z.ok)).toBe(true);
    const zaun = gleicheBoxplotAb(task('03-D3'), antwort('35', '40', '55', '70', '115', '220'))!;
    expect(zaun.zeilen.filter((z) => !z.ok).map((z) => z.name)).toEqual(['oberes Whisker-Ende']);
    const ohne = gleicheBoxplotAb(task('03-D3'), antwort('35', '40', '55', '70', '220'))!;
    expect(ohne.zeilen.find((z) => z.name === 'Ausreißer')).toMatchObject({ dein: 'keine', muster: '220', ok: false });
  });

  const editor = (value?: string, disabled = false) =>
    html(createElement(EditorAntwort, { task: task('03-D3'), art: 'boxplot', value, onChange: () => {}, disabled, hilfen: true }));

  it('leer: Felder und Hinweis, keine Werte der Lösung', () => {
    const h = editor();
    expect(h).toContain('unteres Whisker-Ende');
    expect(h).toContain('Sobald alle fünf Kennwerte eingetragen sind');
    expect(h).not.toContain('bp-zeichnung');
    expect(h).not.toMatch(/value="(35|40|55|70|90|220)"/);
  });

  it('ausgefüllt: maßstäbliche Zeichnung mit Formprüfung; nach der Abgabe ohne Felder', () => {
    const h = editor(JSON.stringify(richtig));
    expect(h).toContain('aria-label="Boxplot: Whisker von 35 bis 90, Box von 40 bis 70, Median 55, Ausreißer 220"');
    expect(h).toContain('Keine Formfehler gefunden');
    const abgegeben = editor(JSON.stringify(richtig), true);
    expect(abgegeben).toContain('Deine Lösung');
    expect(abgegeben).not.toContain('<input');
  });

  it('beim Bewerten: beide Boxplots und die Werte im Vergleich', () => {
    const p = html(
      createElement(EditorPruefung, {
        task: task('03-D3'),
        art: 'boxplot',
        answer: JSON.stringify(antwort('35', '40', '55', '70', '115', '220')),
      }),
    );
    expect(p).toContain('Abgleich mit dem Boxplot der Musterlösung');
    expect(p).toContain('Dein Boxplot');
    expect(p).toContain('Musterlösung</text>');
    expect(p).toContain('<td class="wt-abweichend">115</td>');
  });
});
