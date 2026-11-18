<!-- Begriffsseiten C · Stand 2026-10 -->
## CAP-Theorem
<!-- id: cap-theorem · quellen: Karte DD15, DD15 4.1, DD8 5.2 · stand: 2026-10 -->

Ein verteiltes System kann Konsistenz, Verfügbarkeit und Partitionstoleranz nicht alle gleichzeitig garantieren.

### Erklärung
**Consistency**: Alle Knoten liefern denselben, aktuellen Stand. **Availability**: Jede Anfrage erhält eine Antwort. **Partition tolerance**: Das System arbeitet weiter, auch wenn das Netz zwischen Knoten unterbrochen ist. Da Netzwerkstörungen in verteilten Systemen unvermeidbar sind, muss man im Störfall zwischen Konsistenz (CP: lieber nicht antworten als falsch) und Verfügbarkeit (AP: antworten, notfalls mit altem Stand) wählen.

### Beispiel
Zwei Rechenzentren des Onlineshops verlieren die Verbindung. Für den Lagerbestand bei der Bezahlung ist Konsistenz wichtiger (CP), für Produktbewertungen genügt Verfügbarkeit mit späterem Abgleich (AP, BASE).

### Abgrenzung
Das C in CAP meint Gleichstand der Replikate; das C in ACID meint Einhaltung aller Integritätsregeln einer Transaktion.

### Prüfungsfalle
„Man wählt beliebig zwei von drei“ – Partitionstoleranz ist in verteilten Systemen Pflicht, die eigentliche Wahl fällt zwischen C und A.

### Merksatz
Wenn das Netz reißt: richtig oder erreichbar – beides geht nicht.

Siehe auch: BASE · ACID · NoSQL · Horizontale Skalierung
Mehr: Deep Dive 15, 4.1 · Deep Dive 8, 5.2

## Case ID
<!-- id: case-id · quellen: Karte DD5, DD5 5.1 · stand: 2026-10 -->

Vorgangsnummer im Event Log, die alle Ereignisse eines Falls zusammenklammert, z. B. die Auftragsnummer.

### Erklärung
Ein Event Log für Process Mining braucht mindestens Case ID, Activity und Timestamp; Resource ist optional. Erst über die Case ID lassen sich die Ereignisse zu Prozessdurchläufen (Traces) verbinden und Varianten, Durchlaufzeiten und Schleifen ermitteln. Die Wahl der Case ID legt die Sicht fest: Auftrag, Kunde oder Rechnung.

### Beispiel
| Case ID | Activity | Timestamp |
|---|---|---|
| R-4711 | Auftrag erfassen | 2026-03-02 09:14 |
| R-4711 | Techniker einplanen | 2026-03-03 11:02 |
| R-4711 | Reparatur abschließen | 2026-03-05 15:40 |

### Abgrenzung
Activity sagt, was passiert ist; Timestamp, wann; die Case ID, zu welchem Fall es gehört.

### Prüfungsfalle
Fehlende Case IDs übersehen – solche Ereignisse lassen sich keinem Fall zuordnen und verfälschen die Analyse.

### Merksatz
Ohne Case ID kein Prozess, nur lose Ereignisse.

Siehe auch: Event Log · Activity · Timestamp · Process Mining · Fehlende Case ID
Mehr: Deep Dive 5, 5.1

## Change Data Capture (CDC)
<!-- id: change-data-capture · quellen: DD8 3.1 · stand: 2026-11 -->

Verfahren, das Änderungen (Einfügen, Ändern, Löschen) in einer Quelldatenbank erkennt und als Änderungsstrom an Zielsysteme weitergibt.

### Erklärung
CDC ist eine Technik, mit der sich die Deltaextraktion umsetzen lässt. Die Änderungen werden auf drei Wegen erkannt:

| Variante | Funktionsweise | Eigenschaft |
|---|---|---|
| log-basiert | liest das Transaktionsprotokoll der Datenbank | geringe Last auf der Quelle, erkennt auch Löschungen |
| trigger-basiert | Trigger schreiben jede Änderung in eine Änderungstabelle | belastet die Quelle bei jeder Änderung, erkennt auch Löschungen |
| zeitstempel-basiert | Abfrage auf eine Spalte wie „geändert_am“ | einfach, aber physisch gelöschte Zeilen bleiben unbemerkt (außer bei Soft Delete) und Zwischenstände gehen verloren |

Jedes Änderungsereignis enthält Art der Änderung, Zeitpunkt und betroffenen Datensatz (oft alter und neuer Wert). Typische Verwendung: DWH oder Data Lake aktuell halten, Systeme replizieren, Streaming-Auswertungen füttern. Zum Start braucht es einen vollständigen Ausgangsstand (Initial Load), danach genügen die Änderungen. Das Ziel muss auch die Lösch-Ereignisse anwenden, sonst bleiben veraltete Zeilen stehen.

### Beispiel
Die Tabelle `bestellung` hat 400.000 Zeilen. An einem Tag werden 1.200 Zeilen neu angelegt oder geändert und 15 gelöscht. Die Vollextraktion liest 400.000 Zeilen. Eine zeitstempelbasierte Abfrage findet 1.200 Zeilen, übersieht aber die 15 Löschungen. Log-basiertes CDC liefert 1.215 Ereignisse (bei höchstens einer Änderung je Zeile), also nur $\frac{1215}{400000} \approx 0{,}3\,\%$ des Bestands – einschließlich der Löschungen.

### Abgrenzung
Die **Deltaextraktion** beschreibt das Ziel („nur Änderungen laden“), CDC eine Technik, mit der man die Änderungen findet. Die **Vollextraktion** liest immer alles.

### Prüfungsfalle
Zeitstempel-basiert „alles erkannt“ annehmen – physisch gelöschte Zeilen haben keinen neuen Zeitstempel und bleiben im Ziel stehen.

### Merksatz
CDC fragt nicht „wie sieht die Tabelle aus?“, sondern „was hat sich geändert?“.

Siehe auch: Deltaextraktion · Vollextraktion · ETL · Stream-Verarbeitung · Transaktion
Mehr: Deep Dive 8, 3.1

## Chartjunk
<!-- id: chartjunk · quellen: Karte DD11, DD11 A2 · stand: 2026-10 -->

Diagrammelemente ohne Informationsgehalt, die vom Inhalt ablenken – etwa 3D-Effekte, Schatten, Hintergrundbilder oder dicke Gitternetzlinien.

### Erklärung
Der Begriff stammt von Edward Tufte. Seine **Data-Ink-Ratio** setzt die „Tinte“, die Daten zeigt, ins Verhältnis zur gesamten Tinte; sie soll möglichst hoch sein. Alles Dekorative wird entfernt oder zurückgenommen. 3D-Effekte sind besonders schädlich, weil sie Längen und Flächen verzerren.

### Beispiel
Ein 3D-Säulendiagramm mit Holzmaserung im Hintergrund wird zum flachen, sortierten Säulendiagramm mit dezenten Hilfslinien und direkter Wertbeschriftung.

### Abgrenzung
Eine einzelne Hervorhebungsfarbe für die wichtigste Säule ist kein Chartjunk – sie trägt Bedeutung.

### Prüfungsfalle
Nur „sieht unschön aus“ antworten – entscheidend ist, dass Chartjunk die Wahrnehmung verzerrt oder ablenkt.

### Merksatz
Was keine Information trägt, fliegt raus.

Siehe auch: Data-Ink-Ratio · Sparsam mit Farben · Lügenfaktor · Visualisierung
Mehr: Deep Dive 11, A2

## CHECK
<!-- id: check · quellen: Karte DD1, DD1 2.5 · stand: 2026-10 -->

SQL-Constraint, der für jeden Wert einer Spalte oder Zeile eine Bedingung erzwingt; verletzende INSERT- und UPDATE-Anweisungen werden abgewiesen.

### Erklärung
CHECK sichert Wertebereiche und Plausibilitäten direkt in der Datenbank – ein Werkzeug der konstruktiven Datenqualitätssicherung. Die Bedingung kann sich auf eine Spalte oder mehrere Spalten derselben Zeile beziehen. MySQL wertet CHECK erst ab Version 8.0.16 aus.

```sql
CREATE TABLE retoure (
  retoure_id INTEGER PRIMARY KEY,
  erstattung DECIMAL(8,2) CHECK (erstattung >= 0)
);
```

### Beispiel
`CHECK (menge > 0)` in bestellposition verhindert Positionen mit 0 oder negativer Menge.

### Abgrenzung
| Constraint | sichert |
|---|---|
| NOT NULL | Pflichtfeld |
| UNIQUE | keine Duplikate |
| CHECK | Wertebereich, Regel |
| FOREIGN KEY | Wert existiert in der Zieltabelle |

### Prüfungsfalle
Bei CHECK an NULL denken: Eine Bedingung, die für NULL UNKNOWN ergibt, gilt als erfüllt – für Pflichtfelder zusätzlich NOT NULL setzen.

### Merksatz
CHECK prüft den Inhalt, NOT NULL das Vorhandensein.

Siehe auch: NOT NULL · UNIQUE · Wertebereichsprüfung (CHECK) · Referenzielle Integrität · DDL
Mehr: Deep Dive 1, 2.5

## Chen-Notation
<!-- id: chen-notation · quellen: Karte DD2, DD2 1.3, DD17 3.1 · stand: 2026-10 -->

Ursprüngliche ERM-Notation mit Rechtecken für Entitäten, Rauten für Beziehungen und Kardinalitäten 1:1, 1:n, m:n, die nur Maximalwerte zeigt.

### Erklärung
Attribute stehen in Ellipsen, Schlüsselattribute sind unterstrichen. Die Kardinalität beschreibt das Verhältnis der Entitätsmengen: Ein Kunde erteilt n Bestellungen – das n steht deshalb bei der Bestellung. Ob eine Teilnahme Pflicht oder optional ist (Minimum 0 oder 1), lässt sich nicht ausdrücken.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 80" width="460" height="80" role="img" aria-label="Chen-Notation: Kunde 1 erteilt n Bestellung">
<rect x="10" y="20" width="110" height="40" class="dg-form"/>
<text x="65" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Kunde</text>
<polygon points="230,12 285,40 230,68 175,40" class="dg-form"/>
<text x="230" y="40" text-anchor="middle" dominant-baseline="middle">erteilt</text>
<rect x="330" y="20" width="120" height="40" class="dg-form"/>
<text x="390" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Bestellung</text>
<line x1="120" y1="40" x2="175" y2="40" class="dg-linie"/>
<line x1="285" y1="40" x2="330" y2="40" class="dg-linie"/>
<text x="130" y="30" class="dg-fett">1</text>
<text x="315" y="30" class="dg-fett">n</text>
</svg>
```

### Beispiel
KUNDE 1 —— erteilt —— n BESTELLUNG; in Min-Max-Notation: KUNDE (0,n) — (1,1) BESTELLUNG.

### Abgrenzung
| Notation | Leserichtung | Minimum |
|---|---|---|
| Chen | Angabe beim Gegenüber | nein |
| Min-Max | Angabe bei der eigenen Entität | ja |
| Krähenfuß | wie Chen | ja (Kreis/Strich) |

### Prüfungsfalle
Chen- und Min-Max-Angaben auf dieselbe Seite schreiben – dann sind alle Kardinalitäten umgedreht.

### Merksatz
Chen zeigt nur das Maximum, und zwar beim Gegenüber.

Siehe auch: Min-Max-Notation · Krähenfußnotation · MC-Notation · Kardinalität · Beziehung
Mehr: Deep Dive 2, 1.3 · Deep Dive 17, 3.1

## Cloud-Speicherung
<!-- id: cloud-speicherung · quellen: Karte DD29, DD29 5.1, DD19 4.1 · stand: 2026-11 -->

Ablage von Daten auf den Servern eines externen Anbieters (Public Cloud), auf die man über das Internet zugreift und die meist nach Nutzung abgerechnet werden. Als Private Cloud lässt sich Cloud-Speicher auch auf eigener Infrastruktur betreiben.

Auch: Cloud-Datenbank, Datenspeicherung in der Cloud

### Erklärung
**Vorteile:** Der Speicher wächst bei Bedarf mit (Skalierung), die eigene Hardware und ihre Wartung entfallen, die Daten sind von überall erreichbar, und gute Anbieter bieten Sicherungen und Redundanz über mehrere Standorte.

**Nachteile** (typische Prüfungsfrage – Nennung plus Erläuterung in einem Satz):
- **Abhängigkeit vom Anbieter:** Preiserhöhungen, geänderte Schnittstellen oder ein eingestellter Dienst treffen das Unternehmen direkt; ein Wechsel ist aufwendig (Lock-in).
- **Abhängigkeit von der Internetverbindung:** Ohne Leitung kein Zugriff und kein Speichern.
- **Daten außerhalb des eigenen Zugriffs:** Speicherort und Zugriffe Dritter müssen vertraglich geregelt und kontrolliert werden.
- **Laufende Kosten**, die mit Datenmenge und Abrufen wachsen (Bilddaten werden dauerhaft teuer).
- **Angriffsfläche** über das Internet.

**Datenschutz:** Der Cloud-Anbieter ist bei personenbezogenen Daten in der Regel **Auftragsverarbeiter**; nötig ist ein Vertrag nach Art. 28 DSGVO. Liegen die Daten in einem Drittland, braucht man zusätzlich eine Grundlage für den Transfer, z. B. Standardvertragsklauseln. Verantwortlich bleibt das Unternehmen selbst. Typische Maßnahmen: Standort in der EU, Verschlüsselung (idealerweise mit eigenem Schlüssel), Rollen und Rechte, Protokollierung. Die Cloud kann auch Teil der Datensicherung sein, z. B. als externe Kopie der 3-2-1-Regel.

### Beispiel
In der Nordholz Manufaktur liegen die Messdaten der Klimasensoren und die Bilder des Kamerawagens in einer Cloud-Datenbank. Den Schutzbedarf bestimmt man je Schutzziel:

| Schutzziel | Einstufung | Begründung |
|---|---|---|
| Verfügbarkeit | normal | Kurze Ausfälle lassen sich am Sensor überbrücken; erst bei längerem Ausfall entstehen Lücken in der Messreihe |
| Integrität | sehr hoch | Verfälschte Werte führen zu falsch getrockneten Chargen – Serienschäden |
| Vertraulichkeit | normal | Klimawerte und Holzbilder, keine personenbezogenen Daten |

### Abgrenzung
| | Cloud | eigener Server (On-Premises) |
|---|---|---|
| Hardware und Betrieb | beim Anbieter | im Haus |
| Kosten | laufend, nutzungsabhängig | hohe Anschaffung, dann Betrieb |
| Skalierung | schnell, flexibel | durch Beschaffung begrenzt |
| Kontrolle über Standort und Zugriff | geringer, vertraglich geregelt | voll beim Unternehmen |

Der Anbieter sichert das Rechenzentrum; für Daten, Zugriffsrechte und Konfiguration bleibt der Kunde verantwortlich.

### Prüfungsfalle
Nachteile nur nennen („Abhängigkeit“) und nicht erläutern – dann fehlt die Hälfte der Punkte. Und: Die Verantwortung für den Datenschutz geht **nicht** an den Cloud-Anbieter über.

### Merksatz
Public Cloud heißt: fremde Hardware, eigene Verantwortung.

Siehe auch: Auftragsverarbeiter · Standardvertragsklauseln · Schutzbedarfsfeststellung · Schutzziele · 3-2-1-Regel · Georedundanz
Mehr: Deep Dive 29, 5.1 · Deep Dive 19, 4.1

## Cluster
<!-- id: cluster · quellen: Karte DD16, DD16 4.5 · stand: 2026-10 -->

Verbund mehrerer Server, die gemeinsam einen Dienst bereitstellen und sich bei Ausfall gegenseitig vertreten.

### Erklärung
Im **Aktiv/Passiv-Cluster** übernimmt ein Standby-Knoten erst, wenn der aktive ausfällt (Failover). Im **Aktiv/Aktiv-Cluster** arbeiten alle Knoten gleichzeitig und verteilen zusätzlich die Last. Cluster erhöhen die Verfügbarkeit, weil der Server kein Single Point of Failure mehr ist; eine Datensicherung ersetzen sie nicht.

### Beispiel
Zwei Datenbankserver mit je 99 % Verfügbarkeit parallel: $1 - 0{,}01 \cdot 0{,}01 = 0{,}9999$, also 99,99 % – sofern der Failover funktioniert.

### Abgrenzung
Ein Cluster schützt gegen Serverausfall; RAID gegen Plattenausfall; Georedundanz gegen den Ausfall eines ganzen Standorts. Im Machine Learning ist ein Cluster dagegen eine Gruppe ähnlicher Datenpunkte.

### Prüfungsfalle
Den Cluster als Backup bezeichnen – ein gelöschter Datensatz ist sofort auf allen Knoten weg.

### Merksatz
Cluster halten den Dienst am Laufen, Backups halten die Daten.

Siehe auch: Hochverfügbarkeit · Parallelschaltung · Load Balancer · Single Point of Failure · RAID
Mehr: Deep Dive 16, 4.5

## Clustering
<!-- id: clustering · quellen: Karte DD6, DD6 Teil 3 · stand: 2026-10 -->

Unüberwachtes Lernverfahren, das ähnliche Fälle zu Gruppen zusammenfasst, ohne dass die Gruppen vorgegeben sind.

### Erklärung
Es gibt keine Zielvariable; das Verfahren entdeckt Struktur. Das bekannteste Verfahren ist **k-Means**: k festlegen, Startzentren wählen, jeden Punkt dem nächsten Zentrum zuordnen (euklidischer Abstand), Zentren als Mittelwert neu berechnen, wiederholen bis zur Konvergenz. Merkmale müssen skaliert werden; k wird z. B. mit der Elbow-Methode gewählt.

### Beispiel
Sechs Kunden nach Bestellungen pro Jahr und Bestellwert: P1(2,2), P2(3,1), P3(1,3), P4(7,8), P5(8,7), P6(9,9). Mit k = 2 ergeben sich die Zentren (2 | 2) und (8 | 8) – Gelegenheitskunden und Stammkunden.

In der Abbildung sind links die Rohdaten ohne Gruppen, rechts die beiden gefundenen Cluster zu sehen.

**Abbildung: Clustering ohne vorgegebene Gruppen (Kunden aus dem Beispiel)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 212" width="340" height="212" role="img" aria-label="Clustering: links Kundendaten ohne Gruppenzuordnung, rechts zwei gefundene Cluster, Gelegenheitskunden und Stammkunden">
<text x="94" y="10" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Rohdaten</text>
<text x="94" y="24" text-anchor="middle" dominant-baseline="middle" class="dg-klein">keine Gruppen vorgegeben</text>
<line x1="24" y1="160" x2="174" y2="160" class="dg-linie"/>
<line x1="24" y1="160" x2="24" y2="30" class="dg-linie"/>
<circle cx="54" cy="127.6" r="3.8" class="dg-grau"/>
<circle cx="67" cy="138.8" r="3.8" class="dg-grau"/>
<circle cx="41" cy="116.4" r="3.8" class="dg-grau"/>
<circle cx="119" cy="60.4" r="3.8" class="dg-grau"/>
<circle cx="132" cy="71.6" r="3.8" class="dg-grau"/>
<circle cx="145" cy="49.2" r="3.8" class="dg-grau"/>
<text x="99" y="174" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellungen pro Jahr</text>
<text x="13" y="95" text-anchor="middle" dominant-baseline="middle" class="dg-klein" transform="rotate(-90 13 95)">Bestellwert (100 €)</text>
<text x="264" y="10" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Gefundene Cluster</text>
<text x="264" y="24" text-anchor="middle" dominant-baseline="middle" class="dg-klein">k = 2, nur nach Ähnlichkeit</text>
<line x1="194" y1="160" x2="344" y2="160" class="dg-linie"/>
<line x1="194" y1="160" x2="194" y2="30" class="dg-linie"/>
<ellipse cx="224" cy="127.6" rx="28" ry="22" class="dg-akzent dg-strich"/>
<ellipse cx="302" cy="60.4" rx="28" ry="22" class="dg-mittel dg-strich"/>
<circle cx="224" cy="127.6" r="3.8" class="dg-akzent"/>
<circle cx="237" cy="138.8" r="3.8" class="dg-akzent"/>
<circle cx="211" cy="116.4" r="3.8" class="dg-akzent"/>
<rect x="285.4" y="56.8" width="7.2" height="7.2" class="dg-mittel"/>
<rect x="298.4" y="68" width="7.2" height="7.2" class="dg-mittel"/>
<rect x="311.4" y="45.6" width="7.2" height="7.2" class="dg-mittel"/>
<text x="227.9" y="79.4" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Gelegenheits-</text>
<text x="227.9" y="92.9" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">kunden</text>
<text x="302" y="95.1" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Stammkunden</text>
<text x="269" y="174" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellungen pro Jahr</text>
<text x="170" y="200" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Clustering ordnet Punkte nach Abstand zueinander – ohne Zielvariable</text>
</svg>
```

### Abgrenzung
Klassifikation (überwacht) ordnet Fälle bekannten Klassen zu, Clustering (unüberwacht) findet die Gruppen erst. k-NN ist ein Klassifikationsverfahren, k-Means ein Clusteringverfahren.

### Prüfungsfalle
Ohne Skalierung clustern – dann entscheidet allein das Merkmal mit der größten Zahlenspanne.

### Merksatz
Keine Labels, aber Ähnlichkeit – das ist Clustering.

Siehe auch: K-Means · DBSCAN · Hierarchisches Clustering · Unüberwachtes Lernen · Euklidischer Abstand · Skalierung · Klassifikation · Klassifikation, Regression und Clustering im Vergleich
Mehr: Deep Dive 6, Teil 3

## CNN (Convolutional Neural Network)
<!-- id: cnn · quellen: DD6 8.1, DD6 8.2 · stand: 2026-11 -->

Neuronales Netz für Bilddaten (und andere gitterartige Daten), das kleine, lernbare Filter über das Bild schiebt und so Muster wie Kanten und Formen erkennt.
Auch: Faltungsnetz, Convolution, Feature Map

### Erklärung
Ein vollvernetztes Netz würde jedes Pixel mit jedem Neuron verbinden – das sind sehr viele Gewichte und die Bildstruktur geht verloren. Ein CNN arbeitet stattdessen mit **Faltungsschichten** (Convolution): Ein **Filter** (auch **Kernel**), z. B. 3 × 3 Gewichte, wird mit der **Schrittweite** (Stride) über das Bild geschoben. An jeder Position werden Filtergewichte und darunterliegende Pixelwerte multipliziert und aufsummiert; das Ergebnis aller Positionen ist eine **Feature Map** (Merkmalskarte). Derselbe Filter wird überall im Bild verwendet (Gewichtsteilung), und seine Gewichte werden – wie bei jedem Netz – per Backpropagation gelernt. Mehrere Filter erzeugen mehrere Feature Maps. **Padding** füllt den Bildrand mit Nullen auf, damit die Ausgabe nicht schrumpft. Auf eine Faltung folgen meist eine Aktivierungsfunktion (ReLU) und **Pooling**; am Ende stehen vollvernetzte Schichten für die Entscheidung. Frühe Schichten erkennen einfache Muster (Kanten), tiefe Schichten komplexe (Formen, Objekte).

Größe der Feature Map: $n_{aus} = \left\lfloor \frac{n - f + 2p}{s} \right\rfloor + 1$ mit $n$ = Kantenlänge der Eingabe, $f$ = Kantenlänge des Filters, $p$ = Padding je Seite, $s$ = Stride (die Klammern ⌊ ⌋ runden ab).

### Beispiel
Die Möbelhaus Nordholz GmbH prüft Fotos von Rücksendungen auf Transportschäden. Zur Veranschaulichung ein winziges Bild (4 × 4, Helligkeit 0 oder 1) mit einer senkrechten Kante und ein Filter für senkrechte Kanten:

Bild: in jeder der vier Zeilen `0 0 1 1`. Filter (2 × 2): obere Zeile −1, 1; untere Zeile −1, 1. Stride 1, Padding 0 → Größe $\frac{4 - 2 + 0}{1} + 1 = 3$, die Feature Map ist 3 × 3.

Position links oben: $-1 \cdot 0 + 1 \cdot 0 + (-1) \cdot 0 + 1 \cdot 0 = 0$. Eine Spalte weiter: $-1 \cdot 0 + 1 \cdot 1 + (-1) \cdot 0 + 1 \cdot 1 = 2$. Noch eine Spalte weiter: $-1 \cdot 1 + 1 \cdot 1 + (-1) \cdot 1 + 1 \cdot 1 = 0$. Jede Zeile der Feature Map lautet `0 2 0` – der hohe Wert in der Mitte zeigt, wo die Kante liegt.

Größenbeispiele bei einem 28 × 28-Bild und 3 × 3-Filter: Padding 0, Stride 1 → 26 × 26; Padding 1, Stride 1 → 28 × 28; Padding 0, Stride 2 → 13 × 13. Gewichte: Eine vollvernetzte Schicht mit 100 Neuronen braucht 784 · 100 + 100 = 78.500 Parameter (Gewichte und Bias), 8 Filter à 3 × 3 mit je einem Bias nur 8 · (9 + 1) = 80 Parameter.

### Abgrenzung
| | Mehrschichtiges Perzeptron | CNN |
|---|---|---|
| Verbindungen | jedes Neuron mit allen Eingaben | kleiner Filter, überall dasselbe Gewicht |
| Eignung | tabellarische Merkmale | Bilder (Nachbarschaft zählt) |
| Gewichtsanzahl | sehr hoch bei Bildern | niedrig |

Beide sind neuronale Netze und werden per Backpropagation trainiert. Bei tabellarischen Auftragsdaten sind Entscheidungsbaum oder Random Forest meist die bessere Wahl.

### Prüfungsfalle
Den Filter als festen, von Hand entworfenen Bildfilter verstehen – seine Gewichte werden beim Training gelernt. Ebenso falsch: „Padding verkleinert das Bild“ – Padding ergänzt den Rand; passend gewählt (bei Stride 1) bleibt die Größe erhalten. Mit größerem Stride schrumpft die Feature Map trotzdem.

### Merksatz
Ein kleiner Filter wandert über das Bild und sucht überall dasselbe Muster.

Siehe auch: Neuronale Netze · Deep Learning · Pooling · Aktivierungsfunktion · Backpropagation · Mehrschichtiges Perzeptron
Mehr: Deep Dive 6, 8.1 · Deep Dive 6, 8.2

## COALESCE
<!-- id: coalesce · quellen: Karte DD1, DD1 3.1 · stand: 2026-10 -->

SQL-Funktion, die das erste Argument zurückgibt, das nicht NULL ist.

### Erklärung
COALESCE ersetzt fehlende Werte in Ausgaben oder Berechnungen durch einen Ersatzwert. Sie ist Standard-SQL und in allen gängigen Systemen verfügbar; sie kann beliebig viele Argumente prüfen.

```sql
SELECT k.name, COALESCE(u.umsatz, 0) AS umsatz
FROM kunde k
LEFT JOIN umsatz_je_kunde u ON k.kunden_id = u.kunden_id;
```

### Beispiel
Werte 10, NULL, 20: `AVG(x)` ergibt 15 (30 / 2), `AVG(COALESCE(x, 0))` ergibt 10 (30 / 3). Welche Variante richtig ist, entscheidet die fachliche Bedeutung von NULL.

### Abgrenzung
`IS NULL` prüft nur, ob ein Wert fehlt; COALESCE ersetzt ihn. CASE kann dasselbe ausführlicher.

### Prüfungsfalle
NULL pauschal durch 0 ersetzen – „unbekannt“ und „null Euro“ sind fachlich verschieden.

### Merksatz
COALESCE nimmt den ersten Wert, der da ist.

Siehe auch: NULL · AVG ignoriert NULL · Rechnen mit NULL · LEFT JOIN
Mehr: Deep Dive 1, 3.1

## Compliance
<!-- id: compliance · quellen: Karte DD10, DD10 5.1 · stand: 2026-10 -->

Nachweisbare Einhaltung von Gesetzen, Verträgen, Normen und internen Regeln.

### Erklärung
Compliance verlangt nicht nur regelkonformes Handeln, sondern dessen Nachweis – durch Richtlinien, Verantwortlichkeiten, Dokumentation, Schulungen und Kontrollen. Ein ISMS nach ISO/IEC 27001 oder IT-Grundschutz liefert die Nachweise für die Informationssicherheit, das Verzeichnis von Verarbeitungstätigkeiten für den Datenschutz (Rechenschaftspflicht nach Art. 5 Abs. 2 DSGVO).

### Beispiel
Das Möbelhaus dokumentiert Löschfristen, Zugriffsrechte und jährliche Datenschutzschulungen, um bei einer Prüfung der Aufsichtsbehörde die DSGVO-Konformität belegen zu können.

### Abgrenzung
Data Governance legt Regeln und Rollen für Daten fest; Compliance prüft, ob alle relevanten Regeln eingehalten und belegbar sind.

### Prüfungsfalle
Compliance auf „Gesetze einhalten“ verkürzen – interne Regeln und der Nachweis gehören dazu.

### Merksatz
Was nicht dokumentiert ist, gilt als nicht eingehalten.

Siehe auch: Rechenschaftspflicht · ISMS · IT-Grundschutz · Data Governance
Mehr: Deep Dive 10, 5.1

## CONCAT
<!-- id: concat · quellen: Karte DD1, DD1 1.4 · stand: 2026-11 -->

SQL-Funktion, die mehrere Texte (und Werte, die in Text umgewandelt werden) zu einer Zeichenkette verkettet: `CONCAT(a, b, …)`; als Operator geht dasselbe mit `a || b`.
Auch: Verkettung, Zeichenkettenverkettung

### Erklärung
Verkettet wird **innerhalb einer Zeile**: `CONCAT(name, ' (', ort, ')')` setzt Name und Ort zusammen. Feste Textteile stehen in einfachen Anführungszeichen, Leerzeichen und Trennzeichen muss man selbst einfügen. `CONCAT_WS(trenner, a, b, …)` setzt das Trennzeichen automatisch.

NULL und Dialekt: Hier unterscheiden sich die Systeme. Der Standard-Operator `||` liefert bei einem NULL-Operanden **NULL** (Ausnahme Oracle: dort wird NULL wie ein leerer Text behandelt). `CONCAT` überspringt NULL in SQLite (ab 3.44), PostgreSQL und SQL Server, liefert in MySQL dagegen NULL. `CONCAT_WS` überspringt NULL. Portabel ist `COALESCE(ort, '')`. In MySQL ist `||` standardmäßig der ODER-Operator, dort also `CONCAT` verwenden.

### Beispiel
```sql
SELECT CONCAT(name, ' (', ort, ')') AS kunde
FROM kunde;
```
Ergebnis: Huber GmbH (München) · Schmidt AG (Hamburg) · Fischer KG (München) · Weber e.K. (Köln) · Braun GmbH (Hamburg). Gleichwertig: `name || ' (' || ort || ')'`.
```sql
SELECT 'a' || NULL AS mit_pipes, CONCAT('a', NULL, 'b') AS mit_concat;
```
Ergebnis in SQLite: NULL und `ab` – dieselbe Aufgabe, zwei Ergebnisse.

### Abgrenzung
`CONCAT` verbindet Texte **einer Zeile**. `GROUP_CONCAT` (SQLite, MySQL), `STRING_AGG` (PostgreSQL, SQL Server, SQLite ab 3.44) bzw. `LISTAGG` (Standard, Oracle) verbindet die Werte **mehrerer Zeilen** einer Gruppe zu einem Text (Aggregatfunktion). `UNION` stapelt Zeilen untereinander und verkettet nichts.

### Prüfungsfalle
Mit `+` verketten: In SQLite und MySQL addiert `+` Zahlen – `'a' + 'b'` ergibt 0, nicht „ab“ (nur SQL Server verkettet damit). Zweite Falle: eine NULL-Spalte in einer `||`-Kette macht das ganze Ergebnis NULL (nicht in Oracle).

### Merksatz
Verketten mit CONCAT oder `||` – und NULL vorher mit COALESCE abfangen.

Siehe auch: COALESCE · NULL · SELECT · Datentypen
Mehr: Deep Dive 1, 1.4 · Deep Dive 1, 3.1

## Conformance Checking
<!-- id: conformance-checking · quellen: Karte DD5, DD5 5.2 · stand: 2026-10 -->

Anwendungsart des Process Mining, die den tatsächlichen Ablauf aus dem Event Log gegen ein Soll-Modell prüft.

### Erklärung
Abweichungen werden je Fall sichtbar: übersprungene Schritte, falsche Reihenfolge, zusätzliche Schleifen. So lassen sich Regelverstöße, etwa eine fehlende Freigabe, aufdecken und ihr Anteil messen.

### Beispiel
Soll: Kostenvoranschlag freigeben, dann Ersatzteil bestellen. Das Log zeigt bei 12 % der Reparaturaufträge eine Bestellung ohne vorherige Freigabe.

### Abgrenzung
| Art | Frage |
|---|---|
| Discovery | Wie läuft der Prozess tatsächlich? |
| Conformance Checking | Weicht der Ist-Ablauf vom Soll ab? |
| Enhancement | Wo entstehen Zeiten, Kosten, Engpässe? |

### Prüfungsfalle
Conformance Checking ohne Soll-Modell beschreiben – ohne Soll gibt es nichts zu prüfen.

### Merksatz
Ist gegen Soll – Conformance.

Siehe auch: Process Mining · Discovery · Enhancement · Event Log · Soll-Ist-Vergleich
Mehr: Deep Dive 5, 5.2

## Conformed Dimensions
<!-- id: conformed-dimensions · quellen: Karte DD8, DD8 Teil 2, DD8 4.3 · stand: 2026-10 -->

Einheitlich definierte Dimensionen, die von mehreren Faktentabellen oder Data Marts gemeinsam genutzt werden – Grundlage der Bus-Architektur nach Kimball.

### Erklärung
Im Kimball-Ansatz wächst das Data Warehouse aus einzelnen Data Marts. Damit deren Zahlen zusammenpassen, nutzen alle dieselben Dimensionen mit gleichen Schlüsseln, Bezeichnungen und Hierarchien, etwa dim_zeit oder dim_produkt. Nur so lassen sich Kennzahlen verschiedener Fachbereiche nebeneinanderstellen (Drill-across).

### Beispiel
fakt_verkauf und fakt_lagerbestand nutzen beide dim_zeit und dim_produkt (Galaxy-Schema) – Verkauf und Bestand je Artikel und Monat lassen sich direkt vergleichen.

### Abgrenzung
Inmon integriert zentral im normalisierten Core-DWH; Kimball integriert über Conformed Dimensions zwischen dimensionalen Data Marts.

### Prüfungsfalle
Jeder Data Mart pflegt seine eigene Produktdimension – das Ergebnis sind Insellösungen mit widersprüchlichen Zahlen.

### Merksatz
Gleiche Dimensionen für alle, sonst passt nichts zusammen.

Siehe auch: Dimensionstabelle · Data Mart · Galaxy-Schema · Star-Schema · Faktentabelle
Mehr: Deep Dive 8, Teil 2 · Deep Dive 8, 4.3

## Copyleft
<!-- id: copyleft · quellen: Karte DD14, DD14 2.7 · stand: 2026-10 -->

Lizenzprinzip, nach dem veränderte und weitergegebene Software wieder unter derselben freien Lizenz stehen muss, z. B. bei der GPL.

### Erklärung
Copyleft nutzt das Urheberrecht, um die Freiheit des Codes zu sichern: Wer ein Copyleft-Programm verändert und weitergibt, muss den Quellcode des abgeleiteten Werks unter derselben Lizenz offenlegen. Die Pflicht entsteht bei der Weitergabe, nicht bei rein interner Nutzung (Ausnahme AGPL: auch bei Nutzung über ein Netzwerk).

### Beispiel
Das Möbelhaus baut eine GPL-lizenzierte Bibliothek in eine App ein, die es an Franchisepartner verteilt – dann muss der Quellcode der App unter der GPL mitgeliefert werden.

### Abgrenzung
| Lizenzart | Beispiel | Pflicht |
|---|---|---|
| Copyleft | GPL, AGPL | Weitergabe nur unter derselben Lizenz |
| Permissiv | MIT, Apache | im Kern Urhebernennung, Lizenztext |
| Proprietär | kommerzielle Software | Nutzung nur nach Lizenzvertrag |

### Prüfungsfalle
„Open Source ist frei, also gibt es keine Bedingungen“ – Lizenzbedingungen gelten immer.

### Merksatz
Copyleft vererbt die Lizenz an alles, was weitergegeben wird.

Siehe auch: Open Source · Proprietäre Software · Urheberrecht · Open Data
Mehr: Deep Dive 14, 2.7

## Core-DWH
<!-- id: core-dwh · quellen: Karte DD8, DD8 Teil 2 · stand: 2026-10 -->

Integrierter, historisierter, unternehmensweiter Kerndatenbestand eines Data Warehouse – die „einzige Wahrheit“.

### Erklärung
In der Schichtenarchitektur liegt das Core-DWH zwischen Staging Area (unveränderte Rohdaten) und Data Marts (fachbereichsbezogene Ausschnitte). Hier werden Daten aus allen Quellen vereinheitlicht, zusammengeführt und mit Historie gespeichert. Nach Inmon ist es normalisiert (3. NF) und erfüllt die vier Merkmale themenorientiert, integriert, zeitbezogen und beständig.

### Beispiel
Kunden aus CRM und Warenwirtschaft werden im Core-DWH zu einem Kundenbestand mit einheitlichem Schlüssel zusammengeführt; Adressänderungen werden historisiert statt überschrieben.

### Abgrenzung
| Schicht | Inhalt |
|---|---|
| Staging Area | Rohdaten, unverändert, temporär |
| Core-DWH | integriert, historisiert, unternehmensweit |
| Data Mart | fachbereichsbezogen, für Auswertungen optimiert |

### Prüfungsfalle
Fachbereiche direkt auf die Staging Area zugreifen lassen – dort sind die Daten weder bereinigt noch integriert.

### Merksatz
Staging sammelt, Core integriert, Mart serviert.

Siehe auch: Staging Area · Data Mart · Data Warehouse · Historisierung
Mehr: Deep Dive 8, Teil 2

## CRISP-DM
<!-- id: crisp-dm · quellen: Karte DD6, DD6 Teil 1 · stand: 2026-10 -->

Cross-Industry Standard Process for Data Mining: branchenübergreifendes Vorgehensmodell für Datenanalyseprojekte mit sechs Phasen.

### Erklärung
Die Phasen: **Business Understanding** → **Data Understanding** → **Data Preparation** → **Modeling** → **Evaluation** → **Deployment**. Der Prozess ist iterativ: Typische Rücksprünge führen von Data Preparation zu Data Understanding (neue Qualitätsprobleme) und von Evaluation zu Business Understanding (Frage muss geschärft werden). 60–80 % des Aufwands entfallen erfahrungsgemäß auf Datenverständnis und -aufbereitung.

### Beispiel
Reklamationsprognose: Ziel und Erfolgskriterium klären, Auftragsdaten profilen, bereinigen und Merkmale bilden, Entscheidungsbaum trainieren und testen, mit dem Fachbereich gegen das Ziel bewerten, täglich eine Liste ausliefern und überwachen.

### Abgrenzung
Die Modellgüte wird schon in Modeling technisch geprüft; Evaluation prüft, ob das fachliche Ziel aus Business Understanding erreicht ist.

### Prüfungsfalle
Datenqualität prüfen der Data Preparation zuordnen – laut Referenzmodell ist es eine Aufgabe des Data Understanding; das Testdesign gehört zu Modeling.

### Merksatz
Verstehen, verstehen, vorbereiten, modellieren, bewerten, einsetzen – und zurückspringen erlaubt.

Siehe auch: Data Mining · Testdesign · Bereitstellung · Monitoring · Machine Learning
Mehr: Deep Dive 6, Teil 1

## CSDDD
<!-- id: csddd · quellen: DD14 5.2 · stand: 2026-10 -->

Corporate Sustainability Due Diligence Directive: EU-Lieferkettenrichtlinie, die große Unternehmen zu Sorgfaltspflichten für Menschenrechte und Umwelt in ihren Aktivitätsketten verpflichtet.

### Erklärung
Durch die Omnibus-I-Richtlinie (EU) 2026/470 (in Kraft seit 18.03.2026) gilt die CSDDD nur noch für Unternehmen mit mehr als 5.000 Beschäftigten und mehr als 1,5 Mrd. € Umsatz; anzuwenden ist sie ab 26.07.2029, die Umsetzung in nationales Recht ist bis Juli 2028 fällig (Stand 2026). Die Pflicht zu einem Klimatransitionsplan wurde gestrichen. In Deutschland soll die Umsetzung das Lieferkettengesetz (LkSG) ablösen.

### Beispiel
Ein großer Möbelkonzern muss Risiken wie Kinderarbeit oder illegale Rodung bei Holzlieferanten ermitteln, vorbeugen, abstellen und ein Beschwerdeverfahren anbieten – die Möbelhaus Nordholz GmbH selbst liegt weit unter der Schwelle.

### Abgrenzung
CSDDD regelt Sorgfaltspflichten (Handeln); CSRD regelt Nachhaltigkeitsberichterstattung (Berichten). Das LkSG ist das bestehende deutsche Gesetz ab 1.000 Beschäftigten.

### Prüfungsfalle
CSDDD und CSRD verwechseln oder die alten Schwellen vor Omnibus I nennen.

### Merksatz
CSDDD = sorgfältig handeln, CSRD = darüber berichten.

Siehe auch: Lieferkettengesetz · CSRD · ESG · Nachhaltigkeit
Mehr: Deep Dive 14, 5.2

## CSRD
<!-- id: csrd · quellen: Karte DD14, DD14 5.2 · stand: 2026-10 -->

Corporate Sustainability Reporting Directive: EU-Richtlinie zur Nachhaltigkeitsberichterstattung nach den Standards ESRS.

### Erklärung
Nach der Omnibus-I-Richtlinie (EU) 2026/470 (in Kraft seit 18.03.2026) sind nur noch Unternehmen mit mehr als 1.000 Beschäftigten und mehr als 450 Mio. € Umsatz berichtspflichtig; die zweite Welle war zuvor per „Stop-the-Clock“ um zwei Jahre verschoben worden. Das deutsche Umsetzungsgesetz war 2026 noch im Verfahren; bis dahin gilt für große kapitalmarktorientierte Unternehmen die nichtfinanzielle Erklärung nach § 289b HGB (Stand Oktober 2026). Berichtet wird nach dem Prinzip der doppelten Wesentlichkeit: Auswirkungen des Unternehmens auf Umwelt und Gesellschaft sowie finanzielle Risiken für das Unternehmen.

### Beispiel
Ein Handelskonzern mit 3.000 Beschäftigten und 900 Mio. € Umsatz veröffentlicht im Lagebericht Kennzahlen zu Emissionen, Arbeitsbedingungen und Unternehmensführung – Daten, die oft ein Data Warehouse liefert.

### Abgrenzung
CSRD = Berichtspflicht; CSDDD = Sorgfaltspflicht; ESG = Bewertungskriterien von Investoren.

### Prüfungsfalle
Die ursprünglichen Schwellen (250 Beschäftigte) als aktuell nennen.

### Merksatz
CSRD: über Nachhaltigkeit berichten – seit Omnibus I nur noch die Großen.

Siehe auch: CSDDD · ESG · Nachhaltigkeit · Lieferkettengesetz
Mehr: Deep Dive 14, 5.2

## CSV
<!-- id: csv · quellen: Karte DD15, DD15 2.1 · stand: 2026-10 -->

Comma-Separated Values: einfaches Textformat für Tabellen mit einer Zeile je Datensatz und Feldern, die durch ein Trennzeichen getrennt sind.

### Erklärung
CSV ist universell lesbar, aber ohne Datentypen und ohne Schema. RFC 4180 sieht Komma und CRLF vor; enthält ein Feld das Trennzeichen, einen Zeilenumbruch oder ein Anführungszeichen, steht es in Anführungszeichen, ein inneres Anführungszeichen wird verdoppelt. Typische Importprobleme: Komma oder Semikolon, Dezimal- und Tausendertrennzeichen, Zeichenkodierung (UTF-8 gegen ANSI), verlorene führende Nullen und Datumsformate.

```text
artikel_nr;bezeichnung;preis
00123;"Stuhl ""Comfort""";149,90
```

### Beispiel
Die Postleitzahl 01067 wird beim Öffnen in einer Tabellenkalkulation zu 1067 – deshalb PLZ als Text importieren.

### Abgrenzung
JSON und XML sind semistrukturiert und können verschachteln; Parquet speichert spaltenweise mit Datentypen und Kompression.

### Prüfungsfalle
Einen deutschen Export mit Semikolon und Dezimalkomma als Standard-CSV mit Komma einlesen – die Spalten verrutschen.

### Merksatz
CSV ist einfach – bis Trennzeichen, Komma und Kodierung zuschlagen.

Siehe auch: Trennzeichen · Zeichenkodierung · Keine Datentypen · JSON · Parquet
Mehr: Deep Dive 15, 2.1

## CTE (Common Table Expression)
<!-- id: cte · quellen: Karte DD1, DD1 3.8 · stand: 2026-10 -->

Mit WITH benanntes Zwischenergebnis, das nur innerhalb einer Abfrage gilt und verschachtelte Unterabfragen lesbarer macht.

### Erklärung
Die CTE wird vor dem SELECT definiert und kann danach wie eine Tabelle verwendet werden, auch mehrfach. Sie wird nicht dauerhaft gespeichert. Mehrere CTEs lassen sich durch Kommas hintereinander schalten; mit WITH RECURSIVE sind auch rekursive Abfragen möglich (z. B. Hierarchien).

```sql
WITH umsatz_je_kunde AS (
  SELECT b.kunden_id, SUM(bp.menge * p.preis) AS umsatz
  FROM bestellung b
  JOIN bestellposition bp ON b.bestell_id = bp.bestell_id
  JOIN produkt p ON bp.produkt_id = p.produkt_id
  GROUP BY b.kunden_id
)
SELECT k.name, COALESCE(u.umsatz, 0) AS umsatz
FROM kunde k
LEFT JOIN umsatz_je_kunde u ON k.kunden_id = u.kunden_id
ORDER BY umsatz DESC;
```

### Beispiel
Die Abfrage liefert Huber GmbH 1471.80, Schmidt AG 945.00, Fischer KG 767.70 sowie Weber e.K. und Braun GmbH mit 0 – auch Kunden ohne Umsatz erscheinen.

### Abgrenzung
| | CTE | View | Unterabfrage |
|---|---|---|---|
| Gültigkeit | eine Abfrage | dauerhaft im Schema | eine Stelle |
| benannt | ja | ja | nein |

### Prüfungsfalle
Eine CTE in einer zweiten, getrennten Abfrage weiterverwenden wollen – dafür braucht man eine View.

### Merksatz
WITH gibt dem Zwischenergebnis einen Namen – für genau eine Abfrage.

Siehe auch: Unterabfrage · View · Fensterfunktion · COALESCE
Mehr: Deep Dive 1, 3.8

## Ausgelassen
- CR – Wortfragment CRISP-DM
