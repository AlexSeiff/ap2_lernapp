# Verbesserungen – Durchsicht vom 24.10.2026

Durchgesehen: alle Hauptseiten im Browser (hell/dunkel, Desktop/Handy), Code von Karteikarten, „Heute lernen“, Übersicht, sowie die
1.548 Karteikarten (`AP2_FIDPA_Lernkarten.json`, `AP2_Fachbegriffe_Lernkarten.json`) per Skript und Stichprobe.

Legende: ✅ in dieser Runde erledigt · 🔴 wichtig · 🟡 sinnvoll · ⚪ nice to have

---

## 1. In dieser Runde umgesetzt

- ✅ **Kartenstand** (`#/karteikarten/stand`, Lernen → Kartenstand): alle bewerteten Karten nach der letzten Bewertung –
  *gewusst*, *unsicher*, *nicht gewusst* – mit Verteilungsbalken, Filter nach Thema, Suche, Sortierung (Thema / am längsten fällig /
  niedrigstes Fach), aufklappbarer Antwort, Stern, und „X Karten lernen“ bzw. „Durchblättern“ für genau diese Gruppe.
  Kurzfassung als Widget auf der Übersicht und als Leiste auf der Karteikarten-Seite; nach jeder Runde ein Link „Zum Kartenstand“.
  Kein neues Datenformat: nutzt `CardState.last`, das schon bei jeder Bewertung gespeichert wird.
- ✅ **Mehr Farbe**: Palette aus 10 Farben (hell + dunkel, Text-Kontrast ≥ 4,5:1), Bereichsfarben (Lernen Indigo, Glossar Türkis,
  SQL Orange, Einstellungen Schiefer), Einstieg „Weiterlernen“ als Farbverlauf, Widget-Icons in farbigen Quadraten,
  Themen-Kacheln je Deep Dive mit eigener Farbe und Kartenbalken, Karteikarten mit Farbstreifen je Kartentyp, farbige Kennzahlen.
- ✅ **Übersicht zählte neue Karten als „fällig“** („Karteikarten fällig 1504“, auf der Karteikarten-Seite aber 182). Jetzt
  „182 · 1322 neu“ (`faellig()` in `lib/uebersicht.ts` trennt `karten` und `kartenNeu`).
- ✅ **Dunkelmodus: Bewertungsknöpfe kaum lesbar** – weiße Schrift auf hellem Grün (`--good` = #4cd471) hatte 1,9:1 Kontrast.
  Jetzt feste dunkle Füllungen in beiden Modi.
- ✅ **Handy: Bereichsnamen unter den Ringen** („Prozessanalyse“, „Datenqualität“) liefen ineinander.
- ✅ Handy: die drei Kennzahlen der Karteikarten-Seite standen 2 + 1 (eine verwaist), jetzt in einer Reihe.

## 2. Logik & Bedienung

- ✅ **„Heute lernen“ hält die gewählte Dauer ein** (behoben): Aufgaben nur, wenn sie neben Fehlerjournal und Übungen in die
  Zeit passen, sonst eine kleinere bzw. das nächste Thema; falsch gelöste Übungen haben Vorrang vor einer zweiten neuen Aufgabe;
  Kartenblöcke mit genauen Minuten. 20 min plant jetzt höchstens ~22,5 statt bis zu 42 min. Anzeige „neue Aufgabe“ statt
  fälschlich zweimal „schwächstes Thema“.
- 🟡 **Lernplan-Ziel unrealistisch**: „1196 Karten fehlen – etwa 42 Karten pro Tag“, die Tagesrunde bringt aber nur ~5 Karten.
  Entweder die Kartenmenge in „Heute lernen“ am Lernplan ausrichten oder das Ziel auf prüfungsrelevante Decks begrenzen
  (Begriffskarten optional).
- 🟡 **Prüferfragen/Fachgespräch ausgeschaltet** → ihre Bewertungen (aktuell 29 Karten) verschwinden aus allen Zahlen. Der
  Kartenstand weist jetzt darauf hin; die Übersicht und die Karteikarten-Seite sagen es noch nicht.
- 🟡 **Leicht-Modus ohne einen einzigen geprüften `mc`-Block**: Beide Kartendateien haben 0 `mc`-Blöcke – alle falschen Antworten
  sind automatisch. Für die Fallen-Karten (120) lohnen sich handgeschriebene Distraktoren am meisten (`npm run mc-entwurf -- --deck …`).
  Die README klingt, als gäbe es schon welche.
- ⚪ Kartenstand: „unsicher“ wird im Leicht-Modus nie vergeben (richtig → gewusst, falsch → nicht). Das ist gewollt, könnte aber in
  der Runde selbst kurz erwähnt werden.
- ⚪ Lange Kartenlisten per URL (`?karten=ID,ID,…`): bei „Alle 700 gewusst lernen“ wird die Adresse ~6 KB lang. Funktioniert, ist aber
  unschön beim Teilen. Alternative: `?stand=gewusst&thema=…` direkt in `useCardFilters` auswerten.

## 3. Fragen und Antwortformat der Karten

Insgesamt gut: Fragen sind fast immer als Frage formuliert, Antworten nennen das *Warum*, Längen passen (Median 207 Zeichen, keine
über 460), Typen sind sinnvoll verteilt (wissen 317, falle 120, abgrenzung 118, anwendung 118, rechnung 59). Auffällig:

- 🔴 **Doppelte Karte**: `WS5-002` und `AWI-032` fragen wortgleich „Was kennzeichnet die soziale Marktwirtschaft?“ mit leicht
  anderer Antwort. Eine umformulieren (z. B. AWI-032 als Abgrenzung: „Worin unterscheidet sich die soziale Marktwirtschaft von der
  Zentralverwaltungswirtschaft?“ – passt zu ihrem Typ `abgrenzung`).
- 🟡 **Zwei Ideen auf einer Karte** (schwer ehrlich mit gewusst/unsicher zu bewerten):
  - `ALP-023` Runden **und** Taschenrechner-Regeln → Taschenrechner-Satz streichen oder eigene Karte.
  - `ITS-025` „Gilt das Maximumprinzip immer? Was sind Kumulations- und Verteilungseffekt?“ → zwei Karten.
- 🟡 **Lange Aufzählungen** (30 Karten mit ≥ 7 Elementen, z. B. `SQL-014`, `PRZ-035` sieben Verschwendungsarten, `WS1-005`,
  `ALP-021`): Wer 5 von 7 weiß – gewusst oder unsicher? Vorschlag: Frage auf das prüfungsübliche Maß zuschneiden
  („*Nenne* vier …“, wie im IHK-Operator), die Antwort darf alle nennen. Oder eine Merkhilfe ergänzen.
- 🟡 **Frage ohne Kontext**: `PRJ-007` „Wie baust du die Präsentation auf?“ – welche? Besser „… die Projektpräsentation im Fachgespräch …“.
- ⚪ **Rechenkarten mit Mini-Antwort**: `PRZ-075` Antwort nur „54 ÷ 240 × 100 = 22,5 %“ (der Rechenweg ist da, aber ohne Satz, *was*
  die Zahl bedeutet). Bei Beurteilen-Aufgaben kostet genau das Punkte – ein Deutungssatz pro Rechenkarte würde das üben.
- ⚪ Begriffskarten mit sehr knapper Erklärung: `FB-trainingsdaten` („Daten, aus denen das Modell lernt.“), `FB-fehlerquote`
  (nur Formel). Ein Halbsatz zur Abgrenzung (Trainings- vs. Testdaten) macht sie prüfungstauglicher.
- ⚪ „Stand 2026“-Werte (`WS1-025` Mindestausbildungsvergütung 724 € usw.) vor der Prüfung am 25.11. noch einmal gegenprüfen.

## 4. Gestaltung (weitere Ideen)

- 🟡 Die Unterleiste „Lernen“ hat 11 Einträge und scrollt auf dem Desktop schon seitlich (Fehlerjournal, Podcast, Fachgespräch sind
  rechts abgeschnitten). Gruppieren: *Lernen* (Heute, Themen, Karteikarten, Kartenstand) · *Üben* (Aufgaben, Rechnen, Diagramme,
  Klausur) · *Wiederholen* (Fehlerjournal) · *Hören & Sprechen* (Podcast, Fachgespräch) – z. B. als zweite Ebene oder Trenner.
- 🟡 Die Karteikarten-Seite ist lang, bevor man lernen kann (Moduswahl, 7 Filter, Kennzahlen, 4 Knöpfe, Hinweise, Deck-Tabelle).
  „Lernen starten“ ganz nach oben, Filter standardmäßig zugeklappt (wie auf dem Handy).
- ⚪ Prüfungsbereich-Ringe zeigen bei < 2 % nur Punkte – ein Prozentwert in der Ringmitte wäre aussagekräftiger.
- ⚪ Themen-Kacheln könnten zusätzlich Klausur-Bestwert oder Lernziel-Fortschritt zeigen (die Daten liegen in `topicStats`).
- ⚪ Ein „Konfetti“-Moment beim Erreichen von Fach 5 oder nach einer Runde ohne „nicht gewusst“ (respektiert `prefers-reduced-motion`).
