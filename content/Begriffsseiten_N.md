<!-- Begriffsseiten N · Stand 2026-10 -->
## Nacharbeitskosten
<!-- id: nacharbeitskosten · quellen: DD5 3.2 · stand: 2026-10 -->

Prozesskennzahl für die Kosten schlechter Qualität: Nacharbeitszeit je Fehler · Kostensatz · Fehlerzahl.

### Erklärung
Jeder Fehler, der im Prozess entdeckt und korrigiert werden muss, bindet Arbeitszeit, die keinen Mehrwert schafft. Die Nacharbeitskosten machen diese versteckten Kosten sichtbar und sind eine typische Begründung für eine Prozessoptimierung. Sie gehören zu den Qualitäts- und Kostenkennzahlen neben Fehlerquote und First Pass Yield.

### Beispiel
Im Reparaturservice der Möbelhaus Nordholz GmbH müssen im Monat 40 Aufträge nachgebessert werden, je Fall 0,5 Stunden, Kostensatz 60 € pro Stunde:
$40 \cdot 0{,}5\ \text{h} \cdot 60\ \text{€/h} = 1.200\ \text{€}$ pro Monat, also 14.400 € im Jahr.

### Abgrenzung
| Kennzahl | Misst |
|---|---|
| Fehlerquote | Anteil fehlerhafter Fälle in Prozent |
| First Pass Yield | Anteil der Fälle ohne Nacharbeit |
| Nacharbeitskosten | Geldwert der Nacharbeit |

### Prüfungsfalle
Die Zeit je Fehler wird mit der Gesamtzahl der Fälle statt mit der Zahl der fehlerhaften Fälle multipliziert.

### Merksatz
Fehler kosten zweimal: einmal beim Machen, einmal beim Nachbessern.

Siehe auch: Fehlerquote · First Pass Yield · Prozesskosten je Fall · Amortisationszeit
Mehr: Deep Dive 5, 3.2

## Nachhaltigkeit
<!-- id: nachhaltigkeit · quellen: Karte DD14, DD14 5.2 · stand: 2026-10 -->

Gleichrangiger Ausgleich ökologischer, ökonomischer und sozialer Ziele, damit heutiges Wirtschaften die Möglichkeiten künftiger Generationen nicht einschränkt.

### Erklärung
Das **Drei-Säulen-Modell** verlangt, dass keine Säule auf Kosten der anderen verfolgt wird: Umwelt und Ressourcen (ökologisch), dauerhaft tragfähiges Wirtschaften (ökonomisch), faire Arbeitsbedingungen und Teilhabe (sozial). Den Rahmen bilden die 17 Nachhaltigkeitsziele der Agenda 2030 der Vereinten Nationen. In der IT zeigt sich Nachhaltigkeit als **Green IT**: effiziente Hardware, Virtualisierung, längere Nutzungsdauer, Abschalten ungenutzter Systeme und Rechenzentren mit niedrigem PUE-Wert.

### Beispiel
Die Möbelhaus Nordholz GmbH löscht alte Rohdaten nach Ablauf der Aufbewahrungsfrist: Das erfüllt die Datenminimierung der DSGVO und spart zugleich Speicher und Energie. Ausgemusterte Festplatten werden vor der Rückgabe als Elektroschrott nachweisbar gelöscht.

### Abgrenzung
**ESG** (Environmental, Social, Governance) sind Bewertungskriterien von Investoren und Banken; Nachhaltigkeit ist das Leitbild dahinter.

### Prüfungsfalle
Nur die Umwelt nennen – die ökonomische und die soziale Säule gehören gleichrangig dazu.

### Merksatz
Nachhaltig ist, was ökologisch, ökonomisch und sozial zugleich trägt.

Siehe auch: Drei Säulen · Green IT · PUE · ESG · CSRD
Mehr: Deep Dive 14, 5.2

## Nachrichtenfluss
<!-- id: nachrichtenfluss · quellen: Karte DD5, DD5 2.1, DD17 1.1 · stand: 2026-10 -->

Gestrichelter Pfeil in BPMN, der die Kommunikation **zwischen** zwei Pools darstellt.

### Erklärung
Ein Nachrichtenfluss beginnt mit einem kleinen Kreis und endet mit einer offenen Pfeilspitze. Er verbindet Teilnehmer, die keinen gemeinsamen Ablauf haben – etwa Kunde und Unternehmen. Er kann an einer Aktivität, einem Nachrichtenereignis oder am Rand eines zugeklappten Pools ansetzen. Die Reihenfolge innerhalb eines Pools regelt dagegen der Sequenzfluss.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 170" width="320" height="170" role="img" aria-label="Nachrichtenfluss zwischen zwei Pools">
<defs><marker id="nachrichtenfluss-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker><marker id="nachrichtenfluss-kreis" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><circle cx="5" cy="5" r="4" class="dg-form"/></marker></defs>
<rect x="10" y="10" width="300" height="40" class="dg-grau"/>
<text x="160" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Kunde</text>
<rect x="10" y="110" width="300" height="50" class="dg-form"/>
<text x="160" y="150" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Pool Möbelhaus Nordholz</text>
<rect x="105" y="115" width="110" height="26" rx="8" class="dg-form"/>
<text x="160" y="128" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag erfassen</text>
<line x1="160" y1="50" x2="160" y2="115" class="dg-linie dg-strich" marker-start="url(#nachrichtenfluss-kreis)" marker-end="url(#nachrichtenfluss-offen)"/>
<text x="168" y="80" text-anchor="start" dominant-baseline="middle" class="dg-klein">Reparaturauftrag</text>
</svg>
```

### Abgrenzung
| | Sequenzfluss | Nachrichtenfluss |
|---|---|---|
| Linie | durchgezogen, gefüllte Spitze | gestrichelt, Kreis am Anfang |
| Erlaubt | innerhalb eines Pools (auch zwischen Lanes) | nur zwischen Pools |

### Prüfungsfalle
Ein Nachrichtenfluss zwischen zwei Lanes desselben Pools ist genauso falsch wie ein Sequenzfluss über eine Poolgrenze.

### Merksatz
Zwischen Pools fließen nur Nachrichten, nie der Ablauf.

Siehe auch: Sequenzfluss · Pool · Lane · BPMN
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Nachweisgesetz
<!-- id: nachweisgesetz · quellen: Karte DD13, DD13 3.1 · stand: 2026-10 -->

Gesetz, das den Arbeitgeber verpflichtet, dem Arbeitnehmer die wesentlichen Arbeitsbedingungen schriftlich – seit 2025 auch in Textform – nachzuweisen.

### Erklärung
Der Arbeitsvertrag selbst ist formfrei gültig; das **Nachweisgesetz** (NachwG) sorgt dafür, dass die Bedingungen trotzdem dokumentiert sind. Nach § 2 NachwG gelten gestaffelte Fristen: Name, Arbeitsentgelt und Arbeitszeit spätestens am ersten Arbeitstag, weitere Angaben (z. B. Beginn, Tätigkeit, Probezeit) spätestens am siebten Kalendertag, die übrigen (z. B. Urlaub, Kündigungsverfahren) binnen eines Monats. Seit 01.01.2025 genügt die **Textform**, wenn das Dokument zugänglich, speicher- und ausdruckbar ist und der Arbeitgeber zur Empfangsbestätigung auffordert (Stand 2026). Ausnahmen: Branchen nach § 2a SchwarzArbG (z. B. Bau, Gastronomie) und wenn der Arbeitnehmer die Schriftform verlangt. Verstöße sind eine Ordnungswidrigkeit (bis 2.000 €).

### Beispiel
Die Möbelhaus Nordholz GmbH schickt einer neuen Datenanalystin die Vertragsbedingungen als PDF per E-Mail und bittet um Empfangsbestätigung – zulässig.

### Abgrenzung
Der Nachweis ist keine Wirksamkeitsvoraussetzung des Vertrags; Kündigung und Befristung brauchen dagegen echte **Schriftform** (§ 623 BGB, § 14 Abs. 4 TzBfG).

### Prüfungsfalle
„Ohne schriftlichen Vertrag kein Arbeitsverhältnis“ – falsch, der Vertrag gilt auch mündlich.

### Merksatz
Der Vertrag ist formfrei, der Nachweis ist Pflicht.

Siehe auch: Arbeitsvertrag · Textform · Schriftform · Probezeit
Mehr: Deep Dive 13, 3.1

## Nachwirkung
<!-- id: nachwirkung · quellen: Karte DD13, DD13 5.2 · stand: 2026-10 -->

Nach Ablauf eines Tarifvertrags gelten seine Regelungen weiter, bis eine andere Abmachung sie ersetzt (§ 4 Abs. 5 TVG).

### Erklärung
Die Nachwirkung verhindert ein Regelungsvakuum: Endet ein Tarifvertrag, fallen Lohn, Urlaub und Arbeitszeit nicht einfach weg. Allerdings wirken die Regeln jetzt nur noch **dispositiv** – sie können durch einen neuen Tarifvertrag, aber auch durch eine Betriebsvereinbarung oder Arbeitsvertrag ersetzt werden, auch zum Nachteil der Beschäftigten.

### Beispiel
Der Entgelttarifvertrag eines Logistikpartners läuft am 31.03. aus, die Verhandlungen dauern bis Juni. Bis dahin zahlt der Arbeitgeber die bisherigen Tariflöhne weiter.

### Abgrenzung
| Begriff | Bedeutung |
|---|---|
| Friedenspflicht | während der Laufzeit kein Arbeitskampf über geregelte Punkte |
| Nachwirkung | nach der Laufzeit gelten die Inhalte weiter, aber abänderbar |
| Günstigkeitsprinzip | Abweichungen nur zugunsten der Beschäftigten |

### Prüfungsfalle
Nachwirkung heißt nicht Friedenspflicht – nach Ablauf darf gestreikt werden, obwohl die alten Regeln weitergelten.

### Merksatz
Der Tarifvertrag endet, seine Regeln bleiben – bis etwas Neues kommt.

Siehe auch: Tarifvertrag · Friedenspflicht · Günstigkeitsprinzip · Tarifbindung
Mehr: Deep Dive 13, 5.2

## Natürliche Personen
<!-- id: naturliche-personen · quellen: DD14 2.1 · stand: 2026-10 -->

Menschen als Träger von Rechten und Pflichten; ihre Rechtsfähigkeit beginnt mit der Vollendung der Geburt (§ 1 BGB).

### Erklärung
Das Recht unterscheidet natürliche Personen (Menschen) von **juristischen Personen** – Organisationen, denen die Rechtsordnung eigene Rechtsfähigkeit verleiht (GmbH, AG, eingetragener Verein, Gemeinden, IHK). Rechtsfähig ist jeder Mensch von Geburt an; ob er selbst wirksam Verträge schließen kann, regelt die **Geschäftsfähigkeit**: unter 7 Jahren geschäftsunfähig, von 7 bis 17 beschränkt geschäftsfähig, ab 18 voll geschäftsfähig.

### Beispiel
Ein 16-jähriger Auszubildender ist rechtsfähig (er kann z. B. erben), aber nur beschränkt geschäftsfähig: Einen Handyvertrag mit Laufzeit kann er ohne Zustimmung der Eltern nicht wirksam abschließen.

### Abgrenzung
| | Natürliche Person | Juristische Person |
|---|---|---|
| Wer | Mensch | GmbH, AG, e. V., Körperschaften |
| Beginn | Geburt | z. B. Eintragung ins Register |
| Handelt durch | sich selbst | Organe (Geschäftsführer, Vorstand) |

### Prüfungsfalle
Rechtsfähigkeit und Geschäftsfähigkeit verwechseln: Ein Baby ist rechtsfähig, aber geschäftsunfähig.

### Merksatz
Jeder Mensch hat Rechte – Verträge schließen kann er erst mit Geschäftsfähigkeit.

Siehe auch: Juristische Person · Rechtsfähigkeit · Geschäftsfähigkeit
Mehr: Deep Dive 14, 2.1

## Natürlicher Schlüssel
<!-- id: naturlicher-schlussel · quellen: DD2 1.2 · stand: 2026-10 -->

Primärschlüssel aus einem fachlich ohnehin vorhandenen Attribut, z. B. ISBN, Kfz-Kennzeichen oder Steuer-ID.

### Erklärung
Ein natürlicher Schlüssel hat eine Bedeutung in der realen Welt und wird nicht eigens erzeugt. Das ist bequem, birgt aber Risiken: Fachliche Werte können sich ändern (Kennzeichen, Name), doppelt vorkommen oder anfangs fehlen. Deshalb verwendet man in der Praxis meist einen **Surrogatschlüssel** und sichert den natürlichen Schlüssel zusätzlich mit UNIQUE ab.

### Beispiel
Die Möbelhaus Nordholz GmbH identifiziert Kunden nicht über die E-Mail-Adresse, sondern über die fortlaufende kunden_id. Ändert ein Kunde seine E-Mail, bleiben alle Bestellungen korrekt verknüpft.

### Abgrenzung
| | Natürlicher Schlüssel | Surrogatschlüssel |
|---|---|---|
| Herkunft | fachlich vorhanden | künstlich erzeugt |
| Bedeutung | ja | keine |
| Stabilität | kann sich ändern | stabil, kurz |

### Prüfungsfalle
Namen oder E-Mail-Adressen als Primärschlüssel wählen – sie sind weder garantiert eindeutig noch stabil.

### Merksatz
Fachlich eindeutig ist nicht dasselbe wie dauerhaft stabil.

Siehe auch: Surrogatschlüssel · Primärschlüssel · Schlüsselkandidat · UNIQUE
Mehr: Deep Dive 2, 1.2

## Need-to-know
<!-- id: need-to-know · quellen: Karte DD10, DD10 4.3 · stand: 2026-10 -->

Prinzip der Zugriffskontrolle: Jede Person erhält nur Zugriff auf die Daten, die sie fachlich für ihre Aufgabe benötigt.

### Erklärung
Need-to-know schränkt den **Inhalt** ein, den jemand sehen darf, und setzt damit die Grundsätze Datenminimierung und Vertraulichkeit um. Es wird meist über Rollen (RBAC), Sichten (Views) und Zeilen- oder Spaltenfilter technisch umgesetzt und regelmäßig überprüft, z. B. bei einem Abteilungswechsel.

### Beispiel
Die Reklamationsanalyse im Möbelhaus braucht Auftragsdaten, aber keine Bankverbindungen der Kunden. Die Analysten bekommen eine View ohne Zahlungsdaten.

### Abgrenzung
| Prinzip | Frage |
|---|---|
| Need-to-know | Welche Daten braucht die Person? |
| Least Privilege | Welche Rechte (lesen, ändern, löschen) braucht sie mindestens? |
| Funktionstrennung | Wer darf welche Schritte nicht gleichzeitig ausführen? |

### Prüfungsfalle
Need-to-know und Least Privilege gleichsetzen – das eine begrenzt die Daten, das andere die Rechte.

### Merksatz
Sehen darf man nur, was man für die Arbeit braucht.

Siehe auch: Least Privilege · RBAC · Funktionstrennung · Datenminimierung
Mehr: Deep Dive 10, 4.3

## Nettoentgelt
<!-- id: nettontgelt · quellen: Karte DD14, DD14 1.4 · stand: 2026-10 -->

Auszahlungsbetrag: Bruttoentgelt minus Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und Arbeitnehmeranteile zur Sozialversicherung.

### Erklärung
Vom Brutto gehen zwei Blöcke ab: Steuern (Lohnsteuer je nach Steuerklasse; Soli 5,5 % der Lohnsteuer, aber erst oberhalb der Freigrenze von 20.350 € Lohnsteuer im Jahr; Kirchensteuer 8 % bzw. 9 % der Lohnsteuer) und der Arbeitnehmeranteil zur Kranken-, Pflege-, Renten- und Arbeitslosenversicherung. Lohnsteuer fällt erst an, wenn das zu versteuernde Einkommen über dem Grundfreibetrag von 12.348 € liegt (Stand 2026).

### Beispiel
Jonas (17, kinderlos, Zusatzbeitrag 2,9 %), Ausbildungsvergütung 1.200 € (Stand 2026):

| Position | Satz | Betrag |
|---|---|---|
| Krankenversicherung | 7,3 % + 1,45 % | 105,00 € |
| Pflegeversicherung | 1,8 % (unter 23) | 21,60 € |
| Rentenversicherung | 9,3 % | 111,60 € |
| Arbeitslosenversicherung | 1,3 % | 15,60 € |
| Lohnsteuer | unter Grundfreibetrag | 0,00 € |
| Nettoentgelt | | 946,20 € |

### Prüfungsfalle
Den Kinderlosenzuschlag (0,6 % ab 23) oder den halben Zusatzbeitrag vergessen – Alter und Kinderzahl immer zuerst prüfen.

### Merksatz
Netto = Brutto − Steuern − Arbeitnehmeranteile.

Siehe auch: Lohnsteuer · Solidaritätszuschlag · Kirchensteuer · Sozialversicherung · Grundfreibetrag
Mehr: Deep Dive 14, 1.4

## Netzplan
<!-- id: netzplan · quellen: Karte DD12, DD12 3.2, DD17 5.1 · stand: 2026-10 -->

Darstellung der Vorgänge eines Projekts mit ihren Abhängigkeiten, aus der sich Projektdauer, Puffer und kritischer Pfad berechnen lassen.

### Erklärung
Im Vorgangsknotennetz ist jeder Vorgang ein Knoten mit Dauer und vier Zeitwerten. Die **Vorwärtsrechnung** liefert FAZ und FEZ ($\text{FEZ} = \text{FAZ} + \text{Dauer}$; FAZ = größtes FEZ der Vorgänger), die **Rückwärtsrechnung** SEZ und SAZ (SEZ = kleinstes SAZ der Nachfolger). Gesamtpuffer $\text{GP} = \text{SAZ} - \text{FAZ}$, freier Puffer $\text{FP} = \min(\text{FAZ der Nachfolger}) - \text{FEZ}$. Vorgänge mit GP = 0 bilden den kritischen Pfad.

### Beispiel
A (3 Tage) vor B (4) und C (2), beide vor D (1):

| Vorgang | FAZ | FEZ | SAZ | SEZ | GP | FP |
|---|---|---|---|---|---|---|
| A | 0 | 3 | 0 | 3 | 0 | 0 |
| B | 3 | 7 | 3 | 7 | 0 | 0 |
| C | 3 | 5 | 5 | 7 | 2 | 2 |
| D | 7 | 8 | 7 | 8 | 0 | 0 |

Projektdauer 8 Tage, kritischer Pfad A – B – D.

Die Abbildung zeigt dasselbe Netz mit den Zeitwerten in den Knoten; der kritische Pfad A – B – D ist hervorgehoben.

**Abbildung: Netzplan mit FAZ, FEZ, SAZ, SEZ und Puffern**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 244" width="360" height="244" role="img" aria-label="Netzplan mit den Vorgängen A, B, C und D: A vor B und C, beide vor D; kritischer Pfad A, B, D mit 8 Tagen Projektdauer, Vorgang C hat 2 Tage Puffer">
<defs><marker id="netzplan-pfeil" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker><marker id="netzplan-pfeil-krit" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll-akzent"/></marker></defs>
<line x1="80" y1="94" x2="142" y2="42" class="dg-linie-akzent dg-dick" marker-end="url(#netzplan-pfeil-krit)"/>
<line x1="80" y1="94" x2="142" y2="146" class="dg-linie" marker-end="url(#netzplan-pfeil)"/>
<line x1="220" y1="42" x2="280" y2="94" class="dg-linie-akzent dg-dick" marker-end="url(#netzplan-pfeil-krit)"/>
<line x1="220" y1="146" x2="280" y2="94" class="dg-linie" marker-end="url(#netzplan-pfeil)"/>
<rect x="4" y="62" width="76" height="64" class="dg-akzent"/>
<line x1="4" y1="82" x2="80" y2="82" class="dg-linie dg-duenn"/>
<line x1="4" y1="106" x2="80" y2="106" class="dg-linie dg-duenn"/>
<line x1="42" y1="62" x2="42" y2="82" class="dg-linie dg-duenn"/>
<line x1="42" y1="106" x2="42" y2="126" class="dg-linie dg-duenn"/>
<text x="23" y="72" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0</text>
<text x="61" y="72" text-anchor="middle" dominant-baseline="middle" class="dg-klein">3</text>
<text x="42" y="94" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">A · 3 T</text>
<text x="23" y="116" text-anchor="middle" dominant-baseline="middle" class="dg-klein">0</text>
<text x="61" y="116" text-anchor="middle" dominant-baseline="middle" class="dg-klein">3</text>
<text x="42" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">GP 0 · FP 0</text>
<rect x="144" y="10" width="76" height="64" class="dg-akzent"/>
<line x1="144" y1="30" x2="220" y2="30" class="dg-linie dg-duenn"/>
<line x1="144" y1="54" x2="220" y2="54" class="dg-linie dg-duenn"/>
<line x1="182" y1="10" x2="182" y2="30" class="dg-linie dg-duenn"/>
<line x1="182" y1="54" x2="182" y2="74" class="dg-linie dg-duenn"/>
<text x="163" y="20" text-anchor="middle" dominant-baseline="middle" class="dg-klein">3</text>
<text x="201" y="20" text-anchor="middle" dominant-baseline="middle" class="dg-klein">7</text>
<text x="182" y="42" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">B · 4 T</text>
<text x="163" y="64" text-anchor="middle" dominant-baseline="middle" class="dg-klein">3</text>
<text x="201" y="64" text-anchor="middle" dominant-baseline="middle" class="dg-klein">7</text>
<text x="182" y="88" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">GP 0 · FP 0</text>
<rect x="144" y="114" width="76" height="64" class="dg-form"/>
<line x1="144" y1="134" x2="220" y2="134" class="dg-linie dg-duenn"/>
<line x1="144" y1="158" x2="220" y2="158" class="dg-linie dg-duenn"/>
<line x1="182" y1="114" x2="182" y2="134" class="dg-linie dg-duenn"/>
<line x1="182" y1="158" x2="182" y2="178" class="dg-linie dg-duenn"/>
<text x="163" y="124" text-anchor="middle" dominant-baseline="middle" class="dg-klein">3</text>
<text x="201" y="124" text-anchor="middle" dominant-baseline="middle" class="dg-klein">5</text>
<text x="182" y="146" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">C · 2 T</text>
<text x="163" y="168" text-anchor="middle" dominant-baseline="middle" class="dg-klein">5</text>
<text x="201" y="168" text-anchor="middle" dominant-baseline="middle" class="dg-klein">7</text>
<text x="182" y="192" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">GP 2 · FP 2</text>
<rect x="280" y="62" width="76" height="64" class="dg-akzent"/>
<line x1="280" y1="82" x2="356" y2="82" class="dg-linie dg-duenn"/>
<line x1="280" y1="106" x2="356" y2="106" class="dg-linie dg-duenn"/>
<line x1="318" y1="62" x2="318" y2="82" class="dg-linie dg-duenn"/>
<line x1="318" y1="106" x2="318" y2="126" class="dg-linie dg-duenn"/>
<text x="299" y="72" text-anchor="middle" dominant-baseline="middle" class="dg-klein">7</text>
<text x="337" y="72" text-anchor="middle" dominant-baseline="middle" class="dg-klein">8</text>
<text x="318" y="94" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">D · 1 T</text>
<text x="299" y="116" text-anchor="middle" dominant-baseline="middle" class="dg-klein">7</text>
<text x="337" y="116" text-anchor="middle" dominant-baseline="middle" class="dg-klein">8</text>
<text x="318" y="140" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">GP 0 · FP 0</text>
<text x="180" y="218" text-anchor="middle" dominant-baseline="middle" class="dg-klein">oben: FAZ | FEZ · Mitte: Vorgang · Dauer · unten: SAZ | SEZ</text>
<text x="180" y="234" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Projektdauer 8 Tage · kritischer Pfad A – B – D (farbig, dick)</text>
</svg>
```

### Abgrenzung
Das **Gantt-Diagramm** zeigt dieselben Vorgänge als Balken über der Zeitachse – gut zum Kommunizieren, der Netzplan ist das Rechenwerkzeug.

### Prüfungsfalle
Vorwärts und rückwärts Maximum und Minimum vertauschen oder den kürzesten statt des längsten Wegs als kritischen Pfad angeben.

### Merksatz
Vorwärts das Maximum, rückwärts das Minimum – kritisch ist, was keinen Puffer hat.

Siehe auch: Kritischer Pfad · Gesamtpuffer · Freier Puffer · Gantt-Diagramm · Vorwärtsrechnung
Mehr: Deep Dive 12, 3.2 · Deep Dive 17, 5.1

## Neuron
<!-- id: neuron · quellen: Karte DD6, DD6 9.1 · stand: 2026-10 -->

Grundbaustein eines neuronalen Netzes: bildet die gewichtete Summe seiner Eingaben plus Bias und gibt sie über eine Aktivierungsfunktion als Ausgabe weiter.

### Erklärung
Das künstliche Neuron ist dem Nervensystem grob nachempfunden: Eingaben entsprechen den Signalen anderer Zellen, Gewichte den Synapsen, die gewichtete Summe dem Zellkörper und die Aktivierungsfunktion dem „Feuern“ ab einer Schwelle. Gerechnet wird z = Σ wᵢ · xᵢ + b und dann y = f(z). Das erste Modell stammt von McCulloch und Pitts (1943). In einem Netz sind Neuronen in Eingabe-, verdeckten und Ausgabeschichten angeordnet; die Ausgabe einer Schicht ist die Eingabe der nächsten.

### Beispiel
x = (0,8; 0,5; 1), w = (1,5; −0,5; 0,8), b = −1: z = 1,2 − 0,25 + 0,8 − 1 = 0,75. Mit der Sigmoid-Funktion ergibt sich y ≈ 0,68.

### Abgrenzung
Ein einzelnes Neuron mit Stufenfunktion und eigener Lernregel heißt Perzeptron. Ein neuronales Netz besteht aus vielen verbundenen Neuronen.

### Prüfungsfalle
Den Bias bei der gewichteten Summe vergessen.

### Merksatz
Gewichten, summieren, Bias dazu, aktivieren.

Siehe auch: Gewicht · Bias · Aktivierungsfunktion · Perzeptron · Neuronale Netze
Mehr: Deep Dive 6, 9.1 · Deep Dive 6, 9.2

## Neuronale Netze
<!-- id: neuronale-netze · quellen: Karte DD6, DD6 2.4, DD6 8.2 · stand: 2026-10 -->

Lernverfahren aus Schichten künstlicher Neuronen mit gewichteten Verbindungen; sehr leistungsfähig bei großen Datenmengen, aber eine Black Box.

### Erklärung
Ein Netz besteht aus Eingabeschicht (je Merkmal ein Neuron), einer oder mehreren verdeckten Schichten und Ausgabeschicht. Jedes Neuron bildet die gewichtete Summe seiner Eingänge und gibt sie über eine Aktivierungsfunktion weiter. Beim Training wird der Fehler der Vorhersage per **Backpropagation** zurückgerechnet und die Gewichte werden schrittweise angepasst. Netze mit vielen Schichten heißen **Deep Learning**.

### Beispiel
Ein Netz erkennt auf Fotos von Rücksendungen, ob ein Möbelstück beschädigt ist. Für die Vorhersage des Reklamationsrisikos aus wenigen Tabellenmerkmalen wäre dagegen ein Entscheidungsbaum besser geeignet, weil er erklärbar ist.

### Abgrenzung
| Verfahren | Stärke | Schwäche |
|---|---|---|
| Neuronales Netz | Bilder, Text, Sprache, komplexe Muster | viele Daten nötig, nicht erklärbar |
| Entscheidungsbaum | direkt lesbar | neigt ungeschnitten zu Overfitting |

### Prüfungsfalle
Ein neuronales Netz für einen kleinen Datensatz mit Erklärungspflicht empfehlen (z. B. bei automatisierten Entscheidungen nach Art. 22 DSGVO).

### Merksatz
Je mehr Daten und je weniger Erklärungsbedarf, desto eher ein neuronales Netz.

Siehe auch: Neuron · Perzeptron · Mehrschichtiges Perzeptron · Deep Learning · CNN (Convolutional Neural Network) · Entscheidungsbaum
Mehr: Deep Dive 6, 2.4 · Deep Dive 6, 8.2 · Deep Dive 6, Teil 9

## Nichtige Vereinbarungen
<!-- id: nichtige-vereinbarungen · quellen: Karte DD13, DD13 1.2 · stand: 2026-10 -->

Klauseln, die in einem Berufsausbildungsvertrag nach § 12 BBiG unwirksam sind, etwa Vertragsstrafen oder Zahlungen für die Ausbildung.

### Erklärung
§ 12 BBiG schützt Auszubildende vor Bindungen und Kosten. Nichtig sind:
- die Verpflichtung, nach der Ausbildung im Betrieb weiterzuarbeiten – außer sie wird in den letzten sechs Monaten der Ausbildung vereinbart,
- eine Entschädigung für die Berufsausbildung,
- Vertragsstrafen,
- Ausschluss oder Beschränkung von Schadensersatzansprüchen,
- Schadensersatz in Pauschalbeträgen.

Nichtig ist nur die einzelne Klausel; der Ausbildungsvertrag bleibt im Übrigen wirksam.

### Beispiel
Im Ausbildungsvertrag steht: „Bricht der Auszubildende die Ausbildung ab, zahlt er 2.000 €.“ Diese Vertragsstrafe ist nichtig. Vereinbart der Betrieb dagegen im letzten Halbjahr eine Übernahme, ist das zulässig.

### Prüfungsfalle
Eine Weiterarbeitsverpflichtung pauschal für nichtig halten – entscheidend ist der Zeitpunkt der Vereinbarung.

### Merksatz
Ausbildung kostet den Azubi nichts und bindet ihn nicht – außer er sagt im letzten halben Jahr freiwillig Ja.

Siehe auch: Ausbildungsnachweis · BBiG · Probezeit · Mindestausbildungsvergütung
Mehr: Deep Dive 13, 1.2

## NIS2
<!-- id: nis2 · quellen: Karte DD10, DD10 5.5 · stand: 2026-10 -->

EU-Richtlinie zur Cybersicherheit, in Deutschland seit 06.12.2025 durch das NIS2-Umsetzungsgesetz im BSI-Gesetz (BSIG) umgesetzt.

### Erklärung
Erfasst sind Unternehmen bestimmter Sektoren (z. B. Energie, Gesundheit, Verkehr, digitale Infrastruktur, Lebensmittel, verarbeitendes Gewerbe): **wichtige Einrichtungen** ab 50 Beschäftigten oder über 10 Mio. € Umsatz und Bilanzsumme, **besonders wichtige** ab 250 Beschäftigten oder über 50 Mio. € Umsatz und 43 Mio. € Bilanzsumme. Pflichten (Stand 2026): Registrierung beim BSI binnen drei Monaten, Risikomanagement (Backup, Notfallmanagement, MFA, Lieferkette, Schulung), Billigung und Überwachung durch die Geschäftsleitung sowie Meldung erheblicher Sicherheitsvorfälle nach § 32 BSIG.

### Beispiel
Bei einem Ransomware-Angriff meldet ein betroffener Logistikdienstleister an das BSI: frühe Erstmeldung spätestens nach 24 Stunden, Meldung mit erster Bewertung nach 72 Stunden, Abschlussmeldung spätestens einen Monat nach dieser Meldung.

### Abgrenzung
| | NIS2 (§ 32 BSIG) | DSGVO (Art. 33) |
|---|---|---|
| Empfänger | BSI | Datenschutz-Aufsichtsbehörde |
| Anlass | jeder erhebliche Sicherheitsvorfall | Verletzung personenbezogener Daten |
| Frist | 24 h / 72 h / 1 Monat | 72 h |

### Prüfungsfalle
Annehmen, eine Meldung ersetze die andere – ein Angriff auf Kundendaten kann beide Pflichten auslösen.

### Merksatz
NIS2 meldet ans BSI, die DSGVO an den Datenschutz.

Siehe auch: BSI · Sicherheitsvorfall · Datenpanne · IT-Grundschutz · Notfallmanagement
Mehr: Deep Dive 10, 5.5

## Nominalskala
<!-- id: nominalskala · quellen: Karte DD3, DD3 Teil 1 · stand: 2026-10 -->

Niedrigstes Skalenniveau: Die Werte lassen sich nur auf gleich oder ungleich prüfen, es gibt keine Reihenfolge.

Auch: Nominal

### Erklärung
Nominale Merkmale benennen Kategorien wie Zahlungsart, Reklamationsgrund oder Farbe. Zulässig sind Häufigkeiten, Anteile und als einziges Lagemaß der **Modus**. Auch Zahlen können nominal sein, wenn sie nur etwas kennzeichnen: Kundennummer, Postleitzahl, Artikelnummer.

### Beispiel
Reklamationsgründe im Möbelhaus: „beschädigt“ 18, „falsch geliefert“ 7, „zu spät“ 5. Modus ist „beschädigt“; ein Mittelwert ist sinnlos. Für ein Modell werden die Gründe per One-Hot-Encoding in 0/1-Spalten umgewandelt.

### Abgrenzung
| Skala | Ordnung | Lagemaße |
|---|---|---|
| Nominal | keine | Modus |
| Ordinal | Rangfolge | Modus, Median |
| Metrisch | gleiche Abstände | zusätzlich Mittelwert |

### Prüfungsfalle
Den Mittelwert von Postleitzahlen oder Kundennummern berechnen – Ziffern machen ein Merkmal nicht metrisch.

### Merksatz
Nominal heißt: nur Namen, keine Reihenfolge – nur der Modus.

Siehe auch: Ordinalskala · Skalenniveau · Modus · One-Hot-Encoding
Mehr: Deep Dive 3, Teil 1

## Non-repeatable Read
<!-- id: non-repeatable-read · quellen: Karte DD15, DD15 4.2 · stand: 2026-10 -->

Anomalie paralleler Transaktionen: Dieselbe Abfrage liefert innerhalb einer Transaktion unterschiedliche Werte, weil eine andere Transaktion die Zeile zwischendurch geändert und bestätigt hat.

### Erklärung
Die Anomalie tritt bis zur Isolationsstufe READ COMMITTED auf. REPEATABLE READ verhindert sie, indem gelesene Zeilen bis zum Ende der Transaktion stabil bleiben (über Sperren oder Versionen). Problematisch ist sie bei Berechnungen, die einen Wert mehrmals lesen und dabei Konsistenz voraussetzen.

### Beispiel
T1 liest den Lagerbestand von Artikel 10: 10 Stück. T2 verkauft 3 Stück und bestätigt (COMMIT). T1 liest erneut: 7 Stück – innerhalb derselben Transaktion.

### Abgrenzung
| Anomalie | Was passiert |
|---|---|
| Dirty Read | liest unbestätigte Änderung |
| Non-repeatable Read | bestehende Zeile hat beim zweiten Lesen einen anderen Wert |
| Phantom Read | neue Zeilen tauchen beim zweiten Lesen auf |
| Lost Update | eine Änderung wird überschrieben |

### Prüfungsfalle
Non-repeatable Read und Phantom Read verwechseln: geänderte Werte bestehender Zeilen gegenüber neu hinzukommenden Zeilen.

### Merksatz
Gleiche Frage, andere Antwort – weil jemand dazwischen geändert hat.

Siehe auch: Dirty Read · Phantom Read · Lost Update · Isolationsstufen
Mehr: Deep Dive 15, 4.2

## Normalisieren
<!-- id: normalisieren · quellen: DD9 4.2 · stand: 2026-10 -->

Erster Schritt der Dublettenerkennung: Schreibweisen vereinheitlichen, damit gleiche Werte auch gleich aussehen.

### Erklärung
Vor dem Vergleich werden Texte auf eine Standardform gebracht: Groß-/Kleinschreibung angleichen, Rechtsformzusätze und Sonderzeichen entfernen, Umlaute umschreiben, Abkürzungen auflösen („Str.“ → „Straße“). Erst danach greifen Ähnlichkeitsmaße wie die Levenshtein-Distanz oder phonetische Verfahren sinnvoll. Die normalisierte Form dient nur dem Vergleich; der Originalwert bleibt erhalten.

### Beispiel
„Braun G.m.b.H.“ und „BRAUN GmbH“ werden beide zu „braun“; „Müller“ wird zu „mueller“. Die Levenshtein-Distanz zwischen „Braun GmbH“ und „Braun G.m.b.H.“ sinkt von 4 auf 0.

### Abgrenzung
| Begriff | Bereich |
|---|---|
| Normalisieren | Datenbereinigung: Schreibweisen vereinheitlichen |
| Normalisierung | Datenbankentwurf: 1. bis 3. Normalform |
| Min-Max-Normalisierung | Machine Learning: Werte auf 0 bis 1 skalieren |

### Prüfungsfalle
Die drei gleich klingenden Begriffe vermischen – der Kontext entscheidet.

### Merksatz
Erst vereinheitlichen, dann vergleichen.

Siehe auch: Dublette · Levenshtein-Distanz · Kölner Phonetik · Golden Record · Normalisierung
Mehr: Deep Dive 9, 4.2

## Normalisierung
<!-- id: normalisierung · quellen: Karte DD2, DD2 Teil 3 · stand: 2026-10 -->

Schrittweises Zerlegen von Tabellen in die 1. bis 3. Normalform, um Redundanz und damit Anomalien zu vermeiden.

### Erklärung
- **1. NF:** alle Attributwerte atomar, keine Wiederholungsgruppen.
- **2. NF:** 1. NF und kein Nichtschlüsselattribut hängt nur von einem Teil eines zusammengesetzten Schlüssels ab.
- **3. NF:** 2. NF und keine transitiven Abhängigkeiten zwischen Nichtschlüsselattributen.

Ohne Normalisierung drohen Einfüge-, Änderungs- und Löschanomalien. Normalisierung ist damit auch eine vorbeugende Datenqualitätsmaßnahme (Konsistenz).

### Beispiel
Die Bestellliste des Altsystems speichert Kundenname und -ort in jeder Bestellung. Zieht die Huber GmbH um, müsste jede ihrer Bestellungen geändert werden. Nach der 3. NF steht der Ort nur noch einmal in der Tabelle kunde.

Die Abbildung zerlegt eine Positionstabelle des Altsystems (mit zusätzlichem Kundenort) in drei Schritten: erst nur atomare Werte (1. NF), dann Teilabhängigkeiten auslagern (2. NF), dann die transitive Abhängigkeit (3. NF).

**Abbildung: Tabellenzerlegung von der 1. bis zur 3. Normalform**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 320" width="360" height="320" role="img" aria-label="Zerlegung einer Bestellpositions-Tabelle: erst 1. Normalform, dann 2. Normalform mit drei Tabellen, dann 3. Normalform mit der zusätzlichen Tabelle kunde">
<defs><marker id="normalisierung-pfeil" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<rect x="6" y="4" width="348" height="72" class="dg-form"/>
<text x="180" y="16" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">1. NF: bestellposition (alles in einer Tabelle)</text>
<text x="180" y="32" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">bestell_id, produkt_id</text>
<text x="180" y="46" text-anchor="middle" dominant-baseline="middle" class="dg-klein">bestelldatum, kunden_id, kunden_ort</text>
<text x="180" y="60" text-anchor="middle" dominant-baseline="middle" class="dg-klein">bezeichnung, preis, menge</text>
<line x1="180" y1="76" x2="180" y2="104" class="dg-linie" marker-end="url(#normalisierung-pfeil)"/>
<text x="190" y="90" text-anchor="start" dominant-baseline="middle" class="dg-klein">2. NF: Teilabhängigkeiten auslagern</text>
<rect x="6" y="108" width="108" height="84" class="dg-akzent"/>
<text x="60" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">bestellung</text>
<text x="60" y="136" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">bestell_id</text>
<text x="60" y="150" text-anchor="middle" dominant-baseline="middle" class="dg-klein">bestelldatum</text>
<text x="60" y="164" text-anchor="middle" dominant-baseline="middle" class="dg-klein">kunden_id</text>
<text x="60" y="178" text-anchor="middle" dominant-baseline="middle" class="dg-klein">kunden_ort</text>
<rect x="126" y="108" width="108" height="84" class="dg-akzent"/>
<text x="180" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">produkt</text>
<text x="180" y="136" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">produkt_id</text>
<text x="180" y="150" text-anchor="middle" dominant-baseline="middle" class="dg-klein">bezeichnung</text>
<text x="180" y="164" text-anchor="middle" dominant-baseline="middle" class="dg-klein">preis</text>
<rect x="246" y="108" width="108" height="84" class="dg-akzent"/>
<text x="300" y="120" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">bestellposition</text>
<text x="300" y="136" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">bestell_id</text>
<text x="300" y="150" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">produkt_id</text>
<text x="300" y="164" text-anchor="middle" dominant-baseline="middle" class="dg-klein">menge</text>
<line x1="60" y1="192" x2="60" y2="220" class="dg-linie" marker-end="url(#normalisierung-pfeil)"/>
<text x="70" y="206" text-anchor="start" dominant-baseline="middle" class="dg-klein">3. NF: transitive Abhängigkeit auslagern</text>
<rect x="2" y="224" width="76" height="70" class="dg-form"/>
<text x="40" y="236" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">bestellung</text>
<text x="40" y="252" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">bestell_id</text>
<text x="40" y="266" text-anchor="middle" dominant-baseline="middle" class="dg-klein">bestelldatum</text>
<text x="40" y="280" text-anchor="middle" dominant-baseline="middle" class="dg-klein">kunden_id↑</text>
<rect x="84" y="224" width="70" height="70" class="dg-akzent"/>
<text x="119" y="236" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">kunde</text>
<text x="119" y="252" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">kunden_id</text>
<text x="119" y="266" text-anchor="middle" dominant-baseline="middle" class="dg-klein">kunden_ort</text>
<rect x="160" y="224" width="76" height="70" class="dg-form"/>
<text x="198" y="236" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">produkt</text>
<text x="198" y="252" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">produkt_id</text>
<text x="198" y="266" text-anchor="middle" dominant-baseline="middle" class="dg-klein">bezeichnung</text>
<text x="198" y="280" text-anchor="middle" dominant-baseline="middle" class="dg-klein">preis</text>
<rect x="242" y="224" width="116" height="70" class="dg-form"/>
<text x="300" y="236" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">bestellposition</text>
<text x="300" y="252" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">bestell_id↑</text>
<text x="300" y="266" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett dg-akzent-text">produkt_id↑</text>
<text x="300" y="280" text-anchor="middle" dominant-baseline="middle" class="dg-klein">menge</text>
<text x="180" y="310" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">fett = Schlüssel, ↑ = Fremdschlüssel, farbig = neu entstanden</text>
</svg>
```

### Abgrenzung
**Denormalisierung** fasst Tabellen bewusst wieder zusammen, z. B. im Star-Schema eines Data Warehouse, weil dort Lesegeschwindigkeit wichtiger ist als Redundanzfreiheit.

### Prüfungsfalle
Normalisierung (Datenbank) mit Min-Max-Normalisierung (Skalierung im Machine Learning) verwechseln.

### Merksatz
Jedes Nichtschlüsselattribut hängt vom Schlüssel ab, vom ganzen Schlüssel und von nichts als dem Schlüssel.

Siehe auch: 1. Normalform · 2. Normalform · 3. Normalform · Anomalie · Denormalisierung
Mehr: Deep Dive 2, Teil 3

## Normalverteilung
<!-- id: normalverteilung · quellen: Karte DD3, DD3 7.3 · stand: 2026-10 -->

Symmetrische, glockenförmige Verteilung, vollständig beschrieben durch Mittelwert μ und Standardabweichung σ.

### Erklärung
Mittelwert, Median und Modus fallen zusammen. Es gilt die **68-95-99,7-Regel**: Rund 68 % der Werte liegen in μ ± 1σ, 95 % in μ ± 2σ, 99,7 % in μ ± 3σ. Der z-Wert $z = \frac{x - \mu}{\sigma}$ gibt an, wie viele Standardabweichungen ein Wert vom Mittel entfernt ist; über 3 gilt er als Ausreißerkandidat (3-Sigma-Regel).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 175" width="360" height="175" role="img" aria-label="Glockenkurve mit Bereichen plus minus 1 und 2 Sigma">
<line x1="10" y1="140" x2="350" y2="140" class="dg-linie"/>
<line x1="130" y1="76" x2="130" y2="140" class="dg-linie dg-strich"/>
<line x1="230" y1="76" x2="230" y2="140" class="dg-linie dg-strich"/>
<line x1="80" y1="126" x2="80" y2="140" class="dg-linie dg-strich"/>
<line x1="280" y1="126" x2="280" y2="140" class="dg-linie dg-strich"/>
<line x1="180" y1="35" x2="180" y2="140" class="dg-linie"/>
<polyline points="10,140 20,139 30,139 40,138 50,136 60,134 70,131 80,126 90,119 100,111 110,101 120,89 130,76 140,64 150,52 160,43 170,37 180,35 190,37 200,43 210,52 220,64 230,76 240,89 250,101 260,111 270,119 280,126 290,131 300,134 310,136 320,138 330,139 340,139 350,140" fill="none" class="dg-linie-akzent dg-dick"/>
<text x="180" y="154" text-anchor="middle" class="dg-klein">μ</text>
<text x="130" y="154" text-anchor="middle" class="dg-klein">−1σ</text>
<text x="230" y="154" text-anchor="middle" class="dg-klein">+1σ</text>
<text x="80" y="154" text-anchor="middle" class="dg-klein">−2σ</text>
<text x="280" y="154" text-anchor="middle" class="dg-klein">+2σ</text>
<text x="180" y="170" text-anchor="middle" class="dg-klein dg-leise">±1σ ≈ 68 % · ±2σ ≈ 95 % · ±3σ ≈ 99,7 %</text>
</svg>
```

### Beispiel
Reparaturzeiten mit μ = 60 min und σ = 10 min: 95 % dauern zwischen 60 − 2 · 10 = 40 und 60 + 2 · 10 = 80 Minuten, länger als 80 Minuten rund 2,5 %. Ein Auftrag mit 95 Minuten hat $z = \frac{95 - 60}{10} = 3{,}5$.

### Prüfungsfalle
Die 3-Sigma-Regel auf schiefe Daten wie Bestellwerte anwenden – dort ist die 1,5-IQR-Regel robuster.

### Merksatz
68 – 95 – 99,7: eins, zwei, drei Sigma.

Siehe auch: Standardabweichung · Z-Wert · Mittelwert · Boxplot · Ausreißer
Mehr: Deep Dive 3, 7.3

## NoSQL
<!-- id: nosql · quellen: Karte DD15, DD15 4.1 · stand: 2026-10 -->

Sammelbegriff für nicht-relationale Datenbanken (Dokument, Key-Value, Wide Column, Graph) mit flexiblem Schema und meist horizontaler Skalierung.

### Erklärung
| Typ | Beispiel | Geeignet für |
|---|---|---|
| dokumentenorientiert | MongoDB | Produktkataloge mit wechselnden Attributen |
| Key-Value | Redis | Sitzungen, Warenkörbe, Caches |
| spaltenorientiert (Wide Column) | Cassandra | große Schreiblasten, Sensordaten |
| Graph | Neo4j | Beziehungsnetze, Empfehlungen |

Viele NoSQL-Systeme verzichten zugunsten von Verfügbarkeit auf strikte ACID-Garantien und folgen **BASE** (Eventually Consistent); nach dem CAP-Theorem muss ein verteiltes System im Störfall zwischen Konsistenz und Verfügbarkeit wählen.

### Beispiel
Das Möbelhaus speichert seinen Onlinekatalog in einer Dokumentdatenbank: Ein Sofa hat Bezugsstoff und Sitzhöhe, eine Lampe Lichtfarbe und Leistung – ohne leere Spalten.

### Abgrenzung
Relationale Datenbanken: festes Schema, SQL, ACID, Skalierung meist vertikal.

### Prüfungsfalle
„Schemafrei“ als „ohne Regeln“ verstehen – Pflichtfelder und Datentypen prüft bei Schema-on-Read die Anwendung oder ETL-Strecke, sonst entstehen uneinheitliche Dokumente.

### Merksatz
NoSQL heißt „Not only SQL“: flexibel und skalierbar, aber Qualitätsregeln wandern in die Anwendung.

Siehe auch: Dokumentenorientierte Datenbank · Key-Value-Datenbank · Graphdatenbank · CAP-Theorem · BASE
Mehr: Deep Dive 15, 4.1

## NOT IN mit NULL
<!-- id: not-in-mit-null · quellen: DD1 3.1 · stand: 2026-10 -->

SQL-Falle: Enthält die Unterabfrage von `NOT IN` auch nur einen NULL-Wert, liefert die Abfrage keine einzige Zeile.

### Erklärung
`x NOT IN (1, 2, NULL)` bedeutet `x <> 1 AND x <> 2 AND x <> NULL`. Der letzte Vergleich ist nach der dreiwertigen Logik UNKNOWN, die ganze Bedingung damit nie wahr. Sicher sind **NOT EXISTS** oder ein Filter `IS NOT NULL` in der Unterabfrage.

### Beispiel
Gesucht sind Kunden ohne Bestellung (Weber und Braun). Hätte eine Bestellung kunden_id NULL, wäre das Ergebnis von `NOT IN` leer. So bleibt es richtig:

```sql
SELECT k.name
FROM kunde k
WHERE NOT EXISTS (SELECT 1 FROM bestellung b WHERE b.kunden_id = k.kunden_id);
```

### Abgrenzung
`IN` ist von NULL in der Liste nicht betroffen: Ein Treffer reicht für wahr. Nur die Verneinung kippt.

### Prüfungsfalle
Ein leeres Ergebnis als „alle Kunden haben bestellt“ deuten, statt die Unterabfrage auf NULL zu prüfen.

### Merksatz
Bei NOT IN reicht ein einziges NULL für null Zeilen.

Siehe auch: NULL · Dreiwertige Logik · NOT NULL · COALESCE
Mehr: Deep Dive 1, 3.1

## NOT NULL
<!-- id: not-null · quellen: DD1 2.5, DD2 1.5 · stand: 2026-10 -->

Constraint, der eine Spalte zum Pflichtfeld macht: Die Datenbank lehnt jede Zeile ohne Wert in dieser Spalte ab.

### Erklärung
NOT NULL sichert die Datenqualitätsdimension **Vollständigkeit** direkt an der Quelle. Beim Übertrag aus dem ER-Modell entscheidet die Min-Kardinalität: Muss jede Bestellung genau einen Kunden haben (1,1), wird der Fremdschlüssel kunden_id NOT NULL; bei (0,1) darf er NULL sein. Ein Primärschlüssel ist automatisch NOT NULL.

### Beispiel
```sql
CREATE TABLE retoure (
  retoure_id INTEGER PRIMARY KEY,
  bestell_id INTEGER NOT NULL,
  grund      VARCHAR(200) NOT NULL
);
```
Eine Retoure ohne Grund wird abgewiesen.

### Abgrenzung
| Constraint | Sichert |
|---|---|
| NOT NULL | Wert vorhanden |
| UNIQUE | Wert nicht doppelt (NULL meist erlaubt) |
| CHECK | Wert im zulässigen Bereich |

### Prüfungsfalle
Annehmen, NOT NULL verhindere leere Texte – ein Leerstring '' ist kein NULL und wird akzeptiert; dafür braucht es zusätzlich CHECK.

### Merksatz
NOT NULL erzwingt einen Wert, aber keinen sinnvollen.

Siehe auch: NULL · UNIQUE · CHECK · Primärschlüssel · Referenzielle Integrität
Mehr: Deep Dive 1, 2.5 · Deep Dive 2, 1.5

## Notarielle Beurkundung
<!-- id: notarielle-beurkundung · quellen: Karte DD14, DD14 2.3 · stand: 2026-10 -->

Strengste gesetzliche Form (§ 128 BGB): Ein Notar nimmt den gesamten Vertragsinhalt auf, liest ihn vor und lässt ihn genehmigen und unterschreiben.

### Erklärung
Die Beurkundung schützt bei folgenschweren Geschäften vor Übereilung und sorgt für Beratung und Beweis. Vorgeschrieben ist sie z. B. beim Grundstückskaufvertrag (§ 311b BGB), beim Gesellschaftsvertrag einer GmbH (§ 2 GmbHG) und beim Schenkungsversprechen. Fehlt die vorgeschriebene Form, ist das Geschäft nichtig (§ 125 BGB).

### Beispiel
Zwei Gründer wollen eine Analytics-GmbH gründen. Der Gesellschaftsvertrag wird beim Notar beurkundet; die anschließende Anmeldung zum Handelsregister braucht dagegen nur eine öffentliche Beglaubigung.

### Abgrenzung
| Form | Notar bestätigt |
|---|---|
| Schriftform | – (eigenhändige Unterschrift) |
| öffentliche Beglaubigung | nur die Echtheit der Unterschrift |
| notarielle Beurkundung | den gesamten Inhalt |

### Prüfungsfalle
Beglaubigung und Beurkundung verwechseln: Die Beglaubigung prüft nur, wer unterschrieben hat, nicht was.

### Merksatz
Beglaubigt wird die Unterschrift, beurkundet der ganze Vertrag.

Siehe auch: Schriftform · Textform · GmbH · Handelsregister
Mehr: Deep Dive 14, 2.3

## Notfallhandbuch
<!-- id: notfallhandbuch · quellen: Karte DD10, DD10 5.4 · stand: 2026-10 -->

Dokument des Notfallmanagements mit Alarmierungsketten, Zuständigkeiten, Ersatzlösungen und Wiederanlaufplänen für den Ernstfall.

### Erklärung
Im Notfall bleibt keine Zeit zum Nachdenken – das Notfallhandbuch legt vorher fest, wer wen informiert, wer entscheidet und in welcher Reihenfolge Systeme wieder anlaufen. Grundlage ist die Business-Impact-Analyse mit den Zielwerten RTO und RPO. Es muss auch ohne IT erreichbar sein (z. B. ausgedruckt) und wird durch Notfallübungen geprüft und aktuell gehalten.

### Beispiel
Fällt das Warenwirtschaftssystem des Möbelhauses aus, regelt das Handbuch: IT-Leitung alarmiert Geschäftsführung, Aufträge werden auf Papierformularen erfasst, zuerst wird die Datenbank, dann der Webshop aus dem Backup wiederhergestellt.

### Abgrenzung
| Begriff | Inhalt |
|---|---|
| Notfallmanagement | der gesamte Prozess (BCM) |
| Notfallhandbuch | das konkrete Dokument für den Ernstfall |
| Disaster Recovery | Wiederherstellung der IT nach einer Katastrophe |

### Prüfungsfalle
Ein Handbuch, das nur auf dem ausgefallenen Server liegt oder nie geübt wurde, gilt nicht als wirksame Maßnahme.

### Merksatz
Im Notfall liest man nach, statt nachzudenken – also vorher aufschreiben und üben.

Siehe auch: Notfallmanagement · Business-Impact-Analyse · RTO · RPO · Disaster Recovery
Mehr: Deep Dive 10, 5.4

## Notfallmanagement
<!-- id: notfallmanagement · quellen: Karte DD10, DD10 5.4 · stand: 2026-10 -->

Business Continuity Management: sorgt dafür, dass kritische Geschäftsprozesse auch bei schweren Ausfällen weiterlaufen oder schnell wieder anlaufen.

### Erklärung
Der Ablauf: In der **Business-Impact-Analyse** werden kritische Prozesse und tolerierbare Ausfallzeiten bestimmt; daraus folgen RTO (maximale Ausfallzeit) und RPO (maximaler Datenverlust). Dann werden Vorsorgemaßnahmen (Backups, Redundanz, Ausweichstandort) umgesetzt, ein Notfallhandbuch erstellt und regelmäßig geübt. Die Methodik beschreibt der BSI-Standard 200-4; NIS2 verlangt Notfallmanagement ausdrücklich.

### Beispiel
Das Möbelhaus legt fest: Der Webshop darf höchstens 4 Stunden ausfallen (RTO), höchstens 1 Stunde an Bestelldaten darf verloren gehen (RPO). Daraus folgen stündliche Sicherungen und ein Ersatzserver.

### Abgrenzung
**Incident Management** bearbeitet einzelne Sicherheitsvorfälle (erkennen, eindämmen, beseitigen); das Notfallmanagement greift, wenn ein Ausfall den Geschäftsbetrieb selbst gefährdet.

### Prüfungsfalle
Notfallmanagement auf „Backups machen“ reduzieren – ohne getestete Rücksicherung, Zuständigkeiten und Übungen ist es unvollständig.

### Merksatz
Notfallmanagement plant den Ernstfall, bevor er eintritt.

Siehe auch: Notfallhandbuch · Business-Impact-Analyse · RTO · RPO · Sicherheitsvorfall
Mehr: Deep Dive 10, 5.4

## NULL
<!-- id: null · quellen: Karte DD1, SQL-Zusatz 2.2, DD1 1.5, DD1 3.1 · stand: 2026-10 -->

Markierung für „Wert unbekannt oder nicht vorhanden“ – nicht 0 und nicht leerer Text.

Auch: NULL-Logik (Prüferklassiker)

### Erklärung
Jeder Vergleich mit NULL (`= NULL`, `<> NULL`) ergibt weder wahr noch falsch, sondern UNKNOWN; die Zeile erscheint nicht im Ergebnis. Prüfen kann man nur mit `IS NULL` bzw. `IS NOT NULL`. Rechnen mit NULL ergibt NULL. Aggregatfunktionen außer `COUNT(*)` ignorieren NULL – `AVG` teilt nur durch die Anzahl der vorhandenen Werte. `COALESCE` ersetzt NULL durch einen Ersatzwert.

### Beispiel
Bei Clara Fischer ist die E-Mail NULL:
```sql
SELECT vorname FROM kunde WHERE email IS NULL;   -- liefert Clara
SELECT vorname FROM kunde WHERE email = NULL;    -- liefert nichts
```
Bei den Werten 10, NULL, 20 ist `AVG` = 15, mit `AVG(COALESCE(x, 0))` dagegen 10.

### Abgrenzung
| Wert | Bedeutung |
|---|---|
| NULL | unbekannt / fehlt |
| 0 | bekannter Wert null |
| '' | bekannter, leerer Text |

### Prüfungsfalle
`WHERE email = NULL` schreiben – syntaktisch erlaubt, liefert aber nie eine Zeile.

### Merksatz
NULL ist kein Wert, sondern das Fehlen eines Werts – also IS NULL, nie = NULL.

Siehe auch: Dreiwertige Logik · COALESCE · NOT IN mit NULL · AVG ignoriert NULL · NOT NULL
Mehr: Deep Dive 1, 1.5 · Deep Dive 1, 3.1 · SQL-Zusatz, 2.2

## Nullhypothese
<!-- id: nullhypothese · quellen: Karte DD4, DD4 1.3 · stand: 2026-10 -->

Ausgangsannahme eines Signifikanztests, meist „es gibt keinen Effekt oder Zusammenhang“ (H0); sie wird nur verworfen, wenn die Daten unter ihr sehr unwahrscheinlich sind.

### Erklärung
Der Test berechnet den **p-Wert**: die Wahrscheinlichkeit, ein mindestens so deutliches Ergebnis zu erhalten, wenn H0 stimmt. Liegt p unter dem vorher festgelegten Signifikanzniveau (üblich 5 %), wird H0 verworfen und die **Alternativhypothese** H1 angenommen. Verwirft man H0 fälschlich, ist das ein Fehler 1. Art.

### Beispiel
H0: „Zwischen Schulungsstunden und Fehlerquote besteht in der Grundgesamtheit kein Zusammenhang.“ Der Test liefert p = 0,03 < 0,05 → H0 wird verworfen, der Zusammenhang gilt als signifikant.

### Abgrenzung
„Signifikant“ heißt nur „vermutlich kein Zufall“ – nicht „stark“ und nicht „kausal“. Bei sehr großen Datenmengen wird schon ein winziger Effekt signifikant.

### Prüfungsfalle
„H0 wurde nicht verworfen, also ist bewiesen, dass es keinen Zusammenhang gibt“ – falsch, die Daten reichen nur nicht für einen Nachweis.

### Merksatz
Man widerlegt die Nullhypothese – beweisen kann man sie nicht.

Siehe auch: P-Wert · Signifikanz · Alternativhypothese · Hypothesentest · Fehler 1. Art · Fehler 2. Art · Korrelation · Scheinkorrelation · Kausalität
Mehr: Deep Dive 4, 1.3

## Nur Untertabellen
<!-- id: nur-untertabellen · quellen: DD2 1.5 · stand: 2026-10 -->

Umsetzung einer Generalisierung, bei der nur die Untertypen eine Tabelle erhalten und die Attribute des Obertyps in jede Untertabelle kopiert werden.

### Erklärung
Es ist eine von drei Varianten, eine „ist-ein“-Beziehung ins Relationenmodell zu übertragen. Sie ist nur sinnvoll, wenn die Spezialisierung **total und disjunkt** ist: Jede Ausprägung gehört genau einem Untertyp an. Vorteil: keine Joins für einen Untertyp, keine NULL-Spalten. Nachteil: Abfragen über alle Ausprägungen brauchen `UNION`, und die Eindeutigkeit des Schlüssels über beide Tabellen prüft die Datenbank nicht von selbst.

### Beispiel
KUNDE mit PRIVATKUNDE und GESCHÄFTSKUNDE:
privatkunde(**kunden_id**, name, ort, geburtsdatum),
geschaeftskunde(**kunden_id**, name, ort, ust_id).

### Abgrenzung
| Variante | Vorteil | Nachteil |
|---|---|---|
| eine Tabelle je Entitätstyp | redundanzfrei | Joins nötig |
| nur Untertabellen | keine Joins, keine NULLs | UNION für Gesamtsicht |
| eine Gesamttabelle mit Typspalte | keine Joins | viele NULL-Werte |

### Prüfungsfalle
Die Variante wählen, obwohl es Kunden gibt, die keinem oder beiden Untertypen angehören.

### Merksatz
Nur Untertabellen nur dann, wenn jeder genau in eine passt.

Siehe auch: Generalisierung · Primärschlüssel · Fremdschlüssel · Denormalisierung
Mehr: Deep Dive 2, 1.5

## Nutzwert
<!-- id: nutzwert · quellen: Karte DD12, DD12 4.2 · stand: 2026-10 -->

Ergebnis einer Nutzwertanalyse: Summe aus Gewicht · Punkte über alle Kriterien; die Alternative mit dem höchsten Nutzwert gewinnt.

### Erklärung
Je Kriterium wird die Punktzahl mit dem Gewicht multipliziert (**Teilnutzen**), die Teilnutzen werden addiert: $\text{Nutzwert} = \sum \text{Gewicht}_i \cdot \text{Punkte}_i$. Die Gewichte summieren sich auf 100 %.

### Beispiel
| Kriterium | Gewicht | A | B |
|---|---|---|---|
| Funktionsumfang | 40 % | 8 → 3,20 | 6 → 2,40 |
| Kosten | 30 % | 5 → 1,50 | 9 → 2,70 |
| Integration | 20 % | 9 → 1,80 | 7 → 1,40 |
| Support | 10 % | 7 → 0,70 | 8 → 0,80 |
| Nutzwert | 100 % | 7,20 | 7,30 |

B gewinnt knapp. Mit Kosten 20 % und Funktionsumfang 50 % läge A mit 7,50 zu 7,00 vorn.

### Abgrenzung
Der Nutzwert ist eine dimensionslose Punktzahl, kein Geldbetrag – anders als Kapitalwert oder Einsparung.

### Prüfungsfalle
Die Punkte addieren, ohne sie zu gewichten, oder Gewichte verwenden, die nicht 100 % ergeben.

### Merksatz
Erst gewichten, dann addieren – und knappe Ergebnisse hinterfragen.

Siehe auch: Nutzwertanalyse · Kapitalwert · Amortisationszeit
Mehr: Deep Dive 12, 4.2

## Nutzwertanalyse
<!-- id: nutzwertanalyse · quellen: Karte DD12, DD12 Prüfungsrelevanz, DD12 4.2 · stand: 2026-10 -->

Entscheidungsverfahren mit gewichteten, auch nicht-monetären Kriterien: Punkte je Kriterium mal Gewicht, summiert zum Nutzwert.

### Erklärung
Ablauf: 1. Kriterien festlegen, 2. gewichten (Summe 100 %), 3. Punkte je Alternative vergeben (z. B. 1–10), 4. Punkte · Gewicht = Teilnutzen, 5. summieren, 6. Ergebnis kritisch beurteilen. Stärke: Qualitative Kriterien wie Bedienbarkeit oder Support werden vergleichbar und die Entscheidung nachvollziehbar dokumentiert. Schwäche: Auswahl, Gewichte und Punkte sind subjektiv; die Zahlen täuschen Genauigkeit vor.

### Beispiel
Die Möbelhaus Nordholz GmbH vergleicht zwei BI-Anbieter: A erreicht 7,20, B 7,30 Punkte. Der Abstand ist so klein, dass eine Sensitivitätsprüfung nötig ist – schon rund 2 Prozentpunkte Gewicht von den Kosten zum Funktionsumfang kippen das Ergebnis.

### Abgrenzung
| Verfahren | Bewertet |
|---|---|
| Nutzwertanalyse | qualitative und quantitative Kriterien, Punkte |
| Kostenvergleich, Amortisation, ROI | nur Geldgrößen |

### Prüfungsfalle
Das Ergebnis ohne Beurteilung übernehmen – die kritische Würdigung ist in der Klausur eigens bepunktet.

### Merksatz
Die Nutzwertanalyse macht Bauchgefühl nachvollziehbar, aber nicht objektiv.

Siehe auch: Nutzwert · Amortisationszeit · Make or Buy · Lastenheft
Mehr: Deep Dive 12, 4.2

## Ausgelassen
- Neu berechnen – Schrittbezeichnung k-Means
- Neue Zentren – Zwischenergebnis Rechenbeispiel
- Nicht erlaubt – Tabellenetikett Prokura
- Nur HTTPS – Listenpunkt API-Regeln
