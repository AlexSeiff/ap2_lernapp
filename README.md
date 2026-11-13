# AP2 Lern-App

Mit dieser App übst du für die IHK-Abschlussprüfung Teil 2 im Ausbildungsberuf Fachinformatiker/-in für Daten- und Prozessanalyse. Du kannst Lernblätter lesen, Karteikarten wiederholen, SQL auf Beispieldaten ausführen und Klausuren mit getrennten Lösungsblättern bearbeiten. [Online lernen](https://alexseiff.github.io/ap2_lernapp/)

## Starten

Die App ist rein statisch: kein Server, kein Konto, keine KI. Lokal getestet mit Node.js 24.21 und npm 11.19. Im Projektordner installieren und den Entwicklungsserver starten.

```sh
npm ci
npm run dev
```

Öffne <http://localhost:5178>. Zum Beenden drücke Strg+C. Die Inhalte kommen aus `content/`; änderst du dort ein Lernblatt, lädt die Seite neu. Lernstand und Einstellungen bleiben im Browser dieses Geräts.

So prüfst du den gebauten Stand mit Service Worker und Offline-Betrieb:

```sh
npm run build
npm run preview
```

Der Build bricht ab, wenn der Importbericht Hinweise hat (fehlendes Pflichtfeld, doppelte ID, toter Verweis). `npm run import-report` zeigt sie.

## Online-Version (GitHub Pages)

Die statische PWA verwendet einen HashRouter und relative Assetpfade. Unter **Daten & Import** kannst du eine JSON-Sicherung herunterladen und später einspielen oder mit einem anderen Lernstand zusammenführen. Automatische Tagessicherungen liegen im Browser in IndexedDB. Wenn du die Websitedaten löschst, brauchst du für die Wiederherstellung die heruntergeladene Datei.

Nach dem ersten vollständigen Download kannst du offline lernen, auch mit SQL und Formeln. Eine neue Version meldet sich mit **Neu laden**. Schließe eine laufende Klausurbearbeitung vorher ab.

GitHub prüft Pull Requests gegen `main`. Erst nach erfolgreichem Build auf `main` wird das Pages-Artefakt veröffentlicht. Im Repository muss unter **Settings → Pages → Build and deployment** die Quelle **GitHub Actions** gewählt sein. [Workflow](.github/workflows/pages.yml)

### Umzug aus der früheren lokalen App

Bis November 2026 gab es eine lokale Betriebsart mit eigenem Server, die den Lernstand in `data/fortschritt.json` ablegte. Diese Datei ist eine gültige Sicherung: unter **Daten & Import** mit **Sicherung einspielen** oder **zusammenführen** in den Browser übernehmen.

## Funktionen

| Bereich | Was es tut |
|---|---|
| **Navigation** | Die App ist ein kariertes Notizbuch: Die Übersicht und die vier Bereiche – **Lernen**, **Glossar**, **SQL-Editor**, **Einstellungen** – stehen im Inhaltsverzeichnis auf der linken Buchseite; die Unterpunkte des aktiven Bereichs sind darunter zu sehen. Im Glossar führt ein Buchstabenregister am rechten Rand zu den Begriffen; die Lupe (`Strg K` / `⌘K`) öffnet die Suche. Auf dem Handy ist es ein Spiralblock; den Navigationseinschub öffnet der Knopf „Inhalt“. Das Design folgt der Systemeinstellung oder deiner Auswahl unter *Einstellungen → Design* |
| **Übersicht** | Beim ersten Besuch eine kurze Willkommensseite; danach Widgets wie auf dem iPhone: **Weiterlernen** („Heute lernen“ und die zuletzt gelesene Stelle), Countdown zu deinem Prüfungstermin (unter *Einstellungen* eintragen), Lernserie, **Fortschrittsringe je Prüfungsbereich** (Karten sicher, Übungen gelöst), fällige Wiederholungen, SQL-/Rechen-/Diagramm-Übungen, markierte Karten, **Begriff des Tages**, Übungsklausuren mit Verlauf, schwächste Themen; darunter Fortschritt und Klausur-Trend je Thema |
| **Lernen** | Theorie der Deep Dives einschließlich Altklausur-Training mit Inhaltsverzeichnis und abhakbarem Lernziel-Check, dazu **Deep Dive 17 „Glossar & Diagramme“**: jeder Diagrammtyp (BPMN, EPK, UML, ER, Star-Schema, PAP, Struktogramm, Netzplan, Gantt, Boxplot, ROC …) als gezeichnetes Beispiel und alle Fachbegriffe von A bis Z; Lernblätter, die du nicht mehr sehen willst, mit **„Ausblenden“** aus der Themenliste, „Weiterlesen“, „Schwächste Themen“ und „Heute lernen“ nehmen (zurückholen unter *Lernen → Ausgeblendet*; Karteikarten und Aufgaben bleiben) |
| **Glossar & Begriffsseiten** | Fachbegriffe von A bis Z, zu 1.011 Begriffen eine eigene **Begriffsseite** mit Definition, Erklärung, Beispiel, Abgrenzung, Prüfungsfalle, Merksatz und oft einer Grafik – dazu „Siehe auch“, die passenden Karteikarten, Aufgaben, Rechen- und SQL-Übungen und die Stelle im Lernblatt zum Nachlesen. Die **Suche** führt immer zuerst zur Begriffsseite |
| **Karteikarten** | 734 Lernkarten aus `AP2_FIDPA_Lernkarten.json` (28 Decks) und 816 **Begriffskarten** aus `AP2_Fachbegriffe_Lernkarten.json` (16 Decks, je Deep Dive; Vorderseite Fachbegriff, Rückseite kurze Erklärung; Filter Typ „Fachbegriff“) plus Prüfer- und Fachgespräch-Fragen aus den Lernblättern; Filter nach Deep Dive, Deck, Typ, Schwierigkeit; „Fallen wiederholen"; **Durchblättern** (Karten nur ansehen, ←/→ oder wischen, ohne Bewertung); Leitner-System (Tastatur: `Leertaste` umdrehen, `1`/`2`/`3` bewerten); **Markieren** mit dem Stern oder `M` (in der Runde, beim Durchblättern und auf der Begriffsseite), Filter „Nur markierte“ und Kachel „Markiert“ auf der Übersicht – ändert das Fach nicht; **Leicht-Modus** mit 4 Antworten zum Einstieg (Tasten `1`–`4`, richtig bringt eine Karte höchstens in Fach 2); die falschen Antworten sind bei Fachbegriffen die Begriffe, mit denen sie verwechselt werden (aus „Abgrenzung“ und „Siehe auch“), sonst ähnliche Karten zum selben Thema; Fachbegriffe kommen auch umgekehrt (Erklärung → Begriff) |
| **Kartenstand** | Alle bewerteten Karten nach der letzten Bewertung – **gewusst**, **unsicher**, **nicht gewusst** – mit Verteilungsbalken, Filter nach Thema, Suche und Sortierung; Antwort aufklappen, markieren, eine Gruppe gezielt lernen oder durchblättern. Kurzfassung auch auf der Übersicht und der Karteikarten-Seite |
| **Übungsklausur** | Prüfungstimer, 100 Punkte, Anlagen einblendbar; Lösungen erst nach Abgabe; Ergebnis mit IHK-Note. SQL-Abfrage-Aufgaben (verknüpfte Aufgaben in DD1 und DataFit) schreibst du im **SQL-Editor** – ohne Ausführen, wie auf Papier; nach der Abgabe wird die Abfrage automatisch mit der Musterlösung verglichen, richtig = volle Punkte vorgeschlagen |
| **Einzelaufgaben** | Filter nach Thema, Block, Schwierigkeit, Status, Suche; Auswahl als Aufgaben-/Lösungsblatt exportieren. SQL-Abfrage-Aufgaben im **SQL-Editor** mit „Ausprobieren“ und automatischer Prüfung nach der Abgabe (zählt auch für die SQL-Übung) |
| **Fehlerjournal** | Jede Aufgabe unter voller Punktzahl kommt nach 1, 3 und 7 Tagen wieder |
| **Heute lernen & Lernplan** | Tagesrunde mit wählbarer Dauer (10 / 20 / 40 min): Aufgaben aus verschiedenen Themen (noch nicht beantwortete), Fehlerjournal, Übungen und Karten; geht nach jedem geschafften Schritt von selbst weiter. Der **Lernplan** verteilt die Themen bis zu deinem Prüfungstermin auf Wochen und zeigt das nötige Kartentempo |
| **Fachgespräch üben** | Zufällige Prüfer- und Fachgesprächsfragen mit Zeitfenster, optionaler Sprachaufnahme (bleibt im Browser) und Selbsteinschätzung |
| **Export & Sicherung** | Karten für Anki (.txt), fällige Wiederholungen als Kalender (.ics), Sicherung in eine feste Datei (Chromium-Browser) – unter *Daten* |
| **Material** | Lernzettel Kernthemen, Themenliste |
| **Diagramm-Übungen** | 30 Übungen zu EPK/eEPK, BPMN, Aktivitäts-, Sequenz-, Zustands-, ER-, Klassen- und Anwendungsfalldiagramm: Elemente in ein Diagramm-Gerüst ziehen oder antippen (Lücken füllen, Abläufe ordnen), Prüfen je Lücke mit Hinweisen zu Formregeln (z. B. kein XOR nach einem Ereignis); Wiederholung wie bei den Rechenübungen, verlinkt aus den Begriffsseiten und den Lernblättern |
| **Weiterlesen und Videos** | Geprüfte Links zu fast jedem Lernblatt-Abschnitt und zu vielen Begriffsseiten: Studyflix-Artikel und -Videos, Wikipedia, Gesetzestexte (BBiG, JArbSchG, BetrVG, DSGVO …), BSI. Öffnen in neuem Tab; ein YouTube-Video würde erst nach Klick geladen (Zwei-Klick-Lösung über youtube-nocookie.com). Links neu prüfen: `npm run quellen-pruefen` |
| **Rechenübungen** | 109 Rechenaufgaben aus den Lernblättern mit automatischer Prüfung, typischen Fehlern, Hinweisen, Rechenweg und „Neue Zahlen“; im Leicht-Modus „Ergebnis auswählen“ (gelöst zählt nur Eintippen) |
| **SQL-Belegsatz** | Kompakte SQL-Syntax im Stil des IHK-Belegsatzes (SELECT in Ausführungsreihenfolge, JOINs, Aggregate, Unterabfragen, DML, DDL, Constraints, Datentypen, Views, Indizes, Datums- und Textfunktionen mit SQLite-Hinweisen) – unter Glossar, im SQL-Editor als Seitenpanel, druckbar auf etwa drei Seiten A4; Abschnitt 11 stellt den SQL-Auszug des IHK-Anhangs (MySQL-Stil) der SQLite-Umsetzung gegenüber |
| **Klausur drucken** | Jede Übungsklausur und die gemischte Probeklausur als Aufgabenblatt mit Deckblatt (Name, Datum, Zeit, Hilfsmittel, Punkte je Block), jeder Block auf neuer Seite, Seitenzahlen; Lösungsblatt mit Bewertungsbogen. „Drucken“ auf der Klausurauswahl mischt eine neue Probeklausur |
| **Einstellungen** | Design (System/Hell/Dunkel); eigener Prüfungstermin; Leicht-Modus mit oder ohne automatische Antworten; persönliche Einstellungen – sie stehen im Fortschritt und ziehen mit jeder Sicherung um |
| **Daten & Import** | Importbericht, Fortschritt sichern/wiederherstellen/zurücksetzen |

### Getrennte Aufgaben- und Lösungsblätter (PDF)

Bei jeder Klausur (oder einer Auswahl unter *Einzelaufgaben*) gibt es **„Aufgabenblatt"** und **„Lösungsblatt"** als eigene Seiten
mit identischer Nummerierung. Über *Drucken / Als PDF speichern* entstehen z. B.

- `Aufgabenblatt_SQL_2026-09-21.pdf` – nur Aufgaben, Punkte und Schreibplatz
- `Loesungsblatt_SQL_2026-09-21.pdf` – Musterlösungen, Prüferkommentar, Punkteschema

Beide gibt es zusätzlich als Markdown-Download.

### Bewertung

- **Automatisch** bei SQL-Aufgaben im Editor, Rechen- und Diagramm-Übungen.
- **Selbstbewertung** bei offenen Aufgaben: Musterlösung + Prüferkommentar; enthält die Lösung eine Punktetabelle, werden daraus abhakbare Kriterien.
- Noten nach IHK-Schlüssel: 100–92 = 1 · 91–81 = 2 · 80–67 = 3 · 66–50 = 4 · 49–30 = 5 · 29–0 = 6.

## Lernkarten-Datei

Jede Datei `*Lernkarten*.json` im gewählten Quellordner wird importiert (aktuell `AP2_FIDPA_Lernkarten.json` und `AP2_Fachbegriffe_Lernkarten.json`). Format:

```json
{ "meta": { "hinweise": ["…"] },
  "decks": [ { "id": "sql", "titel": "SQL", "pruefungsbereich": "…", "quelle": "Deep Dive 1", "status": "behandelt",
               "karten": [ { "id": "SQL-001", "frage": "…", "antwort": "…", "typ": "wissen", "schwierigkeit": 1, "tags": ["join"] } ] } ] }
```

- `quelle` mit „Deep Dive N" ordnet das Deck dem Thema zu (bei „Deep Dive 5 und 12" gewinnt der Deep Dive, dessen Titel zum Decktitel passt). Decks ohne Deep Dive (WiSo, Projektarbeit …) sind über den Deck-Filter erreichbar.
- `typ`: wissen · abgrenzung · rechnung · anwendung · falle · begriff – „begriff" heißt: `frage` ist nur der Fachbegriff, `antwort` seine Erklärung (Begriffskarten; sie liefern auch die Erklärungen im Glossar). „falle"-Karten gibt es gesammelt über **⚠️ Fallen wiederholen** und vor jeder Übungsklausur.
- Zeilenumbrüche (`\n`) in Antworten bleiben erhalten; SQL-Zeilen werden als Codeblock angezeigt.
- Der Lernstand hängt an der Karten-`id` – IDs beim Bearbeiten der Datei also nicht ändern.
- Optional `mc` für den **Leicht-Modus** (4 Antworten, 1 richtig): `"mc": { "richtig": "…", "falsch": ["…", "…", "…"], "erklaerung": "…" }`
  – genau 3 verschiedene falsche Antworten, keine gleich der richtigen, `erklaerung` optional. Ein fehlerhafter Block steht im
  Importbericht, die Karte bleibt ohne ihn nutzbar.

## Aufbau und Mitarbeit

| Ort | Aufgabe |
|---|---|
| `content/` | Öffentliche Markdown-Lernblätter, Musterlösungen, Karten und Übungen als JSON |
| `shared/` | Inhaltsparser, Prüfregeln, Datenmodelle und Migration des Fortschritts |
| `src/` | React-Oberfläche, Rechenvorlagen und SQL-Editor mit SQLite/WASM |
| `build/` | Lernblätter lesen und als JSON-Dateien neben die App legen, Service Worker |
| `tools/` | Importbericht und Quellenprüfung |
| `tests/` | Vitest-Suite mit echten Lerninhalten und alten Sicherungsformaten |
| `dist/` | Erzeugte App mit Inhaltsdateien, Manifest und Service Worker |

Der Einstieg für eine neue Aufgabe erklärt IDs, Musterlösungen, Formelnotation, lokale Prüfung und Pull Requests. [Beitragsleitfaden](CONTRIBUTING.md) · [Technische Dokumentation](DOKUMENTATION.md) · [Audit- und Reviewberichte](docs/)

## Lizenz

| Teil | Lizenz | Datei |
|---|---|---|
| Programmcode (alles außerhalb von `content/`) | [MIT](https://opensource.org/license/mit) | [`LICENSE`](LICENSE) |
| Lerninhalte in `content/` (Lernblätter, Lösungen, Lernkarten, Übungen, Begriffsseiten) und die daraus erzeugten Dateien der Online-Version | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de) | [`LIZENZ-INHALTE.txt`](LIZENZ-INHALTE.txt) |

**Code (MIT):** frei verwenden, ändern und weitergeben, auch kommerziell – der Copyright-Hinweis und der Lizenztext müssen dabei bleiben.

**Inhalte (CC BY-NC-SA 4.0):** weitergeben und bearbeiten erlaubt, mit Namensnennung, nicht kommerziell und nur unter derselben Lizenz.
Namensnennung bitte so: „AP2 Lern-App“ von Alex (https://github.com/AlexSeiff/ap2_lernapp), CC BY-NC-SA 4.0.
Ausgenommen sind Inhalte Dritter (Zitate, Titel und Links verlinkter Quellen, Gesetzestexte) – für sie gelten die Rechte ihrer Urheber.

Verwendete Bibliotheken haben ihre eigenen Lizenzen (siehe `package.json` bzw. `node_modules/*/LICENSE`); die Icons stammen von
[Lucide](https://lucide.dev) (ISC-Lizenz), die Schriften Atkinson Hyperlegible und Kalam stehen unter der SIL Open Font License 1.1.
