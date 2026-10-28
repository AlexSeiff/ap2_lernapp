# Musterlösungen Übungsklausur CRISP-DM & Machine Learning (Deep Dive 6)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** In diesem Themenblock liegen die Punkte überwiegend im **Begründen und Zuordnen**. Auswendiggelernte Definitionen ohne Bezug zum geschilderten Fall bekommen selten die volle Punktzahl. 92+ P = sehr gut.

---

## Block A – CRISP-DM und Datenaufbereitung (28 P)

**A1 (12 P):** *(je Phase 1 P Bezeichnung + 1 P Projektbezug)*

1. **Business Understanding:** Ziel festlegen – Reklamationsquote senken; Erfolgskriterium definieren (z. B. Reduktion um 20 % binnen eines Jahres) und klären, welche Entscheidung mit dem Ergebnis getroffen werden soll.
2. **Data Understanding:** Die 18.000 Auftragsdatensätze sichten, Data Profiling durchführen, Vollständigkeit und Plausibilität der Felder prüfen, Reklamationsanteil und erste Auffälligkeiten je Spediteur und Liefergebiet bestimmen.
3. **Data Preparation:** Daten bereinigen (fehlende Lieferdauern, Dubletten), Textmerkmale kodieren, Merkmale bilden (z. B. Lieferdauer aus Zeitstempeln), Trainings- und Testdaten trennen (CRISP-DM 1.0 ordnet das Festlegen dieser Aufteilung formal als „Testdesign" dem Modeling zu – beide Zuordnungen werden anerkannt).
4. **Modeling:** Ein Klassifikationsverfahren auswählen und trainieren, das anhand der Auftragsmerkmale das Reklamationsrisiko vorhersagt; Parameter einstellen.
5. **Evaluation:** Prüfen, ob das Modell das fachliche Ziel erfüllt – erkennt es genügend tatsächliche Reklamationsfälle, und ist das Ergebnis für den Fachbereich verwertbar?
6. **Deployment:** Ergebnis produktiv nutzen – z. B. Risikohinweis im Auftragssystem oder Bericht an die Logistik; Monitoring und Verantwortlichkeiten festlegen.

*Prüferkommentar: Reine Lehrbuchdefinitionen ohne Bezug zum Reklamationsfall geben nur die halbe Punktzahl (6 P). Die Aufgabe verlangte ausdrücklich den Projektbezug.*

**A2 (6 P):**
CRISP-DM ist iterativ, weil Erkenntnisse einer späteren Phase die Annahmen früherer Phasen verändern. Ein Datenanalyseprojekt lässt sich nicht vollständig vorausplanen, da die Datenlage erst im Verlauf bekannt wird. *(2 P)*

Zwei typische Rücksprünge *(je 2 P)*:
- **Data Preparation → Data Understanding:** Beim Aufbereiten fallen unerwartete Qualitätsprobleme auf (etwa systematisch fehlende Lieferdauern eines Spediteurs), die eine erneute Datensichtung erfordern.
- **Evaluation → Business Understanding:** Das Ergebnis erfüllt das fachliche Ziel nicht oder zeigt, dass die Fragestellung falsch gestellt war – etwa weil nicht das Reklamationsrisiko, sondern die Reklamationsursache benötigt wird.

*Ebenfalls anerkannt: Modeling → Data Preparation, wenn das gewählte Verfahren andere Merkmalsaufbereitung verlangt.*

**A3 (4 P):**
Die Verteilung ist **unrealistisch**. Erfahrungsgemäß entfallen 60–80 % des Aufwands auf Data Understanding und Data Preparation, nicht auf die Modellierung – die eigentliche Modellbildung ist mit heutigen Werkzeugen vergleichsweise schnell erledigt. *(2 P)*
Konsequenz: Der Plan unterschätzt den Aufwand für Datenbeschaffung, Bereinigung und Qualitätsprüfung erheblich und führt absehbar zu Terminverzug oder zu einem auf schlechter Datenbasis trainierten Modell. Realistischer wären etwa 10 % Zieldefinition, 60 % Datenverständnis und -aufbereitung, 15 % Modellierung, 15 % Auswertung und Übergabe. *(2 P)*

**A4 (6 P):**
Erforderlich ist die Umwandlung, weil Analyseverfahren mit **Zahlen** rechnen und Textwerte nicht verarbeiten können. Eine einfache Durchnummerierung (Nordtrans = 1, Rheinlogistik = 2, Eigenlieferung = 3) wäre falsch, da sie eine Rangfolge und Abstände suggeriert, die fachlich nicht bestehen – das Merkmal ist **nominal** skaliert. *(3 P)*

**One-Hot-Encoding:** Aus der einen Spalte „Spediteur" werden drei binäre Spalten:

| Spediteur | ist_Nordtrans | ist_Rheinlogistik | ist_Eigenlieferung |
|---|---|---|---|
| Nordtrans | 1 | 0 | 0 |
| Rheinlogistik | 0 | 1 | 0 |
| Eigenlieferung | 0 | 0 | 1 |

Je Datensatz steht genau eine Spalte auf 1, alle übrigen auf 0. *(3 P)*

---

## Block B – Verfahrenswahl, Bewertung und Einsatz (30 P)

**B1 (8 P):** *(je 2 P: 1 P Lernart, 1 P Verfahrenstyp)*

| Fragestellung | Lernart | Verfahrenstyp |
|---|---|---|
| (a) Wird dieser Auftrag reklamiert? | überwacht | **Klassifikation** (Zielvariable ja/nein) |
| (b) Welche Kundengruppen lassen sich in unseren Daten unterscheiden? | unüberwacht | **Clustering** (z. B. k-Means) |
| (c) Wie hoch wird der Umsatz im nächsten Quartal sein? | überwacht | **Regression** (stetige Zielgröße) |
| (d) Welche Produkte werden häufig gemeinsam gekauft? | unüberwacht | **Assoziationsanalyse** |

**B2 (6 P):**
Beide gehören zum überwachten Lernen; der Unterschied liegt im **Typ der Zielvariablen**: Die Klassifikation sagt eine **Kategorie** (diskret) vorher, die Regression einen **stetigen Zahlenwert**. *(3 P)*
Für die Reklamationsvorhersage ist die **Klassifikation** geeignet, da die Zielvariable „Reklamation: ja/nein" zwei Ausprägungen hat und keinen numerischen Wert darstellt. *(3 P)*

**B3 (6 P):** *(je 2 P für drei Kriterien mit Bezug)* Empfehlung: **Entscheidungsbaum**.
- **Erklärbarkeit:** Ein Entscheidungsbaum ist als Regelwerk lesbar; der Fachbereich kann nachvollziehen, welche Merkmale zum Risiko führen, und daraus Maßnahmen ableiten. Ein neuronales Netz bleibt eine Black Box.
- **Datenmenge:** 18.000 Datensätze mit wenigen Merkmalen sind für ein neuronales Netz eine eher kleine Basis; Entscheidungsbäume kommen mit dieser Größenordnung gut zurecht.
- **Aufwand und Wartbarkeit:** Der Baum ist schneller trainiert, benötigt weniger Parameteroptimierung und ist im Betrieb leichter zu pflegen und zu dokumentieren.

*Ebenfalls anerkannt: rechtliche Nachvollziehbarkeit bei automatisierten Entscheidungen; keine Skalierung der Merkmale erforderlich. Die Empfehlung „neuronales Netz" kann volle Punktzahl erhalten, wenn sie mit drei nachvollziehbaren Kriterien begründet wird – bewertet wird die Argumentation, nicht die Vorliebe.*

**B4 (5 P):**
Es liegt **Data Leakage** (Informationsdurchsickern) vor: Das Feld „Reklamationsdatum" ist nur dann gefüllt, wenn tatsächlich reklamiert wurde – es enthält damit die Antwort, die das Modell vorhersagen soll. *(3 P)*
Folge: Das Modell erreicht im Test nahezu perfekte Werte, hat aber nichts Verwertbares gelernt. Im Betrieb versagt es vollständig, weil das Reklamationsdatum zum Zeitpunkt der Vorhersage – bei Auftragseingang – naturgemäß noch nicht existiert. Prüfregel für jedes Merkmal: **War diese Information zum Entscheidungszeitpunkt bereits bekannt?** *(2 P)*

**B5 (5 P):** *(je Anforderung 1,5 P, je Maßnahme 1 P)*

| rechtliche Anforderung | Maßnahme zur Umsetzung |
|---|---|
| Art. 22 DSGVO: Verbot ausschließlich automatisierter Entscheidungen mit rechtlicher Wirkung oder erheblicher Beeinträchtigung – eine automatische Auftragsablehnung fällt darunter | menschliche Prüfinstanz vorschalten: das Modell gibt nur einen Risikohinweis, ein Mitarbeiter entscheidet; Widerspruchsmöglichkeit einräumen |
| Transparenz und Information: Betroffene sind über die automatisierte Verarbeitung und die involvierte Logik zu informieren (Art. 13 Abs. 2 Buchst. f, Art. 15 Abs. 1 Buchst. h DSGVO) | erklärbares Verfahren (Entscheidungsbaum) einsetzen, Entscheidungslogik und Merkmale dokumentieren |

*Ebenfalls anerkannt: Zweckbindung und Datenminimierung (nur fachlich erforderliche Merkmale verwenden); Prüfung auf Diskriminierung/Bias, etwa wenn das Liefergebiet als Stellvertretermerkmal für soziale Merkmale wirkt.*

---

## Block C – Clustering (22 P)

**C1 (4 P):** *(je 1 P)*
1. k festlegen und k Startzentren wählen.
2. Jeden Datenpunkt dem nächstgelegenen Zentrum zuordnen (euklidischer Abstand).
3. Für jedes Cluster den Mittelwert aller zugeordneten Punkte als neues Zentrum berechnen.
4. Schritte 2 und 3 wiederholen, bis sich die Zuordnung nicht mehr ändert.

**C2 (10 P):**
| Punkt | Abstand zu Z1(4\|4) | Abstand zu Z2(6\|6) | Cluster |
|---|---|---|---|
| P1(2\|2) | √((2−4)²+(2−4)²) = √8 = 2,83 | √32 = 5,66 | **Z1** |
| P2(3\|1) | √(1+9) = √10 = 3,16 | √(9+25) = √34 = 5,83 | **Z1** |
| P3(1\|3) | √(9+1) = √10 = 3,16 | √(25+9) = √34 = 5,83 | **Z1** |
| P4(7\|8) | √(9+16) = √25 = 5,00 | √(1+4) = √5 = 2,24 | **Z2** |
| P5(8\|7) | √(16+9) = √25 = 5,00 | √(4+1) = √5 = 2,24 | **Z2** |
| P6(9\|9) | √(25+25) = √50 = 7,07 | √(9+9) = √18 = 4,24 | **Z2** |

Neue Zentren:
- $Z_1 = \left(\frac{2+3+1}{3} \,\middle|\, \frac{2+1+3}{3}\right) = \left(\frac{6}{3} \,\middle|\, \frac{6}{3}\right)$ = **(2 | 2)**
- $Z_2 = \left(\frac{7+8+9}{3} \,\middle|\, \frac{8+7+9}{3}\right) = \left(\frac{24}{3} \,\middle|\, \frac{24}{3}\right)$ = **(8 | 8)**

*Prüferkommentar: 6 P für die Abstandsberechnungen (je Punkt 1 P), 2 P für die vollständige Zuordnung, 2 P für die beiden neuen Zentren. Wer mit quadrierten Abständen ohne Wurzel arbeitet, erhält volle Punktzahl, sofern die Vorgehensweise benannt wird – für den Vergleich ist die Wurzel nicht nötig. Häufigster Fehler: neue Zentren als Median statt als arithmetisches Mittel berechnet.*

**C3 (4 P):**
Die Zuordnung bleibt **unverändert**. P1, P2 und P3 liegen weiterhin deutlich näher an Z1(2|2) als an Z2(8|8) – etwa P2: Abstand 1,41 gegenüber 8,60 –, ebenso P4, P5 und P6 näher an Z2. Da sich die Zuordnung nicht ändert, bleiben auch die Zentren gleich: Der Algorithmus ist **konvergiert** und bricht ab. *(2 P Feststellung, 2 P Begründung mit Beispielrechnung)*

**C4 (4 P):**
Problem: Die beiden Merkmale hätten völlig unterschiedliche Wertebereiche (Bestellungen 1–9, Umsatz 200–45.000). Im euklidischen Abstand dominiert die Größe mit der weiteren Spanne, sodass die Bestellanzahl praktisch keinen Einfluss mehr hätte – geclustert würde faktisch nur nach Umsatz. *(2 P)*
Lösung: **Skalierung** beider Merkmale vor der Analyse – Normalisierung auf den Bereich 0 bis 1 oder Standardisierung auf Mittelwert 0 und Standardabweichung 1. Dadurch gehen beide Merkmale gleichgewichtig in den Abstand ein. *(2 P)*

---

## Block D – Assoziationsanalyse (20 P)

**D1 (4 P):** *(je 1 P)*
- $\text{Support}(S) = \frac{5}{10}$ = **50 %** (T1, T2, T3, T4, T5)
- $\text{Support}(B) = \frac{6}{10}$ = **60 %** (T1, T2, T3, T4, T6, T8)
- $\text{Support}(M) = \frac{5}{10}$ = **50 %** (T1, T5, T6, T7, T8)
- $\text{Support}(L) = \frac{4}{10}$ = **40 %** (T4, T7, T9, T10)

**D2 (8 P):**
Gemeinsames Vorkommen von S und B: T1, T2, T3, T4 = 4 Transaktionen

- **Support(S → B):** $\frac{\text{Anzahl}(S \text{ und } B)}{\text{Gesamtzahl}} = \frac{4}{10}$ = **40,00 %** *(3 P)*
- **Konfidenz(S → B):** $\frac{\text{Support}(S \text{ und } B)}{\text{Support}(S)} = \frac{0{,}40}{0{,}50}$ = **80,00 %** *(3 P)*
- **Lift(S → B):** $\frac{\text{Konfidenz}}{\text{Support}(B)} = \frac{0{,}80}{0{,}60}$ = **1,33** *(2 P)*

*Prüferkommentar: Je 1 P der Teilpunkte entfällt auf den Ansatz (richtige Werte in die Formel eingesetzt). Häufigster Fehler: Die Konfidenz wird durch die Gesamtzahl statt durch den Support des Bedingungsteils geteilt.*

**D3 (4 P):**
Ein Lift von 1,33 liegt über 1: Schreibtisch und Bürostuhl werden **33 % häufiger gemeinsam gekauft, als bei statistischer Unabhängigkeit zu erwarten wäre**. Es besteht also ein echter positiver Zusammenhang und nicht nur eine hohe Konfidenz, die aus der allgemeinen Beliebtheit des Bürostuhls resultiert. *(2 P)*
Handlungsempfehlung: Beide Artikel als Set bzw. Bundle anbieten, im Onlineshop als Zubehör beim Schreibtisch einblenden und im Ladengeschäft räumlich nebeneinander platzieren. *(2 P)*

**D4 (4 P):**
Ein Lift unter 1 bedeutet einen **negativen Zusammenhang**: Lampe und Monitor werden **seltener** zusammen gekauft, als bei Unabhängigkeit zu erwarten wäre. Der Kauf des einen Artikels macht den Kauf des anderen also unwahrscheinlicher – ein Hinweis auf unterschiedliche Kaufanlässe oder Kundengruppen. *(2 P)*
Konsequenz: Eine gemeinsame Platzierung oder ein Bundle-Angebot dieser beiden Artikel ist **nicht zu empfehlen**; die Werbefläche sollte für Kombinationen mit einem Lift über 1 genutzt werden. Zusätzlich ist der niedrige Support von 10 % zu beachten – die Regel beruht nur auf einer einzigen Transaktion und ist damit statistisch wenig belastbar. *(2 P)*

*Prüferkommentar: Der Hinweis auf den geringen Support ist der Zusatzgedanke, der die volle Punktzahl sichert. Regeln mit sehr niedrigem Support sind unabhängig vom Lift mit Vorsicht zu behandeln.*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | CRISP-DM als Gliederung für die Projektdoku übernehmen |
| 81–91 | gut | Prüfe, ob die Punkte im Rechen- oder im Begründungsteil fehlten |
| < 81 | | Teil 1–4 wiederholen, Klausur nach einer Woche neu schreiben |

**Ein Hinweis zum Weiterarbeiten:** Die Blöcke A und B sind zugleich eine Generalprobe für dein **Fachgespräch**. Formuliere die Antworten aus A1 einmal so, als würdest du dem Prüfungsausschuss dein eigenes Projekt erklären – wenn das flüssig gelingt, hast du die wichtigste Vorbereitung für den mündlichen Teil bereits geleistet.

In **Deep Dive 7** folgt der zweite Teil: Modellgüte mit Train/Test-Split, Kreuzvalidierung, Overfitting sowie Konfusionsmatrix mit Accuracy, Precision, Recall und F1 – dort wird gerechnet.
