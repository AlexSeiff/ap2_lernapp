<!-- Begriffsseiten E · Stand 2026-10 -->
## E – Extract
<!-- id: e-extract · quellen: DD8 3.1 · stand: 2026-10 -->

Erste Phase des ETL-Prozesses: Daten aus den Quellsystemen lesen – vollständig (Vollextraktion) oder nur die Änderungen seit dem letzten Lauf (Deltaextraktion).

### Erklärung
Die Extraktion holt Daten aus operativen Datenbanken, CSV-Dateien, APIs oder Fremdsystemen und legt sie meist unverändert in der **Staging Area** ab. So werden die Quellsysteme schnell wieder entlastet, und bei Fehlern kann ohne erneuten Quellzugriff nachgeladen werden. Läufe finden meist nachts statt, um das Tagesgeschäft nicht zu bremsen. Die **Deltaextraktion** ist schneller, setzt aber Änderungskennzeichen oder Zeitstempel voraus.

### Beispiel
Der nächtliche Lauf der Möbelhaus Nordholz GmbH liest um 2 Uhr alle seit dem letzten Lauf geänderten Bestellungen aus der Warenwirtschaft und den vollständigen, kleinen Filialstamm aus dem CRM.

### Abgrenzung
| Phase | Aufgabe |
|---|---|
| E – Extract | aus den Quellen lesen |
| T – Transform | bereinigen, vereinheitlichen, harmonisieren, prüfen |
| L – Load | ins Zielsystem laden, protokollieren |

### Prüfungsfalle
Schon beim Extrahieren bereinigen wollen – Rohdaten gehören unverändert in die Staging Area, damit Fehler nachvollziehbar bleiben.

### Merksatz
Extract holt, Transform veredelt, Load liefert.

Siehe auch: ETL · Deltaextraktion · Vollextraktion · Staging Area · T – Transform
Mehr: Deep Dive 8, 3.1

## Eigentum
<!-- id: eigentum · quellen: Karte DD14, DD14 2.4 · stand: 2026-10 -->

Rechtliche Herrschaft über eine Sache (§ 903 BGB); bei beweglichen Sachen geht es durch Einigung und Übergabe über (§ 929 BGB).

### Erklärung
Der Eigentümer darf mit der Sache nach Belieben verfahren, soweit Gesetze nicht entgegenstehen. Der **Kaufvertrag** verpflichtet nur zur Übereignung (Verpflichtungsgeschäft); das Eigentum geht erst durch ein eigenes Erfüllungsgeschäft über – bei beweglichen Sachen Einigung über den Eigentumsübergang plus Übergabe, bei Grundstücken Auflassung und Eintragung ins Grundbuch. **Besitz** ist dagegen die tatsächliche Herrschaft.

### Beispiel
Die Möbelhaus Nordholz GmbH verkauft ein Sofa. Mit dem Kaufvertrag ist der Kunde noch nicht Eigentümer; erst mit Einigung und Auslieferung wird er es. Leiht er das Sofa einem Freund, ist der Freund Besitzer, der Kunde bleibt Eigentümer.

### Abgrenzung
| Begriff | Bedeutung | Beispiel |
|---|---|---|
| Eigentum | rechtliche Herrschaft | Käufer nach Übergabe |
| Besitz | tatsächliche Herrschaft | Mieter, Entleiher |
| Eigentumsvorbehalt | Eigentum bleibt bis zur Zahlung beim Verkäufer | Ratenkauf |

### Prüfungsfalle
Der Mieter ist Besitzer, nicht Eigentümer – und der Dieb ist zwar Besitzer, wird aber nie Eigentümer.

### Merksatz
Eigentum = Recht haben, Besitz = in der Hand haben.

Siehe auch: Besitz · Eigentumsvorbehalt · Kaufvertrag · Mietvertrag
Mehr: Deep Dive 14, 2.4

## Eigentumsvorbehalt
<!-- id: eigentumsvorbehalt · quellen: Karte DD14, DD14 2.4 · stand: 2026-10 -->

Vereinbarung (§ 449 BGB), nach der der Verkäufer bis zur vollständigen Bezahlung Eigentümer der gelieferten Sache bleibt.

### Erklärung
Der Käufer erhält sofort den **Besitz** und darf die Sache nutzen, das **Eigentum** geht aber erst mit der letzten Zahlung über (aufschiebend bedingte Übereignung). Zahlt der Käufer nicht, kann der Verkäufer vom Vertrag zurücktreten und die Sache herausverlangen; in der Insolvenz des Käufers gehört sie nicht zur Masse. Er muss vereinbart werden, z. B. in den AGB („Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum“). Bei Weiterverkauf oder Verarbeitung helfen erweiterter und verlängerter Eigentumsvorbehalt.

### Beispiel
Die Möbelhaus Nordholz GmbH liefert eine Küche auf Raten. Bis zur letzten Rate bleibt sie Eigentümerin; gerät der Kunde dauerhaft in Zahlungsverzug, kann sie nach Rücktritt die Küche zurückholen.

### Abgrenzung
**Eigentum** geht normalerweise mit Einigung und Übergabe über; der Eigentumsvorbehalt schiebt nur diesen Übergang hinaus, der Kaufvertrag selbst ist sofort wirksam.

### Prüfungsfalle
Annehmen, der Käufer werde beim Eigentumsvorbehalt erst mit der Zahlung Besitzer – Besitzer ist er sofort.

### Merksatz
Erst zahlen, dann gehört es dir.

Siehe auch: Eigentum · Besitz · Kaufvertrag · Zahlungsverzug · AGB
Mehr: Deep Dive 14, 2.4

## Ein-/Ausgabe
<!-- id: ein-ausgabe · quellen: DD17 4.1, DD11 B3 · stand: 2026-10 -->

Sinnbild im Programmablaufplan nach DIN 66001: ein Parallelogramm für das Einlesen oder Ausgeben von Daten.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 80" width="260" height="80" role="img" aria-label="PAP-Symbol Ein- und Ausgabe als Parallelogramm">
<polygon points="40,15 250,15 220,65 10,65" class="dg-form"/>
<text x="130" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Eingabe: liste[1..n]</text>
</svg>
```

### Erklärung
Im PAP steht jedes Symbol für eine Art von Schritt: Grenzstelle (Oval: Start, Ende), Operation (Rechteck), Verzweigung (Raute), Unterprogramm (Rechteck mit doppelten Seitenlinien), Übergangsstelle (Kreis) und eben Ein-/Ausgabe (Parallelogramm). Darin steht, **was** eingelesen oder ausgegeben wird, z. B. „Eingabe: Bestellwert“ oder „Ausgabe: Anzahl Ausreißer“.

### Beispiel
Im PAP „Ausreißer zählen“ der Möbelhaus Nordholz GmbH steht nach dem Start ein Parallelogramm „Eingabe: liste, mittelwert, standardabweichung“, am Ende ein Parallelogramm „Ausgabe: anzahl“.

### Abgrenzung
Im **Struktogramm** gibt es kein eigenes Ein-/Ausgabe-Symbol; Ein- und Ausgaben stehen als normale Anweisung im Rechteckblock. Im Pseudocode schreibt man `EINGABE:` und `AUSGABE`.

### Prüfungsfalle
Eingaben als Rechteck (Operation) zeichnen – das Parallelogramm ist bepunktet.

### Merksatz
Schräg rein, schräg raus.

Siehe auch: Programmablaufplan · Grenzstelle · Operation · Unterprogramm · Struktogramm
Mehr: Deep Dive 17, 4.1 · Deep Dive 11, B3

## Eindeutigkeit
<!-- id: eindeutigkeit · quellen: Karte DD9, DD9 Teil 1, DD9 Teil 3 · stand: 2026-10 -->

Datenqualitätsdimension: Jede Realweltentität existiert im Datenbestand genau einmal – es gibt keine Dubletten.

### Erklärung
Geprüft wird durch den Vergleich der Zeilenzahl mit der Zahl verschiedener Werte (DISTINCT) und durch Dublettensuche über mehrere Felder. Kennzahl: $\text{Eindeutigkeitsgrad} = \frac{\text{eindeutige Entitäten}}{\text{Datensätze}} \cdot 100$. Gesichert wird sie durch Primärschlüssel und UNIQUE-Constraints (gegen exakte Dubletten), Dublettenprüfung bei der Neuanlage (gegen unscharfe) und ein führendes Stammdatensystem.

### Beispiel
Die Kundentabelle der Möbelhaus Nordholz GmbH enthält 10 Sätze, davon beschreiben zwei Paare dieselben Firmen („Braun GmbH“/„Braun G.m.b.H.“ und „Müller“/„Mueller“). Eindeutige Entitäten: 8 → Eindeutigkeitsgrad $\frac{8}{10} \cdot 100 = 80\ \%$.

### Abgrenzung
| Dimension | Frage |
|---|---|
| Eindeutigkeit | Gibt es jede Entität nur einmal? |
| Konsistenz | Widersprechen sich Werte? |
| Vollständigkeit | Fehlen Werte? |

### Prüfungsfalle
Ein eindeutiger Primärschlüssel sichert keine Eindeutigkeit der Entitäten – derselbe Kunde kann zwei verschiedene Kundennummern haben.

### Merksatz
Eine Entität, ein Datensatz.

Siehe auch: Dublette · Dublettenbereinigung · UNIQUE-Constraint · Primärschlüssel · Datenqualität
Mehr: Deep Dive 9, Teil 1 · Deep Dive 9, Teil 3

## Einfügeanomalie
<!-- id: einfugeanomalie · quellen: Karte DD2, DD2 2.2 · stand: 2026-10 -->

Folge fehlender Normalisierung: Daten können nicht erfasst werden, weil ein Wert für den Primärschlüssel fehlt – z. B. ein neuer Techniker ohne Auftrag.

### Erklärung
In einer breiten, nicht normalisierten Tabelle stehen Daten mehrerer Entitäten zusammen, etwa Auftrag, Kunde und Techniker mit dem Schlüssel `auftrag_nr`. Will man einen Techniker anlegen, der noch keinen Auftrag hat, fehlt der Schlüsselwert – der Satz kann nicht eingefügt werden, oder man muss einen Schein-Auftrag erfinden. Die Normalisierung bis zur 3. NF beseitigt das, weil jede Entität eine eigene Tabelle erhält.

### Beispiel
In der Tabelle `auftrags_export` der Möbelhaus Nordholz GmbH (auftrag_nr, kunde, techniker, stundensatz) kann der neu eingestellte Techniker Herr Yilmaz mit 65 €/h erst gespeichert werden, wenn er seinen ersten Auftrag bekommt. Nach Auslagerung in eine Tabelle `techniker` ist das jederzeit möglich.

### Abgrenzung
| Anomalie | Problem |
|---|---|
| Einfügeanomalie | Daten ohne Schlüsselwert nicht erfassbar |
| Änderungsanomalie | Änderung muss in vielen Zeilen erfolgen, sonst inkonsistent |
| Löschanomalie | Löschen entfernt ungewollt weitere Daten |

### Prüfungsfalle
Anomalien nur aufzählen statt am konkreten Tabellenauszug mit Beispiel zu belegen.

### Merksatz
Redundanz → Anomalien → Inkonsistenz.

Siehe auch: Änderungsanomalie · Löschanomalie · Normalisierung · 3. Normalform · Anomalie
Mehr: Deep Dive 2, 2.2

## Einheitliche Skalen
<!-- id: einheitliche-skalen · quellen: DD11 A4, DD11 A3 · stand: 2026-10 -->

Gestaltungsregel für Dashboards: Nebeneinanderliegende Diagramme, die verglichen werden sollen, bekommen dieselbe Achsenskalierung.

### Erklärung
Das Auge vergleicht Balkenlängen und Linienhöhen, nicht Achsenbeschriftungen. Haben zwei Diagramme unterschiedliche Skalen, wirken kleine Werte groß und umgekehrt – der Vergleich wird falsch, ohne dass eine Zahl falsch ist. Werkzeuge skalieren Achsen oft automatisch je Diagramm; für Vergleiche muss man die Skala ausdrücklich festsetzen. Verwandt ist das Verbot zweier y-Achsen mit unterschiedlicher Skalierung in einem Diagramm, das Scheinzusammenhänge erzeugt.

### Beispiel
Im Dashboard der Möbelhaus Nordholz GmbH zeigen zwei Säulendiagramme die Monatsumsätze der Filialen Köln (bis 1,2 Mio. €) und Bremen (bis 0,4 Mio. €). Mit automatischer Skalierung sehen die Säulen gleich hoch aus. Mit gemeinsamer Skala 0 bis 1,2 Mio. € wird der dreifache Unterschied sichtbar.

### Abgrenzung
Einheitliche Skalen betreffen den **Vergleich mehrerer** Diagramme; der **Nullpunkt** betrifft die Achse eines einzelnen Balkendiagramms.

### Prüfungsfalle
In Beurteilungsaufgaben nur auf die abgeschnittene Achse achten und unterschiedliche Skalen nebeneinander übersehen.

### Merksatz
Was verglichen wird, braucht dieselbe Skala.

Siehe auch: Dashboard · Datenintegrität in Diagrammen · Abgeschnittene Achse · Achsenbeschriftung mit Einheit
Mehr: Deep Dive 11, A4 · Deep Dive 11, A3

## Einigungsstelle
<!-- id: einigungsstelle · quellen: Karte DD13, DD13 4.2 · stand: 2026-10 -->

Schlichtungsgremium nach § 76 BetrVG, das bei Streit zwischen Arbeitgeber und Betriebsrat in mitbestimmungspflichtigen Angelegenheiten verbindlich entscheidet.

### Erklärung
Die Einigungsstelle wird bei Bedarf gebildet: gleich viele Beisitzer beider Seiten und ein **unparteiischer Vorsitzender**, auf den sich beide einigen (sonst bestellt ihn das Arbeitsgericht). Kommt keine Mehrheit zustande, gibt die Stimme des Vorsitzenden den Ausschlag. In Angelegenheiten der echten Mitbestimmung, z. B. nach § 87 BetrVG, **ersetzt** ihr Spruch die fehlende Einigung. Die Kosten trägt der Arbeitgeber.

### Beispiel
Die Möbelhaus Nordholz GmbH will ein Process-Mining-Werkzeug einführen, das Bearbeitungszeiten je Mitarbeiter erfasst. Der Betriebsrat verweigert nach § 87 Abs. 1 Nr. 6 BetrVG die Zustimmung. Die Einigungsstelle entscheidet: Einführung ja, aber Auswertung nur auf Teamebene mit pseudonymisierter Resource-Spalte.

### Abgrenzung
Das **Arbeitsgericht** entscheidet Rechtsstreitigkeiten (z. B. Kündigungsschutzklage); die Einigungsstelle löst Regelungsstreitigkeiten zwischen Betriebsparteien. Der **Schlichtungsausschuss** der IHK ist für Streit aus Ausbildungsverhältnissen zuständig.

### Prüfungsfalle
Die Einigungsstelle als dauerhaftes Gremium oder als Gericht bezeichnen.

### Merksatz
Wo Mitbestimmung blockiert, entscheidet die Einigungsstelle.

Siehe auch: Betriebsrat · Mitbestimmung · BetrVG · Betriebsvereinbarung · Beteiligungsrechte
Mehr: Deep Dive 13, 4.2

## Einliniensystem
<!-- id: einliniensystem · quellen: Karte DD5, DD5 6.1, DD17 1.5 · stand: 2026-10 -->

Organisationsform, in der jede Stelle genau einen Vorgesetzten hat; die Weisungswege sind klar, die Dienstwege aber lang.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 150" width="320" height="150" role="img" aria-label="Organigramm eines Einliniensystems">
<rect x="110" y="10" width="100" height="32" class="dg-form"/>
<text x="160" y="26" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Geschäftsführung</text>
<line x1="160" y1="42" x2="160" y2="60" class="dg-linie"/>
<line x1="70" y1="60" x2="250" y2="60" class="dg-linie"/>
<line x1="70" y1="60" x2="70" y2="75" class="dg-linie"/>
<line x1="250" y1="60" x2="250" y2="75" class="dg-linie"/>
<rect x="20" y="75" width="100" height="30" class="dg-form"/>
<text x="70" y="90" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Vertrieb</text>
<rect x="200" y="75" width="100" height="30" class="dg-form"/>
<text x="250" y="90" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Logistik</text>
<line x1="70" y1="105" x2="70" y2="115" class="dg-linie"/>
<rect x="20" y="115" width="100" height="28" class="dg-grau"/>
<text x="70" y="129" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Filiale Köln</text>
<line x1="250" y1="105" x2="250" y2="115" class="dg-linie"/>
<rect x="200" y="115" width="100" height="28" class="dg-grau"/>
<text x="250" y="129" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Lager</text>
</svg>
```

### Erklärung
Weisungen und Meldungen laufen ausschließlich über die Linie. Vorteile: eindeutige Zuständigkeit, klare Verantwortung, gute Kontrolle. Nachteile: lange Dienstwege, Überlastung der oberen Ebenen, abteilungsübergreifende Abstimmung ist umständlich (die Filiale muss bei einer Lagerfrage über die Geschäftsführung gehen). Dargestellt wird die Aufbauorganisation im **Organigramm**.

### Beispiel
Bei der Möbelhaus Nordholz GmbH berichtet die Filiale Köln an die Vertriebsleitung, diese an die Geschäftsführung. Braucht die Filiale dringend Ware aus dem Lager, läuft die Anfrage formal über zwei Ebenen nach oben und wieder hinunter.

### Abgrenzung
| Form | Merkmal |
|---|---|
| Einliniensystem | genau ein Vorgesetzter |
| Stabliniensystem | Einlinie plus beratende Stäbe ohne Weisungsrecht |
| Mehrliniensystem | mehrere fachliche Vorgesetzte |
| Matrixorganisation | Funktion und Projekt/Objekt kreuzen sich |

### Prüfungsfalle
Eine Stabsstelle (z. B. Datenschutzbeauftragter) macht aus dem Einliniensystem kein Mehrliniensystem – sie hat kein Weisungsrecht.

### Merksatz
Ein Chef je Stelle – klar, aber langsam.

Siehe auch: Stabliniensystem · Mehrliniensystem · Matrixorganisation · Organigramm · Aufbauorganisation
Mehr: Deep Dive 5, 6.1 · Deep Dive 17, 1.5

## Einmalig
<!-- id: einmalig · quellen: DD12 4.1 · stand: 2026-10 -->

Kostenart in der Wirtschaftlichkeitsbetrachtung: Kosten, die nur einmal anfallen, z. B. Anschaffung, Einführung, Schulung und Migration.

### Erklärung
Einmalige Kosten entstehen typischerweise zu Projektbeginn; sie bilden die **Investition** in der Amortisationsrechnung. Ihnen stehen die **laufenden** Kosten (Lizenzen, Wartung, Betrieb, Support) gegenüber, die über die gesamte Nutzungsdauer wiederkehren. Erst beide zusammen über den Lebenszyklus ergeben die **Total Cost of Ownership**; dazu gehören auch einmalige Kosten am Ende, etwa die Außerbetriebnahme.

### Beispiel
Ein BI-Werkzeug für die Möbelhaus Nordholz GmbH: Einführung und Migration 30.000 €, Schulung 5.000 € (einmalig, zusammen 35.000 €), Lizenzen 6.000 € pro Jahr (laufend). TCO über 5 Jahre: $35.000 + 5 \cdot 6.000 = 65.000$ €.

### Abgrenzung
| Gliederung | Kriterium |
|---|---|
| einmalig / laufend | zeitliches Anfallen |
| fix / variabel | Abhängigkeit von der Menge |
| direkt / indirekt | Zurechenbarkeit |

### Prüfungsfalle
Nur die einmaligen Anschaffungskosten vergleichen – laufende Kosten entscheiden oft über die günstigere Alternative.

### Merksatz
Einmal zahlen ist nur der Anfang.

Siehe auch: Laufend · Total Cost of Ownership · Amortisationszeit · Fix / variabel · Direkt / indirekt
Mehr: Deep Dive 12, 4.1

## Einwilligung
<!-- id: einwilligung · quellen: Karte DD10, DD10 2.2, DD13 1.4 · stand: 2026-10 -->

Rechtsgrundlage nach Art. 6 Abs. 1 lit. a DSGVO: freiwillige, informierte, eindeutige und zweckbezogene Zustimmung der betroffenen Person; jederzeit mit Wirkung für die Zukunft widerrufbar.

### Erklärung
Anforderungen: aktive Handlung (vorangekreuzte Kästchen sind unwirksam), verständliche Information über Zweck und Verantwortlichen, getrennt von anderen Erklärungen. Der Verantwortliche muss sie **nachweisen** können; der Widerruf muss so einfach sein wie die Erteilung (Art. 7). Bei Online-Diensten für Kinder gilt in Deutschland die Altersgrenze **16 Jahre** (Art. 8). Für besondere Kategorien (Art. 9) braucht es eine **ausdrückliche** Einwilligung. Im Arbeitsverhältnis ist Freiwilligkeit wegen der Abhängigkeit oft fraglich. Cookies und Tracking verlangen eine Einwilligung nach § 25 TDDDG.

### Beispiel
Für den Newsletter der Möbelhaus Nordholz GmbH setzt die Kundin selbst ein Häkchen und bestätigt per Link (Double-Opt-in). Die Lieferadresse für ihr Sofa braucht dagegen keine Einwilligung – Rechtsgrundlage ist die Vertragserfüllung.

### Abgrenzung
| Rechtsgrundlage (Art. 6 Abs. 1) | Beispiel |
|---|---|
| a Einwilligung | Newsletter |
| b Vertragserfüllung | Lieferadresse |
| c rechtliche Verpflichtung | Rechnungsaufbewahrung |
| f berechtigtes Interesse | Betrugsprävention |

### Prüfungsfalle
Für alles eine Einwilligung einholen – wird sie widerrufen, fehlt plötzlich die Grundlage für eigentlich vertraglich nötige Daten.

### Merksatz
Einwilligung ist eine von sechs Grundlagen – und jederzeit widerrufbar.

Siehe auch: Rechtsgrundlagen · DSGVO · Vertragserfüllung · Berechtigtes Interesse · TDDDG
Mehr: Deep Dive 10, 2.2

## Einzelunternehmen
<!-- id: einzelunternehmen · quellen: Karte DD14, DD14 3.2 · stand: 2026-10 -->

Rechtsform, in der ein Inhaber das Unternehmen allein führt und unbeschränkt haftet, auch mit seinem Privatvermögen.

### Erklärung
Es gibt kein Mindestkapital, die Gründung ist einfach (Gewerbeanmeldung), Entscheidungen trifft der Inhaber allein, und ihm steht der ganze Gewinn zu. Dafür trägt er das volle Risiko. Betreibt er ein Handelsgewerbe, ist er **Istkaufmann** und muss sich ins Handelsregister (Abteilung A) eintragen; die Firma trägt dann den Zusatz „e. K.“ (eingetragener Kaufmann). Kleingewerbetreibende können sich freiwillig eintragen (Kannkaufmann).

### Beispiel
„Weber e. K.“ aus Köln, ein Kunde der Möbelhaus Nordholz GmbH, ist ein Einzelunternehmen. Kann Herr Weber eine Rechnung nicht bezahlen, haftet er auch mit seinem privaten Ersparten.

### Abgrenzung
| Rechtsform | Mindestkapital | Haftung |
|---|---|---|
| Einzelunternehmen | keines | unbeschränkt, privat |
| GbR / OHG | keines | alle Gesellschafter unbeschränkt |
| GmbH | 25.000 € | nur Gesellschaftsvermögen |
| UG (haftungsbeschränkt) | ab 1 € | nur Gesellschaftsvermögen |

### Prüfungsfalle
„Ein Einzelunternehmen hat genau einen Beschäftigten“ – falsch, es hat einen **Inhaber**, kann aber viele Angestellte haben.

### Merksatz
Allein entscheiden, allein haften.

Siehe auch: GbR · GmbH · Istkaufmann · Handelsregister · Firma
Mehr: Deep Dive 14, 3.2

## Elektroschrott
<!-- id: elektroschrott · quellen: DD14 5.2 · stand: 2026-10 -->

Ausgediente Elektro- und Elektronikgeräte, die nach dem ElektroG getrennt vom Restmüll zurückzugeben sind; Datenträger müssen vorher nachweisbar gelöscht oder vernichtet werden.

### Erklärung
Altgeräte gehören nicht in den Hausmüll (Symbol: durchgestrichene Mülltonne), sondern an Sammelstellen, Händler-Rücknahmen oder zertifizierte Entsorger, damit Rohstoffe zurückgewonnen und Schadstoffe sicher entsorgt werden (Abfallhierarchie: Wiederverwendung vor Recycling). Für das Löschen personenbezogener Daten auf den Geräten ist der Endnutzer selbst verantwortlich; Hersteller und Händler müssen darauf hinweisen (§ 18 ElektroG). Datenschutzrechtlich folgt die Pflicht zusätzlich aus Art. 5 und Art. 32 DSGVO: sicheres Überschreiben, Löschen nach anerkanntem Verfahren oder physische Vernichtung, mit **Löschprotokoll**.

### Beispiel
Die Möbelhaus Nordholz GmbH tauscht 40 Notebooks aus. Die SSDs werden mit einem anerkannten Löschverfahren gelöscht und protokolliert, defekte Datenträger von einem zertifizierten Dienstleister vernichtet; die Geräte gehen an einen Wiederaufbereiter.

### Abgrenzung
Einfaches Löschen von Dateien oder Formatieren entfernt nur Verweise – die Daten bleiben rekonstruierbar. Erst sicheres Überschreiben oder Vernichten macht sie unlesbar.

### Prüfungsfalle
Nur die Umweltseite nennen und die Datenlöschung vergessen – in IT-Prüfungen ist sie der bepunktete Teil.

### Merksatz
Erst Daten weg, dann Gerät weg.

Siehe auch: Abfallhierarchie · Green IT · Nachhaltigkeit · Technische und organisatorische Maßnahmen
Mehr: Deep Dive 14, 5.2

## ELT
<!-- id: elt · quellen: Karte DD8, DD8 3.2 · stand: 2026-10 -->

Extract – Load – Transform: Rohdaten werden zuerst ins Zielsystem (Data Lake, Cloud-Plattform) geladen und erst dort transformiert.

### Erklärung
ELT nutzt die Rechenleistung moderner Zielsysteme. Weil die Rohdaten erhalten bleiben, kann man später mit anderer Logik neu auswerten, ohne erneut aus der Quelle zu laden. Nachteile: Im Zielsystem liegen auch ungeprüfte Daten, und Governance (Zugriffsrechte, Kennzeichnung, Datenschutz) wird aufwendiger. Häufig werden die Daten in Stufen veredelt: roh → bereinigt → auswertungsfertig („Bronze/Silver/Gold“).

### Beispiel
Die Möbelhaus Nordholz GmbH lädt Klickdaten des Onlineshops unverändert in ihren Data Lake. Erst als das Marketing nach Kaufabbrüchen fragt, werden die benötigten Felder dort transformiert – mit einer Logik, die beim Laden noch niemand kannte.

### Abgrenzung
| | ETL | ELT |
|---|---|---|
| Transformation | vor dem Laden | nach dem Laden im Ziel |
| Zielsystem | klassisches DWH | Data Lake, Cloud |
| Vorteil | nur geprüfte Daten im Ziel | Rohdaten bleiben erhalten |
| Nachteil | Logikänderung erfordert Neuladen | ungeprüfte Daten im Ziel |

### Prüfungsfalle
ELT als „ETL ohne Transformation“ beschreiben – transformiert wird auch hier, nur später und an anderem Ort.

### Merksatz
ETL putzt vor dem Einräumen, ELT danach.

Siehe auch: ETL · Data Lake · Schema-on-Read · Lakehouse · T – Transform
Mehr: Deep Dive 8, 3.2

## Elternzeit
<!-- id: elternzeit · quellen: Karte DD13, DD13 2.4 · stand: 2026-10 -->

Unbezahlte Freistellung von der Arbeit nach dem BEEG: bis zu 3 Jahre je Kind, mit besonderem Kündigungsschutz.

### Erklärung
Anspruch hat jeder Elternteil bis zum 8. Geburtstag des Kindes; bis zu 24 Monate davon können zwischen dem 3. und 8. Geburtstag genommen werden (§ 15 BEEG). Anmeldung schriftlich beim Arbeitgeber spätestens **7 Wochen** vor Beginn, bei Elternzeit nach dem 3. Geburtstag **13 Wochen** (§ 16). Kündigungsschutz ab der Anmeldung, frühestens **8 Wochen** (bzw. 14 Wochen) vor Beginn, und während der gesamten Elternzeit (§ 18). Teilzeit bis 32 Wochenstunden ist möglich. Finanziell unterstützt das **Elterngeld**, das der Staat zahlt – nicht der Arbeitgeber.

### Beispiel
Herr Kaya, Lagermitarbeiter der Möbelhaus Nordholz GmbH, möchte ab 1. März 2027 Elternzeit für sein Neugeborenes nehmen. Er muss sie spätestens 7 Wochen (49 Tage) vorher, also bis 11. Januar 2027, schriftlich anmelden; ab der Anmeldung (frühestens 8 Wochen vor Beginn) darf ihm nicht gekündigt werden.

### Abgrenzung
| Regelung | Inhalt |
|---|---|
| Mutterschutz | 6 Wochen vor, 8 Wochen nach der Geburt, nur Mutter |
| Elternzeit | bis 3 Jahre, beide Elternteile |
| Elterngeld | staatliche Lohnersatzleistung |

### Prüfungsfalle
Elternzeit und Elterngeld gleichsetzen – das eine ist die Freistellung, das andere das Geld.

### Merksatz
Drei Jahre je Kind, sieben Wochen vorher anmelden.

Siehe auch: Mutterschutz · Besonderer Kündigungsschutz · Kündigungsschutzgesetz · Arbeitsvertrag
Mehr: Deep Dive 13, 2.4

## Ende-Kriterien
<!-- id: ende-kriterien · quellen: Karte DD16, DD16 3.1 · stand: 2026-10 -->

Im Testkonzept vorab festgelegte Bedingungen, wann genug getestet ist – z. B. alle Muss-Anforderungen getestet und keine offenen kritischen Fehler.

### Erklärung
Vollständiges Testen ist praktisch unmöglich; deshalb braucht es messbare Kriterien, um den Test zu beenden und über die Abnahme zu entscheiden. Typisch: Abdeckung aller Muss-Anforderungen, Anteil bestandener Testfälle, keine offenen Fehler der Klassen „kritisch“ und „hoch“, erreichte Zweigüberdeckung, Summenabgleich ohne Differenz. Sie werden **vor** Testbeginn festgelegt, damit Zeitdruck sie nicht verschiebt.

### Beispiel
Testkonzept des Reportings der Möbelhaus Nordholz GmbH: Test endet, wenn alle 24 Muss-Anforderungen mit bestandenem Testfall abgedeckt sind, keine kritischen und höchstens zwei mittlere Fehler offen sind und der Summenabgleich für drei Monate exakt stimmt.

### Abgrenzung
**Abnahmekriterien** entscheiden, ob der Auftraggeber das Ergebnis annimmt; Ende-Kriterien entscheiden, ob die Testphase beendet werden kann. Die **Definition of Done** gilt in Scrum für jedes Inkrement.

### Prüfungsfalle
„Wir testen, bis keine Fehler mehr da sind“ ist kein Ende-Kriterium – es ist nicht messbar.

### Merksatz
Wann Schluss ist, steht vor dem ersten Test fest.

Siehe auch: Testkonzept · Abnahme · Testfall · Definition of Done
Mehr: Deep Dive 16, 3.1

## Endereignis
<!-- id: endereignis · quellen: Karte DD5, DD5 2.1, DD17 1.1 · stand: 2026-10 -->

BPMN-Ereignis als Kreis mit dickem Rand, das einen Pfad des Prozesses beendet.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" width="300" height="80" role="img" aria-label="BPMN-Start-, Zwischen- und Endereignis">
<circle cx="50" cy="35" r="18" class="dg-form"/>
<circle cx="150" cy="35" r="18" class="dg-form"/>
<circle cx="150" cy="35" r="14" class="dg-form"/>
<circle cx="250" cy="35" r="18" class="dg-form dg-dick"/>
<text x="50" y="72" text-anchor="middle" class="dg-klein">Start</text>
<text x="150" y="72" text-anchor="middle" class="dg-klein">Zwischen</text>
<text x="250" y="72" text-anchor="middle" class="dg-klein dg-fett">Ende</text>
</svg>
```

### Erklärung
Jeder Pfad eines BPMN-Prozesses endet in einem Endereignis; ein Prozess kann mehrere haben (z. B. „Auftrag abgeschlossen“, „Absage versendet“). Ein Endereignis hat eingehenden, aber keinen ausgehenden Sequenzfluss. Ein Symbol im Kreis zeigt das Ergebnis: Umschlag (gefüllt) = Nachricht senden, Blitz = Fehler, ausgefüllter Kreis = **Terminierung** (beendet sofort alle noch laufenden Pfade). Benannt wird es als Zustand: „Reparatur abgerechnet“.

### Beispiel
Im Reparaturprozess der Möbelhaus Nordholz GmbH endet der Pfad „Kostenvoranschlag abgelehnt“ nach „Absage senden“ im Endereignis „Absage versendet“, der Hauptpfad nach „Rechnung stellen“ im Endereignis „Reparatur abgerechnet“.

### Abgrenzung
| Ereignis | Rand |
|---|---|
| Startereignis | dünn |
| Zwischenereignis | doppelt |
| Endereignis | dick |

Im UML-Aktivitätsdiagramm heißt das Gegenstück **Endknoten** (Kreis mit gefülltem Kreis innen).

### Prüfungsfalle
Einen Pfad ohne Endereignis „auslaufen“ lassen – jeder Pfad braucht ein Ende.

### Merksatz
Dünn startet, doppelt wartet, dick endet.

Siehe auch: Startereignis · Zwischenereignis · Ereignisse (Kreise) · BPMN · Endknoten
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Endknoten
<!-- id: endknoten · quellen: DD17 2.4, DD15 5.2 · stand: 2026-10 -->

Symbol im UML-Aktivitätsdiagramm (Kreis mit gefülltem Kreis innen), das die gesamte Aktivität beendet.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 70" width="220" height="70" role="img" aria-label="UML-Startknoten und Endknoten">
<circle cx="50" cy="30" r="12" class="dg-voll"/>
<circle cx="160" cy="30" r="16" class="dg-form"/>
<circle cx="160" cy="30" r="10" class="dg-voll"/>
<text x="50" y="62" text-anchor="middle" class="dg-klein">Startknoten</text>
<text x="160" y="62" text-anchor="middle" class="dg-klein">Endknoten</text>
</svg>
```

### Erklärung
Erreicht der Ablauf einen Endknoten (Aktivitätsende), endet die ganze Aktivität – auch parallele Zweige, die noch laufen. Soll nur ein einzelner Zweig enden, verwendet man das **Ablaufende** (Kreis mit Kreuz). Startknoten ist ein einfacher gefüllter Kreis. Im **Zustandsdiagramm** sieht der Endzustand genauso aus wie der Endknoten.

### Beispiel
Im Aktivitätsdiagramm „Bestellung bearbeiten“ der Möbelhaus Nordholz GmbH führen beide Zweige nach der Entscheidung „[verfügbar]“ bzw. „[nicht verfügbar]“ in denselben Endknoten.

### Abgrenzung
| Notation | Ende |
|---|---|
| UML-Aktivitätsdiagramm | Kreis mit gefülltem Kreis innen |
| BPMN | Kreis mit dickem Rand (Endereignis) |
| PAP | Oval / abgerundetes Rechteck (Grenzstelle) |

### Prüfungsfalle
Start- und Endknoten vertauschen: Der Start ist der **einfache** gefüllte Kreis.

### Merksatz
Ziel getroffen: Punkt im Ring.

Siehe auch: Startknoten · Aktivitätsdiagramm · Endereignis · Entscheidungsknoten · Grenzstelle
Mehr: Deep Dive 17, 2.4 · Deep Dive 15, 5.2

## Enhancement
<!-- id: enhancement · quellen: Karte DD5, DD5 5.2 · stand: 2026-10 -->

Anwendungsart des Process Mining, die ein vorhandenes Prozessmodell mit Kennzahlen aus dem Event Log anreichert – Zeiten, Kosten, Häufigkeiten.

### Erklärung
Grundlage ist ein entdecktes oder vorgegebenes Modell. Aus den Zeitstempeln werden Durchlauf-, Bearbeitungs- und Wartezeiten je Schritt und je Übergang berechnet, aus der Anzahl der Fälle Häufigkeiten, aus Kostensätzen Prozesskosten. Farbmarkierungen zeigen Engpässe und Liegezeiten direkt im Modell. So wird sichtbar, **wo** sich Optimierung lohnt.

### Beispiel
Das Modell des Reparaturprozesses der Möbelhaus Nordholz GmbH wird angereichert: Zwischen „Kostenvoranschlag erstellen“ und „Ersatzteil bestellen“ liegen im Median 26 Stunden Wartezeit – der größte Hebel für eine kürzere Durchlaufzeit.

### Abgrenzung
| Art | Frage |
|---|---|
| Discovery | Wie läuft der Prozess wirklich? |
| Conformance Checking | Wo weicht er vom Soll ab? |
| Enhancement | Wo kostet er Zeit und Geld? |

### Prüfungsfalle
Enhancement mit „Prozess verbessern“ übersetzen – gemeint ist das Anreichern des **Modells** mit Kennzahlen, nicht die Optimierung selbst.

### Merksatz
Enhancement legt Zahlen auf die Landkarte.

Siehe auch: Process Mining · Discovery · Conformance Checking · Event Log · Durchlaufzeit
Mehr: Deep Dive 5, 5.2

## Entgeltfortzahlung
<!-- id: entgeltfortzahlung · quellen: Karte DD14, DD14 1.4, DD13 3.1 · stand: 2026-10 -->

Pflicht des Arbeitgebers, bei unverschuldeter Arbeitsunfähigkeit das Entgelt bis zu 6 Wochen weiterzuzahlen (§ 3 EFZG); der Anspruch entsteht nach 4 Wochen ununterbrochener Beschäftigung.

### Erklärung
Gezahlt wird das volle regelmäßige Entgelt. Der Arbeitnehmer muss die Arbeitsunfähigkeit unverzüglich mitteilen; dauert sie länger als drei Kalendertage, ist eine ärztliche Bescheinigung vorzulegen – gesetzlich Versicherte erhalten sie als elektronische AU, die der Arbeitgeber bei der Krankenkasse abruft. Nach 6 Wochen derselben Krankheit zahlt die Krankenkasse **Krankengeld**: 70 % des Bruttoentgelts, höchstens 90 % des Nettoentgelts. Das gilt auch für Auszubildende.

### Beispiel
Lea Sommer, Auszubildende der Möbelhaus Nordholz GmbH, ist ab 1. Februar acht Wochen krank. Für die ersten 6 Wochen zahlt der Betrieb die volle Ausbildungsvergütung, für die Wochen 7 und 8 die Krankenkasse Krankengeld.

### Abgrenzung
| Zeitraum | Zahler | Höhe |
|---|---|---|
| Wochen 1–6 | Arbeitgeber | 100 % |
| ab Woche 7 | Krankenkasse | 70 % brutto, max. 90 % netto |
| in den ersten 4 Wochen des Arbeitsverhältnisses | Krankenkasse (Krankengeld) | wie oben |

### Prüfungsfalle
Die Wartezeit von 4 Wochen mit der Dauer der Fortzahlung (6 Wochen) verwechseln.

### Merksatz
Nach 4 Wochen Anspruch, dann 6 Wochen Lohn, danach Krankengeld.

Siehe auch: Krankenversicherung · Krankheit · Arbeitsvertrag · Sozialversicherung
Mehr: Deep Dive 14, 1.4 · Deep Dive 13, 3.1

## Entgelttarifvertrag
<!-- id: entgelttarifvertrag · quellen: Karte DD13, DD13 5.1 · stand: 2026-10 -->

Tarifvertrag, der die Höhe der Löhne, Gehälter und Ausbildungsvergütungen regelt; er hat meist eine kurze Laufzeit (rund ein bis zwei Jahre).

### Erklärung
Tarifverträge schließen Gewerkschaften mit einem Arbeitgeberverband (Flächentarif) oder einem einzelnen Arbeitgeber (Haustarif). Nach Inhalt unterscheidet man: **Entgelttarifvertrag** (Geldbeträge, oft jährlich neu verhandelt), **Rahmentarifvertrag** (Entgeltgruppen, Tätigkeitsmerkmale – welche Tätigkeit welche Gruppe) und **Manteltarifvertrag** (Arbeitszeit, Urlaub, Kündigungsfristen; lange Laufzeit). Während der Laufzeit gilt die **Friedenspflicht**: kein Streik über die geregelten Punkte. Nach Ablauf wirkt er nach, bis ein neuer Vertrag ihn ersetzt.

### Beispiel
Die tarifgebundene Möbelhaus Nordholz GmbH erhöht nach dem neuen Entgelttarifvertrag des Einzelhandels die Gehälter um einen vereinbarten Prozentsatz; die Eingruppierung von Herrn Kaya in eine Entgeltgruppe ergibt sich aus dem Rahmentarifvertrag, seine 30 Urlaubstage aus dem Manteltarifvertrag.

### Abgrenzung
| Tarifart | Inhalt | Laufzeit |
|---|---|---|
| Entgelttarifvertrag | Höhe von Lohn und Gehalt | kurz |
| Rahmentarifvertrag | Entgeltgruppen, Eingruppierung | mittel |
| Manteltarifvertrag | Arbeitszeit, Urlaub, Fristen | lang |

### Prüfungsfalle
Urlaub oder Arbeitszeit dem Entgelttarifvertrag zuordnen – sie stehen im Manteltarifvertrag.

### Merksatz
Entgelt = Euro, Mantel = Rahmenbedingungen.

Siehe auch: Tarifvertrag · Manteltarifvertrag · Tarifarten · Friedenspflicht · Tarifbindung
Mehr: Deep Dive 13, 5.1

## Entität
<!-- id: entitat · quellen: Karte DD2, DD2 1.2 · stand: 2026-10 -->

Objekt der realen oder gedachten Welt, über das Daten gespeichert werden (KUNDE, PRODUKT); im ER-Diagramm ein Rechteck.

### Erklärung
Genau genommen ist eine **Entität** eine einzelne Ausprägung (die Kundin „Huber GmbH“), der **Entitätstyp** die Gesamtheit gleichartiger Entitäten (KUNDE); im Prüfungsalltag wird beides oft „Entität“ genannt. Entitäten haben **Attribute** (Ellipsen), von denen der Schlüssel jede Ausprägung eindeutig identifiziert, und stehen über **Beziehungen** (Rauten) mit Kardinalitäten in Verbindung. Bei der Überführung ins Relationenmodell wird jeder Entitätstyp zu einer Tabelle, jede Entität zu einer Zeile.

### Beispiel
Im Modell der Möbelhaus Nordholz GmbH sind KUNDE, BESTELLUNG und PRODUKT Entitätstypen; KUNDE *erteilt* BESTELLUNG (1:n), BESTELLUNG *enthält* PRODUKT (m:n, mit dem Beziehungsattribut menge).

### Abgrenzung
| ERM-Baustein | Symbol (Chen) | Beispiel |
|---|---|---|
| Entität(styp) | Rechteck | KUNDE |
| Attribut | Ellipse | name |
| Beziehung | Raute | erteilt |

In der UML entspricht dem Entitätstyp die **Klasse**, die zusätzlich Methoden hat.

### Prüfungsfalle
Eigenschaften wie „Ort“ als eigene Entität modellieren, obwohl sie nur ein Attribut sind – Entitäten haben eigene Attribute und Identität.

### Merksatz
Worüber man Daten speichert, ist eine Entität.

Siehe auch: Attribut · Beziehung · Kardinalität · Chen-Notation · Klasse
Mehr: Deep Dive 2, 1.2

## Entropie
<!-- id: entropie · quellen: Karte DD6, DD6 7.3 · stand: 2026-10 -->

Maß für die Unreinheit einer Datenmenge bezüglich der Zielklasse: 0 = rein, bei zwei Klassen 1 = genau halbe-halbe; $H(S) = -\sum_i p_i \cdot \log_2 p_i$.

### Erklärung
$p_i$ ist der Anteil der Klasse i; ein Summand mit $p_i = 0$ zählt als 0. Bei mehr als zwei Klassen kann die Entropie über 1 steigen (Maximum $\log_2$ der Klassenanzahl). Der Entscheidungsbaum-Algorithmus **ID3** wählt an jedem Knoten das Merkmal mit dem größten **Informationsgewinn** = Entropie vorher minus gewichtete Entropie der Teilmengen. Rechentrick ohne log₂-Taste: $\log_2 x = \frac{\ln x}{\ln 2}$.

### Beispiel
10 Aufträge der Möbelhaus Nordholz GmbH, 4 mit und 6 ohne Reklamation:
$H = -0{,}4 \cdot \log_2 0{,}4 - 0{,}6 \cdot \log_2 0{,}6 = 0{,}529 + 0{,}442 = 0{,}971$.
Merkwerte bei zwei Klassen: 1 : 1 → 1,000 · 1 : 2 → 0,918 · 1 : 3 → 0,811 · 1 : 4 → 0,722 · rein → 0.

### Abgrenzung
Die **Entropie** beschreibt eine Menge, der **Informationsgewinn** eine Aufteilung. Der **Gini-Index** ist ein alternatives Unreinheitsmaß (z. B. in CART-Bäumen).

### Prüfungsfalle
Das Minuszeichen vergessen – die Logarithmen von Anteilen sind negativ, die Entropie ist es nie.

### Merksatz
Je gemischter, desto höher die Entropie.

Siehe auch: Informationsgewinn · ID3 · Entscheidungsbaum · Klassifikation
Mehr: Deep Dive 6, 7.3

## Entschädigung
<!-- id: entschadigung · quellen: DD13 1.2, DD13 6.1 · stand: 2026-10 -->

Geldzahlung als Ausgleich – im WiSo-Stoff in zwei Zusammenhängen: als **nichtige** Vereinbarung im Ausbildungsvertrag (§ 12 BBiG) und als Anspruch bei Benachteiligung nach dem AGG (§ 15 Abs. 2 AGG).

### Erklärung
**Ausbildungsvertrag:** Eine Vereinbarung, dass Auszubildende oder ihre Eltern für die Ausbildung eine Entschädigung zahlen, ist nichtig (§ 12 Abs. 2 BBiG) – ebenso Vertragsstrafen, der Ausschluss oder die Beschränkung von Schadensersatzansprüchen und pauschalierter Schadensersatz.
**AGG:** Wer wegen eines der sechs Merkmale (ethnische Herkunft, Geschlecht, Religion/Weltanschauung, Behinderung, Alter, sexuelle Identität) benachteiligt wird, kann neben Schadensersatz für Vermögensschäden eine **Entschädigung** für den immateriellen Schaden verlangen. Bei Nichteinstellung höchstens **3 Monatsgehälter**, wenn die Person auch bei benachteiligungsfreier Auswahl nicht eingestellt worden wäre. Geltendmachung schriftlich binnen **2 Monaten**; einen Anspruch auf Einstellung gibt es nie.

### Beispiel
Der Ausbildungsvertrag von Jonas Brandt bei der Möbelhaus Nordholz GmbH darf keine „Ausbildungsgebühr“ enthalten. Lehnt das Möbelhaus eine Bewerberin wegen ihres Alters ab, kann sie Entschädigung verlangen, aber nicht ihre Einstellung erzwingen.

### Abgrenzung
**Schadensersatz** gleicht einen messbaren Vermögensschaden aus, die **Entschädigung** nach AGG den immateriellen Schaden (Persönlichkeitsverletzung).

### Prüfungsfalle
Annehmen, das AGG gebe einen Anspruch auf den Arbeitsplatz.

### Merksatz
Azubis zahlen nie für ihre Ausbildung – Benachteiligte bekommen Geld, keinen Job.

Siehe auch: AGG · Nichtige Vereinbarungen · Vertragsstrafen · BBiG
Mehr: Deep Dive 13, 1.2 · Deep Dive 13, 6.1

## Entscheidungsbaum
<!-- id: entscheidungsbaum · quellen: Karte DD6, DD6 2.4, DD6 7.3 · stand: 2026-10 -->

Überwachtes Lernverfahren, das Daten durch verschachtelte Ja/Nein- bzw. Merkmalsfragen in immer reinere Gruppen zerlegt; direkt lesbar und für Fachbereiche erklärbar.

### Erklärung
Jeder innere Knoten prüft ein Merkmal, jeder Ast steht für eine Ausprägung, jedes Blatt liefert eine Klasse (Klassifikation) oder einen Wert (Regressionsbaum). Aufgebaut wird von oben: Der Algorithmus **ID3** wählt an jedem Knoten das Merkmal mit dem größten Informationsgewinn. Stärken: als Regelwerk lesbar, wichtig für Art. 22 DSGVO und Akzeptanz im Fachbereich. Schwächen: ohne Begrenzung wächst der Baum bis zum **Overfitting** (Gegenmittel: Tiefe begrenzen, Pruning); ID3 bevorzugt Merkmale mit vielen Ausprägungen und braucht kategoriale Merkmale.

### Beispiel
Reklamationsbaum der Möbelhaus Nordholz GmbH:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 265" width="680" height="265" role="img" aria-label="Entscheidungsbaum: Spediteur? Eigenlieferung → nein; Nordtrans → Lieferdauer? lang → ja, kurz → nein; Rheinlogistik → Verpackung? Spezial → ja, Standard → nein">
<line x1="340" y1="47" x2="100" y2="104" class="dg-linie"/>
<rect x="170.2" y="66.5" width="99.6" height="18" rx="4" class="dg-flaeche"/>
<text x="220" y="75.5" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Eigenlieferung</text>
<line x1="340" y1="47" x2="340" y2="103" class="dg-linie"/>
<rect x="306.2" y="66" width="67.6" height="18" rx="4" class="dg-flaeche"/>
<text x="340" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Nordtrans</text>
<line x1="340" y1="47" x2="570" y2="103" class="dg-linie"/>
<rect x="408.4" y="66" width="93.2" height="18" rx="4" class="dg-flaeche"/>
<text x="455" y="75" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Rheinlogistik</text>
<line x1="340" y1="137" x2="285" y2="194" class="dg-linie"/>
<rect x="294.7" y="156.5" width="35.6" height="18" rx="4" class="dg-flaeche"/>
<text x="312.5" y="165.5" text-anchor="middle" dominant-baseline="middle" class="dg-klein">lang</text>
<line x1="340" y1="137" x2="395" y2="194" class="dg-linie"/>
<rect x="349.7" y="156.5" width="35.6" height="18" rx="4" class="dg-flaeche"/>
<text x="367.5" y="165.5" text-anchor="middle" dominant-baseline="middle" class="dg-klein">kurz</text>
<line x1="570" y1="137" x2="515" y2="194" class="dg-linie"/>
<rect x="515.1" y="156.5" width="54.8" height="18" rx="4" class="dg-flaeche"/>
<text x="542.5" y="165.5" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Spezial</text>
<line x1="570" y1="137" x2="625" y2="194" class="dg-linie"/>
<rect x="566.9" y="156.5" width="61.2" height="18" rx="4" class="dg-flaeche"/>
<text x="597.5" y="165.5" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Standard</text>
<rect x="280" y="13" width="120" height="34" rx="10" class="dg-akzent"/>
<text x="340" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Spediteur?</text>
<rect x="60" y="104" width="80" height="32" rx="16" class="dg-gut"/>
<text x="100" y="120" text-anchor="middle" dominant-baseline="middle">nein</text>
<rect x="280" y="103" width="120" height="34" rx="10" class="dg-akzent"/>
<text x="340" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Lieferdauer?</text>
<rect x="510" y="103" width="120" height="34" rx="10" class="dg-akzent"/>
<text x="570" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Verpackung?</text>
<rect x="245" y="194" width="80" height="32" rx="16" class="dg-rot"/>
<text x="285" y="210" text-anchor="middle" dominant-baseline="middle">ja</text>
<rect x="355" y="194" width="80" height="32" rx="16" class="dg-gut"/>
<text x="395" y="210" text-anchor="middle" dominant-baseline="middle">nein</text>
<rect x="475" y="194" width="80" height="32" rx="16" class="dg-rot"/>
<text x="515" y="210" text-anchor="middle" dominant-baseline="middle">ja</text>
<rect x="585" y="194" width="80" height="32" rx="16" class="dg-gut"/>
<text x="625" y="210" text-anchor="middle" dominant-baseline="middle">nein</text>
<text x="20" y="250" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Blätter: Reklamation ja / nein</text>
</svg>
```
Lesbar als Regel: „Lange Lieferungen mit Nordtrans werden reklamiert.“

### Abgrenzung
**Random Forest** lässt viele Bäume abstimmen – genauer, aber nicht mehr lesbar. **k-NN** speichert nur Trainingsdaten und erklärt über ähnliche Fälle.

### Prüfungsfalle
Eine Auftragsnummer als Merkmal zulassen – sie trennt perfekt, sagt für neue Fälle aber nichts voraus.

### Merksatz
Der Baum ist das Modell, das man vorlesen kann.

Siehe auch: ID3 · Entropie · Informationsgewinn · Random Forest · Overfitting
Mehr: Deep Dive 6, 2.4 · Deep Dive 6, 7.3

## Entscheidungsknoten
<!-- id: entscheidungsknoten · quellen: DD17 2.4, DD15 5.2 · stand: 2026-10 -->

Raute im UML-Aktivitätsdiagramm, an der sich der Ablauf verzweigt; an den ausgehenden Kanten stehen Bedingungen (Guards) in eckigen Klammern, z. B. [verfügbar].

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120" width="300" height="120" role="img" aria-label="UML-Entscheidungsknoten mit zwei Guards">
<defs><marker id="entscheidungsknoten-pfeil" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker></defs>
<polygon points="80,20 105,45 80,70 55,45" class="dg-form"/>
<line x1="105" y1="45" x2="190" y2="45" class="dg-linie" marker-end="url(#entscheidungsknoten-pfeil)"/>
<text x="148" y="37" text-anchor="middle" class="dg-klein">[verfügbar]</text>
<path d="M80,70 L80,100 L190,100" class="dg-linie" marker-end="url(#entscheidungsknoten-pfeil)"/>
<text x="140" y="92" text-anchor="middle" class="dg-klein">[nicht verfügbar]</text>
<rect x="190" y="30" width="100" height="30" rx="10" class="dg-form"/>
<text x="240" y="45" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ware versenden</text>
<rect x="190" y="85" width="100" height="30" rx="10" class="dg-form"/>
<text x="240" y="100" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ware bestellen</text>
</svg>
```

### Erklärung
Ein Entscheidungsknoten hat eine eingehende und mehrere ausgehende Kanten; genau eine Kante wird genommen. Die Guards müssen sich gegenseitig ausschließen und alle Fälle abdecken; `[else]` fängt den Rest ab. Dieselbe Raute als **Zusammenführung** (Merge) führt alternative Zweige wieder zusammen. Parallele Abläufe werden dagegen mit einem **Balken** gegabelt (Fork) und vereinigt (Join).

### Beispiel
Im Aktivitätsdiagramm „Bestellung bearbeiten“ der Möbelhaus Nordholz GmbH folgt auf „Lagerbestand prüfen“ ein Entscheidungsknoten mit [verfügbar] → „Ware versenden“ und [nicht verfügbar] → „Ware bestellen“.

### Abgrenzung
| Notation | Entscheidung |
|---|---|
| UML-Aktivitätsdiagramm | Raute, Guards in [ ] |
| BPMN | XOR-Gateway (Raute mit X), Pfade beschriftet |
| PAP | Raute mit Bedingung, Ausgänge ja/nein |

### Prüfungsfalle
Parallelität mit einer Raute zeichnen – dafür gibt es den Gabelungsbalken.

### Merksatz
Raute entscheidet, Balken parallelisiert.

Siehe auch: Aktivitätsdiagramm · Gabelung (Fork) · Vereinigung (Join) · XOR-Gateway · Endknoten
Mehr: Deep Dive 17, 2.4 · Deep Dive 15, 5.2

## Entscheidungstabellentest
<!-- id: entscheidungstabellentest · quellen: Karte DD16, DD16 2.2 · stand: 2026-10 -->

Black-Box-Testverfahren, bei dem alle Kombinationen von Bedingungen mit der jeweils erwarteten Aktion als Regeln tabelliert werden; jede Regel wird ein Testfall.

### Erklärung
Bei n Ja/Nein-Bedingungen gibt es bis zu $2^n$ Regeln. Die Tabelle hat oben die Bedingungen, unten die Aktionen, jede Spalte ist eine Regel. Regeln mit gleicher Aktion, bei denen eine Bedingung keine Rolle spielt, können zusammengefasst werden („–“). Das Verfahren deckt fehlende oder widersprüchliche Regeln in der Spezifikation auf – oft schon vor dem Test.

### Beispiel
Versandregel der Möbelhaus Nordholz GmbH: Stammkunde? Bestellwert ≥ 500 €? → versandkostenfrei, wenn mindestens eine Bedingung erfüllt ist.

| | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| Stammkunde | J | J | N | N |
| Bestellwert ≥ 500 € | J | N | J | N |
| versandkostenfrei | X | X | X | – |

$2^2 = 4$ Regeln → 4 Testfälle.

### Abgrenzung
**Äquivalenzklassen** und **Grenzwertanalyse** zerlegen den Wertebereich **einer** Eingabe; die Entscheidungstabelle prüft **Kombinationen** mehrerer Bedingungen. Der **Zustandsübergangstest** prüft Abfolgen von Zuständen.

### Prüfungsfalle
Bei drei Bedingungen nur drei Testfälle bilden – vollständig sind es $2^3 = 8$ Kombinationen.

### Merksatz
Jede Kombination eine Spalte, jede Spalte ein Testfall.

Siehe auch: Black-Box-Test · Äquivalenzklasse · Grenzwertanalyse · Zustandsübergangstest · Testfall
Mehr: Deep Dive 16, 2.2

## EPK
<!-- id: epk · quellen: Karte DD5, DD5 2.3, DD17 1.2 · stand: 2026-10 -->

Ereignisgesteuerte Prozesskette: Prozessmodell aus dem ARIS-Konzept, in dem sich Ereignisse (Sechsecke) und Funktionen (abgerundete Rechtecke) abwechseln, verbunden über Konnektoren.
Auch: Ereignisgesteuerte Prozesskette (EPK)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 190" width="220" height="190" role="img" aria-label="EPK: Ereignis, Funktion, Ereignis">
<defs><marker id="epk-seite-pfeil" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<polygon points="40,10 180,10 195,30 180,50 40,50 25,30" class="dg-rot"/>
<text x="110" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag ist eingegangen</text>
<line x1="110" y1="50" x2="110" y2="72" class="dg-linie" marker-end="url(#epk-seite-pfeil)"/>
<rect x="30" y="72" width="160" height="40" rx="10" class="dg-gut"/>
<text x="110" y="92" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag erfassen</text>
<line x1="110" y1="112" x2="110" y2="134" class="dg-linie" marker-end="url(#epk-seite-pfeil)"/>
<polygon points="40,134 180,134 195,154 180,174 40,174 25,154" class="dg-rot"/>
<text x="110" y="154" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag ist erfasst</text>
</svg>
```

### Erklärung
**Ereignisse** sind passive Zustände („Auftrag ist erfasst“), **Funktionen** aktive Tätigkeiten („Auftrag erfassen“). Konnektoren XOR, OR (∨) und AND (∧) verzweigen und führen zusammen. Regeln: Ereignis und Funktion wechseln sich streng ab; die EPK beginnt und endet mit einem Ereignis; **nach einem einzelnen Ereignis keine XOR- oder OR-Verzweigung** – Ereignisse entscheiden nicht; ein geöffneter Konnektor wird mit demselben Typ geschlossen. Die **erweiterte EPK** ergänzt Organisationseinheiten, Informationsobjekte und Anwendungssysteme.

### Beispiel
Reparaturservice der Möbelhaus Nordholz GmbH: „Reparaturmeldung ist eingegangen“ → „Auftrag erfassen“ → „Auftrag ist erfasst“ → „Kostenvoranschlag prüfen“ → XOR → „Kostenvoranschlag ist angenommen“ bzw. „… ist abgelehnt“.

### Abgrenzung
| | BPMN 2.0 | EPK |
|---|---|---|
| Verbreitung | internationaler Standard | vor allem deutschsprachig |
| Beteiligte | Pools und Lanes | nur über eEPK-Zusatzobjekte |
| Ausführbarkeit | per Workflow-Engine | rein beschreibend |

### Prüfungsfalle
Zwei Funktionen direkt hintereinander zeichnen oder nach einem Ereignis mit XOR verzweigen.

### Merksatz
Ereignis – Funktion – Ereignis: Wer entscheidet, ist immer eine Funktion.

Siehe auch: Ereignis · Funktion · Konnektor · Erweiterte EPK (eEPK) · BPMN
Mehr: Deep Dive 5, 2.3 · Deep Dive 17, 1.2

## Ereignis
<!-- id: ereignis · quellen: Karte DD5, DD5 2.3, DD17 1.2 · stand: 2026-10 -->

In der EPK ein eingetretener, passiver Zustand (Sechseck, z. B. „Auftrag ist eingegangen“), der Funktionen auslöst und ihr Ergebnis beschreibt.

### Erklärung
Ereignisse werden im Partizip formuliert: Objekt + „ist“ + Partizip („Rechnung ist versendet“). Jede EPK beginnt mit einem Startereignis und endet mit mindestens einem Endereignis. Weil ein Ereignis nur einen Zustand beschreibt, kann es nicht entscheiden: Nach einem **einzelnen** Ereignis darf keine XOR- oder OR-Verzweigung folgen; eine AND-Verzweigung (der Zustand löst mehrere Funktionen gleichzeitig aus) ist erlaubt. Ereignisse haben höchstens eine eingehende und eine ausgehende Kante.

### Beispiel
Nach der Funktion „Kostenvoranschlag prüfen“ der Möbelhaus Nordholz GmbH folgt ein XOR-Konnektor mit den Ereignissen „Kostenvoranschlag ist angenommen“ und „Kostenvoranschlag ist abgelehnt“ – die Entscheidung trifft die Funktion davor.

### Abgrenzung
| Notation | „Ereignis“ |
|---|---|
| EPK | Sechseck, passiver Zustand zwischen Funktionen |
| BPMN | Kreis (Start, Zwischen, Ende), etwas passiert |
| Process Mining | ein Eintrag im Event Log (Case ID, Aktivität, Zeitstempel) |

### Prüfungsfalle
Ereignisse als Tätigkeit formulieren („Auftrag prüfen“) – das ist eine Funktion.

### Merksatz
Ereignisse sind, Funktionen tun.

Siehe auch: EPK · Funktion · Konnektor · Ereignisse (Kreise) · Event Log
Mehr: Deep Dive 5, 2.3 · Deep Dive 17, 1.2

## Ereignisbasiertes Gateway
<!-- id: ereignisbasiertes-gateway · quellen: Karte DD5, DD5 2.1 · stand: 2026-10 -->

BPMN-Gateway (Raute mit Fünfeck im Doppelkreis), das auf das zuerst eintretende von mehreren Ereignissen wartet und nur diesen Pfad weiterführt.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="120" height="100" role="img" aria-label="Ereignisbasiertes Gateway">
<polygon points="60,10 100,50 60,90 20,50" class="dg-form"/>
<circle cx="60" cy="50" r="17" class="dg-form"/>
<circle cx="60" cy="50" r="13" class="dg-form"/>
<polygon points="60,41 69,47 66,58 54,58 51,47" class="dg-form"/>
</svg>
```

### Erklärung
Nicht Daten entscheiden über den Weg, sondern **was zuerst passiert**. Hinter dem Gateway folgen Zwischenereignisse (Nachricht empfangen, Timer, Signal) oder Empfangsaufgaben. Tritt eines ein, werden die anderen verworfen – ein Wettlauf der Ereignisse. Typisch für Fristen: Antwort des Kunden oder Zeitablauf.

### Beispiel
Die Möbelhaus Nordholz GmbH schickt einen Kostenvoranschlag. Danach wartet ein ereignisbasiertes Gateway: Kommt die Kundenantwort (Nachrichtenereignis), wird sie bearbeitet; vergehen erst 48 Stunden (Timerereignis), ruft der Service den Kunden an.

### Abgrenzung
| Gateway | Entscheidet nach |
|---|---|
| XOR (Raute mit X) | Daten/Bedingungen, die vorher feststehen |
| ereignisbasiert | dem zuerst eintretenden Ereignis |
| AND (Raute mit +) | nichts – alle Pfade parallel |

### Prüfungsfalle
Eine Frist mit einem XOR-Gateway „Antwort da?“ modellieren – zum Prüfzeitpunkt weiß man das noch nicht, man muss warten.

### Merksatz
Wer zuerst kommt, bestimmt den Weg.

Siehe auch: XOR-Gateway · Gateway · Zwischenereignis · BPMN · Ereignisse (Kreise)
Mehr: Deep Dive 5, 2.1

## Ereignisse (Kreise)
<!-- id: ereignisse · quellen: DD5 2.1, DD17 1.1 · stand: 2026-10 -->

In BPMN 2.0 werden Ereignisse – etwas passiert – als Kreise gezeichnet: Startereignis (dünner Rand), Zwischenereignis (doppelter Rand), Endereignis (dicker Rand).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" width="300" height="80" role="img" aria-label="BPMN-Ereignisse mit Typsymbolen">
<circle cx="50" cy="35" r="18" class="dg-form"/>
<rect x="41" y="29" width="18" height="12" class="dg-form"/>
<path d="M41,29 L50,36 L59,29" class="dg-linie"/>
<circle cx="150" cy="35" r="18" class="dg-form"/>
<circle cx="150" cy="35" r="14" class="dg-form"/>
<circle cx="150" cy="35" r="9" class="dg-form"/>
<line x1="150" y1="35" x2="150" y2="28" class="dg-linie"/>
<line x1="150" y1="35" x2="155" y2="35" class="dg-linie"/>
<circle cx="250" cy="35" r="18" class="dg-form dg-dick"/>
<text x="50" y="72" text-anchor="middle" class="dg-klein">Start (Nachricht)</text>
<text x="150" y="72" text-anchor="middle" class="dg-klein">Zwischen (Timer)</text>
<text x="250" y="72" text-anchor="middle" class="dg-klein">Ende</text>
</svg>
```

### Erklärung
Das **Startereignis** löst den Prozess aus und hat keinen eingehenden Sequenzfluss. **Zwischenereignisse** treten während des Ablaufs ein: warten auf eine Nachricht, eine Frist (Timer), ein Fehler. Das **Endereignis** beendet einen Pfad. Symbole im Kreis geben den Typ an: Umschlag = Nachricht (leer = empfangen, gefüllt = senden), Uhr = Timer, Blitz = Fehler. Benannt werden Ereignisse als Zustand („Reparaturmeldung eingegangen“).

### Beispiel
Reparaturprozess der Möbelhaus Nordholz GmbH: Startereignis mit Umschlag „Reparaturmeldung eingegangen“, Timer-Zwischenereignis „2 Tage auf Ersatzteil warten“, Endereignis „Reparatur abgerechnet“.

### Abgrenzung
**Aktivitäten** (abgerundete Rechtecke) beschreiben, was getan wird; **Gateways** (Rauten) verzweigen. In der EPK sind Ereignisse Sechsecke und wechseln sich mit Funktionen ab – in BPMN gibt es diese Pflicht nicht.

### Prüfungsfalle
Zwischen- und Endereignis verwechseln: doppelter Rand heißt „läuft weiter“, dicker Rand heißt „Ende“.

### Merksatz
Dünn startet, doppelt wartet, dick endet.

Siehe auch: Startereignis · Zwischenereignis · Endereignis · BPMN · Aktivitäten (abgerundetes Rechteck)
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Erfassungsrichtlinie
<!-- id: erfassungsrichtlinie · quellen: Karte DD9, DD9 5.2 · stand: 2026-10 -->

Verbindliche Regeln, wie Daten einzugeben sind – Formate, Pflichtangaben, Schreibweisen –, ergänzt durch die Schulung der Erfassenden.

### Erklärung
Eine Erfassungsrichtlinie ist eine **organisatorische** Präventionsmaßnahme der Data Governance: Sie legt fest, wie Namen, Adressen, Rechtsformen, Datumswerte oder Telefonnummern geschrieben werden, welche Felder Pflicht sind, wie mit unbekannten Werten umzugehen ist (kein „xxx“ oder „01.01.1900“) und dass vor der Neuanlage nach vorhandenen Datensätzen gesucht wird. Sie wirkt am besten zusammen mit technischen Maßnahmen: Pflichtfelder, Auswahllisten statt Freitext, Formatprüfungen. Verantwortlich für Inhalt und Pflege ist der Data Owner.

### Beispiel
Die Erfassungsrichtlinie des Kundenservice der Möbelhaus Nordholz GmbH: Firmenname mit Rechtsform ohne Punkte („Braun GmbH“), Straße ausgeschrieben, Telefon im Format +49…, Neuanlage erst nach Dublettensuche über Name und PLZ, unbekannte Werte leer lassen statt Platzhalter.

### Abgrenzung
**Technische** Maßnahmen (NOT NULL, CHECK, Auswahllisten) erzwingen Regeln automatisch, die Erfassungsrichtlinie regelt Verhalten und deckt ab, was Technik nicht prüfen kann (z. B. richtige Kundenzuordnung).

### Prüfungsfalle
Nur eine Richtlinie vorschlagen, ohne Schulung, technische Unterstützung und Messung – Papier allein ändert keine Gewohnheiten.

### Merksatz
Gleiche Regeln für alle Erfassenden – und Technik, die sie durchsetzt.

Siehe auch: Verbindliche Erfassungsrichtlinien · Data Governance · Auswahllisten statt Freitext · Pflichtfelder · Platzhalterwert
Mehr: Deep Dive 9, 5.2

## Erlernbarkeit
<!-- id: erlernbarkeit · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Interaktionsprinzip der ISO 9241-110:2020: Das System unterstützt Nutzer dabei, seine Bedienung leicht zu erlernen.

### Erklärung
Erlernbare Software erklärt sich beim Benutzen: Hilfetexte und Tooltips an Ort und Stelle, Beispiele, schrittweises Heranführen, konsistente Muster, die man einmal lernt und überall wiederfindet. In der älteren Fassung von 2006 hieß das Prinzip **Lernförderlichkeit**. Die sieben Prinzipien der Fassung 2020: Aufgabenangemessenheit, Selbstbeschreibungsfähigkeit, Erwartungskonformität, Erlernbarkeit, Steuerbarkeit, Robustheit gegen Benutzungsfehler, Benutzerbindung.

### Beispiel
Im Dashboard der Möbelhaus Nordholz GmbH erklärt ein Tooltip an jeder Kennzahl Formel und Datenquelle („Termintreue = pünktliche Aufträge / alle Aufträge · 100“); beim ersten Aufruf führt eine kurze Tour durch die Filter.

### Abgrenzung
**Selbstbeschreibungsfähigkeit**: Der Nutzer erkennt jederzeit, wo er ist und was möglich ist. **Erlernbarkeit**: Er lernt die Bedienung schnell. Ein Titel mit aktivem Filter ist Selbstbeschreibung, ein Tooltip mit Erklärung eher Erlernbarkeit.

### Prüfungsfalle
Veraltete Bezeichnungen („Lernförderlichkeit“, „Individualisierbarkeit“) als aktuelle Prinzipien nennen, ohne die Fassung anzugeben.

### Merksatz
Gute Software ist ihr eigenes Handbuch.

Siehe auch: Interaktionsprinzipien · Selbstbeschreibungsfähigkeit · Erwartungskonformität · Gebrauchstauglichkeit · Usability-Test
Mehr: Deep Dive 11, A5

## Erwartungskonformität
<!-- id: erwartungskonformitat · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Interaktionsprinzip der ISO 9241-110: Das System verhält sich vorhersehbar, einheitlich und so, wie Nutzer es aus Erfahrung und Konventionen erwarten.

### Erklärung
Erwartungskonform heißt: gleiche Dinge sehen gleich aus und funktionieren gleich, Bedienelemente stehen immer an derselben Stelle, Farben und Symbole folgen gewohnten Bedeutungen (rot = schlecht/Stopp, Lupe = Suche), Begriffe entsprechen der Fachsprache der Nutzer. Jede Abweichung kostet Aufmerksamkeit und führt zu Fehlbedienung.

### Beispiel
Im Dashboard der Möbelhaus Nordholz GmbH ist Rot überall „unter Ziel“ und Grün „Ziel erreicht“; der Exportknopf sitzt auf jeder Seite oben rechts. Eine Kachel, in der ausnahmsweise Rot für „hoher Umsatz“ steht, verletzt die Erwartungskonformität.

### Abgrenzung
| Prinzip | Kern |
|---|---|
| Erwartungskonformität | verhält sich wie gewohnt |
| Selbstbeschreibungsfähigkeit | zeigt, wo man ist |
| Steuerbarkeit | Nutzer bestimmt Ablauf und Tempo |
| Robustheit gegen Benutzungsfehler | Fehler verhindert oder leicht korrigierbar |

### Prüfungsfalle
Farbe allein als Signal einsetzen – Erwartungskonformität ersetzt nicht die Barrierefreiheit (zusätzlich Symbol oder Beschriftung).

### Merksatz
Keine Überraschungen – gleiches sieht gleich aus und tut das Gleiche.

Siehe auch: Interaktionsprinzipien · Erlernbarkeit · Steuerbarkeit · Barrierefreiheit · Gebrauchstauglichkeit
Mehr: Deep Dive 11, A5

## Erwartungswert
<!-- id: erwartungswert · quellen: Karte DD3, DD3 7.2 · stand: 2026-10 -->

Gewichteter Durchschnitt aller möglichen Werte einer Zufallsvariablen, $E(X) = \sum x_i \cdot p_i$ – der Wert, der sich im Mittel vieler Wiederholungen einstellt.

### Erklärung
Jeder mögliche Wert wird mit seiner Wahrscheinlichkeit multipliziert, die Produkte werden addiert; die Wahrscheinlichkeiten müssen zusammen 1 ergeben. Der Erwartungswert dient zur Bewertung riskanter Entscheidungen (Garantie, Versicherung, Risikokosten). Er sagt nichts über den Einzelfall: Ein einzelner Vertrag kann viel teurer werden.

### Beispiel
Garantieverlängerung der Möbelhaus Nordholz GmbH: 5 % großer Schaden (400 €), 10 % kleiner Schaden (150 €), 85 % kein Schaden.
$E(X) = 400 \cdot 0{,}05 + 150 \cdot 0{,}10 + 0 \cdot 0{,}85 = 20 + 15 + 0 = 35$ €.
Ein Preis über 35 € deckt die Kosten im Mittel.

### Abgrenzung
Das **arithmetische Mittel** wird aus beobachteten Daten berechnet, der **Erwartungswert** aus Wahrscheinlichkeiten eines Modells. Bei vielen Wiederholungen nähert sich das Mittel dem Erwartungswert. Die **Drei-Zeiten-Methode** liefert einen geschätzten Erwartungswert für Projektdauern.

### Prüfungsfalle
Prüfen, ob die Wahrscheinlichkeiten 1 ergeben – fehlt der Fall „kein Schaden“, stimmt die Rechnung nicht.

### Merksatz
Wert mal Wahrscheinlichkeit, alles addiert.

Siehe auch: Arithmetisches Mittel · Laplace-Wahrscheinlichkeit · Gegenereignis · Drei-Zeiten-Methode
Mehr: Deep Dive 3, 7.2

## Erweiterte EPK (eEPK)
<!-- id: erweiterte-epk · quellen: DD5 2.3, DD17 1.2 · stand: 2026-10 -->

EPK, die die Ablauflogik um das Wer und Womit ergänzt: Organisationseinheiten, Informationsobjekte und Anwendungssysteme hängen an den Funktionen.

### Erklärung
Zusatzobjekte der eEPK:
| Objekt | Symbol | Beispiel |
|---|---|---|
| Organisationseinheit | Ellipse (mit senkrechtem Strich) | Serviceannahme |
| Informationsobjekt | Rechteck | Auftragsdaten |
| Anwendungssystem | Rechteck mit seitlichen Doppellinien | ERP-System |
| Prozesswegweiser | Funktionssymbol vor einem Sechseck | Sprung zur EPK „Rechnungsstellung“ |

Zusatzobjekte hängen immer an einer **Funktion**, nie an einem Ereignis. Pfeile zeigen beim Informationsobjekt, ob gelesen oder geschrieben wird. So wird die eEPK zur Grundlage für Schwachstellenanalysen: Viele Wechsel der Organisationseinheit bedeuten Schnittstellen mit Liegezeiten, Papier-Informationsobjekte zeigen Medienbrüche.

### Beispiel
Die Funktion „Auftrag erfassen“ der Möbelhaus Nordholz GmbH erhält die Organisationseinheit „Serviceannahme“, das Anwendungssystem „Werkstatt-App“ und das Informationsobjekt „Auftragsdaten“ (geschrieben).

### Abgrenzung
In **BPMN** zeigen Pools und Lanes das Wer, Datenobjekte das Was. Die einfache **EPK** enthält nur Ereignisse, Funktionen und Konnektoren.

### Prüfungsfalle
Eine Organisationseinheit an ein Ereignis hängen – Ereignisse führt niemand aus.

### Merksatz
eEPK = EPK + wer + womit.

Siehe auch: EPK · Organisationseinheit · Informationsobjekt · Anwendungssystem · Prozesswegweiser
Mehr: Deep Dive 5, 2.3 · Deep Dive 17, 1.2

## ESG
<!-- id: esg · quellen: Karte DD14, DD14 5.2 · stand: 2026-10 -->

Environmental, Social, Governance – Kriterien, nach denen Investoren, Banken und Kunden die Nachhaltigkeit von Unternehmen bewerten.

### Erklärung
**E**nvironmental: Umwelt und Klima (Energieverbrauch, Emissionen, Abfall, z. B. PUE im Rechenzentrum). **S**ocial: Beschäftigte und Gesellschaft (Arbeitsschutz, faire Löhne, Lieferkette). **G**overnance: gute Unternehmensführung (Compliance, Korruptionsprävention, Datenschutz, Transparenz). ESG-Ratings beeinflussen Kreditkonditionen und Investitionen. Berichtspflichtig sind nach der **CSRD** seit der Omnibus-I-Richtlinie (EU) 2026/470 nur noch Unternehmen mit mehr als 1.000 Beschäftigten **und** mehr als 450 Mio. € Umsatz; die deutsche Umsetzung stand im Oktober 2026 noch aus (Stand 2026).

### Beispiel
Die Hausbank der Möbelhaus Nordholz GmbH fragt vor einem Kredit ESG-Kennzahlen ab: Energieverbrauch der Filialen, Anteil zertifizierten Holzes, Unfallquote im Lager, vorhandenes Compliance-System. Als Datenanalyst baust du dafür die Kennzahlen aus vorhandenen Daten.

### Abgrenzung
**Drei Säulen der Nachhaltigkeit** (ökologisch, ökonomisch, sozial) ist das Leitbild; **ESG** ist das Bewertungsraster der Finanzwelt – statt „ökonomisch“ steht dort „Governance“.

### Prüfungsfalle
G mit „Gewinn“ oder „Green“ übersetzen – es steht für Governance.

### Merksatz
Umwelt, Soziales, gute Führung – messbar gemacht.

Siehe auch: CSRD · Nachhaltigkeit · Drei Säulen · Lieferkettengesetz · Green IT
Mehr: Deep Dive 14, 5.2

## ETL
<!-- id: etl · quellen: Karte DD8, DD8 3.1, DD8 3.2, DD8 3.3 · stand: 2026-10 -->

Extract – Transform – Load: Daten aus Quellsystemen lesen, vor dem Laden bereinigen und vereinheitlichen, dann ins Data Warehouse laden.

### Erklärung
**Extract:** Voll- oder Deltaextraktion in die Staging Area. **Transform:** bereinigen (fehlende Werte, Dubletten, Ausreißer), vereinheitlichen (Datum, Einheit, Währung), harmonisieren (Schlüssel verschiedener Systeme zusammenführen), anreichern, aggregieren, prüfen – fehlerhafte Sätze in eine **Quarantäne** statt verwerfen. **Load:** meist als nächtlicher Batch ins Zielsystem, mit Ladeprotokoll (gelesene, geladene, abgewiesene Sätze) und Abstimmsummen gegen die Quelle. Der ETL-Lauf ist der wichtigste Kontrollpunkt für Datenqualität.

### Beispiel
Im Ladelauf der Möbelhaus Nordholz GmbH werden 12 von 8.400 Bestellungen wegen fehlender Kundennummer abgewiesen. Sie landen in der Quarantäne mit Fehlerprotokoll; der Data Steward klärt sie, und das Protokoll weist 8.388 geladene Sätze aus.

### Abgrenzung
| | ETL | ELT |
|---|---|---|
| Transformation | vor dem Laden | im Zielsystem |
| Ziel | klassisches DWH | Data Lake, Cloud |
| Vorteil | nur geprüfte Daten im Ziel | Rohdaten bleiben erhalten |

### Prüfungsfalle
ETL als bloßes „Kopieren“ beschreiben oder fehlerhafte Sätze stillschweigend verwerfen.

### Merksatz
Lesen, veredeln, liefern – und jeden abgewiesenen Satz protokollieren.

Siehe auch: E – Extract · T – Transform · L – Load · ELT · Quarantäne
Mehr: Deep Dive 8, 3.1 · Deep Dive 8, 3.2 · Deep Dive 8, 3.3

## Euklidischer Abstand
<!-- id: euklidischer-abstand · quellen: Karte DD6, DD6 3.1 · stand: 2026-10 -->

Geradliniger Abstand zweier Punkte, $d = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$; zum reinen Vergleichen genügt der quadrierte Abstand.

### Erklärung
Bei mehr Merkmalen wird über alle Dimensionen summiert. k-Means ordnet jeden Punkt dem nächstgelegenen Zentrum zu, k-NN sucht die k nächsten Nachbarn – beide mit diesem Abstand. Weil die Wurzel monoton ist, ändert das Weglassen die Reihenfolge nicht; nur wenn der Abstand als Wert verlangt ist, muss man sie ziehen. Wichtig: Merkmale vorher **skalieren**, sonst dominiert das Merkmal mit der größten Spannweite.

### Beispiel
Kunde P1(2 | 2) der Möbelhaus Nordholz GmbH (Bestellungen pro Jahr | Bestellwert in 100 €), Zentren Z1(4 | 4) und Z2(6 | 6):
$d(P1, Z1) = \sqrt{(2-4)^2 + (2-4)^2} = \sqrt{8} \approx 2{,}83$
$d(P1, Z2) = \sqrt{16 + 16} = \sqrt{32} \approx 5{,}66$ → P1 gehört zu Z1.

### Abgrenzung
Der **Manhattan-Abstand** summiert die Beträge der Differenzen (Weg im Straßengitter): für P1 und Z1 also 4. Die **Levenshtein-Distanz** misst den Abstand zweier Zeichenketten.

### Prüfungsfalle
Umsatz in Euro (0–5.000) und Bestellanzahl (0–20) unskaliert mischen – dann clustert das Modell faktisch nur nach Umsatz.

### Merksatz
Pythagoras im Merkmalsraum – vorher skalieren.

Siehe auch: K-Means · K-Nächste-Nachbarn · Skalieren · Min-Max-Normalisierung · Levenshtein-Distanz
Mehr: Deep Dive 6, 3.1

## Event Log
<!-- id: event-log · quellen: Karte DD5, DD5 5.1, DD5 5.3 · stand: 2026-10 -->

Protokolldaten für Process Mining mit mindestens Case ID, Aktivität und Zeitstempel je Ereignis.

### Erklärung
| Feld | Bedeutung |
|---|---|
| Case ID | Vorgangsnummer, klammert die Ereignisse eines Falls |
| Activity | Name des Prozessschritts |
| Timestamp | Zeitpunkt, bestimmt die Reihenfolge |
| Resource (optional) | ausführende Person oder System |

Daraus lassen sich Ist-Prozess, Varianten, Durchlaufzeiten, Schleifen und Abweichungen ableiten. Typische Qualitätsprobleme: fehlende oder zu grobe Zeitstempel, uneinheitliche Aktivitätsnamen, fehlende Case ID, unvollständige Fälle am Rand des Zeitraums, Zeitzonen- und Sommerzeitfehler. Mit dem Feld Resource enthält das Log **personenbezogene Daten** – DSGVO und Mitbestimmung des Betriebsrats (§ 87 Abs. 1 Nr. 6 BetrVG) sind zu beachten.

### Beispiel
| Case ID | Activity | Timestamp |
|---|---|---|
| A-5001 | Auftrag erfassen | 2026-03-02 09:14 |
| A-5001 | Kostenvoranschlag erstellen | 2026-03-02 15:40 |
| A-5001 | Rechnung stellen | 2026-03-04 11:05 |

Durchlaufzeit des Falls A-5001 der Möbelhaus Nordholz GmbH: 2 Tage, 1 Stunde, 51 Minuten.

### Abgrenzung
Ein technisches **Logfile** (Server-Log) hat oft keine Case ID; erst die Zuordnung zu Fällen macht daraus ein Event Log.

### Prüfungsfalle
Die Case ID vergessen – ohne sie lassen sich Ereignisse keinem Fall zuordnen.

### Merksatz
Fall, Schritt, Zeit – sonst kein Process Mining.

Siehe auch: Process Mining · Case ID · Activity · Timestamp · Discovery
Mehr: Deep Dive 5, 5.1 · Deep Dive 5, 5.3

## Events
<!-- id: events · quellen: DD12 Teil 2 · stand: 2026-10 -->

Die fünf Scrum-Events mit fester Timebox: Sprint, Sprint Planning, Daily Scrum, Sprint Review und Sprint-Retrospektive.

### Erklärung
Der **Sprint** ist der Container für alle anderen Events, mit fester Länge von höchstens einem Monat. Timeboxen bei einem Ein-Monats-Sprint (bei kürzeren meist kürzer):
| Event | Zweck | max. Dauer |
|---|---|---|
| Sprint Planning | Was und wie im Sprint, Sprint-Ziel | 8 Stunden |
| Daily Scrum | Tagesplanung der Developers | 15 Minuten |
| Sprint Review | Ergebnis mit Stakeholdern prüfen, Backlog anpassen | 4 Stunden |
| Sprint-Retrospektive | Zusammenarbeit, Prozesse, Qualität verbessern | 3 Stunden |

Jedes Event ist eine Gelegenheit zur Überprüfung und Anpassung (Inspektion und Adaption).

### Beispiel
Die Möbelhaus Nordholz GmbH arbeitet im Dashboard-Projekt mit zweiwöchigen Sprints: Planning am Montag, täglich 15 Minuten Daily Scrum, nach zwei Wochen Review mit dem Vertrieb und anschließend Retrospektive im Team.

### Abgrenzung
**Artefakte** (Product Backlog, Sprint Backlog, Inkrement) sind Arbeitsergebnisse, **Verantwortlichkeiten** (Product Owner, Scrum Master, Developers) sind Rollen, **Events** sind Termine. Das **Backlog Refinement** ist kein Event, sondern eine laufende Tätigkeit.

### Prüfungsfalle
Review und Retrospektive verwechseln: Das Review prüft das **Produkt**, die Retrospektive die **Arbeitsweise**.

### Merksatz
Planen, täglich abstimmen, Ergebnis zeigen, Arbeitsweise verbessern – alles im Sprint.

Siehe auch: Sprint · Sprint Planning · Daily Scrum · Sprint Review · Retrospektive
Mehr: Deep Dive 12, Teil 2

## Extend
<!-- id: extend · quellen: Karte DD15, DD15 5.1 · stand: 2026-10 -->

Beziehung im UML-Use-Case-Diagramm: Ein Anwendungsfall erweitert einen Basisfall nur **unter einer Bedingung**; der gestrichelte Pfeil «extend» zeigt vom erweiternden Fall zum Basisfall.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 90" width="360" height="90" role="img" aria-label="Use Case Extend-Beziehung">
<defs><marker id="extend-pfeil" viewBox="0 0 10 10" markerWidth="9" markerHeight="9" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker></defs>
<ellipse cx="70" cy="45" rx="62" ry="24" class="dg-form"/>
<text x="70" y="45" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Expressservice wählen</text>
<ellipse cx="285" cy="45" rx="68" ry="24" class="dg-form"/>
<text x="285" y="45" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reparatur beauftragen</text>
<line x1="132" y1="45" x2="217" y2="45" class="dg-linie dg-strich" marker-end="url(#extend-pfeil)"/>
<text x="175" y="35" text-anchor="middle" class="dg-klein">«extend»</text>
</svg>
```

### Erklärung
Der Basisfall ist auch ohne die Erweiterung vollständig; die Erweiterung wird nur ausgeführt, wenn die Bedingung zutrifft (optional an einem **Erweiterungspunkt** notiert). Beide Beziehungen werden als gestrichelter Pfeil mit offener Spitze und Stereotyp in Guillemets gezeichnet.

### Beispiel
Bei der Möbelhaus Nordholz GmbH kann ein Kunde beim Use Case „Reparatur beauftragen“ optional „Expressservice wählen“ – nur wenn er es wünscht. Pfeil: Expressservice wählen → Reparatur beauftragen.

### Abgrenzung
| Beziehung | Wann | Pfeilrichtung |
|---|---|---|
| «include» | **immer** eingebunden | vom Basisfall zum eingebundenen Fall |
| «extend» | **nur unter Bedingung** | vom erweiternden Fall zum Basisfall |

### Prüfungsfalle
Die Pfeilrichtung bei «extend» umdrehen – sie zeigt zum Basisfall.

### Merksatz
Include immer, extend manchmal – und extend zeigt zur Basis.

Siehe auch: Include · Use-Case-Diagramm · Anwendungsfall · Akteur · Systemgrenze
Mehr: Deep Dive 15, 5.1

## Extrapolation
<!-- id: extrapolation · quellen: Karte DD4, DD4 2.2 · stand: 2026-10 -->

Prognose für x-Werte außerhalb des beobachteten Wertebereichs – riskant, weil der Zusammenhang dort nicht belegt ist.

### Erklärung
Eine Regressionsgerade ist nur für den Bereich abgesichert, aus dem die Daten stammen. Außerhalb können Sättigungseffekte, Grenzen oder ganz andere Zusammenhänge gelten; die Gerade läuft trotzdem stur weiter. Knapp außerhalb ist eine Prognose „unter Vorbehalt“ vertretbar, weit außerhalb unzulässig. Die Einschränkung gehört in jede Prognoseantwort – sie ist regelmäßig eigenständig bepunktet. Das gilt ebenso für Machine-Learning-Modelle.

### Beispiel
Werbebudget x (1 bis 5 T€) und Umsatz der Möbelhaus Nordholz GmbH: $\hat{y} = 24{,}8 + 6{,}4 \cdot x$.
Für x = 6: $\hat{y} = 24{,}8 + 6{,}4 \cdot 6 = 63{,}2$ T€ – knapp außerhalb, nur mit Vorbehalt. Für x = 20 ergäbe sich 152,8 T€ – unzulässig, weil niemand weiß, ob zusätzliche Werbung dort noch wirkt.

### Abgrenzung
**Interpolation** schätzt Werte **innerhalb** des beobachteten Bereichs (z. B. x = 3,5) – deutlich verlässlicher. Auch der **Achsenabschnitt** a ist eine Extrapolation, wenn x = 0 nicht beobachtet wurde.

### Prüfungsfalle
Eine Prognose ohne Hinweis auf den beobachteten Wertebereich abgeben.

### Merksatz
Die Gerade kennt nur ihre Daten – außerhalb rät sie.

Siehe auch: Regressionsgerade · Regressionsgleichung · Regression · Overfitting
Mehr: Deep Dive 4, 2.2

## Ausgelassen
- Eigenschaften – Abschnittslabel Star-Schema
- Entscheiden und dokumentieren – Arbeitsschritt, kein Fachbegriff
- Erlaubt – kein Fachbegriff
