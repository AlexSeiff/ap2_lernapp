# Musterlösungen Übungsklausur Altklausur-Training Prozessanalyse III (Deep Dive 22)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen** – andere sach- und fachgerechte Antworten zählen gleichwertig. Bewerte nur so viele Nennungen, wie verlangt sind. Das Aktivitätsdiagramm bewertest du mit der Checkliste. 92+ P = sehr gut.

---

## Block A – Digitale Transformation und Projektorganisation (24 P)

**A1 (8 P):** *(je Zeile 4 P: Befürchtung 2 P, passende Gegenmaßnahme 2 P)*

| Stakeholder | Befürchtung | Gegenmaßnahme |
|---|---|---|
| Geschäftsleitung | Hohe Investition in Tablets, Software und vernetzte Betten rechnet sich nicht; laufender Service wird während der Umstellung gestört | Wirtschaftlichkeitsrechnung vorab und Pilotphase mit einem Heim; Kennzahlen (Ausfallzeit, Anfahrten) vorher und nachher vergleichen |
| Servicetechniker | Leistungskontrolle über Tablet und Einsatzdaten, Überforderung mit neuer Technik | Betriebsvereinbarung mit Betriebsrat (keine individuelle Leistungsauswertung), Schulung und Ansprechpartner, Techniker im Projektteam beteiligen |

*Prüferkommentar: Eine Gegenmaßnahme, die nicht zur Befürchtung passt (Schulung gegen die Angst vor Kosten), bringt null Punkte, auch wenn sie an sich sinnvoll ist.*

**A2 (4 P):** *(je Thema 2 P)* **Projektziele und Abgrenzung** (was gehört zur digitalen Transformation, was nicht) · **Meilensteine und Zeitplan** · **Rollen und Verantwortlichkeiten** im Team (Projektleitung, Fachseite, IT) · **Kommunikations- und Berichtswege** (Jour fixe, Tool) · **bekannte Risiken und Rahmenbedingungen** (Budget, SLA-Pflichten während der Umstellung).

**A3 (4 P):** *(je Aspekt 2 P)* **Kennenlernen** mit Rollen und Erwartungen · **gemeinsame Spielregeln** (Umgang, Erreichbarkeit, Entscheidungen) · **offene Feedbackkultur**, Konflikte früh ansprechen · **gemeinsame Aktivität** außerhalb der Arbeit · **Erfolge sichtbar machen** und würdigen.

*Prüferkommentar: Sonderzahlungen sind keine Maßnahme der Beziehungsebene im Team.*

**A4 (4 P):** *(je Vorgehensweise 2 P)*
- **Klassisch:** Das Projekt wird zu Beginn vollständig geplant und in festen Phasen nacheinander abgearbeitet (Analyse, Entwurf, Umsetzung, Test, Einführung); Ergebnisse und Abnahmen sind dokumentiert, Änderungen laufen über ein formales Änderungsmanagement.
- **Agil:** Das Ziel wird grob festgelegt, gearbeitet wird in kurzen Iterationen mit einem nutzbaren Teilergebnis am Ende jeder Iteration; Anforderungen dürfen sich ändern, Kunde bzw. Fachseite gibt regelmäßig Rückmeldung.

**A5 (4 P):** *(Nennung 1 P, Beschreibung 2 P, Einordnung 1 P)*, z. B.:
- **V-Modell – klassisch:** Jeder Spezifikationsphase steht eine Teststufe gegenüber (Anforderungen ↔ Abnahmetest, Systementwurf ↔ Systemtest, Komponentenentwurf ↔ Komponententest); dadurch passt es zu hohen Qualitätsanforderungen.
- **Scrum – agil:** Arbeit in Sprints von zwei bis vier Wochen mit Product Owner, Scrum Master und Entwicklungsteam; Product Backlog, Sprint Planning, Daily Scrum, Review und Retrospektive.
- **Wasserfall – klassisch**, **Kanban – agil** (Board mit begrenzter Anzahl paralleler Aufgaben).

---

## Block B – Wartungsprozess (29 P)

**B1 (21 P):** Erwartete Elemente des Aktivitätsdiagramms:

| Element | P |
|---|---|
| Schwimmbahnen Serviceteam und Zentrallager, Startknoten | 1 |
| „Fälligkeiten der Wartungsverträge prüfen“ | 1 |
| Entscheidung `[keine Wartung fällig]` → **Ablaufende** ⊗ | 2 |
| `[Wartung fällig]` → „Betten eines Heims bündeln“ → „Wartungsauftrag anlegen“ | 2 |
| „Verschleißteile im Servicestützpunkt prüfen“ und Entscheidung `[alle Teile vorrätig]` / `[Teile fehlen]` | 2 |
| `[Teile fehlen]` → „Teile im Zentrallager bestellen“ (Serviceteam) → „Liefertermin bestätigen“ (Zentrallager) | 3 |
| **Fork** nach der Bestätigung: ein Strang zur Planung, ein Strang „Teile liefern“ in der Bahn des Zentrallagers | 2 |
| **Zusammenführung** der Zweige vor „Techniker einplanen“ → „Termin mit dem Heim vereinbaren“ | 2 |
| **Join** vor „Wartung und sicherheitstechnische Kontrolle durchführen“ (Wartung erst nach Eingang der Teile) | 2 |
| Entscheidung `[Defekt]` → Aktion „Reparaturprozess anstoßen“ (Aufrufsymbol) | 2 |
| `[kein Defekt]` → „Wartung dokumentieren und Auftrag abschließen“ → Endknoten ◉ | 1 |
| Saubere Notation (gerichtete Pfeile, Bedingungen in eckigen Klammern, jede Aktion in der richtigen Bahn) | 1 |

*Prüferkommentar: Die Schwierigkeit liegt im Zweig „Teile fehlen“: Die Planung darf nach der Bestätigung weiterlaufen, die Wartung aber erst nach der Lieferung beginnen. Eine Lösung ohne Join vor der Wartung verliert mindestens 2 Punkte. Wer den Zweig ohne fällige Wartung mit ◉ beendet, beendet den gesamten Prozess – hier ist ⊗ richtig.*

**B2 (8 P):** *(je Kennzahl 1 P, je Nutzen 3 P)*

| Kennzahl | Nutzen |
|---|---|
| Störungen je Bett in den zwölf Monaten nach der Wartung | Wirksamkeit der Wartung beurteilen, Wartungsintervall anpassen |
| Anteil der Wartungen, die wegen fehlender Teile verschoben wurden | zeigt, ob die Teilebestellung im Zentrallager rechtzeitig ausgelöst wird; Lagerbestand im Stützpunkt anpassen |
| Termintreue: Anteil der Wartungen, die innerhalb der vereinbarten Frist erledigt wurden | prüft die Einhaltung der SLA-Zusagen und die Kapazität der Techniker |

Weitere richtige Kennzahlen: Kosten je Wartungsauftrag, Arbeitszeit je Bett, Anteil der Wartungen mit anschließender Reparatur, Kundenzufriedenheit nach der Wartung.

---

## Block C – Störungsprozess und IoT (27 P)

**C1 (12 P):** *(je Zeile 6 P: Problem 2 P, Auswirkung 2 P, Verbesserungsvorschlag 2 P)*

| Prozessproblem | Auswirkung | Verbesserungsvorschlag |
|---|---|---|
| Störungshotline nur bis 18 Uhr besetzt, obwohl SLA-Kunden rund um die Uhr versorgt werden müssen | Störung wurde erst am Samstag aufgenommen – fast ein Tag Verzögerung | Rufbereitschaft oder externer Notdienst außerhalb der Bürozeit, Rückrufgarantie innerhalb einer Stunde |
| Störungsaufnahme durch einen Auszubildenden ohne Checkliste | Bettentyp, Fehlerbild und benötigtes Ersatzteil blieben unklar – zweite Anfahrt nötig | Pflicht-Checkliste mit Seriennummer, Fehlerbild und Foto; Ersatzteil wird vor der ersten Anfahrt bestimmt |
| Bereitschaftstechniker bei einem nicht dringenden Auftrag | Techniker erst am Sonntag vor Ort | Einsätze nach SLA-Priorität disponieren; Pflegeheime vor Bürokunden |
| Ersatzteil nur im Zentrallager | Reparatur erst am Dienstag, Bewohner tagelang ohne verstellbares Bett | Mindestbestand kritischer Teile (Steuerboxen) im Fahrzeug bzw. Stützpunkt |

*Zwei Zeilen genügen.*

*Prüferkommentar: In der Spalte „Prozessproblem“ steht eine Schwachstelle im Ablauf, nicht die Folge („Kunde verloren“ ist eine Auswirkung). Ein Verbesserungsvorschlag ohne Bezug zum genannten Problem bringt keinen Punkt.*

**C2 (2 P):** Jedes Bett braucht eine **Steuerung mit Sensoren und einem Kommunikationsmodul**, die Messwerte wie Motorstrom oder Fehlercodes erfasst und senden kann. Alternativ: eine **verlässliche Netzverbindung** im Heim, notfalls über Mobilfunk.

**C3 (2 P):** *(je 1 P)* Motorstrom · Motorlaufzeit · Akkuladestand · Fehlercodes der Steuerung.

**C4 (2 P):** *(je 1 P)* WLAN · LTE-M bzw. NB-IoT (Mobilfunk) · Bluetooth Low Energy zu einem Gateway je Etage · allgemein LPWAN.

**C5 (2 P):** Eine **zentrale Serviceplattform**, die die Daten empfängt, speichert und auswertet – in Echtzeit für Alarme und über längere Zeit für vorausschauende Wartung – und die Alarme an die Einsatzplanung und die Tablets der Techniker weitergibt.

**C6 (3 P):** *(Aspekt 1 P, Begründung 2 P)*, z. B.:
- **DSGVO, Art. 9:** Daten eines Pflegebetts (Belegung, Liegezeiten, Bewegungen) lassen Rückschlüsse auf den **Gesundheitszustand** der Bewohner zu und sind damit besonders geschützt; nötig sind Rechtsgrundlage, Datenminimierung und Vertrag zur Auftragsverarbeitung mit dem Plattformbetreiber.
- **Medizinprodukterecht:** Pflegebetten sind Medizinprodukte; Änderungen an Steuerung und Software dürfen die Sicherheit nicht beeinträchtigen.
- **IT-Sicherheit:** Vernetzte Geräte müssen gegen Manipulation geschützt sein (Haftung bei Fehlfunktion).

**C7 (4 P):** *(je Feld 1 P)*

| | Prozessverbesserung | IoT-Einführung |
|---|---|---|
| Vorteil | schnell und günstig umsetzbar, wirkt sofort für alle Kunden | Ausfälle werden erkannt oder vorhergesagt, bevor das Heim anruft (Predictive Maintenance) |
| Nachteil | Störungen werden weiterhin erst gemeldet, wenn das Bett schon ausgefallen ist | hohe Investition und Datenschutzaufwand, Nachrüstung aller Betten dauert lange |

---

## Block D – SLA-Kalkulation und Statusbericht (20 P)

**D1 (10 P):** *(je richtiger Wert 1,25 P)*

| Kennzahl | Einheit | SLA Premium | SLA Basis |
|---|---|---|---|
| Ø Personalkosten/Stunde | €/Stunde | 45,09 | 41,75 |
| Gewinn/Kunde/Monat | € | 67,76 | −42,42 |
| Gewinn/Stunde | €/Stunde | 3,57 | −3,86 |
| Gewinnzuschlag | % | 7,91 | −9,24 |

Rechenweg SLA Premium:
- $\frac{856{,}80}{19}$ = **45,09 €/Stunde**
- $924{,}56 - 856{,}80$ = **67,76 €**
- $\frac{67{,}76}{19}$ = **3,57 €/Stunde**
- $\frac{3{,}57}{45{,}09} \cdot 100\,\%$ = **7,91 %**

Rechenweg SLA Basis:
- $\frac{459{,}20}{11}$ = **41,75 €/Stunde**
- $416{,}78 - 459{,}20$ = **−42,42 €**
- $\frac{-42{,}42}{11}$ = **−3,86 €/Stunde**
- $\frac{-3{,}86}{41{,}75} \cdot 100\,\%$ = **−9,24 %**

*Prüferkommentar: Die Pauschale ist fest; mehr Stunden senken den Gewinn je Stunde. Wer mit dem geplanten Preis je Stunde (57,79 €) multipliziert, rechnet so, als würden Mehrstunden bezahlt – das ist der typische Fehler.*

**D2 (4 P):** *(je Aussage 2 P)*
- **SLA Premium** bleibt knapp im Gewinn, der Zuschlag sinkt aber von geplanten 30 % auf rund **8 %**: Es fallen drei Stunden mehr an als geplant, dazu mehr Nacht- und Sonntagsstunden.
- **SLA Basis** ist **nicht kostendeckend** (rund −9 %): elf statt acht Stunden. Die Pauschale ist zu niedrig kalkuliert.
- Folgerung: Pauschalen anheben oder ein **Stundenkontingent** mit Abrechnung von Mehrstunden einführen; Leistungsumfang genauer festlegen. Da 60 % der Kunden SLA Basis gebucht haben, ist der Verlust dort besonders gewichtig.

**D3 (6 P):** *(je Zeile 3 P: Inhalt 1 P, Begründung 2 P)*

| Inhalt | Begründung |
|---|---|
| Anzahl der Kunden je SLA und Entwicklung (Neuabschlüsse, Kündigungen) | zeigt die Attraktivität der Angebote und frühe Warnsignale wie beim Lindenhof |
| Einhaltung der zugesagten Reaktionszeiten je SLA | Kernversprechen gegenüber dem Kunden; Verstöße gefährden Verträge und Ruf |

Weitere richtige Inhalte: IST-Stunden gegenüber Plan, Gewinn bzw. Deckungsbeitrag je SLA, Kundenzufriedenheit, Anzahl und Dauer der Störungen, Anteil der Einsätze nachts und am Wochenende.
