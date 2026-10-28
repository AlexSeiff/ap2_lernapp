# Musterlösungen SQL-Übungsklausur (Deep Dive 1)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Vergib Teilpunkte wie ein Prüfer – richtige Struktur zählt, kleine Syntaxfehler (fehlendes Semikolon, Groß-/Kleinschreibung) kosten nichts. 92+ P = sehr gut, 81+ = gut. Jede Aufgabe unter voller Punktzahl kommt ins Fehlerjournal und wird nach einer Woche erneut gelöst.

---

## Block A – Wissen und Fehleranalyse (26 P)

**A1 (6 P):**
WHERE filtert einzelne Zeilen und wird **vor** der Gruppierung ausgewertet – deshalb darf es keine Aggregatfunktionen enthalten. HAVING filtert die durch GROUP BY gebildeten Gruppen und wird **nach** der Aggregation ausgewertet – Bedingungen wie `COUNT(*) > 1` gehören daher in HAVING. Logische Reihenfolge: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.

*Prüferkommentar: Je 2 P für die korrekte Funktion von WHERE und HAVING, 2 P für den Bezug zur Verarbeitungsreihenfolge. Wer nur „WHERE vor, HAVING nach der Gruppierung" schreibt, bekommt 4 von 6.*

**A2 (4 P):**
`COUNT(*)` = **5** (zählt alle Zeilen, unabhängig von NULL). `COUNT(telefon)` = **3** (zählt nur vorhandene Werte, NULL wird ignoriert).

*Prüferkommentar: Je 1 P pro korrektem Wert, je 1 P pro Begründung.*

**A3 (9 P):**
1. **Fehler 1:** Die Aggregatbedingung steht in WHERE – Gruppen existieren dort noch nicht. Sie gehört in HAVING.
2. **Fehler 2:** Der Spalten-Alias `anzahl` kann in WHERE/HAVING nicht verwendet werden, da SELECT erst später ausgewertet wird – es muss `COUNT(*)` heißen.
3. **Fehler 3:** Gruppiert wird nach `name`, ausgegeben aber `ort` – die nicht aggregierte SELECT-Spalte muss im GROUP BY stehen: `GROUP BY ort`.

```sql
SELECT ort, COUNT(*) AS anzahl
FROM kunde
GROUP BY ort
HAVING COUNT(*) > 1;
```

*Prüferkommentar: Je Fehler 1 P fürs Benennen + 1 P für die Begründung, 3 P für die korrigierte Abfrage. (Ergebnis wäre: München 2, Hamburg 2.)*

Dialekt-Hinweis: Fehler 2 und 3 gelten nach Standard-SQL. MySQL und SQLite dulden einen Alias in HAVING, SQLite führt sogar `GROUP BY name` mit ausgegebenem `ort` ohne Fehlermeldung aus. Dass eine Abfrage im Übungstool läuft, macht sie in der Prüfung nicht richtig.

**A4 (7 P):**
| kategorie | guenstigster |
|---|---|
| Möbel | 249.00 |
| Elektronik | 129.00 |
| Zubehör | 39.90 |

Begründung: MIN je Kategorie (Möbel: min(249, 399) = 249; Elektronik: min(189, 129) = 129; Zubehör: 39.90), anschließend absteigend nach `guenstigster` sortiert.

*Prüferkommentar: 3 P für korrekte MIN-Werte, 2 P für die richtige Sortierreihenfolge, 2 P für vollständige Spaltenüberschriften. Häufigster Fehler: Sortierung nach Kategorie-Alphabet statt nach dem Aggregatwert.*

---

## Block B – Abfragen auf einer Tabelle (24 P)

**B1 (5 P):**
```sql
SELECT name, ort
FROM kunde
WHERE ort = 'München'
ORDER BY name ASC;
```
Ergebnis: Fischer KG, Huber GmbH. *(2 P SELECT/FROM, 2 P WHERE mit Anführungszeichen, 1 P ORDER BY.)*

**B2 (5 P):**
```sql
SELECT bezeichnung, preis
FROM produkt
WHERE kategorie = 'Elektronik' AND preis < 150;
```
Ergebnis: Dockingstation, 129.00. *(2 P Grundgerüst, 3 P korrekt verknüpfte Bedingungen.)*

**B3 (4 P):**
```sql
SELECT bezeichnung
FROM produkt
WHERE bezeichnung LIKE 'Schreibtisch%';
```
Ergebnis: Schreibtisch Basic, Schreibtischlampe. *(Voller Punktabzug auf 2 P bei `=` statt LIKE.)*

**B4 (6 P):**
```sql
SELECT ort, COUNT(*) AS anzahl
FROM kunde
GROUP BY ort;
```
Ergebnis: München 2, Hamburg 2, Köln 1. *(3 P Aggregat, 3 P GROUP BY auf der richtigen Spalte.)*

**B5 (4 P):**
```sql
SELECT AVG(preis) AS durchschnittspreis
FROM produkt;
```
Ergebnis: 201.18. *(1 P Abzug ohne Alias – er war ausdrücklich gefordert.)*

---

## Block C – Gruppieren und Verknüpfen (26 P)

**C1 (7 P):**
```sql
SELECT bestell_id, COUNT(*) AS positionen
FROM bestellposition
GROUP BY bestell_id
HAVING COUNT(*) > 1;
```
Ergebnis: 100 (2 Positionen), 101 (2 Positionen). *(3 P GROUP BY, 4 P HAVING – wer WHERE schreibt, verliert diese 4 P.)*

**C2 (7 P):**
```sql
SELECT b.bestell_id, b.bestelldatum, k.name
FROM bestellung b
INNER JOIN kunde k ON b.kunden_id = k.kunden_id;
```
6 Ergebniszeilen. *(3 P JOIN-Syntax, 3 P korrekte ON-Bedingung, 1 P Spaltenauswahl. LEFT JOIN wäre hier ebenfalls voll bepunktet – jede Bestellung hat einen Kunden.)*

**C3 (12 P):**
```sql
SELECT k.name, SUM(bp.menge * p.preis) AS umsatz
FROM kunde k
INNER JOIN bestellung b      ON k.kunden_id = b.kunden_id
INNER JOIN bestellposition bp ON b.bestell_id = bp.bestell_id
INNER JOIN produkt p         ON bp.produkt_id = p.produkt_id
GROUP BY k.name
ORDER BY umsatz DESC;
```
Ergebnis: Huber GmbH 1471.80 · Schmidt AG 945.00 · Fischer KG 767.70.
Rechenweg Huber: Best. 100 = 2×249 + 2×189 = 876,00; Best. 102 = 4×129 = 516,00; Best. 105 = 2×39,90 = 79,80.

*Prüferkommentar: 6 P für die drei korrekten Join-Bedingungen (je 2), 3 P für SUM(menge × preis), 2 P GROUP BY, 1 P ORDER BY … DESC. Diese Aufgabengröße ist typisch für den letzten Handlungsschritt einer echten Klausur.*

---

## Block D – Unterabfragen und Tabellen anlegen (24 P)

**D1 (8 P):**
```sql
SELECT k.name
FROM kunde k
LEFT JOIN bestellung b ON k.kunden_id = b.kunden_id
WHERE b.bestell_id IS NULL;
```
Ergebnis: Weber e.K., Braun GmbH.
Ebenfalls voll bepunktet – Lösung per Unterabfrage:
```sql
SELECT name FROM kunde
WHERE kunden_id NOT IN (SELECT kunden_id FROM bestellung);
```
*(4 P LEFT JOIN bzw. NOT IN-Konstrukt, 4 P IS-NULL-Filter bzw. korrekte Unterabfrage. Mit INNER JOIN ist die Aufgabe unlösbar – 0 P auf den Filterteil.)*

Vorsicht bei NOT IN: Die Variante funktioniert hier nur, weil `bestellung.kunden_id` keine NULL-Werte enthält. Enthielte die Unterabfrage einen NULL-Wert, lieferte NOT IN gar keine Zeile. Robust ist auch `WHERE NOT EXISTS (SELECT 1 FROM bestellung b WHERE b.kunden_id = k.kunden_id)` (→ Lernzettel 3.1).

**D2 (8 P):**
```sql
SELECT bezeichnung, preis
FROM produkt
WHERE preis > (SELECT AVG(preis) FROM produkt);
```
Ergebnis: Bürostuhl Comfort 249.00, Schreibtisch Basic 399.00 (Durchschnitt: 201.18). *(4 P Unterabfrage, 4 P Vergleich. Ein von Hand eingesetzter Zahlenwert statt der Unterabfrage gibt max. 4 P – die Abfrage wäre bei Datenänderung falsch.)*

**D3 (8 P):**
```sql
CREATE TABLE retoure (
  retoure_id  INTEGER PRIMARY KEY,
  bestell_id  INTEGER NOT NULL,
  grund       VARCHAR(200) NOT NULL,
  erstattung  DECIMAL(8,2) CHECK (erstattung >= 0),
  datum       DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (bestell_id) REFERENCES bestellung(bestell_id)
);
```
*Prüferkommentar: 1 P Grundgerüst, 1 P PRIMARY KEY, 2 P FOREIGN KEY mit REFERENCES, 1 P NOT NULL auf bestell_id, 1 P NOT NULL auf grund, 1 P CHECK, 1 P DEFAULT. Datentypen dürfen abweichen (z. B. INT, TEXT), solange sie fachlich passen.*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Thema sitzt – nur noch Karteikarten zur Auffrischung |
| 81–91 | gut | Fehlerthemen ins Fehlerjournal, in ein bis zwei Wochen einmal nachlösen |
| < 81 | | Teil 1/2 des Lernzettels wiederholen, Klausur nach 1 Woche komplett neu schreiben |

Denk daran: Dein Ziel für die echten Klausuren liegt bei ~95 Punkten. Alles, was hier nicht auf Anhieb saß, ist ein Geschenk – gefunden beim Üben statt in der Prüfung.
