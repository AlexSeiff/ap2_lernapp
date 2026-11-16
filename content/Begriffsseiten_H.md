<!-- Begriffsseiten H · Stand 2026-10 -->
## Handelsregister
<!-- id: handelsregister · quellen: Karte DD14, DD14 3.1 · stand: 2026-10 -->

Öffentliches, elektronisch beim Amtsgericht geführtes Register der Kaufleute; Abteilung A für Einzelkaufleute und Personengesellschaften, Abteilung B für Kapitalgesellschaften.

### Erklärung
Eingetragen werden u. a. Firma, Sitz, Rechtsform, Inhaber bzw. Geschäftsführer, Prokura und Stammkapital. Jeder kann das Register einsehen; Eintragungen genießen öffentlichen Glauben. Die Wirkung ist unterschiedlich: Beim Istkaufmann bestätigt die Eintragung nur, was ohnehin gilt (**deklaratorisch**); bei Kannkaufmann, GmbH und AG begründet sie die Kaufmannseigenschaft bzw. die Gesellschaft (**konstitutiv**). Anmeldungen müssen öffentlich beglaubigt sein.

### Abgrenzung
| Abteilung | Wer | Beispiel |
|---|---|---|
| A | Einzelkaufleute, OHG, KG | Weber e.K., GmbH & Co. KG |
| B | Kapitalgesellschaften | GmbH, UG, AG |

Die GbR steht nicht im Handelsregister; seit 2024 kann sie sich ins **Gesellschaftsregister** eintragen lassen (eGbR).

### Beispiel
Die Möbelhaus Nordholz GmbH steht in Abteilung B; die Erteilung einer Prokura an den Vertriebsleiter wird dort ebenfalls eingetragen.

### Prüfungsfalle
Die Eintragung der GmbH für bloß deklaratorisch halten – vor der Eintragung gibt es die GmbH als solche nicht.

### Merksatz
A für Personen, B für Kapital.

Siehe auch: Istkaufmann · Kannkaufmann · Formkaufmann · Firma · Prokura
Mehr: Deep Dive 14, 3.1

## Handlungsvollmacht
<!-- id: handlungsvollmacht · quellen: Karte DD14, DD14 3.3 · stand: 2026-10 -->

Vollmacht für die gewöhnlichen Geschäfte eines Betriebs (§ 54 HGB) – als allgemeine Handlungsvollmacht, Art- oder Einzelvollmacht; formfrei, ohne Handelsregistereintrag.

### Erklärung
Die allgemeine Handlungsvollmacht umfasst alle Geschäfte, die der Betrieb **dieses** Handelsgewerbes gewöhnlich mit sich bringt; die Artvollmacht eine bestimmte Art (z. B. Einkauf), die Einzelvollmacht ein einzelnes Geschäft. Ohne besondere Befugnis sind ausgeschlossen: Grundstücke veräußern oder belasten, Wechselverbindlichkeiten eingehen, Darlehen aufnehmen, Prozesse führen (§ 54 Abs. 2 HGB). Gezeichnet wird mit „i. V.“ (allgemeine) bzw. „i. A.“.

### Abgrenzung
| | Prokura | Handlungsvollmacht |
|---|---|---|
| Umfang | Geschäfte **irgendeines** Handelsgewerbes | gewöhnliche Geschäfte **dieses** Betriebs |
| Erteilung | ausdrücklich durch den Kaufmann | formfrei, auch stillschweigend |
| Eintragung | Handelsregister | keine |
| Kredit aufnehmen | ja | nein (ohne besondere Befugnis) |
| Zeichnung | ppa. | i. V. / i. A. |

### Beispiel
Die Einkaufsleiterin des Möbelhauses bestellt mit Artvollmacht Ware beim Lieferanten – zulässig. Einen Bankkredit für ein neues Lager darf sie ohne besondere Befugnis nicht aufnehmen.

### Merksatz
Handlungsvollmacht: das Gewöhnliche; Prokura: fast alles.

Siehe auch: Prokura · Handelsregister · Firma · Istkaufmann
Mehr: Deep Dive 14, 3.3

## Harmonisieren
<!-- id: harmonisieren · quellen: Karte DD8, DD8 3.1 · stand: 2026-10 -->

Transformationsschritt im ETL, der Schlüssel und Bezeichnungen verschiedener Quellsysteme zusammenführt, sodass dieselbe Realweltentität überall gleich identifiziert wird.

### Erklärung
Quellsysteme vergeben eigene Nummernkreise und Codes: Der Kunde heißt im CRM „4711“, in der Warenwirtschaft „K-1001“; ein Status heißt einmal „erl.“, einmal „abgeschlossen“. Beim Harmonisieren werden Zuordnungstabellen (Mapping) gepflegt und im DWH ein eigener Surrogatschlüssel vergeben. Erst danach lassen sich Daten aus mehreren Systemen gemeinsam auswerten – das Merkmal „integriert“ eines Data Warehouse nach Inmon.

### Beispiel
| Quelle | Quellschlüssel | DWH-Schlüssel kunde_sk |
|---|---|---|
| CRM | 4711 | 1 |
| Warenwirtschaft | K-1001 | 1 |

Umsatz (Warenwirtschaft) und Kontakthistorie (CRM) der Huber GmbH hängen danach am selben Kunden.

### Abgrenzung
**Vereinheitlichen** gleicht Formate an (Datum, Währung, Einheit); Harmonisieren führt Schlüssel und Codes zusammen; **Bereinigen** behandelt fehlende Werte, Dubletten, Ausreißer.

### Merksatz
Harmonisieren: ein Kunde, ein Schlüssel – egal aus welchem System.

Siehe auch: T – Transform · Vereinheitlichen · Surrogatschlüssel · Conformed Dimensions · Golden Record
Mehr: Deep Dive 8, 3.1

## Härtung
<!-- id: hartung · quellen: Karte DD10, DD10 5.3 · stand: 2026-10 -->

Präventive Sicherheitsmaßnahme: unnötige Dienste, Konten, Ports und Funktionen abschalten, um die Angriffsfläche eines Systems zu verkleinern.

### Erklärung
Jeder laufende Dienst und jedes Konto ist ein möglicher Angriffspunkt. Zur Härtung gehören außerdem das Ändern von Standardpasswörtern, restriktive Rechte, sichere Konfiguration (z. B. nur TLS-verschlüsselte Protokolle) und das Entfernen von Beispieldaten und Testzugängen. Härtung wird oft nach Vorlagen wie den BSI-Grundschutz-Bausteinen oder CIS-Benchmarks durchgeführt und durch Patchmanagement ergänzt.

### Beispiel
Der neue Datenbankserver für das Reporting: Fernwartungsdienst und FTP deaktivieren, Standardkonto „admin“ löschen, Datenbankport nur für den Applikationsserver freigeben, Auswertungskonto nur mit Leserechten.

### Abgrenzung
**Patchmanagement** schließt bekannte Lücken in vorhandener Software; Härtung entfernt, was gar nicht gebraucht wird. Die Firewall filtert Verbindungen von außen, Härtung wirkt auf dem System selbst.

### Merksatz
Was nicht läuft, kann nicht angegriffen werden.

Siehe auch: Patchmanagement · Firewall · Least Privilege · IT-Grundschutz · Security by Design
Mehr: Deep Dive 10, 5.3

## Hashing
<!-- id: hashing · quellen: Karte DD10, DD10 4.2 · stand: 2026-11 -->

Einwegfunktion, die aus beliebigen Daten einen Wert fester Länge berechnet, der sich nicht umkehren lässt; dient der Integritätsprüfung und der Passwortspeicherung.

### Erklärung
Schon eine winzige Änderung der Eingabe ergibt einen völlig anderen Hashwert; so fallen Manipulationen auf. SHA-256 liefert z. B. immer 256 Bit (64 Hexadezimalzeichen). Eine gute kryptografische Hashfunktion ist
- **preimage-resistent:** Aus dem Hash lässt sich die Eingabe nicht berechnen (Einweg),
- **second-preimage-resistent:** Zu einer gegebenen Eingabe findet man keine zweite mit demselben Hash,
- **kollisionsresistent:** Man findet überhaupt keine zwei verschiedenen Eingaben mit gleichem Hash.

Bei MD5 und SHA-1 sind Kollisionen praktisch erzeugbar – sie gelten für Sicherheitszwecke als unsicher.

**Passwörter** speichert man gehasht mit einem **Salt** (Zufallswert je Passwort), damit gleiche Passwörter verschiedene Hashes ergeben und vorberechnete Tabellen nutzlos sind. Optional kommt ein **Pepper** hinzu, ein geheimer Wert, getrennt von der Datenbank aufbewahrt. Entscheidend ist ein **langsames, einstellbares Verfahren** (Argon2id, bcrypt, scrypt oder PBKDF2 mit hoher Iterationszahl): Der **Work Factor** (Rechen- bzw. Speicheraufwand) wird so gewählt, dass ein einzelner Login kaum auffällt, Brute Force aber unbezahlbar wird, und wird mit stärkerer Hardware erhöht. Ein schneller Hash wie SHA-256 allein ist für Passwörter ungeeignet, weil Angreifer damit enorm viele Versuche pro Sekunde schaffen.

### Beispiel
Nach dem Export einer CSV an den Steuerberater wird der SHA-256-Wert der Datei mitgeschickt. Der Empfänger berechnet ihn erneut – stimmen beide überein, ist die Datei unverändert.

### Abgrenzung
**Verschlüsselung** ist mit dem Schlüssel umkehrbar und schützt die Vertraulichkeit; Hashing ist nicht umkehrbar und schützt die Integrität. Die digitale Signatur verschlüsselt (signiert) den Hash mit dem privaten Schlüssel. Ein einfacher Hash beweist keine Herkunft: Wer die Datei ändert, kann den Hash gleich mitändern – dafür braucht man eine Signatur oder einen schlüsselbasierten Hash (HMAC).

### Prüfungsfalle
„Passwörter werden verschlüsselt gespeichert“ – richtig ist: gehasht mit Salt und mit einem langsamen Verfahren (Argon2id, bcrypt …), nicht mit SHA-256 allein.

### Merksatz
Hashing hat keinen Rückweg.

Siehe auch: Salt · Digitale Signatur · Integrität · Symmetrische Verschlüsselung · Pseudonymisierung
Mehr: Deep Dive 10, 4.2

## HAVING
<!-- id: having · quellen: Karte DD1, SQL-Zusatz 3.1, DD1 2.1 · stand: 2026-10 -->

SQL-Klausel, die **Gruppen nach** GROUP BY filtert; die Bedingung darf Aggregatfunktionen enthalten (z. B. `HAVING COUNT(*) > 5`).

### Erklärung
Logische Reihenfolge: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. WHERE wirkt auf einzelne Zeilen, bevor Gruppen existieren, und darf deshalb keine Aggregatfunktion enthalten. HAVING wirkt auf die fertigen Gruppen. Bedingungen ohne Aggregat gehören aus Effizienzgründen ins WHERE.

### Beispiel
```sql
SELECT ort, COUNT(*) AS anzahl_kunden
FROM kunde
WHERE registriert_am >= '2024-01-01'   -- Zeilenfilter
GROUP BY ort
HAVING COUNT(*) >= 2;                  -- Gruppenfilter
```
DataFit-Daten: Köln 2, Hamburg 2; München (1) fällt durch HAVING heraus.

### Abgrenzung
| | WHERE | HAVING |
|---|---|---|
| filtert | Zeilen | Gruppen |
| Zeitpunkt | vor GROUP BY | nach GROUP BY |
| Aggregatfunktionen | nein | ja |

### Prüfungsfalle
`WHERE COUNT(*) > 1` schreiben – syntaktisch falsch, weil es zu diesem Zeitpunkt noch keine Gruppen gibt.

### Merksatz
WHERE vor, HAVING nach der Gruppierung.

Siehe auch: GROUP BY · WHERE · Fensterfunktion · Unterabfrage
Mehr: Deep Dive 1, 2.1 · SQL-Zusatz, 3.1

## HDFS
<!-- id: hdfs · quellen: Karte DD8, DD8 5.2 · stand: 2026-10 -->

Hadoop Distributed File System: verteiltes Dateisystem von Apache Hadoop, das große Dateien in Blöcke zerlegt und redundant auf viele Knoten verteilt.

### Erklärung
Ein zentraler NameNode verwaltet, welcher Block wo liegt; DataNodes speichern die Blöcke. Standardmäßig ist ein Block 128 MB groß und wird dreifach repliziert, sodass der Ausfall einzelner Knoten keine Daten kostet. Verarbeitet werden die Daten dort, wo sie liegen (MapReduce, Spark): Die Berechnung wandert zu den Daten. HDFS ist auf großes Datenvolumen und sequenzielles Lesen ausgelegt, nicht auf viele kleine Änderungen.

### Beispiel
Fünf Jahre Klick- und Kassendaten des Möbelhauses (mehrere Terabyte) liegen als Parquet-Dateien im HDFS eines Clusters mit zehn Knoten; eine Spark-Auswertung liest je Knoten nur die lokalen Blöcke.

### Abgrenzung
HDFS ist ein Dateisystem, keine Datenbank. Es skaliert **horizontal** (mehr Knoten), ein klassischer Datenbankserver meist vertikal.

### Merksatz
HDFS: große Dateien, in Blöcken, dreifach verteilt.

Siehe auch: MapReduce · Apache Spark · Big Data · Horizontale Skalierung · Data Lake
Mehr: Deep Dive 8, 5.2

## Heatmap
<!-- id: heatmap · quellen: Karte DD11, DD11 A1, DD17 6.9 · stand: 2026-10 -->

Matrixdarstellung, in der Werte als Farbintensität codiert werden – z. B. Umsatz je Filiale und Monat; macht Muster in zwei Dimensionen sichtbar.

### Erklärung
Zeilen und Spalten sind zwei kategoriale oder zeitliche Merkmale, die Zellenfarbe zeigt die Kennzahl. Für geordnete Werte passt eine **sequenzielle** Skala (hell → dunkel in einem Farbton), für Abweichungen von einem Bezugswert eine divergierende. Eine Legende oder Zahlen in den Zellen sind Pflicht; Rot-Grün-Skalen sind für Farbfehlsichtige ungeeignet.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 120" width="280" height="120" role="img" aria-label="Heatmap Auftragseingang je Wochentag und Tageszeit">
<text x="85" y="14" text-anchor="middle" class="dg-klein">Mo</text>
<text x="145" y="14" text-anchor="middle" class="dg-klein">Mi</text>
<text x="205" y="14" text-anchor="middle" class="dg-klein">Sa</text>
<text x="50" y="40" text-anchor="end" dominant-baseline="middle" class="dg-klein">vormittags</text>
<text x="50" y="72" text-anchor="end" dominant-baseline="middle" class="dg-klein">nachmittags</text>
<text x="50" y="104" text-anchor="end" dominant-baseline="middle" class="dg-klein">abends</text>
<rect x="55" y="24" width="60" height="32" class="dg-akzent" opacity="0.9"/>
<rect x="115" y="24" width="60" height="32" class="dg-akzent" opacity="0.4"/>
<rect x="175" y="24" width="60" height="32" class="dg-akzent" opacity="0.7"/>
<rect x="55" y="56" width="60" height="32" class="dg-akzent" opacity="0.5"/>
<rect x="115" y="56" width="60" height="32" class="dg-akzent" opacity="0.3"/>
<rect x="175" y="56" width="60" height="32" class="dg-akzent" opacity="1"/>
<rect x="55" y="88" width="60" height="32" class="dg-akzent" opacity="0.2"/>
<rect x="115" y="88" width="60" height="32" class="dg-akzent" opacity="0.2"/>
<rect x="175" y="88" width="60" height="32" class="dg-akzent" opacity="0.5"/>
<text x="85" y="41" text-anchor="middle" dominant-baseline="middle" class="dg-klein">42</text>
<text x="145" y="41" text-anchor="middle" dominant-baseline="middle" class="dg-klein">18</text>
<text x="205" y="41" text-anchor="middle" dominant-baseline="middle" class="dg-klein">33</text>
<text x="85" y="73" text-anchor="middle" dominant-baseline="middle" class="dg-klein">24</text>
<text x="145" y="73" text-anchor="middle" dominant-baseline="middle" class="dg-klein">12</text>
<text x="205" y="73" text-anchor="middle" dominant-baseline="middle" class="dg-klein">47</text>
<text x="85" y="105" text-anchor="middle" dominant-baseline="middle" class="dg-klein">8</text>
<text x="145" y="105" text-anchor="middle" dominant-baseline="middle" class="dg-klein">9</text>
<text x="205" y="105" text-anchor="middle" dominant-baseline="middle" class="dg-klein">22</text>
</svg>
```

### Beispiel
Reparaturmeldungen je Wochentag und Tageszeit: Die dunkelste Zelle (Samstagnachmittag, 47) zeigt, wann die Serviceannahme personell verstärkt werden sollte.

### Abgrenzung
Ein Liniendiagramm zeigt eine Entwicklung über die Zeit, ein Streudiagramm den Zusammenhang zweier metrischer Merkmale; die Heatmap zeigt Muster in einer Tabelle zweier Dimensionen.

### Merksatz
Heatmap: Tabelle, deren Zahlen man sieht, bevor man sie liest.

Siehe auch: Dashboard · Barrierefreiheit · Liniendiagramm · Streudiagramm
Mehr: Deep Dive 17, 6.9 · Deep Dive 11, A1

## Heteroskedastizität
<!-- id: heteroskedastizitat · quellen: Karte DD4, DD4 2.3 · stand: 2026-11 -->

Die Streuung der Residuen einer Regression ist nicht konstant, sondern ändert sich systematisch mit x oder ŷ – im Residuenplot typisch als Trichter.

### Erklärung
Häufige Ursachen: Größenordnung (große Filialen schwanken absolut stärker als kleine), eine fehlende Einflussgröße oder eine falsche Modellform. Die geschätzte Gerade bleibt dabei im Mittel richtig, aber Standardfehler, p-Werte und Konfidenzintervalle der Koeffizienten werden unzuverlässig, und Prognosen sind nicht überall gleich genau. Gegenmaßnahmen: die Zielgröße transformieren (z. B. logarithmieren, sodass Fehler relativ statt absolut werden), gewichtete Regression, robuste Standardfehler oder das Modell um fehlende Einflussgrößen erweitern. Erkennen: Residuen über ŷ oder x auftragen; ein Trichter oder eine Welle zeigt das Problem.

### Beispiel
Umsatzprognose für fünf Filialen: Der Prognosefehler wächst mit der Größe.

| Filialumsatz (T€) | 50 | 100 | 300 | 1.000 | 3.000 |
|---|---|---|---|---|---|
| Fehlerbetrag (T€) | 2 | 4 | 12 | 40 | 120 |
| Fehler in % | 4 | 4 | 4 | 4 | 4 |

Absolut öffnet sich ein Trichter (2 bis 120 T€), relativ ist der Fehler konstant bei 4 %. Eine Regression auf dem Logarithmus des Umsatzes arbeitet mit solchen relativen Fehlern und ist dort passender.

### Abgrenzung
Das Gegenstück ist die **Homoskedastizität** (gleich breites Band). Heteroskedastizität betrifft die **Streuung** der Residuen, nicht ihren Mittelwert – der ist bei der Kleinste-Quadrate-Geraden immer null.

### Prüfungsfalle
Aus einem Trichter ableiten, die Gerade selbst sei „falsch“: Betroffen ist vor allem die Genauigkeit der Aussagen (Tests, Intervalle). Auch nicht mit Autokorrelation (Muster über die Zeit) verwechseln.

### Merksatz
Hetero = verschieden: Die Fehler streuen mal wenig, mal viel.

Siehe auch: Homoskedastizität · Residuum · Regressionsgerade · MAPE · Regression
Mehr: Deep Dive 4, 2.3

## Histogramm
<!-- id: histogramm · quellen: Karte DD11, DD11 A1, DD17 6.6 · stand: 2026-10 -->

Diagramm aus aneinanderstoßenden Säulen über Klassen eines metrischen Merkmals; zeigt die Form einer Verteilung.

### Erklärung
Auf der x-Achse liegt eine stetige Skala, eingeteilt in Klassen; die Säulen haben keine Lücken. Man erkennt, ob eine Verteilung symmetrisch, schief oder mehrgipflig ist und wo sich die Werte häufen. Bei ungleich breiten Klassen zählt die **Fläche**, nicht die Höhe – sonst verzerrt die Darstellung. Für den Vergleich mehrerer Gruppen eignet sich eher der Boxplot.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 130" width="280" height="130" role="img" aria-label="Histogramm Lieferzeiten, rechtsschief">
<line x1="30" y1="105" x2="270" y2="105" class="dg-linie"/>
<line x1="30" y1="10" x2="30" y2="105" class="dg-linie"/>
<rect x="40" y="35" width="40" height="70" class="dg-akzent"/>
<rect x="80" y="20" width="40" height="85" class="dg-akzent"/>
<rect x="120" y="60" width="40" height="45" class="dg-akzent"/>
<rect x="160" y="85" width="40" height="20" class="dg-akzent"/>
<rect x="200" y="95" width="40" height="10" class="dg-akzent"/>
<text x="40" y="119" text-anchor="middle" class="dg-klein">0</text>
<text x="80" y="119" text-anchor="middle" class="dg-klein">2</text>
<text x="120" y="119" text-anchor="middle" class="dg-klein">4</text>
<text x="160" y="119" text-anchor="middle" class="dg-klein">6</text>
<text x="200" y="119" text-anchor="middle" class="dg-klein">8</text>
<text x="240" y="119" text-anchor="middle" class="dg-klein">10</text>
<text x="262" y="119" text-anchor="start" class="dg-klein dg-leise">Tage</text>
</svg>
```

### Beispiel
Lieferzeiten von 500 Bestellungen in Klassen zu 2 Tagen: Die meisten liegen bei 2 bis 4 Tagen, ein langer Ausläufer reicht nach rechts – die Verteilung ist rechtsschief, der Mittelwert liegt über dem Median.

### Abgrenzung
Das **Säulendiagramm** vergleicht Kategorien (Umsatz je Filiale); seine Säulen stehen mit Abstand, die Reihenfolge ist frei. Das Histogramm zeigt die Verteilung eines metrischen Merkmals, die Klassen sind lückenlos geordnet.

### Merksatz
Histogramm: Säulen ohne Lücken, Verteilung auf einen Blick.

Siehe auch: Säulendiagramm · Boxplot · Klassenbildung · Ungleiche Klassenbreiten · Rechtsschief (linkssteil)
Mehr: Deep Dive 17, 6.6 · Deep Dive 11, A1

## Historisierung
<!-- id: historisierung · quellen: Karte DD8, DD8 4.4 · stand: 2026-10 -->

Änderungen werden nicht überschrieben, sondern mit Gültigkeitszeitraum gespeichert, damit Auswertungen über die Zeit korrekt bleiben.

### Erklärung
Im Data Warehouse geschieht das über **Slowly Changing Dimensions**. Standard ist **SCD Typ 2**: Bei einer Änderung wird eine neue Zeile mit neuem Surrogatschlüssel, gültig_von, gültig_bis und Kennzeichen „aktuell“ angelegt. Fakten verweisen auf die Version, die zum Zeitpunkt des Ereignisses galt. Typ 1 überschreibt (keine Historie), Typ 3 speichert nur den vorherigen Wert in einer Zusatzspalte.

### Beispiel
| kunde_sk | kunde_id | ort | gültig_von | gültig_bis | aktuell |
|---|---|---|---|---|---|
| 1 | K-1001 | München | 01.01.2024 | 14.05.2026 | nein |
| 2 | K-1001 | Hamburg | 15.05.2026 | 31.12.9999 | ja |

Umsätze vor dem Umzug bleiben der Region München zugeordnet.

### Abgrenzung
Operative Systeme haben meist **fehlende Historie**. Auch in Bewegungsdaten wird historisiert: Die Bestellposition speichert den Einzelpreis zum Bestellzeitpunkt statt den aktuellen Produktpreis zu verwenden.

### Prüfungsfalle
Bei SCD Typ 2 den fachlichen Schlüssel als Primärschlüssel behalten – er kommt dann mehrfach vor; nötig ist ein Surrogatschlüssel.

### Merksatz
Historisieren heißt: alte Wahrheit behalten, neue dazulegen.

Siehe auch: Fehlende Historie · Surrogatschlüssel · Data Warehouse · Dimensionstabelle
Mehr: Deep Dive 8, 4.4

## Hochverfügbarkeit
<!-- id: hochverfugbarkeit · quellen: Karte DD16, DD16 4.1, DD16 4.5 · stand: 2026-10 -->

Auslegung eines Systems mit Redundanz, sodass einzelne Ausfälle den Dienst nicht unterbrechen – typischerweise ab 99,99 % Verfügbarkeit.

### Erklärung
Ab wie vielen „Neunen“ man von Hochverfügbarkeit spricht, ist nicht einheitlich (je nach Quelle 99,99 % oder 99,999 %); das BSI ordnet Systeme in Verfügbarkeitsklassen VK 0 bis VK 5 ein. Erreicht wird sie durch Beseitigen jedes **Single Point of Failure**: Cluster, Load Balancer, RAID, USV, doppelte Netzanbindung und bei höchsten Anforderungen Georedundanz. Redundante Komponenten parallel erhöhen die Verfügbarkeit: $V = 1 - (1 - V_1) \cdot (1 - V_2)$.

### Beispiel
99,99 % rund um die Uhr erlauben $8.760\ \text{h} \cdot 0{,}0001 = 0{,}876$ h, also 52,56 Minuten Ausfall im Jahr. Zwei gespiegelte Datenbankserver mit je 99 %: $1 - 0{,}01^2 = 99{,}99\ \%$.

### Abgrenzung
Hochverfügbarkeit schützt vor Ausfällen, nicht vor Datenverlust durch Löschen oder Ransomware – die Fehler werden sofort mitgespiegelt. Dafür braucht es Backups.

### Prüfungsfalle
Verfügbarkeit ohne Bezug auf die vereinbarte Servicezeit angeben (24/7 oder Mo–Fr 8–18 Uhr).

### Merksatz
Jede Neun mehr kostet ein Zehntel der Ausfallzeit – und deutlich mehr Redundanz.

Siehe auch: Verfügbarkeit · Single Point of Failure · Georedundanz · RAID · Verfügbarkeitsklassen
Mehr: Deep Dive 16, 4.1 · Deep Dive 16, 4.5

## HOLAP
<!-- id: holap · quellen: DD8 4.5 · stand: 2026-10 -->

Hybrid OLAP: Speicherform eines OLAP-Würfels, die relationale Speicherung (ROLAP) und vorberechnete multidimensionale Speicherung (MOLAP) kombiniert.

### Erklärung
Typischerweise bleiben die Detaildaten relational im Star-Schema, während häufig benötigte Aggregate (z. B. Umsatz je Monat und Region) in einer multidimensionalen Struktur vorberechnet werden. Abfragen auf verdichteter Ebene sind dadurch schnell wie bei MOLAP, Drill-down bis auf die Einzelzeile bleibt möglich, ohne alles vorzuberechnen.

### Abgrenzung
| Form | Speicherung | Stärke | Schwäche |
|---|---|---|---|
| ROLAP | relational (Star-Schema) | große Datenmengen, aktuell | langsamere Aggregation |
| MOLAP | vorberechneter Würfel | sehr schnell | speicherintensiv, Ladezeit |
| HOLAP | Aggregate MOLAP, Details ROLAP | Kompromiss | komplexer |

### Beispiel
Das Management-Dashboard zeigt Quartalsumsätze je Region aus dem vorberechneten Würfel; ein Drill-down auf einzelne Bestellpositionen greift auf die relationale Faktentabelle zu.

### Merksatz
HOLAP: verdichtet schnell, im Detail relational.

Siehe auch: ROLAP · MOLAP · OLAP-Würfel · Drill-down · OLAP
Mehr: Deep Dive 8, 4.5

## Homoskedastizität
<!-- id: homoskedastizitat · quellen: Karte DD4, DD4 2.3 · stand: 2026-11 -->

Voraussetzung der linearen Regression: Die Residuen streuen für alle x-Werte etwa gleich stark – die Fehlervarianz ist konstant.

Auch: Konstante Fehlervarianz

### Erklärung
Prüfen lässt sich das im **Residuenplot**: Residuen e auf der y-Achse, x oder ŷ auf der x-Achse. Ein gleichmäßig breites Band um die Null ohne erkennbares Muster spricht für Homoskedastizität. Sie ist neben dem linearen Zusammenhang, unabhängigen Residuen und – für Tests und Intervalle – annähernd normalverteilten Residuen eine der Regressionsannahmen. Nur wenn sie gilt, stimmen die Standardfehler und damit p-Werte und Konfidenzintervalle der Koeffizienten. Rechnerische Tests (z. B. Breusch-Pagan) gibt es, in der Prüfung genügt der Blick auf den Residuenplot.

### Beispiel
Residuen der Werbebudget-Regression, nach x geordnet: −1,2 / +2,4 / −2,0 / +1,6 / −0,8 T€. Die Beträge 1,2 / 2,4 / 2,0 / 1,6 / 0,8 wachsen oder schrumpfen nicht systematisch, es gibt keinen Trichter. Mit nur fünf Punkten ist das allerdings eine schwache Aussage – die Annahme lässt sich erst bei mehr Daten verlässlich beurteilen.

### Abgrenzung
**Heteroskedastizität** ist das Gegenteil (Trichterform). Die Residuensumme null ist kein Beleg für Homoskedastizität: Sie gilt bei der Kleinste-Quadrate-Geraden immer, auch bei Trichtern.

### Prüfungsfalle
„Die Residuen summieren sich zu null, also ist die Streuung konstant“ – das sind zwei verschiedene Eigenschaften.

### Merksatz
Homo = gleich: ein Band mit gleicher Breite.

Siehe auch: Heteroskedastizität · Residuum · Regressionsgerade · Regression
Mehr: Deep Dive 4, 2.3

## Horizontale Partitionierung
<!-- id: horizontale-partitionierung · quellen: DD8 5.3 · stand: 2026-10 -->

Zerlegung einer großen Tabelle in zeilenweise Teile (Partitionen), die logisch eine Tabelle bleiben – nach Bereich, Liste oder Hash-Funktion.

### Erklärung
**Range**-Partitionierung teilt nach Wertebereichen (z. B. je Monat), **List** nach festen Werten (je Region), **Hash** verteilt gleichmäßig über eine Hash-Funktion. Abfragen mit Filter auf das Partitionskriterium lesen nur die betroffenen Partitionen (**Partition Pruning**); alte Daten lassen sich als ganze Partition archivieren oder löschen; Ladeläufe betreffen nur die aktuelle Partition. Liegen die Partitionen auf verschiedenen Servern, spricht man von **Sharding**.

### Beispiel
`fakt_verkauf` mit 200 Millionen Zeilen wird nach Monat partitioniert. Die Auswertung „Umsatz Q2/2026“ liest nur drei Monatspartitionen; Daten außerhalb der Aufbewahrungsfrist werden mit einer Partition entfernt.

### Abgrenzung
**Vertikale** Partitionierung lagert selten genutzte oder große Spalten in eine eigene Tabelle aus. Spaltenorientierte Speicherung legt jede Spalte am Stück ab.

### Merksatz
Horizontal schneidet Zeilen, vertikal schneidet Spalten.

Siehe auch: Partitionierung · Partition Pruning · Sharding · Vertikale Partitionierung · Faktentabelle
Mehr: Deep Dive 8, 5.3

## Horizontale Skalierung
<!-- id: horizontale-skalierung · quellen: Karte DD15, DD15 4.1, DD8 5.2 · stand: 2026-10 -->

Mehr Leistung durch mehr Server, auf die Daten und Last verteilt werden (scale out) – typisch für NoSQL und Big Data.

### Erklärung
Statt einen Server immer stärker auszubauen, werden weitere Knoten hinzugefügt. Das ist nahezu unbegrenzt erweiterbar, nutzt günstige Standardhardware und macht das System ausfallsicherer. Der Preis: Die Daten sind verteilt, Joins und Transaktionen über Knoten werden aufwendig, und bei Netzwerkstörungen gilt das **CAP-Theorem** – Konsistenz oder Verfügbarkeit. Viele NoSQL-Systeme folgen deshalb BASE (eventually consistent) statt ACID.

### Abgrenzung
| | horizontal (scale out) | vertikal (scale up) |
|---|---|---|
| Vorgehen | mehr Server | stärkerer Server |
| Grenze | kaum | Hardwaregrenze |
| typisch | NoSQL, Hadoop, Spark | klassische relationale DB |
| Ausfall | einzelne Knoten verkraftbar | Single Point of Failure |

### Beispiel
Zum Black-Friday-Verkauf startet der Webshop zusätzliche Server hinter dem Load Balancer und verteilt die Warenkörbe in einem Key-Value-Cluster.

### Merksatz
Horizontal: mehr Rechner; vertikal: größerer Rechner.

Siehe auch: Vertikale Skalierung · NoSQL · CAP-Theorem · Sharding · Load Balancer
Mehr: Deep Dive 15, 4.1 · Deep Dive 8, 5.2

## HTTP-Statuscode
<!-- id: http-statuscode · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

Dreistellige Kennung in der Antwort eines HTTP-Servers, die das Ergebnis einer Anfrage meldet: 2xx Erfolg, 3xx Umleitung, 4xx Fehler des Clients, 5xx Fehler des Servers.

### Erklärung
REST-Schnittstellen signalisieren Erfolg und Fehler über Statuscodes, nicht nur über den Antworttext. So kann der aufrufende Client automatisch reagieren: Bei 4xx muss er seine Anfrage korrigieren, bei 503 oder 429 später erneut versuchen.

### Abgrenzung
| Code | Bedeutung |
|---|---|
| 200 / 201 / 204 | OK / angelegt / erfolgreich ohne Inhalt |
| 400 | fehlerhafte Anfrage (ungültiges JSON) |
| 401 | nicht authentifiziert – wer bist du? |
| 403 | authentifiziert, aber nicht berechtigt |
| 404 | Ressource nicht gefunden |
| 409 | Konflikt, z. B. Versionskonflikt |
| 429 | zu viele Anfragen (Rate Limit) |
| 500 / 503 | Serverfehler / Dienst vorübergehend nicht verfügbar |

### Beispiel
`POST /reparaturauftraege` mit gültigen Daten → 201 Created; dasselbe ohne Token → 401; mit Token eines Lesekontos → 403.

### Prüfungsfalle
401 und 403 vertauschen: 401 heißt „nicht angemeldet“, 403 „angemeldet, aber kein Recht“.

### Merksatz
2 gut, 4 du, 5 ich.

Siehe auch: REST · GET · Rate Limiting · Optimistisches Sperren · Authentifizierung
Mehr: Deep Dive 15, 3.2

## Hybride Verschlüsselung
<!-- id: hybride-verschlusselung · quellen: Karte DD10, DD10 4.2 · stand: 2026-10 -->

Kombination beider Verfahren: Asymmetrisch wird ein Sitzungsschlüssel ausgetauscht, die eigentlichen Daten werden dann schnell symmetrisch verschlüsselt (z. B. TLS/HTTPS).

Auch: Hybrid

### Erklärung
Symmetrische Verfahren (AES) sind schnell, haben aber das Problem des sicheren Schlüsselaustauschs. Asymmetrische Verfahren (RSA) lösen den Austausch, sind aber langsam. Die hybride Verschlüsselung nutzt die Stärken beider. Bei TLS weist sich der Server mit einem **Zertifikat** einer Zertifizierungsstelle aus (PKI); den Sitzungsschlüssel handeln Client und Server bei TLS 1.3 per Diffie-Hellman aus, statt ihn verschlüsselt zu übertragen – das Prinzip bleibt gleich.

### Beispiel
Die Werkstatt-App ruft die REST-API des Möbelhauses über HTTPS auf: Zertifikatsprüfung und Schlüsselaushandlung asymmetrisch, danach werden alle Auftragsdaten mit AES verschlüsselt übertragen.

### Abgrenzung
| Verfahren | Schlüssel | Eigenschaft |
|---|---|---|
| symmetrisch | ein gemeinsamer | schnell, Austauschproblem |
| asymmetrisch | öffentlich + privat | löst Austausch, langsam |
| hybrid | beides | Praxisstandard |

Hashing ist keine Verschlüsselung.

### Merksatz
Asymmetrisch einigen, symmetrisch verschlüsseln.

Siehe auch: Symmetrische Verschlüsselung · Asymmetrische Verschlüsselung · PKI · Hashing · Man-in-the-Middle
Mehr: Deep Dive 10, 4.2

## Hypothesentest
<!-- id: hypothesentest · quellen: Karte DD4, DD4 1.3 · stand: 2026-11 -->

Statistisches Verfahren, das anhand einer Stichprobe entscheidet, ob eine Annahme über die Grundgesamtheit (die Nullhypothese) beibehalten oder verworfen wird.

Auch: Signifikanztest, Statistischer Test

### Erklärung
Ablauf:
1. Nullhypothese H0 und Alternativhypothese H1 formulieren.
2. Signifikanzniveau α festlegen (üblich 5 %) – vor der Auswertung.
3. Passenden Test wählen; er hängt von Skalenniveau, Verteilung und Fragestellung ab (z. B. t-Test für Mittelwerte, Test auf Korrelation, Chi-Quadrat-Test für Häufigkeiten).
4. Prüfgröße und p-Wert berechnen.
5. Entscheiden: $p < \alpha$ → H0 verwerfen, sonst beibehalten.
6. Fachlich deuten, auch mit der Effektgröße – nicht nur „signifikant“.

Zwei Fehler sind möglich: der **Fehler 1. Art** (H0 fälschlich verworfen) und der **Fehler 2. Art** (H0 fälschlich beibehalten). Jeder Test gilt nur, wenn seine Voraussetzungen stimmen, vor allem eine zufällige, repräsentative Stichprobe.

### Beispiel
Bisherige Reparaturdauer: μ₀ = 60 min, σ = 10 min. Nach Einführung einer Checkliste ergeben 25 Reparaturen den Mittelwert $\bar{x} = 56$ min.
- H0: μ = 60 min; H1: μ < 60 min (einseitig); α = 5 %.
- $z = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}} = \frac{56 - 60}{10 / \sqrt{25}} = \frac{-4}{2} = -2{,}0$
- Kritischer Wert (einseitig, 5 %): −1,645. Da −2,0 < −1,645, ist $p \approx 0{,}023 < 0{,}05$ → H0 wird verworfen.

Deutung: Die Verkürzung ist statistisch gesichert. Ob 4 Minuten (rund 7 %; Effektgröße d = 0,4) den Aufwand der Checkliste lohnen, ist eine fachliche Frage.

### Abgrenzung
Ein **Konfidenzintervall** liefert dieselbe Information aus anderer Sicht: einen Wertebereich für den wahren Wert. Ein **A/B-Test** ist die Anwendung eines Hypothesentests auf zwei Varianten. Der **p-Wert** ist nur ein Zwischenergebnis des Tests.

### Prüfungsfalle
Den p-Wert als Wahrscheinlichkeit lesen, dass H0 stimmt (er ist die Wahrscheinlichkeit der Daten unter H0), „nicht verworfen“ als Beweis für H0 nehmen oder α nachträglich passend wählen.

### Merksatz
Wie vor Gericht: Im Zweifel gilt H0 – verurteilt wird nur bei klarer Beweislage (p < α).

Siehe auch: Nullhypothese · Alternativhypothese · P-Wert · Signifikanz · Fehler 1. Art · Fehler 2. Art · Effektgröße · Konfidenzintervall
Mehr: Deep Dive 4, 1.3
