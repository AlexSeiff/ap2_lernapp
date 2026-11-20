import { describe, expect, it } from 'vitest';
import katex from 'katex';
import type { RechenWert } from '../domain/types';
import { quartil } from '../src/rechnen/hilfen';
import { VORLAGEN } from '../src/rechnen/vorlagen/index';
import { erzeugeZufall, seedAusText } from '../src/rechnen/zufall';

// Jede Vorlage rechnet die Beispiele aus den Lernblättern (Musterlösungen) nach.

function loese(id: string, daten: unknown): Record<string, RechenWert> {
  const v = VORLAGEN[id];
  const parsed = v.schema.parse(daten);
  return v.loese(parsed).werte;
}

/** Wert auf `stellen` Nachkommastellen wie in der Musterlösung. */
const r = (w: RechenWert | undefined, stellen = 2) => (typeof w === 'number' ? Math.round(w * 10 ** stellen) / 10 ** stellen : w);

const ANLAGE_DD3 = [60, 40, 220, 45, 35, 90, 55, 40, 70, 50, 65];

describe('Statistik I (DD3)', () => {
  it('C1/D1 Lagemaße: 70,00 / 55 / 40, Spannweite 185', () => {
    const w = loese('lagemasse', { werte: ANLAGE_DD3, einheit: 'min' });
    expect(r(w.mittel)).toBe(70);
    expect(w.median).toBe(55);
    expect(w.modus).toBe(40);
    expect(w.spannweite).toBe(185);
    expect(w.summe).toBe(770);
  });

  it('Lagemaße aus dem Theorieteil (n gerade): Mittel 6, Median 5, Modus 5', () => {
    const w = loese('lagemasse', { werte: [2, 3, 3, 4, 5, 5, 5, 6, 8, 19] });
    expect(w).toMatchObject({ mittel: 6, median: 5, modus: 5, spannweite: 17 });
  });

  it('C3 gewichtetes Mittel: 60,00 min', () => {
    const w = loese('gewichtetes-mittel', {
      gruppen: [
        { anzahl: 4, wert: 45 },
        { anzahl: 6, wert: 70 },
      ],
    });
    expect(w.mittel).toBe(60);
  });

  it('E1/E2 Quartile nach Lernblatt-Konvention: Q1 40, Q3 70, IQR 30, Zäune −5 und 115, Ausreißer 220, Whisker 35–90', () => {
    const w = loese('quartile', { werte: ANLAGE_DD3 });
    expect(w).toMatchObject({
      q1: 40,
      q3: 70,
      iqr: 30,
      zaunUnten: -5,
      zaunOben: 115,
      ausreisser: [220],
      whiskerUnten: 35,
      whiskerOben: 90,
      median: 55,
    });
  });

  it('Quartile Theorieteil (n = 10): Q1 = 3, Q3 = 6 (Position 8 → Wert 6), oberer Zaun 10,5', () => {
    const w = loese('quartile', { werte: [2, 3, 3, 4, 5, 5, 5, 6, 8, 19] });
    expect(w).toMatchObject({ q1: 3, q3: 6, iqr: 3, zaunOben: 10.5, ausreisser: [19], whiskerOben: 8 });
  });

  it('Quartil: ganzzahlige Position → Mittel mit dem nächsten Wert', () => {
    // n = 8: 8 · 0,25 = 2 → (x2 + x3) / 2
    expect(quartil([1, 2, 3, 4, 5, 6, 7, 8], 0.25)).toEqual({ wert: 2.5, position: 2, ganz: true });
    expect(quartil([1, 2, 3, 4, 5, 6, 7, 8], 0.75).wert).toBe(6.5);
  });

  it('D2 Varianz Grundgesamtheit: σ² = 4, σ = 2; als Stichprobe s² = 5, s = 2,24', () => {
    const gg = loese('varianz', { werte: [2, 4, 5, 6, 8], art: 'grundgesamtheit' });
    expect(gg).toMatchObject({ mittel: 5, saq: 20, varianz: 4, stdabw: 2 });
    const st = loese('varianz', { werte: [2, 4, 5, 6, 8], art: 'stichprobe' });
    expect(st.varianz).toBe(5);
    expect(r(st.stdabw)).toBe(2.24);
  });

  it('D3 Variationskoeffizient: Nord 10 %, Süd 8 % → Süd gleichmäßiger', () => {
    const w = loese('variationskoeffizient', {
      gruppen: [
        { name: 'Filiale Nord', mittel: 50, stdabw: 5 },
        { name: 'Filiale Süd', mittel: 100, stdabw: 8 },
      ],
    });
    expect(r(w.vk1)).toBe(10);
    expect(r(w.vk2)).toBe(8);
    expect(w.gleichmaessiger).toBe('Filiale Süd');
  });

  it('B1/B2 Häufigkeiten: 36/30/18/12/4 %, kumuliert 36/66/84/96/100, drei Kategorien bis 80 %', () => {
    const w = loese('haeufigkeiten', {
      kategorien: [
        { name: 'Transportschaden', h: 18 },
        { name: 'Montagefehler', h: 15 },
        { name: 'Falschlieferung', h: 9 },
        { name: 'Materialfehler', h: 6 },
        { name: 'Sonstiges', h: 2 },
      ],
    });
    expect([w.rel1, w.rel2, w.rel3, w.rel4, w.rel5].map((x) => r(x, 1))).toEqual([36, 30, 18, 12, 4]);
    expect([w.kum1, w.kum2, w.kum3, w.kum4, w.kum5].map((x) => r(x, 1))).toEqual([36, 66, 84, 96, 100]);
    expect(w.anzahlSchwelle).toBe(3);
    expect(w.modus).toBe('Transportschaden');
  });
});

describe('Statistik II (DD4)', () => {
  it('A2 Korrelation Anlage 1: Sxy −30, Sxx 70, Syy 13, r = −0,99', () => {
    const w = loese('korrelation', { x: [2, 4, 6, 8, 10, 12], y: [9, 8.5, 7.5, 6.5, 5.5, 5] });
    expect(w).toMatchObject({ xMittel: 7, yMittel: 7 });
    expect(r(w.sxy)).toBe(-30);
    expect(r(w.sxx)).toBe(70);
    expect(r(w.syy)).toBe(13);
    expect(r(w.r)).toBe(-0.99);
  });

  it('C1–C4/D1 Regression Anlage 2: b 6,4, a 24,8, Prognosen 63,20/152,80, Residuen, r 0,98, R² 0,97', () => {
    const w = loese('regression', { x: [1, 2, 3, 4, 5], y: [30, 40, 42, 52, 56], prognose: [6, 20] });
    expect(r(w.b)).toBe(6.4);
    expect(r(w.a)).toBe(24.8);
    expect(r(w.prognose1)).toBe(63.2);
    expect(r(w.prognose2)).toBe(152.8);
    expect([1, 2, 3, 4, 5].map((i) => r(w[`residuum${i}`]))).toEqual([-1.2, 2.4, -2, 1.6, -0.8]);
    expect(r(w.syy)).toBe(424);
    expect(r(w.r)).toBe(0.98);
    expect(r(w.r2)).toBe(0.97);
  });

  it('E1 gleitender 3er-Durchschnitt: 128, 138, 140, 154', () => {
    const w = loese('gleitender-durchschnitt', { werte: [120, 138, 126, 150, 144, 168, 156, 180], k: 3, anzahl: 4 });
    expect([w.gd1, w.gd2, w.gd3, w.gd4]).toEqual([128, 138, 140, 154]);
    expect(w.gd5).toBeUndefined();
  });

  it('E2 prozentuale Veränderung +15 % und +50 %, E3 Prozentpunkte, WiSo D3 Inflation 2,50 %', () => {
    expect(r(loese('prozent-veraenderung', { alt: 120, neu: 138 }).prozent)).toBe(15);
    expect(r(loese('prozent-veraenderung', { alt: 120, neu: 180 }).prozent)).toBe(50);
    expect(loese('prozent-veraenderung', { alt: 4, neu: 6, einheit: '%' })).toMatchObject({ differenz: 2, prozent: 50 });
    expect(r(loese('prozent-veraenderung', { alt: 120, neu: 123 }).prozent)).toBe(2.5);
  });
});

describe('Modellgüte (DD7) und CRISP-DM (DD6)', () => {
  it('B2/B3/D1 Konfusionsmatrix: 93 / 60 / 90 / 72 / 93,33 %, trivial 90 % und 0 %, Kosten 2.100 € und 12.000 €', () => {
    const w = loese('konfusionsmatrix', { tp: 90, fp: 60, fn: 10, tn: 840, kostenFN: 120, kostenFP: 15 });
    expect([w.accuracy, w.precision, w.recall, w.f1, w.spezifitaet].map((x) => r(x))).toEqual([93, 60, 90, 72, 93.33]);
    expect(r(w.trivialAccuracy)).toBe(90);
    expect(w.trivialRecall).toBe(0);
    expect(w).toMatchObject({ kostenModell: 2100, kostenTrivial: 12000, ersparnis: 9900 });
  });

  it('E1 Regressionsgüte: MAE 5,20, RMSE 6,00', () => {
    const w = loese('regressionsguete', { y: [100, 120, 90, 130, 110], yDach: [90, 126, 84, 132, 108] });
    expect(r(w.mae)).toBe(5.2);
    expect(w.mse).toBe(36);
    expect(w.rmse).toBe(6);
  });

  it('D1/D2 Assoziation S → B: Support 40 %, Konfidenz 80 %, Lift 1,33; Einzelsupport 50/60/50/40 %', () => {
    const w = loese('assoziation', {
      transaktionen: [
        ['S', 'B', 'M'],
        ['S', 'B'],
        ['S', 'B'],
        ['S', 'B', 'L'],
        ['S', 'M'],
        ['B', 'M'],
        ['M', 'L'],
        ['B', 'M'],
        ['L'],
        ['L'],
      ],
      wenn: ['S'],
      dann: ['B'],
    });
    expect([w.support_S, w.support_B, w.support_M, w.support_L]).toEqual([50, 60, 50, 40]);
    expect(r(w.support)).toBe(40);
    expect(r(w.konfidenz)).toBe(80);
    expect(r(w.lift)).toBe(1.33);
  });

  it('Assoziation: neue Zahlen enthalten jeden Artikel des Vorbilds (Einzelsupport bleibt abfragbar)', () => {
    const v = VORLAGEN.assoziation;
    const vorbild = v.schema.parse({ transaktionen: [['S', 'B', 'M'], ['S', 'B'], ['M', 'L'], ['L']], wenn: ['S'], dann: ['B'] });
    for (let seed = 1; seed <= 300; seed++) {
      const werte = v.loese(v.schema.parse(v.erzeuge(seed, {}, vorbild))).werte;
      for (const a of ['S', 'B', 'M', 'L']) expect(werte, `Seed ${seed}`).toHaveProperty([`support_${a}`]);
    }
  });

  it('C2 k-Means: Abstände 2,83 / 5,66 …, Zentren (2|2) und (8|8)', () => {
    const w = loese('kmeans', {
      punkte: [
        [2, 2],
        [3, 1],
        [1, 3],
        [7, 8],
        [8, 7],
        [9, 9],
      ],
      zentren: [
        [4, 4],
        [6, 6],
      ],
    });
    expect([r(w.abstand1_1), r(w.abstand1_2), r(w.abstand4_2), r(w.abstand6_1)]).toEqual([2.83, 5.66, 2.24, 7.07]);
    expect([1, 2, 3, 4, 5, 6].map((i) => w[`cluster${i}`])).toEqual([1, 1, 1, 2, 2, 2]);
    expect([w.zentrum1x, w.zentrum1y, w.zentrum2x, w.zentrum2y]).toEqual([2, 2, 8, 8]);
  });

  const knnDaten = (k: number) => ({
    punkte: [
      [1, 2],
      [3, 2],
      [5, 3],
      [6, 5],
      [3, 5],
      [7, 5],
    ],
    klassen: ['nein', 'nein', 'ja', 'ja', 'nein', 'ja'],
    neu: [4, 3],
    k,
  });

  it('Teil 7.2 k-NN: Abstände 3,16 / 1,41 / 1,00 / 2,83 / 2,24 / 3,61, Nachbarn P3, P2, P5 → nein; k = 1 → ja', () => {
    const w = loese('knn', knnDaten(3));
    expect([1, 2, 3, 4, 5, 6].map((i) => r(w[`abstand${i}`]))).toEqual([3.16, 1.41, 1, 2.83, 2.24, 3.61]);
    expect(w.nachbarn).toBe('P3, P2, P5');
    expect([w.stimmen_ja, w.stimmen_nein, w.klasse]).toEqual([1, 2, 'nein']);
    expect(loese('knn', knnDaten(1)).klasse).toBe('ja');
    expect(loese('knn', knnDaten(5)).klasse).toBe('nein');
  });

  it('k-NN: Fehlerbild „nur der nächste Nachbar“ für die Klasse', () => {
    const l = VORLAGEN.knn.loese(VORLAGEN.knn.schema.parse(knnDaten(3)));
    expect(l.fehlerbilder.find((f) => f.eingabe === 'klasse')).toMatchObject({ wert: 'ja', text: expect.stringContaining('k = 1') });
  });

  it('Teil 7.4 ID3: H = 0,971; Gewinn Spediteur 0,371, Lieferdauer 0,125, Verpackung 0,020 → Wurzel Spediteur', () => {
    const w = loese('id3', {
      merkmale: ['Spediteur', 'Lieferdauer', 'Verpackung'],
      ziel: 'Reklamation',
      zeilen: [
        ['Nordtrans', 'lang', 'Standard', 'ja'],
        ['Nordtrans', 'lang', 'Spezial', 'ja'],
        ['Nordtrans', 'lang', 'Standard', 'ja'],
        ['Nordtrans', 'kurz', 'Spezial', 'nein'],
        ['Rheinlogistik', 'kurz', 'Spezial', 'ja'],
        ['Rheinlogistik', 'lang', 'Standard', 'nein'],
        ['Rheinlogistik', 'kurz', 'Standard', 'nein'],
        ['Eigenlieferung', 'kurz', 'Standard', 'nein'],
        ['Eigenlieferung', 'lang', 'Spezial', 'nein'],
        ['Eigenlieferung', 'kurz', 'Standard', 'nein'],
      ],
    });
    expect([w.entropie, w.gewinn1, w.gewinn2, w.gewinn3].map((x) => r(x, 3))).toEqual([0.971, 0.371, 0.125, 0.02]);
    expect([w.entropie1_1, w.entropie1_2, w.entropie1_3, w.rest1].map((x) => r(x, 3))).toEqual([0.811, 0.918, 0, 0.6]);
    expect(w.wurzel).toBe('Spediteur');
  });

  it('ID3: reine Teilmengen haben die Entropie 0, der Gewinn ist dann die ganze Entropie (Ast Nordtrans)', () => {
    const w = loese('id3', {
      merkmale: ['Lieferdauer', 'Verpackung'],
      zeilen: [
        ['lang', 'Standard', 'ja'],
        ['lang', 'Spezial', 'ja'],
        ['lang', 'Standard', 'ja'],
        ['kurz', 'Spezial', 'nein'],
      ],
    });
    expect([w.entropie, w.gewinn1, w.gewinn2].map((x) => r(x, 3))).toEqual([0.811, 0.811, 0.311]);
    expect(w.wurzel).toBe('Lieferdauer');
  });
});

describe('Prozessanalyse (DD5), Datenqualität (DD9), Projektmanagement (DD12)', () => {
  it('C1/C2 Durchlaufzeit 30 h, Wertschöpfung 5 %', () => {
    const w = loese('durchlaufzeit', {
      schritte: [
        { name: 'Auftrag erfassen', bearbeitung: 0.25, liege: 3.5 },
        { name: 'Kostenvoranschlag/Disposition', bearbeitung: 0.25, liege: 16 },
        { name: 'Reparatur durchführen', bearbeitung: 0.75, liege: 9 },
        { name: 'Rechnung stellen', bearbeitung: 0.25, liege: 0 },
      ],
    });
    expect(w).toMatchObject({ bearbeitung: 1.5, liegezeit: 28.5, durchlaufzeit: 30, wertschoepfung: 5 });
  });

  it('C3/C4 Fehlerquote 12 %, FPY 88 %, Nacharbeit 1.080 €, Zuschlag 5,40 €', () => {
    const w = loese('fehlerquote', { gesamt: 200, fehler: 24, nacharbeitJe: 0.75, kostensatz: 60 });
    expect(w).toMatchObject({ fehlerquote: 12, fpy: 88, nacharbeitZeit: 18, nacharbeitskosten: 1080, zuschlag: 5.4 });
  });

  it('DD5 D2 Amortisation aus Aufträgen: 200 h, 12.000 €, 1,5 Jahre; DD12 D1: 2,5 Jahre, ROI 100 % (20 % p. a.)', () => {
    expect(
      loese('amortisation', { investition: 18000, auftraege: 2400, minutenJeAuftrag: 5, kostensatz: 60, nutzungsdauer: 5 }),
    ).toMatchObject({
      stunden: 200,
      einsparung: 12000,
      amortisation: 1.5,
    });
    expect(loese('amortisation', { investition: 45000, einsparung: 18000, nutzungsdauer: 5 })).toMatchObject({
      amortisation: 2.5,
      amortisationMonate: 30,
      gesamtersparnis: 90000,
      gewinn: 45000,
      roi: 100,
      roiJahr: 20,
    });
  });

  it('DD9 C1/C2 Qualitätsgrade 70 / 80 / 90 / 70 %, Datenbestand 95 %', () => {
    const w = loese('qualitaetsgrad', {
      kennzahlen: [
        { id: 'email', name: 'Vollständigkeit E-Mail', gut: 7, gesamt: 10 },
        { id: 'eindeutig', name: 'Eindeutigkeit', gut: 8, gesamt: 10 },
        { id: 'plz', name: 'Gültigkeit PLZ', gut: 9, gesamt: 10 },
        { id: 'geburt', name: 'plausible Geburtsdaten', gut: 7, gesamt: 10 },
        { id: 'bestand', name: 'Vollständigkeit Bestand', gut: 57, gesamt: 60 },
      ],
    });
    expect(w).toMatchObject({ email: 70, eindeutig: 80, plz: 90, geburt: 70, bestand: 95 });
  });

  it('DD12 C1–C3 Netzplan: Tabelle, Projektdauer 25, kritischer Pfad A C D F G, Puffer B 2/0, E 7/7', () => {
    const w = loese('netzplan', {
      vorgaenge: [
        { id: 'A', dauer: 5, vorgaenger: [] },
        { id: 'B', dauer: 4, vorgaenger: ['A'] },
        { id: 'C', dauer: 6, vorgaenger: ['A'] },
        { id: 'D', dauer: 8, vorgaenger: ['B', 'C'] },
        { id: 'E', dauer: 3, vorgaenger: ['B'] },
        { id: 'F', dauer: 4, vorgaenger: ['D', 'E'] },
        { id: 'G', dauer: 2, vorgaenger: ['F'] },
      ],
    });
    const zeile = (id: string) => ['FAZ', 'FEZ', 'SAZ', 'SEZ', 'GP', 'FP'].map((k) => w[`${k}_${id}`]);
    expect(zeile('A')).toEqual([0, 5, 0, 5, 0, 0]);
    expect(zeile('B')).toEqual([5, 9, 7, 11, 2, 0]);
    expect(zeile('C')).toEqual([5, 11, 5, 11, 0, 0]);
    expect(zeile('D')).toEqual([11, 19, 11, 19, 0, 0]);
    expect(zeile('E')).toEqual([9, 12, 16, 19, 7, 7]);
    expect(zeile('F')).toEqual([19, 23, 19, 23, 0, 0]);
    expect(zeile('G')).toEqual([23, 25, 23, 25, 0, 0]);
    expect(w.projektdauer).toBe(25);
    expect(w.kritischerPfad).toBe('A → C → D → F → G');
  });

  it('DD12 D2 Nutzwert A 7,20 / B 7,30 → B; D3 Break-even 800 Stück; E1 Risikozahlen 10 / 16 / 9', () => {
    const nw = loese('nutzwert', {
      kriterien: [
        { name: 'Funktionsumfang', gewicht: 40 },
        { name: 'Kosten', gewicht: 30 },
        { name: 'Integrationsfähigkeit', gewicht: 20 },
        { name: 'Support', gewicht: 10 },
      ],
      alternativen: [
        { name: 'Anbieter A', punkte: [8, 5, 9, 7] },
        { name: 'Anbieter B', punkte: [6, 9, 7, 8] },
      ],
    });
    expect([r(nw.teil1_1), r(nw.teil1_2), r(nw.teil2_2)]).toEqual([3.2, 1.5, 2.7]);
    expect([r(nw.nutzwert1), r(nw.nutzwert2)]).toEqual([7.2, 7.3]);
    expect(nw.beste).toBe('Anbieter B');
    expect(loese('break-even', { fixkosten: 24000, preis: 80, variabel: 50 })).toMatchObject({ db: 30, breakEven: 800 });
    const rs = loese('risiko', {
      risiken: [
        { name: 'Dienstleister', w: 2, s: 5 },
        { name: 'Datenqualität', w: 4, s: 4 },
        { name: 'Fachbereich', w: 3, s: 3 },
      ],
    });
    expect([rs.rpz1, rs.rpz2, rs.rpz3, rs.hoechstes]).toEqual([10, 16, 9, 'Datenqualität']);
  });

  it('DD12 Teil 3.1 Drei-Zeiten-Schätzung: o = 4, m = 7, p = 16 → t_e = 8 Tage; mehrere Pakete mit Summe', () => {
    const v = VORLAGEN.pert;
    const l = v.loese(v.schema.parse({ vorgaenge: [{ name: 'Datenmodell', o: 4, m: 7, p: 16 }] }));
    expect(l.werte).toEqual({ te1: 8 });
    expect(l.fehlerbilder.map((f) => f.wert)).toEqual(expect.arrayContaining([9, 48, 16, 7]));
    const zwei = loese('pert', {
      vorgaenge: [
        { name: 'A', o: 4, m: 7, p: 16 },
        { name: 'B', o: 2, m: 3, p: 10 },
      ],
    });
    expect([zwei.te1, r(zwei.te2), r(zwei.summe)]).toEqual([8, 4, 12]);
    expect(v.schema.safeParse({ vorgaenge: [{ name: 'X', o: 5, m: 4, p: 9 }] }).success).toBe(false);
  });
});

describe('WiSo (DD14) und Datensicherung (DD10)', () => {
  it('A4 Lea: SV-Anteil 261,00 €; A5 Kaya: 676,80 € SV, 18,45 € KiSt, netto 2.299,75 €', () => {
    const lea = loese('sozialversicherung', { brutto: 1200, zusatzbeitrag: 2.9, kinderlos: true });
    expect(lea).toMatchObject({ kv: 105, pv: 28.8, rv: 111.6, alv: 15.6 });
    expect(r(lea.sv)).toBe(261);
    const jonas = loese('sozialversicherung', { brutto: 1200, zusatzbeitrag: 2.9, kinderlos: false });
    expect(r(jonas.sv)).toBe(253.8);
    const kaya = loese('sozialversicherung', { brutto: 3200, zusatzbeitrag: 2.9, kinderlos: false, lohnsteuer: 205, kirchensteuersatz: 9 });
    expect(r(kaya.sv)).toBe(676.8);
    expect(kaya.kirchensteuer).toBe(18.45);
    expect(r(kaya.netto)).toBe(2299.75);
    expect(loese('sozialversicherung', { brutto: 310, zusatzbeitrag: 2.9, kinderlos: false, azubi: true }).sv).toBe(0);
  });

  it('A6 Minijob 43 Stunden; D2 Gleichgewichtspreis 14 €', () => {
    expect(loese('minijob', { grenze: 603, stundenlohn: 13.9 })).toMatchObject({ stunden: 43, verdienst: 597.7 });
    const gg = loese('gleichgewicht', {
      zeilen: [
        { preis: 10, nachfrage: 900, angebot: 300 },
        { preis: 12, nachfrage: 800, angebot: 500 },
        { preis: 14, nachfrage: 650, angebot: 650 },
        { preis: 16, nachfrage: 500, angebot: 800 },
        { preis: 18, nachfrage: 350, angebot: 950 },
      ],
    });
    expect(gg).toMatchObject({ preis: 14, menge: 650 });
  });

  it('DD10 E1/E3 Sicherung: 920 GB / 4 Medien inkrementell, 1.040 GB / 2 Medien differenziell; 15 h Verlust, RPO 4 h verfehlt', () => {
    expect(loese('datensicherung', { voll: 800, aenderung: 40, tage: 3 })).toMatchObject({
      volumenInkrementell: 920,
      volumenDifferenziell: 1040,
      medienInkrementell: 4,
      medienDifferenziell: 2,
    });
    expect(loese('rpo', { sicherungUm: 23, ausfallUm: 14, rpo: 4 })).toMatchObject({ verlust: 15, eingehalten: 'nein' });
  });
});

describe('Zufall und Fehlerbilder', () => {
  it('gleicher Seed → gleiche Zahlen; Seed aus Text ist stabil', () => {
    const a = erzeugeZufall(7);
    const b = erzeugeZufall(7);
    expect(Array.from({ length: 5 }, () => a.ganz(1, 100))).toEqual(Array.from({ length: 5 }, () => b.ganz(1, 100)));
    expect(seedAusText('RE-ST1-001')).toBe(seedAusText('RE-ST1-001'));
    expect(seedAusText('RE-ST1-001')).not.toBe(seedAusText('RE-ST1-002'));
    for (const v of Object.values(VORLAGEN)) expect(v.erzeuge(99)).toEqual(v.erzeuge(99));
  });

  it('Fehlerbilder haben konkrete falsche Werte zu vorhandenen Ergebnissen (Median unsortiert, ÷ n statt ÷ (n − 1), P/R vertauscht)', () => {
    const lm = VORLAGEN.lagemasse.loese(VORLAGEN.lagemasse.schema.parse({ werte: ANLAGE_DD3 }));
    expect(lm.fehlerbilder).toContainEqual(
      expect.objectContaining({ eingabe: 'median', wert: 90, text: expect.stringMatching(/nicht sortiert/) }),
    );
    const va = VORLAGEN.varianz.loese(VORLAGEN.varianz.schema.parse({ werte: [2, 4, 5, 6, 8], art: 'stichprobe' }));
    expect(va.fehlerbilder).toContainEqual({
      eingabe: 'varianz',
      wert: 4,
      text: 'Du hast durch n geteilt – bei einer Stichprobe teilt man durch n − 1.',
    });
    const km = VORLAGEN.konfusionsmatrix.loese(VORLAGEN.konfusionsmatrix.schema.parse({ tp: 90, fp: 60, fn: 10, tn: 840 }));
    expect(km.fehlerbilder).toContainEqual(expect.objectContaining({ eingabe: 'precision', wert: 90 }));
    expect(km.fehlerbilder).toContainEqual(expect.objectContaining({ eingabe: 'f1', wert: 75 }));
    for (const v of Object.values(VORLAGEN)) {
      const l = v.loese(v.erzeuge(5));
      for (const f of l.fehlerbilder) expect(Object.keys(l.werte), `${v.id}: ${f.eingabe}`).toContain(f.eingabe);
    }
  });
});

describe('Fehlerbilder nahe am richtigen Wert', () => {
  it('werden verworfen, wenn sie nach der Rundung des Felds nicht vom richtigen Wert zu unterscheiden sind (F1 ≈ (P + R) / 2)', () => {
    const v = VORLAGEN.konfusionsmatrix;
    const l = v.loese(v.schema.parse({ tp: 76, fp: 30, fn: 29, tn: 500 }));
    const p = l.werte.precision as number;
    const rc = l.werte.recall as number;
    expect(Math.abs((p + rc) / 2 - (l.werte.f1 as number))).toBeLessThan(0.005);
    expect(l.fehlerbilder.filter((f) => f.eingabe === 'f1' && f.text.includes('arithmetische Mittel'))).toEqual([]);
  });
});

describe('Rechenweg-Formeln', () => {
  it('jede Formel aller Vorlagen ist gültiges KaTeX (feste Beispiele und Zufallsdaten)', () => {
    for (const v of Object.values(VORLAGEN)) {
      for (const seed of [1, 2, 3]) {
        for (const s of v.loese(v.schema.parse(v.erzeuge(seed))).schritte) {
          for (const tex of [s.formel, s.einsetzen ?? '']) {
            expect(() => katex.renderToString(tex, { throwOnError: true, strict: 'ignore' }), `${v.id}: ${tex}`).not.toThrow();
          }
          expect(Number.isFinite(s.ergebnis), `${v.id}: ${s.titel}`).toBe(true);
        }
      }
    }
  });
});

describe('Prozessoptimierung (DD5 Teil 6) und Verfügbarkeit (DD16)', () => {
  it('DD5 6.4 FMEA: RPZ 120 / 72 / 168, Vorrang Vorschaden, ab 125 ein Fehler', () => {
    const w = loese('fmea', {
      fehler: [
        { name: 'Ersatzteil falsch bestellt', a: 4, b: 6, e: 5 },
        { name: 'Kundentermin nicht bestätigt', a: 6, b: 4, e: 3 },
        { name: 'Vorschaden bei Abholung nicht dokumentiert', a: 3, b: 8, e: 7 },
      ],
      schwelle: 125,
    });
    expect([w.rpz1, w.rpz2, w.rpz3, w.anzahlKritisch]).toEqual([120, 72, 168, 1]);
    expect(w.hoechstes).toBe('Vorschaden bei Abholung nicht dokumentiert');
  });

  it('FMEA: Fehlerbilder für addiert, ohne E und umgedrehte Entdeckungsskala', () => {
    const v = VORLAGEN.fmea;
    const l = v.loese(v.schema.parse({ fehler: [{ name: 'X', a: 4, b: 6, e: 5 }] }));
    expect(l.fehlerbilder.filter((f) => f.eingabe === 'rpz1').map((f) => f.wert)).toEqual([15, 24, 144]);
  });

  it('DD16 4.4 SLA 99,9 % im Jahr: erlaubt 8,76 h, 12 h Ausfall → 99,863 %, nicht eingehalten', () => {
    const w = loese('verfuegbarkeit', { stunden: 8760, sla: 99.9, ausfall: 12 });
    expect([r(w.erlaubt), r(w.verfuegbarkeit, 3), w.eingehalten]).toEqual([8.76, 99.863, 'nein']);
  });

  it('DD16 D1 SLA 99,5 % im Monat: erlaubt 3,6 h, 4,5 h → 99,375 %; D2 MTBF 1.990 / MTTR 10 → 99,5 %, 43,8 h', () => {
    const w = loese('verfuegbarkeit', { stunden: 720, sla: 99.5, ausfall: 4.5 });
    expect([r(w.erlaubt), r(w.verfuegbarkeit, 3), w.eingehalten]).toEqual([3.6, 99.375, 'nein']);
    expect(loese('verfuegbarkeit', { stunden: 720, sla: 99.5, ausfall: 3 }).eingehalten).toBe('ja');
    const m = loese('mtbf', { mtbf: 1990, mttr: 10 });
    expect([r(m.verfuegbarkeit, 3), r(m.ausfallJahr)]).toEqual([99.5, 43.8]);
  });

  it('DD16 4.3/D3 Systemverfügbarkeit: Reihe 98,901 %, gespiegelt 99,890 %; D3 96,535 % → 98,466 %', () => {
    expect(
      r(
        loese('systemverfuegbarkeit', {
          komponenten: [
            { name: 'Web', v: 99.9 },
            { name: 'DB', v: 99 },
          ],
        }).gesamt,
        3,
      ),
    ).toBe(98.901);
    const gespiegelt = loese('systemverfuegbarkeit', {
      komponenten: [
        { name: 'Web', v: 99.9 },
        { name: 'DB', v: 99, anzahl: 2 },
      ],
    });
    expect([r(gespiegelt.stufe2, 3), r(gespiegelt.gesamt, 3)]).toEqual([99.99, 99.89]);
    const drei = [
      { name: 'Web', v: 99 },
      { name: 'App', v: 99.5 },
    ];
    expect(r(loese('systemverfuegbarkeit', { komponenten: [...drei, { name: 'DB', v: 98 }] }).gesamt, 3)).toBe(96.535);
    expect(r(loese('systemverfuegbarkeit', { komponenten: [...drei, { name: 'DB', v: 98, anzahl: 2 }] }).gesamt, 3)).toBe(98.466);
  });

  it('Systemverfügbarkeit: Fehlerbild „Verfügbarkeiten statt Ausfallwahrscheinlichkeiten multipliziert“', () => {
    const v = VORLAGEN.systemverfuegbarkeit;
    const l = v.loese(v.schema.parse({ komponenten: [{ name: 'DB', v: 98, anzahl: 2 }] }));
    const fb = l.fehlerbilder.find((f) => typeof f.wert === 'number' && Math.abs(f.wert - 96.04) < 1e-9);
    expect(fb?.text).toContain('Ausfall');
  });
});
