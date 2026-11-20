// Fehlergründe im Fehlerjournal (ROADMAP 8.7): Texte und Auswertung. Rein, ohne React.
// Gespeichert wird der Grund am Versuch (Attempt.fehlergrund) bzw. während einer Klausur in ExamRun.fehlergrund.

import { FEHLERGRUENDE, type Attempt, type Fehlergrund } from '../../domain/progress';
import type { IconName } from './icons';

export interface FehlergrundInfo {
  id: Fehlergrund;
  /** Mit Emoji, für Knöpfe und Listen. */
  label: string;
  /** Was dagegen hilft (ein Satz) und wohin. */
  tipp: string;
  link: { to: string; text: string };
  icon: IconName;
}

export const FEHLERGRUND_INFO: Record<Fehlergrund, FehlergrundInfo> = {
  begriff: {
    id: 'begriff',
    label: 'Begriff verwechselt',
    icon: 'shuffle',
    tipp: 'Übe die Abgrenzungen und Fallen – dort stehen genau die Begriffe, die man leicht verwechselt.',
    link: { to: '/karteikarten?typ=abgrenzung', text: 'Abgrenzungs-Karten' },
  },
  formel: {
    id: 'formel',
    label: 'Formel falsch',
    icon: 'sigma',
    tipp: 'Schau dir die Formeln noch einmal an und schreib sie auswendig auf.',
    link: { to: '/material/formeln', text: 'Formelsammlung' },
  },
  rechenfehler: {
    id: 'rechenfehler',
    label: 'Rechenfehler',
    icon: 'calculator',
    tipp: 'Rechne in Ruhe nach und runde erst am Ende – die Rechenübungen zeigen typische Fehler.',
    link: { to: '/rechnen', text: 'Rechenübungen' },
  },
  operator: {
    id: 'operator',
    label: 'Operator nicht beachtet',
    icon: 'message-square-quote',
    tipp: 'Lies zuerst den Operator: „nennen“ heißt Stichpunkte, „erläutern“ Zusammenhänge, „beurteilen“ ein Urteil mit Kriterien.',
    link: { to: '/material/operatoren', text: 'Operatoren-Trainer' },
  },
  zeit: {
    id: 'zeit',
    label: 'Zeit',
    icon: 'timer',
    tipp: 'Plane etwa 0,9 Minuten je Punkt und übe ganze Klausuren unter Zeit.',
    link: { to: '/klausur', text: 'Übungsklausur' },
  },
};

export const FEHLERGRUND_LISTE: FehlergrundInfo[] = FEHLERGRUENDE.map((g) => FEHLERGRUND_INFO[g]);

export interface FehlerStatistik {
  /** Versuche unter voller Punktzahl mit gewähltem Grund. */
  anzahl: number;
  /** Je Grund die Anzahl, häufigster zuerst (bei Gleichstand in der Reihenfolge von FEHLERGRUENDE); nur Gründe mit Anzahl > 0. */
  je: { grund: Fehlergrund; anzahl: number }[];
  /** Häufigster Grund; undefined ohne Daten oder bei Gleichstand an der Spitze. */
  haeufigster?: Fehlergrund;
}

/** Wie oft welcher Grund gewählt wurde (nur Versuche unter voller Punktzahl). */
export function fehlerStatistik(attempts: Attempt[]): FehlerStatistik {
  const zaehler = new Map<Fehlergrund, number>();
  for (const a of attempts) {
    if (a.fehlergrund && a.points < a.max) zaehler.set(a.fehlergrund, (zaehler.get(a.fehlergrund) ?? 0) + 1);
  }
  const je = FEHLERGRUENDE.map((grund) => ({ grund, anzahl: zaehler.get(grund) ?? 0 }))
    .filter((x) => x.anzahl > 0)
    .sort((a, b) => b.anzahl - a.anzahl);
  const anzahl = je.reduce((s, x) => s + x.anzahl, 0);
  const haeufigster = je.length && (je.length === 1 || je[0].anzahl > je[1].anzahl) ? je[0].grund : undefined;
  return { anzahl, je, ...(haeufigster ? { haeufigster } : {}) };
}

/** Grund des letzten Versuchs einer Aufgabe (für das Fehlerjournal); undefined, wenn dort keiner gewählt wurde. */
export function letzterFehlergrund(attempts: Attempt[], taskId: string): Fehlergrund | undefined {
  for (let i = attempts.length - 1; i >= 0; i--) if (attempts[i].taskId === taskId) return attempts[i].fehlergrund;
  return undefined;
}
