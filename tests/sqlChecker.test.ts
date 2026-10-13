import { describe, expect, it } from 'vitest';
import { compareResults, hasTopLevelOrderBy, lastResultSet } from '../src/sql/checker';
import type { CompareOptions, SqlValue, StatementResult } from '../src/sql/types';

const res = (columns: string[], rows: SqlValue[][], sql = 'SELECT …'): StatementResult => ({ sql, columns, rows, changes: 0 });
const EGAL: CompareOptions = { reihenfolge: 'egal' };
const STRENG: CompareOptions = { reihenfolge: 'streng' };

describe('compareResults: Spalten', () => {
  it('meldet eine falsche Spaltenzahl', () => {
    const v = compareResults(res(['a', 'b', 'c'], []), res(['a', 'b'], []), EGAL, '');
    expect(v).toEqual({ ok: false, message: 'Deine Abfrage liefert 3 Spalten, erwartet sind 2.', missing: [], extra: [] });
    expect(compareResults(res(['a', 'b'], []), res(['a'], []), EGAL, '').message).toBe('Deine Abfrage liefert 2 Spalten, erwartet ist 1.');
    expect(compareResults(res(['a'], []), res(['a', 'b'], []), EGAL, '').message).toBe('Deine Abfrage liefert 1 Spalte, erwartet sind 2.');
  });

  it('meldet eine fehlende Ergebnistabelle', () => {
    expect(compareResults(res([], []), res(['a'], [[1]]), EGAL, '').message).toMatch(/keine Ergebnistabelle/);
  });

  it('prüft Spaltennamen ohne Groß-/Kleinschreibung', () => {
    const opts: CompareOptions = { reihenfolge: 'egal', spaltennamen: ['kategorie', 'durchschnittspreis'] };
    const expected = res(['kategorie', 'durchschnittspreis'], [['Tisch', 10]]);
    expect(compareResults(res(['Kategorie', 'DurchschnittsPreis'], [['Tisch', 10]]), expected, opts, '').ok).toBe(true);
    expect(compareResults(res(['kategorie', 'AVG(preis)'], [['Tisch', 10]]), expected, opts, '').message).toBe(
      'Spalte 2 soll `durchschnittspreis` heißen – Alias mit AS vergeben.',
    );
  });

  it('ohne spaltennamen zählt nur die Position', () => {
    expect(compareResults(res(['x', 'y'], [[1, 2]]), res(['a', 'b'], [[1, 2]]), EGAL, '').ok).toBe(true);
  });
});

describe('compareResults: Zeilen und Reihenfolge', () => {
  const expected = res(['name'], [['A'], ['B'], ['C']]);
  const shuffled = res(['name'], [['C'], ['A'], ['B']]);

  it('streng: gleiche Zeilen in anderer Reihenfolge sind falsch', () => {
    const v = compareResults(shuffled, expected, STRENG, '');
    expect(v).toEqual({ ok: false, message: 'Zeilen stimmen, aber die Reihenfolge nicht.', missing: [], extra: [] });
    expect(compareResults(expected, expected, STRENG, '').message).toBe('Richtig! 3 Zeilen, Reihenfolge stimmt.');
  });

  it('egal: Reihenfolge wird ignoriert', () => {
    expect(compareResults(shuffled, expected, EGAL, 'SELECT name FROM t ORDER BY name')).toMatchObject({
      ok: true,
      message: 'Richtig! 3 Zeilen.',
    });
  });

  it('auto: streng genau dann, wenn die Lösung ein ORDER BY auf oberster Ebene hat', () => {
    const auto: CompareOptions = { reihenfolge: 'auto' };
    expect(compareResults(shuffled, expected, auto, 'SELECT name FROM t ORDER BY name').ok).toBe(false);
    expect(compareResults(shuffled, expected, auto, 'SELECT name FROM t').ok).toBe(true);
    expect(compareResults(shuffled, expected, auto, 'SELECT name FROM (SELECT name FROM t ORDER BY name)').ok).toBe(true);
  });

  it('Multimengen: Duplikate zählen', () => {
    const exp = res(['ort'], [['Köln'], ['Köln'], ['Bonn']]);
    const v = compareResults(res(['ort'], [['Köln'], ['Bonn']]), exp, EGAL, '');
    expect(v).toEqual({ ok: false, message: '1 Zeile fehlt.', missing: [['Köln']], extra: [] });
    const w = compareResults(res(['ort'], [['Köln'], ['Köln'], ['Köln'], ['Bonn'], ['Bonn']]), exp, EGAL, '');
    expect(w).toEqual({ ok: false, message: '2 Zeilen zu viel.', missing: [], extra: [['Köln'], ['Bonn']] });
  });

  it('Rückmeldung mit fehlenden und überzähligen Zeilen (Singular/Plural)', () => {
    const exp = res(['n'], [[1], [2], [3]]);
    const v = compareResults(res(['n'], [[1], [4]]), exp, EGAL, '');
    expect(v.message).toBe('2 Zeilen fehlen, 1 Zeile zu viel.');
    expect(v.missing).toEqual([[2], [3]]);
    expect(v.extra).toEqual([[4]]);
    expect(compareResults(res(['n'], [[1], [2], [3], [5], [6]]), res(['n'], [[1], [2]]), STRENG, '').message).toBe('3 Zeilen zu viel.');
    expect(compareResults(res(['n'], [[9]]), res(['n'], [[1]]), EGAL, '').message).toBe('1 Zeile fehlt, 1 Zeile zu viel.');
  });

  it('leeres Ergebnis und Singular in der Erfolgsmeldung', () => {
    expect(compareResults(res(['a'], []), res(['a'], []), EGAL, '').message).toBe('Richtig! 0 Zeilen.');
    expect(compareResults(res(['a'], [[1]]), res(['a'], [[1]]), STRENG, '').message).toBe('Richtig! 1 Zeile, Reihenfolge stimmt.');
  });
});

describe('compareResults: Werte', () => {
  const one = (v: SqlValue) => res(['x'], [[v]]);

  it('NULL, leerer Text und 0 sind verschieden', () => {
    expect(compareResults(one(null), one(''), EGAL, '').ok).toBe(false);
    expect(compareResults(one(''), one(0), EGAL, '').ok).toBe(false);
    expect(compareResults(one(null), one(0), EGAL, '').ok).toBe(false);
    expect(compareResults(one(null), one(null), EGAL, '').ok).toBe(true);
  });

  it('Zahlen mit Toleranz, 5 und 5.0 sind gleich', () => {
    expect(compareResults(one(5), one(5.0), EGAL, '').ok).toBe(true);
    expect(compareResults(one(1471.8), one(1471.8000000001), EGAL, '').ok).toBe(true);
    expect(compareResults(one(1.0024), one(1.0026), EGAL, '').ok).toBe(true); // an der Rastergrenze, trotzdem innerhalb der Toleranz
    expect(compareResults(one(1.0), one(1.01), EGAL, '').ok).toBe(false);
    expect(compareResults(one(1.0), one(1.4), { reihenfolge: 'egal', toleranz: 0.5 }, '').ok).toBe(true);
  });

  it('Zahl und Text mit gleichem Inhalt sind verschieden', () => {
    expect(compareResults(one('5'), one(5), EGAL, '').ok).toBe(false);
  });

  it('Text exakt: kein Trim, Groß-/Kleinschreibung zählt', () => {
    expect(compareResults(one('Köln '), one('Köln'), EGAL, '').ok).toBe(false);
    expect(compareResults(one('köln'), one('Köln'), EGAL, '').ok).toBe(false);
  });

  it('BLOBs werden byteweise verglichen', () => {
    expect(compareResults(one(new Uint8Array([1, 2])), one(new Uint8Array([1, 2])), EGAL, '').ok).toBe(true);
    expect(compareResults(one(new Uint8Array([1, 2])), one(new Uint8Array([1, 3])), EGAL, '').ok).toBe(false);
  });
});

describe('hasTopLevelOrderBy', () => {
  it('erkennt ORDER BY auf oberster Ebene', () => {
    expect(hasTopLevelOrderBy('SELECT * FROM kunde ORDER BY name')).toBe(true);
    expect(hasTopLevelOrderBy('select * from kunde\norder\n  by name desc;')).toBe(true);
    expect(hasTopLevelOrderBy('SELECT a FROM x UNION SELECT a FROM y ORDER BY a')).toBe(true);
  });

  it('ignoriert ORDER BY in Unterabfragen, CTEs und Fensterfunktionen', () => {
    expect(hasTopLevelOrderBy('SELECT * FROM (SELECT * FROM kunde ORDER BY name) t')).toBe(false);
    expect(hasTopLevelOrderBy('WITH t AS (SELECT * FROM kunde ORDER BY name LIMIT 3) SELECT * FROM t')).toBe(false);
    expect(hasTopLevelOrderBy('SELECT name, ROW_NUMBER() OVER (ORDER BY name) FROM kunde')).toBe(false);
    expect(hasTopLevelOrderBy('SELECT * FROM (SELECT * FROM kunde ORDER BY name) t ORDER BY 1')).toBe(true);
  });

  it('ignoriert Strings, Bezeichner in Anführungszeichen und Kommentare', () => {
    expect(hasTopLevelOrderBy("SELECT 'ORDER BY name' FROM kunde")).toBe(false);
    expect(hasTopLevelOrderBy("SELECT 'it''s ORDER BY' FROM kunde")).toBe(false);
    expect(hasTopLevelOrderBy('SELECT "order by" FROM kunde')).toBe(false);
    expect(hasTopLevelOrderBy('SELECT * FROM kunde -- ORDER BY name')).toBe(false);
    expect(hasTopLevelOrderBy('SELECT * FROM kunde /* ORDER BY name */')).toBe(false);
    expect(hasTopLevelOrderBy('SELECT border, by_x FROM kunde')).toBe(false);
  });

  it('entscheidet nach der letzten Anweisung', () => {
    expect(hasTopLevelOrderBy('SELECT 1 ORDER BY 1; SELECT 2')).toBe(false);
    expect(hasTopLevelOrderBy('INSERT INTO t VALUES (1); SELECT * FROM t ORDER BY a;')).toBe(true);
  });
});

describe('lastResultSet', () => {
  it('liefert die letzte Anweisung mit Spalten', () => {
    const sel = res(['a'], [[1]], 'SELECT a FROM t');
    const ins: StatementResult = { sql: 'INSERT …', columns: [], rows: [], changes: 1 };
    expect(lastResultSet([sel, ins])).toBe(sel);
    expect(lastResultSet([ins])).toBeUndefined();
    expect(lastResultSet([])).toBeUndefined();
  });
});

describe('compareResults: spaltenFrei (verknüpfte Klausuraufgaben)', () => {
  const FREI: CompareOptions = { reihenfolge: 'egal', spaltenFrei: true };
  const expected = res(
    ['bezeichnung', 'preis'],
    [
      ['Stuhl', 249],
      ['Tisch', 399],
    ],
  );

  it('erlaubt zusätzliche Spalten (SELECT *), andere Namen und eine andere Spaltenreihenfolge', () => {
    const stern = res(
      ['produkt_id', 'Preis', 'kategorie', 'BEZ'],
      [
        [10, 249, 'Möbel', 'Stuhl'],
        [11, 399, 'Möbel', 'Tisch'],
      ],
    );
    expect(compareResults(stern, expected, FREI, '').ok).toBe(true);
  });

  it('ordnet zeilenweise zu – gleiche Spaltenwerte in falscher Kombination sind falsch', () => {
    const vertauscht = res(
      ['bezeichnung', 'preis'],
      [
        ['Stuhl', 399],
        ['Tisch', 249],
      ],
    );
    const v = compareResults(vertauscht, expected, FREI, '');
    expect(v.ok).toBe(false);
    expect(v.missing).toHaveLength(2);
  });

  it('meldet zu wenige Spalten und fehlende Zeilen', () => {
    expect(compareResults(res(['preis'], [[249], [399]]), expected, FREI, '').message).toBe(
      'Deine Abfrage liefert 1 Spalte, erwartet sind mindestens 2.',
    );
    const v = compareResults(res(['bezeichnung', 'preis', 'x'], [['Stuhl', 249, 1]]), expected, FREI, '');
    expect(v).toMatchObject({ ok: false, message: '1 Zeile fehlt.', missing: [['Tisch', 399]] });
  });

  it('prüft die Reihenfolge der Zeilen weiterhin, wenn die Musterlösung sortiert', () => {
    const umgekehrt = res(
      ['x', 'bezeichnung', 'preis'],
      [
        [2, 'Tisch', 399],
        [1, 'Stuhl', 249],
      ],
    );
    const AUTO: CompareOptions = { reihenfolge: 'auto', spaltenFrei: true };
    expect(compareResults(umgekehrt, expected, AUTO, 'SELECT … ORDER BY preis').message).toBe(
      'Zeilen stimmen, aber die Reihenfolge nicht.',
    );
    expect(compareResults(umgekehrt, expected, AUTO, 'SELECT …').ok).toBe(true);
  });
});
