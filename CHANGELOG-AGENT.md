# Änderungsnachweis · AP2-Lern-App · 10.–11. November 2026

Lokaler Branch `audit-optimierung`, Basis `ed22076` auf `main`. `git log -4 main` enthielt `775be56`, `ed2a378`, `cab9966` und `ed22076`. **24 Funde: 0 kritisch, 14 wichtig, 10 Nice-to-have. 13 umgesetzt, 11 als Vorschläge dokumentiert.** Die Entscheidungen stehen in [AUDIT.md](AUDIT.md).

## Vorher und nachher

Windows, Node 24.21.0, npm 11.19.0. Dauer in Sekunden als gemessene Befehlslaufzeit. Unabhängige Prüfungen liefen teilweise gleichzeitig. Die Zahlen sind Funktionsnachweise und kein Performance-Benchmark. Beide Builds, die vollständige Testsuite und die Bundle-Messung stammen vom ergänzten Abschluss am 11. November; die übrigen Ausgangs- und Abschlusschecks vom 10. November. Der zuletzt geänderte Kartenhinweis wurde zusätzlich mit ESLint und Prettier geprüft.

| Befehl | Ausgangsstand | Abschluss |
|---|---|---|
| Installation | `npm install --no-audit --no-fund --offline`: 2,13 s, erfolgreich, eine ausstehende esbuild-Freigabe | Frische Kopie, `npm ci --foreground-scripts`: 16,25 s, 600 Pakete installiert. Der dokumentierte Befehl `npm ci` bestand zusätzlich ohne Optionen in 14,80 s. Das postinstall von esbuild 0.28.2 wurde ausgeführt. `npm approve-scripts --allow-scripts-pending`: kein ungeprüftes Skript. |
| `npm run build` | grün, 15,53 s | grün, 5,36 s |
| `npm run build:pages` | grün, 12,66 s | grün, 7,90 s |
| `npm test` | 90 Dateien / 1.325 Tests grün, 24,08 s | 90 Dateien / 1.331 Tests grün, 21,18 s |
| `npm run typecheck` | grün, 2,57 s | grün, 2,95 s |
| `npm run lint` | grün, 27,06 s, null Warnungen | grün, 20,29 s, null Warnungen |
| `npm run format:check` | rot, 10 Dateien, 24,50 s | rot, dieselben 10 Dateien, 15,05 s |
| Workbox-Precache | 139 Einträge / 7.320,71 KiB | 139 Einträge / 7.321,08 KiB |

Beim ersten Baseline-Testlauf blockierte die Windows-Sandbox fünf `rename`-Operationen im temporären Testordner (EPERM, 1.320/1.325 grün, 40,35 s). Der Wiederholungslauf mit regulären Temp-Rechten bestand vollständig. Der Dateizeitstempel des echten Fortschritts liegt vor dem Audit. Sämtliche schreibenden Browserproben liefen im Pages-Preview. Der lokale Startbefehl wurde in einer frischen Kopie nur mit GET auf die Startseite geprüft.

| Build-Ausgabe in kB, unkomprimiert / gzip | Ausgangsstand | Abschluss |
|---|---|---|
| Einstieg lokal | 287,12 / 90,91 | 287,17 / 90,92 |
| Einstieg Pages | 289,56 / 91,72 | 289,62 / 91,73 |
| SQL-Editor, beide Builds | 375,06 / 122,78 | 375,06 / 122,78 |
| KaTeX, beide Builds | 259,11 / 77,70 | 259,11 / 77,70 |
| Pages content.json | 1.957,13 / 506,18 | 1.956,98 / 506,13 |
| Pages begriffe.json | 1.566,54 / 522,22 | 1.566,32 / 522,13 |
| SQL-WASM | 688,19 / 340,59 | 688,19 / 340,59 |

## Commits und Prüfungen

In jeder Implementierungszeile bedeutet **Build** `npm run build` und **Tests** `npm test`. Beide liefen für jeden Fund. Die vollständige Dateiliste ist unabhängig vom Arbeitsordner mit `git show --name-only <Commit>` nachvollziehbar.

| Fund · Commit | Geänderte Dateien und Grund | Build / Tests |
|---|---|---|
| Audit · `a50c4c1` | `AUDIT.md` vor der Umsetzung angelegt. Erfasst Ausgangsstand, Priorität, Fundort und Entscheidung. | Baseline siehe oben |
| W01 · `9690b0d` | `server/router.ts`, `server/apiPlugin.ts`, `tests/router.test.ts`. Schreibende Anfragen mit abweichendem Browser-Origin werden vor dem Handler abgewiesen. | grün / 1.326 grün |
| W02 · `e496c20` | `shared/svgDiagramm.ts`, `tests/diagramme.test.ts`. Sichere Paint-Werte und lokale Marker beim Import und Anzeigen prüfen. | grün / 1.329 grün, Formatnachprüfung mit 1.331 grün |
| W03 · `788edba` | `shared/lernkarten.ts`, `tests/lernkarten.test.ts`. Zod prüft ID, Frage und Antwort je Karte. Ungültige Einträge erhalten Fundort und beeinträchtigen gültige Nachbarn nicht. | grün / 1.330 grün |
| W04 · `655fd45` | `tests/sqlAufgaben.smoke.test.ts`. Alle SQL-Blöcke der verknüpften Klausurlösungen gegen die Editorreferenzen ausgeführt, mit deren erlaubten Projektionen und Aliasen. | grün / 1.330 grün |
| W06 · `923644b` | `shared/progress.ts`, `tests/progress.test.ts`. Eine ungültige Versionsnummer verwendet den begrenzten Altformatpfad. | grün / 1.331 grün |
| W09 · `b56dbc6` | 93 Stellen in 33 Inhaltsdateien: 75 Markdown-Zeilen, zehn Kartenfelder, sechs SQL-Erklärungen und zwei Rechenaufgaben. Eigenständige Formeln als einzelne Listeneinträge, Ergebnisreihen im Fließtext oder in Tabellen als Aufzählung. Beispiele sind IQR-Zäune, Regression, Modellgüte, Projektkosten, Sortierlisten, geglättete Reihen und SQL-Ergebnisse. | grün / 1.331 grün, `npm run import-report` mit 0 Hinweisen |
| W05 · `c4258b3` | `src/components/SucheDialog.tsx`, `src/styles.css`, `tests/suche.test.ts`. Nativer modaler Dialog, Fokus zum Auslöser, sichtbarer Fokus und lesbarer Platzhalter. | grün / 1.331 grün, Edge-Nachweis unten |
| W07 · `827bee2` | `vite.config.ts`, `tsconfig.json` und importierte Module in `server/`, `shared/`, `src/lib/`, `src/rechnen/`. 117 relative Importe aufgelöst, HttpError mit Standard-Klassenfeld für Node-Type-Stripping. | grün / 1.331 grün. `vite build --configLoader native` und `vite build --mode pages --configLoader native` jeweils Exit 0 |
| W14 · `5606d45` | `src/rechnen/vorlagen/{neuronal,klassifikation,crispdm,prozess,projekt,verfuegbarkeit,wiso}.ts`, `src/lib/boxplotAntwort.ts`, `src/pages/Karteikarten.tsx`, zugehöriger Test. Trennpunkte auch in generierten Eingabedaten, Ergebnissen und Aktivierungsfunktionen ersetzt. Absatz nach der neuen Formelliste in `content/DeepDive_03_Statistik_I.md`, zusätzlicher Fund in `AUDIT.md`. | grün / 1.331 grün, Edge-Nachweis unten |
| W08 · `fa40c3e` | `README.md`, `CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/lerninhalt.md`, `.github/pull_request_template.md`. Setup, tatsächliche Mobilnavigation, Aufgabenformat, Quelle, Lösungsprüfung und PR-Ablauf dokumentiert. | grün / 1.331 grün, nach Navigationsabgleich erneut grün |
| N01 · `2489ba1` | `.github/workflows/pages.yml`. PR-Build mit Leserechten und den bestehenden Inhalts-Smokes. Upload und Deployment nur bei erfolgreichem main-Build. | grün / 1.331 grün, Workflow-YAML geparst und Trigger, Schritte, Jobabhängigkeit und Rechte geprüft |
| N03 · `c9b8f82` | `.gitignore`. Private Umgebungskonfigurationen ignorieren, versionierte Beispielvorlage ausnehmen. | grün / 1.331 grün, `git check-ignore --no-index` mit vier privaten Namen und der Vorlage geprüft |
| N02 · `5bed093` | `package.json`. Mit `npm approve-scripts esbuild` ausschließlich 0.28.2 freigegeben. Lockfile unverändert. | grün / 1.331 grün. Zusätzlich in der sauberen Installation beide Builds und alle 1.331 Tests grün. |

Die abschließende Dokumentation ergänzt ausschließlich `AUDIT.md` und `CHANGELOG-AGENT.md`. Ihr Commit ist mit `git log -1 -- CHANGELOG-AGENT.md` eindeutig auffindbar.

## Gegenproben

Im separaten Testprojekt wurde für jede neu hinzugenommene Prüfung absichtlich eine Regel verletzt. Die Arbeitskopie erhielt anschließend wieder den geprüften Code. Die vorhandenen SQL-Fälle in W04 wurden durch stärkere Assertions ersetzt.

| Gezielter Vitest-Aufruf (über `npm test --`) | Eingebrachter Fehler | Beobachtetes Ergebnis |
|---|---|---|
| `tests/router.test.ts -t "schützt schreibende"` | Herkunftsprüfung für alle Methoden übersprungen | 1 fehlgeschlagen, weil HTTP 403 ausblieb |
| `tests/diagramme.test.ts -t "lehnt ab"` | Zusätzliche Paint-/Marker-Positivprüfung entfernt | Genau die 3 neuen Fälle schlugen fehl. 9 bisherige Negativfälle bestanden. |
| `tests/lernkarten.test.ts -t "ungültige Strukturen"` | Pflichttext auf leere Zeichenketten gelockert | 1 fehlgeschlagen, Importhinweise und Kartenbestand weichen ab |
| `tests/sqlAufgaben.smoke.test.ts -t "jede SQL-Musterlösung"` | Im Test statt des eingelesenen SQL absichtlich `SELECT -999999` verglichen | 26 von 26 Klausurfällen rot. Nach Rücknahme 27 Originalblöcke mit 40 erfolgreichen Basis-/Variantenvergleichen. |
| `tests/progress.test.ts -t "ungültiger Versionsnummer"` | Ungültige Versionsnummer startet auf Version 9 und überspringt den Aufgaben-Umzug | 1 fehlgeschlagen. Der korrekte Pfad erhält die Aufgabenbezüge für 0,5 und −10²⁰. |

W05 und W14 hatten zunächst je einen roten Bestandstest. Der erste erwartete das Attribut `role="dialog"` am alten div, der zweite die bisherigen Trennpunkte im Boxplot-Export. Beide Versuche wurden vor dem Commit zurückgenommen und mit an die beauftragte Darstellung angepasster Assertion neu durchgeführt. Die korrigierten Tests prüfen den benannten nativen Dialog bzw. die vollständige erwartete Ausgabe.

## Inhalts- und Browserprüfung

- `npm run import-report`: 0 Hinweise. Kartenprüfer aus dem Projekt-Skill: 734 Karten in 28 Decks und 816 Karten in 16 Decks, beides OK. 478 eindeutige Aufgaben-IDs, 610 eindeutige Abschnitts-IDs, 1.011 Begriffsseiten, alle Blockpunktesummen passen. `npm run quellen-pruefen`: alle 236 verschiedenen URLs aus 393 Einträgen erreichbar.
- Separate Rechnung aus den Übungsdaten: RE-ST1-009 ergibt Q1 = 3 und Q3 = 6. RE-ST2-002 ergibt mit linearer Regression die Steigung 6,4, den Achsenabschnitt 24,8 und Prognosen 63,2 / 152,8. RE-MG-001 ergibt Accuracy 93 %, Precision 60 %, Recall 90 % und F1 72 %. Die zweite Beispielmatrix ergibt 87 / 40 / 60 / 48 %, die Fehlerkosten sind 2.100 / 6.150. Die geprüften App-Werte stimmen überein.
- Die Suche nach mittigen Punkten umfasste Markdown, JSON-Felder und Rechenvorlagen. Treffer wurden im Kontext von Gleichungen, Ergebnislisten und tatsächlichen Faktoren unterschieden. Die gezielte Abschluss-Suche nach einem Punkt zwischen zwei Dollar-Formeln ergab keine verbliebene Fundstelle. Bei beiden Zaunformeln blieb der Faktor `1,5 · IQR` im mathematischen Ausdruck.
- Edge, 1.280 und 390 CSS-Pixel, jeweils hell und dunkel, mobil dunkel zusätzlich mit reduzierter Bewegung. Beide Zaunformeln standen in eigenen Zeilen, mit gerendertem KaTeX und ohne horizontalen Seitenüberlauf. Der Suchdialog hielt den Hintergrund inaktiv. Escape am Schließen-Knopf schloss ihn und setzte den Fokus zur Lupe zurück. Der Platzhalterkontrast auf der Dialogfläche stieg im Dunkelmodus von 3,11:1 auf 6,35:1 und im Hellmodus von 4,41:1 auf 4,84:1.
- Die Pages-Vorschau lief mit einer isolierten Kopie unter `/ap2_lernapp/`. 139 Cache-Einträge im Scope, drei Icons mit HTTP 200. Bei künstlich veröffentlichter neuer Inhaltsrevision erst der alte Text, nach Klick der neue, drei Versuche erhalten. Offline-Neuladen, neues Lernblatt und SQL-Schema erfolgreich, 93 Antworten aus dem Service Worker. Fehlerproben für 404, WASM und Speicherquote ergaben die in AUDIT.md genannten Meldungen. Altsicherung V8 → echter JSON-Download V9 → erneuter Import funktionierte. Die eigenen Server wurden beendet.
- `npx vite` und `npx vite preview --mode pages --port 4174 --strictPort` lieferten beim getrennten Start in der frischen Kopie auf Port 5178 bzw. 4174 je HTTP 200 für die Startseite. Beide Ports waren nach dem Beenden frei.

Browser-Nachweise liegen außerhalb des Repositorys. Der Ordner enthält unter anderem `zaun-desktop-hell.png`, `zaun-desktop-dunkel.png`, `zaun-handy-hell.png`, `zaun-handy-dunkel.png`, die vier Suchdialogansichten sowie die Tastaturprobe.

## Ergänzende Nachprüfung am 11. November

Der Abschlussreview fand bei W09 weitere 41 Trennzeichenstellen in 18 Inhaltsdateien: numerische Ein- und Ausgabelisten, Sortierbeispiele, Rangfunktionen, SQL-Ergebnisse und Beitragssätze. Die obigen 93 Stellen enthalten diese Ergänzung. W14 umfasst zusätzlich die Lernintervalle im Kartenhinweis. Nur die Trenner wurden geändert; ein Vergleich unter Ausblendung dieser Satzzeichen bestätigte unveränderte Zahlen, IDs und Wörter. Die Ergänzungen sind in die jeweiligen Fund-Commits aufgenommen. Beim gekürzten Kartenhinweis meldete Prettier zunächst einen anderen Zeilenumbruch. Die ungecommittete Textänderung wurde zurückgenommen und anschließend mit der geforderten Formatierung erneut angewendet; der gezielte Formatcheck bestand danach.

`npm run build`, `npm run build:pages` und `npm test` bestanden erneut mit den oben angegebenen Abschlusswerten. `npm run import-report`: 0 Hinweise. `npx eslint src/pages/Karteikarten.tsx --max-warnings=0` und `npx prettier src/pages/Karteikarten.tsx --check`: erfolgreich. Die Suche umfasste erneut alle Inhaltsdateien, Rechenvorlagen und die übrigen App-Texte; tatsächliche Produkte und reine Navigations-/Quellenverweise bleiben mit ihren bisherigen Zeichen erhalten.

Neun zusätzliche Edge-Aufnahmen prüfen Sortiertabelle, Dezimalreihe, SQL-Ergebnisse, Kartenrückseite, Lernintervalle und Rechenaufgabe bei 1.280 bzw. 390 CSS-Pixeln in Hell/Dunkel; keine Konsolenfehler oder horizontalen Seitenüberläufe. Alle Aufnahmen wurden geöffnet und angesehen. Dateien im Nachweisordner: `sortieren-*`, `zahlenreihe-*`, `sql-ergebnisse-desktop-hell.png`, `karte-sortieren-handy-dunkel.png`, `intervalle-*`, `beitragssaetze-handy-hell.png`. Auch diese eigene Vorschau wurde beendet.

## Inhaltliche Funde (nicht geändert)

W10: Wartezustand beim BPMN-Zwischen-Timer auf den betroffenen Pfad begrenzen. W11: Ein negativer unterer Zaun lässt Ausreißer unter diesem Wert zu. W12: Formelhinweise einzelner Rechen- und Deutungsaufgaben ergänzen. N05: Zehn Markdown-Zeilen verwenden einzeiliges Doppel-Dollar für gewünschten Blocksatz. N06: Fachquelle und fachlichen Prüfstatus je Aufgabe ergänzen. Alle Einzelstellen, Beispiele und die Grenzen des Vergleichs mit Originalprüfungen stehen in [AUDIT.md](AUDIT.md).
