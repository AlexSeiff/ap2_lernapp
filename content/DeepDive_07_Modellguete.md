# Deep Dive 7: Modellgüte & Modellbewertung
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Dies ist der **rechenintensivste Teil** des Prüfungsbereichs „Sicherstellen der Datenqualität" – und zugleich der berechenbarste: Eine Konfusionsmatrix mit Accuracy, Precision, Recall und F1 gehört zu den am häufigsten gestellten Aufgabentypen überhaupt. Die Formeln sind kurz, die Rechnung ist mechanisch, die Punkte sind sicher.

Der Unterschied zwischen 85 und 95 Punkten liegt auch hier in der **Interpretation**: Welche Kennzahl ist im geschilderten Fall die richtige – und warum ist Accuracy fast nie die Antwort?

Szenario: **Möbelhaus Nordholz GmbH**, Reklamationsvorhersage aus Deep Dive 6.

---

# Teil 1 – Warum Modelle geprüft werden müssen

## 1.1 Der Grundgedanke

Ein Modell, das nur an den Daten gemessen wird, aus denen es gelernt hat, misst sich an seiner eigenen Hausaufgabe. Deshalb werden die Daten **vor** dem Training aufgeteilt:

| Datensatz | Anteil (typisch) | Zweck |
|---|---|---|
| **Trainingsdaten** | 70–80 % | Das Modell lernt daraus |
| **Testdaten** | 20–30 % | Unabhängige Prüfung – wird **erst am Ende** verwendet |
| *(Validierungsdaten)* | optional | Parameterwahl während der Entwicklung |

**Die eiserne Regel:** Die Testdaten dürfen zu keinem Zeitpunkt in das Training einfließen – auch nicht indirekt über Skalierungswerte oder Merkmalsauswahl. Wer sein Modell wiederholt am Testergebnis nachjustiert, verbraucht die Unabhängigkeit des Tests.

Wichtig ist außerdem eine **zufällige** Aufteilung. Wird stattdessen einfach der erste Teil der Datei genommen, sind die Daten oft nach Datum oder Region sortiert – das Modell lernt dann nur einen Ausschnitt der Wirklichkeit. Bei Zeitreihen gilt jedoch das Gegenteil: Dort wird **chronologisch** getrennt (Vergangenheit trainieren, Zukunft testen), weil ein zufälliger Split Informationen aus der Zukunft ins Training holen würde.

## 1.2 Overfitting und Underfitting

| | Overfitting (Überanpassung) | Underfitting (Unteranpassung) |
|---|---|---|
| Symptom | Training sehr gut, Test deutlich schlechter | Training **und** Test schlecht |
| Ursache | Modell zu komplex, zu wenige Daten, zu lange trainiert | Modell zu einfach, wichtige Merkmale fehlen |
| Bild | Das Modell lernt die Trainingsdaten samt Rauschen auswendig | Das Modell erfasst nicht einmal das Grundmuster |
| Gegenmaßnahmen | mehr Daten, einfacheres Modell, Regularisierung, Baum beschneiden (Pruning), Kreuzvalidierung, frühzeitiger Abbruch | komplexeres Modell, bessere Merkmale bilden, länger trainieren |

**Erkennungsregel für die Klausur:** Große Lücke zwischen Trainings- und Testgüte → Overfitting. Beide Werte niedrig → Underfitting.

## 1.3 Kreuzvalidierung (k-fold Cross Validation)

Die Daten werden in k gleich große Teile zerlegt. In k Durchläufen dient jeweils ein Teil als Testmenge, die übrigen k−1 als Trainingsmenge. Die k Ergebnisse werden gemittelt. Üblich ist k = 5 oder k = 10.

**Vorteile:** Jeder Datensatz wird einmal getestet; das Ergebnis hängt nicht von einer zufällig günstigen oder ungünstigen Aufteilung ab; besonders wertvoll bei kleinen Datenmengen.
**Nachteil:** k-facher Rechenaufwand.

> ❓ **Prüferfrage:** Ihr Modell erreicht 99 % auf den Trainingsdaten und 71 % auf den Testdaten. Was liegt vor und was tun Sie?
> *Klassisches Overfitting – das Modell hat die Trainingsdaten auswendig gelernt statt verallgemeinerbare Muster. Maßnahmen: Modellkomplexität reduzieren (z. B. Baumtiefe begrenzen), mehr Trainingsdaten beschaffen, Regularisierung einsetzen und die Güte per Kreuzvalidierung stabiler schätzen.*

---

# Teil 2 – Die Konfusionsmatrix

## 2.1 Aufbau

Zunächst festlegen, was die **positive Klasse** ist – üblicherweise das seltene, interessierende Ereignis (hier: „Reklamation"). Alle Kennzahlen beziehen sich darauf.

| | **Vorhersage: positiv** | **Vorhersage: negativ** |
|---|---|---|
| **Tatsächlich positiv** | **TP** (richtig positiv) | **FN** (falsch negativ) – *Fehler 2. Art* |
| **Tatsächlich negativ** | **FP** (falsch positiv) – *Fehler 1. Art* | **TN** (richtig negativ) |

**Merkhilfe:** Der erste Buchstabe sagt, ob die Vorhersage **richtig** war (T/F), der zweite, **was vorhergesagt** wurde (P/N). „FN" heißt also: fälschlich als negativ eingestuft – der Fall war in Wahrheit positiv.

## 2.2 Die fünf Kennzahlen

| Kennzahl | Formel | Frage, die sie beantwortet |
|---|---|---|
| **Accuracy** (Korrektklassifikationsrate) | (TP + TN) / Gesamt | Wie viele Fälle insgesamt wurden richtig eingeordnet? |
| **Precision** (Genauigkeit, positiver Vorhersagewert) | TP / (TP + FP) | Wie viele der als positiv **vorhergesagten** Fälle sind wirklich positiv? |
| **Recall** (Trefferquote, Sensitivität) | TP / (TP + FN) | Wie viele der **tatsächlich** positiven Fälle wurden gefunden? |
| **F1-Maß** | 2 · (Precision · Recall) / (Precision + Recall) | Ausgewogenes Gesamtmaß (harmonisches Mittel) |
| **Spezifität** | TN / (TN + FP) | Wie viele der tatsächlich negativen Fälle wurden richtig erkannt? |

**Nenner-Merkhilfe:** Precision teilt durch die **Spalte** der positiven Vorhersagen, Recall durch die **Zeile** der tatsächlich positiven Fälle.

Dazu gehört eine sechste Kennzahl, die du für die ROC-Kurve (→ 4.4) brauchst: die **Falsch-Positiv-Rate** (FPR) = FP / (FP + TN) = 1 − Spezifität – der Anteil der tatsächlich negativen Fälle, die fälschlich Alarm auslösen. Der Recall heißt in diesem Zusammenhang auch Richtig-Positiv-Rate (TPR).

Achtung, Begriffsfalle: Im Deutschen wird „Genauigkeit" teils für Precision, teils für Accuracy verwendet. Nenne in der Prüfung deshalb immer den englischen Fachbegriff und zusätzlich die Formel.

## 2.3 Durchgerechnetes Beispiel – und die wichtigste Lehre

1.000 Aufträge, davon 100 tatsächlich reklamiert. Das Modell sagt 150 Reklamationen voraus und liegt bei 60 davon richtig.

| | Vorhersage: Reklamation | Vorhersage: keine |
|---|---|---|
| **Tatsächlich Reklamation** | TP = 60 | FN = 40 |
| **Tatsächlich keine** | FP = 90 | TN = 810 |

- Accuracy: $\frac{60 + 810}{1000}$ = **87,00 %**
- Precision: $\frac{60}{60 + 90} = \frac{60}{150}$ = **40,00 %**
- Recall: $\frac{60}{60 + 40} = \frac{60}{100}$ = **60,00 %**
- F1: $2 \cdot \frac{0{,}40 \cdot 0{,}60}{0{,}40 + 0{,}60} = \frac{0{,}48}{1{,}00}$ = **48,00 %**
- Spezifität: $\frac{810}{900}$ = **90,00 %**
- Falsch-Positiv-Rate: $\frac{90}{90 + 810} = 1 - 0{,}90$ = **10,00 %**

**Das Accuracy-Paradox:** Ein triviales Modell, das **immer „keine Reklamation"** sagt, erreicht $\frac{900}{1000}$ = **90 % Accuracy** – und ist damit scheinbar besser als unser Modell mit 87 %. Es findet allerdings **keinen einzigen** Reklamationsfall (Recall = 0 %), ist also fachlich völlig wertlos.

Daraus folgt die zentrale Aussage: **Bei unausgeglichenen Klassen ist Accuracy irreführend.** Aussagekräftig sind Precision, Recall und F1 – und der Vergleich mit einer **trivialen Baseline** gehört in jede Modellbewertung.

## 2.4 Precision oder Recall? Die Abwägung

Beide Kennzahlen lassen sich meist nur gegeneinander verbessern: Senkt man die Entscheidungsschwelle, findet das Modell mehr echte Fälle (Recall steigt oder bleibt gleich), erzeugt aber mehr Fehlalarme (Precision sinkt in der Regel) – und umgekehrt.

**Welche Kennzahl zählt, entscheidet der fachliche Schaden:**

| Situation | Teurer Fehler | Wichtige Kennzahl |
|---|---|---|
| Reklamationsrisiko erkennen, um vorab zu prüfen | Übersehener Problemfall (FN) | **Recall** |
| Automatischer Rabatt bei erkannter Unzufriedenheit | Zu Unrecht gewährter Rabatt (FP) | **Precision** |
| Medizinisches Screening | Übersehene Erkrankung (FN) | **Recall** |
| Spam-Filter | Echte Mail im Spam (FP) | **Precision** |

**Formulierung, die Punkte bringt:** „Da ein übersehener Fall (FN) hier den größeren Schaden verursacht als ein Fehlalarm (FP), ist der Recall die entscheidende Kennzahl; eine niedrigere Precision wird bewusst in Kauf genommen."

---

# Teil 3 – Gütemaße bei Regression

Bei stetiger Zielgröße (→ Deep Dive 4) gelten andere Maße:

| Maß | Formel | Eigenschaft |
|---|---|---|
| **MAE** (mittlerer absoluter Fehler) | Σ\|y − ŷ\| / n | leicht interpretierbar, in der Einheit der Zielgröße, robuster gegen Ausreißer als MSE/RMSE |
| **MSE** (mittlerer quadratischer Fehler) | Σ(y − ŷ)² / n | gewichtet große Fehler stärker, Einheit quadriert |
| **RMSE** | √MSE | wie MSE, aber in der Einheit der Zielgröße; stets ≥ MAE |
| **R²** | 1 − Σ(y − ŷ)² / Σ(y − ȳ)² (erklärter Streuungsanteil) | Vergleich zum Mittelwertmodell, einheitenlos; 1 = perfekt, 0 = nicht besser als der Mittelwert, auf Testdaten auch negativ möglich |
| **MAPE** (mittlerer absoluter prozentualer Fehler) | Σ(\|y − ŷ\| / \|y\|) / n · 100 % | in Prozent, gut vergleichbar über Größenordnungen; unbrauchbar, wenn y nahe 0 liegt |

**Beispiel:** Prognostizierte und tatsächliche Monatsumsätze (T€)

| y | ŷ | e = y − ŷ | \|e\| | e² |
|---|---|---|---|---|
| 100 | 90 | +10 | 10 | 100 |
| 120 | 126 | −6 | 6 | 36 |
| 90 | 84 | +6 | 6 | 36 |
| 130 | 132 | −2 | 2 | 4 |
| 110 | 108 | +2 | 2 | 4 |
| | | | **Σ 26** | **Σ 180** |

$\text{MAE} = \frac{26}{5}$ = **5,20 T€** · $\text{MSE} = \frac{180}{5}$ = **36,00** · $\text{RMSE} = \sqrt{36}$ = **6,00 T€**

**Interpretation:** Der RMSE (6,00) liegt über dem MAE (5,20) – ein Hinweis darauf, dass einzelne größere Abweichungen (hier +10) vorliegen. Je weiter RMSE und MAE auseinanderliegen, desto ungleichmäßiger sind die Fehler verteilt. Gleich groß sind beide nur, wenn alle Fehlerbeträge identisch sind – kleiner als der MAE kann der RMSE nie werden.

Ergänzend R² und MAPE für dasselbe Beispiel (Mittelwert $\bar{y} = \frac{550}{5} = 110$, Abweichungsquadrate 100 + 100 + 400 + 400 + 0 = 1.000):

$R^2 = 1 - \frac{\sum (y - \hat{y})^2}{\sum (y - \bar{y})^2} = 1 - \frac{180}{1000}$ = **0,82** – das Modell erklärt 82 % der Streuung der Umsätze; ein Modell, das immer den Mittelwert 110 prognostiziert, hätte R² = 0.

$\text{MAPE} = \frac{1}{5} \cdot \left(\frac{10}{100} + \frac{6}{120} + \frac{6}{90} + \frac{2}{130} + \frac{2}{110}\right) \approx \frac{0{,}2502}{5}$ = **5,00 %** – die Prognose liegt im Mittel um 5 % neben dem tatsächlichen Wert.

---

# Teil 4 – Vom Messwert zur Entscheidung

## 4.1 Was in eine Modellbewertung gehört

1. **Baseline zum Vergleich:** Wie gut wäre ein trivialer Ansatz (immer die häufigste Klasse, immer der Mittelwert, die bisherige Regel des Fachbereichs)? Ohne diesen Vergleich ist keine Kennzahl einzuordnen.
2. **Die richtige Kennzahl**, begründet aus dem fachlichen Schaden.
3. **Testdatengüte**, nicht Trainingsgüte.
4. **Wirtschaftliche Bewertung:** Was kostet ein FN, was kostet ein FP? Erst daraus ergibt sich der Nutzen.
5. **Grenzen:** Datenzeitraum, Repräsentativität, bekannte Verzerrungen.

## 4.2 Kosten statt Prozente

Prüfer schätzen es, wenn Kennzahlen in Geld übersetzt werden. Beispiel: Ein übersehener Reklamationsfall kostet durchschnittlich 120 € (Nacharbeit, Kulanz), eine unnötige Vorabprüfung 15 €.

- Modell: 40 FN · 120 € + 90 FP · 15 € = 4.800 € + 1.350 € = **6.150 €**
- Triviales Modell (immer „keine Reklamation"): 100 FN · 120 € = **12.000 €**

Trotz der niedrigeren Accuracy ist das Modell wirtschaftlich klar überlegen. **Diese Rechnung ist das stärkste Argument, das du im Fachgespräch führen kannst.**

Allgemein gilt: Fehlerkosten = FN · Kosten je FN + FP · Kosten je FP. Daraus folgt auch die **kostenoptimale Schwelle**: Die übliche Schwelle von 50 % passt nur, wenn beide Fehler gleich teuer sind. Hat ein Auftrag die Reklamationswahrscheinlichkeit p, lohnt die Prüfung, sobald die erwarteten Kosten des Nicht-Prüfens (p · 120 €) die eines womöglich unnötigen Prüfens ((1 − p) · 15 €) übersteigen – unter der Annahme dieses Beispiels, dass nur FN und FP Kosten verursachen:

$p > \frac{K_{FP}}{K_{FP} + K_{FN}} = \frac{15}{15 + 120}$ = **11,11 %**

Schon ab rund 11 % Risiko sollte also geprüft werden – je teurer der übersehene Fall, desto niedriger die Schwelle.

## 4.3 Betrieb und Nachhaltigkeit

Die Modellgüte ist kein einmaliger Abnahmewert. Durch **Model Drift** (→ Deep Dive 6) verschlechtert sie sich schleichend. Notwendig sind daher: laufendes Monitoring der Kennzahlen, definierte Schwellenwerte für ein Retraining und eine benannte Verantwortlichkeit.

## 4.4 ROC-Kurve und AUC

Die meisten Klassifikationsmodelle liefern zunächst einen Score bzw. eine Wahrscheinlichkeit; erst die Entscheidungsschwelle macht daraus „positiv" oder „negativ". Jede Schwelle ergibt eine eigene Konfusionsmatrix.

Die **ROC-Kurve** (Receiver Operating Characteristic) zeigt alle Schwellen auf einmal: Für jede Schwelle wird die Richtig-Positiv-Rate (= Recall) auf der y-Achse gegen die Falsch-Positiv-Rate (= 1 − Spezifität) auf der x-Achse eingetragen.

| Punkt / Verlauf | Bedeutung |
|---|---|
| (0 \| 0) | Schwelle so hoch, dass nie ein Alarm ausgelöst wird (triviales Modell) |
| (1 \| 1) | Schwelle so niedrig, dass jeder Fall als positiv gilt |
| (0 \| 1), oben links | perfektes Modell: alle Positiven gefunden, kein Fehlalarm |
| Diagonale | Zufallsraten – das Modell trennt die Klassen nicht |

Das Modell aus 2.3 liegt mit FPR = 10 % und Recall = 60 % beim Punkt (0,10 | 0,60) – deutlich oberhalb der Diagonale.

Die **AUC** (Area Under the Curve) ist die Fläche unter der ROC-Kurve und fasst die Trennschärfe in einer Zahl zusammen:

- AUC = 1,0: perfekte Trennung; AUC = 0,5: nicht besser als Zufall; AUC < 0,5: schlechter als Zufall (Vorhersagen systematisch vertauscht).
- Anschaulich: die Wahrscheinlichkeit, dass ein zufällig gewählter positiver Fall einen höheren Score erhält als ein zufällig gewählter negativer.
- Vorteil: unabhängig von der gewählten Schwelle – gut zum Vergleich mehrerer Modelle.
- Grenzen: Die AUC sagt nicht, welche Schwelle im Betrieb gilt, und kennt keine Fehlerkosten. Bei stark unausgeglichenen Klassen wirkt sie oft zu optimistisch; dann ist die Precision-Recall-Kurve aussagekräftiger.

> ❓ **Prüferfrage:** Ihr Modell erreicht auf den Testdaten eine AUC von 0,5. Was bedeutet das?
> *Das Modell trennt Reklamationen und Nicht-Reklamationen nicht besser als der Zufall – seine ROC-Kurve verläuft auf der Diagonale. Es ist in dieser Form wertlos, egal welche Schwelle gewählt wird. Ursachen prüfen: ungeeignete Merkmale, Fehler in der Datenaufbereitung oder ein vertauschtes Label. Erst ab deutlich über 0,5 lohnt die Schwellenwahl nach Kosten.*

## 4.5 Unausgeglichene Klassen und Baselines

Von **unausgeglichenen Klassen** (Class Imbalance) spricht man, wenn die interessierende Klasse selten ist – 10 % Reklamationen, unter 1 % Betrugsfälle. Dann gilt:

- Bewerten: Accuracy meiden; Precision, Recall, F1 und die **Balanced Accuracy** = (Recall + Spezifität) / 2 verwenden. Im Beispiel aus 2.3: (60 % + 90 %) / 2 = 75 %, das triviale Modell erreicht nur (0 % + 100 %) / 2 = 50 %.
- Aufteilen: **stratifiziert** – Trainings- und Testmenge (bzw. jeder Fold der Kreuzvalidierung) erhalten denselben Klassenanteil wie der Gesamtbestand.
- Trainieren: **Oversampling** (Fälle der Minderheitsklasse vervielfältigen oder synthetisch erzeugen, z. B. mit **SMOTE**), **Undersampling** (Fälle der Mehrheitsklasse weglassen – kostet Information), Klassengewichte im Verfahren oder eine angepasste Entscheidungsschwelle (→ 4.2).
- Falle: Resampling nur auf die Trainingsdaten anwenden, und zwar **nach** dem Split. Die Testdaten behalten die reale Verteilung – sonst landen Kopien desselben Falls in beiden Mengen und die Güte wird geschönt.

Typische **Baseline-Modelle**:

| Aufgabe | Baseline | Erreicht |
|---|---|---|
| Klassifikation | immer die Mehrheitsklasse | Accuracy = Anteil der Mehrheitsklasse, Recall = 0 % |
| Klassifikation | Zufall nach Klassenanteil | AUC ≈ 0,5 |
| Regression | immer der Mittelwert | R² = 0 (auf den Daten, aus denen der Mittelwert stammt) |
| Zeitreihe | naive Prognose: letzter Wert bzw. Vorjahresmonat | Maßstab, den jedes Prognosemodell schlagen muss |
| alle | bisherige Regel des Fachbereichs | zeigt den tatsächlichen Mehrwert im Betrieb |

> ❓ **Prüferfrage:** Ein Kollege verdoppelt die Reklamationsfälle per Oversampling und teilt die Daten erst danach in Training und Test. Was ist das Problem?
> *Kopien desselben Auftrags landen sowohl in den Trainings- als auch in den Testdaten – der Test misst dann teilweise nur das Wiedererkennen bekannter Fälle, die Güte ist geschönt. Außerdem entspricht die Klassenverteilung im Test nicht mehr der Realität. Richtig: zuerst (stratifiziert) aufteilen, dann nur die Trainingsdaten resamplen.*

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Accuracy als alleinige Kennzahl bei unausgeglichenen Klassen verwendet.
2. Precision und Recall verwechselt (falscher Nenner).
3. FP und FN vertauscht – Positivklasse nicht vorher definiert.
4. F1 als arithmetisches statt als harmonisches Mittel berechnet.
5. Trainingsgüte statt Testgüte berichtet.
6. Overfitting und Underfitting verwechselt.
7. Kein Vergleich mit einer trivialen Baseline.
8. Keine Begründung, warum die gewählte Kennzahl die fachlich richtige ist.

---

# Übungsklausur Modellgüte (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Bearbeite die Klausur **am Ende des Themas** am Stück, handschriftlich, mit Taschenrechner. Runde auf zwei Nachkommastellen. Halte dich an die geforderte Anzahl der Nennungen.

## Ausgangssituation

Die **Möbelhaus Nordholz GmbH** hat ein Modell trainiert, das vor der Auslieferung vorhersagt, ob ein Auftrag reklamiert wird. Riskante Aufträge sollen vor dem Versand zusätzlich geprüft werden. Bevor das Modell eingesetzt wird, sollen Sie als Mitarbeiter der IT-Abteilung seine Güte bewerten und der Geschäftsleitung eine Empfehlung geben.

## Anlage – Testergebnis des Reklamationsmodells

Getestet wurden 1.000 Aufträge, davon 100 tatsächlich reklamiert.

| | Vorhersage: Reklamation | Vorhersage: keine Reklamation |
|---|---|---|
| **Tatsächlich Reklamation** | 90 | 10 |
| **Tatsächlich keine Reklamation** | 60 | 840 |

## Block A – Aufteilung und Anpassung (24 P)

Die Entwickler zeigen sehr gute Trainingsergebnisse. Die Geschäftsleitung fragt, ob man diesen Werten trauen kann.

**A1 (6 P):** *Erläutern* Sie, warum Daten vor dem Training in Trainings- und Testdaten aufgeteilt werden, und *nennen* Sie eine typische Aufteilung.

**A2 (8 P):** *Erklären* Sie Overfitting und Underfitting. *Geben* Sie für jeden Fall *an*, woran Sie ihn an den Gütewerten erkennen, und *nennen* Sie je **zwei** Gegenmaßnahmen. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| | Overfitting | Underfitting |
|---|---|---|
| Erklärung | | |
| erkennbar an den Gütewerten | | |
| zwei Gegenmaßnahmen | | |

**A3 (6 P):** *Beschreiben* Sie die 5-fache Kreuzvalidierung und *nennen* Sie **zwei** Vorteile gegenüber einem einfachen Split.

**A4 (4 P):** Ein Kollege sortiert die Daten nach Auftragsdatum und nimmt die ersten 80 % als Trainingsdaten. *Beurteilen* Sie das Vorgehen für zwei Fälle: (a) Vorhersage des Reklamationsrisikos je Auftrag, (b) Prognose des Monatsumsatzes.

## Block B – Konfusionsmatrix berechnen (30 P)

Grundlage ist das Testergebnis aus der **Anlage**.

**B1 (4 P):** *Benennen* Sie die vier Felder der Anlage mit den Fachbegriffen TP, FP, FN und TN. *Geben* Sie an, welche Klasse als positiv gilt.

**B2 (20 P):** *Berechnen* Sie Accuracy, Precision, Recall, F1-Maß und Spezifität.

> **Formeln:**
> - Accuracy = (TP + TN) / n
> - Precision = TP / (TP + FP)
> - Recall = TP / (TP + FN)
> - F1 = 2 · Precision · Recall / (Precision + Recall)
> - Spezifität = TN / (TN + FP)

**B3 (6 P):** Ein triviales Modell sagt für **jeden** Auftrag „keine Reklamation" voraus. *Berechnen* Sie dessen Accuracy und Recall und *vergleichen* Sie mit dem Modell aus der Anlage.

> **Formeln:**
> - Accuracy = (TP + TN) / n
> - Recall = TP / (TP + FN)

## Block C – Interpretation und Auswahl (22 P)

Die Geschäftsleitung versteht die Kennzahlen nicht und fragt, welche Zahl für ihren Zweck – die Vorabprüfung riskanter Aufträge – wirklich zählt.

**C1 (8 P):** *Erläutern* Sie den Unterschied zwischen Precision und Recall in eigenen Worten und *geben* Sie für die Anlage an, welche der beiden Kennzahlen hier höher ist und warum.

**C2 (8 P):** Das Modell soll steuern, welche Aufträge vor der Auslieferung zusätzlich geprüft werden. *Begründen* Sie, welche Kennzahl in diesem Anwendungsfall die wichtigste ist. *Erläutern* Sie die Folgen eines FN und eines FP jeweils konkret.

**C3 (6 P):** Die Entscheidungsschwelle wird gesenkt, sodass das Modell mehr Aufträge als riskant einstuft. *Erläutern* Sie, wie sich Precision und Recall dadurch verändern und warum.

## Block D – Wirtschaftliche Bewertung und Regressionsgüte (24 P)

Ein übersehener Reklamationsfall kostet durchschnittlich 120 €, eine unnötige Vorabprüfung 15 €.

| y (tatsächlich) | 100 | 120 | 90 | 130 | 110 |
|---|---|---|---|---|---|
| ŷ (prognostiziert) | 90 | 126 | 84 | 132 | 108 |

**D1 (6 P):** *Berechnen* Sie die Fehlerkosten des Modells aus der Anlage sowie die des trivialen Modells aus B3.

> **Formel:** Fehlerkosten = FN · Kosten je FN + FP · Kosten je FP

**D2 (6 P):** *Beurteilen* Sie auf dieser Grundlage, ob der Einsatz des Modells zu empfehlen ist, und *nennen* Sie **zwei** Faktoren, die in dieser Rechnung nicht enthalten sind.

> **Formel:** Fehlerkosten = FN · Kosten je FN + FP · Kosten je FP

**D3 (8 P):** *Berechnen* Sie MAE und RMSE. *Stellen* Sie den Rechenweg tabellarisch dar.

> **Formeln:**
> - MAE = Σ |y_i − ŷ_i| / n
> - RMSE = √(Σ (y_i − ŷ_i)² / n)

**D4 (4 P):** *Erläutern* Sie, warum der RMSE hier größer ist als der MAE und in welcher Situation Sie welches Maß bevorzugen.

> **Formeln:**
> - MAE = Σ |y_i − ŷ_i| / n
> - RMSE = √(Σ (y_i − ŷ_i)² / n)

---

## Fachgespräch: typische Fragen des Ausschusses

1. „Welche Gütekennzahl haben Sie für Ihr Modell berichtet – und warum genau diese?"
2. „Womit haben Sie Ihr Ergebnis verglichen? Wie gut wäre der Fachbereich ohne Ihr Modell gewesen?"
3. „Was kostet ein Fehler Ihres Modells – und welche Fehlerart ist teurer?"
4. „Wie haben Sie ausgeschlossen, dass Ihr Modell die Trainingsdaten nur auswendig gelernt hat?"
5. „Ab welchem Wert würden Sie sagen: Das Modell muss neu trainiert werden?"
6. „Ihre positive Klasse ist selten – wie sind Sie bei Aufteilung, Training und Bewertung damit umgegangen?"

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich erkläre Train/Test-Split, Kreuzvalidierung und die Regel der Testdatenunabhängigkeit.
- [ ] Ich unterscheide Overfitting und Underfitting anhand der Gütewerte und nenne Gegenmaßnahmen.
- [ ] Ich ordne TP, FP, FN und TN sicher zu, nachdem ich die positive Klasse definiert habe.
- [ ] Ich berechne Accuracy, Precision, Recall, F1 und Spezifität ohne Formelsammlung.
- [ ] Ich kann das Accuracy-Paradox an einem Zahlenbeispiel erläutern.
- [ ] Ich begründe die Wahl zwischen Precision und Recall aus dem fachlichen Schaden.
- [ ] Ich vergleiche jedes Modell mit einer trivialen Baseline und rechne Fehler in Kosten um.
- [ ] Ich berechne MAE und RMSE und erkläre deren unterschiedliches Verhalten bei Ausreißern.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
- [ ] Ich erkläre Falsch-Positiv-Rate, ROC-Kurve und AUC und leite eine kostenoptimale Schwelle aus FN- und FP-Kosten ab.
- [ ] Ich berechne R² und MAPE und nenne Maßnahmen und Fallen bei unausgeglichenen Klassen (Stratifizierung, Resampling nur auf Trainingsdaten).
