# Musterlösungen Übungsklausur Altklausur-Training Datenqualität IV (Deep Dive 29)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen** wie im echten Lösungsschlüssel – andere sach- und fachgerechte Antworten zählen gleichwertig. Bei SQL zählt die Logik; die Syntax anderer SQL-Dialekte ist ebenfalls richtig. 92+ P = sehr gut.

---

## Block A – Pilzbefall erkennen: Klassifikation (27 P)

**A1 (7 P):** *(Achsen mit Beschriftung und gleichmäßiger Skala 1 P, 15 Trainingspunkte richtig eingetragen 3 P, Symbole Kreis/Kreuz 1 P, je Gerade 1 P)*

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 350" width="640" height="350" role="img" aria-label="Koordinatensystem mit acht gesunden Brettern (Kreise) links oben, sieben befallenen Brettern (Kreuze) rechts unten, Gerade 1 waagerecht bei y = 7,5 und Gerade 2 ansteigend; fünf Testpunkte in Kästchen">
<line x1="60" y1="300" x2="580" y2="300" class="dg-linie"/>
<line x1="60" y1="300" x2="60" y2="30" class="dg-linie"/>
<line x1="60" y1="300" x2="60" y2="305" class="dg-linie dg-duenn"/>
<text x="60" y="318" text-anchor="middle" class="dg-klein dg-leise">0</text>
<line x1="110" y1="300" x2="110" y2="305" class="dg-linie dg-duenn"/>
<text x="110" y="318" text-anchor="middle" class="dg-klein dg-leise">1</text>
<line x1="160" y1="300" x2="160" y2="305" class="dg-linie dg-duenn"/>
<text x="160" y="318" text-anchor="middle" class="dg-klein dg-leise">2</text>
<line x1="210" y1="300" x2="210" y2="305" class="dg-linie dg-duenn"/>
<text x="210" y="318" text-anchor="middle" class="dg-klein dg-leise">3</text>
<line x1="260" y1="300" x2="260" y2="305" class="dg-linie dg-duenn"/>
<text x="260" y="318" text-anchor="middle" class="dg-klein dg-leise">4</text>
<line x1="310" y1="300" x2="310" y2="305" class="dg-linie dg-duenn"/>
<text x="310" y="318" text-anchor="middle" class="dg-klein dg-leise">5</text>
<line x1="360" y1="300" x2="360" y2="305" class="dg-linie dg-duenn"/>
<text x="360" y="318" text-anchor="middle" class="dg-klein dg-leise">6</text>
<line x1="410" y1="300" x2="410" y2="305" class="dg-linie dg-duenn"/>
<text x="410" y="318" text-anchor="middle" class="dg-klein dg-leise">7</text>
<line x1="460" y1="300" x2="460" y2="305" class="dg-linie dg-duenn"/>
<text x="460" y="318" text-anchor="middle" class="dg-klein dg-leise">8</text>
<line x1="510" y1="300" x2="510" y2="305" class="dg-linie dg-duenn"/>
<text x="510" y="318" text-anchor="middle" class="dg-klein dg-leise">9</text>
<line x1="560" y1="300" x2="560" y2="305" class="dg-linie dg-duenn"/>
<text x="560" y="318" text-anchor="middle" class="dg-klein dg-leise">10</text>
<line x1="55" y1="300" x2="60" y2="300" class="dg-linie dg-duenn"/>
<text x="48" y="304" text-anchor="end" class="dg-klein dg-leise">0</text>
<line x1="55" y1="280" x2="60" y2="280" class="dg-linie dg-duenn"/>
<line x1="55" y1="260" x2="60" y2="260" class="dg-linie dg-duenn"/>
<text x="48" y="264" text-anchor="end" class="dg-klein dg-leise">2</text>
<line x1="55" y1="240" x2="60" y2="240" class="dg-linie dg-duenn"/>
<line x1="55" y1="220" x2="60" y2="220" class="dg-linie dg-duenn"/>
<text x="48" y="224" text-anchor="end" class="dg-klein dg-leise">4</text>
<line x1="55" y1="200" x2="60" y2="200" class="dg-linie dg-duenn"/>
<line x1="55" y1="180" x2="60" y2="180" class="dg-linie dg-duenn"/>
<text x="48" y="184" text-anchor="end" class="dg-klein dg-leise">6</text>
<line x1="55" y1="160" x2="60" y2="160" class="dg-linie dg-duenn"/>
<line x1="55" y1="140" x2="60" y2="140" class="dg-linie dg-duenn"/>
<text x="48" y="144" text-anchor="end" class="dg-klein dg-leise">8</text>
<line x1="55" y1="120" x2="60" y2="120" class="dg-linie dg-duenn"/>
<line x1="55" y1="100" x2="60" y2="100" class="dg-linie dg-duenn"/>
<text x="48" y="104" text-anchor="end" class="dg-klein dg-leise">10</text>
<line x1="55" y1="80" x2="60" y2="80" class="dg-linie dg-duenn"/>
<line x1="55" y1="60" x2="60" y2="60" class="dg-linie dg-duenn"/>
<text x="48" y="64" text-anchor="end" class="dg-klein dg-leise">12</text>
<line x1="55" y1="40" x2="60" y2="40" class="dg-linie dg-duenn"/>
<text x="580" y="338" text-anchor="end" class="dg-klein">Kennwert x</text>
<text x="20" y="24" text-anchor="start" class="dg-klein">Kennwert y</text>
<line x1="60" y1="150" x2="560" y2="150" class="dg-linie dg-strich"/>
<text x="566" y="154" text-anchor="start" class="dg-klein">Gerade 1</text>
<line x1="110" y1="290" x2="510" y2="50" class="dg-linie-akzent dg-dick"/>
<text x="516" y="54" text-anchor="start" class="dg-klein dg-akzent-text">Gerade 2</text>
<circle cx="160" cy="120" r="5" class="dg-voll"/>
<circle cx="160" cy="100" r="5" class="dg-voll"/>
<circle cx="210" cy="120" r="5" class="dg-voll"/>
<circle cx="210" cy="100" r="5" class="dg-voll"/>
<circle cx="210" cy="80" r="5" class="dg-voll"/>
<circle cx="235" cy="110" r="5" class="dg-voll"/>
<circle cx="260" cy="100" r="5" class="dg-voll"/>
<circle cx="260" cy="80" r="5" class="dg-voll"/>
<path d="M405,195 L415,205 M405,205 L415,195" class="dg-linie"/>
<path d="M405,175 L415,185 M405,185 L415,175" class="dg-linie"/>
<path d="M430,215 L440,225 M430,225 L440,215" class="dg-linie"/>
<path d="M455,175 L465,185 M455,185 L465,175" class="dg-linie"/>
<path d="M455,195 L465,205 M455,205 L465,195" class="dg-linie"/>
<path d="M480,205 L490,215 M480,215 L490,205" class="dg-linie"/>
<path d="M505,175 L515,185 M505,185 L515,175" class="dg-linie"/>
<rect x="226" y="81" width="18" height="18" class="dg-linie dg-duenn"/>
<circle cx="235" cy="90" r="5" class="dg-voll"/>
<rect x="451" y="151" width="18" height="18" class="dg-linie dg-duenn"/>
<path d="M455,155 L465,165 M455,165 L465,155" class="dg-linie"/>
<rect x="401" y="121" width="18" height="18" class="dg-linie dg-duenn"/>
<path d="M405,125 L415,135 M405,135 L415,125" class="dg-linie"/>
<rect x="326" y="111" width="18" height="18" class="dg-linie dg-duenn"/>
<circle cx="335" cy="120" r="5" class="dg-voll"/>
<rect x="201" y="51" width="18" height="18" class="dg-linie dg-duenn"/>
<path d="M205,55 L215,65 M205,65 L215,55" class="dg-linie"/>
</svg>
```

Die Abbildung zeigt bereits die Testpunkte aus A4 (in Kästchen). Gerade 1 verläuft waagerecht durch y = 7,5. Gerade 2 geht z. B. durch die Punkte (2 | 2) und (8 | 11).

*Prüferkommentar: Für eine Gerade genügen zwei berechnete Punkte, möglichst weit auseinander. Wer die Testdaten schon hier einträgt, ohne sie zu kennzeichnen, verliert einen Punkt.*

**A2 (2 P):** **Überwachtes Lernen (Supervised Learning)**, genauer eine **Klassifikation** *(1 P)*: Zu jedem Trainingsdatensatz ist die richtige Klasse (G oder P) als Label bekannt; das Modell lernt aus diesen Beispielen, neue Bretter einer der beiden Klassen zuzuordnen *(1 P)*.

**A3 (2 P):** Die Punkte der beiden Klassen bilden **zwei getrennte Punktwolken** – gesunde Bretter haben kleine x- und große y-Werte, befallene große x- und kleine y-Werte *(1 P)*. Eine Gerade zwischen den Wolken teilt die Ebene in zwei Bereiche; die Seite, auf der ein neuer Punkt liegt, gibt seine Klasse an (linear trennbar) *(1 P)*.

**A4 (2 P):** *(je Zeile 1 P)*

| Gerade | richtig | falsch |
|---|---|---|
| 1 | 3 | 2 |
| 2 | 4 | 1 |

Im Einzelnen (oberhalb der Geraden = gesund, unterhalb = befallen):

| Testpunkt | wahre Klasse | Gerade 1 | Gerade 2 |
|---|---|---|---|
| Test 1 (3,5 \| 10,5) | G | G – richtig | G – richtig |
| Test 2 (8 \| 7) | P | P – richtig | P – richtig |
| Test 3 (7 \| 8,5) | P | G – falsch | P – richtig |
| Test 4 (5,5 \| 9) | G | G – richtig | G – richtig |
| Test 5 (3 \| 12) | P | G – falsch | G – falsch |

**A5 (4 P):** *(Entscheidung mit Begründung 2 P, Handlungsempfehlung 2 P)* **Gerade 2** trennt besser: Beide Geraden trennen die Trainingsdaten fehlerfrei, auf den Testdaten liegt Gerade 2 aber viermal richtig, Gerade 1 nur dreimal. Handlungsempfehlung: Die Gerade nicht nach Augenmaß festlegen, sondern Steigung und Achsenabschnitt **systematisch verändern** und jeweils die Fehlerzahl messen – also das Modell mit **mehr Trainingsdaten trainieren** und die Gerade wählen, die auf **ungesehenen Daten** die wenigsten Fehler macht und möglichst großen Abstand zu beiden Punktwolken hält. Sauber ist es, die Gerade mit eigenen Validierungsdaten auszuwählen und die Testdaten erst für die abschließende Bewertung zu verwenden.

**A6 (4 P):** *(je Punkt 1 P Funktionswert, 1 P Differenz)*

Punkt (2 | 8):
- Funktionswert: $f(2) = 1{,}5 \cdot 2 - 1$ = **2**
- Differenz: $8 - 2$ = **6**

Punkt (6 | 5):
- Funktionswert: $f(6) = 1{,}5 \cdot 6 - 1$ = **8**
- Differenz: $5 - 8$ = **−3**

**A7 (3 P):** *(je Zuordnung 1 P, Begründung 1 P)* Punkt (2 | 8) ist **gesund (G)**, Punkt (6 | 5) ist **befallen (P)**. Begründung: Eine **positive** Differenz bedeutet, dass der Punkt **oberhalb** der Trenngeraden liegt – dort liegen alle gesunden Trainingspunkte. Eine **negative** Differenz bedeutet **unterhalb** der Geraden, im Bereich der befallenen Bretter.

*Prüferkommentar: Das Vorzeichen allein reicht nicht – die Zuordnung „oben = gesund“ muss aus den Trainingsdaten begründet werden.*

**A8 (3 P):** *(je zwei richtig gesetzte Schritte 1 P)*

| 1. Schritt | 2. Schritt | 3. Schritt | 4. Schritt | 5. Schritt | 6. Schritt | 7. Schritt |
|---|---|---|---|---|---|---|
| 2 | 5 | 7 | 4 | 6 | 1 | 3 |

Daten sammeln → aufbereiten → in Trainings- und Testdaten aufteilen → Modelltyp auswählen → Gütemaß festlegen → trainieren → bewerten. Modelltyp (4) und Gütemaß (6) dürfen vertauscht sein.

---

## Block B – Kamera- und Klimadaten zusammenführen (25 P)

**B1 (6 P):** *(je Feld 1 P)*

| Feld | Ziffer der Phase |
|---|---|
| A | 5 |
| B | 3 |
| C | 6 |
| D | 1 |
| E | 4 |
| F | 2 |

Business Understanding ⇄ Data Understanding → Data Preparation ⇄ Modeling → Evaluation → zurück zu Business Understanding oder weiter zum Deployment.

**B2 (4 P):** *(je Fehler 1 P Nennung, 1 P Korrektur)*

1. **Reihenfolge:** `pd.merge` wird aufgerufen, bevor `kamera_df` und `klima_df` eingelesen sind – das Skript bricht mit einem `NameError` ab. Die Zeile mit `merge` gehört ans Ende.
2. **Falsche Lesefunktion:** Die Klimadatei ist eine JSON-Datei, wird aber mit `read_csv` gelesen. Richtig ist `pd.read_json`.

```python
import pandas as pd
kamera_df = pd.read_csv("lager/kamera_2610.csv")
klima_df = pd.read_json("klima/2610.json")
daten = pd.merge(kamera_df, klima_df, on="datum", how="inner")
```

**B3 (3 P):** Ein JOIN **verbindet die Zeilen zweier Tabellen** zu einer Ergebnistabelle *(1 P)*, und zwar über **übereinstimmende Werte in einer gemeinsamen Spalte** – in der Regel Fremdschlüssel und Primärschlüssel, hier das Datum *(1 P)*. Beim INNER JOIN erscheinen nur Zeilen, die in beiden Tabellen einen Partner haben; LEFT, RIGHT und FULL JOIN behalten auch Zeilen ohne Partner und füllen die fehlenden Spalten mit NULL *(1 P)*.

**B4 (4 P):** *(DataFrame und eckige Klammern 1 P, Spalte 1 P, Vergleich mit `==` 1 P, Wert als Text 1 P)*

```python
daten[daten.holzart == 'Buche']
```

**B5 (4 P):** *(je Bedingung 1 P, Verknüpfung mit `&` 1 P, Klammern 1 P)*

```python
daten[(daten.zustand == 'gut') & (daten.massnahme == 'keine')]
```

**B6 (4 P):** *(je Bedingung 1 P, Verknüpfung mit `|` 1 P, Klammern 1 P)*

```python
daten[(daten.massnahme == 'manuell') | (daten.zustand == 'Pilzbefall')]
```

*Prüferkommentar: Auch die Schreibweise `daten['holzart']` ist richtig. `and`/`or` statt `&`/`|` kostet den Punkt für die Verknüpfung, ein einfaches `=` den Punkt für den Vergleich.*

---

## Block C – SQL: Holzchargen auswerten (28 P)

**C1 (6 P):** *(SELECT 1 P, zwei JOINs je 1 P, Filter auf Eigenschaft 1 P, Filter auf den Wert 1 P, ORDER BY mit zwei Kriterien 1 P)*

```sql
SELECT c.c_bezeichnung, c.c_jahr, c.c_qualitaet, m.wert
FROM charge c
JOIN messwert m ON m.cid = c.c_id
JOIN eigenschaft e ON e.e_id = m.eid
WHERE e.e_name = 'Holzfeuchte' AND m.wert < 12
ORDER BY m.wert ASC, c.c_qualitaet DESC;
```

*Prüferkommentar: Ohne den Filter auf `e_name` erscheinen auch Rohdichte und Astanteil, deren Werte ebenfalls unter 12 liegen können.*

**C2 (7 P):** *(MAX, MIN, AVG je 1 P, Aliasnamen 1 P, JOIN 1 P, GROUP BY 1 P, Gruppenspalte im SELECT 1 P)*

```sql
SELECT l.l_region,
       MAX(c.c_qualitaet) AS hoechste,
       MIN(c.c_qualitaet) AS niedrigste,
       AVG(c.c_qualitaet) AS durchschnitt
FROM charge c
JOIN lieferant l ON l.l_id = c.c_lid
GROUP BY l.l_region;
```

**C3 (7 P):** *(SELECT mit COUNT und Alias 2 P, JOIN 1 P, WHERE 1 P, GROUP BY 1 P, HAVING 1 P, ORDER BY 1 P)*

```sql
SELECT l.l_name, COUNT(c.c_id) AS anzahl
FROM lieferant l
JOIN charge c ON c.c_lid = l.l_id
WHERE c.c_qualitaet >= 7
GROUP BY l.l_id, l.l_name
HAVING COUNT(c.c_id) > 2
ORDER BY anzahl DESC;
```

*Prüferkommentar: Die Qualitätsstufe filtert **Zeilen** (WHERE), die Mindestanzahl filtert **Gruppen** (HAVING). „Mehr als zwei“ heißt `> 2`.*

**C4 (5 P):** *(SELECT/FROM 1 P, WHERE mit Vergleich 1 P, Unterabfrage mit MAX 3 P)*

```sql
SELECT c_bezeichnung, c_jahr, c_qualitaet
FROM charge
WHERE c_qualitaet = (SELECT MAX(c_qualitaet) FROM charge);
```

*Prüferkommentar: `ORDER BY c_qualitaet DESC LIMIT 1` liefert nur eine Charge – erreichen mehrere die höchste Stufe, fehlen die übrigen (höchstens 2 P).*

**C5 (3 P):** *(DELETE FROM charge 1 P, WHERE 1 P, Lieferant über Unterabfrage bestimmt 1 P)*

```sql
DELETE FROM charge
WHERE c_lid = (SELECT l_id FROM lieferant WHERE l_name = 'Holzkontor Tams');
```

Wegen der Löschweitergabe (`ON DELETE CASCADE`) verschwinden die zugehörigen Zeilen in `messwert` und `charge_holzart` automatisch. Der Lieferant selbst bleibt erhalten. Mit `IN` statt `=` funktioniert die Anweisung auch dann, wenn mehrere Lieferanten denselben Namen tragen.

---

## Block D – Cloud-Speicherung und Schutzbedarf (20 P)

**D1 (4 P):** *(je Nachteil 1 P Nennung, 1 P Erläuterung)*, z. B.:
- **Abhängigkeit von der Internetverbindung:** Fällt die Leitung aus, kann die Manufaktur weder Messdaten speichern noch Auswertungen abrufen.
- **Abhängigkeit vom Anbieter (Lock-in):** Preiserhöhungen, geänderte Schnittstellen oder die Einstellung des Dienstes treffen das Unternehmen direkt, ein Wechsel ist aufwendig.
- **Daten außerhalb des eigenen Zugriffs:** Speicherort und Zugriffe Dritter müssen vertraglich geregelt und kontrolliert werden (Auftragsverarbeitung, Rechtslage im Land des Anbieters).
- **Laufende Kosten:** Die Gebühren wachsen mit Datenmenge und Abrufen – Bilddaten machen die Speicherung dauerhaft teuer.

**D2 (16 P):** *(je ermittelter Einstufung 1 P, je Begründung 2 P)*

| Betrachtetes System | Schutzziel | Schutzbedarf | Begründung |
|---|---|---|---|
| Datenbank in der Cloud | Verfügbarkeit | hoch | Messwerte laufen ständig ein; ein kurzer Ausfall lässt sich durch Zwischenspeichern am Sensor überbrücken, ein längerer führt zu Lücken, und Chargen können nicht freigegeben werden. |
| Datenbank in der Cloud | Integrität | sehr hoch | Die Messdaten sind die Grundlage aller Auswertungen und Freigaben. Unbemerkt verfälschte Werte führen dazu, dass ganze Chargen zu feucht verarbeitet werden – Serienschäden, Rückrufe und Schadensersatz können das Unternehmen in seiner Existenz gefährden. |
| Datenbank in der Cloud | Vertraulichkeit | normal | Gespeichert werden Klimawerte und Bilder von Brettern, keine personenbezogenen Daten; ein Abfluss verursacht nur begrenzten Schaden. |
| KI-Auswertung in der Cloud | Verfügbarkeit | normal | Die Auswertung ist nicht zeitkritisch: Holz verändert sich über Tage, eine Analyse kann einige Stunden später nachgeholt werden. |
| KI-Auswertung in der Cloud | Integrität | hoch | Ein manipuliertes oder fehlerhaftes Modell gibt falsche Empfehlungen – Pilzbefall bleibt unentdeckt und breitet sich aus, oder gesunde Chargen werden unnötig behandelt. |
| KI-Auswertung in der Cloud | Vertraulichkeit | normal | Die Auswertung nutzt verbreitete Standardverfahren; aus dem Modell lassen sich keine schützenswerten Geheimnisse ableiten. |

*Prüferkommentar: Andere Einstufungen zählen, wenn die Begründung schlüssig ist – etwa „hoch“ bei der Vertraulichkeit der Datenbank, weil Lagerbestände und Lieferantendaten Geschäftsgeheimnisse sind. Ohne Begründung gibt es nur den Punkt für die Einstufung. Die Begründung muss zum Schutzziel passen: „Daten könnten gestohlen werden“ begründet die Vertraulichkeit, nicht die Verfügbarkeit.*
