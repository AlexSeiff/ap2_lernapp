<!-- Begriffsseiten Z · Stand 2026-10 -->
## Z-Wert
<!-- id: z-wert · quellen: Karte DD3, DD3 7.3 · stand: 2026-10 -->

Standardisierter Abstand eines Werts vom Mittelwert, gemessen in Standardabweichungen: $z = \frac{x - \mu}{\sigma}$.

### Erklärung
Der z-Wert macht Werte aus unterschiedlichen Verteilungen vergleichbar und zeigt, wie ungewöhnlich ein Wert ist. Positiv heißt über, negativ unter dem Mittelwert. Bei annähernd **normalverteilten** Größen gilt nach der 3-Sigma-Regel $|z| > 3$ als Ausreißerverdacht, denn rund 99,7 % der Werte liegen innerhalb von ± 3 σ. Die z-Transformation aller Werte (**Standardisierung**) ergibt Mittelwert 0 und Standardabweichung 1 – wichtig etwa vor k-Means.

### Beispiel
Reparaturzeiten: μ = 60 min, σ = 10 min.
Auftrag mit 95 min: $z = \frac{95 - 60}{10} = 3{,}5$ → Ausreißerkandidat.
Auftrag mit 45 min: $z = \frac{45 - 60}{10} = -1{,}5$ → unauffällig.

### Abgrenzung
1,5-IQR-Regel: robust, auch bei schiefen Verteilungen, beruht auf Quartilen. z-Wert-Regel: setzt Normalverteilung voraus und wird selbst von Ausreißern verzerrt, weil μ und σ empfindlich reagieren.

### Prüfungsfalle
Die 3-Sigma-Regel bei rechtsschiefen Daten (Bestellwerte, Einkommen) anwenden – dort ist die IQR-Regel die bessere Wahl.

### Merksatz
z sagt, wie viele Standardabweichungen ein Wert danebenliegt.

Siehe auch: Normalverteilung · Standardabweichung · Ausreißer · Standardisierung
Mehr: Deep Dive 3, 7.3

## Zählen mit Bedingung
<!-- id: zahlen-mit-bedingung · quellen: DD11 B5 · stand: 2026-10 -->

Standardalgorithmus, der in einer Schleife zählt, wie viele Elemente einer Liste eine Bedingung erfüllen.

### Erklärung
Muster: Zähler **vor** der Schleife mit 0 initialisieren, in der Schleife jedes Element prüfen und den Zähler nur bei erfüllter Bedingung um 1 erhöhen, nach der Schleife ausgeben. Das Muster steckt in vielen Prüfungsaufgaben, etwa beim Zählen von Ausreißern, Fehlern oder überfälligen Aufträgen.

### Beispiel
```
EINGABE: dauer[1..n]
anzahl ← 0
FÜR i VON 1 BIS n
    WENN dauer[i] > 60 DANN
        anzahl ← anzahl + 1
    ENDE WENN
ENDE FÜR
AUSGABE anzahl
```
Bei den Dauern 45, 72, 60, 95 liefert der Algorithmus 2 (72 und 95; 60 ist nicht größer als 60).

### Abgrenzung
| Muster | in der Schleife |
|---|---|
| Summe bilden | `summe ← summe + wert` |
| Zählen mit Bedingung | `WENN … DANN anzahl ← anzahl + 1` |
| Maximum suchen | `WENN liste[i] > max DANN max ← liste[i]` |

### Prüfungsfalle
`anzahl ← 0` innerhalb der Schleife – der Zähler wird bei jedem Durchlauf zurückgesetzt; ebenso `BIS n-1` statt `BIS n` (Off-by-one).

### Merksatz
Null vorher, plus eins bei Treffer, ausgeben nachher.

Siehe auch: Summe bilden · Maximum suchen · Pseudocode · Wiederholung
Mehr: Deep Dive 11, B5

## Zahlungsverzug
<!-- id: zahlungsverzug · quellen: Karte DD14, DD14 2.5 · stand: 2026-10 -->

Der Käufer zahlt eine fällige Forderung schuldhaft nicht rechtzeitig; Verzug tritt nach Mahnung ein, bei kalendermäßig bestimmtem Termin ohne Mahnung, spätestens **30 Tage** nach Fälligkeit und Zugang der Rechnung (§ 286 BGB).

### Erklärung
Gegenüber Verbrauchern gilt die 30-Tage-Regel nur, wenn die Rechnung darauf hinweist. Folgen: **Verzugszinsen** (§ 288 BGB) von **5 Prozentpunkten** über dem Basiszinssatz, ohne Verbraucherbeteiligung **9 Prozentpunkte** plus **40 € Pauschale**; dazu Ersatz des Verzugsschadens. Der Basiszinssatz beträgt seit 01.07.2026 **1,52 %** (Stand 2026) – Verzugszins also 6,52 % bzw. 10,52 % pro Jahr. Zahlt der Schuldner weiter nicht, folgt das gerichtliche Mahnverfahren.

### Beispiel
Ein Geschäftskunde schuldet dem Möbelhaus 10.000 € und ist 30 Tage im Verzug:
$10.000 \cdot 0{,}1052 \cdot \frac{30}{365} \approx 86{,}47$ € Zinsen, zuzüglich 40 € Pauschale.

### Abgrenzung
Lieferungsverzug: Der Verkäufer liefert nicht rechtzeitig. Zahlungsverzug: Der Käufer zahlt nicht rechtzeitig. Mahnverfahren: gerichtlicher Weg zur Durchsetzung.

### Prüfungsfalle
Annehmen, ohne Mahnung gebe es nie Verzug – bei kalendermäßig bestimmtem Termin („zahlbar bis 15.10.“) und nach 30 Tagen tritt er automatisch ein.

### Merksatz
Fällig plus Mahnung – oder fester Termin – oder 30 Tage nach Rechnung.

Siehe auch: Lieferungsverzug · Mahnverfahren · Kaufvertrag · Verjährung
Mehr: Deep Dive 14, 2.5

## Zeichenkodierung
<!-- id: zeichenkodierung · quellen: Karte DD15, DD15 2.1, DD15 2.5 · stand: 2026-10 -->

Festgelegte Zuordnung von Zeichen zu Bytefolgen, z. B. ASCII, Latin-1 oder UTF-8.

### Erklärung
**ASCII** kennt 128 Zeichen ohne Umlaute. **Latin-1** (ISO 8859-1) nutzt ein Byte je Zeichen und enthält westeuropäische Umlaute, aber kein €-Zeichen (das haben Windows-1252 und ISO 8859-15). **UTF-8** kodiert alle Unicode-Zeichen mit 1 bis 4 Bytes, ist ASCII-kompatibel und Standard im Web. Kodieren Export und Import unterschiedlich, werden Umlaute zerstört („Ã¤“ statt „ä“).

### Beispiel
„Größe“ hat 5 Zeichen: in Latin-1 5 Bytes, in UTF-8 7 Bytes (ö und ß je 2 Bytes). Das ä wird in UTF-8 als C3 A4 gespeichert; liest ein Programm die Datei als Latin-1, wird daraus „Ã“ und „¤“.

### Abgrenzung
| Kodierung | Bytes je Zeichen | Umlaute | € |
|---|---|---|---|
| ASCII | 1 (7 Bit) | nein | nein |
| Latin-1 | 1 | ja | nein |
| UTF-8 | 1–4 | ja | ja |

### Prüfungsfalle
Unicode und UTF-8 gleichsetzen – Unicode ist der Zeichenvorrat, UTF-8 eine Kodierung davon.

### Merksatz
Kodierung bei Export und Import ausdrücklich festlegen – durchgängig UTF-8.

Siehe auch: UTF-8 · ASCII · CSV · JSON
Mehr: Deep Dive 15, 2.1 · Deep Dive 15, 2.5

## Zeitreihe
<!-- id: zeitreihe · quellen: Karte DD4, DD4 Teil 3 · stand: 2026-10 -->

Folge von Werten eines Merkmals in zeitlicher Reihenfolge, z. B. Monatsumsätze; zerlegbar in Trend, Saison, Zyklus und Zufallsschwankung.

### Erklärung
Der **Trend** ist die langfristige Richtung, die **Saison** eine regelmäßig wiederkehrende Schwankung (Weihnachtsgeschäft), der **Zyklus** eine mehrjährige Konjunkturbewegung, der **Zufall** der Rest. Werkzeuge: gleitender Durchschnitt zum Glätten, Wachstumsraten (über mehrere Perioden mit dem geometrischen Mittel) und das Liniendiagramm mit der Zeit auf der x-Achse.

### Beispiel
Monatsumsatz in T€: 120, 138, 126, 150, 144, 168, 156, 180. Gleitender 3-Perioden-Durchschnitt: $\frac{120 + 138 + 126}{3} = 128{,}0$, dann 138,0, 140,0, 154,0, 156,0, 168,0 – der steigende Trend wird sichtbar. Gesamtwachstum: $\frac{180 - 120}{120} = +50\ \%$.

### Abgrenzung
Querschnittsdaten: viele Objekte zu einem Zeitpunkt (Umsatz je Filiale im Mai). Zeitreihe: ein Objekt über viele Zeitpunkte.

### Prüfungsfalle
Zwei Zeitreihen, die beide wachsen, korrelieren fast immer stark – das beweist keinen inhaltlichen Zusammenhang (Scheinkorrelation).

### Merksatz
Zeitreihe = Trend + Saison + Zyklus + Zufall.

Siehe auch: Gleitender Durchschnitt · Regel für Zeitreihen · Zufall / Scheinkorrelation
Mehr: Deep Dive 4, Teil 3

## Zeitzonen-/Sommerzeitprobleme
<!-- id: zeitzonen-sommerzeitprobleme · quellen: DD5 5.3 · stand: 2026-10 -->

Datenqualitätsproblem im Event Log, bei dem Zeitstempel ohne Zeitzonenangabe oder aus Systemen mit unterschiedlichen Zeitzonen falsche Reihenfolgen und negative Durchlaufzeiten erzeugen.

### Erklärung
Speichert ein System Ortszeit ohne Offset, entsteht bei der Umstellung von Sommer- auf Winterzeit eine doppelt vorkommende Stunde, bei der Umstellung im Frühjahr eine Lücke. Schreibt ein System in UTC, ein anderes in Ortszeit, sind die Ereignisse eines Falls um ein bis zwei Stunden verschoben. Folge: falsche Aktivitätsreihenfolgen im Process Mining und unplausible Zeiten. Abhilfe: Zeitstempel einheitlich in UTC oder mit Offset nach ISO 8601 speichern (`2026-10-25T02:10:00+01:00`).

### Beispiel
Am 25.10.2026 werden die Uhren um 3 Uhr MESZ auf 2 Uhr MEZ zurückgestellt. Schritt A um 02:50 MESZ, Schritt B um 02:10 MEZ – ohne Offset gespeichert ergibt sich −40 min, tatsächlich liegen 20 Minuten dazwischen (00:50 und 01:10 UTC).

### Abgrenzung
Zu grobe Zeitstempel: Reihenfolge innerhalb eines Tages fehlt. Fehlende Zeitstempel: Reihenfolge gar nicht rekonstruierbar. Zeitzonenproblem: Zeitpunkte vorhanden, aber falsch zueinander verschoben.

### Prüfungsfalle
Negative Durchlaufzeiten einfach löschen – erst die Ursache (Zeitzone, Umstellung) klären und dokumentieren.

### Merksatz
Zeitstempel ohne Zeitzone sind nur halbe Zeitstempel.

Siehe auch: Event Log · Zu grobe Zeitstempel · Fehlende Zeitstempel · ISO 8601
Mehr: Deep Dive 5, 5.3

## Zero-Day-Exploit
<!-- id: zero-day-exploit · quellen: Karte DD10, DD10 5.2 · stand: 2026-10 -->

Angriff, der eine Sicherheitslücke ausnutzt, für die der Hersteller noch kein Update bereitgestellt hat – oft, weil sie ihm noch unbekannt ist.

### Erklärung
„Zero Day“ bedeutet: Der Hersteller hatte null Tage Zeit, die Lücke zu schließen. Weil kein Patch existiert, helfen klassische Maßnahmen wie Patchmanagement nicht direkt. Schutz bieten **gestaffelte Maßnahmen**: Netzsegmentierung, Least Privilege, Härtung, Überwachung auf Auffälligkeiten (Anomalieerkennung) und ein geübtes Incident-Management. Sobald ein Patch erscheint, muss er schnell eingespielt werden.

### Beispiel
In der Webanwendung für Reparaturanfragen wird eine unbekannte Lücke im Webserver ausgenutzt. Weil der Server in einer eigenen Netzzone steht und nur Leserechte auf eine View hat, erreicht der Angreifer die Kundendatenbank nicht.

### Abgrenzung
Schwachstellenscan: findet bekannte Lücken. Zero-Day: unbekannte Lücke ohne Patch. Patchmanagement schließt bekannte Lücken nach Erscheinen des Updates.

### Prüfungsfalle
„Aktueller Virenschutz und alle Updates verhindern Zero-Day-Angriffe“ ist falsch – genau für diese Lücken gibt es noch kein Update und oft keine Signatur.

### Merksatz
Gegen Zero-Days hilft kein Patch, sondern Begrenzung des Schadens.

Siehe auch: Patchmanagement · Least Privilege · Schadsoftware · Penetrationstest
Mehr: Deep Dive 10, 5.2

## Zeugnis
<!-- id: zeugnis · quellen: DD13 1.4, DD13 3.5 · stand: 2026-10 -->

Schriftliche Bescheinigung über ein beendetes Ausbildungs- oder Arbeitsverhältnis, auf die ein gesetzlicher Anspruch besteht (§ 16 BBiG, § 109 GewO).

### Erklärung
Das **einfache Zeugnis** enthält Art, Dauer und Ziel der Ausbildung bzw. Tätigkeit und – bei Auszubildenden – die erworbenen Fertigkeiten, Kenntnisse und Fähigkeiten; es ist immer auszustellen. Das **qualifizierte Zeugnis** enthält zusätzlich **Leistung und Verhalten** und wird auf Verlangen erteilt. Es muss wahr und wohlwollend sowie klar formuliert sein; Geheimcodes sind unzulässig. Nicht hinein gehören Krankheiten, Betriebsratstätigkeit oder Gewerkschaftszugehörigkeit. Mit **Einwilligung** darf das Zeugnis heute auch elektronisch erteilt werden – für Auszubildende (§ 16 Abs. 1 BBiG) wie für Arbeitnehmer (§ 109 Abs. 3 GewO, Stand 2026).

### Beispiel
Lea Sommer verlangt zum Ausbildungsende ein qualifiziertes Zeugnis. Das Möbelhaus beschreibt Tätigkeiten und Kenntnisse und bewertet Leistung und Verhalten; ihre zwölf Krankheitstage werden nicht erwähnt.

### Abgrenzung
| | einfaches Zeugnis | qualifiziertes Zeugnis |
|---|---|---|
| Inhalt | Art, Dauer, (Ziel) | zusätzlich Leistung und Verhalten |
| Anspruch | immer | auf Verlangen |

### Prüfungsfalle
Krankheitstage oder Abmahnungsgründe im Zeugnis für zulässig halten – sie gehören nicht hinein.

### Merksatz
Einfach immer, qualifiziert auf Wunsch – wahr, wohlwollend, ohne Krankheiten.

Siehe auch: Arbeitszeugnis · Ausbildungsbetrieb · Probezeit
Mehr: Deep Dive 13, 1.4 · Deep Dive 13, 3.5

## Zielvariable
<!-- id: zielvariable · quellen: Karte DD6, DD6 2.1 · stand: 2026-10 -->

Die Größe, die ein Modell beim **überwachten Lernen** vorhersagen soll (Label).
Auch: Zielvariable / Label

### Erklärung
In den Trainingsdaten ist die Zielvariable für jeden Datensatz bekannt; das Modell lernt aus den **Merkmalen** (Features), sie vorherzusagen. Ist sie kategorial, liegt eine **Klassifikation** vor, ist sie metrisch, eine **Regression**. Beim unüberwachten Lernen (z. B. Clustering) gibt es keine Zielvariable. Die Zielvariable darf nicht zugleich als Merkmal ins Modell gelangen, auch nicht indirekt (Data Leakage).

### Beispiel
Reklamationsmodell im Möbelhaus: Zielvariable „Reklamation ja/nein“ (Klassifikation), Merkmale Produktkategorie, Bestellwert, Lieferzeit. Ein Prognosemodell für die Reparaturdauer in Minuten hätte eine metrische Zielvariable (Regression).

### Abgrenzung
| Begriff | Rolle |
|---|---|
| Merkmal / Feature | Eingangsgröße |
| Zielvariable / Label | Ausgangsgröße, die vorhergesagt wird |
| Datensatz / Instanz | eine Zeile |

### Prüfungsfalle
Die Art der Aufgabe am Verfahren statt an der Zielvariable festmachen – maßgeblich ist, ob die Zielvariable eine Kategorie oder eine Zahl ist.

### Merksatz
Das Label ist die Antwort, die Merkmale sind die Hinweise.

Siehe auch: Merkmal / Feature / Attribut · Klassifikation · Regression · Trainingsdaten
Mehr: Deep Dive 6, 2.1

## Zu grobe Zeitstempel
<!-- id: zu-grobe-zeitstempel · quellen: DD5 5.3 · stand: 2026-10 -->

Datenqualitätsproblem im Event Log, bei dem Zeitstempel nur das Datum (oder nur Stunden) enthalten, sodass Schritte innerhalb dieses Zeitraums nicht in die richtige Reihenfolge gebracht werden können.

### Erklärung
Process Mining bestimmt die Reihenfolge der Aktivitäten eines Falls über den Timestamp. Haben mehrere Ereignisse denselben Tag ohne Uhrzeit, ist ihre Abfolge unklar; das Werkzeug ordnet sie zufällig oder nach Ladereihenfolge. Folgen: scheinbare Varianten, falsche Schleifen und Durchlaufzeiten von 0 Tagen. Abhilfe: genauere Zeitstempel im Quellsystem erfassen; bis dahin eine fachlich begründete Sortierregel festlegen und dokumentieren.

### Beispiel
Event Log Reparaturservice: „Auftrag erfassen“ und „Kostenvoranschlag erstellen“ tragen beide nur 2026-05-12. In einem Teil der Fälle erscheint der Kostenvoranschlag vor der Erfassung – eine Variante, die es in Wirklichkeit nicht gibt.

### Abgrenzung
Fehlende Zeitstempel: keine Reihenfolge rekonstruierbar. Zu grobe Zeitstempel: Reihenfolge nur innerhalb eines Tages unklar. Zeitzonenprobleme: Zeitpunkte verschoben.

### Prüfungsfalle
Die vielen „Varianten“ als echten Prozessbefund interpretieren – erst die Datenqualität prüfen.

### Merksatz
Ohne Uhrzeit keine Reihenfolge am selben Tag.

Siehe auch: Event Log · Fehlende Zeitstempel · Zeitzonen-/Sommerzeitprobleme · Process Mining
Mehr: Deep Dive 5, 5.3

## Zufall / Scheinkorrelation
<!-- id: zufall-scheinkorrelation · quellen: DD4 1.3 · stand: 2026-10 -->

Erklärung für eine hohe Korrelation ohne inhaltlichen Zusammenhang: Sie ist rein zufällig entstanden oder ergibt sich nur, weil beide Größen im Zeitverlauf parallel wachsen.

### Erklärung
Wer viele Merkmalspaare prüft, findet zwangsläufig einige hohe Korrelationen: Bei 100 Paaren ohne echten Zusammenhang und einem Signifikanzniveau von 5 % sind rund 5 zufällig „signifikant“. Besonders anfällig sind **Zeitreihen** mit Trend – fast alles, was wächst, korreliert miteinander. Ob ein r zufällig sein kann, prüft ein Signifikanztest; für Kausalität braucht es zusätzlich einen plausiblen Wirkmechanismus oder ein kontrolliertes Experiment.

### Beispiel
Von 2020 bis 2026 steigen sowohl der Onlineumsatz des Möbelhauses als auch die Zahl der Ladesäulen in der Stadt – r = 0,95. Ein Wirkzusammenhang besteht nicht; beide folgen einem allgemeinen Zeittrend.

### Abgrenzung
| Erklärung | Ursache der Korrelation |
|---|---|
| Kausalität | x wirkt auf y (oder umgekehrt) |
| Drittvariable | eine dritte Größe beeinflusst beide |
| Zufall / Scheinkorrelation | kein Zusammenhang, nur Zufall oder gemeinsamer Trend |

### Prüfungsfalle
Aus „signifikant“ auf „kausal“ oder „stark“ schließen – signifikant heißt nur „vermutlich kein Zufall“.

### Merksatz
Was zusammen wächst, gehört nicht zusammen.

Siehe auch: Scheinkorrelation · Drittvariable · Kausalität · Korrelation
Mehr: Deep Dive 4, 1.3

## Zusammengesetzter Schlüssel
<!-- id: zusammengesetzter-schlussel · quellen: Karte DD2, DD2 1.2, DD2 1.5 · stand: 2026-10 -->

Primärschlüssel, der aus mehreren Attributen besteht, die nur gemeinsam jede Zeile eindeutig identifizieren, z. B. (bestell_id, produkt_id).

### Erklärung
Typisch ist er in **Zwischentabellen**, die eine m:n-Beziehung auflösen: Jeder Teil ist zugleich Fremdschlüssel. Kein Teil darf weggelassen werden, sonst ist die Eindeutigkeit verloren (Minimalität). Nur bei zusammengesetzten Schlüsseln kann es **partielle Abhängigkeiten** geben – ein Nichtschlüsselattribut hängt dann nur von einem Teil des Schlüssels ab, was die 2. Normalform verletzt.

### Beispiel
bestellposition(**bestell_id↑, produkt_id↑**, menge). Die menge hängt vom ganzen Schlüssel ab – korrekt. Stünde dort zusätzlich produkt_bezeichnung, hinge sie nur von produkt_id ab: partielle Abhängigkeit, Verstoß gegen die 2. NF.

### Abgrenzung
Surrogatschlüssel: ein künstliches Einzelattribut (z. B. position_id). Man kann einen zusammengesetzten Schlüssel durch einen Surrogatschlüssel ersetzen, muss die fachliche Eindeutigkeit dann aber per `UNIQUE (bestell_id, produkt_id)` absichern.

### Prüfungsfalle
Jedes Attribut des zusammengesetzten Schlüssels einzeln für eindeutig halten – eindeutig ist nur die Kombination.

### Merksatz
Gemeinsam eindeutig, einzeln nicht.

Siehe auch: Primärschlüssel · Zwischentabelle · Partielle Abhängigkeit · 2. Normalform · Surrogatschlüssel
Mehr: Deep Dive 2, 1.2 · Deep Dive 2, 1.5

## Zustandsdiagramm
<!-- id: zustandsdiagramm · quellen: Karte DD15, DD15 5.4, DD17 2.6 · stand: 2026-10 -->

UML-Verhaltensdiagramm (Zustandsautomat), das die Zustände eines einzelnen Objekts und die Übergänge dazwischen zeigt.

### Erklärung
Zustände sind abgerundete Rechtecke, Übergänge Pfeile mit der Beschriftung `Ereignis [Bedingung] / Aktion`. Ein gefüllter Kreis markiert den Startzustand, ein Kreis mit Punkt den Endzustand. Für Datenanalysten liefert das Diagramm die erlaubten Werte einer Statusspalte und die erlaubten Übergänge – Grundlage für Plausibilitätsprüfungen und den Zustandsübergangstest.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470 150" width="470" height="150" role="img" aria-label="Zustandsdiagramm eines Reparaturauftrags">
<defs><marker id="zustandsdiagramm-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<circle cx="20" cy="40" r="8" class="dg-voll"/>
<line x1="28" y1="40" x2="50" y2="40" class="dg-linie" marker-end="url(#zustandsdiagramm-pfeil)"/>
<rect x="50" y="22" width="90" height="36" rx="12" class="dg-form"/>
<text x="95" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-klein">angelegt</text>
<line x1="140" y1="40" x2="220" y2="40" class="dg-linie" marker-end="url(#zustandsdiagramm-pfeil)"/>
<text x="180" y="30" text-anchor="middle" class="dg-klein">annehmen</text>
<rect x="220" y="22" width="110" height="36" rx="12" class="dg-form"/>
<text x="275" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-klein">in Bearbeitung</text>
<line x1="330" y1="40" x2="370" y2="40" class="dg-linie" marker-end="url(#zustandsdiagramm-pfeil)"/>
<rect x="370" y="22" width="80" height="36" rx="12" class="dg-form"/>
<text x="410" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-klein">erledigt</text>
<line x1="95" y1="58" x2="95" y2="100" class="dg-linie" marker-end="url(#zustandsdiagramm-pfeil)"/>
<text x="102" y="82" class="dg-klein">stornieren [KV abgelehnt]</text>
<rect x="50" y="100" width="90" height="36" rx="12" class="dg-form"/>
<text x="95" y="118" text-anchor="middle" dominant-baseline="middle" class="dg-klein">storniert</text>
</svg>
```

### Beispiel
Reparaturauftrag: angelegt → in Bearbeitung → erledigt, alternativ angelegt → storniert. Ein Datensatz, der von „storniert“ auf „in Bearbeitung“ springt, ist unplausibel.

### Abgrenzung
| Diagramm | zeigt |
|---|---|
| Aktivitätsdiagramm | Ablauf von Tätigkeiten |
| Sequenzdiagramm | wer wem wann welche Nachricht schickt |
| Zustandsdiagramm | Lebenszyklus eines Objekts |

### Prüfungsfalle
Tätigkeiten als Zustände zeichnen („Auftrag prüfen“) – Zustände sind Situationen („geprüft“), Tätigkeiten stehen am Übergang.

### Merksatz
Zustandsdiagramm: Was kann ein Objekt sein, und wie kommt es dahin?

Siehe auch: Zustandsübergangstest · Aktivitätsdiagramm · Sequenzdiagramm
Mehr: Deep Dive 15, 5.4 · Deep Dive 17, 2.6

## Zustandslos
<!-- id: zustandslos · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

REST-Prinzip: Jede Anfrage enthält alle Informationen, die der Server zu ihrer Bearbeitung braucht; der Server speichert zwischen zwei Anfragen keinen Sitzungszustand des Clients.

### Erklärung
Authentifizierung, Filter und Seitenangaben werden bei jedem Aufruf mitgeschickt, etwa ein Token im `Authorization`-Header. Vorteile: Jeder Server im Cluster kann jede Anfrage beantworten, das System skaliert horizontal über einen Load Balancer, und ein Serverausfall verliert keine Sitzungen. Die Daten der Anwendung (Aufträge in der Datenbank) sind davon nicht betroffen – zustandslos bezieht sich nur auf den Gesprächszustand.

### Beispiel
```
GET /reparaturauftraege?status=offen&seite=2&limit=50
Authorization: Bearer eyJhbGciOi…
```
Die Seite 2 steht in der Anfrage; der Server muss sich nicht merken, dass der Client vorher Seite 1 abgerufen hat.

### Abgrenzung
Zustandsbehaftet: Der Server hält eine Sitzung (z. B. Warenkorb im Serverspeicher). Idempotent: Mehrfaches Ausführen ergibt denselben Serverzustand – ein anderes Prinzip.

### Prüfungsfalle
„Zustandslos heißt, der Server speichert keine Daten“ – gespeichert werden Ressourcen sehr wohl, nur kein Sitzungszustand.

### Merksatz
Jede Anfrage bringt alles mit – der Server erinnert sich an nichts.

Siehe auch: REST · REST-API · Idempotent · JWT
Mehr: Deep Dive 15, 3.2

## Zustandsübergangstest
<!-- id: zustandsubergangstest · quellen: Karte DD16, DD16 2.2 · stand: 2026-10 -->

Black-Box-Testverfahren für Systeme mit Zuständen: Jeder erlaubte Übergang wird mindestens einmal getestet, und es wird geprüft, dass unerlaubte Übergänge abgewiesen werden.

### Erklärung
Grundlage ist ein Zustandsdiagramm oder eine Zustandstabelle aus der Spezifikation. Daraus leitet man Testfälle ab: Ausgangszustand, Ereignis, erwarteter Folgezustand und Aktion. Das Mindestziel ist, jeden gültigen Übergang einmal auszuführen; zusätzlich werden typische ungültige Übergänge geprüft. Das Verfahren eignet sich für Statusfelder, Workflows und Bedienoberflächen.

### Beispiel
Bestellung mit den erlaubten Übergängen angelegt → bezahlt, angelegt → storniert, bezahlt → versendet, bezahlt → storniert.
- 4 Testfälle für die gültigen Übergänge
- Negativtests: versendet → angelegt und storniert → bezahlt müssen mit Fehlermeldung abgewiesen werden

### Abgrenzung
| Verfahren | geeignet für |
|---|---|
| Äquivalenzklassen, Grenzwerte | Eingabebereiche |
| Entscheidungstabellentest | Kombinationen von Bedingungen |
| Zustandsübergangstest | Abläufe mit Zuständen |

### Prüfungsfalle
Nur die erlaubten Übergänge testen – die Abweisung unerlaubter Übergänge gehört ausdrücklich dazu.

### Merksatz
Jeden erlaubten Pfeil einmal, die verbotenen bewusst probieren.

Siehe auch: Zustandsdiagramm · Black-Box-Test · Entscheidungstabellentest · Grenzwertanalyse
Mehr: Deep Dive 16, 2.2

## Zuweisung
<!-- id: zuweisung · quellen: Karte DD11, DD11 B4 · stand: 2026-10 -->

Anweisung, die einen Wert in einer Variablen speichert; im Pseudocode mit `←` oder `:=` geschrieben – nicht zu verwechseln mit dem Vergleich `=`.

### Erklärung
Bei der Zuweisung wird zuerst der Ausdruck rechts ausgewertet, dann das Ergebnis in die Variable links geschrieben. Deshalb ist `summe ← summe + wert` sinnvoll: Der alte Wert wird gelesen, erhöht und zurückgeschrieben. Der Vergleich `=` liefert dagegen nur wahr oder falsch und steht in Bedingungen (`WENN x = 0 DANN`). In vielen Programmiersprachen ist `=` die Zuweisung und `==` der Vergleich – im Pseudocode der Prüfung gilt `←` bzw. `:=`.

### Beispiel
```
anzahl ← 0
WENN status = 'offen' DANN
    anzahl ← anzahl + 1
ENDE WENN
```

### Abgrenzung
| Schreibweise | Bedeutung |
|---|---|
| `x ← 5`, `x := 5` | Zuweisung |
| `x = 5` (Pseudocode) | Vergleich |
| `x == 5` (z. B. Python) | Vergleich |

### Prüfungsfalle
`=` statt `←` in einer Schleife – dann wird verglichen statt zugewiesen, und der Zähler ändert sich nie.

### Merksatz
Der Pfeil schreibt, das Gleichheitszeichen fragt.

Siehe auch: Pseudocode · Zählen mit Bedingung · Wiederholung
Mehr: Deep Dive 11, B4

## Zweckbindung
<!-- id: zweckbindung · quellen: Karte DD10, DD10 2.1, DD5 5.4, DD6 6.2 · stand: 2026-10 -->

Grundsatz der DSGVO: Personenbezogene Daten dürfen nur für festgelegte, eindeutige und legitime Zwecke erhoben und nicht in einer damit unvereinbaren Weise weiterverarbeitet werden (Art. 5 Abs. 1 lit. b DSGVO).

### Erklärung
Der Zweck muss **bei der Erhebung** feststehen und den Betroffenen mitgeteilt werden. Eine spätere Nutzung für einen anderen Zweck ist nur zulässig, wenn er mit dem ursprünglichen vereinbar ist (Prüfung nach Art. 6 Abs. 4) oder eine neue Rechtsgrundlage, etwa eine Einwilligung, besteht. Archiv-, Forschungs- und Statistikzwecke gelten mit Garantien als vereinbar. Zweckbindung und **Datenminimierung** wirken zusammen: Nur die für den Zweck erforderlichen Merkmale werden verwendet.

### Beispiel
Das Event Log des Reparaturservice wurde zur Abrechnung erfasst. Will das Möbelhaus damit die Leistung einzelner Techniker bewerten, ist das ein neuer Zweck: Vereinbarkeit prüfen, Betriebsrat beteiligen (§ 87 Abs. 1 Nr. 6 BetrVG) – besser auf Teamebene aggregieren oder pseudonymisieren.

### Abgrenzung
| Grundsatz | Frage |
|---|---|
| Zweckbindung | Wofür dürfen die Daten genutzt werden? |
| Datenminimierung | Wie viele Daten sind nötig? |
| Speicherbegrenzung | Wie lange dürfen sie gespeichert werden? |

### Prüfungsfalle
„Die Daten liegen ja schon vor, also dürfen wir sie auswerten“ – vorhanden heißt nicht für jeden Zweck freigegeben.

### Merksatz
Erhoben für A heißt nicht erlaubt für B.

Siehe auch: Datenminimierung · Speicherbegrenzung · DSGVO · Einwilligung
Mehr: Deep Dive 10, 2.1 · Deep Dive 5, 5.4 · Deep Dive 6, 6.2

## Zweigüberdeckung (C1)
<!-- id: zweiguberdeckung · quellen: Karte DD16, DD16 2.2 · stand: 2026-10 -->

White-Box-Kriterium, nach dem jeder Zweig jeder Verzweigung – auch der leere Else-Zweig – mindestens einmal durchlaufen wird.

### Erklärung
Der Überdeckungsgrad ist $C1 = \frac{\text{durchlaufene Zweige}}{\text{alle Zweige}} \cdot 100\ \%$. Jede einfache Verzweigung hat zwei Zweige (wahr und falsch). C1 ist strenger als die Anweisungsüberdeckung (C0): 100 % C1 schließt 100 % C0 ein, umgekehrt nicht, weil ein leerer Else-Zweig keine Anweisung enthält.

### Beispiel
```
WENN menge > 20 DANN
    status ← 'Sonderanfrage'
ENDE WENN
```
Test 1: menge = 25 → 100 % C0, aber nur $\frac{1}{2} = 50\ \%$ C1. Test 2: menge = 10 durchläuft den leeren Else-Zweig → 100 % C1 mit 2 Testfällen.

### Abgrenzung
| Kriterium | Ziel | Stärke |
|---|---|---|
| C0 Anweisungsüberdeckung | jede Anweisung | schwach |
| C1 Zweigüberdeckung | jeder Zweig | stärker, schließt C0 ein |

### Prüfungsfalle
Annehmen, 100 % Anweisungsüberdeckung bedeute 100 % Zweigüberdeckung – der leere Else-Zweig wird dabei übersehen.

### Merksatz
C1 geht jeden Weg – auch den, auf dem nichts passiert.

Siehe auch: Anweisungsüberdeckung (C0) · White-Box-Test · Black-Box-Test
Mehr: Deep Dive 16, 2.2

## Zwischenereignis
<!-- id: zwischenereignis · quellen: Karte DD5, DD5 2.1, DD17 1.1 · stand: 2026-10 -->

BPMN-Ereignis mit **doppeltem Rand**, das während des Ablaufs zwischen Start und Ende eintritt, z. B. ein Timer oder ein Nachrichteneingang.

### Erklärung
Ein Symbol im Kreis zeigt den Typ: Uhr = Timer (Warten auf einen Zeitpunkt oder eine Frist), Umschlag = Nachricht (leer = empfangen, gefüllt = senden), Blitz = Fehler. Ein Zwischenereignis kann im Sequenzfluss stehen (der Prozess wartet) oder am Rand einer Aktivität angeheftet sein (es unterbricht oder ergänzt sie, z. B. eine Frist).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 80" width="330" height="80" role="img" aria-label="BPMN-Ereignisse: Start, Zwischen, Ende">
<circle cx="50" cy="32" r="18" class="dg-form"/>
<circle cx="165" cy="32" r="18" class="dg-form"/>
<circle cx="165" cy="32" r="14" class="dg-form"/>
<circle cx="280" cy="32" r="18" class="dg-form dg-dick"/>
<text x="50" y="70" text-anchor="middle" class="dg-klein">Start: dünn</text>
<text x="165" y="70" text-anchor="middle" class="dg-klein">Zwischen: doppelt</text>
<text x="280" y="70" text-anchor="middle" class="dg-klein">Ende: dick</text>
</svg>
```

### Beispiel
Reparaturprozess: Nach „Kostenvoranschlag senden“ folgt ein Zwischenereignis „Kundenantwort empfangen“ (Umschlag). Antwortet der Kunde nicht, greift über ein ereignisbasiertes Gateway ein Timer-Zwischenereignis „48 Stunden“.

### Abgrenzung
| Ereignis | Rand | Rolle |
|---|---|---|
| Startereignis | dünn | löst den Prozess aus |
| Zwischenereignis | doppelt | tritt im Ablauf ein |
| Endereignis | dick | beendet einen Pfad |

### Prüfungsfalle
Ein Warten als Task („2 Tage warten“) zeichnen – richtig ist ein Timer-Zwischenereignis.

### Merksatz
Dünn startet, doppelt passiert unterwegs, dick beendet.

Siehe auch: Startereignis · Endereignis · Ereignisbasiertes Gateway · BPMN
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Zwischentabelle
<!-- id: zwischentabelle · quellen: Karte DD2, DD2 1.5 · stand: 2026-10 -->

Eigene Tabelle, die eine m:n-Beziehung im Relationenmodell auflöst; ihr Primärschlüssel besteht meist aus den beiden Fremdschlüsseln.

### Erklärung
Ein Fremdschlüsselfeld kann je Zeile nur einen Wert aufnehmen, deshalb lässt sich m:n nicht direkt abbilden. Die Zwischentabelle (Beziehungs-, Verknüpfungs- oder Assoziationstabelle) enthält je Kombination eine Zeile mit den Fremdschlüsseln beider Seiten. Attribute der Beziehung selbst, etwa Menge oder Einzelpreis, wandern ebenfalls hierher. Aus einer m:n-Beziehung werden so zwei 1:n-Beziehungen.

### Beispiel
Möbelhaus: Eine Bestellung enthält viele Produkte, ein Produkt kommt in vielen Bestellungen vor.
- bestellung(**bestell_id**, bestelldatum, kunden_id↑)
- produkt(**produkt_id**, bezeichnung, preis)
- bestellposition(**bestell_id↑, produkt_id↑**, menge)

### Abgrenzung
1:n: Fremdschlüssel auf der n-Seite, keine Zwischentabelle nötig. m:n: immer Zwischentabelle. 1:1: Fremdschlüssel mit UNIQUE auf einer Seite oder Tabellen zusammenlegen.

### Prüfungsfalle
Die Menge in die Tabelle bestellung oder produkt schreiben – sie gehört zur Kombination und damit in die Zwischentabelle.

### Merksatz
Aus m:n werden zwei 1:n – über die Tabelle in der Mitte.

Siehe auch: Zusammengesetzter Schlüssel · Fremdschlüssel · Kardinalität · Primärschlüssel
Mehr: Deep Dive 2, 1.5

## Ausgelassen
- Zeit – MC-Taktik WiSo
- Zielgruppe zuerst – Gestaltungsregel Dashboard
- Zum Weiterüben – Abschnittstitel
- Zuordnen – Schritt k-Means
- Zusammenführen – mehrdeutiges Allgemeinwort
- Zusammenhang zweier Merkmale – Tabellenzeile Diagrammwahl
- Zuweisung und Vergleich unterscheiden – Regel, siehe Zuweisung
- Zweck – Abschnittsetikett
- Zweckbindung und Datenminimierung – Kombination, siehe Zweckbindung
