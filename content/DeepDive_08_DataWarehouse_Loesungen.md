# Musterlösungen Übungsklausur Data Warehouse & Big Data (Deep Dive 8)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Block C (Schemaentwurf, 30 P) ist der Schwerpunkt – dort entscheidet sich die Note. Bei Modellierungsaufgaben zählt jedes geforderte Element einzeln. 92+ P = sehr gut.

---

## Block A – OLTP, OLAP und Big Data (26 P)

**A1 (10 P):** *(je Kriterium 2 P – fünf genügen)*

| Kriterium | OLTP | OLAP |
|---|---|---|
| Zweck | Abwicklung des Tagesgeschäfts | Entscheidungsunterstützung, Analyse |
| Zugriffsart | viele kurze Lese- und Schreibvorgänge | wenige, komplexe Leseabfragen |
| Datenmodell | normalisiert (3. NF) | denormalisiert (Star-/Snowflake-Schema) |
| Datenbestand | aktuell, detailliert, wird überschrieben | historisiert, oft aggregiert, beständig |
| Zeithorizont | Gegenwart | mehrere Jahre |
| Nutzergruppe | Sachbearbeitung | Controlling, Management |
| Optimierungsziel | Schreibgeschwindigkeit, Konsistenz | Lesegeschwindigkeit, Verständlichkeit |

**A2 (8 P):**
Der Vorschlag ist **abzulehnen**. *(2 P)* Drei Gründe *(je 2 P)*:
1. **Systemlast:** Komplexe Auswertungen über große Zeiträume erzeugen lange Sperren und hohe Last; das operative Tagesgeschäft – Auftragserfassung, Kassenvorgänge – wird spürbar verlangsamt.
2. **Fehlende Historie:** Das operative System überschreibt Änderungen. Zieht ein Kunde um, erscheinen auch seine alten Umsätze rückwirkend unter der neuen Adresse. Die geforderten Dreijahresvergleiche wären damit fachlich falsch.
3. **Verteilte Quellen:** Die Daten liegen zusätzlich im CRM-System. Ohne Integration und Vereinheitlichung von Schlüsseln, Formaten und Bezeichnungen lassen sich beide Bestände nicht gemeinsam auswerten.

*Ebenfalls anerkannt: ungeeignetes Datenmodell (Normalisierung erzwingt viele Joins), fehlende Aggregationen, unklare Berechtigungssteuerung für Auswertende.*

**A3 (5 P):** *(je 1 P)*

| V | Beispiel aus dem Möbelhaus |
|---|---|
| Volume | Millionen Kassenbons und Klickdaten des Onlineshops über mehrere Jahre |
| Velocity | laufend eingehende Bestands- und Kassendaten der acht Filialen, teils in Echtzeit |
| Variety | strukturierte Verkaufsdaten, Bewertungstexte, Produktbilder, Sensordaten aus dem Lager |
| Veracity | Verlässlichkeit, etwa bei Kundenbewertungen unklarer Herkunft oder fehlerhaften Sensorwerten |
| Value | konkreter Nutzen, z. B. eine belastbare Sortimentsentscheidung – ohne Wertschöpfung bleibt der Aufwand Selbstzweck |

**A4 (3 P):**
**Batchverarbeitung** sammelt Daten und verarbeitet sie gebündelt in festen Intervallen – etwa der nächtliche DWH-Ladelauf für die Umsatzberichte. Sie ist einfach, robust und ressourcenschonend, liefert aber keine aktuellen Werte. *(1,5 P)*
**Streamverarbeitung** verarbeitet Daten fortlaufend bei ihrem Entstehen – etwa eine sofortige Bestandswarnung bei Unterschreiten des Meldebestands oder Betrugserkennung im Zahlungsverkehr. Sie ist technisch aufwendiger, ermöglicht aber Reaktionen nahezu in Echtzeit. *(1,5 P)*

---

## Block B – Architektur und ETL (24 P)

**B1 (8 P):**
- **Extract:** Daten aus den Quellsystemen auslesen – hier operative Datenbank und CRM –, üblicherweise nachts, um die Quellen zu entlasten. *(1,5 P)*
- **Transform:** Daten analysefähig aufbereiten. *(1,5 P)*
- **Load:** Aufbereitete Daten in das Zielsystem laden, mit Ladeprotokoll und Fehlerbehandlung. *(1 P)*

Vier Transformationsaufgaben *(je 1 P)*: Bereinigen (fehlende Werte, Dubletten) · Vereinheitlichen von Formaten (Datum, Währung, Schreibweisen) · Harmonisieren der Schlüssel aus verschiedenen Quellsystemen · Anreichern durch berechnete Merkmale · Aggregieren · Validieren gegen Regelwerke.

**B2 (6 P):**
**Staging Area:** Zwischenspeicher für die unveränderten Rohdaten. Zweck: Die Quellsysteme werden schnell wieder freigegeben, und bei einem Fehler im weiteren Verlauf kann aus der Staging Area nachgeladen werden, ohne die Quelle erneut zu belasten. Zusätzlich lassen sich Quelldaten und Ergebnis abstimmen. *(3 P)*
**Voll- vs. Deltaextraktion:** Die Vollextraktion liest jedes Mal den kompletten Bestand – einfach, aber langsam und ressourcenintensiv. Die Deltaextraktion überträgt nur die seit dem letzten Lauf geänderten oder neuen Sätze – deutlich schneller, setzt jedoch Zeitstempel oder Änderungskennzeichen im Quellsystem voraus. *(3 P)*

**B3 (6 P):**
Das automatische Verwerfen ist **abzulehnen**. Die 12 Datensätze verschwinden unbemerkt; niemand kann die Ursache im Quellsystem beheben, und die Summen im DWH weichen unerklärt von der Quelle ab. Bei wiederkehrenden Läufen summiert sich der Verlust und verfälscht Auswertungen systematisch. *(3 P)*

Besseres Vorgehen *(3 P)*: Die fehlerhaften Sätze werden in einen **Quarantänebereich** ausgeleitet und in einem **Fehlerprotokoll** mit Regelverstoß und Zeitpunkt erfasst. Ein benannter Verantwortlicher klärt die Fälle und lädt sie nach der Korrektur nach. Zusätzlich wird im **Ladeprotokoll** festgehalten, wie viele Sätze gelesen, geladen und abgewiesen wurden, sodass die Differenz jederzeit erklärbar ist. Mittelfristig ist die Ursache im Quellsystem zu beheben – etwa durch ein Pflichtfeld für die Kundennummer.

**B4 (4 P):**
**ETL** transformiert vor dem Laden; nur geprüfte Daten gelangen ins Ziel. Typischer Einsatzfall: klassisches Data Warehouse mit festen, bekannten Auswertungen. *(2 P)*
**ELT** lädt zuerst die Rohdaten und transformiert im Zielsystem. Typischer Einsatzfall: Data Lake oder Cloud-Plattform, bei denen die Rohdaten für später noch unbekannte Fragestellungen erhalten bleiben sollen. *(2 P)*

---

## Block C – Sternschema entwerfen (30 P)

**C1 (16 P):**
**Faktentabelle fakt_verkauf**
| Spalte | Art |
|---|---|
| zeit_id | FK → dim_zeit |
| produkt_id | FK → dim_produkt |
| kunde_sk | FK → dim_kunde |
| filial_id | FK → dim_filiale |
| menge | Kennzahl |
| umsatz | Kennzahl |
| *(rabatt / deckungsbeitrag)* | Kennzahl (optional) |

**Dimensionstabellen**
- **dim_zeit**(**zeit_id** PK, datum, tag, monat, quartal, jahr, kalenderwoche)
- **dim_produkt**(**produkt_id** PK, bezeichnung, kategorie, warengruppe, lieferant)
- **dim_kunde**(**kunde_sk** PK, kunde_id, name, ort, plz, region, segment)
- **dim_filiale**(**filial_id** PK, filialname, stadt, region, land, verkaufsfläche)

*Prüferkommentar: 6 P Faktentabelle (2 P Kennzahlen, 4 P vollständige Fremdschlüssel zu allen vier Dimensionen) · 8 P Dimensionen (je 2 P mit mindestens drei Attributen) · 2 P korrekte PK/FK-Kennzeichnung.*

**Die zwei häufigsten Fehler:** Beschreibende Merkmale wie „kategorie" landen in der Faktentabelle – sie gehören in die Dimension. Oder Kennzahlen wie „umsatz" werden in eine Dimension gelegt – sie gehören in die Faktentabelle. Faustregel: **Was man summiert, ist ein Fakt; wonach man gruppiert, ist eine Dimension.**

**C2 (6 P):**
**Granularität** bezeichnet die feinste Detailstufe, auf der die Faktentabelle Daten speichert – also, wofür genau eine Zeile steht. *(2 P)*

Festlegung: **eine Zeile je Bestellposition** (Artikel innerhalb eines Verkaufsvorgangs). *(2 P)*

Begründung: Diese Granularität erlaubt Auswertungen bis auf Artikelebene, wie sie für die Produktdimension gefordert sind. Gröbere Alternativen (eine Zeile je Bestellung oder je Tag und Filiale) würden Artikelauswertungen unmöglich machen – und nachträglich lässt sich Detailtiefe nicht wiederherstellen. Aggregationen auf Tages-, Monats- oder Filialebene sind aus feineren Daten dagegen jederzeit berechenbar. *(2 P)*

*Prüferkommentar: Der Satz „Detailtiefe kann man aggregieren, aber nicht rekonstruieren" ist der Kern der Begründung und sichert den dritten Teilpunkt.*

**C3 (8 P):** *(je Kriterium 1,5 P, max. 6 P, plus 2 P Empfehlung)*

| Kriterium | Star | Snowflake |
|---|---|---|
| Normalisierungsgrad der Dimensionen | denormalisiert | normalisiert |
| Anzahl Joins je Abfrage | wenige | mehr |
| Abfragegeschwindigkeit | höher | geringer |
| Speicherbedarf | höher (Redundanz) | geringer |
| Verständlichkeit für Fachanwender | hoch | mittel |

Empfehlung: **Star-Schema.** Bei 500 Artikeln und acht Filialen sind die Dimensionen sehr klein; der Speichervorteil des Snowflake-Schemas wäre vernachlässigbar, während der Nachteil zusätzlicher Joins die Abfragen unnötig verlangsamt und das Modell für die Fachanwender schwerer lesbar macht.

---

## Block D – Historisierung und OLAP-Operationen (20 P)

**D1 (6 P):**
Wird die Adresse überschrieben, gilt für **alle** Fakten – auch für die vor dem Umzug entstandenen – rückwirkend der Ort Hamburg. *(3 P)*
Folgen: Vergangene Umsätze werden fälschlich der Region Nord statt Süd zugeordnet; der geforderte Dreijahresvergleich nach Regionen wird verfälscht. Zudem verändern sich bereits berichtete Zahlen nachträglich, sodass ein heute erstellter Bericht nicht mehr mit dem Bericht des Vorjahres übereinstimmt – die Nachvollziehbarkeit geht verloren. *(3 P)*

**D2 (6 P):**
| kunde_sk | kunde_id | name | ort | gültig_von | gültig_bis | aktuell |
|---|---|---|---|---|---|---|
| 1 | K-1001 | Huber GmbH | München | 01.01.2024 | 14.05.2026 | nein |
| 2 | K-1001 | Huber GmbH | Hamburg | 15.05.2026 | 31.12.9999 | ja |

Vorgehen: Der bestehende Satz wird **nicht** verändert, sondern durch Setzen von `gültig_bis` auf den Tag vor der Änderung und `aktuell = nein` abgeschlossen. Ergänzt wird eine **neue Zeile** mit neuem Surrogatschlüssel, dem neuen Ort, `gültig_von` = Änderungsdatum, offenem `gültig_bis` und `aktuell = ja`.

*Prüferkommentar: 3 P Tabellenstruktur mit Gültigkeitsspalten, 2 P korrekte Datumsgrenzen (lückenlos und überschneidungsfrei), 1 P Aktuell-Kennzeichen. Häufiger Fehler: Beide Zeilen tragen dasselbe gültig_von oder überlappen sich.*

**D3 (4 P):**
Bei Typ-2-Historisierung kommt der fachliche Schlüssel K-1001 mehrfach vor und identifiziert eine Zeile daher nicht mehr eindeutig – er kann kein Primärschlüssel mehr sein. Der **Surrogatschlüssel** ist ein künstlicher, im DWH vergebener Schlüssel, der jede Version eindeutig identifiziert. *(2 P)*
Nur so lassen sich Fakten der jeweils **zum Zeitpunkt gültigen** Version zuordnen: Verkäufe vor dem Umzug verweisen auf kunde_sk = 1 und bleiben damit korrekt München zugeordnet. Zusätzlich macht der Surrogatschlüssel das DWH unabhängig von Schlüsselformaten und Nummernkreisen der verschiedenen Quellsysteme. *(2 P)*

**D4 (4 P):** *(je 1 P)*
| Auswertungswunsch | OLAP-Operation |
|---|---|
| (a) „Zeig mir das Jahresergebnis aufgeschlüsselt nach Quartalen." | Drill-down |
| (b) „Nur die Filialen der Region Nord." | Slice |
| (c) „Kategorien in die Zeilen, Monate in die Spalten." | Pivot (Rotate) |
| (d) „Fasse die Filialumsätze zu Regionsumsätzen zusammen." | Roll-up |

*Prüferkommentar zu (b): Slice, weil genau eine Dimension (Filiale/Ort, Hierarchieebene Region) auf einen einzigen Wert festgelegt wird. Dice wäre es erst, wenn zusätzlich eine weitere Dimension eingeschränkt würde (z. B. Region Nord und 1. Halbjahr).*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Star-Schema alle zwei Wochen einmal aus dem Kopf zeichnen |
| 81–91 | gut | Prüfe, ob die Punkte im Entwurf (C) oder in den Erläuterungen fehlten |
| < 81 | | Teil 4 wiederholen, ein Star-Schema für einen anderen Geschäftsvorfall entwerfen |

**Übertrag auf dein Projekt:** Wenn du im Fachgespräch gefragt wirst, wie du deine Daten aufbereitet hast, ist die Antwort fast immer eine ETL-Beschreibung – auch wenn dein „ETL" nur ein Python-Skript war. Nenne die drei Phasen ausdrücklich beim Namen, beschreibe deine Transformationsschritte und erwähne, wie du fehlerhafte Sätze behandelt hast. Das klingt sofort professionell und ist inhaltlich exakt richtig.
