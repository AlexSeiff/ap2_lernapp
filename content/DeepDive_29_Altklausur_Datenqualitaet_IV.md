# Deep Dive 29: Altklausur-Training Datenqualität IV
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Eine **Übungsvariante im Stil einer weiteren Prüfung „Sicherstellen der Datenqualität“**: vier Aufgaben mit 27, 25, 28 und 20 Punkten, 90 Minuten. Texte, Zahlen und Szenario sind neu geschrieben, Aufbau und Niveau folgen der Prüfung. Gegenüber den Deep Dives 19, 23 und 24 kommen vier Aufgabentypen dazu: **Klassifikation mit einer Trenngeraden** – zeichnen, zählen und rechnen (27 P), **Daten mit Python/pandas zusammenführen und filtern**, **fünf SQL-Anweisungen über ein Schema mit Messwerttabelle** (28 P) und eine **Schutzbedarfsfeststellung für Cloud-Dienste** (16 P).

Nichts davon ist schwer – aber alles verlangt, dass du **genau liest**: welche Gerade, welche Spalte, welche Bedingung, welches Schutzziel.

Szenario: **Möbelhaus Nordholz GmbH**, Holzlager der **Nordholz Manufaktur** mit Klimasensoren und einem Kamerawagen.

---

# Teil 1 – So ist die Klausur aufgebaut

| Aufgabe | Inhalt | Punkte |
|---|---|---|
| 1 | Trainingsdaten zeichnen, zwei Trenngeraden vergleichen, Testdaten auswerten, Klasse berechnen, ML-Schritte ordnen | 27 |
| 2 | CRISP-DM beschriften, Fehler in einem pandas-Skript finden, JOIN erklären, drei Filterbefehle schreiben | 25 |
| 3 | SQL: Verknüpfen mit Filter und Sortierung, Aggregate je Gruppe, HAVING, Unterabfrage, DELETE | 28 |
| 4 | Nachteile der Cloud-Speicherung, Schutzbedarf je Schutzziel feststellen und begründen | 20 |

**Hilfsmittel:** SQL-Syntaxauszug; für pandas steht ein kurzer englischer Text mit Beispielen in der Aufgabe.

---

# Teil 2 – Klassifikation mit einer Trenngeraden

## 2.1 Die Idee

Jedes Objekt ist ein **Punkt** aus zwei Kennwerten (x | y). Liegen die Klassen in getrennten Punktwolken, lässt sich eine **Gerade** dazwischen legen: Punkte auf der einen Seite gehören zur einen, Punkte auf der anderen Seite zur anderen Klasse. Das Modell **ist** die Gerade – „trainieren“ heißt, Steigung und Achsenabschnitt so zu wählen, dass möglichst wenige Punkte auf der falschen Seite liegen.

## 2.2 Rechnen statt Hinsehen

Für einen neuen Punkt (x | y) und die Gerade f(x) = m · x + b:

1. **Funktionswert** der Geraden an der Stelle x berechnen.
2. **Differenz** d = y − f(x) bilden.
3. d > 0 → der Punkt liegt **oberhalb** der Geraden, d < 0 → **unterhalb**. Welche Klasse oben liegt, zeigen die Trainingsdaten.

Beispiel mit f(x) = 2 · x + 1 und dem Punkt (3 | 10): $10 - (2 \cdot 3 + 1)$ = **3**

Der Punkt liegt oberhalb der Geraden.

## 2.3 Trainings- und Testdaten

Beide Geraden können die **Trainingsdaten** fehlerfrei trennen und sich trotzdem unterscheiden. Welche besser ist, zeigen erst die **Testdaten**, die beim Festlegen der Geraden nicht benutzt wurden: richtig und falsch vorhergesagte Punkte zählen.

> ❓ **Prüferfrage:** Zwei Trenngeraden klassifizieren alle Trainingspunkte richtig. Woran entscheiden Sie, welche Sie einsetzen?
> *An der Trefferquote auf ungesehenen Testdaten. Die Gerade mit mehr richtigen Vorhersagen verallgemeinert besser; zusätzlich spricht ein großer Abstand zu beiden Punktwolken für eine robuste Trennung.*

## 2.4 Reihenfolge im Machine-Learning-Prozess

Daten sammeln → Daten aufbereiten → in Trainings- und Testdaten aufteilen → Modelltyp wählen → Gütemaß festlegen → Modell trainieren → Modell mit den Testdaten bewerten.

---

# Teil 3 – Daten mit pandas zusammenführen und filtern

## 3.1 Einlesen und Verknüpfen

```python
import pandas as pd
kunden_df = pd.read_csv("daten/kunden.csv")      # CSV-Datei einlesen
orte_df = pd.read_json("daten/orte.json")        # JSON-Datei einlesen
alles = pd.merge(kunden_df, orte_df, on="plz", how="inner")
```

- Die Lesefunktion muss zum **Dateiformat** passen (`read_csv`, `read_json`, `read_excel`).
- Ein Skript läuft **von oben nach unten**: Ein DataFrame muss eingelesen sein, bevor er verknüpft wird.
- `merge` entspricht dem **JOIN**: `on` nennt die gemeinsame Spalte, `how` die Art (`inner`, `left`, `right`, `outer`).

## 3.2 JOIN in einem Satz

Ein JOIN verbindet Zeilen aus zwei Tabellen über **übereinstimmende Werte in einer gemeinsamen Spalte** (meist Fremdschlüssel = Primärschlüssel). Beim INNER JOIN erscheinen nur Zeilen mit Partner in beiden Tabellen; LEFT/RIGHT/FULL JOIN behalten zusätzlich die Zeilen ohne Partner und füllen mit NULL auf.

## 3.3 Filtern

```python
alles[alles.ort == 'Kiel']                                  # eine Bedingung
alles[(alles.ort == 'Kiel') & (alles.umsatz > 500)]         # und
alles[(alles.ort == 'Kiel') | (alles.ort == 'Husum')]       # oder
```

Jede Bedingung steht in **runden Klammern**, verglichen wird mit `==`, Text steht in Anführungszeichen. `and` und `or` funktionieren hier nicht.

---

# Teil 4 – SQL-Muster dieser Klausur

Die Beispiele verwenden die Tabellen `kunde`, `bestellung` und `produkt` aus Deep Dive 1 – in der Klausur wendest du dieselben Muster auf ein neues Schema an.

| Typ | Kern | Worauf achten? |
|---|---|---|
| Verknüpfen, filtern, zweifach sortieren | `JOIN … ON …`, `WHERE`, `ORDER BY a ASC, b DESC` | jede Tabelle über ihren Schlüssel verbinden; Filter auf den **Namen** der Eigenschaft nicht vergessen |
| Höchster, niedrigster, mittlerer Wert je Gruppe | `MAX()`, `MIN()`, `AVG()` mit `GROUP BY` | die Gruppenspalte steht in `SELECT` und in `GROUP BY` |
| Anzahl je Gruppe mit Mindestanzahl | `WHERE` (Zeilen) vor `GROUP BY`, `HAVING COUNT(*) > n` (Gruppen) danach | „mehr als zwei“ ist `> 2`, nicht `>= 2` |
| Zeilen mit dem höchsten Wert | `WHERE spalte = (SELECT MAX(spalte) FROM tabelle)` | `ORDER BY … LIMIT 1` liefert bei Gleichstand nur eine Zeile |
| Löschen über eine andere Tabelle | `DELETE FROM a WHERE fk = (SELECT pk FROM b WHERE name = '…')` | Löschweitergabe (`ON DELETE CASCADE`) entfernt die Detailzeilen mit |

```sql
SELECT k.ort, COUNT(*) AS anzahl
FROM kunde k
JOIN bestellung b ON b.kunden_id = k.kunden_id
WHERE b.bestelldatum >= '2025-01-01'
GROUP BY k.ort
HAVING COUNT(*) > 2
ORDER BY anzahl DESC;
```

---

# Teil 5 – Cloud und Schutzbedarf

## 5.1 Nachteile der Cloud-Speicherung

Abhängigkeit vom **Anbieter** (Lock-in, Preisänderungen) und von der **Internetverbindung** · Daten liegen **außerhalb des eigenen Zugriffs** – Datenschutz und Speicherort müssen vertraglich geregelt sein (Auftragsverarbeitung, Drittland) · laufende Kosten, die mit der Datenmenge wachsen · Angriffsfläche über das Internet.

## 5.2 Schutzbedarf feststellen

Für jedes **Schutzziel** fragst du: Was passiert, wenn es verletzt wird?

| Schutzziel | Frage |
|---|---|
| **Verfügbarkeit** | Wie lange kann der Betrieb ohne das System weiterlaufen? |
| **Integrität** | Was passiert, wenn Daten unbemerkt falsch oder manipuliert sind? |
| **Vertraulichkeit** | Was passiert, wenn Unbefugte die Daten lesen? |

| Schutzbedarf (BSI-Kategorien) | Schaden |
|---|---|
| **normal** | begrenzt und überschaubar |
| **hoch** | beträchtlich |
| **sehr hoch** | existenzbedrohend, katastrophal |

Die **Begründung** nennt den konkreten Schaden im Szenario – „weil wichtig“ reicht nicht.

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. **Testdaten mit eingezeichnet**, obwohl nur Trainingsdaten verlangt sind – oder nicht unterscheidbar markiert.
2. Die **Differenz falsch herum** gebildet (f(x) − y) und dadurch die Klasse vertauscht.
3. Bei den ML-Schritten **erst trainiert, dann aufgeteilt**.
4. pandas: `and`/`or` statt `&`/`|`, Klammern um die Bedingungen vergessen, `=` statt `==`.
5. SQL: Filter auf die **Eigenschaft** vergessen – dann zählen auch andere Messwerte mit.
6. `WHERE` und `HAVING` vertauscht („Qualität ≥ 7“ filtert Zeilen, „mehr als zwei Chargen“ filtert Gruppen).
7. `DELETE` **ohne WHERE** – oder auf der falschen Tabelle.
8. Schutzbedarf **ohne Begründung** oder mit einer Begründung, die zu einem anderen Schutzziel gehört.

---

# Übungsklausur Datenqualität IV im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Antworte stichwortartig, gib bei Berechnungen den Rechenweg an und halte dich an die geforderte Anzahl der Nennungen. Zeichnungen fertigst du auf Papier an und vergleichst sie mit der Musterlösung.

## Ausgangssituation

Im Holzlager der **Nordholz Manufaktur**, der Massivholz-Werkstatt der **Möbelhaus Nordholz GmbH**, messen Sensoren laufend Temperatur und Luftfeuchte. Ein **Kamerawagen** fährt täglich an den Brettstapeln entlang und fotografiert die Bretter. Aus den Bildern soll ein KI-System Handlungsbedarf erkennen und Empfehlungen geben – etwa bei Pilzbefall. Messdaten und Bilder werden in einer Cloud-Datenbank gespeichert. Sie arbeiten in der IT-Abteilung und betreuen die Auswertung.

## Block A – Pilzbefall erkennen: Klassifikation (27 P)

Von einigen Brettern ist bekannt, ob sie von einem Pilz befallen sind (**P**) oder gesund (**G**). Aus den Kamerabildern werden je Brett zwei Kennwerte **x** und **y** bestimmt, die gute Anzeichen für einen Befall sind.

| Datensatz | x | y | Klasse |
|---|---|---|---|
| Training 1 | 2 | 9 | G |
| Training 2 | 2 | 10 | G |
| Training 3 | 3 | 9 | G |
| Training 4 | 3 | 10 | G |
| Training 5 | 3 | 11 | G |
| Training 6 | 3,5 | 9,5 | G |
| Training 7 | 4 | 10 | G |
| Training 8 | 4 | 11 | G |
| Training 9 | 7 | 5 | P |
| Training 10 | 7 | 6 | P |
| Training 11 | 7,5 | 4 | P |
| Training 12 | 8 | 6 | P |
| Training 13 | 8 | 5 | P |
| Training 14 | 8,5 | 4,5 | P |
| Training 15 | 9 | 6 | P |
| Test 1 | 3,5 | 10,5 | G |
| Test 2 | 8 | 7 | P |
| Test 3 | 7 | 8,5 | P |
| Test 4 | 5,5 | 9 | G |
| Test 5 | 3 | 12 | P |

**A1 (7 P):** *Zeichnen* Sie die **Trainingsdaten** (nicht die Testdaten) in ein Koordinatensystem (Papier; x-Achse 0 bis 10, y-Achse 0 bis 13). Verwenden Sie für gesund (G) einen ausgefüllten Kreis und für befallen (P) ein Kreuz. *Zeichnen* Sie anschließend zwei mögliche Trenngeraden ein: Gerade 1: y = 7,5 und Gerade 2: y = 1,5 · x − 1.

**A2 (2 P):** *Nennen* Sie die Form des maschinellen Lernens, die hier vorliegt, und *begründen* Sie Ihre Angabe.

**A3 (2 P):** *Beschreiben* Sie, warum sich mithilfe einer Trenngeraden angeben lässt, ob ein Brett gesund oder befallen ist.

**A4 (2 P):** *Zeichnen* Sie nun die Testdaten in das Koordinatensystem aus A1 ein und umrahmen Sie jeden Testpunkt mit einem Kästchen. *Ermitteln* Sie für beide Geraden die Anzahl der richtigen und der falschen Vorhersagen und *tragen* Sie sie in die Tabelle *ein*.

| Gerade | richtig | falsch |
|---|---|---|
| 1 | | |
| 2 | | |

**A5 (4 P):** *Entscheiden* Sie, welche der beiden Geraden die Klassen besser trennt, und *formulieren* Sie eine Handlungsempfehlung, wie sich eine möglichst gute Trenngerade finden lässt.

**A6 (4 P):** Die Klasse eines Bretts lässt sich in zwei Schritten berechnen: (1) Zum Wert x des Messpunkts den Funktionswert der Trenngeraden ermitteln. (2) Die Differenz zwischen dem Wert y des Messpunkts und diesem Funktionswert bilden. *Berechnen* Sie beide Schritte für die Punkte (2 | 8) und (6 | 5). Verwenden Sie die Gerade 2: y = 1,5 · x − 1.

> **Formeln:**
> - Funktionswert der Trenngeraden: f(x) = m · x + b
> - Differenz: d = y − f(x)

**A7 (3 P):** *Entscheiden* Sie anhand der Differenzen aus A6, welcher Klasse die beiden Messpunkte zuzuordnen sind, und *begründen* Sie Ihre Entscheidung.

> **Formel:** d = y − f(x)

**A8 (3 P):** *Ordnen* Sie die Arbeitsschritte eines Machine-Learning-Prozesses in eine sinnvolle Reihenfolge und *tragen* Sie die Ziffern in die Tabelle *ein*. Der erste Schritt ist vorgegeben.

1. Modell trainieren (beste Gerade bestimmen)
2. Daten sammeln
3. Modell mit den Testdaten bewerten
4. Modelltyp auswählen (z. B. Trenngerade)
5. Daten aufbereiten
6. Gütemaß für das Modell festlegen
7. Daten in Trainings- und Testdaten aufteilen

| 1. Schritt | 2. Schritt | 3. Schritt | 4. Schritt | 5. Schritt | 6. Schritt | 7. Schritt |
|---|---|---|---|---|---|---|
| 2 | | | | | | |

## Block B – Kamera- und Klimadaten zusammenführen (25 P)

Der Kamerawagen liefert zuverlässig Daten zu den Brettern. Zur Auswertung liegen zwei Dateien vor.

**Auszug aus `lager/kamera_2610.csv`**

| datum | uhrzeit | platz | holzart | zustand | massnahme |
|---|---|---|---|---|---|
| 26.10.2026 | 09:12:00 | 4;17 | Eiche | verzogen | manuell |
| 26.10.2026 | 09:12:20 | 4;18 | Eiche | gut | keine |
| 26.10.2026 | 09:12:40 | 5;1 | Buche | feucht | wird behandelt |
| 26.10.2026 | 09:13:00 | 5;2 | Buche | Pilzbefall | wird behandelt |
| 26.10.2026 | 09:13:20 | 5;3 | Buche | gut | keine |

**Auszug aus `klima/2610.json`**

| datum | temperatur | luftfeuchte |
|---|---|---|
| 26.10.2026 | 14.5 | 0.62 |

Im zusammengeführten Datenbestand `daten` steht jede Zeile der Kameradatei zusammen mit den Klimawerten desselben Tages.

**Hinweis zu pandas (Auszug aus einer englischen Dokumentation)**

> *Filtering a DataFrame: `people[people.city == 'Kiel']` returns all rows whose column `city` equals 'Kiel'. Several conditions are combined with `&` (and) or `|` (or); each condition is put in parentheses, for example `people[(people.age > 30) & (people.city == 'Kiel')]` or `people[(people.age > 30) | (people.city == 'Kiel')]`.*

**B1 (6 P):** Die Daten sollen nach dem Vorgehensmodell **CRISP-DM** aufbereitet werden. Im Diagramm sind sechs Felder kreisförmig um das Feld „Daten“ angeordnet: Feld A und Feld B sind durch Pfeile in beide Richtungen verbunden, von B führt ein Pfeil zu C, C und D sind durch Pfeile in beide Richtungen verbunden, von D führt ein Pfeil zu E; von E führt ein Pfeil zurück zu A und ein weiterer zu F. *Ordnen* Sie die sechs Phasen den Feldern zu und *tragen* Sie die Ziffern in die Tabelle *ein*.

1 Modeling · 2 Deployment · 3 Data Understanding · 4 Evaluation · 5 Business Understanding · 6 Data Preparation

| Feld | Ziffer der Phase |
|---|---|
| A | |
| B | |
| C | |
| D | |
| E | |
| F | |

**B2 (4 P):** Das folgende Python-Skript soll beide Dateien einlesen und passend zusammenführen. Es enthält **zwei** Fehler. *Nennen* Sie die Fehler und *korrigieren* Sie sie.

```python
# pandas importieren
import pandas as pd
# Kamera- und Klimadaten über das Datum verknüpfen und in daten speichern
daten = pd.merge(kamera_df, klima_df, on="datum", how="inner")
# Kameradaten einlesen und in kamera_df speichern
kamera_df = pd.read_csv("lager/kamera_2610.csv")
# Klimadaten einlesen und in klima_df speichern
klima_df = pd.read_csv("klima/2610.json")
```

**B3 (3 P):** Der Befehl `merge` der Bibliothek pandas entspricht einem JOIN in SQL. *Erklären* Sie das Konzept hinter einem JOIN.

**B4 (4 P):** *Formulieren* Sie anhand der Beispiele aus dem Hinweis einen Befehl, der aus dem DataFrame `daten` alle Bretter der Holzart Buche auflistet.

**B5 (4 P):** *Formulieren* Sie einen Befehl, der alle Bretter auflistet, deren Zustand gut ist **und** die keine Maßnahme benötigen.

**B6 (4 P):** *Formulieren* Sie einen Befehl, der alle Bretter auflistet, die manuell behandelt werden müssen **oder** von Pilz befallen sind.

## Block C – SQL: Holzchargen auswerten (28 P)

Die Daten der Holzchargen liegen in einer relationalen Datenbank. Jede Charge stammt von einem Lieferanten; zu jeder Charge werden Messwerte verschiedener Eigenschaften gespeichert, z. B. Holzfeuchte (in %), Rohdichte und Astanteil. Die **Qualitätsstufe** zwischen 0 und 10 steht in der Tabelle `charge`, nicht bei den Messwerten.

**Datenbankmodell (Ausschnitt)**

| Tabelle | Attribute |
|---|---|
| `lieferant` | `l_id` (PK), `l_name`, `l_ort`, `l_region` |
| `charge` | `c_id` (PK), `c_bezeichnung`, `c_jahr`, `c_qualitaet`, `c_lid` (FK → lieferant) |
| `eigenschaft` | `e_id` (PK), `e_name` |
| `messwert` | `eid` (PK, FK → eigenschaft), `cid` (PK, FK → charge), `wert` |
| `holzart` | `h_id` (PK), `h_name`, `h_typ` |
| `charge_holzart` | `cid` (PK, FK → charge), `hid` (PK, FK → holzart), `anteil` |

Beziehungen: lieferant 1 : n charge · charge 1 : n messwert · eigenschaft 1 : n messwert · charge 1 : n charge_holzart · holzart 1 : n charge_holzart.

**C1 (6 P):** *Formulieren* Sie eine SQL-Abfrage, die alle Chargen mit einer **Holzfeuchte unter 12** auflistet. Ausgegeben werden `c_bezeichnung`, `c_jahr`, `c_qualitaet` und `wert`. Die Chargen mit der niedrigsten Holzfeuchte stehen oben; bei gleicher Holzfeuchte steht die höhere Qualitätsstufe zuerst.

**C2 (7 P):** *Formulieren* Sie eine SQL-Abfrage, die für jede Region (`l_region`) die höchste, die niedrigste und die durchschnittliche Qualitätsstufe der Chargen ausgibt. Die Ergebnisspalten heißen `l_region`, `hoechste`, `niedrigste` und `durchschnitt`.

**C3 (7 P):** *Formulieren* Sie eine SQL-Abfrage, die je Lieferant (`l_name`) die Anzahl der Chargen mit einer Qualitätsstufe von **7 oder höher** ausgibt (Spalte `anzahl`). Es sollen nur Lieferanten mit **mehr als zwei** solchen Chargen erscheinen, der Lieferant mit den meisten guten Chargen zuerst.

**C4 (5 P):** *Formulieren* Sie eine SQL-Abfrage, die alle Chargen auflistet, die die **höchste in der Datenbank vorkommende** Qualitätsstufe erreichen. Ausgegeben werden `c_bezeichnung`, `c_jahr` und `c_qualitaet`.

**C5 (3 P):** Die Chargendaten des Lieferanten **Holzkontor Tams** wurden bei einem Angriff auf das Lieferantenportal manipuliert. *Formulieren* Sie eine SQL-Anweisung, die die Chargen dieses Lieferanten aus der Datenbank entfernt. Für die Detailtabellen ist eine Löschweitergabe eingerichtet.

## Block D – Cloud-Speicherung und Schutzbedarf (20 P)

Alle Messdaten des Holzlagers – von den Klimasensoren und vom Kamerawagen – liegen in der Cloud-Datenbank. Bilder und Messdaten werden mit KI-Werkzeugen ausgewertet, die ebenfalls in der Cloud laufen. So lässt sich etwa der beste Zeitpunkt für die Verarbeitung einer Charge bestimmen; Behandlungsmittel gegen Pilzbefall sollen nur noch gezielt eingesetzt werden.

**D1 (4 P):** *Nennen* Sie **zwei** Nachteile der Datenspeicherung in der Cloud und *erläutern* Sie jeden Nachteil in einem Satz.

**D2 (16 P):** *Ermitteln* Sie den Schutzbedarf (normal, hoch oder sehr hoch) für die folgenden Fälle und *begründen* Sie jede Einstufung – auch die vorgegebenen. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Betrachtetes System | Schutzziel | Schutzbedarf | Begründung |
|---|---|---|---|
| Datenbank in der Cloud | Verfügbarkeit | | |
| Datenbank in der Cloud | Integrität | sehr hoch | |
| Datenbank in der Cloud | Vertraulichkeit | | |
| KI-Auswertung in der Cloud | Verfügbarkeit | | |
| KI-Auswertung in der Cloud | Integrität | | |
| KI-Auswertung in der Cloud | Vertraulichkeit | normal | |

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich zeichne Trainingsdaten und Trenngeraden in ein Koordinatensystem und markiere Testdaten unterscheidbar.
- [ ] Ich zähle richtige und falsche Vorhersagen zweier Geraden und entscheide begründet zwischen ihnen.
- [ ] Ich berechne Funktionswert und Differenz für einen Messpunkt und leite daraus die Klasse ab.
- [ ] Ich bringe die Schritte eines Machine-Learning-Prozesses in eine sinnvolle Reihenfolge.
- [ ] Ich ordne die sechs Phasen von CRISP-DM dem Kreislauf zu.
- [ ] Ich finde Fehler in einem pandas-Skript und schreibe Filter mit einer und mehreren Bedingungen.
- [ ] Ich erkläre das Konzept des JOIN.
- [ ] Ich formuliere Abfragen mit JOIN über drei Tabellen, Aggregaten je Gruppe, HAVING und Unterabfrage sowie ein DELETE mit Unterabfrage.
- [ ] Ich nenne Nachteile der Cloud-Speicherung und stelle den Schutzbedarf je Schutzziel begründet fest.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
