import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { emptyProgress } from '../shared/progress';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { antwortAlsText, editorFuer, leseEditorAntwort, schreibeEditorAntwort } from '../src/lib/editorAufgabe';
import {
  entferne,
  fuegeAn,
  leereStruktogrammAntwort,
  neuerBaustein,
  pruefeStruktogramm,
  setzeText,
  struktogrammAlsText,
  verschiebe,
  type Baustein,
  type StruktogrammAntwort,
} from '../src/lib/struktogramm';

// Struktogramm-Baukasten (11-D2 „Zeichnen Sie ein Struktogramm“): Bausteine als Baum, Formprüfung, Gliederung, Darstellung.

const content = loadContent(CONTENT_DIR);
const task = (id: string) => content.tasks[id];

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { default: EditorAntwort, EditorPruefung } = await import('../src/components/EditorAntwort');

const html = (el: ReturnType<typeof createElement>) =>
  renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, el)).replace(/<!-- -->/g, '');

const anw = (id: string, text: string): Baustein => ({ id, art: 'anweisung', text });

/** Die Musterlösung von 11-D2 als Bausteine. */
const muster: StruktogrammAntwort = {
  editor: 'struktogramm',
  bausteine: [
    anw('a', 'fehlerzaehler ← 0'),
    {
      id: 'f',
      art: 'solange',
      text: 'FÜR i VON 1 BIS n',
      rumpf: [
        {
          id: 'w1',
          art: 'wenn',
          text: 'E-Mail vorhanden?',
          ja: [{ id: 'w2', art: 'wenn', text: 'Format gültig?', ja: [], nein: [anw('z1', 'fehlerzaehler ← fehlerzaehler + 1')] }],
          nein: [anw('z2', 'fehlerzaehler ← fehlerzaehler + 1'), anw('p', 'Datensatz protokollieren')],
        },
      ],
    },
    anw('o', 'AUSGABE fehlerzaehler'),
  ],
};

describe('Erkennung', () => {
  it('Struktogramm zeichnen → Baukasten, Struktogramm-Fragen und Pseudocode → Textfeld', () => {
    expect(editorFuer(task('11-D2'))).toBe('struktogramm');
    expect(editorFuer({ markdown: '*Nennen* Sie zwei Vorteile eines Struktogramms.', type: 'offen' })).toBeUndefined();
    expect(editorFuer({ markdown: '*Ergänzen* Sie den Pseudocode.', type: 'offen' })).toBeUndefined();
  });
});

describe('Bausteine bearbeiten', () => {
  it('anfügen in Wurzel, Zweig und Rumpf; Text setzen; verschieben; entfernen', () => {
    let l: Baustein[] = [];
    l = fuegeAn(l, { in: 'wurzel' }, neuerBaustein('wenn', 'w'));
    l = fuegeAn(l, { in: 'w', teil: 'nein' }, neuerBaustein('solange', 's'));
    l = fuegeAn(l, { in: 's', teil: 'rumpf' }, neuerBaustein('anweisung', 'x'));
    l = fuegeAn(l, { in: 's', teil: 'rumpf' }, neuerBaustein('anweisung', 'y'));
    l = setzeText(l, 'x', 'erst');
    l = setzeText(l, 'y', 'dann');
    const rumpf = (liste: Baustein[]): Baustein[] => ((liste[0] as { nein: Baustein[] }).nein[0] as { rumpf: Baustein[] }).rumpf;
    expect(rumpf(l).map((b) => b.text)).toEqual(['erst', 'dann']);
    l = verschiebe(l, 'y', -1);
    expect(rumpf(l).map((b) => b.text)).toEqual(['dann', 'erst']);
    expect(verschiebe(l, 'y', -1)).toEqual(l); // schon oben
    l = entferne(l, 'y');
    expect(rumpf(l).map((b) => b.id)).toEqual(['x']);
  });

  it('leer bleibt leer, Inhalt übersteht den Weg über den String, alter Text landet in den Anmerkungen', () => {
    expect(schreibeEditorAntwort(leereStruktogrammAntwort())).toBe('');
    expect(leseEditorAntwort('struktogramm', task('11-D2'), schreibeEditorAntwort(muster))).toEqual(muster);
    expect(leseEditorAntwort('struktogramm', task('11-D2'), 'FÜR jeden Datensatz …').notiz).toBe('FÜR jeden Datensatz …');
  });
});

describe('Formprüfung und Gliederung', () => {
  it('die Musterlösung ist formal in Ordnung (leerer Ja-Zweig ist erlaubt)', () => {
    expect(pruefeStruktogramm(muster)).toEqual([]);
  });

  it('meldet leere Texte, leere Schleifen und Verzweigungen ohne Inhalt', () => {
    const a: StruktogrammAntwort = {
      editor: 'struktogramm',
      bausteine: [
        anw('a', ''),
        { id: 'w', art: 'wenn', text: '', ja: [], nein: [] },
        { id: 's', art: 'wiederhole', text: 'x > 3', rumpf: [] },
      ],
    };
    const m = pruefeStruktogramm(a).join(' | ');
    expect(m).toMatch(/Anweisung ist leer/);
    expect(m).toMatch(/Verzweigung hat keine Bedingung/);
    expect(m).toMatch(/zwei leere Zweige/);
    expect(m).toMatch(/„x > 3“ hat keinen Rumpf/);
  });

  it('Gliederung als Pseudocode für die KI-Bewertung', () => {
    expect(antwortAlsText(task('11-D2'), JSON.stringify(muster))).toBe(
      [
        'Struktogramm:',
        'fehlerzaehler ← 0',
        'FÜR i VON 1 BIS n',
        '  WENN E-Mail vorhanden?',
        '    ja:',
        '      WENN Format gültig?',
        '        ja:',
        '          ∅',
        '        nein:',
        '          fehlerzaehler ← fehlerzaehler + 1',
        '    nein:',
        '      fehlerzaehler ← fehlerzaehler + 1',
        '      Datensatz protokollieren',
        'AUSGABE fehlerzaehler',
      ].join('\n'),
    );
    const fuss: StruktogrammAntwort = {
      editor: 'struktogramm',
      bausteine: [{ id: 'r', art: 'wiederhole', text: 'eingabe gültig', rumpf: [anw('e', 'eingabe lesen')] }],
    };
    expect(struktogrammAlsText(fuss)).toBe('Struktogramm:\nWIEDERHOLE\n  eingabe lesen\nBIS eingabe gültig');
  });
});

describe('Darstellung', () => {
  const editor = (value?: string, disabled = false) =>
    html(createElement(EditorAntwort, { task: task('11-D2'), art: 'struktogramm', value, onChange: () => {}, disabled, hilfen: true }));

  it('leer: Baukasten mit „+ Baustein“, keine Inhalte der Lösung', () => {
    const h = editor();
    expect(h).toContain('Bau dein Struktogramm aus Bausteinen');
    expect(h).toContain('+ Baustein');
    expect(h).toContain('Verzweigung (ja/nein)');
    expect(h).not.toMatch(/fehlerzaehler|E-Mail vorhanden/);
  });

  it('gebaut: Kästen mit Dreieck und ja/nein, Schleifenbalken, ∅ für den leeren Zweig', () => {
    const h = editor(JSON.stringify(muster));
    expect(h.match(/class="sg-b sg-wenn"/g)).toHaveLength(2);
    expect(h).toContain('class="sg-b sg-schleife sg-solange"');
    expect(h).toContain('>∅</div>');
    expect(h).toContain('value="E-Mail vorhanden?"');
    expect(h).toContain('Keine Formfehler gefunden');
  });

  it('nach der Abgabe ohne Bedienelemente, beim Bewerten Gliederung', () => {
    const h = editor(JSON.stringify(muster), true);
    expect(h).toContain('<span class="sg-text">Format gültig?</span>');
    expect(h).not.toMatch(/<input|<select|sg-aktionen/);
    const p = html(createElement(EditorPruefung, { task: task('11-D2'), art: 'struktogramm', answer: JSON.stringify(muster) }));
    expect(p).toContain('Gliederung deines Struktogramms');
    expect(p).toContain('WENN Format gültig?');
  });
});
