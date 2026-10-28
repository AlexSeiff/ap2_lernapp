// Smoke-Test der echten SQL-Übungsdatei (content/AP2_SQL_Uebungen.json) mit sql.js in Node.
// Bewusst ohne src/sql/runner.ts: Der Test soll die Inhalte prüfen, nicht die Engine.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { CONTENT_DIR } from '../server/loadContent';
import { lintSql } from '../src/sql/lint';
import { parseSqlUebungen } from '../shared/sqlUebungen';
import type { SqlDataset } from '../shared/types';

const FILE = 'AP2_SQL_Uebungen.json';
const json = readFileSync(join(CONTENT_DIR, FILE), 'utf8');
const raw = JSON.parse(json) as { datensaetze: { id: string }[]; uebungen: { id: string; datensatz: string }[] };
const { datasets, exercises, issues } = parseSqlUebungen(
  FILE,
  json,
  new Map([
    ['01', 'SQL'],
    ['09', 'Datenqualität'],
  ]),
);
const byId = new Map(datasets.map((d) => [d.id, d]));

let SQL: SqlJsStatic;
beforeAll(async () => {
  SQL = await initSqlJs();
});

function fresh(ds: SqlDataset, variante = false): Database {
  const db = new SQL.Database();
  db.exec(ds.setup);
  if (variante && ds.variante) db.exec(ds.variante);
  return db;
}

/** Ergebnis der letzten Anweisung, die Zeilen liefert (sql.js lässt leere Ergebnisse weg). */
function lastResult(db: Database, sql: string): { columns: string[]; values: unknown[][] } {
  const res = db.exec(sql);
  return res.length ? res[res.length - 1] : { columns: [], values: [] };
}

/** Alle Spaltennamen eines Datensatzes (für lintSql → columns). */
function datasetColumns(ds: SqlDataset): string[] {
  const db = fresh(ds);
  try {
    const tables = lastResult(db, "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").values.flat();
    return tables.flatMap((t) =>
      lastResult(db, `SELECT name FROM pragma_table_info('${String(t)}')`)
        .values.flat()
        .map(String),
    );
  } finally {
    db.close();
  }
}

function count(db: Database, table: string): number {
  return Number(lastResult(db, `SELECT COUNT(*) FROM ${table}`).values[0][0]);
}

describe(`content/${FILE}`, () => {
  it('lässt sich ohne Hinweise importieren', () => {
    expect(issues).toEqual([]);
    expect(datasets.map((d) => d.id)).toEqual(expect.arrayContaining(['moebelhaus', 'datafit']));
    expect(exercises.length).toBeGreaterThanOrEqual(40);
    expect(exercises).toHaveLength(raw.uebungen.length);
  });

  it('hat eindeutige IDs, und jeder Datensatz existiert', () => {
    const ids = raw.uebungen.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
    const dsIds = raw.datensaetze.map((d) => d.id);
    expect(new Set(dsIds).size).toBe(dsIds.length);
    for (const u of raw.uebungen) expect(dsIds, u.id).toContain(u.datensatz);
  });

  it('jedes Setup (und jede Variante) läuft fehlerfrei', () => {
    for (const ds of datasets) {
      expect(() => fresh(ds).close(), ds.id).not.toThrow();
      if (ds.variante) expect(() => fresh(ds, true).close(), `${ds.id} (Variante)`).not.toThrow();
    }
  });

  it('Möbelhaus entspricht dem Blatt aus Deep Dive 1 (5/5/6/8 Zeilen)', () => {
    const db = fresh(byId.get('moebelhaus')!);
    expect(['kunde', 'produkt', 'bestellung', 'bestellposition'].map((t) => count(db, t))).toEqual([5, 5, 6, 8]);
    expect(lastResult(db, 'SELECT name FROM kunde ORDER BY kunden_id').values.flat()).toEqual([
      'Huber GmbH',
      'Schmidt AG',
      'Fischer KG',
      'Weber e.K.',
      'Braun GmbH',
    ]);
    expect(lastResult(db, 'SELECT SUM(preis) FROM produkt').values[0][0]).toBeCloseTo(1005.9, 6);
    db.close();
  });

  it('Fremdschlüssel sind aktiv (PRAGMA foreign_keys = ON im Setup)', () => {
    const db = fresh(byId.get('moebelhaus')!);
    expect(() => db.exec('INSERT INTO bestellung (bestell_id, kunden_id, bestelldatum) VALUES (999, 42, NULL)')).toThrow(/FOREIGN KEY/);
    db.close();
  });

  it('C3 „Umsatz je Kunde" liefert die Zahlen aus der Musterlösung', () => {
    const b8 = exercises.find((u) => u.quelleAufgabe === 'DD1 Übungsklausur C3')!;
    const db = fresh(byId.get(b8.datensatz)!);
    const r = lastResult(db, b8.loesung);
    db.close();
    expect(r.columns).toEqual(['name', 'umsatz']);
    expect(r.values.map((row) => row[0])).toEqual(['Huber GmbH', 'Schmidt AG', 'Fischer KG']);
    expect(r.values.map((row) => Number(row[1]))).toEqual([expect.closeTo(1471.8, 2), expect.closeTo(945, 2), expect.closeTo(767.7, 2)]);
  });

  describe.each(exercises.map((u) => [u.id, u] as const))('%s', (_id, u) => {
    const ds = byId.get(u.datensatz)!;
    const runs = ds.variante ? [false, true] : [false];

    it.each(runs)('Musterlösung läuft (Variante: %s)', (variante) => {
      const db = fresh(ds, variante);
      try {
        let r = lastResult(db, u.loesung);
        if (u.pruefabfrage) r = lastResult(db, u.pruefabfrage);
        if (!u.leerErlaubt) expect(r.values.length).toBeGreaterThan(0);
        if (u.vergleich.spaltennamen && !u.pruefabfrage && r.columns.length) {
          expect(r.columns.map((c) => c.toLowerCase())).toEqual(u.vergleich.spaltennamen.map((c) => c.toLowerCase()));
        }
      } finally {
        db.close();
      }
    });

    it('hat Hinweise und eine Quelle', () => {
      expect(u.hinweise.length).toBeGreaterThanOrEqual(1);
      expect(u.quelleAufgabe).toBeTruthy();
      expect(u.topicId).toBeTruthy();
    });

    it('Musterlösung löst keine blockierende Dialekt-Warnung aus', () => {
      const warnings = lintSql(u.loesung, { columns: datasetColumns(ds) }).filter((w) => w.blocking);
      expect(warnings.map((w) => w.message)).toEqual([]);
    });
  });
});
