import { describe, expect, it } from 'vitest';
import type { RechenUebung } from '../domain/types';
import {
  einheitPasst,
  formatWert,
  leseListe,
  leseZahl,
  mengePasst,
  pruefeAntworten,
  pruefeEingabe,
  textPasst,
  toleranz,
} from '../src/rechnen/checker';
import { baueInstanz, type AufgeloesteEingabe } from '../src/rechnen/instanz';

const zahl = (erwartet: number, over: Partial<AufgeloesteEingabe> = {}): AufgeloesteEingabe => ({
  id: 'x',
  label: 'x',
  erwartet,
  vergleich: 'zahl',
  ...over,
});

const uebung = (over: Partial<RechenUebung> = {}): RechenUebung => ({
  id: 'RE-T-001',
  thema: 'Deep Dive 3',
  titel: 'Test',
  schwierigkeit: 1,
  tags: [],
  vorlage: 'lagemasse',
  daten: { werte: [60, 40, 220, 45, 35, 90, 55, 40, 70, 50, 65], einheit: 'min' },
  neueZahlen: true,
  aufgabe: 'Werte: {{werte}}',
  eingaben: [],
  hinweise: [],
  ...over,
});

describe('leseZahl', () => {
  it('deutsches und englisches Format, Tausenderpunkte, Leerzeichen, Minus-Varianten, Einheit', () => {
    expect(leseZahl('70,00')).toEqual({ kandidaten: [70], einheit: '' });
    expect(leseZahl('70.5')).toEqual({ kandidaten: [70.5], einheit: '' });
    expect(leseZahl('1.080,50 €')).toEqual({ kandidaten: [1080.5], einheit: '€' });
    expect(leseZahl('1,080.50')).toEqual({ kandidaten: [1080.5], einheit: '' });
    expect(leseZahl('12 000 €')?.kandidaten).toEqual([12000]);
    expect(leseZahl('12.000.000')?.kandidaten).toEqual([12000000]);
    expect(leseZahl('−5')?.kandidaten).toEqual([-5]);
    expect(leseZahl('– 0,5')?.kandidaten).toEqual([-0.5]);
    expect(leseZahl(',5')?.kandidaten).toEqual([0.5]);
    expect(leseZahl('≈ 0,97')?.kandidaten).toEqual([0.97]);
    expect(leseZahl('93,33 %')).toEqual({ kandidaten: [93.33], einheit: '%' });
    expect(leseZahl('2,5 Jahre')).toEqual({ kandidaten: [2.5], einheit: 'Jahre' });
  });

  it('mehrdeutig „1.080“ → 1,08 oder 1080; keine Zahl → undefined', () => {
    expect(leseZahl('1.080')?.kandidaten).toEqual([1.08, 1080]);
    expect(leseZahl('1,5')?.kandidaten).toEqual([1.5]);
    expect(leseZahl('abc')).toBeUndefined();
    expect(leseZahl('')).toBeUndefined();
    expect(leseZahl('1,2,3')).toBeUndefined();
  });
});

describe('Einheiten, Text, Mengen, Listen', () => {
  it('einheitPasst kennt Synonyme', () => {
    expect(einheitPasst('Minuten', 'min')).toBe(true);
    expect(einheitPasst('EUR', '€')).toBe(true);
    expect(einheitPasst('Prozent', '%')).toBe(true);
    expect(einheitPasst('Tage²', 'Tage²')).toBe(true);
    expect(einheitPasst('Tage^2', 'Tage²')).toBe(true);
    expect(einheitPasst('€/Jahr', '€')).toBe(true);
    expect(einheitPasst('h', 'min')).toBe(false);
  });

  it('textPasst: ganzer Name, kennzeichnendes Wort, ja/nein – nicht das allgemeine Wort', () => {
    expect(textPasst('filiale süd', 'Filiale Süd')).toBe(true);
    expect(textPasst('Sued', 'Filiale Süd')).toBe(true);
    expect(textPasst('B', 'Anbieter B')).toBe(true);
    expect(textPasst('Filiale', 'Filiale Süd')).toBe(false);
    expect(textPasst('Nord', 'Filiale Süd')).toBe(false);
    expect(textPasst('Datenqualität', 'Datenqualität schlechter als erwartet')).toBe(true);
    expect(textPasst('j', 'ja')).toBe(true);
    expect(textPasst('nein', 'ja')).toBe(false);
  });

  it('mengePasst: Reihenfolge und Trennzeichen egal', () => {
    expect(mengePasst('A, C, D, F, G', 'A → C → D → F → G')).toBe(true);
    expect(mengePasst('G-F-D-C-A', 'A → C → D → F → G')).toBe(true);
    expect(mengePasst('ACDFG', 'A → C → D → F → G')).toBe(true);
    expect(mengePasst('A C D G', 'A → C → D → F → G')).toBe(false);
    expect(mengePasst('A B C D F G', 'A → C → D → F → G')).toBe(false);
  });

  it('leseListe: Semikolon, Leerzeichen, Komma mit Leerzeichen, „keine“', () => {
    expect(leseListe('220')).toEqual([220]);
    expect(leseListe('19; 220,5')).toEqual([19, 220.5]);
    expect(leseListe('19, 220')).toEqual([19, 220]);
    expect(leseListe('19 220 min')).toEqual([19, 220]);
    expect(leseListe('keine')).toEqual([]);
    expect(leseListe('–')).toEqual([]);
    expect(leseListe('x')).toBeUndefined();
  });
});

describe('toleranz und formatWert', () => {
  it('halbe Einheit der letzten Stelle, explizite Toleranz geht vor', () => {
    expect(toleranz({ runden: 2 })).toBeCloseTo(0.005, 8);
    expect(toleranz({ runden: 0 })).toBeCloseTo(0.5, 8);
    expect(toleranz({ runden: 2, toleranz: 0.02 })).toBeCloseTo(0.02, 8);
    expect(toleranz({})).toBeLessThan(1e-6);
  });

  it('formatWert: deutsches Format, Einheit, Listen', () => {
    expect(formatWert(70, { runden: 2, einheit: 'min' })).toBe('70,00 min');
    expect(formatWert([19, 220], {})).toBe('19; 220');
    expect(formatWert([], {})).toBe('keine');
    expect(formatWert('Filiale Süd', {})).toBe('Filiale Süd');
  });
});

describe('pruefeEingabe', () => {
  it('richtig innerhalb der Rundungstoleranz, mit und ohne Einheit', () => {
    const e = zahl(2.2360679, { runden: 2, einheit: 'Tage' });
    expect(pruefeEingabe(e, '2,24').status).toBe('richtig');
    expect(pruefeEingabe(e, '2.236 Tage').status).toBe('richtig');
    expect(pruefeEingabe(e, '2,23').status).toBe('falsch');
    expect(pruefeEingabe(e, '').status).toBe('leer');
    expect(pruefeEingabe(e, 'zwei').status).toBe('ungueltig');
  });

  it('falsche Einheit gibt einen Hinweis, die Zahl zählt trotzdem', () => {
    const r = pruefeEingabe(zahl(70, { runden: 2, einheit: 'min' }), '70 h');
    expect(r.status).toBe('richtig');
    expect(r.einheitHinweis).toMatch(/passt nicht zu „min“/);
  });

  it('erkennt Fehlerbilder der Vorlage und allgemeine Fehler (Anteil statt %, Vorzeichen, Rundung)', () => {
    const fb = [{ eingabe: 'x', wert: 4, text: 'Du hast durch n geteilt – bei einer Stichprobe teilt man durch n − 1.' }];
    expect(pruefeEingabe(zahl(5, { runden: 2 }), '4,00', fb)).toEqual({ status: 'falsch', meldung: fb[0].text, fehlerbild: true });
    expect(pruefeEingabe(zahl(93.3333, { runden: 2, einheit: '%' }), '0,9333').meldung).toMatch(/Anteil/);
    expect(pruefeEingabe(zahl(-0.99, { runden: 2 }), '0,99').meldung).toMatch(/Vorzeichen/);
    expect(pruefeEingabe(zahl(61.578, { runden: 2 }), '61,6').meldung).toMatch(/runde erst am Ende auf 2 Nachkommastellen/);
    expect(pruefeEingabe(zahl(61.578, { runden: 2 }), '75').meldung).toBeUndefined();
  });

  it('akzeptiert „1.080“ als 1080, wenn das erwartet wird', () => {
    expect(pruefeEingabe(zahl(1080, { runden: 2 }), '1.080').status).toBe('richtig');
    expect(pruefeEingabe(zahl(1.08, { runden: 2 }), '1.080').status).toBe('richtig');
  });

  it('Listen und Mengen mit Fehlerbildern', () => {
    const liste: AufgeloesteEingabe = { id: 'a', label: 'a', erwartet: [220], vergleich: 'liste' };
    expect(pruefeEingabe(liste, '220').status).toBe('richtig');
    expect(pruefeEingabe(liste, 'keine', [{ eingabe: 'a', wert: [], text: 'Prüfe beide Zäune.' }])).toMatchObject({
      status: 'falsch',
      meldung: 'Prüfe beide Zäune.',
    });
    expect(pruefeEingabe(liste, '90; 220').meldung).toMatch(/zu viel/);
    const menge: AufgeloesteEingabe = { id: 'k', label: 'k', erwartet: 'A → C → D', vergleich: 'menge' };
    expect(pruefeEingabe(menge, 'a c d').status).toBe('richtig');
    expect(pruefeEingabe(menge, 'A B C D', [{ eingabe: 'k', wert: 'A → B → C → D', text: 'GP statt FP.' }]).meldung).toBe('GP statt FP.');
  });
});

describe('pruefeAntworten mit einer Vorlage (DD3 C1)', () => {
  it('alle richtig → ok; typische Fehler werden erklärt', () => {
    const inst = baueInstanz(uebung({ eingaben: [{ id: 'mittel' }, { id: 'median' }, { id: 'modus' }] }));
    expect(inst.eingaben.map((e) => [e.id, e.label, e.einheit, e.runden])).toEqual([
      ['mittel', 'Arithmetisches Mittel', 'min', 2],
      ['median', 'Median', 'min', 2],
      ['modus', 'Modus', 'min', undefined],
    ]);
    expect(pruefeAntworten(inst, { mittel: '70,00', median: '55', modus: '40 min' })).toMatchObject({ ok: true, richtig: 3, gesamt: 3 });
    const falsch = pruefeAntworten(inst, { mittel: '77', median: '90', modus: '' });
    expect(falsch.ok).toBe(false);
    expect(falsch.richtig).toBe(0);
    expect(falsch.ergebnisse.mittel.meldung).toMatch(/n − 1/);
    expect(falsch.ergebnisse.median.meldung).toMatch(/nicht sortiert/);
    expect(falsch.ergebnisse.modus.status).toBe('leer');
  });

  it('ohne Eingaben-Auswahl: alle Standard-Ergebnisse der Vorlage; Platzhalter ersetzt', () => {
    const inst = baueInstanz(uebung());
    expect(inst.eingaben.map((e) => e.id)).toEqual(['mittel', 'median', 'modus', 'spannweite']);
    expect(inst.aufgabe).toBe('Werte: 60, 40, 220, 45, 35, 90, 55, 40, 70, 50, 65');
    expect(inst.seed).toBeUndefined();
  });

  it('Neue Zahlen: anderer Seed → andere Daten, gleicher Seed → gleiche Daten', () => {
    const a = baueInstanz(uebung(), 5);
    const b = baueInstanz(uebung(), 5);
    const c = baueInstanz(uebung(), 6);
    expect(a.aufgabe).toBe(b.aufgabe);
    expect(a.aufgabe).not.toBe(c.aufgabe);
    expect(a.eingaben.map((e) => e.id)).toEqual(['mittel', 'median', 'modus', 'spannweite']);
  });

  it('Übung ohne Vorlage prüft gegen die angegebenen Lösungen', () => {
    const inst = baueInstanz(
      uebung({
        vorlage: undefined,
        daten: undefined,
        aufgabe: 'Wie viel?',
        eingaben: [{ id: 's', label: 'Summe', loesung: 4, runden: 0 }],
      }),
    );
    expect(pruefeAntworten(inst, { s: '4' }).ok).toBe(true);
    expect(pruefeAntworten(inst, { s: '5' }).ok).toBe(false);
  });

  it('unbekannte Eingabe oder Vorlage wirft eine verständliche Meldung', () => {
    expect(() => baueInstanz(uebung({ eingaben: [{ id: 'gibtsnicht' }] }))).toThrow(
      /Eingabe „gibtsnicht“ gibt es in der Vorlage lagemasse nicht/,
    );
    expect(() => baueInstanz(uebung({ vorlage: 'xyz' }))).toThrow(/unbekannte Vorlage „xyz“/);
    expect(() => baueInstanz(uebung({ daten: { werte: 'x' } }))).toThrow(/Daten passen nicht zur Vorlage lagemasse: werte/);
  });
});
