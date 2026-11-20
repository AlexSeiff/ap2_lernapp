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

## Phase 7 – Übungsarten einheitlich registrieren (vor Phase 6 gezogen)

Status: erledigt (20.11.2026), von Hand umgesetzt, in kleinerem Umfang als im Plan, weil die Bestandsaufnahme zeigte, dass das Problem kleiner ist:
- Alle Übungsarten (SQL, Rechnen, Diagramme, JSON, Lernkarten, Quellen) sind **schon** JSON-Dateien mit eigenem Parser; die Rechenübungen verweisen auf eine
  Vorlage im Code und werden beim Import dagegen geprüft (`pruefeRechenUebung`). Doppelte IDs werden in allen Parsern gemeldet.
- „Verweise aus Begriffsseiten“ gibt es nicht als feste Verweise: Die Übungen zu einem Begriff findet die App zur Laufzeit per Textsuche
  (`uebungenZuBegriff`). Es kann dort keinen toten Verweis geben, also braucht es keine Prüfung.

Echte Lücken, die geschlossen wurden:
- **Dateimuster an einer Stelle:** `domain/inhaltsdateien.ts` (`JSON_DATEIEN`). Vorher standen dieselben fünf Muster in `isContentFile` (Build) und in `buildContent` (Import).
  Beide benutzen jetzt die eine Liste (`tests/inhaltsdateien.test.ts`: enthält die alte Regel als Referenz und prüft jede Datei im Inhaltsordner sowie 20 Grenzfälle).
- **Vorlagen-Liste prüft Doppelte:** `registriereVorlagen` bricht beim Laden ab, wenn zwei Vorlagen dieselbe ID haben (vorher überschrieb `Object.fromEntries` die erste
  stillschweigend). `tests/vorlagen.test.ts`: jede der 36 Vorlagen bekommt automatisch dieselben Pflichtangaben und Gegenproben (Titel/Bereich/Beschreibung, Zufallsdaten
  passen zum Schema, Lösung endlich und vollständig, Fehlerbilder und Felder zeigen auf vorhandene Ergebnisse, Platzhalter sind Texte, Seed reproduzierbar).
- **Gleichheitstest der Vorlagen:** `tests/rechenVorlagenGleichheit.test.ts` hält für alle 122 Rechenübungen und – bei „Neue Zahlen“ – für 5 feste Seeds einen Hash der
  erzeugten Aufgabe samt Lösung, Rechenweg und typischen Fehlern fest (631 Einträge, Snapshot `tests/__snapshots__/rechenVorlagenGleichheit.test.ts.snap`).
  Gegenprobe: Eine einzige geänderte Fehlermeldung in einer Vorlage macht ihn rot. Den Snapshot nur bewusst erneuern (`npx vitest run tests/rechenVorlagenGleichheit.test.ts -u`).
- **Importbericht** zeigt jetzt auch die Diagramm-Übungen (32, je Typ und Stufe) und, ob jede Vorlage mindestens eine Übung hat (36 von 36).

Das Verhalten der App ist unverändert; der Inhalts-Snapshot aus Phase 0 und die 52 Browser-Tests blieben grün.

Ein Versehen, das auffiel und behoben ist: Beim Anlegen des Gleichheitstests habe ich zunächst eine **bestehende** Testdatei gleichen Namens (`tests/rechenVorlagen.test.ts`, 556 Zeilen)
überschrieben. Sofort aus Git wiederhergestellt (die Datei ist unverändert), mein Test heißt jetzt `rechenVorlagenGleichheit.test.ts`. Alle Testdateien, die auf dem Branch neu
angelegt wurden, sind per `git diff --name-status main HEAD` als „neu“ geprüft; die einzigen Löschungen in bestehenden Tests sind die in Phase 2 dokumentierten.

Befehle: `npm run import-report` (Hinweise 0), `npm test` (98 Dateien, 1786 Tests), `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test:e2e` (52 Tests): alle grün.

## Phase 9 – Dokumentation (vor Phase 6 gezogen)

Status: erledigt (20.11.2026), von Hand umgesetzt.

- **`DOKUMENTATION.md` (1241 Zeilen) ist jetzt ein Inhaltsverzeichnis**, der Inhalt liegt in acht Dateien unter `docs/` (`01-ueberblick` bis `08-qualitaet-und-regeln`).
  Der Schnitt ist **verlustfrei** (geprüft: alle 1106 Zeilen ohne Leerzeilen und Trenner sind vorher und nachher gleich). Die **Abschnittsnummern bleiben** (`§ 3.1`, `§ 4.4`, `§ 6` …),
  weil Code-Kommentare, `content/AP2_Rechen_Uebungen.json` und `domain/types.ts` darauf verweisen; das Inhaltsverzeichnis ordnet jede Nummer ihrer Datei zu. Diese Verweise habe ich
  nicht angefasst (die Inhaltsdatei hätte sonst den Inhalts-Snapshot aus Phase 0 geändert); im Skill `inhalte-schreiben` zeigen sie jetzt direkt auf `docs/03-inhalte.md`.
- **Inhaltlich erneuert** (nur, was durch die Umbauten falsch geworden war):
  - `02-architektur`: neue Ordner (`pages/uebersicht|karten|rechenuebung|klausur`, `components/diagramm|tabellen`, `styles/`, `e2e/`), neue Dateien (Speicher, `diagrammPlatz`,
    `domain/inhaltsdateien`), 36 statt 28 Vorlagen, neuer Abschnitt **§ 3.2 Styles** (bindende Importreihenfolge, drei Gestaltungsschichten, Pixelvergleich).
  - `06-lernstand`: `PROGRESS_VERSION` 10 (stand noch auf 9), das entfernte `revision`-Feld, `checkProgressPut`/409/PUT ersetzt durch `berechneSpeicherstand`, neuer Absatz
    **Wo der Lernstand liegt** (IndexedDB, Umzug, Rückfall, mehrere Tabs).
  - `08-qualitaet-und-regeln`: `npm run test:e2e`, Browser-, Pixel- und Gleichheitstests, drei neue Regeln (Stile, neue Inhaltsarten/Vorlagen, Speicher; darunter „vor dem Anlegen einer
    Testdatei prüfen, ob der Name frei ist“).
  - `01-ueberblick`: Stil-Aufbau, Speicher, CI-Kette mit Browser-Tests; `03`/`05`: CSS-Pfade.
- **README:** Zahlen an den Importbericht angeglichen (Begriffsseiten 1.119 statt 1.011, Begriffskarten 919 statt 816, Rechenübungen 122 statt 109, Diagramm-Übungen 32 statt 30), Hinweis
  auf den Umzug nach IndexedDB, Prüfbefehle samt `npm run test:e2e`, Ordner `e2e/` und `docs/`. `CONTRIBUTING.md`: `npm run test:e2e` und der Pixelvergleich.
- Alle relativen Links in den 15 Dokumenten zeigen auf vorhandene Dateien (Skript).
- Bewusst nicht gemacht: die englischen Verlaufstexte der Features (`04`, `05`) wurden nicht umgeschrieben, nur wo sie falsche Pfade oder Mechanismen nannten.
  Eine inhaltliche Gesamtdurchsicht aller Feature-Abschnitte gegen den heutigen Code steht noch aus.

Befehle: `npm test` (98 Dateien, 1786 Tests), `npm run lint`, `npm run format:check`: grün (keine Code-Änderung in dieser Phase).

## Phase 8 – Erster Start schneller, Offline unverändert

Status: erledigt (20.11.2026), von Hand umgesetzt. **Abweichung vom Plan, bewusst und gemessen:** Der Vorabspeicher wird **nicht** aufgeteilt, sondern nur sein **Zeitpunkt** geändert.

Messung (neu: `tools/messung/drossel-server.js` und `start-messung.js`; gedrosselter Server mit 200 KB/s ≈ 1,6 Mbit/s, 150 ms Latenz, gzip; Handy-Fenster, CPU ×4; frisches Profil; Median von 3 Läufen):
- Der **Start selbst** ist nie betroffen: LCP 1,8 s mit und ohne Service Worker (die Registrierung geschah schon nach `load`).
- Eine **Navigation kurz nach dem Start** ist betroffen: Klick nach 1,5 s → **4,2 s statt 2,1 s**, weil der Vorabspeicher (155 Dateien, 3,1 MB gzip) gleichzeitig lädt.
- Workbox 7.4.1 installiert den Vorabspeicher **schon jetzt eine Datei nach der anderen**; weniger Parallelität ist nicht möglich. Übrig bleibt der Zeitpunkt.

Änderung (`src/lib/pwa.ts`, `wartebisRuhig`): Beim **allerersten Besuch** (noch keine Registrierung) wartet die Registrierung, bis 4 s lang nichts navigiert, angetippt oder getippt wurde (höchstens 60 s). Wer die App schon hatte,
registriert sofort. Ergebnis (Navigation nach Klick): nach 1,5 s **4.209 → 2.112 ms** (gleich wie ganz ohne Service Worker), nach 4 s 1.884 → 1.474 ms, nach 8 s 1.475 → 1.761 ms (die Last wandert nur nach hinten, +0,3 s). Der
Vorabspeicher ist dafür ca. 4 s später komplett (42 → 46 s auf diesem Netz).

Warum keine Aufteilung des Vorabspeichers: Sie hätte einen selbst geschriebenen Service Worker verlangt (eigene Caches, eigene Abruflogik) und die Gefahr gemischter Versionen offline (`content.json` neu, `details.json` alt → die App wirft „Seite neu laden“).
Ein kaputter Service Worker trifft jeden Nutzer; der Gewinn wäre auf das erste Weiterklicken im ersten Besuch auf langsamem Netz begrenzt. Die Änderung am Zeitpunkt bringt den größten Teil davon mit wenigen Zeilen.

Tests: `tests/pwaRegistrierung.test.ts` (4 Tests: Ruhezeit, Neustart bei jeder Bedienung, Höchstzeit, Zuhörer werden abgemeldet) und **`e2e/offline.spec.ts`** (die Bedingung des Plans): erster Besuch → warten, bis der Vorabspeicher voll ist (≥ 150 Dateien) →
offline gehen → neu laden → Lernblatt, Karteikarten, Begriffsseite, Formelsammlung (KaTeX-Schriften), SQL-Abfrage (WASM), Rechenübung, Diagramm-Übung und Klausur öffnen. Eine Gegenprobe im Test beweist, dass „offline“ wirklich offline ist; entfernt man das Warten auf den Vorabspeicher,
scheitert der Test (geprüft).

Befehle: `npm run import-report` (Hinweise 0), `npm test` (99 Dateien, 1790 Tests), `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test:e2e` (53 Tests): alle grün.

## Phase 10 – Post-its am Buchrand und Beiblatt „Diagrammelemente“

Status: erledigt (20.11.2026), von Hand umgesetzt. **Neue Funktion** (einzige im Plan); Auftrag des Besitzers, Klarstellung am 20.11.: Die Post-its gelten **für Übungen und Klausuren**, das Glossar bleibt, wie es ist; „Diagrammbeschreibungen“ meint das
**Beiblatt der IHK-Prüfung**, auf dem die verwendeten Diagrammelemente beschrieben sind. Das ändert den Plan an zwei Stellen: (1) Die Zettel stehen nur dort, wo der Anhang schon angeboten wurde (Einzelaufgabe, Übungsklausur, Rechenübung, SQL-Editor/-Übung,
Diagramm-Übung), nicht „auf allen Seiten“; damit entfällt die Frage nach dem Platz neben dem Glossarregister. (2) Das Beiblatt ist **neuer Inhalt**, nicht die Diagrammseite aus Deep Dive 17.

- **Zettel (Desktop ab 1100 px, `src/styles/postits.css`, in `index.css` zuletzt):** Die vorhandenen Knöpfe des `AnhangPanel` werden per CSS zu farbigen Zetteln (gelb, grün, rosa, blau – dieselben Farben wie im Glossar) mit senkrechter Schrift, die rechts aus der Buchkante
  ragen; der offene Zettel steht weiter heraus. Ein Klick öffnet das Blatt **links neben** den Zetteln (verdeckt sie nicht) und lässt es aufploppen (0,18 s; ohne Animation bei `prefers-reduced-motion`). Es sind **dieselben Knöpfe** wie auf dem Handy (kein zweiter Code-Pfad:
  `aria-expanded`, Tastatur, Esc, Fokus zurück, Taste `A`, die jetzt im Tooltip steht). Unter 1100 px bleibt die Knopfleiste im Text, wie sie war (der Pixelvergleich der Handy-Seiten bestätigt das). Das Blatt ist **nicht modal**: In der Klausur bleibt das Antwortfeld bedienbar.
  Die frühere klebende Leiste unter der Kopfzeile entfällt auf dem Desktop (die Zettel sind immer erreichbar).
- **Beiblatt „Diagrammelemente“** (`src/lib/diagrammBeiblatt.ts`, `components/DiagrammBeiblatt.tsx`, lazy): je Notation eine Tabelle *Symbol | Element | Bedeutung* samt Verbindungsarten – ER, EPK/eEPK, BPMN 2.0, Anwendungsfall, Aktivität, Sequenz, Zustand, Klasse. Die **Symbole zeichnet die App selbst** (`FormSymbol`), das Blatt zeigt also dieselben
  Formen wie Editor und Übung; die Beschreibungen sind **in eigenen Worten** geschrieben (nicht aus Prüfungen kopiert). Es erscheint, wenn der Aufgabentext eine Notation nennt (`anhangFuer`, `beiblattFuerText`), in einer Klausur die Vereinigung aller Aufgaben, bei einer Diagramm-Übung die Notation ihres Typs.
  Beim Prüfen am Bild korrigiert: Der Editor zeichnet den Kontrollfluss mit gefüllter Pfeilspitze (das Blatt hatte „offen“ angenommen); BPMN heißt das Element „Datenobjekt“, nicht „Informationsobjekt“; die Notiz zeigt „Aa“ wie die Editorleiste.
- **Gefunden und behoben unterwegs:** Der scrollbare Zeichenbereich des Diagramm-Editors (`.ed-scroll`) war per Tastatur nicht erreichbar (axe: `scrollable-region-focusable`, serious) – ein **bestehender** Fehler der Aufgabenseite, den die bisherigen axe-Tests nicht abdeckten. Jetzt `tabIndex`, Rolle und Beschriftung, ohne Änderung am Aussehen.
  Die Aufgabenseiten mit Editor (`/aufgabe/02-B1`, `/aufgabe/05-B1`) und die Diagramm-Übung sind jetzt in der axe-Liste (20 Seiten).
- **Tests:** `tests/diagrammBeiblatt.test.ts` (20: jedes Element der Palette und jede Verbindungsart jedes Editors ist beschrieben, jedes Symbol lässt sich zeichnen, Beschreibungen vollständig, Erkennung an echten Aufgaben, Anzeige), `e2e/postits.spec.ts` (11: Lage am Buchrand, farbig und senkrecht, Öffnen/Schließen/Esc/Fokus, das Blatt verdeckt die Zettel
  nicht, immer nur eins offen, Klausur mit offener Ausgangssituation bleibt bedienbar, Rechenübung und SQL, Diagramm-Übung zeigt nur ihre Notation, axe mit offenem Blatt hell und dunkel, reduzierte Bewegung, Handybreite).
  Ein bestehender Test (`tests/belegsatz.test.ts`) prüfte `anhangFuer` mit `toEqual({ sql, formeln })`; er erwartet jetzt zusätzlich `diagramme: []` – bewusste Erweiterung der Rückgabe, sonst nichts gelockert.
- **Pixelvergleich:** Es änderten sich genau die Seiten mit Zetteln oder neuem Knopf: `/aufgabe/02-B1`, `/diagramme/DG-EPK-001` (Desktop und Handy) und `/heute` (nur Desktop: bettet die SQL-Aufgabe A1 mit ihrem Zettel ein; Handy unverändert). Diese 10 Bilder wurden bewusst erneuert, die übrigen 82 blieben
  unverändert (0 Pixel). Beim Prüfen der Bilder kontrolliert: hell und dunkel, Klausur mit drei Zetteln, Handy mit Knopfleiste.

Befehle: `npm run import-report` (Hinweise 0), `npm test` (100 Dateien, 1810 Tests), `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test:e2e` (70 Tests), Pixelvergleich (92 Bilder, `--workers=2`): alle grün.

Nicht gemacht: Eine Aufklapp-Variante unter 1100 px (kein Platz am Rand), und die Beschreibungen des Beiblatts wurden nicht von einer Lehrkraft fachlich gegengelesen; sie folgen der üblichen Notation. Das sollte der Besitzer einmal lesen.

## Phase 6 – Inhalte strukturiert statt per Regex: Bestandsaufnahme (Umstellung noch nicht begonnen)

Stand: 20.11.2026. Nur gemessen und gelesen, nichts am Inhaltsformat geändert. Grundlage: `domain/parser.ts` (546 Zeilen), alle 33 Lernblätter, 32 Lösungsdateien und das alte SQL-Blatt in `content/` (zusammen 1,5 MB), die App-Funktionen, die Aufgabentexte auswerten.

**1. Das Markdown wird zuverlässig gelesen.** Der Parser liest alle 633 Aufgaben und ihre 633 Musterlösungen ohne einen Importhinweis (`npm run import-report`: Hinweise 0). Das Ergebnis ist durch den Inhalts-Snapshot aus Phase 0 (SHA-256 jeder ausgelieferten Datei) festgehalten.

**2. Die Sonderfälle des Parsers sind fast tot.** Gezählt in den 33 aktuellen Blättern:

| Format | Vorkommen |
|---|---|
| Aufgabe im Standardformat `**A1 (4 P):**` | 615 (und 615 passende Lösungen in den Lösungsdateien) |
| Aufgabe als Listenpunkt `- **W1 (5 P):**` (älteres Format) | 0 |
| Lösungsüberschrift `**C7 – …:**` (älteres Format) | 0 |
| Block als `Teil A –` statt `Block A –` | 0 |
| Titel mit Kalenderwoche `(KW …)` | 0 |
| Musterlösungen im Blatt statt in der Lösungsdatei | 0 |

Alle diese Sonderfälle bedient **eine einzige Datei**: `Deep_Dive_SQL_KW28_29.md` (das „Zusatzmaterial DataFit“, Thema 00, 18 Aufgaben mit Listenform, `Teil`-Blöcken und eingebauten Musterlösungen). Die 18 Aufgaben stehen im Gesamtbestand von 633 (615 + 18).
Der Code dafür ist klein: wenige Regex-Alternativen (`TASK_START`, `SOLUTION_START`, `BLOCK_HEADING`), `stripKw`, die Einrückungsregel in `parseTasks` und der Zweig „Musterlösung im Blatt“ – rund 30 von 546 Zeilen. Das alte Blatt ist lebendig (Begriffsseiten verweisen mit „SQL-Zusatz 1.2“ darauf).

**3. Die eigentliche Regex-Abhängigkeit liegt woanders: Die Bedeutung einer Aufgabe wird zur Laufzeit aus dem Aufgabentext erraten.** Der Parser setzt bei allen 633 Aufgaben `type: 'offen'`. Was eine Aufgabe sonst ist, schließt die App aus der Prosa:
- **Antwort-Editor** (`editorFuer` in `src/lib/editorAufgabe.ts`): 90 von 633 Aufgaben bekommen einen Editor (74 Wertetabellen, je 1–3 EPK, BPMN, ER, Aktivität, Use-Case, Relationen, Normalform, Boxplot, Struktogramm, Koordinatensystem); 543 bleiben Textfeld.
- **Anhang** (`anhangFuer`): SQL bei 48, Formeln bei 78, Diagrammelemente bei 18 Aufgaben – erkannt an Wörtern wie *SQL*, *Berechnen*, *BPMN*.
- **Operator** (`findeOperatoren`): das erste kursive Wort; bei 226 Aufgaben keins.
- Außerdem werten `begriffe.ts`, `suche.ts`, `leicht.ts`, `werteTabelle.ts` und `koordinatenAntwort.ts` Aufgabentexte per Muster aus.
Das ist fragil in einem anderen Sinn als der Parser: Ein Autor, der eine Aufgabe umformuliert („Erstellen Sie“ → „Fertigen Sie an“), verliert unbemerkt den Editor. Abgesichert ist es heute nur durch Tests, die die erkannte Liste festhalten (`tests/editorAufgaben.test.ts`: „detection on `content/` = exact list“).

**4. Warum Markdown für Aufgaben und Lösungen als Quelle richtig ist.** Aufgabentexte und Lösungen sind lang, mehrzeilig und voller Formeln (299 KaTeX-Stellen), Tabellen (10 Punktetabellen), SVG-Diagramme (47) und SQL-Blöcke (27). In JSON müssten sie als Zeichenketten mit `
` und Escapes stehen: schwer zu lesen, schwer zu vergleichen (Diffs), und der ganze Schreib-Ablauf (Skill `inhalte-schreiben`, `CONTRIBUTING.md`) ist auf Markdown ausgelegt.

**Bewertung (Empfehlung):**
- Die im Plan vorgesehene Umstellung **aller Aufgaben und Lösungen auf JSON löst kein gemessenes Problem** (der Parser macht keine Fehler), verschlechtert das Schreiben der Inhalte und hat das größte Risiko aller Phasen (633 Aufgaben, 633 Lösungen). **Nicht empfohlen.**
- Was sich lohnen könnte, ist **klein**: (a) das eine alte SQL-Blatt auf das Standardformat bringen (Listenpunkte → `**W1 (5 P):**`, `Teil` → `Block`, Musterlösungen in eine `_Loesungen.md`) und danach die ~30 Zeilen Sonderfälle löschen; der Nachweis wäre ein Vergleich von Aufgaben, Lösungen und Abschnitten vor und nach (die Inhalts-Hashes ändern sich dabei sichtbar nur für dieses Thema).
  (b) Die erratene Bedeutung der Aufgaben **sichtbar und prüfbar machen**: im Importbericht eine Tabelle „Aufgaben nach erkanntem Antworttyp, Anhang und Operator“ und ein Test, der eine umformulierte Aufgabe nicht stillschweigend ihren Editor verlieren lässt. Das ändert das Format nicht.
- Entscheidung steht beim Besitzer; bis dahin ist Phase 6 **nicht begonnen**.

## Offen: Phase 6 (Entscheidung ausstehend)

Noch nicht begonnen.
