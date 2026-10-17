# Deep Dive 17: Glossar & Diagramme

Nachschlagewerk zu allen anderen Deep Dives: Teil 1 bis 6 zeigen jeden Diagrammtyp, der in der FIDPA-AP2 vorkommt, mit einem gezeichneten Beispiel, den Symbolen und den typischen Prüfungsfallen. Teil 7 gleicht die App mit dem Anhang der Prüfung ab (Notationen, SQL-Auszug, Formeln, Präfixe). Teil 8 listet alle Fachbegriffe der Lernblätter und Karteikarten von A bis Z – die Liste wird beim Laden aus dem Glossar erzeugt und ist deshalb immer aktuell.

Alle Beispiele spielen bei der **Möbelhaus Nordholz GmbH**, die Zahlen stammen aus den Deep Dives (Regression aus DD4, Boxplot aus DD3, Konfusionsmatrix aus DD7).

---

## Übersicht: Welches Diagramm wofür?

| Diagramm | Zeigt | Typische Prüfungsaufgabe | Mehr in |
|---|---|---|---|
| BPMN 2.0 | Ablauf mit Beteiligten, Entscheidungen, Nachrichten | Prozess modellieren, Fehler finden | DD5 |
| EPK / eEPK | Ablauf als Wechsel von Ereignis und Funktion | EPK zeichnen, Regeln prüfen | DD5 |
| Wertstromdiagramm | Material- und Informationsfluss mit Zeiten | Durchlaufzeit, Wertschöpfungsanteil | DD5 |
| SIPOC | Lieferant, Input, Prozess, Output, Kunde | Prozess abgrenzen | DD5 |
| Organigramm | Aufbauorganisation | Stelle, Instanz, Stab einordnen | DD12 |
| Ishikawa | Ursachen eines Problems nach Kategorien | Ursachen sammeln (6M) | DD5, DD9 |
| Use-Case-Diagramm | Was ein System für wen leistet | Anforderungen darstellen | DD15 |
| Klassendiagramm | Klassen, Attribute, Beziehungen | Datenstruktur modellieren | DD15 |
| Aktivitätsdiagramm | Ablauf von Tätigkeiten | Ablauf mit Verzweigung, Parallelität | DD15 |
| Sequenzdiagramm | Nachrichten zwischen Beteiligten über die Zeit | API-Aufruf darstellen | DD15 |
| Zustandsdiagramm | Lebenszyklus eines Objekts | Statuswerte und Übergänge | DD15 |
| ER-Diagramm (Chen, Min-Max, Krähenfuß) | Entitäten, Beziehungen, Kardinalitäten | Datenmodell entwerfen | DD2 |
| Star- / Snowflake-Schema | Fakt- und Dimensionstabellen | DWH-Modell entwerfen | DD8 |
| Programmablaufplan, Struktogramm | Algorithmus | Algorithmus darstellen, Fehler finden | DD11 |
| Netzplan, Gantt-Diagramm | Termine, Abhängigkeiten, Puffer | kritischen Pfad bestimmen | DD12 |
| Risikomatrix | Risiken nach Wahrscheinlichkeit und Schaden | Risiken bewerten | DD12 |
| Kanban-Board, Burndown-Chart | Arbeitsfluss, Sprintfortschritt | agiles Vorgehen erklären | DD12 |
| Säule, Balken, Linie, Kreis | Vergleich, Verlauf, Anteil | Diagrammtyp begründen | DD11 |
| Streudiagramm, Histogramm, Boxplot | Zusammenhang, Verteilung, Ausreißer | Diagramm lesen, Kennzahlen ablesen | DD3, DD4 |
| Pareto-Diagramm, Heatmap | Schwerpunkte, Muster in zwei Dimensionen | Prioritäten ableiten | DD3, DD11 |
| Konfusionsmatrix, ROC-Kurve | Güte eines Klassifikators | Kennzahlen berechnen, Modelle vergleichen | DD7 |

---

# Teil 1 – Prozessdiagramme

## 1.1 BPMN 2.0

**BPMN 2.0** – Business Process Model and Notation, ein Standard der OMG (auch ISO/IEC 19510) zur grafischen Modellierung von Geschäftsprozessen; verständlich für Fachabteilung und IT.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 330" width="720" height="330" role="img" aria-label="BPMN-Kollaborationsdiagramm: Bestellung bearbeiten">
<defs><marker id="bp-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker><marker id="bp-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10" class="dg-linie"/></marker><marker id="bp-kreis" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><circle cx="5" cy="5" r="4" class="dg-form"/></marker></defs>
<rect x="10" y="10" width="700" height="46" class="dg-grau"/>
<text x="360" y="33" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Kunde</text>
<rect x="10" y="100" width="700" height="220" class="dg-form"/>
<line x1="34" y1="100" x2="34" y2="320" class="dg-linie"/>
<line x1="58" y1="100" x2="58" y2="320" class="dg-linie"/>
<line x1="34" y1="210" x2="710" y2="210" class="dg-linie"/>
<text x="22" y="210" text-anchor="middle" dominant-baseline="middle" class="dg-fett" transform="rotate(-90 22 210)">Möbelhaus Nordholz</text>
<text x="46" y="155" text-anchor="middle" dominant-baseline="middle" class="dg-klein" transform="rotate(-90 46 155)">Vertrieb</text>
<text x="46" y="265" text-anchor="middle" dominant-baseline="middle" class="dg-klein" transform="rotate(-90 46 265)">Lager</text>
<circle cx="95" cy="155" r="15" class="dg-form"/>
<rect x="87" y="150" width="16" height="11" class="dg-form dg-duenn"/>
<path d="M87,150 L95,156 L103,150" class="dg-linie dg-duenn"/>
<text x="95" y="186" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellung</text>
<text x="95" y="199" text-anchor="middle" dominant-baseline="middle" class="dg-klein">eingegangen</text>
<line x1="110" y1="155" x2="135" y2="155" class="dg-linie" marker-end="url(#bp-pfeil)"/>
<rect x="135" y="130" width="110" height="50" rx="10" class="dg-form"/>
<text x="190" y="147.5" text-anchor="middle" dominant-baseline="middle">Bestellung</text>
<text x="190" y="162.5" text-anchor="middle" dominant-baseline="middle">prüfen</text>
<line x1="245" y1="155" x2="273" y2="155" class="dg-linie" marker-end="url(#bp-pfeil)"/>
<polygon points="295,133 317,155 295,177 273,155" class="dg-form"/>
<line x1="287" y1="147" x2="303" y2="163" class="dg-linie"/>
<line x1="303" y1="147" x2="287" y2="163" class="dg-linie"/>
<text x="295" y="118" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ware verfügbar?</text>
<line x1="317" y1="155" x2="355" y2="155" class="dg-linie" marker-end="url(#bp-pfeil)"/>
<text x="336" y="145" text-anchor="middle" dominant-baseline="middle" class="dg-klein">nein</text>
<rect x="355" y="130" width="110" height="50" rx="10" class="dg-form"/>
<text x="410" y="147.5" text-anchor="middle" dominant-baseline="middle">Absage</text>
<text x="410" y="162.5" text-anchor="middle" dominant-baseline="middle">senden</text>
<line x1="465" y1="155" x2="495" y2="155" class="dg-linie" marker-end="url(#bp-pfeil)"/>
<circle cx="510" cy="155" r="15" class="dg-form dg-dick"/>
<text x="510" y="186" text-anchor="middle" dominant-baseline="middle" class="dg-klein">abgelehnt</text>
<path d="M295,177 L295,265 L330,265" class="dg-linie" marker-end="url(#bp-pfeil)"/>
<text x="306" y="196" text-anchor="start" dominant-baseline="middle" class="dg-klein">ja</text>
<rect x="330" y="240" width="130" height="50" rx="10" class="dg-form"/>
<text x="395" y="257.5" text-anchor="middle" dominant-baseline="middle">Ware</text>
<text x="395" y="272.5" text-anchor="middle" dominant-baseline="middle">kommissionieren</text>
<line x1="460" y1="265" x2="495" y2="265" class="dg-linie" marker-end="url(#bp-pfeil)"/>
<rect x="495" y="240" width="110" height="50" rx="10" class="dg-form"/>
<text x="550" y="257.5" text-anchor="middle" dominant-baseline="middle">Ware</text>
<text x="550" y="272.5" text-anchor="middle" dominant-baseline="middle">versenden</text>
<line x1="605" y1="265" x2="635" y2="265" class="dg-linie" marker-end="url(#bp-pfeil)"/>
<circle cx="650" cy="265" r="15" class="dg-form dg-dick"/>
<text x="650" y="296" text-anchor="middle" dominant-baseline="middle" class="dg-klein">versandt</text>
<line x1="95" y1="56" x2="95" y2="139" class="dg-linie dg-strich" marker-end="url(#bp-offen)" marker-start="url(#bp-kreis)"/>
<text x="102" y="78" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-kursiv">Bestellung</text>
<line x1="410" y1="130" x2="410" y2="56" class="dg-linie dg-strich" marker-end="url(#bp-offen)" marker-start="url(#bp-kreis)"/>
<text x="417" y="78" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-kursiv">Absage</text>
</svg>
```

| Symbol | Bedeutung |
|---|---|
| **Pool** | Teilnehmer, z. B. ein Unternehmen oder der Kunde; zugeklappt, wenn sein Ablauf nicht interessiert |
| **Lane** | Rolle oder Abteilung innerhalb eines Pools |
| **Startereignis** | Kreis mit dünnem Rand – löst den Prozess aus (hier: Nachricht mit Briefsymbol) |
| **Zwischenereignis** | Kreis mit doppeltem Rand – tritt während des Ablaufs ein (z. B. Timer „2 Tage warten“) |
| **Endereignis** | Kreis mit dickem Rand – jeder Pfad endet in einem Endereignis |
| **Task** | abgerundetes Rechteck mit Verb + Objekt („Bestellung prüfen“) |
| **XOR-Gateway** | Raute mit X – genau ein Pfad wird genommen; Pfade beschriften |
| **AND-Gateway** | Raute mit + – alle Pfade laufen parallel; braucht ein AND zum Zusammenführen |
| **OR-Gateway** | Raute mit Kreis – ein oder mehrere Pfade |
| **Sequenzfluss** | durchgezogener Pfeil – Reihenfolge, nur innerhalb eines Pools |
| **Nachrichtenfluss** | gestrichelter Pfeil mit Kreis am Anfang – nur zwischen Pools |

Prüfungsfallen: Sequenzfluss über eine Poolgrenze (verboten), Nachrichtenfluss zwischen Lanes desselben Pools (verboten), unbeschriftete XOR-Pfade, ein Pfad ohne Endereignis, XOR öffnen und mit AND schließen (der AND wartet auf einen Pfad, der nie kommt – Deadlock).

Üben: [Diagramm-Übungen BPMN](#/diagramme?typ=bpmn) – Elemente einsetzen und Abläufe ordnen.

## 1.2 EPK und eEPK

**Ereignisgesteuerte Prozesskette (EPK)** – Prozessdarstellung aus dem ARIS-Konzept, in der sich passive Ereignisse und aktive Funktionen abwechseln. Die **erweiterte EPK (eEPK)** ergänzt Organisationseinheiten, Informationsobjekte und Anwendungssysteme.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 405" width="500" height="405" role="img" aria-label="eEPK: Bestellung prüfen mit XOR-Verzweigung">
<defs><marker id="epk-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<polygon points="126,10 274,10 288,30 274,50 126,50 112,30" class="dg-rot"/>
<text x="200" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellung ist eingegangen</text>
<line x1="200" y1="50" x2="200" y2="80" class="dg-linie" marker-end="url(#epk-pfeil)"/>
<rect x="112" y="80" width="176" height="40" rx="10" class="dg-gut"/>
<text x="200" y="100" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellung prüfen</text>
<line x1="200" y1="120" x2="200" y2="152" class="dg-linie" marker-end="url(#epk-pfeil)"/>
<circle cx="200" cy="168" r="16" class="dg-form"/>
<text x="200" y="168" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">XOR</text>
<path d="M200,184 L200,200 L105,200 L105,220" class="dg-linie" marker-end="url(#epk-pfeil)"/>
<path d="M200,200 L300,200 L300,220" class="dg-linie" marker-end="url(#epk-pfeil)"/>
<polygon points="34,220 176,220 190,240 176,260 34,260 20,240" class="dg-rot"/>
<text x="105" y="240" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellung ist gültig</text>
<polygon points="229,220 371,220 385,240 371,260 229,260 215,240" class="dg-rot"/>
<text x="300" y="240" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellung ist ungültig</text>
<line x1="105" y1="260" x2="105" y2="290" class="dg-linie" marker-end="url(#epk-pfeil)"/>
<line x1="300" y1="260" x2="300" y2="290" class="dg-linie" marker-end="url(#epk-pfeil)"/>
<rect x="20" y="290" width="170" height="40" rx="10" class="dg-gut"/>
<text x="105" y="310" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ware kommissionieren</text>
<rect x="215" y="290" width="170" height="40" rx="10" class="dg-gut"/>
<text x="300" y="310" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Absage senden</text>
<line x1="105" y1="330" x2="105" y2="360" class="dg-linie" marker-end="url(#epk-pfeil)"/>
<line x1="300" y1="330" x2="300" y2="360" class="dg-linie" marker-end="url(#epk-pfeil)"/>
<polygon points="34,360 176,360 190,380 176,400 34,400 20,380" class="dg-rot"/>
<text x="105" y="380" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ware ist kommissioniert</text>
<polygon points="229,360 371,360 385,380 371,400 229,400 215,380" class="dg-rot"/>
<text x="300" y="380" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Absage ist versendet</text>
<line x1="288" y1="100" x2="352" y2="100" class="dg-linie"/>
<ellipse cx="412" cy="100" rx="60" ry="22" class="dg-mittel"/>
<line x1="366" y1="86" x2="366" y2="114" class="dg-linie dg-duenn"/>
<text x="418" y="100" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Vertrieb</text>
<text x="412" y="132" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Organisationseinheit</text>
<rect x="360" y="14" width="108" height="34" class="dg-akzent"/>
<text x="414" y="31" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Kundendaten</text>
<text x="414" y="60" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Informationsobjekt</text>
<line x1="360" y1="40" x2="290" y2="90" class="dg-linie" marker-end="url(#epk-pfeil)"/>
</svg>
```

| Symbol | Bedeutung |
|---|---|
| **Ereignis** | Sechseck, Zustand im Partizip: „Bestellung ist eingegangen“ |
| **Funktion** | abgerundetes Rechteck, Tätigkeit als Verb: „Bestellung prüfen“ |
| **Konnektor** | Kreis mit XOR, ∧ (AND) oder ∨ (OR) zum Verzweigen und Zusammenführen |
| **Organisationseinheit** | Ellipse (in ARIS mit senkrechtem Strich am linken Rand, im Unterricht oft ohne) – wer führt die Funktion aus |
| **Informationsobjekt** | Rechteck – welche Daten gelesen oder geschrieben werden |

Regeln: Die EPK beginnt und endet mit einem Ereignis; Ereignis und Funktion wechseln sich ab; nach einem einzelnen Ereignis darf kein XOR- oder OR-Split folgen (ein Ereignis kann nicht entscheiden – die Entscheidung trifft die Funktion davor); ein geöffneter Konnektor wird mit demselben Typ geschlossen.

Üben: [Diagramm-Übungen EPK und eEPK](#/diagramme?typ=epk) – Elemente einsetzen und Abläufe ordnen.

## 1.3 Wertstromdiagramm

**Wertstromdiagramm** – Darstellung aus dem Lean Management, die Prozessschritte, Bestände und eine Zeitlinie zeigt; Grundlage der Wertstromanalyse. Die Zeitlinie trennt Liegezeit (oben, keine Wertschöpfung) und Bearbeitungszeit (unten).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 250" width="720" height="250" role="img" aria-label="Wertstromdiagramm mit Zeitlinie">
<defs><marker id="ws-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<rect x="40" y="20" width="140" height="44" class="dg-akzent"/>
<text x="110" y="42" text-anchor="middle" dominant-baseline="middle">Auftrag erfassen</text>
<rect x="40" y="64" width="140" height="40" class="dg-form"/>
<text x="110" y="84" text-anchor="middle" dominant-baseline="middle" class="dg-klein">BZ = 10 min</text>
<rect x="290" y="20" width="140" height="44" class="dg-akzent"/>
<text x="360" y="42" text-anchor="middle" dominant-baseline="middle">Kommissionieren</text>
<rect x="290" y="64" width="140" height="40" class="dg-form"/>
<text x="360" y="84" text-anchor="middle" dominant-baseline="middle" class="dg-klein">BZ = 25 min</text>
<rect x="540" y="20" width="140" height="44" class="dg-akzent"/>
<text x="610" y="42" text-anchor="middle" dominant-baseline="middle">Versenden</text>
<rect x="540" y="64" width="140" height="40" class="dg-form"/>
<text x="610" y="84" text-anchor="middle" dominant-baseline="middle" class="dg-klein">BZ = 15 min</text>
<polygon points="235,28 253,60 217,60" class="dg-mittel"/>
<text x="235" y="49" text-anchor="middle" dominant-baseline="middle" class="dg-fett">I</text>
<text x="235" y="76" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestand · 4 h</text>
<polygon points="485,28 503,60 467,60" class="dg-mittel"/>
<text x="485" y="49" text-anchor="middle" dominant-baseline="middle" class="dg-fett">I</text>
<text x="485" y="76" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestand · 2 h</text>
<line x1="180" y1="42" x2="213" y2="42" class="dg-linie" marker-end="url(#ws-pfeil)"/>
<line x1="257" y1="42" x2="290" y2="42" class="dg-linie" marker-end="url(#ws-pfeil)"/>
<line x1="430" y1="42" x2="463" y2="42" class="dg-linie" marker-end="url(#ws-pfeil)"/>
<line x1="507" y1="42" x2="540" y2="42" class="dg-linie" marker-end="url(#ws-pfeil)"/>
<polyline points="40,172 180,172 180,140 290,140 290,172 430,172 430,140 540,140 540,172 680,172" class="dg-linie dg-dick"/>
<text x="110" y="185" text-anchor="middle" dominant-baseline="middle" class="dg-klein">10 min</text>
<text x="235" y="130" text-anchor="middle" dominant-baseline="middle" class="dg-klein">240 min</text>
<text x="360" y="185" text-anchor="middle" dominant-baseline="middle" class="dg-klein">25 min</text>
<text x="485" y="130" text-anchor="middle" dominant-baseline="middle" class="dg-klein">120 min</text>
<text x="610" y="185" text-anchor="middle" dominant-baseline="middle" class="dg-klein">15 min</text>
<text x="40" y="212" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">oben: Liegezeit (keine Wertschöpfung) · unten: Bearbeitungszeit (wertschöpfend)</text>
<text x="40" y="236" text-anchor="start" dominant-baseline="middle" class="dg-fett">Durchlaufzeit = 50 + 360 = 410 min · Wertschöpfungsanteil = 50 / 410 = 12,2 %</text>
</svg>
```

Lesen: Die Bearbeitungszeit beträgt nur 50 min, die Durchlaufzeit 410 min – der Hebel liegt bei den Beständen (Dreiecke) zwischen den Schritten, nicht bei schnellerem Arbeiten.

## 1.4 SIPOC

**SIPOC** – Tabelle zur Abgrenzung eines Prozesses (Six Sigma, Phase Define): Supplier, Input, Process, Output, Customer.

| Supplier | Input | Process (4–7 Schritte) | Output | Customer |
|---|---|---|---|---|
| Kunde, Webshop | Bestellung | Bestellung prüfen → kommissionieren → verpacken → versenden → Rechnung stellen | Lieferung, Rechnung | Kunde, Buchhaltung |
| Lieferant | Ware | | Lagerbewegung | Lager |

Vorteil: In wenigen Minuten ist klar, wo der Prozess beginnt und endet – bevor jemand ein BPMN-Diagramm zeichnet.

## 1.5 Organigramm

**Organigramm** – grafische Darstellung der Aufbauorganisation: Stellen, Abteilungen, Weisungsbeziehungen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 225" width="620" height="225" role="img" aria-label="Organigramm (Einliniensystem mit Stabsstelle)">
<rect x="230" y="15" width="160" height="40" class="dg-akzent"/>
<text x="310" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Geschäftsführung</text>
<line x1="310" y1="55" x2="310" y2="100" class="dg-linie"/>
<line x1="310" y1="78" x2="450" y2="78" class="dg-linie"/>
<rect x="450" y="60" width="130" height="36" class="dg-grau"/>
<text x="515" y="70.5" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Datenschutz</text>
<text x="515" y="85.5" text-anchor="middle" dominant-baseline="middle" class="dg-klein">(Stabsstelle)</text>
<line x1="90" y1="100" x2="530" y2="100" class="dg-linie"/>
<line x1="90" y1="100" x2="90" y2="120" class="dg-linie"/>
<rect x="30" y="120" width="120" height="36" class="dg-form"/>
<text x="90" y="138" text-anchor="middle" dominant-baseline="middle">Vertrieb</text>
<line x1="310" y1="100" x2="310" y2="120" class="dg-linie"/>
<rect x="250" y="120" width="120" height="36" class="dg-form"/>
<text x="310" y="138" text-anchor="middle" dominant-baseline="middle">Logistik</text>
<line x1="530" y1="100" x2="530" y2="120" class="dg-linie"/>
<rect x="470" y="120" width="120" height="36" class="dg-form"/>
<text x="530" y="138" text-anchor="middle" dominant-baseline="middle">IT &amp; Controlling</text>
<line x1="530" y1="156" x2="530" y2="176" class="dg-linie"/>
<rect x="470" y="176" width="120" height="36" class="dg-form"/>
<text x="530" y="194" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Datenanalyse</text>
<line x1="310" y1="156" x2="310" y2="176" class="dg-linie"/>
<rect x="250" y="176" width="120" height="36" class="dg-form"/>
<text x="310" y="194" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Lager</text>
</svg>
```

Das Beispiel zeigt ein **Einliniensystem** (jede Stelle hat genau einen Vorgesetzten) mit einer **Stabsstelle**, die berät, aber nicht weisungsbefugt ist. Beim Mehrliniensystem hat eine Stelle mehrere Vorgesetzte, die **Matrixorganisation** kreuzt Funktionen und Projekte.

## 1.6 Ishikawa-Diagramm

**Ishikawa-Diagramm** – Ursache-Wirkungs-Diagramm (Fischgrätendiagramm): Das Problem steht am Kopf, die Ursachen hängen an Gräten, die nach Kategorien geordnet sind – meist den **6M** Mensch, Maschine, Material, Methode, Messung, Mitwelt.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 290" width="720" height="290" role="img" aria-label="Ishikawa-Diagramm (6M) zum Problem Lieferverzug">
<defs><marker id="ish-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<line x1="30" y1="150" x2="585" y2="150" class="dg-linie dg-dick" marker-end="url(#ish-pfeil)"/>
<rect x="588" y="125" width="122" height="50" class="dg-rot"/>
<text x="649" y="150" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Lieferverzug</text>
<line x1="130" y1="40" x2="200" y2="150" class="dg-linie"/>
<text x="130" y="26" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Mensch</text>
<line x1="120.7" y1="82" x2="156.7" y2="82" class="dg-linie dg-duenn"/>
<text x="116.7" y="82" text-anchor="end" dominant-baseline="middle" class="dg-klein">Einarbeitung fehlt</text>
<line x1="300" y1="40" x2="370" y2="150" class="dg-linie"/>
<text x="300" y="26" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Maschine</text>
<line x1="290.7" y1="82" x2="326.7" y2="82" class="dg-linie dg-duenn"/>
<text x="286.7" y="82" text-anchor="end" dominant-baseline="middle" class="dg-klein">Scanner fällt aus</text>
<line x1="470" y1="40" x2="540" y2="150" class="dg-linie"/>
<text x="470" y="26" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Material</text>
<line x1="460.7" y1="82" x2="496.7" y2="82" class="dg-linie dg-duenn"/>
<text x="456.7" y="82" text-anchor="end" dominant-baseline="middle" class="dg-klein">falsche Etiketten</text>
<line x1="130" y1="260" x2="200" y2="150" class="dg-linie"/>
<text x="130" y="274" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Methode</text>
<line x1="120.7" y1="218" x2="156.7" y2="218" class="dg-linie dg-duenn"/>
<text x="116.7" y="218" text-anchor="end" dominant-baseline="middle" class="dg-klein">kein FIFO</text>
<line x1="300" y1="260" x2="370" y2="150" class="dg-linie"/>
<text x="300" y="274" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Messung</text>
<line x1="290.7" y1="218" x2="326.7" y2="218" class="dg-linie dg-duenn"/>
<text x="286.7" y="218" text-anchor="end" dominant-baseline="middle" class="dg-klein">Bestand ungenau</text>
<line x1="470" y1="260" x2="540" y2="150" class="dg-linie"/>
<text x="470" y="274" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Mitwelt</text>
<line x1="460.7" y1="218" x2="496.7" y2="218" class="dg-linie dg-duenn"/>
<text x="456.7" y="218" text-anchor="end" dominant-baseline="middle" class="dg-klein">Lager zu eng</text>
</svg>
```

Es sammelt mögliche Ursachen (z. B. im Brainstorming), beweist aber keine. Die wichtigsten prüft man danach mit Daten – etwa mit einem Pareto-Diagramm (6.8).

> ❓ **Prüferfrage:** Warum darf in einer EPK nach dem Ereignis „Bestellung ist eingegangen“ kein XOR-Konnektor aufspalten?
> *Ein Ereignis ist ein passiver Zustand und kann nichts entscheiden. Die Entscheidung trifft eine Funktion (z. B. „Bestellung prüfen“); erst nach ihr darf das XOR auf die Ereignisse „gültig“ und „ungültig“ verzweigen.*

---

# Teil 2 – UML-Diagramme

## 2.1 Überblick

**UML** – Unified Modeling Language, Standard der OMG mit 14 Diagrammarten. Sie teilen sich in **Strukturdiagramme** (was es gibt: Klassen-, Objekt-, Komponenten-, Verteilungsdiagramm …) und **Verhaltensdiagramme** (was passiert: Use-Case-, Aktivitäts-, Zustands- und Interaktionsdiagramme wie das Sequenzdiagramm).

| Frage | Diagramm |
|---|---|
| Was soll das System für wen leisten? | Use-Case-Diagramm |
| Welche Daten und Beziehungen gibt es? | Klassendiagramm |
| In welcher Reihenfolge laufen Tätigkeiten ab? | Aktivitätsdiagramm |
| Wer schickt wem wann welche Nachricht? | Sequenzdiagramm |
| Welche Zustände durchläuft ein Objekt? | Zustandsdiagramm |

## 2.2 Use-Case-Diagramm

**Use-Case-Diagramm** – zeigt die Anwendungsfälle eines Systems und die Akteure, die sie nutzen; beschreibt das Was, nicht das Wie.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 300" width="650" height="300" role="img" aria-label="Use-Case-Diagramm Online-Shop">
<defs><marker id="uc-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10" class="dg-linie"/></marker></defs>
<rect x="150" y="20" width="350" height="262" class="dg-form"/>
<text x="160" y="36" text-anchor="start" dominant-baseline="middle" class="dg-fett">Online-Shop</text>
<circle cx="60" cy="70" r="9" class="dg-form"/>
<line x1="60" y1="79" x2="60" y2="106" class="dg-linie"/>
<line x1="45" y1="88" x2="75" y2="88" class="dg-linie"/>
<line x1="60" y1="106" x2="48" y2="124" class="dg-linie"/>
<line x1="60" y1="106" x2="72" y2="124" class="dg-linie"/>
<text x="60" y="138" text-anchor="middle" dominant-baseline="middle">Kunde</text>
<circle cx="590" cy="190" r="9" class="dg-form"/>
<line x1="590" y1="199" x2="590" y2="226" class="dg-linie"/>
<line x1="575" y1="208" x2="605" y2="208" class="dg-linie"/>
<line x1="590" y1="226" x2="578" y2="244" class="dg-linie"/>
<line x1="590" y1="226" x2="602" y2="244" class="dg-linie"/>
<text x="590" y="258" text-anchor="middle" dominant-baseline="middle">Lagerist</text>
<ellipse cx="265" cy="85" rx="95" ry="26" class="dg-form"/>
<text x="265" y="85" text-anchor="middle" dominant-baseline="middle">Bestellung aufgeben</text>
<ellipse cx="240" cy="222" rx="85" ry="26" class="dg-form"/>
<text x="240" y="222" text-anchor="middle" dominant-baseline="middle">Zahlung durchführen</text>
<ellipse cx="415" cy="160" rx="75" ry="26" class="dg-form"/>
<text x="415" y="160" text-anchor="middle" dominant-baseline="middle">Gutschein einlösen</text>
<ellipse cx="410" cy="252" rx="75" ry="24" class="dg-form"/>
<text x="410" y="252" text-anchor="middle" dominant-baseline="middle">Ware versenden</text>
<line x1="78" y1="100" x2="170" y2="88" class="dg-linie"/>
<line x1="572" y1="222" x2="485" y2="250" class="dg-linie"/>
<line x1="258" y1="111" x2="244" y2="196" class="dg-linie dg-strich" marker-end="url(#uc-offen)"/>
<text x="258" y="158" text-anchor="start" dominant-baseline="middle" class="dg-klein">«include»</text>
<line x1="392" y1="135" x2="335" y2="103" class="dg-linie dg-strich" marker-end="url(#uc-offen)"/>
<text x="372" y="108" text-anchor="start" dominant-baseline="middle" class="dg-klein">«extend»</text>
</svg>
```

| Symbol | Bedeutung |
|---|---|
| **Akteur** | Strichmännchen – Person oder externes System außerhalb der Systemgrenze |
| **Anwendungsfall** | Ellipse mit Verb + Objekt |
| **Systemgrenze** | Rechteck mit dem Systemnamen |
| **«include»** | gestrichelter Pfeil vom Basisfall zum eingebundenen Fall – wird immer ausgeführt |
| **«extend»** | gestrichelter Pfeil vom erweiternden Fall zum Basisfall – nur unter einer Bedingung |

Prüfungsfalle: die Pfeilrichtung bei «extend». Merkhilfe: Der Pfeil zeigt immer auf den Fall, der „gebraucht“ (include) bzw. „erweitert“ (extend) wird.

## 2.3 Klassendiagramm

**Klassendiagramm** – zeigt Klassen mit Attributen und Methoden sowie ihre Beziehungen; Grundlage für Datenbank- und Programmentwurf.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 330" width="720" height="330" role="img" aria-label="UML-Klassendiagramm Kunde, Bestellung, Position, Artikel">
<defs><marker id="kl-dreieck" viewBox="0 0 14 14" markerWidth="14" markerHeight="14" refX="14" refY="7.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M1,1 L14,7.0 L1,13 z" class="dg-form"/></marker></defs>
<rect x="20" y="20" width="180" height="93" class="dg-form"/>
<text x="110" y="33" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Kunde</text>
<line x1="20" y1="46" x2="200" y2="46" class="dg-linie"/>
<line x1="20" y1="88" x2="200" y2="88" class="dg-linie"/>
<text x="28" y="58.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">- kundenNr: int</text>
<text x="28" y="75.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">- name: String</text>
<text x="28" y="100.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">+ bestellen(): Bestellung</text>
<rect x="300" y="20" width="190" height="93" class="dg-form"/>
<text x="395" y="33" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Bestellung</text>
<line x1="300" y1="46" x2="490" y2="46" class="dg-linie"/>
<line x1="300" y1="88" x2="490" y2="88" class="dg-linie"/>
<text x="308" y="58.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">- bestellNr: int</text>
<text x="308" y="75.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">- datum: Date</text>
<text x="308" y="100.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">+ summe(): double</text>
<rect x="300" y="205" width="190" height="76" class="dg-form"/>
<text x="395" y="218" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Position</text>
<line x1="300" y1="231" x2="490" y2="231" class="dg-linie"/>
<line x1="300" y1="256" x2="490" y2="256" class="dg-linie"/>
<text x="308" y="243.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">- menge: int</text>
<text x="308" y="268.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">+ betrag(): double</text>
<rect x="560" y="205" width="150" height="78" class="dg-form"/>
<text x="635" y="218" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Artikel</text>
<line x1="560" y1="231" x2="710" y2="231" class="dg-linie"/>
<line x1="560" y1="273" x2="710" y2="273" class="dg-linie"/>
<text x="568" y="243.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">- artikelNr: int</text>
<text x="568" y="260.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">- preis: double</text>
<rect x="10" y="215" width="120" height="61" class="dg-form"/>
<text x="70" y="228" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Privatkunde</text>
<line x1="10" y1="241" x2="130" y2="241" class="dg-linie"/>
<line x1="10" y1="266" x2="130" y2="266" class="dg-linie"/>
<text x="18" y="253.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">- geburtstag: Date</text>
<rect x="145" y="215" width="120" height="61" class="dg-form"/>
<text x="205" y="228" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Firmenkunde</text>
<line x1="145" y1="241" x2="265" y2="241" class="dg-linie"/>
<line x1="145" y1="266" x2="265" y2="266" class="dg-linie"/>
<text x="153" y="253.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">- ustId: String</text>
<path d="M70,215 L70,175 L205,175 L205,215" class="dg-linie"/>
<line x1="110" y1="175" x2="110" y2="113" class="dg-linie" marker-end="url(#kl-dreieck)"/>
<line x1="200" y1="60" x2="300" y2="60" class="dg-linie"/>
<text x="208" y="50" text-anchor="start" dominant-baseline="middle" class="dg-klein">1</text>
<text x="292" y="50" text-anchor="end" dominant-baseline="middle" class="dg-klein">0..*</text>
<text x="250" y="72" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-kursiv">erteilt ▸</text>
<polygon points="395,113 401,123 395,133 389,123" class="dg-voll"/>
<line x1="395" y1="133" x2="395" y2="205" class="dg-linie"/>
<text x="405" y="141" text-anchor="start" dominant-baseline="middle" class="dg-klein">1</text>
<text x="405" y="195" text-anchor="start" dominant-baseline="middle" class="dg-klein">1..*</text>
<line x1="490" y1="240" x2="560" y2="240" class="dg-linie"/>
<text x="497" y="230" text-anchor="start" dominant-baseline="middle" class="dg-klein">*</text>
<text x="553" y="230" text-anchor="end" dominant-baseline="middle" class="dg-klein">1</text>
<text x="10" y="318" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Sichtbarkeit: + public · - private · # protected · ~ package</text>
</svg>
```

| Element | Bedeutung |
|---|---|
| **Klasse** | Rechteck mit drei Abschnitten: Name, Attribute, Methoden |
| **Assoziation** | Linie, an den Enden Multiplizitäten wie 1, 0..1, 0..*, 1..* (Leserichtung wie Chen) |
| **Aggregation** | leere Raute am Ganzen – Teile existieren auch ohne das Ganze |
| **Komposition** | gefüllte Raute am Ganzen – Teile existieren nicht ohne das Ganze (Position ohne Bestellung) |
| **Generalisierung** | Linie mit leerem Dreieck zur Oberklasse – Vererbung („ist ein“) |

## 2.4 Aktivitätsdiagramm

**Aktivitätsdiagramm** – zeigt den Ablauf von Aktionen mit Verzweigungen und parallelen Abläufen; das UML-Gegenstück zum Programmablaufplan und zu BPMN.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 450" width="560" height="450" role="img" aria-label="UML-Aktivitätsdiagramm Bestellung bearbeiten">
<defs><marker id="ak-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<circle cx="280" cy="22" r="9" class="dg-voll"/>
<line x1="280" y1="31" x2="280" y2="50" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<rect x="200" y="50" width="160" height="36" rx="14" class="dg-form"/>
<text x="280" y="68" text-anchor="middle" dominant-baseline="middle">Bestellung annehmen</text>
<line x1="280" y1="86" x2="280" y2="107" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<polygon points="280,107 298,125 280,143 262,125" class="dg-form"/>
<line x1="280" y1="143" x2="280" y2="176" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<text x="290" y="160" text-anchor="start" dominant-baseline="middle" class="dg-klein">[verfügbar]</text>
<line x1="298" y1="125" x2="400" y2="125" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<text x="349" y="113" text-anchor="middle" dominant-baseline="middle" class="dg-klein">[nicht verfügbar]</text>
<rect x="400" y="107" width="140" height="36" rx="14" class="dg-form"/>
<text x="470" y="125" text-anchor="middle" dominant-baseline="middle">Absage senden</text>
<rect x="170" y="176" width="220" height="6" class="dg-voll"/>
<line x1="205" y1="182" x2="205" y2="205" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<line x1="355" y1="182" x2="355" y2="205" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<rect x="130" y="205" width="150" height="36" rx="14" class="dg-form"/>
<text x="205" y="223" text-anchor="middle" dominant-baseline="middle">Rechnung erstellen</text>
<rect x="290" y="205" width="150" height="36" rx="14" class="dg-form"/>
<text x="365" y="223" text-anchor="middle" dominant-baseline="middle">Ware kommissionieren</text>
<line x1="205" y1="241" x2="205" y2="266" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<line x1="355" y1="241" x2="355" y2="266" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<rect x="170" y="266" width="220" height="6" class="dg-voll"/>
<line x1="280" y1="272" x2="280" y2="295" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<rect x="200" y="295" width="160" height="36" rx="14" class="dg-form"/>
<text x="280" y="313" text-anchor="middle" dominant-baseline="middle">Ware versenden</text>
<line x1="280" y1="331" x2="280" y2="360" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<polygon points="280,360 298,378 280,396 262,378" class="dg-form"/>
<path d="M470,143 L470,378 L298,378" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<line x1="280" y1="396" x2="280" y2="418" class="dg-linie" marker-end="url(#ak-pfeil)"/>
<circle cx="280" cy="430" r="11" class="dg-form"/>
<circle cx="280" cy="430" r="6" class="dg-voll"/>
<text x="160" y="179" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">Gabelung (Fork)</text>
<text x="160" y="269" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">Vereinigung (Join)</text>
<text x="214" y="125" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">Verzweigung</text>
<text x="214" y="378" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">Zusammenführung</text>
</svg>
```

| Symbol | Bedeutung |
|---|---|
| **Startknoten** | gefüllter Kreis |
| **Aktion** | abgerundetes Rechteck |
| **Entscheidungsknoten** | Raute; an den ausgehenden Kanten Bedingungen in eckigen Klammern [verfügbar] |
| **Gabelung (Fork)** | Balken – danach laufen die Zweige parallel |
| **Vereinigung (Join)** | Balken – wartet, bis alle Zweige fertig sind |
| **Endknoten** | Kreis mit gefülltem Kreis innen |

Üben: [Diagramm-Übungen Aktivitätsdiagramm](#/diagramme?typ=aktivitaet) – Elemente einsetzen und Abläufe ordnen.

## 2.5 Sequenzdiagramm

**Sequenzdiagramm** – zeigt den zeitlichen Nachrichtenaustausch zwischen Beteiligten; die Zeit läuft von oben nach unten.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 380" width="640" height="380" role="img" aria-label="UML-Sequenzdiagramm Bestellung mit alt-Fragment">
<defs><marker id="sq-voll" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker><marker id="sq-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10" class="dg-linie"/></marker></defs>
<circle cx="80" cy="12" r="9" class="dg-form"/>
<line x1="80" y1="21" x2="80" y2="48" class="dg-linie"/>
<line x1="65" y1="30" x2="95" y2="30" class="dg-linie"/>
<line x1="80" y1="48" x2="68" y2="66" class="dg-linie"/>
<line x1="80" y1="48" x2="92" y2="66" class="dg-linie"/>
<text x="80" y="80" text-anchor="middle" dominant-baseline="middle">Kunde</text>
<rect x="245" y="20" width="110" height="34" class="dg-form"/>
<text x="300" y="37" text-anchor="middle" dominant-baseline="middle">:Webshop</text>
<rect x="465" y="20" width="110" height="34" class="dg-form"/>
<text x="520" y="37" text-anchor="middle" dominant-baseline="middle">:Lager</text>
<line x1="80" y1="92" x2="80" y2="372" class="dg-linie dg-strich"/>
<line x1="300" y1="54" x2="300" y2="372" class="dg-linie dg-strich"/>
<line x1="520" y1="54" x2="520" y2="372" class="dg-linie dg-strich"/>
<rect x="294" y="100" width="12" height="255" class="dg-grau"/>
<rect x="514" y="130" width="12" height="40" class="dg-grau"/>
<rect x="514" y="226" width="12" height="26" class="dg-grau"/>
<line x1="80" y1="100" x2="294" y2="100" class="dg-linie" marker-end="url(#sq-voll)"/>
<text x="187" y="90" text-anchor="middle" dominant-baseline="middle" class="dg-klein">bestellen(artikel, menge)</text>
<line x1="306" y1="130" x2="514" y2="130" class="dg-linie" marker-end="url(#sq-voll)"/>
<text x="410" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-klein">pruefeBestand(artikel)</text>
<line x1="514" y1="170" x2="306" y2="170" class="dg-linie dg-strich" marker-end="url(#sq-offen)"/>
<text x="410" y="160" text-anchor="middle" dominant-baseline="middle" class="dg-klein">verfügbar</text>
<rect x="120" y="190" width="480" height="165" class="dg-linie"/>
<polygon points="120,190 160,190 160,202 152,210 120,210" class="dg-grau"/>
<text x="140" y="200" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">alt</text>
<text x="170" y="202" text-anchor="start" dominant-baseline="middle" class="dg-klein">[verfügbar]</text>
<line x1="120" y1="300" x2="600" y2="300" class="dg-linie dg-strich"/>
<text x="130" y="312" text-anchor="start" dominant-baseline="middle" class="dg-klein">[sonst]</text>
<line x1="306" y1="226" x2="514" y2="226" class="dg-linie" marker-end="url(#sq-voll)"/>
<text x="410" y="216" text-anchor="middle" dominant-baseline="middle" class="dg-klein">reservieren(artikel, menge)</text>
<line x1="514" y1="252" x2="306" y2="252" class="dg-linie dg-strich" marker-end="url(#sq-offen)"/>
<text x="410" y="243" text-anchor="middle" dominant-baseline="middle" class="dg-klein">ok</text>
<line x1="294" y1="280" x2="80" y2="280" class="dg-linie dg-strich" marker-end="url(#sq-offen)"/>
<text x="187" y="270" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellbestätigung</text>
<line x1="294" y1="335" x2="80" y2="335" class="dg-linie dg-strich" marker-end="url(#sq-offen)"/>
<text x="187" y="325" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Absage</text>
</svg>
```

| Element | Bedeutung |
|---|---|
| **Lebenslinie** | gestrichelte Senkrechte unter jedem Beteiligten |
| **Aktivierungsbalken** | schmaler Balken – der Beteiligte arbeitet gerade |
| **Synchrone Nachricht** | durchgezogener Pfeil mit gefüllter Spitze – der Sender wartet auf die Antwort |
| **Antwortnachricht** | gestrichelter Pfeil mit offener Spitze |
| **Asynchrone Nachricht** | durchgezogener Pfeil mit offener Spitze – der Sender wartet nicht |
| **Kombiniertes Fragment** | Rahmen mit Operator: alt (Alternativen), opt (optional), loop (Wiederholung), par (parallel) |

Üben: [Diagramm-Übungen Sequenzdiagramm](#/diagramme?typ=sequenz) – Elemente einsetzen und Abläufe ordnen.

## 2.6 Zustandsdiagramm

**Zustandsdiagramm** – zeigt die Zustände eines einzelnen Objekts und die Übergänge dazwischen (Zustandsautomat).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 255" width="700" height="255" role="img" aria-label="UML-Zustandsdiagramm einer Bestellung">
<defs><marker id="zs-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<circle cx="30" cy="70" r="9" class="dg-voll"/>
<line x1="39" y1="70" x2="70" y2="70" class="dg-linie" marker-end="url(#zs-pfeil)"/>
<rect x="70" y="50" width="100" height="40" rx="14" class="dg-form"/>
<text x="120" y="70" text-anchor="middle" dominant-baseline="middle">Neu</text>
<line x1="170" y1="70" x2="290" y2="70" class="dg-linie" marker-end="url(#zs-pfeil)"/>
<text x="230" y="58" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Zahlung eingegangen</text>
<rect x="290" y="50" width="100" height="40" rx="14" class="dg-form"/>
<text x="340" y="70" text-anchor="middle" dominant-baseline="middle">Bezahlt</text>
<line x1="390" y1="70" x2="530" y2="70" class="dg-linie" marker-end="url(#zs-pfeil)"/>
<text x="460" y="58" text-anchor="middle" dominant-baseline="middle" class="dg-klein">versenden / Mail senden</text>
<rect x="530" y="50" width="100" height="40" rx="14" class="dg-form"/>
<text x="580" y="70" text-anchor="middle" dominant-baseline="middle">Versandt</text>
<line x1="580" y1="90" x2="580" y2="170" class="dg-linie" marker-end="url(#zs-pfeil)"/>
<text x="588" y="130" text-anchor="start" dominant-baseline="middle" class="dg-klein">Zustellung bestätigt</text>
<rect x="530" y="170" width="100" height="40" rx="14" class="dg-form"/>
<text x="580" y="190" text-anchor="middle" dominant-baseline="middle">Zugestellt</text>
<line x1="630" y1="190" x2="660" y2="190" class="dg-linie" marker-end="url(#zs-pfeil)"/>
<circle cx="672" cy="190" r="11" class="dg-form"/>
<circle cx="672" cy="190" r="6" class="dg-voll"/>
<line x1="120" y1="90" x2="120" y2="170" class="dg-linie" marker-end="url(#zs-pfeil)"/>
<text x="128" y="122" text-anchor="start" dominant-baseline="middle" class="dg-klein">stornieren</text>
<text x="128" y="137" text-anchor="start" dominant-baseline="middle" class="dg-klein">[nicht bezahlt]</text>
<rect x="70" y="170" width="100" height="40" rx="14" class="dg-form"/>
<text x="120" y="190" text-anchor="middle" dominant-baseline="middle">Storniert</text>
<line x1="170" y1="190" x2="230" y2="190" class="dg-linie" marker-end="url(#zs-pfeil)"/>
<circle cx="242" cy="190" r="11" class="dg-form"/>
<circle cx="242" cy="190" r="6" class="dg-voll"/>
<text x="300" y="240" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Beschriftung eines Übergangs: Ereignis [Bedingung] / Aktion</text>
</svg>
```

Für Datenanalysten wichtig: Das Zustandsdiagramm liefert die erlaubten Werte einer Statusspalte und die erlaubten Übergänge – Grundlage für Plausibilitätsprüfungen (eine Bestellung springt nicht von „Storniert“ auf „Versandt“).

> ❓ **Prüferfrage:** Aktivitäts-, Sequenz- oder Zustandsdiagramm – welches wählen Sie, um den Ablauf eines API-Aufrufs zwischen Webshop und Lagersystem zu dokumentieren?
> *Das Sequenzdiagramm: Es zeigt, wer wem in welcher Reihenfolge welche Nachricht schickt und wer auf eine Antwort wartet. Das Aktivitätsdiagramm zeigt Tätigkeiten ohne Nachrichten, das Zustandsdiagramm den Lebenszyklus eines einzelnen Objekts.*

Üben: [Diagramm-Übungen Zustandsdiagramm](#/diagramme?typ=zustand) – Elemente einsetzen und Abläufe ordnen.

---

# Teil 3 – Datenmodelle

## 3.1 ER-Diagramm in Chen-Notation

**Chen-Notation** – ursprüngliche ER-Notation: Entitätstypen als Rechtecke, Beziehungstypen als Rauten, Attribute als Ellipsen, Schlüsselattribute unterstrichen; an den Linien stehen nur die Maximalwerte (1, n, m).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 220" width="660" height="220" role="img" aria-label="ER-Diagramm in Chen-Notation: Kunde erteilt Bestellung">
<rect x="40" y="95" width="120" height="40" class="dg-form"/>
<text x="100" y="115" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Kunde</text>
<polygon points="320,83 380,115 320,147 260,115" class="dg-form"/>
<text x="320" y="115" text-anchor="middle" dominant-baseline="middle">erteilt</text>
<rect x="480" y="95" width="130" height="40" class="dg-form"/>
<text x="545" y="115" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Bestellung</text>
<line x1="160" y1="115" x2="260" y2="115" class="dg-linie"/>
<line x1="380" y1="115" x2="480" y2="115" class="dg-linie"/>
<text x="172" y="104" text-anchor="start" dominant-baseline="middle" class="dg-fett">1</text>
<text x="468" y="104" text-anchor="end" dominant-baseline="middle" class="dg-fett">n</text>
<line x1="55" y1="53" x2="80" y2="95" class="dg-linie"/>
<ellipse cx="55" cy="35" rx="52" ry="18" class="dg-form"/>
<text x="55" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">KundenNr</text>
<line x1="30.2" y1="43" x2="79.8" y2="43" class="dg-linie dg-duenn"/>
<line x1="165" y1="53" x2="130" y2="95" class="dg-linie"/>
<ellipse cx="165" cy="35" rx="52" ry="18" class="dg-form"/>
<text x="165" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Name</text>
<line x1="100" y1="172" x2="100" y2="135" class="dg-linie"/>
<ellipse cx="100" cy="190" rx="52" ry="18" class="dg-form"/>
<text x="100" y="190" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ort</text>
<line x1="485" y1="53" x2="515" y2="95" class="dg-linie"/>
<ellipse cx="485" cy="35" rx="52" ry="18" class="dg-form"/>
<text x="485" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">BestellNr</text>
<line x1="457.1" y1="43" x2="512.9" y2="43" class="dg-linie dg-duenn"/>
<line x1="600" y1="53" x2="580" y2="95" class="dg-linie"/>
<ellipse cx="600" cy="35" rx="52" ry="18" class="dg-form"/>
<text x="600" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Datum</text>
<line x1="320" y1="53" x2="320" y2="83" class="dg-linie"/>
<ellipse cx="320" cy="35" rx="52" ry="18" class="dg-form"/>
<text x="320" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellweg</text>
</svg>
```

Lesen: Ein Kunde erteilt n Bestellungen, eine Bestellung wird von 1 Kunden erteilt → 1 : n. Das Attribut „Bestellweg“ gehört zur Beziehung.

## 3.2 Min-Max-Notation

**Min-Max-Notation** – ER-Notation mit Wertepaaren (min, max) an jeder Linie; die Angabe steht bei der Entität, deren Beteiligung sie beschreibt.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 160" width="660" height="160" role="img" aria-label="ER-Diagramm in Min-Max-Notation">
<rect x="40" y="30" width="120" height="40" class="dg-form"/>
<text x="100" y="50" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Kunde</text>
<polygon points="320,20 380,50 320,80 260,50" class="dg-form"/>
<text x="320" y="50" text-anchor="middle" dominant-baseline="middle">erteilt</text>
<rect x="480" y="30" width="130" height="40" class="dg-form"/>
<text x="545" y="50" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Bestellung</text>
<line x1="160" y1="50" x2="260" y2="50" class="dg-linie"/>
<line x1="380" y1="50" x2="480" y2="50" class="dg-linie"/>
<text x="172" y="38" text-anchor="start" dominant-baseline="middle" class="dg-fett">(0,n)</text>
<text x="468" y="38" text-anchor="end" dominant-baseline="middle" class="dg-fett">(1,1)</text>
<text x="40" y="105" text-anchor="start" dominant-baseline="middle" class="dg-klein">Ein Kunde nimmt an 0 bis n „erteilt“-Beziehungen teil (er kann ohne Bestellung existieren).</text>
<text x="40" y="125" text-anchor="start" dominant-baseline="middle" class="dg-klein">Eine Bestellung nimmt an genau 1 Beziehung teil (sie gehört zu genau einem Kunden).</text>
<text x="40" y="145" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">→ Die Angabe steht bei der Entität, deren Beteiligung sie beschreibt – umgekehrt zu Chen (1 : n).</text>
</svg>
```

Prüfungsfalle: Die Min-Max-Angaben stehen „vertauscht“ gegenüber Chen. (0,n) am Kunden heißt nicht „n Kunden“, sondern „ein Kunde ist an 0 bis n Beziehungen beteiligt“.

## 3.3 Krähenfuß-Notation

**Krähenfußnotation** – ER-Notation (Martin, Information Engineering), bei der zwei Zeichen am Linienende die Kardinalität angeben: das Zeichen an der Entität das Maximum, das äußere das Minimum.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 210" width="660" height="210" role="img" aria-label="Krähenfuß-Notation mit Legende">
<rect x="40" y="30" width="130" height="44" class="dg-form"/>
<text x="105" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-fett">KUNDE</text>
<rect x="470" y="30" width="150" height="44" class="dg-form"/>
<text x="545" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-fett">BESTELLUNG</text>
<line x1="170" y1="52" x2="470" y2="52" class="dg-linie"/>
<line x1="178" y1="42" x2="178" y2="62" class="dg-linie"/>
<line x1="194" y1="42" x2="194" y2="62" class="dg-linie"/>
<line x1="454" y1="52" x2="470" y2="41" class="dg-linie"/>
<line x1="454" y1="52" x2="470" y2="52" class="dg-linie"/>
<line x1="454" y1="52" x2="470" y2="63" class="dg-linie"/>
<circle cx="444" cy="52" r="6" class="dg-form"/>
<text x="320" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-kursiv">erteilt</text>
<text x="40" y="100" text-anchor="start" dominant-baseline="middle" class="dg-klein">Leserichtung wie Chen: Ein Kunde hat null bis viele Bestellungen, jede Bestellung genau einen Kunden.</text>
<line x1="40" y1="140" x2="100" y2="140" class="dg-linie"/>
<rect x="100" y="128" width="10" height="24" class="dg-grau"/>
<line x1="92" y1="130" x2="92" y2="150" class="dg-linie"/>
<line x1="76" y1="130" x2="76" y2="150" class="dg-linie"/>
<text x="75" y="166" text-anchor="middle" dominant-baseline="middle" class="dg-klein">genau eins (1,1)</text>
<line x1="190" y1="140" x2="250" y2="140" class="dg-linie"/>
<rect x="250" y="128" width="10" height="24" class="dg-grau"/>
<line x1="242" y1="130" x2="242" y2="150" class="dg-linie"/>
<circle cx="224" cy="140" r="6" class="dg-form"/>
<text x="225" y="166" text-anchor="middle" dominant-baseline="middle" class="dg-klein">null oder eins (0,1)</text>
<line x1="340" y1="140" x2="400" y2="140" class="dg-linie"/>
<rect x="400" y="128" width="10" height="24" class="dg-grau"/>
<line x1="384" y1="140" x2="400" y2="129" class="dg-linie"/>
<line x1="384" y1="140" x2="400" y2="140" class="dg-linie"/>
<line x1="384" y1="140" x2="400" y2="151" class="dg-linie"/>
<line x1="376" y1="130" x2="376" y2="150" class="dg-linie"/>
<text x="375" y="166" text-anchor="middle" dominant-baseline="middle" class="dg-klein">eins bis viele (1,n)</text>
<line x1="490" y1="140" x2="550" y2="140" class="dg-linie"/>
<rect x="550" y="128" width="10" height="24" class="dg-grau"/>
<line x1="534" y1="140" x2="550" y2="129" class="dg-linie"/>
<line x1="534" y1="140" x2="550" y2="140" class="dg-linie"/>
<line x1="534" y1="140" x2="550" y2="151" class="dg-linie"/>
<circle cx="524" cy="140" r="6" class="dg-form"/>
<text x="525" y="166" text-anchor="middle" dominant-baseline="middle" class="dg-klein">null bis viele (0,n)</text>
<text x="40" y="196" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Zeichen direkt an der Entität = Maximum (Strich = 1, Krähenfuß = viele) · weiter außen = Minimum (Kreis = 0, Strich = 1)</text>
</svg>
```

## 3.4 Star-Schema

**Star-Schema** – Datenmodell im Data Warehouse: eine zentrale Faktentabelle mit Kennzahlen und Fremdschlüsseln, umgeben von denormalisierten Dimensionstabellen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 375" width="680" height="375" role="img" aria-label="Star-Schema mit Faktentabelle und vier Dimensionen">
<rect x="250" y="110" width="180" height="134" class="dg-akzent"/>
<line x1="250" y1="134" x2="430" y2="134" class="dg-linie"/>
<text x="340" y="122" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Fakt_Verkauf</text>
<text x="258" y="146.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">datum_id (FK)</text>
<text x="258" y="163.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">produkt_id (FK)</text>
<text x="258" y="180.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">filiale_id (FK)</text>
<text x="258" y="197.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">kunde_id (FK)</text>
<text x="258" y="214.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">menge</text>
<text x="258" y="231.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">umsatz</text>
<line x1="190" y1="56.5" x2="250" y2="130" class="dg-linie"/>
<rect x="20" y="15" width="170" height="83" class="dg-form"/>
<line x1="20" y1="39" x2="190" y2="39" class="dg-linie"/>
<text x="105" y="27" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Dim_Zeit</text>
<text x="28" y="51.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">datum_id (PK)</text>
<text x="28" y="68.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">tag, monat</text>
<text x="28" y="85.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">quartal, jahr</text>
<line x1="490" y1="56.5" x2="430" y2="130" class="dg-linie"/>
<rect x="490" y="15" width="170" height="83" class="dg-form"/>
<line x1="490" y1="39" x2="660" y2="39" class="dg-linie"/>
<text x="575" y="27" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Dim_Produkt</text>
<text x="498" y="51.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">produkt_id (PK)</text>
<text x="498" y="68.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">name, marke</text>
<text x="498" y="85.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">kategorie</text>
<line x1="190" y1="296.5" x2="250" y2="225" class="dg-linie"/>
<rect x="20" y="255" width="170" height="83" class="dg-form"/>
<line x1="20" y1="279" x2="190" y2="279" class="dg-linie"/>
<text x="105" y="267" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Dim_Filiale</text>
<text x="28" y="291.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">filiale_id (PK)</text>
<text x="28" y="308.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">ort</text>
<text x="28" y="325.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">region</text>
<line x1="490" y1="296.5" x2="430" y2="225" class="dg-linie"/>
<rect x="490" y="255" width="170" height="83" class="dg-form"/>
<line x1="490" y1="279" x2="660" y2="279" class="dg-linie"/>
<text x="575" y="267" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Dim_Kunde</text>
<text x="498" y="291.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">kunde_id (PK)</text>
<text x="498" y="308.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">name</text>
<text x="498" y="325.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">segment</text>
<text x="340" y="360" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Dimensionen denormalisiert, direkt am Fakt · Beziehung Dimension : Fakt = 1 : n</text>
</svg>
```

Vorteil: wenige Joins, schnelle Auswertungen und für Fachanwender verständlich. Nachteil: Redundanz in den Dimensionen (die Kategorie steht bei jedem Produkt).

## 3.5 Snowflake-Schema

**Snowflake-Schema** – Variante des Star-Schemas, bei der Dimensionen normalisiert und in weitere Tabellen ausgelagert sind.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 325" width="680" height="325" role="img" aria-label="Snowflake-Schema mit ausgelagerten Dimensionen">
<rect x="255" y="120" width="170" height="100" class="dg-akzent"/>
<line x1="255" y1="144" x2="425" y2="144" class="dg-linie"/>
<text x="340" y="132" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Fakt_Verkauf</text>
<text x="263" y="156.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">datum_id (FK)</text>
<text x="263" y="173.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">produkt_id (FK)</text>
<text x="263" y="190.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">filiale_id (FK)</text>
<text x="263" y="207.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">umsatz</text>
<line x1="190" y1="61.5" x2="255" y2="150" class="dg-linie"/>
<rect x="20" y="20" width="170" height="83" class="dg-form"/>
<line x1="20" y1="44" x2="190" y2="44" class="dg-linie"/>
<text x="105" y="32" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Dim_Filiale</text>
<text x="28" y="56.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">filiale_id (PK)</text>
<text x="28" y="73.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">ort</text>
<text x="28" y="90.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">region_id (FK)</text>
<line x1="490" y1="61.5" x2="425" y2="150" class="dg-linie"/>
<rect x="490" y="20" width="170" height="83" class="dg-form"/>
<line x1="490" y1="44" x2="660" y2="44" class="dg-linie"/>
<text x="575" y="32" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Dim_Produkt</text>
<text x="498" y="56.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">produkt_id (PK)</text>
<text x="498" y="73.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">name</text>
<text x="498" y="90.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">kategorie_id (FK)</text>
<rect x="255" y="15" width="170" height="66" class="dg-form"/>
<line x1="255" y1="39" x2="425" y2="39" class="dg-linie"/>
<text x="340" y="27" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Dim_Zeit</text>
<text x="263" y="51.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">datum_id (PK)</text>
<text x="263" y="68.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">monat, jahr</text>
<line x1="340" y1="81" x2="340" y2="120" class="dg-linie"/>
<line x1="105" y1="103" x2="105" y2="215" class="dg-linie"/>
<rect x="20" y="215" width="170" height="66" class="dg-grau"/>
<line x1="20" y1="239" x2="190" y2="239" class="dg-linie"/>
<text x="105" y="227" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Dim_Region</text>
<text x="28" y="251.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">region_id (PK)</text>
<text x="28" y="268.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">name, land</text>
<line x1="575" y1="103" x2="575" y2="215" class="dg-linie"/>
<rect x="490" y="215" width="170" height="66" class="dg-grau"/>
<line x1="490" y1="239" x2="660" y2="239" class="dg-linie"/>
<text x="575" y="227" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Dim_Kategorie</text>
<text x="498" y="251.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">kategorie_id (PK)</text>
<text x="498" y="268.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">bezeichnung</text>
<text x="340" y="310" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Dimensionen normalisiert (Region, Kategorie ausgelagert): weniger Redundanz, aber mehr Joins</text>
</svg>
```

Prüfungsfalle: Snowflake ist nicht „besser normalisiert = besser“. Im DWH zählt die Abfragegeschwindigkeit; die zusätzlichen Joins kosten Zeit, deshalb ist das Star-Schema der Normalfall.

> ❓ **Prüferfrage:** Ein Kunde kann null bis viele Bestellungen haben, jede Bestellung gehört zu genau einem Kunden. Welche Zeichen stehen in Krähenfußnotation an den beiden Linienenden?
> *Am Ende bei BESTELLUNG: Kreis (Minimum 0) und Krähenfuß (Maximum viele). Am Ende bei KUNDE: zwei Striche – Minimum 1 und Maximum 1, also genau eins.*

---

# Teil 4 – Algorithmen darstellen

## 4.1 Programmablaufplan (PAP)

**Programmablaufplan** – Flussdiagramm nach DIN 66001, das einen Algorithmus mit genormten Symbolen und Ablauflinien darstellt.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 470" width="520" height="470" role="img" aria-label="Programmablaufplan nach DIN 66001: Rabatt berechnen">
<defs><marker id="pap-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<rect x="150" y="10" width="100" height="32" rx="16" class="dg-form"/>
<text x="200" y="26" text-anchor="middle" dominant-baseline="middle">Start</text>
<line x1="200" y1="42" x2="200" y2="62" class="dg-linie" marker-end="url(#pap-pfeil)"/>
<polygon points="117,62 307,62 283,96 93,96" class="dg-form"/>
<text x="200" y="79" text-anchor="middle" dominant-baseline="middle">Eingabe: betrag</text>
<line x1="200" y1="96" x2="200" y2="120" class="dg-linie" marker-end="url(#pap-pfeil)"/>
<polygon points="200,120 295,158 200,196 105,158" class="dg-form"/>
<text x="200" y="158" text-anchor="middle" dominant-baseline="middle">betrag &gt; 1000?</text>
<line x1="295" y1="158" x2="320" y2="158" class="dg-linie" marker-end="url(#pap-pfeil)"/>
<text x="306" y="148" text-anchor="middle" dominant-baseline="middle" class="dg-klein">ja</text>
<rect x="320" y="140" width="180" height="36" class="dg-form"/>
<text x="410" y="158" text-anchor="middle" dominant-baseline="middle">rabatt ← betrag · 0,05</text>
<line x1="200" y1="196" x2="200" y2="222" class="dg-linie" marker-end="url(#pap-pfeil)"/>
<text x="210" y="208" text-anchor="start" dominant-baseline="middle" class="dg-klein">nein</text>
<rect x="130" y="222" width="140" height="36" class="dg-form"/>
<text x="200" y="240" text-anchor="middle" dominant-baseline="middle">rabatt ← 0</text>
<line x1="200" y1="258" x2="200" y2="290" class="dg-linie"/>
<path d="M410,176 L410,290 L200,290" class="dg-linie"/>
<line x1="200" y1="290" x2="200" y2="310" class="dg-linie" marker-end="url(#pap-pfeil)"/>
<rect x="100" y="310" width="200" height="36" class="dg-form"/>
<text x="200" y="328" text-anchor="middle" dominant-baseline="middle">endbetrag ← betrag − rabatt</text>
<line x1="200" y1="346" x2="200" y2="370" class="dg-linie" marker-end="url(#pap-pfeil)"/>
<polygon points="107,370 317,370 293,404 83,404" class="dg-form"/>
<text x="200" y="387" text-anchor="middle" dominant-baseline="middle">Ausgabe: endbetrag</text>
<line x1="200" y1="404" x2="200" y2="428" class="dg-linie" marker-end="url(#pap-pfeil)"/>
<rect x="150" y="428" width="100" height="32" rx="16" class="dg-form"/>
<text x="200" y="444" text-anchor="middle" dominant-baseline="middle">Ende</text>
</svg>
```

| Symbol | Bedeutung |
|---|---|
| **Grenzstelle** | abgerundetes Rechteck oder Oval: Start, Ende |
| **Operation** | Rechteck: Anweisung, Zuweisung |
| **Verzweigung** | Raute mit Bedingung; Ausgänge mit ja/nein beschriften |
| **Ein-/Ausgabe** | Parallelogramm |
| **Unterprogramm** | Rechteck mit doppelten senkrechten Kanten |
| **Übergangsstelle** | Kreis – verbindet Teile über Seiten hinweg |

Ablauflinien laufen von oben nach unten und von links nach rechts; nur Abweichungen davon brauchen eine Pfeilspitze, in der Prüfung schadet ein Pfeil aber nie.

## 4.2 Struktogramm

**Struktogramm** – Nassi-Shneiderman-Diagramm nach DIN 66261: Der Algorithmus ist ein Rechteck aus ineinander geschachtelten Strukturblöcken; beliebige Sprünge (GOTO) lassen sich nicht darstellen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 305" width="560" height="305" role="img" aria-label="Struktogramm nach DIN 66261: Aufträge über 1.000 Euro zählen">
<rect x="20" y="20" width="440" height="270" class="dg-form"/>
<line x1="20" y1="50" x2="460" y2="50" class="dg-linie"/>
<text x="30" y="35" text-anchor="start" dominant-baseline="middle">zaehler ← 0</text>
<line x1="20" y1="80" x2="460" y2="80" class="dg-linie"/>
<text x="30" y="65" text-anchor="start" dominant-baseline="middle">Eingabe: n, betrag[1..n]</text>
<text x="30" y="95" text-anchor="start" dominant-baseline="middle" class="dg-fett">für i ← 1 bis n</text>
<line x1="50" y1="110" x2="460" y2="110" class="dg-linie"/>
<line x1="50" y1="110" x2="50" y2="230" class="dg-linie"/>
<line x1="20" y1="230" x2="460" y2="230" class="dg-linie"/>
<line x1="50" y1="110" x2="260" y2="160" class="dg-linie"/>
<line x1="460" y1="110" x2="260" y2="160" class="dg-linie"/>
<line x1="50" y1="160" x2="460" y2="160" class="dg-linie"/>
<line x1="260" y1="160" x2="260" y2="230" class="dg-linie"/>
<text x="260" y="128" text-anchor="middle" dominant-baseline="middle">betrag[i] &gt; 1000 ?</text>
<text x="62" y="150" text-anchor="start" dominant-baseline="middle" class="dg-klein">ja</text>
<text x="450" y="150" text-anchor="end" dominant-baseline="middle" class="dg-klein">nein</text>
<text x="155" y="195" text-anchor="middle" dominant-baseline="middle">zaehler ← zaehler + 1</text>
<text x="360" y="195" text-anchor="middle" dominant-baseline="middle">∅</text>
<text x="30" y="260" text-anchor="start" dominant-baseline="middle">Ausgabe: zaehler</text>
<text x="468" y="35" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Anweisung</text>
<text x="468" y="95" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Zählschleife</text>
<text x="468" y="135" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Verzweigung</text>
<text x="468" y="195" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Rumpf</text>
</svg>
```

| Strukturblock | Darstellung |
|---|---|
| **Sequenz** | Rechtecke untereinander |
| **Verzweigung** | Kopf mit zwei Diagonalen, Bedingung oben, darunter ja- und nein-Spalte (leerer Zweig: ∅) |
| **Mehrfachverzweigung** | wie Verzweigung mit mehreren Spalten (Fallauswahl) |
| **Kopfgesteuerte Schleife** | Bedingung oben, Rumpf eingerückt (L-Form) – auch für Zählschleifen |
| **Fußgesteuerte Schleife** | Rumpf oben, Bedingung unten (umgedrehtes L) – mindestens ein Durchlauf |

> ❓ **Prüferfrage:** Worin unterscheiden sich kopf- und fußgesteuerte Schleife im Struktogramm, und wann wählen Sie welche?
> *Die kopfgesteuerte Schleife prüft die Bedingung vor dem Rumpf (Balken links mit Bedingung oben) und läuft eventuell gar nicht. Die fußgesteuerte prüft nach dem Rumpf (Bedingung unten) und läuft mindestens einmal – z. B. für eine Eingabe, die so lange wiederholt wird, bis sie gültig ist.*

---

# Teil 5 – Projektmanagement

## 5.1 Netzplan

**Netzplan** – Darstellung der Vorgänge eines Projekts mit Abhängigkeiten und Zeitwerten (hier als Vorgangsknotennetz); aus ihm ergeben sich Projektdauer, Puffer und kritischer Pfad.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 315" width="680" height="315" role="img" aria-label="Netzplan (Vorgangsknotennetz) mit kritischem Pfad">
<defs><marker id="np-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<rect x="20" y="108" width="150" height="84" class="dg-akzent"/>
<line x1="20" y1="136" x2="170" y2="136" class="dg-linie"/>
<line x1="20" y1="164" x2="170" y2="164" class="dg-linie"/>
<line x1="70" y1="108" x2="70" y2="136" class="dg-linie"/>
<line x1="70" y1="164" x2="70" y2="192" class="dg-linie"/>
<line x1="120" y1="108" x2="120" y2="136" class="dg-linie"/>
<line x1="120" y1="164" x2="120" y2="192" class="dg-linie"/>
<text x="45" y="122" text-anchor="middle" dominant-baseline="middle">0</text>
<text x="95" y="122" text-anchor="middle" dominant-baseline="middle">3</text>
<text x="145" y="122" text-anchor="middle" dominant-baseline="middle">3</text>
<text x="95" y="150" text-anchor="middle" dominant-baseline="middle" class="dg-fett">A Anforderungen</text>
<text x="45" y="178" text-anchor="middle" dominant-baseline="middle">0</text>
<text x="95" y="178" text-anchor="middle" dominant-baseline="middle">0</text>
<text x="145" y="178" text-anchor="middle" dominant-baseline="middle">3</text>
<rect x="260" y="20" width="150" height="84" class="dg-akzent"/>
<line x1="260" y1="48" x2="410" y2="48" class="dg-linie"/>
<line x1="260" y1="76" x2="410" y2="76" class="dg-linie"/>
<line x1="310" y1="20" x2="310" y2="48" class="dg-linie"/>
<line x1="310" y1="76" x2="310" y2="104" class="dg-linie"/>
<line x1="360" y1="20" x2="360" y2="48" class="dg-linie"/>
<line x1="360" y1="76" x2="360" y2="104" class="dg-linie"/>
<text x="285" y="34" text-anchor="middle" dominant-baseline="middle">3</text>
<text x="335" y="34" text-anchor="middle" dominant-baseline="middle">4</text>
<text x="385" y="34" text-anchor="middle" dominant-baseline="middle">7</text>
<text x="335" y="62" text-anchor="middle" dominant-baseline="middle" class="dg-fett">B Daten aufbereiten</text>
<text x="285" y="90" text-anchor="middle" dominant-baseline="middle">3</text>
<text x="335" y="90" text-anchor="middle" dominant-baseline="middle">0</text>
<text x="385" y="90" text-anchor="middle" dominant-baseline="middle">7</text>
<rect x="260" y="196" width="150" height="84" class="dg-form"/>
<line x1="260" y1="224" x2="410" y2="224" class="dg-linie"/>
<line x1="260" y1="252" x2="410" y2="252" class="dg-linie"/>
<line x1="310" y1="196" x2="310" y2="224" class="dg-linie"/>
<line x1="310" y1="252" x2="310" y2="280" class="dg-linie"/>
<line x1="360" y1="196" x2="360" y2="224" class="dg-linie"/>
<line x1="360" y1="252" x2="360" y2="280" class="dg-linie"/>
<text x="285" y="210" text-anchor="middle" dominant-baseline="middle">3</text>
<text x="335" y="210" text-anchor="middle" dominant-baseline="middle">2</text>
<text x="385" y="210" text-anchor="middle" dominant-baseline="middle">5</text>
<text x="335" y="238" text-anchor="middle" dominant-baseline="middle">C Dashboard-Entwurf</text>
<text x="285" y="266" text-anchor="middle" dominant-baseline="middle">5</text>
<text x="335" y="266" text-anchor="middle" dominant-baseline="middle">2</text>
<text x="385" y="266" text-anchor="middle" dominant-baseline="middle">7</text>
<rect x="500" y="108" width="150" height="84" class="dg-akzent"/>
<line x1="500" y1="136" x2="650" y2="136" class="dg-linie"/>
<line x1="500" y1="164" x2="650" y2="164" class="dg-linie"/>
<line x1="550" y1="108" x2="550" y2="136" class="dg-linie"/>
<line x1="550" y1="164" x2="550" y2="192" class="dg-linie"/>
<line x1="600" y1="108" x2="600" y2="136" class="dg-linie"/>
<line x1="600" y1="164" x2="600" y2="192" class="dg-linie"/>
<text x="525" y="122" text-anchor="middle" dominant-baseline="middle">7</text>
<text x="575" y="122" text-anchor="middle" dominant-baseline="middle">1</text>
<text x="625" y="122" text-anchor="middle" dominant-baseline="middle">8</text>
<text x="575" y="150" text-anchor="middle" dominant-baseline="middle" class="dg-fett">D Test</text>
<text x="525" y="178" text-anchor="middle" dominant-baseline="middle">7</text>
<text x="575" y="178" text-anchor="middle" dominant-baseline="middle">0</text>
<text x="625" y="178" text-anchor="middle" dominant-baseline="middle">8</text>
<path d="M170,130 L215,130 L215,62 L260,62" class="dg-linie dg-dick" marker-end="url(#np-pfeil)"/>
<path d="M170,170 L215,170 L215,238 L260,238" class="dg-linie" marker-end="url(#np-pfeil)"/>
<path d="M410,62 L455,62 L455,130 L500,130" class="dg-linie dg-dick" marker-end="url(#np-pfeil)"/>
<path d="M410,238 L455,238 L455,170 L500,170" class="dg-linie" marker-end="url(#np-pfeil)"/>
<rect x="520" y="222" width="150" height="84" class="dg-grau"/>
<line x1="520" y1="250" x2="670" y2="250" class="dg-linie"/>
<line x1="520" y1="278" x2="670" y2="278" class="dg-linie"/>
<line x1="570" y1="222" x2="570" y2="250" class="dg-linie"/>
<line x1="570" y1="278" x2="570" y2="306" class="dg-linie"/>
<line x1="620" y1="222" x2="620" y2="250" class="dg-linie"/>
<line x1="620" y1="278" x2="620" y2="306" class="dg-linie"/>
<text x="545" y="236" text-anchor="middle" dominant-baseline="middle" class="dg-klein">FAZ</text>
<text x="595" y="236" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Dauer</text>
<text x="645" y="236" text-anchor="middle" dominant-baseline="middle" class="dg-klein">FEZ</text>
<text x="595" y="264" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Nr. Vorgang</text>
<text x="545" y="292" text-anchor="middle" dominant-baseline="middle" class="dg-klein">SAZ</text>
<text x="595" y="292" text-anchor="middle" dominant-baseline="middle" class="dg-klein">GP</text>
<text x="645" y="292" text-anchor="middle" dominant-baseline="middle" class="dg-klein">SEZ</text>
<text x="20" y="300" text-anchor="start" dominant-baseline="middle" class="dg-fett">Kritischer Pfad A → B → D (GP = 0), Projektdauer 8 Tage · C hat 2 Tage Puffer</text>
</svg>
```

Beispiel: A (3 Tage) vor B (4) und C (2), beide vor D (1). Vorwärts: FEZ = FAZ + Dauer, FAZ = größtes FEZ der Vorgänger. Rückwärts: SAZ = SEZ − Dauer, SEZ = kleinstes SAZ der Nachfolger. C: GP = 5 − 3 = 2 Tage, FP = 7 − 5 = 2 Tage. Der Knotenaufbau ist nicht überall gleich – in der Prüfung gilt die Legende der Aufgabe.

## 5.2 Gantt-Diagramm

**Gantt-Diagramm** – Balkendiagramm über einer Zeitachse; zeigt Dauer, Überlappung, Puffer und Meilensteine eines Projekts.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 232" width="680" height="232" role="img" aria-label="Gantt-Diagramm mit Puffer und Meilenstein">
<text x="10" y="18" text-anchor="start" dominant-baseline="middle" class="dg-fett">Vorgang</text>
<line x1="170" y1="28" x2="170" y2="200" class="dg-linie dg-duenn dg-punkt"/>
<text x="170" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0</text>
<line x1="230" y1="28" x2="230" y2="200" class="dg-linie dg-duenn dg-punkt"/>
<text x="230" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein">1</text>
<line x1="290" y1="28" x2="290" y2="200" class="dg-linie dg-duenn dg-punkt"/>
<text x="290" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein">2</text>
<line x1="350" y1="28" x2="350" y2="200" class="dg-linie dg-duenn dg-punkt"/>
<text x="350" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein">3</text>
<line x1="410" y1="28" x2="410" y2="200" class="dg-linie dg-duenn dg-punkt"/>
<text x="410" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein">4</text>
<line x1="470" y1="28" x2="470" y2="200" class="dg-linie dg-duenn dg-punkt"/>
<text x="470" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein">5</text>
<line x1="530" y1="28" x2="530" y2="200" class="dg-linie dg-duenn dg-punkt"/>
<text x="530" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein">6</text>
<line x1="590" y1="28" x2="590" y2="200" class="dg-linie dg-duenn dg-punkt"/>
<text x="590" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein">7</text>
<line x1="650" y1="28" x2="650" y2="200" class="dg-linie dg-duenn dg-punkt"/>
<text x="650" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein">8</text>
<text x="10" y="52" text-anchor="start" dominant-baseline="middle">A Anforderungen</text>
<rect x="170" y="40" width="180" height="24" rx="4" class="dg-akzent"/>
<text x="10" y="88" text-anchor="start" dominant-baseline="middle">B Daten aufbereiten</text>
<rect x="350" y="76" width="240" height="24" rx="4" class="dg-akzent"/>
<text x="10" y="124" text-anchor="start" dominant-baseline="middle">C Dashboard-Entwurf</text>
<rect x="350" y="112" width="120" height="24" rx="4" class="dg-form"/>
<text x="10" y="160" text-anchor="start" dominant-baseline="middle">D Test</text>
<rect x="590" y="148" width="60" height="24" rx="4" class="dg-akzent"/>
<rect x="470" y="112" width="120" height="24" rx="4" class="dg-linie dg-strich"/>
<text x="530" y="124" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Puffer</text>
<text x="10" y="196" text-anchor="start" dominant-baseline="middle">Meilenstein Abnahme</text>
<polygon points="650,187 659,196 650,205 641,196" class="dg-voll"/>
<text x="170" y="222" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Tage →</text>
<text x="410" y="222" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">blau = kritischer Pfad</text>
</svg>
```

Abgrenzung: Der Netzplan ist das Rechenwerkzeug (Puffer, kritischer Pfad), das Gantt-Diagramm das Kommunikationswerkzeug für Auftraggeber und Team. Ein **Meilenstein** hat die Dauer 0 und wird als Raute gezeichnet.

## 5.3 Risikomatrix

**Risikomatrix** – Raster aus Eintrittswahrscheinlichkeit und Schadensausmaß, in das Risiken eingeordnet werden; die Farbe zeigt, wo Maßnahmen dringend sind.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" width="500" height="300" role="img" aria-label="Risikomatrix 3 × 3 mit drei Risiken">
<rect x="140" y="20" width="110" height="70" class="dg-mittel"/>
<rect x="250" y="20" width="110" height="70" class="dg-rot"/>
<rect x="360" y="20" width="110" height="70" class="dg-rot"/>
<rect x="140" y="90" width="110" height="70" class="dg-gut"/>
<rect x="250" y="90" width="110" height="70" class="dg-mittel"/>
<rect x="360" y="90" width="110" height="70" class="dg-rot"/>
<rect x="140" y="160" width="110" height="70" class="dg-gut"/>
<rect x="250" y="160" width="110" height="70" class="dg-gut"/>
<rect x="360" y="160" width="110" height="70" class="dg-mittel"/>
<text x="195" y="246" text-anchor="middle" dominant-baseline="middle" class="dg-klein">gering</text>
<text x="132" y="195" text-anchor="end" dominant-baseline="middle" class="dg-klein">gering</text>
<text x="305" y="246" text-anchor="middle" dominant-baseline="middle" class="dg-klein">mittel</text>
<text x="132" y="125" text-anchor="end" dominant-baseline="middle" class="dg-klein">mittel</text>
<text x="415" y="246" text-anchor="middle" dominant-baseline="middle" class="dg-klein">hoch</text>
<text x="132" y="55" text-anchor="end" dominant-baseline="middle" class="dg-klein">hoch</text>
<text x="305" y="268" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Schadensausmaß (S) →</text>
<text x="40" y="125" text-anchor="middle" dominant-baseline="middle" class="dg-fett" transform="rotate(-90 40 125.0)">Eintrittswahrscheinlichkeit (W) →</text>
<circle cx="305" cy="55" r="16" class="dg-form"/>
<text x="305" y="55" text-anchor="middle" dominant-baseline="middle" class="dg-fett">R1</text>
<circle cx="415" cy="125" r="16" class="dg-form"/>
<text x="415" y="125" text-anchor="middle" dominant-baseline="middle" class="dg-fett">R2</text>
<circle cx="305" cy="195" r="16" class="dg-form"/>
<text x="305" y="195" text-anchor="middle" dominant-baseline="middle" class="dg-fett">R3</text>
</svg>
```

R1 „Datenquelle fällt aus“ (W hoch, S mittel) und R2 „Schlüsselperson fällt aus“ (W mittel, S hoch) liegen im roten Bereich und brauchen Maßnahmen, R3 „Lizenz kommt verspätet“ wird beobachtet. Der Risikowert W × S ist nicht die RPZ der FMEA (dort A · B · E).

## 5.4 Kanban-Board und Burndown-Chart

**Kanban-Board** – Tafel mit Spalten für die Arbeitsschritte; Karten wandern von links nach rechts, ein **WIP-Limit** begrenzt die Arbeit, die gleichzeitig in einer Spalte sein darf.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 670 240" width="670" height="240" role="img" aria-label="Kanban-Board mit WIP-Limit">
<rect x="15" y="15" width="150" height="210" rx="6" class="dg-grau"/>
<text x="90" y="34" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Backlog</text>
<rect x="25" y="52" width="130" height="40" rx="4" class="dg-form"/>
<text x="90" y="72" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Datenquelle prüfen</text>
<rect x="25" y="104" width="130" height="40" rx="4" class="dg-form"/>
<text x="90" y="124" text-anchor="middle" dominant-baseline="middle" class="dg-klein">KPI definieren</text>
<rect x="25" y="156" width="130" height="40" rx="4" class="dg-form"/>
<text x="90" y="176" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Rollen klären</text>
<rect x="177" y="15" width="150" height="210" rx="6" class="dg-grau"/>
<text x="252" y="34" text-anchor="middle" dominant-baseline="middle" class="dg-fett">In Arbeit (WIP 2)</text>
<rect x="187" y="52" width="130" height="40" rx="4" class="dg-mittel"/>
<text x="252" y="72" text-anchor="middle" dominant-baseline="middle" class="dg-klein">ETL-Strecke bauen</text>
<rect x="187" y="104" width="130" height="40" rx="4" class="dg-mittel"/>
<text x="252" y="124" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Dashboard-Entwurf</text>
<rect x="339" y="15" width="150" height="210" rx="6" class="dg-grau"/>
<text x="414" y="34" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Test</text>
<rect x="349" y="52" width="130" height="40" rx="4" class="dg-form"/>
<text x="414" y="72" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Datenmodell</text>
<rect x="501" y="15" width="150" height="210" rx="6" class="dg-grau"/>
<text x="576" y="34" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Erledigt</text>
<rect x="511" y="52" width="130" height="40" rx="4" class="dg-form"/>
<text x="576" y="72" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Anforderungen</text>
</svg>
```

**Burndown-Chart** – zeigt im Sprint die noch offene Arbeit (Story Points) über die Tage; die Ideallinie fällt gleichmäßig auf null.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 270" width="560" height="270" role="img" aria-label="Burndown-Chart eines Sprints">
<line x1="60" y1="20" x2="60" y2="220" class="dg-linie"/>
<line x1="60" y1="220" x2="480" y2="220" class="dg-linie"/>
<text x="52" y="220" text-anchor="end" dominant-baseline="middle" class="dg-klein">0</text>
<text x="52" y="170" text-anchor="end" dominant-baseline="middle" class="dg-klein">10</text>
<line x1="60" y1="170" x2="480" y2="170" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="120" text-anchor="end" dominant-baseline="middle" class="dg-klein">20</text>
<line x1="60" y1="120" x2="480" y2="120" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="70" text-anchor="end" dominant-baseline="middle" class="dg-klein">30</text>
<line x1="60" y1="70" x2="480" y2="70" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="20" text-anchor="end" dominant-baseline="middle" class="dg-klein">40</text>
<line x1="60" y1="20" x2="480" y2="20" class="dg-linie dg-duenn dg-punkt"/>
<text x="60" y="234" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0</text>
<text x="144" y="234" text-anchor="middle" dominant-baseline="middle" class="dg-klein">2</text>
<text x="228" y="234" text-anchor="middle" dominant-baseline="middle" class="dg-klein">4</text>
<text x="312" y="234" text-anchor="middle" dominant-baseline="middle" class="dg-klein">6</text>
<text x="396" y="234" text-anchor="middle" dominant-baseline="middle" class="dg-klein">8</text>
<text x="480" y="234" text-anchor="middle" dominant-baseline="middle" class="dg-klein">10</text>
<line x1="60" y1="20" x2="480" y2="220" class="dg-linie dg-strich"/>
<polyline points="60,20 102,30 144,45 186,45 228,70 270,90 312,110 354,120 396,150 438,180 480,205" class="dg-linie dg-dick"/>
<text x="270" y="254" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Sprint-Tag</text>
<text x="14" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-klein" transform="rotate(-90 14 120.0)">offene Story Points</text>
<text x="486" y="205" text-anchor="start" dominant-baseline="middle" class="dg-klein">Ist: 3 offen</text>
<text x="278" y="106" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Ideal</text>
</svg>
```

Lesen: Liegt die Ist-Linie über der Ideallinie, ist das Team hinter dem Plan; eine waagrechte Strecke (Tag 2–3) heißt, dass nichts fertig wurde. Am Sprintende sind hier 3 Punkte offen.

> ❓ **Prüferfrage:** Vorgang C hat einen Gesamtpuffer von 2 Tagen. Was passiert, wenn er sich um 3 Tage verzögert?
> *Die Projektdauer verlängert sich um 1 Tag, weil die Verzögerung den Puffer um 1 Tag übersteigt. C wird damit kritisch, der kritische Pfad verläuft dann über A – C – D.*

---

# Teil 6 – Diagramme der Datenanalyse

## 6.1 Den richtigen Diagrammtyp wählen

| Aussage | Diagramm |
|---|---|
| Werte von Kategorien vergleichen | Säulen, bei langen Namen oder vielen Kategorien Balken |
| Entwicklung über die Zeit | Linie |
| Anteile an einem Ganzen (wenige Teile) | Kreis oder gestapelte Säule |
| Zusammenhang zweier metrischer Merkmale | Streudiagramm |
| Verteilung eines metrischen Merkmals | Histogramm, Boxplot |
| Schwerpunkte erkennen (80/20) | Pareto-Diagramm |
| Muster in zwei Dimensionen | Heatmap |
| Güte eines Klassifikators | Konfusionsmatrix, ROC-Kurve |

Grundregeln aus DD11: Säulen und Balken beginnen bei 0, ein Diagramm hat eine Aussage als Überschrift, Achsen sind beschriftet und haben Einheiten, Farbe trägt Bedeutung statt Dekoration.

## 6.2 Säulen- und Balkendiagramm

**Säulendiagramm** – senkrechte Säulen zum Vergleich von Werten weniger Kategorien; die Länge codiert den Wert, deshalb beginnt die Achse bei 0.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="500" height="280" role="img" aria-label="Säulendiagramm Umsatz je Filiale">
<line x1="70" y1="30" x2="70" y2="230" class="dg-linie"/>
<line x1="70" y1="230" x2="470" y2="230" class="dg-linie"/>
<text x="62" y="230" text-anchor="end" dominant-baseline="middle" class="dg-klein">0</text>
<text x="62" y="190" text-anchor="end" dominant-baseline="middle" class="dg-klein">100</text>
<line x1="70" y1="190" x2="470" y2="190" class="dg-linie dg-duenn dg-punkt"/>
<text x="62" y="150" text-anchor="end" dominant-baseline="middle" class="dg-klein">200</text>
<line x1="70" y1="150" x2="470" y2="150" class="dg-linie dg-duenn dg-punkt"/>
<text x="62" y="110" text-anchor="end" dominant-baseline="middle" class="dg-klein">300</text>
<line x1="70" y1="110" x2="470" y2="110" class="dg-linie dg-duenn dg-punkt"/>
<text x="62" y="70" text-anchor="end" dominant-baseline="middle" class="dg-klein">400</text>
<line x1="70" y1="70" x2="470" y2="70" class="dg-linie dg-duenn dg-punkt"/>
<text x="62" y="30" text-anchor="end" dominant-baseline="middle" class="dg-klein">500</text>
<line x1="70" y1="30" x2="470" y2="30" class="dg-linie dg-duenn dg-punkt"/>
<text x="62" y="18" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">T€</text>
<rect x="100" y="62" width="60" height="168" class="dg-akzent"/>
<text x="130" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">420</text>
<text x="130" y="245" text-anchor="middle" dominant-baseline="middle">Nord</text>
<rect x="195" y="78" width="60" height="152" class="dg-akzent"/>
<text x="225" y="68" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">380</text>
<text x="225" y="245" text-anchor="middle" dominant-baseline="middle">West</text>
<rect x="290" y="106" width="60" height="124" class="dg-akzent"/>
<text x="320" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">310</text>
<text x="320" y="245" text-anchor="middle" dominant-baseline="middle">Süd</text>
<rect x="385" y="130" width="60" height="100" class="dg-akzent"/>
<text x="415" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">250</text>
<text x="415" y="245" text-anchor="middle" dominant-baseline="middle">Ost</text>
<text x="270" y="268" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Umsatz 2026 je Filiale – die y-Achse beginnt bei 0</text>
</svg>
```

**Balkendiagramm** – waagrechte Balken; besser bei langen Kategorienamen oder vielen Kategorien, idealerweise nach Wert sortiert.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 230" width="560" height="230" role="img" aria-label="Balkendiagramm Top-5-Artikel nach Umsatz">
<line x1="180" y1="15" x2="180" y2="190" class="dg-linie"/>
<text x="180" y="204" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0</text>
<text x="260" y="204" text-anchor="middle" dominant-baseline="middle" class="dg-klein">50</text>
<line x1="260" y1="15" x2="260" y2="190" class="dg-linie dg-duenn dg-punkt"/>
<text x="340" y="204" text-anchor="middle" dominant-baseline="middle" class="dg-klein">100</text>
<line x1="340" y1="15" x2="340" y2="190" class="dg-linie dg-duenn dg-punkt"/>
<text x="420" y="204" text-anchor="middle" dominant-baseline="middle" class="dg-klein">150</text>
<line x1="420" y1="15" x2="420" y2="190" class="dg-linie dg-duenn dg-punkt"/>
<text x="500" y="204" text-anchor="middle" dominant-baseline="middle" class="dg-klein">200</text>
<line x1="500" y1="15" x2="500" y2="190" class="dg-linie dg-duenn dg-punkt"/>
<text x="172" y="32" text-anchor="end" dominant-baseline="middle" class="dg-klein">Ecksofa Lund</text>
<rect x="180" y="20" width="296" height="24" class="dg-akzent"/>
<text x="482" y="32" text-anchor="start" dominant-baseline="middle" class="dg-klein">185</text>
<text x="172" y="66" text-anchor="end" dominant-baseline="middle" class="dg-klein">Boxspringbett Aalborg</text>
<rect x="180" y="54" width="240" height="24" class="dg-akzent"/>
<text x="426" y="66" text-anchor="start" dominant-baseline="middle" class="dg-klein">150</text>
<text x="172" y="100" text-anchor="end" dominant-baseline="middle" class="dg-klein">Esstisch Eiche massiv</text>
<rect x="180" y="88" width="192" height="24" class="dg-akzent"/>
<text x="378" y="100" text-anchor="start" dominant-baseline="middle" class="dg-klein">120</text>
<text x="172" y="134" text-anchor="end" dominant-baseline="middle" class="dg-klein">Kleiderschrank Bergen</text>
<rect x="180" y="122" width="152" height="24" class="dg-akzent"/>
<text x="338" y="134" text-anchor="start" dominant-baseline="middle" class="dg-klein">95</text>
<text x="172" y="168" text-anchor="end" dominant-baseline="middle" class="dg-klein">Bürostuhl ErgoPlus</text>
<rect x="180" y="156" width="96" height="24" class="dg-akzent"/>
<text x="282" y="168" text-anchor="start" dominant-baseline="middle" class="dg-klein">60</text>
<text x="340" y="224" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Umsatz in T€ · sortiert, lange Namen bleiben lesbar</text>
</svg>
```

## 6.3 Liniendiagramm

**Liniendiagramm** – verbindet Werte entlang einer Zeitachse und zeigt Trends, Saisonmuster und Ausreißer im Verlauf.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 280" width="560" height="280" role="img" aria-label="Liniendiagramm Monatsumsatz 2025 und 2026">
<line x1="60" y1="30" x2="60" y2="230" class="dg-linie"/>
<line x1="60" y1="230" x2="500" y2="230" class="dg-linie"/>
<text x="52" y="230" text-anchor="end" dominant-baseline="middle" class="dg-klein">0</text>
<text x="52" y="180" text-anchor="end" dominant-baseline="middle" class="dg-klein">40</text>
<line x1="60" y1="180" x2="500" y2="180" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="130" text-anchor="end" dominant-baseline="middle" class="dg-klein">80</text>
<line x1="60" y1="130" x2="500" y2="130" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="80" text-anchor="end" dominant-baseline="middle" class="dg-klein">120</text>
<line x1="60" y1="80" x2="500" y2="80" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="30" text-anchor="end" dominant-baseline="middle" class="dg-klein">160</text>
<line x1="60" y1="30" x2="500" y2="30" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="18" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">T€</text>
<text x="80" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">J</text>
<text x="116.4" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">F</text>
<text x="152.7" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">M</text>
<text x="189.1" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">A</text>
<text x="225.5" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">M</text>
<text x="261.8" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">J</text>
<text x="298.2" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">J</text>
<text x="334.5" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">A</text>
<text x="370.9" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">S</text>
<text x="407.3" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">O</text>
<text x="443.6" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">N</text>
<text x="480" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">D</text>
<polyline points="80,130 116.4,132.5 152.7,123.8 189.1,117.5 225.5,111.2 261.8,115 298.2,120 334.5,122.5 370.9,112.5 407.3,102.5 443.6,80 480,55" class="dg-linie dg-strich"/>
<polyline points="80,125 116.4,126.2 152.7,117.5 189.1,108.8 225.5,103.8 261.8,106.2 298.2,111.2 334.5,115 370.9,105 407.3,92.5 443.6,70 480,42.5" class="dg-linie dg-dick"/>
<text x="486" y="42.5" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-fett">2026</text>
<text x="486" y="57.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">2025</text>
<text x="280" y="266" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Monatsumsatz: Verlauf über die Zeit, Saisonspitze im Dezember</text>
</svg>
```

Nur für geordnete x-Werte (Zeit) verwenden. Kategorien wie Filialen durch eine Linie zu verbinden, täuscht einen Verlauf vor, den es nicht gibt.

## 6.4 Kreisdiagramm

**Kreisdiagramm** – zeigt Anteile an einem Ganzen; die Teile ergeben zusammen 100 %.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470 250" width="470" height="250" role="img" aria-label="Kreisdiagramm Zahlungsarten">
<path d="M130,125 L130,25 A100,100 0 0 1 188.8,205.9 z" class="dg-akzent"/>
<text x="189" y="105.8" text-anchor="middle" dominant-baseline="middle" class="dg-fett">40 %</text>
<path d="M130,125 L188.8,205.9 A100,100 0 0 1 34.9,155.9 z" class="dg-gut"/>
<text x="110.8" y="184" text-anchor="middle" dominant-baseline="middle" class="dg-fett">30 %</text>
<path d="M130,125 L34.9,155.9 A100,100 0 0 1 71.2,44.1 z" class="dg-mittel"/>
<text x="71" y="105.8" text-anchor="middle" dominant-baseline="middle" class="dg-fett">20 %</text>
<path d="M130,125 L71.2,44.1 A100,100 0 0 1 130,25 z" class="dg-rot"/>
<text x="110.8" y="66" text-anchor="middle" dominant-baseline="middle" class="dg-fett">10 %</text>
<rect x="280" y="60" width="16" height="16" class="dg-akzent"/>
<text x="304" y="68" text-anchor="start" dominant-baseline="middle">Rechnung (40 %)</text>
<rect x="280" y="90" width="16" height="16" class="dg-gut"/>
<text x="304" y="98" text-anchor="start" dominant-baseline="middle">PayPal (30 %)</text>
<rect x="280" y="120" width="16" height="16" class="dg-mittel"/>
<text x="304" y="128" text-anchor="start" dominant-baseline="middle">Karte (20 %)</text>
<rect x="280" y="150" width="16" height="16" class="dg-rot"/>
<text x="304" y="158" text-anchor="start" dominant-baseline="middle">Sonstige (10 %)</text>
<text x="280" y="200" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Anteile am Ganzen (Σ = 100 %)</text>
</svg>
```

Nur für wenige Teile (Faustregel: höchstens fünf) und nur, wenn die Anteile zusammen ein sinnvolles Ganzes bilden. Kleine Unterschiede (21 % gegen 23 %) sind im Kreis kaum zu sehen – dann Säulen oder Balken nehmen. Kein 3D: Die Perspektive verzerrt die Flächen.

## 6.5 Streudiagramm

**Streudiagramm** – Punktwolke aus zwei metrischen Merkmalen; zeigt Richtung und Stärke eines Zusammenhangs und Ausreißer, mit Regressionsgerade auch die Prognose.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 290" width="500" height="290" role="img" aria-label="Streudiagramm mit Regressionsgerade (Daten aus Deep Dive 4)">
<line x1="60" y1="25" x2="60" y2="245" class="dg-linie"/>
<line x1="60" y1="245" x2="460" y2="245" class="dg-linie"/>
<text x="52" y="245" text-anchor="end" dominant-baseline="middle" class="dg-klein">20</text>
<text x="52" y="201" text-anchor="end" dominant-baseline="middle" class="dg-klein">30</text>
<line x1="60" y1="201" x2="460" y2="201" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="157" text-anchor="end" dominant-baseline="middle" class="dg-klein">40</text>
<line x1="60" y1="157" x2="460" y2="157" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="113" text-anchor="end" dominant-baseline="middle" class="dg-klein">50</text>
<line x1="60" y1="113" x2="460" y2="113" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="69" text-anchor="end" dominant-baseline="middle" class="dg-klein">60</text>
<line x1="60" y1="69" x2="460" y2="69" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="25" text-anchor="end" dominant-baseline="middle" class="dg-klein">70</text>
<line x1="60" y1="25" x2="460" y2="25" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="13" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">y (T€)</text>
<text x="60" y="259" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0</text>
<text x="126.7" y="259" text-anchor="middle" dominant-baseline="middle" class="dg-klein">1</text>
<text x="193.3" y="259" text-anchor="middle" dominant-baseline="middle" class="dg-klein">2</text>
<text x="260" y="259" text-anchor="middle" dominant-baseline="middle" class="dg-klein">3</text>
<text x="326.7" y="259" text-anchor="middle" dominant-baseline="middle" class="dg-klein">4</text>
<text x="393.3" y="259" text-anchor="middle" dominant-baseline="middle" class="dg-klein">5</text>
<text x="460" y="259" text-anchor="middle" dominant-baseline="middle" class="dg-klein">6</text>
<line x1="93.3" y1="209.8" x2="433.3" y2="66.2" class="dg-linie-akzent dg-dick"/>
<line x1="126.7" y1="201" x2="126.7" y2="195.7" class="dg-linie dg-strich dg-duenn"/>
<circle cx="126.7" cy="201" r="5" class="dg-voll"/>
<line x1="193.3" y1="157" x2="193.3" y2="167.6" class="dg-linie dg-strich dg-duenn"/>
<circle cx="193.3" cy="157" r="5" class="dg-voll"/>
<line x1="260" y1="148.2" x2="260" y2="139.4" class="dg-linie dg-strich dg-duenn"/>
<circle cx="260" cy="148.2" r="5" class="dg-voll"/>
<line x1="326.7" y1="104.2" x2="326.7" y2="111.2" class="dg-linie dg-strich dg-duenn"/>
<circle cx="326.7" cy="104.2" r="5" class="dg-voll"/>
<line x1="393.3" y1="86.6" x2="393.3" y2="83.1" class="dg-linie dg-strich dg-duenn"/>
<circle cx="393.3" cy="86.6" r="5" class="dg-voll"/>
<text x="429.3" y="52.2" text-anchor="end" dominant-baseline="middle" class="dg-fett dg-akzent-text">ŷ = 24,8 + 6,4 · x</text>
<text x="70" y="35" text-anchor="start" dominant-baseline="middle" class="dg-klein">r = 0,98 · R² = 0,97</text>
<text x="260" y="279" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Werbebudget x (T€) · gestrichelt: Residuen e = y − ŷ (senkrechte Abstände)</text>
</svg>
```

Daten aus DD4: Budget 1 bis 5 T€, Umsatz 30 bis 56 T€. Die Gerade minimiert die Summe der quadrierten senkrechten Abstände (Residuen). Ein enger Zusammenhang belegt keine Kausalität.

## 6.6 Histogramm

**Histogramm** – Säulen über Klassen eines metrischen Merkmals ohne Lücken dazwischen; zeigt die Form einer Verteilung (symmetrisch, schief, mehrgipflig).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 275" width="500" height="275" role="img" aria-label="Histogramm Lieferzeiten">
<line x1="60" y1="25" x2="60" y2="225" class="dg-linie"/>
<line x1="60" y1="225" x2="460" y2="225" class="dg-linie"/>
<text x="52" y="225" text-anchor="end" dominant-baseline="middle" class="dg-klein">0</text>
<text x="52" y="196.4" text-anchor="end" dominant-baseline="middle" class="dg-klein">2</text>
<line x1="60" y1="196.4" x2="460" y2="196.4" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="167.9" text-anchor="end" dominant-baseline="middle" class="dg-klein">4</text>
<line x1="60" y1="167.9" x2="460" y2="167.9" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="139.3" text-anchor="end" dominant-baseline="middle" class="dg-klein">6</text>
<line x1="60" y1="139.3" x2="460" y2="139.3" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="110.7" text-anchor="end" dominant-baseline="middle" class="dg-klein">8</text>
<line x1="60" y1="110.7" x2="460" y2="110.7" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="82.1" text-anchor="end" dominant-baseline="middle" class="dg-klein">10</text>
<line x1="60" y1="82.1" x2="460" y2="82.1" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="53.6" text-anchor="end" dominant-baseline="middle" class="dg-klein">12</text>
<line x1="60" y1="53.6" x2="460" y2="53.6" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="25" text-anchor="end" dominant-baseline="middle" class="dg-klein">14</text>
<line x1="60" y1="25" x2="460" y2="25" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="13" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">Anzahl</text>
<rect x="60" y="167.9" width="80" height="57.1" class="dg-akzent"/>
<text x="100" y="157.9" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">4</text>
<rect x="140" y="96.4" width="80" height="128.6" class="dg-akzent"/>
<text x="180" y="86.4" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">9</text>
<rect x="220" y="53.6" width="80" height="171.4" class="dg-akzent"/>
<text x="260" y="43.6" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">12</text>
<rect x="300" y="139.3" width="80" height="85.7" class="dg-akzent"/>
<text x="340" y="129.3" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">6</text>
<rect x="380" y="182.1" width="80" height="42.9" class="dg-akzent"/>
<text x="420" y="172.1" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">3</text>
<text x="60" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0</text>
<text x="140" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">2</text>
<text x="220" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">4</text>
<text x="300" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">6</text>
<text x="380" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">8</text>
<text x="460" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">10</text>
<text x="260" y="261" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Lieferzeit in Tagen (Klassen [0; 2), [2; 4) …) · Säulen ohne Lücke: stetiges Merkmal</text>
</svg>
```

Abgrenzung zum Säulendiagramm: Beim Histogramm liegt eine stetige Skala auf der x-Achse, die Säulen stoßen aneinander, und bei ungleich breiten Klassen zählt die Fläche, nicht die Höhe.

## 6.7 Boxplot

**Boxplot** – zeigt die Verteilung mit fünf Kennwerten: Box von Q1 bis Q3 mit Median, Whisker bis zum letzten Wert innerhalb der Zäune (1,5 · IQR), Ausreißer als einzelne Punkte.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 185" width="640" height="185" role="img" aria-label="Boxplot Bearbeitungsdauer (Daten aus Deep Dive 3)">
<line x1="40" y1="130" x2="600" y2="130" class="dg-linie"/>
<line x1="40" y1="130" x2="40" y2="135" class="dg-linie"/>
<text x="40" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0</text>
<line x1="133.3" y1="130" x2="133.3" y2="135" class="dg-linie"/>
<text x="133.3" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">40</text>
<line x1="226.7" y1="130" x2="226.7" y2="135" class="dg-linie"/>
<text x="226.7" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">80</text>
<line x1="320" y1="130" x2="320" y2="135" class="dg-linie"/>
<text x="320" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">120</text>
<line x1="413.3" y1="130" x2="413.3" y2="135" class="dg-linie"/>
<text x="413.3" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">160</text>
<line x1="506.7" y1="130" x2="506.7" y2="135" class="dg-linie"/>
<text x="506.7" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">200</text>
<line x1="600" y1="130" x2="600" y2="135" class="dg-linie"/>
<text x="600" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">240</text>
<line x1="121.7" y1="70" x2="133.3" y2="70" class="dg-linie"/>
<line x1="203.3" y1="70" x2="250" y2="70" class="dg-linie"/>
<line x1="121.7" y1="58" x2="121.7" y2="82" class="dg-linie"/>
<line x1="250" y1="58" x2="250" y2="82" class="dg-linie"/>
<rect x="133.3" y="48" width="70" height="44" class="dg-akzent"/>
<line x1="168.3" y1="48" x2="168.3" y2="92" class="dg-linie dg-dick"/>
<circle cx="553.3" cy="70" r="5" class="dg-form"/>
<line x1="308.3" y1="36" x2="308.3" y2="104" class="dg-linie dg-strich dg-duenn"/>
<text x="133.3" y="38" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Q1 40</text>
<text x="168.3" y="104" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Median 55</text>
<text x="203.3" y="38" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Q3 70</text>
<text x="250" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Whisker 90</text>
<text x="308.3" y="28" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Zaun 115</text>
<text x="553.3" y="50" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ausreißer 220</text>
<text x="115.7" y="70" text-anchor="end" dominant-baseline="middle" class="dg-klein">Min 35</text>
<text x="40" y="170" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">IQR = 70 − 40 = 30 · oberer Zaun = 70 + 1,5 · 30 = 115 → 220 liegt darüber und ist ein Ausreißer</text>
</svg>
```

Daten aus DD3 (11 Reparaturaufträge in Minuten). Mehrere Boxplots nebeneinander vergleichen Gruppen auf einen Blick, z. B. die Bearbeitungsdauer je Filiale.

## 6.8 Pareto-Diagramm

**Pareto-Diagramm** – Säulen der Kategorien absteigend sortiert plus kumulierte Prozentlinie; zeigt die wenigen Ursachen mit der größten Wirkung (80/20-Regel).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 275" width="560" height="275" role="img" aria-label="Pareto-Diagramm Reklamationsgründe">
<line x1="60" y1="25" x2="60" y2="225" class="dg-linie"/>
<line x1="60" y1="225" x2="500" y2="225" class="dg-linie"/>
<text x="52" y="225" text-anchor="end" dominant-baseline="middle" class="dg-klein">0</text>
<text x="52" y="185" text-anchor="end" dominant-baseline="middle" class="dg-klein">10</text>
<line x1="60" y1="185" x2="500" y2="185" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="145" text-anchor="end" dominant-baseline="middle" class="dg-klein">20</text>
<line x1="60" y1="145" x2="500" y2="145" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="105" text-anchor="end" dominant-baseline="middle" class="dg-klein">30</text>
<line x1="60" y1="105" x2="500" y2="105" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="65" text-anchor="end" dominant-baseline="middle" class="dg-klein">40</text>
<line x1="60" y1="65" x2="500" y2="65" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="25" text-anchor="end" dominant-baseline="middle" class="dg-klein">50</text>
<line x1="60" y1="25" x2="500" y2="25" class="dg-linie dg-duenn dg-punkt"/>
<text x="52" y="13" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">Anzahl</text>
<line x1="500" y1="25" x2="500" y2="225" class="dg-linie"/>
<text x="508" y="225" text-anchor="start" dominant-baseline="middle" class="dg-klein">0 %</text>
<text x="508" y="185" text-anchor="start" dominant-baseline="middle" class="dg-klein">20 %</text>
<text x="508" y="145" text-anchor="start" dominant-baseline="middle" class="dg-klein">40 %</text>
<text x="508" y="105" text-anchor="start" dominant-baseline="middle" class="dg-klein">60 %</text>
<text x="508" y="65" text-anchor="start" dominant-baseline="middle" class="dg-klein">80 %</text>
<text x="508" y="25" text-anchor="start" dominant-baseline="middle" class="dg-klein">100 %</text>
<rect x="68" y="45" width="72" height="180" class="dg-akzent"/>
<text x="104" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Lieferverzug</text>
<rect x="156" y="125" width="72" height="100" class="dg-akzent"/>
<text x="192" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Beschädigung</text>
<rect x="244" y="165" width="72" height="60" class="dg-akzent"/>
<text x="280" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Falschlieferung</text>
<rect x="332" y="185" width="72" height="40" class="dg-akzent"/>
<text x="368" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Rechnungsfehler</text>
<rect x="420" y="205" width="72" height="20" class="dg-akzent"/>
<text x="456" y="239" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Sonstiges</text>
<line x1="60" y1="65" x2="500" y2="65" class="dg-linie dg-rot dg-strich"/>
<text x="494" y="57" text-anchor="end" dominant-baseline="middle" class="dg-klein">80-%-Linie</text>
<polyline points="104,135 192,85 280,55 368,35 456,25" class="dg-linie dg-dick"/>
<circle cx="104" cy="135" r="3.5" class="dg-voll"/>
<circle cx="192" cy="85" r="3.5" class="dg-voll"/>
<circle cx="280" cy="55" r="3.5" class="dg-voll"/>
<circle cx="368" cy="35" r="3.5" class="dg-voll"/>
<circle cx="456" cy="25" r="3.5" class="dg-voll"/>
<text x="104" y="124" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">45 %</text>
<text x="192" y="74" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">70 %</text>
<text x="280" y="44" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">85 %</text>
<text x="368" y="24" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">95 %</text>
<text x="456" y="14" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">100 %</text>
<text x="280" y="261" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Reklamationsgründe absteigend + kumulierte Linie: 2 von 5 Gründen machen 70 %, 3 schon 85 % aus</text>
</svg>
```

Lesen: An der Stelle, an der die kumulierte Linie die 80 % erreicht, liegen links die „wenigen wichtigen“ Kategorien. Hier bringen Lieferverzug und Beschädigung schon 70 %, mit Falschlieferungen sind es 85 %.

## 6.9 Heatmap

**Heatmap** – Tabelle, deren Zellen nach dem Wert eingefärbt sind; macht Muster in zwei Dimensionen sichtbar, z. B. Wochentag × Uhrzeit.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 200" width="560" height="200" role="img" aria-label="Heatmap Bestellungen nach Wochentag und Uhrzeit">
<text x="82" y="52" text-anchor="end" dominant-baseline="middle" class="dg-klein">6–12 Uhr</text>
<text x="82" y="96" text-anchor="end" dominant-baseline="middle" class="dg-klein">12–18 Uhr</text>
<text x="82" y="140" text-anchor="end" dominant-baseline="middle" class="dg-klein">18–24 Uhr</text>
<text x="122" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Mo</text>
<rect x="90" y="30" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="91" y="31" width="62" height="42" class="dg-voll-akzent" opacity="0.16"/>
<text x="122" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-fett">12</text>
<rect x="90" y="74" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="91" y="75" width="62" height="42" class="dg-voll-akzent" opacity="0.29"/>
<text x="122" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-fett">30</text>
<rect x="90" y="118" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="91" y="119" width="62" height="42" class="dg-voll-akzent" opacity="0.40"/>
<text x="122" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-fett">45</text>
<text x="186" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Di</text>
<rect x="154" y="30" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="155" y="31" width="62" height="42" class="dg-voll-akzent" opacity="0.15"/>
<text x="186" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-fett">10</text>
<rect x="154" y="74" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="155" y="75" width="62" height="42" class="dg-voll-akzent" opacity="0.28"/>
<text x="186" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-fett">28</text>
<rect x="154" y="118" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="155" y="119" width="62" height="42" class="dg-voll-akzent" opacity="0.36"/>
<text x="186" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-fett">40</text>
<text x="250" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Mi</text>
<rect x="218" y="30" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="219" y="31" width="62" height="42" class="dg-voll-akzent" opacity="0.16"/>
<text x="250" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-fett">11</text>
<rect x="218" y="74" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="219" y="75" width="62" height="42" class="dg-voll-akzent" opacity="0.27"/>
<text x="250" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-fett">27</text>
<rect x="218" y="118" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="219" y="119" width="62" height="42" class="dg-voll-akzent" opacity="0.38"/>
<text x="250" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-fett">42</text>
<text x="314" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Do</text>
<rect x="282" y="30" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="283" y="31" width="62" height="42" class="dg-voll-akzent" opacity="0.18"/>
<text x="314" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-fett">14</text>
<rect x="282" y="74" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="283" y="75" width="62" height="42" class="dg-voll-akzent" opacity="0.30"/>
<text x="314" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-fett">31</text>
<rect x="282" y="118" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="283" y="119" width="62" height="42" class="dg-voll-akzent" opacity="0.42"/>
<text x="314" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-fett">48</text>
<text x="378" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Fr</text>
<rect x="346" y="30" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="347" y="31" width="62" height="42" class="dg-voll-akzent" opacity="0.19"/>
<text x="378" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-fett">15</text>
<rect x="346" y="74" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="347" y="75" width="62" height="42" class="dg-voll-akzent" opacity="0.33"/>
<text x="378" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-fett">35</text>
<rect x="346" y="118" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="347" y="119" width="62" height="42" class="dg-voll-akzent" opacity="0.50"/>
<text x="378" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-fett">60</text>
<text x="442" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Sa</text>
<rect x="410" y="30" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="411" y="31" width="62" height="42" class="dg-voll-akzent" opacity="0.26"/>
<text x="442" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-fett">25</text>
<rect x="410" y="74" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="411" y="75" width="62" height="42" class="dg-voll-akzent" opacity="0.47"/>
<text x="442" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-fett">55</text>
<rect x="410" y="118" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="411" y="119" width="62" height="42" class="dg-voll-akzent" opacity="0.57"/>
<text x="442" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-fett">70</text>
<text x="506" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">So</text>
<rect x="474" y="30" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="475" y="31" width="62" height="42" class="dg-voll-akzent" opacity="0.29"/>
<text x="506" y="52" text-anchor="middle" dominant-baseline="middle" class="dg-fett">30</text>
<rect x="474" y="74" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="475" y="75" width="62" height="42" class="dg-voll-akzent" opacity="0.52"/>
<text x="506" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-fett">62</text>
<rect x="474" y="118" width="64" height="44" class="dg-form dg-duenn"/>
<rect x="475" y="119" width="62" height="42" class="dg-voll-akzent" opacity="0.68"/>
<text x="506" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-fett">85</text>
<text x="90" y="184" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Bestellungen je Wochentag und Tageszeit – je dunkler, desto mehr</text>
</svg>
```

Die Farbskala braucht eine Legende oder Zahlen in den Zellen, und sie sollte einfarbig von hell nach dunkel laufen (sequenziell) – Rot-Grün-Skalen sind für Farbfehlsichtige ungeeignet.

## 6.10 Konfusionsmatrix und ROC-Kurve

**Konfusionsmatrix** – Vierfeldertafel eines Klassifikators: tatsächliche Klasse gegen vorhergesagte Klasse mit TP, FP, FN und TN.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300" width="640" height="300" role="img" aria-label="Konfusionsmatrix (Daten aus Deep Dive 7)">
<text x="270" y="18" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Vorhersage</text>
<text x="210" y="38" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reklamation</text>
<text x="330" y="38" text-anchor="middle" dominant-baseline="middle" class="dg-klein">keine</text>
<text x="40" y="170" text-anchor="middle" dominant-baseline="middle" class="dg-fett" transform="rotate(-90 40 170)">Tatsächlich</text>
<text x="142" y="110" text-anchor="end" dominant-baseline="middle" class="dg-klein">Reklamation</text>
<text x="142" y="230" text-anchor="end" dominant-baseline="middle" class="dg-klein">keine</text>
<rect x="150" y="50" width="120" height="120" class="dg-gut"/>
<text x="210" y="102" text-anchor="middle" dominant-baseline="middle" class="dg-fett dg-gross">TP = 60</text>
<text x="210" y="124" text-anchor="middle" dominant-baseline="middle" class="dg-klein">richtig positiv</text>
<rect x="270" y="50" width="120" height="120" class="dg-rot"/>
<text x="330" y="102" text-anchor="middle" dominant-baseline="middle" class="dg-fett dg-gross">FN = 40</text>
<text x="330" y="124" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Fehler 2. Art</text>
<rect x="150" y="170" width="120" height="120" class="dg-rot"/>
<text x="210" y="222" text-anchor="middle" dominant-baseline="middle" class="dg-fett dg-gross">FP = 90</text>
<text x="210" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Fehler 1. Art</text>
<rect x="270" y="170" width="120" height="120" class="dg-gut"/>
<text x="330" y="222" text-anchor="middle" dominant-baseline="middle" class="dg-fett dg-gross">TN = 810</text>
<text x="330" y="244" text-anchor="middle" dominant-baseline="middle" class="dg-klein">richtig negativ</text>
<text x="406" y="70" text-anchor="start" dominant-baseline="middle" class="dg-klein">Accuracy = 870 / 1.000 = 87 %</text>
<text x="406" y="92" text-anchor="start" dominant-baseline="middle" class="dg-klein">Precision = 60 / 150 = 40 %</text>
<text x="406" y="114" text-anchor="start" dominant-baseline="middle" class="dg-klein">Recall = 60 / 100 = 60 %</text>
<text x="406" y="136" text-anchor="start" dominant-baseline="middle" class="dg-klein">Spezifität = 810 / 900 = 90 %</text>
<text x="406" y="170" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Positiv = Reklamation</text>
<text x="406" y="190" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">(vorher festlegen!)</text>
</svg>
```

**ROC-Kurve** – trägt für alle Schwellenwerte die True Positive Rate gegen die False Positive Rate ab; die Fläche darunter (AUC) fasst die Trennschärfe in einer Zahl zusammen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 305" width="330" height="305" role="img" aria-label="ROC-Kurve mit AUC">
<rect x="60" y="20" width="240" height="240" class="dg-linie"/>
<text x="60" y="274" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0,0</text>
<text x="52" y="260" text-anchor="end" dominant-baseline="middle" class="dg-klein">0,0</text>
<text x="108" y="274" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0,2</text>
<text x="52" y="212" text-anchor="end" dominant-baseline="middle" class="dg-klein">0,2</text>
<text x="156" y="274" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0,4</text>
<text x="52" y="164" text-anchor="end" dominant-baseline="middle" class="dg-klein">0,4</text>
<text x="204" y="274" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0,6</text>
<text x="52" y="116" text-anchor="end" dominant-baseline="middle" class="dg-klein">0,6</text>
<text x="252" y="274" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0,8</text>
<text x="52" y="68" text-anchor="end" dominant-baseline="middle" class="dg-klein">0,8</text>
<text x="300" y="274" text-anchor="middle" dominant-baseline="middle" class="dg-klein">1,0</text>
<text x="52" y="20" text-anchor="end" dominant-baseline="middle" class="dg-klein">1,0</text>
<line x1="60" y1="260" x2="300" y2="20" class="dg-linie dg-strich"/>
<polyline points="60,260 72,152 84,104 108,68 156,39.2 228,24.8 300,20" class="dg-linie-akzent dg-dick"/>
<path d="M60,260 L60,20 L300,20" class="dg-linie dg-punkt"/>
<text x="192" y="159.2" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Zufall: AUC = 0,5</text>
<text x="136.8" y="68" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-fett">Modell: AUC ≈ 0,87</text>
<text x="67.2" y="12" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">perfekt: AUC = 1</text>
<text x="180" y="294" text-anchor="middle" dominant-baseline="middle" class="dg-klein">False Positive Rate (1 − Spezifität)</text>
<text x="18" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-klein" transform="rotate(-90 18 140.0)">True Positive Rate (Recall)</text>
</svg>
```

Je näher die Kurve an der linken oberen Ecke liegt, desto besser. Die Diagonale entspricht zufälligem Raten (AUC 0,5). Die AUC ist unabhängig von einem gewählten Schwellenwert; welcher Schwellenwert im Betrieb gilt, entscheiden die Kosten von FP und FN (DD7).

> ❓ **Prüferfrage:** Die Geschäftsleitung möchte sehen, welche drei Reklamationsgründe sie zuerst angehen soll. Welches Diagramm schlagen Sie vor und warum?
> *Ein Pareto-Diagramm: Die Gründe stehen absteigend sortiert, die kumulierte Linie zeigt, wie viel Prozent der Reklamationen die ersten Gründe zusammen ausmachen. So ist sofort sichtbar, mit welchen wenigen Gründen sich der größte Teil erledigen lässt.*

---

# Teil 7 – Der Anhang der Prüfung: Notationen, SQL-Auszug, Formeln

In der AP2 liegt ein **Anhang** bei (Notationen, SQL-Syntax-Auszug mit Stand 2024-10-07, Formelübersicht, Präfixe). Du musst ihn nicht auswendig lernen – aber du musst **wissen, was drinsteht und was nicht**, und die Zeichen genau so verwenden wie dort. Dieser Teil gleicht die App mit dem Anhang ab (nach Fotos des Prüfungskatalogs und des Anhangs). Wo die Aufgabe eine andere Legende vorgibt, gilt die der Aufgabe.

## 7.1 Prüfungskatalog: Gebiete und wo du sie hier lernst

| Gebiet (AP2) | Zeit, Gewicht | Katalog-Tätigkeiten | Lernen in |
|---|---|---|---|
| **01 Durchführen einer Prozessanalyse** | 90 Min., 10 % | Prozess darstellen und Anforderungen abbilden (§ 29 Abs. 1 Nr. 1) · Analysewerkzeuge auswählen und anwenden (Nr. 2) · Maßnahmen zur Prozessoptimierung vorschlagen und rechtliche Auswirkungen auf betriebliche Abläufe einschätzen (Nr. 3) · Qualitäts- und Wirtschaftlichkeitskontrolle planen und durchführen (Nr. 4) | DD3, DD4, DD5, DD6, DD7, DD11, DD12, DD18 |
| **02 Sicherstellen der Datenqualität** | 90 Min., 10 % | Daten identifizieren, klassifizieren, bereitstellen (§ 30 Abs. 1 Nr. 1) · Datenqualität prüfen und sicherstellen (Nr. 2) · Zugriff und Verfügbarkeit gewährleisten (Nr. 3) · Datenschutz und Datensicherheit anwendungsbezogen einhalten (Nr. 4) | DD1, DD2, DD8, DD9, DD10, DD15, DD16, DD19 |
| **03 Wirtschafts- und Sozialkunde** | 60 Min., 10 % | Berufsbildung, Arbeits- und Tarifrecht · Aufbau und Organisation des Ausbildungsbetriebs · Sicherheit und Gesundheitsschutz · Umweltschutz · **Vernetztes Zusammenarbeiten unter Nutzung digitaler Medien** (§ 4 Abs. 7 Nr. 1 bis 5) | DD13, DD14 (Abschnitt 5.3), DD20 |

Die Lernfelder dahinter: LF 10c (Werkzeuge des maschinellen Lernens einsetzen), LF 11c (Prozesse analysieren und gestalten), LF 12c (Kundenspezifische Prozess- und Datenanalyse durchführen), dazu LF 1 bis 9 aus dem ersten Ausbildungsteil.

## 7.2 EPK nach dem Anhang

| Symbol | Name | Bedeutung laut Anhang |
|---|---|---|
| Sechseck | **Ereignis** | eingetretener Zustand, der den weiteren Ablauf festlegt |
| abgerundetes Rechteck | **Funktion** | betrieblicher Vorgang, der einen Eingangs- in einen Zielzustand umwandelt |
| Ellipse mit Strich links | **Organisationseinheit** | Abteilung, der eine Funktion oder ein Ereignis zugeordnet ist |
| Rechteck | **Objekt** | Informationsobjekt, Material, Ressource oder Produkt |
| Pfeil | **Kontrollfluss** | gerichtete Verbindung zwischen Ereignissen, Funktionen und Konnektoren |
| Doppelpfeil | **Informationsfluss** / **Material-/Ressourcenfluss** | Information wird von einem Informationsobjekt gelesen oder darauf geschrieben · Material oder Ressource wird in einer Funktion verbraucht |
| Linie ohne Pfeil | **Zuordnung** | welche Organisationseinheit oder welche Objekte zu einer Funktion gehören |
| Kreis mit ∧ | Konnektor **„Und“** | alle Ereignisse müssen eingetreten sein (Zusammenlauf) · nach der Funktion treten mehrere Ereignisse ein (Verzweigung) |
| Kreis mit XOR | Konnektor **„Exklusives Oder“** | genau eines von mehreren |
| Kreis mit ∨ | Konnektor **„Offenes Oder“** | mindestens eines von mehreren |

Der Anhang zeigt die Symbole der **eEPK** (Organisationseinheit, Objekt, Flüsse). Der Wechsel Ereignis – Funktion und die Regel „kein Entscheiden nach einem Ereignis“ stehen **nicht** im Anhang – die musst du selbst anwenden (siehe 1.2).

## 7.3 BPMN nach dem Anhang

Der Anhang zeigt nur eine **Auswahl**: Task/Aufgabe (abgerundetes Rechteck), **Sequenzfluss** (durchgezogener Pfeil), **Nachrichtenfluss** (gestrichelter Pfeil), **Datenobjekt** (Blatt mit Eselsohr), die Gateways **XOR/Exklusiv** (Raute mit X), **OR/Inklusiv** (Raute mit Kreis) und **AND/Parallel** (Raute mit +), **Startevent** (dünner Kreis), **Intermediate Event** (Doppelkreis), **Endevent** (dicker Kreis), **Message Event** (Umschlag), **Timer Event** (Uhr), **Exception Event** (Blitz, steht für einen Fehler oder eine Ausnahme) und **Pool mit Lanes**.

- Der Hinweis im Anhang: „Verschiedene Eventtypen können als **Start-, Intermediate- und Endevent** vorkommen.“ Ein Message Event kann also einen Prozess starten, im Ablauf auf eine Nachricht warten oder als Ende eine Nachricht senden; ein Exception Event kann einen Fehler auslösen oder abfangen.
- Kein Symbol im Anhang für Unterprozess, Ereignis-Gateway, Textanmerkung oder Datenspeicher. Brauchst du sie, beschrifte sie und erkläre sie kurz.
- Der Nachrichtenfluss gilt **zwischen Pools**, nicht innerhalb eines Pools (siehe 1.1).

## 7.4 Netzplan nach dem Anhang (Knotenaufbau und Formeln)

Der Anhang zeichnet den Knoten **anders** als das Beispiel in 5.1:

| Position im Knoten | Inhalt |
|---|---|
| oben links / oben rechts (außen) | **FAZ** / **FEZ** |
| Mitte oben | Vorgangs-ID (A, B, C …) und Beschreibung |
| Mitte unten | **Dauer** · **GP** · **FP** |
| unten links / unten rechts (außen) | **SAZ** / **SEZ** |

Formeln des Anhangs: **GP = SAZ − FAZ** oder **GP = SEZ − FEZ** · **FP = FAZ des Nachfolgers − FEZ des Vorgangs**. Dauer in Arbeitstagen.

**Beispiel aus dem Anhang:** A Planung 30 (kein Vorgänger) · B Netzwerk 40 (A) · C Hardware 15 (A) · D Software 30 (A) · E Installation 5 (C, D) · F Anschluss Computer 5 (B, E) · G Test und Übergabe 10 (F).

- Vorwärts: A 0–30, B 30–70, C 30–45, D 30–60, E 60–65 (FAZ = größtes FEZ von C und D), F 70–75 (größtes FEZ von B und E), G 75–85. Projektdauer **85 Tage**.
- Rückwärts: G 75–85, F 70–75, E 65–70 (SEZ = kleinster SAZ der Nachfolger), B 30–70, C 50–65, D 35–65, A 0–30.
- Puffer: A, B, F, G haben GP **0** → kritischer Pfad **A – B – F – G**. D hat GP 5 und FP 0, C hat GP 20 und FP 15, E hat GP 5 und nach der Formel FP 5 (FAZ von F ist 70, FEZ von E ist 65). Rechne immer nach der Formel; abgedruckte Beispielzahlen nicht blind übernehmen.

## 7.5 Netzwerkplan: Symbole des Anhangs

| Symbol | Bedeutung laut Anhang |
|---|---|
| **Switch** | Koppelelement auf ISO/OSI-**Layer 2**; weitere Funktionen (z. B. Layer-3-Funktionen) können sich aus der Aufgabenstellung ergeben |
| **Router** | Koppelelement auf **Layer 3**; weitere Funktionen (z. B. **NAT/PAT**) ergeben sich aus der Aufgabe |
| **Firewall** | **Stateful-Inspection**-Firewall (bis **Layer 4**); weitere Funktionen (z. B. Next Generation Firewall) ergeben sich aus der Aufgabe |
| **Kombigerät für SOHO** | Gerät mit unterschiedlichem Funktionsumfang (z. B. Switch, Router, Firewall, Accesspoint in einem) |
| **Accesspoint** | WLAN-Zugangspunkt |
| **Server** | Beispielsymbol, andere Symbole (ggf. mit Dienstsymbol) sind möglich |
| **Ellipse mit Adresse** | (Teil-)Netzwerk (IPv4 und/oder IPv6), z. B. `192.0.2.0/24`: ein LAN, in dem beliebige weitere Geräte vorhanden sein können |

- Der Anhang erlaubt ausdrücklich, **von den Symbolen abzuweichen** oder weitere sinnvolle Symbole (Drucker, Endgeräte) zu verwenden; für VPN, Client, Drucker gibt es bewusst keine Vorgabe – das Symbol ergibt sich aus der Aufgabe.
- Ein Netzwerkplan zeigt **nur den relevanten Teil** des Netzes. Zeichne nicht alles, was du kennst, sondern was die Aufgabe braucht; beschrifte Netze mit Adresse und Präfix, Geräte mit Namen und Schnittstellen mit IP.
- `192.0.2.0/24` gehört zu den **Dokumentationsadressen** (TEST-NET-1), die in Beispielen vorkommen und im echten Internet nicht geroutet werden.

## 7.6 UML nach dem Anhang

**Use-Case-Diagramm:** Akteure (Strichmännchen) mit **Generalisierung** (Pfeil mit leerer, geschlossener Spitze zum allgemeinen Akteur) · Anwendungsfall (Ellipse) · **«include»** (gestrichelter Pfeil vom Basis- zum **sekundären** Anwendungsfall, der immer mitläuft) · **«extend»** (gestrichelter Pfeil vom **sekundären** zum erweiterten Anwendungsfall, mit Notiz *Condition: {bedingung}* und *extension point*) · spezialisierter Anwendungsfall (durchgezogener Pfeil mit leerer Spitze).

**Aktivitätsdiagramm:** **Startknoten** (gefüllter Kreis) · **Endknoten** (Kreis mit gefülltem Kern – beendet **alle** Aktivitäten) · **Ablaufende** (Kreis mit Kreuz – beendet **nur den aktuellen Fluss**) · Aktion (abgerundetes Rechteck) · **Schwimmbahnen** (Zuständige als Spalten) · Balken: **Teilung** (Splitting, ein Eingang, mehrere Ausgänge), **Synchronisation** (Und, mehrere Eingänge, ein Ausgang) oder beides in einem Balken · Raute: **Entscheidung** mit Bedingungen `[x<0]`, `[x>0]`, `[x=0]`, **Zusammenführung** (Oder) oder beides in einer Raute · Kreis mit Buchstaben (A … A): **Seitenwechsel**, damit der Fluss nicht quer über das Blatt laufen muss.

**Klassendiagramm:** Klasse (Name · Attribute · Methoden) · **{abstract}** / kursiver Name · **«interface»** · Notiz mit gestricheltem Strich · Attribut: `Sichtbarkeit Name : Typ {Eigenschaften}` · Methode: `Sichtbarkeit Name(parameter1 : Typ, …) : Rückgabetyp {Eigenschaften}` · Sichtbarkeit **+ public, # protected, − private, ~ package** · Eigenschaften `{static, final, …}` · **Vererbung** (durchgezogen, leere Spitze zur Oberklasse) · **Assoziation** (Linie) mit **Multiplizität** (1, \*) · **gerichtete Assoziation** (offene Pfeilspitze) · **Aggregation** (leere Raute beim Ganzen) · **Komposition** (**gefüllte** Raute beim Ganzen, Teil ist existenzabhängig) · **Implementierung** (gestrichelt, leere Spitze, zur Schnittstelle).

**Sequenzdiagramm:** Akteur und Objekte (`: Klasse1`) mit **Lebenslinie** (gestrichelt) und **Ausführungsbalken** · **synchrone Nachricht** (durchgezogen, gefüllte Spitze: der Sender wartet auf das Ende des Aufrufs, ein Rückgabewert ist möglich) · **Rückgabe** (gestrichelt) · **asynchrone Nachricht** (offene Spitze: keine Antwort erwartet) · **Selbstaufruf** · **create** (gestrichelter Pfeil auf das neue Objekt = Objekt-Konstruktion) · **Objekt-Destruktion** (Kreuz am Ende der Lebenslinie) · Rahmen **alt** (`[i>0]` / `[else]`), **opt** (`[Bedingung]`), **loop** (`[Bedingung]`) und **loop(10)** (feste Anzahl).

**Zustandsdiagramm:** Zustand (abgerundet, unten optional `entry/aktion`, `do/aktion`, `exit/aktion`, `ereignis/aktion`) · Startpunkt und Endzustand · Übergang mit der Beschriftung **`operation[bedingung]/verhalten`**, wobei die Operation der Auslöser (Trigger) ist · **`after(Zeitdauer)`** als Zeitereignis.

## 7.7 SQL-Auszug im Anhang

Der Anhang listet SQL im Stil von **MySQL** (Stand 2024-10-07), die Übungsdatenbank der App läuft mit **SQLite**. Die vollständige Gegenüberstellung steht im [SQL-Belegsatz](#/material/sql-belegsatz), Abschnitt 11. Der Auszug führt **kein** `CASE`, **keine** Fensterfunktionen, **kein** `COALESCE` und **kein** `LIMIT` auf – lernen und nutzen darfst du sie trotzdem; sicher in der Prüfung kommt aber nur, was im Auszug steht.

## 7.8 Formelübersicht: was drinsteht und was nicht

| Größe | Formel im Anhang | Hinweis |
|---|---|---|
| Mittelwert | $\bar{x} = \frac{1}{n}\sum x_i$ | |
| Median | n ungerade: $x_{(\frac{n+1}{2})}$ · n gerade: $\frac{1}{2}\left(x_{(\frac{n}{2})} + x_{(\frac{n}{2}+1)}\right)$ | Werte vorher **aufsteigend sortieren** |
| Empirische Varianz | $s^2 = \frac{1}{n-1}\sum (x_i - \bar{x})^2$ | **Der Anhang teilt durch n − 1** (Stichprobe). Bei vollständiger Grundgesamtheit (σ²) wird durch n geteilt – die Konvention dazu **hinschreiben** |
| Standardabweichung | $s = \sqrt{s^2}$ | |
| Kovarianz | $s_{xy} = \frac{1}{n-1}\sum (x_i-\bar{x})(y_i-\bar{y})$ | positiv: gleichsinnig, negativ: gegensinnig |
| Pearson-Korrelation | $r_{xy} = \frac{s_{xy}}{s_x s_y}$ | −1 bis +1 |
| Erwartungswert | $E(X) = \sum x_i p_i$ | bei gleicher Wahrscheinlichkeit = Mittelwert |
| Varianz (Zufallsvariable) | $Var(X) = E(X - E(X))^2$ | mit den Wahrscheinlichkeiten $p_i$ gewichtet, **ohne** n − 1 |
| Kovarianz (Zufallsvariable) | $COV(X,Y)$ wie im Anhang | gemeint ist der Erwartungswert des **Produkts** der Abweichungen: $E\big[(X-E(X))(Y-E(Y))\big]$ |
| Lineare Regression | $\hat{y} = \beta_0 + \beta_1 x$ · tatsächlich $y = \beta_0 + \beta_1 x + \epsilon$ · $RSS = \sum (y_i - \hat{y}_i)^2 \to \min$ | Methode der **kleinsten Quadrate**; $\beta_1 = s_{xy}/s_x^2$ und $\beta_0 = \bar{y} - \beta_1\bar{x}$ stehen **nicht** im Anhang – selbst wissen |

**Algorithmen im Anhang:**

- **ID3:** Gehören alle Beispiele zur selben Klasse → Blatt mit dieser Klasse; sonst Attribut A wählen, als Wurzel setzen, aus den Daten löschen, für jeden Attributwert eine Kante erzeugen und rekursiv den Teilbaum bauen. Auswahl nach dem höchsten **Informationsgewinn**: $Info(A) = \sum -p(a_i)\log_2 p(a_i)$, $Info(A,a_i) = \sum \frac{a_i}{A} Info(a_i)$ (gewichteter Mittelwert der Teilmengen), $Gewinn(A) = Info(A) - Info(A,a_i)$. Beachte die Schreibweise: $Info(A)$ ist hier die **Entropie der Klassenverteilung** vor dem Split, $Info(A,a_i)$ die gewichtete Entropie danach.
- **Random Forest:** für B Bäume: **Bootstrapping** (N Datensätze **mit Zurücklegen** ziehen), **m Attribute zufällig** auswählen, Entscheidungsbaum bauen (z. B. ID3). Klassifikation: Datensatz in jeden Baum geben, die **Mehrheit** der Entscheidungen gewinnt.
- **k-Nearest-Neighbor:** alle Trainingsbeispiele speichern; Ähnlichkeit des neuen Datensatzes zu allen berechnen, die **k ähnlichsten** wählen, die **häufigste Klasse** zuweisen. Abstand z. B. euklidisch: $dist_E(v,w) = \sqrt{\sum (v_i - w_i)^2}$.
- **k-Means:** k Punkte zufällig als Schwerpunkte · Punkte dem nächsten Schwerpunkt zuordnen · Schwerpunkte als Mittelwert neu berechnen · wiederholen, bis sich nichts mehr ändert.
- **Konfusionsmatrix:** Zeilen = tatsächliche Klasse, Spalten = vorhergesagte Klasse; TP und FN in der Zeile „Ja“, FP und TN in der Zeile „Nein“. **Accuracy** = (TP+TN)/(TP+TN+FP+FN) · **Precision** = TP/(TP+FP) · **Recall/Sensitivity** = TP/(TP+FN) · **Specificity** = TN/(TN+FP). **Nicht im Anhang:** F1-Score $= \frac{2 \cdot P \cdot R}{P + R}$, Fehlerrate = 1 − Accuracy, Bestimmtheitsmaß – selbst wissen.

## 7.9 Präfixe: Datenmengen nur mit Binärpräfixen

Der Anhang schreibt vor: **Dezimalpräfixe** (SI, Basis 10: kB, MB, GB …) gehören zu **physikalischen Größen** wie Strom, Leistung, Geschwindigkeit. **Datenmengen** werden mit **Binärpräfixen** (IEC, Basis 2) angegeben – „Angaben zu Datenmengen sind nur mit Binärpräfixen richtig“. Die Wahl zwischen Namen (Gibibyte) und Symbol (GiB) ist frei.

| Binärpräfix | Wert | Dezimal (nicht normgerecht) | Abweichung |
|---|---|---|---|
| Kibibyte (KiB) | 2¹⁰ = 1.024 Byte | Kilobyte (kB) 10³ | 2,40 % |
| Mebibyte (MiB) | 2²⁰ = 1.048.576 Byte | Megabyte (MB) 10⁶ | 4,86 % |
| Gibibyte (GiB) | 2³⁰ = 1.073.741.824 Byte | Gigabyte (GB) 10⁹ | 7,37 % |
| Tebibyte (TiB) | 2⁴⁰ = 1.099.511.627.776 Byte | Terabyte (TB) 10¹² | 9,95 % |
| Pebibyte (PiB) | 2⁵⁰ | Petabyte (PB) 10¹⁵ | 12,6 % |
| Exbibyte (EiB) | 2⁶⁰ | Exabyte (EB) 10¹⁸ | 15,3 % |
| Zebibyte (ZiB) | 2⁷⁰ | Zettabyte (ZB) 10²¹ | 18,1 % |
| Yobibyte (YiB) | 2⁸⁰ | Yottabyte (YB) 10²⁴ | 20,9 % |

**Rechnen:** Je Sprung um den Faktor 1.024 (nicht 1.000). 1 TiB = 1.024 GiB = 1.048.576 MiB. Ein Datenträger mit „500 GB“ (Herstellerangabe, dezimal) fasst $500 \cdot 10^9 / 2^{30} \approx 465{,}7$ GiB. Antworte bei „Wie viel Speicher braucht …?“ also in **KiB, MiB, GiB, TiB** – schreibst du GB, verlierst du den Punkt. Bei **Übertragungsraten** (Mbit/s) und bei **Leistung** (Watt, kWh) bleibt es dagegen beim Dezimalpräfix.

---

# Teil 8 – Fachbegriffe A–Z

Alle Fachbegriffe aus den Begriffskarten, den Wissenskarten und den fett gesetzten Begriffen der Lernblätter, jeweils mit Erklärung, wo es eine gibt (Begriffskarte vor Wissenskarte vor Lernblatt). Zum gezielten Suchen ist die Seite Glossar (Begriffe A–Z) mit Filterfeld praktischer; hier lässt sich die Liste am Stück lesen oder drucken. Begriffe mit eigener Begriffsseite sind verlinkt.

<!-- glossar-a-z -->

## Fachgespräch: typische Fragen zu Diagrammen

1. „Warum haben Sie in Ihrer Dokumentation BPMN und nicht EPK verwendet?“ (Erwartet: BPMN ist international genormt, zeigt Beteiligte über Pools und Lanes und Nachrichten zwischen ihnen, wird von Workflow-Werkzeugen ausgeführt; EPK ist vor allem im SAP/ARIS-Umfeld verbreitet)
2. „Wie lesen Sie die Kardinalitäten in Ihrem ER-Diagramm?“ (Erwartet: Notation nennen; bei Chen und Krähenfuß sagt die Angabe bei der gegenüberliegenden Entität, wie viele davon eine einzelne Entität dieser Seite hat; bei Min-Max steht bei jeder Entität ihre eigene Beteiligung)
3. „Warum ein Star-Schema und kein Snowflake-Schema?“ (Erwartet: weniger Joins, schnellere Abfragen, verständlich für Fachanwender; Redundanz in den Dimensionen wird im DWH bewusst in Kauf genommen)
4. „Woran erkennen Sie im Netzplan den kritischen Pfad?“ (Erwartet: Vorgänge mit Gesamtpuffer 0, längster Weg durch den Plan; jede Verzögerung dort verschiebt das Projektende)
5. „Warum haben Sie für die Verteilung der Lieferzeiten einen Boxplot gewählt?“ (Erwartet: zeigt Median, Streuung (IQR) und Ausreißer kompakt und erlaubt den Vergleich mehrerer Gruppen; der Mittelwert allein würde durch Ausreißer verzerrt)

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich zeichne einen Prozess in BPMN 2.0 mit Pools, Lanes, Gateways und Nachrichtenflüssen ohne Regelverstoß.
- [ ] Ich prüfe eine EPK auf die Regeln (Wechsel Ereignis/Funktion, kein Entscheiden nach Ereignis, gleiche Konnektoren).
- [ ] Ich lese ein Wertstromdiagramm und berechne Durchlaufzeit und Wertschöpfungsanteil.
- [ ] Ich ordne einer Fragestellung das passende UML-Diagramm zu und kenne die Symbole von Use-Case-, Klassen-, Aktivitäts-, Sequenz- und Zustandsdiagramm.
- [ ] Ich setze «include» und «extend» mit der richtigen Pfeilrichtung.
- [ ] Ich übersetze Kardinalitäten zwischen Chen-, Min-Max- und Krähenfußnotation.
- [ ] Ich skizziere ein Star-Schema und erkläre den Unterschied zum Snowflake-Schema.
- [ ] Ich stelle einen Algorithmus als Programmablaufplan und als Struktogramm dar.
- [ ] Ich lese aus einem Netzplan Puffer und kritischen Pfad ab und grenze ihn vom Gantt-Diagramm ab.
- [ ] Ich wähle für eine Aussage den passenden Diagrammtyp und begründe die Wahl.
- [ ] Ich weiß, was im Anhang der Prüfung steht (Notationen, SQL-Auszug, Formeln, Präfixe) und was ich selbst wissen muss.
- [ ] Ich rechne einen Netzplan mit dem Knotenaufbau und den Formeln des Anhangs (GP, FP).
- [ ] Ich gebe Datenmengen in Binärpräfixen (KiB, MiB, GiB, TiB) an und rechne zwischen ihnen um.
- [ ] Ich lese Boxplot, Histogramm, Pareto-Diagramm und ROC-Kurve und nenne ihre Kernaussage.
