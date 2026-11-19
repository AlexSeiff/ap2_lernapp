// Koordinatensystem als Antwort („Zeichnen Sie … in ein Koordinatensystem“): Achsen, Datenpunkte, Geraden, Abgleich, Speichern.

import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { editorFuer, leseEditorAntwort, schreibeEditorAntwort } from '../src/lib/editorAufgabe';
import {
  achsenAusText,
  achsenFuer,
  datenpunkte,
  geradenAusText,
  geradeImBereich,
  gesuchtePunkte,
  gleicheGerade,
  gleicheKoordinatenAb,
  koordinatenAlsText,
  kontextAus,
  leereKoordinatenAntwort,
  leseGerade,
  pruefeKoordinaten,
  type KoordinatenAntwort,
} from '../src/lib/koordinatenAntwort';

const content = loadContent(CONTENT_DIR);
const a1 = { ...content.tasks['29-A1'], kontext: kontextAus(content.topics, content.tasks['29-A1']) };
const a4 = { ...content.tasks['29-A4'], kontext: kontextAus(content.topics, content.tasks['29-A4']) };

describe('Erkennung', () => {
  it('29-A1 (nur zeichnen) bekommt den Koordinatensystem-Editor, 29-A4 (zeichnen und Tabelle) die Wertetabelle', () => {
    expect(editorFuer(a1)).toBe('koordinaten');
    expect(editorFuer(a4)).toBe('werte');
  });

  it('nur Zeichen-Aufgaben mit Koordinatensystem; Beschreiben, Beurteilen u. Ä. bleiben Text', () => {
    const t = (markdown: string) => editorFuer({ markdown, type: 'offen' });
    expect(t('*Zeichnen* Sie die Punkte in ein Koordinatensystem.')).toBe('koordinaten');
    expect(t('*Skizzieren* Sie die Gerade im Koordinatensystem.')).toBe('koordinaten');
    expect(t('*Beschreiben* Sie, was im Koordinatensystem zu sehen ist.')).toBeUndefined();
    expect(t('*Zeichnen* Sie einen Boxplot.')).toBe('boxplot');
  });
});

describe('Achsen', () => {
  it('liest „x-Achse 0 bis 10, y-Achse 0 bis 13“ aus dem Aufgabentext', () => {
    expect(achsenAusText(a1.markdown)).toEqual({ xVon: 0, xBis: 10, yVon: 0, yBis: 13 });
    expect(achsenAusText('x-Achse −2 bis 6,5 und y-Achse von 0 bis 100')).toEqual({ xVon: -2, xBis: 6.5, yVon: 0, yBis: 100 });
    expect(achsenAusText('x-Achse 0 bis 10')).toBeUndefined();
    expect(achsenAusText('x-Achse 10 bis 0, y-Achse 0 bis 5')).toBeUndefined();
  });

  it('ohne Angabe im Text: aus der Datentabelle (größter Wert + 1), sonst 0 bis 10', () => {
    expect(achsenFuer(a4)).toEqual({ xVon: 0, xBis: 10, yVon: 0, yBis: 13 });
    expect(achsenFuer({ markdown: 'Zeichnen Sie etwas in ein Koordinatensystem.' })).toEqual({ xVon: 0, xBis: 10, yVon: 0, yBis: 10 });
  });
});

describe('Datenpunkte der Aufgabe', () => {
  it('liest die Tabelle mit Zeilenname, x, y und Klasse', () => {
    const d = datenpunkte(a1);
    expect(d).toHaveLength(20);
    expect(d[0]).toEqual({ label: 'Training 1', x: 2, y: 9, klasse: 'G' });
    expect(d.find((p) => p.label === 'Test 1')).toEqual({ label: 'Test 1', x: 3.5, y: 10.5, klasse: 'G' });
  });

  it('A1: nur die Trainingsdaten („nicht die Testdaten“), A4: nur die Testdaten', () => {
    const g1 = gesuchtePunkte(a1);
    expect(g1).toHaveLength(15);
    expect(g1.every((p) => p.label.startsWith('Training'))).toBe(true);
    const g4 = gesuchtePunkte(a4);
    expect(g4).toHaveLength(5);
    expect(g4.every((p) => p.label.startsWith('Test'))).toBe(true);
  });
});

describe('Geraden', () => {
  it('liest Gleichungen in üblichen Schreibweisen', () => {
    expect(leseGerade('y = 7,5')).toEqual({ art: 'y', m: 0, b: 7.5 });
    expect(leseGerade('y = 1,5 · x − 1')).toEqual({ art: 'y', m: 1.5, b: -1 });
    expect(leseGerade('y=-x+2')).toEqual({ art: 'y', m: -1, b: 2 });
    expect(leseGerade('y = x')).toEqual({ art: 'y', m: 1, b: 0 });
    expect(leseGerade('y = 3 + 0,5x')).toEqual({ art: 'y', m: 0.5, b: 3 });
    expect(leseGerade('f(x) = 2*x - 4')).toEqual({ art: 'y', m: 2, b: -4 });
    expect(leseGerade('x = 4')).toEqual({ art: 'x', x: 4 });
  });

  it('Unlesbares ergibt undefined', () => {
    for (const t of ['', 'y', 'y =', '7,5', 'y = 2x²', 'y = a·x + b', 'z = 3']) expect(leseGerade(t), t).toBeUndefined();
  });

  it('gleicheGerade vergleicht Steigung und Achsenabschnitt', () => {
    expect(gleicheGerade(leseGerade('y = 1,5x − 1')!, leseGerade('y = 1,5 · x - 1,0')!)).toBe(true);
    expect(gleicheGerade(leseGerade('y = 1,5x')!, leseGerade('y = 1,5x − 1')!)).toBe(false);
    expect(gleicheGerade(leseGerade('x = 2')!, leseGerade('y = 2')!)).toBe(false);
  });

  it('findet die Gleichungen im Aufgabentext', () => {
    expect(geradenAusText(a1.markdown).map((g) => g.text)).toEqual(['y = 7,5', 'y = 1,5 · x − 1']);
    expect(geradenAusText('Gerade: y = 2x + 1; Sie rechnen mit x = 4.').map((g) => g.text)).toEqual(['y = 2x + 1', 'x = 4']);
  });

  it('Endpunkte im Bereich: schräg, waagerecht, senkrecht, außerhalb', () => {
    const achsen = { xVon: 0, xBis: 10, yVon: 0, yBis: 13 };
    expect(geradeImBereich({ art: 'y', m: 0, b: 7.5 }, achsen)).toEqual([
      [0, 7.5],
      [10, 7.5],
    ]);
    expect(geradeImBereich({ art: 'y', m: 1.5, b: -1 }, achsen)).toEqual([
      [0, -1],
      [10, 14],
    ]);
    expect(geradeImBereich({ art: 'x', x: 4 }, achsen)).toEqual([
      [4, 0],
      [4, 13],
    ]);
    expect(geradeImBereich({ art: 'x', x: 11 }, achsen)).toBeUndefined();
  });
});

describe('Formprüfung', () => {
  const achsen = { xVon: 0, xBis: 10, yVon: 0, yBis: 13 };
  it('meldet unlesbare Gleichungen und Punkte außerhalb der Achsen, sonst nichts', () => {
    const ok: KoordinatenAntwort = { ...leereKoordinatenAntwort(), punkte: [{ x: 2, y: 9, form: 'kreis' }], geraden: ['y = 7,5', ''] };
    expect(pruefeKoordinaten(ok, achsen)).toEqual([]);
    const schlecht: KoordinatenAntwort = { ...ok, punkte: [{ x: 11, y: 1, form: 'kreuz' }], geraden: ['y = ?'] };
    const m = pruefeKoordinaten(schlecht, achsen);
    expect(m).toHaveLength(2);
    expect(m[0]).toContain('Gerade 1');
    expect(m[1]).toContain('außerhalb');
  });
});

describe('Abgleich mit der Aufgabe (29-A1)', () => {
  const trainingG = gesuchtePunkte(a1).filter((p) => p.klasse === 'G');
  const trainingP = gesuchtePunkte(a1).filter((p) => p.klasse === 'P');
  const richtig: KoordinatenAntwort = {
    editor: 'koordinaten',
    punkte: [
      ...trainingG.map((p) => ({ x: p.x, y: p.y, form: 'kreis' as const })),
      ...trainingP.map((p) => ({ x: p.x, y: p.y, form: 'kreuz' as const })),
    ],
    geraden: ['y = 7,5', 'y = 1,5 · x − 1'],
  };

  it('vollständige Zeichnung: alle getroffen, Symbole stimmig, beide Geraden', () => {
    const r = gleicheKoordinatenAb(a1, richtig)!;
    expect(r.erwartet).toHaveLength(15);
    expect(r.getroffen).toHaveLength(15);
    expect(r.fehlend).toEqual([]);
    expect(r.zusaetzlich).toEqual([]);
    expect(r.symboleStimmig).toBe(true);
    expect(r.geraden).toEqual([
      { text: 'y = 7,5', gezeichnet: true },
      { text: 'y = 1,5 · x − 1', gezeichnet: true },
    ]);
  });

  it('zusätzliche Punkte, vertauschte Symbole, fehlende Gerade', () => {
    const vertauscht: KoordinatenAntwort = {
      ...richtig,
      punkte: [...richtig.punkte.slice(1), { x: 9.5, y: 0.5, form: 'kreis' }, { ...richtig.punkte[0], form: 'kreuz' }],
      geraden: ['y = 7,5'],
    };
    const r = gleicheKoordinatenAb(a1, vertauscht)!;
    expect(r.getroffen).toHaveLength(15);
    expect(r.zusaetzlich).toEqual([{ x: 9.5, y: 0.5, form: 'kreis' }]);
    expect(r.symboleStimmig).toBe(false); // ein G-Punkt trägt ein Kreuz
    expect(r.geraden.map((g) => g.gezeichnet)).toEqual([true, false]);
  });

  it('leere Zeichnung: alles fehlt', () => {
    const leer = gleicheKoordinatenAb(a1, leereKoordinatenAntwort())!;
    expect(leer.fehlend).toHaveLength(15);
    expect(leer.geraden.every((g) => !g.gezeichnet)).toBe(true);
  });

  it('ein Kästchen um einen Datenpunkt ist kein zusätzlicher Punkt', () => {
    const mitKasten: KoordinatenAntwort = {
      ...richtig,
      punkte: [...richtig.punkte, { x: trainingG[0].x, y: trainingG[0].y, form: 'kasten' }],
    };
    expect(gleicheKoordinatenAb(a1, mitKasten)!.zusaetzlich).toEqual([]);
  });

  it('ohne Datenpunkte und Geraden in der Aufgabe: kein Abgleich', () => {
    expect(gleicheKoordinatenAb({ markdown: 'Zeichnen Sie ein Koordinatensystem.' }, richtig)).toBeUndefined();
  });
});

describe('Speichern und Lesen', () => {
  it('leere Antwort wird zum leeren String; eine gezeichnete bleibt beim Lesen erhalten', () => {
    expect(schreibeEditorAntwort(leereKoordinatenAntwort(), a1)).toBe('');
    // eine neu angelegte, noch leere Geradenzeile bleibt stehen (sonst verschwände sie, bevor man tippen kann)
    expect(schreibeEditorAntwort({ ...leereKoordinatenAntwort(), geraden: [''] }, a1)).not.toBe('');
    const gezeichnet: KoordinatenAntwort = {
      editor: 'koordinaten',
      punkte: [{ x: 2.5, y: 9, form: 'kasten' }],
      geraden: ['y = 7,5'],
      notiz: 'Skala 1:1',
    };
    const roh = schreibeEditorAntwort(gezeichnet, a1);
    expect(leseEditorAntwort('koordinaten', a1, roh)).toEqual(gezeichnet);
  });

  it('Text aus einer Klausur vor dem Editor geht in die Anmerkungen; eine Antwort anderer Art ebenso', () => {
    expect(leseEditorAntwort('koordinaten', a1, 'Ich habe es auf Papier gezeichnet.')).toEqual({
      ...leereKoordinatenAntwort(),
      notiz: 'Ich habe es auf Papier gezeichnet.',
    });
    const boxplot = JSON.stringify({ editor: 'boxplot', werte: { min: '1', q1: '2', median: '3', q3: '4', max: '5' }, ausreisser: '' });
    expect(leseEditorAntwort('koordinaten', a1, boxplot).notiz).toContain('Boxplot');
  });

  it('Textform nennt Punkte nach Symbol und die Geraden', () => {
    const t = koordinatenAlsText({
      editor: 'koordinaten',
      punkte: [
        { x: 2, y: 9.5, form: 'kreis' },
        { x: 6, y: 3, form: 'kreuz' },
      ],
      geraden: ['y = 7,5', ''],
    });
    expect(t).toBe('Koordinatensystem – Kreis ●: (2 | 9,5) · Kreuz ✕: (6 | 3) · Geraden: y = 7,5');
    expect(koordinatenAlsText(leereKoordinatenAntwort())).toBe('Koordinatensystem – leer');
  });
});
