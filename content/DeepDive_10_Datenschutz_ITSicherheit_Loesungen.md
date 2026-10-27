# Musterlösungen Übungsklausur Datenschutz & IT-Sicherheit (Deep Dive 10)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Dieser Themenblock ist der am besten lernbare der gesamten Prüfung – hier sollten 95+ Punkte das Ziel sein. Punktabzüge entstehen fast nur durch fehlende **Anwendung auf den Fall**. 92+ P = sehr gut.

---

## Block A – Grundlagen und Grundsätze (24 P)

**A1 (6 P):**
Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder **identifizierbare natürliche Person** beziehen (Art. 4 Nr. 1 DSGVO). Identifizierbar ist eine Person, wenn sie mit vertretbarem Aufwand – auch über Zusatzinformationen – bestimmbar ist. *(2 P)*

Beurteilung *(je 1 P, zwei genügen für die volle Punktzahl; hier alle vier)*:
- **Kundennummer:** personenbezogen, da über die Kundentabelle eindeutig einer Person zuordenbar (Pseudonym, kein Anonymat).
- **Firmenname „Huber GmbH":** **nicht** personenbezogen – juristische Personen fallen nicht unter die DSGVO. Die Daten des Ansprechpartners dort jedoch schon.
- **IP-Adresse:** personenbezogen, da über den Provider eine Zuordnung möglich ist.
- **Durchschnittsumsatz aller Kunden:** **nicht** personenbezogen, da es sich um einen aggregierten Wert ohne Rückschlussmöglichkeit auf Einzelpersonen handelt.

*Prüferkommentar: Die GmbH und der Aggregatwert sind die Prüfsteine. Wer alles pauschal als personenbezogen einstuft, zeigt, dass er die Definition nicht angewendet hat.*

**A2 (10 P):** *(je 1 P Nennung, 1 P Erläuterung – fünf genügen)*
1. **Rechtmäßigkeit, Treu und Glauben, Transparenz** – Es muss eine Rechtsgrundlage geben, und die Verarbeitung muss für Betroffene nachvollziehbar sein.
2. **Zweckbindung** – Daten dürfen nur für den bei der Erhebung festgelegten Zweck verwendet werden; eine spätere Zweckänderung ist gesondert zu prüfen.
3. **Datenminimierung** – Es dürfen nur die Daten verarbeitet werden, die für den Zweck erforderlich sind.
4. **Richtigkeit** – Daten müssen sachlich richtig und auf dem aktuellen Stand sein; unrichtige Daten sind zu berichtigen oder zu löschen.
5. **Speicherbegrenzung** – Daten dürfen nur so lange gespeichert werden, wie es für den Zweck erforderlich ist.
6. **Integrität und Vertraulichkeit** – Schutz vor unbefugtem Zugriff, Verlust und Veränderung durch geeignete Maßnahmen.
7. **Rechenschaftspflicht** – Der Verantwortliche muss die Einhaltung aller Grundsätze nachweisen können.

**A3 (8 P):** *(je 1 P Rechtsgrundlage, 1 P passende Zuordnung)*

| Rechtsgrundlage | passende Verarbeitung im Möbelhaus |
|---|---|
| Vertragserfüllung (Buchst. b) | Name und Lieferadresse speichern, um die bestellte Küche auszuliefern |
| Rechtliche Verpflichtung (Buchst. c) | Rechnungsdaten aufbewahren nach HGB und Abgabenordnung (Buchungsbelege acht Jahre seit 2025, Bücher und Jahresabschlüsse zehn Jahre) |
| Einwilligung (Buchst. a) | Newsletter an Kunden, die sich dafür angemeldet haben |
| Berechtigtes Interesse (Buchst. f) | Reklamationsdaten zur Qualitätsverbesserung auswerten – nach Abwägung, gegebenenfalls aggregiert |

*Ebenfalls anerkannt: lebenswichtige Interessen, öffentliche Aufgabe (mit passendem Beispiel).*

---

## Block B – Betroffenenrechte und Pflichten (26 P)

**B1 (8 P):** *(je 1 P Recht mit Artikel, 1 P Inhalt – vier genügen)*
- **Auskunftsrecht (Art. 15):** Betroffene können erfahren, welche Daten zu welchem Zweck, auf welcher Grundlage und wie lange verarbeitet werden und an wen sie weitergegeben wurden.
- **Recht auf Berichtigung (Art. 16):** Unrichtige Daten sind zu korrigieren, unvollständige zu vervollständigen.
- **Recht auf Löschung (Art. 17):** Daten sind zu löschen, wenn der Zweck entfallen ist, die Einwilligung widerrufen wurde oder die Verarbeitung unrechtmäßig war.
- **Recht auf Datenübertragbarkeit (Art. 20):** Herausgabe der bereitgestellten Daten in einem strukturierten, gängigen, maschinenlesbaren Format.
- **Widerspruchsrecht (Art. 21):** Widerspruch gegen Verarbeitungen auf Basis berechtigten Interesses; gegen Direktwerbung ausnahmslos.
- **Recht auf Einschränkung (Art. 18):** Sperren statt Löschen, wenn eine Löschung nicht möglich oder strittig ist.

**B2 (8 P):**
Der Anspruch ist **differenziert** zu beurteilen: *(2 P)*

- **Newsletter-Daten:** Die Einwilligung kann jederzeit widerrufen werden; damit entfällt die Rechtsgrundlage. Diese Daten sind **unverzüglich zu löschen** und die Adresse ist in eine Sperrliste aufzunehmen, damit keine erneute Ansprache erfolgt. *(2 P)*
- **Rechnungs- und Vertragsdaten des Küchenkaufs:** Hier besteht eine **gesetzliche Aufbewahrungspflicht** – für Rechnungen als Buchungsbelege acht Jahre nach HGB und Abgabenordnung (seit 2025, vorher zehn; Stand 2026), für Handelsbriefe sechs Jahre. Nach drei Jahren läuft die Frist also noch. Diese Pflicht geht dem Löschanspruch vor (Art. 17 Abs. 3 lit. b). *(2 P)*

Korrektes Vorgehen: Die aufbewahrungspflichtigen Daten werden für jede weitere Nutzung **gesperrt** (eingeschränkte Verarbeitung nach Art. 18 bzw. § 35 Abs. 3 BDSG) und ausschließlich zur Erfüllung der steuer- und handelsrechtlichen Pflichten vorgehalten; nach Fristablauf werden sie automatisch gelöscht. Der Kunde ist **innerhalb eines Monats** über den Umfang der Löschung und die Gründe für die Teilablehnung zu informieren. *(2 P)*

*Prüferkommentar: Ein pauschales „ja, alles löschen" oder „nein, geht nicht" gibt maximal 2 P. Die Differenzierung nach Datenart ist die eigentliche Prüfungsleistung.*

**B3 (6 P):**
Der Cloud-Anbieter ist **Auftragsverarbeiter** nach Art. 4 Nr. 8 – er verarbeitet die Daten weisungsgebunden im Auftrag und entscheidet nicht selbst über Zwecke und Mittel. *(2 P)*
Erforderlich ist ein **Auftragsverarbeitungsvertrag (AVV) nach Art. 28**, der Gegenstand, Dauer, Art und Zweck der Verarbeitung, die Datenkategorien, die Weisungsbindung, die TOM sowie Kontroll- und Löschpflichten regelt. *(2 P)*
**Verantwortlich gegenüber den Betroffenen bleibt das Möbelhaus** als Verantwortlicher. Es muss den Dienstleister sorgfältig auswählen und dessen Schutzmaßnahmen prüfen. Liegt der Serverstandort außerhalb der EU, ist zusätzlich eine Grundlage für den Drittlandtransfer erforderlich. *(2 P)*

**B4 (4 P):**
Es liegt eine **Verletzung des Schutzes personenbezogener Daten** vor. Pflichten:
- **Meldung an die zuständige Aufsichtsbehörde unverzüglich, spätestens innerhalb von 72 Stunden** nach Bekanntwerden (Art. 33), mit Art des Vorfalls, betroffenen Datenkategorien, ungefährer Zahl der Betroffenen, wahrscheinlichen Folgen und ergriffenen Maßnahmen. *(2 P)*
- Bei **voraussichtlich hohem Risiko** für die Betroffenen zusätzlich deren **unverzügliche Benachrichtigung** (Art. 34). Bei 8.000 offen zugänglichen Kundendatensätzen ist davon auszugehen. *(1 P)*
- Der Vorfall ist unabhängig von der Meldepflicht intern zu **dokumentieren** (Rechenschaftspflicht). *(1 P)*

---

## Block C – Anonymisierung und Mitarbeiterauswertung (16 P)

**C1 (6 P):**
**Anonymisierung:** Der Personenbezug wird dauerhaft und unumkehrbar entfernt; ein Rückschluss auf Einzelpersonen ist auch mit Zusatzwissen nicht mehr möglich. *(2 P)*
**Pseudonymisierung:** Identifizierende Merkmale werden durch ein Kennzeichen ersetzt; die Zuordnung bleibt über einen getrennt aufbewahrten Schlüssel möglich. *(2 P)*

Der DSGVO unterliegen weiterhin **pseudonymisierte** Daten, da sie einer Person zugeordnet werden können und damit personenbezogen bleiben. Die Pseudonymisierung ist eine **Schutzmaßnahme nach Art. 32**, keine Befreiung. Anonyme Daten fallen dagegen nicht mehr in den Anwendungsbereich. *(2 P)*

**C2 (10 P):**
Rechtliche Anforderungen *(je 2,5 P)*:
- **Mitbestimmung des Betriebsrats nach § 87 Abs. 1 Nr. 6 BetrVG:** Das System ist technisch **geeignet**, Verhalten und Leistung der Beschäftigten zu überwachen. Die Eignung genügt – eine Überwachungsabsicht ist nicht erforderlich. Die Einführung ist daher mitbestimmungspflichtig, üblicherweise geregelt in einer Betriebsvereinbarung.
- **DSGVO-Anforderungen:** Es bedarf einer Rechtsgrundlage (i. d. R. Betriebsvereinbarung nach Art. 88 DSGVO bzw. berechtigtes Interesse nach Art. 6 Abs. 1 lit. f nach Abwägung – eine Einwilligung von Beschäftigten gilt wegen des Abhängigkeitsverhältnisses als problematisch). Die frühere Generalklausel § 26 Abs. 1 Satz 1 BDSG ist seit dem EuGH-Urteil von 2023 (C-34/21) nicht mehr anwendbar; auch eine Betriebsvereinbarung muss die DSGVO-Anforderungen voll erfüllen. Zusätzlich gelten Zweckbindung, Datenminimierung und Transparenzpflicht; bei systematischer umfangreicher Überwachung ist eine **Datenschutz-Folgenabschätzung nach Art. 35** zu prüfen.

Maßnahmen *(je 1,67 P, drei genügen)*:
- **Aggregation:** Auswertung nur auf Team- oder Abteilungsebene mit einer Mindestgruppengröße (z. B. fünf Personen), sodass kein Rückschluss auf Einzelne möglich ist.
- **Pseudonymisierung** der Personenkennung, mit getrennt verwahrtem Schlüssel und Zugriff nur bei berechtigtem Anlass im Vier-Augen-Prinzip.
- **Betriebsvereinbarung**, die Zweck, Umfang, Auswertungstiefe, Aufbewahrungsdauer und ausdrücklich unzulässige Auswertungen verbindlich festlegt.
- **Transparenz:** vorherige Information der Beschäftigten über Art und Zweck der Auswertung.
- **Zugriffsbeschränkung** über ein Rollenkonzept, sodass nur ein eng begrenzter Kreis Detaildaten sieht.

---

## Block D – IT-Sicherheit (22 P)

**D1 (6 P):** *(je 1 P Ziel, 1 P Maßnahme)*

| Schutzziel | Maßnahme für das Analysesystem |
|---|---|
| Vertraulichkeit | Verschlüsselung bei Übertragung (TLS) und Speicherung, Rollenkonzept mit Zugriff nur für den erforderlichen Kreis |
| Integrität | Protokollierung aller Änderungen, Prüfsummen beim Transfer vom Quellsystem, Schreibrechte nur für definierte Prozesse |
| Verfügbarkeit | Datensicherung nach der 3-2-1-Regel, redundante Auslegung, getestete Wiederherstellung |

**D2 (6 P):**
**Symmetrisch:** ein einziger Schlüssel für Ver- und Entschlüsselung (z. B. AES). Sehr schnell, auch bei großen Datenmengen; Problem ist der sichere Austausch des Schlüssels. *(1,5 P)*
**Asymmetrisch:** Schlüsselpaar aus öffentlichem und privatem Schlüssel (z. B. RSA). Der öffentliche Schlüssel darf frei verteilt werden, wodurch das Austauschproblem entfällt; dafür deutlich langsamer. *(1,5 P)*
**Hybrid:** Der Sitzungsschlüssel wird asymmetrisch sicher übertragen, die eigentlichen Daten anschließend symmetrisch verschlüsselt. So werden die Sicherheit des Schlüsselaustauschs und die Geschwindigkeit der symmetrischen Verfahren kombiniert – Standard bei TLS/HTTPS. *(1,5 P)*
**Hashing:** eine **Einwegfunktion**, die einen Wert fester Länge erzeugt. Es gibt keinen Schlüssel und keinen Rückweg zum Ursprungswert – Hashing dient der Integritätsprüfung und der Passwortspeicherung, nicht der vertraulichen Übertragung. *(1,5 P)*

**D3 (6 P):**
Rollenkonzept *(3 P)*:
| Rolle | Rechte |
|---|---|
| **Auswertung lesen** (Filialleitung) | Lesezugriff auf aggregierte Kennzahlen der eigenen Filiale |
| **Analyse** (Controlling / Datenanalyse) | Lesezugriff auf Detaildaten, keine Schreibrechte im Quellsystem |
| **Administration** (IT) | Verwaltung von Konten und Rechten, **kein** fachlicher Zugriff auf Auswertungsinhalte |

Rechte werden der Rolle zugewiesen, nicht der Einzelperson – bei einem Wechsel wird lediglich die Rolle getauscht. *(1 P)*

**Least Privilege:** Jede Rolle erhält nur die Rechte, die zur Aufgabenerfüllung zwingend nötig sind; im Zweifel weniger. **Need-to-know:** Der Zugriff beschränkt sich auf die fachlich tatsächlich benötigten Daten – die Filialleitung sieht nur die eigene Filiale, nicht den Gesamtbestand. *(2 P)*

**D4 (4 P):**
Gefahr: Werden Eingaben ungeprüft in eine SQL-Anweisung eingefügt, kann ein Angreifer eigenen SQL-Code einschleusen. Damit lassen sich Filter aushebeln, fremde Datensätze auslesen, Daten verändern oder ganze Tabellen löschen – das gefährdet Vertraulichkeit, Integrität und Verfügbarkeit zugleich. *(2 P)*

Wirksamste Gegenmaßnahme: **parametrisierte Abfragen (Prepared Statements)**. Dabei werden Anweisungsstruktur und Daten strikt getrennt, sodass Eingaben grundsätzlich als Wert und nie als Befehl interpretiert werden. Flankierend: Eingabevalidierung, minimale Datenbankrechte der Anwendung und Fehlermeldungen ohne technische Details. *(2 P)*

*Prüferkommentar: „Anführungszeichen herausfiltern" oder „Eingaben escapen" gilt als unvollständig (max. 1 P) – solche Filter lassen sich umgehen. Der Begriff Prepared Statement ist die erwartete Antwort.*

---

## Block E – Datensicherung (12 P)

**E1 (6 P):**

**Inkrementell** (jeweils Änderungen seit der letzten Sicherung): *(3 P)*
- Volumen: $800\ \text{GB (So)} + 40 + 40 + 40\ \text{GB (Mo–Mi)}$ = **920 GB**
- Wiederherstellung: Vollsicherung **und alle** inkrementellen Sicherungen → **4 Medien**

**Differenziell** (jeweils Änderungen seit der Vollsicherung): *(3 P)*
- Volumen: $800\ \text{GB} + 40\ \text{(Mo)} + 80\ \text{(Di)} + 120\ \text{(Mi)}$ = **1.040 GB**
- Wiederherstellung: Vollsicherung + **letzte** differenzielle Sicherung → **2 Medien**

**E2 (3 P):**
Empfehlung: **differenzielle Sicherung**. Für die Wiederherstellung werden nur zwei Medien benötigt statt vier; das verkürzt die Rücksicherungszeit deutlich und senkt das Risiko, dass ein einzelnes fehlerhaftes Medium die gesamte Kette unbrauchbar macht. Der höhere Speicherbedarf (1.040 statt 920 GB) und die längere tägliche Sicherungsdauer werden dafür in Kauf genommen.

*Prüferkommentar: Die Begründung muss den Zielkonflikt benennen – schnelle Wiederherstellung gegen höheren Sicherungsaufwand. Die bloße Nennung des Verfahrens gibt 1 P.*

**E3 (3 P):**
Letzte Sicherung 23:00 Uhr am Vortag, Ausfall 14:00 Uhr → **maximaler Datenverlust: 15 Stunden**. *(1,5 P)*
Die RPO-Vorgabe von vier Stunden wird damit **deutlich verfehlt**. *(0,5 P)*
Maßnahme: häufigere Sicherung im Vier-Stunden-Takt, ergänzend kontinuierliche Sicherung der Transaktionsprotokolle der Datenbank oder Spiegelung auf ein Zweitsystem. *(1 P)*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Artikel als Karteikarten pflegen, monatlich wiederholen |
| 81–91 | gut | Prüfe, ob Artikelnummern oder die Fallanwendung gefehlt haben |
| < 81 | | Teil 2 und 4 wiederholen – dieser Block ist reines Lernen und sollte sitzen |

**Der Satz für dein Fachgespräch:** Wenn du gefragt wirst, wie du Datenschutz in deinem Projekt berücksichtigt hast, antworte in dieser Reihenfolge – **Rechtsgrundlage, Datenminimierung, Zugriffsbeschränkung, Löschkonzept, eingebundene Stellen**. Diese fünf Stichworte decken fast jede Nachfrage ab und zeigen, dass du strukturiert und nicht zufällig gehandelt hast.
