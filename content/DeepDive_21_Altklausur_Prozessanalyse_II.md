# Deep Dive 21: Altklausur-Training Prozessanalyse II
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Dieser Deep Dive baut eine **zweite echte Prüfung „Durchführen einer Prozessanalyse“** nach: vier Aufgaben mit 25, 25, 30 und 20 Punkten, 90 Minuten, ein Unternehmen für alle Aufgaben. Gegenüber Deep Dive 18 kommen vier Aufgabentypen dazu, die in der Prüfung viele Punkte bringen: das **UML-Aktivitätsdiagramm aus einer Tätigkeitsliste** (15 P), **SWOT und Ishikawa als Analysewerkzeuge**, die **Break-even-Analyse über Jahre mit Grafik** und der **Angebotsvergleich über die Nutzungsdauer** (13 P).

Das Muster der Prüfer: Jede Aufgabe beginnt mit einer Handlungssituation, und die Teilaufgaben verlangen, dass du **genau diese Situation** auswertest – „Methoden der Ist-Aufnahme“ allein bringen wenig, „Beobachtung der Warteschlange am Samstag mit Strichliste“ bringt den Punkt.

Szenario: **Möbelhaus Nordholz GmbH** – Warenausgabe, Kundenkarte und eine Abhol-App.

---

# Teil 1 – So ist die Klausur aufgebaut

| Merkmal | Wert |
|---|---|
| Zeit / Punkte | 90 Minuten, 100 Punkte, 4 Aufgaben (25 · 25 · 30 · 20) |
| Szenario | eine Ausgangssituation für alle Aufgaben, jede Aufgabe mit eigener Handlungssituation |
| Antwortformen | Linien, vorgegebene Tabellen (SWOT, Risiko-Tabelle), Diagrammgerüst (Ishikawa), Kästchenpapier für Grafik und Rechnung |
| Belegsatz | Notation für eEPK und Aktivitätsdiagramm liegt bei – die Symbole musst du nicht auswendig zeichnen, aber sicher anwenden |

**Punkte-Faustregel aus der Altklausur:** *Nennen* = 1 P je Angabe · *Beschreiben*/*Erläutern* = 2 P je Punkt (Aussage plus Wirkung oder Bezug zur Situation) · Modellierung 13–15 P · Rechnung mit Grafik 5 P, Angebotsvergleich 13 P.

---

# Teil 2 – UML-Aktivitätsdiagramm aus einer Tätigkeitsliste

## 2.1 Die Symbole

| Symbol | Bedeutung | Wann im Text? |
|---|---|---|
| ● gefüllter Kreis | **Startknoten** | „Der Kunde nennt …“ – der erste Schritt |
| ◉ Kreis mit Punkt | **Endknoten** – beendet **alle** Abläufe | Ende des Gesamtprozesses |
| ⊗ Kreis mit Kreuz | **Ablaufende** – beendet nur **diesen** Fluss | ein Zweig endet, der Rest läuft weiter („… der Ablauf endet für diesen Kunden“) |
| abgerundetes Rechteck | **Aktion** (Verb + Objekt: „Preis berechnen“) | jede Tätigkeit |
| Raute mit `[Bedingung]` | **Entscheidung** / **Zusammenführung** | „Ist … , dann …, sonst …“ |
| dicker Balken | **Teilung** (Fork) / **Synchronisation** (Join) | „währenddessen“, „gleichzeitig“, „parallel“ |
| Schwimmbahn | **Verantwortlicher** einer Aktion | „der Kunde …“, „der Mitarbeiter …“ |

## 2.2 Vorgehen in fünf Schritten

1. **Akteure markieren** → eine Schwimmbahn je Rolle (meist zwei: Kunde und Mitarbeiter).
2. **Tätigkeiten als Aktionen** übernehmen, kurz und mit Verb („Ausweis prüfen“).
3. **Signalwörter suchen:** „wenn/falls/im Zweifelsfall“ → Entscheidung mit Bedingungen in eckigen Klammern; „währenddessen/gleichzeitig“ → Fork und Join.
4. **Jede Entscheidung wieder zusammenführen** (Raute) oder den Zweig sauber beenden (Ablaufende/Endknoten).
5. **Kontrolle:** ein Start, jeder Pfad endet, jeder Fork hat einen Join, jede Aktion steht in der richtigen Bahn.

> ❓ **Prüferfrage:** Im Text steht „Währenddessen druckt der Mitarbeiter den Lieferschein aus“. Wie setzen Sie das um?
> *Mit einem Fork-Balken vor den beiden parallelen Aktionen und einem Join-Balken danach – die Übergabe der Ware darf erst starten, wenn beide Stränge fertig sind.*

## 2.3 Typische Punktverluste

- **Entscheidung ohne Bedingungen** (`[bezahlt]` / `[nicht bezahlt]` fehlen) – je Raute ein halber bis ganzer Punkt.
- **Fork ohne Join** – die Synchronisation ist der eigentliche Prüfpunkt von „währenddessen“.
- Aktionen in der **falschen Schwimmbahn** („Ausweis zeigen“ gehört zum Kunden).

---

# Teil 3 – Ist-Aufnahme und Kennzahlen

## 3.1 Methoden der Ist-Aufnahme – immer auf die Situation anwenden

| Methode | So wendest du sie an der Warenausgabe an |
|---|---|
| **Beobachtung / Multimomentaufnahme** | Samstags im 15-Minuten-Takt die Länge der Schlange zählen |
| **Zeitmessung** | Dauer je Abholung von „Abholschein vorgelegt“ bis „Ware übergeben“ stoppen |
| **Interview** | Mitarbeiter der Warenausgabe nach Engpässen fragen |
| **Fragebogen** | Kunden an der Ausfahrt kurz zur Wartezeit befragen |
| **Dokumentenanalyse** | Scannerprotokolle (Uhrzeit jeder Abholung) auswerten |
| **Selbstaufschreibung** | Mitarbeiter notieren eine Woche lang Unterbrechungen |

## 3.2 Indikatoren ableiten

Ein Indikator muss **messbar** sein und das **Problem** abbilden: durchschnittliche **Wartezeit** je Kunde, **Durchlaufzeit** je Abholung, **Abholungen je Stunde** (Durchsatz), **Abbruchquote** (Kunden, die ohne Ware gehen), **Beschwerdequote**.

---

# Teil 4 – SWOT und Ishikawa als Analysewerkzeuge

## 4.1 SWOT – innen und außen trennen

| | positiv | negativ |
|---|---|---|
| **intern** (der Prozess selbst) | **Stärken** | **Schwächen** |
| **extern** (Umfeld, Markt, Recht) | **Chancen** | **Risiken** |

Häufigster Fehler: eine **Chance**, die eigentlich eine Stärke ist („Karte ist personalisiert“ ist intern → Stärke). Chancen und Risiken kommen von **außen**: Kundenerwartung, Wettbewerb, Recht, Technik.

## 4.2 Ishikawa nach den 5M

**Mensch** (Qualifikation, Fehler) · **Maschine** (Rechner, Drucker, Scanner) · **Methode** (Ablauf, Vorgaben) · **Material** (Formulare, Karten, Papier) · **Milieu/Mitwelt** (Umgebung, Andrang, Recht). Je Kategorie **eine konkrete Ursache** für die Wirkung am Kopf der Gräte – nicht die Wirkung selbst wiederholen.

---

# Teil 5 – Projekt: Akzeptanz, Risiken, Fremdvergabe

| Thema | Was die Prüfer hören wollen |
|---|---|
| **Akzeptanz** | frühe Information, Beteiligung des Betriebsrats, Qualifizierung für neue Aufgaben, Zusage zur Beschäftigung (Betriebsvereinbarung) |
| **Risiko-Tabelle** | Auswirkung = was passiert im Projekt (Termin, Kosten, Qualität); Ursache = warum es eintritt |
| **Fremdvergabe** | Vorteile: Know-how, Kapazität, Festpreis, schneller Start · Nachteile: Abhängigkeit, Know-how-Verlust, Abstimmungsaufwand, Datenschutz (Auftragsverarbeitung) |
| **Anforderungen** | funktional = **was** das System tut („Abholtermin buchen“) · nichtfunktional = **wie gut** („Antwortzeit < 2 s“, „DSGVO-konform“) |
| **Kostenarten** | Personalkosten, Sachkosten/Hardware, Lizenzkosten, Schulungskosten, Fremdleistungen |

---

# Teil 6 – Wirtschaftlichkeit über mehrere Jahre

## 6.1 Break-even über die Zeit

Wenn eine Maßnahme **jährliche Kosten** verursacht und die **Einsparung erst später** beginnt, vergleichst du die **kumulierten** Werte: Kosten nach t Jahren = K · t, Einsparung nach t Jahren = E · (t − 1), wenn die Einsparung ab dem zweiten Jahr wirkt. Der **Break-even-Point** liegt dort, wo beide Linien sich schneiden.

$K \cdot t = E \cdot (t - 1) \Rightarrow t = \frac{E}{E - K}$

Beispiel mit K = 8.000 € und E = 12.000 €: $t = \frac{12.000}{12.000 - 8.000}$ = **3,00 Jahre**

**Grafik:** x-Achse „Jahre“, y-Achse „Euro (kumuliert)“, beide Geraden beschriften, Schnittpunkt markieren, Antwortsatz schreiben („Nach drei Jahren …“). Achsenbeschriftung ist ein eigener Punkt.

## 6.2 Angebotsvergleich über die Nutzungsdauer

1. **Mengen** aus dem Text holen (Lizenzen, Geräte, Jahre, Anfragen pro Jahr) und unterstreichen.
2. Je Position **einmalig** oder **laufend** entscheiden; laufende Kosten mit der richtigen Anzahl Jahre multiplizieren („ab dem zweiten Jahr“ = Nutzungsdauer − 1).
3. **Pakete und Inklusivleistungen** abziehen: Was schon im Grundpreis steckt, nur für die **zusätzliche** Menge berechnen.
4. Summen bilden, **Differenzbetrag** nennen, **Empfehlung mit Begründung** – auch Qualitatives (Abhängigkeit, Support).

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. **Aktivitätsdiagramm ohne Join** nach „währenddessen“.
2. **Entscheidungen ohne Bedingungen** in eckigen Klammern.
3. **Ist-Aufnahme-Methoden nur genannt**, nicht auf die Warenausgabe angewendet.
4. **Chancen und Stärken verwechselt** in der SWOT.
5. In der Ishikawa-Gräte **die Wirkung wiederholt** statt einer Ursache.
6. **Funktionale und nichtfunktionale Anforderungen** vertauscht.
7. **Einsparung schon ab Jahr 1** gerechnet, obwohl sie erst später beginnt.
8. Im Angebotsvergleich **Inklusivmengen doppelt** bezahlt oder Updates für alle Jahre statt ab Jahr 2.

---

# Übungsklausur Prozessanalyse II im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Antworte stichwortartig, gib bei Berechnungen den Rechenweg an und halte dich an die geforderte Anzahl der Nennungen. Diagramme zeichnest du auf Papier und bewertest sie danach mit der Checkliste der Musterlösung.

## Ausgangssituation

Die **Möbelhaus Nordholz GmbH** verkauft Möbel und Wohnaccessoires an ihrem Hauptstandort. Große Teile holen die Kundinnen und Kunden nach dem Bezahlen selbst an der **Warenausgabe** im Lager ab. Seit der Erweiterung der Ausstellung kommen deutlich mehr Kunden, an Samstagen bilden sich an der Warenausgabe lange Schlangen. Die Geschäftsleitung plant eine **personalisierte Kundenkarte**, eine **App für die Abholung** und **Abholschränke** für kleine Waren. Sie arbeiten in der IT-Abteilung der Möbelhaus Nordholz GmbH.

## Block A – Warenausgabe: Ablauf und Ist-Aufnahme (25 P)

An der Warenausgabe arbeitet je Schicht ein Mitarbeiter. Er gibt ausschließlich bereits bestellte Ware aus. Holt eine andere Person die Ware ab, ist eine Vollmacht des Käufers nötig.

**A1 (15 P):** An der Warenausgabe fallen folgende Tätigkeiten an:
- Der Kunde legt seinen Abholschein vor.
- Der Mitarbeiter scannt die Auftragsnummer und prüft, ob der Auftrag bezahlt ist.
- Ist der Auftrag nicht bezahlt, schickt der Mitarbeiter den Kunden zur Kasse; für diesen Kunden endet der Ablauf an der Warenausgabe.
- Ist der Auftrag bezahlt und holt eine andere Person ab, lässt sich der Mitarbeiter die Vollmacht und den Personalausweis zeigen.
- Der Kunde zeigt Vollmacht und Ausweis.
- Der Mitarbeiter prüft beides.
- Der Mitarbeiter fordert die Ware per Funk im Lager an.
- Währenddessen druckt der Mitarbeiter den Lieferschein aus und lässt ihn vom Kunden unterschreiben.
- Sind die Ware da und der Lieferschein unterschrieben, übergibt der Mitarbeiter die Ware.

*Erstellen* Sie aufgrund dieser Beschreibung ein **UML-Aktivitätsdiagramm** mit den Schwimmbahnen **Kunde** und **Mitarbeiter Warenausgabe**.

**A2 (6 P):** Der Mitarbeiter hört an Samstagen immer häufiger Beschwerden über die Wartezeit. Sie werden beauftragt, den Ablauf zu analysieren. *Nennen* Sie **drei** geeignete Methoden der Ist-Aufnahme und *wenden* Sie jede auf die Situation an der Warenausgabe *an*.

**A3 (4 P):** *Leiten* Sie **zwei** geeignete Indikatoren zur Bewertung des Ausgabeprozesses *ab* und *begründen* Sie Ihre Wahl.

## Block B – Kundenkarte: Prozess analysieren und optimieren (25 P)

Um die Abholung zu beschleunigen, wurde die **Nordholz-Kundenkarte** eingeführt: Wer sie vorzeigt, braucht keinen Abholschein mehr und erhält 2 % Bonus. Trotzdem staut es sich nun am Infopunkt, an dem die Karte beantragt wird. Der Antrag läuft derzeit so ab:
- Der Kunde sagt am Infopunkt, dass er eine Kundenkarte möchte.
- Er erhält ein Papierformular und trägt seine persönlichen Daten ein.
- Die Mitarbeiterin tippt die Daten in das Kundensystem ab und druckt die Einwilligung zur Werbung aus.
- Der Kunde unterschreibt die Einwilligung.
- Währenddessen wird die Karte gedruckt, eingeschweißt und ausgegeben.

**B1 (4 P):** *Untersuchen* Sie den Antragsprozess mithilfe einer **SWOT-Analyse**. *Tragen* Sie je **ein** Merkmal in die Tabelle *ein*.

| Stärken (Strengths) | Schwächen (Weaknesses) |
|---|---|
| | |
| **Chancen (Opportunities)** | **Risiken (Threats)** |
| | |

**B2 (4 P):** Sie sollen ermitteln, wo anzusetzen ist, um die Wartezeit am Infopunkt zu verkürzen. Die Wirkung im Ishikawa-Diagramm lautet „Lange Wartezeit am Infopunkt“. *Nennen* Sie für die vier übrigen Kategorien je **eine** Einflussgröße und *tragen* Sie sie in die Tabelle *ein*.

| Kategorie (5M) | Einflussgröße |
|---|---|
| Mensch | Tippfehler beim Abtippen des Formulars |
| Maschine | |
| Methode | |
| Material | |
| Milieu | |

**B3 (13 P):** Der Antragsprozess soll über die geplante App laufen. Kundinnen und Kunden sollen die Karte wahlweise **digital** (QR-Code in der App) oder als **Plastikkarte per Post** erhalten. *Erstellen* Sie für den optimierten Prozess eine **eEPK** von der Registrierung in der App bis zur aktiven Kundenkarte. *Geben* Sie dabei die erzeugten **Informationsobjekte** *an*.

**B4 (4 P):** *Beschreiben* Sie mit **zwei** Argumenten, worin die Optimierung dieses Prozesses besteht. *Beziehen* Sie sich dabei auf die Einflussgrößen aus B2.

## Block C – Projekt ABHOLAPP (30 P)

Die Geschäftsleitung richtet das Projekt **„ABHOLAPP“** ein: Kunden buchen in der App ein Abholzeitfenster und erhalten einen Abholcode; kleine Waren liegen in **Abholschränken** im Eingangsbereich. Das Projektteam besteht aus Entwicklern des Softwarehauses **Codewerk Nord GmbH**, zwei Mitarbeitern der Warenausgabe, der IT-Abteilung und einer Projektleiterin. Schon im Kick-off-Meeting machen sich die Mitarbeiter der Warenausgabe Sorgen, die Abholschränke könnten ihre Arbeitsplätze überflüssig machen.

**C1 (4 P):** *Beschreiben* Sie **zwei** Maßnahmen, mit denen den Befürchtungen der Mitarbeiter der Warenausgabe entgegengewirkt werden kann.

**C2 (6 P):** Sie haben drei Risiken im Projekt identifiziert. *Tragen* Sie in die Tabelle zu jedem Risiko eine mögliche **Auswirkung** und eine mögliche **Ursache** *ein*.

| Risiko | Auswirkung | Ursache |
|---|---|---|
| Unterschätzung des Testaufwands | | |
| Schnittstelle zum Warenwirtschaftssystem nicht dokumentiert | | |
| Betriebsrat stimmt der Einführung nicht zu | | |

**C3 (8 P):** In der Initialisierungsphase sollen Sie eine Entscheidungsgrundlage erarbeiten, ob die Software für die Abholschränke von der eigenen IT-Abteilung oder von der Codewerk Nord GmbH erstellt werden soll. *Beschreiben* Sie je **zwei** Vor- und **zwei** Nachteile der Fremdvergabe.

**C4 (4 P):** *Nennen* Sie **zwei** funktionale und **zwei** nichtfunktionale Anforderungen an die ABHOLAPP.

**C5 (4 P):** Für das Projekt wird ein Kostenplan benötigt. *Identifizieren* Sie **zwei** Kostenarten des Projekts und *nennen* Sie je Kostenart ein konkretes Beispiel.

**C6 (4 P):** *Beschreiben* Sie **zwei** Maßnahmen, mit denen Sie die Qualität bei der Entwicklung der App sichern können.

## Block D – Wirtschaftlichkeit der Abholschränke (20 P)

Die Geschäftsleitung hat sich für die Abholschränke entschieden. Miete und Wartung kosten **9.000 € pro Jahr**. Eine Teilzeitkraft der Warenausgabe geht **ein Jahr nach dem Start** in den Ruhestand und wird dann wegen der Abholschränke nicht ersetzt; für diese Stelle fallen derzeit **15.000 € pro Jahr** an.

Für die Abhol-Software liegen zwei Angebote vor. Benötigt werden **acht Lizenzen** und **acht Handscanner**, die Software soll **acht Jahre** genutzt werden. Ab dem **zweiten Jahr** ist **ein Update pro Jahr** einzuplanen, außerdem rechnet die IT mit **40 Support-Anfragen pro Jahr**.

| Angebot A | Preis |
|---|---|
| Software-Grundpreis, einmalig, inkl. 4 Lizenzen (unbefristet) | 8.000 € |
| Zusätzliche Lizenz (Miete) | 600 € je Lizenz und Jahr |
| Handscanner | 250 €/Stück |
| Etikettendrucker | 900 € |
| Support | 80 € je Anfrage |
| Update | 1.200 € je Update |

| Angebot B | Preis |
|---|---|
| Software-Grundpreis, einmalig, inkl. 6 Lizenzen (unbefristet) | 55.000 € |
| Hardwarepaket: 6 Handscanner und 1 Etikettendrucker | 2.400 € |
| Zusätzliche Lizenz (unbefristet) | 1.500 € je Lizenz |
| Zusätzlicher Handscanner | 220 €/Stück |
| Updates für zehn Jahre | inklusive |
| Support | inklusive |

**D1 (2 P):** Ihre Vorgesetzte bittet Sie um eine Break-even-Analyse. *Erklären* Sie, was mit der Break-even-Analyse ermittelt wird.

**D2 (5 P):** *Ermitteln* Sie den Break-even-Point der Abholschränke und *stellen* Sie ihn grafisch *dar* (Papier, korrekte Achsenbeschriftung). *Nennen* Sie den genauen Break-even-Point in einem Antwortsatz.

> **Formeln:**
> - kumulierte Kosten nach t Jahren = jährliche Kosten · t
> - kumulierte Einsparung nach t Jahren = jährliche Einsparung · (t − 1), weil die Einsparung erst im zweiten Jahr beginnt
> - Break-even-Point: kumulierte Kosten = kumulierte Einsparung

**D3 (13 P):** Sie sollen eine Empfehlung für einen Anbieter aussprechen. *Führen* Sie einen Angebotsvergleich über die gesamte Nutzungsdauer *durch*, *tragen* Sie die Beträge in die Tabelle *ein* und *ermitteln* Sie den Differenzbetrag. *Geben* Sie eine Empfehlung *ab*.

| Position | Angebot A (€) | Angebot B (€) |
|---|---|---|
| Software-Grundpreis | | |
| Zusätzliche Lizenzen | | |
| Handscanner | | |
| Etikettendrucker | | |
| Updates | | |
| Support | | |
| Summe | | |

> **Formeln:**
> - Gesamtkosten = einmalige Kosten + Σ (laufende Kosten je Jahr · Anzahl der Jahre)
> - Differenzbetrag = Gesamtkosten des teureren Angebots − Gesamtkosten des günstigeren Angebots

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich setze eine Tätigkeitsliste in ein Aktivitätsdiagramm mit Schwimmbahnen, Entscheidung, Fork und Join um.
- [ ] Ich unterscheide Endknoten und Ablaufende und setze beide richtig ein.
- [ ] Ich nenne drei Methoden der Ist-Aufnahme und wende jede auf eine konkrete Situation an.
- [ ] Ich leite messbare Indikatoren für einen Prozess ab und begründe sie.
- [ ] Ich fülle eine SWOT-Analyse und trenne interne Stärken/Schwächen von externen Chancen/Risiken.
- [ ] Ich nenne je 5M-Kategorie eine Ursache für eine vorgegebene Wirkung.
- [ ] Ich modelliere einen App-gestützten Prozess als eEPK mit Informationsobjekten.
- [ ] Ich fülle eine Risiko-Tabelle mit Auswirkung und Ursache und beschreibe Vor- und Nachteile einer Fremdvergabe.
- [ ] Ich ermittle einen Break-even-Point über Jahre und stelle ihn beschriftet grafisch dar.
- [ ] Ich vergleiche zwei Angebote über die Nutzungsdauer und spreche eine begründete Empfehlung aus.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
