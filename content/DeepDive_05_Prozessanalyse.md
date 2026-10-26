# Deep Dive 5: Prozessanalyse & Prozessmodellierung
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Dies ist der **Kern des Prüfungsbereichs „Durchführen einer Prozessanalyse" (90 Minuten, 10 % der Gesamtnote)**. Der Bereich ist inhaltlich klar abgegrenzt und damit gut planbar: Prozesse darstellen, Schwachstellen analysieren, Optimierungen vorschlagen, Wirtschaftlichkeit belegen, rechtliche Auswirkungen berücksichtigen.

Typische Aufgabenformate: ein beschriebener Prozess ist als **BPMN-Diagramm** zu modellieren, eine fehlerhafte **EPK** zu korrigieren, **Kennzahlen** zu berechnen und zu bewerten, Schwachstellen mit Methode zu identifizieren, eine Automatisierung wirtschaftlich zu **beurteilen**.

Für dich als DPA-Prüfling besonders wichtig: **Process Mining** verbindet diesen Bereich mit deiner Fachrichtung – es ist Prozessanalyse **aus Daten**. Damit kannst du im Fachgespräch punkten wie kein anderer Ausbildungsberuf.

Szenario: der Reparaturprozess der **Möbelhaus Nordholz GmbH** (bekannt aus Deep Dive 2).

---

# Teil 1 – Prozessgrundlagen

## 1.1 Was ist ein Geschäftsprozess?

Eine Folge logisch zusammenhängender Aktivitäten, die aus einem definierten **Auslöser (Input)** ein **Ergebnis (Output)** mit Kundennutzen erzeugt. Merkmale: definierter Start und Ende, Verantwortlicher (Prozesseigner), messbare Ziele, wiederholbarer Ablauf.

| Prozessart | Zweck | Beispiel |
|---|---|---|
| **Kernprozess** | schafft direkten Kundennutzen, wertschöpfend | Auftragsabwicklung, Reparaturservice |
| **Unterstützungsprozess** | ermöglicht Kernprozesse | IT-Betrieb, Personalwesen, Einkauf |
| **Führungsprozess** | steuert das Unternehmen | Strategie, Controlling, Qualitätsmanagement |

## 1.2 Vorgehen der Prozessanalyse

1. **Abgrenzung:** Start, Ende, Schnittstellen, beteiligte Rollen festlegen
2. **Ist-Aufnahme:** Daten erheben
3. **Ist-Modellierung:** Ablauf visualisieren (BPMN/EPK)
4. **Schwachstellenanalyse:** Ursachen systematisch ermitteln
5. **Soll-Konzeption:** optimierten Prozess entwerfen
6. **Wirtschaftlichkeitsbetrachtung:** Aufwand gegen Nutzen rechnen
7. **Umsetzung und Kontrolle:** Soll-Ist-Vergleich anhand von Kennzahlen

**Methoden der Ist-Aufnahme** (mindestens drei nennen können): Interview mit Prozessbeteiligten · Workshop · Beobachtung/Begleitung am Arbeitsplatz · Dokumentenanalyse · Fragebogen · **Auswertung von Systemdaten/Logfiles** (die datengetriebene Variante – deine Fachrichtung).

Vor- und Nachteile kennen: Interviews liefern Kontext und Erfahrungswissen, geben aber die **subjektive** Sicht wieder und beschreiben oft den Soll- statt den tatsächlichen Ist-Zustand. Systemdaten sind objektiv und vollständig, erklären aber nicht das **Warum** hinter den Abweichungen. Deshalb kombiniert man beides.

## 1.3 Prozessarten, Verantwortung und Daten – Ergänzungen

**Alltags- oder Geschäftsprozess?** Ein Geschäftsprozess hat ein **betriebliches** Ziel, beteiligt **mehrere Rollen, Abteilungen oder Systeme**, folgt **festgelegten Regeln**, ist **zuverlässig wiederholbar** und **messbar** (Zeit, Kosten, Qualität). Ein Alltagsprozess (Kaffee kochen) ist persönlich, spontan und nicht gemessen.

**Die drei Prozessarten – die Leitfrage entscheidet:**

| Prozessart | Leitfrage | Beispiele |
|---|---|---|
| **Kernprozess** | Welche Leistung erwartet der **Kunde** von genau dieser Organisation? | Auftrag bearbeiten und liefern, IT-Lösung bereitstellen, Reparatur durchführen |
| **Unterstützungsprozess** | Was braucht der Kernprozess, um zu funktionieren? | Personalwesen, interne IT, Buchhaltung, Einkauf, Facility Management |
| **Management-/Führungsprozess** | Wie wird die Organisation geplant, gesteuert, kontrolliert? | Strategieplanung, Controlling, Qualitätsmanagement, Risikomanagement, Budgetplanung |

⚠️ **Klausurfalle – die Einordnung hängt vom Zweck der Organisation ab:** Interner IT-Support eines Systemhauses = **Unterstützungsprozess**; derselbe Support als kostenpflichtige Leistung für externe Kunden = **Kernprozess**. Controlling bearbeitet keinen Kundenauftrag, sondern wertet Kennzahlen aus → **Managementprozess**. „Management-“ und „Führungsprozess“ meinen dasselbe.

**Managementprozesse nach Ebene:** **strategisch** (langfristig: Geschäftsfelder, Digitalisierungsstrategie), **taktisch** (mittelfristig: Budgets, Personalbedarf, Qualitätsziele), **operativ steuernd** (kurzfristig: KPIs überwachen, Kapazitäten anpassen).

| Auffällige Kennzahl | typische Reaktion des Managements |
|---|---|
| Durchlaufzeit zu hoch | Prozessanalyse und Optimierung |
| Fehlerquote zu hoch | Ursachen untersuchen, Maßnahmen festlegen |
| Kundenzufriedenheit sinkt | Servicequalität überprüfen |
| Kosten je Vorgang hoch | Automatisierung oder Einsparung prüfen |

**Warum reicht ein Organigramm nicht?** Es zeigt Struktur und Hierarchie (**Wer gehört wohin?**), aber nicht die Reihenfolge, in der Abteilungen an einem Auftrag arbeiten. Die Ablauforganisation fragt **Was? Wer? Wann? Womit?** (Tätigkeit, Person/Rolle, Reihenfolge, Informationen/Systeme). Ein Ablauf (z. B. Urlaubsantrag: Mitarbeiter → Vertretung → Führungskraft → HR → Team) folgt **nicht** der Hierarchie, sondern läuft quer durch die Organisation.

**Schnittstellen:** Übergabe von Verantwortung **und** Information zwischen Personen, Rollen, Abteilungen, Systemen oder Prozessschritten – nicht nur zwischen Abteilungen. Viele Schwachstellen entstehen **zwischen** Beteiligten. Die übergebenen Daten müssen **vollständig, richtig, aktuell und eindeutig** sein, sonst scheitert der nächste Schritt (fehlende Angaben → Entscheidung verzögert; nicht dokumentierte Genehmigung → falsch erfasst).

| Begriff | Bedeutung |
|---|---|
| **Abteilung / Organisationseinheit** | mehrere Stellen mit gemeinsamem Aufgabenbereich |
| **Stelle** | kleinste organisatorische Einheit, der **dauerhaft** Aufgaben und Verantwortung zugeordnet sind |
| **Rolle** | Funktion, die eine Person **in einem bestimmten Prozess** übernimmt |
| **Tätigkeit** | konkrete Handlung innerhalb eines Prozesses |

**Process Owner (Prozesseigner)** verantwortet Gestaltung, Leistungsfähigkeit und Weiterentwicklung des **gesamten End-to-End-Prozesses** – egal, wie viele Abteilungen beteiligt sind: gestalten, überwachen, Kennzahlen beobachten, Verbesserungen anstoßen. Er führt **nicht** alle Tätigkeiten selbst aus – Verantwortung ≠ Ausführung. Die **Fachbereiche** führen operativ durch, das **Prozess-/Qualitätsmanagement** dokumentiert, modelliert und misst.

**Rolle der Personalabteilung (HR):** HR verantwortet **nicht** automatisch Geschäftsprozesse. Sie bildet die benötigten Tätigkeiten in **Stellen**, Aufgaben- und Anforderungsprofilen ab und unterstützt Besetzung und Personalentwicklung.

| Stellenbeschreibung | Anforderungsprofil |
|---|---|
| beschreibt die **Stelle**: Aufgaben, Verantwortung, Einordnung, Befugnisse – *was die Stelle tun soll* | beschreibt die **Person**: Kenntnisse, Fähigkeiten, Qualifikationen – *was sie mitbringen muss* |

**Welche Daten ein Prozess benötigt und erzeugt:**

| Datenart | Kennzeichen | Beispiele |
|---|---|---|
| **Stammdaten** | über längere Zeit stabil, in vielen Vorgängen genutzt | Kunden-, Artikel-, Mitarbeiterdaten, Personalnummer |
| **Bewegungs-/Auftragsdaten** | gehören zu **einem** konkreten Geschäftsvorgang | Auftrag, Rechnung, Bestellung, Buchung, Stückzahl, Preis, Termin |
| **Prozessdaten** | entstehen **während des Ablaufs** und zeigen, wie er lief | Bearbeitungsstatus, Prüfergebnis, Zeitstempel, Freigabeentscheidung, Bearbeitungszeit, Fehler |

Aus Prozessdaten entstehen die Kennzahlen (Durchlaufzeit, Fehlerquote, Kosten). Bei einer Analyse zählt: **Welche Daten braucht eine Tätigkeit, welche erzeugt oder verändert sie?**

⚠️ **Typische Denkfehler:** „HR verantwortet alle Prozesse.“ (nein, personelle Unterstützung) · „Der Process Owner führt alles aus.“ (nein) · „Jede Information ist Stammdatum.“ (nein, vieles entsteht erst im Vorgang) · „Schnittstellen sind nur Abteilungsgrenzen.“ (nein, auch Rollen, Systeme, Prozessschritte).

## 1.4 Von der Beobachtung zur Ursache – so analysierst du sauber

Die häufigste Fehlerquelle in Analyseaufgaben: **Beobachtung, Symptom, Hypothese und Ursache werden vermischt.**

| Begriff | Bedeutung | Beispiel |
|---|---|---|
| **Beobachtung** | festgestellt und dokumentiert | Viele Vorgänge enthalten Rückfragen. |
| **Symptom** | sichtbare Auswirkung | Die Durchlaufzeit ist auffällig hoch. |
| **Hypothese** | begründete Vermutung, noch nicht geprüft | Beim Start fehlen Informationen. |
| **Ursache** | **bestätigter** Grund | Ein Pflichtfeld fehlt im Formular – nachweislich der Auslöser der Rückfragen. |

„Die Kunden warten lange“ ist ein **Symptom**. „Die Mitarbeitenden sind zu langsam“ ist eine **unbelegte Ursachenbehauptung** und in der Analyse unzulässig. Eine hohe Durchlaufzeit zeigt **was** passiert, nicht **warum**.

**Ist- und Soll-Prozess:** Der **Ist-Prozess** ist, wie der Prozess tatsächlich läuft (inklusive Wartezeiten, Umwegen, Rückfragen, Medienbrüchen, Workarounds). Der **Soll-Prozess** ist die Zielvorstellung oder verbindliche Vorgabe. **Der dokumentierte Prozess ist nicht automatisch der Ist-Prozess** (veraltete Vorgaben, unpassende Systeme, Workarounds).

**Erste Analyse in fünf Schritten:** Prozessgrenze klären (Auslöser, Ende, Beteiligte) → Modell lesen (Tätigkeiten, Entscheidungen, Übergaben, Externe) → Auffälligkeiten sammeln (Verzögerungen, Rückfragen, Fehler, Mehrfacherfassung, unklare Verantwortung) → **Fakten und Vermutungen trennen** → Analysefragen formulieren.

| Gute Analysefragen (neutral, konkret, prüfbar) | Schlechte Analysefragen (wertend, unterstellend) |
|---|---|
| „Wo entsteht der größte Anteil der Wartezeit?“ | „Warum arbeitet Team B so langsam?“ |
| „Welche Informationen fehlen besonders häufig?“ | „Warum ist das System schlecht?“ |
| „Wie oft wird ein Vorgang zurückgegeben?“ | „Warum machen Kunden ständig Fehler?“ |

**Welche Quelle zeigt was?**

| Frage | Quelle |
|---|---|
| Wie häufig tritt ein Statuswechsel auf? Wo liegen Zeiten? | Systemdaten, Logs |
| Welche Regel ist offiziell vorgesehen? | Prozessmodell, Arbeitsanweisung, Dokumentation |
| Wie wird der Schritt **tatsächlich** ausgeführt? | Beobachtung |
| **Warum** wird ein Workaround genutzt? Welche Probleme erleben die Mitarbeitenden? | Prozessbeteiligte, Interview |
| Wie gut werden Ziele erreicht? | Qualitäts- und SLA-Berichte |
| Was stört die Kunden? | Beschwerden |

**Bekannt, Annahme, Informationslücke:** *Bekannt* = durch Daten, Dokumente oder Beobachtung belegt. *Annahme* = plausibel, aber nicht geprüft. *Informationslücke* = fehlende, aber relevante Information. Eine gute Analyse **macht Lücken sichtbar, statt sie mit Vermutungen zu füllen** – „Das wissen wir noch nicht, dafür brauchen wir …“ ist ein richtiges Ergebnis. Vor einer Umsetzung fragst du: Was ist belegt? Was beruht auf Annahmen? Welche Information fehlt, und wer kann sie liefern?

---

# Teil 2 – BPMN 2.0

BPMN (Business Process Model and Notation) ist der internationale Standard und in Prüfungen die häufigste Notation.

## 2.1 Die Elemente

**Ereignisse (Kreise)** – etwas passiert:
- **Startereignis:** dünner Rand, ein eingehender Auslöser, kein eingehender Sequenzfluss
- **Zwischenereignis:** doppelter Rand (z. B. Timer für Wartezeiten, Nachrichtenempfang)
- **Endereignis:** dicker Rand
- Symbole im Kreis kennzeichnen den Typ: Umschlag = Nachricht, Uhr = Timer, Blitz = Fehler

**Aktivitäten (abgerundetes Rechteck)** – etwas wird getan:
- **Task:** einzelne Aufgabe („Auftrag erfassen") – immer mit **Verb + Objekt** benennen
- **Teilprozess:** mit „+"-Zeichen, kann aufgeklappt werden
- Marker: Personensymbol = **User Task** (Mensch arbeitet mit Softwareunterstützung), Hand = **Manual Task** (ganz ohne IT), Zahnrad = **Service Task** (automatisiert, z. B. Webservice-Aufruf), Umschlag = Send/Receive Task (gefüllt = senden, leer = empfangen)

**Gateways (Rauten)** – der Ablauf verzweigt oder führt zusammen:

| Gateway | Symbol | Bedeutung |
|---|---|---|
| **XOR** (exklusiv) | X | **genau einer** der Pfade wird durchlaufen – Entscheidung |
| **AND** (parallel) | + | **alle** Pfade werden gleichzeitig durchlaufen |
| **OR** (inklusiv) | O | **einer oder mehrere** Pfade |

**Regeln, die Punkte kosten, wenn sie fehlen:**
- Ein Gateway **entscheidet nichts** – es verzweigt nur. Die Entscheidungsgrundlage entsteht in der Aktivität davor („Kostenvoranschlag prüfen") und steht als Beschriftung an den ausgehenden Pfaden („angenommen" / „abgelehnt").
- Was ein Gateway aufspaltet, sollte ein **gleichartiges** Gateway wieder zusammenführen.
- Beim XOR-Gateway müssen die Bedingungen **vollständig und überschneidungsfrei** sein – jeder Fall genau einmal abgedeckt.

Eine leere Raute ohne Symbol bedeutet ebenfalls XOR; einheitlich mit „X" zu zeichnen ist aber klarer. Ein Pfeil mit Querstrich am Gateway-Ausgang ist der **Standardfluss** (Default): Er wird genommen, wenn keine andere Bedingung zutrifft.

**Token-Semantik – so „liest" man ein BPMN-Modell:** Man denkt sich eine Marke (**Token**), die vom Startereignis aus den Sequenzflüssen folgt.

| Gateway | Aufspalten (Split) | Zusammenführen (Join) |
|---|---|---|
| XOR | Token läuft in genau einen Pfad | jedes ankommende Token wird sofort durchgelassen – keine Synchronisation |
| AND | Token wird für jeden Pfad kopiert | wartet, bis von **allen** Eingängen ein Token da ist, dann geht genau eines weiter |
| OR | Token für jeden Pfad, dessen Bedingung zutrifft | wartet auf alle **tatsächlich aktivierten** Pfade |

⚠️ **Typische Prüfungsfalle:** XOR-Split mit AND-Join → **Deadlock**, weil das AND auf einen Pfad wartet, der nie ein Token bekommt. AND-Split mit XOR-Join → der Folgeschritt wird **mehrfach** ausgeführt (z. B. zwei Rechnungen).

Das **ereignisbasierte Gateway** (Raute mit Fünfeck im Doppelkreis) wartet auf das **zuerst eintretende** Ereignis – z. B. Kundenantwort (Nachricht) oder Ablauf von 48 Stunden (Timer). Nicht die Daten entscheiden, sondern was zuerst passiert.

**Pools und Lanes:**
- **Pool** = eigenständiger Teilnehmer/Organisation (Kunde, Lieferant, Möbelhaus)
- **Lane** = Rolle oder Abteilung **innerhalb** eines Pools (Serviceannahme, Werkstatt, Buchhaltung)

**Verbindungen:**
- **Sequenzfluss** (durchgezogener Pfeil): Ablaufreihenfolge – **nur innerhalb eines Pools**
- **Nachrichtenfluss** (gestrichelter Pfeil): Kommunikation **zwischen** Pools
- **Datenobjekt** (Blattsymbol) und **Anmerkung**: Artefakte ohne Ablaufwirkung

⚠️ **Der Standardfehler:** ein durchgezogener Sequenzfluss zwischen zwei Pools. Zwischen Pools fließen **nur Nachrichten** – ein anderes Unternehmen hat keinen gemeinsamen Ablauf mit dir. Umgekehrt gilt: Zwischen **Lanes desselben Pools** steht ein normaler Sequenzfluss, kein Nachrichtenfluss.

## 2.2 Beispiel – Reparaturprozess Möbelhaus Nordholz

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 930 460" width="930" height="460" role="img" aria-label="BPMN-Kollaborationsdiagramm Reparaturprozess Möbelhaus Nordholz: Pool Kunde und Pool Möbelhaus mit den Lanes Serviceannahme, Werkstatt und Buchhaltung, XOR-Gateway nach der Kundenantwort, AND-Gateway für Ersatzteilbestellung und Technikereinplanung, Nachrichtenflüsse zum Kunden">
<defs><marker id="dd5-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker><marker id="dd5-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10" class="dg-linie"/></marker><marker id="dd5-kreis" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><circle cx="5" cy="5" r="4" class="dg-form"/></marker></defs>
<rect x="10" y="10" width="910" height="46" class="dg-grau"/>
<text x="465" y="33" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Kunde</text>
<rect x="10" y="100" width="910" height="350" class="dg-form"/>
<line x1="34" y1="100" x2="34" y2="450" class="dg-linie"/>
<line x1="58" y1="100" x2="58" y2="450" class="dg-linie"/>
<line x1="34" y1="210" x2="920" y2="210" class="dg-linie"/>
<line x1="34" y1="350" x2="920" y2="350" class="dg-linie"/>
<text x="22" y="275" text-anchor="middle" dominant-baseline="middle" class="dg-fett" transform="rotate(-90 22 275)">Möbelhaus Nordholz</text>
<text x="46" y="155" text-anchor="middle" dominant-baseline="middle" class="dg-klein" transform="rotate(-90 46 155)">Serviceannahme</text>
<text x="46" y="280" text-anchor="middle" dominant-baseline="middle" class="dg-klein" transform="rotate(-90 46 280)">Werkstatt</text>
<text x="46" y="400" text-anchor="middle" dominant-baseline="middle" class="dg-klein" transform="rotate(-90 46 400)">Buchhaltung</text>
<circle cx="96" cy="155" r="14" class="dg-form"/>
<rect x="88" y="150" width="16" height="11" class="dg-form dg-duenn"/>
<path d="M88,150 L96,156 L104,150" class="dg-linie dg-duenn"/>
<text x="96" y="184" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Meldung</text>
<text x="96" y="197" text-anchor="middle" dominant-baseline="middle" class="dg-klein">erhalten</text>
<line x1="110" y1="155" x2="125" y2="155" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<rect x="125" y="130" width="90" height="50" rx="10" class="dg-form"/>
<text x="170" y="147.5" text-anchor="middle" dominant-baseline="middle">Auftrag</text>
<text x="170" y="162.5" text-anchor="middle" dominant-baseline="middle">erfassen</text>
<line x1="215" y1="155" x2="235" y2="155" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<rect x="235" y="130" width="125" height="50" rx="10" class="dg-form"/>
<text x="297.5" y="147.5" text-anchor="middle" dominant-baseline="middle">Kostenvoranschlag</text>
<text x="297.5" y="162.5" text-anchor="middle" dominant-baseline="middle">erstellen</text>
<line x1="360" y1="155" x2="383" y2="155" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<circle cx="397" cy="155" r="14" class="dg-form"/>
<circle cx="397" cy="155" r="11" class="dg-form"/>
<rect x="390" y="150" width="14" height="10" class="dg-form dg-duenn"/>
<path d="M390,150 L397,155.5 L404,150" class="dg-linie dg-duenn"/>
<text x="397" y="184" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Antwort</text>
<text x="397" y="197" text-anchor="middle" dominant-baseline="middle" class="dg-klein">erhalten</text>
<line x1="411" y1="155" x2="432" y2="155" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<polygon points="454,133 476,155 454,177 432,155" class="dg-form"/>
<line x1="446" y1="147" x2="462" y2="163" class="dg-linie"/>
<line x1="462" y1="147" x2="446" y2="163" class="dg-linie"/>
<text x="454" y="121" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Annahme?</text>
<line x1="476" y1="155" x2="540" y2="155" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<text x="508" y="145" text-anchor="middle" dominant-baseline="middle" class="dg-klein">abgelehnt</text>
<rect x="540" y="130" width="100" height="50" rx="10" class="dg-form"/>
<text x="590" y="147.5" text-anchor="middle" dominant-baseline="middle">Absage</text>
<text x="590" y="162.5" text-anchor="middle" dominant-baseline="middle">senden</text>
<line x1="640" y1="155" x2="665" y2="155" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<circle cx="679" cy="155" r="14" class="dg-form dg-dick"/>
<text x="679" y="184" text-anchor="middle" dominant-baseline="middle" class="dg-klein">abgelehnt</text>
<path d="M454,177 L454,280 L478,280" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<text x="461" y="194" text-anchor="start" dominant-baseline="middle" class="dg-klein">angenommen</text>
<polygon points="500,258 522,280 500,302 478,280" class="dg-form"/>
<line x1="492" y1="280" x2="508" y2="280" class="dg-linie dg-dick"/>
<line x1="500" y1="272" x2="500" y2="288" class="dg-linie dg-dick"/>
<path d="M500,258 L500,240 L535,240" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<path d="M500,302 L500,320 L535,320" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<rect x="535" y="220" width="120" height="40" rx="10" class="dg-form"/>
<text x="595" y="233" text-anchor="middle" dominant-baseline="middle">Ersatzteil</text>
<text x="595" y="248" text-anchor="middle" dominant-baseline="middle">bestellen</text>
<rect x="535" y="300" width="120" height="40" rx="10" class="dg-form"/>
<text x="595" y="313" text-anchor="middle" dominant-baseline="middle">Techniker</text>
<text x="595" y="328" text-anchor="middle" dominant-baseline="middle">einplanen</text>
<path d="M655,240 L700,240 L700,258" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<path d="M655,320 L700,320 L700,302" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<polygon points="700,258 722,280 700,302 678,280" class="dg-form"/>
<line x1="692" y1="280" x2="708" y2="280" class="dg-linie dg-dick"/>
<line x1="700" y1="272" x2="700" y2="288" class="dg-linie dg-dick"/>
<line x1="722" y1="280" x2="745" y2="280" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<rect x="745" y="255" width="105" height="50" rx="10" class="dg-form"/>
<text x="797.5" y="272.5" text-anchor="middle" dominant-baseline="middle">Reparatur</text>
<text x="797.5" y="287.5" text-anchor="middle" dominant-baseline="middle">durchführen</text>
<line x1="797.5" y1="305" x2="797.5" y2="375" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<rect x="745" y="375" width="105" height="50" rx="10" class="dg-form"/>
<text x="797.5" y="392.5" text-anchor="middle" dominant-baseline="middle">Rechnung</text>
<text x="797.5" y="407.5" text-anchor="middle" dominant-baseline="middle">stellen</text>
<line x1="850" y1="400" x2="870" y2="400" class="dg-linie" marker-end="url(#dd5-pfeil)"/>
<circle cx="884" cy="400" r="14" class="dg-form dg-dick"/>
<rect x="876" y="395" width="16" height="11" class="dg-voll"/>
<polygon points="877.5,396 890.5,396 884,401" class="dg-flaeche"/>
<text x="884" y="429" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Rechnung</text>
<text x="884" y="441" text-anchor="middle" dominant-baseline="middle" class="dg-klein">versandt</text>
<line x1="96" y1="56" x2="96" y2="141" class="dg-linie dg-strich" marker-start="url(#dd5-kreis)" marker-end="url(#dd5-offen)"/>
<text x="103" y="72" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-kursiv">Reparaturmeldung</text>
<line x1="297.5" y1="130" x2="297.5" y2="56" class="dg-linie dg-strich" marker-start="url(#dd5-kreis)" marker-end="url(#dd5-offen)"/>
<text x="290" y="90" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-kursiv">Kostenvoranschlag</text>
<line x1="397" y1="56" x2="397" y2="141" class="dg-linie dg-strich" marker-start="url(#dd5-kreis)" marker-end="url(#dd5-offen)"/>
<text x="404" y="78" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-kursiv">Annahme oder Ablehnung</text>
<line x1="590" y1="130" x2="590" y2="56" class="dg-linie dg-strich" marker-start="url(#dd5-kreis)" marker-end="url(#dd5-offen)"/>
<text x="597" y="90" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-kursiv">Absage</text>
<line x1="884" y1="386" x2="884" y2="56" class="dg-linie dg-strich" marker-start="url(#dd5-kreis)" marker-end="url(#dd5-offen)"/>
<text x="877" y="78" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-kursiv">Rechnung</text>
</svg>
```

Zu erkennen:
- Ein **Nachrichten-Startereignis** (Umschlag im dünnen Kreis): Die Meldung des Kunden löst den Prozess aus.
- Ein **Nachrichten-Zwischenereignis** (doppelter Rand): Hier wartet der Prozess auf die Antwort des Kunden zum Kostenvoranschlag.
- Ein **XOR** mit beschrifteten Pfaden: Es wird genau einer durchlaufen.
- Ein **AND**, das Ersatzteilbestellung und Technikereinplanung parallel startet, und ein zweites **AND**, das wartet, bis beides erledigt ist.
- **Drei Lanes** für die beteiligten Rollen. Zwischen ihnen läuft ein normaler Sequenzfluss.
- Ein separater, zugeklappter **Pool für den Kunden**. Er ist nur über **gestrichelte Nachrichtenflüsse** angebunden (Kreis am Anfang, offene Pfeilspitze).

Zwei Wege, eine Nachricht zu senden – beide sind korrekt: Die Absage verschickt der Sende-Task „Absage senden“, danach folgt ein einfaches Endereignis. Die Rechnung verschickt das **Nachrichten-Endereignis** (gefüllter Umschlag im dicken Kreis) direkt beim Abschluss.

Üben: [Diagramm-Übungen BPMN](#/diagramme?typ=bpmn) – Elemente einsetzen und Abläufe ordnen.

## 2.3 EPK – die Alternative

Die **ereignisgesteuerte Prozesskette** stammt aus dem ARIS-Umfeld und ist in Prüfungen ebenfalls verbreitet.

- **Ereignis** (Sechseck): passiver Zustand, z. B. „Auftrag ist erfasst"
- **Funktion** (abgerundetes Rechteck): aktive Tätigkeit, z. B. „Auftrag erfassen"
- **Konnektoren:** XOR, OR, AND

**Die drei EPK-Regeln, die in Prüfungen abgefragt werden:**
1. **Ereignis und Funktion wechseln sich streng ab.** Nie zwei Funktionen oder zwei Ereignisse direkt hintereinander.
2. Eine EPK **beginnt und endet mit einem Ereignis**.
3. **Nach einem einzelnen Ereignis darf keine XOR- oder OR-Verzweigung folgen** – Ereignisse sind passive Zustände und können keine Entscheidung treffen. Entscheidungen gehen immer von einer **Funktion** aus.

Was **nach einem Ereignis** erlaubt ist: eine AND-Verzweigung (der Zustand löst mehrere Funktionen gleichzeitig aus) sowie das **Zusammenführen** von Ereignissen mit jedem Konnektor. Nach einer Funktion sind AND-, OR- und XOR-Verzweigungen erlaubt. Weitere Formregeln: Ereignisse und Funktionen haben jeweils höchstens eine eingehende und eine ausgehende Kante – verzweigt wird nur über Konnektoren; ein Konnektor spaltet entweder auf oder führt zusammen, nicht beides. Symbole der Konnektoren: Kreis mit „XOR", ∨ (OR), ∧ (AND).

**Erweiterte EPK (eEPK):** ergänzt die Ablauflogik um das *Wer* und *Womit*:

| Objekt | Symbol | Beispiel |
|---|---|---|
| **Organisationseinheit** | Ellipse (in ARIS mit senkrechtem Strich am linken Rand), mit der Funktion verbunden | Serviceannahme, Werkstatt |
| **Informationsobjekt** | Rechteck | Auftragsdaten, Kostenvoranschlag |
| **Anwendungssystem** | Rechteck mit seitlichen Doppellinien | ERP-System, Werkstatt-App |
| **Prozesswegweiser** | Funktionssymbol vor einem Sechseck | Sprung in die EPK „Rechnungsstellung" |

Zusatzobjekte hängen immer an einer **Funktion**, nie an einem Ereignis.

| | BPMN 2.0 | EPK |
|---|---|---|
| Verbreitung | internationaler Standard | vor allem im deutschsprachigen Raum |
| Organisationen darstellen | Pools/Lanes, mehrere Beteiligte | nur über Zusatzobjekte |
| Ausführbarkeit | technisch ausführbar (Workflow-Engines) | rein beschreibend |
| Lesbarkeit für Fachbereiche | mittel (viele Symbole) | hoch (einfaches Grundprinzip) |

Üben: [Diagramm-Übungen EPK und eEPK](#/diagramme?typ=epk) – Elemente einsetzen und Abläufe ordnen.

## 2.4 BPMN-Ergänzungen: Ereignisse, Task-Arten und Fehlerbilder

**Fangend oder werfend?** Prüffrage: *Wartet der Prozess auf etwas?* → **catching** (fangend: Nachricht empfangen, Timer). *Löst er aktiv etwas aus?* → **throwing** (werfend: Nachricht senden). Timer sind typischerweise fangend. Ein Startereignis ist immer fangend (kein eingehender Fluss), ein Endereignis immer werfend (kein ausgehender Fluss).

| Position | Typen (Einstieg) | Regel |
|---|---|---|
| **Start** | None, Message, Timer | kein eingehender Sequenzfluss |
| **Intermediate** | Message (fangend/werfend), Timer | im Ablauf **oder** als Boundary Event am Rand einer Aktivität |
| **End** | None, Message, Error, Terminate | kein ausgehender Sequenzfluss |

**Intermediate-Timer oder Boundary-Timer?** Intermediate = der Prozess **wartet bewusst** eine Zeit, nichts anderes läuft („14 Tage warten“). Boundary = **Zeitüberwachung während** eine Aktivität läuft („Bearbeitung dauert länger als 4 Stunden → eskalieren“).

**Boundary Events:** immer direkt an einer Aktivität (Task oder Teilprozess) angeheftet, haben genau einen eigenen Ausnahmepfad.

| | Interrupting | Non-interrupting |
|---|---|---|
| Rand | durchgezogener Doppelring | **gestrichelter** Doppelring |
| Wirkung | Task wird **abgebrochen**, der Boundary-Pfad übernimmt | Task **läuft weiter**, zusätzlich startet ein paralleler Pfad |
| Typisch | stornieren, eskalieren statt weiterwarten | Teamleitung informieren, Erinnerung senden |

⚠️ Das **Error-Boundary-Event** ist **immer unterbrechend** – eine nicht unterbrechende Variante gibt es nicht. Welche Ereignisarten an der Grenze möglich sind, hängt vom Typ ab (Timer, Nachricht, Fehler …).

**Error-Endereignis oder Terminate-Endereignis?**

| Error End Event | Terminate End Event |
|---|---|
| signalisiert einen **Fehler**, der an passender Stelle **gefangen und behandelt** werden kann (Error Boundary); beendet den Scope und wirft den Fehler | beendet den Scope **sofort und hart – inklusive noch laufender paralleler Aktivitäten**; kein Fehlerpfad |

**Task-Arten (Typisieren nur, wenn dadurch Information entsteht):**

| Task | Bedeutung | Beispiel |
|---|---|---|
| Task (allgemein) | Ausführungsart unwichtig | – |
| **User Task** | Mensch arbeitet **mit IT-System** | Daten in der Fachanwendung prüfen |
| **Manual Task** | Mensch **ohne** System | Gerät physisch etikettieren |
| **Service Task** | System/Dienst **automatisiert** | PDF automatisch erzeugen |
| **Send Task** | Nachricht senden, **wartet nicht** auf Antwort | Bestätigung automatisch versenden |
| **Receive Task** | **wartet** auf Nachricht, läuft erst nach Eingang weiter | auf Freigabenachricht warten |
| **Business Rule Task** | Geschäftsregel wird ausgewertet | Rabattregel auswerten |
| Subprozess / Call Activity | Ablauf in Hierarchie / wiederverwendbarer Ablauf | – |

**Black Box oder White Box?** **White Box:** Pool vollständig ausmodelliert. **Black Box:** interne Schritte nicht sichtbar – sinnvoll bei **externen Partnern** (Kunde, Lieferant), deren Abläufe man nicht kennt; es zählt nur die Schnittstelle (ein- und ausgehende Nachrichten).

**Prüffrage für Flüsse:** Bleibe ich beim **selben Prozessbeteiligten**? → Sequenzfluss (auch über **Lane**-Grenzen). Wechsle ich zu einem **anderen**? → Nachrichtenfluss. Eine Abteilung ist nicht automatisch eine Lane und niemals grundsätzlich ein Pool – entscheidend ist der Modellkontext.

**XOR-Gateway oder ereignisbasiertes Gateway?** XOR fragt „**Welche Bedingung ist wahr?**“, ereignisbasiert fragt „**Welches Ereignis tritt zuerst ein?**“. Die ausgehenden Pfade des ereignisbasierten Gateways beginnen mit **fangenden** Ereignissen oder Receive Tasks („Antwort trifft ein“ gegen „48 Stunden vergehen“ → eskalieren).

**EPK oder BPMN?** BPMN ist nicht automatisch besser. EPK: kleiner Symbolvorrat, gut für einfache fachliche Modelle und schnelle Lesbarkeit; Ereignisse stehen zwischen jeder Funktion. BPMN: mehr Symbole, dafür präziser (Tasks nach Ausführungsart, Pools/Lanes direkt im Modell, Nachrichtenfluss geregelt, Tasks dürfen direkt aufeinander folgen) – Gefahr: überladene Modelle. **So einfach wie möglich, so detailliert wie nötig.**

**Weitere Modellierungsregeln:** Task = **Verb + Objekt**. Gateways nur bei echter Logik. Split und Join bewusst unterscheiden. Gateway-Typ nach **Semantik**, nicht nach Symbol wählen. Ein Sequenzfluss überschreitet **nie** eine Poolgrenze.

Üben: [Diagramm-Übungen BPMN](#/diagramme?typ=bpmn) – darunter Aufgaben mit Timer-, Nachrichten- und Fehler-Grenzereignissen.

---

# Teil 3 – Prozesskennzahlen

Ohne Kennzahlen keine belegbare Optimierung – und ohne Soll-Ist-Vergleich kein Nachweis des Projekterfolgs.

## 3.1 Zeitkennzahlen

**Durchlaufzeit (DLZ):** $\text{DLZ} = \text{Bearbeitungszeit} + \text{Liegezeit} + \text{Transportzeit} + \text{Rüstzeit}$
Gesamtzeit vom Prozessstart bis zum Prozessende.

**Bearbeitungszeit** = Zeit echter Wertschöpfung
**Liegezeit** = Warten auf den nächsten Bearbeitungsschritt

**Die wichtigste Kennzahl der Prozessoptimierung:**

Wertschöpfungsanteil (Flussgrad) $= \frac{\text{Bearbeitungszeit}}{\text{Durchlaufzeit}} \cdot 100$

In der Praxis liegt dieser Anteil oft unter 10 %. Das bedeutet: **Der Hebel liegt fast immer bei den Liegezeiten, nicht bei der Beschleunigung der Bearbeitung.** Wer in einer Klausur vorschlägt, „die Techniker sollen schneller arbeiten", hat die Aufgabe nicht verstanden.

⚠️ Der Begriff *Flussgrad* wird nicht einheitlich verwendet: In der Produktionslogistik ist er oft umgekehrt definiert (Durchlaufzeit / Bearbeitungszeit, Wert ≥ 1 – je größer, desto schlechter). Nutze in der Prüfung die angegebene Formel und benenne sie als **Wertschöpfungsanteil**.

Beispiel Möbelhaus: Bearbeitungszeit 1,5 h, Liegezeit 28,5 h → DLZ = 30 h → Wertschöpfungsanteil $= \frac{1{,}5}{30}$ = **5 %**. In 95 % der Zeit passiert mit dem Auftrag nichts.

## 3.2 Qualitäts- und Kostenkennzahlen

| Kennzahl | Formel | Aussage |
|---|---|---|
| **Fehlerquote** | fehlerhafte Fälle / Gesamtfälle · 100 | Qualitätsniveau |
| **First Pass Yield (FPY)** | fehlerfrei im ersten Durchlauf / Gesamt · 100 | Anteil ohne Nacharbeit |
| **Termintreue** | pünktliche Fälle / Gesamtfälle · 100 | Zuverlässigkeit |
| **Prozesskosten je Fall** | Bearbeitungszeit · Kostensatz (+ Sachkosten) | Wirtschaftlichkeit |
| **Nacharbeitskosten** | Nacharbeitszeit · Kostensatz · Fehlerzahl | Kosten schlechter Qualität |
| **Auslastung** | genutzte Kapazität / verfügbare Kapazität · 100 | Ressourceneinsatz |

## 3.3 Wirtschaftlichkeit einer Optimierung

**Amortisationszeit:** $\text{Amortisationszeit} = \dfrac{\text{Investition}}{\text{jährliche Einsparung}}$

Rechenschema, das du auswendig können solltest:
1. Zeitersparnis je Fall × Fallzahl pro Jahr = eingesparte Stunden
2. Eingesparte Stunden × Kostensatz = jährliche Einsparung
3. Investition / jährliche Einsparung = Amortisationszeit
4. Beurteilung: Amortisationszeit mit der geplanten Nutzungsdauer vergleichen – **und qualitative Faktoren ergänzen** (Fehlerreduktion, Mitarbeiterzufriedenheit, Skalierbarkeit, Abhängigkeit vom Anbieter).

Punkt 4 wird am häufigsten vergessen und ist regelmäßig eigenständig bepunktet.

## 3.4 Kennzahlen richtig deuten

Kennzahlen beantworten **„Was passiert?“** – nicht automatisch **„Warum?“**.

| Kennzahl | Formel | Bemerkung |
|---|---|---|
| **Durchlaufzeit** | Bearbeitungszeit + Warte-/Liegezeit | Gesamtzeit von definiertem Start bis Ende |
| **Fehlerquote** | fehlerhafte Vorgänge ÷ alle Vorgänge × 100 | |
| **SLA-Einhaltung / Termintreue** | fristgerechte Vorgänge ÷ alle Vorgänge × 100 | |
| **First-Time-Right** (= First Pass Yield) | beim 1. Durchlauf korrekt ÷ alle Vorgänge × 100 | Anteil **ohne** Nacharbeit |
| **Nacharbeitsquote** | nachzubearbeitende Vorgänge ÷ alle Vorgänge × 100 | |
| **Rückfragequote** | Vorgänge mit Rückfrage ÷ alle Vorgänge × 100 | zeigt unvollständige Informationen |
| **Wiedereröffnungsquote** | wiedereröffnete Vorgänge ÷ alle Vorgänge × 100 | zeigt unzureichende Lösungen |

**Rechenbeispiel:** 200 Vorgänge, 150 fristgerecht, 30 nachbearbeitet → SLA-Einhaltung 150 ÷ 200 = **75 %**; Nacharbeitsquote 30 ÷ 200 = **15 %**; First-Time-Right = 100 % − 15 % = **85 %**.

**Vor der Interpretation prüfen:** Was genau wird gemessen (Definition)? Welche **Prozessgrenze**? Welcher **Zeitraum**? Gibt es einen **Sollwert** (SLA, Ziel)? Gibt es einen **Vergleich** (Zeitreihe, Team, vorher/nachher)?

⚠️ **Durchschnittswerte täuschen:** Sehr gute und sehr schlechte Einzelfälle gleichen sich aus. Beispiel: 90 % SLA-Einhaltung insgesamt wirkt gut – aber wenn die **hohen Prioritäten (P1/P2)** die SLA deutlich öfter reißen als P3/P4, ist das eigentliche Problem versteckt. Deshalb nach **Kategorie, Priorität, Team** aufschlüsseln.

**Welche Frage → welche Kennzahl?** Ist es schnell genug? → Durchlaufzeit. Wie viel wird tatsächlich gearbeitet? → Bearbeitungszeit. Werden Zusagen eingehalten? → SLA. Wird korrigiert? → Nacharbeitsquote, First-Time-Right. Fehlen Informationen? → Rückfragequote.

**Hohe Durchlaufzeit** entsteht häufig durch **Wartezeit**, nicht durch lange Bearbeitung. Als Kennzahl ist sie ein **Symptom**, keine Ursache.

---

# Teil 4 – Schwachstellenanalyse und Optimierung

## 4.1 Methoden

- **Ishikawa-Diagramm (Ursache-Wirkungs-Diagramm, „Fischgräte"):** systematische Ursachensuche entlang der **6M** – Mensch, Maschine, Material, Methode, Milieu (Umgebung), Messung.
- **5-Why-Methode:** fünfmal „Warum?" fragen, um von Symptom zur Grundursache zu gelangen.
- **Pareto-Analyse:** Ursachen nach Häufigkeit sortieren; wenige Ursachen erklären den Großteil der Fälle (→ Deep Dive 3).
- **Wertstromanalyse:** Bearbeitungs- und Liegezeiten je Schritt visualisieren, um Verschwendung sichtbar zu machen. Lean-Methode (Value Stream Mapping): Material- und Informationsfluss werden vom Kunden rückwärts aufgenommen, unten im Diagramm läuft eine **Zeitlinie** mit Bearbeitungs- und Liegezeiten – daraus ergibt sich direkt der Wertschöpfungsanteil. Auf den Ist-Wertstrom folgt das **Wertstromdesign** (Soll).
- **SIPOC:** Prozessabgrenzung auf einer Seite – **S**upplier (Lieferant), **I**nput, **P**rocess (4–7 Hauptschritte), **O**utput, **C**ustomer. Typisch für die Define-Phase von Six Sigma und für Schritt 1 der Prozessanalyse (Start, Ende, Schnittstellen). Beispiel Reparaturservice: Kunde/Ersatzteillieferant → Reparaturmeldung, Ersatzteil → erfassen, Kostenvoranschlag, reparieren, abrechnen → reparierte Ware, Rechnung → Kunde.

## 4.2 Typische Schwachstellen und ihre Gegenmaßnahmen

| Schwachstelle | Maßnahme |
|---|---|
| Lange Liegezeiten zwischen Abteilungen | Schnittstellen reduzieren, Zuständigkeit bündeln, Termin-Trigger einführen |
| Medienbrüche (Papier → System → Excel) | durchgängige Digitalisierung, Systemintegration/Schnittstellen |
| Mehrfacherfassung derselben Daten | einmalige Erfassung, automatische Übernahme |
| Sequenzielle Schritte ohne Abhängigkeit | **Parallelisierung** (AND-Gateway statt Reihenfolge) |
| Unnötige Genehmigungsschleifen | Wertgrenzen einführen, Entscheidungsbefugnis delegieren |
| Rückfragen wegen unvollständiger Daten | Pflichtfelder, Validierungsregeln, Plausibilitätsprüfung bei der Eingabe |
| Hohe Nacharbeitsquote | Fehlerursache beheben statt nachbessern, Vier-Augen-Prinzip an kritischer Stelle |

**Die vier Grundstrategien (ESUA-Merkhilfe):** **E**liminieren (Schritt entfällt) → **S**tandardisieren → **U**mstellen/Parallelisieren → **A**utomatisieren. In dieser Reihenfolge prüfen: Einen überflüssigen Schritt zu automatisieren, ist die teuerste Lösung.

**KVP und PDCA:** Plan (Maßnahme planen) → Do (umsetzen, ggf. im Pilotbereich) → Check (Wirkung anhand von Kennzahlen prüfen) → Act (standardisieren oder nachsteuern). Optimierung ist ein Kreislauf, kein einmaliges Projekt.

## 4.3 Methoden der Schwachstellenanalyse richtig einsetzen

**Pareto-Analyse** – priorisieren, nicht erklären:
1. Problemkategorien festlegen (eindeutig, überschneidungsarm) → 2. Häufigkeiten erfassen → 3. **absteigend sortieren** → 4. Anteil = Häufigkeit ÷ Gesamt × 100 → 5. **kumulierte** Anteile bilden → Diagramm: Balken = Häufigkeit, Linie = kumulierter Anteil.

| Problemfeld | Fälle | Anteil | kumuliert |
|---|---|---|---|
| fehlende/unvollständige Ticketinformationen | 35 | 35 % | 35 % |
| lange Wartezeit auf Übernahme durch Second Level | 24 | 24 % | 59 % |
| doppelte/mehrfache Datenerfassung | 16 | 16 % | 75 % |
| unklare oder falsche Priorisierung | 11 | 11 % | 86 % |
| Warten auf Rückmeldung des Kunden | 8 | 8 % | 94 % |
| Sonstige Auffälligkeiten | 6 | 6 % | 100 % |

Die ersten drei Felder erklären 75 %, die ersten vier 86 % → Kandidaten für die vertiefte Ursachenanalyse. Die 80/20-Regel ist ein **Prinzip, kein Naturgesetz** (real oft 70/30 oder 75/25). **Pareto kann:** Häufigkeiten sichtbar machen, Fokus schaffen, Prioritäten begründen. **Pareto kann nicht:** Ursachen beweisen, Risiken vollständig bewerten, die Lösung bestimmen. Ein seltenes Sicherheitsproblem kann wichtiger sein als ein häufiges Komfortproblem → ergänzend **FMEA**.

**Ishikawa (Breite) und 5 Why (Tiefe):** Das Fischgrät-Diagramm sammelt Ursachen**hypothesen** nach Kategorien – in der Berufsschule oft: **Mensch** (Kenntnisse, Kommunikation, Belastung), **Methode/Prozess** (Regeln, Abläufe, Freigaben), **Technik/Systeme** (Software, Schnittstellen, Verfügbarkeit), **Daten/Information** (Vollständigkeit, Aktualität), **Organisation** (Rollen, Zuständigkeiten, Kapazitäten), **Rahmenbedingungen** (Verträge, Zeiten, externe Partner). Alternativ die klassischen 6M (siehe 4.1) – nutze die Kategorien, die in der Aufgabe oder im Unterricht vorgegeben sind. Das Diagramm **beweist nichts**. Vorgehen: Problem eingrenzen → Ursachen breit sammeln (Ishikawa) → wichtigen Ast wählen → **5 Why** → Hypothese prüfen.

**5 Why – wann aufhören?** „Fünf“ ist nur ein Richtwert (drei können reichen). Sobald die Antwort **nur noch geraten** ist, stoppst du. Jede Aussage hat einen Status: **belegt** (durch Daten/Dokumente bestätigt), **plausibel** (nachvollziehbar, aber nicht bestätigt), **offen** (mit vorhandenen Informationen nicht prüfbar). „Wir wissen es noch nicht“ ist ein korrektes Ergebnis und führt zum Informationsbedarf (siehe 1.4).

**FMEA-Begriffe sauber trennen:** *Fehlerart* (Was läuft im Schritt falsch?) · *Fehlerfolge* (Welche Wirkung?) · *Fehlerursache* (Warum kann er entstehen?). ⚠️ Typischer Fehler: **Ursache und Folge vertauschen** – „Kunde wartet länger“ ist eine **Folge**. Beispiel: B = 8, A = 4, E = 5 → RPZ = 160. Die Zahl ist nur im Zusammenhang mit der Skala und im **Vergleich** mit anderen Risiken sinnvoll und ersetzt keine fachliche Bewertung. **Pareto = Welche Problemarten treten häufig auf (rückblickend)? FMEA = Welche möglichen Fehler sind riskant (vorbeugend)?**

## 4.4 Lean in Service- und IT-Prozessen

**Wert aus Kundensicht:** nicht „Ticket bearbeitet“, sondern „Problem zuverlässig gelöst“. Die fünf Grundgedanken: Wert bestimmen → Wertstrom betrachten → Fluss verbessern → Bedarf steuert die Leistung (Pull) → kontinuierlich verbessern.

| Art der Tätigkeit | Bedeutung | Beispiel |
|---|---|---|
| **Wertschöpfend** | trägt direkt zur Kundenleistung bei | Fehler technisch analysieren, Ticket bearbeiten |
| **Notwendig, nicht direkt wertschöpfend** | kein direkter Kundennutzen, aber nötig (Gesetz, Sicherheit, Organisation) | gesetzliche Dokumentation, Fehlerkatalog pflegen |
| **Verschwendung** | verbraucht Ressourcen ohne Beitrag | Daten zum dritten Mal abtippen, Wartezeiten |

„Nicht wertschöpfend“ ist **nicht** gleich „unnötig“.

**Verschwendung in IT-/Serviceprozessen:** Warten (Freigabe, Rückmeldung) · Fehler/Nacharbeit (fehlende Informationen) · Überbearbeitung (mehrfache Dokumentation, unnötige Prüfungen) · **unnötige Übergaben** (Vorgang wird hin- und hergeschoben) · Bestände/Warteschlangen (viele unbearbeitete Tickets) · Suche/unnötige Bewegung (Infos in mehreren Systemen) · ungenutztes Wissen.

**Muda – Mura – Muri:** **Muda** = Verschwendung (unnötige Tätigkeiten, Fehler, Wartezeiten). **Mura** = **Unausgeglichenheit** (starke Schwankungen, ungleichmäßige Auslastung). **Muri** = **Überlastung** (Menschen oder Systeme dauerhaft überfordert). Sie hängen zusammen: ungleichmäßige Verteilung (Mura) → Überlastung (Muri) → Fehler und Nacharbeit (Muda).

⚠️ **Optimierung ist nicht gleich Automatisierung:** Ein schlechter Prozess wird durch Software nicht gut – man würde Verschwendung automatisieren. Erst die Ursache verstehen. **Lean-Analyse:** Kundenergebnis bestimmen → Tätigkeiten einordnen → Wartezeiten/Übergaben suchen → Nacharbeit/Mehrfacherfassung suchen → **noch keine Lösung festlegen**.

## 4.5 Verbesserungspotenziale entwickeln und priorisieren

Kette: **Schwachstelle → Ursache → Risiko → Verbesserungsidee → erwartete Wirkung.** Ein Verbesserungspotenzial ist **keine fertige Lösung**.

| schwach | besser |
|---|---|
| „Wir brauchen eine neue Software.“ | „Mehrfacherfassung verursacht nachweislich Fehler und Zusatzzeit; eine gemeinsame Datenquelle könnte das beheben; offen ist, welche Informationen tatsächlich gebraucht werden.“ |

**Bewertungskriterien:** Problembezug (welche Schwachstelle?) · Nutzen · Aufwand · Risiko (neue Probleme?) · Kundennutzen · **Messbarkeit** (welche Kennzahl prüft die Wirkung?).

**Nutzen-Aufwand-Matrix:**

| | geringer Aufwand | hoher Aufwand |
|---|---|---|
| **hoher Nutzen** | früh umsetzen (**Quick Wins**) | strategisch prüfen, gut vorbereiten |
| **geringer Nutzen** | optional bei freier Kapazität | meist zurückstellen |

Die Matrix ersetzt keine fachliche Begründung – ein Sicherheitsrisiko oder eine gesetzliche Anforderung kann trotz hohen Aufwands **zwingend** sein.

| Ziel | Kennzahl zur Erfolgsmessung |
|---|---|
| Wartezeit reduzieren | durchschnittliche Wartezeit |
| Fehler reduzieren | Fehlerquote |
| Nacharbeit vermeiden | Nacharbeitsquote / First-Time-Right |
| Termintreue erhöhen | SLA-Einhaltung |

**Roter Faden:** Prozess modellieren (BPMN) → Ist-Zustand analysieren (Beobachtung → Symptom → Hypothese → Ursache) → messen (Kennzahlen) → priorisieren (Pareto, FMEA) → Ursachen suchen (Ishikawa, 5 Why) → Verbesserungen ableiten (Lean, Kaizen, TQM, BPR; PDCA/DMAIC) → Lücken schließen (Interview). **Erst analysieren, dann Lösung – nie umgekehrt.**

---

# Teil 5 – Process Mining (dein Alleinstellungsmerkmal)

Process Mining rekonstruiert den **tatsächlich gelebten** Prozess aus den Spuren, die IT-Systeme hinterlassen – statt aus Interviews, in denen Beteiligte den Prozess so schildern, wie er gedacht ist.

## 5.1 Das Event Log

Mindestens drei Pflichtfelder:

| Feld | Bedeutung |
|---|---|
| **Case ID** | Vorgangsnummer – klammert alle Ereignisse eines Falls zusammen (z. B. Auftragsnummer) |
| **Activity** | Bezeichnung des Prozessschritts |
| **Timestamp** | Zeitpunkt – bestimmt die Reihenfolge |
| *(Resource)* | optional: ausführende Person/System – ermöglicht Rollenanalysen |

Aus diesen Feldern lassen sich ableiten: tatsächlicher Prozessablauf, Durchlaufzeiten je Fall und je Schritt, **Varianten** (wie viele unterschiedliche Wege gibt es wirklich?), Engpässe, Schleifen (Nacharbeit) und Abweichungen vom Sollprozess.

## 5.2 Die drei Anwendungsarten

1. **Discovery:** Prozessmodell automatisch aus den Daten erzeugen – zeigt den Ist-Prozess ohne Vorannahmen.
2. **Conformance Checking:** Ist-Ablauf gegen das Soll-Modell prüfen – deckt Regelverstöße auf (z. B. Freigabe übersprungen).
3. **Enhancement:** vorhandenes Modell um Kennzahlen anreichern (Zeiten, Kosten, Häufigkeiten).

## 5.3 Datenqualität im Event Log

Hier verbinden sich beide Prüfungsbereiche – typische Probleme, die du benennen können solltest:
- **Fehlende Zeitstempel** → Reihenfolge nicht rekonstruierbar
- **Zu grobe Zeitstempel** (nur Datum, keine Uhrzeit) → Schritte innerhalb eines Tages nicht ordenbar
- **Uneinheitliche Aktivitätsbezeichnungen** („Rechnung stellen" vs. „Rechnungsstellung") → derselbe Schritt erscheint als zwei
- **Unvollständige Fälle** (Case beginnt vor oder endet nach dem Auswertungszeitraum) → verzerrte Durchlaufzeiten
- **Fehlende Case ID** → Ereignisse nicht zuordenbar
- **Zeitzonen-/Sommerzeitprobleme** → negative Durchlaufzeiten

## 5.4 Rechtliche Rahmenbedingungen

Ein Event Log mit dem Feld *Resource* enthält **personenbezogene Daten** und ermöglicht eine Leistungsauswertung einzelner Mitarbeiter. Daraus folgt:
- **Mitbestimmung des Betriebsrats** nach § 87 Abs. 1 Nr. 6 BetrVG: Systeme, die zur Überwachung von Verhalten oder Leistung der Beschäftigten **geeignet** sind, sind mitbestimmungspflichtig – die Eignung genügt, eine Überwachungsabsicht ist nicht erforderlich.
- **DSGVO:** Rechtsgrundlage klären, **Zweckbindung** und **Datenminimierung** beachten, Betroffene informieren; bei umfangreicher systematischer Überwachung kann eine **Datenschutz-Folgenabschätzung** (Art. 35) erforderlich sein.
- **Praktische Lösung:** Auswertung auf **aggregierter Ebene** (Team/Abteilung statt Person), **Pseudonymisierung** der Resource-Spalte, Schwellenwerte für Mindestgruppengrößen, Regelung in einer Betriebsvereinbarung.
- ⚠️ Pseudonymisierte Daten bleiben **personenbezogen** (Art. 4 Nr. 5 DSGVO) – die DSGVO gilt weiter, nur das Risiko sinkt. Erst echt **anonymisierte** oder ausreichend aggregierte Daten fallen aus der DSGVO heraus.

> ❓ **Prüferfrage:** Warum genügt es nicht, dem Betriebsrat zu versichern, man wolle keine Leistungskontrolle betreiben?
> *Das Mitbestimmungsrecht knüpft an die technische **Eignung** zur Verhaltens- und Leistungskontrolle an, nicht an die Absicht. Sobald individuell zurechenbare Daten erfasst werden, greift § 87 Abs. 1 Nr. 6 BetrVG unabhängig vom Verwendungszweck.*

---

# Teil 6 – Organisation und Methoden der Prozessoptimierung

## 6.1 Aufbau- und Ablauforganisation

- **Aufbauorganisation:** *Wer* ist wofür zuständig? Stellen, Abteilungen, Weisungsbeziehungen – dargestellt im **Organigramm**.
- **Ablauforganisation:** *Wie* läuft die Arbeit zeitlich und räumlich ab? Das sind die Prozesse aus Teil 1 bis 3.

| Organisationsform | Merkmal | Vorteil | Nachteil |
|---|---|---|---|
| **Einliniensystem** | jede Stelle hat genau einen Vorgesetzten | klare Zuständigkeit | lange Dienstwege |
| **Stabliniensystem** | Einlinie plus beratende Stäbe ohne Weisungsrecht (z. B. Datenschutz, Controlling) | Fachwissen ohne Bruch der Linie | Stäbe können nur empfehlen |
| **Mehrliniensystem** | mehrere fachliche Vorgesetzte | kurze Wege, Spezialisierung | Kompetenzkonflikte |
| **Matrixorganisation** | Funktion (z. B. IT) **und** Objekt bzw. Projekt kreuzen sich | flexibel, gut für Projekte | doppelte Unterstellung, Abstimmungsaufwand |

**Funktions- oder prozessorientiert?** Eine funktionsorientierte Organisation schneidet die Arbeit nach Abteilungen; ein Prozess wie der Reparaturservice läuft dann durch viele Abteilungen mit Liegezeiten an jeder Schnittstelle. Die **prozessorientierte** Organisation gibt jedem Prozess einen **Prozesseigner**, der für das Ergebnis vom Auftrag bis zur Rechnung verantwortlich ist. Eine **Prozesslandkarte** zeigt alle Führungs-, Kern- und Unterstützungsprozesse eines Unternehmens auf einen Blick.

## 6.2 Lean Management und Kaizen

**Lean Management** richtet alles am Kundennutzen aus und beseitigt **Verschwendung** (japanisch *Muda*) – alles, wofür der Kunde nicht bezahlen würde. Die **sieben Verschwendungsarten:**

| Verschwendung | Beispiel im Reparaturservice |
|---|---|
| Überproduktion | Berichte, die niemand liest |
| Wartezeit | Auftrag liegt zwei Tage im Postfach der Disposition |
| Transport | Unterlagen werden zwischen Standorten verschickt |
| Überbearbeitung | dieselben Kundendaten in drei Systemen gepflegt |
| Bestände | Ersatzteillager mit selten benötigten Teilen |
| Bewegung | Techniker sucht Werkzeug und Unterlagen |
| Fehler / Nacharbeit | zweiter Technikertermin wegen falsch bestelltem Teil |

Oft wird als achte Art **ungenutztes Wissen der Beschäftigten** ergänzt.

**Muda – Mura – Muri:** Muda = Verschwendung, **Mura** = Unausgeglichenheit (schwankende Auslastung), **Muri** = Überlastung – Details in 4.4.

- **Kaizen** (japanisch „Veränderung zum Besseren“) ist die Haltung hinter dem **KVP**: viele kleine Verbesserungen durch die Beschäftigten selbst, ständig statt einmalig.
- Der **SDCA-Zyklus** (Standardize – Do – Check – Act) sichert das Erreichte: Erst wenn eine Verbesserung als Standard festgeschrieben ist, startet der nächste PDCA-Zyklus. Ohne Standard fällt der Prozess in alte Gewohnheiten zurück.
- **5S** ist die Lean-Methode für einen geordneten Arbeitsplatz (auch digital: Ablagestruktur, Laufwerke): Sortieren, Systematisieren (Ordnung schaffen), Säubern, Standardisieren, Selbstdisziplin (Einhalten und Verbessern). Sie greift direkt die Verschwendungsart *Bewegung* (Suchen) an.
- **Business Process Reengineering (BPR)** ist das Gegenmodell: **radikale** Neugestaltung eines Prozesses „auf der grünen Wiese“ statt schrittweiser Verbesserung – große Wirkung, aber hohes Risiko und Widerstand.

## 6.3 Six Sigma und Total Quality Management

**Six Sigma** ist ein datengetriebener Ansatz, der die **Streuung** von Prozessergebnissen verringert. Ziel ist eine Fehlerquote von höchstens **3,4 Fehlern pro einer Million Möglichkeiten**. Vorgehen nach **DMAIC:**
1. Define – Problem, Ziel und Kunden festlegen
2. Measure – Ist-Zustand mit Kennzahlen messen
3. Analyze – Ursachen mit Daten nachweisen (Ishikawa, Korrelation, Regression)
4. Improve – Lösungen entwickeln und erproben
5. Control – Verbesserung dauerhaft absichern und überwachen

Als Datenanalyst bist du hier in deinem Element: Measure und Analyze sind Statistik (→ Deep Dive 3 und 4).

Gemessen wird in **DPMO** (Defects per Million Opportunities): $\text{DPMO} = \frac{\text{Fehler}}{\text{Einheiten} \cdot \text{Fehlermöglichkeiten je Einheit}} \cdot 1.000.000$

Beispiel: 200 Aufträge mit je 5 Fehlermöglichkeiten, 30 Fehler gefunden: $\frac{30}{200 \cdot 5} \cdot 1.000.000$ = **30.000 DPMO** – das liegt zwischen 3 Sigma (rund 66.800 DPMO) und 4 Sigma (rund 6.200 DPMO), weit entfernt von 3,4 DPMO. Die 3,4 DPMO gelten für 6 Sigma unter der üblichen Annahme, dass sich der Prozessmittelwert langfristig um 1,5 Sigma verschiebt.

**Total Quality Management (TQM)** ist die umfassendste Sicht: Qualität ist Aufgabe **aller** Beschäftigten und aller Prozesse, ausgerichtet auf Kundenzufriedenheit und ständige Verbesserung. TQM geht über eine Norm hinaus; ein verbreitetes Bewertungsmodell dafür ist das **EFQM-Modell**. Normgrundlage für ein zertifizierbares Qualitätsmanagementsystem ist die **ISO 9001** – seit 16.09.2026 in der Fassung **ISO 9001:2026**, die ISO 9001:2015 ablöst; bestehende Zertifikate müssen bis September 2029 umgestellt werden (Stand 2026).

## 6.4 FMEA – Fehler vorbeugen, bevor sie passieren

Die **FMEA** (Fehlermöglichkeits- und -einflussanalyse) bewertet **mögliche** Fehler eines Prozesses oder Produkts **vorbeugend**. Jeder Fehler erhält drei Bewertungen von 1 bis 10:

| Kennzahl | Frage | 1 | 10 |
|---|---|---|---|
| **A** – Auftreten | Wie wahrscheinlich tritt der Fehler auf? | unwahrscheinlich | sehr häufig |
| **B** – Bedeutung | Wie schwer wiegen die Folgen? | kaum spürbar | gefährlich, existenzbedrohend |
| **E** – Entdeckung | Wie wahrscheinlich bleibt der Fehler **unentdeckt**? | wird sicher entdeckt | wird kaum entdeckt |

**Risikoprioritätszahl:** $RPZ = A \cdot B \cdot E$ (Wertebereich 1 bis 1.000)

⚠️ **Achtung:** Bei **E** bedeutet ein **hoher** Wert eine **schlechte** Entdeckung. Ein Fehler, der vor Auslieferung fast sicher auffällt, bekommt E = 1.

**Durchgerechnetes Beispiel** (Reparaturservice, Maßnahmen ab einer RPZ von 125):

| Möglicher Fehler | A | B | E | RPZ |
|---|---|---|---|---|
| Ersatzteil falsch bestellt | 4 | 6 | 5 | 120 |
| Kundentermin nicht bestätigt | 6 | 4 | 3 | 72 |
| Vorschaden bei Abholung nicht dokumentiert | 3 | 8 | 7 | 168 |

Vorrang hat der **nicht dokumentierte Vorschaden** (RPZ 168): Er tritt selten auf, wird aber kaum entdeckt und führt zu teuren Streitfällen um die Haftung. Maßnahme: Fotodokumentation als Pflichtschritt in der App vor der Abholung – das senkt E deutlich. Unabhängig von der RPZ werden Fehler mit sehr hoher Bedeutung (B ≥ 9) immer betrachtet.

**Abgrenzung zur Risikoanalyse im Projekt** (→ Deep Dive 12): Dort zählen nur Eintrittswahrscheinlichkeit · Schadensausmaß. Die FMEA nimmt die **Entdeckbarkeit** als dritten Faktor dazu.

Hinweis für die Praxis: Das in der Automobilindustrie maßgebliche AIAG-VDA-FMEA-Handbuch (2019) ersetzt die RPZ durch die **Aufgabenpriorität** (AP: hoch/mittel/niedrig), bei der die Bedeutung stärker gewichtet wird – denn dieselbe RPZ kann sehr unterschiedliche Risiken beschreiben (2 · 10 · 5 = 100 wie 5 · 4 · 5 = 100). In IHK-Aufgaben wird weiterhin mit der RPZ gerechnet.

## 6.5 Strategische Analysemethoden

**SWOT-Analyse:** Gegenüberstellung von **internen** Stärken (Strengths) und Schwächen (Weaknesses) mit **externen** Chancen (Opportunities) und Risiken (Threats). Aus den Kombinationen werden Strategien abgeleitet: Stärken nutzen, um Chancen zu ergreifen (SO); Schwächen abbauen, um Risiken zu begegnen (WT) usw.

| | Chancen (extern) | Risiken (extern) |
|---|---|---|
| **Stärken** (intern) | SO: Stärken einsetzen, um Chancen zu nutzen | ST: Stärken nutzen, um Risiken abzuwehren |
| **Schwächen** (intern) | WO: Schwächen abbauen, um Chancen zu nutzen | WT: Schwächen abbauen, um Risiken zu vermeiden |

**ABC-Analyse:** teilt Objekte (Artikel, Kunden, Lieferanten) nach ihrem **Wertanteil** in drei Klassen. Vorgehen: Wert je Objekt berechnen, **absteigend sortieren**, Anteil am Gesamtwert und kumulierten Anteil bilden. Übliche Grenzen: **A** bis etwa 80 % des Werts, **B** bis etwa 95 %, **C** der Rest.

| Artikel | Jahresverbrauchswert | Wertanteil | kumuliert | Klasse |
|---|---|---|---|---|
| Bürostuhl | 48.000 € | 53,3 % | 53,3 % | A |
| Schreibtisch | 21.000 € | 23,3 % | 76,7 % | A |
| Monitor | 12.000 € | 13,3 % | 90,0 % | B |
| Lampe | 6.000 € | 6,7 % | 96,7 % | C |
| Kabelkanal | 2.000 € | 2,2 % | 98,9 % | C |
| Schrauben | 1.000 € | 1,1 % | 100,0 % | C |

Zwei von sechs Artikeln (33 %) machen 76,7 % des Werts aus – auf sie konzentrieren sich Preisverhandlungen und Bestandsoptimierung. Die ABC-Analyse ist die betriebswirtschaftliche Schwester der **Pareto-Analyse** (Teil 4.1).

**Benchmarking:** systematischer Vergleich von Kennzahlen und Prozessen mit einem Vorbild – **intern** (Filiale gegen Filiale), mit **Wettbewerbern** oder **branchenübergreifend** mit dem Klassenbesten eines Prozesses (z. B. Versandabwicklung eines Onlinehändlers). Ziel ist nicht Kopieren, sondern zu verstehen, *warum* der andere besser ist.

**Wertschöpfungskette nach Porter:** gliedert ein Unternehmen in **primäre Aktivitäten**, die direkt zum Produkt beitragen (Eingangslogistik, Produktion, Ausgangslogistik, Marketing und Vertrieb, Kundendienst), und **unterstützende Aktivitäten** (Unternehmensinfrastruktur, Personalwirtschaft, Technologieentwicklung, Beschaffung). Sie zeigt, wo Wert entsteht – und wo Kosten ohne Wertbeitrag anfallen.

**Portfolioanalyse (BCG-Matrix):** ordnet Produkte nach **Marktwachstum** und **relativem Marktanteil** in vier Felder: **Stars** (hoch/hoch – investieren), **Cash Cows** (niedriges Wachstum, hoher Anteil – Gewinne abschöpfen), **Question Marks** (hohes Wachstum, niedriger Anteil – entscheiden: ausbauen oder aufgeben), **Poor Dogs** (niedrig/niedrig – abbauen).

## 6.6 Kennzahlensysteme und Reifegrad

- **KPI** (Key Performance Indicator): eine der **wenigen** Kennzahlen, an denen der Erfolg eines Prozesses gemessen wird – mit Zielwert, Messvorschrift und Verantwortlichem. Zehn KPIs für einen Prozess sind keine KPIs mehr.
- **Balanced Scorecard:** Kennzahlensystem in vier Perspektiven – **Finanzen**, **Kunden**, **interne Prozesse**, **Lernen und Entwicklung**. Sie verhindert, dass nur auf Finanzkennzahlen gesteuert wird.
- **Reifegradmodelle** (z. B. CMMI mit fünf Stufen von „initial“ bis „optimierend“) bewerten, wie gut ein Prozess beherrscht wird: von „läuft irgendwie, abhängig von Einzelpersonen“ bis „wird gemessen und ständig verbessert“.

> ❓ **Prüferfrage:** Warum reicht es nicht, bei der FMEA nur auf Auftreten und Bedeutung zu schauen?
> *Ein Fehler, der zwar selten auftritt, aber vor dem Kunden kaum entdeckt wird, richtet oft mehr Schaden an als ein häufiger Fehler, den eine Kontrolle zuverlässig abfängt. Die Entdeckungswahrscheinlichkeit zeigt, wo zusätzliche Prüfungen den größten Nutzen bringen – sie ist der Hebel, den man im Prozess am leichtesten beeinflussen kann.*

> ❓ **Prüferfrage:** Ein Prüfling spaltet mit einem XOR-Gateway auf und führt mit einem AND-Gateway wieder zusammen. Was passiert beim Ablauf?
> *Ein Deadlock: Nach dem XOR läuft das Token nur über einen Pfad, das AND-Gateway wartet aber auf Token von allen Eingängen und bleibt für immer stehen. Umgekehrt (AND aufspalten, XOR zusammenführen) würde der Folgeschritt mehrfach ausgeführt. Deshalb führt man mit einem gleichartigen Gateway zusammen.*

---

## Die 12 häufigsten Fehler aus Prüfersicht

1. Durchgezogener Sequenzfluss zwischen zwei Pools statt gestricheltem Nachrichtenfluss.
2. XOR und AND verwechselt – parallele Schritte als Entscheidung modelliert.
3. Ausgehende Pfade eines XOR-Gateways nicht beschriftet.
4. Gateway ohne vorherige Aktivität, die die Entscheidungsgrundlage schafft.
5. In der EPK zwei Funktionen direkt hintereinander oder XOR-/OR-Verzweigung nach einem einzelnen Ereignis.
6. Bei der Optimierung nur die Bearbeitungszeit betrachtet, obwohl die Liegezeit 90 %+ ausmacht.
7. Wirtschaftlichkeitsrechnung ohne Beurteilung und ohne qualitative Faktoren.
8. Datenschutz und Betriebsrat bei Prozessdatenauswertungen nicht erwähnt.
9. Symptom als Ursache angegeben („Mitarbeitende sind zu langsam“) statt mit Daten belegt.
10. Kern-, Unterstützungs- und Managementprozess nach der Abteilung statt nach dem **Zweck der Organisation** eingeordnet.
11. Boundary-Event nicht am Task angeheftet oder ohne eigenen Ausnahmepfad; unterbrechend und nicht unterbrechend verwechselt.
12. Durchschnittswert interpretiert, ohne nach Priorität oder Kategorie aufzuschlüsseln.

---

# Übungsklausur Prozessanalyse (100 Punkte, 90 Minuten)

Bearbeite die Klausur **am Ende des Themas** am Stück, handschriftlich, mit Lineal für die Diagramme.

## Anlage 1 – Prozessbeschreibung Reparaturservice

Ein Kunde meldet telefonisch einen Reparaturbedarf. Die Serviceannahme erfasst den Auftrag im System und erstellt einen Kostenvoranschlag, der dem Kunden zugesendet wird. Lehnt der Kunde ab, erhält er eine Absage und der Vorgang endet. Nimmt er an, werden **gleichzeitig** das benötigte Ersatzteil bestellt und ein Techniker eingeplant. Sobald beides erledigt ist, führt die Werkstatt die Reparatur durch. Anschließend stellt die Buchhaltung die Rechnung und sendet sie an den Kunden.

## Anlage 2 – Zeitaufnahme (Mittelwerte je Auftrag)

| Schritt | Bearbeitungszeit | anschließende Liegezeit |
|---|---|---|
| Auftrag erfassen | 0,25 h | 3,5 h |
| Kostenvoranschlag/Disposition | 0,25 h | 16,0 h |
| Reparatur durchführen | 0,75 h | 9,0 h |
| Rechnung stellen | 0,25 h | – |

Weitere Daten: 200 Aufträge im Betrachtungsmonat, davon 24 mit erforderlicher Nacharbeit. Kostensatz Werkstatt: 60 €/h.

## Anlage 3 – Auszug aus dem Event Log

| Case ID | Activity | Timestamp | Resource |
|---|---|---|---|
| 5001 | Auftrag erfassen | 02.03. 08:15 | Kley |
| 5001 | Kostenvoranschlag erstellen | 02.03. 11:40 | Kley |
| 5001 | Reparatur durchführen | 03.03. 09:20 | Yilmaz |
| 5001 | Rechnung stellen | 03.03. 15:00 | Sander |
| 5002 | Auftrag erfassen | 02.03. 09:05 | Kley |
| 5002 | Kostenvoranschlag erstellen | 02.03. | Kley |
| 5002 | Reparatur durchführen | 04.03. 10:10 | Petrow |
| 5002 | Reparatur durchführen | 05.03. 08:45 | Petrow |
| 5002 | Rechnung stellen | 05.03. 16:30 | Sander |

## Block A – Grundlagen (14 P)

**A1 (6 P):** *Grenzen* Sie Kern-, Unterstützungs- und Führungsprozess *ab* und *ordnen* Sie den Reparaturservice begründet zu.

**A2 (8 P):** *Nennen* Sie vier Methoden der Ist-Aufnahme und *erläutern* Sie für zwei davon je einen Vor- und einen Nachteil.

## Block B – Modellierung (26 P)

**B1 (18 P):** *Modellieren* Sie den Prozess aus **Anlage 1** als BPMN-2.0-Diagramm. Verwenden Sie mindestens: einen Pool für das Möbelhaus mit drei Lanes, einen Pool für den Kunden, Start- und Endereignisse, ein XOR-Gateway mit beschrifteten Pfaden, ein AND-Gateway sowie mindestens einen Nachrichtenfluss.

**B2 (8 P):** In einer EPK folgt auf das Ereignis „Kostenvoranschlag ist versendet" direkt ein XOR-Konnektor mit den Ereignissen „Auftrag angenommen" und „Auftrag abgelehnt". *Benennen* Sie die beiden Modellierungsfehler, *begründen* Sie sie und *beschreiben* Sie die korrigierte Reihenfolge.

## Block C – Kennzahlen (26 P)

**C1 (8 P):** *Berechnen* Sie aus **Anlage 2** die Gesamtbearbeitungszeit, die Gesamtliegezeit und die Durchlaufzeit je Auftrag.

**C2 (6 P):** *Berechnen* Sie den Wertschöpfungsanteil (Bearbeitungszeit an der Durchlaufzeit) und *beurteilen* Sie das Ergebnis. *Leiten* Sie daraus ab, wo der wirksamste Ansatzpunkt für eine Optimierung liegt.

**C3 (6 P):** *Berechnen* Sie Fehlerquote und First Pass Yield für den Betrachtungsmonat.

**C4 (6 P):** Jede Nacharbeit kostet zusätzlich 0,75 h Werkstattzeit. *Berechnen* Sie die monatlichen Nacharbeitskosten insgesamt sowie den daraus resultierenden Zuschlag je Auftrag.

## Block D – Optimierung und Wirtschaftlichkeit (18 P)

**D1 (6 P):** *Nennen* Sie drei konkrete Maßnahmen zur Verkürzung der Durchlaufzeit im beschriebenen Prozess und *ordnen* Sie jede einer der vier Grundstrategien (Eliminieren, Standardisieren, Umstellen/Parallelisieren, Automatisieren) zu.

**D2 (8 P):** Ein digitales Auftragssystem kostet einmalig 18.000 €. Es spart je Auftrag 5 Minuten Bearbeitungszeit. Der Betrieb wickelt 2.400 Aufträge im Jahr ab, der Kostensatz beträgt 60 €/h. *Berechnen* Sie die jährliche Einsparung und die Amortisationszeit. *Beurteilen* Sie die Investition bei einer geplanten Nutzungsdauer von fünf Jahren.

**D3 (4 P):** *Nennen* Sie zwei qualitative Faktoren, die in dieser Rechnung nicht erfasst sind, aber in die Entscheidung einfließen sollten.

## Block E – Process Mining und Recht (16 P)

**E1 (6 P):** *Nennen* Sie die drei Pflichtfelder eines Event Logs und *erläutern* Sie deren jeweilige Funktion.

**E2 (6 P):** *Analysieren* Sie **Anlage 3**: *Benennen* Sie zwei Datenqualitätsprobleme und eine Prozessauffälligkeit. *Beschreiben* Sie jeweils die Konsequenz für die Auswertung.

**E3 (4 P):** Die Geschäftsführung möchte die Auswertung je Mitarbeiter aufschlüsseln. *Erläutern* Sie die rechtlichen Anforderungen und *nennen* Sie zwei Maßnahmen, mit denen die Analyse dennoch möglich wird.

---

## Fachgespräch: typische Fragen des Ausschusses

1. „*Beschreiben* Sie den Prozess, den Sie in Ihrem Projekt analysiert haben – wo lagen Start und Ende, und wie haben Sie ihn abgegrenzt?"
2. „Wie haben Sie den Ist-Zustand erhoben, und wie haben Sie sichergestellt, dass Sie den **tatsächlichen** und nicht den **behaupteten** Prozess erfasst haben?"
3. „Welche Kennzahlen haben Sie vor und nach der Optimierung gemessen? Wie belegen Sie den Erfolg?"
4. „Welche Schwachstelle war die gravierendste – und warum haben Sie sich für genau diese Maßnahme entschieden?"
5. „Wer war von Ihrer Prozessänderung betroffen, und wie haben Sie die Beteiligten eingebunden?" (Erwartet: Fachbereich, ggf. Betriebsrat, Datenschutzbeauftragter, Schulung, Change-Aspekte.)
6. „Was passiert mit Ihrer Lösung, wenn sich das Auftragsvolumen verdoppelt?"

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich unterscheide Kern-, Unterstützungs- und Führungsprozesse und nenne vier Methoden der Ist-Aufnahme mit Vor- und Nachteilen.
- [ ] Ich modelliere einen beschriebenen Prozess vollständig in BPMN 2.0 – mit Pools, Lanes, XOR/AND, beschrifteten Pfaden und Nachrichtenflüssen.
- [ ] Ich kenne die drei EPK-Regeln und finde Verstöße in einem gegebenen Modell.
- [ ] Ich berechne Durchlaufzeit, Wertschöpfungsanteil, Fehlerquote, FPY und Prozesskosten sicher.
- [ ] Ich leite aus dem Wertschöpfungsanteil den richtigen Optimierungsansatz ab (Liegezeit statt Bearbeitungszeit).
- [ ] Ich rechne eine Amortisation und ergänze Beurteilung und qualitative Faktoren von selbst.
- [ ] Ich kenne Aufbau und Datenqualitätsprobleme eines Event Logs sowie die drei Process-Mining-Anwendungsarten.
- [ ] Ich benenne bei jeder Auswertung personenbezogener Prozessdaten Betriebsrat (§ 87 BetrVG) und DSGVO.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
- [ ] Ich unterscheide Aufbau- und Ablauforganisation und kenne Einlinien-, Stablinien- und Matrixorganisation.
- [ ] Ich erkläre Lean (sieben Verschwendungsarten), Kaizen, SDCA, BPR, Six Sigma (DMAIC) und TQM.
- [ ] Ich berechne die RPZ einer FMEA und begründe, welcher Fehler Vorrang hat.
- [ ] Ich führe eine ABC-Analyse durch und wende SWOT, Benchmarking, Wertschöpfungskette und BCG-Matrix an.
- [ ] Ich erkläre das Token-Verhalten an XOR-, AND- und OR-Gateways (inklusive Deadlock-Falle) und nenne die Zusatzobjekte der eEPK.
- [ ] Ich grenze einen Prozess mit SIPOC ab und berechne DPMO.
- [ ] Ich ordne Prozesse nach dem Zweck der Organisation ein (Kern, Unterstützung, Management) und nenne die drei Ebenen von Managementprozessen.
- [ ] Ich unterscheide Stelle, Rolle, Abteilung und Tätigkeit sowie Stellenbeschreibung und Anforderungsprofil und kenne die Aufgaben des Process Owners.
- [ ] Ich ordne Daten als Stamm-, Bewegungs- oder Prozessdaten ein.
- [ ] Ich trenne Beobachtung, Symptom, Hypothese und Ursache und formuliere neutrale Analysefragen.
- [ ] Ich unterscheide interrupting und non-interrupting Boundary Events, Error und Terminate, Intermediate- und Boundary-Timer.
- [ ] Ich unterscheide Muda, Mura und Muri und bewerte Verbesserungen mit der Nutzen-Aufwand-Matrix.

---

## Ausblick

Damit hast du die Grundlagen beider schriftlicher Prüfungsbereiche abgedeckt. **Wichtiger Hinweis zum Zeitplan:** Prüf spätestens jetzt die Frist deiner IHK für den **Projektantrag** und reich den Antrag rechtzeitig ein. Die Projektarbeit zählt 50 % – kein schriftlicher Prüfungsbereich kann das ausgleichen.
