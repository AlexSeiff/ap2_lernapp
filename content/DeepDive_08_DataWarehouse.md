# Deep Dive 8: Data Warehouse & Big Data
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Dieser Themenblock gehört zum Prüfungsteil „Daten identifizieren, klassifizieren und bereitstellen" innerhalb von **„Sicherstellen der Datenqualität"**. Typische Aufgaben: OLTP und OLAP abgrenzen, ein **Sternschema entwerfen**, Fakten- und Dimensionstabellen benennen, den ETL-Prozess erläutern, Historisierung von Stammdaten beschreiben, Big-Data-Merkmale zuordnen.

Für dein Projekt ist der Block praktisch relevant: Fast jede betriebliche Datenanalyse zieht Daten aus operativen Systemen und bereitet sie für Auswertungen auf – genau das ist ein ETL-Prozess, auch wenn er nur aus einem Skript besteht.

Szenario: **Möbelhaus Nordholz GmbH** – die operative Datenbank kennst du aus Deep Dive 1 und 2.

---

# Teil 1 – OLTP und OLAP

Der Ausgangspunkt: Operative Systeme und Auswertungssysteme haben **gegensätzliche Anforderungen**. Deshalb trennt man sie.

| Kriterium | **OLTP** (operativ) | **OLAP** (analytisch) |
|---|---|---|
| Zweck | Tagesgeschäft abwickeln | Entscheidungen unterstützen |
| Typische Operation | einzelne Bestellung anlegen | Umsatz je Region und Quartal auswerten |
| Zugriffsart | viele kurze Lese-/Schreibvorgänge | wenige, komplexe Leseabfragen |
| Datenmodell | **normalisiert** (3. NF) | **denormalisiert** (Star/Snowflake) |
| Datenbestand | aktuell, detailliert | historisiert, oft aggregiert |
| Zeithorizont | Gegenwart | Jahre |
| Optimiert auf | Schreibgeschwindigkeit, Konsistenz | Lesegeschwindigkeit, Verständlichkeit |
| Nutzer | Sachbearbeitung, Kundschaft | Controlling, Management, Analyse |

**Warum nicht direkt im OLTP auswerten?** Drei Gründe, die in Prüfungen erwartet werden:
1. **Lastproblem:** Komplexe Auswertungen bremsen das Tagesgeschäft aus.
2. **Fehlende Historie:** Operative Systeme überschreiben Änderungen – wer im Mai die Adresse ändert, hat rückwirkend „immer" die neue Adresse gehabt. Für Zeitvergleiche ist das fatal.
3. **Verteilte Quellen:** Auswertungen brauchen Daten aus mehreren Systemen (Warenwirtschaft, CRM, Buchhaltung), die erst zusammengeführt und vereinheitlicht werden müssen.

---

# Teil 2 – Architektur eines Data Warehouse

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 140" width="720" height="140" role="img" aria-label="Architektur eines Data Warehouse: Quellsysteme, Staging Area, Core-DWH, Data Marts und Auswertung; ETL reicht von den Quellsystemen bis ins Core-DWH">
<defs><marker id="dd8a-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<rect x="10" y="18" width="132" height="72" rx="8" class="dg-form"/>
<text x="76" y="38" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Quellsysteme</text>
<text x="76" y="60" text-anchor="middle" dominant-baseline="middle" class="dg-klein">OLTP, CSV,</text>
<text x="76" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Fremdsysteme</text>
<line x1="142" y1="54" x2="152" y2="54" class="dg-linie" marker-end="url(#dd8a-pfeil)"/>
<rect x="152" y="18" width="132" height="72" rx="8" class="dg-form"/>
<text x="218" y="38" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Staging Area</text>
<text x="218" y="60" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Rohdaten,</text>
<text x="218" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">unverändert</text>
<line x1="284" y1="54" x2="294" y2="54" class="dg-linie" marker-end="url(#dd8a-pfeil)"/>
<rect x="294" y="18" width="132" height="72" rx="8" class="dg-akzent"/>
<text x="360" y="38" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Core-DWH</text>
<text x="360" y="60" text-anchor="middle" dominant-baseline="middle" class="dg-klein">integriert,</text>
<text x="360" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">historisiert</text>
<line x1="426" y1="54" x2="436" y2="54" class="dg-linie" marker-end="url(#dd8a-pfeil)"/>
<rect x="436" y="18" width="132" height="72" rx="8" class="dg-form"/>
<text x="502" y="38" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Data Marts</text>
<text x="502" y="60" text-anchor="middle" dominant-baseline="middle" class="dg-klein">fachbereichs-</text>
<text x="502" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">bezogen</text>
<line x1="568" y1="54" x2="578" y2="54" class="dg-linie" marker-end="url(#dd8a-pfeil)"/>
<rect x="578" y="18" width="132" height="72" rx="8" class="dg-form"/>
<text x="644" y="38" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Auswertung</text>
<text x="644" y="60" text-anchor="middle" dominant-baseline="middle" class="dg-klein">BI-Tool,</text>
<text x="644" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bericht</text>
<path d="M76,98 V110 H360 V98" class="dg-linie-akzent"/>
<text x="218" y="126" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-akzent-text">ETL: Extrahieren, Transformieren, Laden</text>
</svg>
```

- **Staging Area:** Zwischenspeicher für die unveränderten Rohdaten. Zweck: Quellsysteme werden schnell wieder entlastet, und bei Fehlern kann ohne erneuten Zugriff auf die Quelle nachgeladen werden.
- **Core-DWH:** integrierter, historisierter, unternehmensweiter Datenbestand – die „einzige Wahrheit".
- **Data Mart:** fachbereichsbezogener Ausschnitt (Vertrieb, Logistik), auf die Fragen dieses Bereichs zugeschnitten und dadurch schnell und verständlich.

**Die vier Merkmale eines DWH nach Inmon** (Standarddefinition, gern abgefragt):
**themenorientiert** (an fachlichen Themen ausgerichtet, nicht an Prozessen) · **integriert** (vereinheitlichte Formate, Codes und Bezeichnungen) · **zeitbezogen** (historisiert statt überschrieben) · **beständig** (nicht flüchtig – einmal geladene Daten werden nicht geändert oder gelöscht).

**Inmon oder Kimball?** Die zwei klassischen Architekturansätze:

| | **Inmon** (Top-down) | **Kimball** (Bottom-up) |
|---|---|---|
| Vorgehen | zuerst das unternehmensweite Core-DWH, daraus die Data Marts ableiten | zuerst fachbereichsbezogene Data Marts, schrittweise zusammenwachsend |
| Modell des Kerns | **normalisiert** (3. NF) | **dimensional** (Star-Schema) |
| Integration | zentral im Core-DWH | über gemeinsam genutzte Dimensionen (**Conformed Dimensions**, „Bus-Architektur") |
| Stärke | hohe Integration, eine konsistente Datenbasis | schneller erster Nutzen, für Fachanwender verständlich |
| Schwäche | lange Aufbauzeit, hoher Anfangsaufwand | Gefahr uneinheitlicher Insellösungen ohne Abstimmung |

Die Schichtenarchitektur oben (Staging → Core-DWH → Data Marts) entspricht dem Inmon-Ansatz; in der Praxis sind Mischformen üblich.

---

# Teil 3 – ETL und ELT

## 3.1 Die drei Phasen

**E – Extract:** Daten aus den Quellsystemen lesen. Varianten: **Vollextraktion** (alles) oder **Deltaextraktion** (nur Änderungen seit dem letzten Lauf – schneller, aber setzt Änderungskennzeichen oder Zeitstempel voraus). Meist nachts, um die Quellsysteme nicht zu belasten.

**T – Transform:** Der eigentliche Arbeitsschritt. Typische Aufgaben:
- **Bereinigen:** fehlende Werte behandeln, Dubletten entfernen, Ausreißer prüfen
- **Vereinheitlichen:** Datumsformate, Einheiten, Währungen, Groß-/Kleinschreibung
- **Harmonisieren:** Schlüssel verschiedener Systeme zusammenführen („Kunde 4711" im CRM = „K-1001" in der Warenwirtschaft)
- **Anreichern:** berechnete Merkmale bilden (Deckungsbeitrag, Lieferdauer)
- **Aggregieren:** vorverdichten, wo Detailtiefe nicht gebraucht wird
- **Prüfen:** Validierungsregeln anwenden, fehlerhafte Sätze in eine **Quarantäne** ausleiten statt sie stillschweigend zu verwerfen

**L – Load:** Laden ins Zielsystem, meist als Batch. Fehlerhafte Datensätze werden protokolliert, nicht ignoriert.

## 3.2 ETL oder ELT?

| | **ETL** | **ELT** |
|---|---|---|
| Reihenfolge | Transformation **vor** dem Laden | erst laden, dann transformieren |
| Zielsystem | klassisches DWH | Data Lake, Cloud-Plattform |
| Vorteil | nur geprüfte Daten im Ziel, kleineres Zielsystem | Rohdaten bleiben erhalten, spätere Auswertungen mit anderer Logik möglich, nutzt Rechenleistung des Zielsystems |
| Nachteil | Rohdaten liegen im Ziel nicht vor, Änderungen der Logik erfordern erneutes Laden | Zielsystem enthält auch ungeprüfte Daten, Governance aufwendiger |

## 3.3 Datenqualität im ETL

Der ETL-Prozess ist der **wichtigste Ort für Qualitätssicherung** – hier passieren alle Daten einen definierten Kontrollpunkt. Bewährt sind: Regelwerk mit Pflichtprüfungen, Quarantänebereich für fehlerhafte Sätze, Fehlerprotokoll mit Verantwortlichem, Ladeprotokoll mit Kennzahlen (gelesene, geladene, abgewiesene Sätze) und Abstimmsummen gegen das Quellsystem.

> ❓ **Prüferfrage:** Warum ist es ein Fehler, ungültige Datensätze im ETL einfach zu verwerfen?
> *Weil die Information über das Problem verloren geht und niemand die Ursache im Quellsystem beheben kann. Zudem stimmen die Summen im DWH nicht mehr mit der Quelle überein, ohne dass die Differenz erklärbar wäre. Richtig ist eine Quarantäne mit Fehlerprotokoll und einem Verantwortlichen für die Nachbearbeitung.*

---

# Teil 4 – Multidimensionale Modellierung

## 4.1 Fakten und Dimensionen

**Faktentabelle:** enthält die **messbaren Kennzahlen** (Menge, Umsatz, Deckungsbeitrag) und die Fremdschlüssel zu den Dimensionen. Sie ist die mit Abstand größte Tabelle – oft Millionen Zeilen.

**Dimensionstabellen:** enthalten die **beschreibenden Merkmale**, entlang derer ausgewertet wird. Merkhilfe: Sie beantworten **Wer? Was? Wann? Wo?**

**Granularität** = die feinste Detailstufe der Faktentabelle (z. B. „eine Zeile je Bestellposition"). Sie muss **vor** dem Entwurf festgelegt werden: Zu grob gewählt, sind spätere Detailauswertungen unmöglich; zu fein gewählt, wächst die Tabelle unnötig.

**Kennzahlentypen** (gern abgefragt):
- **additiv:** über alle Dimensionen summierbar (Umsatz, Menge)
- **semi-additiv:** über manche Dimensionen summierbar, über die Zeit nicht (Lagerbestand – Bestände mehrerer Tage zu addieren ergibt keinen Sinn; über die Zeit verdichtet man mit Stichtagswert, z. B. Monatsendbestand, oder Durchschnitt. Über alle Filialen am selben Tag darf summiert werden.)
- **nicht-additiv:** gar nicht summierbar (Prozentsätze, Durchschnittspreise – diese müssen aus den Grundgrößen neu berechnet werden, z. B. Marge = Summe Deckungsbeitrag / Summe Umsatz, nicht Summe der Einzelmargen)

**Arten von Faktentabellen** (nach Kimball): **Transaktions-Faktentabelle** (eine Zeile je Ereignis, z. B. Bestellposition) · **periodischer Snapshot** (Zustand in festen Abständen, z. B. Lagerbestand je Tag – typisch semi-additiv) · **akkumulierender Snapshot** (eine Zeile je Vorgang, die mit jedem Prozessschritt aktualisiert wird, z. B. Bestellung → Lieferung → Zahlung mit mehreren Datumsspalten).

## 4.2 Star-Schema

Eine zentrale Faktentabelle, sternförmig umgeben von **denormalisierten** Dimensionstabellen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 330" width="680" height="330" role="img" aria-label="Star-Schema: Faktentabelle fakt_verkauf in der Mitte, verbunden mit den Dimensionen dim_zeit, dim_produkt, dim_kunde und dim_filiale">
<line x1="190" y1="73" x2="250" y2="118" class="dg-linie"/>
<line x1="490" y1="73" x2="430" y2="118" class="dg-linie"/>
<line x1="190" y1="258" x2="250" y2="214" class="dg-linie"/>
<line x1="490" y1="258" x2="430" y2="214" class="dg-linie"/>
<rect x="250" y="98" width="180" height="134" class="dg-akzent"/>
<line x1="250" y1="122" x2="430" y2="122" class="dg-linie"/>
<text x="340" y="110" text-anchor="middle" dominant-baseline="middle" class="dg-fett">fakt_verkauf</text>
<text x="258" y="134.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">zeit_id (FK)</text>
<text x="258" y="151.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">produkt_id (FK)</text>
<text x="258" y="168.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">kunde_id (FK)</text>
<text x="258" y="185.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">filial_id (FK)</text>
<text x="258" y="202.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">menge</text>
<text x="258" y="219.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">umsatz</text>
<rect x="20" y="15" width="170" height="117" class="dg-form"/>
<line x1="20" y1="39" x2="190" y2="39" class="dg-linie"/>
<text x="105" y="27" text-anchor="middle" dominant-baseline="middle" class="dg-fett">dim_zeit</text>
<text x="28" y="51.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">zeit_id (PK)</text>
<text x="28" y="68.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">datum</text>
<text x="28" y="85.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">monat</text>
<text x="28" y="102.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">quartal</text>
<text x="28" y="119.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">jahr</text>
<rect x="490" y="15" width="170" height="117" class="dg-form"/>
<line x1="490" y1="39" x2="660" y2="39" class="dg-linie"/>
<text x="575" y="27" text-anchor="middle" dominant-baseline="middle" class="dg-fett">dim_produkt</text>
<text x="498" y="51.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">produkt_id (PK)</text>
<text x="498" y="68.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">bezeichnung</text>
<text x="498" y="85.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">kategorie</text>
<text x="498" y="102.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">warengruppe</text>
<text x="498" y="119.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">lieferant</text>
<rect x="20" y="200" width="170" height="117" class="dg-form"/>
<line x1="20" y1="224" x2="190" y2="224" class="dg-linie"/>
<text x="105" y="212" text-anchor="middle" dominant-baseline="middle" class="dg-fett">dim_kunde</text>
<text x="28" y="236.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">kunde_id (PK)</text>
<text x="28" y="253.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">name</text>
<text x="28" y="270.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">ort</text>
<text x="28" y="287.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">plz</text>
<text x="28" y="304.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">segment</text>
<rect x="490" y="200" width="170" height="117" class="dg-form"/>
<line x1="490" y1="224" x2="660" y2="224" class="dg-linie"/>
<text x="575" y="212" text-anchor="middle" dominant-baseline="middle" class="dg-fett">dim_filiale</text>
<text x="498" y="236.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">filial_id (PK)</text>
<text x="498" y="253.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">filialname</text>
<text x="498" y="270.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">stadt</text>
<text x="498" y="287.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">region</text>
<text x="498" y="304.5" text-anchor="start" dominant-baseline="middle" class="dg-klein">land</text>
</svg>
```

**Eigenschaften:** wenige Joins, sehr schnelle Abfragen, für Fachanwender leicht verständlich. Preis dafür: **bewusste Redundanz** in den Dimensionen (die Warengruppe steht bei jedem Produkt erneut).

## 4.3 Snowflake-Schema

Die Dimensionen werden zusätzlich **normalisiert**: `dim_produkt` verweist auf `dim_warengruppe`, diese auf `dim_kategorie`.

| | Star | Snowflake |
|---|---|---|
| Dimensionen | denormalisiert | normalisiert |
| Joins je Abfrage | wenige | mehr |
| Abfragegeschwindigkeit | höher | geringer |
| Speicherbedarf | höher | geringer |
| Verständlichkeit | hoch | mittel |
| Pflege bei Änderungen | aufwendiger | einfacher |

**Prüfungsantwort:** In der Praxis überwiegt das **Star-Schema**, weil Speicherplatz billig, Abfragegeschwindigkeit und Verständlichkeit dagegen wertvoll sind. Das Snowflake-Schema lohnt bei sehr großen Dimensionen mit häufig geänderten Hierarchien.

**Galaxy-Schema** (auch **Fact Constellation**): mehrere Faktentabellen teilen sich gemeinsame Dimensionen. Beispiel: `fakt_verkauf` und `fakt_lagerbestand` nutzen beide `dim_zeit` und `dim_produkt` – dadurch lassen sich Verkauf und Bestand je Artikel und Monat direkt gegenüberstellen. Voraussetzung sind einheitlich definierte, gemeinsam genutzte Dimensionen (**Conformed Dimensions**).

## 4.4 Historisierung: Slowly Changing Dimensions

Was passiert, wenn ein Kunde umzieht? Drei Standardstrategien:

| Typ | Vorgehen | Folge |
|---|---|---|
| **SCD Typ 1** | alten Wert **überschreiben** | keine Historie; alte Auswertungen ändern sich rückwirkend |
| **SCD Typ 2** | **neue Zeile** anlegen mit Gültigkeitszeitraum | vollständige Historie; die Dimension wächst |
| **SCD Typ 3** | zusätzliche Spalte „vorheriger Wert" | nur der letzte Stand bleibt erhalten |

Weitere Typen (seltener gefragt, Systematik nach Kimball): **Typ 0** – Wert bleibt immer der ursprüngliche, Änderungen werden ignoriert (z. B. Geburtsdatum, Erstkaufdatum) · **Typ 4** – schnell wechselnde Merkmale werden in eine eigene Tabelle ausgelagert (Kimball: Mini-Dimension; in deutscher Literatur oft: aktuelle Tabelle plus separate Historientabelle) · **Typ 6** – Kombination aus 1 + 2 + 3 (= 6): neue Zeile je Änderung **und** eine Spalte mit dem aktuellen Wert, die in allen Versionen überschrieben wird. Typ 5 und Typ 7 sind weitere Kombinationen.

**SCD Typ 2 im Detail** – der Standardfall und häufigster Prüfungsstoff:

| kunde_sk | kunde_id | name | ort | gültig_von | gültig_bis | aktuell |
|---|---|---|---|---|---|---|
| 1 | K-1001 | Huber GmbH | München | 01.01.2024 | 14.05.2026 | nein |
| 2 | K-1001 | Huber GmbH | Hamburg | 15.05.2026 | 31.12.9999 | ja |

Der **Surrogatschlüssel** (kunde_sk) ist ein künstlicher, im DWH vergebener Schlüssel. Er ist nötig, weil der fachliche Schlüssel K-1001 nun mehrfach vorkommt. Fakten aus der Zeit vor dem Umzug verweisen auf kunde_sk = 1 und bleiben damit korrekt der Region München zugeordnet – genau das ist der Zweck der Historisierung.

> ❓ **Prüferfrage:** Warum verwendet man im DWH Surrogatschlüssel statt der Schlüssel aus dem Quellsystem?
> *Weil ein fachlicher Schlüssel bei Typ-2-Historisierung mehrfach auftritt und dann nicht mehr eindeutig identifiziert. Zusätzlich macht der Surrogatschlüssel das DWH unabhängig von Schlüsseländerungen oder Formatunterschieden der Quellsysteme und ermöglicht die Integration mehrerer Quellen mit unterschiedlichen Nummernkreisen.*

## 4.5 OLAP-Operationen

| Operation | Bedeutung | Beispiel |
|---|---|---|
| **Drill-down** | feinere Detailstufe | Jahr → Quartal → Monat |
| **Roll-up** | gröbere Detailstufe | Filiale → Region → Land |
| **Slice** | eine Dimension auf **einen** Wert festlegen | nur Quartal 2/2026 |
| **Dice** | mehrere Dimensionen auf **Bereiche** einschränken | Kategorie Möbel **und** Region Nord **und** 1. Halbjahr |
| **Pivot / Rotate** | Achsen vertauschen | Produkte in Zeilen statt Spalten |

Roll-up heißt auch **Drill-up** (Verdichten). Merkhilfe Slice/Dice: Slice schneidet eine Scheibe aus dem Würfel (eine Dimension fest auf einen Wert), Dice einen Teilwürfel (Einschränkung in mehreren Dimensionen). Technisch wird ein OLAP-Würfel entweder relational auf dem Star-Schema abgebildet (**ROLAP**), in einer eigenen multidimensionalen Speicherstruktur vorberechnet (**MOLAP**, sehr schnell, aber speicherintensiv) oder gemischt (**HOLAP**).

---

# Teil 5 – Data Lake und Big Data

## 5.1 Data Lake vs. Data Warehouse

| | Data Warehouse | Data Lake |
|---|---|---|
| Daten | strukturiert, aufbereitet | roh, alle Formate (auch Bilder, Logs, Sensordaten) |
| Schema | **Schema-on-Write** (vor dem Laden festgelegt) | **Schema-on-Read** (erst bei der Auswertung) |
| Nutzer | Fachbereich, Controlling | Data Scientists |
| Stärke | verlässliche, geprüfte Kennzahlen | Flexibilität, auch für später unbekannte Fragen |
| Risiko | unflexibel bei neuen Anforderungen | **Data Swamp** – ohne Katalog und Governance wird der See unbrauchbar |

Der Begriff **Lakehouse** bezeichnet Ansätze, die Flexibilität des Data Lake mit den Struktur- und Qualitätsgarantien des DWH verbinden. Technisch liegen die Daten in günstigem Objektspeicher in offenen Dateiformaten (z. B. Parquet); ein Tabellenformat wie Delta Lake oder Apache Iceberg ergänzt Transaktionen (ACID), Schemaprüfung und Versionierung. Häufig werden die Daten dabei in Stufen veredelt: Rohdaten → bereinigt → auswertungsfertig (oft „Bronze/Silver/Gold" genannt) – das entspricht der Idee Staging → Core → Data Mart.

## 5.2 Die 5 V von Big Data

| V | Bedeutung | Beispiel Möbelhaus |
|---|---|---|
| **Volume** | Datenmenge | Millionen Kassenbons und Klickdaten |
| **Velocity** | Geschwindigkeit von Entstehung und Verarbeitung | Live-Bestandsdaten der Filialen |
| **Variety** | Vielfalt der Formate | Tabellen, Bilder, Bewertungstexte, Sensordaten |
| **Veracity** | Verlässlichkeit / Wahrhaftigkeit | Bewertungstexte unklarer Herkunft, fehlerhafte Sensorwerte |
| **Value** | Wertschöpfung aus den Daten | konkreter Nutzen – ohne ihn ist der Rest Selbstzweck |

Ursprünglich wurden nur die 3 V Volume, Velocity und Variety genannt (Doug Laney, 2001); Veracity und Value kamen später hinzu. Manche Quellen erweitern auf noch mehr V (z. B. Variability, Visualization) – in der Prüfung sind die 3 bzw. 5 V gängig.

**Batch- oder Streamverarbeitung?** Batch verarbeitet Daten gesammelt in festen Intervallen (nächtlicher DWH-Lauf) – einfach und robust. Streaming verarbeitet fortlaufend (Betrugserkennung, Bestandswarnung) – aufwendiger, aber nahezu in Echtzeit. Die Wahl richtet sich nach der Frage: **Wie aktuell muss die Information sein, damit die Entscheidung noch etwas nützt?**

Werkzeuge für Big Data: Wenn ein einzelner Server nicht mehr reicht, wird die Arbeit auf viele Rechner verteilt. **Apache Hadoop** speichert große Dateien verteilt (HDFS) und verarbeitet sie parallel nach dem Prinzip **MapReduce**: Jeder Knoten verarbeitet seine lokal gespeicherten Datenblöcke und erzeugt Schlüssel-Wert-Paare (Map), diese werden nach Schlüssel gruppiert (Shuffle) und je Schlüssel zum Teilergebnis zusammengefasst (Reduce) – z. B. Map: je Kassenbon „Filiale → Umsatz", Reduce: Summe je Filiale. Grundidee: Die Berechnung wandert zu den Daten, nicht umgekehrt. **Apache Spark** arbeitet nach demselben Grundgedanken, hält Zwischenergebnisse aber im **Arbeitsspeicher** statt sie nach jedem Schritt auf die Festplatte zu schreiben, und ist dadurch deutlich schneller – auch für SQL, Streaming und Machine Learning. Prüfungsrelevant ist nicht die Bedienung, sondern das Prinzip: **horizontale Skalierung** (Scale-out: mehr Rechner) durch Verteilung von Speicherung und Berechnung – im Gegensatz zur vertikalen Skalierung (Scale-up: stärkerer Einzelserver). Für verteilte Datenhaltung gilt das **CAP-Theorem** (→ Deep Dive 15): Bei einer Netzwerkstörung muss zwischen Konsistenz und Verfügbarkeit gewählt werden.

## 5.3 Partitionierung und spaltenorientierte Speicherung

Große Faktentabellen werden **partitioniert**: physisch in Teile zerlegt, die logisch eine Tabelle bleiben.
- **Horizontale Partitionierung** (zeilenweise): nach Bereich (Range, z. B. je Monat), nach Liste (z. B. je Region) oder per Hash-Funktion (gleichmäßige Verteilung). Verteilt man die Partitionen auf mehrere Server, spricht man von **Sharding**.
- **Vertikale Partitionierung** (spaltenweise): selten genutzte oder große Spalten werden in eine eigene Tabelle ausgelagert.

Nutzen: Abfragen mit Filter auf das Partitionskriterium lesen nur die betroffenen Partitionen (**Partition Pruning**), alte Daten lassen sich als ganze Partition archivieren oder löschen, und Ladeläufe betreffen nur die aktuelle Partition.

**Spaltenorientierte Speicherung** (Column Store, z. B. Dateiformat Parquet): Die Werte einer Spalte liegen zusammen. Analytische Abfragen lesen nur die benötigten Spalten und lassen sich stark komprimieren – ideal für OLAP. Zeilenorientierte Speicherung (Row Store) bleibt für OLTP besser, weil dort ganze Datensätze gelesen und geschrieben werden.

> ❓ **Prüferfrage:** Warum partitioniert man eine große Faktentabelle typischerweise nach dem Datum?
> *Weil fast alle Auswertungen einen Zeitraum filtern und dann nur die betroffenen Partitionen gelesen werden (Partition Pruning). Zusätzlich lädt der tägliche Lauf nur in die aktuelle Partition, und Daten außerhalb der Aufbewahrungsfrist lassen sich als ganze Partition archivieren oder löschen, ohne die übrige Tabelle zu belasten.*

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Kennzahlen in die Dimensionstabelle und beschreibende Merkmale in die Faktentabelle gelegt.
2. Faktentabelle ohne Fremdschlüssel zu allen Dimensionen modelliert.
3. Star und Snowflake verwechselt oder ohne Nennung des Unterschieds beim Normalisierungsgrad.
4. Behauptet, das Analysemodell (Star-Schema, Data Mart) sei normalisiert – Denormalisierung ist dort gerade der Zweck. (Nur das Core-DWH nach Inmon ist bewusst normalisiert.)
5. Historisierung nicht erwähnt, obwohl die Aufgabe nach Zeitvergleichen fragt.
6. Surrogatschlüssel und fachlichen Schlüssel gleichgesetzt.
7. Bei ETL nur „Daten kopieren" beschrieben, ohne Bereinigung und Vereinheitlichung.
8. Bei den 5 V „Value" vergessen – gerade dieses V ist das prüfungsrelevante.

---

# Übungsklausur Data Warehouse & Big Data (100 Punkte, 90 Minuten)

Bearbeite die Klausur **am Ende des Themas** am Stück, handschriftlich.

## Ausgangslage

Die Möbelhaus Nordholz GmbH betreibt acht Filialen und führt rund 500 Artikel. Die Geschäftsführung möchte Umsätze nach Zeitraum, Artikel, Kunde und Filiale auswerten und Vorjahresvergleiche über drei Jahre ziehen. Die Daten liegen in der operativen Datenbank sowie in einem separaten CRM-System.

## Block A – OLTP und OLAP (18 P)

**A1 (10 P):** *Grenzen* Sie OLTP- und OLAP-Systeme anhand von **fünf** Kriterien *ab*. *Stellen* Sie die Antwort tabellarisch dar.

**A2 (8 P):** Ein Kollege schlägt vor, die Auswertungen direkt auf der operativen Datenbank durchzuführen: „Die Daten sind doch schon da." *Beurteilen* Sie den Vorschlag und *nennen* Sie drei fachliche Gründe, die dagegen sprechen.

## Block B – Architektur und ETL (24 P)

**B1 (8 P):** *Beschreiben* Sie die drei Phasen des ETL-Prozesses und *nennen* Sie für die Transformationsphase vier typische Aufgaben.

**B2 (6 P):** *Erläutern* Sie den Zweck einer Staging Area und den Unterschied zwischen Voll- und Deltaextraktion.

**B3 (6 P):** Im Ladelauf werden 12 von 8.400 Datensätzen wegen fehlender Kundennummer abgewiesen. Ein Kollege möchte diese Sätze automatisch verwerfen. *Beurteilen* Sie das und *beschreiben* Sie ein besseres Vorgehen.

**B4 (4 P):** *Grenzen* Sie ETL und ELT *ab* und *nennen* Sie je einen typischen Einsatzfall.

## Block C – Sternschema entwerfen (30 P)

**C1 (16 P):** *Entwerfen* Sie ein Star-Schema für die beschriebene Umsatzauswertung. *Benennen* Sie die Faktentabelle mit mindestens zwei Kennzahlen sowie vier Dimensionstabellen mit je mindestens drei Attributen. *Kennzeichnen* Sie Primär- und Fremdschlüssel.

**C2 (6 P):** *Erläutern* Sie den Begriff **Granularität** und *legen* Sie für Ihr Schema eine geeignete Granularität *fest*. *Begründen* Sie Ihre Wahl.

**C3 (8 P):** *Vergleichen* Sie Star- und Snowflake-Schema anhand von vier Kriterien und *sprechen* Sie eine begründete Empfehlung für dieses Projekt *aus*.

## Block D – Historisierung (16 P)

**D1 (6 P):** Kundin „Huber GmbH" (K-1001) zieht am 15.05.2026 von München nach Hamburg. *Erläutern* Sie, welches Problem entsteht, wenn die Adresse in der Dimensionstabelle einfach überschrieben wird.

**D2 (6 P):** *Stellen* Sie dar, wie der Datensatz nach SCD Typ 2 gespeichert wird. *Verwenden* Sie eine Tabelle mit den erforderlichen Zusatzspalten.

**D3 (4 P):** *Erläutern* Sie, warum bei SCD Typ 2 ein Surrogatschlüssel erforderlich ist.

## Block E – Big Data und OLAP-Operationen (12 P)

**E1 (5 P):** *Nennen* Sie die fünf V von Big Data und *ordnen* Sie jedem ein Beispiel aus dem Möbelhaus zu.

**E2 (4 P):** *Ordnen* Sie den folgenden Auswertungswünschen die passende OLAP-Operation zu:
(a) „Zeig mir das Jahresergebnis aufgeschlüsselt nach Quartalen." (b) „Nur die Filialen der Region Nord." (c) „Kategorien in die Zeilen, Monate in die Spalten." (d) „Fasse die Filialumsätze zu Regionsumsätzen zusammen."

**E3 (3 P):** *Erläutern* Sie den Unterschied zwischen Batch- und Streamverarbeitung und *nennen* Sie je einen passenden Anwendungsfall.

---

## Fachgespräch: typische Fragen des Ausschusses

1. „Woher stammten die Daten für Ihr Projekt, und wie haben Sie sie zusammengeführt?"
2. „Welche Transformationsschritte waren nötig – und welcher hat die meiste Zeit gekostet?"
3. „Wie stellen Sie sicher, dass Ihre Auswertung morgen dieselben Zahlen liefert wie heute?"
4. „Haben Sie Ihre Daten historisiert? Was wäre passiert, wenn nicht?"
5. „Wie oft müssen Ihre Daten aktualisiert werden – und woraus haben Sie diese Frequenz abgeleitet?"

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich grenze OLTP und OLAP anhand von mindestens fünf Kriterien ab.
- [ ] Ich nenne drei Gründe gegen Auswertungen direkt im operativen System.
- [ ] Ich beschreibe ETL vollständig und nenne vier Transformationsaufgaben.
- [ ] Ich kenne Zweck von Staging Area, Core-DWH und Data Mart.
- [ ] Ich entwerfe ein Star-Schema mit Fakten- und Dimensionstabellen und setze die Schlüssel richtig.
- [ ] Ich erkläre Granularität und die drei Kennzahlentypen.
- [ ] Ich stelle SCD Typ 2 mit Gültigkeitszeitraum und Surrogatschlüssel dar.
- [ ] Ich nenne die 5 V und ordne die OLAP-Operationen sicher zu.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
- [ ] Ich grenze Inmon und Kimball ab und erkläre Galaxy-Schema, Partitionierung und MapReduce.
