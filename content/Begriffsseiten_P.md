<!-- Begriffsseiten P · Stand 2026-10 -->
## P-Wert
<!-- id: p-wert · quellen: Karte DD4, DD4 1.3 · stand: 2026-10 -->

Wahrscheinlichkeit, ein mindestens so extremes Ergebnis wie das beobachtete zu erhalten, wenn die Nullhypothese (z. B. „kein Zusammenhang“) zutrifft.

### Erklärung
Der p-Wert ist das Ergebnis eines **Signifikanztests**. Man prüft damit, ob ein gemessener Effekt – etwa ein Korrelationskoeffizient – auch rein zufällig entstanden sein könnte. Liegt der p-Wert unter dem vorher festgelegten Signifikanzniveau (üblich: 0,05 = 5 %), wird die Nullhypothese verworfen: Zufall ist als Erklärung unwahrscheinlich. Die Schwelle 0,05 ist eine Konvention, kein Naturgesetz.

### Beispiel
Zwischen Schulungsstunden und Fehlerquote der Monteure im Möbelhaus Nordholz ergibt sich r = −0,62 mit p = 0,03. Da 0,03 < 0,05, ist der Zusammenhang signifikant – also vermutlich kein Zufall.

### Abgrenzung
Signifikanz sagt nichts über die Stärke (dafür r bzw. die Effektgröße) und nichts über Kausalität (dafür Experiment oder Wirkmechanismus).

### Prüfungsfalle
„p < 0,05, also wirken Schulungen“ ist falsch – signifikant heißt nur „vermutlich kein Zufall“; bei sehr großen Datenmengen wird zudem schon ein winziges r signifikant.

### Merksatz
Kleiner p-Wert = Zufall unwahrscheinlich – nicht: Effekt groß oder ursächlich.

Siehe auch: Nullhypothese · Signifikanz · Hypothesentest · Effektgröße · Konfidenzintervall · Scheinkorrelation · Korrelation
Mehr: Deep Dive 4, 1.3

## Pachtvertrag
<!-- id: pachtvertrag · quellen: Karte DD14, DD14 2.4 · stand: 2026-10 -->

Vertrag über die entgeltliche Überlassung einer Sache oder eines Rechts zum Gebrauch **und** zur Fruchtziehung (§ 581 BGB).

### Erklärung
„Fruchtziehung“ heißt: Der Pächter darf die Erträge der Sache behalten – die Ernte vom Acker, die Einnahmen aus einer eingerichteten Gaststätte. Genau das unterscheidet die Pacht von der Miete, bei der nur der Gebrauch überlassen wird. Im Übrigen gelten viele Mietvorschriften entsprechend.

### Beispiel
Ein Wirt pachtet die vollständig eingerichtete Kantine im Gebäude des Möbelhauses und behält die Einnahmen aus dem Mittagstisch – Pachtvertrag. Mietet das Möbelhaus dagegen eine leere Lagerhalle, ist das ein Mietvertrag.

### Abgrenzung
| Vertrag | Überlassung | Entgelt |
|---|---|---|
| Mietvertrag | Gebrauch | ja |
| Pachtvertrag | Gebrauch und Fruchtziehung | ja |
| Leihvertrag | Gebrauch | nein |

### Prüfungsfalle
Eine Gaststätte oder ein Ackerland „mieten“ – in MC-Fragen ist das Stichwort Erträge bzw. Fruchtziehung der Hinweis auf Pacht.

### Merksatz
Miete = nutzen, Pacht = nutzen und ernten.

Siehe auch: Mietvertrag · Leihvertrag · Darlehensvertrag
Mehr: Deep Dive 14, 2.4

## Paginierung
<!-- id: paginierung · quellen: Karte DD15, DD15 3.3 · stand: 2026-10 -->

Auslieferung großer Ergebnislisten einer Schnittstelle in Seiten fester Größe statt auf einmal, z. B. über `?seite=2&limit=50`.

### Erklärung
Ohne Paginierung liefert ein Listen-Endpunkt irgendwann Hunderttausende Datensätze in einer Antwort – das belastet Server, Netz und Client und führt zu Zeitüberschreitungen. Der Client fordert deshalb seitenweise an, meist zusammen mit Filtern über Query-Parameter. Neben Seitennummer und Limit (Offset-Paginierung) gibt es die Cursor-Paginierung, bei der die Antwort einen Verweis auf die nächste Seite mitliefert.

### Beispiel
`GET /reparaturauftraege?status=offen&seite=2&limit=50` liefert die Aufträge 51 bis 100. Bei 120.000 offenen Aufträgen ergibt das $120.000 / 50 = 2.400$ Seiten.

### Abgrenzung
**Rate Limiting** begrenzt die Zahl der Anfragen je Zeitraum (Statuscode 429), Paginierung die Größe einer einzelnen Antwort. Beide schützen die API vor Überlastung.

### Merksatz
Große Listen nie am Stück – Filter plus Seite plus Limit.

Siehe auch: REST · GET · Rate Limiting · Datenminimierung
Mehr: Deep Dive 15, 3.3

## Parallelschaltung
<!-- id: parallelschaltung · quellen: Karte DD16, DD16 4.3 · stand: 2026-10 -->

Redundante Anordnung von Komponenten, bei der das System läuft, solange mindestens eine Komponente verfügbar ist: $V_{ges} = 1 - (1 - V_1) \cdot (1 - V_2)$.

### Erklärung
Bei der Parallelschaltung multipliziert man nicht die Verfügbarkeiten, sondern die **Ausfallwahrscheinlichkeiten**: Das System fällt nur aus, wenn alle Komponenten gleichzeitig ausfallen. Die Gesamtverfügbarkeit ist deshalb höher als die jeder einzelnen Komponente. Redundanz lohnt sich an der schwächsten Stelle, besonders bei einem Single Point of Failure.

### Beispiel
Die Datenbank des Reportings (99 %) wird gespiegelt:
$V_{DB} = 1 - (1 - 0{,}99)^2 = 1 - 0{,}0001 = 0{,}9999$ = 99,99 \%.
Mit dem Webserver (99,9 %) in Reihe: $0{,}999 \cdot 0{,}9999 = 0{,}9989$ = 99,89 \%.

### Abgrenzung
| Schaltung | Rechnung | Ergebnis |
|---|---|---|
| Reihenschaltung | Verfügbarkeiten multiplizieren | schlechter als die schwächste Komponente |
| Parallelschaltung | Ausfallwahrscheinlichkeiten multiplizieren, von 1 abziehen | besser als die beste Komponente |

### Prüfungsfalle
Bei Parallelschaltung die Verfügbarkeiten multiplizieren – dann sinkt das Ergebnis, obwohl Redundanz es erhöhen müsste.

### Merksatz
Parallel: erst die Ausfälle multiplizieren, dann von 1 abziehen.

Siehe auch: Reihenschaltung · Verfügbarkeit · Single Point of Failure
Mehr: Deep Dive 16, 4.3

## Pareto-Analyse
<!-- id: pareto-analyse · quellen: Karte DD5, DD5 4.1, DD5 6.5 · stand: 2026-10 -->

Methode der Schwachstellenanalyse, die Ursachen nach Häufigkeit absteigend sortiert und kumuliert, um die wenigen Ursachen mit der größten Wirkung zu finden.

### Erklärung
Vorgehen: Fälle je Ursache zählen, absteigend sortieren, Anteile berechnen und kumulieren. Die Ursachen bis etwa 80 % kumuliertem Anteil sind die „wenigen wichtigen“ – dort setzt die Optimierung an. Dargestellt wird das Ergebnis im Pareto-Diagramm. Die Analyse beruht auf dem Pareto-Prinzip (80/20-Regel).

### Beispiel
50 Reklamationen im Möbelhaus: Transportschaden 18 (36 %), Montagefehler 15 (30 %), Falschlieferung 9 (18 %), Materialfehler 6 (12 %), Sonstiges 2 (4 %). Kumuliert: 36 % → 66 % → 84 %. Zwei von fünf Gründen erklären zwei Drittel aller Fälle.

### Abgrenzung
| Methode | Frage |
|---|---|
| Pareto-Analyse | Welche Ursachen sind am **häufigsten**? |
| ABC-Analyse | Welche Objekte haben den größten **Wertanteil**? |
| Ishikawa-Diagramm | Welche Ursachen **kommen** überhaupt in Frage? |

### Prüfungsfalle
Nicht absteigend sortieren – dann ist die kumulierte Linie wertlos.

### Merksatz
Sortieren, kumulieren, bei 80 % den Schnitt machen.

Siehe auch: Pareto-Prinzip · Pareto-Diagramm · ABC-Analyse · Ishikawa-Diagramm
Mehr: Deep Dive 5, 4.1 · Deep Dive 5, 6.5

## Pareto-Diagramm
<!-- id: pareto-diagramm · quellen: DD3 Teil 2, DD17 6.8 · stand: 2026-10 -->

Diagramm mit absteigend sortierten Säulen je Kategorie und einer kumulierten Prozentlinie; zeigt die wenigen Ursachen mit der größten Wirkung.

### Erklärung
Die Säulen (linke Achse) zeigen die absolute Häufigkeit, die Linie (rechte Achse, 0–100 %) den kumulierten Anteil. Wo die Linie die 80 % erreicht, liegen links davon die wichtigen Kategorien. Das Diagramm ist die grafische Form der Pareto-Analyse.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 170" width="320" height="170" role="img" aria-label="Pareto-Diagramm mit fallenden Säulen und kumulierter Linie">
<line x1="30" y1="15" x2="30" y2="140" class="dg-linie"/>
<line x1="30" y1="140" x2="290" y2="140" class="dg-linie"/>
<line x1="290" y1="15" x2="290" y2="140" class="dg-linie"/>
<rect x="38" y="68" width="40" height="72" class="dg-akzent"/>
<rect x="88" y="80" width="40" height="60" class="dg-akzent"/>
<rect x="138" y="104" width="40" height="36" class="dg-akzent"/>
<rect x="188" y="116" width="40" height="24" class="dg-akzent"/>
<rect x="238" y="132" width="40" height="8" class="dg-akzent"/>
<line x1="30" y1="40" x2="290" y2="40" class="dg-linie dg-strich dg-rot"/>
<text x="286" y="34" text-anchor="end" class="dg-klein">80 %</text>
<polyline points="58,95 108,62 158,40 208,20 258,15" class="dg-linie dg-dick"/>
<circle cx="58" cy="95" r="3" class="dg-voll"/>
<circle cx="108" cy="62" r="3" class="dg-voll"/>
<circle cx="158" cy="40" r="3" class="dg-voll"/>
<circle cx="208" cy="20" r="3" class="dg-voll"/>
<circle cx="258" cy="15" r="3" class="dg-voll"/>
<text x="160" y="160" text-anchor="middle" class="dg-klein dg-leise">Kategorien absteigend, Linie = kumulierter Anteil</text>
</svg>
```

### Beispiel
Reklamationsgründe des Möbelhauses: Transportschaden 36 %, Montagefehler 30 % (kumuliert 66 %), Falschlieferung 18 % (kumuliert 84 %).

### Abgrenzung
Ein normales Säulendiagramm ist nicht sortiert und hat keine kumulierte Linie; ein Histogramm zeigt Klassen einer metrischen Größe, keine Kategorien.

### Prüfungsfalle
Die Linie zeigt den kumulierten, nicht den einzelnen Anteil – sie steigt immer und endet bei 100 %.

### Merksatz
Säulen fallen, Linie steigt bis 100 %.

Siehe auch: Pareto-Analyse · Pareto-Prinzip · Histogramm · ABC-Analyse
Mehr: Deep Dive 3, Teil 2 · Deep Dive 17, 6.8

## Pareto-Prinzip
<!-- id: pareto-prinzip · quellen: Karte DD3, DD3 Teil 2 · stand: 2026-10 -->

80/20-Regel: Ein kleiner Teil der Ursachen erklärt den Großteil der Wirkung – Grundlage der Pareto- und der ABC-Analyse.

### Erklärung
Das Prinzip ist eine Faustregel, kein Gesetz: Die Werte 80 und 20 sind typisch, aber nicht exakt. Es lenkt Verbesserungsarbeit auf die wenigen Ursachen, Kunden oder Artikel, die am meisten bewirken. In der Praxis zeigt man es mit sortierten und kumulierten Häufigkeiten.

### Beispiel
Im Möbelhaus decken zwei von fünf Reklamationsgründen 66 % der Fälle ab; in der ABC-Analyse machen zwei von sechs Artikeln 76,7 % des Jahresverbrauchswerts aus.

### Prüfungsfalle
Exakt 80/20 erwarten – entscheidend ist die Ungleichverteilung, nicht die Zahlen.

### Merksatz
Wenige Ursachen, große Wirkung – dort zuerst ansetzen.

Siehe auch: Pareto-Analyse · Pareto-Diagramm · ABC-Analyse
Mehr: Deep Dive 3, Teil 2 · Deep Dive 5, 4.1

## Parquet
<!-- id: parqut · quellen: Karte DD15, DD15 2.4, DD8 5.3 · stand: 2026-10 -->

Binäres, spaltenorientiertes und komprimiertes Dateiformat mit eingebettetem Schema – Standard für Data Lakes und große Analysen.

### Erklärung
Parquet (Apache-Projekt) legt die Werte einer Spalte zusammen ab. Analytische Abfragen lesen nur die benötigten Spalten, und gleichartige Werte lassen sich stark komprimieren. Datentypen sind im Schema festgelegt, sodass keine Typinformation verloren geht wie bei CSV. Parquet ist nicht für Menschen lesbar und eignet sich schlecht, um einzelne Datensätze häufig zu ändern.

### Beispiel
Die Kassenbons aller Filialen liegen im Data Lake als Parquet-Dateien. Die Abfrage „Umsatz je Filiale“ liest nur die Spalten filiale und betrag statt aller 40 Spalten.

### Abgrenzung
| Format | Struktur | Lesbar | Typischer Einsatz |
|---|---|---|---|
| CSV | flach, zeilenweise | ja | Excel-Austausch |
| JSON | verschachtelt | ja | Web-APIs |
| Avro | binär, zeilenorientiert | nein | Datenströme |
| Parquet | binär, spaltenorientiert | nein | Data Lake, Analysen |

### Merksatz
Avro zum Schreiben und Übertragen, Parquet zum spaltenweisen Auswerten.

Siehe auch: Spaltenorientierte Speicherung · Avro · Data Lake · CSV
Mehr: Deep Dive 15, 2.4 · Deep Dive 8, 5.3

## Partielle Abhängigkeit
<!-- id: partielle-abhangigkeit · quellen: Karte DD2, DD2 2.1, DD2 Teil 3 · stand: 2026-10 -->

Ein Nichtschlüsselattribut hängt nur von einem Teil eines zusammengesetzten Primärschlüssels ab – ein Verstoß gegen die 2. Normalform.

Auch: Partiell abhängig

### Erklärung
Partielle Abhängigkeiten setzen einen **zusammengesetzten** Schlüssel voraus. Sie führen zu Redundanz und damit zu Änderungs-, Einfüge- und Löschanomalien. Behoben werden sie, indem man die betroffenen Attribute mit dem Schlüsselteil, von dem sie abhängen, in eine eigene Tabelle auslagert.

### Beispiel
Tabelle mit Schlüssel (bestell_id, produkt_id): bestelldatum hängt nur von bestell_id ab, bezeichnung und preis nur von produkt_id – beides partiell. menge hängt vom ganzen Schlüssel ab und bleibt. Ergebnis: bestellung, produkt und bestellposition(**bestell_id↑, produkt_id↑**, menge).

### Abgrenzung
| Abhängigkeit | Nichtschlüsselattribut hängt ab von … | verletzt |
|---|---|---|
| voll funktional | dem ganzen Schlüssel | – |
| partiell | einem Teil des Schlüssels | 2. NF |
| transitiv | einem anderen Nichtschlüsselattribut | 3. NF |

### Prüfungsfalle
Eine Tabelle mit einteiligem Primärschlüssel auf partielle Abhängigkeiten „prüfen“ – sie ist automatisch in 2. NF.

### Merksatz
Vom ganzen Schlüssel, nicht nur von einem Teil.

Siehe auch: 2. Normalform · Funktionale Abhängigkeit · Transitive Abhängigkeit · Zusammengesetzter Schlüssel
Mehr: Deep Dive 2, 2.1 · Deep Dive 2, Teil 3

## Partition Pruning
<!-- id: partition-pruning · quellen: Karte DD8, DD8 5.3 · stand: 2026-10 -->

Optimierung, bei der die Datenbank bei einem Filter auf das Partitionskriterium nur die betroffenen Partitionen liest und alle übrigen überspringt.

### Erklärung
Pruning („Zurückschneiden“) wirkt nur, wenn die Abfrage auf genau die Spalte filtert, nach der partitioniert wurde. Deshalb partitioniert man große Faktentabellen meist nach Datum: Fast jede Auswertung schränkt einen Zeitraum ein. Das spart Lesezugriffe und Laufzeit, ohne dass die Abfrage geändert werden muss.

### Beispiel
Die Faktentabelle verkauf ist nach Monat partitioniert (5 Jahre = 60 Partitionen). `WHERE verkaufsdatum >= '2026-09-01' AND verkaufsdatum < '2026-10-01'` liest nur 1 von 60 Partitionen.

### Abgrenzung
Ein **Index** findet einzelne Zeilen schnell; Pruning schließt ganze Tabellenteile aus. Beides lässt sich kombinieren.

### Prüfungsfalle
Eine Funktion um die Partitionsspalte (`WHERE YEAR(verkaufsdatum) = 2026`) kann das Pruning je nach DBMS verhindern – besser als Bereich formulieren.

### Merksatz
Filter auf das Partitionskriterium – nur die passende Partition wird gelesen.

Siehe auch: Partitionierung · Horizontale Partitionierung · Index · Sharding
Mehr: Deep Dive 8, 5.3

## Partitionierung
<!-- id: partitionierung · quellen: Karte DD8, DD8 5.3 · stand: 2026-10 -->

Physische Aufteilung einer großen Tabelle in Teile, die logisch eine Tabelle bleiben – horizontal (Range, Liste, Hash) oder vertikal (spaltenweise).

### Erklärung
**Horizontal** wird zeilenweise geteilt: nach Bereich (je Monat), nach Liste (je Region) oder per Hash-Funktion (gleichmäßige Verteilung). **Vertikal** werden selten genutzte oder große Spalten ausgelagert. Nutzen: Abfragen lesen nur betroffene Partitionen (Partition Pruning), alte Daten lassen sich als ganze Partition archivieren oder löschen, Ladeläufe betreffen nur die aktuelle Partition.

### Beispiel
Die Faktentabelle verkauf des Möbelhauses wird je Monat partitioniert; nach Ablauf der Aufbewahrungsfrist wird die älteste Monatspartition auf einmal entfernt.

### Abgrenzung
Liegen die Partitionen auf mehreren Servern, spricht man von **Sharding**. Normalisierung zerlegt Tabellen fachlich (logisch), Partitionierung nur physisch – für Anwender bleibt es eine Tabelle.

### Prüfungsfalle
Partitionierung mit Normalisierung verwechseln – Partitionen haben alle dieselbe Struktur und heben keine Redundanz auf.

### Merksatz
Physisch geteilt, logisch eine Tabelle.

Siehe auch: Partition Pruning · Horizontale Partitionierung · Sharding · Spaltenorientierte Speicherung
Mehr: Deep Dive 8, 5.3

## PATCH
<!-- id: patch · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

HTTP-Methode zum teilweisen Ändern einer Ressource: Gesendet werden nur die geänderten Felder.

### Erklärung
PATCH ist in RFC 5789 definiert. Es ist nicht sicher (ändert den Serverzustand) und nicht garantiert idempotent – etwa wenn die Änderung relativ formuliert ist („Bestand um 3 verringern“). Typischer Erfolgscode ist 200 OK.

### Beispiel
```json
PATCH /reparaturauftraege/5001
{ "status": "erledigt" }
```
Nur der Status ändert sich; alle anderen Felder des Auftrags bleiben unverändert.

### Abgrenzung
| Methode | Zweck | Idempotent |
|---|---|---|
| PUT | Ressource vollständig ersetzen | ja |
| PATCH | Ressource teilweise ändern | nicht garantiert |
| POST | neu anlegen | nein |

### Prüfungsfalle
Mit PUT nur ein Feld senden – PUT ersetzt die ganze Ressource, fehlende Felder können dabei verloren gehen.

### Merksatz
PATCH flickt, PUT ersetzt.

Siehe auch: PUT · POST · REST · Idempotent
Mehr: Deep Dive 15, 3.2

## Patchmanagement
<!-- id: patchmanagement · quellen: Karte DD10, DD10 5.3 · stand: 2026-10 -->

Geordnetes, zeitnahes Einspielen von Sicherheitsupdates und Fehlerkorrekturen in Betriebssysteme, Anwendungen und Firmware.

### Erklärung
Patchmanagement ist ein Prozess, keine Einzelaktion: Schwachstellenmeldungen beobachten, Patches nach Kritikalität bewerten, in einer Testumgebung prüfen, freigeben, ausrollen, Erfolg kontrollieren und dokumentieren. Kritische Lücken werden sofort geschlossen, andere im festen Wartungsfenster. Es ist eine der wirksamsten präventiven Maßnahmen gegen Ransomware und Schadsoftware.

### Beispiel
Für den Datenbankserver des Möbelhauses erscheint ein Sicherheitsupdate gegen eine aktiv ausgenutzte Lücke. Es wird am selben Tag auf dem Testsystem geprüft und abends eingespielt; das Patchprotokoll hält Version und Zeitpunkt fest.

### Abgrenzung
**Härtung** reduziert die Angriffsfläche (unnötige Dienste abschalten), Patchmanagement schließt bekannte Lücken. Gegen einen **Zero-Day-Exploit** hilft es noch nicht – dafür gibt es noch kein Update.

### Prüfungsfalle
Patches ungetestet sofort auf Produktivsysteme spielen oder „aus Stabilitätsgründen“ gar nicht – beides ist kein Patchmanagement.

### Merksatz
Bewerten, testen, einspielen, dokumentieren – zeitnah und regelmäßig.

Siehe auch: Härtung · Ransomware · Zero-Day-Exploit · Penetrationstest
Mehr: Deep Dive 10, 5.3

## Patent
<!-- id: patent · quellen: Karte DD14, DD14 2.7 · stand: 2026-10 -->

Gewerbliches Schutzrecht für technische Erfindungen, das nach Anmeldung und Prüfung erteilt wird und höchstens 20 Jahre gilt (§ 16 PatG).

Auch: Patentrecht

### Erklärung
Patentierbar sind Erfindungen, die neu sind, auf erfinderischer Tätigkeit beruhen und gewerblich anwendbar sind (§ 1 PatG). Der Schutz entsteht erst mit der Erteilung durch das Patentamt (DPMA oder Europäisches Patentamt) und muss durch Jahresgebühren aufrechterhalten werden. Programme für Datenverarbeitungsanlagen „als solche“ sind ausgeschlossen (§ 1 Abs. 3 PatG, Art. 52 EPÜ); patentierbar sind nur softwaregestützte technische Lösungen.

### Beispiel
Ein neues Steuerverfahren für einen Hochregallager-Roboter kann patentiert werden. Das SQL-Skript zur Umsatzauswertung des Möbelhauses ist nicht patentierbar, aber als Computerprogramm automatisch urheberrechtlich geschützt.

### Abgrenzung
| | Urheberrecht | Patent |
|---|---|---|
| Schutzgegenstand | persönliche geistige Schöpfung, auch Software | technische Erfindung |
| Entstehung | automatisch, ohne Anmeldung | Anmeldung und Prüfung |
| Dauer | 70 Jahre nach Tod des Urhebers | höchstens 20 Jahre ab Anmeldung |

### Prüfungsfalle
„Software wird durch ein Patent geschützt“ – in Europa schützt sie in erster Linie das Urheberrecht (§ 69a UrhG).

### Merksatz
Erfindung → Patent (angemeldet, 20 Jahre); Programm → Urheberrecht (automatisch).

Siehe auch: Urheberrecht · Open Source · Proprietäre Software
Mehr: Deep Dive 14, 2.7

## PCA
<!-- id: pca · quellen: DD6 2.2 · stand: 2026-11 -->

Hauptkomponentenanalyse (Principal Component Analysis): Dimensionsreduktion, die die Daten auf neue, untereinander unkorrelierte Achsen dreht, die möglichst viel Streuung (Varianz) erklären; man behält nur die ersten.
Auch: Hauptkomponentenanalyse, Principal Component Analysis

### Erklärung
Die erste **Hauptkomponente** zeigt in die Richtung der größten Streuung der Daten, die zweite steht senkrecht darauf und erklärt den größten Rest usw. Ablauf: Merkmale standardisieren, Kovarianzmatrix berechnen, ihre Eigenvektoren (die Richtungen) und Eigenwerte $\lambda_j$ (die Varianz je Richtung) bestimmen, nach Eigenwert sortieren, die ersten Komponenten behalten und die Daten darauf projizieren. Anteil der erklärten Varianz der Komponente $j$: $\frac{\lambda_j}{\sum_i \lambda_i}$. Bei standardisierten Daten ist die Summe aller Eigenwerte gleich der Zahl der Merkmale. Jede Komponente ist eine Mischung der Originalmerkmale und daher schwer zu deuten; PCA erfasst nur lineare Zusammenhänge und ignoriert eine Zielvariable. Die PCA wird nur auf den Trainingsdaten angepasst und dann auf die Testdaten angewendet (sonst Data Leakage).

### Beispiel
Vier standardisierte Kundenmerkmale ergeben die Eigenwerte 2,4; 1,1; 0,4 und 0,1 (Summe 4 = Anzahl der Merkmale). Erklärte Varianz: $\frac{2{,}4}{4} = 60\ \%$, $\frac{1{,}1}{4} = 27{,}5\ \%$, $\frac{0{,}4}{4} = 10\ \%$, $\frac{0{,}1}{4} = 2{,}5\ \%$. Kumuliert: 60 %, 87,5 %, 97,5 %, 100 %. Zwei Komponenten reichen für 87,5 % der Information: Aus 4 Merkmalen werden 2.

### Abgrenzung
**Merkmalsauswahl** streicht vorhandene Spalten, PCA bildet neue Spalten aus allen alten. PCA ist unüberwacht; sie sucht Streuung, nicht Trennung zwischen Klassen.

### Prüfungsfalle
PCA ohne vorherige Skalierung rechnen – das Merkmal mit den größten Zahlen (z. B. Umsatz in Euro) dominiert dann die erste Komponente. Die Komponenten als Originalmerkmale zu lesen ist ebenfalls falsch.

### Merksatz
Neue Achsen entlang der größten Streuung – die ersten behalten.

Siehe auch: Dimensionsreduktion · Skalierung · Standardisierung · Unüberwachtes Lernen · Varianz · Korrelation
Mehr: Deep Dive 6, 2.2

## PDCA
<!-- id: pdca · quellen: Karte DD5, DD5 4.2, DD5 6.2 · stand: 2026-10 -->

Vierstufiger Verbesserungskreislauf Plan – Do – Check – Act (Deming-Kreis), Grundlage des kontinuierlichen Verbesserungsprozesses (KVP).

### Erklärung
**Plan:** Problem analysieren, Maßnahme und Zielkennzahl festlegen. **Do:** Maßnahme umsetzen, gern zuerst im Pilotbereich. **Check:** Wirkung an Kennzahlen prüfen (Soll-Ist-Vergleich). **Act:** bei Erfolg als Standard festschreiben, sonst nachsteuern – danach beginnt der nächste Zyklus. Der SDCA-Zyklus (Standardize – Do – Check – Act) sichert das Erreichte, bevor weiter verbessert wird. PDCA steckt auch im ISMS nach ISO 27001 und im Datenqualitätskreislauf.

### Beispiel
Plan: Liegezeit im Reparaturservice von 28,5 h auf 20 h senken, Termin-Trigger einführen. Do: Trigger in einer Filiale testen. Check: Liegezeit sinkt auf 21 h. Act: Trigger in allen Filialen einführen, nächster Zyklus für den Rest.

### Abgrenzung
DMAIC (Six Sigma) ist ein Projektvorgehen in fünf Phasen mit Statistik-Schwerpunkt; BPR gestaltet radikal neu statt schrittweise zu verbessern.

### Prüfungsfalle
Check auslassen und eine Maßnahme ohne Kennzahl „für erfolgreich erklären“.

### Merksatz
Planen, ausprobieren, messen, festschreiben – und wieder von vorn.

Siehe auch: KVP · Kaizen · Datenqualitätskreislauf
Mehr: Deep Dive 5, 4.2 · Deep Dive 5, 6.2

## Penetrationstest
<!-- id: penetrationstest · quellen: Karte DD10, DD10 5.3 · stand: 2026-10 -->

Beauftragter, simulierter Angriff auf IT-Systeme, um Schwachstellen zu finden, bevor echte Angreifer sie ausnutzen.

### Erklärung
Ein Pentest wird vorab mit dem Betreiber vereinbart: Ziele, Umfang, Zeitraum und erlaubte Methoden. Beim **Black-Box-Test** hat der Tester kein Vorwissen (Sicht eines externen Angreifers), beim **White-Box-Test** Zugang zu Dokumentation und Quellcode. Ergebnis ist ein Bericht mit bewerteten Schwachstellen und Empfehlungen. Ohne Einwilligung des Berechtigten erfüllt das Eindringen Straftatbestände (§ 202a ff. StGB) – die Beauftragung wird daher immer schriftlich festgehalten.

### Beispiel
Das Möbelhaus beauftragt einen Dienstleister, das neue Kundenportal zu testen. Er findet eine SQL-Injection im Suchfeld; behoben wird sie mit parametrisierten Abfragen.

### Abgrenzung
Ein **Schwachstellenscan** prüft automatisiert auf bekannte Lücken; der Pentest geht manuell und kreativ vor und versucht, Lücken tatsächlich auszunutzen und zu kombinieren.

### Prüfungsfalle
„Ich teste mal kurz die Firewall des Lieferanten“ – ohne Auftrag ist das kein Pentest, sondern eine Straftat.

### Merksatz
Erst den Auftrag schriftlich, dann der Angriff.

Siehe auch: Patchmanagement · Härtung · Security by Design · SQL-Injection
Mehr: Deep Dive 10, 5.3

## Personalkosten
<!-- id: personalkosten · quellen: Karte DD18, DD18 5.3, DD18 5.4, DD14 1.3 · stand: 2026-11 -->

Alle Kosten, die dem Arbeitgeber durch die Beschäftigung entstehen: Bruttoentgelt plus Arbeitgeberanteile zur Sozialversicherung und weitere Personalnebenkosten.

Auch: Lohnnebenkosten, Personalnebenkosten

### Erklärung
Bestandteile:
- **Bruttoentgelt** einschließlich Zuschlägen und Sonderzahlungen (13. Gehalt, Urlaubs- und Weihnachtsgeld). Darin stecken schon die **Arbeitnehmeranteile** zur Sozialversicherung – sie werden nicht zusätzlich gerechnet.
- **Arbeitgeberanteile** zur Kranken-, Pflege-, Renten- und Arbeitslosenversicherung (2026: KV 7,3 % + halber Zusatzbeitrag, PV 1,8 %, RV 9,3 %, ALV 1,3 %; mit 2,9 % Zusatzbeitrag zusammen 21,15 %).
- **Unfallversicherung** (Berufsgenossenschaft, zahlt der Arbeitgeber allein; Beitrag nach Lohnsumme und Gefahrklasse) und **Umlagen** (z. B. für Entgeltfortzahlung, Mutterschaft, Insolvenzgeld).
- **Freiwillige oder tarifliche Leistungen**: betriebliche Altersversorgung, Zuschüsse, Weiterbildung, Arbeitskleidung.

$\text{Personalkosten} = \text{Bruttoentgelt} + \text{AG-Anteile SV} + \text{sonstige Personalnebenkosten}$

$\text{Nebenkostenquote} = \frac{\text{Personalnebenkosten}}{\text{Bruttoentgelt}} \cdot 100\,\%$

Für die Kalkulation braucht man den **Stundensatz**: Bezahlte Ausfallzeiten (Urlaub, Feiertage, Krankheit) kosten Geld ohne Arbeitsleistung, deshalb teilt man die Jahreskosten nur durch die **produktiven Stunden**:

$\text{Stundensatz} = \frac{\text{Jahrespersonalkosten}}{\text{produktive Jahresstunden}}$

### Beispiel
Ein Mitarbeiter der Möbelhaus Nordholz GmbH verdient 3.200 € brutto im Monat (40 Stunden, Fünf-Tage-Woche). Annahme: Zusatzbeitrag 2,9 %, Beitrag zur Unfallversicherung 1,0 % des Bruttos.

| Position | Rechnung | Betrag |
|---|---|---|
| Bruttoentgelt | gegeben | 3.200,00 € |
| AG-Anteil Sozialversicherung | $3.200 \cdot 21{,}15\,\%$ | 676,80 € |
| Unfallversicherung | $3.200 \cdot 1\,\%$ | 32,00 € |
| **Personalkosten je Monat** | | **3.908,80 €** |

Nebenkostenquote: $\frac{676{,}80 + 32{,}00}{3.200} \cdot 100$ = **22,15 %**

Jahreskosten: $12 \cdot 3.908{,}80$ = 46.905,60 €. Produktive Stunden: 52 Wochen · 40 Stunden = 2.080 Stunden, minus 30 Urlaubstage, 10 Feiertage und 10 Krankheitstage (50 Tage · 8 Stunden = 400 Stunden) = 1.680 Stunden.

$\frac{46.905{,}60}{1.680}$ = **27,92 € je produktive Stunde**

### Abgrenzung
Das **Bruttoentgelt** ist die Sicht des Arbeitnehmers, das **Nettoentgelt** sein Auszahlungsbetrag. Die Personalkosten sind die Sicht des Arbeitgebers und liegen deutlich über dem Brutto. **Prozesskosten je Fall** verteilen sie auf einen Vorgang; in der **Zuschlagskalkulation** gehen sie als Fertigungslöhne ein.

### Prüfungsfalle
Den Arbeitnehmeranteil zusätzlich zum Brutto aufschlagen (er steckt schon im Brutto), die Unfallversicherung vergessen oder als Abzug vom Arbeitnehmer behandeln und den Stundensatz mit allen bezahlten statt den produktiven Stunden berechnen.

### Merksatz
Personalkosten sind Brutto plus Arbeitgeberanteile plus Nebenkosten – je Stunde nur durch die produktiven Stunden geteilt.

Siehe auch: Summe SV-Arbeitnehmeranteil · Nettoentgelt · Sozialversicherung · Unfallversicherung · Prozesskosten je Fall · Zuschlagskalkulation · Entgeltfortzahlung · Beitragsbemessungsgrenze
Mehr: Deep Dive 18, 5.3 · Deep Dive 18, 5.4 · Deep Dive 14, 1.3

## Personenbezogene Daten
<!-- id: personenbezogene-daten · quellen: Karte DD10, DD10 Teil 1 · stand: 2026-10 -->

Alle Informationen, die sich auf eine identifizierte oder **identifizierbare** natürliche Person beziehen (Art. 4 Nr. 1 DSGVO).

### Erklärung
Identifizierbar ist eine Person schon, wenn sie mit vertretbarem Aufwand – auch über Zusatzwissen oder Kennungen – bestimmt werden kann. Deshalb sind auch Kundennummer, Personalnummer, IP-Adresse, Kfz-Kennzeichen, Standortdaten und Cookie-IDs personenbezogen. Geschützt sind nur **natürliche** Personen; Daten einer GmbH als solche nicht, wohl aber die ihrer Ansprechpartner. Für Gesundheit, Religion u. Ä. gelten als besondere Kategorien (Art. 9) strengere Regeln.

### Beispiel
Im Event Log des Reparaturservices steht in der Spalte resource das Kürzel „TM07“. Weil die Personalabteilung das Kürzel einem Techniker zuordnen kann, ist die Spalte personenbezogen.

### Abgrenzung
**Pseudonymisierte** Daten bleiben personenbezogen; erst **anonymisierte** Daten fallen aus der DSGVO heraus.

### Prüfungsfalle
„Ohne Namen keine personenbezogenen Daten“ – die Identifizierbarkeit genügt.

### Merksatz
Wer mit vertretbarem Aufwand auf einen Menschen schließen kann, hat personenbezogene Daten.

Siehe auch: DSGVO · Pseudonymisierung · Anonymisierung · Betroffene Person
Mehr: Deep Dive 10, Teil 1

## Perzeptron
<!-- id: perzeptron · quellen: Karte DD6, DD6 9.1, DD6 9.4, DD6 9.5 · stand: 2026-10 -->

Einzelnes künstliches Neuron mit Stufenfunktion, das seine Gewichte mit der Perzeptron-Lernregel aus gelabelten Beispielen lernt (Rosenblatt 1958).

### Erklärung
Das Perzeptron besteht aus sechs Bausteinen, die in Prüfungen oft an einer Skizze zugeordnet werden:

| Baustein | Aufgabe |
|---|---|
| **Eingänge** x₁ … xₙ | Messwerte des Falls |
| **Gewichte** w₁ … wₙ | Bedeutung jedes Eingangs; werden gelernt |
| **Bias** b | verschiebt die Schwelle; in der Skizze oft als konstanter Eingang „1“ mit eigenem Gewicht w₀ |
| **Nettoeingabefunktion** | bildet die gewichtete Summe z = Σ wᵢ · xᵢ + b |
| **Sprungfunktion** (Aktivierung) | macht aus z die Klasse: 1, wenn z ≥ 0 ist, sonst 0 |
| **Ausgang** y | vorhergesagte Klasse |

Es lernt überwacht: Die Ausgabe y wird mit dem bekannten Label t verglichen. Ist sie falsch, wird der Fehler t − y zurückgeführt und Gewichte und Bias nach der Regel wᵢ neu = wᵢ + η · (t − y) · xᵢ angepasst. Ein Durchlauf durch alle Fälle ist eine Epoche; gelernt wird, bis eine Epoche fehlerfrei bleibt. Weil es nur eine Trenngerade zieht, lernt es nur linear trennbare Klassen – AND und OR, aber nicht XOR. Der Bias ist nötig, weil die Trenngerade sonst immer durch den Nullpunkt liefe.

### Beispiel
**Klassifizieren:** Der Nordholz Eventservice beurteilt MDE-Akkus mit den Messwerten m1 (Innenwiderstand) und m2 (Selbstentladung). Das Perzeptron hat b = 3,5; w₁ = −0,4 und w₂ = −1,0 (1 = gut, 0 = schlecht).

- Akku A mit m1 = 4,5 und m2 = 1,2: $z = 3{,}5 + (-0{,}4) \cdot 4{,}5 + (-1{,}0) \cdot 1{,}2 = 3{,}5 - 1{,}8 - 1{,}2$ = **0,5**. Sprungfunktion: 0,5 ≥ 0 → y = 1, gut.
- Akku B mit m1 = 5,5 und m2 = 3,6: $z = 3{,}5 - 2{,}2 - 3{,}6$ = **−2,3**. Sprungfunktion: −2,3 < 0 → y = 0, schlecht.

**Lernen** (AND mit Start w₁ = w₂ = 0,5, b = −0,1 und η = 0,2): Der Fall (0|1) ergibt z = 0,4 und y = 1, verlangt ist 0. Also w₂ = 0,3 und b = −0,3. Nach einem weiteren Fehler bei (1|0) ist w₁ = 0,3, b = −0,5, und die zweite Epoche bleibt fehlerfrei.

### Abgrenzung
| | Perzeptron | Mehrschichtiges Perzeptron |
|---|---|---|
| Aufbau | ein Neuron | mindestens eine verdeckte Schicht |
| Aktivierung | Stufenfunktion | meist Sigmoid oder ReLU |
| Training | Perzeptron-Lernregel | Backpropagation |
| lernt XOR | nein | ja |

### Prüfungsfalle
**Nettoeingabefunktion** (bildet die Summe) und **Sprungfunktion** (macht daraus 0 oder 1) verwechseln – ebenso **Bias** (eine Zahl, die die Schwelle verschiebt) und **Gewichte** (bewerten die Eingänge). Beim Lernalgorithmus als Struktogramm: Der Epochenzähler gehört außerhalb der inneren Schleife über die Trainingsfälle, der Fehler wird erst nach dem Lesen von Messwerten und Label gebildet.

### Merksatz
Ein Perzeptron zieht genau eine Gerade.

Siehe auch: Neuron · Perzeptron-Lernregel · Stufenfunktion · Bias · Lineare Trennbarkeit · Mehrschichtiges Perzeptron
Mehr: Deep Dive 6, 9.4 · Deep Dive 6, 9.5

## Perzeptron-Lernregel
<!-- id: perzeptron-lernregel · quellen: Karte DD6, DD6 9.4, DD6 9.5, DD31 2.3 · stand: 2026-11 -->

Regel, mit der ein Perzeptron aus gelabelten Beispielen lernt: Bei falscher Ausgabe werden Gewichte und Bias um Lernrate mal Fehler mal Eingabe verändert, bei richtiger Ausgabe bleibt alles gleich.

### Erklärung
Für jeden Trainingsfall mit dem Sollwert t (Label 0 oder 1) wird die Ausgabe y berechnet. Dann gilt:

$e = t - y$  ·  $w_i^{neu} = w_i + \eta \cdot e \cdot x_i$  ·  $b^{neu} = b + \eta \cdot e$

Dabei ist e der **Fehler** (Soll minus Ist, also −1, 0 oder +1), η die **Lernrate** (Schrittweite), xᵢ der Eingabewert und b der **Bias** (in Klausuren oft als Gewicht w₀ eines konstanten Eingangs 1 geschrieben; dann gilt für ihn dieselbe Formel mit Eingabe 1). Ist e = 0, ändert sich nichts; eine Eingabe mit xᵢ = 0 ändert ihr Gewicht nicht. Ein Durchlauf durch alle Trainingsfälle ist eine **Epoche**; trainiert wird, bis eine Epoche ohne Fehler bleibt oder eine Höchstzahl an Epochen erreicht ist. Bei linear trennbaren Daten ist das nach endlich vielen Schritten der Fall.

### Beispiel
Perzeptron zur Akkubeurteilung mit b = 3,5; w₁ = −0,4; w₂ = −1,0 und η = 0,1. Trainingsfall: m1 = 6,0; m2 = 1,9; Label t = 1 (gut).

1. Nettoeingabe: $z = 3{,}5 - 0{,}4 \cdot 6{,}0 - 1{,}0 \cdot 1{,}9$ = **−0,8**
2. Sprungfunktion: z < 0 → y = 0, aber t = 1 → Fehler $e = 1 - 0 = 1$
3. Anpassen: $w_1^{neu} = -0{,}4 + 0{,}1 \cdot 1 \cdot 6{,}0$ = **0,2**; $w_2^{neu} = -1{,}0 + 0{,}1 \cdot 1 \cdot 1{,}9$ = **−0,81**; $b^{neu} = 3{,}5 + 0{,}1 \cdot 1$ = **3,6**
4. Probe: $z = 3{,}6 + 0{,}2 \cdot 6{,}0 - 0{,}81 \cdot 1{,}9$ = **3,261** → y = 1, jetzt richtig.

Die neuen Gewichte gelten für alle Fälle. Dass ein früher richtig klassifizierter Fall nun falsch sein kann, ist normal – deshalb braucht man mehrere Epochen.

### Abgrenzung
Das mehrschichtige Perzeptron lernt nicht mit dieser Regel, sondern mit **Backpropagation**, weil der Fehler durch mehrere Schichten zurückgerechnet werden muss. Die Lernrate ist ein vorgegebener Wert (Hyperparameter), die Gewichte werden gelernt.

### Prüfungsfalle
Fehler als **Ist minus Soll** rechnen – dann laufen die Gewichte in die falsche Richtung. Außerdem den Bias vergessen: Er wird bei jedem Fehler mit angepasst (Änderung η · e, ohne Eingabewert). Im Struktogramm gehört der Epochenzähler **außerhalb** der inneren Schleife über die Trainingsfälle.

### Merksatz
Nur bei Fehler ändern, um Lernrate · (Soll − Ist) · Eingabe.

Siehe auch: Perzeptron · Stufenfunktion · Lernrate · Epoche · Bias · Lineare Trennbarkeit · Backpropagation
Mehr: Deep Dive 6, 9.4 · Deep Dive 6, 9.5 · Deep Dive 31, 2.3

## Pessimistisches Sperren
<!-- id: pessimistisches-sperren · quellen: Karte DD15, DD15 4.2 · stand: 2026-10 -->

Sperrverfahren, bei dem ein Datensatz schon beim Lesen gesperrt wird, damit ihn bis zum Ende der Transaktion niemand anderes ändern kann (`SELECT … FOR UPDATE`).

### Erklärung
Man geht „pessimistisch“ davon aus, dass Konflikte wahrscheinlich sind, und verhindert sie vorab. Andere Transaktionen, die denselben Satz ändern wollen, müssen warten. Das verhindert Lost Updates zuverlässig, kostet aber Wartezeit und kann zu Deadlocks führen.

### Beispiel
```sql
START TRANSACTION;
SELECT bestand FROM lager WHERE artikel_id = 10 FOR UPDATE;
UPDATE lager SET bestand = bestand - 3 WHERE artikel_id = 10;
COMMIT;
```
Der zweite Disponent wartet beim SELECT, bis der erste fertig ist; dann liest er 7 und schreibt richtig 4.

### Abgrenzung
**Optimistisches Sperren** sperrt nicht, sondern prüft beim Schreiben über eine Versionsspalte, ob sich der Satz geändert hat – gut bei seltenen Konflikten.

### Merksatz
Pessimistisch: erst sperren, dann ändern.

Siehe auch: Optimistisches Sperren · Lost Update · Deadlock · Transaktion
Mehr: Deep Dive 15, 4.2

## Pflegeversicherung
<!-- id: pflegeversicherung · quellen: Karte DD14, DD14 1.2, DD14 1.3 · stand: 2026-10 -->

Zweig der gesetzlichen Sozialversicherung, Träger sind die Pflegekassen bei den Krankenkassen; Leistungen sind Pflegegeld und Sachleistungen nach Pflegegrad.

### Erklärung
Beitragssatz (Stand 2026): 3,6 %, Arbeitgeber und Arbeitnehmer je 1,8 %. **Kinderlose ab 23** zahlen einen Zuschlag von 0,6 %, den der Arbeitnehmer allein trägt. Ab dem 2. Kind unter 25 sinkt der Arbeitnehmeranteil um je 0,25 % (bis zum 5. Kind). Sonderfall **Sachsen**: Arbeitnehmer 2,3 %, Arbeitgeber 1,3 %. Beiträge werden nur bis zur Beitragsbemessungsgrenze erhoben (2026: 5.812,50 € im Monat).

### Beispiel
Bruttovergütung 1.200 €: Jonas (17) zahlt $1.200 \cdot 0{,}018 = 21{,}60$ €. Lea (24, kinderlos) zahlt $1.200 \cdot 0{,}024 = 28{,}80$ €.

### Abgrenzung
Die **Unfallversicherung** zahlt der Arbeitgeber allein; bei der Pflegeversicherung ist nur der Kinderlosenzuschlag einseitig – zulasten des Arbeitnehmers.

### Prüfungsfalle
Den Zuschlag schon bei unter 23-Jährigen oder bei Eltern ansetzen – Alter und Kinderzahl immer zuerst prüfen.

### Merksatz
3,6 % hälftig, Kinderlose ab 23 zahlen 0,6 % allein drauf (Stand 2026).

Siehe auch: Sozialversicherung · Krankenversicherung · Beitragsbemessungsgrenze · Pflichtversicherung
Mehr: Deep Dive 14, 1.2 · Deep Dive 14, 1.3

## Pflichtenheft
<!-- id: pflichtenheft · quellen: Karte DD12, DD12 1.3 · stand: 2026-10 -->

Vom Auftragnehmer erstelltes Dokument, das beschreibt, **wie und womit** die Anforderungen des Lastenhefts umgesetzt werden; nach Freigabe Grundlage der Abnahme.

### Erklärung
Nach DIN 69901-5 enthält das Pflichtenheft die „vom Auftragnehmer erarbeiteten Realisierungsvorgaben“ auf Basis des Lastenhefts. Es entsteht nach der Beauftragung und vor der Umsetzung: Systemarchitektur, Datenmodell, Schnittstellen, Testkriterien. Der Auftraggeber nimmt es ab; damit wird es zum verbindlichen Maßstab, gegen den das Ergebnis später abgenommen wird.

### Beispiel
Lastenheft des Möbelhauses: „Die Filialleitung soll Reparaturdurchlaufzeiten je Filiale sehen.“ Pflichtenheft des Dienstleisters: „Power-BI-Dashboard auf Basis eines Star-Schemas, täglicher ETL-Lauf um 2 Uhr, Seitenaufbau unter 2 Sekunden.“

### Abgrenzung
| | Lastenheft | Pflichtenheft |
|---|---|---|
| Ersteller | Auftraggeber | Auftragnehmer |
| Inhalt | was und wofür | wie und womit |
| Zeitpunkt | vor der Beauftragung | nach der Beauftragung |

### Prüfungsfalle
Die Ersteller vertauschen – das **P**flichtenheft schreibt der Auftragnehmer.

### Merksatz
Lastenheft = Wunsch des Kunden, Pflichtenheft = Lösung des Lieferanten.

Siehe auch: Lastenheft · Abnahme · Projekt
Mehr: Deep Dive 12, 1.3

## Pflichtfelder
<!-- id: pflichtfelder · quellen: Karte DD9, DD9 5.1 · stand: 2026-10 -->

Felder, die bei der Erfassung zwingend gefüllt werden müssen – in der Datenbank per `NOT NULL`, im Formular als Pflichteingabe.

### Erklärung
Pflichtfelder sind eine präventive Datenqualitätsmaßnahme für die Dimension **Vollständigkeit**: Der Fehler entsteht gar nicht erst. Sie sind nur für Angaben sinnvoll, die fachlich immer bekannt sind; sonst weichen die Erfassenden auf Platzhalter aus.

### Beispiel
```sql
CREATE TABLE kunde (
  kunden_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  plz CHAR(5) NOT NULL,
  geburtsdatum DATE
);
```
Das Geburtsdatum bleibt optional – würde man es erzwingen, tauchten bald viele „01.01.1900“ auf.

### Abgrenzung
Pflichtfelder prüfen nur, **ob** etwas eingetragen ist. Ob der Wert stimmt, prüfen Formatprüfung, Wertebereichsprüfung (`CHECK`) und Plausibilitätsprüfung.

### Prüfungsfalle
Jedes Feld zur Pflicht machen – das erzeugt Platzhalterwerte, die gefährlicher sind als leere Felder.

### Merksatz
Pflicht nur, was immer bekannt ist – sonst kommen Platzhalter.

Siehe auch: NOT NULL · Platzhalterwert · Plausibilitätsprüfung · Vollständigkeit
Mehr: Deep Dive 9, 5.1

## Pflichtversicherung
<!-- id: pflichtversicherung · quellen: DD14 1.1 · stand: 2026-10 -->

Grundprinzip der Sozialversicherung: Arbeitnehmer und Auszubildende sind kraft Gesetzes versichert, ohne Antrag und ohne Wahlmöglichkeit.

### Erklärung
Mit Beginn einer Beschäftigung gegen Entgelt besteht Versicherungspflicht in Kranken-, Pflege-, Renten- und Arbeitslosenversicherung; die Unfallversicherung deckt Beschäftigte ohnehin über den Arbeitgeber ab. Die Pflicht verhindert, dass sich gute Risiken der Solidargemeinschaft entziehen. Ausnahme in der Krankenversicherung: Wer mehr als die **Versicherungspflichtgrenze** verdient (2026: 77.400 € im Jahr, Stand 2026), kann in die private Krankenversicherung wechseln.

### Beispiel
Jonas beginnt seine Ausbildung im Möbelhaus Nordholz. Der Betrieb meldet ihn bei der Krankenkasse an; ab dem ersten Tag ist er in allen fünf Zweigen versichert.

### Abgrenzung
Pflichtversicherung, **Solidarprinzip** (Beitrag nach Einkommen, Leistung nach Bedarf), **Umlageverfahren** und **Selbstverwaltung** sind die vier Prinzipien der Sozialversicherung.

### Prüfungsfalle
Versicherungspflichtgrenze und Beitragsbemessungsgrenze verwechseln – die eine regelt den Wechsel in die PKV, die andere die Beitragsobergrenze.

### Merksatz
Wer beschäftigt ist, ist versichert – per Gesetz.

Siehe auch: Sozialversicherung · Solidarprinzip · Umlageverfahren · Versicherungspflichtgrenze
Mehr: Deep Dive 14, 1.1

## Phantom Read
<!-- id: phantom-read · quellen: Karte DD15, DD15 4.2 · stand: 2026-10 -->

Anomalie bei parallelen Zugriffen: Zwischen zwei gleichen Abfragen einer Transaktion tauchen neue (oder verschwinden) Zeilen auf, weil eine andere Transaktion sie eingefügt bzw. gelöscht hat.

### Erklärung
Beim Phantom Read ändert sich die **Menge** der Zeilen, die eine Bedingung erfüllen – nicht der Wert einer bereits gelesenen Zeile. Verhindert wird er erst durch die Isolationsstufe **SERIALIZABLE** (nach SQL-Standard); REPEATABLE READ schützt nur bereits gelesene Zeilen.

### Beispiel
Ein Bericht zählt `SELECT COUNT(*) FROM reparaturauftrag WHERE status = 'offen'` → 120. Ein Kollege legt einen Auftrag an und bestätigt. Die zweite Abfrage im selben Bericht liefert 121 – Summe und Detailliste passen nicht mehr zusammen.

### Abgrenzung
| Anomalie | Was passiert |
|---|---|
| Dirty Read | nicht bestätigte Daten werden gelesen |
| Non-repeatable Read | eine gelesene Zeile hat beim zweiten Lesen einen anderen Wert |
| Phantom Read | neue oder verschwundene Zeilen in der Ergebnismenge |

### Merksatz
Phantom = neue Zeilen tauchen auf, nicht geänderte Werte.

Siehe auch: Non-repeatable Read · Dirty Read · Isolationsstufen · Lost Update
Mehr: Deep Dive 15, 4.2

## Phishing
<!-- id: phishing · quellen: Karte DD10, DD10 4.5 · stand: 2026-10 -->

Angriff mit gefälschten Nachrichten oder Webseiten, die Zugangs- oder Zahlungsdaten erschleichen oder zum Öffnen von Schadsoftware verleiten.

### Erklärung
Phishing ist eine Form des **Social Engineering**: Angegriffen wird der Mensch, nicht die Technik. Typisch sind Zeitdruck („Konto wird gesperrt“), gefälschte Absender und Links auf nachgebaute Anmeldeseiten. Varianten: Spear-Phishing (gezielt auf eine Person), Smishing (SMS), Vishing (Anruf). Gegenmaßnahmen: Schulung und Sensibilisierung, Mehr-Faktor-Authentifizierung, Mailfilter, klares Meldeverfahren.

### Beispiel
Eine Mail „von der Hausbank“ fordert die Buchhaltung des Möbelhauses auf, sich über einen Link neu anzumelden. Die Adresse lautet nordholz-bank-login.example statt der echten Domain – Phishing.

### Abgrenzung
**Ransomware** verschlüsselt Daten zur Erpressung – oft ist eine Phishing-Mail der Einstieg. **Man-in-the-Middle** liest Kommunikation mit, ohne dass das Opfer etwas tun muss.

### Prüfungsfalle
Nur technische Maßnahmen nennen – gegen Phishing gehört die Schulung immer dazu, MFA begrenzt den Schaden gestohlener Passwörter.

### Merksatz
Erst prüfen, dann klicken – und MFA, falls doch jemand klickt.

Siehe auch: Social Engineering · Mehr-Faktor-Authentifizierung · Ransomware
Mehr: Deep Dive 10, 4.5

## Physisches Datenmodell
<!-- id: physisches-datenmodell · quellen: Karte DD2, DD2 1.1 · stand: 2026-10 -->

Dritte Ebene der Datenmodellierung: konkrete Umsetzung in SQL/DDL mit Datentypen, Indizes und Constraints für ein bestimmtes DBMS.

Auch: Physisch

### Erklärung
Aus dem logischen Relationenmodell wird ein lauffähiges Schema: Tabellen per `CREATE TABLE`, Datentypen (`DECIMAL(10,2)`, `DATE`), Schlüssel- und Prüfregeln (`PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `CHECK`), Indizes und ggf. Partitionierung. Hier zählen DBMS-Besonderheiten und Leistung.

### Beispiel
```sql
CREATE TABLE bestellung (
  bestell_id INT PRIMARY KEY,
  bestelldatum DATE NOT NULL,
  kunden_id INT NOT NULL REFERENCES kunde(kunden_id)
);
CREATE INDEX idx_bestellung_datum ON bestellung(bestelldatum);
```

### Abgrenzung
| Ebene | Modell | Inhalt |
|---|---|---|
| konzeptionell | ER-Modell | fachliche Sicht, technikneutral |
| logisch | Relationenmodell | Tabellen, Primär- und Fremdschlüssel |
| physisch | SQL/DDL | Datentypen, Indizes, Constraints, DBMS |

### Prüfungsfalle
Datentypen schon ins ER-Modell schreiben – das gehört erst auf die physische Ebene.

### Merksatz
Physisch = so, wie es im konkreten DBMS angelegt wird.

Siehe auch: Konzeptionelles Datenmodell · Logisches Datenmodell · DDL · Index
Mehr: Deep Dive 2, 1.1

## Pilotbetrieb
<!-- id: pilotbetrieb · quellen: Karte DD18, DD18 2.3, DD22 2.1, DD28 2.3 · stand: 2026-11 -->

Einführung eines neuen Systems oder Prozesses zunächst in kleinem Umfang – an einem Standort, in einem Bereich oder mit einer Nutzergruppe – im echten Betrieb, bevor es für alle ausgerollt wird.

Auch: Pilotphase

### Erklärung
Der Pilotbetrieb verkleinert das Risiko: Fehler, Bedienprobleme und fehlende Schulung zeigen sich früh und treffen nur wenige. Er liefert außerdem Messwerte für die Wirtschaftlichkeit und zeigt, ob die Beschäftigten die Lösung annehmen. Damit er mehr ist als „einfach mal ausprobieren“, legt man vorher fest:

1. **Umfang und Dauer** (z. B. eine Filiale, sechs Wochen),
2. **Erfolgskriterien** mit Kennzahlen (z. B. Wartezeit, Fehlerquote),
3. **Rückmeldewege** für die Anwender,
4. **Entscheidung** nach der Auswertung: ausrollen, nachbessern oder abbrechen.

Nachteile: zusätzlicher Aufwand, vorübergehend zwei Verfahren nebeneinander, und die Pilotgruppe ist nicht unbedingt repräsentativ.

### Beispiel
Die Möbelhaus Nordholz GmbH führt Abholschränke zunächst in einer Filiale ein. Ausgangswert: durchschnittliche Wartezeit 12 Minuten. Erfolgskriterium: Reduktion um mindestens 30 %, also auf höchstens $12 \cdot (1 - 0{,}30)$ = **8,4 Minuten**. Der Pilot misst 8,0 Minuten – das Kriterium ist erfüllt, die Geschäftsleitung entscheidet für den Rollout. Zugleich nennen die Mitarbeiter der Warenausgabe Bedienprobleme mit dem Abholcode; sie fließen in die Schulung ein.

### Abgrenzung
| Begriff | Wer / womit | Zweck |
|---|---|---|
| Testbetrieb, Abnahmetest | Tester oder Fachabteilung, Testdaten und Testumgebung | prüfen, ob das System die Anforderungen erfüllt |
| **Pilotbetrieb** | echte Anwender, echte Daten, begrenzter Bereich | Praxistauglichkeit und Akzeptanz belegen |
| Parallelbetrieb | alle Anwender, altes und neues System gleichzeitig | Umstellung absichern |
| Sofortumstellung („Big Bang“) | alle, an einem Stichtag | schnelle Umstellung, hohes Risiko |

### Prüfungsfalle
Pilotbetrieb mit Testen gleichsetzen – ein Pilot läuft mit echten Anwendern im Realbetrieb. Und als Gegenmaßnahme nur „Pilotphase“ hinschreiben, ohne zu sagen, **was** sie der Befürchtung entgegensetzt (z. B. „Bedienfehler fallen früh auf und werden vor dem Rollout behoben“).

### Merksatz
Erst klein und echt, dann groß – mit vorher festgelegten Erfolgskriterien.

Siehe auch: Abnahmetest · Testkonzept · Akzeptanz und Widerstände · Wirtschaftlichkeitsbetrachtung · Soll-Ist-Vergleich
Mehr: Deep Dive 18, 2.3 · Deep Dive 22, 2.1

## Pivot
<!-- id: pivot · quellen: Karte DD8, DD8 4.5 · stand: 2026-10 -->

OLAP-Operation (auch Rotate), die die Achsen der Darstellung vertauscht, ohne Daten hinzuzufügen oder wegzulassen.

Auch: Pivot / Rotate

### Erklärung
Der Datenwürfel wird „gedreht“: Was in den Zeilen stand, steht danach in den Spalten, oder eine andere Dimension rückt in den Blick. Die Werte bleiben gleich – nur die Sicht ändert sich, damit sich eine Frage leichter beantworten lässt. Bekannt ist das Prinzip aus Pivot-Tabellen in Excel.

### Beispiel
Umsatzbericht: Filialen in den Zeilen, Produktkategorien in den Spalten. Nach Pivot stehen die Kategorien in den Zeilen und die Filialen in den Spalten – der Vergleich einer Kategorie über alle Filialen fällt jetzt leichter.

### Abgrenzung
| Operation | Wirkung |
|---|---|
| Drill-down / Roll-up | feinere bzw. gröbere Detailstufe |
| Slice | eine Dimension auf einen Wert festlegen |
| Dice | mehrere Dimensionen auf Bereiche einschränken |
| Pivot | Achsen vertauschen |

### Merksatz
Pivot dreht die Sicht, nicht die Daten.

Siehe auch: OLAP · Slice · Dice · Drill-down · Roll-up
Mehr: Deep Dive 8, 4.5

## PKI
<!-- id: pki · quellen: Karte DD10, DD10 4.2 · stand: 2026-10 -->

Public-Key-Infrastruktur: System aus Zertifizierungsstellen, Zertifikaten und Regeln, das bestätigt, dass ein öffentlicher Schlüssel zu einer bestimmten Person oder Domain gehört.

### Erklärung
Asymmetrische Verfahren lösen den Schlüsselaustausch – aber nicht die Frage, ob ein öffentlicher Schlüssel echt ist. Diese Lücke schließt die PKI: Eine **Zertifizierungsstelle** (CA) prüft die Identität und signiert ein Zertifikat (Standard X.509) mit Schlüssel, Inhaber und Gültigkeit. Browser und Betriebssysteme vertrauen einer Liste von Stammzertifizierungsstellen. Gesperrte Zertifikate werden über Sperrlisten oder Online-Abfragen veröffentlicht.

### Beispiel
Ruft ein Kunde den Onlineshop des Möbelhauses per HTTPS auf, legt der Server sein Zertifikat vor. Der Browser prüft die Signatur der CA, Domainnamen und Ablaufdatum – erst dann wird die TLS-Verbindung aufgebaut.

### Abgrenzung
Die **digitale Signatur** ist das Verfahren (Hash mit privatem Schlüssel signieren); die PKI liefert das Vertrauen, dass der zugehörige öffentliche Schlüssel wirklich dem Absender gehört.

### Prüfungsfalle
„Die PKI verschlüsselt die Daten“ – sie bestätigt Identitäten; verschlüsselt wird mit den Verfahren, deren Schlüssel sie beglaubigt.

### Merksatz
PKI beantwortet: Gehört dieser öffentliche Schlüssel wirklich dem, der er vorgibt zu sein?

Siehe auch: Asymmetrische Verschlüsselung · Digitale Signatur · Hashing
Mehr: Deep Dive 10, 4.2

## Platzhalterwert
<!-- id: platzhalterwert · quellen: Karte DD9, DD9 2.1, DD3 Teil 6 · stand: 2026-10 -->

Ersatzwert wie 01.01.1900, 0, 99999 oder „unbekannt“, der statt NULL eingetragen wird; er täuscht Vollständigkeit vor und verfälscht Auswertungen.

### Erklärung
Platzhalter entstehen, wenn ein Pflichtfeld einen Wert verlangt, der nicht bekannt ist, oder als Default-Wert eines Systems. Gefährlicher als ein leeres Feld: NULL wird von Aggregatfunktionen ignoriert und fällt als Lücke auf, ein Platzhalter wird dagegen wie ein echter Wert mitgerechnet. Data Profiling deckt ihn über auffällige Häufungen eines Werts auf.

### Beispiel
In der Kundentabelle haben 2 von 10 Datensätzen das Geburtsdatum 01.01.1900. Zählen beide mit 126 statt mit etwa 40 Jahren, steigt das Durchschnittsalter um $2 \cdot (126 - 40) / 10 = 17{,}2$ Jahre.

### Abgrenzung
NULL bedeutet „unbekannt“ und wird ehrlich als fehlend gezählt; ein Platzhalter versteckt die Lücke.

### Prüfungsfalle
Platzhalter in der Vollständigkeitsquote als „gefüllt“ zählen – fachlich fehlt der Wert.

### Merksatz
Lieber ehrlich leer als scheinbar voll.

Siehe auch: NULL · Pflichtfelder · Data Profiling · Vollständigkeit
Mehr: Deep Dive 9, 2.1 · Deep Dive 3, Teil 6

## Plausibilitätsprüfung
<!-- id: plausibilitatsprufung · quellen: Karte DD9, DD9 5.1 · stand: 2026-10 -->

Prüfung, ob Werte fachlich logisch sind und zueinander passen – meist feldübergreifend, z. B. Enddatum nach Startdatum.

### Erklärung
Die Plausibilitätsprüfung geht über die reine Formatprüfung hinaus: Ein Wert kann formal gültig und trotzdem unmöglich sein. Sie läuft bei der Eingabe (Formular, `CHECK`-Constraint, Trigger) oder im ETL-Prozess, wo unplausible Sätze in eine Quarantäne ausgeleitet werden. Sie ist eine präventive Maßnahme für die Dimensionen Korrektheit und Konsistenz.

### Beispiel
```sql
ALTER TABLE reparaturauftrag
  ADD CONSTRAINT chk_termin CHECK (abholdatum >= eingangsdatum);
```
Ein Auftrag mit Abholung vor Eingang wird abgewiesen.

### Abgrenzung
| Prüfung | Frage | Beispiel |
|---|---|---|
| Pflichtfeld | ist etwas eingetragen? | Name nicht leer |
| Formatprüfung | stimmt das Muster? | PLZ fünfstellig |
| Wertebereich | liegt der Wert im Bereich? | Umsatz ≥ 0 |
| Plausibilitätsprüfung | passt es fachlich zusammen? | Ende nach Start |

Alle vier sind **Datenvalidierung**: Sie prüfen gegen Regeln und beantworten, ob ein Wert **zulässig** ist. Ob er auch **richtig** ist, klärt erst die **Datenverifizierung** durch Abgleich mit der Quelle (Beleg, Messgerät, zweite Erfassung). Ein Messwert von 44,9 °C besteht jede Plausibilitätsprüfung, kann aber trotzdem falsch gemessen sein.

### Prüfungsfalle
„Gültig“ mit „korrekt“ gleichsetzen – eine fünfstellige PLZ kann trotzdem falsch sein. Ebenso Validierung und Verifizierung gleichsetzen: Die eine prüft gegen Regeln, die andere gegen die Wirklichkeit.

### Merksatz
Plausibel heißt: Es kann so stimmen – nicht: Es stimmt sicher.

Siehe auch: Formatprüfung · Pflichtfelder · CHECK · Quarantäne · Datenverifizierung
Mehr: Deep Dive 9, 5.1 · Deep Dive 30, 2.3

## Polaritätsprofil
<!-- id: polaritatsprofil · quellen: Karte DD3, DD3 7.4 · stand: 2026-10 -->

Befragungsinstrument (semantisches Differenzial), bei dem ein Gegenstand auf mehreren Skalen zwischen Gegensatzpaaren bewertet wird; die Profile mehrerer Varianten lassen sich als Linien direkt vergleichen.

### Erklärung
Je Merkmal gibt es eine Skala mit zwei Polen, z. B. „übersichtlich – unübersichtlich“ mit fünf oder sieben Stufen. Die (mittleren) Antworten werden je Zeile markiert und verbunden; so entsteht ein Profil. Die Skalen sind streng genommen ordinal – Median und Modus sind immer zulässig, ein Mittelwert nur unter der Annahme gleicher Abstände.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120" width="300" height="120" role="img" aria-label="Polaritätsprofil zweier Dashboard-Entwürfe">
<text x="70" y="25" text-anchor="end" class="dg-klein">übersichtlich</text>
<text x="70" y="60" text-anchor="end" class="dg-klein">schnell</text>
<text x="70" y="95" text-anchor="end" class="dg-klein">modern</text>
<text x="230" y="25" class="dg-klein">unübersichtlich</text>
<text x="230" y="60" class="dg-klein">langsam</text>
<text x="230" y="95" class="dg-klein">veraltet</text>
<line x1="80" y1="21" x2="220" y2="21" class="dg-linie dg-strich"/>
<line x1="80" y1="56" x2="220" y2="56" class="dg-linie dg-strich"/>
<line x1="80" y1="91" x2="220" y2="91" class="dg-linie dg-strich"/>
<polyline points="115,21 115,56 150,91" class="dg-linie-akzent dg-dick"/>
<polyline points="185,21 115,56 185,91" class="dg-linie dg-dick"/>
<circle cx="115" cy="21" r="3" class="dg-akzent"/>
<circle cx="115" cy="56" r="3" class="dg-akzent"/>
<circle cx="150" cy="91" r="3" class="dg-akzent"/>
<circle cx="185" cy="21" r="3" class="dg-voll"/>
<circle cx="185" cy="91" r="3" class="dg-voll"/>
<text x="150" y="114" text-anchor="middle" class="dg-klein dg-leise">Entwurf A (Akzent) vs. Entwurf B</text>
</svg>
```

### Beispiel
Im Usability-Test bewerten Filialleiter zwei Dashboard-Entwürfe. Entwurf A liegt bei „übersichtlich“ deutlich links, Entwurf B rechts; bei „schnell“ sind beide gleich – Entwurf A wird weiterentwickelt.

### Abgrenzung
Die **Likert-Skala** misst die Zustimmung zu einer Aussage; das Polaritätsprofil die Lage zwischen zwei Gegensätzen über mehrere Merkmale.

### Merksatz
Gegensatzpaare, ein Profil je Variante, Linien vergleichen.

Siehe auch: Likert-Skala · Usability-Test · Ordinalskala
Mehr: Deep Dive 3, 7.4

## Polling
<!-- id: polling · quellen: Karte DD15, DD15 3.1 · stand: 2026-10 -->

Verfahren, bei dem der Empfänger in regelmäßigen Abständen beim Sender nachfragt, ob es Änderungen gibt.

### Erklärung
Polling ist einfach umzusetzen und funktioniert auch, wenn der Empfänger von außen nicht erreichbar ist. Nachteile: Viele Anfragen kommen leer zurück, das belastet beide Seiten, und Änderungen werden erst mit Verzögerung bis zum nächsten Abfragezeitpunkt bemerkt.

### Beispiel
Die Werkstatt-App fragt alle 5 Minuten `GET /reparaturauftraege?geaendert_seit=…` ab. Das sind $24 \cdot 12 = 288$ Anfragen am Tag – auch wenn sich nur drei Aufträge geändert haben.

### Abgrenzung
Beim **Webhook** meldet der Sender jede Änderung aktiv an eine vereinbarte Adresse des Empfängers – effizient und fast in Echtzeit, aber der Empfänger muss erreichbar sein.

### Prüfungsfalle
Polling als „Echtzeit“ bezeichnen – die Aktualität hängt vom Abfrageintervall ab.

### Merksatz
Polling fragt ständig nach, der Webhook meldet sich von selbst.

Siehe auch: Webhook · REST · Rate Limiting
Mehr: Deep Dive 15, 3.1

## Pool
<!-- id: pool · quellen: Karte DD5, DD5 2.1, DD17 1.1 · stand: 2026-10 -->

BPMN-Element für einen eigenständigen Teilnehmer eines Prozesses, etwa eine Organisation wie Kunde, Lieferant oder das eigene Unternehmen.

Auch: Pools und Lanes

### Erklärung
Ein Pool ist ein großes Rechteck mit dem Namen des Teilnehmers am Rand. Er kann in **Lanes** (Bahnen) für Rollen oder Abteilungen unterteilt werden. Innerhalb eines Pools verbinden durchgezogene Sequenzflüsse die Schritte – auch über Lane-Grenzen hinweg. Zwischen Pools gibt es nur gestrichelte **Nachrichtenflüsse**. Interessiert der interne Ablauf eines Teilnehmers nicht, wird sein Pool zugeklappt (Black Box).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 170" width="320" height="170" role="img" aria-label="Zwei Pools, einer mit zwei Lanes, verbunden durch Nachrichtenfluss">
<defs><marker id="pool-offen" viewBox="0 0 10 10" markerWidth="9" markerHeight="9" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker></defs>
<rect x="10" y="10" width="300" height="32" class="dg-grau"/>
<text x="160" y="30" text-anchor="middle" class="dg-fett">Pool: Kunde (zugeklappt)</text>
<rect x="10" y="70" width="300" height="90" class="dg-form"/>
<line x1="32" y1="70" x2="32" y2="160" class="dg-linie"/>
<line x1="32" y1="115" x2="310" y2="115" class="dg-linie"/>
<text x="25" y="115" text-anchor="middle" class="dg-klein dg-fett" transform="rotate(-90 25 115)">Möbelhaus</text>
<text x="150" y="88" class="dg-klein dg-leise">Lane: Serviceannahme</text>
<text x="150" y="133" class="dg-klein dg-leise">Lane: Werkstatt</text>
<rect x="45" y="78" width="80" height="30" rx="6" class="dg-form"/>
<text x="85" y="97" text-anchor="middle" class="dg-klein">Auftrag erfassen</text>
<rect x="45" y="123" width="80" height="30" rx="6" class="dg-form"/>
<text x="85" y="142" text-anchor="middle" class="dg-klein">reparieren</text>
<line x1="85" y1="108" x2="85" y2="123" class="dg-linie"/>
<line x1="70" y1="42" x2="70" y2="78" class="dg-linie dg-strich" marker-end="url(#pool-offen)"/>
<text x="78" y="62" class="dg-klein">Nachrichtenfluss</text>
</svg>
```

### Beispiel
Reparaturprozess: Pool „Möbelhaus Nordholz“ mit den Lanes Serviceannahme, Werkstatt und Buchhaltung; Pool „Kunde“ zugeklappt, verbunden über die Nachrichten Reparaturmeldung und Rechnung.

### Abgrenzung
| Element | Steht für | Verbindung |
|---|---|---|
| Pool | eigenständige Organisation | untereinander nur Nachrichtenfluss |
| Lane | Rolle/Abteilung innerhalb eines Pools | untereinander Sequenzfluss |

### Prüfungsfalle
Ein durchgezogener Sequenzfluss über die Poolgrenze – zwischen Pools fließen nur Nachrichten.

### Merksatz
Pool = wer eigenständig handelt, Lane = wer innerhalb davon arbeitet.

Siehe auch: Lane · Nachrichtenfluss · Sequenzfluss · BPMN
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Pooling
<!-- id: pooling · quellen: DD6 8.2 · stand: 2026-11 -->

Schicht in einem CNN, die eine Feature Map verkleinert, indem sie kleine Fenster zu einem Wert zusammenfasst: Max-Pooling nimmt den größten Wert, Average-Pooling den Mittelwert.

### Erklärung
Üblich ist ein 2 × 2-Fenster mit Schrittweite 2; das Fenster überlappt nicht, die Feature Map halbiert sich in jeder Richtung. Pooling hat keine lernbaren Gewichte. Es spart Rechenaufwand und Parameter, macht das Netz unempfindlicher gegen kleine Verschiebungen im Bild und mindert Overfitting. Max-Pooling behält den stärksten Treffer eines Fensters (gut für „ist das Muster irgendwo hier?“), Average-Pooling glättet. Größe der Ausgabe: $n_{aus} = \left\lfloor \frac{n - f}{s} \right\rfloor + 1$ mit $n$ = Kantenlänge der Eingabe, $f$ = Fenstergröße, $s$ = Schrittweite.

### Beispiel
Feature Map 4 × 4 mit den Zeilen `1 3 2 1`, `4 6 5 2`, `7 2 1 0`, `3 8 4 9`; Fenster 2 × 2, Schrittweite 2 → $\frac{4 - 2}{2} + 1 = 2$, Ausgabe 2 × 2.

- **Max-Pooling:** oben links max(1; 3; 4; 6) = 6, oben rechts max(2; 1; 5; 2) = 5, unten links max(7; 2; 3; 8) = 8, unten rechts max(1; 0; 4; 9) = 9 → `6 5` / `8 9`.
- **Average-Pooling:** oben links $\frac{1 + 3 + 4 + 6}{4} = 3{,}5$, oben rechts $\frac{2 + 1 + 5 + 2}{4} = 2{,}5$, unten links $\frac{7 + 2 + 3 + 8}{4} = 5$, unten rechts $\frac{1 + 0 + 4 + 9}{4} = 3{,}5$ → `3,5 2,5` / `5 3,5`.

Aus 16 Werten werden 4, also 75 % weniger.

### Abgrenzung
Die **Faltung** (Filter) lernt Gewichte und erzeugt Feature Maps; **Pooling** verkleinert sie nur nach einer festen Regel. Mit „Connection Pooling“ bei Datenbanken hat es nichts zu tun.

### Prüfungsfalle
Annehmen, Pooling werde trainiert (es hat keine Gewichte), oder Max- und Average-Pooling gleichsetzen.

### Merksatz
Pooling fasst zusammen: Max behält den stärksten Treffer, Average den Durchschnitt.

Siehe auch: CNN (Convolutional Neural Network) · Neuronale Netze · Deep Learning · Overfitting
Mehr: Deep Dive 6, 8.2

## Portfolioanalyse
<!-- id: portfolioanalyse · quellen: Karte DD5, DD5 6.5 · stand: 2026-10 -->

Strategische Analysemethode (BCG-Matrix), die Produkte nach Marktwachstum und relativem Marktanteil in vier Felder einordnet: Stars, Cash Cows, Question Marks und Poor Dogs.

### Erklärung
Die Matrix hat zwei Achsen: senkrecht das **Marktwachstum**, waagerecht den **relativen Marktanteil** (eigener Anteil im Verhältnis zum stärksten Konkurrenten). Aus der Lage leitet man Normstrategien ab.

| | niedriger Marktanteil | hoher Marktanteil |
|---|---|---|
| **hohes Wachstum** | Question Marks – ausbauen oder aufgeben | Stars – investieren |
| **niedriges Wachstum** | Poor Dogs – abbauen | Cash Cows – Gewinne abschöpfen |

### Beispiel
Im Möbelhaus sind Büromöbel eine Cash Cow (gesättigter Markt, Marktführer in der Region); ergonomische Homeoffice-Ausstattung ist ein Question Mark – der Markt wächst, der eigene Anteil ist noch klein.

### Abgrenzung
Die **SWOT-Analyse** stellt interne Stärken/Schwächen externen Chancen/Risiken gegenüber; die **ABC-Analyse** ordnet nach Wertanteil, nicht nach Marktposition.

### Prüfungsfalle
Cash Cows mit Stars verwechseln – Cash Cows haben **niedriges** Wachstum, finanzieren aber mit ihren Überschüssen Stars und Question Marks.

### Merksatz
Wachstum nach oben, Marktanteil nach rechts – Kühe melken, Sterne fördern, Hunde abgeben.

Siehe auch: SWOT-Analyse · ABC-Analyse · Benchmarking
Mehr: Deep Dive 5, 6.5

## POST
<!-- id: post · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

HTTP-Methode zum Neuanlegen einer Ressource; weder sicher noch idempotent.

### Erklärung
POST wird an die Sammlungs-URI geschickt (`/reparaturauftraege`), der Server vergibt die ID und antwortet mit **201 Created**, meist mit der Adresse der neuen Ressource. Weil jede Ausführung einen weiteren Datensatz erzeugt, ist POST nicht idempotent – ein wiederholter Aufruf nach einem Timeout kann zu Dubletten führen. Abhilfe schafft z. B. ein vom Client mitgeschickter eindeutiger Schlüssel, den der Server prüft.

### Beispiel
```json
POST /reparaturauftraege
{ "kunden_id": 3, "beschreibung": "Stuhlbein locker" }
```
Antwort: 201 Created, neue Ressource `/reparaturauftraege/5002`. Klickt der Kunde nach einer Zeitüberschreitung erneut, entsteht ohne Schutz Auftrag 5003.

### Abgrenzung
| Methode | Zweck | Idempotent |
|---|---|---|
| POST | neu anlegen | nein |
| PUT | vollständig ersetzen | ja |
| PATCH | teilweise ändern | nicht garantiert |

### Prüfungsfalle
POST als idempotent bezeichnen – es ist die einzige der Standardmethoden, die bei Wiederholung sicher etwas Neues erzeugt.

### Merksatz
POST zweimal = zwei Datensätze.

Siehe auch: PUT · PATCH · GET · Idempotent · HTTP-Statuscode
Mehr: Deep Dive 15, 3.2

## Postleitzahlen als Text
<!-- id: postleitzahlen-als-text · quellen: DD15 1.3, DD15 2.2 · stand: 2026-10 -->

Datentyp-Regel: Postleitzahlen werden als Zeichenkette gespeichert, nicht als Zahl, weil sonst führende Nullen verloren gehen.

### Erklärung
Postleitzahlen sehen aus wie Zahlen, sind aber **Kennungen** auf Nominalskala: Man rechnet nicht mit ihnen. Als Zahl gespeichert, wird aus 04109 (Leipzig) 4109 – die PLZ ist danach ungültig, Abgleiche und Dublettenprüfung schlagen fehl. Dasselbe gilt für Telefon-, Kunden- oder Artikelnummern mit führender Null. In JSON gehört die PLZ in Anführungszeichen.

### Beispiel
```sql
plz CHAR(5) NOT NULL CHECK (plz ~ '^[0-9]{5}$')
```
(Musterprüfung hier in PostgreSQL-Schreibweise.) In JSON: `"plz": "04109"`; `"plz": 04109` ist ungültig.

### Abgrenzung
Gleiche Falle bei Excel-Importen: CSV ohne Typangabe – die Tabellenkalkulation macht aus „04109“ automatisch 4109.

### Prüfungsfalle
Einen Mittelwert über Postleitzahlen bilden – das ist auf Nominalskala sinnlos.

### Merksatz
Womit man nicht rechnet, ist Text.

Siehe auch: Formatprüfung · Nominalskala · JSON · CSV
Mehr: Deep Dive 15, 1.3

## Praktikum
<!-- id: praktikum · quellen: Karte DD13, DD25 Teil 2, DD32 Teil 4, DD33 Teil 3 · stand: 2026-11 -->

Befristetes Verhältnis, in dem jemand praktische Kenntnisse und Erfahrungen für einen Beruf erwirbt, ohne dass es eine Berufsausbildung oder ein Arbeitsverhältnis ist (§ 26 BBiG); das Lernen steht im Vordergrund, nicht die Arbeitsleistung.

Auch: Praktikant, Schülerpraktikum, Pflichtpraktikum, Orientierungspraktikum

### Erklärung
Für Praktikanten gelten nach § 26 BBiG einzelne Regeln des Ausbildungsrechts entsprechend (z. B. Pflichten, Zeugnis); eine schriftliche Vertragsabfassung ist nicht vorgeschrieben, aber üblich und sinnvoll. Wer in Wahrheit ein reguläres Arbeitsverhältnis führt, ist Arbeitnehmer, egal wie der Vertrag heißt.

**Mindestlohn (§ 22 MiLoG):** Praktikanten gelten grundsätzlich als Arbeitnehmer und erhalten den gesetzlichen Mindestlohn (2026: 13,90 € je Stunde). Ausgenommen sind: ein **Pflichtpraktikum** (Schul-, Ausbildungs- oder Hochschulordnung), ein **Orientierungspraktikum** bis drei Monate, ein **ausbildungsbegleitendes Praktikum** bis drei Monate (nicht, wenn zuvor schon eines beim selben Betrieb bestand) sowie Einstiegsqualifizierung und Berufsausbildungsvorbereitung. Minderjährige ohne abgeschlossene Berufsausbildung haben ebenfalls keinen Mindestlohnanspruch.

**Schülerpraktikum:** Kinder unter 15 dürfen nicht beschäftigt werden, außer im Betriebspraktikum während der Vollzeitschulpflicht (§ 5 Abs. 2 JArbSchG); dabei gelten die Schutzvorschriften des JArbSchG (z. B. höchstens 7 Stunden täglich und 35 Stunden wöchentlich, Pausen, Nachtruhe). Schülerpraktikanten unter 16 sind bei der Betriebsratswahl nicht wahlberechtigt.

### Beispiel
Zwei noch vollzeitschulpflichtige Schüler (15 Jahre) absolvieren zwei Wochen ein Pflichtpraktikum bei der Möbelhaus Nordholz GmbH: kein Mindestlohn, Arbeitszeit höchstens 7 Stunden täglich und 35 Stunden wöchentlich (§ 7 JArbSchG), keine Wahlberechtigung bei der Betriebsratswahl (unter 16). Ein Studierender macht ein freiwilliges Praktikum über sechs Monate: Mindestlohn von 13,90 €/Std., da freiwillig und länger als drei Monate.

### Abgrenzung
Das **Ausbildungsverhältnis** folgt dem BBiG mit Ausbildungsplan, Prüfung und Mindestausbildungsvergütung; der **Werkstudent** arbeitet als Arbeitnehmer neben dem Studium. Die **Probezeit** gehört zu einem Arbeits- oder Ausbildungsverhältnis, ein Probearbeiten ist kein Praktikum.

### Prüfungsfalle
Jedes Praktikum für mindestlohnfrei halten. Mindestlohnfrei sind nur die genannten Fälle (Pflicht, Orientierung oder begleitend bis drei Monate); ein freiwilliges Praktikum über drei Monate ist es nicht.

### Merksatz
Praktikum heißt lernen statt arbeiten; mindestlohnfrei nur bei Pflicht oder bis drei Monate Orientierung.

Siehe auch: BBiG · JArbSchG · Mindestlohn · Wahlberechtigt · Arbeitsvertrag · Unfallversicherung
Mehr: Deep Dive 13, 2.4 · Deep Dive 25, Teil 4 · Deep Dive 33, Teil 3

## Prävention
<!-- id: pravention · quellen: DD9 4.2, DD9 Teil 5 · stand: 2026-10 -->

Datenqualitätsmaßnahmen, die Fehler schon bei der Entstehung verhindern, statt sie später zu bereinigen – etwa die Dublettenprüfung bereits bei der Neuanlage.

### Erklärung
Bereinigung ist Symptombehandlung: Wer nur bereinigt, bereinigt jeden Monat erneut. Prävention setzt an der Ursache an – technisch (Pflichtfelder, `CHECK`, `UNIQUE`, Auswahllisten, Fremdschlüssel, Normalisierung, Dublettenprüfung bei der Erfassung) und organisatorisch (Data Owner und Data Steward, Erfassungsrichtlinien, Schulung, regelmäßige Messung).

### Beispiel
Nach der Bereinigung von 2.400 Kundendubletten führt das Möbelhaus eine Ähnlichkeitssuche im Erfassungsformular ein: Bei „Braun G.m.b.H.“ schlägt das System den bestehenden Kunden „Braun GmbH“ vor, bevor ein neuer Satz entsteht.

### Abgrenzung
| Ansatz | Zeitpunkt | Wirkung |
|---|---|---|
| Bereinigung (Data Cleansing) | nachträglich | korrigiert den Ist-Bestand |
| Prävention | bei der Entstehung | verhindert neue Fehler |

### Prüfungsfalle
Auf „Datenqualität sicherstellen“ nur mit Bereinigung antworten – sehr gute Antworten nennen auch Prävention und Zuständigkeiten.

### Merksatz
Bereinigen repariert, Prävention verhindert.

Siehe auch: Dublette · Pflichtfelder · Plausibilitätsprüfung · Data Steward
Mehr: Deep Dive 9, 4.2 · Deep Dive 9, Teil 5

## Precision
<!-- id: precision · quellen: Karte DD7, DD7 2.2, DD7 2.4 · stand: 2026-10 -->

Kennzahl der Konfusionsmatrix: Anteil der als positiv vorhergesagten Fälle, die wirklich positiv sind – $\text{Precision} = \frac{TP}{TP + FP}$.

### Erklärung
TP (richtig positiv) sind die Fälle, die das Modell als positiv vorhersagt und die es wirklich sind; FP (falsch positiv) sind die Fälle, die es als positiv vorhersagt, die aber negativ sind. TP + FP ist also die Spalte der positiven Vorhersagen in der Konfusionsmatrix. Precision (positiver Vorhersagewert) beantwortet: Wie verlässlich ist ein Alarm des Modells? Sie ist wichtig, wenn **Fehlalarme (FP) teuer** sind. Precision und Recall lassen sich meist nur gegeneinander verbessern: Eine niedrigere Entscheidungsschwelle findet mehr echte Fälle, erzeugt aber mehr Fehlalarme.

### Beispiel
Das Reklamationsmodell sagt 150 Reklamationen voraus, 60 davon treten ein (TP = 60, FP = 90):
$\text{Precision} = \frac{60}{60 + 90} = \frac{60}{150}$ = 40 \%.
Nur 4 von 10 Alarmen sind berechtigt.

### Abgrenzung
| Kennzahl | Nenner | Frage |
|---|---|---|
| Precision | alle positiv **vorhergesagten** (Spalte) | Wie oft stimmt ein Alarm? |
| Recall | alle **tatsächlich** positiven (Zeile) | Wie viele echte Fälle werden gefunden? |
| Accuracy | alle Fälle | Wie viele insgesamt richtig? |

### Prüfungsfalle
„Genauigkeit“ ohne Formel schreiben – im Deutschen steht das Wort teils für Precision, teils für Accuracy; immer englischen Begriff und Formel nennen.

### Merksatz
Precision: Wenn das Modell Alarm schlägt – wie oft zu Recht?

Siehe auch: Recall · F1-Maß · Accuracy · Konfusionsmatrix
Mehr: Deep Dive 7, 2.2 · Deep Dive 7, 2.4

## Prepared Statements
<!-- id: prepared-statements · quellen: DD10 4.5 · stand: 2026-11 -->

Auch: Parametrisierte Abfragen

SQL-Anweisungen mit Platzhaltern, bei denen die Werte getrennt vom Befehl an die Datenbank übergeben werden – der wirksamste Schutz gegen SQL-Injection.

### Erklärung
In zwei Schritten: Die Datenbank erhält zuerst die Anweisung mit Platzhaltern (`?` oder `:name`) und legt die Struktur fest (**prepare**). Danach werden die Werte gebunden und die Anweisung ausgeführt (**execute**). Die Werte werden nie als SQL-Code gelesen, auch wenn sie Anführungszeichen oder SQL-Schlüsselwörter enthalten. Nebeneffekt: Bei wiederholter Ausführung kann das System den vorbereiteten Plan wiederverwenden.

Grenzen:
- Platzhalter gibt es nur für **Werte**, nicht für Tabellen- oder Spaltennamen. Dort hilft eine feste Liste erlaubter Namen (Whitelist).
- Werte per Textverkettung in die Anweisung einzubauen, bevor man sie „vorbereitet“, hebt den Schutz auf.
- ORMs und gespeicherte Prozeduren sind nur sicher, wenn sie intern nicht ebenfalls SQL zusammenbauen.

### Beispiel
Unsicher (Eingabe wird in den Befehl geklebt) und sicher (Pseudocode):
```
sql = "SELECT * FROM kunde WHERE email = '" + eingabe + "'"   -- unsicher
sql = "SELECT * FROM kunde WHERE email = ?"                    -- sicher
ergebnis = datenbank.ausfuehren(sql, [eingabe])
```
Gibt jemand `x' OR '1'='1` ein, sucht die Datenbank nach genau diesem Text als E-Mail-Adresse und findet keine Zeile. Der Angriffsversuch bleibt wirkungslos.

### Abgrenzung
**Eingabevalidierung** prüft, ob eine Eingabe sinnvoll ist, und ergänzt den Schutz. **Escaping** (Sonderzeichen entschärfen) ist fehleranfälliger als Parametrisierung. „Parametrisierte Abfrage“ meint dasselbe wie Prepared Statement.

### Prüfungsfalle
Anführungszeichen herausfiltern oder Werte „von Hand“ in die Anweisung einsetzen und das als sicher bezeichnen. Sicher ist nur die Trennung von Befehl und Daten.

### Merksatz
Befehl und Daten getrennt übergeben – dann wird aus Eingabe nie Code.

Siehe auch: SQL-Injection · Security by Design · Least Privilege
Mehr: Deep Dive 10, 4.5

## Primärschlüssel
<!-- id: primarschlussel · quellen: Karte DD1, DD2 1.2 · stand: 2026-10 -->

Attribut oder Attributkombination, die jede Zeile einer Tabelle eindeutig identifiziert; der Wert darf nicht NULL sein und sich nicht wiederholen.

### Erklärung
Aus den **Schlüsselkandidaten** – minimalen eindeutigen Attributkombinationen – wird einer als Primärschlüssel gewählt; die übrigen bleiben Alternativschlüssel (`UNIQUE`). Oft nimmt man einen **Surrogatschlüssel** (künstliche, fortlaufende ID), weil er stabil, kurz und ohne Fachbedeutung ist. Der Primärschlüssel ist das Ziel von Fremdschlüsseln und sichert so die referenzielle Integrität. Ein Primärschlüssel aus mehreren Attributen heißt zusammengesetzter Schlüssel.

### Beispiel
```sql
CREATE TABLE kunde (
  kunden_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
```
In bestellposition ist (bestell_id, produkt_id) der zusammengesetzte Primärschlüssel.

### Abgrenzung
Der **Fremdschlüssel** verweist auf einen Primärschlüssel, darf sich wiederholen und – je nach Kardinalität – NULL sein.

### Prüfungsfalle
Name oder E-Mail-Adresse als Primärschlüssel wählen – beide können sich ändern oder doppelt vorkommen.

### Merksatz
Eindeutig, nie leer, möglichst nie geändert.

Siehe auch: Fremdschlüssel · Schlüsselkandidat · Surrogatschlüssel · Zusammengesetzter Schlüssel
Mehr: Deep Dive 2, 1.2

## Privacy by Design
<!-- id: privacy-by-design · quellen: Karte DD10, DD10 2.4 · stand: 2026-10 -->

Pflicht, Datenschutz schon bei der Planung und Gestaltung von Systemen und Verfahren technisch und organisatorisch einzubauen (Art. 25 Abs. 1 DSGVO).

### Erklärung
Der Verantwortliche muss geeignete Maßnahmen wie Pseudonymisierung und Datenminimierung von Anfang an vorsehen – nicht nachträglich ergänzen. Ergänzt wird das durch **Privacy by Default** (Art. 25 Abs. 2): Die Voreinstellungen müssen so gewählt sein, dass nur die für den Zweck erforderlichen Daten verarbeitet werden. Beide Pflichten treffen den Verantwortlichen, nicht nur den Softwarehersteller.

### Beispiel
Beim Entwurf des Process-Mining-Dashboards plant das Möbelhaus von vornherein: Resource-Spalte pseudonymisiert, Auswertung nur auf Teamebene ab fünf Personen, Rohdaten nach 90 Tagen gelöscht. Voreinstellung (by Default): Das Dashboard zeigt keine Einzelpersonen.

### Abgrenzung
**Security by Design** baut IT-Sicherheit von Anfang an ein; Privacy by Design den Schutz der Betroffenen. TOM nach Art. 32 sind die konkreten Schutzmaßnahmen im Betrieb.

### Prüfungsfalle
Privacy by Default mit „Datenschutzerklärung anzeigen“ verwechseln – gemeint sind datensparsame Grundeinstellungen.

### Merksatz
Datenschutz wird eingebaut, nicht angebaut.

Siehe auch: Security by Design · Datenminimierung · Pseudonymisierung · Technische und organisatorische Maßnahmen
Mehr: Deep Dive 10, 2.4

## Private Vorsorge
<!-- id: private-vorsorge · quellen: DD14 1.5 · stand: 2026-10 -->

Dritte Säule der Altersvorsorge: selbst finanzierte Vorsorge neben gesetzlicher Rente und betrieblicher Altersversorgung, z. B. private Rentenversicherung, Fonds oder Immobilien.

### Erklärung
Die gesetzliche Rente arbeitet im Umlageverfahren und sichert den Lebensstandard im Alter in der Regel nicht allein. Deshalb gibt es das **Drei-Säulen-Modell**: gesetzliche Rente, betriebliche Altersversorgung (z. B. Entgeltumwandlung mit Arbeitgeberzuschuss) und private Vorsorge. Private Vorsorge ist freiwillig; einzelne Formen werden staatlich durch Zulagen oder Steuervorteile gefördert.

### Beispiel
Lea legt monatlich 50 € in einen Fondssparplan an und nutzt zusätzlich die Entgeltumwandlung des Möbelhauses – Säule 3 und Säule 2 ergänzen ihre gesetzliche Rente.

### Abgrenzung
| Säule | Träger | Finanzierung |
|---|---|---|
| gesetzliche Rente | Deutsche Rentenversicherung | Pflichtbeiträge, Umlageverfahren |
| betriebliche Altersversorgung | Arbeitgeber/Versorgungseinrichtung | Arbeitgeber und/oder Entgeltumwandlung |
| private Vorsorge | Versicherer, Banken, eigenes Vermögen | freiwillig, aus dem Nettoeinkommen |

### Merksatz
Gesetzlich, betrieblich, privat – erst alle drei zusammen sichern den Lebensstandard.

Siehe auch: Drei Säulen · Gesetzliche Rente · Betriebliche Altersversorgung · Umlageverfahren
Mehr: Deep Dive 14, 1.5

## Probezeit
<!-- id: probezeit · quellen: Karte DD13, DD13 1.4 · stand: 2026-10 -->

Erster Abschnitt eines Berufsausbildungsverhältnisses von mindestens einem und höchstens vier Monaten (§ 20 BBiG), in dem beide Seiten jederzeit ohne Frist und ohne Grund kündigen können.

### Erklärung
Die Probezeit ist im Ausbildungsverhältnis Pflicht und dient beiden Seiten zur Prüfung, ob die Ausbildung passt. Die Kündigung muss auch in der Probezeit **schriftlich** erfolgen; die elektronische Form ist ausgeschlossen (§ 22 Abs. 3 BBiG). Nach der Probezeit kann der Betrieb nur noch fristlos aus wichtigem Grund kündigen; der Azubi zusätzlich mit 4 Wochen Frist, wenn er die Ausbildung aufgibt oder den Beruf wechselt (§ 22 Abs. 2 BBiG).

### Beispiel
Jonas beginnt am 01.08. mit vier Monaten Probezeit. Kündigt er am 20.11. schriftlich, endet die Ausbildung sofort. Eine Kündigung per E-Mail wäre unwirksam.

### Abgrenzung
Im **Arbeitsverhältnis** ist die Probezeit freiwillig (höchstens 6 Monate) und es gilt eine Kündigungsfrist von 2 Wochen (§ 622 Abs. 3 BGB) – in der Ausbildung gibt es in der Probezeit gar keine Frist.

### Prüfungsfalle
„In der Probezeit genügt eine mündliche Kündigung“ – auch hier gilt Schriftform.

### Merksatz
Ausbildung: 1 bis 4 Monate, jederzeit, ohne Grund – aber schriftlich.

Siehe auch: BBiG · Ausbildungsbetrieb · Kündigungsschutzgesetz
Mehr: Deep Dive 13, 1.4

## Process Mining
<!-- id: process-mining · quellen: Karte DD5, DD5 Prüfungsrelevanz, DD5 Teil 5 · stand: 2026-10 -->

Rekonstruktion und Analyse der tatsächlich gelebten Prozesse aus den Event Logs der IT-Systeme.

### Erklärung
Grundlage ist ein **Event Log** mit mindestens Case ID, Activity und Timestamp, optional Resource. Drei Anwendungsarten: **Discovery** (Prozessmodell aus den Daten erzeugen), **Conformance Checking** (Ist gegen Soll prüfen) und **Enhancement** (Modell um Zeiten, Kosten, Häufigkeiten anreichern). So werden Varianten, Engpässe, Schleifen und Regelverstöße sichtbar – objektiv und vollständig, aber ohne das „Warum“; deshalb ergänzt man Interviews. Es verbindet Prozessanalyse und Datenanalyse und ist damit das Alleinstellungsmerkmal der Fachrichtung.

### Beispiel
Die Auswertung von 1.200 Reparaturaufträgen zeigt 37 Prozessvarianten; in 8 % der Fälle wird die Freigabe des Kostenvoranschlags übersprungen (Conformance Checking).

### Abgrenzung
Klassische Prozessaufnahme per Interview zeigt den gedachten Prozess, Process Mining den tatsächlichen.

### Prüfungsfalle
Rechtliches vergessen: Mit Resource-Spalte sind die Daten personenbezogen, der Betriebsrat bestimmt nach § 87 Abs. 1 Nr. 6 BetrVG mit – die Eignung zur Leistungskontrolle genügt.

### Merksatz
Process Mining zeigt, wie der Prozess wirklich läuft – nicht, wie er gedacht ist.

Siehe auch: Event Log · Case ID · Discovery · Conformance Checking
Mehr: Deep Dive 5, Prüfungsrelevanz · Deep Dive 5, Teil 5

## Product Backlog
<!-- id: product-backlog · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Scrum-Artefakt: geordnete, sich laufend weiterentwickelnde Liste dessen, was am Produkt verbessert werden soll; verantwortet vom Product Owner, Verpflichtung (Commitment): **Produktziel**.

### Erklärung
Das Product Backlog ist die einzige Quelle für die Arbeit des Scrum Teams. Oben stehen die wichtigsten, gut verstandenen Einträge (z. B. User Stories), weiter unten gröbere Ideen. Der Product Owner ordnet es nach Wert; im laufenden **Backlog Refinement** werden Einträge zerlegt, präzisiert und geschätzt – das ist kein eigenes Event. Im Sprint Planning wählen die Developers daraus die Einträge für den Sprint.

### Beispiel
Product Backlog für das Reparatur-Dashboard: 1. Durchlaufzeit je Filiale anzeigen, 2. Filter nach Zeitraum, 3. Export als CSV, 4. Push-Benachrichtigung bei Engpässen.

### Abgrenzung
| Artefakt | Inhalt | Commitment |
|---|---|---|
| Product Backlog | alles, was am Produkt getan werden könnte | Produktziel |
| Sprint Backlog | Auswahl und Plan für den aktuellen Sprint | Sprint-Ziel |
| Inkrement | fertiges, nutzbares Ergebnis | Definition of Done |

### Prüfungsfalle
Das Backlog als vollständige, feste Anforderungsliste wie ein Lastenheft behandeln – es ist nie fertig.

### Merksatz
Product Backlog: eine Liste, ein Verantwortlicher, ständig in Bewegung.

Siehe auch: Product Owner · Sprint Backlog · Scrum · Inkrement
Mehr: Deep Dive 12, Teil 2

## Product Owner
<!-- id: product-owner · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Scrum-Verantwortlichkeit für den Wert des Produkts und die Ordnung des Product Backlogs.

### Erklärung
Der Product Owner ist eine Person, kein Gremium. Er formuliert das Produktziel, erstellt und ordnet die Backlog-Einträge und sorgt dafür, dass sie verständlich sind. Er vertritt Kunden und Stakeholder gegenüber dem Team. Wie die Arbeit im Sprint erledigt wird, entscheiden dagegen die Developers. Seit dem Scrum Guide 2020 spricht man von Verantwortlichkeiten (accountabilities) statt Rollen.

### Beispiel
Die Leiterin des Reparaturservice ist Product Owner für das neue Dashboard. Sie entscheidet, dass die Durchlaufzeit je Filiale vor dem CSV-Export kommt, weil die Filialleitungen sie dringender brauchen.

### Abgrenzung
| Verantwortlichkeit | Aufgabe |
|---|---|
| Product Owner | **Was** und in welcher Reihenfolge – maximiert den Wert |
| Scrum Master | Scrum einführen, Hindernisse beseitigen, kein Vorgesetzter |
| Developers | **Wie** – erstellen in jedem Sprint ein nutzbares Inkrement |

### Prüfungsfalle
Den Product Owner als Projektleiter oder Vorgesetzten des Teams darstellen – er gibt keine Arbeitsanweisungen im Sprint.

### Merksatz
Der Product Owner bestimmt das Was, das Team das Wie.

Siehe auch: Product Backlog · Scrum Master · Developers · Scrum
Mehr: Deep Dive 12, Teil 2

## Produktionsfaktoren
<!-- id: produktionsfaktoren · quellen: Karte DD14, DD14 4.1 · stand: 2026-10 -->

Güter und Leistungen, die zur Herstellung anderer Güter eingesetzt werden; volkswirtschaftlich Arbeit, Boden und Kapital, heute ergänzt um Wissen.

### Erklärung
**Arbeit** ist jede menschliche Tätigkeit zur Einkommenserzielung, **Boden** umfasst Fläche, Rohstoffe und Standort, **Kapital** die produzierten Produktionsmittel wie Maschinen, Gebäude oder IT (Realkapital). **Wissen** (Bildung, Know-how, Daten) gilt in der Informationsgesellschaft als eigener Faktor. Die Faktoren werden kombiniert und sind teilweise austauschbar – etwa Arbeit durch Kapital bei der Automatisierung.

### Beispiel
Ein automatisierter Bericht ersetzt die monatliche manuelle Auswertung im Möbelhaus: Der Faktor Arbeit wird durch Kapital (Software, Server) und Wissen (ETL-Know-how) ersetzt.

### Abgrenzung
Betriebswirtschaftlich (nach Gutenberg) unterscheidet man stattdessen ausführende Arbeit, Betriebsmittel und Werkstoffe sowie dispositive Arbeit (Leitung) – nicht mit den volkswirtschaftlichen Faktoren mischen.

### Prüfungsfalle
Geld als Produktionsfaktor Kapital nennen – gemeint sind produzierte Produktionsmittel, Geldkapital ist nur Mittel zu ihrer Finanzierung.

### Merksatz
Arbeit, Boden, Kapital – und heute Wissen.

Siehe auch: Ökonomisches Prinzip
Mehr: Deep Dive 14, 4.1

## Programmablaufplan
<!-- id: programmablaufplan · quellen: Karte DD11, DD11 B3, DD17 4.1 · stand: 2026-10 -->

Flussdiagramm nach DIN 66001, das einen Algorithmus mit genormten Symbolen und Ablauflinien darstellt (PAP).

### Erklärung
Start und Ende sind Ovale bzw. abgerundete Rechtecke, Anweisungen Rechtecke, Verzweigungen Rauten mit ja/nein-Ausgängen, Ein- und Ausgaben Parallelogramme, Unterprogramme Rechtecke mit doppelten Seitenlinien. Schleifen entstehen durch eine Raute und einen Pfeil zurück. Weil beliebige Sprünge möglich sind, wird ein PAP schnell unübersichtlich – er zeigt den Kontrollfluss aber sehr anschaulich.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 80" width="380" height="80" role="img" aria-label="PAP-Symbole: Grenzstelle, Operation, Verzweigung, Ein-/Ausgabe, Unterprogramm">
<rect x="5" y="15" width="60" height="30" rx="15" class="dg-form"/>
<text x="35" y="34" text-anchor="middle" class="dg-klein">Start</text>
<rect x="80" y="15" width="60" height="30" class="dg-form"/>
<text x="110" y="34" text-anchor="middle" class="dg-klein">x ← 0</text>
<polygon points="185,8 220,30 185,52 150,30" class="dg-form"/>
<text x="185" y="34" text-anchor="middle" class="dg-klein">x &gt; 5?</text>
<polygon points="242,15 302,15 292,45 232,45" class="dg-form"/>
<text x="267" y="34" text-anchor="middle" class="dg-klein">Eingabe</text>
<rect x="312" y="15" width="64" height="30" class="dg-form"/>
<line x1="320" y1="15" x2="320" y2="45" class="dg-linie"/>
<line x1="368" y1="15" x2="368" y2="45" class="dg-linie"/>
<text x="344" y="34" text-anchor="middle" class="dg-klein">UP</text>
<text x="35" y="70" text-anchor="middle" class="dg-klein dg-leise">Grenze</text>
<text x="110" y="70" text-anchor="middle" class="dg-klein dg-leise">Operation</text>
<text x="185" y="70" text-anchor="middle" class="dg-klein dg-leise">Verzweigung</text>
<text x="267" y="70" text-anchor="middle" class="dg-klein dg-leise">Ein-/Ausgabe</text>
<text x="344" y="70" text-anchor="middle" class="dg-klein dg-leise">Unterprogr.</text>
</svg>
```

### Beispiel
Rabatt berechnen: Eingabe betrag → Raute „betrag > 1000?“ → ja: rabatt ← betrag · 0,05, nein: rabatt ← 0 → endbetrag ← betrag − rabatt → Ausgabe endbetrag.

### Abgrenzung
Das **Struktogramm** (Nassi-Shneiderman) kennt keine Sprünge und erzwingt strukturierte Programmierung; der PAP erlaubt sie.

### Prüfungsfalle
Raute ohne Beschriftung der Ausgänge oder Ein-/Ausgabe als Rechteck zeichnen – beides kostet Punkte.

### Merksatz
Oval, Rechteck, Raute, Parallelogramm – Start, Tun, Fragen, Ein-/Ausgabe.

Siehe auch: Struktogramm · Pseudocode · Unterprogramm
Mehr: Deep Dive 11, B3 · Deep Dive 17, 4.1

## Projekt
<!-- id: projekt · quellen: Karte DD12, DD12 1.1 · stand: 2026-10 -->

Einmaliges, zeitlich befristetes Vorhaben mit definiertem Ziel, begrenzten Ressourcen und eigener Projektorganisation.

### Erklärung
DIN 69901-5 kennzeichnet ein Projekt durch die **Einmaligkeit der Bedingungen in ihrer Gesamtheit** – z. B. Zielvorgabe, zeitliche, finanzielle und personelle Begrenzung, Abgrenzung gegenüber anderen Vorhaben, projektspezifische Organisation. Typische Merkmale: einmalig, befristet, zielorientiert, neuartig bzw. komplex, oft interdisziplinär. Zeit, Kosten und Leistung stehen im magischen Dreieck in Konkurrenz.

### Beispiel
Einführung eines Reparatur-Dashboards bis 31.03.2027 mit 40.000 € Budget und drei Beteiligten aus Fachbereich und IT – ein Projekt. Der monatliche Umsatzbericht ist dagegen Routine.

### Abgrenzung
Wiederkehrende **Routineaufgaben** (Linienarbeit) sind kein Projekt, auch wenn sie aufwendig sind.

### Prüfungsfalle
„Der jährliche Inventurbericht ist ein Projekt“ – fehlt die Einmaligkeit, ist es keins.

### Merksatz
Einmalig, befristet, zielgerichtet – sonst ist es Alltag.

Siehe auch: Magisches Dreieck · Projektstrukturplan · Pflichtenheft · Projektabschluss
Mehr: Deep Dive 12, 1.1

## Projektabschluss
<!-- id: projektabschluss · quellen: DD12 Teil 5 · stand: 2026-10 -->

Letzte Projektphase mit Ergebnisübergabe, Abschlussdokumentation, Lessons Learned und Entlastung bzw. Auflösung des Projektteams.

### Erklärung
Voraussetzung ist die **Abnahme** des Ergebnisses gegen das Pflichtenheft. Danach werden das Produkt an den Betrieb übergeben, ein abschließender Soll-Ist-Vergleich zu Terminen, Kosten und Leistung erstellt, Erfahrungen in den **Lessons Learned** festgehalten und das Team entlastet. Ohne geordneten Abschluss gehen Wissen und Verantwortlichkeiten verloren.

### Beispiel
Das Reparatur-Dashboard ist abgenommen. Abschlussbericht: Termin gehalten, Kosten 6 % über Plan wegen zusätzlicher Schnittstelle. Lessons Learned: Datenqualität der Quellsysteme früher prüfen. Der Betrieb geht an die BI-Abteilung über.

### Abgrenzung
Die **Abnahme** ist ein formaler Akt mit Rechtsfolgen (beim Werkvertrag u. a. Fälligkeit der Vergütung); der Projektabschluss umfasst sie und alles, was danach folgt.

### Prüfungsfalle
In der Projektdokumentation das Abschlusskapitel auf „hat funktioniert“ verkürzen – erwartet werden Soll-Ist-Vergleich und Reflexion.

### Merksatz
Übergeben, vergleichen, lernen, entlasten.

Siehe auch: Lessons Learned · Abnahme · Meilenstein
Mehr: Deep Dive 12, Teil 5

## Projektstrukturplan
<!-- id: projektstrukturplan · quellen: Karte DD12, DD12 3.1 · stand: 2026-10 -->

PSP: hierarchische Zerlegung eines Projekts in Teilaufgaben bis zu den Arbeitspaketen.

### Erklärung
Der PSP beantwortet, **was** alles zu tun ist – nicht wann. Die unterste Ebene bilden **Arbeitspakete**: kleinste planbare Einheiten mit eigenem Verantwortlichen, Aufwand und Ergebnis. Gegliedert wird objekt-, funktions- oder phasenorientiert. Der PSP ist die Grundlage für Aufwandsschätzung, Netzplan, Gantt-Diagramm und Kostenplanung.

### Beispiel
Projekt „Reparatur-Dashboard“ → 1 Analyse (1.1 Anforderungen aufnehmen, 1.2 Datenquellen prüfen) → 2 Umsetzung (2.1 ETL-Strecke, 2.2 Star-Schema, 2.3 Dashboard) → 3 Test und Abnahme → 4 Abschluss.

### Abgrenzung
| Werkzeug | Zeigt |
|---|---|
| Projektstrukturplan | was zu tun ist (Struktur) |
| Netzplan | Reihenfolge, Puffer, kritischer Pfad (Rechnen) |
| Gantt-Diagramm | Zeitachse (Kommunikation) |

### Prüfungsfalle
Im PSP Abhängigkeiten oder Termine einzeichnen – die gehören in Netzplan bzw. Gantt-Diagramm.

### Merksatz
Erst zerlegen (PSP), dann terminieren (Netzplan).

Siehe auch: Arbeitspaket · Netzplan · Gantt-Diagramm · Drei-Zeiten-Methode
Mehr: Deep Dive 12, 3.1

## Prokura
<!-- id: prokura · quellen: Karte DD14, DD14 3.3 · stand: 2026-10 -->

Umfassende handelsrechtliche Vollmacht für alle Geschäfte, die der Betrieb irgendeines Handelsgewerbes mit sich bringt (§§ 48 ff. HGB).

### Erklärung
Nur der Kaufmann bzw. sein gesetzlicher Vertreter kann Prokura erteilen, und zwar **ausdrücklich**; sie wird ins Handelsregister eingetragen, gezeichnet wird mit „ppa.“. Arten: Einzel-, Gesamt- und Filialprokura; sie ist jederzeit widerruflich. Erlaubt sind auch außergewöhnliche Geschäfte wie Kredite aufnehmen, Prozesse führen, Grundstücke kaufen. Nicht erlaubt: Grundstücke veräußern oder belasten (ohne besondere Befugnis, § 49 Abs. 2 HGB), Bilanz und Steuererklärung unterschreiben, Prokura erteilen, Insolvenz beantragen, das Geschäft verkaufen.

### Beispiel
Die Prokuristin des Möbelhauses nimmt einen Kredit über 200.000 € für ein neues Lager auf und kauft dafür ein Grundstück – zulässig. Das bisherige Lagergrundstück darf sie ohne besondere Befugnis nicht verkaufen.

### Abgrenzung
| | Prokura | Handlungsvollmacht |
|---|---|---|
| Umfang | Geschäfte irgendeines Handelsgewerbes | gewöhnliche Geschäfte dieses Betriebs |
| Eintragung | Handelsregister | keine |
| Zeichnung | ppa. | i. V. bzw. i. A. |
| Kredit aufnehmen | ja | nur mit besonderer Befugnis |

### Prüfungsfalle
Grundstücke **kaufen** und **verkaufen** gleich behandeln – kaufen darf der Prokurist, verkaufen oder belasten nicht.

### Merksatz
Prokura: fast alles – nur nicht Grundstücke weggeben, Bilanz unterschreiben, Prokura weitergeben.

Siehe auch: Handlungsvollmacht
Mehr: Deep Dive 14, 3.3

## Proprietäre Software
<!-- id: proprietare-software · quellen: DD14 2.7 · stand: 2026-10 -->

Software, deren Quellcode nicht offengelegt ist und deren Nutzung nur im Rahmen der vom Hersteller eingeräumten Lizenz erlaubt ist.

### Erklärung
Der Kunde erwirbt kein Eigentum an der Software, sondern Nutzungsrechte: als Einzelplatz-, Mehrplatz- oder Volumenlizenz, als **Abonnement** oder als **Software as a Service** (laufende Gebühr, Betrieb beim Anbieter). Ändern, weitergeben oder über die Lizenz hinaus installieren ist nicht erlaubt. Vorteile sind Support und Gewährleistung aus einer Hand, Nachteile Kosten und Abhängigkeit vom Anbieter (Lock-in).

### Beispiel
Das Möbelhaus nutzt ein BI-Werkzeug mit 25 Named-User-Lizenzen. Ein 26. Filialleiter braucht eine zusätzliche Lizenz, auch wenn technisch der Zugang funktionieren würde.

### Abgrenzung
**Open Source** legt den Quellcode offen und erlaubt Nutzung und Änderung – aber nach Lizenzbedingungen (permissiv wie MIT, Copyleft wie GPL). Kostenlose „Freeware“ ist trotzdem proprietär, wenn der Code verschlossen bleibt.

### Prüfungsfalle
„Kostenlos“ mit „Open Source“ gleichsetzen – entscheidend sind Quellcode und Lizenzrechte, nicht der Preis.

### Merksatz
Proprietär: nutzen ja, ändern und weitergeben nein.

Siehe auch: Open Source · Copyleft · Urheberrecht · Patent
Mehr: Deep Dive 14, 2.7

## Prototyp
<!-- id: prototyp · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Bereits bedienbarer (klickbarer) Entwurf einer Anwendung oder eines Dashboards, mit dem sich Abläufe vor der eigentlichen Umsetzung testen lassen.

### Erklärung
Prototypen machen Anforderungen früh erlebbar: Nutzer klicken sich durch, und Missverständnisse fallen auf, bevor eine Zeile SQL geschrieben ist – die billigste Form der Qualitätssicherung. Bewertet werden sie im **Usability-Test**: Echte Nutzer lösen typische Aufgaben, man beobachtet, wo sie stocken. Ein Wegwerf-Prototyp dient nur der Klärung, ein evolutionärer wird schrittweise zum Produkt ausgebaut.

### Beispiel
Für das Reparatur-Dashboard baut das Team einen klickbaren Entwurf mit Beispieldaten. Im Test suchen drei von fünf Filialleitern den Zeitraumfilter vergeblich – er wird nach oben verschoben.

### Abgrenzung
| Stufe | Merkmal |
|---|---|
| Wireframe | grobe Skizze der Anordnung, Kästen statt Diagramme |
| Mock-up | statischer, realistisch gestalteter Entwurf |
| Prototyp | klickbar, Abläufe testbar |

### Merksatz
Wireframe zeigt die Anordnung, Mock-up das Aussehen, Prototyp das Verhalten.

Siehe auch: Wireframe · Mock-up · Usability-Test
Mehr: Deep Dive 11, A5

## Prozentpunkte
<!-- id: prozentpunkte · quellen: Karte DD4, DD4 3.2, DD11 A3 · stand: 2026-10 -->

Einheit für die absolute Differenz zweier Prozentwerte – von 10 % auf 12 % sind es +2 Prozentpunkte, aber +20 % relativ.

Auch: Prozent statt Prozentpunkte

### Erklärung
Vergleicht man zwei Prozentangaben, gibt es zwei Aussagen: die **absolute** Differenz in Prozentpunkten und die **relative** Änderung in Prozent, bezogen auf den Ausgangswert. Beide sind korrekt, beschreiben aber Verschiedenes. Wer in Berichten „Prozent“ statt „Prozentpunkte“ (oder umgekehrt) schreibt, lässt eine Veränderung je nach Absicht größer oder kleiner wirken – eine verbreitete Manipulationstechnik.

### Beispiel
Fehlerquote im Reparaturservice steigt von 4 % auf 6 %:
absolut $6\ \% - 4\ \%$ = 2 Prozentpunkte, relativ $\frac{6 - 4}{4} \cdot 100$ = +50 \%.

### Abgrenzung
„Die Quote stieg um 2 %“ ist mehrdeutig: Gemeint sein könnten 4,08 % (relativ) oder 6 % (Punkte).

### Prüfungsfalle
Bei Zinsen, Quoten oder Anteilen die Änderung in Prozent angeben, wenn Prozentpunkte gemeint sind.

### Merksatz
Prozentpunkte subtrahieren, Prozent teilen durch den Ausgangswert.

Siehe auch: Lügenfaktor · Fehlerquote
Mehr: Deep Dive 4, 3.2 · Deep Dive 11, A3

## Prozesskosten je Fall
<!-- id: prozesskosten-je-fall · quellen: Karte DD5, DD5 3.2 · stand: 2026-10 -->

Kostenkennzahl eines Prozesses: Bearbeitungszeit · Kostensatz, ggf. plus Sachkosten je Durchlauf.

### Erklärung
Die Kennzahl zeigt, was ein einzelner Prozessdurchlauf kostet, und ist Grundlage für Wirtschaftlichkeitsrechnungen: Zeitersparnis je Fall · Fallzahl · Kostensatz = jährliche Einsparung. Angesetzt wird die **Bearbeitungszeit**, nicht die Durchlaufzeit – Liegezeit verursacht zwar Wartezeit, aber in der Regel keine Personalkosten.

### Beispiel
Ein Reparaturauftrag braucht 1,5 h Bearbeitung bei 48 €/h Kostensatz und 8 € Sachkosten:
$1{,}5 \cdot 48 + 8 = 72 + 8$ = 80 € je Fall.
Bei 2.000 Aufträgen im Jahr spart eine Verkürzung um 0,5 h: $0{,}5 \cdot 2.000 \cdot 48$ = 48.000 €.

### Abgrenzung
**Nacharbeitskosten** (Nacharbeitszeit · Kostensatz · Fehlerzahl) messen nur die Kosten schlechter Qualität; die Prozesskosten je Fall den regulären Durchlauf.

### Prüfungsfalle
Mit der Durchlaufzeit statt der Bearbeitungszeit rechnen – dann werden Wartezeiten als Personalkosten gezählt.

### Merksatz
Kosten entstehen bei der Arbeit, nicht beim Warten.

Siehe auch: Durchlaufzeit · Fehlerquote · Liegezeit
Mehr: Deep Dive 5, 3.2

## Prozesswegweiser
<!-- id: prozesswegweiser · quellen: DD5 2.3 · stand: 2026-10 -->

Symbol der erweiterten EPK, das auf eine andere EPK verweist – dargestellt als Funktionssymbol vor einem Sechseck.

### Erklärung
Große Prozesse werden in mehrere EPKs aufgeteilt. Der Prozesswegweiser markiert die Stelle, an der der Ablauf in einem anderen Modell weitergeht oder von dort herkommt, und trägt dessen Namen. So bleiben einzelne EPKs übersichtlich und lassen sich trotzdem verknüpfen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60" width="220" height="60" role="img" aria-label="Prozesswegweiser: abgerundetes Rechteck vor einem Sechseck">
<polygon points="20,10 120,10 135,30 120,50 20,50 5,30" class="dg-form"/>
<rect x="60" y="15" width="150" height="30" rx="8" class="dg-form"/>
<text x="135" y="34" text-anchor="middle" class="dg-klein">Rechnungsstellung</text>
</svg>
```

### Beispiel
Am Ende der EPK „Reparatur durchführen“ steht nach dem Ereignis „Reparatur ist abgeschlossen“ der Prozesswegweiser „Rechnungsstellung“ – dort beginnt die nächste EPK.

### Abgrenzung
Weitere eEPK-Zusatzobjekte: **Organisationseinheit** (Ellipse), **Informationsobjekt** (Rechteck), **Anwendungssystem** (Rechteck mit Doppellinien). In BPMN übernimmt diese Aufgabe der aufklappbare Teilprozess.

### Merksatz
Der Prozesswegweiser zeigt: Hier geht es in einer anderen EPK weiter.

Siehe auch: EPK · Erweiterte EPK (eEPK) · Organisationseinheit
Mehr: Deep Dive 5, 2.3

## Prüfen und protokollieren
<!-- id: prufen-und-protokollieren · quellen: DD11 B5 · stand: 2026-10 -->

Standardalgorithmus der Datenprüfung: je Datensatz Regeln prüfen, bei einem Verstoß den Fehlerzähler erhöhen und den fehlerhaften Satz ausgeben.

### Erklärung
Das Muster kombiniert eine Schleife über alle Datensätze mit Verzweigungen je Prüfregel. Fehlerhafte Sätze werden nicht stillschweigend verworfen, sondern protokolliert (oder in eine Quarantäne ausgeleitet), damit die Ursache geklärt werden kann. Zähler werden vor der Schleife initialisiert; am Ende steht eine Zusammenfassung, etwa die Fehlerquote.

### Beispiel
```
fehler ← 0
FÜR i VON 1 BIS n
    WENN satz[i].plz = "" ODER satz[i].umsatz < 0 DANN
        fehler ← fehler + 1
        AUSGABE "Fehler in Satz ", i
    ENDE WENN
ENDE FÜR
AUSGABE "Fehlerhafte Sätze: ", fehler
```

### Abgrenzung
Im ETL-Prozess heißt der entsprechende Schritt „Prüfen“ in der Transformationsphase: Validierungsregeln anwenden, fehlerhafte Sätze in die **Quarantäne**.

### Prüfungsfalle
Den Zähler nicht vor der Schleife auf 0 setzen oder fehlerhafte Sätze nur zählen, ohne sie auszugeben.

### Merksatz
Prüfen, zählen, ausgeben – nichts stillschweigend verwerfen.

Siehe auch: Pseudocode · Quarantäne · Plausibilitätsprüfung
Mehr: Deep Dive 11, B5 · Deep Dive 8, 3.1

## Prüfungsausschuss
<!-- id: prufungsausschuss · quellen: Karte DD13, DD13 1.1 · stand: 2026-10 -->

Bei der zuständigen Stelle (IHK) gebildetes Gremium, das die Abschlussprüfung abnimmt; besetzt mit Beauftragten der Arbeitgeber, der Arbeitnehmer und mindestens einer Lehrkraft einer berufsbildenden Schule (§ 40 BBiG).

### Erklärung
Der Ausschuss hat mindestens drei Mitglieder; Arbeitgeber- und Arbeitnehmervertreter sind in gleicher Zahl vertreten und stellen zusammen mindestens zwei Drittel der Mitglieder. Die Mitglieder sind ehrenamtlich tätig, sachkundig und unabhängig. Der Ausschuss bewertet die Prüfungsleistungen und stellt das Ergebnis fest; in der IT-Abschlussprüfung genehmigt er u. a. den Projektantrag und führt das Fachgespräch. Mit der Bekanntgabe des Ergebnisses durch den Ausschuss endet bei Bestehen vor Ablauf der Ausbildungszeit das Ausbildungsverhältnis (§ 21 BBiG).

### Beispiel
Lea reicht ihren Projektantrag ein; der Prüfungsausschuss genehmigt ihn mit der Auflage, die Datenschutzaspekte zu ergänzen.

### Abgrenzung
Die **IHK** als zuständige Stelle überwacht die Ausbildung und organisiert die Prüfung; abgenommen und bewertet wird sie vom Prüfungsausschuss.

### Prüfungsfalle
„Die Ausbildungsordnung erlässt die IHK“ – sie kommt vom zuständigen Bundesministerium; die IHK ist auch nicht selbst der Prüfungsausschuss.

### Merksatz
Arbeitgeber, Arbeitnehmer, Lehrkraft – der Ausschuss prüft, die IHK organisiert.

Siehe auch: IHK · BBiG · Ausbildungsordnung
Mehr: Deep Dive 13, 1.1

## Pseudocode
<!-- id: pseudocode · quellen: Karte DD11, DD11 B4 · stand: 2026-10 -->

Sprachunabhängige, strukturierte Beschreibung eines Algorithmus in einer Mischung aus Umgangssprache und Programmierelementen; die Syntax ist frei, die Logik zählt.

### Erklärung
Es gibt keine verbindliche Norm – wichtig sind Eindeutigkeit und Einrückung. Bewährt haben sich Schlüsselwörter wie WENN … DANN … ENDE WENN, FÜR … ENDE FÜR, SOLANGE und ein Zuweisungspfeil. Vier Regeln sichern Punkte: Zähler und Summen initialisieren, Ein- und Ausgabe benennen, Blöcke sauber schließen und einrücken, Zuweisung (`←`) und Vergleich (`=`) unterscheiden.

### Beispiel
```
EINGABE: liste[1..n]
max ← liste[1]
FÜR i VON 2 BIS n
    WENN liste[i] > max DANN
        max ← liste[i]
    ENDE WENN
ENDE FÜR
AUSGABE max
```

### Abgrenzung
Programmablaufplan und Struktogramm stellen denselben Algorithmus grafisch dar; Pseudocode ist textuell und am schnellsten in Programmcode übertragbar.

### Prüfungsfalle
Maximum mit `max ← 0` initialisieren – bei lauter negativen Werten kommt 0 heraus, ein Wert, der gar nicht in der Liste steht.

### Merksatz
Frei in der Syntax, streng in der Logik.

Siehe auch: Programmablaufplan · Struktogramm · Prüfen und protokollieren
Mehr: Deep Dive 11, B4

## Pseudonymisierung
<!-- id: pseudonymisierung · quellen: Karte DD5, DD5 5.4, DD10 Teil 3 · stand: 2026-10 -->

Ersetzen identifizierender Merkmale durch Kennzeichen, wobei die Zuordnung nur mit gesondert aufbewahrten Zusatzinformationen möglich ist (Art. 4 Nr. 5 DSGVO).

### Erklärung
Pseudonymisierte Daten bleiben **personenbezogen** – die DSGVO gilt vollständig weiter, nur das Risiko sinkt. Pseudonymisierung ist eine Schutzmaßnahme nach Art. 25 und Art. 32 DSGVO. Entscheidend ist, dass der Zuordnungsschlüssel getrennt und geschützt verwahrt wird, z. B. bei einer anderen Stelle mit eigenen Zugriffsrechten.

### Beispiel
Im Event Log des Reparaturservices wird die Spalte resource („Tim Meyer“) durch „R-17“ ersetzt; die Zuordnungstabelle liegt nur bei der Personalabteilung. Die Analysten sehen Muster, aber keine Namen – trotzdem bleibt die Mitbestimmung des Betriebsrats bestehen.

### Abgrenzung
| | Pseudonymisierung | Anonymisierung |
|---|---|---|
| Personenbezug | mit Zusatzwissen wiederherstellbar | dauerhaft entfernt |
| DSGVO anwendbar | ja | nein |
| umkehrbar | ja | nein |

### Prüfungsfalle
„Pseudonymisiert, also nicht mehr personenbezogen“ – das ist der Klassiker; erst echte Anonymisierung führt aus der DSGVO heraus.

### Merksatz
Pseudonym = Maske mit Schlüssel, anonym = Maske ohne Schlüssel.

Siehe auch: Anonymisierung · Personenbezogene Daten · K-Anonymität · Mitbestimmung des Betriebsrats
Mehr: Deep Dive 10, Teil 3 · Deep Dive 5, 5.4

## PUE
<!-- id: pu · quellen: Karte DD14, DD14 5.2 · stand: 2026-10 -->

Power Usage Effectiveness: Kennzahl für die Energieeffizienz eines Rechenzentrums – Gesamtenergie des Rechenzentrums geteilt durch die Energie der IT; ideal ist 1,0.

### Erklärung
Alles über 1,0 ist Energie für Kühlung, Stromverteilung, Beleuchtung usw. Je näher am Idealwert, desto effizienter. Das **Energieeffizienzgesetz** (EnEfG) schreibt in Deutschland Grenzwerte als Jahresdurchschnitt vor (Stand Oktober 2026): Rechenzentren mit Betriebsbeginn ab 01.07.2026 höchstens 1,2; bestehende ab 01.07.2027 höchstens 1,5 und ab 01.07.2030 höchstens 1,3. Eine Novelle (Regierungsentwurf vom Juni 2026, im Bundestag) soll für neue Rechenzentren bei 1,2 bleiben, aber mehr Zeit geben, und die Werte für bestehende auf 1,6 bzw. 1,4 lockern – vor der Prüfung den aktuellen Stand prüfen.

### Beispiel
Das Rechenzentrum eines Dienstleisters verbraucht im Jahr 1.300.000 kWh, davon die IT 1.000.000 kWh:
$\text{PUE} = \frac{1.300.000}{1.000.000}$ = 1,3.

### Abgrenzung
Die PUE misst nur die Effizienz der Infrastruktur, nicht, ob die IT selbst sinnvoll ausgelastet ist – dafür sorgen Green-IT-Maßnahmen wie Virtualisierung.

### Prüfungsfalle
Den Bruch umdrehen – IT durch Gesamt ergäbe einen Wert unter 1.

### Merksatz
PUE = Gesamt durch IT, je näher an 1, desto besser.

Siehe auch: Green IT
Mehr: Deep Dive 14, 5.2

## Puffer
<!-- id: puffer · quellen: DD12 3.2 · stand: 2026-10 -->

Zeitreserve eines Vorgangs im Netzplan, um die er sich verschieben darf, ohne das Projektende (Gesamtpuffer) oder einen Nachfolger (freier Puffer) zu verzögern.

### Erklärung
**Gesamtpuffer:** $\text{GP} = \text{SAZ} - \text{FAZ}$ (gleich $\text{SEZ} - \text{FEZ}$). **Freier Puffer:** $\text{FP} = \min(\text{FAZ der Nachfolger}) - \text{FEZ}$. Der freie Puffer ist nie größer als der Gesamtpuffer. Vorgänge mit Gesamtpuffer 0 bilden den kritischen Pfad.

### Beispiel
Vorgang „ETL-Strecke bauen“: Dauer 5, FAZ 4, SAZ 7 → FEZ = 9, SEZ = 12.
$\text{GP} = 7 - 4$ = 3 Tage. Frühester Nachfolger beginnt bei FAZ 11: $\text{FP} = 11 - 9$ = 2 Tage.
Verzögert sich der Vorgang um 2 Tage, merkt es niemand; um 3 Tage, verschiebt sich ein Nachfolger, das Projektende aber noch nicht.

### Abgrenzung
| Puffer | Bezug | Formel |
|---|---|---|
| Gesamtpuffer | Projektende | SAZ − FAZ |
| Freier Puffer | nächster Nachfolger | min(FAZ Nachfolger) − FEZ |

### Prüfungsfalle
Den Gesamtpuffer mehrerer Vorgänge auf demselben Pfad addieren – sie teilen sich denselben Puffer.

### Merksatz
Gesamtpuffer schützt das Projektende, freier Puffer den Nachfolger.

Siehe auch: Gesamtpuffer · Freier Puffer · Kritischer Pfad · Netzplan
Mehr: Deep Dive 12, 3.2

## PUT
<!-- id: put · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

HTTP-Methode zum vollständigen Ersetzen einer Ressource an einer bekannten Adresse; idempotent.

### Erklärung
Der Client schickt die komplette neue Darstellung der Ressource; der Server ersetzt die alte vollständig (oder legt sie an, wenn es sie noch nicht gibt). Mehrfaches Senden derselben Anfrage führt zum selben Zustand – deshalb ist PUT **idempotent** und kann nach einem Timeout gefahrlos wiederholt werden. Typische Erfolgscodes: 200 OK oder 204 No Content.

### Beispiel
```json
PUT /reparaturauftraege/5001
{ "kunden_id": 3, "beschreibung": "Stuhlbein locker", "status": "erledigt" }
```
Fehlt im Body ein Feld, wird es beim Ersetzen geleert bzw. verworfen.

### Abgrenzung
| Methode | Zweck | Idempotent |
|---|---|---|
| PUT | vollständig ersetzen | ja |
| PATCH | teilweise ändern | nicht garantiert |
| POST | neu anlegen | nein |

### Prüfungsfalle
PUT und POST vertauschen – PUT zielt auf eine bestimmte Ressource (`/…/5001`), POST auf die Sammlung.

### Merksatz
PUT ersetzt ganz – und zweimal ist wie einmal.

Siehe auch: PATCH · POST · Idempotent · REST
Mehr: Deep Dive 15, 3.2

## Ausgelassen
- Praktische Lösung – Abschnittsetikett Deep Dive
- Prüfen – allgemeines Verb
- Punkte außerhalb – Boxplot-Beschreibung, siehe Ausreißer
