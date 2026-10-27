# Musterlösungen Übungsklausur Altklausur-Training Datenqualität II (Deep Dive 23)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen** – andere sach- und fachgerechte Antworten zählen gleichwertig, beim Programmieren auch andere Sprachen und Schreibweisen. Bewerte nur so viele Nennungen, wie verlangt sind. 92+ P = sehr gut.

---

## Block A – Klassifikation und ID3 (25 P)

**A1 (4 P):** Klassifizierung ist ein Verfahren des **überwachten Lernens** *(1 P)*. Aus Kundendaten mit **bekannter Zielklasse** – hat Naturmöbel gekauft: ja/nein – lernt ein Algorithmus Regeln, welche Merkmale (Altersgruppe, Wohnform, Newsletter) zu welcher Klasse führen *(1 P)*. Das gelernte Modell ordnet anschließend **neue Kunden ohne bekannte Klasse** einer Klasse zu, hier „wird wahrscheinlich kaufen“ oder „nicht“ *(1 P)*. Die Güte wird vorher an **Testdaten** geprüft, die beim Lernen nicht verwendet wurden; nur an die vorhergesagten Käufer geht der Katalog *(1 P)*.

**A2 (3 P):** *(je 1 P)* Accuracy (Anteil richtiger Vorhersagen) · Precision (Anteil echter Käufer unter den vorhergesagten Käufern) · Recall (Anteil gefundener Käufer unter allen Käufern) · F1-Maß · Spezifität · Verständlichkeit/Interpretierbarkeit des Modells · Robustheit gegen Overfitting.

*Prüferkommentar: Für die Katalogaktion ist die Precision besonders wichtig – jeder falsch vorhergesagte Käufer kostet einen Katalog.*

**A3 (3 P):** **Ja, sinnvoll.** ID3 verzweigt nach kategorialen Merkmalen; mit dem exakten Alter entstünde fast für jeden Kunden ein eigener Zweig *(1 P)*. Der Baum würde die Trainingsdaten auswendig lernen (**Overfitting**) und könnte neue Alterswerte nicht zuordnen *(1 P)*. Gruppen machen die Regeln verallgemeinerbar; die Grenzen müssen allerdings fachlich sinnvoll gewählt werden, sonst gehen Unterschiede innerhalb einer Gruppe verloren *(1 P)*.

**A4 (3 P):** Der **Informationsgewinn** (Information Gain): ID3 wählt das Merkmal, dessen Aufteilung die **Entropie am stärksten senkt**, also die kleinste gewichtete Restentropie hinterlässt.

**A5 (12 P):** *(je richtige Zeile 1 P = 7 P, gewichtete Entropie und Informationsgewinn der drei Merkmale 3 P, Entscheidung mit Begründung 2 P)*

| Knoten | Zweig | T = [ja, nein] | Entropie |
|---|---|---|---|
| Gesamtmenge | – | [5, 3] | 0,9544 |
| Altersgruppe | A1 | [3, 0] | 0 |
| Altersgruppe | A2 | [2, 1] | 0,9183 |
| Altersgruppe | A3 | [0, 2] | 0 |
| Wohnform | Miete | [2, 2] | 1 |
| Wohnform | Eigentum | [3, 1] | 0,8113 |
| Newsletter | Ja | [4, 0] | 0 |
| Newsletter | Nein | [1, 3] | 0,8113 |

Entropie der Gesamtmenge:
$H(T) = -\frac{5}{8} \cdot \log_2 \frac{5}{8} - \frac{3}{8} \cdot \log_2 \frac{3}{8}$ = **0,9544**

Gewichtete Entropie und Informationsgewinn:
- Altersgruppe: $\frac{3}{8} \cdot 0 + \frac{3}{8} \cdot 0{,}9183 + \frac{2}{8} \cdot 0 = 0{,}3444$ → Gewinn $0{,}9544 - 0{,}3444$ = **0,6100**
- Wohnform: $\frac{4}{8} \cdot 1 + \frac{4}{8} \cdot 0{,}8113 = 0{,}9056$ → Gewinn $0{,}9544 - 0{,}9056$ = **0,0488**
- Newsletter: $\frac{4}{8} \cdot 0 + \frac{4}{8} \cdot 0{,}8113 = 0{,}4056$ → Gewinn $0{,}9544 - 0{,}4056$ = **0,5488**

Entscheidung: **Altersgruppe** wird die Wurzel, weil sie mit 0,6100 den größten Informationsgewinn bringt (kleinste Restentropie 0,3444). Zwei der drei Zweige (A1 und A3) sind sofort rein; nur A2 muss weiter aufgeteilt werden – dort trennt der Newsletter die Fälle (Ja → gekauft, Nein → nicht gekauft).

*Prüferkommentar: Der Newsletter ist knapp dahinter – wer nur „Altersgruppe, weil zwei reine Zweige“ schreibt, bekommt einen Punkt; die volle Begründung braucht den Vergleich der Zahlen.*

---

## Block B – Übernahme der Beschäftigten des Küchenstudios (25 P)

**B1 (3 P):** *(je 1 P)*

| Erklärung | Begriff |
|---|---|
| Gleiche Sachverhalte sind in allen Datensätzen im gleichen Format gespeichert, z. B. jedes Datum als TT.MM.JJJJ. | Einheitlichkeit |
| Die Werte eines Datensatzes widersprechen sich nicht, z. B. liegt das Austrittsdatum nicht vor dem Eintrittsdatum. | Konsistenz |
| Die gespeicherten Werte stimmen mit der Wirklichkeit überein. | Korrektheit |

**B2 (20 P):**

| Element | P |
|---|---|
| Zähler anlegen, Datei-Objekt mit `pfad` erzeugen | 2 |
| Kopfzeile lesen und verwerfen | 2 |
| Erste Datenzeile lesen und Schleife `SOLANGE zeile ≠ null` | 3 |
| Zeile mit `teile(";")` zerlegen und Objekt mit `ausZeile(felder)` erzeugen | 2 |
| Personalnummer mit `beginntMit("NH-")` prüfen und sonst mit `PersonalDB.naechstePersNr()` ersetzen (Getter/Setter) | 4 |
| Kostenstelle `<= 0` → 4100 | 2 |
| Wochenstunden `> 40` → 40 | 2 |
| `PersonalDB.speichere(m)` statisch aufrufen und Zähler erhöhen | 1 |
| Nächste Zeile am Schleifenende lesen, Anzahl zurückgeben | 2 |

```
METHODE importieren(): int
    anzahl ← 0
    datei ← NEU CsvDatei(pfad)
    zeile ← datei.naechsteZeile()          // Kopfzeile überspringen
    zeile ← datei.naechsteZeile()
    SOLANGE zeile ≠ null
        felder ← zeile.teile(";")
        m ← ausZeile(felder)
        WENN NICHT m.getPersNr().beginntMit("NH-") DANN
            m.setPersNr(PersonalDB.naechstePersNr())
        ENDE WENN
        WENN m.getKostenstelle() <= 0 DANN
            m.setKostenstelle(4100)
        ENDE WENN
        WENN m.getWochenstunden() > 40 DANN
            m.setWochenstunden(40)
        ENDE WENN
        PersonalDB.speichere(m)
        anzahl ← anzahl + 1
        zeile ← datei.naechsteZeile()
    ENDE SOLANGE
    RÜCKGABE anzahl
ENDE METHODE
```

*Prüferkommentar: Häufigster Fehler ist das fehlende erneute Lesen am Ende der Schleife – das ergibt eine Endlosschleife und kostet 2 Punkte. Direkter Attributzugriff (`m.persNr = …`) statt Setter kostet je einen halben Punkt, weil die Attribute privat sind.*

**B3 (2 P):**

```sql
UPDATE verguetung
SET stundenlohn = stundenlohn * 1.03;
```

*Prüferkommentar: Ohne WHERE ist hier richtig – alle Beschäftigten erhalten die Erhöhung. `stundenlohn + 3` erhöht um 3 Euro, nicht um 3 %.*

---

## Block C – Zugriffsrechte und Datenbanksysteme (25 P)

**C1 (9 P):** *(je richtige Zeile 1,5 P, höchstens 9 P)*

| Benutzer/Rolle | Rechte/Rollen | Tabelle |
|---|---|---|
| Brandes | SELECT, INSERT, UPDATE, DELETE | mitarbeiter |
| Oltmanns | SELECT, INSERT, UPDATE, DELETE | abwesenheit |
| Oltmanns | SELECT | mitarbeiter |
| Yilmaz | SELECT, UPDATE | verguetung |
| Rolle personalleitung | SELECT | mitarbeiter, verguetung, abwesenheit |
| Janssen | Rolle personalleitung | alle drei Tabellen |
| Janssen | UPDATE (mit Weitergaberecht) | verguetung |

*Prüferkommentar: Frau Yilmaz bekommt **kein** Leserecht auf `mitarbeiter` – sonst könnte sie Personalnummern Namen zuordnen. Das Leserecht der Personalleitung gehört an die Rolle, nicht an einzelne Personen.*

**C2 (10 P):** *(Benutzer 2 P, Rolle 1 P, Leserechte der Rolle 3 P, Rolle zuweisen 2 P, UPDATE mit Weitergaberecht 2 P)*

```sql
CREATE USER 'janssen'@'%' IDENTIFIED BY 'Nordholz!24';
CREATE ROLE personalleitung;
GRANT SELECT ON personal.mitarbeiter TO personalleitung;
GRANT SELECT ON personal.verguetung TO personalleitung;
GRANT SELECT ON personal.abwesenheit TO personalleitung;
GRANT personalleitung TO 'janssen'@'%';
SET DEFAULT ROLE personalleitung TO 'janssen'@'%';
GRANT UPDATE ON personal.verguetung TO 'janssen'@'%' WITH GRANT OPTION;
```

Gleichwertig: `GRANT SELECT ON personal.* TO personalleitung;` für alle Tabellen der Datenbank, Schreibweisen anderer DBMS (z. B. `CREATE USER janssen WITH PASSWORD '…'` in PostgreSQL).

**C3 (6 P):** *(je Kriterium mit beiden Seiten 2 P)*

| Kriterium | relationale Datenbank (SQL) | dokumentenorientierte Datenbank (NoSQL) |
|---|---|---|
| Datenstruktur | festes Schema mit Tabellen und Spalten | flexibles Schema, Dokumente (z. B. JSON) mit unterschiedlichen Feldern |
| Beziehungen | über Fremdschlüssel, Abfrage mit JOIN | eingebettete Dokumente oder Verweise, Joins nur eingeschränkt |
| Konsistenz | ACID-Transaktionen | häufig BASE, eventual consistency |

Weitere Kriterien: Skalierung (vertikal gegenüber horizontal), Abfragesprache (standardisiertes SQL gegenüber herstellerspezifischer API), Einsatzgebiet (strukturierte Stammdaten gegenüber großen, wechselnden Datenmengen).

---

## Block D – Datenschutz und Informationssicherheit (25 P)

**D1 (6 P):** *(je Zeile 2 P: Entscheidung 1 P, Begründung mit Rechtsgrundlage 1 P)*

| Sachverhalt | zulässig/nicht zulässig | Begründung |
|---|---|---|
| Meldung der Beschäftigten mit Name, Geburtsdatum und Entgelt an die Krankenkasse zur Sozialversicherung | zulässig | Art. 6 Abs. 1 Buchst. c: Der Arbeitgeber ist gesetzlich zur Meldung verpflichtet (Sozialversicherungsrecht, § 28a SGB IV). |
| Speicherung der IBAN jedes Beschäftigten, um den Lohn zu überweisen | zulässig | Buchst. b: zur Erfüllung des Arbeitsvertrags erforderlich – ohne IBAN keine Lohnzahlung. |
| Veröffentlichung der Geburtstage aller Beschäftigten mit Foto im Kundennewsletter, ohne dass sie eingewilligt haben | nicht zulässig | Keine Einwilligung (a), für den Arbeitsvertrag nicht erforderlich (b), keine Pflicht (c); bei f) überwiegt das Interesse der Beschäftigten am Schutz von Bild und Geburtsdatum gegenüber dem Werbezweck. |

**D2 (2 P):** *(je 1 P)* Stand der Technik · Implementierungskosten · Art, Umfang, Umstände und Zwecke der Verarbeitung · Eintrittswahrscheinlichkeit und Schwere des Risikos für die Rechte und Freiheiten der betroffenen Personen.

**D3 (4 P):** Zu berücksichtigen sind die Risiken der **Vernichtung, des Verlusts und der Veränderung** von Daten – ob versehentlich oder unrechtmäßig – sowie der **unbefugten Offenlegung** und des **unbefugten Zugangs** *(2 P)*. Das gilt für übermittelte, gespeicherte und sonst verarbeitete Daten *(1 P)*. Beispiel: Lohndaten werden durch einen Ransomware-Angriff verschlüsselt (Verlust der Verfügbarkeit) oder eine Liste mit Krankheitstagen wird per E-Mail an den falschen Empfänger geschickt (unbefugte Offenlegung) *(1 P)*.

**D4 (4 P):** *(je 1 P)* **Vertraulichkeit** (confidentiality) · **Integrität** (integrity) · **Verfügbarkeit** (availability) · **Belastbarkeit** (resilience).

**D5 (3 P):** Ein **Verfahren zur regelmäßigen Überprüfung, Bewertung und Evaluierung der Wirksamkeit** der technischen und organisatorischen Maßnahmen muss eingerichtet sein *(2 P)*. Beispiel: jährliches Audit der Zugriffsrechte im Personalsystem, Wiederherstellungstest der Datensicherung je Quartal oder ein Penetrationstest *(1 P)*.

**D6 (4 P):** **Datenschutz** schützt **natürliche Personen** davor, durch die Verarbeitung ihrer **personenbezogenen Daten** in ihren Rechten beeinträchtigt zu werden; er ist gesetzlich geregelt (DSGVO, BDSG) *(2 P)*. **Informationssicherheit** schützt **alle Informationen** des Unternehmens – auch nicht personenbezogene wie Preise oder Konstruktionspläne – nach den Schutzzielen Vertraulichkeit, Integrität und Verfügbarkeit, unabhängig davon, ob sie digital oder auf Papier vorliegen *(2 P)*. Datenschutz nutzt Mittel der Informationssicherheit, deckt sich aber nicht mit ihr.

**D7 (2 P):** *(je 1 P)* **BSI IT-Grundschutz** (IT-Grundschutz-Kompendium, BSI-Standards 200-1 bis 200-4) · **DIN EN ISO/IEC 27001** (deutsche Fassung) · DIN EN ISO/IEC 27002.
