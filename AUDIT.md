# Audit der AP2-Lern-App · 10. November 2026

## Zusammenfassung

Ausgangspunkt ist `ed22076`. Auf `main` sind die vier vorgegebenen Updates bereits enthalten.  
Beide Builds, Typecheck, Lint und 1.325 Tests bestanden. Der Formatcheck meldete zehn Dateien.  
Die öffentliche App funktioniert im geprüften Unterpfad offline, aktualisiert Inhalte auf Bestätigung und migriert exportierten Fortschritt.  
Handlungsbedarf besteht vor allem bei der lokalen API, der SVG- und Kartenprüfung, der Fortschrittsmigration und der Tastaturbedienung.  
Die zusätzliche Bitte zur Darstellung betrifft echte Trennpunkte zwischen Formeln und zusammengehörigen Rechenergebnissen.  
Die Nachweise zu Änderungen und Abschlussmessungen stehen in [CHANGELOG-AGENT.md](CHANGELOG-AGENT.md).

## Funde

Zeilen beziehen sich auf `ed22076`. Die Priorität steht in der ersten Spalte. Jeder Eintrag nennt Beobachtung und Maßnahme.

| Priorität · ID | Datei und Zeile | Beobachtung und Maßnahme | Entscheidung |
|---|---|---|---|
| Wichtig W01 | `server/apiPlugin.ts:53,59,108`, `server/router.ts:58` | Ein fremder Browser-Origin kann einen einfachen POST mit JSON in `text/plain` schicken. Der Body wird akzeptiert. Bei laufendem lokalen Server und konfiguriertem Schlüssel könnte das eine kostenpflichtige Anfrage auslösen. Schreibende Browseranfragen vor dem Handler auf zulässige Herkunft prüfen und mit Attrappen testen. | setze ich um |
| Wichtig W02 | `shared/svgDiagramm.ts:87`, `src/components/SvgDiagramm.tsx:11` | Der Inline-SVG-Filter erkennt externe Paint-URLs nur in der Schreibweise `url(`. Großschreibung, Zeichenreferenzen oder CSS-Escapes umgehen diese Prüfung. Sichere Attributwerte und lokale Fragmentverweise prüfen. | setze ich um |
| Wichtig W03 | `shared/lernkarten.ts:128,136,145,173` | Nullwerte im Deck oder Kartenarray brechen den Import ab. Eine fehlende Antwort erzeugt eine Karte ohne Rückseite. Die vorhandene Parserprüfung um Pflichtwerte und Importhinweise ergänzen, gültige Geschwister weiter einlesen. | setze ich um |
| Wichtig W04 | `tests/sqlAufgaben.smoke.test.ts:55` | Der Klausurtest vergleicht die SQL-Referenz mit sich selbst. Die für Lernende sichtbaren SQL-Blöcke auf frischen Grund- und Variantendaten ausführen und mit den bestehenden Vergleichsregeln gegen die Editorreferenz prüfen. | setze ich um |
| Wichtig W05 | `src/components/SucheDialog.tsx:48,76,85` | Im Edge-Test schließt Escape vom Schließen-Knopf die Suche nicht. Tab erreicht dahinter „Zum Inhalt springen“. Fokus im Dialog halten, Schließen von jeder Position ermöglichen, Auslöserfokus wiederherstellen und Lesbarkeit in beiden Designs prüfen. | setze ich um |
| Wichtig W06 | `shared/progress.ts:522`, `src/lib/backup.ts:19` | Bei einer Versionszahl wie −10²⁰ bleibt der Schleifenzähler beim Inkrementieren unverändert. Das Öffnen einer beschädigten Sicherung kann die App einfrieren. Migrationsarbeit auf die vorhandenen Schritte begrenzen und den Altformatpfad testen. | setze ich um |
| Wichtig W07 | `vite.config.ts:4,11,12,22`, `src/rechnen/hilfen.ts:5–8`, `server/router.ts:10` | Vite meldet 117 endungslose Importe in 38 Dateien der Konfigurationskette. Explizite Dateipfade einschließlich Verzeichnisindizes setzen, lokale und statische Konfiguration auch mit nativem Loader prüfen. | setze ich um |
| Wichtig W08 | `README.md:65,82,209,251`, fehlende `CONTRIBUTING.md` und Vorlagen unter `.github/` | Die Anleitung empfiehlt direktes Pushen, nennt veraltete Zahlen und Fortschrittsversion 8. Für neue Mitwirkende fehlen der Weg von der Aufgabe zur geprüften Lösung und ein Ort für Quelle und Prüfnachweis. Anleitung, Beitragsleitfaden, Issue- und PR-Vorlage zusammenführen. | setze ich um |
| Wichtig W09 | `content/DeepDive_03_Statistik_I.md:198,201`, weitere Stellen siehe Änderungsnachweis | Im unteren und oberen Zaun sieht das Trennzeichen wie ein zusätzlicher Faktor aus. Nachtrag des Nutzers: eigenständige Formeln und Ergebnislisten im Bestand deutlich trennen, Multiplikationszeichen innerhalb der Rechnung erhalten. | setze ich um |
| Wichtig W10 | `content/DeepDive_05_Prozessanalyse.md:342`, `content/AP2_FIDPA_Lernkarten.json:2106` | Beim fangenden Zwischen-Timer wartet der Token dieses Pfads. Parallele Pfade können weiterlaufen. „Nichts anderes läuft“ auf den betroffenen Pfad einschränken. Die Unterscheidung der unterbrechenden und nicht unterbrechenden Grenzereignisse in DD05:344–352 ist korrekt. [OMG BPMN 2.0.2, Kapitel 10.5](https://www.omg.org/spec/BPMN/2.0.2/PDF) | nur Vorschlag |
| Wichtig W11 | `src/rechnen/formeln.ts:97`, `src/rechnen/hilfen.ts:24` | Bei einem negativen unteren Zaun bleiben kleinere Messwerte möglich. Beispiel: Q1 = −10 und Q3 = 0 ergeben den Zaun −25. Ein Messwert −30 liegt darunter. Erklärung auf nichtnegative Messgrößen beschränken. Die Quartilfunktion liefert nach der dokumentierten Konvention den Wert an der Position. | nur Vorschlag |
| Wichtig W12 | `content/DeepDive_11_Visualisierung_Algorithmen.md:381`, `DeepDive_13_WiSo_I.md:387`, weitere unten | Bei Rechen- bzw. Deutungsaufgaben fehlen eigenständige Formelhinweise. Allgemeine Formel als Blockquote ergänzen. | nur Vorschlag |
| Wichtig W13 | `server/ai.ts:86,152`, `server/mcWerkzeug.ts:193` | SDK 1.8 ist mit Attrappen geprüft. Ein echter Generierungs- oder Bewertungsaufruf durch den Betreiber steht aus. | nur Vorschlag |
| Wichtig W14 | `src/rechnen/vorlagen/neuronal.ts:59,171`, `klassifikation.ts:360`, `src/lib/boxplotAntwort.ts:148` | Auch generierte Hinweise, Eingabedaten und Ergebnislisten verwenden mittige Punkte als Trennzeichen. Zusammenhängende Zahlen und Gleichungen in Sätzen oder als gegliederte Aufzählung ausgeben. | setze ich um |
| Nice-to-have N01 | `.github/workflows/pages.yml:8,14,31,41` | Tests einschließlich der Inhalts-Smokes, Lint und Typecheck im Build sperren schon das Deployment auf main. PRs durchlaufen bisher keinen Workflow. Dort dieselben Prüfungen mit Leserechten ausführen, Veröffentlichung auf main beschränken. | setze ich um |
| Nice-to-have N02 | `package-lock.json:5142`, `package.json:6` | npm 11.19 meldet esbuild@0.28.2 bei jeder Installation. Sein postinstall prüft die plattformspezifische ausführbare Datei. Genau die geprüfte Version freigeben und eine frische Installation verifizieren. | setze ich um |
| Nice-to-have N03 | `.gitignore:4` | Nur `.env.local` ist explizit ausgeschlossen. Entwicklungs- und Produktionsvarianten könnten versehentlich ins Repository gelangen. Ignore-Regeln ergänzen, Beispielvorlage weiterhin versionieren. | setze ich um |
| Nice-to-have N04 | `package-lock.json:4849,8119`, siehe Tabelle | 15 Auditmeldungen betreffen Entwicklungswerkzeuge. npm bietet nur Änderungen außerhalb der gewählten Werkzeugversionen an. Upstream-Fixes verfolgen. | nur Vorschlag |
| Nice-to-have N05 | `content/DeepDive_06_CRISPDM_ML.md:554,562` und Liste unten | Einzeiliges Doppel-Dollar wird mit remark-math 6 als Inline-Formel gesetzt. Bei gewünschtem Blocksatz die Begrenzer auf eigene Zeilen setzen. | nur Vorschlag |
| Nice-to-have N06 | `shared/quellen.ts:25`, `server/quellenPruefen.ts:29` | 393 Quellen verweisen auf Abschnitte oder Begriffe. „geprueft“ bezieht sich auf die Quelle. Als Erweiterung Aufgabenziel, Fundstelle sowie unabhängigen fachlichen Prüfstatus und Prüfdatum vorsehen. | nur Vorschlag |
| Nice-to-have N07 | `server/ai.ts:11` | Standard ist `claude-sonnet-5`. Der Betreiber kann `claude-sonnet-5-5` über ANTHROPIC_MODEL erproben und dann über den Standard entscheiden. | nur Vorschlag |
| Nice-to-have N08 | `package-lock.json:57`, `README.md:289` | SDK 1.8 steht unter Apache-2.0. Bei einer späteren Abhängigkeitsübersicht diese Lizenz übernehmen. Die vorhandene Projektlizenz gilt für den eigenen Code. | nur Vorschlag |
| Nice-to-have N09 | `.claude/skills/app-pruefen/scripts/screenshot.mjs:1`, `src/main.tsx:1` u. a. | Prettier meldet zehn Bestandsdateien. Formale Bereinigung der beiden Skill-Skripte und acht Code-/Testdateien als eigener Pflege-PR. | nur Vorschlag |
| Nice-to-have N10 | `src/components/Datenschutz.tsx:21`, `src/lib/sprachausgabe.ts:27,139` | Die verwendete Browserstimme kann ein Online-Dienst sein. Die Wahl der Stimme und mögliche Übermittlung des gesprochenen Textes im Datenschutzhinweis ausdrücklich erklären. | nur Vorschlag |

## Abhängigkeiten

`npm audit --json` meldet 13 moderate und zwei niedrige Funde. `npm audit --omit=dev --json` meldet null. Der folgende Pfad beginnt bei einer direkten Entwicklungsabhängigkeit. Dieselben Pakete können auf mehreren Pfaden liegen. npm bietet je Kette die unten genannten Rückstufungen an. Keine davon ist ein Fix innerhalb der bestehenden Bereiche.

| Gemeldetes Paket | Schwere | Beispielpfad ab Projektwurzel (jeweils Entwicklungswerkzeug) |
|---|---|---|
| @eslint/js 10.0.1 | moderat | @eslint/js |
| eslint 10.14.0 | moderat | eslint |
| @eslint/config-array 0.23.5 | moderat | eslint → @eslint/config-array |
| minimatch 10.2.6 | moderat | eslint → @eslint/config-array → minimatch, auch über glob und typescript-estree |
| typescript-eslint 8.72.2 | moderat | typescript-eslint |
| @typescript-eslint/eslint-plugin 8.72.2 | moderat | typescript-eslint → eslint-plugin |
| @typescript-eslint/parser 8.72.2 | moderat | typescript-eslint → parser |
| @typescript-eslint/type-utils 8.72.2 | moderat | typescript-eslint → eslint-plugin → type-utils |
| @typescript-eslint/typescript-estree 8.72.2 | moderat | typescript-eslint → parser → typescript-estree |
| @typescript-eslint/utils 8.72.2 | moderat | typescript-eslint → utils |
| vite-plugin-pwa 2.0.0 | moderat | vite-plugin-pwa |
| workbox-build 7.4.1 | moderat | vite-plugin-pwa → workbox-build |
| glob 11.1.0 | moderat | vite-plugin-pwa → workbox-build → glob |
| @rollup/plugin-node-resolve 16.0.3 | niedrig | vite-plugin-pwa → workbox-build → @rollup/plugin-node-resolve |
| deepmerge 4.3.1 | niedrig | vite-plugin-pwa → workbox-build → @rollup/plugin-node-resolve → deepmerge |

Primärmeldungen: [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4), [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4). npm nennt ESLint/@eslint/js 9.39.5, typescript-eslint 8.36.0 und vite-plugin-pwa 1.1.0. Ein Wechsel auf 8.36.0 wäre eine Rückstufung innerhalb der Hauptversion und außerhalb von `^8.70.1`. Workbox-Buildwerkzeuge werden beim Erzeugen von sw.js ausgeführt. Die 15 gemeldeten Pakete werden nicht an Lernende ausgeliefert.

## Prüfumfang und Belege

- **Import und Rechnen.** `npm run import-report` endet bei Hinweise (0). 478 Klausuraufgaben mit Lösungen, alle Klausuren 100 Punkte. Die kürzeste Lösung hat 60 Zeichen und enthält in 20-C5 eine Rechnung. 734 Lern- und 816 Begriffskarten. 109 Rechenübungen, davon 103 mit Vorlage und 67 mit festen Daten. Die Tests in `tests/rechenInhalte.smoke.test.ts:47` bauen feste Instanzen und testen bis zu 100 Varianten je Übung. Sie prüfen u. a. Median/Quartil, Regression und Modellgüte gegen Blattwerte und Eigenschaften. Zod-Schemata für SQL-, Diagramm- und Rechenübungen liegen in `shared/`, die Vorlagenprüfung in `src/rechnen/`; die Inhalts-Smokes testen den ausgelieferten Bestand.
- **Formelhinweise W12.** 11-B1 (DD11:381), 13-B3 (DD13:387), Interpretationen 18-D3c (DD18:343) und 04-D3 (DD04:308), Bytezahl 15-B4 (DD15:360). 19-D3 (DD19:359) nennt die Formel im Fließtext. Von sechs Rechenübungen ohne Vorlage haben fünf einen Formelblock. RE-WI-007 ist eine gesetzliche Tabellenzuordnung.
- **Darstellung N05.** `rg -n '^\$\$.+\$\$$' content` ergibt zehn Markdown-Zeilen: `DeepDive_06_CRISPDM_ML.md:554,562`, `DeepDive_18_Altklausur_Prozessanalyse.md:185`, `DeepDive_19_Altklausur_Datenqualitaet.md:47,49,176`, `DeepDive_20_Altklausur_WiSo.md:70,114,116`, `DeepDive_20_Altklausur_WiSo_Loesungen.md:53`. KaTeX setzt die Ausdrücke lesbar.
- **SQL.** Alle 73 Editorübungen auf drei Datensätzen sowie die vorhandenen Varianten durch sql.js ausgeführt. Bei den 26 zugeordneten Klausuraufgaben ergeben 27 im Markdown gezeigte SQL-Blöcke 40 erfolgreiche Ausführungsvergleiche mit Basis/Variante. Neun weitere Textaufgaben haben andere Schemata oder Dialekte (19-D1…D4, 23-B3/C2, 24-B3…B5). Nordholz-Bestelldaten wären für diese kein fachlicher Vergleich.
- **Quellen und Herkunft.** `npm run quellen-pruefen` mit Netzwerkzugriff: 236 unterschiedliche URLs aus 393 Einträgen antworteten. DD21–26 kennzeichnen das Altklausurtraining. Format, Codes und Handlungssituation sind Anhaltspunkte für die Herkunft. Für einen Vorwurf der wörtlichen Übernahme fehlt ein belegter Texttreffer. Siehe „Nicht geklärt“.
- **Secrets und KI.** Dateinamenprüfung in Git ergab allein die versionierte Beispielvorlage. Signatursuche ohne Wertausgabe in Arbeitsbaum, dist und erreichbarer Historie (181 Commits am Ausgangsstand), unter Ausschluss von .env-Dateien und Nutzdaten: keine Treffer für lange Schlüssel, Token oder private Schlüssel. Das SDK setzt den Versionsheader 2026-10-21. Die drei Aufrufe senden keine temperature/top_p/top_k. In Pages wählt `src/lib/api.ts:70` die statische Datenquelle; im JS gab es keine SDK-Endpunkte oder API-Routen. Der Text des Variablennamens im Generator ist kein Schlüssel.
- **Speicher und Netz.** Lernstand und Einstellungen im localStorage, Tagessicherungen und optionale Dateihandles in IndexedDB. Hinzu kommen lokale Darstellungs-/Sitzungswerte, SQL-Entwürfe und -Verlauf. Lerninhalte liegen im Service-Worker-Cache. Quellenlinks und YouTube werden auf Nutzeraktion geöffnet. Bei den geprüften Lernwegen wurden weder Tracker noch externe HTTP(S)- oder API-Anfragen beobachtet.
- **Betrieb.** Der Baseline-Build speichert 139 Einträge (7.320,71 KiB). Unter `/ap2_lernapp/` lagen alle Cache-URLs im Scope, drei Manifest-Icons antworteten mit 200. Offline-Neuladen, ein weiteres Lernblatt und die zuvor ungenutzte SQL-Datenbank funktionierten. In einer isolierten dist-Kopie bei neuer Inhaltsrevision: alter Stand bis zum Klick auf „Neu laden“, danach neuer Text und drei erhaltene Versuche. Kein Update-Fix erforderlich.
- **Fehlerfälle und Fortschritt.** Erzwungener content.json-404 führte zur Lademeldung mit Handlungsanweisung. Fehlendes WASM meldete einen SQL-Ladefehler. Volles localStorage zeigte eine Warnung mit Sicherungshinweis. V8-Sicherung über die Oberfläche importiert, V9 als Datei heruntergeladen und wieder in einen leeren Browserstand importiert. Drei Versuche, eine Karte und acht verglichene Felder blieben erhalten. Vorhandene Export-/Importfunktion beibehalten.
- **Ladeumfang und Code.** Pages: SqlEditor 375,06 kB (gzip 122,78), Einstieg 289,56 (91,72), KaTeX 259,11 (77,70), content.json 1.957,13 (506,18), begriffe.json 1.566,54 (522,22). Schriften, WASM, SQL und Formelsatz sind getrennt; der große Offline-Download ermöglicht den ersten Aufruf dieser Funktionen ohne Netz. `tsconfig.json:10` aktiviert strict. Der TypeScript-Importgraph ab Einstiegspunkten, Skripten und Tests ergab keine verwaisten TS-/TSX-Dateien in src/shared/server. Medien und gleichnamige Fachbegriffe wurden nicht aufgrund bloßer Textähnlichkeit gelöscht.
- **Zugänglichkeit.** Edge bei Desktopbreite und 390 px, hell/dunkel, Tastatur, Fokus, Dialogbeschriftung und verringerter Bewegung. Beim geprüften Suchdialog kein horizontaler Seitenüberlauf. Maßstab für die Dialogbedienung sind die [WAI-ARIA Dialog Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Diese Stichprobe ergibt kein Konformitätszertifikat für alle App-Seiten.

## Nicht geklärt

- W13: Ein echter SDK-Aufruf kostet Guthaben. Der Betreiber kann lokal eine Aufgabe generieren oder eine Antwort bewerten lassen.
- Für einen vollständigen Wortlautvergleich fehlen zugängliche autorisierte Originalprüfungen und Unterrichtsmaterialien. Die geprüften markanten Formulierungen führten zu keinem belastbaren Originalbeleg. Die fachliche und rechtliche Einzelprüfung sämtlicher Aussagen bleibt offen.
- Die bestehenden GitHub-Deployment-Einstellungen und ein tatsächlicher CI-Lauf auf GitHub erfordern einen Push. Lokal prüfen wir dieselben Build- und Testbefehle.
