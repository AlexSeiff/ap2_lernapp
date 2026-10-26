// Boxplot als Antwort („Skizzieren Sie den Boxplot maßstäblich“): Statt einer Skizze im Textfeld trägst du die fünf Kennwerte und die
// Ausreißer ein, die App zeichnet daraus den Boxplot maßstäblich. Die Formprüfung achtet nur auf die Logik (Reihenfolge, Ausreißer
// außerhalb der Whisker), nie auf die Lösung. Nach der Abgabe vergleicht der Abgleich die Werte mit den „erforderlichen Elementen“
// der Musterlösung. Rein, ohne React.

import type { Task } from '../../shared/types';
import { zahlAus } from './werteTabelle';

export const KENNWERTE = ['min', 'q1', 'median', 'q3', 'max'] as const;
export type Kennwert = (typeof KENNWERTE)[number];

export const KENNWERT_NAMEN: Record<Kennwert, string> = {
  min: 'unteres Whisker-Ende',
  q1: 'Q1 (Box links)',
  median: 'Median',
  q3: 'Q3 (Box rechts)',
  max: 'oberes Whisker-Ende',
};

export interface BoxplotAntwort {
  editor: 'boxplot';
  /** Eingaben als Text (Komma oder Punkt), damit Halbfertiges beim Tippen nicht verloren geht. */
  werte: Record<Kennwert, string>;
  /** Ausreißer, getrennt durch ; oder Leerzeichen. */
  ausreisser: string;
  notiz?: string;
}

/** Fertige Zahlen eines Boxplots (nur wenn alle fünf Kennwerte Zahlen sind). */
export interface BoxplotZahlen {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  ausreisser: number[];
}

export const leereBoxplotAntwort = (): BoxplotAntwort => ({
  editor: 'boxplot',
  werte: { min: '', q1: '', median: '', q3: '', max: '' },
  ausreisser: '',
});

export const istBoxplotLeer = (a: BoxplotAntwort) => !a.notiz?.trim() && !a.ausreisser.trim() && KENNWERTE.every((k) => !a.werte[k].trim());

/** Ausreißer-Liste: „220“, „5; 220“, „5 und 220“. Ein Komma ist Dezimalkomma, getrennt wird mit ; oder Leerzeichen. */
export function ausreisserListe(text: string): { zahlen: number[]; ungueltig: string[] } {
  const teile = text
    .split(/[;\s]+|\bund\b/)
    .map((t) => t.trim())
    .filter(Boolean);
  const zahlen: number[] = [];
  const ungueltig: string[] = [];
  for (const t of teile) {
    const z = zahlAus(t);
    if (z === undefined) ungueltig.push(t);
    else zahlen.push(z);
  }
  return { zahlen: zahlen.sort((a, b) => a - b), ungueltig };
}

/** Alle fünf Kennwerte als Zahlen – sonst undefined (dann wird noch nichts gezeichnet). */
export function boxplotZahlen(a: BoxplotAntwort): BoxplotZahlen | undefined {
  const z = Object.fromEntries(KENNWERTE.map((k) => [k, zahlAus(a.werte[k])])) as Record<Kennwert, number | undefined>;
  if (KENNWERTE.some((k) => z[k] === undefined)) return undefined;
  return { ...(z as Record<Kennwert, number>), ausreisser: ausreisserListe(a.ausreisser).zahlen };
}

/** Formfehler (ohne Blick auf die Lösung): Reihenfolge der Kennwerte, Ausreißer innerhalb der Whisker, unlesbare Eingaben. */
export function pruefeBoxplot(a: BoxplotAntwort): string[] {
  const m: string[] = [];
  for (const k of KENNWERTE)
    if (a.werte[k].trim() && zahlAus(a.werte[k]) === undefined) m.push(`„${a.werte[k]}“ bei ${KENNWERT_NAMEN[k]} ist keine Zahl.`);
  const { ungueltig } = ausreisserListe(a.ausreisser);
  if (ungueltig.length) m.push(`Bei den Ausreißern ist ${ungueltig.map((t) => `„${t}“`).join(', ')} keine Zahl (mehrere mit ; trennen).`);
  const z = boxplotZahlen(a);
  if (!z) {
    if (!m.length && KENNWERTE.some((k) => !a.werte[k].trim())) m.push('Trag alle fünf Kennwerte ein, dann entsteht der Boxplot.');
    return m;
  }
  if (!(z.min <= z.q1 && z.q1 <= z.median && z.median <= z.q3 && z.q3 <= z.max))
    m.push('Die Kennwerte müssen aufsteigen: unteres Whisker-Ende ≤ Q1 ≤ Median ≤ Q3 ≤ oberes Whisker-Ende.');
  const innen = z.ausreisser.filter((x) => x >= z.min && x <= z.max);
  if (innen.length) m.push(`Ein Ausreißer liegt außerhalb der Whisker – ${innen.join('; ')} liegt innerhalb.`);
  return m;
}

// ---------- Musterlösung ----------

/** Zahl nach einem Stichwort in der Musterlösung („Box von 40 bis 70“, „oberer Whisker bis **90**“). */
function zahlNach(md: string, muster: RegExp): number | undefined {
  const m = md.replace(/\*\*/g, '').match(muster);
  return m ? zahlAus(m[1]) : undefined;
}

/** Kennwerte aus den „Erforderlichen Elementen“ der Musterlösung; undefined, wenn sie dort nicht vollständig stehen. */
export function musterBoxplot(task: Pick<Task, 'solution'>): BoxplotZahlen | undefined {
  const md = task.solution?.markdown ?? '';
  const zahl = String.raw`(−?-?\d+(?:[.,]\d+)?)`;
  const box = md.replace(/\*\*/g, '').match(new RegExp(String.raw`Box von ${zahl} bis ${zahl}`));
  const werte = {
    min: zahlNach(md, new RegExp(String.raw`unterer Whisker bis ${zahl}`)),
    q1: box ? zahlAus(box[1]) : undefined,
    median: zahlNach(md, new RegExp(String.raw`Median\w* bei ${zahl}`)),
    q3: box ? zahlAus(box[2]) : undefined,
    max: zahlNach(md, new RegExp(String.raw`oberer Whisker bis ${zahl}`)),
  };
  if (KENNWERTE.some((k) => werte[k] === undefined)) return undefined;
  const aus = md.replace(/\*\*/g, '').match(/Ausreißer\s+([\d.,;\s]+?)(?:\s+als|\s*\(|\s*\*|$)/m);
  return { ...(werte as Record<Kennwert, number>), ausreisser: aus ? ausreisserListe(aus[1]).zahlen : [] };
}

export interface BoxplotAbgleich {
  muster: BoxplotZahlen;
  zeilen: { name: string; dein: string; muster: string; ok: boolean }[];
}

const gleich = (a: number, b: number) => Math.abs(a - b) <= Math.max(0.006, Math.abs(b) * 0.0015);
const zahlText = (n: number) => String(n).replace('.', ',');

/** Werte neben die der Musterlösung legen; undefined ohne auslesbare Musterlösung. */
export function gleicheBoxplotAb(task: Pick<Task, 'solution'>, a: BoxplotAntwort): BoxplotAbgleich | undefined {
  const muster = musterBoxplot(task);
  if (!muster) return undefined;
  const zeilen = KENNWERTE.map((k) => {
    const z = zahlAus(a.werte[k]);
    return {
      name: KENNWERT_NAMEN[k],
      dein: a.werte[k].trim() || '–',
      muster: zahlText(muster[k]),
      ok: z !== undefined && gleich(z, muster[k]),
    };
  });
  const deine = ausreisserListe(a.ausreisser).zahlen;
  zeilen.push({
    name: 'Ausreißer',
    dein: deine.length ? deine.map(zahlText).join('; ') : 'keine',
    muster: muster.ausreisser.length ? muster.ausreisser.map(zahlText).join('; ') : 'keine',
    ok: deine.length === muster.ausreisser.length && deine.every((x, i) => gleich(x, muster.ausreisser[i])),
  });
  return { muster, zeilen };
}

export function boxplotAlsText(a: BoxplotAntwort): string {
  const teile = KENNWERTE.map((k) => `${KENNWERT_NAMEN[k]}: ${a.werte[k].trim() || '–'}`);
  teile.push(`Ausreißer: ${a.ausreisser.trim() || 'keine'}`);
  const text = `Boxplot – ${teile.join(' · ')}`;
  return a.notiz?.trim() ? `${text}\n\n${a.notiz.trim()}` : text;
}

// ---------- Achse ----------

/** Achse mit „runden“ Teilstrichen (1, 2, 2,5, 5 × 10^n), etwa sechs Abschnitte, alle Werte eingeschlossen. */
export function achse(werte: number[]): { von: number; bis: number; schritt: number; striche: number[] } {
  let lo = Math.min(...werte);
  let hi = Math.max(...werte);
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const roh = (hi - lo) / 6;
  const basis = 10 ** Math.floor(Math.log10(roh));
  const schritt = [1, 2, 2.5, 5, 10].map((f) => f * basis).find((s) => s >= roh)!;
  const von = Math.floor(lo / schritt) * schritt;
  const bis = Math.ceil(hi / schritt) * schritt;
  const striche: number[] = [];
  for (let v = von; v <= bis + schritt / 1000; v += schritt) striche.push(Math.round(v * 1e6) / 1e6);
  return { von, bis, schritt, striche };
}
