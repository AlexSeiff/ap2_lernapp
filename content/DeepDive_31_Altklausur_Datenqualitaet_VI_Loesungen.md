# Musterlösungen Übungsklausur Altklausur-Training Datenqualität VI (Deep Dive 31)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen** wie im echten Lösungsschlüssel – andere sach- und fachgerechte Antworten zählen gleichwertig. Bei SQL und Python zählt die Logik; die Syntax anderer Dialekte ist ebenfalls richtig. 92+ P = sehr gut.

---

## Block A – Akkuzustand mit KI beurteilen (25 P)

**A1 (6 P):** *(je Begriff 1 P Beschreibung, 1 P Beziehung)*
- **Künstliche Intelligenz** ist der **Oberbegriff** für Systeme, die Aufgaben lösen, für die sonst menschliche Intelligenz nötig ist – wahrnehmen, schließen, entscheiden. Dazu zählen auch Systeme mit fest programmierten Regeln.
- **Maschinelles Lernen** ist ein **Teilgebiet der KI**: Das System leitet Muster und Regeln selbst aus Beispieldaten ab und verbessert sich mit mehr Daten, statt dass die Regeln von Hand programmiert werden.
- **Deep Learning** ist ein **Teilgebiet des maschinellen Lernens**: Es verwendet künstliche neuronale Netze mit vielen Schichten, die die nötigen Merkmale selbst aus Rohdaten bilden; es braucht große Datenmengen und viel Rechenleistung.

**A2 (4 P):** *(je Art 2 P)*
- **Supervised Learning (überwachtes Lernen):** Das Modell wird mit Daten trainiert, bei denen das **richtige Ergebnis (Label) bekannt** ist. Es lernt den Zusammenhang zwischen Merkmalen und Label und sagt das Label für neue Fälle vorher – als Klassifikation (gut/schlecht) oder Regression (Zahlenwert).
- **Unsupervised Learning (unüberwachtes Lernen):** Die Daten haben **kein Label**. Das Verfahren sucht selbstständig nach Strukturen, etwa Gruppen ähnlicher Fälle (Clusteranalyse), Zusammenhängen (Assoziationsanalyse) oder Ausreißern.

**A3 (2 P):** Zu jedem Trainingsdatensatz ist der Zustand **als Label bekannt** (überwachtes Lernen) *(1 P)*, und die beiden Klassen bilden **klar getrennte Bereiche**: Gute Akkus haben eine Selbstentladung bis 1,9 %, schlechte ab 3,6 % – die Klassen sind linear trennbar *(1 P)*.

**A4 (3 P):** *(je zwei richtige Zuordnungen 1 P)*

| Stelle | Ziffer |
|---|---|
| A | 4 |
| B | 6 |
| C | 3 |
| D | 5 |
| E | 1 |
| F | 2 |

A = Bias, B = Input, C = Gewichte, D = Nettoeingabefunktion, E = Sprungfunktion, F = Output.

**A5 (5 P):** *(je Schritt 1 P)*
1. Die **Eingänge** m1 und m2 werden jeweils mit ihrem **Gewicht** multipliziert; der Bias geht als konstanter Eingang 1 mit dem Gewicht w₀ ein.
2. Die **Nettoeingabefunktion** bildet die gewichtete Summe z = w₀ · 1 + w₁ · m1 + w₂ · m2.
3. Die **Sprungfunktion** wandelt die Summe in eine Klasse um: 1, falls z ≥ 0, sonst 0.
4. Dieser Wert ist der **Output** y – die vorhergesagte Klasse (gut oder schlecht).
5. Beim Training wird y mit dem bekannten Label verglichen; der **Fehler** wird zurückgeführt und die Gewichte werden so angepasst, dass die Vorhersage beim nächsten Mal besser passt.

*Prüferkommentar: „Das Neuron berechnet einen Wert“ reicht nicht. Verlangt ist der Weg vom Eingang über Summe und Sprungfunktion zum Ausgang – und die Rückführung des Fehlers, die in der Skizze eingezeichnet ist.*

**A6 (5 P):** *(je zwei richtige Felder 1 P)*

| Feld | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Anweisung | 6 | 9 | 2 | 5 | 8 | 1 | 7 | 10 | 3 | 4 |

Der Algorithmus in Worten: Gewichte mit 0 vorbelegen (6) · solange noch Epochen übrig sind (9) · für jede Zeile der Trainingsdaten (2): Messwerte lesen (5), Label lesen (8), Fehler aus Label und Vorhersage bilden (1) · wenn der Fehler nicht 0 ist (7): Gewichte der Eingänge anpassen (10) und Bias-Gewicht anpassen (3) · nach der inneren Schleife den Epochenzähler erhöhen (4).

*Prüferkommentar: Die Felder 4 und 5 sowie 8 und 9 dürfen getauscht sein. Der Fehler (1) muss nach beiden Leseanweisungen stehen, der Epochenzähler (4) außerhalb der inneren Schleife – sonst endet das Training nach wenigen Zeilen.*

---

## Block B – Gerätedaten in eine Datenbank überführen (26 P)

**B1 (13 P):** Relationenmodell in 3. Normalform:

- geraet(**geraetenr**, letzte_wartung, modell_id↑, mieter_id↑)
- modell(**modell_id**, bezeichnung, schutzart)
- mieter(**mieter_id**, name, ansprechpartner_nachname, ansprechpartner_vorname, telefon)

Datentypen: `geraetenr` VARCHAR(10) – wegen des Bindestrichs kein Zahlentyp · `letzte_wartung` DATE · `modell_id`, `mieter_id` INT · `bezeichnung`, `name`, Namen des Ansprechpartners VARCHAR · `schutzart` VARCHAR(5) · `telefon` VARCHAR(20).

Beziehungen: modell 1 : n geraet (ein Modell, viele Geräte) · mieter 1 : n geraet (ein Mieter, viele Geräte).

| Element | P |
|---|---|
| Drei Tabellen für Gerät, Modell und Mieter | 3 |
| Attribute ohne Redundanz zugeordnet: Schutzart beim Modell, Ansprechpartner und Telefon beim Mieter | 3 |
| Primärschlüssel in jeder Tabelle gekennzeichnet (für Modell und Mieter eine ID eingeführt) | 2 |
| Fremdschlüssel für Modell und Mieter in der Tabelle der Geräte | 2 |
| Datentypen angegeben und passend (Gerätenummer und Telefon als Text, Wartung als Datum) | 1 |
| Beziehungen mit Kardinalitäten 1 : n | 2 |

Begründung: Die Schutzart hängt vom **Modell** ab, Ansprechpartner und Telefon hängen vom **Mieter** ab – beides sind Abhängigkeiten von Nichtschlüsselattributen (transitiv) und verletzen die 3. Normalform. „Thomsen, Inga“ ist nicht atomar und wird in Nachname und Vorname getrennt.

*Prüferkommentar: Wer Modellbezeichnung und Mietername als Primärschlüssel verwendet, erhält die Punkte ebenfalls; eine ID ist robuster gegen Umbenennungen. Der häufigste Fehler: Die Fremdschlüssel stehen in `modell` und `mieter` statt in `geraet`.*

**B2 (4 P):** *(Erklärung 2 P, Vorteil 2 P)* Ein **Prepared Statement** ist eine SQL-Anweisung, die mit **Platzhaltern** statt mit festen Werten an die Datenbank übergeben und dort vorbereitet wird; die Werte werden beim Ausführen **getrennt** mitgegeben. Vorteil: **Schutz vor SQL-Injection** – die Werte werden nie als SQL-Code ausgewertet, auch wenn sie Anführungszeichen oder SQL-Befehle enthalten. Ebenfalls richtig: Die Anweisung wird nur einmal analysiert und kann mit wechselnden Werten **schneller wiederholt** ausgeführt werden.

**B3 (9 P):** *(CREATE TABLE mit Spalten und Datentypen 3 P, Primärschlüssel 1 P, Ausführen mit `execute` 1 P, INSERT mit Platzhaltern 2 P, Werte als Tupel übergeben 1 P, `commit` 1 P)*

```python
cursor.execute("""CREATE TABLE mieter (
    mieter_id INT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    ansprechpartner_nachname VARCHAR(40),
    ansprechpartner_vorname VARCHAR(40),
    telefon VARCHAR(20))""")

sql = """INSERT INTO mieter
         (mieter_id, name, ansprechpartner_nachname, ansprechpartner_vorname, telefon)
         VALUES (%s, %s, %s, %s, %s)"""
werte = (1, "Hafenfest Büsum e. V.", "Thomsen", "Inga", "04834 555-0142")
cursor.execute(sql, werte)

verbindung.commit()
```

*Prüferkommentar: Die Werte per String-Verkettung in die Anweisung zu schreiben funktioniert, übergibt sie aber nicht als Parameter – 2 P Abzug. Ohne `commit()` ist der Mieter nach dem Ende des Skripts nicht gespeichert. Wer den Cursor mit `cursor(prepared=True)` anlegt, damit die Anweisung auf dem Server vorbereitet wird, liegt ebenfalls richtig.*

---

## Block C – Lagerbewegungen: REST, SQL und Kennzahlen (28 P)

**C1 (2 P):** *(Aufbau mit geschweiften Klammern und Namen in Anführungszeichen 1 P, Werte richtig 1 P)*

```json
{
  "artikelnr": 7,
  "zeitpunkt": "2026-04-01T12:41:08",
  "menge": 3
}
```

**C2 (2 P):** Jede Ressource – hier eine Lagerbewegung oder die Liste aller Lagerbewegungen – ist über eine **eindeutige URL** erreichbar *(1 P)*. Bearbeitet wird sie mit den **HTTP-Methoden** (lesen, anlegen, ändern, löschen); die Daten werden dabei z. B. als JSON im Body übertragen, und jede Anfrage enthält alle nötigen Angaben, weil der Server keinen Sitzungszustand speichert *(1 P)*.

**C3 (4 P):** *(je Methode 1 P)*
- **GET** `/lagerbewegungen?artikelnr=7` – alle Lagerbewegungen des Artikels 7 abrufen.
- **POST** `/lagerbewegungen` – eine neue Lagerbewegung anlegen (Daten im Body).
- **PUT** `/lagerbewegungen/215` – eine vorhandene Lagerbewegung korrigieren, z. B. eine falsch erfasste Menge.
- **DELETE** `/lagerbewegungen/215` – eine irrtümlich gebuchte Lagerbewegung löschen.

**C4 (4 P):** *(MAX 1 P, MIN 1 P, Aliasnamen und FROM 1 P, GROUP BY 1 P)*

```sql
SELECT artikelnr, MAX(menge) AS maximum, MIN(menge) AS minimum
FROM lagerbestand
GROUP BY artikelnr;
```

Ergebnis: Artikel 1: 18 und 6 · Artikel 2: 12 und 8.

**C5 (7 P):** *(Mittelwert mit AVG 1 P, Standardabweichung 2 P, Runden je 1 P, Aliasnamen 1 P, GROUP BY 1 P)*

In MySQL und PostgreSQL lautet der Ausdruck für die Grundgesamtheit `ROUND(STDDEV_POP(menge)) AS standardabweichung`. Ausführbar im SQL-Editor der App (SQLite) ist die Fassung mit der Umformung:

```sql
SELECT artikelnr,
       ROUND(AVG(menge)) AS mittelwert,
       ROUND(SQRT(AVG(menge * menge) - AVG(menge) * AVG(menge))) AS standardabweichung
FROM lagerbestand
GROUP BY artikelnr;
```

Ergebnis: Artikel 1: 11 und 4 · Artikel 2: 10 und 1.

*Prüferkommentar: MySQL versteht `STDDEV()` als `STDDEV_POP()`. In PostgreSQL bezeichnet `STDDEV()` die Stichprobenformel mit n − 1 im Nenner. Für Artikel 1 ergäbe sie 5. Gefragt ist hier wie in C6 die Grundgesamtheit, also gerundet 4.*

**C6 (6 P):** *(Mittelwert 1 P, Abweichungsquadrate 1 P, Varianz 1 P, Standardabweichung 1 P, Interpretation 2 P)*

- Mittelwert: $\mu = \frac{14 + 6 + 10 + 18 + 7}{5} = \frac{55}{5}$ = **11**
- Abweichungen vom Mittelwert: 3, −5, −1, 7, −4 → Quadrate 9, 25, 1, 49, 16 (Summe 100)
- Varianz: $\sigma^2 = \frac{100}{5}$ = **20**
- Standardabweichung: $\sigma = \sqrt{20}$ = **4,47**

Interpretation: Im Mittel liegen 11 Stück von Artikel 1 auf Lager; die Wochenbestände streuen mit einer Standardabweichung von rund 4,5 Stück um diesen Wert – das sind etwa 40 % des Mittelwerts. Der Bestand **schwankt stark** (zwischen 6 und 18 Stück); in schwachen Wochen kann ein Engpass entstehen, in starken ist möglicherweise unnötig viel Kapital und Platz gebunden. Die gerundeten Werte der Abfrage aus C5 (11 und 4) bestätigen die Rechnung.

**C7 (3 P):** *(Sortieren 1 P, Median 1 P, Interpretation 1 P)*

Sortiert: 6, 7, **10**, 14, 18 → Median = **10**

Interpretation: In mindestens der Hälfte der Wochen lag der Bestand bei höchstens 10 Stück und in mindestens der Hälfte bei mindestens 10 Stück. Der Median liegt knapp unter dem Mittelwert (11): Der hohe Bestand von 18 Stück in Woche 4 zieht den Mittelwert nach oben; der Median ist gegen solche Einzelwerte unempfindlich.

---

## Block D – Lagerdaten für eine Analyse aufbereiten (21 P)

**D1 (3 P):** *(je Schritt 1 P)* Daten **sichten und prüfen** (Profiling: fehlende Werte, Wertebereiche, Dubletten) · Daten **bereinigen** (Dubletten entfernen, Fehler korrigieren, fehlende Werte behandeln) · Daten **vereinheitlichen und transformieren** (Formate, Einheiten, Kodierung, Skalierung) · Daten aus mehreren Quellen **zusammenführen** · Ergebnis **validieren und dokumentieren**.

**D2 (8 P):** *(je Problem 1 P Beschreibung, 1 P Beispiel)*
- **Fehlende Werte:** In Zeile 1 fehlt die Fachkapazität, in Zeile 4 fehlen beide Entnahmewerte, in Zeile 8 fehlt das Fach.
- **Doppelter Datensatz mit Widerspruch:** Die Zeilen 2 und 3 beschreiben denselben Artikel im selben Fach, nennen aber 150 und 15 als Kapazität.
- **Widerspruch zwischen Spalten:** In Zeile 5 ist der Durchschnitt (640,8) größer als das Maximum (410) – das ist rechnerisch unmöglich.
- **Wert außerhalb des zulässigen Bereichs:** In Zeile 6 ist die durchschnittliche Entnahme negativ (−8).
- **Unplausibel gegenüber der Kapazität:** In Zeile 5 übersteigt die maximale Entnahme (410) die Fachkapazität (400), obwohl nur einmal je Woche befüllt wird; in Zeile 3 ist der Abstand noch größer (120 bei Kapazität 15). Das ist zu prüfen.
- **Lagerplatz mehrfach vergeben:** Halle 1, Regal 5, Fach 1 ist den Artikeln 11 (Zeilen 2 und 3) und 12 (Zeile 4) zugeordnet – ein möglicher Zuordnungsfehler.

**D3 (6 P):** *(je Vorschlag 1 P, Begründung 1 P)*, z. B.:
- **Dublette klären und zusammenführen:** Bei den Zeilen 2 und 3 die Kapazität am Regal nachprüfen und nur den richtigen Datensatz behalten – vermutlich fehlt in Zeile 3 eine Null. Zwei Zeilen für dasselbe Fach würden den Artikel in der Analyse doppelt zählen.
- **Unmögliche Werte nicht verwenden, sondern an der Quelle korrigieren:** Die Zeilen 5 und 6 (Durchschnitt über dem Maximum, negative Entnahme) aus den Buchungsdaten neu berechnen; bis dahin kennzeichnen und von der Auswertung ausschließen. Ein geschätzter Wert würde den Fehler nur verdecken.
- **Fehlende Werte gezielt ergänzen:** Fach (Zeile 8) und Kapazität (Zeile 1) lassen sich im Lager aufnehmen, weil es feste Stammdaten sind. Die fehlenden Entnahmen in Zeile 4 nicht mit 0 oder einem Mittelwert füllen – sonst erscheint das Fach fälschlich als ungenutzt bzw. durchschnittlich genutzt.
- **Prüfregeln für die Zukunft:** Pflichtfelder, Wertebereich ≥ 0 und Durchschnitt ≤ Maximum schon bei der Erfassung prüfen. Einen Artikel darf es in mehreren Fächern geben. Pro Kombination aus Halle, Regal und Fach muss die hinterlegte Fachkapazität eindeutig sein.

*Prüferkommentar: Ein Vorschlag ohne Begründung bringt nur die Hälfte. „Fehlerhafte Zeilen löschen“ ist als alleiniger Vorschlag zu wenig – von acht Zeilen blieben zwei übrig.*

**D4 (4 P):** *(je Aspekt 2 P)*, z. B.:
- **Personenbezug und Rechtsgrundlage:** Laufwege einzelner Beschäftigter sind personenbezogene Daten. Vor der Aufzeichnung muss der Betrieb Rechtsgrundlage und Erforderlichkeit prüfen (Art. 6 DSGVO, § 26 BDSG). Eine Betriebsvereinbarung muss die Datenschutzvorgaben einhalten. Die Beschäftigten erfahren vorab Zweck und Umfang der Erfassung.
- **Zweckbindung:** Die Daten dürfen nur zur Verbesserung der Wege verwendet werden, nicht zur Leistungs- oder Verhaltenskontrolle einzelner Personen.
- **Datenminimierung:** Soweit möglich anonymisiert oder zusammengefasst aufzeichnen (z. B. aufsummierte Wegstrecken mehrerer Personen je Schicht). Eine Gerätekennung bleibt personenbezogen, wenn sie einer Person zugeordnet werden kann. Daten nur für den erforderlichen Zeitraum speichern und eine Löschfrist festlegen.
- **Mitbestimmung:** Eine technische Einrichtung, die zur Überwachung von Verhalten oder Leistung geeignet ist, darf nur mit Zustimmung des Betriebsrats eingeführt werden (§ 87 Abs. 1 Nr. 6 BetrVG).
