<!-- Begriffsseiten O · Stand 2026-10 -->
## O-Notation
<!-- id: o-notation · quellen: Karte DD11, DD11 B7 · stand: 2026-11 -->

Angabe, wie der Aufwand eines Algorithmus mit der Datenmenge n wächst, z. B. O(n), O(n log n), O(n²); konstante Faktoren fallen weg.

### Erklärung
Die O-Notation beschreibt die Größenordnung des Wachstums und macht Verfahren unabhängig von Rechner und Programmiersprache vergleichbar. Typische Klassen, von günstig nach teuer: O(1) konstant, O(log n) logarithmisch (binäre Suche), O(n) linear (lineare Suche), O(n log n) (Merge Sort, Quicksort im Mittel), O(n²) quadratisch (Bubble, Selection, Insertion Sort).

**Zwei verschiedene Fragen** werden oft vermischt:
- **Schranke (Notation):** O(f) ist eine **obere** Schranke („wächst höchstens so schnell“), Ω(f) eine **untere** („mindestens so schnell“), Θ(f) die **enge** Schranke (oben und unten, also exakt die Größenordnung).
- **Fall:** bester, mittlerer und schlechtester Fall beschreiben, für welche Eingaben man rechnet. Zu jedem Fall kann man eine Schranke angeben. Im AP2-Alltag meint „O(…)“ ohne Zusatz meist die obere Schranke im schlechtesten Fall.

Neben der Laufzeit zählt der **Speicherbedarf** (Speicherkomplexität): Merge Sort braucht zusätzlich O(n) Speicher, Bubble, Selection und Insertion Sort nur O(1) (sie sortieren „am Ort“). Bei der **amortisierten** Laufzeit rechnet man den Durchschnitt über viele Operationen: Das Anhängen an ein dynamisches Array kostet gelegentlich O(n) (Vergrößern und Umkopieren), im Mittel über viele Anhänge aber O(1) pro Operation.

### Beispiel
Bei n = 1.000 Datensätzen braucht ein O(n²)-Verfahren rund 1.000.000 Vergleiche, ein O(n log n)-Verfahren rund 1.000 · 10 = 10.000. Die binäre Suche findet einen Wert unter 1.000.000 sortierten Sätzen mit höchstens 20 Vergleichen, weil $2^{20} = 1.048.576$.

### Abgrenzung
| Verfahren | bester Fall | Mittel | schlechtester Fall |
|---|---|---|---|
| Lineare Suche | O(1) | O(n) | O(n) |
| Binäre Suche | O(1) | O(log n) | O(log n) |
| Bubble Sort | O(n) | O(n²) | O(n²) |
| Quicksort | O(n log n) | O(n log n) | O(n²) |

### Prüfungsfalle
Konstanten mitschreiben („O(2n)“), den besten Fall als typischen Aufwand angeben oder O mit „schlechtester Fall“ gleichsetzen – O ist die Schranke, der Fall eine eigene Angabe. O(n) heißt auch nicht „genau n Schritte“, sondern „wächst höchstens linear“.

### Merksatz
O zählt nicht Sekunden, sondern wie schnell die Arbeit mit n wächst.

Siehe auch: Aufwand (Komplexität) · Binäre Suche · Lineare Suche · Quicksort · Merge Sort
Mehr: Deep Dive 11, B7

## OAuth 2.0
<!-- id: oauth-2-0 · quellen: Karte DD15, DD15 3.3 · stand: 2026-11 -->

Autorisierungsrahmen (RFC 6749): Ein Autorisierungsserver stellt einer Anwendung ein zeitlich begrenztes Access Token mit festgelegten Rechten aus, ohne dass sie das Passwort erhält.

### Erklärung
Der Nutzer meldet sich beim Autorisierungsserver an und stimmt zu, welche Rechte (**Scopes**) die Anwendung bekommt. Die Anwendung erhält ein **Access Token**, das sie bei jedem API-Aufruf im Header mitschickt (`Authorization: Bearer …`). So lässt sich Zugriff gezielt delegieren und jederzeit entziehen, ohne das Passwort zu ändern. Scopes sollten so klein wie möglich sein (minimale Rechte).

**Zwei wichtige Abläufe (Grant Types):**
- **Authorization Code mit PKCE:** Standard, wenn ein Nutzer beteiligt ist (Web-App, mobile App, Single-Page-App). Die App erhält erst einen kurzlebigen Code und tauscht ihn gegen das Token. **PKCE** (Proof Key for Code Exchange) bindet den Tausch an ein Geheimnis, das die App vorher erzeugt hat – ein abgefangener Code ist dadurch wertlos.
- **Client Credentials:** Maschine zu Maschine ohne Nutzer, die Anwendung authentifiziert sich selbst (z. B. ein nächtlicher Importjob). Die älteren Abläufe Implicit und Password gelten als veraltet.

**Tokens:** Das **Access Token** ist kurzlebig und für die API bestimmt. Ein **Refresh Token** holt ein neues Access Token, ohne dass sich der Nutzer erneut anmelden muss; es ist langlebiger und besonders schützenswert. Bei der **Refresh-Token-Rotation** wird mit jedem Einsatz ein neues Refresh Token ausgegeben und das alte ungültig – wird ein altes erneut verwendet, deutet das auf Diebstahl hin und die Kette wird gesperrt.

### Beispiel
Ein Dashboard-Tool des Möbelhauses darf über OAuth 2.0 nur lesend auf die Kalender der Servicetechniker zugreifen (Scope „calendar.read“). Das Passwort der Techniker sieht das Tool nie. Der nächtliche Importjob dagegen nutzt Client Credentials, weil dabei kein Mensch zustimmen kann.

### Abgrenzung
| Verfahren | Zweck |
|---|---|
| OAuth 2.0 | Autorisierung: was darf die Anwendung? Liefert ein Access Token für die API |
| OpenID Connect (OIDC) | Aufsatz für Authentifizierung: wer ist der Nutzer? Liefert zusätzlich ein **ID-Token** (ein JWT mit Identitätsangaben) für die Anwendung |
| API-Schlüssel | identifiziert nur die Anwendung |
| JWT | Tokenformat, oft als Access Token oder ID-Token verwendet |

Das **ID-Token** ist für die Anwendung bestimmt (wer hat sich angemeldet?), das **Access Token** für die API (was darf aufgerufen werden?).

### Prüfungsfalle
OAuth 2.0 als Anmeldeverfahren bezeichnen – es regelt Berechtigungen; die Anmeldung ergänzt OpenID Connect. Ebenso falsch: ein ID-Token als Zugangsschlüssel für eine API verwenden.

### Merksatz
OAuth gibt der Anwendung einen befristeten Schlüssel, nicht das Passwort.

Siehe auch: API-Schlüssel · JWT · Autorisierung · Authentifizierung · REST
Mehr: Deep Dive 15, 3.3

## OCR (Texterkennung)
<!-- id: ocr · quellen: Karte DD19, DD19 3.1, DD18 Block C · stand: 2026-11 -->

Optical Character Recognition: Verfahren, das Zeichen auf einem Bild oder Scan (z. B. Etikett, Rechnung, Kennzeichen) erkennt und in maschinenlesbaren Text umwandelt.

Auch: Texterkennung, Optische Zeichenerkennung

### Erklärung
OCR ist nur ein Schritt im Workflow einer automatischen Erfassung:

| Schritt | Aufgabe |
|---|---|
| 1. Bildaufnahme | Kamera oder Scanner erzeugt ein digitales Bild |
| 2. Vorverarbeitung | Kontrast und Helligkeit verbessern, Rauschen entfernen, Bild entzerren |
| 3. Lokalisierung | Region mit dem Text finden und ausschneiden (Cropping) |
| 4. **Texterkennung (OCR)** | Zeichen im Ausschnitt in Text umwandeln |
| 5. Validierung | Format prüfen (regulärer Ausdruck, Prüfziffer), Abgleich mit der Datenbank |
| 6. Entscheidung | Treffer → Vorgang freigeben; sonst Fehlermeldung oder manuelle Prüfung |

Moderne OCR nutzt neuronale Netze. Sie liefert zu jedem Zeichen oft einen **Vertrauenswert**; liegt er unter einer Schwelle, wird manuell geprüft. Fehlerquellen sind schlechte Auflösung, Schräglage, Verschmutzung, Spiegelungen und ähnlich aussehende Zeichen (0/O, 1/I/l).

### Beispiel
Das Palettenetikett im Wareneingang hat das Format „LS-JJJJ-NNNNNN“, z. B. LS-2026-004711. Die OCR liest „LS-2O26-004711“ (Buchstabe O statt Null). Die **Formatprüfung** mit dem Muster „LS-, vier Ziffern, Bindestrich, sechs Ziffern“ weist den Wert ab, der Vorgang geht zur manuellen Prüfung. Ohne Validierung wäre die falsche Nummer in der Datenbank gelandet.

### Abgrenzung
| Verfahren | liest | Besonderheit |
|---|---|---|
| **OCR** | Klartext (Buchstaben, Ziffern) | fehleranfälliger, braucht Validierung |
| Barcode / QR-Code | maschinenlesbares Muster | sehr robust, oft mit Prüfziffer |
| Objekterkennung | Objekte im Bild (Palette, Person) | liefert Bounding Boxes, aber keinen Text |

### Prüfungsfalle
Den OCR-Ausgabewert ungeprüft übernehmen: Ein Workflow ohne **Validierung** (Format, Abgleich mit der Datenbank) verliert Punkte. Außerdem: OCR erkennt den Text, **lokalisieren** muss man ihn vorher.

### Merksatz
OCR liest, die Validierung entscheidet, ob man dem Gelesenen traut.

Siehe auch: Plausibilitätsprüfung · Formatprüfung · Datenverifizierung · Neuronale Netze
Mehr: Deep Dive 19, 3.1

## OHG
<!-- id: ohg · quellen: Karte DD14, DD14 3.2 · stand: 2026-10 -->

Offene Handelsgesellschaft: Personengesellschaft zum Betrieb eines Handelsgewerbes, deren Gesellschafter alle unbeschränkt, persönlich und gesamtschuldnerisch haften.

### Erklärung
Die OHG (§§ 105 ff. HGB) braucht kein Mindestkapital und wird in Abteilung A des Handelsregisters eingetragen. Nach § 126 HGB haften die Gesellschafter den Gläubigern als Gesamtschuldner persönlich – ein Gläubiger kann die ganze Forderung von jedem einzelnen verlangen; eine abweichende Vereinbarung gilt Dritten gegenüber nicht. Geschäftsführung und Vertretung stehen grundsätzlich allen Gesellschaftern zu. Seit dem MoPeG (2024) steht die OHG auch Freiberuflern offen, soweit ihr Berufsrecht es erlaubt.

### Beispiel
Zwei Händler betreiben ein Möbelgeschäft als „Kaya & Lenz OHG“. Bleibt eine Lieferantenrechnung über 30.000 € offen, kann der Lieferant den vollen Betrag von Kaya allein fordern; Kaya holt sich den Anteil intern von Lenz zurück.

### Abgrenzung
| Rechtsform | Haftung |
|---|---|
| GbR | alle unbeschränkt, aber kein Handelsgewerbe nötig |
| OHG | alle unbeschränkt und gesamtschuldnerisch |
| KG | Komplementär unbeschränkt, Kommanditist bis zur Einlage |
| GmbH | nur Gesellschaftsvermögen |

### Prüfungsfalle
Annehmen, jeder Gesellschafter hafte nur mit seinem Anteil – er haftet mit seinem ganzen Privatvermögen für alles.

### Merksatz
In der OHG steht jeder für alle gerade.

Siehe auch: KG · GbR · GmbH · Handelsregister · Einzelunternehmen
Mehr: Deep Dive 14, 3.2

## Ökonomisches Prinzip
<!-- id: okonomisches-prinzip · quellen: Karte DD14, DD14 4.1 · stand: 2026-10 -->

Grundsatz des wirtschaftlichen Handelns als Maximalprinzip (mit gegebenen Mitteln größtmöglicher Erfolg) oder Minimalprinzip (gegebenes Ziel mit geringstmöglichem Mitteleinsatz).

### Erklärung
Weil Mittel knapp sind, muss jede Entscheidung Aufwand und Ertrag ins Verhältnis setzen. Beim **Maximalprinzip** ist der Input fest, der Output wird maximiert; beim **Minimalprinzip** ist der Output fest, der Input wird minimiert. Beides gleichzeitig zu fordern ist unlogisch.

### Beispiel
- Maximalprinzip: Mit einem Budget von 20.000 € soll ein Dashboard mit möglichst vielen Auswertungen entstehen.
- Minimalprinzip: Ein festgelegter Monatsbericht soll mit möglichst wenigen Arbeitsstunden erstellt werden.

### Prüfungsfalle
„Mit minimalem Aufwand maximalen Erfolg erzielen“ als ökonomisches Prinzip nennen – diese Kombination ist nicht erfüllbar und gilt als falsch.

### Merksatz
Entweder die Mittel stehen fest oder das Ziel – nie beides offen.

Siehe auch: Bedürfnis · Wirtschaftlichkeitsbetrachtung · Wirtschaftskreislauf
Mehr: Deep Dive 14, 4.1

## OLAP
<!-- id: olap · quellen: Karte DD8, DD8 Teil 1, DD8 4.5 · stand: 2026-10 -->

Online Analytical Processing: analytische Auswertung großer, historisierter Datenmengen über mehrere Dimensionen zur Entscheidungsunterstützung.

### Erklärung
OLAP-Systeme sind auf wenige, komplexe Leseabfragen optimiert: Daten liegen denormalisiert (Star- oder Snowflake-Schema), oft verdichtet und über Jahre historisiert vor. Typische Operationen auf dem OLAP-Würfel sind Drill-down, Roll-up, Slice, Dice und Pivot. Technisch wird OLAP relational (ROLAP), multidimensional vorberechnet (MOLAP) oder gemischt (HOLAP) umgesetzt.

### Beispiel
Das Controlling des Möbelhauses wertet den Umsatz je Region und Quartal der letzten drei Jahre aus und bohrt bei einem Einbruch in Region Nord bis auf Monat und Filiale herunter.

### Abgrenzung
| | OLTP | OLAP |
|---|---|---|
| Zweck | Tagesgeschäft | Entscheidungen |
| Zugriffe | viele kurze Schreib-/Lesevorgänge | wenige komplexe Leseabfragen |
| Modell | normalisiert | denormalisiert |
| Daten | aktuell | historisiert |

### Prüfungsfalle
Auswertungen direkt auf dem OLTP-System empfehlen – das bremst das Tagesgeschäft, und die Historie fehlt.

### Merksatz
OLTP führt das Geschäft, OLAP versteht es.

Siehe auch: OLTP · OLAP-Würfel · Data Warehouse · Star-Schema · Drill-down · OLTP und OLAP im Vergleich
Mehr: Deep Dive 8, Teil 1 · Deep Dive 8, 4.5

## OLAP-Würfel
<!-- id: olap-wurfel · quellen: Karte DD8, DD8 4.5 · stand: 2026-10 -->

Mehrdimensionale Sicht auf Kennzahlen, z. B. Umsatz nach Produkt, Region und Zeit, die sich drehen, schneiden und verdichten lässt.

### Erklärung
Jede Achse des Würfels ist eine **Dimension**, jede Zelle enthält die Kennzahl (Fakt) für eine Kombination der Dimensionswerte. Der Würfel ist ein Denkmodell und kann mehr als drei Dimensionen haben (dann „Hypercube“). Operationen:

| Operation | Wirkung |
|---|---|
| Drill-down / Roll-up | feinere bzw. gröbere Stufe (Jahr ↔ Monat) |
| Slice | eine Dimension auf einen Wert festlegen |
| Dice | mehrere Dimensionen auf Bereiche einschränken |
| Pivot | Achsen vertauschen |

### Beispiel
Würfel „Umsatz“ mit Produktkategorie × Region × Quartal. Slice: nur Quartal 2/2026. Dice: Kategorie Möbel und Region Nord und 1. Halbjahr.

### Abgrenzung
Im Data Warehouse wird der Würfel meist relational als Star-Schema gespeichert: Die Faktentabelle liefert die Zellen, die Dimensionstabellen die Achsen.

### Prüfungsfalle
Slice und Dice verwechseln: Slice schneidet eine Scheibe (ein Wert in einer Dimension), Dice einen Teilwürfel.

### Merksatz
Würfel drehen, schneiden, verdichten – die Zahlen bleiben dieselben, nur die Sicht ändert sich.

Siehe auch: OLAP · Slice · Dice · Drill-down · Faktentabelle
Mehr: Deep Dive 8, 4.5

## OLTP
<!-- id: oltp · quellen: Karte DD8, DD8 Teil 1 · stand: 2026-10 -->

Online Transaction Processing: operative Systeme für das Tagesgeschäft mit vielen kleinen Schreib- und Lesevorgängen auf aktuellem, normalisiertem Datenbestand.

### Erklärung
OLTP-Systeme wie Warenwirtschaft, CRM oder Webshop sind auf schnelle, konsistente Transaktionen (ACID) optimiert. Die Daten liegen in der 3. Normalform, damit Änderungen nur an einer Stelle nötig sind. Historie wird meist überschrieben. Für Auswertungen werden die Daten per ETL in ein Data Warehouse (OLAP) übertragen.

### Beispiel
Eine Kundin bestellt im Webshop einen Bürostuhl: Bestellung und Bestellposition werden angelegt, der Lagerbestand sinkt – eine Transaktion von Millisekunden.

### Abgrenzung
Gründe gegen Auswertungen direkt im OLTP: Lastproblem (komplexe Abfragen bremsen das Tagesgeschäft), fehlende Historie (Änderungen werden überschrieben), verteilte Quellen (Daten aus mehreren Systemen müssen zusammengeführt werden).

### Prüfungsfalle
Ein normalisiertes Datenmodell im DWH als Fehler und im OLTP als Pflicht darstellen, ohne den Zweck zu nennen – beides ist im jeweiligen Kontext richtig begründet.

### Merksatz
OLTP: viele kleine Transaktionen, immer der aktuelle Stand.

Siehe auch: OLAP · ACID · ETL · 3. Normalform · Data Warehouse · OLTP und OLAP im Vergleich
Mehr: Deep Dive 8, Teil 1

## OLTP und OLAP im Vergleich
<!-- id: oltp-und-olap-im-vergleich · quellen: DD8 Teil 1, DD8 4.5 · stand: 2026-11 -->

OLTP-Systeme führen das Tagesgeschäft mit vielen kleinen Schreib- und Lesevorgängen, OLAP-Systeme werten große, historische Datenmengen mit wenigen umfangreichen Leseabfragen aus. Die Entscheidung folgt der Frage, ob Daten **erfasst und geändert** oder **ausgewertet** werden sollen.

Auch: OLTP vs. OLAP

### Erklärung
| Kriterium | OLTP | OLAP |
|---|---|---|
| Zweck | Tagesgeschäft abwickeln | Entscheidungen unterstützen |
| Typischer Vorgang | Bestellung anlegen, Bestand buchen | Umsatz je Region und Quartal vergleichen |
| Zugriff | sehr viele kurze Lese- und Schreibzugriffe auf einzelne Datensätze | wenige, aufwendige Leseabfragen über viele Millionen Zeilen |
| Schreiben | laufend (INSERT, UPDATE, DELETE) | nur durch den Ladevorgang (ETL), sonst lesend |
| Datenmodell | normalisiert (3. Normalform) | denormalisiert (Star- oder Snowflake-Schema) |
| Datenbestand | aktuell, Änderungen überschreiben | historisiert, Änderungen bleiben nachvollziehbar |
| Antwortzeit | Millisekunden | Sekunden bis Minuten sind tragbar |
| Konsistenz | Transaktionen mit ACID | geprüfter, zum Ladezeitpunkt konsistenter Bestand |
| Nutzer | Sachbearbeiter, Kunden, Webshop | Controlling, Management, Analysten |
| Beispiel | Warenwirtschaft, Webshop, CRM | Data Warehouse mit BI-Dashboard |

**Wann nehme ich was?** Soll ein Vorgang **erfasst oder geändert** werden und muss sofort stimmen (Kauf, Buchung, Stammdatenänderung)? → OLTP. Soll über viele Vorgänge, Zeiträume und Dimensionen **ausgewertet** werden? → OLAP, also nicht im Produktivsystem, sondern in einem Data Warehouse, das per ETL gespeist wird. Die beiden Systeme ersetzen sich nicht: Das OLTP-System liefert die Daten, das OLAP-System macht sie auswertbar.

### Beispiel
Möbelhaus Nordholz, Übungsdatenbank. **OLTP-Vorgang:** Weber e.K. bestellt am 2026-07-02 einen Bürostuhl und zwei Schreibtischlampen. Die Anwendung schreibt in einer Transaktion genau 3 Zeilen:

```sql
BEGIN TRANSACTION;
INSERT INTO bestellung (bestell_id, kunden_id, bestelldatum) VALUES (106, 4, '2026-07-02');
INSERT INTO bestellposition (bestell_id, produkt_id, menge) VALUES (106, 10, 1), (106, 14, 2);
COMMIT;
```

Eine Bestellung, zwei Positionen: 1 + 2 = 3 geschriebene Zeilen, Antwort in Millisekunden. **OLAP-Abfrage** (Stand vor dieser Bestellung): Umsatz je Quartal und Warengruppe, dafür müssen alle 8 vorhandenen Bestellpositionen gelesen und über `bestellung` und `produkt` verknüpft werden:

```sql
SELECT CASE WHEN CAST(STRFTIME('%m', b.bestelldatum) AS INTEGER) <= 3 THEN 'Q1' ELSE 'Q2' END AS quartal,
       p.kategorie, SUM(bp.menge * p.preis) AS umsatz
FROM bestellposition bp
JOIN bestellung b ON b.bestell_id = bp.bestell_id
JOIN produkt p ON p.produkt_id = bp.produkt_id
GROUP BY quartal, p.kategorie
ORDER BY quartal, p.kategorie;
```

| Quartal | Warengruppe | Umsatz in € |
|---|---|---|
| Q1 | Elektronik | 1.839,00 |
| Q1 | Möbel | 897,00 |
| Q1 | Zubehör | 119,70 |
| Q2 | Möbel | 249,00 |
| Q2 | Zubehör | 79,80 |

Probe: 1.839,00 + 897,00 + 119,70 + 249,00 + 79,80 = 3.184,50 € – die Summe aller 8 Positionen. Im echten Betrieb mit rund 180.000 Positionen pro Tag liest dieselbe Auswertung für ein Jahr 180.000 · 365 = 65.700.000 Zeilen. Der OLTP-Vorgang bleibt bei 3 Zeilen; läuft die Auswertung im selben System, bremst sie die Kasse, und die frühere Historie fehlt, wenn Daten überschrieben wurden.

### Abgrenzung
OLAP ist kein „schnelleres OLTP“, sondern ein anderes Einsatzziel mit anderem Datenmodell. Ein normalisiertes Modell ist im OLTP richtig (jede Änderung nur an einer Stelle) und im Data Warehouse bewusst aufgegeben (weniger Joins). Beides ist im jeweiligen Kontext begründet, kein Widerspruch. Nicht verwechseln: OLAP beschreibt die Art der Nutzung, das **Data Warehouse** ist das System, in dem sie meist stattfindet.

### Prüfungsfalle
Auswertungen „direkt im Produktivsystem“ vorschlagen. Es fehlen die drei klassischen Gründe für die Trennung: Last auf dem Tagesgeschäft, fehlende Historie, verteilte Quellen. Ebenso falsch: OLAP-Daten als „immer tagesaktuell“ bezeichnen – sie sind so aktuell wie der letzte Ladelauf.

### Merksatz
OLTP führt das Geschäft und schreibt viel in kleinen Portionen, OLAP versteht das Geschäft und liest wenig in großen Portionen.

Siehe auch: OLTP · OLAP · OLAP-Würfel · Data Warehouse · ETL · ACID · 3. Normalform · Star-Schema
Mehr: Deep Dive 8, Teil 1 · Deep Dive 8, 4.5

## One-Hot-Encoding
<!-- id: one-hot-encoding · quellen: Karte DD6, DD6 Teil 5 · stand: 2026-10 -->

Umwandlung einer kategorialen Spalte in mehrere 0/1-Spalten, je Kategorie eine, weil Lernverfahren nur mit Zahlen rechnen.

### Erklärung
Bei nominalen Merkmalen darf keine Reihenfolge entstehen. Eine Durchnummerierung (Möbel = 1, Elektronik = 2, Zubehör = 3) würde dem Modell Abstände vortäuschen, die es nicht gibt. One-Hot-Encoding setzt je Zeile genau eine Spalte auf 1. Bei linearen Modellen lässt man oft eine Spalte weg (k − 1 Spalten, Dummy-Kodierung), weil sie sich aus den anderen ergibt.

### Beispiel
| Produkt | kat_moebel | kat_elektronik | kat_zubehoer |
|---|---|---|---|
| Bürostuhl Comfort | 1 | 0 | 0 |
| Monitor 27 Zoll | 0 | 1 | 0 |
| Schreibtischlampe | 0 | 0 | 1 |

### Abgrenzung
**Label Encoding** (Zahl je Kategorie) passt nur zu ordinalen Merkmalen wie Prioritätsstufen oder für Entscheidungsbäume.

### Prüfungsfalle
Merkmale mit sehr vielen Ausprägungen (z. B. Postleitzahl) per One-Hot kodieren – es entstehen Tausende fast leere Spalten; besser gruppieren (Region).

### Merksatz
Eine Kategorie, eine Spalte, eine Eins.

Siehe auch: Kategorien kodieren · Nominalskala · Min-Max-Normalisierung · Standardisierung
Mehr: Deep Dive 6, Teil 5

## Open Data
<!-- id: open-data · quellen: DD14 2.7 · stand: 2026-10 -->

Frei nutzbare Daten, meist öffentlicher Stellen, die unter offenen Lizenzen für jeden Zweck weiterverwendet werden dürfen.

### Erklärung
Open Data wird maschinenlesbar bereitgestellt (z. B. CSV, JSON, Programmierschnittstelle), in Deutschland etwa über GovData oder das Statistische Bundesamt. Typische Lizenzen sind die **Datenlizenz Deutschland** (Namensnennung 2.0 oder Zero) und Creative Commons wie CC BY. Frei heißt nicht bedingungslos: Meist muss die Quelle genannt werden.

### Beispiel
Die Analystin des Möbelhauses reichert die Umsatzzahlen mit Einwohnerzahlen je Landkreis von Destatis an und vermerkt im Dashboard „Quelle: Statistisches Bundesamt (Destatis), Datenlizenz Deutschland – Namensnennung – Version 2.0“.

### Abgrenzung
| Begriff | Gegenstand |
|---|---|
| Open Data | Daten |
| Open Source | Quellcode von Software |
| Scraping fremder Webseiten | kann Datenbankherstellerrecht und Nutzungsbedingungen verletzen |

### Prüfungsfalle
Öffentlich zugängliche Daten mit Open Data gleichsetzen – entscheidend ist die Lizenz, nicht die Sichtbarkeit im Netz.

### Merksatz
Offen sind Daten erst durch ihre Lizenz – und die verlangt meist die Quellenangabe.

Siehe auch: Open Source · Urheberrecht · Datenbankherstellerrecht · Proprietäre Software
Mehr: Deep Dive 14, 2.7

## Open Source
<!-- id: open-source · quellen: Karte DD14, DD14 2.7 · stand: 2026-10 -->

Software mit offenem Quellcode, die genutzt, verändert und weitergegeben werden darf – aber nur unter den Bedingungen ihrer Lizenz.

### Erklärung
**Permissive** Lizenzen (MIT, Apache 2.0, BSD) verlangen im Kern die Nennung des Urhebers und des Lizenztexts; der Code darf auch in proprietäre Produkte einfließen. **Copyleft**-Lizenzen (GPL) verlangen, dass veränderte Software bei der Weitergabe wieder unter derselben Lizenz und mit Quellcode veröffentlicht wird. Kostenlos ist Open Source meist, aber nicht zwingend.

### Beispiel
Das Möbelhaus nutzt intern Python-Bibliotheken unter MIT- und BSD-Lizenz für seine Auswertungen – unproblematisch. Würde es ein verändertes GPL-Programm an Kunden weitergeben, müsste es dessen Quellcode offenlegen.

### Abgrenzung
| Lizenztyp | Beispiel | Pflicht bei Weitergabe |
|---|---|---|
| permissiv | MIT, Apache | Urheber und Lizenz nennen |
| Copyleft | GPL | zusätzlich gleiche Lizenz und Quellcode |
| proprietär | kommerzielle Software | Nutzung nur im Rahmen der Lizenz |

### Prüfungsfalle
„Open Source darf man ohne Bedingungen verwenden“ – auch hier gilt eine Lizenz, deren Verletzung Ansprüche auslöst.

### Merksatz
Offener Code ist nicht herrenlos – die Lizenz gilt immer.

Siehe auch: Copyleft · Proprietäre Software · Urheberrecht · Open Data
Mehr: Deep Dive 14, 2.7

## OpenAPI
<!-- id: openapi · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

Standard, früher Swagger, zur maschinenlesbaren Beschreibung von REST-APIs in YAML oder JSON.

### Erklärung
Eine OpenAPI-Datei beschreibt Endpunkte, HTTP-Methoden, Parameter, Datenschemas der Anfragen und Antworten, Statuscodes und Authentifizierung. Daraus lassen sich Dokumentation, Testaufrufe und Client-Code automatisch erzeugen; die Datei dient als Vertrag zwischen Anbieter und Nutzer der Schnittstelle. Aktuell ist Version 3.2 (Stand 2026).

### Beispiel
```yaml
paths:
  /reparaturauftraege:
    get:
      parameters:
        - name: status
          in: query
          schema: { type: string }
      responses:
        '200':
          description: Liste der Aufträge
```

### Abgrenzung
| Schnittstellenstil | Beschreibung |
|---|---|
| REST | OpenAPI (YAML/JSON) |
| SOAP | WSDL (XML) |
| GraphQL | Schema mit Typsystem |

### Prüfungsfalle
OpenAPI für ein Protokoll oder eine API halten – es ist nur die Beschreibung einer REST-API.

### Merksatz
OpenAPI ist der Bauplan einer REST-Schnittstelle zum Lesen für Mensch und Maschine.

Siehe auch: REST · YAML · WSDL · API-Versionierung · Andere Schnittstellenstile im Vergleich
Mehr: Deep Dive 15, 3.2

## Operation
<!-- id: operation · quellen: DD17 4.1 · stand: 2026-10 -->

PAP-Symbol nach DIN 66001: ein Rechteck für eine Anweisung, z. B. eine Berechnung oder Zuweisung.

### Erklärung
Im Programmablaufplan steht jede Verarbeitung ohne Entscheidung in einem Rechteck mit einem Eingang und einem Ausgang. Ablauflinien verbinden die Symbole von oben nach unten. Ein Aufruf eines an anderer Stelle beschriebenen Ablaufs bekommt ein eigenes Symbol (Unterprogramm: Rechteck mit doppelten senkrechten Kanten).

### Beispiel
Im PAP zur Rechnungssumme steht im Rechteck: „summe ← summe + preis · menge“.

### Abgrenzung
| Symbol | Bedeutung |
|---|---|
| Rechteck | Operation |
| Raute | Verzweigung mit Bedingung |
| Parallelogramm | Ein-/Ausgabe |
| Oval / abgerundetes Rechteck | Grenzstelle (Start, Ende) |

### Prüfungsfalle
Eine Eingabe („Preis einlesen“) in ein Rechteck statt in ein Parallelogramm zeichnen.

### Merksatz
Rechnen im Rechteck, fragen in der Raute.

Siehe auch: Programmablaufplan · Verzweigung · Ein-/Ausgabe · Grenzstelle · Unterprogramm
Mehr: Deep Dive 17, 4.1

## Optimistisches Sperren
<!-- id: optimistisches-sperren · quellen: Karte DD15, DD15 4.2 · stand: 2026-10 -->

Verfahren gegen Lost Updates: Eine Versionsspalte wird mitgeführt, und das Update gelingt nur, wenn sich die Version seit dem Lesen nicht geändert hat – sonst wird ein Konflikt gemeldet.

### Erklärung
Es wird nichts gesperrt; man geht davon aus, dass Konflikte selten sind, und prüft erst beim Schreiben. Trifft das Update 0 Zeilen, hat jemand anderes zwischenzeitlich geändert: Daten neu lesen und erneut versuchen. Eine REST-API antwortet in diesem Fall mit 409 Conflict.

### Beispiel
Zwei Disponenten lesen Lagerbestand 10 mit Version 3:
```sql
UPDATE lager SET bestand = 7, version = version + 1
WHERE artikel_id = 10 AND version = 3;
```
Der Erste schreibt erfolgreich (Version 4); beim Zweiten trifft das Update 0 Zeilen, er liest neu (7) und schreibt 4.

### Abgrenzung
| | Optimistisch | Pessimistisch |
|---|---|---|
| Wann | prüft beim Schreiben | sperrt beim Lesen (`SELECT … FOR UPDATE`) |
| Geeignet | seltene Konflikte, Web-Anwendungen | häufige Konflikte, kurze Transaktionen |
| Risiko | Wiederholungen nötig | Wartezeiten, Deadlocks |

### Prüfungsfalle
Den Versionsvergleich im WHERE vergessen – dann ist die Versionsspalte wirkungslos.

### Merksatz
Optimistisch: erst arbeiten, beim Speichern prüfen, ob jemand schneller war.

Siehe auch: Pessimistisches Sperren · Lost Update · Deadlock · Isolationsstufen · Atomare Änderung
Mehr: Deep Dive 15, 4.2

## OR-Gateway
<!-- id: or-gateway · quellen: Karte DD5, DD5 2.1, DD17 1.1 · stand: 2026-10 -->

Inklusives Gateway in BPMN, Raute mit Kreis: Es werden ein oder mehrere ausgehende Pfade durchlaufen, je nachdem, welche Bedingungen zutreffen.

Auch: OR

### Erklärung
Beim Aufspalten erhält jeder Pfad mit zutreffender Bedingung ein Token; beim Zusammenführen wartet das OR-Gateway auf alle **tatsächlich aktivierten** Pfade. Die Bedingungen an den Pfaden müssen beschriftet sein, ein Standardfluss verhindert, dass kein Pfad gewählt wird. In der EPK heißt der entsprechende Konnektor OR (∨).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100" role="img" aria-label="Gateways XOR, AND und OR im Vergleich">
<polygon points="50,10 80,40 50,70 20,40" class="dg-form"/>
<line x1="41" y1="31" x2="59" y2="49" class="dg-linie dg-dick"/>
<line x1="59" y1="31" x2="41" y2="49" class="dg-linie dg-dick"/>
<text x="50" y="90" text-anchor="middle" class="dg-klein">XOR: genau einer</text>
<polygon points="150,10 180,40 150,70 120,40" class="dg-form"/>
<line x1="150" y1="28" x2="150" y2="52" class="dg-linie dg-dick"/>
<line x1="138" y1="40" x2="162" y2="40" class="dg-linie dg-dick"/>
<text x="150" y="90" text-anchor="middle" class="dg-klein">AND: alle</text>
<polygon points="250,10 280,40 250,70 220,40" class="dg-akzent"/>
<circle cx="250" cy="40" r="11" fill="none" class="dg-linie dg-dick"/>
<text x="250" y="90" text-anchor="middle" class="dg-klein dg-fett">OR: einer oder mehrere</text>
</svg>
```

### Beispiel
Nach „Reklamation prüfen“ im Möbelhaus: „Ersatzteil bestellen“ und/oder „Gutschrift erstellen“ – je nach Fall eins von beiden oder beides. Ein OR-Gateway führt die Pfade wieder zusammen, bevor „Kunde informieren“ folgt.

### Abgrenzung
| Gateway | Symbol | Pfade |
|---|---|---|
| XOR | X | genau einer |
| AND | + | alle parallel |
| OR | O | einer oder mehrere |

### Prüfungsfalle
Ein OR öffnen und mit einem XOR schließen – laufen beide Pfade, wird der Folgeschritt doppelt ausgeführt.

### Merksatz
OR heißt „und/oder“: mindestens ein Weg, gern auch mehrere.

Siehe auch: XOR-Gateway · AND-Gateway · Gateway · Token (BPMN) · Standardfluss
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Ordentliche Kündigung
<!-- id: ordentliche-kundigung · quellen: Karte DD13, DD13 3.2, DD13 3.3 · stand: 2026-10 -->

Kündigung eines Arbeitsverhältnisses unter Einhaltung der gesetzlichen, tariflichen oder vertraglichen Kündigungsfrist.

### Erklärung
Die Grundfrist nach § 622 BGB beträgt für beide Seiten vier Wochen zum 15. oder zum Monatsende; in der Probezeit zwei Wochen. Kündigt der Arbeitgeber, verlängert sich die Frist mit der Betriebszugehörigkeit (ab 2 Jahren 1 Monat zum Monatsende bis 7 Monate ab 20 Jahren). Jede Kündigung braucht Schriftform mit eigenhändiger Unterschrift (§ 623 BGB). Gilt das Kündigungsschutzgesetz (mehr als 6 Monate Beschäftigung, mehr als 10 Arbeitnehmer), muss eine Arbeitgeberkündigung sozial gerechtfertigt sein – personen-, verhaltens- oder betriebsbedingt; ein vorhandener Betriebsrat ist vorher anzuhören.

### Beispiel
Herr Kaya, 6 Jahre im Betrieb, Zugang am 10.03.2026:
- Er kündigt selbst: 10.03. + 4 Wochen = 07.04. → zum 15.04.2026.
- Der Arbeitgeber kündigt: 2 Monate zum Monatsende → 31.05.2026.

### Abgrenzung
Die **außerordentliche Kündigung** ist fristlos und braucht einen wichtigen Grund (§ 626 BGB, Erklärung binnen zwei Wochen).

### Prüfungsfalle
Die verlängerten Fristen auch auf die Kündigung durch den Arbeitnehmer anwenden – gesetzlich gelten sie nur für den Arbeitgeber.

### Merksatz
Ordentlich heißt: mit Frist, schriftlich, und beim Arbeitgeber oft mit Begründung.

Siehe auch: Außerordentliche Kündigung · Kündigungsschutzgesetz · Schriftform · Änderungskündigung · Abmahnung
Mehr: Deep Dive 13, 3.2 · Deep Dive 13, 3.3

## ORDER BY
<!-- id: order-by · quellen: Karte DD1, DD1 1.3, DD19 5.2, DD29 4 · stand: 2026-11 -->

SQL-Klausel, die das Ergebnis nach einer oder mehreren Spalten oder Ausdrücken sortiert: aufsteigend (`ASC`, Standard) oder absteigend (`DESC`).
Auch: ASC, DESC

### Erklärung
ORDER BY steht am Ende der Abfrage (nur LIMIT kommt danach) und wird nach dem SELECT ausgeführt – deshalb darf es nach Standard-SQL als einzige Klausel die Aliase aus dem SELECT verwenden (MySQL erlaubt sie zusätzlich in GROUP BY und HAVING, SQLite auch in WHERE; innerhalb von Ausdrücken meist nicht). Bei mehreren Kriterien sortiert das erste, jedes weitere nur bei Gleichstand; `ASC`/`DESC` gilt **je Kriterium einzeln**. Statt eines Namens geht auch die Spaltennummer (`ORDER BY 2`), das ist aber fehleranfällig. Ohne ORDER BY ist die Reihenfolge der Zeilen **nicht garantiert**. Datumsangaben im Format `JJJJ-MM-TT` sortieren als Text richtig, Zahlen, die als Text gespeichert sind, nicht (`'10'` kommt vor `'9'`).

NULL: SQLite und MySQL behandeln NULL als kleinsten Wert (bei `ASC` zuerst, bei `DESC` zuletzt), Oracle und PostgreSQL als größten. `NULLS FIRST` bzw. `NULLS LAST` legt es fest (SQLite ab 3.30, PostgreSQL, Oracle; nicht MySQL).

### Beispiel
```sql
SELECT ort, COUNT(*) AS anzahl
FROM kunde
GROUP BY ort
ORDER BY anzahl DESC, ort ASC;
```
Ergebnis: Hamburg 2 · München 2 · Köln 1. Zuerst zählt `anzahl` (absteigend); den Gleichstand bei 2 entscheidet `ort` aufsteigend (Hamburg vor München).

### Abgrenzung
ORDER BY ordnet nur die Ausgabe und ändert nichts in der Tabelle. GROUP BY bildet Gruppen und garantiert keine Reihenfolge. Sortieralgorithmen wie Bubble Sort oder Quicksort sind ein anderes Thema (Verfahren im Programm, nicht SQL-Klausel).

### Prüfungsfalle
`ORDER BY ort, anzahl DESC` sortiert nur `anzahl` absteigend, `ort` bleibt aufsteigend. Wer „beide absteigend“ will, schreibt `DESC` hinter jedes Kriterium.

### Merksatz
Ohne ORDER BY keine Reihenfolge – und DESC gilt nur für das Wort davor.

Siehe auch: SELECT · GROUP BY · NULL · Alias (AS)
Mehr: Deep Dive 1, 1.3 · Deep Dive 19, 5.2 · Deep Dive 29, Teil 4

## Ordinalskala
<!-- id: ordinalskala · quellen: Karte DD3, DD3 Teil 1 · stand: 2026-10 -->

Skalenniveau, bei dem die Werte eine Rangfolge haben, die Abstände zwischen den Stufen aber nicht gleich groß sind.

Auch: Ordinal

### Erklärung
Typische ordinale Merkmale sind Schulnoten, Zufriedenheitsstufen (Likert-Skala), Prioritätsstufen oder Kleidergrößen. Zulässig sind Modus, **Median** und Quartile, nicht aber der Mittelwert, weil er gleiche Abstände voraussetzt. Für Zusammenhänge zwischen ordinalen Merkmalen nutzt man die Rangkorrelation nach Spearman.

### Beispiel
Kundenzufriedenheit nach Lieferung (1 = sehr unzufrieden bis 5 = sehr zufrieden), sortierte Antworten: 2, 3, 4, 4, 5. Median = 4. Ein Mittelwert von 3,6 unterstellt, dass der Schritt von 2 nach 3 so groß ist wie von 4 nach 5.

### Abgrenzung
| Skala | Ordnung | Gleiche Abstände | Lagemaße |
|---|---|---|---|
| Nominal | nein | nein | Modus |
| Ordinal | ja | nein | Modus, Median |
| Metrisch | ja | ja | zusätzlich Mittelwert |

### Prüfungsfalle
Den Notendurchschnitt als formal korrekt darstellen – er ist eine verbreitete Vereinfachung, die man benennen sollte.

### Merksatz
Ordinal: Reihenfolge ja, Abstände nein – also Median.

Siehe auch: Nominalskala · Intervallskala · Median · Likert-Skala · Skalenniveau
Mehr: Deep Dive 3, Teil 1

## Organe der AG
<!-- id: organe-der-ag · quellen: DD14 3.2 · stand: 2026-10 -->

Die drei Organe der Aktiengesellschaft: Vorstand (leitet), Aufsichtsrat (überwacht und bestellt den Vorstand) und Hauptversammlung (Versammlung der Aktionäre).

### Erklärung
- **Vorstand:** leitet die AG in eigener Verantwortung und vertritt sie nach außen (§ 76 AktG).
- **Aufsichtsrat:** bestellt und überwacht den Vorstand (§§ 84, 111 AktG); in größeren Unternehmen sitzen dort auch Arbeitnehmervertreter (ab 500 Beschäftigten ein Drittel, ab 2.000 die Hälfte).
- **Hauptversammlung:** wählt die Anteilseignervertreter im Aufsichtsrat, beschließt über die Gewinnverwendung, Satzungsänderungen und die Entlastung von Vorstand und Aufsichtsrat.

### Beispiel
Ein Möbelkonzern-AG: Die Hauptversammlung beschließt eine Dividende von 1,20 € je Aktie, der Aufsichtsrat verlängert den Vertrag der Vorstandsvorsitzenden, der Vorstand entscheidet über ein neues Data-Warehouse-Projekt.

### Abgrenzung
| Rechtsform | Leitung | Kontrolle |
|---|---|---|
| AG | Vorstand | Aufsichtsrat (Pflicht) |
| GmbH | Geschäftsführer | Gesellschafterversammlung, Aufsichtsrat nur ab Mitbestimmungsgrenzen |

### Prüfungsfalle
Annehmen, die Hauptversammlung wähle den Vorstand – das tut der Aufsichtsrat.

### Merksatz
Vorstand führt, Aufsichtsrat kontrolliert, Hauptversammlung entscheidet über Geld und Satzung.

Siehe auch: AG · Unternehmensmitbestimmung im Aufsichtsrat · GmbH · Juristische Person
Mehr: Deep Dive 14, 3.2

## Organigramm
<!-- id: organigramm · quellen: DD5 6.1, DD17 1.5 · stand: 2026-10 -->

Grafische Darstellung der Aufbauorganisation mit Stellen, Abteilungen und Weisungsbeziehungen.

### Erklärung
Das Organigramm zeigt, wer wem unterstellt ist, als Baum von oben nach unten. Stellen sind Rechtecke, Linien sind Weisungswege; **Stabsstellen** hängen seitlich an der Linie und beraten ohne Weisungsrecht. Aus der Form lässt sich die Organisationsform ablesen: Einlinien-, Stablinien-, Mehrlinien- oder Matrixorganisation.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 150" width="360" height="150" role="img" aria-label="Organigramm im Stabliniensystem">
<rect x="120" y="10" width="120" height="30" class="dg-akzent"/>
<text x="180" y="25" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Geschäftsführung</text>
<line x1="180" y1="40" x2="180" y2="85" class="dg-linie"/>
<line x1="180" y1="62" x2="250" y2="62" class="dg-linie"/>
<rect x="250" y="50" width="100" height="24" class="dg-grau"/>
<text x="300" y="62" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Datenschutz (Stab)</text>
<line x1="60" y1="85" x2="300" y2="85" class="dg-linie"/>
<line x1="60" y1="85" x2="60" y2="105" class="dg-linie"/>
<line x1="180" y1="85" x2="180" y2="105" class="dg-linie"/>
<line x1="300" y1="85" x2="300" y2="105" class="dg-linie"/>
<rect x="15" y="105" width="90" height="30" class="dg-form"/>
<text x="60" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Vertrieb</text>
<rect x="135" y="105" width="90" height="30" class="dg-form"/>
<text x="180" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Lager</text>
<rect x="255" y="105" width="90" height="30" class="dg-form"/>
<text x="300" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-klein">IT/Analyse</text>
</svg>
```

### Beispiel
Das Möbelhaus Nordholz ist ein Stabliniensystem: Die Abteilungen unterstehen der Geschäftsführung, der Datenschutzbeauftragte berät als Stabsstelle.

### Abgrenzung
Das Organigramm zeigt die **Aufbauorganisation** (wer?); Abläufe (wie?) zeigen BPMN oder EPK als **Ablauforganisation**.

### Prüfungsfalle
Eine Stabsstelle mit Weisungsrecht zeichnen – Stäbe können nur empfehlen.

### Merksatz
Das Organigramm zeigt Zuständigkeiten, nicht Abläufe.

Siehe auch: Aufbauorganisation · Ablauforganisation · Einliniensystem · Stabliniensystem · Matrixorganisation
Mehr: Deep Dive 5, 6.1 · Deep Dive 17, 1.5

## Organisationseinheit
<!-- id: organisationseinheit · quellen: DD5 2.3, DD17 1.2 · stand: 2026-10 -->

Objekt der erweiterten EPK (eEPK): eine Ellipse, die angibt, welche Stelle oder Abteilung eine Funktion ausführt.

### Erklärung
Die eEPK ergänzt die reine Ablauflogik um das „Wer“ und „Womit“. Die Organisationseinheit wird durch eine ungerichtete Linie mit einer **Funktion** verbunden, nie mit einem Ereignis. Weitere Zusatzobjekte sind Informationsobjekte (Rechteck) und Anwendungssysteme.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 70" width="320" height="70" role="img" aria-label="Funktion mit verbundener Organisationseinheit">
<rect x="10" y="15" width="150" height="40" rx="10" class="dg-gut"/>
<text x="85" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag erfassen</text>
<line x1="160" y1="35" x2="200" y2="35" class="dg-linie"/>
<ellipse cx="255" cy="35" rx="55" ry="22" class="dg-mittel"/>
<line x1="212" y1="22" x2="212" y2="48" class="dg-linie"/>
<text x="260" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Serviceannahme</text>
</svg>
```

### Beispiel
Im Reparaturprozess des Möbelhauses ist „Auftrag erfassen“ mit der Organisationseinheit „Serviceannahme“ verbunden, „Möbel reparieren“ mit „Werkstatt“.

### Abgrenzung
In BPMN wird die Zuständigkeit über **Lanes** innerhalb eines Pools dargestellt, nicht über Zusatzobjekte.

### Prüfungsfalle
Die Organisationseinheit an ein Ereignis hängen – Zusatzobjekte gehören immer an Funktionen.

### Merksatz
Die Ellipse sagt, wer die Funktion ausführt.

Siehe auch: EPK · Funktion · Informationsobjekt · Anwendungssystem · Lane
Mehr: Deep Dive 5, 2.3 · Deep Dive 17, 1.2

## Overfitting
<!-- id: overfitting · quellen: Karte DD7, DD7 1.2, DD6 7.3 · stand: 2026-10 -->

Überanpassung: Das Modell lernt die Trainingsdaten samt Rauschen auswendig und ist auf neuen Daten deutlich schlechter.

### Erklärung
Ursachen sind ein zu komplexes Modell, zu wenige Daten oder zu langes Training. Erkennbar ist Overfitting an der großen Lücke zwischen Trainings- und Testgüte. In der Sprache des Bias-Variance-Trade-offs: geringer Bias, aber hohe Varianz. Gegenmaßnahmen: mehr Daten, einfacheres Modell, **Regularisierung** (große Gewichte bestrafen), Entscheidungsbäume beschneiden (Pruning) oder in der Tiefe begrenzen, **Early Stopping** (Training abbrechen, wenn der Validierungsfehler steigt), Kreuzvalidierung zur zuverlässigen Messung. Die **Lernkurve** zeigt, ob mehr Daten die Lücke verkleinern.

### Beispiel
Ein ungeschnittener ID3-Baum zur Reklamationsvorhersage erreicht 99 % Accuracy auf den Trainingsdaten, aber nur 71 % auf den Testdaten. Mit begrenzter Baumtiefe sinkt die Trainingsgüte auf 85 %, die Testgüte steigt auf 82 %.

### Abgrenzung
| | Overfitting | Underfitting |
|---|---|---|
| Training | sehr gut | schlecht |
| Test | deutlich schlechter | schlecht |
| Ursache | zu komplex | zu einfach |

### Prüfungsfalle
Ein Modell nach der Trainingsgüte beurteilen – aussagekräftig ist nur die Güte auf ungesehenen Testdaten.

### Merksatz
Wer auswendig lernt, besteht nur die Übung, nicht die Prüfung.

Siehe auch: Underfitting · Kreuzvalidierung · Train-Test-Split · Entscheidungsbaum · Regularisierung · Early Stopping · Lernkurve · Bias-Variance-Trade-off · Overfitting und Underfitting im Vergleich
Mehr: Deep Dive 7, 1.2 · Deep Dive 6, 7.3

## Overfitting und Underfitting im Vergleich
<!-- id: overfitting-und-underfitting-im-vergleich · quellen: Karte DD7, DD7 1.2, DD7 1.3, DD6 7.3 · stand: 2026-11 -->

Zwei entgegengesetzte Fehler bei der Modellanpassung: Beim Overfitting ist das Modell zu komplex und lernt die Trainingsdaten samt Rauschen auswendig, beim Underfitting ist es zu einfach und erfasst nicht einmal das Grundmuster.

### Erklärung
Die Diagnose gelingt mit zwei Zahlen, der Güte auf den Trainingsdaten und der Güte auf zurückgehaltenen Testdaten (oder Validierungsdaten). Entscheidend sind ihr Niveau und die **Lücke** zwischen beiden.

| Kriterium | Overfitting (Überanpassung) | Underfitting (Unteranpassung) |
|---|---|---|
| Güte im Training | sehr gut | schlecht |
| Güte im Test | deutlich schlechter als im Training | schlecht, ähnlich wie im Training |
| Lücke Training – Test | groß | klein |
| Ursache | Modell zu komplex, zu wenige Daten, zu langes Training | Modell zu einfach, aussagekräftige Merkmale fehlen, zu kurzes Training |
| Bias und Varianz | geringer Bias, hohe Varianz | hoher Bias, geringe Varianz |
| Bild | Rauschen wird mitgelernt | Gerade durch eine Kurve |
| Gegenmaßnahmen | mehr Daten, einfacheres Modell, Regularisierung, Baum beschneiden oder in der Tiefe begrenzen, Early Stopping | komplexeres Modell, bessere Merkmale (Feature Engineering), länger trainieren, Regularisierung lockern |

**Wann nehme ich was?** Zuerst beide Gütewerte nebeneinanderlegen. Beide niedrig: Underfitting, das Modell muss mehr können. Training stark, Test schwach: Overfitting, das Modell muss einfacher werden oder mehr Daten bekommen. Beide gut und nah beieinander: das Modell verallgemeinert. Die passende Maßnahme folgt aus der Diagnose; dieselbe Maßnahme kann bei der anderen Fehlerart schaden:

| Maßnahme | bei Overfitting | bei Underfitting |
|---|---|---|
| mehr Trainingsdaten | hilft | hilft kaum |
| komplexeres Modell (tieferer Baum, höherer Polynomgrad) | verschlimmert | hilft |
| Regularisierung stärken | hilft | verschlimmert (eher lockern) |
| Merkmale anpassen | überflüssige Merkmale entfernen hilft | aussagekräftige Merkmale ergänzen hilft |
| länger trainieren | schadet ohne Early Stopping | hilft |

### Beispiel
Die Möbelhaus Nordholz GmbH trainiert Entscheidungsbäume verschiedener Tiefe für die Reklamationsvorhersage und misst die Accuracy auf Trainings- und Testdaten:

| Modell | Training | Test | Lücke | Diagnose |
|---|---|---|---|---|
| Baum Tiefe 1 | 62 % | 60 % | 2 Punkte | beide schwach: Underfitting |
| Baum Tiefe 4 | 85 % | 82 % | 3 Punkte | gut verallgemeinernd |
| Baum ohne Tiefenbegrenzung | 99 % | 71 % | 28 Punkte | großer Einbruch: Overfitting |

Die Lücken: $62 - 60 = 2$, $85 - 82 = 3$, $99 - 71 = 28$. Wer nur auf die Trainingswerte schaut, wählte den ungeschnittenen Baum (99 %) – und läge auf neuen Aufträgen bei nur 71 %, schlechter als der Baum mit Tiefe 4 (82 %). Der Baum mit Tiefe 1 ist dagegen zu einfach: Auch mehr Daten würden seine 60 % kaum anheben, er braucht mehr Tiefe oder bessere Merkmale.

### Abgrenzung
- Der **Bias-Variance-Trade-off** beschreibt dasselbe Phänomen als Fehlerzerlegung: Underfitting entspricht hohem Bias, Overfitting hoher Varianz.
- Eine **zu gute Testgüte** durch Data Leakage (Testinformationen sickern ins Training) ist kein Overfitting, sondern ein Messfehler – das Modell wirkt besser, als es ist.
- Gemessen wird immer an Daten, die das Modell nicht gesehen hat (Train-Test-Split, Kreuzvalidierung); die Trainingsgüte allein sagt über beide Fehler nichts.

### Prüfungsfalle
Ein Modell nach seiner Trainingsgüte beurteilen. Dazu: gegen Underfitting „mehr Daten“ oder „Regularisierung“ vorschlagen – beides zielt auf Overfitting. Und: Die Baumtiefe nicht wiederholt an den Testdaten auswählen; dafür gehören Validierungsdaten oder die Kreuzvalidierung hin, die Testdaten werden nur einmal am Schluss benutzt.

### Merksatz
Overfitting lernt auswendig, Underfitting lernt zu wenig – die Lücke zwischen Training und Test verrät, welches von beiden vorliegt.

Siehe auch: Overfitting · Underfitting · Bias-Variance-Trade-off · Regularisierung · Kreuzvalidierung · Train-Test-Split · Trainingsdaten · Testdaten · Lernkurve · Early Stopping · Entscheidungsbaum
Mehr: Deep Dive 7, 1.2 · Deep Dive 7, 1.3 · Deep Dive 6, 7.3

## Oversampling
<!-- id: oversampling · quellen: Karte DD7, DD7 4.5 · stand: 2026-10 -->

Fälle der Minderheitsklasse im Trainingsdatensatz vervielfältigen oder synthetisch erzeugen (z. B. mit SMOTE), um unausgeglichene Klassen auszugleichen.

### Erklärung
Ist die interessierende Klasse selten, lernt ein Modell sie kaum. Oversampling erhöht ihren Anteil im Training: durch Kopieren vorhandener Fälle oder durch **SMOTE**, das neue Fälle zwischen ähnlichen Minderheitsfällen erzeugt. Wichtig: erst (stratifiziert) aufteilen, dann nur die Trainingsdaten resamplen. Die Testdaten behalten die reale Verteilung.

### Beispiel
10.000 Aufträge, 2 % Reklamationen. Stratifizierter Split: Training 8.000 (160 Reklamationen), Test 2.000 (40). Die 160 Reklamationen im Training werden auf 1.600 verzehnfacht → Anteil 1.600 / 9.440 ≈ 17 %. Der Test bleibt bei 2 %.

### Abgrenzung
| Verfahren | Vorgehen | Nachteil |
|---|---|---|
| Oversampling | Minderheit vermehren | Overfitting-Gefahr bei Kopien |
| Undersampling | Mehrheit reduzieren | Informationsverlust |
| Klassengewichte | Fehler bei der Minderheit stärker bestrafen | verfahrensabhängig |

### Prüfungsfalle
Vor dem Split oversamplen – Kopien desselben Falls landen in Training und Test, die Güte wird geschönt.

### Merksatz
Erst teilen, dann vervielfältigen – und nur im Training.

Siehe auch: SMOTE · Undersampling · Unausgeglichene Klassen · Train-Test-Split · Balanced Accuracy
Mehr: Deep Dive 7, 4.5
