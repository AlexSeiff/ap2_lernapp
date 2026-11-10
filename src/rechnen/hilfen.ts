// Gemeinsame Bausteine der Rechenvorlagen: Statistik-Grundfunktionen, Zahlformat für Text und LaTeX,
// ein kleiner Baukasten für Lösungen (Werte, Felder, Schritte, Fehlerbilder) und `vorlage()` zum Definieren.

import type { z } from 'zod';
import { formatZahl, latexZahl, type RechenSchritt } from '../../shared/rechenweg.ts';
import type { RechenWert } from '../../shared/types.ts';
import type { EingabeLayout, Feld, Loesung, Params, Tabelle, Vorlage } from './typen.ts';
import { erzeugeZufall, type Zufall } from './zufall.ts';

// ---------- Rechnen ----------

export const summe = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0);
export const mittel = (xs: readonly number[]) => summe(xs) / xs.length;
export const sortiert = (xs: readonly number[]) => [...xs].sort((a, b) => a - b);

/** Median der (unsortierten) Werte. */
export function median(xs: readonly number[]): number {
  const s = sortiert(xs);
  const m = s.length / 2;
  return s.length % 2 ? s[Math.floor(m)] : (s[m - 1] + s[m]) / 2;
}

/**
 * Quartil nach der Konvention der Lernblätter (Deep Dive 3, 4.2): Position = n · p; keine ganze Zahl → aufrunden und den
 * Wert an dieser Position nehmen; ganze Zahl → Mittel aus diesem und dem nächsten Wert.
 */
export function quartil(xs: readonly number[], p: number): { wert: number; position: number; ganz: boolean } {
  const s = sortiert(xs);
  const pos = runde(s.length * p, 9);
  if (Number.isInteger(pos)) {
    const naechster = s[Math.min(pos, s.length - 1)];
    return { wert: (s[pos - 1] + naechster) / 2, position: pos, ganz: true };
  }
  return { wert: s[Math.ceil(pos) - 1], position: pos, ganz: false };
}

/** Quartil mit linearer Interpolation (Excel QUARTILE.INKL): Position 1 + (n − 1) · p – für das Fehlerbild „andere Konvention“. */
export function quartilInterpoliert(xs: readonly number[], p: number): number {
  const s = sortiert(xs);
  const pos = (s.length - 1) * p;
  const i = Math.floor(pos);
  return i + 1 < s.length ? s[i] + (pos - i) * (s[i + 1] - s[i]) : s[i];
}

/** Häufigste Werte (alle mit maximaler Häufigkeit > 1), aufsteigend. Leer, wenn kein Wert mehrfach vorkommt. */
export function modi(xs: readonly number[]): number[] {
  const count = new Map<number, number>();
  for (const x of xs) count.set(x, (count.get(x) ?? 0) + 1);
  const max = Math.max(...count.values());
  if (max < 2) return [];
  return sortiert([...count].filter(([, c]) => c === max).map(([x]) => x));
}

/** Runden auf `stellen` Nachkommastellen (ohne Gleitkomma-Reste wie 0,30000000000000004). */
export function runde(x: number, stellen = 2): number {
  const f = 10 ** stellen;
  return Math.round((x + Number.EPSILON * Math.sign(x)) * f) / f;
}

// ---------- Format ----------

/** Zahl im deutschen Format für Text und Platzhalter (bis 4 Nachkommastellen oder genau `stellen`). */
export const fz = (x: number, stellen?: number) => formatZahl(x, stellen);
/** Zahlenliste „35, 40, 40“ – mit Nachkommastellen durch Semikolon getrennt („9,0; 8,5“), damit das Komma eindeutig bleibt. */
export const fzListe = (xs: readonly number[], stellen?: number) =>
  xs.map((x) => fz(x, stellen)).join(stellen || !xs.every(Number.isInteger) ? '; ' : ', ');
/** LaTeX-Formeln als Rohtext: L`\bar{x} = ${a}` (Backslashes bleiben erhalten). */
export const L = String.raw;
/** Zahl für LaTeX (`70{,}00`). */
export const lz = (x: number, stellen?: number) => latexZahl(x, stellen);
/** Zahl für LaTeX, negative in Klammern (für Produkte und Summen). */
export const lzk = (x: number, stellen?: number) => (x < 0 ? `(${lz(x, stellen)})` : lz(x, stellen));
/** Text in LaTeX (`\text{…}`), geschützt gegen Sonderzeichen. */
export const tx = (s: string) => `\\text{${s.replace(/([{}%$&#_])/g, '\\$1')}}`;
/** Summe in LaTeX: „2 + 4 + 5“, lange Reihen gekürzt („2 + 4 + … + 8“). */
export function lzSumme(xs: readonly number[], max = 12): string {
  const teile = xs.map((x) => lzk(x));
  return teile.length > max ? [...teile.slice(0, 3), '\\dots', ...teile.slice(-2)].join(' + ') : teile.join(' + ');
}

// ---------- Lösungen bauen ----------

const gleich = (a: RechenWert, b: RechenWert): boolean => {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a));
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => gleich(x, b[i]));
  return a === b;
};
const endlich = (w: RechenWert) =>
  typeof w === 'number' ? Number.isFinite(w) : Array.isArray(w) ? w.every((x) => Number.isFinite(x)) : w.length > 0;

/** Baukasten für eine Lösung: Werte mit Feldangaben, Schritte, Fehlerbilder (doppelte und richtige Werte fliegen raus). */
export class LoesungsBau {
  readonly werte: Record<string, RechenWert> = {};
  readonly felder: Record<string, Feld> = {};
  readonly schritte: RechenSchritt[] = [];
  readonly fehlerbilder: Loesung['fehlerbilder'] = [];

  /** Ergebnis anlegen; liefert den Wert zurück, damit man direkt weiterrechnen kann. */
  wert<T extends RechenWert>(id: string, wert: T, feld: Feld): T {
    this.werte[id] = wert;
    this.felder[id] = feld;
    return wert;
  }

  schritt(s: RechenSchritt): void {
    this.schritte.push(s);
  }

  /**
   * Fehlerbild für ein Ergebnis. Wird verworfen, wenn der Wert zufällig richtig ist (auch: nach der Rundung des Felds
   * nicht vom richtigen zu unterscheiden, z. B. F1 ≈ (P + R) / 2 bei P ≈ R), nicht endlich oder schon vorhanden ist.
   */
  fehler(eingabe: string, wert: RechenWert, text: string): void {
    const richtig = this.werte[eingabe];
    if (richtig === undefined || !endlich(wert) || gleich(wert, richtig)) return;
    const runden = this.felder[eingabe]?.runden;
    if (
      typeof wert === 'number' &&
      typeof richtig === 'number' &&
      runden !== undefined &&
      Math.abs(wert - richtig) <= 0.5 * 10 ** -runden
    ) {
      return;
    }
    if (this.fehlerbilder.some((f) => f.eingabe === eingabe && gleich(f.wert, wert))) return;
    this.fehlerbilder.push({ eingabe, wert, text });
  }

  fertig(layout?: EingabeLayout): Loesung {
    return {
      werte: this.werte,
      felder: this.felder,
      schritte: this.schritte,
      fehlerbilder: this.fehlerbilder,
      ...(layout ? { layout } : {}),
    };
  }
}

// ---------- Parameter ----------

/** Ganzzahliger Parameter mit Standardwert und Grenzen (falsche Typen → Standardwert). */
export function intParam(params: Params, key: string, fallback: number, min: number, max: number): number {
  const v = params[key];
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
}

/** Zahlparameter mit Standardwert und Grenzen. */
export function zahlParam(params: Params, key: string, fallback: number, min = -Infinity, max = Infinity): number {
  const v = params[key];
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
}

export function boolParam(params: Params, key: string, fallback: boolean): boolean {
  const v = params[key];
  return typeof v === 'boolean' ? v : fallback;
}

export function textParam(params: Params, key: string, fallback: string): string {
  const v = params[key];
  return typeof v === 'string' && v.trim() ? v.trim() : fallback;
}

// ---------- Vorlage definieren ----------

interface VorlagenDefinition<D> {
  id: string;
  titel: string;
  bereich: string;
  beschreibung: string;
  schema: z.ZodType<D>;
  /** Zufallsdaten; `vorbild` sind die festen Daten der Übung (falls vorhanden) und geben die Form vor. */
  erzeuge(z: Zufall, params: Params, vorbild?: D): D;
  loese(daten: D): Loesung;
  platzhalter(daten: D): Record<string, string>;
  tabelle?(daten: D): Tabelle | undefined;
  hinweise?: string[];
}

export function vorlage<D>(def: VorlagenDefinition<D>): Vorlage<D> {
  return {
    ...def,
    hinweise: def.hinweise ?? [],
    erzeuge: (seed, params = {}, vorbild) => def.erzeuge(erzeugeZufall(seed), params, vorbild),
  };
}
