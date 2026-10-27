# Musterlösungen Übungsklausur Altklausur-Training Datenqualität III (Deep Dive 24)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen** – andere sach- und fachgerechte Antworten zählen gleichwertig, beim SQL auch andere korrekte Schreibweisen. Bewerte nur so viele Nennungen, wie verlangt sind. 92+ P = sehr gut.

---

## Block A – Produktinteresse und maschinelles Lernen (25 P)

**A1 (4 P):** *(2 P Probleme, 2 P Lösung)* Die Rohdaten sind **uneinheitlich** (Dauer als „3 min 40 s“ und „8 s“), haben **unterschiedliche Größenordnungen** (Aufrufe bis 150, Sekunden bis mehrere Hundert), sind **Tageswerte** mit Zufallsschwankungen und enthalten **Ausreißer** (App bleibt offen liegen). Ein direkter Vergleich würde vor allem den Zufall und die Einheit messen.
Lösung: Dauer **in Sekunden umrechnen**, Werte **über einen Zeitraum mitteln** (Ø je Tag), Ausreißer bereinigen und beide Merkmale **normalisieren** (z. B. Min-Max auf 0 bis 1 oder als Verhältnis zum Durchschnitt), damit sie vergleichbar und kombinierbar sind.

**A2 (4 P):** *(Kombination beider Merkmale 2 P, nachvollziehbare Schwellenwerte 2 P)*, z. B.:
Interessenindex = (Ø Aufrufe/Tag ÷ 2,4) · (Ø Dauer ÷ 32 s). Ein Durchschnittsstück hat den Index 1, das beliebteste Stück $\frac{51}{2{,}4} \cdot \frac{240}{32}$ = **159,38**.
- Index ≥ 3 → **Publikumsmagnet**
- Index 0,5 bis < 3 → **Durchschnitt**
- Index < 0,5 → **Ladenhüter**

Gleichwertig: getrennte Schwellen je Merkmal (z. B. Magnet = mindestens doppelte Aufrufe **und** doppelte Dauer) oder eine Einteilung nach Quantilen (oberste 5 %, unterste 30 %).

*Prüferkommentar: Ein Vorschlag nur mit einem Merkmal oder ohne Zahlen bringt höchstens die Hälfte.*

**A3 (4 P):** *(je Datenart mit Bezug zum Schild, insgesamt 4 P)*
- **Strukturiert:** Werte mit festem Schema und Datentyp, wie sie in der Datenbank stehen – die Maße 214, 92 und 84 als Zahlen in eigenen Spalten.
- **Semistrukturiert:** Schlüssel-Wert-Paare ohne festes Schema („Bezug: Webstoff, anthrazit“, „Lieferzeit: 6–8 Wochen“, „Pflege: …“) – Struktur erkennbar, aber nicht jede Angabe gibt es bei jedem Produkt.
- **Unstrukturiert:** der Werbetext „Das Kiel lädt zum Lümmeln ein …“ (und ein Produktfoto) – kein Schema, Auswertung nur mit Textanalyse.

**A4 (4 P):** Die Entropie misst die **Unreinheit bzw. Unvorhersagbarkeit** einer Menge *(1 P)*. Gehören alle Ausstellungsstücke einer Gruppe zur selben Klasse (alle „Ladenhüter“), ist die Entropie **0** – die Vorhersage ist sicher *(1 P)*. Sind die drei Klassen gleich häufig, erreicht sie ihr **Maximum log₂ 3 ≈ 1,585** – die Eigenschaften sagen dann nichts über die Publikumswirkung aus *(1 P)*. Je kleiner die Entropie nach einer Aufteilung (z. B. nach Warengruppe), desto besser trennt das Merkmal die Klassen *(1 P)*.

**A5 (6 P):** *(Anteile 2 P, Rechenweg 3 P, Ergebnis 1 P)*

Anteile: $\frac{96}{2.400} = 0{,}04$ · $\frac{528}{2.400} = 0{,}22$ · $\frac{1.776}{2.400} = 0{,}74$

- Publikumsmagnet: $0{,}04 \cdot \log_2 \frac{1}{0{,}04} = 0{,}04 \cdot 4{,}6439 = 0{,}1858$
- Durchschnitt: $0{,}22 \cdot \log_2 \frac{1}{0{,}22} = 0{,}22 \cdot 2{,}1844 = 0{,}4806$
- Ladenhüter: $0{,}74 \cdot \log_2 \frac{1}{0{,}74} = 0{,}74 \cdot 0{,}4344 = 0{,}3215$

$H = 0{,}1858 + 0{,}4806 + 0{,}3215$ = **0,9879**

Interpretation: deutlich unter dem Maximum 1,585 – die Menge ist von den Ladenhütern geprägt.

*Prüferkommentar: log₂ berechnet man mit dem Taschenrechner als ln(x) / ln(2). Wer den Rest (1.776) nicht ausrechnet, verliert schon bei den Anteilen Punkte.*

**A6 (3 P):** **Warengruppe** gehört in die erste Ebene *(1 P)*. Nach dieser Aufteilung bleibt mit 58,4 % die kleinere gewichtete Entropie übrig, also ist der **Informationsgewinn größer** (41,6 % gegenüber 28,8 % bei der Preisklasse) *(2 P)*. Die Warengruppe trennt Magneten und Ladenhüter besser.

---

## Block B – Produktdatenbank und SQL (25 P)

**B1 (4 P):** *(je Kriterium 1 P Nennung, 1 P Erläuterung mit App-Bezug)*, z. B.:
- **Korrektheit:** Preis und Maße in der App stimmen mit dem Ausstellungsstück überein – sonst Ärger an der Kasse.
- **Aktualität:** Preisänderungen und Lieferzeiten erscheinen sofort in der App.
- **Vollständigkeit:** zu jedem Artikel gibt es Bezeichnung, Maße, Warengruppe und Foto.
- **Eindeutigkeit/Redundanzfreiheit:** jeder QR-Code führt zu genau einem Artikel, keine doppelten Artikel.

**B2 (4 P):** *(je Vorteil 1 P)*
- NoSQL: **flexibles Schema** – Artikel mit sehr unterschiedlichen Eigenschaften (Sofa: Bezug; Lampe: Leuchtmittel) ohne leere Spalten · **horizontale Skalierung** bei vielen gleichzeitigen App-Zugriffen · Produktdaten als **ein Dokument** abrufbar (schnell, ohne Joins).
- Relational: **referentielle Integrität** über Fremdschlüssel (kein Foto ohne Artikel) · **ACID-Transaktionen** bei Preisänderungen · **standardisiertes SQL** und vorhandenes Know-how, flexible Auswertungen mit JOIN.

**B3 (6 P):** *(SELECT/FROM 1 P, Unterabfrage mit AVG 3 P, ORDER BY DESC 2 P)*

```sql
SELECT bezeichnung, breite_cm
FROM artikel
WHERE breite_cm > (SELECT AVG(breite_cm) FROM artikel)
ORDER BY breite_cm DESC;
```

**B4 (5 P):** *(Join zur Warengruppe 2 P, LEFT JOIN auf foto 2 P, IS NULL 1 P)*

```sql
SELECT a.bezeichnung, w.name
FROM artikel a
JOIN warengruppe w ON w.warengruppe_id = a.warengruppe_id
LEFT JOIN foto f ON f.artikel_id = a.artikel_id
WHERE f.foto_id IS NULL;
```

Gleichwertig: `WHERE NOT EXISTS (SELECT * FROM foto f WHERE f.artikel_id = a.artikel_id)` oder `WHERE a.artikel_id NOT IN (SELECT artikel_id FROM foto)`.

**B5 (6 P):** *(INSERT artikel 2 P, INSERT foto mit Bezug auf den neuen Schlüssel 2 P, Hinweis auf das Material 2 P)*

```sql
INSERT INTO artikel (bezeichnung, hersteller_nr, beschreibung, warengruppe_id)
VALUES ('Couchtisch Lund', 'LU-118', 'folgt', 14);

INSERT INTO foto (pfad, artikel_id)
VALUES ('/bilder/lund_118.jpg', LAST_INSERT_ID());
```

Hinweis: Für das **Material** (Eiche) gibt es im Schema keine Spalte – die Angabe kann nicht gespeichert werden (höchstens in der Beschreibung oder nach einer Schemaerweiterung). Die Primärschlüssel werden nicht angegeben (`auto_increment`); `breite_cm` bleibt NULL.

Gleichwertig für den Fremdschlüssel: `(SELECT artikel_id FROM artikel WHERE hersteller_nr = 'LU-118')`.

*Prüferkommentar: Wer eine Spalte `material` erfindet, verliert den Hinweispunkt und einen Syntaxpunkt – genau diese Falle steckt in der Aufgabe.*

---

## Block C – Datenaustausch und REST (25 P)

**C1 (6 P):** *(je Format 2 P)*

| Format | Merkmale |
|---|---|
| CSV | reine Textdatei mit Werten, getrennt durch ein Trennzeichen (Komma/Semikolon); eine Zeile je Datensatz, keine Hierarchie und keine Datentypen |
| XML | Auszeichnungssprache mit öffnenden und schließenden Tags, hierarchisch verschachtelt; mit Schema (XSD) prüfbar, eher umfangreich |
| JSON | Schlüssel-Wert-Paare, Objekte `{}` und Arrays `[]`, verschachtelbar; kompakt und direkt in JavaScript nutzbar, Standard bei REST-APIs |

**C2 (6 P):** *(je Vorteil 2 P)*

| Eigenschaft | Vorteil |
|---|---|
| Stateless | Jeder Server kann jede Anfrage beantworten; zusätzliche Server lassen sich einfach hinzufügen (Skalierung), ein Serverausfall verliert keine Sitzungen. |
| Cacheable | Wiederholte Abfragen (z. B. Artikeldaten) werden aus einem Cache beantwortet – weniger Serverlast und schnellere Antworten. |
| Uniform interface | Alle Clients (App, Website, Marktplatz) nutzen dieselben URIs und Standardmethoden; die API ist ohne Sonderwissen verständlich und Client und Server bleiben entkoppelt. |

**C3 (3 P):** *(je Methode 1 P)*

| Methode | Funktion |
|---|---|
| GET | liest eine Ressource (z. B. einen Artikel), ohne sie zu verändern |
| PUT | ersetzt eine Ressource unter einer bekannten URI vollständig oder legt sie dort an |
| DELETE | löscht die angegebene Ressource |

**C4 (10 P):** *(je richtige Zeile 2–9 1 P, Methodenbalken 2 P)*

| Nr. | von | an | Beschriftung |
|---|---|---|---|
| 1 | :Client | :ApiServer | Request |
| 2 | :ApiServer | :ApiServer | handleGet(req, res) |
| 3 | :ApiServer | req:Request | getParameter("nr") |
| 4 | req:Request | :ApiServer | "LU-118" (Antwort) |
| 5 | :ApiServer | :ArtikelRepository | findeArtikel("LU-118") |
| 6 | :ArtikelRepository | :ApiServer | artikel (Antwort) |
| 7 | :ApiServer | :ApiServer | toJson(artikel) |
| 8 | :ApiServer | :ApiServer | json (Antwort) |
| 9 | :ApiServer | res:Response | send(json) |
| 10 | :ApiServer | :Client | Response |

Methodenbalken: auf `:Client` während der gesamten Anfrage; auf `:ApiServer` vom Request bis zur Response, dazu ein **versetzter Balken** für `handleGet` und darin ein weiterer für `toJson` (Selbstaufrufe); kurze Balken auf `req:Request` (getParameter), `:ArtikelRepository` (findeArtikel) und `res:Response` (send).

*Prüferkommentar: Antworten werden gestrichelt gezeichnet; die Zeilen 4, 6 und 8 fehlen am häufigsten. Ein Aufruf von `send` auf dem Client statt auf `res` ist falsch.*

---

## Block D – Datenschutz und Verfügbarkeit (25 P)

**D1 (5 P):** *(je Recht 1 P)* Recht auf **Information** (Art. 13) · **Auskunft** (Art. 15) · **Berichtigung** (Art. 16) · **Löschung** („Recht auf Vergessenwerden“, Art. 17) · **Einschränkung der Verarbeitung** (Art. 18) · **Datenübertragbarkeit** (Art. 20) · **Widerspruch** (Art. 21) · **Widerruf der Einwilligung** (Art. 7 Abs. 3) · keine ausschließlich **automatisierte Einzelentscheidung** (Art. 22) · Beschwerde bei der Aufsichtsbehörde (Art. 77).

**D2 (5 P):** *(Erläuterung 3 P, zwei Beispiele 2 P)* Datenschutzfreundliche Voreinstellungen (*data protection by default*) bedeuten: Ohne Zutun des Nutzers verarbeitet die App **nur die Daten, die für den jeweiligen Zweck nötig sind**. Das gilt für die **Menge** der erhobenen Daten, den **Umfang** der Verarbeitung, die **Speicherdauer** und die **Zugänglichkeit** – Daten werden nicht automatisch einer unbestimmten Zahl von Personen zugänglich gemacht. Wer mehr will, muss das aktiv einschalten.
Beispiele: Klickverlauf und persönliche Vorschläge sind **ab Werk aus** · Standortzugriff nur bei Nutzung der Hallennavigation · Merkzettel ist **privat**, Teilen nur per aktivem Link · Gastzugang ohne Konto möglich · Klickdaten werden nach 90 Tagen automatisch gelöscht.

**D3 (6 P):** *(je Zeile 2 P)*

| Sachverhalt | zulässig/nicht zulässig, Begründung |
|---|---|
| Für die Lieferung eines bestellten Sofas verarbeitet das Möbelhaus Name, Anschrift und Telefonnummer des Käufers. | **zulässig** – zur Erfüllung des Kaufvertrags (Lieferung, Terminabsprache) erforderlich. |
| Die App zeigt Produktvorschläge auf Grundlage des Klickverlaufs, nachdem der Nutzer beim ersten Start „Persönliche Vorschläge erlauben“ aktiv gewählt hat. | **zulässig** – wirksame Einwilligung für einen bestimmten Zweck; sie muss jederzeit widerrufbar sein. |
| Das Möbelhaus gibt die E-Mail-Adressen aller App-Nutzer an einen Küchenhersteller weiter, damit dieser Werbung verschicken kann. | **nicht zulässig** – keine Einwilligung zur Weitergabe und für keinen Vertrag mit den Nutzern erforderlich. |

**D4 (5 P):** *(Ablauf 3 P, zwei Maßnahmen 2 P)* Der Angreifer steuert ein **Botnetz** aus vielen gekaperten Rechnern und IoT-Geräten. Auf sein Kommando senden alle **gleichzeitig massenhaft Anfragen** an den App-Server oder überlasten seine Leitung. Server oder Netz sind ausgelastet, **echte Nutzer erhalten keine Antwort** – die Verfügbarkeit ist verletzt. Weil die Anfragen von vielen Adressen kommen, hilft das Sperren einzelner IP-Adressen kaum.
Maßnahmen: DDoS-Schutzdienst bzw. Filterung (Scrubbing) beim Provider · Content Delivery Network, das statische Inhalte verteilt ausliefert · **Rate Limiting** und Firewall-Regeln · Lastverteilung über mehrere Server · Notfallplan mit Ansprechpartnern beim Provider.

**D5 (4 P):** *(Begriff 2 P, Beispiel 2 P)* Bei der Zwei-Faktor-Authentifizierung weist sich der Nutzer mit **zwei voneinander unabhängigen Faktoren aus unterschiedlichen Kategorien** aus: **Wissen** (Passwort, PIN), **Besitz** (Smartphone, Sicherheitsschlüssel) und **Inhärenz** (Fingerabdruck, Gesicht). Ein gestohlenes Passwort allein reicht dann nicht.
Beispiel: Der Kunde meldet sich mit Passwort an und bestätigt zusätzlich einen sechsstelligen Code aus einer Authenticator-App auf seinem Smartphone (Wissen + Besitz).
