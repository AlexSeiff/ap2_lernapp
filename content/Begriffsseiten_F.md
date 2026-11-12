<!-- Begriffsseiten F · Stand 2026-10 -->
## F1-Maß
<!-- id: f1-mass · quellen: Karte DD7, DD7 2.2, DD7 2.3 · stand: 2026-10 -->

Harmonisches Mittel aus Precision und Recall: $F_1 = \frac{2 \cdot P \cdot R}{P + R}$.

### Erklärung
Das F1-Maß fasst die beiden gegenläufigen Kennzahlen eines Klassifikationsmodells in einer Zahl zusammen. Weil es das harmonische und nicht das arithmetische Mittel ist, liegt es immer näher am kleineren der beiden Werte: Ein Modell mit sehr hoher Precision, aber kaum Recall bekommt ein schlechtes F1. Es eignet sich besonders bei **unausgeglichenen Klassen**, wo die Accuracy täuscht. Die richtig negativen Fälle (TN) gehen nicht ein.

### Beispiel
Reklamationsmodell im Möbelhaus: TP = 60, FP = 90, FN = 40. Precision $= \frac{60}{150} = 0{,}40$, Recall $= \frac{60}{100} = 0{,}60$.
$F_1 = \frac{2 \cdot 0{,}40 \cdot 0{,}60}{0{,}40 + 0{,}60} = \frac{0{,}48}{1{,}00} = 48\ \%$

### Prüfungsfalle
Wer $(P + R) / 2$ rechnet, bekommt das arithmetische Mittel: Bei P = 0,6 und R = 0,9 wären das 75 % statt richtig 72 %.

### Merksatz
F1 ist nur gut, wenn Precision **und** Recall gut sind.

Siehe auch: Precision · Recall · Konfusionsmatrix · Accuracy · Unausgeglichene Klassen
Mehr: Deep Dive 7, 2.2 · Deep Dive 7, 2.3

## Fachgespräch
<!-- id: fachgesprach · quellen: DD1 Prüfungsrelevanz, DD2 Prüfungsrelevanz · stand: 2026-10 -->

Mündlicher Prüfungsteil der AP2, in dem der Prüfungsausschuss nach der Präsentation die betriebliche Projektarbeit und das zugehörige Fachwissen hinterfragt.

### Erklärung
Für Fachinformatiker/-innen Daten- und Prozessanalyse gehört das Fachgespräch zum Prüfungsbereich „Planen und Durchführen eines Projektes der Datenanalyse“ (50 % der Gesamtnote). Nach § 28 FIAusbV dauern Präsentation und Fachgespräch zusammen höchstens 30 Minuten, die Präsentation höchstens 15 Minuten. Der Ausschuss fragt, **warum** du etwas so gemacht hast: Entscheidungen begründen, Alternativen abwägen, Risiken benennen. Häufige Themen aus den Deep Dives: Wahl von INNER oder LEFT JOIN, Normalform des Projektdatenmodells, Prüfung der Ergebnisrichtigkeit, Datenschutz und Rechtevergabe.

### Beispiel
„Ihr Data Mart ist denormalisiert – widerspricht das nicht der 3. NF?“ Erwartet wird: OLTP und OLAP haben verschiedene Ziele; das Star-Schema ist für Lesezugriffe bewusst redundant.

### Prüfungsfalle
Nur beschreiben, was gemacht wurde, statt die Entscheidung zu begründen und Alternativen zu nennen.

### Merksatz
Im Fachgespräch zählt das Warum, nicht das Was.

Siehe auch: Prüfungsausschuss · Projekt · Denormalisierung · Referenzielle Integrität
Mehr: Deep Dive 1, Prüfungsrelevanz · Deep Dive 2, Prüfungsrelevanz

## Faktentabelle
<!-- id: faktentabelle · quellen: Karte DD8, DD8 4.1 · stand: 2026-10 -->

Zentrale Tabelle eines Star- oder Snowflake-Schemas mit messbaren Kennzahlen (Menge, Umsatz) und Fremdschlüsseln zu den Dimensionstabellen.

### Erklärung
Die Faktentabelle hält die Zahlen, die ausgewertet werden; die Dimensionstabellen liefern die Merkmale, nach denen ausgewertet wird (Wer? Was? Wann? Wo?). Sie ist mit Abstand die größte Tabelle, oft Millionen Zeilen. Vor dem Entwurf wird ihre **Granularität** festgelegt, z. B. eine Zeile je Bestellposition. Kennzahlen sind additiv (Umsatz), semi-additiv (Lagerbestand: nicht über die Zeit summieren) oder nicht-additiv (Prozentsätze). Nach Kimball gibt es Transaktions-Faktentabellen, periodische Snapshots und akkumulierende Snapshots.

### Beispiel
`fakt_verkauf(zeit_id, produkt_id, kunde_id, filial_id, menge, umsatz)` – die vier ids verweisen auf `dim_zeit`, `dim_produkt`, `dim_kunde` und `dim_filiale`.

### Abgrenzung
Die Dimensionstabelle beschreibt (Produktname, Kategorie), die Faktentabelle misst (Menge, Umsatz). Eine Durchschnittsmarge gehört nicht als summierbare Kennzahl hinein, sondern wird aus Summen neu berechnet.

### Merksatz
Fakten messen, Dimensionen beschreiben.

Siehe auch: Dimensionstabelle · Star-Schema · Granularität · Kennzahlentypen · Arten von Faktentabellen
Mehr: Deep Dive 8, 4.1

## Falsch negativ
<!-- id: falsch-negativ · quellen: Karte DD7, DD7 2.1 · stand: 2026-10 -->

FN (Fehler 2. Art): Ein tatsächlich positiver Fall wird als negativ vorhergesagt – ein übersehener Fall.

### Erklärung
In der Konfusionsmatrix steht FN in der Zeile „tatsächlich positiv“ und der Spalte „Vorhersage negativ“. Der erste Buchstabe sagt, ob die Vorhersage stimmt (F = falsch), der zweite, was vorhergesagt wurde (N = negativ). FN senkt den **Recall** = TP / (TP + FN). Welche Klasse „positiv“ ist, muss vorher festgelegt werden – meist das seltene, interessierende Ereignis.

### Beispiel
Positive Klasse „Reklamation“: 100 Aufträge wurden reklamiert, das Modell hat 40 davon nicht erkannt → FN = 40, Recall = 60 %. Kostet ein übersehener Fall 120 €, entstehen 4.800 € Fehlerkosten.

### Abgrenzung
Falsch positiv ist der Fehlalarm (Fehler 1. Art). Welcher Fehler schwerer wiegt, entscheidet der fachliche Schaden: beim Screening der FN, beim Spamfilter der FP.

### Prüfungsfalle
„Falsch negativ“ als „tatsächlich negativ“ lesen – gemeint ist ein positiver Fall, der fälschlich als negativ eingestuft wurde.

### Merksatz
FN = übersehen.

Siehe auch: Falsch positiv · Recall · Konfusionsmatrix · Richtig positiv
Mehr: Deep Dive 7, 2.1 · Deep Dive 7, 2.4

## Falsch positiv
<!-- id: falsch-positiv · quellen: Karte DD7, DD7 2.1 · stand: 2026-10 -->

FP (Fehler 1. Art): Ein tatsächlich negativer Fall wird als positiv vorhergesagt – ein Fehlalarm.

### Erklärung
FP steht in der Konfusionsmatrix in der Zeile „tatsächlich negativ“ und der Spalte „Vorhersage positiv“. Fehlalarme senken die **Precision** = TP / (TP + FP) und erhöhen die Falsch-Positiv-Rate. Senkt man die Entscheidungsschwelle, findet das Modell mehr echte Fälle, erzeugt aber meist auch mehr FP.

### Beispiel
Das Reklamationsmodell sagt 150 Reklamationen voraus, 90 davon treten nicht ein → FP = 90. Kostet jede unnötige Vorabprüfung 15 €, sind das 1.350 €.

### Abgrenzung
Falsch negativ ist der übersehene Fall (Fehler 2. Art). Teuer ist ein FP z. B. beim automatischen Rabatt (Rabatt zu Unrecht) oder beim Spamfilter (echte Mail im Spam) – dort zählt die Precision.

### Merksatz
FP = Fehlalarm.

Siehe auch: Falsch negativ · Precision · Falsch-Positiv-Rate · Konfusionsmatrix
Mehr: Deep Dive 7, 2.1 · Deep Dive 7, 2.4

## Falsch-Positiv-Rate
<!-- id: falsch-positiv-rate · quellen: Karte DD7, DD7 2.2 · stand: 2026-10 -->

Anteil der tatsächlich negativen Fälle, die fälschlich Alarm auslösen: $\text{FPR} = \frac{FP}{FP + TN} = 1 - \text{Spezifität}$.

### Erklärung
Die FPR misst, wie oft das Modell bei „harmlosen“ Fällen falsch anschlägt. Sie ist die x-Achse der **ROC-Kurve**; auf der y-Achse steht die Richtig-Positiv-Rate (= Recall). Jede Entscheidungsschwelle liefert ein Paar (FPR | Recall); ein gutes Modell liegt oben links.

### Beispiel
FP = 90, TN = 810: $\text{FPR} = \frac{90}{90 + 810} = \frac{90}{900} = 10\ \%$; die Spezifität ist 90 %. Mit Recall 60 % liegt das Modell bei (0,10 | 0,60) in der ROC-Kurve.

### Abgrenzung
Nicht mit 1 − Precision verwechseln: Die FPR teilt durch alle tatsächlich negativen Fälle (Zeile), die Precision durch alle positiv vorhergesagten (Spalte).

### Prüfungsfalle
Den Nenner FP + TP statt FP + TN nehmen.

### Merksatz
FPR = Fehlalarme unter allen Negativen.

Siehe auch: Spezifität · ROC-Kurve · Falsch positiv · AUC
Mehr: Deep Dive 7, 2.2 · Deep Dive 7, 4.4

## FAZ
<!-- id: faz · quellen: Karte DD12, DD12 3.2 · stand: 2026-10 -->

Frühester Anfangszeitpunkt eines Vorgangs im Netzplan; er entspricht dem größten FEZ aller Vorgänger.

### Erklärung
Die FAZ werden in der **Vorwärtsrechnung** vom Projektstart (Zeitpunkt 0) aus bestimmt. Ein Vorgang kann erst beginnen, wenn **alle** Vorgänger fertig sind – deshalb zählt das Maximum der FEZ. Zusammen mit FEZ, SAZ und SEZ ergeben sich daraus Puffer und kritischer Pfad.

### Beispiel
„Datenmodell entwerfen“ (A, 3 Tage) und „Quellsysteme anbinden“ (C, 7 Tage) starten beide bei 0. „ETL entwickeln“ (D) braucht beide: FEZ(A) = 3, FEZ(C) = 7 → FAZ(D) = max(3; 7) = **7**.

### Abgrenzung
SAZ ist der späteste Anfang aus der Rückwärtsrechnung; GP = SAZ − FAZ.

### Prüfungsfalle
In der Vorwärtsrechnung das kleinste statt das größte FEZ der Vorgänger nehmen.

### Merksatz
Vorwärts das Maximum, rückwärts das Minimum.

Siehe auch: FEZ · SAZ · Vorwärtsrechnung · Netzplan · Kritischer Pfad
Mehr: Deep Dive 12, 3.2

## Fehlende Case ID
<!-- id: fehlende-case-id · quellen: DD5 5.3 · stand: 2026-10 -->

Datenqualitätsproblem im Event Log: Ereignissen fehlt die Vorgangsnummer, sodass sie keinem Fall zugeordnet werden können.

### Erklärung
Die **Case ID** klammert alle Ereignisse eines Falls zusammen (z. B. die Auftragsnummer). Ohne sie kann Process Mining weder den Ablauf je Fall rekonstruieren noch Durchlaufzeiten oder Varianten berechnen; solche Ereignisse fallen aus der Analyse heraus oder werden falsch verbunden. Ursache ist oft, dass ein System die Vorgangsnummer nicht mitprotokolliert (z. B. eine E-Mail-Bearbeitung ohne Auftragsbezug).

### Beispiel
Im Reparaturservice protokolliert die Werkstatt-App „Reparatur durchführen“ nur mit Techniker und Zeit, aber ohne Auftragsnummer – die Werkstattschritte lassen sich keinem Auftrag zuordnen.

### Abgrenzung
Fehlende Zeitstempel verhindern die Reihenfolge, die fehlende Case ID die Zuordnung zum Fall.

### Merksatz
Ohne Case ID kein Fall – nur lose Ereignisse.

Siehe auch: Case ID · Event Log · Process Mining · Fehlende Zeitstempel · Unvollständige Fälle
Mehr: Deep Dive 5, 5.3

## Fehlende Historie
<!-- id: fehlende-historie · quellen: DD8 Teil 1 · stand: 2026-10 -->

Eigenschaft operativer Systeme, Änderungen zu überschreiben, sodass frühere Zustände für Zeitvergleiche verloren sind.

### Erklärung
OLTP-Systeme speichern den aktuellen Stand, den das Tagesgeschäft braucht. Ändert sich eine Kundenadresse, steht danach nur noch die neue Adresse in der Datenbank – rückwirkend hatte der Kunde „immer“ die neue. Für Auswertungen über die Zeit ist das fatal. Die fehlende Historie ist neben dem Lastproblem und den verteilten Quellen einer der drei Gründe, nicht direkt im OLTP auszuwerten, sondern ein Data Warehouse mit **Historisierung** aufzubauen.

### Beispiel
Die Huber GmbH zieht am 15.05.2026 von München nach Hamburg. Im ERP stehen danach auch alle alten Umsätze bei „Hamburg“; der Umsatz der Region München für 2025 sinkt im Bericht nachträglich.

### Abgrenzung
SCD Typ 1 im DWH entspricht bewusst dem Überschreiben; SCD Typ 2 legt eine neue Zeile mit Gültigkeitszeitraum an und bewahrt die Historie.

### Merksatz
Was überschrieben ist, kann kein Bericht mehr zeigen.

Siehe auch: Historisierung · OLTP · Lastproblem · Verteilte Quellen · Data Warehouse
Mehr: Deep Dive 8, Teil 1

## Fehlende Werte
<!-- id: fehlende-werte · quellen: DD6 Teil 5, DD9 4.1 · stand: 2026-10 -->

Leere oder NULL-Einträge in Merkmalen, die vor einer Analyse oder Modellbildung gezielt behandelt werden müssen.

### Erklärung
Strategien sind Löschen des Datensatzes, Ersetzen (**Imputation**: Mittelwert oder Median bei metrischen, Modus bei kategorialen Merkmalen), eine eigene Kategorie „unbekannt“ oder fachliches Nachrecherchieren. Welche zulässig ist, hängt vom **Fehlmechanismus** ab: Fehlen die Werte nicht zufällig, verzerrt jede einfache Ersetzung das Ergebnis. Ersetzte Werte werden gekennzeichnet (Spalte „imputiert ja/nein“).

### Beispiel
Ein Spediteur meldet nie die Lieferdauer. Den Gesamtmittelwert einzusetzen wäre falsch, weil dieser Spediteur systematisch anders ist; besser: Ursache klären oder je Spediteur ersetzen.

### Prüfungsfalle
Fehlende Werte als 0 mitrechnen – das drückt Mittelwerte und Summen. In SQL ignorieren `AVG` und `COUNT(spalte)` NULL, `COUNT(*)` nicht.

### Merksatz
Erst fragen, warum der Wert fehlt, dann entscheiden, wie man ihn behandelt.

Siehe auch: Imputation · Fehlmechanismen nach Rubin · MCAR · Vollständigkeit · NULL
Mehr: Deep Dive 6, Teil 5 · Deep Dive 9, 4.1

## Fehlende Zeitstempel
<!-- id: fehlende-zeitstempel · quellen: DD5 5.3 · stand: 2026-10 -->

Datenqualitätsproblem im Event Log: Ereignissen fehlt der Zeitpunkt, sodass ihre Reihenfolge nicht rekonstruierbar ist.

### Erklärung
Der **Timestamp** bestimmt im Process Mining, in welcher Reihenfolge die Schritte eines Falls ablaufen, und liefert die Durchlaufzeiten. Fehlt er, kann das Ereignis nicht eingeordnet werden; Wartezeiten und Engpässe werden falsch berechnet. Verwandt ist das Problem **zu grober Zeitstempel** (nur Datum ohne Uhrzeit): Schritte desselben Tages lassen sich dann nicht ordnen.

### Beispiel
„Rechnung stellen“ wird im Buchhaltungssystem ohne Datum exportiert. Process Mining kann nicht erkennen, ob die Rechnung vor oder nach der Reparatur gestellt wurde.

### Abgrenzung
Fehlende Case ID verhindert die Zuordnung zum Fall, fehlende Zeitstempel die Reihenfolge innerhalb des Falls; Zeitzonenprobleme erzeugen sogar negative Durchlaufzeiten.

### Merksatz
Ohne Zeitstempel keine Reihenfolge, ohne Reihenfolge kein Prozess.

Siehe auch: Timestamp · Event Log · Zu grobe Zeitstempel · Fehlende Case ID · Zeitzonen-/Sommerzeitprobleme
Mehr: Deep Dive 5, 5.3

## Fehlernachtest
<!-- id: fehlernachtest · quellen: Karte DD16, DD16 2.4 · stand: 2026-10 -->

Bestätigungstest (Re-Test): Nach einer Fehlerbehebung wird genau der fehlgeschlagene Testfall wiederholt, um zu bestätigen, dass der Fehler behoben ist.

### Erklärung
Der Fehlernachtest schließt den Kreislauf aus Testen, Debugging und Korrektur. Er prüft nur die Korrektur selbst. Ob die Änderung an anderer Stelle etwas beschädigt hat, prüft der **Regressionstest**, bei dem bereits bestandene Tests wiederholt werden.

### Beispiel
Testfall „Bestellwert 500,00 € → 5 % Rabatt“ schlug fehl, weil im Code `> 500` stand. Nach der Korrektur auf `>= 500` wird genau dieser Testfall erneut ausgeführt (Fehlernachtest); danach laufen alle Rabatt- und Rechnungstests erneut (Regressionstest).

### Abgrenzung
| Test | Wiederholt | Frage |
|---|---|---|
| Fehlernachtest | den fehlgeschlagenen Testfall | Ist der Fehler weg? |
| Regressionstest | bereits bestandene Tests | Ist woanders etwas kaputt? |

### Merksatz
Nachtest prüft die Reparatur, Regressionstest die Nebenwirkungen.

Siehe auch: Regressionstest · Debugging · Testfall · Grenzwertanalyse
Mehr: Deep Dive 16, 2.4

## Fehlerquote
<!-- id: fehlerquote · quellen: Karte DD5, DD5 3.2, DD9 Teil 3 · stand: 2026-10 -->

Anteil fehlerhafter Fälle an allen Fällen: $\text{Fehlerquote} = \frac{\text{fehlerhafte Fälle}}{\text{Gesamtfälle}} \cdot 100$.

### Erklärung
Die Fehlerquote ist eine Qualitätskennzahl der Prozessanalyse und der Datenqualität (dort: fehlerhafte Sätze / geprüfte Sätze). Sie wird erst aussagekräftig mit Bezugsgröße, Zielwert und Vergleich (Vorperiode, Soll). Veränderungen gibt man in **Prozentpunkten** an, nicht in Prozent.

### Beispiel
200 Reparaturaufträge, 24 davon mit Nacharbeit: $\frac{24}{200} \cdot 100 = 12\ \%$. Sinkt die Quote danach auf 9 %, sind das 3 Prozentpunkte bzw. 25 % weniger.

### Abgrenzung
First Pass Yield zählt die Fälle, die im ersten Durchlauf fehlerfrei sind (hier 176 / 200 = 88 %). Bei Six Sigma misst man Fehler je Fehlermöglichkeit (DPMO).

### Prüfungsfalle
Eine Steigerung von 4 % auf 6 % als „+2 %“ angeben – richtig sind 2 Prozentpunkte oder +50 %.

### Merksatz
Fehlerquote immer mit Bezugsgröße und Vergleichswert.

Siehe auch: First Pass Yield · Prozentpunkte · DPMO · Qualitätsgrad
Mehr: Deep Dive 5, 3.2 · Deep Dive 9, Teil 3

## Fehlerwirkung
<!-- id: fehlerwirkung · quellen: Karte DD16, DD16 1.3 · stand: 2026-10 -->

Sichtbares Fehlverhalten eines Systems bei der Ausführung (engl. failure, auch Ausfall).

### Erklärung
Die Fehlerwirkung ist das letzte Glied der Kette **Fehlhandlung → Fehlerzustand → Fehlerwirkung**. Nur sie kann ein dynamischer Test beobachten: Das Ergebnis weicht vom erwarteten ab. Die Ursache im Code oder in den Daten sucht und behebt anschließend das **Debugging**. Nicht jeder Fehlerzustand führt zu einer Fehlerwirkung – z. B. wenn der fehlerhafte Programmteil nie durchlaufen wird.

### Beispiel
Das Umsatz-Dashboard zeigt einen um 19 % zu hohen Umsatz, weil die Umsatzspalte Bruttobeträge summiert.

### Abgrenzung
| Begriff | Was ist es? | Beispiel |
|---|---|---|
| Fehlhandlung | menschlicher Irrtum | Netto und Brutto verwechselt |
| Fehlerzustand | Defekt im Code/Skript | SUM über Bruttospalte |
| Fehlerwirkung | sichtbares Fehlverhalten | Dashboard 19 % zu hoch |

### Merksatz
Testen findet Wirkungen, Debugging findet Zustände.

Siehe auch: Fehlerzustand · Fehlhandlung · Debugging · Testen
Mehr: Deep Dive 16, 1.3

## Fehlerzustand
<!-- id: fehlerzustand · quellen: Karte DD16, DD16 1.3 · stand: 2026-10 -->

Defekt im Code, Skript, Modell oder in den Daten, der eine Fehlerwirkung verursachen kann (engl. fault, defect, umgangssprachlich Bug).

### Erklärung
Ein Fehlerzustand entsteht durch eine menschliche Fehlhandlung und bleibt so lange unbemerkt, bis er bei der Ausführung eine Fehlerwirkung erzeugt. Statische Prüfungen (Reviews, Codeanalyse) können Fehlerzustände direkt finden, ohne das Programm auszuführen; dynamische Tests zeigen dagegen nur deren Wirkung.

### Beispiel
Im ETL-Skript steht `SUM(betrag_brutto)` statt `SUM(betrag_netto)` – das ist der Fehlerzustand. Im Review fällt er auf, bevor das Dashboard falsche Zahlen zeigt.

### Abgrenzung
Fehlhandlung = Ursache beim Menschen, Fehlerzustand = Defekt im Artefakt, Fehlerwirkung = sichtbares Fehlverhalten.

### Prüfungsfalle
„Fehler“ undifferenziert verwenden – in Testfragen wird die Begriffskette erwartet.

### Merksatz
Der Fehlerzustand steckt im Code, die Fehlerwirkung zeigt sich im Ergebnis.

Siehe auch: Fehlerwirkung · Fehlhandlung · Review · Statische Prüfung
Mehr: Deep Dive 16, 1.3

## Fehlhandlung
<!-- id: fehlhandlung · quellen: Karte DD16, DD16 1.3 · stand: 2026-10 -->

Menschlicher Irrtum (engl. error, mistake), der zu einem Fehlerzustand führt.

### Erklärung
Am Anfang jedes Softwarefehlers steht eine Fehlhandlung: falsch verstandene Anforderung, Tippfehler, verwechselte Begriffe. Gegen Fehlhandlungen wirken vor allem **konstruktive** Maßnahmen der Qualitätssicherung: klare Anforderungen, Namenskonventionen, Vorlagen, Schulung, Vier-Augen-Prinzip beim Entwurf.

### Beispiel
Die Entwicklerin verwechselt bei der Umsatzauswertung Netto und Brutto. Daraus entsteht im Skript der Fehlerzustand (Bruttospalte summiert) und im Dashboard die Fehlerwirkung (Umsatz 19 % zu hoch).

### Abgrenzung
Die Fehlhandlung liegt beim Menschen, der Fehlerzustand im Artefakt, die Fehlerwirkung im Verhalten des Systems.

### Merksatz
Erst irrt der Mensch, dann der Code, dann das System.

Siehe auch: Fehlerzustand · Fehlerwirkung · Konstruktive Qualitätssicherung · Vier-Augen-Prinzip
Mehr: Deep Dive 16, 1.3

## Fehlmechanismen nach Rubin
<!-- id: fehlmechanismen-nach-rubin · quellen: DD9 4.1 · stand: 2026-10 -->

Einteilung fehlender Werte nach ihrer Ursache in MCAR, MAR und MNAR; sie entscheidet, welche Behandlung zulässig ist.

### Erklärung
Donald Rubin unterschied 1976 drei Mechanismen. Bei **MCAR** (Missing Completely at Random) hängt das Fehlen von nichts ab – Löschen verzerrt nicht, kostet nur Fallzahl. Bei **MAR** (Missing at Random) hängt es nur von anderen, beobachteten Merkmalen ab – man ersetzt innerhalb der Gruppe oder per Modell. Bei **MNAR** (Missing Not at Random) hängt es vom fehlenden Wert selbst ab – jede einfache Ersetzung verzerrt, die Ursache muss geklärt werden.

### Beispiel
| Mechanismus | Beispiel Lieferdauer |
|---|---|
| MCAR | Formular bei zufälligem Systemabsturz verloren |
| MAR | ein bestimmter Spediteur meldet nie (Spediteur bekannt) |
| MNAR | lange Lieferdauern werden bewusst nicht gemeldet |

### Prüfungsfalle
Bei MAR oder MNAR einfach den Gesamtmittelwert einsetzen – das verschiebt das Ergebnis.

### Merksatz
Erst den Mechanismus bestimmen, dann die Strategie wählen.

Siehe auch: MCAR · MAR · MNAR · Imputation · Fehlende Werte
Mehr: Deep Dive 9, 4.1

## Fensterfunktion
<!-- id: fensterfunktion · quellen: Karte DD1, DD1 3.8 · stand: 2026-10 -->

SQL-Funktion mit `OVER (…)`, die über eine Gruppe von Zeilen rechnet, ohne diese zu einer Zeile zu verdichten.

### Erklärung
Mit `PARTITION BY` wird die Gruppe festgelegt, mit `ORDER BY` im Fenster die Reihenfolge (z. B. für laufende Summen). Jede Zeile bleibt erhalten und bekommt den Gruppenwert dazu. Typische Fensterfunktionen sind Aggregate wie `SUM`/`COUNT` mit `OVER` und Rangfunktionen: `ROW_NUMBER()` (1, 2, 3, 4), `RANK()` (1, 2, 2, 4) und `DENSE_RANK()` (1, 2, 2, 3).

### Beispiel
```sql
SELECT bestell_id, produkt_id, menge,
       SUM(menge) OVER (PARTITION BY bestell_id) AS menge_bestellung
FROM bestellposition;
```
Beide Positionen der Bestellung 100 zeigen `menge_bestellung` = 4 (2 + 2).

### Abgrenzung
`GROUP BY` verdichtet jede Gruppe zu genau einer Zeile; die Fensterfunktion behält alle Einzelzeilen.

### Prüfungsfalle
Den Unterschied RANK / DENSE_RANK bei Gleichstand vergessen: RANK lässt nach einem Gleichstand eine Lücke.

### Merksatz
GROUP BY fasst zusammen, OVER rechnet daneben.

Siehe auch: GROUP BY · CTE (Common Table Expression) · Unterabfrage · HAVING
Mehr: Deep Dive 1, 3.8

## FEZ
<!-- id: fez · quellen: Karte DD12, DD12 3.2 · stand: 2026-10 -->

Frühester Endzeitpunkt eines Vorgangs im Netzplan: $\text{FEZ} = \text{FAZ} + \text{Dauer}$.

### Erklärung
Das FEZ entsteht in der Vorwärtsrechnung. Das größte FEZ aller Vorgänger ist das FAZ des Nachfolgers; das größte FEZ am Ende des Netzplans ist die **Projektdauer**. Mit dem FEZ werden außerdem der freie Puffer (kleinstes FAZ der Nachfolger − FEZ) und der Gesamtpuffer (SEZ − FEZ) berechnet.

### Beispiel
„ETL entwickeln“ beginnt frühestens an Tag 7 und dauert 4 Tage: FEZ = 7 + 4 = **11**. Folgt nur noch der Abnahmetest mit 2 Tagen, endet das Projekt an Tag 13.

### Abgrenzung
SEZ ist das späteste Ende aus der Rückwärtsrechnung. Auf dem kritischen Pfad gilt FEZ = SEZ.

### Prüfungsfalle
FEZ als FAZ + Dauer − 1 rechnen: In der Prüfungsschreibweise mit Zeitpunkten (Start bei 0) wird schlicht addiert.

### Merksatz
FEZ = FAZ + Dauer; das größte FEZ ist die Projektdauer.

Siehe auch: FAZ · SEZ · Vorwärtsrechnung · Freier Puffer · Netzplan
Mehr: Deep Dive 12, 3.2

## Fiktive Abnahme
<!-- id: fiktive-abnahme · quellen: Karte DD16, DD16 3.4 · stand: 2026-10 -->

Ein Werk gilt nach § 640 Abs. 2 BGB als abgenommen, wenn der Besteller eine vom Unternehmer gesetzte angemessene Abnahmefrist verstreichen lässt, ohne die Abnahme unter Angabe mindestens eines Mangels zu verweigern.

### Erklärung
Die Regel schützt den Auftragnehmer eines Werkvertrags davor, dass der Auftraggeber die Abnahme einfach nicht erklärt. Voraussetzung: Das Werk ist fertiggestellt, der Unternehmer hat eine angemessene Frist zur Abnahme gesetzt, und der Besteller schweigt oder verweigert ohne Mangelangabe. Ist der Besteller **Verbraucher**, tritt die Wirkung nur ein, wenn der Unternehmer ihn mit der Aufforderung in Textform auf diese Folgen hingewiesen hat (§ 640 Abs. 2 Satz 2 BGB). Die Rechtsfolgen sind die der normalen Abnahme: Vergütung fällig, Gewährleistungsfrist beginnt, Gefahr und Beweislast gehen über.

### Beispiel
Ein Dienstleister liefert der Möbelhaus Nordholz GmbH das fertige Reporting und setzt zwei Wochen Frist zur Abnahme. Das Möbelhaus reagiert nicht – nach Fristablauf gilt das Werk als abgenommen, die Rechnung wird fällig.

### Prüfungsfalle
Eine pauschale Verweigerung („gefällt uns nicht“) reicht nicht; mindestens ein Mangel muss benannt werden.

### Merksatz
Wer schweigt, hat abgenommen – wer ablehnen will, muss einen Mangel nennen.

Siehe auch: Abnahme · Werkvertrag · Abnahmetest · Gewährleistung
Mehr: Deep Dive 16, 3.4

## Filter und Paginierung
<!-- id: filter-und-paginierung · quellen: DD15 3.3 · stand: 2026-10 -->

API-Technik, Listen über Query-Parameter einzuschränken (Filter) und in Seiten fester Größe auszuliefern (Paginierung).

### Erklärung
Ohne Paginierung liefert eine REST-Liste mit wachsendem Datenbestand irgendwann Hunderttausende Datensätze auf einmal – langsam, speicherhungrig und fehleranfällig. Filter reduzieren die Menge auf das Benötigte, Parameter wie `seite`/`limit` (oder `offset`/`limit`) teilen sie in Portionen. Das unterstützt auch die **Datenminimierung**: Der Empfänger bekommt nur, was er braucht.

### Beispiel
```http
GET /reparaturauftraege?status=offen&seite=2&limit=50
```
liefert die offenen Aufträge 51 bis 100.

### Abgrenzung
Rate Limiting begrenzt die Zahl der Anfragen (Statuscode 429), Paginierung die Größe einer Antwort. GraphQL begrenzt zusätzlich die Felder je Datensatz.

### Merksatz
Große Listen nur gefiltert und seitenweise ausliefern.

Siehe auch: Paginierung · REST-API · Rate Limiting · Datenminimierung
Mehr: Deep Dive 15, 3.3

## Firewall
<!-- id: firewall · quellen: Karte DD10, DD10 5.3 · stand: 2026-10 -->

Sicherheitssystem, das Netzwerkverkehr anhand von Regeln filtert und Netzbereiche mit unterschiedlichem Schutzbedarf voneinander trennt.

### Erklärung
Eine Firewall lässt nur ausdrücklich erlaubte Verbindungen zu (Grundsatz „alles verboten, was nicht erlaubt ist“). Paketfilter prüfen Adressen, Ports und Protokolle; Application-Level-Firewalls verstehen zusätzlich Inhalte bestimmter Protokolle. Sie ist eine **technische präventive Maßnahme** und wirkt zusammen mit Netzsegmentierung, Härtung und Patchmanagement.

### Beispiel
Im Möbelhaus trennt eine Firewall das Büronetz vom Kassennetz und vom Internet: Aus dem Internet ist nur der Webshop über HTTPS (Port 443) erreichbar, die Datenbank nur aus dem internen Applikationsnetz.

### Abgrenzung
Ein VPN verschlüsselt den Transport, filtert aber nicht; der Virenschutz untersucht Dateien, nicht Verbindungen.

### Prüfungsfalle
Die Firewall als ausreichenden Schutz darstellen – gegen Phishing, Innentäter oder Lücken in erlaubten Diensten hilft sie nicht.

### Merksatz
Die Firewall entscheidet, wer mit wem reden darf – nicht, was geredet wird.

Siehe auch: Härtung · VPN · Patchmanagement · Schutzziele · IT-Grundschutz
Mehr: Deep Dive 10, 5.3

## Firma
<!-- id: firma · quellen: Karte DD14, DD14 3.1 · stand: 2026-10 -->

Name, unter dem ein Kaufmann seine Geschäfte betreibt und unterschreibt (§ 17 HGB), stets mit Rechtsformzusatz (§ 19 HGB).

### Erklärung
Die Firma ist nicht das Unternehmen selbst, sondern sein Handelsname; sie wird im Handelsregister eingetragen. Arten: **Personenfirma** (Name des Inhabers), **Sachfirma** (Gegenstand des Unternehmens), **Fantasiefirma** und gemischte Firma. Der Rechtsformzusatz (e. K., OHG, KG, GmbH, AG …) informiert Geschäftspartner über die Haftungsverhältnisse.

### Beispiel
„Möbelhaus Nordholz GmbH“ ist eine gemischte Firma: Sachbestandteil „Möbelhaus“, Name „Nordholz“, Rechtsformzusatz „GmbH“.

### Abgrenzung
Umgangssprachlich heißt „Firma“ das Unternehmen; rechtlich ist es nur der Name. Ein Kleingewerbetreibender ohne Eintragung führt keine Firma, sondern seinen bürgerlichen Namen.

### Merksatz
Die Firma ist der Name des Kaufmanns – mit Rechtsform.

Siehe auch: Handelsregister · Istkaufmann · Formkaufmann · GmbH
Mehr: Deep Dive 14, 3.1

## First Pass Yield
<!-- id: first-pass-yield · quellen: Karte DD5, DD5 3.2 · stand: 2026-10 -->

Anteil der Fälle, die im ersten Durchlauf ohne Nacharbeit fehlerfrei abgeschlossen werden: $\text{FPY} = \frac{\text{fehlerfrei im ersten Durchlauf}}{\text{Gesamtfälle}} \cdot 100$.

### Erklärung
Der FPY (Erstdurchlaufquote) zeigt, wie oft ein Prozess „auf Anhieb“ funktioniert. Nacharbeit, zweite Technikertermine oder Rückfragen zählen als nicht bestanden, auch wenn der Fall am Ende korrekt erledigt wurde. Ein niedriger FPY weist auf versteckte Kosten schlechter Qualität und auf Schleifen hin, die Process Mining sichtbar macht.

### Beispiel
200 Reparaturaufträge, 24 brauchten Nacharbeit: $\text{FPY} = \frac{176}{200} \cdot 100 = 88\ \%$.

### Abgrenzung
Die Fehlerquote zählt die fehlerhaften Fälle (hier 12 %). Bei mehrstufigen Prozessen multipliziert man die FPY der Stufen zum Rolled Throughput Yield.

### Merksatz
FPY misst, was beim ersten Mal klappt.

Siehe auch: Fehlerquote · Nacharbeitskosten · Termintreue · Six Sigma
Mehr: Deep Dive 5, 3.2

## Fiskalpolitik
<!-- id: fiskalpolitik · quellen: Karte DD14, DD14 4.4 · stand: 2026-10 -->

Konjunktursteuerung des Staates über Einnahmen (Steuern) und Ausgaben, klassisch antizyklisch.

### Erklärung
Im Abschwung erhöht der Staat seine Ausgaben (z. B. Investitionen) und senkt Steuern, um die Nachfrage zu stützen – notfalls über Kredite. Im Boom kürzt er Ausgaben und bildet Rücklagen, um Überhitzung zu dämpfen. Grundlage ist das Stabilitätsgesetz von 1967 mit den Zielen des magischen Vierecks. Probleme: Zeitverzögerung zwischen Beschluss und Wirkung, und im Boom wird selten tatsächlich gespart.

### Beispiel
In einer Rezession senkt der Staat die Mehrwertsteuer befristet und legt ein Investitionsprogramm für Schulen auf – Möbelhäuser profitieren von zusätzlicher Nachfrage.

### Abgrenzung
Die **Geldpolitik** betreibt die unabhängige Europäische Zentralbank über den Leitzins, nicht der Staat.

### Prüfungsfalle
„Fiskalpolitik“ der EZB zuschreiben oder antizyklisch mit prozyklisch verwechseln.

### Merksatz
Fiskalpolitik: Staat steuert mit Steuern und Ausgaben – gegen den Zyklus.

Siehe auch: Antizyklische Fiskalpolitik · Geldpolitik · Magisches Viereck · Konjunkturphasen
Mehr: Deep Dive 14, 4.4

## Fixkosten
<!-- id: fixkosten · quellen: Karte DD12, DD12 4.1, DD12 4.2 · stand: 2026-10 -->

Kosten, die unabhängig von der Leistungsmenge in gleicher Höhe anfallen, z. B. Lizenzpauschale, Miete, Serverkosten.

Auch: Fix / variabel

### Erklärung
Kosten werden nach ihrem Verhalten bei Mengenänderung in fixe und **variable** Kosten gegliedert. Fixkosten fallen auch bei null Stück an; variable Kosten steigen mit der Menge (transaktionsabhängige Gebühren, Material). Je Stück sinken die Fixkosten mit steigender Menge (Fixkostendegression). Die Gliederung ist Grundlage für Break-even-Menge und Kostenvergleichsrechnung.

### Beispiel
Break-even: Fixkosten 24.000 €, Preis 80 €, variable Stückkosten 50 €: $\frac{24.000}{80 - 50} = 800$ Stück. Make or Buy: 12.000 € Fixkosten + 2 € je Vorgang gegen 5 € je Vorgang → gleich teuer bei $\frac{12.000}{5 - 2} = 4.000$ Vorgängen.

### Abgrenzung
Fix/variabel betrifft die Mengenabhängigkeit, einmalig/laufend den Zeitpunkt, direkt/indirekt die Zurechenbarkeit. Fixkosten können laufend sein (Miete) – nicht verwechseln.

### Merksatz
Fixkosten bleiben, wenn die Menge sinkt.

Siehe auch: Variable Kosten · Break-even-Menge · Deckungsbeitrag · Kritische Menge · Total Cost of Ownership
Mehr: Deep Dive 12, 4.1 · Deep Dive 12, 4.2

## FMEA
<!-- id: fmea · quellen: Karte DD5, DD5 6.4 · stand: 2026-10 -->

Fehlermöglichkeits- und -einflussanalyse: vorbeugende Bewertung **möglicher** Fehler nach Auftreten, Bedeutung und Entdeckung (je 1–10).

### Erklärung
Für jeden möglichen Fehler eines Prozesses oder Produkts werden A (Auftretenswahrscheinlichkeit), B (Bedeutung der Folgen) und E (Wahrscheinlichkeit, dass der Fehler **unentdeckt** bleibt) bewertet. Daraus folgt die **Risikoprioritätszahl** $RPZ = A \cdot B \cdot E$ (1 bis 1.000). Ab einer festgelegten Schwelle werden Maßnahmen geplant; Fehler mit sehr hoher Bedeutung (B ≥ 9) werden immer betrachtet. Das AIAG-VDA-Handbuch (2019) ersetzt die RPZ in der Praxis durch die Aufgabenpriorität; in IHK-Aufgaben wird mit der RPZ gerechnet.

### Beispiel
| Möglicher Fehler | A | B | E | RPZ |
|---|---|---|---|---|
| Ersatzteil falsch bestellt | 4 | 6 | 5 | 120 |
| Vorschaden nicht dokumentiert | 3 | 8 | 7 | 168 |

Vorrang hat der Vorschaden; Maßnahme Fotopflicht in der App senkt E.

### Abgrenzung
Die Projektrisikoanalyse rechnet nur Wahrscheinlichkeit · Schaden; das Ishikawa-Diagramm sucht Ursachen bereits aufgetretener Probleme.

### Prüfungsfalle
Ein hohes E als „gut entdeckbar“ lesen – hoch heißt schlecht entdeckbar.

### Merksatz
FMEA: Fehler verhindern, bevor sie passieren – A mal B mal E.

Siehe auch: Risikoprioritätszahl · Aufgabenpriorität (FMEA) · Risikomatrix · Ishikawa-Diagramm
Mehr: Deep Dive 5, 6.4

## Formatprüfung
<!-- id: formatprufung · quellen: Karte DD9, DD9 5.1 · stand: 2026-10 -->

Technische Datenqualitätsmaßnahme, die Werte gegen ein festgelegtes Muster oder ein Prüfziffernverfahren prüft (PLZ, E-Mail, IBAN, EAN).

### Erklärung
Formatprüfungen sichern die DQ-Dimension **Gültigkeit**: Ein Wert, der nicht dem Muster entspricht, wird bei der Erfassung abgewiesen oder im ETL in die Quarantäne geleitet. Muster werden oft als reguläre Ausdrücke formuliert; Prüfziffern erkennen Tippfehler (IBAN: Modulo 97, EAN/GTIN: Modulo 10 mit Gewichtung 1 und 3).

### Beispiel
PLZ: genau fünf Ziffern, als Text gespeichert, damit „04109“ nicht zu 4109 wird. In SQL z. B. `CHECK (LENGTH(plz) = 5)`, ergänzt um eine Ziffernprüfung je nach DBMS.

### Abgrenzung
Formatprüfung prüft die Form, nicht die Wahrheit: „12345“ ist eine gültige, aber vielleicht falsche PLZ (Korrektheit). Die Wertebereichsprüfung (CHECK) prüft Grenzen, die Plausibilitätsprüfung Zusammenhänge zwischen Feldern.

### Merksatz
Gültig heißt noch nicht korrekt.

Siehe auch: Gültigkeit · Korrektheit · Wertebereichsprüfung (CHECK) · Plausibilitätsprüfung · Postleitzahlen als Text
Mehr: Deep Dive 9, 5.1

## Formkaufmann
<!-- id: formkaufmann · quellen: Karte DD14, DD14 3.1 · stand: 2026-10 -->

Kaufmann allein kraft Rechtsform (§ 6 HGB) – vor allem Kapitalgesellschaften wie GmbH, UG und AG, unabhängig von Art und Umfang ihres Geschäfts.

### Erklärung
Für Formkaufleute gilt das HGB auch dann, wenn sie gar kein Handelsgewerbe betreiben. Die Kaufmannseigenschaft entsteht mit der Eintragung ins Handelsregister (Abteilung B), die bei GmbH und AG **konstitutiv** wirkt: Erst damit entsteht die Gesellschaft als juristische Person.

### Abgrenzung
| Kaufmannsart | Grund | Eintragung |
|---|---|---|
| Istkaufmann | betreibt ein Handelsgewerbe | Pflicht, deklaratorisch |
| Kannkaufmann | Kleingewerbe, freiwillig eingetragen | konstitutiv |
| Formkaufmann | Rechtsform (GmbH, AG) | konstitutiv |

### Beispiel
Eine GmbH, die nur ein kleines Beratungsbüro betreibt, ist trotzdem Kaufmann und muss Handelsbücher führen.

### Merksatz
Formkaufmann ist man durch die Form, nicht durch das Geschäft.

Siehe auch: Istkaufmann · Kannkaufmann · Handelsregister · GmbH · AG
Mehr: Deep Dive 14, 3.1

## Freier Puffer
<!-- id: freier-puffer · quellen: Karte DD12, DD12 3.2 · stand: 2026-10 -->

Zeit, um die ein Vorgang verschoben werden kann, ohne den frühesten Anfang eines Nachfolgers zu verzögern: $\text{FP} = \min(\text{FAZ der Nachfolger}) - \text{FEZ}$.

### Erklärung
Der freie Puffer gehört dem Vorgang allein: Nutzt man ihn, bleiben alle Nachfolger unberührt. Er ist nie größer als der Gesamtpuffer. Liegt ein Vorgang auf dem kritischen Pfad, sind beide Puffer 0.

### Beispiel
A „Datenmodell“ (3 Tage) → B „Testdaten“ (2 Tage) → D; parallel C „Quellsysteme“ (7 Tage) → D. Vorwärts: FEZ(A) = 3, FAZ(B) = 3, FEZ(B) = 5, FAZ(D) = 7.
- FP(B) = 7 − 5 = **2**
- FP(A) = FAZ(B) − FEZ(A) = 3 − 3 = **0**, obwohl GP(A) = 2 (SAZ(A) = 2, FAZ(A) = 0).

Verschiebt sich A um einen Tag, verschiebt sich B mit – das Projektende aber nicht.

### Abgrenzung
Gesamtpuffer = Spielraum bis zum **Projektende**, freier Puffer = Spielraum bis zum **nächsten Vorgang**.

### Prüfungsfalle
Das größte statt des kleinsten FAZ der Nachfolger nehmen.

### Merksatz
Freier Puffer stört keinen Nachfolger, Gesamtpuffer nicht das Projektende.

Siehe auch: Gesamtpuffer · Puffer · FAZ · FEZ · Kritischer Pfad
Mehr: Deep Dive 12, 3.2

## Fremdschlüssel
<!-- id: fremdschlussel · quellen: Karte DD1, DD2 1.2, DD1 2.5 · stand: 2026-10 -->

Attribut, das auf den Primärschlüssel einer anderen (oder derselben) Tabelle verweist und so die Beziehung herstellt; die Datenbank sichert damit die referenzielle Integrität.

### Erklärung
Bei einer 1:n-Beziehung wandert der Primärschlüssel der 1-Seite als Fremdschlüssel in die n-Seite. Eine m:n-Beziehung wird über eine Zwischentabelle mit zwei Fremdschlüsseln aufgelöst. Mit `FOREIGN KEY … REFERENCES` verhindert die Datenbank verwaiste Datensätze; `ON DELETE CASCADE / SET NULL / RESTRICT` regelt das Löschverhalten. Ob er NULL sein darf, zeigt das Minimum der Kardinalität.

### Beispiel
```sql
CREATE TABLE bestellung (
  bestell_id INT PRIMARY KEY,
  kunden_id  INT NOT NULL REFERENCES kunde(kunden_id),
  bestelldatum DATE
);
```
Eine Bestellung mit kunden_id 99 wird abgewiesen, wenn es Kunde 99 nicht gibt.

### Abgrenzung
Der Primärschlüssel identifiziert die eigene Zeile eindeutig; der Fremdschlüssel verweist und darf mehrfach vorkommen.

### Merksatz
Der Fremdschlüssel zeigt auf einen Primärschlüssel – nie ins Leere.

Siehe auch: Primärschlüssel · Referenzielle Integrität · Zwischentabelle · Kardinalität
Mehr: Deep Dive 2, 1.2 · Deep Dive 1, 2.5

## Friedenspflicht
<!-- id: friedenspflicht · quellen: Karte DD13, DD13 5.2 · stand: 2026-10 -->

Pflicht der Tarifparteien, während der Laufzeit eines Tarifvertrags keine Arbeitskämpfe über die darin geregelten Punkte zu führen.

### Erklärung
Die Friedenspflicht ergibt sich aus dem Tarifvertrag selbst und sorgt für Planungssicherheit. Sie ist in der Regel **relativ**: Sie gilt nur für die geregelten Gegenstände; über nicht geregelte Themen darf gestreikt werden (eine absolute Friedenspflicht müsste ausdrücklich vereinbart sein). Erst nach Ablauf oder Kündigung des Tarifvertrags sind Warnstreiks und Streiks zu diesen Punkten zulässig.

### Beispiel
Der Entgelttarifvertrag im Einzelhandel läuft bis 31.03. Ein Warnstreik um höhere Löhne im Februar wäre rechtswidrig; ab April ist er möglich. Für Arbeitszeitregeln aus dem Manteltarifvertrag gilt dessen eigene Laufzeit.

### Abgrenzung
Die **Nachwirkung** lässt Regelungen nach Ablauf weitergelten, bis eine neue Abmachung sie ersetzt – die Friedenspflicht endet dagegen mit der Laufzeit.

### Merksatz
Solange der Vertrag läuft, wird über seinen Inhalt nicht gestreikt.

Siehe auch: Tarifvertrag · Streik · Nachwirkung · Tarifautonomie
Mehr: Deep Dive 13, 5.2 · Deep Dive 13, 5.4

## Frist
<!-- id: frist · quellen: DD10 2.3 · stand: 2026-10 -->

Im Datenschutz der Zeitraum, in dem ein Verantwortlicher Anträge Betroffener beantworten muss: unverzüglich, spätestens innerhalb eines Monats (Art. 12 Abs. 3 DSGVO).

### Erklärung
Die Frist gilt für alle Betroffenenrechte (Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch). Bei komplexen oder zahlreichen Anträgen kann sie um **zwei weitere Monate** verlängert werden; die betroffene Person ist innerhalb des ersten Monats darüber und über die Gründe zu informieren. Die Auskunft ist grundsätzlich kostenlos; nur bei offenkundig unbegründeten oder exzessiven Anträgen darf ein Entgelt verlangt oder abgelehnt werden (Art. 12 Abs. 5).

### Beispiel
Eine Kundin verlangt am 06.10.2026 Auskunft über ihre gespeicherten Daten. Das Möbelhaus muss spätestens am 06.11.2026 antworten.

### Abgrenzung
Datenpannen sind der Aufsichtsbehörde binnen **72 Stunden** zu melden (Art. 33) – nicht mit der Monatsfrist verwechseln.

### Merksatz
Betroffenenanfrage: unverzüglich, spätestens ein Monat, Verlängerung nur begründet.

Siehe auch: Betroffenenrechte · DSGVO · Verantwortlicher · Datenpanne
Mehr: Deep Dive 10, 2.3

## Führungsprozess
<!-- id: fuhrungsprozess · quellen: Karte DD5, DD5 1.1 · stand: 2026-10 -->

Geschäftsprozess, der das Unternehmen steuert und ausrichtet, z. B. Strategie, Planung, Controlling, Qualitätsmanagement.

### Erklärung
Führungsprozesse schaffen keinen direkten Kundennutzen, geben aber Ziele, Rahmen und Kontrolle für alle anderen Prozesse vor. In einer **Prozesslandkarte** stehen sie meist oben, die Kernprozesse in der Mitte, die Unterstützungsprozesse unten.

### Abgrenzung
| Prozessart | Zweck | Beispiel Möbelhaus |
|---|---|---|
| Führungsprozess | steuert | Jahresplanung, Controlling |
| Kernprozess | schafft direkten Kundennutzen | Auftragsabwicklung, Reparaturservice |
| Unterstützungsprozess | ermöglicht Kernprozesse | IT-Betrieb, Personalwesen |

### Beispiel
Das monatliche Controlling wertet die Durchlaufzeiten des Reparaturservice aus und legt neue Zielwerte fest.

### Prüfungsfalle
Den IT-Betrieb als Führungsprozess einordnen – er unterstützt, er steuert nicht.

### Merksatz
Führen steuert, Kern schöpft Wert, Unterstützung ermöglicht.

Siehe auch: Kernprozess · Unterstützungsprozess · Geschäftsprozess · Balanced Scorecard
Mehr: Deep Dive 5, 1.1

## Fünf-Punkte-Zusammenfassung
<!-- id: funf-punkte-zusammenfassung · quellen: Karte DD3, DD3 5.1 · stand: 2026-10 -->

Kompakte Beschreibung einer Verteilung durch Minimum, Q1, Median, Q3 und Maximum; Grundlage des Boxplots.

### Erklärung
Die fünf Werte zeigen Lage (Median), Streuung (IQR = Q3 − Q1, Spannweite) und Schiefe (Lage des Medians zwischen Q1 und Q3). Weil sie auf Rangpositionen beruhen, sind Median und Quartile robust gegen Ausreißer. Im Boxplot nach Tukey enden die Whisker allerdings am letzten Wert innerhalb der 1,5-IQR-Zäune; Minimum und Maximum stehen dann nur, wenn es keine Ausreißer gibt.

### Beispiel
Lieferzeiten 2, 3, 3, 4, 5, 5, 5, 6, 8, 19 Tage: Minimum 2, Q1 3, Median 5, Q3 6, Maximum 19. Oberer Zaun 6 + 1,5 · 3 = 10,5 → 19 ist ein Ausreißer, der Whisker endet bei 8.

### Prüfungsfalle
Bei den Quartilen Position und Wert verwechseln („Position 8 → Wert 6“) und die verwendete Quartilskonvention nicht angeben.

### Merksatz
Min – Q1 – Median – Q3 – Max: fünf Zahlen, ein Boxplot.

Siehe auch: Boxplot · Quartil · Median · Interquartilsabstand (IQR) · Whisker
Mehr: Deep Dive 3, 5.1 · Deep Dive 3, 4.2

## Funktion
<!-- id: funktion · quellen: Karte DD5, DD5 2.3, DD17 1.2 · stand: 2026-10 -->

Aktive Tätigkeit in einer EPK, gezeichnet als abgerundetes Rechteck und benannt mit Objekt + Verb (z. B. „Auftrag prüfen“).

### Erklärung
In der ereignisgesteuerten Prozesskette wechseln sich passive **Ereignisse** (Sechseck, Zustand: „Auftrag ist erfasst“) und aktive Funktionen streng ab. Entscheidungen gehen immer von einer Funktion aus: Nach einer Funktion sind XOR-, OR- und AND-Verzweigungen erlaubt, nach einem einzelnen Ereignis nur AND. In der eEPK hängen Organisationseinheit, Informationsobjekt und Anwendungssystem immer an einer Funktion.

### Beispiel
„Bestellung ist eingegangen“ → **Bestellung prüfen** → XOR → „Bestellung ist gültig“ / „Bestellung ist ungültig“. An „Bestellung prüfen“ hängen die Organisationseinheit „Vertrieb“ und das Informationsobjekt „Kundendaten“.

### Abgrenzung
In BPMN entspricht die Funktion einem **Task** (Aktivität); das BPMN-Gateway trifft dort keine Entscheidung, die Grundlage entsteht in der Aktivität davor.

### Prüfungsfalle
Zwei Funktionen direkt hintereinander zeichnen oder eine EPK mit einer Funktion beginnen lassen.

### Merksatz
Ereignis – Funktion – Ereignis: Die Funktion handelt, das Ereignis beschreibt.

Siehe auch: Ereignis · EPK · Konnektor · Erweiterte EPK (eEPK) · Task
Mehr: Deep Dive 5, 2.3 · Deep Dive 17, 1.2

## Funktionale Abhängigkeit
<!-- id: funktionale-abhangigkeit · quellen: Karte DD2, DD2 2.1 · stand: 2026-10 -->

A → B: Zu jedem Wert von A gehört genau ein Wert von B, z. B. kunden_id → kundenname.

### Erklärung
Funktionale Abhängigkeiten sind das Werkzeug der Normalisierung. **Voll funktional** abhängig ist ein Attribut, das vom gesamten zusammengesetzten Schlüssel abhängt; **partiell** abhängig, wenn schon ein Teil des Schlüssels reicht (verletzt die 2. NF); **transitiv** abhängig, wenn es über ein anderes Nichtschlüsselattribut vom Schlüssel abhängt (verletzt die 3. NF).

### Beispiel
In `bestellposition(bestell_id, produkt_id, menge, bezeichnung)` gilt:
- (bestell_id, produkt_id) → menge – voll funktional
- produkt_id → bezeichnung – partiell, also Produktdaten in eine eigene Tabelle auslagern

### Abgrenzung
Die Richtung zählt: kunden_id → kundenname gilt, kundenname → kunden_id nicht (zwei Kunden können gleich heißen).

### Prüfungsfalle
Aus ein paar Beispielzeilen auf eine Abhängigkeit schließen – sie muss fachlich für alle möglichen Daten gelten.

### Merksatz
Kennst du A, kennst du B.

Siehe auch: Partielle Abhängigkeit · Transitive Abhängigkeit · 2. Normalform · 3. Normalform · Normalisierung
Mehr: Deep Dive 2, 2.1

## Funktionstrennung
<!-- id: funktionstrennung · quellen: Karte DD10, DD10 4.3 · stand: 2026-10 -->

Organisatorisches Sicherheitsprinzip: Unvereinbare Aufgaben werden auf verschiedene Personen verteilt (engl. segregation of duties).

### Erklärung
Wer eine Aufgabe ausführt, soll sie nicht zugleich freigeben oder kontrollieren. Das verhindert Betrug und unbemerkte Fehler, weil eine einzelne Person eine kritische Handlung nicht allein vollenden kann. Umgesetzt wird es im Berechtigungskonzept, z. B. über Rollen (RBAC), die sich gegenseitig ausschließen.

### Beispiel
In der Buchhaltung darf die Person, die eine Lieferantenzahlung anlegt, sie nicht freigeben. Im Datenprojekt entwickelt der Entwickler das ETL-Skript, eingespielt in die Produktion wird es von einer anderen Rolle.

### Abgrenzung
Das **Vier-Augen-Prinzip** lässt eine zweite Person dieselbe Handlung prüfen; Funktionstrennung verteilt verschiedene Teilaufgaben. **Least Privilege** begrenzt den Umfang der Rechte einer Person.

### Merksatz
Wer anlegt, gibt nicht frei.

Siehe auch: Vier-Augen-Prinzip · Least Privilege · Need-to-know · RBAC
Mehr: Deep Dive 10, 4.3

## Fusion
<!-- id: fusion · quellen: Karte DD14, DD14 3.4 · stand: 2026-10 -->

Verschmelzung mehrerer Unternehmen zu einem einzigen Unternehmen; mindestens eines verliert seine rechtliche Selbstständigkeit.

### Erklärung
Die Fusion ist die stärkste Form der **Konzentration**. Bei der Verschmelzung durch Aufnahme geht ein Unternehmen im anderen auf, bei der Verschmelzung durch Neugründung entsteht ein neues Unternehmen (Umwandlungsgesetz). Große Zusammenschlüsse prüft das **Bundeskartellamt** (bzw. die EU-Kommission), damit keine marktbeherrschende Stellung entsteht.

### Abgrenzung
| Form | Rechtliche Selbstständigkeit | Wirtschaftliche Selbstständigkeit |
|---|---|---|
| Kooperation (z. B. Arbeitsgemeinschaft) | bleibt | bleibt weitgehend |
| Konzern | bleibt | geht verloren (einheitliche Leitung) |
| Fusion | geht verloren | geht verloren |

### Beispiel
Die Möbelhaus Nordholz GmbH übernimmt einen regionalen Küchenhändler und verschmilzt ihn auf sich; der Händler erlischt als eigene Gesellschaft.

### Prüfungsfalle
Konzern und Fusion verwechseln: Im Konzern bleiben die Gesellschaften rechtlich bestehen.

### Merksatz
Fusion: aus zwei mach eins.

Siehe auch: Konzern · Konzentration · Kooperation · Kartell
Mehr: Deep Dive 14, 3.4

## Fußgesteuerte Schleife
<!-- id: fussgesteurte-schleife · quellen: Karte DD11, DD17 4.2, DD11 B2 · stand: 2026-10 -->

Schleife, deren Bedingung **nach** jedem Durchlauf geprüft wird, sodass der Rumpf mindestens einmal läuft (WIEDERHOLE … BIS).

### Erklärung
Im Struktogramm steht der Rumpf oben und die Bedingung unten (umgedrehtes L). Typisch ist die Eingabeprüfung: Erst wird eingelesen, dann geprüft, ob wiederholt werden muss. Achtung bei der Formulierung: „WIEDERHOLE … BIS Bedingung“ läuft, bis die Bedingung **wahr** ist; „do … while Bedingung“ in vielen Programmiersprachen läuft, solange sie wahr ist.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 120" width="340" height="120" role="img" aria-label="Struktogramm: fußgesteuerte Schleife">
<rect x="10" y="10" width="300" height="100" class="dg-form"/>
<line x1="40" y1="10" x2="40" y2="78" class="dg-linie"/>
<line x1="40" y1="44" x2="310" y2="44" class="dg-linie"/>
<line x1="10" y1="78" x2="310" y2="78" class="dg-linie"/>
<text x="50" y="27" dominant-baseline="middle">Eingabe: menge</text>
<text x="50" y="61" dominant-baseline="middle" class="dg-klein">Hinweis bei ungültiger Eingabe</text>
<text x="20" y="94" dominant-baseline="middle" class="dg-fett">bis menge &gt; 0</text>
</svg>
```

### Beispiel
```text
WIEDERHOLE
  Eingabe: menge
BIS menge > 0
```

### Abgrenzung
Die kopfgesteuerte Schleife (SOLANGE … ) prüft vorher und kann null Mal laufen – z. B. Datei zeilenweise lesen.

### Merksatz
Fußgesteuert: erst machen, dann prüfen – mindestens einmal.

Siehe auch: Kopfgesteuerte Schleife · Struktogramm · Wiederholung · Pseudocode
Mehr: Deep Dive 17, 4.2 · Deep Dive 11, B2

## Ausgelassen
- Fachliche Deutung – Beispielergebnis Clustering
- Form – Listenpunkt Streudiagramm
- Formel (Prüfungsschreibweise) – Etikett Korrelationsformel
