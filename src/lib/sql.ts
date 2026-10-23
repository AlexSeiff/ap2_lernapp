// SQL-Übungen: reine Update-Funktionen und Selektoren für den Fortschritt (Progress.sql / Progress.sqlDays).
// Wiederholung wie im Fehlerjournal (JOURNAL_INTERVALS): falsch oder Lösung gezeigt → morgen wieder,
// richtig bei fälliger Wiederholung → nächste Stufe (3, dann 7 Tage), nach der letzten Stufe erledigt.

import type { Progress, SqlState } from '../../shared/progress';
import { isDue, localDate } from './progress';
import { nachPruefung, restartRepetition } from './wiederholung';

/** Maximale Länge der gespeicherten Abfrage (lastQuery). */
export const SQL_QUERY_MAX = 4000;

export type SqlStatus = 'offen' | 'geloest' | 'faellig' | 'mit-loesung';

const emptyState = (): SqlState => ({ attempts: 0, hintsUsed: 0 });

const withState = (p: Progress, id: string, state: SqlState): Progress => ({ ...p, sql: { ...p.sql, [id]: state } });

const truncateQuery = (query: string) => query.slice(0, SQL_QUERY_MAX);

/**
 * Speichert eine Prüfung („✓ Prüfen“). Zählt als Versuch und als Lerntag.
 * Richtig ohne vorher gezeigte Lösung → gelöst (erstes Mal). Falsch → Wiederholung ab Stufe 1.
 * Richtig bei fälliger Wiederholung → nächste Stufe; richtig vor dem Fälligkeitstag ändert die Wiederholung nicht.
 * Die geprüfte Abfrage wird nicht gespeichert (ein Entwurf fällt weg): Beim nächsten Mal beginnt die Übung leer.
 */
export function recordSqlCheck(p: Progress, id: string, ok: boolean, today = localDate()): Progress {
  const { lastQuery: _entwurf, ...prev } = p.sql[id] ?? emptyState();
  let next: SqlState = { ...prev, attempts: prev.attempts + 1, lastCheckedAt: today, zuletztRichtig: ok };
  if (ok && !next.solutionShown && !next.solvedAt) next = { ...next, solvedAt: today };
  next = nachPruefung(next, ok, today);
  return { ...withState(p, id, next), sqlDays: { ...p.sqlDays, [today]: (p.sqlDays[today] ?? 0) + 1 } };
}

/** Ein weiterer Hinweis wurde aufgedeckt. */
export function recordSqlHint(p: Progress, id: string): Progress {
  const prev = p.sql[id] ?? emptyState();
  return withState(p, id, { ...prev, hintsUsed: prev.hintsUsed + 1 });
}

/** Musterlösung angesehen: zählt danach als „mit Lösung“ und nicht als richtig, kommt morgen zur Wiederholung – ohne den Entwurf. */
export function recordSolutionShown(p: Progress, id: string, today = localDate()): Progress {
  const { lastQuery: _entwurf, ...prev } = p.sql[id] ?? emptyState();
  return withState(p, id, restartRepetition({ ...prev, solutionShown: true, zuletztRichtig: false }, today));
}

/**
 * Abfrage, mit der die Übung beim Öffnen startet: nur ein unfertiger Entwurf, nie eine schon geprüfte Antwort.
 * Seit Prüfen und „Lösung zeigen“ den Entwurf löschen (erkennbar an `zuletztRichtig`), ist alles Gespeicherte ein neuer Entwurf;
 * in älteren Ständen ist es nach einer Prüfung die geprüfte Abfrage – dann leer.
 */
export function sqlEntwurf(state: SqlState | undefined): string {
  if (!state?.lastQuery) return '';
  const nieGeprueft = state.lastCheckedAt === undefined && !state.solutionShown;
  return nieGeprueft || state.zuletztRichtig !== undefined ? state.lastQuery : '';
}

/** Merkt sich die aktuelle Abfrage (Entwurf), gekürzt auf SQL_QUERY_MAX Zeichen. */
export function saveSqlQuery(p: Progress, id: string, query: string): Progress {
  const prev = p.sql[id] ?? emptyState();
  const lastQuery = truncateQuery(query);
  if (prev.lastQuery === lastQuery) return p;
  return withState(p, id, { ...prev, lastQuery });
}

/** Status für Liste und Filter. Eine fällige Wiederholung hat Vorrang vor gelöst / mit Lösung. */
export function sqlStatus(state: SqlState | undefined, today = localDate()): SqlStatus {
  if (!state) return 'offen';
  if (state.due !== undefined && isDue(state.due, today)) return 'faellig';
  if (state.solvedAt) return 'geloest';
  if (state.solutionShown) return 'mit-loesung';
  return 'offen';
}

/** Zusammenfassung für Übersicht und Liste: gelöst (ohne Lösung angesehen), Anzahl, fällige Wiederholungen. */
export function sqlSummary(p: Progress, exerciseIds: string[], today = localDate()): { solved: number; total: number; due: number } {
  let solved = 0;
  let due = 0;
  for (const id of exerciseIds) {
    const state = p.sql[id];
    if (state?.solvedAt) solved++;
    if (sqlStatus(state, today) === 'faellig') due++;
  }
  return { solved, total: exerciseIds.length, due };
}
