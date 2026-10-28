# Deep Dive 23: Altklausur-Training Datenqualität II
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Nachbau einer echten Prüfung „Sicherstellen der Datenqualität“: vier Aufgaben zu je 25 Punkten, 90 Minuten. Diese Altklausur ist **technischer** als Deep Dive 19: ein **ID3-Entscheidungsbaum mit Lückendiagramm** (12 P), ein **Import-Algorithmus nach Klassendiagramm** (20 P), ein **Rechtekonzept mit SQL-Anweisungen** (19 P) und **DSGVO-Auszüge auf Deutsch und Englisch**.

Wer hier punktet, kann drei Dinge: **rechnen und begründen** (Entropie, Informationsgewinn), **sauber programmieren** (Schleife, Prüfung, Korrektur, Speichern) und **Rechtsgrundlagen anwenden** statt sie nur aufzuzählen.

Szenario: **Möbelhaus Nordholz GmbH** – Kundenauswahl für eine Naturmöbel-Linie und Übernahme von Mitarbeitern eines Küchenstudios.

---

# Teil 1 – So ist die Klausur aufgebaut

| Aufgabe | Inhalt | Punkte |
|---|---|---|
| 1 | Klassifikation erklären, Qualitätskriterien, Diskretisierung, ID3-Kriterium, Entscheidungsbaum füllen | 25 |
| 2 | Datenqualitätsbegriffe zuordnen, Import-Methode programmieren, SQL-UPDATE | 25 |
| 3 | Rechtekonzept als Tabelle, DCL-Anweisungen, SQL gegen NoSQL | 25 |
| 4 | Art. 6 DSGVO auf Fälle anwenden, Art. 32 GDPR (englisch) auswerten, Datenschutz und Informationssicherheit | 25 |

---

# Teil 2 – Klassifikation und ID3 im Lückendiagramm

## 2.1 Klassifikation in drei Sätzen

Ein Verfahren des **überwachten Lernens**: Aus Trainingsdaten mit **bekannter Zielklasse** (hat gekauft: ja/nein) lernt ein Modell Regeln, die Merkmale mit der Klasse verbinden. Das Modell ordnet dann **neue Datensätze ohne Klasse** einer Klasse zu. Die Güte wird an **Testdaten** gemessen, die das Modell beim Lernen nicht gesehen hat.

**Qualitätskriterien:** Accuracy (Trefferquote), Precision, Recall, F1-Maß, Spezifität; dazu Verständlichkeit des Modells und Robustheit gegen Überanpassung (Overfitting).

## 2.2 Warum Altersgruppen?

ID3 verzweigt nach **kategorialen** Merkmalen. Mit dem exakten Alter entstünde fast für jeden Kunden ein eigener Zweig – das Modell lernt die Trainingsdaten auswendig (**Overfitting**) und kann neue Alter nicht zuordnen. Die **Diskretisierung** in wenige Gruppen macht den Baum allgemeingültig. Preis: Information innerhalb einer Gruppe geht verloren, und die Grenzen müssen fachlich sinnvoll sein.

## 2.3 Das Lückendiagramm füllen

1. **Gesamtmenge:** T = [Anzahl ja, Anzahl nein], Entropie berechnen.
2. **Je Merkmal und Ausprägung** die Teilmenge zählen und ihre Entropie berechnen. Reine Teilmengen ([3, 0], [0, 2]) haben die Entropie 0, eine Teilmenge [1, 1] oder [2, 2] die Entropie 1.
3. **Gewichtete Entropie** je Merkmal und **Informationsgewinn** = Entropie(T) − gewichtete Entropie.
4. **Entscheidung begründen:** Das Merkmal mit dem **größten Informationsgewinn** (kleinster gewichteter Restentropie) wird Wurzel.

$H(T) = -\sum p_i \cdot \log_2 p_i$

Beispiel T = [3, 1]: $H = -\frac{3}{4} \cdot \log_2 \frac{3}{4} - \frac{1}{4} \cdot \log_2 \frac{1}{4}$ = **0,8113**

| Teilmenge | Entropie |
|---|---|
| [n, 0] oder [0, n] | 0 |
| [1, 1], [2, 2] | 1 |
| [2, 1] oder [1, 2] | 0,9183 |
| [3, 1] oder [1, 3] | 0,8113 |
| [5, 3] | 0,9544 |

---

# Teil 3 – Daten übernehmen: Qualitätsbegriffe und Import-Algorithmus

## 3.1 Begriffe, die verwechselt werden

| Begriff | Bedeutung |
|---|---|
| Vollständigkeit | alle notwendigen Attribute sind gefüllt |
| Eindeutigkeit | jeder Datensatz ist eindeutig identifizierbar bzw. interpretierbar |
| Redundanzfreiheit | keine Dubletten |
| Einheitlichkeit | gleiche Sachverhalte im gleichen Format (Datum, Einheiten) |
| Konsistenz | keine Widersprüche innerhalb oder zwischen Datensätzen |
| Korrektheit | Werte stimmen mit der Realität überein |
| Aktualität | Werte sind auf dem neuesten Stand |

## 3.2 Muster eines Import-Algorithmus

```
datei ← NEU CsvDatei(pfad)
zeile ← datei.naechsteZeile()          // Kopfzeile überspringen, falls vorhanden
zeile ← datei.naechsteZeile()
SOLANGE zeile ≠ null
    felder ← zeile.teile(";")
    objekt ← ausZeile(felder)
    // prüfen und korrigieren – eine WENN-Abfrage je Regel
    speichern(objekt)
    zeile ← datei.naechsteZeile()
ENDE SOLANGE
```

Prüfpunkte der Prüfer: **Schleife mit Abbruch bei null**, **Zeile vor der Schleife und am Ende der Schleife lesen**, je Hinweis **eine eigene Prüfung**, **Getter und Setter** statt direktem Attributzugriff, **statische Methoden über den Klassennamen** aufrufen (`PersonalDB.speichere(m)`).

---

# Teil 4 – Rechte mit Benutzern und Rollen

| Anweisung (MySQL 8) | Zweck |
|---|---|
| `CREATE USER 'name'@'%' IDENTIFIED BY 'passwort';` | Benutzer anlegen |
| `CREATE ROLE rolle;` | Rolle anlegen |
| `GRANT SELECT ON db.tabelle TO rolle;` | Recht an eine Rolle vergeben |
| `GRANT rolle TO 'name'@'%';` | Rolle einem Benutzer zuweisen |
| `GRANT UPDATE ON db.tabelle TO 'name'@'%' WITH GRANT OPTION;` | Recht mit Weitergaberecht |
| `REVOKE UPDATE ON db.tabelle FROM 'name'@'%';` | Recht entziehen |

**Rechtekonzept:** Rechte, die mehrere Personen brauchen, gehören an eine **Rolle**; Einzelrechte an den Benutzer. **Anonymisiert über die Personalnummer** heißt: Zugriff auf die Tabelle mit Personalnummer und Lohn, aber **kein** Leserecht auf die Tabelle mit den Namen.

| Kriterium | relational (SQL) | dokumentenorientiert (NoSQL) |
|---|---|---|
| Struktur | festes Schema, Tabellen | flexibles Schema, JSON-Dokumente |
| Beziehungen | Fremdschlüssel, JOIN | eingebettete Dokumente, Verweise |
| Konsistenz | ACID-Transaktionen | oft BASE, eventual consistency |
| Skalierung | eher vertikal | horizontal über viele Server |
| Abfrage | SQL standardisiert | herstellerspezifische Abfragesprache |

---

# Teil 5 – Datenschutzrecht anwenden

## 5.1 Erlaubnistatbestand prüfen (Art. 6 Abs. 1 DSGVO)

Vorgehen je Sachverhalt: **Welche Daten, welcher Zweck?** → passt **a) Einwilligung, b) Vertrag, c) rechtliche Pflicht, d) lebenswichtige Interessen, e) öffentliche Aufgabe, f) berechtigtes Interesse**? → bei f) **Interessen abwägen** → Ergebnis „zulässig/nicht zulässig“ mit dem Buchstaben begründen.

> ❓ **Prüferfrage:** Darf ein Arbeitgeber die Kontodaten seiner Beschäftigten ohne Einwilligung speichern?
> *Ja – nach Art. 6 Abs. 1 Buchst. b DSGVO, weil die Lohnzahlung zur Erfüllung des Arbeitsvertrags erforderlich ist.*

## 5.2 Art. 32 GDPR auf Englisch

Die Prüfer zitieren die englische Fassung und fragen auf Deutsch. Merke die Schlüsselwörter: *confidentiality* (Vertraulichkeit), *integrity* (Integrität), *availability* (Verfügbarkeit), *resilience* (Belastbarkeit), *pseudonymisation*, *encryption*, *regularly testing, assessing and evaluating* (regelmäßige Überprüfung der Wirksamkeit).

## 5.3 Datenschutz und Informationssicherheit

**Datenschutz** schützt **Menschen** vor Beeinträchtigung ihrer Rechte bei der Verarbeitung **personenbezogener** Daten. **Informationssicherheit** schützt **alle Informationen** des Unternehmens (auch Konstruktionspläne, Preise) nach den Schutzzielen Vertraulichkeit, Integrität, Verfügbarkeit. Deutschsprachige, branchenneutrale Regelwerke: **BSI IT-Grundschutz** (Kompendium, BSI-Standards 200-1 bis 200-4) und **DIN EN ISO/IEC 27001**.

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Klassifikation mit Clustering verwechselt (Clustering hat **keine** bekannte Zielklasse).
2. Im Lückendiagramm die Teilmengen falsch gezählt – immer die Tabelle Zeile für Zeile abhaken.
3. Entscheidung ohne Zahl begründet („Altersgruppe ist am wichtigsten“).
4. Import-Schleife ohne erneutes Lesen am Schleifenende (Endlosschleife).
5. Statische Methode über ein Objekt statt über den Klassennamen aufgerufen.
6. Weitergaberecht vergessen (`WITH GRANT OPTION`).
7. Art. 6 aufgezählt statt auf den Sachverhalt angewendet; Buchstabe fehlt.
8. Datenschutz und Informationssicherheit gleichgesetzt.

---

# Übungsklausur Datenqualität II im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Antworte stichwortartig, gib bei Berechnungen den Rechenweg an und halte dich an die geforderte Anzahl der Nennungen.

## Ausgangssituation

Die **Möbelhaus Nordholz GmbH** stellt sich organisatorisch und technisch neu auf. Neben einer Marketingoffensive für die neue Linie **„Nordholz Natur“** (Massivholzmöbel aus zertifizierter Forstwirtschaft) werden die Personalverwaltung und die Datenhaltung überarbeitet. Außerdem übernimmt das Möbelhaus die Beschäftigten des insolventen **Küchenstudios Küchenwerk Seestadt**. Sie arbeiten in der IT-Abteilung.

## Block A – Klassifikation und ID3 (25 P)

Die Marketingabteilung will den gedruckten Katalog „Nordholz Natur“ nur an Kunden schicken, die voraussichtlich Naturmöbel kaufen. Eine Auswertung zeigt, welche Kunden bereits Naturmöbel gekauft haben. Ausschnitt aus den Daten:

| ID | Alter | Altersgruppe | Wohnform | Newsletter abonniert? | Naturmöbel gekauft? |
|---|---|---|---|---|---|
| 1 | 24 | A1 | Miete | Ja | Ja |
| 2 | 29 | A1 | Miete | Nein | Ja |
| 3 | 35 | A2 | Eigentum | Ja | Ja |
| 4 | 41 | A2 | Miete | Nein | Nein |
| 5 | 47 | A2 | Eigentum | Ja | Ja |
| 6 | 55 | A3 | Eigentum | Nein | Nein |
| 7 | 62 | A3 | Miete | Nein | Nein |
| 8 | 26 | A1 | Eigentum | Ja | Ja |

Altersgruppen: A1 bis 30 Jahre, A2 31 bis 50 Jahre, A3 über 50 Jahre. Die Erkenntnisse sollen auf Kunden übertragen werden, bei denen man nicht weiß, ob sie an Naturmöbeln interessiert sind. Dazu soll das Verfahren der **Klassifizierung** (classification) eingesetzt werden.

**A1 (4 P):** *Erläutern* Sie der Praktikantin Frau Behrens das Verfahren der Klassifizierung an diesem Beispiel.

**A2 (3 P):** *Nennen* Sie **drei** Qualitätskriterien für diese Klassifizierung.

**A3 (3 P):** *Begründen* Sie, ob die Einteilung der Altersdaten in Gruppen sinnvoll ist.

**A4 (3 P):** *Nennen* Sie das Kriterium, nach dem der ID3-Algorithmus die Knoten eines Entscheidungsbaums auswählt.

**A5 (12 P):** *Ermitteln* Sie die erste Entscheidungsebene nach dem ID3-Algorithmus. *Tragen* Sie die Teilmengen T = [Anzahl ja, Anzahl nein] und ihre Entropien in die Tabelle *ein* (vier Nachkommastellen). *Begründen* Sie mithilfe des Ergebnisses, welches Merkmal die Wurzel des Baums wird.

| Knoten | Zweig | T = [ja, nein] | Entropie |
|---|---|---|---|
| Gesamtmenge | – | | |
| Altersgruppe | A1 | [3, 0] | 0 |
| Altersgruppe | A2 | | |
| Altersgruppe | A3 | | |
| Wohnform | Miete | | |
| Wohnform | Eigentum | | |
| Newsletter | Ja | | |
| Newsletter | Nein | | |

> **Formeln:**
> - Entropie H(T) = −Σ p_i · log₂(p_i), mit p_i = Anteil der Klasse i in der Teilmenge
> - gewichtete Entropie eines Merkmals = Σ (Größe der Teilmenge / Größe von T) · H(Teilmenge)
> - Informationsgewinn = H(T) − gewichtete Entropie

## Block B – Übernahme der Beschäftigten des Küchenstudios (25 P)

Die 14 Beschäftigten des Küchenstudios werden in das Personalsystem der Möbelhaus Nordholz GmbH übernommen. Ihre Daten liegen nur als CSV-Datei vor.

**B1 (3 P):** Damit die Daten nutzbar sind, müssen sie bestimmte Anforderungen erfüllen. *Ordnen* Sie den drei Erklärungen je einen Begriff *zu*. Mögliche Begriffe: Aktualität, Eindeutigkeit, Einheitlichkeit, Konsistenz, Korrektheit, Redundanzfreiheit, Vollständigkeit. *Tragen* Sie die Begriffe in die Tabelle *ein*.

| Erklärung | Begriff |
|---|---|
| Gleiche Sachverhalte sind in allen Datensätzen im gleichen Format gespeichert, z. B. jedes Datum als TT.MM.JJJJ. | |
| Die Werte eines Datensatzes widersprechen sich nicht, z. B. liegt das Austrittsdatum nicht vor dem Eintrittsdatum. | |
| Die gespeicherten Werte stimmen mit der Wirklichkeit überein. | |

**B2 (20 P):** Die Methode `importieren()` der Klasse `KWMitarbeiterImport` soll die CSV-Datei einlesen, die Daten prüfen und korrigieren und jeden Mitarbeiter in der Datenbank speichern. Zur Verfügung stehen folgende Klassen (Auszug):

```text
Mitarbeiter
  - persNr: String
  - kostenstelle: int
  - wochenstunden: double
  + Mitarbeiter()

PersonalDB
  + speichere(m: Mitarbeiter): void {static}
  + naechstePersNr(): String {static}

String
  + beginntMit(praefix: String): bool
  + teile(trenner: String): String[]

CsvDatei
  + CsvDatei(pfad: String)
  + naechsteZeile(): String

KWMitarbeiterImport
  - pfad: String
  + ausZeile(felder: String[]): Mitarbeiter
  + importieren(): int
```

Hinweise:
- Die erste Zeile der Datei ist eine Kopfzeile und wird nicht importiert. Die Felder sind durch Semikolon getrennt.
- `naechsteZeile()` liefert die nächste Zeile und `null`, wenn keine Zeile mehr vorhanden ist.
- `ausZeile()` erzeugt aus den Feldern einer Zeile ein Mitarbeiter-Objekt.
- Personalnummern müssen mit `NH-` beginnen. Nummern, die schon mit `NH-` beginnen, bleiben erhalten; alle anderen werden durch `PersonalDB.naechstePersNr()` ersetzt.
- Ist die Kostenstelle 0 oder negativ, wird die Kostenstelle 4100 (Küchenstudio) eingetragen.
- Wochenstunden über 40 werden auf 40 begrenzt.
- `importieren()` gibt die Anzahl der gespeicherten Mitarbeiter zurück.
- Alle Attribute haben Getter und Setter, die im Klassendiagramm nicht dargestellt sind.

*Programmieren* Sie die Methode `importieren()` in Pseudocode oder einer Programmiersprache Ihrer Wahl.

**B3 (2 P):** Die Tabelle `verguetung` enthält das Feld `stundenlohn`. Nach der Übernahme erhalten alle Beschäftigten eine Lohnerhöhung. *Formulieren* Sie eine SQL-Anweisung, die den Stundenlohn aller Beschäftigten um 3 % erhöht.

> **Formel:** neuer Stundenlohn = alter Stundenlohn · (1 + Erhöhung in % / 100)

## Block C – Zugriffsrechte und Datenbanksysteme (25 P)

Um sensible Personaldaten besser zu schützen, liegen Vergütung und Abwesenheiten in eigenen Tabellen der Datenbank **personal**:

```text
mitarbeiter(pers_nr, nachname, vorname, geburtsdatum, strasse, plz, ort, kostenstelle)
verguetung(pers_nr, stundenlohn, iban)
abwesenheit(abw_id, pers_nr, art, von, bis)

mitarbeiter 1 — 1 verguetung
mitarbeiter 1 — n abwesenheit
```

Auszug aus dem Pflichtenheft:
- Frau Brandes pflegt die Stammdaten in der Tabelle `mitarbeiter`.
- Herr Oltmanns erfasst Urlaub und Krankheit und darf dazu die Mitarbeiterdaten lesen.
- Frau Yilmaz ist für Lohnanpassungen zuständig, darf die Beschäftigten aber nur über die Personalnummer sehen.
- Alle Mitglieder der Personalleitung dürfen alle Personaldaten lesen, aber nichts ändern.
- Herr Janssen aus der Personalleitung darf zusätzlich die Vergütung ändern.

**C1 (9 P):** *Vervollständigen* Sie das Rechtekonzept gemäß Pflichtenheft. *Tragen* Sie Benutzer bzw. Rolle, Rechte und Tabelle in die Tabelle *ein*. Die Anzahl der Zeilen lässt keinen Rückschluss auf die Lösung zu.

| Benutzer/Rolle | Rechte/Rollen | Tabelle |
|---|---|---|
| Brandes | SELECT, INSERT, UPDATE, DELETE | mitarbeiter |
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |

**C2 (10 P):** *Schreiben* Sie die SQL-Anweisungen, mit denen
- der Benutzer `janssen` mit dem Passwort `Nordholz!24` angelegt wird,
- die Rolle `personalleitung` angelegt wird und Leserechte auf alle drei Tabellen erhält,
- Herr Janssen die Rolle erhält und zusätzlich die Tabelle `verguetung` ändern darf,
- Herr Janssen sein Änderungsrecht weitergeben darf.

**C3 (6 P):** Ein Kollege fragt, ob für die Personaldaten statt der relationalen auch eine dokumentenorientierte NoSQL-Datenbank infrage kommt. *Wählen* Sie **drei** Kriterien und *tragen* Sie die Unterschiede in die Tabelle *ein*.

| Kriterium | relationale Datenbank (SQL) | dokumentenorientierte Datenbank (NoSQL) |
|---|---|---|
| | | |
| | | |
| | | |

## Block D – Datenschutz und Informationssicherheit (25 P)

Im Rahmen der Beschäftigungsverhältnisse verarbeitet das Möbelhaus auch Daten seiner Beschäftigten. Dabei sind die Vorgaben des Datenschutzes einzuhalten.

Art. 6 Abs. 1 DSGVO (Auszug):

> Die Verarbeitung ist nur rechtmäßig, wenn mindestens eine der nachstehenden Bedingungen erfüllt ist:
> a) Die betroffene Person hat ihre Einwilligung zu der Verarbeitung der sie betreffenden personenbezogenen Daten für einen oder mehrere bestimmte Zwecke gegeben;
> b) die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen;
> c) die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt;
> d) die Verarbeitung ist erforderlich, um lebenswichtige Interessen der betroffenen Person oder einer anderen natürlichen Person zu schützen;
> e) die Verarbeitung ist für die Wahrnehmung einer Aufgabe erforderlich, die im öffentlichen Interesse liegt oder in Ausübung öffentlicher Gewalt erfolgt, die dem Verantwortlichen übertragen wurde;
> f) die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten erforderlich, sofern nicht die Interessen oder Grundrechte und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener Daten erfordern, überwiegen, insbesondere dann, wenn es sich bei der betroffenen Person um ein Kind handelt.

Article 32 GDPR (extract):

> 1. Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing as well as the risk of varying likelihood and severity for the rights and freedoms of natural persons, the controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including inter alia as appropriate: (a) the pseudonymisation and encryption of personal data; (b) the ability to ensure the ongoing confidentiality, integrity, availability and resilience of processing systems and services; (c) the ability to restore the availability and access to personal data in a timely manner in the event of a physical or technical incident; (d) a process for regularly testing, assessing and evaluating the effectiveness of technical and organisational measures for ensuring the security of the processing.
> 2. In assessing the appropriate level of security account shall be taken in particular of the risks that are presented by processing, in particular from accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data transmitted, stored or otherwise processed.

**D1 (6 P):** *Prüfen* Sie, ob die folgenden Verarbeitungen bei fest angestellten Beschäftigten nach Art. 6 Abs. 1 DSGVO zulässig sind, und *begründen* Sie Ihre Entscheidung kurz. *Tragen* Sie Ihr Ergebnis in die Tabelle *ein*.

| Sachverhalt | zulässig/nicht zulässig | Begründung |
|---|---|---|
| Meldung der Beschäftigten mit Name, Geburtsdatum und Entgelt an die Krankenkasse zur Sozialversicherung | | |
| Speicherung der IBAN jedes Beschäftigten, um den Lohn zu überweisen | | |
| Veröffentlichung der Geburtstage aller Beschäftigten mit Foto im Kundennewsletter, ohne dass sie eingewilligt haben | | |

**D2 (2 P):** *Nennen* Sie anhand von Art. 32 Abs. 1 GDPR **zwei** Gesichtspunkte, die der Verantwortliche bei der Auswahl der Sicherheitsmaßnahmen berücksichtigen muss.

**D3 (4 P):** *Erläutern* Sie anhand von Art. 32 Abs. 2 GDPR, welche Risiken für die Bestimmung des angemessenen Schutzniveaus besonders zu berücksichtigen sind. *Geben* Sie ein Beispiel aus der Personalverwaltung *an*.

**D4 (4 P):** *Nennen* Sie die **vier** Eigenschaften, die nach Art. 32 Abs. 1 Buchst. b GDPR für Systeme und Dienste dauerhaft sicherzustellen sind, mit ihrer deutschen Bezeichnung.

**D5 (3 P):** *Beschreiben* Sie, welches regelmäßige Verfahren nach Art. 32 Abs. 1 Buchst. d GDPR etabliert sein muss, und *nennen* Sie ein Beispiel für das Möbelhaus.

**D6 (4 P):** Neben dem Datenschutz soll auch die Informationssicherheit verbessert werden. *Erläutern* Sie den Unterschied zwischen Datenschutz und Informationssicherheit.

**D7 (2 P):** *Geben* Sie **zwei** deutschsprachige, nicht branchenspezifische Regelwerke oder Standards zur Informationssicherheit *an*.

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich erkläre Klassifikation als überwachtes Lernen mit Trainings- und Testdaten an einem Beispiel.
- [ ] Ich nenne Qualitätskriterien eines Klassifikators und begründe, warum Altersdaten in Gruppen eingeteilt werden.
- [ ] Ich fülle ein ID3-Lückendiagramm mit Teilmengen, Entropien und Informationsgewinn und begründe die Wurzel.
- [ ] Ich ordne Datenqualitätsbegriffe wie Einheitlichkeit, Konsistenz und Korrektheit sicher zu.
- [ ] Ich programmiere einen Import mit Leseschleife, Prüfregeln, Korrektur und Speichern nach Klassendiagramm.
- [ ] Ich leite aus einem Pflichtenheft ein Rechtekonzept mit Benutzern und Rollen ab.
- [ ] Ich schreibe CREATE USER, CREATE ROLE und GRANT mit WITH GRANT OPTION.
- [ ] Ich vergleiche relationale und dokumentenorientierte Datenbanken an drei Kriterien.
- [ ] Ich prüfe Sachverhalte nach Art. 6 Abs. 1 DSGVO und begründe mit dem passenden Buchstaben.
- [ ] Ich werte Art. 32 GDPR auf Englisch aus und unterscheide Datenschutz von Informationssicherheit.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
