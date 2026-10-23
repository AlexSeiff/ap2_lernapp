// Rechenübungen: reine Update-Funktionen und Selektoren für den Fortschritt (Progress.rechnen / Progress.rechnenDays).
// Wiederholung wie bei den SQL-Übungen (src/lib/wiederholung.ts, JOURNAL_INTERVALS).

import type { Progress, RechenState } from '../../shared/progress';
import { isDue, localDate } from './progress';
import { nachPruefung, restartRepetition } from './wiederholung';

export type RechenStatus = 'offen' | 'geloest' | 'faellig' | 'mit-loesung';

const emptyState = (): RechenState => ({ attempts: 0, hintsUsed: 0 });

const withState = (p: Progress, id: string, state: RechenState): Progress => ({ ...p, rechnen: { ...p.rechnen, [id]: state } });

/**
 * Speichert eine Prüfung („✓ Prüfen“). Zählt als Versuch und als Lerntag.
 * Alles richtig ohne vorher gezeigte Lösung → gelöst (erstes Mal). Falsch → Wiederholung ab Stufe 1.
 * Richtig bei fälliger Wiederholung → nächste Stufe; richtig vor dem Fälligkeitstag ändert die Wiederholung nicht.
 * Die Eingaben werden nicht gespeichert: Beim nächsten Öffnen beginnt die Übung leer.
 */
export function recordRechenCheck(p: Progress, id: string, ok: boolean, today = localDate()): Progress {
  const prev = p.rechnen[id] ?? emptyState();
  let next: RechenState = { ...prev, attempts: prev.attempts + 1, lastCheckedAt: today, zuletztRichtig: ok };
  if (ok && !next.solutionShown && !next.solvedAt) next = { ...next, solvedAt: today };
  next = nachPruefung(next, ok, today);
  return { ...withState(p, id, next), rechnenDays: { ...p.rechnenDays, [today]: (p.rechnenDays[today] ?? 0) + 1 } };
}

/**
 * Runde im Leicht-Modus („🟢 Ergebnis auswählen“) beendet. Auswählen ist leichter als selbst rechnen, deshalb:
 * zählt als Lerntag (rechnenDays), aber nicht als Versuch und nie als „gelöst“ – gelöst wird eine Übung nur durch Eintippen.
 * Falsch ausgewählt → Wiederholung ab Stufe 1 (morgen), wie eine falsche Prüfung; richtig ändert die Wiederholung nicht.
 */
export function recordRechenLeicht(p: Progress, id: string, ok: boolean, today = localDate()): Progress {
  const prev = p.rechnen[id] ?? emptyState();
  const next: RechenState = ok
    ? { ...prev, lastCheckedAt: today }
    : restartRepetition({ ...prev, lastCheckedAt: today, zuletztRichtig: false }, today);
  return { ...withState(p, id, next), rechnenDays: { ...p.rechnenDays, [today]: (p.rechnenDays[today] ?? 0) + 1 } };
}

/** Ein weiterer Hinweis wurde aufgedeckt. */
export function recordRechenHint(p: Progress, id: string): Progress {
  const prev = p.rechnen[id] ?? emptyState();
  return withState(p, id, { ...prev, hintsUsed: prev.hintsUsed + 1 });
}

/** Lösung angesehen: zählt danach als „mit Lösung“ und nicht als richtig, kommt morgen zur Wiederholung. */
export function recordRechenLoesung(p: Progress, id: string, today = localDate()): Progress {
  const prev = p.rechnen[id] ?? emptyState();
  return withState(p, id, restartRepetition({ ...prev, solutionShown: true, zuletztRichtig: false }, today));
}

/** „🎲 Neue Zahlen“ oder „↩ Originalzahlen“ (seed undefined): merkt sich die Zahlen. */
export function setRechenSeed(p: Progress, id: string, seed: number | undefined): Progress {
  const prev = p.rechnen[id] ?? emptyState();
  const { lastSeed: _seed, ...rest } = prev;
  return withState(p, id, seed === undefined ? rest : { ...rest, lastSeed: seed });
}

/** Status für Liste und Filter. Eine fällige Wiederholung hat Vorrang vor gelöst / mit Lösung. */
export function rechenStatus(state: RechenState | undefined, today = localDate()): RechenStatus {
  if (!state) return 'offen';
  if (state.due !== undefined && isDue(state.due, today)) return 'faellig';
  if (state.solvedAt) return 'geloest';
  if (state.solutionShown) return 'mit-loesung';
  return 'offen';
}

/** Zusammenfassung für Übersicht, Navigation und Liste: gelöst, Anzahl, fällige Wiederholungen. */
export function rechenSummary(p: Progress, ids: string[], today = localDate()): { solved: number; total: number; due: number } {
  let solved = 0;
  let due = 0;
  for (const id of ids) {
    const state = p.rechnen[id];
    if (state?.solvedAt) solved++;
    if (rechenStatus(state, today) === 'faellig') due++;
  }
  return { solved, total: ids.length, due };
}
