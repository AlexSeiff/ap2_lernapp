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

## Phasen 1 bis 9

Noch nicht begonnen.
