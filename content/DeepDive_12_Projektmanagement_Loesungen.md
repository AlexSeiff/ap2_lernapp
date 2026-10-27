# Musterlösungen Übungsklausur Projektmanagement & Wirtschaftlichkeit (Deep Dive 12)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Block C (Netzplan, 28 P) und Block D (Wirtschaftlichkeit, 26 P) sind reine Rechenpunkte – hier darf nichts fehlen. 92+ P = sehr gut.

---

## Block A – Grundlagen (20 P)

**A1 (6 P):**
Vier Projektmerkmale *(je 1 P)*: **Einmaligkeit** · **zeitliche Befristung** mit definiertem Anfang und Ende · **Zielorientierung** (klar definiertes Ergebnis) · **Neuartigkeit/Komplexität** · **begrenzte Ressourcen** · **interdisziplinäre Zusammenarbeit**.

Begründung *(2 P)*: Die monatliche Umsatzauswertung ist eine **wiederkehrende Routineaufgabe**. Ihr fehlen Einmaligkeit und Neuartigkeit – sie läuft nach einem festen, bereits etablierten Ablauf ab und hat kein definiertes Projektende. Ein Projekt wäre dagegen die **erstmalige Einführung** einer automatisierten Umsatzauswertung.

**A2 (6 P):**

| | Lastenheft | Pflichtenheft |
|---|---|---|
| **Wer** | Auftraggeber (Fachbereich/Möbelhaus) | Auftragnehmer (Dienstleister/IT) |
| **Wann** | vor der Beauftragung, Grundlage der Ausschreibung | nach Beauftragung, vor Umsetzungsbeginn |
| **Inhalt** | *Was* wird gefordert und *wofür* – Anforderungen aus Anwendersicht, Rahmenbedingungen, Ziele | *Wie und womit* wird umgesetzt – technisches Lösungskonzept, Architektur, Schnittstellen, Abnahmekriterien |

Ergänzung: Das Pflichtenheft wird vom Auftraggeber **abgenommen** und ist dadurch die verbindliche Grundlage für die spätere Abnahme des Ergebnisses. *(je Zeile 2 P)*

**A3 (4 P):**
**Funktional** beschreibt, *was* das System leisten soll; **nicht-funktional**, *wie gut* es das tut – also Qualitätseigenschaften. *(2 P)*
Beispiele *(2 P)*:
- funktional: „Das System erstellt einen Monatsbericht je Filiale"; „Berichte lassen sich als PDF exportieren".
- nicht-funktional: „Ein Bericht wird in höchstens drei Sekunden aufgebaut"; „Das System ist während der Geschäftszeiten zu 99 % verfügbar"; „Der Zugriff erfolgt rollenbasiert".

**A4 (4 P):**
Beispielziel: *„Bis zum 31.03.2027 werden die monatlichen Umsatzberichte für alle acht Filialen vollautomatisch erstellt, sodass sich der manuelle Auswertungsaufwand von 20 auf höchstens 4 Stunden je Monat reduziert."*

Nachweis *(je 0,8 P)*:
- **Spezifisch:** benennt konkret Umsatzberichte, alle acht Filialen, Automatisierung
- **Messbar:** 20 → höchstens 4 Stunden pro Monat
- **Attraktiv/Akzeptiert:** entlastet den Fachbereich spürbar und ist mit ihm abgestimmt
- **Realistisch:** Datenquellen sind vorhanden, Aufwand im geplanten Projektrahmen leistbar
- **Terminiert:** 31.03.2027

*Prüferkommentar: Der Nachweis ist eigenständig bepunktet. Ein SMART-Ziel ohne Zuordnung der fünf Kriterien gibt maximal 2 P.*

---

## Block B – Vorgehensmodelle (14 P)

**B1 (8 P):** *(je Kriterium 2 P)*

| Kriterium | Wasserfall | Scrum |
|---|---|---|
| Ablauf | streng sequenziell, Phasen nacheinander | iterativ-inkrementell in Sprints von höchstens einem Monat (meist 2–4 Wochen) |
| Umgang mit Änderungen | spät teuer, Änderungen unerwünscht | eingeplant, Backlog wird laufend neu priorisiert |
| Ergebnis für den Kunden | erst am Projektende sichtbar | nach jedem Sprint ein nutzbares Inkrement |
| Planbarkeit von Termin und Kosten | hoch, früh festlegbar | Gesamtumfang schwerer vorab zu fixieren |
| Anforderungen | müssen zu Beginn klar und stabil sein | dürfen zu Beginn unklar sein |
| Dokumentation | umfangreich, formal | schlanker, Fokus auf lauffähiges Ergebnis |

**B2 (6 P):**
Scrum-Rollen *(je 1 P)*:
- **Product Owner:** verantwortet den fachlichen Wert des Produkts und priorisiert das Product Backlog.
- **Scrum Master:** sorgt für die Einhaltung des Rahmenwerks und beseitigt Hindernisse – er ist kein Vorgesetzter des Teams.
- **Developers** (Entwickler; bis zum Scrum Guide 2017 „Entwicklungsteam"): managen sich selbst und erstellen in jedem Sprint ein nutzbares Inkrement, das die Definition of Done erfüllt.

*Prüferkommentar: Der Scrum Guide 2020 spricht von Verantwortlichkeiten statt Rollen und von Developers statt Entwicklungsteam. Die ältere Bezeichnung „Entwicklungsteam" wird weiterhin als richtig gewertet.*

Empfehlung *(3 P)*: Ein **hybrides Vorgehen**. Der feste Endtermin verlangt einen klassischen Rahmen mit verbindlichen Meilensteinen und einer Gesamtplanung; die unklaren Anforderungen sprechen dagegen für iterative Umsetzung mit regelmäßigen Zwischenständen und Rückmeldung des Fachbereichs. Praktisch bedeutet das: Rahmentermine und Abnahmepunkte klassisch festlegen, die Entwicklung innerhalb dieses Rahmens in kurzen Iterationen mit priorisiertem Backlog durchführen. So bleibt der Termin steuerbar, und bei knapper Zeit wird Umfang reduziert statt der Termin gerissen.

*Prüferkommentar: Auch eine begründete Entscheidung für rein agiles oder rein klassisches Vorgehen erhält volle Punkte – bewertet wird die Argumentation, nicht die Präferenz. Wer den Zielkonflikt zwischen festem Termin und unklaren Anforderungen gar nicht benennt, erhält maximal 1 P.*

---

## Block C – Netzplan (28 P)

**C1 (16 P):**

Vorwärtsrechnung (FAZ = **größtes** FEZ der Vorgänger), Rückwärtsrechnung (SEZ = **kleinstes** SAZ der Nachfolger):

| Vorgang | Dauer | FAZ | FEZ | SAZ | SEZ | GP | FP |
|---|---|---|---|---|---|---|---|
| A | 5 | 0 | 5 | 0 | 5 | 0 | 0 |
| B | 4 | 5 | 9 | 7 | 11 | 2 | 0 |
| C | 6 | 5 | 11 | 5 | 11 | 0 | 0 |
| D | 8 | 11 | 19 | 11 | 19 | 0 | 0 |
| E | 3 | 9 | 12 | 16 | 19 | 7 | 7 |
| F | 4 | 19 | 23 | 19 | 23 | 0 | 0 |
| G | 2 | 23 | 25 | 23 | 25 | 0 | 0 |

Wichtige Zwischenschritte: $\text{FAZ}_D = \max(\text{FEZ}_B = 9;\ \text{FEZ}_C = 11)$ = **11**. $\text{FAZ}_F = \max(\text{FEZ}_D = 19;\ \text{FEZ}_E = 12)$ = **19**. $\text{SEZ}_B = \min(\text{SAZ}_D = 11;\ \text{SAZ}_E = 16)$ = **11**. $\text{SEZ}_A = \min(\text{SAZ}_B = 7;\ \text{SAZ}_C = 5)$ = **5**.

*Prüferkommentar: 8 P Vorwärtsrechnung, 8 P Rückwärtsrechnung. Ein Fehler am Zusammenlaufpunkt D oder F pflanzt sich durch den gesamten Plan fort – als Folgefehler wird er nur **einmal** bestraft, sofern die Methode danach konsequent angewendet wurde. Häufigster echter Fehler: vorwärts das Minimum statt des Maximums gebildet.*

**C2 (4 P):**
- **Projektdauer: 25 Tage** (größtes FEZ) *(2 P)*
- **Kritischer Pfad: A → C → D → F → G** (alle mit Gesamtpuffer 0), Summe der Dauern $5 + 6 + 8 + 4 + 2 = 25$ Tage *(2 P)*

**C3 (6 P):**
| Vorgang | Gesamtpuffer | Freier Puffer |
|---|---|---|
| **B** | SAZ − FAZ = 7 − 5 = **2 Tage** | min(FAZ D = 11; FAZ E = 9) − FEZ = 9 − 9 = **0 Tage** |
| **E** | 16 − 9 = **7 Tage** | FAZ F − FEZ = 19 − 12 = **7 Tage** |

*(4 P für die vier korrekten Werte)*

Erläuterung am Vorgang B *(2 P)*: Der **Gesamtpuffer** von 2 Tagen bedeutet, dass sich B um bis zu zwei Tage verschieben darf, **ohne den Projekttermin** von Tag 25 zu gefährden. Der **freie Puffer** von 0 Tagen bedeutet jedoch, dass bereits eine Verzögerung von einem Tag den Nachfolger E nach hinten schiebt. Der Gesamtpuffer wird hier also **auf Kosten eines anderen Vorgangs** in Anspruch genommen – B kann seinen Puffer nur nutzen, wenn E seinen eigenen Puffer entsprechend verbraucht.

*Prüferkommentar: Genau diese Unterscheidung ist der Zweck der Aufgabe. Wer beide Puffer gleichsetzt, verliert die 2 P der Erläuterung.*

**C4 (2 P):**
Vorgang C liegt **auf dem kritischen Pfad** und hat einen Gesamtpuffer von 0. Eine Verzögerung um zwei Tage verschiebt das Projektende daher **unmittelbar und vollständig** – die Projektdauer steigt von 25 auf **27 Tage**. Eine Kompensation wäre nur durch Verkürzung eines anderen kritischen Vorgangs möglich.

---

## Block D – Wirtschaftlichkeit (26 P)

**D1 (8 P):**
a) Amortisationszeit: $\frac{\text{Investition}}{\text{jährliche Ersparnis}} = \frac{45.000\ \text{€}}{18.000\ \text{€ pro Jahr}}$ = **2,5 Jahre** (30 Monate) *(3 P)*
b) Gesamtersparnis über fünf Jahre: $5 \cdot 18.000\ \text{€} = 90.000\ \text{€}$; Gewinn: $90.000 - 45.000 = 45.000\ \text{€}$
ROI: $\frac{\text{Gewinn}}{\text{eingesetztes Kapital}} \cdot 100 = \frac{45.000}{45.000} \cdot 100$ = **100 %** über die Nutzungsdauer, entspricht **20 % pro Jahr** *(3 P)*
c) Beurteilung: Die Investition amortisiert sich nach 2,5 Jahren und damit deutlich innerhalb der geplanten Nutzungsdauer von fünf Jahren. In den verbleibenden 2,5 Jahren entsteht ein Überschuss von 45.000 €. Die Investition ist wirtschaftlich **zu empfehlen**, sofern die laufenden Betriebskosten – in dieser Rechnung nicht enthalten – den Rückfluss nicht wesentlich schmälern. *(2 P)*

**D2 (10 P):**
a) *(6 P)*

| Kriterium | Gewicht | A | Teilnutzen A | B | Teilnutzen B |
|---|---|---|---|---|---|
| Funktionsumfang | 40 % | 8 | 3,20 | 6 | 2,40 |
| Kosten | 30 % | 5 | 1,50 | 9 | 2,70 |
| Integrationsfähigkeit | 20 % | 9 | 1,80 | 7 | 1,40 |
| Support | 10 % | 7 | 0,70 | 8 | 0,80 |
| **Nutzwert** | **100 %** | | **7,20** | | **7,30** |

**Anbieter B** erreicht mit 7,30 den höheren Nutzwert.

b) *(4 P)* Kritische Beurteilung:
Der Vorsprung beträgt lediglich **0,10 Punkte (rund 1,4 %)** und liegt damit klar innerhalb der Unschärfe des Verfahrens. Schon eine geringfügig andere Gewichtung kehrt das Ergebnis um: Würde der Funktionsumfang zulasten der Kosten mit 50 % statt 40 % gewichtet (Kosten 20 % statt 30 %), läge Anbieter A mit 7,50 zu 7,00 vorn – bereits rund 2 Prozentpunkte Verschiebung von den Kosten zum Funktionsumfang reichen für den Wechsel. *(2 P)*
Grundsätzlich sind Kriterienauswahl, Gewichtung und Punktvergabe **subjektiv**; die Zahlen suggerieren eine Genauigkeit, die sie nicht haben. Erforderlich ist daher eine **Sensitivitätsprüfung** mit veränderten Gewichten sowie eine Entscheidung unter Einbeziehung zusätzlicher Kriterien (Referenzen, Vertragsbedingungen, Anbieterstabilität, Testinstallation). Der Wert der Methode liegt weniger im Ergebnis als in der **nachvollziehbaren Dokumentation** der Entscheidung. *(2 P)*

*Prüferkommentar: Wer nur „Anbieter B gewinnt" schreibt, erhält 0 von 4 P im Teil b. Das Erkennen der Knappheit ist die eigentliche Prüfungsleistung.*

**D3 (4 P):**
Deckungsbeitrag je Stück: $80\ \text{€} - 50\ \text{€} = 30\ \text{€}$
Break-even-Menge: $\frac{\text{Fixkosten}}{\text{Deckungsbeitrag je Stück}} = \frac{24.000\ \text{€}}{30\ \text{€}}$ = **800 Stück** pro Jahr
*(2 P Ansatz mit Deckungsbeitrag, 2 P Ergebnis)*

**D4 (4 P):**
**TCO (Total Cost of Ownership)** umfasst alle Kosten über den gesamten Lebenszyklus einer Lösung – nicht nur die Anschaffung, sondern auch Einführung, Betrieb, Wartung, Schulung, Anpassungen und die spätere Ablösung. *(2 P)*

Drei nicht berücksichtigte Positionen *(je 0,67 P)*: jährliche **Lizenz- und Wartungskosten** · **Schulungsaufwand** für die Anwender · **internes Personal** für Betrieb und Support · **Infrastrukturkosten** (Server, Cloud) · **Anpassungen** bei Änderungen der Quellsysteme · **Migrations- und Ablösekosten** am Ende der Laufzeit.

---

## Block E – Risiken und Steuerung (12 P)

**E1 (6 P):** *(je Risiko 1 P RPZ, 1 P Strategie)*

| Risiko | Risikowert | Strategie |
|---|---|---|
| (a) Der externe Dienstleister fällt aus (W = 2, S = 5) | 10 | **Übertragen/Vermindern** – vertragliche Regelung mit Service-Level und Vertragsstrafe, Zweitanbieter als Rückfalloption |
| (b) Die Datenqualität der Quellsysteme ist schlechter als erwartet (W = 4, S = 4) | 16 | **Vermindern** – frühzeitiges Data Profiling in der Analysephase, Pufferzeit für Bereinigung einplanen, Qualitätsregeln im ETL |
| (c) Der Fachbereich hat keine Zeit für Abstimmungen (W = 3, S = 3) | 9 | **Vermindern** – feste Termine früh verbindlich vereinbaren, Verfügbarkeit durch die Leitung zusichern lassen, kurze getaktete Abstimmungen |

Rechnung: (a) $2 \cdot 5$ = **10** · (b) $4 \cdot 4$ = **16** · (c) $3 \cdot 3$ = **9**

Risiko (b) hat mit 16 die höchste Priorität und ist zuerst zu behandeln – was in einem Datenprojekt auch der Erfahrung entspricht.

*Prüferkommentar: Gerechnet wird hier der zweifaktorielle Risikowert W · S (Maximum 25). Nicht mit der RPZ der FMEA verwechseln, die zusätzlich die Entdeckungswahrscheinlichkeit enthält.*

**E2 (3 P):**
**Scope Creep** bezeichnet das schleichende, unkontrollierte Anwachsen des Projektumfangs durch fortlaufend hinzukommende Wünsche, die ohne formale Bewertung übernommen werden. Zeit- und Kostenrahmen bleiben dabei unverändert – der Termin wird zwangsläufig gerissen. *(1,5 P)*
Zwei Maßnahmen *(je 0,75 P)*: **verbindliche Scope-Definition** im Pflichtenheft mit ausdrücklicher Abgrenzung, was **nicht** Bestandteil ist · **formales Änderungsmanagement**: Jeder Änderungswunsch wird schriftlich erfasst, hinsichtlich Auswirkung auf Zeit, Kosten und Qualität bewertet und vom Auftraggeber entschieden · Priorisierung über ein Backlog mit der Regel, dass Neues nur gegen Bestehendes eingetauscht wird.

**E3 (3 P):**
Der Soll-Ist-Vergleich stellt am Projektende die **geplanten den tatsächlich erreichten Werten** gegenüber – und zwar in allen drei Dimensionen des magischen Dreiecks: **Termine** (geplante gegen tatsächliche Dauer), **Kosten/Aufwand** (geschätzte gegen tatsächliche Stunden und Ausgaben) und **Leistung/Qualität** (Zielerreichung gemessen an den SMART-Zielen und Abnahmekriterien). Abweichungen werden dabei nicht nur benannt, sondern **begründet**. *(2 P)*

Für die Projektdokumentation ist er unverzichtbar, weil er der einzige objektive Nachweis der Zielerreichung ist. Der Prüfungsausschuss bewertet nicht, ob alles nach Plan lief, sondern ob du Abweichungen **erkennst, erklärst und daraus Schlüsse ziehst** – ein ehrlich analysiertes verfehltes Teilziel bringt mehr Punkte als eine unbelegte Erfolgsmeldung. *(1 P)*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Netzplan alle zwei Wochen einmal rechnen, damit die Routine bleibt |
| 81–91 | gut | Prüfe getrennt: Netzplan (C) gegen Wirtschaftlichkeit (D) |
| < 81 | | Teil 3 und 4 wiederholen, einen zweiten Netzplan mit anderen Werten rechnen |

**Doppelter Nutzen dieses Deep Dives:** Alles, was du hier gerechnet hast, brauchst du in deiner **eigenen Projektdokumentation** wieder – SMART-Ziele im Zielkapitel, Netzplan oder Gantt in der Zeitplanung, Amortisationsrechnung in der Wirtschaftlichkeitsbetrachtung, Risikoanalyse im Planungskapitel, Soll-Ist-Vergleich im Fazit. Nutze die Übungsklausur deshalb nicht nur als Test, sondern als Vorlage: Jede Aufgabe entspricht einem Abschnitt, den du ohnehin schreiben musst.

---

## Zwischenstand

Mit Deep Dive 12 sind Grundlagen und Vertiefung vollständig abgedeckt, und die Anwendungsphase ist eröffnet. Es folgen: **WiSo** (Deep Dive 13 und 14) sowie die ersten **vollständigen Altklausuren unter Zeitbedingungen**.

Ab hier verschiebt sich der Schwerpunkt vom Lernen zum **Prüfen unter Realbedingungen** – besorge dir rechtzeitig echte Altklausuren deiner Fachrichtung, denn kein Lernzettel ersetzt das Gefühl für Aufgabenstil und Zeitdruck.
