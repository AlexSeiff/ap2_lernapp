<!-- Begriffsseiten T · Stand 2026-10 -->
## T – Transform
<!-- id: t-transform · quellen: DD8 3.1 · stand: 2026-10 -->

Mittlere Phase des ETL-Prozesses, in der die extrahierten Rohdaten bereinigt, vereinheitlicht, zusammengeführt, angereichert und geprüft werden, bevor sie ins Data Warehouse geladen werden.

### Erklärung
Transform ist der eigentliche Arbeitsschritt. Typische Aufgaben: **bereinigen** (fehlende Werte, Dubletten, Ausreißer), **vereinheitlichen** (Datumsformate, Einheiten, Währungen), **harmonisieren** (Schlüssel verschiedener Systeme zusammenführen), **anreichern** (berechnete Merkmale wie Deckungsbeitrag), **aggregieren** und **prüfen** mit Validierungsregeln. Fehlerhafte Sätze werden in eine Quarantäne ausgeleitet und protokolliert, nicht stillschweigend verworfen.

### Beispiel
„Kunde 4711“ im CRM und „K-1001“ in der Warenwirtschaft sind dieselbe Huber GmbH: Die Transformation ordnet beide einem Surrogatschlüssel zu, wandelt „15.01.2026“ in ISO 8601 (2026-01-15) und berechnet die Lieferdauer in Tagen. Ein Satz mit negativem Umsatz landet in der Quarantäne.

### Abgrenzung
| Phase | Aufgabe |
|---|---|
| E – Extract | Daten aus Quellsystemen lesen (voll oder Delta) |
| T – Transform | bereinigen, harmonisieren, prüfen |
| L – Load | ins Zielsystem laden, protokollieren |

Bei ELT wird erst geladen und dann im Zielsystem transformiert.

### Prüfungsfalle
Ungültige Datensätze in der Transformation einfach zu löschen ist falsch – die Information über das Problem und die Abstimmbarkeit der Summen gehen verloren.

### Merksatz
In T wird aus Rohdaten verlässliche Information.

Siehe auch: ETL · E – Extract · L – Load · Quarantäne · Harmonisieren
Mehr: Deep Dive 8, 3.1

## Tarifarten
<!-- id: tarifarten · quellen: DD13 5.1 · stand: 2026-10 -->

Einteilung der Tarifverträge nach ihrem Inhalt in Manteltarifvertrag, Entgelttarifvertrag und Rahmentarifvertrag.

### Erklärung
Der **Manteltarifvertrag** regelt allgemeine Arbeitsbedingungen wie Arbeitszeit, Urlaub, Zuschläge und Kündigungsfristen und hat eine lange Laufzeit. Der **Entgelttarifvertrag** (Lohn- bzw. Gehaltstarifvertrag) legt die Höhe von Löhnen, Gehältern und Ausbildungsvergütungen fest und läuft meist nur ein bis zwei Jahre. Der **Rahmentarifvertrag** (Entgeltrahmen) beschreibt Entgeltgruppen und die Tätigkeitsmerkmale, nach denen Beschäftigte eingruppiert werden.

### Beispiel
In einer Tarifrunde verhandeln Gewerkschaft und Arbeitgeberverband nur einen neuen Entgelttarifvertrag (+3,5 % ab April); der Manteltarifvertrag mit 30 Urlaubstagen läuft unverändert weiter.

### Abgrenzung
Nach den Vertragsparteien unterscheidet man dagegen Flächentarifvertrag (mit Arbeitgeberverband) und Haustarifvertrag (mit einzelnem Arbeitgeber).

### Prüfungsfalle
Urlaub und Arbeitszeit stehen im Manteltarifvertrag, nicht im Entgelttarifvertrag – die kurze Laufzeit gehört zum Entgelt.

### Merksatz
Mantel = Bedingungen, Entgelt = Geld, Rahmen = Eingruppierung.

Siehe auch: Manteltarifvertrag · Entgelttarifvertrag · Tarifvertrag · Tarifparteien
Mehr: Deep Dive 13, 5.1

## Tarifautonomie
<!-- id: tarifautonomie · quellen: Karte DD13 · stand: 2026-10 -->

Das aus der Koalitionsfreiheit (Art. 9 Abs. 3 GG) abgeleitete Recht der Tarifparteien, Löhne und Arbeitsbedingungen ohne staatliche Einmischung selbst auszuhandeln.

### Erklärung
Gewerkschaften und Arbeitgeberverbände bzw. einzelne Arbeitgeber schließen Tarifverträge in eigener Verantwortung. Der Staat setzt nur den Rahmen (Tarifvertragsgesetz, gesetzliche Mindeststandards wie Mindestlohn, Urlaub, Arbeitszeit) und mischt sich in Tarifverhandlungen nicht ein. Zur Tarifautonomie gehört das Recht zum Arbeitskampf: Streik und Aussperrung als letzte Mittel.

### Beispiel
Die Regierung hält eine Lohnerhöhung von 6 % für zu hoch, kann sie aber nicht verbieten. Einigen sich Gewerkschaft und Arbeitgeberverband darauf, gilt sie für die tarifgebundenen Beschäftigten.

### Abgrenzung
Die Koalitionsfreiheit ist das Grundrecht, Vereinigungen zu bilden und ihnen beizutreten (oder fernzubleiben); die Tarifautonomie ist deren Betätigung beim Aushandeln von Tarifverträgen.

### Prüfungsfalle
Der gesetzliche Mindestlohn widerspricht der Tarifautonomie nicht – er ist eine Untergrenze, keine Tarifvereinbarung.

### Merksatz
Über Löhne verhandeln die Tarifparteien, nicht der Staat.

Siehe auch: Koalitionsfreiheit · Tarifvertrag · Tarifparteien · Streik · Mindestlohn
Mehr: Deep Dive 13, 5.1

## Tarifbindung
<!-- id: tarifbindung · quellen: Karte DD13, DD13 5.2 · stand: 2026-10 -->

Unmittelbare und zwingende Geltung eines Tarifvertrags für die Mitglieder der Tarifvertragsparteien und für den Arbeitgeber, der selbst Vertragspartei ist (§ 3 Abs. 1 TVG).

### Erklärung
Tarifgebunden ist ein Arbeitsverhältnis, wenn der Beschäftigte Gewerkschaftsmitglied und der Arbeitgeber Mitglied im tarifschließenden Verband bzw. selbst Vertragspartei (Haustarif) ist. Darüber hinaus gilt ein Tarifvertrag für alle Arbeitsverhältnisse einer Branche, wenn das Bundesarbeitsministerium ihn für **allgemeinverbindlich** erklärt (§ 5 TVG). Häufig verweist auch der Arbeitsvertrag auf den Tarifvertrag (Bezugnahmeklausel) – dann gilt er kraft Vertrags, auch für Nichtmitglieder.

### Beispiel
Das Möbelhaus ist Mitglied im Arbeitgeberverband des Einzelhandels. Lea ist Gewerkschaftsmitglied – für sie gilt der Tarifvertrag unmittelbar. Ihr Kollege ist kein Mitglied, sein Arbeitsvertrag verweist aber auf den Tarifvertrag; er erhält dieselben Bedingungen.

### Abgrenzung
| Geltungsgrund | Rechtsgrundlage |
|---|---|
| Mitgliedschaft beider Seiten | § 3 TVG (Tarifbindung) |
| Allgemeinverbindlicherklärung | § 5 TVG |
| Verweis im Arbeitsvertrag | Arbeitsvertrag |

### Prüfungsfalle
Die Bindung endet nicht mit dem Austritt aus dem Verband – sie bleibt bestehen, bis der Tarifvertrag endet (§ 3 Abs. 3 TVG), danach wirkt er nach.

### Merksatz
Tarifgebunden ist, wer auf beiden Seiten Mitglied ist.

Siehe auch: Tarifvertrag · Allgemeinverbindlicherklärung · Nachwirkung · Günstigkeitsprinzip · Tarifparteien
Mehr: Deep Dive 13, 5.2

## Tarifparteien
<!-- id: tarifparteien · quellen: DD13 5.1 · stand: 2026-10 -->

Die Parteien eines Tarifvertrags: auf der einen Seite eine Gewerkschaft, auf der anderen ein Arbeitgeberverband oder ein einzelner Arbeitgeber.

### Erklärung
Schließt die Gewerkschaft mit einem **Arbeitgeberverband** ab, entsteht ein **Flächentarifvertrag** für eine Branche und Region. Schließt sie mit einem **einzelnen Arbeitgeber** ab, entsteht ein **Haustarifvertrag** (Firmentarifvertrag). Tarifparteien heißen auch Tarifvertragsparteien oder Sozialpartner. Ein einzelner Arbeitnehmer oder der Betriebsrat kann keine Tarifverträge schließen.

### Beispiel
ver.di und der Handelsverband eines Bundeslandes schließen den Flächentarif für den Einzelhandel. Ein großer Onlinehändler, der keinem Verband angehört, verhandelt mit ver.di einen eigenen Haustarif.

### Abgrenzung
| Vereinbarung | Parteien |
|---|---|
| Tarifvertrag | Gewerkschaft + Arbeitgeberverband/Arbeitgeber |
| Betriebsvereinbarung | Betriebsrat + Arbeitgeber |
| Arbeitsvertrag | Arbeitnehmer + Arbeitgeber |

### Prüfungsfalle
Der Betriebsrat ist keine Tarifpartei – er schließt Betriebsvereinbarungen, die tariflich Geregeltes grundsätzlich nicht regeln dürfen (Tarifvorbehalt).

### Merksatz
Gewerkschaft gegen Verband = Fläche, Gewerkschaft gegen Firma = Haus.

Siehe auch: Tarifvertrag · Tarifautonomie · Betriebsvereinbarung · Koalitionsfreiheit · Tarifarten
Mehr: Deep Dive 13, 5.1

## Tarifvertrag
<!-- id: tarifvertrag · quellen: Karte DD13 · stand: 2026-10 -->

Schriftlicher Vertrag zwischen Gewerkschaft und Arbeitgeberverband (Flächentarif) oder einzelnem Arbeitgeber (Haustarif) über Löhne und Arbeitsbedingungen.

### Erklärung
Der Tarifvertrag hat einen schuldrechtlichen Teil (Pflichten der Parteien, z. B. **Friedenspflicht**) und einen normativen Teil, der für tarifgebundene Arbeitsverhältnisse wie ein Gesetz unmittelbar und zwingend gilt. Abweichungen sind nur zugunsten der Beschäftigten erlaubt (**Günstigkeitsprinzip**). Nach Ablauf wirken die Regelungen nach, bis eine neue Abmachung sie ersetzt. In der Rangfolge steht er unter Gesetzen und über Betriebsvereinbarung und Arbeitsvertrag.

### Beispiel
Gesetz: 24 Werktage Urlaub, Tarifvertrag: 30 Tage, Arbeitsvertrag: 28 Tage. Eine tarifgebundene Beschäftigte erhält 30 Tage – der Arbeitsvertrag darf den Tarifvertrag nur verbessern.

### Abgrenzung
Die Betriebsvereinbarung gilt nur im Betrieb und wird mit dem Betriebsrat geschlossen; der Tarifvertrag gilt für alle tarifgebundenen Arbeitsverhältnisse seines Geltungsbereichs.

### Prüfungsfalle
Während der Laufzeit herrscht Friedenspflicht – Streiks über die geregelten Punkte sind dann unzulässig.

### Merksatz
Der Tarifvertrag setzt den Mindeststandard, besser geht immer, schlechter nie.

Siehe auch: Tarifbindung · Tarifarten · Günstigkeitsprinzip · Friedenspflicht · Nachwirkung
Mehr: Deep Dive 13, 5.1 · Deep Dive 13, 5.2

## Taschengeldparagraf
<!-- id: taschengeldparagraf · quellen: Karte DD14 · stand: 2026-10 -->

§ 110 BGB: Ein Vertrag eines beschränkt Geschäftsfähigen ist ohne Zustimmung der Eltern von Anfang an wirksam, wenn er die Leistung mit Mitteln bewirkt, die ihm zu diesem Zweck oder zur freien Verfügung überlassen wurden.

### Erklärung
Minderjährige von 7 bis 17 Jahren sind beschränkt geschäftsfähig; ihre Verträge sind grundsätzlich schwebend unwirksam, bis die Eltern zustimmen. Der Taschengeldparagraf ist eine Ausnahme: Wer mit überlassenem Geld **sofort vollständig bezahlt**, schließt einen wirksamen Vertrag. Die Eltern haben mit dem Überlassen des Geldes im Voraus zugestimmt.

### Beispiel
Eine 15-Jährige kauft von ihrem Taschengeld ein Videospiel für 30 € und bezahlt bar – wirksam. Schließt sie einen Handyvertrag mit 24 Monatsraten, ist er schwebend unwirksam, weil die Leistung nicht mit einer Zahlung bewirkt ist.

### Abgrenzung
| Geschäft | Wirksamkeit |
|---|---|
| Kauf mit Taschengeld, sofort bezahlt | wirksam (§ 110) |
| nur rechtlicher Vorteil (Geschenk) | wirksam (§ 107) |
| Ratenkauf, Abo, Laufzeitvertrag | schwebend unwirksam |

### Prüfungsfalle
Ratenkäufe und Laufzeitverträge fallen nie unter § 110 – auch wenn die erste Rate vom Taschengeld bezahlt wird.

### Merksatz
Bar bezahlt mit eigenem Taschengeld = gültig.

Siehe auch: Geschäftsfähigkeit · Rechtsfähigkeit · Kaufvertrag · Natürliche Personen
Mehr: Deep Dive 14, 2.1

## Task
<!-- id: task · quellen: Karte DD5, DD5 2.1, DD17 1.1 · stand: 2026-10 -->

Einzelne, nicht weiter zerlegte Aktivität in BPMN, dargestellt als abgerundetes Rechteck und benannt mit Verb + Objekt („Auftrag erfassen“).

### Erklärung
Tasks sind die Arbeitsschritte im Prozessmodell. Ein Marker oben links zeigt die Art: Personensymbol = **User Task** (Mensch mit Softwareunterstützung), Hand = **Manual Task** (ohne IT), Zahnrad = **Service Task** (automatisiert, z. B. Webservice), Umschlag = Send- bzw. Receive Task. Die Entscheidungsgrundlage für ein folgendes Gateway entsteht in einem Task („Kostenvoranschlag prüfen“), nicht im Gateway selbst.

### Beispiel
Reparaturprozess im Möbelhaus: „Reparaturauftrag erfassen“ (User Task), „Ersatzteil im ERP reservieren“ (Service Task), „Möbel beim Kunden abholen“ (Manual Task).

### Abgrenzung
| Element | Symbol | Bedeutung |
|---|---|---|
| Task | abgerundetes Rechteck | einzelne Aufgabe |
| Teilprozess | abgerundetes Rechteck mit „+“ | aufklappbarer Unterablauf |
| Ereignis | Kreis | etwas passiert |
| Gateway | Raute | Verzweigung |

### Prüfungsfalle
Tasks mit Substantiv („Prüfung“) oder als Zustand („geprüft“) benennen – richtig ist Verb + Objekt; „Auftrag geprüft“ wäre ein Ereignis.

### Merksatz
Task = Tätigkeit: Objekt + Verb im Rechteck.

Siehe auch: Teilprozess · BPMN · Ereignis · Gateway · Lane
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## TDDDG
<!-- id: tdddg · quellen: Karte DD10, DD10 2.4 · stand: 2026-10 -->

Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz: deutsches Gesetz zum Datenschutz bei Telekommunikation und digitalen Diensten; bis 13. Mai 2024 hieß es TTDSG.

Auch: TTDSG

### Erklärung
Prüfungsrelevant ist **§ 25 TDDDG**: Das Speichern von Informationen auf dem Endgerät oder der Zugriff darauf (Cookies, Tracking-Pixel, Fingerprinting) braucht eine Einwilligung – außer es ist für den vom Nutzer ausdrücklich gewünschten Dienst unbedingt erforderlich. Mit Inkrafttreten des Digitale-Dienste-Gesetzes (DDG) am 14. Mai 2024 wurde das TTDSG umbenannt, weil „Telemedien“ nun „digitale Dienste“ heißen; inhaltlich änderte sich kaum etwas.

### Beispiel
Der Onlineshop des Möbelhauses setzt ein Warenkorb-Cookie ohne Einwilligung (technisch notwendig). Für ein Analyse- und ein Werbe-Cookie muss das Cookie-Banner vorher die Zustimmung einholen; „Ablehnen“ muss so einfach sein wie „Akzeptieren“.

### Abgrenzung
| Gesetz | regelt |
|---|---|
| TDDDG § 25 | Zugriff auf das Endgerät (ob ein Cookie gesetzt werden darf) |
| DSGVO | Verarbeitung der damit gewonnenen personenbezogenen Daten |
| DDG | u. a. Impressumspflicht (§ 5 DDG), löste das TMG ab |

### Prüfungsfalle
In aktuellen Antworten nicht mehr „TTDSG“ oder „TMG“ als geltendes Recht nennen (Stand 2026) – höchstens als frühere Bezeichnung.

### Merksatz
Cookie nur mit Ja – außer der Shop funktioniert sonst nicht.

Siehe auch: Einwilligung · DSGVO · DDG · Privacy by Design · Personenbezogene Daten
Mehr: Deep Dive 10, 2.4

## TOM (Technische und organisatorische Maßnahmen)
<!-- id: tom · quellen: Karte DD10 · stand: 2026-10 -->

TOM nach Art. 32 DSGVO: Schutzmaßnahmen, mit denen der Verantwortliche ein dem Risiko angemessenes Schutzniveau für personenbezogene Daten sicherstellt.

Auch: Technische und organisatorische Maßnahmen, TOM

### Erklärung
Art. 32 nennt beispielhaft Pseudonymisierung und Verschlüsselung, die dauerhafte Sicherstellung von Vertraulichkeit, Integrität, Verfügbarkeit und Belastbarkeit der Systeme, die rasche Wiederherstellbarkeit nach einem Zwischenfall und ein Verfahren zur regelmäßigen Überprüfung der Wirksamkeit. Was angemessen ist, richtet sich nach Stand der Technik, Kosten, Art der Verarbeitung und Risiko für die Betroffenen. Auftragsverarbeiter müssen ebenfalls TOM nachweisen.

### Beispiel
| technisch | organisatorisch |
|---|---|
| Festplattenverschlüsselung der Notebooks | Berechtigungskonzept mit Rollen (RBAC) |
| Pseudonymisierte Kundennummern im Data Warehouse | Schulung zu Phishing |
| tägliches Backup mit Wiederherstellungstest | Vier-Augen-Prinzip bei Rechtevergabe |

**Beispiel Zugriffskontrolle** – die Personalakten der Möbelhaus Nordholz GmbH liegen im Personalsystem. Das Schutzziel Vertraulichkeit wird so umgesetzt:

| technisch | organisatorisch |
|---|---|
| Anmeldung mit Passwort und zweitem Faktor (MFA) | Berechtigungskonzept: Wer darf welche Akten lesen oder ändern? |
| Rollen und Rechte im System (RBAC), nur die Personalabteilung sieht Personalakten | Rechtevergabe nur auf schriftlichen Antrag mit Freigabe der Führungskraft |
| automatische Bildschirmsperre, Protokollierung der Zugriffe | regelmäßige Überprüfung der Rechte, Rechte-Entzug beim Abteilungswechsel |

Eine häufig verwendete Ordnungshilfe unterscheidet drei Stufen: **Zutrittskontrolle** (wer kommt in den Raum oder das Gebäude?), **Zugangskontrolle** (wer kann sich am System anmelden?) und **Zugriffskontrolle** (was darf er dort mit welchen Daten tun?). Die ausführliche Liste aus dem früheren BDSG (Anlage zu § 9) ist nicht mehr Gesetz, taugt aber weiterhin zum systematischen Aufzählen.

### Abgrenzung
Privacy by Design und by Default (Art. 25) verlangen, Datenschutz schon beim Entwurf einzubauen; Art. 32 regelt die laufende Sicherheit der Verarbeitung.

### Prüfungsfalle
Pseudonymisierung ist eine TOM, keine Befreiung von der DSGVO – die Daten bleiben personenbezogen.

### Merksatz
TOM = Technik plus Organisation, angemessen zum Risiko und regelmäßig geprüft.

Siehe auch: Pseudonymisierung · Privacy by Design · Schutzziele · Rechenschaftspflicht · Auftragsverarbeiter · RBAC · Mehr-Faktor-Authentifizierung
Mehr: Deep Dive 10, 2.4 · Deep Dive 10, 4.3

## Teilprozess
<!-- id: teilprozess · quellen: Karte DD5, DD5 2.1 · stand: 2026-10 -->

BPMN-Aktivität mit „+“-Zeichen unten in der Mitte, hinter der sich ein eigener, aufklappbarer Ablauf verbirgt.

### Erklärung
Teilprozesse (Sub-Processes) halten große Modelle übersichtlich: Auf der oberen Ebene steht nur der zugeklappte Teilprozess, sein Inneres wird in einem eigenen Diagramm oder aufgeklappt modelliert – mit eigenem Start- und Endereignis. So lässt sich ein Prozess von der Übersicht bis ins Detail verfeinern, und wiederkehrende Abläufe werden nur einmal modelliert.

### Beispiel
Im Reparaturprozess des Möbelhauses steht „Reparatur durchführen +“ als Teilprozess. Aufgeklappt enthält er „Schaden begutachten“, „Ersatzteil bestellen“, „Reparieren“ und „Qualitätskontrolle durchführen“.

### Abgrenzung
| Symbol | Bedeutung |
|---|---|
| abgerundetes Rechteck | Task (einzelne Aufgabe) |
| abgerundetes Rechteck mit „+“ | zugeklappter Teilprozess |
| Pool | eigener Teilnehmer, kein Teilprozess |

In der EPK entspricht dem Teilprozess der Prozesswegweiser.

### Prüfungsfalle
Das „+“ im Teilprozess ist kein AND-Gateway – ein Gateway ist eine Raute, der Teilprozess ein Rechteck.

### Merksatz
Plus im Rechteck = hier steckt ein ganzer Prozess drin.

Siehe auch: Task · BPMN · AND-Gateway · Prozesswegweiser · Pool
Mehr: Deep Dive 5, 2.1

## Termintreue
<!-- id: termintreu · quellen: Karte DD5, DD5 3.2 · stand: 2026-10 -->

Prozesskennzahl für die Zuverlässigkeit: Anteil der pünktlich erledigten Fälle an allen Fällen, $\text{Termintreue} = \frac{\text{pünktliche Fälle}}{\text{Gesamtfälle}} \cdot 100$.

### Erklärung
Was „pünktlich“ heißt, muss vorher festgelegt werden – z. B. zugesagter Liefertermin oder vereinbarte Bearbeitungsfrist. Die Termintreue zeigt aus Kundensicht, ob Zusagen eingehalten werden, und ergänzt Zeitkennzahlen wie die Durchlaufzeit: Ein Prozess kann im Mittel schnell sein und trotzdem oft zu spät liefern, wenn die Zeiten stark streuen.

### Beispiel
Im März schließt der Reparaturservice 50 Aufträge ab, 46 davon zum zugesagten Termin:
$\frac{46}{50} \cdot 100 = 92\,\%$ Termintreue.

### Abgrenzung
| Kennzahl | misst |
|---|---|
| Termintreue | Zusagen eingehalten? |
| Durchlaufzeit | wie lange ein Fall insgesamt dauert |
| Fehlerquote | Anteil fehlerhafter Fälle |
| First Pass Yield | Anteil ohne Nacharbeit |

### Prüfungsfalle
Eine kurze mittlere Durchlaufzeit garantiert keine hohe Termintreue – Ausreißer und Streuung entscheiden über verspätete Fälle.

### Merksatz
Termintreue fragt nicht „wie schnell?“, sondern „wie versprochen?“.

Siehe auch: Durchlaufzeit · Fehlerquote · First Pass Yield · KPI · Soll-Ist-Vergleich
Mehr: Deep Dive 5, 3.2

## Testdaten
<!-- id: testdaten · quellen: Karte DD6, DD6 2.1, DD7 1.1 · stand: 2026-10 -->

Beim maschinellen Lernen zurückgehaltener Teil der Daten, den das Modell beim Training nicht gesehen hat und mit dem am Ende die Güte unabhängig geprüft wird.

### Erklärung
Typisch sind 20–30 % der Daten. Die eiserne Regel: Testdaten dürfen zu keinem Zeitpunkt ins Training einfließen – auch nicht indirekt über Skalierungswerte, Merkmalsauswahl oder wiederholtes Nachjustieren am Testergebnis. Aufgeteilt wird zufällig (bei seltenen Klassen stratifiziert), bei Zeitreihen chronologisch.

### Beispiel
Von 10.000 Aufträgen des Möbelhauses dienen 8.000 zum Trainieren des Reklamationsmodells und 2.000 als Testdaten; nur die Kennzahlen auf diesen 2.000 werden der Fachabteilung berichtet.

### Abgrenzung
| Datensatz | Zweck |
|---|---|
| Trainingsdaten | Modell lernt daraus |
| Validierungsdaten | Parameter einstellen während der Entwicklung |
| Testdaten | abschließende, unabhängige Prüfung |

Im Softwaretest meint „Testdaten“ dagegen die Eingabedaten eines Testfalls.

### Prüfungsfalle
Wer Testdaten zum Einstellen von Parametern nutzt, verbraucht ihre Unabhängigkeit – dafür gibt es Validierungsdaten oder Kreuzvalidierung.

### Merksatz
Testdaten sieht das Modell erst in der Prüfung.

Siehe auch: Trainingsdaten · Validierungsdaten · Train-Test-Split · Kreuzvalidierung · Testdatengüte
Mehr: Deep Dive 6, 2.1 · Deep Dive 7, 1.1

## Testdatengüte
<!-- id: testdatengute · quellen: Karte DD7, DD7 4.1 · stand: 2026-10 -->

Modellgüte, gemessen auf den Testdaten – nur sie zeigt, wie gut ein Modell auf neue, unbekannte Fälle verallgemeinert.

### Erklärung
Auf den Trainingsdaten sieht fast jedes Modell gut aus, weil es sie kennt. Für eine Modellbewertung zählt deshalb die Güte auf den Testdaten, berichtet zusammen mit einer Baseline, der fachlich passenden Kennzahl und einer wirtschaftlichen Bewertung. Der Vergleich von Trainings- und Testgüte verrät zugleich Over- oder Underfitting.

### Beispiel
Reklamationsmodell: 99 % Accuracy auf den Trainingsdaten, 71 % auf den Testdaten. Berichtet werden die 71 % – und die große Lücke zeigt Overfitting.

### Abgrenzung
| Trainingsgüte | Testgüte | Diagnose |
|---|---|---|
| sehr hoch | deutlich niedriger | Overfitting |
| niedrig | niedrig | Underfitting |
| hoch | ähnlich hoch | gute Verallgemeinerung |

### Prüfungsfalle
Trainingsgüte statt Testgüte berichten gehört zu den häufigsten Fehlern aus Prüfersicht.

### Merksatz
Was zählt, ist die Note in der Prüfung, nicht bei den Hausaufgaben.

Siehe auch: Testdaten · Overfitting · Underfitting · Baseline · Kreuzvalidierung
Mehr: Deep Dive 7, 4.1

## Testdesign
<!-- id: testdesign · quellen: Karte DD6, DD6 1.1 · stand: 2026-10 -->

Aufgabe der CRISP-DM-Phase Modeling: Festlegen, wie die Güte des Modells geprüft wird, z. B. durch Aufteilung in Trainings- und Testdaten oder Kreuzvalidierung.

### Erklärung
Das Testdesign wird vor dem Modellbau bestimmt, damit die Bewertung nicht nachträglich zum Ergebnis passend gemacht wird. Es legt fest: Aufteilungsverfahren (zufällig, stratifiziert, chronologisch), Größe der Testmenge oder Zahl der Folds, Gütekennzahl und Baseline. Die vier generischen Aufgaben der Phase Modeling sind Verfahren auswählen, Testdesign festlegen, Modell erstellen, Modell technisch bewerten.

### Beispiel
Für das Reklamationsmodell (10 % Reklamationen) legt das Team fest: stratifizierte 5-fache Kreuzvalidierung, Hauptkennzahl Recall, Vergleich mit der Baseline „immer keine Reklamation“.

### Abgrenzung
Das Testdesign (Phase Modeling) prüft das Modell technisch; die Phase Evaluation prüft, ob das Ergebnis das fachliche Ziel aus dem Business Understanding erfüllt. Ein Testkonzept im Softwaretest ist ein anderer Plan.

### Prüfungsfalle
Das Testdesign gehört zu Modeling, nicht zu Evaluation – beliebte Zuordnungsfrage.

### Merksatz
Erst festlegen, wie geprüft wird, dann modellieren.

Siehe auch: CRISP-DM · Train-Test-Split · Kreuzvalidierung · Stratifizierte Aufteilung · Baseline
Mehr: Deep Dive 6, 1.1

## Testen
<!-- id: testen · quellen: Karte DD16, DD16 1.3 · stand: 2026-10 -->

Ausführen eines Systems oder Programms mit dem Ziel, Fehlerwirkungen zu finden; ein Test kann nur die Anwesenheit von Fehlern zeigen, nie ihre Abwesenheit.

### Erklärung
Testen ist dynamische, analytische Qualitätssicherung: Das Testobjekt läuft, das tatsächliche Ergebnis wird mit dem vorher festgelegten erwarteten Ergebnis verglichen. Weil vollständiges Testen praktisch unmöglich ist, wählt man Testfälle systematisch (Äquivalenzklassen, Grenzwerte, Überdeckung) und legt im Testkonzept Ende-Kriterien fest.

### Beispiel
Das Dashboard zeigt 19 % zu viel Umsatz (Fehlerwirkung), weil das Skript Bruttobeträge summiert (Fehlerzustand), weil der Entwickler Netto und Brutto verwechselt hat (Fehlhandlung). Der Test findet die Wirkung, das anschließende Debugging die Ursache.

### Abgrenzung
| Tätigkeit | Ziel |
|---|---|
| Testen | Fehlerwirkungen sichtbar machen |
| Debugging | Fehlerzustand finden und beheben |
| Review | Fehler ohne Ausführung im Dokument/Code finden |

### Prüfungsfalle
„Alles getestet, also fehlerfrei“ ist falsch – Tests belegen nur, dass in den geprüften Fällen nichts schiefging.

### Merksatz
Testen zeigt Fehler, Debugging behebt sie.

Siehe auch: Testfall · Debugging · Fehlerwirkung · Review · Testkonzept
Mehr: Deep Dive 16, 1.3

## Testfall
<!-- id: testfall · quellen: Karte DD16 · stand: 2026-10 -->

Dokumentierte Prüfanweisung mit Vorbedingung, Eingabe bzw. Testdaten und erwartetem Ergebnis, ergänzt nach der Durchführung um das tatsächliche Ergebnis und den Status.

### Erklärung
Ein vollständiger Testfall enthält ID, Testobjekt bzw. Anforderung, Vorbedingung, Eingabe, **erwartetes Ergebnis**, tatsächliches Ergebnis und Status (bestanden/nicht bestanden). Das erwartete Ergebnis wird vor der Durchführung festgelegt, sonst passt man es unbewusst an. Testfälle entstehen aus Testverfahren wie Äquivalenzklassen und Grenzwertanalyse.

### Beispiel
| Feld | Inhalt |
|---|---|
| ID | TF-07 |
| Anforderung | A-12 Ladeprozess Umsatzdaten |
| Vorbedingung | Quelle mit 1.250 März-Bestellungen, Zieltabelle leer |
| Eingabe | Maerz_Test.csv |
| erwartet | 1.250 Zeilen, Umsatzsumme 184.320,50 € |
| tatsächlich / Status | bei Durchführung eintragen |

### Abgrenzung
Das Testkonzept plant alle Tests, der Testfall beschreibt einen einzelnen, das Testprotokoll dokumentiert die Durchführung.

### Prüfungsfalle
Ein Testfall ohne konkretes, messbares erwartetes Ergebnis („Daten werden korrekt geladen“) ist nicht prüfbar.

### Merksatz
Erst das Soll aufschreiben, dann das Ist messen.

Siehe auch: Testkonzept · Äquivalenzklasse · Grenzwertanalyse · Testen · Regressionstest
Mehr: Deep Dive 16, 3.2

## Testgetriebene Entwicklung (TDD)
<!-- id: testgetriebene-entwicklung · quellen: Karte DD16, DD16 2.4 · stand: 2026-10 -->

Test-Driven Development: Entwicklungsweise, bei der zuerst ein fehlschlagender Test geschrieben wird (Red), dann gerade so viel Code, dass er besteht (Green), und anschließend der Code aufgeräumt wird (Refactor).

### Erklärung
Der Zyklus Red – Green – Refactor wiederholt sich in kleinen Schritten. Dadurch hat jede Funktion von Anfang an automatisierte Komponententests, die als Regressionstests weiterlaufen und das Refactoring absichern. Der Test beschreibt vorab, was der Code leisten soll – er ist zugleich eine ausführbare Spezifikation.

### Beispiel
Für die Versandkostenfunktion schreibt ein Entwickler zuerst den Test „6 Packstücke → Spedition“. Er schlägt fehl, weil die Funktion noch fehlt (Red). Dann implementiert er die Regel, bis der Test grün ist (Green), und vereinfacht danach die Verzweigung (Refactor), ohne dass der Test rot wird.

### Abgrenzung
Klassisch wird erst programmiert und dann getestet; bei TDD ist die Reihenfolge umgekehrt. TDD ersetzt keine System- und Abnahmetests – es erzeugt vor allem Komponententests.

### Prüfungsfalle
Die Reihenfolge ist Red – Green – Refactor; „erst Code, dann Test“ ist gerade kein TDD.

### Merksatz
Erst rot, dann grün, dann schön.

Siehe auch: Regressionstest · Komponententest · Testpyramide · Testfall
Mehr: Deep Dive 16, 2.4

## Testkonzept
<!-- id: testkonzept · quellen: Karte DD16, DD16 3.1 · stand: 2026-10 -->

Vor Testbeginn erstellter Plan, der festlegt, was, wie, womit, von wem und bis wann getestet wird – einschließlich der Ende-Kriterien.

### Erklärung
Inhalte: Testobjekte und Testziele (welche Anforderungen?), Teststufen und Testverfahren, Testumgebung und Testdaten, **Ende-Kriterien** (wann ist genug getestet?), Rollen, Zeitplan und der Umgang mit gefundenen Fehlern (Fehlerklassen). Das Testkonzept macht die Aussage „ausreichend getestet“ überhaupt erst belegbar.

### Beispiel
Testkonzept für das neue Reporting: Komponententests der SQL-Skripte, Integrationstest der ETL-Strecke, Systemtest gegen das Pflichtenheft, Abnahmetest durch den Fachbereich; synthetische Testdaten statt echter Kundendaten; Ende-Kriterium: alle Muss-Anforderungen getestet, kein offener Fehler der Klasse „kritisch“.

### Abgrenzung
| Dokument | Inhalt |
|---|---|
| Testkonzept | Plan aller Tests |
| Testfall | ein einzelner Test mit Soll-Ergebnis |
| Testprotokoll | Durchführung und Ergebnisse |
| Abnahmeprotokoll | Entscheidung des Auftraggebers |

### Prüfungsfalle
Ohne Ende-Kriterien gibt es keinen sachlichen Grund, mit dem Testen aufzuhören – „bis die Zeit um ist“ ist kein Kriterium.

### Merksatz
Das Testkonzept sagt vorher, wann das Testen fertig ist.

Siehe auch: Testfall · Ende-Kriterien · Systemtest · Abnahmetest · Testen
Mehr: Deep Dive 16, 3.1

## Testpyramide
<!-- id: testpyramide · quellen: Karte DD16, DD16 2.4 · stand: 2026-10 -->

Leitbild für die Verteilung automatisierter Tests: viele schnelle Komponententests als Basis, weniger Integrationstests, wenige teure End-to-End- bzw. Oberflächentests an der Spitze.

### Erklärung
Je weiter oben, desto langsamer, teurer und wartungsintensiver ist ein Test, und desto schwerer lässt sich ein Fehler eingrenzen. Deshalb sichert man die Logik breit mit Komponententests ab und prüft über die Oberfläche nur die wichtigsten Abläufe.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150" width="300" height="150" role="img" aria-label="Testpyramide mit drei Ebenen">
<polygon points="150,10 190,50 110,50" class="dg-rot"/>
<polygon points="110,50 190,50 230,90 70,90" class="dg-mittel"/>
<polygon points="70,90 230,90 270,130 30,130" class="dg-gut"/>
<text x="150" y="38" text-anchor="middle" class="dg-klein">E2E</text>
<text x="150" y="74" text-anchor="middle" class="dg-klein">Integration</text>
<text x="150" y="114" text-anchor="middle" class="dg-klein">Komponententests</text>
<text x="150" y="146" text-anchor="middle" class="dg-leise">viele, schnell, billig</text>
</svg>
```

### Beispiel
Reporting des Möbelhauses: rund 200 Komponententests für SQL-Funktionen und Transformationen, 20 Integrationstests für die ETL-Strecke, 5 End-to-End-Tests, die das Dashboard im Browser öffnen.

### Abgrenzung
Das Gegenbild heißt „Eistüte“: überwiegend Oberflächentests, kaum Komponententests – langsam, instabil und teuer in der Pflege.

### Prüfungsfalle
Die Pyramide beschreibt die Menge der Tests je Ebene, nicht die Reihenfolge der Teststufen im V-Modell.

### Merksatz
Breit unten, schmal oben.

Siehe auch: Komponententest · Integrationstest · Regressionstest · Testgetriebene Entwicklung (TDD) · Systemtest
Mehr: Deep Dive 16, 2.4

## Teufelsquadrat
<!-- id: teufelsquadrat · quellen: Karte DD12, DD12 1.1 · stand: 2026-10 -->

Erweiterung des magischen Dreiecks nach Harry Sneed mit den vier Größen Qualität, Quantität (Umfang), Zeit und Kosten; bei gleicher Kapazität geht jede Verbesserung einer Größe zulasten mindestens einer anderen.

### Erklärung
Die vier Größen bilden die Ecken eines Quadrats, die Fläche darin steht für die Leistungsfähigkeit (Kapazität) des Teams und bleibt konstant. Zieht man eine Ecke nach außen – mehr Umfang, höhere Qualität, kürzere Zeit oder geringere Kosten –, muss eine andere Ecke nach innen. Gegenüber dem magischen Dreieck trennt das Teufelsquadrat die Leistung in Quantität und Qualität.

### Beispiel
Die Geschäftsführung will das Reporting vier Wochen früher. Bei gleichem Team und Budget bleiben zwei Wege: weniger Berichte (Quantität) oder weniger Tests (Qualität) – oder es wird mehr Personal bezahlt (Kosten).

### Abgrenzung
| Modell | Größen |
|---|---|
| Magisches Dreieck | Zeit – Kosten – Leistung/Qualität |
| Teufelsquadrat | Zeit – Kosten – Quantität – Qualität |

### Prüfungsfalle
„Alles gleichzeitig verbessern“ ist die falsche Antwort – Prüfer erwarten die Abwägung, welche Größe nachgibt.

### Merksatz
Wer an einer Ecke zieht, drückt eine andere hinein.

Siehe auch: Magisches Dreieck · Projekt · Scope Creep · Änderungsmanagement
Mehr: Deep Dive 12, 1.1

## Textform
<!-- id: textform · quellen: Karte DD14, DD13 1.2, DD13 3.1, DD14 2.3 · stand: 2026-10 -->

Formvorschrift nach § 126b BGB: eine lesbare Erklärung, in der der Erklärende genannt ist, auf einem dauerhaften Datenträger – E-Mail, Fax oder PDF genügen, eine Unterschrift ist nicht nötig.

### Erklärung
Textform ist die schwächste gesetzliche Form, stärker nur als „formfrei“. Dauerhafter Datenträger heißt: Der Empfänger kann die Erklärung speichern und unverändert wiedergeben. Textform genügt seit 01.08.2024 für den Ausbildungsvertrag und seit 01.01.2025 für den Nachweis der Arbeitsbedingungen nach dem Nachweisgesetz (außer in Branchen nach § 2a SchwarzArbG oder wenn der Arbeitnehmer die Schriftform verlangt).

### Beispiel
Das Möbelhaus schickt Lea die wesentlichen Vertragsbedingungen als PDF per E-Mail mit der Bitte um Empfangsbestätigung – Textform erfüllt. Eine Kündigung per E-Mail wäre dagegen unwirksam.

### Abgrenzung
| Form | Anforderung | Beispiel |
|---|---|---|
| Textform | lesbar, dauerhafter Datenträger | Mieterhöhungsverlangen, Nachweis nach NachwG |
| Schriftform | eigenhändige Unterschrift | Kündigung des Arbeitsvertrags, Befristung |
| notarielle Beurkundung | Notar beurkundet den Inhalt | Grundstückskauf, GmbH-Vertrag |

### Prüfungsfalle
Textform und Schriftform verwechseln – für die Kündigung eines Arbeitsverhältnisses reichen weder E-Mail noch WhatsApp (§ 623 BGB).

### Merksatz
Textform = lesbar und speicherbar, Schriftform = eigenhändig unterschrieben.

Siehe auch: Schriftform · Notarielle Beurkundung · Nachweisgesetz · Arbeitsvertrag · Form
Mehr: Deep Dive 14, 2.3 · Deep Dive 13, 1.2 · Deep Dive 13, 3.1

## Timestamp
<!-- id: timestamp · quellen: DD5 5.1 · stand: 2026-10 -->

Zeitstempel eines Ereignisses im Event Log – eines der drei Pflichtfelder des Process Mining; er bestimmt die Reihenfolge der Aktivitäten eines Falls.

### Erklärung
Aus Case ID, Activity und Timestamp rekonstruiert Process Mining den tatsächlichen Ablauf: Die Zeitstempel ordnen die Aktivitäten eines Falls und liefern Durchlauf- und Liegezeiten je Fall und je Schritt. Ihre Qualität entscheidet über das Ergebnis: Fehlende, zu grobe (nur Datum) oder zeitzonenfalsche Zeitstempel verfälschen Reihenfolge und Dauern.

### Beispiel
| Case ID | Activity | Timestamp |
|---|---|---|
| R-1001 | Auftrag erfassen | 2026-03-02 09:14 |
| R-1001 | Kostenvoranschlag senden | 2026-03-03 16:40 |

Liegezeit zwischen beiden Schritten: rund 31,4 Stunden.

### Abgrenzung
| Feld | Zweck |
|---|---|
| Case ID | ordnet Ereignisse einem Fall zu |
| Activity | benennt den Schritt |
| Timestamp | Reihenfolge und Zeitmessung |
| Resource (optional) | wer ausgeführt hat |

### Prüfungsfalle
Stehen mehrere Ereignisse nur mit Datum ohne Uhrzeit im Log, ist ihre Reihenfolge innerhalb eines Tages zufällig – das erzeugt scheinbare Prozessvarianten.

### Merksatz
Ohne genauen Zeitstempel keine richtige Reihenfolge.

Siehe auch: Event Log · Case ID · Activity · Zu grobe Zeitstempel · Process Mining
Mehr: Deep Dive 5, 5.1

## Token (BPMN)
<!-- id: token · quellen: Karte DD5, DD5 2.1 · stand: 2026-10 -->

Gedachte Marke, mit der man den Ablauf eines BPMN-Modells durchspielt: Sie startet im Startereignis und folgt den Sequenzflüssen; Gateways kopieren, lenken oder vereinigen sie.

### Erklärung
| Gateway | Split | Join |
|---|---|---|
| XOR | Token läuft in genau einen Pfad | jedes ankommende Token geht sofort weiter |
| AND | Token wird für jeden Pfad kopiert | wartet auf Tokens aller Eingänge, dann geht eines weiter |
| OR | Token für jeden zutreffenden Pfad | wartet auf alle tatsächlich aktivierten Pfade |

Mit der Token-Semantik prüft man ein Modell auf Fehler, bevor es umgesetzt wird.

### Beispiel
Nach „Auftrag annehmen“ teilt ein AND-Gateway in „Ersatzteil bestellen“ und „Termin vereinbaren“: Zwei Tokens laufen parallel. Ein XOR-Join danach würde jedes Token durchlassen – „Rechnung schreiben“ liefe zweimal.

### Abgrenzung
Das Token ist ein Denkmodell zur Ausführungslogik, kein Symbol im Diagramm. Datenobjekte und Nachrichtenflüsse transportieren keine Tokens des Sequenzflusses.

### Prüfungsfalle
XOR-Split mit AND-Join ergibt einen Deadlock: Das AND wartet auf ein Token, das nie kommt.

### Merksatz
Spiel das Modell mit dem Finger als Token durch – hängt es oder verdoppelt es sich, ist es falsch.

Siehe auch: AND-Gateway · XOR-Gateway · Deadlock · Gateway · Sequenzfluss
Mehr: Deep Dive 5, 2.1

## Total Cost of Ownership
<!-- id: total-cost-of-ownership · quellen: Karte DD12, DD12 4.1 · stand: 2026-10 -->

Gesamtkosten einer Investition über den ganzen Lebenszyklus: Anschaffung, Einführung, Schulung, Betrieb, Wartung, Anpassung und Ablösung bzw. Außerbetriebnahme.

### Erklärung
Die TCO macht sichtbar, dass der Kaufpreis oft nur ein kleiner Teil der Kosten ist. Laufende Kosten (Lizenzen, Wartung, Betrieb, Support, Personal) und versteckte Kosten (Einarbeitung, Ausfallzeiten, Migration) entscheiden über die Wirtschaftlichkeit. TCO-Vergleiche sind die Grundlage für Make-or-Buy- und Anbieterentscheidungen.

**Angebotsvergleich über die Nutzungsdauer:** Man unterscheidet **einmalige** Kosten (Grundpreis, Hardware) und **laufende** Kosten (Lizenzmiete, Support, Updates), multipliziert die laufenden Kosten mit der richtigen Zahl an Jahren und rechnet nur die **zusätzlich** benötigte Menge ab, wenn Leistungen im Grundpreis enthalten sind. Formel: $\text{Gesamtkosten} = \text{einmalige Kosten} + \sum (\text{laufende Kosten je Jahr} \cdot \text{Anzahl der Jahre})$. Gilt eine Leistung „ab dem zweiten Jahr“, zählt sie Nutzungsdauer minus 1 Mal. Am Ende stehen der Differenzbetrag und eine begründete Empfehlung – auch mit nicht rechenbaren Punkten wie Abhängigkeit oder Planbarkeit.

### Beispiel
BI-Software für das Möbelhaus über fünf Jahre:
Anschaffung 20.000 € + Einführung und Schulung 5.000 € + Lizenzen und Betrieb $5 \cdot 6.000 = 30.000$ € + Ablösung 2.000 € = **57.000 €**. Ein Konkurrenzprodukt für 12.000 € mit 9.000 € laufenden Kosten pro Jahr erreicht schon mit Kauf und Betrieb $12.000 + 5 \cdot 9.000 = 57.000$ € – mit Einführung und Ablösung ist es trotz des niedrigeren Kaufpreises teurer.

**Zwei Angebote über fünf Jahre.** Die Möbelhaus Nordholz GmbH braucht für ein Ausleihsystem drei Lizenzen und plant fünf Jahre Nutzung.
- Angebot X: Grundpreis 6.000 € einmalig inkl. 2 Lizenzen; jede weitere Lizenz 400 € je Jahr; Support 50 € je Anfrage bei 30 Anfragen im Jahr; ein Update je Jahr für 900 €, erstmals im zweiten Jahr.
- Angebot Y: 14.000 € einmalig inkl. 3 Lizenzen, Support und Updates enthalten.

Angebot X: Grundpreis 6.000 € + zusätzliche Lizenz $1 \cdot 400 \cdot 5 = 2.000$ € + Support $30 \cdot 5 \cdot 50 = 7.500$ € + Updates $4 \cdot 900 = 3.600$ € = **19.100 €**. Angebot Y: **14.000 €**. Differenz $19.100 - 14.000$ = **5.100 €** zugunsten von Y. Empfehlung: Angebot Y – günstiger über die Nutzungsdauer und planbar; Nachteil ist die höhere Anfangsinvestition (14.000 € statt 6.000 €).

### Abgrenzung
TCO sammelt die Kosten; ROI, Amortisationszeit und Kapitalwert stellen ihnen den Nutzen gegenüber.

### Prüfungsfalle
Nur den Anschaffungspreis vergleichen – der häufigste Fehler in Wirtschaftlichkeitsrechnungen. Beim Mehrjahresvergleich außerdem: Updates „ab dem zweiten Jahr“ für alle Jahre zählen, Inklusivlizenzen im Grundpreis doppelt abrechnen oder die Empfehlung ohne Begründung abgeben.

### Merksatz
Der Preis ist der Eintritt, die TCO ist die ganze Reise.

Siehe auch: Make or Buy · Return on Investment · Amortisationszeit · Wirtschaftlichkeitsbetrachtung · Laufend
Mehr: Deep Dive 12, 4.1 · Deep Dive 21, 6.2

## Total Quality Management
<!-- id: total-quality-management · quellen: Karte DD5, DD5 6.3 · stand: 2026-10 -->

Umfassendes Managementkonzept, bei dem Qualität Aufgabe aller Beschäftigten und aller Prozesse ist, ausgerichtet auf Kundenzufriedenheit und ständige Verbesserung.

### Erklärung
TQM geht über eine Norm hinaus: Es verankert Qualität in Führung, Unternehmenskultur und jedem Prozess, nicht nur in einer Qualitätsabteilung. Ein verbreitetes Bewertungsmodell ist das **EFQM-Modell**. Werkzeuge sind u. a. PDCA bzw. KVP, Six Sigma und FMEA. Für ein zertifizierbares Qualitätsmanagementsystem ist die **ISO 9001** maßgeblich – seit 16.09.2026 in der Fassung ISO 9001:2026, bestehende Zertifikate werden bis September 2029 umgestellt (Stand 2026).

### Beispiel
Im Möbelhaus misst nicht nur die Qualitätssicherung Reklamationen: Monteure melden Ursachen direkt, das Lager verbessert die Verpackung, die Führung bewertet Filialen auch nach Kundenzufriedenheit.

### Abgrenzung
| Ansatz | Kern |
|---|---|
| TQM | ganzheitliche Unternehmensphilosophie |
| ISO 9001 | zertifizierbare Mindestanforderungen an ein QM-System |
| Six Sigma | datengetriebene Reduktion der Streuung (DMAIC) |
| KVP/Kaizen | kontinuierliche kleine Verbesserungen |

### Prüfungsfalle
Ein ISO-9001-Zertifikat ist nicht dasselbe wie TQM – es belegt ein QM-System, nicht eine gelebte Qualitätskultur.

### Merksatz
Bei TQM ist Qualität jedermanns Job.

Siehe auch: Six Sigma · KVP · PDCA · FMEA · Kaizen
Mehr: Deep Dive 5, 6.3

## Train-Test-Split
<!-- id: train-test-split · quellen: Karte DD7 · stand: 2026-10 -->

Aufteilung der Daten vor dem Training in eine Trainings- und eine Testmenge (z. B. 80/20), damit die Modellgüte an unbekannten Daten gemessen werden kann.

### Erklärung
Die Aufteilung erfolgt **zufällig**, bei seltenen Klassen **stratifiziert** (gleicher Klassenanteil in beiden Mengen). Bei Zeitreihen wird **chronologisch** getrennt – Vergangenheit trainieren, Zukunft testen –, sonst gelangen Informationen aus der Zukunft ins Training. Resampling wie Oversampling erfolgt erst nach dem Split und nur auf den Trainingsdaten.

### Beispiel
10.000 Aufträge mit 10 % Reklamationen: stratifiziert 8.000 Trainings- und 2.000 Testfälle, beide mit je 10 % Reklamationen. Für die Umsatzprognose dagegen: Jahre 2022–2024 trainieren, 2025 testen.

### Abgrenzung
Ein einfacher Split nutzt jede Zeile nur für eine Rolle und hängt vom Zufall der Aufteilung ab; die k-fache Kreuzvalidierung testet jeden Datensatz einmal und mittelt k Ergebnisse – stabiler, aber k-facher Rechenaufwand.

### Prüfungsfalle
Die Daten sortiert lassen und einfach die ersten 80 % nehmen – das Modell lernt dann nur einen Ausschnitt (z. B. ein Quartal oder eine Region).

### Merksatz
Erst teilen, dann trainieren – und der Test bleibt unberührt.

Siehe auch: Testdaten · Trainingsdaten · Kreuzvalidierung · Stratifizierte Aufteilung · Validierungsdaten · Data Leakage
Mehr: Deep Dive 7, 1.1

## Trainingsdaten
<!-- id: trainingsdaten · quellen: Karte DD6, DD6 2.1, DD7 1.1 · stand: 2026-10 -->

Der Teil der Daten, aus dem ein Modell beim maschinellen Lernen seine Regeln bzw. Parameter lernt – typischerweise 70–80 % des Bestands.

### Erklärung
Beim überwachten Lernen enthalten die Trainingsdaten die Merkmale und die bekannte Zielvariable (Label). Das Modell passt sich an diese Daten an – je komplexer es ist, desto mehr lernt es auch deren Zufallsrauschen. Deshalb sagt die Güte auf den Trainingsdaten wenig über die Güte im Betrieb aus. Das Modell lernt auch die Verzerrungen seiner Trainingsdaten (Bias), daher müssen sie repräsentativ sein.

### Beispiel
8.000 historische Aufträge mit Merkmalen (Warengruppe, Lieferentfernung, Montage ja/nein) und dem Label „reklamiert ja/nein“ bilden die Trainingsdaten des Reklamationsmodells.

### Abgrenzung
| Menge | Zweck |
|---|---|
| Trainingsdaten | lernen |
| Validierungsdaten | Parameter einstellen |
| Testdaten | abschließend unabhängig prüfen |

### Prüfungsfalle
Gute Trainingsgüte als Erfolg berichten – entscheidend ist die Testgüte; eine große Lücke zeigt Overfitting.

### Merksatz
Aus den Trainingsdaten wird gelernt, an den Testdaten wird gemessen.

Siehe auch: Testdaten · Validierungsdaten · Train-Test-Split · Overfitting · Bias / Verzerrung
Mehr: Deep Dive 6, 2.1 · Deep Dive 7, 1.1

## Transaktion
<!-- id: transaktion · quellen: Karte DD1 · stand: 2026-10 -->

Folge von Datenbankoperationen, die als logische Einheit ganz oder gar nicht ausgeführt wird: COMMIT schreibt sie fest, ROLLBACK verwirft sie.

### Erklärung
Transaktionen sichern die **ACID**-Eigenschaften: Atomarität (alles oder nichts), Konsistenz (von einem gültigen Zustand in den nächsten), Isolation (parallele Transaktionen stören sich nicht) und Dauerhaftigkeit (Festgeschriebenes bleibt erhalten). Ohne BEGIN arbeiten die meisten Systeme im Autocommit-Modus: Jede Anweisung wird sofort festgeschrieben.

### Beispiel
```sql
BEGIN TRANSACTION;          -- MySQL: START TRANSACTION
INSERT INTO bestellung (bestell_id, kunden_id, bestelldatum) VALUES (106, 4, '2026-07-06');
INSERT INTO bestellposition (bestell_id, produkt_id, menge) VALUES (106, 11, 1);
COMMIT;                     -- bei einem Fehler stattdessen ROLLBACK
```
Es entsteht nie eine Bestellung ohne Position.

### Abgrenzung
TCL-Befehle (COMMIT, ROLLBACK) steuern Transaktionen, DML-Befehle (INSERT, UPDATE, DELETE) ändern die Daten darin. Isolationsstufen regeln, welche Anomalien wie Lost Update oder Dirty Read bei parallelen Zugriffen möglich sind.

### Prüfungsfalle
Nach einem COMMIT – oder im Autocommit-Modus – hilft ROLLBACK nicht mehr.

### Merksatz
Alles oder nichts – und erst COMMIT macht es endgültig.

Siehe auch: ACID · Autocommit · Isolationsstufen · Lost Update · DML
Mehr: Deep Dive 1, 3.5 · Deep Dive 1, 2.4

## Transitive Abhängigkeit
<!-- id: transitive-abhangigkeit · quellen: Karte DD2, DD2 2.1 · stand: 2026-10 -->

Ein Nichtschlüsselattribut hängt nicht direkt vom Primärschlüssel ab, sondern über ein anderes Nichtschlüsselattribut (A → B → C) – ein Verstoß gegen die 3. Normalform.

Auch: Transitiv abhängig

### Erklärung
Liegt eine Kette Schlüssel → Nichtschlüssel → Nichtschlüssel vor, wird der hintere Wert in jeder Zeile wiederholt, in der der mittlere vorkommt. Das erzeugt Redundanz und damit Änderungs-, Einfüge- und Löschanomalien. Lösung: Die abhängigen Attribute in eine eigene Tabelle auslagern, deren Primärschlüssel das mittlere Attribut ist; in der Ausgangstabelle bleibt es als Fremdschlüssel.

### Beispiel
bestellung(bestell_id, bestelldatum, kunden_id, kundenname, kundenort) mit bestell_id → kunden_id → kundenname, kundenort.
3. NF: kunde(**kunden_id**, kundenname, kundenort) und bestellung(**bestell_id**, bestelldatum, kunden_id↑).

### Abgrenzung
| Abhängigkeit | Problem | verletzt |
|---|---|---|
| partiell | Nichtschlüssel hängt von einem Teil des zusammengesetzten Schlüssels ab | 2. NF |
| transitiv | Nichtschlüssel hängt von einem anderen Nichtschlüssel ab | 3. NF |

### Prüfungsfalle
In der Normalisierungsaufgabe nur das Endschema angeben, ohne die transitive Kette zu benennen – das kostet Begründungspunkte.

### Merksatz
Der Schlüssel, der ganze Schlüssel und nichts als der Schlüssel – transitiv verstößt gegen das „nichts als“.

Siehe auch: 3. Normalform · Funktionale Abhängigkeit · Partielle Abhängigkeit · Normalisierung · Änderungsanomalie
Mehr: Deep Dive 2, 2.1 · Deep Dive 2, Teil 3

## Transparenz und Erklärbarkeit
<!-- id: transparenz-und-erklarbarkeit · quellen: DD6 6.2 · stand: 2026-10 -->

Anforderung, dass Betroffene und Fachbereich nachvollziehen können, worauf eine automatisierte oder modellgestützte Entscheidung beruht.

### Erklärung
Rechtlich verlangt die DSGVO bei automatisierten Entscheidungen „aussagekräftige Informationen über die involvierte Logik“ (Art. 13 Abs. 2 lit. f, Art. 14 Abs. 2 lit. g, Art. 15 Abs. 1 lit. h) und nach Art. 22 Abs. 3 das Recht auf Eingreifen einer Person, Darlegung des eigenen Standpunkts und Anfechtung. Fachlich fördert Erklärbarkeit die Akzeptanz und macht Fehler und Verzerrungen sichtbar. Deshalb sind lesbare Verfahren wie Entscheidungsbäume oder logistische Regression im betrieblichen Umfeld oft im Vorteil.

### Beispiel
Ein Modell lehnt Ratenkäufe automatisch ab. Das Möbelhaus wählt einen Entscheidungsbaum, dessen Regeln („offene Forderungen > 2 und Kunde < 6 Monate“) es dem Kunden erklären kann, und lässt Ablehnungen von einer Person prüfen.

### Abgrenzung
Random Forest, neuronale Netze und SVM sind oft genauer, gelten aber als Black Box – Genauigkeit und Erklärbarkeit stehen in einem Zielkonflikt.

### Prüfungsfalle
„Das Modell gibt nur eine Empfehlung“ schützt nicht: Richtet sich der Mitarbeiter faktisch immer danach, kann schon der Score eine automatisierte Entscheidung sein (EuGH, SCHUFA-Urteil 2023).

### Merksatz
Was man nicht erklären kann, wird nicht akzeptiert – und ist rechtlich angreifbar.

Siehe auch: Entscheidungsbaum · Random Forest · Bias / Verzerrung · Zweckbindung und Datenminimierung · DSGVO
Mehr: Deep Dive 6, 6.2

## Trennzeichen
<!-- id: trennzeichen · quellen: DD15 2.1 · stand: 2026-10 -->

Zeichen, das in einer CSV-Datei die Felder eines Datensatzes voneinander trennt – nach RFC 4180 das Komma, in deutschen Excel-Exporten meist das Semikolon.

### Erklärung
Weil im Deutschen das Komma als Dezimaltrennzeichen dient, nutzt Excel bei deutschen Ländereinstellungen das Semikolon; manche Systeme verwenden auch Tabulator oder senkrechten Strich. Exporteur und Importeur müssen sich auf Trennzeichen, Zeichenkodierung, Dezimalzeichen und Zeilenende einigen, sonst landet ein ganzer Datensatz in einer Spalte oder Zahlen werden zerlegt.

### Beispiel
```csv
kunden_id;name;umsatz
1;Huber GmbH;1250,50
```
Liest ein Werkzeug diese Datei mit Komma als Trennzeichen, entstehen die Spalten „1;Huber GmbH;1250“ und „50“.

### Abgrenzung
Das Feldtrennzeichen trennt Spalten; Dezimal- und Tausendertrennzeichen gehören zum Zahlenformat innerhalb eines Feldes. Enthält ein Feld selbst das Trennzeichen, muss es in Anführungszeichen stehen.

### Prüfungsfalle
Komma als Feldtrenner und Komma als Dezimalzeichen in derselben Datei ohne Anführungszeichen – die Spalten verrutschen.

### Merksatz
Vor jedem CSV-Import klären: Trenner, Dezimalzeichen, Kodierung.

Siehe auch: CSV · Trennzeichen im Feldinhalt · Dezimal- und Tausendertrennzeichen · Zeichenkodierung · Keine Datentypen
Mehr: Deep Dive 15, 2.1

## Trennzeichen im Feldinhalt
<!-- id: trennzeichen-im-feldinhalt · quellen: DD15 2.1 · stand: 2026-10 -->

CSV-Problem: Enthält ein Feldwert selbst das Trennzeichen, muss das Feld in Anführungszeichen stehen, sonst verrutschen alle folgenden Spalten.

### Erklärung
Nach **RFC 4180** gilt die Regel ebenso für Zeilenumbrüche und Anführungszeichen im Feld. Ein Anführungszeichen im Inhalt wird verdoppelt. Gute Exportwerkzeuge setzen die Anführungszeichen automatisch; selbst gebaute Exporte per Textverkettung vergessen sie oft.

### Beispiel
```csv
produkt_id,bezeichnung,preis
10,"Stuhl ""Comfort"", grau",249.00
```
Ohne die äußeren Anführungszeichen würde „grau“ als dritte Spalte gelesen und der Preis in eine vierte rutschen.

### Abgrenzung
Das Problem betrifft den Feldinhalt; die Wahl des Trennzeichens (Komma oder Semikolon) ist eine Vereinbarung über das Dateiformat.

### Prüfungsfalle
Das Trennzeichen „herausfiltern“ oder ersetzen verfälscht die Daten – richtig ist das Maskieren mit Anführungszeichen.

### Merksatz
Trennzeichen im Text? Ab in Anführungszeichen.

Siehe auch: Trennzeichen · CSV · Zeichenkodierung · Keine Datentypen
Mehr: Deep Dive 15, 2.1

## Ausgelassen
- Tatsächlich keine – Tabellenzeile Konfusionsmatrix
- Tatsächlich negativ – Tabellenzeile Konfusionsmatrix
- Tatsächlich positiv – Tabellenzeile Konfusionsmatrix
- Tatsächlich Reklamation – Tabellenzeile Konfusionsmatrix
