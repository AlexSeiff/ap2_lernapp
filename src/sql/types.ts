// Shared contract for the SQL editor (engine, checker, lint, UI).

export type SqlValue = number | string | null | Uint8Array;

/** Result of one statement. Statements without a result set have columns = [] and rows = []. */
export type StatementResult = {
  sql: string;
  columns: string[];
  rows: SqlValue[][];
  /** Rows changed by INSERT/UPDATE/DELETE (sqlite3_changes), 0 otherwise. */
  changes: number;
};

/** Result of running a whole script (possibly several statements separated by `;`). */
export type ExecResult =
  | { ok: true; statements: StatementResult[]; ms: number }
  | { ok: false; error: string; /** statements that ran before the failure */ statements: StatementResult[]; ms: number };

export type SchemaColumn = { name: string; type: string; pk: boolean; fk?: { table: string; column: string } };
export type SchemaTable = { name: string; rowCount: number; columns: SchemaColumn[] };

export type LintWarning = {
  code: 'bare-column' | 'alias-in-where' | 'aggregate-in-where' | 'double-quoted-string' | 'integer-division';
  message: string;
  blocking: boolean;
};

export type CompareOptions = {
  reihenfolge: 'auto' | 'streng' | 'egal';
  spaltennamen?: string[];
  toleranz?: number;
  /**
   * Spalten über ihren Inhalt zuordnen: Namen und Reihenfolge der Spalten zählen nicht, zusätzliche Spalten (z. B. SELECT *)
   * sind erlaubt. Für Aufgaben, deren Text keine Spalten vorgibt (siehe SqlExercise.spaltenFrei).
   */
  spaltenFrei?: boolean;
};

export type CompareVerdict = {
  ok: boolean;
  /** Short German feedback, e.g. „2 Zeilen fehlen, 1 Zeile zu viel“. */
  message: string;
  missing: SqlValue[][];
  extra: SqlValue[][];
};
