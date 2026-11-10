// Neuronale Netze (Deep Dive 6, Teil 9): Ausgabe eines Neurons (gewichtete Summe + Bias, Stufe/Sigmoid/ReLU) und ein Lernschritt
// der Perzeptron-Lernregel (Fehler, neue Gewichte, neuer Bias).

import { z } from 'zod';
import { fz, intParam, L, LoesungsBau, lz, lzk, textParam, vorlage } from '../hilfen.ts';
import { F } from '../formeln.ts';
import type { Zufall } from '../zufall.ts';

const zahl = z.number().finite();
const AKTIVIERUNGEN = ['stufe', 'sigmoid', 'relu'] as const;
type Aktivierung = (typeof AKTIVIERUNGEN)[number];
const NAMEN: Record<Aktivierung, string> = { stufe: 'Stufenfunktion', sigmoid: 'Sigmoid-Funktion', relu: 'ReLU' };

const stufe = (s: number) => (s >= 0 ? 1 : 0);
const sigmoid = (s: number) => 1 / (1 + Math.exp(-s));
const relu = (s: number) => Math.max(0, s);
const aktiviere = (f: Aktivierung, s: number) => (f === 'stufe' ? stufe(s) : f === 'sigmoid' ? sigmoid(s) : relu(s));

/** Gewichtete Summe ohne Rundungsrauschen (die Daten haben höchstens zwei Nachkommastellen). */
const summe = (x: readonly number[], w: readonly number[], b: number) =>
  Math.round((x.reduce((s, xi, i) => s + xi * w[i], 0) + b) * 1e6) / 1e6;

/** „x₁ = 0,8; x₂ = 0,5“ – Indizes als tiefgestellte Ziffern, Semikolon statt „·“ (das läse sich wie ein Malpunkt). */
const TIEF = '₀₁₂₃₄₅₆₇₈₉';
const index = (i: number) => String(i + 1).replace(/\d/g, (d) => TIEF[Number(d)]);
const liste = (name: string, xs: readonly number[]) => xs.map((v, i) => `${name}${index(i)} = ${fz(v)}`).join('; ');

/** LaTeX für Σ wᵢ · xᵢ + b mit eingesetzten Zahlen. */
const summeLatex = (x: readonly number[], w: readonly number[], b: number) =>
  [...x.map((xi, i) => `${lzk(w[i])} \\cdot ${lzk(xi)}`), lzk(b)].join(' + ');

/** Werte in [min, max] im Raster 0,1 ohne 0 (ein Gewicht 0 wäre langweilig). */
const zehntel = (zf: Zufall, min: number, max: number) => {
  for (;;) {
    const v = zf.ganz(Math.round(min * 10), Math.round(max * 10)) / 10;
    if (v !== 0) return v;
  }
};

const datenTabelle = (x: readonly number[], w: readonly number[], b: number) => ({
  kopf: ['Eingang', 'Wert x', 'Gewicht w'],
  zeilen: [...x.map((xi, i) => [`x${index(i)}`, fz(xi), fz(w[i])]), ['Bias b', '–', fz(b)]],
});

// ---------- Ausgabe eines Neurons ----------

const neuronSchema = z
  .object({ x: z.array(zahl).min(1).max(5), w: z.array(zahl).min(1).max(5), b: zahl, f: z.enum(AKTIVIERUNGEN) })
  .refine((d) => d.x.length === d.w.length, { message: 'je Eingabe genau ein Gewicht' });

export const neuron = vorlage({
  id: 'neuron',
  titel: 'Neuron: Ausgabe berechnen',
  bereich: 'CRISP-DM / ML',
  beschreibung: 'Gewichtete Summe z = Σ wᵢ · xᵢ + b und die Ausgabe mit Stufenfunktion, Sigmoid oder ReLU.',
  schema: neuronSchema,
  hinweise: [
    'z = w₁ · x₁ + w₂ · x₂ + … + b – den Bias nicht vergessen.',
    'Stufe: y = 1 ab z ≥ 0. Sigmoid: σ(z) = 1 / (1 + e^(−z)). ReLU: y = max(0, z).',
  ],
  erzeuge(zf, params, vorbild) {
    const n = intParam(params, 'n', vorbild?.x.length ?? 3, 1, 5);
    const gewuenscht = textParam(params, 'f', vorbild?.f ?? '');
    const f: Aktivierung = (AKTIVIERUNGEN as readonly string[]).includes(gewuenscht) ? (gewuenscht as Aktivierung) : zf.wahl(AKTIVIERUNGEN);
    for (let versuch = 0; ; versuch++) {
      const x = Array.from({ length: n }, () => zf.ganz(0, 10) / 10);
      const w = Array.from({ length: n }, () => zehntel(zf, -2, 2));
      const b = zehntel(zf, -1.5, 1.5);
      const s = summe(x, w, b);
      // Kein z nahe 0 (Stufe wäre Auslegungssache), Bias und Vorzeichen sollen etwas ausmachen.
      if ((Math.abs(s) >= 0.1 && x.some((v) => v > 0)) || versuch > 200) return { x, w, b, f };
    }
  },
  platzhalter: (d) => ({
    eingaben: liste('x', d.x),
    gewichte: liste('w', d.w),
    bias: fz(d.b),
    funktion: NAMEN[d.f],
    n: String(d.x.length),
  }),
  tabelle: (d) => datenTabelle(d.x, d.w, d.b),
  loese(d) {
    const b = new LoesungsBau();
    const s = b.wert('z', summe(d.x, d.w, d.b), { label: 'Gewichtete Summe z', runden: 2 });
    const ohneBias = summe(d.x, d.w, 0);
    b.fehler('z', ohneBias, 'Der Bias fehlt – er wird zur gewichteten Summe addiert.');
    b.fehler('z', summe(d.x, d.w, -d.b), 'Der Bias wird **addiert**, nicht abgezogen.');
    b.schritt({ titel: 'Gewichtete Summe', formel: F.neuronSumme.latex, einsetzen: summeLatex(d.x, d.w, d.b), ergebnis: s, runden: 2 });

    const y = aktiviere(d.f, s);
    if (d.f === 'stufe') {
      b.wert('y', y, { label: 'Ausgabe y (Stufenfunktion)', runden: 0 });
      b.fehler('y', 1 - y, 'Die Stufe ist falsch herum: y = 1, sobald z ≥ 0 ist, sonst 0.');
      b.schritt({
        titel: 'Ausgabe mit der Stufenfunktion',
        formel: F.stufenfunktion.latex,
        einsetzen: L`z = ${lz(s, 2)} ${s >= 0 ? '\\ge' : '<'} 0`,
        ergebnis: y,
        runden: 0,
      });
    } else if (d.f === 'sigmoid') {
      b.wert('y', y, { label: 'Ausgabe y (Sigmoid)', runden: 2 });
      b.fehler('y', 1 / (1 + Math.exp(s)), 'Im Exponenten steht **minus** z: σ(z) = 1 / (1 + e^(−z)).');
      b.fehler('y', sigmoid(ohneBias), 'Das ist σ der Summe ohne Bias – erst den Bias addieren, dann σ.');
      b.fehler('y', s, 'Das ist z selbst – die Sigmoid-Funktion fehlt noch.');
      b.schritt({
        titel: 'Ausgabe mit der Sigmoid-Funktion',
        formel: F.sigmoid.latex,
        einsetzen: L`\sigma(${lz(s, 2)}) = \frac{1}{1 + e^{${lz(-s, 2)}}} = \frac{1}{1 + ${lz(Math.exp(-s), 4)}}`,
        ergebnis: y,
        runden: 2,
      });
    } else {
      b.wert('y', y, { label: 'Ausgabe y (ReLU)', runden: 2 });
      b.fehler('y', s, 'ReLU schneidet negative Werte ab: y = max(0, z).');
      b.fehler('y', relu(ohneBias), 'Das ist ReLU der Summe ohne Bias – erst den Bias addieren.');
      b.schritt({ titel: 'Ausgabe mit ReLU', formel: F.relu.latex, einsetzen: L`\max(0,\ ${lz(s, 2)})`, ergebnis: y, runden: 2 });
    }
    return b.fertig();
  },
});

// ---------- Lernschritt des Perzeptrons ----------

const binaer = z.union([z.literal(0), z.literal(1)]);
const perzeptronSchema = z
  .object({
    x: z.array(zahl).min(1).max(5),
    w: z.array(zahl).min(1).max(5),
    b: zahl,
    t: binaer,
    eta: z.number().positive().max(1),
  })
  .refine((d) => d.x.length === d.w.length, { message: 'je Eingabe genau ein Gewicht' });

const r4 = (v: number) => Math.round(v * 1e6) / 1e6;

export const perzeptron = vorlage({
  id: 'perzeptron',
  titel: 'Perzeptron: ein Lernschritt',
  bereich: 'CRISP-DM / ML',
  beschreibung: 'Ausgabe mit Stufenfunktion, Fehler t − y und neue Gewichte und Bias nach der Perzeptron-Lernregel.',
  schema: perzeptronSchema,
  hinweise: [
    'Erst z = Σ wᵢ · xᵢ + b und y = 1 ab z ≥ 0, sonst 0.',
    'Fehler e = t − y (Soll minus Ist).',
    'wᵢ neu = wᵢ + η · e · xᵢ und b neu = b + η · e. Bei e = 0 ändert sich nichts.',
  ],
  erzeuge(zf, params, vorbild) {
    const n = intParam(params, 'n', vorbild?.x.length ?? 2, 1, 5);
    const eta = vorbild?.eta ?? zf.wahl([0.1, 0.2, 0.5]);
    for (let versuch = 0; ; versuch++) {
      const x = Array.from({ length: n }, () => zf.ganz(0, 1));
      const w = Array.from({ length: n }, () => zehntel(zf, -1, 1));
      const b = zehntel(zf, -1, 1);
      const s = summe(x, w, b);
      // Meist eine falsche Ausgabe (sonst gibt es nichts zu lernen); mindestens eine Eingabe 1 und eine 0, wenn möglich.
      const t = (zf.ja(0.85) ? 1 - stufe(s) : stufe(s)) as 0 | 1;
      const gemischt = n === 1 || (x.includes(1) && x.includes(0));
      if ((Math.abs(s) >= 0.1 && gemischt) || versuch > 200) return { x, w, b, t, eta };
    }
  },
  platzhalter: (d) => ({
    eingaben: liste('x', d.x),
    gewichte: liste('w', d.w),
    bias: fz(d.b),
    soll: String(d.t),
    eta: fz(d.eta),
    n: String(d.x.length),
  }),
  tabelle: (d) => ({ ...datenTabelle(d.x, d.w, d.b), titel: `Sollwert t = ${d.t}, Lernrate η = ${fz(d.eta)}` }),
  loese(d) {
    const b = new LoesungsBau();
    const s = b.wert('z', summe(d.x, d.w, d.b), { label: 'Gewichtete Summe z', runden: 2, zusatz: true });
    b.fehler('z', summe(d.x, d.w, 0), 'Der Bias fehlt – er wird zur gewichteten Summe addiert.');
    b.schritt({ titel: 'Gewichtete Summe', formel: F.neuronSumme.latex, einsetzen: summeLatex(d.x, d.w, d.b), ergebnis: s, runden: 2 });

    const y = b.wert('y', stufe(s), { label: 'Ausgabe y', runden: 0 });
    b.fehler('y', 1 - y, 'Die Stufe ist falsch herum: y = 1, sobald z ≥ 0 ist, sonst 0.');
    b.schritt({
      titel: 'Ausgabe (Stufenfunktion)',
      formel: F.stufenfunktion.latex,
      einsetzen: L`z = ${lz(s, 2)} ${s >= 0 ? '\\ge' : '<'} 0`,
      ergebnis: y,
      runden: 0,
    });

    const e = b.wert('e', d.t - y, { label: 'Fehler e = t − y', runden: 0 });
    b.fehler('e', y - d.t, 'Der Fehler ist **Soll minus Ist**: e = t − y.');
    b.schritt({ titel: 'Fehler', formel: L`e = t - y`, einsetzen: L`${lz(d.t)} - ${lz(y)}`, ergebnis: e, runden: 0 });

    d.w.forEach((wi, i) => {
      const xi = d.x[i];
      const id = `w${i + 1}`;
      const neu = b.wert(id, r4(wi + d.eta * e * xi), { label: `Neues Gewicht w${index(i)}`, runden: 2 });
      b.fehler(id, r4(wi - d.eta * e * xi), 'Vorzeichen vertauscht – es heißt w + η · (t − y) · x.');
      b.fehler(id, r4(wi + e * xi), 'Die Lernrate η fehlt – der Schritt wird mit η multipliziert.');
      b.fehler(id, r4(wi + d.eta * e), `Die Eingabe x${index(i)} fehlt – nur Eingaben ungleich 0 verändern ihr Gewicht.`);
      b.schritt({
        titel: `Neues Gewicht w${index(i)}`,
        formel: F.perzeptronLernregel.latex,
        einsetzen: L`${lz(wi)} + ${lz(d.eta)} \cdot ${lzk(e)} \cdot ${lz(xi)}`,
        ergebnis: neu,
        runden: 2,
        ...(e === 0
          ? { hinweis: 'Die Ausgabe ist richtig – nichts ändert sich.' }
          : xi === 0
            ? { hinweis: `x${index(i)} = 0 – das Gewicht bleibt.` }
            : {}),
      });
    });

    const bNeu = b.wert('bNeu', r4(d.b + d.eta * e), { label: 'Neuer Bias b', runden: 2 });
    b.fehler('bNeu', r4(d.b - d.eta * e), 'Vorzeichen vertauscht – es heißt b + η · (t − y).');
    b.fehler('bNeu', r4(d.b + e), 'Die Lernrate η fehlt – der Bias ändert sich um η · (t − y).');
    b.fehler('bNeu', d.b, 'Auch der Bias lernt: b neu = b + η · (t − y).');
    b.schritt({
      titel: 'Neuer Bias',
      formel: L`b^{neu} = b + \eta \cdot (t - y)`,
      einsetzen: L`${lz(d.b)} + ${lz(d.eta)} \cdot ${lzk(e)}`,
      ergebnis: bNeu,
      runden: 2,
    });
    return b.fertig();
  },
});
