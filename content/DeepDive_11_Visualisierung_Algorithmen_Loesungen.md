# Musterlösungen Übungsklausur Visualisierung & Algorithmen (Deep Dive 11)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Bei Pseudocode wird **Logik** bewertet, nicht Syntax. Abweichende Schreibweisen sind zulässig, solange der Ablauf eindeutig ist. Punktabzug gibt es für fehlende Initialisierung, falsche Schleifengrenzen und nicht behandelte Randfälle. 92+ P = sehr gut.

---

## Block A – Diagrammwahl (20 P)

**A1 (12 P):** *(je 1 P Diagrammtyp, 1 P Begründung)*

| | Auswertung | Diagrammtyp | Begründung |
|---|---|---|---|
| a | Monatsumsatz über 24 Monate | **Liniendiagramm** | zeigt eine Entwicklung über die Zeit; die Verbindung der Punkte macht Trend und Saison sichtbar |
| b | Umsatzvergleich der acht Filialen | **Balken-/Säulendiagramm**, absteigend sortiert | Kategorienvergleich; Balkenlängen sind exakt vergleichbar |
| c | Verteilung der Reparaturdauern | **Histogramm** (alternativ Boxplot) | zeigt die Form der Verteilung, Häufungen und Ausreißer |
| d | Werbebudget und Umsatz | **Streudiagramm** | stellt den Zusammenhang zweier metrischer Merkmale dar |
| e | Anteil von vier Produktkategorien | **Kreisdiagramm** oder gestapelter Balken | Anteile am Ganzen; bei nur vier Kategorien vertretbar |
| f | Umsatz je Filiale und Monat | **Heatmap** | zwei Dimensionen gleichzeitig; Muster und Ausreißer sofort erkennbar |

*Prüferkommentar: Bei (e) ist das Kreisdiagramm hier ausnahmsweise zulässig, weil nur vier Kategorien vorliegen – wer stattdessen den gestapelten Balken wählt und das begründet, erhält ebenfalls volle Punkte. Bei (b) ist das Liniendiagramm falsch: Filialen sind kategorial, eine Verbindungslinie suggeriert einen Verlauf, den es nicht gibt.*

**A2 (8 P):**
Drei Mängel *(je 2 P)*:
1. **Zu viele Segmente:** Acht Filialen sind für ein Kreisdiagramm deutlich zu viel. Winkelflächen lassen sich vom Auge schlecht vergleichen, besonders bei ähnlich großen Anteilen.
2. **3D-Effekt:** Die perspektivische Darstellung vergrößert die vorderen Segmente optisch und verzerrt damit die Größenverhältnisse – die Darstellung ist sachlich irreführend.
3. **Alphabetische Sortierung:** Die Reihenfolge trägt keine Information. Bei einem Umsatzvergleich ist die Rangfolge selbst die zentrale Aussage.

Besserer Vorschlag *(2 P)*: Ein **waagerechtes Balkendiagramm, absteigend nach Umsatz sortiert**, mit Nullpunkt und direkter Wertbeschriftung an den Balken. Begründung: Balkenlängen sind exakt vergleichbar, die Rangfolge ist unmittelbar ablesbar, und lange Filialnamen lassen sich ohne Drehung darstellen.

---

## Block B – Diagramme beurteilen (22 P)

**B1 (12 P):**

**a) (4 P):** Gesamtwachstum: $\frac{5{,}10 - 4{,}80}{4{,}80} \cdot 100 = \frac{0{,}30}{4{,}80} \cdot 100$ = **6,25 %**
Zwischenschritte: 4,80 → 4,95 entspricht +3,13 %, 4,95 → 5,10 entspricht +3,03 %.

**b) (4 P):** Da die Achse bei 4,70 Mio. € beginnt, werden nur die Beträge oberhalb dieser Grenze dargestellt: 0,10 / 0,25 / 0,40 Mio. €. Die sichtbaren Säulenhöhen verhalten sich dadurch wie **1 : 2,5 : 4** – der Eindruck einer Vervierfachung entsteht, obwohl der Umsatz tatsächlich nur um 6,25 % gestiegen ist (sichtbar +300 % gegenüber +6,25 % in den Daten – Lügenfaktor nach Tufte 48). Bei Säulen- und Balkendiagrammen codiert die Länge den Wert; ein fehlender Nullpunkt macht die Darstellung deshalb sachlich falsch.

**c) (4 P):** Die Überschrift „Umsatz explodiert" ist **nicht haltbar**. Ein Zuwachs von 6,25 % über drei Jahreswerte – also zwei Jahresschritte von +3,13 % und +3,03 % – entspricht rund 3 % jährlich und liegt damit im Bereich normaler Entwicklung; nach Abzug der Inflation bleibt real nur ein kleines Plus. Die Überschrift verstärkt die ohnehin schon verzerrende Achsenwahl. Sachlich korrekt wäre etwa: **„Umsatz wächst stetig um rund 3 % pro Jahr"** oder „Umsatzentwicklung 2024–2026: +6,25 %".

*Prüferkommentar: Volle Punktzahl in (c) nur mit Alternativformulierung. Die Aufgabe verlangt beides – Beurteilung und Vorschlag.*

**B2 (6 P):** *(je 2 P: 1 P Technik, 1 P Wirkung; drei genügen)*
- **Gestauchte oder gedehnte Achse:** Ein gestreckter Zeitraum lässt Schwankungen dramatisch erscheinen, ein gestauchter glättet echte Einbrüche.
- **Zwei Y-Achsen mit unterschiedlicher Skalierung:** Zwei unabhängige Größen werden so skaliert, dass ihre Kurven parallel verlaufen – es entsteht der Eindruck eines Zusammenhangs, den die Daten nicht belegen.
- **Selektiver Zeitausschnitt:** Durch geschickte Wahl des Startpunkts wird aus einem langfristigen Rückgang ein kurzfristiger Anstieg.
- **Ungleiche Klassenbreiten im Histogramm:** Breite Klassen sammeln mehr Fälle und erscheinen dadurch bedeutsamer, als sie sind.
- **Fehlende Achsenbeschriftung oder Einheiten:** Größenordnungen bleiben unklar und werden vom Betrachter geschätzt.
- **Absolute statt relativer Zahlen (oder umgekehrt):** Ein Anstieg von 2 auf 3 Fällen ist „+50 %" – klingt dramatisch, ist es nicht.

**B3 (4 P):**
Rund 8 % der Männer und etwa 0,5 % der Frauen haben eine Farbfehlsichtigkeit, überwiegend im Rot-Grün-Bereich. Wird eine Information ausschließlich über Farbe codiert – etwa rote gegen grüne Balken für „unter" und „über Plan" –, ist die Aussage für diese Personen nicht erfassbar. Zusätzlich gehen Farben in Schwarz-Weiß-Ausdrucken verloren. *(2 P)*
Alternativen *(je 1 P, zwei genügen)*: zusätzliche **Beschriftung** direkt am Element; unterschiedliche **Formen oder Muster** (Schraffuren, Symbole); Verwendung von **Helligkeitsunterschieden** statt reiner Farbtonunterschiede; Anordnung und Sortierung als zusätzlicher Informationsträger.

---

## Block C – Dashboard konzipieren (14 P)

**C1 (8 P):** *(je Kennzahl 2 P: 1 P Kennzahl mit Darstellung, 1 P Begründung)* Beispiel:

| Kennzahl | Darstellung | Begründung |
|---|---|---|
| **Durchschnittliche Durchlaufzeit** (Median) | Liniendiagramm über 12 Monate mit Zielwertlinie | zeigt Entwicklung und Zielerreichung auf einen Blick; Median statt Mittelwert wegen Ausreißern |
| **First Pass Yield / Fehlerquote** | großer Kennzahlenwert mit Ampelfarbe und Vormonatsvergleich | zentrale Qualitätsgröße; Geschäftsführung braucht sofort den Status, nicht die Details |
| **Reparaturaufträge je Filiale** | waagerechtes Balkendiagramm, absteigend sortiert | macht Ausreißerfilialen unmittelbar sichtbar |
| **Wertschöpfungsanteil (Bearbeitungs- zu Durchlaufzeit)** | Kennzahl mit Trendpfeil | zeigt das Optimierungspotenzial im Prozess (→ Deep Dive 5) |

*Ebenfalls anerkannt: Termintreue, Nacharbeitskosten, Auslastung der Werkstatt, Top-5-Reklamationsgründe als Pareto-Diagramm.*

**C2 (6 P):**
Drei Gestaltungsgrundsätze *(je 1 P)*:
1. **Zielgruppengerechte Verdichtung:** Für die Geschäftsführung wenige aggregierte Kennzahlen, keine Detailtabellen; Details erst auf Nachfrage (Drill-down).
2. **Wichtigstes zuerst:** Die zentrale Kennzahl links oben, entsprechend der üblichen Leserichtung.
3. **Einheitliche Skalen und Farbcodierung** über alle Diagramme hinweg, damit nebeneinanderstehende Darstellungen vergleichbar bleiben.
4. **Aktualitätsangabe:** Stand der Daten sichtbar machen.
5. **Begrenzung auf fünf bis sieben Kennzahlen** je Sicht.

Vergleichsmaßstab *(3 P)*: Eine Zahl allein ist keine Information – „Durchlaufzeit 30 Stunden" lässt sich ohne Bezug nicht bewerten. Erst ein Vergleich mit dem **Vormonat, dem Vorjahr oder dem Zielwert** zeigt, ob der Wert gut oder schlecht ist und ob sich etwas verändert hat. Ohne Bezugsgröße entsteht kein Handlungsimpuls, und das Dashboard bleibt folgenlos.

---

## Block D – Algorithmen entwickeln (28 P)

**D1 (6 P):**
**Kopfgesteuerte Schleife (SOLANGE):** Die Bedingung wird **vor** jedem Durchlauf geprüft. Ist sie von Anfang an nicht erfüllt, wird der Rumpf **nullmal** ausgeführt. Anwendungsfall: Eine Datei zeilenweise einlesen – ist die Datei leer, darf gar nichts verarbeitet werden. *(3 P)*
**Fußgesteuerte Schleife (WIEDERHOLE BIS):** Die Bedingung wird **nach** jedem Durchlauf geprüft, der Rumpf läuft daher **mindestens einmal**. Anwendungsfall: Eine Benutzereingabe anfordern und wiederholen, bis sie gültig ist – einmal gefragt werden muss in jedem Fall. *(3 P)*

**D2 (12 P):**

```
ALGORITHMUS Reparaturdauern_pruefen
EINGABE: dauer[1..n]
AUSGABE: anzahl_gueltig, anzahl_ungueltig, mittelwert

anzahl_gueltig    ← 0
anzahl_ungueltig  ← 0
summe             ← 0

FÜR i VON 1 BIS n
    WENN dauer[i] IST LEER ODER dauer[i] <= 0 DANN
        anzahl_ungueltig ← anzahl_ungueltig + 1
    SONST
        anzahl_gueltig ← anzahl_gueltig + 1
        summe ← summe + dauer[i]
    ENDE WENN
ENDE FÜR

WENN anzahl_gueltig > 0 DANN
    mittelwert ← summe / anzahl_gueltig
    AUSGABE anzahl_gueltig, anzahl_ungueltig, mittelwert
SONST
    AUSGABE anzahl_gueltig, anzahl_ungueltig
    AUSGABE "Kein gueltiger Wert vorhanden - Mittelwert nicht berechenbar"
ENDE WENN
```

*Prüferkommentar zur Punktevergabe: 2 P Initialisierung aller drei Variablen vor der Schleife · 2 P korrekte Schleifengrenzen (1 BIS n) · 3 P vollständige Gültigkeitsprüfung (leer **und** ≤ 0) · 2 P Summenbildung ausschließlich über gültige Werte · 2 P Division durch die Anzahl **gültiger** Werte · 1 P Behandlung des Randfalls „kein gültiger Wert".*

**Die drei häufigsten Fehler:** Die Summe wird durch `n` statt durch `anzahl_gueltig` geteilt – dann verfälschen die ungültigen Sätze den Mittelwert. Die Prüfung auf fehlende Werte fehlt, sodass leere Felder als 0 einfließen. Und die Nullprüfung vor der Division fehlt, was bei einer Liste ohne gültige Werte zum Abbruch führt.

**D3 (10 P):**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 330" width="640" height="330" role="img" aria-label="Struktogramm: Zählschleife über alle Datensätze; ohne E-Mail wird der Fehlerzähler erhöht und der Datensatz protokolliert, bei ungültigem Format nur der Zähler erhöht">
<rect x="20" y="20" width="600" height="290" class="dg-form"/>
<text x="30" y="35" text-anchor="start" dominant-baseline="middle">fehlerzaehler ← 0</text>
<line x1="20" y1="50" x2="620" y2="50" class="dg-linie"/>
<text x="30" y="65" text-anchor="start" dominant-baseline="middle" class="dg-fett">FÜR i VON 1 BIS n</text>
<line x1="50" y1="80" x2="620" y2="80" class="dg-linie"/>
<line x1="50" y1="80" x2="50" y2="280" class="dg-linie"/>
<line x1="50" y1="80" x2="420" y2="120" class="dg-linie"/>
<line x1="620" y1="80" x2="420" y2="120" class="dg-linie"/>
<text x="400" y="93" text-anchor="middle" dominant-baseline="middle">E-Mail vorhanden?</text>
<text x="60" y="112" text-anchor="start" dominant-baseline="middle" class="dg-klein">ja</text>
<text x="610" y="112" text-anchor="end" dominant-baseline="middle" class="dg-klein">nein</text>
<line x1="50" y1="120" x2="620" y2="120" class="dg-linie"/>
<line x1="420" y1="120" x2="420" y2="280" class="dg-linie"/>
<text x="430" y="137" text-anchor="start" dominant-baseline="middle">fehlerzaehler ←</text>
<text x="430" y="154" text-anchor="start" dominant-baseline="middle">  fehlerzaehler + 1</text>
<line x1="420" y1="170" x2="620" y2="170" class="dg-linie"/>
<text x="430" y="225" text-anchor="start" dominant-baseline="middle">Datensatz protokollieren</text>
<line x1="50" y1="120" x2="110" y2="160" class="dg-linie"/>
<line x1="420" y1="120" x2="110" y2="160" class="dg-linie"/>
<text x="230" y="133" text-anchor="middle" dominant-baseline="middle">Format gültig?</text>
<text x="56" y="153" text-anchor="start" dominant-baseline="middle" class="dg-klein">ja</text>
<text x="412" y="153" text-anchor="end" dominant-baseline="middle" class="dg-klein">nein</text>
<line x1="50" y1="160" x2="420" y2="160" class="dg-linie"/>
<line x1="110" y1="160" x2="110" y2="280" class="dg-linie"/>
<text x="80" y="220" text-anchor="middle" dominant-baseline="middle">∅</text>
<text x="120" y="220" text-anchor="start" dominant-baseline="middle">fehlerzaehler ← fehlerzaehler + 1</text>
<line x1="20" y1="280" x2="620" y2="280" class="dg-linie"/>
<text x="30" y="295" text-anchor="start" dominant-baseline="middle">AUSGABE fehlerzaehler</text>
</svg>
```

Das Zeichen ∅ markiert einen leeren Zweig (keine Anweisung). Wer bei ungültigem Format zusätzlich protokolliert, wird nicht abgewertet – verlangt ist dort aber nur das Erhöhen des Zählers.

*Punktevergabe: 2 P Initialisierung des Zählers **vor** der Schleife · 2 P Schleife über alle Datensätze · 3 P äußere Verzweigung (E-Mail vorhanden ja/nein) · 2 P **verschachtelte** innere Verzweigung zur Formatprüfung im Ja-Zweig · 1 P Ausgabe nach der Schleife.*

*Prüferkommentar: Der häufigste Fehler ist eine Formatprüfung auf gleicher Ebene statt verschachtelt – dann wird das Format auch bei fehlender Adresse geprüft, was fachlich unsinnig ist und den Fehler doppelt zählt. Der zweithäufigste: Der Zähler steht innerhalb der Schleife und wird bei jedem Datensatz zurückgesetzt.*

---

## Block E – Fehlersuche (16 P)

**E1 (12 P):** *(je Fehler 3 P: 1 P Benennung, 1 P Auswirkung, 1 P Korrektur)*

**Fehler 1 – Schleifengrenze `BIS n-1` (Off-by-one)**
Auswirkung: Der letzte Auftrag der Liste wird nie geprüft. Ist ausgerechnet er der höchste, wird ein falsches Maximum ausgegeben; die Zählung ist ebenfalls um bis zu eins zu niedrig.
Korrektur: `FÜR i VON 1 BIS n`

**Fehler 2 – `anzahl ← 0` steht innerhalb der Schleife**
Auswirkung: Der Zähler wird bei jedem Durchlauf zurückgesetzt. Am Ende steht dort höchstens 1 – nämlich nur dann, wenn der **letzte** geprüfte Auftrag über 1.000 € lag.
Korrektur: Die Initialisierung vor die Schleife verschieben, zu `max ← …`.

**Fehler 3 – Bedingung `> 1000 UND < 500`**
Auswirkung: Die Bedingung ist logisch unerfüllbar – kein Wert kann gleichzeitig über 1.000 und unter 500 liegen. Der Zähler bleibt immer 0.
Korrektur: `WENN auftrag[i] > 1000 DANN` (die zweite Teilbedingung entfällt ersatzlos).

**Fehler 4 – `max ← 0` als Initialisierung**
Auswirkung: Enthält die Liste ausschließlich negative Werte (z. B. Stornierungen oder Gutschriften), bleibt das Maximum fälschlich bei 0 – einem Wert, der gar nicht in den Daten vorkommt.
Korrektur: `max ← auftrag[1]` und die Schleife weiterhin von 1 bis n laufen lassen. Achtung: Würde die Schleife hier erst bei `i = 2` beginnen, fehlte der erste Auftrag in der Zählung der Aufträge über 1.000 € – der Vergleich des ersten Elements mit sich selbst schadet dagegen nicht.

*Ebenfalls als Fehler anerkannt: fehlende Behandlung einer leeren Liste (n = 0); fehlende Angabe der Ausgabe im Algorithmuskopf (`AUSGABE: max, anzahl`).*

**E2 (4 P):**
Die Initialisierung `max ← 0` setzt stillschweigend voraus, dass mindestens ein Wert nicht negativ ist. Trifft das nicht zu – etwa wenn eine Auswertung nur Gutschriften, Stornobuchungen oder Korrekturbeträge enthält –, gibt der Algorithmus 0 als Maximum aus, obwohl dieser Wert in den Daten überhaupt nicht vorkommt. *(2 P)*
Der Fehler ist besonders tückisch, weil er **keinen Programmabbruch auslöst**: Das Ergebnis ist plausibel aussehend und trotzdem falsch. Robuster ist die Initialisierung mit dem ersten Listenelement, weil sie unabhängig vom Wertebereich funktioniert – vorausgesetzt, die Liste ist nicht leer, was zusätzlich zu prüfen ist. *(2 P)*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | zwei Struktogramme pro Woche zeichnen, um die Routine zu halten |
| 81–91 | gut | Prüfe, ob die Punkte im Visualisierungs- oder im Algorithmenteil fehlten |
| < 81 | | Teil B wiederholen und drei eigene Pseudocode-Aufgaben lösen |

**Ein Hinweis aus der Korrekturpraxis:** Bei Pseudocode-Aufgaben verlieren gute Kandidaten die meisten Punkte an drei Stellen – **fehlende Initialisierung**, **falsche Schleifengrenze** und **nicht behandelte Randfälle** (leere Liste, Division durch null). Gewöhne dir an, jeden Algorithmus nach dem Schreiben mit drei Testfällen gedanklich durchzuspielen: eine normale Liste, eine leere Liste und eine Liste, in der ausschließlich ungültige Werte stehen. Wer das macht, findet seine eigenen Fehler vor dem Prüfer.
