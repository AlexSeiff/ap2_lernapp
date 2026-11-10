<!-- Begriffsseiten G · Stand 2026-10 -->
## Gabelung (Fork)
<!-- id: gabelung · quellen: DD17 2.4 · stand: 2026-10 -->

Knoten im UML-Aktivitätsdiagramm, gezeichnet als dicker Balken, nach dem mehrere Zweige parallel ablaufen.

### Erklärung
Die Gabelung hat einen eingehenden und mehrere ausgehende Pfeile; alle ausgehenden Zweige werden gleichzeitig gestartet. Wieder zusammengeführt werden sie mit einer **Vereinigung (Join)** – ebenfalls ein Balken, der wartet, bis alle Zweige fertig sind. Gabelung und Vereinigung entsprechen dem AND-Gateway in BPMN.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 150" width="360" height="150" role="img" aria-label="Gabelung im Aktivitätsdiagramm">
<defs><marker id="gabelung-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<rect x="100" y="8" width="160" height="32" rx="14" class="dg-form"/>
<text x="180" y="24" text-anchor="middle" dominant-baseline="middle">Bestellung annehmen</text>
<line x1="180" y1="40" x2="180" y2="62" class="dg-linie" marker-end="url(#gabelung-pfeil)"/>
<rect x="60" y="62" width="240" height="6" class="dg-voll"/>
<text x="310" y="66" dominant-baseline="middle" class="dg-klein dg-leise">Gabelung</text>
<line x1="110" y1="68" x2="110" y2="100" class="dg-linie" marker-end="url(#gabelung-pfeil)"/>
<line x1="250" y1="68" x2="250" y2="100" class="dg-linie" marker-end="url(#gabelung-pfeil)"/>
<rect x="30" y="100" width="160" height="32" rx="14" class="dg-form"/>
<text x="110" y="116" text-anchor="middle" dominant-baseline="middle">Rechnung erstellen</text>
<rect x="200" y="100" width="150" height="32" rx="14" class="dg-form"/>
<text x="275" y="116" text-anchor="middle" dominant-baseline="middle">Ware kommissionieren</text>
</svg>
```

### Beispiel
Nach „Bestellung annehmen“ laufen „Rechnung erstellen“ und „Ware kommissionieren“ parallel; erst wenn beide fertig sind (Vereinigung), folgt „Ware versenden“.

### Abgrenzung
Der **Entscheidungsknoten** (Raute) wählt genau einen Zweig nach einer Bedingung in eckigen Klammern; die Gabelung startet alle Zweige ohne Bedingung.

### Merksatz
Balken = parallel, Raute = entweder–oder.

Siehe auch: Vereinigung (Join) · Aktivitätsdiagramm · Entscheidungsknoten · AND-Gateway
Mehr: Deep Dive 17, 2.4

## Galaxy-Schema
<!-- id: galaxy-schema · quellen: Karte DD8, DD8 4.3 · stand: 2026-10 -->

Multidimensionales Schema (auch Fact Constellation), in dem mehrere Faktentabellen gemeinsame Dimensionen wie Zeit und Produkt teilen.

### Erklärung
Ein Data Warehouse bildet meist mehrere Geschäftsprozesse ab – Verkauf, Lager, Reklamationen. Jeder Prozess bekommt eine eigene Faktentabelle; die Dimensionen werden nicht doppelt angelegt, sondern gemeinsam genutzt. Voraussetzung sind einheitlich definierte **Conformed Dimensions**: gleiche Schlüssel, gleiche Bezeichnungen, gleiche Hierarchien. Dann lassen sich Kennzahlen verschiedener Prozesse direkt gegenüberstellen.

### Beispiel
`fakt_verkauf` und `fakt_lagerbestand` nutzen beide `dim_zeit` und `dim_produkt`. So zeigt ein Bericht je Artikel und Monat Absatz und Monatsendbestand nebeneinander, etwa für die Reichweite.

### Abgrenzung
| Schema | Merkmal |
|---|---|
| Star | eine Faktentabelle, denormalisierte Dimensionen |
| Snowflake | Dimensionen zusätzlich normalisiert |
| Galaxy | mehrere Faktentabellen mit gemeinsamen Dimensionen |

### Prüfungsfalle
Den Lagerbestand aus `fakt_lagerbestand` über Monate summieren – er ist semi-additiv.

### Merksatz
Galaxy: viele Sterne, gemeinsame Dimensionen.

Siehe auch: Star-Schema · Snowflake-Schema · Conformed Dimensions · Faktentabelle
Mehr: Deep Dive 8, 4.3

## Gantt-Diagramm
<!-- id: gantt-diagramm · quellen: Karte DD12, DD12 3.3, DD17 5.2 · stand: 2026-10 -->

Balkenplan, der die Vorgänge eines Projekts als Balken auf einer Zeitachse zeigt – mit Dauer, Überlappung und Meilensteinen.

### Erklärung
Jede Zeile ist ein Vorgang, die Balkenlänge seine Dauer; Abhängigkeiten werden als Pfeile, Meilensteine (Dauer 0) als Rauten gezeichnet. Das Gantt-Diagramm ist das **Kommunikationswerkzeug** für Auftraggeber und Team und gehört in die Zeitplanung der Projektdokumentation. Gerechnet (Puffer, kritischer Pfad) wird im Netzplan.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 130" width="360" height="130" role="img" aria-label="Gantt-Diagramm mit drei Vorgängen und Meilenstein">
<line x1="120" y1="110" x2="350" y2="110" class="dg-linie"/>
<text x="120" y="122" text-anchor="middle" class="dg-klein dg-leise">0</text>
<text x="200" y="122" text-anchor="middle" class="dg-klein dg-leise">5</text>
<text x="280" y="122" text-anchor="middle" class="dg-klein dg-leise">10</text>
<text x="10" y="22" dominant-baseline="middle" class="dg-klein">Datenmodell</text>
<rect x="120" y="14" width="48" height="16" class="dg-akzent"/>
<text x="10" y="50" dominant-baseline="middle" class="dg-klein">Quellen anbinden</text>
<rect x="120" y="42" width="112" height="16" class="dg-akzent"/>
<text x="10" y="78" dominant-baseline="middle" class="dg-klein">ETL entwickeln</text>
<rect x="232" y="70" width="64" height="16" class="dg-akzent"/>
<polygon points="304,92 312,100 304,108 296,100" class="dg-voll"/>
<text x="316" y="100" dominant-baseline="middle" class="dg-klein">Abnahme</text>
</svg>
```

### Beispiel
Im Datenprojekt laufen „Datenmodell“ (3 Tage) und „Quellen anbinden“ (7 Tage) parallel ab Tag 0; „ETL entwickeln“ (4 Tage) beginnt an Tag 7; der Meilenstein „Abnahme“ folgt an Tag 11.

### Abgrenzung
Der Netzplan berechnet FAZ, SEZ, Puffer und kritischen Pfad; das Gantt-Diagramm zeigt den Ablauf anschaulich über der Zeit. Ein Projektstrukturplan zerlegt das Projekt ohne Zeitachse in Arbeitspakete.

### Merksatz
Netzplan zum Rechnen, Gantt zum Zeigen.

Siehe auch: Netzplan · Meilenstein · Projektstrukturplan · Kritischer Pfad
Mehr: Deep Dive 12, 3.3 · Deep Dive 17, 5.2

## Garantie
<!-- id: garantie · quellen: Karte DD14, DD14 2.5 · stand: 2026-10 -->

Freiwilliges, vertragliches Zusatzversprechen – meist des Herstellers – für Beschaffenheit oder Haltbarkeit einer Sache, zusätzlich zur gesetzlichen Gewährleistung (§ 443 BGB).

### Erklärung
Inhalt, Dauer und Bedingungen bestimmt der Garantiegeber selbst, etwa „5 Jahre auf das Gestell“. Die Garantie tritt neben die Gewährleistung und schränkt sie nicht ein: Der Käufer kann wählen, ob er sich an den Verkäufer (Gewährleistung) oder an den Hersteller (Garantie) wendet.

### Abgrenzung
| | Gewährleistung | Garantie |
|---|---|---|
| Grundlage | Gesetz (§§ 434 ff. BGB) | freiwilliger Vertrag |
| Verpflichteter | Verkäufer | meist Hersteller |
| Dauer | 2 Jahre bei neuen Sachen | frei festgelegt |
| Voraussetzung | Mangel bei Übergabe | laut Garantiebedingungen |

### Beispiel
Ein Bürostuhl hat nach 3 Jahren einen Gasdruckfederdefekt. Die Gewährleistung ist abgelaufen, die 5-Jahres-Herstellergarantie greift.

### Prüfungsfalle
„Garantie“ und „Gewährleistung“ gleichsetzen – nur die Gewährleistung ist gesetzlich.

### Merksatz
Gewährleistung muss, Garantie kann.

Siehe auch: Gewährleistung · Mangelhafte Lieferung · Sachmangel · Kaufvertrag
Mehr: Deep Dive 14, 2.5

## Gateway
<!-- id: gateway · quellen: Karte DD5, DD5 2.1 · stand: 2026-10 -->

BPMN-Element in Rautenform, an dem der Ablauf verzweigt oder zusammengeführt wird (XOR, AND, OR).

Auch: Gateways (Rauten)

### Erklärung
Das **XOR**-Gateway (X) lässt genau einen Pfad zu, das **AND**-Gateway (+) alle Pfade parallel, das **OR**-Gateway (O) einen oder mehrere. Das Gateway entscheidet nichts selbst: Die Entscheidungsgrundlage entsteht in der Aktivität davor, die Bedingungen stehen an den ausgehenden Pfaden. Was ein Gateway aufspaltet, führt ein gleichartiges wieder zusammen. Das ereignisbasierte Gateway wartet auf das zuerst eintretende Ereignis.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 90" width="330" height="90" role="img" aria-label="BPMN-Gateways XOR, AND und OR">
<polygon points="55,10 85,40 55,70 25,40" class="dg-form"/>
<text x="55" y="41" text-anchor="middle" dominant-baseline="middle" class="dg-fett">X</text>
<text x="55" y="84" text-anchor="middle" class="dg-klein">XOR: genau einer</text>
<polygon points="165,10 195,40 165,70 135,40" class="dg-form"/>
<text x="165" y="41" text-anchor="middle" dominant-baseline="middle" class="dg-fett">+</text>
<text x="165" y="84" text-anchor="middle" class="dg-klein">AND: alle</text>
<polygon points="275,10 305,40 275,70 245,40" class="dg-form"/>
<circle cx="275" cy="40" r="10" class="dg-linie dg-dick"/>
<text x="275" y="84" text-anchor="middle" class="dg-klein">OR: einer oder mehrere</text>
</svg>
```

### Beispiel
Nach „Kostenvoranschlag prüfen“ verzweigt ein XOR in „angenommen“ und „abgelehnt“; danach startet ein AND „Ersatzteil bestellen“ und „Techniker einplanen“ parallel und führt sie mit einem AND wieder zusammen.

### Prüfungsfalle
XOR-Split mit AND-Join führt zum Deadlock; AND-Split mit XOR-Join lässt den Folgeschritt mehrfach laufen.

### Merksatz
Das Gateway verzweigt, entscheiden tut die Aktivität davor.

Siehe auch: XOR-Gateway · AND-Gateway · OR-Gateway · Ereignisbasiertes Gateway · Token (BPMN)
Mehr: Deep Dive 5, 2.1

## GbR
<!-- id: gbr · quellen: Karte DD14, DD14 3.2 · stand: 2026-10 -->

Gesellschaft bürgerlichen Rechts: Zusammenschluss von mindestens zwei Personen zu einem gemeinsamen Zweck, ohne Mindestkapital, mit unbeschränkter Haftung aller Gesellschafter.

### Erklärung
Die GbR entsteht formfrei durch Gesellschaftsvertrag, auch stillschweigend. Seit dem **MoPeG** (01.01.2024) ist sie rechtsfähig, wenn sie am Rechtsverkehr teilnimmt (§ 705 Abs. 2 BGB), und kann sich freiwillig ins **Gesellschaftsregister** eintragen lassen; sie heißt dann eGbR. Die Eintragung ist faktisch Pflicht, wenn sie z. B. Grundstücke erwerben will. Die Gesellschafter haften persönlich, unbeschränkt und gesamtschuldnerisch (§ 721 BGB). Betreibt die GbR ein Handelsgewerbe, wird sie automatisch zur OHG.

### Beispiel
Zwei Datenanalysten gründen eine freiberufliche Beratung als GbR. Ein Gläubiger kann die volle Forderung von jedem der beiden verlangen, auch aus dem Privatvermögen.

### Abgrenzung
Die GbR steht im Gesellschaftsregister, nicht im Handelsregister; OHG und KG stehen im Handelsregister Abteilung A.

### Merksatz
GbR: einfach gegründet, aber jeder haftet für alles.

Siehe auch: OHG · KG · Einzelunternehmen · GmbH
Mehr: Deep Dive 14, 3.2

## Gebrauchstauglichkeit
<!-- id: gebrauchstauglichkeit · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Usability nach ISO 9241-11: Ein System ist gebrauchstauglich, wenn bestimmte Nutzer ihre Ziele in einem Nutzungskontext effektiv, effizient und zufriedenstellend erreichen.

### Erklärung
**Effektiv** heißt vollständig und richtig, **effizient** mit angemessenem Aufwand, **zufriedenstellend** ohne Frust. Gebrauchstauglichkeit hängt immer von Nutzergruppe, Aufgabe und Umgebung ab. Wie man sie erreicht, beschreiben die sieben Interaktionsprinzipien der ISO 9241-110 (z. B. Aufgabenangemessenheit, Erwartungskonformität, Robustheit gegen Benutzungsfehler). Geprüft wird sie im **Usability-Test** mit echten Nutzern.

### Beispiel
Die Filialleitung soll im Dashboard den Umsatz des Vormonats finden. Effektiv: Sie findet den richtigen Wert. Effizient: mit einem Klick auf die Monatsauswahl statt über ein Datumsformular. Zufriedenstellend: Sie nutzt das Dashboard gern wieder.

### Abgrenzung
Barrierefreiheit (WCAG) sorgt dafür, dass auch Menschen mit Einschränkungen das System nutzen können; Gebrauchstauglichkeit beschreibt die Qualität der Nutzung insgesamt.

### Merksatz
Effektiv, effizient, zufriedenstellend – im Kontext.

Siehe auch: Interaktionsprinzipien · Usability-Test · Barrierefreiheit · Aufgabenangemessenheit
Mehr: Deep Dive 11, A5

## Gefährdungsbeurteilung
<!-- id: gefahrdungsbeurteilung · quellen: Karte DD14, DD14 5.1 · stand: 2026-10 -->

Pflicht des Arbeitgebers nach § 5 ArbSchG, Gefährdungen am Arbeitsplatz zu ermitteln, zu bewerten, Schutzmaßnahmen festzulegen und deren Wirksamkeit zu prüfen.

### Erklärung
Die Gefährdungsbeurteilung ist das zentrale Instrument des Arbeitsschutzes und muss dokumentiert werden (§ 6 ArbSchG). Zu betrachten sind u. a. Arbeitsplatzgestaltung, Arbeitsmittel, Arbeitsabläufe und ausdrücklich auch **psychische Belastungen**. Maßnahmen folgen dem **STOP-Prinzip**: Substitution vor technischen, organisatorischen und zuletzt personenbezogenen Maßnahmen. Sie wird bei Veränderungen und regelmäßig wiederholt.

### Beispiel
Für die Bildschirmarbeitsplätze der Datenanalyse im Möbelhaus werden Blendung, Stuhl- und Tischhöhe, Pausenregelung und Arbeitsdruck bewertet. Maßnahmen: Monitor seitlich zum Fenster, Mischarbeit, Angebotsvorsorge für die Augen.

### Prüfungsfalle
Die Gefährdungsbeurteilung der Berufsgenossenschaft zuschreiben – verantwortlich ist der Arbeitgeber.

### Merksatz
Ermitteln, bewerten, Maßnahmen, Wirksamkeit prüfen, dokumentieren.

Siehe auch: Arbeitsschutz · STOP-Prinzip · Arbeitgeberpflichten · Bildschirmarbeit · Unterweisung
Mehr: Deep Dive 14, 5.1

## Gegenereignis
<!-- id: gegenereignis · quellen: Karte DD3, DD3 7.1 · stand: 2026-10 -->

Das Ereignis „A tritt nicht ein“ mit der Wahrscheinlichkeit $P(\overline{A}) = 1 - P(A)$.

### Erklärung
Ereignis und Gegenereignis ergänzen sich immer zu 100 %. Besonders nützlich ist das Gegenereignis bei Fragen nach „mindestens einmal“: Statt alle günstigen Fälle aufzuzählen, rechnet man 1 minus die Wahrscheinlichkeit, dass es nie eintritt.

### Beispiel
3 von 60 Aufträgen werden reklamiert → $P(A) = 5\ \%$, also wird ein Auftrag mit 95 % nicht reklamiert. Bei drei unabhängigen Aufträgen:
$P(\text{mind. eine Reklamation}) = 1 - 0{,}95^3 = 1 - 0{,}857 = 0{,}143$, also 14,3 %.

### Prüfungsfalle
„Mindestens einmal“ als 3 · 5 % = 15 % rechnen – das überschätzt, weil Mehrfachreklamationen doppelt gezählt werden.

### Merksatz
„Mindestens einmal“ = 1 − „nie“.

Siehe auch: Laplace-Wahrscheinlichkeit · Erwartungswert · Relative Häufigkeit
Mehr: Deep Dive 3, 7.1

## Geldpolitik
<!-- id: geldpolitik · quellen: Karte DD14, DD14 4.4 · stand: 2026-10 -->

Steuerung von Geldmenge und Zinsen durch die Europäische Zentralbank (EZB) mit dem vorrangigen Ziel Preisstabilität, mittelfristig 2 % Inflation.

### Erklärung
Die EZB ist unabhängig von den Regierungen. Ihr Hauptinstrument sind die **Leitzinsen**: Eine Erhöhung verteuert Kredite, dämpft Nachfrage und Preisauftrieb; eine Senkung regt Investitionen und Konsum an. Weitere Instrumente sind Offenmarktgeschäfte und die Mindestreserve. Das 2-%-Ziel ist symmetrisch: Unterschreiten ist genauso unerwünscht wie Überschreiten.

### Beispiel
Steigt die Inflation deutlich über 2 %, erhöht die EZB die Leitzinsen. Kunden finanzieren eine neue Küche seltener auf Kredit, die Nachfrage im Möbelhandel sinkt.

### Abgrenzung
Die **Fiskalpolitik** macht der Staat über Steuern und Ausgaben; die Geldpolitik macht die Zentralbank über Zinsen.

### Prüfungsfalle
Die Bundesregierung oder die Bundesbank als Entscheider über den Leitzins nennen – im Euroraum entscheidet der EZB-Rat.

### Merksatz
Zinsen hoch, Preise runter – Geldpolitik macht die EZB.

Siehe auch: Leitzins · Fiskalpolitik · Inflation · Magisches Viereck
Mehr: Deep Dive 14, 4.4

## Genauigkeit
<!-- id: genauigkeit · quellen: Karte DD9, DD9 Teil 1 · stand: 2026-10 -->

Datenqualitätsdimension: Ist die Detailtiefe der Werte für den Zweck ausreichend (z. B. Zeitstempel minutengenau statt nur Datum)?

### Erklärung
Genauigkeit betrifft Auflösung, Nachkommastellen und Granularität. Zu grobe Werte lassen sich nachträglich nicht verfeinern: Wer nur das Datum speichert, kann keine Bearbeitungszeiten in Stunden auswerten. Ob die Genauigkeit reicht, entscheidet der Verwendungszweck.

### Beispiel
Der Reparaturservice speichert die Dauer nur in ganzen Tagen. Für die Frage „Wie lange liegt ein Auftrag in der Disposition?“ braucht es Stunden – die Daten sind zu ungenau.

### Abgrenzung
**Korrektheit** fragt, ob der Wert mit der Realität übereinstimmt; Genauigkeit, ob er fein genug ist. Begriffsfalle: Im Englischen heißt die Übereinstimmung mit der Realität *accuracy*, die Detailtiefe *precision*; im Modellkontext steht „Genauigkeit“ teils für Precision, teils für Accuracy. Immer kurz erläutern, was gemeint ist.

### Merksatz
Genau ist nicht gleich richtig.

Siehe auch: Korrektheit · Datenqualität · Granularität · Zu grobe Zeitstempel · Precision
Mehr: Deep Dive 9, Teil 1

## Generalisierung
<!-- id: generalisierung · quellen: DD17 2.3 · stand: 2026-10 -->

Beziehung im UML-Klassendiagramm zwischen einer allgemeinen Oberklasse und spezielleren Unterklassen („ist ein“), gezeichnet als Linie mit leerem Dreieck an der Oberklasse.

### Erklärung
Die Unterklassen erben Attribute und Methoden der Oberklasse und ergänzen eigene (Vererbung). Generalisierung beschreibt den Weg vom Speziellen zum Allgemeinen, Spezialisierung die Gegenrichtung – es ist dieselbe Beziehung. Im ERM heißt sie is-a-Beziehung; beim Überführen in Tabellen gibt es drei Varianten (Tabelle je Typ, nur Untertabellen, eine Gesamttabelle mit Typspalte).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 130" width="320" height="130" role="img" aria-label="Generalisierung: Privatkunde und Geschäftskunde sind Kunden">
<rect x="110" y="8" width="100" height="30" class="dg-form"/>
<text x="160" y="23" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Kunde</text>
<polygon points="160,38 170,54 150,54" class="dg-form"/>
<line x1="160" y1="54" x2="160" y2="72" class="dg-linie"/>
<line x1="70" y1="72" x2="250" y2="72" class="dg-linie"/>
<line x1="70" y1="72" x2="70" y2="92" class="dg-linie"/>
<line x1="250" y1="72" x2="250" y2="92" class="dg-linie"/>
<rect x="15" y="92" width="110" height="30" class="dg-form"/>
<text x="70" y="107" text-anchor="middle" dominant-baseline="middle">Privatkunde</text>
<rect x="190" y="92" width="120" height="30" class="dg-form"/>
<text x="250" y="107" text-anchor="middle" dominant-baseline="middle">Geschäftskunde</text>
</svg>
```

### Beispiel
Privatkunde (geburtsdatum) und Geschäftskunde (ust_id) erben von Kunde die Attribute kunden_id, name und ort.

### Abgrenzung
Die gefüllte Raute steht für Komposition, die leere Raute für Aggregation – beide sind „hat ein“-Beziehungen, die Generalisierung ist „ist ein“.

### Merksatz
Leeres Dreieck zeigt auf das Allgemeine.

Siehe auch: Vererbung · Klassendiagramm · Komposition · Sonderfall Generalisierung/Spezialisierung
Mehr: Deep Dive 17, 2.3

## Generationenprinzip (Großvater-Vater-Sohn)
<!-- id: generationenprinzip · quellen: DD10 4.4 · stand: 2026-10 -->

Rotationsschema der Datensicherung, bei dem Sicherungsmedien wiederverwendet, ältere Stände aber in Generationen aufbewahrt werden.

### Erklärung
Tägliche Sicherungen („Söhne“) werden z. B. eine Woche aufbewahrt, wöchentliche („Väter“) einen Monat, monatliche („Großväter“) ein Jahr. So kommt man mit begrenzt vielen Medien aus und kann trotzdem auf Stände von vor Tagen, Wochen oder Monaten zurückgreifen. Das ist wichtig, wenn ein Fehler oder eine Ransomware-Verschlüsselung erst spät bemerkt wird.

### Beispiel
Am 20. eines Monats fällt auf, dass ein ETL-Lauf seit Monatsanfang Kundendaten falsch überschreibt. Die Tagessicherungen enthalten nur fehlerhafte Stände – die letzte Monatssicherung (Großvater) liefert den sauberen Stand.

### Abgrenzung
Das Generationenprinzip regelt, **wie lange** Stände aufbewahrt werden; voll, differenziell und inkrementell regeln, **was** gesichert wird; die 3-2-1-Regel regelt, **wo** die Kopien liegen.

### Merksatz
Söhne für Tage, Väter für Wochen, Großväter für Monate.

Siehe auch: 3-2-1-Regel · Vollsicherung · Inkrementelle Sicherung · Ransomware · RPO
Mehr: Deep Dive 10, 4.4

## Generative KI
<!-- id: generative-ki · quellen: Karte DD6, DD6 8.4 · stand: 2026-10 -->

KI, die neue Inhalte wie Texte, Code oder Bilder erzeugt, z. B. große Sprachmodelle.

### Erklärung
Generative Modelle lernen aus sehr großen Datenmengen Muster und erzeugen daraus wahrscheinliche Fortsetzungen. In der Datenanalyse helfen sie beim Formulieren von SQL, beim Dokumentieren oder Zusammenfassen. Risiken: **Halluzinationen** (überzeugend formuliert, aber falsch – Ergebnisse immer prüfen), **Datenschutz** (keine personenbezogenen oder vertraulichen Daten in externe Dienste eingeben) und ungeklärte **Urheberrechte**. Die KI-Verordnung (EU) 2024/1689 sieht für Modelle mit allgemeinem Verwendungszweck eigene Pflichten vor und verlangt Transparenz, z. B. die Kennzeichnung KI-generierter Inhalte (Art. 50).

### Beispiel
Ein Sprachmodell schlägt für „Umsatz je Kunde inklusive Kunden ohne Bestellung“ eine Abfrage mit INNER JOIN vor. Erst die Prüfung zeigt: Es fehlen Kunden ohne Umsatz – richtig wäre ein LEFT JOIN.

### Abgrenzung
Klassische Machine-Learning-Modelle sagen vorher oder klassifizieren (Reklamation ja/nein); generative KI erzeugt neue Inhalte.

### Merksatz
Generative KI liefert Entwürfe, keine geprüften Ergebnisse.

Siehe auch: KI-Verordnung · Künstliche Intelligenz · Deep Learning · Machine Learning · Neuronale Netze
Mehr: Deep Dive 6, 8.4

## Geometrisches Mittel
<!-- id: geometrisches-mittel · quellen: Karte DD4, DD4 3.2 · stand: 2026-10 -->

n-te Wurzel aus dem Produkt von n Werten; für Wachstumsraten: $\bar{r} = \sqrt[n]{\frac{\text{Endwert}}{\text{Anfangswert}}} - 1$.

### Erklärung
Wachstumsraten beziehen sich jeweils auf eine andere Basis und wirken multiplikativ. Deshalb ist für die durchschnittliche Rate über mehrere Perioden das geometrische Mittel der Wachstumsfaktoren richtig, nicht das arithmetische Mittel der Prozentwerte.

### Beispiel
Monatsumsatz 120 T€ → 180 T€ über 7 Monatsschritte:
$\bar{r} = \sqrt[7]{1{,}5} - 1 = 0{,}0596$, also +5,96 % je Monat.
Das arithmetische Mittel der sieben Monatsraten ergäbe 6,61 % – hochgerechnet 187,8 statt 180 T€.
Kurzes Beispiel: +10 % und dann −10 % ergeben $\sqrt{1{,}1 \cdot 0{,}9} - 1 = -0{,}50\ \%$ je Periode, nicht 0 %.

### Prüfungsfalle
Prozentwerte einzelner Perioden addieren oder mitteln.

### Merksatz
Wachstum multipliziert sich – also geometrisch mitteln.

Siehe auch: Arithmetisches Mittel · Gewichtetes arithmetisches Mittel · Zeitreihe · Prozentpunkte
Mehr: Deep Dive 4, 3.2

## Georedundanz
<!-- id: georedundanz · quellen: Karte DD16, DD16 4.5 · stand: 2026-10 -->

Betrieb eines zweiten Rechenzentrums an einem weit entfernten Standort, damit regionale Schadensereignisse nicht beide Standorte treffen.

### Erklärung
Redundanz im selben Gebäude schützt vor Hardwareausfällen, nicht vor Brand, Hochwasser oder großflächigem Stromausfall. Das BSI empfiehlt in seinen „Kriterien für die Standortwahl höchstverfügbarer und georedundanter Rechenzentren“ einen Abstand von etwa **200 km**, mindestens 100 km. Systeme der Verfügbarkeitsklassen 3 und 4 sollen georedundant betrieben werden. Die Daten werden zwischen den Standorten gespiegelt; bei großen Entfernungen meist asynchron, was einen kleinen Datenverlust (RPO > 0) in Kauf nimmt.

### Beispiel
Das Möbelhaus betreibt sein ERP in Hamburg und repliziert es in ein Rechenzentrum in Frankfurt. Ein Hochwasser in Hamburg legt nur einen Standort lahm.

### Abgrenzung
Georedundanz erhöht die Verfügbarkeit, **ersetzt aber kein Backup**: Gelöschte oder verschlüsselte Daten werden sofort mitrepliziert.

### Merksatz
Ein Ereignis darf nie beide Standorte treffen.

Siehe auch: Hochverfügbarkeit · Verfügbarkeitsklassen · Single Point of Failure · Disaster Recovery · 3-2-1-Regel
Mehr: Deep Dive 16, 4.5

## Geringverdienergrenze
<!-- id: geringverdienergrenze · quellen: Karte DD14, DD14 1.3 · stand: 2026-10 -->

Bei Auszubildenden mit einem Arbeitsentgelt von höchstens 325 € im Monat trägt der Arbeitgeber die Sozialversicherungsbeiträge allein (§ 20 Abs. 3 SGB IV).

### Erklärung
Die Grenze ist ein fester Betrag und nicht an den Mindestlohn gekoppelt. Bis 325 € zahlt der Auszubildende keinen eigenen Beitrag; der Arbeitgeber übernimmt auch den Arbeitnehmeranteil. Liegt die Vergütung darüber, zahlt der Azubi sofort den **vollen** regulären Arbeitnehmeranteil – den gleitenden Übergangsbereich (Midijob) gibt es für Auszubildende nicht.

### Beispiel
Ein Praktikant in betrieblicher Berufsausbildung erhält 300 € → der Arbeitgeber trägt alles. Ein Azubi mit 500 € zahlt den normalen Arbeitnehmeranteil, z. B. 9,3 % Rentenversicherung = 46,50 €.

### Abgrenzung
Die Minijob-Grenze (603 € im Jahr 2026) gilt für geringfügig Beschäftigte, nicht für Auszubildende.

### Prüfungsfalle
Bei einem Azubi mit 500 € den Übergangsbereich anwenden.

### Merksatz
Azubi bis 325 €: Der Betrieb zahlt alles.

Siehe auch: Minijob · Übergangsbereich (Midijob) · Sozialversicherung · Mindestausbildungsvergütung
Mehr: Deep Dive 14, 1.3

## Gesamtpuffer
<!-- id: gesamtpuffer · quellen: Karte DD12, DD12 3.2 · stand: 2026-10 -->

Zeit, um die sich ein Vorgang verschieben darf, ohne den Projekttermin zu gefährden: $\text{GP} = \text{SAZ} - \text{FAZ}$ (= SEZ − FEZ).

### Erklärung
Der Gesamtpuffer ergibt sich aus Vorwärts- und Rückwärtsrechnung. Vorgänge mit GP = 0 bilden den **kritischen Pfad**. Achtung: Der Gesamtpuffer wird von allen Vorgängen eines Pfads gemeinsam genutzt – verbraucht ihn ein Vorgang, haben die folgenden keinen mehr.

### Beispiel
A „Datenmodell“ (3) → B „Testdaten“ (2) → D; C „Quellsysteme“ (7) → D. Projektende vor D an Tag 7.
Rückwärts: SEZ(B) = 7, SAZ(B) = 5, SEZ(A) = 5, SAZ(A) = 2.
GP(A) = 2 − 0 = **2**, GP(B) = 5 − 3 = **2**, GP(C) = 0 → C ist kritisch.
Verschiebt sich A um 2 Tage, haben B und das Projekt keinen Spielraum mehr.

### Abgrenzung
Der freie Puffer (hier FP(A) = 0, FP(B) = 2) ist der Spielraum, ohne einen Nachfolger zu verzögern; er ist nie größer als der Gesamtpuffer.

### Prüfungsfalle
Den kritischen Pfad als kürzesten Weg ansehen – er ist der längste.

### Merksatz
GP = SAZ − FAZ; null Puffer heißt kritisch.

Siehe auch: Freier Puffer · Kritischer Pfad · SAZ · FAZ · Rückwärtsrechnung
Mehr: Deep Dive 12, 3.2

## Geschäftsfähigkeit
<!-- id: geschaftsfahigkeit · quellen: Karte DD14, DD14 2.1 · stand: 2026-10 -->

Fähigkeit, Rechtsgeschäfte selbstständig wirksam abzuschließen: geschäftsunfähig unter 7 Jahren, beschränkt geschäftsfähig von 7 bis 17, voll geschäftsfähig ab 18.

### Erklärung
Willenserklärungen Geschäftsunfähiger sind **nichtig** (§§ 104, 105 BGB). Verträge beschränkt Geschäftsfähiger sind **schwebend unwirksam**, bis die Eltern zustimmen (§ 108 BGB). Sofort wirksam sind Geschäfte, die lediglich einen rechtlichen Vorteil bringen (§ 107), und Käufe, die mit überlassenen Mitteln bewirkt werden (**Taschengeldparagraf**, § 110). Ratenkäufe und Laufzeitverträge fallen nicht darunter.

### Beispiel
Jonas Brandt (17) kauft im Möbelhaus einen Schreibtisch für 399 € auf Raten. Der Vertrag ist schwebend unwirksam, bis seine Eltern zustimmen; verweigern sie, ist er von Anfang an unwirksam.

### Abgrenzung
Die **Rechtsfähigkeit** (Träger von Rechten und Pflichten zu sein) beginnt mit der Geburt; die Geschäftsfähigkeit hängt vom Alter ab.

### Prüfungsfalle
Einen Ratenkauf mit Taschengeld als wirksam einstufen.

### Merksatz
Unter 7 nichtig, 7 bis 17 schwebend, ab 18 voll.

Siehe auch: Rechtsfähigkeit · Taschengeldparagraf · Natürliche Personen · Kaufvertrag
Mehr: Deep Dive 14, 2.1

## Geschäftsprozess
<!-- id: geschaftsprozess · quellen: Karte DD5, DD5 1.1 · stand: 2026-10 -->

Folge logisch zusammenhängender Aktivitäten, die aus einem definierten Auslöser ein Ergebnis mit Kundennutzen erzeugt – mit Start und Ende, Prozesseigner, messbaren Zielen und wiederholbarem Ablauf.

### Erklärung
Geschäftsprozesse werden in Kern-, Unterstützungs- und Führungsprozesse eingeteilt. Sie laufen meist quer durch mehrere Abteilungen; an jeder Schnittstelle entstehen Liegezeiten. Deshalb gibt die prozessorientierte Organisation jedem Prozess einen **Prozesseigner**. Modelliert werden Prozesse mit BPMN oder EPK, gemessen mit Kennzahlen wie Durchlaufzeit, Fehlerquote und Termintreue.

### Beispiel
Reparaturservice im Möbelhaus: Auslöser Reparaturmeldung des Kunden → Auftrag erfassen → Kostenvoranschlag → Reparatur → Rechnung; Ergebnis: reparierter Stuhl beim Kunden. Prozesseigner ist die Serviceleitung, Ziel z. B. Durchlaufzeit unter 5 Tagen.

### Abgrenzung
Ein **Projekt** ist einmalig und zeitlich befristet; ein Geschäftsprozess wiederholt sich.

### Merksatz
Auslöser rein, Kundennutzen raus – und das immer wieder.

Siehe auch: Kernprozess · Unterstützungsprozess · Führungsprozess · BPMN · Durchlaufzeit
Mehr: Deep Dive 5, 1.1

## Gesetzliche Rente
<!-- id: gesetzliche-rente · quellen: DD14 1.5 · stand: 2026-10 -->

Erste Säule der Altersvorsorge: Pflichtversicherung in der gesetzlichen Rentenversicherung, finanziert im Umlageverfahren.

### Erklärung
Träger ist die Deutsche Rentenversicherung. Die Beiträge der Erwerbstätigen finanzieren die laufenden Renten (**Generationenvertrag**); der Beitragssatz beträgt 18,6 %, je zur Hälfte von Arbeitgeber und Arbeitnehmer (Stand 2026). Leistungen sind Altersrente, Erwerbsminderungsrente und Rehabilitation. Die Regelaltersgrenze steigt schrittweise auf 67 Jahre (für Jahrgänge ab 1964). Weil immer weniger Beitragszahler immer mehr Rentner finanzieren, sichert die gesetzliche Rente allein den Lebensstandard meist nicht.

### Abgrenzung
| Säule | Beispiel |
|---|---|
| 1. gesetzliche Rente | Pflichtbeitrag 18,6 % |
| 2. betriebliche Altersversorgung | Entgeltumwandlung mit Arbeitgeberzuschuss |
| 3. private Vorsorge | Rentenversicherung, Fonds, Immobilien |

### Beispiel
Lea Sommer verdient 1.200 € Ausbildungsvergütung: Ihr Rentenbeitrag beträgt 9,3 % = 111,60 €, der Arbeitgeber zahlt denselben Betrag.

### Prüfungsfalle
Das Umlageverfahren mit einem Kapitaldeckungsverfahren verwechseln – die Beiträge werden nicht für die eigene Rente angespart.

### Merksatz
Heute zahlen die Jungen für die Alten – Umlageverfahren.

Siehe auch: Umlageverfahren · Rentenversicherung · Drei-Säulen-Modell der Altersvorsorge · Betriebliche Altersversorgung · Private Vorsorge
Mehr: Deep Dive 14, 1.5 · Deep Dive 14, 1.3

## GET
<!-- id: get · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

HTTP-Methode zum Lesen einer Ressource; sicher und idempotent (RFC 9110).

### Erklärung
**Sicher** heißt: Die Anfrage verändert auf dem Server nichts. **Idempotent** heißt: Mehrfaches Ausführen hat dieselbe Wirkung wie einmaliges. Deshalb dürfen Browser, Proxys und Clients GET-Anfragen zwischenspeichern und nach einem Timeout gefahrlos wiederholen. Parameter stehen in der URL (Query-String); Erfolgscode ist 200 OK.

### Beispiel
```http
GET /reparaturauftraege/5001
```
liefert den Auftrag 5001 als JSON; `GET /reparaturauftraege?status=offen&seite=2` eine gefilterte, paginierte Liste.

### Abgrenzung
| Methode | Zweck | sicher | idempotent |
|---|---|---|---|
| GET | lesen | ja | ja |
| POST | anlegen | nein | nein |
| PUT | ersetzen | nein | ja |
| DELETE | löschen | nein | ja |

### Prüfungsfalle
Zugangsdaten oder API-Schlüssel als URL-Parameter eines GET übergeben – URLs landen in Logs und im Browserverlauf; sie gehören in den Header.

### Merksatz
GET liest nur – und darf beliebig oft wiederholt werden.

Siehe auch: POST · PUT · Idempotent · Sichere HTTP-Methode · REST
Mehr: Deep Dive 15, 3.2

## Gewährleistung
<!-- id: gewahrleistung · quellen: Karte DD14, DD14 2.5 · stand: 2026-10 -->

Gesetzliche Mängelhaftung des Verkäufers (§§ 434 ff. BGB); Ansprüche verjähren bei neuen Sachen in 2 Jahren ab Ablieferung.

### Erklärung
Lag bei Übergabe ein Sach- oder Rechtsmangel vor, hat der Käufer zuerst Anspruch auf **Nacherfüllung** – Nachbesserung oder Ersatzlieferung nach seiner Wahl. Erst wenn sie scheitert oder verweigert wird, kann er zurücktreten oder mindern, zusätzlich ggf. Schadensersatz verlangen. Beim Verbrauchsgüterkauf gilt eine **Beweislastumkehr**: Zeigt sich der Mangel innerhalb eines Jahres, wird vermutet, dass er schon bei Übergabe bestand. Bei gebrauchten Sachen darf die Frist gegenüber Verbrauchern auf ein Jahr verkürzt werden.

### Beispiel
Ein Kunde kauft am 01.03.2026 einen Schreibtisch, im November wackelt das Gestell wegen eines Schweißfehlers. Er verlangt Nachbesserung; das Möbelhaus muss beweisen, dass der Mangel bei Übergabe nicht vorlag.

### Abgrenzung
Die **Garantie** ist freiwillig und meist vom Hersteller; die Gewährleistung ist gesetzlich und richtet sich gegen den Verkäufer.

### Prüfungsfalle
Sofort Rücktritt oder Minderung wählen statt zuerst Nacherfüllung.

### Merksatz
Erst nacherfüllen, dann zurücktreten oder mindern.

Siehe auch: Garantie · Mangelhafte Lieferung · Sachmangel · Beweislastumkehr beim Verbrauchsgüterkauf · Verjährung
Mehr: Deep Dive 14, 2.5

## Gewicht
<!-- id: gewicht · quellen: Karte DD6, DD6 8.2, DD6 9.2 · stand: 2026-10 -->

Zahl an einer Eingabe bzw. Verbindung im neuronalen Netz, die bestimmt, wie stark diese Eingabe das Neuron beeinflusst.

### Erklärung
Jede Eingabe eines Neurons wird mit ihrem Gewicht multipliziert, bevor alles addiert wird: z = w₁ · x₁ + w₂ · x₂ + … + b. Ein positives Gewicht verstärkt die Eingabe, ein negatives hemmt sie, ein Gewicht nahe 0 lässt sie fast unbeachtet. Die Gewichte sind das, was ein Netz beim Training lernt; vorher stehen sie auf kleinen Zufalls- oder Startwerten. Damit kein Merkmal nur wegen seiner großen Zahlen dominiert, werden die Eingaben vorher skaliert.

### Beispiel
Neuron zum Reklamationsrisiko: Die Lieferdauer (skaliert 0,8) hat das Gewicht 1,5 und trägt 1,2 zur Summe bei. Die Zahl der Packstücke (0,5) hat das Gewicht −0,5 und senkt die Summe um 0,25.

### Abgrenzung
Das Gewicht gehört zu einer Eingabe, der Bias zum Neuron selbst. Mit dem gewichteten arithmetischen Mittel der Statistik hat es nur den Namen gemeinsam.

### Merksatz
Gewichte sind das Gedächtnis eines neuronalen Netzes.

Siehe auch: Neuron · Bias · Perzeptron-Lernregel · Skalieren
Mehr: Deep Dive 6, 9.2

## Gewichtetes arithmetisches Mittel
<!-- id: gewichtetes-arithmetisches-mittel · quellen: Karte DD3, DD3 Teil 3 · stand: 2026-10 -->

Mittelwert, bei dem jeder Wert mit seinem Gewicht multipliziert wird: $\bar{x} = \frac{\sum (x_i \cdot g_i)}{\sum g_i}$.

### Erklärung
Man braucht es, wenn Werte unterschiedlich häufig vorkommen oder unterschiedlich wichtig sind – etwa bei Häufigkeitstabellen und klassierten Daten (dann Klassenmitte · Klassenhäufigkeit). Auch die Nutzwertanalyse ist im Kern eine gewichtete Summe.

### Beispiel
3 Aufträge à 40 min und 7 Aufträge à 60 min:
$\bar{x} = \frac{3 \cdot 40 + 7 \cdot 60}{10} = \frac{540}{10} = 54$ min.
Das ungewichtete Mittel (40 + 60) / 2 = 50 min wäre falsch.

### Prüfungsfalle
Durchschnitte von Teilgruppen einfach mitteln, obwohl die Gruppen verschieden groß sind.

### Merksatz
Wer öfter vorkommt, zählt mehr.

Siehe auch: Arithmetisches Mittel · Median · Lagemaß · Geometrisches Mittel
Mehr: Deep Dive 3, Teil 3

## Gleichgewichtspreis
<!-- id: gleichgewichtspreis · quellen: Karte DD14, DD14 4.2 · stand: 2026-10 -->

Preis, bei dem angebotene und nachgefragte Menge übereinstimmen; der Markt wird geräumt.

### Erklärung
Liegt der Preis darunter, entsteht ein **Nachfrageüberhang** und der Preis steigt; liegt er darüber, entsteht ein **Angebotsüberhang** und der Preis sinkt. Im Gleichgewicht wird die größtmögliche Menge umgesetzt. Staatliche Höchstpreise unter dem Gleichgewicht erzeugen Knappheit, Mindestpreise darüber Überschüsse.

### Beispiel
| Preis | Nachfrage | Angebot | Situation |
|---|---|---|---|
| 12 € | 800 | 500 | Nachfrageüberhang 300 |
| 14 € | 650 | 650 | Gleichgewicht |
| 16 € | 500 | 800 | Angebotsüberhang 300 |

Gleichgewichtspreis 14 €, umgesetzte Menge 650. Bei 12 € werden nur 500 Stück verkauft (das Angebot begrenzt), bei 16 € nur 500 (die Nachfrage begrenzt).

### Prüfungsfalle
Im Ungleichgewicht die größere der beiden Mengen als Absatz angeben – umgesetzt wird immer die kleinere.

### Merksatz
Angebot = Nachfrage → Gleichgewichtspreis.

Siehe auch: Staatliche Eingriffe · Marktformen · Soziale Marktwirtschaft
Mehr: Deep Dive 14, 4.2

## Gleitender Durchschnitt
<!-- id: gleitender-durchschnitt · quellen: Karte DD4, DD4 3.1 · stand: 2026-10 -->

Mittelwert über ein wanderndes Zeitfenster (z. B. 3 Monate), der kurzfristige Schwankungen glättet und den Trend sichtbar macht.

### Erklärung
Beim zentrierten 3-Perioden-Durchschnitt wird jeder Wert durch das Mittel aus sich und seinen beiden Nachbarn ersetzt. Je länger das Fenster, desto glatter die Kurve, desto träger reagiert sie aber. Am Anfang und Ende der Reihe fehlen Werte (bei 3 Perioden je einer), und aktuelle Ausschläge werden abgeschwächt – ein Nachteil für Frühwarnzwecke.

### Beispiel
Monatsumsatz (T€): 120, 138, 126, 150, 144, 168, 156, 180
- $\frac{120 + 138 + 126}{3} = 128{,}0$
- $\frac{138 + 126 + 150}{3} = 138{,}0$
- $\frac{126 + 150 + 144}{3} = 140{,}0$

Geglättet: 128, 138, 140, 154, 156, 168 – der steigende Trend ist klar.

### Abgrenzung
Die Regression legt eine Trendgerade durch alle Punkte; der gleitende Durchschnitt glättet lokal und macht keine Prognose über die Reihe hinaus.

### Merksatz
Glätten zeigt den Trend, verschluckt aber den Rand.

Siehe auch: Zeitreihe · Arithmetisches Mittel · Regression · Liniendiagramm
Mehr: Deep Dive 4, 3.1

## GmbH
<!-- id: gmbh · quellen: Karte DD14, DD14 3.2 · stand: 2026-10 -->

Gesellschaft mit beschränkter Haftung: Kapitalgesellschaft mit mindestens 25.000 € Stammkapital, die nur mit ihrem Gesellschaftsvermögen haftet und vom Geschäftsführer geleitet wird.

### Erklärung
Die GmbH ist eine juristische Person und Formkaufmann; sie entsteht erst mit der Eintragung ins Handelsregister (Abteilung B). Organe sind die **Geschäftsführung** (leitet und vertritt) und die **Gesellschafterversammlung** (beschließt z. B. Gewinnverwendung, bestellt Geschäftsführer); ab mehr als 500 Beschäftigten kommt ein Aufsichtsrat hinzu. Die Gesellschafter riskieren nur ihre Einlage. Die Firma braucht den Zusatz „GmbH“.

### Abgrenzung
| Rechtsform | Mindestkapital | Haftung |
|---|---|---|
| GmbH | 25.000 € | Gesellschaftsvermögen |
| UG (haftungsbeschränkt) | ab 1 €, Rücklagenpflicht | Gesellschaftsvermögen |
| AG | 50.000 € | Gesellschaftsvermögen |
| OHG | keines | Gesellschafter unbeschränkt |

### Beispiel
Die Möbelhaus Nordholz GmbH kann eine Lieferantenrechnung nicht zahlen. Der Lieferant kann auf das Vermögen der GmbH zugreifen, nicht auf das Privatvermögen der Gesellschafter.

### Prüfungsfalle
„Beschränkte Haftung“ so verstehen, dass die GmbH nur bis 25.000 € haftet – sie haftet mit ihrem gesamten Vermögen, beschränkt ist das Risiko der Gesellschafter.

### Merksatz
Die GmbH haftet voll, die Gesellschafter nur mit ihrer Einlage.

Siehe auch: GmbH-Gründung · UG (haftungsbeschränkt) · AG · GmbH & Co. KG · Formkaufmann
Mehr: Deep Dive 14, 3.2

## GmbH & Co. KG
<!-- id: gmbh-co-kg · quellen: Karte DD14, DD14 3.2 · stand: 2026-10 -->

Kommanditgesellschaft, deren persönlich haftender Gesellschafter (Komplementär) eine GmbH ist – dadurch ist die Haftung faktisch beschränkt.

### Erklärung
In der KG haftet der Komplementär unbeschränkt, die Kommanditisten nur bis zu ihrer Einlage. Ist der Komplementär eine GmbH, haftet sie zwar unbeschränkt, aber nur mit ihrem eigenen Gesellschaftsvermögen. Keine natürliche Person haftet dann persönlich. Häufig sind die Gesellschafter der GmbH zugleich Kommanditisten. Die Gesellschaft bleibt eine Personengesellschaft (Handelsregister Abteilung A); die Firma muss die Haftungsbeschränkung erkennen lassen (§ 19 Abs. 2 HGB).

### Beispiel
Die Familie Nordholz gründet die „Nordholz Verwaltungs-GmbH“ als Komplementärin und beteiligt sich selbst als Kommanditisten an der „Nordholz Logistik GmbH & Co. KG“.

### Abgrenzung
Bei der normalen KG haftet der Komplementär als Mensch mit dem Privatvermögen; bei der GmbH & Co. KG nur die GmbH.

### Merksatz
KG mit einer GmbH vorne – keiner haftet privat.

Siehe auch: KG · GmbH · OHG · Handelsregister
Mehr: Deep Dive 14, 3.2

## GmbH-Gründung
<!-- id: gmbh-grundung · quellen: DD14 3.2, DD14 2.3 · stand: 2026-10 -->

Ablauf von der notariellen Beurkundung des Gesellschaftsvertrags über die Einzahlung des Stammkapitals bis zur Eintragung ins Handelsregister.

### Erklärung
1. Gesellschaftsvertrag **notariell beurkunden** (bei bis zu drei Gesellschaftern geht das vereinfachte Musterprotokoll; seit 2022 auch online per Videoverfahren beim Notar).
2. Einlagen leisten: auf jeden Geschäftsanteil mindestens ein Viertel, insgesamt mindestens die Hälfte des Mindeststammkapitals, also **12.500 €** (§ 7 Abs. 2 GmbHG).
3. Anmeldung zum Handelsregister (notariell beglaubigt).
4. Eintragung – erst jetzt entsteht die GmbH (konstitutiv).

Vor der Eintragung haften die Handelnden persönlich (§ 11 Abs. 2 GmbHG).

### Beispiel
Zwei Gesellschafter mit je 12.500 € Anteil an 25.000 € Stammkapital: Ein Viertel je Anteil wären nur 3.125 € (zusammen 6.250 €). Weil insgesamt 12.500 € eingezahlt sein müssen, zahlt jeder mindestens 6.250 € ein.

### Prüfungsfalle
Schriftform oder öffentliche Beglaubigung für den Gesellschaftsvertrag nennen – er braucht die notarielle Beurkundung.

### Merksatz
Beurkunden, einzahlen, anmelden, eintragen – dann gibt es die GmbH.

Siehe auch: GmbH · Notarielle Beurkundung · Handelsregister · UG (haftungsbeschränkt)
Mehr: Deep Dive 14, 3.2 · Deep Dive 14, 2.3

## Golden Record
<!-- id: golden-record · quellen: Karte DD9, DD9 4.2, DD9 5.4 · stand: 2026-10 -->

Der führende, bereinigte Datensatz je Realweltentität, zusammengeführt aus Dubletten und Quellsystemen.

### Erklärung
Beim Zusammenführen wird je Feld festgelegt, welche Quelle Vorrang hat (z. B. Adresse aus dem CRM, Bankverbindung aus der Buchhaltung, jeweils der jüngste Stand). Abhängige Belege wie Bestellungen werden auf den Golden Record umgehängt, die Dubletten stillgelegt. Im **Master Data Management** stellt ein führendes System den Golden Record allen Prozessen bereit; je nach Architekturstil wird er in die Quellsysteme zurückgespielt.

### Beispiel
„Braun GmbH“ (Warenwirtschaft) und „Braun G.m.b.H.“ (CRM) werden nach Normalisierung als Dublette erkannt. Der Golden Record übernimmt die aktuelle Anschrift aus dem CRM und die USt-ID aus der Warenwirtschaft; alle Bestellungen verweisen danach auf ihn.

### Abgrenzung
Die Dublettenbereinigung ist der Arbeitsschritt, der Golden Record ihr Ergebnis; ein UNIQUE-Constraint verhindert nur exakte, keine unscharfen Dubletten.

### Merksatz
Eine Entität, ein führender Datensatz.

Siehe auch: Dublette · Dublettenbereinigung · Master Data Management · Record Linkage · Stammdaten
Mehr: Deep Dive 9, 4.2 · Deep Dive 9, 5.4

## Granularität
<!-- id: granularitat · quellen: Karte DD8, DD8 4.1 · stand: 2026-10 -->

Die feinste Detailstufe einer Faktentabelle, z. B. eine Zeile je Bestellposition.

### Erklärung
Die Granularität wird **vor** dem Entwurf des Star-Schemas festgelegt, weil sie bestimmt, welche Fragen später beantwortbar sind. Detailtiefe lässt sich jederzeit aggregieren (Roll-up), aber nie aus verdichteten Daten rekonstruieren. Zu grob gewählt, sind Detailauswertungen unmöglich; zu fein gewählt, wächst die Tabelle unnötig.

### Beispiel
Speichert das Möbelhaus nur den Tagesumsatz je Filiale, kann es keine Warenkorbanalyse und keinen Umsatz je Produkt mehr auswerten. Mit einer Zeile je Bestellposition gehen beide Auswertungen – und der Tagesumsatz entsteht per Summe.

### Abgrenzung
Die DQ-Dimension Genauigkeit betrifft die Detailtiefe einzelner Werte (Minuten statt Tage); Granularität die Detailstufe der Zeilen einer Faktentabelle.

### Prüfungsfalle
Für einen Data Mart „Monatsumsatz je Kategorie“ als Granularität wählen, obwohl Drill-down auf Produkt verlangt ist.

### Merksatz
Verdichten geht immer, zurück nie.

Siehe auch: Faktentabelle · Star-Schema · Drill-down · Roll-up · Genauigkeit
Mehr: Deep Dive 8, 4.1

## Graphdatenbank
<!-- id: graphdatenbank · quellen: Karte DD15, DD15 4.1 · stand: 2026-10 -->

NoSQL-Datenbank, die Daten als Knoten und Kanten (Beziehungen) speichert – für stark vernetzte Daten.

Auch: Graph

### Erklärung
Knoten stehen für Objekte (Kunde, Produkt), Kanten für Beziehungen (kauft, empfiehlt); beide können Eigenschaften tragen. Abfragen folgen den Kanten direkt, statt Tabellen über viele Joins zu verknüpfen – Beziehungen über mehrere Stufen bleiben dadurch schnell. Bekanntes System ist Neo4j mit der Abfragesprache Cypher.

### Beispiel
Empfehlung im Webshop: „Kunden, die diesen Schreibtisch kauften, kauften auch …“ – vom Produkt über die Kanten *kauft* zu anderen Kunden und von dort zu deren Produkten.

### Abgrenzung
| Typ | Prinzip | Beispiel |
|---|---|---|
| dokumentenorientiert | JSON-Dokumente | MongoDB |
| Key-Value | Schlüssel → Wert | Redis |
| Wide Column | Spaltenfamilien | Cassandra |
| Graph | Knoten und Kanten | Neo4j |

### Merksatz
Wenn die Beziehungen wichtiger sind als die Daten: Graphdatenbank.

Siehe auch: NoSQL · Dokumentenorientierte Datenbank · Key-Value-Datenbank · Wide-Column-Store
Mehr: Deep Dive 15, 4.1

## GraphQL
<!-- id: graphql · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

Abfragesprache für APIs über einen einzigen Endpunkt, bei der der Client genau die benötigten Felder anfordert.

### Erklärung
Ein Schema mit Typsystem beschreibt, welche Daten abfragbar sind. Lesen heißt *Query*, Ändern *Mutation*. Weil der Client die Felder bestimmt, gibt es kein **Overfetching** (zu viele Felder) und kein **Underfetching** (mehrere Aufrufe für zusammengehörige Daten).

### Beispiel
```graphql
{
  auftrag(id: 5001) {
    status
    kunde { name }
  }
}
```
liefert nur Status und Kundenname – bei REST wären womöglich zwei Aufrufe (`/reparaturauftraege/5001`, `/kunden/1`) mit allen Feldern nötig.

### Abgrenzung
REST adressiert Ressourcen über viele URIs mit HTTP-Methoden und wird mit OpenAPI beschrieben; SOAP nutzt XML-Nachrichten und WSDL.

### Merksatz
GraphQL: ein Endpunkt, genau die Felder, die du willst.

Siehe auch: REST · SOAP · OpenAPI · API · JSON
Mehr: Deep Dive 15, 3.2

## Green IT
<!-- id: green-it · quellen: Karte DD14, DD14 5.2 · stand: 2026-10 -->

Umwelt- und ressourcenschonender Einsatz von Informationstechnik über den gesamten Lebenszyklus.

### Erklärung
Maßnahmen: energieeffiziente Hardware, Virtualisierung und Konsolidierung, Abschalten ungenutzter Systeme, effiziente Kühlung, längere Nutzungsdauer und fachgerechte Entsorgung (ElektroG, Datenträger vorher löschen). Kennzahl für Rechenzentren ist die **PUE** = Gesamtenergie des Rechenzentrums / Energie der IT, ideal 1,0. Das Energieeffizienzgesetz verlangt für Rechenzentren, die ab dem 01.07.2026 den Betrieb aufnehmen, eine PUE von höchstens 1,2; bestehende müssen ab 01.07.2027 höchstens 1,5 und ab 01.07.2030 höchstens 1,3 erreichen (§ 11 EnEfG, Stand Oktober 2026). Eine Novelle (Regierungsentwurf vom 24.06.2026, im Bundestag) soll neue Rechenzentren bei 1,2 lassen, ihnen aber vier statt zwei Jahre Zeit geben und die Werte für bestehende auf 1,6 bzw. 1,4 lockern – vor der Prüfung den Stand prüfen.

### Beispiel
Ein Rechenzentrum verbraucht 1.500 MWh im Jahr, davon 1.000 MWh für die IT: $\text{PUE} = \frac{1.500}{1.000} = 1{,}5$.

### Abgrenzung
Datensparsamkeit nach DSGVO und Green IT ergänzen sich: Weniger gespeicherte Daten sparen auch Speicher und Energie.

### Merksatz
Green IT: weniger Strom, länger nutzen, richtig entsorgen.

Siehe auch: PUE · Nachhaltigkeit · Elektroschrott · Datenminimierung
Mehr: Deep Dive 14, 5.2

## Grenzen der Nutzwertanalyse
<!-- id: grenzen-der-nutzwertanalyse · quellen: DD12 4.2 · stand: 2026-10 -->

Schwächen der Nutzwertanalyse: Kriterienauswahl, Gewichtung und Punktvergabe sind subjektiv, und die Zahlen erzeugen Scheingenauigkeit.

### Erklärung
Das Ergebnis hängt stark von den Gewichten ab. Liegen zwei Alternativen nah beieinander, kann eine kleine Verschiebung der Gewichtung die Reihenfolge drehen. Deshalb gehört zur Beurteilung eine **Sensitivitätsprüfung**. Die Stärke bleibt: Qualitative Kriterien werden vergleichbar und die Entscheidung nachvollziehbar dokumentiert.

### Beispiel
Anbieter A 7,20, Anbieter B 7,30 Punkte (Funktionsumfang 40 %, Kosten 30 %). Mit Funktionsumfang 50 % und Kosten 20 % liegt A mit 7,50 zu 7,00 vorn – der Abstand von 0,10 Punkten ist nicht belastbar.

### Prüfungsfalle
Den knappen Sieger ohne Beurteilung als Ergebnis nennen; bepunktet wird die kritische Würdigung.

### Merksatz
Knapper Nutzwert – Gewichte prüfen, bevor man entscheidet.

Siehe auch: Nutzwertanalyse · Nutzwert · Make or Buy · Kostenvergleichsrechnung – kritische Menge
Mehr: Deep Dive 12, 4.2

## Grenzen von R²
<!-- id: grenzen-von-r · quellen: DD4 2.3 · stand: 2026-10 -->

Ein hohes Bestimmtheitsmaß belegt weder ein richtiges Modell noch einen kausalen Zusammenhang; es misst nur die Anpassung an die vorliegenden Daten.

### Erklärung
R² gibt den Anteil der Streuung von y an, den das Modell erklärt. Es sagt nichts über Ursache und Wirkung, nichts über die Gültigkeit außerhalb des beobachteten Wertebereichs (Extrapolation) und wenig, wenn nur wenige Datenpunkte vorliegen. Ob die lineare Form passt, zeigen erst die **Residuen**: Sie sollen zufällig um null streuen. Umgekehrt kann bei sehr vielen Daten ein winziger Zusammenhang signifikant, aber praktisch bedeutungslos sein.

### Beispiel
Werbebudget und Umsatz: R² = 0,966 aus fünf Datenpunkten. Daraus folgt nicht, dass ein doppeltes Budget den Umsatz sicher steigert – Saison, Wettbewerb und der kleine Datenumfang bleiben offen.

### Prüfungsfalle
„R² = 0,95, also ist die Prognose sicher“ – Prognosen gelten nur bei gleichen Rahmenbedingungen, im beobachteten Bereich und nach Prüfung an unabhängigen Daten.

### Merksatz
R² misst Passung, nicht Wahrheit.

Siehe auch: R² · Bestimmtheitsmaß · Residuen prüfen · Kausalität · Extrapolation
Mehr: Deep Dive 4, 2.3

## Grenzstelle
<!-- id: grenzstelle · quellen: DD17 4.1 · stand: 2026-10 -->

Symbol im Programmablaufplan (DIN 66001) für Start und Ende, gezeichnet als abgerundetes Rechteck oder Oval.

### Erklärung
Jeder Programmablaufplan beginnt mit genau einer Grenzstelle „Start“ und endet mit mindestens einer Grenzstelle „Ende“ (bzw. „Stopp“). Dazwischen stehen Operationen (Rechteck), Verzweigungen (Raute), Ein-/Ausgaben (Parallelogramm) und Unterprogramme (Rechteck mit doppelten Seitenkanten).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 170" width="160" height="170" role="img" aria-label="PAP mit Grenzstellen Start und Ende">
<defs><marker id="grenzstelle-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<rect x="30" y="8" width="100" height="30" rx="15" class="dg-gut"/>
<text x="80" y="23" text-anchor="middle" dominant-baseline="middle">Start</text>
<line x1="80" y1="38" x2="80" y2="66" class="dg-linie" marker-end="url(#grenzstelle-pfeil)"/>
<rect x="20" y="66" width="120" height="34" class="dg-form"/>
<text x="80" y="83" text-anchor="middle" dominant-baseline="middle">summe ← 0</text>
<line x1="80" y1="100" x2="80" y2="128" class="dg-linie" marker-end="url(#grenzstelle-pfeil)"/>
<rect x="30" y="128" width="100" height="30" rx="15" class="dg-gut"/>
<text x="80" y="143" text-anchor="middle" dominant-baseline="middle">Ende</text>
</svg>
```

### Abgrenzung
Die **Übergangsstelle** (Kreis) verbindet Teile eines Plans über Seiten hinweg; sie ist kein Start oder Ende. Im Aktivitätsdiagramm heißen die Gegenstücke Start- und Endknoten.

### Merksatz
Oval: Hier beginnt oder endet der Plan.

Siehe auch: Programmablaufplan · Operation · Verzweigung · Übergangsstelle · Startknoten
Mehr: Deep Dive 17, 4.1

## Grenzwertanalyse
<!-- id: grenzwertanalyse · quellen: Karte DD16, DD16 2.2, DD16 2.3 · stand: 2026-10 -->

Black-Box-Testverfahren, das Testwerte direkt an und neben jeder Grenze einer Äquivalenzklasse wählt, weil Fehler bevorzugt an Rändern sitzen.

### Erklärung
Typische Fehler sind `<` statt `<=` oder um eins verschobene Zähler. Die Grenzwertanalyse ergänzt die Äquivalenzklassenbildung: Aus jeder Klasse genügt ein Repräsentant, an jeder Grenze werden zusätzlich der letzte Wert der einen und der erste Wert der nächsten Klasse getestet.

### Beispiel
Rabattregel: unter 500 € kein Rabatt, 500 € bis unter 2.000 € 5 %, ab 2.000 € 10 %, negative Werte ungültig.
Grenzwerte: −0,01 €; 0,00 €; 499,99 €; 500,00 €; 1.999,99 €; 2.000,00 €.
Mit 5 Repräsentanten ergeben sich 11 Testfälle. Bei 500,00 € fällt auf, wenn der Code `> 500` statt `>= 500` prüft.

### Abgrenzung
Die Äquivalenzklasse fasst Eingaben mit gleichem Verhalten zusammen; die Grenzwertanalyse testet deren Ränder. White-Box-Verfahren (C0, C1) messen dagegen die Codeüberdeckung.

### Merksatz
Fehler wohnen an der Grenze – dort testen.

Siehe auch: Äquivalenzklasse · Black-Box-Test · Testfall · Zweigüberdeckung (C1)
Mehr: Deep Dive 16, 2.2 · Deep Dive 16, 2.3

## Grey-Box-Test
<!-- id: grey-box-test · quellen: Karte DD16, DD16 2.2 · stand: 2026-10 -->

Mischform aus Black- und White-Box-Test: Getestet wird über die Schnittstelle, aber mit Teilkenntnis des Inneren, z. B. des Datenmodells.

Auch: Grey-Box

### Erklärung
Der Tester kennt nicht den ganzen Code, wohl aber Strukturen wie Tabellen, Schnittstellenbeschreibung oder Architektur. Damit kann er gezielter Testfälle ableiten als im reinen Black-Box-Test und das Ergebnis direkt in der Datenbank prüfen. Typisch ist das für Integrations- und Schnittstellentests.

### Beispiel
Die REST-Schnittstelle `POST /reparaturauftraege` wird von außen aufgerufen; der Tester prüft anschließend per SQL, ob in `auftrag` und `auftragsposition` die richtigen Zeilen mit korrekten Fremdschlüsseln angelegt wurden.

### Abgrenzung
| Verfahren | Kenntnis | Beispielmethode |
|---|---|---|
| Black-Box | nur Spezifikation | Äquivalenzklassen, Grenzwerte |
| Grey-Box | Teilkenntnis (Datenmodell) | Schnittstellentest mit DB-Prüfung |
| White-Box | Quellcode | Anweisungs-, Zweigüberdeckung |

### Merksatz
Grey-Box: von außen testen, innen nachsehen.

Siehe auch: Black-Box-Test · White-Box-Test · Integrationstest · Schnittstelle
Mehr: Deep Dive 16, 2.2

## GROUP BY
<!-- id: group-by · quellen: Karte DD1, DD1 2.1 · stand: 2026-10 -->

SQL-Klausel, die Zeilen mit gleichen Werten zu Gruppen zusammenfasst, damit Aggregatfunktionen (SUM, COUNT, AVG …) je Gruppe rechnen.

### Erklärung
Jede Spalte im SELECT, die nicht aggregiert wird, muss im GROUP BY stehen. Die logische Reihenfolge ist FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY: WHERE filtert Zeilen vor der Gruppierung, HAVING filtert Gruppen danach. Alle NULL-Werte einer Spalte bilden eine gemeinsame Gruppe.

### Beispiel
```sql
SELECT ort, COUNT(*) AS anzahl_kunden
FROM kunde
GROUP BY ort;
```
Möbelhaus-Daten: München 2, Hamburg 2, Köln 1.

### Abgrenzung
Eine Fensterfunktion (`OVER (PARTITION BY …)`) rechnet ebenfalls je Gruppe, behält aber alle Einzelzeilen.

### Prüfungsfalle
`SELECT name, ort, COUNT(*) … GROUP BY ort` – name ist weder aggregiert noch gruppiert. SQLite und MySQL ohne ONLY_FULL_GROUP_BY führen das aus, in der Prüfung ist es falsch.

### Merksatz
Was nicht aggregiert ist, gehört ins GROUP BY.

Siehe auch: HAVING · WHERE · Fensterfunktion · COALESCE
Mehr: Deep Dive 1, 2.1

## Grundfreibetrag
<!-- id: grundfreibetrag · quellen: Karte DD14, DD14 1.4 · stand: 2026-10 -->

Steuerfreies Existenzminimum bei der Einkommensteuer: 2026 bleiben 12.348 € zu versteuerndes Einkommen im Jahr steuerfrei (§ 32a Abs. 1 EStG, Stand 2026).

### Erklärung
Bis zum Grundfreibetrag fällt keine Einkommensteuer an, darüber beginnt der Tarif mit dem Eingangssteuersatz. Maßgeblich ist das **zu versteuernde Einkommen**, nicht das Bruttoentgelt: Vorher werden u. a. Arbeitnehmer-Pauschbetrag (1.230 €), Sonderausgaben-Pauschbetrag und Vorsorgepauschale abgezogen. Bei Zusammenveranlagung verdoppelt er sich. Der Betrag wird regelmäßig angehoben.

### Beispiel
Jonas Brandt verdient 1.200 € brutto im Monat, also 14.400 € im Jahr. Nach Abzug von Pauschbeträgen und Vorsorgepauschale liegt sein zu versteuerndes Einkommen unter 12.348 € – Lohnsteuer 0 €.

### Prüfungsfalle
Das Jahresbrutto direkt mit dem Grundfreibetrag vergleichen.

### Merksatz
Bis 12.348 € zu versteuerndes Einkommen: keine Einkommensteuer (2026).

Siehe auch: Lohnsteuer · Nettoentgelt · Steuerklassen · Solidaritätszuschlag
Mehr: Deep Dive 14, 1.4

## Grundfrist
<!-- id: grundfrist · quellen: Karte DD13, DD13 3.3 · stand: 2026-10 -->

Gesetzliche Kündigungsfrist von 4 Wochen zum 15. oder zum Ende eines Kalendermonats (§ 622 Abs. 1 BGB).

### Erklärung
Die Grundfrist gilt für beide Seiten. Die nach Betriebszugehörigkeit verlängerten Fristen (ab 2 Jahren 1 Monat zum Monatsende bis 7 Monate ab 20 Jahren) gelten gesetzlich **nur für Kündigungen durch den Arbeitgeber** (§ 622 Abs. 2). In einer vereinbarten Probezeit (höchstens 6 Monate) gelten 2 Wochen zu jedem Tag. Maßgeblich für den Fristbeginn ist der **Zugang** der Kündigung.

### Beispiel
Herr Kaya (6 Jahre im Betrieb), Kündigung geht am Dienstag, 10.03.2026, zu:
- Er kündigt selbst: 10.03. + 4 Wochen = 07.04. → nächster Termin **15.04.2026**.
- Der Arbeitgeber kündigt: ab 5 Jahren 2 Monate zum Monatsende → 10.05. → **31.05.2026**.

### Prüfungsfalle
Dem kündigenden Arbeitnehmer die verlängerte Frist zuschreiben, obwohl Vertrag und Tarifvertrag nichts anderes regeln.

### Merksatz
Vier Wochen zum 15. oder Monatsende – länger nur für den Arbeitgeber.

Siehe auch: Ordentliche Kündigung · Probezeit · Kündigungsschutzgesetz · Außerordentliche Kündigung
Mehr: Deep Dive 13, 3.3

## Grundgesamtheit
<!-- id: grundgesamtheit · quellen: Karte DD3, DD3 4.3 · stand: 2026-10 -->

Menge aller Elemente, über die eine statistische Aussage getroffen werden soll.

### Erklärung
Liegen alle Daten der Grundgesamtheit vor (Vollerhebung), beschreibt man sie direkt und teilt bei der Varianz durch n ($\sigma^2$). Wird nur eine **Stichprobe** untersucht, um auf die Grundgesamtheit zu schließen, teilt man durch n − 1 ($s^2$). Die Stichprobe muss repräsentativ sein, sonst überträgt sich eine Verzerrung (Bias) auf die Aussage.

### Beispiel
Durchlaufzeiten 2, 4, 5, 6, 8 Tage, Summe der Abweichungsquadrate 20.
- Alle Aufträge des Monats (Grundgesamtheit): $\sigma^2 = \frac{20}{5} = 4$, $\sigma = 2$ Tage.
- Stichprobe aus dem Jahr: $s^2 = \frac{20}{4} = 5$, $s = 2{,}24$ Tage.

### Abgrenzung
In Werkzeugen: Excel VAR.P/STABW.N (Grundgesamtheit) gegen VAR.S/STABW.S (Stichprobe); SQL VAR_POP gegen VAR_SAMP.

### Prüfungsfalle
Ohne Begründung n oder n − 1 verwenden – immer hinschreiben, welche Variante gilt und warum.

### Merksatz
Alles da: durch n; nur ein Teil: durch n − 1.

Siehe auch: Stichprobe · Varianz · Standardabweichung · Bias
Mehr: Deep Dive 3, 4.3

## Gültigkeit
<!-- id: gultigkeit · quellen: Karte DD9, DD9 Teil 1 · stand: 2026-10 -->

Datenqualitätsdimension (auch Konformität): Entsprechen die Werte den festgelegten Format- und Wertebereichsregeln?

Auch: Gültigkeit / Konformität

### Erklärung
Gültigkeit wird über Muster-, Format- und Wertebereichsprüfungen gemessen, etwa als Gültigkeitsgrad = formatkonforme Werte / geprüfte Werte · 100. Präventiv sichern sie CHECK-Constraints, Auswahllisten und Formatprüfungen bei der Erfassung.

### Beispiel
Von 2.000 Kunden haben 40 eine vierstellige PLZ: Gültigkeitsgrad $\frac{1.960}{2.000} \cdot 100 = 98\ \%$. Ursache: PLZ als Zahl gespeichert, die führende Null ging verloren.

### Abgrenzung
**Korrektheit** fragt, ob der Wert stimmt. Eine fünfstellige PLZ ist gültig – sie kann trotzdem die falsche sein. Formatprüfungen fangen daher nur einen Teil der Fehler.

### Prüfungsfalle
Gültig und korrekt gleichsetzen.

### Merksatz
Gültig = richtiges Format, nicht unbedingt richtiger Wert.

Siehe auch: Korrektheit · Formatprüfung · Wertebereichsprüfung (CHECK) · Datenqualität · Postleitzahlen als Text
Mehr: Deep Dive 9, Teil 1 · Deep Dive 9, Teil 3

## Günstigkeitsprinzip
<!-- id: gunstigkeitsprinzip · quellen: Karte DD13, DD13 5.2, DD13 5.3 · stand: 2026-10 -->

Von höherrangigen Regelungen darf nur **zugunsten** der Beschäftigten abgewichen werden (für Tarifverträge § 4 Abs. 3 TVG).

### Erklärung
Arbeitsrechtliche Regeln stehen in einer Rangfolge: Grundgesetz → Gesetze → Tarifvertrag → Betriebsvereinbarung → Arbeitsvertrag → Weisung. Grundsätzlich geht die höhere Ebene vor. Nach dem Günstigkeitsprinzip darf eine niedrigere Ebene aber bessere Bedingungen vereinbaren; schlechtere sind unwirksam. Gesetzliche Mindeststandards (z. B. Mindesturlaub) sind damit eine Untergrenze.

### Beispiel
Gesetz 24 Werktage Urlaub, Tarifvertrag 30 Tage, Arbeitsvertrag 28 Tage. Eine tarifgebundene Beschäftigte erhält 30 Tage – der Arbeitsvertrag darf den Tarifvertrag nur verbessern. Stünden im Arbeitsvertrag 32 Tage, gälten 32.

### Prüfungsfalle
Den Arbeitsvertrag als speziellere Regel immer vorgehen lassen – nur wenn er günstiger ist.

### Merksatz
Abweichen nach unten nie, nach oben immer.

Siehe auch: Rangfolge · Tarifvertrag · Betriebsvereinbarung · Arbeitsvertrag · Beispiel Günstigkeitsprinzip
Mehr: Deep Dive 13, 5.2 · Deep Dive 13, 5.3

## Ausgelassen
- Grenzen – Listenpunkt Modellbewertung
