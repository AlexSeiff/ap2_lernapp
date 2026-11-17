<!-- Begriffsseiten D · Stand 2026-10 -->
## Daily Scrum
<!-- id: daily-scrum · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Tägliches, auf 15 Minuten begrenztes Scrum-Event der Developers, in dem sie den Fortschritt zum Sprint-Ziel prüfen und den nächsten Arbeitstag planen.

### Erklärung
Das Daily Scrum findet jeden Arbeitstag des Sprints zur gleichen Zeit am gleichen Ort statt, um Komplexität zu senken. Teilnehmer sind die **Developers**; Product Owner und Scrum Master nehmen nur teil, wenn sie selbst aktiv an Sprint-Backlog-Einträgen arbeiten. Die Developers wählen Ablauf und Technik frei – die drei Standardfragen („Was habe ich gestern geschafft, was mache ich heute, was hindert mich?“) sind seit dem Scrum Guide 2020 nicht mehr vorgeschrieben. Ergebnis ist ein angepasster Plan für den Tag; Hindernisse werden sichtbar und im Anschluss gelöst.

### Beispiel
Im Reporting-Projekt der Möbelhaus Nordholz GmbH stellt ein Developer fest, dass die CRM-Schnittstelle noch keine Testdaten liefert. Im Daily Scrum wird das als Hindernis benannt; die Klärung mit der IT findet danach statt, nicht im Meeting.

### Abgrenzung
| Event | Zweck | Timebox (Ein-Monats-Sprint) |
|---|---|---|
| Daily Scrum | Tagesplanung, Fortschritt zum Sprint-Ziel | 15 Minuten |
| Sprint Review | Ergebnis mit Stakeholdern prüfen | max. 4 Stunden |
| Sprint-Retrospektive | Zusammenarbeit und Prozess verbessern | max. 3 Stunden |

### Prüfungsfalle
Das Daily Scrum ist kein Statusbericht an den Scrum Master oder Vorgesetzten, sondern ein Planungstreffen der Developers.

### Merksatz
15 Minuten, jeden Tag, von Developers für Developers.

Siehe auch: Scrum · Developers · Sprint · Events · Scrum Master
Mehr: Deep Dive 12, Teil 2

## DAMA-DMBOK
<!-- id: dama-dmbok · quellen: DD9 Teil 1 · stand: 2026-10 -->

Leitfaden der Data Management Association (DAMA) zum gesamten Datenmanagement („Data Management Body of Knowledge“); Datenqualität ist dort eines von mehreren Wissensgebieten.

### Erklärung
Das DMBOK beschreibt in Wissensgebieten, was zu professionellem Datenmanagement gehört, u. a. **Data Governance** (als Zentrum), Datenqualität, Stammdaten- und Referenzdatenmanagement, Datenmodellierung, Datensicherheit, Data Warehousing und Metadatenmanagement. Es ist ein Referenzrahmen zum Zitieren und Orientieren, keine Norm und kein Zertifizierungsstandard für Unternehmen.

### Abgrenzung
| Referenz | Inhalt |
|---|---|
| DAMA-DMBOK | gesamtes Datenmanagement, Datenqualität als ein Gebiet |
| DGIQ-Modell | 15 IQ-Dimensionen der Datenqualität |
| ISO/IEC 25012 | genormtes Datenqualitätsmodell mit 15 Merkmalen |

### Prüfungsfalle
Wer DAMA-DMBOK als Datenqualitätsmodell mit Dimensionen beschreibt, verwechselt es mit DGIQ-Modell oder ISO/IEC 25012.

### Merksatz
DMBOK = Landkarte des ganzen Datenmanagements, Datenqualität ist nur ein Land darauf.

Siehe auch: DGIQ-Modell · ISO/IEC 25012 · Data Governance · Master Data Management
Mehr: Deep Dive 9, Teil 1

## Darlehensvertrag
<!-- id: darlehensvertrag · quellen: Karte DD14, DD14 2.4 · stand: 2026-10 -->

Vertrag, bei dem Geld (Gelddarlehen, § 488 BGB) oder vertretbare Sachen (Sachdarlehen, § 607 BGB) überlassen werden und in gleicher Art, Güte und Menge zurückzugeben sind.

### Erklärung
Der Darlehensnehmer wird Eigentümer des Geldes oder der Sachen und darf sie verbrauchen; zurückgegeben wird nicht dasselbe Stück, sondern Gleichwertiges. Beim Gelddarlehen schuldet er Rückzahlung und – falls vereinbart – Zinsen. Genau dieser Verbrauch unterscheidet das Darlehen von Miete und Leihe, bei denen genau die überlassene Sache zurückkommt.

### Beispiel
Die Möbelhaus Nordholz GmbH nimmt bei ihrer Bank 50.000 € auf und zahlt sie mit Zinsen in Raten zurück (Gelddarlehen). Leiht sich die Filiale Hamburg 20 Paletten von der Filiale Köln und gibt später 20 andere gleichwertige Paletten zurück, ist das ein Sachdarlehen.

### Abgrenzung
| Vertrag | Rückgabe | Entgelt |
|---|---|---|
| Darlehensvertrag | gleiche Art, Güte und Menge | Zinsen möglich |
| Mietvertrag | dieselbe Sache | ja |
| Leihvertrag | dieselbe Sache | nein |

### Prüfungsfalle
„Ich leihe mir 10 € von dir“ ist rechtlich kein Leihvertrag, sondern ein Darlehen – Geld wird ausgegeben, nicht dasselbe Stück zurückgegeben.

### Merksatz
Darlehen: verbrauchen erlaubt, Gleichwertiges zurück.

Siehe auch: Leihvertrag · Mietvertrag · Kaufvertrag · Pachtvertrag
Mehr: Deep Dive 14, 2.4

## Dashboard
<!-- id: dashboard · quellen: Karte DD11, DD11 A4 · stand: 2026-10 -->

Übersicht der wichtigsten Kennzahlen auf einer Sicht, zugeschnitten auf eine Zielgruppe und eine definierte Frage.

### Erklärung
Ein gutes Dashboard ist kein „Diagrammfriedhof“. Die Gestaltungsregeln: **Zielgruppe zuerst** (Geschäftsführung braucht verdichtete Kennzahlen mit Ampel, der Fachbereich Details und Filter), **Vergleichsmaßstab** zu jeder Zahl (Vorperiode, Plan, Ziel), **wenige Kennzahlen** (Faustregel fünf bis sieben je Sicht), das Wichtigste links oben, **einheitliche Skalen** bei nebeneinanderliegenden Diagrammen und ein **Aktualitätsstempel** („Daten geladen am …“).

### Beispiel
Das Filial-Dashboard der Möbelhaus Nordholz GmbH zeigt Umsatz, Deckungsbeitrag, Termintreue und Reklamationsquote je Filiale, jeweils mit Vorjahreswert und Ampel, oben rechts „Stand: 06.10.2026, 06:00 Uhr“.

### Abgrenzung
Ein **Bericht** (Report) ist meist statisch und ausführlich, ein Dashboard verdichtet und wird laufend aktualisiert. Eine einzelne Grafik beantwortet eine Frage, ein Dashboard die Steuerungsfragen einer Zielgruppe.

### Prüfungsfalle
Kennzahlen ohne Vergleichswert („Umsatz 1,2 Mio. €“) sind keine Information – in Beurteilungsaufgaben den fehlenden Bezug immer beanstanden.

### Merksatz
Eine Zielgruppe, eine Frage, wenige Zahlen – jede mit Vergleich und Datum.

Siehe auch: KPI · Einheitliche Skalen · Aktualitätsstempel · Vergleichsmaßstab mitliefern · Wenige Kennzahlen
Mehr: Deep Dive 11, A4

## Data Catalog
<!-- id: data-catalog · quellen: DD8 5.1, DD8 3.3 · stand: 2026-11 -->

Auch: Datenkatalog

Durchsuchbares Verzeichnis der Datenbestände eines Unternehmens, das zu jedem Datensatz die Metadaten bündelt: Bedeutung, Herkunft, Verantwortliche, Qualität und Zugriffsregeln.

### Erklärung
Ein Katalog speichert nicht die Daten selbst, sondern die **Metadaten** darüber. Er macht Daten auffindbar („Gibt es schon eine Retourenquote?“), schafft Vertrauen durch Definition und Verantwortlichen und beugt dem **Data Swamp** vor. Typische Inhalte: fachliche Beschreibung und Kennzahlendefinition, Data Owner, Aktualisierungsrhythmus, Schutzklasse oder Kennzeichen „enthält personenbezogene Daten“, Qualitätskennzahlen und die Data Lineage. Ein **Data Dictionary** ist enger gefasst: die technische Beschreibung der Tabellen und Spalten einer einzelnen Datenbank. Ein Katalog muss gepflegt werden – ein veralteter Katalog ist schlimmer als keiner.

### Beispiel
Die Analystin der Möbelhaus Nordholz GmbH sucht „Retourenquote“. Der Katalog zeigt: Definition (Retouren geteilt durch Lieferungen), Data Owner Vertrieb, Quelle Warenwirtschaft, täglich 03:00 Uhr aktualisiert, Schutzklasse „intern“, keine personenbezogenen Daten. So rechnet nicht jede Abteilung ihre eigene Version.

### Abgrenzung
| Begriff | Fokus |
|---|---|
| Metadaten | die Informationen über Daten selbst |
| Data Catalog | das durchsuchbare Verzeichnis dieser Metadaten |
| Data Lineage | Herkunft und Weg der Daten (eine Metadatenart im Katalog) |
| Data Governance | Regeln und Rollen, die der Katalog sichtbar macht |

### Prüfungsfalle
Den Katalog für ein Speichersystem halten, das die Daten enthält – er verweist nur auf sie.

### Merksatz
Der Katalog ist die Suchmaschine für Daten, nicht das Datenlager.

Siehe auch: Metadaten · Data Governance · Data Lineage · Data Lake · Datenqualität
Mehr: Deep Dive 8, 5.1

## Data Governance
<!-- id: data-governance · quellen: Karte DD9, DD9 5.2 · stand: 2026-10 -->

Organisatorischer Rahmen für den Umgang mit Daten: Rollen, Regeln, Verantwortlichkeiten und die Messung der Datenqualität.

### Erklärung
Data Governance legt fest, **wer** für welche Daten verantwortlich ist und **nach welchen Regeln** sie erfasst, gepflegt und genutzt werden. Typische Bausteine sind die Rollen **Data Owner** (fachlich verantwortlich, entscheidet) und **Data Steward** (operativ zuständig), verbindliche Erfassungsrichtlinien, regelmäßige Qualitätsmessung mit Schwellenwerten und Berichtsweg, ein führendes System je Stammdatenart (Master Data Management) und der Datenqualitätskreislauf statt Einmalaktionen.

### Beispiel
Bei der Möbelhaus Nordholz GmbH ist die Vertriebsleitung Data Owner der Kundendaten, eine Sachbearbeiterin Data Steward. Zielwert: Vollständigkeit der E-Mail-Adressen ≥ 90 %, monatliche Messung, Bericht an die Vertriebsleitung.

### Abgrenzung
Data Governance ist **organisatorisch** (wer, welche Regeln); technische Maßnahmen wie NOT NULL, CHECK oder Auswahllisten setzen diese Regeln nur um. Datenschutz ist ein Teilziel, nicht dasselbe.

### Prüfungsfalle
Datenqualität als reines IT-Thema behandeln und keine fachliche Zuständigkeit benennen – das kostet regelmäßig Punkte.

### Merksatz
Ohne Verantwortlichen bleibt jede Qualitätsregel Papier.

Siehe auch: Data Owner · Data Steward · Master Data Management · Datenqualitätskreislauf · Erfassungsrichtlinie
Mehr: Deep Dive 9, 5.2

## Data Lake
<!-- id: data-lake · quellen: Karte DD8, DD8 5.1 · stand: 2026-10 -->

Zentraler Speicher für große Mengen Rohdaten in beliebigen Formaten, deren Struktur erst bei der Auswertung festgelegt wird (Schema-on-Read).

### Erklärung
Im Data Lake landen Tabellen, Logdateien, Bilder, Texte und Sensordaten unverändert, meist in günstigem Objektspeicher. Weil die Rohdaten erhalten bleiben, lassen sich auch Fragen beantworten, die beim Laden noch niemand kannte – typisch für Data Scientists und ELT-Strecken. Ohne Katalog, Metadaten und Governance wird der See unübersichtlich und unbrauchbar: ein **Data Swamp**. Das **Lakehouse** verbindet die Flexibilität des Data Lake mit Qualitätsgarantien (ACID, Schemaprüfung) des Data Warehouse.

### Beispiel
Die Möbelhaus Nordholz GmbH speichert Klickdaten des Onlineshops, Kundenbewertungen und Kassenbons im Data Lake; das Controlling arbeitet weiter mit den geprüften Kennzahlen im Data Warehouse.

### Abgrenzung
| | Data Warehouse | Data Lake |
|---|---|---|
| Daten | strukturiert, aufbereitet | roh, alle Formate |
| Schema | Schema-on-Write | Schema-on-Read |
| Nutzer | Fachbereich, Controlling | Data Scientists |
| Risiko | unflexibel | Data Swamp |

### Prüfungsfalle
„Schema-on-Read“ heißt nicht „ohne Regeln“: Die Qualitätsprüfungen wandern nur von der Datenbank in die Auswertung bzw. die ETL/ELT-Strecke.

### Merksatz
Erst speichern, später verstehen – aber nur mit Katalog.

Siehe auch: Data Warehouse · Schema-on-Read · ELT · Lakehouse · Big Data
Mehr: Deep Dive 8, 5.1

## Data Leakage
<!-- id: data-leakage · quellen: DD6 Teil 5, DD7 1.1 · stand: 2026-11 -->

Datenleck beim Modellbau: Das Modell nutzt beim Training Informationen, die zum Zeitpunkt der echten Vorhersage nicht vorliegen würden oder aus den Testdaten stammen – die Testgüte fällt dadurch unrealistisch gut aus.

### Erklärung
Es gibt zwei Hauptformen. **Target Leakage:** Ein Merkmal enthält die Antwort oder entsteht erst nach dem vorherzusagenden Ereignis (z. B. „Gutschrift erstellt“ bei der Vorhersage von Reklamationen). **Train-Test-Kontamination:** Informationen aus den Testdaten fließen ins Training, etwa wenn Skalierungswerte (Minimum, Maximum, Mittelwert) aus allen Daten berechnet, Resampling oder SMOTE vor dem Split angewendet, Dubletten in beiden Mengen gelassen oder bei Zeitreihen zufällig statt chronologisch geteilt wird. Warnzeichen sind auffällig gute Kennzahlen (Recall nahe 100 %) und ein Einbruch im Betrieb. Die Prüffrage für jedes Merkmal lautet: War diese Information zum Entscheidungszeitpunkt bereits bekannt? Die richtige Reihenfolge ist: zuerst aufteilen. Skalierung und Kodierung werden nur aus den Trainingsdaten gelernt und dann unverändert auf die Testdaten angewendet. Resampling (Oversampling, SMOTE, Undersampling) verändert ausschließlich die Trainingsdaten – die Testdaten behalten ihre reale Klassenverteilung.

### Beispiel
Das Reklamationsmodell der Möbelhaus Nordholz GmbH soll bei Auftragsabschluss das Risiko vorhersagen. Unter den Merkmalen steckt „Gutschrift erstellt (ja/nein)“, das erst nach einer Reklamation gesetzt wird. Auf den 1.000 Testaufträgen (100 Reklamationen) findet das Modell alle: TP = 100, FN = 0, FP = 0, TN = 900, also $\text{Recall} = \frac{100}{100 + 0} = 100\ \%$ und $\text{Precision} = \frac{100}{100 + 0} = 100\ \%$. Im Betrieb ist das Merkmal bei Auftragsabschluss immer „nein“. Verlässt sich das Modell fast nur darauf, sagt es kaum noch „Reklamation“ voraus – im Extremfall TP = 0, FN = 100, Recall $= \frac{0}{0 + 100} = 0\ \%$, bei 90 % Accuracy. Das Ergebnis im Test war ein Trugbild.

### Abgrenzung
**Overfitting** zeigt sich schon im Test (große Lücke zu den Trainingsdaten); Data Leakage verdeckt sich im Test – dort sieht alles gut aus, der Fehler tritt erst im Betrieb auf. **Model Drift** entsteht später, weil sich die Realität ändert; Leakage ist von Anfang an ein Konstruktionsfehler.

### Prüfungsfalle
Eine sehr hohe Testgüte als Erfolg feiern, statt sie zu hinterfragen; oder Skalierungswerte vor dem Split aus allen Daten berechnen.

### Merksatz
Erst teilen, dann lernen – und nur Merkmale nutzen, die vorher bekannt sind.

Siehe auch: Train-Test-Split · Overfitting · Merkmale bilden · Zielvariable · Kreuzvalidierung · Model Drift
Mehr: Deep Dive 6, Teil 5 · Deep Dive 7, 1.1

## Data Lineage
<!-- id: data-lineage · quellen: DD8 3.3, DD8 5.1 · stand: 2026-11 -->

Auch: Datenherkunft

Nachverfolgung, woher Daten stammen, welche Transformationen sie durchlaufen haben und wohin sie fließen – von der Quelle bis zur Kennzahl im Bericht.

### Erklärung
Lineage dokumentiert den Weg Quelle → Transformationsschritte → Ziel, im besten Fall bis auf Spaltenebene. Nutzen:
- **Fehlersuche:** Von einer falschen Kennzahl rückwärts bis zur Ursache gehen.
- **Auswirkungsanalyse:** Vor einer Änderung sehen, welche Berichte an einer Spalte hängen.
- **Nachweis:** Herkunft und Verarbeitung belegen, z. B. zur Rechenschaftspflicht nach DSGVO oder bei Prüfungen.
- **Vertrauen:** Fachbereiche sehen, woraus eine Zahl entsteht.

Erfasst wird Lineage automatisch (aus ETL-Werkzeugen, SQL-Skripten, Katalog) oder von Hand.

### Beispiel
Die Kennzahl „Umsatz netto“ im Dashboard stammt aus der View `v_umsatz`, diese aus der Faktentabelle im DWH, diese aus der Staging Area, diese aus `bestellposition` der Warenwirtschaft. Ändert die Warenwirtschaft die Berechnung der Mehrwertsteuer, zeigt die Lineage sofort, dass drei Berichte betroffen sind.

### Abgrenzung
**Metadaten** sind der Oberbegriff; Lineage ist eine Art davon. Ein **Änderungsprotokoll** (Audit-Log) hält fest, wer wann etwas geändert hat – nicht, woher die Werte kommen. **Versionierung** speichert alte Stände, nicht den Herkunftsweg.

### Prüfungsfalle
Lineage mit Datensicherung oder ER-Modell verwechseln. Sie beschreibt den Datenfluss, nicht die Struktur der Tabellen.

### Merksatz
Lineage beantwortet: Woher kommt diese Zahl, und was hängt von ihr ab?

Siehe auch: Metadaten · Data Catalog · Data Governance · Datenqualität · ETL
Mehr: Deep Dive 8, 3.3


## Data Mart
<!-- id: data-mart · quellen: Karte DD8, DD8 Teil 2 · stand: 2026-10 -->

Fachbereichsbezogener Ausschnitt des Data Warehouse (z. B. Vertrieb, Logistik), auf die Fragen dieses Bereichs zugeschnitten.

### Erklärung
In der Schichtenarchitektur Staging Area → Core-DWH → Data Marts liegt der Data Mart ganz vorn beim Nutzer: Er enthält nur die Daten, Kennzahlen und Verdichtungen, die ein Bereich braucht, meist als Star-Schema. Dadurch sind Abfragen schnell und für Fachanwender verständlich. Nach **Inmon** (Top-down) werden Data Marts aus dem Core-DWH abgeleitet, nach **Kimball** (Bottom-up) entsteht das DWH aus Data Marts, die über gemeinsame Dimensionen (Conformed Dimensions) zusammenwachsen.

### Beispiel
Der Data Mart „Vertrieb“ der Möbelhaus Nordholz GmbH enthält Umsatz und Deckungsbeitrag je Filiale, Artikel und Monat – Lager- und Personaldaten fehlen dort bewusst.

### Abgrenzung
Das **Core-DWH** ist integriert und unternehmensweit („eine Wahrheit“), der Data Mart ist ein fachlicher Ausschnitt. Eine **View** ist nur eine gespeicherte Abfrage, ein Data Mart ein eigener, oft vorverdichteter Datenbestand.

### Prüfungsfalle
Data Marts ohne abgestimmte Dimensionen führen zu Insellösungen, in denen „Umsatz“ je Abteilung anders gerechnet wird.

### Merksatz
Core-DWH für alle, Data Mart für einen Bereich.

Siehe auch: Data Warehouse · Core-DWH · Staging Area · Star-Schema · Conformed Dimensions
Mehr: Deep Dive 8, Teil 2

## Data Mining
<!-- id: data-mining · quellen: Karte DD6, DD6 8.1 · stand: 2026-10 -->

Oberbegriff für das Finden von Mustern in großen Datenbeständen mit Verfahren aus Statistik und Machine Learning.

### Erklärung
Zum Data Mining gehören Klassifikation, Clustering, Assoziationsanalyse, Anomalieerkennung und Prognose. Das Vorgehensmodell dafür ist **CRISP-DM** mit seinen sechs Phasen von Business Understanding bis Deployment. Data Mining ist kein einzelnes Verfahren, sondern der Anwendungsbereich, in dem Verfahren wie Entscheidungsbaum, k-Means oder Apriori eingesetzt werden.

### Beispiel
Die Möbelhaus Nordholz GmbH sucht in Kassendaten mit einer Assoziationsanalyse Regeln wie „Wer einen Schreibtisch kauft, kauft oft eine Schreibtischlampe“ und segmentiert Kunden per k-Means.

### Abgrenzung
| Begriff | Bedeutung |
|---|---|
| Data Mining | Muster in großen Daten finden (Anwendungsfeld) |
| Machine Learning | Regeln aus Daten lernen (Verfahrensfamilie) |
| Process Mining | Prozessabläufe aus Event Logs rekonstruieren |
| Data Profiling | Datenbestand vor der Nutzung untersuchen |

### Prüfungsfalle
Data Mining mit Data Profiling verwechseln: Profiling prüft die Daten selbst (NULL-Anteile, Wertebereiche), Mining sucht fachliche Muster in ihnen.

### Merksatz
Mining sucht Muster, Profiling sucht Probleme.

Siehe auch: Machine Learning · CRISP-DM · Assoziationsanalyse · Clustering · Process Mining
Mehr: Deep Dive 6, 8.1

## Data Owner
<!-- id: data-owner · quellen: Karte DD9, DD9 5.2 · stand: 2026-10 -->

Fachlich verantwortliche Person für einen Datenbereich, die über Regeln, Qualitätsziele und Freigaben entscheidet.

### Erklärung
Der Data Owner kommt aus dem **Fachbereich**, nicht aus der IT: Er weiß, wofür die Daten gebraucht werden, legt Qualitätsanforderungen und Zielwerte fest, entscheidet über Zugriffsrechte und trägt die Verantwortung, wenn Kennzahlen verfehlt werden. Die tägliche Pflege delegiert er an den **Data Steward**. Beide Rollen sind Kern der Data Governance.

### Beispiel
Die Leitung Kundenservice der Möbelhaus Nordholz GmbH ist Data Owner der Reparaturauftragsdaten. Sie legt fest, dass jeder Auftrag eine Kundennummer haben muss, und gibt den Zugriff des Controllings auf die Daten frei.

### Abgrenzung
| Rolle | Ebene | Aufgabe |
|---|---|---|
| Data Owner | strategisch-fachlich | entscheidet, verantwortet |
| Data Steward | operativ | pflegt, prüft, bereinigt |
| Datenbankadministrator | technisch | betreibt das System |

### Prüfungsfalle
Den Datenbankadministrator als Data Owner nennen – technischer Betrieb ist keine fachliche Verantwortung.

### Merksatz
Der Owner entscheidet, der Steward pflegt.

Siehe auch: Data Steward · Data Governance · Master Data Management · Erfassungsrichtlinie
Mehr: Deep Dive 9, 5.2

## Data Profiling
<!-- id: data-profiling · quellen: Karte DD3, DD3 Teil 6, DD9 Teil 2 · stand: 2026-10 -->

Systematische Untersuchung eines Datenbestands **vor** der Nutzung: Struktur, Inhalt (Verteilungen, NULL-Anteile, Wertebereiche) und Beziehungen.

### Erklärung
Profiling läuft auf drei Ebenen: **Spaltenanalyse** (NULL-Anteil, Anzahl verschiedener Werte, Minimum/Maximum, Muster, Feldlängen), **spaltenübergreifende Analyse** (Enddatum nach Startdatum? Betrag = Menge · Preis?) und **tabellenübergreifende Analyse** (referenzielle Integrität, verwaiste Sätze, Dubletten). Auffällige Häufungen deuten auf Platzhalter wie 01.01.1900 oder „unbekannt“ hin.

### Beispiel
```sql
SELECT COUNT(*) AS gesamt,
       COUNT(*) - COUNT(email) AS fehlende_email,
       ROUND(COUNT(email) * 100.0 / COUNT(*), 2) AS vollstaendigkeit_prozent
FROM kunde;
```
Bei 10 Kunden mit 7 E-Mail-Adressen ergibt das 3 fehlende Werte und 70 % Vollständigkeit.

### Abgrenzung
Profiling **findet** Probleme, **Data Cleansing** behebt sie, präventive Maßnahmen (Constraints, Erfassungsrichtlinien) verhindern sie.

### Prüfungsfalle
Filtert man die Abfrage mit `WHERE umsatz <= 0`, beziehen sich auch MIN und MAX nur noch auf die unplausiblen Sätze – Prüfungen gehören per CASE in die Zählung, nicht in den Filter.

### Merksatz
Erst profilen, dann rechnen.

Siehe auch: Datenqualität · Platzhalterwert · Vollständigkeit · Referenzielle Integrität · Dublette
Mehr: Deep Dive 9, Teil 2 · Deep Dive 3, Teil 6

## Data Steward
<!-- id: data-steward · quellen: Karte DD9, DD9 5.2 · stand: 2026-10 -->

Operativ zuständige Person für Pflege, Prüfung und Bereinigung der Daten eines Bereichs.

### Erklärung
Der Data Steward setzt die Regeln des Data Owners im Alltag um: Er überwacht Qualitätskennzahlen, bearbeitet fehlerhafte Datensätze aus der Quarantäne des ETL-Laufs, führt Dubletten zusammen, pflegt Referenzlisten und schult Erfassende. Er ist Ansprechpartner zwischen Fachbereich und IT.

### Beispiel
Nach dem nächtlichen Ladelauf liegen bei der Möbelhaus Nordholz GmbH 12 Reparaturaufträge ohne Kundennummer in der Quarantäne. Der Data Steward ergänzt sie aus den Papierbelegen und meldet dem Data Owner, dass eine Filiale das Pflichtfeld umgeht.

### Abgrenzung
Der **Data Owner** entscheidet und verantwortet, der Data Steward führt aus. Ein Datenbankadministrator kümmert sich um Technik, nicht um Inhalte.

### Prüfungsfalle
Den Data Steward als Entscheider über Zugriffsrechte nennen – das ist Aufgabe des Data Owners.

### Merksatz
Steward = Hausmeister der Daten, Owner = Eigentümer.

Siehe auch: Data Owner · Data Governance · Quarantäne · Dublettenbereinigung
Mehr: Deep Dive 9, 5.2

## Data Warehouse
<!-- id: data-warehouse · quellen: Karte DD8, DD8 Teil 2, DD2 Denormalisierung · stand: 2026-10 -->

Zentrale, integrierte, historisierte und themenorientierte Datenbasis für Auswertungen, getrennt von den operativen Systemen.

### Erklärung
Nach **Inmon** hat ein DWH vier Merkmale: **themenorientiert**, **integriert** (einheitliche Formate und Codes), **zeitbezogen** (historisiert statt überschrieben) und **beständig** (geladene Daten werden nicht mehr geändert). Daten kommen per ETL aus den Quellsystemen über die Staging Area ins Core-DWH und von dort in Data Marts. Ausgewertet wird meist in einem denormalisierten Star-Schema. Man trennt das DWH vom OLTP-System, weil Auswertungen sonst das Tagesgeschäft bremsen, Historie fehlt und Daten aus mehreren Quellen zusammengeführt werden müssen.

### Beispiel
Die Möbelhaus Nordholz GmbH lädt nachts Bestellungen aus der Warenwirtschaft und Kundendaten aus dem CRM ins DWH; zieht ein Kunde um, bleibt der alte Wohnort per SCD Typ 2 für Vorjahresvergleiche erhalten.

### Abgrenzung
| | OLTP | Data Warehouse (OLAP) |
|---|---|---|
| Zweck | Tagesgeschäft | Entscheidungen |
| Modell | normalisiert | denormalisiert |
| Daten | aktuell | historisiert |

### Prüfungsfalle
ETL nur als „Daten kopieren“ beschreiben – Bereinigen, Vereinheitlichen und Historisieren gehören dazu.

### Merksatz
Themenorientiert, integriert, zeitbezogen, beständig.

Siehe auch: OLAP · OLTP · ETL · Data Mart · Star-Schema
Mehr: Deep Dive 8, Teil 2 · Deep Dive 2, Denormalisierung

## Data-Ink-Ratio
<!-- id: data-ink-ratio · quellen: Karte DD11, DD11 A2 · stand: 2026-10 -->

Nach Edward Tufte der Anteil der „Tinte“ eines Diagramms, der tatsächlich Daten zeigt – er soll möglichst hoch sein.

### Erklärung
$\text{Data-Ink-Ratio} = \frac{\text{Tinte für Daten}}{\text{gesamte Tinte des Diagramms}}$
Alles, was keine Information trägt – Hintergrundbilder, dicke Gitterlinien, Rahmen, 3D-Effekte, Schatten –, heißt **Chartjunk** und wird entfernt oder abgeschwächt. Die Kennzahl ist ein Denkmodell, keine Messvorschrift: Man prüft jedes Element darauf, ob es etwas über die Daten aussagt.

### Beispiel
Ein Säulendiagramm der Filialumsätze der Möbelhaus Nordholz GmbH mit Holztextur im Hintergrund, 3D-Säulen und schwarzem Gitternetz wird bereinigt: weißer Hintergrund, flache Säulen, dezente graue Hilfslinien, Werte direkt an den Säulen.

### Abgrenzung
Die Data-Ink-Ratio betrifft **Überladung**, der **Lügenfaktor** (ebenfalls Tufte) misst **Verzerrung**. Ein Diagramm kann schlicht und trotzdem manipulativ sein (abgeschnittene Achse).

### Prüfungsfalle
Nicht alles Nicht-Daten-Element ist Junk: Achsenbeschriftung mit Einheit und Titel bleiben Pflicht.

### Merksatz
Jeder Strich muss Daten zeigen oder sie lesbar machen.

Siehe auch: Chartjunk · Lügenfaktor · Datenintegrität in Diagrammen · Achsenbeschriftung mit Einheit
Mehr: Deep Dive 11, A2

## Datenbankherstellerrecht
<!-- id: datenbankherstellerrecht · quellen: Karte DD14, DD14 2.7 · stand: 2026-10 -->

Leistungsschutzrecht (§§ 87a ff. UrhG): Wer wesentlich in Beschaffung, Überprüfung oder Darstellung einer Datenbank investiert hat, ist 15 Jahre gegen die Übernahme wesentlicher Teile geschützt.

### Erklärung
Geschützt wird nicht eine schöpferische Leistung, sondern die **Investition** in die Datensammlung. Der Hersteller darf allein bestimmen, ob wesentliche Teile vervielfältigt, verbreitet oder öffentlich zugänglich gemacht werden; auch das wiederholte, systematische Auslesen unwesentlicher Teile kann verboten sein. Die Schutzdauer beträgt 15 Jahre ab Veröffentlichung bzw. Herstellung (§ 87d UrhG); eine wesentliche Neuinvestition setzt eine neue Frist in Gang.

### Beispiel
Ein Analyst der Möbelhaus Nordholz GmbH möchte per Scraping alle Preise eines Online-Möbelportals in die eigene Datenbank übernehmen. Das kann das Datenbankherstellerrecht des Portals verletzen – zusätzlich sind Nutzungsbedingungen und Datenschutz zu prüfen.

### Abgrenzung
| Recht | Schützt | Dauer |
|---|---|---|
| Urheberrecht | persönliche geistige Schöpfung, auch Software | 70 Jahre nach Tod |
| Datenbankherstellerrecht | Investition in eine Datensammlung | 15 Jahre |
| Patent | technische Erfindung | höchstens 20 Jahre |

### Prüfungsfalle
„Öffentlich im Netz abrufbar“ heißt nicht „frei übernehmbar“.

### Merksatz
Investition schützt 15 Jahre – auch ohne Kreativität.

Siehe auch: Urheberrecht · Open Data · Patentrecht · Open Source
Mehr: Deep Dive 14, 2.7

## Datendiebstahl durch Innentäter
<!-- id: datendiebstahl-durch-innentater · quellen: DD10 5.2 · stand: 2026-10 -->

Bedrohung, bei der berechtigte Personen (Beschäftigte, Dienstleister) Daten unbefugt kopieren oder weitergeben.

### Erklärung
Innentäter haben legitimen Zugang – Firewall und Verschlüsselung helfen deshalb wenig. Wirksam sind: **Need-to-know** und **Least Privilege** (nur nötige Rechte), Protokollierung von Zugriffen und Exporten, **Data Loss Prevention** (erkennt und blockiert das Abfließen sensibler Daten), Sperre für USB-Speicher, Funktionstrennung, regelmäßige Rechteprüfung und das sofortige Entziehen von Rechten beim Austritt. Sind personenbezogene Daten betroffen, ist das eine meldepflichtige Datenpanne.

### Beispiel
Ein Vertriebsmitarbeiter der Möbelhaus Nordholz GmbH exportiert vor seinem Wechsel zur Konkurrenz die gesamte Kundenliste mit Umsätzen auf einen USB-Stick. Eine Exportbegrenzung, protokollierte Downloads und eine USB-Sperre hätten das verhindert oder sichtbar gemacht.

### Abgrenzung
**Social Engineering** manipuliert Berechtigte von außen, beim Innentäter handelt der Berechtigte selbst.

### Merksatz
Gegen Innentäter hilft nur: wenig Rechte, viel Protokoll.

Siehe auch: Need-to-know · Least Privilege · Datenpanne · Social Engineering · Innentäter
Mehr: Deep Dive 10, 5.2

## Datenintegrität in Diagrammen
<!-- id: datenintegritat-in-diagrammen · quellen: Karte DD11, DD11 A3 · stand: 2026-10 -->

Grundsatz, dass eine Darstellung die Daten unverzerrt zeigt: Nullpunkt bei Balken, einheitliche Skalen, keine 3D-Effekte, ehrliche Zeitausschnitte.

### Erklärung
Die Zahlen können stimmen und das Bild trotzdem lügen. Typische Verstöße: abgeschnittene y-Achse bei Balken, gestauchte oder gedehnte Achsen, 3D-Darstellung, zwei y-Achsen mit unterschiedlicher Skalierung, ungleiche Klassenbreiten und ein günstig gewählter Zeitausschnitt. Messbar wird Verzerrung mit Tuftes **Lügenfaktor**:
$\text{Lügenfaktor} = \frac{\text{Effekt in der Grafik}}{\text{Effekt in den Daten}}$ – ehrlich ist ein Wert um 1.

### Beispiel
Umsätze 4,80 und 5,10 Mio. €: Die Daten wachsen um $\frac{5{,}10 - 4{,}80}{4{,}80} = 6{,}25\ \%$. Beginnt die y-Achse bei 4,70 Mio. €, wachsen die sichtbaren Säulen von 0,10 auf 0,40, also um 300 %. Lügenfaktor $= \frac{3{,}00}{0{,}0625} = 48$.

### Abgrenzung
Datenintegrität im Diagramm ist eine **Darstellungs**frage; Datenintegrität im Sinne der IT-Sicherheit (Schutzziel Integrität) meint unveränderte Daten.

### Prüfungsfalle
Bei Liniendiagrammen ist ein beschnittener Ausschnitt vertretbar, wenn er gekennzeichnet ist – bei Balken und Säulen nie.

### Merksatz
Bei Balken codiert die Länge den Wert – also ab null.

Siehe auch: Lügenfaktor · Abgeschnittene Achse · Data-Ink-Ratio · Auswahl des Zeitausschnitts · Einheitliche Skalen
Mehr: Deep Dive 11, A3 · Deep Dive 11, A2

## Datenminimierung
<!-- id: datenminimierung · quellen: Karte DD10, DD10 2.1, DD5 5.4, DD15 3.3 · stand: 2026-10 -->

Grundsatz der DSGVO (Art. 5 Abs. 1 lit. c): Personenbezogene Daten müssen dem Zweck angemessen, erheblich und auf das notwendige Maß beschränkt sein.

### Erklärung
Für jede Verarbeitung wird gefragt: Welche Merkmale brauche ich für **diesen** Zweck wirklich? Alles andere wird nicht erhoben, nicht übermittelt oder frühzeitig gelöscht bzw. vergröbert (Altersgruppe statt Geburtsdatum, PLZ-Region statt Adresse). Datenminimierung hängt eng mit **Zweckbindung** und **Speicherbegrenzung** zusammen und wird technisch über Views, gezielte API-Felder, Aggregation und Pseudonymisierung umgesetzt. Nebeneffekt: weniger Speicher, weniger Angriffsfläche, weniger Energie.

### Beispiel
Die Filialen der Möbelhaus Nordholz GmbH bekommen über die REST-API nur Auftragsnummer, Status und Termin der Reparaturaufträge – nicht Telefonnummer und Zahlungsdaten der Kunden. Im Process-Mining-Projekt wird die Resource-Spalte pseudonymisiert und nur auf Teamebene ausgewertet.

### Abgrenzung
**Zweckbindung** fragt, *wofür* Daten genutzt werden dürfen; Datenminimierung fragt, *wie viele* dafür nötig sind. **Speicherbegrenzung** betrifft die Dauer.

### Prüfungsfalle
„Wir sammeln erst einmal alles, vielleicht brauchen wir es später“ widerspricht Datenminimierung und Zweckbindung zugleich.

### Merksatz
So viel wie nötig, so wenig wie möglich.

Siehe auch: Zweckbindung · Speicherbegrenzung · DSGVO · Pseudonymisierung · Personenbezogene Daten
Mehr: Deep Dive 10, 2.1 · Deep Dive 5, 5.4 · Deep Dive 15, 3.3

## Datenobjekt
<!-- id: datenobjekt · quellen: Karte DD5, DD5 2.1 · stand: 2026-10 -->

BPMN-Element (Blatt mit Eselsohr) für Dokumente oder Daten, die eine Aktivität nutzt oder erzeugt – ohne Einfluss auf die Ablaufreihenfolge.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 110" width="300" height="110" role="img" aria-label="BPMN-Datenobjekt an einer Aktivität">
<rect x="10" y="30" width="120" height="50" rx="10" class="dg-form"/>
<text x="70" y="55" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag erfassen</text>
<line x1="130" y1="55" x2="200" y2="55" class="dg-linie dg-strich"/>
<path d="M200,20 L232,20 L246,34 L246,90 L200,90 Z" class="dg-form"/>
<path d="M232,20 L232,34 L246,34" class="dg-linie"/>
<text x="223" y="104" text-anchor="middle" class="dg-klein">Auftragsdaten</text>
</svg>
```

### Erklärung
Datenobjekte zählen in BPMN zu den Daten-Elementen bzw. Artefakten. Sie werden über eine gepunktete **Datenassoziation** an Aktivitäten gehängt und zeigen, welche Information gelesen oder geschrieben wird. Ein Token läuft nie über ein Datenobjekt – es ändert den Ablauf nicht. Persistente Daten (Datenbank) zeichnet man als **Datenspeicher** (Zylinder).

### Beispiel
Im Reparaturprozess der Möbelhaus Nordholz GmbH erzeugt „Kostenvoranschlag erstellen“ das Datenobjekt „Kostenvoranschlag“, das die Aktivität „Rechnung stellen“ später liest.

### Abgrenzung
In der **eEPK** entspricht dem Datenobjekt das **Informationsobjekt** (Rechteck an einer Funktion). Eine **Nachricht** zwischen Pools wird dagegen als Nachrichtenfluss gezeichnet.

### Prüfungsfalle
Den Ablauf über ein Datenobjekt „weiterleiten“ – der Sequenzfluss muss trotzdem von Aktivität zu Aktivität gezeichnet werden.

### Merksatz
Datenobjekte zeigen das Was, nicht das Wann.

Siehe auch: BPMN · Informationsobjekt · Artefakte · Sequenzfluss · Nachrichtenfluss
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Datenpanne
<!-- id: datenpanne · quellen: Karte DD10, DD10 2.4, DD10 5.4 · stand: 2026-10 -->

Verletzung des Schutzes personenbezogener Daten (Art. 4 Nr. 12 DSGVO) – Vernichtung, Verlust, Veränderung oder unbefugte Offenlegung bzw. unbefugter Zugang.

### Erklärung
Der Verantwortliche meldet die Panne **unverzüglich und möglichst binnen 72 Stunden** nach Bekanntwerden an die Datenschutz-Aufsichtsbehörde (Art. 33 DSGVO); eine spätere Meldung muss er begründen. Die Meldung entfällt nur, wenn voraussichtlich **kein Risiko** für die Betroffenen besteht. Bei voraussichtlich **hohem Risiko** sind zusätzlich die Betroffenen unverzüglich zu benachrichtigen (Art. 34). Jede Panne wird intern dokumentiert, auch die nicht gemeldete. Ein Auftragsverarbeiter meldet dem Verantwortlichen unverzüglich.

### Beispiel
Ein Laptop mit unverschlüsselter Kundenliste der Möbelhaus Nordholz GmbH wird am Montag um 9 Uhr gestohlen. Meldung an die Aufsichtsbehörde spätestens Donnerstag 9 Uhr; da Namen, Adressen und Umsätze offenliegen, werden auch die Kunden informiert. War die Festplatte verschlüsselt, kann das Risiko entfallen.

### Abgrenzung
Die NIS2-Meldung (§ 32 BSIG) geht an das **BSI** und betrifft erhebliche Sicherheitsvorfälle (24 h / 72 h / 1 Monat); die DSGVO-Meldung geht an die Datenschutzbehörde und betrifft nur personenbezogene Daten. Ein Ransomware-Angriff kann beide auslösen.

### Prüfungsfalle
Die 72 Stunden laufen ab **Bekanntwerden**, nicht ab dem Vorfall – und es sind Stunden, keine Werktage.

### Merksatz
72 Stunden an die Behörde, bei hohem Risiko auch an die Betroffenen.

Siehe auch: DSGVO · Sicherheitsvorfall · NIS2 · Technische und organisatorische Maßnahmen · Personenbezogene Daten
Mehr: Deep Dive 10, 2.4 · Deep Dive 10, 5.4

## Datenqualität
<!-- id: datenqualitat · quellen: Karte DD9, DD9 Teil 1, DD9 Teil 3 · stand: 2026-10 -->

Eignung von Daten für ihren Verwendungszweck, gemessen an Dimensionen wie Vollständigkeit, Korrektheit, Konsistenz, Aktualität und Eindeutigkeit.

### Erklärung
Datenqualität ist kein Einzelwert, sondern mehrdimensional – und **zweckabhängig**: Dieselben Daten können für eine Umsatzstatistik reichen und für ein Mailing unbrauchbar sein. Wichtige Dimensionen: Vollständigkeit, Korrektheit, Konsistenz, Eindeutigkeit, Aktualität, Genauigkeit, Gültigkeit und Relevanz. Gemessen wird mit Kennzahlen der Form $\text{Qualitätsgrad} = \frac{\text{korrekte Datensätze}}{\text{geprüfte Datensätze}} \cdot 100$, gesichert durch Prävention (Constraints, Erfassungsrichtlinien), Bereinigung und Data Governance.

### Beispiel
Von 10 Kundendatensätzen der Möbelhaus Nordholz GmbH haben 7 eine E-Mail-Adresse (Vollständigkeit 70 %), 2 sind Dubletten, eine PLZ hat vier Stellen (ungültig). Für das Newsletter-Mailing reicht das nicht.

### Abgrenzung
| Dimension | Frage |
|---|---|
| Vollständigkeit | Sind alle Werte da? |
| Korrektheit | Stimmen sie mit der Realität? |
| Gültigkeit | Entsprechen sie dem Format? |
| Konsistenz | Widersprechen sie sich nicht? |
| Eindeutigkeit | Gibt es jede Entität nur einmal? |

### Prüfungsfalle
Dimensionen nur aufzählen – erwartet werden je Dimension eine Prüf- und eine Sicherungsmaßnahme.

### Merksatz
Gut ist, was für den Zweck taugt – gemessen, nicht gefühlt.

Siehe auch: Vollständigkeit · Korrektheit · Konsistenz · Eindeutigkeit · Data Profiling
Mehr: Deep Dive 9, Teil 1 · Deep Dive 9, Teil 3

## Datenqualitätskreislauf
<!-- id: datenqualitatskreislauf · quellen: DD9 5.2 · stand: 2026-10 -->

Dauerhafter Zyklus zur Sicherung der Datenqualität: Definieren → Messen → Analysieren → Verbessern → erneut messen.

### Erklärung
Statt einer einmaligen Bereinigungsaktion wird Datenqualität laufend gesteuert. **Definieren:** Regeln, Dimensionen und Zielwerte festlegen. **Messen:** Kennzahlen regelmäßig erheben. **Analysieren:** Ursachen der Abweichungen finden (Erfassung, Schnittstelle, Prozess). **Verbessern:** bereinigen **und** Ursache beseitigen (Prävention). Danach beginnt der Kreis neu. Bekannt ist das Modell als **TDQM-Zyklus** (Total Data Quality Management, MIT), angelehnt an den PDCA-Zyklus.

### Beispiel
Die Möbelhaus Nordholz GmbH legt fest: Vollständigkeit der Kundennummer in Reparaturaufträgen ≥ 99 %. Die Messung ergibt 96 %, die Analyse zeigt eine Filiale mit Papierformularen. Verbesserung: Erfassung per App mit Pflichtfeld. Im Folgemonat: 99,6 %.

### Abgrenzung
**PDCA** ist der allgemeine Verbesserungskreislauf (Plan – Do – Check – Act), der Datenqualitätskreislauf seine Anwendung auf Daten. **Data Cleansing** ist nur ein Schritt darin.

### Prüfungsfalle
2.400 bereinigte Dubletten sind keine „sichergestellte“ Datenqualität – ohne Messung und Ursachenbeseitigung entstehen sie neu.

### Merksatz
Datenqualität ist ein Kreislauf, kein Frühjahrsputz.

Siehe auch: PDCA · Data Governance · Regelmäßige Qualitätsmessung · Total Quality Management · Datenqualität
Mehr: Deep Dive 9, 5.2

## Datensatz / Beobachtung / Instanz
<!-- id: datensatz-beobachtung-instanz · quellen: DD6 2.1 · stand: 2026-10 -->

Drei Namen für dasselbe im Machine Learning: eine Zeile der Daten, also ein einzelner Fall mit seinen Merkmalswerten.

### Erklärung
Eine Tabelle für ein Modell besteht aus Zeilen (Datensätze, Beobachtungen, Instanzen) und Spalten (Merkmale/Features und ggf. die Zielvariable/Label). Jede Zeile beschreibt genau einen Fall, z. B. einen Auftrag oder einen Kunden. Die Begriffe stammen aus Datenbanken (Datensatz), Statistik (Beobachtung) und Informatik (Instanz).

### Beispiel
Im ID3-Beispiel der Möbelhaus Nordholz GmbH ist Auftrag Nr. 1 mit „Nordtrans, lang, Standard, Reklamation ja“ eine Instanz; Spediteur, Lieferdauer und Verpackung sind Merkmale, „Reklamation“ ist das Label.

### Abgrenzung
| Begriff | Bedeutung |
|---|---|
| Datensatz / Beobachtung / Instanz | Zeile |
| Merkmal / Feature / Attribut | Spalte (Eingangsgröße) |
| Zielvariable / Label | vorherzusagende Spalte |

### Prüfungsfalle
„Datensatz“ meint hier eine Zeile – im Alltag wird das Wort auch für eine ganze Datei („der Datensatz hat 10.000 Zeilen“) benutzt; in der Antwort klarstellen.

### Merksatz
Zeile = Fall, Spalte = Merkmal.

Siehe auch: Merkmal / Feature / Attribut · Zielvariable / Label · Trainingsdaten · Testdaten
Mehr: Deep Dive 6, 2.1

## Datenschutz-Folgenabschätzung
<!-- id: datenschutz-folgenabschatzung · quellen: Karte DD10, DD10 2.4, DD5 5.4 · stand: 2026-10 -->

Vorab-Prüfung (DSFA, Art. 35 DSGVO), die für Verarbeitungen mit voraussichtlich hohem Risiko für die Rechte und Freiheiten Betroffener Pflicht ist.

### Erklärung
Die DSFA wird **vor** Beginn der Verarbeitung durchgeführt und enthält mindestens: systematische Beschreibung der Verarbeitung und ihrer Zwecke, Bewertung von Notwendigkeit und Verhältnismäßigkeit, Bewertung der Risiken für die Betroffenen und die geplanten Abhilfemaßnahmen. Pflicht ist sie insbesondere bei umfassender systematischer Bewertung persönlicher Aspekte (Profiling mit erheblicher Wirkung), umfangreicher Verarbeitung besonderer Kategorien (Art. 9) und systematischer umfangreicher Überwachung öffentlich zugänglicher Bereiche. Bleibt trotz Maßnahmen ein hohes Risiko, ist vorher die Aufsichtsbehörde zu konsultieren (Art. 36). Der Datenschutzbeauftragte wird beratend einbezogen.

### Beispiel
Die Möbelhaus Nordholz GmbH will per Process Mining die Bearbeitungszeiten einzelner Servicekräfte auswerten. Weil das eine systematische Leistungsüberwachung ist, wird eine DSFA erstellt – Ergebnis: Auswertung nur auf Teamebene, Resource-Spalte pseudonymisiert; zusätzlich Mitbestimmung des Betriebsrats.

### Abgrenzung
Das **Verzeichnis von Verarbeitungstätigkeiten** (Art. 30) dokumentiert **alle** Verarbeitungen; die DSFA ist eine vertiefte Risikoanalyse nur für riskante.

### Prüfungsfalle
Die DSFA nachträglich erstellen – sie gehört vor den Start.

### Merksatz
Hohes Risiko? Erst abschätzen, dann verarbeiten.

Siehe auch: DSGVO · Verzeichnis von Verarbeitungstätigkeiten · Datenschutzbeauftragter · Pseudonymisierung · Mitbestimmung des Betriebsrats
Mehr: Deep Dive 10, 2.4 · Deep Dive 5, 5.4

## Datenschutzbeauftragter
<!-- id: datenschutzbeauftragter · quellen: Karte DD10, DD10 2.4 · stand: 2026-10 -->

Person, die das Unternehmen in Datenschutzfragen berät und die Einhaltung der DSGVO überwacht (Art. 37–39 DSGVO); in Deutschland Pflicht ab in der Regel 20 Personen, die ständig automatisiert personenbezogene Daten verarbeiten (§ 38 BDSG, Stand 2026).

### Erklärung
Der Datenschutzbeauftragte ist **weisungsfrei**, berichtet direkt der höchsten Leitungsebene, darf wegen seiner Aufgabe nicht benachteiligt werden und genießt besonderen Kündigungsschutz. Er berät, schult, überwacht, wirkt bei der DSFA mit und ist Anlaufstelle für Betroffene und Aufsichtsbehörde – er **entscheidet aber nicht**; die Verantwortung bleibt bei der Geschäftsleitung. Er kann intern oder extern benannt werden. Unabhängig von der Personenzahl ist er nötig, wenn eine DSFA erforderlich ist oder Daten geschäftsmäßig zur Übermittlung oder Markt- und Meinungsforschung verarbeitet werden (§ 38 BDSG), nach Art. 37 DSGVO zudem bei umfangreicher systematischer Überwachung oder Verarbeitung besonderer Kategorien als Kerntätigkeit. Die Bundesregierung hat angekündigt, die nationale 20-Personen-Schwelle zu streichen; ein Gesetz gibt es noch nicht (Stand Oktober 2026).

### Beispiel
Die Möbelhaus Nordholz GmbH beschäftigt deutlich mehr als 20 Personen, die am Bildschirm mit Kundendaten arbeiten, und hat deshalb einen Datenschutzbeauftragten benannt.

### Abgrenzung
Der Datenschutzbeauftragte ist **nicht** der Verantwortliche im Sinne der DSGVO und nicht der IT-Sicherheitsbeauftragte.

### Prüfungsfalle
„Der Datenschutzbeauftragte haftet für Verstöße“ – falsch, die Verantwortung trägt das Unternehmen.

### Merksatz
Berät und überwacht, entscheidet nicht.

Siehe auch: Betrieblicher Datenschutzbeauftragter · DSGVO · BDSG · Datenschutz-Folgenabschätzung · Verantwortlicher
Mehr: Deep Dive 10, 2.4

## Datentypen
<!-- id: datentypen · quellen: DD15 2.2, DD15 1.3 · stand: 2026-10 -->

Die sechs Datentypen von JSON: String, Number, Boolean (`true`/`false`), `null`, Array und Object – ein eigenes Datum gibt es nicht.

### Erklärung
Strings stehen in doppelten Anführungszeichen, Zahlen ohne Anführungszeichen mit Punkt als Dezimaltrennzeichen und ohne führende Null, Booleans und `null` kleingeschrieben. Arrays (`[…]`) sind Listen, Objects (`{…}`) Schlüssel-Wert-Paare; beide sind beliebig verschachtelbar. Datumswerte überträgt man als String im Format ISO 8601, Postleitzahlen als String (sonst wäre `04109` ungültig). Viele Parser lesen jede Number als Gleitkommazahl – Geldbeträge beim Import gezielt in DECIMAL umwandeln oder in Cent als Ganzzahl übertragen.

### Beispiel
```json
{
  "bestell_id": 100,
  "bestelldatum": "2026-01-15",
  "plz": "04109",
  "bezahlt": false,
  "bemerkung": null,
  "positionen": [{"produkt_id": 10, "preis": 249.00}]
}
```

### Abgrenzung
**CSV** kennt gar keine Datentypen (alles ist Text), **XML** erhält Typen erst über ein XSD-Schema, SQL hat eigene Typen wie DECIMAL, DATE oder VARCHAR.

### Prüfungsfalle
`True`, `'Text'`, `1,5` oder ein Datum ohne Anführungszeichen machen JSON ungültig.

### Merksatz
JSON kennt sechs Typen – das Datum ist ein String.

Siehe auch: JSON · ISO 8601 · DECIMAL · Postleitzahlen als Text · Keine Datentypen
Mehr: Deep Dive 15, 2.2 · Deep Dive 15, 1.3

## Datenverifizierung
<!-- id: datenverifizierung · quellen: Karte DD30, DD30 2.3, DD9 5.1 · stand: 2026-11 -->

Prüfung, ob Daten mit der Quelle oder der Wirklichkeit übereinstimmen, also richtig sind – im Unterschied zur Datenvalidierung, die nur prüft, ob sie den festgelegten Regeln entsprechen.

Auch: Datenvalidierung, Validierung und Verifizierung

### Erklärung
Beide Prüfungen sichern die Datenqualität, fragen aber Verschiedenes:

| | Datenvalidierung | Datenverifizierung |
|---|---|---|
| Frage | Sind die Daten **zulässig**? | Sind die Daten **richtig**? |
| Prüft gegen | Regeln: Datentyp, Format, Wertebereich, Pflichtfeld | Quelle oder Wirklichkeit |
| Typische Mittel | Constraint, Prüfregel beim Import, Formatprüfung | Abgleich mit Originalbeleg oder Messgerät, zweite Messung, Doppelerfassung, Prüfsumme, Stichprobe |
| Grenze | Ein zulässiger Wert kann trotzdem falsch sein | aufwendig, oft nur stichprobenweise möglich |

**Doppelerfassung:** Zwei Personen erfassen dieselben Daten unabhängig voneinander, abweichende Werte werden geklärt. Eine **Prüfsumme** zeigt, ob Daten bei der Übertragung unverändert geblieben sind.

### Beispiel
Das Messgerät „HolzCheck“ der Nordholz Manufaktur liefert für eine Lagerbox die Holzfeuchte 12,4 %. Die Importprüfung (Validierung) lässt den Wert durch: Er ist eine Zahl und liegt im zulässigen Bereich von 6 bis 20 %. Ein Techniker misst mit einem kalibrierten Referenzgerät 17,2 % – die **Verifizierung** zeigt, dass der Sensor falsch misst. Der Wert war zulässig, aber nicht richtig.

### Abgrenzung
Mit „Validierung“ sind auch andere Dinge gemeint: **Valide** beim XML-Dokument heißt „entspricht dem Schema“, **Validierungsdaten** im maschinellen Lernen sind Daten zum Abstimmen eines Modells. Die **Plausibilitätsprüfung** ist eine Form der Validierung: Sie prüft, ob Werte zueinander passen.

### Prüfungsfalle
Beide Begriffe nur mit „Daten werden geprüft“ beschreiben – das bringt keinen Punkt. Entscheidend ist, **wogegen** geprüft wird: gegen Regeln (Validierung) oder gegen die Wirklichkeit (Verifizierung). Auch das Beispiel muss passen: „Formatfehler in der ID“ gehört zur Validierung, „Abgleich mit dem Messprotokoll“ zur Verifizierung.

### Merksatz
Validierung: zulässig laut Regel. Verifizierung: richtig laut Wirklichkeit.

Siehe auch: Plausibilitätsprüfung · Formatprüfung · Valide · Validierungsdaten · Korrektheit · Gültigkeit · Vier-Augen-Prinzip
Mehr: Deep Dive 30, 2.3 · Deep Dive 9, 5.1

## DBSCAN
<!-- id: dbscan · quellen: DD6 Teil 3 · stand: 2026-11 -->

Dichtebasiertes Clusterverfahren: Punkte in dicht besiedelten Regionen werden zu Clustern verbunden, Punkte in dünn besiedelten Regionen gelten als Rauschen; die Clusteranzahl muss nicht vorgegeben werden.

### Erklärung
DBSCAN (Density-Based Spatial Clustering of Applications with Noise) hat zwei Hyperparameter: den Radius $\varepsilon$ (Epsilon) der Nachbarschaft und die Mindestzahl **MinPts** an Punkten in dieser Nachbarschaft (der Punkt selbst zählt mit). Ein **Kernpunkt** hat mindestens MinPts Punkte im Radius $\varepsilon$; ein **Randpunkt** ist selbst kein Kernpunkt, liegt aber im Radius eines Kernpunkts; alle übrigen sind **Rauschpunkte**. Ein Cluster entsteht, indem man von einem Kernpunkt aus alle erreichbaren Kern- und Randpunkte einsammelt. Stärken: beliebige Clusterform, Ausreißer werden erkannt, kein k nötig. Schwächen: Ergebnis hängt von $\varepsilon$ und MinPts ab, Cluster mit sehr unterschiedlicher Dichte werden schlecht getrennt, und die Merkmale müssen wie bei k-Means skaliert sein, weil der Abstand zählt.

### Beispiel
Sieben Kunden nach Bestellungen pro Jahr und Bestellwert (in 100 €): P1(2|2), P2(3|1), P3(1|3), P4(7|8), P5(8|7), P6(9|9), P7(15|1). Mit $\varepsilon = 2{,}5$ und MinPts = 3 (euklidischer Abstand):

- P1: Abstand zu P2 und P3 jeweils $\sqrt{2} \approx 1{,}41$ → 3 Punkte (mit sich selbst) → Kernpunkt.
- P2 und P3: Abstand zueinander $\sqrt{8} \approx 2{,}83 > 2{,}5$, also nur 2 Punkte → kein Kernpunkt, aber im Radius von P1 → Randpunkte von Cluster 1.
- P4, P5, P6: Abstände $\sqrt{2} \approx 1{,}41$ und $\sqrt{5} \approx 2{,}24$ → jeder hat 3 Punkte → Kernpunkte, gemeinsam Cluster 2.
- P7: kein weiterer Punkt in Reichweite → Rauschen.

Ergebnis: zwei Cluster (Gelegenheits- und Stammkunden) und ein Ausreißer. k-Means müsste P7 einem Cluster zuordnen und zöge dessen Zentrum zur Seite.

### Abgrenzung
| | k-Means | DBSCAN |
|---|---|---|
| Vorgabe | Clusteranzahl k | Radius ε und MinPts |
| Clusterform | kugelig, ähnlich groß | beliebig |
| Ausreißer | werden zugeordnet | als Rauschen markiert |

### Prüfungsfalle
Bei DBSCAN eine Clusteranzahl k angeben wollen – sie ergibt sich aus den Daten. Und: Rauschpunkte sind kein eigenes Cluster.

### Merksatz
Dichte verbindet, Leere trennt.

Siehe auch: Clustering · K-Means · Euklidischer Abstand · Skalierung · Hierarchisches Clustering · Ausreißer
Mehr: Deep Dive 6, Teil 3


## DDG
<!-- id: ddg · quellen: DD10 2.4 · stand: 2026-10 -->

Digitale-Dienste-Gesetz: seit 14.05.2024 geltendes deutsches Gesetz, das das Telemediengesetz (TMG) ablöst und den europäischen Digital Services Act (DSA) in Deutschland ergänzt.

### Erklärung
Für die Prüfung wichtig: Die **Impressumspflicht** (Anbieterkennzeichnung) für Websites und Onlineshops steht jetzt in **§ 5 DDG** statt in § 5 TMG. Mit dem DDG wurde zugleich das TTDSG in **TDDDG** umbenannt; dort regelt § 25 die Einwilligung für Cookies und Tracking.

### Beispiel
Das Impressum des Onlineshops der Möbelhaus Nordholz GmbH verweist auf „§ 5 DDG“; ein veralteter Hinweis auf „§ 5 TMG“ wird angepasst.

### Abgrenzung
| Gesetz | Regelt |
|---|---|
| DDG | Pflichten digitaler Dienste, Impressum (§ 5) |
| TDDDG (früher TTDSG) | Cookies, Endgerätezugriff (§ 25) |
| DSGVO | Verarbeitung personenbezogener Daten |

### Merksatz
Impressum = § 5 DDG, Cookies = § 25 TDDDG.

Siehe auch: TDDDG · TTDSG · DSGVO
Mehr: Deep Dive 10, 2.4

## DDL
<!-- id: ddl · quellen: Karte DD1, DD1 2.5, DD1 3.9 · stand: 2026-10 -->

Data Definition Language: SQL-Befehle, die Datenbankstrukturen anlegen, ändern oder löschen – CREATE, ALTER, DROP (meist auch TRUNCATE).

### Erklärung
Mit DDL werden Tabellen, Views und Indizes definiert, einschließlich Datentypen und Constraints (PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK, DEFAULT). Constraints sind ein präventives Datenqualitätsinstrument, weil die Datenbank ungültige Werte schon beim Speichern abweist.

### Beispiel
```sql
CREATE TABLE retoure (
  retoure_id  INTEGER PRIMARY KEY,
  bestell_id  INTEGER NOT NULL,
  erstattung  DECIMAL(8,2) CHECK (erstattung >= 0),
  datum       DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (bestell_id) REFERENCES bestellung(bestell_id)
);
```

### Abgrenzung
| Gruppe | Befehle |
|---|---|
| DDL | CREATE, ALTER, DROP, TRUNCATE |
| DML | INSERT, UPDATE, DELETE |
| DQL | SELECT |
| DCL | GRANT, REVOKE |
| TCL | COMMIT, ROLLBACK |

### Prüfungsfalle
DROP TABLE (Struktur weg) mit DELETE (Zeilen weg, Struktur bleibt) verwechseln.

### Merksatz
DDL baut das Regal, DML legt die Ware hinein.

Siehe auch: DML · CHECK · DEFAULT · Referenzielle Integrität · NOT NULL
Mehr: Deep Dive 1, 2.5 · Deep Dive 1, 3.9

## DDoS-Angriff
<!-- id: ddos-angriff · quellen: Karte DD10, DD10 5.2 · stand: 2026-10 -->

Distributed Denial of Service: Viele gekaperte Rechner (Botnetz) überfluten einen Dienst mit Anfragen, bis er nicht mehr erreichbar ist – ein Angriff auf das Schutzziel Verfügbarkeit.

### Erklärung
„Distributed“ heißt: Die Anfragen kommen von Tausenden Quellen gleichzeitig, deshalb hilft das Sperren einzelner IP-Adressen kaum. Gegenmaßnahmen: DDoS-Schutzdienst des Providers (filtert vor dem eigenen Netz), Rate Limiting, Lastverteilung (Load Balancer) und ein Notfallplan mit Ansprechpartnern. Daten werden meist nicht gestohlen; der Schaden entsteht durch Ausfall, verlorene Umsätze und SLA-Verletzungen.

### Beispiel
Am Black Friday ist der Onlineshop der Möbelhaus Nordholz GmbH zwei Stunden nicht erreichbar, weil ein Botnetz Millionen Anfragen schickt. Der Provider leitet den Verkehr über seinen Schutzdienst um, der die Angriffsanfragen herausfiltert.

### Abgrenzung
| Angriff | Schutzziel |
|---|---|
| DDoS | Verfügbarkeit |
| Ransomware | Verfügbarkeit (oft auch Vertraulichkeit) |
| Man-in-the-Middle | Vertraulichkeit, Integrität |

Ein **DoS** kommt von einer einzelnen Quelle, ein **DDoS** von vielen verteilten.

### Prüfungsfalle
Verschlüsselung als Gegenmaßnahme nennen – sie schützt die Vertraulichkeit, nicht die Erreichbarkeit.

### Merksatz
DDoS will nichts stehlen, nur lahmlegen.

Siehe auch: Verfügbarkeit · Rate Limiting · Load Balancer · Notfallmanagement · Schutzziele
Mehr: Deep Dive 10, 5.2

## Deadlock
<!-- id: deadlock · quellen: Karte DD15, DD15 4.2, DD5 2.1 · stand: 2026-10 -->

Verklemmung, bei der zwei (oder mehr) Beteiligte gegenseitig aufeinander warten, sodass keiner weiterkommt – in Datenbanken bei Sperren, in BPMN bei falsch kombinierten Gateways.

### Erklärung
**Datenbank:** Transaktion A sperrt Datensatz 1 und wartet auf Datensatz 2, Transaktion B hält Datensatz 2 und wartet auf Datensatz 1. Das DBMS erkennt den Zyklus und bricht eine Transaktion ab (Rollback); die Anwendung muss sie wiederholen. Vorbeugen: Sperren immer in derselben Reihenfolge anfordern, Transaktionen kurz halten.
**BPMN:** Ein XOR-Gateway spaltet auf, ein AND-Gateway führt zusammen. Das AND wartet auf Token von allen Eingängen, bekommt aber nur eines – der Prozess bleibt stehen.

### Beispiel
Zwei Disponenten der Möbelhaus Nordholz GmbH buchen gleichzeitig um: A sperrt erst den Bestand in Köln, dann in Hamburg, B umgekehrt. Die Datenbank bricht die Transaktion von B ab.

### Abgrenzung
Beim **Lost Update** geht eine Änderung verloren, ohne dass jemand wartet; beim Deadlock blockieren sich beide. Die umgekehrte BPMN-Fehlkombination (AND-Split, XOR-Join) führt nicht zum Deadlock, sondern zur **Mehrfachausführung** des Folgeschritts.

### Prüfungsfalle
Den BPMN-Deadlock übersehen: Gateways immer gleichartig öffnen und schließen.

### Merksatz
Jeder wartet auf den anderen – also bewegt sich keiner.

Siehe auch: Lost Update · Pessimistisches Sperren · Transaktion · AND-Gateway · XOR-Gateway
Mehr: Deep Dive 15, 4.2 · Deep Dive 5, 2.1

## Debugging
<!-- id: debugging · quellen: Karte DD16, DD16 1.3 · stand: 2026-10 -->

Suche und Behebung des Fehlerzustands, nachdem ein Test oder Nutzer eine Fehlerwirkung festgestellt hat – z. B. mit Breakpoints.

### Erklärung
Testen zeigt, **dass** etwas falsch ist (Fehlerwirkung); Debugging findet, **wo und warum** (Fehlerzustand) und korrigiert es. Hilfsmittel sind **Breakpoints** (Haltepunkte, an denen das Programm anhält), schrittweises Ausführen, Variablenbeobachtung, Logausgaben und das Eingrenzen mit kleinen Testdaten. Nach der Korrektur folgen **Fehlernachtest** (ist der Fehler weg?) und **Regressionstest** (ist sonst nichts kaputt?).

### Beispiel
Das Dashboard der Möbelhaus Nordholz GmbH zeigt 19 % zu viel Umsatz (Fehlerwirkung). Beim Debuggen des ETL-Skripts zeigt ein Breakpoint, dass Bruttobeträge summiert werden (Fehlerzustand); Ursache war eine Verwechslung von Netto und Brutto durch den Entwickler (Fehlhandlung).

### Abgrenzung
| Begriff | Bedeutung |
|---|---|
| Fehlhandlung | menschlicher Irrtum |
| Fehlerzustand | Defekt im Code |
| Fehlerwirkung | sichtbares Fehlverhalten |
| Testen | macht Fehlerwirkungen sichtbar |
| Debugging | findet und behebt den Fehlerzustand |

### Prüfungsfalle
Debugging ist kein Test – es gehört zur Entwicklung, Tests zur Qualitätssicherung.

### Merksatz
Testen findet Symptome, Debugging die Ursache.

Siehe auch: Testen · Fehlerzustand · Fehlerwirkung · Fehlernachtest · Regressionstest
Mehr: Deep Dive 16, 1.3

## DECIMAL
<!-- id: decimal · quellen: Karte DD15, DD15 1.3 · stand: 2026-10 -->

SQL-Datentyp für Festkommazahlen mit fester Gesamt- und Nachkommastellenzahl – richtig für Geldbeträge, weil Gleitkommazahlen Dezimalbrüche nicht exakt abbilden.

### Erklärung
`DECIMAL(p, s)` hat p Stellen insgesamt, davon s nach dem Komma; `DECIMAL(8,2)` speichert bis 999.999,99 exakt (gleichbedeutend: NUMERIC). **FLOAT/DOUBLE** speichern binäre Gleitkommazahlen: Viele Dezimalbrüche wie 0,1 sind dort periodisch und werden gerundet, sodass Summen über viele Buchungen um Cent-Beträge abweichen können. Alternative: Beträge in Cent als Ganzzahl.

### Beispiel
In FLOAT ergibt 0,1 + 0,2 den Wert 0,30000000000000004. In der Tabelle `retoure` der Möbelhaus Nordholz GmbH ist `erstattung DECIMAL(8,2)` deshalb richtig; 249,00 € und 39,90 € ergeben exakt 288,90 €.

### Abgrenzung
FLOAT eignet sich für Messwerte (Temperatur, Sensordaten), bei denen winzige Rundungsfehler unerheblich sind, DECIMAL für alles, was exakt aufgehen muss.

### Prüfungsfalle
Auch JSON-Parser lesen Zahlen oft als Gleitkommazahl – beim Import gezielt in DECIMAL umwandeln.

### Merksatz
Geld nie als FLOAT.

Siehe auch: Datentypen · DDL · JSON · Postleitzahlen als Text
Mehr: Deep Dive 15, 1.3

## Deckungsbeitrag
<!-- id: deckungsbeitrag · quellen: Karte DD12, DD12 4.2 · stand: 2026-10 -->

Erlös minus variable Kosten; je Stück: Verkaufspreis minus variable Stückkosten – der Betrag, der zur Deckung der Fixkosten und zum Gewinn beiträgt.

### Erklärung
$\text{DB je Stück} = p - k_v$ und $\text{DB gesamt} = (p - k_v) \cdot x$. Ist der gesamte Deckungsbeitrag größer als die Fixkosten, entsteht Gewinn. Der Stückdeckungsbeitrag ist der Nenner der **Break-even-Menge**: $\text{Break-even-Menge} = \frac{\text{Fixkosten}}{p - k_v}$. Kurzfristig lohnt jedes Produkt mit positivem Deckungsbeitrag, weil es Fixkosten mitträgt.

### Beispiel
Ein Bürostuhl der Möbelhaus Nordholz GmbH kostet 80 €, die variablen Stückkosten betragen 50 €: DB je Stück = 30 €. Bei 24.000 € Fixkosten liegt die Gewinnschwelle bei $\frac{24.000}{30} = 800$ Stück. Bei 1.000 verkauften Stühlen: DB gesamt 30.000 €, Gewinn 6.000 €.

### Abgrenzung
**Gewinn** = Deckungsbeitrag minus Fixkosten. Die **Marge** (DB / Umsatz) ist nicht-additiv und muss im DWH aus Summen neu berechnet werden, nicht aus Einzelmargen addiert.

### Prüfungsfalle
Fixkosten in den Stückdeckungsbeitrag hineinrechnen – sie werden erst danach abgezogen.

### Merksatz
DB = Preis minus variable Kosten – der Rest deckt die Fixkosten.

Siehe auch: Break-even-Menge · Fixkosten · Variable Kosten · Kennzahlentypen
Mehr: Deep Dive 12, 4.2

## Deep Learning
<!-- id: deep-learning · quellen: Karte DD6, DD6 8.1, DD6 8.2 · stand: 2026-10 -->

Teilgebiet des Machine Learning mit neuronalen Netzen aus vielen Schichten, die Merkmale selbst aus Rohdaten bilden.

### Erklärung
Klassische Verfahren brauchen vorbereitete Merkmale (z. B. „Lieferdauer kurz/lang“). Tiefe neuronale Netze lernen aus Rohdaten wie Pixeln oder Text selbst, welche Merkmale wichtig sind – jede Schicht verdichtet die Information weiter. Training per **Backpropagation**: Der Fehler wird rückwärts durchs Netz gerechnet und die Gewichte werden angepasst. Stärken: Bilder, Sprache, Text, generative KI. Schwächen: sehr viele Daten und Rechenleistung nötig, Overfitting-Gefahr, kaum erklärbar (**Black Box**) – problematisch bei Art. 22 DSGVO.

### Beispiel
Die Möbelhaus Nordholz GmbH erkennt auf Fotos von Rücksendungen automatisch Transportschäden – ein typischer Deep-Learning-Fall. Für das Reklamationsrisiko je Spediteur reicht dagegen ein erklärbarer Entscheidungsbaum.

### Abgrenzung
| Begriff | Bedeutung |
|---|---|
| Künstliche Intelligenz | Oberbegriff, auch regelbasiert |
| Machine Learning | lernt Regeln aus Daten |
| Deep Learning | ML mit vielschichtigen neuronalen Netzen |

### Prüfungsfalle
Deep Learning für kleine Tabellen mit wenigen hundert Zeilen empfehlen – dort sind einfache, erklärbare Verfahren besser.

### Merksatz
KI ⊃ ML ⊃ Deep Learning.

Siehe auch: Machine Learning · Neuronale Netze · CNN (Convolutional Neural Network) · Künstliche Intelligenz · Generative KI · Overfitting
Mehr: Deep Dive 6, 8.1 · Deep Dive 6, 8.2

## DEFAULT
<!-- id: default · quellen: Karte DD1, DD1 2.5 · stand: 2026-10 -->

SQL-Constraint, der einen Standardwert einträgt, wenn beim INSERT für die Spalte kein Wert angegeben wird (z. B. `DEFAULT CURRENT_DATE`).

### Erklärung
DEFAULT wird per DDL in `CREATE TABLE` oder `ALTER TABLE` festgelegt. Er greift nur, wenn die Spalte im INSERT **weggelassen** wird; wird ausdrücklich `NULL` eingefügt, bleibt NULL stehen (außer NOT NULL verbietet es). Typische Standardwerte: aktuelles Datum, Status „offen“, Menge 1. MySQL verlangt für Ausdrücke als Standardwert Klammern: `DEFAULT (CURRENT_DATE)`.

### Beispiel
```sql
CREATE TABLE retoure (
  retoure_id INTEGER PRIMARY KEY,
  datum      DATE DEFAULT CURRENT_DATE,
  status     VARCHAR(20) DEFAULT 'offen'
);
INSERT INTO retoure (retoure_id) VALUES (1);
-- datum = heutiges Datum, status = 'offen'
```

### Abgrenzung
| Constraint | Wirkung |
|---|---|
| DEFAULT | füllt fehlende Angabe auf |
| NOT NULL | verbietet fehlende Werte |
| CHECK | prüft den Wertebereich |

### Prüfungsfalle
Ein Standardwert kann Datenqualität verschlechtern, wenn er echte Lücken versteckt – ein Default „01.01.1900“ ist ein Platzhalter, der später jede Auswertung verfälscht.

### Merksatz
DEFAULT füllt, was weggelassen wurde – nicht, was NULL gesetzt wurde.

Siehe auch: DDL · NOT NULL · CHECK · Platzhalterwert · NULL
Mehr: Deep Dive 1, 2.5

## Definition of Done
<!-- id: definition-of-done · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Gemeinsame, formale Beschreibung des Zustands, den ein Inkrement erreichen muss, um als fertig zu gelten; im Scrum Guide 2020 das Commitment (die Verpflichtung) des Inkrements.

### Erklärung
Erst wenn ein Product-Backlog-Eintrag die Definition of Done erfüllt, gehört er zum Inkrement und darf im Sprint Review gezeigt werden. Gibt es eine unternehmensweite Definition, muss das Scrum Team sie mindestens einhalten; sonst erstellt es eine eigene. Die DoD schafft Transparenz und ein gemeinsames Qualitätsverständnis. Jedes Artefakt hat ein Commitment: Product Backlog → Produktziel, Sprint Backlog → Sprint-Ziel, Inkrement → Definition of Done.

### Beispiel
Im Reporting-Projekt der Möbelhaus Nordholz GmbH gilt ein Bericht als fertig, wenn: SQL im Repository versioniert, Summenabgleich mit der Quelle bestanden, Review durch eine zweite Person, Kennzahlen dokumentiert, Fachbereich hat Testlauf gesehen.

### Abgrenzung
**Akzeptanzkriterien** gelten für eine einzelne User Story (fachlich: was muss sie können?), die DoD gilt für **alle** Einträge (Qualitätsstandard). **Abnahmekriterien** im klassischen Projekt beziehen sich auf das Gesamtergebnis.

### Prüfungsfalle
Die DoD als Commitment des Sprint Backlogs nennen – das ist das Sprint-Ziel.

### Merksatz
Fertig ist erst, was die Definition of Done erfüllt.

Siehe auch: Inkrement · Scrum · Product Backlog · Sprint Backlog · Abnahme
Mehr: Deep Dive 12, Teil 2

## Deflation
<!-- id: deflation · quellen: Karte DD14, DD14 4.5 · stand: 2026-10 -->

Anhaltender Rückgang des allgemeinen Preisniveaus; Konsum wird aufgeschoben, Investitionen sinken.

### Erklärung
Gemessen wird wie bei der Inflation über den Verbraucherpreisindex – die Inflationsrate ist negativ. Gefährlich ist die **Deflationsspirale**: Wer sinkende Preise erwartet, wartet mit Käufen; Unternehmen verkaufen weniger, senken Löhne und Investitionen, die Arbeitslosigkeit steigt, die Nachfrage sinkt weiter. Schulden werden real schwerer, weil Geld an Wert gewinnt. Die EZB strebt deshalb mittelfristig 2 % Inflation an, nicht 0 %.

### Beispiel
Fällt der VPI von 120,0 auf 118,8, beträgt die Rate $\frac{118{,}8 - 120{,}0}{120{,}0} \cdot 100 = -1{,}0\ \%$. Erwarten Kunden der Möbelhaus Nordholz GmbH weiter fallende Preise, verschieben sie den Sofakauf.

### Abgrenzung
| Begriff | Bedeutung |
|---|---|
| Inflation | Preisniveau steigt anhaltend |
| Deflation | Preisniveau sinkt anhaltend |
| Disinflation | Inflationsrate sinkt, Preise steigen aber noch |

### Prüfungsfalle
Eine sinkende Inflationsrate (z. B. von 4 % auf 2 %) ist keine Deflation – die Preise steigen weiterhin, nur langsamer.

### Merksatz
Deflation: billiger morgen – also kauft heute keiner.

Siehe auch: Inflation · Inflationsrate · Geldpolitik · Leitzins · Konjunkturphasen
Mehr: Deep Dive 14, 4.5

## DELETE
<!-- id: delete · quellen: Karte DD15, DD15 3.2, DD1 2.4 · stand: 2026-10 -->

HTTP-Methode zum Löschen einer Ressource; sie ist idempotent, aber nicht sicher.

### Erklärung
`DELETE /reparaturauftraege/5001` löscht die adressierte Ressource; typische Antwort ist **204 No Content**. **Idempotent** heißt: Mehrfaches Ausführen hinterlässt denselben Serverzustand wie einmaliges – die Ressource ist danach gelöscht, auch wenn der zweite Aufruf 404 liefert. **Nicht sicher**, weil sich der Zustand auf dem Server ändert. Wer löschen darf, regeln Authentifizierung (401) und Berechtigung (403).

### Beispiel
Die Filial-App der Möbelhaus Nordholz GmbH storniert einen doppelt angelegten Auftrag mit `DELETE /reparaturauftraege/5001`. Nach einem Timeout schickt sie den Aufruf erneut – kein Schaden, der Auftrag ist einfach weiter gelöscht.

### Abgrenzung
| Methode | Zweck | Idempotent |
|---|---|---|
| GET | lesen | ja (und sicher) |
| POST | anlegen | nein |
| PUT | ersetzen | ja |
| DELETE | löschen | ja |

Der SQL-Befehl **DELETE** (DML) löscht Zeilen einer Tabelle; ohne WHERE trifft er alle Zeilen.

### Prüfungsfalle
Idempotent mit „gleiche Antwort“ verwechseln – gemeint ist der Zustand auf dem Server, nicht der Statuscode.

### Merksatz
Zweimal gelöscht ist auch nur gelöscht.

Siehe auch: Idempotent · REST · GET · POST · PUT · DELETE FROM
Mehr: Deep Dive 15, 3.2 · Deep Dive 1, 2.4

## DELETE FROM
<!-- id: delete-from · quellen: Karte DD1, DD1 2.4, DD1 3.9, DD29 4 · stand: 2026-11 -->

SQL-Anweisung (DML), die Zeilen aus einer Tabelle löscht; WHERE bestimmt, welche, ohne WHERE sind es alle. Die Tabelle selbst bleibt bestehen.
Auch: SQL-DELETE

### Erklärung
`DELETE FROM tabelle [WHERE bedingung]` – ohne Spaltenliste, denn es werden ganze Zeilen entfernt (`DELETE * FROM …` ist kein gültiges SQL). Hängen an einer Zeile noch Kindzeilen über einen Fremdschlüssel, lehnt die Datenbank das Löschen ab (`RESTRICT`), außer der Fremdschlüssel ist mit `ON DELETE CASCADE` (Kindzeilen werden mitgelöscht) oder `ON DELETE SET NULL` angelegt. Sonst gilt: erst die Kindzeilen löschen, dann die Elternzeile. In einer Transaktion lässt sich DELETE per ROLLBACK zurücknehmen. Wie bei allen Vergleichen löscht `WHERE ort = NULL` nichts, richtig ist `IS NULL`. Vor dem Löschen prüft man die Auswahl mit demselben WHERE in einem SELECT.

### Beispiel
```sql
DELETE FROM bestellposition WHERE bestell_id = 105;
DELETE FROM bestellung WHERE bestell_id = 105;
```
Die erste Anweisung entfernt 1 Zeile (2 Schreibtischlampen), die zweite die Bestellung selbst; danach gibt es 5 Bestellungen. In umgekehrter Reihenfolge scheitert das Löschen der Bestellung am Fremdschlüssel, solange die Position noch existiert.

### Abgrenzung
| Befehl | Gruppe | Wirkung |
|---|---|---|
| DELETE FROM | DML | löscht ausgewählte Zeilen (WHERE), in einer Transaktion per ROLLBACK umkehrbar |
| TRUNCATE TABLE | DDL | leert die ganze Tabelle, kein WHERE; je nach System (z. B. MySQL, Oracle) nicht per ROLLBACK umkehrbar |
| DROP TABLE | DDL | entfernt Tabelle samt Struktur; je nach System nicht per ROLLBACK umkehrbar |

Dialekt: SQLite kennt kein TRUNCATE; dort leert `DELETE FROM tabelle` die Tabelle. SQLite prüft Fremdschlüssel nur, wenn `PRAGMA foreign_keys = ON` gesetzt ist (in der App der Fall). Mit der HTTP-Methode DELETE (REST) hat der SQL-Befehl nur den Namen gemeinsam.

### Prüfungsfalle
`DELETE FROM kunde;` ohne WHERE löscht alle Kunden. Und `DELETE FROM kunde WHERE kunden_id NOT IN (SELECT kunden_id FROM bestellung)` löscht nichts, sobald die Unterabfrage ein NULL enthält – dann NOT EXISTS verwenden.

### Merksatz
DELETE FROM ohne WHERE leert die Tabelle – erst prüfen, dann löschen.

Siehe auch: INSERT · UPDATE · DML · DDL · Referenzielle Integrität
Mehr: Deep Dive 1, 2.4 · Deep Dive 1, 3.9 · Deep Dive 29, Teil 4

## Delta Lake
<!-- id: delta-lake · quellen: DD8 5.1 · stand: 2026-11 -->

Offenes Tabellenformat für Data Lakes: Es legt über Parquet-Dateien im Objektspeicher ein Transaktionsprotokoll und bringt ACID-Transaktionen, Schemaprüfung und Versionierung mit.

### Erklärung
Die Daten selbst liegen als Parquet-Dateien. Ein Protokoll hält jede Änderung als neue **Version** fest. Daraus folgt:
- **ACID-Transaktionen:** Ein Schreibvorgang gilt ganz oder gar nicht; Leser sehen nie halbfertige Stände. Gleichzeitige Schreiber werden per optimistischer Nebenläufigkeitskontrolle abgeglichen.
- **Schemaprüfung:** Schreibversuche mit abweichendem Schema werden abgelehnt, solange man die Änderung nicht ausdrücklich erlaubt (siehe Schema Evolution).
- **Zeitreise (Time Travel):** ältere Versionen abfragen oder die Tabelle auf einen früheren Stand zurücksetzen.
- **UPDATE, DELETE und MERGE** auch auf Lake-Daten, z. B. für Korrekturen. Für Löschanträge nach DSGVO reicht DELETE allein nicht: Die alten Dateien bleiben per Zeitreise lesbar, bis `VACUUM` sie nach der Aufbewahrungsfrist physisch entfernt (danach geht auch die Zeitreise zu diesen Ständen verloren).
- Batch und Streaming können dieselbe Tabelle nutzen.

Vergleichbare Tabellenformate sind Apache Iceberg und Apache Hudi.

### Beispiel
Ein fehlerhafter Ladelauf überschreibt um 03:10 Uhr in der Silver-Tabelle `kunde_bereinigt` die Postleitzahlen. Das Möbelhaus setzt die Tabelle von Version 42 auf Version 41 zurück und startet den korrigierten Lauf neu – ohne die Rohdaten erneut laden zu müssen.

### Abgrenzung
**Parquet** ist nur ein Dateiformat ohne Transaktionen; Delta Lake ist das Tabellenformat darüber. Ein **Data Lake** ist die Speicherart, Delta Lake eine Technik, die ihn zum **Lakehouse** macht.

### Prüfungsfalle
Delta Lake mit Deltaextraktion verwechseln. Delta Lake ist ein Tabellenformat mit Versionsprotokoll; die Deltaextraktion lädt nur die Änderungen aus einem Quellsystem.

### Merksatz
Delta Lake macht aus Dateien im See verlässliche Tabellen.

Siehe auch: Lakehouse · Parquet · Data Lake · ACID · Medallion-Architektur · Schema Evolution
Mehr: Deep Dive 8, 5.1


## Deltaextraktion
<!-- id: deltaxtraktion · quellen: Karte DD8, DD8 3.1 · stand: 2026-10 -->

Extraktionsvariante im ETL, bei der nur die Änderungen seit dem letzten Lauf gelesen werden; sie braucht Änderungskennzeichen oder Zeitstempel.

### Erklärung
Statt jede Nacht den kompletten Bestand zu kopieren, liest der Ladelauf nur neue, geänderte und gelöschte Datensätze. Das spart Zeit, Netzlast und schont das Quellsystem. Voraussetzung ist, dass Änderungen erkennbar sind: über eine Spalte „geändert_am“, ein Änderungskennzeichen oder ein Änderungsprotokoll der Datenbank. Schwierig sind **Löschungen** – ein gelöschter Satz hat keinen Zeitstempel mehr, deshalb braucht man logisches Löschen oder ein Protokoll.

### Beispiel
```sql
SELECT * FROM bestellung
WHERE geaendert_am > '2026-10-05 02:00:00';
```
Der ETL-Lauf der Möbelhaus Nordholz GmbH merkt sich den Zeitpunkt des letzten erfolgreichen Laufs und holt nur, was danach geändert wurde.

### Abgrenzung
Die **Vollextraktion** liest alles: einfach und robust, aber langsam. Sinnvoll für kleine Tabellen oder als gelegentlicher Abgleich, wenn Deltas verloren gegangen sein könnten.

### Prüfungsfalle
Als Zeitmarke die Startzeit des **letzten erfolgreichen** Laufs verwenden – nicht die Endzeit, sonst gehen Änderungen während des Laufs verloren.

### Merksatz
Delta = nur das Neue – aber nur, wenn Neues erkennbar ist.

Siehe auch: Vollextraktion · E – Extract · ETL · Staging Area
Mehr: Deep Dive 8, 3.1

## Denormalisierung
<!-- id: denormalisierung · quellen: Karte DD2, DD2 Denormalisierung, DD8 4.2 · stand: 2026-10 -->

Bewusstes Zulassen von Redundanz (z. B. im Data Warehouse), um Abfragen schneller und einfacher zu machen.

### Erklärung
Normalisierung bis zur 3. NF vermeidet Redundanz und Anomalien – ideal für OLTP-Systeme, in denen viel geschrieben wird. Für Auswertungen sind die vielen Joins aber langsam und unverständlich. Im **Star-Schema** werden die Dimensionen deshalb denormalisiert: Warengruppe und Kategorie stehen direkt bei jedem Produkt. Weil das DWH per ETL kontrolliert befüllt und kaum geändert wird, drohen die üblichen Änderungsanomalien kaum.

### Beispiel
Statt `produkt → warengruppe → kategorie` (Snowflake) enthält `dim_produkt` der Möbelhaus Nordholz GmbH die Spalten `bezeichnung, warengruppe, kategorie`. Die Abfrage „Umsatz je Kategorie“ braucht einen Join weniger.

### Abgrenzung
| | normalisiert (OLTP) | denormalisiert (DWH) |
|---|---|---|
| Redundanz | vermieden | bewusst |
| Joins | viele | wenige |
| Optimiert auf | Schreiben, Konsistenz | Lesen, Verständlichkeit |

### Prüfungsfalle
Denormalisierung als „Fehler“ bewerten – im Analysekontext ist sie gewollt; nur das Core-DWH nach Inmon ist bewusst normalisiert.

### Merksatz
Normalisieren fürs Schreiben, denormalisieren fürs Lesen.

Siehe auch: Normalisierung · Star-Schema · Snowflake-Schema · Data Warehouse · OLTP
Mehr: Deep Dive 2, Denormalisierung · Deep Dive 8, 4.2

## Developers
<!-- id: developers · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Scrum-Verantwortlichkeit (bis Scrum Guide 2017 „Entwicklungsteam“): die Mitglieder des Scrum Teams, die in jedem Sprint ein nutzbares Inkrement erstellen.

### Erklärung
Die Developers erstellen den Plan für den Sprint (Sprint Backlog), halten die Definition of Done ein, passen ihren Plan täglich im Daily Scrum an und verantworten sich gegenseitig als Profis. Sie sind **selbstmanagend**: Sie entscheiden selbst, wer was wie umsetzt. „Developer“ meint jede Fachrichtung – auch Datenanalysten, Tester oder Designer. Zusammen mit Product Owner und Scrum Master bilden sie ein Scrum Team ohne Unterteams und Hierarchien (Scrum Guide 2020: typischerweise 10 oder weniger Personen).

### Beispiel
Im Dashboard-Projekt der Möbelhaus Nordholz GmbH sind eine Datenanalystin, ein ETL-Entwickler und eine Testerin die Developers; der Product Owner aus dem Vertrieb bestimmt die Reihenfolge im Product Backlog, nicht aber, wie sie arbeiten.

### Abgrenzung
| Verantwortlichkeit | Verantwortet |
|---|---|
| Product Owner | Wert des Produkts, Product Backlog |
| Scrum Master | Effektivität des Teams, Scrum-Einführung |
| Developers | nutzbares Inkrement je Sprint |

### Prüfungsfalle
Den Scrum Master als Vorgesetzten der Developers bezeichnen – er führt dienend, ohne Weisungsrecht.

### Merksatz
Developers liefern – jeden Sprint ein fertiges Inkrement.

Siehe auch: Scrum · Daily Scrum · Product Owner · Scrum Master · Inkrement
Mehr: Deep Dive 12, Teil 2

## Dezimal- und Tausendertrennzeichen
<!-- id: dezimal-und-tausendertrennzeichen · quellen: DD15 2.1 · stand: 2026-10 -->

Typische CSV-Importfalle: Deutsch „1.250,00“ (Punkt für Tausender, Komma für Dezimalstellen) gegenüber englisch „1250.00“ – gemischte Formate führen zu falschen Zahlen oder Importfehlern.

### Erklärung
Ein Programm mit englischer Ländereinstellung liest den Punkt als Dezimaltrennzeichen. Aus dem deutschen „1.250“ (eintausendzweihundertfünfzig) wird dann 1,25 – ein Faktor 1.000, ohne dass ein Fehler gemeldet wird. Umgekehrt kann „1,250“ als 1.250 gelesen werden. Deshalb Format beim Export und Import ausdrücklich festlegen, Stichproben und **Summenabgleich** gegen die Quelle durchführen. JSON und SQL verwenden immer den Punkt als Dezimaltrennzeichen und keine Tausendertrennzeichen.

### Beispiel
Ein CSV-Export der Möbelhaus Nordholz GmbH enthält „1.250,00“. Nach dem Import in ein englisch eingestelltes Analysewerkzeug ist der Monatsumsatz plötzlich nur noch ein Tausendstel – erst der Summenabgleich mit der Warenwirtschaft deckt den Fehler auf.

### Abgrenzung
Das **Trennzeichen** zwischen Feldern (Komma oder Semikolon) ist ein eigenes Problem; deutsche Excel-Exporte nutzen meist das Semikolon, gerade weil das Komma Dezimalzeichen ist.

### Prüfungsfalle
Zahlen sehen nach dem Import „plausibel“ aus – nur Abgleich mit Quellsummen zeigt Faktor-1.000-Fehler.

### Merksatz
Erst das Zahlenformat klären, dann rechnen.

Siehe auch: CSV · Trennzeichen · Zeichenkodierung · Keine Datentypen
Mehr: Deep Dive 15, 2.1

## DGIQ-Modell
<!-- id: dgiq-modell · quellen: DD9 Teil 1 · stand: 2026-10 -->

Datenqualitätsmodell der Deutschen Gesellschaft für Informations- und Datenqualität mit 15 IQ-Dimensionen in vier Kategorien, abgeleitet aus der Studie von Wang und Strong (MIT, 1996).

### Erklärung
Die vier Kategorien:
| Kategorie | Dimensionen |
|---|---|
| systemunterstützt | Zugänglichkeit, Bearbeitbarkeit |
| inhärent | hohes Ansehen, Fehlerfreiheit, Objektivität, Glaubwürdigkeit |
| darstellungsbezogen | Verständlichkeit, Übersichtlichkeit, einheitliche Darstellung, eindeutige Auslegbarkeit |
| zweckabhängig | Aktualität, Wertschöpfung, Vollständigkeit, angemessener Umfang, Relevanz |

Das Modell dient zum Zitieren und als Checkliste; in der Prüfung genügt es, die Kategorien und einige Dimensionen mit Beispiel zu nennen.

### Beispiel
Die Reparaturdaten der Möbelhaus Nordholz GmbH sind fehlerfrei (inhärent), aber nur per Excel-Export erreichbar (systemunterstützt: schlechte Zugänglichkeit) und mit uneinheitlichen Statusbezeichnungen (darstellungsbezogen).

### Abgrenzung
**ISO/IEC 25012** ist die genormte Alternative (ebenfalls 15 Merkmale, inhärent/systemabhängig); **DAMA-DMBOK** beschreibt das ganze Datenmanagement.

### Prüfungsfalle
Alle 15 Dimensionen auswendig lernen wollen – Kategorien plus fünf Dimensionen mit Prüf- und Sicherungsmaßnahme bringen mehr Punkte.

### Merksatz
DGIQ: 15 Dimensionen, 4 Kategorien – System, Inhalt, Darstellung, Zweck.

Siehe auch: Datenqualität · ISO/IEC 25012 · DAMA-DMBOK · Relevanz · Aktualität
Mehr: Deep Dive 9, Teil 1

## DGUV
<!-- id: dguv · quellen: Karte DD14, DD14 5.1 · stand: 2026-10 -->

Deutsche Gesetzliche Unfallversicherung – Spitzenverband der Berufsgenossenschaften und Unfallkassen; ihre Vorschriften regeln u. a. die Prävention und die Prüfung elektrischer Geräte.

### Erklärung
Die Unfallversicherung wird vom Arbeitgeber allein finanziert und trägt Leistungen bei Arbeits- und Wegeunfällen sowie Berufskrankheiten. Die DGUV und die Berufsgenossenschaften erlassen Unfallverhütungsvorschriften und überwachen deren Einhaltung – neben den staatlichen Arbeitsschutzbehörden (duales System). Prüfungsrelevant: **DGUV Vorschrift 1** (Grundsätze der Prävention, u. a. Unterweisung mindestens jährlich) und **DGUV Vorschrift 3** (regelmäßige Prüfung elektrischer Anlagen und Betriebsmittel – auch PCs, Netzteile, Monitore).

### Beispiel
In der IT-Abteilung der Möbelhaus Nordholz GmbH prüft eine Elektrofachkraft regelmäßig Monitore, Netzteile und Mehrfachsteckdosen nach DGUV Vorschrift 3 und versieht sie mit Prüfplaketten.

### Abgrenzung
**DGUV** = Spitzenverband; **Berufsgenossenschaft** = Träger der Unfallversicherung für eine Branche; **Arbeitsschutzbehörde** = staatliche Überwachung.

### Prüfungsfalle
Die Unfallversicherung als hälftig finanziert annehmen – der Arbeitgeber zahlt allein.

### Merksatz
DGUV V1 = Prävention, DGUV V3 = Elektroprüfung.

Siehe auch: Berufsgenossenschaft · Unfallversicherung · Duales System · Arbeitsschutz · Unterweisung
Mehr: Deep Dive 14, 5.1

## Dice
<!-- id: dice · quellen: Karte DD8, DD8 4.5 · stand: 2026-10 -->

OLAP-Operation, die mehrere Dimensionen gleichzeitig auf Bereiche einschränkt und so einen Teilwürfel herausschneidet.

### Erklärung
Ein OLAP-Würfel hat z. B. die Dimensionen Zeit, Produkt und Region. Beim **Dice** wird in mehreren Dimensionen gefiltert – heraus kommt ein kleinerer Würfel. In SQL entspricht das einer WHERE-Bedingung über mehrere Dimensionsattribute.

### Beispiel
Die Möbelhaus Nordholz GmbH betrachtet nur Kategorie Möbel **und** Region Nord **und** 1. Halbjahr 2026:
```sql
SELECT p.kategorie, f.region, z.monat, SUM(v.umsatz)
FROM fakt_verkauf v
JOIN dim_produkt p ON v.produkt_id = p.produkt_id
JOIN dim_filiale f ON v.filial_id = f.filial_id
JOIN dim_zeit z ON v.zeit_id = z.zeit_id
WHERE p.kategorie = 'Möbel' AND f.region = 'Nord'
  AND z.jahr = 2026 AND z.monat BETWEEN 1 AND 6
GROUP BY p.kategorie, f.region, z.monat;
```

### Abgrenzung
| Operation | Wirkung |
|---|---|
| Slice | **eine** Dimension auf **einen** Wert festlegen (Scheibe) |
| Dice | **mehrere** Dimensionen auf Bereiche einschränken (Teilwürfel) |
| Drill-down / Roll-up | Detailstufe wechseln |
| Pivot | Achsen tauschen |

### Prüfungsfalle
„Nur die Filialen der Region Nord“ ist ein Slice (eine Dimension, ein Wert), kein Dice.

### Merksatz
Slice schneidet eine Scheibe, Dice einen Würfel.

Siehe auch: Slice · Drill-down · Roll-up · Pivot / Rotate · OLAP-Würfel
Mehr: Deep Dive 8, 4.5

## Dienstvertrag
<!-- id: dienstvertrag · quellen: Karte DD14, DD14 2.4, DD13 3.1 · stand: 2026-10 -->

Vertrag (§ 611 BGB), bei dem eine Tätigkeit gegen Vergütung geschuldet ist – nicht ein bestimmter Erfolg.

### Erklärung
Der Dienstverpflichtete muss sorgfältig arbeiten, haftet aber nicht dafür, dass das gewünschte Ergebnis eintritt. Typische Dienstverträge sind Beratung, Schulung, Support nach Aufwand und der **Arbeitsvertrag** (§ 611a BGB, ein Dienstvertrag mit weisungsgebundener, persönlich abhängiger Arbeit). Es gibt keine Abnahme und keine Mängelgewährleistung wie beim Werkvertrag; bezahlt wird die geleistete Zeit.

### Beispiel
Die Möbelhaus Nordholz GmbH bucht eine Beraterin für 10 Tage „Unterstützung bei der Datenanalyse“ – Dienstvertrag. Bestellt sie dagegen „ein lauffähiges Dashboard mit fünf festgelegten Kennzahlen“, ist das ein Werkvertrag.

### Abgrenzung
| | Dienstvertrag | Werkvertrag |
|---|---|---|
| geschuldet | Tätigkeit | Erfolg (Werk) |
| Abnahme | keine | ja, mit Rechtsfolgen |
| Mängelrechte | nein | Nacherfüllung, Minderung, Rücktritt |

### Prüfungsfalle
Softwareentwicklung automatisch als Dienstvertrag einordnen – entscheidend ist, ob ein bestimmtes Ergebnis zugesagt wurde.

### Merksatz
Dienst = Bemühen, Werk = Ergebnis.

Siehe auch: Werkvertrag · Arbeitsvertrag · Kaufvertrag · Abnahme
Mehr: Deep Dive 14, 2.4 · Deep Dive 13, 3.1

## Differenzielle Sicherung
<!-- id: differenzielle-sicherung · quellen: Karte DD10, DD10 4.4 · stand: 2026-10 -->

Datensicherung, die alle Änderungen seit der letzten **Vollsicherung** sichert; zur Wiederherstellung braucht man die Vollsicherung und die letzte differenzielle Sicherung.
Auch: Differenziell

### Erklärung
Weil sich die Änderungen seit der Vollsicherung aufsummieren, wächst jede differenzielle Sicherung von Tag zu Tag. Dafür ist die Rücksicherung einfach: zwei Medien. Die Wahl des Verfahrens hängt am **RPO** (Datenverlust, der toleriert wird → Sicherungsfrequenz) und **RTO** (Wiederherstellungszeit).

### Beispiel
Die Möbelhaus Nordholz GmbH sichert sonntags voll, montags bis samstags differenziell. Fällt der Server am Donnerstag aus, wird die Sonntags-Vollsicherung plus die Mittwochs-Sicherung eingespielt. Die Mittwochs-Sicherung enthält alle Änderungen von Montag bis Mittwoch.

### Abgrenzung
| Verfahren | sichert | Rücksicherung |
|---|---|---|
| Vollsicherung | alles | 1 Medium |
| differenziell | seit letzter **Voll**sicherung | Voll + letzte differenzielle |
| inkrementell | seit letzter **Sicherung** | Voll + alle inkrementellen |

### Prüfungsfalle
Differenziell und inkrementell vertauschen – merk dir: inkrementell sichert am schnellsten, stellt am langsamsten wieder her; differenziell umgekehrt.

### Merksatz
Differenziell: immer seit der Vollsicherung – also wächst sie.

Siehe auch: Vollsicherung · Inkrementelle Sicherung · 3-2-1-Regel · RTO und RPO · Generationenprinzip (Großvater-Vater-Sohn)
Mehr: Deep Dive 10, 4.4

## Digitale Signatur
<!-- id: digitale-signatur · quellen: Karte DD10, DD10 4.2 · stand: 2026-10 -->

Verfahren, bei dem der Absender den Hashwert eines Dokuments mit seinem **privaten** Schlüssel signiert; jeder kann mit dem öffentlichen Schlüssel Authentizität und Integrität prüfen – nicht aber Vertraulichkeit.

### Erklärung
Ablauf: Hash des Dokuments bilden → Hash mit dem privaten Schlüssel signieren → Dokument und Signatur versenden. Der Empfänger bildet selbst den Hash und prüft die Signatur mit dem öffentlichen Schlüssel des Absenders. Stimmen beide überein, stammt das Dokument vom Inhaber des privaten Schlüssels und wurde nicht verändert. Dass der öffentliche Schlüssel wirklich zum Absender gehört, bestätigt ein **Zertifikat** einer Zertifizierungsstelle (PKI). Die qualifizierte elektronische Signatur unterstützt zusätzlich die Verbindlichkeit (Nichtabstreitbarkeit).

### Beispiel
Die Möbelhaus Nordholz GmbH signiert ihre E-Rechnungen digital. Ändert jemand unterwegs den Betrag, passt der Hash nicht mehr – die Prüfung schlägt fehl. Lesen kann die Rechnung aber jeder, der sie abfängt.

### Abgrenzung
| Ziel | Schlüssel |
|---|---|
| Signieren (Authentizität, Integrität) | privater Schlüssel des **Absenders** |
| Verschlüsseln (Vertraulichkeit) | öffentlicher Schlüssel des **Empfängers** |

### Prüfungsfalle
Behaupten, eine signierte Nachricht sei verschlüsselt – Signatur und Verschlüsselung sind getrennte Schritte.

### Merksatz
Signieren privat, prüfen öffentlich.

Siehe auch: Asymmetrische Verschlüsselung · Hashing · PKI · Integrität · Schutzziele
Mehr: Deep Dive 10, 4.2

## Dimensionsreduktion
<!-- id: dimensionsreduktion · quellen: DD6 2.2 · stand: 2026-11 -->

Verfahren, die viele Merkmale zu wenigen verdichten oder auf die wichtigsten beschränken (meist unüberwacht, z. B. PCA), ohne den Großteil der Information zu verlieren.

### Erklärung
Viele Merkmale machen Modelle langsam und anfälliger für Overfitting; zudem verlieren Abstände in sehr vielen Dimensionen an Aussagekraft („Fluch der Dimensionalität“). Dimensionsreduktion hilft auch beim Visualisieren (z. B. auf zwei Achsen) und beim Bündeln stark korrelierter Merkmale. Zwei Wege: **Merkmalsauswahl** lässt Merkmale weg (z. B. eines von zwei fast identischen); **Merkmalsextraktion** bildet aus den alten Merkmalen neue, weniger zahlreiche – das bekannteste Verfahren ist die **PCA**. Der Preis: Neu gebildete Merkmale sind schwerer zu deuten. Vorher werden die Merkmale skaliert.

### Beispiel
Kundendaten mit 8 Merkmalen. Umsatz netto und Umsatz brutto sind perfekt korreliert (r = 1,00), Anzahl Bestellungen und Anzahl Rechnungen fast (r = 0,98). Je eines der beiden Paare wird gestrichen: 8 − 2 = 6 Merkmale, also $\frac{2}{8} = 25\ \%$ weniger Spalten bei kaum weniger Information.

### Abgrenzung
Dimensionsreduktion verringert die **Spalten** (Merkmale), Clustering fasst **Zeilen** (Datensätze) zu Gruppen zusammen. Die „Dimension“ im Data Warehouse (Dimensionstabelle) ist etwas anderes.

### Prüfungsfalle
Dimensionsreduktion mit dem Löschen von Datensätzen gleichsetzen – es verschwinden Spalten, nicht Zeilen. Auch die „Dimension“ im Star-Schema ist nicht gemeint.

### Merksatz
Weniger Spalten, gleiche Aussage.

Siehe auch: PCA · Clustering · Unüberwachtes Lernen · Merkmal · Skalierung · Korrelation · Dimensionstabelle
Mehr: Deep Dive 6, 2.2

## Dimensionstabelle
<!-- id: dimensionstabelle · quellen: Karte DD8, DD8 4.1 · stand: 2026-10 -->

Tabelle im Data Warehouse mit den beschreibenden Merkmalen (Wer? Was? Wann? Wo?), entlang derer Kennzahlen ausgewertet werden.
Auch: Dimensionstabellen

### Erklärung
Um die zentrale **Faktentabelle** mit den Kennzahlen liegen im Star-Schema die Dimensionstabellen, z. B. Zeit, Produkt, Kunde und Filiale. Sie haben einen (meist künstlichen) Primärschlüssel, auf den die Faktentabelle per Fremdschlüssel verweist, und Attribute für Filter und Gruppierungen, oft als Hierarchie (Tag → Monat → Quartal → Jahr). Dimensionen sind im Star-Schema denormalisiert, vergleichsweise klein und werden über **Slowly Changing Dimensions** historisiert (Typ 2: neue Zeile mit Gültigkeitszeitraum und Surrogatschlüssel).

### Beispiel
`dim_filiale` der Möbelhaus Nordholz GmbH: filial_id (PK), filialname, stadt, region, land. Damit lässt sich der Umsatz aus `fakt_verkauf` je Region oder Land verdichten.

### Abgrenzung
| | Faktentabelle | Dimensionstabelle |
|---|---|---|
| Inhalt | Kennzahlen + Fremdschlüssel | beschreibende Merkmale |
| Größe | sehr groß | klein |
| Frage | Wie viel? | Wer, was, wann, wo? |

### Prüfungsfalle
Kennzahlen wie Umsatz in die Dimension oder Merkmale wie Kategorie in die Faktentabelle legen – häufigster Entwurfsfehler.

### Merksatz
Fakten zählen, Dimensionen beschreiben.

Siehe auch: Faktentabelle · Star-Schema · Surrogatschlüssel · Historisierung · Granularität
Mehr: Deep Dive 8, 4.1

## Direkt / indirekt
<!-- id: direkt-indirekt · quellen: DD12 4.1 · stand: 2026-10 -->

Gliederung der Projektkosten nach Zurechenbarkeit: direkte Kosten lassen sich dem Projekt unmittelbar zuordnen (z. B. Projektpersonal), indirekte nur anteilig über einen Schlüssel (Gemeinkosten).

### Erklärung
**Direkte Kosten** (in der Kostenrechnung: Einzelkosten) entstehen nachweislich für das Projekt: Stunden des Projektteams, gekaufte Lizenzen, externe Berater. **Indirekte Kosten** (Gemeinkosten) entstehen für mehrere Projekte oder das ganze Unternehmen – Miete, Verwaltung, IT-Infrastruktur – und werden per Zuschlag oder Verteilungsschlüssel umgelegt. In einer vollständigen Wirtschaftlichkeitsbetrachtung (TCO) gehören beide hinein.

### Beispiel
Im Dashboard-Projekt der Möbelhaus Nordholz GmbH sind 120 Stunden der Datenanalystin zu 60 € direkte Kosten (7.200 €). Ein Gemeinkostenzuschlag von 20 % für Arbeitsplatz und Verwaltung ergibt 1.440 € indirekte Kosten, zusammen 8.640 €.

### Abgrenzung
| Gliederung | Kriterium |
|---|---|
| direkt / indirekt | Zurechenbarkeit zum Projekt |
| fix / variabel | Abhängigkeit von der Menge |
| einmalig / laufend | zeitliches Anfallen |

### Prüfungsfalle
Direkt mit variabel gleichsetzen – Projektpersonal kann direkt **und** fix sein.

### Merksatz
Direkt = eindeutig zuordenbar, indirekt = per Schlüssel verteilt.

Siehe auch: Fix / variabel · Einmalig · Laufend · Total Cost of Ownership
Mehr: Deep Dive 12, 4.1

## Dirty Read
<!-- id: dirty-read · quellen: Karte DD15, DD15 4.2 · stand: 2026-10 -->

Anomalie bei parallelen Zugriffen: Eine Transaktion liest Daten, die eine andere geändert, aber noch nicht bestätigt (COMMIT) hat.

### Erklärung
Wird die schreibende Transaktion danach per ROLLBACK zurückgesetzt, hat die lesende mit einem Wert gearbeitet, den es nie gegeben hat. Dirty Reads sind nur in der Isolationsstufe **READ UNCOMMITTED** möglich; ab **READ COMMITTED** sind sie ausgeschlossen. Viele Datenbanken verwenden READ COMMITTED als Standard.

### Beispiel
Transaktion A setzt den Lagerbestand eines Bürostuhls der Möbelhaus Nordholz GmbH von 10 auf 0, Transaktion B liest 0 und meldet „ausverkauft“ an den Onlineshop. Danach bricht A mit ROLLBACK ab – der Bestand ist wieder 10, der Shop zeigt trotzdem „ausverkauft“.

### Abgrenzung
| Anomalie | Problem | verhindert ab |
|---|---|---|
| Dirty Read | liest Unbestätigtes | READ COMMITTED |
| Non-repeatable Read | gleiche Abfrage, anderer Wert | REPEATABLE READ |
| Phantom Read | neue Zeilen tauchen auf | SERIALIZABLE |
| Lost Update | Änderung geht verloren | Sperren, atomares Update |

### Prüfungsfalle
Dirty Read mit Non-repeatable Read verwechseln: Beim Dirty Read ist der gelesene Wert noch **nicht** committet.

### Merksatz
Dirty Read = Lesen, bevor der andere „fertig“ gesagt hat.

Siehe auch: Isolationsstufen · Non-repeatable Read · Phantom Read · Lost Update · ACID
Mehr: Deep Dive 15, 4.2

## Disaster Recovery
<!-- id: disaster-recovery · quellen: Karte DD10, DD10 5.4 · stand: 2026-10 -->

Wiederherstellung der IT nach einer Katastrophe (Brand, Hochwasser, flächiger Ausfall) – mit Ausweichrechenzentrum, Rücksicherung und festgelegter Reihenfolge des Wiederanlaufs.

### Erklärung
Disaster Recovery ist der technische Teil des **Notfallmanagements** (Business Continuity Management). Grundlage ist die **Business-Impact-Analyse**: Welche Prozesse sind kritisch, wie lange dürfen sie ausfallen (RTO), wie viel Datenverlust ist tolerierbar (RPO)? Daraus folgen Ausweichstandort (Georedundanz), Offsite-Backups, ein Wiederanlaufplan im Notfallhandbuch und regelmäßige **Notfallübungen** einschließlich getesteter Rücksicherung.

### Beispiel
Das Rechenzentrum der Möbelhaus Nordholz GmbH wird bei Hochwasser zerstört. Laut Wiederanlaufplan startet zuerst die Warenwirtschaft im Ausweichrechenzentrum aus der letzten Offsite-Sicherung (RTO 8 Stunden), das Reporting erst nach zwei Tagen.

### Abgrenzung
| Begriff | Fokus |
|---|---|
| Hochverfügbarkeit | Ausfälle im laufenden Betrieb abfangen (Redundanz) |
| Disaster Recovery | IT nach Katastrophe wiederherstellen |
| Business Continuity Management | Geschäftsprozesse insgesamt weiterführen |

### Prüfungsfalle
Ein Backup im selben Gebäude ist kein Disaster-Recovery-Konzept – es brennt mit.

### Merksatz
Disaster Recovery funktioniert nur, wenn sie geübt wurde.

Siehe auch: Notfallmanagement · Business-Impact-Analyse · RTO und RPO · Georedundanz · Notfallhandbuch
Mehr: Deep Dive 10, 5.4

## Discovery
<!-- id: discovery · quellen: Karte DD5, DD5 5.2 · stand: 2026-10 -->

Anwendungsart des Process Mining, die aus einem Event Log automatisch ein Prozessmodell erzeugt und so den tatsächlich gelebten Ist-Prozess ohne Vorannahmen zeigt.

### Erklärung
Ein Discovery-Algorithmus liest je Fall (Case ID) die Reihenfolge der Aktivitäten anhand der Zeitstempel und baut daraus einen Prozessgraphen mit Häufigkeiten. Sichtbar werden **Varianten** (wie viele verschiedene Wege es wirklich gibt), Schleifen (Nacharbeit), übersprungene Schritte und Engpässe. Gegenüber Interviews ist das Ergebnis objektiv und vollständig, erklärt aber nicht das **Warum** – deshalb kombiniert man beides.

### Beispiel
Aus 1.200 Reparaturaufträgen der Möbelhaus Nordholz GmbH erzeugt Discovery ein Modell mit 37 Varianten. Bei 18 % der Fälle taucht „Kostenvoranschlag erstellen“ zweimal auf – eine Nacharbeitsschleife, die im Soll-Prozess nicht vorgesehen ist.

### Abgrenzung
| Art | Eingabe | Ergebnis |
|---|---|---|
| Discovery | nur Event Log | Ist-Modell |
| Conformance Checking | Event Log + Soll-Modell | Abweichungen |
| Enhancement | Event Log + Modell | Modell mit Kennzahlen |

### Prüfungsfalle
Discovery setzt kein Soll-Modell voraus – wer „Abgleich mit dem Soll“ beschreibt, meint Conformance Checking.

### Merksatz
Discovery entdeckt, wie es wirklich läuft.

Siehe auch: Process Mining · Event Log · Conformance Checking · Enhancement · Case ID
Mehr: Deep Dive 5, 5.2

## Diversity Management
<!-- id: diversity-management · quellen: Karte DD26, DD26 Teil 5, DD32 Teil 5 · stand: 2026-11 -->

Unternehmensstrategie, die die Vielfalt der Beschäftigten (z. B. Alter, Geschlecht, Herkunft, Religion, Behinderung, sexuelle Orientierung) bewusst wahrnimmt, wertschätzt und als Potenzial für den Unternehmenserfolg nutzt.

Auch: Diversity, Vielfaltsmanagement

### Erklärung
Typische Vielfaltsdimensionen: Alter, ethnische Herkunft und Nationalität, Geschlecht und geschlechtliche Identität, körperliche und geistige Fähigkeiten, Religion und Weltanschauung, sexuelle Orientierung, soziale Herkunft. Das Ziel ist doppelt: **Benachteiligung vermeiden** und **Unterschiede nutzen**. Gemischte Teams bringen mehr Perspektiven, erreichen vielfältigere Kundengruppen, erleichtern die Gewinnung von Fachkräften und stärken die Arbeitgeberattraktivität.

Typische Maßnahmen: merkmalsneutrale Stellenausschreibungen, Bewerbungsverfahren nach Qualifikation, barrierefreie Arbeitsplätze, flexible Arbeitszeitmodelle, Mentoring, Schulungen gegen Vorurteile. Möglich sind Spannungen und Mehraufwand; Quoten sind nur ein mögliches Instrument, nicht das Konzept selbst.

### Beispiel
Die Möbelhaus Nordholz GmbH schreibt eine Stelle in der IT ohne Alters- und Geschlechtshinweise aus, wählt nur nach Qualifikation, richtet einen höhenverstellbaren Arbeitsplatz für eine Mitarbeiterin im Rollstuhl ein und bietet Teilzeit für Eltern an. So verbindet sie die Rechtspflicht des AGG mit dem freiwilligen Ziel, aus der Vielfalt Nutzen zu ziehen.

### Abgrenzung
Das **AGG** ist zwingendes Recht und verbietet Benachteiligung wegen sechs Merkmalen; Diversity Management geht darüber hinaus und ist freiwillig. Die AGG-Merkmale umfassen nicht Schulabschluss, Berufserfahrung oder Qualifikation – danach darf ausgewählt werden.

### Prüfungsfalle
Diversity Management als Auswahl nach Herkunft, als Streben nach möglichst einheitlichen Teams oder als Personalabbau missverstehen. Richtig: Vielfalt als Potenzial nutzen und Benachteiligung vermeiden.

### Merksatz
Vielfalt nutzen statt nur Benachteiligung verbieten.

Siehe auch: AGG · Compliance · Arbeitgeberpflichten · Nachhaltigkeit
Mehr: Deep Dive 26, Teil 5 · Deep Dive 32, Teil 5 · Deep Dive 13, 6.1

## DMAIC
<!-- id: dmaic · quellen: Karte DD5, DD5 6.3 · stand: 2026-10 -->

Vorgehensmodell von Six Sigma in fünf Phasen: Define – Measure – Analyze – Improve – Control.

### Erklärung
**Define:** Problem, Ziel, Kunden und Prozessgrenzen festlegen (z. B. mit SIPOC). **Measure:** Ist-Zustand mit Kennzahlen messen (DPMO, Durchlaufzeit, Fehlerquote). **Analyze:** Ursachen mit Daten nachweisen (Ishikawa, Pareto, Korrelation, Regression). **Improve:** Lösungen entwickeln und erproben. **Control:** Verbesserung absichern, standardisieren und dauerhaft überwachen (z. B. Regelkarten). Measure und Analyze sind Statistik – das Kerngebiet von Datenanalysten.

### Beispiel
Die Möbelhaus Nordholz GmbH will die Reklamationsquote im Reparaturservice senken: Define – Ziel unter 3 %; Measure – aktuell 30.000 DPMO; Analyze – Pareto zeigt falsch bestellte Ersatzteile als Hauptursache; Improve – Teilenummer per Scanner statt Handeingabe; Control – monatliches Monitoring der Quote.

### Abgrenzung
**PDCA** hat vier Schritte und ist ein allgemeiner Verbesserungskreislauf; DMAIC ist das strukturierte, datengetriebene Projektvorgehen von Six Sigma mit eigener Mess- und Kontrollphase.

### Prüfungsfalle
Improve vor Analyze setzen – Lösungen ohne nachgewiesene Ursache sind geraten.

### Merksatz
Definieren, messen, verstehen, verbessern, halten.

Siehe auch: Six Sigma · DPMO · PDCA · SIPOC · Ishikawa-Diagramm
Mehr: Deep Dive 5, 6.3

## DML
<!-- id: dml · quellen: Karte DD1, DD1 2.4 · stand: 2026-10 -->

Data Manipulation Language: SQL-Befehle, die Daten in bestehenden Tabellen bearbeiten – INSERT, UPDATE, DELETE; SELECT wird je nach Einteilung zur DML gezählt oder als eigene DQL geführt.

### Erklärung
DML-Befehle ändern Inhalte, nicht Strukturen. Sie laufen in Transaktionen: COMMIT bestätigt, ROLLBACK verwirft (ACID). Besonders gefährlich sind UPDATE und DELETE **ohne WHERE** – sie treffen die gesamte Tabelle.

### Beispiel
```sql
INSERT INTO kunde (kunden_id, name, ort, registriert_am)
VALUES (6, 'Krause OHG', 'Bremen', '2026-07-06');
UPDATE produkt SET preis = 259.00 WHERE produkt_id = 10;
DELETE FROM bestellposition WHERE bestell_id = 105;
```

### Abgrenzung
| Befehl | Gruppe | Wirkung |
|---|---|---|
| DELETE | DML | löscht Zeilen, per ROLLBACK umkehrbar |
| TRUNCATE | DDL | leert die ganze Tabelle, kein WHERE |
| DROP | DDL | entfernt Tabelle samt Struktur |

### Prüfungsfalle
TRUNCATE als DML einordnen – es ist DDL und in manchen Systemen (MySQL, Oracle) nicht per ROLLBACK umkehrbar.

### Merksatz
DML ändert den Inhalt, DDL die Hülle.

Siehe auch: DDL · Transaktion · ACID · WHERE
Mehr: Deep Dive 1, 2.4 · Deep Dive 1, 3.9

## Dokumentenorientierte Datenbank
<!-- id: dokumentenorientierte-datenbank · quellen: Karte DD15, DD15 4.1 · stand: 2026-10 -->

NoSQL-Datenbanktyp, der Daten als JSON-ähnliche Dokumente mit flexiblem Schema speichert (z. B. MongoDB).

### Erklärung
Ein Dokument fasst zusammengehörige Daten verschachtelt zusammen – etwa eine Bestellung samt Positionen –, statt sie auf mehrere Tabellen zu verteilen. Dokumente einer Sammlung dürfen unterschiedliche Felder haben. Das passt zu wechselnden Attributen und wird häufig horizontal skaliert.

Ein Dokument besteht aus **Feldern** (`"name": wert`). Ein Feld kann ein einfacher Wert, ein **Objekt** `{ }` (verschachteltes Dokument) oder ein **Array** `[ ]` (Liste von Werten oder Objekten) sein. Bei zusammengehörigen Daten hat man zwei Gestaltungsmöglichkeiten:
- **Einbetten:** Die Unterdaten stehen als Array oder Objekt im übergeordneten Dokument (Bestellung mit ihren Positionen). Eine einzige Abfrage liefert alles, ein Fremdschlüssel entfällt. Geeignet, wenn die Daten fast immer gemeinsam gelesen werden und ihre Anzahl begrenzt bleibt.
- **Verweisen:** Das Dokument enthält nur die Kennung eines anderen Dokuments (wie ein Fremdschlüssel). Geeignet, wenn die Unterdaten von vielen Dokumenten genutzt, einzeln geändert werden oder unbegrenzt wachsen (ein Dokument darf je System nur begrenzt groß sein, bei MongoDB 16 MB). Die Datenbank prüft solche Verweise nicht auf Gültigkeit – das muss die Anwendung tun.

Preis der Flexibilität: Die Datenbank prüft bei **Schema-on-Read** keine Pflichtfelder oder Typen – das muss die Anwendung oder eine optional eingerichtete Schemaprüfung (z. B. JSON Schema) übernehmen. Viele Systeme sind nur **eventually consistent** (BASE).

### Beispiel
Im Produktkatalog der Möbelhaus Nordholz GmbH hat ein Bürostuhl „Sitzhöhe“ und „Belastbarkeit“, ein Monitor „Diagonale“ und „Auflösung“. In einer Dokumentdatenbank bekommt jedes Produkt einfach seine eigenen Felder – ohne leere Spalten.

Eine Bestellung als Dokument – die Positionen sind als **Array eingebettet**, der Kunde wird **verwiesen**:
```json
{
  "bestell_id": 4711,
  "kunden_id": 1042,
  "positionen": [
    { "artikel": "Bürostuhl Nova", "menge": 2, "preis": 189.00 },
    { "artikel": "Schreibtisch Lund", "menge": 1, "preis": 349.00 }
  ]
}
```
Die Positionen gehören nur zu dieser Bestellung und werden immer mit ihr gelesen, deshalb stehen sie im Array; der Kunde hat viele Bestellungen und ändert seine Adresse einmal zentral, deshalb steht nur `kunden_id` im Dokument. In einer relationalen Datenbank wären das drei Tabellen (kunde, bestellung, position) mit zwei Fremdschlüsseln.

### Abgrenzung
In der Fachsprache entspricht der Datenbank die Datenbank, der Tabelle die **Collection**, der Zeile das **Dokument** und der Spalte das **Feld**.

| Typ | Beispiel | geeignet für |
|---|---|---|
| dokumentenorientiert | MongoDB | wechselnde Attribute |
| Key-Value | Redis | Sitzungen, Caches |
| Wide Column | Cassandra | riesige Schreiblasten |
| Graph | Neo4j | Beziehungsnetze |

### Prüfungsfalle
Für Buchhaltung oder Lagerbestände ohne Prüfung der Konsistenzanforderung NoSQL wählen – dort ist ACID Pflicht. Und beim Entwurf Einbetten und Verweisen vermischen: Wer alles einbettet, speichert dieselben Kundendaten in jeder Bestellung doppelt und muss Änderungen überall nachziehen.

### Merksatz
Ein Dokument je Sache, Regeln bringt die Anwendung mit – eingebettet, was zusammengehört, verwiesen, was geteilt wird.

Siehe auch: NoSQL · Relationale Datenbank · JSON · Schema-on-Read · BASE · Key-Value-Datenbank
Mehr: Deep Dive 15, 4.1 · Deep Dive 30, 4.3

## DPMO
<!-- id: dpmo · quellen: Karte DD5, DD5 6.3 · stand: 2026-10 -->

Defects per Million Opportunities: Fehler je eine Million Fehlermöglichkeiten; Six-Sigma-Ziel sind höchstens 3,4 DPMO.

### Erklärung
$\text{DPMO} = \frac{\text{Fehler}}{\text{Einheiten} \cdot \text{Fehlermöglichkeiten je Einheit}} \cdot 1.000.000$
Durch den Bezug auf Fehlermöglichkeiten werden einfache und komplexe Produkte vergleichbar. Grobe Richtwerte (mit der üblichen Annahme einer langfristigen Verschiebung um 1,5 Sigma): 3 Sigma ≈ 66.800 DPMO, 4 Sigma ≈ 6.200 DPMO, 6 Sigma = 3,4 DPMO.

### Beispiel
200 Reparaturaufträge der Möbelhaus Nordholz GmbH mit je 5 Fehlermöglichkeiten, 30 Fehler gefunden:
$\frac{30}{200 \cdot 5} \cdot 1.000.000 = 30.000$ DPMO – zwischen 3 und 4 Sigma, weit entfernt von 3,4.

### Abgrenzung
Die **Fehlerquote** bezieht Fehler auf Einheiten (fehlerhafte Fälle / alle Fälle), DPMO auf Fehlermöglichkeiten. Im Beispiel können 30 Fehler auf 30 oder weniger Aufträge fallen.

### Prüfungsfalle
Die Fehlermöglichkeiten je Einheit im Nenner vergessen – dann ergibt sich 150.000 statt 30.000.

### Merksatz
DPMO zählt Fehler je Million Chancen, nicht je Million Stück.

Siehe auch: Six Sigma · DMAIC · Fehlerquote · First Pass Yield
Mehr: Deep Dive 5, 6.3

## Drei Säulen
<!-- id: drei-saulen · quellen: DD14 5.2 · stand: 2026-10 -->

Drei-Säulen-Modell der Nachhaltigkeit: ökologische, ökonomische und soziale Ziele sind gleichrangig zu verfolgen; Rahmen sind die 17 Nachhaltigkeitsziele (SDGs) der Agenda 2030.

### Erklärung
Nachhaltig ist ein Unternehmen nur, wenn es Umwelt schont (ökologisch), dauerhaft wirtschaftlich tragfähig ist (ökonomisch) und Menschen fair behandelt (sozial). Investoren und Banken bewerten diese Aspekte über **ESG**-Kriterien; große Unternehmen berichten darüber nach der CSRD. In der IT konkretisiert sich die ökologische Säule als **Green IT**.

### Beispiel
Die Möbelhaus Nordholz GmbH verlängert die Nutzungsdauer ihrer Notebooks (ökologisch, spart zugleich Kosten – ökonomisch) und bietet ergonomische Arbeitsplätze und Weiterbildung (sozial).

### Abgrenzung
Nicht verwechseln mit dem **Drei-Säulen-Modell der Altersvorsorge** (gesetzliche, betriebliche, private Vorsorge) – gleicher Name, anderes Thema.

### Prüfungsfalle
Die Säulen als Rangfolge darstellen („erst Wirtschaft, dann Umwelt“) – sie sind gleichrangig.

### Merksatz
Umwelt, Wirtschaft, Soziales – auf gleicher Höhe.

Siehe auch: Nachhaltigkeit · ESG · Green IT · CSRD · Drei-Säulen-Modell der Altersvorsorge
Mehr: Deep Dive 14, 5.2

## Drei-Säulen-Modell der Altersvorsorge
<!-- id: drei-saulen-modell-der-altersvorsorge · quellen: Karte DD14, DD14 1.5 · stand: 2026-10 -->

Gliederung der Altersvorsorge in gesetzliche Rente, betriebliche Altersversorgung und private Vorsorge.

### Erklärung
**1. Säule:** gesetzliche Rentenversicherung im Umlageverfahren – die Beiträge der Erwerbstätigen finanzieren die laufenden Renten (Generationenvertrag). **2. Säule:** betriebliche Altersversorgung, z. B. Entgeltumwandlung mit Arbeitgeberzuschuss. **3. Säule:** private Vorsorge wie private Rentenversicherung, Fonds oder Immobilien. Weil die gesetzliche Rente den Lebensstandard allein meist nicht sichert, gewinnen die zweite und dritte Säule an Bedeutung.

### Beispiel
Herr Kaya, Lagermitarbeiter der Möbelhaus Nordholz GmbH, zahlt 9,3 % seines Bruttos in die gesetzliche Rentenversicherung (Stand 2026), wandelt monatlich 100 € in eine Betriebsrente um, zu der der Arbeitgeber einen Zuschuss leistet, und spart zusätzlich in einen Fondssparplan.

### Abgrenzung
| Säule | Finanzierung |
|---|---|
| gesetzlich | Pflichtbeiträge AG/AN je zur Hälfte, Umlage |
| betrieblich | Arbeitgeber und/oder Entgeltumwandlung, kapitalgedeckt |
| privat | eigener Beitrag, kapitalgedeckt |

### Prüfungsfalle
Die gesetzliche Rente als kapitalgedeckt beschreiben – sie arbeitet im Umlageverfahren.

### Merksatz
Staat, Betrieb, privat – drei Säulen tragen die Rente.

Siehe auch: Gesetzliche Rente · Betriebliche Altersversorgung · Private Vorsorge · Umlageverfahren · Rentenversicherung
Mehr: Deep Dive 14, 1.5

## Drei-Zeiten-Methode
<!-- id: drei-zeiten-methode · quellen: Karte DD12, DD12 3.1 · stand: 2026-10 -->

Schätzverfahren aus PERT, das aus einer optimistischen, einer wahrscheinlichen und einer pessimistischen Schätzung einen gewichteten Erwartungswert bildet.

### Erklärung
$t_e = \frac{o + 4 \cdot m + p}{6}$
Der wahrscheinlichste Wert zählt vierfach, die Extremwerte je einfach. Weil der pessimistische Wert meist weiter entfernt liegt als der optimistische, zieht er die Schätzung nach oben – gewollt, denn Aufwände werden systematisch unterschätzt. Die Unsicherheit zeigt die Standardabweichung $\sigma = \frac{p - o}{6}$.

### Beispiel
Das Arbeitspaket „ETL-Strecke Umsatzdaten“ der Möbelhaus Nordholz GmbH: o = 4, m = 7, p = 16 Tage.
$t_e = \frac{4 + 4 \cdot 7 + 16}{6} = \frac{48}{6} = 8$ Tage, $\sigma = \frac{16 - 4}{6} = 2$ Tage.

### Abgrenzung
Analogieschätzung vergleicht mit ähnlichen Projekten, Expertenschätzung beruht auf Erfahrung, **Planning Poker** schätzt relativ in Story Points; die Drei-Zeiten-Methode liefert einen Zeitwert mit Unsicherheitsmaß.

### Prüfungsfalle
Das einfache Mittel $\frac{4 + 7 + 16}{3} = 9$ rechnen – die Gewichtung 1 : 4 : 1 und der Nenner 6 sind entscheidend.

### Merksatz
Eins plus vier plus eins, geteilt durch sechs.

Siehe auch: Schätzverfahren · Arbeitspaket · Projektstrukturplan · Netzplan · Erwartungswert
Mehr: Deep Dive 12, 3.1

## Dreiwertige Logik
<!-- id: dreiwertige-logik · quellen: Karte DD1, DD1 1.2, DD1 3.1 · stand: 2026-10 -->

In SQL ergibt eine Bedingung wahr, falsch oder UNKNOWN; jeder Vergleich mit NULL ist UNKNOWN, und WHERE übernimmt nur Zeilen, deren Bedingung wahr ist.

### Erklärung
NULL bedeutet „unbekannt“, nicht 0 und nicht leerer Text. Deshalb ist `telefon = NULL` nie wahr, auch `NOT (telefon = NULL)` bleibt UNKNOWN. Geprüft wird mit `IS NULL` bzw. `IS NOT NULL`. Verknüpfungen: `wahr AND UNKNOWN = UNKNOWN`, `falsch AND UNKNOWN = falsch`, `wahr OR UNKNOWN = wahr`. Aggregatfunktionen wie SUM und AVG ignorieren NULL.

### Beispiel
```sql
SELECT * FROM kunde
WHERE kunden_id NOT IN (SELECT kunden_id FROM bestellung);
```
Enthält die Unterabfrage auch nur ein NULL, liefert die Abfrage **keine einzige Zeile** – jeder NOT-IN-Vergleich wird UNKNOWN. Sicher ist `NOT EXISTS` oder `WHERE kunden_id IS NOT NULL` in der Unterabfrage.

### Abgrenzung
Die **zweiwertige** Logik kennt nur wahr/falsch; im Pseudocode und in den meisten Programmiersprachen gilt sie, in SQL wegen NULL nicht.

### Prüfungsfalle
`WHERE email = NULL` schreiben – richtig ist `WHERE email IS NULL`.

### Merksatz
Mit NULL vergleicht man nicht, man prüft auf NULL.

Siehe auch: NULL · NOT IN mit NULL · COALESCE · NULL-Logik (Prüferklassiker) · WHERE
Mehr: Deep Dive 1, 1.2 · Deep Dive 1, 3.1

## Drill-down
<!-- id: drill-down · quellen: Karte DD8, DD8 4.5 · stand: 2026-10 -->

OLAP-Operation, die zu einer feineren Detailstufe einer Dimensionshierarchie wechselt (z. B. Jahr → Quartal → Monat).

### Erklärung
Dimensionen haben Hierarchien, etwa Zeit (Jahr – Quartal – Monat – Tag) oder Ort (Land – Region – Filiale). Beim Drill-down wird eine verdichtete Zahl aufgeschlüsselt, um Ursachen zu finden. Möglich ist das nur bis zur **Granularität** der Faktentabelle – was nicht feiner gespeichert ist, lässt sich nicht aufschlüsseln.

### Beispiel
Der Jahresumsatz 2026 der Region Nord der Möbelhaus Nordholz GmbH ist eingebrochen. Drill-down auf Quartale zeigt: nur Q2 ist schwach; weiter auf Filialen: nur Filiale Bremen – dort war die Ausstellung wegen Umbau geschlossen.

### Abgrenzung
| Operation | Richtung |
|---|---|
| Drill-down | gröber → feiner |
| Roll-up (Drill-up) | feiner → gröber |
| Slice / Dice | filtern, nicht Detailstufe wechseln |

### Prüfungsfalle
„Zeig mir das Jahresergebnis aufgeschlüsselt nach Quartalen“ ist Drill-down; „Filialumsätze zu Regionsumsätzen zusammenfassen“ ist Roll-up.

### Merksatz
Drill-down bohrt in die Tiefe.

Siehe auch: Roll-up · Slice · Dice · Granularität · OLAP-Würfel
Mehr: Deep Dive 8, 4.5

## Drittvariable
<!-- id: drittvariable · quellen: Karte DD4, DD4 1.3 · stand: 2026-10 -->

Eine dritte Größe (Confounder), die zwei Merkmale gleichzeitig beeinflusst und so eine Korrelation zwischen ihnen erzeugt, obwohl sie sich nicht gegenseitig verursachen.

### Erklärung
Ein hoher Korrelationskoeffizient lässt vier Erklärungen zu: x verursacht y, y verursacht x, eine **Drittvariable** wirkt auf beide, oder Zufall/Scheinkorrelation. Für Kausalität sprechen zeitliche Abfolge, ein plausibler Wirkmechanismus, ein kontrolliertes Experiment (A/B-Test) und Stabilität über Zeiträume und Teilgruppen. Drittvariablen lassen sich prüfen, indem man die Korrelation getrennt nach Gruppen der vermuteten Drittvariable berechnet.

### Beispiel
Bei der Möbelhaus Nordholz GmbH korreliert die Zahl der Servicefahrzeuge mit r = 0,91 mit dem Jahresumsatz. Drittvariable: das Unternehmenswachstum (mehr Filialen) – es erhöht beide. Mehr Fahrzeuge zu kaufen erhöht den Umsatz nicht automatisch. Klassiker: Eisverkauf und Sonnenbrände, Ursache Sonne.

### Abgrenzung
**Scheinkorrelation** ist der Oberbegriff für Korrelationen ohne ursächlichen Zusammenhang; die Drittvariable ist eine ihrer Ursachen, Zufall die andere.

### Prüfungsfalle
Aus einem hohen r eine Handlungsempfehlung ableiten, ohne eine Drittvariable zu prüfen.

### Merksatz
Korrelation ≠ Kausalität – oft steckt eine Dritte dahinter.

Siehe auch: Scheinkorrelation · Kausalität · Korrelation · Zufall / Scheinkorrelation · Korrelationskoeffizient nach Pearson
Mehr: Deep Dive 4, 1.3

## DSGVO
<!-- id: dsgvo · quellen: Karte DD10, DD10 Teil 1, DD10 Teil 2, DD5 5.4 · stand: 2026-10 -->

Datenschutz-Grundverordnung der EU (seit 25.05.2018 anwendbar): regelt die Verarbeitung personenbezogener Daten natürlicher Personen mit Grundsätzen, Rechtsgrundlagen, Betroffenenrechten und Pflichten der Verantwortlichen.

### Erklärung
Als EU-Verordnung gilt sie unmittelbar; das **BDSG** ergänzt sie nur in Öffnungsklauseln. Kernelemente: **Grundsätze** (Art. 5: Rechtmäßigkeit/Transparenz, Zweckbindung, Datenminimierung, Richtigkeit, Speicherbegrenzung, Integrität und Vertraulichkeit, Rechenschaftspflicht), **Rechtsgrundlagen** (Art. 6: eine von sechs muss greifen), **Betroffenenrechte** (Art. 12–22, Antwort binnen eines Monats), **Pflichten** wie Privacy by Design (Art. 25), Auftragsverarbeitung (Art. 28), Verzeichnis (Art. 30), TOM (Art. 32), Meldung von Datenpannen in 72 Stunden (Art. 33/34), DSFA (Art. 35), Datenschutzbeauftragter (Art. 37–39). Bußgelder bis 20 Mio. € oder 4 % des weltweiten Jahresumsatzes (Art. 83), der höhere Wert gilt.

### Beispiel
Die Lieferadresse eines Kunden der Möbelhaus Nordholz GmbH verarbeitet das Unternehmen zur Vertragserfüllung (Art. 6 Abs. 1 lit. b), den Newsletter nur mit Einwilligung (lit. a).

### Abgrenzung
Anonymisierte Daten fallen nicht unter die DSGVO, pseudonymisierte schon. Daten juristischer Personen sind nicht geschützt, die ihrer Ansprechpartner schon.

### Prüfungsfalle
Die Einwilligung als einzige Rechtsgrundlage nennen – es gibt sechs.

### Merksatz
Ohne Rechtsgrundlage keine Verarbeitung – und alles muss nachweisbar sein.

Siehe auch: Personenbezogene Daten · Rechtsgrundlagen · Betroffenenrechte · BDSG · Datenpanne
Mehr: Deep Dive 10, Teil 1 · Deep Dive 10, Teil 2 · Deep Dive 5, 5.4

## DTD
<!-- id: dtd · quellen: Karte DD15, DD15 2.3 · stand: 2026-10 -->

Document Type Definition: ältere Schemasprache für XML, die erlaubte Elemente, Attribute und ihre Verschachtelung festlegt, aber kaum Datentypen kennt.

### Erklärung
Ein XML-Dokument ist **valide**, wenn es wohlgeformt ist und einem Schema entspricht – einer DTD oder einem **XSD**. Die DTD hat eine eigene, nicht-XML-Syntax und unterscheidet bei Inhalten im Wesentlichen nur Text (`#PCDATA`); Zahlen, Datumswerte oder Wertebereiche kann sie nicht prüfen. Deshalb wird heute meist XSD verwendet.

### Beispiel
```xml
<!DOCTYPE kunde [
  <!ELEMENT kunde (name, ort)>
  <!ATTLIST kunde id CDATA #REQUIRED>
  <!ELEMENT name (#PCDATA)>
  <!ELEMENT ort (#PCDATA)>
]>
<kunde id="1"><name>Huber GmbH</name><ort>München</ort></kunde>
```

### Abgrenzung
| | DTD | XSD |
|---|---|---|
| Syntax | eigene | selbst XML |
| Datentypen | kaum | umfangreich (integer, date, decimal …) |
| Verbreitung | älter | heute Standard |

### Prüfungsfalle
Wohlgeformt mit valide gleichsetzen – ohne DTD oder XSD lässt sich Validität gar nicht prüfen.

### Merksatz
DTD prüft die Struktur, XSD auch die Typen.

Siehe auch: XML · XSD · Valide · Wohlgeformt
Mehr: Deep Dive 15, 2.3

## Duale Ausbildung
<!-- id: duale-ausbildung · quellen: Karte DD13, DD13 1.1 · stand: 2026-10 -->

Berufsausbildung an zwei Lernorten: im Betrieb nach der Ausbildungsordnung und in der Berufsschule nach dem Rahmenlehrplan.

### Erklärung
Der **Ausbildungsbetrieb** vermittelt die Praxis nach der Ausbildungsordnung, die das zuständige Bundesministerium erlässt. Die **Berufsschule** vermittelt Fachtheorie und Allgemeinbildung nach dem Rahmenlehrplan der Kultusministerkonferenz. Die **IHK** als zuständige Stelle überwacht die Ausbildung, führt das Verzeichnis der Ausbildungsverhältnisse und nimmt die Prüfungen ab. Rechtsgrundlage ist das Berufsbildungsgesetz (BBiG), für Minderjährige zusätzlich das JArbSchG.

### Beispiel
Jonas Brandt lernt bei der Möbelhaus Nordholz GmbH Fachinformatiker für Daten- und Prozessanalyse: an drei bis vier Tagen pro Woche im Betrieb, sonst in der Berufsschule; die Abschlussprüfung nimmt der Prüfungsausschuss der IHK ab.

### Abgrenzung
| Beteiligter | Grundlage | Aufgabe |
|---|---|---|
| Betrieb | Ausbildungsordnung | Praxis |
| Berufsschule | Rahmenlehrplan | Theorie |
| IHK | BBiG | überwachen, prüfen |

### Prüfungsfalle
Die IHK als Erlasser der Ausbildungsordnung nennen – das ist das Bundesministerium.

### Merksatz
Zwei Lernorte, zwei Pläne, eine Prüfung bei der IHK.

Siehe auch: BBiG · Ausbildungsordnung · Rahmenlehrplan · Berufsschule · IHK
Mehr: Deep Dive 13, 1.1

## Duales System
<!-- id: duales-system · quellen: DD14 5.1 · stand: 2026-10 -->

Doppelte Struktur des Arbeitsschutzes in Deutschland: Staatliche Arbeitsschutzbehörden überwachen die Gesetze, die Berufsgenossenschaften (Unfallversicherungsträger) erlassen Unfallverhütungsvorschriften und kontrollieren ebenfalls.

### Erklärung
**Staatliche Säule:** Arbeitsschutzgesetz, Arbeitsstättenverordnung, Arbeitszeitgesetz u. a.; überwacht von den Arbeitsschutzbehörden der Länder (Gewerbeaufsicht, Amt für Arbeitsschutz). **Autonome Säule:** Berufsgenossenschaften und Unfallkassen, Spitzenverband DGUV; sie erlassen Unfallverhütungsvorschriften wie DGUV Vorschrift 1 (Grundsätze der Prävention) und DGUV Vorschrift 3 (Prüfung elektrischer Geräte), beraten und kontrollieren Betriebe. Der Arbeitgeber trägt die Verantwortung: Gefährdungsbeurteilung, Schutzmaßnahmen, Unterweisung.

### Beispiel
Bei der Möbelhaus Nordholz GmbH prüft das Landesamt für Arbeitsschutz die Arbeitszeiten im Lager, die Berufsgenossenschaft besichtigt die Bildschirmarbeitsplätze und die Elektroprüfung nach DGUV Vorschrift 3.

### Abgrenzung
Gleicher Name, anderes Thema: die **Duale Ausbildung** (Betrieb + Berufsschule) und das „Duale System“ der Verpackungsentsorgung.

### Prüfungsfalle
Die Berufsgenossenschaft als staatliche Behörde bezeichnen – sie ist eine selbstverwaltete Körperschaft der Unfallversicherung.

### Merksatz
Staat überwacht Gesetze, BG überwacht Unfallverhütungsvorschriften.

Siehe auch: Arbeitsschutz · Berufsgenossenschaft · DGUV · Unfallversicherung · Gefährdungsbeurteilung
Mehr: Deep Dive 14, 5.1

## Dublette
<!-- id: dublette · quellen: Karte DD9, DD9 4.2 · stand: 2026-10 -->

Mehrfach erfasste Realweltentität, z. B. derselbe Kunde zweimal mit abweichender Schreibweise.

### Erklärung
**Exakte Dubletten** (identische Werte) findet man mit GROUP BY … HAVING COUNT(*) > 1 und verhindert sie per UNIQUE-Constraint. Schwierig sind **unscharfe Dubletten**: „Braun GmbH“ und „Braun G.m.b.H.“, „Müller“ und „Mueller“, „Str.“ und „Straße“. Sie verletzen die Dimension **Eindeutigkeit**, verfälschen Kundenzahlen und Umsätze je Kunde und verursachen doppelte Post.

### Beispiel
```sql
SELECT email, COUNT(*) AS anzahl
FROM kunde
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;
```
Ohne `WHERE email IS NOT NULL` erschienen alle Kunden der Möbelhaus Nordholz GmbH ohne E-Mail als eine vermeintliche Dublettengruppe.

### Abgrenzung
Eine Dublette betrifft **dieselbe** Entität; zwei verschiedene Kunden mit gleichem Namen sind keine Dublette (Homonym). **Redundanz** in einer Tabelle (gleicher Ort in vielen Zeilen) ist ebenfalls keine Dublette.

### Prüfungsfalle
Den UNIQUE-Constraint als Lösung für alle Dubletten nennen – er erkennt nur exakt gleiche Werte.

### Merksatz
Eine Entität, mehrere Sätze – das ist eine Dublette.

Siehe auch: Dublettenbereinigung · Eindeutigkeit · Golden Record · UNIQUE-Constraint · Record Linkage
Mehr: Deep Dive 9, 4.2

## Dublettenbereinigung
<!-- id: dublettenbereinigung · quellen: Karte DD9, DD9 4.2 · stand: 2026-10 -->

Vorgehen zum Auflösen von Dubletten: normalisieren, über mehrere Felder mit Ähnlichkeitsmaßen vergleichen, zu einem Golden Record zusammenführen und künftig bei der Neuanlage verhindern.

### Erklärung
1. **Normalisieren:** Groß-/Kleinschreibung, Rechtsformzusätze, Sonderzeichen, Umlaute vereinheitlichen. 2. **Vergleichen:** mehrere Felder gleichzeitig (Name + PLZ + Geburtsdatum) mit Ähnlichkeitsmaßen wie der **Levenshtein-Distanz** oder phonetischen Verfahren wie der **Kölner Phonetik**; bei großen Beständen mit **Blocking** und zwei Schwellen (Match, Prüffall, Non-Match). 3. **Zusammenführen** zum **Golden Record**, je Feld mit Vorrangregel. 4. **Prävention:** Dublettenprüfung bei der Neuanlage, führendes Stammdatensystem.

### Beispiel
„Müller“ → „Mueller“ hat die Levenshtein-Distanz 2 (ü durch u ersetzen, e einfügen); nach Normalisieren der Umlaute ist sie 0. „Meier“, „Mayer“ und „Maier“ ergeben in der Kölner Phonetik alle den Code 67. Die Möbelhaus Nordholz GmbH führt die Sätze zusammen; Bestellungen verweisen danach auf den Golden Record.

### Abgrenzung
Bereinigung korrigiert den **Bestand**; ohne Prävention entstehen Dubletten neu. Ein UNIQUE-Constraint verhindert nur exakte Dubletten.

### Prüfungsfalle
Nur die Bereinigung beschreiben – „sicherstellen“ verlangt Prävention und laufende Messung.

### Merksatz
Normalisieren, vergleichen, zusammenführen, vorbeugen.

Siehe auch: Dublette · Golden Record · Levenshtein-Distanz · Kölner Phonetik · Record Linkage
Mehr: Deep Dive 9, 4.2

## Durchlaufzeit
<!-- id: durchlaufzeit · quellen: Karte DD5, DD5 3.1 · stand: 2026-10 -->

Gesamtzeit vom Prozessstart bis zum Prozessende: Bearbeitungs- + Liege- + Transport- + Rüstzeit.

### Erklärung
$\text{DLZ} = \text{Bearbeitungszeit} + \text{Liegezeit} + \text{Transportzeit} + \text{Rüstzeit}$
Nur die Bearbeitungszeit ist echte Wertschöpfung. Der **Wertschöpfungsanteil** $= \frac{\text{Bearbeitungszeit}}{\text{Durchlaufzeit}} \cdot 100$ liegt in der Praxis oft unter 10 % – der größte Hebel sind fast immer die **Liegezeiten** (Warten zwischen Schritten und Abteilungen), nicht schnelleres Arbeiten. Im Process Mining wird die DLZ je Fall aus erstem und letztem Zeitstempel berechnet.

### Beispiel
Reparaturauftrag der Möbelhaus Nordholz GmbH: Bearbeitungszeit 1,5 h, Liegezeit 28,5 h → DLZ = 30 h; Wertschöpfungsanteil $= \frac{1{,}5}{30} \cdot 100 = 5\ \%$. In 95 % der Zeit passiert mit dem Auftrag nichts.

### Abgrenzung
**Bearbeitungszeit** = aktive Arbeit an einem Schritt; **Liegezeit** = Warten; **Durchlaufzeit** = alles zusammen von Start bis Ende.

### Prüfungsfalle
„Die Techniker sollen schneller arbeiten“ vorschlagen, obwohl die Liegezeit 95 % ausmacht.

### Merksatz
Die Zeit vergeht im Postfach, nicht an der Werkbank.

Siehe auch: Liegezeit · Bearbeitungszeit · Wertstromanalyse · Event Log · Termintreue
Mehr: Deep Dive 5, 3.1

## Dynamische Prüfung
<!-- id: dynamische-prufung · quellen: Karte DD16, DD16 1.2 · stand: 2026-10 -->

Prüfung, bei der das Programm bzw. die ETL-Strecke **ausgeführt** und das Ergebnis mit dem vorher festgelegten erwarteten Ergebnis verglichen wird – also ein Test.

### Erklärung
Dynamische Prüfungen gibt es auf allen Teststufen (Komponenten-, Integrations-, System-, Abnahmetest) und mit allen Testverfahren: Black-Box (Äquivalenzklassen, Grenzwerte, Entscheidungstabellen) und White-Box (Anweisungs- und Zweigüberdeckung). Sie zeigen Fehlerwirkungen, die erst zur Laufzeit auftreten – falsche Ergebnisse, Abstürze, schlechte Performance. Sie können die Anwesenheit von Fehlern zeigen, nie ihre Abwesenheit.

### Beispiel
Der Ladeprozess Umsatzdaten der Möbelhaus Nordholz GmbH wird mit „Maerz_Test.csv“ ausgeführt; erwartet sind 1.250 geladene Zeilen und eine Umsatzsumme von 184.320,50 € wie in der Quelle.

### Abgrenzung
| | statische Prüfung | dynamische Prüfung |
|---|---|---|
| Ausführung | nein | ja |
| Beispiele | Review, Walkthrough, Linter | Komponententest, Systemtest |
| findet | Fehlerzustände direkt | Fehlerwirkungen |

### Prüfungsfalle
Ein Code-Review als Test bezeichnen – es ist eine statische Prüfung.

### Merksatz
Dynamisch heißt: laufen lassen und vergleichen.

Siehe auch: Statische Prüfung · Testen · Testfall · Black-Box-Test · White-Box-Test
Mehr: Deep Dive 16, 1.2

## Ausgelassen
- Dokumentation und Übergabe – kein Fachbegriff
- Durchführen einer Prozessanalyse – Name Prüfungsbereich
