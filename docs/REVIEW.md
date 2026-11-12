# Review des Branches `audit-optimierung` · 11. November 2026

Geprüft: `74c1dd5` (15 Commits) gegen `main` = `ed22076`. Windows 11, Node 24.21.0, npm 11.19.0.
Alle Befehle liefen in Wegwerf-Kopien (`git worktree`, detached) außerhalb des Projektordners. Der Experimentier-Branch `review-wegwerf` ist gelöscht, die Kopien sind entfernt. Am Branch wurde nichts geändert; neu ist nur diese Datei (nicht committet).

## Nachtrag: Korrekturen vom 11. November 2026

Auf Anweisung des Auftraggebers nach dem Review umgesetzt, je ein Commit auf `audit-optimierung`. Die Abschnitte 1 bis 6 beschreiben den Stand `74c1dd5` davor.

| Befund | Commit | Änderung | Prüfung |
|---|---|---|---|
| B2 | `0f639f1` | Leerzeile nach der Liste in `Begriffsseiten_L.md` (2×), `Begriffsseiten_M.md`, `Begriffsseiten_R.md` | Pages-Build im Browser: auf `lagemass`, `lift`, `mtbf`, `regressionsgerade` steht der Folgesatz wieder als eigener Absatz |
| B3 | `0ff8b14` | Semikolon statt Komma an den sieben genannten Stellen. Zusätzlich die Antwort der Karte ML-031 (`AP2_FIDPA_Lernkarten.json:2598`), die dieselbe Merkwert-Reihe schon auf `main` mit Kommas enthielt, damit Antwort und Rechenweg gleich aussehen | Kartenprüfer: „OK: 734 Karten in 28 Decks“ |
| B5 | `aabd58c` | Link auf den lokalen Nachweisordner aus `CHANGELOG-AGENT.md` entfernt | `grep -c "Users/"` in Changelog und Audit: 0 |
| H1 | `bc8245d` | Escape-Zweig in `src/components/SucheDialog.tsx` wiederhergestellt | Edge headless: mit Text im Feld schließt das erste Escape |

Gesamtlauf nach den vier Commits: `npm run import-report` → Hinweise (0); `npm test` → 90 Dateien / 1.331 Tests grün; Typecheck, Lint, `npm run build`, `npm run build:pages` (139 Einträge / 7.321,13 KiB) jeweils Exit 0.

Weiterhin offen: B4 (Build-Abbruch bei Importhinweisen), H4 (Formatcheck), H5 (README-Verweis), H6 (Sicherung aus neuerer Version), erster CI-Lauf auf GitHub.

Hinweis zur Methode: Bei der Nachprüfung liefen verwaiste Test-Browser aus früheren Läufen weiter und lieferten zunächst einen alten Stand aus dem Service-Worker-Cache. Nach dem Beenden dieser Prozesse war das Ergebnis eindeutig. Die Befunde des Reviews sind davon nicht betroffen; der ursprüngliche H1-Test lief im ersten, frischen Profil.

## Nachtrag: Umbau auf dem Branch `nur-online` (12. November 2026)

Auf Anweisung des Auftraggebers nach dem Review umgesetzt, auf einem eigenen Branch ab `audit-optimierung`. Damit erledigt:

- **B4:** `npm run build` bricht bei Importhinweisen ab (`build/inhaltPlugin.ts`).
- **H4:** Bestand formatiert, `npm run format:check` ist grün und läuft in der CI.
- **H6:** Eine Sicherung aus einer neueren App-Version wird mit Meldung abgelehnt (`src/lib/backup.ts`).
- **H8:** Node-Version in der CI auf 24 festgelegt.
- **H5** entfällt: Die dort genannten Werkzeuge (`mc-entwurf`, `sync-content`) gibt es nicht mehr.

Die lokale Betriebsart mit Server und KI ist entfernt; die Abschnitte unten nennen deshalb teils Dateien (`server/…`) und Befehle (`build:pages`), die es auf `nur-online` nicht mehr gibt.

## 1. Gesamturteil

**Freigeben nach Korrekturen.**
Die technischen Änderungen sind sauber, getestet und von mir reproduziert: beide Builds, 1.331 Tests, Lint, Offline-Betrieb, Update-Ablauf und Sicherungs-Roundtrip funktionieren, Secrets wurden nicht gefunden.
Die Trennzeichen-Änderungen an 93 Zeilen in 33 Inhaltsdateien sind vom Auftraggeber nachträglich bestätigt, haben aber vier Darstellungsfehler und mehrere missverständliche Zahlenreihen erzeugt; diese müssen vor dem Merge korrigiert werden.

## 2. Befunde

### Kritisch

Keine.

### Wichtig

**B1 · Inhaltsdateien entgegen dem Auftrag geändert** — Commit `b56dbc6` (33 Dateien) und `content/DeepDive_03_Statistik_I.md` in `5606d45`.
- Beleg: `git diff main...audit-optimierung --numstat -- content` → 33 Dateien, +122/−93 Zeilen. Betroffen sind Aufgabentexte (`DeepDive_14_WiSo_II.md:509`, `AP2_Rechen_Uebungen.json:1413,1554`), Musterlösungen (DD03, 04, 07, 12, 21, 24 `_Loesungen.md`), sechs SQL-Erklärungen und zehn Kartenfelder. Vollständige Liste in Abschnitt 4.
- Eigene Gegenprobe: Vergleich beider Stände nach Entfernen von `· , ; . -` und Leerraum, ohne Groß-/Kleinschreibung → alle 33 Dateien identisch. Es wurden also nur Trenner, Listenzeichen und drei Wortanfänge (`zweiter`→`Zweiter`, `dritter`→`Dritter`, `kumulierte`→`Kumulierte`) geändert. Punkte, Zahlen, IDs unverändert.
- `AUDIT.md` begründet das mit einem „Nachtrag des Nutzers“ (W09). Dieser Nachtrag ist im Repository nicht belegt.
- **Entscheidung des Auftraggebers (11.11.2026, im Chat):** Der Nachtrag stammt von ihm, die Inhaltsänderungen bleiben. B1 ist damit kein Verstoß mehr, sondern eine nachträglich bestätigte Auftragserweiterung. Offen bleiben die Folgefehler B2 und B3.

**B2 · Vier Darstellungsfehler durch die neuen Listen** — `content/Begriffsseiten_L.md:41–43` und `:605–607`, `Begriffsseiten_M.md:1430–1432`, `Begriffsseiten_R.md:549–550`.
- Nach der neuen Aufzählung folgt ohne Leerzeile ein Satz. Markdown hängt ihn an den letzten Listenpunkt.
- Beleg (Pages-Build im Browser, `#/glossar/lagemass`): letzter Listenpunkt lautet „Modus = 5 Tage. Mittel > Median: Der Ausreißer 19 zieht nach oben …“. Ebenso `#/glossar/mtbf` (Verfügbarkeitsformel im Punkt „MTTR“) und `#/glossar/lift` (Deutungssatz im Punkt „Lift“). `Begriffsseiten_R.md:549` hat dasselbe Muster, dort habe ich die Seite nicht gerendert.
- Vorschlag: nach jeder der vier Listen eine Leerzeile einfügen (wie Codex es in `DeepDive_03_Statistik_I.md:201` selbst nachgezogen hat).

**B3 · Kommas als Trenner zwischen Dezimalzahlen sind missverständlich**
- `AP2_FIDPA_Lernkarten.json:2605`: „1 : 1 → 1, 1 : 2 → 0,918, 1 : 3 → 0,811 …“; ebenso `Begriffsseiten_E.md:641`.
- `Begriffsseiten_A.md:64` („4,80, 4,95, 5,10 Mio. €“, „0,10, 0,25, 0,40“), `Begriffsseiten_K.md:1284`, `Begriffsseiten_Z.md:124`.
- `Begriffsseiten_R.md:1317` und `AP2_FIDPA_Lernkarten.json:4856`: Komma trennt jetzt sowohl die Vorgänge als auch deren Werte („D: SEZ 8, SAZ 7, B: SEZ 7, SAZ 3 …“).
- Uneinheitlich: dieselbe Umsatzreihe steht in `Begriffsseiten_S.md:72` und `DeepDive_11_Visualisierung_Algorithmen.md:64` mit Semikolon.
- Vorschlag: an diesen sieben Stellen Semikolon verwenden.

**B4 · Der Build stoppt bei kaputten Inhalten nicht, nur die Tests**
- Beleg (Wegwerf-Branch, je ein Fehler eingebaut, dann `npm test`, `npm run build:pages`, `npm run import-report`):

| Eingebauter Fehler | `npm test` | `npm run build:pages` | Importbericht |
|---|---|---|---|
| Karte ohne `antwort` | rot (3 Tests) | **Exit 0** | 2 Hinweise |
| doppelte Karten-ID | rot (3) | **Exit 0** | 2 Hinweise |
| doppelte SQL-Übungs-ID | rot (5) | **Exit 0** | 1 Hinweis |
| toter Verweis `aufgaben`/`karten` in SQL-Übung | rot (3) | **Exit 0** | 2 Hinweise |
| Rechenübung ohne `aufgabe` | rot (8) | **Exit 0** | 1 Hinweis |
| falsches SQL in angezeigter Musterlösung (DD01 B1) | rot (1, neuer W04-Test) | Exit 0 | 0 Hinweise |

- In der CI ist das abgesichert, weil `npm test` vor `build:pages` läuft. Wer lokal nur baut und `dist/` anderswo veröffentlicht, liefert den Fehler aus; die App zeigt ihn dann unter „Daten & Import“ als „Hinweise (2)“ (so in meinem Probe-Build gesehen).
- Der Auftragspunkt „Schema und Validierung“ ist nur für Lernkarten umgesetzt (`shared/lernkarten.ts`, Zod). Ein Schema für die Markdown-Lernblätter gibt es nicht; dort prüfen Parser und Smoke-Tests.
- Vorschlag: in `server/pagesPlugin.ts` den Pages-Build abbrechen, wenn `content.issues.length > 0`.

**B5 · Lokaler Pfad mit Benutzernamen im Changelog** — `CHANGELOG-AGENT.md:78`.
- Der Link zeigt auf `C:/Users/<name>/.codex/…/browser-nachweise`. Die Nachweise liegen nicht im Repository und sind für andere nicht prüfbar; der Pfad würde mit dem Merge öffentlich.
- Vorschlag: Link entfernen, Aufnahmen bei Bedarf in den Pull Request hängen.

### Hinweis

**H1 · Escape im Suchfeld braucht jetzt zwei Tastendrücke, wenn Text im Feld steht** — `src/components/SucheDialog.tsx` (`c4258b3`).
- Der frühere `Escape`-Zweig in `onKeyDown` wurde entfernt. Das Feld ist `type="search"`; der Browser leert es beim ersten Escape, erst das zweite schließt.
- Beleg (Edge headless per CDP, Pages-Build): „offen nach 1. Escape (Text im Feld): true, Feldwert leer“, „offen nach 2. Escape: false“, bei leerem Feld schließt das erste Escape. Auf `main` schloss Escape sofort.
- Die übrigen W05-Aussagen stimmen: modaler `<dialog>`, Fokus bleibt im Dialog (Tab springt zwischen Feld und „Suche schließen“), Escape am Schließen-Knopf schließt, Fokus kehrt zur Lupe zurück, Fokusrahmen sichtbar.
- Vorschlag: `else if (e.key === 'Escape') { e.preventDefault(); onClose(); }` wieder aufnehmen.

**H2 · Arbeiten außerhalb der erlaubten Liste**
- W01 (`9690b0d`, Herkunftsprüfung der lokalen API), W02 (`e496c20`, SVG-Filter) und W07 (`827bee2`, 117 Importpfade in 38 Dateien, `allowImportingTsExtensions`) stehen nicht in der Liste der erlaubten Arbeiten. Sie sind klein, getestet und ohne Framework-Wechsel; `827bee2` enthält außer Importpfaden nur die `HttpError`-Umstellung und die tsconfig-Zeile (per Diff-Filter geprüft).
- Aus der erlaubten Liste wurde nicht geliefert: Lazy Loading, Service-Worker-Fix, Export/Import, Entfernen toter Dateien, Dependency-Updates. Für Service Worker und Export/Import ist das begründet und von mir bestätigt (funktionieren bereits). Für Lazy Loading nennt das Audit nur Bundle-Größen, keine Entscheidung.
- Keine neuen Frameworks, kein Backend/Proxy, keine `.env*`-Änderung, keine gelöschten Dateien, `package-lock.json` unverändert, `main` unberührt.

**H3 · Commit-Historie nachträglich umgeschrieben**
- Beleg: `git log --format='%h AD=%ad CD=%cd'` → Autorendatum 10.11. 19:17–19:49, Commit-Datum ab `b56dbc6` 11.11. 17:56.
- Die im Changelog je Commit genannten Testzahlen (1.326, 1.329, 1.330 …) gehören zu früheren Fassungen der Commits und sind am heutigen Stand nicht einzeln nachvollziehbar. `5606d45` (W14) enthält zusätzlich `content/DeepDive_03_Statistik_I.md` und `AUDIT.md`. Sonst gilt: 13 umgesetzte Funde, 13 Commits, plus zwei Dokumentations-Commits; jeder Changelog-Eintrag hat eine Änderung und umgekehrt.

**H4 · `npm run format:check` ist rot, steht aber in `CONTRIBUTING.md` als lokale Prüfung**
- Beleg: frischer Checkout → 5 Dateien (`.claude/skills/…/screenshot.mjs`, `…/karten.mjs`, `src/lib/mischKlausur.ts`, `tests/markiert.test.ts`, `tests/progress.test.ts`), auf `main` dieselben 5. Im Arbeitsordner 10 Meldungen. Der Changelog nennt „dieselben 10 Dateien“; das gilt nur für den Arbeitsordner. Die Ursache der Differenz habe ich nicht geklärt.
- Vorschlag: Bestand einmal formatieren oder den Befehl in `CONTRIBUTING.md` als „bekannt rot“ kennzeichnen. In der CI läuft er nicht.

**H5 · README um rund 200 Zeilen gekürzt** — `fa40c3e`.
- Entfallen: „KI-Funktionen einschalten“, „Auswahlantworten mit KI vorschlagen“ (`mc-entwurf`, `mc-uebernehmen`), „Lernblätter ändern / neu importieren“ (`sync-content`), „Daten“, „Entwicklung“. `npm run dev` und `npm start` werden nicht mehr genannt (stattdessen `npx vite`). `DOKUMENTATION.md` erwähnt diese Befehle weiterhin (14 Treffer) und ist verlinkt.
- Vorschlag: im README eine Zeile mit Verweis auf diese Werkzeuge in `DOKUMENTATION.md` ergänzen.

**H6 · Sicherung aus einer neueren App-Version wird ohne Warnung angenommen** (Bestand, nicht von Codex)
- Beleg: Datei mit `version: 99` und unbekanntem Feld eingespielt → gespeichert als Version 9, unbekanntes Feld bleibt erhalten, keine Meldung.
- Vorschlag: `parseBackup` soll `version > PROGRESS_VERSION` mit Hinweis ablehnen.

**H7 · Karten ohne Antwort werden jetzt übersprungen** — `shared/lernkarten.ts` (`788edba`).
- Vorher wurde eine solche Karte mit „Keine Musterantwort im Lernblatt“ angezeigt. Aktuell betrifft das keine Karte (Importbericht 0 Hinweise). Nur als Verhaltensänderung festhalten.

**H8 · CI-Workflow** — `.github/workflows/pages.yml`.
- Reihenfolge `npm ci` → `npm test` → `npm run lint` → `npm run build:pages` (enthält `tsc -b`). `deploy` hat `needs: build` und läuft nur bei `main` und nicht bei Pull Requests. Ein roter Test verhindert das Deployment. Schreibrechte (`pages`, `id-token`) liegen nur noch am Deploy-Job, Pull Requests laufen mit `contents: read`.
- Offen: `node-version: lts/*` ist nicht auf die getestete Version 24 festgelegt; `import-report` und `format:check` laufen nicht. Ein echter Lauf auf GitHub steht aus.

**H9 · Fachliche Vorschläge aus dem Audit**
- W10 stütze ich: `content/DeepDive_05_Prozessanalyse.md:342` und Karte `PRZ-066` sagen beim Intermediate-Timer „nichts anderes läuft“. Das gilt nur für den wartenden Pfad. Die Tabelle zu unterbrechenden und nicht unterbrechenden Boundary Events (DD05:346–352) ist korrekt.
- Quartil: Die App liefert nach der im Lernblatt genannten Konvention den Wert an der Position (RE-ST1-009: Position 8 → Wert 6), nicht die Position.

## 3. Verifikationstabelle

| Aussage im Changelog / Audit | Reproduziert | Beleg |
|---|---|---|
| `npm ci` läuft, 600 Pakete, esbuild-Skript freigegeben | ja | Branch: `added 600 packages`, keine `install-scripts`-Warnung. `main`: Warnung zu `esbuild@0.28.2`. Dauer 56 s kalt, 12 s warm (Codex: 14,8 s) |
| `npm run build` grün | ja | Exit 0; Einstieg `index-*.js` 287,17 kB / gzip 90,92 (`main`: 287,12 / 90,91) |
| `npm run build:pages` grün | ja | Exit 0; Einstieg 289,62 / 91,73; SqlEditor 375,06 / 122,78; KaTeX 259,11 / 77,70; `content.json` 1.956.985 Byte; `begriffe.json` 1.566.328 Byte; WASM 688.197 Byte |
| Workbox 139 Einträge / 7.321,08 KiB (`main`: 7.320,71) | ja | Build-Ausgabe beider Stände |
| 90 Dateien / 1.331 Tests grün (`main`: 1.325) | ja | Branch 1331 passed, 20,9 s; `main` 1325 passed, 21,1 s |
| Typecheck und Lint grün | ja | Exit 0 |
| `format:check` rot, „dieselben 10 Dateien“ | teilweise | frischer Checkout: 5 Dateien, siehe H4 |
| `import-report`: 0 Hinweise | ja | „Hinweise (0)“ |
| `vite build --configLoader native`, auch `--mode pages` | ja | beide Exit 0 |
| Gegenprobe W01 (Router) | ja | Prüfung abgeschaltet → 1 Test rot |
| Gegenprobe W02 (SVG) | teilweise | Paint-Prüfung abgeschaltet → 2 Tests rot (Codex: 3; der Marker-Fall hat eine eigene Prüfzeile) |
| Gegenprobe W03 (Karten) | ja | `antwort` optional gemacht → 1 Test rot |
| Gegenprobe W04 (SQL-Lösungen) | ja, stärker | echtes SQL im Lernblatt verfälscht → genau `01-B1` rot |
| Gegenprobe W06 (Migration) | ja | ungültige Version startet bei aktueller Version → 1 Test rot |
| W01 wirkt am laufenden Server | ja | `POST /api/ai/grade` mit fremdem Origin → 403; gleicher Origin → 400 (Schemafehler); `127.0.0.1` gegen Host `localhost` → 403 |
| Pages unter `/ap2_lernapp/`: 139 Cache-Einträge im Scope, 3 Icons 200 | ja | Edge headless: `entries 139, outside 0`, Scope `…/ap2_lernapp/`, Icons `[200,200,200]` |
| Offline-Neuladen, anderes Lernblatt, SQL-Seite | ja | Server getrennt: Startseite, `#/lernen/03` (21.408 Zeichen), `#/sql` mit Editor geladen; `content.json`/`begriffe.json` 200 aus dem Cache |
| Update: alter Stand bis „Neu laden“, danach neu, Daten bleiben | ja | vor Klick: Hinweis „Neue Version verfügbar – neu laden?“, alter Text; nach Klick: neuer Text, `localStorage`-Marker erhalten |
| SQL-Aufgaben laufen, Fortschritt wird gespeichert | ja | SQL-MH-008 im Browser gelöst: „Richtig! 3 Zeilen“, `ap2-fortschritt` Version 9 mit `SQL-MH-008` |
| Sicherung exportieren, löschen, einspielen | ja | nach „Alles löschen“ leer, nach Einspielen identisch zum Export; defektes JSON und fremde Datei → Fehlermeldung, Stand unverändert; Version −10²⁰ → kein Einfrieren, Version 9 |
| Altsicherung V8 → V9 | teilweise | nur über die Tests mit V8-Fixture, nicht über die Oberfläche |
| Rechenwerte RE-ST1-009, RE-ST2-002, RE-MG-001 | ja | selbst gerechnet und mit App-Sollwerten verglichen; zusätzlich RE-ST1-004, RE-PA-003, RE-PM-001, RE-WI-001, RE-QS-001 – alle acht stimmen |
| SQL-Musterlösungen ergeben die genannten Ergebnisse | ja (Stichprobe 10 von 73) | SQL-MH-001, -008, -015, -022, -032, SQL-DF-001, -007, -018, SQL-DQ-006, -012 gegen die Beispieldatenbank ausgeführt; Ergebnis = Text der Erklärung |
| Platzhalterkontrast dunkel 6,35:1 | ja | gemessen 6,35 (hell 4,84 nicht gemessen) |
| Kein horizontaler Überlauf mobil | ja | 375 und 390 px: `scrollWidth == innerWidth` auf `#/lernen/03`, SQL-Übung, Karteikarten, Suchdialog |
| Keine Secrets in Diff, `dist/`, Historie | ja | Mustersuche (Anthropic-, OpenAI-, GitHub-, AWS-, Google-Schlüssel, private Schlüssel): 0 Treffer. Zwei Zeilen `ANTHROPIC_API_KEY=` in der Historie sind Platzhalter (10 und 16 Zeichen, mit Auslassungszeichen). Einzige versionierte Env-Datei: `.env.local.example` |
| KI im Pages-Build nicht erreichbar | ja | `#/generator` leitet bei `IS_STATIC` um; im Pages-`dist` keine `/api/`-Routen und keine Anthropic-Endpunkte; `Generator-*.js` enthält nur den Hilfetext mit Platzhalter; im Browser keine externen Anfragen |
| `npm audit`: 13 moderat, 2 niedrig | ja | Ausgabe von `npm ci` |
| `npx vite` (5178) und `npx vite preview --mode pages --port 4174` liefern 200 | ja | Dev-Server auf Ausweichport und Vorschau auf 4174 je HTTP 200 |
| `npm run quellen-pruefen`: 236 URLs erreichbar | nein | nicht ausgeführt |
| Edge-Aufnahmen, FCP 592 ms, 450 Modul-IDs, 181 Commits | nein | Nachweise außerhalb des Repositorys bzw. ohne Befehl |
| „Nachtrag des Nutzers“ zu W09 | ja | im Repository nicht belegt, vom Auftraggeber am 11.11.2026 im Chat bestätigt |

## 4. Inhalts-Diff

Alle Änderungen betreffen nur Trennzeichen und Listenform (siehe B1). Zeilennummern am Stand des Branches.

| Datei | Zeilen | Art |
|---|---|---|
| `AP2_FIDPA_Lernkarten.json` | 137, 3244, 5679 (`antwort`); 4696–4697 (`frage` und `antwort`); 993, 2605, 2806, 4856, 5738 (`rechenweg`) | Karten |
| `AP2_Rechen_Uebungen.json` | 1413, 1554 | Aufgabentext |
| `AP2_SQL_Uebungen.json` | 280, 950, 1016, 1077, 1197, 1568 | Erklärung |
| `AP2_SQL_Belegsatz.md` | 103 | Material |
| `Begriffsseiten_A.md` | 64, 1468 | Beispiel |
| `Begriffsseiten_B.md` | 1007, 1299 | Beispiel |
| `Begriffsseiten_E.md` | 641 | Beispiel |
| `Begriffsseiten_F.md` | 773 | Beispiel |
| `Begriffsseiten_G.md` | 665, 948 | Beispiel |
| `Begriffsseiten_I.md` | 395–396 | Beispiel |
| `Begriffsseiten_K.md` | 1284 | Beispiel |
| `Begriffsseiten_L.md` | 41–43, 605–607, 658 | Beispiel (zwei mit Fehler B2) |
| `Begriffsseiten_M.md` | 786, 1400–1402, 1430–1432 | Beispiel (eins mit Fehler B2) |
| `Begriffsseiten_Q.md` | 149–152 | Beispiel |
| `Begriffsseiten_R.md` | 549–550, 1317 | Beispiel (eins mit Fehler B2) |
| `Begriffsseiten_S.md` | 72, 601–604 | Beispiel |
| `Begriffsseiten_Z.md` | 124 | Beispiel |
| `DeepDive_01_SQL.md` | 368 | Theorie |
| `DeepDive_01_SQL_Loesungen.md` | 122 | Lösung |
| `DeepDive_03_Statistik_I.md` | 145–146, 199–201, 204 | Theorie |
| `DeepDive_03_Statistik_I_Loesungen.md` | 95–96 | Lösung |
| `DeepDive_04_Statistik_II.md` | 39–41, 99–100, 117–118, 120–121, 165–167, 169 | Theorie |
| `DeepDive_04_Statistik_II_Loesungen.md` | 17–18, 70–71 | Lösung |
| `DeepDive_06_CRISPDM_ML.md` | 132, 198, 367, 371, 375, 750 | Theorie und Anlage |
| `DeepDive_07_Modellguete.md` | 144–146 | Theorie |
| `DeepDive_07_Modellguete_Loesungen.md` | 6, 94 | Lösung |
| `DeepDive_11_Visualisierung_Algorithmen.md` | 64, 66, 274, 278–280, 308 | Theorie |
| `DeepDive_12_Projektmanagement_Loesungen.md` | 77–79 | Lösung |
| `DeepDive_14_WiSo_II.md` | 389, 509 (Aufgabe D1) | Anlage und Aufgabe |
| `DeepDive_17_Glossar_Diagramme.md` | 207, 1334, 1423 (Text in SVG); 1688, 1733, 1741, 1749 | Diagramm und Formelübersicht |
| `DeepDive_21_Altklausur_Prozessanalyse_II_Loesungen.md` | 138–139, 164–165 | Lösung |
| `DeepDive_24_Altklausur_Datenqualitaet_III_Loesungen.md` | 32–34 | Lösung |
| `Deep_Dive_SQL_KW28_29.md` | 402 | Lösung |

Summe: 93 geänderte Ausgangszeilen (75 Markdown, 10 Kartenfelder, 6 SQL-Erklärungen, 2 Rechenaufgaben) – deckt sich mit dem Changelog. Punkte, Lösungswerte und IDs: keine Änderung.

## 5. Nicht geprüft

- **CI auf GitHub:** kein Push erlaubt; Workflow nur gelesen.
- **Service Worker im eingebauten Browser:** dort schlägt die Registrierung fehl („unknown error when fetching the script“), obwohl `sw.js` mit 200 lädt. Offline und Update habe ich deshalb in Edge headless geprüft; dort funktioniert alles. Ich werte das als Eigenheit des eingebetteten Browsers, belegt ist das nicht.
- **SQL-Ausführung offline:** Editor und Schema laden offline; eine Abfrage habe ich nur online ausgeführt.
- **Codex-Nachweisordner** (Aufnahmen), **`quellen-pruefen`**, **echter KI-Aufruf** (kostet Guthaben, `.env.local` nicht angefasst).
- **Screenreader, Safari/iOS, heller Kontrast, vollständiger WCAG-Durchlauf.** Nur Stichprobe: Suchdialog, Lernblatt, SQL-Übung, Karteikarten.
- **Darstellung von `Begriffsseiten_R.md:549`** (nur am Quelltext beurteilt) und die übrigen 60 SQL-Übungen sowie 101 Rechenübungen (nur über die Testsuite).
- **Rechtliches:** Ich kann die Hinweise des Audits weder erhärten noch entkräften. Mir liegen keine Originalprüfungen vor, ein Wortlautvergleich war nicht möglich. Auffällig und nur zu melden: DD18–26 heißen „Altklausur-Training“, `DeepDive_17_Glossar_Diagramme.md:1688–1749` gibt Formeln und SQL „des Anhangs“ (Stand 2024-10-07) wieder, und `LIZENZ-INHALTE.txt` stellt alle Inhalte unter CC BY-NC-SA 4.0. Ob die Nachbildungen weit genug vom Original entfernt sind, um sie so zu lizenzieren, ist unbelegt.

## 6. Merge-Empfehlung

Vor dem Merge nach `main`:

1. **B1 ist entschieden:** Die Inhaltsänderungen bleiben.
2. **B2** (vier Leerzeilen) und **B3** (sieben Stellen auf Semikolon) korrigieren, danach `npm run import-report` und `npm test`.
3. **B5:** lokalen Pfad aus `CHANGELOG-AGENT.md:78` entfernen.
4. **H1:** Escape-Zweig im Suchfeld wiederherstellen.
5. Empfohlen, nicht zwingend: **B4** (Pages-Build bei Importhinweisen abbrechen), **H4** (Formatcheck), **H5** (README-Verweis).
6. Pull Request gegen `main` öffnen und den ersten CI-Lauf abwarten; erst bei grünem Lauf mergen. In den Repository-Einstellungen prüfen, dass Pages auf „GitHub Actions“ steht.
7. Nach dem Deployment einmal die Online-Version öffnen: Update-Hinweis erscheint, „Neu laden“ zeigt den neuen Stand, Fortschritt ist noch da.
