# Musterlösungen Übungsklausur Modellgüte (Deep Dive 7)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Rechenblöcke B und E sind reine Punktelieferanten – hier darf nichts fehlen. Die Blöcke C und D entscheiden über die 1. 92+ P = sehr gut.

**Anlagenwerte:** TP = 90 · FN = 10 · FP = 60 · TN = 840 · n = 1.000

---

## Block A – Aufteilung und Anpassung (24 P)

**A1 (6 P):**
Ein Modell, das an denselben Daten gemessen wird, aus denen es gelernt hat, bewertet sich an seiner eigenen Vorlage – es kann Muster auswendig gelernt haben, ohne verallgemeinerbar zu sein. Nur eine **unabhängige, dem Modell unbekannte** Datenmenge zeigt, wie gut es auf neuen Fällen arbeitet. *(4 P)*
Typische Aufteilung: 70–80 % Trainingsdaten, 20–30 % Testdaten, zufällig gezogen. *(2 P)*

**A2 (8 P):** *(je Fall 1 P Erklärung, 1 P Erkennungsmerkmal, 2 P Gegenmaßnahmen)*

| | Overfitting | Underfitting |
|---|---|---|
| Erklärung | Das Modell passt sich zu stark an die Trainingsdaten an und lernt auch deren zufälliges Rauschen. | Das Modell ist zu einfach und erfasst nicht einmal das Grundmuster. |
| erkennbar an den Gütewerten | große Lücke: sehr gute Trainingsgüte, deutlich schlechtere Testgüte | Trainings- und Testgüte sind beide niedrig |
| zwei Gegenmaßnahmen | Modellkomplexität verringern (Baumtiefe begrenzen, Pruning), mehr Trainingsdaten, Regularisierung, Kreuzvalidierung, früher Trainingsabbruch | komplexeres Verfahren wählen, aussagekräftigere Merkmale bilden, länger trainieren |

**A3 (6 P):**
Bei der 5-fachen Kreuzvalidierung werden die Daten in fünf gleich große Teile zerlegt. In fünf Durchläufen dient jeweils ein Teil als Testmenge und die übrigen vier als Trainingsmenge; die fünf Gütewerte werden anschließend gemittelt. *(4 P)*
Vorteile *(je 1 P)*: Jeder Datensatz wird genau einmal getestet, sodass die gesamte Datenmenge zur Bewertung beiträgt. Das Ergebnis hängt nicht von einer zufällig günstigen oder ungünstigen Einzelaufteilung ab und ist dadurch stabiler – besonders wertvoll bei kleinen Datenmengen.

**A4 (4 P):**
(a) **Reklamationsrisiko je Auftrag:** Das Vorgehen ist **problematisch**. Durch die Sortierung nach Datum enthalten Trainings- und Testdaten unterschiedliche Zeiträume; saisonale Effekte, Sortimentswechsel oder ein Spediteurwechsel führen zu einer verzerrten Bewertung. Korrekt wäre eine **zufällige** Aufteilung. *(2 P)*
(b) **Monatsumsatzprognose:** Hier ist die chronologische Trennung **richtig und notwendig**. Bei Zeitreihen würde ein zufälliger Split Informationen aus der Zukunft in das Training holen; die Güte wäre dadurch systematisch zu optimistisch. *(2 P)*

*Prüferkommentar: Die Aufgabe prüft, ob du erkennst, dass dieselbe Methode je nach Datentyp richtig oder falsch ist. Wer beide Fälle gleich beurteilt, erhält maximal 1 P.*

---

## Block B – Konfusionsmatrix berechnen (30 P)

**B1 (4 P):**
Positive Klasse ist **„Reklamation"** – das seltene, fachlich interessierende Ereignis. *(1 P)*

| | Vorhersage: Reklamation | Vorhersage: keine |
|---|---|---|
| Tatsächlich Reklamation | **TP = 90** | **FN = 10** |
| Tatsächlich keine | **FP = 60** | **TN = 840** |

*(3 P für die vier korrekten Zuordnungen)*

**B2 (20 P):** *(je 4 P: 1 P Ansatz, 2 P Rechenweg, 1 P Ergebnis)*

- **Accuracy** = $\frac{TP + TN}{n} = \frac{90 + 840}{1.000} = \frac{930}{1.000}$ = **93,00 %**
- **Precision** = $\frac{TP}{TP + FP} = \frac{90}{90 + 60} = \frac{90}{150}$ = **60,00 %**
- **Recall** = $\frac{TP}{TP + FN} = \frac{90}{90 + 10} = \frac{90}{100}$ = **90,00 %**
- **F1** = $2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = 2 \cdot \frac{0{,}60 \cdot 0{,}90}{0{,}60 + 0{,}90} = \frac{1{,}08}{1{,}50}$ = **72,00 %**
- **Spezifität** = $\frac{TN}{TN + FP} = \frac{840}{840 + 60} = \frac{840}{900}$ = **93,33 %**

*Prüferkommentar: Häufigster Fehler beim F1 ist das arithmetische Mittel – (60 + 90)/2 = 75 % wäre falsch. Das F1-Maß ist das **harmonische** Mittel und liegt deshalb stets näher am kleineren der beiden Werte (hier 72 %). Zweithäufigster Fehler: Precision und Recall verwechselt, also durch die falsche Summe geteilt.*

**B3 (6 P):**
Das triviale Modell sagt immer „keine Reklamation": TP = 0, FP = 0, FN = 100, TN = 900.
- Accuracy: $\frac{0 + 900}{1.000}$ = **90,00 %** *(2 P)*
- Recall: $\frac{0}{0 + 100}$ = **0,00 %** *(2 P)*

Vergleich: Die Accuracy des trivialen Modells (90 %) liegt nur knapp unter der des echten Modells (93 %) – gemessen an dieser Kennzahl allein erschiene der gesamte Aufwand kaum lohnend. Der Recall zeigt jedoch den entscheidenden Unterschied: Das triviale Modell findet **keinen einzigen** Reklamationsfall, das echte Modell 90 von 100. Bei unausgeglichenen Klassen ist die Accuracy daher irreführend (**Accuracy-Paradox**). *(2 P)*

---

## Block C – Interpretation und Auswahl (22 P)

**C1 (8 P):**
**Precision** beantwortet die Frage: Von allen Fällen, die das Modell als Reklamation **vorhergesagt** hat – wie viele waren es wirklich? Sie misst also die Verlässlichkeit eines Alarms. *(2 P)*
**Recall** beantwortet: Von allen Fällen, die **tatsächlich** reklamiert wurden – wie viele hat das Modell gefunden? Sie misst die Vollständigkeit der Erkennung. *(2 P)*

In der Anlage ist der **Recall (90 %) höher** als die Precision (60 %). *(2 P)* Ursache: Das Modell stuft mit 150 Vorhersagen deutlich mehr Aufträge als riskant ein, als es tatsächlich Reklamationen gibt (100). Es übersieht dadurch kaum echte Fälle (nur 10 FN), erzeugt aber viele Fehlalarme (60 FP) – es ist bewusst „vorsichtig" eingestellt. *(2 P)*

**C2 (8 P):**
Wichtigste Kennzahl ist der **Recall**. *(2 P)*

Begründung über die Fehlerfolgen: *(je 2 P)*
- **FN (übersehener Fall):** Ein tatsächlich problematischer Auftrag wird ohne Zusatzprüfung ausgeliefert. Folge: Reklamation beim Kunden mit Nacharbeit, Kulanzkosten, Transportaufwand und Imageschaden – der Fehler wirkt sich beim Kunden aus.
- **FP (Fehlalarm):** Ein unproblematischer Auftrag wird zusätzlich geprüft. Folge: geringer interner Mehraufwand, kurze Verzögerung – der Fehler bleibt im Haus und ist vergleichsweise billig.

Schlussfolgerung: Da ein FN erheblich teurer ist als ein FP, wird ein hoher Recall angestrebt und eine niedrigere Precision bewusst in Kauf genommen. *(2 P)*

**C3 (6 P):**
Wird die Entscheidungsschwelle gesenkt, stuft das Modell mehr Aufträge als riskant ein. Dadurch werden zusätzliche echte Reklamationsfälle gefunden – die FN nehmen ab, der **Recall steigt**. *(3 P)*
Gleichzeitig geraten mehr unproblematische Aufträge in die Positivgruppe – die FP nehmen zu, die **Precision sinkt** in der Regel. *(3 P)*
Es handelt sich um eine Abwägung: Beide Kennzahlen lassen sich in der Regel nur gegeneinander verbessern; die richtige Schwelle ergibt sich aus den Kosten beider Fehlerarten.

---

## Block D – Wirtschaftliche Bewertung (12 P)

**D1 (6 P):**
- **Modell:** 10 FN · 120 € = 1.200 € · 60 FP · 15 € = 900 € → **Fehlerkosten gesamt 2.100 €** *(3 P)*
- **Triviales Modell:** 100 FN · 120 € = **12.000 €** (keine FP, da nie ein Alarm ausgelöst wird) *(3 P)*

**D2 (6 P):**
Beurteilung: Der Einsatz ist klar zu empfehlen. Das Modell senkt die Fehlerkosten von 12.000 € auf 2.100 € und damit um **9.900 € (rund 82,5 %)** im Testzeitraum. Die geringe Accuracy-Differenz gegenüber dem trivialen Modell (93 % zu 90 %) täuscht über diesen erheblichen wirtschaftlichen Vorteil hinweg. *(3 P)*

Nicht enthaltene Faktoren *(je 1,5 P, zwei genügen)*:
- **Kosten für Entwicklung, Betrieb und Pflege** des Modells (Entwicklungszeit, Infrastruktur, Monitoring, Retraining).
- **Kapazität für die Zusatzprüfungen:** 150 zusätzliche Prüfungen müssen personell abgedeckt werden; ist die Werkstatt ausgelastet, entstehen Verzögerungen im Gesamtprozess.
- **Nicht bezifferte Effekte:** Imageschaden und Kundenabwanderung durch Reklamationen sind mit 120 € vermutlich zu niedrig angesetzt; umgekehrt können Fehlalarme die Akzeptanz beim Personal senken.
- **Übertragbarkeit:** Die Werte stammen aus einem Testzeitraum; im Betrieb kann die Güte durch Model Drift sinken.

---

## Block E – Regressionsgüte (12 P)

**E1 (8 P):**

| y | ŷ | e = y − ŷ | \|e\| | e² |
|---|---|---|---|---|
| 100 | 90 | +10 | 10 | 100 |
| 120 | 126 | −6 | 6 | 36 |
| 90 | 84 | +6 | 6 | 36 |
| 130 | 132 | −2 | 2 | 4 |
| 110 | 108 | +2 | 2 | 4 |
| | | | **Σ 26** | **Σ 180** |

- **MAE** = $\frac{\sum |y - \hat{y}|}{n} = \frac{26}{5}$ = **5,20 T€** *(3 P)*
- $\text{MSE} = \frac{\sum (y - \hat{y})^2}{n} = \frac{180}{5} = 36{,}00$ → **RMSE** = $\sqrt{\text{MSE}} = \sqrt{36}$ = **6,00 T€** *(4 P)*
- *(1 P für die vollständige Fehlertabelle)*

*Prüferkommentar: Häufigster Fehler ist die Verwendung der vorzeichenbehafteten Fehler beim MAE – die Summe der Residuen liegt hier bei +10 −6 +6 −2 +2 = +10 und wäre als Gütemaß unbrauchbar, weil sich positive und negative Abweichungen aufheben. Deshalb wird der **Betrag** gebildet.*

**E2 (4 P):**
Der RMSE ist größer, weil die Fehler vor der Mittelung **quadriert** werden. Dadurch gehen große Abweichungen überproportional stark ein – hier vor allem der Fehler von +10, der quadriert 100 beiträgt, während er beim MAE nur mit 10 zählt. Ein RMSE deutlich über dem MAE zeigt daher ungleichmäßig verteilte Fehler mit einzelnen Ausreißern an. *(2 P)*

Anwendung: Den **MAE** bevorzugt man, wenn alle Abweichungen gleich schwer wiegen und ein robustes, gut kommunizierbares Maß gewünscht ist. Den **RMSE** wählt man, wenn große Einzelfehler besonders schädlich sind und stärker bestraft werden sollen – etwa bei Kapazitätsplanungen, wo eine einzelne große Fehlprognose gravierender ist als viele kleine. *(2 P)*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Formeln als Karteikarte pflegen, alle zwei Wochen eine Matrix rechnen |
| 81–91 | gut | Prüfe getrennt: Rechenblöcke B/E (42 P) gegen Argumentationsblöcke C/D (34 P) |
| < 81 | | Teil 2 wiederholen, Klausur nach einer Woche neu schreiben |

**Der eine Satz, der diesen Themenblock zusammenfasst:** Eine Kennzahl ohne Vergleichsmaßstab und ohne Kostenbezug ist keine Bewertung, sondern nur eine Zahl. Wer im Fachgespräch Accuracy, Baseline und Fehlerkosten in einem Atemzug nennt, hat den Punkt verstanden, auf den es ankommt.
