# Deep Dive 22: Altklausur-Training Prozessanalyse III
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Der dritte Nachbau einer echten Prüfung „Durchführen einer Prozessanalyse“: vier Aufgaben mit 24, 29, 27 und 20 Punkten. Diese Altklausur setzt andere Schwerpunkte als Deep Dive 18 und 21: **Projektorganisation** (Stakeholder, Kick-off, Vorgehensmodelle), ein **großes Aktivitätsdiagramm mit Schwimmbahnen und Warten auf eine Lieferung** (21 P), die **Analyse eines missglückten Störungsfalls**, **IoT auf Grundlage eines englischen Textes** und eine **Nachkalkulation von Service-Level-Agreements** mit Tabelle.

Die Prüfer belohnen hier vor allem **Verknüpfung**: Problem → Auswirkung → konkrete Verbesserung, und Zahlen aus der Nachkalkulation → Aussage zur Preisgestaltung.

Szenario: **Möbelhaus Nordholz GmbH**, Geschäftsbereich **Nordholz Objekt** – Pflegebetten und Büromöbel mit Wartungsverträgen.

---

# Teil 1 – So ist die Klausur aufgebaut

| Merkmal | Wert |
|---|---|
| Zeit / Punkte | 90 Minuten, 100 Punkte, 4 Aufgaben (24 · 29 · 27 · 20) |
| Besonderheit | ein englischer Fachtext (IoT), zwei vorgegebene Antworttabellen mit drei Spalten, eine Kalkulationstabelle |
| Belegsatz | Notation des Aktivitätsdiagramms liegt bei (Start, Ende, Ablaufende, Schwimmbahnen, Teilung/Synchronisation, Entscheidung, Konnektor) |

---

# Teil 2 – Projekte organisieren

## 2.1 Stakeholder: Befürchtung und Gegenmaßnahme

Jede Gegenmaßnahme muss **genau die Befürchtung** auflösen. Geschäftsleitung fürchtet meist **Kosten, Termine, Nutzen**; Fachkräfte fürchten **Kontrolle, Überforderung, Arbeitsplatzverlust**.

| Befürchtung | passende Gegenmaßnahme |
|---|---|
| Investition rechnet sich nicht | Wirtschaftlichkeitsrechnung, Pilotphase mit Kennzahlen |
| Techniker werden per Sensor überwacht | Betriebsvereinbarung, Daten nur gerätebezogen auswerten |
| neue Technik überfordert | Schulung, Ansprechpartner, schrittweise Einführung |

## 2.2 Kick-off: Sach- und Beziehungsebene

- **Sachebene** (Inhalte): Projektziele und Abgrenzung, Meilensteine und Termine, Rollen und Verantwortlichkeiten, Kommunikationswege, Risiken.
- **Beziehungsebene** (Team): Kennenlernen, gemeinsame Regeln, offene Feedbackkultur, Teamevents, Wertschätzung von Erfolgen.

## 2.3 Klassisch oder agil?

| | klassisch | agil |
|---|---|---|
| Planung | vollständig zu Beginn, Phasen nacheinander | grob zu Beginn, je Iteration fein |
| Änderungen | teuer, über Änderungsmanagement | erwünscht, im nächsten Sprint |
| Ergebnis | am Ende | nach jeder Iteration ein nutzbares Inkrement |
| Modelle | Wasserfall, V-Modell | Scrum, Kanban |

> ❓ **Prüferfrage:** Warum passt das V-Modell zu hohen Qualitätsanforderungen?
> *Weil jeder Entwicklungsphase eine Teststufe gegenübersteht – die Anforderungen werden bis zum Abnahmetest nachweisbar geprüft.*

---

# Teil 3 – Aktivitätsdiagramm mit Warten und Aufruf

Zusätzlich zu den Grundsymbolen (Deep Dive 21, Teil 2) brauchst du hier:
- **Warten auf ein Ereignis:** „Gleichzeitig wird auf die Lieferung gewartet“ → Fork; ein Strang „Lieferung abwarten“, der andere plant weiter; Join vor der Aktion, die beides braucht.
- **Anderen Prozess anstoßen:** Aktion mit **Gabelsymbol** („Reparaturprozess anstoßen“) – der Reparaturprozess ist ein eigenes Diagramm.
- **Zusammenführung** nach einer Entscheidung, wenn beide Wege zur selben Aktion führen („Techniker einplanen“ kommt aus beiden Zweigen).
- **Schwimmbahnen** nach Organisationseinheit (Serviceteam, Zentrallager) – die Bestellung wird in der Bahn des Serviceteams ausgelöst, die Lieferung in der des Zentrallagers.

---

# Teil 4 – Störungsfälle analysieren und IoT

## 4.1 Problem – Auswirkung – Verbesserung

| Spalte | Das gehört hinein |
|---|---|
| Prozessproblem | eine **Ursache im Ablauf** („Störungsaufnahme ohne Checkliste“), keine Folge |
| Auswirkung | die **Folge im konkreten Fall** (Zeitverlust, zweite Anfahrt, Kundenverlust) |
| Verbesserungsvorschlag | eine **Maßnahme, die genau dieses Problem beseitigt** („Fehlerbild-Checkliste mit Bettentyp und Seriennummer“) |

## 4.2 Englische Texte in der Prüfung

Die Fragen kommen auf Deutsch, die Antwort steht **sinngemäß im Text**. Vorgehen: Frage lesen, Schlüsselwort suchen (*sensor*, *connectivity*, *platform*), Inhalt auf Deutsch und **auf das Szenario bezogen** wiedergeben. Wörtlich abgeschriebene englische Sätze bringen meist nur halbe Punkte.

## 4.3 IoT – was immer gefragt wird

- **Technik am Gerät:** Sensoren, Steuerung, Kommunikationsmodul.
- **Vernetzung:** WLAN, Mobilfunk (LTE-M, NB-IoT), LoRaWAN/LPWAN.
- **Plattform beim Anbieter:** Empfang, Speicherung, Auswertung in Echtzeit und historisch, **Predictive Maintenance**.
- **Sicherheit:** Verschlüsselung, Geräte-Authentifizierung, Updates.
- **Recht in Deutschland:** **DSGVO** (personenbezogene, bei Pflegebetten sogar Gesundheitsdaten nach Art. 9), **Medizinprodukterecht** bei Medizinprodukten, Auftragsverarbeitung mit Cloud-Anbietern.

---

# Teil 5 – Nachkalkulation von Service-Level-Agreements

Eine SLA-Pauschale wird **vorab** aus geplanten Stunden kalkuliert. In der Nachkalkulation zeigt sich, ob die **tatsächlichen** Stunden und Zuschläge in die Pauschale passen.

1. Personalkosten IST = Grundlohn + Lohnnebenkosten + Zuschläge (Nacht, Sonn-/Feiertag) für die IST-Stunden.
2. Ø Personalkosten je Stunde = Personalkosten IST / Stunden IST.
3. Gewinn je Kunde und Monat = Pauschale − Personalkosten IST.
4. Gewinn je Stunde = Gewinn je Kunde und Monat / Stunden IST.
5. Gewinnzuschlag in % = Gewinn je Stunde / Ø Personalkosten je Stunde · 100 %.

Beispiel: Pauschale 600 €, Personalkosten IST 480 € bei 12 Stunden: Gewinn $600 - 480$ = **120,00 €**, Gewinnzuschlag $\frac{120}{480} \cdot 100\,\%$ = **25,00 %**

**Aussage zur Preisgestaltung:** Liegt der IST-Zuschlag deutlich unter dem geplanten, ist die Pauschale zu knapp – mehr Stunden, mehr Nacht- und Sonntagsarbeit. Mögliche Folgen: Pauschale anpassen, Stundenkontingent festlegen und Mehrstunden abrechnen, Leistungsumfang präzisieren.

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Gegenmaßnahme passt nicht zur Befürchtung (Schulung gegen die Angst vor Kosten).
2. Sach- und Beziehungsebene vermischt („Teamevent“ als Agendapunkt der Sachebene).
3. Vorgehensmodell genannt, aber nicht als klassisch oder agil eingeordnet.
4. Im Aktivitätsdiagramm wartet die Wartung nicht auf die Lieferung (Join fehlt).
5. In der Problem-Tabelle steht die Auswirkung schon in der Spalte „Problem“.
6. Englische Sätze abgeschrieben statt sinngemäß auf Deutsch beantwortet.
7. In der Nachkalkulation mit geplanten statt tatsächlichen Stunden gerechnet.
8. Statusbericht-Inhalte ohne Begründung, warum sie für die Geschäftsleitung wichtig sind.

---

# Übungsklausur Prozessanalyse III im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Antworte stichwortartig, gib bei Berechnungen den Rechenweg an und halte dich an die geforderte Anzahl der Nennungen. Diagramme zeichnest du auf Papier und bewertest sie danach mit der Checkliste der Musterlösung.

## Ausgangssituation

Die **Möbelhaus Nordholz GmbH** beschäftigt rund 140 Mitarbeiter. Neben dem Möbelhandel betreibt sie den Geschäftsbereich **Nordholz Objekt** mit drei Standbeinen:
- Einrichtung von Pflegeheimen mit **elektrisch verstellbaren Pflegebetten**
- Einrichtung von Büros mit **höhenverstellbaren Schreibtischen**
- **Wartung und Störungsdienst** für die eingebauten Möbel

Über **Service-Level-Agreements (SLAs)** sichert Nordholz Objekt seinen Kunden Reaktionszeiten und die Verfügbarkeit der Betten zu. Die Geschäftsleitung hat ein Projekt zur **digitalen Transformation** des Servicegeschäfts gestartet. Sie arbeiten in der IT-Abteilung und sind Mitglied des Projektteams.

## Block A – Digitale Transformation und Projektorganisation (24 P)

Der Erfolg des Projekts hängt maßgeblich von der Akzeptanz der eigenen Mitarbeiter ab. Geplant sind unter anderem ein Tablet für jeden Servicetechniker, eine digitale Einsatzplanung und vernetzte Pflegebetten.

**A1 (8 P):** *Beschreiben* Sie für die Geschäftsleitung und für die Servicetechniker jeweils **eine** mögliche Befürchtung und *ordnen* Sie jeder Befürchtung eine geeignete Gegenmaßnahme *zu*. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Stakeholder | Befürchtung | Gegenmaßnahme |
|---|---|---|
| Geschäftsleitung | | |
| Servicetechniker | | |

**A2 (4 P):** Sie organisieren das Kick-off-Meeting für das Projektteam und die Beteiligten und erstellen dafür eine inhaltliche Agenda. *Beschreiben* Sie **zwei** Themen der **Sachebene**, die im Kick-off-Meeting behandelt werden.

**A3 (4 P):** Die Gestaltung der Beziehungsebene ist eine zentrale Voraussetzung für einen guten Teamgeist. *Beschreiben* Sie **zwei** Aspekte, mit denen Sie die Teamarbeit fördern.

**A4 (4 P):** Wegen der hohen Qualitätsanforderungen im Servicegeschäft wird in einem Workshop „klassisches“ gegen „agiles“ Projektmanagement abgewogen. *Beschreiben* Sie die Grundzüge **beider** Vorgehensweisen.

**A5 (4 P):** *Nennen* und *beschreiben* Sie **ein** Vorgehensmodell. *Geben* Sie *an*, ob es klassisch oder agil ist.

## Block B – Wartungsprozess (29 P)

Ein wichtiges Geschäftsfeld ist die jährliche Wartung der Pflegebetten. Akkus, Handschalter und Hubmotoren verschleißen; werden sie nicht rechtzeitig getauscht, fallen Betten aus. Alle Heime mit Wartungsvertrag werden rechtzeitig informiert. Wichtig ist, dass die Verschleißteile vom **Zentrallager** an den **Servicestützpunkt** geliefert werden, bevor das Serviceteam ausrückt.

**B1 (21 P):** Der Wartungsprozess soll visualisiert werden. Von den Mitarbeitern erhalten Sie folgende Beschreibung:
- Das Serviceteam prüft monatlich die Fälligkeiten aller Wartungsverträge.
- Ist bei einem Vertrag keine Wartung in den nächsten sechs Wochen fällig, endet der Ablauf für diesen Vertrag.
- Ist eine Wartung fällig, werden alle Betten desselben Heims zu einem Wartungsauftrag gebündelt und der Auftrag wird angelegt.
- Im Servicestützpunkt wird geprüft, ob alle Verschleißteile vorrätig sind.
- Sind alle Teile vorrätig, plant das Serviceteam einen Techniker ein und vereinbart einen Termin mit dem Heim.
- Fehlen Teile, bestellt das Serviceteam sie im Zentrallager. Das Zentrallager bestätigt den Liefertermin.
- Nach der Bestätigung plant das Serviceteam einen Techniker ein und vereinbart den Termin; gleichzeitig liefert das Zentrallager die Teile. Die Wartung beginnt erst, wenn die Teile eingetroffen sind.
- Zum vereinbarten Termin führt der Techniker die Wartung und die sicherheitstechnische Kontrolle durch.
- Fällt dabei ein Defekt auf, stößt er den Reparaturprozess an; sonst dokumentiert er die Wartung und schließt den Auftrag ab.

*Erstellen* Sie für diesen Prozess ein **UML-Aktivitätsdiagramm** mit den Schwimmbahnen **Serviceteam** und **Zentrallager**.

**B2 (8 P):** Für die Bewertung des Wartungsprozesses wird bereits die **Gesamtdauer** vom Anlegen des Wartungsauftrags bis zum Abschluss genutzt. *Ergänzen* Sie die Tabelle um **zwei** weitere Kennzahlen und *erläutern* Sie deren Nutzen. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Kennzahl | Nutzen |
|---|---|
| Störungen je Bett in den zwölf Monaten nach der Wartung | Wirksamkeit der Wartung beurteilen, Wartungsintervall anpassen |
| | |
| | |

## Block C – Störungsprozess und IoT (27 P)

Die **Seniorenresidenz Lindenhof** ist ein wichtiger Kunde. An einem Freitagabend fielen dort bei sechs Pflegebetten die Hubmotoren aus. Der Störungsfall wurde nicht befriedigend gelöst; das Heim beschwerte sich massiv und kündigte den Vertrag. Die interne Aufarbeitung ergab:
- Die Störungshotline ist nur bis 18 Uhr besetzt, danach läuft ein Anrufbeantworter.
- Am Samstag nahm ein Auszubildender die Störung telefonisch auf – ohne Checkliste, Bettentyp und Fehlerbild blieben unklar.
- Die Ursache konnte am Telefon nicht ermittelt werden.
- Der Bereitschaftstechniker war gerade bei einem Bürokunden mit einem nicht dringenden Auftrag; er kam erst am Sonntag.
- Vor Ort zeigte sich: Die Steuerboxen waren nach einer Überspannung defekt. Ersatz gibt es nur im Zentrallager.
- Für den Einbau war eine zweite Anfahrt am Dienstag nötig.
- Bis dahin mussten Bewohner in nicht verstellbaren Ersatzbetten liegen; das Pflegepersonal musste schwer heben.

Zur Vorbereitung einer Entscheidung wertet die Geschäftsleitung folgende Herstellerinformation aus (Anlage zu C2 bis C5):

> *"Connected care beds – what you need before you start.* (1) **Device level:** every bed needs a controller with sensors for motor current, motor run time, battery level and error codes, plus a communication module. (2) **Connectivity:** care homes rarely offer reliable Wi-Fi in every room. Beds should therefore support a fallback such as LTE-M or NB-IoT, and a gateway per floor can collect data via Bluetooth Low Energy. (3) **Service platform:** the service provider needs a central platform that receives, stores and analyses the data – in real time for alarms and over months for predictive maintenance. (4) **Security:** data must be encrypted end to end, every device must authenticate itself, and firmware updates must be signed. (5) **Integration:** alarms should appear directly in the service provider's dispatch system and on the technicians' tablets."*

**C1 (12 P):** *Analysieren* Sie den abgelaufenen Prozess und *beschreiben* Sie **zwei** Probleme. *Beschreiben* Sie zu jedem Problem die Auswirkung auf den Störungsfall und einen konkreten Verbesserungsvorschlag. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Prozessproblem | Auswirkung | Verbesserungsvorschlag |
|---|---|---|
| | | |
| | | |

**C2 (2 P):** *Beschreiben* Sie anhand der Herstellerinformation **eine** technische Grundvoraussetzung für vernetzte Pflegebetten.

**C3 (2 P):** *Nennen* Sie **zwei** Daten, die die Sensoren der Betten erfassen und übertragen können.

**C4 (2 P):** *Nennen* Sie **zwei** Technologien, mit denen die Betten vernetzt werden können.

**C5 (2 P):** *Beschreiben* Sie, was Nordholz Objekt bereitstellen muss, um die Daten der Betten zu empfangen und zu verarbeiten.

**C6 (3 P):** *Nennen* Sie **einen** rechtlichen Aspekt, der bei vernetzten Pflegebetten in Deutschland zu beachten ist, und *begründen* Sie Ihre Antwort.

**C7 (4 P):** Die Geschäftsleitung hat zwei Optionen, auf den Kundenverlust zu reagieren: die **Verbesserung des Störungsprozesses** oder die **Einführung vernetzter Betten (IoT)**. *Nennen* Sie zu jeder Option einen Vorteil und einen Nachteil. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| | Prozessverbesserung | IoT-Einführung |
|---|---|---|
| Vorteil | | |
| Nachteil | | |

## Block D – SLA-Kalkulation und Statusbericht (20 P)

Nordholz Objekt bietet zwei SLAs an: **SLA Premium** (Reaktionszeit vier Stunden, rund um die Uhr) haben 15 % der Kunden gebucht, **SLA Basis** (Reaktionszeit 24 Stunden, werktags) 60 %; 25 % haben kein SLA. Kostentreiber der Kalkulation sind die Personalkosten der Techniker.

**Auszug aus der Vorkalkulation (je Kunde und Monat)**

| Position | Satz | SLA Premium | SLA Basis |
|---|---|---|---|
| Grundlohn | €/Stunde | 28,00 | 28,00 |
| Lohnnebenkosten (auf Grundlohn) | 40 % | 11,20 | 11,20 |
| Zuschlag Nacht | 25 % | 7,00 | 7,00 |
| Zuschlag Sonn-/Feiertag | 50 % | 14,00 | 14,00 |
| Stunden/Monat (geplant) | Stunden | 16 | 8 |
| Personalkosten/Monat (geplant) | € | 711,20 | 320,60 |
| Ø Personalkosten/Stunde | €/Stunde | 44,45 | 40,08 |
| Gewinnzuschlag | 30 % | 13,34 | 12,02 |
| Ø Preis/Stunde | €/Stunde | 57,79 | 52,10 |
| Preis SLA-Pauschale | €/Monat | 924,56 | 416,78 |

**Nachkalkulation (je Kunde und Monat)**

| Position | Einheit | SLA Premium | SLA Basis |
|---|---|---|---|
| Stunden/Monat IST | Stunden | 19 | 11 |
| davon Nacht | Stunden | 6 | 2 |
| davon Sonn-/Feiertag | Stunden | 5 | 1 |
| Grundlohn | € | 532,00 | 308,00 |
| Lohnnebenkosten | € | 212,80 | 123,20 |
| Zuschlag Nacht | € | 42,00 | 14,00 |
| Zuschlag Sonn-/Feiertag | € | 70,00 | 14,00 |
| Personalkosten/Monat IST | € | 856,80 | 459,20 |

**D1 (10 P):** *Vervollständigen* Sie die Nachkalkulation. *Tragen* Sie die Werte in die Tabelle *ein* (zwei Nachkommastellen).

| Kennzahl | Einheit | SLA Premium | SLA Basis |
|---|---|---|---|
| Ø Personalkosten/Stunde | €/Stunde | | |
| Gewinn/Kunde/Monat | € | | |
| Gewinn/Stunde | €/Stunde | | |
| Gewinnzuschlag | % | | |

> **Formeln:**
> - Ø Personalkosten/Stunde = Personalkosten/Monat IST / Stunden/Monat IST
> - Gewinn/Kunde/Monat = Preis SLA-Pauschale − Personalkosten/Monat IST
> - Gewinn/Stunde = Gewinn/Kunde/Monat / Stunden/Monat IST
> - Gewinnzuschlag = Gewinn/Stunde / Ø Personalkosten/Stunde · 100 %

**D2 (4 P):** *Beschreiben* Sie das Ergebnis der Nachkalkulation mit Blick auf die Preisgestaltung der beiden SLAs.

> **Formel:** Gewinnzuschlag = Gewinn/Stunde / Ø Personalkosten/Stunde · 100 %

**D3 (6 P):** Die Geschäftsleitung möchte zur Überprüfung der Wirtschaftlichkeit einen monatlichen Statusbericht. Neben dem Gewinn interessiert sie sich für die **Attraktivität** der SLAs. *Nennen* Sie **zwei** Inhalte des Berichts und *begründen* Sie Ihre Wahl. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Inhalt | Begründung |
|---|---|
| | |
| | |

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich beschreibe Befürchtungen verschiedener Stakeholder und ordne jeder eine passende Gegenmaßnahme zu.
- [ ] Ich trenne Inhalte der Sachebene und der Beziehungsebene eines Kick-off-Meetings.
- [ ] Ich beschreibe klassisches und agiles Vorgehen und ordne Wasserfall, V-Modell, Scrum und Kanban richtig ein.
- [ ] Ich modelliere ein Aktivitätsdiagramm mit Schwimmbahnen, Zusammenführung, Fork/Join beim Warten auf eine Lieferung und Ablaufende.
- [ ] Ich leite Kennzahlen für einen Wartungsprozess ab und erläutere ihren Nutzen.
- [ ] Ich analysiere einen Störungsfall als Problem – Auswirkung – Verbesserungsvorschlag.
- [ ] Ich beantworte Fragen zu einem englischen Fachtext sinngemäß auf Deutsch und bezogen auf das Szenario.
- [ ] Ich nenne Voraussetzungen, Daten, Vernetzungstechnologien und rechtliche Aspekte von IoT.
- [ ] Ich vervollständige eine SLA-Nachkalkulation und leite eine Aussage zur Preisgestaltung ab.
- [ ] Ich begründe Inhalte eines Statusberichts für die Geschäftsleitung.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
