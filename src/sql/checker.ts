// Vergleich einer Übungsabfrage mit der Musterlösung – rein, ohne DOM und ohne sql.js.
// Verglichen werden die schon berechneten Ergebnisse (StatementResult), nicht der SQL-Text:
// SQL hat viele richtige Schreibweisen (JOIN oder Unterabfrage, Aliase, Formatierung).

import type { CompareOptions, CompareVerdict, SqlValue, StatementResult } from './types';

/** Standard-Toleranz für Zahlen (halbe Einheit der zweiten Nachkommastelle). */
export const DEFAULT_TOLERANZ = 0.005;

/** Ergebnis der letzten Anweisung mit Ergebnistabelle (z. B. das SELECT nach einem INSERT). */
export function lastResultSet(statements: StatementResult[]): StatementResult | undefined {
  for (let i = statements.length - 1; i >= 0; i--) if (statements[i].columns.length > 0) return statements[i];
  return undefined;
}

type Token = { word?: string; punct?: string; depth: number };

/** Zerlegt SQL grob in Wörter und Satzzeichen; Strings, Bezeichner in Anführungszeichen und Kommentare fallen weg. */
function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let depth = 0;
  let i = 0;
  const skipQuoted = (close: string) => {
    i++;
    while (i < sql.length) {
      if (sql[i] === close) {
        // Verdoppeltes Anführungszeichen ('' bzw. "") ist ein escaptes Zeichen, kein Ende.
        if (close !== ']' && sql[i + 1] === close) i += 2;
        else {
          i++;
          return;
        }
      } else i++;
    }
  };
  while (i < sql.length) {
    const c = sql[i];
    if (c === '-' && sql[i + 1] === '-') {
      const end = sql.indexOf('\n', i);
      i = end === -1 ? sql.length : end + 1;
    } else if (c === '/' && sql[i + 1] === '*') {
      const end = sql.indexOf('*/', i + 2);
      i = end === -1 ? sql.length : end + 2;
    } else if (c === "'" || c === '"' || c === '`') {
      skipQuoted(c);
      tokens.push({ word: '"', depth }); // Platzhalter, damit ein String zwischen ORDER und BY das Paar trennt
    } else if (c === '[') {
      skipQuoted(']');
      tokens.push({ word: '"', depth });
    } else if (/[A-Za-z_]/.test(c)) {
      const start = i;
      while (i < sql.length && /[A-Za-z0-9_$]/.test(sql[i])) i++;
      tokens.push({ word: sql.slice(start, i).toUpperCase(), depth });
    } else if (/\s/.test(c)) {
      i++;
    } else {
      if (c === ')') depth = Math.max(0, depth - 1);
      tokens.push({ punct: c, depth });
      if (c === '(') depth++;
      i++;
    }
  }
  return tokens;
}

/**
 * Hat die (letzte) Anweisung ein ORDER BY auf oberster Ebene? ORDER BY in Unterabfragen, CTEs oder
 * Fensterfunktionen (in Klammern), in Strings und in Kommentaren zählt nicht. Für `reihenfolge: 'auto'`.
 */
export function hasTopLevelOrderBy(sql: string): boolean {
  const tokens = tokenize(sql);
  let found = false;
  let newStatement = false;
  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k];
    if (t.depth === 0 && t.punct === ';') {
      newStatement = true;
      continue;
    }
    if (newStatement) {
      // Erst ein weiteres Token nach dem Semikolon beginnt eine neue Anweisung (abschließendes „;“ ändert nichts).
      found = false;
      newStatement = false;
    }
    if (t.depth === 0 && t.word === 'ORDER' && tokens[k + 1]?.word === 'BY') found = true;
  }
  return found;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

/** NULL ≠ '' ≠ 0; Zahlen mit Toleranz (5 und 5.0 sind gleich); Text exakt (kein Trim, keine Groß-/Kleinschreibung). */
function valuesEqual(a: SqlValue, b: SqlValue, tol: number): boolean {
  if (a === null || b === null) return a === b;
  if (typeof a === 'number' && typeof b === 'number') return a === b || Math.abs(a - b) <= tol + 1e-9;
  if (typeof a === 'string' && typeof b === 'string') return a === b;
  if (a instanceof Uint8Array && b instanceof Uint8Array) return bytesEqual(a, b);
  return false;
}

const rowsEqual = (a: SqlValue[], b: SqlValue[], tol: number) => a.length === b.length && a.every((v, i) => valuesEqual(v, b[i], tol));

/** Schlüssel für den schnellen Multiset-Vergleich: Zahlen auf das Toleranzraster gerundet, Typ steht davor. */
function valueKey(v: SqlValue, tol: number): string {
  if (v === null) return 'n';
  if (typeof v === 'number') return `d:${tol > 0 ? Math.round(v / tol) : v}`;
  if (typeof v === 'string') return `s:${v}`;
  return `b:${Array.from(v, (x) => x.toString(16).padStart(2, '0')).join('')}`;
}

const rowKey = (row: SqlValue[], tol: number) => JSON.stringify(row.map((v) => valueKey(v, tol)));

/** Vergleicht zwei Ergebnisse als Multimenge (Duplikate zählen). Liefert fehlende und überzählige Zeilen. */
function multisetDiff(user: SqlValue[][], expected: SqlValue[][], tol: number): { missing: SqlValue[][]; extra: SqlValue[][] } {
  const byKey = new Map<string, number[]>();
  user.forEach((row, i) => {
    const key = rowKey(row, tol);
    const list = byKey.get(key);
    if (list) list.push(i);
    else byKey.set(key, [i]);
  });
  const used = new Set<number>();
  const unmatched: SqlValue[][] = [];
  for (const row of expected) {
    const i = byKey.get(rowKey(row, tol))?.pop();
    if (i === undefined) unmatched.push(row);
    else used.add(i);
  }
  // Werte knapp an einer Rastergrenze landen in verschiedenen Schlüsseln – für die Reste paarweise mit Toleranz vergleichen.
  let leftover = user.map((row, i) => ({ row, i })).filter(({ i }) => !used.has(i));
  const missing: SqlValue[][] = [];
  for (const row of unmatched) {
    const hit = leftover.findIndex((u) => rowsEqual(u.row, row, tol));
    if (hit === -1) missing.push(row);
    else leftover = leftover.filter((_, k) => k !== hit);
  }
  return { missing, extra: leftover.map((u) => u.row) };
}

/** Höchstens so viele vollständige Zuordnungen prüfen (bei wenigen Spalten weit mehr als genug). */
const MAX_ZUORDNUNGEN = 2000;

const project = (rows: SqlValue[][], cols: number[]) => rows.map((row) => cols.map((c) => row[c]));

/**
 * `spaltenFrei`: ordnet jeder erwarteten Spalte eine Spalte der Abfrage mit gleichem Inhalt zu (erst je Spalte als
 * Multimenge, dann zeilenweise geprüft). Liefert die Spaltenindizes der Abfrage in der Reihenfolge der erwarteten Spalten.
 * Passt keine Zuordnung, dann gleicher Name bzw. gleiche Position – damit die Meldung fehlende/überzählige Zeilen zeigt.
 */
function spaltenZuordnung(user: StatementResult, expected: StatementResult, tol: number): number[] {
  const ersatz = expected.columns.map((name, j) => {
    const gleich = user.columns.findIndex((c) => c.toLowerCase() === name.toLowerCase());
    return gleich !== -1 ? gleich : j;
  });
  if (user.rows.length !== expected.rows.length) return ersatz;
  const spalte = (rows: SqlValue[][], i: number) =>
    rows
      .map((r) => valueKey(r[i], tol))
      .sort()
      .join('|');
  const userSpalten = user.columns.map((_, i) => spalte(user.rows, i));
  const kandidaten = expected.columns.map((_, j) => {
    const key = spalte(expected.rows, j);
    return userSpalten.flatMap((k, i) => (k === key ? [i] : []));
  });
  const gewaehlt: number[] = [];
  let versuche = 0;
  const suche = (j: number): boolean => {
    if (j === kandidaten.length) {
      versuche++;
      const { missing, extra } = multisetDiff(project(user.rows, gewaehlt), expected.rows, tol);
      return missing.length === 0 && extra.length === 0;
    }
    for (const i of kandidaten[j]) {
      if (versuche >= MAX_ZUORDNUNGEN) return false;
      if (gewaehlt.includes(i)) continue;
      gewaehlt.push(i);
      if (suche(j + 1)) return true;
      gewaehlt.pop();
    }
    return false;
  };
  return suche(0) ? gewaehlt : ersatz;
}

/**
 * Vergleicht das Ergebnis der Abfrage mit dem der Musterlösung.
 * `solutionSql` ist das SQL, das `expected` erzeugt hat (bei DML-Übungen die Prüfabfrage); es entscheidet bei
 * `reihenfolge: 'auto'`, ob die Reihenfolge zählt.
 */
export function compareResults(
  user: StatementResult,
  expected: StatementResult,
  opts: CompareOptions,
  solutionSql: string,
): CompareVerdict {
  const tol = opts.toleranz !== undefined && opts.toleranz >= 0 ? opts.toleranz : DEFAULT_TOLERANZ;
  const fail = (message: string, missing: SqlValue[][] = [], extra: SqlValue[][] = []): CompareVerdict => ({
    ok: false,
    message,
    missing,
    extra,
  });

  if (user.columns.length === 0 && expected.columns.length > 0) {
    return fail('Deine Abfrage liefert keine Ergebnistabelle – fehlt ein SELECT?');
  }
  if (opts.spaltenFrei) {
    const n = expected.columns.length;
    if (user.columns.length < n) {
      return fail(
        `Deine Abfrage liefert ${plural(user.columns.length, 'Spalte', 'Spalten')}, erwartet ${n === 1 ? 'ist' : 'sind'} mindestens ${n}.`,
      );
    }
    // Ab hier wie gewohnt, aber mit den zugeordneten Spalten in der Reihenfolge der Musterlösung.
    user = { ...user, columns: expected.columns, rows: project(user.rows, spaltenZuordnung(user, expected, tol)) };
  } else {
    if (user.columns.length !== expected.columns.length) {
      const n = expected.columns.length;
      return fail(`Deine Abfrage liefert ${plural(user.columns.length, 'Spalte', 'Spalten')}, erwartet ${n === 1 ? 'ist' : 'sind'} ${n}.`);
    }
    const names = opts.spaltennamen ?? [];
    for (let i = 0; i < names.length && i < user.columns.length; i++) {
      if (user.columns[i].toLowerCase() !== names[i].toLowerCase()) {
        return fail(`Spalte ${i + 1} soll \`${names[i]}\` heißen – Alias mit AS vergeben.`);
      }
    }
  }

  const strict = opts.reihenfolge === 'streng' || (opts.reihenfolge === 'auto' && hasTopLevelOrderBy(solutionSql));
  const { missing, extra } = multisetDiff(user.rows, expected.rows, tol);
  if (missing.length || extra.length) {
    const parts: string[] = [];
    if (missing.length) parts.push(`${plural(missing.length, 'Zeile', 'Zeilen')} ${missing.length === 1 ? 'fehlt' : 'fehlen'}`);
    if (extra.length) parts.push(`${plural(extra.length, 'Zeile', 'Zeilen')} zu viel`);
    return fail(`${parts.join(', ')}.`, missing, extra);
  }
  if (strict && !user.rows.every((row, i) => rowsEqual(row, expected.rows[i], tol))) {
    return fail('Zeilen stimmen, aber die Reihenfolge nicht.');
  }
  const rows = plural(expected.rows.length, 'Zeile', 'Zeilen');
  return { ok: true, message: `Richtig! ${rows}${strict ? ', Reihenfolge stimmt' : ''}.`, missing: [], extra: [] };
}
