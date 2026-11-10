<!-- Begriffsseiten I · Stand 2026-10 -->
## ID3
<!-- id: id3 · quellen: Karte DD6, DD6 7.3, DD6 7.4 · stand: 2026-10 -->

Algorithmus (Iterative Dichotomiser 3), der einen Entscheidungsbaum von oben nach unten aufbaut und an jedem Knoten nach dem Merkmal mit dem größten Informationsgewinn teilt.

### Erklärung
ID3 ist ein überwachtes Klassifikationsverfahren. Schritt 1: Entropie der Gesamtmenge berechnen. Schritt 2: für jedes Merkmal den Informationsgewinn berechnen. Schritt 3: Das Merkmal mit dem größten Gewinn wird Knoten, jede Ausprägung ein Ast. Schritt 4: In jedem Ast mit den verbliebenen Fällen und Merkmalen wiederholen, bis die Teilmenge rein ist (Blatt) oder keine Merkmale mehr übrig sind (Blatt mit Mehrheitsklasse). ID3 verarbeitet nur kategoriale Merkmale; Zahlen müssen vorher in Klassen eingeteilt werden.

### Beispiel
Zehn Aufträge der Möbelhaus Nordholz GmbH (4 × Reklamation, 6 × keine): $H(S) = 0{,}971$. Informationsgewinn Spediteur 0,371, Lieferdauer 0,125, Verpackung 0,020 → **Spediteur** wird Wurzel; der Ast „Eigenlieferung“ ist rein und wird Blatt „nein“.

### Abgrenzung
k-NN klassifiziert über Abstände ohne Regelwerk, ID3 liefert lesbare Wenn-dann-Regeln. Der Nachfolger C4.5 nutzt das Gain Ratio und kann auch Zahlen verarbeiten.

### Prüfungsfalle
Eine Auftragsnummer hätte den maximalen Informationsgewinn (jede Teilmenge rein) – Identifikationsmerkmale gehören nicht ins Modell, der Baum würde nur auswendig lernen.

### Merksatz
ID3 fragt an jedem Knoten: Welches Merkmal räumt am meisten auf?

Siehe auch: Informationsgewinn · Entropie · Entscheidungsbaum · K-Nächste-Nachbarn
Mehr: Deep Dive 6, 7.3 · Deep Dive 6, 7.4

## Idempotent
<!-- id: idempotent · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

Eine Operation ist idempotent, wenn mehrfaches Ausführen denselben Serverzustand hinterlässt wie einmaliges Ausführen.

### Erklärung
Bei REST sind GET, PUT und DELETE idempotent, POST nicht, PATCH nicht garantiert. Gemeint ist der Zustand auf dem Server, nicht die Antwort: Ein zweites DELETE liefert vielleicht 404, die Ressource ist aber in beiden Fällen gelöscht. Wichtig wird das bei Wiederholungen nach einem Timeout – eine idempotente Anfrage darf man gefahrlos erneut senden.

### Beispiel
`PUT /reparaturauftraege/5001` mit Status „erledigt“ zweimal gesendet → der Auftrag steht einmal auf „erledigt“. `POST /bestellungen` zweimal gesendet → zwei Bestellungen, also eine Dublette.

### Abgrenzung
**Sicher** (safe) ist strenger: Die Methode verändert gar nichts (GET, HEAD, OPTIONS). Jede sichere Methode ist idempotent, aber nicht umgekehrt – PUT und DELETE ändern etwas, sind aber idempotent (RFC 9110).

### Prüfungsfalle
„Idempotent heißt, die Methode ändert nichts“ ist falsch – das ist die Definition von „sicher“.

### Merksatz
Idempotent: Einmal oder zehnmal – der Server sieht danach gleich aus.

Siehe auch: PUT · POST · REST
Mehr: Deep Dive 15, 3.2

## IHK
<!-- id: ihk · quellen: Karte DD13, DD13 1.1 · stand: 2026-10 -->

Industrie- und Handelskammer: die für kaufmännische und IT-Berufe zuständige Stelle nach BBiG, die Ausbildungsverhältnisse überwacht und die Prüfungen abnimmt.

### Erklärung
Die IHK ist eine Körperschaft des öffentlichen Rechts. Sie führt das Verzeichnis der Berufsausbildungsverhältnisse, berät Betriebe und Auszubildende, überwacht die Ausbildung und richtet die **Prüfungsausschüsse** ein (besetzt mit Arbeitgeber-, Arbeitnehmer- und Lehrkräftevertretern). Viele Kammern haben einen Schlichtungsausschuss für Streit aus dem Ausbildungsverhältnis, der vor dem Arbeitsgericht anzurufen ist (§ 111 ArbGG).

### Beispiel
Der Ausbildungsvertrag von Jonas wird ins Verzeichnis der IHK eingetragen; der Prüfungsausschuss der IHK genehmigt seinen Projektantrag und nimmt die AP2 ab.

### Abgrenzung
| Beteiligter | Aufgabe |
|---|---|
| Ausbildungsbetrieb | praktische Ausbildung nach Ausbildungsordnung |
| Berufsschule | Theorie nach Rahmenlehrplan |
| IHK | überwacht, berät, prüft |
| Bundesministerium | erlässt die Ausbildungsordnung |

### Prüfungsfalle
Die Ausbildungsordnung erlässt nicht die IHK, sondern das zuständige Bundesministerium.

### Merksatz
Die IHK überwacht und prüft – sie bildet nicht selbst aus.

Siehe auch: BBiG · Prüfungsausschuss · JArbSchG
Mehr: Deep Dive 13, 1.1

## Imputation
<!-- id: imputation · quellen: Karte DD9, DD9 4.1 · stand: 2026-10 -->

Ersetzen fehlender Werte durch geschätzte Werte, z. B. Median, Modus oder den Wert ähnlicher Datensätze.

### Erklärung
Einfache Verfahren: Mittelwert oder Median bei metrischen, Modus bei kategorialen Feldern. Genauer sind Gruppenmittelwert, Regressionsimputation, Hot-Deck bzw. k-Nächste-Nachbarn und multiple Imputation. Jede Ersetzung verändert die Verteilung – Mittelwert-Imputation verringert die Streuung künstlich, Modus-Imputation verstärkt die häufigste Kategorie. Deshalb ersetzte Werte immer kennzeichnen (Spalte „imputiert ja/nein“) und dokumentieren.

### Beispiel
Bei 5 von 200 Aufträgen fehlt die Lieferdauer; ersetzt wird durch den Median der Aufträge desselben Spediteurs. Meldet ein Spediteur lange Lieferdauern dagegen bewusst nicht (MNAR), verzerrt jede Ersetzung – dann ist die Ursache zu klären.

### Abgrenzung
Ob Imputation zulässig ist, hängt vom Fehlmechanismus ab: MCAR (zufällig), MAR (abhängig von beobachteten Merkmalen), MNAR (abhängig vom fehlenden Wert selbst).

### Prüfungsfalle
Lücken stillschweigend mit dem Mittelwert füllen – ohne Kennzeichnung und ohne Prüfung, warum die Werte fehlen.

### Merksatz
Imputieren ja, aber kennzeichnen und begründen.

Siehe auch: Fehlende Werte · MCAR · Median · Modus
Mehr: Deep Dive 9, 4.1

## Include
<!-- id: include · quellen: Karte DD15, DD15 5.1 · stand: 2026-10 -->

Beziehung im Use-Case-Diagramm: Ein Basisanwendungsfall bindet einen anderen Anwendungsfall **immer** ein.

### Erklärung
Gezeichnet als gestrichelter Pfeil mit offener Spitze und dem Stereotyp «include». Der Pfeil zeigt **vom Basisfall zum eingebundenen Fall**. Typisch für Teilabläufe, die mehrere Anwendungsfälle gemeinsam nutzen, etwa eine Anmeldung.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 90" width="460" height="90" role="img" aria-label="Use Case Reparatur beauftragen mit include-Pfeil zu Kunde anmelden">
<defs><marker id="include-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker></defs>
<ellipse cx="90" cy="45" rx="82" ry="26" class="dg-form"/>
<text x="90" y="45" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reparatur beauftragen</text>
<ellipse cx="370" cy="45" rx="82" ry="26" class="dg-form"/>
<text x="370" y="45" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Kunde anmelden</text>
<line x1="172" y1="45" x2="286" y2="45" class="dg-linie dg-strich" marker-end="url(#include-pfeil)"/>
<text x="229" y="32" text-anchor="middle" dominant-baseline="middle" class="dg-klein">«include»</text>
</svg>
```

### Beispiel
„Reparatur beauftragen“ «include» „Kunde anmelden“ – ohne Anmeldung kann kein Auftrag erteilt werden.

### Abgrenzung
**Extend**: Der erweiternde Fall kommt nur **unter einer Bedingung** hinzu, und der Pfeil zeigt vom erweiternden Fall **zum Basisfall** („Expressservice wählen“ «extend» „Reparatur beauftragen“).

### Prüfungsfalle
Pfeilrichtung vertauscht – bei include zeigt der Pfeil weg vom Basisfall, bei extend auf ihn zu.

### Merksatz
Include = immer dabei, Pfeil zum Teil; Extend = manchmal dabei, Pfeil zur Basis.

Siehe auch: Extend · Use-Case-Diagramm · Anwendungsfall
Mehr: Deep Dive 15, 5.1 · Deep Dive 17, 2.2

## Index
<!-- id: index · quellen: Karte DD1, DD1 3.6 · stand: 2026-10 -->

Zusatzstruktur in der Datenbank, die Suchen, Joins und Sortierungen auf einer Spalte beschleunigt, dafür aber Speicher kostet und Schreibvorgänge verlangsamt.

### Erklärung
Ein Index funktioniert wie das Stichwortverzeichnis eines Buchs: Die Datenbank springt direkt zu den passenden Zeilen, statt die ganze Tabelle zu lesen – nach demselben Prinzip wie die binäre Suche. Primärschlüssel und UNIQUE-Spalten sind automatisch indiziert, Fremdschlüssel nicht in jedem System (PostgreSQL nicht, MySQL/InnoDB schon). Sinnvoll ist ein Index bei großen Tabellen und Spalten mit vielen verschiedenen Werten, nach denen oft gefiltert oder gejoint wird.

### Beispiel
```sql
CREATE INDEX idx_bestellung_kunde ON bestellung (kunden_id);
```
Beschleunigt den Join von `bestellung` auf `kunde` über `kunden_id`.

### Abgrenzung
Ein Index hilft nicht bei `LIKE '%lampe'` (Platzhalter vorn) und meist nicht bei einer Funktion um die Spalte (`WHERE YEAR(bestelldatum) = 2026`) – besser als Bereich formulieren. Bei kleinen Tabellen oder Spalten mit wenigen Ausprägungen (Status) lohnt er sich kaum.

### Prüfungsfalle
„Mehr Indizes machen die Datenbank immer schneller“ – jedes INSERT und UPDATE muss alle Indizes mitpflegen.

### Merksatz
Ein Index beschleunigt das Lesen und bremst das Schreiben.

Siehe auch: Primärschlüssel · Fremdschlüssel · Binäre Suche
Mehr: Deep Dive 1, 3.6

## Inflation
<!-- id: inflation · quellen: Karte DD14, DD14 4.5 · stand: 2026-10 -->

Anhaltender Anstieg des allgemeinen Preisniveaus, gemessen mit dem Verbraucherpreisindex; er senkt die Kaufkraft des Geldes.

### Erklärung
Der Verbraucherpreisindex (VPI) des Statistischen Bundesamts misst die Preisentwicklung eines repräsentativen Warenkorbs. Ursachen: **Nachfrageinflation** (Nachfrage übersteigt das Angebot) und **Kosteninflation** (steigende Energie-, Lohn- oder Rohstoffkosten). Folgen: Kaufkraftverlust, Entwertung von Ersparnissen, Vorteil für Schuldner. Die Europäische Zentralbank strebt mittelfristig 2 % Inflation an; ihr Hauptinstrument ist der Leitzins.

### Beispiel
Lea erhält 4 % mehr Vergütung bei 2,5 % Inflation. Ihr Reallohn steigt nur um rund 1,5 % (exakt $\frac{1{,}04}{1{,}025} - 1 = 1{,}46\ \%$).

### Abgrenzung
**Deflation** ist ein anhaltend sinkendes Preisniveau und ebenso gefährlich: Konsum wird aufgeschoben, Investitionen sinken. Die Inflationsrate ist die Kennzahl, Inflation der Vorgang.

### Prüfungsfalle
Die EZB-Zielgröße ist nicht „0 % Inflation“, sondern mittelfristig 2 %.

### Merksatz
Inflation frisst Kaufkraft – der Reallohn zeigt, was übrig bleibt.

Siehe auch: Inflationsrate · Deflation · Reallohn · Leitzins
Mehr: Deep Dive 14, 4.5 · Deep Dive 14, 4.4

## Inflationsrate
<!-- id: inflationsrate · quellen: DD14 4.5 · stand: 2026-10 -->

Prozentuale Veränderung des Verbraucherpreisindex gegenüber der Vergleichsperiode, meist dem Vorjahresmonat.

### Erklärung
$\text{Inflationsrate} = \dfrac{\text{VPI}_{\text{neu}} - \text{VPI}_{\text{alt}}}{\text{VPI}_{\text{alt}}} \cdot 100$. Der VPI ist ein Indexwert (Basisjahr = 100), der die Preise eines repräsentativen Warenkorbs abbildet. Die Rate ist eine relative Veränderung – Indexpunkte und Prozent sind nicht dasselbe.

### Beispiel
VPI steigt von 120,0 auf 123,0: $\frac{123{,}0 - 120{,}0}{120{,}0} \cdot 100 = 2{,}50\ \%$. Die Differenz von 3,0 Indexpunkten ist dagegen keine Inflationsrate.

### Abgrenzung
Prozentpunkte vs. Prozent: Sinkt die Inflationsrate von 4 % auf 2 %, sind das 2 Prozentpunkte weniger, relativ aber −50 %. Eine sinkende Inflationsrate bedeutet weiter steigende Preise, nur langsamer – sinkende Preise wären Deflation.

### Prüfungsfalle
Indexpunkte als Prozent angeben oder durch den neuen statt den alten Indexwert teilen.

### Merksatz
Differenz durch den alten Wert – mal 100.

Siehe auch: Inflation · Deflation · Reallohn
Mehr: Deep Dive 14, 4.5

## Information
<!-- id: information · quellen: DD13 4.2 · stand: 2026-10 -->

Schwächste Stufe der Beteiligungsrechte des Betriebsrats: Der Arbeitgeber muss ihn rechtzeitig und umfassend unterrichten.

### Erklärung
Das BetrVG staffelt die Beteiligung von schwach nach stark: Information → Anhörung → Beratung → Widerspruch bzw. Zustimmungsverweigerung → Mitbestimmung. Beim Informationsrecht (Unterrichtung, allgemein § 80 Abs. 2 BetrVG) kann der Betriebsrat die Maßnahme nicht aufhalten, er muss aber Bescheid wissen, um seine übrigen Aufgaben wahrnehmen zu können. Typische Gegenstände: wirtschaftliche Lage, Personalplanung.

### Beispiel
Die Geschäftsleitung der Möbelhaus Nordholz GmbH informiert den Betriebsrat über die geplante Personalentwicklung im kommenden Jahr – eine Zustimmung braucht sie dafür nicht.

### Abgrenzung
| Stufe | Wirkung |
|---|---|
| Information | Betriebsrat muss unterrichtet werden |
| Anhörung | Betriebsrat muss gehört werden (jede Kündigung, § 102) |
| Mitbestimmung | ohne Zustimmung keine Maßnahme (§ 87) |

### Prüfungsfalle
Information mit Mitbestimmung gleichsetzen – informieren heißt nicht zustimmen lassen.

### Merksatz
Information ist das schwächste Recht: wissen, nicht entscheiden.

Siehe auch: Anhörung · Mitbestimmung · Betriebsrat
Mehr: Deep Dive 13, 4.2

## Informationsgewinn
<!-- id: informationsgewinn · quellen: Karte DD6, DD6 7.3 · stand: 2026-10 -->

Maß dafür, um wie viel die Entropie einer Datenmenge sinkt, wenn man sie nach einem Merkmal aufteilt.

### Erklärung
$IG(S, A) = H(S) - \sum_v \frac{|S_v|}{|S|} \cdot H(S_v)$: Entropie vorher minus die **nach Anteil gewichtete** Entropie der Teilmengen. ID3 wählt an jedem Knoten das Merkmal mit dem größten Informationsgewinn. Der Wert liegt zwischen 0 (Aufteilung bringt nichts) und $H(S)$ (alle Teilmengen rein).

### Beispiel
Zehn Aufträge, 4 ja / 6 nein, $H(S) = 0{,}971$. Merkmal Spediteur: Nordtrans 3/1 (H = 0,811), Rheinlogistik 1/2 (H = 0,918), Eigenlieferung 0/3 (H = 0). Rest-Entropie $0{,}4 \cdot 0{,}811 + 0{,}3 \cdot 0{,}918 + 0{,}3 \cdot 0 = 0{,}600$. $IG = 0{,}971 - 0{,}600 = 0{,}371$.

### Abgrenzung
Die **Entropie** misst die Unordnung einer Menge, der Informationsgewinn die Verbesserung durch eine Aufteilung. Das **Gain Ratio** (C4.5) teilt den Gewinn zusätzlich durch die Zahl der Ausprägungen, um Merkmale mit vielen Werten zu bremsen.

### Prüfungsfalle
Die Teilentropien einfach addieren oder mitteln, statt sie mit dem Anteil der Fälle zu gewichten.

### Merksatz
Informationsgewinn = Unordnung vorher minus gewichtete Unordnung nachher.

Siehe auch: Entropie · ID3 · Entscheidungsbaum
Mehr: Deep Dive 6, 7.3 · Deep Dive 6, 7.4

## Informationsobjekt
<!-- id: informationsobjekt · quellen: DD5 2.3, DD17 1.2 · stand: 2026-10 -->

Element der erweiterten EPK (eEPK), das als Rechteck zeigt, welche Daten eine Funktion liest oder schreibt.

### Erklärung
Die eEPK ergänzt die Ablauflogik aus Ereignissen und Funktionen um das Wer und Womit: Organisationseinheit (Ellipse), Informationsobjekt (Rechteck), Anwendungssystem (Rechteck mit seitlichen Doppellinien). Das Informationsobjekt wird mit einer **Funktion** verbunden; die Pfeilrichtung zeigt, ob die Funktion die Daten liest (Pfeil zur Funktion) oder erzeugt (Pfeil zum Objekt).

### Beispiel
Die Funktion „Bestellung prüfen“ liest das Informationsobjekt „Kundendaten“; „Kostenvoranschlag erstellen“ schreibt das Informationsobjekt „Kostenvoranschlag“.

### Abgrenzung
Das **Anwendungssystem** ist die Software (ERP-System), das Informationsobjekt sind die Daten darin. In BPMN entspricht dem Informationsobjekt am ehesten das Datenobjekt (Blattsymbol).

### Prüfungsfalle
Ein Informationsobjekt an ein Ereignis hängen – Zusatzobjekte gehören immer an eine Funktion.

### Merksatz
Rechteck an der Funktion: Diese Daten werden gebraucht oder erzeugt.

Siehe auch: Erweiterte EPK (eEPK) · Organisationseinheit · Konnektoren
Mehr: Deep Dive 5, 2.3 · Deep Dive 17, 1.2

## Inkrement
<!-- id: inkrement · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

In Scrum ein nutzbarer Zwischenstand des Produkts, der die Definition of Done erfüllt und auf allen vorherigen Inkrementen aufbaut.

### Erklärung
Das Inkrement ist eines der drei Scrum-Artefakte (neben Product Backlog und Sprint Backlog); seine Verpflichtung ist die **Definition of Done**. Die Developers erstellen in jedem Sprint mindestens ein Inkrement. Was die Definition of Done nicht erfüllt, ist kein Inkrement und wird im Sprint Review nicht als fertig vorgestellt.

### Beispiel
Im Dashboard-Projekt ist nach Sprint 1 die Umsatzseite mit getesteter Datenanbindung nutzbar, nach Sprint 2 kommt die Reklamationsseite hinzu – jedes Mal ein lauffähiges, abgenommenes Inkrement.

### Abgrenzung
**Iterativ** heißt, in Wiederholungen zu arbeiten (Sprints); **inkrementell** heißt, das Produkt in nutzbaren Stücken wachsen zu lassen. Scrum ist beides. Nicht verwechseln mit der inkrementellen Sicherung.

### Prüfungsfalle
Ein halbfertiges Feature „zu 80 % erledigt“ als Inkrement zählen – erfüllt es die Definition of Done nicht, ist es nicht fertig.

### Merksatz
Inkrement = fertig nach Definition of Done, nicht „fast fertig“.

Siehe auch: Definition of Done · Scrum · Sprint
Mehr: Deep Dive 12, Teil 2

## Inkrementelle Sicherung
<!-- id: inkrementelle-sicherung · quellen: Karte DD10, DD10 4.4 · stand: 2026-10 -->

Datensicherung, die nur die Änderungen seit der letzten Sicherung gleich welcher Art speichert.

Auch: Inkrementell

### Erklärung
Grundlage ist eine Vollsicherung; danach sichert jede inkrementelle Sicherung nur, was sich seit der vorherigen Sicherung (voll oder inkrementell) geändert hat. Das geht schnell und braucht wenig Platz. Die Wiederherstellung ist dafür aufwendig: Man braucht die Vollsicherung und **alle** Inkremente in der richtigen Reihenfolge – fehlt eines, ist die Kette unterbrochen.

### Beispiel
Sonntag Vollsicherung, Montag bis Freitag inkrementell. Fällt der Server am Donnerstag vor der Tagessicherung aus, werden Vollsicherung + Montag + Dienstag + Mittwoch zurückgespielt – vier Medien.

### Abgrenzung
| Verfahren | gesichert wird | Wiederherstellung |
|---|---|---|
| Vollsicherung | alles | 1 Medium |
| Differenziell | seit der letzten **Vollsicherung** | Voll + letzte differenzielle |
| Inkrementell | seit der letzten **Sicherung** | Voll + alle Inkremente |

### Prüfungsfalle
Inkrementell und differenziell vertauscht – entscheidend ist der Bezugspunkt: letzte Sicherung oder letzte Vollsicherung.

### Merksatz
Inkrementell sichert am schnellsten und stellt am langsamsten wieder her.

Siehe auch: Vollsicherung · Differenzielle Sicherung · 3-2-1-Regel
Mehr: Deep Dive 10, 4.4

## Innentäter
<!-- id: innentater · quellen: Karte DD10, DD10 5.2 · stand: 2026-10 -->

Berechtigte Person aus dem eigenen Unternehmen, die Daten unbefugt kopiert, verändert oder weitergibt.

### Erklärung
Innentäter sind gefährlich, weil sie legitimen Zugang haben und Schutzmaßnahmen an der Außengrenze (Firewall) nicht greifen. Gegenmaßnahmen sind vor allem organisatorisch und berechtigungsbezogen: **Need-to-know** und Least Privilege, Funktionstrennung, Protokollierung der Zugriffe, Data Loss Prevention, Sperre für USB-Speicher und regelmäßige Rechteprüfung, besonders beim Abteilungswechsel und Austritt.

### Beispiel
Eine Vertriebsmitarbeiterin der Möbelhaus Nordholz GmbH exportiert vor ihrem Wechsel zur Konkurrenz die komplette Kundentabelle. Ein Rollenkonzept mit Exportrecht nur für die Datenanalyse und protokollierte Exporte hätte das verhindert oder zumindest nachweisbar gemacht.

### Abgrenzung
Externe Angriffe (Phishing, Ransomware) überwinden die Sicherheitsgrenze; der Innentäter steht schon dahinter. Ein versehentlich falsch versendeter Bericht ist eine Datenpanne, aber kein Innentäter-Angriff.

### Prüfungsfalle
Nur technische Außenschutzmaßnahmen nennen – gegen Innentäter helfen Rechtevergabe, Protokollierung und Funktionstrennung.

### Merksatz
Gegen Innentäter schützt nicht die Mauer, sondern das Rechtekonzept.

Siehe auch: Need-to-know · Vertraulichkeit · Schutzziele
Mehr: Deep Dive 10, 5.2

## INNER JOIN
<!-- id: inner-join · quellen: Karte DD1, DD1 2.2 · stand: 2026-10 -->

SQL-Verknüpfung, die nur die Zeilen liefert, zu denen es in **beiden** Tabellen einen passenden Partner gibt.

### Erklärung
Die Join-Bedingung steht hinter ON, meist Fremdschlüssel = Primärschlüssel. Zeilen ohne Partner fallen stillschweigend weg. `JOIN` ohne Zusatz ist in SQL ein INNER JOIN.

### Beispiel
```sql
SELECT b.bestell_id, b.bestelldatum, k.name
FROM bestellung b
INNER JOIN kunde k ON b.kunden_id = k.kunden_id;
```
In der Übungsdatenbank: 6 Zeilen (jede Bestellung hat einen Kunden). `kunde LEFT JOIN bestellung` liefert dagegen 8 Zeilen – Weber und Braun erscheinen mit NULL, weil sie nie bestellt haben.

### Abgrenzung
| JOIN | Ergebnis |
|---|---|
| INNER | nur Treffer in beiden Tabellen |
| LEFT | alle Zeilen links, rechts ggf. NULL |
| FULL OUTER | alle Zeilen beider Seiten |

### Prüfungsfalle
„Welche Kunden haben noch nie bestellt?“ mit INNER JOIN lösen – die gesuchten Kunden fallen gerade heraus; richtig ist LEFT JOIN mit `WHERE b.bestell_id IS NULL`.

### Merksatz
INNER JOIN zeigt nur Paare – wer keinen Partner hat, verschwindet.

Siehe auch: LEFT JOIN · Fremdschlüssel · Primärschlüssel
Mehr: Deep Dive 1, 2.2

## Insertion Sort
<!-- id: insertion-sort · quellen: Karte DD11, DD11 B7 · stand: 2026-10 -->

Sortieren durch Einfügen: Jedes Element wird an die richtige Stelle im bereits sortierten vorderen Teil eingefügt – wie beim Sortieren von Spielkarten auf der Hand.

### Erklärung
Der Algorithmus nimmt nacheinander das nächste unsortierte Element und schiebt es nach links, bis links davon kein größeres mehr steht. Aufwand: O(n²) im mittleren und schlechtesten Fall, O(n) bei fast sortierten Daten, weil dann kaum verschoben werden muss. Das Verfahren ist **stabil** (gleiche Schlüssel behalten ihre Reihenfolge) und braucht keinen Zusatzspeicher.

### Beispiel
Lieferzeiten 5, 3, 8, 1:
3 einfügen → 3, 5, 8, 1 (1 Vergleich); 8 einfügen → bleibt (1 Vergleich); 1 einfügen → 1, 3, 5, 8 (3 Vergleiche). Zusammen 5 Vergleiche.

### Abgrenzung
**Selection Sort** sucht das kleinste Element im unsortierten Rest (immer O(n²), nicht stabil); **Bubble Sort** tauscht Nachbarn; **Merge Sort** schafft immer O(n log n), braucht aber Zusatzspeicher.

### Prüfungsfalle
Insertion Sort pauschal als „immer O(n²)“ einstufen – bei fast sortierten Daten ist er linear und dann sehr schnell.

### Merksatz
Insertion Sort: Karte ziehen, an die passende Stelle stecken.

Siehe auch: Bubble Sort · Selection Sort · Merge Sort · O-Notation
Mehr: Deep Dive 11, B7

## Inspektion
<!-- id: inspektion · quellen: Karte DD16, DD16 1.2 · stand: 2026-10 -->

Formalste Review-Art mit festen Rollen (Moderator, Autor, Gutachter), Checklisten, Protokoll und Metriken.

### Erklärung
Die Inspektion ist eine statische Prüfung: Das Prüfobjekt (Pflichtenheft, Datenmodell, SQL-Skript, Code) wird gelesen, nicht ausgeführt. Ablauf: Planung, Einzelprüfung der Gutachter anhand von Checklisten, Sitzung unter Leitung des Moderators, Protokoll der Befunde, Nacharbeit durch den Autor, Nachkontrolle. Metriken wie gefundene Fehler je Seite zeigen, wie wirksam die Prüfung war.

### Beispiel
Vor der Umsetzung inspizieren zwei Kolleginnen das Datenmodell des neuen Reparatur-Data-Marts anhand einer Checkliste (Schlüssel, Normalform, Kardinalitäten). Ein vertauschtes 1:n fällt dabei auf, lange bevor es im Abnahmetest teuer würde.

### Abgrenzung
| Review-Art | Formalität |
|---|---|
| informelles Review | gering, kein fester Ablauf |
| Walkthrough | Autor stellt vor, Ziel Verständnis |
| technisches Review | Fachkollegen prüfen gegen Vorgaben |
| Inspektion | hoch: Rollen, Checklisten, Protokoll, Metriken |

### Prüfungsfalle
Inspektion als Test bezeichnen – ein Test führt das Programm aus (dynamisch), die Inspektion nicht (statisch).

### Merksatz
Inspektion: das Review mit Moderator, Checkliste und Protokoll.

Siehe auch: Review · Walkthrough · Komponententest
Mehr: Deep Dive 16, 1.2

## Integrationstest
<!-- id: integrationstest · quellen: Karte DD16, DD16 2.1 · stand: 2026-10 -->

Teststufe, die das Zusammenspiel der Komponenten und ihre Schnittstellen prüft.

### Erklärung
Im V-Modell steht der Integrationstest dem Architekturentwurf gegenüber; Grundlage ist die Schnittstellenbeschreibung. Getestet wird von Entwicklern oder dem Testteam, nachdem die einzelnen Komponenten ihren Komponententest bestanden haben. Der ISTQB-Lehrplan 4.0 unterscheidet den Komponentenintegrationstest (Bausteine eines Systems) und den Systemintegrationstest (Zusammenspiel mit anderen Systemen).

### Beispiel
Die ETL-Strecke Onlineshop → Data Warehouse: Kommen alle Bestellungen an, werden Datumsformate und Umlaute korrekt übernommen, stimmt die Umsatzsumme in Quelle und Ziel überein?

### Abgrenzung
| Teststufe | prüft |
|---|---|
| Komponententest | einzelne Funktion isoliert |
| Integrationstest | Schnittstellen, Zusammenspiel |
| Systemtest | Gesamtsystem gegen Pflichtenheft |
| Abnahmetest | Eignung beim Auftraggeber gegen Lastenheft |

### Prüfungsfalle
Den Integrationstest gegen das Pflichtenheft prüfen lassen – das ist der Systemtest.

### Merksatz
Integrationstest: Passen die Teile zusammen?

Siehe auch: Komponententest · Systemtest · Abnahmetest · V-Modell
Mehr: Deep Dive 16, 2.1

## Integrität
<!-- id: integritat · quellen: Karte DD10, DD10 4.1 · stand: 2026-10 -->

Schutzziel der Informationssicherheit: Daten sind unverändert, vollständig und korrekt – Veränderungen sind nur berechtigt möglich oder werden zumindest erkannt.

### Erklärung
Integrität gehört mit Vertraulichkeit und Verfügbarkeit zur CIA-Trias. Typische Maßnahmen: Hashwerte und Prüfsummen, digitale Signaturen, Berechtigungen, Protokollierung von Änderungen, Versionsverwaltung. Im Datenbankkontext gibt es zusätzlich die referenzielle Integrität (Fremdschlüssel verweisen auf existierende Datensätze).

### Beispiel
Eine Exportdatei an den Steuerberater wird mit SHA-256-Hash übermittelt; stimmt der beim Empfänger berechnete Hash überein, wurde die Datei unterwegs nicht verändert.

### Abgrenzung
**Vertraulichkeit**: nur Berechtigte können lesen. **Verfügbarkeit**: Systeme sind nutzbar, wenn sie gebraucht werden. **Authentizität**: Der Absender ist echt. Eine Verschlüsselung schützt vor allem die Vertraulichkeit, ein Hash die Integrität.

### Prüfungsfalle
Verschlüsselung als Integritätsmaßnahme nennen – ohne Signatur oder Hash erkennt man eine Veränderung nicht zuverlässig.

### Merksatz
Integrität: Die Daten sind noch so, wie sie sein sollen.

Siehe auch: Vertraulichkeit · Verfügbarkeit · Schutzziele · Integrität und Vertraulichkeit
Mehr: Deep Dive 10, 4.1

## Integrität und Vertraulichkeit
<!-- id: integritat-und-vertraulichkeit · quellen: DD10 2.1 · stand: 2026-10 -->

Grundsatz der DSGVO (Art. 5 Abs. 1 lit. f): Personenbezogene Daten sind durch geeignete technische und organisatorische Maßnahmen angemessen zu sichern.

### Erklärung
Der Grundsatz verlangt Schutz vor unbefugter oder unrechtmäßiger Verarbeitung sowie vor unbeabsichtigtem Verlust, Zerstörung oder Schädigung. Konkretisiert wird er in Art. 32 DSGVO (TOM): z. B. Pseudonymisierung, Verschlüsselung, Zugriffskonzept, Backups, Wiederherstellbarkeit und regelmäßige Überprüfung. Er ist einer von sieben Grundsätzen des Art. 5, zusammen mit Rechenschaftspflicht.

### Beispiel
Die Gehaltsauswertung der Möbelhaus Nordholz GmbH liegt verschlüsselt auf einem Server mit Rollenkonzept; Zugriffe werden protokolliert, Backups regelmäßig zurückgespielt und getestet.

### Abgrenzung
Die IT-Sicherheits-Schutzziele Integrität und Vertraulichkeit gelten für alle Daten; der DSGVO-Grundsatz betrifft nur personenbezogene Daten und ist eine Rechtspflicht, deren Einhaltung nachgewiesen werden muss.

### Prüfungsfalle
Den Grundsatz nur als „Verschlüsselung“ beschreiben – gemeint sind auch Schutz vor Verlust und organisatorische Maßnahmen.

### Merksatz
Art. 5 lit. f: Personenbezogene Daten sicher halten – technisch und organisatorisch.

Siehe auch: Integrität · Vertraulichkeit · Technische und organisatorische Maßnahmen
Mehr: Deep Dive 10, 2.1 · Deep Dive 10, 2.4

## Interaktionsprinzipien
<!-- id: interaktionsprinzipien · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Die sieben Grundsätze der ISO 9241-110:2020 für die Gestaltung interaktiver Systeme.

### Erklärung
1. **Aufgabenangemessenheit** – unterstützt die Aufgabe ohne unnötige Schritte
2. **Selbstbeschreibungsfähigkeit** – jederzeit klar, wo man ist und was möglich ist
3. **Erwartungskonformität** – verhält sich wie gewohnt und einheitlich
4. **Erlernbarkeit** – leicht zu erlernen
5. **Steuerbarkeit** – Nutzer bestimmt Ablauf und Tempo
6. **Robustheit gegen Benutzungsfehler** – Fehler werden verhindert oder leicht korrigiert
7. **Benutzerbindung** – motiviert zur weiteren Nutzung

### Beispiel
Im Reklamations-Dashboard: Der aktive Filter steht sichtbar über der Grafik (Selbstbeschreibungsfähigkeit), Rot bedeutet überall „schlecht“ (Erwartungskonformität), ein ungültiger Zeitraum wird abgefangen statt eine leere Grafik zu zeigen (Robustheit).

### Abgrenzung
Die Fassung von 2006 nannte noch Individualisierbarkeit, Lernförderlichkeit und Fehlertoleranz. **Gebrauchstauglichkeit** (ISO 9241-11) ist das Ziel – effektiv, effizient, zufriedenstellend –, die Interaktionsprinzipien sind die Gestaltungsregeln dafür.

### Prüfungsfalle
Die alten Namen aus der Fassung 2006 nennen oder „Individualisierbarkeit“ als aktuelles Prinzip aufzählen.

### Merksatz
Sieben Prinzipien, damit der Nutzer seine Aufgabe ohne Umweg und Ärger erledigt.

Siehe auch: Gebrauchstauglichkeit · Barrierefreiheit · ISO/IEC 25010
Mehr: Deep Dive 11, A5

## Interquartilsabstand (IQR)
<!-- id: interquartilsabstand · quellen: Karte DD3, DD3 4.2, DD3 5.2 · stand: 2026-10 -->

Abstand zwischen drittem und erstem Quartil ($Q_3 - Q_1$): die Breite des Bereichs, in dem die mittleren 50 % der Werte liegen.

### Erklärung
Der IQR ist ein **robustes** Streuungsmaß, weil er die oberen und unteren 25 % ausblendet und damit Ausreißer ignoriert. Er bildet die Breite der Box im Boxplot und ist Grundlage der 1,5-IQR-Regel: Werte unter $Q_1 - 1{,}5 \cdot \text{IQR}$ oder über $Q_3 + 1{,}5 \cdot \text{IQR}$ gelten als Ausreißerverdacht. Für Quartile gibt es mehrere Konventionen – die verwendete in der Klausur nennen.

### Beispiel
Lieferzeiten 2, 3, 3, 4, 5, 5, 5, 6, 8, 19 (n = 10). Q1: Position $10 \cdot 0{,}25 = 2{,}5$ → aufrunden auf Position 3 → Wert 3. Q3: Position 7,5 → 8 → Wert 6. $\text{IQR} = 6 - 3 = 3$ Tage. Oberer Zaun $6 + 4{,}5 = 10{,}5$ → 19 ist ein Ausreißer.

### Abgrenzung
Die **Spannweite** (19 − 2 = 17) hängt nur von den Extremwerten ab und ist ausreißeranfällig; die **Standardabweichung** nutzt alle Werte und ist ebenfalls ausreißerempfindlich.

### Prüfungsfalle
Position und Wert verwechseln: Position 8 ergibt den Wert 6, nicht 8.

### Merksatz
Der IQR misst die Mitte der Daten – Ausreißer zählen nicht.

Siehe auch: Quartil · Boxplot · Spannweite · Ausreißer
Mehr: Deep Dive 3, 4.2 · Deep Dive 3, 5.2

## Intervallskala
<!-- id: intervallskala · quellen: Karte DD3, DD3 Teil 1 · stand: 2026-10 -->

Metrisches Skalenniveau mit gleichen Abständen, aber **ohne** absoluten Nullpunkt – Differenzen sind sinnvoll, Verhältnisse nicht.

Auch: Intervall

### Erklärung
Auf einer Intervallskala sind Mittelwert und Differenzen zulässig, Aussagen wie „doppelt so viel“ nicht, weil der Nullpunkt willkürlich gesetzt ist. Zusammen mit der Verhältnisskala bildet sie die metrischen (kardinalen) Skalen. Typische Beispiele: Temperatur in °C, Kalenderjahr.

### Beispiel
Lager A hat 20 °C, Lager B 10 °C: Der Unterschied beträgt 10 Grad – aber Lager A ist nicht „doppelt so warm“. Bei Umsätzen von 20.000 € und 10.000 € ist das Verhältnis dagegen sinnvoll (Verhältnisskala).

### Abgrenzung
| Skala | zusätzlich zulässig |
|---|---|
| Nominal | Häufigkeiten, Modus |
| Ordinal | + Median, Quartile |
| Intervall | + Mittelwert, Differenzen |
| Verhältnis | + Verhältnisse, Variationskoeffizient |

### Prüfungsfalle
Den Variationskoeffizienten oder Verhältnisaussagen auf °C-Werte anwenden.

### Merksatz
Intervall: Abstände ja, Verhältnisse nein – weil die Null nur vereinbart ist.

Siehe auch: Skalenniveau · Verhältnisskala · Ordinalskala · Nominalskala
Mehr: Deep Dive 3, Teil 1

## Ishikawa-Diagramm
<!-- id: ishikawa-diagramm · quellen: Karte DD5, DD5 4.1, DD17 1.6 · stand: 2026-10 -->

Ursache-Wirkungs-Diagramm in Fischgrätenform, das mögliche Ursachen eines Problems nach Kategorien ordnet.

### Erklärung
Das Problem (die Wirkung) steht am Kopf rechts, die Ursachen hängen an Gräten, gegliedert meist nach den **6M**: Mensch, Maschine, Material, Methode, Messung, Milieu (Mitwelt). Das Diagramm wird typischerweise im Team per Brainstorming gefüllt und dient der Schwachstellenanalyse und der Analyze-Phase von Six Sigma. Es sammelt Hypothesen, beweist aber keine Ursache.

### Beispiel
Problem „Lieferverzug“ im Möbelhaus: Mensch – Einarbeitung fehlt; Maschine – Scanner fällt aus; Methode – kein FIFO; Messung – Bestand ungenau; Milieu – Lager zu eng. Welche Ursache wirklich dominiert, zeigt danach eine Auszählung im Pareto-Diagramm.

### Abgrenzung
Die **5-Why-Methode** bohrt bei einer Ursache in die Tiefe, das Ishikawa-Diagramm sammelt in die Breite. Das **Pareto-Diagramm** gewichtet Ursachen nach Häufigkeit.

### Prüfungsfalle
Das Ishikawa-Diagramm als Nachweis einer Ursache verkaufen – es ordnet nur Vermutungen; den Beleg liefern Daten.

### Merksatz
Fischgräte = Ursachen sammeln und ordnen, nicht beweisen.

Siehe auch: Schwachstellenanalyse · Pareto-Diagramm · FMEA
Mehr: Deep Dive 5, 4.1 · Deep Dive 17, 1.6

## ISMS
<!-- id: isms · quellen: Karte DD10, DD10 5.1 · stand: 2026-10 -->

Informationssicherheits-Managementsystem: Regeln, Verfahren und Verantwortlichkeiten, mit denen ein Unternehmen Informationssicherheit dauerhaft steuert und verbessert.

### Erklärung
Ein ISMS organisiert Sicherheit als Prozess statt als Einzelmaßnahme: Leitlinie der Geschäftsleitung, Informationssicherheitsbeauftragter, Risikobewertung, Maßnahmen, interne Audits und Verbesserung im PDCA-Kreislauf. Zertifizierbare Norm ist **ISO/IEC 27001** (aktuelle Fassung 2022, Stand 2026); in Deutschland gibt es die Variante „ISO 27001 auf Basis von IT-Grundschutz“ des BSI (BSI-Standard 200-1 beschreibt das ISMS).

### Beispiel
Die Möbelhaus Nordholz GmbH benennt einen Informationssicherheitsbeauftragten, legt eine Sicherheitsleitlinie fest, bewertet jährlich die Risiken ihrer Systeme und prüft in internen Audits, ob Backups und Rechtevergabe wie vorgesehen funktionieren.

### Abgrenzung
Das ISMS ist das Managementsystem, der **IT-Grundschutz** eine Methode mit Standardmaßnahmen, die man darin anwenden kann. **Compliance** ist das nachweisbare Einhalten von Regeln – das ISMS liefert die Nachweise.

### Prüfungsfalle
ISMS mit einer Software oder einem einmaligen Projekt verwechseln – es ist ein dauerhafter Kreislauf.

### Merksatz
Ein ISMS macht Sicherheit zur Daueraufgabe mit PDCA.

Siehe auch: IT-Grundschutz · PDCA · BSI
Mehr: Deep Dive 10, 5.1

## ISO 8601
<!-- id: iso-8601 · quellen: Karte DD15, DD15 1.3 · stand: 2026-10 -->

Internationale Norm für Datums- und Zeitangaben, Grundform JJJJ-MM-TT: eindeutig und korrekt sortierbar.

### Erklärung
Weil das Jahr vorn steht, sortiert eine Textspalte im ISO-Format automatisch chronologisch. Die Norm regelt auch Uhrzeiten und Zeitzonen (z. B. `2026-11-25T14:30:00+01:00`) sowie Kalenderwochen (`2026-W48`). Da JSON keinen Datumstyp kennt, werden Datumswerte dort als ISO-8601-String übertragen.

### Beispiel
„03/04/2026“ ist in den USA der 4. März, in Deutschland der 3. April. In ISO 8601 ist es eindeutig `2026-04-03`.

### Abgrenzung
Das deutsche Format TT.MM.JJJJ ist für Menschen gewohnt, aber als Text nicht sortierbar („01.12.2025“ steht vor „02.01.2026“, aber auch vor „15.03.2024“). In Datenbanken gehört ein Datum ohnehin in einen DATE-Typ, nicht in Text.

### Prüfungsfalle
Datumswerte in JSON ohne Anführungszeichen oder im deutschen Format übertragen.

### Merksatz
Großes vor Kleinem: Jahr, Monat, Tag – dann sortiert es sich von selbst.

Siehe auch: JSON · UTF-8 · Datenqualität
Mehr: Deep Dive 15, 1.3

## ISO/IEC 25010
<!-- id: iso-iec-25010 · quellen: Karte DD16, DD16 1.1 · stand: 2026-10 -->

Norm für die Produktqualität von Software und Systemen; die Fassung ISO/IEC 25010:2023 nennt neun Qualitätsmerkmale.

### Erklärung
Die neun Merkmale (Stand 2026): funktionale Eignung, Leistungseffizienz, Kompatibilität, Interaktionsfähigkeit (früher Benutzbarkeit), Zuverlässigkeit (mit Verfügbarkeit), Sicherheit (security), Wartbarkeit, Flexibilität (früher Übertragbarkeit) und neu die Betriebssicherheit (safety). Die Merkmale sind die Vorlage für nicht-funktionale Anforderungen und nicht-funktionale Tests.

### Beispiel
Für das Reparatur-Dashboard wird festgelegt: Ladezeit unter 3 Sekunden (Leistungseffizienz), Verfügbarkeit 99,5 % in der Geschäftszeit (Zuverlässigkeit), Zugriff nur über Rollen (Sicherheit).

### Abgrenzung
Die Fassung 2011 hatte acht Merkmale (mit Benutzbarkeit und Übertragbarkeit, ohne Betriebssicherheit), die Vorgängernorm ISO/IEC 9126 sechs. **ISO/IEC 25012** beschreibt die Qualität von **Daten**, nicht von Software.

### Prüfungsfalle
25010 (Software) und 25012 (Daten) verwechseln oder ältere Merkmalslisten als aktuell ausgeben – im Zweifel die Fassung nennen.

### Merksatz
25010 bewertet die Software, 25012 die Daten.

Siehe auch: ISO/IEC 25012 · Interaktionsprinzipien · Systemtest
Mehr: Deep Dive 16, 1.1

## ISO/IEC 25012
<!-- id: iso-iec-25012 · quellen: Karte DD9, DD9 Teil 1 · stand: 2026-10 -->

Datenqualitätsmodell der Normenreihe ISO/IEC 25000 (SQuaRE) mit 15 Merkmalen, unterteilt in inhärente und systemabhängige Datenqualität.

### Erklärung
**Inhärent** (liegt in den Daten selbst): Korrektheit, Vollständigkeit, Konsistenz, Glaubwürdigkeit, Aktualität. **Systemabhängig** (hängt von der technischen Umgebung ab): Verfügbarkeit, Portabilität, Wiederherstellbarkeit. Zu **beiden** Sichten gehören Zugänglichkeit, Normkonformität, Vertraulichkeit, Effizienz, Genauigkeit (precision), Nachvollziehbarkeit und Verständlichkeit. Aktuelle Fassung ist ISO/IEC 25012:2008 (Stand 2026).

### Beispiel
Eine Kundentabelle mit korrekten, vollständigen Adressen hat hohe inhärente Qualität; liegt sie aber auf einem Server ohne Backup, ist ihre Wiederherstellbarkeit – ein systemabhängiges Merkmal – schlecht.

### Abgrenzung
**ISO/IEC 25010** bewertet Softwareprodukte. Das DGIQ-Modell kommt ebenfalls auf 15 Dimensionen, gliedert sie aber in vier Kategorien. Die Dimensionen aus dem Unterricht (Vollständigkeit, Korrektheit, Konsistenz …) sind eine praxisnahe Auswahl.

### Prüfungsfalle
Die 15 Merkmale vollständig auswendig lernen wollen – in der Prüfung genügt das Modell mit der Zweiteilung und einigen Beispielen.

### Merksatz
25012: Datenqualität aus Sicht der Daten (inhärent) und des Systems.

Siehe auch: ISO/IEC 25010 · Datenqualität · Konsistenz · Korrektheit
Mehr: Deep Dive 9, Teil 1

## Isolationsstufen
<!-- id: isolationsstufen · quellen: Karte DD15, DD15 4.2 · stand: 2026-10 -->

Vier im SQL-Standard festgelegte Stufen, wie stark sich parallele Transaktionen gegenseitig abschirmen: Read Uncommitted, Read Committed, Repeatable Read, Serializable.

### Erklärung
Je höher die Stufe, desto weniger Anomalien sind möglich – und desto mehr Sperren und Wartezeiten entstehen. Die Isolationsstufe ist die praktische Umsetzung des I in ACID.

| Stufe | Dirty Read | Non-repeatable Read | Phantom Read |
|---|---|---|---|
| READ UNCOMMITTED | möglich | möglich | möglich |
| READ COMMITTED | verhindert | möglich | möglich |
| REPEATABLE READ | verhindert | verhindert | möglich |
| SERIALIZABLE | verhindert | verhindert | verhindert |

### Beispiel
Ein Monatsbericht summiert Umsätze in zwei Abfragen; dazwischen kommen neue Bestellungen hinzu (Phantom Read). Nur SERIALIZABLE schließt das sicher aus – oder man liest beide Werte in einer Abfrage.

### Abgrenzung
Ein **Lost Update** verhindert man nicht über die Stufentabelle allein, sondern über atomare Änderungen (`bestand = bestand - 3`) oder Sperren (pessimistisch bzw. optimistisch mit Versionsspalte).

### Prüfungsfalle
„Je höher die Isolationsstufe, desto besser“ – Serializable kostet Parallelität und Leistung; gewählt wird nach Bedarf.

### Merksatz
Mehr Isolation, weniger Anomalien, mehr Warten.

Siehe auch: Transaktion · ACID · Dirty Read · Phantom Read · Lost Update
Mehr: Deep Dive 15, 4.2

## Ist-Aufnahme
<!-- id: ist-aufnahme · quellen: Karte DD5, DD5 1.2 · stand: 2026-10 -->

Schritt der Prozessanalyse, in dem der aktuelle Ablauf erhoben wird – per Interview, Workshop, Beobachtung, Fragebogen, Dokumentenanalyse oder Auswertung von Systemdaten.

### Erklärung
Die Ist-Aufnahme folgt auf die Abgrenzung (Start, Ende, Rollen) und liefert die Grundlage für Ist-Modellierung und Schwachstellenanalyse. Interviews bringen Kontext und Erfahrungswissen, sind aber subjektiv und beschreiben oft den gedachten statt den gelebten Prozess. Systemdaten (Event Logs, Process Mining) sind objektiv und vollständig, erklären aber nicht das Warum. Deshalb kombiniert man beides.

### Beispiel
Für den Reparaturservice werden die Serviceannahme interviewt, ein Tag in der Werkstatt beobachtet und das Event Log aus dem ERP-System ausgewertet – die Daten zeigen 28,5 Stunden Liegezeit, das Interview erklärt, dass Aufträge im Postfach der Disposition warten.

### Abgrenzung
Die **Ist-Modellierung** stellt das Erhobene grafisch dar (BPMN, EPK); die **Soll-Konzeption** entwirft den verbesserten Prozess.

### Prüfungsfalle
Nur eine Methode nennen oder ihre Nachteile verschweigen – in der Prüfung werden meist drei Methoden mit Vor- und Nachteil verlangt.

### Merksatz
Erst erheben, wie es wirklich läuft – nicht, wie es im Handbuch steht.

Siehe auch: Ist-Modellierung · Soll-Konzeption · Process Mining · Schwachstellenanalyse
Mehr: Deep Dive 5, 1.2

## Ist-Modellierung
<!-- id: ist-modellierung · quellen: DD5 1.2 · stand: 2026-10 -->

Schritt der Prozessanalyse, in dem der erhobene Ist-Ablauf grafisch dargestellt wird, meist als BPMN-Diagramm oder EPK.

### Erklärung
Die Ist-Modellierung ist Schritt 3 nach Abgrenzung und Ist-Aufnahme. Das Modell macht Abläufe, Zuständigkeiten (Lanes), Verzweigungen und Schnittstellen sichtbar und ist die gemeinsame Diskussionsgrundlage mit dem Fachbereich. Auf ihm baut die Schwachstellenanalyse auf, etwa das Erkennen von Medienbrüchen, Schleifen oder sequenziellen Schritten, die parallel laufen könnten. Process Mining kann das Ist-Modell auch automatisch aus Event Logs erzeugen (Discovery).

### Beispiel
Der Reparaturprozess wird als BPMN-Modell mit den Lanes Serviceannahme, Werkstatt und Buchhaltung gezeichnet; dabei fällt auf, dass Ersatzteilbestellung und Technikereinplanung nacheinander statt parallel laufen.

### Abgrenzung
Die **Ist-Aufnahme** sammelt die Informationen, die Ist-Modellierung bildet sie ab, das **Soll-Modell** zeigt den Zielprozess.

### Prüfungsfalle
Im Ist-Modell schon Verbesserungen einbauen – es soll den tatsächlichen Ablauf zeigen, auch wenn er umständlich ist.

### Merksatz
Das Ist-Modell zeigt ehrlich, wie es läuft – Verbessern kommt danach.

Siehe auch: Ist-Aufnahme · Soll-Konzeption · BPMN · EPK
Mehr: Deep Dive 5, 1.2

## Istkaufmann
<!-- id: istkaufmann · quellen: Karte DD14, DD14 3.1 · stand: 2026-10 -->

Kaufmann kraft Gewerbebetrieb (§ 1 HGB): Wer ein Handelsgewerbe betreibt, ist Kaufmann – die Eintragung ins Handelsregister ist Pflicht und wirkt nur **deklaratorisch** (bestätigend).

### Erklärung
Ein Handelsgewerbe liegt vor, wenn der Betrieb nach Art und Umfang einen kaufmännisch eingerichteten Geschäftsbetrieb erfordert (Buchführung, Personal, Umsatz). Der Kaufmannsstatus entsteht schon mit dem Betrieb, nicht erst mit der Eintragung. Folge: Es gilt das HGB, etwa die Rügepflicht beim Handelskauf (§ 377 HGB) und die Möglichkeit, Prokura zu erteilen.

### Beispiel
Ein Einzelunternehmer betreibt einen Möbelgroßhandel mit 15 Beschäftigten und Millionenumsatz. Er ist Istkaufmann, auch wenn er die Eintragung bisher versäumt hat.

### Abgrenzung
| Kaufmannsart | Eintragung wirkt |
|---|---|
| Istkaufmann (§ 1 HGB) | deklaratorisch, Pflicht |
| Kannkaufmann (§ 2 HGB) | konstitutiv, freiwillig |
| Formkaufmann (§ 6 HGB) | Kapitalgesellschaft kraft Rechtsform |

### Prüfungsfalle
Annehmen, der Istkaufmann werde erst durch die Eintragung Kaufmann – das gilt für den Kannkaufmann.

### Merksatz
Istkaufmann: Kaufmann ist man, die Eintragung bestätigt es nur.

Siehe auch: Kannkaufmann · Formkaufmann · Handelsregister
Mehr: Deep Dive 14, 3.1

## IT-Grundschutz
<!-- id: it-grundschutz · quellen: Karte DD10, DD10 5.1 · stand: 2026-10 -->

Methode des BSI, mit der Unternehmen über Standardmaßnahmen ein angemessenes Informationssicherheitsniveau erreichen.

### Erklärung
Vorgehen nach BSI-Standard 200-2: **Strukturanalyse** (Prozesse, Anwendungen, Systeme, Räume erfassen) → **Schutzbedarfsfeststellung** (normal, hoch, sehr hoch je Schutzziel) → **Modellierung** mit Bausteinen aus dem IT-Grundschutz-Kompendium → **IT-Grundschutz-Check** (Soll-Ist) → Risikoanalyse bei hohem Schutzbedarf → Umsetzung und Überprüfung. Varianten: Basis-, Standard- und Kern-Absicherung. Stand 2026 führt das BSI mit Grundschutz++ ein schlankeres, maschinenlesbares Regelwerk ein; die bisherige Methodik gilt in einer Übergangszeit weiter.

### Beispiel
Der Dashboard-Server erbt nach dem Maximumprinzip den Schutzbedarf „hoch“ der Gehaltsauswertung; die passenden Bausteine werden zugeordnet und im Grundschutz-Check geprüft.

### Abgrenzung
Das **ISMS** ist der Managementrahmen, IT-Grundschutz eine Methode mit fertigen Maßnahmen. ISO/IEC 27001 verlangt eine eigene Risikoanalyse, der Grundschutz nimmt sie über Standardbausteine weitgehend ab.

### Prüfungsfalle
Die Reihenfolge vertauschen – ohne Strukturanalyse und Schutzbedarf weiß man nicht, welche Bausteine passen.

### Merksatz
Erfassen, bewerten, Bausteine zuordnen, Soll und Ist vergleichen.

Siehe auch: IT-Grundschutz-Check · Schutzbedarfsfeststellung · ISMS · Kumulationseffekt
Mehr: Deep Dive 10, 5.1

## IT-Grundschutz-Check
<!-- id: it-grundschutz-check · quellen: Karte DD10, DD10 5.1 · stand: 2026-10 -->

Soll-Ist-Vergleich im IT-Grundschutz: Welche Anforderungen der zugeordneten Bausteine sind umgesetzt, welche fehlen?

### Erklärung
Nach der Modellierung wird für jede Anforderung festgehalten, ob sie umgesetzt ist (ja, teilweise, nein, entbehrlich – mit Begründung). Die fehlenden Anforderungen ergeben den Handlungsbedarf, der priorisiert, mit Verantwortlichen und Terminen versehen und umgesetzt wird. Der Check wird regelmäßig wiederholt, weil sich Systeme und Bedrohungen ändern.

### Beispiel
Für den Baustein „Datensicherungskonzept“ zeigt der Check: tägliche Backups vorhanden (umgesetzt), Rücksicherung nie getestet (nicht umgesetzt) → Maßnahme: vierteljährlicher Wiederherstellungstest durch die IT.

### Abgrenzung
Die **Schutzbedarfsfeststellung** bewertet, wie schutzbedürftig etwas ist; der Grundschutz-Check prüft, ob die Maßnahmen dafür vorhanden sind. Die **Risikoanalyse** (BSI-Standard 200-3) folgt nur bei hohem oder sehr hohem Schutzbedarf.

### Prüfungsfalle
Den Check als einmalige Prüfung beschreiben – er ist Teil eines fortlaufenden Prozesses.

### Merksatz
Grundschutz-Check = Soll laut Baustein gegen Ist im Betrieb.

Siehe auch: IT-Grundschutz · Schutzbedarfsfeststellung · ISMS
Mehr: Deep Dive 10, 5.1

## Ausgelassen
- In Werkzeugen – Abschnittsetikett Extraktion
- Interpretation – kein Fachbegriff
