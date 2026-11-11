<!-- Begriffsseiten R · Stand 2026-10 -->
## R²
<!-- id: r · quellen: DD7 Teil 3 · stand: 2026-10 -->

Bestimmtheitsmaß einer Regression: der Anteil der Streuung der Zielgröße, den das Modell erklärt – $R^2 = 1 - \frac{\sum (y - \hat{y})^2}{\sum (y - \bar{y})^2}$.

### Erklärung
R² vergleicht das Modell mit einem trivialen Modell, das immer den Mittelwert ȳ vorhersagt. 1 bedeutet perfekte Anpassung, 0 „nicht besser als der Mittelwert“; auf Testdaten kann R² sogar negativ werden. Bei der einfachen linearen Regression (ein x) gilt $R^2 = r^2$. Weil R² einheitenlos ist, lassen sich Modelle auf denselben Daten gut vergleichen.

### Beispiel
Monatsumsätze des Möbelhauses (T€): Die quadrierten Prognosefehler summieren sich zu 180, die quadrierten Abweichungen vom Mittelwert 110 zu 1.000.
$R^2 = 1 - \frac{180}{1000} = 0{,}82$ – das Modell erklärt 82 % der Umsatzschwankungen.

### Abgrenzung
| Maß | Aussage |
|---|---|
| R² | relativer Erklärungsanteil, ohne Einheit |
| RMSE, MAE | typische Fehlergröße in der Einheit der Zielgröße |
| r (Pearson) | Stärke und Richtung eines linearen Zusammenhangs, −1 bis +1 |

### Prüfungsfalle
Ein hohes R² beweist weder Kausalität noch ein richtiges Modell – es misst nur, wie gut die Gerade zu genau diesen Daten passt.

### Merksatz
R² sagt, um wie viel besser das Modell ist als „immer der Mittelwert“.

Siehe auch: Bestimmtheitsmaß · RMSE · MAE · Residuum · Grenzen von R²
Mehr: Deep Dive 7, Teil 3 · Deep Dive 4, 2.3

## Rahmenlehrplan
<!-- id: rahmenlehrplan · quellen: Karte DD13 · stand: 2026-10 -->

Von der Kultusministerkonferenz (KMK) beschlossener Lehrplan für den berufsbezogenen Unterricht der Berufsschule in einem Ausbildungsberuf.

### Erklärung
Im dualen System gibt es zwei Lernorte mit je eigener Grundlage: Der Betrieb bildet nach der **Ausbildungsordnung** aus (vom zuständigen Bundesministerium erlassen), die Berufsschule unterrichtet nach dem Rahmenlehrplan der KMK. Beide werden aufeinander abgestimmt. Der Rahmenlehrplan ist in **Lernfelder** gegliedert; die Länder übernehmen ihn oder setzen ihn in eigene Lehrpläne um, weil Schule Ländersache ist.

### Beispiel
Für Fachinformatiker/-innen Daten- und Prozessanalyse legt der Rahmenlehrplan die Lernfelder der Berufsschule fest, die Ausbildungsordnung dagegen, was der Betrieb vermittelt und was in der Abschlussprüfung geprüft wird.

### Abgrenzung
| Regelwerk | erlassen von | gilt für |
|---|---|---|
| Ausbildungsordnung | Bundesministerium | Ausbildungsbetrieb, Prüfung |
| Rahmenlehrplan | KMK (Länder) | Berufsschule |
| BBiG | Bundestag (Gesetz) | gesamte Berufsausbildung |

### Prüfungsfalle
Weder Rahmenlehrplan noch Ausbildungsordnung stammen von der IHK – sie überwacht nur die Ausbildung und nimmt die Prüfungen ab.

### Merksatz
Betrieb → Ausbildungsordnung, Berufsschule → Rahmenlehrplan.

Siehe auch: Ausbildungsordnung · Berufsschule · BBiG · Duale Ausbildung · IHK
Mehr: Deep Dive 13, 1.1

## RAID
<!-- id: raid · quellen: Karte DD16, DD16 4.5 · stand: 2026-10 -->

Redundant Array of Independent Disks: Verbund mehrerer Festplatten, der je nach Level Geschwindigkeit, Ausfallsicherheit oder beides erhöht.

### Erklärung
Die Daten werden über die Platten verteilt (Striping), gespiegelt oder mit Paritätsinformationen abgesichert, aus denen sich eine ausgefallene Platte rekonstruieren lässt. RAID schützt vor dem **Ausfall einer Platte** und erhöht so die Verfügbarkeit.

| Level | Prinzip | min. Platten | nutzbar (n Platten à K) | verkraftet |
|---|---|---|---|---|
| RAID 0 | Striping | 2 | n · K | keinen Ausfall |
| RAID 1 | Spiegelung | 2 | K | 1 Platte |
| RAID 5 | verteilte Parität | 3 | (n − 1) · K | 1 Platte |
| RAID 6 | doppelte Parität | 4 | (n − 2) · K | 2 Platten |
| RAID 10 | Spiegelpaare + Striping | 4 | n · K / 2 | 1 Platte je Paar |

### Beispiel
Datenbankserver mit vier Platten à 4 TB: RAID 0 → 16 TB, RAID 5 → 12 TB, RAID 6 und RAID 10 → je 8 TB nutzbar.

### Abgrenzung
RAID ist Redundanz, kein Backup: Versehentliches Löschen, fehlerhafte Updates und Ransomware landen sofort auf allen Platten. Dagegen hilft nur eine Datensicherung nach der 3-2-1-Regel.

### Prüfungsfalle
RAID 0 ist nicht ausfallsicherer, sondern riskanter: Fällt eine von vier Platten aus, sind alle Daten verloren.

### Merksatz
RAID hält den Server am Laufen – das Backup rettet die Daten.

Siehe auch: 3-2-1-Regel · Vollsicherung · Ransomware · Verfügbarkeit · Single Point of Failure
Mehr: Deep Dive 16, 4.5 · Deep Dive 10, 4.4

## Random Forest
<!-- id: random-forest · quellen: Karte DD6, DD6 2.4, DD6 8.3 · stand: 2026-10 -->

Klassifikations- und Regressionsverfahren, bei dem viele Entscheidungsbäume gemeinsam abstimmen.

### Erklärung
Jeder Baum wird auf einer zufälligen Stichprobe der Trainingsdaten (Ziehen mit Zurücklegen, **Bagging**) trainiert und darf an jedem Knoten nur aus einer zufälligen Teilmenge der Merkmale wählen. Für einen neuen Fall stimmen alle Bäume ab; bei Klassifikation entscheidet die Mehrheit, bei Regression der Mittelwert. Einzelne Bäume überanpassen leicht, ihre Fehler gleichen sich im Wald weitgehend aus.

### Beispiel
Reklamationsvorhersage im Möbelhaus: 300 Bäume bewerten einen Auftrag, 210 sagen „Reklamation“ – der Wald stuft ihn als riskant ein. Genauer als ein Einzelbaum, aber dem Fachbereich lässt sich nicht mehr eine einzelne Regel zeigen.

### Abgrenzung
| | Entscheidungsbaum | Random Forest |
|---|---|---|
| Erklärbarkeit | direkt lesbar | Black Box |
| Genauigkeit | mittel | meist höher |
| Overfitting | anfällig | robuster |

### Prüfungsfalle
Wer „Erklärbarkeit für den Fachbereich“ als Anforderung liest und trotzdem Random Forest wählt, verliert die Begründungspunkte.

### Merksatz
Viele schwache Bäume, eine starke Mehrheit – aber keine lesbare Regel mehr.

Siehe auch: Entscheidungsbaum · Bagging · Overfitting · Support Vector Machine · Transparenz und Erklärbarkeit
Mehr: Deep Dive 6, 2.4 · Deep Dive 6, 8.3

## Ransomware
<!-- id: ransomware · quellen: Karte DD10, DD10 4.5 · stand: 2026-10 -->

Schadsoftware, die Daten verschlüsselt (oft vorher abzieht) und für die Freigabe ein Lösegeld erpresst.

### Erklärung
Ransomware gelangt meist über Phishing-Mails, ungepatchte Schwachstellen oder gestohlene Zugangsdaten ins Netz und verschlüsselt dann alles Erreichbare – auch verbundene Netzlaufwerke und Online-Backups. Sie trifft vor allem das Schutzziel **Verfügbarkeit**; werden Daten zusätzlich abgezogen und mit Veröffentlichung gedroht, auch die Vertraulichkeit. Gegenmaßnahmen: Offline- oder unveränderbare Backups, Netzsegmentierung, Patchmanagement, Least Privilege, Schulung.

### Beispiel
Ein Mitarbeiter öffnet einen präparierten Rechnungsanhang; über Nacht werden Warenwirtschaft und Fileserver verschlüsselt. Weil eine Sicherungskopie offline lag, stellt die IT den Stand vom Vortag wieder her. Sind personenbezogene Daten betroffen, läuft die 72-Stunden-Meldefrist nach Art. 33 DSGVO.

### Abgrenzung
RAID und Spiegelung helfen nicht: Die verschlüsselten Daten werden sofort mitgespiegelt. Nur Backups, die der Angreifer nicht erreicht, retten den Bestand.

### Prüfungsfalle
„Lösegeld zahlen“ ist keine Wiederherstellungsstrategie – es garantiert weder Entschlüsselung noch Löschung abgezogener Daten.

### Merksatz
Gegen Ransomware hilft das Backup, das sie nicht sehen kann.

Siehe auch: Schadsoftware · Phishing · 3-2-1-Regel · Patchmanagement · Datenpanne
Mehr: Deep Dive 10, 4.5 · Deep Dive 10, 4.4

## Rate Limiting
<!-- id: rate-limiting · quellen: Karte DD15, DD15 3.3 · stand: 2026-10 -->

Begrenzung der Anzahl von Anfragen je Client und Zeitraum, um eine Schnittstelle vor Überlastung und Missbrauch zu schützen.

### Erklärung
Die API zählt Anfragen je API-Schlüssel, Nutzer oder IP-Adresse in einem Zeitfenster. Wird das Limit überschritten, antwortet sie mit dem HTTP-Statuscode **429 Too Many Requests**, oft mit dem Header `Retry-After`, wann es weitergeht. Rate Limiting schützt die Verfügbarkeit, verteilt die Kapazität fair und bremst Brute-Force-Versuche und einfache Überlastungsangriffe.

### Beispiel
Die Reparatur-API des Möbelhauses erlaubt jedem Partner 100 Anfragen pro Minute. Ein fehlerhaftes Skript eines Partners fragt in einer Schleife ab und erhält ab der 101. Anfrage den Status 429 – die übrigen Nutzer merken nichts.

### Abgrenzung
Paginierung begrenzt die Datenmenge je Antwort, Rate Limiting die Zahl der Anfragen. 401/403 betreffen fehlende Anmeldung bzw. Berechtigung, 429 nur die Menge.

### Prüfungsfalle
429 ist ein Client-Fehler (4xx), kein Serverfehler – der Server funktioniert, der Client fragt zu oft.

### Merksatz
Zu viele Anfragen? 429 – bitte später wiederkommen.

Siehe auch: REST-API · HTTP-Statuscode · Filter und Paginierung · DDoS-Angriff · API-Schlüssel
Mehr: Deep Dive 15, 3.3

## Raute
<!-- id: raute · quellen: DD11 B3 · stand: 2026-10 -->

Rautensymbol, das im Programmablaufplan eine Verzweigung mit einer Bedingung kennzeichnet; die Ausgänge werden mit „ja“ und „nein“ beschriftet.

### Erklärung
Im PAP (DIN 66001) steht in der Raute die Bedingung, z. B. „Bestand < Mindestmenge?“. Je nach Ergebnis verlässt der Ablauf die Raute über den Ja- oder den Nein-Pfeil. Schleifen gibt es im PAP nicht als eigenes Symbol – sie entstehen aus einer Raute und einem Pfeil zurück an eine frühere Stelle.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 130" width="300" height="130" role="img" aria-label="PAP-Raute mit Ja- und Nein-Ausgang">
<polygon points="150,10 230,55 150,100 70,55" class="dg-form"/>
<text x="150" y="55" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestand &lt; 5?</text>
<line x1="230" y1="55" x2="290" y2="55" class="dg-linie"/>
<text x="260" y="45" text-anchor="middle" class="dg-klein">ja</text>
<line x1="150" y1="100" x2="150" y2="125" class="dg-linie"/>
<text x="162" y="118" class="dg-klein">nein</text>
</svg>
```

### Abgrenzung
| Notation | Bedeutung der Raute |
|---|---|
| PAP | Verzweigung mit Bedingung |
| BPMN | Gateway (X = XOR, + = AND, O = OR) |
| ERM (Chen) | Beziehung zwischen Entitäten |

### Prüfungsfalle
Unbeschriftete Ausgänge kosten Punkte – jeder Pfeil aus der Raute braucht „ja“ oder „nein“.

### Merksatz
In der Raute steht eine Frage, aus ihr führen die Antworten.

Siehe auch: Programmablaufplan · Verzweigung · Gateway · Chen-Notation · Struktogramm
Mehr: Deep Dive 11, B3 · Deep Dive 17, 4.1

## RBAC
<!-- id: rbac · quellen: Karte DD10, DD10 4.3 · stand: 2026-10 -->

Role-Based Access Control: rollenbasierte Zugriffskontrolle, bei der Rechte an Rollen statt an einzelne Personen vergeben werden.

### Erklärung
Rechte (lesen, ändern, freigeben) werden zu Rollen wie „Sachbearbeitung Reparatur“ oder „Controlling“ gebündelt; Personen erhalten eine oder mehrere Rollen. Das macht die Rechtevergabe übersichtlich und prüfbar und setzt Least Privilege und Need-to-know praktisch um.

### Beispiel
Eine Kollegin wechselt von der Serviceannahme ins Controlling. Statt 40 Einzelrechte zu entziehen und neue zu setzen, tauscht die IT nur die Rolle – alte Rechte bleiben nicht versehentlich bestehen.

### Abgrenzung
Authentifizierung klärt, wer jemand ist; RBAC ist ein Modell der Autorisierung, also dafür, was jemand darf. Funktionstrennung ergänzt RBAC: Unverträgliche Rollen (Zahlung anlegen und freigeben) dürfen nicht bei einer Person liegen.

### Prüfungsfalle
RBAC verhindert nicht von selbst zu viele Rechte – Rollen müssen regelmäßig überprüft werden, sonst sammeln sich Rechte an.

### Merksatz
Rechte hängen an der Rolle, nicht an der Person.

Siehe auch: Least Privilege · Need-to-know · Funktionstrennung · Autorisierung · Authentifizierung
Mehr: Deep Dive 10, 4.3

## Reaktionszeit
<!-- id: reaktionszeit · quellen: Karte DD16, DD16 4.4 · stand: 2026-10 -->

Im SLA vereinbarte maximale Zeit von der Störungsmeldung bis zum Beginn der Bearbeitung durch den Dienstleister.

### Erklärung
Reaktionszeiten werden meist nach Priorität der Störung gestaffelt und gelten innerhalb der vereinbarten Servicezeit. Sie sagen nur, wann jemand anfängt – nicht, wann das System wieder läuft.

### Beispiel
SLA mit dem Rechenzentrum: Priorität 1 (Reporting komplett ausgefallen) – Reaktionszeit 30 Minuten, Wiederherstellungszeit 4 Stunden; Priorität 3 – Reaktion am nächsten Werktag.

### Abgrenzung
| Kennzahl | misst |
|---|---|
| Reaktionszeit | Meldung → Beginn der Bearbeitung |
| Wiederherstellungszeit | Meldung → Dienst läuft wieder |
| RTO | maximal tolerierbare Ausfalldauer aus Sicht des Unternehmens |

### Prüfungsfalle
Eine kurze Reaktionszeit garantiert keine schnelle Lösung – für die Verfügbarkeit zählt die Wiederherstellungszeit.

### Merksatz
Reagieren heißt anfangen, nicht fertig sein.

Siehe auch: SLA · Wiederherstellungszeit · Verfügbarkeit · RTO
Mehr: Deep Dive 16, 4.4

## Reallohn
<!-- id: reallohn · quellen: Karte DD14, DD14 4.5 · stand: 2026-10 -->

Um die Preissteigerung bereinigter Lohn, der die tatsächliche Kaufkraft des Einkommens zeigt.

### Erklärung
Der **Nominallohn** ist der ausgezahlte Betrag in Euro. Steigen die Preise (Inflation), kann man sich davon weniger kaufen. Die Veränderung des Reallohns erhält man näherungsweise als Nominallohnsteigerung minus Inflationsrate, exakt über den Quotienten der Wachstumsfaktoren.

### Beispiel
Tariferhöhung 4 %, Inflationsrate 2,5 %:
Näherung: 4 % − 2,5 % = 1,5 %
Exakt: $\frac{1{,}04}{1{,}025} - 1 \approx 0{,}0146 = 1{,}46\,\%$
Die Kaufkraft wächst also nur um rund 1,5 %. Bei 2 % Lohnplus und 3 % Inflation sinkt der Reallohn.

### Abgrenzung
Nominal = in aktuellen Preisen, real = preisbereinigt – dieselbe Unterscheidung gilt beim Bruttoinlandsprodukt.

### Prüfungsfalle
Ein steigender Nominallohn bedeutet nicht automatisch mehr Kaufkraft – erst der Abzug der Inflation zeigt die reale Entwicklung.

### Merksatz
Real ist, was nach der Inflation übrig bleibt.

Siehe auch: Inflation · Inflationsrate · Bruttoinlandsprodukt · Deflation
Mehr: Deep Dive 14, 4.5

## Recall
<!-- id: recall · quellen: Karte DD7, DD7 2.2, DD7 2.4 · stand: 2026-10 -->

Trefferquote (Sensitivität) eines Klassifikators: Anteil der tatsächlich positiven Fälle, die das Modell gefunden hat – $\text{Recall} = \frac{TP}{TP + FN}$.

### Erklärung
Der Nenner ist die Zeile der tatsächlich positiven Fälle in der Konfusionsmatrix. Der Recall ist wichtig, wenn ein übersehener Fall (FN) teuer ist. Im Zusammenhang mit der ROC-Kurve heißt er auch Richtig-Positiv-Rate (TPR).

### Beispiel
1.000 Aufträge, 100 tatsächlich reklamiert, das Modell erkennt 60 davon: $\text{Recall} = \frac{60}{60 + 40} = 0{,}60$ = 60 %. Ein Modell, das immer „keine Reklamation“ sagt, hat 90 % Accuracy, aber 0 % Recall.

### Abgrenzung
| Kennzahl | Nenner | Frage |
|---|---|---|
| Recall | tatsächlich positiv (TP + FN) | Wie viele Positive wurden gefunden? |
| Precision | vorhergesagt positiv (TP + FP) | Wie viele Alarme stimmen? |
| Spezifität | tatsächlich negativ (TN + FP) | Wie viele Negative richtig erkannt? |

Senkt man die Entscheidungsschwelle, steigt der Recall meist, die Precision sinkt.

### Prüfungsfalle
Precision und Recall werden über den falschen Nenner verwechselt – vorher die positive Klasse festlegen und Zeile gegen Spalte prüfen.

### Merksatz
Recall: Wie viele der Gesuchten habe ich erwischt?

Siehe auch: Precision · Spezifität · F1-Maß · Konfusionsmatrix · Falsch negativ
Mehr: Deep Dive 7, 2.2 · Deep Dive 7, 2.4

## Rechenschaftspflicht
<!-- id: rechenschaftspflicht · quellen: Karte DD10, DD10 2.1 · stand: 2026-10 -->

Grundsatz der DSGVO (Art. 5 Abs. 2): Der Verantwortliche muss die Einhaltung aller Verarbeitungsgrundsätze nachweisen können.

### Erklärung
Es genügt nicht, rechtmäßig zu handeln – das Unternehmen muss es belegen können. Daraus folgt die Pflicht zur Dokumentation: Verzeichnis von Verarbeitungstätigkeiten (Art. 30), Nachweis von Einwilligungen (Art. 7), dokumentierte TOM (Art. 32), Datenschutz-Folgenabschätzungen und Protokolle zu Datenpannen.

### Beispiel
Die Aufsichtsbehörde fragt nach, auf welcher Rechtsgrundlage das Möbelhaus Newsletter verschickt. Ohne gespeicherte Double-Opt-in-Bestätigung kann es die Einwilligung nicht nachweisen – ein Verstoß, auch wenn die Kunden tatsächlich zugestimmt hatten.

### Abgrenzung
Die übrigen sechs Grundsätze (Rechtmäßigkeit, Zweckbindung, Datenminimierung, Richtigkeit, Speicherbegrenzung, Integrität und Vertraulichkeit) beschreiben, wie verarbeitet werden muss; die Rechenschaftspflicht verlangt den Nachweis dafür.

### Prüfungsfalle
Die Rechenschaftspflicht kehrt die Beweislast um: Nicht die Behörde muss den Verstoß belegen, das Unternehmen muss die Einhaltung zeigen.

### Merksatz
Was nicht dokumentiert ist, gilt als nicht eingehalten.

Siehe auch: DSGVO · Verzeichnis von Verarbeitungstätigkeiten · Technische und organisatorische Maßnahmen · Einwilligung · Richtigkeit
Mehr: Deep Dive 10, 2.1

## Rechnen mit NULL
<!-- id: rechnen-mit-null · quellen: DD1 3.1 · stand: 2026-10 -->

In SQL ergibt jede Rechnung oder Textverkettung mit einem NULL-Wert wieder NULL.

### Erklärung
NULL bedeutet „unbekannt“; was man mit einem unbekannten Wert rechnet, bleibt unbekannt. Deshalb liefert `preis + NULL` NULL, ebenso `'Herr ' || NULL`. Mit **COALESCE** ersetzt man NULL bewusst durch einen Ersatzwert.

### Beispiel
```sql
SELECT bestell_id,
       menge * preis + versandkosten              AS gesamt,      -- NULL, wenn versandkosten NULL
       menge * preis + COALESCE(versandkosten, 0) AS gesamt_null0
FROM bestellposition_view;
```
Fehlen bei Abholungen die Versandkosten, ist „gesamt“ NULL, „gesamt_null0“ liefert den Warenwert.

### Abgrenzung
Aggregatfunktionen verhalten sich anders: SUM, AVG, MIN und MAX überspringen NULL-Werte. AVG über 10, NULL, 20 ergibt 15, nicht 10.

### Prüfungsfalle
NULL ist nicht 0 – ob ein fehlender Wert als 0 zählen darf, ist eine fachliche Entscheidung, keine technische.

### Merksatz
Unbekannt plus etwas bleibt unbekannt.

Siehe auch: NULL · COALESCE · AVG ignoriert NULL · Dreiwertige Logik · NOT IN mit NULL
Mehr: Deep Dive 1, 3.1

## Rechtliche Verpflichtung
<!-- id: rechtliche-verpflichtung · quellen: Karte DD10, DD10 2.2 · stand: 2026-10 -->

Rechtsgrundlage nach Art. 6 Abs. 1 lit. c DSGVO: Die Verarbeitung ist erlaubt, soweit ein Gesetz sie dem Verantwortlichen vorschreibt.

### Erklärung
Die Pflicht muss sich aus EU- oder nationalem Recht ergeben, etwa aus Handels-, Steuer- oder Sozialversicherungsrecht. Eine Einwilligung ist dann weder nötig noch sinnvoll – der Betroffene könnte sie widerrufen, die gesetzliche Pflicht bliebe trotzdem.

### Beispiel
Ein Kunde verlangt die Löschung seiner Daten. Seine Rechnungen sind Buchungsbelege und müssen nach § 147 AO und § 257 HGB acht Jahre aufbewahrt werden (seit 2025, vorher zehn; Stand 2026). Das Möbelhaus sperrt die Daten (Art. 18), löscht sie nach Fristablauf und löscht die Newsletter-Daten sofort.

### Abgrenzung
| Rechtsgrundlage (Art. 6 Abs. 1) | Beispiel |
|---|---|
| lit. a Einwilligung | Newsletter |
| lit. b Vertragserfüllung | Lieferadresse |
| lit. c rechtliche Verpflichtung | Rechnungsaufbewahrung, Lohnsteuer |
| lit. f berechtigtes Interesse | Betrugsprävention nach Abwägung |

### Prüfungsfalle
Die Aufbewahrungspflicht geht dem Löschanspruch vor (Art. 17 Abs. 3 lit. b) – aber nur für die betroffenen Belege, nicht für alle Kundendaten.

### Merksatz
Was das Gesetz verlangt, braucht keine Einwilligung.

Siehe auch: Einwilligung · Vertragserfüllung · Berechtigtes Interesse · DSGVO · Speicherbegrenzung
Mehr: Deep Dive 10, 2.2 · Deep Dive 10, 2.3

## Rechtsfähigkeit
<!-- id: rechtsfahigkeit · quellen: Karte DD14, DD14 2.1 · stand: 2026-10 -->

Fähigkeit, Träger von Rechten und Pflichten zu sein; beim Menschen beginnt sie mit der Vollendung der Geburt (§ 1 BGB).

### Erklärung
Jeder Mensch (natürliche Person) ist rechtsfähig – unabhängig von Alter und Verstand – bis zum Tod. Juristische Personen wie GmbH, AG oder eingetragener Verein erlangen die Rechtsfähigkeit durch Gründung bzw. Eintragung, die GmbH etwa mit der Eintragung ins Handelsregister.

### Beispiel
Ein Säugling kann Eigentümer eines geerbten Grundstücks sein (rechtsfähig), aber keinen Kaufvertrag schließen (geschäftsunfähig) – das übernehmen die Eltern als gesetzliche Vertreter.

### Abgrenzung
| Begriff | Bedeutung | Beginn |
|---|---|---|
| Rechtsfähigkeit | Rechte und Pflichten haben | Vollendung der Geburt |
| Geschäftsfähigkeit | Rechtsgeschäfte wirksam abschließen | beschränkt ab 7, voll ab 18 |

### Prüfungsfalle
Rechtsfähigkeit und Geschäftsfähigkeit werden verwechselt – wer rechtsfähig ist, kann noch lange keine Verträge schließen.

### Merksatz
Rechte haben kann jeder Mensch, Rechte gestalten erst der Geschäftsfähige.

Siehe auch: Geschäftsfähigkeit · Natürliche Personen · Juristische Person · Taschengeldparagraf
Mehr: Deep Dive 14, 2.1

## Rechtsgrundlagen
<!-- id: rechtsgrundlagen · quellen: DD13 1.1 · stand: 2026-10 -->

Die Regelwerke, auf denen die duale Berufsausbildung beruht: BBiG, Ausbildungsordnung, Rahmenlehrplan, Ausbildungsvertrag und für Minderjährige das JArbSchG.

### Erklärung
Das **Berufsbildungsgesetz** regelt die Ausbildung allgemein (Vertrag, Probezeit, Kündigung, Prüfungen). Die **Ausbildungsordnung** des zuständigen Bundesministeriums legt für den einzelnen Beruf Inhalte, Dauer und Prüfungsanforderungen fest. Der **Rahmenlehrplan** der KMK gilt für die Berufsschule. Der Ausbildungsvertrag regelt das einzelne Verhältnis; das Jugendarbeitsschutzgesetz schützt Auszubildende unter 18.

### Beispiel
Jonas (17) beginnt seine Ausbildung zum Fachinformatiker: Sein Vertrag (Textform genügt seit 2024) richtet sich nach dem BBiG, der betriebliche Ausbildungsplan nach der Ausbildungsordnung, der Unterricht nach dem Rahmenlehrplan; weil er minderjährig ist, gilt zusätzlich das JArbSchG.

### Abgrenzung
Im Datenschutz meint „Rechtsgrundlage“ etwas anderes: die Erlaubnistatbestände des Art. 6 DSGVO (Einwilligung, Vertrag, rechtliche Verpflichtung …).

### Prüfungsfalle
Die Ausbildungsordnung wird nicht von der IHK erlassen, sondern vom Bundesministerium – die IHK überwacht und prüft nur.

### Merksatz
Gesetz (BBiG), Beruf (Ausbildungsordnung), Schule (Rahmenlehrplan), Einzelfall (Vertrag).

Siehe auch: BBiG · Ausbildungsordnung · Rahmenlehrplan · JArbSchG · IHK
Mehr: Deep Dive 13, 1.1

## Rechtsschief (linkssteil)
<!-- id: rechtsschief · quellen: Karte DD3 · stand: 2026-10 -->

Verteilung mit langem Ausläufer zu großen Werten; der Großteil der Werte liegt links, typischerweise gilt Mittelwert > Median.

### Erklärung
Wenige sehr große Werte ziehen das arithmetische Mittel nach oben, der Median bleibt in der Mitte der sortierten Reihe. Typisch rechtsschief sind Einkommen, Bestellwerte und Lieferzeiten mit einzelnen Ausreißern. Im Histogramm liegt der „Berg“ links, der lange Schwanz rechts; im Boxplot ist der obere Whisker länger.

### Beispiel
Lieferzeiten in Tagen: 2, 3, 3, 4, 5, 5, 5, 6, 8, 19. Mittelwert $\frac{60}{10} = 6{,}0$, Median 5,0 – der Ausreißer 19 macht die Verteilung rechtsschief.

### Abgrenzung
| Form | Lage | Ausläufer |
|---|---|---|
| rechtsschief = linkssteil | Mittelwert > Median | rechts |
| symmetrisch | Mittelwert ≈ Median | beidseitig gleich |
| linksschief = rechtssteil | Mittelwert < Median | links |

### Prüfungsfalle
„Rechtsschief“ und „linkssteil“ sind dasselbe – der Name richtet sich nach dem Ausläufer bzw. nach der steilen Flanke, nicht nach dem Gipfel.

### Merksatz
Der Schwanz zeigt die Schiefe: langer Schwanz rechts = rechtsschief.

Siehe auch: Median · Arithmetisches Mittel · Ausreißer · Boxplot · Histogramm
Mehr: Deep Dive 3, Teil 3

## Record Linkage
<!-- id: record-linkage · quellen: Karte DD9, DD9 4.2 · stand: 2026-10 -->

Verfahren, das Datensätze verschiedener oder derselben Quelle findet, die dieselbe Realweltentität beschreiben, und sie über Ähnlichkeitsmaße zusammenführt.

### Erklärung
Weil nicht jeder Satz mit jedem verglichen werden kann, bildet man zuerst Blöcke (**Blocking**, z. B. nur Sätze mit gleicher PLZ). Je Kandidatenpaar wird ein Ähnlichkeitswert über mehrere Felder berechnet – etwa mit Levenshtein-Distanz oder Kölner Phonetik nach dem Normalisieren. Zwei Schwellen teilen ein: oberhalb automatisch Match, unterhalb Non-Match, dazwischen Prüffall zur manuellen Kontrolle.

### Beispiel
Shop und Warenwirtschaft führen „Braun GmbH, 20095 Hamburg“ und „Braun G.m.b.H., 20095 Hamburg“. Nach dem Normalisieren ist die Distanz 0, Ähnlichkeit 0,97 > obere Schwelle 0,9 → Match; beide werden zu einem Golden Record zusammengeführt.

### Abgrenzung
Exakte Dubletten findet schon ein UNIQUE-Constraint oder `GROUP BY … HAVING COUNT(*) > 1`; Record Linkage zielt auf unscharfe Dubletten ohne gemeinsamen Schlüssel.

### Prüfungsfalle
Mit nur einer Schwelle werden Grenzfälle entweder falsch zusammengeführt oder übersehen – der Prüffallbereich gehört dazu.

### Merksatz
Blocken, vergleichen, zwei Schwellen, im Zweifel ein Mensch.

Siehe auch: Dublette · Levenshtein-Distanz · Kölner Phonetik · Golden Record · Normalisieren
Mehr: Deep Dive 9, 4.2

## Referenzielle Integrität
<!-- id: referenzielle-integritat · quellen: Karte DD1, DD2 1.5, DD9 5.1, SQL-Zusatz 3.5 · stand: 2026-10 -->

Regel, dass jeder Fremdschlüsselwert als Primärschlüssel in der referenzierten Tabelle existieren muss (oder NULL ist) – es gibt keine verwaisten Datensätze.

### Erklärung
Das DBMS sichert die Regel über FOREIGN KEY … REFERENCES ab: Einfügen eines Verweises auf einen nicht vorhandenen Satz wird abgelehnt. Für das Löschen oder Ändern des referenzierten Satzes legt man das Verhalten fest: **RESTRICT** bzw. NO ACTION (verhindern, NO ACTION ist Standard), **CASCADE** (abhängige Sätze mitlöschen), **SET NULL** oder SET DEFAULT.

### Beispiel
```sql
CREATE TABLE bestellung (
  bestell_id   INTEGER PRIMARY KEY,
  kunden_id    INTEGER NOT NULL,
  bestelldatum DATE,
  FOREIGN KEY (kunden_id) REFERENCES kunde(kunden_id) ON DELETE RESTRICT
);
```
Kunde 1 (Huber GmbH) hat Bestellungen – sein Löschen wird verhindert, keine Bestellung verliert ihren Kunden.

### Abgrenzung
RESTRICT schützt die Daten, CASCADE räumt mit auf – bei Bestellungen meist gefährlich, bei Bestellpositionen einer gelöschten Bestellung sinnvoll.

### Prüfungsfalle
Referenzielle Integrität ist kein reines Technikthema: Sie ist eine präventive Datenqualitätsmaßnahme gegen inkonsistente Bestände.

### Merksatz
Kein Verweis ins Leere.

Siehe auch: Fremdschlüssel · Primärschlüssel · Konsistenz · Vom Minimum zur NULL-Fähigkeit · DDL
Mehr: Deep Dive 1, 2.5 · Deep Dive 2, 1.5 · Deep Dive 9, 5.1

## Regression
<!-- id: regression · quellen: Karte DD6 · stand: 2026-10 -->

Überwachtes Lernverfahren, das einen metrischen (stetigen) Zielwert vorhersagt, z. B. Umsatz oder Lieferdauer.

### Erklärung
Wie die Klassifikation braucht die Regression gelabelte Trainingsdaten, also Fälle mit bekanntem Zielwert. Der Unterschied liegt allein in der Zielvariablen: eine Zahl statt einer Kategorie. Verfahren sind die lineare Regression (Regressionsgerade), Regressionsbäume oder Random Forests; bewertet wird mit MAE, RMSE, MAPE oder R².

### Beispiel
Das Möbelhaus prognostiziert aus Werbebudget, Saison und Filiale den Monatsumsatz in T€ – eine Regression. Die Frage „Wird dieser Auftrag reklamiert – ja/nein?“ wäre dagegen eine Klassifikation.

### Abgrenzung
| | Regression | Klassifikation |
|---|---|---|
| Zielvariable | Zahl (stetig) | Kategorie (diskret) |
| Gütemaße | MAE, RMSE, R² | Accuracy, Precision, Recall, F1 |

### Prüfungsfalle
Die **logistische** Regression ist trotz ihres Namens ein Klassifikationsverfahren – sie schätzt die Wahrscheinlichkeit einer Klasse.

### Merksatz
Zahl vorhersagen = Regression, Klasse vorhersagen = Klassifikation.

Siehe auch: Klassifikation · Überwachtes Lernen · Regressionsgerade · Logistische Regression · RMSE
Mehr: Deep Dive 6, 2.3 · Deep Dive 4, Teil 2

## Regressionsgerade
<!-- id: regressionsgerade · quellen: Karte DD4, DD4 2.2 · stand: 2026-10 -->

Gerade $\hat{y} = a + b \cdot x$, die nach der Methode der kleinsten Quadrate die Summe der quadrierten senkrechten Abstände zu den Datenpunkten minimiert und zur Prognose dient.

Auch: Regressionsgleichung

### Erklärung
b ist die Steigung: Um so viel ändert sich ŷ, wenn x um eine Einheit steigt – die inhaltlich wichtigste Zahl. a ist der Achsenabschnitt, der rechnerische Wert bei x = 0. Berechnung: $b = \frac{S_{xy}}{S_{xx}}$ und $a = \bar{y} - b \cdot \bar{x}$. Die Formel der Geraden heißt Regressionsgleichung.

### Beispiel
Werbebudget x und Umsatz y (je T€) über fünf Monate: $\bar{x} = 3$, $\bar{y} = 44$, $S_{xy} = 64$, $S_{xx} = 10$.
- $b = \frac{64}{10} = 6{,}4$
- $a = 44 - 6{,}4 \cdot 3 = 24{,}8$

Regressionsgleichung: $\hat{y} = 24{,}8 + 6{,}4 \cdot x$. Je 1.000 € mehr Werbung steigt der Umsatz im Mittel um 6.400 €. Prognose für x = 6: $24{,}8 + 6{,}4 \cdot 6 = 63{,}2$ T€ (leichte Extrapolation).

### Abgrenzung
Der Korrelationskoeffizient r beschreibt nur die Stärke des Zusammenhangs; die Regressionsgerade liefert eine Gleichung für Prognosen.

### Prüfungsfalle
Prognosen weit außerhalb des beobachteten x-Bereichs (Extrapolation) sind unzulässig – die Einschränkung immer dazuschreiben.

### Merksatz
b ist die Botschaft: „Pro Einheit x ändert sich y um b.“

Siehe auch: Residuum · R² · Korrelationskoeffizient nach Pearson · Extrapolation · Streudiagramm
Mehr: Deep Dive 4, 2.1 · Deep Dive 4, 2.2

## Regressionstest
<!-- id: regressionstest · quellen: Karte DD16, DD16 2.4 · stand: 2026-10 -->

Wiederholung bereits bestandener Tests nach jeder Änderung, um ungewollte Nebenwirkungen in unveränderten Teilen aufzudecken.

### Erklärung
Jede Korrektur, Erweiterung oder Umgebungsänderung kann an anderer Stelle etwas zerstören. Weil dieselben Testfälle mit festen erwarteten Ergebnissen immer wieder laufen, lohnt sich hier besonders die **Testautomatisierung**. Testgetriebene Entwicklung liefert automatisierte Komponententests gleich mit, die danach als Regressionstests weiterlaufen.

### Beispiel
Nach einer Änderung an der Umsatzberechnung meldet die Buchhaltung falsche Versandkosten. Eine automatisierte Regressionssuite mit dem Testfall „6 Packstücke → Spedition“ hätte den Fehler vor der Auslieferung gezeigt.

### Abgrenzung
| Test | prüft |
|---|---|
| Fehlernachtest (Re-Test) | ob genau der behobene Fehler weg ist |
| Regressionstest | ob die Änderung woanders etwas kaputt gemacht hat |

### Prüfungsfalle
Regressionstest hat nichts mit statistischer Regression zu tun – „Regression“ meint hier den Rückschritt der Software.

### Merksatz
Nach jeder Änderung: Läuft alles, was schon lief?

Siehe auch: Fehlernachtest · Testgetriebene Entwicklung (TDD) · Testpyramide · Testfall · Komponententest
Mehr: Deep Dive 16, 2.4

## Reifegradmodelle
<!-- id: reifegradmodelle · quellen: Karte DD5, DD5 6.6 · stand: 2026-10 -->

Modelle, die in Stufen bewerten, wie gut eine Organisation ihre Prozesse beherrscht – von „läuft irgendwie“ bis „wird gemessen und ständig verbessert“.

### Erklärung
Bekanntestes Beispiel ist **CMMI** (Capability Maturity Model Integration) mit fünf Reifegraden: 1 initial, 2 gemanagt, 3 definiert, 4 quantitativ gemanagt, 5 optimierend. Jede Stufe baut auf der vorigen auf. Reifegradmodelle zeigen den Ist-Stand, machen Vergleiche möglich (Benchmarking) und liefern einen Fahrplan für Verbesserungen.

### Beispiel
Die Reparaturannahme des Möbelhauses funktioniert nur, weil eine erfahrene Kollegin alles im Kopf hat (Stufe 1). Mit BPMN-Modell und verbindlichen Checklisten erreicht sie Stufe 3; misst sie Durchlaufzeit und Termintreue regelmäßig gegen Zielwerte, ist Stufe 4 erreicht.

### Abgrenzung
KPIs und Balanced Scorecard messen die Leistung eines Prozesses; ein Reifegradmodell bewertet, wie beherrscht und gesteuert er ist.

### Prüfungsfalle
Stufen lassen sich nicht überspringen – wer ohne definierte Standardprozesse (Stufe 3) „optimieren“ will, optimiert Zufall.

### Merksatz
Reife heißt: unabhängig von Einzelpersonen, gemessen, ständig verbessert.

Siehe auch: KPI · Balanced Scorecard · KVP · Six Sigma · Benchmarking
Mehr: Deep Dive 5, 6.6

## Reihenschaltung
<!-- id: reihenschaltung · quellen: Karte DD16, DD16 4.3 · stand: 2026-10 -->

Anordnung von Komponenten, die alle gleichzeitig laufen müssen, damit das System verfügbar ist; die Verfügbarkeiten werden multipliziert.

### Erklärung
$V_{ges} = V_1 \cdot V_2 \cdot \ldots \cdot V_n$. Weil jeder Faktor kleiner als 1 ist, liegt die Gesamtverfügbarkeit immer unter der schwächsten Komponente. Jede Komponente in Reihe ist ein weiterer Ausfallgrund und ohne Redundanz ein Single Point of Failure.

### Beispiel
Das Reporting braucht Webserver (99,9 %) und Datenbank (99 %):
$V = 0{,}999 \cdot 0{,}99 = 0{,}98901$ = 98,901 %.
Wird die Datenbank gespiegelt (zwei Server parallel): $V_{DB} = 1 - 0{,}01^2 = 0{,}9999$, gesamt $0{,}999 \cdot 0{,}9999 \approx 0{,}9989$ = 99,890 %.

### Abgrenzung
| Schaltung | System läuft, wenn … | Rechnung |
|---|---|---|
| Reihe | alle laufen | Verfügbarkeiten multiplizieren |
| Parallel | mindestens eine läuft | Ausfallwahrscheinlichkeiten multiplizieren, von 1 abziehen |

### Prüfungsfalle
Verfügbarkeiten addieren oder mitteln ist falsch – drei Komponenten mit je 99 % ergeben $0{,}99^3 \approx 0{,}970$, also nur rund 97 %.

### Merksatz
In Reihe wird es immer schlechter als das schwächste Glied.

Siehe auch: Parallelschaltung · Verfügbarkeit · Single Point of Failure · Verfügbarkeitsberechnung · SLA
Mehr: Deep Dive 16, 4.3

## Rekursion
<!-- id: rekursion · quellen: Karte DD11, DD11 B7 · stand: 2026-10 -->

Technik, bei der eine Funktion sich selbst mit einem kleineren Teilproblem aufruft, bis eine Abbruchbedingung (Basisfall) erreicht ist.

### Erklärung
Jeder rekursive Aufruf muss das Problem verkleinern und auf den Basisfall zulaufen; sonst ruft sich die Funktion endlos auf, bis der Aufrufstapel überläuft (Stack Overflow). Merge Sort und Quicksort arbeiten rekursiv nach dem Prinzip „Teile und herrsche“. Jede Rekursion lässt sich auch iterativ mit einer Schleife schreiben.

### Beispiel
```text
FUNKTION fakultaet(n)
    WENN n <= 1 DANN
        RÜCKGABE 1                       // Basisfall
    SONST
        RÜCKGABE n * fakultaet(n - 1)    // rekursiver Aufruf
    ENDE WENN
ENDE FUNKTION
```
fakultaet(4) = 4 · 3 · 2 · fakultaet(1) = 4 · 3 · 2 · 1 = 24.

### Abgrenzung
Iteration wiederholt in einer Schleife und braucht konstanten Speicher; Rekursion ist oft kürzer, belegt aber für jeden offenen Aufruf Platz auf dem Stapel.

### Prüfungsfalle
Fehlt der Basisfall oder wird das Problem nicht kleiner (`fakultaet(n)` statt `fakultaet(n - 1)`), terminiert die Funktion nie.

### Merksatz
Ohne Basisfall keine Rekursion, sondern eine Endlosschleife.

Siehe auch: Algorithmus · Merge Sort · Quicksort · Pseudocode · O-Notation
Mehr: Deep Dive 11, B7

## Rekursive Beziehung
<!-- id: rekursive-beziehung · quellen: Karte DD2 · stand: 2026-10 -->

Beziehung einer Entität zu sich selbst, z. B. MITARBEITER „führt“ MITARBEITER; umgesetzt über einen NULL-fähigen Fremdschlüssel in derselben Tabelle.

### Erklärung
Beide Rollen der Beziehung gehören zum selben Entitätstyp, deshalb werden sie im ERM beschriftet (Vorgesetzter / Geführter). Bei 1:n wandert der Primärschlüssel als Fremdschlüssel in dieselbe Tabelle. Er muss NULL zulassen, wenn nicht jede Instanz teilnimmt.

### Beispiel
```sql
CREATE TABLE mitarbeiter (
  mitarbeiter_id  INTEGER PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  vorgesetzter_id INTEGER NULL,
  FOREIGN KEY (vorgesetzter_id) REFERENCES mitarbeiter(mitarbeiter_id)
);
```
Kardinalität: als Vorgesetzter (0,n), als Geführter (0,1). Die Geschäftsführung hat keinen Vorgesetzten – vorgesetzter_id ist NULL.

### Abgrenzung
Eine rekursive m:n-Beziehung (Produkt „besteht aus“ Produkt, Stückliste) braucht eine eigene Zwischentabelle mit zwei Fremdschlüsseln auf dieselbe Tabelle.

### Prüfungsfalle
Den Fremdschlüssel als NOT NULL anzulegen macht das Einfügen der obersten Person unmöglich.

### Merksatz
Die Tabelle zeigt auf sich selbst – und an der Spitze steht NULL.

Siehe auch: Fremdschlüssel · Kardinalität · Zwischentabelle · Vom Minimum zur NULL-Fähigkeit · Chen-Notation
Mehr: Deep Dive 2, 1.4

## Relative Häufigkeit
<!-- id: relative-haufigkeit · quellen: Karte DD3 · stand: 2026-10 -->

Anteil einer Ausprägung an allen Beobachtungen: absolute Häufigkeit geteilt durch die Gesamtzahl, $f = \frac{h}{n}$.

### Erklärung
Relative Häufigkeiten liegen zwischen 0 und 1 bzw. 0 und 100 % und summieren sich über alle Ausprägungen zu genau 1 – eine schnelle Kontrolle gegen Rechenfehler. Sie machen Gruppen unterschiedlicher Größe vergleichbar und dienen als Schätzwert für Wahrscheinlichkeiten.

### Beispiel
50 Reklamationen, davon 18 Transportschäden: $f = \frac{18}{50} = 0{,}36$ = 36 %. Zusammen mit den Montagefehlern ($\frac{15}{50}$ = 30 %) erklären die zwei häufigsten Gründe kumuliert 66 % – Ansatzpunkt für ein Pareto-Diagramm.

### Abgrenzung
| Häufigkeit | Bedeutung |
|---|---|
| absolut h | Anzahl (18) |
| relativ f | Anteil (0,36) |
| kumuliert | Summe bis einschließlich dieser Kategorie (66 %) |

### Prüfungsfalle
Prozentangaben aus kleinen Gruppen nicht ohne absolute Zahlen berichten – 50 % von 4 Fällen sind nur 2 Fälle.

### Merksatz
Relativ heißt: im Verhältnis zum Ganzen.

Siehe auch: Absolute Häufigkeit · Kumulierte Häufigkeit · Pareto-Prinzip · Laplace-Wahrscheinlichkeit · Histogramm
Mehr: Deep Dive 3, Teil 2

## Relevanz
<!-- id: relevanz · quellen: Karte DD9, DD9 Teil 1 · stand: 2026-10 -->

Dimension der Datenqualität: Werden die Merkmale erhoben, die für den vorgesehenen Zweck tatsächlich gebraucht werden?

### Erklärung
Datenqualität ist Eignung für den Verwendungszweck. Daten können vollständig, korrekt und aktuell sein und trotzdem nutzlos, wenn das entscheidende Merkmal fehlt. Geprüft wird die Relevanz durch einen fachlichen Abgleich zwischen Fragestellung und Datenbestand, z. B. in der Phase Data Understanding von CRISP-DM.

### Beispiel
Das Möbelhaus will Reklamationen nach Montageteam auswerten, im Auftragsdatensatz ist aber nur die Filiale gespeichert. Ergänzt wird ein Pflichtfeld „Montageteam“ – nicht benötigte Felder wie das Geburtsdatum der Kunden werden dagegen nicht mehr erhoben (Datenminimierung).

### Abgrenzung
| Dimension | Frage |
|---|---|
| Relevanz | Die richtigen Merkmale? |
| Vollständigkeit | Alle Werte der Merkmale vorhanden? |
| Korrektheit | Stimmen die Werte mit der Realität? |

### Prüfungsfalle
Fehlende Relevanz lässt sich nicht durch Bereinigung beheben – ein nie erhobenes Merkmal kann man nicht „cleansen“.

### Merksatz
Gute Daten zur falschen Frage sind schlechte Daten.

Siehe auch: Datenqualität · Vollständigkeit · Korrektheit · Datenminimierung · CRISP-DM
Mehr: Deep Dive 9, Teil 1

## Rentenversicherung
<!-- id: rentenversicherung · quellen: Karte DD14, DD14 1.2 · stand: 2026-10 -->

Zweig der gesetzlichen Sozialversicherung, getragen von der Deutschen Rentenversicherung und je zur Hälfte von Arbeitgeber und Arbeitnehmer finanziert.

### Erklärung
Leistungen sind Altersrente, Erwerbsminderungsrente, Hinterbliebenenrente und Rehabilitation. Finanziert wird im **Umlageverfahren** (Generationenvertrag): Die Beiträge der Erwerbstätigen zahlen die laufenden Renten. Beitragssatz 18,6 %, also je 9,3 % für AG und AN; Beiträge fallen nur bis zur Beitragsbemessungsgrenze von 8.450 € im Monat an (beides Stand 2026).

### Beispiel
Jonas (17) erhält 1.200 € Ausbildungsvergütung: RV-Anteil $1.200 \cdot 0{,}093 = 111{,}60$ €, der Betrieb zahlt denselben Betrag. Bei höchstens 325 € Vergütung (Geringverdienergrenze) trüge der Betrieb die Beiträge allein.

### Abgrenzung
| Zweig | Träger | Finanzierung |
|---|---|---|
| Rentenversicherung | Deutsche Rentenversicherung | je zur Hälfte |
| Unfallversicherung | Berufsgenossenschaften | Arbeitgeber allein |
| Arbeitslosenversicherung | Bundesagentur für Arbeit | je zur Hälfte |

Die gesetzliche Rente ist nur eine der drei Säulen der Altersvorsorge.

### Prüfungsfalle
Träger ist weder Krankenkasse noch Bundesagentur, sondern die Deutsche Rentenversicherung – und Reha-Leistungen gehören ebenfalls dazu.

### Merksatz
Heutige Beiträge zahlen heutige Renten.

Siehe auch: Sozialversicherung · Umlageverfahren · Beitragsbemessungsgrenze · Drei-Säulen-Modell der Altersvorsorge · Geringverdienergrenze
Mehr: Deep Dive 14, 1.2 · Deep Dive 14, 1.3

## Residuum
<!-- id: residuum · quellen: Karte DD4 · stand: 2026-10 -->

Abweichung zwischen beobachtetem und vom Modell geschätztem Wert: $e = y - \hat{y}$.

### Erklärung
Residuen zeigen, wo die Regressionsgerade danebenliegt. Bei der Kleinste-Quadrate-Geraden summieren sie sich immer zu null; ihre Quadratsumme ist die unerklärte Streuung und geht in R² ein. Erwünscht ist eine **zufällige** Streuung um null. Ein Muster (erst alle negativ, dann alle positiv, Trichterform) zeigt, dass das lineare Modell nicht passt.

### Beispiel
Gerade $\hat{y} = 24{,}8 + 6{,}4 \cdot x$, Monat 2: x = 2, y = 40. Geschätzt $\hat{y} = 37{,}6$, also $e = 40 - 37{,}6 = 2{,}4$ T€. Alle Residuen: −1,2 / +2,4 / −2,0 / +1,6 / −0,8 – Summe 0, Quadratsumme 14,4, kein erkennbares Muster.

### Abgrenzung
Ein Residuum ist der Fehler eines einzelnen Punktes; MAE und RMSE fassen alle Fehler zu einer Kennzahl zusammen.

### Prüfungsfalle
Gemessen wird senkrecht in y-Richtung, nicht rechtwinklig zur Geraden – und das Vorzeichen lautet „beobachtet minus geschätzt“.

### Merksatz
Residuen sollen rauschen, nicht erzählen.

Siehe auch: Regressionsgerade · R² · RMSE · MAE · Streudiagramm
Mehr: Deep Dive 4, 2.1 · Deep Dive 4, 2.3

## REST-API
<!-- id: rest-api · quellen: Karte DD15, DD15 3.1, DD15 3.2 · stand: 2026-10 -->

Schnittstelle nach dem Architekturstil REST: Ressourcen werden über URIs adressiert, Operationen über HTTP-Methoden ausgeführt, jede Anfrage ist zustandslos, Daten werden meist als JSON ausgetauscht.

Auch: REST

### Erklärung
**Ressourcen** sind Substantive im Plural (`/reparaturauftraege/5001`), keine Verben. GET liest, POST legt an, PUT ersetzt, PATCH ändert teilweise, DELETE löscht; das Ergebnis meldet ein Statuscode (2xx Erfolg, 4xx Client-, 5xx Serverfehler). Zustandslos heißt: Der Server speichert keinen Sitzungszustand, jede Anfrage bringt alles mit, auch das Token. Beschrieben wird eine REST-API mit **OpenAPI**.

### Beispiel
```http
GET  /reparaturauftraege?status=offen&seite=2   → 200 OK, JSON-Liste
POST /reparaturauftraege                        → 201 Created
```
Ein Partner liest offene Aufträge gezielt und aktuell, statt nachts eine CSV-Datei zu bekommen.

### Abgrenzung
| Stil | Merkmal |
|---|---|
| REST | Ressourcen + HTTP-Methoden, meist JSON |
| SOAP | XML-Nachrichten, streng typisiert, WSDL |
| GraphQL | ein Endpunkt, Client wählt die Felder |

### Prüfungsfalle
POST ist nicht idempotent: Ein wiederholtes POST nach einem Timeout legt eine zweite Bestellung an.

### Merksatz
Substantiv in der URI, Verb in der HTTP-Methode.

Siehe auch: Idempotent · Zustandslos · HTTP-Statuscode · OpenAPI · SOAP
Mehr: Deep Dive 15, 3.1 · Deep Dive 15, 3.2

## Retrospektive
<!-- id: retrospektive · quellen: Karte DD12 · stand: 2026-10 -->

Scrum-Event am Ende jedes Sprints, in dem das Scrum Team Zusammenarbeit, Prozesse, Werkzeuge und Qualität überprüft und Verbesserungen festlegt.

### Erklärung
Die Sprint-Retrospektive ist das letzte Event des Sprints (Timebox höchstens 3 Stunden bei einem Ein-Monats-Sprint, Scrum Guide 2020). Das Team fragt: Was lief gut, was nicht, was ändern wir? Die wichtigsten Verbesserungen werden konkret vereinbart und möglichst schon im nächsten Sprint umgesetzt – gelebter kontinuierlicher Verbesserungsprozess.

### Beispiel
Im Reporting-Projekt kamen Datenlieferungen mehrfach zu spät. In der Retrospektive vereinbart das Team, den Datenzugriff künftig schon im Sprint Planning zu klären.

### Abgrenzung
| Event | Gegenstand |
|---|---|
| Sprint Review | das Produkt bzw. Inkrement, mit Stakeholdern |
| Sprint-Retrospektive | die Arbeitsweise des Teams |
| Lessons Learned | Rückblick am Projektende (klassisch) |

### Prüfungsfalle
Review und Retrospektive werden vertauscht – im Review geht es um das Was, in der Retrospektive um das Wie.

### Merksatz
Review prüft das Produkt, Retro verbessert das Team.

Siehe auch: Sprint Review · Scrum · Sprint · Lessons Learned · KVP
Mehr: Deep Dive 12, Teil 2

## Return on Investment
<!-- id: return-on-investment · quellen: Karte DD12, DD12 4.2 · stand: 2026-10 -->

Rentabilitätskennzahl einer Investition: $\text{ROI} = \frac{\text{Gewinn}}{\text{eingesetztes Kapital}} \cdot 100$.

### Erklärung
Der ROI zeigt, wie viel Prozent Gewinn das eingesetzte Kapital erwirtschaftet. Er gehört wie Amortisationszeit und Break-even zu den statischen Verfahren: Ein Euro in fünf Jahren zählt so viel wie heute. Wird der ROI über mehrere Jahre berechnet, gibt man ihn oft zusätzlich pro Jahr an.

### Beispiel
Investition 45.000 €, jährliche Einsparung 18.000 €, Nutzungsdauer fünf Jahre:
Gesamtersparnis $5 \cdot 18.000 = 90.000$ €, Gewinn $90.000 - 45.000 = 45.000$ €.
$\text{ROI} = \frac{45.000}{45.000} \cdot 100 = 100\,\%$ über die Laufzeit, im einfachen Durchschnitt 20 % pro Jahr.

### Abgrenzung
| Rechnung | Frage |
|---|---|
| ROI | Wie rentabel ist das Kapital? |
| Amortisationszeit | Wann ist das Geld zurück? (hier 2,5 Jahre) |
| Kapitalwert | Lohnt es sich unter Berücksichtigung des Zinses? |

### Prüfungsfalle
Im Zähler steht der Gewinn, nicht der gesamte Rückfluss – wer 90.000 / 45.000 rechnet, kommt fälschlich auf 200 %.

### Merksatz
ROI = Gewinn durch Einsatz.

Siehe auch: Amortisationszeit · Kapitalwert · Break-even-Menge · Total Cost of Ownership · Nutzwertanalyse
Mehr: Deep Dive 12, 4.2

## Review
<!-- id: review · quellen: Karte DD16 · stand: 2026-10 -->

Strukturierte Durchsicht eines Arbeitsergebnisses (Dokument, Datenmodell, SQL-Skript, Code) durch andere Personen, um Fehler früh zu finden.

### Erklärung
Reviews sind statische Prüfungen: Das Prüfobjekt wird nicht ausgeführt. Je nach Formalität unterscheidet man **informelles Review** (Kollege schaut drüber), **Walkthrough** (Autor stellt vor), **technisches Review** (Fachkollegen prüfen gegen Vorgaben) und **Inspektion** (formal mit Rollen, Checklisten, Protokoll und Metriken). Reviews lohnen sich, weil ein Fehler umso teurer wird, je später er auffällt.

### Beispiel
Vor der Umsetzung prüfen Fachbereich und eine Kollegin das Pflichtenheft des Reportings und finden, dass „Umsatz“ einmal brutto, einmal netto gemeint ist – ein Fehler, der im Abnahmetest ein Vielfaches gekostet hätte.

### Abgrenzung
Ein Test führt das System aus (dynamisch) und zeigt Fehlerwirkungen; ein Review findet Fehlerzustände direkt im Dokument oder Code. Das Sprint Review in Scrum ist dagegen ein Event zur Vorstellung des Inkrements.

### Prüfungsfalle
Reviews sind analytische, nicht konstruktive Qualitätssicherung – sie finden Fehler, sie vermeiden sie nicht.

### Merksatz
Lesen kostet weniger als Nachbessern.

Siehe auch: Walkthrough · Inspektion · Statische Prüfung · Analytische Qualitätssicherung · Testen
Mehr: Deep Dive 16, 1.2

## Richtig negativ
<!-- id: richtig-negativ · quellen: Karte DD7 · stand: 2026-10 -->

TN (true negative): Feld der Konfusionsmatrix für Fälle, die tatsächlich negativ sind und auch als negativ vorhergesagt wurden.

### Erklärung
Der erste Buchstabe sagt, ob die Vorhersage stimmt (T/F), der zweite, was vorhergesagt wurde (P/N). TN geht in Accuracy und Spezifität ein, aber nicht in Precision, Recall oder F1.

### Beispiel
Von 900 Aufträgen ohne Reklamation sagt das Modell bei 810 korrekt „keine Reklamation“: TN = 810, Spezifität $\frac{810}{900} = 0{,}90$ = 90 %.

### Abgrenzung
FN ist ebenfalls eine negative Vorhersage, aber falsch – der Fall war positiv.

### Prüfungsfalle
Bei unausgeglichenen Klassen ist TN riesig und bläht die Accuracy auf – deshalb nie nur die Accuracy berichten.

### Merksatz
TN: richtig gesagt, dass nichts ist.

Siehe auch: Richtig positiv · Falsch negativ · Spezifität · Konfusionsmatrix · Accuracy
Mehr: Deep Dive 7, 2.1

## Richtig positiv
<!-- id: richtig-positiv · quellen: Karte DD7 · stand: 2026-10 -->

TP (true positive): Feld der Konfusionsmatrix für Fälle, die tatsächlich positiv sind und als positiv vorhergesagt wurden.

### Erklärung
TP sind die echten Treffer des Modells. Sie stehen im Zähler von Precision $\frac{TP}{TP + FP}$ und Recall $\frac{TP}{TP + FN}$. Was „positiv“ ist, muss vorher festgelegt werden – meist das seltene, interessierende Ereignis.

### Beispiel
Positive Klasse „Reklamation“: Von 100 tatsächlich reklamierten Aufträgen erkennt das Modell 60 → TP = 60, Recall 60 %. Es hat insgesamt 150 Reklamationen vorhergesagt → Precision $\frac{60}{150}$ = 40 %.

### Abgrenzung
FP ist ebenfalls eine positive Vorhersage, aber ein Fehlalarm (Fehler 1. Art).

### Prüfungsfalle
Ohne festgelegte positive Klasse werden TP und TN bzw. FP und FN vertauscht – und alle Kennzahlen kippen.

### Merksatz
TP: Alarm, und zu Recht.

Siehe auch: Richtig negativ · Falsch positiv · Recall · Precision · Konfusionsmatrix
Mehr: Deep Dive 7, 2.1

## Richtigkeit
<!-- id: richtigkeit · quellen: DD10 2.1 · stand: 2026-10 -->

Grundsatz der DSGVO (Art. 5 Abs. 1 lit. d): Personenbezogene Daten müssen sachlich richtig und erforderlichenfalls auf dem neuesten Stand sein; unrichtige Daten sind unverzüglich zu löschen oder zu berichtigen.

### Erklärung
Der Grundsatz macht Datenqualität zur gesetzlichen Pflicht: Wer mit falschen Daten über Menschen entscheidet, verstößt gegen die DSGVO. Ihm entspricht das Betroffenenrecht auf **Berichtigung** (Art. 16). Praktisch umgesetzt wird er mit Validierungsregeln, Aktualitätsprüfungen und Prozessen für Korrekturen.

### Beispiel
Ein Kunde meldet seine neue Adresse, im CRM wird sie geändert, im Shop nicht. Mahnungen gehen an die alte Anschrift – ein Verstoß gegen den Grundsatz der Richtigkeit und zugleich ein Konsistenzproblem.

### Abgrenzung
In der Datenqualität heißen die entsprechenden Dimensionen Korrektheit und Aktualität; der DSGVO-Grundsatz gilt nur für personenbezogene Daten.

### Prüfungsfalle
Richtigkeit verlangt nicht, alle Daten ständig zu aktualisieren – nur „erforderlichenfalls“, gemessen am Zweck der Verarbeitung.

### Merksatz
Datenqualität ist im Datenschutz Pflicht, nicht Kür.

Siehe auch: Korrektheit · Aktualität · Rechenschaftspflicht · Zweckbindung · Datenminimierung
Mehr: Deep Dive 10, 2.1 · Deep Dive 9, Teil 1

## Risikomanagement
<!-- id: risikomanagement · quellen: Karte DD12, DD12 1.4 · stand: 2026-10 -->

Systematischer Umgang mit Projektrisiken: identifizieren, bewerten, Maßnahmen festlegen und laufend überwachen.

### Erklärung
Bewertet wird meist mit dem **Risikowert** = Eintrittswahrscheinlichkeit × Schadenshöhe, je auf einer Skala von 1 bis 5, dargestellt in einer Risikomatrix. Vier Strategien: **vermeiden** (Ursache ausschalten), **vermindern** (Wahrscheinlichkeit oder Schaden senken), **übertragen** (Versicherung, Vertrag), **akzeptieren** (bewusst tragen, mit Rückfallplan).

### Beispiel
Risiko „Shopdaten sind zum Projektstart nicht freigegeben“: W = 4, S = 4, Risikowert 16 → hoch. Maßnahme vermindern: Freigabe in der ersten Projektwoche mit dem Datenschutzbeauftragten klären, Testdaten als Rückfallplan vorbereiten.

### Abgrenzung
| Verfahren | Faktoren | Bereich |
|---|---|---|
| Projekt-Risikowert | W × S | z. B. 1–25 |
| RPZ der FMEA | A × B × E | 1–1.000 |

### Prüfungsfalle
Risikomanagement endet nicht mit der Liste – ohne Verantwortliche und regelmäßige Überprüfung ist es nur Papier.

### Merksatz
Erkennen, bewerten, handeln, beobachten.

Siehe auch: Risikomatrix · Risikoprioritätszahl · Stakeholderanalyse · FMEA · Projekt
Mehr: Deep Dive 12, 1.4

## Risikomatrix
<!-- id: risikomatrix · quellen: DD12 1.4, DD17 5.3 · stand: 2026-10 -->

Raster aus Eintrittswahrscheinlichkeit und Schadensausmaß, in das Risiken eingeordnet werden; Ampelfarben zeigen, wo Maßnahmen dringend sind.

### Erklärung
Auf einer Achse steht die Wahrscheinlichkeit (W), auf der anderen das Schadensausmaß (S), meist in drei oder fünf Stufen. Jedes Risiko wird als Punkt eingetragen. Rote Felder (hoch/hoch) brauchen sofort Maßnahmen, gelbe werden beobachtet und gemildert, grüne akzeptiert. Die Matrix macht Prioritäten auf einen Blick sichtbar und eignet sich gut für die Projektdokumentation.

### Beispiel
Reporting-Projekt: R1 „Datenquelle fällt aus“ (W hoch, S mittel) und R2 „Schlüsselperson fällt aus“ (W mittel, S hoch) liegen im roten Bereich und bekommen Maßnahmen; R3 „Lizenz kommt verspätet“ (W gering, S mittel) wird beobachtet.

### Abgrenzung
Die Risikomatrix stellt den Projekt-Risikowert W × S dar; die FMEA bewertet mit drei Faktoren (RPZ = A · B · E) und nutzt meist eine Tabelle.

### Prüfungsfalle
Achsen unbeschriftet oder vertauscht – ohne Achsenbeschriftung ist die Matrix wertlos.

### Merksatz
Oben rechts brennt es.

Siehe auch: Risikomanagement · Risikoprioritätszahl · Heatmap · FMEA
Mehr: Deep Dive 12, 1.4 · Deep Dive 17, 5.3

## Risikoprioritätszahl
<!-- id: risikoprioritatszahl · quellen: Karte DD5, DD5 6.4 · stand: 2026-10 -->

Kennzahl der FMEA: $RPZ = A \cdot B \cdot E$ aus Auftreten, Bedeutung und Entdeckung, je auf einer Skala von 1 bis 10, Wertebereich 1 bis 1.000.

### Erklärung
A bewertet, wie wahrscheinlich der Fehler auftritt, B, wie schwer die Folgen wiegen, E, wie wahrscheinlich er **unentdeckt** bleibt. Fehler mit hoher RPZ werden zuerst angegangen, oft ab einer festgelegten Schwelle. Unabhängig davon werden Fehler mit sehr hoher Bedeutung (B ≥ 9) immer betrachtet.

### Beispiel
Reparaturservice, Maßnahmen ab RPZ 125:

| Fehler | A | B | E | RPZ |
|---|---|---|---|---|
| Ersatzteil falsch bestellt | 4 | 6 | 5 | 120 |
| Vorschaden nicht dokumentiert | 3 | 8 | 7 | 168 |

Vorrang hat der Vorschaden ($3 \cdot 8 \cdot 7 = 168$). Eine Fotopflicht in der App senkt E deutlich.

### Abgrenzung
Der Projekt-Risikowert multipliziert nur zwei Faktoren (W × S). Das AIAG-VDA-Handbuch (2019) ersetzt die RPZ durch die Aufgabenpriorität, weil gleiche RPZ sehr unterschiedliche Risiken beschreiben können.

### Prüfungsfalle
Bei E bedeutet ein **hoher** Wert eine **schlechte** Entdeckung – ein Fehler, der sicher auffällt, bekommt E = 1.

### Merksatz
Auftreten mal Bedeutung mal Unentdecktbleiben.

Siehe auch: FMEA · Aufgabenpriorität (FMEA) · Risikomanagement · Risikomatrix · Six Sigma
Mehr: Deep Dive 5, 6.4

## RMSE
<!-- id: rmse · quellen: Karte DD7, DD7 Teil 3 · stand: 2026-10 -->

Root Mean Squared Error: Wurzel aus dem mittleren quadratischen Fehler, $\text{RMSE} = \sqrt{\frac{\sum (y - \hat{y})^2}{n}}$.

### Erklärung
Durch das Quadrieren zählen große Fehler überproportional; durch die Wurzel steht das Ergebnis wieder in der Einheit der Zielgröße. Der RMSE ist stets mindestens so groß wie der MAE – gleich groß nur, wenn alle Fehlerbeträge identisch sind. Je weiter beide auseinanderliegen, desto ungleichmäßiger sind die Fehler verteilt.

### Beispiel
Fehler einer Umsatzprognose (T€): +10, −6, +6, −2, +2.
Quadrate: 100 + 36 + 36 + 4 + 4 = 180 → $\text{MSE} = \frac{180}{5} = 36$, $\text{RMSE} = \sqrt{36} = 6{,}00$ T€.
Zum Vergleich: $\text{MAE} = \frac{26}{5} = 5{,}20$ T€ – der große Fehler +10 hebt den RMSE.

### Abgrenzung
| Maß | Einheit | Eigenschaft |
|---|---|---|
| MAE | wie y | robust, leicht erklärbar |
| MSE | y² | große Fehler stark gewichtet |
| RMSE | wie y | große Fehler stark gewichtet |
| R² | ohne | Anteil erklärter Streuung |

### Prüfungsfalle
Die Wurzel wird aus dem Mittel der Quadrate gezogen, nicht aus jedem einzelnen Fehler – sonst kommt der MAE heraus.

### Merksatz
RMSE bestraft große Ausrutscher.

Siehe auch: MAE · MSE · MAPE · R² · Residuum
Mehr: Deep Dive 7, Teil 3

## Robust
<!-- id: robust · quellen: Karte DD3, DD3 Teil 3 · stand: 2026-10 -->

Eine statistische Kennzahl ist robust, wenn einzelne Ausreißer sie kaum verändern.

### Erklärung
Robust sind Kennzahlen, die auf Rangpositionen statt auf allen Werten beruhen: Median, Quartile und Interquartilsabstand. Empfindlich sind arithmetisches Mittel, Spannweite, Varianz und Standardabweichung, weil jeder Wert – auch ein extremer – voll eingeht. Bei schiefen Verteilungen oder Daten mit Erfassungsfehlern beschreibt eine robuste Kennzahl die typische Situation besser.

### Beispiel
Lieferzeiten 2, 3, 3, 4, 5, 5, 5, 6, 8, 19 Tage: Mittelwert 6,0, Median 5,0. Wird aus der 19 eine 90, steigt der Mittelwert auf $\frac{131}{10} = 13{,}1$, der Median bleibt 5,0; der IQR bleibt 3, die Spannweite springt von 17 auf 88.

### Abgrenzung
| robust | ausreißerempfindlich |
|---|---|
| Median, Quartile, IQR | Mittelwert, Spannweite, Varianz, Standardabweichung |
| 1,5-IQR-Regel | z-Wert-Regel |

### Prüfungsfalle
„Robust“ heißt nicht „besser“ – der Mittelwert nutzt alle Informationen und ist bei symmetrischen Daten ohne Ausreißer die genauere Lageangabe.

### Merksatz
Ein Ausreißer verschiebt den Mittelwert, nicht den Median.

Siehe auch: Median · Interquartilsabstand (IQR) · Ausreißer · Arithmetisches Mittel · Spannweite
Mehr: Deep Dive 3, Teil 3 · Deep Dive 3, 4.2

## Robustheit gegen Benutzungsfehler
<!-- id: robustheit-gegen-benutzungsfehler · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Interaktionsprinzip der ISO 9241-110: Das System verhindert Benutzungsfehler oder lässt sie mit geringem Aufwand korrigieren.

### Erklärung
Trotz fehlerhafter Eingaben soll das beabsichtigte Ergebnis mit keinem oder minimalem Korrekturaufwand erreichbar sein. Mittel sind Eingabeprüfung, verständliche Fehlermeldungen mit Lösungshinweis, Rückgängig-Funktionen und Sicherheitsabfragen vor folgenschweren Aktionen. In der Fassung von 2006 hieß das Prinzip noch „Fehlertoleranz“.

### Beispiel
Im Dashboard des Möbelhauses wählt jemand ein Enddatum vor dem Startdatum. Statt einer leeren Grafik erscheint der Hinweis „Enddatum liegt vor dem Startdatum“, und das Feld wird markiert.

### Abgrenzung
| Prinzip | Kern |
|---|---|
| Robustheit gegen Benutzungsfehler | Fehler verhindern oder leicht korrigieren |
| Steuerbarkeit | Nutzer bestimmt Ablauf und Tempo |
| Selbstbeschreibungsfähigkeit | jederzeit klar, wo man ist |

### Prüfungsfalle
Den alten Namen „Fehlertoleranz“ als aktuelles Prinzip nennen – seit der Neufassung 2020 gilt die neue Bezeichnung.

### Merksatz
Gute Software fängt Fehler ab, bevor sie Schaden anrichten.

Siehe auch: Interaktionsprinzipien · Steuerbarkeit · Erwartungskonformität · Gebrauchstauglichkeit · Plausibilitätsprüfung
Mehr: Deep Dive 11, A5

## ROC-Kurve
<!-- id: roc-kurve · quellen: Karte DD7, DD7 4.4, DD17 6.10 · stand: 2026-10 -->

Receiver Operating Characteristic: Kurve, die für alle Entscheidungsschwellen die Richtig-Positiv-Rate (Recall) gegen die Falsch-Positiv-Rate abträgt.

### Erklärung
Ein Klassifikator liefert zunächst einen Score; erst die Schwelle macht daraus „positiv“ oder „negativ“, und jede Schwelle ergibt eine eigene Konfusionsmatrix. Die ROC-Kurve zeigt alle auf einmal: Punkt (0 | 0) heißt nie Alarm, (1 | 1) immer Alarm, oben links (0 | 1) wäre perfekt. Die Diagonale entspricht Raten. Die Fläche darunter (**AUC**) fasst die Trennschärfe zusammen: 1 perfekt, 0,5 Zufall.

### Beispiel
Reklamationsmodell bei Schwelle 50 %: FPR = $\frac{90}{900}$ = 10 %, Recall = 60 % → Punkt (0,10 | 0,60), deutlich über der Diagonale.

### Abgrenzung
Die AUC ist schwellenunabhängig und gut zum Modellvergleich; welche Schwelle im Betrieb gilt, entscheiden die Kosten von FP und FN. Bei stark unausgeglichenen Klassen ist die Precision-Recall-Kurve aussagekräftiger.

### Prüfungsfalle
Auf der x-Achse steht die Falsch-Positiv-Rate (1 − Spezifität), nicht die Precision.

### Merksatz
Je näher an der linken oberen Ecke, desto besser.

Siehe auch: AUC · Falsch-Positiv-Rate · Recall · Spezifität · Konfusionsmatrix
Mehr: Deep Dive 7, 4.4 · Deep Dive 17, 6.10

## ROLAP / MOLAP
<!-- id: rolap-molap · quellen: Karte DD8, DD8 4.5 · stand: 2026-10 -->

Speicherformen für OLAP-Würfel: ROLAP bildet den Würfel relational auf dem Star-Schema ab, MOLAP speichert ihn vorberechnet in einer eigenen multidimensionalen Struktur; HOLAP mischt beide.

Auch: ROLAP

### Erklärung
**ROLAP** (relationales OLAP) übersetzt jede Würfelabfrage in SQL auf Fakten- und Dimensionstabellen – skaliert gut und nutzt vorhandene Datenbanken, ist aber bei großen Aggregationen langsamer. **MOLAP** (multidimensionales OLAP) berechnet Aggregate im Voraus – sehr schnelle Antworten, aber speicherintensiv und mit Ladezeit für die Vorberechnung. **HOLAP** hält Detaildaten relational und Aggregate multidimensional.

### Beispiel
Das Controlling des Möbelhauses braucht Quartalssummen je Filiale und Kategorie in Sekunden → MOLAP-Würfel; seltene Detailauswertungen einzelner Belege laufen per ROLAP direkt auf dem Star-Schema.

### Abgrenzung
| | ROLAP | MOLAP |
|---|---|---|
| Speicherung | relationale Tabellen | multidimensionaler Würfel |
| Geschwindigkeit | geringer | sehr hoch |
| Speicherbedarf | gering | hoch |

### Prüfungsfalle
ROLAP und MOLAP sind Speicherformen, keine OLAP-Operationen wie Drill-down oder Slice.

### Merksatz
R wie relational, M wie multidimensional vorberechnet.

Siehe auch: OLAP-Würfel · Star-Schema · HOLAP · OLAP · Drill-down
Mehr: Deep Dive 8, 4.5

## Roll-up
<!-- id: roll-up · quellen: Karte DD8, DD8 4.5 · stand: 2026-10 -->

OLAP-Operation, die Daten entlang einer Hierarchie auf eine gröbere Stufe verdichtet, z. B. Monat → Quartal → Jahr.

### Erklärung
Beim Roll-up (auch Drill-up) werden die Kennzahlen der feineren Ebene zusammengefasst, meist summiert. Voraussetzung ist eine Dimensionshierarchie (Tag – Monat – Quartal – Jahr, Filiale – Region – Land). Es ist die Gegenoperation zum Drill-down.

### Beispiel
Der Umsatzbericht zeigt Werte je Filiale. Ein Roll-up auf die Region fasst Hamburg und Bremen zu „Nord“ zusammen; ein weiterer Roll-up zeigt den Gesamtumsatz für Deutschland.

### Abgrenzung
| Operation | Wirkung |
|---|---|
| Roll-up | gröber verdichten |
| Drill-down | feiner aufschlüsseln |
| Slice | eine Dimension auf einen Wert festlegen |
| Dice | mehrere Dimensionen auf Bereiche einschränken |
| Pivot | Achsen tauschen |

### Prüfungsfalle
Nicht jede Kennzahl lässt sich einfach summieren: Lagerbestände oder Durchschnittspreise ergeben beim Roll-up über die Zeit unsinnige Summen.

### Merksatz
Roll-up rollt die Details zusammen.

Siehe auch: Drill-down · Slice · Dice · OLAP-Würfel · Granularität
Mehr: Deep Dive 8, 4.5

## Rollen
<!-- id: rollen · quellen: DD12 Teil 2 · stand: 2026-10 -->

In Scrum die drei Verantwortlichkeiten des Scrum Teams: Product Owner, Scrum Master und Developers.

### Erklärung
Der **Product Owner** verantwortet den Wert des Produkts und die Reihenfolge im Product Backlog. Der **Scrum Master** verantwortet die Einführung von Scrum und die Effektivität des Teams, beseitigt Hindernisse und führt dienend, nicht als Vorgesetzter. Die **Developers** erstellen selbstmanagend in jedem Sprint ein nutzbares Inkrement. Der Scrum Guide 2020 spricht statt von Rollen von Verantwortlichkeiten (accountabilities) und kennt keine Unterteams oder Hierarchien.

### Beispiel
Im Reporting-Projekt ist die Leiterin Controlling Product Owner, eine Kollegin aus der IT Scrum Master, drei Datenanalysten sind Developers.

### Abgrenzung
Kanban schreibt keine Rollen vor. Klassische Projekte haben Projektleitung und Lenkungsausschuss – einen weisungsbefugten Projektleiter kennt Scrum nicht.

### Prüfungsfalle
„Entwicklungsteam“ stammt aus dem Scrum Guide 2017; aktuell heißt es Developers – und der Scrum Master ist nicht der Chef des Teams.

### Merksatz
Was gebaut wird (Product Owner), wie gearbeitet wird (Scrum Master), wer baut (Developers).

Siehe auch: Product Owner · Scrum Master · Developers · Scrum · Product Backlog
Mehr: Deep Dive 12, Teil 2

## RPO
<!-- id: rpo · quellen: Karte DD10, DD10 4.4, DD10 5.4 · stand: 2026-10 -->

Recovery Point Objective: maximal tolerierbarer Datenverlust, angegeben als Zeitraum vor dem Ausfall – er bestimmt die Sicherungsfrequenz.

### Erklärung
Das RPO beantwortet: Bis zu welchem Zeitpunkt müssen Daten nach einem Ausfall mindestens wiederherstellbar sein? Ein RPO von 24 Stunden erlaubt eine nächtliche Sicherung; ein RPO von 15 Minuten verlangt häufige Sicherungen oder Replikation. Festgelegt wird es in der Business-Impact-Analyse je Geschäftsprozess.

### Beispiel
Der Onlineshop verarbeitet laufend Bestellungen; mehr als eine Stunde Bestellungen darf nicht verloren gehen → RPO = 1 Stunde, also mindestens stündliche Sicherung oder Replikation. Für das Dashboard genügt ein RPO von 24 Stunden.

### Abgrenzung
| Kennzahl | Frage | bestimmt |
|---|---|---|
| RPO | Wie viel Datenverlust ist tolerierbar? | Sicherungsfrequenz |
| RTO | Wie lange darf die Wiederherstellung dauern? | Verfahren, Infrastruktur |

### Prüfungsfalle
RPO und RTO werden vertauscht – P wie Point: der Zeitpunkt der letzten nutzbaren Daten.

### Merksatz
RPO: Wie weit darf ich zurückfallen?

Siehe auch: RTO · Business-Impact-Analyse · Generationenprinzip (Großvater-Vater-Sohn) · Inkrementelle Sicherung · Notfallmanagement
Mehr: Deep Dive 10, 4.4 · Deep Dive 10, 5.4

## RTO
<!-- id: rto · quellen: Karte DD10, DD10 4.4, DD10 5.4 · stand: 2026-10 -->

Recovery Time Objective: maximal tolerierbare Dauer vom Ausfall bis zur Wiederherstellung eines Systems oder Prozesses – sie bestimmt Verfahren und Infrastruktur.

### Erklärung
Das RTO beantwortet: Wie lange darf der Prozess stillstehen? Ein RTO von mehreren Tagen erlaubt eine Rücksicherung vom Band auf neue Hardware; ein RTO von Minuten verlangt Hochverfügbarkeit, Standby-Systeme oder ein Ausweichrechenzentrum. Wie das RPO wird es in der Business-Impact-Analyse festgelegt und im Notfallhandbuch umgesetzt.

### Beispiel
Fällt der Shop aus, verliert das Möbelhaus Umsatz – RTO 2 Stunden, also Cluster mit Standby-Server. Das Monatsreporting darf zwei Tage ausfallen – RTO 48 Stunden, eine Rücksicherung aus dem Backup genügt.

### Abgrenzung
Das RTO ist eine interne Anforderung des Unternehmens; die Wiederherstellungszeit im SLA ist die vertragliche Zusage des Dienstleisters und muss zum RTO passen.

### Prüfungsfalle
Eine schnelle Sicherung sagt nichts über das RTO – entscheidend ist, wie lange die Rücksicherung dauert, und das muss regelmäßig getestet werden.

### Merksatz
RTO: Wie lange darf ich stillstehen?

Siehe auch: RPO · Business-Impact-Analyse · Disaster Recovery · Wiederherstellungszeit · Hochverfügbarkeit
Mehr: Deep Dive 10, 4.4 · Deep Dive 10, 5.4

## Rückwärtsrechnung
<!-- id: ruckwartsrechnung · quellen: Karte DD12, DD12 3.2 · stand: 2026-10 -->

Teil der Netzplanrechnung, der vom Projektende aus für jeden Vorgang den spätesten Endzeitpunkt (SEZ) und spätesten Anfangszeitpunkt (SAZ) bestimmt.

### Erklärung
Ausgangspunkt ist die Projektdauer aus der Vorwärtsrechnung: Der letzte Vorgang erhält SEZ = Projektende. Dann gilt $\text{SAZ} = \text{SEZ} - \text{Dauer}$, und das SEZ eines Vorgangs ist das **kleinste** SAZ aller Nachfolger. Aus Vorwärts- und Rückwärtsrechnung ergeben sich Gesamtpuffer ($\text{SAZ} - \text{FAZ}$) und kritischer Pfad.

### Beispiel
A (3 Tage) → B (4) und C (2), B und C → D (1). Vorwärts ergibt sich eine Projektdauer von 8 Tagen.
Rückwärts: D: SEZ 8, SAZ 7, B: SEZ 7, SAZ 3, C: SEZ 7, SAZ 5, A: SEZ = min(3; 5) = 3, SAZ 0.
C hat FAZ 3 und SAZ 5 → Gesamtpuffer 2 Tage; A–B–D ist der kritische Pfad (Puffer 0).

### Abgrenzung
Vorwärtsrechnung: FAZ = **größtes** FEZ der Vorgänger. Rückwärtsrechnung: SEZ = **kleinstes** SAZ der Nachfolger.

### Prüfungsfalle
Rückwärts das Maximum statt des Minimums nehmen – dann stimmen alle Puffer nicht mehr.

### Merksatz
Vorwärts das Maximum, rückwärts das Minimum.

Siehe auch: Vorwärtsrechnung · Gesamtpuffer · Kritischer Pfad · SAZ · SEZ
Mehr: Deep Dive 12, 3.2

## Ausgelassen
- Rangfolge – Tabellenetikett Diagrammwahl
- Regel für Zeitreihen – Abschnittsetikett Visualisierung
- Regelmäßige Qualitätsmessung – Listenpunkt Governance
- Residuen prüfen – Teil von Residuum
- Ressourcen – Teil von REST-API
- Richtung – Tabellenetikett Streudiagramm
- RTO und RPO – Doppeleintrag, Einzelseiten
