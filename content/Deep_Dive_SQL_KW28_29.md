# Deep-Dive-Lernzettel: SQL
## AP2 Fachinformatiker/-in Daten- und Prozessanalyse

**Prüfungsrelevanz:** SQL taucht in beiden schriftlichen Prüfungen auf – in „Sicherstellen der Datenqualität" fast immer (Daten bereitstellen, prüfen, auswerten), in „Durchführen einer Prozessanalyse" häufig zur Kennzahlenermittlung. Typische Aufgabenformen: Abfrage selbst schreiben, eine gegebene Abfrage erklären oder das Ergebnis angeben, Fehler in einer Abfrage finden, eine Tabelle per DDL anlegen.

**So nutzt du diesen Lernzettel:** Abschnitt lesen → zugehörige Aufgaben *ohne* Musterlösung bearbeiten → vergleichen → Fehler ins Fehlerjournal. Erste Lerneinheit = Abschnitte 1–2 + Aufgaben Teil A (W1–W2) und Teil B. Zweite Lerneinheit = Abschnitt 3–4 + Rest.

---

## 1. Beispieldatenbank „DataFit GmbH" (Onlineshop für Sportartikel)

Alle Aufgaben beziehen sich auf dieses Schema (Primärschlüssel unterstrichen gedacht, FK = Fremdschlüssel):

- **kunde** (kunden_id, vorname, nachname, email, ort, registriert_am)
- **produkt** (produkt_id, bezeichnung, kategorie, preis, lagerbestand)
- **bestellung** (bestell_id, kunden_id [FK], bestelldatum, status)
- **bestellposition** (position_id, bestell_id [FK], produkt_id [FK], menge, einzelpreis)

**kunde**

| kunden_id | vorname | nachname | email | ort | registriert_am |
|---|---|---|---|---|---|
| 1 | Anna | Schmidt | anna.schmidt@mail.de | Köln | 2024-03-12 |
| 2 | Ben | Weber | b.weber@web.de | Hamburg | 2024-07-01 |
| 3 | Clara | Fischer | *NULL* | Köln | 2025-01-20 |
| 4 | David | Meyer | d.meyer@gmx.de | München | 2025-06-15 |
| 5 | Emre | Yilmaz | e.yilmaz@mail.de | Hamburg | 2026-02-03 |

**produkt**

| produkt_id | bezeichnung | kategorie | preis | lagerbestand |
|---|---|---|---|---|
| 10 | Laufschuh Speed | Schuhe | 89.99 | 120 |
| 11 | Yogamatte Pro | Fitness | 34.90 | 200 |
| 12 | Hantelset 20kg | Fitness | 59.00 | 35 |
| 13 | Trinkflasche 1L | Zubehör | 12.50 | 540 |
| 14 | Laufjacke Wind | Bekleidung | 74.95 | 0 |

**bestellung**

| bestell_id | kunden_id | bestelldatum | status |
|---|---|---|---|
| 100 | 1 | 2026-05-02 | geliefert |
| 101 | 2 | 2026-05-10 | geliefert |
| 102 | 1 | 2026-06-01 | storniert |
| 103 | 3 | 2026-06-05 | geliefert |
| 104 | 1 | 2026-06-20 | offen |
| 105 | 5 | 2026-07-01 | offen |

**bestellposition**

| position_id | bestell_id | produkt_id | menge | einzelpreis |
|---|---|---|---|---|
| 1000 | 100 | 10 | 1 | 89.99 |
| 1001 | 100 | 13 | 2 | 12.50 |
| 1002 | 101 | 11 | 1 | 34.90 |
| 1003 | 102 | 12 | 1 | 59.00 |
| 1004 | 103 | 13 | 3 | 12.50 |
| 1005 | 104 | 14 | 1 | 74.95 |
| 1006 | 105 | 10 | 1 | 89.99 |
| 1007 | 105 | 11 | 2 | 34.90 |

**Zwei bewusst eingebaute Prüfungsdetails:** Kundin 3 hat keine E-Mail (NULL-Falle) und Kunde 4 hat keine Bestellung (LEFT-JOIN-Klassiker). Die Bestellposition speichert einen eigenen `einzelpreis`, weil Produktpreise sich ändern – der Preis zum Bestellzeitpunkt wird historisiert. Umsätze werden deshalb immer über `menge * einzelpreis` der Position berechnet, nie über den aktuellen Produktpreis.

---

## 2. SELECT, WHERE, ORDER BY, Aggregatfunktionen

### 2.1 SELECT – Spalten auswählen

```sql
SELECT vorname, nachname FROM kunde;      -- Projektion auf zwei Spalten
SELECT * FROM kunde;                      -- alle Spalten
SELECT DISTINCT ort FROM kunde;           -- jeden Ort nur einmal
SELECT nachname AS name FROM kunde;       -- Alias für die Ergebnisspalte
```

`SELECT *` ist in der Prüfung zulässig, wenn „alle Angaben" gefordert sind. Verlangt die Aufgabe bestimmte Spalten, gibt es für `*` Punktabzug – lies die Aufgabenstellung genau.

### 2.2 WHERE – Zeilen filtern

Vergleichsoperatoren: `=`, `<>` (ungleich), `<`, `>`, `<=`, `>=`. Texte und Datumswerte stehen in einfachen Anführungszeichen, Zahlen nicht. Datumsangaben im ISO-Format `'JJJJ-MM-TT'`.

```sql
WHERE kategorie = 'Fitness'
WHERE preis <= 50
WHERE bestelldatum >= '2026-06-01'
WHERE preis BETWEEN 30 AND 60            -- Grenzen inklusive!
WHERE ort IN ('Köln', 'Hamburg')         -- Kurzform für mehrere ORs
WHERE bezeichnung LIKE 'Lauf%'           -- % = beliebig viele Zeichen
WHERE email LIKE '_.%'                   -- _ = genau ein Zeichen
WHERE email IS NULL                      -- niemals "= NULL"!
```

**NULL-Logik (Prüferklassiker):** NULL bedeutet „Wert unbekannt/nicht vorhanden". Jeder Vergleich mit NULL (`email = NULL`, `email <> NULL`) liefert weder wahr noch falsch, sondern *unbekannt* – die Zeile erscheint nicht im Ergebnis. Deshalb ausschließlich `IS NULL` / `IS NOT NULL` verwenden.

**Klammern bei AND/OR:** AND bindet stärker als OR. Ohne Klammern entstehen falsche Ergebnisse:

```sql
-- Gesucht: Kunden aus Köln oder Hamburg, registriert ab 2025
WHERE (ort = 'Köln' OR ort = 'Hamburg') AND registriert_am >= '2025-01-01'  -- richtig
WHERE ort = 'Köln' OR ort = 'Hamburg' AND registriert_am >= '2025-01-01'   -- falsch: liefert auch Anna (Köln, 2024)!
```

### 2.3 ORDER BY – sortieren

```sql
SELECT bezeichnung, preis
FROM produkt
ORDER BY preis DESC, bezeichnung ASC;   -- erst Preis absteigend, bei Gleichstand alphabetisch
```

`ASC` (aufsteigend) ist Standard und kann entfallen. Begrenzen der Zeilenzahl: `LIMIT 3` (MySQL/SQLite/PostgreSQL) bzw. `SELECT TOP 3` (SQL Server); Standard-SQL (auch Oracle ab 12c, PostgreSQL): `FETCH FIRST 3 ROWS ONLY` – in der Prüfung wird die Logik bewertet, nicht der Dialekt.

### 2.4 Aggregatfunktionen – Werte verdichten

| Funktion | Ergebnis | NULL-Verhalten |
|---|---|---|
| COUNT(*) | Anzahl aller Zeilen | zählt auch Zeilen mit NULL |
| COUNT(spalte) | Anzahl Zeilen mit Wert in der Spalte | ignoriert NULL |
| COUNT(DISTINCT spalte) | Anzahl verschiedener Werte | ignoriert NULL |
| SUM / AVG | Summe / Durchschnitt | ignoriert NULL |
| MIN / MAX | kleinster / größter Wert | ignoriert NULL |

```sql
SELECT COUNT(*) FROM kunde;            -- 5
SELECT COUNT(email) FROM kunde;        -- 4 (Clara hat NULL)
SELECT AVG(preis) FROM produkt;        -- 54.27
```

Ohne GROUP BY liefert eine Aggregatabfrage genau eine Ergebniszeile. Regel: In einem SELECT dürfen aggregierte und nicht aggregierte Spalten nicht gemischt werden – es sei denn, die nicht aggregierten stehen im GROUP BY (→ Abschnitt 3.1).

---

## 3. GROUP BY, HAVING, JOINs, Unterabfragen, DML/DDL

### 3.1 GROUP BY und HAVING

GROUP BY bildet aus Zeilen mit gleichem Spaltenwert je eine Gruppe; Aggregatfunktionen werden dann *pro Gruppe* berechnet.

```sql
SELECT status, COUNT(*) AS anzahl
FROM bestellung
GROUP BY status;
-- geliefert 3 | storniert 1 | offen 2
```

**Die wichtigste Regel des Kapitels:**
- **WHERE** filtert *einzelne Zeilen vor* der Gruppierung → keine Aggregatfunktionen erlaubt.
- **HAVING** filtert *Gruppen nach* der Gruppierung → hier gehören Aggregatbedingungen hin.

```sql
SELECT ort, COUNT(*) AS anzahl_kunden
FROM kunde
WHERE registriert_am >= '2024-01-01'     -- Zeilenfilter
GROUP BY ort
HAVING COUNT(*) >= 2;                    -- Gruppenfilter
```

Logische Abarbeitungsreihenfolge: **FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY**. Deshalb kennt WHERE noch keine Aliasse aus dem SELECT. (SQLite und MySQL sind toleranter und akzeptieren Aliasse z. B. in HAVING – in der Prüfung gilt Standard-SQL.)

### 3.2 JOINs – Tabellen verknüpfen

Durch die Normalisierung liegen zusammengehörige Daten in mehreren Tabellen; JOINs führen sie über Schlüsselpaare (PK ↔ FK) wieder zusammen.

```sql
SELECT k.nachname, b.bestell_id, b.bestelldatum
FROM bestellung b
INNER JOIN kunde k ON b.kunden_id = k.kunden_id;
```

| Join-Typ | Ergebnis |
|---|---|
| INNER JOIN | nur Zeilen mit Übereinstimmung in beiden Tabellen |
| LEFT JOIN | alle Treffer plus alle übrigen Zeilen der linken Tabelle; bei diesen sind die rechten Spalten NULL |
| RIGHT JOIN | spiegelbildlich zu LEFT |
| FULL OUTER JOIN | alle Zeilen beider Tabellen (nicht in jedem DBMS verfügbar) |

Am Beispiel: `kunde INNER JOIN bestellung` liefert 6 Zeilen (nur Kunden mit Bestellung). `kunde LEFT JOIN bestellung` liefert 7 Zeilen – David erscheint mit NULL-Werten in den Bestellspalten. Daraus folgt der Prüfungsklassiker **„Kunden ohne Bestellung"**:

```sql
SELECT k.vorname, k.nachname
FROM kunde k
LEFT JOIN bestellung b ON k.kunden_id = b.kunden_id
WHERE b.bestell_id IS NULL;
```

Mehrere Tabellen werden verkettet – der typische Auswertungspfad im Shop-Schema:

```sql
kunde → bestellung → bestellposition → produkt
FROM kunde k
JOIN bestellung b       ON k.kunden_id = b.kunden_id
JOIN bestellposition bp ON b.bestell_id = bp.bestell_id
JOIN produkt p          ON bp.produkt_id = p.produkt_id
```

(`JOIN` allein bedeutet INNER JOIN.) Wer das ON vergisst bzw. die alte Komma-Schreibweise ohne WHERE nutzt, erzeugt ein kartesisches Produkt – jede Zeile mit jeder, fachlich wertlos.

### 3.3 Unterabfragen (Subqueries)

```sql
-- Skalar: ein einzelner Vergleichswert
SELECT bezeichnung, preis
FROM produkt
WHERE preis > (SELECT AVG(preis) FROM produkt);

-- Menge: mehrere Werte mit IN
SELECT vorname, nachname
FROM kunde
WHERE kunden_id IN (SELECT kunden_id FROM bestellung WHERE status = 'offen');
```

Viele Aufgaben lassen sich wahlweise per JOIN oder Unterabfrage lösen – beides ist korrekt, wenn das Ergebnis stimmt. Merkhilfe: Brauchst du Spalten aus der zweiten Tabelle im Ergebnis → JOIN; brauchst du sie nur als Filter → Unterabfrage genügt.

### 3.4 DML – Daten ändern

```sql
INSERT INTO produkt (produkt_id, bezeichnung, kategorie, preis, lagerbestand)
VALUES (15, 'Springseil', 'Fitness', 9.99, 300);

UPDATE produkt SET preis = preis * 1.05 WHERE kategorie = 'Zubehör';

DELETE FROM bestellung WHERE status = 'storniert';
```

**Gefahrenhinweis, der auch im Fachgespräch gut ankommt:** UPDATE und DELETE ohne WHERE treffen *alle* Zeilen. In der Praxis vorher per SELECT mit derselben WHERE-Bedingung prüfen, welche Zeilen betroffen wären, und in einer Transaktion arbeiten (COMMIT/ROLLBACK).

### 3.5 DDL – Strukturen anlegen

```sql
CREATE TABLE bestellung (
  bestell_id    INTEGER PRIMARY KEY,
  kunden_id     INTEGER NOT NULL,
  bestelldatum  DATE DEFAULT CURRENT_DATE,
  status        VARCHAR(20) CHECK (status IN ('offen','geliefert','storniert')),
  FOREIGN KEY (kunden_id) REFERENCES kunde(kunden_id)
);
```

Wichtige Datentypen: `INTEGER`, `VARCHAR(n)`, `DECIMAL(p,s)` für Geldbeträge (nie FLOAT – Rundungsfehler!), `DATE`, `BOOLEAN`. Constraints: `PRIMARY KEY`, `FOREIGN KEY … REFERENCES`, `NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`.

**Referenzielle Integrität:** Jeder FK-Wert muss als PK in der Zieltabelle existieren (oder NULL sein). Löschverhalten steuerbar: `ON DELETE RESTRICT` (Löschen verhindern; ohne Angabe gilt `NO ACTION`, das ebenfalls verhindert – nur mit Prüfung am Ende der Anweisung), `ON DELETE CASCADE` (abhängige Sätze mitlöschen – mit Bedacht!), `ON DELETE SET NULL`.

---

## 4. Worauf ich als Korrektor achte – die häufigsten Punktekiller

1. `= NULL` statt `IS NULL`.
2. Aggregatfunktion im WHERE statt im HAVING.
3. Spalte im SELECT, die weder aggregiert ist noch im GROUP BY steht.
4. OR ohne Klammern neben AND.
5. Fehlendes `ON` beim JOIN (kartesisches Produkt) oder Join über die falschen Spalten.
6. Umsatz über `produkt.preis` statt `bestellposition.einzelpreis` berechnet.
7. Texte/Datum ohne Anführungszeichen, Datum nicht im ISO-Format.
8. UPDATE/DELETE ohne WHERE, obwohl nur bestimmte Zeilen gemeint sind.

Bewertet wird die fachliche Logik. Ein vergessenes Semikolon oder Groß-/Kleinschreibung kostet nichts – eine falsche Filterlogik schon. Schreibe handschriftlich sauber und strukturiert (jede Klausel eine Zeile), das reduziert Flüchtigkeitsfehler.

---

## 5. Übungsklausur SQL – 100 Punkte, Richtzeit 90 Minuten

*Alle Aufgaben beziehen sich auf die DataFit-Datenbank aus Abschnitt 1. Empfehlung: Teil A (W1–W2) + Teil B in der ersten Lerneinheit, Rest in der zweiten. Erst lösen, dann Abschnitt 6 aufschlagen.*

### Teil A – Wissensfragen (20 P)

- **W1 (5 P):** Erläutern Sie den Unterschied zwischen WHERE und HAVING und geben Sie je ein Beispiel an.
- **W2 (4 P):** Erläutern Sie den Unterschied zwischen COUNT(*) und COUNT(email) am Beispiel der Tabelle kunde. Welche Ergebnisse liefern beide?
- **W3 (5 P):** Erläutern Sie den Begriff „referenzielle Integrität" und grenzen Sie ON DELETE RESTRICT von ON DELETE CASCADE ab.
- **W4 (6 P):** Grenzen Sie INNER JOIN und LEFT JOIN voneinander ab. Wie viele Zeilen liefern beide Varianten bei der Verknüpfung von kunde und bestellung über kunden_id – und warum?

### Teil B – Grundlagen (26 P)

- **B1 (4 P):** Geben Sie Bezeichnung und Preis aller Produkte der Kategorie „Fitness" aus, absteigend nach Preis sortiert.
- **B2 (5 P):** Geben Sie alle Kunden aus Köln oder Hamburg aus, die sich ab dem 01.01.2025 registriert haben.
- **B3 (4 P):** Ermitteln Sie, wie viele Kunden eine E-Mail-Adresse hinterlegt haben.
- **B4 (4 P):** Ermitteln Sie den Durchschnittspreis aller Produkte; die Ergebnisspalte soll „durchschnittspreis" heißen.
- **B5 (5 P):** Geben Sie alle Produkte aus, deren Bezeichnung mit „Lauf" beginnt oder deren Lagerbestand unter 50 liegt.
- **B6 (4 P):** Geben Sie alle Bestellungen aus dem Juni 2026 aus, die neueste zuerst.

### Teil C – Fortgeschritten (54 P)

- **C1 (4 P):** Ermitteln Sie die Anzahl der Bestellungen je Status.
- **C2 (8 P):** Ermitteln Sie je Bestellung den Umsatz (Spaltenname „umsatz") aus der Tabelle bestellposition. Geben Sie nur Bestellungen mit einem Umsatz über 100 € aus, absteigend sortiert.
- **C3 (4 P):** Geben Sie zu jeder Bestellung den Nachnamen des Kunden, die Bestellnummer und das Bestelldatum aus.
- **C4 (6 P):** Ermitteln Sie Vor- und Nachnamen aller Kunden, die noch keine Bestellung aufgegeben haben.
- **C5 (10 P):** Ermitteln Sie je Kunde (Nachname) den Gesamtumsatz über alle *gelieferten* Bestellungen, absteigend nach Umsatz.
- **C6 (5 P):** Geben Sie alle Produkte aus, die teurer sind als der Durchschnittspreis aller Produkte (Unterabfrage verwenden).
- **C7 (8 P):** Die folgende Abfrage soll je Ort die Anzahl der Kunden ermitteln, die sich ab dem 01.01.2025 registriert haben, und nur Orte mit mehr als einem Kunden ausgeben. Sie enthält **vier Fehler** – finden und korrigieren Sie alle (je 2 P):

```sql
SELECT ort, COUNT(kunden_id) AS anzahl
FROM kunde
WHERE COUNT(kunden_id) > 1
GROUP BY nachname
HAVING registriert_am >= 01.01.2025;
```

- **C8 (9 P):** Erstellen Sie per SQL die Tabelle **retoure** mit: retoure_id (Ganzzahl, Primärschlüssel), bestell_id (Ganzzahl, Pflichtfeld, Fremdschlüssel auf bestellung), grund (Text, max. 200 Zeichen, Pflichtfeld), erstattung (Dezimalzahl mit 2 Nachkommastellen), angelegt_am (Datum, Standardwert: aktuelles Datum).

---

## 6. Musterlösungen mit Bewertungshinweisen

**W1:** WHERE filtert einzelne Zeilen *vor* der Gruppierung und darf keine Aggregatfunktionen enthalten (z. B. `WHERE status = 'offen'`). HAVING filtert *nach* der Gruppierung auf Gruppenebene und wird mit Aggregaten verwendet (z. B. `HAVING COUNT(*) > 5`). *(Je 2 P für die Definitionen mit Zeitpunkt-Bezug, 1 P für Beispiele.)*

**W2:** COUNT(*) zählt alle Zeilen → 5. COUNT(email) zählt nur Zeilen mit Wert in der Spalte, NULL wird ignoriert → 4, da Kundin Fischer keine E-Mail hat. *(2 P Erklärung NULL-Verhalten, je 1 P für die korrekten Werte.)*

**W3:** Referenzielle Integrität bedeutet: Jeder Fremdschlüsselwert muss als Primärschlüssel in der referenzierten Tabelle existieren (oder NULL sein); die DB verhindert verwaiste Verweise. RESTRICT: Ein referenzierter Datensatz kann nicht gelöscht werden, solange abhängige Sätze existieren. CASCADE: Beim Löschen werden abhängige Sätze automatisch mitgelöscht. *(3 P Begriff, je 1 P Abgrenzung.)*

**W4:** INNER JOIN liefert nur Kunden mit mindestens einer Bestellung → 6 Zeilen (eine je Bestellung). LEFT JOIN behält alle Zeilen der linken Tabelle kunde → 7 Zeilen; David Meyer erscheint zusätzlich mit NULL in allen Bestellspalten, da er keine Bestellung hat. *(Je 2 P Definition, je 1 P für Zeilenzahl mit Begründung.)*

**B1:**
```sql
SELECT bezeichnung, preis FROM produkt
WHERE kategorie = 'Fitness'
ORDER BY preis DESC;
```
→ Hantelset 20kg (59.00), Yogamatte Pro (34.90).

**B2:**
```sql
SELECT * FROM kunde
WHERE ort IN ('Köln', 'Hamburg')
  AND registriert_am >= '2025-01-01';
```
→ Clara Fischer, Emre Yilmaz. Gleichwertig mit `(ort = 'Köln' OR ort = 'Hamburg')` – die Klammern sind Pflicht; ohne sie erschiene fälschlich auch Anna Schmidt (2 P entfallen genau darauf).

**B3:**
```sql
SELECT COUNT(email) AS anzahl FROM kunde;
```
→ 4. Ebenfalls korrekt: `COUNT(*) … WHERE email IS NOT NULL`.

**B4:**
```sql
SELECT AVG(preis) AS durchschnittspreis FROM produkt;
```
→ 54.27. *(1 P entfällt auf den geforderten Alias.)*

**B5:**
```sql
SELECT * FROM produkt
WHERE bezeichnung LIKE 'Lauf%' OR lagerbestand < 50;
```
→ Laufschuh Speed, Hantelset 20kg, Laufjacke Wind.

**B6:**
```sql
SELECT * FROM bestellung
WHERE bestelldatum BETWEEN '2026-06-01' AND '2026-06-30'
ORDER BY bestelldatum DESC;
```
→ 104, 103, 102. Achtung bei Spalten mit Uhrzeit (DATETIME/TIMESTAMP): `BETWEEN … AND '2026-06-30'` verliert alles nach 30.06., 00:00 Uhr – dann besser `bestelldatum >= '2026-06-01' AND bestelldatum < '2026-07-01'`.

**C1:**
```sql
SELECT status, COUNT(*) AS anzahl
FROM bestellung
GROUP BY status;
```
→ geliefert 3, offen 2, storniert 1.

**C2:**
```sql
SELECT bestell_id, SUM(menge * einzelpreis) AS umsatz
FROM bestellposition
GROUP BY bestell_id
HAVING SUM(menge * einzelpreis) > 100
ORDER BY umsatz DESC;
```
→ 105 (159,79 €), 100 (114,99 €). *(3 P für die Umsatzformel, 2 P GROUP BY, 2 P HAVING statt WHERE, 1 P Sortierung.)*

**C3:**
```sql
SELECT k.nachname, b.bestell_id, b.bestelldatum
FROM bestellung b
INNER JOIN kunde k ON b.kunden_id = k.kunden_id;
```
→ 6 Zeilen. *(2 P Join-Syntax, 2 P korrekte ON-Bedingung.)*

**C4:**
```sql
SELECT k.vorname, k.nachname
FROM kunde k
LEFT JOIN bestellung b ON k.kunden_id = b.kunden_id
WHERE b.bestell_id IS NULL;
```
→ David Meyer. Gleichwertig: `WHERE kunden_id NOT IN (SELECT kunden_id FROM bestellung)` – aber nur, solange `bestellung.kunden_id` keine NULL-Werte enthält (hier nicht als NOT NULL definiert!); bei einem einzigen NULL liefert NOT IN gar keine Zeile. Robust: `WHERE NOT EXISTS (SELECT 1 FROM bestellung b WHERE b.kunden_id = k.kunden_id)`. *(Voll bepunktet wird jede Variante, die genau die bestelllosen Kunden liefert.)*

**C5:**
```sql
SELECT k.nachname, SUM(bp.menge * bp.einzelpreis) AS umsatz
FROM kunde k
JOIN bestellung b       ON k.kunden_id = b.kunden_id
JOIN bestellposition bp ON b.bestell_id = bp.bestell_id
WHERE b.status = 'geliefert'
GROUP BY k.kunden_id, k.nachname
ORDER BY umsatz DESC;
```
→ Schmidt 114,99 € · Fischer 37,50 € · Weber 34,90 €. Sauber ist die Gruppierung über kunden_id *und* nachname – so werden namensgleiche Kunden nicht fälschlich zusammengefasst. *(3 P Join-Kette, 2 P Statusfilter im WHERE, 2 P Umsatzformel, 2 P GROUP BY, 1 P Sortierung.)*

**C6:**
```sql
SELECT bezeichnung, preis
FROM produkt
WHERE preis > (SELECT AVG(preis) FROM produkt);
```
→ Laufschuh Speed, Hantelset 20kg, Laufjacke Wind (Durchschnitt 54,27 €).

**C7 – die vier Fehler:**
1. Aggregatbedingung `COUNT(kunden_id) > 1` steht im WHERE → gehört als HAVING hinter das GROUP BY.
2. Der Zeilenfilter auf registriert_am steht im HAVING → gehört ins WHERE.
3. Datum ohne Anführungszeichen und im falschen Format → `'2025-01-01'`.
4. `GROUP BY nachname` passt nicht zur SELECT-Spalte → `GROUP BY ort`.

Korrigiert:
```sql
SELECT ort, COUNT(kunden_id) AS anzahl
FROM kunde
WHERE registriert_am >= '2025-01-01'
GROUP BY ort
HAVING COUNT(kunden_id) > 1;
```
Mit den Beispieldaten ist die Ergebnismenge leer (je Ort nur ein Kunde ab 2025) – eine leere Ergebnismenge ist kein Fehler, sondern ein korrektes Resultat.

**C8:**
```sql
CREATE TABLE retoure (
  retoure_id   INTEGER PRIMARY KEY,
  bestell_id   INTEGER NOT NULL,
  grund        VARCHAR(200) NOT NULL,
  erstattung   DECIMAL(8,2),
  angelegt_am  DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (bestell_id) REFERENCES bestellung(bestell_id)
);
```
*(2 P PK, 2 P FK mit REFERENCES, 2 P NOT-NULL-Felder, 1 P VARCHAR(200), 1 P DECIMAL, 1 P DEFAULT.)*

**Auswertung:** 92–100 P = auf 1er-Kurs · 81–91 P = gut, Fehlerjournal abarbeiten · darunter = betroffene Abschnitte wiederholen und die Klausur in einer Woche erneut lösen.

---

## 7. Fachgespräch-Fragen rund um SQL

1. „In Ihrer Projektarbeit führen Sie Daten aus mehreren Tabellen zusammen. Warum haben Sie einen LEFT JOIN statt eines INNER JOIN gewählt?" – *Erwartet wird: bewusste Entscheidung, z. B. damit Datensätze ohne Treffer nicht verloren gehen und als Datenqualitätsproblem sichtbar werden.*
2. „Wie haben Sie sichergestellt, dass Ihre Abfragen korrekte Ergebnisse liefern?" – *Test mit bekanntem Teildatensatz, Plausibilisierung der Zeilenzahlen, Gegenprobe über eine zweite Abfrage.*
3. „Warum speichert die Bestellposition einen eigenen Einzelpreis, obwohl der Preis im Produkt steht?" – *Historisierung: Der Preis zum Bestellzeitpunkt muss erhalten bleiben, sonst verfälschen spätere Preisänderungen alle Umsatzauswertungen.*
4. „Was ist SQL-Injection und wie beugen Sie vor?" – *Einschleusen von SQL über Benutzereingaben; Schutz durch Prepared Statements/Parametrisierung, Eingabevalidierung, minimale DB-Rechte.*
5. „Eine Auswertung läuft zu langsam – was tun Sie?" – *Index auf Filter-/Join-Spalten, nur benötigte Spalten selektieren, früh filtern, ggf. Voraggregation.*

---

## 8. Übungsskript & Ressourcen

Das folgende Skript in ein Online-Tool einfügen (z. B. sqliteonline.com oder db-fiddle.com) – dann kannst du jede Aufgabe live ausprobieren. In SQLite vorher `PRAGMA foreign_keys = ON;` ausführen, sonst werden die Fremdschlüssel nicht geprüft:

```sql
CREATE TABLE kunde (
  kunden_id INTEGER PRIMARY KEY,
  vorname VARCHAR(50), nachname VARCHAR(50) NOT NULL,
  email VARCHAR(100), ort VARCHAR(50), registriert_am DATE);

CREATE TABLE produkt (
  produkt_id INTEGER PRIMARY KEY,
  bezeichnung VARCHAR(100), kategorie VARCHAR(50),
  preis DECIMAL(8,2), lagerbestand INTEGER);

CREATE TABLE bestellung (
  bestell_id INTEGER PRIMARY KEY,
  kunden_id INTEGER REFERENCES kunde(kunden_id),
  bestelldatum DATE, status VARCHAR(20));

CREATE TABLE bestellposition (
  position_id INTEGER PRIMARY KEY,
  bestell_id INTEGER REFERENCES bestellung(bestell_id),
  produkt_id INTEGER REFERENCES produkt(produkt_id),
  menge INTEGER, einzelpreis DECIMAL(8,2));

INSERT INTO kunde VALUES
 (1,'Anna','Schmidt','anna.schmidt@mail.de','Köln','2024-03-12'),
 (2,'Ben','Weber','b.weber@web.de','Hamburg','2024-07-01'),
 (3,'Clara','Fischer',NULL,'Köln','2025-01-20'),
 (4,'David','Meyer','d.meyer@gmx.de','München','2025-06-15'),
 (5,'Emre','Yilmaz','e.yilmaz@mail.de','Hamburg','2026-02-03');

INSERT INTO produkt VALUES
 (10,'Laufschuh Speed','Schuhe',89.99,120),
 (11,'Yogamatte Pro','Fitness',34.90,200),
 (12,'Hantelset 20kg','Fitness',59.00,35),
 (13,'Trinkflasche 1L','Zubehör',12.50,540),
 (14,'Laufjacke Wind','Bekleidung',74.95,0);

INSERT INTO bestellung VALUES
 (100,1,'2026-05-02','geliefert'),(101,2,'2026-05-10','geliefert'),
 (102,1,'2026-06-01','storniert'),(103,3,'2026-06-05','geliefert'),
 (104,1,'2026-06-20','offen'),(105,5,'2026-07-01','offen');

INSERT INTO bestellposition VALUES
 (1000,100,10,1,89.99),(1001,100,13,2,12.50),
 (1002,101,11,1,34.90),(1003,102,12,1,59.00),
 (1004,103,13,3,12.50),(1005,104,14,1,74.95),
 (1006,105,10,1,89.99),(1007,105,11,2,34.90);
```

**Zum Weiterüben:** sqlbolt.com (interaktives Tutorial), sql-practice.com (Aufgaben mit steigendem Schwierigkeitsgrad). Ziel bis zum Ende des Themas: Du schreibst C5 (Drei-Tabellen-Join mit Gruppierung und Filter) fehlerfrei aus dem Kopf – das ist exakt das Niveau, das in der Prüfung volle Punkte bringt.
