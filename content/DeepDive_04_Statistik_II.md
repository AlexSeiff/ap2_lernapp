# Deep Dive 4: Statistik II – Zusammenhänge und Prognosen
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Während Statistik I einzelne Merkmale **beschreibt**, untersucht Statistik II **Zusammenhänge zwischen zwei Merkmalen** – und genau das ist der Kern der Datenanalyse. Prüfungstypisch sind: Streudiagramm interpretieren, Korrelationskoeffizient berechnen oder deuten, Regressionsgerade aufstellen, Prognosewert berechnen, R² interpretieren – und fast immer eine **Beurteilungsaufgabe zu Korrelation vs. Kausalität**.

Diese Interpretationsaufgabe ist die zuverlässigste Trennlinie zwischen einer 2 und einer 1: Rechnen können viele, die Grenzen des eigenen Modells sauber benennen können wenige.

Szenario: **Möbelhaus Nordholz GmbH**.

---

# Teil 1 – Zusammenhänge sichtbar machen

## 1.1 Das Streudiagramm

Zwei metrische Merkmale werden als Punktwolke dargestellt: die **unabhängige Variable x** auf der Waagerechten (Ursache/Einflussgröße), die **abhängige Variable y** auf der Senkrechten (Wirkung/Zielgröße).

Was du daraus abliest, **bevor** du rechnest:
- **Richtung:** steigend (positiv), fallend (negativ), kein Muster
- **Stärke:** enge Punktwolke = starker Zusammenhang, breite Streuung = schwacher
- **Form:** linear oder gekrümmt – bei gekrümmtem Verlauf ist ein linearer Korrelationskoeffizient irreführend
- **Ausreißer:** einzelne Punkte weit abseits, die das Ergebnis stark verzerren können

**Prüfungsrelevant:** Immer erst das Streudiagramm ansehen, dann rechnen. Ein r nahe 0 bedeutet nur, dass kein **linearer** Zusammenhang besteht – ein starker U-förmiger Zusammenhang kann trotzdem vorliegen.

## 1.2 Der Korrelationskoeffizient nach Pearson

r misst Stärke und Richtung eines **linearen** Zusammenhangs und liegt immer zwischen −1 und +1.

**Formel (Prüfungsschreibweise):**

$r = \dfrac{S_{xy}}{\sqrt{S_{xx} \cdot S_{yy}}}$

mit
$S_{xy} = \sum (x - \bar{x})(y - \bar{y})$ · $S_{xx} = \sum (x - \bar{x})^2$ · $S_{yy} = \sum (y - \bar{y})^2$

| \|r\| | Interpretation |
|---|---|
| 0,0 – 0,2 | kein bis sehr schwacher Zusammenhang |
| 0,2 – 0,5 | schwacher Zusammenhang |
| 0,5 – 0,8 | mittlerer Zusammenhang |
| 0,8 – 1,0 | starker Zusammenhang |

*(Die Grenzen sind Konvention, keine Naturgesetze – in der Klausur reicht „stark/mittel/schwach" mit Vorzeichenangabe.)*

**Vorzeichen zuerst interpretieren:** positiv = gleichläufig (x steigt, y steigt), negativ = gegenläufig.

**Wichtige Eigenschaften:**
- r ist **einheitenlos** – dadurch sind verschiedene Merkmalspaare vergleichbar.
- r ist **symmetrisch**: r(x,y) = r(y,x). Aus der Korrelation folgt keine Richtung des Zusammenhangs.
- r ist **ausreißerempfindlich**: Ein einziger Extrempunkt kann r von 0,2 auf 0,9 heben oder umgekehrt.

**Für ordinale Daten** (z. B. Zufriedenheitsstufen) ist Pearson nicht zulässig – dort verwendet man die **Rangkorrelation nach Spearman**, die auf Rangplätzen statt Messwerten rechnet und auch nichtlineare, aber gleichgerichtete (monotone) Zusammenhänge erfasst.

Spearman-Formel (ohne gleiche Ränge, d = Rangdifferenz je Merkmalsträger): $r_s = 1 - \dfrac{6 \cdot \sum d^2}{n \cdot (n^2 - 1)}$

Beispiel: 5 Filialen, Rangdifferenzen mit $\sum d^2 = 2$ → $r_s = 1 - \frac{6 \cdot 2}{5 \cdot 24} = 1 - 0{,}1$ = **0,90**. Wie Pearson liegt $r_s$ zwischen −1 und +1; weil nur Ränge zählen, ist Spearman zudem robuster gegenüber Ausreißern. Gleiche Werte (Bindungen) erhalten den Mittelwert ihrer Rangplätze; die Kurzformel gilt dann nur noch näherungsweise.

> ❓ **Prüferfrage:** Sie berechnen r = 0,05 zwischen Außentemperatur und Stromverbrauch eines Gebäudes und schließen daraus: „kein Zusammenhang". Was übersehen Sie?
> *Der Zusammenhang ist vermutlich U-förmig – geheizt wird bei Kälte, gekühlt bei Hitze. Pearson misst nur Linearität und wird hier nahezu null, obwohl ein starker Zusammenhang besteht. Ein Streudiagramm hätte das sofort gezeigt.*

## 1.3 Korrelation ≠ Kausalität

Der wichtigste Satz der ganzen Fachrichtung. Ein hoher Korrelationswert lässt **vier** Erklärungen zu:

1. **x verursacht y** (echte Kausalität)
2. **y verursacht x** (umgekehrte Wirkungsrichtung)
3. **Drittvariable (Confounder):** Eine dritte Größe beeinflusst beide. Klassiker: Eisverkauf und Sonnenbrände korrelieren – Ursache ist in beiden Fällen die Sonneneinstrahlung.
4. **Zufall / Scheinkorrelation:** Bei vielen geprüften Merkmalspaaren treten hohe Korrelationen rein zufällig auf; besonders häufig bei parallel verlaufenden Zeitreihen (beide wachsen im Zeitverlauf, ohne inhaltlichen Bezug).

Ob ein gemessenes r nur zufällig zustande gekommen sein kann, prüft man mit einem **Signifikanztest**. Ausgangspunkt ist die **Nullhypothese** „In der Grundgesamtheit besteht kein Zusammenhang". Der **p-Wert** gibt an, wie wahrscheinlich ein mindestens so starkes Ergebnis wäre, wenn die Nullhypothese stimmt; üblich ist die Schwelle p < 0,05 (Signifikanzniveau 5 %, ebenfalls eine Konvention). Zwei Prüfungsfallen: „signifikant" heißt nur „vermutlich kein Zufall" – nicht „kausal" und nicht „stark"; und bei sehr großen Datenmengen wird schon ein winziges, praktisch bedeutungsloses r signifikant. Umgekehrt kann bei sehr wenigen Wertepaaren selbst ein auffälliges r noch Zufall sein.

**Für Kausalität sprechen:** zeitliche Abfolge (Ursache vor Wirkung), fachlich plausibler Wirkmechanismus, Bestätigung durch ein **kontrolliertes Experiment** (z. B. A/B-Test), Stabilität des Zusammenhangs über verschiedene Zeiträume und Teilgruppen.

**Formulierung, die in der Prüfung Punkte bringt:** „Die Daten zeigen einen starken positiven Zusammenhang. Ein ursächlicher Wirkungszusammenhang lässt sich daraus allein nicht ableiten; hierfür wäre ein kontrollierter Test oder eine fachliche Erklärung des Wirkmechanismus erforderlich."

---

# Teil 2 – Lineare Regression

Während die Korrelation nur die **Stärke** beschreibt, liefert die Regression eine **Gleichung** – und damit Prognosen.

## 2.1 Die Regressionsgerade

$\hat{y} = a + b \cdot x$

- **b** = Steigung = Änderung von y, wenn x um **eine Einheit** steigt (die inhaltlich wichtigste Zahl!)
- **a** = Achsenabschnitt = rechnerischer y-Wert bei x = 0
- **ŷ** („y Dach") = **geschätzter** Wert, nicht der beobachtete

**Berechnung:**

$b = \dfrac{S_{xy}}{S_{xx}}$ · $a = \bar{y} - b \cdot \bar{x}$

Die Gerade wird nach der **Methode der kleinsten Quadrate** bestimmt: Die Summe der quadrierten senkrechten (in y-Richtung gemessenen, nicht rechtwinklig zur Geraden) Abstände zwischen Beobachtungen und Gerade wird minimiert. Diese Abstände heißen **Residuen** ($e = y - \hat{y}$).

## 2.2 Durchgerechnetes Beispiel

Werbebudget x (in T€) und Umsatz y (in T€) über fünf Monate:

| Monat | x | y | x − x̄ | y − ȳ | (x−x̄)(y−ȳ) | (x−x̄)² |
|---|---|---|---|---|---|---|
| 1 | 1 | 30 | −2 | −14 | 28 | 4 |
| 2 | 2 | 40 | −1 | −4 | 4 | 1 |
| 3 | 3 | 42 | 0 | −2 | 0 | 0 |
| 4 | 4 | 52 | 1 | 8 | 8 | 1 |
| 5 | 5 | 56 | 2 | 12 | 24 | 4 |
| **Σ** | **15** | **220** | 0 | 0 | **64** | **10** |

$\bar{x} = \frac{15}{5} = 3$ · $\bar{y} = \frac{220}{5} = 44$

$b = \frac{64}{10}$ = **6,4** · $a = 44 - 6{,}4 \cdot 3 = 44 - 19{,}2$ = **24,8**

**Regressionsgleichung:** $\hat{y} = 24{,}8 + 6{,}4 \cdot x$

**Interpretation (so formulieren!):** Je zusätzlich eingesetzten 1.000 € Werbebudget steigt der Umsatz im Durchschnitt um 6.400 €. Der Achsenabschnitt von 24,8 T€ ist der rechnerische Grundumsatz ohne Werbung – ob er fachlich sinnvoll ist, hängt davon ab, ob x = 0 im beobachteten Wertebereich liegt.

**Prognose für x = 6:** $\hat{y} = 24{,}8 + 6{,}4 \cdot 6$ = **63,2 T€** (x = 6 liegt knapp außerhalb des beobachteten Bereichs – leichte Extrapolation, nur unter Vorbehalt vertretbar)

⚠️ **Extrapolationswarnung:** Beobachtet wurde nur der Bereich x = 1 bis 5. Eine Prognose für x = 20 wäre unzulässig – außerhalb des Datenbereichs gilt der lineare Zusammenhang nicht notwendigerweise weiter (Sättigungseffekte). Diese Einschränkung **immer dazuschreiben**, sie ist regelmäßig eigenständig bepunktet.

## 2.3 Bestimmtheitsmaß R²

$R^2 = r^2$ (gilt so bei der einfachen linearen Regression mit **einem** x) und liegt zwischen 0 und 1. Es gibt den **Anteil der Streuung von y an, der durch das Modell erklärt wird**.

Allgemeine Definition (gilt auch bei mehreren Einflussgrößen): $R^2 = 1 - \dfrac{\sum e^2}{S_{yy}}$ – also 1 minus „unerklärte Streuung (Residuen) durch Gesamtstreuung".

Im Beispiel: $S_{yy} = 424$ → $r = \frac{64}{\sqrt{10 \cdot 424}} = \frac{64}{65{,}12}$ = **0,983** → $R^2 = 0{,}983^2$ = **0,966**

Interpretation: Rund 96,6 % der Umsatzschwankungen lassen sich durch das Werbebudget erklären; die restlichen 3,4 % gehen auf andere Einflüsse zurück (Saison, Wettbewerb, Zufall).

**Grenzen von R²:** Ein hohes R² bedeutet **nicht**, dass das Modell richtig oder der Zusammenhang kausal ist. Es misst nur, wie gut die Gerade zu **diesen** Daten passt. Bei wenigen Datenpunkten ist ein hohes R² schnell erreicht und wenig aussagekräftig.

**Residuen prüfen:** $e = y - \hat{y}$. Im Beispiel: −1,2 / +2,4 / −2,0 / +1,6 / −0,8. Erwünscht ist eine **zufällige** Streuung um null. Zeigen die Residuen ein Muster (z. B. erst alle negativ, dann alle positiv), ist der Zusammenhang nicht linear und das Modell ungeeignet.

Kontrollen: Die Residuen der Kleinste-Quadrate-Geraden summieren sich immer zu null (−1,2 + 2,4 − 2,0 + 1,6 − 0,8 = 0). Ihre Quadratsumme liefert R² auf dem zweiten Weg: $\sum e^2 = 14{,}4$ → $R^2 = 1 - \frac{14{,}4}{424}$ = **0,966** ✓

> ❓ **Prüferfrage:** Ihr Modell hat R² = 0,95. Ein Kollege sagt: „Damit können wir den Umsatz sicher vorhersagen." Beurteilen Sie das.
> *Das ist zu optimistisch. R² beschreibt nur die Anpassungsgüte an die vorliegenden Daten. Aussagekraft für die Zukunft besteht nur, wenn sich die Rahmenbedingungen nicht ändern, die Prognose innerhalb des beobachteten Wertebereichs liegt und das Modell an unabhängigen Daten geprüft wurde – bei fünf Datenpunkten ist ein hohes R² zudem leicht zu erreichen.*

> ❓ **Prüferfrage:** Bei 2 Millionen Kundendatensätzen ist die Korrelation zwischen Alter und Warenkorbwert mit r = 0,03 hochsignifikant (p < 0,001). Ist das ein wichtiger Befund?
> *Nein. Signifikant heißt nur, dass der Zusammenhang vermutlich nicht zufällig ist. Mit r = 0,03 ist er praktisch bedeutungslos: R² = 0,0009, das Alter erklärt also nur rund 0,1 % der Streuung. Bei sehr großen Datenmengen wird fast jeder noch so kleine Effekt signifikant – entscheidend für die Bewertung ist die Stärke des Zusammenhangs, nicht der p-Wert.*

---

# Teil 3 – Zeitreihen

Zeitreihen sind der häufigste Datentyp im betrieblichen Berichtswesen. Eine Zeitreihe setzt sich zusammen aus **Trend** (langfristige Richtung), **Saison** (regelmäßige Schwankung), **Konjunktur/Zyklus** und **Zufall**.

## 3.1 Gleitender Durchschnitt

Glättet kurzfristige Schwankungen und macht den Trend sichtbar. Beim **3-Perioden-Durchschnitt** wird jeder Wert durch das Mittel aus sich selbst und seinen beiden Nachbarn ersetzt.

Beispiel (Monatsumsatz in T€): 120, 138, 126, 150, 144, 168, 156, 180

Erster Wert: $\frac{120 + 138 + 126}{3}$ = **128,0** · zweiter: $\frac{138 + 126 + 150}{3}$ = **138,0** · dritter: $\frac{126 + 150 + 144}{3}$ = **140,0** …

Geglättete Reihe: 128,0 · 138,0 · 140,0 · 154,0 · 156,0 · 168,0

Der zackige Verlauf verschwindet, der steigende Trend wird klar erkennbar. **Preis der Glättung:** Am Anfang und Ende der Reihe fehlen Werte (bei 3 Perioden je einer), und aktuelle Ausschläge werden abgeschwächt – für Frühwarnzwecke ist das ein Nachteil.

## 3.2 Wachstumsraten

Veränderung gegenüber Vorperiode $= \frac{\text{neuer Wert} - \text{alter Wert}}{\text{alter Wert}} \cdot 100$

Von 120 auf 138: $\frac{138 - 120}{120} = 0{,}15$ = **+15,0 %**
Gesamtentwicklung 120 → 180: $\frac{180 - 120}{120}$ = **+50,0 %**

⚠️ **Häufiger Fehler:** Prozentwerte einzelner Perioden dürfen nicht einfach addiert oder gemittelt werden – jede Rate bezieht sich auf eine andere Basis. Für die durchschnittliche Wachstumsrate über mehrere Perioden ist das **geometrische Mittel** korrekt.

Durchschnittliche Wachstumsrate über n Perioden: $\bar{r} = \sqrt[n]{\frac{\text{Endwert}}{\text{Anfangswert}}} - 1$

Beispiel 120 → 180 über 7 Monatsschritte: $\sqrt[7]{\frac{180}{120}} - 1 = \sqrt[7]{1{,}5} - 1$ = **+5,96 % je Monat**. Das arithmetische Mittel der sieben Monatsraten (+15,0 / −8,7 / +19,05 / −4,0 / +16,67 / −7,14 / +15,38 %) ergäbe dagegen 6,61 % – hochgerechnet $120 \cdot 1{,}0661^7 = 187{,}8$ statt der tatsächlichen 180 T€.

Zusätzlich unterscheiden: **Prozentpunkte vs. Prozent.** Steigt eine Fehlerquote von 4 % auf 6 %, sind das **2 Prozentpunkte**, aber **+50 Prozent** relativ. In Berichten ist das ein beliebter Manipulationsspielraum – und eine gern gestellte Prüfungsfrage.

---

# Teil 4 – Vom Zusammenhang zum Modell

Hier schließt sich der Kreis zur Datenanalyse (Vertiefung folgt in Deep Dive 6 und 7):

| Fragestellung | Verfahren |
|---|---|
| Wie hängen zwei metrische Merkmale zusammen? | Korrelation |
| Wie sagt man eine **stetige** Zielgröße vorher? | Regression |
| Wie sagt man eine **Kategorie** vorher (ja/nein)? | Klassifikation |
| Welche Gruppen gibt es in den Daten? | Clustering |

Die lineare Regression ist damit das einfachste **überwachte Lernverfahren** – sie lernt aus Beispielen mit bekannter Zielgröße. Alle Prinzipien, die du hier lernst (Modellgüte, Residuen, Extrapolationsgrenzen, Overfitting bei zu wenigen Daten), gelten in Deep Dive 7 genauso für komplexere Verfahren.

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Aus Korrelation auf Kausalität geschlossen (der Klassiker – kostet in jeder Klausur Punkte).
2. r berechnet, ohne das Streudiagramm auf Nichtlinearität zu prüfen.
3. x und y vertauscht: Die Regression von y auf x liefert eine **andere** Gerade als umgekehrt.
4. Prognose weit außerhalb des beobachteten Wertebereichs abgegeben (unzulässige Extrapolation).
5. Achsenabschnitt a inhaltlich gedeutet, obwohl x = 0 nicht im Datenbereich liegt.
6. R² als Beweis für Modellrichtigkeit oder Kausalität dargestellt.
7. Prozentpunkte und Prozent verwechselt.
8. Wachstumsraten mehrerer Perioden addiert statt geometrisch gemittelt.

---

# Übungsklausur Statistik II (100 Punkte, 90 Minuten)

Bearbeite die Klausur **am Ende des Themas** am Stück, handschriftlich, mit Taschenrechner. Runde auf zwei Nachkommastellen und **schreibe alle Zwischenschritte auf**.

## Anlage 1 – Schulungsstunden und Fehlerquote

Für sechs Montageteams wurden erfasst: absolvierte Schulungsstunden (x) und Fehlerquote in % (y).

| Team | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| x (Stunden) | 2 | 4 | 6 | 8 | 10 | 12 |
| y (Fehlerquote %) | 9,0 | 8,5 | 7,5 | 6,5 | 5,5 | 5,0 |

## Anlage 2 – Werbebudget und Umsatz (T€)

| Monat | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Werbebudget x | 1 | 2 | 3 | 4 | 5 |
| Umsatz y | 30 | 40 | 42 | 52 | 56 |

## Block A – Zusammenhänge beschreiben (20 P)

**A1 (6 P):** *Erläutern* Sie, welche vier Eigenschaften Sie einem Streudiagramm entnehmen, bevor Sie eine Kennzahl berechnen.

**A2 (8 P):** *Berechnen* Sie den Korrelationskoeffizienten für **Anlage 1**. *Stellen* Sie den Rechenweg tabellarisch *dar* (S_xy, S_xx, S_yy).

> **Formeln:**
> - S_xy = Σ (x_i − x̄) · (y_i − ȳ)
> - S_xx = Σ (x_i − x̄)²
> - S_yy = Σ (y_i − ȳ)²
> - Korrelationskoeffizient r = S_xy / √(S_xx · S_yy)

**A3 (6 P):** *Interpretieren* Sie Ihr Ergebnis nach Vorzeichen und Stärke und *formulieren* Sie eine Aussage, die für die Geschäftsführung verständlich ist.

## Block B – Korrelation und Kausalität (22 P)

**B1 (8 P):** Die Geschäftsführung folgert: „Mehr Schulung senkt die Fehlerquote – wir verdoppeln das Schulungsbudget." *Beurteilen* Sie diese Schlussfolgerung. *Nennen* Sie **drei** alternative Erklärungen für den beobachteten Zusammenhang.

**B2 (6 P):** *Beschreiben* Sie, wie ein Test aufgebaut sein müsste, um einen ursächlichen Zusammenhang zu belegen.

**B3 (8 P):** In einem Bericht steht: „Die Anzahl der eingesetzten Servicefahrzeuge korreliert mit r = 0,91 mit dem Jahresumsatz. Wir sollten mehr Fahrzeuge kaufen." *Erläutern* Sie den Begriff **Scheinkorrelation** und *beurteilen* Sie die Empfehlung. *Nennen* Sie eine mögliche Drittvariable.

## Block C – Lineare Regression (30 P)

**C1 (12 P):** *Ermitteln* Sie für **Anlage 2** die Regressionsgleichung ŷ = a + b · x. *Stellen* Sie den Rechenweg tabellarisch *dar*.

> **Formeln:**
> - S_xy = Σ (x_i − x̄) · (y_i − ȳ)
> - S_xx = Σ (x_i − x̄)²
> - Steigung b = S_xy / S_xx
> - Achsenabschnitt a = ȳ − b · x̄

**C2 (6 P):** *Interpretieren* Sie die Steigung b und den Achsenabschnitt a jeweils inhaltlich.

**C3 (6 P):** *Berechnen* Sie den prognostizierten Umsatz für ein Werbebudget von 6 T€ sowie für 20 T€. *Beurteilen* Sie beide Prognosen hinsichtlich ihrer Zulässigkeit.

> **Formel:** Prognose ŷ = a + b · x (a und b aus C1)

**C4 (6 P):** *Berechnen* Sie die Residuen für die Monate 1 bis 5 und *erläutern* Sie, worauf Sie bei deren Verteilung achten.

> **Formel:** Residuum e_i = y_i − ŷ_i (beobachteter minus prognostizierter Wert)

## Block D – Modellgüte (16 P)

**D1 (6 P):** Für Anlage 2 gilt S_yy = 424. *Berechnen* Sie r und R².

> **Formeln:**
> - r = S_xy / √(S_xx · S_yy)
> - Bestimmtheitsmaß R² = r²

**D2 (6 P):** *Interpretieren* Sie R² in einem Satz und *nennen* Sie zwei Gründe, warum ein hohes R² allein keine verlässliche Prognose garantiert.

**D3 (4 P):** Ein Kollege ergänzt einen sechsten Monat mit x = 5, y = 15 (fehlerhaft erfasst, tatsächlich 55). *Erläutern* Sie ohne Rechnung, wie sich dieser eine Wert auf r, R² und die Regressionsgerade auswirkt.

## Block E – Zeitreihen (12 P)

Monatsumsatz in T€: 120, 138, 126, 150, 144, 168, 156, 180

**E1 (6 P):** *Berechnen* Sie den gleitenden 3-Perioden-Durchschnitt für die ersten vier möglichen Werte und *erläutern* Sie den Zweck der Glättung.

> **Formel:** gleitender 3-Perioden-Durchschnitt = Summe von drei aufeinanderfolgenden Werten / 3; das Fenster rückt je Wert um eine Periode weiter

**E2 (3 P):** *Berechnen* Sie die prozentuale Veränderung von Monat 1 zu Monat 2 sowie die Gesamtveränderung von Monat 1 zu Monat 8.

> **Formel:** prozentuale Veränderung = (neuer Wert − alter Wert) / alter Wert · 100 %

**E3 (3 P):** Die Reklamationsquote steigt von 4 % auf 6 %. Ein Bericht meldet „+2 %", ein anderer „+50 %". *Erläutern* Sie, welche Angabe korrekt ist und wie beide Formulierungen fachlich richtig lauten.

---

## Fachgespräch: typische Fragen des Ausschusses

1. „Welche Zusammenhänge haben Sie in Ihren Daten untersucht – und wie haben Sie ausgeschlossen, dass es sich um Scheinkorrelationen handelt?"
2. „Sie haben eine Prognose abgegeben. Für welchen Wertebereich ist sie gültig, und woran würden Sie merken, dass Ihr Modell nicht mehr passt?"
3. „Wie belastbar ist Ihre Datenbasis für die getroffenen Aussagen?" (Erwartet: Stichprobengröße, Zeitraum, Repräsentativität, Datenqualität.)
4. „Ihre Auswertung zeigt einen Zusammenhang. Welche Handlungsempfehlung leiten Sie ab – und mit welchem Vorbehalt?"
5. „Warum haben Sie eine lineare Regression gewählt und kein komplexeres Verfahren?" (Erwartet: Nachvollziehbarkeit für den Fachbereich, ausreichende Anpassungsgüte, geringe Datenmenge, Sparsamkeitsprinzip.)

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich lese Richtung, Stärke, Form und Ausreißer aus einem Streudiagramm ab.
- [ ] Ich berechne r über S_xy, S_xx und S_yy sicher und tabellarisch.
- [ ] Ich interpretiere r nach Vorzeichen und Stärke in Alltagssprache.
- [ ] Ich kann die vier Erklärungen für eine Korrelation nennen und Scheinkorrelation erläutern.
- [ ] Ich stelle die Regressionsgleichung auf und deute a und b inhaltlich korrekt.
- [ ] Ich erkenne unzulässige Extrapolation und schreibe die Einschränkung von selbst dazu.
- [ ] Ich berechne und interpretiere R² inklusive seiner Grenzen.
- [ ] Ich beherrsche gleitenden Durchschnitt, Wachstumsraten und die Unterscheidung Prozent/Prozentpunkte.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
- [ ] Ich berechne die Spearman-Rangkorrelation, erkläre „signifikant" (p-Wert) korrekt und bestimme durchschnittliche Wachstumsraten mit dem geometrischen Mittel.
