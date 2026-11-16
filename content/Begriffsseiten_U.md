<!-- Begriffsseiten U · Stand 2026-10 -->
## Übergangsbereich (Midijob)
<!-- id: ubergangsbereich · quellen: DD14 1.3 · stand: 2026-10 -->

Entgeltbereich von 603,01 € bis 2.000 € im Monat (Stand 2026), in dem Beschäftigte voll sozialversichert sind, aber nur reduzierte, gleitend ansteigende Arbeitnehmerbeiträge zahlen.

### Erklärung
Der Übergangsbereich schließt an die Minijob-Grenze an und soll den „Sprung“ von abgabenfreiem Minijob zu vollen Beiträgen glätten. Der Arbeitgeber zahlt stets seinen vollen Anteil; der Arbeitnehmeranteil wird über eine Formel aus einer reduzierten Bemessungsgrundlage berechnet und erreicht erst bei 2.000 € den regulären Anteil. Die Untergrenze wandert mit dem Mindestlohn: 2026 liegt die Minijob-Grenze bei 603 € (Mindestlohn 13,90 €), ab 2027 bei 633 € (Stand 2026). Die Rentenansprüche werden trotzdem aus dem vollen Entgelt berechnet.

### Beispiel
Herr Kaya arbeitet in Teilzeit im Lager des Möbelhauses Nordholz für 1.100 € brutto: Midijob – volle Versicherungspflicht, aber geringerer Arbeitnehmeranteil als bei regulärer Beschäftigung.

### Abgrenzung
| Entgelt (2026) | Regel |
|---|---|
| bis 603 € | Minijob: AN nur RV-Eigenanteil 3,6 %, AG Pauschalabgaben |
| 603,01 € bis 2.000 € | Übergangsbereich: reduzierter AN-Anteil |
| über 2.000 € | volle Beiträge je zur Hälfte |

### Prüfungsfalle
Für Auszubildende gilt der Übergangsbereich nicht: Bis 325 € trägt der Arbeitgeber alles (Geringverdienergrenze), darüber zahlen sie sofort den vollen Arbeitnehmeranteil.

### Merksatz
Midijob = volle Versicherung, gedämpfter Arbeitnehmerbeitrag – aber nie für Azubis.

Siehe auch: Minijob · Geringverdienergrenze · Mindestlohn · Beitragsbemessungsgrenze
Mehr: Deep Dive 14, 1.3

## Übergangsstelle
<!-- id: ubergangsstelle · quellen: DD17 4.1, DD11 B3 · stand: 2026-10 -->

PAP-Symbol (Kreis, Konnektor) nach DIN 66001, das Teile eines Programmablaufplans über Seiten- oder Spaltengrenzen hinweg verbindet.

### Erklärung
Passt ein Programmablaufplan nicht auf eine Seite, wird die Ablauflinie an einer Übergangsstelle unterbrochen und an einer zweiten Übergangsstelle mit derselben Beschriftung fortgesetzt. So bleiben große Pläne lesbar, ohne dass lange Linien kreuz und quer laufen. Logisch gehören beide Kreise zu einem einzigen Punkt im Ablauf.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 110" width="300" height="110" role="img" aria-label="Übergangsstelle im PAP: Kreis mit Beschriftung A auf zwei Seiten">
<defs><marker id="ubergangsstelle-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<text x="70" y="12" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Seite 1</text>
<line x1="70" y1="22" x2="70" y2="62" class="dg-linie" marker-end="url(#ubergangsstelle-pfeil)"/>
<circle cx="70" cy="78" r="16" class="dg-form"/>
<text x="70" y="78" text-anchor="middle" dominant-baseline="middle" class="dg-fett">A</text>
<text x="230" y="12" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Seite 2</text>
<circle cx="230" cy="40" r="16" class="dg-form"/>
<text x="230" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-fett">A</text>
<line x1="230" y1="56" x2="230" y2="100" class="dg-linie" marker-end="url(#ubergangsstelle-pfeil)"/>
</svg>
```

### Abgrenzung
Der Kreis ist kein Start- oder Endsymbol – dafür steht das abgerundete Rechteck (Grenzstelle). Im Struktogramm gibt es keine Übergangsstellen, weil es keine freien Ablauflinien kennt.

### Prüfungsfalle
Übergangsstellen ohne identische Beschriftung zeichnen – dann ist nicht erkennbar, wo es weitergeht.

### Merksatz
Gleicher Buchstabe im Kreis = gleiche Stelle im Ablauf.

Siehe auch: Programmablaufplan · Unterprogramm · Struktogramm · Konnektor
Mehr: Deep Dive 17, 4.1 · Deep Dive 11, B3

## Überwachtes Lernen
<!-- id: uberwachtes-lernen · quellen: Karte DD6, DD6 2.2 · stand: 2026-10 -->

Lernart des Machine Learning, bei der ein Modell aus Daten mit bekannter Zielvariable (Label) lernt, um sie für neue Fälle vorherzusagen.

### Erklärung
Die Trainingsdaten enthalten zu jedem Datensatz die „richtige Antwort“, z. B. „Reklamation ja/nein“. Das Verfahren sucht eine Regel, die von den Merkmalen auf das Label schließt, und wird an zurückgehaltenen Testdaten geprüft. Ist die Zielvariable eine Kategorie, spricht man von **Klassifikation** (Entscheidungsbaum, k-NN, logistische Regression), ist sie eine Zahl, von **Regression** (lineare Regression).

### Beispiel
Das Möbelhaus Nordholz hat 5.000 abgeschlossene Aufträge mit dem Feld „reklamiert“. Ein Entscheidungsbaum lernt daraus, welche neuen Aufträge reklamationsgefährdet sind.

### Abgrenzung
| Lernart | Labels | Zweck |
|---|---|---|
| überwacht | ja | Vorhersage |
| unüberwacht | nein | Strukturen finden (Clustering) |
| bestärkend | Belohnung/Strafe | Handlungsstrategie |

### Prüfungsfalle
Die logistische Regression ist trotz des Namens ein Klassifikationsverfahren – und k-NN (überwacht) nicht mit k-Means (unüberwacht) verwechseln.

### Merksatz
Gibt es eine Spalte mit der richtigen Antwort, ist es überwachtes Lernen.

Siehe auch: Unüberwachtes Lernen · Klassifikation · Regression · Regressionskoeffizient · Zielvariable · Validierungsdaten
Mehr: Deep Dive 6, 2.2 · Deep Dive 6, 2.3

## UG (haftungsbeschränkt)
<!-- id: ug · quellen: Karte DD14, DD14 3.2 · stand: 2026-10 -->

Unternehmergesellschaft: Sonderform der GmbH („Mini-GmbH“), die schon mit 1 € Stammkapital gegründet werden kann und Gewinne teilweise thesaurieren muss (§ 5a GmbHG).

### Erklärung
Wie bei der GmbH haftet nur das Gesellschaftsvermögen; geleitet wird sie vom Geschäftsführer, eingetragen in Abteilung B des Handelsregisters. Weil kaum Kapital vorhanden ist, schreibt das Gesetz eine **Rücklage** vor: Jährlich ist ein Viertel des Jahresüberschusses (abzüglich Verlustvortrag) einzustellen. Hat die UG ihr Stammkapital auf mindestens 25.000 € erhöht, darf sie sich in eine GmbH umfirmieren und die Rücklagenpflicht entfällt. Der Zusatz „UG (haftungsbeschränkt)“ ist Pflicht und darf nicht abgekürzt werden.

### Beispiel
Eine UG erzielt 8.000 € Jahresüberschuss ohne Verlustvortrag: $8.000 \cdot 0{,}25 = 2.000$ € müssen in die Rücklage, nur 6.000 € dürfen ausgeschüttet werden.

### Abgrenzung
| | UG | GmbH |
|---|---|---|
| Mindestkapital | 1 € | 25.000 € |
| Rücklagenpflicht | 25 % des Überschusses | nein |
| Haftung | Gesellschaftsvermögen | Gesellschaftsvermögen |

### Prüfungsfalle
Die UG ist keine eigene Rechtsform neben der GmbH, sondern eine GmbH-Variante – und „haftungsbeschränkt“ heißt nicht, dass Gründer bei Pflichtverletzungen nie persönlich haften.

### Merksatz
1 € reicht zum Start, aber ein Viertel jedes Gewinns bleibt in der Firma.

Siehe auch: GmbH · AG · Handelsregister
Mehr: Deep Dive 14, 3.2

## UML
<!-- id: uml · quellen: Karte DD15, DD17 2.1 · stand: 2026-10 -->

Unified Modeling Language: von der OMG standardisierte grafische Sprache zur Modellierung von Software und Systemen mit 14 Diagrammarten.

### Erklärung
UML teilt ihre Diagramme in **Strukturdiagramme** (was es gibt: Klassen-, Objekt-, Komponenten-, Verteilungsdiagramm) und **Verhaltensdiagramme** (was passiert: Use-Case-, Aktivitäts-, Zustands- und Interaktionsdiagramme wie das Sequenzdiagramm). Aktuelle Version ist UML 2.5.1 (Stand 2026). Für die FIDPA-Prüfung reichen fünf Diagramme: Use-Case-, Klassen-, Aktivitäts-, Sequenz- und Zustandsdiagramm.

### Beispiel
| Frage im Reparaturservice | Diagramm |
|---|---|
| Wer nutzt das neue Auftragsportal wofür? | Use-Case-Diagramm |
| Welche Klassen und Beziehungen hat der Reparaturauftrag? | Klassendiagramm |
| Wie läuft die Auftragsannahme ab? | Aktivitätsdiagramm |
| Welche Nachrichten tauschen Filiale, API und Datenbank? | Sequenzdiagramm |
| Welche Status durchläuft ein Auftrag? | Zustandsdiagramm |

### Abgrenzung
BPMN modelliert Geschäftsprozesse mit mehreren Beteiligten, das ERM Datenstrukturen für Datenbanken; UML zielt auf Software und Systeme.

### Prüfungsfalle
Das Use-Case-Diagramm zeigt keinen Ablauf – wer Reihenfolgen einzeichnet, wählt das falsche Diagramm.

### Merksatz
Erst die Frage, dann das Diagramm: Wer – Was – Wie – Wann – Welcher Zustand.

Siehe auch: Use-Case-Diagramm · Klassendiagramm · Aktivitätsdiagramm · Sequenzdiagramm · Zustandsdiagramm
Mehr: Deep Dive 17, 2.1 · Deep Dive 15, 5.1

## Umlageverfahren
<!-- id: umlageverfahren · quellen: Karte DD14, DD14 1.1 · stand: 2026-10 -->

Finanzierungsprinzip der gesetzlichen Rentenversicherung („Generationenvertrag“): Die Beiträge der heute Erwerbstätigen finanzieren direkt die laufenden Renten.

### Erklärung
Es wird kein Kapital für den Einzelnen angespart; was eingezahlt wird, fließt im selben Zeitraum an die Rentner ab. Wer heute zahlt, erwirbt Ansprüche, die später von der nächsten Generation finanziert werden. Das System ist unabhängig von Kapitalmärkten, aber abhängig vom Verhältnis zwischen Beitragszahlern und Rentnern – der demografische Wandel belastet es, deshalb gibt es Bundeszuschüsse und die ergänzende betriebliche und private Vorsorge.

### Abgrenzung
| | Umlageverfahren | Kapitaldeckungsverfahren |
|---|---|---|
| Prinzip | heutige Beiträge → heutige Renten | eigene Beiträge werden angespart und angelegt |
| Risiko | Demografie | Kapitalmarkt |
| Beispiel | gesetzliche Rente | private Rentenversicherung, Fonds |

Das **Solidarprinzip** ist etwas anderes: Beiträge nach Einkommen, Leistungen nach Bedarf.

### Prüfungsfalle
„Meine Beiträge werden für meine eigene Rente angelegt“ ist falsch – das beschreibt das Kapitaldeckungsverfahren.

### Merksatz
Die Jungen zahlen für die Alten – heute, nicht auf Vorrat.

Siehe auch: Rentenversicherung · Solidarprinzip · Drei Säulen · Pflichtversicherung
Mehr: Deep Dive 14, 1.1 · Deep Dive 14, 1.5

## Umweltmanagementsysteme
<!-- id: umweltmanagementsysteme · quellen: DD14 5.2 · stand: 2026-10 -->

Systematische Organisation des betrieblichen Umweltschutzes mit Zielen, Zuständigkeiten, Kennzahlen und kontinuierlicher Verbesserung – bekannt sind ISO 14001 und EMAS.

### Erklärung
Ein Umweltmanagementsystem folgt dem PDCA-Zyklus: Umweltaspekte ermitteln (Energie, Abfall, Emissionen), Ziele setzen, Maßnahmen umsetzen, messen und verbessern. **ISO 14001** ist die internationale Norm, nach der sich Unternehmen zertifizieren lassen; aktuell ist die Fassung ISO 14001:2026 (veröffentlicht April 2026, Übergangsfrist für 2015er-Zertifikate bis 2029, Stand 2026). **EMAS** (Eco-Management and Audit Scheme) ist das EU-System, das ISO 14001 einschließt und zusätzlich eine veröffentlichte, extern validierte Umwelterklärung verlangt.

### Beispiel
Das Möbelhaus Nordholz misst im Rahmen von ISO 14001 den Stromverbrauch seines Serverraums (PUE), setzt sich ein Einsparziel und prüft es jährlich im internen Audit.

### Abgrenzung
ISO 9001 regelt Qualitätsmanagement, ISO/IEC 27001 Informationssicherheit, ISO 14001 Umweltschutz – alle drei nutzen dieselbe Grundstruktur und lassen sich kombinieren.

### Prüfungsfalle
EMAS und ISO 14001 sind nicht dasselbe: EMAS ist strenger, weil die Umwelterklärung öffentlich ist.

### Merksatz
ISO 14001 = Norm zum Zertifizieren, EMAS = EU-System mit öffentlicher Umwelterklärung.

Siehe auch: Nachhaltigkeit · Green IT · PUE · PDCA · Abfallhierarchie
Mehr: Deep Dive 14, 5.2

## Unausgeglichene Klassen
<!-- id: unausgeglichene-klassen · quellen: Karte DD6, DD6 Teil 5, DD7 4.5 · stand: 2026-10 -->

Situation bei der Klassifikation, in der die interessierende Klasse sehr selten ist (z. B. 2 % Reklamationen), sodass die Accuracy irreführend hoch ausfällt.

### Erklärung
Ein Modell, das immer die Mehrheitsklasse vorhersagt, erreicht dann hohe Accuracy, findet aber keinen einzigen relevanten Fall. Abhilfe auf drei Ebenen: **bewerten** mit Precision, Recall, F1 oder Balanced Accuracy; **aufteilen** stratifiziert, damit jede Teilmenge denselben Klassenanteil hat; **trainieren** mit Oversampling (z. B. SMOTE), Undersampling, Klassengewichten oder angepasster Entscheidungsschwelle.

### Beispiel
Bei 2 % Reklamationen erreicht das Modell „nie Reklamation“ 98 % Accuracy, aber 0 % Recall. Balanced Accuracy: $(0\ \% + 100\ \%) / 2 = 50\ \%$ – entlarvt das Modell als wertlos.

### Abgrenzung
Unausgeglichene Klassen sind ein Merkmal der Daten, Overfitting ein Fehler des Modells. Resampling ändert die Trainingsdaten, Klassengewichte das Verfahren.

### Prüfungsfalle
Resampling vor der Aufteilung in Training und Test – Kopien landen in beiden Mengen, die Güte wird geschönt. Immer erst splitten, dann nur die Trainingsdaten resamplen.

### Merksatz
Seltene Klasse? Accuracy weglegen, Recall und F1 anschauen.

Siehe auch: Accuracy · Balanced Accuracy · Oversampling · Undersampling · Stratifizierte Aufteilung
Mehr: Deep Dive 6, Teil 5 · Deep Dive 7, 4.5

## Underfitting
<!-- id: underfitting · quellen: Karte DD7, DD7 1.2 · stand: 2026-10 -->

Unteranpassung: Das Modell ist zu einfach und erfasst schon in den Trainingsdaten das Grundmuster nicht.

### Erklärung
Erkennbar ist Underfitting daran, dass Trainings- **und** Testgüte niedrig sind. Ursachen sind ein zu simples Verfahren (z. B. eine Gerade für einen gekrümmten Zusammenhang), fehlende aussagekräftige Merkmale oder zu kurzes Training. Gegenmaßnahmen: komplexeres Modell, bessere Merkmale bilden (Feature Engineering), länger trainieren, Regularisierung lockern.

### Beispiel
Ein Entscheidungsbaum mit Tiefe 1 sagt Reklamationen vorher und erreicht 62 % im Training und 60 % im Test – beide schwach, kaum Lücke: Underfitting.

### Abgrenzung
| | Training | Test |
|---|---|---|
| Underfitting | schlecht | schlecht |
| Overfitting | sehr gut | deutlich schlechter |
| gutes Modell | gut | ähnlich gut |

### Prüfungsfalle
Gegen Underfitting „mehr Daten“ vorschlagen – das hilft vor allem gegen Overfitting; ein zu einfaches Modell bleibt auch mit mehr Daten zu einfach.

### Merksatz
Overfitting lernt auswendig, Underfitting lernt gar nicht.

Siehe auch: Overfitting · Kreuzvalidierung · Trainingsdaten · Testdaten
Mehr: Deep Dive 7, 1.2

## Undersampling
<!-- id: undersampling · quellen: Karte DD7, DD7 4.5 · stand: 2026-10 -->

Resampling-Verfahren gegen unausgeglichene Klassen, bei dem Fälle der Mehrheitsklasse aus den Trainingsdaten weggelassen werden, bis das Verhältnis ausgeglichener ist.

### Erklärung
Meist werden Mehrheitsfälle zufällig gezogen und der Rest verworfen. Das ist einfach und verkürzt das Training, kostet aber Information, weil echte Fälle ungenutzt bleiben – bei kleinen Datenmengen ein Nachteil. Angewendet wird es ausschließlich auf die Trainingsdaten, nach dem Split; die Testdaten behalten die reale Verteilung.

### Beispiel
Training: 9.800 Aufträge ohne und 200 mit Reklamation. Zieht man zufällig 800 Fälle ohne Reklamation, entsteht ein Trainingssatz mit $200 / 1.000 = 20\ \%$ Reklamationen statt 2 %.

### Abgrenzung
**Oversampling** vervielfältigt die Minderheitsklasse (oder erzeugt synthetische Fälle mit SMOTE) und behält alle Daten, erhöht aber die Overfitting-Gefahr; Undersampling verwirft Mehrheitsfälle.

### Prüfungsfalle
Auch die Testdaten „ausgleichen“ – dann misst der Test nicht mehr die Realität.

### Merksatz
Undersampling wirft weg, Oversampling kopiert – beides nur im Training.

Siehe auch: Oversampling · SMOTE · Unausgeglichene Klassen · Stratifizierte Aufteilung
Mehr: Deep Dive 7, 4.5

## Uneinheitliche Aktivitätsbezeichnungen
<!-- id: uneinheitliche-aktivitatsbezeichnungen · quellen: DD5 5.3 · stand: 2026-10 -->

Datenqualitätsproblem im Event Log: Derselbe Prozessschritt ist unterschiedlich benannt, sodass Process Mining ihn als zwei verschiedene Aktivitäten behandelt.

### Erklärung
Unterschiedliche Systeme, Filialen oder Softwareversionen schreiben verschiedene Texte in das Feld Activity („Rechnung stellen“ vs. „Rechnungsstellung“). Die Discovery erzeugt dann zusätzliche Knoten und scheinbare Prozessvarianten, Häufigkeiten und Durchlaufzeiten je Schritt werden falsch. Abhilfe: vor der Analyse eine Zuordnungstabelle (Mapping) auf einheitliche Bezeichnungen anwenden und dauerhaft feste Auswahllisten statt Freitext einführen.

### Beispiel
Im Reparaturservice stehen „Auftrag erfassen“, „Auftragserfassung“ und „AUFTRAG ANLEGEN“ im Log – nach dem Mapping wird daraus eine Aktivität „Auftrag erfassen“, und die Zahl der Varianten sinkt deutlich.

### Abgrenzung
Fehlende oder zu grobe Zeitstempel stören die Reihenfolge, unvollständige Fälle die Durchlaufzeit – uneinheitliche Bezeichnungen blähen das Modell mit Scheinvarianten auf.

### Prüfungsfalle
Viele Varianten im Process-Mining-Ergebnis sofort als „chaotischen Prozess“ deuten, ohne vorher die Bezeichnungen zu prüfen.

### Merksatz
Gleicher Schritt, gleicher Name – sonst sieht Process Mining doppelt.

Siehe auch: Event Log · Activity · Process Mining · Unvollständige Fälle · Auswahllisten statt Freitext
Mehr: Deep Dive 5, 5.3

## Unfall
<!-- id: unfall · quellen: DD14 5.1 · stand: 2026-10 -->

Im Arbeitsschutz: Arbeitsunfall oder Wegeunfall, der über die gesetzliche Unfallversicherung (Berufsgenossenschaft) versichert ist.

### Erklärung
Versichert sind Unfälle bei der betrieblichen Tätigkeit und auf dem direkten Weg zwischen Wohnung und Arbeitsstätte oder Berufsschule (§ 8 SGB VII). Auch Umwege, um das eigene Kind in die Kita zu bringen, sind geschützt. Der Weg beginnt mit dem Durchschreiten der Außentür des Wohngebäudes; private Unterbrechungen (Einkauf) sind nicht versichert. Im Homeoffice ist man seit 2021 genauso geschützt wie im Betrieb. Führt ein Unfall zu mehr als drei Tagen Arbeitsunfähigkeit, muss der Arbeitgeber binnen drei Tagen eine Unfallanzeige erstatten.

### Beispiel
Lea stürzt auf dem Weg zur Berufsschule an der Bushaltestelle: Wegeunfall, versichert. Stürzt sie in ihrem Treppenhaus vor der Haustür: nicht versichert.

### Abgrenzung
Die Krankenversicherung zahlt bei privaten Unfällen; Arbeits- und Wegeunfälle sowie Berufskrankheiten trägt die Unfallversicherung.

### Prüfungsfalle
Den Einkaufsabstecher auf dem Heimweg für versichert halten – oder das Treppenhaus der eigenen Wohnung.

### Merksatz
Versichert ab der Haustür, auf direktem Weg – plus Kita-Umweg.

Siehe auch: Unfallversicherung · Wegeunfall · Berufsgenossenschaft · Arbeitsschutz
Mehr: Deep Dive 14, 5.1

## Unfallversicherung
<!-- id: unfallversicherung · quellen: Karte DD14, DD14 1.2 · stand: 2026-10 -->

Zweig der gesetzlichen Sozialversicherung, getragen von Berufsgenossenschaften und Unfallkassen, den allein der Arbeitgeber finanziert und der Arbeits- und Wegeunfälle sowie Berufskrankheiten abdeckt.

### Erklärung
Die Unfallversicherung (SGB VII) zahlt Heilbehandlung, Reha, Verletztengeld und Renten nach Arbeits- und Wegeunfällen. Die Beiträge richten sich nach Lohnsumme und Gefahrklasse des Betriebs, nicht nach einem festen Prozentsatz. Die Berufsgenossenschaften erlassen außerdem Unfallverhütungsvorschriften (DGUV Vorschriften) und überwachen den Arbeitsschutz. Versichert sind alle Beschäftigten und Auszubildenden ab dem ersten Tag.

### Beispiel
Jonas (17, Azubi im Möbelhaus Nordholz) verletzt sich beim Aufbau eines Regals – die Berufsgenossenschaft trägt Behandlung und gegebenenfalls Reha; auf seiner Gehaltsabrechnung taucht kein Beitrag auf.

### Abgrenzung
| Zweig | Finanzierung |
|---|---|
| Kranken-, Pflege-, Renten-, Arbeitslosenversicherung | AG und AN je zur Hälfte (Ausnahmen beachten) |
| Unfallversicherung | Arbeitgeber allein |

### Prüfungsfalle
Die Unfallversicherung als hälftig finanziert angeben oder einen Arbeitnehmeranteil auf der Abrechnung suchen.

### Merksatz
Unfall? Die Berufsgenossenschaft zahlt – und der Arbeitgeber allein zahlt sie.

Siehe auch: Unfall · Berufsgenossenschaft · Wegeunfall · Krankenversicherung · Arbeitsschutz
Mehr: Deep Dive 14, 1.2

## Ungleiche Klassenbreiten
<!-- id: ungleiche-klassenbreiten · quellen: DD11 A3 · stand: 2026-10 -->

Manipulationstechnik bei Histogrammen und Häufigkeitstabellen: Klassen unterschiedlicher Breite werden mit der absoluten Häufigkeit als Höhe gezeichnet, sodass breite Klassen übergroß wirken.

### Erklärung
Im Histogramm transportiert die **Fläche** eines Balkens die Häufigkeit. Sind alle Klassen gleich breit, genügt die Höhe. Bei ungleichen Breiten muss die Höhe die Häufigkeitsdichte sein (Häufigkeit ÷ Klassenbreite), sonst sammelt eine breite Klasse einfach mehr Fälle und erscheint als Gipfel, der keiner ist.

### Beispiel
Lieferzeiten: Klasse 0–2 Tage mit 40 Aufträgen, Klasse 2–10 Tage mit 60 Aufträgen. Mit absoluten Höhen wirkt „2–10 Tage“ größer. Mit Dichte: $40 / 2 = 20$ je Tag gegenüber $60 / 8 = 7{,}5$ je Tag – tatsächlich liegen die meisten Aufträge pro Tag im kurzen Bereich.

### Abgrenzung
Die abgeschnittene y-Achse verzerrt Längen, gestauchte Achsen die Steigung, ungleiche Klassenbreiten die Form einer Verteilung.

### Prüfungsfalle
Beim Beurteilen eines Histogramms nur auf die Balkenhöhe schauen, ohne die Klassengrenzen zu prüfen.

### Merksatz
Im Histogramm zählt die Fläche – breite Klasse, niedrigere Dichte.

Siehe auch: Histogramm · Lügenfaktor · Abgeschnittene Achse
Mehr: Deep Dive 11, A3 · Deep Dive 17, 6.6

## UNIQUE
<!-- id: uniqu · quellen: Karte DD1, DD1 2.5, DD9 5.1 · stand: 2026-10 -->

SQL-Constraint, der doppelte Werte in einer Spalte oder Spaltenkombination verhindert; anders als beim Primärschlüssel sind NULL-Werte erlaubt.
Auch: UNIQUE-Constraint

### Erklärung
UNIQUE sichert fachliche Schlüssel ab, die nicht Primärschlüssel sind – etwa E-Mail-Adresse, Steuernummer oder Artikelnummer neben einer Surrogat-ID. Eine Tabelle kann mehrere UNIQUE-Constraints haben, aber nur einen Primärschlüssel. Bei 1:1-Beziehungen erzwingt UNIQUE auf dem Fremdschlüssel, dass jeder Wert höchstens einmal vorkommt. Wie viele NULL-Werte erlaubt sind, ist DBMS-abhängig (meist beliebig viele, SQL Server nur einer).

```sql
CREATE TABLE kunde (
  kunden_id INTEGER PRIMARY KEY,
  email     VARCHAR(120) UNIQUE
);
```

### Abgrenzung
| Constraint | eindeutig | NULL erlaubt | Anzahl je Tabelle |
|---|---|---|---|
| PRIMARY KEY | ja | nein | eine |
| UNIQUE | ja | ja | beliebig |

### Prüfungsfalle
UNIQUE als Allheilmittel gegen Dubletten nennen: Er verhindert nur exakte Dubletten. „Braun GmbH“ und „Braun G.m.b.H.“ passieren ihn – dafür braucht es Normalisierung und Ähnlichkeitsvergleich.

### Merksatz
UNIQUE stoppt Zwillinge, nicht Doppelgänger.

Siehe auch: Primärschlüssel · NOT NULL · CHECK · Dublette · Golden Record
Mehr: Deep Dive 1, 2.5 · Deep Dive 9, 5.1

## Unstrukturierte Daten
<!-- id: unstrukturierte-daten · quellen: Karte DD15, DD15 1.1 · stand: 2026-10 -->

Daten ohne vorgegebenes Schema oder Tabellenform, z. B. Freitexte, Bilder, Audio und Video.

### Erklärung
Unstrukturierte Daten lassen sich nicht direkt mit SQL auswerten; vorher braucht es Aufbereitung wie Textanalyse (Stichworte, Stimmung), Bilderkennung oder Spracherkennung, die strukturierte Merkmale erzeugt. Sie machen einen großen Teil aller Unternehmensdaten aus und werden typischerweise im Data Lake abgelegt (Schema-on-Read). Für Big Data stehen sie hinter dem V **Variety**.

### Beispiel
Freitext-Bewertungen im Onlineshop des Möbelhauses: Eine Textanalyse ordnet jede Bewertung einer Stimmung (positiv/negativ) und einem Thema (Lieferung, Qualität) zu – das Ergebnis ist eine auswertbare Tabelle.

### Abgrenzung
| Art | Merkmal | Beispiel |
|---|---|---|
| strukturiert | festes Schema, Tabelle | Kundentabelle |
| semistrukturiert | selbstbeschreibend, verschachtelt | JSON, XML, Logdateien |
| unstrukturiert | kein Schema | Freitext, Bilder |

### Prüfungsfalle
JSON oder E-Mails mit Kopfzeilen als unstrukturiert einordnen – sie sind semistrukturiert.

### Merksatz
Kein Schema, keine Spalten – erst aufbereiten, dann auswerten.

Siehe auch: Strukturierte Daten · Semistrukturierte Daten · Data Lake · Variety
Mehr: Deep Dive 15, 1.1

## Unterabfrage
<!-- id: unterabfrage · quellen: Karte DD1, DD1 2.3 · stand: 2026-10 -->

SELECT-Anweisung, die innerhalb einer anderen Abfrage steht und ihr einen Wert, eine Werteliste oder eine Existenzprüfung liefert.

### Erklärung
Unterabfragen stehen meist in WHERE oder HAVING, seltener in FROM oder SELECT. Drei Formen: **skalar** (genau ein Wert, Vergleich mit =, >), **mit IN** (Werteliste) und **mit EXISTS** (gibt es mindestens eine passende Zeile?). Bezieht sich die innere Abfrage auf Spalten der äußeren, heißt sie korreliert und wird je Zeile neu ausgewertet. Faustregel: „… als der Durchschnitt / das Maximum / alle, die in … vorkommen“ deutet auf eine Unterabfrage.

### Beispiel
```sql
SELECT bezeichnung, preis
FROM produkt
WHERE preis > (SELECT AVG(preis) FROM produkt);
```
Durchschnitt: $(249 + 399 + 189 + 129 + 39{,}90) / 5 = 201{,}18$ € → Ergebnis: Bürostuhl Comfort und Schreibtisch Basic.

### Abgrenzung
Ein JOIN verbindet Zeilen zweier Tabellen nebeneinander; eine Unterabfrage liefert der äußeren Abfrage einen Vergleichswert. Ein Aggregat direkt in WHERE (`WHERE preis > AVG(preis)`) ist nicht erlaubt – genau dafür braucht man die Unterabfrage.

### Prüfungsfalle
`NOT IN (Unterabfrage)` liefert kein Ergebnis, sobald die Unterabfrage einen NULL-Wert enthält – sicherer ist NOT EXISTS.

### Merksatz
Vergleich mit einem berechneten Wert? Erst innen rechnen, dann außen filtern.

Siehe auch: INNER JOIN · CTE (Common Table Expression) · View
Mehr: Deep Dive 1, 2.3 · Deep Dive 1, 3.1

## Unternehmensmitbestimmung
<!-- id: unternehmensmitbestimmung · quellen: Karte DD13, DD13 4.4 · stand: 2026-10 -->

Beteiligung der Arbeitnehmer im Aufsichtsrat von Kapitalgesellschaften: ab mehr als 500 Beschäftigten ein Drittel, ab mehr als 2.000 die Hälfte der Sitze.
Auch: Unternehmensmitbestimmung im Aufsichtsrat

### Erklärung
Nach dem **Drittelbeteiligungsgesetz** besteht der Aufsichtsrat von AG, GmbH und ähnlichen Gesellschaften mit in der Regel mehr als 500 Arbeitnehmern zu einem Drittel aus Arbeitnehmervertretern. Ab in der Regel mehr als 2.000 Arbeitnehmern gilt das **Mitbestimmungsgesetz**: paritätische Besetzung, bei Stimmengleichheit entscheidet nach einer zweiten Abstimmung der Aufsichtsratsvorsitzende, der von der Anteilseignerseite kommt. Der Aufsichtsrat überwacht die Geschäftsführung bzw. den Vorstand – so wirken Beschäftigte auf Unternehmensentscheidungen ein.

### Beispiel
Das Möbelhaus Nordholz hat 140 Beschäftigte: keine Unternehmensmitbestimmung, aber ein Betriebsrat mit 7 Mitgliedern. Ein Konzern mit 3.000 Beschäftigten hätte einen paritätisch besetzten Aufsichtsrat.

### Abgrenzung
**Betriebliche Mitbestimmung** (BetrVG) läuft über den Betriebsrat und betrifft den Betrieb (Arbeitszeit, Überwachungssysteme); **Unternehmensmitbestimmung** wirkt im Aufsichtsrat auf die Unternehmensführung.

### Prüfungsfalle
Parität mit gleichem Einfluss verwechseln – durch die Zweitstimme des Vorsitzenden behält die Anteilseignerseite das letzte Wort.

### Merksatz
Über 500 ein Drittel, über 2.000 die Hälfte.

Siehe auch: Betriebsrat · Mitbestimmung · Betriebsvereinbarung · AG
Mehr: Deep Dive 13, 4.4

## Unterprogramm
<!-- id: unterprogramm · quellen: DD17 4.1, DD11 B2, DD11 B3 · stand: 2026-10 -->

Abgeschlossener, an anderer Stelle beschriebener Teilablauf, der im PAP und im Struktogramm als Rechteck mit doppelten senkrechten Kanten aufgerufen wird.

### Erklärung
Unterprogramme (Funktionen, Prozeduren) zerlegen einen Algorithmus in überschaubare, wiederverwendbare Bausteine. Im Hauptablauf steht nur der Aufruf mit dem Namen, z. B. „Rabatt berechnen“; die Details stehen in einem eigenen Diagramm. Das macht Pläne kürzer, verständlicher und leichter zu testen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 70" width="260" height="70" role="img" aria-label="Sinnbild Unterprogramm: Rechteck mit doppelten senkrechten Kanten">
<rect x="20" y="15" width="220" height="40" class="dg-form"/>
<line x1="34" y1="15" x2="34" y2="55" class="dg-linie"/>
<line x1="226" y1="15" x2="226" y2="55" class="dg-linie"/>
<text x="130" y="35" text-anchor="middle" dominant-baseline="middle">Rabatt berechnen</text>
</svg>
```

### Beispiel
Im PAP „Bestellung abrechnen“ steht ein Unterprogramm-Symbol „Rabatt berechnen“; dessen eigener PAP enthält die Verzweigung „betrag > 1000?“.

### Abgrenzung
Das einfache Rechteck ist eine einzelne Operation (Zuweisung), das Rechteck mit Doppelkanten ein ganzer ausgelagerter Ablauf.

### Prüfungsfalle
Doppelte waagerechte statt senkrechter Kanten zeichnen – die zusätzlichen Linien gehören an die Seiten.

### Merksatz
Doppelte Seitenwände = hier wird ein anderer Plan aufgerufen.

Siehe auch: Programmablaufplan · Struktogramm · Übergangsstelle · Sequenz
Mehr: Deep Dive 17, 4.1 · Deep Dive 11, B3

## Unterstützungsprozess
<!-- id: unterstutzungsprozess · quellen: Karte DD5, DD5 1.1 · stand: 2026-10 -->

Geschäftsprozess, der die Kernprozesse ermöglicht, ohne selbst direkten Kundennutzen zu stiften – z. B. IT-Betrieb, Personalwesen, Einkauf, Buchhaltung.

### Erklärung
Unternehmen teilen ihre Prozesse in drei Arten: **Kernprozesse** schaffen den Wert, für den Kunden zahlen; **Unterstützungsprozesse** stellen Ressourcen, Infrastruktur und Daten bereit; **Führungsprozesse** steuern das Ganze. Unterstützungsprozesse sind oft Kandidaten für Standardisierung oder Auslagerung (Outsourcing), weil sie nicht zum Alleinstellungsmerkmal gehören.

### Beispiel
| Prozessart | Möbelhaus Nordholz |
|---|---|
| Kernprozess | Auftragsabwicklung, Reparaturservice |
| Unterstützungsprozess | IT-Betrieb, Personalwesen, Einkauf |
| Führungsprozess | Strategie, Controlling, Qualitätsmanagement |

### Abgrenzung
Entscheidend ist der Kundennutzen: Der Kunde bezahlt die Reparatur (Kernprozess), nicht die Gehaltsabrechnung der Werkstatt (Unterstützungsprozess).

### Prüfungsfalle
Einkauf oder IT als Kernprozess einordnen, nur weil sie wichtig sind – in einem IT-Dienstleister wäre IT-Betrieb allerdings tatsächlich Kernprozess. Die Zuordnung hängt vom Geschäftsmodell ab.

### Merksatz
Kern verdient, Unterstützung ermöglicht, Führung steuert.

Siehe auch: Kernprozess · Führungsprozess · Geschäftsprozess
Mehr: Deep Dive 5, 1.1

## Unterweisung
<!-- id: unterweisung · quellen: DD14 5.1 · stand: 2026-10 -->

Pflicht des Arbeitgebers, Beschäftigte über Gefährdungen am Arbeitsplatz und Schutzmaßnahmen zu informieren – bei Einstellung, bei Veränderungen und mindestens jährlich, bei Jugendlichen mindestens halbjährlich.

### Erklärung
Grundlage sind § 12 ArbSchG (Unterweisung während der Arbeitszeit, vor Aufnahme der Tätigkeit und bei Veränderungen), § 4 DGUV Vorschrift 1 (Wiederholung mindestens einmal jährlich, dokumentiert) und § 29 JArbSchG (bei Jugendlichen mindestens halbjährlich). Die Unterweisung beruht auf der **Gefährdungsbeurteilung** und muss verständlich sein; ihre Teilnahme wird schriftlich dokumentiert.

### Beispiel
Jonas (17) beginnt im Möbelhaus Nordholz: Unterweisung am ersten Tag (Fluchtwege, Hebetechnik, Bildschirmarbeit), dann spätestens nach sechs Monaten erneut. Lea (24) wird jährlich unterwiesen.

### Abgrenzung
Die Gefährdungsbeurteilung ermittelt die Risiken, die Unterweisung vermittelt sie den Beschäftigten. Die Berufsschul-Pflicht zur Freistellung ist eine andere Pflicht aus dem BBiG.

### Prüfungsfalle
Für Jugendliche das jährliche Intervall der Erwachsenen ansetzen – es gilt halbjährlich.

### Merksatz
Erwachsene jährlich, Jugendliche halbjährlich – und immer, wenn sich etwas ändert.

Siehe auch: Arbeitsschutz · Gefährdungsbeurteilung · STOP-Prinzip · JArbSchG
Mehr: Deep Dive 14, 5.1

## Unüberwachtes Lernen
<!-- id: unuberwachtes-lernen · quellen: Karte DD6, DD6 2.2 · stand: 2026-10 -->

Lernart des Machine Learning ohne Zielvariable: Das Verfahren sucht selbstständig Strukturen in den Daten, z. B. Gruppen oder häufige Kombinationen.

### Erklärung
Es gibt keine „richtige Antwort“ in den Daten, daher auch keine Trefferquote im üblichen Sinn. Typische Verfahren: **Clustering** (k-Means bildet Gruppen ähnlicher Datensätze), **Assoziationsanalyse** (Warenkorb: Support, Konfidenz, Lift) und Dimensionsreduktion. Die Ergebnisse müssen fachlich interpretiert werden – das Verfahren liefert Gruppe 1, 2, 3, aber keine Namen.

### Beispiel
Das Möbelhaus gruppiert Kunden mit k-Means nach Umsatz und Kaufhäufigkeit. Erst der Fachbereich benennt die Cluster als „Großkunden“, „Gelegenheitskäufer“ und „Stammkunden“.

### Abgrenzung
Überwachtes Lernen braucht Labels und sagt vorher; unüberwachtes entdeckt Strukturen. k-NN (überwacht, klassifiziert) ist nicht k-Means (unüberwacht, gruppiert).

### Prüfungsfalle
Eine Aufgabe als Klassifikation einordnen, obwohl die Gruppen vorher nicht bekannt sind – fehlen Labels, bleibt nur unüberwachtes Lernen.

### Merksatz
Keine Labels? Dann finden statt vorhersagen.

Siehe auch: Überwachtes Lernen · Clustering · Assoziationsanalyse · K-Means
Mehr: Deep Dive 6, 2.2 · Deep Dive 6, Teil 3

## Unvollständige Fälle
<!-- id: unvollstandige-falle · quellen: DD5 5.3 · stand: 2026-10 -->

Datenqualitätsproblem im Event Log: Fälle, die vor dem Auswertungszeitraum begonnen haben oder danach enden, sind nur teilweise enthalten und verzerren Durchlaufzeiten.

### Erklärung
Ein Event-Log-Auszug ist ein Zeitfenster. Fälle am Rand fehlen am Anfang (Start vor dem Zeitraum) oder am Ende (noch offen). Ihre gemessene Durchlaufzeit ist zu kurz, und Process Mining zeigt scheinbare Prozessvarianten, die mit einem mittleren Schritt beginnen oder enden. Abhilfe: unvollständige Fälle über Start- und Endaktivität erkennen und herausfiltern oder getrennt ausweisen, das Zeitfenster großzügiger wählen und die Entscheidung dokumentieren.

### Beispiel
Auswertung Januar bis März: Reparaturauftrag 5017 beginnt im Dezember, im Log steht er erst ab „Reparatur durchführen“. Seine Durchlaufzeit wirkt um die Dezembertage kürzer.

### Abgrenzung
Fehlende Case ID macht Ereignisse unzuordenbar, uneinheitliche Bezeichnungen erzeugen Scheinaktivitäten – unvollständige Fälle verfälschen Zeiten und Start-/Endpunkte.

### Prüfungsfalle
Offene Fälle einfach in die mittlere Durchlaufzeit einrechnen – das senkt den Wert künstlich.

### Merksatz
Wer nur die Mitte eines Falls sieht, misst ihn zu kurz.

Siehe auch: Event Log · Durchlaufzeit · Process Mining · Uneinheitliche Aktivitätsbezeichnungen · Case ID
Mehr: Deep Dive 5, 5.3

## Urheberrecht
<!-- id: urheberrecht · quellen: Karte DD14, DD14 2.7 · stand: 2026-10 -->

Schutz persönlicher geistiger Schöpfungen – ausdrücklich auch von Computerprogrammen –, der automatisch entsteht und bis 70 Jahre nach dem Tod des Urhebers gilt.

### Erklärung
Eine Anmeldung ist nicht nötig; der Schutz entsteht mit der Schöpfung (UrhG, Schutzdauer § 64). Computerprogramme sind nach § 69a UrhG geschützt. Schafft ein Arbeitnehmer Software in Erfüllung seiner Aufgaben, stehen die wirtschaftlichen **Nutzungsrechte** dem Arbeitgeber zu (§ 69b UrhG); Urheber bleibt der Mensch. Daneben schützt das **Datenbankherstellerrecht** (§ 87a ff. UrhG) für 15 Jahre die Investition in eine Datenbank. Nutzung fremder Werke erfordert eine Lizenz – auch bei Open Source mit ihren Bedingungen.

### Beispiel
Lea schreibt im Ausbildungsprojekt ein Python-Skript zur Reklamationsauswertung. Das Möbelhaus darf es nutzen, ändern und weitergeben – sie selbst darf es nicht an einen anderen Betrieb verkaufen.

### Abgrenzung
| | Urheberrecht | Patent |
|---|---|---|
| Gegenstand | Werke, Software als Code | technische Erfindungen |
| Entstehung | automatisch | Anmeldung und Prüfung |
| Dauer | 70 Jahre nach Tod | höchstens 20 Jahre |

### Prüfungsfalle
Annehmen, Software müsse angemeldet werden oder sei „als solche“ patentierbar.

### Merksatz
Urheberrecht entsteht von selbst – im Job gehören die Nutzungsrechte dem Arbeitgeber.

Siehe auch: Patent · Open Source · Datenbankherstellerrecht · Copyleft
Mehr: Deep Dive 14, 2.7

## Usability-Test
<!-- id: usability-test · quellen: Karte DD11, DD11 A5, DD16 2.4 · stand: 2026-10 -->

Nicht-funktionaler Test, bei dem echte Nutzer typische Aufgaben mit dem System oder Prototyp lösen, während beobachtet wird, wo sie stocken oder scheitern.

### Erklärung
Geprüft wird die **Gebrauchstauglichkeit** nach ISO 9241-11: effektiv, effizient, zufriedenstellend. Man formuliert realistische Aufgaben, lässt die Teilnehmenden laut denken (Thinking Aloud) und misst z. B. Erfolgsquote, Bearbeitungszeit und Fehler. Schon wenige Testpersonen (oft fünf) decken die meisten groben Probleme auf. Am billigsten ist der Test früh – mit Wireframe, Mock-up oder klickbarem Prototyp.

### Beispiel
Drei Filialleiter sollen im Dashboard-Prototyp „die Reklamationsquote der Filiale Süd im März“ finden. Zwei übersehen den Filter oben rechts – der Filter wird nach links oben verschoben.

### Abgrenzung
Funktionale Tests prüfen, ob die Kennzahl richtig berechnet wird; der Usability-Test, ob Nutzer sie finden und verstehen. Der Abnahmetest prüft gegen vertragliche Kriterien, nicht das Nutzerverhalten.

### Prüfungsfalle
Entwickler oder Projektbeteiligte als Testpersonen einsetzen – sie kennen das System und finden die Hürden nicht.

### Merksatz
Nicht fragen, ob es gefällt – zusehen, ob es klappt.

Siehe auch: Gebrauchstauglichkeit · Prototyp · Wireframe · Mock-up · Interaktionsprinzipien
Mehr: Deep Dive 11, A5 · Deep Dive 16, 2.4

## Use-Case-Diagramm
<!-- id: use-case-diagramm · quellen: Karte DD15, DD17 2.2, DD15 5.1 · stand: 2026-10 -->

UML-Verhaltensdiagramm, das zeigt, welche Akteure ein System für welche Anwendungsfälle nutzen – das Was, nicht das Wie.

### Erklärung
**Akteure** (Strichmännchen: Personen oder externe Systeme) stehen außerhalb der **Systemgrenze** (Rechteck mit Systemnamen), **Anwendungsfälle** als Ellipsen mit Verb + Objekt darin. Linien verbinden Akteure mit ihren Fällen. Beziehungen zwischen Fällen sind gestrichelte Pfeile: **«include»** – der Basisfall bindet einen anderen Fall immer ein (Pfeil zum eingebundenen Fall); **«extend»** – ein Fall erweitert den Basisfall nur unter einer Bedingung (Pfeil zum Basisfall). Das Diagramm eignet sich gut für die Anforderungsaufnahme mit dem Fachbereich.

### Beispiel
Reparaturportal: Akteur Kunde – „Reparatur beauftragen“ «include» „Kunde anmelden“; „Expressservice wählen“ «extend» „Reparatur beauftragen“. Ein Diagramm dazu steht in Deep Dive 17, 2.2.

### Abgrenzung
Das Aktivitätsdiagramm zeigt den Ablauf eines Falls Schritt für Schritt; das Use-Case-Diagramm zeigt nur, welche Fälle es gibt und wer beteiligt ist.

### Prüfungsfalle
Die Pfeilrichtung bei «extend» umdrehen oder Reihenfolgen und Verzweigungen in das Use-Case-Diagramm einzeichnen.

### Merksatz
Der Pfeil zeigt immer auf den Fall, der gebraucht oder erweitert wird.

Siehe auch: UML · Akteur · Anwendungsfall · Systemgrenze · Aktivitätsdiagramm
Mehr: Deep Dive 17, 2.2 · Deep Dive 15, 5.1

## USV
<!-- id: usv · quellen: Karte DD16, DD16 4.5, DD10 4.1 · stand: 2026-10 -->

Unterbrechungsfreie Stromversorgung: Gerät, das Stromausfälle und Spannungsschwankungen mit Akkus überbrückt und so die Verfügbarkeit von Servern sichert.

### Erklärung
Die USV hält die Systeme wenige Minuten bis Stunden am Laufen – genug, um sauber herunterzufahren oder bis ein Notstromaggregat anläuft. Bauarten (IEC 62040-3): Offline/Standby (schaltet bei Ausfall um, günstig), Line-Interactive (regelt zusätzlich Spannung) und Online/Doppelwandler (Verbraucher hängen dauerhaft am Wechselrichter, keine Umschaltzeit – für Server üblich). Über eine Datenverbindung löst die USV bei schwachem Akku ein automatisches Herunterfahren aus.

### Beispiel
Der Datenbankserver des Möbelhauses hängt an einer Online-USV mit 20 Minuten Laufzeit. Bei einem Stromausfall fährt er nach 10 Minuten geordnet herunter – keine beschädigten Transaktionen.

### Abgrenzung
Die USV schützt die Verfügbarkeit gegen Stromprobleme, RAID gegen Plattenausfall, Backup gegen Datenverlust. Keine der Maßnahmen ersetzt eine andere.

### Prüfungsfalle
Die USV für einen Langzeit-Notstrom halten – für lange Ausfälle braucht es ein Notstromaggregat; Akkus müssen zudem regelmäßig getestet und getauscht werden.

### Merksatz
Die USV überbrückt Minuten, das Aggregat Stunden.

Siehe auch: Verfügbarkeit · RAID · Georedundanz · Hochverfügbarkeit
Mehr: Deep Dive 16, 4.5 · Deep Dive 10, 4.1

## UTF-8
<!-- id: utf-8 · quellen: Karte DD15, DD15 2.5 · stand: 2026-10 -->

Unicode-Zeichenkodierung mit 1 bis 4 Bytes je Zeichen, ASCII-kompatibel und heute Standard für Web und Datenaustausch.

### Erklärung
Die 128 ASCII-Zeichen belegen in UTF-8 genau ein Byte und sind identisch kodiert; Umlaute und ß brauchen 2 Bytes, das €-Zeichen 3 Bytes, Emojis 4 Bytes. Damit lässt sich jedes Unicode-Zeichen darstellen. Probleme entstehen, wenn Schreib- und Lesekodierung nicht übereinstimmen: Wird ein UTF-8-„ä“ (Bytes C3 A4) als Latin-1 gelesen, erscheint „Ã¤“.

### Beispiel
„Größe“ hat 5 Zeichen: in Latin-1 5 Bytes, in UTF-8 7 Bytes, weil ö und ß je 2 Bytes belegen ($3 \cdot 1 + 2 \cdot 2 = 7$).

### Abgrenzung
| Kodierung | Bytes je Zeichen | Umlaute | € |
|---|---|---|---|
| ASCII | 1 (7 Bit) | nein | nein |
| Latin-1 (ISO 8859-1) | 1 | ja | nein |
| UTF-8 | 1–4 | ja | ja |

### Prüfungsfalle
Annehmen, UTF-8 belege immer ein oder immer zwei Bytes je Zeichen – die Länge ist variabel. Und: Beim CSV-Import die Kodierung nicht angeben.

### Merksatz
Kodierung immer ausdrücklich festlegen – und durchgängig UTF-8.

Siehe auch: Zeichenkodierung · ASCII · CSV
Mehr: Deep Dive 15, 2.5

## Ausgelassen
- Umsetzung und Kontrolle – Phase Prozessanalyse
- Unterschied zum Struktogramm – Abschnittslabel PAP
- Ursache klären – Schritt Ausreißerbehandlung
- Ursachen – Label Inflation
