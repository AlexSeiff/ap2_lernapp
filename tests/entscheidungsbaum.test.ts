import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { baumBlock, baumWertGleich, gleicheBaumAb, leseBaum, ohneBaum } from '../src/lib/entscheidungsbaum';
import { editorFuer, leseEditorAntwort, schreibeEditorAntwort } from '../src/lib/editorAufgabe';
import { pruefeEingabe } from '../src/rechnen/checker';
import { baueInstanz } from '../src/rechnen/instanz';
import { rechenAuswahl } from '../src/lib/leichtRechnen';

const VORLAGE = `T = ___ | Entropie(T) = ___
Altersgruppe
  A1 | T₁ = [3, 0] | Entropie(T₁) = 0
  ___ | T₂ = ___ | Entropie(T₂) = ___
___
  ___ | T₁ = ___ | Entropie(T₁) = ___
  ___ | T₂ = ___ | Entropie(T₂) = ___`;

const LOESUNG = `T = [5, 3] | Entropie(T) = 0,9544
Altersgruppe
  A1 | T₁ = [3, 0] | Entropie(T₁) = 0
  A2 | T₂ = [2, 1] | Entropie(T₂) = 0,9183
Wohnform
  Miete | T₁ = [2, 2] | Entropie(T₁) = 1
  Eigentum | T₂ = [3, 1] | Entropie(T₂) = 0,8113`;

describe('Entscheidungsbaum lesen', () => {
  it('zählt die Lücken in Lesereihenfolge und kennt Merkmale und Zweige', () => {
    const { baum, fehler } = leseBaum(VORLAGE);
    expect(fehler).toBeUndefined();
    expect(baum!.luecken).toBe(12);
    expect(baum!.wurzel.map((f) => f.name)).toEqual(['T', 'Entropie(T)']);
    expect(baum!.baeume.map((b) => b.zweige.length)).toEqual([2, 2]);
    expect(baum!.baeume[0].zweige[0]).toEqual({
      name: { art: 'text', text: 'A1' },
      felder: [
        { name: 'T₁', wert: { art: 'text', text: '[3, 0]' } },
        { name: 'Entropie(T₁)', wert: { art: 'text', text: '0' } },
      ],
    });
    expect(baum!.baeume[1].merkmal).toEqual({ art: 'luecke', index: 5 });
  });

  it('meldet Fehler in der Form', () => {
    expect(leseBaum('Altersgruppe\n  A1 | T = 1').fehler).toMatch(/erste Zeile/);
    expect(leseBaum('T = ___\nAltersgruppe').fehler).toMatch(/keine Zweige/);
    expect(leseBaum('T = ___\n  A1 | T = 1').fehler).toMatch(/vor dem ersten Merkmal/);
  });

  it('findet den Block im Markdown und nimmt ihn heraus', () => {
    const md = `Text davor.\n\n\`\`\`entscheidungsbaum\n${VORLAGE}\n\`\`\`\n\nText danach.`;
    expect(baumBlock(md)).toBe(VORLAGE);
    expect(ohneBaum(md)).toBe('Text davor.\n\nText danach.');
  });
});

describe('Vergleich mit der Musterlösung', () => {
  it('Zahlen auf vier Stellen, Teilmengen in Reihenfolge, Namen ohne Groß-/Kleinschreibung', () => {
    expect(baumWertGleich('0.9183', '0,9183')).toBe(true);
    expect(baumWertGleich('0,918', '0,9183')).toBe(true);
    expect(baumWertGleich('0,92', '0,9183')).toBe(false);
    expect(baumWertGleich('[2,1]', '[2, 1]')).toBe(true);
    expect(baumWertGleich('2; 1', '[2, 1]')).toBe(true);
    expect(baumWertGleich('[1, 2]', '[2, 1]')).toBe(false);
    expect(baumWertGleich('wohnform', 'Wohnform')).toBe(true);
    expect(baumWertGleich('', '0')).toBe(false);
  });

  it('ordnet Teilbäume und Zweige über ihren Namen zu, nicht über die Stelle', () => {
    const vorlage = leseBaum(VORLAGE).baum!;
    const loesung = leseBaum(LOESUNG).baum!;
    // Zweige von Wohnform vertauscht eingetragen – zählt trotzdem.
    const eintraege = ['[5, 3]', '0,9544', 'A2', '[2, 1]', '0,9183', 'Wohnform', 'Eigentum', '[3, 1]', '0,8113', 'Miete', '[2,2]', '1'];
    const befunde = gleicheBaumAb(vorlage, eintraege, loesung)!;
    expect(befunde.every((b) => b.status === 'gleich')).toBe(true);
    const falsch = gleicheBaumAb(vorlage, ['[3, 5]', '', ...eintraege.slice(2)], loesung)!;
    expect(falsch[0]).toEqual({ soll: '[5, 3]', status: 'abweichend' });
    expect(falsch[1]).toEqual({ soll: '0,9544', status: 'leer' });
  });
});

describe('DD23 A5 und die Rechenübungen im Format des Prüfungsbogens', () => {
  const content = loadContent(CONTENT_DIR);

  it('DD23 A5 ist ein Baum zum Ausfüllen, die Musterlösung ein vollständiger Baum derselben Form', () => {
    const t = content.tasks['23-A5'];
    expect(editorFuer(t)).toBe('baum');
    const vorlage = leseBaum(baumBlock(t.markdown)!).baum!;
    const loesung = leseBaum(baumBlock(t.solution!.markdown)!).baum!;
    expect(vorlage.luecken).toBe(22);
    expect(loesung.luecken).toBe(0);
    const richtig = gleicheBaumAb(
      vorlage,
      [
        '[5, 3]',
        '0,9544',
        'A2',
        '[2, 1]',
        '0,9183',
        'A3',
        '[0, 2]',
        '0',
        'Newsletter',
        'Ja',
        '[4, 0]',
        '0',
        'Nein',
        '[1, 3]',
        '0,8113',
        'Wohnform',
        'Miete',
        '[2, 2]',
        '1',
        'Eigentum',
        '[3, 1]',
        '0,8113',
      ],
      loesung,
    )!;
    expect(richtig.filter((b) => b.status !== 'gleich')).toEqual([]);
  });

  it('die Antwort übersteht Speichern und Laden; leer bleibt leer', () => {
    const t = content.tasks['23-A5'];
    const leer = leseEditorAntwort('baum', t, undefined);
    expect(schreibeEditorAntwort(leer, t)).toBe('');
    const a = { ...leer, luecken: leer.editor === 'baum' ? leer.luecken.map((_, i) => (i === 0 ? '[5, 3]' : '')) : [] };
    expect(leseEditorAntwort('baum', t, schreibeEditorAntwort(a, t))).toEqual(a);
  });

  it('Rechenübungen mit Baum: so viele Eingaben wie Lücken (plus Ergebnisse darunter), alle im Leicht-Modus auswählbar', () => {
    for (const id of ['RE-ML-019', 'RE-ML-020']) {
      const u = content.rechenUebungen.find((x) => x.id === id)!;
      const baum = leseBaum(baumBlock(u.aufgabe)!).baum!;
      expect(u.eingaben.length, id).toBeGreaterThanOrEqual(baum.luecken);
      const inst = baueInstanz(u);
      expect(
        rechenAuswahl(inst, () => 0.5),
        id,
      ).toBeDefined();
    }
  });

  it('Teilmengen prüft der Checker in der Reihenfolge [ja, nein]', () => {
    const e = { id: 't', label: 'T', erwartet: '[7, 3]', vergleich: 'text' as const };
    expect(pruefeEingabe(e, '[7, 3]').status).toBe('richtig');
    expect(pruefeEingabe(e, '7;3').status).toBe('richtig');
    expect(pruefeEingabe(e, '[3, 7]')).toMatchObject({ status: 'falsch', fehlerbild: true });
    expect(pruefeEingabe(e, '7').status).toBe('ungueltig');
  });
});
