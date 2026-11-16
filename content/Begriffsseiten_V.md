<!-- Begriffsseiten V · Stand 2026-10 -->
## V-Modell
<!-- id: v-modell · quellen: Karte DD12, DD12 Teil 2, DD16 2.1 · stand: 2026-10 -->

Klassisches Vorgehensmodell, das den Wasserfall erweitert: Jeder Entwicklungsphase auf der linken Seite steht eine Teststufe auf der rechten Seite gegenüber.

### Erklärung
Links geht es vom Groben ins Feine (Anforderungen → Systementwurf → Architektur → Komponentenentwurf), unten wird implementiert, rechts wird vom Feinen ins Grobe getestet. Die Testfälle jeder Stufe entstehen schon zusammen mit der gegenüberliegenden Entwurfsphase. Stärke: hohe Qualitätssicherung und Nachweisbarkeit; Schwäche: ebenso starr wie der Wasserfall und dokumentationsintensiv.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" width="520" height="220" role="img" aria-label="V-Modell: Entwurfsphasen links, Teststufen rechts">
<line x1="60" y1="30" x2="260" y2="190" class="dg-linie dg-dick"/>
<line x1="260" y1="190" x2="460" y2="30" class="dg-linie dg-dick"/>
<text x="20" y="30" text-anchor="start" dominant-baseline="middle" class="dg-klein">Anforderungen</text>
<text x="70" y="70" text-anchor="start" dominant-baseline="middle" class="dg-klein">Systementwurf</text>
<text x="120" y="110" text-anchor="start" dominant-baseline="middle" class="dg-klein">Architektur</text>
<text x="150" y="150" text-anchor="start" dominant-baseline="middle" class="dg-klein">Komponentenentwurf</text>
<text x="500" y="30" text-anchor="end" dominant-baseline="middle" class="dg-klein">Abnahmetest</text>
<text x="450" y="70" text-anchor="end" dominant-baseline="middle" class="dg-klein">Systemtest</text>
<text x="400" y="110" text-anchor="end" dominant-baseline="middle" class="dg-klein">Integrationstest</text>
<text x="370" y="150" text-anchor="end" dominant-baseline="middle" class="dg-klein">Komponententest</text>
<line x1="125" y1="40" x2="400" y2="40" class="dg-linie dg-strich"/>
<line x1="160" y1="80" x2="355" y2="80" class="dg-linie dg-strich"/>
<text x="260" y="208" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Implementierung</text>
</svg>
```

### Beispiel
Im Reporting-Projekt des Möbelhauses Nordholz werden aus dem Lastenheft sofort die Abnahmekriterien abgeleitet, aus dem Pflichtenheft die Systemtestfälle.

### Abgrenzung
Der Wasserfall kennt eine Testphase am Ende, das V-Modell ordnet jeder Entwurfsebene eine Teststufe zu. Scrum testet iterativ in jedem Sprint. Das V-Modell XT ist der behördliche Standard mit Tailoring.

### Prüfungsfalle
Den Systemtest gegen das Lastenheft und den Abnahmetest gegen das Pflichtenheft prüfen lassen – es ist umgekehrt.

### Merksatz
Links entwerfen, rechts prüfen – jede Ebene hat ihr Gegenüber.

Siehe auch: Wasserfallmodell · V-Modell XT · Komponententest · Abnahmetest · Systemtest
Mehr: Deep Dive 12, Teil 2 · Deep Dive 16, 2.1

## V-Modell XT
<!-- id: v-modell-xt · quellen: DD12 Teil 2 · stand: 2026-10 -->

„Vorgehensmodell des Bundes“: Standard für IT-Projekte der öffentlichen Verwaltung in Deutschland; XT steht für „Extreme Tailoring“, die Anpassung an das jeweilige Projekt.

### Erklärung
Das V-Modell XT beschreibt nicht nur Phasen, sondern Projekttypen (z. B. Auftraggeber- oder Auftragnehmerprojekt), **Vorgehensbausteine** (wer erstellt welche Produkte in welchen Rollen) und **Entscheidungspunkte**, an denen über den Fortgang entschieden wird. Durch das Tailoring werden nur die Bausteine ausgewählt, die das konkrete Projekt braucht. Herausgeber ist der Bund; es ist frei verfügbar und kann auch agile Vorgehensweisen einbinden.

### Beispiel
Eine Landesbehörde beauftragt ein Auswertungsportal: Sie arbeitet nach V-Modell XT als Auftraggeberprojekt, der Dienstleister als Auftragnehmerprojekt; an den Entscheidungspunkten werden Lastenheft, Angebot und Abnahme formal freigegeben.

### Abgrenzung
Das allgemeine **V-Modell** ist das Grundprinzip (Entwurf ↔ Test); das **V-Modell XT** ist ein konkretes, umfassendes Regelwerk mit Rollen, Produkten und Tailoring.

### Prüfungsfalle
„XT“ als „Extended“ deuten – es heißt Extreme Tailoring.

### Merksatz
V-Modell XT = V-Modell für den Staat, passend zugeschnitten.

Siehe auch: V-Modell · Wasserfallmodell · Agile Vorgehensmodelle
Mehr: Deep Dive 12, Teil 2

## Valide
<!-- id: valide · quellen: Karte DD15, DD15 2.3 · stand: 2026-10 -->

Ein XML-Dokument ist valide, wenn es wohlgeformt ist **und** einem Schema (XSD oder DTD) entspricht.

### Erklärung
**Wohlgeformt** heißt nur syntaktisch korrekt: genau ein Wurzelelement, jedes Tag geschlossen, korrekt verschachtelt, Attributwerte in Anführungszeichen. **Valide** prüft zusätzlich gegen ein Schema, welche Elemente in welcher Reihenfolge und Anzahl vorkommen dürfen; eine XSD legt außerdem Datentypen fest (z. B. Datum, Dezimalzahl). Für JSON gibt es dasselbe Prinzip mit JSON Schema.

### Beispiel
```xml
<kunde id="1"><name>Huber GmbH</name><ort>München</ort></kunde>
```
Das Dokument ist wohlgeformt. Verlangt die XSD zusätzlich ein Pflichtelement `<plz>`, ist es nicht valide.

### Abgrenzung
| | wohlgeformt | valide |
|---|---|---|
| prüft | Syntax | Syntax + Schema |
| braucht Schema | nein | ja (XSD/DTD) |

Jedes valide Dokument ist wohlgeformt, aber nicht umgekehrt.

### Prüfungsfalle
Valide mit „inhaltlich richtig“ gleichsetzen: Ein valides Dokument kann trotzdem eine falsche Postleitzahl enthalten.

### Merksatz
Wohlgeformt = grammatisch korrekt, valide = hält sich an die Hausordnung.

Siehe auch: Wohlgeformt · XSD · DTD · XML
Mehr: Deep Dive 15, 2.3

## Validierungsdaten
<!-- id: validierungsdaten · quellen: Karte DD6, DD6 2.1 · stand: 2026-10 -->

Dritter Datenteil neben Trainings- und Testdaten, mit dem während der Entwicklung Parameter eingestellt und Modelle verglichen werden, damit die Testdaten bis zum Schluss unberührt bleiben.

### Erklärung
Wer Parameter (k bei k-NN, Baumtiefe) so lange an den Testdaten optimiert, bis das Ergebnis gut aussieht, hat die Testdaten indirekt mittrainiert – die gemessene Güte ist zu optimistisch. Deshalb: mit Trainingsdaten lernen, mit Validierungsdaten auswählen, mit Testdaten einmal abschließend prüfen. Statt einer festen Validierungsmenge wird oft die **Kreuzvalidierung** auf den Trainingsdaten genutzt.

### Beispiel
10.000 Reparaturaufträge: 60 % Training, 20 % Validierung, 20 % Test. Ein Entscheidungsbaum wird mit Tiefe 3, 5 und 8 trainiert; auf den Validierungsdaten gewinnt Tiefe 5. Nur dieses Modell wird einmal auf die Testdaten angewendet.

### Abgrenzung
| Datenteil | Zweck |
|---|---|
| Trainingsdaten | Modell lernt |
| Validierungsdaten | Parameter/Modell auswählen |
| Testdaten | unabhängige Schlussprüfung |

### Prüfungsfalle
Validierungsdaten mit „validen“ (formal korrekten) Daten verwechseln – es geht um die Aufteilung, nicht um Datenqualität.

### Merksatz
Training lernt, Validierung wählt, Test urteilt.

Siehe auch: Trainingsdaten · Testdaten · Kreuzvalidierung · Overfitting · Hyperparameter
Mehr: Deep Dive 6, 2.1 · Deep Dive 7, 1.3

## Value
<!-- id: valu · quellen: Karte DD8, DD8 5.2 · stand: 2026-10 -->

Big-Data-V: der Nutzen bzw. die Wertschöpfung, die sich aus den Daten ziehen lässt.

### Erklärung
Value ist das Ziel hinter den anderen V: Menge, Geschwindigkeit, Vielfalt und Verlässlichkeit sind nur Mittel. Ohne konkrete Fragestellung und messbaren Nutzen ist Big Data Selbstzweck und erzeugt nur Kosten für Speicher und Betrieb. Value wurde zusammen mit Veracity zu den ursprünglichen drei V (Volume, Velocity, Variety) ergänzt.

### Beispiel
Das Möbelhaus wertet Kassenbons und Klickdaten aus und senkt mit besseren Bestellmengen die Lagerkosten um 8 % – das ist der Value.

### Prüfungsfalle
Value mit Volume verwechseln – viele Daten sind noch kein Wert.

### Merksatz
Ohne Value ist Big Data nur Big Cost.

Siehe auch: Volume · Velocity · Variety · Veracity · Big Data
Mehr: Deep Dive 8, 5.2

## Variable Kosten
<!-- id: variable-kosten · quellen: Karte DD12, DD12 4.1 · stand: 2026-10 -->

Kosten, die sich mit der Menge (Ausbringung, Transaktionen, Nutzer) verändern, z. B. eine Gebühr je Transaktion.

### Erklärung
Gesamtkosten setzen sich aus fixen und variablen Kosten zusammen: $K = K_f + k_v \cdot x$. Fixkosten fallen unabhängig von der Menge an (Server, Grundgebühr), variable Kosten je Einheit. Die Trennung ist Grundlage für Kostenvergleich, Break-even-Menge und Deckungsbeitrag: Der Deckungsbeitrag je Stück ist Preis minus variable Stückkosten.

### Beispiel
Cloud-Dienst A: 500 € fix im Monat + 0,02 € je API-Aufruf; Dienst B: 0,07 € je Aufruf ohne Grundgebühr. Kritische Menge: $500 + 0{,}02 \cdot x = 0{,}07 \cdot x$ → $x = 500 / 0{,}05 = 10.000$ Aufrufe. Darüber ist A günstiger.

### Abgrenzung
| | fix | variabel |
|---|---|---|
| hängt von Menge ab | nein | ja |
| Beispiel | Serverpauschale, Lizenz | Transaktionsgebühr, Material |

Einmalig/laufend ist eine andere Einteilung (nach Zeit, nicht nach Menge).

### Prüfungsfalle
Variable Stückkosten für konstant halten und mit den Gesamtkosten verwechseln – je Stück bleiben sie gleich, insgesamt steigen sie mit der Menge.

### Merksatz
Fix bleibt, variabel wächst mit.

Siehe auch: Fixkosten · Break-even-Menge · Deckungsbeitrag · Kostenvergleichsrechnung – kritische Menge
Mehr: Deep Dive 12, 4.1

## Varianz
<!-- id: varianz · quellen: Karte DD3, DD3 4.3 · stand: 2026-10 -->

Streuungsmaß: mittlere quadrierte Abweichung der Werte vom Mittelwert – geteilt durch n (Grundgesamtheit, σ²) oder durch n − 1 (Stichprobe, s²).

### Erklärung
Rechenweg: Mittelwert bilden, Abweichungen berechnen, quadrieren und summieren (Summe der Abweichungsquadrate), durch n bzw. n − 1 teilen. Quadriert wird, weil sich die einfachen Abweichungen immer zu 0 summieren. Die Varianz hat eine quadrierte Einheit (Tage²) und ist eine Hilfsgröße; interpretiert wird die Wurzel daraus, die Standardabweichung. Werkzeuge: Excel VAR.P/VAR.S, SQL VAR_POP/VAR_SAMP.

### Beispiel
Durchlaufzeiten 2, 4, 5, 6, 8 Tage: $\bar{x} = 25 / 5 = 5$, Abweichungsquadrate $9 + 1 + 0 + 1 + 9 = 20$.
Grundgesamtheit: $\sigma^2 = 20 / 5 = 4$ Tage² → $\sigma = 2$ Tage. Stichprobe: $s^2 = 20 / 4 = 5$ → $s \approx 2{,}24$ Tage.

### Abgrenzung
Spannweite und IQR beruhen auf einzelnen Werten bzw. Quartilen; Varianz und Standardabweichung nutzen alle Werte und sind dadurch ausreißerempfindlich. Der Variationskoeffizient setzt die Streuung ins Verhältnis zum Mittelwert.

### Prüfungsfalle
Nicht angeben, ob durch n oder n − 1 geteilt wurde – oder die Varianz in der Einheit der Daten interpretieren.

### Merksatz
Varianz rechnen, Standardabweichung deuten – und die Variante hinschreiben.

Siehe auch: Standardabweichung · Variationskoeffizient · Grundgesamtheit · Stichprobe · Spannweite
Mehr: Deep Dive 3, 4.3

## Variationskoeffizient
<!-- id: variationskoffizient · quellen: Karte DD3, DD3 4.4 · stand: 2026-10 -->

Relatives Streuungsmaß: Standardabweichung geteilt durch den Mittelwert, meist in Prozent.

### Erklärung
$\text{VK} = \sigma / \bar{x}$ (bei Stichproben s statt σ). Weil die Streuung auf das Niveau bezogen wird, lassen sich Datenreihen mit unterschiedlich großen Werten oder Einheiten vergleichen. Sinnvoll nur bei verhältnisskalierten Daten mit positivem Mittelwert – für Temperaturen in °C ist er bedeutungslos.

### Beispiel
Team A: $\bar{x} = 50$ min, $\sigma = 5$ min → $\text{VK} = 10\ \%$. Team B: $\bar{x} = 100$ min, $\sigma = 8$ min → $\text{VK} = 8\ \%$. Team B streut absolut stärker (8 > 5), relativ aber weniger – es arbeitet gleichmäßiger.

### Abgrenzung
Die Standardabweichung misst die absolute Streuung in der Einheit der Daten, der VK die relative ohne Einheit.

### Prüfungsfalle
Nur die Standardabweichungen vergleichen, obwohl die Mittelwerte sehr verschieden sind – die typische Beurteilungsfrage zielt genau auf den VK.

### Merksatz
Unterschiedliches Niveau? Erst durch den Mittelwert teilen, dann vergleichen.

Siehe auch: Standardabweichung · Varianz · Verhältnisskala · Mittelwert
Mehr: Deep Dive 3, 4.4

## Variety
<!-- id: variety · quellen: Karte DD8, DD8 5.2 · stand: 2026-10 -->

Big-Data-V: die Vielfalt der Datenformate und -quellen – strukturiert, semistrukturiert und unstrukturiert.

### Erklärung
Neben Tabellen fallen Logdateien, JSON-Dokumente, Freitexte, Bilder und Sensordaten an. Klassische relationale Systeme mit festem Schema (Schema-on-Write) stoßen hier an Grenzen; Data Lakes speichern Rohdaten aller Formate und legen das Schema erst bei der Auswertung fest (Schema-on-Read).

### Beispiel
Möbelhaus: Verkaufstabellen, Produktbilder, Bewertungstexte und Temperaturdaten aus dem Lager sollen gemeinsam ausgewertet werden.

### Prüfungsfalle
Variety (Formatvielfalt) mit Veracity (Verlässlichkeit) verwechseln.

### Merksatz
Variety = viele Arten von Daten.

Siehe auch: Volume · Velocity · Veracity · Unstrukturierte Daten · Data Lake
Mehr: Deep Dive 8, 5.2

## Velocity
<!-- id: velocity · quellen: Karte DD8, DD8 5.2 · stand: 2026-10 -->

Big-Data-V: die hohe Geschwindigkeit, mit der Daten entstehen und verarbeitet werden müssen, teils in Echtzeit.

### Erklärung
Velocity entscheidet über die Verarbeitungsart: **Batch** sammelt Daten und verarbeitet sie in Intervallen (nächtlicher DWH-Lauf), **Streaming** verarbeitet sie fortlaufend (Betrugserkennung, Bestandswarnung). Leitfrage: Wie aktuell muss die Information sein, damit die Entscheidung noch etwas nützt?

### Beispiel
Live-Bestandsdaten der Filialen lösen sofort eine Nachbestellung aus, wenn ein Sofa-Modell ausverkauft ist – ein nächtlicher Batch wäre zu spät.

### Prüfungsfalle
Velocity als „Datenmenge pro Speicher“ deuten – gemeint ist die Geschwindigkeit, nicht die Menge (Volume).

### Merksatz
Velocity = Daten im Takt der Wirklichkeit.

Siehe auch: Volume · Variety · Value · Big Data
Mehr: Deep Dive 8, 5.2

## Veracity
<!-- id: veracity · quellen: Karte DD8, DD8 5.2 · stand: 2026-10 -->

Big-Data-V: die Verlässlichkeit und Wahrhaftigkeit der Daten – Herkunft, Genauigkeit und Vertrauenswürdigkeit.

### Erklärung
Große, schnelle und vielfältige Datenströme enthalten Fehler, Lücken, Dubletten und Daten unklarer Herkunft. Veracity verbindet Big Data mit Datenqualität: Ohne Profiling, Plausibilitätsregeln und Herkunftsnachweis sind Auswertungen nicht belastbar. Veracity kam später zu den ursprünglichen drei V hinzu.

### Beispiel
Bewertungstexte unklarer Herkunft (gekaufte Bewertungen) oder Sensoren, die bei Defekt 0 °C melden, verzerren die Analyse.

### Prüfungsfalle
Veracity für eine technische Größe halten – sie ist eine Qualitätsfrage.

### Merksatz
Veracity fragt: Kann ich diesen Daten trauen?

Siehe auch: Volume · Value · Korrektheit · Big Data
Mehr: Deep Dive 8, 5.2

## Verantwortlicher
<!-- id: verantwortlicher · quellen: Karte DD10, DD10 Teil 1 · stand: 2026-10 -->

Nach Art. 4 Nr. 7 DSGVO die Stelle, die allein oder gemeinsam mit anderen über Zwecke und Mittel der Verarbeitung personenbezogener Daten entscheidet – meist das Unternehmen.

### Erklärung
Der Verantwortliche trägt die Pflichten der DSGVO: Rechtsgrundlage, Informationspflichten, Betroffenenrechte, TOM, Verzeichnis von Verarbeitungstätigkeiten, Meldung von Datenpannen und die **Rechenschaftspflicht**. Verantwortlich ist die Organisation, nicht der einzelne Mitarbeiter und nicht der Datenschutzbeauftragte, der nur berät und überwacht.

### Beispiel
Das Möbelhaus Nordholz entscheidet, Kundendaten für die Lieferung und den Newsletter zu verarbeiten – es ist Verantwortlicher. Das externe Rechenzentrum, das die Datenbank betreibt, ist Auftragsverarbeiter.

### Abgrenzung
| Rolle | entscheidet über Zweck | Beispiel |
|---|---|---|
| Verantwortlicher | ja | Möbelhaus |
| Auftragsverarbeiter | nein, weisungsgebunden (AVV nach Art. 28) | Cloud-Hoster |
| Betroffene Person | – | Kundin |

### Prüfungsfalle
Den Datenschutzbeauftragten als Verantwortlichen bezeichnen.

### Merksatz
Wer über das Warum entscheidet, ist verantwortlich.

Siehe auch: Auftragsverarbeiter · Betroffene Person · Verarbeitung · Rechenschaftspflicht
Mehr: Deep Dive 10, Teil 1

## Verarbeitung
<!-- id: verarbeitung · quellen: Karte DD10, DD10 Teil 1 · stand: 2026-10 -->

Nach Art. 4 Nr. 2 DSGVO jeder Vorgang mit personenbezogenen Daten – vom Erheben über Speichern, Ändern, Auslesen und Übermitteln bis zum Löschen.

### Erklärung
Der Begriff ist bewusst weit: Schon das bloße Speichern oder Anzeigen ist Verarbeitung, ebenso Abfragen, Verknüpfen, Pseudonymisieren und das Löschen selbst. Für jede Verarbeitung braucht es eine Rechtsgrundlage nach Art. 6, und sie muss den Grundsätzen aus Art. 5 folgen (Zweckbindung, Datenminimierung …).

### Beispiel
Lea exportiert Kundendaten aus dem CRM, verknüpft sie per SQL mit Bestellungen und erstellt ein Dashboard – jeder dieser Schritte ist eine Verarbeitung.

### Abgrenzung
Daten juristischer Personen (die „Huber GmbH“ selbst) fallen nicht unter die DSGVO; die Daten ihrer Ansprechpartner schon. Echt anonymisierte Daten sind ebenfalls nicht erfasst.

### Prüfungsfalle
„Wir lesen die Daten nur, wir verarbeiten sie nicht“ – auch Lesen ist Verarbeitung.

### Merksatz
Alles, was man mit personenbezogenen Daten tut, ist Verarbeitung.

Siehe auch: Personenbezogene Daten · Verantwortlicher · Rechtsgrundlagen · Zweckbindung
Mehr: Deep Dive 10, Teil 1

## Verbindliche Erfassungsrichtlinien
<!-- id: verbindliche-erfassungsrichtlinien · quellen: DD9 5.2 · stand: 2026-10 -->

Organisatorische Data-Governance-Maßnahme: schriftlich festgelegte, für alle verbindliche Regeln, wie Daten zu erfassen sind – ergänzt durch Schulung der erfassenden Personen.

### Erklärung
Viele Datenqualitätsprobleme entstehen bei der Eingabe: abweichende Schreibweisen, Abkürzungen, Freitext in Kategoriefeldern. Erfassungsrichtlinien legen Formate (Datum, Telefonnummer), Pflichtangaben, Schreibweisen (Rechtsformzusatz „GmbH“), Vorgehen bei Dublettenverdacht und Zuständigkeiten fest. Technische Maßnahmen wie Pflichtfelder und Auswahllisten setzen die Regeln im System durch; die Richtlinie deckt ab, was sich nicht technisch prüfen lässt.

### Beispiel
Im Möbelhaus legt der Data Owner fest: Firmennamen mit offiziellem Rechtsformzusatz, Straßennamen ausgeschrieben, Neuanlage erst nach Dublettensuche. Neue Mitarbeitende werden darin geschult.

### Abgrenzung
Erfassungsrichtlinien sind präventiv und organisatorisch; Data Cleansing ist nachträglich und behandelt Symptome; Constraints sind technisch.

### Prüfungsfalle
Nur Bereinigung nennen, wenn nach „Datenqualität sicherstellen“ gefragt ist – ohne Prävention entstehen dieselben Fehler neu.

### Merksatz
Wer einheitlich erfasst, muss nicht ständig bereinigen.

Siehe auch: Data Governance · Data Owner · Pflichtfelder · Auswahllisten statt Freitext · Datenqualitätskreislauf
Mehr: Deep Dive 9, 5.2

## Verbindungen
<!-- id: verbindungen · quellen: DD5 2.1 · stand: 2026-10 -->

Die Verbindungsobjekte in BPMN: Sequenzfluss, Nachrichtenfluss und Assoziation – sie verknüpfen Ereignisse, Aktivitäten, Gateways und Artefakte.

### Erklärung
Der **Sequenzfluss** (durchgezogene Linie, gefüllte Pfeilspitze) legt die Reihenfolge fest und darf nur innerhalb eines Pools verlaufen, auch über Lanes hinweg. Der **Nachrichtenfluss** (gestrichelt, mit Kreis am Anfang und offener Pfeilspitze) zeigt Kommunikation zwischen Pools. Die **Assoziation** (gepunktet) hängt Datenobjekte und Anmerkungen an – ohne Wirkung auf den Ablauf.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 120" width="460" height="120" role="img" aria-label="BPMN-Verbindungen: Sequenzfluss, Nachrichtenfluss, Assoziation">
<defs>
<marker id="verbindungen-voll" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker>
<marker id="verbindungen-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-form"/></marker>
</defs>
<line x1="20" y1="25" x2="180" y2="25" class="dg-linie" marker-end="url(#verbindungen-voll)"/>
<text x="200" y="25" text-anchor="start" dominant-baseline="middle">Sequenzfluss – innerhalb eines Pools</text>
<circle cx="24" cy="60" r="4" class="dg-form"/>
<line x1="28" y1="60" x2="180" y2="60" class="dg-linie dg-strich" marker-end="url(#verbindungen-offen)"/>
<text x="200" y="60" text-anchor="start" dominant-baseline="middle">Nachrichtenfluss – zwischen Pools</text>
<line x1="20" y1="95" x2="180" y2="95" class="dg-linie" stroke-dasharray="2 4"/>
<text x="200" y="95" text-anchor="start" dominant-baseline="middle">Assoziation – zu Artefakten</text>
</svg>
```

### Beispiel
Im Reparaturprozess verbinden Sequenzflüsse „Auftrag erfassen“ und „Kostenvoranschlag erstellen“ in den Lanes Serviceannahme und Werkstatt; der Kostenvoranschlag geht per Nachrichtenfluss an den Pool Kunde.

### Prüfungsfalle
Ein Sequenzfluss zwischen zwei Pools – zwischen Pools fließen nur Nachrichten.

### Merksatz
Sequenz im Pool, Nachricht zwischen Pools, Assoziation zum Papier.

Siehe auch: Sequenzfluss · Nachrichtenfluss · Datenobjekt · Pools und Lanes
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Vereinigung (Join)
<!-- id: vereinigung · quellen: DD17 2.4, DD15 5.2 · stand: 2026-10 -->

Element im UML-Aktivitätsdiagramm (Balken), das parallele Zweige zusammenführt und erst weiterlaufen lässt, wenn alle eingehenden Zweige fertig sind.

### Erklärung
Die **Gabelung (Fork)** teilt den Ablauf in parallel laufende Zweige, die Vereinigung (Join) synchronisiert sie wieder. Beide werden als dicker Balken gezeichnet: die Gabelung mit einem Eingang und mehreren Ausgängen, die Vereinigung mit mehreren Eingängen und einem Ausgang. Das entspricht dem zusammenführenden AND-Gateway in BPMN.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 130" width="300" height="130" role="img" aria-label="Vereinigung im Aktivitätsdiagramm: zwei Zweige münden in einen Balken">
<defs><marker id="vereinigung-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<rect x="20" y="10" width="120" height="30" rx="12" class="dg-form"/>
<text x="80" y="25" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Rechnung erstellen</text>
<rect x="160" y="10" width="120" height="30" rx="12" class="dg-form"/>
<text x="220" y="25" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ware kommissionieren</text>
<line x1="80" y1="40" x2="80" y2="66" class="dg-linie" marker-end="url(#vereinigung-pfeil)"/>
<line x1="220" y1="40" x2="220" y2="66" class="dg-linie" marker-end="url(#vereinigung-pfeil)"/>
<rect x="50" y="66" width="200" height="6" class="dg-voll"/>
<line x1="150" y1="72" x2="150" y2="96" class="dg-linie" marker-end="url(#vereinigung-pfeil)"/>
<rect x="95" y="96" width="110" height="28" rx="12" class="dg-form"/>
<text x="150" y="110" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ware versenden</text>
</svg>
```

### Abgrenzung
Die **Zusammenführung** (Raute) führt alternative Zweige nach einer Entscheidung zusammen und wartet nicht; die Vereinigung (Balken) wartet auf alle parallelen Zweige.

### Prüfungsfalle
Nach einer Entscheidungsraute mit einem Join-Balken zusammenführen – der Balken wartet auf einen Zweig, der nie kommt (Deadlock).

### Merksatz
Balken wartet auf alle, Raute auf den einen.

Siehe auch: Gabelung (Fork) · Aktivitätsdiagramm · Gateway · UML
Mehr: Deep Dive 17, 2.4 · Deep Dive 15, 5.2

## Vererbung
<!-- id: vererbung · quellen: Karte DD15, DD15 5.3 · stand: 2026-10 -->

Beziehung im UML-Klassendiagramm, bei der eine Unterklasse Attribute und Methoden einer Oberklasse übernimmt („ist-ein“); gezeichnet als Linie mit leerem Dreieck an der Oberklasse.

### Erklärung
Die Unterklasse erbt alles Gemeinsame und ergänzt eigene Attribute oder Methoden. So steht Gemeinsames nur einmal in der Oberklasse. Im ERM entspricht das der Generalisierung/Spezialisierung („is-a“), die bei der Überführung in Tabellen auf drei Arten umgesetzt werden kann (eine Tabelle je Typ, nur Untertabellen oder eine Gesamttabelle mit Typspalte).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 150" width="320" height="150" role="img" aria-label="Vererbung: Privatkunde und Geschäftskunde erben von Kunde">
<defs><marker id="vererbung-dreieck" viewBox="0 0 12 12" markerWidth="14" markerHeight="14" refX="12" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 z" class="dg-form"/></marker></defs>
<rect x="110" y="10" width="100" height="30" class="dg-form"/>
<text x="160" y="25" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Kunde</text>
<rect x="20" y="105" width="120" height="30" class="dg-form"/>
<text x="80" y="120" text-anchor="middle" dominant-baseline="middle">Privatkunde</text>
<rect x="180" y="105" width="120" height="30" class="dg-form"/>
<text x="240" y="120" text-anchor="middle" dominant-baseline="middle">Geschäftskunde</text>
<path d="M80,105 L80,75 L160,75 L160,40" class="dg-linie" marker-end="url(#vererbung-dreieck)"/>
<path d="M240,105 L240,75 L160,75" class="dg-linie"/>
</svg>
```

### Beispiel
Geschäftskunde erbt von Kunde die Attribute kunden_id, name, ort und ergänzt ust_id.

### Abgrenzung
| Beziehung | Symbol | Bedeutung |
|---|---|---|
| Vererbung | leeres Dreieck | „ist ein“ |
| Aggregation | leere Raute | „hat“, Teile auch allein existent |
| Komposition | gefüllte Raute | „besteht aus“, Teile nicht allein existent |

### Prüfungsfalle
Das Dreieck an die Unterklasse zeichnen – es sitzt immer an der Oberklasse.

### Merksatz
Das Dreieck zeigt auf den Allgemeinen.

Siehe auch: Klassendiagramm · Generalisierung · Aggregation · Komposition
Mehr: Deep Dive 15, 5.3 · Deep Dive 17, 2.3

## Verfügbarkeit
<!-- id: verfugbarkeit · quellen: Karte DD10, DD10 4.1, DD10 5.2, DD16 4.1 · stand: 2026-10 -->

Schutzziel der Informationssicherheit: Systeme und Daten sind nutzbar, wenn sie gebraucht werden; als Kennzahl der Anteil der vereinbarten Servicezeit, in der ein System tatsächlich läuft.

### Erklärung
Verfügbarkeit gehört mit Vertraulichkeit und Integrität zur CIA-Trias. Bedroht wird sie durch Hardwaredefekte, Stromausfall, Fehlbedienung, Ransomware oder DDoS-Angriffe. Schutzmaßnahmen sind Redundanz (RAID, Cluster, Georedundanz), USV, Backup mit Wiederherstellungstests und Notfallpläne. Vertraglich wird sie im SLA zugesichert und in Prozent gemessen.

### Beispiel
Das Reporting des Möbelhauses ist während eines DDoS-Angriffs auf den Webserver nicht erreichbar – die Daten sind unverändert (Integrität) und nicht abgeflossen (Vertraulichkeit), aber nicht verfügbar.

### Abgrenzung
| Schutzziel | Frage | Maßnahme |
|---|---|---|
| Vertraulichkeit | Wer darf lesen? | Verschlüsselung, Rechte |
| Integrität | Unverändert? | Hashwerte, Signaturen |
| Verfügbarkeit | Nutzbar, wenn nötig? | Redundanz, Backup, USV |

### Prüfungsfalle
RAID als Backup ausgeben – RAID erhöht die Verfügbarkeit, schützt aber nicht vor Löschen oder Ransomware.

### Merksatz
Verfügbar ist, was läuft, wenn man es braucht.

Siehe auch: Schutzziele · Verfügbarkeitsberechnung · Verfügbarkeitsklassen · USV · RAID
Mehr: Deep Dive 10, 4.1 · Deep Dive 16, 4.1

## Verfügbarkeitsberechnung
<!-- id: verfugbarkeitsberechnung · quellen: Karte DD16, DD16 4.1, DD16 4.2, DD16 4.4 · stand: 2026-10 -->

Berechnung des Anteils der vereinbarten Servicezeit, in der ein System nutzbar ist: $V = (\text{Servicezeit} - \text{Ausfallzeit}) / \text{Servicezeit}$ oder $V = \text{MTBF} / (\text{MTBF} + \text{MTTR})$.

### Erklärung
Die erlaubte Ausfallzeit ergibt sich aus $\text{Servicezeit} \cdot (1 - V)$; ein Jahr rund um die Uhr hat $365 \cdot 24 = 8.760$ Stunden. Jede weitere „Neun“ verkürzt die erlaubte Ausfallzeit auf ein Zehntel. Bei mehreren Komponenten in Reihe werden die Verfügbarkeiten multipliziert, bei Parallelschaltung die Ausfallwahrscheinlichkeiten.

### Beispiel
SLA: 99,9 % pro Jahr (24/7), tatsächlich 12 Stunden Ausfall.
Erlaubt: $8.760 \cdot 0{,}001 = 8{,}76$ h. Tatsächlich: $(8.760 - 12) / 8.760 = 99{,}863\ \%$ → SLA verfehlt.
MTBF 990 h, MTTR 10 h: $990 / (990 + 10) = 99\ \%$.

### Abgrenzung
| V | Ausfall/Jahr (24/7) |
|---|---|
| 99 % | 87,6 h |
| 99,9 % | 8,76 h |
| 99,99 % | 52,56 min |

### Prüfungsfalle
Die Servicezeit ignorieren: 99,9 % bei Mo–Fr 8–18 Uhr ist eine ganz andere Zusage als 99,9 % rund um die Uhr; geplante Wartungsfenster zählen meist nicht als Ausfall.

### Merksatz
Erst die Servicezeit, dann der Prozentsatz.

Siehe auch: Verfügbarkeit · MTBF · MTTR · Reihenschaltung · Parallelschaltung · SLA
Mehr: Deep Dive 16, 4.1 · Deep Dive 16, 4.2 · Deep Dive 16, 4.4

## Verfügbarkeitsklassen
<!-- id: verfugbarkeitsklassen · quellen: Karte DD16, DD16 4.1 · stand: 2026-10 -->

Einteilung des BSI im Hochverfügbarkeitskompendium von VK 0 (ohne zugesicherte Verfügbarkeit) bis VK 5 (desastertolerant).

### Erklärung
Die Klassen geben an, welche Verfügbarkeit ein System erreichen soll, und damit, wie viel Redundanz und Aufwand nötig ist.

| Klasse | Bezeichnung (BSI) | Verfügbarkeit | Ausfall/Jahr |
|---|---|---|---|
| VK 0 | ohne zugesicherte Verfügbarkeit | – | – |
| VK 1 | normale Verfügbarkeit | 99 % | < 88 h |
| VK 2 | erhöhte Verfügbarkeit | 99,9 % | < 9 h |
| VK 3 | Hochverfügbarkeit | 99,99 % | < 53 min |
| VK 4 | Höchstverfügbarkeit | 99,999 % | < 6 min |
| VK 5 | desastertolerant | auch bei Katastrophen | – |

### Beispiel
Das Bürodashboard des Möbelhauses genügt VK 1; der Onlineshop mit Zahlungsabwicklung strebt VK 2 an und braucht dafür einen Cluster und redundante Netzanbindung.

### Abgrenzung
Die Schutzbedarfskategorien des IT-Grundschutzes (normal, hoch, sehr hoch) bewerten mögliche Schäden; Verfügbarkeitsklassen beschreiben eine messbare Zielverfügbarkeit.

### Prüfungsfalle
„Hochverfügbarkeit“ schon bei 99 % ansetzen – im BSI-Schema beginnt sie bei VK 3 (99,99 %); andere Quellen ziehen die Grenze teils erst bei 99,999 %.

### Merksatz
Je Klasse eine Neun mehr – und ein Zehntel der Ausfallzeit.

Siehe auch: Verfügbarkeit · Verfügbarkeitsberechnung · Hochverfügbarkeit · Schutzbedarfskategorien
Mehr: Deep Dive 16, 4.1

## Verhalten im Brandfall
<!-- id: verhalten-im-brandfall · quellen: DD14 5.1 · stand: 2026-10 -->

Feste Reihenfolge nach Brandschutzordnung: Ruhe bewahren → Brand melden → in Sicherheit bringen → Löschversuch unternehmen.

### Erklärung
Die Reihenfolge steht auf den Aushängen der Brandschutzordnung (Teil A) und schützt Menschen vor Sachwerten. Melden heißt Notruf 112 oder Druckknopfmelder mit den W-Fragen (Wo? Was? Wie viele Verletzte? Warten auf Rückfragen). In Sicherheit bringen umfasst Warnen gefährdeter Personen, Hilfe für Hilflose, Türen schließen, Aufzüge nicht benutzen und den Sammelplatz aufsuchen. Ein Löschversuch nur ohne Eigengefährdung, z. B. mit Feuerlöscher; Fluchtwege und Brandschutzzeichen sind rot-weiß bzw. grün-weiß gekennzeichnet.

### Beispiel
Im Serverraum des Möbelhauses riecht es verbrannt: Lea löst den Druckknopfmelder aus, warnt die Kollegen, schließt die Tür und geht zum Sammelplatz – nicht mit dem Wasserlöscher an die Elektrik.

### Prüfungsfalle
Den Löschversuch an die erste Stelle setzen – Menschen retten und melden gehen vor.

### Merksatz
Ruhe – Melden – Retten – Löschen.

Siehe auch: Arbeitsschutz · Sicherheitszeichen · Unterweisung
Mehr: Deep Dive 14, 5.1

## Verhältnisskala
<!-- id: verhaltnisskala · quellen: Karte DD3, DD3 Teil 1 · stand: 2026-10 -->

Höchstes Skalenniveau: gleiche Abstände **und** ein absoluter Nullpunkt, sodass auch Verhältnisse wie „doppelt so viel“ zulässig sind.
Auch: Verhältnis (Ratio)

### Erklärung
Auf der Verhältnisskala (Ratioskala) sind alle Rechenoperationen erlaubt: Häufigkeiten, Median, Mittelwert, Differenzen, Quotienten und der Variationskoeffizient. Der Nullpunkt bedeutet „nichts vorhanden“ (0 € Umsatz, 0 Minuten). Zusammen mit der Intervallskala bildet sie die **metrischen** (kardinalen) Skalen.

### Beispiel
Umsatz, Bearbeitungsdauer, Menge, Gewicht: 20 € sind doppelt so viel wie 10 €, und eine Reparatur von 90 Minuten dauert dreimal so lange wie eine von 30 Minuten.

### Abgrenzung
| Skala | Abstände gleich | absoluter Nullpunkt | Beispiel |
|---|---|---|---|
| Ordinal | nein | nein | Schulnote |
| Intervall | ja | nein | Temperatur in °C |
| Verhältnis | ja | ja | Umsatz, Dauer |

### Prüfungsfalle
Temperaturen in °C als verhältnisskaliert behandeln: 20 °C sind nicht „doppelt so warm“ wie 10 °C – die Celsius-Skala hat keinen absoluten Nullpunkt (Kelvin schon).

### Merksatz
Null heißt nichts – dann darf man auch teilen.

Siehe auch: Skalenniveau · Intervallskala · Ordinalskala · Nominalskala · Variationskoeffizient
Mehr: Deep Dive 3, Teil 1

## Verjährung
<!-- id: verjahrung · quellen: Karte DD14, DD14 2.5 · stand: 2026-10 -->

Verlust der Durchsetzbarkeit eines Anspruchs nach Fristablauf; die regelmäßige Frist beträgt 3 Jahre und beginnt mit dem Schluss des Jahres, in dem der Anspruch entstanden ist (§§ 195, 199 BGB).

### Erklärung
Nach Ablauf darf der Schuldner die Leistung verweigern (Einrede) – die Forderung erlischt aber nicht; wer trotzdem zahlt, kann nicht zurückfordern. **Hemmung** lässt die Frist ruhen (z. B. Mahnbescheid, Klage, Verhandlungen); **Neubeginn** startet sie von vorn (z. B. Anerkenntnis durch Abschlagszahlung). Sonderfristen: Gewährleistung beim Kauf neuer Sachen 2 Jahre ab Übergabe, Rechte an Grundstücken 10 Jahre.

### Beispiel
Rechnung des Möbelhauses vom 15.03.2026: Die Frist beginnt mit Ablauf des 31.12.2026 und endet mit Ablauf des 31.12.2029.

### Abgrenzung
Verjährung (3 Jahre, Jahresende) ist nicht die Gewährleistungsfrist (2 Jahre ab Übergabe der Sache) und nicht die Aufbewahrungsfrist für Rechnungen (8 Jahre nach HGB/AO, Stand 2026).

### Prüfungsfalle
Die drei Jahre ab dem Rechnungsdatum oder Fälligkeitstag zählen statt ab Jahresende.

### Merksatz
Drei Jahre – gezählt ab Silvester des Entstehungsjahres.

Siehe auch: Mahnverfahren · Gewährleistung · Kaufvertrag
Mehr: Deep Dive 14, 2.5

## Verkürzung
<!-- id: verkurzung · quellen: DD13 1.4, DD20 Teil 2 · stand: 2026-11 -->

Kürzung der Ausbildungszeit durch die IHK auf gemeinsamen Antrag von Auszubildendem und Ausbildendem, wenn das Ausbildungsziel in kürzerer Zeit erreichbar ist (§ 8 Abs. 1 BBiG).

Auch: Verlängerung der Ausbildung, Verkürzung der Ausbildung, Ausbildungsdauer

### Erklärung
Gründe sind z. B. Abitur, eine einschlägige Vorbildung oder sehr gute Leistungen. Die Verkürzung wird vorab beantragt und ändert das vertragliche Ausbildungsende. Davon zu unterscheiden ist die **vorzeitige Zulassung** zur Abschlussprüfung nach § 45 BBiG: Sie wird später wegen guter Leistungen gewährt, der Vertrag endet dann mit dem vorzeitigen Bestehen.

**Verlängerung:** In Ausnahmefällen kann die zuständige Stelle die Ausbildungszeit **auf Antrag des Auszubildenden** verlängern, wenn das nötig ist, um das Ausbildungsziel zu erreichen (z. B. nach längerer Krankheit); der Ausbildende wird vorher angehört (§ 8 Abs. 2 BBiG). Besteht der Auszubildende die Abschlussprüfung nicht, verlängert sich das Ausbildungsverhältnis **auf sein Verlangen** bis zur nächsten Wiederholungsprüfung, höchstens um **ein Jahr** (§ 21 Abs. 3 BBiG). Bei einer **Teilzeitberufsausbildung** (§ 7a BBiG) verlängert sich die Dauer entsprechend, das Ende ist aber auf höchstens das Anderthalbfache der Vollzeitdauer begrenzt.

### Beispiel
Lea hat Abitur. Mit dem Möbelhaus Nordholz beantragt sie zu Beginn eine Verkürzung von 36 auf 30 Monate; die IHK gibt dem Antrag statt.

### Abgrenzung
| | Verkürzung (§ 8) | Vorzeitige Zulassung (§ 45) |
|---|---|---|
| Wann | meist zu Beginn | gegen Ende |
| Antrag | gemeinsam AG und Azubi | Azubi, Anhörung des Betriebs |
| Wirkung | neues Vertragsende | Ende mit Bekanntgabe des Ergebnisses |

### Prüfungsfalle
Die Verkürzung als einseitiges Recht des Auszubildenden darstellen – der Antrag ist gemeinsam zu stellen, entscheiden muss die IHK. Bei der Verlängerung dagegen stellt der **Auszubildende** den Antrag (nach Nichtbestehen: Verlangen, höchstens ein Jahr); der Betrieb kann sie nicht erzwingen.

### Merksatz
Verkürzen beantragen beide – entscheiden tut die Kammer.

Siehe auch: BBiG · Vorzeitiges Bestehen · Probezeit · Prüfungsausschuss
Mehr: Deep Dive 13, 1.4 · Deep Dive 20, Teil 2

## Versicherungspflichtgrenze
<!-- id: versicherungspflichtgrenze · quellen: Karte DD14, DD14 1.3 · stand: 2026-10 -->

Jahresarbeitsentgeltgrenze in der Krankenversicherung: Wer regelmäßig darüber verdient, ist versicherungsfrei und kann in die private Krankenversicherung wechseln – 2026: 77.400 € im Jahr (6.450 € im Monat, Stand 2026).

### Erklärung
Geregelt in § 6 Abs. 6 SGB V, jährlich per Rechengrößenverordnung angepasst. Die Versicherungspflicht endet mit Ablauf des Kalenderjahres, in dem die Grenze überschritten wird, wenn das Entgelt auch die Grenze des Folgejahres übersteigt. Wer nicht wechselt, bleibt freiwillig gesetzlich versichert. Für die anderen Zweige (Renten-, Arbeitslosenversicherung) gibt es keine solche Grenze – dort bleibt man pflichtversichert.

### Beispiel
Ein Teamleiter verdient 6.800 € im Monat, also $6.800 \cdot 12 = 81.600$ € im Jahr > 77.400 € → er könnte in die PKV wechseln; KV-Beiträge zahlt er trotzdem nur bis zur Beitragsbemessungsgrenze von 5.812,50 € im Monat.

### Abgrenzung
| Grenze 2026 | Wirkung |
|---|---|
| Versicherungspflichtgrenze 77.400 €/Jahr | Wechsel in die PKV möglich |
| Beitragsbemessungsgrenze KV/PV 69.750 €/Jahr | darüber beitragsfrei |
| Beitragsbemessungsgrenze RV/ALV 101.400 €/Jahr | darüber beitragsfrei |

### Prüfungsfalle
Versicherungspflichtgrenze und Beitragsbemessungsgrenze vertauschen.

### Merksatz
Pflichtgrenze entscheidet ob gesetzlich, Bemessungsgrenze wie viel.

Siehe auch: Beitragsbemessungsgrenze · Krankenversicherung · Pflichtversicherung
Mehr: Deep Dive 14, 1.3

## Versionierung
<!-- id: versionierung · quellen: DD15 3.3 · stand: 2026-10 -->

Kennzeichnung von API-Versionen (z. B. `/v1/…`), damit Änderungen an einer Schnittstelle bestehende Nutzer nicht brechen.

### Erklärung
Ändert sich eine Schnittstelle inkompatibel – Feld umbenannt, Datentyp geändert, Pflichtparameter neu –, wird eine neue Hauptversion bereitgestellt, während die alte für eine Übergangszeit weiterläuft. Üblich ist die Version im Pfad (`/v2/reparaturauftraege`), seltener im Header. Rückwärtskompatible Erweiterungen (ein zusätzliches optionales Feld) brauchen keine neue Hauptversion. Abgekündigte Versionen werden mit Frist angekündigt.

### Beispiel
Das Filialsystem ruft `GET /v1/reparaturauftraege` auf. Das Möbelhaus stellt das Feld `kosten` von Text auf Dezimalzahl um und veröffentlicht `/v2/…`; die Filialen stellen bis Jahresende um, dann wird v1 abgeschaltet.

### Abgrenzung
Die Versionsverwaltung (Git) dokumentiert Änderungen am Code intern; die API-Versionierung schützt die externen Nutzer einer Schnittstelle.

### Prüfungsfalle
Eine inkompatible Änderung „still“ in der bestehenden Version ausrollen – alle Abnehmer brechen gleichzeitig.

### Merksatz
Neue Pflichten für den Client? Neue Versionsnummer.

Siehe auch: API-Versionierung · REST-API · Paginierung · Versionsverwaltung
Mehr: Deep Dive 15, 3.3

## Versionsverwaltung
<!-- id: versionsverwaltung · quellen: Karte DD16, DD16 1.1 · stand: 2026-10 -->

Werkzeug wie Git, das jede Änderung an Code, Skripten und Konfigurationen nachvollziehbar speichert, frühere Stände wiederherstellbar macht und paralleles Arbeiten erlaubt.

### Erklärung
Jede Änderung wird als **Commit** mit Autor, Zeitpunkt und Beschreibung gespeichert. In **Branches** entwickelt man Änderungen getrennt und führt sie per Merge zusammen, oft nach einem Review (Pull Request). Für Datenanalysten gehören SQL-Skripte, ETL-Jobs und Berichtsdefinitionen unter Versionsverwaltung – keine Daten mit Personenbezug und keine Passwörter. Sie ist eine Maßnahme der **konstruktiven** Qualitätssicherung.

### Beispiel
Nach einer Änderung liefert der Monatsbericht falsche Umsätze. Mit Git sieht Lea, welcher Commit die WHERE-Bedingung geändert hat, und setzt das Skript auf den letzten guten Stand zurück.

### Abgrenzung
Ein Backup sichert den Gesamtzustand zu festen Zeitpunkten; die Versionsverwaltung jede einzelne, kommentierte Änderung. Dateinamen wie „bericht_final_v3_neu.sql“ sind keine Versionsverwaltung.

### Prüfungsfalle
Zugangsdaten oder personenbezogene Exporte ins Repository einchecken – sie bleiben in der Historie, auch nach dem Löschen.

### Merksatz
Wer, wann, was, warum – und jederzeit zurück.

Siehe auch: Konstruktive Qualitätssicherung · Regressionstest · Versionierung
Mehr: Deep Dive 16, 1.1

## Verteilungseffekt
<!-- id: verteilungseffekt · quellen: Karte DD10, DD10 5.1 · stand: 2026-10 -->

Ausnahme vom Maximumprinzip im IT-Grundschutz: Der Schutzbedarf eines Systems sinkt, weil eine Anwendung redundant auf mehrere Systeme verteilt ist – meist beim Schutzziel Verfügbarkeit.

### Erklärung
Nach dem **Maximumprinzip** erbt ein System den höchsten Schutzbedarf seiner Anwendungen. Läuft eine Anwendung mit hohem Verfügbarkeitsbedarf aber auf zwei oder mehr Servern, die sich gegenseitig ersetzen, schadet der Ausfall eines einzelnen Servers kaum – sein eigener Schutzbedarf kann niedriger eingestuft werden. Die Entscheidung wird in der Schutzbedarfsfeststellung begründet und dokumentiert.

### Beispiel
Der Onlineshop des Möbelhauses (Verfügbarkeit „hoch“) läuft hinter einem Load Balancer auf zwei Webservern. Für jeden einzelnen Server wird die Verfügbarkeit nur als „normal“ eingestuft.

### Abgrenzung
| Effekt | Wirkung |
|---|---|
| Maximumprinzip | höchster Schutzbedarf wird übernommen |
| Kumulationseffekt | viele kleine Schäden summieren sich → Schutzbedarf steigt |
| Verteilungseffekt | Redundanz → Schutzbedarf des Einzelsystems sinkt |

### Prüfungsfalle
Den Verteilungseffekt auf Vertraulichkeit anwenden: Liegen Kundendaten auf zwei Servern, gibt es zwei Angriffsziele – die Vertraulichkeit sinkt nicht.

### Merksatz
Verteilen senkt die Last je Server – meist nur bei der Verfügbarkeit.

Siehe auch: Maximumprinzip · Kumulationseffekt · Schutzbedarfsfeststellung · Verfügbarkeit
Mehr: Deep Dive 10, 5.1

## Vertikale Partitionierung
<!-- id: vertikale-partitionierung · quellen: DD8 5.3 · stand: 2026-10 -->

Spaltenweise Aufteilung einer Tabelle: selten genutzte oder große Spalten werden in eine eigene Tabelle mit demselben Schlüssel ausgelagert.

### Erklärung
Die häufig gelesenen, kleinen Spalten bleiben zusammen und passen besser in Speicher und Cache; große Inhalte (Freitexte, Bilder, JSON) oder sensible Spalten liegen getrennt. Über den gemeinsamen Primärschlüssel lassen sich beide Teile per 1:1-Join wieder zusammensetzen. Eine Nebenwirkung: Sensible Spalten können eigene Zugriffsrechte bekommen.

### Beispiel
Die Tabelle produkt wird aufgeteilt in produkt(produkt_id, bezeichnung, kategorie, preis) und produkt_detail(produkt_id, langbeschreibung, bild). Preislisten lesen nur noch die schlanke Tabelle.

### Abgrenzung
| | vertikal | horizontal |
|---|---|---|
| teilt nach | Spalten | Zeilen (Range, Liste, Hash) |
| Beispiel | Langtext auslagern | eine Partition je Monat |
| verteilt auf Server | selten | Sharding |

Die spaltenorientierte Speicherung (Column Store) treibt die Idee auf die Spitze: jede Spalte einzeln.

### Prüfungsfalle
Vertikal und horizontal vertauschen – vertikal schneidet zwischen Spalten, also von oben nach unten.

### Merksatz
Vertikal trennt Spalten, horizontal trennt Zeilen.

Siehe auch: Horizontale Partitionierung · Partitionierung · Spaltenorientierte Speicherung · Sharding
Mehr: Deep Dive 8, 5.3

## Vertikale Skalierung
<!-- id: vertikale-skalierung · quellen: Karte DD15, DD15 4.1, DD8 5.2 · stand: 2026-10 -->

Mehr Leistung durch einen stärkeren Einzelserver – mehr CPU, Arbeitsspeicher oder schnellere Platten (Scale-up); klassisch bei relationalen Datenbanken.

### Erklärung
Vertikale Skalierung ist einfach: Die Anwendung muss nicht geändert werden, Transaktionen und Konsistenz bleiben auf einem System. Sie stößt aber an physische und wirtschaftliche Grenzen (die größte Maschine ist teuer und endlich), und der Server bleibt ein Single Point of Failure. Für sehr große Datenmengen setzt man daher auf horizontale Skalierung (Hadoop, Spark, viele NoSQL-Systeme).

### Beispiel
Die Reporting-Datenbank des Möbelhauses wird zu langsam. Der Server erhält statt 64 GB nun 256 GB Arbeitsspeicher – die Abfragen laufen wieder schnell, ohne dass ein SQL-Skript geändert wird.

### Abgrenzung
| | vertikal (Scale-up) | horizontal (Scale-out) |
|---|---|---|
| Prinzip | stärkerer Server | mehr Server |
| Grenze | Hardware-Obergrenze | praktisch offen |
| Ausfallsicherheit | ein System | Redundanz möglich |
| typisch | relationale DB | NoSQL, Big Data |

### Prüfungsfalle
Vertikale Skalierung als Mittel für Hochverfügbarkeit nennen – ein stärkerer Server fällt genauso aus wie ein schwacher.

### Merksatz
Up = größer, Out = mehr.

Siehe auch: Horizontale Skalierung · NoSQL · CAP-Theorem · Skalierung
Mehr: Deep Dive 15, 4.1 · Deep Dive 8, 5.2

## Vertragserfüllung
<!-- id: vertragserfullung · quellen: Karte DD10, DD10 2.2 · stand: 2026-10 -->

Rechtsgrundlage nach Art. 6 Abs. 1 lit. b DSGVO: Verarbeitung ist erlaubt, soweit sie zur Erfüllung eines Vertrags mit der betroffenen Person oder für vorvertragliche Maßnahmen auf ihre Anfrage erforderlich ist.

### Erklärung
Entscheidend ist das Wort **erforderlich**: Gedeckt sind nur Daten, ohne die der Vertrag nicht erfüllt werden kann – Name, Lieferadresse, Zahlungsdaten. Eine Einwilligung ist dafür nicht nötig. Für Zwecke darüber hinaus (Werbung, Profiling) braucht es eine andere Grundlage, etwa Einwilligung oder berechtigtes Interesse. Auch im Arbeitsverhältnis ist lit. b eine zentrale Rechtsgrundlage (Lohnabrechnung, Arbeitszeit).

### Beispiel
Eine Kundin kauft ein Sofa im Möbelhaus Nordholz: Adresse und Telefonnummer für die Lieferung – Vertragserfüllung. Der Newsletter danach – Einwilligung.

### Abgrenzung
| Grundlage | Beispiel |
|---|---|
| lit. a Einwilligung | Newsletter |
| lit. b Vertragserfüllung | Lieferadresse |
| lit. c rechtliche Verpflichtung | Rechnungen aufbewahren |
| lit. f berechtigtes Interesse | Betrugsprävention |

### Prüfungsfalle
Für die Lieferadresse eine Einwilligung einholen – wird sie widerrufen, müsste man trotzdem liefern; die richtige Grundlage ist der Vertrag.

### Merksatz
Was der Vertrag braucht, braucht keine Einwilligung.

Siehe auch: Rechtsgrundlagen · Einwilligung · Berechtigtes Interesse · Zweckbindung
Mehr: Deep Dive 10, 2.2

## Vertragsstrafen
<!-- id: vertragsstrafen · quellen: DD13 1.2 · stand: 2026-10 -->

Im Berufsausbildungsvertrag nichtige Vereinbarung (§ 12 Abs. 2 Nr. 2 BBiG): Der Auszubildende darf nicht zur Zahlung einer Strafe für Vertragsverletzungen verpflichtet werden.

### Erklärung
§ 12 BBiG schützt Auszubildende vor Klauseln, die sie unangemessen binden. Nichtig sind: Vertragsstrafen, die Pflicht zur Zahlung einer Entschädigung für die Ausbildung, Ausschluss oder Beschränkung von Schadensersatzansprüchen, Schadensersatz in Pauschalbeträgen sowie eine Bleibeverpflichtung nach der Ausbildung (außer sie wird in den letzten sechs Monaten vereinbart). Nichtig ist nur die Klausel; der übrige Ausbildungsvertrag bleibt wirksam.

### Beispiel
Im Vertrag von Jonas steht: „Bei Abbruch der Ausbildung zahlt der Auszubildende 2.000 € Vertragsstrafe.“ Die Klausel ist nichtig; Jonas schuldet nichts, sein Vertrag gilt im Übrigen weiter.

### Abgrenzung
In normalen Arbeitsverträgen sind Vertragsstrafen in Grenzen zulässig (AGB-Kontrolle) – das Verbot gilt speziell für die Ausbildung. Echter, nachgewiesener Schadensersatz bei schuldhafter Schädigung bleibt möglich.

### Prüfungsfalle
Annehmen, der ganze Ausbildungsvertrag sei wegen der Klausel unwirksam.

### Merksatz
Keine Strafe, kein Lehrgeld, keine Pauschale – im Ausbildungsvertrag nichtig.

Siehe auch: Nichtige Vereinbarungen · BBiG · Probezeit
Mehr: Deep Dive 13, 1.2

## Vertraulichkeit
<!-- id: vertraulichkeit · quellen: Karte DD10, DD10 4.1 · stand: 2026-10 -->

Schutzziel der Informationssicherheit: Nur Berechtigte können Daten lesen oder Informationen einsehen.

### Erklärung
Vertraulichkeit wird durch Zugriffsbeschränkung und Verschlüsselung gesichert: Berechtigungskonzept nach Need-to-know und Least Privilege, Verschlüsselung bei Übertragung (HTTPS, VPN) und im Ruhezustand, Pseudonymisierung, Protokollierung von Zugriffen. Zusammen mit Integrität und Verfügbarkeit bildet sie die CIA-Trias. Die DSGVO verlangt sie in Art. 5 (Integrität und Vertraulichkeit) und Art. 32.

### Beispiel
Gehaltsdaten im Möbelhaus sind „streng vertraulich“: Nur die Personalabteilung hat Zugriff, die Tabelle ist verschlüsselt, jeder Zugriff wird protokolliert. Analysten sehen nur eine View ohne Namen.

### Abgrenzung
Vertraulichkeit fragt „Wer darf lesen?“, Integrität „Ist es unverändert?“, Verfügbarkeit „Ist es nutzbar?“. Maximale Vertraulichkeit kann die Verfügbarkeit senken – Schutzziele stehen im Zielkonflikt.

### Prüfungsfalle
Hashwerte als Maßnahme für Vertraulichkeit nennen – sie sichern die Integrität; Vertraulichkeit sichert die Verschlüsselung.

### Merksatz
Vertraulich = nur die Richtigen können mitlesen.

Siehe auch: Schutzziele · Integrität · Verfügbarkeit · Need-to-know · Least Privilege
Mehr: Deep Dive 10, 4.1

## Verzeichnis von Verarbeitungstätigkeiten
<!-- id: verzeichnis-von-verarbeitungstatigkeiten · quellen: Karte DD10, DD10 2.4 · stand: 2026-10 -->

Pflichtdokumentation nach Art. 30 DSGVO, in der der Verantwortliche jede Verarbeitung personenbezogener Daten beschreibt.

### Erklärung
Je Verarbeitungstätigkeit enthält das Verzeichnis: Name und Kontaktdaten des Verantwortlichen (und des Datenschutzbeauftragten), Zwecke, Kategorien betroffener Personen und Daten, Empfänger, Drittlandübermittlungen, vorgesehene Löschfristen und eine allgemeine Beschreibung der TOM. Es ist schriftlich bzw. elektronisch zu führen und der Aufsichtsbehörde auf Anfrage vorzulegen. Die Ausnahme für Unternehmen unter 250 Beschäftigten greift nur, wenn die Verarbeitung gelegentlich, risikoarm und ohne besondere Kategorien erfolgt – bei regelmäßiger Kunden- oder Lohnverarbeitung praktisch nie. Auch Auftragsverarbeiter führen ein eigenes Verzeichnis (Art. 30 Abs. 2).

### Beispiel
Eintrag „Reklamationsanalyse“: Zweck Qualitätsverbesserung, Betroffene Kunden, Daten Auftragsnummer und Reklamationsgrund (pseudonymisiert), Empfänger Qualitätsmanagement, Löschung nach 3 Jahren, TOM Rollenkonzept und Verschlüsselung.

### Abgrenzung
Das Verzeichnis dokumentiert alle Verarbeitungen; die Datenschutz-Folgenabschätzung (Art. 35) bewertet nur Verarbeitungen mit voraussichtlich hohem Risiko vertieft.

### Prüfungsfalle
Annehmen, kleine Unternehmen bräuchten grundsätzlich kein Verzeichnis.

### Merksatz
Rechenschaft beginnt mit dem Verzeichnis.

Siehe auch: Rechenschaftspflicht · Technische und organisatorische Maßnahmen · Datenschutz-Folgenabschätzung · Verantwortlicher
Mehr: Deep Dive 10, 2.4

## Verzweigung
<!-- id: verzweigung · quellen: Karte DD11, DD11 B1, DD17 4.1, DD17 4.2 · stand: 2026-10 -->

Kontrollstruktur (Selektion), bei der abhängig von einer Bedingung der eine oder andere Zweig ausgeführt wird – WENN – DANN – SONST.

### Erklärung
Neben Sequenz und Wiederholung ist die Verzweigung einer der drei Bausteine jedes Algorithmus. Formen: **einseitig** (WENN … DANN, sonst nichts), **zweiseitig** (WENN … DANN … SONST) und **mehrfach** (Fallauswahl). Im PAP ist sie eine Raute mit ja/nein-Ausgängen, im Struktogramm ein Block mit zwei Diagonalen, Bedingung oben und darunter je eine Spalte für ja und nein (leerer Zweig: ∅).

### Beispiel
```text
WENN betrag > 1000 DANN
    rabatt ← betrag · 0,05
SONST
    rabatt ← 0
ENDE WENN
```
Bei 1.200 € ergibt sich $1.200 \cdot 0{,}05 = 60$ € Rabatt.

### Abgrenzung
Die Verzweigung wählt einen Weg einmalig; die Wiederholung führt einen Block mehrfach aus, solange eine Bedingung gilt. In BPMN heißt das Gegenstück XOR-Gateway, im Aktivitätsdiagramm Entscheidungsknoten.

### Prüfungsfalle
Grenzwerte falsch setzen (> statt ≥) oder bei der Fallauswahl den SONST-Fall vergessen.

### Merksatz
Eine Bedingung, zwei Wege – genau einer wird gegangen.

Siehe auch: Sequenz · Wiederholung · Raute · Struktogramm · Programmablaufplan
Mehr: Deep Dive 11, B1 · Deep Dive 17, 4.1 · Deep Dive 17, 4.2

## Videoüberwachung
<!-- id: videouberwachung · quellen: Karte DD19, DD19 3.5, DD10 2.1, DD10 2.2, DD20 · stand: 2026-11 -->

Beobachtung und Aufzeichnung von Räumen oder Personen mit Kameras; weil Menschen erkennbar sind, ist das eine Verarbeitung personenbezogener Daten und unterliegt der DSGVO.

Auch: Videoerfassung, Kameraüberwachung

### Erklärung
Hier geht es um die **Datenschutz-Seite** (Stand 2026). Wer Kameras betreibt, braucht eine **Rechtsgrundlage** und muss die Grundsätze der DSGVO einhalten:

| Anforderung | Was heißt das bei Kameras? |
|---|---|
| **Rechtsgrundlage** | meist berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO (z. B. Schutz vor Diebstahl, Hausrecht) nach einer Interessenabwägung; für öffentlich zugängliche Räume ergänzt § 4 BDSG die Regeln |
| **Erforderlichkeit** | Gibt es ein milderes Mittel (Beleuchtung, Zutrittskontrolle, Personal)? Erst dann Kameras |
| **Zweckbindung** | Zweck vorher festlegen und nicht für andere Zwecke nutzen (z. B. keine Leistungskontrolle) |
| **Datenminimierung** | nur den nötigen Bildausschnitt erfassen, Nachbargrundstücke und Privatbereiche ausblenden; bei Bildanalyse nur die relevante Region speichern |
| **Speicherbegrenzung** | Aufnahmen automatisch und zügig löschen; Aufsichtsbehörden halten meist wenige Tage, häufig 72 Stunden, für ausreichend |
| **Transparenz** | Hinweisschild am Eingang des erfassten Bereichs: Kamera-Symbol, Verantwortlicher, Zweck, Kontakt; weitere Pflichtangaben nach Art. 13 DSGVO z. B. über einen Aushang oder QR-Code |
| **Sicherheit (TOM)** | Zugriff nur für wenige Berechtigte mit Protokoll, Verschlüsselung der Aufnahmen |
| **Folgenabschätzung** | bei systematischer, umfangreicher Überwachung öffentlich zugänglicher Bereiche Pflicht (Art. 35 Abs. 3 lit. c) |

**Verboten bzw. besonders heikel:** Kameras in Toiletten, Umkleiden, Sanitär- und Pausenräumen; Ton aufnehmen (§ 201 StGB); dauernde Überwachung von Beschäftigten am Arbeitsplatz. **Biometrische Gesichtserkennung** betrifft besondere Kategorien nach Art. 9 DSGVO und ist nur in engen Ausnahmen erlaubt.

**Beschäftigte:** Der Betriebsrat hat nach § 87 Abs. 1 Nr. 6 BetrVG mitzubestimmen; üblich ist eine **Betriebsvereinbarung**. Eine Einwilligung der Beschäftigten taugt kaum als Grundlage, weil sie wegen des Abhängigkeitsverhältnisses als nicht freiwillig gilt.

### Beispiel
Im Verkaufsraum der Möbelhaus Nordholz GmbH sollen zwei Kameras am Eingang und an der Kasse Diebstahl verhindern. Das Möbelhaus legt den Zweck „Schutz vor Diebstahl und Raub“ fest, filmt nur diese zwei Bereiche (nicht die Umkleide der Beschäftigten und nicht den Gehweg), hängt Hinweisschilder am Eingang auf, löscht die Aufnahmen automatisch nach 72 Stunden, beschränkt den Zugriff auf die Marktleitung und schließt mit dem Betriebsrat eine Betriebsvereinbarung. Fragt eine Klausur nach zwei Maßnahmen für den rechtskonformen Betrieb, sind Hinweisschilder und automatische Löschung die naheliegenden Antworten.

### Abgrenzung
| | Videoüberwachung | Videoerfassung für Bilderkennung |
|---|---|---|
| Zweck | Sicherheit, Beweissicherung | Prozess, z. B. Etikett oder Kennzeichen lesen |
| Personen im Bild | Hauptgegenstand | unerwünschter Beifang |
| typische Maßnahme | Hinweisschild, kurze Löschfrist | nur die Etikettenregion speichern, Personen unkenntlich machen |

Beide brauchen Rechtsgrundlage, Hinweisschilder und eine Löschfrist. Eine **Zutrittskontrolle** per Chip oder Schloss ist dagegen eine technische und organisatorische Maßnahme und kein Ersatz für Kameras, sondern oft das mildere Mittel.

### Prüfungsfalle
Das Hinweisschild für die Rechtsgrundlage halten: Es stellt nur Transparenz her. Zulässig wird die Überwachung erst durch Rechtsgrundlage, Erforderlichkeit und Interessenabwägung. Außerdem „Einwilligung der Mitarbeiter“ als Standardlösung nennen – im Arbeitsverhältnis ist sie problematisch, besser sind Betriebsvereinbarung und berechtigtes Interesse.

### Merksatz
Kamera nur mit Grund, Hinweisschild, kleinem Blickfeld und kurzer Löschfrist.

Siehe auch: DSGVO · Berechtigtes Interesse · Zweckbindung · Datenminimierung · Speicherbegrenzung · Datenschutz-Folgenabschätzung · Betriebsvereinbarung · Betriebsrat · Technische und organisatorische Maßnahmen
Mehr: Deep Dive 19, 3.5 · Deep Dive 10, 2.2

## Vier-Augen-Prinzip
<!-- id: vier-augen-prinzip · quellen: Karte DD9, DD9 5.2 · stand: 2026-10 -->

Organisatorische Kontrollmaßnahme: Kritische Vorgänge wie Freigaben oder Stammdatenänderungen müssen von einer zweiten Person geprüft oder bestätigt werden.

### Erklärung
Das Prinzip verhindert Fehler und Manipulation, weil eine Person allein eine kritische Änderung nicht abschließen kann. Es ist Teil von Data Governance, IT-Sicherheit (Rechtevergabe) und interner Kontrolle; technisch wird es über Freigabe-Workflows umgesetzt, z. B. Pull Requests mit Review. Es ist aufwendig und daher gezielt an kritischen Stellen einzusetzen.

### Beispiel
Ändert jemand im Möbelhaus die Bankverbindung eines Lieferanten, wird die Änderung erst aktiv, wenn eine zweite Person aus der Buchhaltung sie freigibt – ein Schutz gegen Betrugsmaschen mit gefälschten Kontodaten.

### Abgrenzung
**Funktionstrennung** verteilt unvereinbare Aufgaben dauerhaft auf verschiedene Personen (wer bestellt, zahlt nicht); das Vier-Augen-Prinzip verlangt für einen einzelnen Vorgang eine zweite Prüfung.

### Prüfungsfalle
Das Vier-Augen-Prinzip für jede Routineeingabe fordern – es gehört an kritische Stellen, sonst wird es zur Formalie.

### Merksatz
Was teuer schiefgehen kann, sieht ein Zweiter.

Siehe auch: Funktionstrennung · Data Governance · Data Steward · Konstruktive Qualitätssicherung
Mehr: Deep Dive 9, 5.2

## View
<!-- id: view · quellen: Karte DD1, DD1 3.4 · stand: 2026-10 -->

Gespeicherte Abfrage, die wie eine virtuelle Tabelle genutzt wird – sie speichert die Abfrage, nicht die Daten.

### Erklärung
Eine View (Sicht) wird bei jedem Zugriff neu ausgewertet und ist damit immer aktuell. Zwecke: komplexe Joins kapseln, Kennzahlen einheitlich definieren und den Zugriff auf bestimmte Spalten oder Zeilen beschränken (Datenminimierung, Rechte per GRANT nur auf die View). Eine **Materialized View** speichert dagegen das Ergebnis – schneller, muss aber aufgefrischt werden.

### Beispiel
```sql
CREATE VIEW v_kundenumsatz AS
SELECT k.kunden_id, k.name, SUM(bp.menge * p.preis) AS umsatz
FROM kunde k
JOIN bestellung b       ON k.kunden_id = b.kunden_id
JOIN bestellposition bp ON b.bestell_id = bp.bestell_id
JOIN produkt p          ON bp.produkt_id = p.produkt_id
GROUP BY k.kunden_id, k.name;
```
`SELECT name, umsatz FROM v_kundenumsatz WHERE umsatz > 900` liefert Huber GmbH (1.471,80 €) und Schmidt AG (945,00 €).

### Abgrenzung
| | View | Materialized View | Tabelle |
|---|---|---|---|
| speichert | Abfrage | Ergebnis | Daten |
| aktuell | immer | nach Refresh | – |

### Prüfungsfalle
Annehmen, eine View beschleunige Abfragen von selbst – sie spart Schreibarbeit, nicht Rechenzeit.

### Merksatz
Die View ist ein gespeicherter Blickwinkel, keine Kopie.

Siehe auch: Materialized View · INNER JOIN · Index · Least Privilege
Mehr: Deep Dive 1, 3.4

## Vollextraktion
<!-- id: vollextraktion · quellen: Karte DD8, DD8 3.1 · stand: 2026-10 -->

ETL-Extraktionsvariante, bei der bei jedem Lauf alle Daten aus dem Quellsystem gelesen werden – einfach, aber langsam und belastend.

### Erklärung
Die Vollextraktion braucht keine Änderungskennzeichen und ist robust: Gelöschte Sätze in der Quelle fallen beim Vergleich auf. Mit wachsendem Datenbestand dauern die Läufe aber immer länger und belasten das Quellsystem. Sie eignet sich für kleine Tabellen (Stammdaten wie Filialen) und für die Erstbefüllung eines Data Warehouse; große Bewegungsdaten werden danach per **Deltaextraktion** geladen.

### Beispiel
Die Filialtabelle (40 Zeilen) wird jede Nacht komplett gelesen; die Kassenbons (Millionen Zeilen) nur ab dem letzten Ladezeitstempel.

### Abgrenzung
| | Vollextraktion | Deltaextraktion |
|---|---|---|
| liest | alles | nur Änderungen seit letztem Lauf |
| Voraussetzung | keine | Zeitstempel/Änderungskennzeichen |
| Dauer | lang, wachsend | kurz |

### Prüfungsfalle
Vollextraktion mit Vollsicherung verwechseln – die eine lädt ins DWH, die andere sichert Daten gegen Verlust.

### Merksatz
Voll = alles jedes Mal, Delta = nur das Neue.

Siehe auch: Deltaextraktion · ETL · Data Warehouse
Mehr: Deep Dive 8, 3.1

## Vollsicherung
<!-- id: vollsicherung · quellen: Karte DD10, DD10 4.4 · stand: 2026-10 -->

Datensicherung aller ausgewählten Daten zu einem Zeitpunkt – lange Laufzeit und viel Speicher, aber Wiederherstellung aus einem einzigen Medium.

### Erklärung
Die Vollsicherung ist die Basis jeder Sicherungsstrategie; differenzielle und inkrementelle Sicherungen bauen auf ihr auf. Üblich ist z. B. sonntags voll, werktags differenziell oder inkrementell. Sicherungen werden nach dem Generationenprinzip aufbewahrt und nach der 3-2-1-Regel verteilt, mindestens eine Kopie offline oder unveränderbar.

### Beispiel
Vollsicherung Sonntag 800 GB, täglich 40 GB Änderungen, Ausfall Donnerstagmorgen:
inkrementell $800 + 3 \cdot 40 = 920$ GB, Rücksicherung aus 4 Medien;
differenziell $800 + 40 + 80 + 120 = 1.040$ GB, Rücksicherung aus 2 Medien.

### Abgrenzung
| Verfahren | sichert | Rücksicherung |
|---|---|---|
| voll | alles | 1 Medium |
| differenziell | seit letzter Vollsicherung | 2 Medien |
| inkrementell | seit letzter Sicherung | Voll + alle Inkremente |

### Prüfungsfalle
Eine Vollsicherung auf demselben System oder NAS im selben Netz lagern – Ransomware verschlüsselt sie mit.

### Merksatz
Voll dauert lang, stellt aber am schnellsten wieder her.

Siehe auch: Differenzielle Sicherung · Inkrementelle Sicherung · 3-2-1-Regel · Generationenprinzip (Großvater-Vater-Sohn)
Mehr: Deep Dive 10, 4.4

## Vollständigkeit
<!-- id: vollstandigkeit · quellen: Karte DD9, DD9 Teil 1 · stand: 2026-10 -->

Datenqualitätsdimension: Sind alle erforderlichen Werte und Datensätze vorhanden?

### Erklärung
Man unterscheidet fehlende Werte in Feldern (NULL, Leerstring, Platzhalter wie „unbekannt“) und fehlende Datensätze (eine Filiale hat nicht geliefert). Gemessen wird der Anteil gefüllter Pflichtwerte je Feld, bei Datensätzen der Abgleich mit Abstimmsummen der Quelle. Prävention: Pflichtfelder (NOT NULL), Ladeprotokolle; Behandlung fehlender Werte: löschen, ersetzen oder kennzeichnen – mit Dokumentation.

### Beispiel
```sql
SELECT COUNT(email) * 100.0 / COUNT(*) AS quote_email
FROM kunde;
```
1.000 Kunden, 300 ohne E-Mail: Vollständigkeit $700 / 1.000 = 70\ \%$. `COUNT(email)` zählt nur Nicht-NULL-Werte.

### Abgrenzung
Vollständigkeit fragt „vorhanden?“, Korrektheit „stimmt es?“, Gültigkeit „richtiges Format?“. Ein ausgefülltes Feld mit „xxx“ ist vollständig, aber nicht korrekt.

### Prüfungsfalle
Leerstrings und Platzhalter übersehen – `COUNT(spalte)` zählt sie als vorhanden, obwohl sie fachlich fehlen.

### Merksatz
Gefüllt ist nicht gleich richtig – aber ohne Wert gibt es gar nichts zu prüfen.

Siehe auch: Korrektheit · Konsistenz · Aktualität · Pflichtfelder · NOT NULL
Mehr: Deep Dive 9, Teil 1

## Volume
<!-- id: volume · quellen: Karte DD8, DD8 5.2 · stand: 2026-10 -->

Big-Data-V: die große Datenmenge, die mit einem einzelnen herkömmlichen System nicht mehr wirtschaftlich gespeichert und verarbeitet werden kann.

### Erklärung
Volume ist das bekannteste der ursprünglichen drei V (Volume, Velocity, Variety). Es führt zu verteilter Speicherung und Verarbeitung (HDFS, MapReduce, Spark), also horizontaler Skalierung, sowie zu Partitionierung und spaltenorientierter Speicherung.

### Beispiel
Millionen Kassenbons und Klickdaten des Möbelhauses pro Jahr – eine Auswertung über fünf Jahre sprengt den bisherigen Reporting-Server.

### Prüfungsfalle
Big Data allein über Volume definieren – Geschwindigkeit, Vielfalt, Verlässlichkeit und Nutzen gehören dazu.

### Merksatz
Volume = so viel, dass ein Server nicht mehr reicht.

Siehe auch: Velocity · Variety · Veracity · Value · Horizontale Skalierung
Mehr: Deep Dive 8, 5.2

## Vom Minimum zur NULL-Fähigkeit
<!-- id: vom-minimum-zur-null-fahigkeit · quellen: DD2 1.5 · stand: 2026-10 -->

Transformationsregel: Die Min-Angabe in der Min-Max-Notation entscheidet, ob ein Fremdschlüssel NOT NULL sein muss oder NULL sein darf.

### Erklärung
In der Min-Max-Notation steht an jeder Entität, wie oft sie mindestens und höchstens an der Beziehung teilnimmt. Steht beim Typ mit dem Fremdschlüssel (n-Seite) ein Minimum von 1 – also (1,1) –, muss jeder Datensatz einen Partner haben: Fremdschlüssel **NOT NULL**. Bei (0,1) ist die Teilnahme optional: Fremdschlüssel darf **NULL** sein. So wird die Kardinalität direkt als Constraint umgesetzt und Datenqualität im Schema gesichert.

### Beispiel
KUNDE (0,n) — (1,1) BESTELLUNG → bestellung.kunden_id NOT NULL, jede Bestellung braucht einen Kunden.
MITARBEITER (0,n) — (0,1) MITARBEITER (Vorgesetzter) → vorgesetzter_id darf NULL sein (die Geschäftsführerin hat keinen Vorgesetzten).

```sql
kunden_id INTEGER NOT NULL REFERENCES kunde(kunden_id)
```

### Abgrenzung
Das Maximum entscheidet über die Tabellenstruktur (1:n → Fremdschlüssel, m:n → Beziehungstabelle); das Minimum über die NULL-Fähigkeit.

### Prüfungsfalle
Die Min-Max-Angaben wie die Chen-Notation „gegenüber“ lesen – in Min-Max stehen sie an der Entität, die sie beschreiben.

### Merksatz
Minimum 1 → NOT NULL, Minimum 0 → NULL erlaubt.

Siehe auch: Min-Max-Notation · Fremdschlüssel · NOT NULL · Kardinalität · Referenzielle Integrität
Mehr: Deep Dive 2, 1.5

## Vorwärtsrechnung
<!-- id: vorwartsrechnung · quellen: Karte DD12, DD12 3.2 · stand: 2026-10 -->

Erster Rechenschritt der Netzplantechnik: Vom Projektstart (0) aus werden für jeden Vorgang FAZ und FEZ bestimmt; das größte FEZ am Ende ist die Projektdauer.

### Erklärung
$\text{FEZ} = \text{FAZ} + \text{Dauer}$. Der FAZ eines Vorgangs ist das **größte** FEZ aller direkten Vorgänger, denn er kann erst beginnen, wenn alle fertig sind. Danach folgt die Rückwärtsrechnung (SEZ, SAZ mit dem Minimum), aus beiden ergeben sich Puffer und kritischer Pfad.

### Beispiel
A (5 Tage), B (4, nach A), C (6, nach A), D (8, nach B und C):
A 0–5, B 5–9, C 5–11, D: FAZ = max(9; 11) = 11, FEZ = $11 + 8 = 19$ → Projektdauer 19 Tage.

### Abgrenzung
| | Vorwärtsrechnung | Rückwärtsrechnung |
|---|---|---|
| Richtung | vom Start | vom Ende |
| Werte | FAZ, FEZ | SEZ, SAZ |
| Regel bei mehreren | Maximum der Vorgänger-FEZ | Minimum der Nachfolger-SAZ |

### Prüfungsfalle
Bei mehreren Vorgängern das kleinste FEZ nehmen – dann startet ein Vorgang, bevor alle Voraussetzungen erfüllt sind.

### Merksatz
Vorwärts das Maximum, rückwärts das Minimum.

Siehe auch: Rückwärtsrechnung · FAZ · FEZ · Kritischer Pfad · Netzplan
Mehr: Deep Dive 12, 3.2 · Deep Dive 17, 5.1

## Vorzeitiges Bestehen
<!-- id: vorzeitiges-bestehen · quellen: DD13 1.4 · stand: 2026-10 -->

Besteht ein Auszubildender die Abschlussprüfung vor Ablauf der Ausbildungszeit, endet das Ausbildungsverhältnis mit der Bekanntgabe des Ergebnisses durch den Prüfungsausschuss (§ 21 Abs. 2 BBiG).

### Erklärung
Maßgeblich ist nicht das vertragliche Ende, sondern der Tag, an dem der Prüfungsausschuss das Bestehen mitteilt – meist am Ende der mündlichen Prüfung. Ab dem Folgetag gibt es keinen Ausbildungsanspruch mehr. Arbeitet der Absolvent danach ohne neue Vereinbarung weiter, entsteht ein **unbefristetes Arbeitsverhältnis** (§ 24 BBiG). Vorzeitig prüfen kann man über eine Verkürzung (§ 8) oder eine vorzeitige Zulassung (§ 45).

### Beispiel
Lea besteht am 25.11.2026 die mündliche Prüfung, ihr Vertrag liefe bis 31.01.2027. Die Ausbildung endet am 25.11.2026. Arbeitet sie am 26.11. ohne Absprache weiter, ist sie unbefristet angestellt.

### Abgrenzung
Bei **Nichtbestehen** verlängert sich die Ausbildung auf Verlangen des Azubis bis zur nächsten Wiederholungsprüfung, höchstens um ein Jahr (§ 21 Abs. 3).

### Prüfungsfalle
Das Ausbildungsende auf das Vertragsende oder auf die Zeugnisübergabe legen.

### Merksatz
Bestanden ist beendet – mit der Bekanntgabe.

Siehe auch: Verkürzung · Prüfungsausschuss · BBiG · Probezeit
Mehr: Deep Dive 13, 1.4

## VPN
<!-- id: vpn · quellen: Karte DD10, DD10 5.3 · stand: 2026-10 -->

Virtual Private Network: verschlüsselter Tunnel durch ein unsicheres Netz wie das Internet, z. B. für mobiles Arbeiten oder die Anbindung von Filialen.

### Erklärung
Die Datenpakete werden verschlüsselt und in andere Pakete eingepackt (Tunneling), sodass Dritte sie weder lesen noch unbemerkt verändern können. **Site-to-Site-VPN** verbindet Standortnetze dauerhaft, **Client-to-Site** (Remote Access) verbindet einzelne Geräte, z. B. Laptops im Homeoffice, mit dem Firmennetz. Gängige Protokolle sind IPsec, WireGuard und TLS/SSL-basierte VPNs. Ein VPN sichert vor allem Vertraulichkeit und Integrität auf dem Übertragungsweg.

### Beispiel
Die Filialen des Möbelhauses Nordholz übertragen ihre Kassendaten nachts per Site-to-Site-VPN an das zentrale Data Warehouse; Lea greift im Homeoffice per Client-VPN auf den Reporting-Server zu.

### Abgrenzung
Die Firewall filtert, welcher Verkehr erlaubt ist; das VPN schützt den erlaubten Verkehr unterwegs. HTTPS verschlüsselt eine einzelne Anwendungsverbindung, ein VPN den gesamten Verkehr zwischen Endpunkten.

### Prüfungsfalle
Ein VPN für einen Rundumschutz halten – ein infizierter Laptop bringt Schadsoftware durch den Tunnel direkt ins Firmennetz; Zugriffsrechte und Virenschutz bleiben nötig.

### Merksatz
VPN = privater, verschlüsselter Tunnel durch das öffentliche Netz.

Siehe auch: Firewall · Vertraulichkeit · Integrität · Schutzziele
Mehr: Deep Dive 10, 5.3

## Ausgelassen
- Vereinheitlichen – Schritt ETL-Transformation
- Vergleich von Kategorien – Zeile Diagrammwahl
- Vergleichen – Schritt Dublettensuche
- Vergleichsmaßstab mitliefern – Gestaltungsregel Dashboard
- Verneinungen markieren – Prüfungstaktik-Tipp
- Verteilte Quellen – Aufzählungspunkt OLTP
- Verteilung eines Merkmals – Zeile Diagrammwahl
- Visualisierung – Abschnittstitel
- Voraussetzung – kein Fachbegriff
