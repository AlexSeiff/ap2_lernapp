<!-- Begriffsseiten L · Stand 2026-10 -->
## L – Load
<!-- id: l-load · quellen: DD8 3.1 · stand: 2026-10 -->

Dritte ETL-Phase: Die transformierten Daten werden ins Zielsystem (Data Warehouse, Data Mart) geladen, meist als nächtlicher Batch.

### Erklärung
Beim Laden unterscheidet man das **Erstladen** (Initial Load, kompletter Bestand) von der regelmäßigen **Aktualisierung** (inkrementell, nur neue und geänderte Sätze). Geladen wird in Zeiten geringer Last, damit weder Quell- noch Zielsystem das Tagesgeschäft bremsen. Fehlerhafte Datensätze werden **protokolliert** und in eine Quarantäne ausgeleitet, nie stillschweigend verworfen – sonst fehlen später Umsätze, ohne dass es jemand merkt.

### Beispiel
Der nächtliche Lauf im Möbelhaus Nordholz lädt 12.400 Kassenpositionen in die Faktentabelle; 37 Sätze mit unbekannter Filialnummer landen in der Quarantänetabelle und erscheinen im Ladeprotokoll.

### Abgrenzung
| Phase | Aufgabe |
|---|---|
| Extract | Daten aus den Quellen lesen (voll oder Delta) |
| Transform | bereinigen, vereinheitlichen, harmonisieren, anreichern |
| Load | ins Ziel schreiben und protokollieren |

Bei **ELT** wird zuerst roh geladen und erst im Zielsystem transformiert (typisch für Data Lake und Cloud-DWH).

### Prüfungsfalle
„Fehlerhafte Sätze beim Laden einfach überspringen“ ist falsch – ohne Protokoll ist die Vollständigkeit nicht prüfbar.

### Merksatz
Laden heißt schreiben und Rechenschaft ablegen: Jeder Satz kommt an oder steht im Protokoll.

Siehe auch: ETL · E – Extract · T – Transform · Data Warehouse · Staging Area
Mehr: Deep Dive 8, 3.1

## Lagemaß
<!-- id: lagemass · quellen: Karte DD3 · stand: 2026-10 -->

Kennzahl, die die Mitte bzw. den typischen Wert einer Verteilung beschreibt: arithmetisches Mittel, Median und Modus.

### Erklärung
Welches Lagemaß zulässig ist, hängt vom **Skalenniveau** ab: Der Modus geht immer (auch nominal), der Median ab ordinal, das arithmetische Mittel nur bei metrischen Daten. Das Mittel nutzt alle Werte, ist aber ausreißerempfindlich; der Median ist robust. Der Vergleich von Mittel und Median verrät die Schiefe einer Verteilung.

### Beispiel
Lieferzeiten in Tagen: 2, 3, 3, 4, 5, 5, 5, 6, 8, 19.
- $\bar{x} = \frac{60}{10} = 6{,}0$ Tage
- Median $= \frac{5 + 5}{2} = 5{,}0$ Tage
- Modus = 5 Tage.
Mittel > Median: Der Ausreißer 19 zieht nach oben, die Verteilung ist rechtsschief.

### Abgrenzung
| Lagemaß | Skalenniveau | Ausreißer |
|---|---|---|
| Modus | ab nominal | unempfindlich |
| Median | ab ordinal | robust |
| Arithmetisches Mittel | metrisch | empfindlich |

**Streuungsmaße** (Spannweite, Varianz, Standardabweichung) beschreiben dagegen, wie weit die Werte um die Mitte verteilt sind.

### Prüfungsfalle
Bei Gehältern oder Lieferzeiten mit Ausreißern nur den Mittelwert berichten – die typische Situation beschreibt der Median.

### Merksatz
Modus zählt, Median sortiert, Mittelwert rechnet.

Siehe auch: Median · Modus · Arithmetisches Mittel · Streuungsmaß · Skalenniveau
Mehr: Deep Dive 3, Teil 3

## Lakehouse
<!-- id: lakehouse · quellen: Karte DD8, DD8 5.1 · stand: 2026-10 -->

Datenarchitektur, die den günstigen, offenen Speicher eines Data Lake mit den Struktur- und Qualitätsgarantien eines Data Warehouse verbindet.

### Erklärung
Die Daten liegen in Objektspeicher in offenen Dateiformaten (z. B. Parquet). Ein **Tabellenformat** wie Delta Lake oder Apache Iceberg ergänzt ACID-Transaktionen, Schemaprüfung und Versionierung („Zeitreise“ zu älteren Ständen). Häufig werden die Daten in Stufen veredelt – Rohdaten → bereinigt → auswertungsfertig, oft „Bronze/Silver/Gold“ genannt; das entspricht Staging → Core → Data Mart im klassischen DWH.

### Beispiel
Das Möbelhaus legt Klickdaten des Onlineshops, Kassenbons und Sensordaten der Lager roh im Lakehouse ab; aus der Silver-Stufe speist sich sowohl das Controlling-Dashboard als auch das Prognosemodell der Data Scientists.

### Abgrenzung
| | Data Warehouse | Data Lake | Lakehouse |
|---|---|---|---|
| Daten | strukturiert | roh, alle Formate | roh und strukturiert |
| Schema | on Write | on Read | beides, mit Schemaprüfung |
| Transaktionen | ja | nein | ja (Tabellenformat) |

### Prüfungsfalle
Ein Lakehouse ist kein Data Lake mit neuem Namen – ohne Transaktionen, Schema und Katalog droht weiter der **Data Swamp**.

### Merksatz
Lakehouse = Speicher des Sees plus Ordnung des Lagerhauses.

Siehe auch: Data Lake · Data Warehouse · ACID · Staging Area
Mehr: Deep Dive 8, 5.1

## Lane
<!-- id: lane · quellen: Karte DD5, DD5 2.1, DD17 1.1 · stand: 2026-10 -->

Bahn innerhalb eines BPMN-Pools für eine Rolle oder Abteilung, die die dort liegenden Aufgaben ausführt.

### Erklärung
Ein **Pool** steht für einen eigenständigen Teilnehmer (Unternehmen, Kunde), die **Lanes** teilen ihn nach Zuständigkeiten auf – etwa Serviceannahme, Werkstatt, Buchhaltung. Der Ablauf darf die Lanes beliebig wechseln; dafür nimmt man normale **Sequenzflüsse**, weil alle Lanes zum selben Prozess gehören. Lanes machen Schnittstellen sichtbar: Jeder Lane-Wechsel ist eine Übergabe und damit ein möglicher Ort für Liegezeit.

### Beispiel
Pool „Möbelhaus Nordholz“ mit den Lanes Vertrieb und Lager: „Bestellung prüfen“ liegt in Vertrieb, „Ware kommissionieren“ in Lager; dazwischen ein durchgezogener Pfeil.

### Abgrenzung
| Element | steht für | Verbindung dazwischen |
|---|---|---|
| Pool | Teilnehmer/Organisation | nur Nachrichtenfluss |
| Lane | Rolle/Abteilung im Pool | Sequenzfluss |

### Prüfungsfalle
Zwischen zwei Lanes desselben Pools einen gestrichelten Nachrichtenfluss zeichnen – das ist falsch, Nachrichten fließen nur zwischen Pools.

### Merksatz
Pool = wer mitspielt, Lane = wer im Haus die Arbeit macht.

Siehe auch: Pool · BPMN · Sequenzfluss · Nachrichtenfluss
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Laplace-Wahrscheinlichkeit
<!-- id: laplace-wahrscheinlichkeit · quellen: Karte DD3, DD3 7.1 · stand: 2026-10 -->

Wahrscheinlichkeit eines Ereignisses, wenn alle Ergebnisse gleich wahrscheinlich sind: Anzahl günstiger Fälle geteilt durch Anzahl möglicher Fälle.

### Erklärung
Formel: $P(A) = \frac{\text{günstige Fälle}}{\text{mögliche Fälle}}$. Voraussetzung ist ein **Laplace-Experiment** – fairer Würfel, Zufallsauswahl aus einer Liste. In der Praxis sind Ergebnisse selten gleich wahrscheinlich; dann schätzt man die Wahrscheinlichkeit über die **relative Häufigkeit** aus Daten. Für „mindestens einmal“ rechnet man über das Gegenereignis.

### Beispiel
Für ein Audit wird eine von 8 Filialen zufällig gezogen, 3 liegen im Norden: $P(\text{Nord}) = \frac{3}{8} = 0{,}375 = 37{,}5\ \%$.
Schätzung aus Daten: 3 von 60 Aufträgen reklamiert → $\frac{3}{60} = 5\ \%$.

### Abgrenzung
Laplace setzt gleich wahrscheinliche Ergebnisse voraus (theoretisch); die relative Häufigkeit ist ein beobachteter Schätzwert, der sich mit wachsender Stichprobe der wahren Wahrscheinlichkeit nähert.

### Prüfungsfalle
Laplace auf ungleich wahrscheinliche Ergebnisse anwenden – „Auftrag reklamiert ja/nein“ ist nicht 50 : 50, nur weil es zwei Ausgänge gibt.

### Merksatz
Nur bei fairen Verhältnissen gilt: günstig durch möglich.

Siehe auch: Relative Häufigkeit · Gegenereignis
Mehr: Deep Dive 3, 7.1

## Lastenheft
<!-- id: lastenheft · quellen: Karte DD12, DD12 1.3 · stand: 2026-10 -->

Vom Auftraggeber erstelltes Dokument mit allen Anforderungen an Lieferungen und Leistungen – es beschreibt, **was** gefordert ist und **wofür**.

### Erklärung
Nach DIN 69901-5 ist das Lastenheft die „vom Auftraggeber festgelegte Gesamtheit der Forderungen“. Es entsteht vor der Beauftragung und dient als Grundlage für Ausschreibung und Angebote. Es enthält Ausgangslage, Ziele, funktionale und nicht-funktionale Anforderungen aus Anwendersicht, Rahmenbedingungen und Abnahmekriterien – aber keine technische Lösung. Gegen das Lastenheft prüft der Fachbereich später im **Abnahmetest**.

### Beispiel
Das Controlling des Möbelhauses fordert: „Monatlicher Umsatzbericht je Filiale und Warengruppe, bis zum 3. Werktag verfügbar, Export nach Excel, nur für Rolle Controlling sichtbar.“

### Abgrenzung
| | Lastenheft | Pflichtenheft |
|---|---|---|
| Ersteller | Auftraggeber | Auftragnehmer |
| Frage | Was und wofür? | Wie und womit? |
| Zeitpunkt | vor Beauftragung | nach Beauftragung |

### Prüfungsfalle
Lasten- und Pflichtenheft vertauschen – das Lastenheft schreibt immer der Auftraggeber.

### Merksatz
Lasten trägt der Kunde, Pflichten erfüllt der Lieferant.

Siehe auch: Pflichtenheft · Abnahmetest · Abnahme · Machbarkeitsstudie
Mehr: Deep Dive 12, 1.3

## Lastproblem
<!-- id: lastproblem · quellen: DD8 Teil 1 · stand: 2026-10 -->

Grund für die Trennung von OLTP und OLAP: Komplexe Auswertungen direkt auf dem operativen System bremsen das Tagesgeschäft aus.

### Erklärung
Operative Datenbanken sind auf viele kurze Schreib- und Lesevorgänge optimiert. Eine Analyseabfrage über Jahre und Millionen Zeilen belegt Prozessor, Speicher und Sperren – Kassen und Onlineshop werden langsam. Deshalb kopiert man die Daten per ETL in ein eigenes Analysesystem. Das Lastproblem ist einer von drei Prüfungsgründen für ein Data Warehouse, neben **fehlender Historie** und **verteilten Quellen**.

### Beispiel
Ein Quartalsbericht mit Joins über alle Kassenbons läuft mittags im Warenwirtschaftssystem – an den Kassen der Filialen dauert jede Buchung plötzlich mehrere Sekunden.

### Prüfungsfalle
Nur das Lastproblem nennen, wenn nach Gründen für ein DWH gefragt ist – erwartet werden alle drei.

### Merksatz
Wer im laufenden Betrieb analysiert, legt den Betrieb lahm.

Siehe auch: OLTP · OLAP · Data Warehouse · Fehlende Historie
Mehr: Deep Dive 8, Teil 1

## Lasttest
<!-- id: lasttest · quellen: Karte DD16 · stand: 2026-10 -->

Nicht-funktionaler Test, der prüft, wie sich ein System unter erwarteter oder erhöhter Last verhält – Antwortzeiten, Durchsatz, Fehlerrate.

### Erklärung
Funktionale Tests prüfen, *was* das System tut, nicht-funktionale, *wie gut*. Beim Lasttest simuliert ein Werkzeug viele gleichzeitige Nutzer oder Anfragen und misst gegen vorher festgelegte Grenzwerte aus dem Pflichtenheft (z. B. „Antwortzeit unter 2 s“). Er gehört meist zum Systemtest und findet in einer produktionsnahen Testumgebung statt.

### Beispiel
Das neue Filial-Dashboard wird mit 200 gleichzeitigen Nutzern getestet: 95 % der Seitenaufrufe müssen in unter 2 Sekunden laden.

### Abgrenzung
| Test | Last |
|---|---|
| Lasttest / Performancetest | erwartete bis erhöhte Last, Grenzwerte einhalten? |
| Stresstest | über die Belastungsgrenze hinaus – wo und wie bricht es? |

### Prüfungsfalle
Einen Lasttest ohne messbares Kriterium planen – „läuft schnell genug“ ist nicht prüfbar.

### Merksatz
Lasttest: hält es, was versprochen ist? Stresstest: wann bricht es?

Siehe auch: Stresstest · Systemtest · Load Balancer
Mehr: Deep Dive 16, 2.4

## Lazy Learner
<!-- id: lazy-learner · quellen: Karte DD6, DD6 7.1 · stand: 2026-10 -->

Lernverfahren ohne eigentliche Trainingsphase: Das „Modell“ sind die gespeicherten Trainingsdaten, gerechnet wird erst bei der Vorhersage.

### Erklärung
Das Standardbeispiel ist **k-NN**: Für jeden neuen Fall wird der Abstand zu allen gespeicherten Fällen berechnet, dann entscheiden die k nächsten Nachbarn. Training kostet damit fast nichts, jede Vorhersage dafür viel Rechenzeit und Speicher. Neue Daten lassen sich sofort nutzen, indem man sie einfach hinzufügt.

### Beispiel
Bei 50.000 gespeicherten Aufträgen berechnet k-NN für jeden neuen Auftrag 50.000 Abstände, bevor es „Reklamationsrisiko hoch“ oder „niedrig“ sagt.

### Abgrenzung
| | Lazy Learner (k-NN) | Eager Learner (Entscheidungsbaum, logistische Regression) |
|---|---|---|
| Training | praktisch keines | aufwendig |
| Vorhersage | langsam | schnell |
| Modell | die Daten selbst | gelernte Regel/Funktion |

### Prüfungsfalle
k-NN „trainiert ein Modell“ zu nennen – es speichert nur die Daten.

### Merksatz
Faul beim Lernen, fleißig beim Antworten.

Siehe auch: K-Nächste-Nachbarn · Mehrheitsentscheid · Entscheidungsbaum · Modell
Mehr: Deep Dive 6, 7.1

## Lean Management
<!-- id: lean-management · quellen: Karte DD5, DD5 6.2 · stand: 2026-10 -->

Führungs- und Organisationsansatz, der alle Abläufe am Kundennutzen ausrichtet und Verschwendung (japanisch *Muda*) beseitigt – alles, wofür der Kunde nicht bezahlen würde.

### Erklärung
Lean stammt aus dem Toyota-Produktionssystem. Es unterscheidet sieben Verschwendungsarten: Überproduktion, Wartezeit, Transport, Überbearbeitung, Bestände, Bewegung, Fehler/Nacharbeit – oft ergänzt um ungenutztes Wissen der Beschäftigten. Umgesetzt wird es über **Kaizen**/KVP (viele kleine Verbesserungen), **5S** für geordnete Arbeitsplätze und Standards, die das Erreichte sichern (SDCA).

### Beispiel
Im Reparaturservice liegt ein Auftrag zwei Tage im Postfach der Disposition (Wartezeit), Kundendaten werden in drei Systemen gepflegt (Überbearbeitung). Lean setzt zuerst dort an, nicht beim Tempo der Techniker.

### Abgrenzung
| Ansatz | Vorgehen |
|---|---|
| Lean / Kaizen | schrittweise, durch die Beschäftigten selbst |
| Business Process Reengineering | radikale Neugestaltung „auf der grünen Wiese“ |

### Prüfungsfalle
Lean als „Personal abbauen“ verstehen – Ziel ist weniger Verschwendung, nicht weniger Menschen.

### Merksatz
Was der Kunde nicht bezahlt, fliegt raus.

Siehe auch: Kaizen · KVP · 5S · Liegezeit · PDCA
Mehr: Deep Dive 5, 6.2

## Least Privilege
<!-- id: least-privilege · quellen: Karte DD10, DD10 4.3 · stand: 2026-10 -->

Sicherheitsprinzip: Jede Person, jeder Dienst und jedes Konto erhält nur die Rechte, die für die Aufgabe unbedingt nötig sind – und nur so lange wie nötig.

### Erklärung
Je weniger Rechte ein Konto hat, desto kleiner ist der Schaden bei Fehlbedienung, Schadsoftware oder gestohlenen Zugangsdaten. Umgesetzt wird es über rollenbasierte Rechte (RBAC), getrennte Admin-Konten, technische Konten mit minimalen Datenbankrechten und regelmäßige Rezertifizierung. Es unterstützt die DSGVO-Grundsätze Datenminimierung und Vertraulichkeit.

### Beispiel
Das ETL-Konto des Möbelhauses darf in den Quellsystemen nur lesen (`SELECT`), im DWH nur in die Staging-Tabellen schreiben. Eine SQL-Injection über dieses Konto kann so keine Kundentabelle löschen.

### Abgrenzung
| Prinzip | Frage |
|---|---|
| Least Privilege | Wie viele Rechte? So wenige wie möglich. |
| Need-to-know | Welche Daten? Nur fachlich erforderliche. |
| Funktionstrennung | Darf eine Person alles allein? Nein, z. B. anlegen ≠ freigeben. |

### Prüfungsfalle
Dem Analysten „vorsichtshalber“ Schreibrechte auf die Produktivdatenbank geben – genau das verbietet das Prinzip.

### Merksatz
So viel Recht wie nötig, so wenig wie möglich.

Siehe auch: Need-to-know · RBAC · Funktionstrennung · SQL-Injection
Mehr: Deep Dive 10, 4.3

## Lebenslinie
<!-- id: lebenslinie · quellen: DD15 5.4, DD17 2.5 · stand: 2026-10 -->

Gestrichelte senkrechte Linie unter jedem Beteiligten eines UML-Sequenzdiagramms; sie steht für dessen Existenz über die Zeit, die von oben nach unten läuft.

### Erklärung
Oben steht der Kopf mit dem Beteiligten (Objekt, System, Akteur), darunter die Lebenslinie. Nachrichten sind waagerechte Pfeile zwischen Lebenslinien, ihre Höhe gibt die Reihenfolge an. Schmale **Aktivierungsbalken** auf der Lebenslinie zeigen, wann der Beteiligte gerade arbeitet. Ein Kreuz am Ende kennzeichnet, dass ein Objekt zerstört wird.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 170" width="360" height="170" role="img" aria-label="Zwei Lebenslinien mit synchroner Nachricht, Aktivierungsbalken und Antwort">
<defs><marker id="lebenslinie-voll" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker><marker id="lebenslinie-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker></defs>
<rect x="30" y="10" width="100" height="30" class="dg-form"/>
<text x="80" y="25" text-anchor="middle" dominant-baseline="middle">:Filiale</text>
<rect x="230" y="10" width="100" height="30" class="dg-form"/>
<text x="280" y="25" text-anchor="middle" dominant-baseline="middle">:API</text>
<line x1="80" y1="40" x2="80" y2="160" class="dg-linie dg-strich"/>
<line x1="280" y1="40" x2="280" y2="160" class="dg-linie dg-strich"/>
<rect x="274" y="66" width="12" height="58" class="dg-grau"/>
<line x1="80" y1="70" x2="274" y2="70" class="dg-linie" marker-end="url(#lebenslinie-voll)"/>
<text x="177" y="60" text-anchor="middle" class="dg-klein">GET /auftraege/5001</text>
<line x1="274" y1="120" x2="80" y2="120" class="dg-linie dg-strich" marker-end="url(#lebenslinie-offen)"/>
<text x="177" y="110" text-anchor="middle" class="dg-klein">200 + JSON</text>
<text x="270" y="152" text-anchor="end" class="dg-klein dg-leise">Lebenslinie</text>
</svg>
```

### Abgrenzung
Die Lebenslinie gibt es nur im Sequenzdiagramm. Im Aktivitätsdiagramm teilen **Partitionen** die Zuständigkeiten auf, in BPMN die **Lanes** – beide zeigen Abläufe, keine Nachrichten über die Zeit.

### Prüfungsfalle
Die Lebenslinie durchgezogen zeichnen oder die Zeit von links nach rechts laufen lassen.

### Merksatz
Gestrichelt nach unten: So lange lebt der Beteiligte im Diagramm.

Siehe auch: Sequenzdiagramm · Aktivierungsbalken · Synchrone Nachricht · Antwortnachricht
Mehr: Deep Dive 15, 5.4 · Deep Dive 17, 2.5

## Lebenswichtige Interessen
<!-- id: lebenswichtige-interessen · quellen: Karte DD10, DD10 2.2 · stand: 2026-10 -->

Rechtsgrundlage nach Art. 6 Abs. 1 lit. d DSGVO: Die Verarbeitung ist erlaubt, wenn sie nötig ist, um Leben oder Gesundheit der betroffenen oder einer anderen Person zu schützen.

### Erklärung
Gedacht ist sie für Notfälle, in denen keine Einwilligung eingeholt werden kann. Nach Erwägungsgrund 46 soll sie nur greifen, wenn keine andere Rechtsgrundlage passt – sie ist eine Auffanggrundlage für Ausnahmesituationen (auch Epidemien, Katastrophen). Für Gesundheitsdaten (Art. 9) gilt die Parallelregel in Art. 9 Abs. 2 lit. c: nur, wenn die Person aus körperlichen oder rechtlichen Gründen nicht einwilligen kann.

### Beispiel
Ein Kunde bricht im Möbelhaus bewusstlos zusammen. Die Mitarbeiterin gibt dem Rettungsdienst Name und Telefonnummer aus der Kundenkarte, damit Angehörige verständigt werden können.

### Abgrenzung
| Grundlage | Beispiel |
|---|---|
| Einwilligung (lit. a) | Newsletter |
| Vertragserfüllung (lit. b) | Lieferadresse |
| Rechtliche Verpflichtung (lit. c) | Rechnungsaufbewahrung |
| Lebenswichtige Interessen (lit. d) | medizinischer Notfall |

### Prüfungsfalle
Lebenswichtige Interessen als Grundlage für alltägliche Verarbeitungen anführen – ohne echten Notfall trägt sie nicht.

### Merksatz
Lit. d ist für den Notarzt, nicht für das Marketing.

Siehe auch: Rechtsgrundlagen · Einwilligung · Vertragserfüllung · Besondere Kategorien personenbezogener Daten
Mehr: Deep Dive 10, 2.2

## LEFT JOIN
<!-- id: left-join · quellen: Karte DD1 · stand: 2026-10 -->

Verbund, der **alle** Zeilen der linken Tabelle liefert; fehlt in der rechten Tabelle ein passender Partner, stehen dort NULL-Werte.

### Erklärung
Der LEFT (OUTER) JOIN wird gebraucht, wenn Datensätze ohne Gegenstück nicht verschwinden dürfen. Zusammen mit `WHERE rechts.schluessel IS NULL` findet er genau die Zeilen ohne Partner – der Prüfungsklassiker „Kunden ohne Bestellung“.

### Beispiel
```sql
SELECT k.name
FROM kunde k
LEFT JOIN bestellung b ON k.kunden_id = b.kunden_id
WHERE b.bestell_id IS NULL;   -- Weber, Braun
```
`kunde LEFT JOIN bestellung` liefert 8 Zeilen: Huber 3×, Fischer 2×, Schmidt 1×, Weber und Braun je 1× mit NULL.

### Abgrenzung
| JOIN | Ergebnis |
|---|---|
| INNER JOIN | nur Zeilen mit Treffer auf beiden Seiten |
| LEFT JOIN | alle links, rechts ggf. NULL |
| RIGHT JOIN | spiegelbildlich |
| FULL OUTER JOIN | alle Zeilen beider Seiten |

### Prüfungsfalle
Eine Bedingung auf die rechte Tabelle ins WHERE schreiben (`WHERE b.bestelldatum >= …`) – dann fallen die NULL-Zeilen weg, und der LEFT JOIN wirkt wie ein INNER JOIN. Solche Filter gehören ins ON.

### Merksatz
Links bleibt alles, rechts füllt NULL die Lücken.

Siehe auch: INNER JOIN · NULL · NULL-Logik (Prüferklassiker)
Mehr: Deep Dive 1, 2.2

## Leihvertrag
<!-- id: leihvertrag · quellen: Karte DD14, DD14 2.4 · stand: 2026-10 -->

Vertrag über die **unentgeltliche** Überlassung einer Sache zum Gebrauch (§ 598 BGB); der Entleiher gibt dieselbe Sache zurück.

### Erklärung
Der Verleiher bleibt Eigentümer, der Entleiher wird nur Besitzer. Weil es kein Entgelt gibt, haftet der Verleiher nur für Vorsatz und grobe Fahrlässigkeit (§ 599 BGB); der Entleiher trägt die gewöhnlichen Erhaltungskosten. Zurückgegeben wird **dieselbe** Sache – das unterscheidet die Leihe vom Darlehen.

### Beispiel
Das Möbelhaus überlässt einem Kunden kostenlos einen Transporter für zwei Stunden, um sein Sofa nach Hause zu bringen.

### Abgrenzung
| Vertrag | Gegenleistung | Rückgabe |
|---|---|---|
| Leihvertrag | keine | dieselbe Sache |
| Mietvertrag | Miete | dieselbe Sache |
| Pachtvertrag | Pacht | dieselbe Sache, dazu Früchte |
| Darlehensvertrag | meist Zinsen | Sache gleicher Art (z. B. Geld) |

### Prüfungsfalle
Im Alltag sagt man „Geld leihen“ – rechtlich ist das ein Darlehen, keine Leihe.

### Merksatz
Leihe ist gratis, Miete kostet.

Siehe auch: Mietvertrag · Pachtvertrag · Darlehensvertrag · Besitz
Mehr: Deep Dive 14, 2.4

## Leitzins
<!-- id: leitzins · quellen: Karte DD14, DD14 4.4 · stand: 2026-10 -->

Von der Zentralbank festgelegter Zinssatz, zu dem sich Geschäftsbanken bei ihr Geld leihen oder anlegen können; im Euroraum setzt ihn die Europäische Zentralbank (EZB).

### Erklärung
Der Leitzins ist das Hauptinstrument der **Geldpolitik**. Die EZB hat drei Leitzinsen (Hauptrefinanzierungssatz, Einlagesatz, Spitzenrefinanzierungssatz); in Nachrichten ist meist einer davon gemeint. Ziel ist Preisstabilität bei mittelfristig 2 % Inflation. Eine **Erhöhung** verteuert Kredite, dämpft Investitionen, Konsum und damit den Preisauftrieb; eine **Senkung** regt die Wirtschaft an. Weitere Instrumente sind Offenmarktgeschäfte und die Mindestreserve.

### Beispiel
Steigen die Leitzinsen, verlangt die Hausbank für den Kredit des Möbelhauses für ein neues Lager höhere Zinsen – das Projekt wird verschoben, auch Kunden finanzieren seltener Küchen auf Raten.

### Abgrenzung
**Geldpolitik** macht die Zentralbank (Leitzins), **Fiskalpolitik** der Staat (Ausgaben und Steuern).

### Prüfungsfalle
Die Bundesregierung oder die Bundesbank allein als Entscheider über den Leitzins nennen – im Euroraum entscheidet der EZB-Rat.

### Merksatz
Zins rauf, Inflation runter – Zins runter, Wirtschaft rauf.

Siehe auch: Geldpolitik · Fiskalpolitik · Inflation · Magisches Viereck
Mehr: Deep Dive 14, 4.4

## Lernrate
<!-- id: lernrate · quellen: Karte DD6, DD6 9.4 · stand: 2026-10 -->

Schrittweite η (eta), mit der die Gewichte eines Modells bei jedem Lernschritt angepasst werden.

### Erklärung
In der Perzeptron-Lernregel steht die Lernrate als Faktor vor der Korrektur: wᵢ neu = wᵢ + η · (t − y) · xᵢ. Bei Backpropagation bestimmt sie, wie weit jedes Gewicht in Richtung des kleineren Fehlers geht. Eine zu große Lernrate lässt die Gewichte über eine gute Lösung hinausspringen; das Training pendelt oder kommt nicht zur Ruhe. Eine zu kleine Lernrate macht winzige Schritte, das Training braucht sehr viele Epochen. Die Lernrate ist ein Hyperparameter: Sie wird nicht gelernt, sondern vorher festgelegt und mit Validierungsdaten abgestimmt.

### Beispiel
Perzeptron mit w₂ = 0,5, Fehler e = −1 und x₂ = 1: Mit η = 0,2 wird w₂ = 0,5 − 0,2 = 0,3, mit η = 1 dagegen −0,5 – ein großer Sprung.

### Prüfungsfalle
Die Lernrate in der Lernregel weglassen und nur w + (t − y) · x rechnen.

### Merksatz
Zu groß springt, zu klein schleicht.

Siehe auch: Perzeptron-Lernregel · Backpropagation · Epoche · Validierungsdaten
Mehr: Deep Dive 6, 9.4

## Lessons Learned
<!-- id: lessons-learned · quellen: Karte DD12, DD12 Teil 5 · stand: 2026-10 -->

Systematisch gesammelte und dokumentierte Erfahrungen aus einem Projekt – was gut lief, was nicht und was man künftig anders macht.

### Erklärung
Lessons Learned gehören zum **Projektabschluss**, werden aber besser schon nach jeder Phase festgehalten, solange die Erinnerung frisch ist. Typisch ist ein moderierter Workshop mit dem Team; das Ergebnis wird zentral abgelegt, damit Folgeprojekte darauf zugreifen. In der IHK-Projektdokumentation gehören sie ins Fazit.

### Beispiel
„Die Datenqualität der Filiale Süd wurde unterschätzt; Bereinigung kostete 12 statt 4 Stunden. Künftig vor der Planung eine Stichprobe der Quelldaten prüfen.“

### Abgrenzung
Die **Retrospektive** in Scrum findet nach jedem Sprint statt und verbessert sofort die Zusammenarbeit im laufenden Projekt; Lessons Learned richten sich vor allem an künftige Projekte.

### Prüfungsfalle
Lessons Learned als Schuldzuweisung formulieren – gefragt sind Ursachen und konkrete Verbesserungen.

### Merksatz
Fehler einmal machen ist Erfahrung, zweimal ist fehlende Dokumentation.

Siehe auch: Projektabschluss · Soll-Ist-Vergleich · Projekt
Mehr: Deep Dive 12, Teil 5

## Levenshtein-Distanz
<!-- id: levenshtein-distanz · quellen: Karte DD9, DD9 4.2 · stand: 2026-10 -->

Ähnlichkeitsmaß für Zeichenketten: die minimale Anzahl von Einfüge-, Lösch- und Ersetzungsoperationen, um einen Text in einen anderen zu überführen.

### Erklärung
Je kleiner die Distanz, desto ähnlicher die Texte; 0 heißt identisch. In der Dublettenerkennung findet sie Tippfehler und Schreibvarianten. Weil die absolute Zahl von der Textlänge abhängt, nutzt man oft eine normierte Ähnlichkeit (Distanz geteilt durch die Länge des längeren Texts) und einen Schwellenwert. Vorher normalisiert man (Groß-/Kleinschreibung, Sonderzeichen, Rechtsformzusätze).

### Beispiel
„Müller“ → „Mueller“: ü durch u ersetzen, e einfügen = **2**.
„Braun GmbH“ → „Braun G.m.b.H.“: vier Punkte einfügen = **4**; nach dem Entfernen der Punkte = 0.

### Abgrenzung
| Verfahren | vergleicht |
|---|---|
| Levenshtein-Distanz | Schreibweise (Zeichen für Zeichen) |
| Kölner Phonetik / Soundex | Klang („Meier“, „Mayer“, „Maier“ → gleicher Code) |

### Prüfungsfalle
Ohne vorherige Normalisierung vergleichen – dann erscheinen echte Dubletten unnötig verschieden.

### Merksatz
Levenshtein zählt Tippfehler, die Phonetik hört zu.

Siehe auch: Dublette · Kölner Phonetik · Golden Record · Record Linkage
Mehr: Deep Dive 9, 4.2

## Lieferkettengesetz
<!-- id: lieferkettengesetz · quellen: Karte DD14, DD14 5.2 · stand: 2026-10 -->

Lieferkettensorgfaltspflichtengesetz (LkSG): Unternehmen mit mindestens 1.000 Beschäftigten im Inland müssen Menschenrechts- und Umweltrisiken in ihrer Lieferkette ermitteln, vorbeugen und abstellen.

### Erklärung
Das LkSG gilt seit 2023 (ab 3.000 Beschäftigten), seit 2024 ab 1.000. Die **Sorgfaltspflichten**: Risikomanagement und Risikoanalyse, Grundsatzerklärung, Präventions- und Abhilfemaßnahmen, Beschwerdeverfahren, Dokumentation. Die jährliche **Berichtspflicht** soll nach einem Änderungsgesetz der Bundesregierung (Kabinett September 2025) rückwirkend entfallen, Bußgelder nur noch bei schweren Verstößen drohen; die Sorgfaltspflichten bleiben (Stand 2026). Abgelöst werden soll das LkSG durch die Umsetzung der EU-Richtlinie **CSDDD** – nach Omnibus I nur noch für Unternehmen ab 5.000 Beschäftigten und 1,5 Mrd. € Umsatz, anzuwenden ab Juli 2029.

### Beispiel
Ein Möbelhersteller mit 1.400 Beschäftigten prüft seine Holzlieferanten auf illegale Abholzung und Kinderarbeit und richtet ein Hinweisgeberportal ein.

### Abgrenzung
**LkSG/CSDDD** regeln Sorgfaltspflichten in der Lieferkette; die **CSRD** regelt die Nachhaltigkeitsberichterstattung des Unternehmens selbst.

### Prüfungsfalle
Zu sagen, mit dem Wegfall der Berichtspflicht sei das ganze Gesetz entfallen – die Sorgfaltspflichten gelten weiter.

### Merksatz
Berichten wird leichter, hinschauen bleibt Pflicht.

Siehe auch: CSDDD · CSRD · ESG
Mehr: Deep Dive 14, 5.2

## Lieferungsverzug
<!-- id: lieferungsverzug · quellen: Karte DD14, DD14 2.5 · stand: 2026-10 -->

Störung des Kaufvertrags: Der Verkäufer liefert trotz Fälligkeit und Mahnung nicht rechtzeitig (Schuldnerverzug, § 286 BGB).

### Erklärung
Voraussetzungen: **Fälligkeit**, **Mahnung** und **Vertretenmüssen** des Verkäufers. Die Mahnung ist entbehrlich, wenn der Liefertermin kalendermäßig bestimmt ist („bis 15.03.“) oder der Verkäufer endgültig verweigert. Rechte des Käufers: weiter Lieferung verlangen plus **Verzugsschaden**; nach erfolgloser angemessener **Nachfrist** Rücktritt (§ 323 BGB) und/oder Schadensersatz statt der Leistung (§ 281 BGB). Beim Fixgeschäft ist keine Nachfrist nötig.

### Beispiel
Das Möbelhaus bestellt 50 Sofas „Lieferung bis 15.03.2026“. Am 16.03. ist der Lieferant ohne Mahnung im Verzug. Das Möbelhaus setzt eine Nachfrist bis 30.03.; danach tritt es zurück und kauft bei einem anderen Hersteller – die Mehrkosten verlangt es als Schadensersatz.

### Abgrenzung
| Störung | Wer leistet nicht richtig? |
|---|---|
| Lieferungsverzug | Verkäufer liefert zu spät |
| Mangelhafte Lieferung | Verkäufer liefert schlecht |
| Zahlungsverzug | Käufer zahlt zu spät |
| Annahmeverzug | Käufer nimmt nicht an |

### Prüfungsfalle
Sofort zurücktreten ohne Nachfrist – nur beim Fixgeschäft oder bei endgültiger Verweigerung zulässig.

### Merksatz
Fällig, gemahnt, verschuldet – dann Nachfrist, dann Rücktritt.

Siehe auch: Zahlungsverzug · Mangelhafte Lieferung · Kaufvertrag
Mehr: Deep Dive 14, 2.5

## Liegezeit
<!-- id: liegezeit · quellen: Karte DD5, DD5 3.1 · stand: 2026-10 -->

Zeit, in der ein Vorgang wartet, ohne bearbeitet zu werden – meist der größte Anteil der Durchlaufzeit und damit der größte Hebel zur Verkürzung.

### Erklärung
Die **Durchlaufzeit** setzt sich zusammen aus Bearbeitungs-, Liege-, Transport- und Rüstzeit. Liegezeiten entstehen an Schnittstellen: Übergaben zwischen Abteilungen, volle Postfächer, Warten auf Freigaben oder Teile. Process Mining macht sie aus Zeitstempeln im Event Log sichtbar.

### Beispiel
Reparaturauftrag: Bearbeitungszeit 1,5 h, Durchlaufzeit 30 h → Liegezeit 28,5 h.
Wertschöpfungsanteil $= \frac{1{,}5}{30} \cdot 100 = 5\ \%$ – in 95 % der Zeit passiert nichts mit dem Auftrag.

### Abgrenzung
| Zeit | Inhalt |
|---|---|
| Bearbeitungszeit | echte Wertschöpfung |
| Liegezeit | Warten auf den nächsten Schritt |
| Transportzeit | Weitergabe, Versand |
| Rüstzeit | Vorbereitung, Einarbeitung |

### Prüfungsfalle
„Die Techniker sollen schneller arbeiten“ vorschlagen – der Hebel liegt fast immer in den Liegezeiten.

### Merksatz
Nicht die Arbeit dauert, sondern das Warten.

Siehe auch: Durchlaufzeit · Bearbeitungszeit · Lean Management · Process Mining
Mehr: Deep Dive 5, 3.1

## Lift
<!-- id: lift · quellen: Karte DD6, DD6 4.1 · stand: 2026-10 -->

Kennzahl der Assoziationsanalyse: Konfidenz der Regel A → B geteilt durch den Support von B – sie zeigt, wie viel häufiger A und B gemeinsam auftreten als zufällig zu erwarten.

### Erklärung
$\text{Lift} = \frac{\text{Konfidenz}(A \to B)}{\text{Support}(B)}$. Lift > 1: positiver Zusammenhang; = 1: unabhängig; < 1: negativer Zusammenhang (z. B. Ersatzprodukte). Der Lift ist **symmetrisch** (A → B gleich B → A), die Konfidenz nicht.

### Beispiel
1.000 Kassenbons, 100 mit Sofa, 200 mit Kissen, 60 mit beidem.
- Konfidenz(Sofa → Kissen) $= \frac{60}{100} = 0{,}6$
- Support(Kissen) $= \frac{200}{1000} = 0{,}2$
- Lift $= \frac{0{,}6}{0{,}2} = 3$.
Wer ein Sofa kauft, nimmt dreimal so häufig Kissen mit wie der Durchschnittskunde.

### Abgrenzung
| Kennzahl | Frage |
|---|---|
| Support | Wie häufig ist die Kombination? |
| Konfidenz | Wie zuverlässig folgt B auf A? |
| Lift | Besser als Zufall? |

### Prüfungsfalle
Eine hohe Konfidenz allein als starken Zusammenhang deuten – ist B ohnehin in fast jedem Warenkorb, ist die Konfidenz immer hoch; erst der Lift entlarvt das.

### Merksatz
Lift über 1 hebt, Lift unter 1 bremst.

Siehe auch: Support · Konfidenz · Assoziationsanalyse
Mehr: Deep Dive 6, 4.1

## Likert-Skala
<!-- id: likert-skala · quellen: Karte DD3, DD3 7.4 · stand: 2026-10 -->

Befragungsskala, auf der Befragte ihre Zustimmung zu Aussagen in meist fünf Stufen angeben – von „stimme gar nicht zu“ bis „stimme voll zu“.

### Erklärung
Streng genommen ist die Likert-Skala **ordinal**: Die Rangfolge ist klar, die Abstände zwischen den Stufen sind es nicht. Median und Modus sind daher immer zulässig. Ein Mittelwert setzt gleiche Abstände voraus – in der Praxis üblich, in der Prüfung aber als Annahme zu nennen. Eine ungerade Stufenzahl erlaubt eine neutrale Mitte, eine gerade erzwingt eine Tendenz.

### Beispiel
„Das Dashboard ist übersichtlich“: 20 Antworten – 1× „1“, 2× „2“, 4× „3“, 8× „4“, 5× „5“. Median = 4 (10. und 11. Wert sind 4), Modus = 4.

### Abgrenzung
Das **Polaritätsprofil** bewertet einen Gegenstand zwischen Gegensatzpaaren („schnell – langsam“), die Likert-Skala die Zustimmung zu einer Aussage.

### Prüfungsfalle
Einen Mittelwert von 3,4 ohne Hinweis berichten – er unterstellt gleiche Abstände und kann eine polarisierte Verteilung (viele 1er, viele 5er) verdecken.

### Merksatz
Likert ist ordinal: Median sicher, Mittelwert nur mit Fußnote.

Siehe auch: Ordinalskala · Polaritätsprofil · Median · Skalenniveau
Mehr: Deep Dive 3, 7.4

## Lineare Suche
<!-- id: lineare-suche · quellen: Karte DD11, DD11 B7 · stand: 2026-10 -->

Suchverfahren, das die Elemente einer Liste nacheinander von vorn prüft, bis der gesuchte Wert gefunden oder die Liste zu Ende ist.

### Erklärung
Die lineare (sequenzielle) Suche funktioniert auch bei **unsortierten** Listen und ist einfach zu programmieren. Der Aufwand wächst linear mit der Anzahl n: bester Fall O(1) (Treffer an erster Stelle), mittlerer und schlechtester Fall O(n). Für einmalige Suchen in kleinen oder unsortierten Daten ist sie die richtige Wahl.

### Beispiel
Gesucht 57 in 12, 19, 23, 31, 42, 57, 64, 78: Treffer nach 6 Vergleichen. Bei 1.000.000 Datensätzen sind es im schlechtesten Fall 1.000.000 Vergleiche – die binäre Suche braucht höchstens 20.

### Abgrenzung
| | Lineare Suche | Binäre Suche |
|---|---|---|
| Voraussetzung | keine | sortierte Liste |
| Aufwand | O(n) | O(log n) |

### Prüfungsfalle
Für die lineare Suche eine sortierte Liste verlangen – das ist Voraussetzung der binären Suche.

### Merksatz
Linear geht immer, aber nie schnell.

Siehe auch: Binäre Suche · O-Notation · Index
Mehr: Deep Dive 11, B7

## Lineare Trennbarkeit
<!-- id: lineare-trennbarkeit · quellen: Karte DD6, DD6 9.6 · stand: 2026-10 -->

Eigenschaft zweier Klassen, sich im Merkmalsraum durch eine Gerade (bei mehr Merkmalen eine Ebene) vollständig trennen zu lassen.

### Erklärung
Ein einzelnes Perzeptron zieht genau eine solche Trenngerade: Auf der einen Seite ist die gewichtete Summe mindestens 0, auf der anderen negativ. Es kann deshalb nur linear trennbare Klassen fehlerfrei lernen – dann aber sicher nach endlich vielen Schritten (Konvergenzsatz). AND und OR sind linear trennbar, XOR nicht: Dort liegen die Fälle mit Ausgabe 1, (0|1) und (1|0), diagonal gegenüber. Minsky und Papert zeigten 1969, dass ein einzelnes Perzeptron daran scheitert. Ein Netz mit verdeckter Schicht löst das Problem.

### Beispiel
Das AND-Perzeptron mit w₁ = w₂ = 0,3 und b = −0,5 trennt mit der Geraden 0,3 x₁ + 0,3 x₂ − 0,5 = 0 den Fall (1|1) von den drei anderen.

### Abgrenzung
| Funktion | linear trennbar | lernbar mit einem Perzeptron |
|---|---|---|
| AND, OR | ja | ja |
| XOR | nein | nein, erst mit verdeckter Schicht |

### Merksatz
Eine Gerade, ein Perzeptron – für XOR braucht es mehr.

Siehe auch: Perzeptron · Mehrschichtiges Perzeptron · Neuron
Mehr: Deep Dive 6, 9.6

## Liniendiagramm
<!-- id: liniendiagramm · quellen: Karte DD11, DD17 6.3 · stand: 2026-10 -->

Diagramm, das Werte entlang einer geordneten x-Achse – meist der Zeit – durch Linien verbindet und so Trends, Saisonmuster und Ausreißer im Verlauf zeigt.

### Erklärung
Die Linie zwischen zwei Punkten suggeriert einen stetigen Übergang. Deshalb ist das Liniendiagramm nur für **geordnete** x-Werte geeignet (Tage, Monate, Jahre). Mehrere Linien lassen sich gut vergleichen, wenn es nicht mehr als etwa fünf sind. Anders als beim Balken ist eine y-Achse ohne Nullpunkt vertretbar, wenn der Ausschnitt gekennzeichnet ist.

### Beispiel
Monatsumsatz der Filialen Nord und Süd von Januar bis Dezember 2026 als zwei Linien: Der Saisongipfel im November ist sofort sichtbar.

### Abgrenzung
| Aussageziel | Diagramm |
|---|---|
| Entwicklung über Zeit | Liniendiagramm |
| Vergleich von Kategorien | Säulen-/Balkendiagramm |
| Zusammenhang zweier Merkmale | Streudiagramm |

### Prüfungsfalle
Umsatz je Filiale als Linie zeichnen – Filialen sind Kategorien, die Linie täuscht einen Verlauf vor, den es nicht gibt.

### Merksatz
Linie nur, wo die Zeit läuft.

Siehe auch: Säulendiagramm · Balkendiagramm · Zeitreihe · Lügenfaktor
Mehr: Deep Dive 17, 6.3 · Deep Dive 11, A3

## Load Balancer
<!-- id: load-balancer · quellen: Karte DD16, DD16 4.5 · stand: 2026-10 -->

Komponente, die eingehende Anfragen auf mehrere Server verteilt und so vor Überlastung und vor dem Ausfall einzelner Server schützt.

### Erklärung
Der Load Balancer steht vor einer Gruppe gleichartiger Server (z. B. Webserver). Er verteilt nach einer Strategie – reihum (Round Robin), nach geringster Last oder nach Antwortzeit – und prüft per **Health Check**, ob ein Server noch antwortet. Fällt einer aus, bekommt er keine Anfragen mehr. So steigen Verfügbarkeit und Kapazität (horizontale Skalierung). Der Load Balancer selbst muss redundant sein, sonst ist er der neue Single Point of Failure.

### Beispiel
Zum Black-Friday-Verkauf verteilt der Load Balancer die Shop-Zugriffe des Möbelhauses auf vier Webserver; als einer abstürzt, merken die Kunden nichts.

### Abgrenzung
| Maßnahme | schützt gegen |
|---|---|
| Load Balancer | Überlast und Ausfall einzelner Server |
| Cluster aktiv/passiv | Serverausfall (Übernahme durch Standby) |
| RAID | Plattenausfall |
| Backup | Datenverlust (Löschung, Ransomware) |

### Prüfungsfalle
Load Balancing als Datensicherung verkaufen – es hilft nicht gegen gelöschte oder verschlüsselte Daten.

### Merksatz
Viele Server, ein Verteiler: Last teilen, Ausfälle umgehen.

Siehe auch: Hochverfügbarkeit · Cluster · Horizontale Skalierung · Lasttest
Mehr: Deep Dive 16, 4.5

## Logisches Datenmodell
<!-- id: logisches-datenmodell · quellen: Karte DD2 · stand: 2026-10 -->

Zweite Ebene der Datenmodellierung: das Relationenmodell mit Tabellen, Attributen, Primär- und Fremdschlüsseln – noch ohne Festlegung auf ein konkretes Datenbanksystem.

Auch: Logisch

### Erklärung
Das logische Modell entsteht durch Überführung des **konzeptionellen** ER-Modells: Entitäten werden Tabellen, 1:n-Beziehungen werden Fremdschlüssel auf der n-Seite, m:n-Beziehungen eine eigene Zwischentabelle. Anschließend wird normalisiert (meist bis zur 3. NF). Erst das **physische** Modell legt Datentypen, Indizes und SQL-Syntax des gewählten DBMS fest.

### Beispiel
ERM: KUNDE erteilt BESTELLUNG (1:n), BESTELLUNG enthält PRODUKT (m:n).
Logisch: kunde(**kunden_id**, name) · bestellung(**bestell_id**, datum, ↑kunden_id) · bestellposition(**↑bestell_id, ↑produkt_id**, menge) · produkt(**produkt_id**, bezeichnung, preis).

### Abgrenzung
| Ebene | Inhalt | Darstellung |
|---|---|---|
| Konzeptionell | fachliche Objekte und Beziehungen | ER-Modell |
| Logisch | Tabellen, Schlüssel | Relationenschema |
| Physisch | Datentypen, Indizes, DDL | CREATE TABLE |

### Prüfungsfalle
Schon im logischen Modell Datentypen wie `VARCHAR(50)` verlangen – das gehört ins physische Modell.

### Merksatz
Konzeptionell: was es gibt. Logisch: in welchen Tabellen. Physisch: in welchem System.

Siehe auch: Konzeptionelles Datenmodell · Physisches Datenmodell · Normalisierung · Zwischentabelle
Mehr: Deep Dive 2, 1.1

## Logistische Regression
<!-- id: logistische-regression · quellen: Karte DD6, DD6 2.4 · stand: 2026-10 -->

Überwachtes Klassifikationsverfahren, das die Wahrscheinlichkeit für eine Klasse schätzt und dann per Schwellenwert zuordnet; robust und gut interpretierbar.

### Erklärung
Trotz des Namens ist sie ein **Klassifikations**verfahren. Sie bildet aus den Merkmalen eine gewichtete Summe und presst sie mit der logistischen (Sigmoid-)Funktion in den Bereich 0 bis 1. Liegt die Wahrscheinlichkeit über dem Schwellenwert (meist 0,5), wird die positive Klasse vorhergesagt. Die Gewichte zeigen, welche Merkmale das Risiko erhöhen oder senken – das macht sie für Fachbereiche gut erklärbar.

### Beispiel
Ein Modell schätzt für einen Reparaturauftrag eine Reklamationswahrscheinlichkeit von 0,73 → über 0,5 → Klasse „Reklamation“. Senkt man die Schwelle auf 0,3, findet man mehr echte Reklamationen (Recall steigt), aber auch mehr Fehlalarme.

### Abgrenzung
| Verfahren | Zielgröße |
|---|---|
| Lineare Regression | stetig (z. B. Umsatz) |
| Logistische Regression | Klasse (ja/nein) mit Wahrscheinlichkeit |

### Prüfungsfalle
Sie wegen des Wortes „Regression“ der Regression statt der Klassifikation zuordnen.

### Merksatz
Logistisch heißt: Wahrscheinlichkeit rein, Klasse raus.

Siehe auch: Klassifikation · Regression · Entscheidungsbaum · Random Forest
Mehr: Deep Dive 6, 2.4

## Lohnsteuer
<!-- id: lohnsteur · quellen: Karte DD14, DD14 1.4 · stand: 2026-10 -->

Erhebungsform der Einkommensteuer auf Arbeitslohn: Der Arbeitgeber behält sie monatlich ein und führt sie an das Finanzamt ab – eine Vorauszahlung auf die Jahressteuer.

### Erklärung
Die Höhe hängt von Bruttolohn und **Steuerklasse** ab (I ledig, II alleinerziehend, III/V und IV/IV Verheiratete, VI Zweitjob). Bleibt das zu versteuernde Einkommen unter dem **Grundfreibetrag** (2026: 12.348 €, Stand 2026), fällt keine Einkommensteuer an. An die Lohnsteuer gekoppelt sind Solidaritätszuschlag (nur noch bei hohen Einkommen) und Kirchensteuer (8 bzw. 9 % der Lohnsteuer). Mit der Steuererklärung wird die tatsächliche Jahressteuer ermittelt; zu viel gezahlte Lohnsteuer wird erstattet.

### Beispiel
Jonas (17) verdient 1.200 € brutto im Monat, 14.400 € im Jahr. Nach Arbeitnehmer-Pauschbetrag (1.230 €), Sonderausgaben-Pauschbetrag und Vorsorgepauschale liegt sein zu versteuerndes Einkommen unter 12.348 € → Lohnsteuer 0 €, Netto 946,20 € nach 253,80 € Sozialversicherung.

### Abgrenzung
Die Lohnsteuer ist **keine eigene Steuer**, sondern die Erhebungsform der Einkommensteuer bei Arbeitnehmern. Sozialversicherungsbeiträge sind keine Steuern.

### Prüfungsfalle
Den Grundfreibetrag direkt mit dem Jahresbrutto vergleichen – maßgeblich ist das zu versteuernde Einkommen nach Abzügen.

### Merksatz
Lohnsteuer ist Einkommensteuer auf Raten.

Siehe auch: Steuerklassen · Grundfreibetrag · Solidaritätszuschlag · Kirchensteuer · Nettoentgelt
Mehr: Deep Dive 14, 1.4

## Löschanomalie
<!-- id: loschanomalie · quellen: Karte DD2, DD2 2.2 · stand: 2026-10 -->

Folge fehlender Normalisierung: Beim Löschen eines Datensatzes gehen ungewollt andere Informationen verloren, die nur in diesem Datensatz gespeichert waren.

### Erklärung
In einer nicht normalisierten Tabelle stecken mehrere Sachverhalte in einer Zeile (z. B. Auftrag und Kunde). Wird die Zeile gelöscht, verschwinden alle Sachverhalte gemeinsam. Die Normalisierung trennt die Sachverhalte in eigene Tabellen und beseitigt so die Anomalie.

### Beispiel
Tabelle `auftrag(auftrag_nr, datum, kunden_nr, kundenname, ort)`: Hat Kunde Weber nur einen Auftrag und wird dieser storniert und gelöscht, ist auch Webers Name und Adresse weg. Nach der Zerlegung in `kunde` und `auftrag` bleibt Weber erhalten.

### Abgrenzung
| Anomalie | tritt auf beim |
|---|---|
| Einfügeanomalie | Erfassen – Sachverhalt ohne Schlüsselwert nicht speicherbar |
| Änderungsanomalie | Ändern – Wert muss in vielen Zeilen geändert werden |
| Löschanomalie | Löschen – andere Information geht mit verloren |

### Prüfungsfalle
Die Löschanomalie mit einem Fehler der referenziellen Integrität verwechseln – sie entsteht durch Redundanz in einer Tabelle, nicht durch Fremdschlüssel.

### Merksatz
Wer den letzten Auftrag löscht, löscht in der breiten Tabelle den Kunden mit.

Siehe auch: Einfügeanomalie · Änderungsanomalie · Normalisierung · 3. Normalform
Mehr: Deep Dive 2, 2.2

## Lost Update
<!-- id: lost-update · quellen: Karte DD15, DD15 4.2 · stand: 2026-10 -->

Anomalie bei parallelen Transaktionen: Zwei Transaktionen lesen denselben Wert, ändern ihn und schreiben ihn zurück – die zuerst geschriebene Änderung geht verloren.

### Erklärung
Das Problem entsteht, wenn eine Anwendung liest, im Programm rechnet und das Ergebnis zurückschreibt, ohne den Datensatz zu schützen. Gegenmittel sind die **atomare Änderung** in SQL, **pessimistisches Sperren** (`SELECT … FOR UPDATE`) oder **optimistisches Sperren** mit Versionsspalte.

### Beispiel
Zwei Disponenten lesen gleichzeitig den Lagerbestand 10, beide verkaufen 3 Stück und schreiben 7 zurück. Richtig wäre 10 − 3 − 3 = **4**.
```sql
UPDATE lager SET bestand = bestand - 3 WHERE artikel_id = 10;
```
Hier rechnet die Datenbank selbst, beide Änderungen bleiben erhalten.

### Abgrenzung
| Anomalie | Problem |
|---|---|
| Lost Update | Änderung wird überschrieben |
| Dirty Read | nicht bestätigte Daten gelesen |
| Non-repeatable Read | gleiche Abfrage, anderer Wert |
| Phantom Read | neue Zeilen tauchen auf |

### Prüfungsfalle
Den Bestand im Programm berechnen (`SET bestand = 7`) und das für sicher halten, weil jede Einzeltransaktion korrekt ist.

### Merksatz
Wer liest, rechnet und schreibt, ohne zu sperren, überschreibt den Kollegen.

Siehe auch: Optimistisches Sperren · Pessimistisches Sperren · Dirty Read · Isolationsstufen · Transaktion
Mehr: Deep Dive 15, 4.2

## Lügenfaktor
<!-- id: lugenfaktor · quellen: Karte DD11, DD11 A3 · stand: 2026-10 -->

Maß nach Edward Tufte für die Verzerrung einer Grafik: Größe des Effekts in der Grafik geteilt durch Größe des Effekts in den Daten; ein ehrliches Diagramm liegt bei etwa 1.

### Erklärung
$\text{Lügenfaktor} = \frac{\text{Effekt in der Grafik}}{\text{Effekt in den Daten}}$. Tufte hält Werte zwischen 0,95 und 1,05 für unbedenklich; größere Werte übertreiben, kleinere untertreiben. Typische Ursachen: abgeschnittene y-Achse bei Balken, Flächen- oder 3D-Darstellungen, bei denen Breite und Höhe gleichzeitig wachsen.

### Beispiel
Umsätze 4,80 → 5,10 Mio. €: Daten wachsen um $\frac{0{,}30}{4{,}80} = 6{,}25\ \%$.
Die y-Achse beginnt bei 4,70 Mio. €, die Säule wächst von 0,10 auf 0,40, also um 300 %.
$\text{Lügenfaktor} = \frac{3{,}00}{0{,}0625} = 48$ – die Grafik übertreibt das Wachstum um das 48-Fache.

### Prüfungsfalle
Den Faktor aus den absoluten Säulenhöhen statt aus den relativen Veränderungen berechnen.

### Merksatz
Lügenfaktor 1: Das Bild sagt, was die Zahlen sagen.

Siehe auch: Balkendiagramm · Säulendiagramm · Liniendiagramm
Mehr: Deep Dive 11, A3

## Ausgelassen
- Laufend – Tabellenzeile Kostenarten
- Lea Sommer – Personenname Szenario
- Lost Update am Beispiel – Abschnittstitel
