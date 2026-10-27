# Deep Dive 24: Altklausur-Training Datenqualität III
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Der zweite Nachbau einer Prüfung „Sicherstellen der Datenqualität“: vier Aufgaben zu je 25 Punkten. Schwerpunkte dieser Altklausur sind **Rohdaten aufbereiten** und daraus eine **Einstufung ableiten**, **strukturierte, semistrukturierte und unstrukturierte Daten** an einem Produktschild, die **Entropie mit drei Klassen**, **SQL mit Unterabfrage, Anti-Join und INSERT in zwei Tabellen**, **REST mit englischen Architekturprinzipien**, ein **Sequenzdiagramm aus einer Ablaufbeschreibung** und **Datenschutz in der App** (Betroffenenrechte, Art. 25, Erlaubnistatbestände, DDoS, Zwei-Faktor-Authentifizierung).

Szenario: **Möbelhaus Nordholz GmbH** – die Ausstellungs-App „Nordholz Entdecken“.

---

# Teil 1 – So ist die Klausur aufgebaut

| Aufgabe | Inhalt | Punkte |
|---|---|---|
| 1 | Rohdaten bewerten, Einstufung vorschlagen, Datenstrukturen, Entropie erklären und berechnen, ID3-Entscheidung | 25 |
| 2 | Datenqualitätskriterien, NoSQL oder relational, drei SQL-Statements | 25 |
| 3 | CSV/XML/JSON, REST-Prinzipien (englisch), HTTP-Methoden, Sequenzdiagramm | 25 |
| 4 | Betroffenenrechte, Art. 25 DSGVO (englisch), Art. 6 auf Fälle anwenden, DDoS, Zwei-Faktor-Authentifizierung | 25 |

---

# Teil 2 – Rohdaten aufbereiten und einstufen

## 2.1 Warum Rohdaten nicht direkt taugen

- **Uneinheitliche Formate:** Dauer als „3 min 40 s“, „8 s“ → erst in **Sekunden** umrechnen.
- **Unterschiedliche Größenordnungen:** Aufrufe von 0 bis 150, Dauer von 1 bis 600 s – ohne Skalierung dominiert ein Merkmal.
- **Zeitbezug:** Werte eines Tages schwanken (Wochenende, Aktionen) → **Durchschnitt über einen Zeitraum** bilden.
- **Ausreißer und Fehler:** App bleibt offen liegen (Dauer 45 min) → filtern oder kappen.

**Lösung:** bereinigen, vereinheitlichen, aggregieren (Ø je Tag) und **normalisieren**, z. B. Min-Max auf 0 bis 1 oder als Verhältnis zum Durchschnitt.

$x' = \frac{x - x_{min}}{x_{max} - x_{min}}$

Beispiel: 30 Aufrufe bei Minimum 0 und Maximum 150: $x' = \frac{30 - 0}{150 - 0}$ = **0,20**

## 2.2 Eine Einstufung vorschlagen

Ein guter Vorschlag verbindet **beide Merkmale** und nennt **Schwellenwerte**: Interessenindex = (Aufrufe / Ø Aufrufe) · (Dauer / Ø Dauer). Index ≥ 2 → „Publikumsmagnet“, 0,5 bis < 2 → „Durchschnitt“, < 0,5 → „Ladenhüter“. Die Schwellen werden an bekannten Beispielen geprüft und später von einem Klassifikator gelernt.

---

# Teil 3 – Strukturiert, semistrukturiert, unstrukturiert

| Art | Merkmal | Am Produktschild |
|---|---|---|
| **strukturiert** | festes Schema, Tabellen mit Datentyp | Maße als Zahlen in den Spalten `breite_cm`, `tiefe_cm` |
| **semistrukturiert** | Schlüssel-Wert-Paare ohne festes Schema, Struktur steckt in den Daten | „Bezug: Webstoff“, „Lieferzeit: 6–8 Wochen“ |
| **unstrukturiert** | Freitext, Bild, Ton ohne erkennbares Schema | der Werbetext unten auf dem Schild, das Produktfoto |

---

# Teil 4 – Entropie mit mehr als zwei Klassen

Die Entropie misst die **Unreinheit** einer Menge: 0 bei nur einer Klasse, maximal **log₂(k)** bei k gleich häufigen Klassen – bei drei Klassen also **1,585**. Je höher der Wert, desto gemischter die Menge und desto weniger lässt sich vorhersagen.

$H = \sum p_i \cdot \log_2 \frac{1}{p_i}$

Beispiel mit den Anteilen 0,5 / 0,25 / 0,25: $H = 0{,}5 \cdot 1 + 0{,}25 \cdot 2 + 0{,}25 \cdot 2$ = **1,5**

**ID3-Entscheidung:** Das Merkmal, nach dessen Aufteilung die **gewichtete Entropie am stärksten sinkt**, kommt in die erste Ebene.

---

# Teil 5 – SQL-Muster dieser Altklausur

| Aufgabe | Muster |
|---|---|
| nur Werte über dem Durchschnitt | `WHERE breite_cm > (SELECT AVG(breite_cm) FROM artikel)` |
| Datensätze ohne Partner (Artikel ohne Foto) | `LEFT JOIN foto f ON … WHERE f.foto_id IS NULL` oder `NOT EXISTS` |
| Datensatz mit Kind-Datensatz anlegen | erst `INSERT INTO artikel …`, dann `INSERT INTO foto … VALUES (…, LAST_INSERT_ID())` |
| Angabe ohne passende Spalte | **nicht speichern** und in einem Satz darauf hinweisen – das ist ein Prüfpunkt |

---

# Teil 6 – REST, HTTP und Sequenzdiagramm

## 6.1 REST-Prinzipien (Auswahl)

| Prinzip | Vorteil |
|---|---|
| Client-Server | Client und Server lassen sich unabhängig weiterentwickeln |
| Stateless | jeder Server kann jede Anfrage bearbeiten → einfache Skalierung |
| Cacheable | Antworten werden wiederverwendet → weniger Last, schnellere Antwort |
| Uniform Interface | einheitliche URIs und Methoden → jeder Client kann die API ohne Sonderwissen nutzen |
| Layered System | Proxys, Load Balancer, Caches lassen sich unsichtbar dazwischen schalten |

**HTTP-Methoden:** GET liest eine Ressource · POST legt eine neue an · PUT ersetzt oder legt unter bekannter URI an · PATCH ändert teilweise · DELETE löscht.

## 6.2 Sequenzdiagramm aus einer Ablaufbeschreibung

- Jede **Methode** ist eine **synchrone Nachricht** (durchgezogener Pfeil, gefüllte Spitze) mit Beschriftung `methode(parameter)`.
- Jede **Rückgabe** ist eine **Antwort** (gestrichelter Pfeil) mit dem zurückgegebenen Wert.
- Ruft ein Objekt **eigene** Methoden auf, zeigt der Pfeil auf die eigene Lebenslinie (**Selbstaufruf**) mit einem zusätzlichen, versetzten Aktivierungsbalken.
- **Aktivierungsbalken** auf jeder Lebenslinie, solange das Objekt arbeitet.

---

# Teil 7 – Datenschutz in der App

- **Betroffenenrechte (DSGVO):** Information (Art. 13/14), Auskunft (15), Berichtigung (16), Löschung (17), Einschränkung (18), Datenübertragbarkeit (20), Widerspruch (21), Widerruf der Einwilligung (7 Abs. 3), keine ausschließlich automatisierte Entscheidung (22).
- **Art. 25:** *by design* = Datenschutz schon beim Entwurf einbauen; *by default* = die **Voreinstellung** verarbeitet nur die für den Zweck nötigen Daten.
- **DDoS:** viele gekaperte Geräte (Botnetz) überfluten den Server mit Anfragen, bis er für echte Nutzer nicht mehr erreichbar ist. Abwehr: DDoS-Schutzdienst/Scrubbing beim Provider, CDN, Rate Limiting, Lastverteilung, Notfallplan.
- **Zwei-Faktor-Authentifizierung:** zwei Faktoren **aus unterschiedlichen Kategorien** – Wissen (Passwort), Besitz (Smartphone, Token), Inhärenz (Fingerabdruck).

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Rohdaten-Problem nur genannt („nicht vergleichbar“), aber keine Lösung (Umrechnen, Durchschnitt, Normalisieren).
2. Einstufungsvorschlag nur mit einem Merkmal und ohne Schwellenwerte.
3. Semistrukturiert und unstrukturiert verwechselt.
4. Entropie mit drei Klassen „maximal 1“ genannt (richtig: log₂ 3 ≈ 1,585).
5. Durchschnitt im WHERE ohne Unterabfrage (`WHERE breite_cm > AVG(breite_cm)` ist ungültig).
6. Für „ohne Foto“ ein INNER JOIN – findet genau die falschen Artikel.
7. Die Angabe ohne passende Spalte trotzdem in eine erfundene Spalte geschrieben.
8. Im Sequenzdiagramm die Antworten (gestrichelt) und den Selbstaufruf vergessen.

---

# Übungsklausur Datenqualität III im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Antworte stichwortartig, gib bei Berechnungen den Rechenweg an und halte dich an die geforderte Anzahl der Nennungen.

## Ausgangssituation

Die **Möbelhaus Nordholz GmbH** hat ihre Ausstellung auf 12.000 m² erweitert. An jedem Ausstellungsstück hängt ein QR-Code: Mit der App **„Nordholz Entdecken“** rufen Besucher Produktinformationen, Fotos und Preise ab. Die Daten zu den Artikeln und den Besuchern liegen in einer Datenbank. Sie arbeiten in der IT-Abteilung des Möbelhauses.

## Block A – Produktinteresse und maschinelles Lernen (25 P)

Die App erfasst, wie oft ein Ausstellungsstück aufgerufen und wie lange die Infoseite betrachtet wird. Daraus sollen die Ausstellungsstücke in **„Publikumsmagnet“**, **„Durchschnitt“** und **„Ladenhüter“** eingestuft werden.

**A1 (4 P):** *Erklären* Sie, warum Rohdaten wie die Anzahl der Aufrufe (heute: 140 × Sofa „Kiel“, 3 × Beistelltisch „Ole“, 25 × Bett „Föhr“ …) und die Betrachtungsdauer (3 min 40 s, 8 s, 2 min 15 s …) sich nicht für eine direkte Auswertung eignen, und *beschreiben* Sie, wie man das Problem löst.

**A2 (4 P):** Im Durchschnitt wird ein Ausstellungsstück 2,4-mal am Tag aufgerufen und 32 Sekunden betrachtet. Das beliebteste Stück wird durchschnittlich 51-mal am Tag aufgerufen und 4 Minuten betrachtet. *Machen* Sie einen Vorschlag, wie aus Aufrufen und Betrachtungsdauer eine Einstufung in „Publikumsmagnet“, „Durchschnitt“ oder „Ladenhüter“ werden kann.

**A3 (4 P):** Im maschinellen Lernen unterscheidet man strukturierte, semistrukturierte und unstrukturierte Daten. *Erklären* Sie diese Unterscheidung anhand des folgenden Produktschilds.

> **Sofa „Kiel“, 3-Sitzer**
> Bezug: Webstoff, anthrazit · Maße (B × T × H): 214 × 92 × 84 cm · Gestell: Buche massiv · Füße: Eiche geölt · Lieferzeit: 6–8 Wochen · Pflege: abnehmbare Bezüge, waschbar bis 30 °C
> Das Kiel lädt zum Lümmeln ein: tiefe Sitzfläche, weiche Rückenkissen und ein Bezug, der Kinderhände und Katzenpfoten verzeiht.

**A4 (4 P):** Für Neuaufnahmen ins Sortiment soll anhand der Eigenschaften (Warengruppe, Preisklasse, Material, Farbe) vorhergesagt werden, ob ein Stück Besucher anzieht. *Erklären* Sie den Begriff **Entropie** an diesem Beispiel. *Erläutern* Sie dabei, in welchem Bereich die Werte liegen und wie man sie interpretiert.

**A5 (6 P):** Von 2.400 Ausstellungsstücken wurden 96 als „Publikumsmagnet“, 528 als „Durchschnitt“ und der Rest als „Ladenhüter“ eingestuft. *Berechnen* Sie die Entropie aller Ausstellungsstücke im Hinblick auf ihre Publikumswirkung. *Geben* Sie den Rechenweg *an*.

> **Formel:** H = Σ p · log₂(1/p), mit p = Anteil einer Klasse an allen Ausstellungsstücken

**A6 (3 P):** Der ID3-Algorithmus nutzt die Entwicklung der Entropie für den Aufbau des Entscheidungsbaums. Bei Aufteilung nach **Warengruppe** sinkt die Summe der gewichteten Entropien auf 58,4 % des Ausgangswerts, bei Aufteilung nach **Preisklasse** auf 71,2 %. *Entscheiden* Sie, welches Merkmal in die erste Ebene gehört, und *begründen* Sie Ihre Entscheidung.

## Block B – Produktdatenbank und SQL (25 P)

Die Artikeldaten der App liegen in einer relationalen Datenbank. Die App soll erweitert werden; die Fachabteilung braucht dafür SQL-Statements. Auszug aus dem Datenbankschema:

```text
foto
  foto_id (PK)
  pfad
  artikel_id (FK)

artikel
  artikel_id (PK)
  bezeichnung
  hersteller_nr
  beschreibung
  breite_cm
  warengruppe_id (FK)

warengruppe
  warengruppe_id (PK)
  name
  beschreibung

foto n — 1 artikel
artikel n — 1 warengruppe
```

Felderklärungen: `hersteller_nr` = Artikelnummer des Herstellers, `breite_cm` = Breite in Zentimetern. Alle Primärschlüssel haben die Eigenschaft `auto_increment`.

**B1 (4 P):** Verlässliche Artikeldaten müssen bestimmte Anforderungen erfüllen. *Nennen* und *erläutern* Sie **zwei** Datenqualitätskriterien am Beispiel der App.

**B2 (4 P):** Eine Kollegin fragt, ob die Artikelinformationen nicht besser in einer NoSQL-Datenbank gespeichert würden. *Nennen* Sie **zwei** Vorteile einer NoSQL-Datenbank und **zwei** Vorteile einer relationalen Datenbank für diesen Einsatz.

**B3 (6 P):** *Formulieren* Sie ein SQL-Statement, das alle Artikel mit Bezeichnung und Breite auflistet, die **breiter als der Durchschnitt** aller Artikel sind. Die breitesten Artikel sollen zuerst erscheinen.

**B4 (5 P):** *Formulieren* Sie ein SQL-Statement, das alle Artikel mit Bezeichnung und dem Namen ihrer Warengruppe auflistet, zu denen **kein Foto** gespeichert ist.

**B5 (6 P):** *Formulieren* Sie die SQL-Statements, mit denen folgender Artikel angelegt wird: Bezeichnung „Couchtisch Lund“, Herstellernummer „LU-118“, Beschreibung „folgt“, Material Eiche, Warengruppe „Tische“ (ID 14), Foto `/bilder/lund_118.jpg`.

## Block C – Datenaustausch und REST (25 P)

Die Artikelinformationen sollen zusätzlich auf der Website und für einen Online-Marktplatz bereitgestellt werden.

**C1 (6 P):** Für den Datenaustausch im Internet werden unterschiedliche Formate verwendet. *Beschreiben* Sie die drei Formate und *geben* Sie jeweils **zwei** charakteristische Merkmale *an*. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Format | Merkmale |
|---|---|
| CSV | |
| XML | |
| JSON | |

**C2 (6 P):** Der Datenaustausch soll über eine Schnittstelle nach dem Architekturstil **REST** erfolgen. Dieser verlangt unter anderem folgende Eigenschaften:
- **Stateless:** *Each request contains all the information the server needs to process it; the server keeps no session data between two requests.*
- **Cacheable:** *Every response states whether it may be cached, so that clients or intermediaries can reuse it for later, equivalent requests.*
- **Uniform interface:** *Resources are identified by URIs and are handled through a small, fixed set of standard methods and representations.*

*Beschreiben* Sie je **einen** Vorteil, der sich aus diesen Eigenschaften ergibt. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Eigenschaft | Vorteil |
|---|---|
| Stateless | |
| Cacheable | |
| Uniform interface | |

**C3 (3 P):** Die Systeme werden bei REST über HTTP gekoppelt. *Beschreiben* Sie die Funktion der HTTP-Methoden GET, PUT und DELETE. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Methode | Funktion |
|---|---|
| GET | |
| PUT | |
| DELETE | |

**C4 (10 P):** Ein Artikel wird über seine Herstellernummer abgefragt, die als Parameter an die URL angehängt ist (z. B. `?nr=LU-118`). Der GET-Request läuft so ab:
- Das Client-Objekt sendet die Anfrage an das ApiServer-Objekt.
- Der ApiServer startet seine Methode `handleGet` mit dem Request-Objekt `req` und dem Response-Objekt `res` als Parameter.
- `handleGet` ruft die Methode `getParameter` von `req` mit dem Schlüssel `"nr"` auf und erhält den Wert als String zurück.
- Dann ruft `handleGet` die Methode `findeArtikel` des ArtikelRepository-Objekts mit diesem Wert auf und erhält das passende Objekt `artikel` zurück.
- Anschließend ruft `handleGet` die eigene Methode `toJson` mit `artikel` auf und erhält den String `json` zurück.
- Zum Schluss ruft `handleGet` die Methode `send` von `res` mit `json` auf. Der Kontrollfluss geht mit der Antwort *Response* an den Client zurück.

Die Lebenslinien sind `:Client`, `:ApiServer`, `req:Request`, `:ArtikelRepository` und `res:Response`. *Ergänzen* Sie das Sequenzdiagramm: *Tragen* Sie alle Nachrichten und Antworten in der richtigen Reihenfolge mit Beschriftung in die Tabelle *ein* und *geben* Sie unter der Tabelle *an*, auf welchen Lebenslinien Methodenbalken (Aktivierungen) liegen.

| Nr. | von | an | Beschriftung |
|---|---|---|---|
| 1 | :Client | :ApiServer | Request |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |
| 10 | :ApiServer | :Client | Response |

## Block D – Datenschutz und Verfügbarkeit (25 P)

Die App verarbeitet personenbezogene Daten der Besucher: Konto, Merkzettel, Klickverlauf.

**D1 (5 P):** Den App-Nutzern stehen als betroffenen Personen bestimmte Rechte zu. *Nennen* Sie **fünf** konkrete Betroffenenrechte nach der DSGVO.

**D2 (5 P):** Bei Entwicklung und Updates der App sind die Vorgaben von Art. 25 DSGVO zu beachten. Absatz 2 lautet in der englischen Fassung:

> *"The controller shall implement appropriate technical and organisational measures for ensuring that, by default, only personal data which are necessary for each specific purpose of the processing are processed. That obligation applies to the amount of personal data collected, the extent of their processing, the period of their storage and their accessibility. In particular, such measures shall ensure that by default personal data are not made accessible without the individual's intervention to an indefinite number of natural persons."*

*Erläutern* Sie anhand dieses Auszugs den Begriff **Datenschutz durch datenschutzfreundliche Voreinstellungen** und *geben* Sie **zwei** Beispiele für die App *an*.

**D3 (6 P):** Nach der DSGVO ist eine Verarbeitung unter anderem zulässig, wenn
- die betroffene Person ihre **Einwilligung** für einen oder mehrere bestimmte Zwecke gegeben hat oder
- die Verarbeitung für die **Erfüllung eines Vertrags** mit der betroffenen Person oder für vorvertragliche Maßnahmen auf ihre Anfrage erforderlich ist.

*Prüfen* Sie, ob die folgenden Verarbeitungen danach zulässig sind, und *begründen* Sie dies jeweils kurz. *Tragen* Sie Ihr Ergebnis in die Tabelle *ein*.

| Sachverhalt | zulässig/nicht zulässig, Begründung |
|---|---|
| Für die Lieferung eines bestellten Sofas verarbeitet das Möbelhaus Name, Anschrift und Telefonnummer des Käufers. | |
| Die App zeigt Produktvorschläge auf Grundlage des Klickverlaufs, nachdem der Nutzer beim ersten Start „Persönliche Vorschläge erlauben“ aktiv gewählt hat. | |
| Das Möbelhaus gibt die E-Mail-Adressen aller App-Nutzer an einen Küchenhersteller weiter, damit dieser Werbung verschicken kann. | |

**D4 (5 P):** Die App zeigt immer die aktuellen Preise und braucht deshalb den Server des Möbelhauses. In der Risikobetrachtung wurde ein **Distributed-Denial-of-Service-Angriff (DDoS)** festgestellt. *Erläutern* Sie den Ablauf dieser Angriffsform und *beschreiben* Sie **zwei** Maßnahmen, mit denen das Möbelhaus die Auswirkungen begrenzen kann.

**D5 (4 P):** Künftig sollen Kunden in der App gekaufte Gutscheine verwalten. Um Missbrauch vorzubeugen, wird bei der Anmeldung eine **Zwei-Faktor-Authentifizierung** eingeführt. *Erläutern* Sie den Begriff und *geben* Sie ein Beispiel für die App *an*.

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich erkläre, warum Rohdaten aufbereitet werden müssen, und beschreibe Umrechnen, Aggregieren und Normalisieren.
- [ ] Ich schlage eine Einstufung aus zwei Merkmalen mit Schwellenwerten vor.
- [ ] Ich unterscheide strukturierte, semistrukturierte und unstrukturierte Daten an einem Beispiel.
- [ ] Ich erkläre die Entropie mit ihrem Wertebereich und berechne sie für drei Klassen.
- [ ] Ich begründe mit gewichteten Entropien, welches Merkmal ID3 in die erste Ebene nimmt.
- [ ] Ich schreibe SQL mit Unterabfrage, Anti-Join und INSERT in zwei verknüpfte Tabellen und erkenne Angaben ohne Spalte.
- [ ] Ich beschreibe CSV, XML und JSON und die Vorteile von REST-Prinzipien aus einem englischen Text.
- [ ] Ich setze eine Ablaufbeschreibung in ein Sequenzdiagramm mit Nachrichten, Antworten und Selbstaufruf um.
- [ ] Ich nenne Betroffenenrechte, erkläre Art. 25 DSGVO und prüfe Fälle nach Einwilligung und Vertrag.
- [ ] Ich erläutere DDoS mit Gegenmaßnahmen und Zwei-Faktor-Authentifizierung mit Beispiel.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
