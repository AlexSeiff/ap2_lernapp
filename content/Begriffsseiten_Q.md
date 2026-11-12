<!-- Begriffsseiten Q · Stand 2026-10 -->
## Qualitätsgrad
<!-- id: qualitatsgrad · quellen: Karte DD9, DD9 Teil 3 · stand: 2026-10 -->

Grundform jeder Datenqualitätskennzahl: korrekte Datensätze geteilt durch geprüfte Datensätze, mal 100.

### Erklärung
$\text{Qualitätsgrad} = \frac{\text{korrekte Datensätze}}{\text{geprüfte Datensätze}} \cdot 100$. Je nach Prüfregel entstehen daraus Vollständigkeitsgrad, Eindeutigkeitsgrad oder Gültigkeitsgrad. Eine Kennzahl wirkt erst mit Zielwert, Verantwortlichem und regelmäßiger Messung, z. B. „Gültigkeit E-Mail ≥ 95 %, Verantwortung Vertriebsleitung, monatlich“.

### Beispiel
Von 480 geprüften Kundendatensätzen haben 456 eine formal gültige E-Mail-Adresse:
$\frac{456}{480} \cdot 100 = 95\ \%$. Die Fehlerquote beträgt entsprechend 5 %.

### Abgrenzung
| Kennzahl | Zähler / Nenner |
|---|---|
| Vollständigkeitsgrad (Feld) | gefüllte Werte / alle Datensätze |
| Eindeutigkeitsgrad | eindeutige Entitäten / Datensätze |
| Gültigkeitsgrad | formatkonforme Werte / geprüfte Werte |
| Fehlerquote | fehlerhafte Sätze / geprüfte Sätze |

### Prüfungsfalle
Die Bezugsgröße weglassen: 95 % über alle Zellen können eine Lücke von 30 % in einem einzelnen Feld verdecken.

### Merksatz
Qualitätsgrad = gut durch geprüft – und immer sagen, was geprüft wurde.

Siehe auch: Vollständigkeit · Eindeutigkeit · Gültigkeit · Fehlerquote · Datenqualität
Mehr: Deep Dive 9, Teil 3

## Qualitätskontrolle
<!-- id: qualitatskontrolle · quellen: Karte DD16, DD16 1.1 · stand: 2026-10 -->

Prüfender Teil der Qualitätssicherung: Ein Ergebnis wird gegen die festgelegten Anforderungen gemessen.

### Erklärung
Die Qualitätskontrolle findet nach Fertigstellung eines (Teil-)Ergebnisses statt und gehört damit zur **analytischen** Qualitätssicherung. Im Projekt geschieht sie meist als Soll-Ist-Vergleich gegen das Pflichtenheft, mit Tests, Reviews, statischer Codeanalyse oder einem Datenabgleich gegen das Quellsystem. Sie findet Fehler, verhindert sie aber nicht.

### Beispiel
Vor der Abnahme eines Umsatz-Dashboards vergleicht das Möbelhaus die angezeigten Monatsumsätze mit den Summen der Buchhaltung; eine Abweichung von 1.250 € im März wird als Fehler protokolliert.

### Abgrenzung
| Begriff | Umfang |
|---|---|
| Qualitätsmanagement | übergreifendes System (z. B. ISO 9001, PDCA) |
| Qualitätssicherung | alle geplanten Maßnahmen, konstruktiv und analytisch |
| Qualitätskontrolle | das Prüfen des Ergebnisses |

### Prüfungsfalle
Qualitätskontrolle und Qualitätssicherung gleichsetzen – Kontrolle ist nur der prüfende Teil.

### Merksatz
Kontrolle misst, was herausgekommen ist.

Siehe auch: Qualitätssicherung · Analytische Qualitätssicherung · Soll-Ist-Vergleich · Review · Abnahme
Mehr: Deep Dive 16, 1.1

## Qualitätssicherung
<!-- id: qualitatssicherung · quellen: Karte DD16, DD16 1.1 · stand: 2026-10 -->

Alle geplanten Maßnahmen, die Qualität herbeiführen – konstruktiv (Fehler vermeiden) und analytisch (Fehler finden).

### Erklärung
**Konstruktive** Qualitätssicherung wirkt vor und während der Entwicklung: Namenskonventionen, Vorlagen, Programmierrichtlinien, Schulungen, Validierungsregeln im Eingabeformular, Versionsverwaltung. **Analytische** Qualitätssicherung prüft fertige (Teil-)Ergebnisse: Tests, Reviews, statische Codeanalyse, Datenabgleich. Maßstab sind die Anforderungen, für Software z. B. die Qualitätsmerkmale der ISO/IEC 25010.

### Beispiel
Für eine neue ETL-Strecke legt die Analystin Benennungsregeln und ein Git-Repository fest (konstruktiv) und prüft nach jedem Lauf Satzzahlen und Abstimmsummen gegen die Quelle (analytisch).

### Abgrenzung
| | Konstruktiv | Analytisch |
|---|---|---|
| Ziel | Fehler vermeiden | Fehler finden |
| Zeitpunkt | vor/während der Entwicklung | nach einem Ergebnis |
| Beispiel | Richtlinien, Eingabeprüfung | Test, Review |

### Prüfungsfalle
Qualitätssicherung nur als „Testen“ beschreiben – die vorbeugenden Maßnahmen gehören dazu und sind meist billiger (1-10-100-Regel).

### Merksatz
Gute Qualität entsteht durch Vorbeugen und Prüfen, nicht durch Prüfen allein.

Siehe auch: Konstruktive Qualitätssicherung · Analytische Qualitätssicherung · Qualitätskontrolle · ISO/IEC 25010 · Versionsverwaltung
Mehr: Deep Dive 16, 1.1

## Quarantäne
<!-- id: quarantane · quellen: Karte DD8, DD8 3.1, DD8 3.3, DD9 5.3 · stand: 2026-10 -->

Bereich, in den der ETL-Prozess fehlerhafte Datensätze ausleitet, statt sie zu verwerfen; dort werden sie geklärt und nach Korrektur nachgeladen.

### Erklärung
Im Transform-Schritt prüfen Validierungsregeln jeden Satz. Verletzt er eine Regel, landet er mit Fehlergrund in der Quarantäne, und ein Verantwortlicher (meist der Data Steward) klärt die Ursache – idealerweise im Quellsystem. Das Ladeprotokoll weist gelesene, geladene und abgewiesene Sätze aus, damit die Summen im DWH mit der Quelle abstimmbar bleiben.

### Beispiel
Beim nächtlichen Laden der Bestellungen haben 12 von 8.400 Sätzen ein Lieferdatum vor dem Bestelldatum. Sie gehen in die Quarantäne; die übrigen 8.388 werden geladen. Nach der Korrektur im Warenwirtschaftssystem werden die 12 Sätze nachgeladen.

### Abgrenzung
| Umgang mit Fehlern | Folge |
|---|---|
| verwerfen | Information weg, Summen unerklärbar falsch |
| ungeprüft laden | falsche Zahlen in Berichten |
| Quarantäne | Daten erhalten, Fehler nachvollziehbar |

### Prüfungsfalle
Ungültige Sätze im ETL einfach löschen – die Ursache wird nie behoben, und niemand erkennt die Lücke.

### Merksatz
Fehlerhafte Daten kommen in Quarantäne, nicht in den Papierkorb.

Siehe auch: ETL · Data Steward · Plausibilitätsprüfung · Datenqualität · Data Warehouse
Mehr: Deep Dive 8, 3.1 · Deep Dive 8, 3.3 · Deep Dive 9, 5.3

## Quartil
<!-- id: quartil · quellen: Karte DD3, DD3 4.2 · stand: 2026-10 -->

Die Quartile Q1, Q2 und Q3 teilen sortierte Daten in vier gleich große Teile: Rund 25 % der Werte liegen unter Q1, 50 % unter Q2 (Median), 75 % unter Q3.

### Erklärung
Es gibt mehrere Berechnungskonventionen; im Lernzettel gilt: Position = n · p; keine ganze Zahl → aufrunden und den Wert an dieser Position nehmen; ganze Zahl → Mittel aus dieser und der nächsten Position. Der **Interquartilsabstand** IQR = Q3 − Q1 umfasst die mittleren 50 % und ist robust gegen Ausreißer; er bildet die Box im Boxplot.

### Beispiel
Lieferzeiten (Tage), sortiert: 2, 3, 3, 4, 5, 5, 5, 6, 8, 19 (n = 10).
- Q1: Position $10 \cdot 0{,}25 = 2{,}5$ → Position 3 → Wert 3
- Q3: Position $10 \cdot 0{,}75 = 7{,}5$ → Position 8 → Wert 6
- IQR = 6 − 3 = 3 Tage

Excel QUARTILE.INKL liefert 3,25 und 5,75 – eine andere Konvention, kein Fehler.

### Abgrenzung
Quartile sind spezielle **Quantile** (25 %, 50 %, 75 %); Perzentile teilen in 100 Teile.

### Prüfungsfalle
Position und Wert verwechseln: Position 8 führt hier zum Wert 6, nicht zu 8. Immer beides und die Konvention notieren.

### Merksatz
Erst die Position berechnen, dann den Wert ablesen.

Siehe auch: Interquartilsabstand (IQR) · Median · Boxplot · Fünf-Punkte-Zusammenfassung · Ausreißer
Mehr: Deep Dive 3, 4.2

## Quicksort
<!-- id: quicksort · quellen: Karte DD11, DD11 B7 · stand: 2026-10 -->

Sortierverfahren nach dem Prinzip „Teile und herrsche“: Ein Pivotelement teilt die Liste in kleinere und größere Werte, die Teile werden rekursiv sortiert.

### Erklärung
Im Mittel braucht Quicksort O(n log n) Vergleiche und ist in der Praxis sehr schnell, weil es ohne großen Zusatzspeicher an Ort und Stelle sortiert. Im schlechtesten Fall – wenn das Pivot immer das kleinste oder größte Element ist, z. B. das erste Element einer bereits sortierten Liste – fällt es auf O(n²) zurück. Quicksort ist nicht stabil.

### Beispiel
Liste 5, 3, 8, 1, 6, Pivot = erstes Element 5:
- kleiner: 3, 1 → Pivot 3 → 1, 3
- größer: 8, 6 → Pivot 8 → 6, 8
- Ergebnis: 1, 3, 5, 6, 8

### Abgrenzung
| Verfahren | Mittel | schlechtester Fall | stabil | Zusatzspeicher |
|---|---|---|---|---|
| Quicksort | O(n log n) | O(n²) | nein | gering |
| Merge Sort | O(n log n) | O(n log n) | ja | ja |
| Bubble Sort | O(n²) | O(n²) | ja | nein |

### Prüfungsfalle
Quicksort immer O(n log n) zuschreiben – der schlechteste Fall ist quadratisch.

### Merksatz
Pivot wählen, aufteilen, Teile genauso behandeln.

Siehe auch: Merge Sort · Bubble Sort · Rekursion · Stabiles Sortierverfahren · O-Notation
Mehr: Deep Dive 11, B7
