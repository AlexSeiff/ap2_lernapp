<!-- Begriffsseiten J · Stand 2026-10 -->
## JArbSchG
<!-- id: jarbschg · quellen: Karte DD13, DD13 1.1, DD13 2.1 · stand: 2026-10 -->

Jugendarbeitsschutzgesetz: schützt Beschäftigte unter 18 Jahren mit strengeren Regeln zu Arbeitszeit, Pausen, Urlaub und Berufsschule als für Erwachsene.

### Erklärung
Für Jugendliche (15 bis unter 18) gilt: höchstens 8 Stunden täglich und 40 Stunden wöchentlich, Fünf-Tage-Woche; Pausen 30 Minuten bei mehr als 4,5 bis 6 Stunden, 60 Minuten bei mehr als 6 Stunden; mindestens 12 Stunden Freizeit zwischen zwei Arbeitstagen; Nachtruhe grundsätzlich von 20 bis 6 Uhr. Urlaub: mindestens 30 Werktage (zu Jahresbeginn noch nicht 16), 27 (noch nicht 17), 25 (noch nicht 18). Dazu Erstuntersuchung vor Beginn, Nachuntersuchung nach einem Jahr und Unterweisung mindestens halbjährlich. Kinder unter 15 dürfen grundsätzlich nicht beschäftigt werden.

### Beispiel
Jonas (geb. 15.03.2009) ist am 01.01.2026 16 Jahre alt, also „noch nicht 17“ → 27 Werktage Jahresurlaub. Weil er erst am 01.08.2026 beginnt, erwirbt er 2026 nur Teilurlaub: $27 \cdot \frac{5}{12}$ = **11,25 Werktage**. Abgerundet wird nicht – der Viertel-Tag wird anteilig gewährt.

### Abgrenzung
| Regel | JArbSchG | ArbZG (Erwachsene) |
|---|---|---|
| Arbeitszeit | 8 h/Tag, 40 h/Woche | 8 h, bis 10 h mit Ausgleich |
| Pause | 30 min ab 4,5 h, 60 min ab 6 h | 30 min ab 6 h, 45 min ab 9 h |
| Ruhezeit | 12 h | 11 h |

### Prüfungsfalle
Für den Urlaub den Geburtstag statt des Alters zu Beginn des Kalenderjahres als Stichtag nehmen.

### Merksatz
Unter 18 gilt das JArbSchG – Stichtag für den Urlaub ist der 1. Januar.

Siehe auch: BBiG · IHK · Jugend- und Auszubildendenvertretung
Mehr: Deep Dive 13, 1.1 · Deep Dive 13, 2.1

## JSON
<!-- id: json · quellen: Karte DD15, DD15 2.2 · stand: 2026-10 -->

JavaScript Object Notation: leichtgewichtiges, textbasiertes Austauschformat aus Objekten und Arrays mit den Datentypen String, Number, Boolean und null – ohne eigenen Datumstyp.

### Erklärung
Objekte stehen in geschweiften Klammern (Schlüssel-Wert-Paare), Arrays in eckigen Klammern; beides ist beliebig verschachtelbar. JSON ist semistrukturiert und Standardformat von REST-APIs. Die Regeln stehen in RFC 8259; für den Austausch ist UTF-8 vorgeschrieben. Strenge Syntax: Schlüssel und Texte in doppelten Anführungszeichen, Dezimalpunkt, `true`/`false`/`null` kleingeschrieben, kein Komma nach dem letzten Element, keine Kommentare.

### Beispiel
```json
{
  "bestell_id": 100,
  "bestelldatum": "2026-01-15",
  "plz": "04109",
  "positionen": [{"produkt_id": 10, "menge": 2, "preis": 249.00}],
  "bezahlt": false
}
```
Datum als ISO-8601-String, Postleitzahl als String (eine Zahl mit führender Null ist ungültig).

### Abgrenzung
**CSV** ist flach und kennt keine Datentypen, **XML** ist verschachtelt, aber wortreicher und lässt sich per XSD validieren; JSON kann optional mit JSON Schema geprüft werden.

### Prüfungsfalle
Einfache Anführungszeichen, Dezimalkomma oder ein Datum als eigener Datentyp – alles ungültig.

### Merksatz
JSON: doppelte Anführungszeichen, Punkt als Dezimalzeichen, Datum als Text.

Siehe auch: ISO 8601 · REST · UTF-8 · JWT
Mehr: Deep Dive 15, 2.2

## Jugend- und Auszubildendenvertretung
<!-- id: jugend-und-auszubildendenvertretung · quellen: Karte DD13, DD13 4.3 · stand: 2026-10 -->

Die JAV vertritt im Betrieb die Belange der Beschäftigten unter 18 und der Auszubildenden; sie handelt über den Betriebsrat.

### Erklärung
Voraussetzung (§ 60 BetrVG): Es gibt einen Betriebsrat und in der Regel mindestens 5 Beschäftigte unter 18 oder Auszubildende – seit dem Betriebsrätemodernisierungsgesetz 2021 ohne Altersgrenze für Auszubildende. Wählbar sind Beschäftigte unter 25 sowie Auszubildende jeden Alters (§ 61); Betriebsratsmitglieder sind nicht wählbar. Amtszeit 2 Jahre. JAV-Mitglieder genießen besonderen Kündigungsschutz; wer als Azubi in den letzten drei Monaten vor Ausbildungsende schriftlich die Weiterbeschäftigung verlangt, wird übernommen (§ 78a).

### Beispiel
Die Möbelhaus Nordholz GmbH hat einen Betriebsrat und acht Auszubildende, darunter Lea (24). Eine JAV wird gewählt; Lea darf wählen und gewählt werden, weil sie Auszubildende ist.

### Abgrenzung
Der **Betriebsrat** vertritt alle Arbeitnehmer und hat eigene Beteiligungsrechte gegenüber dem Arbeitgeber. Die JAV hat keine eigenen Mitbestimmungsrechte, sondern bringt ihre Themen über den Betriebsrat ein und nimmt an dessen Sitzungen teil.

### Prüfungsfalle
Die JAV als eigenständigen Verhandlungspartner des Arbeitgebers sehen – sie handelt immer über den Betriebsrat.

### Merksatz
Keine JAV ohne Betriebsrat – und kein Weg an ihm vorbei.

Siehe auch: Betriebsrat · Mitbestimmung · JArbSchG
Mehr: Deep Dive 13, 4.3

## Juristische Person
<!-- id: juristische-person · quellen: Karte DD14, DD14 2.1 · stand: 2026-10 -->

Rechtlich selbstständige Organisation, die wie ein Mensch Trägerin von Rechten und Pflichten ist (eigene Rechtsfähigkeit).

### Erklärung
Juristische Personen des **Privatrechts** sind z. B. GmbH, AG und eingetragener Verein; des **öffentlichen Rechts** z. B. Gemeinden oder die IHK als Körperschaft. Sie handeln durch ihre Organe (Geschäftsführer, Vorstand), können Verträge schließen, Eigentum erwerben, klagen und verklagt werden. Bei Kapitalgesellschaften haftet grundsätzlich nur das Gesellschaftsvermögen.

### Beispiel
Die Möbelhaus Nordholz GmbH ist eine juristische Person: Sie ist Vertragspartnerin der Kunden und Arbeitgeberin, nicht der Geschäftsführer persönlich.

### Abgrenzung
**Natürliche Personen** sind Menschen; ihre Rechtsfähigkeit beginnt mit Vollendung der Geburt. Die DSGVO schützt nur natürliche Personen – Daten der „Huber GmbH“ als solcher sind nicht personenbezogen, wohl aber die Daten ihrer Ansprechpartner.

### Prüfungsfalle
Firmendaten einer GmbH pauschal als personenbezogen einstufen oder die OHG für eine juristische Person halten (sie ist eine rechtsfähige Personengesellschaft).

### Merksatz
Juristische Person: eine Organisation, die das Recht wie einen Menschen behandelt.

Siehe auch: KG · Formkaufmann · Personenbezogene Daten
Mehr: Deep Dive 14, 2.1 · Deep Dive 10, Teil 1

## JWT
<!-- id: jwt · quellen: Karte DD15, DD15 3.3 · stand: 2026-10 -->

JSON Web Token: kompaktes Token aus Header, Nutzdaten (Claims) und Signatur, jeweils Base64url-kodiert und durch Punkte getrennt – signiert, aber nicht verschlüsselt.

### Erklärung
Nach der Anmeldung stellt ein Server das Token aus; der Client schickt es bei jeder API-Anfrage im Header mit (`Authorization: Bearer …`). Der Server prüft die Signatur und die Ablaufzeit (`exp`) und muss keine Sitzung speichern – passend zur Zustandslosigkeit von REST. Die Signatur schützt vor Veränderung, nicht vor dem Mitlesen: Jeder kann die Claims dekodieren. Standard ist RFC 7519.

### Beispiel
Ein Token `xxxxx.yyyyy.zzzzz` enthält im Mittelteil `{"sub": "filiale-koeln", "rolle": "lesen", "exp": 1767225600}`. Die Filial-App darf damit lesen, bis die Ablaufzeit erreicht ist.

### Abgrenzung
**OAuth 2.0** ist ein Autorisierungsrahmen, der Access Tokens ausgibt – diese können JWTs sein. Ein **API-Schlüssel** ist ein fester Geheimwert ohne eingebaute Ablaufzeit und identifiziert nur die Anwendung.

### Prüfungsfalle
Vertrauliche Daten in ein JWT schreiben, weil es „sicher signiert“ ist – Base64url ist keine Verschlüsselung.

### Merksatz
JWT: lesbar für alle, fälschbar für niemanden – solange die Signatur geprüft wird.

Siehe auch: JSON · REST · OAuth 2.0
Mehr: Deep Dive 15, 3.3

## Ausgelassen
- Jede Entität – Satzanfang Extraktion
- Jonas Brandt – Personenname Szenario
