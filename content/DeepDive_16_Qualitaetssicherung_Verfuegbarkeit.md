# Deep Dive 16: Qualitätssicherung, Testen & Verfügbarkeit
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Die Themenliste nennt im Bereich „Durchführen einer Prozessanalyse“ ausdrücklich „Qualitätssicherung: Reviews, Testarten, Abnahmekriterien, Soll-Ist-Vergleich“ und im Bereich „Sicherstellen der Datenqualität“ „Verfügbarkeit, SLA, Redundanz“. Dazu kommt deine Projektdokumentation: Jede Doku braucht ein Kapitel zur Qualitätssicherung, und im Fachgespräch fällt fast immer die Frage „Wie haben Sie sichergestellt, dass Ihre Ergebnisse stimmen?“.

Typische Aufgaben: Teststufen und Testverfahren zuordnen, **Äquivalenzklassen und Grenzwerte** bilden, einen Testfall formulieren, ein Abnahmeprotokoll beschreiben, **Verfügbarkeiten berechnen** (SLA, MTBF, Reihen- und Parallelschaltung) und Redundanzmaßnahmen begründen.

Szenario: Die **Möbelhaus Nordholz GmbH** führt ein neues Reporting mit ETL-Strecke und Dashboard ein und schließt mit einem Rechenzentrum einen Servicevertrag ab.

---

# Teil 1 – Qualitätssicherung im Überblick

## 1.1 Konstruktiv oder analytisch?

| | Konstruktive Qualitätssicherung | Analytische Qualitätssicherung |
|---|---|---|
| Ziel | Fehler **vermeiden** | Fehler **finden** |
| Zeitpunkt | vor und während der Entwicklung | nach Fertigstellung eines (Teil-)Ergebnisses |
| Beispiele | Namenskonventionen, Vorlagen, Programmierrichtlinien, Schulung, Validierungsregeln im Eingabeformular, Vier-Augen-Prinzip beim Entwurf | Tests, Reviews, statische Codeanalyse, Datenabgleich |

**Qualitätssicherung** umfasst alle geplanten Maßnahmen, die Qualität herbeiführen. **Qualitätskontrolle** ist der prüfende Teil davon: Das Ergebnis wird gegen die Anforderungen gemessen – im Projekt meist als **Soll-Ist-Vergleich** gegen das Pflichtenheft (→ Deep Dive 12).

Zur konstruktiven Qualitätssicherung gehört auch eine **Versionsverwaltung** (z. B. Git) für SQL-Skripte, ETL-Jobs und Berichtsdefinitionen: Jede Änderung ist nachvollziehbar (wer, wann, warum), ein fehlerhafter Stand lässt sich zurückholen, und mehrere Personen können parallel arbeiten, ohne sich Änderungen zu überschreiben.

**Qualitätsmerkmale von Software (ISO/IEC 25010):** Die aktuelle Fassung **ISO/IEC 25010:2023** nennt neun Merkmale: funktionale Eignung, Leistungseffizienz, Kompatibilität, Interaktionsfähigkeit (früher Benutzbarkeit), Zuverlässigkeit (mit dem Teilmerkmal Verfügbarkeit → Teil 4), Sicherheit (Informationssicherheit, engl. security), Wartbarkeit, Flexibilität (früher Übertragbarkeit) und neu die Betriebssicherheit (engl. safety: keine Gefahr für Menschen und Umwelt). Ältere Unterlagen und Prüfungen nutzen oft noch die acht Merkmale der Fassung von 2011 (mit Benutzbarkeit und Übertragbarkeit, ohne Betriebssicherheit) oder die sechs der Vorgängernorm ISO/IEC 9126 (Funktionalität, Zuverlässigkeit, Benutzbarkeit, Effizienz, Änderbarkeit, Übertragbarkeit). Die Merkmale sind die Vorlage für **nicht-funktionale Anforderungen** und damit auch für nicht-funktionale Tests.

Qualitätssicherung im Projekt ist Teil eines übergreifenden **Qualitätsmanagements** (QM-System nach ISO 9001, PDCA-Zyklus, FMEA, Ishikawa-Diagramm) – das ist in Deep Dive 5 ausführlich behandelt.

## 1.2 Statisch oder dynamisch prüfen?

- **Statische Prüfung:** Das Prüfobjekt wird **nicht ausgeführt**. Dazu gehören **Reviews** von Dokumenten, Datenmodellen, SQL-Skripten oder Code und die **statische Codeanalyse** durch Werkzeuge (Linter), die etwa ungenutzte Variablen oder unsichere Konstrukte melden.
- **Dynamische Prüfung:** Das Programm bzw. die ETL-Strecke **wird ausgeführt** und das Ergebnis mit dem erwarteten verglichen – das ist ein **Test**.

Review-Arten (von locker bis formal): **informelles Review** (Kollege schaut drüber, ohne festen Ablauf, z. B. Pair Programming), **Walkthrough** (Autor stellt das Ergebnis vor, Ziel: Verständnis und Hinweise), **technisches Review** (Fachkollegen prüfen gegen Vorgaben), **Inspektion** (formal mit Rollen, Checklisten, Protokoll und Metriken). Reviews finden Fehler früh und billig – ein Fehler im Pflichtenheft, der erst im Abnahmetest auffällt, kostet ein Vielfaches.

## 1.3 Fehlerbegriffe

| Begriff | Bedeutung | Beispiel |
|---|---|---|
| **Fehlhandlung** (Irrtum) | menschlicher Fehler | Entwickler verwechselt Netto und Brutto |
| **Fehlerzustand** (Defekt, Bug) | Fehler im Code, Skript oder Modell | Umsatzspalte summiert Bruttobeträge |
| **Fehlerwirkung** (Ausfall) | sichtbares Fehlverhalten bei der Ausführung | Dashboard zeigt 19 % zu hohen Umsatz |

**Testen** zeigt Fehlerwirkungen; **Debugging** ist die anschließende Suche und Behebung des Fehlerzustands – etwa mit **Breakpoints** (Haltepunkten), an denen das Programm anhält, damit man Variablenwerte prüfen kann. Ein Test kann nur die **Anwesenheit** von Fehlern zeigen, nie ihre Abwesenheit.

> ❓ **Prüferfrage:** Ihr Kollege sagt: „Ich habe alles getestet, die Anwendung ist fehlerfrei.“ Wie bewerten Sie die Aussage?
> *Vollständiges Testen ist praktisch unmöglich – schon wenige Eingabefelder ergeben eine riesige Zahl an Kombinationen. Tests zeigen nur, dass in den geprüften Fällen keine Fehlerwirkung auftrat. Belastbar wird die Aussage erst mit einem Testkonzept: Welche Anforderungen wurden mit welchen Verfahren abgedeckt, welche Ende-Kriterien galten und welche Fehler sind noch offen?*

---

# Teil 2 – Teststufen und Testverfahren

## 2.1 Die vier Teststufen (V-Modell)

| Teststufe | Was wird geprüft? | Wer testet? | Grundlage |
|---|---|---|---|
| **Komponententest** (Modul-, Unit-Test) | eine einzelne Funktion, ein SQL-Skript, eine Transformation | Entwickler | technischer Entwurf |
| **Integrationstest** | Zusammenspiel der Komponenten, **Schnittstellen** | Entwickler / Testteam | Architektur, Schnittstellenbeschreibung |
| **Systemtest** | das Gesamtsystem in einer Testumgebung | Testteam | **Pflichtenheft** |
| **Abnahmetest** | Eignung für den Einsatz unter realen Bedingungen | **Auftraggeber / Fachbereich** | **Lastenheft**, Abnahmekriterien |

Im **V-Modell** steht jeder Entwicklungsphase auf der linken Seite eine Teststufe auf der rechten Seite gegenüber: Anforderungen ↔ Abnahmetest, Systementwurf ↔ Systemtest, Architektur ↔ Integrationstest, Komponentenentwurf ↔ Komponententest. Die Testfälle entstehen schon zusammen mit der jeweiligen Entwurfsphase.

Hinweis: Der aktuelle ISTQB-Lehrplan (Foundation Level 4.0) teilt den Integrationstest in **Komponentenintegrationstest** (Zusammenspiel der Bausteine eines Systems) und **Systemintegrationstest** (Zusammenspiel mit anderen Systemen, z. B. Shop → Data Warehouse) und kommt so auf fünf Teststufen. In IHK-Aufgaben genügen meist die vier klassischen Stufen.

## 2.2 Black-Box und White-Box

| | Black-Box-Test | White-Box-Test |
|---|---|---|
| Grundlage | Spezifikation – der Code ist **unbekannt** | Quellcode – die **innere Struktur** ist bekannt |
| Frage | Tut das System, was es soll? | Wird jeder Teil des Codes durchlaufen? |
| Verfahren | **Äquivalenzklassen**, **Grenzwertanalyse**, Entscheidungstabellen, Zustandsübergänge | **Anweisungsüberdeckung** (C0), **Zweigüberdeckung** (C1) |
| Typische Stufe | System- und Abnahmetest | Komponententest |

- **Äquivalenzklasse:** Menge von Eingaben, bei denen das System sich gleich verhalten soll. Aus jeder Klasse genügt **ein Repräsentant** – es gibt **gültige** und **ungültige** Klassen.
- **Grenzwertanalyse:** Fehler sitzen bevorzugt an den Rändern (`<` statt `<=`). Getestet werden deshalb die Werte **direkt an und neben jeder Grenze**.
- **Anweisungsüberdeckung (C0):** Jede Anweisung wird mindestens einmal ausgeführt. **Zweigüberdeckung (C1):** Jeder Zweig jeder Verzweigung (also auch der leere Else-Zweig) wird mindestens einmal durchlaufen – C1 ist strenger als C0.
- Beispiel: Bei `IF menge > 20 THEN status = 'Sonderanfrage'` ohne Else erreicht ein einziger Test mit menge = 25 schon 100 % Anweisungsüberdeckung, aber nur 50 % Zweigüberdeckung – erst ein zweiter Test mit menge = 10 durchläuft auch den leeren Else-Zweig. 100 % C1 schließt 100 % C0 ein, umgekehrt nicht. Überdeckungsgrad = durchlaufene Anweisungen (bzw. Zweige) / alle Anweisungen (bzw. Zweige) · 100 %.
- **Entscheidungstabellentest:** Für Regeln mit mehreren Bedingungen werden alle Kombinationen der Bedingungen (bei n Ja/Nein-Bedingungen bis zu 2ⁿ Regeln) mit der jeweils erwarteten Aktion in einer Tabelle aufgelistet; jede Spalte (Regel) wird ein Testfall.
- **Zustandsübergangstest:** Für Systeme mit Zuständen (z. B. Bestellung: angelegt → bezahlt → versendet → storniert) wird jeder erlaubte Übergang mindestens einmal getestet – und geprüft, dass unerlaubte Übergänge (versendet → angelegt) abgewiesen werden.
- **Grey-Box:** Mischform, z. B. ein Test der Schnittstelle mit Kenntnis des Datenmodells.

## 2.3 Durchgerechnetes Beispiel – Äquivalenzklassen und Grenzwerte

Regel aus dem Pflichtenheft: Bestellwert unter 500 € → kein Rabatt; 500 € bis unter 2.000 € → 5 %; ab 2.000 € → 10 %. Negative Bestellwerte sind ungültig.

| Klasse | Bereich | gültig? | Repräsentant | Erwartet |
|---|---|---|---|---|
| ÄK1 | unter 0 € | ungültig | −50 € | Fehlermeldung |
| ÄK2 | 0 € bis 499,99 € | gültig | 250 € | 0 % |
| ÄK3 | 500 € bis 1.999,99 € | gültig | 1.200 € | 5 % |
| ÄK4 | ab 2.000 € | gültig | 3.500 € | 10 % |
| ÄK5 | keine Zahl (Text, leer) | ungültig | „abc“ | Fehlermeldung |

Grenzwerte: −0,01 € · 0,00 € · 499,99 € · 500,00 € · 1.999,99 € · 2.000,00 € – je Grenze der letzte Wert der einen und der erste Wert der nächsten Klasse.

Mit **5 Repräsentanten und 6 Grenzwerten = 11 Testfällen** ist die Regel systematisch abgedeckt. Wer stattdessen „ein paar Werte ausprobiert“, übersieht genau den typischen Fehler: Bei 500,00 € wird kein Rabatt gewährt, weil im Code `> 500` statt `>= 500` steht.

## 2.4 Weitere Testarten

- **Regressionstest:** Nach jeder Änderung werden bereits bestandene Tests **wiederholt**, um ungewollte Nebenwirkungen zu finden. Weil das oft passiert, lohnt sich hier **Testautomatisierung**.
- **Fehlernachtest** (Bestätigungstest, Re-Test): Nach der Behebung eines Fehlers wird genau der fehlgeschlagene Testfall wiederholt, um zu bestätigen, dass der Fehler behoben ist. Abgrenzung: Der Fehlernachtest prüft die Korrektur, der Regressionstest prüft, ob die Korrektur woanders etwas kaputt gemacht hat.
- Funktionale Tests prüfen *was* das System tut, **nicht-funktionale** *wie gut*: **Last- und Performancetest** (Antwortzeit bei 200 gleichzeitigen Nutzern; beim **Stresstest** wird die Last bis über die Belastungsgrenze gesteigert), **Usability-Test** (→ Deep Dive 11), **Sicherheitstest** bzw. Penetrationstest (→ Deep Dive 10).
- **Smoke-Test:** kurzer Grundtest nach einer Installation – startet das System, lässt sich der Bericht öffnen?
- **Testpyramide:** Viele schnelle, billige Komponententests bilden die Basis, darüber weniger Integrationstests, an der Spitze wenige langsame und teure End-to-End- bzw. Oberflächentests. Wer überwiegend über die Oberfläche testet („Eistüte“), bekommt langsame, wartungsintensive Tests.
- **Testgetriebene Entwicklung** (TDD, Test-Driven Development): Zuerst wird ein Test geschrieben, der fehlschlägt (Red), dann gerade so viel Code, dass er besteht (Green), anschließend wird der Code aufgeräumt (Refactor). Ergebnis: Jede Funktion hat von Anfang an automatisierte Komponententests, die als Regressionstests weiterlaufen.

## 2.5 Testen in der Datenanalyse

Bei ETL-Strecken, SQL-Abfragen und Berichten gibt es typische Prüfungen, die du in Prüfung und Projekt nennen solltest:
- Datenabgleich Quelle ↔ Ziel: Anzahl der Datensätze, **Summenabgleich** (Umsatzsumme vor und nach dem Laden), Prüfsummen.
- Abfragen gegen bekannte Ergebnisse: eine kleine Testdatenmenge, deren richtiges Ergebnis von Hand ermittelt wurde.
- Plausibilitätsprüfungen der Ergebnisse: keine negativen Mengen, Anteile zwischen 0 und 100 %, Summen der Teile = Gesamtsumme (→ Deep Dive 9).
- Grenz- und Sonderfälle: NULL-Werte, Dubletten, leere Tabellen, Schaltjahr, Monatswechsel.
- Testdaten: Echte personenbezogene Daten gehören nicht in die Testumgebung (→ Deep Dive 10). Besser: **anonymisierte** Produktivdaten oder **synthetische Testdaten** aus einem **Testdatengenerator**, der realistische, aber erfundene Datensätze erzeugt – inklusive gezielt eingebauter Fehler und Grenzfälle.

---

# Teil 3 – Testkonzept, Testfall und Abnahme

## 3.1 Das Testkonzept

Das **Testkonzept** (Testplan) legt vor Testbeginn fest, *was*, *wie*, *womit* und *bis wann* getestet wird:
- Testobjekte und Testziele (welche Anforderungen?)
- Teststufen und Testverfahren
- Testumgebung und Testdaten
- **Ende-Kriterien:** wann ist genug getestet? (z. B. alle Muss-Anforderungen getestet, keine offenen Fehler der Klasse „kritisch“)
- Rollen, Zeitplan, Umgang mit gefundenen Fehlern

## 3.2 Der Testfall

| Feld | Beispiel (ETL-Monatsbericht) |
|---|---|
| ID | TF-07 |
| Testobjekt / Anforderung | Ladeprozess Umsatzdaten, Anforderung A-12 |
| Vorbedingung | Quelltabelle mit 1.250 Bestellungen vom März, Zieltabelle leer |
| Eingabe / Testdaten | Testdatensatz „Maerz_Test.csv“ |
| Erwartetes Ergebnis | 1.250 Zeilen geladen, Umsatzsumme 184.320,50 € wie in der Quelle |
| Tatsächliches Ergebnis | wird bei der Durchführung eingetragen |
| Status | bestanden / nicht bestanden |

Das **erwartete Ergebnis wird vor der Durchführung** festgelegt – sonst „passt“ man es nachträglich an das tatsächliche an.

## 3.3 Testprotokoll und Fehlerklassen

Das **Testprotokoll** dokumentiert jede Durchführung: Datum, Tester, Version des Testobjekts, Testumgebung, tatsächliches Ergebnis, Status und Verweis auf gemeldete Fehler. Gefundene Fehler werden nach Schwere eingestuft, z. B. **kritisch** (Einsatz unmöglich, falsche Zahlen), **hoch**, **mittel**, **niedrig** (Schönheitsfehler). Die Fehlerklasse entscheidet, ob eine Abnahme möglich ist.

## 3.4 Die Abnahme

- Grundlage sind die vorab vereinbarten **Abnahmekriterien** (messbar, aus dem Lasten-/Pflichtenheft).
- Das **Abnahmeprotokoll** enthält: Projekt und Version, Datum, Beteiligte, geprüfte Kriterien mit Ergebnis, festgestellte **Mängel** mit Frist zur Behebung, die **Entscheidung** (Abnahme, Abnahme unter Vorbehalt, Ablehnung) und die Unterschriften.
- Rechtsfolgen der Abnahme beim Werkvertrag (§ 640 BGB): Die **Vergütung wird fällig** (§ 641 BGB), die **Gewährleistungsfrist beginnt** (Verjährung der Mängelansprüche, § 634a Abs. 2 BGB), die **Gefahr geht über** (§ 644 BGB) und die **Beweislast kehrt sich um** – nach der Abnahme muss der Auftraggeber einen Mangel nachweisen.
- Weitere Regeln aus § 640 BGB: Wegen unwesentlicher Mängel darf die Abnahme nicht verweigert werden (Abs. 1). Setzt der Auftragnehmer nach Fertigstellung eine angemessene Frist und verweigert der Auftraggeber die Abnahme nicht unter Angabe mindestens eines Mangels, gilt das Werk als abgenommen (**fiktive Abnahme**, Abs. 2). Ist der Besteller ein Verbraucher, gilt das nur, wenn der Unternehmer ihn zusammen mit der Aufforderung in Textform auf diese Folge hingewiesen hat (Abs. 2 Satz 2). Wer einen bekannten Mangel nicht ausdrücklich vorbehält, verliert die Rechte auf Nacherfüllung, Selbstvornahme, Rücktritt und Minderung wegen dieses Mangels (Abs. 3) – deshalb gehören bekannte Mängel ins Abnahmeprotokoll.

---

# Teil 4 – Verfügbarkeit und Service Level Agreement

## 4.1 Verfügbarkeit berechnen

**Verfügbarkeit:** Anteil der vereinbarten Betriebszeit, in der ein System tatsächlich nutzbar ist. Formel: $V = \frac{\text{Betriebszeit} - \text{Ausfallzeit}}{\text{Betriebszeit}} \cdot 100\ \%$

Erlaubte Ausfallzeit bei einer Zielverfügbarkeit: $\text{Ausfall}_{max} = \text{Betriebszeit} \cdot (1 - V)$. Ein Jahr rund um die Uhr hat 365 · 24 = **8.760 Stunden**.

| Verfügbarkeit | erlaubte Ausfallzeit pro Jahr (24/7) | pro Monat (30 Tage, 24/7) |
|---|---|---|
| 99 % | 87,6 Stunden (gut 3,5 Tage) | 7,2 Stunden |
| 99,5 % | 43,8 Stunden | 3,6 Stunden |
| 99,9 % | 8,76 Stunden | 43,2 Minuten |
| 99,99 % | 52,56 Minuten | 4,32 Minuten |
| 99,999 % | 5,26 Minuten | rund 26 Sekunden |

Jede weitere „Neun“ verkürzt die erlaubte Ausfallzeit auf ein Zehntel – und kostet deutlich mehr Redundanz.

Das BSI ordnet Systeme im Hochverfügbarkeitskompendium in **Verfügbarkeitsklassen** ein: VK 0 (ohne zugesicherte Verfügbarkeit), VK 1 (normale Verfügbarkeit, 99 %), VK 2 (erhöhte Verfügbarkeit, 99,9 %), VK 3 (Hochverfügbarkeit, 99,99 %), VK 4 (Höchstverfügbarkeit, 99,999 %) und VK 5 (desastertolerant, auch bei Katastrophen). Beim BSI beginnt **Hochverfügbarkeit** also mit VK 3 (99,99 %); andere Quellen sprechen erst ab 99,999 % davon.

## 4.2 MTBF und MTTR

- **MTBF** (Mean Time Between Failures): mittlere Betriebszeit zwischen zwei Ausfällen – Maß für die **Zuverlässigkeit**.
- **MTTR** (Mean Time To Repair): mittlere Dauer bis zur Wiederherstellung – Maß für die **Wartbarkeit**.
- **MTTF** (Mean Time To Failure): mittlere Betriebsdauer bis zum Ausfall bei Teilen, die nicht repariert, sondern ausgetauscht werden (z. B. eine Festplatte).

Aus Betriebsdaten: $MTBF = \frac{\text{gesamte Laufzeit}}{\text{Anzahl Ausfälle}}$ und $MTTR = \frac{\text{gesamte Reparaturzeit}}{\text{Anzahl Ausfälle}}$

Formel: $V = \frac{MTBF}{MTBF + MTTR}$

⚠️ **Achtung:** Manche Quellen zählen die Reparaturzeit in die MTBF hinein (MTBF = MTTF + MTTR, also von Ausfall zu Ausfall). Dann lautet die Formel V = MTTF / MTBF. Lies in der Aufgabe genau, wie die Werte definiert sind.

**Beispiel:** Ein Server läuft im Mittel 990 Stunden zwischen zwei Ausfällen, die Reparatur dauert im Mittel 10 Stunden: $V = \frac{990}{990 + 10}$ = **99 %**. Die Verfügbarkeit steigt auf zwei Wegen: seltener ausfallen (MTBF hoch) oder **schneller wiederherstellen** (MTTR runter, z. B. durch Ersatzteile vor Ort und Bereitschaftsdienst).

## 4.3 Systeme aus mehreren Komponenten

- **Reihenschaltung** (seriell): Das System funktioniert nur, wenn **alle** Komponenten laufen. Die Verfügbarkeiten werden **multipliziert**: $V_{ges} = V_1 \cdot V_2 \cdot \ldots \cdot V_n$ – das Ergebnis ist immer **kleiner** als die schwächste Komponente.
- **Parallelschaltung** (redundant): Das System funktioniert, solange **mindestens eine** Komponente läuft. Multipliziert werden die **Ausfallwahrscheinlichkeiten**: $V_{ges} = 1 - (1 - V_1) \cdot (1 - V_2)$

**Beispiel:** Das Reporting braucht einen Webserver (99,9 %) und eine Datenbank (99 %).
- Reihenschaltung: $V = 0{,}999 \cdot 0{,}99$ = **98,901 %** – schlechter als jede einzelne Komponente.
- Die Datenbank wird gespiegelt (zwei Datenbankserver mit je 99 % parallel): $V_{DB} = 1 - (1 - 0{,}99)^2 = 1 - 0{,}0001$ = **99,990 %**.
- Gesamtsystem mit gespiegelter Datenbank: $V = 0{,}999 \cdot 0{,}9999$ = **99,890 %**.

**Merke:** Redundanz lohnt sich an der **schwächsten** Stelle. Eine Komponente, deren Ausfall allein das ganze System stoppt, heißt **Single Point of Failure**.

## 4.4 Das Service Level Agreement (SLA)

Ein **SLA** ist die vertragliche Vereinbarung über messbare Dienstleistungsqualität zwischen Dienstleister und Kunde. Typische Inhalte:
- Leistungsbeschreibung (welcher Dienst?)
- Servicezeit (z. B. 24/7 oder Mo–Fr 8–18 Uhr) und **Verfügbarkeit** innerhalb dieser Zeit
- **Reaktionszeit** (bis jemand mit der Bearbeitung beginnt) und **Wiederherstellungszeit** (bis der Dienst wieder läuft) – je nach **Priorität** der Störung
- Messverfahren und Berichtswesen (Reporting)
- Eskalationswege, Ansprechpartner
- Vertragsstrafe (Pönale, Gutschrift) bei Nichteinhaltung
- geplante Wartungsfenster (zählen meist **nicht** als Ausfall)

**Durchgerechnetes Beispiel:** Das SLA mit dem Rechenzentrum sichert 99,9 % Verfügbarkeit pro Jahr (24/7) zu. Im letzten Jahr gab es 12 Stunden ungeplanten Ausfall.
- Erlaubte Ausfallzeit: $8.760\ \text{h} \cdot (1 - 0{,}999)$ = **8,76 Stunden**
- Tatsächliche Verfügbarkeit: $V = \frac{8.760 - 12}{8.760} \cdot 100\ \%$ = **99,863 %**
- Das SLA ist **nicht eingehalten** (12 h > 8,76 h); die vereinbarte Vertragsstrafe wird fällig.

⚠️ **Achtung:** Die Verfügbarkeit bezieht sich immer auf die **vereinbarte Servicezeit**. 99,9 % bei Mo–Fr 8–18 Uhr ist eine ganz andere Zusage als 99,9 % rund um die Uhr.

## 4.5 Redundanz und Hochverfügbarkeit

| Maßnahme | schützt gegen |
|---|---|
| **RAID** (z. B. RAID 1, 5) | Ausfall einer Festplatte (→ Deep Dive 10) – **kein Backup** |
| **Cluster** aktiv/passiv bzw. aktiv/aktiv | Ausfall eines Servers; aktiv/aktiv verteilt zusätzlich die Last |
| **Load Balancer** | Überlastung und Ausfall einzelner Webserver |
| **USV** und Notstromaggregat | Stromausfall, Spannungsschwankungen |
| redundante Netzanbindung (zwei Provider) | Ausfall einer Leitung |
| **Georedundanz** (zweites Rechenzentrum) | Brand, Hochwasser, regionaler Stromausfall |

Redundanz erhöht die Verfügbarkeit, **ersetzt aber keine Datensicherung**: Ein versehentlich gelöschter Datensatz oder ein Ransomware-Angriff wird sofort auf alle gespiegelten Systeme übertragen.

Die wichtigsten RAID-Level (n Platten mit je Kapazität K):

| RAID | Prinzip | min. Platten | Nutzkapazität | verkraftet |
|---|---|---|---|---|
| **RAID 0** | Striping (Daten auf Platten verteilt) | 2 | n · K | keinen Ausfall – keine Redundanz |
| **RAID 1** | Spiegelung | 2 | K (bei 2 Platten 50 %) | Ausfall einer Platte |
| **RAID 5** | Striping mit verteilter Parität | 3 | (n − 1) · K | Ausfall einer Platte |
| **RAID 6** | Striping mit doppelter Parität | 4 | (n − 2) · K | Ausfall von zwei Platten |
| **RAID 10** | Spiegelpaare, darüber Striping | 4 | n · K / 2 | eine Platte je Spiegelpaar |

Beispiel mit vier Platten zu je 4 TB: RAID 0 → 16 TB, RAID 5 → 12 TB, RAID 6 und RAID 10 → je 8 TB nutzbar. RAID 0 erhöht nur die Geschwindigkeit; fällt eine Platte aus, sind alle Daten verloren.

> ❓ **Prüferfrage:** Warum ist eine Reihenschaltung aus drei Komponenten mit je 99 % Verfügbarkeit schlechter als jede einzelne Komponente?
> *Das System läuft nur, wenn alle drei gleichzeitig laufen. Die Verfügbarkeiten werden multipliziert: 0,99 · 0,99 · 0,99 ≈ 0,970 – also rund 97 %. Jede zusätzliche Komponente in Reihe ist ein weiterer möglicher Ausfallgrund. Abhilfe schafft Redundanz an der schwächsten Stelle.*

> ❓ **Prüferfrage:** Ihr Kollege schlägt vor, den Datenbankserver mit vier Platten in RAID 0 zu betreiben, „damit er schneller und ausfallsicherer wird“. Was antworten Sie?
> *Schneller ja, ausfallsicherer nein: RAID 0 verteilt die Daten ohne Redundanz auf alle Platten. Fällt eine einzige Platte aus, sind alle Daten verloren – mit vier Platten steigt das Ausfallrisiko sogar, weil die Platten in Reihe geschaltet sind. Für Verfügbarkeit eignen sich RAID 5, 6 oder 10; bei vier Platten zu 4 TB bleiben 12 TB (RAID 5) bzw. 8 TB (RAID 6, RAID 10) nutzbar. Ein Backup ersetzt keines davon.*

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Konstruktive und analytische Qualitätssicherung verwechselt.
2. Systemtest und Abnahmetest gleichgesetzt – der Abnahmetest liegt beim Auftraggeber und prüft gegen das Lastenheft.
3. Bei Äquivalenzklassen die **ungültigen** Klassen vergessen.
4. Grenzwerte nur auf einer Seite der Grenze getestet.
5. Das erwartete Ergebnis eines Testfalls erst nach der Durchführung eingetragen.
6. Bei der Reihenschaltung Verfügbarkeiten addiert oder gemittelt statt multipliziert.
7. Bei der Parallelschaltung die Verfügbarkeiten statt der Ausfallwahrscheinlichkeiten multipliziert.
8. RAID oder Spiegelung als Ersatz für ein Backup dargestellt.

---

# Übungsklausur Qualitätssicherung, Testen & Verfügbarkeit (100 Punkte, 90 Minuten)

Bearbeite die Klausur am Stück, handschriftlich, mit Taschenrechner. Runde Prozentwerte auf drei, alles andere auf zwei Nachkommastellen.

## Ausgangssituation

Die **Möbelhaus Nordholz GmbH** führt ein neues **Umsatzreporting** ein: Eine ETL-Strecke lädt jede Nacht die Bestellungen aus dem Shopsystem in ein Data Warehouse, ein Dashboard zeigt Umsätze und Versandkosten. Betrieben wird das System in einem externen Rechenzentrum. Sie verantworten in der IT-Abteilung Test und Abnahme und überwachen den Betrieb.

## Block A – Qualitätssicherung und Teststufen (22 P)

Für das Projekt soll ein Qualitätssicherungskonzept entstehen. In der Testphase sind mehrere Prüfungen geplant, ein erster Fehler ist schon aufgetreten.

**A1 (6 P):** *Erläutern* Sie den Unterschied zwischen konstruktiver und analytischer Qualitätssicherung und *nennen* Sie für das Reporting-Projekt je **zwei** Maßnahmen.

**A2 (8 P):** *Ordnen* Sie die folgenden Prüfungen jeweils einer Teststufe *zu* und *begründen* Sie kurz. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Fall | Teststufe | Begründung |
|---|---|---|
| (a) Die Fachabteilung prüft anhand des Lastenhefts, ob der Monatsbericht ihren Anforderungen genügt. | | |
| (b) Ein Entwickler prüft die SQL-Funktion zur Berechnung der Versandkosten. | | |
| (c) Es wird geprüft, ob die ETL-Strecke die Daten aus dem Shopsystem vollständig übernimmt. | | |
| (d) Das Testteam prüft das gesamte Reporting in der Testumgebung gegen das Pflichtenheft. | | |

**A3 (4 P):** Das Dashboard zeigt einen um 19 % zu hohen Umsatz, weil im Skript die Bruttobeträge summiert werden. *Ordnen* Sie die Begriffe Fehlhandlung, Fehlerzustand und Fehlerwirkung diesem Fall *zu*.

**A4 (4 P):** *Erläutern* Sie, warum ein Review des Pflichtenhefts wirtschaftlich sinnvoll ist, obwohl später ohnehin getestet wird.

## Block B – Testverfahren (24 P)

Die Fachabteilung liefert die Regeln für die Versandkosten; die Entwickler fragen, wie viele Testfälle nötig sind und welche Tests nach jeder Änderung laufen sollen.

**B1 (6 P):** *Vergleichen* Sie Black-Box- und White-Box-Test anhand von Grundlage, Fragestellung und je einem Verfahren. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| | Black-Box-Test | White-Box-Test |
|---|---|---|
| Grundlage | | |
| Fragestellung | | |
| Verfahren | | |

**B2 (12 P):** Für die Versandkosten gilt: 1 bis 5 Packstücke → Paketversand; 6 bis 20 Packstücke → Spedition; mehr als 20 Packstücke → Sonderanfrage. Die Anzahl muss eine ganze Zahl sein; 0 und negative Werte sind ungültig.
a) *Bilden* Sie alle Äquivalenzklassen und *geben* Sie je einen Repräsentanten und das erwartete Ergebnis *an*. (6 P)
b) *Bestimmen* Sie die Testwerte der Grenzwertanalyse. (4 P)
c) *Begründen* Sie, warum die Grenzwertanalyse zusätzlich zu den Äquivalenzklassen nötig ist. (2 P)

**B3 (6 P):** Nach einer Änderung an der Umsatzberechnung meldet die Buchhaltung, dass die Versandkosten nicht mehr stimmen. *Erläutern* Sie, welche Testart den Fehler verhindert hätte, und *begründen* Sie, warum sie sich für eine Automatisierung eignet.

## Block C – Testkonzept und Abnahme (20 P)

Vor dem Produktivstart muss die ETL-Strecke nachweislich korrekt laden, und die Geschäftsleitung soll das Reporting formell abnehmen.

**C1 (6 P):** *Formulieren* Sie einen vollständigen Testfall, der prüft, ob die ETL-Strecke die Bestellungen eines Monats vollständig und mit korrekten Beträgen lädt.

**C2 (6 P):** *Nennen* Sie **drei** weitere Prüfungen, mit denen Sie die Ergebnisse der ETL-Strecke absichern, und *erläutern* Sie, welchen Fehler jede aufdeckt. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Prüfung | aufgedeckter Fehler |
|---|---|
| | |
| | |
| | |

**C3 (8 P):** *Beschreiben* Sie **vier** Inhalte eines Abnahmeprotokolls und *erläutern* Sie **zwei** Rechtsfolgen der Abnahme.

## Block D – Verfügbarkeit (22 P)

Im ersten Betriebsmonat beschwert sich die Geschäftsleitung über Ausfälle des Dashboards. Sie sollen prüfen, ob der Rechenzentrumsbetreiber seine Zusagen einhält und wo die Schwachstelle liegt.

**D1 (6 P):** Das SLA sichert für das Reporting 99,5 % Verfügbarkeit pro Monat zu (30 Tage, Betrieb rund um die Uhr). Im März fiel das System insgesamt 4,5 Stunden aus.
a) *Berechnen* Sie die erlaubte Ausfallzeit. (2 P)
b) *Berechnen* Sie die tatsächliche Verfügbarkeit und *beurteilen* Sie, ob das SLA eingehalten wurde. (4 P)

> **Formeln:**
> - erlaubte Ausfallzeit = Betriebszeit · (1 − zugesicherte Verfügbarkeit)
> - Verfügbarkeit V = (Betriebszeit − Ausfallzeit) / Betriebszeit · 100 %

**D2 (6 P):** Für den Datenbankserver gibt der Hersteller eine MTBF von 1.990 Stunden und eine MTTR von 10 Stunden an. *Berechnen* Sie die Verfügbarkeit und die zu erwartende Ausfallzeit pro Jahr bei Betrieb rund um die Uhr.

> **Formeln:**
> - Verfügbarkeit V = MTBF / (MTBF + MTTR)
> - Ausfallzeit pro Jahr = 8.760 h · (1 − V)

**D3 (10 P):** Das Reporting benötigt einen Webserver (99 %), einen Anwendungsserver (99,5 %) und eine Datenbank (98 %) – fällt eine Komponente aus, ist das Reporting nicht erreichbar.
a) *Berechnen* Sie die Gesamtverfügbarkeit. (4 P)
b) Die Datenbank wird durch einen zweiten, gleichwertigen Server gespiegelt. *Berechnen* Sie die neue Gesamtverfügbarkeit. (4 P)
c) *Begründen* Sie, warum gerade die Datenbank redundant ausgelegt wurde. (2 P)

> **Formeln:**
> - Reihenschaltung: V = V₁ · V₂ · V₃
> - Parallelschaltung: V = 1 − (1 − V₁) · (1 − V₂)

## Block E – SLA und Redundanz (12 P)

Der Vertrag mit dem Rechenzentrum wird neu verhandelt. Sie sollen die Anforderungen aus IT-Sicht formulieren.

**E1 (6 P):** *Nennen* Sie **vier** Inhalte eines SLA und *grenzen* Sie Reaktionszeit und Wiederherstellungszeit *ab*.

**E2 (6 P):** *Erläutern* Sie den Begriff Single Point of Failure an einem Beispiel aus dem Szenario und *nennen* Sie **zwei** Maßnahmen zur Erhöhung der Verfügbarkeit. *Begründen* Sie, warum diese Maßnahmen keine Datensicherung ersetzen.

---

## Fachgespräch: typische Fragen des Ausschusses

1. „Wie haben Sie sichergestellt, dass die Ergebnisse Ihrer Analyse stimmen?“
2. „Nach welchen Kriterien hat Ihr Auftraggeber das Projekt abgenommen?“
3. „Mit welchen Testdaten haben Sie gearbeitet – und warum nicht mit den echten Kundendaten?“
4. „Was passiert, wenn Ihre ETL-Strecke nachts abbricht? Wer merkt das, und wann?“
5. „Welche Verfügbarkeit braucht Ihr Bericht wirklich – und was würde eine höhere kosten?“
6. „Wie stellen Sie sicher, dass eine spätere Änderung an Ihren Skripten die bestehenden Auswertungen nicht verfälscht?“

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich unterscheide konstruktive und analytische Qualitätssicherung sowie statische und dynamische Prüfungen.
- [ ] Ich ordne Komponenten-, Integrations-, System- und Abnahmetest zu und kenne ihre Grundlage.
- [ ] Ich vergleiche Black-Box- und White-Box-Test und kenne C0 und C1.
- [ ] Ich bilde Äquivalenzklassen (gültig und ungültig) und Grenzwerte für eine Regel.
- [ ] Ich formuliere einen vollständigen Testfall und nenne Prüfungen für ETL-Strecken.
- [ ] Ich beschreibe Testkonzept, Testprotokoll, Abnahmeprotokoll und die Rechtsfolgen der Abnahme.
- [ ] Ich berechne Verfügbarkeit, erlaubte Ausfallzeit und Verfügbarkeit aus MTBF und MTTR.
- [ ] Ich berechne Reihen- und Parallelschaltungen und erkenne den Single Point of Failure.
- [ ] Ich nenne die Inhalte eines SLA und begründe Redundanzmaßnahmen.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
- [ ] Ich nenne die Qualitätsmerkmale nach ISO/IEC 25010, grenze Fehlernachtest und Regressionstest ab und erkläre Testpyramide und TDD.
- [ ] Ich berechne die Nutzkapazität von RAID 1, 5, 6 und 10 und weiß, wie viele Plattenausfälle sie verkraften.
