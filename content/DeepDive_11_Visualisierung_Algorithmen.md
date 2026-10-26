# Deep Dive 11: Datenvisualisierung & Algorithmen
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Dieser Deep Dive bündelt zwei Themen, die in beiden schriftlichen Prüfungsbereichen auftauchen und beide **zeichnerisch bzw. schreibend** geprüft werden – also Aufgabentypen, bei denen man üben muss statt nur zu lesen.

**Visualisierung:** Diagrammtyp begründet auswählen, ein gegebenes Diagramm kritisch beurteilen, Manipulationen erkennen, ein Dashboard konzipieren. Der Aufgabentyp „Beurteilen Sie die folgende Darstellung" ist ein Dauerbrenner.

**Algorithmen:** Struktogramm oder Programmablaufplan erstellen, Pseudocode ergänzen, Fehler in gegebenem Pseudocode finden. Geprüft wird **algorithmisches Denken**, nicht eine konkrete Programmiersprache – Syntaxfehler kosten keine Punkte, Logikfehler schon.

Szenario: **Möbelhaus Nordholz GmbH**.

---

# TEIL A – DATENVISUALISIERUNG

## A1 – Den richtigen Diagrammtyp wählen

Die Wahl folgt **immer der Aussageabsicht**, nie dem Geschmack. Vier Grundfragen:

| Aussageziel | Diagrammtyp | Hinweise |
|---|---|---|
| **Entwicklung über die Zeit** | Liniendiagramm | Zeit immer auf die x-Achse; bei wenigen Zeitpunkten auch Säulen |
| **Vergleich von Kategorien** | Balken- oder Säulendiagramm | Balken (waagerecht) bei langen Kategorienamen; absteigend sortieren |
| **Verteilung eines Merkmals** | Histogramm, Boxplot | Histogramm zeigt die Form, Boxplot vergleicht mehrere Gruppen |
| **Zusammenhang zweier Merkmale** | Streudiagramm | unabhängige Größe auf die x-Achse (→ Deep Dive 4) |
| **Anteile am Ganzen** | Kreisdiagramm, gestapelte Balken | nur bei wenigen Kategorien (Faustregel: maximal fünf) |
| **Muster in einer Matrix** | Heatmap | z. B. Umsatz je Filiale und Monat |
| **Rangfolge** | sortiertes Balkendiagramm | schlägt jedes Kreisdiagramm |

**Wann kein Kreisdiagramm?** Sobald mehr als etwa fünf Segmente auftreten, Anteile verglichen werden sollen oder sich die Werte ähneln – Winkelflächen kann das Auge deutlich schlechter vergleichen als Balkenlängen. Ein Kreisdiagramm eignet sich nur, wenn eine grobe Aussage wie „mehr als die Hälfte" genügt.

**Regel für Zeitreihen:** Liniendiagramme verbinden Datenpunkte und suggerieren damit einen stetigen Verlauf. Bei kategorialen Daten (Umsatz je Filiale) ist diese Verbindung sachlich falsch – dort gehören Säulen hin.

## A2 – Gestaltungsregeln

- **Achsenbeschriftung mit Einheit**, immer. Ein Diagramm ohne Einheit ist wertlos.
- **Nullpunkt bei Balken- und Säulendiagrammen zwingend** – die Länge codiert den Wert. Bei Liniendiagrammen ist ein beschnittener Ausschnitt vertretbar, muss aber gekennzeichnet sein.
- **Sparsam mit Farben:** Farbe soll Bedeutung tragen, nicht dekorieren. Eine Hervorhebungsfarbe plus Grautöne wirkt fast immer besser als eine Regenbogenpalette.
- **Sortieren** statt alphabetisch belassen – die Reihenfolge ist selbst eine Information.
- **Keine 3D-Effekte, keine Schatten, keine doppelten Y-Achsen** – alle drei verzerren die Wahrnehmung.
- **Beschriftung direkt am Element** statt in einer entfernten Legende, wo möglich.
- **Barrierefreiheit:** Rund 8 % der Männer haben eine Rot-Grün-Schwäche. Informationen nie allein über Farbe codieren – zusätzlich Form, Muster oder Beschriftung verwenden.
- **Farbskala passend zum Datentyp:** qualitativ (klar unterscheidbare Farbtöne) für Kategorien, sequenziell (hell → dunkel in einem Farbton) für geordnete Werte wie in der Heatmap, divergierend (zwei Farbtöne mit neutraler Mitte) für Abweichungen von einem Bezugswert, z. B. Ist gegen Plan.
- **Data-Ink-Ratio** nach Edward Tufte: Anteil der „Tinte“, die tatsächlich Daten zeigt, an der gesamten Tinte des Diagramms – möglichst hoch. Alles, was keine Information trägt (Hintergrundbilder, dicke Gitternetzlinien, Rahmen, 3D, Schatten), ist **Chartjunk** und wird entfernt.

## A3 – Manipulation erkennen

Das ist der prüfungsrelevanteste Teil. Die häufigsten Techniken:

| Technik | Wirkung |
|---|---|
| **Abgeschnittene y-Achse** bei Balken | Kleine Unterschiede erscheinen dramatisch |
| **Gestauchte oder gedehnte Achse** | Trends wirken flach oder steil |
| **3D-Darstellung** | vordere Segmente erscheinen größer |
| **Zwei Y-Achsen mit unterschiedlicher Skalierung** | erzeugt Scheinzusammenhänge zwischen unabhängigen Größen |
| **Ungleiche Klassenbreiten** | verzerrt Häufigkeitsverteilungen |
| **Auswahl des Zeitausschnitts** | Ein günstig gewählter Startpunkt macht aus einem Rückgang einen Anstieg |
| **Prozent statt Prozentpunkte** | → Deep Dive 4 |

**Durchgerechnetes Beispiel:** Umsätze 4,80 · 4,95 · 5,10 Mio. € in drei Jahren.
Tatsächliches Wachstum: +3,13 %, dann +3,03 %, insgesamt **+6,25 %** – ein flacher, leicht steigender Verlauf.
Beginnt die y-Achse jedoch bei 4,70 Mio. €, betragen die sichtbaren Balkenhöhen 0,10 · 0,25 · 0,40. Das Verhältnis **1 : 2,5 : 4** suggeriert eine Vervierfachung. Die Zahlen stimmen, das Bild lügt.

**Prüfungsformulierung:** „Die y-Achse beginnt nicht bei null. Dadurch erscheinen die Unterschiede erheblich größer, als sie sind – der tatsächliche Zuwachs beträgt lediglich 6,25 %. Für Balkendiagramme ist ein Nullpunkt zwingend, da die Balkenlänge den Wert codiert."

**Lügenfaktor (Lie Factor)** nach Tufte – macht die Verzerrung messbar:
$\text{Lügenfaktor} = \frac{\text{Größe des Effekts in der Grafik}}{\text{Größe des Effekts in den Daten}}$
Im Beispiel wächst die sichtbare Säule von 0,10 auf 0,40, also um 300 %; die Daten wachsen um 6,25 %:
$\text{Lügenfaktor} = \frac{3{,}00}{0{,}0625}$ = **48** – die Grafik übertreibt den Zuwachs um das 48-Fache. Ein ehrliches Diagramm liegt bei etwa 1 (Tufte: zwischen 0,95 und 1,05).

## A4 – Dashboards

Ein Dashboard ist kein Diagrammfriedhof, sondern beantwortet **eine definierte Frage für eine definierte Zielgruppe**.

- **Zielgruppe zuerst:** Geschäftsführung braucht wenige verdichtete Kennzahlen mit Ampellogik; die Fachabteilung braucht Details und Filter.
- **Vergleichsmaßstab mitliefern:** Eine Zahl ohne Bezug ist keine Information. Immer Vorperiode, Plan-Wert oder Zielwert danebenstellen.
- **Wenige Kennzahlen:** Faustregel fünf bis sieben pro Sicht.
- **Wichtigstes links oben** – die übliche Leserichtung.
- **Einheitliche Skalen** bei nebeneinanderliegenden Diagrammen, sonst sind sie nicht vergleichbar.
- **Aktualitätsstempel:** Wann wurden die Daten zuletzt geladen? Ohne diese Angabe weiß niemand, worauf er schaut.

## A5 – Softwareergonomie, Barrierefreiheit und Prototypen

**Gebrauchstauglichkeit** (Usability, ISO 9241-11) heißt: Nutzer erreichen ihre Ziele **effektiv** (vollständig und richtig), **effizient** (mit angemessenem Aufwand) und **zufriedenstellend**.

**Die sieben Interaktionsprinzipien der ISO 9241-110** – mit Dashboard-Beispiel:

| Prinzip | Bedeutung | Beispiel |
|---|---|---|
| **Aufgabenangemessenheit** | unterstützt die Aufgabe ohne unnötige Schritte | Monatsauswahl mit einem Klick statt Datumsformular |
| **Selbstbeschreibungsfähigkeit** | jederzeit klar, wo man ist und was möglich ist | Titel, Einheiten und aktiver Filter sichtbar |
| **Erwartungskonformität** | verhält sich wie gewohnt und einheitlich | Rot bedeutet überall „schlecht“, Bedienelemente immer an derselben Stelle |
| **Erlernbarkeit** | leicht zu erlernen | Hilfetexte und Tooltips zu jeder Kennzahl |
| **Steuerbarkeit** | Nutzer bestimmt Ablauf und Tempo | Filter zurücksetzen, Ansicht wechseln, Export abbrechen |
| **Robustheit gegen Benutzungsfehler** | Fehler werden verhindert oder leicht korrigiert | ungültiger Zeitraum wird abgefangen statt leerer Grafik |
| **Benutzerbindung** | motiviert zur weiteren Nutzung | übersichtliche, ansprechende Gestaltung |

Achtung bei älteren Unterlagen: Die bis 2020 gültige Fassung (ISO 9241-110:2006) nannte noch Individualisierbarkeit, Lernförderlichkeit und Fehlertoleranz. Seit der Neufassung 2020 heißen die Prinzipien wie in der Tabelle – Individualisierbarkeit ist entfallen, Benutzerbindung neu hinzugekommen.

**Barrierefreiheit:** Das Angebot muss auch für Menschen mit Einschränkungen nutzbar sein – Grundlage sind die **WCAG** (Web Content Accessibility Guidelines) mit den vier Prinzipien **wahrnehmbar, bedienbar, verständlich, robust**. Öffentliche Stellen sind über die **BITV 2.0** verpflichtet, viele Unternehmen mit Angeboten für Verbraucher seit dem 28. Juni 2025 über das **Barrierefreiheitsstärkungsgesetz (BFSG)**. Aktuelle Fassung der Richtlinien ist WCAG 2.2 (Stand 2026). Für Diagramme und Dashboards heißt das konkret:
- Information **nie nur über Farbe** vermitteln (rund 8 % der Männer haben eine Rot-Grün-Sehschwäche) – zusätzlich Beschriftung, Symbol oder Muster
- ausreichender **Kontrast** (für normalen Text mindestens 4,5 : 1, für große Schrift sowie Diagrammlinien, Balken und Bedienelemente mindestens 3 : 1)
- **Alternativtexte** bzw. eine Datentabelle zu jeder Grafik für Screenreader
- vollständige Bedienbarkeit **per Tastatur**, skalierbare Schrift

Vom Entwurf zum Prototyp: Ein **Wireframe** ist eine grobe Skizze der Anordnung (Kästen statt Diagramme), ein **Mock-up** ein statischer, realistisch gestalteter Entwurf, ein **Prototyp** ist bereits klickbar. Wer früh einen Mock-up mit dem Fachbereich bespricht, findet Missverständnisse, bevor eine Zeile SQL geschrieben ist – die beste und billigste Qualitätssicherung (→ Deep Dive 16). Bewertet werden Entwürfe im **Usability-Test**: echte Nutzer lösen typische Aufgaben, man beobachtet, wo sie stocken.

---

# TEIL B – ALGORITHMEN UND PSEUDOCODE

## B1 – Die drei Kontrollstrukturen

Jeder Algorithmus lässt sich aus drei Bausteinen aufbauen:

1. **Sequenz** – Anweisungen nacheinander
2. **Verzweigung** (Selektion) – einseitig (WENN), zweiseitig (WENN-SONST), mehrfach (FALLUNTERSCHEIDUNG)
3. **Wiederholung** (Iteration) – kopfgesteuert (SOLANGE), fußgesteuert (WIEDERHOLE-BIS), zählergesteuert (FÜR)

**Kopf- oder fußgesteuert?** Die kopfgesteuerte Schleife prüft **vor** dem ersten Durchlauf – sie kann also **nullmal** ausgeführt werden. Die fußgesteuerte prüft **danach** und läuft daher **mindestens einmal**. Diese Unterscheidung ist eine klassische Prüfungsfrage.

## B2 – Struktogramm (Nassi-Shneiderman)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 330" width="580" height="330" role="img" aria-label="Struktogramm-Bausteine nach DIN 66261: Sequenz, Verzweigung mit ja und nein, kopfgesteuerte und fußgesteuerte Schleife">
<rect x="20" y="20" width="380" height="290" class="dg-form"/>
<text x="30" y="35" text-anchor="start" dominant-baseline="middle">Anweisung 1</text>
<line x1="20" y1="50" x2="400" y2="50" class="dg-linie"/>
<text x="30" y="65" text-anchor="start" dominant-baseline="middle">Anweisung 2</text>
<line x1="20" y1="80" x2="400" y2="80" class="dg-linie"/>
<text x="418" y="50" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Sequenz</text>
<line x1="20" y1="80" x2="210" y2="120" class="dg-linie"/>
<line x1="400" y1="80" x2="210" y2="120" class="dg-linie"/>
<text x="210" y="92" text-anchor="middle" dominant-baseline="middle">Bedingung?</text>
<text x="30" y="112" text-anchor="start" dominant-baseline="middle" class="dg-klein">ja</text>
<text x="390" y="112" text-anchor="end" dominant-baseline="middle" class="dg-klein">nein</text>
<line x1="20" y1="120" x2="400" y2="120" class="dg-linie"/>
<line x1="210" y1="120" x2="210" y2="170" class="dg-linie"/>
<text x="115" y="145" text-anchor="middle" dominant-baseline="middle">Zweig A</text>
<text x="305" y="145" text-anchor="middle" dominant-baseline="middle">Zweig B</text>
<line x1="20" y1="170" x2="400" y2="170" class="dg-linie"/>
<text x="418" y="125" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Verzweigung</text>
<text x="30" y="185" text-anchor="start" dominant-baseline="middle" class="dg-fett">SOLANGE Bedingung</text>
<line x1="50" y1="200" x2="400" y2="200" class="dg-linie"/>
<line x1="50" y1="200" x2="50" y2="240" class="dg-linie"/>
<text x="60" y="220" text-anchor="start" dominant-baseline="middle">Schleifenrumpf</text>
<line x1="20" y1="240" x2="400" y2="240" class="dg-linie"/>
<text x="418" y="205" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">kopfgesteuerte Schleife</text>
<line x1="50" y1="240" x2="50" y2="280" class="dg-linie"/>
<text x="60" y="260" text-anchor="start" dominant-baseline="middle">Schleifenrumpf</text>
<line x1="50" y1="280" x2="400" y2="280" class="dg-linie"/>
<text x="30" y="295" text-anchor="start" dominant-baseline="middle" class="dg-fett">WIEDERHOLE BIS Bedingung</text>
<text x="418" y="275" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">fußgesteuerte Schleife</text>
</svg>
```

**Merkmale:** Struktogramme sind in **DIN 66261** genormt, blockorientiert und erzwingen strukturierte Programmierung – beliebige Sprünge (GOTO) sind nicht darstellbar; vorgesehen ist allenfalls ein geregelter Aussprung (Abbruch) aus einem Block. Nachteil: Änderungen sind aufwendig, und tiefe Verschachtelungen werden sehr schmal.

Weitere Sinnbilder: Die **Zählschleife** (FÜR i VON 1 BIS n) wird wie die kopfgesteuerte Schleife gezeichnet, die **Fallauswahl** (Mehrfachverzweigung) als Block mit mehreren Spalten unter einem gemeinsamen Kopf, der **Unterprogrammaufruf** als Rechteck mit doppelten seitlichen Linien. Jeder Block hat genau einen Eingang oben und einen Ausgang unten.

## B3 – Programmablaufplan (PAP) – die Symbole

| Symbol | Bedeutung |
|---|---|
| Oval / abgerundetes Rechteck | Start und Ende |
| Rechteck | Verarbeitung/Anweisung |
| **Raute** | Verzweigung (Bedingung), mit ja/nein beschriftet |
| Parallelogramm | Eingabe/Ausgabe |
| Rechteck mit doppelten seitlichen Linien | Unterprogramm (Aufruf eines an anderer Stelle beschriebenen Ablaufs) |
| Kreis | Übergangsstelle (Konnektor), verbindet Teile eines Plans über Seitengrenzen hinweg |
| Pfeil | Ablaufrichtung |

Die Sinnbilder sind in **DIN 66001** genormt. Schleifen gibt es im PAP nicht als eigenes Symbol – sie entstehen durch eine Raute und einen Pfeil zurück zu einer früheren Stelle.

**Unterschied zum Struktogramm:** Der PAP kann Sprünge darstellen und wird daher schnell unübersichtlich; er zeigt den Kontrollfluss aber anschaulicher.

## B4 – Pseudocode-Konventionen

Es gibt keine verbindliche Norm – wichtig ist **Eindeutigkeit und Einrückung**. Bewährte Schreibweise für die Prüfung:

```
ALGORITHMUS Ausreisser_zaehlen
EINGABE: liste[1..n], mittelwert, standardabweichung
AUSGABE: anzahl

anzahl ← 0
untere_grenze ← mittelwert - 3 * standardabweichung
obere_grenze  ← mittelwert + 3 * standardabweichung

FÜR i VON 1 BIS n
    WENN liste[i] < untere_grenze ODER liste[i] > obere_grenze DANN
        anzahl ← anzahl + 1
    ENDE WENN
ENDE FÜR

AUSGABE anzahl
```

**Vier Regeln, die Punkte sichern:**
1. **Initialisierung nicht vergessen** – Zähler und Summen vor der Schleife auf 0 setzen.
2. **Ein- und Ausgabe benennen.**
3. **Blöcke sauber schließen** (ENDE WENN, ENDE FÜR) und konsequent einrücken.
4. **Zuweisung und Vergleich unterscheiden:** `←` oder `:=` weist zu, `=` vergleicht.

## B5 – Die Standardalgorithmen

Diese Muster decken die meisten Prüfungsaufgaben ab:

| Aufgabe | Kern |
|---|---|
| **Summe bilden** | `summe ← 0` vor der Schleife, in der Schleife `summe ← summe + wert` |
| **Zählen mit Bedingung** | `anzahl ← 0`, in der Schleife `WENN Bedingung DANN anzahl ← anzahl + 1` |
| **Mittelwert** | Summe und Anzahl bilden, danach teilen – **mit Division-durch-null-Prüfung** |
| **Maximum suchen** | `max ← liste[1]`, dann `WENN liste[i] > max DANN max ← liste[i]` |
| **Prüfen und protokollieren** | je Datensatz Regeln prüfen, Fehlerzähler erhöhen, fehlerhaften Satz ausgeben |

⚠️ **Der Maximum-Klassiker:** `max ← 0` funktioniert nur, wenn mindestens ein Wert ≥ 0 ist. Sind alle Werte negativ, wird 0 ausgegeben – ein Wert, der gar nicht in der Liste steht. Richtig ist die Initialisierung mit dem **ersten Listenelement**.

## B6 – Typische Logikfehler (Fehlersuche-Aufgaben)

| Fehler | Symptom |
|---|---|
| Zähler/Summe nicht initialisiert | undefiniertes oder falsches Ergebnis |
| Initialisierung **innerhalb** der Schleife | Wert wird bei jedem Durchlauf zurückgesetzt |
| **Off-by-one:** `BIS n-1` statt `BIS n` | letzter Datensatz wird nicht geprüft |
| Abbruchbedingung wird nie erreicht | Endlosschleife |
| `=` statt `←` (oder umgekehrt) | Vergleich statt Zuweisung |
| UND statt ODER bei Bereichsprüfungen | Bedingung kann nie wahr werden (umgekehrt ODER statt UND: immer wahr) |
| Division ohne Nullprüfung | Laufzeitfehler bei leerer Liste |
| NULL-Werte nicht behandelt | fehlende Werte gehen als 0 in die Summe ein |

Der letzte Punkt ist der fachlich wichtigste für deine Fachrichtung: **Ein fehlender Wert ist nicht null.** Wer NULL als 0 mitrechnet, verfälscht jeden Mittelwert (→ Deep Dive 9).

## B7 – Suchen, Sortieren und Rekursion

**Aufwand (Komplexität)** beschreibt, wie die Zahl der Rechenschritte mit der Datenmenge n wächst – angegeben in der **O-Notation**. Konstante Faktoren fallen weg, es zählt nur die Größenordnung: Bei n = 1.000 Datensätzen braucht ein Verfahren mit O(n²) rund 1.000.000 Vergleiche, eines mit O(n log n) nur rund 10.000.

| Verfahren | Prinzip | bester Fall | mittlerer Fall | schlechtester Fall | stabil |
|---|---|---|---|---|---|
| **Lineare Suche** | von vorn nach hinten jedes Element prüfen; Liste darf unsortiert sein | O(1) | O(n) | O(n) | – |
| **Binäre Suche** | Mitte prüfen, dann nur in der passenden Hälfte weitersuchen; Liste muss sortiert sein | O(1) | O(log n) | O(log n) | – |
| **Bubble Sort** | benachbarte Elemente vergleichen und bei falscher Reihenfolge tauschen | O(n) mit Abbruch, wenn nichts mehr getauscht wird | O(n²) | O(n²) | ja |
| **Selection Sort** | kleinstes Element des unsortierten Rests suchen und nach vorn tauschen | O(n²) | O(n²) | O(n²) | nein |
| **Insertion Sort** | jedes Element in den bereits sortierten Teil einfügen (wie Spielkarten) | O(n) bei fast sortierten Daten | O(n²) | O(n²) | ja |
| **Merge Sort** | Liste halbieren, Hälften rekursiv sortieren, sortiert zusammenführen; braucht zusätzlichen Speicher | O(n log n) | O(n log n) | O(n log n) | ja |
| **Quicksort** | Pivotelement wählen, in „kleiner“ und „größer“ aufteilen, Teile rekursiv sortieren | O(n log n) | O(n log n) | O(n²) bei ungünstigem Pivot, z. B. erstes Element einer bereits sortierten Liste | nein |

Ein **stabiles Sortierverfahren** lässt gleiche Schlüssel in ihrer ursprünglichen Reihenfolge – wichtig, wenn man erst nach Datum und dann stabil nach Filiale sortiert und die Datumsreihenfolge innerhalb jeder Filiale erhalten bleiben soll. Merge Sort und Quicksort arbeiten nach dem Prinzip **Teile und herrsche** (Divide and Conquer).

**Bubble Sort in Pseudocode** (mit fußgesteuerter Schleife und Abbruch, sobald ein Durchlauf ohne Tausch bleibt):

```
ALGORITHMUS BubbleSort
EINGABE: liste[1..n]
AUSGABE: liste aufsteigend sortiert

ende ← n - 1
WIEDERHOLE
    getauscht ← FALSCH
    FÜR j VON 1 BIS ende
        WENN liste[j] > liste[j+1] DANN
            tausche liste[j] und liste[j+1]
            getauscht ← WAHR
        ENDE WENN
    ENDE FÜR
    ende ← ende - 1
BIS getauscht = FALSCH ODER ende = 0
```

Durchgespielt mit den Lieferzeiten 5 · 3 · 8 · 1 (Tage):

| Durchlauf | Vergleiche | Liste danach |
|---|---|---|
| 1 | 5/3 tauschen, 5/8 bleibt, 8/1 tauschen | 3 · 5 · 1 · 8 |
| 2 | 3/5 bleibt, 5/1 tauschen | 3 · 1 · 5 · 8 |
| 3 | 3/1 tauschen | 1 · 3 · 5 · 8 |

Nach jedem Durchlauf steht das größte noch unsortierte Element („die größte Blase“) am Ende. Insgesamt 3 + 2 + 1 = 6 Vergleiche und 4 Vertauschungen; allgemein braucht Bubble Sort im schlechtesten Fall n · (n − 1) / 2 Vergleiche. Eine bereits sortierte Liste ist nach einem einzigen Durchlauf ohne Tausch erledigt.

**Binäre Suche in Pseudocode:**

```
ALGORITHMUS BinaereSuche
EINGABE: liste[1..n] aufsteigend sortiert, gesucht
AUSGABE: position (0 = nicht gefunden)

links    ← 1
rechts   ← n
position ← 0
SOLANGE links <= rechts UND position = 0
    mitte ← (links + rechts) DIV 2
    WENN liste[mitte] = gesucht DANN
        position ← mitte
    SONST WENN liste[mitte] < gesucht DANN
        links ← mitte + 1
    SONST
        rechts ← mitte - 1
    ENDE WENN
ENDE SOLANGE

AUSGABE position
```

Durchgespielt mit der sortierten Liste 12 · 19 · 23 · 31 · 42 · 57 · 64 · 78, gesucht 57:

| Schritt | links | rechts | mitte | liste[mitte] | Entscheidung |
|---|---|---|---|---|---|
| 1 | 1 | 8 | 4 | 31 | 31 < 57 → rechts weitersuchen, links ← 5 |
| 2 | 5 | 8 | 6 | 57 | gefunden, position ← 6 |

Bei acht Elementen braucht die binäre Suche höchstens vier Vergleiche. Da sich der Suchbereich je Schritt halbiert, reichen bei 1.000.000 sortierten Datensätzen höchstens 20 Vergleiche (2 hoch 20 = 1.048.576) – die lineare Suche braucht im schlechtesten Fall 1.000.000. Genau diesen Effekt nutzt ein Datenbankindex.

**Rekursion:** Eine Funktion ruft sich selbst mit einem kleineren Teilproblem auf. Pflicht ist eine **Abbruchbedingung** (Basisfall), sonst ruft sich die Funktion endlos auf, bis der Aufrufstapel überläuft (Stack Overflow).

```
FUNKTION fakultaet(n)
    WENN n <= 1 DANN
        RÜCKGABE 1                       // Basisfall
    SONST
        RÜCKGABE n * fakultaet(n - 1)    // rekursiver Aufruf
    ENDE WENN
ENDE FUNKTION
```

fakultaet(4) = 4 · fakultaet(3) = 4 · 3 · fakultaet(2) = 4 · 3 · 2 · fakultaet(1) = 4 · 3 · 2 · 1 = 24. Jede Rekursion lässt sich auch als Schleife (iterativ) schreiben; die rekursive Form ist oft kürzer, verbraucht aber für jeden offenen Aufruf Speicher auf dem Stapel.

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Diagrammtyp gewählt, ohne die Aussageabsicht zu begründen.
2. Kreisdiagramm mit zu vielen Segmenten verwendet.
3. Beschnittene y-Achse bei einem Balkendiagramm nicht beanstandet.
4. Achsen ohne Einheit beschriftet.
5. Zähler oder Summe im Pseudocode nicht initialisiert.
6. Kopf- und fußgesteuerte Schleife verwechselt.
7. Maximum mit 0 statt mit dem ersten Element initialisiert.
8. Fehlende Werte im Algorithmus wie Nullen behandelt.

---

# Übungsklausur Visualisierung & Algorithmen (100 Punkte, 90 Minuten)

Bearbeite die Klausur **am Ende des Themas** am Stück, handschriftlich, mit Lineal.

## Block A – Diagrammwahl (20 P)

**A1 (12 P):** *Ordnen* Sie den folgenden sechs Auswertungswünschen jeweils einen geeigneten Diagrammtyp zu und *begründen* Sie die Wahl kurz:
(a) Monatsumsatz der letzten 24 Monate · (b) Umsatzvergleich der acht Filialen · (c) Verteilung der Reparaturdauern · (d) Zusammenhang zwischen Werbebudget und Umsatz · (e) Anteil der vier Produktkategorien am Gesamtumsatz · (f) Umsatz je Filiale und Monat in einer Übersicht

**A2 (8 P):** Ein Kollege stellt den Umsatz der acht Filialen als Kreisdiagramm mit 3D-Effekt dar, alphabetisch sortiert. *Benennen* Sie drei Mängel und *schlagen* Sie eine bessere Darstellung mit Begründung *vor*.

## Block B – Diagramme beurteilen (22 P)

**B1 (12 P):** Ein Bericht zeigt ein Säulendiagramm der Jahresumsätze 4,80 / 4,95 / 5,10 Mio. €. Die y-Achse beginnt bei 4,70 Mio. €. Die Überschrift lautet „Umsatz explodiert".
a) *Berechnen* Sie das tatsächliche Gesamtwachstum in Prozent. (4 P)
b) *Erläutern* Sie, welchen Eindruck die gewählte Achse erzeugt und warum. (4 P)
c) *Beurteilen* Sie die Überschrift und *formulieren* Sie eine sachlich korrekte Alternative. (4 P)

**B2 (6 P):** *Nennen* Sie drei weitere Techniken, mit denen Diagramme irreführend gestaltet werden können, und *erläutern* Sie je die Wirkung.

**B3 (4 P):** *Erläutern* Sie, warum Informationen in Diagrammen nicht ausschließlich über Farbe codiert werden sollten, und *nennen* Sie zwei Alternativen.

## Block C – Dashboard konzipieren (14 P)

**C1 (8 P):** *Entwerfen* Sie ein Dashboard für die Geschäftsführung zur Überwachung des Reparaturservice. *Nennen* Sie vier Kennzahlen mit jeweils passender Darstellungsform und *begründen* Sie Ihre Auswahl.

**C2 (6 P):** *Nennen* Sie drei Gestaltungsgrundsätze für Dashboards und *erläutern* Sie, warum jede Kennzahl einen Vergleichsmaßstab benötigt.

## Block D – Algorithmen entwickeln (28 P)

**D1 (6 P):** *Erläutern* Sie den Unterschied zwischen kopf- und fußgesteuerter Schleife. *Geben* Sie für jede einen passenden Anwendungsfall an.

**D2 (12 P):** *Entwickeln* Sie einen Algorithmus in **Pseudocode**, der eine Liste von Reparaturdauern prüft. Der Algorithmus soll: alle Werte zählen, ungültige Werte (kleiner oder gleich 0 sowie fehlende Werte) separat zählen und nicht in die Berechnung einbeziehen, aus den gültigen Werten den Mittelwert berechnen und Anzahl gültiger Werte, Anzahl ungültiger Werte sowie den Mittelwert ausgeben. *Berücksichtigen* Sie den Fall, dass kein gültiger Wert vorhanden ist.

**D3 (10 P):** *Zeichnen* Sie ein **Struktogramm** für folgenden Ablauf: Für jeden Kundendatensatz wird geprüft, ob eine E-Mail-Adresse vorhanden ist. Fehlt sie, wird ein Fehlerzähler erhöht und der Datensatz protokolliert. Ist sie vorhanden, wird zusätzlich das Format geprüft; bei ungültigem Format wird ebenfalls der Fehlerzähler erhöht. Am Ende wird der Fehlerzähler ausgegeben.

## Block E – Fehlersuche (16 P)

Der folgende Pseudocode soll den höchsten Auftragswert einer Liste mit n Einträgen finden und die Anzahl der Aufträge über 1.000 € zählen. Er enthält **vier Fehler**.

```
ALGORITHMUS Auswertung
EINGABE: auftrag[1..n]

max ← 0

FÜR i VON 1 BIS n-1
    WENN auftrag[i] > max DANN
        max ← auftrag[i]
    ENDE WENN
    anzahl ← 0
    WENN auftrag[i] > 1000 UND auftrag[i] < 500 DANN
        anzahl ← anzahl + 1
    ENDE WENN
ENDE FÜR

AUSGABE max, anzahl
```

**E1 (12 P):** *Benennen* Sie die vier Fehler, *erläutern* Sie jeweils die Auswirkung und *geben* Sie die Korrektur an.

**E2 (4 P):** *Erläutern* Sie, warum die Initialisierung `max ← 0` auch dann problematisch bleibt, wenn alle übrigen Fehler behoben sind.

---

## Fachgespräch: typische Fragen des Ausschusses

1. „Warum haben Sie für diese Auswertung genau diesen Diagrammtyp gewählt?"
2. „An wen richtet sich Ihr Dashboard, und woher wissen Sie, dass es dort verstanden wird?"
3. „Welche Kennzahl würden Sie weglassen, wenn Sie nur drei zeigen dürften?"
4. „Wie haben Sie in Ihrer Auswertung mit fehlenden Werten gerechnet?"
5. „Beschreiben Sie den Ablauf Ihres Prüfskripts – was passiert Schritt für Schritt?"

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich wähle den Diagrammtyp begründet nach der Aussageabsicht.
- [ ] Ich kenne die Grenzen des Kreisdiagramms und die Regel zum Nullpunkt bei Balken.
- [ ] Ich erkenne mindestens fünf Manipulationstechniken und beschreibe ihre Wirkung.
- [ ] Ich konzipiere ein Dashboard zielgruppengerecht mit Vergleichsmaßstäben.
- [ ] Ich unterscheide kopf- und fußgesteuerte Schleifen sicher.
- [ ] Ich schreibe Pseudocode mit Initialisierung, sauberen Blöcken und Randfallprüfung.
- [ ] Ich zeichne Struktogramme mit Sequenz, Verzweigung und Schleife.
- [ ] Ich finde Logikfehler in gegebenem Pseudocode, insbesondere Off-by-one und fehlende Initialisierung.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
- [ ] Ich wende die Interaktionsprinzipien der ISO 9241-110 und die Regeln der Barrierefreiheit auf ein Dashboard an.
- [ ] Ich spiele Bubble Sort und die binäre Suche Schritt für Schritt durch und ordne Such- und Sortierverfahren ihren Aufwand in O-Notation zu.
