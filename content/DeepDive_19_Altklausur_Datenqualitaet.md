# Deep Dive 19: Altklausur-Training Datenqualität
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Dieser Deep Dive übersetzt die **Aufgabentypen der echten Abschlussprüfung „Sicherstellen der Datenqualität“ (Sommer 2026)** in Training: vier Aufgaben, 100 Punkte, 90 Minuten. Die Altklausur zeigt, dass der Bereich weit mehr verlangt als SQL: **Daten visualisieren und auswerten, ein Bilderkennungsverfahren mit neuronalen Netzen verstehen, Datenbanken zusammenführen (ETL) und Datenschutz begründen, am Schluss SQL mit Verknüpfung, Aggregation und UPDATE.**

Besonders wichtig: **Die Aufgaben verlangen Begründungen im Szenario**, keine Lehrbuchdefinitionen. Wer „CNNs erkennen lokale Muster“ schreibt, ohne den Bezug zum Szenario herzustellen, verschenkt Punkte.

Szenario: **Möbelhaus Nordholz GmbH** – Logistikzentrum mit drei Rampen, IT-Abteilung für Warenwirtschaft und Zutrittsdaten.

---

# Teil 1 – So ist die Klausur aufgebaut

| Merkmal | Wert |
|---|---|
| Zeit / Punkte | 90 Minuten, 100 Punkte, 4 Aufgaben |
| Aufgabe 1 | Daten visualisieren, Prozentwerte berechnen, Erkenntnisse ableiten |
| Aufgabe 2 | Bilderkennung: Workflow, neuronale Netze, CNN, Funktionalitäten des Standardmodells, Datenschutz |
| Aufgabe 3 | Datenhaltung (zentral/dezentral), personenbezogene Daten, ETL-Transformation, Mitarbeiterrecht |
| Aufgabe 4 | SQL: Verknüpfen und Sortieren, Aggregation mit Multiplikation, Deckungsbeitrag mit HAVING, UPDATE mit Unterabfrage |
| Hilfsmittel | **SQL-Syntaxauszug** (Beiblatt): Befehle, Aggregat- und Datumsfunktionen, Berechtigungen |

**SQL wird nach Bausteinen bewertet:** je Klausel typischerweise **1 P** (SELECT, FROM, JOIN, WHERE, GROUP BY, ORDER BY), für **SUM + Multiplikation + AS** zusammen 3 P, für HAVING/UPDATE-Logik 1–2 P. Die **Syntax anderer SQL-Versionen ist ebenfalls richtig**. Relevant ist die **Logik**, nicht die Auswahl der Funktion.

---

# Teil 2 – Aufgabe 1: Daten visualisieren und auswerten

## 2.1 Welches Diagramm für welche Aussage?

| Aussage | Diagramm |
|---|---|
| Verteilung **mehrerer Gruppen auf mehrere Kategorien** (hier: Personengruppen auf Tore) | **gruppiertes Säulendiagramm** (je Tor eine Säule je Gruppe) oder gestapeltes Säulendiagramm |
| Anteil an einem Ganzen (eine Gruppe, wenige Kategorien) | Kreisdiagramm (je Gruppe eines) |
| Entwicklung über die Zeit | Liniendiagramm |
| Zusammenhang zweier Merkmale | Streudiagramm |
| Häufigkeitsverteilung eines Merkmals | Histogramm |

**Punkte gibt es für:** korrekte Darstellung je Gruppe (2 P je Gruppe), **Achsenbeschriftung** (inkl. Einheit, 2 P) und **Legende** (1 P). Ohne Achsentitel und Legende bleiben die Punkte aus – auch bei richtigen Daten.

## 2.2 Auslastung berechnen

$$\text{Personen je Tor} = \sum_{\text{Gruppen}} \text{Anzahl pro Tag} \cdot \text{Anteil am Tor}$$

$$\text{Auslastung in \%} = \frac{\text{Personen je Tor}}{\text{Personen gesamt}} \cdot 100$$

⚠️ **Prüfungsfalle:** Die Prozentwerte je Gruppe (65 %, 25 %, 10 %) beziehen sich auf die **Gruppe**, nicht auf das Tor. Erst nach dem Aufsummieren je Tor wird durch die **Gesamtzahl aller Personen** geteilt. Die Summe der Auslastungen ergibt **100 %** (Kontrolle).

## 2.3 Statistische Erkenntnisse je Tor

Eine gute Erkenntnis nennt **Zahl + Interpretation + Folge für die Planung**: „Rampe 1: 49 % aller Zugänge, davon 91 % Lieferanten → hier ist die größte Kapazität nötig, Spitzen morgens und nachmittags → mehr Abfertigungsspuren.“

---

# Teil 3 – Aufgabe 2: Bilderkennung mit neuronalen Netzen

## 3.1 Workflow einer automatisierten Texterkennung (z. B. Kennzeichen, Etiketten)

| Schritt | Funktionalität |
|---|---|
| 1. **Bildaufnahme** | Kamera erzeugt ein digitales Bild |
| 2. **Vorverarbeitung** | Helligkeit/Kontrast verbessern, Rauschen entfernen, Entzerren, Graustufen |
| 3. **Lokalisierung** | Wo im Bild liegt das gesuchte Objekt (Kennzeichen, Etikett)? Ausschnitt (Cropping) |
| 4. **Texterkennung (OCR)** | Zeichen im Ausschnitt in Text umwandeln |
| 5. **Validierung** | Format prüfen (**regulärer Ausdruck**), Plausibilität, **Abgleich mit der Datenbank** |
| 6. **Entscheidung** | Treffer → Schranke öffnet / Vorgang wird freigegeben; sonst Fehlermeldung oder manuelle Prüfung |

## 3.2 Warum neuronale Netze?

| Grund | Erläuterung |
|---|---|
| **Vielfalt und Variabilität** | Schriftarten, Größen, Verschmutzung, Perspektive, Lichtverhältnisse – ein Regelwerk müsste jede Ausnahme einzeln abdecken |
| **Lernen aus Beispielen** | Das Netz erkennt Muster selbst aus Trainingsdaten, statt von Hand programmiert zu werden |
| **Anpassbar** | Mit weiteren Daten nachtrainierbar (neue Kennzeichen-/Etikettenformate, neue Lichtverhältnisse) |
| **Robust** | auch bei Rauschen, leichter Drehung, Teilverdeckung |

## 3.3 CNN (Convolutional Neural Network)

- **Faltungsschichten (Convolution)** schieben kleine **Filter** über das Bild und erkennen **lokale Muster** (Kanten, Ecken, Texturen) – genau das, woraus Zeichen bestehen.
- **Räumliche Struktur bleibt erhalten:** Ein vollständig verbundenes Netz „flacht“ das Bild zu einem Vektor ab und verliert die Nachbarschaft der Pixel; ein CNN behält das 2D-Layout. So erkennt es Objekte auch, wenn sie **verschoben oder leicht gedreht** sind.
- **Hierarchie:** frühe Schichten erkennen Linien, spätere ganze Formen (Zeichen, Etiketten).

## 3.4 Standardmodell, Funktionalitäten, Erweiterung

Ein **vortrainiertes Standardmodell** (z. B. Objekterkennung) liefert **Bounding Boxes** mit **Klassen und Wahrscheinlichkeiten**. Es erkennt Fahrzeuge, Personen oder Paletten, **nicht aber** automatisch das Kennzeichen- oder Etikettenfeld.

- **Vorhanden:** Objekte lokalisieren und klassifizieren, Bounding Boxes, Konfidenzwerte; Bild kann auf den relevanten Bereich zugeschnitten werden (Cropping).
- **Fehlend:** Region des Kennzeichens/Etiketts wird nicht erkannt.
- **Realisieren:** Das Modell mit **eigenen, gelabelten Bildern** (Kennzeichen/Etiketten) **nachtrainieren** (Transfer Learning/Fine-Tuning), sodass diese Region als Klasse ausgewiesen wird.

## 3.5 Datenschutz bei Videoerfassung

**Hinweisschilder** auf die Videoerfassung · **Datenminimierung** (nur die relevante Bildregion speichern) · **Anonymisierung/Unkenntlichmachen** von Personen · **automatische Löschung** nach kurzer Frist · Zweckbindung, Zugriffsbeschränkung, Betriebsvereinbarung.

---

# Teil 4 – Aufgabe 3: Datenhaltung, ETL und Datenschutz

## 4.1 Zentral oder dezentral speichern?

| | Vorteil | Nachteil |
|---|---|---|
| **Zentral (Cloud/Server)** | einheitlicher Datenbestand, Änderungen **einmal** pflegen; einfache Backups und Berechtigungen; zentrale Absicherung | Abhängigkeit von Netz und Anbieter; Ausfall betrifft alle; Datenschutz/Standort der Daten prüfen |
| **Dezentral (am Gerät/Schließsystem)** | funktioniert bei **Netzausfall**; schneller Zugriff; weniger zentrale Angriffsfläche | hoher Aufwand bei **Änderungen/Personalwechsel**; Backup und Konsistenz schwer; Datenstand kann abweichen |

## 4.2 Personenbezogene Daten

Personenbezogen sind Daten, die sich auf eine **identifizierte oder identifizierbare** Person beziehen (Name, Kennung mit Verknüpfungsmöglichkeit, Standort). **Reine Sach- oder Rechtedaten** ohne Personenbezug (Rampe/Spedition-ID, Berechtigung) sind es nicht, **Personaldaten** (Name, Stelle, Abteilung) schon. Werden Daten über eine ID mit der Personaldatenbank verknüpft, entsteht ein **Personenbezug**.

**Maßnahmen bei der Speicherung:** Verschlüsselung · Löschfristen und automatisches Löschen · Zugriffsbeschränkung/Rollen · Löschbarkeit beim Datenbankdesign berücksichtigen (referenzielle Integrität) · Protokollierung.

## 4.3 ETL – Transformation

Bevor Daten aus mehreren Quellen für eine Bewegungsanalyse zusammengeführt werden:

| Attribut / Maßnahme | Zweck |
|---|---|
| **Datum** aus Wochentag, Tag und Monat zu einem Datumsfeld (`DATE`) | einfache Sortierung und Auswertung |
| **Aufenthaltsdauer** aus Von/Bis berechnen (in Minuten, `INTEGER`) | direkt auswertbar, Dauer ist die gesuchte Größe |
| **Eigener numerischer Schlüssel** für Gebäude/Rampen | Joins und Suche werden einfacher und schneller (Integer statt Text) |
| **Attribut ohne Aussage entfernen** (z. B. technische ExcelID) | Datenmenge und Fehlerquellen reduzieren |
| **Datentypen vereinheitlichen** (Text → Datum, Text → Zahl) | Vergleich, Sortierung und Berechnung |

## 4.4 Zusammenführen und Mitarbeiterrecht

Das Zusammenführen von Zutritts- und Personaldaten ergibt ein **Bewegungsprofil**. Es betrifft **Beschäftigtendaten** (Zweckbindung nach § 26 BDSG, Mitbestimmung des Betriebsrats nach § 87 Abs. 1 Nr. 6 BetrVG). **Erlaubt** ist es in der Regel nur bei einem **konkreten, dokumentierten Zweck**, zum Beispiel:
- **Verdacht auf eine Straftat** (z. B. Diebstahl) mit konkreter, dokumentierter Verdachtslage,
- **Arbeitssicherheit**, etwa Feststellung, wer sich bei einem Brand im Gebäude befindet.

---

# Teil 5 – Aufgabe 4: SQL-Muster der Prüfung

## 5.1 Das Datenmodell: Stückliste

```
Moebel (M_ID PK, M_Name, Verkaufspreis)
Bauteil (BT_ID PK, BT_Name, Einkaufspreis)
Stueckliste (BT_ID PK/FK, M_ID PK/FK, Anzahl)       -- n:m-Auflösung
Produktionsplan (M_ID PK/FK, Produktionsdatum PK, A_ID PK/FK, Anzahl)
Anlage (A_ID PK, Bezeichnung)
```

Eine **Stückliste** löst die n:m-Beziehung Möbel ↔ Bauteil auf und trägt die **Anzahl je Möbel**. Der Produktionsplan sagt, **wie viele Möbel** an welchem Tag auf welcher Anlage gefertigt werden. Der **Bauteilbedarf** ist deshalb **Stücklistenanzahl × geplante Menge**.

## 5.2 Typ 1: Verknüpfen, Filtern, Sortieren

```sql
SELECT pp.Produktionsdatum, m.M_Name, pp.Anzahl
FROM produktionsplan pp
JOIN moebel m ON pp.M_ID = m.M_ID
WHERE pp.Produktionsdatum BETWEEN '2026-05-11' AND '2026-05-12'
ORDER BY pp.Produktionsdatum, m.M_Name;
```

## 5.3 Typ 2: Aggregation über eine Rechnung

```sql
SELECT bt.BT_ID, bt.BT_Name,
       SUM(sl.Anzahl * pp.Anzahl) AS Gesamtzahl
FROM bauteil bt
JOIN stueckliste sl ON bt.BT_ID = sl.BT_ID
JOIN produktionsplan pp ON sl.M_ID = pp.M_ID
WHERE pp.Produktionsdatum = '2026-05-12'
GROUP BY bt.BT_ID, bt.BT_Name;
```

⚠️ **Die Multiplikation steht innerhalb der Aggregatfunktion** (`SUM(a * b)`), nicht `SUM(a) * SUM(b)`. Alle nicht aggregierten Spalten gehören ins `GROUP BY`.

## 5.4 Typ 3: Deckungsbeitrag mit HAVING

$$\text{Deckungsbeitrag} = \text{Verkaufspreis} - \text{variable Kosten}$$

```sql
SELECT m.M_Name, m.Verkaufspreis,
       SUM(sl.Anzahl * bt.Einkaufspreis) AS Variable_Kosten,
       m.Verkaufspreis - SUM(sl.Anzahl * bt.Einkaufspreis) AS Deckungsbeitrag
FROM moebel m
JOIN stueckliste sl ON m.M_ID = sl.M_ID
JOIN bauteil bt ON sl.BT_ID = bt.BT_ID
GROUP BY m.M_ID, m.M_Name, m.Verkaufspreis
HAVING m.Verkaufspreis - SUM(sl.Anzahl * bt.Einkaufspreis) > 50
ORDER BY Deckungsbeitrag DESC;
```

**HAVING** filtert **Gruppen nach der Aggregation** – die Bedingung auf einem Aggregat darf nicht in `WHERE` stehen. Ob der Alias in `HAVING` zulässig ist, hängt vom System ab (MySQL ja, andere nicht); die ausgeschriebene Rechnung ist immer richtig.

## 5.5 Typ 4: UPDATE mit Unterabfrage

```sql
UPDATE produktionsplan
SET Produktionsdatum = DATEADD(DAY, 7, Produktionsdatum)   -- alternativ: Produktionsdatum + 7
WHERE Produktionsdatum = '2026-05-12'
  AND A_ID IN (SELECT A_ID FROM anlage WHERE Bezeichnung = 'Fräse F2');
```

Die Anlage wird über die **Bezeichnung** angegeben, der Produktionsplan kennt aber nur die **A_ID** – deshalb eine Unterabfrage mit `IN`. Eine UPDATE-Anweisung ohne `WHERE` ändert **alle** Zeilen.

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Diagramm ohne Achsenbeschriftung oder Legende.
2. Prozentwerte je Gruppe direkt als Toranteil gewertet (statt aufsummiert und durch die Gesamtzahl geteilt).
3. Workflow ohne **Validierung** (Abgleich mit Datenbank/Format) – direkt von der Texterkennung zur Freigabe.
4. CNN-Vorteile ohne Bezug zur Aufgabe („CNNs sind gut für Bilder“).
5. Personenbezug falsch bewertet: Tabelle nur mit IDs vs. Tabelle mit Namen.
6. ETL: Attribute genannt, aber **Zweck und Datentyp** fehlen.
7. SQL: Join-Bedingung vergessen (kartesisches Produkt) oder `SUM(a) * SUM(b)`.
8. SQL: Aggregatbedingung in `WHERE` statt `HAVING`, `UPDATE` ohne `WHERE`.

---

# Übungsklausur Datenqualität im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Verwenden Sie bei SQL-Aufgaben den Syntaxauszug aus Teil 5. Stichwortartige Antworten sind zulässig; bei Berechnungen ist der Rechenweg anzugeben. Bearbeite die Klausur **am Ende des Themas** am Stück, ohne Unterlagen.

## Ausgangssituation

Das Logistikzentrum der **Möbelhaus Nordholz GmbH** hat drei Rampen (Rampe 1 bis 3), über die Lieferanten, Selbstabholer und Montageteams von Fremdfirmen das Gelände nutzen. Sie sind Mitarbeiter der IT-Abteilung, die für die Administration der Prozesse und für das Warenwirtschaftssystem zuständig ist.

## Block A – Visualisierung und Auswertung (21 P)

Aktuell werden alle Anlieferer an den Rampen persönlich kontrolliert. Im Rahmen der Planung eines neuen Zufahrtssystems wurden die Daten der letzten zwölf Monate je Gruppe erhoben und aggregiert:

| Gruppe | Durchschnittliche Anzahl pro Tag | Spitzenzeiten (> 75 % der Tagesanzahl) | Häufigste Rampen |
|---|---|---|---|
| Lieferanten | 180 | 6:00–9:00 | Rampe 1 (70 %), Rampe 2 (30 %) |
| Selbstabholer | 60 | 10:00–12:00 und 15:00–17:00 | Rampe 1 (20 %), Rampe 3 (80 %) |
| Montageteams (Fremdfirmen) | 40 | ganztägig | Rampe 2 (50 %), Rampe 3 (50 %) |

**A1 (9 P):** Um die Daten nutzbar zu machen, sollen sie visualisiert werden. Skizzieren Sie ein geeignetes Diagramm, das die Verteilung der drei Gruppen auf die drei Rampen darstellt. Beschriften Sie die Achsen und geben Sie eine Legende an.

**A2 (6 P):** Die Kontrolle soll in Zukunft automatisiert erfolgen. Berechnen Sie, wie viele Personen **durchschnittlich pro Tag** durch jede Rampe gehen und wie hoch die **anteilige Auslastung der Rampen in Prozent** ist.

> **Formeln:**
> - Personen je Rampe = Σ (Personen der Gruppe · Anteil dieser Gruppe an der Rampe)
> - Auslastung = Personen der Rampe / Personen gesamt · 100 %

**A3 (6 P):** Beschreiben Sie je Rampe **eine statistische Erkenntnis**, die für die Planung des neuen Zufahrtssystems relevant ist.

## Block B – Automatisierte Etikettenerkennung (28 P)

Eine Sicherheitsrichtlinie schreibt vor, dass nur **angemeldete Lieferungen** entladen werden dürfen. Sie entwickeln mit an einer automatisierten Prüfung am Wareneingang, die Kosten sparen und die Mitarbeiter entlasten soll.

**B1 (4 P):** Nennen Sie für die Umsetzung der Richtlinie **zwei weitere Merkmale** und geben Sie an, wie diese bei der **erstmaligen Registrierung** einer Spedition überprüft werden können.

| Merkmal | Initiale Überprüfung bei der Registrierung |
|---|---|
| Lieferscheinnummer auf Palettenetikett | Abgleich mit der Bestellung im Warenwirtschaftssystem |
| | |
| | |

**B2 (8 P):** Das Palettenetikett (Format „LS-JJJJ-NNNNNN“, z. B. LS-2026-004711) soll beim Eintreffen automatisch per Kamera geprüft werden. Entwerfen Sie einen **Workflow** und nennen Sie **vier sinnvolle Schritte mit ihrer Funktionalität**. Die Schritte „Bildaufnahme“ (Kamera erzeugt ein digitales Bild der Palette) und „Entscheidung: Freigabe oder nicht“ sind vorgegeben.

**B3 (4 P):** Beschreiben Sie **zwei Gründe**, warum neuronale Netze für diese Aufgabe geeignet sind.

**B4 (4 P):** Bei Ihrer Recherche finden Sie folgenden Text:

> *A convolutional neural network (CNN) is a type of neural network designed for image data. Instead of treating all pixels independently, it slides small filters across the image to detect local patterns such as edges and corners. Because the filters keep the two-dimensional arrangement of the pixels, a CNN can recognise a shape even if it appears at a different position in the picture. Deeper layers combine simple patterns into complex shapes such as letters or labels.*

Beschreiben Sie **zwei Gründe**, warum sich ein CNN für die Etikettenerkennung besonders gut eignet.

**B5 (4 P):** Sie beginnen mit einem CNN-Verfahren und setzen ein **Standardmodell zur groben Vorklassifikation** ein. Das Modell liefert für das Kamerabild: *pallet (0,93)*, *person (0,97)*, *forklift (0,90)*, jeweils mit Rechteck (Bounding Box). Das Etikett auf der Palette wird nicht markiert. Beschreiben Sie **eine bereits vorhandene und eine noch fehlende Funktionalität** des Verfahrens.

**B6 (2 P):** Beschreiben Sie eine Möglichkeit, die noch fehlende Funktionalität im Verfahren zu realisieren.

**B7 (2 P):** Nennen Sie **zwei Maßnahmen**, die aus datenschutzrechtlichen Gründen erforderlich sind, um einen rechtskonformen Betrieb der Kameras zu ermöglichen.

## Block C – Datenhaltung, ETL und Datenschutz (25 P)

Die Rampen sollen künftig digital ausgewertet werden. Dafür werden verschiedene Daten verwendet:
- **Berechtigungsdatenbank:** Berechtigungen für die Rampen je Spedition (CSV-Export),
- **Anlieferdatenbank:** tatsächliche Anlieferungen mit Zeitpunkt und Dauer (MySQL),
- **Speditionsdatenbank:** Stammdaten der Speditionen mit Ansprechpartner (API, JSON).

Auszüge:

```text
Berechtigungsdatenbank (CSV)        Speditionsdatenbank (JSON)
Rampe;Spedition_ID                  [ { "SID": 4, "firma": "Nordtrans GmbH",
Rampe 1;4                              "ansprechpartner": "M. Kroll", "status": "Lieferant" },
Rampe 1;6                            { "SID": 6, "firma": "Weser-Logistik",
Rampe 2;4                              "ansprechpartner": "P. Brandt", "status": "Lieferant" },
Rampe 3;9                            { "SID": 9, "firma": "Montage Süd GmbH",
...                                    "ansprechpartner": "T. Aydin", "status": "Dienstleister" } ]
```

| ExcelID | ID | SID | Rolle | Rampe | Wochentag | Tag | Monat | Von | Bis |
|---|---|---|---|---|---|---|---|---|---|
| 79 | 1 | 4 | Lieferant | Rampe 1 | Mo | 11 | 5 | 05:30 | 06:30 |
| 131 | 2 | 6 | Lieferant | Rampe 1 | Mo | 11 | 5 | 06:00 | 07:15 |
| 106 | 3 | 9 | Montage | Rampe 3 | Mo | 11 | 5 | 07:00 | 11:00 |
| 59 | 4 | 4 | Lieferant | Rampe 2 | Mo | 11 | 5 | 08:30 | 09:00 |

**C1 (8 P):** Der Anbieter des Zufahrtssystems bietet die Möglichkeit, die Berechtigungsdatenbank **zentral in der Cloud** zu speichern oder dezentral an den Rampen. Beschreiben Sie **zwei Vor- und zwei Nachteile einer zentralen Speicherung**. Tragen Sie die Antworten in die Tabelle ein.

| Vorteil | Nachteil |
|---|---|
| | |
| | |

**C2 (3 P):** Kreuzen Sie in der Tabelle an, in welchen Datenbanken **personenbezogene Daten** gespeichert sind.

| Datenbank | personenbezogene Daten | nicht personenbezogene Daten |
|---|---|---|
| Berechtigungsdatenbank | | |
| Anlieferdatenbank | | |
| Speditionsdatenbank | | |

**C3 (4 P):** Beschreiben Sie **zwei Maßnahmen**, die in Bezug auf die Datenspeicherung von personenbezogenen Daten ergriffen werden müssen.

**C4 (8 P):** Für eine Analyse von Anlieferzeiten sollen die Daten zusammengeführt werden. Im Rahmen eines **ETL-Prozesses** werden die Rohdaten vorbereitet und entsprechend neue Attribute hinzugefügt oder angepasst. Nennen Sie **zwei Attribute** aus den gegebenen Datenbanken, die Sie im Rahmen der Transformation anpassen bzw. hinzufügen würden, und erläutern Sie den Zweck. Gehen Sie dabei auch auf die genutzten **Datentypen** ein.

| Attribut | Erläuterung |
|---|---|
| | |
| | |

**C5 (2 P):** Beschreiben Sie einen Fall, in dem eine solche **Datenzusammenführung** aus Sicht von Datenschutz bzw. Mitarbeiterrecht **erlaubt** wäre.

## Block D – SQL für die Produktionsplanung (26 P)

Für das Logistikmodul zum unternehmensinternen Warenverkehr wurde folgende Datenbank entwickelt. Sie sollen die SQL-Anweisungen für das Modul erstellen.

```text
Moebel (M_ID PK, M_Name, Verkaufspreis)
Bauteil (BT_ID PK, BT_Name, Einkaufspreis)
Stueckliste (BT_ID PK/FK, M_ID PK/FK, Anzahl)
Produktionsplan (M_ID PK/FK, Produktionsdatum PK, A_ID PK/FK, Anzahl)
Anlage (A_ID PK, Bezeichnung)
```

**D1 (4 P):** Erstellen Sie eine Liste der am **11.05.2026 und 12.05.2026** zu fertigenden Möbel. Sortieren Sie zuerst nach Datum und anschließend nach dem Namen des Möbelstücks. Erwartete Ausgabe:

| Produktionsdatum | M_Name | Anzahl |
|---|---|---|
| 2026-05-11 | Regal | 30 |
| 2026-05-11 | Schreibtisch | 20 |
| 2026-05-11 | Stuhl | 50 |
| 2026-05-12 | Regal | 25 |
| 2026-05-12 | Schrank | 10 |
| 2026-05-12 | Schreibtisch | 15 |
| 2026-05-12 | Stuhl | 40 |

**D2 (8 P):** Erstellen Sie eine Liste der Bauteile mit Namen und **gesamter Anzahl**, die am **12.05.2026** zu den Anlagen gebracht werden müssen. Beachten Sie, dass die gleichen Bauteile in verschiedene Möbel eingebaut werden können. Erwartete Ausgabe (Auszug):

| BT_ID | BT_Name | Gesamtzahl |
|---|---|---|
| 10 | Tischplatte | 15 |
| 12 | Schublade | 60 |
| 13 | Regalboden | 150 |
| 17 | Schraubensatz | 100 |

**D3 (8 P):** Da der Preisdruck steigt, sollen Sie ermitteln, wo Verkaufspreise gesenkt werden können. Ermitteln Sie dazu den **Deckungsbeitrag** für jedes Möbelstück (Verkaufspreis minus Summe aus Stücklistenanzahl × Einkaufspreis). Sortieren Sie nach dem Deckungsbeitrag, sodass die höchsten oben stehen. Zeigen Sie **nur Möbel mit einem Deckungsbeitrag über 50 EUR** an.

**D4 (6 P):** Die Anlage „Fräse F2“ fällt aus und wird am 12.05.2026 repariert. **Verschieben Sie das Produktionsdatum** für die betroffenen Einträge des Produktionsplans um eine Woche.

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich wähle ein passendes Diagramm für die Verteilung mehrerer Gruppen und beschrifte Achsen und Legende vollständig.
- [ ] Ich berechne Auslastungen korrekt: erst je Tor aufsummieren, dann durch die Gesamtzahl teilen.
- [ ] Ich beschreibe einen Workflow der Bilderkennung mit Vorverarbeitung, Lokalisierung, OCR und Validierung.
- [ ] Ich begründe den Einsatz neuronaler Netze und CNNs mit Bezug zum Szenario.
- [ ] Ich nenne vorhandene und fehlende Funktionalitäten eines Standardmodells und erkläre das Nachtrainieren.
- [ ] Ich nenne Vor- und Nachteile zentraler und dezentraler Datenhaltung.
- [ ] Ich unterscheide personenbezogene und nicht personenbezogene Daten anhand der Tabelleninhalte.
- [ ] Ich nenne ETL-Transformationen mit Zweck und Datentyp.
- [ ] Ich schreibe SQL mit Join, SUM(a*b), GROUP BY, HAVING und UPDATE mit Unterabfrage.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
