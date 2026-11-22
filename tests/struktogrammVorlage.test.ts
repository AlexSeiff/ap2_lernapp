import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { struktogrammAlsText } from '../src/lib/struktogramm';
import {
  leseStruktogrammVorlage,
  loesungsZiffern,
  ohneStruktogramm,
  pruefeZuordnung,
  struktogrammBlock,
} from '../src/lib/struktogrammVorlage';
import { editorFuer, leseEditorAntwort, schreibeEditorAntwort } from '../src/lib/editorAufgabe';

const VORLAGE = `titel: + zaehlen(liste : Integer[]) : Integer
n := 0
___
schleife: ___
  wenn: ___
    ja:
      ___
    nein:
wiederhole:
  ___
bis: ___
auswahl:
1 n := n + 1
2 für i := 0, solange i < Länge von liste
3 wenn liste[i] > 0
4 gib n zurück
5 i := i + 1
6 i = Länge von liste`;

describe('Struktogramm-Vorlage lesen', () => {
  it('baut die Struktur, nummeriert die Felder Zeile für Zeile und liest die Auswahl', () => {
    const { vorlage, fehler } = leseStruktogrammVorlage(VORLAGE);
    expect(fehler).toBeUndefined();
    expect(vorlage!.titel).toBe('+ zaehlen(liste : Integer[]) : Integer');
    expect(vorlage!.anzahl).toBe(6);
    expect(vorlage!.auswahl.map((a) => a.nr)).toEqual(['1', '2', '3', '4', '5', '6']);
    expect(struktogrammAlsText({ editor: 'struktogramm', bausteine: vorlage!.bausteine })).toBe(
      [
        'Struktogramm:',
        'n := 0',
        '___',
        'SOLANGE ___',
        '  WENN ___',
        '    ja:',
        '      ___',
        '    nein:',
        '      ∅',
        'WIEDERHOLE',
        '  ___',
        'BIS ___',
      ].join('\n'),
    );
    // Feldnummern in Zeilenreihenfolge: der Fuß der WIEDERHOLE-Schleife kommt nach ihrem Rumpf.
    expect([...vorlage!.felder.values()]).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('meldet Formfehler', () => {
    expect(leseStruktogrammVorlage('').fehler).toMatch(/leer/);
    expect(leseStruktogrammVorlage('wiederhole:\n  ___').fehler).toMatch(/bis:/);
    expect(leseStruktogrammVorlage('___\nauswahl:\n1 a\n1 b').fehler).toMatch(/zweimal/);
    expect(leseStruktogrammVorlage('___\nauswahl:\nx a').fehler).toMatch(/Ziffer/);
  });

  it('Lösung mit [n] statt ___ ergibt die Ziffern je Feld', () => {
    const ziffern = ['5', '2', '3', '1', '4', '6'];
    let k = 0;
    const text = VORLAGE.replace(/___/g, () => `[${ziffern[k++]}]`);
    const { vorlage } = leseStruktogrammVorlage(text);
    expect(vorlage!.anzahl).toBe(6);
    expect(loesungsZiffern(vorlage!)).toEqual(ziffern);
  });

  it('Hinweise beim Eintragen: unbekannte und doppelte Ziffern', () => {
    const { vorlage } = leseStruktogrammVorlage(VORLAGE);
    expect(pruefeZuordnung(vorlage!, ['1', '1', '', '7', '', ''])).toEqual([
      'Feld 4: „7“ steht nicht in der Auswahl.',
      'Ziffer 1 steht in 2 Feldern – jede Anweisung gehört an genau eine Stelle.',
    ]);
    expect(pruefeZuordnung(vorlage!, ['2', '3', '1', '5', '6', ''])).toEqual([]);
  });

  it('nimmt den Block aus dem Aufgabentext', () => {
    const md = `Ordnen Sie zu.\n\n\`\`\`struktogramm\n${VORLAGE}\n\`\`\``;
    expect(struktogrammBlock(md)).toBe(VORLAGE);
    expect(ohneStruktogramm(md)).toBe('Ordnen Sie zu.');
  });
});

describe('DD31 A6: Perzeptron-Lernalgorithmus zuordnen', () => {
  const content = loadContent(CONTENT_DIR);
  const t = content.tasks['31-A6'];

  it('zehn Felder im Gerüst, die Musterlösung ergibt 6 9 2 5 8 1 7 10 3 4', () => {
    expect(editorFuer(t)).toBe('zuordnung');
    const vorlage = leseStruktogrammVorlage(struktogrammBlock(t.markdown)!).vorlage!;
    expect(vorlage.anzahl).toBe(10);
    const loesung = leseStruktogrammVorlage(struktogrammBlock(t.solution!.markdown)!).vorlage!;
    expect(loesungsZiffern(loesung)).toEqual(['6', '9', '2', '5', '8', '1', '7', '10', '3', '4']);
    // Gleiche Auswahl in Aufgabe und Lösung.
    expect(loesung.auswahl).toEqual(vorlage.auswahl);
  });

  it('die Antwort übersteht Speichern und Laden; eine alte Tabellen-Antwort landet in den Anmerkungen', () => {
    const leer = leseEditorAntwort('zuordnung', t, undefined);
    expect(schreibeEditorAntwort(leer, t)).toBe('');
    const a = { ...leer, felder: ['6', '9', '', '', '', '', '', '', '', ''] };
    expect(leseEditorAntwort('zuordnung', t, schreibeEditorAntwort(a, t))).toEqual(a);
    const alt = JSON.stringify({ editor: 'werte', kopf: ['Feld', '1'], zeilen: [['Anweisung', '6']] });
    expect(leseEditorAntwort('zuordnung', t, alt)).toMatchObject({ editor: 'zuordnung', notiz: expect.stringContaining('6') });
  });
});
