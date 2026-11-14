# Deep Dive 30: Altklausur-Training Datenqualität V
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Eine weitere **Übungsvariante im Stil einer Prüfung „Sicherstellen der Datenqualität“**: vier Aufgaben mit 25, 28, 25 und 22 Punkten, 90 Minuten. Texte, Zahlen und Szenario sind neu geschrieben, Aufbau und Niveau folgen der Prüfung. Die Schwerpunkte: eine **Stichprobe mit Datenfehlern beurteilen** und das Ergebnis als **E-Mail** berichten (10 P), **k-nächste Nachbarn gegen Entscheidungsbaum** mit einer Grafik zur Wahl von k und der **euklidischen Distanz**, **ACID** und der Wechsel zu einer **Dokumentendatenbank mit JSON** (14 P für zwei JSON-Aufgaben) sowie **RAID, Zugriffsschutz in Schichten und Datensicherung**.

Typisch für diese Prüfung: Du **schreibst** viel selbst – eine E-Mail, JSON-Dokumente, eine begründete Entscheidung. Stichworte allein reichen dafür nicht.

Szenario: **Möbelhaus Nordholz GmbH**, Geschäftsbereich **Nordholz Objekt** – elektrisch höhenverstellbare Schreibtische mit Wartungsvertrag.

---

# Teil 1 – So ist die Klausur aufgebaut

| Aufgabe | Inhalt | Punkte |
|---|---|---|
| 1 | ETL anhand eines englischen Textes, Probleme in einer Stichprobe, Validierung und Verifizierung, E-Mail mit Einschätzung und Maßnahmen | 25 |
| 2 | kNN und ID3 erklären und auswählen, Einfluss von k, Kategorien aufbereiten, euklidische Distanz berechnen | 28 |
| 3 | ACID, Begriffe relational ↔ dokumentenorientiert, Tabellenzeilen als JSON, Dokumente einbetten | 25 |
| 4 | RAID-Level, Auswahl, Schutzmaßnahmen je Ebene, Backupstrategie | 22 |

---

# Teil 2 – Eine Stichprobe beurteilen

## 2.1 ETL in drei Sätzen

- **Extract:** Daten aus einer oder mehreren Quellen lesen (Sensoren, CSV-Dateien, Datenbanken).
- **Transform:** bereinigen und vereinheitlichen – Dubletten entfernen, Einheiten und Formate angleichen, fehlende Werte behandeln, Schlüssel zuordnen.
- **Load:** die aufbereiteten Daten in das Zielsystem schreiben (Data Warehouse, Analysedatenbank).

## 2.2 Fehlerarten, die in Stichproben versteckt sind

| Fehlerart | Woran erkennst du sie? | Dimension |
|---|---|---|
| **Dublette** | zwei identische Zeilen | Eindeutigkeit |
| **Formatfehler** | Kennung ohne das übliche Präfix, Datum in anderer Schreibweise | Gültigkeit |
| **Fehlender Wert** | `null`, leeres Feld | Vollständigkeit |
| **Einheitenfehler** | ein Wert in ganz anderer Größenordnung als die übrigen (Kelvin zwischen °C) | Konsistenz |
| **Kommafehler / Ausreißer** | Faktor 10 oder 100 neben sonst engen Werten | Korrektheit |

**Konkret** heißt: Zeile und Wert nennen („Zeile 7: Kennung `51724` ohne Buchstabe“), nicht nur „Formatfehler“.

## 2.3 Validierung und Verifizierung

| | Datenvalidierung | Datenverifizierung |
|---|---|---|
| **Frage** | Sind die Daten **zulässig**? | Sind die Daten **richtig**? |
| **Prüft gegen** | Regeln: Datentyp, Format, Wertebereich, Pflichtfeld | die Quelle oder die Wirklichkeit |
| **Typisches Mittel** | Constraint, Prüfregel beim Import | Abgleich mit dem Messgerät, Doppelerfassung, Prüfsumme |
| **Grenze** | ein zulässiger Wert kann trotzdem falsch sein | aufwendig, oft nur in Stichproben möglich |

> ❓ **Prüferfrage:** Ein Messwert liegt im erlaubten Bereich. Warum kann er trotzdem falsch sein – und wie finden Sie das heraus?
> *Die Validierung prüft nur Regeln, nicht die Wirklichkeit: 44,9 °C ist zulässig, auch wenn der Sensor 49,4 °C gemessen hat. Das zeigt erst die Verifizierung, also der Abgleich mit der Quelle – dem Messprotokoll des Geräts oder einer zweiten Messung.*

## 2.4 Eine fachliche E-Mail schreiben

Anrede → **Ergebnis in einem Satz** → Einschätzungen mit Beleg aus den Daten → Maßnahmen (erst bereinigen, dann vorbeugen) → Angebot für das weitere Vorgehen → Gruß. Sachlich, in ganzen Sätzen, ohne Fachjargon, den die Empfängerin nicht kennt.

---

# Teil 3 – kNN oder Entscheidungsbaum?

## 3.1 Die beiden Verfahren

| | k-nächste Nachbarn (kNN) | Entscheidungsbaum (ID3) |
|---|---|---|
| **Idee** | Ein neuer Fall erhält die Klasse, die unter seinen **k ähnlichsten** bekannten Fällen am häufigsten ist | Die Daten werden schrittweise nach dem Merkmal mit dem **größten Informationsgewinn** geteilt, bis die Blätter möglichst rein sind |
| **Training** | keines – alle Daten werden gespeichert („lazy learning“) | Baum wird einmal aufgebaut |
| **Vorhersage** | langsam bei vielen Daten (Abstand zu allen Fällen) | schnell (wenige Abfragen) |
| **Merkmale** | numerisch, müssen **skaliert** werden | kategorial; Zahlen werden in Klassen eingeteilt |
| **Nachvollziehbarkeit** | gering („ähnelt diesen Fällen“) | hoch – Regeln sind lesbar |

## 3.2 Die Wahl von k

- **k zu klein** (k = 1): Ein einzelner Ausreißer entscheidet – Überanpassung.
- **k zu groß:** Die häufigere Klasse gewinnt fast immer – Unteranpassung.
- **Ungerade** wählen, damit bei zwei Klassen kein Gleichstand entsteht.
- Den besten Wert **mit Validierungsdaten ermitteln** (mehrere k ausprobieren, z. B. per Kreuzvalidierung); Faustregel als Startwert: k ≈ √n.

## 3.3 Daten für kNN aufbereiten

kNN rechnet mit **Abständen** – deshalb müssen alle Merkmale **Zahlen** sein und eine **vergleichbare Größenordnung** haben:

1. **Kategorien kodieren:** geordnete Stufen als Zahlen (niedrig = 1, mittel = 2, hoch = 3), ungeordnete Kategorien per One-Hot-Kodierung.
2. **Skalieren:** z. B. Min-Max-Normalisierung auf 0 bis 1. Sonst bestimmt das Merkmal mit den größten Zahlen (Drehzahl in Tausenden) den Abstand allein.

## 3.4 Euklidische Distanz

Für zwei Fälle p und q mit n Merkmalen: Differenz je Merkmal bilden, quadrieren, addieren, Wurzel ziehen.

$d(p, q) = \sqrt{\sum_{i=1}^{n} (q_i - p_i)^2}$

Beispiel mit p = (2; 5; 1) und q = (5; 9; 1): $\sqrt{(5-2)^2 + (9-5)^2 + (1-1)^2} = \sqrt{25}$ = **5**

---

# Teil 4 – ACID und Dokumentendatenbank

## 4.1 ACID

| Eigenschaft | Bedeutung |
|---|---|
| **Atomicity** (Atomarität) | Eine Transaktion wird **ganz oder gar nicht** ausgeführt; bei einem Fehler wird alles zurückgerollt |
| **Consistency** (Konsistenz) | Die Datenbank geht von einem gültigen Zustand in den nächsten – alle Integritätsregeln gelten vorher und nachher |
| **Isolation** | Gleichzeitig laufende Transaktionen **beeinflussen sich nicht**; jede sieht die Daten, als liefe sie allein |
| **Durability** (Dauerhaftigkeit) | Nach dem Commit bleiben die Änderungen erhalten – auch bei Stromausfall oder Absturz |

## 4.2 Relational und dokumentenorientiert

| Relationale Datenbank | Dokumentendatenbank |
|---|---|
| Datenbank | Datenbank |
| Tabelle | Collection |
| Datensatz (Zeile) | Dokument |
| Spalte | Feld |

## 4.3 JSON

- Ein **Objekt** steht in `{ }` und besteht aus `"name": wert`-Paaren, getrennt durch Kommas.
- Ein **Array** steht in `[ ]` und enthält Werte oder Objekte, getrennt durch Kommas.
- **Text** in doppelten Anführungszeichen, **Zahlen** und `true`/`false`/`null` ohne.
- Nach dem letzten Element steht **kein** Komma.

**Einbetten statt verweisen:** Werden zwei Dinge fast immer gemeinsam gelesen und ist die Anzahl der Unterelemente begrenzt, speichert man sie als **Array im übergeordneten Dokument**. Der Fremdschlüssel entfällt dann – die Zugehörigkeit ergibt sich aus der Schachtelung.

---

# Teil 5 – RAID, Zugriffsschutz, Datensicherung

## 5.1 Gängige RAID-Level

| Level | Prinzip | Vorteil | Nachteil |
|---|---|---|---|
| **RAID 0** | Daten werden auf mehrere Platten verteilt (Striping) | hohe Geschwindigkeit, volle Kapazität | **keine** Ausfallsicherheit – fällt eine Platte aus, ist alles verloren |
| **RAID 1** | Daten werden gespiegelt | eine Platte darf ausfallen, einfache Wiederherstellung | nur die Hälfte der Kapazität nutzbar |
| **RAID 5** | Striping mit verteilter Parität, mindestens drei Platten | eine Platte darf ausfallen, gute Kapazitätsausnutzung | langsamer beim Schreiben, lange Wiederherstellung |
| **RAID 6** | wie RAID 5 mit doppelter Parität, mindestens vier Platten | zwei Platten dürfen ausfallen | noch langsamer beim Schreiben, zwei Platten Kapazität weg |
| **RAID 10** | gespiegelte Paare, darüber Striping, mindestens vier Platten | schnell **und** ausfallsicher | nur die Hälfte der Kapazität nutzbar |

**RAID ersetzt keine Datensicherung:** Es schützt vor dem Ausfall einer Platte, nicht vor Löschen, Schadsoftware oder Feuer.

## 5.2 Schutz in Schichten

| Ebene | Maßnahme |
|---|---|
| Anwendung | Anmeldung mit Rollen und Rechten, Prepared Statements gegen SQL-Injection |
| Transport | verschlüsselte Verbindung (TLS) zwischen Anwendung und Datenbank |
| Datenbankdienst | eigene Datenbankbenutzer mit minimalen Rechten, starke Passwörter, Protokollierung |
| Server | Firewall, gehärtetes Betriebssystem, Updates, Zutrittsschutz zum Serverraum |
| Festplatte | Verschlüsselung der Datenträger |

## 5.3 Backupstrategie

**Vollsicherung** (alles) in größeren Abständen, dazwischen **inkrementell** (Änderungen seit der letzten Sicherung – klein und schnell, Wiederherstellung braucht die ganze Kette) oder **differenziell** (Änderungen seit der letzten Vollsicherung – größer, Wiederherstellung braucht nur zwei Stände). Für Datenbanken mit laufenden Änderungen zusätzlich das **Transaktionsprotokoll** sichern – damit lässt sich ein Stand zu einem beliebigen Zeitpunkt wiederherstellen.

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Probleme der Stichprobe **allgemein** benannt („fehlerhafte Werte“) statt mit Zeile und Wert.
2. **Validierung und Verifizierung** gleichgesetzt.
3. E-Mail **ohne Maßnahmen** oder nur als Stichwortliste.
4. kNN: **gerades k** oder die Begründung „je größer, desto besser“.
5. Klasse und Zahlen **ungeskaliert** in den Abstand gegeben.
6. Bei der Distanz die **Wurzel vergessen** oder Differenzen nicht quadriert.
7. JSON: Zahlen in Anführungszeichen, Komma nach dem letzten Element, eckige und geschweifte Klammern vertauscht.
8. **RAID als Backup** bezeichnet.

---

# Übungsklausur Datenqualität V im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Antworte stichwortartig, sofern nicht ausdrücklich ein Text (E-Mail) oder Code verlangt ist, und gib bei Berechnungen den Rechenweg an.

## Ausgangssituation

Der Geschäftsbereich **Nordholz Objekt** der **Möbelhaus Nordholz GmbH** stattet Büros mit elektrisch höhenverstellbaren Schreibtischen aus. Die Tische bleiben Eigentum von Nordholz Objekt; über Service-Level-Agreements werden Verfügbarkeit und Funktion zugesichert. In jedem Tisch erfasst eine Steuerung Betriebsdaten der Hubantriebe. Daraus soll abgeleitet werden, welche Antriebe gewartet werden müssen, bevor sie ausfallen. Sie arbeiten in der IT-Abteilung.

## Block A – Datenqualität der Antriebsdaten (25 P)

Die Leiterin des Kundendienstes, **Frau Marquardt**, schreibt Ihnen: Die Betriebsdaten der Hubantriebe werden bei den Kunden erhoben und in einer CSV-Datei zusammengeführt, um die Ausfallwahrscheinlichkeit einzelner Antriebe zu ermitteln. Die Daten scheinen häufig fehlerhaft zu sein. Sie bittet um eine Prüfung der Datenqualität.

**Stichprobe aus den erhobenen Daten**

| Antriebs-ID | Klasse | Motortemperatur [°C] | Drehzahl [1/min] | Drehmoment [Nm] | Laufzeit [min] | Spannung [V] |
|---|---|---|---|---|---|---|
| K20311 | K | 45,2 | 2810 | 1,9 | 212 | 24,1 |
| S51720 | S | 318,3 | 2760 | 2,3 | 215 | 24,0 |
| S51721 | S | 45,1 | 2795 | 2,1 | 219 | 24,1 |
| S51721 | S | 45,1 | 2795 | 2,1 | 219 | 24,1 |
| K20314 | K | 45,0 | 2840 | 1,8 | 223 | 23,9 |
| K20315 | K | 45,0 | 2905 | 1,7 | 226 | 23,8 |
| 51724 | S | 44,9 | 3110 | 1,2 | 230 | 24,0 |
| S51725 | S | 44,9 | 2870 | 1,8 | null | 24,0 |
| P30882 | P | 44,9 | 3240 | 0,9 | 236 | 24,1 |
| K20319 | K | 44,8 | 2820 | 2,0 | 241 | 241 |

Erläuterungen: Klasse des Antriebs: S = Standard, K = Komfort, P = Premium; die Antriebs-ID beginnt mit dem Buchstaben der Klasse. 45 °C entsprechen rund 318 Kelvin. Die Antriebe arbeiten mit 24 V Nennspannung.

**A1 (6 P):** Die Daten werden in einem ETL-Prozess aufbereitet. *Beschreiben* Sie die drei Schritte mithilfe des folgenden englischen Textes.

> *ETL stands for extract, transform, load. Data is first read from one or several source systems, then cleaned and converted into a common structure, and finally written to a target system such as a data warehouse, where it is available for analysis.*

**A2 (3 P):** *Prüfen* Sie die Stichprobe auf Probleme der Datenqualität. *Nennen* Sie **drei** konkrete Probleme aus der Stichprobe.

**A3 (6 P):** *Beschreiben* Sie **Datenvalidierung** und **Datenverifizierung**. *Nennen* Sie für jede der beiden Arten ein Beispiel aus der Stichprobe.

**A4 (10 P):** *Formulieren* Sie eine E-Mail an Frau Marquardt mit **zwei** Einschätzungen zur Datenqualität der Stichprobe. Gehen Sie dabei auf Ihre Erkenntnisse aus A2 ein und *beschreiben* Sie **zwei** Maßnahmen, mit denen die erkannten Probleme bereinigt und die Datenqualität verbessert werden können.

## Block B – Ausfälle vorhersagen (28 P)

Sie sollen die Ausfälle der Hubantriebe analysieren, damit auffällige Antriebe künftig gewartet werden, bevor sie ausfallen. Die Daten liegen als CSV-Datei mit 8.000 Datensätzen vor. In der Spalte „Ausfall“ bedeutet 1, dass der Antrieb ausgefallen ist, 0 bedeutet keinen Ausfall.

**Ausschnitt aus der CSV-Datei**

| Antriebs-ID | Klasse | Motortemperatur [°C] | Drehzahl [1/min] | Drehmoment [Nm] | Laufzeit [min] | Ausfall |
|---|---|---|---|---|---|---|
| K20311 | K | 45,2 | 2810 | 1,9 | 212 | 0 |
| S51720 | S | 45,2 | 2760 | 2,3 | 215 | 0 |
| S51721 | S | 45,1 | 2795 | 2,1 | 219 | 0 |
| K20314 | K | 45,0 | 2840 | 1,8 | 223 | 0 |
| P30882 | P | 44,9 | 3240 | 0,9 | 236 | 0 |
| S51731 | S | 45,0 | 2620 | 2,6 | 244 | 1 |
| S51732 | S | 44,9 | 2700 | 2,5 | 247 | 1 |
| K20326 | K | 45,1 | 2815 | 2,0 | 4 | 0 |
| S51739 | S | 45,2 | 2650 | 2,7 | 21 | 1 |
| P30890 | P | 45,0 | 3010 | 1,4 | 26 | 0 |

**Abbildung – Drehmoment und Drehzahl einer Stichprobe mit einem noch nicht klassifizierten Antrieb**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 380" width="640" height="380" role="img" aria-label="Streudiagramm Drehmoment über Drehzahl: ausgefallene Antriebe als Rauten, intakte als Quadrate, der unbekannte Antrieb als Dreieck in der Mitte von drei Kreisen">
<line x1="60" y1="330" x2="620" y2="330" class="dg-linie"/>
<line x1="60" y1="330" x2="60" y2="30" class="dg-linie"/>
<line x1="70" y1="330" x2="70" y2="335" class="dg-linie dg-duenn"/>
<text x="70" y="348" text-anchor="middle" class="dg-klein dg-leise">2.600</text>
<line x1="170" y1="330" x2="170" y2="335" class="dg-linie dg-duenn"/>
<text x="170" y="348" text-anchor="middle" class="dg-klein dg-leise">2.700</text>
<line x1="270" y1="330" x2="270" y2="335" class="dg-linie dg-duenn"/>
<text x="270" y="348" text-anchor="middle" class="dg-klein dg-leise">2.800</text>
<line x1="370" y1="330" x2="370" y2="335" class="dg-linie dg-duenn"/>
<text x="370" y="348" text-anchor="middle" class="dg-klein dg-leise">2.900</text>
<line x1="470" y1="330" x2="470" y2="335" class="dg-linie dg-duenn"/>
<text x="470" y="348" text-anchor="middle" class="dg-klein dg-leise">3.000</text>
<line x1="570" y1="330" x2="570" y2="335" class="dg-linie dg-duenn"/>
<text x="570" y="348" text-anchor="middle" class="dg-klein dg-leise">3.100</text>
<line x1="55" y1="310" x2="60" y2="310" class="dg-linie dg-duenn"/>
<text x="48" y="314" text-anchor="end" class="dg-klein dg-leise">1,2</text>
<line x1="55" y1="230" x2="60" y2="230" class="dg-linie dg-duenn"/>
<text x="48" y="234" text-anchor="end" class="dg-klein dg-leise">1,6</text>
<line x1="55" y1="150" x2="60" y2="150" class="dg-linie dg-duenn"/>
<text x="48" y="154" text-anchor="end" class="dg-klein dg-leise">2,0</text>
<line x1="55" y1="70" x2="60" y2="70" class="dg-linie dg-duenn"/>
<text x="48" y="74" text-anchor="end" class="dg-klein dg-leise">2,4</text>
<text x="620" y="368" text-anchor="end" class="dg-klein">Drehzahl in 1/min</text>
<text x="14" y="20" text-anchor="start" class="dg-klein">Drehmoment in Nm</text>
<circle cx="320" cy="170" r="40" class="dg-linie"/>
<circle cx="320" cy="170" r="80" class="dg-linie"/>
<circle cx="320" cy="170" r="120" class="dg-linie"/>
<polygon points="330,188 336,195 330,202 324,195" class="dg-voll"/>
<polygon points="335,108 341,115 335,122 329,115" class="dg-voll"/>
<polygon points="268,93 274,100 268,107 262,100" class="dg-voll"/>
<polygon points="250,228 256,235 250,242 244,235" class="dg-voll"/>
<polygon points="305,258 311,265 305,272 299,265" class="dg-voll"/>
<polygon points="360,255 366,262 360,269 354,262" class="dg-voll"/>
<polygon points="408,128 414,135 408,142 402,135" class="dg-voll"/>
<polygon points="100,83 106,90 100,97 94,90" class="dg-voll"/>
<polygon points="500,73 506,80 500,87 494,80" class="dg-voll"/>
<polygon points="160,53 166,60 160,67 154,60" class="dg-voll"/>
<polygon points="560,113 566,120 560,127 554,120" class="dg-voll"/>
<polygon points="170,143 176,150 170,157 164,150" class="dg-voll"/>
<polygon points="470,198 476,205 470,212 464,205" class="dg-voll"/>
<rect x="265" y="175" width="10" height="10" class="dg-form"/>
<rect x="363" y="183" width="10" height="10" class="dg-form"/>
<rect x="285" y="210" width="10" height="10" class="dg-form"/>
<rect x="378" y="238" width="10" height="10" class="dg-form"/>
<rect x="115" y="255" width="10" height="10" class="dg-form"/>
<rect x="145" y="235" width="10" height="10" class="dg-form"/>
<rect x="475" y="265" width="10" height="10" class="dg-form"/>
<rect x="515" y="235" width="10" height="10" class="dg-form"/>
<rect x="555" y="275" width="10" height="10" class="dg-form"/>
<rect x="215" y="285" width="10" height="10" class="dg-form"/>
<rect x="445" y="295" width="10" height="10" class="dg-form"/>
<rect x="585" y="195" width="10" height="10" class="dg-form"/>
<rect x="85" y="175" width="10" height="10" class="dg-form"/>
<rect x="525" y="155" width="10" height="10" class="dg-form"/>
<rect x="175" y="232" width="10" height="10" class="dg-form"/>
<polygon points="320,159 330,178 310,178" class="dg-akzent"/>
<polygon points="442,22 448,29 442,36 436,29" class="dg-voll"/>
<text x="454" y="33" text-anchor="start" class="dg-klein">Ausfall</text>
<rect x="505" y="24" width="10" height="10" class="dg-form"/>
<text x="521" y="33" text-anchor="start" class="dg-klein">kein Ausfall</text>
<polygon points="442,43 450,57 434,57" class="dg-akzent"/>
<text x="454" y="56" text-anchor="start" class="dg-klein">unbekannter Antrieb</text>
</svg>
```

Um den unbekannten Antrieb sind drei Kreise gezogen. Die Auszählung der Abbildung:

| Kreis | Nachbarn im Kreis | davon Ausfall | davon kein Ausfall |
|---|---|---|---|
| innen | 1 | 1 | 0 |
| Mitte | 5 | 2 | 3 |
| außen | 11 | 7 | 4 |

**B1 (6 P):** Zur Wahl stehen der Algorithmus **k-nächste Nachbarn (kNN)** und ein Entscheidungsbaum nach dem **ID3**-Algorithmus. *Erklären* Sie kurz beide Algorithmen.

**B2 (5 P):** *Entscheiden* Sie sich für einen der beiden Algorithmen und *begründen* Sie Ihre Entscheidung mit **zwei** Argumenten.

**B3 (1 P):** *Beurteilen* Sie anhand der Abbildung, ob der unbekannte Antrieb in nächster Zeit gewartet werden sollte.

**B4 (4 P):** Die Kreise um den unbekannten Antrieb sollen die Entscheidung unterstützen. *Erläutern* Sie, inwiefern die Größe des Parameters k für die Entscheidung ausschlaggebend ist.

**B5 (4 P):** *Nennen* Sie **zwei** allgemein sinnvolle Kriterien für die Wahl von k und *begründen* Sie sie.

**B6 (4 P):** Die Klasse der Antriebe liegt als Buchstabe vor (S, K, P). *Erklären* Sie an diesem Beispiel, wie die Daten aufbereitet werden müssen, damit der kNN-Algorithmus sie verwenden kann.

**B7 (4 P):** Die Abbildung berücksichtigt nur zwei Merkmale. Gegeben sind die Daten eines bereits klassifizierten und eines zu klassifizierenden Antriebs. *Berechnen* Sie die euklidische Distanz über **alle** Merkmale; die Klasse geht bei gleicher Klasse mit der Differenz 0 ein. Der Rechenweg ist anzugeben, das Ergebnis auf zwei Nachkommastellen zu runden.

| Antrieb | Klasse | Motortemperatur [°C] | Drehzahl [1/min] | Drehmoment [Nm] | Laufzeit [min] | Ausfall |
|---|---|---|---|---|---|---|
| bekannt | K | 46,5 | 2840 | 2,1 | 260 | 0 |
| zu klassifizieren | K | 43,5 | 2800 | 1,7 | 248 | – |

> **Formel:** d(p, q) = √(Σ (q_i − p_i)²)

## Block C – Von der relationalen zur Dokumentendatenbank (25 P)

Die Informationen über die Tische und ihre Sensoren liegen bisher zentral in einer relationalen Datenbank. Um die Ausfallsicherheit zu erhöhen, sollen sie künftig verteilt gespeichert werden: Jeder Kundenstandort erhält eine Teildatenbank in einem verteilten, **dokumentenorientierten** Datenbanksystem, das JSON-Dokumente verwendet.

**Tabelle `tisch`**

| id | modell | baujahr |
|---|---|---|
| 1 | LIFT-K2 | 2024 |
| … | … | … |

**Tabelle `sensor`**

| id | tisch_id | art | einheit |
|---|---|---|---|
| 1 | 1 | temperatur | C |
| 2 | 1 | strom | A |
| … | … | … | … |

**JSON-Syntax (Auszug):** Ein Objekt steht in geschweiften Klammern und enthält Paare der Form `"attributname": wert`, getrennt durch Kommas. Ein Array steht in eckigen Klammern und enthält Werte oder Objekte, getrennt durch Kommas. Werte sind Text (in Anführungszeichen), Zahl, `true`/`false`, `null`, Objekt oder Array.

**C1 (8 P):** Für Transaktionen in relationalen Datenbankmanagementsystemen sind die vier Eigenschaften des Akronyms **ACID** definiert. *Beschreiben* Sie die Bedeutung von Atomicity, Consistency, Isolation und Durability.

**C2 (3 P):** *Ordnen* Sie den Begriffen der relationalen Datenbank die passenden Begriffe der Dokumentendatenbank zu und *tragen* Sie sie in die Tabelle *ein*. Zur Auswahl stehen: Collection · Feld · Datenbank · Dokument.

| Relationale Datenbank | Dokumentendatenbank |
|---|---|
| Datenbank | |
| Tabelle | |
| Datensatz (Zeile) | |
| Spalte | |

**C3 (7 P):** *Überführen* Sie die beiden dargestellten Zeilen der Tabelle `sensor` in die JavaScript Object Notation (JSON). Nutzen Sie die angegebene JSON-Syntax.

**C4 (7 P):** Auf Tisch- und Sensordaten wird fast immer gemeinsam zugegriffen, und die Anzahl der Sensoren je Tisch ist begrenzt. In solchen Fällen werden die Daten in einer Dokumentendatenbank gemeinsam gespeichert. *Ergänzen* Sie das folgende Tischdokument so, dass die beiden Sensordokumente als Array Teil des Tischdokuments sind.

```json
[
  {
    "id": 1,
    "modell": "LIFT-K2",
    "baujahr": 2024
  }
]
```

## Block D – Speicherung, Zugriffsschutz und Datensicherung (22 P)

Sie sollen die Datenbankinfrastruktur des zentralen Servers verbessern: Verfügbarkeit und Integrität der Daten müssen gewährleistet sein, und beim Ausfall einer Festplatte dürfen keine Daten verloren gehen.

**D1 (10 P):** *Nennen* und *beschreiben* Sie **zwei** gängige RAID-Level. *Nennen* Sie zu jedem der beiden RAID-Level je **einen** Vor- und **einen** Nachteil.

**D2 (4 P):** *Entscheiden* Sie, welches RAID-Level Sie mit Blick auf Datenintegrität und Performance wählen, und *begründen* Sie Ihre Entscheidung.

**D3 (5 P):** *Nennen* Sie je **eine** geeignete Maßnahme, um die Informationen der Datenbank auf den folgenden Ebenen vor fremdem Zugriff zu schützen, und *tragen* Sie sie in die Tabelle *ein*.

| Ebene | Maßnahme |
|---|---|
| Anwendung | |
| Transport zwischen Anwendung und Datenbank | |
| Datenbankdienst | |
| Server der Datenbank | |
| Festplatte im Server | |

**D4 (3 P):** Um Änderungen rückgängig machen zu können, braucht der zentrale Datenbankserver eine Backupstrategie. Sensordaten werden rund um die Uhr erhoben und gespeichert; die Sicherungen liegen auf einem eigenen Server mit ausreichend Speicherplatz. *Nennen* Sie eine geeignete Backupstrategie und *begründen* Sie Ihre Wahl.

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich beschreibe die drei Schritte des ETL-Prozesses.
- [ ] Ich finde in einer Stichprobe Dublette, Formatfehler, fehlenden Wert, Einheiten- und Kommafehler und benenne sie mit Zeile und Wert.
- [ ] Ich unterscheide Datenvalidierung und Datenverifizierung und gebe je ein Beispiel.
- [ ] Ich schreibe eine sachliche E-Mail mit Einschätzung, Beleg und Maßnahmen.
- [ ] Ich erkläre kNN und ID3 und entscheide mich begründet für eines der Verfahren.
- [ ] Ich erläutere den Einfluss von k und nenne Kriterien für seine Wahl.
- [ ] Ich bereite kategoriale Merkmale für kNN auf und berechne die euklidische Distanz über mehrere Merkmale.
- [ ] Ich beschreibe die vier ACID-Eigenschaften und ordne relationale und dokumentenorientierte Begriffe einander zu.
- [ ] Ich schreibe Tabellenzeilen als JSON und bette Dokumente als Array ein.
- [ ] Ich beschreibe RAID-Level mit Vor- und Nachteil, nenne Schutzmaßnahmen je Ebene und begründe eine Backupstrategie.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
