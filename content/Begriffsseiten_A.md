<!-- Begriffsseiten A · Stand 2026-10 -->
## ABC-Analyse
<!-- id: abc-analyse · quellen: Karte DD5, DD5 6.5 · stand: 2026-10 -->

Verfahren, das Objekte (Artikel, Kunden, Lieferanten) nach ihrem Wertanteil in drei Klassen teilt: A bis etwa 80 % des Gesamtwerts, B bis etwa 95 %, C der Rest.

### Erklärung
Vorgehen: Wert je Objekt berechnen (z. B. Jahresverbrauchswert = Menge · Preis), absteigend sortieren, Anteil am Gesamtwert und kumulierten Anteil bilden, dann an den Grenzen klassieren. Typisch ist: Wenige A-Objekte machen den Großteil des Werts aus, viele C-Objekte nur einen kleinen Rest. Daraus folgt, wo sich Aufwand lohnt – Preisverhandlung, Bestandsoptimierung, enge Überwachung bei A, vereinfachte Verfahren bei C.

### Beispiel
| Artikel | Jahresverbrauchswert | Anteil | kumuliert | Klasse |
|---|---|---|---|---|
| Bürostuhl | 48.000 € | 53,3 % | 53,3 % | A |
| Schreibtisch | 21.000 € | 23,3 % | 76,7 % | A |
| Monitor | 12.000 € | 13,3 % | 90,0 % | B |
| Lampe, Kabelkanal, Schrauben | 9.000 € | 10,0 % | 100,0 % | C |

Gesamtwert 90.000 €: Zwei von sechs Artikeln (33 %) bringen 76,7 % des Werts.

### Abgrenzung
Die **Pareto-Analyse** arbeitet mit demselben Prinzip (sortieren, kumulieren), meist aber mit Häufigkeiten von Ursachen und nur zwei Gruppen (80/20). Die ABC-Analyse bildet drei Wertklassen.

### Prüfungsfalle
Vor dem Kumulieren nicht absteigend sortiert – dann sind alle Klassengrenzen falsch.

### Merksatz
Erst sortieren, dann kumulieren, dann klassieren.

Siehe auch: Pareto-Analyse · Pareto-Prinzip · Kumulierte Häufigkeit · SWOT-Analyse
Mehr: Deep Dive 5, 6.5

## Abfallhierarchie
<!-- id: abfallhierarchie · quellen: Karte DD14, DD14 5.2 · stand: 2026-10 -->

Gesetzliche Rangfolge der Abfallbewirtschaftung nach § 6 Kreislaufwirtschaftsgesetz: Vermeidung → Vorbereitung zur Wiederverwendung → Recycling → sonstige Verwertung → Beseitigung.

### Erklärung
Je weiter oben eine Maßnahme steht, desto besser für die Umwelt; nach unten wird nur ausgewichen, wenn die höhere Stufe nicht möglich ist. Sonstige Verwertung meint vor allem die energetische Verwertung (Verbrennung mit Energiegewinnung). Beseitigung (Deponie, Verbrennung ohne Nutzen) ist die letzte Stufe. Die Hierarchie setzt die EU-Abfallrahmenrichtlinie um.

### Beispiel
Alte Bürorechner des Möbelhauses: Nutzungsdauer verlängern (Vermeidung) → Datenträger sicher löschen und Geräte aufbereitet weitergeben (Vorbereitung zur Wiederverwendung) → Rückgabe nach ElektroG zum Recycling → nur Reste werden beseitigt.

### Abgrenzung
**Green IT** setzt früher an: Energie und Ressourcen im Betrieb sparen. Die Abfallhierarchie regelt, was am Ende der Nutzung geschieht.

### Prüfungsfalle
Recycling für die oberste Stufe halten – Vermeidung und Wiederverwendung gehen vor.

### Merksatz
Vermeiden vor Wiederverwenden vor Recyceln vor Verbrennen vor Beseitigen.

Siehe auch: Nachhaltigkeit · Elektroschrott · Green IT · Umweltmanagementsysteme
Mehr: Deep Dive 14, 5.2

## Abgeschnittene Achse
<!-- id: abgeschnittene-achse · quellen: Karte DD11, DD11 A3, DD11 A2 · stand: 2026-10 -->

Manipulationstechnik: Eine y-Achse, die bei Balken- oder Säulendiagrammen nicht bei null beginnt, lässt kleine Unterschiede riesig wirken.

### Erklärung
Bei Balken und Säulen codiert die Länge den Wert. Wird die Achse abgeschnitten, zeigt die sichtbare Länge nur noch den Überschuss über dem Startwert – die Verhältnisse stimmen nicht mehr. Bei Liniendiagrammen ist ein Ausschnitt vertretbar, muss aber erkennbar gekennzeichnet sein (z. B. Achsenbruch).

### Beispiel
Umsätze 4,80; 4,95; 5,10 Mio. €, Wachstum insgesamt 6,25 %. Beginnt die Achse bei 4,70 Mio. €, sind die Säulen 0,10; 0,25; 0,40 hoch – das Verhältnis 1 : 2,5 : 4 suggeriert eine Vervierfachung. Lügenfaktor: $\frac{3{,}00}{0{,}0625} = 48$.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 180" width="420" height="180" role="img" aria-label="Gleiche Umsätze mit Achse ab null und mit abgeschnittener Achse">
<line x1="30" y1="150" x2="190" y2="150" class="dg-linie"/>
<line x1="30" y1="20" x2="30" y2="150" class="dg-linie"/>
<rect x="50" y="37" width="30" height="113" class="dg-grau"/>
<rect x="95" y="34" width="30" height="116" class="dg-grau"/>
<rect x="140" y="30" width="30" height="120" class="dg-akzent"/>
<text x="25" y="150" text-anchor="end" dominant-baseline="middle" class="dg-klein">0</text>
<text x="110" y="168" text-anchor="middle" class="dg-klein">Achse ab 0 – ehrlich</text>
<line x1="240" y1="150" x2="400" y2="150" class="dg-linie"/>
<line x1="240" y1="20" x2="240" y2="150" class="dg-linie"/>
<rect x="260" y="120" width="30" height="30" class="dg-grau"/>
<rect x="305" y="75" width="30" height="75" class="dg-grau"/>
<rect x="350" y="30" width="30" height="120" class="dg-rot"/>
<text x="235" y="150" text-anchor="end" dominant-baseline="middle" class="dg-klein">4,7</text>
<text x="320" y="168" text-anchor="middle" class="dg-klein">Achse ab 4,7 – verzerrt</text>
</svg>
```

### Abgrenzung
Eine **gestauchte oder gedehnte Achse** verändert das Seitenverhältnis und lässt Trends flach oder steil wirken; die abgeschnittene Achse verfälscht die Längenverhältnisse.

### Prüfungsfalle
Nur „Achse beginnt nicht bei null“ schreiben – volle Punkte gibt es erst mit der Wirkung (Unterschiede wirken größer) und dem tatsächlichen Zuwachs.

### Merksatz
Balken beginnen bei null, weil ihre Länge der Wert ist.

Siehe auch: Lügenfaktor · Datenintegrität in Diagrammen · Säulendiagramm · Auswahl des Zeitausschnitts
Mehr: Deep Dive 11, A3 · Deep Dive 11, A2

## Abgrenzung
<!-- id: abgrenzung · quellen: DD5 1.2, DD15 5.4 · stand: 2026-10 -->

Erster Schritt der Prozessanalyse: Start, Ende, Schnittstellen und beteiligte Rollen des untersuchten Prozesses festlegen.

### Erklärung
Ohne Abgrenzung weiß niemand, wo der Prozess beginnt und aufhört – die Ist-Aufnahme wird uferlos, Kennzahlen wie die Durchlaufzeit sind nicht vergleichbar. Festgelegt werden der auslösende Input (Startereignis), das Ergebnis (Endereignis), die Schnittstellen zu anderen Prozessen und Systemen sowie die beteiligten Rollen. Danach folgen Ist-Aufnahme, Ist-Modellierung, Schwachstellenanalyse und Soll-Konzeption.

### Beispiel
Reparaturservice der Möbelhaus Nordholz GmbH: Start „Reparaturmeldung des Kunden eingegangen“, Ende „Rechnung gestellt“ bzw. „Absage gesendet“; Schnittstellen zu Einkauf (Ersatzteile) und Buchhaltung; Rollen Serviceannahme, Werkstatt, Buchhaltung.

### Abgrenzung
Im Use-Case-Diagramm zieht die **Systemgrenze** eine ähnliche Linie für ein IT-System: Was liegt innerhalb, wer handelt von außen. Bei UML-Diagrammen bezeichnet „Abgrenzung“ dagegen nur den Vergleich der Diagrammarten (Aktivitäts-, Sequenz-, Zustandsdiagramm).

### Prüfungsfalle
Gleich mit der Modellierung beginnen – dann fehlen Start- und Endereignis oder der Prozess franst in Nachbarprozesse aus.

### Merksatz
Erst den Rahmen ziehen, dann das Bild malen.

Siehe auch: Ist-Aufnahme · Ist-Modellierung · Geschäftsprozess · SIPOC · Systemgrenze
Mehr: Deep Dive 5, 1.2 · Deep Dive 15, 5.4

## Ablauforganisation
<!-- id: ablauforganisation · quellen: Karte DD5, DD5 6.1 · stand: 2026-10 -->

Regelt, wie die Arbeit zeitlich und räumlich abläuft – also die Prozesse eines Unternehmens.

### Erklärung
Die Ablauforganisation beschreibt Reihenfolge, Dauer, Ort und Verantwortung der Arbeitsschritte. Dargestellt wird sie mit Prozessmodellen wie BPMN oder EPK, gemessen mit Prozesskennzahlen wie Durchlaufzeit und Fehlerquote. Eine prozessorientierte Organisation gibt jedem Prozess einen Prozesseigner, der vom Auftrag bis zur Rechnung verantwortlich ist.

### Beispiel
Ablauf im Reparaturservice: Auftrag erfassen → Kostenvoranschlag erstellen → bei Annahme Ersatzteil bestellen und Techniker einplanen (parallel) → Reparatur durchführen → Rechnung stellen.

### Abgrenzung
| | Aufbauorganisation | Ablauforganisation |
|---|---|---|
| Frage | Wer ist wofür zuständig? | Wie läuft die Arbeit ab? |
| Inhalt | Stellen, Abteilungen, Weisungen | Prozesse, Reihenfolge, Zeiten |
| Darstellung | Organigramm | BPMN, EPK |

### Prüfungsfalle
Ein Organigramm als Darstellung der Ablauforganisation nennen – es zeigt nur die Struktur, keinen Ablauf.

### Merksatz
Aufbau sagt „wer“, Ablauf sagt „wie“.

Siehe auch: Aufbauorganisation · Geschäftsprozess · BPMN · Organigramm
Mehr: Deep Dive 5, 6.1

## Abmahnung
<!-- id: abmahnung · quellen: Karte DD13, DD13 3.2, DD13 3.4 · stand: 2026-10 -->

Rüge eines konkreten Fehlverhaltens mit der Warnung vor arbeitsrechtlichen Folgen bis zur Kündigung; meist Voraussetzung für eine verhaltensbedingte Kündigung.

### Erklärung
Eine wirksame Abmahnung erfüllt drei Funktionen: Hinweisfunktion (das Verhalten genau beschreiben, mit Datum), Rügefunktion (deutlich machen, dass es eine Pflichtverletzung ist) und Warnfunktion (Kündigung im Wiederholungsfall androhen). Rechtsgrundlage ist der Verhältnismäßigkeitsgrundsatz, für Kündigungen aus wichtigem Grund ausdrücklich § 314 Abs. 2 BGB. Eine Form ist nicht vorgeschrieben, aus Beweisgründen erfolgt sie schriftlich. Bei schweren Verstößen (z. B. Diebstahl, Tätlichkeit) kann sie entbehrlich sein.

### Beispiel
Ein Mitarbeiter des Möbelhauses kommt am 3., 10. und 17. März jeweils über 30 Minuten zu spät. Die Abmahnung nennt die Termine, fordert Pünktlichkeit und kündigt für den Wiederholungsfall die Kündigung an. Kommt er danach erneut zu spät, ist eine verhaltensbedingte Kündigung möglich.

### Abgrenzung
Die Abmahnung beendet das Arbeitsverhältnis nicht; erst die **Kündigung** tut das. Bei personenbedingten Gründen (Krankheit) ist eine Abmahnung sinnlos, weil der Beschäftigte das Verhalten nicht steuern kann.

### Prüfungsfalle
Eine allgemeine Ermahnung ohne Androhung von Konsequenzen ist keine Abmahnung – die Warnfunktion fehlt.

### Merksatz
Hinweis, Rüge, Warnung – erst dann die verhaltensbedingte Kündigung.

Siehe auch: Außerordentliche Kündigung · Ordentliche Kündigung · Kündigungsschutzgesetz · Arbeitsvertrag
Mehr: Deep Dive 13, 3.2 · Deep Dive 13, 3.4

## Abnahme
<!-- id: abnahme · quellen: Karte DD12, DD12 Teil 5, DD16 3.4 · stand: 2026-10 -->

Formale Prüfung und Billigung des Projektergebnisses gegen das Pflichtenheft bzw. die vereinbarten Abnahmekriterien, festgehalten im Abnahmeprotokoll.

### Erklärung
Grundlage sind messbare **Abnahmekriterien**, die vorab vereinbart wurden. Das Abnahmeprotokoll enthält Projekt und Version, Datum, Beteiligte, geprüfte Kriterien mit Ergebnis, festgestellte Mängel mit Frist und die Entscheidung (Abnahme, Abnahme unter Vorbehalt, Ablehnung). Beim Werkvertrag hat die Abnahme Rechtsfolgen (§ 640 BGB): Die Vergütung wird fällig (§ 641), die Gefahr geht über (§ 644), die Verjährung der Mängelansprüche beginnt (§ 634a Abs. 2), und danach muss der Auftraggeber einen Mangel beweisen.

### Beispiel
Der Fachbereich nimmt das neue Reparatur-Dashboard ab: Alle Kennzahlen stimmen mit der Kontrollrechnung überein, nur ein Filter fehlt. Ergebnis: Abnahme unter Vorbehalt, Mangel „Filter Werkstatt“ mit Frist 14 Tage im Protokoll.

### Abgrenzung
Der **Abnahmetest** ist die Teststufe, in der der Auftraggeber prüft; die Abnahme ist die formale Erklärung danach. Wegen unwesentlicher Mängel darf die Abnahme nicht verweigert werden; schweigt der Auftraggeber auf eine Fristsetzung ohne Mangelangabe, gilt das Werk als abgenommen (**fiktive Abnahme**, § 640 Abs. 2 BGB).

### Prüfungsfalle
Bekannte Mängel nicht ins Protokoll aufnehmen – wer sie nicht vorbehält, verliert dafür die Mängelrechte außer Schadensersatz (§ 640 Abs. 3 BGB).

### Merksatz
Mit der Abnahme kippt alles: Geld fällig, Gefahr über, Verjährung läuft.

Siehe auch: Abnahmetest · Pflichtenheft · Werkvertrag · Fiktive Abnahme · Projektabschluss
Mehr: Deep Dive 12, Teil 5 · Deep Dive 16, 3.4

## Abnahmetest
<!-- id: abnahmetest · quellen: Karte DD16, DD16 2.1 · stand: 2026-10 -->

Letzte Teststufe: Der Auftraggeber bzw. Fachbereich prüft das System unter realen Bedingungen auf Eignung für den Einsatz – Grundlage der Abnahme.

### Erklärung
Im V-Modell steht der Abnahmetest der Anforderungsdefinition gegenüber; Prüfgrundlage sind Lastenheft und Abnahmekriterien. Getestet wird meist als **Black-Box-Test** mit echten oder realitätsnahen Daten und typischen Arbeitsabläufen der späteren Nutzer. Varianten sind z. B. der fachliche Abnahmetest durch Anwender und der betriebliche durch den IT-Betrieb.

### Beispiel
Zwei Disponentinnen des Möbelhauses arbeiten eine Woche mit dem neuen Reparatur-Dashboard und gleichen die Kennzahlen mit ihrer bisherigen Excel-Auswertung ab.

### Abgrenzung
| Teststufe | Wer testet? | Grundlage |
|---|---|---|
| Komponententest | Entwickler | technischer Entwurf |
| Integrationstest | Entwickler/Testteam | Schnittstellen |
| Systemtest | Testteam | Pflichtenheft |
| Abnahmetest | Auftraggeber | Lastenheft, Abnahmekriterien |

### Prüfungsfalle
System- und Abnahmetest verwechseln: Der Systemtest läuft beim Auftragnehmer gegen das Pflichtenheft, der Abnahmetest beim Auftraggeber.

### Merksatz
Im Abnahmetest prüft der Kunde, ob er das Ergebnis brauchen kann.

Siehe auch: Abnahme · Systemtest · V-Modell · Black-Box-Test · Lastenheft
Mehr: Deep Dive 16, 2.1

## Absolute Häufigkeit
<!-- id: absolute-haufigkeit · quellen: Karte DD3, DD3 Teil 2 · stand: 2026-10 -->

Anzahl, wie oft ein Merkmalswert in den Daten vorkommt (Symbol h).

### Erklärung
Die absolute Häufigkeit entsteht durch Auszählen und ist auf jedem Skalenniveau zulässig, auch bei nominalen Merkmalen. Die Summe aller absoluten Häufigkeiten ergibt die Anzahl der Fälle n. Aus ihr werden die relative Häufigkeit $f = \frac{h}{n}$ und die kumulierte Häufigkeit berechnet. In SQL liefert `COUNT(*)` mit `GROUP BY` die absoluten Häufigkeiten.

### Beispiel
50 Reklamationen: Transportschaden h = 18, Montagefehler h = 15, Falschlieferung h = 9, Materialfehler h = 6, Sonstiges h = 2. Kontrolle: $18 + 15 + 9 + 6 + 2 = 50$. Relative Häufigkeit Transportschaden: $\frac{18}{50} = 0{,}36$ = 36 %.

### Abgrenzung
Die **relative Häufigkeit** ist der Anteil (0 bis 1 bzw. 0 bis 100 %); die absolute Häufigkeit ist eine Anzahl. Für Vergleiche zwischen unterschiedlich großen Gruppen taugt nur die relative.

### Prüfungsfalle
Zwei Filialen mit 30 bzw. 45 Reklamationen vergleichen, ohne die Zahl der Aufträge zu berücksichtigen.

### Merksatz
Absolut zählt, relativ vergleicht.

Siehe auch: Relative Häufigkeit · Kumulierte Häufigkeit · Histogramm · Pareto-Diagramm
Mehr: Deep Dive 3, Teil 2

## Accuracy
<!-- id: accuracy · quellen: Karte DD7, DD7 2.2, DD7 2.3 · stand: 2026-10 -->

Anteil aller richtigen Vorhersagen eines Klassifikationsmodells: $\text{Accuracy} = \frac{TP + TN}{\text{alle Fälle}}$; bei unausgeglichenen Klassen irreführend.

### Erklärung
Accuracy (Korrektklassifikationsrate) zählt richtig positive und richtig negative Fälle gemeinsam. Sie ist einfach zu verstehen, verdeckt aber, welche Fehler das Modell macht. Ist die interessierende Klasse selten, erreicht schon ein Modell, das immer die Mehrheitsklasse vorhersagt, eine hohe Accuracy.

### Beispiel
1.000 Aufträge, 100 reklamiert; TP = 60, FN = 40, FP = 90, TN = 810.
$\text{Accuracy} = \frac{60 + 810}{1000} = 87\ \%$. Ein triviales Modell, das immer „keine Reklamation“ sagt, erreicht $\frac{900}{1000} = 90\ \%$ – findet aber keinen einzigen Reklamationsfall (Recall 0 %). Das ist das **Accuracy-Paradox**.

### Abgrenzung
| Kennzahl | Formel | Frage |
|---|---|---|
| Accuracy | (TP + TN) / alle | Wie viel insgesamt richtig? |
| Precision | TP / (TP + FP) | Wie viele Alarme stimmen? |
| Recall | TP / (TP + FN) | Wie viele Positive gefunden? |
| Balanced Accuracy | (Recall + Spezifität) / 2 | robust bei Ungleichgewicht |

### Prüfungsfalle
„Genauigkeit“ ist doppeldeutig (Accuracy oder Precision) – immer den englischen Begriff und die Formel angeben.

### Merksatz
Hohe Accuracy bei seltenen Fällen beweist nichts – erst mit der Baseline vergleichen.

Siehe auch: Konfusionsmatrix · Precision · Recall · Balanced Accuracy · Unausgeglichene Klassen
Mehr: Deep Dive 7, 2.2 · Deep Dive 7, 2.3

## Achsenbeschriftung mit Einheit
<!-- id: achsenbeschriftung-mit-einheit · quellen: DD11 A2 · stand: 2026-10 -->

Gestaltungsregel: Jede Diagrammachse trägt eine Bezeichnung der Größe und ihre Einheit, z. B. „Umsatz in Mio. €“ oder „Durchlaufzeit in Stunden“.

### Erklärung
Ohne Einheit ist ein Diagramm nicht interpretierbar: „5“ kann Tage, Stunden oder Prozent bedeuten. Zur Beschriftung gehören die Größe, die Einheit und bei Bedarf der Maßstab (Tsd., Mio.). Zusammen mit dem Nullpunkt bei Balken, sparsamer Farbe und sinnvoller Sortierung zählt sie zu den Grundregeln, die bei „Beurteilen Sie die Darstellung“ abgefragt werden.

### Beispiel
Ein Liniendiagramm zeigt die monatliche Reparaturdauer mit Werten zwischen 20 und 35 ohne Achsentitel. Erst „Durchlaufzeit je Auftrag in Stunden“ macht klar, dass es nicht um Tage geht.

### Abgrenzung
Die Achsenbeschriftung erklärt die Skala; eine **Legende** erklärt Farben bzw. Datenreihen. Beides ersetzt sich nicht.

### Prüfungsfalle
In der Beurteilung nur „Beschriftung fehlt“ notieren statt die Folge zu nennen: Werte sind nicht einzuordnen, Fehlinterpretation droht.

### Merksatz
Eine Zahl ohne Einheit ist keine Information.

Siehe auch: Datenintegrität in Diagrammen · Abgeschnittene Achse · Sparsam mit Farben · Chartjunk
Mehr: Deep Dive 11, A2

## ACID
<!-- id: acid · quellen: Karte DD1, DD1 3.5, DD15 4.1 · stand: 2026-10 -->

Die vier Eigenschaften einer Transaktion in relationalen Datenbanken: Atomicity, Consistency, Isolation, Durability.

### Erklärung
- **Atomicity** (Atomarität): ganz oder gar nicht – bei einem Fehler wird alles zurückgerollt.
- **Consistency** (Konsistenz): Die Transaktion führt von einem konsistenten Zustand in den nächsten; Constraints bleiben erfüllt.
- **Isolation**: Parallele Transaktionen beeinflussen sich nicht (abgestuft über Isolationsstufen).
- **Durability** (Dauerhaftigkeit): Bestätigte (committete) Änderungen überstehen auch einen Absturz.

### Beispiel
```sql
BEGIN TRANSACTION;
INSERT INTO bestellung (bestell_id, kunden_id, bestelldatum) VALUES (106, 4, '2026-07-06');
INSERT INTO bestellposition (bestell_id, produkt_id, menge) VALUES (106, 11, 1);
COMMIT;
```
Scheitert das zweite INSERT, folgt ROLLBACK – es entsteht nie eine Bestellung ohne Position.

### Abgrenzung
Viele NoSQL-Systeme folgen **BASE** (Basically Available, Soft State, Eventually Consistent): Änderungen sind erst nach kurzer Zeit überall sichtbar, dafür hohe Verfügbarkeit.

### Prüfungsfalle
Consistency aus ACID mit dem C aus dem **CAP-Theorem** gleichsetzen: ACID meint Regeltreue der Daten, CAP meint gleiche Daten auf allen Knoten.

### Merksatz
Ganz oder gar nicht, regelgerecht, ungestört, dauerhaft.

Siehe auch: Transaktion · Autocommit · BASE · Isolationsstufen · CAP-Theorem
Mehr: Deep Dive 1, 3.5 · Deep Dive 15, 4.1

## Activity
<!-- id: activity · quellen: DD5 5.1 · stand: 2026-10 -->

Pflichtfeld im Event Log, das den ausgeführten Prozessschritt bezeichnet, z. B. „Auftrag erfassen“.

### Erklärung
Ein Event Log für Process Mining braucht mindestens drei Felder: **Case ID** (welcher Fall), **Activity** (welcher Schritt) und **Timestamp** (wann). Aus der Folge der Activities je Case ID rekonstruiert das Werkzeug den tatsächlichen Ablauf, die Varianten, Schleifen und Durchlaufzeiten je Schritt. Optional kommt die **Resource** dazu (wer hat den Schritt ausgeführt).

### Beispiel
| Case ID | Activity | Timestamp |
|---|---|---|
| 5001 | Auftrag erfassen | 2026-03-02 08:14 |
| 5001 | Kostenvoranschlag erstellen | 2026-03-02 10:40 |
| 5001 | Reparatur durchführen | 2026-03-05 13:05 |

### Abgrenzung
Im BPMN-Modell entspricht eine Activity meist einem **Task**. Im Event Log ist sie aber nur ein Bezeichner – ob „Rechnung stellen“ und „Rechnungsstellung“ derselbe Schritt sind, weiß das Werkzeug nicht.

### Prüfungsfalle
Uneinheitliche Bezeichnungen übersehen: Derselbe Schritt erscheint dann als zwei Activities und erzeugt Scheinvarianten. Vor der Analyse vereinheitlichen.

### Merksatz
Case ID sagt welcher Fall, Activity was passiert, Timestamp wann.

Siehe auch: Event Log · Case ID · Timestamp · Process Mining · Uneinheitliche Aktivitätsbezeichnungen
Mehr: Deep Dive 5, 5.1

## AG
<!-- id: ag · quellen: Karte DD14, DD14 3.2 · stand: 2026-10 -->

Aktiengesellschaft: Kapitalgesellschaft mit einem in Aktien zerlegten Grundkapital von mindestens 50.000 € (§ 7 AktG) und den Organen Vorstand, Aufsichtsrat und Hauptversammlung.

### Erklärung
Die AG ist juristische Person und **Formkaufmann**; sie entsteht erst mit der Eintragung ins Handelsregister (Abteilung B), die Satzung muss notariell beurkundet werden. Den Gläubigern haftet nur das Gesellschaftsvermögen. Die Organe:
- **Vorstand**: leitet die Gesellschaft in eigener Verantwortung.
- **Aufsichtsrat**: überwacht und bestellt den Vorstand.
- **Hauptversammlung**: Versammlung der Aktionäre; wählt die Anteilseignervertreter in den Aufsichtsrat, beschließt über die Gewinnverwendung und entlastet Vorstand und Aufsichtsrat.

### Beispiel
Mehr als 500 Beschäftigte: ein Drittel des Aufsichtsrats sind Arbeitnehmervertreter (Drittelbeteiligungsgesetz); mehr als 2.000: paritätische Besetzung (Mitbestimmungsgesetz).

### Abgrenzung
| | GmbH | AG |
|---|---|---|
| Mindestkapital | 25.000 € Stammkapital | 50.000 € Grundkapital |
| Leitung | Geschäftsführer | Vorstand |
| Anteile | Geschäftsanteile, Übertragung notariell | Aktien, börsenfähig |

### Prüfungsfalle
Vorstand und Aufsichtsrat vertauschen: Der Aufsichtsrat leitet nicht, er kontrolliert.

### Merksatz
50.000 € Grundkapital, drei Organe: leiten, überwachen, beschließen.

Siehe auch: Organe der AG · GmbH · Formkaufmann · Handelsregister · Unternehmensmitbestimmung im Aufsichtsrat
Mehr: Deep Dive 14, 3.2

## AGB
<!-- id: agb · quellen: Karte DD14, DD14 2.6 · stand: 2026-10 -->

Allgemeine Geschäftsbedingungen: für viele Verträge vorformulierte Vertragsbedingungen, die eine Partei der anderen stellt (§ 305 BGB).

### Erklärung
AGB werden gegenüber Verbrauchern nur Vertragsbestandteil, wenn bei Vertragsschluss ausdrücklich auf sie hingewiesen wird und der Kunde zumutbar von ihnen Kenntnis nehmen kann. Das BGB schützt den Vertragspartner:
- **Individualabreden** haben Vorrang (§ 305b).
- **Überraschende Klauseln** werden nicht Vertragsbestandteil; Unklarheiten gehen zulasten des Verwenders (§ 305c).
- Klauseln, die den Partner **unangemessen benachteiligen**, sind unwirksam (§ 307, Klauselverbote §§ 308, 309).
- Der übrige Vertrag bleibt wirksam; an die Stelle der unwirksamen Klausel tritt das Gesetz (§ 306).

### Beispiel
Die AGB des Online-Shops der Möbelhaus Nordholz GmbH schließen jede Gewährleistung für Neuware aus. Gegenüber Verbrauchern ist die Klausel unwirksam; es gilt die gesetzliche Gewährleistung von zwei Jahren.

### Abgrenzung
Eine im Einzelnen ausgehandelte **Individualvereinbarung** ist keine AGB und geht ihr vor.

### Prüfungsfalle
Annehmen, eine unwirksame Klausel mache den ganzen Vertrag unwirksam – nur die Klausel fällt weg.

### Merksatz
Was überrascht, gilt nicht; was unangemessen benachteiligt, ist unwirksam; der Rest des Vertrags bleibt.

Siehe auch: Kaufvertrag · Widerrufsrecht · Gewährleistung · Mangelhafte Lieferung
Mehr: Deep Dive 14, 2.6

## AGG
<!-- id: agg · quellen: Karte DD13, DD13 6.1 · stand: 2026-10 -->

Allgemeines Gleichbehandlungsgesetz: verbietet Benachteiligung wegen Rasse bzw. ethnischer Herkunft, Geschlecht, Religion oder Weltanschauung, Behinderung, Alter oder sexueller Identität – auch schon im Bewerbungsverfahren (§ 1 AGG).

### Erklärung
Geschützt sind Beschäftigte, Auszubildende und Bewerber. Der Arbeitgeber muss vorbeugen (Schulungen), eine **Beschwerdestelle** einrichten und das Gesetz bekannt machen. Betroffene können Schadensersatz und eine **Entschädigung** verlangen – schriftlich binnen **zwei Monaten** (§ 15 Abs. 4), Klage binnen drei Monaten danach (§ 61b ArbGG). Wer nicht eingestellt wurde, erhält höchstens drei Monatsgehälter, wenn er auch bei benachteiligungsfreier Auswahl nicht eingestellt worden wäre; einen Anspruch auf Einstellung gibt es nie (§ 15 Abs. 6). Beweislast: Indizien genügen, dann muss der Arbeitgeber das Gegenteil beweisen (§ 22).

### Beispiel
Die Stellenanzeige „Junges, dynamisches Team sucht Datenanalysten (m/w/d) bis 30 Jahre“ ist ein Indiz für Altersdiskriminierung.

### Abgrenzung
Erlaubt bleibt eine Ungleichbehandlung bei einer **wesentlichen beruflichen Anforderung** (§ 8) und als **positive Maßnahme** zum Ausgleich bestehender Nachteile (§ 5).

### Prüfungsfalle
Einen Anspruch auf Einstellung annehmen – es gibt nur Geld.

### Merksatz
Sechs Merkmale, zwei Monate Frist, Geld statt Job.

Siehe auch: Entschädigung · Arbeitsvertrag · Betriebsrat · Schwerbehinderte Menschen
Mehr: Deep Dive 13, 6.1

## Aggregation
<!-- id: aggregation · quellen: Karte DD15, DD15 5.3, DD17 2.3 · stand: 2026-10 -->

Teil-Ganzes-Beziehung im UML-Klassendiagramm, bei der die Teile auch ohne das Ganze existieren können; Symbol: leere Raute am Ganzen.

### Erklärung
Die Aggregation ist eine besondere **Assoziation**. Die Raute sitzt immer an der Klasse, die das Ganze darstellt. Teile können mehreren Ganzen angehören oder ein Ganzes überdauern. Ist das Teil dagegen existenzabhängig, spricht man von **Komposition** (gefüllte Raute).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 120" width="440" height="120" role="img" aria-label="Aggregation mit leerer Raute und Komposition mit gefüllter Raute">
<rect x="10" y="15" width="100" height="32" class="dg-form"/>
<text x="60" y="31" text-anchor="middle" dominant-baseline="middle">Team</text>
<polygon points="110,31 122,25 134,31 122,37" class="dg-form"/>
<line x1="134" y1="31" x2="200" y2="31" class="dg-linie"/>
<rect x="200" y="15" width="110" height="32" class="dg-form"/>
<text x="255" y="31" text-anchor="middle" dominant-baseline="middle">Mitarbeiter</text>
<text x="330" y="31" dominant-baseline="middle" class="dg-klein">Aggregation</text>
<rect x="10" y="70" width="100" height="32" class="dg-form"/>
<text x="60" y="86" text-anchor="middle" dominant-baseline="middle">Bestellung</text>
<polygon points="110,86 122,80 134,86 122,92" class="dg-voll"/>
<line x1="134" y1="86" x2="200" y2="86" class="dg-linie"/>
<rect x="200" y="70" width="110" height="32" class="dg-form"/>
<text x="255" y="86" text-anchor="middle" dominant-baseline="middle">Position</text>
<text x="330" y="86" dominant-baseline="middle" class="dg-klein">Komposition</text>
</svg>
```

### Beispiel
Ein Team besteht aus Mitarbeitern; wird das Team aufgelöst, bleiben die Mitarbeiter bestehen → Aggregation. Eine Bestellposition existiert nicht ohne ihre Bestellung → Komposition.

### Abgrenzung
| Beziehung | Symbol | Teil ohne Ganzes? |
|---|---|---|
| Assoziation | Linie | – |
| Aggregation | leere Raute | ja |
| Komposition | gefüllte Raute | nein |

### Prüfungsfalle
Die Raute an das Teil zeichnen – sie gehört an das Ganze.

### Merksatz
Leere Raute: Teile leben weiter; volle Raute: Teile sterben mit.

Siehe auch: Komposition · Assoziation · Klassendiagramm · Multiplizität
Mehr: Deep Dive 15, 5.3 · Deep Dive 17, 2.3

## Aggregieren
<!-- id: aggregieren · quellen: DD8 3.1 · stand: 2026-10 -->

Transformationsschritt im ETL-Prozess: Detaildaten vorverdichten (summieren, zählen, mitteln), wo die Detailtiefe für die Auswertung nicht gebraucht wird.

### Erklärung
Aggregieren verkleinert die Datenmenge und beschleunigt Abfragen, kostet aber Detailinformation. Deshalb muss vorher feststehen, welche **Granularität** die Auswertungen brauchen. Nicht jede Kennzahl lässt sich einfach summieren: additive Größen (Umsatz) ja, Bestände nur über einen Stichtag oder Durchschnitt, Quoten müssen aus den Grundgrößen neu berechnet werden.

### Beispiel
Aus Millionen Kassenbons wird für den Management-Bericht „Umsatz je Filiale und Tag“ gebildet. Die Marge je Monat wird als Summe Deckungsbeitrag / Summe Umsatz berechnet, nicht als Summe der Tagesmargen.

### Abgrenzung
Im ETL stehen nebeneinander: **Bereinigen** (Fehler entfernen), **Vereinheitlichen** (Formate), **Harmonisieren** (Schlüssel zusammenführen), **Anreichern** (neue Merkmale berechnen) und Aggregieren (verdichten). Die OLAP-Operation **Roll-up** verdichtet dagegen erst bei der Abfrage.

### Prüfungsfalle
Zu früh aggregieren – Detailauswertungen (z. B. je Artikel) sind danach unmöglich.

### Merksatz
Verdichten spart Platz, kostet aber Details – Granularität zuerst festlegen.

Siehe auch: ETL · Granularität · Kennzahlentypen · Roll-up · Anreichern
Mehr: Deep Dive 8, 3.1

## Agile Vorgehensmodelle
<!-- id: agile-vorgehensmodelle · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Iterativ-inkrementelles Vorgehen in kurzen Zyklen mit laufender Abstimmung mit dem Fachbereich; geeignet bei unklaren oder veränderlichen Anforderungen.

### Erklärung
Statt alles vorab zu planen, liefert das Team in kurzen Zyklen jeweils ein nutzbares Teilergebnis (Inkrement), holt Rückmeldung ein und passt die Planung an. Grundlage ist das Agile Manifest (2001): Individuen und Interaktionen, funktionierende Software, Zusammenarbeit mit dem Kunden und Reagieren auf Veränderung werden höher bewertet als Prozesse, Dokumentation, Vertragsverhandlung und Planbefolgung. Bekannte Vertreter sind **Scrum** (Sprints, feste Rollen) und **Kanban** (Fluss, WIP-Limits).

### Beispiel
Für ein Reparatur-Dashboard, dessen Kennzahlen der Fachbereich noch nicht genau kennt, liefert das Team alle zwei Wochen eine erweiterte Version und bespricht sie im Sprint Review.

### Abgrenzung
| | klassisch (Wasserfall, V-Modell) | agil (Scrum, Kanban) |
|---|---|---|
| Anforderungen | klar und stabil | unklar oder veränderlich |
| Planung | vorab vollständig | rollierend |
| Ergebnis sichtbar | am Ende | nach jedem Zyklus |

Ein **hybrides** Vorgehen kombiniert festen Rahmen mit Meilensteinen und iterative Umsetzung – oft passend für IHK-Projekte mit fester Frist.

### Prüfungsfalle
„Agil heißt ohne Planung und Dokumentation“ – geplant wird laufend, dokumentiert wird, was Wert hat.

### Merksatz
Unklare Anforderungen: kurz planen, liefern, lernen, anpassen.

Siehe auch: Scrum · Kanban · Wasserfallmodell · V-Modell · Sprint
Mehr: Deep Dive 12, Teil 2

## Akteur
<!-- id: akteur · quellen: Karte DD15, DD15 5.1, DD17 2.2 · stand: 2026-10 -->

Rolle außerhalb des Systems – eine Person oder ein anderes System –, die mit den Anwendungsfällen eines Use-Case-Diagramms interagiert.

Auch: Akteure

### Erklärung
Akteure werden als Strichmännchen außerhalb der **Systemgrenze** gezeichnet und per Linie mit den Anwendungsfällen verbunden, die sie nutzen. Ein Akteur ist eine Rolle, keine konkrete Person: Dieselbe Person kann mehrere Rollen haben. Auch externe Systeme (Zahlungsdienst, ERP) sind Akteure, oft mit dem Stereotyp «system» oder als Rechteck dargestellt.

### Beispiel
Im Use-Case-Diagramm „Online-Shop“ sind „Kunde“ und „Lagerist“ Akteure; „Kunde“ ist mit „Bestellung aufgeben“ verbunden, „Lagerist“ mit „Ware versenden“.

### Abgrenzung
Der **Anwendungsfall** (Ellipse) beschreibt, was das System leistet; der Akteur, wer es nutzt. Im Sequenzdiagramm erscheinen Akteure als Beteiligte mit eigener **Lebenslinie**.

### Prüfungsfalle
Akteure innerhalb der Systemgrenze zeichnen oder konkrete Namen („Frau Brandt“) statt Rollen verwenden.

### Merksatz
Akteure stehen draußen und sind Rollen, keine Personen.

Siehe auch: Use-Case-Diagramm · Anwendungsfall · Systemgrenze · Include · Extend
Mehr: Deep Dive 15, 5.1 · Deep Dive 17, 2.2

## Aktion
<!-- id: aktion · quellen: DD17 2.4, DD15 5.2 · stand: 2026-10 -->

Einzelner, nicht weiter zerlegter Schritt in einem UML-Aktivitätsdiagramm; Symbol: Rechteck mit abgerundeten Ecken.

### Erklärung
Aktionen werden mit Verb und Objekt beschriftet („Bestellung annehmen“) und durch Pfeile (Kontrollfluss) verbunden. Ein Ablauf beginnt am Startknoten, verzweigt über Entscheidungsknoten (Raute) und läuft über Gabelung und Vereinigung (Balken) parallel. Mehrere Aktionen zusammen bilden die Aktivität, die das ganze Diagramm darstellt.

### Beispiel
Bestellung bearbeiten: „Bestellung annehmen“ → [verfügbar] → parallel „Rechnung erstellen“ und „Ware kommissionieren“ → „Ware versenden“.

### Abgrenzung
In BPMN heißt das entsprechende Element **Task**, in der EPK **Funktion** – alle drei sind abgerundete Rechtecke. Der Zustand im Zustandsdiagramm sieht ähnlich aus, beschreibt aber, in welcher Lage sich ein Objekt befindet, nicht was getan wird.

### Prüfungsfalle
Aktionen mit Substantiven („Rechnung“) statt Verb + Objekt beschriften.

### Merksatz
Aktion = etwas wird getan, also Verb + Objekt.

Siehe auch: Aktivitätsdiagramm · Startknoten · Entscheidungsknoten · Task · Funktion
Mehr: Deep Dive 17, 2.4 · Deep Dive 15, 5.2

## Aktivierungsbalken
<!-- id: aktivierungsbalken · quellen: DD17 2.5, DD15 5.4 · stand: 2026-10 -->

Schmaler Balken auf der Lebenslinie im Sequenzdiagramm, der zeigt, wann ein Beteiligter gerade arbeitet.

### Erklärung
Der Balken beginnt, wenn eine Nachricht beim Beteiligten eintrifft, und endet, wenn er seine Verarbeitung abgeschlossen bzw. geantwortet hat. Ruft ein aktiver Beteiligter selbst andere auf, bleibt sein Balken während der Wartezeit bestehen. So wird sichtbar, wer wie lange beschäftigt ist und welche Aufrufe ineinander verschachtelt sind.

### Beispiel
Der Kunde ruft `bestellen()` am Webshop auf: Der Balken des Webshops beginnt; während der Webshop `pruefeBestand()` beim Lager aufruft, ist auch dort ein kurzer Balken zu sehen. Mit der Bestellbestätigung an den Kunden endet der Balken des Webshops.

### Abgrenzung
Die **Lebenslinie** (gestrichelte Senkrechte) zeigt, dass der Beteiligte existiert; der Aktivierungsbalken darauf zeigt, dass er gerade aktiv ist.

### Prüfungsfalle
Den Balken über die gesamte Lebenslinie ziehen – dann geht die Information verloren, wann gearbeitet wird.

### Merksatz
Lebenslinie = da sein, Balken = arbeiten.

Siehe auch: Sequenzdiagramm · Lebenslinie · Synchrone Nachricht · Antwortnachricht
Mehr: Deep Dive 17, 2.5 · Deep Dive 15, 5.4

## Aktivierungsfunktion
<!-- id: aktivierungsfunktion · quellen: Karte DD6, DD6 8.2, DD6 9.3 · stand: 2026-10 -->

Funktion, die aus der gewichteten Summe z eines Neurons die Ausgabe y macht, z. B. Stufenfunktion, Sigmoid oder ReLU.

### Erklärung
Ein Neuron addiert zuerst seine gewichteten Eingaben und den Bias. Erst die Aktivierungsfunktion entscheidet, was weitergegeben wird. Die Stufenfunktion liefert 0 oder 1 (klassisches Perzeptron), die Sigmoid-Funktion einen Wert zwischen 0 und 1, ReLU schneidet negative Summen auf 0 ab. Wichtig ist die Nichtlinearität: Ohne sie ergäben viele Schichten zusammen nur eine einzige lineare Funktion, und das Netz könnte nicht mehr lernen als ein einzelnes Neuron.

### Beispiel
Ein Neuron zum Reklamationsrisiko hat z = 0,75. Stufenfunktion: y = 1. Sigmoid: σ(0,75) = 1 / (1 + e^(−0,75)) ≈ 0,68. ReLU: max(0; 0,75) = 0,75.

### Abgrenzung
| Funktion | Ausgabe | typischer Einsatz |
|---|---|---|
| Stufenfunktion | 0 oder 1 | Perzeptron |
| Sigmoid-Funktion | zwischen 0 und 1 | Ausgabe als Wahrscheinlichkeit |
| ReLU | 0 bis unendlich | verdeckte Schichten tiefer Netze |

### Prüfungsfalle
Bei der Sigmoid-Funktion e^(+z) statt e^(−z) rechnen – dann kommt 1 − σ(z) heraus.

### Merksatz
Erst summieren, dann aktivieren.

Siehe auch: Neuron · Stufenfunktion · Sigmoid-Funktion · ReLU
Mehr: Deep Dive 6, 9.3

## Aktivitäten (abgerundetes Rechteck)
<!-- id: aktivitaten · quellen: DD5 2.1 · stand: 2026-10 -->

BPMN-Elemente, die ausdrücken, dass etwas getan wird; Symbol: Rechteck mit abgerundeten Ecken.

### Erklärung
BPMN kennt zwei Arten von Aktivitäten:
- **Task**: einzelne Aufgabe, immer mit Verb + Objekt benannt („Auftrag erfassen“).
- **Teilprozess**: mit „+“-Zeichen, fasst mehrere Schritte zusammen und kann aufgeklappt werden.

Marker im Task zeigen die Art: Personensymbol = User Task (Mensch mit Software), Hand = Manual Task (ohne IT), Zahnrad = Service Task (automatisiert), Umschlag = Send/Receive Task. Aktivitäten werden durch Sequenzflüsse verbunden; Entscheidungen fallen in einer Aktivität, Gateways verzweigen nur.

### Beispiel
Im Reparaturprozess: „Kostenvoranschlag erstellen“ (User Task), „Ersatzteil bestellen“ (Service Task, Bestellung per Webservice), „Rechnung stellen“ als Teilprozess mit eigenem Modell.

### Abgrenzung
**Ereignisse** (Kreise) passieren, Aktivitäten werden getan; **Gateways** (Rauten) verzweigen. In der EPK entspricht der Aktivität die **Funktion**, im Aktivitätsdiagramm die **Aktion**.

### Prüfungsfalle
Aktivitäten als Zustand formulieren („Auftrag erfasst“) – das wäre ein Ereignis.

### Merksatz
Kreis = passiert, abgerundetes Rechteck = wird getan, Raute = verzweigt.

Siehe auch: Task · Teilprozess · BPMN · Gateway · Ereignisse (Kreise)
Mehr: Deep Dive 5, 2.1

## Aktivitätsdiagramm
<!-- id: aktivitatsdiagramm · quellen: Karte DD15, DD15 5.2, DD17 2.4 · stand: 2026-10 -->

UML-Verhaltensdiagramm für Abläufe mit Aktionen, Entscheidungen und Parallelität – ähnlich einem Flussdiagramm.

### Erklärung
Es beginnt mit einem gefüllten Kreis (Startknoten) und endet im Endknoten (Kreis mit gefülltem Kreis innen). Aktionen sind abgerundete Rechtecke, Entscheidungen Rauten mit Bedingungen in eckigen Klammern; Balken markieren Gabelung (Fork) und Vereinigung (Join) paralleler Zweige. **Partitionen** (Schwimmbahnen) zeigen Zuständigkeiten.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 80" width="520" height="80" role="img" aria-label="Symbole des Aktivitätsdiagramms">
<circle cx="25" cy="30" r="9" class="dg-voll"/>
<text x="25" y="65" text-anchor="middle" class="dg-klein">Start</text>
<rect x="70" y="15" width="110" height="30" rx="12" class="dg-form"/>
<text x="125" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Aktion</text>
<text x="125" y="65" text-anchor="middle" class="dg-klein">Verb + Objekt</text>
<polygon points="240,14 256,30 240,46 224,30" class="dg-form"/>
<text x="240" y="65" text-anchor="middle" class="dg-klein">Entscheidung</text>
<rect x="300" y="27" width="90" height="6" class="dg-voll"/>
<text x="345" y="65" text-anchor="middle" class="dg-klein">Fork / Join</text>
<circle cx="460" cy="30" r="11" class="dg-form"/>
<circle cx="460" cy="30" r="6" class="dg-voll"/>
<text x="460" y="65" text-anchor="middle" class="dg-klein">Ende</text>
</svg>
```

### Beispiel
Bestellung annehmen → [verfügbar] → Gabelung: Rechnung erstellen ∥ Ware kommissionieren → Vereinigung → Ware versenden → Ende; [nicht verfügbar] → Absage senden → Ende.

### Abgrenzung
| Diagramm | zeigt |
|---|---|
| Aktivitätsdiagramm | Ablauf von Tätigkeiten |
| Sequenzdiagramm | wer wem wann welche Nachricht schickt |
| Zustandsdiagramm | Lebenszyklus eines Objekts |
| BPMN | Geschäftsprozesse mit mehreren Beteiligten |

### Prüfungsfalle
Parallele Zweige ohne Vereinigung (Join) enden lassen oder eine Raute statt eines Balkens für Parallelität zeichnen.

### Merksatz
Raute entscheidet einen Weg, Balken startet alle Wege.

Siehe auch: Aktion · Gabelung (Fork) · Vereinigung (Join) · Sequenzdiagramm · Programmablaufplan
Mehr: Deep Dive 15, 5.2 · Deep Dive 17, 2.4

## Aktualität
<!-- id: aktualitat · quellen: Karte DD9, DD9 Teil 1 · stand: 2026-10 -->

Dimension der Datenqualität: Sind die Werte für den vorgesehenen Zweck hinreichend jung, also auf dem Stand der Realität?

### Erklärung
Daten veralten, weil sich die Realität ändert: Adressen, Preise, Bestände, Ansprechpartner. Wie aktuell Daten sein müssen, hängt vom Zweck ab – ein Live-Bestand braucht Minuten, eine Jahresstatistik nicht. Prüfen lässt sich die Aktualität über das Alter des letzten Änderungsdatums oder den Abgleich mit einer Referenzquelle; sichern über regelmäßige Pflegeprozesse, automatische Übernahme aus dem führenden System und kurze Ladezyklen.

### Beispiel
Kennzahl: Anteil der Kundenadressen, die in den letzten 24 Monaten bestätigt wurden. 1.840 von 2.300 Adressen → $\frac{1840}{2300} = 0{,}80$, also 80 % aktuell.

### Abgrenzung
**Korrektheit** fragt, ob ein Wert mit der Realität übereinstimmt; Aktualität, ob er es noch tut. Eine damals korrekte, inzwischen veraltete Adresse ist ein Aktualitätsproblem. Der **Aktualitätsstempel** im Dashboard macht sichtbar, wie alt die angezeigten Daten sind.

### Prüfungsfalle
Aktualität als absolute Größe sehen – sie ist immer zweckabhängig.

### Merksatz
Aktuell genug ist, was für die Entscheidung noch stimmt.

Siehe auch: Datenqualität · Korrektheit · Vollständigkeit · Aktualitätsstempel · Konsistenz
Mehr: Deep Dive 9, Teil 1

## Aktualitätsstempel
<!-- id: aktualitatsstempel · quellen: Karte DD11, DD11 A4 · stand: 2026-10 -->

Angabe in einem Bericht oder Dashboard, wann die Daten zuletzt geladen wurden – ohne sie weiß niemand, worauf er schaut.

### Erklärung
Dashboards zeigen Daten aus einem Ladelauf, nicht unbedingt den Stand der Quellsysteme. Bricht ein nächtlicher ETL-Lauf ab, zeigt das Dashboard unbemerkt die Zahlen von gestern. Der Stempel („Datenstand: 06.10.2026, 06:00 Uhr“) gehört gut sichtbar auf jede Sicht; idealerweise warnt das Dashboard, wenn er ein festgelegtes Alter überschreitet.

### Beispiel
Die Werkstattleitung bespricht montags die offenen Reparaturaufträge. Der Stempel zeigt „Datenstand: Freitag 06:00“ – der Ladelauf am Wochenende ist ausgefallen, die Zahlen sind drei Tage alt.

### Abgrenzung
Die **Aktualität** ist die Qualitätsdimension der Daten; der Aktualitätsstempel ist die Angabe, die sie für Leser sichtbar macht.

### Prüfungsfalle
Das Erstellungsdatum des Berichts angeben statt des Ladezeitpunkts der Daten.

### Merksatz
Jede Zahl braucht ein Datum, sonst ist sie nicht einzuordnen.

Siehe auch: Dashboard · Aktualität · Vergleichsmaßstab mitliefern · ETL
Mehr: Deep Dive 11, A4

## Algorithmus
<!-- id: algorithmus · quellen: Karte DD11, DD11 Prüfungsrelevanz, DD11 B1 · stand: 2026-10 -->

Eindeutige, endliche Folge von Anweisungen zur Lösung eines Problems.

Auch: Algorithmen

### Erklärung
Ein Algorithmus ist **eindeutig** (jeder Schritt klar bestimmt), **endlich** (endliche Beschreibung, terminiert) und **ausführbar**; er liefert zu einer Eingabe eine Ausgabe. Jeder Algorithmus lässt sich aus drei Kontrollstrukturen bauen: **Sequenz**, **Verzweigung** und **Wiederholung**. In der Prüfung wird algorithmisches Denken geprüft – als Struktogramm, Programmablaufplan oder Pseudocode; Syntaxfehler kosten keine Punkte, Logikfehler schon.

### Beispiel
Maximum der Reparaturdauern bestimmen:
```
max ← dauer[1]
FÜR i VON 2 BIS n
    WENN dauer[i] > max DANN
        max ← dauer[i]
    ENDE WENN
ENDE FÜR
AUSGABE max
```

### Abgrenzung
Der Algorithmus ist das Verfahren; **Pseudocode**, **Struktogramm** und **Programmablaufplan** sind Darstellungsformen davon, ein Programm ist seine Umsetzung in einer Programmiersprache.

### Prüfungsfalle
Den Startwert falsch setzen (z. B. max ← 0 bei negativen Werten) – ein typischer Logikfehler in Fehlersuche-Aufgaben.

### Merksatz
Eindeutig, endlich, ausführbar – aus Sequenz, Verzweigung, Wiederholung.

Siehe auch: Pseudocode · Struktogramm · Programmablaufplan · Aufwand (Komplexität) · Maximum suchen
Mehr: Deep Dive 11, Prüfungsrelevanz · Deep Dive 11, B1

## Allgemeinverbindlicherklärung
<!-- id: allgemeinverbindlicherklarung · quellen: DD13 5.2, Karte DD13 · stand: 2026-10 -->

Staatlicher Akt, mit dem das Bundesarbeitsministerium einen Tarifvertrag für alle Arbeitgeber und Beschäftigten in seinem Geltungsbereich verbindlich macht – auch für nicht tarifgebundene (§ 5 TVG).

Auch: Allgemeinverbindlicherklärung eines Tarifvertrags

### Erklärung
Normalerweise gilt ein Tarifvertrag nur für Mitglieder der beiden Tarifparteien (**Tarifbindung**). Die Allgemeinverbindlicherklärung erstreckt ihn auf die ganze Branche bzw. Region seines Geltungsbereichs. Voraussetzungen: ein gemeinsamer Antrag beider Tarifvertragsparteien, das Einvernehmen mit dem Tarifausschuss (je drei Vertreter der Spitzenverbände von Arbeitgebern und Gewerkschaften) und ein öffentliches Interesse. Das Ministerium kann das Recht im Einzelfall auf eine Landesbehörde übertragen.

### Beispiel
Ein Arbeitgeber im Baugewerbe ist in keinem Verband. Weil die Tarifverträge über die Sozialkassen des Baugewerbes für allgemeinverbindlich erklärt sind, muss er trotzdem Beiträge zahlen und die tariflichen Regeln einhalten.

### Abgrenzung
Weitere Wege zur Geltung eines Tarifvertrags: **Mitgliedschaft** in Gewerkschaft und Arbeitgeberverband sowie die **Bezugnahme** im Arbeitsvertrag („Es gilt der Tarifvertrag …“).

### Prüfungsfalle
Annehmen, ein Tarifvertrag gelte automatisch für alle Beschäftigten eines Betriebs – ohne Bindung, Bezugnahme oder Allgemeinverbindlicherklärung gilt er nicht.

### Merksatz
Allgemeinverbindlich heißt: Der Staat macht den Tarifvertrag zur Regel für alle in der Branche.

Siehe auch: Tarifvertrag · Tarifbindung · Tarifautonomie · Günstigkeitsprinzip
Mehr: Deep Dive 13, 5.2

## Alternativtext
<!-- id: alternativtext · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Textbeschreibung einer Grafik für Screenreader oder als Ersatz, wenn das Bild nicht angezeigt wird – bei Diagrammen ergänzt durch eine Datentabelle.

Auch: Alternativtexte

### Erklärung
Blinde und sehbehinderte Menschen erfassen Diagramme über Screenreader, die nur Text vorlesen. Ein guter Alternativtext nennt Diagrammtyp, Inhalt und die Kernaussage, nicht jedes Detail; bei komplexen Diagrammen gehört eine Datentabelle oder eine ausführliche Beschreibung dazu. Grundlage sind die **WCAG** (Prinzip „wahrnehmbar“), verpflichtend für öffentliche Stellen über die BITV 2.0 und für viele Verbraucherangebote seit 28.06.2025 über das Barrierefreiheitsstärkungsgesetz.

### Beispiel
Schlecht: „Diagramm“. Gut: „Säulendiagramm Umsatz 2024 bis 2026: Anstieg von 4,80 auf 5,10 Mio. €, also +6,25 %.“

### Abgrenzung
Die **Achsenbeschriftung** hilft allen Sehenden beim Lesen der Grafik; der Alternativtext ersetzt die Grafik für Menschen, die sie nicht sehen.

### Prüfungsfalle
Barrierefreiheit nur mit Farben verbinden – Alternativtexte und Tastaturbedienbarkeit gehören genauso dazu.

### Merksatz
Was das Diagramm zeigt, muss auch ohne Bild ankommen.

Siehe auch: Barrierefreiheit · WCAG · Dashboard · Achsenbeschriftung mit Einheit
Mehr: Deep Dive 11, A5

## Amortisationszeit
<!-- id: amortisationszeit · quellen: Karte DD5, DD5 3.3, DD12 4.2 · stand: 2026-10 -->

Zeit, bis eine Investition durch Einsparungen bzw. Rückflüsse wieder hereingeholt ist: $\text{Amortisationszeit} = \frac{\text{Investition}}{\text{jährlicher Rückfluss}}$.

### Erklärung
Die Amortisationsrechnung ist ein **statisches** Verfahren: Zinsen und der Zeitpunkt der Rückflüsse bleiben unberücksichtigt. Bei Prozessoptimierungen ergibt sich der Rückfluss aus Zeitersparnis je Fall · Fallzahl · Kostensatz. Entscheidend ist die Beurteilung: Die Amortisationszeit muss deutlich unter der geplanten Nutzungsdauer liegen – und qualitative Faktoren (Fehlerreduktion, Akzeptanz, Anbieterabhängigkeit) gehören dazu.

### Beispiel
Neue Disponentensoftware: Investition 45.000 €, Einsparung 18.000 € pro Jahr.
$\frac{45.000}{18.000} = 2{,}5$ Jahre. Bei fünf Jahren Nutzungsdauer lohnt sich die Investition; danach erwirtschaftet sie 2,5 Jahre lang Überschuss.

### Abgrenzung
| Verfahren | Frage |
|---|---|
| Amortisationszeit | Wann ist das Geld zurück? |
| ROI | Wie viel Gewinn je eingesetztem Euro? |
| Kapitalwertmethode | Lohnt es sich unter Berücksichtigung von Zinsen? |

### Prüfungsfalle
Amortisationszeit berechnen, aber nicht mit der Nutzungsdauer vergleichen und die qualitative Bewertung weglassen.

### Merksatz
Investition durch jährliche Ersparnis – und dann mit der Nutzungsdauer vergleichen.

Siehe auch: Return on Investment · Kapitalwert · Break-even-Menge · Wirtschaftlichkeitsbetrachtung
Mehr: Deep Dive 5, 3.3 · Deep Dive 12, 4.2

## Analytische Qualitätssicherung
<!-- id: analytische-qualitatssicherung · quellen: Karte DD16, DD16 1.1 · stand: 2026-10 -->

Maßnahmen der Qualitätssicherung, die vorhandene Fehler finden – Reviews, Tests, Messungen, statische Analyse.

### Erklärung
Analytische Maßnahmen prüfen ein fertiges (Teil-)Ergebnis gegen die Anforderungen. Sie teilen sich in **statische** Prüfungen (das Objekt wird nicht ausgeführt: Reviews, statische Codeanalyse) und **dynamische** Prüfungen (das Programm oder die ETL-Strecke läuft: Tests). Sie zeigen Fehler, beseitigen aber nicht ihre Ursache – dafür braucht es konstruktive Maßnahmen.

### Beispiel
Ein Kollege prüft das SQL-Skript der neuen Umsatzkennzahl im Review; anschließend wird das Ergebnis mit der Summe im Quellsystem abgeglichen (Datenabgleich).

### Abgrenzung
| | konstruktiv | analytisch |
|---|---|---|
| Ziel | Fehler vermeiden | Fehler finden |
| Zeitpunkt | vor und während der Entwicklung | nach einem (Teil-)Ergebnis |
| Beispiele | Richtlinien, Vorlagen, Schulung, Versionsverwaltung | Tests, Reviews, Abgleich |

### Prüfungsfalle
Validierungsregeln im Eingabeformular als analytisch einordnen – sie verhindern Fehler und sind konstruktiv.

### Merksatz
Analytisch findet, konstruktiv verhindert.

Siehe auch: Konstruktive Qualitätssicherung · Statische Prüfung · Dynamische Prüfung · Review · Testen
Mehr: Deep Dive 16, 1.1

## AND
<!-- id: and · quellen: Karte DD5, DD5 2.1, DD5 2.2, DD17 1.1 · stand: 2026-10 -->

Paralleles Gateway (BPMN) bzw. UND-Konnektor (EPK): Alle Pfade laufen gleichzeitig; beim Zusammenführen wird auf alle gewartet.

Auch: AND-Gateway

### Erklärung
In BPMN ist das AND-Gateway eine Raute mit „+“, in der EPK ein Kreis mit „∧“. Beim **Aufspalten** wird das Token für jeden ausgehenden Pfad kopiert – es gibt keine Bedingung. Beim **Zusammenführen** wartet das Gateway, bis auf allen Eingängen ein Token angekommen ist, und lässt dann genau eines weiter (Synchronisation). Was ein AND öffnet, schließt ein AND.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 110" width="420" height="110" role="img" aria-label="AND-Gateway spaltet in zwei parallele Tasks und führt sie zusammen">
<defs><marker id="and-pfeil" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<polygon points="60,33 82,55 60,77 38,55" class="dg-form"/>
<line x1="60" y1="43" x2="60" y2="67" class="dg-linie"/>
<line x1="48" y1="55" x2="72" y2="55" class="dg-linie"/>
<path d="M60,33 L60,20 L140,20" class="dg-linie" marker-end="url(#and-pfeil)"/>
<path d="M60,77 L60,90 L140,90" class="dg-linie" marker-end="url(#and-pfeil)"/>
<rect x="140" y="5" width="130" height="30" rx="8" class="dg-form"/>
<text x="205" y="20" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ersatzteil bestellen</text>
<rect x="140" y="75" width="130" height="30" rx="8" class="dg-form"/>
<text x="205" y="90" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Techniker einplanen</text>
<path d="M270,20 L350,20 L350,33" class="dg-linie" marker-end="url(#and-pfeil)"/>
<path d="M270,90 L350,90 L350,77" class="dg-linie" marker-end="url(#and-pfeil)"/>
<polygon points="350,33 372,55 350,77 328,55" class="dg-form"/>
<line x1="350" y1="43" x2="350" y2="67" class="dg-linie"/>
<line x1="338" y1="55" x2="362" y2="55" class="dg-linie"/>
</svg>
```

### Beispiel
Nach der Annahme des Kostenvoranschlags laufen „Ersatzteil bestellen“ und „Techniker einplanen“ parallel; erst wenn beide erledigt sind, folgt „Reparatur durchführen“.

### Abgrenzung
| Gateway | Symbol | Pfade |
|---|---|---|
| XOR | X | genau einer |
| OR | O | einer oder mehrere |
| AND | + | alle |

### Prüfungsfalle
XOR aufspalten und AND zusammenführen → **Deadlock**, weil das AND auf einen Pfad wartet, der nie ein Token bekommt. Umgekehrt (AND auf, XOR zu) läuft der Folgeschritt mehrfach.

### Merksatz
AND: alle gehen los, alle müssen ankommen.

Siehe auch: XOR · OR · Gateway · Token (BPMN) · Deadlock
Mehr: Deep Dive 5, 2.1 · Deep Dive 5, 2.2 · Deep Dive 17, 1.1

## Änderungsanomalie
<!-- id: anderungsanomalie · quellen: Karte DD2, DD2 2.2 · stand: 2026-10 -->

Ein redundant gespeicherter Wert muss in vielen Zeilen geändert werden; wird eine Zeile vergessen, ist der Bestand inkonsistent.

### Erklärung
Die Änderungsanomalie (Update-Anomalie) entsteht, wenn dieselbe Tatsache mehrfach gespeichert ist – typisch bei Tabellen, die nicht in 2. oder 3. NF sind. Jede Änderung muss dann alle Kopien treffen. Gelingt das nicht, widersprechen sich die Zeilen: Die Datenqualitätsdimension **Konsistenz** ist verletzt. Normalisierung beseitigt die Ursache, weil jede Tatsache nur noch an einer Stelle steht.

### Beispiel
In der Tabelle *auftrag* steht bei jedem Auftrag der Stundensatz des Technikers. Steigt der Satz von Herrn Kaya von 58 € auf 62 €, müssen alle seine 140 Auftragszeilen geändert werden. Werden nur 139 geändert, hat er zwei Stundensätze.

### Abgrenzung
| Anomalie | Problem |
|---|---|
| Einfügeanomalie | Neuer Techniker ohne Auftrag nicht erfassbar |
| Änderungsanomalie | Änderung muss in vielen Zeilen erfolgen |
| Löschanomalie | Mit dem letzten Auftrag verschwinden auch Kundendaten |

### Prüfungsfalle
Nur „Redundanz“ als Antwort geben – erwartet wird die Kette Redundanz → Anomalie → Inkonsistenz.

### Merksatz
Was doppelt steht, wird irgendwann nur einmal geändert.

Siehe auch: Anomalie · Einfügeanomalie · Löschanomalie · Normalisierung · Konsistenz
Mehr: Deep Dive 2, 2.2

## Änderungskündigung
<!-- id: anderungskundigung · quellen: Karte DD13, DD13 3.2 · stand: 2026-10 -->

Kündigung des Arbeitsverhältnisses, verbunden mit dem Angebot, es zu geänderten Bedingungen fortzusetzen.

### Erklärung
Der Arbeitgeber will z. B. Arbeitsort, Arbeitszeit oder Vergütung ändern, die der Arbeitsvertrag festlegt und die er nicht per Weisung ändern darf. Die Änderungskündigung ist eine echte Kündigung: Schriftform (§ 623 BGB), Kündigungsfrist und Anhörung des Betriebsrats gelten. Gilt das Kündigungsschutzgesetz, kann der Arbeitnehmer das Angebot **unter Vorbehalt** annehmen – innerhalb der Kündigungsfrist, spätestens drei Wochen nach Zugang – und gerichtlich prüfen lassen, ob die Änderung sozial gerechtfertigt ist (§ 2 KSchG). Bis dahin arbeitet er zu den neuen Bedingungen weiter, verliert aber nicht seinen Arbeitsplatz.

### Beispiel
Das Möbelhaus schließt die Filiale Köln und bietet einer Mitarbeiterin den Arbeitsplatz in Bonn an. Sie nimmt unter Vorbehalt an und klagt; verliert sie, gilt der neue Arbeitsort, gewinnt sie, bleibt der alte.

### Abgrenzung
Die **ordentliche Kündigung** beendet das Arbeitsverhältnis ohne Angebot; die Änderungskündigung will es fortsetzen. Ein **Aufhebungsvertrag** ist einvernehmlich, keine Kündigung.

### Prüfungsfalle
Die Änderungskündigung für eine bloße Weisung halten, für die keine Form und Frist gilt.

### Merksatz
Kündigen, um zu ändern – mit Form, Frist und Vorbehalt.

Siehe auch: Ordentliche Kündigung · Kündigungsschutzgesetz · Anhörung · Schriftform · Arbeitsvertrag
Mehr: Deep Dive 13, 3.2

## Änderungsmanagement
<!-- id: anderungsmanagement · quellen: Karte DD12, DD12 Teil 5 · stand: 2026-10 -->

Geregeltes Verfahren, Änderungswünsche im Projekt zu erfassen, nach Auswirkung zu bewerten, zu entscheiden und zu dokumentieren, statt sie stillschweigend einzubauen.

### Erklärung
Jeder Änderungswunsch (Change Request) wird schriftlich erfasst und auf Zeit, Kosten und Qualität bewertet. Ein festgelegtes Gremium oder der Auftraggeber entscheidet: annehmen, ablehnen, verschieben. Angenommene Änderungen werden in Pflichtenheft, Plan und Budget nachgezogen. Ohne dieses Verfahren wächst der Umfang unkontrolliert (**Scope Creep**) – eine der häufigsten Ursachen gerissener Termine.

### Beispiel
Mitten im Dashboard-Projekt wünscht der Vertrieb eine zusätzliche Auswertung je Postleitzahl. Bewertung: 3 Personentage, Termin verschiebt sich um eine Woche. Die Projektleitung entscheidet mit dem Auftraggeber, die Auswertung in eine zweite Ausbaustufe zu legen, und dokumentiert das.

### Abgrenzung
Im agilen Vorgehen landen neue Wünsche im **Product Backlog** und werden vom Product Owner priorisiert – auch das ist kontrolliertes Änderungsmanagement, nur ohne formalen Antrag.

### Prüfungsfalle
Änderungen „schnell nebenbei“ einbauen – dann stimmen Soll-Ist-Vergleich und Abnahmegrundlage nicht mehr.

### Merksatz
Jede Änderung wird bewertet, entschieden und dokumentiert – nie stillschweigend eingebaut.

Siehe auch: Scope Creep · Pflichtenheft · Soll-Ist-Vergleich · Magisches Dreieck · Product Backlog
Mehr: Deep Dive 12, Teil 5

## Anfechtung
<!-- id: anfechtung · quellen: Karte DD14, DD14 2.2 · stand: 2026-10 -->

Erklärung, mit der ein zunächst wirksames Rechtsgeschäft rückwirkend vernichtet wird – wegen Irrtums, falscher Übermittlung, arglistiger Täuschung oder widerrechtlicher Drohung.

### Erklärung
Anfechtungsgründe im BGB: **Inhalts- oder Erklärungsirrtum** (§ 119 Abs. 1), Irrtum über eine verkehrswesentliche Eigenschaft (§ 119 Abs. 2), falsche Übermittlung durch einen Boten (§ 120), **arglistige Täuschung** und **widerrechtliche Drohung** (§ 123). Wird wirksam angefochten, gilt das Geschäft als von Anfang an nichtig (§ 142). Wer wegen Irrtums anficht, muss dem anderen den Vertrauensschaden ersetzen (§ 122). Ein bloßer Motivirrtum („Ich dachte, ich brauche das“) berechtigt nicht zur Anfechtung.

### Beispiel
Im Online-Shop steht durch einen Tippfehler der Schreibtisch für 39,90 € statt 399,00 €. Bestätigt das Möbelhaus die Bestellung, kann es wegen Erklärungsirrtums unverzüglich anfechten.

### Abgrenzung
| nichtig | anfechtbar |
|---|---|
| von Anfang an unwirksam, ohne Erklärung | wirksam, bis jemand anficht |
| z. B. Geschäftsunfähigkeit, Formmangel, Sittenwidrigkeit | z. B. Irrtum, Täuschung, Drohung |

### Prüfungsfalle
Anfechtbare Geschäfte für nichtig halten – ohne Anfechtungserklärung innerhalb der Frist bleiben sie wirksam.

### Merksatz
Anfechtbar ist wirksam, bis jemand rechtzeitig anficht – dann nichtig von Anfang an.

Siehe auch: Anfechtungsfristen · Geschäftsfähigkeit · Kaufvertrag · Schriftform
Mehr: Deep Dive 14, 2.2

## Anfechtungsfristen
<!-- id: anfechtungsfristen · quellen: DD14 2.2 · stand: 2026-10 -->

Fristen für die Anfechtung: bei Irrtum unverzüglich nach Kenntnis (§ 121 BGB), bei arglistiger Täuschung oder Drohung binnen eines Jahres nach Entdeckung bzw. Ende der Zwangslage (§ 124 BGB).

### Erklärung
**Unverzüglich** heißt „ohne schuldhaftes Zögern“ – in der Regel wenige Tage, nicht Wochen. Die längere Frist bei Täuschung und Drohung schützt den Getäuschten, der den Betrug oft erst spät bemerkt bzw. erst nach dem Ende der Drohung frei handeln kann. In allen Fällen ist die Anfechtung spätestens zehn Jahre nach Abgabe der Erklärung ausgeschlossen (§ 121 Abs. 2, § 124 Abs. 3).

### Beispiel
Ein Händler verschweigt beim Verkauf eines gebrauchten Servers einen bekannten Wasserschaden. Das Möbelhaus entdeckt ihn am 15.03.2026 und kann bis zum 15.03.2027 wegen arglistiger Täuschung anfechten.

### Abgrenzung
Die Anfechtungsfrist ist nicht die **Verjährung** (regelmäßig drei Jahre zum Jahresende) und nicht die Widerrufsfrist von 14 Tagen im Fernabsatz.

### Prüfungsfalle
Bei Irrtum eine Jahresfrist ansetzen – die gilt nur für Täuschung und Drohung.

### Merksatz
Irrtum: sofort. Täuschung oder Drohung: ein Jahr ab Entdeckung.

Siehe auch: Anfechtung · Verjährung · Widerrufsrecht · Frist
Mehr: Deep Dive 14, 2.2

## Anhörung
<!-- id: anhorung · quellen: DD13 4.2 · stand: 2026-10 -->

Beteiligungsrecht des Betriebsrats: Er muss vor einer Maßnahme gehört werden – vor allem vor jeder Kündigung (§ 102 BetrVG); ohne Anhörung ist die Kündigung unwirksam.

### Erklärung
Der Arbeitgeber teilt dem Betriebsrat die Person, die Art der Kündigung und die Gründe mit. Bedenken gegen eine ordentliche Kündigung äußert der Betriebsrat binnen einer Woche, gegen eine außerordentliche unverzüglich, spätestens binnen drei Tagen; Schweigen gilt als Zustimmung. Einer ordentlichen Kündigung kann er aus bestimmten Gründen widersprechen; verhindern kann er sie nicht.

### Beispiel
Das Möbelhaus kündigt einem Lageristen fristgerecht, ohne den Betriebsrat zu informieren. Die Kündigung ist allein deshalb unwirksam – egal, wie gut der Grund ist.

### Abgrenzung
| Stufe | Wirkung |
|---|---|
| Information | Betriebsrat wird unterrichtet |
| Anhörung | Betriebsrat wird gehört, entscheidet nicht |
| Widerspruch / Zustimmungsverweigerung | Maßnahme kann blockiert werden (§ 99) |
| Mitbestimmung | ohne Zustimmung keine Maßnahme (§ 87) |

### Prüfungsfalle
Anhörung mit Zustimmung verwechseln: Bei der Kündigung muss der Betriebsrat nur gehört werden, nicht zustimmen.

### Merksatz
Kündigung ohne Anhörung des Betriebsrats ist unwirksam – Zustimmung braucht sie nicht.

Siehe auch: Beteiligungsrechte · Betriebsrat · Mitbestimmung · Ordentliche Kündigung · Information
Mehr: Deep Dive 13, 4.2

## Anomalie
<!-- id: anomalie · quellen: Karte DD2, DD2 2.2 · stand: 2026-10 -->

Fehler beim Einfügen, Ändern oder Löschen, die in nicht normalisierten Tabellen durch Redundanz entstehen.

### Erklärung
Liegen Daten verschiedener Sachverhalte (Auftrag, Kunde, Techniker) in einer breiten Tabelle, hängen sie künstlich voneinander ab. Daraus folgen drei Anomalien: Man kann etwas nicht einfügen, ohne etwas anderes mitzuerfassen (**Einfügeanomalie**), muss eine Tatsache an vielen Stellen ändern (**Änderungsanomalie**) oder verliert beim Löschen ungewollt Informationen (**Löschanomalie**). Normalisierung bis zur 3. NF beseitigt sie – sie ist damit eine präventive Datenqualitätsmaßnahme.

### Beispiel
Tabelle auftrag(auftrag_nr, kunde, techniker, stundensatz): Ein neuer Techniker ohne Auftrag ist nicht erfassbar; ein neuer Stundensatz muss in allen Zeilen geändert werden; wird der einzige Auftrag eines Kunden gelöscht, ist der Kunde weg.

### Abgrenzung
In der Statistik und im Machine Learning bezeichnet „Anomalie“ dagegen einen ungewöhnlichen Datenpunkt (Ausreißer, Anomalieerkennung) – ein anderer Begriff.

### Prüfungsfalle
Die drei Anomalien nur aufzählen; erwartet wird je ein Beispiel aus der gegebenen Tabelle.

### Merksatz
Redundanz → Anomalien → Inkonsistenz.

Siehe auch: Änderungsanomalie · Einfügeanomalie · Löschanomalie · Normalisierung · 3. Normalform
Mehr: Deep Dive 2, 2.2

## Anonymisierung
<!-- id: anonymisierung · quellen: Karte DD10, DD10 Teil 3, DD5 5.4 · stand: 2026-10 -->

Personenbezogene Daten werden so verändert, dass der Personenbezug dauerhaft und unumkehrbar entfernt ist – anonyme Daten fallen nicht mehr unter die DSGVO.

### Erklärung
Anonym sind Daten erst, wenn niemand eine Person mit vertretbarem Aufwand wieder identifizieren kann – auch nicht durch Kombination mit anderen Daten (Erwägungsgrund 26 DSGVO). Bei kleinen Gruppen genügen oft wenige Merkmale zur Re-Identifikation. Techniken: Aggregieren, Merkmale vergröbern (Altersgruppe statt Geburtsdatum), Mindestgruppengrößen (z. B. keine Zelle unter fünf Personen), Ziel **k-Anonymität**. Der Vorgang des Anonymisierens selbst ist noch eine Verarbeitung personenbezogener Daten.

### Beispiel
Statt einzelner Bearbeitungszeiten je Techniker wertet das Möbelhaus die Durchschnittsdauer je Werkstatt aus und zeigt Gruppen mit weniger als fünf Personen nicht an.

### Abgrenzung
| | Anonymisierung | Pseudonymisierung |
|---|---|---|
| Personenbezug | dauerhaft entfernt | über Schlüssel wiederherstellbar |
| DSGVO | gilt nicht | gilt weiter |

### Prüfungsfalle
Namen durch Nummern ersetzen und das „anonymisiert“ nennen – das ist Pseudonymisierung.

### Merksatz
Anonym ist nur, was niemand mehr zurückführen kann.

Siehe auch: Pseudonymisierung · K-Anonymität · Personenbezogene Daten · DSGVO · Datenminimierung
Mehr: Deep Dive 10, Teil 3 · Deep Dive 5, 5.4

## Anreichern
<!-- id: anreichern · quellen: DD8 3.1 · stand: 2026-10 -->

Transformationsschritt im ETL-Prozess: zusätzliche Merkmale berechnen oder aus weiteren Quellen ergänzen, z. B. Deckungsbeitrag oder Lieferdauer.

### Erklärung
Rohdaten enthalten oft nur Grundgrößen; die Kennzahlen, nach denen ausgewertet wird, entstehen erst beim Anreichern. Typisch sind berechnete Felder (Lieferdauer = Lieferdatum − Bestelldatum), abgeleitete Kategorien (Altersgruppe, Preisklasse) und Daten aus Referenzquellen (Region zur Postleitzahl). Die Berechnungsregel wird zentral festgelegt, damit alle Berichte dieselbe Definition verwenden.

### Beispiel
Aus Umsatz und Wareneinsatz je Bestellposition wird der Deckungsbeitrag berechnet: 399,00 € − 240,00 € = 159,00 €. Aus Bestell- und Lieferdatum (03.02. und 06.02.) entsteht die Lieferdauer 3 Tage.

### Abgrenzung
Anreichern fügt Information hinzu; **Aggregieren** verdichtet sie; **Bereinigen** korrigiert sie. Im Machine Learning heißt das Gegenstück **Merkmale bilden** (Feature Engineering).

### Prüfungsfalle
Abgeleitete Werte in jedem Bericht neu und unterschiedlich berechnen – dann widersprechen sich die Kennzahlen.

### Merksatz
Anreichern macht aus Rohdaten auswertbare Kennzahlen – einmal definiert, überall gleich.

Siehe auch: ETL · Aggregieren · Bereinigen · Deckungsbeitrag · Merkmale bilden
Mehr: Deep Dive 8, 3.1

## Anteile am Ganzen
<!-- id: anteile-am-ganzen · quellen: DD11 A1 · stand: 2026-10 -->

Aussageziel einer Grafik, bei dem Teile zusammen 100 % ergeben; geeignet sind Kreisdiagramm (nur wenige Kategorien) und gestapelte Balken.

### Erklärung
Die Diagrammwahl folgt der Aussageabsicht. Sollen Anteile gezeigt werden, müssen die Teile sich zu einem sinnvollen Ganzen addieren. Ein **Kreisdiagramm** passt nur bei wenigen Segmenten (Faustregel höchstens fünf) und wenn eine grobe Aussage wie „mehr als die Hälfte“ genügt – Winkel vergleicht das Auge schlecht. Sollen Anteile mehrerer Gruppen oder Zeitpunkte verglichen werden, sind **gestapelte 100-%-Balken** besser.

### Beispiel
Reklamationsgründe: Transportschaden 36 %, Montagefehler 30 %, Falschlieferung 18 %, Materialfehler 12 %, Sonstiges 4 % – fünf Segmente, Kreisdiagramm vertretbar. Vergleich der Gründe über vier Filialen: gestapelte Balken.

### Abgrenzung
| Aussageziel | Diagramm |
|---|---|
| Anteile am Ganzen | Kreis, gestapelte Balken |
| Vergleich von Kategorien | Balken, Säulen |
| Entwicklung über die Zeit | Linie |
| Verteilung | Histogramm, Boxplot |

### Prüfungsfalle
Ein Kreisdiagramm für Werte, die sich nicht zu 100 % addieren (z. B. Mehrfachnennungen) oder mit zehn Segmenten.

### Merksatz
Kreis nur, wenn die Teile ein Ganzes ergeben und es wenige sind.

Siehe auch: Kreisdiagramm · Balkendiagramm · Vergleich von Kategorien · Verteilung eines Merkmals
Mehr: Deep Dive 11, A1

## Antizyklische Fiskalpolitik
<!-- id: antizyklische-fiskalpolitik · quellen: Karte DD14, DD14 4.4 · stand: 2026-10 -->

Der Staat steuert mit Ausgaben und Steuern gegen den Konjunkturverlauf: im Abschwung Ausgaben erhöhen und Steuern senken, im Boom Ausgaben kürzen und Rücklagen bilden.

### Erklärung
Die Idee geht auf Keynes zurück: Fehlt im Abschwung private Nachfrage, ersetzt der Staat sie, notfalls mit Krediten; im Boom bremst er, um Überhitzung und Inflation zu vermeiden, und tilgt Schulden. In Deutschland verankert das Stabilitätsgesetz von 1967 diesen Ansatz (z. B. Konjunkturausgleichsrücklage). Probleme in der Praxis: Verzögerungen bei Erkennen, Beschluss und Wirkung, sodass Maßnahmen zu spät kommen; im Boom fehlt oft der politische Wille zum Sparen; die Schuldenbremse begrenzt die Kreditaufnahme.

### Beispiel
In einer Rezession legt die Regierung ein Investitionsprogramm für Schulen und Digitalisierung auf und senkt vorübergehend die Umsatzsteuer, um die Nachfrage zu stützen.

### Abgrenzung
**Geldpolitik** betreibt die Europäische Zentralbank über den Leitzins mit dem Ziel Preisstabilität; Fiskalpolitik betreibt der Staat über seinen Haushalt. **Prozyklisch** wäre es, im Abschwung zu sparen und so den Abschwung zu verstärken.

### Prüfungsfalle
Fiskal- und Geldpolitik vertauschen oder der Bundesregierung die Leitzinsentscheidung zuschreiben.

### Merksatz
Gegen den Strom: in der Krise ausgeben, im Boom sparen.

Siehe auch: Fiskalpolitik · Geldpolitik · Konjunkturphasen · Magisches Viereck · Leitzins
Mehr: Deep Dive 14, 4.4

## Antwortnachricht
<!-- id: antwortnachricht · quellen: DD17 2.5, DD15 5.4 · stand: 2026-10 -->

Rückmeldung an den Aufrufer im Sequenzdiagramm; Symbol: gestrichelter Pfeil mit offener Spitze.

### Erklärung
Auf eine **synchrone Nachricht** folgt meist eine Antwort, die das Ergebnis zurückliefert und die Wartezeit des Senders beendet. Sie wird mit dem Rückgabewert beschriftet („verfügbar“, „200 OK“) und endet am Aktivierungsbalken des Aufrufers. Bei offensichtlichen Rückgaben darf sie in vereinfachten Diagrammen entfallen.

### Beispiel
Der Webshop ruft `pruefeBestand(artikel)` beim Lager auf (durchgezogener Pfeil, gefüllte Spitze); das Lager antwortet „verfügbar“ (gestrichelter Pfeil, offene Spitze).

### Abgrenzung
| Nachricht | Linie | Spitze |
|---|---|---|
| synchron | durchgezogen | gefüllt |
| asynchron | durchgezogen | offen |
| Antwort | gestrichelt | offen |

### Prüfungsfalle
Antwort und asynchrone Nachricht verwechseln – beide haben eine offene Spitze, nur die Antwort ist gestrichelt.

### Merksatz
Gestrichelt zurück ist die Antwort.

Siehe auch: Sequenzdiagramm · Synchrone Nachricht · Asynchrone Nachricht · Aktivierungsbalken
Mehr: Deep Dive 17, 2.5 · Deep Dive 15, 5.4

## Anweisungsüberdeckung (C0)
<!-- id: anweisungsuberdeckung · quellen: Karte DD16, DD16 2.2 · stand: 2026-10 -->

White-Box-Kriterium: Jede Anweisung des Codes wird durch die Tests mindestens einmal ausgeführt; schwächer als die Zweigüberdeckung (C1).

### Erklärung
Der Überdeckungsgrad wird als $\frac{\text{ausgeführte Anweisungen}}{\text{alle Anweisungen}} \cdot 100\ \%$ gemessen. 100 % C0 zeigt, dass kein Code „tot“ und ungetestet bleibt. Leere Zweige (ein IF ohne ELSE) enthalten aber keine Anweisung und werden von C0 nicht erfasst – genau dort können Fehler sitzen.

### Beispiel
```
WENN menge > 20 DANN
    status ← 'Sonderanfrage'
ENDE WENN
```
Ein Test mit menge = 25 führt alle Anweisungen aus: 100 % C0. Der leere Sonst-Fall (menge ≤ 20) bleibt ungetestet – Zweigüberdeckung nur 50 %. Erst ein zweiter Test mit menge = 10 erreicht 100 % C1.

### Abgrenzung
**Zweigüberdeckung (C1)** verlangt, dass jeder Zweig jeder Verzweigung durchlaufen wird; 100 % C1 schließt 100 % C0 ein, nicht umgekehrt. Black-Box-Verfahren wie Äquivalenzklassen kennen den Code gar nicht.

### Prüfungsfalle
Aus 100 % C0 auf vollständig getesteten Code schließen.

### Merksatz
C0 prüft jede Zeile, C1 jeden Weg.

Siehe auch: Zweigüberdeckung (C1) · White-Box-Test · Black-Box-Test · Komponententest
Mehr: Deep Dive 16, 2.2

## Anwendungsfall
<!-- id: anwendungsfall · quellen: DD17 2.2, DD15 5.1 · stand: 2026-10 -->

Element des Use-Case-Diagramms, das eine für einen Akteur nützliche Leistung des Systems beschreibt; Symbol: Ellipse, beschriftet mit Verb + Objekt.

### Erklärung
Anwendungsfälle (Use Cases) stehen innerhalb der Systemgrenze und beschreiben, **was** das System leistet, nicht wie. Sie werden durch Linien mit den Akteuren verbunden. Untereinander gibt es zwei Beziehungen: **«include»** (der Basisfall bindet einen anderen immer ein, Pfeil vom Basisfall weg) und **«extend»** (ein Fall erweitert den Basisfall nur unter einer Bedingung, Pfeil zum Basisfall hin). Details wie Vorbedingungen und Ablauf beschreibt man in einer textuellen Use-Case-Schablone.

### Beispiel
„Reparatur beauftragen“ «include» „Kunde anmelden“; „Expressservice wählen“ «extend» „Reparatur beauftragen“.

### Abgrenzung
Ein Anwendungsfall ist keine einzelne Aktion im Ablauf (die gehört ins Aktivitätsdiagramm), sondern ein vollständiges Ziel aus Sicht des Akteurs.

### Prüfungsfalle
Bei «extend» den Pfeil vom Basisfall zum erweiternden Fall zeichnen – er zeigt immer auf den Fall, der erweitert wird.

### Merksatz
Ellipse = was das System für jemanden tut, mit Verb + Objekt.

Siehe auch: Use-Case-Diagramm · Akteur · Include · Extend · Systemgrenze
Mehr: Deep Dive 17, 2.2 · Deep Dive 15, 5.1

## Anwendungssystem
<!-- id: anwendungssystem · quellen: DD5 2.3 · stand: 2026-10 -->

Zusatzobjekt der erweiterten EPK (eEPK), das die IT-Anwendung zeigt, mit der eine Funktion ausgeführt wird; Symbol: Rechteck mit seitlichen Doppellinien.

### Erklärung
Die eEPK ergänzt die Ablauflogik um das Wer und Womit: **Organisationseinheit** (Ellipse), **Informationsobjekt** (Rechteck) und Anwendungssystem. Zusatzobjekte hängen immer an einer **Funktion**, nie an einem Ereignis. So wird sichtbar, welche Systeme im Prozess genutzt werden und wo Medienbrüche oder Doppelerfassungen entstehen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 70" width="400" height="70" role="img" aria-label="eEPK-Funktion mit angebundenem Anwendungssystem">
<rect x="10" y="15" width="150" height="40" rx="10" class="dg-akzent"/>
<text x="85" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag erfassen</text>
<line x1="160" y1="35" x2="230" y2="35" class="dg-linie"/>
<rect x="230" y="15" width="150" height="40" class="dg-form"/>
<line x1="238" y1="15" x2="238" y2="55" class="dg-linie"/>
<line x1="372" y1="15" x2="372" y2="55" class="dg-linie"/>
<text x="305" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">ERP-System</text>
</svg>
```

### Beispiel
An der Funktion „Auftrag erfassen“ hängen die Organisationseinheit „Serviceannahme“, das Anwendungssystem „ERP-System“ und das Informationsobjekt „Auftragsdaten“.

### Abgrenzung
In BPMN gibt es kein eigenes Symbol für Anwendungssysteme; dort zeigt man IT-Unterstützung über Task-Marker (Service Task) oder Datenspeicher.

### Prüfungsfalle
Ein Anwendungssystem an ein Ereignis hängen – Zusatzobjekte gehören an Funktionen.

### Merksatz
Doppellinien an den Seiten: Hier arbeitet eine Software mit.

Siehe auch: Erweiterte EPK (eEPK) · Funktion · Organisationseinheit · Informationsobjekt · EPK
Mehr: Deep Dive 5, 2.3

## Apache Spark
<!-- id: apache-spark · quellen: Karte DD8, DD8 5.2 · stand: 2026-10 -->

Open-Source-Framework für verteilte Datenverarbeitung, das Zwischenergebnisse im Arbeitsspeicher hält – schneller als MapReduce und auch für SQL, Streaming und Machine Learning nutzbar.

### Erklärung
Reicht ein einzelner Server für die Datenmenge nicht mehr, verteilt Spark Daten und Berechnung auf einen Cluster vieler Rechner (**horizontale Skalierung**). Anders als Hadoop-MapReduce schreibt Spark nicht nach jedem Schritt auf die Festplatte, sondern rechnet möglichst im Arbeitsspeicher – das beschleunigt vor allem mehrstufige und wiederholte Berechnungen (z. B. iterative ML-Verfahren). Spark kann Daten aus HDFS, Objektspeichern oder Datenbanken lesen; Bausteine sind u. a. Spark SQL, Structured Streaming und MLlib.

### Beispiel
Das Möbelhaus wertet die Klickdaten aller Filial-Webshops eines Jahres (mehrere Milliarden Zeilen im Parquet-Format) mit Spark SQL aus: Umsatz und Absprungrate je Kategorie und Woche.

### Abgrenzung
**MapReduce** (Hadoop) arbeitet nach demselben Prinzip „Berechnung zu den Daten“, schreibt aber Zwischenergebnisse auf die Platte. **HDFS** ist ein verteiltes Dateisystem – es speichert, rechnet aber nicht.

### Prüfungsfalle
Spark für eine Datenbank halten – es ist eine Verarbeitungsengine, die Daten aus anderen Speichern liest.

### Merksatz
Spark = verteilt rechnen im Arbeitsspeicher.

Siehe auch: MapReduce · HDFS · Big Data · Horizontale Skalierung · Parquet
Mehr: Deep Dive 8, 5.2

## API
<!-- id: api · quellen: Karte DD15, DD15 3.1, DD15 3.2 · stand: 2026-10 -->

Application Programming Interface: definierte Schnittstelle, über die Programme Funktionen oder Daten anderer Systeme nutzen, ohne deren Innenleben zu kennen.

### Erklärung
Eine API legt fest, welche Anfragen erlaubt sind, welche Parameter sie brauchen und was zurückkommt. Für die Datenbereitstellung sind Web-APIs wichtig, vor allem **REST** (Ressourcen über URIs, HTTP-Methoden, meist JSON), daneben SOAP und GraphQL. Gegenüber Dateiaustausch oder direktem Datenbankzugriff liefert eine API aktuelle Daten, gezielt abfragbar und zugriffsgesteuert – kostet aber Entwicklungs- und Betriebsaufwand. Beschrieben wird eine REST-API meist mit **OpenAPI**.

### Beispiel
Die Filial-App fragt `GET /reparaturauftraege/5001` ab und erhält den Auftrag als JSON mit Status 200; ein neuer Auftrag wird per `POST /reparaturauftraege` angelegt (Antwort 201 Created).

### Abgrenzung
| Weg | Stärke | Schwäche |
|---|---|---|
| Dateiaustausch (CSV) | einfach, robust | nicht aktuell |
| API | aktuell, gesteuert | Aufwand |
| direkter DB-Zugriff | schnell eingerichtet | enge Kopplung, Sicherheitsrisiko |

### Prüfungsfalle
Zugangsdaten in die URL schreiben – sie gehören in den Header, und die API nur über HTTPS.

### Merksatz
Die API ist der Vertrag zwischen zwei Programmen: was man fragen darf und was zurückkommt.

Siehe auch: REST-API · API-Schlüssel · API-Versionierung · OpenAPI · Schnittstelle
Mehr: Deep Dive 15, 3.1 · Deep Dive 15, 3.2

## API-Schlüssel
<!-- id: api-schlussel · quellen: Karte DD15, DD15 3.3 · stand: 2026-10 -->

Geheimer Schlüssel, mit dem sich eine Anwendung an einer API ausweist – er gehört in den HTTP-Header, nie in die URL.

### Erklärung
Der API-Schlüssel ist das einfachste Verfahren der Authentifizierung an APIs: Jede Anwendung bekommt eine feste, zufällige Zeichenfolge und sendet sie bei jeder Anfrage mit. Er identifiziert die **Anwendung**, nicht den einzelnen Nutzer. Weil er dauerhaft gilt, muss er geheim bleiben (nicht im Quellcode-Repository, nicht in der URL – URLs landen in Server- und Proxy-Logs) und bei Verlust gesperrt und neu ausgegeben werden. Übertragen wird nur über HTTPS.

### Beispiel
```http
GET /v1/reparaturauftraege?status=offen HTTP/1.1
Host: api.moebelhaus-nordholz.example
X-API-Key: 7f3c9a…
```

### Abgrenzung
| Verfahren | identifiziert | Besonderheit |
|---|---|---|
| API-Schlüssel | Anwendung | dauerhaft, einfach |
| Basic Auth | Benutzer | Base64 ist keine Verschlüsselung |
| OAuth 2.0 | delegierter Zugriff | zeitlich begrenztes Token mit Scopes |

### Prüfungsfalle
Den Schlüssel als Query-Parameter (`?key=…`) übergeben.

### Merksatz
Schlüssel in den Header, Verbindung per HTTPS, bei Verlust sofort sperren.

Siehe auch: Authentifizierung an APIs · OAuth 2.0 · Basic Auth · Nur HTTPS · API
Mehr: Deep Dive 15, 3.3

## API-Versionierung
<!-- id: api-versionierung · quellen: Karte DD15, DD15 3.3 · stand: 2026-10 -->

Kennzeichnung der Version einer API, meist im Pfad (`/v1/…`), damit Änderungen bestehende Nutzer nicht brechen.

### Erklärung
Ändert sich eine API inkompatibel – ein Feld wird umbenannt, ein Pflichtparameter kommt hinzu –, würden alle bestehenden Clients scheitern. Deshalb wird die neue Fassung als neue Version (`/v2/…`) angeboten und die alte eine angekündigte Zeit parallel betrieben. Rückwärtskompatible Erweiterungen (ein zusätzliches optionales Feld) brauchen keine neue Hauptversion. Alternativen zur Version im Pfad sind ein Header oder ein Query-Parameter.

### Beispiel
Die Filial-App nutzt `/v1/reparaturauftraege` mit dem Feld `kunde`. Die neue Version `/v2/reparaturauftraege` liefert stattdessen `kunden_id` und `kundenname`. Die v1 bleibt sechs Monate erreichbar, dann wird sie abgeschaltet.

### Abgrenzung
Die **Versionsverwaltung** (z. B. Git) verwaltet Stände des Quellcodes; die API-Versionierung regelt, welche Schnittstellenfassung Clients aufrufen.

### Prüfungsfalle
Eine produktiv genutzte API ohne Version ändern und Clients stillschweigend brechen.

### Merksatz
Neue Regeln, neue Versionsnummer – die alte läuft weiter, bis alle umgezogen sind.

Siehe auch: API · REST-API · OpenAPI · Versionierung
Mehr: Deep Dive 15, 3.3

## Apriori-Algorithmus
<!-- id: apriori-algorithmus · quellen: Karte DD6, DD6 4.1, DD6 4.2 · stand: 2026-10 -->

Standardverfahren der Assoziationsanalyse: findet mit einem Mindestsupport häufige Artikelkombinationen und bildet daraus Regeln mit Mindestkonfidenz.

### Erklärung
Vorgegeben werden **Mindestsupport** und **Mindestkonfidenz**. Schritt 1: alle Itemsets suchen, die den Mindestsupport erreichen (häufige Itemsets) – erst einzelne Artikel, dann Paare, dann Dreier usw. Schritt 2: aus den häufigen Itemsets Regeln A → B bilden und die mit ausreichender Konfidenz behalten. Das **Apriori-Prinzip** spart Rechenaufwand: Ist eine Kombination selten, sind alle größeren Kombinationen, die sie enthalten, ebenfalls selten und werden gar nicht erst gezählt. Die Regeln werden anschließend mit dem **Lift** bewertet.

### Beispiel
Zehn Warenkörbe, Mindestsupport 30 %: Lampe kommt in 4 Körben vor (40 %), {Lampe, Monitor} nur in 1 (10 %) → verworfen; damit wird auch {Lampe, Monitor, Bürostuhl} nicht mehr gezählt. {Schreibtisch, Bürostuhl} in 4 Körben (40 %) bleibt; Regel Schreibtisch → Bürostuhl: Konfidenz $\frac{0{,}40}{0{,}50} = 80\ \%$, Lift $\frac{0{,}80}{0{,}60} = 1{,}33$.

### Abgrenzung
Apriori ist ein **unüberwachtes** Verfahren wie k-Means; k-Means bildet aber Gruppen ähnlicher Fälle, Apriori findet Wenn-dann-Regeln.

### Prüfungsfalle
Regeln nur nach Konfidenz auswählen – ist B ohnehin in fast jedem Korb, ist die Konfidenz hoch, obwohl kein Zusammenhang besteht (Lift ≈ 1).

### Merksatz
Was selten ist, macht auch jede Erweiterung selten.

Siehe auch: Assoziationsanalyse · Support · Konfidenz · Lift · Unüberwachtes Lernen
Mehr: Deep Dive 6, 4.1 · Deep Dive 6, 4.2

## Äquivalenzklasse
<!-- id: aquivalenzklasse · quellen: Karte DD16, DD16 2.2, DD16 2.3 · stand: 2026-10 -->

Menge von Eingaben, bei denen sich das System gleich verhalten soll; aus jeder gültigen und ungültigen Klasse genügt ein Repräsentant als Testfall.

### Erklärung
Die Äquivalenzklassenbildung ist ein **Black-Box-Verfahren**: Aus der Spezifikation werden die Eingabebereiche abgeleitet, für die dieselbe Regel gilt. Neben den **gültigen** Klassen gehören **ungültige** dazu (negative Werte, Text, leere Eingabe). Ergänzt wird sie fast immer durch die **Grenzwertanalyse**, weil Fehler bevorzugt an den Rändern der Klassen sitzen.

### Beispiel
Rabattregel: unter 500 € kein Rabatt, 500 € bis unter 2.000 € 5 %, ab 2.000 € 10 %, negative Werte ungültig.
| Klasse | Bereich | Repräsentant | erwartet |
|---|---|---|---|
| ÄK1 | unter 0 € (ungültig) | −50 € | Fehlermeldung |
| ÄK2 | 0 bis 499,99 € | 250 € | 0 % |
| ÄK3 | 500 bis 1.999,99 € | 1.200 € | 5 % |
| ÄK4 | ab 2.000 € | 3.500 € | 10 % |
| ÄK5 | keine Zahl (ungültig) | „abc“ | Fehlermeldung |

Mit den sechs Grenzwerten (−0,01; 0,00; 499,99; 500,00; 1.999,99; 2.000,00 €) ergeben sich 11 Testfälle.

### Abgrenzung
**Grenzwertanalyse** testet die Ränder der Klassen; die Äquivalenzklasse liefert je Bereich einen beliebigen Vertreter. White-Box-Kriterien wie die Anweisungsüberdeckung richten sich nach dem Code.

### Prüfungsfalle
Die ungültigen Klassen vergessen – sie gehören in jede vollständige Lösung.

### Merksatz
Gleiches Verhalten, ein Test – gültige und ungültige Klassen.

Siehe auch: Grenzwertanalyse · Black-Box-Test · Testfall · Testdesign
Mehr: Deep Dive 16, 2.2 · Deep Dive 16, 2.3

## Arbeitgeberpflichten
<!-- id: arbeitgeberpflichten · quellen: DD14 5.1 · stand: 2026-10 -->

Pflichten des Arbeitgebers im Arbeitsschutz: Gefährdungsbeurteilung, Schutzmaßnahmen, Wirksamkeitskontrolle, Dokumentation, Unterweisung sowie Bestellung von Fachkraft für Arbeitssicherheit und Betriebsarzt.

### Erklärung
Grundlage ist das Arbeitsschutzgesetz: Der Arbeitgeber muss die Gefährdungen jedes Arbeitsplatzes beurteilen und dokumentieren (§§ 5, 6 ArbSchG), daraus Maßnahmen nach dem **STOP-Prinzip** ableiten, deren Wirksamkeit prüfen und die Beschäftigten unterweisen (§ 12 ArbSchG) – bei Einstellung, bei Veränderungen und mindestens jährlich, Jugendliche mindestens halbjährlich. Nach dem Arbeitssicherheitsgesetz bestellt er eine **Fachkraft für Arbeitssicherheit** und einen **Betriebsarzt**. Die Kosten trägt er allein.

### Beispiel
Für die Büroarbeitsplätze der Datenanalyse beurteilt das Möbelhaus Bildschirm, Licht, Stuhl und Arbeitszeiten, beschafft höhenverstellbare Tische, regelt Pausen und Tätigkeitswechsel und bietet eine Vorsorge für die Augen an.

### Abgrenzung
Die arbeitsvertraglichen Pflichten (Vergütung, Beschäftigung, Zeugnis) stehen im Arbeitsvertrag; die **Fürsorgepflicht** umfasst den Arbeitsschutz als einen Teil.

### Prüfungsfalle
Persönliche Schutzausrüstung als erste Maßnahme nennen – nach STOP ist sie das letzte Mittel.

### Merksatz
Beurteilen, schützen, prüfen, dokumentieren, unterweisen.

Siehe auch: Arbeitsschutz · Gefährdungsbeurteilung · STOP-Prinzip · Unterweisung · Bildschirmarbeit
Mehr: Deep Dive 14, 5.1

## Arbeitslosengeld I
<!-- id: arbeitslosengeld-i · quellen: Karte DD14, DD14 1.4 · stand: 2026-10 -->

Versicherungsleistung der Arbeitslosenversicherung: 60 % des pauschalierten Nettoentgelts, mit Kind 67 % (§ 149 SGB III, Stand 2026).

### Erklärung
Voraussetzungen: Arbeitslosigkeit, persönliche Arbeitslosmeldung bei der Agentur für Arbeit und die **Anwartschaftszeit** von mindestens 12 Monaten Versicherungspflicht in den letzten 30 Monaten (§§ 142, 143 SGB III). Grundlage der Höhe ist das durchschnittliche Bruttoentgelt des letzten Jahres, pauschal um Steuer und Sozialabgaben gemindert. Die Bezugsdauer hängt von Versicherungszeit und Alter ab (6 bis 24 Monate). Wer selbst kündigt oder einen Aufhebungsvertrag ohne wichtigen Grund schließt, bekommt in der Regel eine **Sperrzeit** von 12 Wochen (§ 159 SGB III).

### Beispiel
Pauschaliertes Nettoentgelt 2.000 € im Monat: ohne Kind $2000 \cdot 0{,}60 = 1.200$ €, mit Kind $2000 \cdot 0{,}67 = 1.340$ € monatlich.

### Abgrenzung
Arbeitslosengeld I ist eine beitragsfinanzierte Versicherungsleistung. Das **Bürgergeld** bzw. die Grundsicherung ist dagegen steuerfinanziert und bedarfsabhängig.

### Prüfungsfalle
Den Prozentsatz auf das Brutto beziehen – Basis ist das pauschalierte Netto.

### Merksatz
60 % vom pauschalierten Netto, 67 % mit Kind – nach 12 Monaten Versicherung in 30 Monaten.

Siehe auch: Arbeitslosenversicherung · Aufhebungsvertrag · Sozialversicherung · Nettoentgelt
Mehr: Deep Dive 14, 1.4

## Arbeitslosenversicherung
<!-- id: arbeitslosenversicherung · quellen: Karte DD14, DD14 1.2, DD14 1.3 · stand: 2026-10 -->

Zweig der Sozialversicherung mit der Bundesagentur für Arbeit als Träger; Beitrag 2,6 % des Bruttoentgelts, je zur Hälfte von Arbeitgeber und Arbeitnehmer (Stand 2026).

### Erklärung
Pflichtversichert sind Arbeitnehmer und Auszubildende. Leistungen: **Arbeitslosengeld I**, Arbeitsvermittlung und Beratung, Förderung der beruflichen Weiterbildung, Kurzarbeitergeld und Insolvenzgeld. Beiträge werden nur bis zur **Beitragsbemessungsgrenze** erhoben – 2026 bundeseinheitlich 8.450 € im Monat (gleiche Grenze wie Rentenversicherung).

### Beispiel
Bruttovergütung 1.200 €: Arbeitnehmeranteil $1200 \cdot 0{,}013 = 15{,}60$ €, Arbeitgeberanteil ebenfalls 15,60 €. Bei 9.000 € Brutto zählen nur 8.450 €: Arbeitnehmeranteil $8450 \cdot 0{,}013 = 109{,}85$ €.

### Abgrenzung
| Zweig | Träger | Finanzierung |
|---|---|---|
| Arbeitslosenversicherung | Bundesagentur für Arbeit | je zur Hälfte |
| Unfallversicherung | Berufsgenossenschaften | Arbeitgeber allein |
| Rentenversicherung | Deutsche Rentenversicherung | je zur Hälfte |

### Prüfungsfalle
Auszubildende mit höchstens 325 € Vergütung: Der Arbeitgeber trägt die Beiträge allein (Geringverdienergrenze).

### Merksatz
Bundesagentur, 2,6 %, halbe-halbe.

Siehe auch: Arbeitslosengeld I · Sozialversicherung · Beitragsbemessungsgrenze · Geringverdienergrenze
Mehr: Deep Dive 14, 1.2 · Deep Dive 14, 1.3

## Arbeitspaket
<!-- id: arbeitspaket · quellen: Karte DD12, DD12 3.1 · stand: 2026-10 -->

Kleinste planbare Einheit im Projektstrukturplan mit klarem Ergebnis, einem Verantwortlichen, geschätztem Aufwand und Termin.

### Erklärung
Der **Projektstrukturplan (PSP)** zerlegt das Projekt hierarchisch in Teilaufgaben bis zu den Arbeitspaketen. Ein Arbeitspaket ist so klein, dass es sich verlässlich schätzen und einer Person zuordnen lässt, und so groß, dass es ein überprüfbares Ergebnis liefert. Aus den Arbeitspaketen entstehen Netzplan, Gantt-Diagramm und Kostenplan.

### Beispiel
Dashboard-Projekt, Teilaufgabe „Datenbereitstellung“, Arbeitspaket „ETL-Strecke Reparaturaufträge erstellen“: Ergebnis getesteter Ladelauf, verantwortlich Jonas, Aufwand 4 Personentage, fertig bis 14.08.

### Abgrenzung
Ein **Meilenstein** ist ein Zeitpunkt mit überprüfbarem Ergebnis und Dauer null; ein Arbeitspaket ist Arbeit mit Dauer. Im agilen Vorgehen entsprechen ihm eher User Stories bzw. Aufgaben im Sprint Backlog.

### Prüfungsfalle
Arbeitspakete ohne Verantwortlichen oder ohne prüfbares Ergebnis formulieren („Datenbank“ statt „Datenmodell erstellt und abgenommen“).

### Merksatz
Ein Paket, ein Ergebnis, ein Verantwortlicher.

Siehe auch: Projektstrukturplan · Netzplan · Meilenstein · Gantt-Diagramm
Mehr: Deep Dive 12, 3.1

## Arbeitsschutz
<!-- id: arbeitsschutz · quellen: Karte DD14, DD14 5.1 · stand: 2026-10 -->

Gesamtheit der gesetzlichen und betrieblichen Maßnahmen zum Schutz von Sicherheit und Gesundheit der Beschäftigten – vor allem nach dem Arbeitsschutzgesetz (ArbSchG).

### Erklärung
Deutschland hat ein **duales System**: Staatliche Arbeitsschutzbehörden überwachen die Gesetze; die Berufsgenossenschaften (Spitzenverband DGUV) erlassen Unfallverhütungsvorschriften und kontrollieren ebenfalls. Kernpflichten des Arbeitgebers sind Gefährdungsbeurteilung, Schutzmaßnahmen nach dem **STOP-Prinzip** (Substitution, Technik, Organisation, Person), Unterweisung und Dokumentation. Für IT-Arbeitsplätze wichtig: Arbeitsstättenverordnung (Bildschirmarbeit) und DGUV Vorschrift 3 (Prüfung elektrischer Geräte).

### Beispiel
Ein defektes Netzteil im Büro: Nach DGUV Vorschrift 3 werden ortsveränderliche Geräte regelmäßig geprüft; das Gerät wird ausgetauscht (technische Maßnahme), statt die Beschäftigten nur zu warnen.

### Abgrenzung
Weitere Schutzgesetze betreffen besondere Gruppen: **Arbeitszeitgesetz** (Arbeitszeit), **JArbSchG** (Jugendliche), Mutterschutzgesetz. Die **Unfallversicherung** entschädigt nach einem Unfall; der Arbeitsschutz soll ihn verhindern.

### Prüfungsfalle
Arbeitsschutz für Sache der Beschäftigten halten – verantwortlich ist der Arbeitgeber, die Beschäftigten müssen mitwirken.

### Merksatz
Gefährdung beurteilen, nach STOP schützen, unterweisen, dokumentieren.

Siehe auch: Arbeitgeberpflichten · Gefährdungsbeurteilung · STOP-Prinzip · DGUV · Unterweisung
Mehr: Deep Dive 14, 5.1

## Arbeitsvertrag
<!-- id: arbeitsvertrag · quellen: Karte DD13, DD13 3.1 · stand: 2026-10 -->

Dienstvertrag, in dem sich der Arbeitnehmer zur weisungsgebundenen Arbeit und der Arbeitgeber zur Vergütung verpflichtet (§ 611a BGB).

### Erklärung
Der Arbeitsvertrag ist grundsätzlich **formfrei**, auch mündlich gültig. Die wesentlichen Bedingungen muss der Arbeitgeber aber nach dem **Nachweisgesetz** schriftlich bzw. seit 2025 auch in Textform nachweisen (Ausnahme: bestimmte Branchen und auf Verlangen schriftlich). Eine **Befristung** braucht die Schriftform; ohne Sachgrund ist sie bis zu zwei Jahre mit höchstens drei Verlängerungen zulässig (§ 14 TzBfG). Pflichten: Arbeitnehmer – Arbeits-, Treue-, Verschwiegenheitspflicht; Arbeitgeber – Vergütung, Fürsorge, Beschäftigung, Urlaub, Entgeltfortzahlung, Zeugnis.

### Beispiel
Eine Datenanalystin wird ab 01.09.2026 eingestellt, befristet auf ein Jahr ohne Sachgrund. Die Befristung wird per E-Mail vereinbart – sie ist unwirksam, der Vertrag gilt als unbefristet.

### Abgrenzung
Der **Werkvertrag** schuldet einen Erfolg, der Dienstvertrag nur die Tätigkeit. Der Arbeitsvertrag ist ein Dienstvertrag mit Weisungsgebundenheit; der **Ausbildungsvertrag** folgt eigenen Regeln im BBiG.

### Prüfungsfalle
„Ein Arbeitsvertrag muss schriftlich geschlossen werden“ – falsch; schriftlich sein müssen Befristung und Kündigung.

### Merksatz
Arbeitsvertrag formfrei, Befristung und Kündigung schriftlich.

Siehe auch: Dienstvertrag · Nachweisgesetz · Probezeit · Ordentliche Kündigung · Tarifvertrag
Mehr: Deep Dive 13, 3.1

## Arbeitszeitgesetz
<!-- id: arbeitszeitgesetz · quellen: Karte DD13, DD13 2.2 · stand: 2026-10 -->

Schutzgesetz für erwachsene Arbeitnehmer: höchstens 8 Stunden werktäglich, bis 10 bei Ausgleich; Pausen 30 Minuten bei mehr als 6 und 45 Minuten bei mehr als 9 Stunden; 11 Stunden Ruhezeit (Stand Oktober 2026).

### Erklärung
- **Höchstarbeitszeit** (§ 3): 8 Stunden je Werktag (Montag bis Samstag); Verlängerung auf 10 Stunden, wenn im Durchschnitt von sechs Kalendermonaten oder 24 Wochen 8 Stunden nicht überschritten werden.
- **Ruhepausen** (§ 4): 30 Minuten bei mehr als 6, 45 Minuten bei mehr als 9 Stunden; aufteilbar in Abschnitte von mindestens 15 Minuten; nie länger als 6 Stunden am Stück ohne Pause.
- **Ruhezeit** (§ 5): mindestens 11 Stunden zwischen zwei Arbeitstagen.
- Sonn- und Feiertage sind grundsätzlich arbeitsfrei (§ 9).

Eine Reform mit wöchentlicher statt täglicher Höchstarbeitszeit liegt als Entwurf vor, ist aber nicht in Kraft (Stand Oktober 2026).

### Beispiel
Arbeitsbeginn 7:30 Uhr, Arbeitszeit 9,5 Stunden → mindestens 45 Minuten Pause, Ende frühestens 17:45 Uhr. Nächster Arbeitsbeginn frühestens 4:45 Uhr (11 Stunden Ruhezeit).

### Abgrenzung
Für Jugendliche gilt das **JArbSchG** mit strengeren Regeln (z. B. 30 Minuten Pause schon bei mehr als 4,5 Stunden, 60 Minuten bei mehr als 6 Stunden).

### Prüfungsfalle
Pausenregeln von ArbZG und JArbSchG vertauschen.

### Merksatz
8 (bis 10), 6/30, 9/45, 11 Stunden Ruhe.

Siehe auch: JArbSchG · Arbeitsschutz · Arbeitsvertrag · Tarifvertrag
Mehr: Deep Dive 13, 2.2

## Arbeitszeugnis
<!-- id: arbeitszeugnis · quellen: Karte DD13, DD13 3.5 · stand: 2026-10 -->

Schriftliche Beurteilung bei Ende des Arbeitsverhältnisses: Das einfache Zeugnis (Art und Dauer der Tätigkeit) ist Pflicht, das qualifizierte enthält zusätzlich Leistung und Verhalten und wird auf Verlangen ausgestellt (§ 109 GewO).

### Erklärung
Das Zeugnis muss **wahr und wohlwollend** sein – daraus entstand die codierte Zeugnissprache („stets zu unserer vollsten Zufriedenheit“ = sehr gut). Die elektronische Form ist ausgeschlossen. Unzulässig sind Angaben zu Krankheiten, Betriebsratstätigkeit, Gewerkschaftszugehörigkeit oder Hinweise in Geheimzeichen. Auszubildende haben nach § 16 BBiG ebenfalls Anspruch auf ein Zeugnis; ein **Zwischenzeugnis** kann man bei berechtigtem Interesse verlangen (z. B. Vorgesetztenwechsel).

### Beispiel
Ein Mitarbeiter des Möbelhauses verlangt bei seinem Ausscheiden ein qualifiziertes Zeugnis. Es beschreibt seine Aufgaben in der Datenanalyse, bewertet Leistung und Verhalten und schließt mit einer Dankes- und Wunschformel.

### Abgrenzung
| | einfaches Zeugnis | qualifiziertes Zeugnis |
|---|---|---|
| Inhalt | Art und Dauer | zusätzlich Leistung und Verhalten |
| Ausstellung | immer | auf Verlangen |

### Prüfungsfalle
Annehmen, das qualifizierte Zeugnis werde automatisch ausgestellt oder dürfe per E-Mail kommen.

### Merksatz
Einfach immer, qualifiziert auf Verlangen – schriftlich, wahr und wohlwollend.

Siehe auch: Arbeitsvertrag · Zeugnis · Schriftform · Ausbildungsbetrieb
Mehr: Deep Dive 13, 3.5

## Arithmetisches Mittel
<!-- id: arithmetisches-mittel · quellen: Karte DD3, DD3 Teil 3 · stand: 2026-10 -->

Lagemaß: Summe aller Werte geteilt durch ihre Anzahl, $\bar{x} = \frac{\sum x_i}{n}$; nutzt alle Werte, ist aber empfindlich gegenüber Ausreißern.

### Erklärung
Das arithmetische Mittel setzt metrische Daten voraus (Intervall- oder Verhältnisskala). Ein einzelner Extremwert verschiebt es stark; der **Median** ist dagegen robust. Liegt das Mittel deutlich über dem Median, ist die Verteilung rechtsschief (große Ausreißer ziehen nach oben). Wiegen Werte unterschiedlich schwer, nimmt man das **gewichtete** arithmetische Mittel.

### Beispiel
Lieferzeiten in Tagen: 2, 3, 3, 4, 5, 5, 5, 6, 8, 19.
$\bar{x} = \frac{60}{10} = 6{,}0$ Tage, Median $\frac{5 + 5}{2} = 5{,}0$ Tage. Ohne den Ausreißer 19: $\frac{41}{9} \approx 4{,}56$ Tage.

### Abgrenzung
| Lagemaß | Skala | Ausreißer |
|---|---|---|
| Modus | ab nominal | unempfindlich |
| Median | ab ordinal | robust |
| arithmetisches Mittel | metrisch | empfindlich |

### Prüfungsfalle
Mittelwerte aus Postleitzahlen, Kundennummern oder Schulnoten bilden – nominal bzw. ordinal.

### Merksatz
Das Mittel hört auf jeden Wert, auch auf den lauten Ausreißer.

Siehe auch: Median · Modus · Gewichtetes arithmetisches Mittel · Ausreißer · Rechtsschief (linkssteil)
Mehr: Deep Dive 3, Teil 3

## Artefakte
<!-- id: artefakte · quellen: DD12 Teil 2 · stand: 2026-10 -->

Die drei Arbeitsergebnisse in Scrum – Product Backlog, Sprint Backlog und Inkrement –, jeweils mit einer Verpflichtung (Commitment) nach dem Scrum Guide 2020.

### Erklärung
| Artefakt | Inhalt | Commitment |
|---|---|---|
| **Product Backlog** | geordnete Liste aller Anforderungen, verantwortet vom Product Owner | Produktziel (Product Goal) |
| **Sprint Backlog** | für den Sprint ausgewählte Einträge plus Plan der Developers | Sprint-Ziel (Sprint Goal) |
| **Inkrement** | nutzbares, fertiges Ergebnis des Sprints | Definition of Done |

Die Artefakte machen Arbeit und Fortschritt transparent; die Commitments geben an, woran man sie misst.

### Beispiel
Product Backlog des Dashboard-Projekts: „Durchlaufzeit je Werkstatt anzeigen“, „Filter nach Monat“, „Export als PDF“. Sprint-Ziel: „Die Werkstattleitung sieht die Durchlaufzeit je Werkstatt.“ Das Inkrement gilt als fertig, wenn es getestet, dokumentiert und mit dem Quellsystem abgeglichen ist (Definition of Done).

### Abgrenzung
Artefakte sind Ergebnisse; **Events** (Sprint, Sprint Planning, Daily Scrum, Review, Retrospektive) sind Termine; **Rollen** bzw. Verantwortlichkeiten sind Product Owner, Scrum Master und Developers. Ein Burndown-Chart ist ein Hilfsmittel, kein Scrum-Artefakt.

### Prüfungsfalle
Die Definition of Done als eigenes Artefakt nennen – sie ist das Commitment des Inkrements.

### Merksatz
Drei Artefakte, drei Ziele: Produktziel, Sprint-Ziel, Definition of Done.

Siehe auch: Scrum · Product Backlog · Sprint Backlog · Inkrement · Definition of Done
Mehr: Deep Dive 12, Teil 2

## Arten von Faktentabellen
<!-- id: arten-von-faktentabellen · quellen: DD8 4.1 · stand: 2026-10 -->

Unterscheidung von Faktentabellen nach Kimball: Transaktions-Faktentabelle, periodischer Snapshot und akkumulierender Snapshot.

### Erklärung
| Art | eine Zeile je … | Beispiel | Kennzahlen |
|---|---|---|---|
| **Transaktion** | Ereignis | Bestellposition, Kassenbon | meist additiv |
| **periodischer Snapshot** | Zeitpunkt in festen Abständen | Lagerbestand je Artikel und Tag | oft semi-additiv |
| **akkumulierender Snapshot** | Vorgang, wird je Prozessschritt aktualisiert | Bestellung mit Datumsspalten für Bestellung, Lieferung, Zahlung | Dauern zwischen Schritten |

Die Wahl hängt von der Frage ab: Was ist passiert (Transaktion)? Wie war der Zustand (Snapshot)? Wo steht jeder Vorgang (akkumulierend)?

### Beispiel
Für die Frage „Wie lange dauert es von der Reparaturmeldung bis zur Rechnung?“ passt ein akkumulierender Snapshot mit einer Zeile je Reparaturauftrag und den Spalten datum_meldung, datum_reparatur, datum_rechnung.

### Abgrenzung
Die Art der Faktentabelle hängt eng mit der **Granularität** zusammen und bestimmt, welche **Kennzahlentypen** summierbar sind. Dimensionstabellen beschreiben dagegen das Wer, Was, Wann, Wo.

### Prüfungsfalle
Bestände aus einem periodischen Snapshot über die Zeit summieren – sie sind semi-additiv.

### Merksatz
Ereignis, Zustand, Vorgang – drei Arten, drei Fragen.

Siehe auch: Faktentabelle · Granularität · Kennzahlentypen · Star-Schema · Dimensionstabelle
Mehr: Deep Dive 8, 4.1

## ASCII
<!-- id: ascii · quellen: DD15 2.5 · stand: 2026-10 -->

Zeichenkodierung mit 7 Bit für 128 Zeichen (lateinische Buchstaben ohne Umlaute, Ziffern, Satz- und Steuerzeichen).

### Erklärung
ASCII (American Standard Code for Information Interchange) kodiert die Zeichen 0 bis 127; Umlaute, ß und € fehlen. Spätere Kodierungen bauen darauf auf: **Latin-1** (ISO 8859-1) nutzt ein volles Byte und ergänzt westeuropäische Zeichen, **UTF-8** kodiert alle Unicode-Zeichen mit 1 bis 4 Byte und ist ASCII-kompatibel – ein reiner ASCII-Text ist zugleich gültiges UTF-8.

### Beispiel
„Groesse“ ist reines ASCII (7 Byte). „Größe“ lässt sich in ASCII nicht darstellen; in Latin-1 braucht es 5 Byte, in UTF-8 7 Byte (ö und ß je 2 Byte).

### Abgrenzung
| Kodierung | Zeichen | Byte je Zeichen |
|---|---|---|
| ASCII | 128 | 1 (7 Bit) |
| Latin-1 | 256 | 1 |
| UTF-8 | alle Unicode-Zeichen | 1 bis 4 |

### Prüfungsfalle
ASCII mit Umlauten verbinden – Umlaute gibt es erst in den 8-Bit-Erweiterungen und Unicode.

### Merksatz
ASCII: 128 Zeichen, keine Umlaute – UTF-8 versteht es trotzdem.

Siehe auch: UTF-8 · Zeichenkodierung · CSV
Mehr: Deep Dive 15, 2.5

## Assoziation
<!-- id: assoziation · quellen: Karte DD15, DD15 5.3, DD17 2.3 · stand: 2026-10 -->

Beziehung zwischen Klassen im UML-Klassendiagramm (Linie, ggf. mit Name und Multiplizitäten) – entspricht der Beziehung im ERM.

### Erklärung
An den Linienenden stehen **Multiplizitäten** wie `1`, `0..1`, `0..*`, `1..*` (`*` allein = `0..*`). Gelesen wird wie in der Chen-Notation: Die Angabe steht an der gegenüberliegenden Seite – sie sagt, mit wie vielen Objekten dieser Klasse ein Objekt der anderen Klasse verbunden ist. Ein Name mit Leserichtung („erteilt ▸“) macht die Bedeutung klar. Sonderformen sind **Aggregation** und **Komposition**.

### Beispiel
`Kunde 1 ——— 0..* Bestellung` (Name „erteilt“): Ein Kunde erteilt 0 bis viele Bestellungen, jede Bestellung gehört zu genau einem Kunden. In Min-Max-Notation: KUNDE (0,n) – erteilt – (1,1) BESTELLUNG.

### Abgrenzung
| Beziehung | Symbol | Bedeutung |
|---|---|---|
| Assoziation | Linie | kennt / ist verbunden mit |
| Aggregation | leere Raute | Teil-Ganzes, Teil lebt weiter |
| Komposition | gefüllte Raute | Teil-Ganzes, Teil stirbt mit |
| Vererbung | leeres Dreieck | „ist ein“ |

### Prüfungsfalle
Multiplizitäten wie Min-Max lesen und dadurch alle Angaben auf die falsche Seite setzen.

### Merksatz
Linie verbindet, Zahlen an der Gegenseite sagen, wie viele.

Siehe auch: Klassendiagramm · Multiplizität · Aggregation · Komposition · Chen-Notation
Mehr: Deep Dive 15, 5.3 · Deep Dive 17, 2.3

## Assoziationsanalyse
<!-- id: assoziationsanalyse · quellen: Karte DD6, DD6 2.4, DD6 4.1 · stand: 2026-10 -->

Unüberwachtes Verfahren, das Wenn-dann-Regeln in Transaktionsdaten findet, typischerweise in Warenkörben (Warenkorbanalyse).

### Erklärung
Für eine Regel A → B werden drei Kennzahlen berechnet:
- **Support** = Anteil der Transaktionen mit A und B
- **Konfidenz** = Support(A und B) / Support(A) – richtungsabhängig
- **Lift** = Konfidenz(A → B) / Support(B) – symmetrisch; > 1 positiver Zusammenhang, = 1 unabhängig, < 1 negativer

Gefunden werden die Regeln meist mit dem **Apriori-Algorithmus**. Einsatz: Cross-Selling, Produktplatzierung, Empfehlungen, Bundles.

### Beispiel
Zehn Warenkörbe, Schreibtisch in 5, Bürostuhl in 6, beide in 4. Regel Schreibtisch → Bürostuhl: Support $\frac{4}{10} = 40\ \%$, Konfidenz $\frac{0{,}40}{0{,}50} = 80\ \%$, Lift $\frac{0{,}80}{0{,}60} = 1{,}33$ – ein empfehlenswertes Bundle.

### Abgrenzung
**Clustering** gruppiert ähnliche Fälle (Kunden), die Assoziationsanalyse findet Zusammenhänge zwischen Merkmalen (Artikeln). Eine Regel zeigt gemeinsames Auftreten, keine Kausalität.

### Prüfungsfalle
Eine hohe Konfidenz allein als Zusammenhang deuten – erst der Lift zeigt, ob die Kombination häufiger ist als zufällig.

### Merksatz
Support: wie oft, Konfidenz: wie zuverlässig, Lift: besser als Zufall?

Siehe auch: Apriori-Algorithmus · Support · Konfidenz · Lift · Unüberwachtes Lernen
Mehr: Deep Dive 6, 2.4 · Deep Dive 6, 4.1

## Asymmetrische Verschlüsselung
<!-- id: asymmetrische-verschlusselung · quellen: Karte DD10, DD10 4.2 · stand: 2026-10 -->

Verschlüsselung mit einem Schlüsselpaar: Der öffentliche Schlüssel verschlüsselt, nur der zugehörige private Schlüssel entschlüsselt – löst den Schlüsselaustausch, ist aber langsam.

Auch: Asymmetrisch

### Erklärung
Jeder Teilnehmer hat einen öffentlichen Schlüssel, den er frei verteilt, und einen privaten, den nur er kennt. Wer ihm etwas Vertrauliches schicken will, verschlüsselt mit seinem öffentlichen Schlüssel. Umgekehrt dient das Paar der **digitalen Signatur**: Der Absender signiert den Hash mit seinem privaten Schlüssel, jeder prüft mit dem öffentlichen. Dass ein öffentlicher Schlüssel wirklich zu jemandem gehört, bestätigen Zertifikate einer **PKI**. Beispiele: RSA, Verfahren auf elliptischen Kurven.

### Beispiel
Ein Lieferant schickt dem Möbelhaus eine Preisliste: Er verschlüsselt sie mit dem öffentlichen Schlüssel des Möbelhauses; nur dessen privater Schlüssel kann sie öffnen.

### Abgrenzung
| Verfahren | Schlüssel | Eigenschaft |
|---|---|---|
| symmetrisch (AES) | ein gemeinsamer | schnell, Problem Schlüsselaustausch |
| asymmetrisch (RSA) | Paar öffentlich/privat | Austausch gelöst, langsam |
| hybrid (TLS) | asymmetrisch einigen, symmetrisch verschlüsseln | Praxisstandard |

### Prüfungsfalle
Mit dem privaten Schlüssel „verschlüsseln“, um Vertraulichkeit zu erreichen – das wäre eine Signatur, lesen kann sie jeder.

### Merksatz
Öffentlich schließt ab, privat schließt auf.

Siehe auch: Symmetrische Verschlüsselung · Hybride Verschlüsselung · Digitale Signatur · PKI · Hashing
Mehr: Deep Dive 10, 4.2

## Asynchrone Nachricht
<!-- id: asynchrone-nachricht · quellen: DD17 2.5 · stand: 2026-10 -->

Nachricht im Sequenzdiagramm, bei der der Sender nicht auf eine Antwort wartet; Symbol: durchgezogener Pfeil mit offener Spitze.

### Erklärung
Nach dem Senden arbeitet der Absender sofort weiter; ob und wann der Empfänger reagiert, ist offen. Typisch sind Benachrichtigungen, Ereignisse über eine Message Queue oder ein Webhook. Bei einer **synchronen Nachricht** wartet der Sender dagegen, bis die Antwort kommt.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120" role="img" aria-label="Pfeilarten im Sequenzdiagramm: synchron, asynchron, Antwort">
<defs><marker id="asynchrone-nachricht-voll" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker><marker id="asynchrone-nachricht-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker></defs>
<line x1="20" y1="20" x2="200" y2="20" class="dg-linie" marker-end="url(#asynchrone-nachricht-voll)"/>
<text x="215" y="20" dominant-baseline="middle" class="dg-klein">synchron – Sender wartet</text>
<line x1="20" y1="60" x2="200" y2="60" class="dg-linie" marker-end="url(#asynchrone-nachricht-offen)"/>
<text x="215" y="60" dominant-baseline="middle" class="dg-klein">asynchron – Sender wartet nicht</text>
<line x1="200" y1="100" x2="20" y2="100" class="dg-linie dg-strich" marker-end="url(#asynchrone-nachricht-offen)"/>
<text x="215" y="100" dominant-baseline="middle" class="dg-klein">Antwort</text>
</svg>
```

### Beispiel
Nach erfolgreicher Bestellung schickt der Webshop asynchron „sendeBestätigungsmail()“ an den Maildienst und zeigt dem Kunden sofort die Bestätigungsseite, ohne auf den Versand zu warten.

### Abgrenzung
Die **Antwortnachricht** hat ebenfalls eine offene Spitze, ist aber gestrichelt und läuft zurück zum Aufrufer.

### Prüfungsfalle
Gefüllte und offene Spitze vertauschen – gefüllt heißt warten (synchron).

### Merksatz
Offene Spitze, durchgezogene Linie: abschicken und weitermachen.

Siehe auch: Synchrone Nachricht · Antwortnachricht · Sequenzdiagramm · Webhook
Mehr: Deep Dive 17, 2.5

## Atomare Änderung
<!-- id: atomare-anderung · quellen: DD15 4.2 · stand: 2026-10 -->

Änderung, die die Datenbank in einer einzigen Anweisung selbst berechnet und ausführt, z. B. `UPDATE lager SET bestand = bestand - 3 WHERE artikel_id = 10;` – so geht keine parallele Änderung verloren.

### Erklärung
Liest eine Anwendung einen Wert, rechnet im Programm und schreibt das Ergebnis zurück, kann eine zweite Transaktion dazwischen dasselbe tun – eine Änderung geht verloren (**Lost Update**). Bei der atomaren Änderung liest und schreibt die Datenbank in einem Schritt unter Sperre; parallele Updates werden nacheinander angewendet.

### Beispiel
Lagerbestand 10. Zwei Disponenten verkaufen je 3 Stück.
- Lesen, rechnen, schreiben: Beide lesen 10, beide schreiben 7 – falsch.
- Atomar: `bestand = bestand - 3` zweimal ausgeführt → $10 - 3 - 3 = 4$ – richtig.

### Abgrenzung
| Lösung gegen Lost Update | Prinzip |
|---|---|
| atomare Änderung | Datenbank rechnet selbst |
| pessimistisches Sperren | beim Lesen sperren (`SELECT … FOR UPDATE`) |
| optimistisches Sperren | Versionsspalte prüfen, bei Konflikt neu lesen |

### Prüfungsfalle
Atomare Änderung mit der Atomarität aus ACID gleichsetzen: ACID-Atomarität heißt „ganze Transaktion oder nichts“; hier geht es um eine einzelne Anweisung, die Lesen und Schreiben vereint.

### Merksatz
Nicht im Programm rechnen, sondern die Datenbank rechnen lassen.

Siehe auch: Lost Update · Optimistisches Sperren · Pessimistisches Sperren · ACID · Transaktion
Mehr: Deep Dive 15, 4.2

## Attribut
<!-- id: attribut · quellen: Karte DD2, DD2 1.2 · stand: 2026-10 -->

Eigenschaft einer Entität im ER-Modell (z. B. name, preis); der Schlüssel – ein Attribut oder eine Kombination – identifiziert jede Ausprägung eindeutig.

### Erklärung
In der Chen-Notation wird ein Attribut als Ellipse an der Entität gezeichnet, Schlüsselattribute unterstrichen. Im Relationenmodell wird es zur Tabellenspalte mit Datentyp. Auch Beziehungen können Attribute tragen (menge an „enthält“). Attribute sollen atomar sein (1. NF) und nur vom Schlüssel abhängen (3. NF).

### Beispiel
Entität PRODUKT mit den Attributen **produkt_id** (Schlüssel), bezeichnung, kategorie, preis. In der Tabelle: produkt(**produkt_id**, bezeichnung, kategorie, preis).

### Abgrenzung
Im Machine Learning heißt ein Attribut **Merkmal** oder Feature; in der UML steht es im mittleren Abschnitt der Klasse mit Sichtbarkeit und Typ (`− preis: Decimal`).

### Prüfungsfalle
Abgeleitete Werte (Alter aus Geburtsdatum, Summe aus Positionen) dauerhaft als eigenes Attribut speichern, ohne das zu begründen – das erzeugt Redundanz.

### Merksatz
Entität = Ding, Attribut = Eigenschaft, Schlüssel = eindeutiges Merkmal.

Siehe auch: Entität · Primärschlüssel · Schlüsselkandidat · Beziehung · Merkmal
Mehr: Deep Dive 2, 1.2

## AUC
<!-- id: auc · quellen: Karte DD7, DD7 4.4 · stand: 2026-10 -->

Area Under the Curve: Fläche unter der ROC-Kurve; 1 = perfekte Trennung, 0,5 = Zufall – ein schwellenunabhängiges Maß für die Trennschärfe eines Klassifikators.

### Erklärung
Die ROC-Kurve trägt für alle Entscheidungsschwellen die Richtig-Positiv-Rate (Recall) gegen die Falsch-Positiv-Rate ab. Die AUC fasst sie in einer Zahl zusammen. Anschaulich ist sie die Wahrscheinlichkeit, dass ein zufälliger positiver Fall einen höheren Score bekommt als ein zufälliger negativer. Sie eignet sich zum Vergleich mehrerer Modelle; sie sagt aber nicht, welche Schwelle im Betrieb gilt, und kennt keine Fehlerkosten. Bei stark unausgeglichenen Klassen wirkt sie oft zu optimistisch – dann ist die Precision-Recall-Kurve aussagekräftiger.

### Beispiel
Zwei Reklamationsmodelle: Modell A AUC 0,82, Modell B AUC 0,64. A trennt Reklamationen deutlich besser; die konkrete Schwelle wird danach nach den Fehlerkosten gewählt.

### Abgrenzung
| Wert | Bedeutung |
|---|---|
| 1,0 | perfekte Trennung |
| 0,5 | Zufall, Diagonale |
| unter 0,5 | schlechter als Zufall (Vorhersage vertauscht) |

**Accuracy**, Precision und Recall gelten nur für eine bestimmte Schwelle; die AUC über alle.

### Prüfungsfalle
Eine AUC von 0,5 als „halb so gut wie perfekt“ deuten – sie bedeutet: wertlos.

### Merksatz
AUC 0,5 ist Münzwurf, 1,0 ist perfekt.

Siehe auch: ROC-Kurve · Recall · Falsch-Positiv-Rate · Konfusionsmatrix · Unausgeglichene Klassen
Mehr: Deep Dive 7, 4.4

## Aufbauorganisation
<!-- id: aufbauorganisation · quellen: Karte DD5, DD5 6.1 · stand: 2026-10 -->

Regelt, wer im Unternehmen wofür zuständig ist: Stellen, Abteilungen und Weisungsbeziehungen – dargestellt im Organigramm.

### Erklärung
Kleinste Einheit ist die **Stelle** (Aufgabenbereich einer Person), mehrere Stellen bilden eine Abteilung. Die Weisungsbeziehungen ergeben das Organisationsmodell:
| Form | Merkmal | Vorteil | Nachteil |
|---|---|---|---|
| Einliniensystem | genau ein Vorgesetzter | klare Zuständigkeit | lange Dienstwege |
| Stabliniensystem | Linie plus beratende Stäbe ohne Weisungsrecht | Fachwissen ohne Bruch der Linie | Stäbe empfehlen nur |
| Mehrliniensystem | mehrere fachliche Vorgesetzte | kurze Wege | Kompetenzkonflikte |
| Matrixorganisation | Funktion und Objekt/Projekt kreuzen sich | flexibel | doppelte Unterstellung |

### Beispiel
Im Möbelhaus berichtet die Datenanalyse an die IT-Leitung (Linie); Datenschutzbeauftragter und Controlling beraten die Geschäftsführung als Stäbe.

### Abgrenzung
Die **Ablauforganisation** regelt, wie die Arbeit abläuft (Prozesse, BPMN); die Aufbauorganisation, wer zuständig ist (Struktur, Organigramm).

### Prüfungsfalle
Stabsstellen Weisungsrecht zuschreiben – sie beraten nur.

### Merksatz
Aufbau = wer, Ablauf = wie.

Siehe auch: Ablauforganisation · Organigramm · Einliniensystem · Stabliniensystem · Matrixorganisation
Mehr: Deep Dive 5, 6.1

## Aufgabenangemessenheit
<!-- id: aufgabenangemessenheit · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Interaktionsprinzip der ISO 9241-110: Das System unterstützt die Nutzer bei ihrer Aufgabe, ohne unnötige Schritte oder Ablenkung.

### Erklärung
Aufgabenangemessen ist eine Oberfläche, wenn sie die Funktionen und Informationen bietet, die für die Aufgabe nötig sind – und nicht mehr. Typische Merkmale: sinnvolle Voreinstellungen, kurze Wege für häufige Tätigkeiten, keine überflüssigen Eingaben. Die sieben Prinzipien der ISO 9241-110:2020 sind Aufgabenangemessenheit, Selbstbeschreibungsfähigkeit, Erwartungskonformität, Erlernbarkeit, Steuerbarkeit, Robustheit gegen Benutzungsfehler und Benutzerbindung.

### Beispiel
Die Werkstattleitung braucht im Dashboard fast immer den aktuellen Monat. Aufgabenangemessen: Der aktuelle Monat ist voreingestellt und mit einem Klick wechselbar, statt jedes Mal ein Datumsformular auszufüllen.

### Abgrenzung
**Selbstbeschreibungsfähigkeit** heißt: Der Nutzer weiß jederzeit, wo er ist und was möglich ist. **Steuerbarkeit** heißt: Er bestimmt Ablauf und Tempo. Aufgabenangemessenheit fragt, ob das System die Aufgabe effizient unterstützt.

### Prüfungsfalle
Veraltete Prinzipien von 2006 nennen (Individualisierbarkeit, Lernförderlichkeit, Fehlertoleranz) – seit 2020 gelten die neuen Bezeichnungen.

### Merksatz
Aufgabenangemessen: nur die Schritte, die die Aufgabe wirklich braucht.

Siehe auch: Interaktionsprinzipien · Selbstbeschreibungsfähigkeit · Erwartungskonformität · Steuerbarkeit · Gebrauchstauglichkeit
Mehr: Deep Dive 11, A5

## Aufgabenpriorität (FMEA)
<!-- id: aufgabenprioritat · quellen: Karte DD5, DD5 6.4 · stand: 2026-10 -->

Ersatz der Risikoprioritätszahl im AIAG-VDA-FMEA-Handbuch (2019): Einstufung hoch/mittel/niedrig, bei der die Bedeutung stärker zählt als im Produkt A · B · E.

### Erklärung
Die klassische **RPZ** multipliziert Auftreten, Bedeutung und Entdeckung (je 1 bis 10). Dabei können sehr verschiedene Risiken dieselbe Zahl ergeben. Die Aufgabenpriorität (AP, engl. Action Priority) liest aus einer Tabelle ab, ob Maßnahmen dringend (hoch), angeraten (mittel) oder optional (niedrig) sind; die Bedeutung wird zuerst betrachtet, dann das Auftreten, zuletzt die Entdeckung. Maßgeblich ist das Handbuch in der Automobilindustrie; in IHK-Aufgaben wird weiterhin mit der RPZ gerechnet.

### Beispiel
Fehler 1: B = 2, A = 10, E = 5 → RPZ 100. Fehler 2: B = 10, A = 2, E = 5 → RPZ 100. Gleiche RPZ, aber Fehler 2 hat gravierende Folgen; nach der AP-Logik erhält er wegen der hohen Bedeutung Vorrang.

### Abgrenzung
| | RPZ | Aufgabenpriorität |
|---|---|---|
| Ergebnis | Zahl 1 bis 1.000 | hoch / mittel / niedrig |
| Gewichtung | A, B, E gleich | Bedeutung zuerst |

### Prüfungsfalle
In einer IHK-Rechenaufgabe die AP statt der verlangten RPZ verwenden.

### Merksatz
RPZ multipliziert, AP priorisiert nach Bedeutung.

Siehe auch: FMEA · Risikoprioritätszahl · Risikomatrix · Risikomanagement
Mehr: Deep Dive 5, 6.4

## Aufhebungsvertrag
<!-- id: aufhebungsvertrag · quellen: Karte DD13, DD13 3.2 · stand: 2026-10 -->

Vertrag, mit dem Arbeitgeber und Arbeitnehmer das Arbeitsverhältnis einvernehmlich und ohne Kündigungsfrist beenden; er bedarf der Schriftform (§ 623 BGB).

### Erklärung
Weil es keine Kündigung ist, gelten weder Kündigungsfristen noch Kündigungsschutz, und der Betriebsrat muss nicht angehört werden. Oft wird eine Abfindung vereinbart. Nachteil für den Arbeitnehmer: Die Agentur für Arbeit verhängt in der Regel eine **Sperrzeit** beim Arbeitslosengeld von zwölf Wochen (§ 159 SGB III), wenn kein wichtiger Grund vorliegt. Unterschrieben werden muss eigenhändig auf Papier – E-Mail oder Scan genügen nicht.

### Beispiel
Ein Mitarbeiter des Möbelhauses hat eine neue Stelle ab 01.11. in Aussicht, seine Kündigungsfrist liefe bis 31.12. Beide Seiten unterschreiben einen Aufhebungsvertrag zum 31.10.

### Abgrenzung
| | Kündigung | Aufhebungsvertrag |
|---|---|---|
| Erklärung | einseitig | zweiseitig |
| Frist | gesetzlich, tariflich, vertraglich | frei vereinbar |
| Kündigungsschutz | ja | nein |
| Form | schriftlich | schriftlich |

### Prüfungsfalle
Einen per E-Mail geschlossenen Aufhebungsvertrag für wirksam halten.

### Merksatz
Einvernehmlich, schriftlich, ohne Frist – Vorsicht Sperrzeit.

Siehe auch: Ordentliche Kündigung · Arbeitslosengeld I · Schriftform · Kündigungsschutzgesetz
Mehr: Deep Dive 13, 3.2

## Auftragsverarbeiter
<!-- id: auftragsverarbeiter · quellen: Karte DD10, DD10 Teil 1, DD10 2.4 · stand: 2026-10 -->

Wer personenbezogene Daten im Auftrag und nach Weisung des Verantwortlichen verarbeitet (Art. 4 Nr. 8 DSGVO), z. B. ein Rechenzentrum; nötig ist ein Auftragsverarbeitungsvertrag (Art. 28).

### Erklärung
Der Auftragsverarbeiter entscheidet nicht selbst über Zwecke und Mittel – das tut der **Verantwortliche**, der auch verantwortlich bleibt. Der **Auftragsverarbeitungsvertrag (AVV)** regelt u. a. Gegenstand, Dauer, Art der Daten, Weisungsgebundenheit, Vertraulichkeit, technische und organisatorische Maßnahmen, Unterauftragnehmer und Löschung nach Auftragsende. Datenpannen meldet der Auftragsverarbeiter unverzüglich dem Verantwortlichen (Art. 33 Abs. 2). Sitzt er außerhalb von EU/EWR, gelten zusätzlich die Regeln zum Drittlandtransfer.

### Beispiel
Das Möbelhaus lässt sein Data Warehouse bei einem Cloud-Anbieter betreiben. Der Anbieter ist Auftragsverarbeiter; ein AVV ist Pflicht.

### Abgrenzung
Wer eigenverantwortlich arbeitet, ist kein Auftragsverarbeiter, sondern selbst Verantwortlicher – etwa Steuerberater, Banken oder Anwälte.

### Prüfungsfalle
Annehmen, mit der Auslagerung gehe die Verantwortung auf den Dienstleister über.

### Merksatz
Auftragsverarbeiter handelt nach Weisung – die Verantwortung bleibt beim Auftraggeber.

Siehe auch: Verantwortlicher · DSGVO · Technische und organisatorische Maßnahmen · Standardvertragsklauseln · Personenbezogene Daten
Mehr: Deep Dive 10, Teil 1 · Deep Dive 10, 2.4

## Aufwand (Komplexität)
<!-- id: aufwand · quellen: DD11 B7 · stand: 2026-10 -->

Beschreibt, wie die Zahl der Rechenschritte eines Algorithmus mit der Datenmenge n wächst – angegeben in der O-Notation.

### Erklärung
Die O-Notation lässt konstante Faktoren weg und betrachtet nur die Größenordnung für große n. Typische Klassen von gut nach schlecht: O(1) konstant, O(log n) logarithmisch (binäre Suche), O(n) linear (lineare Suche), O(n log n) (Merge Sort, Quicksort im Mittel), O(n²) quadratisch (Bubble, Selection, Insertion Sort). Man unterscheidet besten, mittleren und schlechtesten Fall.

### Beispiel
n = 1.000 Datensätze: O(n²) braucht rund $1000^2 = 1.000.000$ Vergleiche, O(n log n) rund $1000 \cdot 10 = 10.000$ (denn $\log_2 1000 \approx 10$). Binäre Suche findet einen Wert in höchstens etwa 10 Schritten, lineare Suche braucht bis zu 1.000.

### Abgrenzung
| Verfahren | mittlerer Fall | schlechtester Fall |
|---|---|---|
| lineare Suche | O(n) | O(n) |
| binäre Suche (sortiert!) | O(log n) | O(log n) |
| Bubble Sort | O(n²) | O(n²) |
| Merge Sort | O(n log n) | O(n log n) |
| Quicksort | O(n log n) | O(n²) |

### Prüfungsfalle
Die binäre Suche auf unsortierte Daten anwenden oder vergessen, dass Quicksort im schlechtesten Fall quadratisch ist.

### Merksatz
O-Notation fragt nicht „wie schnell“, sondern „wie stark wächst der Aufwand mit n“.

Siehe auch: O-Notation · Binäre Suche · Lineare Suche · Bubble Sort · Merge Sort
Mehr: Deep Dive 11, B7

## Ausbildungsbetrieb
<!-- id: ausbildungsbetrieb · quellen: DD13 1.1, DD13 1.3 · stand: 2026-10 -->

Lernort der dualen Ausbildung, der die praktische Ausbildung nach der Ausbildungsordnung vermittelt.

### Erklärung
Im dualen System teilen sich Betrieb und Berufsschule die Ausbildung. Der Betrieb bildet nach dem **Ausbildungsrahmenplan** der Ausbildungsordnung aus und muss geeignet sein: Die Ausbildungsstätte muss nach Art und Einrichtung passen, Ausbildende und Ausbilder müssen persönlich und fachlich geeignet sein (§§ 27 ff. BBiG). Pflichten nach §§ 14 ff. BBiG: ausbilden, kostenlose Ausbildungsmittel stellen, für Berufsschule und Prüfungen freistellen, nur ausbildungsbezogene Aufgaben übertragen, den Ausbildungsnachweis durchsehen, eine angemessene Vergütung zahlen und ein Zeugnis ausstellen.

### Beispiel
Die Möbelhaus Nordholz GmbH bildet Fachinformatiker für Daten- und Prozessanalyse aus; der Azubi Jonas arbeitet im Projekt „Reparatur-Dashboard“ mit und besucht an zwei Tagen pro Woche die Berufsschule.

### Abgrenzung
| Beteiligter | Aufgabe |
|---|---|
| Ausbildungsbetrieb | praktische Ausbildung nach Ausbildungsordnung |
| Berufsschule | Fachtheorie und Allgemeinbildung nach Rahmenlehrplan |
| IHK | überwacht, berät, führt Verzeichnis, nimmt Prüfungen ab |

### Prüfungsfalle
Dem Betrieb die Abnahme der Prüfung oder den Erlass der Ausbildungsordnung zuschreiben.

### Merksatz
Betrieb lehrt die Praxis, Schule die Theorie, die IHK prüft.

Siehe auch: Ausbildungsordnung · Berufsschule · IHK · Duale Ausbildung · BBiG
Mehr: Deep Dive 13, 1.1 · Deep Dive 13, 1.3

## Ausbildungsnachweis
<!-- id: ausbildungsnachweis · quellen: Karte DD13, DD13 1.3 · stand: 2026-10 -->

Schriftlich oder elektronisch geführtes Berichtsheft der Auszubildenden; Pflicht während der Ausbildung und Zulassungsvoraussetzung zur Abschlussprüfung (§ 43 BBiG).

### Erklärung
Auszubildende müssen den Nachweis führen (§ 13 BBiG); Ausbildende müssen dazu anhalten, ihn regelmäßig durchsehen und das Führen während der Ausbildungszeit ermöglichen (§ 14 BBiG). Die Form (schriftlich oder elektronisch) steht im Ausbildungsvertrag. Ohne geführten Ausbildungsnachweis keine Zulassung zur Abschlussprüfung.

### Beispiel
Jonas trägt wöchentlich ein, was er im Betrieb gelernt hat („ETL-Strecke für Reparaturaufträge mit SQL getestet“) und welche Themen die Berufsschule behandelt hat; seine Ausbilderin zeichnet monatlich ab.

### Abgrenzung
Der Ausbildungsnachweis dokumentiert die Ausbildung; die **Projektdokumentation** der AP2 dokumentiert das betriebliche Projekt.

### Prüfungsfalle
Den Ausbildungsnachweis für eine freiwillige Lernhilfe halten – er ist Pflicht und Zulassungsvoraussetzung.

### Merksatz
Ohne Berichtsheft keine Prüfung.

Siehe auch: Ausbildungsbetrieb · BBiG · Prüfungsausschuss · IHK
Mehr: Deep Dive 13, 1.3

## Ausbildungsordnung
<!-- id: ausbildungsordnung · quellen: Karte DD13, DD13 1.1 · stand: 2026-10 -->

Rechtsverordnung des zuständigen Bundesministeriums, die Bezeichnung, Dauer, Inhalte und Prüfungsanforderungen eines Ausbildungsberufs festlegt – nicht von der IHK erlassen.

### Erklärung
Erlassen wird sie vom zuständigen Fachministerium (bei IT-Berufen dem Bundeswirtschaftsministerium) im Einvernehmen mit dem für Berufsbildung zuständigen Bundesministerium (§§ 4, 5 BBiG). Sie enthält u. a. die Ausbildungsdauer, das **Ausbildungsberufsbild**, den **Ausbildungsrahmenplan** (sachliche und zeitliche Gliederung für den Betrieb) und die Prüfungsanforderungen. Für Fachinformatiker gilt die Verordnung von 2020 mit der Fachrichtung Daten- und Prozessanalyse.

### Beispiel
Dass die AP2 der Fachrichtung Daten- und Prozessanalyse aus einer betrieblichen Projektarbeit mit Fachgespräch und schriftlichen Prüfungsbereichen wie „Durchführen einer Prozessanalyse“ und „Sicherstellen der Datenqualität“ besteht, steht in der Ausbildungsordnung.

### Abgrenzung
Der **Rahmenlehrplan** der Kultusministerkonferenz regelt den Unterricht der Berufsschule; die Ausbildungsordnung die betriebliche Ausbildung und die Prüfung. Die IHK überwacht und prüft nur.

### Prüfungsfalle
„Die IHK erlässt die Ausbildungsordnung“ – klassische falsche MC-Antwort.

### Merksatz
Das Ministerium verordnet, der Betrieb bildet aus, die IHK prüft.

Siehe auch: BBiG · Ausbildungsbetrieb · Rahmenlehrplan · IHK · Duale Ausbildung
Mehr: Deep Dive 13, 1.1

## Auslastung
<!-- id: auslastung · quellen: Karte DD5, DD5 3.2 · stand: 2026-10 -->

Prozesskennzahl für den Ressourceneinsatz: $\text{Auslastung} = \frac{\text{genutzte Kapazität}}{\text{verfügbare Kapazität}} \cdot 100\ \%$.

### Erklärung
Die Auslastung zeigt, wie stark Personal, Maschinen oder Systeme beansprucht sind. Zu niedrige Auslastung bedeutet ungenutzte, bezahlte Kapazität. Zu hohe Auslastung (nahe 100 %) ist ebenso problematisch: Jede Schwankung erzeugt Warteschlangen, die Liegezeiten und damit die Durchlaufzeit steigen stark an. Ziel ist eine hohe, aber nicht maximale Auslastung mit Puffer.

### Beispiel
Die Werkstatt hat im Monat 4 Techniker · 160 Stunden = 640 Stunden verfügbar, davon wurden 544 Stunden für Reparaturen genutzt: $\frac{544}{640} \cdot 100 = 85\ \%$.

### Abgrenzung
Die **Verfügbarkeit** misst, wie lange ein System nutzbar war; die Auslastung, wie stark die vorhandene Kapazität genutzt wurde. Der **Wertschöpfungsanteil** bezieht die Bearbeitungszeit auf die Durchlaufzeit eines Falls.

### Prüfungsfalle
100 % Auslastung als Ziel ausgeben – das verlängert Wartezeiten und macht den Prozess störanfällig.

### Merksatz
Gut ausgelastet ist nicht voll ausgelastet.

Siehe auch: Durchlaufzeit · Liegezeit · Fehlerquote · Termintreue · KPI
Mehr: Deep Dive 5, 3.2

## Ausreißer
<!-- id: ausreisser · quellen: Karte DD3, DD3 5.2, DD3 5.3, DD4 1.1, DD6 Teil 5 · stand: 2026-10 -->

Wert weit abseits der übrigen Daten – ein Erfassungsfehler oder ein echter Extremfall; die Ursache wird geklärt und die Entscheidung begründet dokumentiert.

### Erklärung
Erkannt werden Ausreißer z. B. mit der **1,5-IQR-Regel** (außerhalb von $Q_1 - 1{,}5 \cdot \text{IQR}$ bzw. $Q_3 + 1{,}5 \cdot \text{IQR}$), im Boxplot als Einzelpunkte, im Streudiagramm als Punkte abseits der Wolke oder über die z-Werte. Umgang in drei Schritten: Ursache klären (Komma verrutscht, Einheit verwechselt oder echter Großauftrag), entscheiden und dokumentieren (korrigieren, belassen, gesondert auswerten, ausschließen), Auswirkung prüfen (Analyse mit und ohne Ausreißer). Ausreißer verzerren Mittelwert, Standardabweichung, Korrelation, Regression und Min-Max-Normalisierung.

### Beispiel
Lieferzeiten 2, 3, 3, 4, 5, 5, 5, 6, 8, 19 Tage: Q1 = 3, Q3 = 6, IQR = 3, oberer Zaun $6 + 4{,}5 = 10{,}5$ → 19 ist Ausreißer. Mittelwert mit 19: 6,0 Tage, ohne: rund 4,56 Tage.

### Abgrenzung
Ein **Platzhalterwert** (z. B. Geburtsdatum 01.01.1900) ist kein echter Extremwert, sondern ein Datenqualitätsproblem. Der **Median** ist gegen Ausreißer robust, das Mittel nicht.

### Prüfungsfalle
Ausreißer ungeprüft löschen – in der Prozessanalyse sind sie oft genau das Problem, das man finden will.

### Merksatz
Erst verstehen, dann entscheiden, dann dokumentieren – nie blind löschen.

Siehe auch: Boxplot · Interquartilsabstand (IQR) · Median · Platzhalterwert · Z-Wert
Mehr: Deep Dive 3, 5.2 · Deep Dive 3, 5.3 · Deep Dive 4, 1.1 · Deep Dive 6, Teil 5

## Außerordentliche Kündigung
<!-- id: ausserordentliche-kundigung · quellen: Karte DD13, DD13 3.2 · stand: 2026-10 -->

Fristlose Kündigung aus wichtigem Grund, die binnen zwei Wochen nach Kenntnis der Gründe erklärt werden muss (§ 626 BGB); bei Fehlverhalten meist erst nach vorheriger Abmahnung.

### Erklärung
Ein **wichtiger Grund** liegt vor, wenn dem Kündigenden die Fortsetzung bis zum Ablauf der Kündigungsfrist unter Abwägung aller Umstände nicht zuzumuten ist – z. B. Diebstahl, Arbeitszeitbetrug, beharrliche Arbeitsverweigerung, Tätlichkeit. Die Zwei-Wochen-Frist beginnt mit der Kenntnis der maßgeblichen Tatsachen. Schriftform (§ 623 BGB) und Anhörung des Betriebsrats (Bedenken binnen drei Tagen) gelten auch hier; den Grund muss der Kündigende auf Verlangen schriftlich mitteilen. Auch Arbeitnehmer können außerordentlich kündigen, etwa bei ausbleibendem Lohn.

### Beispiel
Am 02.03.2026 erfährt die Personalleitung, dass ein Mitarbeiter Waren aus dem Lager entwendet hat. Die Kündigung muss ihm bis 16.03.2026 zugehen.

### Abgrenzung
Die **ordentliche Kündigung** beendet das Arbeitsverhältnis mit Frist und braucht bei Geltung des KSchG einen personen-, verhaltens- oder betriebsbedingten Grund. Im Ausbildungsverhältnis ist nach der Probezeit für den Betrieb nur noch die außerordentliche Kündigung möglich (§ 22 BBiG).

### Prüfungsfalle
Die Zwei-Wochen-Frist ab dem Vorfall statt ab Kenntnis berechnen.

### Merksatz
Wichtiger Grund, zwei Wochen ab Kenntnis, schriftlich.

Siehe auch: Ordentliche Kündigung · Abmahnung · Anhörung · Schriftform · Kündigungsschutzgesetz
Mehr: Deep Dive 13, 3.2

## Aussperrung
<!-- id: aussperrung · quellen: Karte DD13, DD13 5.4 · stand: 2026-10 -->

Arbeitskampfmittel der Arbeitgeber: Beschäftigte werden planmäßig von der Arbeit ausgeschlossen, der Lohn entfällt.

### Erklärung
Die Aussperrung ist das Gegenstück zum Streik und gehört zur Tarifautonomie (Art. 9 Abs. 3 GG). Nach der Rechtsprechung des Bundesarbeitsgerichts ist sie vor allem als **Abwehraussperrung** gegen einen Streik zulässig und muss verhältnismäßig sein. Ausgesperrte erhalten keinen Lohn; Gewerkschaftsmitglieder bekommen Unterstützung von ihrer Gewerkschaft, die Agentur für Arbeit zahlt wegen ihrer Neutralitätspflicht kein Arbeitslosengeld. Nach dem Arbeitskampf leben die Arbeitsverhältnisse wieder auf.

### Beispiel
Die Gewerkschaft ruft in einigen Betrieben einer Branche zu Schwerpunktstreiks auf. Die Arbeitgeber sperren daraufhin auch Beschäftigte weiterer Betriebe aus, um den Druck auf die Gewerkschaftskasse zu erhöhen.

### Abgrenzung
**Streik** ist das Kampfmittel der Gewerkschaft; die Aussperrung das der Arbeitgeber. Beide sind nur während laufender Tarifverhandlungen nach Ende der **Friedenspflicht** zulässig.

### Prüfungsfalle
Aussperrung mit Kündigung gleichsetzen – das Arbeitsverhältnis ruht nur.

### Merksatz
Streik von unten, Aussperrung von oben – in beiden Fällen ruht der Lohn.

Siehe auch: Streik · Tarifautonomie · Friedenspflicht · Tarifvertrag
Mehr: Deep Dive 13, 5.4

## Auswahl des Zeitausschnitts
<!-- id: auswahl-des-zeitausschnitts · quellen: DD11 A3 · stand: 2026-10 -->

Manipulationstechnik bei Zeitreihen: Ein günstig gewählter Start- oder Endpunkt lässt einen Rückgang als Anstieg erscheinen oder umgekehrt.

### Erklärung
Jede Zeitreihe hat Schwankungen. Wer den Ausschnitt so wählt, dass er in einem Tief beginnt und in einem Hoch endet, zeigt ein Wachstum, das über den ganzen Zeitraum nicht besteht. Gegenmittel: den fachlich passenden, vollständigen Zeitraum zeigen, Vorjahresvergleiche über gleiche Monate ziehen, saisonale Muster berücksichtigen und den gewählten Ausschnitt begründen.

### Beispiel
Monatsumsatz eines Jahres: Januar 520 T€, März 410 T€ (Tief), Dezember 500 T€. Ein Diagramm „März bis Dezember“ zeigt $\frac{500 - 410}{410} \approx +22\ \%$; über das ganze Jahr ist der Umsatz von 520 auf 500 T€ um rund 3,8 % gesunken.

### Abgrenzung
Die **abgeschnittene Achse** verzerrt die Höhe, die Auswahl des Zeitausschnitts verzerrt die Breite – beide bei korrekten Zahlen.

### Prüfungsfalle
In der Diagrammbeurteilung nur die Achse prüfen und den Zeitraum übersehen.

### Merksatz
Wer den Start wählt, wählt den Trend.

Siehe auch: Abgeschnittene Achse · Lügenfaktor · Liniendiagramm · Datenintegrität in Diagrammen · Zeitreihe
Mehr: Deep Dive 11, A3

## Auswahllisten
<!-- id: auswahllisten · quellen: Karte DD9, DD9 5.1 · stand: 2026-10 -->

Präventive Datenqualitätsmaßnahme: Vorgegebene Werte statt Freitext verhindern uneinheitliche Schreibweisen bei der Erfassung.

Auch: Auswahllisten statt Freitext

### Erklärung
Freitext erzeugt Varianten („Köln“, „Koeln“, „Köln “), die Gruppierungen, Zählungen und Joins verfälschen. Eine Auswahlliste (Dropdown, Referenztabelle mit Fremdschlüssel) erlaubt nur gültige Werte und sichert damit Gültigkeit und Konsistenz schon an der Quelle. Die Liste selbst muss gepflegt werden (Verantwortlicher, z. B. Data Steward); ein Eintrag „Sonstiges“ sollte selten genutzt und regelmäßig ausgewertet werden.

### Beispiel
Im Reparaturauftrag wird der Reklamationsgrund nicht mehr frei eingetippt, sondern aus „Transportschaden, Montagefehler, Falschlieferung, Materialfehler, Sonstiges“ gewählt. Die Pareto-Auswertung der Gründe braucht danach keine Bereinigung mehr.

### Abgrenzung
| Maßnahme | wirkt |
|---|---|
| Auswahlliste | einheitliche Werte |
| Pflichtfeld (NOT NULL) | Vollständigkeit |
| CHECK / Wertebereich | gültige Zahlenbereiche |
| Formatprüfung | korrektes Muster (PLZ, IBAN) |

### Prüfungsfalle
Datenqualität nur durch nachträgliche Bereinigung sichern wollen – Prävention an der Erfassung ist die bessere Antwort.

### Merksatz
Was man auswählt, kann man nicht vertippen.

Siehe auch: Prävention · Pflichtfelder · Formatprüfung · Konsistenz · Wertebereichsprüfung (CHECK)
Mehr: Deep Dive 9, 5.1

## Authentifizierung
<!-- id: authentifizierung · quellen: Karte DD10, DD10 4.3 · stand: 2026-10 -->

Prüfung der Identität („Wer bist du?“) über Wissen, Besitz oder Sein; die Mehr-Faktor-Authentifizierung kombiniert mindestens zwei verschiedene Kategorien.

### Erklärung
Faktoren: **Wissen** (Passwort, PIN), **Besitz** (Smartphone, Token, Chipkarte), **Sein** (Fingerabdruck, Gesichtserkennung). Ein einzelner Faktor kann gestohlen oder erraten werden; MFA erhöht die Hürde erheblich. Passwörter werden nie im Klartext, sondern mit Salt und einem langsamen Hashverfahren gespeichert. Erst nach erfolgreicher Authentifizierung prüft das System die Rechte (**Autorisierung**).

### Beispiel
Die Anmeldung am Reporting-Portal des Möbelhauses verlangt Passwort (Wissen) und einen Code aus der Authenticator-App (Besitz) – das ist MFA.

### Abgrenzung
| Begriff | Frage | Beispiel |
|---|---|---|
| Authentifizierung | Wer bist du? | Passwort + App-Code |
| Autorisierung | Was darfst du? | Rolle „Werkstattleitung“ darf Kosten sehen |

Bei Web-APIs signalisiert **401** fehlende Authentifizierung, **403** fehlende Berechtigung.

### Prüfungsfalle
Passwort plus Sicherheitsfrage als MFA bezeichnen – beides ist Wissen.

### Merksatz
Erst „wer“, dann „was“ – und mindestens zwei verschiedene Faktoren.

Siehe auch: Autorisierung · Mehr-Faktor-Authentifizierung · RBAC · Hashing · Authentifizierung an APIs
Mehr: Deep Dive 10, 4.3

## Authentifizierung an APIs
<!-- id: authentifizierung-an-apis · quellen: DD15 3.3 · stand: 2026-10 -->

Verfahren, mit denen sich Anwendungen oder Nutzer gegenüber einer Web-API ausweisen – vor allem API-Schlüssel, Basic Auth, OAuth 2.0 und JWT.

### Erklärung
| Verfahren | Prinzip | Bewertung |
|---|---|---|
| **API-Schlüssel** | fester geheimer Schlüssel je Anwendung im Header | einfach; identifiziert nur die Anwendung |
| **Basic Auth** | Benutzername und Passwort Base64-kodiert im Header | Base64 ist keine Verschlüsselung – nur mit HTTPS |
| **OAuth 2.0** | Autorisierungsserver stellt nach Zustimmung ein zeitlich begrenztes Access Token mit Scopes aus | Standard für delegierten Zugriff, Passwort bleibt geheim |
| **JWT** | signiertes Token aus Header, Claims, Signatur | signiert, nicht verschlüsselt; Ablaufzeit prüfen |

Für alle gilt: nur über HTTPS, Zugangsdaten im `Authorization`-Header statt in der URL. Die Anmeldung des Nutzers selbst regelt bei OAuth der Zusatz OpenID Connect.

### Beispiel
Die Filial-App holt sich nach der Anmeldung des Mitarbeiters ein Access Token mit dem Scope „reparatur:lesen“ und sendet es als `Authorization: Bearer …` bei jeder Anfrage mit; nach einer Stunde läuft es ab.

### Abgrenzung
Diese Verfahren klären, wer anfragt (Authentifizierung) und mit welchen Rechten (Scopes, Autorisierung). Verschlüsselt wird die Übertragung durch TLS, nicht durch das Verfahren.

### Prüfungsfalle
Ein JWT für verschlüsselt halten und vertrauliche Daten hineinschreiben – jeder kann den Inhalt lesen.

### Merksatz
HTTPS immer, Geheimnis in den Header, Token mit Ablaufzeit.

Siehe auch: API-Schlüssel · OAuth 2.0 · JWT · Basic Auth · Nur HTTPS
Mehr: Deep Dive 15, 3.3

## Autocommit
<!-- id: autocommit · quellen: Karte DD1, DD1 3.5 · stand: 2026-10 -->

Standardmodus vieler Datenbanksysteme: Jede Anweisung wird sofort als eigene Transaktion festgeschrieben; ein späteres ROLLBACK greift nicht mehr.

### Erklärung
Im Autocommit-Modus endet jede einzelne INSERT-, UPDATE- oder DELETE-Anweisung mit einem impliziten COMMIT. Sollen mehrere Anweisungen gemeinsam gelingen oder scheitern, muss man sie ausdrücklich mit `BEGIN TRANSACTION` (MySQL: `START TRANSACTION`) … `COMMIT` bzw. `ROLLBACK` klammern. MySQL, PostgreSQL und SQL Server arbeiten standardmäßig mit Autocommit; Werkzeuge und Datenbanken unterscheiden sich, deshalb vor kritischen Änderungen prüfen.

### Beispiel
```sql
UPDATE produkt SET preis = preis * 1.10;   -- versehentlich ohne WHERE
ROLLBACK;                                   -- wirkungslos im Autocommit
```
Mit vorangestelltem `BEGIN TRANSACTION;` hätte das ROLLBACK die Preiserhöhung zurückgenommen.

### Abgrenzung
Eine **Transaktion** mit BEGIN … COMMIT bündelt mehrere Anweisungen nach dem ACID-Prinzip; Autocommit macht jede Anweisung zu einer eigenen Mini-Transaktion.

### Prüfungsfalle
Annehmen, ROLLBACK mache die letzte Anweisung immer rückgängig.

### Merksatz
Ohne BEGIN ist jede Anweisung sofort endgültig.

Siehe auch: Transaktion · ACID · DML · DELETE
Mehr: Deep Dive 1, 3.5

## Automatische Übernahme
<!-- id: automatische-ubernahme · quellen: DD9 5.1 · stand: 2026-10 -->

Präventive Datenqualitätsmaßnahme: Daten werden über Schnittstellen aus dem führenden System übernommen, statt sie über Systemgrenzen hinweg mehrfach von Hand zu erfassen.

### Erklärung
Jede manuelle Mehrfacherfassung ist eine Fehlerquelle: Tippfehler, abweichende Schreibweisen, vergessene Änderungen. Wird der Wert nur einmal im führenden System gepflegt und automatisch weitergegeben (Schnittstelle, ETL, Master Data Management), bleiben die Systeme konsistent. Zugleich entfällt die Lean-Verschwendung „Überbearbeitung“ (dieselben Daten in mehreren Systemen pflegen).

### Beispiel
Bisher tippt die Serviceannahme die Kundendaten aus dem ERP noch einmal in die Werkstatt-App. Nach der Umstellung holt die App sie per API aus dem ERP; Adressänderungen kommen automatisch an.

### Abgrenzung
**Master Data Management** regelt organisatorisch, welches System für eine Stammdatenart führend ist; die automatische Übernahme ist die technische Umsetzung des Datenflusses.

### Prüfungsfalle
Nach einer Dublettenbereinigung die Doppelerfassung bestehen lassen – dann entstehen die Fehler neu.

### Merksatz
Einmal erfassen, überall verwenden.

Siehe auch: Master Data Management · Prävention · Konsistenz · Schnittstelle · Auswahllisten
Mehr: Deep Dive 9, 5.1

## Autorisierung
<!-- id: autorisierung · quellen: Karte DD10, DD10 4.3 · stand: 2026-10 -->

Prüfung der Rechte („Was darfst du?“) nach erfolgreicher Authentifizierung.

### Erklärung
Die Autorisierung entscheidet, auf welche Daten und Funktionen eine bereits identifizierte Person oder Anwendung zugreifen darf. Grundsätze: **Least Privilege** (so wenig Rechte wie möglich), **Need-to-know** (nur fachlich Erforderliches), **Funktionstrennung** (Anlegen und Freigeben trennen). Umgesetzt wird sie meist rollenbasiert (**RBAC**): Rechte hängen an Rollen, Personen erhalten Rollen. In Datenbanken regelt `GRANT`/`REVOKE` die Rechte, Views begrenzen Spalten und Zeilen.

### Beispiel
Jonas ist im Reporting-Portal angemeldet (authentifiziert). Seine Rolle „Analyst Werkstatt“ erlaubt Lesezugriff auf Reparaturdaten ohne Personalkosten; die Seite mit Gehaltsdaten liefert ihm den Status 403.

### Abgrenzung
**Authentifizierung** klärt die Identität, Autorisierung die Rechte. HTTP-Status 401 = nicht authentifiziert, 403 = authentifiziert, aber nicht berechtigt.

### Prüfungsfalle
401 und 403 vertauschen.

### Merksatz
Authentifizierung: wer? Autorisierung: was darf er?

Siehe auch: Authentifizierung · RBAC · Least Privilege · Need-to-know · Funktionstrennung
Mehr: Deep Dive 10, 4.3

## AVG ignoriert NULL
<!-- id: avg-ignoriert-null · quellen: DD1 3.1, DD1 1.5 · stand: 2026-10 -->

SQL-Regel: Die Aggregatfunktion `AVG` übergeht NULL-Werte und teilt nur durch die Anzahl der vorhandenen Werte.

### Erklärung
Wie SUM, MIN, MAX und COUNT(spalte) ignoriert AVG alle NULL-Werte. Das ist richtig, wenn NULL „unbekannt“ bedeutet und unbekannte Werte nicht als 0 zählen sollen – aber falsch, wenn fehlende Einträge fachlich 0 bedeuten. Dann ersetzt man sie mit `COALESCE(x, 0)`. Welche Variante stimmt, ist eine fachliche Entscheidung, die man dokumentiert.

### Beispiel
Werte 10, NULL, 20:
- `AVG(x)` = $\frac{10 + 20}{2} = 15$
- `AVG(COALESCE(x, 0))` = $\frac{10 + 0 + 20}{3} = 10$
- `COUNT(*)` = 3, `COUNT(x)` = 2 → ein fehlender Wert

### Abgrenzung
`COUNT(*)` zählt alle Zeilen, auch solche mit NULL; `COUNT(spalte)` nur die vorhandenen Werte. Rechnen mit NULL (`preis + NULL`) ergibt dagegen NULL.

### Prüfungsfalle
In einer Ergebnisaufgabe durch die Gesamtzahl der Zeilen teilen.

### Merksatz
AVG zählt nur, was da ist.

Siehe auch: NULL · COALESCE · Rechnen mit NULL · Fehlende Werte
Mehr: Deep Dive 1, 3.1 · Deep Dive 1, 1.5

## Avro
<!-- id: avro · quellen: Karte DD15, DD15 2.4 · stand: 2026-10 -->

Binäres, zeilenorientiertes Datenformat mit mitgeliefertem Schema (in JSON definiert) und Schema-Evolution – typisch für Datenströme, z. B. mit Apache Kafka.

### Erklärung
Avro speichert Datensätze kompakt binär; das Schema beschreibt Felder und Datentypen und wird mitgeliefert oder zentral (Schema Registry) verwaltet. **Schema-Evolution** heißt: Felder können z. B. mit Standardwert hinzukommen, ohne dass ältere Leser oder Schreiber scheitern. Weil Avro zeilenorientiert ist, eignet es sich zum Schreiben und Übertragen einzelner Datensätze.

### Beispiel
Jede Kassenbuchung der Filialen wird als Avro-Nachricht in einen Kafka-Datenstrom geschrieben; später ergänzt man das Feld `gutschein_code` mit Standardwert NULL, ohne bestehende Verarbeitungen anzupassen.

### Abgrenzung
| Format | Speicherung | typischer Einsatz |
|---|---|---|
| CSV | Text, flach, ohne Typen | Excel-Austausch |
| JSON | Text, verschachtelt | Web-APIs |
| Avro | binär, zeilenorientiert, mit Schema | Datenströme |
| Parquet | binär, spaltenorientiert, komprimiert | Analysen im Data Lake |

### Prüfungsfalle
Avro und Parquet verwechseln: Avro schreibt Datensätze (zeilenweise), Parquet wertet Spalten aus.

### Merksatz
Avro zum Übertragen, Parquet zum Auswerten.

Siehe auch: Parquet · JSON · CSV · Schema · YAML
Mehr: Deep Dive 15, 2.4

## Ausgelassen
- Absolute Formulierungen prüfen – Prüfungstaktik WiSo
- Andere Schnittstellenstile im Vergleich – Abschnittstitel
- Auswahlbegründung in Prüfungen – Prüfungstipp Vorgehensmodelle
- Auswirkung prüfen – Teilschritt Ausreißerbehandlung
