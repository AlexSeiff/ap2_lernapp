# Musterlösungen Übungsklausur Statistik I (Deep Dive 3)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Rechenwege zählen. Ein richtiges Ergebnis ohne Weg bekommt in ungebundenen Aufgaben nie die volle Punktzahl – ein falsches Ergebnis mit korrektem Weg dagegen fast immer den Großteil (Folgefehler werden nur einmal bestraft). 92+ P = sehr gut.

**Sortierte Anlage:** 35, 40, 40, 45, 50, 55, 60, 65, 70, 90, 220 (n = 11, Summe = 770)

---

## Block A – Skalenniveaus (12 P)

**A1 (8 P):**
- (a) Kundennummer → **nominal**. Begründung: Die Zahl dient nur der Unterscheidung; eine Rangfolge oder Differenz ist ohne Bedeutung.
- (b) Kundenzufriedenheit → **ordinal**. Begründung: Es besteht eine klare Rangfolge, die Abstände zwischen den Stufen sind aber nicht nachweislich gleich groß.
- (c) Reparaturdauer → **verhältnisskaliert (metrisch)**, da ein absoluter Nullpunkt existiert und Verhältnisse sinnvoll sind (60 min sind doppelt so lang wie 30 min).
- (d) Kalenderjahr → **intervallskaliert**, da die Abstände gleich groß sind, das Jahr 0 aber willkürlich gesetzt ist.

*Prüferkommentar: Je 1 P pro korrekte Zuordnung (4 P), je 2 P für die beiden geforderten Begründungen. „Metrisch" statt „verhältnisskaliert" bei (c) wird voll anerkannt; bei (d) ist „metrisch" ebenfalls vertretbar, die Unterscheidung Intervall/Verhältnis zeigt jedoch das tiefere Verständnis.*

**A2 (4 P):**
Das Vorgehen ist unzulässig: Postleitzahlen sind trotz Zifferndarstellung **nominal** skaliert – sie kodieren Gebiete, keine Größenverhältnisse. Ein Mittelwert daraus ergibt keinen realen Ort und kann sogar auf ein Gebiet zeigen, in dem kein Kunde ansässig ist. *(2 P)*
Korrekte Alternative: Häufigkeitsauswertung der Postleitzahlen bzw. Bestimmung des **Modus** (häufigste PLZ / häufigste Region), gegebenenfalls eine geografische Verteilungsdarstellung. *(2 P)*

---

## Block B – Häufigkeitsverteilung (18 P)

**B1 (9 P):**

| Grund | h | f in % | kumuliert % |
|---|---|---|---|
| Transportschaden | 18 | 36,0 | 36,0 |
| Montagefehler | 15 | 30,0 | 66,0 |
| Falschlieferung | 9 | 18,0 | 84,0 |
| Materialfehler | 6 | 12,0 | 96,0 |
| Sonstiges | 2 | 4,0 | 100,0 |
| **Summe** | **50** | **100,0** | – |

*Prüferkommentar: 3 P relative Häufigkeiten, 3 P kumulierte Spalte, 2 P absteigende Sortierung, 1 P Summenzeile. Ohne Sortierung ist die kumulierte Spalte fachlich wertlos – dann max. 5 P.*

**B2 (5 P):**
**Drei** Fehlerarten (Transportschaden, Montagefehler, Falschlieferung) decken kumuliert **84 %** ab und überschreiten damit die 80-%-Marke. *(3 P)* Zugrunde liegt das **Pareto-Prinzip (80/20-Regel)**: Ein kleiner Teil der Ursachen verantwortet den Großteil der Fälle; die Optimierung setzt dort zuerst an. *(2 P)*

*Prüferkommentar: Häufigster Fehler ist die Antwort „zwei" (66 % – reicht nicht) oder „vier" (nicht die kleinste Anzahl).*

**B3 (4 P):**
Der Reklamationsgrund ist **nominal** skaliert – es gibt weder eine Rangfolge noch messbare Abstände, sodass sich weder ein Mittelwert noch eine Mitte der Reihenfolge bilden lässt. *(2 P)* Zulässiges Lagemaß ist der **Modus**; er lautet hier „Transportschaden". *(2 P)*

---

## Block C – Lagemaße (20 P)

**C1 (10 P):**
Sortiert: 35, 40, 40, 45, 50, 55, 60, 65, 70, 90, 220 *(2 P)*
- Arithmetisches Mittel: $\bar{x} = \frac{\sum x_i}{n} = \frac{770}{11}$ = **70,00 Minuten** *(3 P)*
- Median: $n = 11$ ist ungerade → Position $\frac{n+1}{2} = \frac{11+1}{2} = 6$ → **55 Minuten** *(3 P)*
- Modus = **40 Minuten** (einziger doppelt vorkommender Wert) *(2 P)*

*Prüferkommentar: Wer nicht sortiert, bestimmt den Median fast immer falsch – die Sortierung ist deshalb eigenständig bepunktet. Einheit „Minuten" nicht vergessen.*

**C2 (6 P):**
Der Mittelwert (70,00) liegt deutlich über dem Median (55) – ein Abstand von 15 Minuten. Ursache ist der Extremwert 220, der als einziger Wert den Mittelwert stark nach oben zieht; die Verteilung ist **rechtsschief**. *(3 P)*
Berichtet werden sollte der **Median**, da er die typische Bearbeitungsdauer robust abbildet und nicht von einem Einzelfall dominiert wird. Ideal ist die Angabe beider Werte zusammen mit einem Hinweis auf den Ausreißer – die Differenz selbst ist eine Information. *(3 P)*

*Prüferkommentar: Volle Punktzahl nur mit dem Begriff „rechtsschief" oder einer gleichwertigen Beschreibung („durch große Werte nach oben verzerrt") UND einer begründeten Empfehlung.*

**C3 (4 P):**
Gewichtetes arithmetisches Mittel: $\bar{x} = \frac{\sum n_i \cdot x_i}{\sum n_i} = \frac{4 \cdot 45 + 6 \cdot 70}{10} = \frac{180 + 420}{10} = \frac{600}{10}$ = **60,00 Minuten**

*Prüferkommentar: 2 P Ansatz, 2 P Ergebnis. Der ungewichtete Mittelwert (45+70)/2 = 57,5 ist falsch – 1 P Restpunkt für erkennbaren Rechenversuch.*

---

## Block D – Streuungsmaße (18 P)

**D1 (4 P):**
Spannweite: $R = x_{\max} - x_{\min} = 220 - 35$ = **185 Minuten**. *(2 P)*
Beurteilung: Die Aussagekraft ist gering, da die Spannweite ausschließlich von den beiden Extremwerten abhängt. Sie wird hier allein durch den Ausreißer 220 bestimmt und beschreibt die tatsächliche Streuung der übrigen Aufträge (35–90 min) nicht. Aussagekräftiger sind IQR oder Standardabweichung. *(2 P)*

**D2 (10 P):**
$\bar{x} = \frac{2 + 4 + 5 + 6 + 8}{5} = \frac{25}{5} = 5$ Tage

| x | x − x̄ | (x − x̄)² |
|---|---|---|
| 2 | −3 | 9 |
| 4 | −1 | 1 |
| 5 | 0 | 0 |
| 6 | 1 | 1 |
| 8 | 3 | 9 |
| **Σ 25** | **Σ 0** | **Σ 20** |

Varianz: $\sigma^2 = \frac{\sum (x_i - \bar{x})^2}{n} = \frac{20}{5}$ = **4 (Tage²)** · Standardabweichung: $\sigma = \sqrt{\sigma^2} = \sqrt{4}$ = **2,00 Tage**

*Prüferkommentar: 2 P Mittelwert, 3 P vollständige Abweichungstabelle, 2 P Summe der Abweichungsquadrate, 2 P Varianz, 1 P Standardabweichung. Wer mit n − 1 rechnet (s² = 5, s = 2,24), verfehlt die Aufgabenstellung – ausdrücklich verlangt war die Grundgesamtheit (÷ n). Mittelwert, Tabelle und Summe der Abweichungsquadrate bleiben bepunktet (max. 7 P), Varianz und Standardabweichung nicht. Kontrolle: Σ(x − x̄) muss 0 ergeben.*

**D3 (4 P):**
- Filiale Nord: $\text{VK} = \frac{\sigma}{\bar{x}} = \frac{5}{50} = 0{,}10$ = **10 %**
- Filiale Süd: $\text{VK} = \frac{8}{100} = 0{,}08$ = **8 %**

Beurteilung: Filiale Süd streut **absolut** stärker (8 min > 5 min), **relativ zum eigenen Niveau** jedoch geringer. Bezogen auf die jeweilige durchschnittliche Bearbeitungsdauer arbeitet damit **Filiale Süd gleichmäßiger**. *(2 P Berechnung, 2 P Beurteilung)*

*Prüferkommentar: Die Antwort „Nord, weil 5 < 8" ignoriert die Aufgabenstellung und gibt 0 P im Beurteilungsteil – genau diese Verwechslung ist der Zweck der Aufgabe.*

---

## Block E – Boxplot und Ausreißer (20 P)

**E1 (8 P):**
Konvention: Position = n · p; bei nicht ganzzahligem Ergebnis wird aufgerundet und der Wert an dieser Position genommen, bei ganzzahligem Ergebnis das Mittel aus diesem und dem nächsten Wert. *(2 P – Positionen n · p korrekt bestimmt und gerundet)*
- Q1: $n \cdot p = 11 \cdot 0{,}25 = 2{,}75$ → aufrunden auf Position 3 → **Q1 = 40** *(2 P)*
- Q3: $n \cdot p = 11 \cdot 0{,}75 = 8{,}25$ → aufrunden auf Position 9 → **Q3 = 70** *(2 P)*
- $\text{IQR} = Q_3 - Q_1 = 70 - 40$ = **30 Minuten** *(2 P)*

*Prüferkommentar: Andere gängige Konventionen liefern hier leicht abweichende Werte (z. B. Q1 = 42,5 und Q3 = 67,5 bei linearer Interpolation wie Excel QUARTILE.INKL; IQR = 25, Zäune 5 und 105). Am Ergebnis von E2 und E3 ändert das nichts: 220 bleibt der einzige Ausreißer, die Whisker reichen von 35 bis 90. Diese werden voll anerkannt, sofern die Methode benannt und durchgängig angewendet wurde. Ohne Methodenangabe gibt es bei Abweichung von der Musterlösung Abzug – deshalb immer dazuschreiben.*

**E2 (6 P):**
- Unterer Zaun: $Q_1 - 1{,}5 \cdot \text{IQR} = 40 - 1{,}5 \cdot 30 = 40 - 45$ = **−5** *(2 P)*
- Oberer Zaun: $Q_3 + 1{,}5 \cdot \text{IQR} = 70 + 1{,}5 \cdot 30 = 70 + 45$ = **115** *(2 P)*
- Ausreißer: **220** (einziger Wert außerhalb der Zäune) *(2 P)*

*Prüferkommentar: Häufigster Fehler ist „1,5 · Q3" statt „1,5 · IQR". Der negative untere Zaun ist kein Fehler – er bedeutet lediglich, dass es nach unten keine Ausreißer geben kann.*

**E3 (6 P):**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 160" width="640" height="160" role="img" aria-label="Boxplot auf einer Minutenachse: unterer Whisker 35, Box von 40 bis 70 mit Median 55, oberer Whisker 90, oberer Zaun 115, Ausreißer 220">
<line x1="40" y1="130" x2="568" y2="130" class="dg-linie"/>
<line x1="40" y1="130" x2="40" y2="136" class="dg-linie"/>
<line x1="84" y1="130" x2="84" y2="133" class="dg-linie"/>
<line x1="128" y1="130" x2="128" y2="136" class="dg-linie"/>
<line x1="172" y1="130" x2="172" y2="133" class="dg-linie"/>
<line x1="216" y1="130" x2="216" y2="136" class="dg-linie"/>
<line x1="260" y1="130" x2="260" y2="133" class="dg-linie"/>
<line x1="304" y1="130" x2="304" y2="136" class="dg-linie"/>
<line x1="348" y1="130" x2="348" y2="133" class="dg-linie"/>
<line x1="392" y1="130" x2="392" y2="136" class="dg-linie"/>
<line x1="436" y1="130" x2="436" y2="133" class="dg-linie"/>
<line x1="480" y1="130" x2="480" y2="136" class="dg-linie"/>
<line x1="524" y1="130" x2="524" y2="133" class="dg-linie"/>
<line x1="568" y1="130" x2="568" y2="136" class="dg-linie"/>
<text x="40" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0</text>
<text x="128" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">40</text>
<text x="216" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">80</text>
<text x="304" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">120</text>
<text x="392" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">160</text>
<text x="480" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">200</text>
<text x="568" y="147" text-anchor="middle" dominant-baseline="middle" class="dg-klein">240</text>
<text x="576" y="130" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Minuten</text>
<line x1="117" y1="70" x2="128" y2="70" class="dg-linie"/>
<line x1="194" y1="70" x2="238" y2="70" class="dg-linie"/>
<line x1="117" y1="58" x2="117" y2="82" class="dg-linie"/>
<line x1="238" y1="58" x2="238" y2="82" class="dg-linie"/>
<rect x="128" y="52" width="66" height="36" class="dg-akzent"/>
<line x1="161" y1="52" x2="161" y2="88" class="dg-linie dg-dick"/>
<circle cx="524" cy="70" r="5" class="dg-form"/>
<line x1="293" y1="30" x2="293" y2="130" class="dg-linie dg-duenn dg-strich"/>
<text x="299" y="36" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">oberer Zaun 115</text>
<text x="128" y="42" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">40</text>
<text x="161" y="42" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">55</text>
<text x="194" y="42" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">70</text>
<text x="117" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">35</text>
<text x="238" y="96" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">90</text>
<text x="524" y="90" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">220</text>
<text x="524" y="54" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ausreißer</text>
</svg>
```

Erforderliche Elemente: Box von 40 bis 70 *(1 P)*, Medianstrich bei 55 *(1 P)*, unterer Whisker bis 35 *(1 P)*, oberer Whisker bis **90** *(2 P)*, Ausreißer 220 als separater Punkt *(1 P)*.

*Prüferkommentar: Der entscheidende Punkt ist das obere Whisker-Ende. Es endet beim größten Wert **innerhalb** des Zauns (90) – nicht beim Zaun selbst (115) und erst recht nicht beim Ausreißer (220). Genau hier verlieren die meisten Prüflinge Punkte.*

---

## Block F – Beurteilung (12 P)

**F1 (7 P):**
Der Vorschlag ist **abzulehnen**. Der Wert ist kein Erfassungsfehler, sondern ein fachlich erklärbarer echter Extremfall (Ersatzteilbeschaffung). Ein Löschen würde die Datenqualitätsdimension **Korrektheit** verletzen und ausgerechnet die Fälle unsichtbar machen, die für eine Prozessoptimierung am interessantesten sind – die lange Wartezeit auf Ersatzteile ist ein realer Schwachpunkt des Prozesses. *(3 P)*

Fachlich korrektes Vorgehen: *(je 1 P, max. 4 P)*
1. **Ursache klären:** Prüfen, ob Erfassungsfehler oder echter Wert – hier belegt als echter Sonderfall.
2. **Entscheidung treffen und dokumentieren:** Wert im Datenbestand belassen; für die Auswertung der Regelbearbeitung gegebenenfalls als eigene Kategorie „mit Ersatzteilbeschaffung" gesondert ausweisen, statt ihn zu entfernen.
3. **Auswirkung transparent machen:** Kennzahlen mit und ohne Sonderfälle berichten (hier: Mittelwert 70,00 vs. 55,00 Minuten ohne den Extremwert) und zusätzlich robuste Maße wie Median und IQR verwenden.

*Prüferkommentar: Eine reine Ablehnung ohne Alternativvorgehen gibt max. 3 P. Wer erkennt, dass der Ausreißer selbst ein Optimierungshinweis ist, zeigt DPA-Niveau.*

**F2 (5 P):**
Mögliche Ursachen und Maßnahmen *(je 1 P Ursache, 1 P Maßnahme; 1 P für den Bezug zur Datenqualität)*:
- **Platzhalter- bzw. Default-Wert:** Das System schreibt 0, wenn kein Wert erfasst wurde – die Dauer ist in Wahrheit unbekannt, nicht null. Maßnahme: Feld als Pflichtfeld definieren, Default entfernen, fehlende Werte als NULL statt 0 speichern, damit sie in Auswertungen nicht als echte Nullen mitgerechnet werden.
- **Prozessbedingter Erfassungsfehler:** Techniker schließen den Auftrag ohne Zeiterfassung ab, oder Start- und Endzeitstempel sind identisch. Maßnahme: Plausibilitätsprüfung bei der Eingabe (CHECK-Constraint `dauer > 0`), automatische Zeiterfassung statt manueller Eingabe, Schulung.

Bezug: Betroffen sind die Dimensionen **Vollständigkeit** (fehlende Werte getarnt als 0) und **Korrektheit**; unentdeckt senken 14 Nullwerte den berechneten Mittelwert systematisch.

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Rechenwege sitzen – wöchentlich eine Aufgabe zur Auffrischung |
| 81–91 | gut | Fehlerthemen ins Fehlerjournal, in ein bis zwei Wochen gezielt nachrechnen |
| < 81 | | Teil 3–5 des Lernzettels wiederholen, Klausur nach einer Woche neu schreiben |

Zwei Hinweise aus der Korrekturpraxis: Erstens gehen die meisten Punkte nicht beim Rechnen verloren, sondern bei **Einheiten, Sortierung und fehlenden Begründungen**. Zweitens sind die Beurteilungsaufgaben (Block F) für die 1 entscheidend – rechnen können viele, argumentieren wenige.
