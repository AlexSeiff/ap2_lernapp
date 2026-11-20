# Umbauplan – Architektur aufräumen, ohne die App zu verändern

Stand: 20. November 2026. Ziel: Altlasten aus der Server-Zeit entfernen, den Lernstand robuster speichern, Inhalte und Styles ordnen und
die App mit Browser-Tests absichern. **Für Lernende ändert sich nichts**, außer dass der erste Start schneller wird. Wo ein Schritt den
Lernstand oder die Inhalte berührt, gelten zusätzliche Sicherungen (siehe „Leitplanken“).

## Leitplanken (gelten für jede Phase)

1. **Arbeitsweise.** Ein Branch `umbau`, ein Commit pro Phase (Commit-Texte auf Deutsch wie im Verlauf). **Nicht** nach `main` mergen,
   **nicht** pushen – das entscheidet der Besitzer nach der Durchsicht.
2. **Kein Verhaltenswechsel.** Eine Phase ist erst fertig, wenn `npm run import-report` (0 Hinweise), `npm test`, `npm run typecheck`,
   `npm run lint`, `npm run format:check`, `npm run build` und – ab Phase 1 – `npm run test:e2e` grün sind. Rote Tests werden nicht
   angepasst, damit sie passen: Ändert sich ein Test, muss der Commit-Text sagen, warum das neue Verhalten gewollt ist.
3. **Lernstand ist heilig.** `data/` (echter Lernstand und Sicherungen) und `.env.local` werden weder verändert noch gelöscht noch
   committed. Das Sicherungsformat (`PROGRESS_VERSION`, JSON-Datei zum Herunterladen/Einspielen) bleibt lesbar; alte Sicherungen
   müssen weiter eingespielt werden können.
4. **Inhalte bleiben gleich.** IDs und Aufgabencodes ändern sich nie (an ihnen hängen Lernstand, Klausurverlauf, Fehlerjournal).
5. **Pro Phase zuerst absichern, dann umbauen.** Wo es heißt „Gleichheitstest“, wird der Test gegen den alten Stand geschrieben und
   läuft grün, bevor etwas umgebaut wird.
6. **Sichtbares prüfen.** Bei Änderungen an Darstellung die Skill `app-pruefen` nutzen: Screenshots hell/dunkel, Desktop/Handy.
7. **Stopp-Regel.** Lässt sich ein Gleichheitstest nicht grün bekommen, wird die Phase zurückgesetzt (`git restore`/`reset` auf den
   Phasenanfang) und in `docs/UMBAU_STATUS.md` mit Grund festgehalten. Dann weiter mit der nächsten Phase, die nicht davon abhängt.

## Phase 0 – Sicherheitsnetz (vor allem anderen)

- Gleichheitstest **Lernstand**: Der echte Stand `data/fortschritt.json` (nur lesend, Test überspringt ihn, wenn die Datei fehlt) und
  alle Sicherungen aus `data/backups/` lassen sich laden, migrieren und wieder speichern, ohne dass Versuche, Karten oder Markierungen
  verloren gehen. Das gibt es teilweise schon in `tests/progress.test.ts`; auf alle Sicherungen ausweiten.
- Gleichheitstest **Inhalt**: Ein Snapshot-Test hält `content.json`, `details.json`, `begriffe.json` und alle `texte/*.json` aus dem
  aktuellen `inhaltDateien()` (`build/inhaltPlugin.ts`) als Hash je Datei fest. Spätere Phasen dürfen ihn nur ändern, wenn sich die
  Struktur absichtlich ändert – dann mit begründeter Übersetzung der Hashes.

## Phase 1 – Browser-Tests (Playwright + axe)

- `@playwright/test` und `@axe-core/playwright` als devDependencies, `npm run test:e2e` gegen `vite preview` (Port 4174), mit dem
  installierten Edge/Chromium. Jeder Test startet mit leerem Browserprofil.
- Rauchtests, mindestens: Karte bewerten und Fach prüfen · Übungsklausur abgeben und Ergebnis sehen · Sicherung herunterladen,
  Daten löschen, Sicherung einspielen · SQL-Aufgabe ausführen · Diagramm-Übung prüfen · Suche öffnen (`Strg K`) · Design hell/dunkel ·
  Handybreite.
- axe-Prüfung der Hauptseiten. Bestehende Verstöße werden **nicht** stillschweigend akzeptiert: schwere (serious/critical) beheben,
  leichte in `docs/UMBAU_STATUS.md` auflisten.
- CI: Schritt `npm run test:e2e` in `.github/workflows/pages.yml` nach dem Build ergänzen.

## Phase 2 – Server-Zeit-Schicht entfernen, `shared/` → `domain/`

- Entfernen: Revision/409/`reset`-Logik, `DataSource`, `ApiError`, `SaveProgressRequest`, Konfliktzustand in `progressSaver.ts`
  (betroffene Dateien: `shared/api.ts`, `shared/progress.ts`, `shared/mergeProgress.ts`, `src/lib/api.ts`, `apiError.ts`,
  `progressSaver.ts`, `staticApi.ts`, `store.tsx`, `App.tsx`, `Buch.tsx` und die zugehörigen Tests).
- Mehrere Tabs: Es bleibt der Schutz, dass ein zweiter Tab fremden Fortschritt nicht überschreibt (Storage-Ereignis → neu laden,
  vor dem Speichern aktuellen Stand lesen und zusammenführen). Der Schutz wird kleiner, aber nicht gestrichen.
- Alte Sicherungen mit Feld `revision` bleiben lesbar (Migration `1 → 2` bleibt, das Feld wird beim Einlesen verworfen).
- `shared/` in `domain/` umbenennen (`git mv`, Importe in `src`, `build`, `tools`, `tests`, Konfig), Kommentare mit „Server“ bereinigen.

## Phase 3 – Große Seiten aufteilen

`Dashboard.tsx` (729 Zeilen), `Karteikarten.tsx` (724), `DiagrammEditor.tsx` (891), `RechenUebung.tsx` (562), danach `DiagrammSvg.tsx`,
`TabellenEditor.tsx`, `Klausur.tsx` (> 400). Muster wie bei den vorhandenen `use*`-Hooks: Daten- und Ablauflogik in einen Hook oder in
`src/lib/`, die Seite nur noch Darstellung; Teilbereiche der Seite als eigene Komponenten. Kein Umbau der Logik, kein neues Verhalten.
Für jede Seite zuerst die vorhandenen Tests und Rauchtests laufen lassen, nach dem Umbau erneut.

## Phase 4 – CSS vereinheitlichen

- Ist-Stand: `styles.css` (1556 Zeilen), `apple.css`, `paper.css`, `notizbuch.css`, importiert in `src/main.tsx`.
- Zuerst Screenshot-Basislinie (Skill `app-pruefen`: alle Hauptseiten, hell/dunkel, Desktop/Handy) in einem Ordner außerhalb des
  Repos ablegen.
- Dann: Design-Tokens (Farben, Abstände, Radien, Schatten) an einer Stelle; je Funktionsbereich eine Datei (z. B. `karten.css`,
  `klausur.css`, `editoren.css`); tote Regeln (nicht mehr verwendete Selektoren aus `apple.css`/`paper.css`) entfernen, aber nur, wenn
  ein Suchlauf über `src/` und die Screenshots keinen Unterschied zeigen.
- Danach Screenshots erneut aufnehmen und paarweise vergleichen; Abweichungen im Commit-Text nennen oder beheben.
- Nicht ändern: das Notizbuch-Erscheinungsbild.

## Phase 5 – Lernstand nach IndexedDB (riskant, nach Phase 0–4)

- Gate: Phase-0-Gleichheitstest für alle Sicherungen grün, Rauchtest „Sicherung einspielen“ grün.
- Ein Speicher-Modul mit einer Schnittstelle (`laden`, `speichern`, `beiÄnderung`). Intern: IndexedDB mit je einem Datensatz pro Versuch,
  Karte, Markierung, Einstellung usw. Der Datei-Export/-Import und die Tagessicherungen (`browserBackups.ts`) behalten das heutige
  JSON-Format (`PROGRESS_VERSION` unverändert, solange sich das Dateiformat nicht ändert).
- **Verlustfreie Übernahme:** Beim ersten Start liest die neue Version den alten `localStorage`-Eintrag `ap2-fortschritt`, schreibt ihn
  nach IndexedDB, **prüft, dass beide Stände gleich sind**, und lässt den alten Eintrag danach noch als Rückfall stehen
  (Löschung frühestens in einer späteren Version). Schlägt die Prüfung fehl, bleibt `localStorage` die Quelle und die App zeigt einen
  Hinweis statt Daten zu verlieren.
- Tests: Migration aus allen Sicherungen aus Phase 0; Absturz mittendrin (halb geschriebener Stand); zwei Tabs; IndexedDB nicht
  verfügbar (privates Fenster) → App läuft wie bisher mit `localStorage`.
- `mergeProgress.ts` auf die neue Datensatzform anpassen und vereinfachen, aber das Ergebnis des Zusammenführens muss für alle
  bisherigen Testfälle identisch bleiben.

## Phase 6 – Inhalte strukturiert statt per Regex (riskant)

- Gate: Phase-0-Inhalts-Snapshot grün.
- Zuerst eine Bestandsaufnahme in `docs/UMBAU_STATUS.md`: welche Lernblatt-Formate akzeptiert `shared/parser.ts` heute (inkl. „älteres
  Format“), und wo hängt Logik an Regex-Details.
- Schema (Zod) für Klausuraufgaben, Lösungen und Prüferfragen als JSON definieren; ein **Konverter** erzeugt aus den vorhandenen
  Markdown-Dateien die JSON-Dateien. Der Konverter läuft einmal; Ergebnis wird committet, danach liest die App/Build die JSON-Quelle.
- Markdown bleibt für Fließtext der Lernblätter. Der Parser darf nur auf dem Teil verschlankt werden, der nach der Umstellung
  nicht mehr gebraucht wird.
- Gleichheit: `inhaltDateien()` liefert nach der Umstellung für jede Datei **denselben Inhalt wie vorher** (Hash-Vergleich Phase 0).
  Eine bewusste Abweichung (z. B. Reihenfolge von Feldern) wird im Test einzeln als erwartet eingetragen.
- `CONTRIBUTING.md`, die Skill `inhalte-schreiben` (`SKILL.md`, `references/formate.md`, `scripts/karten.mjs`) und `import-report`
  an das neue Format anpassen.

## Phase 7 – Rechenvorlagen und JSON-Übungen gleich registrieren

- Die Vorlagen in `src/rechnen/vorlagen/*` bleiben Code (sie erzeugen Zahlen). Ziel: dieselbe Registrierung und dieselben Prüfungen im
  Importbericht wie bei den JSON-Übungen (Pflichtfelder, IDs, Verweise aus Begriffsseiten), eine Stelle für „neue Übung hinzufügen“.
- Gleichheitstest: Für feste Zufallswerte (Seed) liefert jede Vorlage dieselbe Aufgabe, Lösung und dieselben typischen Fehler wie vorher.

## Phase 8 – Erster Start schneller, Offline unverändert

- Der Offline-Vorabspeicher (heute 154 Einträge, 8,4 MB) wird aufgeteilt: Das Nötige für den Start sofort, der Rest (Begriffsseiten,
  SQL-Engine, selten genutzte Seiten) nach dem ersten Laden im Hintergrund per Service Worker nachgeladen.
- **Muss bleiben:** Nach dem ersten vollständigen Laden funktioniert alles offline, auch SQL und Formeln (so steht es in der README).
  Rauchtest: online laden, warten bis Vorabspeicher fertig, offline gehen, alle Hauptseiten und eine SQL-Aufgabe öffnen.
- Update-Hinweis („Neu laden“) und `pwaPlugin.ts` bleiben funktionsgleich.

## Phase 9 – Dokumentation

- `DOKUMENTATION.md` (145 KB) in kleinere Themen-Dateien unter `docs/` aufteilen (Architektur, Lernstand/Speicherung, Inhalte,
  Übungen, Darstellung, Tests), Verweise in `README.md` und `CONTRIBUTING.md` nachziehen.
- `README.md`: Abschnitte zu Speicherung (IndexedDB), Tests (`test:e2e`) und Inhaltsformat aktualisieren.

## Abschluss

`docs/UMBAU_STATUS.md` führen: pro Phase erledigt / zurückgesetzt, ausgeführte Befehle mit Ergebnis, offene Punkte (z. B. leichte
axe-Verstöße), bewusste Abweichungen. Danach prüft der Besitzer den Branch `umbau`, bevor er nach `main` kommt.
