// Ausgeblendete Lösungsbeispiele („faded worked examples“, ROADMAP 8.6) für Rechenübungen. Rein, ohne React.
//
// Idee: Wer eine Rechenart zum ersten Mal sieht, lernt am meisten aus einem vollständig durchgerechneten Beispiel; mit jedem
// Erfolg wird davon mehr weggelassen, bis nur noch das eigene Ergebnis zählt.
// - Stufe aus dem gespeicherten RechenState (keine Formatänderung): noch nie geprüft → „voll“ (alle Schritte);
//   versucht, aber noch nicht gelöst, oder gerade zurück auf Wiederholungsstufe 1 (falsch/Lösung gezeigt) → „luecke“ (ein Schritt
//   ausgeblendet: rückwärts ausblenden, also der letzte); gelöst und nicht frisch zurückgesetzt → „ergebnis“ (kein Beispiel mehr).
// - Das Beispiel verrät nie die Lösung der aktuellen Zahlen: Übungen mit Vorlage und „Neue Zahlen“ zeigen den Rechenweg mit
//   ANDEREN Zahlen (eigener Seed aus Übungs-ID und aktuellem Seed, Daten müssen sich unterscheiden; von bis zu BEISPIEL_VERSUCHE
//   Seeds der, bei dem sich die meisten gefragten Ergebnisse unterscheiden). Ein Schritt, dessen Ergebnis trotzdem einem deiner
//   gefragten Werte gleicht (z. B. Puffer 0, gleiche x-Werte bei der Regression), zeigt nur die Formel. Geht das nicht (feste Übung ohne „Neue Zahlen“),
//   zeigt das Beispiel nur Schrittnamen und allgemeine Formeln – ohne Einsetzen und Ergebnis, Formeln mit konkreten Zahlen fallen weg.
//   Ohne Rechenweg (Übungen ohne Vorlage) gibt es kein Beispiel.

import type { RechenState } from '../../domain/progress';
import type { RechenUebung } from '../../domain/types';
import { baueInstanz, type RechenInstanz } from './instanz';
import { seedAusText } from './zufall';

export type BeispielStufe = 'voll' | 'luecke' | 'ergebnis';

/** Wie ein Schritt des Beispiels gezeigt wird: ganz (Formel, Einsetzen, Ergebnis), nur Titel + Formel, oder verdeckt (nur Titel). */
export type SchrittSicht = 'ganz' | 'formel' | 'verdeckt';

export type BeispielQuelle = 'andere-zahlen' | 'formeln' | 'keins';

export const BEISPIEL_VERSUCHE = 6;

/** Stufe des Beispiels aus dem Lernstand der Übung. */
export function beispielStufe(state: RechenState | undefined): BeispielStufe {
  if (!state || state.attempts === 0) return state?.solvedAt ? 'ergebnis' : 'voll';
  if (!state.solvedAt || state.stage === 1) return 'luecke';
  return 'ergebnis';
}

/** Hat eine Formel konkrete Zahlen (Dezimalkomma oder mehrstellige Zahl)? Dann würde sie bei gleichen Zahlen zu viel verraten. */
export const formelMitZahlen = (tex: string) => /\{,\}|\d{2,}/.test(tex);

/**
 * Welche Schritte wie zu sehen sind (rein). „voll“: alle; „luecke“: der letzte verdeckt (rückwärts ausblenden); „ergebnis“: keiner.
 * Bei Quelle „formeln“ nie Einsetzen/Ergebnis, und Formeln mit konkreten Zahlen werden verdeckt.
 */
export function beispielSichtbarkeit(stufe: BeispielStufe, formeln: string[], quelle: BeispielQuelle): SchrittSicht[] {
  if (stufe === 'ergebnis' || quelle === 'keins') return [];
  const offen: SchrittSicht = quelle === 'andere-zahlen' ? 'ganz' : 'formel';
  return formeln.map((f, i) => {
    if (stufe === 'luecke' && i === formeln.length - 1) return 'verdeckt';
    if (quelle === 'formeln' && formelMitZahlen(f)) return 'verdeckt';
    return offen;
  });
}

/** Seed für das Beispiel: aus Übungs-ID und den aktuellen Zahlen, nie gleich dem aktuellen Seed. */
export function beispielSeed(id: string, aktuellerSeed: number | undefined, versuch = 0): number {
  const s = (seedAusText(`${id}:beispiel:${versuch}`) ^ (aktuellerSeed ?? 0)) >>> 0 || 1;
  return s === aktuellerSeed ? s + 1 : s;
}

const gleich = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Wie viele gefragte Ergebnisse haben im Beispiel denselben Wert wie bei den aktuellen Zahlen? */
function gleicheErgebnisse(beispiel: RechenInstanz, aktuell: RechenInstanz): number {
  return aktuell.eingaben.filter((e) => gleich(beispiel.loesung.werte[e.id], e.erwartet)).length;
}

export interface Beispiel {
  stufe: BeispielStufe;
  quelle: BeispielQuelle;
  /** Instanz mit anderen Zahlen (nur Quelle „andere-zahlen“), sonst die aktuelle (nur Formeln werden gezeigt). */
  inst?: RechenInstanz;
  sicht: SchrittSicht[];
}

/** Das Beispiel zu einer Übung mit ihren aktuellen Zahlen `aktuell` und dem Lernstand `state`. */
export function baueBeispiel(u: RechenUebung, aktuell: RechenInstanz, state: RechenState | undefined): Beispiel {
  const stufe = beispielStufe(state);
  if (stufe === 'ergebnis' || !aktuell.loesung.schritte.length) return { stufe, quelle: 'keins', sicht: [] };

  let beste: { inst: RechenInstanz; gleich: number } | undefined;
  if (u.vorlage && u.neueZahlen) {
    for (let v = 0; v < BEISPIEL_VERSUCHE; v++) {
      let inst: RechenInstanz;
      try {
        inst = baueInstanz(u, beispielSeed(u.id, aktuell.seed, v));
      } catch {
        continue;
      }
      if (gleich(inst.loesung.werte, aktuell.loesung.werte) || !inst.loesung.schritte.length) continue;
      const n = gleicheErgebnisse(inst, aktuell);
      if (!beste || n < beste.gleich) beste = { inst, gleich: n };
      if (n === 0) break;
    }
  }
  if (beste) {
    const schritte = beste.inst.loesung.schritte;
    const sicht = beispielSichtbarkeit(
      stufe,
      schritte.map((s) => s.formel),
      'andere-zahlen',
    );
    // Schutz: kommt ein Zwischen- oder Endergebnis zufällig auch bei deinen Zahlen heraus (z. B. Puffer 0, gleiche x-Werte),
    // zeigt der Schritt nur die Formel.
    const deine = aktuell.eingaben.flatMap((e) =>
      typeof e.erwartet === 'number' ? [e.erwartet] : Array.isArray(e.erwartet) ? e.erwartet : [],
    );
    const verraet = (x: number) => deine.some((d) => Math.abs(d - x) <= 1e-9 * Math.max(1, Math.abs(d)));
    return {
      stufe,
      quelle: 'andere-zahlen',
      inst: beste.inst,
      sicht: sicht.map((s, i) => (s === 'ganz' && verraet(schritte[i].ergebnis) ? 'formel' : s)),
    };
  }
  const formeln = aktuell.loesung.schritte.map((s) => s.formel);
  return { stufe, quelle: 'formeln', inst: aktuell, sicht: beispielSichtbarkeit(stufe, formeln, 'formeln') };
}
