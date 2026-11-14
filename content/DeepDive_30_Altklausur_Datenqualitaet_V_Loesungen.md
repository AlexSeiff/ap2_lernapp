# Musterlösungen Übungsklausur Altklausur-Training Datenqualität V (Deep Dive 30)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen** wie im echten Lösungsschlüssel – andere sach- und fachgerechte Antworten zählen gleichwertig. Bewerte nur so viele Nennungen, wie verlangt sind. 92+ P = sehr gut.

---

## Block A – Datenqualität der Antriebsdaten (25 P)

**A1 (6 P):** *(je Schritt 2 P)*
- **Extraktion:** Die Betriebsdaten werden aus den Quellsystemen gelesen – hier aus den Steuerungen der Tische bei den Kunden bzw. den gelieferten CSV-Dateien.
- **Transformation:** Die Daten werden bereinigt und in eine einheitliche Struktur gebracht: Dubletten entfernen, Einheiten und Formate vereinheitlichen, fehlende und unplausible Werte behandeln.
- **Laden:** Die aufbereiteten Daten werden in das Zielsystem geschrieben, z. B. ein Data Warehouse, und stehen dort für die Auswertung der Ausfallwahrscheinlichkeit bereit.

**A2 (3 P):** *(je Problem 1 P)*
- **Dublette:** Der Antrieb S51721 steht zweimal mit identischen Werten in der Stichprobe (Zeilen 3 und 4).
- **Falsche Einheit:** Motortemperatur 318,3 bei S51720 – offenbar in Kelvin statt in °C geliefert.
- **Formatfehler in der ID:** `51724` ohne den Buchstaben der Klasse (erwartet: S51724).
- **Fehlender Wert:** Laufzeit `null` bei S51725.
- **Kommafehler/Ausreißer:** Spannung 241 V bei K20319 statt rund 24,1 V.

**A3 (6 P):** *(je Art 2 P Beschreibung, 1 P Beispiel)*
- **Datenvalidierung** prüft, ob Daten den **festgelegten Regeln** entsprechen: Datentyp, Format, Wertebereich, Pflichtfeld. Sie beantwortet, ob ein Wert **zulässig** ist. Beispiel: Die ID `51724` verletzt die Formatregel „Buchstabe der Klasse + fünf Ziffern“; die Spannung 241 V liegt außerhalb des zulässigen Bereichs um 24 V; die Laufzeit `null` verletzt das Pflichtfeld.
- **Datenverifizierung** prüft, ob Daten mit der **Quelle bzw. der Wirklichkeit übereinstimmen** – durch Abgleich mit dem Messprotokoll, eine zweite Messung oder Doppelerfassung. Sie beantwortet, ob ein Wert **richtig** ist. Beispiel: Durch Abgleich mit der Steuerung des Tisches lässt sich klären, ob 318,3 tatsächlich 45,15 °C in Kelvin sind oder ob S51721 wirklich zweimal gemessen oder nur doppelt übertragen wurde.

*Prüferkommentar: Beide Begriffe mit „Daten werden geprüft“ zu beschreiben bringt keinen Punkt – entscheidend ist, **wogegen** geprüft wird.*

**A4 (10 P):** *(je Einschätzung 2 P, je Maßnahme 2 P, Form und Adressatenbezug 2 P)*

> **Betreff:** Prüfung der Antriebsdaten – Ergebnis der Stichprobe
>
> Sehr geehrte Frau Marquardt,
>
> ich habe die Stichprobe der Antriebsdaten geprüft. Ihr Eindruck bestätigt sich: Die Daten sind in der vorliegenden Form für die Berechnung der Ausfallwahrscheinlichkeit nicht verlässlich.
>
> **Einschätzung 1:** Fünf der zehn Datensätze enthalten einen Fehler. Ein Datensatz ist doppelt vorhanden, eine Laufzeit fehlt, und eine Antriebs-ID hat nicht das vereinbarte Format. Solche Datensätze verfälschen Auswertungen oder lassen sich keinem Antrieb zuordnen.
>
> **Einschätzung 2:** Zwei Messwerte sind offensichtlich falsch: eine Motortemperatur von 318,3 (vermutlich Kelvin statt °C) und eine Spannung von 241 V (vermutlich ein fehlendes Komma). Ungeprüft übernommen würden diese Werte als extreme Auffälligkeiten gelten und falsche Wartungsempfehlungen auslösen.
>
> **Maßnahme 1 – Bereinigung:** Wir entfernen die Dublette, rechnen die Temperatur in °C um, korrigieren die Spannung nach Rücksprache mit dem Kunden und kennzeichnen den Datensatz ohne Laufzeit, statt einen Wert zu schätzen.
>
> **Maßnahme 2 – Vorbeugung:** Beim Import richten wir Prüfregeln ein (Format der ID, zulässige Wertebereiche, Pflichtfelder, eindeutige ID je Messzeitpunkt) und legen die Einheiten in der Schnittstelle zur Tischsteuerung verbindlich fest. Abgewiesene Datensätze werden protokolliert.
>
> Gern stelle ich Ihnen die Prüfregeln in einem kurzen Termin vor.
>
> Mit freundlichen Grüßen

*Prüferkommentar: Verlangt ist eine E-Mail – Anrede, zusammenhängende Sätze und Gruß gehören dazu. Maßnahmen müssen zu den genannten Problemen passen; „Daten besser pflegen“ bringt keinen Punkt.*

---

## Block B – Ausfälle vorhersagen (28 P)

**B1 (6 P):** *(je Algorithmus 3 P)*
- **k-nächste Nachbarn:** Ein neuer Antrieb wird mit allen bekannten Antrieben verglichen. Über ein **Abstandsmaß** (z. B. euklidische Distanz) werden die **k ähnlichsten** bestimmt; der neue Antrieb erhält die Klasse, die unter diesen Nachbarn **am häufigsten** vorkommt. Es gibt keine Trainingsphase – gerechnet wird erst bei der Vorhersage.
- **ID3:** Aus den Trainingsdaten wird ein **Entscheidungsbaum** aufgebaut. An jedem Knoten wird das Merkmal gewählt, das die Klassen am besten trennt – das mit dem **größten Informationsgewinn** (stärkste Abnahme der Entropie). Das wiederholt sich, bis die Blätter möglichst nur eine Klasse enthalten; eine Vorhersage folgt dem Pfad von der Wurzel zum Blatt.

**B2 (5 P):** *(Entscheidung 1 P, je Argument 2 P)*

Für **kNN** spricht z. B.:
- Fast alle Merkmale sind **numerische Messwerte** (Temperatur, Drehzahl, Drehmoment, Laufzeit) – kNN verarbeitet sie direkt über Abstände, ID3 müsste sie erst in Klassen einteilen.
- Neue Datensätze lassen sich **ohne erneutes Training** aufnehmen; das Modell wächst mit den laufend eintreffenden Betriebsdaten.

Für **ID3** spricht z. B.:
- Der Baum liefert **nachvollziehbare Regeln** („Drehmoment hoch und Drehzahl niedrig → Ausfall“), die sich dem Kundendienst erklären lassen.
- Die **Vorhersage ist schnell** – bei 8.000 und mehr Datensätzen müsste kNN für jeden Antrieb alle Abstände berechnen.

*Prüferkommentar: Beide Entscheidungen bringen volle Punkte, wenn die Argumente zur Situation passen. „kNN ist genauer“ ohne Bezug zu den Daten zählt nicht.*

**B3 (1 P):** Ja, der Antrieb sollte vorsorglich gewartet werden: Sein nächster Nachbar ist ein ausgefallener Antrieb, und im äußeren Kreis überwiegen die Ausfälle mit 7 zu 4. Auch die Einschätzung „nicht eindeutig – das Ergebnis hängt von k ab“ erhält den Punkt, wenn sie mit der Abbildung begründet ist.

**B4 (4 P):** *(Prinzip 1 P, je ausgewerteter Kreis 1 P)* Die Klasse wird durch **Mehrheitsentscheid** unter den k nächsten Nachbarn bestimmt – je nach k fällt sie hier anders aus:
- **k = 1** (innerer Kreis): 1 Ausfall, 0 intakt → **Ausfall**.
- **k = 5** (mittlerer Kreis): 2 Ausfälle, 3 intakt → **kein Ausfall**.
- **k = 11** (äußerer Kreis): 7 Ausfälle, 4 intakt → **Ausfall**.

Die Vorhersage kippt also zweimal. Ein kleines k reagiert auf einzelne, womöglich zufällige Nachbarn; ein größeres k stützt die Entscheidung auf mehr Fälle, bezieht aber auch weiter entfernte, weniger ähnliche Antriebe ein.

**B5 (4 P):** *(je Kriterium 1 P Nennung, 1 P Begründung)*, z. B.:
- **k ungerade wählen:** Bei zwei Klassen kann dann kein Gleichstand entstehen.
- **k nicht zu klein:** Sonst entscheiden einzelne Ausreißer oder Messfehler (Überanpassung).
- **k nicht zu groß:** Sonst gewinnt immer die insgesamt häufigere Klasse – bei Ausfalldaten in der Regel „kein Ausfall“ –, und seltene Ausfälle werden nicht mehr erkannt.
- **k mit Validierungsdaten bestimmen:** Mehrere Werte ausprobieren (z. B. per Kreuzvalidierung) und das k mit der besten Trefferquote auf ungesehenen Daten wählen (Startwert etwa √n).

**B6 (4 P):** *(Kodierung 2 P, Skalierung 2 P)* kNN berechnet Abstände und braucht deshalb **Zahlen**. **One-Hot-Kodierung** bildet jede Antriebsklasse durch drei 0/1-Spalten ab, etwa S als (1, 0, 0) und K als (0, 1, 0). Damit haben unterschiedliche Typen denselben Abstand. Eine Kodierung mit 1, 2, 3 ist nur sinnvoll, wenn Rangfolge und Abstände für die Ausfallprognose fachlich begründet sind. Die **numerischen Messmerkmale skalieren** wir mit den im Trainingssatz bestimmten Grenzen, z. B. auf 0 bis 1. Sonst dominiert die Drehzahl mit Werten um 2.800 den Abstand.

**B7 (4 P):** *(Differenzen 1 P, Quadrate 1 P, Summe 1 P, Wurzel und Ergebnis 1 P)*

| Merkmal | bekannt | zu klassifizieren | Differenz | Quadrat |
|---|---|---|---|---|
| Klasse | K | K | 0 | 0 |
| Motortemperatur | 46,5 | 43,5 | −3 | 9 |
| Drehzahl | 2840 | 2800 | −40 | 1600 |
| Drehmoment | 2,1 | 1,7 | −0,4 | 0,16 |
| Laufzeit | 260 | 248 | −12 | 144 |

$d = \sqrt{0 + 9 + 1.600 + 0{,}16 + 144} = \sqrt{1.753{,}16}$ = **41,87**

*Prüferkommentar: Die Drehzahl trägt 1.600 von 1.753 zur Summe bei – ein Beleg dafür, dass ohne Skalierung ein einziges Merkmal den Abstand bestimmt (siehe B6). Die Spalte „Ausfall“ ist das Label und gehört nicht in die Distanz.*

---

## Block C – Von der relationalen zur Dokumentendatenbank (25 P)

**C1 (8 P):** *(je Eigenschaft 2 P)*
- **Atomicity (Atomarität, Abgeschlossenheit):** Eine Transaktion wird entweder **vollständig oder gar nicht** ausgeführt. Tritt ein Fehler auf, werden alle bisherigen Schritte zurückgenommen (Rollback).
- **Consistency (Konsistenz):** Eine Transaktion führt die Datenbank von einem **gültigen Zustand in einen gültigen Zustand**; alle Integritätsbedingungen (Schlüssel, Constraints) gelten vorher und nachher.
- **Isolation (Abgrenzung):** Gleichzeitig laufende Transaktionen **beeinflussen sich nicht**; jede läuft so, als wäre sie allein, Zwischenstände sind für andere nicht sichtbar.
- **Durability (Dauerhaftigkeit):** Nach dem erfolgreichen Abschluss (Commit) sind die Änderungen **dauerhaft gespeichert** und überstehen auch einen Systemabsturz oder Stromausfall.

**C2 (3 P):** *(vier richtig 3 P, drei bzw. zwei richtig 2 P, eine richtig 1 P)*

| Relationale Datenbank | Dokumentendatenbank |
|---|---|
| Datenbank | Datenbank |
| Tabelle | Collection |
| Datensatz (Zeile) | Dokument |
| Spalte | Feld |

**C3 (7 P):** *(Array mit eckigen Klammern 1 P, zwei Objekte in geschweiften Klammern 2 P, Attributnamen in Anführungszeichen 1 P, Zahlen ohne und Texte mit Anführungszeichen 2 P, Kommas richtig gesetzt 1 P)*

```json
[
  {
    "id": 1,
    "tisch_id": 1,
    "art": "temperatur",
    "einheit": "C"
  },
  {
    "id": 2,
    "tisch_id": 1,
    "art": "strom",
    "einheit": "A"
  }
]
```

**C4 (7 P):** *(Komma nach dem letzten vorhandenen Attribut 1 P, Arrayname mit Doppelpunkt 1 P, eckige Klammern 1 P, zwei Sensorobjekte mit richtigen Werten 3 P, gültige Schachtelung 1 P)*

```json
[
  {
    "id": 1,
    "modell": "LIFT-K2",
    "baujahr": 2024,
    "sensoren": [
      {
        "id": 1,
        "art": "temperatur",
        "einheit": "C"
      },
      {
        "id": 2,
        "art": "strom",
        "einheit": "A"
      }
    ]
  }
]
```

*Prüferkommentar: Das Attribut `tisch_id` kann entfallen – die Zugehörigkeit ergibt sich aus der Einbettung; wer es stehen lässt, verliert keinen Punkt. Der häufigste Fehler ist das fehlende Komma nach `"baujahr": 2024`.*

---

## Block D – Speicherung, Zugriffsschutz und Datensicherung (22 P)

**D1 (10 P):** *(je RAID-Level 1 P Nennung, 2 P Beschreibung, 1 P Vorteil, 1 P Nachteil)*, z. B.:
- **RAID 1 (Spiegelung):** Alle Daten werden gleichzeitig auf zwei Festplatten geschrieben. Vorteil: Eine Platte darf ausfallen, ohne dass Daten verloren gehen. Nachteil: Nur die Hälfte der Gesamtkapazität ist nutzbar.
- **RAID 5 (Striping mit verteilter Parität):** Die Daten werden blockweise auf mindestens drei Festplatten verteilt; zusätzlich werden Paritätsinformationen gespeichert, aus denen sich der Inhalt einer ausgefallenen Platte berechnen lässt. Vorteil: Ausfallsicherheit bei guter Kapazitätsausnutzung (nur eine Platte „verloren“). Nachteil: Schreibzugriffe sind langsamer, die Wiederherstellung dauert lange und belastet die übrigen Platten.
- **RAID 0 (Striping):** Die Daten werden auf mehrere Platten verteilt. Vorteil: hohe Geschwindigkeit und volle Kapazität. Nachteil: keine Redundanz – fällt eine Platte aus, sind alle Daten verloren.
- **RAID 10:** Gespiegelte Plattenpaare, über die verteilt geschrieben wird (mindestens vier Platten). Vorteil: schnell und ausfallsicher. Nachteil: nur die Hälfte der Kapazität nutzbar, höhere Kosten.
- **RAID 6:** Wie RAID 5 mit doppelter Parität (mindestens vier Platten). Vorteil: Zwei Platten dürfen ausfallen. Nachteil: noch langsamere Schreibzugriffe.

**D2 (4 P):** *(Entscheidung 1 P, Begründung 3 P)* **RAID 10:** Die Spiegelung sichert die Daten gegen den Ausfall einer Platte je Paar, und das verteilte Schreiben ohne Paritätsberechnung hält die Schreibleistung hoch – wichtig, weil rund um die Uhr Sensordaten geschrieben werden. Die Wiederherstellung nach einem Plattentausch ist ein einfaches Kopieren und damit schnell. Ebenfalls vertretbar: **RAID 5** oder **RAID 6**, wenn die Kapazität im Vordergrund steht und die etwas geringere Schreibleistung ausreicht. **RAID 0** scheidet aus, weil es keine Ausfallsicherheit bietet.

**D3 (5 P):** *(je Ebene 1 P)*

| Ebene | Maßnahme |
|---|---|
| Anwendung | Anmeldung mit Benutzerrollen und Rechten; Prepared Statements gegen SQL-Injection |
| Transport zwischen Anwendung und Datenbank | Verschlüsselte Verbindung (TLS) |
| Datenbankdienst | Eigene Datenbankbenutzer mit minimalen Rechten (GRANT), sichere Passwörter, Protokollierung der Zugriffe |
| Server der Datenbank | Firewall, nur benötigte Ports geöffnet, Betriebssystem aktuell; Zutrittsschutz zum Serverraum |
| Festplatte im Server | Verschlüsselung der Datenträger |

**D4 (3 P):** *(Strategie 1 P, Begründung 2 P)* Z. B. **wöchentliche Vollsicherung, tägliche differenzielle Sicherung und laufende Sicherung des Transaktionsprotokolls.** Für die Wiederherstellung die letzte Vollsicherung vor dem Zielzeitpunkt einspielen und anschließend die jüngste dazugehörige differenzielle Sicherung vor diesem Zeitpunkt. Dann das lückenlos gesicherte Transaktionsprotokoll bis unmittelbar vor die fehlerhafte Änderung einspielen. So lassen sich auch die seit der letzten Datensicherung eingegangenen Messwerte bis zum Zielzeitpunkt zurückholen. Mehrere Generationen aufbewahren.

*Prüferkommentar: Auch „tägliche Vollsicherung“ oder „Vollsicherung plus inkrementell“ zählt mit passender Begründung. Wer RAID als Sicherung nennt, erhält keinen Punkt – RAID schützt nicht vor Löschen oder fehlerhaften Änderungen.*
