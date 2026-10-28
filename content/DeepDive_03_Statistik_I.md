# Deep Dive 3: Statistik I – Beschreibende Statistik
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Die beschreibende Statistik ist der **Rechenteil** von „Sicherstellen der Datenqualität" – und damit der Aufgabentyp, bei dem du am sichersten volle Punktzahl holen kannst, weil die Rechenwege eindeutig sind. Typische Formate: Häufigkeitstabelle vervollständigen, Lage- und Streuungsmaße berechnen, Boxplot lesen oder skizzieren, Ausreißer identifizieren und **beurteilen**, was mit ihnen geschehen soll.

Der letzte Punkt ist der DPA-Kern: Nicht das Rechnen unterscheidet dich vom Durchschnittsprüfling, sondern die **Interpretation** – „Was sagt mir diese Kennzahl über die Qualität meiner Daten?"

Szenario bleibt die **Möbelhaus Nordholz GmbH** (Reparaturservice aus Deep Dive 2).

---

# Teil 1 – Skalenniveaus

Das Skalenniveau entscheidet, **welche Rechenoperationen überhaupt zulässig sind**. Eine falsch berechnete Kennzahl auf falschem Skalenniveau ist ein klassischer Punktverlust.

| Skala | Eigenschaft | Beispiel | Zulässig |
|---|---|---|---|
| **Nominal** | nur gleich/ungleich, keine Reihenfolge | Kundennummer, Reklamationsgrund, Postleitzahl | Häufigkeiten, **Modus** |
| **Ordinal** | Rangfolge, aber ungleiche Abstände | Schulnote, Zufriedenheit (1–5), Prioritätsstufe | + **Median**, Quartile |
| **Intervall** | gleiche Abstände, **kein** absoluter Nullpunkt | Temperatur °C, Kalenderjahr | + Mittelwert, Differenzen |
| **Verhältnis (Ratio)** | gleiche Abstände **und** absoluter Nullpunkt | Umsatz, Dauer, Menge, Gewicht | + Verhältnisse („doppelt so viel"), Variationskoeffizient |

Intervall und Verhältnis werden zusammen als **metrisch** (kardinal) bezeichnet. Zusätzlich unterscheidet man **diskret** (abzählbar: Anzahl Reklamationen) und **stetig** (beliebig teilbar: Bearbeitungsdauer).

**Die Standardfalle:** Postleitzahlen und Kundennummern sind Zahlen, aber **nominal** – ein Mittelwert aus Postleitzahlen ist Unsinn. Ebenso: 20 °C ist **nicht** „doppelt so warm" wie 10 °C (kein absoluter Nullpunkt). Bei 20 € und 10 € ist das Verhältnis dagegen zulässig.

> ❓ **Prüferfrage:** Ein Kollege berechnet den Mittelwert der Schulnoten „gut/befriedigend/ausreichend". Beurteilen Sie das.
> *Schulnoten sind ordinal – die Abstände zwischen den Stufen sind nicht nachweislich gleich groß. Formal korrekt wäre der Median. In der Praxis wird der Notendurchschnitt trotzdem gebildet; das ist eine bewusste Vereinfachung, die man kennen und benennen sollte.*

---

# Teil 2 – Häufigkeitsverteilungen

| Begriff | Bedeutung | Formel |
|---|---|---|
| absolute Häufigkeit h | Anzahl der Nennungen | Auszählung |
| relative Häufigkeit f | Anteil an allen Fällen | $f = \frac{h}{n}$ |
| kumulierte Häufigkeit | Summe bis einschließlich dieser Kategorie | fortlaufend addieren |

Beispiel (50 Reklamationen des Möbelhauses):

| Grund | h | f | f in % | kumuliert % |
|---|---|---|---|---|
| Transportschaden | 18 | 0,36 | 36,0 | 36,0 |
| Montagefehler | 15 | 0,30 | 30,0 | 66,0 |
| Falschlieferung | 9 | 0,18 | 18,0 | 84,0 |
| Materialfehler | 6 | 0,12 | 12,0 | 96,0 |
| Sonstiges | 2 | 0,04 | 4,0 | 100,0 |
| **Summe** | **50** | **1,00** | **100,0** | – |

Kontrolle: Die relativen Häufigkeiten summieren sich immer auf 1 bzw. 100 % – rechne das in der Prüfung nach, es deckt Rechenfehler sofort auf.

**Pareto-Prinzip (80/20):** Sortiert man absteigend und kumuliert, zeigt sich, welche wenigen Ursachen den Großteil der Fälle verursachen. Hier decken die zwei häufigsten Gründe bereits 66 % ab – dort setzt die Prozessoptimierung an (→ Deep Dive 5). Das **Pareto-Diagramm** kombiniert Balken (absolute Häufigkeit) mit einer Linie (kumulierter Anteil).

**Klassenbildung** bei metrischen Daten: gleich breite Klassen, überschneidungsfrei und lückenlos definieren (z. B. „30 bis unter 45 Minuten"). Die **Klassenmitte** dient als Rechenwert, wenn nur klassierte Daten vorliegen – dadurch entsteht ein Genauigkeitsverlust.

---

# Teil 3 – Lagemaße

Beispieldatensatz (Lieferzeiten in Tagen, n = 10), bereits sortiert:
**2, 3, 3, 4, 5, 5, 5, 6, 8, 19**

**Arithmetisches Mittel:** $\bar{x} = \frac{\sum x_i}{n} = \frac{60}{10}$ = **6,0 Tage**
- Nutzt alle Werte, ist aber **empfindlich gegenüber Ausreißern**.

**Median** = mittlerer Wert der sortierten Reihe
- n ungerade → Wert an Position $\frac{n+1}{2}$
- n gerade → Mittel der beiden mittleren Werte: $\frac{5 + 5}{2}$ = **5,0 Tage**
- **Robust** gegenüber Ausreißern.

**Modus (Modalwert)** = häufigster Wert = **5 Tage** (kommt dreimal vor). Einziges Lagemaß für nominale Daten; eine Verteilung kann mehrere Modi haben.

**Die entscheidende Interpretation:** Mittelwert (6,0) > Median (5,0). Diese Lücke entsteht durch den Ausreißer 19 – die Verteilung ist **rechtsschief** (gleichbedeutend: linkssteil – der „Berg“ liegt links, der lange Ausläufer rechts). Merksatz: *Liegt der Mittelwert deutlich über dem Median, ziehen große Ausreißer nach oben.* Umgekehrt (Mittelwert < Median) ist die Verteilung linksschief bzw. rechtssteil. Genau diese Aussage bringt in Interpretationsaufgaben die Punkte.

**Gewichtetes arithmetisches Mittel** (wenn Werte unterschiedlich schwer wiegen):
$\bar{x} = \frac{\sum (\text{Wert} \cdot \text{Gewicht})}{\sum \text{Gewichte}}$
Beispiel: 3 Aufträge à 40 min und 7 Aufträge à 60 min → $\frac{3 \cdot 40 + 7 \cdot 60}{10} = \frac{540}{10} = 54$ min. Bei klassierten Daten rechnest du genauso, mit Klassenmitte × Klassenhäufigkeit.

> ❓ **Prüferfrage:** Warum berichtet man Gehälter üblicherweise als Median, nicht als Mittelwert?
> *Wenige sehr hohe Gehälter ziehen den Mittelwert nach oben und erzeugen ein verzerrtes Bild der typischen Situation. Der Median ist robust und beschreibt die Mitte der Verteilung realistischer.*

---

# Teil 4 – Streuungsmaße

Zwei Datensätze können denselben Mittelwert haben und trotzdem völlig verschieden sein. Die Streuung beschreibt, **wie stark die Werte um die Mitte schwanken** – für die Prozess- und Qualitätsbewertung oft wichtiger als der Mittelwert selbst.

### 4.1 Spannweite
$R = x_{\max} - x_{\min}$. Beim Beispiel: $19 - 2$ = **17 Tage**. Schnell berechnet, aber nur von zwei Werten abhängig und daher extrem ausreißeranfällig.

### 4.2 Quartile und Interquartilsabstand

Quartile teilen die sortierte Reihe in vier gleich große Teile: Q1 (25 %), Q2 = Median (50 %), Q3 (75 %).

⚠️ **Wichtig:** Es existieren mehrere Berechnungskonventionen, die leicht unterschiedliche Werte liefern – keine davon ist „die richtige“. In diesem Lernzettel gilt die in deutschen Statistik-Lehrbüchern verbreitete Definition des empirischen Quantils: Position = n · p; ist das Ergebnis **keine** ganze Zahl, wird **aufgerundet** und der Wert an dieser Position genommen; ist es eine ganze Zahl, wird das Mittel aus dieser und der nächsten Position gebildet. **Schreibe die verwendete Konvention in der Klausur dazu** – dann bekommst du auch bei abweichender Musterlösung deine Punkte.

Beispiel (n = 10) – sortierte Reihe mit Positionen:

| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Wert | 2 | 3 | 3 | 4 | 5 | 5 | 5 | 6 | 8 | 19 |

- **Q1:** Position $= n \cdot p = 10 \cdot 0{,}25 = 2{,}5$ → aufrunden auf **Position 3**. Der 3. Wert der Reihe ist 3 → **Q1 = 3**
- **Q3:** Position $= n \cdot p = 10 \cdot 0{,}75 = 7{,}5$ → aufrunden auf **Position 8**. Der 8. Wert der Reihe ist 6 → **Q3 = 6**

⚠️ **Position ist nicht der Wert.** Hier besonders heimtückisch: Die Rechnung führt auf Position 8 – und die Zahl 8 kommt in den Daten ebenfalls vor, allerdings an Position 9. Wer beides verwechselt, notiert fälschlich Q3 = 8. Schreibe deshalb in der Klausur immer beides hin: „Position 8 → Wert 6".

Zum Vergleich – dieselben zehn Lieferzeiten nach anderen gängigen Konventionen:

| Konvention | Q1 | Q3 | IQR |
|---|---|---|---|
| Lernzettel: Position n · p, aufrunden bzw. Mittel mit dem nächsten Wert | 3 | 6 | 3 |
| Tukey: Median der unteren bzw. oberen Hälfte | 3 | 6 | 3 |
| Excel QUARTILE.INKL: Position 1 + (n − 1) · p, linear interpoliert | 3,25 | 5,75 | 2,5 |
| Excel QUARTILE.EXKL: Position (n + 1) · p, linear interpoliert | 3 | 6,5 | 3,5 |

Die Unterschiede sind klein, und die Schlussfolgerung (19 ist ein Ausreißer) bleibt bei allen Varianten gleich. Deshalb: Konvention nennen und durchgängig anwenden.

$\text{IQR} = Q_3 - Q_1 = 6 - 3$ = **3 Tage** – die mittleren 50 % der Aufträge liegen in einem Bereich von nur 3 Tagen. Der IQR ist robust, weil er die Extremwerte ausblendet.

### 4.3 Varianz und Standardabweichung

Rechenweg in vier Schritten (immer so aufschreiben – jeder Schritt gibt Teilpunkte):
1. Mittelwert berechnen
2. Abweichungen vom Mittelwert bilden
3. Abweichungen quadrieren und aufsummieren (= Summe der Abweichungsquadrate, SAQ)
4. Durch n (Grundgesamtheit) bzw. durch n − 1 (Stichprobe) teilen → Varianz; Wurzel ziehen → Standardabweichung

Beispiel Durchlaufzeiten (Tage): 2, 4, 5, 6, 8 → $\bar{x} = \frac{25}{5} = 5$

| x | x − x̄ | (x − x̄)² |
|---|---|---|
| 2 | −3 | 9 |
| 4 | −1 | 1 |
| 5 | 0 | 0 |
| 6 | 1 | 1 |
| 8 | 3 | 9 |
| | **Σ = 0** | **Σ = 20** |

Varianz (Grundgesamtheit, ÷ n): $\sigma^2 = \frac{\sum (x_i - \bar{x})^2}{n} = \frac{20}{5}$ = **4 Tage²** · Standardabweichung: $\sigma = \sqrt{4}$ = **2 Tage**

**Kontrolle:** Die Summe der einfachen Abweichungen ist immer 0 – deshalb wird überhaupt quadriert. Nutze das als Rechenprobe!

⚠️ **σ² (÷ n) oder s² (÷ n−1)?** Liegen alle Daten der **Grundgesamtheit** vor, wird durch n geteilt. Ist es eine **Stichprobe**, mit der auf die Grundgesamtheit geschlossen wird, durch n − 1. Im Beispiel: $s^2 = \frac{20}{4} = 5$ → $s = \sqrt{5} = 2{,}24$. Beides ist richtig – **im jeweiligen Kontext**. Schreibe hin, welche Variante du verwendest und warum; das ist prüfungssicher.

**In Werkzeugen:** Excel unterscheidet VAR.P / STABW.N (÷ n) und VAR.S / STABW.S (÷ n − 1). SQL kennt VAR_POP / STDDEV_POP und VAR_SAMP / STDDEV_SAMP. Vorsicht bei Funktionen ohne Zusatz: STDDEV rechnet in PostgreSQL und Oracle als Stichprobe (÷ n − 1), in MySQL dagegen als Grundgesamtheit (÷ n); SQL Server unterscheidet STDEV und STDEVP. Im Zweifel die Dokumentation prüfen und die Variante im Bericht nennen.

**Interpretation:** Die Standardabweichung steht in derselben Einheit wie die Daten (Tage) und ist damit direkt interpretierbar; die Varianz ist eine quadrierte Hilfsgröße. Faustregel bei annähernder Normalverteilung: ca. 68 % der Werte liegen im Bereich x̄ ± 1σ, ca. 95 % im Bereich x̄ ± 2σ.

### 4.4 Variationskoeffizient

$\text{VK} = \frac{\sigma}{\bar{x}}$ (oft in %; bei Stichproben mit s statt σ). Er macht die Streuung **vergleichbar** zwischen Datensätzen mit unterschiedlichem Niveau. Sinnvoll nur bei verhältnisskalierten Daten mit positivem Mittelwert – für Temperaturen in °C etwa ist er bedeutungslos.

Beispiel: Team A: x̄ = 50 min, σ = 5 min → VK = 10 %. Team B: x̄ = 100 min, σ = 8 min → VK = 8 %. Team B streut **absolut** stärker (8 > 5), **relativ** aber weniger (8 % < 10 %) – arbeitet also gleichmäßiger. Genau diese Unterscheidung ist eine typische Beurteilungsfrage.

---

# Teil 5 – Boxplot und Ausreißer

### 5.1 Aufbau

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 150" width="640" height="150" role="img" aria-label="Aufbau eines Boxplots: Box von Q1 bis Q3 mit Medianstrich, Whisker bis zum kleinsten und größten Wert innerhalb der Zäune, Ausreißer als einzelner Punkt">
<line x1="60" y1="80" x2="170" y2="80" class="dg-linie"/>
<line x1="380" y1="80" x2="520" y2="80" class="dg-linie"/>
<line x1="60" y1="66" x2="60" y2="94" class="dg-linie"/>
<line x1="520" y1="66" x2="520" y2="94" class="dg-linie"/>
<rect x="170" y="60" width="210" height="40" class="dg-akzent"/>
<line x1="290" y1="60" x2="290" y2="100" class="dg-linie dg-dick"/>
<circle cx="600" cy="80" r="5" class="dg-form"/>
<text x="170" y="50" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Q1</text>
<text x="290" y="50" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Median</text>
<text x="380" y="50" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Q3</text>
<path d="M170,24 V18 H380 V24" class="dg-linie dg-duenn"/>
<text x="275" y="10" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Box = IQR, mittlere 50 % der Daten</text>
<text x="40" y="118" text-anchor="start" dominant-baseline="middle" class="dg-klein">unteres Whisker-Ende</text>
<text x="40" y="133" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">(kleinster Wert innerhalb der Zäune)</text>
<text x="540" y="118" text-anchor="end" dominant-baseline="middle" class="dg-klein">oberes Whisker-Ende</text>
<text x="540" y="133" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">(größter Wert innerhalb der Zäune)</text>
<text x="600" y="62" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ausreißer</text>
</svg>
```

- **Box:** von Q1 bis Q3, enthält die mittleren 50 % der Daten; die Boxbreite ist der IQR.
- **Strich in der Box:** Median. Liegt er nicht mittig, ist die Verteilung **schief**.
- **Whisker:** reichen bis zum letzten Wert innerhalb der 1,5-fachen IQR-Grenze. Nur wenn es keine Ausreißer gibt, sind das Minimum und Maximum.
- **Punkte außerhalb:** Ausreißer, einzeln dargestellt.

Das ist die verbreitete Variante nach Tukey. Manche Darstellungen ziehen die Whisker stattdessen immer bis Minimum und Maximum und zeigen keine Ausreißer – der Boxplot gibt dann genau die **Fünf-Punkte-Zusammenfassung** wieder (Minimum, Q1, Median, Q3, Maximum). Steht in der Aufgabe nichts anderes, gilt die 1,5-IQR-Variante.

### 5.2 Die 1,5-IQR-Regel

Unterer Zaun $= Q_1 - 1{,}5 \cdot \text{IQR}$ · Oberer Zaun $= Q_3 + 1{,}5 \cdot \text{IQR}$
Werte außerhalb gelten als Ausreißerverdacht. Ein Wert genau auf dem Zaun ist noch kein Ausreißer. Werte jenseits von 3 · IQR (statt 1,5 · IQR) werden häufig als extreme Ausreißer bezeichnet.

Beispiel Lieferzeiten: Q1 = 3, Q3 = 6, IQR = 3 → unterer Zaun $= 3 - 4{,}5 = -1{,}5$ · oberer Zaun $= 6 + 4{,}5$ = **10,5**. Der Wert **19** liegt darüber → Ausreißer. Der obere Whisker endet beim größten Wert innerhalb der Grenze, also bei 8.

### 5.3 Umgang mit Ausreißern – die DPA-Kernkompetenz

**Niemals ungeprüft löschen.** Der Prüfungserwartungshorizont sieht drei Schritte vor:

1. **Ursache klären:** Erfassungsfehler (Komma verrutscht, Einheit verwechselt), technischer Defekt – oder ein **echter, fachlich erklärbarer Extremfall** (Großauftrag, Sonderreparatur mit Ersatzteilbeschaffung).
2. **Entscheiden und dokumentieren:** korrigieren (bei belegtem Fehler), belassen (bei echtem Wert), gesondert auswerten oder ausschließen – die Entscheidung **mit Begründung dokumentieren**.
3. **Auswirkung prüfen:** Analyse mit und ohne Ausreißer rechnen und die Sensitivität berichten.

Ein gelöschter echter Extremwert verletzt die Datenqualitätsdimension **Korrektheit** und kann genau die Fälle unsichtbar machen, die man eigentlich untersuchen wollte – bei einer Prozessanalyse sind die Ausreißer oft **das eigentliche Problem**.

> ❓ **Prüferfrage:** Wozu brauchen Sie einen Boxplot, wenn Sie Mittelwert und Standardabweichung schon berechnet haben?
> *Der Boxplot zeigt zusätzlich Schiefe, konkrete Ausreißer und den robusten Kern der Verteilung. Mittelwert und Standardabweichung sind beide ausreißeranfällig und können eine Verteilung völlig falsch zusammenfassen – zwei sehr verschiedene Verteilungen können identische Kennzahlen haben.*

---

# Teil 6 – Von der Kennzahl zur Datenqualität

So verbindest du Statistik mit deinem Prüfungsbereich (und bereitest das Fachgespräch vor). **Data Profiling** heißt konkret:

| Prüfung | Kennzahl/Methode | Findet |
|---|---|---|
| Vollständigkeit | Anteil NULL/Leerwerte je Spalte | fehlende Erfassung |
| Eindeutigkeit | Anzahl DISTINCT vs. Anzahl Zeilen | Dubletten |
| Wertebereich | Minimum/Maximum, Spannweite | unmögliche Werte (negative Dauer) |
| Verteilung | Median, IQR, Boxplot | Ausreißer, Schiefe |
| Konsistenz | Kreuzvergleich zweier Felder | Widersprüche (Enddatum vor Startdatum) |
| Plausibilität | x̄ ± 3σ | technisch mögliche, fachlich unwahrscheinliche Werte |

Häufungen exakt gleicher Werte (z. B. auffällig viele Datensätze mit Geburtsdatum 01.01.1900) deuten auf **Platzhalter- oder Default-Werte** hin – ein Klassiker, den Data Profiling aufdeckt und der jede Auswertung verfälscht.

---

# Teil 7 – Wahrscheinlichkeit, Normalverteilung und Befragungsskalen

## 7.1 Wahrscheinlichkeit

- **Laplace-Wahrscheinlichkeit** (alle Ergebnisse gleich wahrscheinlich): $P(A) = \frac{\text{günstige Fälle}}{\text{mögliche Fälle}}$. In der Praxis schätzt man Wahrscheinlichkeiten über **relative Häufigkeiten**: 3 von 60 Aufträgen wurden reklamiert → geschätzte Reklamationswahrscheinlichkeit 5 %.
- **Gegenereignis:** $P(\text{nicht } A) = 1 - P(A)$ – mit 95 % Wahrscheinlichkeit wird ein Auftrag nicht reklamiert.
- **Unabhängige Ereignisse, die beide eintreten** („und“): **multiplizieren**. Zwei voneinander unabhängige Prüfungen übersehen einen Fehler jeweils mit 10 % Wahrscheinlichkeit; beide übersehen ihn mit $0{,}1 \cdot 0{,}1 = 0{,}01$, also 1 %.
- Sich ausschließende Ereignisse („oder“): **addieren**. Können beide gleichzeitig eintreten, wird die Schnittmenge abgezogen: $P(A \text{ oder } B) = P(A) + P(B) - P(A \text{ und } B)$
- „Mindestens einmal“ rechnet man über das Gegenereignis: Bei drei unabhängigen Aufträgen mit je 5 % Reklamationswahrscheinlichkeit gilt $P(\text{mind. eine Reklamation}) = 1 - 0{,}95^3 = 1 - 0{,}857 \approx 0{,}143$ = **14,3 %** – nicht 3 · 5 % = 15 %.

Eine **Zufallsvariable** ordnet jedem Ergebnis eines Zufallsvorgangs eine Zahl zu – etwa die Reparaturkosten eines Auftrags.

## 7.2 Erwartungswert

Der **Erwartungswert** ist der Wert, der sich im Durchschnitt vieler Wiederholungen einstellt: $E(X) = \sum x_i \cdot p_i$

**Beispiel:** Das Möbelhaus erwägt eine Garantieverlängerung. Aus den Daten ergibt sich je Vertrag: mit 5 % Wahrscheinlichkeit ein großer Schaden (400 €), mit 10 % ein kleiner (150 €), mit 85 % kein Schaden (0 €).
$E(X) = 400 \cdot 0{,}05 + 150 \cdot 0{,}10 + 0 \cdot 0{,}85 = 20 + 15 + 0$ = **35 €** je Vertrag. Ein Preis über 35 € deckt die Kosten **im Mittel** – einzelne Verträge können trotzdem 400 € kosten.

## 7.3 Normalverteilung

Viele Messgrößen (Bearbeitungszeiten, Messfehler, Körpergrößen) verteilen sich annähernd **glockenförmig**:
- symmetrisch um den Mittelwert; **Mittelwert = Median = Modus**
- beschrieben durch nur zwei Kennzahlen: Mittelwert $\mu$ und Standardabweichung $\sigma$
- die Fläche unter der **Dichtefunktion** zwischen zwei Werten ist die Wahrscheinlichkeit für diesen Bereich

**Die 68-95-99,7-Regel:**

| Bereich | Anteil der Werte |
|---|---|
| Mittelwert ± 1 σ | rund 68 % |
| Mittelwert ± 2 σ | rund 95 % |
| Mittelwert ± 3 σ | rund 99,7 % |

Genau genommen umfasst ± 2 σ 95,45 %; exakt 95 % liegen im Bereich ± 1,96 σ. Für Klausurrechnungen reichen die gerundeten Werte.

**Beispiel:** Reparaturzeiten sind normalverteilt mit Mittelwert 60 min und Standardabweichung 10 min.
- 95 % der Reparaturen dauern zwischen 60 − 2 · 10 = **40** und 60 + 2 · 10 = **80** Minuten.
- Länger als 80 Minuten dauern rund (100 % − 95 %) / 2 = **2,5 %** – die 5 % außerhalb verteilen sich symmetrisch auf beide Seiten.
- Ein Auftrag mit 95 Minuten hat den **z-Wert** $z = \frac{x - \mu}{\sigma} = \frac{95 - 60}{10}$ = **3,5** – er liegt mehr als 3 Standardabweichungen vom Mittelwert entfernt und ist nach der **3-Sigma-Regel** ein Ausreißerkandidat (vgl. Teil 6: x̄ ± 3σ).

⚠️ **Achtung:** Die 3-Sigma-Regel setzt eine annähernd **normalverteilte** Größe voraus. Bei **schiefen Verteilungen** – etwa Einkommen oder Bestellwerte mit wenigen sehr großen Werten (**rechtsschief**: Mittelwert > Median) – ist die 1,5-IQR-Regel aus Teil 5 robuster.

## 7.4 Befragungsskalen

- **Likert-Skala:** Zustimmung zu Aussagen in meist fünf Stufen („stimme gar nicht zu“ bis „stimme voll zu“). Streng genommen **ordinal** – Median und Modus sind immer zulässig; ein Mittelwert nur, wenn man gleiche Abstände zwischen den Stufen unterstellt (in der Praxis üblich, aber in der Prüfung erwähnen).
- **Polaritätsprofil** (semantisches Differenzial): Ein Gegenstand wird auf mehreren Skalen zwischen **Gegensatzpaaren** bewertet („übersichtlich – unübersichtlich“, „schnell – langsam“). Die Profile mehrerer Varianten lassen sich als Linien übereinanderlegen und direkt vergleichen – etwa zwei Dashboard-Entwürfe im Usability-Test.

> ❓ **Prüferfrage:** In einer Mitarbeiterbefragung ergibt sich auf einer fünfstufigen Likert-Skala ein Mittelwert von 3,4. Was ist an dieser Angabe kritisch?
> *Die Likert-Skala ist ordinal: Die Abstände zwischen „stimme eher zu“ und „stimme voll zu“ sind nicht zwingend gleich. Ein Mittelwert unterstellt gleiche Abstände und kann zudem eine polarisierte Verteilung (viele 1er und viele 5er) verdecken. Besser sind Median und die Häufigkeitsverteilung der Antworten, ergänzend der Mittelwert mit ausdrücklichem Hinweis auf die Annahme.*

> ❓ **Prüferfrage:** Excel liefert für Q1 Ihrer Daten einen anderen Wert als Ihre Handrechnung. Ist eine der beiden Rechnungen falsch?
> *Nicht unbedingt. Für Quartile gibt es mehrere anerkannte Konventionen – etwa Position n · p mit Aufrunden, die Tukey-Hälften oder die lineare Interpolation von QUARTILE.INKL und QUARTILE.EXKL in Excel. Die Werte weichen leicht voneinander ab. Entscheidend ist, die verwendete Konvention zu nennen, sie durchgängig anzuwenden und zu prüfen, ob sich die Schlussfolgerung (etwa welche Werte Ausreißer sind) ändert.*

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Mittelwert auf ordinal oder nominal skalierte Daten angewendet.
2. Median bestimmt, ohne vorher zu **sortieren**.
3. Bei geradem n den Median nicht als Mittel der beiden mittleren Werte gebildet.
4. Varianz nicht durch n bzw. n − 1 geteilt (Division vergessen), Grundgesamtheit und Stichprobe verwechselt oder Wurzel am Ende vergessen.
5. Verwechslung von Varianz und Standardabweichung (Einheit beachten!).
6. Zäune der 1,5-IQR-Regel mit Q1/Q3 statt mit dem IQR gerechnet.
7. Whisker bis zum Ausreißer gezeichnet statt bis zum letzten Wert innerhalb der Grenze.
8. Ausreißer kommentarlos entfernt, ohne Ursachenprüfung und Dokumentation.

---

# Übungsklausur Statistik I (100 Punkte, 90 Minuten)

Bearbeite die Klausur **am Ende des Themas** am Stück, handschriftlich, mit Taschenrechner, ohne Unterlagen. Runde auf zwei Nachkommastellen. **Schreibe alle Rechenwege auf** – Teilpunkte gibt es nur für Nachvollziehbares.

## Ausgangssituation

Die Werkstatt der **Möbelhaus Nordholz GmbH** soll schneller und gleichmäßiger arbeiten. Die Geschäftsführung bittet Sie als Mitarbeiter der IT-Abteilung, die Reparatur- und Reklamationsdaten statistisch aufzubereiten und die Ergebnisse verständlich zu berichten.

## Anlage – Bearbeitungsdauer von 11 Reparaturaufträgen (in Minuten)

`60, 40, 220, 45, 35, 90, 55, 40, 70, 50, 65`

## Block A – Skalenniveaus (12 P)

Bevor Sie rechnen, prüfen Sie, welche Kennzahlen für die Merkmale der Auftragsdatenbank überhaupt zulässig sind.

**A1 (8 P):** *Ordnen* Sie den folgenden Merkmalen je das Skalenniveau *zu* und *tragen* Sie es in die Tabelle *ein*. *Begründen* Sie **zwei** Ihrer Zuordnungen unter der Tabelle.

| Merkmal | Skalenniveau |
|---|---|
| (a) Kundennummer | |
| (b) Kundenzufriedenheit (1 = sehr zufrieden bis 5 = unzufrieden) | |
| (c) Reparaturdauer in Minuten | |
| (d) Kalenderjahr der Auftragserteilung | |

**A2 (4 P):** Ein Kollege berechnet den arithmetischen Mittelwert der Postleitzahlen aller Kunden, um „den durchschnittlichen Standort" zu bestimmen. *Beurteilen* Sie das Vorgehen und *nennen* Sie eine fachlich korrekte Alternative.

## Block B – Häufigkeitsverteilung (18 P)

Der Kundenservice hat die Reklamationen des letzten Quartals nach Fehlerart ausgezählt. Von 50 Reklamationen entfallen: Transportschaden 18, Montagefehler 15, Falschlieferung 9, Materialfehler 6, Sonstiges 2.

**B1 (9 P):** *Erstellen* Sie eine vollständige Häufigkeitstabelle mit absoluter, relativer (in %) und kumulierter relativer Häufigkeit, absteigend sortiert.

> **Formeln:**
> - relative Häufigkeit h_i = n_i / n · 100 %
> - kumulierte relative Häufigkeit = Summe der relativen Häufigkeiten bis einschließlich dieser Zeile

**B2 (5 P):** *Ermitteln* Sie, wie viele Fehlerarten nötig sind, um mindestens 80 % aller Reklamationen abzudecken, und *benennen* Sie das zugrunde liegende Prinzip.

> **Formel:** kumulierter Anteil = Reklamationen der häufigsten Fehlerarten zusammen / alle Reklamationen · 100 %

**B3 (4 P):** *Begründen* Sie, warum für dieses Merkmal weder Mittelwert noch Median berechnet werden können, und *geben* Sie das zulässige Lagemaß *an*.

## Block C – Lagemaße (20 P)

Die Geschäftsführung möchte wissen, wie lange eine Reparatur „typischerweise“ dauert. Grundlage ist die **Anlage**.

**C1 (10 P):** *Berechnen* Sie für die Anlage arithmetisches Mittel, Median und Modus. *Notieren* Sie die sortierte Reihe.

> **Formeln:**
> - arithmetisches Mittel x̄ = Σ x_i / n
> - Median: n ungerade → Wert an Position (n + 1) / 2; n gerade → Mittel der Werte an Position n / 2 und n / 2 + 1
> - Modus = der am häufigsten vorkommende Wert

**C2 (6 P):** *Vergleichen* Sie Mittelwert und Median. *Erläutern* Sie, was die Differenz über die Verteilung aussagt und welches Lagemaß Sie der Geschäftsführung berichten würden.

> **Formeln:**
> - arithmetisches Mittel x̄ = Σ x_i / n
> - Median: n ungerade → Wert an Position (n + 1) / 2; n gerade → Mittel der Werte an Position n / 2 und n / 2 + 1

**C3 (4 P):** Die Werkstatt meldet für den Folgemonat: 4 Aufträge à 45 Minuten, 6 Aufträge à 70 Minuten. *Berechnen* Sie die durchschnittliche Bearbeitungsdauer.

> **Formel:** gewichtetes Mittel x̄ = Σ (n_i · x_i) / Σ n_i

## Block D – Streuungsmaße (18 P)

Neben dem Durchschnitt interessiert die Geschäftsführung, wie gleichmäßig die Werkstätten arbeiten.

**D1 (4 P):** *Berechnen* Sie die Spannweite der Anlage und *beurteilen* Sie deren Aussagekraft in diesem Fall.

> **Formel:** Spannweite = größter Wert − kleinster Wert

**D2 (10 P):** Für fünf Aufträge einer anderen Filiale wurden folgende Durchlaufzeiten (in Tagen) erfasst: 2, 4, 5, 6, 8. *Berechnen* Sie Varianz und Standardabweichung der **Grundgesamtheit**. *Stellen* Sie den Rechenweg tabellarisch *dar*.

> **Formeln:**
> - Mittelwert x̄ = Σ x_i / n
> - Varianz der Grundgesamtheit σ² = Σ (x_i − x̄)² / n
> - Standardabweichung σ = √σ²

**D3 (4 P):** Filiale Nord: x̄ = 50 min, σ = 5 min. Filiale Süd: x̄ = 100 min, σ = 8 min. *Berechnen* Sie jeweils den Variationskoeffizienten und *beurteilen* Sie, welche Filiale gleichmäßiger arbeitet.

> **Formel:** Variationskoeffizient VK = σ / x̄ · 100 %

## Block E – Boxplot und Ausreißer (20 P)

Für den Bericht soll die Verteilung der Reparaturdauern aus der **Anlage** als Boxplot dargestellt werden.

**E1 (8 P):** *Bestimmen* Sie für die Anlage Q1, Q3 und den Interquartilsabstand nach der angegebenen Konvention.

> **Formeln:**
> - Position = n · p (p = 0,25 für Q1, p = 0,75 für Q3); nicht ganzzahlig → aufrunden und den Wert an dieser Position nehmen; ganzzahlig → Mittel aus diesem und dem nächsten Wert
> - Interquartilsabstand IQR = Q3 − Q1

**E2 (6 P):** *Prüfen* Sie mit der 1,5-IQR-Regel auf Ausreißer. *Geben* Sie beide Zäune und alle identifizierten Ausreißer *an*.

> **Formeln:**
> - unterer Zaun = Q1 − 1,5 · IQR
> - oberer Zaun = Q3 + 1,5 · IQR
> - Ausreißer = alle Werte unterhalb des unteren oder oberhalb des oberen Zauns

**E3 (6 P):** *Skizzieren* Sie den Boxplot maßstäblich und *beschriften* Sie Box, Median, beide Whisker und Ausreißer. Achten Sie darauf, wo der obere Whisker endet.

> **Formeln:**
> - IQR = Q3 − Q1
> - unterer Zaun = Q1 − 1,5 · IQR
> - oberer Zaun = Q3 + 1,5 · IQR

## Block F – Beurteilung (12 P)

Bei der Aufbereitung der Daten fallen Ihnen Auffälligkeiten auf, über die Sie entscheiden müssen.

**F1 (7 P):** Der Wert 220 Minuten stammt aus einem Auftrag, bei dem ein Ersatzteil erst beschafft werden musste. Ein Kollege schlägt vor, den Datensatz vor der Auswertung zu löschen, „damit die Statistik nicht verzerrt wird". *Beurteilen* Sie den Vorschlag und *entwickeln* Sie ein fachlich korrektes Vorgehen in drei Schritten.

**F2 (5 P):** In der Spalte „Reparaturdauer" fallen 14 Datensätze mit dem exakten Wert 0 auf. *Nennen* Sie **zwei** mögliche Ursachen und je eine Maßnahme, mit der Sie die Ursache klären bzw. künftig verhindern. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Ursache | Maßnahme |
|---|---|
| | |
| | |

---

## Fachgespräch: typische Fragen des Ausschusses

1. „Welche statistischen Kennzahlen haben Sie zur Beschreibung Ihrer Datenbasis herangezogen – und warum genau diese?"
2. „Wie sind Sie in Ihrem Projekt mit Ausreißern umgegangen? Wie haben Sie die Entscheidung dokumentiert?"
3. „Ihre Auswertung berichtet einen Mittelwert. Warum ist das hier zulässig – und was hätte der Median zusätzlich gezeigt?"
4. „Wie haben Sie geprüft, ob Ihre Datenbasis überhaupt repräsentativ ist?" (Erwartet: Stichprobenumfang, Erhebungszeitraum, Verzerrungsquellen, Vollständigkeit.)
5. „Was sagt Ihnen eine hohe Standardabweichung bei den Durchlaufzeiten über den Prozess?" (Erwartet: unstabiler, schlecht steuerbarer Prozess – Ansatzpunkt für Standardisierung.)

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich ordne jedem Merkmal sicher das Skalenniveau zu und weiß, welche Kennzahlen jeweils zulässig sind.
- [ ] Ich erstelle Häufigkeitstabellen mit relativer und kumulierter Häufigkeit fehlerfrei und kenne das Pareto-Prinzip.
- [ ] Ich berechne Mittelwert, Median (auch bei geradem n), Modus und gewichtetes Mittel ohne Nachschlagen.
- [ ] Ich beherrsche den vierschrittigen Rechenweg für Varianz und Standardabweichung und kenne den Unterschied ÷n / ÷(n−1).
- [ ] Ich bestimme Quartile und IQR, benenne meine Konvention und wende die 1,5-IQR-Regel korrekt an.
- [ ] Ich zeichne und lese Boxplots inklusive korrekter Whisker-Enden.
- [ ] Ich kann den Umgang mit Ausreißern in drei Schritten fachlich begründen.
- [ ] Ich verbinde jede Kennzahl mit einer Datenqualitätsdimension.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
- [ ] Ich rechne mit Wahrscheinlichkeiten (Gegenereignis, unabhängige Ereignisse) und berechne einen Erwartungswert.
- [ ] Ich wende die 68-95-99,7-Regel und den z-Wert an und beurteile Likert-Skala und Polaritätsprofil.
- [ ] Ich weiß, dass Quartile je nach Konvention (Lernzettel, Tukey, Excel INKL/EXKL) leicht abweichen, und kenne die Excel- und SQL-Funktionen für Varianz und Standardabweichung mit ÷ n und ÷ (n − 1).
