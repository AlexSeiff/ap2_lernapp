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

## Phasen 2 bis 9

Noch nicht begonnen.
