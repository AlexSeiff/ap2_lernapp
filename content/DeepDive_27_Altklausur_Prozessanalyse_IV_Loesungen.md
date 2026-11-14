# Musterlösungen Übungsklausur Altklausur-Training Prozessanalyse IV (Deep Dive 27)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen** wie im echten Lösungsschlüssel – andere sach- und fachgerechte Antworten zählen gleichwertig. Bewerte nur so viele Nennungen, wie verlangt sind. Diagramme bewertest du mit der Checkliste. 92+ P = sehr gut.

---

## Block A – Projekt HolzCheck-App (26 P)

**A1 (3 P):** *(je Anforderung 1 P)*, z. B.:
- Messgerät per NFC mit dem Tablet koppeln und Messwerte (Holzfeuchte, Temperatur) übernehmen.
- Messwerte mit Lagerbox, Stapel, Datum und Uhrzeit in der Cloud-Datenbank speichern.
- Verlauf der Holzfeuchte je Stapel anzeigen und melden, wenn der Zielwert erreicht ist.
- Messungen ohne Netz zwischenspeichern und später synchronisieren.
- Benutzer anmelden und Lagerboxen verwalten.

*Prüferkommentar: „Die App soll schnell und sicher sein“ ist nichtfunktional und bringt keinen Punkt. Funktional ist, **was** die App tut.*

**A2 (6 P):** *(je Aktivität 1 P Nennung, 1 P Beschreibung)*, z. B.:
- **Product Backlog anlegen und priorisieren:** Die Anforderungen der Lagermeisterin werden als User Storys gesammelt, geschätzt und nach Nutzen geordnet – „Messwert übernehmen“ steht oben.
- **Sprint Planning:** Das Team wählt die Storys für den nächsten Sprint von zwei bis vier Wochen und legt ein Sprintziel fest, z. B. „Kopplung und Speichern einer Messung“.
- **Daily Scrum:** Kurze tägliche Abstimmung, was erledigt ist, was ansteht und was blockiert – etwa ein fehlendes Testgerät.
- **Sprint Review:** Am Sprintende wird das lauffähige Inkrement mit der Lagermeisterin an einer Lagerbox ausprobiert; ihre Rückmeldung fließt in das Backlog.
- **Retrospektive:** Das Team bespricht die Zusammenarbeit und vereinbart Verbesserungen für den nächsten Sprint.

**A3 (2 P):** *(je Grund 1 P)* Fester Umfang und Festpreis sind verlangt · die Anwender haben keine Zeit für regelmäßige Reviews · kein entscheidungsbefugter Product Owner · Anforderungen sind vollständig bekannt und stabil · Team ohne Erfahrung mit Selbstorganisation · umfangreiche Dokumentationspflichten.

**A4 (6 P):** *(je Inhalt 1 P Nennung, 1 P Beschreibung)*, z. B.:
- **Testobjekte und Testziele:** Geprüft werden Kopplung per NFC, Übernahme der Messwerte, Speicherung in der Cloud und die Anzeige des Verlaufs; Ziel ist, dass kein Messwert verloren geht oder falsch zugeordnet wird.
- **Teststufen und Testarten:** Modultests der Umrechnung, Integrationstest Messgerät – App – Cloud, Systemtest im Lager, Abnahmetest durch die Lagermeisterin; dazu Usability-Test mit Handschuhen und Test ohne Netz.
- **Testfälle und Testdaten:** Je Funktion Eingabe und erwartetes Ergebnis, auch Grenz- und Fehlerfälle (Feuchte außerhalb des Messbereichs, Verbindungsabbruch während der Übertragung).
- **Testumgebung:** Tablets der Manufaktur, mehrere Betriebssystemversionen, eigene Testdatenbank getrennt von den echten Lagerdaten.
- **Rollen, Zeitplan und Abnahmekriterien:** Wer testet wann; welche Fehlerklassen die Freigabe verhindern.

*Prüferkommentar: Einzelne Testfälle aufzuzählen beantwortet die Frage nicht. Verlangt sind die Bausteine des Konzepts.*

**A5 (3 P):** *(je Risiko 1 P)* Schlüsselperson im Team fällt aus · NFC-Kopplung funktioniert nicht mit allen Tablets · Funkabdeckung im Lager reicht nicht · Anforderungen ändern sich stärker als geplant, Budget oder Termin werden überschritten · Mitarbeiter lehnen die App ab · Cloud-Anbieter ändert Preise oder Schnittstellen · Datenverlust durch Synchronisationsfehler.

**A6 (6 P):** *(je Ziel 2 P: Ziel + Wirkung)*, z. B.:
- **Informieren:** Zweck und Nutzen von HolzCheck erklären (weniger Ausschuss, kein doppeltes Aufschreiben), damit keine Gerüchte entstehen.
- **Ängste aufnehmen und abbauen:** Befürchtungen wie Kontrolle der Arbeitsleistung oder Stellenabbau offen ansprechen und beantworten.
- **Beteiligen:** Die Beschäftigten bringen ihre Erfahrung ein (Abläufe an der Lagerbox, Bedienung mit Handschuhen) – das verbessert die App und erhöht die Akzeptanz.
- **Befähigen:** Die Bedienung vorführen und ausprobieren lassen, Schulungsbedarf feststellen.
- **Multiplikatoren gewinnen:** Mitarbeiter finden, die als Ansprechpartner die Einführung unterstützen.

---

## Block B – Lagerkontrolle: Ist-Prozess (25 P)

**B1 (4 P):** *(je Vorteil 2 P)*, z. B.:
- **Genormte Notation** (ISO/IEC 19510): Alle Beteiligten lesen dasselbe Modell gleich, Missverständnisse zwischen Fachabteilung und IT nehmen ab.
- **Rollen und Übergaben sichtbar:** Pools und Lanes zeigen, wer was erledigt und wo Arbeit weitergegeben wird.
- **Fachlich lesbar und technisch genau:** Das Modell dient als Diskussionsgrundlage und kann als Vorlage für die Automatisierung in einer Workflow-Engine dienen.
- **Ereignisse und Ausnahmen** (Zeit, Nachricht, Fehler) lassen sich eindeutig darstellen.

**B2 (13 P):** Erwartete Elemente des BPMN-Diagramms:

| Element | P |
|---|---|
| Pool mit den Lanes „Lagermeisterin“ und „Mitarbeiter“ | 1 |
| Startereignis (z. B. Zeitereignis „morgens, Mo–Sa“) | 1 |
| Task „Lagerbox begutachten und Holzfeuchte messen“ | 1 |
| **Exklusives Gateway** „Welche Tätigkeit ist nötig?“ mit vier beschrifteten Ausgängen | 2 |
| Tasks „Behandlungsmittel vorbereiten“, „Stapelleisten bereitlegen“, „Hubwagen bereitstellen“ je im passenden Zweig | 3 |
| Zweig „keine Tätigkeit nötig“: Task „Büroarbeit erledigen“ mit eigenem Endereignis | 1 |
| Zusammenführendes exklusives Gateway der drei Arbeitszweige, danach Task „Mitarbeiter beauftragen“ | 1 |
| Task „Tätigkeit ausführen“ in der Lane „Mitarbeiter“ | 1 |
| Zeit-Zwischenereignis „später Nachmittag“ und Task „Geleistete Arbeit kontrollieren“ (Lagermeisterin) | 1 |
| Endereignis; Sequenzfluss vollständig und gerichtet | 1 |

Ablauf in Textform: Start → Lagerbox begutachten und Holzfeuchte messen → ✕ `[Schimmelbefall]` Behandlungsmittel vorbereiten · `[Stapel umsetzen]` Stapelleisten bereitlegen · `[Trockenkammer]` Hubwagen bereitstellen · `[keine Tätigkeit nötig]` Büroarbeit erledigen → Ende · die drei Arbeitszweige → ✕ Zusammenführung → Mitarbeiter beauftragen → (Lane Mitarbeiter) Tätigkeit ausführen → ⏱ später Nachmittag → Geleistete Arbeit kontrollieren → Ende.

*Prüferkommentar: Der Text sagt „entscheidet sich für **eine** Tätigkeit“ – ein paralleles oder inklusives Gateway ist deshalb falsch (2 P Abzug). Wer die Kontrolle der sechs Lagerboxen als Schleife darstellt, verliert keine Punkte. „Bis zum Nachmittag warten“ als Task statt als Zeitereignis kostet einen Punkt.*

**B3 (6 P):** *(je Darstellung 1 P Nennung, 2 P Unterscheidungsmerkmal)*, z. B.:
- **Ereignisgesteuerte Prozesskette (EPK):** Ereignisse und Funktionen wechseln sich streng ab; Verantwortliche stehen als Organisationseinheit an der Funktion, nicht in Lanes.
- **UML-Aktivitätsdiagramm:** Kommt aus der Softwaremodellierung; kennt keine Pools für getrennte Organisationen und keine Nachrichtenflüsse dazwischen. Parallele Abläufe werden mit Balken (Teilung, Synchronisation) statt mit Gateways dargestellt.
- **Programmablaufplan / Flussdiagramm:** Zeigt nur Schritte und Entscheidungen, keine Rollen und keine Ereignisse.
- **Tabellarische oder textliche Prozessbeschreibung:** Nicht normiert; Verzweigungen und parallele Abläufe sind schwer erkennbar.

**B4 (2 P):** *(Vorschlag 1 P, Wirkung 1 P)*, z. B.: Die Lagermeisterin erfasst Befund und Auftrag direkt am Tablet; die Mitarbeiter erhalten den Auftrag als Aufgabe in der App und melden ihn dort als erledigt. Das spart Wege und macht sichtbar, welche Lagerbox wann behandelt wurde. Weitere richtige Vorschläge: Material (Stapelleisten, Behandlungsmittel) fest an den Lagerboxen bereithalten · Kontrolle sofort nach der Erledigungsmeldung statt pauschal am Nachmittag · Reihenfolge der Lagerboxen nach Messwerten statt nach festem Plan.

---

## Block C – Stundenabrechnung der Aushilfen (23 P)

**C1 (2 P):** Ohne normierte Darstellung ist die Beschreibung **nicht eindeutig**: Reihenfolge, Verzweigungen (was gilt bei verspäteter Übertragung?) und Zuständigkeiten (wer prüft, wer zeichnet gegen?) lassen sich unterschiedlich lesen. Fehler und Lücken fallen kaum auf, und die Beschreibung lässt sich nur schwer mit anderen Prozessen vergleichen oder in ein System übertragen.

**C2 (3 P):** *(je Schnittstelle 1 P)* Auftragsübergabe Vorgesetzte → Aushilfe · Wochenzettel Aushilfe → Vorgesetzte (Prüfen und Gegenzeichnen) · Wochenzettel → gemeinsame Monatsliste · Krankheitsliste ↔ Arbeitsunfähigkeitsbescheinigungen · Monatsliste → Lohnabrechnung · Lohnabrechnung → Buchhaltungssystem.

**C3 (3 P):** Der **Normalfall geht unter**: Je mehr Sonderfälle ausmodelliert werden, desto unübersichtlicher wird die Beschreibung *(1 P)*. Sie wird aufwendig zu erstellen und zu pflegen, weil jede Änderung an vielen Stellen nachgezogen werden muss *(1 P)*, und die Beschäftigten finden den für sie wichtigen Standardablauf nicht mehr – die Beschreibung wird nicht gelesen oder falsch angewendet *(1 P)*. Besser: Ausnahmen als eigenen Teilprozess auslagern.

**C4 (12 P):** *(je Zeile 6 P: Problem 1 P, zwei Folgen je 2 P, Verbesserung 1 P)*

| Problem | Folgen | Verbesserung |
|---|---|---|
| Handschriftliche Zeiterfassung in uneinheitlichen Einheiten (Stunden mit Komma, Minuten, ohne Einheit) | Rechen- und Lesefehler bei der Abrechnung · Rückfragen und Verzögerung, weil Einträge wie „2,4“ gedeutet werden müssen | Digitale Zeiterfassung mit festem Format (Beginn und Ende je Auftrag) |
| Mehrfache manuelle Übertragung (Wochenzettel → Monatsliste → Abrechnung → Buchhaltungssystem; Nachzügler zusätzlich über einen gesonderten Zettel) | Übertragungsfehler, doppelt oder gar nicht erfasste Stunden · hoher Zeitaufwand, verspätete Abrechnung | Einmalige Erfassung in einem System mit automatischer Übernahme in Abrechnung und Buchhaltung |

Weitere richtige Zeilen: Papierablage der Zettel (Suchaufwand, Verlust; → digitale Archivierung) · verspätete Übertragung auf gesondertem Zettel (Stunden fehlen in der Abrechnung, Nachberechnung im Folgemonat; → Stichtag mit automatischer Erinnerung) · Prüfung und Gegenzeichnung erst im Nachhinein (Unstimmigkeiten nicht mehr klärbar, Streit über Stunden; → Freigabe je Auftrag am selben Tag).

*Prüferkommentar: Der Krankheitsfall ist bereits in C3 genannt – verlangt sind **weitere** Elemente. Eine Folge ist eine Wirkung auf Kosten, Zeit oder Qualität, nicht die Wiederholung des Problems.*

**C5 (3 P):** *(je Faktor 1 P)* **Eintrittswahrscheinlichkeit** · **Schadenshöhe bzw. Auswirkung** (Kosten, Termine, Qualität) · **Entdeckungswahrscheinlichkeit** · auch richtig: Zahl der betroffenen Personen oder Prozesse, Umkehrbarkeit der Änderung, Dauer bis zur Wirkung.

---

## Block D – Wirtschaftlichkeit und Auswertung (26 P)

**D1 (12 P):** *(Personalkosten 2 P, Herstellkosten 1 P, sonstige Gemeinkosten 2 P, Selbstkosten 1 P, Umsatz 2 P, Gewinn 2 P, Veränderung des Gewinns 2 P)*

| Kalkulation (EUR) | Zuschlagsatz Ist | Ist-Prozess | Zuschlagsatz neu | neuer Prozess |
|---|---|---|---|---|
| Materialeinzelkosten | | 240.000 | | 240.000 |
| + Materialgemeinkosten | 5 % | 12.000 | 5 % | 12.000 |
| = Materialkosten | | 252.000 | | 252.000 |
| + Personalkosten | | 150.000 | | 120.000 |
| + Abschreibung auf Investitionen | | 2.000 | | 38.000 |
| + sonstige Kosten | | 4.000 | | 4.000 |
| = Herstellkosten | | 408.000 | | 414.000 |
| + sonstige Gemeinkosten | 10 % | 40.800 | 5 % | 20.700 |
| = Selbstkosten | | 448.800 | | 434.700 |
| Gewinn | 25 % | 112.200 | 41,96 % | 182.400 |
| Umsatz | | 561.000 | | 617.100 |

Rechenwege:
- Personalkosten: $150.000 \cdot 0{,}8$ = **120.000 €**
- Herstellkosten: $252.000 + 120.000 + 38.000 + 4.000$ = **414.000 €**
- Sonstige Gemeinkosten: $414.000 \cdot 0{,}05$ = **20.700 €**
- Selbstkosten: $414.000 + 20.700$ = **434.700 €**
- Umsatz: $561.000 \cdot 1{,}1$ = **617.100 €**
- Gewinn: $617.100 - 434.700$ = **182.400 €**
- Gewinnzuschlag: $\frac{182.400}{434.700} \cdot 100\,\%$ = **41,96 %**

Veränderung des Gewinns: $182.400 - 112.200$ = **70.200 €**

Der Gewinn steigt um 70.200 € (rund 63 %), obwohl die Abschreibung um 36.000 € zunimmt.

*Prüferkommentar: Der Gewinn des neuen Prozesses wird **rückwärts** aus dem Umsatz ermittelt. Wer 25 % auf die neuen Selbstkosten rechnet, erhält 108.675 € und damit einen Rückgang – das widerspricht der Annahme „Umsatz +10 %“ und kostet die Punkte für Gewinn und Veränderung. Der Zuschlagsatz 41,96 % ist nicht verlangt.*

**D2 (8 P):** *(je Diagramm 4 P: geeigneter Diagrammtyp 1 P, Achsen mit Beschriftung und Einheit 1 P, Werte richtig eingetragen 1 P, Titel und Legende 1 P)*

- **Diagramm 1 – Anteil schlecht durchlüfteter Stapel:** Liniendiagramm, x-Achse „Monat“ (1 bis 6), y-Achse „Anteil in %“ (0 bis 60). Entweder eine Linie je Lagerbox mit Legende oder die Linie des Durchschnitts: 18 – 28 – 41 – 52 – 7 – 4.
- **Diagramm 2 – Personaleinsatz:** gestapeltes Säulendiagramm, x-Achse „Monat“, y-Achse „Stunden“ (0 bis 350), je Monat eine Säule mit vier Abschnitten (Legende mit den Namen) oder Säulen der Monatssummen: 340 – 284 – 180 – 310 – 98 – 88.

*Prüferkommentar: Ein Kreisdiagramm passt nicht – es zeigt Anteile an einem Ganzen, keinen Verlauf. Säulen beginnen bei null. Ohne Achsenbeschriftung gibt es je Diagramm höchstens 3 Punkte.*

**D3 (6 P):** *(Zusammenhang 2 P, je Grund 2 P)*

**Zusammenhang:** Die Holzfeuchte fällt von Monat 1 auf Monat 2 um 6 Prozentpunkte, bleibt dann von Monat 2 bis Monat 4 fast stehen (22 – 22 – 21 %) und fällt erst ab Monat 5 wieder kräftig (16 %, 11 %). Genau in der Stillstandsphase steigt der Anteil schlecht durchlüfteter Stapel von 28 % auf 52 %; sobald er in Monat 5 auf 7 % sinkt, trocknet das Holz wieder.

**Gründe:**
- **Schlechte Durchlüftung bremst die Trocknung:** Stapel ohne ausreichenden Luftstrom geben kaum Feuchtigkeit ab. Je höher ihr Anteil (Höchstwert 52 % in Monat 4), desto weniger sinkt die mittlere Holzfeuchte.
- **Zu wenig Personal zum Umsetzen:** Der Personaleinsatz fällt von 340 auf 284 und in Monat 3 auf 180 Stunden. Dadurch könnten Stapel zu spät umgesetzt worden sein. Der höhere Einsatz in Monat 4 (310 Stunden) könnte erklären, warum der Anteil schlecht durchlüfteter Stapel im Folgemonat auf 7 % fällt. Zum Prüfen dieser Erklärung braucht die Manufaktur beispielsweise die Termine der tatsächlich umgesetzten Stapel.

*Prüferkommentar: Volle Punkte gibt es nur, wenn alle drei Reihen verbunden werden und die Aussagen mit Zahlen belegt sind. „Die Holzfeuchte schwankt“ ist eine Beschreibung, keine Analyse.*
