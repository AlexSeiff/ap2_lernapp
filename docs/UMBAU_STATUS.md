# Umbau-Status

Arbeitsbranch: `umbau`. Keine Veröffentlichung, kein Merge, kein Pull Request.

## Phase 0 – Sicherheitsnetz

Status: Sicherheitsnetz umgesetzt; Abschluss durch fehlenden Git-Schreibzugriff blockiert (nicht committed).

- Neuer Inhalts-Snapshot: SHA-256 je Datei aus `inhaltDateien()`, einschließlich aller `texte/*.json`.
- Feste Testuhr (20.11.2026), weil `content.json` den Importzeitpunkt enthält. Keine Änderung am Produktverhalten oder Ausschluss von Inhaltsfeldern.
- Echter Lernstand und alle 13 JSON-Sicherungen nur gelesen: Versuche, Karten, Markierungen, Lernziele, Klausuren, Journal und Hervorhebungen bleiben erhalten; JSON-Rundlauf und erneute Migration sind gleich.
- Historische Aufgabenmigration vor Version 9 wird weiterhin berücksichtigt; keine neue ID-Änderung.
- `npx.cmd vitest run tests/umbauGleichheit.test.ts --update`: 2 Tests grün, Ausgangssnapshot erstellt. Erster vollständiger Lauf: Zeitstempelabweichung erkannt und durch feste Testuhr behoben.
- `npm.cmd run import-report`: Hinweise (0).
- Erster Lauf von `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd run build`: grün.
- PowerShell blockiert `npx.ps1`; Verwendung der regulären Windows-Starter `npm.cmd` / `npx.cmd`.

- Erneutes `npm.cmd test` mit fester Testuhr: 93 Dateien, 1.505 Tests grün.
- Erneutes `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`: grün.
- `git add -- tests/umbauGleichheit.test.ts tests/__snapshots__/umbauGleichheit.test.ts.snap docs/UMBAU_STATUS.md`: fehlgeschlagen, `fatal: Unable to create 'C:/dev/ap2-lern-app/.git/index.lock': Permission denied`.
- Offener Punkt: Die Umgebung erlaubt für `.git` nur Lesen und keine Rechteerweiterung. Der vorgeschriebene einzelne Phasen-Commit ist damit nicht möglich. Keine Umgehung der Zugriffsbeschränkung; Fortsetzung benötigt eine Umgebung mit Git-Schreibzugriff.

## Phase 1 – Browser-Tests (Playwright + axe)

Status: erledigt (20.11.2026), von Hand statt durch Codex umgesetzt.

- Warum nicht durch Codex: Der Codex-Sandkasten verweigert Edge den Start (`CoCreateInstance of Elevator failed … hr =80070005`). Die Browser-Tests
  müssen gegen die laufende App geschrieben und ausgeführt werden; das geht nur außerhalb des Sandkastens. Für die folgenden Phasen (reine
  Code-Umbauten) bleibt Codex einsetzbar, Browserläufe und Commits macht der Besitzer-Lauf.
- Neu: `playwright.config.ts`, `e2e/hilfen.ts`, `e2e/rauch.spec.ts` (7 Rauchtests), `e2e/handy.spec.ts` (Handybreite, kein seitlicher Überlauf),
  `e2e/zugaenglichkeit.spec.ts` (axe, WCAG 2.1 A/AA, 17 Seiten × hell/dunkel). `npm run test:e2e` baut und testet gegen `vite preview` (Port 4174),
  Service Worker blockiert, leeres Browserprofil je Test. Lokal Edge, in der CI Chromium. CI-Schritt in `.github/workflows/pages.yml`.
- Rauchtests: Karte bewerten (Lernstand gespeichert) · Klausur starten, abgeben, Bewertung abschließen (Ergebnis im Lernstand) · Sicherung
  herunterladen, Fortschritt löschen, Sicherung einspielen (Kartenzahl wie vorher) · SQL ausführen · Diagramm-Übung (Element in Lücke setzen,
  Prüfen) · Suche mit Strg K · Design hell/dunkel.
- axe-Funde (serious/critical, beide Farbschemata):
  - `/daten`: `scrollable-region-focusable` – behoben ohne Änderung am Aussehen (`tabIndex={0}`, `role="region"`, `aria-label` an den zwei
    Tabellen-Containern in `src/pages/Daten.tsx`).
  - `/heute`: `link-in-text-block` – Link „Einstellungen“ im grauen Hinweistext (`.small.muted > a[href$="#/einstellungen"]`) ist nur durch die
    Farbe erkennbar. **Offen**, weil ein Unterstrich das Aussehen ändert; als bekannter Fund in `OFFEN` in `e2e/zugaenglichkeit.spec.ts`.
  - Leichte/mittlere axe-Funde (minor/moderate) werden nicht geprüft und nicht aufgelistet.
- Stabilität: ganze Suite dreimal mit `--repeat-each=3` (129 Tests, 387 Läufe) grün. Ein Test (Suche) war einmal unzuverlässig, weil Strg K vor
  dem Anhängen des Tastenkürzels gedrückt wurde; er wiederholt den Tastendruck jetzt bis zum Erfolg.
- Befehle: `npm run import-report` (Hinweise 0), `npm test` (93 Dateien), `npm run typecheck`, `npm run lint`, `npm run format:check`,
  `npm run test:e2e` (43 Tests): alle grün.

## Phase 2 – Server-Zeit-Schicht entfernen, `shared/` → `domain/`

Status: umgesetzt auf `umbau`, uncommitted. Browser-Abnahme und Commit bleiben beim Besitzer-Lauf.

- `shared/` mit PowerShell `Move-Item` nach `domain/` verschoben (alle 19 Dateien). Importe in App, Build, Werkzeugen und Tests,
  `vite.config.ts`, `tsconfig.app.json`, Pfade in README, CONTRIBUTING, DOKUMENTATION und der Skill `inhalte-schreiben` angepasst.
  `tsconfig.node.json`, ESLint und Prettier enthalten keine umzubenennenden Pfade. Historische Phasenbeschreibung im Umbauplan bleibt stehen.
- Vollständig entfernte Datei: `src/lib/apiError.ts`. Keine Testdatei gelöscht. Die bisherigen Dateien `shared/api.ts`,
  `shared/aufgabenUmzug.ts`, `shared/begriffsseiten.ts`, `shared/config.ts`, `shared/diagrammUebungen.ts`, `shared/jsonUebungen.ts`,
  `shared/lernkarten.ts`, `shared/mergeProgress.ts`, `shared/parser.ts`, `shared/progress.ts`, `shared/prueferfragen.ts`,
  `shared/quellen.ts`, `shared/rechenUebungen.ts`, `shared/rechenweg.ts`, `shared/sqlUebungen.ts`, `shared/svgDiagramm.ts`,
  `shared/texte.ts`, `shared/types.ts` und `shared/verwandt.ts` liegen jetzt unter `domain/`.
- Entfernt: `DataSource`, `ApiError`, `SaveProgressRequest`, Revisionszähler und Revisionsprüfung, HTTP-409-/Konfliktzustand,
  `checkProgressPut`, `ProgressPutSchema`, `ProgressPutResult`, dessen ungenutzter Typ `ProgressData`, `revisionOf`, `isStaleRevision`, `CONFLICT_MESSAGE` und das
  `reset`-Transportfeld. `domain/api.ts` enthält nur noch die tatsächlich verwendeten Sicherungs-Metadaten.
- `PROGRESS_VERSION` bleibt 10; JSON-Sicherungen bleiben lesbar. Migration 1 → 2 bleibt als Versionsschritt erhalten.
  Historisches `revision` wird beim Migrieren und Speichern verworfen. Keine Änderung an Aufgaben-IDs, Inhalten, `data/` oder `.env.local`.
- Mehrere Tabs: Vor jedem Schreiben wird localStorage erneut gelesen. Weicht er vom zuletzt in diesem Tab bekannten Stand ab,
  führt `mergeProgress` beide Stände zusammen, auch beim letzten Speichern vor dem Schließen. Wiederholtes Speichern vor Zustellung
  des Storage-Ereignisses bewahrt ebenfalls den fremden Fortschritt. Ohne fremde Änderung wird der eigene Stand direkt geschrieben:
  sonst würden entfernte Antworten, Kartenstände oder abgewählte Lernziele wieder auftauchen.
  Das Storage-Ereignis speichert ausstehende eigene Änderungen zuerst und lädt dann die Seite neu. Scheitert das Speichern,
  bleibt die Seite mit Fehlermeldung und ausstehenden Änderungen offen.
- Nutzerwirkung: Lernabläufe, Sicherungen, bewusstes Zurücksetzen/Einspielen und die Fehlermeldung bei versehentlich leerem/zu kleinem
  Stand bleiben erhalten. Im Mehrtab-Fall übernimmt der Tab den neuen Stand jetzt **ohne Neuladen** (Korrektur im Besitzer-Lauf:
  Codex hatte, wie im Plan formuliert, die Seite neu geladen; ein Browsertest zeigte, dass dabei eine laufende Kartenrunde im zweiten Tab
  verloren ging – der Schreibschutz allein reicht, und die Seite bleibt, wie sie ist; gesichert durch `e2e/zweiTabs.spec.ts`) statt
  der alten dauerhaften Konfliktblockade. localStorage bleibt unverändert die Speichertechnik; Lesen/Zusammenführen/Schreiben ist keine tabübergreifende
  Transaktion. Die spätere IndexedDB-Phase wird hier nicht vorgezogen.
- `isSuspiciousAttemptDrop` bleibt mit unveränderten Schwellen und deutscher Meldung vor dem Schreiben wirksam.
  Verglichen wird mit dem zuletzt in diesem Tab bekannten Stand, damit ein fremder Lernzuwachs nicht fälschlich als eigener
  Versuchsverlust gilt. Bewusstes Ersetzen verwendet einen separaten lokalen Schreibweg; Schema-Prüfung, Tagessicherung und Schutz
  zwischenzeitlicher fremder Änderungen gelten auch dort. Keine HTTP-Statuscodes oder Revisionsfelder nötig.

Geänderte Tests und Gründe:

- `progress.test.ts`: reine PUT-/409-/Revisionsvergabetests entfernt. Schema, Schwellen, Migrationen, unbekannte Felder und
  ungültige Selbsteinschätzung/Fehlergründe bleiben geprüft; Speicherrundläufe verwenden den echten lokalen Speicher.
  Historische Komplettvergleiche erwarten ausdrücklich nur das Wegfallen von `revision`.
- `staticApi.test.ts`: Revisionszählung und 409-Ablehnung durch reale Zweitab-Zusammenführung ersetzt. Ergänzt: weiteres Schreiben
  vor dem Storage-Ereignis, leerer/zu kleiner Stand ohne Überschreiben, bewusstes Ersetzen mit/ohne fremde Änderungen, erlaubtes
  Entfernen eigener Daten, Schemafehler auch beim Ersetzen, alte Revisionen, Storage-Ereignis samt Abmeldung.
  Defekte JSON-Daten und nicht verfügbarer Speicher bleiben geprüft.
- `progressSaver.test.ts`: Revision/409/Konfliktstopp entfernt; die zwei bisherigen Reset-Transporttests prüfen nun den eigenen
  Schreibweg für bewusstes Ersetzen bei Fehlern, beim Schließen und bei verspäteter Bestätigung.
  Debounce, serielles Speichern, ausstehende Änderungen und Fehlermeldungen bleiben; Flush-Erfolg/-Fehler sind zusätzlich abgesichert.
- `markiert.test.ts`, `diagrammUebungen.test.ts`: historische Komplettvergleiche ohne Revision, Schema-Akzeptanz statt PUT-Antwort.
  `mergeProgress.test.ts`: Revisionsannahmen entfernt, Inhalte/Einstellungen bleiben geprüft; Versuchsverlustschwelle explizit geprüft.
  `textmarker.test.ts`: Schema statt PUT, unveränderte Versuche statt Revisionsvergleich.
  `browserBackups.test.ts`: Sicherung enthält weiterhin den vorherigen Stand, nun ausdrücklich ohne Revision.
  `settings.test.ts`: überflüssigen Revisionswert aus der Testeingabe entfernt.
- Neu: `tests/ohneRevision.ts`, explizite Erwartungsanpassung nur für das entfernte historische Feld.
  Alle übrigen Teständerungen sind Pfadwechsel. `tests/umbauGleichheit.test.ts` wurde **ausschließlich am Importpfad** geändert;
  Snapshot und Erwartungen sowie dessen Hilfslogik sind unverändert.

Prüfungen (Windows-Starter `npm.cmd`, ohne Installation):

- `npm run import-report`: grün, Hinweise (0).
- `npm test`: grün, 93 Dateien / 1.503 Tests, einschließlich Inhalts-Snapshot und aller vorhandenen echten Sicherungen.
- `npm run typecheck`: grün.
- `npm run lint`: grün.
- `npm run format:check`: grün.
- `npm run build`: grün, PWA mit 154 Einträgen.
- Zwischenläufe: zunächst noch drei historische Revisionserwartungen in Markierungs-/Diagrammtests; entsprechend dem gewollten
  Entfernen dieses Feldes präzisiert. Typfehler an umgestellten Testhelfern korrigiert, Fehlerursache beim Weiterwerfen ergänzt
  (Lint). Formatprüfung beanstandete die Zeilenenden der per Skript angepassten Dateien; mit Projekt-Prettier formatiert.
  Keine fachliche Erwartung gelockert, kein Snapshot aktualisiert.
- `npm run test:e2e`: ausdrücklich nicht ausgeführt (Edge im Sandkasten nicht startbar); übernimmt der Besitzer-Lauf.
- Kein `npm install`, `git add`, `git mv` oder Commit; kein Schreibzugriff auf `.git`.

## Phase 3 – Große Seiten aufteilen

Status: erledigt (20.11.2026), von Hand umgesetzt (Codex hatte sein Nutzungslimit erreicht, Rücksetzung am 21.11. um 12:23 Uhr).

Reiner Umbau, kein neues Verhalten: Die Teile wurden mit Skripten 1:1 verschoben (kein Abtippen), die DOM-Struktur, Klassen- und aria-Namen
blieben unverändert. Zeilenzahlen alt → neu:

- `src/pages/Dashboard.tsx` 729 → 124. Neu in `src/pages/uebersicht/`: `Weiterlernen`, `RandNotizen` (Countdown, Lernserie), `BereichRinge`,
  `Widgets` (Fällig, Übungen, Kartenstand, Markiert, Begriff des Tages, Klausuren), `Verlauf` (Sparkline, Delta), `Hinweise` (Selbsteinschätzung,
  Sicherungs-Erinnerung), `ThemaFortschritt`, `KlausurTrend`.
- `src/pages/Karteikarten.tsx` 724 → 233. Neu in `src/pages/karten/`: `LeichtRunde`, `AufdeckRunde`, `KartenBlaettern`, `KartenFilter`,
  `DeckTabelle`, `RundenBalken`, `kartenAnzeige` (Beschriftungen und Farbklasse; `Kartenstand.tsx` importiert `CARD_TYPE_LABELS` von dort).
  Alle Hooks bleiben im Container; der Wischen-Merker (`touch`) liegt jetzt in `AufdeckRunde`, wo er allein gebraucht wird.
- `src/pages/RechenUebung.tsx` 562 → 370. Neu `src/pages/rechenuebung/Bausteine.tsx` (Beispielkarte, Datentabelle, Eingabefeld, Rückmeldung,
  Layout, Meldungen und das lazy geladene `Rechenweg`).
- `src/components/DiagrammEditor.tsx` 891 → 459. Neu in `src/components/diagramm/`: `Felder` (Knoten-/Kantenfelder), `Zeichnung` (inkl.
  `DiagrammAnsicht`), `Formhinweise`, `typen`. Die Platzwahl für neue Elemente ist als reine Funktion `neuerPlatz` nach `src/lib/diagrammPlatz.ts`
  gewandert (Unit-Test `tests/diagrammPlatz.test.ts`, 9 Fälle). Importe in `BoxplotEditor`, `KoordinatenEditor`, `StruktogrammEditor`,
  `EditorAntwort` zeigen auf die neuen Dateien.
- `src/components/DiagrammSvg.tsx` 684 → 349; `FormZeichnung` (alle Formen, 344 Zeilen) liegt in `src/components/diagramm/FormZeichnung.tsx`.
- `src/components/TabellenEditor.tsx` 451 → 221; `TabellenKarte` und `RelationText` in `src/components/tabellen/TabellenKarte.tsx`.
- `src/pages/Klausur.tsx` 420 → 292; `KlausurAuswahl` (mit `useNeueMischKlausur`) und `ExamResult` in `src/pages/klausur/`. `Klausur.tsx` exportiert
  `KlausurAuswahl` weiter, damit App und Tests eine Seite mit einem Ladeschritt behalten.

Bewusst nicht weiter zerlegt: `DiagrammEditor.tsx` (459 Zeilen) – die Hauptkomponente hält eng gekoppelte Zeiger-, Tastatur- und Rückgängig-Zustände in
Closures; ein weiterer Schnitt hätte viele Parameter durchreichen müssen, ohne das Lesen zu erleichtern.

Neue Browser-Tests in `e2e/rauch.spec.ts` (Rechenübung mit Lösung und Rechenweg, Diagramm-Editor einfügen und rückgängig, Tabellen-Editor).
Die Seiten Dashboard, Karteikarten, Klausur und der Diagramm-Editor werden zusätzlich von den axe- und Rauchtests aus Phase 1 berührt.

Befehle: `npm run import-report` (Hinweise 0), `npm test` (94 Dateien, 1512 Tests), `npm run typecheck`, `npm run lint`, `npm run format:check`,
`npm run test:e2e` (49 Tests): alle grün.

## Phase 4 – CSS vereinheitlichen

Status: erledigt (20.11.2026), von Hand umgesetzt. Ziel: Ordnung ohne Änderung des Aussehens. Alle Änderungen sind mit Skripten (PostCSS)
gemacht und an zwei harten Messlatten geprüft.

Messlatten (vorher aufgenommen, nach jedem Schritt verglichen):
1. **Pixelvergleich** (`e2e/visuell.spec.ts`, nur mit `E2E_VISUELL=1`): 23 Seiten × hell/dunkel × Desktop (1280 px)/Handy (390 px) = 92 Bilder,
   0 abweichende Pixel erlaubt. Die Bilder entstehen lokal aus dem **alten** CSS-Stand (`e2e-visuell/`, nicht im Repository, weil sie vom Rechner
   abhängen). Aufnahme mit festem Datum, ruhiger Seitenhöhe und ohne Ladetexte; der Importzeitpunkt auf `/daten` ist maskiert. Stabil in 4 von 4
   Läufen. Erste Läufe waren unruhig (Seite noch im Ladezustand aufgenommen); Ursache behoben und die Basislinie danach aus dem alten CSS neu erzeugt.
2. **Berechnete CSS-Variablen**: alle benutzerdefinierten Eigenschaften in 72 Kombinationen (hell/dunkel × `data-theme` × Karo-Stärke × 4 Breiten),
   119 Eigenschaften, 0 Abweichungen.

Schritte:
- **`src/styles/tokens.css`**: alle 507 Token-Deklarationen aus den vier CSS-Dateien an einer Stelle; 149 überschriebene entfielen (die spätere im
  selben Selektor und Kontext gewinnt immer). 8 nirgends benutzte Tokens entfernt (`--glanz`, `--seite-max`, `--paper-rule`, `--shell-sidebar`,
  `--shell-glass`, `--shell-selected`, `--ring-loch`, `--notebook-clay-fill`).
- **Überschriebene Deklarationen** (gleicher Selektor und Kontext, spätere Regel setzt dieselbe Eigenschaft): 122 entfernt. Doppelte Eigenschaften
  in einer Regel (Fallbacks) und `!important` blieben unberührt.
- **Tote Selektoren**: 59 Selektoren (56 Regeln) mit Klassen, die nirgends vorkommen (Reste der früheren Startseiten-Entwürfe: `dashboard-kopf`,
  `widget-weiter`, `bereich-ringe`, `notebook-plan`, `nav-badge`, `bottom-nav` …). Als „benutzt“ zählt eine Klasse, sobald ihr Name irgendwo als Text
  vorkommt (auch in Textvorlagen mit `${…}`, Inhaltsdateien, KaTeX/CodeMirror/Markdown).
- **Aufteilung**: `styles.css` (1421 Zeilen) liegt jetzt in `src/styles/01-…` bis `08-…` (je 150–250 Zeilen), `index.css` importiert alles in der
  verbindlichen Reihenfolge, `apple.css`, `paper.css`, `notizbuch.css` und `glossar-register.css` sind in denselben Ordner gezogen. Reihenfolge
  unverändert, deshalb ist die Kaskade unverändert; verlustfrei geprüft (Text ohne Leerraum vor und nach dem Schnitt gleich).

Bewusst nicht gemacht und warum:
- **Keine Zusammenlegung nach Funktionsbereich** (z. B. eine `karten.css`): Das würde Regeln in der Kaskade verschieben. Das lässt sich nicht beweisen,
  und die 92 Bilder zeigen weder Hover-, Fokus-, geöffnete Dialoge noch das Ziehen im Diagramm-Editor.
- **Die drei Gestaltungsschichten** (`apple`, `paper`, `notizbuch`) bleiben getrennt, weil sie sich gegenseitig gezielt überschreiben. Auflösen wäre ein
  eigener, sichtbarer Gestaltungsumbau.
- Die Pixeltests prüfen Ruhezustände. Hover, Fokus, offene Dialoge und die Editoren beim Bedienen sind durch die Rauch- und axe-Tests nur auf
  Funktion, nicht auf Aussehen abgesichert.

Befehle: `npm run import-report` (Hinweise 0), `npm test` (94 Dateien, 1512 Tests), `npm run typecheck`, `npm run lint`, `npm run format:check`,
`npm run test:e2e` (49 Tests), Pixelvergleich (92 Bilder): alle grün. In `DOKUMENTATION.md` stehen noch alte CSS-Pfade; sie werden in Phase 9
mit der Aufteilung der Dokumentation erneuert.

## Phase 5 – Lernstand nach IndexedDB

Status: erledigt (20.11.2026), von Hand umgesetzt. **Abweichung vom Plan, bewusst:** Der Lernstand liegt als **ein Eintrag** (derselbe JSON-Text wie
eine heruntergeladene Sicherung) in IndexedDB, nicht als ein Datensatz je Versuch, Karte und Markierung. Gründe: Der echte Stand ist rund 74 KB, ein
Umschreiben des ganzen Eintrags kostet nichts; Datensätze je Eintrag hätten eine neue Zusammenführungslogik und ein neues Dateiformat verlangt, also
genau das Risiko, das bei Lernfortschritt vermieden werden soll. Der Gewinn, den der Plan wollte, ist trotzdem da: Das 5-MB-Limit des localStorage
entfällt (IndexedDB hat deutlich mehr Platz), und Lesen + Schreiben laufen in **einer Transaktion**, zwei Tabs können sich also nicht mehr
überschreiben. Das Sicherungsformat, `PROGRESS_VERSION` und `mergeProgress` sind unverändert.

Neu:
- `src/lib/progressSchreiben.ts`: die Rechenlogik des Speicherns (prüfen, Schutz vor Versuchs-Rückgang, fremde Änderungen zusammenführen), wörtlich aus
  dem bisherigen Code gezogen und vom localStorage- **und** vom IndexedDB-Speicher benutzt. Die 57 bestehenden Speichertests blieben dabei unverändert grün.
- `src/lib/idbFortschritt.ts`: der IndexedDB-Speicher (Datenbank `ap2-lernstand`, Eintrag `fortschritt`, nicht lesbarer Text wird unter
  `fortschritt-defekt` gesichert). Andere Tabs erfahren von Änderungen über einen `BroadcastChannel`.
- `src/lib/fortschrittSpeicher.ts`: wählt den Speicher und macht den Umzug. `src/lib/localFortschritt.ts`: der bisherige localStorage-Speicher (jetzt eigene
  Datei, `staticApi.ts` exportiert ihn weiter).

Sicherheit des Umzugs (alles getestet):
- Es wird nur übernommen, wenn IndexedDB noch leer ist; vorhandener Fortschritt wird nie überschrieben (auch nicht von einem älteren localStorage-Stand).
- Der Text wird 1:1 kopiert und danach zurückgelesen und verglichen.
- Der **alte localStorage-Eintrag bleibt unverändert stehen** (Rückfall) und wird **nicht gelöscht**; das ist frühestens in einer späteren Version vorgesehen.
  Vermerkt wird der Umzug unter `ap2-fortschritt-in-indexeddb`.
- Geht IndexedDB nicht (gesperrt, privates Fenster, Zeitüberschreitung nach 4 s) oder schlägt irgendein Schritt fehl, arbeitet die App in dieser Sitzung mit dem
  localStorage weiter. Es geht nichts verloren.

Prüfungen:
- `tests/idbFortschritt.test.ts` (14 Tests, mit `fake-indexeddb`): Lesen/Schreiben, Zusammenführen zweier Tabs, **gleichzeitiges Speichern aus zwei Tabs**, Schutz vor
  leerem Stand, ungültige Daten, kaputter Text, Benachrichtigung nur an andere Tabs, Umzug (1:1, nie überschreiben, ohne/kaputten alten Stand), automatische Wahl und
  Rückfall, und der Umzug **aller echten Lernstände aus `data/`** (nur lesend; läuft nur, wenn der Ordner da ist). Gegenprobe: Ein absichtlich eingebauter Fehler im
  Kopieren macht vier Tests rot, darunter den mit den echten Ständen.
- Browser (`e2e/speicher.spec.ts`, 3 Tests): alter Stand im localStorage zieht um und die Willkommensseite bleibt weg; danach wird nur noch in IndexedDB gespeichert
  und nach dem Neuladen ist alles da; ohne IndexedDB läuft die App mit dem localStorage weiter. Dazu bestehen die Zwei-Tab-Tests jetzt über den BroadcastChannel.
  Die Hilfsfunktion `lernstand()` in `e2e/hilfen.ts` liest aus IndexedDB und öffnet eine fehlende Datenbank nicht (das würde der App das Anlegen verbauen).
- **Einmalprobe im echten Browser** (frisches Profil, `data/` unverändert): Alle 14 echten Stände (`fortschritt.json` v9 mit 47 Versuchen/464 Karten und alle 13
  Sicherungen v1 bis v9) kommen **Byte für Byte identisch** in IndexedDB an, die App zeigt jeweils die Übersicht, kein Seitenfehler.
- Sichtbar geändert: zwei Sätze nennen jetzt IndexedDB statt localStorage (`Datenschutz.tsx` auf Einstellungen, `Daten.tsx`). Die acht betroffenen Pixelbilder
  wurden bewusst erneuert, das Diff-Bild zeigt nur diesen Satz.

Offen / Hinweise:
- Die Pixelvergleiche flackern unter voller Parallelität gelegentlich bei `/lernen/01` (allein laufen sie stabil); mit `--workers=2` stabil.
- In `DOKUMENTATION.md` und `README.md` steht noch „localStorage“ als Speicher des Lernstands; das erneuert Phase 9.

Befehle: `npm run import-report` (Hinweise 0), `npm test` (95 Dateien, 1526 Tests), `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test:e2e`
(52 Tests), Pixelvergleich (92 Bilder, `--workers=2`): alle grün.

## Phasen 6 bis 10

Noch nicht begonnen.
