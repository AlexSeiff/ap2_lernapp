// Aufgaben und Karteikarten mit verknüpfter SQL-Übung (Felder „aufgaben“ / „karten“ in AP2_SQL_Uebungen.json).
// Rein und klein – wird von AnswerInput, GradePanel und den Karteikarten genutzt, ohne sql.js oder CodeMirror zu laden.

import type { Content, SqlDataset, SqlExercise, Task } from '../../shared/types';

/** SQL-Übung samt Datensatz, mit der eine Aufgabe im SQL-Editor beantwortet wird – oder undefined. */
export function sqlUebungZuAufgabe(
  content: Pick<Content, 'sqlExercises' | 'sqlDatasets'>,
  task: Pick<Task, 'sqlUebung'>,
): { ex: SqlExercise; ds: SqlDataset } | undefined {
  if (!task.sqlUebung) return undefined;
  const ex = content.sqlExercises.find((e) => e.id === task.sqlUebung);
  const ds = ex && content.sqlDatasets.find((d) => d.id === ex.datensatz);
  return ex && ds ? { ex, ds } : undefined;
}

/** Vergleichsregeln beim Prüfen einer verknüpften Aufgabe: bei `spaltenFrei` Spalten über ihren Inhalt zuordnen statt über Namen. */
export function vergleichFuerAufgabe(ex: Pick<SqlExercise, 'vergleich' | 'spaltenFrei'>): SqlExercise['vergleich'] {
  return ex.spaltenFrei ? { ...ex.vergleich, spaltennamen: undefined, spaltenFrei: true } : ex.vergleich;
}
