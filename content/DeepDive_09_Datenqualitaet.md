# Deep Dive 9: Datenqualität sicherstellen
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Dieser Themenblock ist das **namensgebende Kernthema** deines Prüfungsbereichs „Sicherstellen der Datenqualität". Alles, was du in den Deep Dives 1 bis 8 gelernt hast, läuft hier zusammen: SQL-Prüfabfragen, Normalisierung als Fehlervermeidung, Statistik zur Auffälligkeitserkennung, ETL als Kontrollpunkt.

Typische Aufgaben: Qualitätsdimensionen benennen und auf einen Datenauszug anwenden, Kennzahlen berechnen, Probleme in einer Tabelle identifizieren, Validierungsregeln formulieren, präventive Maßnahmen vorschlagen und Verantwortlichkeiten festlegen.

**Der rote Faden dieser Einheit:** Fehler finden ist Handwerk – Fehler **verhindern** ist die Prüfungsleistung.

Szenario: **Möbelhaus Nordholz GmbH**.

---

# Teil 1 – Die Dimensionen der Datenqualität

Datenqualität ist kein einzelner Wert, sondern hat mehrere Aspekte. Man definiert sie als **Eignung der Daten für den vorgesehenen Verwendungszweck** – dieselben Daten können für eine Auswertung ausreichen und für eine andere unbrauchbar sein.

| Dimension | Frage | Prüfung | Beispiel für eine Verletzung |
|---|---|---|---|
| **Vollständigkeit** | Sind alle erforderlichen Werte vorhanden? | Anteil NULL/Leerwerte je Feld | 30 % der Kunden ohne E-Mail |
| **Korrektheit** | Stimmen die Werte mit der Realität überein? | Abgleich mit Referenzquelle, Stichprobe | falscher Firmenname |
| **Konsistenz** | Widersprechen sich Werte innerhalb oder zwischen Systemen? | Kreuzvergleiche | Lieferdatum vor Bestelldatum |
| **Eindeutigkeit** | Existiert jede Realweltentität genau einmal? | DISTINCT-Vergleich, Dublettensuche | Kunde doppelt angelegt |
| **Aktualität** | Sind die Werte hinreichend jung? | Alter des letzten Änderungsdatums | Adresse seit fünf Jahren nicht gepflegt |
| **Genauigkeit** | Ist die Detailtiefe ausreichend? | Nachkommastellen, Messauflösung | Dauer nur in Tagen statt Stunden |
| **Gültigkeit / Konformität** | Entsprechen die Werte den Formatregeln? | Muster-, Wertebereichsprüfung | PLZ mit vier Stellen |
| **Relevanz** | Werden die richtigen Merkmale erhoben? | fachlicher Abgleich | Merkmal fehlt für die Fragestellung |

**Prüfungstaktik:** Fünf Dimensionen mit je einer Prüf- **und** einer Sicherungsmaßnahme sicher parat haben. Die Aufgabe lautet fast immer „nennen und erläutern Sie" – reine Aufzählungen bekommen nur die halbe Punktzahl.

**Wichtige Abgrenzung:** *Gültig* ist nicht dasselbe wie *korrekt*. Eine Postleitzahl mit fünf Ziffern ist formal gültig – sie kann trotzdem falsch sein. Formatprüfungen fangen nur einen Teil der Fehler.

*Begriffsfalle Genauigkeit:* Im Englischen heißt die Übereinstimmung mit der Realität *accuracy* (in deutschen Quellen oft ebenfalls „Genauigkeit“ oder „Richtigkeit“ übersetzt), die Detailtiefe dagegen *precision*. In diesem Lernzettel steht Genauigkeit für die Detailtiefe (*precision*), Korrektheit für *accuracy*. In der Prüfung die gemeinte Bedeutung immer kurz mit erläutern.

Bekannte Referenzmodelle (zum Zitieren, nicht zum Auswendiglernen jeder Einzeldimension):
- **DGIQ-Modell:** Die Deutsche Gesellschaft für Informations- und Datenqualität nutzt 15 IQ-Dimensionen in vier Kategorien, abgeleitet aus der Studie von Wang und Strong (MIT, 1996): *systemunterstützt* (Zugänglichkeit, Bearbeitbarkeit), *inhärent* (hohes Ansehen, Fehlerfreiheit, Objektivität, Glaubwürdigkeit), *darstellungsbezogen* (Verständlichkeit, Übersichtlichkeit, einheitliche Darstellung, eindeutige Auslegbarkeit) und *zweckabhängig* (Aktualität, Wertschöpfung, Vollständigkeit, angemessener Umfang, Relevanz).
- **ISO/IEC 25012:** Datenqualitätsmodell der ISO-25000-Reihe (SQuaRE) mit ebenfalls 15 Merkmalen, getrennt nach *inhärent* (etwa Korrektheit, Vollständigkeit, Konsistenz, Glaubwürdigkeit, Aktualität) und *systemabhängig* (etwa Verfügbarkeit, Portabilität, Wiederherstellbarkeit); einige Merkmale wie Zugänglichkeit oder Vertraulichkeit gehören zu beiden Sichten.
- **ISO 8000:** Normenreihe zu Datenqualität und Stammdaten (unter anderem Datenqualitätsmanagement und Austausch von Stammdaten).
- **DAMA-DMBOK:** Leitfaden der Data Management Association zum gesamten Datenmanagement; Datenqualität ist dort eines von mehreren Wissensgebieten neben Data Governance und Stammdatenmanagement.

---

# Teil 2 – Data Profiling: Probleme finden

**Data Profiling** ist die systematische Untersuchung eines Datenbestands, **bevor** man ihn verwendet. Drei Ebenen:

## 2.1 Spaltenanalyse (Column Profiling)

Je Spalte werden erhoben: Anzahl und Anteil der NULL-Werte, Anzahl verschiedener Werte, Minimum und Maximum, Mittelwert und Median, Häufigkeitsverteilung, typische Muster und Feldlängen.

```sql
-- Vollständigkeit je Spalte
SELECT COUNT(*) AS gesamt,
       COUNT(*) - COUNT(email) AS fehlende_email,
       ROUND(COUNT(email) * 100.0 / COUNT(*), 2) AS vollstaendigkeit_prozent
FROM kunde;

-- Wertebereich prüfen (Min/Max über ALLE Sätze, Zählung nur der unplausiblen)
SELECT MIN(umsatz), MAX(umsatz),
       SUM(CASE WHEN umsatz <= 0 THEN 1 ELSE 0 END) AS unplausibel
FROM bestellung;
```

*Achtung:* Stünde `WHERE umsatz <= 0` in der Abfrage, würden auch MIN und MAX nur noch über die unplausiblen Sätze gebildet – der Wertebereich des Gesamtbestands wäre nicht mehr sichtbar.

**Was dabei typischerweise auffällt:**
- Auffällige Häufungen einzelner Werte → **Platzhalter** (01.01.1900, „unbekannt", „xxx", 0, 99999)
- Sehr viele verschiedene Werte in einem Kategoriefeld → uneinheitliche Freitexteingaben
- Nur wenige verschiedene Werte in einem Schlüsselfeld → das Feld identifiziert nicht eindeutig
- Extreme Minima/Maxima → Erfassungsfehler (Komma verrutscht, Einheit verwechselt)
- Falscher Datentyp → PLZ, Telefonnummern oder Artikelnummern als Zahl gespeichert: führende Nullen gehen verloren („04109“ wird zu 4109). Solche Schlüssel immer als Text speichern.

## 2.2 Spaltenübergreifende Analyse

Beziehungen **innerhalb** eines Datensatzes prüfen: Enddatum nach Startdatum? Rechnungsbetrag = Menge × Preis? Lieferdatum nach Bestelldatum? Diese Regeln decken Fehler auf, die jede einzelne Spalte für sich unauffällig lässt.

## 2.3 Tabellenübergreifende Analyse

Beziehungen **zwischen** Tabellen prüfen – vor allem die **referenzielle Integrität**:

```sql
-- Verwaiste Datensätze: Bestellung ohne existierenden Kunden
SELECT b.bestell_id
FROM bestellung b
LEFT JOIN kunde k ON b.kunden_id = k.kunden_id
WHERE k.kunden_id IS NULL;

-- Dubletten aufspüren
SELECT email, COUNT(*) AS anzahl
FROM kunde
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;
```

*Falle:* GROUP BY fasst alle NULL-Werte zu **einer** Gruppe zusammen. Ohne `WHERE email IS NOT NULL` erscheinen alle Kunden ohne E-Mail als vermeintliche Dublette (in der Anlage der Übungsklausur: drei Sätze).

---

# Teil 3 – Datenqualitätskennzahlen

Ohne Messung keine Steuerung. Die Grundform ist immer gleich:

**Qualitätsgrad:** $\text{Qualitätsgrad} = \dfrac{\text{korrekte Datensätze}}{\text{geprüfte Datensätze}} \cdot 100$

| Kennzahl | Formel |
|---|---|
| Vollständigkeitsgrad (Feld) | gefüllte Werte / alle Datensätze · 100 |
| Vollständigkeitsgrad (Datenbestand) | gefüllte Zellen / alle Pflichtzellen · 100 |
| Eindeutigkeitsgrad | eindeutige Entitäten / Datensätze · 100 |
| Gültigkeitsgrad | formatkonforme Werte / geprüfte Werte · 100 |
| Fehlerquote | fehlerhafte Sätze / geprüfte Sätze · 100 |

**Zwei Regeln für die Prüfung:**
1. **Bezugsgröße immer angeben.** „95 % Vollständigkeit" ist ohne die Angabe, ob je Feld oder über alle Zellen gerechnet wurde, wertlos – und die beiden Werte unterscheiden sich stark.
2. **Schwellenwerte und Verantwortliche definieren.** Eine Kennzahl ohne Zielwert und ohne Zuständigkeit löst nichts aus. Beispiel: „Vollständigkeit E-Mail ≥ 90 %, Verantwortung Vertriebsleitung, monatliche Messung."

**Kosten schlechter Datenqualität – die 1-10-100-Regel** (nach Labovitz und Chang, 1992; eine Faustregel, keine exakte Messung): Einen Fehler bei der Erfassung zu vermeiden kostet etwa 1 Einheit, ihn später zu korrigieren etwa 10, und ihn unentdeckt zu lassen etwa 100 (Fehlentscheidung, Fehllieferung, Imageschaden). Diese Regel ist die beste Begründung für **präventive** Maßnahmen – ein starkes Argument im Fachgespräch.

---

# Teil 4 – Probleme beheben: Data Cleansing

## 4.1 Fehlende Werte

| Strategie | Wann geeignet | Nachteil |
|---|---|---|
| Datensatz löschen | wenige Fälle, zufällig verteilt | Informationsverlust, Verzerrung wenn nicht zufällig |
| Mittelwert/Median einsetzen | metrische Felder, wenige Fälle | verringert die Streuung künstlich |
| Modus einsetzen | kategoriale Felder | verstärkt die häufigste Kategorie |
| Eigene Kategorie „unbekannt" | kategoriale Felder | zusätzliche Ausprägung |
| Fachlich nachrecherchieren | wichtige Felder, kleine Menge | aufwendig, aber am korrektesten |

**Wichtig:** Fehlt ein Wert **nicht zufällig** (etwa weil ein bestimmter Spediteur die Lieferdauer nie meldet), verzerrt jede Ersetzung das Ergebnis. Dann ist die Ursache zu klären, nicht die Lücke zu füllen.

**Fehlmechanismen nach Rubin** – sie entscheiden, welche Strategie zulässig ist:

| Mechanismus | Bedeutung | Beispiel | Folge |
|---|---|---|---|
| **MCAR** (Missing Completely at Random) | Fehlen hängt weder von beobachteten noch vom fehlenden Wert selbst ab | Erfassungsformular bei einem zufälligen Systemabsturz verloren | Löschen verzerrt nicht, kostet nur Fallzahl |
| **MAR** (Missing at Random) | Fehlen hängt nur von **anderen, beobachteten** Merkmalen ab | ein bestimmter Spediteur meldet nie (Spediteur ist bekannt) | Gesamtmittelwert verzerrt; Ersetzen nur innerhalb der Gruppe oder per Modell |
| **MNAR** (Missing Not at Random) | Fehlen hängt vom **fehlenden Wert selbst** ab | lange Lieferdauern werden bewusst nicht gemeldet | jede einfache Ersetzung verzerrt; Ursache klären, Sensitivitätsanalyse |

Weitere Imputationsverfahren über Mittelwert, Median und Modus hinaus: Gruppenmittelwert (z. B. je Spediteur), Regressionsimputation, Hot-Deck bzw. k-Nächste-Nachbarn (Wert eines ähnlichen Datensatzes übernehmen) und multiple Imputation. Ersetzte Werte immer **kennzeichnen** (Zusatzspalte „imputiert ja/nein“), damit sie sich später herausrechnen lassen.

## 4.2 Dubletten

Exakte Dubletten sind trivial zu finden. Das Problem sind **unscharfe Dubletten**: „Braun GmbH" und „Braun G.m.b.H.", „Müller" und „Mueller", Adressen mit „Str." und „Straße".

Vorgehen:
1. **Normalisieren:** Groß-/Kleinschreibung vereinheitlichen, Rechtsformzusätze und Sonderzeichen entfernen, Umlaute umschreiben
2. **Vergleichen:** über mehrere Felder gleichzeitig (Name + PLZ + Geburtsdatum), mit Ähnlichkeitsmaßen (Levenshtein-Distanz) oder phonetischen Verfahren (Kölner Phonetik, Soundex)
3. **Zusammenführen** zu einem **Golden Record**: dem führenden, bereinigten Datensatz je Realweltentität – dabei je Feld entscheiden, welche Quelle Vorrang hat
4. **Prävention:** Dublettenprüfung bereits bei der Neuanlage

Beispiele für die Ähnlichkeitsmaße: Die **Levenshtein-Distanz** zählt die minimalen Einfüge-, Lösch- und Ersetzungsoperationen – „Müller“ → „Mueller“ = 2 (ü durch u ersetzen, e einfügen), „Braun GmbH“ → „Braun G.m.b.H.“ = 4 (vier Punkte einfügen). Nach dem Normalisieren (Punkte entfernen) ist die Distanz 0. Die **Kölner Phonetik** kodiert den Klang: „Meier“, „Mayer“ und „Maier“ ergeben alle den Code 67, „Müller“ und „Mueller“ den Code 657.

Im größeren Maßstab heißt der Abgleich **Record Linkage**: Damit nicht jeder Satz mit jedem verglichen werden muss, bildet man zunächst Blöcke (**Blocking**, z. B. nur Sätze mit gleicher PLZ vergleichen). Je Kandidatenpaar wird ein Ähnlichkeitswert berechnet und mit zwei Schwellen eingeordnet: oberhalb der oberen Schwelle automatisch zusammenführen (Match), unterhalb der unteren verwerfen (Non-Match), dazwischen manuelle Prüfung (Prüffall).

## 4.3 Ausreißer und unplausible Werte

Vorgehen wie in Deep Dive 3: Ursache klären, Entscheidung dokumentieren, Auswirkung prüfen. **Niemals ungeprüft löschen** – ein echter Extremwert kann genau der interessante Fall sein.

Erkennung: statistisch mit der 1,5-IQR-Regel (robust, auch bei schiefen Verteilungen) oder dem z-Wert (Betrag über 3, nur bei annähernd normalverteilten Größen), fachlich mit Plausibilitätsregeln (Umsatz nicht negativ, Geburtsdatum nicht in der Zukunft). Statistisch auffällig heißt nicht falsch – und ein fachlich unmöglicher Wert (negatives Alter) ist auch dann ein Fehler, wenn er statistisch unauffällig ist.

---

# Teil 5 – Prävention: Fehler gar nicht erst entstehen lassen

Hier liegt der Unterschied zwischen einer befriedigenden und einer sehr guten Prüfungsantwort. Fehler zu bereinigen ist Symptombehandlung; wer nur bereinigt, bereinigt jeden Monat erneut.

## 5.1 Technische Maßnahmen

| Maßnahme | Wirkung |
|---|---|
| **Pflichtfelder (NOT NULL)** | erzwingt Vollständigkeit bei der Erfassung |
| **Wertebereichsprüfung (CHECK)** | `CHECK (umsatz >= 0)`, `CHECK (geburtsdatum < CURRENT_DATE)` |
| **Formatprüfung** | Muster für PLZ, E-Mail, IBAN; Prüfziffernverfahren (IBAN: Modulo 97, EAN/GTIN: Modulo 10 mit Gewichtung 1 und 3) |
| **Auswahllisten statt Freitext** | verhindert uneinheitliche Schreibweisen |
| **Referenzielle Integrität (FOREIGN KEY)** | verhindert verwaiste Datensätze |
| **UNIQUE-Constraint** | verhindert exakte Dubletten im Schlüsselfeld – unscharfe Dubletten („Braun GmbH“ / „Braun G.m.b.H.“) erkennt er nicht |
| **Normalisierung (3. NF)** | verhindert Änderungsanomalien und damit Inkonsistenz |
| **Plausibilitätsprüfung** | feldübergreifend: Enddatum nach Startdatum |
| **Automatische Übernahme** | keine Mehrfacherfassung derselben Daten über Systemgrenzen |

*Hinweis zum DBMS:* Eine CHECK-Bedingung mit CURRENT_DATE ist nicht überall erlaubt – MySQL und Oracle lassen in CHECK-Constraints keine nicht-deterministischen Funktionen zu. Dort prüft man „Datum nicht in der Zukunft“ per Trigger oder in der Erfassungsanwendung.

## 5.2 Organisatorische Maßnahmen (Data Governance)

- **Data Owner:** fachlich verantwortlich für einen Datenbereich, entscheidet über Regeln und Freigaben
- **Data Steward:** operativ zuständig für Pflege, Prüfung und Bereinigung
- **Verbindliche Erfassungsrichtlinien** und Schulung der erfassenden Personen
- **Regelmäßige Qualitätsmessung** mit Schwellenwerten und Berichtsweg
- **Master Data Management:** ein führendes System je Stammdatenart, statt paralleler Pflege in mehreren Systemen
- **Vier-Augen-Prinzip** an kritischen Stellen
- **Datenqualitätskreislauf** statt Einmalaktion: Definieren (Regeln, Zielwerte) → Messen → Analysieren (Ursachen) → Verbessern (Bereinigen und Prävention) → erneut messen; bekannt als TDQM-Zyklus (Total Data Quality Management, MIT), angelehnt an den PDCA-Zyklus

> ❓ **Prüferfrage:** Sie haben 2.400 Dubletten bereinigt. Warum ist das allein keine ausreichende Antwort auf die Aufgabe „Datenqualität sicherstellen"?
> *Weil die Bereinigung nur den Ist-Bestand korrigiert, nicht die Ursache. Ohne Dublettenprüfung bei der Neuanlage, ohne UNIQUE-Constraint und ohne definierte Zuständigkeit entstehen dieselben Dubletten weiter. „Sicherstellen" verlangt präventive und organisatorische Maßnahmen samt laufender Messung – die Bereinigung ist nur der Ausgangspunkt.*

## 5.3 Datenqualität im ETL-Prozess

Der ETL-Lauf (→ Deep Dive 8) ist der zentrale Kontrollpunkt: Regelwerk anwenden, fehlerhafte Sätze in **Quarantäne** ausleiten statt zu verwerfen, Fehlerprotokoll mit Verantwortlichem führen, Abstimmsummen gegen die Quelle bilden und Kennzahlen je Lauf protokollieren.

## 5.4 Master Data Management (Stammdatenmanagement)

**Stammdaten** (Kunden, Artikel, Lieferanten) sind langlebig und werden von vielen Prozessen genutzt; **Bewegungsdaten** (Bestellungen, Buchungen) entstehen laufend und verweisen auf Stammdaten. Ein Fehler im Kundenstamm wirkt deshalb in jede Bestellung, Rechnung und Auswertung hinein – Stammdatenqualität hat die größte Hebelwirkung.

**Master Data Management** umfasst Prozesse, Rollen und Systeme, die für jede Stammdatenart eine einheitliche, abgestimmte Version (**Golden Record**) bereitstellen. Typische Architekturstile:

| Stil | Prinzip |
|---|---|
| Registry | Stammdaten bleiben in den Quellsystemen; ein zentrales Verzeichnis verknüpft nur die Schlüssel |
| Consolidation | Quellsysteme pflegen weiter, ein Hub führt die Daten zum Golden Record zusammen (meist für Analysen) |
| Coexistence | wie Consolidation, aber der Golden Record wird in die Quellsysteme zurückgespielt |
| Centralized (Transaction) | Anlage und Pflege nur noch im zentralen MDM-System, die übrigen Systeme beziehen die Daten von dort |

Für die Prüfung genügt der Kern: ein **führendes System** je Stammdatenart, klare Zuständigkeit (Data Owner/Steward) und Dublettenprüfung bei der Neuanlage.

> ❓ **Prüferfrage:** Sie haben auf das Feld E-Mail einen UNIQUE-Constraint gelegt. Ist das Dublettenproblem damit gelöst?
> *Nein. UNIQUE verhindert nur exakt gleiche Werte. „Braun GmbH“ mit einer zweiten, abweichenden E-Mail-Adresse oder Kunden ganz ohne E-Mail (NULL ist in den meisten DBMS mehrfach erlaubt) rutschen durch. Nötig sind zusätzlich eine unscharfe Dublettenprüfung bei der Neuanlage (Normalisierung, Mehrfeldvergleich, Ähnlichkeitsmaß) und ein führendes Stammdatensystem.*

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Dimensionen nur aufgezählt, ohne Prüf- und Sicherungsmaßnahme zu nennen.
2. Nur Bereinigung vorgeschlagen, keine Prävention.
3. Kennzahl ohne Bezugsgröße angegeben.
4. Kennzahl ohne Schwellenwert und ohne Verantwortlichen definiert.
5. Fehlende Werte automatisch durch den Mittelwert ersetzt, ohne die Ursache zu prüfen.
6. Platzhalterwerte (0, 01.01.1900) als echte Werte in die Auswertung übernommen.
7. Gültigkeit und Korrektheit gleichgesetzt.
8. Keine Zuständigkeit benannt – Datenqualität als reines IT-Thema behandelt.

---

# Übungsklausur Datenqualität (100 Punkte, 90 Minuten)

Bearbeite die Klausur **am Ende des Themas** am Stück, handschriftlich, mit Taschenrechner. Alle Aufgaben beziehen sich auf die Ausgangssituation und die Anlage; halte dich an die geforderte Anzahl der Nennungen.

## Ausgangssituation

Die **Möbelhaus Nordholz GmbH** führt die Kundendaten aus Onlineshop, Filialkassen und Objektgeschäft in einem neuen **CRM-System** zusammen. Beim ersten Newsletter nach einer Testmigration kamen fast ein Drittel der E-Mails als unzustellbar zurück, und der Vertrieb meldet doppelte Kunden mit doppelt gezählten Umsätzen. Sie arbeiten im Team Datenmanagement der IT-Abteilung und sollen die Datenqualität vor der endgültigen Migration sicherstellen.

## Anlage – Auszug aus der Kundentabelle (10 Datensätze)

| Nr | kunden_id | name | email | plz | geburtsdatum | umsatz |
|---|---|---|---|---|---|---|
| 1 | K-1001 | Huber GmbH | info@huber.de | 80331 | 15.03.1985 | 1.250,00 |
| 2 | K-1002 | Schmidt AG | *(leer)* | 20095 | 22.07.1979 | 890,50 |
| 3 | K-1003 | Fischer KG | kontakt@fischer.de | 8033 | 01.01.1900 | 2.100,00 |
| 4 | K-1004 | Weber e.K. | weber@mail | 50667 | 30.11.1990 | −450,00 |
| 5 | K-1005 | Braun GmbH | braun@braun.de | 20095 | 05.05.1988 | 3.200,00 |
| 6 | K-1006 | Huber GmbH | info@huber.de | 80331 | 15.03.1985 | 1.250,00 |
| 7 | K-1007 | Meyer OHG | *(leer)* | 10115 | 01.01.1900 | 760,00 |
| 8 | K-1008 | Braun G.m.b.H. | braun@braun.de | 20095 | 05.05.1988 | 3.200,00 |
| 9 | K-1009 | Klein AG | klein@klein.de | 04109 | 12.02.2035 | 1.500,00 |
| 10 | K-1010 | Roth KG | *(leer)* | 70173 | 28.08.1975 | 980,00 |

## Block A – Dimensionen (20 P)

Die Geschäftsleitung will eine **Datenqualitätsrichtlinie** für das CRM verabschieden. Sie sollen dafür die Grundlagen liefern.

**A1 (15 P):** *Nennen* Sie **fünf** Dimensionen der Datenqualität. *Erläutern* Sie je Dimension kurz die Bedeutung und *nennen* Sie je eine Maßnahme zur Sicherstellung. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Dimension | Bedeutung | Maßnahme zur Sicherstellung |
|---|---|---|
| | | |
| | | |
| | | |
| | | |
| | | |

**A2 (5 P):** *Erläutern* Sie den Unterschied zwischen **Gültigkeit** und **Korrektheit** und *belegen* Sie ihn mit einem Beispiel aus der Anlage.

## Block B – Probleme identifizieren (24 P)

Aus dem Altsystem liegt ein Auszug von zehn Datensätzen vor (**Anlage**). Er soll stellvertretend für den Gesamtbestand von rund 48.000 Kunden untersucht werden.

**B1 (18 P):** *Analysieren* Sie die Anlage. *Benennen* Sie **sechs** Datenqualitätsprobleme. *Geben* Sie jeweils die betroffene Datensatznummer, die verletzte Dimension und die Konsequenz für eine Auswertung an.

**B2 (6 P):** Datensatz 3 und 7 enthalten das Geburtsdatum 01.01.1900. *Erläutern* Sie, welche Ursache typischerweise dahintersteckt und warum dieser Wert gefährlicher ist als ein leeres Feld.

## Block C – Kennzahlen berechnen (20 P)

Für den Bericht an die Geschäftsleitung soll die Datenqualität vor und nach der Bereinigung **messbar** gemacht werden.

**C1 (12 P):** *Berechnen* Sie für die Anlage: (a) Vollständigkeitsgrad des Feldes E-Mail, (b) Eindeutigkeitsgrad der Kunden, (c) Gültigkeitsgrad des Feldes PLZ, (d) Anteil plausibler Geburtsdaten. *Geben* Sie jeweils den Rechenweg an.

> **Formeln:**
> - Vollständigkeitsgrad = gefüllte Felder / alle Felder · 100 %
> - Eindeutigkeitsgrad = eindeutige Kunden / alle Datensätze · 100 %
> - Gültigkeitsgrad = gültige Werte / alle Werte · 100 %
> - Anteil plausibler Werte = plausible Werte / alle Werte · 100 %

**C2 (4 P):** Für sechs Pflichtfelder mit insgesamt 60 Zellen sind drei Zellen leer. *Berechnen* Sie den Vollständigkeitsgrad des Datenbestands und *erläutern* Sie, warum dieser Wert deutlich günstiger aussieht als das Ergebnis aus C1 (a).

> **Formel:** Vollständigkeitsgrad = gefüllte Zellen / alle Pflichtzellen · 100 %

**C3 (4 P):** *Formulieren* Sie für das Feld E-Mail eine vollständige Datenqualitätskennzahl mit Zielwert, Messintervall und Verantwortlichkeit.

## Block D – Bereinigen (18 P)

Vor der Übernahme ins CRM werden die Daten bereinigt. Parallel liefert die Logistik einen Auftragsbestand mit Lieferdauern für eine Auswertung der Speditionen.

**D1 (8 P):** *Beschreiben* Sie das Vorgehen zur Erkennung und Behandlung der Dubletten in der Anlage. *Gehen* Sie auf exakte und unscharfe Dubletten getrennt *ein* und *erläutern* Sie den Begriff **Golden Record**.

**D2 (6 P):** Im Bestand der Logistik fehlen 12 % der Lieferdauern. *Nennen* Sie **drei** Strategien im Umgang mit fehlenden Werten und *bewerten* Sie je einen Vor- und einen Nachteil. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Strategie | Vorteil | Nachteil |
|---|---|---|
| | | |
| | | |
| | | |

**D3 (4 P):** Bei der Prüfung fällt auf, dass die fehlenden Lieferdauern **ausschließlich** Aufträge eines bestimmten Spediteurs betreffen. *Beurteilen* Sie, ob ein Ersetzen durch den Mittelwert hier vertretbar ist.

## Block E – Prävention und Verantwortung (18 P)

Damit die Fehler nach der Migration nicht wiederkehren, sollen technische Prüfungen im CRM und klare Zuständigkeiten festgelegt werden.

**E1 (10 P):** *Nennen* Sie **fünf** technische Maßnahmen, mit denen die in der Anlage gefundenen Fehler künftig verhindert werden. *Ordnen* Sie jeder Maßnahme das konkrete Problem aus der Anlage *zu*. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Maßnahme | Verhindert |
|---|---|
| | |
| | |
| | |
| | |
| | |

**E2 (4 P):** *Erläutern* Sie die Rollen **Data Owner** und **Data Steward** und *grenzen* Sie sie voneinander ab.

**E3 (4 P):** Die Geschäftsführung fragt, warum in Prävention investiert werden soll, „wo man die Daten doch einmal im Jahr bereinigen kann". *Argumentieren* Sie mit der 1-10-100-Regel.

---

## Fachgespräch: typische Fragen des Ausschusses

1. „Wie haben Sie die Qualität Ihrer Datenbasis geprüft – und was haben Sie dabei gefunden?"
2. „Welche Datenqualitätsprobleme haben Sie bereinigt, und welche haben Sie bewusst stehen lassen? *Begründen* Sie beides."
3. „Wie stellen Sie sicher, dass dieselben Fehler nicht wieder entstehen?"
4. „Wer ist in Ihrem Betrieb für die Qualität dieser Daten verantwortlich?"
5. „Wie hätte sich ein unentdecktes Datenqualitätsproblem auf Ihr Analyseergebnis ausgewirkt?"
6. „Welche Datenqualitätskennzahl würden Sie dauerhaft überwachen – und ab welchem Wert müsste jemand eingreifen?"

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich nenne fünf Dimensionen mit je einer Prüf- und einer Sicherungsmaßnahme.
- [ ] Ich unterscheide Gültigkeit und Korrektheit an einem Beispiel.
- [ ] Ich finde in einem Datenauszug systematisch Probleme und ordne sie Dimensionen zu.
- [ ] Ich berechne Qualitätskennzahlen und gebe immer die Bezugsgröße an.
- [ ] Ich formuliere eine Kennzahl vollständig – mit Zielwert, Intervall und Verantwortlichem.
- [ ] Ich beschreibe Dublettenerkennung inklusive unscharfer Fälle und Golden Record.
- [ ] Ich kenne die Strategien bei fehlenden Werten und erkenne nicht zufällige Lücken.
- [ ] Ich nenne zu jedem Problem eine **präventive** Maßnahme, nicht nur eine Bereinigung.
- [ ] Ich erkläre Data Owner, Data Steward und die 1-10-100-Regel.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
- [ ] Ich unterscheide MCAR, MAR und MNAR und leite daraus ab, ob Löschen oder Ersetzen zulässig ist.
