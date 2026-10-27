# Musterlösungen Übungsklausur Qualitätssicherung, Testen & Verfügbarkeit (Deep Dive 16)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Punkte gibt es für Zuordnungen mit Begründung und für vollständige Rechenwege. Ein richtiges Ergebnis ohne Ansatz bringt höchstens die Hälfte. 92+ P = sehr gut.

---

## Block A – Qualitätssicherung und Teststufen (22 P)

**A1 (6 P):**
**Konstruktive** Qualitätssicherung soll Fehler von vornherein **vermeiden**, **analytische** Qualitätssicherung soll vorhandene Fehler **finden**, indem Ergebnisse geprüft werden. *(2 P)*

Maßnahmen *(je 1 P)*:
- konstruktiv: einheitliche Namenskonventionen für Tabellen und Kennzahlen · Vorlage für SQL-Skripte und Kennzahlendefinitionen · Validierungsregeln beim Laden (Pflichtfelder, Datentypen) · Schulung der Entwickler
- analytisch: Review der Kennzahlendefinitionen mit der Fachabteilung · Summenabgleich zwischen Shopsystem und Data Warehouse · Systemtest des Dashboards gegen das Pflichtenheft · Abnahmetest durch die Buchhaltung

**A2 (8 P):** *(je 1 P Teststufe, 1 P Begründung)*

| Fall | Teststufe | Begründung |
|---|---|---|
| (a) Die Fachabteilung prüft anhand des Lastenhefts, ob der Monatsbericht ihren Anforderungen genügt. | **Abnahmetest** | Der Auftraggeber prüft gegen das Lastenheft, ob das Ergebnis für den Einsatz geeignet ist |
| (b) Ein Entwickler prüft die SQL-Funktion zur Berechnung der Versandkosten. | **Komponententest** | Eine einzelne Funktion wird isoliert vom Entwickler geprüft |
| (c) Es wird geprüft, ob die ETL-Strecke die Daten aus dem Shopsystem vollständig übernimmt. | **Integrationstest** | Geprüft wird das Zusammenspiel zweier Systeme über die Schnittstelle Shop → Data Warehouse |
| (d) Das Testteam prüft das gesamte Reporting in der Testumgebung gegen das Pflichtenheft. | **Systemtest** | Das Gesamtsystem wird vom Testteam in der Testumgebung gegen das Pflichtenheft geprüft |

**A3 (4 P):**
- **Fehlhandlung:** Der Entwickler verwechselt beim Schreiben des Skripts Netto- und Bruttobetrag. *(1 P)*
- **Fehlerzustand:** Das Skript summiert die Spalte mit den Bruttobeträgen. *(1 P)*
- **Fehlerwirkung:** Das Dashboard zeigt einen um 19 % zu hohen Umsatz. *(2 P)*

**A4 (4 P):**
Ein Fehler im Pflichtenheft wird in alle folgenden Phasen übernommen – in Datenmodell, ETL-Strecke, Dashboard und sogar in die Testfälle, die aus dem Pflichtenheft abgeleitet werden. Ein Test findet ihn deshalb oft gar nicht oder erst bei der Abnahme. *(2 P)*
Je später ein Fehler entdeckt wird, desto teurer ist seine Behebung, weil mehr bereits Erstelltes geändert werden muss. Ein Review kostet wenige Stunden und findet solche Fehler, bevor Folgekosten entstehen. *(2 P)*

---

## Block B – Testverfahren (24 P)

**B1 (6 P):** *(je Kriterium 2 P)*

| | Black-Box-Test | White-Box-Test |
|---|---|---|
| Grundlage | Spezifikation (Pflichtenheft), Code unbekannt | Quellcode, innere Struktur bekannt |
| Fragestellung | Erfüllt das System die Anforderungen? | Werden alle Anweisungen bzw. Zweige durchlaufen? |
| Verfahren | Äquivalenzklassen, Grenzwertanalyse | Anweisungsüberdeckung (C0), Zweigüberdeckung (C1) |

**B2 (12 P):**
a) *(je Klasse 1 P, sechs Klassen)*

| Klasse | Bereich | gültig? | Repräsentant | Erwartetes Ergebnis |
|---|---|---|---|---|
| ÄK1 | kleiner als 1 (0 und negativ) | ungültig | −3 | Fehlermeldung |
| ÄK2 | 1 bis 5 | gültig | 3 | Paketversand |
| ÄK3 | 6 bis 20 | gültig | 12 | Spedition |
| ÄK4 | größer als 20 | gültig | 35 | Sonderanfrage |
| ÄK5 | keine ganze Zahl | ungültig | 2,5 | Fehlermeldung |
| ÄK6 | keine Zahl (Text, leer) | ungültig | „drei“ | Fehlermeldung |

b) Testwerte der Grenzwertanalyse: **0 und 1** (untere Grenze), **5 und 6**, **20 und 21** *(4 P; je Grenze 1 P, 1 P für beide Seiten jeder Grenze)*

c) Fehler entstehen bevorzugt an den Grenzen, etwa durch `<` statt `<=` im Code. Ein beliebiger Repräsentant aus der Mitte einer Klasse (z. B. 12) deckt einen solchen Fehler nicht auf; erst der Test von 20 und 21 zeigt, ob 20 Packstücke noch per Spedition gehen. *(2 P)*

*Prüferkommentar: Die ungültigen Klassen sind der häufigste Punktverlust. Wer nur ÄK2 bis ÄK4 bildet, erhält in a) höchstens 3 von 6 P.*

**B3 (6 P):**
Ein **Regressionstest** hätte den Fehler verhindert: Nach jeder Änderung werden die bereits bestandenen Testfälle – auch die zu den Versandkosten – erneut ausgeführt, um unbeabsichtigte Nebenwirkungen zu entdecken. *(3 P)*
Er eignet sich für eine Automatisierung, weil dieselben Testfälle mit feststehenden erwarteten Ergebnissen nach **jeder** Änderung immer wieder laufen müssen. Manuell wäre das aufwendig und fehleranfällig; automatisiert läuft er nach jedem Ladelauf oder jeder Codeänderung ohne Mehraufwand. *(3 P)*

---

## Block C – Testkonzept und Abnahme (20 P)

**C1 (6 P):** *(je Bestandteil 1 P)*

| Feld | Inhalt |
|---|---|
| ID | TF-ETL-03 |
| Testobjekt | ETL-Strecke Bestellungen, Anforderung „vollständige und korrekte Übernahme“ |
| Vorbedingung | Testdatenbestand mit allen Bestellungen eines Monats in der Quelle, Zieltabelle für den Monat leer |
| Testdaten / Eingabe | Monat April im Testshop, z. B. 2.400 Bestellungen |
| Erwartetes Ergebnis | gleiche Anzahl Datensätze im Ziel wie in der Quelle; Summe der Nettobeträge im Ziel = Summe in der Quelle (auf den Cent) |
| Tatsächliches Ergebnis / Status | bei der Durchführung eintragen; bestanden nur, wenn Anzahl und Summe exakt übereinstimmen |

**C2 (6 P):** *(je Prüfung mit aufgedecktem Fehler 2 P)*

| Prüfung | aufgedeckter Fehler |
|---|---|
| Dublettenprüfung auf die Bestellnummer im Ziel | doppelt geladene Datensätze, etwa nach einem wiederholten Ladelauf |
| Prüfung auf NULL-Werte in Pflichtfeldern (Kunde, Datum, Betrag) | fehlerhafte Zuordnungen oder abgeschnittene Datensätze |
| Plausibilitätsprüfung (keine negativen Mengen, Bestelldatum nicht in der Zukunft, Versandkosten im erwarteten Bereich) | Umrechnungs- und Formatfehler |

Ebenfalls anerkannt: Referenzprüfung (jede Bestellung hat einen existierenden Kunden), Abgleich mit einer von Hand nachgerechneten Stichprobe, Prüfung der Ladeprotokolle auf abgewiesene Datensätze.

**C3 (8 P):**
Inhalte des Abnahmeprotokolls *(je 1 P, vier genügen)*: Projekt bzw. Liefergegenstand mit Version · Datum und Teilnehmer · geprüfte Abnahmekriterien mit Ergebnis · festgestellte Mängel mit Frist zur Behebung · Entscheidung (Abnahme, Abnahme unter Vorbehalt, Ablehnung) · Unterschriften beider Seiten.

Rechtsfolgen *(je 2 P, zwei genügen)*:
- Die **Vergütung wird fällig** (§ 641 BGB).
- Die **Gewährleistungsfrist beginnt** zu laufen (§ 634a Abs. 2 BGB).
- Die **Beweislast kehrt sich um**: Nach der Abnahme muss der Auftraggeber nachweisen, dass ein Mangel vorliegt.
- Die **Gefahr geht über** (§ 644 BGB): Das Risiko des zufälligen Untergangs oder der zufälligen Verschlechterung trägt ab jetzt der Auftraggeber.

---

## Block D – Verfügbarkeit (22 P)

**D1 (6 P):**
Betriebszeit im Monat: $30 \cdot 24 = 720\ \text{h}$

a) Erlaubte Ausfallzeit: $720\ \text{h} \cdot (1 - 0{,}995)$ = **3,6 Stunden** *(2 P)*

b) Tatsächliche Verfügbarkeit: $V = \frac{720 - 4{,}5}{720} \cdot 100\ \%$ = **99,375 %** *(2 P)*
Das SLA ist **nicht eingehalten**: 99,375 % liegt unter 99,5 % bzw. 4,5 h Ausfall liegen über den erlaubten 3,6 h. *(2 P)*

**D2 (6 P):**
Verfügbarkeit: $V = \frac{MTBF}{MTBF + MTTR} = \frac{1.990}{1.990 + 10}$ = **99,5 %** *(3 P)*
Ausfallzeit pro Jahr: $8.760\ \text{h} \cdot (1 - 0{,}995)$ = **43,8 Stunden** *(3 P)*

**D3 (10 P):**
a) Reihenschaltung – alle Komponenten müssen laufen: $V = 0{,}99 \cdot 0{,}995 \cdot 0{,}98$ = **96,535 %** *(4 P)*

b) Gespiegelte Datenbank (Parallelschaltung): $V_{DB} = 1 - (1 - 0{,}98)^2 = 1 - 0{,}0004 = 0{,}9996$
Gesamtsystem: $V = 0{,}99 \cdot 0{,}995 \cdot 0{,}9996$ = **98,466 %** *(4 P)*

c) Die Datenbank hat mit 98 % die **geringste Verfügbarkeit** und ist damit die schwächste Stelle der Reihenschaltung. Redundanz an dieser Stelle bringt den größten Gewinn: Die Ausfallzeit pro Jahr sinkt von rund 304 auf rund 134 Stunden. *(2 P)*

*Prüferkommentar: Häufigster Fehler in b) ist 0,98 · 0,98 – damit sinkt die Verfügbarkeit, obwohl ein zweiter Server hinzukommt. Bei der Parallelschaltung werden die Ausfallwahrscheinlichkeiten multipliziert, nicht die Verfügbarkeiten.*

---

## Block E – SLA und Redundanz (12 P)

**E1 (6 P):**
Inhalte *(je 1 P, vier genügen)*: Leistungsbeschreibung · Servicezeit und zugesicherte Verfügbarkeit · Reaktions- und Wiederherstellungszeiten nach Priorität · Messverfahren und Reporting · Eskalationswege und Ansprechpartner · Vertragsstrafen bei Nichteinhaltung · Wartungsfenster.

Abgrenzung *(2 P)*: Die **Reaktionszeit** ist die Zeit von der Störungsmeldung bis zum Beginn der Bearbeitung. Die **Wiederherstellungszeit** ist die Zeit, bis der Dienst wieder nutzbar ist. Eine kurze Reaktionszeit allein sagt nichts darüber, wann das Reporting wieder läuft.

**E2 (6 P):**
Ein **Single Point of Failure** ist eine Komponente, deren Ausfall allein das gesamte System lahmlegt – im Szenario etwa der einzelne Datenbankserver: Fällt er aus, ist das Dashboard nicht erreichbar, obwohl Web- und Anwendungsserver laufen. *(2 P)*

Maßnahmen *(je 1 P)*: Datenbank spiegeln bzw. als Cluster betreiben · mehrere Webserver hinter einem Load Balancer · USV und Notstrom · redundante Netzanbindung · zweites Rechenzentrum (Georedundanz).

Keine Datensicherung *(2 P)*: Redundante Systeme übernehmen **jede Änderung sofort** – auch versehentliches Löschen, fehlerhafte Ladeläufe oder eine Verschlüsselung durch Ransomware. Sie schützen vor dem Ausfall von Hardware, nicht vor dem Verlust oder der Verfälschung von Daten. Dafür braucht es ein Backup mit mehreren Ständen (→ Deep Dive 10).

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Teststrategie direkt in das Qualitätskapitel deiner Projektdoku übernehmen |
| 81–91 | gut | Prüfe, ob die Punkte bei den ungültigen Äquivalenzklassen oder der Parallelschaltung fehlten |
| < 81 | | Teil 2 und Teil 4 wiederholen, Klausur nach einer Woche neu schreiben |
