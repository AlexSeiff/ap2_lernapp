# Zur AP2-Lern-App beitragen

## Eine Aufgabe hinzufügen

1. Arbeite auf einem eigenen Branch und suche in `content/` das Lernblatt und die zugehörige Datei `_Loesungen.md`. `content/` ist die einzige Quelle für Entwicklungsserver, Build und Tests.
2. Behalte bestehende IDs und Aufgabencodes bei. An ihnen hängen Lernstand, Klausurverlauf und Fehlerjournal. Für einen neuen Eintrag wähle einen freien Code im passenden Block.
3. Beginne die Klausuraufgabe mit einem kursiven IHK-Operator in der Sie-Form, etwa `*Berechnen* Sie …`. Stelle den erforderlichen Datensatz bereit. Bei Rechnungen und der Deutung eines berechneten Werts folgt im Aufgabentext die allgemeine Formel als Blockquote. Zeige unabhängige Gleichungen jeweils in einer eigenen Zeile. Der Mittelpunkt in einer Rechnung bezeichnet eine Multiplikation.
4. Ergänze die Lösung unter demselben Code und mit derselben Punktzahl. Zeige Rechenweg, Ergebnis, Einheit und Teilpunkte. Prüfe Blocksumme und Klausursumme von 100 Punkten. Für SQL die angezeigte Musterlösung auf dem bezeichneten Beispieldatensatz einschließlich Varianten ausführen.
5. Halte die verwendete Fachquelle mit Fundstelle, Stand und eigener Gegenprüfung im Pull Request fest. Verwende eigene Szenarien, Daten und Formulierungen. Übernimm nur Inhalte, deren Veröffentlichung die Lizenz erlaubt.

Beispiel für den Aufgabenkopf und den Formelhinweis im Lernblatt:

```markdown
**A1 (4 P):** *Berechnen* Sie den Anteil gültiger Datensätze. Geben Sie das Ergebnis in Prozent an.

> **Formel:** Anteil = Anzahl gültiger Datensätze / Anzahl aller Datensätze · 100 %
```

In der Lösung steht unter `**A1 (4 P):**` die Rechnung mit den konkreten Zahlen. Für eine Rechenübung mit Vorlage werden Formeln aus `src/rechnen/formeln.ts` angezeigt. Bei Aufgaben ohne Vorlage steht die Formel im Aufgabentext. Weitere Formate mit Beispielen stehen in den Projektkonventionen. [Inhalte schreiben](.claude/skills/inhalte-schreiben/SKILL.md) · [Formatreferenz](.claude/skills/inhalte-schreiben/references/formate.md)

## Karten und Schema

Die beiden Karten-JSONs enthalten Decks mit einer Liste `karten`. Jede Karte braucht eine eindeutige Text-ID, eine Frage und eine Antwort. Verwende im Deck das bestehende Präfix und eine freie Nummer. Für Begriffskarten gilt `FB-<slug>`. Aktualisiere die Zähler und erhalte die JSON-Formatierung mit zwei Leerzeichen. Bei optionalem `mc` stehen einer richtigen Antwort genau drei verschiedene falsche gegenüber. Karten verwenden die Du-Form und Unicode-Formeln. In Lernblättern setzt KaTeX die LaTeX-Ausdrücke.

Die bestehenden Parser in `shared/` prüfen unter anderem Karten, Rechen-, Diagramm- und SQL-Übungen. Der Importbericht nennt Datei und beanstandetes Feld. Die Tests prüfen zusätzlich fachnahe Eigenschaften wie Punktesummen, SQL-Ergebnisse, Rechenvarianten, Verweise und die Lesbarkeit alter Sicherungen. Bei einem neuen Fehler ergänze eine Gegenprobe, die mit der fehlerhaften Eingabe scheitert.

## Lokal prüfen

```sh
npm run import-report
npm test
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Der Importbericht soll mit **Hinweise (0)** enden; mit Hinweisen bricht `npm run build` ab. Wenn du Quellen änderst, führe zusätzlich `npm run quellen-pruefen` mit Internetzugang aus. Eine HTTP-Antwort belegt die Erreichbarkeit. Prüfe die Aussage selbst anhand der genannten Fundstelle. Für Darstellungsänderungen kontrolliere die betreffende Seite in der Pages-Vorschau auf Desktop und Handy, hell und dunkel. Die Befehle und Beispiele für Edge stehen in der [Browserprüfung](.claude/skills/app-pruefen/SKILL.md).

## Pull Request

Nenne betroffene Aufgaben- oder Karten-IDs, den Grund der Änderung, Quelle und Lösungsprüfung. Trage die tatsächlich ausgeführten Befehle mit Ergebnis ein und verlinke bei sichtbaren Änderungen passende Screenshots. Die CI prüft die mitgelieferten Inhalte zusammen mit Tests, Lint und Pages-Build. Der Lernstand aus `data/` und private Konfiguration gehören ausschließlich auf den eigenen Rechner.
