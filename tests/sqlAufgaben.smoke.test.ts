// Smoke-Test: Aufgaben aus den Übungsklausuren, die im SQL-Editor beantwortet werden (Feld „aufgaben“ in AP2_SQL_Uebungen.json).
// Prüft mit den echten Inhalten, dass typische richtige Klausurantworten die automatische Prüfung bestehen – auch wenn der
// Aufgabentext keine Spalten vorgibt (SELECT *, COUNT ohne Alias) – und dass falsche Antworten durchfallen.

import initSqlJs, { type SqlJsStatic } from 'sql.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { CONTENT_DIR, ladeInhalt } from '../server/loadContent';
import { sqlUebungZuAufgabe, vergleichFuerAufgabe } from '../src/lib/sqlAufgabe';
import { compareResults } from '../src/sql/checker';
import type { SqlValue, StatementResult } from '../src/sql/types';

const { content } = ladeInhalt(CONTENT_DIR);

let SQL: SqlJsStatic;
beforeAll(async () => {
  SQL = await initSqlJs();
});

/** Ergebnis der letzten Anweisung mit Zeilen nach `query` (bei DML/DDL die Prüfabfrage) auf frischer Datenbank. */
function ergebnis(setup: string, query: string, pruefabfrage?: string): StatementResult {
  const db = new SQL.Database();
  try {
    db.exec(setup);
    let res = db.exec(query);
    if (pruefabfrage) res = db.exec(pruefabfrage);
    const last = res[res.length - 1] ?? { columns: [], values: [] };
    return { sql: query, columns: last.columns, rows: last.values as SqlValue[][], changes: 0 };
  } finally {
    db.close();
  }
}

/** Wie die App nach der Abgabe prüft (ohne Worker und ohne Variante). */
function pruefe(taskId: string, query: string) {
  const sql = sqlUebungZuAufgabe(content, content.tasks[taskId]);
  if (!sql) throw new Error(`${taskId} ist nicht mit einer SQL-Übung verknüpft`);
  const { ex, ds } = sql;
  const expected = ergebnis(ds.setup, ex.loesung, ex.pruefabfrage);
  return compareResults(ergebnis(ds.setup, query, ex.pruefabfrage), expected, vergleichFuerAufgabe(ex), ex.pruefabfrage ?? ex.loesung);
}

const verknuepft = Object.values(content.tasks).filter((t) => t.sqlUebung);

describe('Klausuraufgaben im SQL-Editor', () => {
  it('alle Abfrage-Aufgaben aus DD1 und DataFit sind verknüpft, ohne Importhinweise', () => {
    expect(content.issues).toEqual([]);
    const ids = verknuepft.map((t) => t.id);
    for (const code of ['A3', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3']) expect(ids).toContain(`01-${code}`);
    for (const code of ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'])
      expect(ids).toContain(`00-${code}`);
    // Ergebnis vorhersagen ohne Ausführen: bleibt eine Textaufgabe.
    expect(content.tasks['01-A4'].sqlUebung).toBeUndefined();
  });

  it.each(verknuepft.map((t) => [t.id, t.sqlUebung!] as const))('%s: die Musterlösung der Übung (%s) besteht', (taskId) => {
    const { ex } = sqlUebungZuAufgabe(content, content.tasks[taskId])!;
    expect(pruefe(taskId, ex.loesung).ok).toBe(true);
  });

  it.each([
    ['01-B3', "SELECT * FROM produkt WHERE bezeichnung LIKE 'Schreibtisch%';"],
    ['01-C1', 'SELECT bestell_id, COUNT(*) FROM bestellposition GROUP BY bestell_id HAVING COUNT(*) > 1;'],
    [
      '01-A3',
      '-- Fehler 1: Alias im WHERE, Fehler 2: GROUP BY name, Fehler 3: Bedingung gehört ins HAVING\nSELECT ort, COUNT(*) AS anzahl\nFROM kunde\nGROUP BY ort\nHAVING COUNT(*) > 1;',
    ],
    ['00-B2', "SELECT * FROM kunde WHERE ort IN ('Köln', 'Hamburg') AND registriert_am >= '2025-01-01';"],
    ['00-B3', 'SELECT COUNT(email) FROM kunde;'],
    ['00-B5', "SELECT * FROM produkt WHERE bezeichnung LIKE 'Lauf%' OR lagerbestand < 50;"],
    ['00-B6', "SELECT * FROM bestellung WHERE bestelldatum BETWEEN '2026-06-01' AND '2026-06-30' ORDER BY bestelldatum DESC;"],
    ['00-C1', 'SELECT status, COUNT(*) AS bestellungen FROM bestellung GROUP BY status;'],
    ['00-C3', 'SELECT b.bestell_id, k.nachname, b.bestelldatum FROM bestellung b JOIN kunde k ON b.kunden_id = k.kunden_id;'],
    [
      '00-C5',
      "SELECT k.nachname, SUM(bp.menge * bp.einzelpreis) AS gesamtumsatz\nFROM kunde k\nJOIN bestellung b ON k.kunden_id = b.kunden_id\nJOIN bestellposition bp ON b.bestell_id = bp.bestell_id\nWHERE b.status = 'geliefert'\nGROUP BY k.kunden_id, k.nachname\nORDER BY gesamtumsatz DESC;",
    ],
    ['00-C6', 'SELECT * FROM produkt WHERE preis > (SELECT AVG(preis) FROM produkt);'],
  ])('%s: übliche richtige Klausurantwort besteht', (taskId, query) => {
    const v = pruefe(taskId, query);
    expect(v.message).toMatch(/^Richtig/);
  });

  it.each([
    ['00-B3', 'SELECT COUNT(*) FROM kunde;'],
    ['00-C6', 'SELECT * FROM produkt WHERE preis > 60;'],
    ['01-B4', 'SELECT ort, COUNT(*) FROM kunde GROUP BY ort;'],
    [
      '01-C3',
      'SELECT k.name, SUM(bp.menge * p.preis) AS umsatz FROM kunde k JOIN bestellung b ON k.kunden_id = b.kunden_id JOIN bestellposition bp ON b.bestell_id = bp.bestell_id JOIN produkt p ON bp.produkt_id = p.produkt_id GROUP BY k.name;',
    ],
  ])('%s: falsche Antwort fällt durch', (taskId, query) => {
    expect(pruefe(taskId, query).ok).toBe(false);
  });
});
