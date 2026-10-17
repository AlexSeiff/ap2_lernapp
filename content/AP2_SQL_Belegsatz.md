# SQL-Belegsatz

Kompakte Syntax zum Nachschlagen – im Stil des IHK-Belegsatzes. Beispiele mit der Übungsdatenbank des Möbelhauses: `kunde`, `bestellung`, `bestellposition`, `produkt`. Der SQL-Editor der App rechnet mit **SQLite 3.49**; wo Standard-SQL oder andere Systeme abweichen, steht es dabei. `[ … ]` = optional, `|` = oder.

## 1. SELECT – Schreib- und Ausführungsreihenfolge

```sql
SELECT [DISTINCT] spalte [AS alias], ausdruck, aggregat(...)
FROM tabelle [AS] t
  [INNER | LEFT | RIGHT | FULL] JOIN tabelle2 t2 ON t.id = t2.id
WHERE bedingung                    -- filtert Zeilen
GROUP BY spalte, ...
HAVING aggregatbedingung           -- filtert Gruppen
ORDER BY spalte [ASC | DESC], ...
LIMIT n [OFFSET m];
```

Ausführungsreihenfolge: 1 FROM / JOIN → 2 WHERE → 3 GROUP BY → 4 HAVING → 5 SELECT (Aliase entstehen) → 6 DISTINCT → 7 ORDER BY → 8 LIMIT

- Ein Alias aus dem SELECT gilt nach Standard-SQL erst in ORDER BY, nicht in WHERE, GROUP BY oder HAVING. SQLite duldet ihn auch dort – in der Prüfung nicht darauf verlassen.
- Jede nicht aggregierte Spalte im SELECT muss im GROUP BY stehen.
- Vergleich: `=  <>  !=  <  <=  >  >=` · `BETWEEN a AND b` (inklusive) · `IN (…)` · `LIKE 'M%'` (`%` beliebig viele, `_` genau ein Zeichen) · `IS NULL` / `IS NOT NULL` · `AND`, `OR`, `NOT`
- `LIMIT` heißt in SQL Server `TOP n`, in Oracle und Standard-SQL `FETCH FIRST n ROWS ONLY`.

## 2. JOIN-Arten

```sql
SELECT k.name, b.bestell_id
FROM kunde k
LEFT JOIN bestellung b ON b.kunden_id = k.kunden_id;
```

| JOIN | liefert |
|---|---|
| `INNER JOIN` (oder nur `JOIN`) | nur Zeilen mit Partner in beiden Tabellen |
| `LEFT [OUTER] JOIN` | alle Zeilen links, rechts NULL ohne Partner |
| `RIGHT [OUTER] JOIN` | alle Zeilen rechts (SQLite ab 3.39) |
| `FULL [OUTER] JOIN` | alle Zeilen beider Seiten (nicht in MySQL) |
| `CROSS JOIN` | jede Zeile mit jeder (kartesisches Produkt) |
| Self-Join | Tabelle mit sich selbst, zwei Aliase: `FROM mitarbeiter m JOIN mitarbeiter v ON m.vorgesetzter_id = v.id` |

- „Kunden ohne Bestellung“: `LEFT JOIN … WHERE b.bestell_id IS NULL`.
- Eine Bedingung auf die rechte Tabelle im WHERE macht aus dem LEFT JOIN einen INNER JOIN – sie gehört dann ins `ON`.

## 3. Aggregatfunktionen

| Funktion | Ergebnis | NULL |
|---|---|---|
| `COUNT(*)` | Anzahl Zeilen | zählt mit |
| `COUNT(spalte)` | Anzahl Werte | ignoriert NULL |
| `COUNT(DISTINCT spalte)` | Anzahl verschiedener Werte | ignoriert NULL |
| `SUM(x)`, `AVG(x)` | Summe, Mittelwert | ignoriert NULL |
| `MIN(x)`, `MAX(x)` | kleinster, größter Wert | ignoriert NULL |
| `GROUP_CONCAT(x, ', ')` | Werte als Text | SQLite, MySQL; Standard/PostgreSQL: `STRING_AGG(x, ', ')` (SQLite ab 3.44 auch) |

```sql
SELECT k.ort, COUNT(*) AS anzahl
FROM kunde k
GROUP BY k.ort
HAVING COUNT(*) >= 2
ORDER BY anzahl DESC;
```

## 4. Unterabfragen, CTE, Mengen

```sql
-- skalar (genau ein Wert)
SELECT bezeichnung FROM produkt WHERE preis > (SELECT AVG(preis) FROM produkt);
-- Liste
SELECT name FROM kunde WHERE kunden_id IN (SELECT kunden_id FROM bestellung);
-- korreliert mit EXISTS
SELECT name FROM kunde k
WHERE NOT EXISTS (SELECT 1 FROM bestellung b WHERE b.kunden_id = k.kunden_id);
-- abgeleitete Tabelle (braucht einen Alias)
SELECT AVG(anzahl) FROM (SELECT kunden_id, COUNT(*) AS anzahl FROM bestellung GROUP BY kunden_id) AS x;
-- CTE
WITH umsatz AS (
  SELECT bp.bestell_id, SUM(bp.menge * p.preis) AS summe
  FROM bestellposition bp JOIN produkt p ON p.produkt_id = bp.produkt_id
  GROUP BY bp.bestell_id
)
SELECT * FROM umsatz WHERE summe > 500;
```

- Falle: `NOT IN (…)` liefert keine einzige Zeile, sobald die Unterabfrage ein NULL enthält – dann `NOT EXISTS` nehmen.
- Mengen: `UNION` (ohne Duplikate) · `UNION ALL` (mit, schneller) · `INTERSECT` · `EXCEPT` (Oracle: `MINUS`). Gleiche Spaltenzahl und verträgliche Typen.

## 5. Ausdrücke und Fensterfunktionen

```sql
SELECT name,
       CASE WHEN ort = 'Köln' THEN 'West' WHEN ort IS NULL THEN 'unbekannt' ELSE 'sonst' END AS region,
       COALESCE(ort, 'k. A.') AS ort_anzeige
FROM kunde;

SELECT bestell_id, produkt_id, menge,
       SUM(menge) OVER (PARTITION BY bestell_id) AS menge_je_bestellung,
       RANK() OVER (ORDER BY menge DESC) AS rang
FROM bestellposition;
```

- `COALESCE(a, b, …)` erster Wert ungleich NULL · `NULLIF(a, b)` NULL, wenn gleich · SQLite: `IFNULL(a, b)`, `IIF(bed, ja, nein)`.
- `ROW_NUMBER()` 1, 2, 3, 4 · `RANK()` 1, 2, 2, 4 · `DENSE_RANK()` 1, 2, 2, 3. Fensterfunktionen verdichten nicht – jede Zeile bleibt.

## 6. Daten ändern (DML)

```sql
INSERT INTO kunde (kunden_id, name, ort) VALUES (7, 'Weber', 'Bonn'), (8, 'Yilmaz', NULL);
INSERT INTO kunde_archiv (kunden_id, name) SELECT kunden_id, name FROM kunde WHERE ort = 'Bonn';
UPDATE produkt SET preis = preis * 1.05 WHERE kategorie = 'Stühle';
DELETE FROM bestellposition WHERE bestell_id = 12;
```

- UPDATE und DELETE ohne WHERE betreffen **alle** Zeilen.
- Transaktion: `BEGIN TRANSACTION; … COMMIT;` bzw. `ROLLBACK;` (ACID: ganz oder gar nicht).

## 7. Tabellen anlegen und ändern (DDL)

```sql
CREATE TABLE bestellung (
  bestell_id   INTEGER PRIMARY KEY,
  kunden_id    INTEGER NOT NULL,
  bestelldatum DATE DEFAULT CURRENT_DATE,
  status       VARCHAR(20) CHECK (status IN ('offen', 'geliefert', 'storniert')),
  FOREIGN KEY (kunden_id) REFERENCES kunde(kunden_id) ON DELETE RESTRICT
);
ALTER TABLE kunde ADD COLUMN email VARCHAR(100);
ALTER TABLE kunde RENAME COLUMN ort TO wohnort;
ALTER TABLE kunde DROP COLUMN email;
DROP TABLE IF EXISTS kunde_archiv;
```

| Constraint | Bedeutung |
|---|---|
| `PRIMARY KEY` | eindeutig und nicht NULL; zusammengesetzt: `PRIMARY KEY (bestell_id, produkt_id)` |
| `FOREIGN KEY … REFERENCES t(sp)` | Wert muss in t existieren (referenzielle Integrität); `ON DELETE CASCADE \| SET NULL \| RESTRICT` |
| `NOT NULL` | Pflichtfeld |
| `UNIQUE` | kein Wert doppelt (NULL darf mehrfach vorkommen) |
| `CHECK (bedingung)` | Wertebereich, z. B. `CHECK (menge > 0)` |
| `DEFAULT wert` | Standardwert beim INSERT |

- SQLite prüft Fremdschlüssel nur mit `PRAGMA foreign_keys = ON` (im Editor der App eingeschaltet).
- `ADD COLUMN` darf in SQLite kein `UNIQUE` und keinen `PRIMARY KEY` enthalten – dafür nachträglich `CREATE UNIQUE INDEX`.
- Den Datentyp einer Spalte ändert Standard-SQL mit `ALTER TABLE t ALTER COLUMN sp TYPE …` (MySQL: `MODIFY`); SQLite kann das nicht.

## 8. Datentypen

| Standard-SQL | Inhalt | in SQLite |
|---|---|---|
| `INTEGER`, `SMALLINT`, `BIGINT` | ganze Zahlen | INTEGER |
| `DECIMAL(p, s)` / `NUMERIC(p, s)` | Festkomma, z. B. `DECIMAL(8,2)` für Beträge | NUMERIC, ohne feste Stellen |
| `REAL`, `FLOAT`, `DOUBLE PRECISION` | Gleitkomma | REAL |
| `CHAR(n)`, `VARCHAR(n)` | Text fester bzw. variabler Länge | TEXT, Länge n wird nicht geprüft |
| `DATE`, `TIME`, `TIMESTAMP` | Datum, Uhrzeit | TEXT im Format `'2026-10-09'` bzw. `'2026-10-09 14:30:00'` |
| `BOOLEAN` | wahr/falsch | INTEGER 1/0 (`TRUE`/`FALSE` gehen) |

- Ganzzahldivision: `5 / 2` ergibt in SQLite 2 – für 2,5 `5 * 1.0 / 2` oder `CAST(5 AS REAL) / 2`.

## 9. Sichten und Indizes

```sql
CREATE VIEW v_kunde_umsatz AS
  SELECT k.kunden_id, k.name, SUM(bp.menge * p.preis) AS umsatz
  FROM kunde k
  JOIN bestellung b ON b.kunden_id = k.kunden_id
  JOIN bestellposition bp ON bp.bestell_id = b.bestell_id
  JOIN produkt p ON p.produkt_id = bp.produkt_id
  GROUP BY k.kunden_id, k.name;
DROP VIEW v_kunde_umsatz;

CREATE [UNIQUE] INDEX idx_bestellung_kunde ON bestellung(kunden_id);
DROP INDEX idx_bestellung_kunde;
```

- Eine View speichert die Abfrage, nicht die Daten. Ein Index beschleunigt Suchen und Joins, kostet aber Speicher und Zeit beim Schreiben.
- Rechte (DCL, nicht in SQLite): `GRANT SELECT ON kunde TO analyst;` · `REVOKE SELECT ON kunde FROM analyst;`

## 10. Datums- und Textfunktionen

| Zweck | SQLite (App) | Standard-SQL bzw. andere |
|---|---|---|
| heutiges Datum | `DATE('now')`, `CURRENT_DATE` | `CURRENT_DATE` |
| Datum rechnen | `DATE(d, '+7 days')`, `DATE(d, '-1 month')` | `d + INTERVAL '7' DAY` |
| Jahr, Monat | `STRFTIME('%Y', d)`, `STRFTIME('%m', d)` (Text) | `EXTRACT(YEAR FROM d)`, MySQL `YEAR(d)` |
| Tage zwischen zwei Daten | `JULIANDAY(b) - JULIANDAY(a)` | MySQL `DATEDIFF(b, a)`, SQL Server `DATEDIFF(day, a, b)` |
| verketten | `a \|\| ' ' \|\| b`, `CONCAT(a, b)` | `\|\|` (Standard), MySQL `CONCAT` |
| Länge | `LENGTH(s)` | `CHAR_LENGTH(s)` |
| Teilstring | `SUBSTR(s, start, laenge)` (ab 1) | `SUBSTRING(s FROM start FOR laenge)` |
| Position | `INSTR(s, 'x')` | `POSITION('x' IN s)` |
| groß, klein, kürzen, ersetzen | `UPPER`, `LOWER`, `TRIM`, `REPLACE(s, alt, neu)` | gleich |
| runden, Typ | `ROUND(x, 2)`, `ABS(x)`, `CAST(x AS INTEGER)` | gleich |

- `STRFTIME` liefert Text: `WHERE STRFTIME('%Y', bestelldatum) = '2026'` (mit Anführungszeichen).
- Monatsrechnung läuft über: `DATE('2026-01-31', '+1 month')` ergibt in SQLite `'2026-03-03'`.
- `LIKE` unterscheidet in SQLite Groß- und Kleinschreibung nicht (nur bei ASCII-Buchstaben).

## 11. Der SQL-Auszug der IHK-Prüfung (Stand 2024-10-07) und seine Umsetzung in SQLite

Der Anhang der AP2 enthält einen kurzen SQL-Auszug im Stil von MySQL. Was dort **nicht** steht, darfst du nutzen, kommt in der Prüfung aber nicht als Pflicht vor. Die Spalte „SQLite“ zeigt, wie du dasselbe im Editor der App rechnest.

| Anhang (Beschreibung) | SQLite im Editor |
|---|---|
| `AVG`, `COUNT(spalte \| *)`, `SUM`, `MIN`, `MAX` | gleich |
| `STDDEV(spalte)` – Standardabweichung vom arithmetischen Mittel | nicht eingebaut: `SQRT(AVG(x*x) - AVG(x)*AVG(x))` (Grundgesamtheit, ÷ n); Stichprobe (÷ n − 1): mit `SQRT(SUM((x - m)*(x - m)) / (COUNT(*) - 1))` und dem Mittelwert m aus einer Unterabfrage |
| `VARIANCE(spalte)` | nicht eingebaut: ohne `SQRT` wie oben |
| `CORR(spalte_1, spalte_2)` – Korrelation (1 = voll korreliert, 0 = kein Zusammenhang) | nicht eingebaut: `(AVG(x*y) - AVG(x)*AVG(y)) / (SQRT(AVG(x*x) - AVG(x)*AVG(x)) * SQRT(AVG(y*y) - AVG(y)*AVG(y)))` |
| `LEFT(zeichenkette, anzahl)`, `RIGHT(zeichenkette, anzahl)` | `SUBSTR(s, 1, n)`, `SUBSTR(s, -n)` |
| `NOW()` – aktuelles Datum mit Uhrzeit | `DATETIME('now')` |
| `YEAR(d)`, `MONTH(d)`, `DAY(d)`, `HOUR(d)`, `MINUTE(d)` – als Zahl | `CAST(STRFTIME('%Y', d) AS INTEGER)`, `'%m'`, `'%d'`, `'%H'`, `'%M'` |
| `WEEKDAY(d)` – Wochentag als Zahl, **Montag = 0** | `(CAST(STRFTIME('%w', d) AS INTEGER) + 6) % 7` (SQLite zählt Sonntag = 0) |
| `DATEADD(Datumsteil, Intervall, Datum)` – addiert ein Intervall | `DATE(d, '+7 days')`, `DATE(d, '+2 months')`, `DATETIME(d, '+3 hours')` |
| `DATEDIFF(Datumsteil, Anfangsdatum, Enddatum)` – **Enddatum minus Startdatum** in der genannten Einheit | Tage: `JULIANDAY(ende) - JULIANDAY(start)`; Monate und Jahre über `STRFTIME` rechnen |
| Datumsteile: `DAY, MONTH, YEAR, HOUR, MINUTE` | als Text in `STRFTIME` bzw. `'+n days'` |
| `DATE` im Format DD.MM.YYYY | SQLite speichert ISO `YYYY-MM-DD`; Anzeige in DD.MM.YYYY: `STRFTIME('%d.%m.%Y', d)` |
| `UNION`, `AND`, `OR`, `NOT`, `IS NULL`, `LIKE` (`%`, `_`), `=`, `>`, `>=`, `<`, `<=`, `<>`, `+ - * /` | gleich |

**Tabellen und Schlüssel im Anhang:**

```sql
CREATE TABLE Tabellenname (
  Spaltenname DATENTYP,
  …,
  PRIMARY KEY (Spaltenname),
  FOREIGN KEY (Spaltenname) REFERENCES Tabellenname (Primärschlüsselspaltenname)
);
ALTER TABLE Tabellenname ADD COLUMN    Spaltenname DATENTYP;   -- Spalte hinzufügen
ALTER TABLE Tabellenname DROP COLUMN   Spaltenname;            -- Spalte entfernen
ALTER TABLE Tabellenname MODIFY COLUMN Spaltenname DATENTYP;   -- Spalte verändern (MySQL; SQLite kann das nicht)
ALTER TABLE Tabellenname ADD FOREIGN KEY (Spaltenname) REFERENCES Tabellenname2 (Spaltenname);
DROP TABLE Tabellenname;
```

- Datentypen im Anhang: `CHARACTER`, `CHAR(anzahl)`, `VARCHAR(anzahl)` (Zeichenkette mit **höchstens** anzahl Zeichen), `DECIMAL` (Festkomma), `DOUBLE` (Gleitkomma), `INTEGER`, `DATE`.
- Unterabfrage als Tabelle: `SELECT … FROM (SELECT … FROM … WHERE …) AS tbl WHERE …` – der Alias `tbl` ist Pflicht.
- `WHERE EXISTS (unterabfrage)` prüft, ob die Unterabfrage mindestens eine Zeile liefert; `NOT EXISTS` negiert das. `WHERE … IN (unterabfrage)` / `NOT IN` prüfen die Zugehörigkeit zur Menge (Falle bei NULL, siehe 4).
- `INSERT INTO Tabellenname [(spalte1, spalte2, …)] VALUES (wert1, wert2, …)` **oder** `INSERT INTO … SELECT … FROM … WHERE …`.
- `HAVING` zeigt nur Gruppen, die die Bedingung erfüllen; `ORDER BY spalte1 [, spalte2] ASC | DESC` sortiert je Kriterium (ASC aufsteigend, DESC absteigend).

**Rechte (nicht in SQLite; der Anhang gibt die MySQL-Form vor):**

```sql
CREATE USER Benutzer | Rolle IDENTIFIED BY 'Passwort';                    -- neuen Benutzer oder neue Rolle mit Passwort anlegen
GRANT Recht | Rolle ON *.* | Datenbank.* | Datenbank.Objekt TO Benutzer | Rolle [WITH GRANT OPTION];
REVOKE Rechte | Rollen ON *.* | Datenbank.* | Datenbank.Objekt FROM Benutzer | Rolle;
```

- `GRANT Recht ON …` weist ein **Recht auf ein Datenbankobjekt** zu, `GRANT Rolle TO Benutzer` weist eine **Rolle** zu; `REVOKE` entzieht beides wieder.
- `WITH GRANT OPTION`: Der Empfänger darf das Recht **weitergeben**. `*.*` meint alle Datenbanken, `Datenbank.*` alle Objekte einer Datenbank, `Datenbank.Objekt` ein einzelnes (z. B. eine Tabelle).
