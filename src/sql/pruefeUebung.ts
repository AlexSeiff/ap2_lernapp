// Prüfung einer Abfrage gegen die Musterlösung einer SQL-Übung – genutzt von der Übungsseite (/sql/uebung/:id)
// und von Aufgaben, die im SQL-Editor beantwortet werden (Einzelaufgabe, Übungsklausur).

import type { SqlDataset, SqlExercise } from '../../shared/types';
import { vergleichFuerAufgabe } from '../lib/sqlAufgabe';
import { compareResults, lastResultSet } from './checker';
import { getSqlEngine } from './engine';
import { hasBlockingWarning, lintSql } from './lint';
import type { CompareVerdict, ExecResult, LintWarning, StatementResult } from './types';

export const VARIANT_MESSAGE = 'Mit leicht geänderten Daten stimmt dein Ergebnis nicht – hast du Werte fest eingetippt?';

export type CheckOutcome =
  | { kind: 'error'; error: string; user: ExecResult }
  | { kind: 'data-error'; error: string }
  | {
      kind: 'verdict';
      ok: boolean;
      verdict: CompareVerdict;
      /** Ergebnis stimmt, aber eine Dialekt-Warnung macht es in der Prüfung falsch. */
      blocked: boolean;
      variantFailed: boolean;
      expectedColumns: string[];
      userSet?: StatementResult;
      ms: number;
    };

const EMPTY_SET: StatementResult = { sql: '', columns: [], rows: [], changes: 0 };

/** Prüft eine Abfrage gegen die Musterlösung (je frische Datenbank), bei Datensätzen mit Variante zusätzlich darauf. */
export async function checkQuery(ex: SqlExercise, ds: SqlDataset, query: string): Promise<CheckOutcome> {
  const engine = getSqlEngine();
  const solutionSql = ex.pruefabfrage ?? ex.loesung;
  const run = await engine.check(ds.setup, query, ex.loesung, ex.pruefabfrage);
  if (!run.user.ok) return { kind: 'error', error: run.user.error, user: run.user };
  const expected = run.solution.ok ? lastResultSet(run.solution.statements) : undefined;
  if (!run.solution.ok || !expected) {
    return { kind: 'data-error', error: run.solution.ok ? 'Die Musterlösung liefert keine Ergebnistabelle.' : run.solution.error };
  }
  const userSet = lastResultSet(run.user.statements);
  const verdict = compareResults(userSet ?? EMPTY_SET, expected, ex.vergleich, solutionSql);
  let variantFailed = false;
  if (verdict.ok && ds.variante) {
    // Gegen fest eingetippte Ergebnisse: dieselbe Prüfung auf leicht geänderten Daten.
    const alt = await engine.check(`${ds.setup}\n${ds.variante}`, query, ex.loesung, ex.pruefabfrage);
    const altExpected = alt.solution.ok ? lastResultSet(alt.solution.statements) : undefined;
    if (altExpected) {
      const altUser = alt.user.ok ? lastResultSet(alt.user.statements) : undefined;
      variantFailed = !altUser || !compareResults(altUser, altExpected, ex.vergleich, solutionSql).ok;
    }
  }
  return {
    kind: 'verdict',
    ok: verdict.ok && !variantFailed,
    verdict,
    blocked: false,
    variantFailed,
    expectedColumns: expected.columns,
    userSet,
    ms: run.user.ms,
  };
}

/** Alle Spaltennamen des Datensatzes – auf einer frischen Datenbank gelesen, die Sitzungsdatenbank bleibt unberührt. */
async function spaltenVon(ds: SqlDataset): Promise<string[]> {
  const sql = "SELECT DISTINCT p.name FROM sqlite_master m JOIN pragma_table_info(m.name) p WHERE m.type = 'table';";
  const run = await getSqlEngine().check(ds.setup, sql, sql);
  const set = run.user.ok ? lastResultSet(run.user.statements) : undefined;
  return set ? set.rows.map((r) => String(r[0])) : [];
}

/**
 * Prüft die Antwort auf eine verknüpfte Aufgabe (Task.sqlUebung) wie „✓ Prüfen“ auf der Übungsseite: Ergebnisvergleich
 * (mit Variante) und Dialekt-Warnungen – ein richtiges Ergebnis mit blockierender Warnung (z. B. Alias im WHERE) zählt
 * nicht als richtig. Bei `spaltenFrei` werden die Spalten über ihren Inhalt zugeordnet.
 */
export async function pruefeAntwort(
  ex: SqlExercise,
  ds: SqlDataset,
  query: string,
): Promise<{ outcome: CheckOutcome; warnings: LintWarning[] }> {
  const warnings = lintSql(query, { columns: await spaltenVon(ds) });
  const outcome = await checkQuery({ ...ex, vergleich: vergleichFuerAufgabe(ex) }, ds, query);
  if (outcome.kind !== 'verdict') return { outcome, warnings };
  const blocked = outcome.verdict.ok && hasBlockingWarning(warnings);
  return { outcome: { ...outcome, ok: outcome.ok && !blocked, blocked }, warnings };
}

/** Meldung zu einem Prüfergebnis (wie auf der Übungsseite). */
export function verdictMessage(outcome: Extract<CheckOutcome, { kind: 'verdict' }>): string {
  if (outcome.ok) return outcome.verdict.message;
  if (outcome.blocked) return 'Noch nicht: Das Ergebnis stimmt, aber in der Prüfung wäre das ein Fehler (siehe Dialekt-Hinweis).';
  if (outcome.variantFailed) return `Noch nicht: ${VARIANT_MESSAGE}`;
  return `Noch nicht: ${outcome.verdict.message}`;
}
