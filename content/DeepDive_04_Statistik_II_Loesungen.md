# Musterlösungen Übungsklausur Statistik II (Deep Dive 4)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** In diesem Themenblock liegen mehr als die Hälfte der Punkte in **Interpretations- und Beurteilungsaufgaben**. Ein richtig gerechnetes r ohne saubere Deutung ist nur die halbe Miete. 92+ P = sehr gut.

---

## Block A – Zusammenhänge beschreiben (20 P)

**A1 (6 P):** *(je 1,5 P)*
1. **Richtung** des Zusammenhangs: steigend (positiv), fallend (negativ) oder kein erkennbarer Verlauf.
2. **Stärke:** enge Punktwolke = starker Zusammenhang, breite Streuung = schwacher.
3. **Form:** linear oder gekrümmt – bei nichtlinearem Verlauf ist der Pearson-Koeffizient irreführend.
4. **Ausreißer:** einzelne weit abseits liegende Punkte, die Korrelation und Regressionsgerade stark verzerren können.

**A2 (8 P):**
$\bar{x} = \frac{42}{6} = 7$ Stunden · $\bar{y} = \frac{42}{6} = 7$ %

| x | y | x − x̄ | y − ȳ | (x−x̄)(y−ȳ) | (x−x̄)² | (y−ȳ)² |
|---|---|---|---|---|---|---|
| 2 | 9,0 | −5 | 2,0 | −10,00 | 25 | 4,00 |
| 4 | 8,5 | −3 | 1,5 | −4,50 | 9 | 2,25 |
| 6 | 7,5 | −1 | 0,5 | −0,50 | 1 | 0,25 |
| 8 | 6,5 | 1 | −0,5 | −0,50 | 1 | 0,25 |
| 10 | 5,5 | 3 | −1,5 | −4,50 | 9 | 2,25 |
| 12 | 5,0 | 5 | −2,0 | −10,00 | 25 | 4,00 |
| **Σ 42** | **Σ 42** | 0 | 0 | **−30,00** | **70** | **13,00** |

$r = \frac{S_{xy}}{\sqrt{S_{xx} \cdot S_{yy}}} = \frac{-30}{\sqrt{70 \cdot 13}} = \frac{-30}{\sqrt{910}} = \frac{-30}{30{,}17}$ = **−0,99**

*Prüferkommentar: 2 P Mittelwerte, 3 P vollständige Abweichungstabelle, 2 P korrekte Summen $S_{xy}$/$S_{xx}$/$S_{yy}$, 1 P Endergebnis. Kontrolle: Beide Abweichungsspalten müssen sich zu 0 summieren. Ein positives r ist hier ein Vorzeichenfehler und kostet zusätzlich die Interpretationspunkte in A3.*

**A3 (6 P):**
Das Vorzeichen ist **negativ** – die Merkmale verlaufen gegenläufig: Mit steigender Schulungsstundenzahl sinkt die Fehlerquote. *(2 P)*
Der Betrag von 0,99 liegt nahe am Maximum von 1 und zeigt einen **sehr starken linearen** Zusammenhang. *(2 P)*
Formulierung für die Geschäftsführung: „Teams mit mehr Schulungsstunden weisen in unseren Daten durchgängig niedrigere Fehlerquoten auf; der Zusammenhang ist außergewöhnlich eng. Ob die Schulung die Ursache ist, lässt sich aus diesen Daten allein noch nicht belegen." *(2 P)*

*Prüferkommentar: Der Vorbehaltssatz am Ende ist der Punktebringer – er greift der Beurteilungsaufgabe B1 vor und zeigt, dass du den Unterschied zwischen Zusammenhang und Ursache verinnerlicht hast.*

---

## Block B – Korrelation und Kausalität (22 P)

**B1 (8 P):**
Die Schlussfolgerung ist **nicht zwingend**. Aus einem statistischen Zusammenhang allein folgt kein ursächlicher Wirkungszusammenhang – der beobachtete Zusammenhang kann mehrere Ursachen haben. *(2 P)*

Drei alternative Erklärungen: *(je 2 P)*
1. **Umgekehrte Wirkungsrichtung:** Teams mit ohnehin niedriger Fehlerquote arbeiten störungsärmer und haben dadurch mehr freie Zeit für Schulungen – nicht die Schulung senkt die Fehler, sondern wenige Fehler ermöglichen Schulung.
2. **Drittvariable:** Erfahrene, langjährige Mitarbeiter machen weniger Fehler **und** haben über die Jahre mehr Schulungsstunden angesammelt. Eigentliche Ursache ist die Berufserfahrung.
3. **Zufall bei kleiner Datenbasis:** Sechs Teams sind eine sehr kleine Stichprobe; ein hoher Korrelationswert kann zufällig entstehen, zumal weitere Einflussgrößen (Auftragsart, Teamgröße, eingesetzte Werkzeuge) nicht kontrolliert wurden.

**B2 (6 P):**
Erforderlich ist ein **kontrolliertes Experiment**: Die Teams werden **zufällig** in eine Schulungs- und eine Kontrollgruppe aufgeteilt (Randomisierung). *(2 P)* Nur die Schulungsgruppe erhält die Maßnahme; alle übrigen Bedingungen bleiben gleich. *(1 P)* Die Fehlerquote wird **vor und nach** der Maßnahme in beiden Gruppen gemessen und verglichen. *(2 P)* Die zeitliche Abfolge – Maßnahme vor Wirkung – ist Voraussetzung für eine Kausalaussage. *(1 P)*

*Prüferkommentar: Die Begriffe „Kontrollgruppe" und „zufällige Zuordnung" sind die Kernbegriffe. Wer nur „vorher-nachher messen" schreibt, erhält max. 3 P – ohne Kontrollgruppe bleibt offen, ob die Verbesserung nicht ohnehin eingetreten wäre.*

**B3 (8 P):**
**Scheinkorrelation** bezeichnet einen statistisch messbaren Zusammenhang zwischen zwei Merkmalen ohne inhaltlichen Wirkungszusammenhang. Er entsteht typischerweise durch eine gemeinsame Drittvariable oder dadurch, dass beide Größen im Zeitverlauf parallel wachsen. *(3 P)*

Beurteilung: Die Empfehlung ist **nicht haltbar**. Der Kauf zusätzlicher Fahrzeuge erzeugt für sich genommen keinen Umsatz – die Wirkungsrichtung ist eher umgekehrt: Ein wachsendes Unternehmen mit mehr Aufträgen beschafft mehr Fahrzeuge. Zusätzliche Fahrzeuge ohne zusätzliche Aufträge erhöhen nur die Fixkosten. *(3 P)*

Mögliche Drittvariable: die **Unternehmensgröße bzw. das Auftragsvolumen** – sie treibt sowohl den Fuhrpark als auch den Umsatz. Ebenfalls anerkannt: allgemeine Konjunkturentwicklung, Mitarbeiterzahl, Betrachtungszeitraum mit generellem Wachstum. *(2 P)*

---

## Block C – Lineare Regression (30 P)

**C1 (12 P):**
$\bar{x} = \frac{15}{5} = 3$ · $\bar{y} = \frac{220}{5} = 44$

| x | y | x − x̄ | y − ȳ | (x−x̄)(y−ȳ) | (x−x̄)² |
|---|---|---|---|---|---|
| 1 | 30 | −2 | −14 | 28 | 4 |
| 2 | 40 | −1 | −4 | 4 | 1 |
| 3 | 42 | 0 | −2 | 0 | 0 |
| 4 | 52 | 1 | 8 | 8 | 1 |
| 5 | 56 | 2 | 12 | 24 | 4 |
| **Σ 15** | **Σ 220** | 0 | 0 | **64** | **10** |

$b = \frac{S_{xy}}{S_{xx}} = \frac{64}{10}$ = **6,4**
$a = \bar{y} - b \cdot \bar{x} = 44 - 6{,}4 \cdot 3 = 44 - 19{,}2$ = **24,8**

**Regressionsgleichung:** $\hat{y} = 24{,}8 + 6{,}4 \cdot x$

*Prüferkommentar: 2 P Mittelwerte, 4 P Abweichungstabelle, 2 P $S_{xy}$ und $S_{xx}$, 2 P b, 2 P a. Wer a und b vertauscht (ŷ = 6,4 + 24,8x), verliert 4 P – Kontrolle: Setze x̄ ein, es muss ȳ herauskommen (24,8 + 6,4 · 3 = 44 ✓). Diese Probe kostet zehn Sekunden und rettet regelmäßig Punkte.*

**C2 (6 P):**
**Steigung b = 6,4:** Steigt das Werbebudget um 1 T€, so steigt der Umsatz im Durchschnitt um 6,4 T€. Der positive Wert bestätigt den gleichläufigen Zusammenhang. *(3 P)*
**Achsenabschnitt a = 24,8:** Rechnerischer Umsatz bei einem Werbebudget von 0 T€, also ein Grundumsatz ohne Werbung. Da x = 0 außerhalb des beobachteten Bereichs (1 bis 5 T€) liegt, ist dieser Wert nur eine rechnerische Größe und inhaltlich mit Vorsicht zu deuten. *(3 P)*

*Prüferkommentar: Der Vorbehalt zum Achsenabschnitt ist eigenständig bepunktet (2 der 3 P). Er unterscheidet das reine Ablesen vom Verstehen.*

**C3 (6 P):**
- $x = 6$: $\hat{y} = 24{,}8 + 6{,}4 \cdot 6 = 24{,}8 + 38{,}4$ = **63,20 T€** *(2 P)*
- $x = 20$: $\hat{y} = 24{,}8 + 6{,}4 \cdot 20 = 24{,}8 + 128$ = **152,80 T€** *(2 P)*

Beurteilung: Die Prognose für x = 6 liegt knapp außerhalb, aber nahe am beobachteten Bereich (1 bis 5) und ist unter Vorbehalt vertretbar. Die Prognose für x = 20 ist eine **unzulässige Extrapolation** – sie liegt weit außerhalb der Datenbasis. Ein linearer Zusammenhang gilt dort nicht notwendigerweise weiter; realistisch sind Sättigungseffekte, bei denen zusätzliche Werbeausgaben immer weniger zusätzlichen Umsatz bringen. *(2 P)*

**C4 (6 P):**
Residuen $e = y - \hat{y}$:

| Monat | y | ŷ | e |
|---|---|---|---|
| 1 | 30 | 31,20 | **−1,20** |
| 2 | 40 | 37,60 | **+2,40** |
| 3 | 42 | 44,00 | **−2,00** |
| 4 | 52 | 50,40 | **+1,60** |
| 5 | 56 | 56,80 | **−0,80** |

*(4 P für die korrekten Werte)*

Zu achten ist auf eine **zufällige, musterlose Streuung um null**: Positive und negative Abweichungen sollten in zufälliger Folge auftreten und in etwa gleich groß sein. Zeigt sich ein systematisches Muster – etwa erst nur negative, dann nur positive Residuen, oder mit x wachsende Abweichungen –, ist der Zusammenhang nicht linear und das Modell ungeeignet. Hier wechseln die Vorzeichen, die Beträge sind klein (max. 2,4 T€) und wachsen nicht mit x – kein Hinweis auf Nichtlinearität, das Modell passt (bei nur fünf Punkten mit begrenzter Aussagekraft). Kontrolle: Die Residuen summieren sich zu null. *(2 P)*

---

## Block D – Modellgüte und Zeitreihen (28 P)

**D1 (6 P):**
$r = \frac{S_{xy}}{\sqrt{S_{xx} \cdot S_{yy}}} = \frac{64}{\sqrt{10 \cdot 424}} = \frac{64}{\sqrt{4240}} = \frac{64}{65{,}12}$ = **0,98**
$R^2 = r^2 = 0{,}9829^2 = 0{,}9660$ ≈ **0,97**

*Mit dem ungerundeten r weiterrechnen: Wer das gerundete 0,98 quadriert, erhält 0,9604 ≈ 0,96. Kontrolle über die Residuen aus C4: R² = 1 − Σe² / $S_{yy}$ = 1 − 14,4 / 424 = 0,9660.*

*(3 P r, 3 P R². Der Rechenweg über R² = r² muss erkennbar sein.)*

**D2 (6 P):**
Interpretation: Rund 97 % der Umsatzschwankungen lassen sich durch das Werbebudget erklären; etwa 3 % gehen auf andere Einflüsse zurück. *(2 P)*

Zwei Gründe gegen blindes Vertrauen: *(je 2 P)*
1. R² misst nur die Anpassung an die **vorliegenden** Daten. Bei nur fünf Datenpunkten ist ein hohes R² leicht zu erreichen und sagt wenig über neue Daten aus – das Modell könnte überangepasst sein.
2. Ein hoher Erklärungsanteil belegt weder Kausalität noch die Gültigkeit außerhalb des beobachteten Bereichs. Ändern sich Rahmenbedingungen (Wettbewerb, Saison, Preise), verliert das Modell seine Gültigkeit, ohne dass R² das anzeigt.

*Ebenfalls anerkannt: fehlende Prüfung an unabhängigen Testdaten; wichtige Einflussgrößen nicht im Modell enthalten.*

**D3 (4 P):**
Der Wert 15 statt 55 liegt weit unter dem Trend und wirkt als **Ausreißer mit starker Hebelwirkung**. Erwartete Auswirkungen: *(je 1 P, max. 4 P)*
- Der Betrag von **r sinkt deutlich** – der lineare Zusammenhang erscheint schwächer, als er ist.
- **R² fällt entsprechend**, das Modell scheint schlechter zu passen.
- Die **Regressionsgerade wird nach unten gezogen**; ihre Steigung verringert sich, da der Punkt bei hohem x einen sehr niedrigen y-Wert hat.
- Die Prognosen werden verzerrt – vor allem bei hohen Werbebudgets deutlich zu niedrig (am unteren Rand des Bereichs liegt die abgeflachte Gerade dagegen sogar höher); das Residuum dieses Punktes wäre auffällig groß – genau daran lässt sich der Erfassungsfehler erkennen.

*Prüferkommentar: Der letzte Gedanke – Residuenanalyse als Werkzeug zum Aufspüren von Datenfehlern – verbindet Statistik mit Datenqualität und ist im Fachgespräch Gold wert.*

**D4 (6 P):**
- $\frac{120 + 138 + 126}{3} = \frac{384}{3}$ = **128,00**
- $\frac{138 + 126 + 150}{3} = \frac{414}{3}$ = **138,00**
- $\frac{126 + 150 + 144}{3} = \frac{420}{3}$ = **140,00**
- $\frac{150 + 144 + 168}{3} = \frac{462}{3}$ = **154,00**

*(4 P für die vier Werte)*

Zweck: Kurzfristige, zufällige Schwankungen werden geglättet, sodass der **längerfristige Trend** sichtbar wird – hier ein deutlicher Aufwärtstrend, der in der ungeglätteten Zackenreihe schwer erkennbar ist. Nachteil: Am Anfang und Ende der Reihe entfallen Werte, und aktuelle Ausschläge werden abgeschwächt. *(2 P)*

**D5 (3 P):**
- Monat 1 → 2: $\frac{138 - 120}{120} = 0{,}15$ = **+15,00 %** *(1,5 P)*
- Monat 1 → 8: $\frac{180 - 120}{120} = 0{,}50$ = **+50,00 %** *(1,5 P)*

**D6 (3 P):**
Beide Angaben beschreiben dieselbe Veränderung, sind aber unterschiedlich bezogen. Korrekt formuliert:
- „Die Reklamationsquote ist um **2 Prozentpunkte** gestiegen." (absolute Differenz der Prozentwerte)
- „Die Reklamationsquote ist um **50 Prozent** gestiegen." (relative Veränderung: $\frac{2}{4} = 0{,}5$)

Die Angabe „+2 %" ist **falsch** – sie verwechselt Prozentpunkte mit Prozent. *(2 P für beide korrekten Formulierungen, 1 P für die Feststellung des Fehlers)*

*Prüferkommentar: Diese Unterscheidung wird in Berichten regelmäßig zur Beschönigung genutzt. Sie kommt in Prüfungen und im Fachgespräch häufiger vor, als ihre scheinbare Einfachheit vermuten lässt.*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Thema sitzt – Formeln als Karteikarte pflegen |
| 81–91 | gut | Prüfe, ob die Punkte im Rechen- oder im Beurteilungsteil fehlten |
| < 81 | | Teil 1–2 wiederholen, Klausur nach einer Woche neu schreiben |

**Selbstdiagnose:** Zähle deine Punkte in den Blöcken A2, C1, D1 (Rechnen: 26 P) getrennt von den Blöcken B, C2/C3, D2/D3 (Beurteilen: 44 P). Fehlen dir Punkte im Rechenteil, hilft Üben. Fehlen sie im Beurteilungsteil, lerne die Standardformulierungen aus diesem Lernzettel auswendig – bei einer angestrebten 1 sind das die entscheidenden Punkte, und sie folgen immer demselben Muster: **Ergebnis nennen → inhaltlich deuten → Einschränkung benennen.**
