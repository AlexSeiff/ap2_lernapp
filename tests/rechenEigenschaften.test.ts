import { describe, expect, it } from 'vitest';
import type { RechenWert } from '../shared/types';
import { formatWert, pruefeEingabe, toleranz } from '../src/rechnen/checker';
import type { AufgeloesteEingabe } from '../src/rechnen/instanz';
import type { Loesung } from '../src/rechnen/typen';
import { VORLAGEN } from '../src/rechnen/vorlagen/index';

// Eigenschaften jeder Vorlage über viele Zufalls-Seeds: gültige Daten, endliche Ergebnisse (keine Division durch null),
// plausible Wertebereiche, Fehlerbilder, die sich vom richtigen Wert unterscheiden, und eine Prüfung, die den
// richtigen Wert (so formatiert, wie die Lösung ihn zeigt) annimmt und die Fehlerbilder erkennt.

const SEEDS = Array.from({ length: 150 }, (_, i) => i * 7919 + 1);

const zahlen = (w: RechenWert): number[] => (typeof w === 'number' ? [w] : Array.isArray(w) ? w : []);

function eingabe(l: Loesung, id: string): AufgeloesteEingabe {
  const f = l.felder[id];
  const w = l.werte[id];
  return {
    id,
    label: f.label,
    einheit: f.einheit,
    runden: f.runden,
    erwartet: w,
    vergleich: f.vergleich ?? (typeof w === 'number' ? 'zahl' : Array.isArray(w) ? 'liste' : 'text'),
  };
}

/** Prozentwerte, die von Natur aus zwischen 0 und 100 liegen. */
const ANTEIL =
  /^(accuracy|precision|recall|f1|spezifitaet|trivialAccuracy|trivialRecall|rel\d+|kum\d+|fehlerquote|fpy|wertschoepfung|support.*|konfidenz|vk\d+)$/;
/** Werte, die nie negativ sind (Dauern, Mengen, Kosten, Streuung, Abstände). */
const NICHT_NEGATIV =
  /^(summe|spannweite|iqr|saq|varianz|stdabw|sxx|syy|mae|mse|rmse|bearbeitung|liegezeit|durchlaufzeit|nacharbeit.*|zuschlag|amortisation.*|einsparung|gesamtersparnis|db|breakEven|stunden|verdienst|kv|pv|rv|alv|sv|svSatz|kirchensteuer|volumen.*|medien.*|verlust|projektdauer|(FAZ|FEZ|SAZ|SEZ|GP|FP)_.*|abstand.*|rpz\d+|nutzwert\d+|teil\d+_\d+|n|anzahl.*|lift)$/;

function plausibel(id: string, l: Loesung): string[] {
  const w = l.werte;
  const fehler: string[] = [];
  for (const [k, v] of Object.entries(w)) {
    if (typeof v !== 'number') continue;
    if (ANTEIL.test(k) && !(v >= -1e-9 && v <= 100 + 1e-9)) fehler.push(`${k} = ${v} nicht in 0–100 %`);
    if (NICHT_NEGATIV.test(k) && v < -1e-9) fehler.push(`${k} = ${v} negativ`);
  }
  const num = (k: string) => w[k] as number;
  const le = (a: string, b: string) => {
    if (typeof w[a] === 'number' && typeof w[b] === 'number' && num(a) > num(b) + 1e-9) fehler.push(`${a} > ${b}`);
  };
  switch (id) {
    case 'lagemasse':
      le('minimum', 'median');
      le('median', 'maximum');
      le('minimum', 'mittel');
      le('mittel', 'maximum');
      break;
    case 'quartile':
      le('q1', 'median');
      le('median', 'q3');
      le('zaunUnten', 'q1');
      le('q3', 'zaunOben');
      break;
    case 'korrelation':
    case 'regression':
      if (Math.abs(num('r')) > 1 + 1e-9) fehler.push(`|r| > 1`);
      if (num('r2') < -1e-9 || num('r2') > 1 + 1e-9) fehler.push('R² nicht in 0–1');
      break;
    case 'regressionsguete':
      le('mae', 'rmse');
      if (num('r2') > 1 + 1e-9) fehler.push('R² > 1');
      break;
    case 'konfusionsmatrix':
      le('f1', 'precision' in w && num('precision') > num('recall') ? 'precision' : 'recall');
      break;
    case 'netzplan':
      for (const k of Object.keys(w).filter((x) => x.startsWith('GP_'))) {
        const v = k.slice(3);
        le(`FP_${v}`, `GP_${v}`);
        le(`FAZ_${v}`, `SAZ_${v}`);
        le(`SEZ_${v}`, 'projektdauer');
      }
      if (!w.kritischerPfad) fehler.push('kein kritischer Pfad');
      break;
    case 'break-even':
    case 'minijob':
      for (const k of ['breakEven', 'stunden']) if (k in w && !Number.isInteger(num(k))) fehler.push(`${k} nicht ganzzahlig`);
      break;
    case 'datensicherung':
      le('volumenInkrementell', 'volumenDifferenziell');
      break;
    case 'id3':
      for (const k of Object.keys(w).filter((x) => /^(entropie|rest|gewinn)/.test(x))) {
        if (num(k) < -1e-9) fehler.push(`${k} negativ`);
        if (/^(rest|gewinn)/.test(k)) le(k, 'entropie');
      }
      break;
    case 'verfuegbarkeit':
    case 'mtbf':
    case 'systemverfuegbarkeit':
      for (const k of Object.keys(w).filter((x) => /^(verfuegbarkeit|gesamt|stufe\d+)$/.test(x))) {
        if (!(num(k) > 0 && num(k) <= 100 + 1e-9)) fehler.push(`${k} = ${num(k)} nicht in 0–100 %`);
      }
      for (const k of Object.keys(w).filter((x) => /^stufe\d+$/.test(x))) le('gesamt', k);
      break;
    case 'fmea':
      for (const k of Object.keys(w).filter((x) => /^rpz\d+$/.test(x))) {
        if (!(Number.isInteger(num(k)) && num(k) >= 1 && num(k) <= 1000)) fehler.push(`${k} = ${num(k)} keine RPZ`);
      }
      break;
  }
  return fehler;
}

// 150 Seeds je Vorlage: auf einem ausgelasteten Rechner (CI, parallele Testdateien) reicht das Standardlimit von 5 s nicht immer.
describe.each(Object.values(VORLAGEN).map((v) => [v.id, v] as const))('Vorlage %s über viele Seeds', { timeout: 30_000 }, (id, v) => {
  it('erzeugt gültige Daten mit endlichen, plausiblen Ergebnissen', () => {
    for (const seed of SEEDS) {
      const parsed = v.schema.safeParse(v.erzeuge(seed));
      expect(parsed.success, `Seed ${seed}: ${parsed.error?.issues[0]?.message}`).toBe(true);
      const l = v.loese(parsed.data);
      expect(Object.keys(l.felder).sort(), `Seed ${seed}`).toEqual(Object.keys(l.werte).sort());
      for (const [k, w] of Object.entries(l.werte)) {
        if (typeof w === 'string') expect(w.trim(), `Seed ${seed}: ${k}`).not.toBe('');
        for (const x of zahlen(w)) expect(Number.isFinite(x), `Seed ${seed}: ${k} = ${x}`).toBe(true);
      }
      for (const s of l.schritte) expect(Number.isFinite(s.ergebnis), `Seed ${seed}: ${s.titel}`).toBe(true);
      expect(plausibel(id, l), `Seed ${seed}`).toEqual([]);
      expect(Object.values(v.platzhalter(parsed.data)).every((t) => typeof t === 'string' && !/NaN|Infinity|undefined/.test(t))).toBe(true);
      if (l.layout) {
        for (const z of l.layout.zeilen) for (const x of z.ids) if (x !== null) expect(l.werte, `Layout ${x}`).toHaveProperty([x]);
      }
    }
  });

  it('Fehlerbilder unterscheiden sich vom richtigen Wert (auch nach Rundung) und gehören zu einem Ergebnis', () => {
    for (const seed of SEEDS) {
      const l = v.loese(v.schema.parse(v.erzeuge(seed)));
      for (const f of l.fehlerbilder) {
        expect(l.werte, `Seed ${seed}`).toHaveProperty([f.eingabe]);
        expect(f.text.trim(), `Seed ${seed}`).not.toBe('');
        const e = eingabe(l, f.eingabe);
        if (typeof f.wert === 'number' && typeof e.erwartet === 'number') {
          expect(Math.abs(f.wert - e.erwartet), `Seed ${seed}: ${f.eingabe} ${f.wert} ~ ${e.erwartet}`).toBeGreaterThan(
            toleranz(e, e.erwartet),
          );
        } else {
          expect(f.wert, `Seed ${seed}: ${f.eingabe}`).not.toEqual(e.erwartet);
        }
      }
    }
  });

  it('die Prüfung nimmt den richtigen Wert an, so wie die Lösung ihn zeigt – mit und ohne Einheit', () => {
    for (const seed of SEEDS.slice(0, 40)) {
      const l = v.loese(v.schema.parse(v.erzeuge(seed)));
      for (const id of Object.keys(l.werte)) {
        const e = eingabe(l, id);
        const mitEinheit = formatWert(e.erwartet, e);
        const ohne = formatWert(e.erwartet, { runden: e.runden });
        expect(pruefeEingabe(e, mitEinheit, l.fehlerbilder).status, `Seed ${seed}: ${id} „${mitEinheit}“`).toBe('richtig');
        expect(pruefeEingabe(e, ohne, l.fehlerbilder).status, `Seed ${seed}: ${id} „${ohne}“`).toBe('richtig');
      }
    }
  });

  it('die Prüfung erkennt jedes Fehlerbild als falsch und erklärt es', () => {
    for (const seed of SEEDS.slice(0, 40)) {
      const l = v.loese(v.schema.parse(v.erzeuge(seed)));
      for (const f of l.fehlerbilder) {
        const e = eingabe(l, f.eingabe);
        // Genau eingeben (nicht auf die Anzeige gerundet), damit kein anderes Fehlerbild „näher“ liegt.
        const text =
          typeof f.wert === 'number' ? String(f.wert).replace('.', ',') : Array.isArray(f.wert) ? f.wert.join('; ') || 'keine' : f.wert;
        const r = pruefeEingabe(e, text, l.fehlerbilder);
        expect(r.status, `Seed ${seed}: ${f.eingabe} „${text}“`).toBe('falsch');
        expect(r.fehlerbild, `Seed ${seed}: ${f.eingabe} „${text}“`).toBe(true);
      }
    }
  });
});
