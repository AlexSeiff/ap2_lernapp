// Ergebnisanzeige des SQL-Editors: Tabelle mit NULL-Darstellung und 500-Zeilen-Grenze, Zeilen geändert (DML),
// Fehler mit deutschem Hinweis und Dialekt-Warnungen.

import type { ReactNode } from 'react';
import { translateError, type ErrorSchema } from '../sql/errors';
import type { ExecResult, LintWarning, SqlValue, StatementResult } from '../sql/types';
import { Icon } from './Icon';

/** Höchstens so viele Zeilen anzeigen (verglichen wird immer mit allen). */
export const MAX_ROWS = 500;

const fmtInt = (n: number) => n.toLocaleString('de-DE');
const plural = (n: number, one: string, many: string) => `${fmtInt(n)} ${n === 1 ? one : many}`;

function fmtMs(ms: number): string {
  if (ms < 1) return '< 1 ms';
  return `${ms < 10 ? ms.toLocaleString('de-DE', { maximumFractionDigits: 1 }) : fmtInt(Math.round(ms))} ms`;
}

/** Text mit `Code`-Spannen (aus errors.ts / checker.ts / lint.ts) → React mit <code>. */
export function withCode(text: string): ReactNode[] {
  return text
    .split(/(`[^`]+`)/)
    .map((part, i) => (part.length > 2 && part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part));
}

export function Cell({ value }: { value: SqlValue }) {
  if (value === null) return <td className="null">NULL</td>;
  if (typeof value === 'number') return <td className="num">{String(value)}</td>;
  if (value instanceof Uint8Array) return <td className="null">BLOB ({plural(value.length, 'Byte', 'Bytes')})</td>;
  return <td>{value}</td>;
}

/** Eine Ergebnistabelle. `ms` optional für die Kopfzeile „3 Zeilen · 2 ms“. */
export function ResultTable({ columns, rows, ms, caption }: { columns: string[]; rows: SqlValue[][]; ms?: number; caption?: ReactNode }) {
  const shown = rows.length > MAX_ROWS ? rows.slice(0, MAX_ROWS) : rows;
  return (
    <div className="sql-result">
      <div className="result-meta">
        {caption && <span>{caption}</span>}
        <span className="muted">
          {rows.length > MAX_ROWS
            ? `… ${fmtInt(rows.length)} Zeilen, ${fmtInt(MAX_ROWS)} angezeigt`
            : plural(rows.length, 'Zeile', 'Zeilen')}
          {ms !== undefined && ` · ${fmtMs(ms)}`}
        </span>
      </div>
      <div className="result-scroll">
        <table className="result-table">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row, r) => (
              <tr key={r}>
                {row.map((v, c) => (
                  <Cell key={c} value={v} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="muted small result-empty">Keine Zeilen.</p>}
      </div>
    </div>
  );
}

/** Kurzzeile für Anweisungen ohne Ergebnistabelle: „3 Zeilen geändert“ bzw. „✓ CREATE TABLE ausgeführt“. */
export function statementLine(s: StatementResult): string {
  const words = s.sql.trim().split(/\s+/);
  const kind = (words[0] ?? '').toUpperCase();
  if (['INSERT', 'UPDATE', 'DELETE', 'REPLACE'].includes(kind) || s.changes > 0) {
    return `${kind ? `${kind}: ` : ''}${plural(s.changes, 'Zeile', 'Zeilen')} geändert`;
  }
  const head = ['CREATE', 'DROP', 'ALTER'].includes(kind) ? words.slice(0, 2).join(' ').toUpperCase() : kind;
  return `✓ ${head || 'Anweisung'} ausgeführt`;
}

export function LintWarnings({ warnings, exercise }: { warnings: LintWarning[]; exercise?: boolean }) {
  if (!warnings.length) return null;
  return (
    <div className="card warn sql-warnings">
      <b>
        <Icon name="triangle-alert" /> Dialekt-Hinweis{warnings.length > 1 ? 'e' : ''}
      </b>
      <ul>
        {warnings.map((w, i) => (
          <li key={i}>
            {withCode(w.message)}
            {exercise && w.blocking && <b> In der Prüfung wäre das ein Fehler.</b>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SqlError({ error, schema }: { error: string; schema?: ErrorSchema }) {
  return (
    <div className="card sql-error" role="alert">
      <p className="bad">
        <b>
          <Icon name="circle-x" /> Fehler:
        </b>{' '}
        <span className="mono error-text">{error}</span>
      </p>
      <p>
        <Icon name="lightbulb" /> {withCode(translateError(error, schema))}
      </p>
    </div>
  );
}

/**
 * Ergebnis eines ganzen Skripts: Zeilen für DML/DDL, die Tabelle der letzten Anweisung mit Ergebnis,
 * bei Fehlern die SQLite-Meldung mit deutschem Hinweis.
 */
export function ExecOutput({ result, schema }: { result: ExecResult; schema?: ErrorSchema }) {
  let lastSet = -1;
  result.statements.forEach((s, i) => {
    if (s.columns.length) lastSet = i;
  });
  const lines = result.statements.filter((s) => !s.columns.length).map(statementLine);
  const set = lastSet >= 0 ? result.statements[lastSet] : undefined;
  return (
    <div className="exec-output">
      {!result.ok && <SqlError error={result.error} schema={schema} />}
      {!!lines.length && (
        <ul className="plain dml-lines">
          {lines.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
      {set && <ResultTable columns={set.columns} rows={set.rows} ms={result.ms} />}
      {result.ok && !set && !lines.length && <p className="muted">Keine Anweisung ausgeführt.</p>}
      {result.ok && !set && !!lines.length && <p className="muted small">{fmtMs(result.ms)}</p>}
    </div>
  );
}

/** Höchstens so viele Zeilen je Seite in der Unterschiede-Tabelle. */
const DIFF_MAX = 50;

/** Unterschiede zur Musterlösung: fehlende Zeilen grün (sollten dabei sein), überzählige rot. */
export function DiffTable({
  columns,
  missing,
  extra,
}: {
  columns: string[];
  missing: StatementResult['rows'];
  extra: StatementResult['rows'];
}) {
  const rows = [
    ...missing.slice(0, DIFF_MAX).map((row) => ({ row, kind: 'missing' as const })),
    ...extra.slice(0, DIFF_MAX).map((row) => ({ row, kind: 'extra' as const })),
  ];
  const cut = missing.length > DIFF_MAX || extra.length > DIFF_MAX;
  return (
    <div className="sql-result diff">
      <p className="small muted">
        <span className="diff-key missing">fehlt</span> sollte in deinem Ergebnis stehen · <span className="diff-key extra">zu viel</span>{' '}
        steht bei dir, gehört aber nicht dazu
      </p>
      <div className="result-scroll">
        <table className="result-table">
          <thead>
            <tr>
              <th />
              {columns.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ row, kind }, r) => (
              <tr key={r} className={`diff-${kind}`}>
                <td className="diff-mark">{kind === 'missing' ? '+ fehlt' : '− zu viel'}</td>
                {row.map((v, c) => (
                  <Cell key={c} value={v} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {cut && <p className="small muted">Nur die ersten {DIFF_MAX} Zeilen je Art.</p>}
    </div>
  );
}
