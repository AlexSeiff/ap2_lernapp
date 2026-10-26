<!-- Begriffsseiten K · Stand 2026-10 -->
## K-Anonymität
<!-- id: k-anonymitat · quellen: Karte DD10, DD10 Teil 3 · stand: 2026-10 -->

Eigenschaft eines Datensatzes, bei der jede Kombination identifizierender Merkmale auf mindestens k Personen zutrifft – Schutz vor Re-Identifikation.

### Erklärung
Auch ohne Namen lassen sich Personen über Merkmalskombinationen wiedererkennen (Quasi-Identifikatoren wie Alter, Filiale, Funktion). K-Anonymität verlangt, dass sich jede Person in einer Gruppe von mindestens k gleich aussehenden Datensätzen „versteckt“. Mittel dazu: Merkmale vergröbern (Altersgruppe statt Geburtsdatum, PLZ-Bereich statt PLZ), seltene Kombinationen unterdrücken, Mindestgruppengrößen in Auswertungen festlegen.

### Beispiel
Eine Auswertung „Krankheitstage je Filiale, Geschlecht und Funktion“ enthält die Zeile „weiblich, Köln, Abteilungsleitung“ – faktisch eine Person. Mit k = 5 werden Gruppen unter fünf Personen zusammengefasst oder ausgeblendet.

### Abgrenzung
**Pseudonymisierung** ersetzt Namen durch Schlüssel, die Daten bleiben personenbezogen. K-Anonymität ist ein Maß dafür, wie gut eine **Anonymisierung** gegen Re-Identifikation über Merkmalskombinationen schützt.

### Prüfungsfalle
Annehmen, das Entfernen von Name und Kundennummer mache einen Datensatz anonym – Merkmalskombinationen reichen oft zur Identifikation.

### Merksatz
K-Anonymität: Jeder sieht aus wie mindestens k − 1 andere.

Siehe auch: Anonymisierung · Pseudonymisierung · Personenbezogene Daten
Mehr: Deep Dive 10, Teil 3

## K-Means
<!-- id: k-means · quellen: Karte DD6, DD6 2.4, DD6 Teil 3 · stand: 2026-10 -->

Unüberwachtes Clusterverfahren, das Datenpunkte in k Gruppen um k Zentren einteilt.

### Erklärung
1. k festlegen und k Startzentren wählen. 2. Jeden Punkt dem nächstgelegenen Zentrum zuordnen (euklidischer Abstand). 3. Jedes Zentrum als Mittelwert seiner Punkte neu berechnen. 4. Ab Schritt 2 wiederholen, bis sich die Zuordnung nicht mehr ändert. Schwächen: k muss vorher festgelegt werden (Elbow-Methode), das Ergebnis hängt von den Startzentren ab (k-Means++), die Merkmale müssen skaliert werden; zudem ist das Verfahren ausreißerempfindlich.

### Beispiel
Sechs Kunden (Bestellungen pro Jahr | Bestellwert in 100 €): P1(2|2), P2(3|1), P3(1|3), P4(7|8), P5(8|7), P6(9|9); Startzentren Z1(4|4), Z2(6|6). P1–P3 gehen zu Z1, P4–P6 zu Z2. Neue Zentren: Z1 = (2|2), Z2 = (8|8). In der zweiten Runde ändert sich nichts → Gelegenheits- und Stammkunden.

### Abgrenzung
**K-Nächste-Nachbarn** ist überwacht und klassifiziert (k = Anzahl Nachbarn); k-Means ist unüberwacht und bildet Cluster (k = Anzahl Cluster). Gemeinsam ist nur der Abstandsbegriff.

### Prüfungsfalle
Euro-Beträge und Stückzahlen unskaliert clustern – dann entscheidet allein das Merkmal mit der größten Spanne.

### Merksatz
Zuordnen, Mittelwert bilden, wiederholen – bis nichts mehr wandert.

Siehe auch: K-Nächste-Nachbarn · Clustering · Euklidischer Abstand · Standardisierung
Mehr: Deep Dive 6, 2.4 · Deep Dive 6, Teil 3

## K-Nächste-Nachbarn
<!-- id: k-nachste-nachbarn · quellen: Karte DD6, DD6 2.4, DD6 7.1 · stand: 2026-10 -->

Überwachtes Klassifikationsverfahren (k-NN), das einen neuen Fall der Mehrheitsklasse seiner k ähnlichsten Trainingsfälle zuordnet.

### Erklärung
1. Abstand des neuen Falls zu jedem Trainingsfall berechnen (meist euklidisch). 2. Die k nächsten Nachbarn auswählen. 3. Mehrheitsentscheid. k-NN ist ein **Lazy Learner**: Das Modell sind die gespeicherten Trainingsdaten, jede Vorhersage ist rechenaufwendig. Skalierte Merkmale sind Pflicht. Zu kleines k ist anfällig für Rauschen, zu großes k lässt weit entfernte Fälle mitstimmen; bei zwei Klassen ein ungerades k wählen.

### Beispiel
Neuer Auftrag N(4|3) (Lieferdauer | Packstücke), k = 3. Nächste Nachbarn: P3(5|3) d = 1,00 „ja“, P2(3|2) d = 1,41 „nein“, P5(3|5) d = 2,24 „nein“ → 2 : 1 für **keine Reklamation**. Mit k = 1 wäre die Vorhersage „ja“.

### Abgrenzung
**K-Means** ist unüberwacht und bildet Cluster. **ID3** liefert ein lesbares Regelwerk; k-NN ist nur am Einzelfall erklärbar („die drei ähnlichsten Aufträge …“).

### Prüfungsfalle
k-NN und k-Means verwechseln oder das Skalieren der Merkmale vergessen.

### Merksatz
Sag mir, wer deine Nachbarn sind, und ich sage dir deine Klasse.

Siehe auch: K-Means · ID3 · Klassifikation · Kreuzvalidierung
Mehr: Deep Dive 6, 7.1 · Deep Dive 6, 7.2

## Kaizen
<!-- id: kaizen · quellen: Karte DD5, DD5 6.2 · stand: 2026-10 -->

Japanisch „Veränderung zum Besseren“: die Haltung hinter dem KVP – ständige kleine Verbesserungen durch die Beschäftigten statt einmaliger großer Würfe.

### Erklärung
Kaizen stammt aus dem Lean Management (Toyota). Verbesserungen kommen von den Menschen, die die Arbeit täglich machen; sie sind klein, risikoarm und laufen dauerhaft, meist im PDCA-Zyklus. Damit das Erreichte nicht verloren geht, wird es als Standard festgeschrieben (SDCA), bevor der nächste Verbesserungsschritt startet.

### Beispiel
Die Werkstatt der Möbelhaus Nordholz GmbH legt jede Woche eine Kleinigkeit fest: feste Ablage für Ersatzteillisten, Checkliste für die Abholung, Vorlage für Kostenvoranschläge. Einzeln unscheinbar, zusammen sinkt die Liegezeit spürbar.

### Abgrenzung
**Business Process Reengineering** ist das Gegenmodell: radikale Neugestaltung „auf der grünen Wiese“ mit großer Wirkung, aber hohem Risiko. **KVP** ist der organisierte Prozess, Kaizen die dahinterstehende Haltung.

### Prüfungsfalle
Kaizen als einmaliges Optimierungsprojekt beschreiben – es ist ein Dauerzustand.

### Merksatz
Kaizen: jeden Tag ein bisschen besser.

Siehe auch: KVP · PDCA · Lean Management
Mehr: Deep Dive 5, 6.2

## Kanban
<!-- id: kanban · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Agile Methode, die den Arbeitsfluss auf einem Board sichtbar macht und die Menge gleichzeitig laufender Arbeit (WIP) begrenzt.

### Erklärung
Arbeit wird nach dem **Pull-Prinzip** gezogen: Erst wenn in einer Spalte Platz unter dem **WIP-Limit** ist, holt sich das Team die nächste Aufgabe. Es gibt keine Sprints und keine vorgeschriebenen Rollen; gesteuert wird über Flusskennzahlen wie die Durchlaufzeit (Lead Time). Engpässe werden sichtbar, weil sich Karten vor einer Spalte stauen. Kanban eignet sich gut für den laufenden Betrieb mit unregelmäßig eintreffenden Aufgaben.

### Beispiel
Das Datenteam bearbeitet Berichtsanfragen der Fachbereiche mit den Spalten To do – In Arbeit (WIP 3) – Test (WIP 2) – Fertig. Stauen sich Karten vor „Test“, hilft das Team dort aus, statt neue Anfragen zu beginnen.

### Abgrenzung
**Scrum** arbeitet in Sprints fester Länge mit festen Rollen und Events; Kanban arbeitet im kontinuierlichen Fluss. Das **Kanban-Board** ist das Werkzeug, Kanban die Methode.

### Prüfungsfalle
Kanban mit einer reinen To-do-Liste gleichsetzen – ohne WIP-Limits fehlt das Kernelement.

### Merksatz
Weniger gleichzeitig anfangen, mehr fertig machen.

Siehe auch: Kanban-Board · Scrum · WIP-Limit
Mehr: Deep Dive 12, Teil 2 · Deep Dive 17, 5.4

## Kanban-Board
<!-- id: kanban-board · quellen: DD17 5.4 · stand: 2026-10 -->

Tafel mit Spalten für die Arbeitsschritte, auf der Karten von links nach rechts wandern; ein WIP-Limit begrenzt die Karten je Spalte.

### Erklärung
Jede Karte steht für eine Aufgabe, jede Spalte für einen Arbeitsschritt. Die Zahl über der Spalte ist das WIP-Limit. Das Board zeigt auf einen Blick, was in Arbeit ist und wo es staut.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 150" width="420" height="150" role="img" aria-label="Kanban-Board mit drei Spalten und WIP-Limit">
<rect x="10" y="10" width="125" height="130" class="dg-grau"/>
<rect x="147" y="10" width="125" height="130" class="dg-grau"/>
<rect x="284" y="10" width="125" height="130" class="dg-grau"/>
<text x="72" y="26" text-anchor="middle" dominant-baseline="middle" class="dg-fett">To do</text>
<text x="209" y="26" text-anchor="middle" dominant-baseline="middle" class="dg-fett">In Arbeit (WIP 2)</text>
<text x="346" y="26" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Fertig</text>
<rect x="22" y="44" width="100" height="24" rx="3" class="dg-form"/>
<text x="72" y="56" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bericht Lager</text>
<rect x="22" y="76" width="100" height="24" rx="3" class="dg-form"/>
<text x="72" y="88" text-anchor="middle" dominant-baseline="middle" class="dg-klein">KPI Retouren</text>
<rect x="159" y="44" width="100" height="24" rx="3" class="dg-akzent"/>
<text x="209" y="56" text-anchor="middle" dominant-baseline="middle" class="dg-klein">ETL Filiale</text>
<rect x="159" y="76" width="100" height="24" rx="3" class="dg-akzent"/>
<text x="209" y="88" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Dashboard</text>
<rect x="296" y="44" width="100" height="24" rx="3" class="dg-gut"/>
<text x="346" y="56" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Datenprüfung</text>
</svg>
```

### Beispiel
„In Arbeit“ ist mit zwei Karten voll. Die Aufgabe „KPI Retouren“ wird erst gezogen, wenn „ETL Filiale“ oder „Dashboard“ fertig ist.

### Abgrenzung
Das **Burndown-Chart** (Scrum) zeigt die offene Arbeit im Sprint über die Zeit; das Kanban-Board zeigt den aktuellen Zustand jeder Aufgabe. Ein **Gantt-Diagramm** plant Termine, das Board steuert den Fluss.

### Prüfungsfalle
Neue Karten in eine volle Spalte schieben – das hebelt das WIP-Limit aus.

### Merksatz
Das Board zeigt den Stau, das WIP-Limit verhindert ihn.

Siehe auch: Kanban · Burndown-Chart · Gantt-Diagramm
Mehr: Deep Dive 17, 5.4

## Kannkaufmann
<!-- id: kannkaufmann · quellen: Karte DD14, DD14 3.1 · stand: 2026-10 -->

Kleingewerbetreibender, der sich freiwillig ins Handelsregister eintragen lässt und erst dadurch Kaufmann wird (§ 2 HGB) – die Eintragung wirkt **konstitutiv** (begründend).

### Erklärung
Ein Kleingewerbe braucht keinen kaufmännisch eingerichteten Geschäftsbetrieb und fällt deshalb nicht automatisch unter das HGB. Mit der freiwilligen Eintragung entscheidet sich der Unternehmer dafür – mit Vorteilen (Firma, Prokura, Ansehen) und Pflichten (Buchführung nach HGB, Rügepflicht beim Handelskauf). Auch land- und forstwirtschaftliche Betriebe können sich nach § 3 HGB eintragen lassen.

### Beispiel
Eine Polsterin mit kleiner Werkstatt lässt sich eintragen, um als „Polsterei Weber e. K.“ aufzutreten. Ab der Eintragung ist sie Kauffrau und muss Mängel bei gelieferten Stoffen unverzüglich rügen.

### Abgrenzung
**Istkaufmann**: Kaufmann durch das Handelsgewerbe, Eintragung nur deklaratorisch. **Formkaufmann**: GmbH oder AG, Kaufmann kraft Rechtsform.

### Prüfungsfalle
Deklaratorisch und konstitutiv vertauschen – beim Kannkaufmann begründet erst die Eintragung den Status.

### Merksatz
Kannkaufmann: Er kann, muss aber nicht – und erst die Eintragung macht ihn zum Kaufmann.

Siehe auch: Istkaufmann · Formkaufmann · Handelsregister
Mehr: Deep Dive 14, 3.1

## Kapitalwert
<!-- id: kapitalwert · quellen: Karte DD12, DD12 4.2 · stand: 2026-10 -->

Ergebnis der Kapitalwertmethode: Summe aller auf heute abgezinsten Rückflüsse minus Investition – ein positiver Wert heißt, die Investition ist vorteilhafter als die Anlage zum Kalkulationszins.

### Erklärung
Die Kapitalwertmethode ist ein **dynamisches** Verfahren: Ein Euro in fünf Jahren ist heute weniger wert als ein Euro heute. Formel: $C_0 = -I_0 + \sum_{t=1}^{n} \dfrac{R_t}{(1 + i)^t}$. Bei gleichen jährlichen Rückflüssen genügt der Rentenbarwertfaktor. $C_0 > 0$: vorteilhaft; $C_0 = 0$: genau Kalkulationszins; $C_0 < 0$: nicht vorteilhaft.

### Beispiel
Investition 45.000 €, jährliche Ersparnis 18.000 €, 5 Jahre, Zins 5 % (Rentenbarwertfaktor 4,3295): $C_0 = -45.000 + 18.000 \cdot 4{,}3295 = 32.931$ € (gerundet). Statisch gerechnet wären es 45.000 € Überschuss – spätere Ersparnisse zählen dynamisch weniger.

### Abgrenzung
Amortisationszeit, ROI, Break-even und Kostenvergleich sind **statische** Verfahren ohne Abzinsung. Der Kapitalwert ist ein Eurobetrag, kein Prozentwert.

### Prüfungsfalle
Den Kapitalwert ohne Abzug der Anfangsinvestition angeben oder mit dem statischen Überschuss verwechseln.

### Merksatz
Kapitalwert: alles auf heute abzinsen, Investition abziehen, Vorzeichen deuten.

Siehe auch: Amortisationszeit · Return on Investment · Kritische Menge
Mehr: Deep Dive 12, 4.2

## Kardinalität
<!-- id: kardinalitat · quellen: Karte DD2, DD2 1.3 · stand: 2026-10 -->

Angabe im ER-Modell, mit wie vielen Ausprägungen einer Entität eine Ausprägung der anderen verbunden sein kann: 1:1, 1:n oder m:n.

### Erklärung
Die Chen-Notation zeigt nur Maximalwerte. Die Min-Max-Notation ergänzt das Minimum, also ob die Teilnahme Pflicht (1) oder optional (0) ist. Kardinalitäten bestimmen die Überführung in Tabellen: Bei 1:n wandert der Primärschlüssel der 1-Seite als Fremdschlüssel auf die n-Seite, m:n wird über eine eigene Beziehungstabelle aufgelöst, das Minimum entscheidet über NOT NULL.

### Beispiel
Chen: KUNDE 1 —— n BESTELLUNG. Min-Max: KUNDE (0,n) — erteilt — (1,1) BESTELLUNG: Ein Kunde hat 0 bis n Bestellungen, jede Bestellung genau einen Kunden. Daraus folgt `bestellung.kunden_id` als Fremdschlüssel mit NOT NULL.

### Abgrenzung
| Notation | Leserichtung |
|---|---|
| Chen, Krähenfuß, UML, MC | Angabe steht bei der **anderen** Entität |
| Min-Max | Angabe steht bei der Entität, deren Teilnahme sie beschreibt |

### Prüfungsfalle
Chen und Min-Max mischen – das n steht in den beiden Notationen auf entgegengesetzten Seiten.

### Merksatz
Erst die Notation bestimmen, dann die Seite lesen.

Siehe auch: Krähenfußnotation · Min-Max-Notation · Chen-Notation · Fremdschlüssel
Mehr: Deep Dive 2, 1.3 · Deep Dive 2, 1.5

## Kartell
<!-- id: kartell · quellen: Karte DD14, DD14 3.4 · stand: 2026-10 -->

Absprache zwischen rechtlich und wirtschaftlich selbstständigen Unternehmen, die den Wettbewerb beschränkt, etwa über Preise, Mengen oder Gebiete.

### Erklärung
Kartelle sind grundsätzlich verboten (§ 1 GWB, auf EU-Ebene Art. 101 AEUV), weil sie Preise künstlich hochhalten und Verbraucher schädigen. Zuständig ist in Deutschland das **Bundeskartellamt**, bei grenzüberschreitenden Fällen die EU-Kommission; es drohen hohe Bußgelder. Ausnahmen gibt es für Vereinbarungen, die Verbrauchern einen angemessenen Anteil am Vorteil bringen (Freistellung).

### Beispiel
Drei Möbelhäuser einer Region vereinbaren, Sofas nicht unter einem gemeinsamen Mindestpreis zu verkaufen – ein verbotenes Preiskartell.

### Abgrenzung
| Form | Selbstständigkeit |
|---|---|
| Kooperation (z. B. Einkaufsgemeinschaft) | rechtlich und wirtschaftlich selbstständig, erlaubt |
| Kartell | selbstständig, aber Wettbewerb abgesprochen, verboten |
| Konzern | rechtlich selbstständig, einheitliche Leitung |
| Fusion | Verschmelzung zu einem Unternehmen |

### Prüfungsfalle
Jede Zusammenarbeit von Unternehmen für ein Kartell halten – eine Arbeits- oder Einkaufsgemeinschaft ist eine zulässige Kooperation.

### Merksatz
Zusammenarbeiten ja, Wettbewerb absprechen nein.

Siehe auch: Kooperation · Konzern · Konzentration
Mehr: Deep Dive 14, 3.4

## Kategorien kodieren
<!-- id: kategorien-kodieren · quellen: DD6 Teil 5 · stand: 2026-10 -->

Umwandlung kategorialer Merkmale in Zahlen, damit rechnende Verfahren sie verarbeiten können – meist per One-Hot-Encoding.

### Erklärung
Beim **One-Hot-Encoding** entsteht je Kategorie eine eigene 0/1-Spalte; genau eine davon ist je Zeile 1. So entsteht keine künstliche Rangfolge. Nötig ist das für abstandsbasierte und rechnende Verfahren wie k-NN, k-Means, lineare oder logistische Regression und neuronale Netze. Entscheidungsbäume wie ID3 können Kategorien dagegen direkt verwenden.

### Beispiel
Spalte „Kategorie“ mit Möbel/Elektronik/Zubehör → drei Spalten: Ein Bürostuhl wird zu Möbel = 1, Elektronik = 0, Zubehör = 0.

### Abgrenzung
Die einfache **Durchnummerierung** (Möbel = 1, Elektronik = 2, Zubehör = 3) unterstellt eine Reihenfolge und gleiche Abstände – sinnvoll nur bei ordinalen Merkmalen wie Prioritätsstufen. **Skalieren** betrifft metrische Merkmale, Kodieren kategoriale.

### Prüfungsfalle
Nominale Kategorien als 1, 2, 3 kodieren – das Modell rechnet dann mit „Elektronik ist doppelt so viel wie Möbel“.

### Merksatz
Nominale Kategorien bekommen je eine 0/1-Spalte, keine Nummer.

Siehe auch: Skalenniveau · K-Nächste-Nachbarn · Nominalskala
Mehr: Deep Dive 6, Teil 5

## Kaufvertrag
<!-- id: kaufvertrag · quellen: Karte DD14, DD14 2.2, DD14 2.4 · stand: 2026-10 -->

Vertrag über die Übertragung des Eigentums an einer Sache gegen Zahlung des Kaufpreises (§ 433 BGB); er entsteht durch zwei übereinstimmende Willenserklärungen, Antrag und Annahme.

### Erklärung
Pflichten des Verkäufers: Sache übergeben und Eigentum mangelfrei verschaffen. Pflichten des Käufers: Kaufpreis zahlen und Sache abnehmen. Schaufenster, Prospekte und Onlineshop-Angebote sind nur eine Aufforderung zur Abgabe eines Angebots; das Angebot macht der Kunde. Bei Mängeln hat der Käufer vorrangig Anspruch auf Nacherfüllung, erst danach Rücktritt oder Minderung, ggf. Schadensersatz; Gewährleistung bei neuen Sachen 2 Jahre.

### Beispiel
Ein Kunde bestellt im Onlineshop des Möbelhauses einen Schreibtisch (Antrag), das Möbelhaus bestätigt die Bestellung per E-Mail (Annahme) – der Kaufvertrag ist geschlossen. Das Eigentum geht erst durch Einigung und Übergabe über.

### Abgrenzung
**Werkvertrag**: Erfolg geschuldet (Software mit festgelegten Funktionen). **Mietvertrag**: entgeltliche Gebrauchsüberlassung ohne Eigentumswechsel. Beim **Eigentumsvorbehalt** bleibt der Verkäufer bis zur vollständigen Zahlung Eigentümer.

### Prüfungsfalle
Die Warenpräsentation im Onlineshop als Angebot werten – sie ist nur die Aufforderung, ein Angebot abzugeben.

### Merksatz
Antrag plus Annahme ergibt den Vertrag – Einigung plus Übergabe das Eigentum.

Siehe auch: Werkvertrag · Eigentumsvorbehalt · Gewährleistung
Mehr: Deep Dive 14, 2.2 · Deep Dive 14, 2.4

## Kausalität
<!-- id: kausalitat · quellen: Karte DD4, DD4 1.3 · stand: 2026-10 -->

Ursache-Wirkungs-Beziehung zwischen zwei Größen; sie lässt sich aus einer Korrelation allein nicht ableiten.

### Erklärung
Eine hohe Korrelation lässt vier Erklärungen zu: x verursacht y, y verursacht x, eine **Drittvariable** beeinflusst beide oder es ist Zufall bzw. eine Scheinkorrelation. Für Kausalität sprechen die zeitliche Abfolge (Ursache vor Wirkung), ein plausibler Wirkmechanismus, ein kontrolliertes Experiment (A/B-Test) und ein Zusammenhang, der über Zeiträume und Teilgruppen stabil bleibt.

### Beispiel
Eisverkauf und Sonnenbrände korrelieren stark – Ursache für beides ist die Sonneneinstrahlung. Im Möbelhaus korrelieren Werbebudget und Umsatz mit r = 0,983; ob die Werbung den Umsatz verursacht, klärt erst ein Test, etwa Werbung in einer Filiale an- und in einer vergleichbaren abschalten.

### Abgrenzung
**Korrelation** beschreibt, dass sich zwei Größen gemeinsam bewegen; Kausalität, dass die eine die andere bewirkt. „Signifikant“ heißt nur „vermutlich kein Zufall“ – nicht kausal.

### Prüfungsfalle
Aus einem hohen r oder R² auf eine Ursache schließen.

### Merksatz
Korrelation ist ein Hinweis, Kausalität braucht einen Beweis.

Siehe auch: Korrelation · Korrelationskoeffizient nach Pearson · Drittvariable
Mehr: Deep Dive 4, 1.3

## Kennzahlentypen
<!-- id: kennzahlentypen · quellen: Karte DD8, DD8 4.1 · stand: 2026-10 -->

Einteilung der Kennzahlen einer Faktentabelle danach, über welche Dimensionen sie summiert werden dürfen: additiv, semi-additiv, nicht-additiv.

### Erklärung
**Additiv**: über alle Dimensionen summierbar (Umsatz, Menge). **Semi-additiv**: über manche Dimensionen summierbar, über die Zeit nicht (Lagerbestand, Kontostand) – über die Zeit verdichtet man mit Stichtagswert oder Durchschnitt. **Nicht-additiv**: gar nicht summierbar (Prozentsätze, Durchschnittspreise, Margen) – sie werden aus den Grundgrößen neu berechnet.

### Beispiel
Lagerbestand Bürostühle: Montag 100, Dienstag 120. Die Summe 220 ist sinnlos; der Monatsendbestand oder der Durchschnitt (110) ist richtig. Die Bestände zweier Filialen am selben Tag (100 + 80 = 180) darf man dagegen addieren. Marge: Summe Deckungsbeitrag / Summe Umsatz, nicht Summe der Einzelmargen.

### Abgrenzung
Semi-additive Kennzahlen stehen typisch in **periodischen Snapshots**, additive in **Transaktions-Faktentabellen**.

### Prüfungsfalle
Im OLAP-Würfel einen Roll-up über die Zeit mit SUM auf den Lagerbestand ausführen.

### Merksatz
Bestände nicht über die Zeit addieren, Quoten nie.

Siehe auch: Faktentabelle · Granularität · Star-Schema
Mehr: Deep Dive 8, 4.1

## Kernprozess
<!-- id: kernprozess · quellen: Karte DD5, DD5 1.1 · stand: 2026-10 -->

Geschäftsprozess, der direkt Kundennutzen stiftet und zur Wertschöpfung des Unternehmens beiträgt.

### Erklärung
Kernprozesse sind die Prozesse, für die der Kunde bezahlt; sie bestimmen die Wettbewerbsfähigkeit. Sie werden von Unterstützungsprozessen ermöglicht und von Führungsprozessen gesteuert. Eine **Prozesslandkarte** zeigt alle drei Arten auf einen Blick. Prozessoptimierung setzt meist zuerst an den Kernprozessen an, weil dort Liegezeiten und Fehler direkt beim Kunden ankommen.

### Beispiel
In der Möbelhaus Nordholz GmbH sind Auftragsabwicklung und Reparaturservice Kernprozesse. IT-Betrieb, Personalwesen und Einkauf sind Unterstützungsprozesse, Strategie und Controlling Führungsprozesse.

### Abgrenzung
| Prozessart | Zweck | Beispiel |
|---|---|---|
| Kernprozess | Kundennutzen, wertschöpfend | Reparaturservice |
| Unterstützungsprozess | ermöglicht Kernprozesse | IT-Betrieb |
| Führungsprozess | steuert das Unternehmen | Controlling |

### Prüfungsfalle
Den IT-Betrieb eines Handelsunternehmens als Kernprozess einstufen, weil er „wichtig“ ist – entscheidend ist der direkte Kundennutzen.

### Merksatz
Kernprozess: Dafür bezahlt der Kunde.

Siehe auch: Unterstützungsprozess · Führungsprozess · Geschäftsprozess
Mehr: Deep Dive 5, 1.1

## Key-Value-Datenbank
<!-- id: key-valu-datenbank · quellen: Karte DD15, DD15 4.1 · stand: 2026-10 -->

NoSQL-Datenbanktyp, der Werte unter einem eindeutigen Schlüssel speichert und darüber extrem schnell liest und schreibt.

Auch: Key-Value

### Erklärung
Die Datenbank kennt nur den Schlüssel; der Wert ist für sie meist eine undurchsichtige Zeichenkette oder ein Objekt. Zugriffe erfolgen fast ausschließlich über den Schlüssel, oft im Arbeitsspeicher. Das macht sie ideal für Sitzungsdaten, Warenkörbe und Caches, aber ungeeignet für Abfragen über Werteinhalte, Joins oder Auswertungen. Bekanntes Beispiel ist Redis.

### Beispiel
Der Warenkorb im Onlineshop des Möbelhauses liegt unter dem Schlüssel `warenkorb:sitzung-8f3a` mit dem Wert `{"produkt_id": 10, "menge": 2}`. Abgerufen wird er bei jedem Seitenaufruf in Millisekunden.

### Abgrenzung
| NoSQL-Typ | Geeignet für |
|---|---|
| Key-Value | Sitzungen, Caches |
| dokumentenorientiert | flexible Produktkataloge |
| Wide Column | riesige Schreiblasten, Sensordaten |
| Graph | Beziehungsnetze |

### Prüfungsfalle
Eine Key-Value-Datenbank für Analysen wie „Umsatz je Kategorie“ vorschlagen – dafür fehlen Abfragen über die Werte.

### Merksatz
Key-Value: Wer den Schlüssel kennt, ist sofort da – alle anderen suchen vergeblich.

Siehe auch: NoSQL · Dokumentenorientierte Datenbank · CAP-Theorem
Mehr: Deep Dive 15, 4.1

## KG
<!-- id: kg · quellen: Karte DD14, DD14 3.2 · stand: 2026-10 -->

Kommanditgesellschaft: Personengesellschaft mit mindestens einem unbeschränkt haftenden **Komplementär** und mindestens einem **Kommanditisten**, der nur bis zur Höhe seiner im Handelsregister eingetragenen Einlage haftet (§§ 161 ff. HGB).

### Erklärung
Die Geschäftsführung und Vertretung liegen beim Komplementär; Kommanditisten haben Kontroll- und Widerspruchsrechte bei außergewöhnlichen Geschäften, führen aber nicht. Kein Mindestkapital, Eintragung in Abteilung A des Handelsregisters. Bei der **GmbH & Co. KG** ist der Komplementär eine GmbH – so ist die Haftung faktisch begrenzt.

### Beispiel
Herr Nordholz (Komplementär) und seine Schwester (Kommanditistin, Einlage 50.000 €) gründen eine KG. Bei einer Insolvenz haftet er mit seinem gesamten Privatvermögen, sie höchstens mit 50.000 € – hat sie die Einlage voll eingezahlt, haftet sie darüber hinaus nicht.

### Abgrenzung
| Rechtsform | Haftung |
|---|---|
| OHG | alle Gesellschafter unbeschränkt |
| KG | Komplementär unbeschränkt, Kommanditist bis zur Einlage |
| GmbH | nur Gesellschaftsvermögen |

### Prüfungsfalle
Dem Kommanditisten die Geschäftsführung zuschreiben – er ist Kapitalgeber, nicht Leiter.

### Merksatz
In der KG führt und haftet der Komplementär, der Kommanditist zahlt ein.

Siehe auch: OHG · GmbH · Handelsregister · Juristische Person
Mehr: Deep Dive 14, 3.2

## KI-Verordnung
<!-- id: ki-verordnung · quellen: Karte DD6, DD6 8.4 · stand: 2026-10 -->

EU-Verordnung über künstliche Intelligenz (AI Act, Verordnung (EU) 2024/1689), die KI-Systeme nach ihrem Risiko einstuft und daran Pflichten knüpft.

### Erklärung
Risikostufen: **verboten** (z. B. Social Scoring, Emotionserkennung am Arbeitsplatz, manipulative Techniken), **hohes Risiko** (z. B. Personalauswahl, Kreditwürdigkeit – Risikomanagement, Datenqualität, Dokumentation, menschliche Aufsicht), **begrenztes Risiko** (Transparenz: KI-Interaktion und Deepfakes kenntlich machen), **minimales Risiko** (z. B. Spamfilter). Zeitplan (Stand 2026, nach dem Digital Omnibus, Verordnung (EU) 2026/1744): Verbote und KI-Kompetenzpflicht ab 2. Februar 2025, Pflichten für KI-Modelle mit allgemeinem Verwendungszweck ab 2. August 2025, allgemeine Anwendbarkeit und Transparenzpflichten ab 2. August 2026, Hochrisiko-Systeme nach Anhang III ab 2. Dezember 2027, nach Anhang I ab 2. August 2028. Bußgelder bis 35 Mio. € oder 7 % des weltweiten Jahresumsatzes.

### Beispiel
Die Personalabteilung will Bewerbungen per KI vorsortieren: ein Hochrisiko-System nach Anhang III mit Pflichten ab 2. Dezember 2027. Unabhängig davon verbietet Art. 22 DSGVO schon heute eine ausschließlich automatisierte Absage.

### Abgrenzung
Die **DSGVO** schützt personenbezogene Daten, die KI-Verordnung regelt das KI-System selbst; bei personenbezogenen Daten gelten beide nebeneinander.

### Prüfungsfalle
Die ursprünglichen Termine (Hochrisiko ab 2. August 2026) als geltend angeben.

### Merksatz
Je höher das Risiko, desto strenger die Pflichten – bis zum Verbot.

Siehe auch: Künstliche Intelligenz · DSGVO · Machine Learning
Mehr: Deep Dive 6, 8.4

## Kirchensteuer
<!-- id: kirchensteur · quellen: Karte DD14, DD14 1.4 · stand: 2026-10 -->

Steuer für Mitglieder steuererhebender Religionsgemeinschaften, die beim Arbeitnehmer als Zuschlag zur Lohnsteuer einbehalten wird: 8 % in Bayern und Baden-Württemberg, 9 % in den übrigen Ländern.

### Erklärung
Bemessungsgrundlage ist die **Lohnsteuer**, nicht das Bruttoentgelt. Wer keine Lohnsteuer zahlt, zahlt auch keine Kirchensteuer. Der Arbeitgeber behält sie ein und führt sie mit der Lohnsteuer an das Finanzamt ab. Im Schema vom Brutto zum Netto steht sie neben Lohnsteuer und Solidaritätszuschlag.

### Beispiel
Lohnsteuer 150 € im Monat: in Niedersachsen 9 % = 13,50 € Kirchensteuer, in Bayern 8 % = 12,00 €. Jonas zahlt bei 1.200 € Vergütung keine Lohnsteuer – und damit auch keine Kirchensteuer.

### Abgrenzung
Der **Solidaritätszuschlag** (5,5 % der Lohnsteuer) fällt seit 2021 nur noch bei hohen Einkommen an; die Kirchensteuer nur bei Kirchenmitgliedschaft, dafür ohne solche Freigrenze. Beides sind Zuschläge auf die Lohnsteuer, keine Sozialabgaben.

### Prüfungsfalle
8 oder 9 % vom Bruttolohn rechnen statt von der Lohnsteuer.

### Merksatz
Kirchensteuer: 8 oder 9 % der Lohnsteuer – nicht des Bruttos.

Siehe auch: Lohnsteuer · Solidaritätszuschlag · Nettoentgelt
Mehr: Deep Dive 14, 1.4

## Klammern bei AND/OR
<!-- id: klammern-bei-and-or · quellen: SQL-Zusatz 2.2 · stand: 2026-10 -->

Regel für SQL-Bedingungen: AND bindet stärker als OR, deshalb müssen OR-Teile, die zusammengehören, geklammert werden.

### Erklärung
Ohne Klammern wertet SQL `A OR B AND C` als `A OR (B AND C)` – wie „Punkt vor Strich“. Die Abfrage läuft dann fehlerfrei, liefert aber zu viele Zeilen. Wer AND und OR mischt, setzt immer Klammern, auch wenn sie im Einzelfall überflüssig wären; das macht die Absicht lesbar.

### Beispiel
Gesucht: Kunden aus Köln oder Hamburg, registriert ab 2025.
```sql
-- richtig
WHERE (ort = 'Köln' OR ort = 'Hamburg') AND registriert_am >= '2025-01-01'
-- falsch: liefert alle Kölner, auch die von 2024
WHERE ort = 'Köln' OR ort = 'Hamburg' AND registriert_am >= '2025-01-01'
```

### Abgrenzung
`IN` vermeidet das Problem bei Alternativen derselben Spalte: `WHERE ort IN ('Köln', 'Hamburg') AND registriert_am >= '2025-01-01'`.

### Prüfungsfalle
Die fehlenden Klammern übersehen, weil die Abfrage ohne Fehlermeldung läuft – der Fehler steckt im Ergebnis.

### Merksatz
AND vor OR – wer mischt, klammert.

Siehe auch: WHERE · AND · OR · HAVING
Mehr: SQL-Zusatz, 2.2

## Klasse
<!-- id: klasse · quellen: DD15 5.3, DD17 2.3 · stand: 2026-10 -->

Baustein des UML-Klassendiagramms: Rechteck mit den drei Abschnitten Name, Attribute und Methoden, das gleichartige Objekte beschreibt.

### Erklärung
Attribute und Methoden tragen eine **Sichtbarkeit**: + public, − private, # protected, ~ package. Schreibweise: `− bestand: Integer`, `+ berechneSumme(): Decimal`. Abstrakte Klassen (von denen es keine direkten Objekte gibt) stehen kursiv. Ein Objekt ist eine konkrete Ausprägung einer Klasse.

### Beispiel
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 115" width="280" height="115" role="img" aria-label="UML-Klasse Reparaturauftrag mit den privaten Attributen auftragsnr und status und der öffentlichen Methode abschliessen">
<rect x="20" y="12" width="240" height="91" class="dg-form"/>
<line x1="20" y1="36" x2="260" y2="36" class="dg-linie"/>
<text x="140" y="24" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Reparaturauftrag</text>
<text x="28" y="48.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">− auftragsnr: Integer</text>
<text x="28" y="65.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">− status: String</text>
<text x="28" y="90.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">+ abschliessen(): void</text>
<line x1="20" y1="78" x2="260" y2="78" class="dg-linie"/>
</svg>
```

### Abgrenzung
Im **ERM** entspricht die Klasse grob dem Entitätstyp – aber ohne Methoden. Die Klasse ist der Bauplan, das **Objekt** der einzelne Auftrag 5001.

### Prüfungsfalle
Sichtbarkeitszeichen vertauschen: − ist private, # ist protected.

### Merksatz
Klasse = Name, Attribute, Methoden – plus, minus, Raute, Tilde für die Sichtbarkeit.

Siehe auch: Klassendiagramm · Komposition · Assoziation · Generalisierung
Mehr: Deep Dive 15, 5.3 · Deep Dive 17, 2.3

## Klassenbildung
<!-- id: klassenbildung · quellen: Karte DD3, DD3 Teil 2 · stand: 2026-10 -->

Einteilung metrischer Werte in gleich breite, lückenlose und überschneidungsfreie Klassen, z. B. „30 bis unter 45 Minuten“; gerechnet wird dann mit der Klassenmitte.

### Erklärung
Viele verschiedene Messwerte werden so zu einer übersichtlichen Häufigkeitsverteilung, etwa für ein Histogramm. Jede Klasse hat eine untere und eine obere Grenze; „bis unter“ sorgt dafür, dass jeder Wert genau einer Klasse angehört. Liegen nur klassierte Daten vor, dient die **Klassenmitte** als Rechenwert – das kostet Genauigkeit.

### Beispiel
Bearbeitungsdauern: 30 bis unter 45 min (8 Aufträge), 45 bis unter 60 min (12 Aufträge). Klassenmitten 37,5 und 52,5 min. Mittelwert: $\frac{8 \cdot 37{,}5 + 12 \cdot 52{,}5}{20} = \frac{300 + 630}{20} = 46{,}5$ min.

### Abgrenzung
Klassen „30–45“ und „45–60“ überschneiden sich bei 45 – das ist der typische Fehler. Kategorien bei nominalen Daten (Reklamationsgrund) sind keine Klassen im statistischen Sinn, sie müssen nicht gebildet werden.

### Prüfungsfalle
Überlappende oder lückenhafte Grenzen wählen oder mit Klassengrenzen statt Klassenmitten rechnen.

### Merksatz
Gleich breit, lückenlos, überschneidungsfrei – und rechnen mit der Mitte.

Siehe auch: Histogramm · Kumulierte Häufigkeit · Gewichtetes arithmetisches Mittel
Mehr: Deep Dive 3, Teil 2

## Klassendiagramm
<!-- id: klassendiagramm · quellen: Karte DD15, DD15 5.3, DD17 2.3 · stand: 2026-10 -->

UML-Strukturdiagramm, das Klassen mit Attributen und Methoden sowie ihre Beziehungen zeigt; Grundlage für Programm- und Datenbankentwurf.

### Erklärung
Beziehungen: **Assoziation** (Linie mit Multiplizitäten wie 1, 0..1, 0..*, 1..*), **Aggregation** (leere Raute am Ganzen, Teile existieren auch allein), **Komposition** (gefüllte Raute am Ganzen, Teile existieren nicht ohne das Ganze), **Generalisierung** (Linie mit leerem Dreieck zur Oberklasse). Multiplizitäten werden wie bei Chen gelesen: Die Angabe steht bei der anderen Klasse.

### Beispiel
`Kunde 1 ——— 0..* Reparaturauftrag`: Ein Kunde hat 0 bis viele Aufträge, jeder Auftrag gehört zu genau einem Kunden. In Min-Max: KUNDE (0,n) — (1,1) REPARATURAUFTRAG.

### Abgrenzung
Das **ERM** modelliert nur Daten, das Klassendiagramm auch Verhalten (Methoden). Das **Sequenzdiagramm** zeigt den zeitlichen Ablauf von Nachrichten, das Klassendiagramm die statische Struktur.

### Prüfungsfalle
Multiplizitäten auf die falsche Seite setzen oder Aggregation und Komposition verwechseln.

### Merksatz
Klassendiagramm = Bauplan: was es gibt und wie es zusammenhängt.

Siehe auch: Klasse · Komposition · Aggregation · Sequenzdiagramm
Mehr: Deep Dive 15, 5.3 · Deep Dive 17, 2.3

## Klassifikation
<!-- id: klassifikation · quellen: Karte DD6, DD6 2.3 · stand: 2026-10 -->

Überwachtes Lernverfahren, das für einen Fall eine Kategorie vorhersagt, z. B. Reklamation ja/nein.

### Erklärung
Grundlage sind gelabelte Trainingsdaten, bei denen die richtige Klasse bekannt ist. Verfahren: Entscheidungsbaum (ID3), k-Nächste-Nachbarn, logistische Regression, Naive Bayes, Random Forest, neuronale Netze. Die Güte misst man mit der Konfusionsmatrix und daraus Accuracy, Precision, Recall und F1-Maß – bei unausgeglichenen Klassen nie nur mit der Accuracy.

### Beispiel
Aus Lieferdauer, Spediteur und Verpackung früherer Aufträge lernt ein Entscheidungsbaum, ob ein neuer Auftrag voraussichtlich reklamiert wird. Gefährdete Aufträge werden vor dem Versand geprüft.

### Abgrenzung
| | Klassifikation | Regression | Clustering |
|---|---|---|---|
| Lernart | überwacht | überwacht | unüberwacht |
| Ergebnis | Kategorie | Zahl | Gruppen ohne Vorgabe |

### Prüfungsfalle
Die logistische Regression wegen ihres Namens für ein Regressionsverfahren halten – sie klassifiziert.

### Merksatz
Habe ich Labels und suche eine Kategorie? Dann Klassifikation.

Siehe auch: Regression · K-Nächste-Nachbarn · ID3 · Konfusionsmatrix
Mehr: Deep Dive 6, 2.3 · Deep Dive 6, Teil 7

## Koalitionsfreiheit
<!-- id: koalitionsfreiheit · quellen: Karte DD13, DD13 5.1 · stand: 2026-10 -->

Grundrecht aus Art. 9 Abs. 3 GG, Vereinigungen zur Wahrung der Arbeits- und Wirtschaftsbedingungen – Gewerkschaften und Arbeitgeberverbände – zu bilden, ihnen beizutreten oder fernzubleiben.

### Erklärung
Aus der Koalitionsfreiheit folgt die **Tarifautonomie**: Gewerkschaften und Arbeitgeberseite handeln Löhne und Arbeitsbedingungen ohne staatliche Einmischung in Tarifverträgen aus und dürfen dafür Arbeitskämpfe führen (Streik, Aussperrung). Abreden, die dieses Recht einschränken, sind nichtig. Geschützt ist auch die negative Koalitionsfreiheit: niemand muss Mitglied werden.

### Beispiel
Eine Mitarbeiterin der Möbelhaus Nordholz GmbH tritt der Gewerkschaft ver.di bei. Der Arbeitgeber darf sie deshalb nicht benachteiligen, und die Frage nach der Gewerkschaftszugehörigkeit gehört nicht ins Zeugnis.

### Abgrenzung
Die **Tarifautonomie** ist die Folge, die Koalitionsfreiheit das Grundrecht. Die betriebliche Mitbestimmung (Betriebsrat) beruht dagegen auf dem BetrVG, nicht auf Art. 9 Abs. 3 GG.

### Prüfungsfalle
Annehmen, der Staat lege die Tariflöhne fest – er setzt nur Untergrenzen wie den Mindestlohn.

### Merksatz
Art. 9 Abs. 3 GG: Zusammenschließen ist frei – und die Tarifpartner verhandeln selbst.

Siehe auch: Tarifvertrag · Tarifautonomie · Streik
Mehr: Deep Dive 13, 5.1

## Kölner Phonetik
<!-- id: kolner-phonetik · quellen: Karte DD9, DD9 4.2 · stand: 2026-10 -->

Phonetisches Verfahren, das deutsche Wörter nach ihrem Klang in einen Zifferncode umwandelt, sodass gleich klingende Schreibweisen denselben Code erhalten.

### Erklärung
Jeder Buchstabe erhält abhängig vom Nachbarbuchstaben eine Ziffer (Vokale 0, M/N 6, R 7, L 5 …); danach werden doppelte Ziffern zusammengefasst und Nullen außer am Anfang gestrichen. Das Verfahren dient der Suche nach **unscharfen Dubletten** in Namen und ist auf die deutsche Aussprache zugeschnitten – im Englischen erfüllt Soundex diese Aufgabe.

### Beispiel
„Meier“, „Mayer“ und „Maier“ ergeben alle den Code 67; „Müller“ und „Mueller“ ergeben 657. Eine Dublettenprüfung in der Kundentabelle findet so „Maier, Köln“ und „Meier, Köln“ als Kandidatenpaar.

### Abgrenzung
Die **Levenshtein-Distanz** zählt Einfüge-, Lösch- und Ersetzungsschritte zwischen Zeichenketten („Müller“ → „Mueller“ = 2) und misst Schreibähnlichkeit statt Klangähnlichkeit.

### Prüfungsfalle
Gleicher Code als Beweis für eine Dublette werten – das ist nur ein Kandidat, der mit weiteren Feldern (PLZ, Geburtsdatum) bestätigt werden muss.

### Merksatz
Kölner Phonetik findet, was gleich klingt, aber anders geschrieben wird.

Siehe auch: Dublette · Levenshtein-Distanz · Golden Record
Mehr: Deep Dive 9, 4.2

## Kombiniertes Fragment
<!-- id: kombiniertes-fragment · quellen: DD17 2.5 · stand: 2026-10 -->

Rahmen im UML-Sequenzdiagramm, der einen Abschnitt des Nachrichtenaustauschs mit einem Operator versieht: alt, opt, loop oder par.

### Erklärung
Der Operator steht in einem kleinen Fünfeck oben links im Rahmen, Bedingungen in eckigen Klammern. **alt**: Alternativen, durch gestrichelte Linien getrennt, genau eine läuft (wie if/else). **opt**: optionaler Abschnitt, läuft nur bei erfüllter Bedingung (if ohne else). **loop**: Wiederholung. **par**: parallele Abschnitte.

### Beispiel
API-Aufruf der Filiale: Rahmen **alt** mit `[Auftrag gefunden]` → API antwortet 200 mit JSON, und `[nicht gefunden]` → API antwortet 404. Ein Rahmen **loop** `[für jede Position]` umschließt die Abfrage der Ersatzteile.

### Abgrenzung
Im **Aktivitätsdiagramm** werden Verzweigungen mit Rauten und Parallelität mit Balken dargestellt; im Sequenzdiagramm übernimmt das der Rahmen mit Operator.

### Prüfungsfalle
opt und alt verwechseln – opt hat nur einen Abschnitt, alt mindestens zwei.

### Merksatz
alt = entweder oder, opt = vielleicht, loop = wiederholt, par = gleichzeitig.

Siehe auch: Sequenzdiagramm · Lebenslinie · Aktivitätsdiagramm
Mehr: Deep Dive 17, 2.5

## Komponententest
<!-- id: komponententest · quellen: Karte DD16, DD16 2.1 · stand: 2026-10 -->

Unterste Teststufe (Modul-, Unit-Test): Einzelne Bausteine wie eine Funktion, ein SQL-Skript oder eine Transformation werden isoliert getestet, meist von den Entwicklern selbst.

### Erklärung
Grundlage ist der technische Entwurf; im V-Modell steht der Komponententest dem Komponentenentwurf gegenüber. Typisch sind White-Box-Verfahren wie Anweisungs- und Zweigüberdeckung. Komponententests sind schnell und billig und bilden die breite Basis der **Testpyramide**; automatisiert laufen sie bei jeder Änderung als Regressionstests mit (TDD).

### Beispiel
Die SQL-Funktion zur Rabattberechnung wird mit einer kleinen Testtabelle geprüft: 499,99 € → 0 %, 500,00 € → 5 %, 2.000,00 € → 10 % – unabhängig von Shop und Data Warehouse.

### Abgrenzung
| Teststufe | prüft | Grundlage |
|---|---|---|
| Komponententest | einzelnen Baustein | technischer Entwurf |
| Integrationstest | Schnittstellen | Architektur |
| Systemtest | Gesamtsystem | Pflichtenheft |
| Abnahmetest | Einsatzeignung | Lastenheft |

### Prüfungsfalle
Den Komponententest dem Fachbereich zuordnen – der testet erst bei der Abnahme.

### Merksatz
Komponententest: das kleinste Teil allein auf dem Prüfstand.

Siehe auch: Integrationstest · Systemtest · Abnahmetest · Testpyramide
Mehr: Deep Dive 16, 2.1

## Komposition
<!-- id: komposition · quellen: Karte DD15, DD15 5.3, DD17 2.3 · stand: 2026-10 -->

Starke Teil-Ganzes-Beziehung im UML-Klassendiagramm: Die Teile gehören zu genau einem Ganzen und existieren nicht ohne es; Symbol ist die gefüllte Raute am Ganzen.

### Erklärung
Wird das Ganze gelöscht, werden die Teile mitgelöscht. In der Datenbank entspricht das einem Fremdschlüssel mit NOT NULL und `ON DELETE CASCADE`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 110" width="440" height="110" role="img" aria-label="Komposition mit gefüllter Raute und Aggregation mit leerer Raute">
<rect x="10" y="10" width="110" height="30" class="dg-form"/>
<text x="65" y="25" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellung</text>
<polygon points="120,25 132,18 144,25 132,32" class="dg-voll"/>
<line x1="144" y1="25" x2="300" y2="25" class="dg-linie"/>
<rect x="300" y="10" width="130" height="30" class="dg-form"/>
<text x="365" y="25" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellposition</text>
<text x="220" y="15" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Komposition</text>
<rect x="10" y="70" width="110" height="30" class="dg-form"/>
<text x="65" y="85" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Filiale</text>
<polygon points="120,85 132,78 144,85 132,92" class="dg-form"/>
<line x1="144" y1="85" x2="300" y2="85" class="dg-linie"/>
<rect x="300" y="70" width="130" height="30" class="dg-form"/>
<text x="365" y="85" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Mitarbeiter</text>
<text x="220" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Aggregation</text>
</svg>
```

### Beispiel
Eine Bestellposition ohne Bestellung ergibt keinen Sinn – Komposition. Ein Mitarbeiter existiert auch, wenn seine Filiale geschlossen wird – Aggregation.

### Abgrenzung
**Aggregation** (leere Raute): Teile existieren auch ohne das Ganze und können mehreren Ganzen zugeordnet sein. Normale **Assoziation**: keine Teil-Ganzes-Beziehung.

### Prüfungsfalle
Die Raute an das Teil statt an das Ganze zeichnen.

### Merksatz
Gefüllte Raute: Das Teil stirbt mit dem Ganzen.

Siehe auch: Aggregation · Klassendiagramm · Assoziation
Mehr: Deep Dive 15, 5.3 · Deep Dive 17, 2.3

## Konfidenz
<!-- id: konfidenz · quellen: Karte DD6, DD6 4.1, DD6 4.2 · stand: 2026-10 -->

Kennzahl der Assoziationsanalyse für die Regel A → B: Anteil der Warenkörbe mit A, die auch B enthalten.

### Erklärung
$\text{Konfidenz}(A \to B) = \frac{\text{Support}(A \text{ und } B)}{\text{Support}(A)}$. Sie beschreibt, wie zuverlässig die Regel ist, wenn A vorliegt. Die Konfidenz ist **richtungsabhängig**: A → B und B → A haben meist verschiedene Werte. Im Apriori-Algorithmus wird eine Mindestkonfidenz vorgegeben.

### Beispiel
Zehn Warenkörbe, Schreibtisch (S) in 5, Bürostuhl (B) in 6, beide in 4. S → B: $\frac{0{,}40}{0{,}50} = 80\ \%$. B → S: $\frac{0{,}40}{0{,}60} = 66{,}7\ \%$. Der Lift ist in beiden Richtungen $\frac{0{,}80}{0{,}60} = 1{,}33$.

### Abgrenzung
| Kennzahl | Frage |
|---|---|
| Support | Wie häufig kommt die Kombination vor? |
| Konfidenz | Wie oft folgt B, wenn A gekauft wird? |
| Lift | Wie viel häufiger als zufällig? |

### Prüfungsfalle
Eine hohe Konfidenz als echten Zusammenhang werten – liegt B ohnehin in fast jedem Warenkorb, ist die Konfidenz jeder Regel auf B hoch; erst ein Lift über 1 zeigt den Zusammenhang.

### Merksatz
Konfidenz zählt die Richtung, Lift prüft den Zufall.

Siehe auch: Support · Lift · Assoziationsanalyse · Apriori-Algorithmus
Mehr: Deep Dive 6, 4.1 · Deep Dive 6, 4.2

## Konfusionsmatrix
<!-- id: konfusionsmatrix · quellen: Karte DD7, DD7 Teil 2, DD17 6.10 · stand: 2026-10 -->

Vierfeldertafel eines Klassifikators, die tatsächliche und vorhergesagte Klassen gegenüberstellt (TP, FP, FN, TN) und Grundlage aller Klassifikationskennzahlen ist.

### Erklärung
Zuerst wird die **positive Klasse** festgelegt, meist das seltene, interessierende Ereignis. Der erste Buchstabe sagt, ob die Vorhersage richtig war (T/F), der zweite, was vorhergesagt wurde (P/N). FP heißt Fehler 1. Art, FN Fehler 2. Art. Daraus folgen Accuracy (TP + TN) / Gesamt, Precision TP / (TP + FP), Recall TP / (TP + FN), Spezifität TN / (TN + FP) und das F1-Maß.

### Beispiel
1.000 Aufträge, 100 tatsächlich reklamiert:

| | Vorhersage ja | Vorhersage nein |
|---|---|---|
| tatsächlich ja | TP = 60 | FN = 40 |
| tatsächlich nein | FP = 90 | TN = 810 |

Accuracy 87 %, Precision 40 %, Recall 60 %, Spezifität 90 %. Ein Modell, das immer „nein“ sagt, käme auf 90 % Accuracy bei 0 % Recall.

### Abgrenzung
Die **ROC-Kurve** zeigt Recall und Falsch-Positiv-Rate über alle Schwellenwerte; die Konfusionsmatrix gilt für genau einen Schwellenwert.

### Prüfungsfalle
FN und FP vertauschen – FN ist ein übersehener positiver Fall, nicht ein Fehlalarm.

### Merksatz
Erst die positive Klasse festlegen, dann die vier Felder füllen.

Siehe auch: Precision · Recall · Accuracy · ROC-Kurve
Mehr: Deep Dive 7, Teil 2 · Deep Dive 17, 6.10

## Konjunkturphasen
<!-- id: konjunkturphasen · quellen: Karte DD14, DD14 4.4 · stand: 2026-10 -->

Die vier wiederkehrenden Phasen der wirtschaftlichen Entwicklung: Aufschwung → Hochkonjunktur (Boom) → Abschwung (Rezession) → Tiefstand (Depression).

### Erklärung
**Aufschwung**: Nachfrage, Produktion und Investitionen steigen, die Arbeitslosigkeit sinkt. **Hochkonjunktur**: Kapazitäten ausgelastet, Preise und Löhne steigen stark. **Abschwung**: Nachfrage und Investitionen sinken, Arbeitslosigkeit steigt. **Tiefstand**: niedrige Auslastung, hohe Arbeitslosigkeit, schwacher Preisauftrieb. Frühindikatoren (Auftragseingänge, Geschäftsklima) zeigen Wendepunkte vorab, Spätindikatoren (Arbeitslosenquote, Preise) reagieren verzögert.

### Beispiel
Steigen die Auftragseingänge der Möbelhersteller mehrere Monate in Folge, deutet das auf einen Aufschwung hin, obwohl die Arbeitslosenquote noch hoch ist.

### Abgrenzung
**Antizyklische Fiskalpolitik** steuert gegen: im Abschwung Ausgaben erhöhen und Steuern senken, im Boom Ausgaben kürzen und Rücklagen bilden. Die EZB wirkt über den Leitzins auf die Preisstabilität.

### Prüfungsfalle
Die Arbeitslosenquote als Frühindikator nennen – sie ist ein Spätindikator.

### Merksatz
Hoch, runter, unten, rauf – Auftragseingänge sehen es zuerst, die Arbeitslosenquote zuletzt.

Siehe auch: Leitzins · Inflation · Bruttoinlandsprodukt
Mehr: Deep Dive 14, 4.4

## Konnektoren
<!-- id: konnektoren · quellen: Karte DD5, DD5 2.3, DD17 1.2 · stand: 2026-10 -->

Verknüpfungsoperatoren der EPK zum Verzweigen und Zusammenführen: XOR (genau einer), OR (einer oder mehrere), AND (alle).

Auch: Konnektor

### Erklärung
Konnektoren werden als Kreis mit XOR, ∨ (OR) oder ∧ (AND) gezeichnet. Ein Konnektor spaltet entweder auf oder führt zusammen; ein geöffneter Konnektor wird mit demselben Typ geschlossen. Nach einem einzelnen Ereignis darf kein XOR- oder OR-Split folgen, weil Ereignisse passiv sind und nicht entscheiden; erlaubt ist dort nur ein AND-Split.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 90" width="330" height="90" role="img" aria-label="EPK-Konnektoren XOR, OR und AND">
<circle cx="55" cy="35" r="20" class="dg-form"/>
<text x="55" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">XOR</text>
<text x="55" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">genau einer</text>
<circle cx="165" cy="35" r="20" class="dg-form"/>
<text x="165" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-fett">∨</text>
<text x="165" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">OR: mindestens einer</text>
<circle cx="275" cy="35" r="20" class="dg-form"/>
<text x="275" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-fett">∧</text>
<text x="275" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">AND: alle</text>
</svg>
```

### Beispiel
Funktion „Bestellung prüfen“ → XOR → Ereignisse „Bestellung ist gültig“ oder „Bestellung ist ungültig“. Die Entscheidung trifft die Funktion, der Konnektor verzweigt nur.

### Abgrenzung
In BPMN übernehmen **Gateways** (Rauten mit X, +, O) diese Aufgabe. Der AND-Konnektor entspricht dem parallelen Gateway.

### Prüfungsfalle
Direkt nach dem Startereignis mit XOR verzweigen – davor fehlt die entscheidende Funktion.

### Merksatz
Ereignisse entscheiden nicht – nach ihnen nur AND.

Siehe auch: EPK · Erweiterte EPK (eEPK) · BPMN · AND-Gateway
Mehr: Deep Dive 5, 2.3 · Deep Dive 17, 1.2

## Konsistenz
<!-- id: konsistenz · quellen: Karte DD9, DD9 Teil 1 · stand: 2026-10 -->

Datenqualitätsdimension: Die Werte sind widerspruchsfrei – innerhalb eines Datensatzes, zwischen Tabellen und zwischen Systemen.

### Erklärung
Geprüft wird über Kreuzvergleiche: Passen zwei Felder logisch zusammen, stimmt derselbe Kunde in CRM und ERP überein, verweisen Fremdschlüssel auf existierende Datensätze? Ursachen für Inkonsistenz sind Redundanz (dieselbe Information mehrfach gespeichert), fehlende Constraints und unabhängige Pflege in mehreren Systemen. Vorbeugend wirken Normalisierung, CHECK- und FOREIGN-KEY-Constraints sowie Stammdatenmanagement.

### Beispiel
```sql
SELECT bestell_id FROM bestellung
WHERE lieferdatum < bestelldatum;
```
Jeder Treffer ist ein Widerspruch: Geliefert vor bestellt geht nicht.

### Abgrenzung
**Korrektheit** fragt, ob ein Wert der Realität entspricht; Konsistenz, ob Werte einander widersprechen. Zwei konsistente Werte können trotzdem beide falsch sein. Das C in ACID meint die Einhaltung der Integritätsregeln einer Datenbank bei Transaktionen.

### Prüfungsfalle
Konsistenz mit Vollständigkeit verwechseln – ein leeres Feld ist unvollständig, nicht widersprüchlich.

### Merksatz
Konsistent heißt: Die Daten widersprechen sich nicht.

Siehe auch: Korrektheit · Datenqualität · Vollständigkeit · ISO/IEC 25012
Mehr: Deep Dive 9, Teil 1

## Konstruktive Qualitätssicherung
<!-- id: konstruktive-qualitatssicherung · quellen: Karte DD16, DD16 1.1 · stand: 2026-10 -->

Maßnahmen, die Fehler von vornherein vermeiden, statt sie nachträglich zu finden.

### Erklärung
Sie wirkt vor und während der Entwicklung: Namenskonventionen, Vorlagen, Programmier- und Modellierungsrichtlinien, Schulung, Validierungsregeln im Eingabeformular, Vier-Augen-Prinzip beim Entwurf und Versionsverwaltung (z. B. Git) für SQL-Skripte und ETL-Jobs. Jeder Fehler, der gar nicht erst entsteht, spart die teure Suche und Korrektur in späten Phasen.

### Beispiel
Für das Datenteam der Möbelhaus Nordholz GmbH gilt eine SQL-Stilrichtlinie, jede Berichtsdefinition liegt versioniert in Git, und im Kundenformular ist die PLZ als fünfstelliger Text mit Musterprüfung hinterlegt.

### Abgrenzung
| | konstruktiv | analytisch |
|---|---|---|
| Ziel | Fehler vermeiden | Fehler finden |
| Zeitpunkt | vor und während der Entwicklung | nach einem (Teil-)Ergebnis |
| Beispiele | Richtlinien, Vorlagen, Schulung | Tests, Reviews, Datenabgleich |

### Prüfungsfalle
Tests oder Reviews als konstruktive Maßnahmen nennen – sie prüfen ein fertiges Ergebnis und sind analytisch.

### Merksatz
Konstruktiv verhindert, analytisch entdeckt.

Siehe auch: Analytische Qualitätssicherung · Review · Versionsverwaltung
Mehr: Deep Dive 16, 1.1

## Konzentration
<!-- id: konzentration · quellen: DD14 3.4 · stand: 2026-10 -->

Unternehmenszusammenschluss, bei dem die beteiligten Unternehmen ihre wirtschaftliche Selbstständigkeit aufgeben – als Konzern oder als Fusion.

### Erklärung
Beim **Konzern** bleiben die Unternehmen rechtlich selbstständig, stehen aber unter einheitlicher Leitung (meist über Kapitalbeteiligung). Bei der **Fusion** verschmelzen sie zu einem Unternehmen und verlieren auch die rechtliche Selbstständigkeit. Große Zusammenschlüsse muss das **Bundeskartellamt** im Rahmen der Fusionskontrolle vorab prüfen; es kann sie untersagen, wenn sie den Wettbewerb erheblich behindern.

### Beispiel
Die Möbelhaus Nordholz GmbH erwirbt 100 % der Anteile einer Polsterei; diese bleibt als GmbH bestehen, wird aber von Nordholz gesteuert – ein Konzern. Gehen beide in einer neuen Gesellschaft auf, ist es eine Fusion.

### Abgrenzung
**Kooperation**: Unternehmen bleiben rechtlich und wirtschaftlich selbstständig und arbeiten nur in Teilbereichen zusammen. **Kartell**: verbotene Absprache selbstständiger Unternehmen über den Wettbewerb.

### Prüfungsfalle
Konzern und Fusion gleichsetzen – im Konzern existieren die Unternehmen rechtlich weiter.

### Merksatz
Konzentration: Die wirtschaftliche Selbstständigkeit geht verloren – im Konzern bleibt die rechtliche, bei der Fusion nicht.

Siehe auch: Konzern · Kooperation · Kartell
Mehr: Deep Dive 14, 3.4

## Konzeptionelles Datenmodell
<!-- id: konzeptionelles-datenmodell · quellen: Karte DD2, DD2 1.1 · stand: 2026-10 -->

Erste Ebene der Datenmodellierung: fachliche, technikunabhängige Sicht als ER-Modell – was gibt es, und wie hängt es zusammen?

Auch: Konzeptionell

### Erklärung
Das konzeptionelle Modell beschreibt Entitätstypen, Attribute, Beziehungen und Kardinalitäten in der Sprache des Fachbereichs, ohne Tabellen, Datentypen oder Datenbanksystem. Es ist Diskussionsgrundlage mit dem Auftraggeber. Danach folgt das **logische** Modell (Relationenmodell mit Primär- und Fremdschlüsseln) und das **physische** Modell (SQL/DDL mit Datentypen und Indizes).

### Beispiel
KUNDE (0,n) — erteilt — (1,1) BESTELLUNG (1,n) — enthält — (0,n) PRODUKT. Ob die Kundennummer INTEGER oder VARCHAR wird, spielt hier noch keine Rolle.

### Abgrenzung
| Ebene | Darstellung |
|---|---|
| konzeptionell | ER-Modell |
| logisch | Tabellen, Schlüssel |
| physisch | CREATE TABLE, Datentypen, Indizes |

### Prüfungsfalle
Schon im ER-Modell Fremdschlüssel oder Zwischentabellen einzeichnen – die entstehen erst bei der Überführung ins Relationenmodell.

### Merksatz
Konzeptionell: was es gibt – logisch: in welchen Tabellen – physisch: in welcher Datenbank.

Siehe auch: Logisches Datenmodell · Physisches Datenmodell · Entität · Kardinalität
Mehr: Deep Dive 2, 1.1

## Konzern
<!-- id: konzern · quellen: Karte DD14, DD14 3.4 · stand: 2026-10 -->

Zusammenschluss rechtlich selbstständiger Unternehmen unter einheitlicher Leitung (§ 18 AktG).

### Erklärung
Die Leitung entsteht meist über eine Mehrheitsbeteiligung: Die Muttergesellschaft hält die Anteile der Tochtergesellschaften und steuert sie. Jede Gesellschaft bleibt eine eigene juristische Person mit eigenen Verträgen und eigener Haftung, ist wirtschaftlich aber nicht mehr selbstständig. Konzerne stellen einen Konzernabschluss auf; große Zusammenschlüsse prüft das Bundeskartellamt.

### Beispiel
Eine Holding hält Mehrheiten an der Möbelhaus Nordholz GmbH, einem Logistikunternehmen und einer Polsterei. Alle drei bleiben GmbHs, die Holding legt Strategie und Budgets fest.

### Abgrenzung
**Fusion**: Verschmelzung zu einem Unternehmen, die rechtliche Selbstständigkeit endet. **Kooperation**: rechtlich und wirtschaftlich selbstständig. **Kartell**: verbotene Wettbewerbsabsprache.

### Prüfungsfalle
Annehmen, im Konzern hafte die Mutter automatisch für alle Schulden der Töchter – jede Gesellschaft haftet grundsätzlich selbst.

### Merksatz
Konzern: viele rechtliche Einheiten, eine Leitung.

Siehe auch: Konzentration · Kooperation · Kartell · Juristische Person
Mehr: Deep Dive 14, 3.4

## Kooperation
<!-- id: kooperation · quellen: Karte DD14, DD14 3.4 · stand: 2026-10 -->

Zusammenarbeit von Unternehmen, die dabei rechtlich und wirtschaftlich selbstständig bleiben.

### Erklärung
Unternehmen bündeln Kräfte in einzelnen Bereichen, ohne ihre Eigenständigkeit aufzugeben: Arbeitsgemeinschaft für ein gemeinsames Projekt, Einkaufsgemeinschaft für bessere Konditionen, gemeinsame Forschung oder Werbung. Grenze ist das Kartellverbot: Absprachen über Preise, Mengen oder Gebiete, die den Wettbewerb beschränken, sind grundsätzlich verboten.

### Beispiel
Mehrere unabhängige Möbelhäuser gründen eine Einkaufsgemeinschaft und bestellen Bürostühle gemeinsam, um Mengenrabatte zu erhalten. Ihre Verkaufspreise legt jedes Haus weiter selbst fest.

### Abgrenzung
| Form | rechtlich selbstständig | wirtschaftlich selbstständig |
|---|---|---|
| Kooperation | ja | ja |
| Konzern | ja | nein |
| Fusion | nein | nein |

### Prüfungsfalle
Vereinbaren die Einkaufspartner zusätzlich gemeinsame Verkaufspreise, ist es keine erlaubte Kooperation mehr, sondern ein Kartell.

### Merksatz
Kooperation: zusammen arbeiten, getrennt bleiben.

Siehe auch: Kartell · Konzern · Konzentration
Mehr: Deep Dive 14, 3.4

## Kopfgesteuerte Schleife
<!-- id: kopfgesteurte-schleife · quellen: Karte DD11, DD11 B1, DD17 4.2 · stand: 2026-10 -->

Wiederholung, deren Bedingung **vor** jedem Durchlauf geprüft wird – der Rumpf läuft deshalb eventuell gar nicht (SOLANGE … TUE).

### Erklärung
Im Struktogramm steht die Bedingung oben, der Rumpf eingerückt darunter (L-Form). Auch die Zählschleife (FÜR i VON 1 BIS n) wird so gezeichnet.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 110" width="320" height="110" role="img" aria-label="Struktogramm einer kopfgesteuerten Schleife">
<rect x="10" y="10" width="300" height="90" class="dg-form"/>
<text x="20" y="27" dominant-baseline="middle" class="dg-klein">SOLANGE noch Aufträge offen</text>
<rect x="40" y="44" width="270" height="28" class="dg-grau"/>
<text x="50" y="58" dominant-baseline="middle" class="dg-klein">nächsten Auftrag lesen</text>
<rect x="40" y="72" width="270" height="28" class="dg-grau"/>
<text x="50" y="86" dominant-baseline="middle" class="dg-klein">Durchlaufzeit berechnen</text>
</svg>
```

### Beispiel
Eine Auswertung verarbeitet alle offenen Aufträge. Gibt es heute keinen, darf der Rumpf kein einziges Mal laufen – eine kopfgesteuerte Schleife ist richtig.

### Abgrenzung
Die **fußgesteuerte Schleife** (WIEDERHOLE … BIS) prüft nach dem Rumpf und läuft mindestens einmal – typisch für eine Eingabe, die wiederholt wird, bis sie gültig ist. Im Struktogramm steht ihre Bedingung unten.

### Prüfungsfalle
Bei der fußgesteuerten Schleife die Abbruch- mit der Laufbedingung verwechseln: WIEDERHOLE … BIS endet, wenn die Bedingung wahr wird.

### Merksatz
Kopfgesteuert: erst prüfen, dann laufen – vielleicht nie.

Siehe auch: Fußgesteuerte Schleife · Struktogramm · Programmablaufplan
Mehr: Deep Dive 11, B1 · Deep Dive 17, 4.2

## Korrektheit
<!-- id: korrektheit · quellen: Karte DD9, DD9 Teil 1, DD3 5.3 · stand: 2026-10 -->

Datenqualitätsdimension: Die gespeicherten Werte stimmen mit der Realität überein.

### Erklärung
Korrektheit (englisch accuracy) lässt sich nur durch Abgleich mit einer verlässlichen Referenz prüfen: amtliches Verzeichnis, Originalbeleg, Rückfrage beim Kunden, Stichprobe vor Ort. Formatprüfungen reichen nicht, weil auch ein formal gültiger Wert falsch sein kann. Auch das Löschen echter Extremwerte verletzt die Korrektheit, weil der Datenbestand dann die Wirklichkeit nicht mehr abbildet.

### Beispiel
In der Kundentabelle steht „Huber GmbH, 80331 München“ – Format korrekt. Ein Abgleich mit dem Handelsregister zeigt: Die Firma ist nach 81675 umgezogen. Der Wert ist gültig, aber nicht korrekt.

### Abgrenzung
**Gültigkeit**: Der Wert erfüllt die Formatregel. **Konsistenz**: Werte widersprechen sich nicht. **Genauigkeit** (precision): Detailtiefe, z. B. Stunden statt Tage.

### Prüfungsfalle
Eine bestandene Muster- oder Wertebereichsprüfung als Nachweis der Korrektheit werten.

### Merksatz
Gültig ist, was ins Format passt – korrekt, was stimmt.

Siehe auch: Konsistenz · Datenqualität · Ausreißer · ISO/IEC 25012
Mehr: Deep Dive 9, Teil 1 · Deep Dive 3, 5.3

## Korrelation
<!-- id: korrelation · quellen: Karte DD4, DD4 Teil 1 · stand: 2026-10 -->

Statistischer Zusammenhang zwischen zwei Merkmalen, die sich gemeinsam verändern – ohne Aussage über Ursache und Wirkung.

### Erklärung
Eine Korrelation kann positiv (gleichläufig) oder negativ (gegenläufig), stark oder schwach sein. Für metrische Merkmale misst man den linearen Zusammenhang mit dem Korrelationskoeffizienten nach Pearson, für ordinale Daten mit der Rangkorrelation nach Spearman. Vor jeder Rechnung gehört ein Blick ins Streudiagramm, weil nichtlineare Zusammenhänge und Ausreißer den Wert verfälschen.

### Beispiel
Werbebudget und Umsatz der Möbelhaus Nordholz GmbH korrelieren mit r = 0,983 – ein starker positiver Zusammenhang. Ob die Werbung den Umsatz verursacht, ist damit noch nicht belegt.

### Abgrenzung
**Kausalität** ist eine Ursache-Wirkungs-Beziehung. **Regression** liefert eine Gleichung für Prognosen, die Korrelation nur Stärke und Richtung.

### Prüfungsfalle
Aus r ≈ 0 auf „kein Zusammenhang“ schließen – ein U-förmiger Zusammenhang ergibt ebenfalls r nahe null.

### Merksatz
Korrelation zeigt, dass sich etwas gemeinsam bewegt – nicht, warum.

Siehe auch: Kausalität · Korrelationskoeffizient nach Pearson · Streudiagramm · Regression
Mehr: Deep Dive 4, 1.1 · Deep Dive 4, 1.3

## Korrelationskoeffizient nach Pearson
<!-- id: korrelationskoffizient-nach-pearson · quellen: Karte DD4, DD4 1.2 · stand: 2026-10 -->

Maß r für Stärke und Richtung des **linearen** Zusammenhangs zweier metrischer Merkmale, Wertebereich −1 bis +1.

### Erklärung
$r = \dfrac{S_{xy}}{\sqrt{S_{xx} \cdot S_{yy}}}$ mit $S_{xy} = \sum (x - \bar{x})(y - \bar{y})$, $S_{xx} = \sum (x - \bar{x})^2$, $S_{yy} = \sum (y - \bar{y})^2$. Faustregel für |r|: bis 0,2 kein bis sehr schwach, bis 0,5 schwach, bis 0,8 mittel, darüber stark. r ist einheitenlos, symmetrisch (r(x,y) = r(y,x)) und ausreißerempfindlich. Bei der einfachen linearen Regression gilt $R^2 = r^2$.

### Beispiel
Werbebudget und Umsatz über fünf Monate: $S_{xy} = 64$, $S_{xx} = 10$, $S_{yy} = 424$. $r = \frac{64}{\sqrt{10 \cdot 424}} = \frac{64}{65{,}12} = 0{,}983$ → starker positiver Zusammenhang, $R^2 = 0{,}966$.

### Abgrenzung
Die **Rangkorrelation nach Spearman** rechnet mit Rangplätzen, ist für ordinale Daten zulässig und robuster gegen Ausreißer; sie erfasst auch monotone, nichtlineare Zusammenhänge.

### Prüfungsfalle
Pearson auf Zufriedenheitsstufen (ordinal) anwenden oder aus r eine Wirkungsrichtung ableiten.

### Merksatz
Pearson misst Linien – für Ränge nimm Spearman.

Siehe auch: Korrelation · Kausalität · Bestimmtheitsmaß · Streudiagramm
Mehr: Deep Dive 4, 1.2 · Deep Dive 4, 2.3

## KPI
<!-- id: kpi · quellen: Karte DD5, DD5 6.6 · stand: 2026-10 -->

Key Performance Indicator: eine der wenigen zentralen Kennzahlen, an denen der Erfolg eines Prozesses gemessen wird – mit Zielwert, Messvorschrift und Verantwortlichem.

### Erklärung
Ein KPI ist mehr als eine Zahl: Er braucht eine eindeutige Definition (was wird wie gezählt?), eine Datenquelle, einen Zielwert, einen Messrhythmus und eine Person, die bei Abweichungen handelt. Zehn KPIs für einen Prozess sind keine KPIs mehr, weil nichts mehr im Fokus steht. Die **Balanced Scorecard** ordnet Kennzahlen vier Perspektiven zu: Finanzen, Kunden, interne Prozesse, Lernen und Entwicklung.

### Beispiel
Reparaturservice: KPI „Durchlaufzeit je Auftrag (Median, in Tagen)“, Zielwert höchstens 5 Tage, Quelle Event Log, monatlich, verantwortlich die Leitung der Werkstatt. Dazu ein zweiter KPI: First Pass Yield mindestens 90 %.

### Abgrenzung
Eine einfache **Kennzahl** beschreibt etwas, ein KPI steuert ein Ziel. Ein Dashboard zeigt KPIs, ersetzt aber nicht deren Definition.

### Prüfungsfalle
Einen KPI ohne Zielwert oder Messvorschrift nennen – dann ist er nicht steuerbar.

### Merksatz
Wenige KPIs, klar definiert, mit Ziel und Verantwortlichem.

Siehe auch: Balanced Scorecard · Durchlaufzeit · First Pass Yield
Mehr: Deep Dive 5, 6.6

## Krähenfußnotation
<!-- id: krahenfussnotation · quellen: Karte DD2, DD2 1.3, DD17 3.3 · stand: 2026-10 -->

ER-Notation (Information Engineering, Martin), bei der zwei Zeichen am Linienende die Kardinalität angeben: Krähenfuß = viele, Querstrich = genau 1, Kreis = 0 (optional).

### Erklärung
Das Zeichen direkt an der Entität ist das **Maximum**, das weiter außen das **Minimum**. Gelesen wird wie bei Chen: Das Symbol an BESTELLUNG sagt, wie viele Bestellungen ein Kunde hat. Die Notation ist in Werkzeugen wie MySQL Workbench verbreitet.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 60" width="440" height="60" role="img" aria-label="KUNDE genau eins zu null bis viele BESTELLUNG in Krähenfußnotation">
<rect x="10" y="15" width="100" height="30" class="dg-form"/>
<text x="60" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-fett">KUNDE</text>
<rect x="310" y="15" width="120" height="30" class="dg-form"/>
<text x="370" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-fett">BESTELLUNG</text>
<line x1="110" y1="30" x2="310" y2="30" class="dg-linie"/>
<line x1="118" y1="20" x2="118" y2="40" class="dg-linie"/>
<line x1="128" y1="20" x2="128" y2="40" class="dg-linie"/>
<line x1="294" y1="30" x2="310" y2="19" class="dg-linie"/>
<line x1="294" y1="30" x2="310" y2="41" class="dg-linie"/>
<circle cx="285" cy="30" r="6" class="dg-form"/>
</svg>
```

### Beispiel
KUNDE ||──o< BESTELLUNG: Eine Bestellung gehört zu genau einem Kunden (|| bei KUNDE), ein Kunde hat null bis viele Bestellungen (o< bei BESTELLUNG). In Min-Max: KUNDE (0,n) — (1,1) BESTELLUNG.

### Abgrenzung
**Min-Max** schreibt die Angabe an die Entität, deren Teilnahme sie beschreibt – also auf die jeweils andere Seite als Krähenfuß. **Chen** kennt nur Maximalwerte.

### Prüfungsfalle
Innen und außen vertauschen: Der Kreis außen bedeutet „optional“, nicht „null Stück maximal“.

### Merksatz
Innen das Maximum, außen das Minimum – gelesen wie Chen.

Siehe auch: Kardinalität · Min-Max-Notation · Chen-Notation
Mehr: Deep Dive 2, 1.3 · Deep Dive 17, 3.3

## Krankenversicherung
<!-- id: krankenversicherung · quellen: Karte DD14, DD14 1.2, DD14 1.3 · stand: 2026-10 -->

Zweig der gesetzlichen Sozialversicherung mit den Krankenkassen als Trägern; Arbeitgeber und Arbeitnehmer tragen die Beiträge je zur Hälfte, auch den Zusatzbeitrag.

### Erklärung
Allgemeiner Beitragssatz 14,6 % (Arbeitnehmer 7,3 %) plus kassenindividueller Zusatzbeitrag; den durchschnittlichen Zusatzbeitrag legt das Bundesgesundheitsministerium fest – 2026: 2,9 % (Stand 2026). Beiträge fallen nur bis zur Beitragsbemessungsgrenze an: 2026 5.812,50 € im Monat (Stand 2026). Wer über der Versicherungspflichtgrenze von 77.400 € im Jahr verdient (Stand 2026), kann in die private Krankenversicherung wechseln. Leistungen: Arzt, Krankenhaus, Medikamente, Krankengeld. Bei Auszubildenden bis 325 € monatlich trägt der Arbeitgeber die Beiträge allein.

### Beispiel
Jonas, 1.200 € Ausbildungsvergütung, Zusatzbeitrag seiner Kasse 2,9 %: $\frac{14{,}6\ \% + 2{,}9\ \%}{2} = 8{,}75\ \%$ → $1.200 \cdot 0{,}0875 = 105{,}00$ €.

### Abgrenzung
Die **Pflegeversicherung** ist ein eigener Zweig mit eigenem Satz (3,6 %) und Kinderlosenzuschlag, den der Arbeitnehmer allein trägt. Die Unfallversicherung zahlt der Arbeitgeber allein.

### Prüfungsfalle
Beitragsbemessungsgrenze und Versicherungspflichtgrenze verwechseln – die eine begrenzt den Beitrag, die andere regelt den Wechsel in die PKV.

### Merksatz
14,6 % plus Zusatzbeitrag, beides halbe-halbe.

Siehe auch: Pflegeversicherung · Beitragsbemessungsgrenze · Krankheit · Nettoentgelt
Mehr: Deep Dive 14, 1.2 · Deep Dive 14, 1.3

## Krankheit
<!-- id: krankheit · quellen: DD14 1.4 · stand: 2026-10 -->

Bei Arbeitsunfähigkeit zahlt der Arbeitgeber das Entgelt bis zu 6 Wochen weiter; danach zahlt die Krankenkasse Krankengeld.

### Erklärung
Die **Entgeltfortzahlung** (Entgeltfortzahlungsgesetz) gilt auch für Auszubildende; der Anspruch entsteht nach 4 Wochen ununterbrochener Beschäftigung und beträgt 100 % des Entgelts für bis zu 6 Wochen je Krankheit. Die Arbeitsunfähigkeit ist unverzüglich anzuzeigen und nachzuweisen. Danach zahlt die Krankenkasse **Krankengeld**: 70 % des regelmäßigen Bruttoentgelts, höchstens 90 % des Nettoentgelts.

### Beispiel
Jonas (1.200 € brutto, 946,20 € netto) ist acht Wochen krank. Wochen 1–6 zahlt der Ausbildungsbetrieb die volle Vergütung. Ab Woche 7 zahlt die Kasse Krankengeld: 70 % von 1.200 € = 840 €; die Grenze von 90 % des Nettos (851,58 €) greift nicht – also rund 840 € im Monat.

### Abgrenzung
Ein **Arbeits- oder Wegeunfall** fällt unter die gesetzliche Unfallversicherung (Berufsgenossenschaft), die nach der Entgeltfortzahlung Verletztengeld statt Krankengeld zahlt. Krankheitstage gehören in kein Zeugnis.

### Prüfungsfalle
Krankengeld als 70 % des Nettos rechnen – richtig sind 70 % des Bruttos, gedeckelt auf 90 % des Nettos.

### Merksatz
Sechs Wochen der Betrieb, danach die Kasse mit 70 % brutto, höchstens 90 % netto.

Siehe auch: Krankenversicherung · Entgeltfortzahlung · Nettoentgelt
Mehr: Deep Dive 14, 1.4

## Kreisdiagramm
<!-- id: kreisdiagramm · quellen: Karte DD11, DD11 A1, DD17 6.4 · stand: 2026-10 -->

Diagramm, das Anteile an einem Ganzen als Kreissegmente zeigt; die Teile ergeben zusammen 100 %.

### Erklärung
Sinnvoll nur bei wenigen Kategorien (Faustregel: höchstens fünf), die zusammen ein sinnvolles Ganzes bilden, und wenn eine grobe Aussage wie „mehr als die Hälfte“ genügt. Winkel und Flächen kann das Auge schlechter vergleichen als Balkenlängen. Kein 3D: Die Perspektive verzerrt die Flächen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 120" width="260" height="120" role="img" aria-label="Kreisdiagramm Umsatzanteile Möbel 50, Elektronik 30, Zubehör 20 Prozent">
<path d="M60,60 L60,10 A50,50 0 0,1 60,110 Z" class="dg-akzent"/>
<path d="M60,60 L60,110 A50,50 0 0,1 12.45,44.55 Z" class="dg-gut"/>
<path d="M60,60 L12.45,44.55 A50,50 0 0,1 60,10 Z" class="dg-mittel"/>
<text x="130" y="35" dominant-baseline="middle" class="dg-klein">Möbel 50 %</text>
<text x="130" y="60" dominant-baseline="middle" class="dg-klein">Elektronik 30 %</text>
<text x="130" y="85" dominant-baseline="middle" class="dg-klein">Zubehör 20 %</text>
</svg>
```

### Beispiel
Umsatzanteile der drei Warengruppen der Möbelhaus Nordholz GmbH: Möbel 50 %, Elektronik 30 %, Zubehör 20 % – drei Segmente, die Hälfte ist sofort erkennbar.

### Abgrenzung
Für Rangfolgen und viele Kategorien ist das **sortierte Balkendiagramm** besser; für Entwicklungen über die Zeit das **Liniendiagramm**; mehrere Ganze vergleicht man mit gestapelten 100-%-Balken.

### Prüfungsfalle
Ein Kreisdiagramm mit zehn Segmenten oder mit Werten, die sich nicht zu 100 % addieren (Mehrfachnennungen).

### Merksatz
Kreis nur für wenige Teile eines Ganzen – alles andere als Balken.

Siehe auch: Balkendiagramm · Liniendiagramm · Säulendiagramm
Mehr: Deep Dive 11, A1 · Deep Dive 17, 6.4

## Kreuzvalidierung
<!-- id: kreuzvalidierung · quellen: Karte DD7, DD7 1.3 · stand: 2026-10 -->

Verfahren zur Gütemessung, bei dem die Daten in k Teile zerlegt werden und jeder Teil einmal als Testmenge dient (k-fold Cross Validation).

### Erklärung
In k Durchläufen wird das Modell auf k − 1 Teilen trainiert und auf dem verbleibenden Teil getestet; die k Ergebnisse werden gemittelt. Üblich sind k = 5 oder k = 10. Vorteile: Jeder Datensatz wird genau einmal getestet, das Ergebnis hängt nicht von einer zufällig günstigen Aufteilung ab, besonders wertvoll bei kleinen Datenmengen. Nachteil: k-facher Rechenaufwand. Genutzt wird sie auch, um Parameter wie k bei k-NN oder die Baumtiefe zu wählen.

### Beispiel
1.000 Aufträge, k = 5: fünf Teile à 200. Durchlauf 1 trainiert auf Teil 2–5 (800) und testet auf Teil 1, Durchlauf 2 testet auf Teil 2 usw. Recall-Werte 0,58 · 0,62 · 0,60 · 0,57 · 0,63 ergeben im Mittel 0,60.

### Abgrenzung
Der einfache **Train-Test-Split** prüft nur einmal und kann zufällig günstig ausfallen. Bei Zeitreihen wird statt zufällig **chronologisch** getrennt, damit keine Zukunftsinformation ins Training gelangt.

### Prüfungsfalle
Skalierungswerte vorab aus allen Daten berechnen – sie gehören in jedem Durchlauf nur aus den Trainingsteilen bestimmt (sonst Data Leakage).

### Merksatz
Jeder Teil darf einmal Prüfer sein – das Mittel zählt.

Siehe auch: Overfitting · Testdaten · K-Nächste-Nachbarn
Mehr: Deep Dive 7, 1.3

## Kriterien der Sozialauswahl
<!-- id: kriterien-der-sozialauswahl · quellen: DD13 3.4 · stand: 2026-10 -->

Die vier Merkmale, nach denen bei einer betriebsbedingten Kündigung unter vergleichbaren Arbeitnehmern ausgewählt wird (§ 1 Abs. 3 KSchG): Dauer der Betriebszugehörigkeit, Lebensalter, Unterhaltspflichten, Schwerbehinderung.

### Erklärung
Fällt ein Arbeitsplatz weg, darf der Arbeitgeber nicht frei wählen, wem er kündigt. Er muss unter den vergleichbaren Beschäftigten den sozial am wenigsten Schutzbedürftigen auswählen. Je länger jemand im Betrieb ist, je älter, je mehr Unterhaltspflichten und bei Schwerbehinderung, desto schutzwürdiger. Leistungsträger, deren Weiterbeschäftigung im berechtigten betrieblichen Interesse liegt, können herausgenommen werden. Fehler in der Sozialauswahl machen die Kündigung unwirksam.

### Beispiel
Im Lager fällt eine Stelle weg. Herr Kaya: 6 Jahre im Betrieb, ein Kind. Ein Kollege: 2 Jahre, ledig, gleich alt, gleiche Tätigkeit. Die Sozialauswahl spricht für die Kündigung des Kollegen.

### Abgrenzung
Die Sozialauswahl gibt es nur bei **betriebsbedingten** Kündigungen. Bei personen- oder verhaltensbedingten Kündigungen kommt es auf die Person bzw. ihr Verhalten an (dort meist Abmahnung bzw. Interessenabwägung).

### Prüfungsfalle
Leistung oder Krankheitstage als Kriterium der Sozialauswahl nennen – sie gehören nicht zu den vier gesetzlichen Merkmalen.

### Merksatz
Betriebszugehörigkeit, Alter, Unterhalt, Schwerbehinderung – wer am meisten hat, bleibt.

Siehe auch: Kündigungsschutzgesetz · Kündigungsschutzklage · Abmahnung
Mehr: Deep Dive 13, 3.4

## Kritische Menge
<!-- id: kritische-menge · quellen: Karte DD12, DD12 4.3 · stand: 2026-10 -->

Menge, bei der zwei Alternativen mit unterschiedlicher Kostenstruktur gleich viel kosten: Fixkostendifferenz geteilt durch die Differenz der variablen Stückkosten.

Auch: Kostenvergleichsrechnung – kritische Menge

### Erklärung
Hat eine Alternative hohe Fixkosten und niedrige variable Kosten, die andere umgekehrt, schneiden sich ihre Kostengeraden. Ansatz: $K_{fix,1} + k_{v,1} \cdot x = K_{fix,2} + k_{v,2} \cdot x$, also $x = \dfrac{K_{fix,1} - K_{fix,2}}{k_{v,2} - k_{v,1}}$. Unterhalb der kritischen Menge ist die Alternative mit niedrigen Fixkosten günstiger, darüber die mit niedrigen variablen Kosten. Typische Anwendung: Make or Buy.

### Beispiel
Eigenentwicklung 12.000 € Fixkosten pro Jahr plus 2 € je Vorgang, Fremdbezug 5 € je Vorgang ohne Fixkosten: $x = \frac{12.000 - 0}{5 - 2} = 4.000$ Vorgänge pro Jahr. Darunter ist Kaufen günstiger, darüber Selbermachen.

### Abgrenzung
Die **Break-even-Menge** vergleicht Kosten mit Erlösen (Fixkosten / Deckungsbeitrag je Stück), die kritische Menge zwei Kostenalternativen. Beides sind statische Verfahren.

### Prüfungsfalle
Die Entscheidung nur auf die Rechnung stützen – qualitative Kriterien wie Know-how, Anbieterabhängigkeit und Support gehören in die Beurteilung.

### Merksatz
Fixkostendifferenz durch Differenz der Stückkosten – dort kippt die Entscheidung.

Siehe auch: Kapitalwert · Amortisationszeit · Make or Buy
Mehr: Deep Dive 12, 4.3

## Kritischer Pfad
<!-- id: kritischer-pfad · quellen: Karte DD12, DD12 3.2 · stand: 2026-10 -->

Kette der Vorgänge mit Gesamtpuffer 0 im Netzplan – der längste Weg vom Start zum Ende; jede Verzögerung darauf verschiebt das Projektende.

### Erklärung
Vorwärtsrechnung: FAZ = größtes FEZ der Vorgänger, FEZ = FAZ + Dauer; das größte FEZ ist die Projektdauer. Rückwärtsrechnung: SEZ = kleinstes SAZ der Nachfolger, SAZ = SEZ − Dauer. Gesamtpuffer GP = SAZ − FAZ. Alle Vorgänge mit GP = 0 bilden den kritischen Pfad. Es kann mehrere kritische Pfade geben.

### Beispiel
A(5), B(4, nach A), C(6, nach A), D(8, nach B und C), E(3, nach B), F(4, nach D und E), G(2, nach F). Vorwärts: A 0–5, C 5–11, D 11–19, F 19–23, G 23–25 → Projektdauer 25 Tage, kritischer Pfad A → C → D → F → G. B hat 2 Tage Gesamtpuffer; verzögert sich C um 2 Tage, endet das Projekt an Tag 27.

### Abgrenzung
Der **freie Puffer** gibt an, wie weit sich ein Vorgang verschieben darf, ohne den Nachfolger zu verzögern; der Gesamtpuffer, ohne das Projektende zu gefährden. Das **Gantt-Diagramm** zeigt den Plan, der Netzplan berechnet ihn.

### Prüfungsfalle
Den kürzesten statt des längsten Wegs als kritischen Pfad angeben oder vorwärts das Minimum nehmen.

### Merksatz
Vorwärts das Maximum, rückwärts das Minimum – kritisch ist, wo kein Puffer bleibt.

Siehe auch: Netzplan · Gesamtpuffer · Gantt-Diagramm
Mehr: Deep Dive 12, 3.2

## Kumulationseffekt
<!-- id: kumulationseffekt · quellen: Karte DD10, DD10 5.1 · stand: 2026-10 -->

Ausnahme vom Maximumprinzip im IT-Grundschutz: Viele kleine Schäden summieren sich, sodass ein System einen höheren Schutzbedarf erhält als jede einzelne Anwendung darauf.

### Erklärung
Nach dem **Maximumprinzip** erbt ein System den höchsten Schutzbedarf seiner Anwendungen. Laufen auf einem Server aber viele Anwendungen mit jeweils „normalem“ Schutzbedarf, kann ein Ausfall oder Angriff sie alle gleichzeitig treffen – der Gesamtschaden ist dann beträchtlich und der Schutzbedarf des Servers „hoch“. Bei der Schutzbedarfsfeststellung ist das ausdrücklich zu prüfen und zu begründen.

### Beispiel
Ein virtualisierter Host betreibt Kantinenplan, Raumbuchung, Intranet, Telefonbuch und Ticketsystem, jeweils Verfügbarkeit „normal“. Fällt der Host aus, stehen alle fünf Dienste still – für die Verfügbarkeit gilt „hoch“.

### Abgrenzung
**Verteilungseffekt**: Der Schutzbedarf sinkt, z. B. bei der Verfügbarkeit, wenn eine Anwendung redundant auf mehrere Server verteilt ist. Maximumprinzip: Normalfall, höchster Einzelwert gilt.

### Prüfungsfalle
Den Schutzbedarf eines Servers nur nach dem Maximumprinzip festlegen, ohne die Kumulation zu prüfen.

### Merksatz
Viele kleine Risiken auf einem System ergeben ein großes.

Siehe auch: Maximumprinzip · Verteilungseffekt · Schutzbedarfsfeststellung · IT-Grundschutz
Mehr: Deep Dive 10, 5.1

## Kumulierte Häufigkeit
<!-- id: kumulierte-haufigkeit · quellen: Karte DD3, DD3 Teil 2 · stand: 2026-10 -->

Aufsummierte Häufigkeit bis einschließlich eines Werts oder einer Kategorie; sie beantwortet Fragen wie „wie viele Aufträge dauerten höchstens 3 Tage?“.

### Erklärung
Man sortiert die Werte (bei metrischen Daten aufsteigend, bei Ursachen absteigend nach Häufigkeit) und addiert die absoluten oder relativen Häufigkeiten fortlaufend. Die letzte kumulierte relative Häufigkeit ist immer 100 % – eine gute Rechenprobe. Kumulierte Anteile sind die Grundlage des Pareto-Diagramms und der ABC-Analyse.

### Beispiel
Lieferzeiten 2, 3, 3, 4, 5, 5, 5, 6, 8, 19 Tage: höchstens 3 Tage dauerten 3 von 10 Aufträgen = 30 %; höchstens 5 Tage 7 von 10 = 70 %. Reklamationsgründe: Transportschaden 36 %, Montagefehler 30 % → kumuliert 66 % für die zwei häufigsten Gründe.

### Abgrenzung
**Relative Häufigkeit** ist der Anteil einer einzelnen Kategorie ($f = \frac{h}{n}$); die kumulierte Häufigkeit addiert alle bis dahin. Bei nominalen Daten ist „bis einschließlich“ nur nach einer festgelegten Sortierung sinnvoll.

### Prüfungsfalle
Vor dem Kumulieren nicht sortieren oder relative und absolute Häufigkeiten vermischen.

### Merksatz
Kumulieren heißt fortlaufend aufaddieren – am Ende stehen 100 %.

Siehe auch: Pareto-Diagramm · ABC-Analyse · Klassenbildung
Mehr: Deep Dive 3, Teil 2

## Kündigungsschutzgesetz
<!-- id: kundigungsschutzgesetz · quellen: Karte DD13, DD13 3.4 · stand: 2026-10 -->

KSchG: Eine Kündigung durch den Arbeitgeber muss sozial gerechtfertigt sein – personen-, verhaltens- oder betriebsbedingt; das Gesetz gilt bei mehr als 10 Arbeitnehmern im Betrieb und mehr als 6 Monaten Betriebszugehörigkeit.

### Erklärung
Beide Voraussetzungen müssen erfüllt sein; Teilzeitkräfte zählen anteilig. **Personenbedingt**: z. B. lang andauernde Krankheit mit negativer Prognose (Interessenabwägung). **Verhaltensbedingt**: z. B. wiederholte Unpünktlichkeit, in der Regel nach Abmahnung. **Betriebsbedingt**: Wegfall des Arbeitsplatzes, mit Sozialauswahl. Wer die Kündigung angreifen will, muss binnen 3 Wochen Kündigungsschutzklage erheben.

### Beispiel
Die Möbelhaus Nordholz GmbH (140 Beschäftigte) will Herrn Kaya (6 Jahre im Betrieb) wegen eines Umsatzrückgangs kündigen. Das KSchG gilt; nötig sind ein dringendes betriebliches Erfordernis und eine korrekte Sozialauswahl.

### Abgrenzung
**Besonderer Kündigungsschutz** gilt zusätzlich für Schwangere, Beschäftigte in Elternzeit, schwerbehinderte Menschen, Betriebsrats- und JAV-Mitglieder. Die Kündigungsfristen stehen in § 622 BGB, nicht im KSchG. Die Anhörung des Betriebsrats (§ 102 BetrVG) ist immer nötig.

### Prüfungsfalle
Das KSchG auch im Kleinbetrieb oder in den ersten sechs Monaten anwenden.

### Merksatz
Mehr als 10 im Betrieb, mehr als 6 Monate dabei – dann braucht die Kündigung einen Grund.

Siehe auch: Kriterien der Sozialauswahl · Kündigungsschutzklage · Abmahnung · Anhörung
Mehr: Deep Dive 13, 3.4

## Kündigungsschutzklage
<!-- id: kundigungsschutzklage · quellen: Karte DD13, DD13 3.4 · stand: 2026-10 -->

Klage beim Arbeitsgericht gegen eine Kündigung; sie muss innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung erhoben werden, sonst gilt die Kündigung als wirksam (§§ 4, 7 KSchG).

### Erklärung
Die Frist beginnt mit dem **Zugang** der Kündigung, nicht mit dem Datum auf dem Schreiben. Das Verfahren beginnt mit einer **Güteverhandlung**, in der oft ein Vergleich (z. B. Abfindung) geschlossen wird. Instanzen: Arbeitsgericht → Landesarbeitsgericht → Bundesarbeitsgericht. Die 3-Wochen-Frist gilt auch, wenn das KSchG selbst nicht anwendbar ist, aber andere Unwirksamkeitsgründe geltend gemacht werden (z. B. fehlende Betriebsratsanhörung).

### Beispiel
Die Kündigung geht Herrn Kaya am Dienstag, 10.03.2026, zu. Die Frist endet drei Wochen später am Dienstag, 31.03.2026. Reicht er die Klage erst im April ein, gilt die Kündigung als wirksam.

### Abgrenzung
Die **Kündigungsfrist** (§ 622 BGB) bestimmt, wann das Arbeitsverhältnis endet; die Klagefrist, bis wann man sich wehren kann. Eine fristlose Kündigung muss der Arbeitgeber binnen zwei Wochen nach Kenntnis der Gründe aussprechen (§ 626 BGB).

### Prüfungsfalle
Die Frist ab dem Datum des Kündigungsschreibens oder als Monatsfrist berechnen.

### Merksatz
Drei Wochen ab Zugang – sonst ist die Kündigung wirksam.

Siehe auch: Kündigungsschutzgesetz · Kriterien der Sozialauswahl · Grundfrist · Ordentliche Kündigung
Mehr: Deep Dive 13, 3.4

## Künstliche Intelligenz
<!-- id: kunstliche-intelligenz · quellen: Karte DD6, DD6 8.1 · stand: 2026-10 -->

Oberbegriff für Systeme, die Aufgaben lösen, für die sonst menschliche Intelligenz nötig ist – auch mit fest programmierten Regeln.

### Erklärung
Die Begriffe sind ineinander verschachtelt: **KI** umfasst alles, auch regelbasierte Expertensysteme. **Machine Learning** ist ein Teilgebiet, in dem das System Regeln aus Daten lernt, statt dass sie programmiert werden. **Deep Learning** ist ein Teilgebiet von ML mit vielschichtigen neuronalen Netzen, die Merkmale selbst aus Rohdaten bilden. Generative KI (Sprachmodelle) erzeugt neue Inhalte – mit dem Risiko überzeugend formulierter Fehler (Halluzinationen).

### Beispiel
Ein festes Regelwerk „Lieferdauer > 10 Tage und Spediteur Nordtrans → Prüffall“ ist KI, aber kein Machine Learning. Ein Entscheidungsbaum, der diese Regel aus 18.000 Aufträgen lernt, ist Machine Learning.

### Abgrenzung
**Data Mining** ist das Finden von Mustern in großen Datenbeständen mit Verfahren aus Statistik und ML. Die **KI-Verordnung** regelt den Einsatz von KI-Systemen nach Risiko.

### Prüfungsfalle
KI und Machine Learning gleichsetzen – nicht jede KI lernt aus Daten.

### Merksatz
KI ⊃ Machine Learning ⊃ Deep Learning.

Siehe auch: Machine Learning · Deep Learning · KI-Verordnung · Neuronale Netze
Mehr: Deep Dive 6, 8.1

## KVP
<!-- id: kvp · quellen: Karte DD5, DD5 6.2, DD5 4.2 · stand: 2026-10 -->

Kontinuierlicher Verbesserungsprozess: organisierte, dauerhafte Verbesserung von Prozessen in vielen kleinen Schritten durch die Beschäftigten, meist im PDCA-Zyklus.

### Erklärung
**Plan**: Problem analysieren, Maßnahme planen. **Do**: umsetzen, ggf. im Pilotbereich. **Check**: Wirkung anhand von Kennzahlen prüfen. **Act**: bewährte Lösung als Standard festschreiben oder nachsteuern – dann beginnt der nächste Zyklus. Der KVP setzt die Kaizen-Haltung in feste Abläufe um, etwa über ein Vorschlagswesen, regelmäßige Teamrunden und Kennzahlen. Optimierung ist damit ein Kreislauf, kein einmaliges Projekt.

### Beispiel
Plan: Liegezeit vor der Disposition halbieren durch einen täglichen Termin-Trigger. Do: vier Wochen in der Filiale Köln. Check: mittlere Liegezeit sinkt von 28,5 auf 14 Stunden. Act: Trigger für alle Filialen als Standard übernehmen.

### Abgrenzung
**Kaizen** ist die Haltung, KVP der organisierte Prozess. **Business Process Reengineering** setzt auf radikale Neugestaltung statt kleiner Schritte. **Six Sigma** arbeitet projektbezogen nach DMAIC.

### Prüfungsfalle
Den Check-Schritt ohne Kennzahl beschreiben („läuft besser“) – ohne Messung kein Nachweis.

### Merksatz
KVP: planen, tun, prüfen, festschreiben – und von vorn.

Siehe auch: Kaizen · PDCA · Lean Management · Six Sigma
Mehr: Deep Dive 5, 6.2 · Deep Dive 5, 4.2

## Ausgelassen
- Kanban im Detail – Abschnittstitel Deep Dive
- Kategorie – kein Fachbegriff
- Kein Komma – JSON-Regel Bruchstück
- Keine Datentypen – CSV-Eigenschaft Bruchstück
- Koalitionsfreiheit und Tarifautonomie – Abschnittstitel Deep Dive
- Kontrolle – Rechenprobe Etikett
- KVP und PDCA – Abschnittstitel Deep Dive
