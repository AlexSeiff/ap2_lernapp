# Musterlösungen Übungsklausur Altklausur-Training Prozessanalyse II (Deep Dive 21)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen** wie im echten Lösungsschlüssel – andere sach- und fachgerechte Antworten zählen gleichwertig. Bewerte nur so viele Nennungen, wie verlangt sind. Diagramme bewertest du mit der Checkliste. 92+ P = sehr gut.

---

## Block A – Warenausgabe: Ablauf und Ist-Aufnahme (25 P)

**A1 (15 P):** Erwartete Elemente des Aktivitätsdiagramms:

| Element | P |
|---|---|
| Zwei Schwimmbahnen „Kunde“ und „Mitarbeiter Warenausgabe“, Startknoten in der Bahn des Kunden | 1 |
| Aktion „Abholschein vorlegen“ (Kunde) | 1 |
| Aktion „Auftragsnummer scannen und Zahlung prüfen“ (Mitarbeiter) | 1 |
| Entscheidung mit `[nicht bezahlt]` → „Kunden zur Kasse schicken“ → **Ablaufende** ⊗ | 2 |
| Entscheidung mit `[Abholung durch Dritte]` / `[Käufer selbst]` | 1,5 |
| „Vollmacht und Ausweis zeigen“ (Kunde) und „Vollmacht und Ausweis prüfen“ (Mitarbeiter), danach Zusammenführung (Raute) | 2,5 |
| **Fork** nach der Prüfung bzw. Zusammenführung | 1 |
| Parallele Aktionen „Ware im Lager anfordern“ und „Lieferschein drucken“ → „Lieferschein unterschreiben“ (Kunde) | 2 |
| **Join** vor „Ware übergeben“ | 1 |
| „Ware übergeben“ und Endknoten ◉ | 1 |
| Kontrollfluss vollständig, alle Pfeile gerichtet | 1 |

Ablauf in Textform: Start → Abholschein vorlegen → Auftragsnummer scannen und Zahlung prüfen → ◇ `[nicht bezahlt]` Kunden zur Kasse schicken → ⊗ · `[bezahlt]` → ◇ `[Abholung durch Dritte]` Vollmacht und Ausweis zeigen → Vollmacht und Ausweis prüfen → ◇ Zusammenführung ← `[Käufer selbst]` → Fork → (Ware im Lager anfordern ‖ Lieferschein drucken → Lieferschein unterschreiben) → Join → Ware übergeben → ◉.

*Prüferkommentar: Wer den nicht bezahlten Auftrag mit dem Endknoten ◉ beendet, beendet formal den gesamten Ablauf – das Ablaufende ⊗ ist hier richtig (1 P Abzug bei ◉). Ohne Join gehen 1–2 Punkte verloren, weil die Ware dann übergeben würde, bevor der Lieferschein unterschrieben ist.*

**A2 (6 P):** *(je Methode 1 P Nennung, 1 P Anwendung auf die Warenausgabe)*, z. B.:
- **Beobachtung/Multimomentaufnahme:** An mehreren Samstagen alle 15 Minuten die Länge der Schlange zählen und Spitzenzeiten erkennen.
- **Zeitmessung:** Für 30 Abholungen die Zeit vom Vorlegen des Abholscheins bis zur Übergabe stoppen; zeigt, ob das Warten auf die Ware aus dem Lager der Engpass ist.
- **Interview:** Die Mitarbeiter der Warenausgabe befragen, wo es hakt (Funk, Lagerwege, fehlende Vollmachten).
- **Fragebogen:** Kunden an der Ausfahrt kurz zu Wartezeit und Zufriedenheit befragen.
- **Dokumentenanalyse:** Scannerprotokolle mit Uhrzeit jeder Abholung auswerten (Abholungen je Stunde).

*Prüferkommentar: Die Methode allein („Interview“) bringt nur den halben Punkt. Erst der Bezug „wen, wann, was“ macht die Anwendung.*

**A3 (4 P):** *(je Indikator 1 P, Begründung 1 P)*, z. B.:
- **Durchschnittliche Wartezeit je Kunde** – misst direkt die Ursache der Beschwerden.
- **Abholungen je Stunde (Durchsatz)** – zeigt, ob der Schalter zu Spitzenzeiten die Nachfrage schafft.
- **Durchlaufzeit je Abholung** – macht sichtbar, ob der Lagerweg den Prozess bremst.
- **Beschwerdequote** oder **Anteil abgebrochener Abholungen** – misst die Kundenzufriedenheit.

---

## Block B – Kundenkarte: Prozess analysieren und optimieren (25 P)

**B1 (4 P):** *(je Feld 1 P)*

| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| Personalisierte Karte macht den Abholschein überflüssig | Daten werden doppelt erfasst (Formular, dann abtippen) |
| **Chancen (Opportunities)** | **Risiken (Threats)** |
| Kunden erwarten digitale Angebote – Karte als App-Funktion | Datenschutzverstoß durch Tippfehler oder falsch abgelegte Einwilligungen |

Weitere richtige Merkmale: Stärke „Bonus bindet Kunden“, Schwäche „ein Infopunkt als Engpass“, Chance „Werbung mit Bonusprogramm“, Risiko „Wettbewerber mit digitaler Kundenkarte“.

*Prüferkommentar: Chancen und Risiken kommen von außen. „Mehr Kunden kaufen eine Karte“ ist eine Chance nur, wenn sie aus dem Umfeld begründet wird.*

**B2 (4 P):** *(je Kategorie 1 P)*

| Kategorie (5M) | Einflussgröße |
|---|---|
| Mensch | Tippfehler beim Abtippen des Formulars |
| Maschine | Langsamer Kartendrucker bzw. Laminiergerät |
| Methode | Doppelte Erfassung: erst Papier, dann Abtippen |
| Material | Unvollständig ausgefüllte Papierformulare |
| Milieu | Hoher Andrang am Samstag, nur ein Infopunkt |

**B3 (13 P):** Erwartete Elemente der eEPK (Beispiel):

| Element | P |
|---|---|
| Startereignis „Kunde möchte Kundenkarte“ und Funktion „In der App registrieren“ | 1 |
| Funktion „Persönliche Daten eingeben“ mit Informationsobjekt **Kundendatensatz** | 2 |
| Funktion „Einwilligung digital bestätigen“ mit Informationsobjekt **Einwilligung** | 2 |
| Funktion „E-Mail-Adresse bestätigen“ und Ereignis „Konto ist bestätigt“ | 1 |
| Funktion „Kartenart wählen“ und **XOR-Split** mit den Ereignissen „Digitale Karte gewählt“ / „Plastikkarte gewählt“ | 2 |
| Zweig digital: „QR-Code erzeugen“ mit Informationsobjekt **QR-Code/digitale Kundenkarte** | 1,5 |
| Zweig Post: „Kartenauftrag an Druckdienstleister senden“ mit Informationsobjekt **Kartenauftrag**, Ereignis „Karte ist versendet“ | 1,5 |
| **XOR-Join** und Endereignis „Kundenkarte ist aktiv“ | 1 |
| Organisationseinheiten bzw. Anwendungssystem (Kunde, App/Kundensystem) zugeordnet | 1 |

*Prüferkommentar: Ereignis und Funktion wechseln sich ab; nach einem Ereignis darf kein ODER/XOR-Split folgen. Informationsobjekte bringen hier ein Drittel der Punkte – ohne sie höchstens 9 von 13.*

**B4 (4 P):** *(je Argument 2 P mit Bezug auf B2)*, z. B.:
- **Methode:** Die doppelte Erfassung entfällt – der Kunde gibt seine Daten selbst in der App ein, das Abtippen und damit die **Tippfehler (Mensch)** fallen weg.
- **Milieu:** Der Antrag findet zu Hause oder in der Schlange statt, der Infopunkt ist nicht mehr der Engpass.
- **Maschine/Material:** Bei der digitalen Karte entfallen Kartendruck und Formular; die Plastikkarte wird gesammelt von einem Dienstleister gedruckt.

---

## Block C – Projekt ABHOLAPP (30 P)

**C1 (4 P):** *(je Maßnahme 2 P: Nennung + Wirkung)*, z. B.:
- **Frühe, offene Information** über Ziele und Zeitplan, damit Gerüchte keine Chance haben.
- **Beteiligung** der Mitarbeiter im Projektteam und des **Betriebsrats** – sie gestalten den neuen Ablauf mit.
- **Qualifizierung für neue Aufgaben** (Befüllen und Betreuen der Abholschränke, Kundenberatung).
- **Beschäftigungszusage** in einer Betriebsvereinbarung: keine betriebsbedingten Kündigungen wegen der Abholschränke.

**C2 (6 P):** *(je Zeile 2 P: Auswirkung 1 P, Ursache 1 P)*

| Risiko | Auswirkung | Ursache |
|---|---|---|
| Unterschätzung des Testaufwands | Fehler fallen erst im Betrieb auf, Termin verschiebt sich | keine Testplanung, zu wenig Testfälle für Sonderfälle (Vollmacht, Storno) |
| Schnittstelle zum Warenwirtschaftssystem nicht dokumentiert | Abholcodes passen nicht zu Aufträgen, Mehrkosten durch Nacharbeit | Altsystem ohne Dokumentation, kein Ansprechpartner beim Hersteller |
| Betriebsrat stimmt der Einführung nicht zu | Start verzögert sich oder fällt aus | Mitbestimmung (§ 87 BetrVG, technische Einrichtung zur Leistungskontrolle) zu spät beachtet |

**C3 (8 P):** *(je Vor- und Nachteil 2 P)*

Vorteile der Fremdvergabe:
- **Fachwissen und Erfahrung** des Softwarehauses mit ähnlichen Projekten – geringeres fachliches Risiko.
- **Entlastung der eigenen IT** und schnellerer Start, weil Kapazität zugekauft wird.
- **Kalkulierbare Kosten** bei Festpreis und Gewährleistung durch den Auftragnehmer.

Nachteile der Fremdvergabe:
- **Abhängigkeit** vom Softwarehaus bei Wartung und Änderungen.
- **Know-how bleibt außer Haus**; die eigene IT kennt den Code nicht.
- **Abstimmungsaufwand** (Lastenheft, Abnahme) und Datenschutz: Vertrag zur **Auftragsverarbeitung** nötig.

**C4 (4 P):** *(je Anforderung 1 P)*
- Funktional: Abholzeitfenster buchen · Abholcode (QR) anzeigen · Abholschrank per Code öffnen · Benachrichtigung bei Abholbereitschaft.
- Nichtfunktional: Antwortzeit unter zwei Sekunden · Bedienbarkeit ohne Schulung · Verfügbarkeit 99 % zu Öffnungszeiten · DSGVO-konforme Speicherung · läuft auf Android und iOS.

**C5 (4 P):** *(je Kostenart mit Beispiel 2 P)* **Personalkosten** (Stunden der IT-Abteilung, Projektleitung) · **Fremdleistungen** (Rechnung der Codewerk Nord GmbH) · **Sachkosten/Hardware** (Abholschränke, Tablets, Scanner) · **Schulungskosten** (Einweisung der Warenausgabe) · **Lizenzkosten** (App-Store-Konten, Server).

**C6 (4 P):** *(je Maßnahme 2 P)* Testkonzept mit Modul-, Integrations- und Abnahmetests · Code-Reviews · Pilotbetrieb an einem Samstag mit Feedback der Warenausgabe · Abnahme gegen das Lastenheft mit Kriterien · automatisierte Regressionstests vor jedem Update.

---

## Block D – Wirtschaftlichkeit der Abholschränke (20 P)

**D1 (2 P):** Die Break-even-Analyse ermittelt den **Punkt (Menge oder Zeitpunkt), ab dem Kosten und Nutzen gleich groß sind** – hier, nach wie vielen Jahren die eingesparten Personalkosten die Kosten der Abholschränke decken. Danach erwirtschaftet die Maßnahme einen Vorteil.

**D2 (5 P):** *(2 P Rechnung, 2 P Grafik mit beschrifteten Achsen und Geraden, 1 P Antwortsatz)*

Kumulierte Kosten: $K(t) = 9.000 \cdot t$ · kumulierte Einsparung: $E(t) = 15.000 \cdot (t - 1)$

$9.000 \cdot t = 15.000 \cdot (t - 1) \Rightarrow 6.000 \cdot t = 15.000 \Rightarrow t = \frac{15.000}{6.000}$ = **2,5 Jahre**

Kontrolle: Nach 2,5 Jahren stehen 22.500 € Kosten 22.500 € Einsparung gegenüber.

Grafik: x-Achse „Zeit in Jahren“ (0 bis 4), y-Achse „kumulierte Kosten/Einsparung in €“; Kostengerade durch (0 | 0) und (4 | 36.000), Einsparungsgerade durch (1 | 0) und (4 | 45.000); Schnittpunkt bei (2,5 | 22.500) markieren.

Antwortsatz: **Nach zweieinhalb Jahren** sind die kumulierten Einsparungen so hoch wie die kumulierten Kosten der Abholschränke; danach lohnt sich die Maßnahme.

*Prüferkommentar: Wer die Einsparung schon ab Jahr 1 rechnet, kommt auf einen Break-even von 0 Jahren – das ist offensichtlich unsinnig und kostet die Rechenpunkte.*

**D3 (13 P):** *(je richtig berechnete Position 1 P, Summen 2 P, Differenz 1 P, Empfehlung mit Begründung 2 P)*

| Position | Angebot A (€) | Angebot B (€) |
|---|---|---|
| Software-Grundpreis | 8.000 | 55.000 |
| Zusätzliche Lizenzen | 19.200 | 3.000 |
| Handscanner | 2.000 | 2.840 |
| Etikettendrucker | 900 | 0 |
| Updates | 8.400 | 0 |
| Support | 25.600 | 0 |
| Summe | 64.100 | 60.840 |

Rechenwege:
- A: Zusatzlizenzen $(8 - 4) \cdot 600 \cdot 8 = 19.200$ € · Scanner $8 \cdot 250 = 2.000$ € · Updates $7 \cdot 1.200 = 8.400$ € (ab Jahr 2) · Support $40 \cdot 8 \cdot 80 = 25.600$ €
- B: Zusatzlizenzen $(8 - 6) \cdot 1.500 = 3.000$ € · Hardwarepaket 2.400 € (enthält Drucker) plus $2 \cdot 220 = 440$ € für zwei weitere Scanner = 2.840 €

Differenzbetrag: $64.100 - 60.840$ = **3.260 €** zugunsten von Angebot B.

Empfehlung: **Angebot B** – es ist über acht Jahre 3.260 € günstiger, die Kosten sind planbar (Updates und Support inklusive), die Lizenzen gehören dem Möbelhaus. Nachteil: hohe Anfangsinvestition von 57.400 € im ersten Jahr.

*Prüferkommentar: Die häufigsten Fehler sind Updates für acht statt sieben Jahre und vergessene Inklusivlizenzen. Eine Empfehlung ohne Begründung bringt keinen Punkt.*
