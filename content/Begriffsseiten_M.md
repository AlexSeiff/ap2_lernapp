<!-- Begriffsseiten M · Stand 2026-10 -->
## Machbarkeitsstudie
<!-- id: machbarkeitsstudie · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Untersuchung vor dem Projektstart, ob ein Vorhaben technisch, wirtschaftlich, organisatorisch und rechtlich umsetzbar ist; Ergebnis ist eine begründete Empfehlung.

### Erklärung
Die Studie prüft vier Dimensionen: **technisch** (Daten vorhanden, Systeme anbindbar?), **wirtschaftlich** (Kosten-Nutzen, Amortisation), **organisatorisch** (Personal, Know-how, Akzeptanz) und **rechtlich** (Datenschutz, Mitbestimmung, Lizenzen). Am Ende steht: durchführen, anpassen oder verwerfen. So werden aussichtslose Projekte früh und billig gestoppt.

### Beispiel
Vor der Einführung einer Absatzprognose prüft das Möbelhaus: Liegen drei Jahre Verkaufsdaten in brauchbarer Qualität vor? Rechnet sich die Lizenz gegen geringere Lagerkosten? Muss der Betriebsrat beteiligt werden? Ergebnis: durchführen, aber erst nach Bereinigung der Filialdaten.

### Abgrenzung
| Instrument | Frage |
|---|---|
| Machbarkeitsstudie | Geht es überhaupt – in allen vier Dimensionen? |
| Wirtschaftlichkeitsbetrachtung | Rechnet es sich? (nur eine Dimension) |
| Nutzwertanalyse | Welche Alternative ist die beste? |

### Prüfungsfalle
Nur die technische Machbarkeit prüfen – rechtliche Hürden wie DSGVO oder Mitbestimmung stoppen Datenprojekte oft zuerst.

### Merksatz
Erst prüfen, ob es geht – dann, wie es geht.

Siehe auch: Wirtschaftlichkeitsbetrachtung · Nutzwertanalyse · Lastenheft · Projekt
Mehr: Deep Dive 12, Teil 2

## Machine Learning
<!-- id: machine-learning · quellen: Karte DD6, DD6 8.1 · stand: 2026-10 -->

Teilgebiet der künstlichen Intelligenz, bei dem ein System Regeln und Muster aus Daten lernt, statt dass sie fest programmiert werden.

### Erklärung
Man unterscheidet **überwachtes Lernen** (mit bekannter Zielvariable: Klassifikation, Regression), **unüberwachtes Lernen** (ohne Zielvariable: Clustering, Assoziationsanalyse) und bestärkendes Lernen. Das gelernte Ergebnis heißt **Modell**; seine Güte wird an zurückgehaltenen Testdaten gemessen. Vorgehensmodell für ML-Projekte ist CRISP-DM.

### Beispiel
Statt einer handgeschriebenen Regel „Auftrag über 2.000 € → hohes Risiko“ lernt ein Entscheidungsbaum aus 50.000 alten Aufträgen, welche Merkmale Reklamationen tatsächlich vorhersagen.

### Abgrenzung
| Begriff | Bedeutung | Beispiel |
|---|---|---|
| Künstliche Intelligenz | Oberbegriff, auch regelbasiert | Expertensystem |
| Machine Learning | lernt aus Daten | Entscheidungsbaum |
| Deep Learning | ML mit vielschichtigen neuronalen Netzen | Bilderkennung |

### Prüfungsfalle
KI und ML gleichsetzen – nicht jede KI lernt; ein fest programmiertes Expertensystem ist KI, aber kein ML.

### Merksatz
KI ⊃ ML ⊃ Deep Learning.

Siehe auch: Künstliche Intelligenz · Deep Learning · Überwachtes Lernen · Unüberwachtes Lernen · Modell
Mehr: Deep Dive 6, 8.1

## MAE
<!-- id: ma · quellen: Karte DD7, DD7 Teil 3 · stand: 2026-10 -->

Mean Absolute Error (mittlerer absoluter Fehler): Durchschnitt der Beträge aller Prognosefehler eines Regressionsmodells.

### Erklärung
$\text{MAE} = \frac{\sum |y - \hat{y}|}{n}$. Der MAE ist in der Einheit der Zielgröße und damit leicht erklärbar („im Mittel liegen wir 5,2 T€ daneben“). Weil Fehler nicht quadriert werden, ist er **robuster gegen Ausreißer** als MSE und RMSE.

### Beispiel
| y | ŷ | \|e\| |
|---|---|---|
| 100 | 90 | 10 |
| 120 | 126 | 6 |
| 90 | 84 | 6 |
| 130 | 132 | 2 |
| 110 | 108 | 2 |

$\text{MAE} = \frac{26}{5} = 5{,}20$ T€. Zum Vergleich: RMSE $= 6{,}00$ T€ – der Abstand zeigt, dass ein größerer Einzelfehler (10) dabei ist.

### Abgrenzung
| Maß | Eigenschaft |
|---|---|
| MAE | Einheit der Zielgröße, robust |
| MSE | quadriert, bestraft große Fehler, Einheit² |
| RMSE | Wurzel aus MSE, stets ≥ MAE |
| MAPE | in Prozent, unbrauchbar bei y nahe 0 |

### Prüfungsfalle
Vorzeichen nicht entfernen – positive und negative Fehler heben sich sonst auf.

### Merksatz
MAE: Beträge mitteln, Einheit behalten.

Siehe auch: MSE · RMSE · MAPE · R²
Mehr: Deep Dive 7, Teil 3

## Magisches Dreieck
<!-- id: magisches-dreieck · quellen: Karte DD12, DD12 1.1 · stand: 2026-10 -->

Modell der drei konkurrierenden Projektziele Zeit, Kosten und Leistung/Qualität: Wer eine Größe verbessert, muss bei mindestens einer anderen nachgeben.

Auch: Magische Dreieck

### Erklärung
Die drei Eckpunkte sind voneinander abhängig. Ein früherer Termin verlangt mehr Ressourcen (Kosten) oder weniger Umfang; ein kleineres Budget kostet Zeit oder Leistung. „Magisch“ heißt es, weil sich nicht alle drei gleichzeitig optimieren lassen. Das **Teufelsquadrat** nach Sneed trennt die Leistung in Quantität und Qualität – vier Ecken bei konstanter Teamkapazität.

### Beispiel
Der Fachbereich will das Filial-Dashboard zwei Wochen früher. Antwort im Projekt: Entweder ein zusätzlicher Entwickler (Kosten) oder die Exportfunktion entfällt in Version 1 (Leistung).

### Abgrenzung
Das **Magische Viereck** ist ein Begriff der Volkswirtschaft (Ziele des Stabilitätsgesetzes) – gleiche Idee der Zielkonflikte, anderes Fachgebiet.

### Prüfungsfalle
„Alle drei Ziele gleichzeitig verbessern“ antworten – erwartet wird die Abwägung mit konkreter Folge.

### Merksatz
Schnell, billig, gut – such dir zwei aus.

Siehe auch: Teufelsquadrat · Projekt · Scope Creep · Magisches Viereck
Mehr: Deep Dive 12, 1.1

## Magisches Viereck
<!-- id: magisches-viereck · quellen: Karte DD14, DD14 4.4 · stand: 2026-10 -->

Die vier gesamtwirtschaftlichen Ziele des Stabilitätsgesetzes von 1967: stabiles Preisniveau, hoher Beschäftigungsstand, außenwirtschaftliches Gleichgewicht und stetiges, angemessenes Wirtschaftswachstum.

### Erklärung
Bund und Länder sollen ihre Wirtschafts- und Finanzpolitik nach diesen Zielen ausrichten (§ 1 StabG). „Magisch“, weil sich nicht alle gleichzeitig erreichen lassen: Wachstum und Vollbeschäftigung können die Preise treiben, Inflationsbekämpfung durch hohe Zinsen kann Arbeitsplätze kosten. Erweitert zum **magischen Sechseck** um gerechte Einkommensverteilung und Umweltschutz.

### Beispiel
Im Boom sinkt die Arbeitslosigkeit, das Möbelhaus erhöht die Preise wegen steigender Löhne und Holzpreise – Beschäftigungsziel erreicht, Preisniveaustabilität gefährdet.

### Abgrenzung
Ein **ausgeglichener Staatshaushalt** gehört **nicht** zu den vier Zielen. Das **Magische Dreieck** des Projektmanagements (Zeit, Kosten, Leistung) ist ein anderer Begriff.

### Prüfungsfalle
In Multiple-Choice-Aufgaben „ausgeglichener Staatshaushalt“ oder „niedrige Steuern“ als Ziel ankreuzen.

### Merksatz
Preise, Jobs, Außenhandel, Wachstum – vier Ziele, nie alle zugleich.

Siehe auch: Konjunkturphasen · Inflation · Leitzins · Fiskalpolitik
Mehr: Deep Dive 14, 4.4

## Mahnverfahren
<!-- id: mahnverfahren · quellen: Karte DD14, DD14 2.5 · stand: 2026-10 -->

Vereinfachtes gerichtliches Verfahren (§§ 688 ff. ZPO), mit dem ein Gläubiger eine unbestrittene Geldforderung ohne Klage vollstreckbar machen kann.

### Erklärung
Ablauf: Antrag auf **Mahnbescheid** beim Mahngericht (online) → Zustellung an den Schuldner → Widerspruch binnen 2 Wochen möglich → sonst auf Antrag **Vollstreckungsbescheid** → Einspruch binnen 2 Wochen möglich → **Zwangsvollstreckung** durch den Gerichtsvollzieher. Das Gericht prüft nicht, ob die Forderung besteht. Nach Widerspruch oder Einspruch geht es ins normale Klageverfahren. Die Zustellung des Mahnbescheids **hemmt die Verjährung**.

### Beispiel
Ein Kunde zahlt eine Küche über 8.400 € trotz Mahnungen nicht. Das Möbelhaus beantragt im November 2026 einen Mahnbescheid – kurz vor Jahresende, damit die Forderung aus 2023 nicht am 31.12.2026 verjährt.

### Abgrenzung
| Rechtsbehelf | gegen | Folge |
|---|---|---|
| Widerspruch | Mahnbescheid | streitiges Verfahren |
| Einspruch | Vollstreckungsbescheid | streitiges Verfahren, Vollstreckung bleibt möglich |

### Prüfungsfalle
Widerspruch und Einspruch vertauschen – Widerspruch richtet sich gegen den Mahnbescheid, Einspruch gegen den Vollstreckungsbescheid.

### Merksatz
Mahnbescheid – Widerspruch, Vollstreckungsbescheid – Einspruch, je zwei Wochen.

Siehe auch: Zahlungsverzug · Verjährung · Kaufvertrag
Mehr: Deep Dive 14, 2.5

## Make or Buy
<!-- id: make-or-buy · quellen: Karte DD12 · stand: 2026-10 -->

Entscheidung, ob eine Leistung – etwa Software – selbst erstellt oder fremd bezogen wird, nach Kosten, Know-how, Abhängigkeit und Zeit.

### Erklärung
Eigenentwicklung ist passgenau und hält Wissen im Haus, bindet aber Personal und Wartung. Fremdbezug ist schnell und kalkulierbar, schafft aber Anbieterabhängigkeit und laufende Lizenzkosten. Quantitativ hilft die **kritische Menge**: Bei ihr sind beide Alternativen gleich teuer. Die Rechnung wird immer durch qualitative Kriterien ergänzt.

### Beispiel
Eigenentwicklung: 12.000 € Fixkosten pro Jahr + 2 € je Vorgang; Fremdbezug: 5 € je Vorgang.
$x = \frac{12.000 - 0}{5 - 2} = 4.000$ Vorgänge pro Jahr.
Bei 6.000 Vorgängen: selbst 24.000 €, fremd 30.000 € → Eigenentwicklung günstiger.

### Abgrenzung
| | Make | Buy |
|---|---|---|
| Pro | passgenau, Know-how, unabhängig | schnell, Support, erprobt |
| Contra | Personalbindung, Wartung, Risiko | Abhängigkeit, Lizenzkosten |

### Prüfungsfalle
Nur die kritische Menge berechnen und ohne Bewertung abgeben – erwartet wird eine Empfehlung mit qualitativen Argumenten.

### Merksatz
Unter der kritischen Menge kaufen, darüber selbst machen – und dann noch einmal nachdenken.

Siehe auch: Kritische Menge · Total Cost of Ownership · Nutzwertanalyse · Wirtschaftlichkeitsbetrachtung
Mehr: Deep Dive 12, 4.3

## Man-in-the-Middle
<!-- id: man-in-the-middle · quellen: Karte DD10, DD10 4.5 · stand: 2026-10 -->

Angriff, bei dem sich ein Angreifer unbemerkt zwischen zwei Kommunikationspartner schaltet, um Daten mitzulesen oder zu verändern.

### Erklärung
Beide Seiten glauben, direkt miteinander zu sprechen; tatsächlich läuft alles über den Angreifer. Typische Wege: gefälschte WLAN-Hotspots, manipulierte Namensauflösung (DNS) oder ARP-Spoofing im lokalen Netz. Schutz bieten **Verschlüsselung mit TLS** und vor allem die **Zertifikatsprüfung** – sie stellt sicher, dass man wirklich mit dem echten Server spricht. Zusätzlich helfen VPN in fremden Netzen und Mehr-Faktor-Authentifizierung.

### Beispiel
Ein Außendienstmitarbeiter loggt sich im Café-WLAN „Free_WiFi“ ins Warenwirtschaftssystem ein. Der Hotspot gehört einem Angreifer, der die unverschlüsselten Zugangsdaten mitschneidet.

### Abgrenzung
| Angriff | Ziel |
|---|---|
| Man-in-the-Middle | Kommunikation abfangen/verändern |
| Phishing | Opfer gibt Daten selbst preis |
| Brute Force | Passwort durchprobieren |

### Prüfungsfalle
Zertifikatswarnungen im Browser wegklicken – genau dann ist ein MITM-Angriff möglich.

### Merksatz
Gegen den Mann in der Mitte hilft nur: verschlüsseln und Zertifikat prüfen.

Siehe auch: Phishing · Brute Force · Asymmetrische Verschlüsselung · Mehr-Faktor-Authentifizierung
Mehr: Deep Dive 10, 4.5

## Mangelhafte Lieferung
<!-- id: mangelhafte-lieferung · quellen: Karte DD14, DD14 2.5 · stand: 2026-10 -->

Störung des Kaufvertrags, bei der die Ware bei Übergabe einen Sach- oder Rechtsmangel hat (§§ 434, 435 BGB).

### Erklärung
**Sachmängel**: falsche Beschaffenheit, Montagefehler, mangelhafte Anleitung, Falsch- oder Zuweniglieferung. Rechte des Käufers (§ 437 BGB) in fester Reihenfolge: **vorrangig Nacherfüllung** – Nachbesserung oder Ersatzlieferung nach Wahl des Käufers; erst wenn sie scheitert oder verweigert wird, **Rücktritt oder Minderung**, zusätzlich ggf. Schadensersatz. Gewährleistung bei neuen Sachen **2 Jahre** ab Übergabe; beim Verbrauchsgüterkauf wird bei Mängeln im ersten Jahr vermutet, dass sie schon bei Übergabe vorlagen (§ 477 BGB). Unter Kaufleuten muss unverzüglich gerügt werden (§ 377 HGB).

### Beispiel
Eine Kundin bekommt ein Sofa mit gerissenem Bezug. Sie verlangt zuerst einen neuen Bezug (Nachbesserung). Scheitert die Reparatur zweimal, kann sie zurücktreten oder den Preis mindern.

### Abgrenzung
**Gewährleistung** ist gesetzlich und richtet sich gegen den Verkäufer; die **Garantie** ist ein freiwilliges Zusatzversprechen, meist des Herstellers.

### Prüfungsfalle
Sofort Rücktritt oder Minderung wählen – zuerst kommt die Nacherfüllung.

### Merksatz
Erst reparieren oder tauschen, dann zurück oder billiger.

Siehe auch: Sachmangel · Gewährleistung · Garantie · Beweislastumkehr beim Verbrauchsgüterkauf · Lieferungsverzug
Mehr: Deep Dive 14, 2.5

## Manteltarifvertrag
<!-- id: manteltarifvertrag · quellen: Karte DD13, DD13 5.1 · stand: 2026-10 -->

Tarifvertrag, der die allgemeinen Arbeitsbedingungen regelt – Arbeitszeit, Urlaub, Kündigungsfristen, Zuschläge – und meist mehrere Jahre läuft.

### Erklärung
Tarifverträge schließen Gewerkschaften mit Arbeitgeberverbänden (Flächentarif) oder einzelnen Arbeitgebern (Haustarif). Der Manteltarifvertrag bildet den stabilen „Mantel“ um die häufiger neu verhandelten Entgelte. Er gilt unmittelbar für tarifgebundene Arbeitsverhältnisse und darf zugunsten der Beschäftigten, aber nicht zu ihren Lasten unterschritten werden (Günstigkeitsprinzip).

### Beispiel
Der Manteltarifvertrag des Einzelhandels legt für das Möbelhaus die Wochenarbeitszeit, den Urlaubsanspruch und Zuschläge für Spätarbeit fest; die Höhe der Gehälter steht im separaten Entgelttarifvertrag.

### Abgrenzung
| Tarifvertrag | Inhalt | Laufzeit |
|---|---|---|
| Manteltarifvertrag | Arbeitszeit, Urlaub, Kündigungsfristen | lang |
| Entgelttarifvertrag | Löhne und Gehälter | kurz (1–2 Jahre) |
| Rahmentarifvertrag | Entgeltgruppen, Tätigkeitsmerkmale | mittel bis lang |

### Prüfungsfalle
Die Höhe der Löhne dem Manteltarifvertrag zuordnen – sie steht im Entgelttarifvertrag.

### Merksatz
Der Mantel regelt das Drumherum, das Entgelt das Geld.

Siehe auch: Tarifarten · Entgelttarifvertrag · Tarifvertrag · Tarifautonomie
Mehr: Deep Dive 13, 5.1

## MAPE
<!-- id: mape · quellen: Karte DD7, DD7 Teil 3 · stand: 2026-10 -->

Mean Absolute Percentage Error (mittlerer absoluter prozentualer Fehler): durchschnittliche prozentuale Abweichung der Prognose vom tatsächlichen Wert.

### Erklärung
$\text{MAPE} = \frac{1}{n} \sum \frac{|y - \hat{y}|}{|y|} \cdot 100\ \%$. Weil er relativ ist, lassen sich Modelle über verschiedene Größenordnungen vergleichen (Filiale mit 100 T€ und mit 5 Mio. € Umsatz). Liegt y nahe 0, explodiert der Bruch; bei y = 0 ist er nicht definiert.

### Beispiel
Umsätze (T€) y = 100, 120, 90, 130, 110; Prognosen 90, 126, 84, 132, 108:
$\frac{1}{5} \cdot \left(\frac{10}{100} + \frac{6}{120} + \frac{6}{90} + \frac{2}{130} + \frac{2}{110}\right) \approx \frac{0{,}2503}{5} \approx 5{,}00\ \%$.
Die Prognose liegt im Mittel 5 % daneben.

### Abgrenzung
MAE, MSE und RMSE sind **absolute** Maße in der Einheit der Zielgröße (bzw. deren Quadrat); MAPE ist **relativ** und einheitenlos.

### Prüfungsfalle
MAPE für Retourenquoten oder Bestände nutzen, die oft 0 sind – dann ist das Maß unbrauchbar.

### Merksatz
MAPE sagt „wie viel Prozent daneben“ – solange nichts null ist.

Siehe auch: MAE · MSE · RMSE · R²
Mehr: Deep Dive 7, Teil 3

## MapReduce
<!-- id: mapreduce · quellen: Karte DD8, DD8 5.2 · stand: 2026-10 -->

Programmiermodell zur parallelen Verarbeitung großer, verteilter Datenmengen in den Schritten Map, Shuffle und Reduce.

### Erklärung
**Map**: Jeder Knoten verarbeitet seine lokal gespeicherten Datenblöcke und erzeugt Schlüssel-Wert-Paare. **Shuffle**: Die Paare werden nach Schlüssel gruppiert und verteilt. **Reduce**: Je Schlüssel wird zum Ergebnis zusammengefasst (Summe, Anzahl …). Grundidee: Die Berechnung wandert zu den Daten, nicht umgekehrt. MapReduce ist das Verarbeitungsprinzip von **Apache Hadoop**; Apache Spark folgt derselben Idee, hält Zwischenergebnisse aber im Arbeitsspeicher und ist dadurch schneller.

### Beispiel
Map: je Kassenbon „Filiale Nord → 249 €“, „Filiale Süd → 89 €“ …; Shuffle: alle Paare von Nord zusammen; Reduce: Summe je Filiale → „Nord → 1,2 Mio. €“.

### Abgrenzung
| Skalierung | Prinzip |
|---|---|
| Horizontal (Scale-out) | mehr Rechner, Arbeit verteilt – MapReduce |
| Vertikal (Scale-up) | stärkerer Einzelserver |

### Prüfungsfalle
MapReduce für Echtzeitauswertungen vorschlagen – es ist ein Batch-Verfahren.

### Merksatz
Map zerlegt, Shuffle sortiert, Reduce fasst zusammen.

Siehe auch: Big Data · Apache Spark · Horizontale Skalierung
Mehr: Deep Dive 8, 5.2

## MAR
<!-- id: mar · quellen: Karte DD9, DD9 4.1 · stand: 2026-10 -->

Missing at Random: Das Fehlen eines Werts hängt nur von anderen, **beobachteten** Merkmalen ab, nicht vom fehlenden Wert selbst.

### Erklärung
MAR ist einer der drei Fehlmechanismen nach Rubin. Weil der Grund für das Fehlen in den Daten sichtbar ist, kann man ihn berücksichtigen: Ersetzen **innerhalb der Gruppe** (z. B. Mittelwert je Spediteur) oder **modellbasiert** (Regressionsimputation, multiple Imputation). Ein einfacher Gesamtmittelwert verzerrt dagegen, weil die fehlenden Fälle zu einer bestimmten Gruppe gehören.

### Beispiel
Spediteur B meldet die Lieferdauer nie, und B fährt vor allem lange Strecken. Ersetzt man mit dem Gesamtmittel, werden die Lieferzeiten zu kurz geschätzt; besser ist der Mittelwert aus anderen Langstreckenfahrten.

### Abgrenzung
| Mechanismus | Fehlen hängt ab von | Umgang |
|---|---|---|
| MCAR | nichts | Löschen verzerrt nicht |
| MAR | anderen beobachteten Merkmalen | gruppen- oder modellbasiert ersetzen |
| MNAR | dem fehlenden Wert selbst | Ursache klären |

### Prüfungsfalle
„Missing at Random“ als „völlig zufällig“ übersetzen – das ist MCAR.

### Merksatz
MAR: Der Grund für die Lücke steht in einer anderen Spalte.

Siehe auch: MCAR · MNAR · Fehlende Werte · Imputation
Mehr: Deep Dive 9, 4.1

## Marktformen
<!-- id: marktformen · quellen: Karte DD14, DD14 4.2 · stand: 2026-10 -->

Einteilung von Märkten nach der Zahl der Marktteilnehmer: Polypol (viele Anbieter), Oligopol (wenige), Monopol (einer).

### Erklärung
Je weniger Anbieter, desto größer ihre Macht über den Preis. Im **Polypol** ist der einzelne Anbieter Preisnehmer, im **Oligopol** beobachten sich die wenigen Anbieter gegenseitig (Gefahr von Absprachen), der **Monopolist** setzt den Preis weitgehend selbst. Das vollständige Schema kombiniert Anbieter- und Nachfragerseite.

### Beispiel
| Anbieter → / Nachfrager ↓ | viele | wenige | einer |
|---|---|---|---|
| viele | Polypol | Angebotsoligopol | Angebotsmonopol |
| wenige | Nachfrageoligopol | zweiseitiges Oligopol | beschränktes Angebotsmonopol |
| einer | Nachfragemonopol | beschränktes Nachfragemonopol | zweiseitiges Monopol |

Möbelhandel in einer Großstadt: Polypol. Eine Bundeswehr-Ausschreibung für Spezialmöbel: Nachfragemonopol.

### Abgrenzung
Marktformen beschreiben die **Struktur** eines Markts; der **Gleichgewichtspreis** beschreibt das Ergebnis von Angebot und Nachfrage.

### Prüfungsfalle
Das Nachfragemonopol mit einem Anbieter verwechseln – dort gibt es viele Anbieter und einen Nachfrager.

### Merksatz
Poly viele, Oligo wenige, Mono einer.

Siehe auch: Gleichgewichtspreis · Produktionsfaktoren
Mehr: Deep Dive 14, 4.2

## Master Data Management
<!-- id: master-data-management · quellen: Karte DD9, DD9 5.2, DD9 5.4 · stand: 2026-10 -->

Stammdatenmanagement: Prozesse, Rollen und Systeme, die je Stammdatenart (Kunde, Artikel, Lieferant) eine einheitliche, abgestimmte Version – den **Golden Record** – bereitstellen.

### Erklärung
Stammdatenfehler wirken in jede Bestellung, Rechnung und Auswertung hinein. Kern von MDM: ein **führendes System** je Stammdatenart statt paralleler Pflege, klare Zuständigkeiten (Data Owner, Data Steward) und **Dublettenprüfung bei der Neuanlage**. Architekturstile: Registry (nur Schlüsselverzeichnis), Consolidation (Hub führt für Analysen zusammen), Coexistence (Golden Record wird zurückgespielt), Centralized (Pflege nur noch zentral).

### Beispiel
Kundendaten liegen im Möbelhaus im Shop, im CRM und in der Warenwirtschaft. Künftig ist das CRM führend; Shop und Warenwirtschaft übernehmen Kunden nur von dort, neue Kunden werden vor dem Anlegen auf Dubletten geprüft.

### Abgrenzung
**Stammdaten** sind langlebig und werden von vielen Prozessen genutzt; **Bewegungsdaten** (Bestellungen, Buchungen) entstehen laufend und verweisen auf Stammdaten. MDM betrifft nur die Stammdaten.

### Prüfungsfalle
MDM als einmalige Dublettenbereinigung beschreiben – ohne führendes System und Zuständigkeiten entstehen die Dubletten neu.

### Merksatz
Ein Kunde, ein Datensatz, ein führendes System.

Siehe auch: Golden Record · Stammdaten · Data Owner · Data Steward · Dublette
Mehr: Deep Dive 9, 5.4 · Deep Dive 9, 5.2

## Materialized View
<!-- id: materialized-view · quellen: Karte DD1, DD1 3.4 · stand: 2026-10 -->

View, die ihr Abfrageergebnis physisch speichert: Lesen ist schnell, die Daten müssen aber regelmäßig aufgefrischt werden.

### Erklärung
Eine normale **View** speichert nur die Abfrage und rechnet bei jedem Zugriff neu – immer aktuell, aber bei großen Joins langsam. Die Materialized View speichert das Ergebnis wie eine Tabelle; aufgefrischt wird zeitgesteuert, auf Befehl (`REFRESH MATERIALIZED VIEW` in PostgreSQL) oder je nach System automatisch. Sie eignet sich für teure Kennzahlen, die nicht sekundengenau sein müssen.

### Beispiel
Die Kundenumsätze über alle Bestellpositionen werden als Materialized View jede Nacht nach dem ETL-Lauf aufgefrischt; das Dashboard liest morgens in Millisekunden statt Minuten.

### Abgrenzung
| | View | Materialized View |
|---|---|---|
| speichert | nur die Abfrage | das Ergebnis |
| Aktualität | immer aktuell | Stand der letzten Auffrischung |
| Geschwindigkeit | rechnet jedes Mal | schnell |

### Prüfungsfalle
Annehmen, die Materialized View sei automatisch aktuell – ohne Refresh zeigt sie alte Zahlen.

### Merksatz
View rechnet immer, Materialized View erinnert sich.

Siehe auch: View · Index · Data Mart
Mehr: Deep Dive 1, 3.4

## Matrixorganisation
<!-- id: matrixorganisation · quellen: Karte DD5, DD5 6.1, DD17 1.5 · stand: 2026-10 -->

Organisationsform, in der sich zwei Leitungsdimensionen kreuzen – z. B. Funktion (Abteilung) und Projekt bzw. Produkt –, sodass Mitarbeitende zwei Vorgesetzte haben.

### Erklärung
Der **Fachvorgesetzte** der Funktion (z. B. IT-Leitung) bestimmt, *wie* gearbeitet wird; der **Projekt- oder Produktleiter**, *was* und *wann*. Das nutzt Spezialwissen flexibel über mehrere Projekte. Nachteil sind doppelte Unterstellung, Abstimmungsaufwand und Kompetenzkonflikte, die klare Regeln erfordern.

### Beispiel
Eine Datenanalystin der IT-Abteilung arbeitet zu 50 % im Projekt „Absatzprognose“. Fachlich bleibt sie der IT-Leitung unterstellt, ihre Projektaufgaben verteilt der Projektleiter aus dem Vertrieb.

### Abgrenzung
| Form | Vorgesetzte je Stelle |
|---|---|
| Einliniensystem | genau einer |
| Stabliniensystem | einer, plus beratende Stäbe |
| Mehrliniensystem | mehrere fachliche |
| Matrixorganisation | zwei Dimensionen (Funktion × Projekt/Produkt) |

### Prüfungsfalle
Matrix und Mehrliniensystem gleichsetzen – die Matrix kreuzt genau zwei Dimensionen systematisch.

### Merksatz
In der Matrix fragt man zwei Chefs: einen für das Wie, einen für das Was.

Siehe auch: Einliniensystem · Mehrliniensystem · Stabliniensystem · Organigramm · Aufbauorganisation
Mehr: Deep Dive 5, 6.1 · Deep Dive 17, 1.5

## Maximum suchen
<!-- id: maximum-suchen · quellen: DD11 B5 · stand: 2026-10 -->

Standardalgorithmus, der den größten Wert einer Liste findet: Startwert ist das erste Element, jedes weitere wird verglichen und ersetzt bei Bedarf das bisherige Maximum.

### Erklärung
Der Algorithmus durchläuft die Liste einmal, der Aufwand ist O(n). Entscheidend ist die **Initialisierung mit dem ersten Listenelement** – nicht mit 0. Für das Minimum dreht man nur den Vergleich um.

### Beispiel
```text
max ← liste[1]
FÜR i VON 2 BIS n
    WENN liste[i] > max DANN
        max ← liste[i]
    ENDE WENN
ENDE FÜR
AUSGABE max
```
Temperaturen im Kühllager −4, −2, −7: richtig → −2. Mit `max ← 0` käme 0 heraus, ein Wert, der gar nicht in der Liste steht.

### Abgrenzung
Maximum suchen liefert einen Wert; **Sortieren** ordnet die ganze Liste (mindestens O(n log n)) – für ein einzelnes Maximum unnötig teuer.

### Prüfungsfalle
`max ← 0` initialisieren – falsch, sobald alle Werte negativ sind.

### Merksatz
Das Maximum startet mit dem ersten Wert, nie mit null.

Siehe auch: Mittelwert · Pseudocode · Struktogramm · Sortieren
Mehr: Deep Dive 11, B5

## Maximumprinzip
<!-- id: maximumprinzip · quellen: Karte DD10, DD10 5.1 · stand: 2026-10 -->

Regel der BSI-Schutzbedarfsfeststellung: Ein IT-System erbt den **höchsten** Schutzbedarf der Anwendungen und Daten, die auf ihm laufen.

### Erklärung
Der Schutzbedarf wird je Schutzziel (Vertraulichkeit, Integrität, Verfügbarkeit) in normal, hoch oder sehr hoch eingestuft (BSI-Standard 200-2). Er vererbt sich von den Geschäftsprozessen über die Anwendungen auf Systeme, Räume und Netze. Zwei Ausnahmen: Beim **Kumulationseffekt** steigt der Schutzbedarf, weil sich viele kleine Schäden summieren; beim **Verteilungseffekt** sinkt er, etwa wenn eine Anwendung redundant auf mehreren Servern läuft (Verfügbarkeit).

### Beispiel
Auf einem Server laufen Kantinenplan (Vertraulichkeit normal) und Gehaltsabrechnung (Vertraulichkeit hoch). Der ganze Server bekommt für Vertraulichkeit den Schutzbedarf „hoch“.

### Abgrenzung
| Effekt | Wirkung |
|---|---|
| Maximumprinzip | höchster Wert wird übernommen |
| Kumulationseffekt | Schutzbedarf steigt über das Maximum |
| Verteilungseffekt | Schutzbedarf sinkt unter das Maximum |

### Prüfungsfalle
Den Durchschnitt der Anwendungen bilden – maßgeblich ist das Maximum.

### Merksatz
Die empfindlichste Anwendung bestimmt den Schutz des ganzen Servers.

Siehe auch: Schutzbedarfsfeststellung · Schutzbedarfskategorien · Kumulationseffekt · Verteilungseffekt · IT-Grundschutz
Mehr: Deep Dive 10, 5.1

## MC-Notation
<!-- id: mc-notation · quellen: Karte DD2, DD2 1.3 · stand: 2026-10 -->

Modifizierte Chen-Notation für Kardinalitäten: 1 (genau eins), c (null oder eins), m bzw. n (eins oder mehrere), mc bzw. nc (null oder mehrere); gelesen wird wie bei Chen.

### Erklärung
Die einfache Chen-Notation kennt nur Maximalwerte (1, n, m). Die MC-Notation ergänzt mit dem Buchstaben **c** (conditional) die Optionalität, also ob das Minimum 0 ist. Die Angabe steht – wie bei Chen – an der **gegenüberliegenden** Entität. Die Notation ist in Berufsschul- und Prüfungsaufgaben verbreitet.

### Beispiel
KUNDE 1 —— erteilt —— mc BESTELLUNG: Ein Kunde erteilt null bis viele Bestellungen; jede Bestellung gehört zu genau einem Kunden.
In Min-Max: KUNDE (0,n) —— (1,1) BESTELLUNG.

### Abgrenzung
| MC | Min-Max (andere Seite!) | UML |
|---|---|---|
| 1 | (1,1) | 1 |
| c | (0,1) | 0..1 |
| m / n | (1,n) | 1..* |
| mc / nc | (0,n) | 0..* |

### Prüfungsfalle
MC-Angaben beim Übertragen nach Min-Max auf derselben Seite lassen – sie wandern auf die andere Seite.

### Merksatz
c heißt „kann auch null sein“.

Siehe auch: Chen-Notation · Min-Max-Notation · Krähenfußnotation · Kardinalität · Multiplizität
Mehr: Deep Dive 2, 1.3

## MCAR
<!-- id: mcar · quellen: Karte DD9, DD9 4.1 · stand: 2026-10 -->

Missing Completely at Random: Das Fehlen eines Werts ist völlig zufällig und hängt weder von anderen Merkmalen noch vom fehlenden Wert selbst ab.

### Erklärung
MCAR ist der günstigste der drei Fehlmechanismen nach Rubin. Die vollständigen Fälle sind eine Zufallsstichprobe aller Fälle; das **Löschen** der unvollständigen Datensätze verzerrt deshalb nicht, es kostet nur Fallzahl und damit Genauigkeit. In der Praxis ist MCAR selten und schwer nachzuweisen – man prüft, ob sich Fälle mit und ohne Lücke in anderen Merkmalen unterscheiden.

### Beispiel
Bei einem zufälligen Systemabsturz gehen 40 von 5.000 Erfassungsformularen verloren – unabhängig von Filiale, Kunde oder Betrag. Diese 40 Fälle kann man weglassen.

### Abgrenzung
| Mechanismus | Fehlen hängt ab von | Löschen |
|---|---|---|
| MCAR | nichts | unverzerrt |
| MAR | beobachteten Merkmalen | verzerrt |
| MNAR | fehlendem Wert selbst | verzerrt |

### Prüfungsfalle
Ohne Prüfung MCAR unterstellen, nur weil Löschen bequem ist.

### Merksatz
Nur wenn der Zufall allein entscheidet, darf man Lücken einfach streichen.

Siehe auch: MAR · MNAR · Fehlende Werte · Imputation
Mehr: Deep Dive 9, 4.1

## Median
<!-- id: median · quellen: Karte DD3, DD3 Teil 3 · stand: 2026-10 -->

Lagemaß: der mittlere Wert der der Größe nach sortierten Reihe; bei gerader Anzahl das Mittel der beiden mittleren Werte.

### Erklärung
Bei ungeradem n steht der Median an Position $\frac{n+1}{2}$, bei geradem n mittelt man die Werte an Position $\frac{n}{2}$ und $\frac{n}{2} + 1$. Er teilt die Daten in zwei gleich große Hälften und ist **robust gegen Ausreißer**. Zulässig ab Ordinalskala. Im Boxplot ist er der Strich in der Box (zweites Quartil).

### Beispiel
Lieferzeiten 2, 3, 3, 4, 5, 5, 5, 6, 8, 19 (n = 10): Median $= \frac{5 + 5}{2} = 5{,}0$ Tage; Mittelwert 6,0 Tage.
Wird 19 zu 90, bleibt der Median 5,0 – der Mittelwert steigt auf 13,1.

### Abgrenzung
| | Median | Arithmetisches Mittel |
|---|---|---|
| Ausreißer | robust | empfindlich |
| Skalenniveau | ab ordinal | metrisch |
| nutzt | Rangfolge | alle Werte |

### Prüfungsfalle
Die Reihe vor der Bestimmung nicht sortieren oder bei geradem n einfach den linken der beiden mittleren Werte nehmen.

### Merksatz
Sortieren, Mitte suchen – Ausreißer stören nicht.

Siehe auch: Lagemaß · Modus · Arithmetisches Mittel · Boxplot · Rechtsschief (linkssteil)
Mehr: Deep Dive 3, Teil 3

## Mehr-Faktor-Authentifizierung
<!-- id: mehr-faktor-authentifizierung · quellen: Karte DD10, DD10 4.3 · stand: 2026-10 -->

Anmeldeverfahren, das mindestens zwei Nachweise aus **verschiedenen** Faktor-Kategorien kombiniert: Wissen, Besitz und Sein (Inhärenz).

### Erklärung
**Wissen**: Passwort, PIN. **Besitz**: Smartphone mit Authenticator-App, Hardware-Token, Chipkarte. **Sein**: Fingerabdruck, Gesichtserkennung. Ein gestohlenes Passwort allein reicht dann nicht mehr. Mit zwei Faktoren spricht man von Zwei-Faktor-Authentifizierung (2FA). Besonders wichtig für Fernzugriffe, Administratorkonten und Cloud-Dienste.

### Beispiel
Die Anmeldung am DWH aus dem Homeoffice verlangt Passwort (Wissen) und einen Code aus der Authenticator-App auf dem Diensthandy (Besitz).

### Abgrenzung
| Kombination | MFA? |
|---|---|
| Passwort + Sicherheitsfrage | nein – zweimal Wissen |
| Passwort + App-Code | ja – Wissen + Besitz |
| Chipkarte + Fingerabdruck | ja – Besitz + Sein |

**Authentifizierung** klärt, wer man ist; **Autorisierung**, was man darf.

### Prüfungsfalle
Passwort plus Sicherheitsfrage als MFA bezeichnen – beides ist Wissen.

### Merksatz
Etwas, das ich weiß, habe oder bin – mindestens zwei davon.

Siehe auch: Authentifizierung · Autorisierung · Besitz · Phishing · Brute Force
Mehr: Deep Dive 10, 4.3

## Mehrfachverzweigung
<!-- id: mehrfachverzweigung · quellen: DD17 4.2 · stand: 2026-10 -->

Strukturblock im Struktogramm (Fallauswahl): Je nach Wert eines Ausdrucks wird genau einer von mehreren Zweigen ausgeführt.

### Erklärung
Gezeichnet wird ein Kopf mit dem Ausdruck, darunter für jeden Fall eine Spalte, meist mit einem Zweig „sonst“ für alle übrigen Werte. Im Pseudocode und in Programmiersprachen entspricht das `FALLS … ENTSPRICHT` bzw. `switch`/`match`. Sie ersetzt verschachtelte Verzweigungen und ist übersichtlicher, wenn ein Wert mit mehreren Konstanten verglichen wird.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 140" width="360" height="140" role="img" aria-label="Struktogramm-Mehrfachverzweigung nach Zahlungsart mit drei Fällen und sonst">
<rect x="10" y="10" width="340" height="120" class="dg-form"/>
<line x1="10" y1="70" x2="350" y2="70" class="dg-linie"/>
<line x1="10" y1="10" x2="240" y2="70" class="dg-linie"/>
<line x1="240" y1="70" x2="350" y2="10" class="dg-linie"/>
<line x1="90" y1="30.9" x2="90" y2="130" class="dg-linie"/>
<line x1="165" y1="50.4" x2="165" y2="130" class="dg-linie"/>
<line x1="240" y1="70" x2="240" y2="130" class="dg-linie"/>
<text x="240" y="30" text-anchor="middle" class="dg-fett">Zahlungsart</text>
<text x="15" y="66" class="dg-klein">Karte</text>
<text x="95" y="66" class="dg-klein">Rechnung</text>
<text x="170" y="66" class="dg-klein">Bar</text>
<text x="345" y="66" text-anchor="end" class="dg-klein">sonst</text>
<text x="50" y="100" text-anchor="middle" class="dg-klein">abbuchen</text>
<text x="127" y="94" text-anchor="middle" class="dg-klein">Rechnung</text>
<text x="127" y="108" text-anchor="middle" class="dg-klein">drucken</text>
<text x="202" y="94" text-anchor="middle" class="dg-klein">Kasse</text>
<text x="202" y="108" text-anchor="middle" class="dg-klein">buchen</text>
<text x="295" y="100" text-anchor="middle" class="dg-klein">Fehler melden</text>
</svg>
```

### Abgrenzung
| Block | Zweige |
|---|---|
| Verzweigung | zwei (ja/nein) |
| Mehrfachverzweigung | beliebig viele Fälle + sonst |
| Schleife | Wiederholung, keine Auswahl |

### Prüfungsfalle
Den Zweig „sonst“ vergessen – dann bleibt ein unerwarteter Wert unbehandelt.

### Merksatz
Ein Wert, viele Fälle, genau ein Weg.

Siehe auch: Verzweigung · Struktogramm · Kopfgesteuerte Schleife · Programmablaufplan
Mehr: Deep Dive 17, 4.2 · Deep Dive 11, B2

## Mehrheitsentscheid
<!-- id: mehrheitsentscheid · quellen: DD6 7.1 · stand: 2026-10 -->

Letzter Schritt von k-NN: Die häufigste Klasse unter den k nächsten Nachbarn wird als Vorhersage für den neuen Fall übernommen.

### Erklärung
Nach Abstandsberechnung und Sortierung „stimmen“ die k nächsten Trainingsfälle ab. Bei zwei Klassen wählt man ein **ungerades k**, damit kein Gleichstand entsteht. Varianten gewichten nähere Nachbarn stärker. Auch der **Random Forest** entscheidet per Mehrheit – dort stimmen viele Entscheidungsbäume ab.

### Beispiel
k = 5, die fünf ähnlichsten Aufträge: 3× „keine Reklamation“, 2× „Reklamation“ → Vorhersage „keine Reklamation“. Mit k = 4 und 2 : 2 wäre das Ergebnis unentschieden.

### Abgrenzung
Bei der **Klassifikation** entscheidet die Mehrheit; bei der k-NN-**Regression** bildet man stattdessen den Mittelwert der Nachbarwerte.

### Prüfungsfalle
Ein gerades k bei zwei Klassen wählen, ohne eine Regel für Gleichstand anzugeben.

### Merksatz
Die Nachbarn stimmen ab – ungerade, damit es keinen Patt gibt.

Siehe auch: K-Nächste-Nachbarn · Lazy Learner · Random Forest · Klassifikation
Mehr: Deep Dive 6, 7.1

## Mehrliniensystem
<!-- id: mehrliniensystem · quellen: Karte DD5, DD5 6.1 · stand: 2026-10 -->

Organisationsform, in der eine Stelle Weisungen von mehreren fachlich spezialisierten Vorgesetzten erhält.

### Erklärung
Das Mehrliniensystem geht auf das Funktionsmeistersystem von Taylor zurück: Jeder Vorgesetzte ist für sein Fachgebiet zuständig. Vorteile sind kurze Dienstwege und hohe Spezialisierung, Nachteile Kompetenzkonflikte und widersprüchliche Anweisungen, wenn die Zuständigkeiten nicht klar abgegrenzt sind.

### Beispiel
Ein Lagermitarbeiter bekommt Weisungen vom Logistikleiter (Abläufe) und von der Qualitätsleiterin (Prüfvorgaben). Fordern beide gleichzeitig Vorrang, entsteht ein Konflikt.

### Abgrenzung
| Form | Merkmal | Nachteil |
|---|---|---|
| Einliniensystem | ein Vorgesetzter | lange Dienstwege |
| Stabliniensystem | Linie + beratende Stäbe | Stäbe nur beratend |
| Mehrliniensystem | mehrere fachliche Vorgesetzte | Kompetenzkonflikte |
| Matrixorganisation | Funktion × Projekt | doppelte Unterstellung |

### Prüfungsfalle
Stäbe als zusätzliche Vorgesetzte deuten – sie haben kein Weisungsrecht, das ist Stablinie, nicht Mehrlinie.

### Merksatz
Mehrere Chefs, kurze Wege – aber wer hat recht?

Siehe auch: Einliniensystem · Stabliniensystem · Matrixorganisation · Organigramm
Mehr: Deep Dive 5, 6.1

## Mehrschichtiges Perzeptron
<!-- id: mehrschichtiges-perzeptron · quellen: Karte DD6, DD6 9.6 · stand: 2026-10 -->

Neuronales Netz mit mindestens einer verdeckten Schicht zwischen Eingabe- und Ausgabeschicht (englisch Multilayer Perceptron, MLP).

### Erklärung
Jedes Neuron einer Schicht ist mit den Neuronen der nächsten Schicht verbunden. Die verdeckten Neuronen bilden Zwischenmerkmale, die Ausgabeschicht verknüpft sie. Dadurch lernt ein MLP auch Muster, die nicht linear trennbar sind, etwa XOR. Trainiert wird es mit Backpropagation; dafür braucht es ableitbare Aktivierungsfunktionen wie Sigmoid oder ReLU. Viele verdeckte Schichten führen zum Deep Learning.

### Beispiel
XOR mit zwei verdeckten Neuronen: h₁ rechnet OR (Gewichte 1 und 1, Bias −0,5), h₂ rechnet NAND (Gewichte −1 und −1, Bias 1,5), das Ausgabeneuron verknüpft beide mit AND (Gewichte 1 und 1, Bias −1,5). Für (1|1): h₁ = 1, h₂ = 0, Ausgabe 1 + 0 − 1,5 = −0,5 → 0.

### Abgrenzung
Das einfache Perzeptron hat nur ein Neuron ohne verdeckte Schicht und trennt mit einer Geraden. Deep Learning bezeichnet Netze mit vielen Schichten, die Merkmale selbst aus Rohdaten bilden.

### Prüfungsfalle
Behaupten, ein neuronales Netz könne XOR grundsätzlich nicht lernen – das gilt nur für ein einzelnes Perzeptron.

### Merksatz
Eine verdeckte Schicht macht aus einer Geraden beliebige Grenzen.

Siehe auch: Perzeptron · Lineare Trennbarkeit · Backpropagation · Deep Learning
Mehr: Deep Dive 6, 9.6

## Meilenstein
<!-- id: meilenstein · quellen: Karte DD12, DD17 5.2 · stand: 2026-10 -->

Zeitpunkt im Projekt mit einem überprüfbaren Ergebnis; ein Meilenstein ist kein Vorgang und hat die Dauer null.

Auch: Meilensteine

### Erklärung
Meilensteine markieren Phasenübergänge oder wichtige Zwischenergebnisse und sind Entscheidungs- und Kontrollpunkte: Ist das Ergebnis erreicht, geht es weiter, sonst wird gegengesteuert. Sie müssen **messbar** formuliert sein. Im Gantt-Diagramm werden sie als Raute gezeichnet, im Netzplan als Vorgang mit Dauer 0.

### Beispiel
Im Ausbildungsprojekt: M1 „Pflichtenheft vom Fachbereich abgenommen“ (Tag 5), M2 „ETL-Strecke liefert vollständige Testdaten“ (Tag 15), M3 „Dashboard abgenommen“ (Tag 30).

### Abgrenzung
| Element | Dauer | Beispiel |
|---|---|---|
| Vorgang/Arbeitspaket | > 0 | „ETL-Strecke entwickeln“ |
| Meilenstein | 0 | „ETL-Strecke abgenommen“ |

### Prüfungsfalle
Einen Meilenstein als Tätigkeit formulieren („Testen“) oder ihm eine Dauer geben.

### Merksatz
Meilensteine sind Ergebnisse, keine Arbeit – Dauer null.

Siehe auch: Gantt-Diagramm · Netzplan · Soll-Ist-Vergleich · Projektstrukturplan
Mehr: Deep Dive 12, Teil 5 · Deep Dive 17, 5.2

## Merge Sort
<!-- id: merge-sort · quellen: Karte DD11, DD11 B7 · stand: 2026-10 -->

Sortierverfahren nach dem Prinzip „Teile und herrsche“: Liste halbieren, die Hälften rekursiv sortieren und sortiert zusammenführen (mischen).

### Erklärung
Die Liste wird so lange geteilt, bis nur noch Einzelelemente übrig sind; beim Zusammenführen vergleicht man jeweils die vordersten Elemente beider Teillisten. Der Aufwand ist **immer O(n log n)** – auch im schlechtesten Fall. Merge Sort ist **stabil**, braucht aber zusätzlichen Speicher in der Größe der Liste.

### Beispiel
5, 3, 8, 1 → teilen: [5, 3] [8, 1] → sortieren: [3, 5] [1, 8] → mischen: 1, 3, 5, 8.
Bei n = 1.000 braucht Merge Sort rund $1.000 \cdot \log_2 1.000 \approx 10.000$ Vergleiche, Bubble Sort im schlechtesten Fall rund 500.000.

### Abgrenzung
| Verfahren | schlechtester Fall | stabil | Zusatzspeicher |
|---|---|---|---|
| Merge Sort | O(n log n) | ja | ja |
| Quicksort | O(n²) | nein | gering |
| Bubble Sort | O(n²) | ja | nein |

### Prüfungsfalle
Merge Sort wie Quicksort einen schlechtesten Fall von O(n²) zuschreiben.

### Merksatz
Teilen bis eins, dann geordnet mischen – immer n log n.

Siehe auch: Quicksort · Bubble Sort · Stabiles Sortierverfahren · Rekursion · O-Notation
Mehr: Deep Dive 11, B7

## Merkmal
<!-- id: merkmal · quellen: Karte DD6 · stand: 2026-10 -->

Eingangsgröße eines Modells (Feature, Attribut, unabhängige Variable), z. B. Alter, Bestellwert oder Warengruppe; in der Datentabelle eine Spalte.

Auch: Merkmal / Feature / Attribut

### Erklärung
Aus den Merkmalen lernt das Modell, die **Zielvariable** (Label) vorherzusagen. Merkmale können metrisch oder kategorial sein; kategoriale werden für die meisten Verfahren kodiert (One-Hot-Encoding), metrische für abstandsbasierte Verfahren skaliert. Jedes Merkmal muss zum Vorhersagezeitpunkt bekannt sein, sonst droht Data Leakage.

### Beispiel
Reklamationsvorhersage: Merkmale Warengruppe, Bestellwert, Lieferdauer, Filiale; Zielvariable „reklamiert ja/nein“. Das Feld „Reklamationsdatum“ ist **kein** zulässiges Merkmal – es entsteht erst nach der Reklamation.

### Abgrenzung
| Begriff | Rolle | Tabelle |
|---|---|---|
| Merkmal | Eingang | Spalte |
| Zielvariable | Ausgang | Spalte |
| Datensatz/Instanz | ein Fall | Zeile |

### Prüfungsfalle
Merkmal und Zielvariable vertauschen oder ein Merkmal verwenden, das erst nach dem Ereignis bekannt wird.

### Merksatz
Merkmale rein, Zielvariable raus.

Siehe auch: Zielvariable / Label · Merkmale bilden · Kategorien kodieren · Trainingsdaten
Mehr: Deep Dive 6, 2.1

## Merkmale bilden
<!-- id: merkmale-bilden · quellen: DD6 Teil 5 · stand: 2026-10 -->

Schritt der Datenvorbereitung (Feature Engineering): Aus vorhandenen Rohdaten werden neue, aussagekräftige Merkmale berechnet.

### Erklärung
Rohdaten sind oft nicht direkt nutzbar: Ein Zeitstempel sagt wenig, die daraus berechnete Dauer viel. Typisch sind Differenzen (Dauer), Umrechnungen (Alter aus Geburtsdatum), Zerlegungen (Wochentag, Monat), Verhältnisse (Retourenquote) und Aggregationen (Umsatz der letzten 90 Tage). Gute Merkmale verbessern ein Modell oft stärker als ein komplizierteres Verfahren.

### Beispiel
Aus `beginn = 2026-03-02 08:00` und `ende = 2026-03-04 12:00` wird `bearbeitungsdauer_h = 52`; aus dem Geburtsdatum das Alter am Bestelltag; aus dem Bestelldatum das Merkmal „Wochenende ja/nein“.

### Abgrenzung
**Merkmale bilden** erzeugt neue Spalten; **Kategorien kodieren** und **Skalieren** formen bestehende Spalten nur um.

### Prüfungsfalle
Merkmale aus Informationen bilden, die zum Vorhersagezeitpunkt noch nicht vorliegen (Data Leakage).

### Merksatz
Nicht der Zeitstempel zählt, sondern die Dauer dazwischen.

Siehe auch: Merkmal · Kategorien kodieren · Standardisierung · Min-Max-Normalisierung
Mehr: Deep Dive 6, Teil 5

## Metadaten
<!-- id: metadaten · quellen: Karte DD15, DD15 1.1 · stand: 2026-10 -->

Daten über Daten: Sie beschreiben Herkunft, Bedeutung, Format, Verantwortliche und Aktualisierungsrhythmus eines Datenbestands.

### Erklärung
Man unterscheidet **technische** Metadaten (Datentyp, Tabellenstruktur, Ladezeitpunkt), **fachliche** (Definition einer Kennzahl, Verantwortlicher) und **operative** (Laufprotokolle, Zeilenzahlen). Gesammelt werden sie in einem Datenkatalog oder Data Dictionary. Ohne Metadaten wird ein Data Lake zum Data Swamp, und zwei Abteilungen rechnen unter demselben Namen verschiedene Kennzahlen.

### Beispiel
Spalte `umsatz_netto` im DWH: Datentyp DECIMAL(12,2), Quelle Warenwirtschaft, „Umsatz ohne MwSt. nach Retouren“, Data Owner Controlling, täglich 03:00 Uhr aktualisiert.

### Abgrenzung
| Datenart | Beispiel |
|---|---|
| Stammdaten | Kunde, Artikel |
| Bewegungsdaten | Bestellung, Buchung |
| Metadaten | Beschreibung der Spalte „umsatz_netto“ |

### Prüfungsfalle
Metadaten mit Stammdaten verwechseln – Stammdaten beschreiben Objekte der Realität, Metadaten beschreiben Daten.

### Merksatz
Metadaten sind der Beipackzettel der Daten.

Siehe auch: Stammdaten · Bewegungsdaten · Data Lake · Data Owner
Mehr: Deep Dive 15, 1.1

## Methoden der Ist-Aufnahme
<!-- id: methoden-der-ist-aufnahme · quellen: Karte DD5, DD5 1.2 · stand: 2026-10 -->

Verfahren, mit denen der tatsächliche Ablauf eines Prozesses erhoben wird: Interview, Workshop, Fragebogen, Beobachtung, Dokumentenanalyse und Auswertung von Systemdaten.

### Erklärung
Die Ist-Aufnahme ist der zweite Schritt der Prozessanalyse, nach der Abgrenzung des Prozesses. **Interviews** und **Workshops** liefern Kontext und Erfahrungswissen, aber eine subjektive Sicht. **Fragebögen** erreichen viele Personen. **Beobachtung** (auch als Multimomentaufnahme mit Stichproben) zeigt das reale Verhalten. **Dokumentenanalyse** wertet Formulare und Arbeitsanweisungen aus. **Systemdaten** (Event Logs) sind objektiv und vollständig, erklären aber nicht das Warum. Deshalb kombiniert man datengetriebene und befragende Methoden.

### Beispiel
Für den Reparaturservice wertet die Analystin das Event Log aus (Liegezeit vor „Teil bestellen“ im Schnitt 26 h) und fragt in Interviews mit der Disposition nach den Gründen.

### Abgrenzung
| Methode | Stärke | Schwäche |
|---|---|---|
| Interview | Kontext, Ursachen | subjektiv, beschreibt oft das Soll |
| Fragebogen | viele Befragte | wenig Tiefe |
| Beobachtung | reales Verhalten | aufwendig, Beobachtereffekt |
| Systemdaten | objektiv, vollständig | kein Warum |

### Prüfungsfalle
Nur eine Methode nennen – erwartet werden mindestens drei mit Vor- und Nachteilen.

### Merksatz
Die Daten zeigen das Was, die Menschen erklären das Warum.

Siehe auch: Ist-Aufnahme · Event Log · Process Mining · Liegezeit
Mehr: Deep Dive 5, 1.2

## Midijob
<!-- id: midijob · quellen: Karte DD14 · stand: 2026-10 -->

Beschäftigung im **Übergangsbereich** (§ 20 Abs. 2 SGB IV) von 603,01 € bis 2.000 € im Monat (Stand 2026), in dem die Arbeitnehmerbeiträge zur Sozialversicherung reduziert sind und gleitend ansteigen.

### Erklärung
Die Untergrenze liegt einen Cent über der Minijob-Grenze und steigt mit ihr (2027: 633,01 €). Am unteren Rand zahlt der Arbeitnehmer nur einen kleinen Anteil, bis 2.000 € steigt er auf den vollen Satz. Der Arbeitgeber trägt einen entsprechend höheren Anteil. Trotz der geringeren Beiträge erwirbt der Beschäftigte volle Rentenansprüche. Der Übergangsbereich gilt **nicht für Auszubildende**.

### Beispiel
Eine Verkaufshilfe im Möbelhaus verdient 1.100 € im Monat: Midijob – sie zahlt weniger als den vollen Arbeitnehmeranteil von rund 21 %, ist aber voll versichert. Ein Azubi mit 1.100 € zahlt dagegen den vollen Anteil.

### Abgrenzung
| Monatsentgelt (2026) | Regel |
|---|---|
| bis 603 € | Minijob – AN meist nur RV-Eigenanteil |
| 603,01–2.000 € | Midijob – reduzierte AN-Beiträge |
| über 2.000 € | voller AN-Anteil |
| Azubi bis 325 € | Geringverdienergrenze – AG trägt alles |

### Prüfungsfalle
Den Übergangsbereich auf Auszubildende anwenden – über 325 € zahlen sie sofort den vollen Arbeitnehmeranteil.

### Merksatz
Midi: zwischen Mini und voll – nur nicht für Azubis.

Siehe auch: Minijob · Geringverdienergrenze · Mindestlohn · Rentenversicherung
Mehr: Deep Dive 14, 1.3

## Mietvertrag
<!-- id: mietvertrag · quellen: Karte DD14, DD14 2.4 · stand: 2026-10 -->

Vertrag über die **entgeltliche** Überlassung einer Sache zum Gebrauch (§ 535 BGB): Der Vermieter gewährt den Gebrauch, der Mieter zahlt Miete.

### Erklärung
Der Vermieter bleibt Eigentümer und muss die Sache in gebrauchsfähigem Zustand halten; der Mieter wird Besitzer und gibt dieselbe Sache am Ende zurück. Gegenstand können bewegliche Sachen (Transporter, Server) oder Räume sein. Für Wohnraum gelten besondere Schutzvorschriften. Beim **Leasing** – im Kern ein Mietvertrag mit Besonderheiten – trägt meist der Leasingnehmer das Risiko für die Sache.

### Beispiel
Das Möbelhaus mietet für die Weihnachtssaison eine Lagerhalle für 3.000 € im Monat und einen Gabelstapler für 400 € im Monat.

### Abgrenzung
| Vertrag | Entgelt | Fruchtziehung |
|---|---|---|
| Mietvertrag | ja | nein |
| Pachtvertrag | ja | ja (Erträge dürfen gezogen werden) |
| Leihvertrag | nein | nein |

### Prüfungsfalle
Die Gaststätte mit Inventar im Möbelhaus als Mietvertrag einordnen – wer die Erträge erwirtschaftet, pachtet.

### Merksatz
Miete: gegen Geld nutzen, nicht ernten.

Siehe auch: Leihvertrag · Pachtvertrag · Darlehensvertrag · Kaufvertrag
Mehr: Deep Dive 14, 2.4

## Min-Max-Normalisierung
<!-- id: min-max-normalisierung · quellen: Karte DD6 · stand: 2026-10 -->

Skalierungsverfahren, das die Werte eines Merkmals linear auf den Bereich 0 bis 1 abbildet.

### Erklärung
$x' = \frac{x - x_{min}}{x_{max} - x_{min}}$. Das Minimum wird 0, das Maximum 1. Skalieren ist Pflicht bei abstandsbasierten Verfahren wie k-Means und k-NN, sonst dominiert das Merkmal mit der größten Spanne. Minimum und Maximum werden nur aus den **Trainingsdaten** berechnet und auf die Testdaten übertragen. Die Methode ist ausreißerempfindlich: Ein Extremwert staucht alle anderen Werte zusammen.

### Beispiel
Jahresumsatz 9.160 € bei einer Spanne von 200 € bis 45.000 €:
$x' = \frac{9.160 - 200}{45.000 - 200} = \frac{8.960}{44.800} = 0{,}20$.

### Abgrenzung
| Verfahren | Ergebnis | Ausreißer |
|---|---|---|
| Min-Max-Normalisierung | Bereich 0 bis 1 | empfindlich |
| Standardisierung (z-Transformation) | Mittelwert 0, Standardabweichung 1 | weniger empfindlich |
| Normalisierung (Datenbank) | 1. bis 3. Normalform | – völlig anderes Thema |

### Prüfungsfalle
Min-Max-Normalisierung mit der Normalisierung von Datenbanktabellen verwechseln.

### Merksatz
Kleinster Wert null, größter eins, alles andere dazwischen.

Siehe auch: Standardisierung · Normalisierung · K-Nächste-Nachbarn · K-Means
Mehr: Deep Dive 6, Teil 5

## Min-Max-Notation
<!-- id: min-max-notation · quellen: Karte DD2, DD2 1.3, DD17 3.2 · stand: 2026-10 -->

ER-Notation, bei der an jeder Entität ein Wertepaar (min, max) steht: Wie oft nimmt **eine** Ausprägung dieser Entität mindestens und höchstens an der Beziehung teil?

### Erklärung
Die Angabe steht bei der Entität, deren Beteiligung sie beschreibt – also genau umgekehrt zur Chen- und MC-Notation. Das Minimum zeigt, ob die Teilnahme optional (0) oder Pflicht (1) ist; das Maximum ist 1 oder n. Damit ist die Notation präziser als die einfache Chen-Notation.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 90" width="420" height="90" role="img" aria-label="Min-Max-Notation: KUNDE (0,n) erteilt (1,1) BESTELLUNG">
<rect x="10" y="25" width="90" height="40" class="dg-form"/>
<text x="55" y="45" text-anchor="middle" dominant-baseline="middle" class="dg-fett">KUNDE</text>
<line x1="100" y1="45" x2="160" y2="45" class="dg-linie"/>
<polygon points="210,20 260,45 210,70 160,45" class="dg-form"/>
<text x="210" y="45" text-anchor="middle" dominant-baseline="middle" class="dg-klein">erteilt</text>
<line x1="260" y1="45" x2="320" y2="45" class="dg-linie"/>
<rect x="320" y="25" width="90" height="40" class="dg-form"/>
<text x="365" y="45" text-anchor="middle" dominant-baseline="middle" class="dg-fett">BESTELLUNG</text>
<text x="130" y="35" text-anchor="middle" class="dg-klein">(0,n)</text>
<text x="290" y="35" text-anchor="middle" class="dg-klein">(1,1)</text>
</svg>
```

Gelesen: Ein Kunde erteilt 0 bis n Bestellungen; eine Bestellung wird von genau einem Kunden erteilt.

### Abgrenzung
Dieselbe Beziehung in Chen: KUNDE 1 —— n BESTELLUNG – das n steht bei BESTELLUNG. In Min-Max steht (0,n) beim KUNDEN.

### Prüfungsfalle
(0,n) am Kunden als „n Kunden“ lesen – es heißt „ein Kunde nimmt 0- bis n-mal teil“.

### Merksatz
Min-Max spricht über sich selbst, Chen über das Gegenüber.

Siehe auch: Chen-Notation · MC-Notation · Krähenfußnotation · Kardinalität
Mehr: Deep Dive 2, 1.3 · Deep Dive 17, 3.2

## Mindestausbildungsvergütung
<!-- id: mindestausbildungsvergutung · quellen: Karte DD13 · stand: 2026-10 -->

Gesetzliche Untergrenze der Ausbildungsvergütung nach § 17 BBiG; maßgeblich ist das Kalenderjahr des Ausbildungsbeginns – 2026: 724 € im ersten Ausbildungsjahr (Stand 2026).

### Erklärung
Für die folgenden Jahre gelten feste Aufschläge: 2. Jahr +18 %, 3. Jahr +35 %, 4. Jahr +40 % auf den Wert des ersten Jahres. Der Betrag wird jährlich fortgeschrieben und vom Bundesbildungsministerium im Herbst für das Folgejahr bekanntgegeben (2025: 682 €). Tarifverträge gehen vor; ein nicht tarifgebundener Betrieb darf die tarifliche Vergütung um höchstens 20 % unterschreiten. Für Auszubildende gilt **nicht** der gesetzliche Mindestlohn.

### Beispiel
Ausbildungsbeginn 1. August 2026 (Stand 2026):
| Jahr | Rechnung | Mindestens |
|---|---|---|
| 1. | – | 724 € |
| 2. | 724 € · 1,18 = 854,32 € | 854 € |
| 3. | 724 € · 1,35 = 977,40 € | 977 € |
| 4. | 724 € · 1,40 = 1.013,60 € | 1.014 € |

### Abgrenzung
Der **Mindestlohn** gilt pro Stunde für Arbeitnehmer; die Mindestausbildungsvergütung gilt pro Monat für Auszubildende.

### Prüfungsfalle
Das aktuelle Kalenderjahr statt des Jahrs des Ausbildungsbeginns ansetzen – wer 2025 begann, hat im 2. Jahr Anspruch auf 682 € · 1,18 = 804,76 €, gerundet 805 €.

### Merksatz
Das Startjahr bestimmt die Untergrenze für die ganze Ausbildung.

Siehe auch: Mindestlohn · BBiG · Mindestinhalte · Tarifvertrag
Mehr: Deep Dive 13, 1.3

## Mindestinhalte
<!-- id: mindestinhalte · quellen: DD13 1.2 · stand: 2026-10 -->

Angaben, die die Vertragsniederschrift eines Berufsausbildungsvertrags nach § 11 Abs. 1 BBiG mindestens enthalten muss.

### Erklärung
Pflichtangaben: Art, sachliche und zeitliche Gliederung sowie Ziel der Ausbildung · Beginn und Dauer · Ausbildungsmaßnahmen außerhalb der Ausbildungsstätte · tägliche Ausbildungszeit · Dauer der Probezeit · Höhe der Vergütung · Ausgleich von Überstunden · Urlaub · Kündigungsvoraussetzungen · Hinweis auf Tarifverträge und Betriebsvereinbarungen · Form des Ausbildungsnachweises. Die Niederschrift erfolgt unverzüglich nach Vertragsschluss, spätestens vor Ausbildungsbeginn; seit 01.08.2024 genügt die **Textform**. Der Vertrag wird bei der IHK ins Verzeichnis eingetragen.

### Beispiel
Der Vertrag von Jonas Brandt nennt: Fachinformatiker Daten- und Prozessanalyse, Beginn 01.08.2026, Dauer 3 Jahre, Probezeit 4 Monate, 8 Stunden täglich, Vergütung je Ausbildungsjahr, Urlaub (für Minderjährige mindestens 25 bis 30 Werktage nach § 19 JArbSchG, je nach Alter zu Jahresbeginn), digitaler Ausbildungsnachweis.

### Abgrenzung
Mindestinhalte sind **Pflicht**; **nichtige Vereinbarungen** nach § 12 BBiG (Vertragsstrafe, Entschädigung für die Ausbildung, Weiterarbeitspflicht außerhalb der letzten sechs Monate) sind **verboten**.

### Prüfungsfalle
Eine Probezeit von sechs Monaten eintragen – erlaubt sind mindestens ein, höchstens vier Monate.

### Merksatz
Was, wann, wie lange, wie viel, wie viel frei – und wie man wieder rauskommt.

Siehe auch: BBiG · Probezeit · Ausbildungsnachweis · Mindestausbildungsvergütung
Mehr: Deep Dive 13, 1.2

## Mindestlohn
<!-- id: mindestlohn · quellen: Karte DD14 · stand: 2026-10 -->

Gesetzliche Lohnuntergrenze je Zeitstunde nach dem Mindestlohngesetz: 13,90 € ab 01.01.2026, 14,60 € ab 01.01.2027 (Stand 2026).

### Erklärung
Die Höhe schlägt die **Mindestlohnkommission** aus Arbeitgeber- und Gewerkschaftsvertretern vor, die Bundesregierung setzt sie per Verordnung fest. Ausgenommen sind u. a. Auszubildende (für sie gilt die Mindestausbildungsvergütung), Pflichtpraktika, Jugendliche unter 18 ohne abgeschlossene Berufsausbildung und Langzeitarbeitslose in den ersten sechs Monaten. Der Mindestlohn bestimmt auch die Minijob-Grenze: Mindestlohn · 130 / 3, aufgerundet.

### Beispiel
Minijob-Grenze 2026: $13{,}90 \cdot 130 / 3 = 602{,}33$ → 603 €. Eine Aushilfe im Möbelhaus darf damit höchstens $\frac{603}{13{,}90} \approx 43{,}4$ Stunden im Monat arbeiten, wenn sie nur den Mindestlohn erhält.

### Abgrenzung
| Untergrenze | gilt für | Bezug |
|---|---|---|
| Mindestlohn | Arbeitnehmer ab 18 | je Stunde |
| Mindestausbildungsvergütung | Auszubildende | je Monat |
| Tariflohn | tarifgebundene Arbeitsverhältnisse | meist höher |

### Prüfungsfalle
Den Mindestlohn auf Auszubildende anwenden.

### Merksatz
13,90 € heute, 14,60 € ab 2027 – und die Minijob-Grenze wandert mit.

Siehe auch: Minijob · Midijob · Mindestausbildungsvergütung · Tarifvertrag
Mehr: Deep Dive 13, 2.4 · Deep Dive 14, 1.3

## Minijob
<!-- id: minijob · quellen: Karte DD14, DD14 1.3 · stand: 2026-10 -->

Geringfügige Beschäftigung bis zu einer an den Mindestlohn gekoppelten Verdienstgrenze – 2026: 603 € im Monat, ab 2027: 633 € (Stand 2026).

### Erklärung
Die Grenze berechnet sich als Mindestlohn · 130 / 3, aufgerundet auf volle Euro. Für den Beschäftigten fallen keine Steuern und Sozialabgaben an – außer zur **Rentenversicherung** (Eigenanteil 3,6 %), von der er sich befreien lassen kann. Der Arbeitgeber zahlt Pauschalabgaben von rund 30 % (KV 13 %, RV 15 %, Pauschsteuer 2 %) plus Umlagen an die Minijob-Zentrale.

### Beispiel
Grenze 2027: $14{,}60 \cdot 130 / 3 = 632{,}67$ → 633 €.
Eine Aushilfe verdient 600 € im Monat: Sie zahlt 3,6 % = 21,60 € zur Rentenversicherung und erhält 578,40 €; das Möbelhaus zahlt zusätzlich rund 30 % = 180 € Pauschalabgaben.

### Abgrenzung
| Monatsentgelt (2026) | Einordnung |
|---|---|
| bis 603 € | Minijob |
| 603,01–2.000 € | Midijob (Übergangsbereich) |
| über 2.000 € | reguläre Beschäftigung |

### Prüfungsfalle
Eine feste Grenze von 520 € oder 556 € ansetzen – die Grenze steigt mit jedem Mindestlohn.

### Merksatz
Minijob-Grenze = Mindestlohn mal 130 durch 3, aufgerundet.

Siehe auch: Midijob · Mindestlohn · Geringverdienergrenze · Rentenversicherung
Mehr: Deep Dive 14, 1.3

## Mitbestimmung
<!-- id: mitbestimmung · quellen: Karte DD13, DD13 4.2, Karte DD5, DD5 5.4 · stand: 2026-10 -->

Stärkstes Beteiligungsrecht des Betriebsrats: Ohne seine Zustimmung darf der Arbeitgeber die Maßnahme nicht umsetzen.

Auch: Mitbestimmung des Betriebsrats

### Erklärung
Echte Mitbestimmung besteht vor allem in **sozialen Angelegenheiten** (§ 87 Abs. 1 BetrVG): Beginn und Ende der Arbeitszeit, Pausen, Urlaubsgrundsätze, Entlohnungsgrundsätze und **technische Einrichtungen, die zur Überwachung von Verhalten oder Leistung geeignet sind** (Nr. 6). Bei Nr. 6 genügt die technische **Eignung** – eine Überwachungsabsicht ist nicht nötig. Einigen sich die Parteien nicht, entscheidet die **Einigungsstelle** verbindlich. Geregelt wird das Ergebnis meist in einer Betriebsvereinbarung.

### Beispiel
Process Mining auf dem Event Log des Reparaturservice mit der Spalte *Resource* (Mitarbeiterkennung) kann Bearbeitungszeiten je Person zeigen → mitbestimmungspflichtig. Lösung: Betriebsvereinbarung, Pseudonymisierung, Auswertung nur auf Teamebene.

### Abgrenzung
| Stufe | Wirkung | Beispiel |
|---|---|---|
| Information | unterrichten | wirtschaftliche Lage |
| Anhörung | Betriebsrat hören | jede Kündigung (§ 102) |
| Zustimmungsverweigerung | Maßnahme blockierbar | Einstellung, Versetzung (§ 99) |
| Mitbestimmung | ohne Zustimmung keine Maßnahme | Arbeitszeit, Überwachung (§ 87) |

### Prüfungsfalle
„Wir wollen niemanden überwachen“ als Grund nennen, den Betriebsrat nicht zu beteiligen – die Eignung des Systems reicht.

### Merksatz
Kann das System Leistung messen, entscheidet der Betriebsrat mit.

Siehe auch: Betriebsrat · Beteiligungsrechte · Einigungsstelle · Process Mining · Event Log
Mehr: Deep Dive 13, 4.2 · Deep Dive 5, 5.4

## Mittelwert
<!-- id: mittelwert · quellen: DD11 B5 · stand: 2026-10 -->

Arithmetisches Mittel: Summe aller Werte geteilt durch ihre Anzahl; als Algorithmus erst Summe und Anzahl bilden, dann teilen – mit Prüfung auf Division durch null.

### Erklärung
Statistisch: $\bar{x} = \frac{\sum x_i}{n}$, nur für metrische Daten sinnvoll und ausreißerempfindlich. Als Standardalgorithmus braucht man zwei Variablen, die vor der Schleife mit 0 initialisiert werden. Ist die Liste leer oder erfüllt kein Wert die Bedingung, wäre die Anzahl 0 – dann muss eine Meldung statt einer Division erfolgen.

### Beispiel
```text
summe ← 0
anzahl ← 0
FÜR JEDEN wert IN liste
    summe ← summe + wert
    anzahl ← anzahl + 1
ENDE FÜR
WENN anzahl > 0 DANN
    AUSGABE summe / anzahl
SONST
    AUSGABE "keine Werte"
ENDE WENN
```
Lieferzeiten 2, 3, 3, 4, 5, 5, 5, 6, 8, 19: $\frac{60}{10} = 6{,}0$ Tage.

### Abgrenzung
Der **Median** ist robust gegen Ausreißer; das **gewichtete** arithmetische Mittel berücksichtigt unterschiedliche Gewichte (z. B. Klassenmitte × Häufigkeit).

### Prüfungsfalle
Die Prüfung auf `anzahl = 0` vergessen – bei leerer Liste bricht das Programm ab.

### Merksatz
Erst zählen, dann prüfen, dann teilen.

Siehe auch: Arithmetisches Mittel · Median · Maximum suchen · Gewichtetes arithmetisches Mittel
Mehr: Deep Dive 11, B5 · Deep Dive 3, Teil 3

## MNAR
<!-- id: mnar · quellen: Karte DD9, DD9 4.1 · stand: 2026-10 -->

Missing Not at Random: Das Fehlen eines Werts hängt vom fehlenden Wert selbst ab.

### Erklärung
MNAR ist der schwierigste Fehlmechanismus nach Rubin. Weil der Grund in der Lücke selbst steckt, verzerrt **jede einfache Ersetzung** und auch das Löschen das Ergebnis. Statt die Lücke zu füllen, klärt man die Ursache (z. B. Erfassungspflicht einführen), sammelt Daten nach und prüft mit einer **Sensitivitätsanalyse**, wie stark die Ergebnisse von Annahmen über die fehlenden Werte abhängen.

### Beispiel
Spediteure melden besonders lange Lieferdauern bewusst nicht. Der Mittelwert der gemeldeten Lieferzeiten (3,8 Tage) unterschätzt die Wahrheit systematisch – egal ob man löscht oder mit 3,8 auffüllt.

### Abgrenzung
| Mechanismus | Beispiel | Umgang |
|---|---|---|
| MCAR | zufälliger Systemabsturz | Löschen möglich |
| MAR | Spediteur B meldet nie | gruppenweise ersetzen |
| MNAR | lange Dauern werden verschwiegen | Ursache klären |

### Prüfungsfalle
MNAR mit Mittelwert-Imputation „lösen“ – das zementiert die Verzerrung.

### Merksatz
Wenn der Wert selbst sich versteckt, hilft kein Auffüllen.

Siehe auch: MCAR · MAR · Fehlende Werte · Imputation
Mehr: Deep Dive 9, 4.1

## Mock-up
<!-- id: mock-up · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Statischer, realistisch gestalteter Entwurf einer Oberfläche – mit echten Farben, Schriften und Beispieldaten, aber ohne Funktion.

### Erklärung
Mock-ups liegen zwischen grober Skizze und klickbarem Prototyp. Sie zeigen, wie das fertige Dashboard oder die Anwendung aussehen soll, und eignen sich, um Layout, Kennzahlen und Begriffe früh mit dem Fachbereich abzustimmen – bevor eine Zeile SQL geschrieben ist. Das ist die billigste Form der Qualitätssicherung.

### Beispiel
Die Analystin zeigt dem Controlling ein Mock-up des Filial-Dashboards mit Beispielzahlen. Dabei stellt sich heraus, dass „Umsatz“ netto nach Retouren gemeint ist – ein Missverständnis, das sonst erst bei der Abnahme aufgefallen wäre.

### Abgrenzung
| Stufe | Detailgrad | interaktiv |
|---|---|---|
| Wireframe | Kästen, Anordnung | nein |
| Mock-up | realistische Gestaltung | nein |
| Prototyp | realistisch | ja, klickbar |

### Prüfungsfalle
Mock-up und Prototyp gleichsetzen – das Mock-up ist nicht klickbar.

### Merksatz
Wireframe zeigt wo, Mock-up zeigt wie, Prototyp zeigt was passiert.

Siehe auch: Wireframe · Prototyp · Usability-Test · Gebrauchstauglichkeit
Mehr: Deep Dive 11, A5

## Model Drift
<!-- id: model-drift · quellen: Karte DD6, DD7 4.3 · stand: 2026-10 -->

Schleichende Verschlechterung eines produktiven ML-Modells, weil sich die Realität (Sortiment, Kundenverhalten, Prozesse) ändert, das Modell aber auf dem alten Stand bleibt.

Auch: Model Drift / Concept Drift

### Erklärung
Man unterscheidet grob **Data Drift** (die Verteilung der Eingangsmerkmale ändert sich, z. B. neue Warengruppen) und **Concept Drift** (der Zusammenhang zwischen Merkmalen und Zielvariable ändert sich, z. B. ein neuer Lieferant senkt die Reklamationsquote). Gegenmaßnahmen: laufendes **Monitoring** der Gütekennzahlen, definierte **Schwellenwerte** für ein Retraining und eine benannte Verantwortlichkeit für das Modell.

### Beispiel
Das Absatzmodell wurde 2024 trainiert. Seit der Einführung des Onlineshops 2026 sinkt sein R² auf Testdaten von 0,82 auf 0,61. Die festgelegte Schwelle 0,70 ist unterschritten → Retraining mit aktuellen Daten.

### Abgrenzung
**Overfitting** zeigt sich sofort beim Test (Training gut, Test schlecht); Model Drift tritt erst im Betrieb und mit der Zeit auf.

### Prüfungsfalle
Die Modellgüte als einmaligen Abnahmewert betrachten – ohne Monitoring bemerkt niemand den Drift.

### Merksatz
Die Welt läuft weiter, das Modell nicht – also messen und nachtrainieren.

Siehe auch: Monitoring · Overfitting · Modell · R²
Mehr: Deep Dive 7, 4.3 · Deep Dive 6, 6.1

## Modell
<!-- id: modell · quellen: Karte DD6, DD6 2.1 · stand: 2026-10 -->

Die aus Trainingsdaten gelernte Regel bzw. Funktion, mit der ein ML-Verfahren neue Fälle vorhersagt.

### Erklärung
Das **Verfahren** (z. B. Entscheidungsbaum) ist die Lernmethode, das **Modell** ihr Ergebnis auf konkreten Daten (der konkrete Baum mit seinen Schwellenwerten). Es nimmt Merkmale entgegen und liefert eine Vorhersage – eine Klasse, eine Wahrscheinlichkeit oder einen Zahlenwert. Seine Güte misst man an Testdaten, die beim Lernen nicht verwendet wurden.

### Beispiel
Aus 50.000 Aufträgen lernt der Entscheidungsbaum: „Wenn Warengruppe = Polstermöbel und Lieferdauer > 10 Tage, dann Reklamationsrisiko hoch.“ Diese Regelmenge ist das Modell.

### Abgrenzung
| Begriff | Bedeutung |
|---|---|
| Verfahren/Algorithmus | Lernmethode (k-NN, Entscheidungsbaum) |
| Modell | gelernte Regel auf konkreten Daten |
| Merkmal | Eingang des Modells |
| Zielvariable | Ausgang des Modells |

### Prüfungsfalle
Das Modell an denselben Daten bewerten, an denen es gelernt hat – das misst Auswendiglernen, nicht Vorhersagekraft.

### Merksatz
Das Verfahren lernt, das Modell ist das Gelernte.

Siehe auch: Merkmal · Zielvariable / Label · Trainingsdaten · Testdaten · Model Drift
Mehr: Deep Dive 6, 2.1

## Modus
<!-- id: modus · quellen: Karte DD3, DD3 Teil 3 · stand: 2026-10 -->

Lagemaß: der am häufigsten vorkommende Wert einer Verteilung (Modalwert).

### Erklärung
Der Modus ist das einzige Lagemaß für **nominale** Daten (Farbe, Zahlungsart), funktioniert aber auf jedem Skalenniveau. Eine Verteilung kann mehrere Modi haben (bimodal) – oft ein Hinweis auf zwei vermischte Gruppen. Bei fehlenden kategorialen Werten wird häufig mit dem Modus ersetzt, was die häufigste Kategorie künstlich verstärkt.

### Beispiel
Lieferzeiten 2, 3, 3, 4, 5, 5, 5, 6, 8, 19 → Modus 5 Tage (dreimal).
Zahlungsarten im Onlineshop: Karte 412, Rechnung 655, PayPal 233 → Modus „Rechnung“; ein Mittelwert ist hier sinnlos.

### Abgrenzung
| Lagemaß | ab Skalenniveau |
|---|---|
| Modus | nominal |
| Median | ordinal |
| Arithmetisches Mittel | metrisch |

### Prüfungsfalle
Den Modus mit der Häufigkeit verwechseln – der Modus ist der Wert (5 Tage), nicht die Anzahl (3).

### Merksatz
Modus = der Wert, der am öftesten da ist.

Siehe auch: Lagemaß · Median · Arithmetisches Mittel · Nominalskala
Mehr: Deep Dive 3, Teil 3

## MOLAP
<!-- id: molap · quellen: DD8 4.5 · stand: 2026-10 -->

Multidimensionales OLAP: Speicherform, bei der der OLAP-Würfel in einer eigenen multidimensionalen Struktur vorberechnet und gespeichert wird.

### Erklärung
Aggregate (z. B. Umsatz je Monat, Region, Warengruppe) werden beim Laden berechnet und abgelegt. Abfragen sind dadurch sehr schnell, weil kaum noch gerechnet werden muss. Nachteile: hoher Speicherbedarf, längere Ladezeiten und begrenzte Skalierbarkeit bei vielen Dimensionen und Detaildaten.

### Beispiel
Das Controlling navigiert im MOLAP-Würfel per Drill-down von Jahr → Quartal → Monat; jede Ansicht erscheint sofort, weil alle Summen schon vorberechnet sind. Der nächtliche Aufbau des Würfels dauert dafür zwei Stunden.

### Abgrenzung
| Form | Speicherung | Stärke | Schwäche |
|---|---|---|---|
| ROLAP | relational im Star-Schema | skaliert, detailgenau | langsamer |
| MOLAP | multidimensional, vorberechnet | sehr schnell | speicherintensiv |
| HOLAP | Aggregate MOLAP, Details ROLAP | Kompromiss | komplexer |

### Prüfungsfalle
MOLAP und ROLAP vertauschen – das M steht für die eigene multidimensionale Speicherstruktur.

### Merksatz
MOLAP rechnet vorher, damit die Abfrage nicht warten muss.

Siehe auch: ROLAP · HOLAP · OLAP-Würfel · Star-Schema · Drill-down
Mehr: Deep Dive 8, 4.5

## Monitoring
<!-- id: monitoring · quellen: DD6 6.1 · stand: 2026-10 -->

Laufende, automatisierte Überwachung eines produktiven Systems oder Modells anhand festgelegter Kennzahlen und Schwellenwerte.

### Erklärung
Im ML-Betrieb misst Monitoring die Modellgüte fortlaufend – nicht nur einmalig bei der Abnahme –, außerdem die Verteilung der Eingangsdaten und die Datenqualität der Lieferungen. Überschreitet eine Kennzahl ihren Schwellenwert, folgt eine Warnung und ggf. ein Retraining. Voraussetzung ist eine benannte Verantwortlichkeit. Im IT-Betrieb überwacht Monitoring entsprechend Verfügbarkeit, Antwortzeiten und Auslastung.

### Beispiel
Ein Dashboard zeigt wöchentlich den MAPE der Absatzprognose. Steigt er drei Wochen in Folge über 8 %, bekommt das Data-Science-Team automatisch eine Meldung.

### Abgrenzung
**Monitoring** misst und meldet; **Retraining** ist die Gegenmaßnahme; **Model Drift** ist die Ursache, die das Monitoring aufdecken soll.

### Prüfungsfalle
Monitoring ohne Schwellenwert und Zuständigkeit planen – dann sieht jemand die Kurve fallen, aber niemand handelt.

### Merksatz
Was nicht gemessen wird, verfällt unbemerkt.

Siehe auch: Model Drift · MAPE · Verfügbarkeit · Modell
Mehr: Deep Dive 6, 6.1

## MSE
<!-- id: mse · quellen: Karte DD7, DD7 Teil 3 · stand: 2026-10 -->

Mean Squared Error (mittlerer quadratischer Fehler): Durchschnitt der quadrierten Prognosefehler eines Regressionsmodells.

### Erklärung
$\text{MSE} = \frac{\sum (y - \hat{y})^2}{n}$. Durch das Quadrieren zählen große Fehler überproportional – ein Fehler von 10 wiegt so viel wie 25 Fehler von 2. Die Einheit ist quadriert (T€²) und damit schwer zu erklären; deshalb berichtet man meist den **RMSE** $= \sqrt{\text{MSE}}$. Viele Lernverfahren minimieren intern den MSE (Methode der kleinsten Quadrate).

### Beispiel
Fehler +10, −6, +6, −2, +2 → Quadrate 100, 36, 36, 4, 4, Summe 180.
- $\text{MSE} = \frac{180}{5} = 36{,}00$ T€²
- $\text{RMSE} = \sqrt{36} = 6{,}00$ T€
- MAE $= 5{,}20$ T€.

### Abgrenzung
| Maß | Einheit | große Fehler |
|---|---|---|
| MAE | wie Zielgröße | normal gewichtet |
| MSE | quadriert | stark gewichtet |
| RMSE | wie Zielgröße | stark gewichtet |

### Prüfungsfalle
Den MSE in der Einheit der Zielgröße angeben („36 T€“) – richtig ist T€², oder man nennt den RMSE.

### Merksatz
MSE quadriert – große Fehler tun doppelt weh.

Siehe auch: MAE · RMSE · MAPE · R²
Mehr: Deep Dive 7, Teil 3

## MTBF
<!-- id: mtbf · quellen: Karte DD16, DD16 4.2 · stand: 2026-10 -->

Mean Time Between Failures: mittlere Betriebszeit zwischen zwei Ausfällen eines reparierbaren Systems – Maß für die Zuverlässigkeit.

### Erklärung
Aus Betriebsdaten: $\text{MTBF} = \frac{\text{gesamte Laufzeit}}{\text{Anzahl Ausfälle}}$. Zusammen mit der MTTR ergibt sich die Verfügbarkeit: $V = \frac{\text{MTBF}}{\text{MTBF} + \text{MTTR}}$. Manche Quellen zählen die Reparaturzeit in die MTBF hinein (von Ausfall zu Ausfall); dann gilt $V = \frac{\text{MTTF}}{\text{MTBF}}$ – in der Aufgabe auf die Definition achten.

### Beispiel
Ein Datenbankserver läuft 2026 insgesamt 8.760 h, fällt 4-mal aus, Reparaturzeit zusammen 40 h.
- Laufzeit $= 8.760 - 40 = 8.720$ h
- $\text{MTBF} = \frac{8.720}{4} = 2.180$ h
- $\text{MTTR} = \frac{40}{4} = 10$ h

$V = \frac{2.180}{2.180 + 10} \approx 99{,}54\ \%$.

### Abgrenzung
| Kennzahl | misst | gilt für |
|---|---|---|
| MTBF | Zeit zwischen Ausfällen | reparierbare Systeme |
| MTTF | Zeit bis zum Ausfall | nicht reparierbare Teile |
| MTTR | Dauer der Wiederherstellung | Wartbarkeit |

### Prüfungsfalle
Die Gesamtzeit inklusive Reparatur durch die Ausfälle teilen, obwohl die Aufgabe MTBF als reine Betriebszeit definiert.

### Merksatz
MTBF hoch = selten kaputt.

Siehe auch: MTTR · MTTF · Verfügbarkeit · Verfügbarkeitsberechnung
Mehr: Deep Dive 16, 4.2

## MTTF
<!-- id: mttf · quellen: Karte DD16, DD16 4.2 · stand: 2026-10 -->

Mean Time To Failure: mittlere Betriebsdauer bis zum Ausfall bei Teilen, die nicht repariert, sondern ausgetauscht werden – z. B. Festplatten oder Lüfter.

### Erklärung
Hersteller geben die MTTF als statistischen Mittelwert über viele baugleiche Teile an. Sie sagt nichts darüber, wann ein einzelnes Teil ausfällt, hilft aber bei der Planung von Ersatzteilen und Austauschzyklen. Bei reparierbaren Systemen gilt bei Einbeziehung der Reparaturzeit: MTBF = MTTF + MTTR.

### Beispiel
Fünf Festplatten im Lagerserver fielen nach 30.000, 35.000, 40.000, 45.000 und 50.000 Betriebsstunden aus:
$\text{MTTF} = \frac{200.000}{5} = 40.000$ h. Trotzdem fiel die erste schon nach 30.000 h aus – deshalb RAID und Ersatzplatten vor Ort.

### Abgrenzung
**MTTF** für Austauschteile (ein Ausfall pro Teil), **MTBF** für reparierbare Systeme (viele Ausfälle über die Zeit).

### Prüfungsfalle
Die MTTF als garantierte Mindestlebensdauer deuten – sie ist ein Mittelwert.

### Merksatz
MTTF: Wie lange hält es bis zum ersten und einzigen Ausfall?

Siehe auch: MTBF · MTTR · RAID · Verfügbarkeit
Mehr: Deep Dive 16, 4.2

## MTTR
<!-- id: mttr · quellen: Karte DD16, DD16 4.2 · stand: 2026-10 -->

Mean Time To Repair (auch: to Recover): mittlere Dauer vom Ausfall bis zur Wiederherstellung des Betriebs – Maß für die Wartbarkeit.

### Erklärung
$\text{MTTR} = \frac{\text{gesamte Reparaturzeit}}{\text{Anzahl Ausfälle}}$. Sie umfasst Erkennen, Reagieren, Beheben und Prüfen. Die Verfügbarkeit steigt nicht nur durch seltenere Ausfälle (MTBF hoch), sondern auch durch **schnellere Wiederherstellung**: Monitoring mit Alarm, Ersatzteile vor Ort, Bereitschaftsdienst, automatisiertes Failover, geübte Wiederherstellung.

### Beispiel
MTBF 990 h, MTTR 10 h: $V = \frac{990}{1.000} = 99\ \%$.
Mit Ersatzteilen vor Ort sinkt die MTTR auf 2 h: $V = \frac{990}{992} \approx 99{,}80\ \%$.

### Abgrenzung
**MTTR** misst die Wiederherstellung nach einer Störung; der **RTO** (Recovery Time Objective) ist die vereinbarte maximal zulässige Ausfallzeit – ein Ziel, kein Messwert.

### Prüfungsfalle
Zur Verbesserung der Verfügbarkeit nur bessere Hardware nennen – schnelleres Wiederherstellen wirkt oft billiger.

### Merksatz
MTTR runter = schneller wieder da.

Siehe auch: MTBF · MTTF · Verfügbarkeit · Hochverfügbarkeit
Mehr: Deep Dive 16, 4.2

## Multiplizität
<!-- id: multiplizitat · quellen: Karte DD15 · stand: 2026-10 -->

Angabe an einer UML-Assoziation, wie viele Objekte der Klasse an der Beziehung beteiligt sein können, z. B. 1, 0..1, 0..* oder 1..*.

### Erklärung
Notiert wird als Bereich `min..max`; `*` steht für „beliebig viele“, `*` allein bedeutet `0..*`. Die Multiplizität steht – wie bei Chen – an der **gegenüberliegenden** Klasse: Sie sagt, mit wie vielen Objekten *dieser* Klasse ein Objekt der anderen Klasse verbunden ist.

### Beispiel
`Kunde 1 ——— 0..* Reparaturauftrag`: Ein Kunde hat 0 bis viele Aufträge (0..* steht beim Auftrag); jeder Auftrag gehört zu genau einem Kunden.
In Min-Max: KUNDE (0,n) —— (1,1) REPARATURAUFTRAG – die Werte wandern auf die andere Seite.

### Abgrenzung
| UML | Min-Max (andere Seite) | MC |
|---|---|---|
| 1 | (1,1) | 1 |
| 0..1 | (0,1) | c |
| 1..* | (1,n) | m/n |
| 0..* | (0,n) | mc/nc |

### Prüfungsfalle
Beim Übertragen ins ERM die Multiplizitäten auf derselben Seite lassen – dann sind alle Kardinalitäten vertauscht.

### Merksatz
UML zählt wie Chen: Die Zahl steht beim Gezählten.

Siehe auch: Assoziation · Klassendiagramm · Min-Max-Notation · MC-Notation · Kardinalität
Mehr: Deep Dive 15, 5.3

## Mutterschutz
<!-- id: mutterschutz · quellen: Karte DD13, DD13 2.4 · stand: 2026-10 -->

Gesetzlicher Schutz schwangerer und stillender Frauen nach dem Mutterschutzgesetz (MuSchG): Schutzfristen vor und nach der Entbindung, Kündigungsverbot und Beschäftigungsverbote.

### Erklärung
**Schutzfrist** 6 Wochen vor der Entbindung (die Frau darf auf eigenen ausdrücklichen Wunsch weiterarbeiten) und 8 Wochen danach (absolutes Beschäftigungsverbot); 12 Wochen bei Früh- und Mehrlingsgeburten sowie auf Antrag bei Behinderung des Kindes. Seit 01.06.2025 gibt es gestaffelte Schutzfristen auch nach einer **Fehlgeburt** ab der 13. Schwangerschaftswoche (2, 6 bzw. 8 Wochen; Stand 2026). **Kündigungsverbot** (§ 17 MuSchG) während der Schwangerschaft bis 4 Monate nach der Entbindung bzw. nach einer Fehlgeburt nach der 12. Woche. In den Schutzfristen zahlen Krankenkasse und Arbeitgeber gemeinsam das Mutterschaftsgeld bzw. den Zuschuss bis zum Nettoentgelt.

### Beispiel
Errechneter Geburtstermin einer Mitarbeiterin: 15.05.2026. Schutzfrist ab 03.04.2026; Entbindung tatsächlich am 15.05. → Schutzfrist bis 10.07.2026, Kündigungsverbot bis 15.09.2026.

### Abgrenzung
**Elternzeit** (bis 3 Jahre je Kind, für beide Elternteile) schließt sich an den Mutterschutz an und ist ein eigenes Recht mit eigenem Kündigungsschutz.

### Prüfungsfalle
Die 8 Wochen nach der Geburt für verzichtbar halten – nur die 6 Wochen davor sind freiwillig.

### Merksatz
Sechs vor, acht nach, vier Monate unkündbar.

Siehe auch: Elternzeit · Besonderer Kündigungsschutz · Schwerbehinderte Menschen
Mehr: Deep Dive 13, 2.4

## Ausgelassen
- Merkmale – Abschnittstitel Struktogramm
- Möbelhaus Nordholz GmbH – Firmenname Szenario
