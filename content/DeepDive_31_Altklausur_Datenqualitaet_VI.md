# Deep Dive 31: Altklausur-Training Datenqualität VI
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Die dritte **Übungsvariante im Stil einer Prüfung „Sicherstellen der Datenqualität“** in dieser Reihe: vier Aufgaben mit 25, 26, 28 und 21 Punkten, 90 Minuten. Texte, Zahlen und Szenario sind neu geschrieben, Aufbau und Niveau folgen der Prüfung. Der rote Faden ist die **Datenbereitstellung**: Daten kommen von mobilen Geräten, werden in eine Datenbank überführt, über eine Schnittstelle übertragen und ausgewertet. Neu gegenüber den Deep Dives 19, 23, 24, 29 und 30: das **Perzeptron mit Lernalgorithmus als Struktogramm**, eine **CSV-Datei in die 3. Normalform** überführen (13 P), **Tabelle anlegen und füllen mit Python** (Prepared Statements), **Mittelwert, Standardabweichung und Median** in SQL und von Hand sowie **widersprüchliche Lagerdaten** beurteilen.

Szenario: **Möbelhaus Nordholz GmbH**, Geschäftsbereich **Nordholz Eventservice** – mobile Erfassungsgeräte (MDE-Geräte) und Leihartikel für Veranstaltungen.

---

# Teil 1 – So ist die Klausur aufgebaut

| Aufgabe | Inhalt | Punkte |
|---|---|---|
| 1 | KI, maschinelles Lernen, Deep Learning; überwachtes und unüberwachtes Lernen; Perzeptron beschriften und erklären; Lernalgorithmus ordnen | 25 |
| 2 | CSV-Auszug in ein relationales Modell in 3. Normalform, Prepared Statements, Python-Skript ergänzen | 26 |
| 3 | JSON, REST und HTTP-Methoden, SQL mit MIN/MAX und Standardabweichung, Kennzahlen von Hand, Median | 28 |
| 4 | Schritte der Datenaufbereitung, Probleme in einer Tabelle, Umgang mit problematischen Daten, Datenschutz | 21 |

---

# Teil 2 – KI, maschinelles Lernen und das Perzeptron

## 2.1 Drei Begriffe, ineinander geschachtelt

| Begriff | Bedeutung |
|---|---|
| **Künstliche Intelligenz (KI)** | Oberbegriff: Systeme, die Aufgaben lösen, für die sonst menschliche Intelligenz nötig ist (erkennen, entscheiden, planen) – auch mit fest programmierten Regeln |
| **Maschinelles Lernen (ML)** | Teilgebiet der KI: Das System **lernt Muster aus Daten**, statt dass Regeln von Hand programmiert werden |
| **Deep Learning** | Teilgebiet des ML: **künstliche neuronale Netze mit vielen Schichten**, die Merkmale selbst aus Rohdaten bilden (Bilder, Sprache) – braucht viele Daten und Rechenleistung |

Merksatz: Deep Learning ⊂ maschinelles Lernen ⊂ künstliche Intelligenz.

## 2.2 Überwacht und unüberwacht

- **Supervised Learning:** Trainingsdaten mit **bekanntem Ergebnis (Label)**. Das Modell lernt den Zusammenhang zwischen Merkmalen und Label – Klassifikation (gut/schlecht) oder Regression (Zahl).
- **Unsupervised Learning:** Daten **ohne Label**. Das Verfahren sucht selbst nach Strukturen – Clusteranalyse, Assoziationsanalyse, Ausreißererkennung.

## 2.3 Das Perzeptron

| Teil | Aufgabe |
|---|---|
| **Input** x₁ … xₙ | Messwerte des Falls |
| **Gewichte** w₁ … wₙ | Bedeutung jedes Eingangs; werden gelernt |
| **Bias** | konstanter Eingang 1 mit eigenem Gewicht w₀; verschiebt die Entscheidungsgrenze |
| **Nettoeingabefunktion** | gewichtete Summe z = w₀ · 1 + w₁ · x₁ + … + wₙ · xₙ |
| **Sprungfunktion** (Aktivierung) | macht aus z eine Klasse: 1 falls z ≥ 0, sonst 0 |
| **Output** y | vorhergesagte Klasse |

**Lernen:** Die Ausgabe wird mit dem bekannten Label verglichen. Der **Fehler** (Label − Ausgabe) wird zurückgeführt: Ist er 0, bleiben die Gewichte; sonst wird jedes Gewicht um Fehler · Eingang verändert, das Bias-Gewicht um den Fehler. Ein Durchlauf über alle Trainingsdaten heißt **Epoche**; gelernt wird über mehrere Epochen.

Ein einzelnes Perzeptron kann nur **linear trennbare** Klassen unterscheiden – es legt eine Gerade (bei zwei Eingängen) zwischen die Punktwolken.

> ❓ **Prüferfrage:** Warum braucht das Perzeptron einen Bias?
> *Ohne Bias verläuft die Entscheidungsgrenze immer durch den Ursprung. Das Bias-Gewicht verschiebt sie und macht es möglich, Punktwolken zu trennen, deren Grenze nicht durch den Nullpunkt geht.*

---

# Teil 3 – Von der CSV-Datei zur Datenbank

## 3.1 In die 3. Normalform überführen

1. **Wiederholungen suchen:** Welche Spalten haben in mehreren Zeilen immer dieselbe Kombination? Sie hängen von etwas anderem ab als vom Schlüssel der Zeile.
2. **Abhängigkeiten aufschreiben:** Schlüssel → Attribute. Hängt ein Attribut von einem Nichtschlüsselattribut ab (transitiv), gehört es in eine eigene Tabelle.
3. **Tabellen bilden:** je „Ding“ eine Tabelle mit Primärschlüssel; fehlt ein natürlicher Schlüssel, eine ID einführen.
4. **Fremdschlüssel** dort eintragen, wo „viele“ stehen (n-Seite).
5. **Atomare Werte:** „Nachname, Vorname“ in einem Feld auftrennen.
6. **Datentypen** wählen: Kennungen mit Bindestrich und Telefonnummern sind **Text**, Datumswerte `DATE`.

## 3.2 Prepared Statements

Ein Prepared Statement ist eine **SQL-Anweisung mit Platzhaltern**; die Werte werden **getrennt** übergeben. Die Datenbank kennt die Struktur der Anweisung, bevor sie die Werte sieht.

- **Sicherheit:** Übergebene Werte werden nie als SQL-Code ausgeführt – Schutz vor **SQL-Injection**.
- **Geschwindigkeit:** Die Anweisung wird einmal vorbereitet und kann mit wechselnden Werten oft ausgeführt werden.

Bei **MySQL Connector/Python** bereitet ein Cursor mit `prepared=True` die Anweisung auf dem Datenbankserver vor. Der Standard-Cursor setzt die übergebenen Werte clientseitig maskiert in die Anweisung ein. Vor SQL-Injection schützt beides – entscheidend ist, dass die Werte als **Parameter** übergeben und nicht in den SQL-Text geklebt werden.

## 3.3 Muster in Python

```python
cursor.execute("CREATE TABLE ort (plz VARCHAR(5) PRIMARY KEY, name VARCHAR(60))")
sql = "INSERT INTO ort (plz, name) VALUES (%s, %s)"
cursor.execute(sql, ("26789", "Leer"))
verbindung.commit()
```

Platzhalter `%s` im SQL-Text, Werte als Tupel im zweiten Argument, am Ende `commit()` für die eingefügte Zeile. Ohne Autocommit verwirft ein Verbindungsabbruch das noch offene INSERT. `CREATE TABLE` führt in MySQL einen impliziten Commit aus.

---

# Teil 4 – REST, SQL-Kennzahlen und Statistik von Hand

## 4.1 REST und HTTP-Methoden

Bei einem RESTful Service ist jede **Ressource** über eine **URL** erreichbar; bearbeitet wird sie mit den **HTTP-Methoden**. Der Server speichert keinen Sitzungszustand, die Daten werden meist als JSON übertragen.

| Methode | Wirkung | Beispiel |
|---|---|---|
| **GET** | lesen | `GET /artikel/7` |
| **POST** | neu anlegen | `POST /artikel` mit den Daten im Body |
| **PUT** | vorhandene Ressource ändern (ersetzen) | `PUT /artikel/7` |
| **DELETE** | löschen | `DELETE /artikel/7` |

## 4.2 Kennzahlen in SQL

Für die Standardabweichung **aller vorliegenden Wochen** teilst du die Summe der quadrierten Abweichungen durch n. MySQL und PostgreSQL bieten dafür `STDDEV_POP()` an. Der Kurzname `STDDEV()` meint in MySQL die Grundgesamtheit, in PostgreSQL die Stichprobe (Nenner n − 1). Im **SQLite-Editor der App** verwendest du für die Grundgesamtheit die Umformung

σ = √(Mittelwert der Quadrate − Quadrat des Mittelwerts), in SQL: `SQRT(AVG(x * x) - AVG(x) * AVG(x))`.

`ROUND(wert)` rundet auf eine ganze Zahl, `ROUND(wert, 2)` auf zwei Nachkommastellen.

## 4.3 Mittelwert, Standardabweichung und Median von Hand

Beispiel mit den Werten 4, 8, 6, 2, 10:

- Mittelwert: $\mu = \frac{4 + 8 + 6 + 2 + 10}{5}$ = **6**
- Varianz: $\sigma^2 = \frac{(-2)^2 + 2^2 + 0^2 + (-4)^2 + 4^2}{5} = \frac{40}{5}$ = **8**
- Standardabweichung: $\sigma = \sqrt{8}$ = **2,83**
- Median: sortiert 2, 4, **6**, 8, 10 → **6**

Hier beträgt die Standardabweichung rund 47 % des Mittelwerts. Ob diese Streuung groß ist, hängt vom fachlichen Vergleichsmaßstab ab. Mittelwert und Median liegen beide bei 6. Auch starke Abweichungen nach unten und oben können sich im Mittelwert ausgleichen. Prüfe mögliche Ausreißer deshalb an den Einzelwerten.

---

# Teil 5 – Daten aufbereiten und Datenschutz

## 5.1 Schritte der Datenaufbereitung

Daten **sichten** (Profiling: Wertebereiche, fehlende Werte, Dubletten) → **bereinigen** (Dubletten, Fehler, fehlende Werte) → **vereinheitlichen und transformieren** (Formate, Einheiten, Kodierung, Skalierung) → **prüfen und dokumentieren**.

## 5.2 Plausibilität: Was sich widerspricht

| Prüfung | Beispiel für einen Verstoß |
|---|---|
| Pflichtfeld gefüllt? | Fach oder Kapazität ist `null` |
| Wertebereich | negative Entnahmemenge |
| Abhängigkeit zwischen Spalten | Durchschnitt größer als das Maximum |
| Eindeutigkeit | derselbe Lagerplatz zweimal mit verschiedenen Kapazitäten |
| Fachliche Regel (Prüfverdacht) | maximale Entnahme größer als die Kapazität, obwohl nur einmal je Woche befüllt wird |

**Umgang:** an der Quelle **klären und korrigieren** – wenn das nicht geht, den Datensatz **kennzeichnen und ausschließen**; einen Wert nur dann **schätzen**, wenn das fachlich begründet ist, und die Schätzung dokumentieren. Niemals stillschweigend „passend machen“.

## 5.3 Bewegungsdaten von Beschäftigten

Laufwege sind **personenbezogene Daten**, sobald sie einer Person zugeordnet werden können. Dann gilt: **Rechtsgrundlage** und Erforderlichkeit der Erfassung für den konkreten Zweck prüfen (Art. 6 DSGVO, § 26 BDSG) · **Zweckbindung** – nur Wegeoptimierung, keine Leistungs- oder Verhaltenskontrolle · **Datenminimierung** – möglichst anonymisiert oder je Schicht zusammengefasst · **Transparenz** – Beschäftigte vorher informieren (Art. 13 DSGVO) · **Mitbestimmung** des Betriebsrats bei technischen Einrichtungen zur Überwachung (§ 87 Abs. 1 Nr. 6 BetrVG) · **Löschfristen**.

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. KI, ML und Deep Learning **nebeneinander** erklärt statt als Teilmengen.
2. Beim Perzeptron **Bias und Gewichte** oder **Nettoeingabe und Sprungfunktion** verwechselt.
3. Im Lernalgorithmus den **Epochenzähler in die innere Schleife** gesetzt.
4. Normalisierung: **Fremdschlüssel vergessen** oder auf die 1-Seite gesetzt; Telefonnummer als Zahl.
5. Python: Werte per **String-Verkettung** in das SQL geschrieben; `commit()` vergessen.
6. `PUT` und `POST` vertauscht.
7. Varianz durch n − 1 geteilt, obwohl alle Wochen vorliegen – oder die **Wurzel vergessen**.
8. Problematische Daten **gelöscht oder geschätzt, ohne es zu begründen**.

---

# Übungsklausur Datenqualität VI im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Antworte stichwortartig, sofern nicht ausdrücklich Code verlangt ist, und gib bei Berechnungen den Rechenweg an.

## Ausgangssituation

Der Geschäftsbereich **Nordholz Eventservice** der **Möbelhaus Nordholz GmbH** vermietet Leihartikel für Veranstaltungen und die dazu nötigen **mobilen Erfassungsgeräte (MDE-Geräte)** wie Handscanner und Tablets mit Kartenleser, samt Ladestationen und Verbrauchsmaterial. Sie arbeiten in der IT-Abteilung und stellen die Daten des Eventservice für Auswertungen bereit.

## Block A – Akkuzustand mit KI beurteilen (25 P)

Der Zustand der Geräteakkus wird über zwei Messwerte überwacht: **m1** (Innenwiderstand, in 10 mΩ) und **m2** (Selbstentladung in % je Tag). Eine künstliche Intelligenz soll aus den Messwerten ableiten, ob ein Akku **gut** oder **schlecht** ist. Folgende Trainingsdaten stehen zur Verfügung (Auszug):

| m1 | m2 | Zustand |
|---|---|---|
| 4,5 | 1,2 | gut |
| 4,8 | 1,5 | gut |
| 5,0 | 1,0 | gut |
| 5,3 | 1,6 | gut |
| 5,6 | 1,4 | gut |
| 6,0 | 1,9 | gut |
| 5,5 | 3,6 | schlecht |
| 5,9 | 4,1 | schlecht |
| 6,2 | 3,8 | schlecht |
| 6,6 | 4,5 | schlecht |
| 7,0 | 4,2 | schlecht |
| 7,4 | 4,9 | schlecht |

Die Klassifizierung soll mit einem einfachen **Perzeptron** (Neuron) erfolgen. Die Skizze des Perzeptrons zeigt von links nach rechts sechs gekennzeichnete Stellen (A bis F):

**Abbildung – Skizze des Perzeptrons**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" width="360" height="194" role="img" aria-label="Skizze eines Perzeptrons von links nach rechts: Eingang 1 und Eingänge m1 und m2 führen über die Werte w0, w1 und w2 in einen Kreis mit Summenzeichen, dann in einen Kreis mit Stufe, dann zum Wert y; von y führt ein Pfeil Fehler zurück zu den Gewichten. Sechs Stellen sind mit A bis F gekennzeichnet">
<defs><marker id="pz-pfeil" viewBox="0 0 10 10" markerWidth="9" markerHeight="9" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<line x1="76" y1="50" x2="266" y2="113" class="dg-linie" marker-end="url(#pz-pfeil)"/>
<line x1="80" y1="130" x2="262" y2="130" class="dg-linie" marker-end="url(#pz-pfeil)"/>
<line x1="80" y1="210" x2="266" y2="148" class="dg-linie" marker-end="url(#pz-pfeil)"/>
<line x1="140" y1="46" x2="140" y2="205" class="dg-linie dg-punkt dg-duenn"/>
<rect x="127" y="62" width="26" height="18" rx="4" class="dg-flaeche"/>
<text x="140" y="76" text-anchor="middle" class="dg-gross">w₀</text>
<rect x="127" y="121" width="26" height="18" rx="4" class="dg-flaeche"/>
<text x="140" y="135" text-anchor="middle" class="dg-gross">w₁</text>
<rect x="127" y="181" width="26" height="18" rx="4" class="dg-flaeche"/>
<text x="140" y="195" text-anchor="middle" class="dg-gross">w₂</text>
<circle cx="60" cy="50" r="20" class="dg-form"/>
<text x="60" y="55" text-anchor="middle" class="dg-gross dg-fett">1</text>
<circle cx="60" cy="130" r="20" class="dg-form"/>
<text x="60" y="135" text-anchor="middle" class="dg-gross dg-fett">m1</text>
<circle cx="60" cy="210" r="20" class="dg-form"/>
<text x="60" y="215" text-anchor="middle" class="dg-gross dg-fett">m2</text>
<circle cx="300" cy="130" r="38" class="dg-form"/>
<text x="300" y="135" text-anchor="middle" class="dg-gross">Σ w·x</text>
<line x1="338" y1="130" x2="372" y2="130" class="dg-linie" marker-end="url(#pz-pfeil)"/>
<circle cx="400" cy="130" r="28" class="dg-form"/>
<path d="M386,142 L386,132 L400,132 L400,118 L414,118" class="dg-linie"/>
<line x1="428" y1="130" x2="462" y2="130" class="dg-linie" marker-end="url(#pz-pfeil)"/>
<text x="478" y="136" text-anchor="middle" class="dg-gross dg-fett">y</text>
<path d="M478,148 L478,252 L190,252 L190,175" class="dg-linie-akzent dg-strich" marker-end="url(#pz-pfeil)"/>
<text x="334" y="245" text-anchor="middle" class="dg-gross dg-akzent-text">Fehler</text>
<text x="18" y="55" text-anchor="middle" class="dg-gross dg-fett dg-akzent-text">A</text>
<text x="18" y="175" text-anchor="middle" class="dg-gross dg-fett dg-akzent-text">B</text>
<text x="140" y="34" text-anchor="middle" class="dg-gross dg-fett dg-akzent-text">C</text>
<text x="300" y="76" text-anchor="middle" class="dg-gross dg-fett dg-akzent-text">D</text>
<text x="400" y="86" text-anchor="middle" class="dg-gross dg-fett dg-akzent-text">E</text>
<text x="478" y="100" text-anchor="middle" class="dg-gross dg-fett dg-akzent-text">F</text>
<line x1="30" y1="112" x2="30" y2="228" class="dg-linie dg-duenn"/>
</svg>
```

Zum Perzeptron gehört die Klasse `Perzeptron` mit den Attributen `gewichte: Double[3]` und `epochen: Integer` sowie den Methoden `Perzeptron(epochen: Integer)`, `lernen(daten: Double[][]): void` und `vorhersage(x: Double[]): Integer`. Die Trainingsdaten liegen in einem zweidimensionalen Array `daten`: Die Spalten mit Index 0 und 1 enthalten die Messwerte, die Spalte mit Index 2 das Label (1 = gut, 0 = schlecht).

**A1 (6 P):** *Beschreiben* Sie die Begriffe **künstliche Intelligenz**, **maschinelles Lernen** und **Deep Learning** und wie sie zueinander in Beziehung stehen.

**A2 (4 P):** *Beschreiben* Sie die beiden Arten maschinellen Lernens **Supervised Learning** und **Unsupervised Learning**.

**A3 (2 P):** *Beschreiben* Sie, warum mit den gegebenen Trainingsdaten eine Klassifizierung durch maschinelles Lernen möglich ist.

**A4 (3 P):** *Ordnen* Sie den Stellen A bis F der Skizze die zutreffenden Begriffe zu und *tragen* Sie die Ziffern in die Tabelle *ein*.

1 Sprungfunktion · 2 Output · 3 Gewichte · 4 Bias · 5 Nettoeingabefunktion · 6 Input

| Stelle | Ziffer |
|---|---|
| A | |
| B | |
| C | |
| D | |
| E | |
| F | |

**A5 (5 P):** *Erläutern* Sie die Funktionsweise des Perzeptrons anhand der Skizze.

**A6 (5 P):** Die Gewichte werden mit dem Perzeptron-Lernalgorithmus gelernt. Das Struktogramm der Methode `lernen(daten)` hat zehn leere Felder. Feld 2 ist der Kopf der **äußeren Schleife**, Feld 3 der Kopf der **inneren Schleife**, Feld 7 die **Bedingung einer Verzweigung**.

**Abbildung – Struktogramm der Methode `lernen(daten)` mit zehn leeren Feldern**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350" width="360" height="315" role="img" aria-label="Struktogramm der Methode lernen mit zehn leeren Feldern: nach der Anweisung e gleich 0 folgen Feld 1 und die äußere Schleife mit Feld 2 als Kopf; darin die innere Schleife mit Feld 3 als Kopf, den Feldern 4 bis 6 und der Verzweigung mit Feld 7, im Ja-Zweig die Felder 8 und 9; Feld 10 steht nach der inneren Schleife">
<rect x="10" y="10" width="380" height="30" class="dg-grau"/><text x="200" y="29" text-anchor="middle" class="dg-klein">e := 0</text>
<rect x="10" y="40" width="380" height="30" class="dg-form"/><text x="200" y="59" text-anchor="middle" class="dg-klein">Feld 1</text>
<rect x="10" y="70" width="380" height="30" class="dg-form"/><text x="200" y="89" text-anchor="middle" class="dg-klein">Feld 2</text>
<rect x="10" y="100" width="24" height="240" class="dg-form"/>
<rect x="34" y="100" width="356" height="30" class="dg-form"/><text x="212" y="119" text-anchor="middle" class="dg-klein">Feld 3</text>
<rect x="34" y="130" width="24" height="180" class="dg-form"/>
<rect x="58" y="130" width="332" height="30" class="dg-form"/><text x="224" y="149" text-anchor="middle" class="dg-klein">Feld 4</text>
<rect x="58" y="160" width="332" height="30" class="dg-form"/><text x="224" y="179" text-anchor="middle" class="dg-klein">Feld 5</text>
<rect x="58" y="190" width="332" height="30" class="dg-form"/><text x="224" y="209" text-anchor="middle" class="dg-klein">Feld 6</text>
<rect x="58" y="220" width="332" height="30" class="dg-form"/>
<line x1="58" y1="220" x2="224" y2="250" class="dg-linie"/>
<line x1="390" y1="220" x2="224" y2="250" class="dg-linie"/>
<text x="224" y="239" text-anchor="middle" class="dg-klein">Feld 7</text>
<text x="66" y="246" text-anchor="start" class="dg-klein dg-leise">Ja</text>
<text x="382" y="246" text-anchor="end" class="dg-klein dg-leise">Nein</text>
<rect x="58" y="250" width="166" height="30" class="dg-form"/><text x="141" y="269" text-anchor="middle" class="dg-klein">Feld 8</text>
<rect x="58" y="280" width="166" height="30" class="dg-form"/><text x="141" y="299" text-anchor="middle" class="dg-klein">Feld 9</text>
<rect x="224" y="250" width="166" height="60" class="dg-form"/>
<rect x="34" y="310" width="356" height="30" class="dg-form"/><text x="212" y="329" text-anchor="middle" class="dg-klein">Feld 10</text>
</svg>
```

*Ordnen* Sie die folgenden Anweisungen den Feldern zu und *tragen* Sie die Ziffern in die Tabelle *ein*.

1. `fehler := soll − vorhersage(x)`
2. `für z := 0, solange z < Anzahl der Zeilen von daten, z := z + 1`
3. `gewichte[2] := gewichte[2] + fehler`
4. `e := e + 1`
5. `x := daten[z][0, 1]`
6. `gewichte := [0.0, 0.0, 0.0]`
7. `wenn fehler != 0`
8. `soll := daten[z][2]`
9. `solange e < epochen`
10. `gewichte[0, 1] := gewichte[0, 1] + (fehler * x)`

| Feld | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Anweisung | | | | | | | | | | |

## Block B – Gerätedaten in eine Datenbank überführen (26 P)

Bisher werden die technischen Daten aller vermieteten MDE-Geräte in einer CSV-Datei gepflegt. Künftig sollen sie in einer zentralen Datenbank bereitstehen.

**Auszug aus der CSV-Datei der vermieteten Geräte**

| Geraetenr | Modell | Schutzart | letzte_Wartung | Mieter | Ansprechpartner | Telefon |
|---|---|---|---|---|---|---|
| 4417-203 | ScanGo 3 | IP54 | 14.03.2025 | Hafenfest Büsum e. V. | Thomsen, Inga | 04834 555-0142 |
| 4417-388 | ScanGo 3 | IP54 | 02.09.2025 | Hafenfest Büsum e. V. | Thomsen, Inga | 04834 555-0142 |
| 5120-017 | TabPay X | IP67 | 21.11.2024 | Hafenfest Büsum e. V. | Thomsen, Inga | 04834 555-0142 |
| 6033-151 | HandLog M | IP65 | 30.06.2023 | Messe Nordlicht GmbH | Akgün, Deniz | 0431 555-0178 |
| 6033-297 | HandLog M | IP65 | 18.01.2026 | Stadtmarketing Leer UG | Voss, Henrik | 0491 555-0119 |
| 5120-244 | TabPay X | IP67 | 05.05.2026 | Stadtmarketing Leer UG | Voss, Henrik | 0491 555-0119 |

**Auszug aus der Dokumentation der Python-Klasse `Cursor` (englisch)**

> *`cursor.execute(operation, params=None)` – Executes the given SQL statement. Values can be passed separately as a tuple in `params`; in the statement each value is represented by the placeholder `%s`.*
>
> *`connection.commit()` – Makes all changes of the current transaction permanent.*

**B1 (13 P):** *Überführen* Sie den Auszug der CSV-Datei in ein relationales Datenbankmodell in der **3. Normalform**. Geben Sie die Datentypen an, kennzeichnen Sie Primärschlüssel und Fremdschlüssel und geben Sie die Beziehungen mit Kardinalitäten an.

**B2 (4 P):** Ein vorbereiteter Cursor führt SQL-Anweisungen mit gebundenen Parametern aus (**Prepared Statements**). *Erklären* Sie den Begriff und **einen** Vorteil.

**B3 (9 P):** *Ergänzen* Sie das folgende Python-Skript so, dass es eine Tabelle für die Mieter (Mieter, Ansprechpartner, Telefon) anlegt und den ersten Mieter aus dem Auszug einfügt. Denken Sie an den Primärschlüssel.

```python
import mysql.connector
verbindung = mysql.connector.connect(host="localhost", user="event",
                                     password="…", database="mde")
cursor = verbindung.cursor(prepared=True)
# Ergänzen Sie das Skript.
```

## Block C – Lagerbewegungen: REST, SQL und Kennzahlen (28 P)

Die Beschäftigten im Lager des Eventservice erfassen Lagerbewegungen mit MDE-Geräten. Die Daten werden im JSON-Format über eine REST-Schnittstelle übertragen und in einer Datenbank gespeichert, zum Beispiel:

| artikelnr | zeitpunkt | menge |
|---|---|---|
| 7 | 2026-04-01T12:41:08 | 3 |
| 7 | 2026-04-01T17:12:19 | −1 |

Die Tabelle `lagerbestand` enthält je Artikel den Lagerbestand am Ende jeder Kalenderwoche:

| artikelnr | kalenderwoche | menge |
|---|---|---|
| 1 | 1 | 14 |
| 1 | 2 | 6 |
| 1 | 3 | 10 |
| 1 | 4 | 18 |
| 1 | 5 | 7 |
| 2 | 1 | 9 |
| 2 | 2 | 12 |
| 2 | 3 | 8 |
| 2 | 4 | 11 |
| 2 | 5 | 10 |

**C1 (2 P):** *Formulieren* Sie den ersten Beispieldatensatz der Lagerbewegungen im JSON-Format.

**C2 (2 P):** *Beschreiben* Sie, wie Daten mit einem RESTful Service bearbeitet werden.

**C3 (4 P):** *Geben* Sie für jede der HTTP-Methoden GET, PUT, POST und DELETE ein Beispiel für die Verwaltung der Lagerbewegungen *an*.

**C4 (4 P):** *Formulieren* Sie eine SQL-Abfrage, die je Artikel den höchsten und den niedrigsten Lagerbestand ausgibt. Die Ergebnisspalten heißen `artikelnr`, `maximum` und `minimum`.

**C5 (7 P):** *Formulieren* Sie eine SQL-Abfrage, die je Artikel den Mittelwert und die Standardabweichung des Lagerbestands über alle vorliegenden Wochen (Grundgesamtheit) ausgibt, jeweils auf eine ganze Zahl gerundet. Die Ergebnisspalten heißen `artikelnr`, `mittelwert` und `standardabweichung`. In MySQL oder PostgreSQL können Sie `STDDEV_POP()` verwenden. Im SQLite-Editor der App stehen für die Umformung aus der Formel `AVG()`, `SQRT()` und `ROUND()` zur Verfügung.

> **Formel:** σ = √(Mittelwert der Quadrate − Quadrat des Mittelwerts)

**C6 (6 P):** *Berechnen* Sie Mittelwert und Standardabweichung des Lagerbestands von **Artikel 1** von Hand (Rechenweg angeben, Standardabweichung auf zwei Nachkommastellen) und *interpretieren* Sie das Ergebnis.

> **Formeln:**
> - Mittelwert: μ = (1 / n) · Σ x_i
> - Varianz: σ² = (1 / n) · Σ (x_i − μ)²
> - Standardabweichung: σ = √(σ²)

**C7 (3 P):** *Berechnen* Sie den Median des Lagerbestands von **Artikel 1** und *interpretieren* Sie das Ergebnis.

> **Formel:** Median = mittlerer Wert der sortierten Werte (bei ungerader Anzahl)

## Block D – Lagerdaten für eine Analyse aufbereiten (21 P)

Die Lagerverwaltung soll mithilfe einer Datenanalyse verbessert werden. Die Beschäftigten im Lager klagen über lange Wege: Einige Regalfächer sind überfüllt, andere kaum genutzt. Für die Analyse liegt folgende, teilweise aufbereitete Tabelle vor. Die Regale werden **nur einmal je Woche** neu befüllt.

| Zeile | Artikel-ID | Halle | Regal | Fach | Ø Entnahmen je Woche | Max. Entnahmen je Woche | Fachkapazität |
|---|---|---|---|---|---|---|---|
| 1 | 11 | 1 | 2 | 4 | 182,4 | 240 | null |
| 2 | 11 | 1 | 5 | 1 | 96,5 | 120 | 150 |
| 3 | 11 | 1 | 5 | 1 | 96,5 | 120 | 15 |
| 4 | 12 | 1 | 5 | 1 | null | null | 300 |
| 5 | 12 | 1 | 3 | 2 | 640,8 | 410 | 400 |
| 6 | 13 | 2 | 1 | 6 | −8 | 220 | 250 |
| 7 | 13 | 2 | 1 | 7 | 190 | 220 | 250 |
| 8 | 14 | 2 | 4 | null | 35,5 | 48 | 500 |

**D1 (3 P):** *Nennen* Sie **drei** wichtige Schritte der Datenaufbereitung.

**D2 (8 P):** *Beschreiben* Sie **vier** Probleme, die sich der Tabelle entnehmen lassen, jeweils mit einem Beispiel.

**D3 (6 P):** *Formulieren* Sie anhand der Beispieldaten **drei** begründete Vorschläge, wie mit den problematischen Daten umgegangen werden kann.

**D4 (4 P):** Um die Wege zu verbessern, sollen die Laufwege der Beschäftigten im Lager aufgezeichnet werden. *Beschreiben* Sie **zwei** Aspekte, die aus datenschutzrechtlicher Sicht zu beachten sind.

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich beschreibe künstliche Intelligenz, maschinelles Lernen und Deep Learning als ineinanderliegende Begriffe.
- [ ] Ich unterscheide überwachtes und unüberwachtes Lernen und begründe, wann eine Klassifikation möglich ist.
- [ ] Ich benenne die Teile eines Perzeptrons und erläutere seine Funktionsweise einschließlich der Fehlerrückführung.
- [ ] Ich ordne die Anweisungen des Perzeptron-Lernalgorithmus einem Struktogramm zu.
- [ ] Ich überführe einen CSV-Auszug in ein relationales Modell in 3. Normalform mit Datentypen, Schlüsseln und Kardinalitäten.
- [ ] Ich erkläre Prepared Statements und ergänze ein Python-Skript um CREATE TABLE, INSERT mit Platzhaltern und commit.
- [ ] Ich schreibe einen Datensatz als JSON und gebe zu GET, PUT, POST und DELETE je ein Beispiel.
- [ ] Ich formuliere Abfragen mit MIN, MAX, AVG und Standardabweichung je Gruppe – auch ohne STDDEV-Funktion.
- [ ] Ich berechne Mittelwert, Standardabweichung und Median von Hand und interpretiere sie.
- [ ] Ich erkenne widersprüchliche und fehlende Werte, schlage begründet einen Umgang vor und beachte den Datenschutz bei Bewegungsdaten.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
