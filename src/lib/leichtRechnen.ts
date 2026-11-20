// Leicht-Modus der Rechenübungen („🟢 Ergebnis auswählen“, ROADMAP 6.5): je Eingabe der richtige Wert und bis zu 3 falsche.
// Die falschen sind die Fehlerbilder der Vorlage (typische Rechenfehler); gibt es weniger als 3 verschiedene, kommen nahe Werte dazu.
// Rein, getestet in tests/leichtRechnen.test.ts. Nur von der (lazy) Rechenübungs-Seite genutzt.

import { formatWert } from '../rechnen/checker';
import type { AufgeloesteEingabe, RechenInstanz } from '../rechnen/instanz';
import type { Fehlerbild } from '../rechnen/typen';
import type { RechenWert } from '../../domain/types';
import { shuffle } from './shuffle';

export interface RechenOption {
  text: string;
  richtig: boolean;
  /** Erklärung des Fehlerbilds, wenn diese falsche Antwort ein typischer Fehler ist. */
  erklaerung?: string;
}

export interface RechenAuswahl {
  eingabe: string;
  optionen: RechenOption[];
  /** Wie viele falsche Antworten keine Fehlerbilder sind, sondern ergänzte nahe Werte. */
  aufgefuellt: number;
}

const runde = (x: number, stellen: number) => Math.round(x * 10 ** stellen) / 10 ** stellen;

/**
 * Plausible Werte in der Nähe von `v` (für zu wenige Fehlerbilder): Vielfache (× 0,5 … × 2) und kleine Abstände
 * in der Rundung der Eingabe, gleiches Vorzeichen, Prozentwerte bleiben zwischen 0 und 100. Zufällig gemischt,
 * damit die richtige Antwort nicht immer „in der Mitte“ liegt.
 */
export function naheWerte(v: number, e: Pick<AufgeloesteEingabe, 'runden' | 'einheit'>, rng: () => number): number[] {
  const stellen = e.runden ?? (Number.isInteger(v) ? 0 : 2);
  const schritt = 10 ** -stellen;
  const kandidaten = [
    ...[0.5, 0.8, 0.9, 1.1, 1.2, 1.25, 1.5, 2].map((f) => v * f),
    ...[1, 2, 5, 10].flatMap((n) => [v + n * schritt, v - n * schritt]),
  ].map((x) => runde(x, stellen));
  const prozent = e.einheit === '%' && v >= 0 && v <= 100;
  return shuffle(
    [...new Set(kandidaten)].filter((x) => x !== runde(v, stellen) && (v > 0 ? x > 0 : v < 0 ? x < 0 : x >= 0) && (!prozent || x <= 100)),
    rng,
  );
}

/** Ergänzungen für Zahlenlisten (z. B. Ausreißer): ohne einen Wert, „keine“, Werte etwas verschoben. */
function naheListen(l: number[], e: Pick<AufgeloesteEingabe, 'runden'>, rng: () => number): number[][] {
  if (!l.length) return [];
  const stellen = e.runden ?? (l.every(Number.isInteger) ? 0 : 2);
  const max = Math.max(...l.map(Math.abs));
  return shuffle(
    [[], l.slice(1), l.slice(0, -1), l.map((x) => runde(x * 1.1, stellen)), [...l, runde(max * 1.5, stellen)]].filter(
      (x) => x.length || l.length,
    ),
    rng,
  );
}

const JA_NEIN: Record<string, string> = { ja: 'nein', nein: 'ja' };

/** Ergänzungen für Mengen (z. B. kritischer Pfad „A → C → D“): je ein Element weggelassen. */
function naheMengen(text: string, rng: () => number): string[] {
  const teile = text.split(/\s*(?:→|->|,|;)\s*/).filter(Boolean);
  if (teile.length < 3) return [];
  const trenner = text.includes('→') ? ' → ' : ', ';
  return shuffle(
    teile.map((_, i) => teile.filter((_, j) => j !== i).join(trenner)),
    rng,
  );
}

/**
 * Auswahl für eine Eingabe: richtiger Wert + bis zu 3 falsche (Fehlerbilder zuerst, sonst nahe Werte), nach dem Runden
 * auf die Anzeige der Eingabe ohne Doppelte, gemischt. Zahlen und Zahlenlisten bekommen immer 4 Antworten, Mengen
 * (kritischer Pfad) Varianten mit einem fehlenden Element, ja/nein 2, andere Texte nur ihre Fehlerbilder. Weniger als 2 Antworten → undefined (die Eingabe lässt sich nicht auswählen).
 */
export function rechenOptionen(e: AufgeloesteEingabe, fehlerbilder: Fehlerbild[], rng: () => number): RechenAuswahl | undefined {
  const text = (w: RechenWert) => formatWert(w, e);
  const richtig = text(e.erwartet);
  const gesehen = new Set([richtig.toLowerCase()]);
  const falsch: RechenOption[] = [];
  const dazu = (w: RechenWert, erklaerung?: string) => {
    const t = text(w);
    if (falsch.length >= 3 || gesehen.has(t.toLowerCase())) return;
    gesehen.add(t.toLowerCase());
    falsch.push({ text: t, richtig: false, ...(erklaerung ? { erklaerung } : {}) });
  };
  for (const f of shuffle(
    fehlerbilder.filter((f) => f.eingabe === e.id),
    rng,
  ))
    dazu(f.wert, f.text);
  const ausFehlerbildern = falsch.length;
  const w = e.erwartet;
  if (typeof w === 'number') for (const x of naheWerte(w, e, rng)) dazu(x);
  else if (Array.isArray(w)) for (const x of naheListen(w, e, rng)) dazu(x);
  else if (e.vergleich === 'menge') for (const x of naheMengen(w, rng)) dazu(x);
  else if (JA_NEIN[w.trim().toLowerCase()]) dazu(JA_NEIN[w.trim().toLowerCase()]);
  if (!falsch.length) return undefined;
  return {
    eingabe: e.id,
    optionen: shuffle([{ text: richtig, richtig: true }, ...falsch], rng),
    aufgefuellt: falsch.length - ausFehlerbildern,
  };
}

/** Auswahl für alle Eingaben der Übung; undefined, wenn sich eine Eingabe nicht auswählen lässt (dann nur Eintippen). */
export function rechenAuswahl(inst: RechenInstanz, rng: () => number): RechenAuswahl[] | undefined {
  const out: RechenAuswahl[] = [];
  for (const e of inst.eingaben) {
    const a = rechenOptionen(e, inst.loesung.fehlerbilder, rng);
    if (!a) return undefined;
    out.push(a);
  }
  return out;
}
