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

## Phasen 3 bis 9

Noch nicht begonnen.
