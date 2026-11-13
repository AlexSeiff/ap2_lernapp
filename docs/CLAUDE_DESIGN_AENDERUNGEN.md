# Übergabe an Claude: Notizbuch-Navigation

Stand: 13. November 2026. Die Änderungen wurden nach einer lokalen Vorschau freigegeben.

## Gewünschtes Design

- Das Notizbuch steht auf Desktop-Fenstern mittig. Die großen Bereichsreiter sind nicht mehr als Post-its am Rand dargestellt.
- Übersicht, Lernen, Glossar, SQL-Editor und Einstellungen stehen auf der linken Inhaltsseite. Der aktive Bereich zeigt seine Unterpunkte; die Abschnitte der geöffneten Seite und Fälligkeitszahlen bleiben erhalten.
- Im Glossar stehen die farbigen Buchstabenregister auf großen Bildschirmen am rechten Buchrand. Bei begrenzter Höhe ist das Register scrollbar; auf kleineren Bildschirmen bleibt die Buchstabenauswahl im Suchkasten.
- Auf Mobilgeräten öffnet der vorhandene Knopf „Inhalt“ die Navigation als Einschub.

## Betroffene Stellen

- `src/components/Buch.tsx` und `src/App.tsx`: Inhaltsseite und Einbindung der Navigation.
- `src/notizbuch.css`: zentriertes Buch und Gestaltung des Inhaltsverzeichnisses. `--buch-breite` wird auch für die Position des Glossarregisters genutzt.
- `src/pages/Glossar.tsx` und `src/pages/glossar-register.css`: Gestaltung des Buchstabenregisters. Die bestehende Filter- und Auswahlfunktion bleibt zuständig für die Inhalte.
- `tests/navigation.test.ts`: Prüfungen für die geänderte Navigation; `README.md`: aktualisierte Beschreibung.

## Prüfung

Vor der Übergabe wurden Produktionsbuild, Lint, Formatprüfung und die Vitest-Suite ausgeführt. Die Desktop- und Mobilansicht sowie die Bedienung des Glossarregisters wurden zusätzlich im Browser geprüft, einschließlich Scrollen und Auswahl von Z bei geringer Fensterhöhe.
