# Deep Dive 18: Altklausur-Training Prozessanalyse
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Dieser Deep Dive übersetzt die **Aufgabentypen der echten Abschlussprüfung „Durchführen einer Prozessanalyse“ (Sommer 2026)** in Training: vier Aufgaben, 100 Punkte, 90 Minuten. Die Altklausur zeigt, wie die Prüfer Punkte vergeben – und das weicht von dem ab, was man beim reinen Lernen erwartet: **Es gibt nur wenig Rechnung und kaum reine Definitionsfragen.** Gefragt wird, ob du ein Szenario **sauber auswertest**, mit **eigenen Worten konkrete Beispiele** nennst und eine **eEPK aus einem Fließtext** zeichnest.

Das ist der Bereich, in dem die meisten Punkte durch **zu allgemeine Antworten** und **unvollständige Modelle** verloren gehen. Dieser Deep Dive trainiert deshalb genau diese Aufgabentypen mit einem neuen Szenario und Erwartungshorizont im Stil der Prüfer.

Szenario: **Möbelhaus Nordholz GmbH** – Verwaltung und Logistik am Standort mit rund 140 Beschäftigten.

---

# Teil 1 – So ist die Klausur aufgebaut

## 1.1 Rahmenbedingungen und Bewertung

| Merkmal | Wert |
|---|---|
| Zeit / Punkte | 90 Minuten, 100 Punkte, 4 Aufgaben |
| Szenario | ein Unternehmen, **alle** Aufgaben beziehen sich darauf (Lageplan, Tabellen, Grafik als Anlage) |
| Taschenrechner | nicht programmierbar, ohne Kommunikationsmöglichkeit |
| Gerundetes Zwischenergebnis | mit dem **gerundeten** Wert weiterrechnen |
| Notenschlüssel | 100–92 Punkte = 1 · unter 92–81 = 2 · unter 81–67 = 3 · unter 67–50 = 4 · unter 50–30 = 5 · unter 30–0 = 6 |

**Bewertungsregeln aus den Bearbeitungshinweisen, die Punkte kosten:**
- **Genau so viele Angaben, wie gefordert sind.** Werden vier verlangt und sechs genannt, zählen nur die **ersten vier**. Eine falsche Nennung unter den ersten vier kostet den Punkt – du kannst sie nicht durch eine fünfte „retten“.
- **Stichwortartige Antworten sind zulässig**, sofern nicht ausdrücklich ein Satz verlangt wird („Beschreiben Sie …“ erwartet allerdings eine erkennbare Begründung oder Wirkung, nicht nur ein Schlagwort).
- Ein **nicht eindeutig zuzuordnendes oder unleserliches** Ergebnis wird als falsch gewertet.
- Der Lösungsschlüssel versteht sich als **Korrekturhilfe**: andere sach- und fachgerechte Lösungen werden gleichwertig bewertet.

**Die Operatoren:** *Nennen* = knapp aufzählen. *Beschreiben* = Merkmal + kurze Erklärung/Wirkung. *Erläutern* = Aussage + Begründung + Beispiel aus dem Szenario. *Ermitteln/Berechnen* = Rechenweg zeigen. *Formulieren* = eine eigene, präzise Aussage aufstellen. Die **unterschiedliche Dimension der Aufgabenstellung** (nennen – erklären – beschreiben – erläutern) wird bei der Bewertung ausdrücklich berücksichtigt.

## 1.2 Die vier Aufgabentypen im Überblick

| Typ | Kern | Punkte (Beispiel) | Wo gehen Punkte verloren? |
|---|---|---|---|
| **A – Systemeinführung: Datenschutz, Anforderungen, Akzeptanz** | Maßnahmen nennen; technische Anforderungen; Befürchtungen und Gegenmaßnahmen der Betroffenen | 22 | zu allgemein („Datenschutz beachten“), Gegenmaßnahme passt nicht zur Befürchtung |
| **B – EPK: Konnektoren, Vorteile, eEPK zeichnen** | Konnektor-Semantik, Vorteile eines Ticketsystems, Fließtext → eEPK | 25 | Ereignis/Funktion nicht abwechselnd, Objekte vergessen, XOR nach Ereignis |
| **C – Prozess digitalisieren** | Nachteile des Papierprozesses, Aktivitäten im digitalen Prozess je Schritt, Zielüberprüfung | 28 | Aktivitäten nur umbenannt statt wirklich verändert, Zielüberprüfung ohne Vorher-Nachher-Messung |
| **D – Kostenanalyse mit Grafik** | quantitative Aussage, Aussagekraft einer Grafik, Personalkosten kalkulieren, Stundensatz-Bestandteile | 25 | Prozentwert falsch bezogen, Aussagekraft ohne Schlussfolgerung, Bestandteile vergessen |

---

# Teil 2 – Typ A: Systemeinführung, Datenschutz und Akzeptanz

## 2.1 Maßnahmen zur Einhaltung der DSGVO

Erwartet werden **konkrete** Maßnahmen, keine Paragrafennennung allein. Gut bepunktbar sind:

| Maßnahme | Kurzbeschreibung |
|---|---|
| **TOM** erstellen (technische und organisatorische Maßnahmen) | Zugriffskontrolle, Verschlüsselung, Protokollierung, Backups – dokumentiert (Art. 32 DSGVO) |
| **Verzeichnis von Verarbeitungstätigkeiten** führen | welche personenbezogenen Daten, zu welchem Zweck, wie lange, wer hat Zugriff (Art. 30) |
| **Schulung und Sensibilisierung** der Beschäftigten | wer darf was, Umgang mit Ausdrucken, Passwörtern |
| **Datenschutz-Folgenabschätzung** | bei hohem Risiko (z. B. systematische Überwachung, Auswertung von Bewegungsprofilen) |
| **Löschkonzept** / Löschfristen automatisieren | Speicherbegrenzung, Löschung nach Zweckwegfall |
| **Datenschutzbeauftragten** einbinden, **Auftragsverarbeitungsvertrag** bei Dienstleistern | Verantwortlichkeit klären |
| **Betroffenenrechte** sicherstellen | Auskunft, Berichtigung, Löschung innerhalb der Frist |
| **Betriebsvereinbarung** | klärt Zweck, Auswertung und Zugriff bei Beschäftigtendaten und ersetzt keine DSGVO-Maßnahme, ergänzt sie |

## 2.2 Technische Anforderungen an ein neues System

Pro Anforderung: **Was** wird verlangt und **warum**. Ein Schlagwort allein bringt selten alle Punkte.

| Anforderung | Begründung im Szenario |
|---|---|
| **Verfügbarkeit / Ausfallsicherheit** (Redundanz, Offline-Puffer) | Betrieb darf bei Netzausfall nicht stehen |
| **Verschlüsselte Übertragung und Speicherung** | Schutz personenbezogener Daten vor Mitlesen |
| **Rollen- und Rechtekonzept** | nur berechtigte Personen sehen oder ändern Daten |
| **Datenintegrität / Manipulationsschutz** | keine unbemerkte Änderung der Daten |
| **Schnittstellen** zu bestehenden Systemen (z. B. Lohnabrechnung, ERP) | keine doppelte Erfassung |
| **Skalierbarkeit und Antwortzeit** | auch bei Spitzenlast zeitnah |
| **Protokollierung / Nachvollziehbarkeit** | wer hat wann was getan |
| **Zeitsynchronisation** | korrekte Zeitstempel in allen Komponenten |
| **Bedienbarkeit / Barrierefreiheit** | hohe Akzeptanz und wenige Bedienfehler |

## 2.3 Akzeptanz: Befürchtung – Gegenmaßnahme

Die Tabelle verlangt **je Betroffenen zwei Befürchtungen** und **je Befürchtung eine passende Gegenmaßnahme**. Bewertung typischerweise: 1 P je Befürchtung, **2 P je Gegenmaßnahme**. Die Gegenmaßnahme muss **die genannte Befürchtung** entkräften.

| Betroffene | typische Befürchtung | passende Gegenmaßnahme |
|---|---|---|
| **Beschäftigte** | Verhaltens- und Leistungskontrolle | Betriebsvereinbarung mit klarer Zweckbindung, keine personenbezogene Leistungsauswertung, Transparenz über Daten |
| | Arbeitsplatzverlust durch Automatisierung | frühzeitige Information, Qualifizierung und neue Aufgaben, Zusage in Betriebsvereinbarung |
| | Überforderung durch neue Technik | Schulungen, Ansprechpartner, Pilotphase |
| **Betriebsrat** | Mitbestimmungsrechte (§ 87 Abs. 1 Nr. 6 BetrVG) werden übergangen | frühe Einbindung, Betriebsvereinbarung vor Einführung |
| **Personalabteilung** | Mehraufwand durch Umstellung, neue Datenschutzpflichten | Schulung, zusätzliche Kapazität in der Einführungsphase, Unterstützung durch externe Berater |
| **Führungskräfte** | Kontrollverlust, Änderung von Zuständigkeiten | klare Rollenbeschreibung, Einbindung in die Einführung |

---

# Teil 3 – Typ B: EPK und eEPK

## 3.1 Konnektoren – Bedeutung auf dem Beiblatt

Die Prüfung legt ein **Beiblatt „Sinnbilder EPK-Technik“** bei. Lerne die Bedeutung der Konnektoren in **allen drei Verwendungen**:

| Konnektor | Vor einer Funktion (Join) | Nach einer Funktion (Split) | Vor einem Ereignis (Join) |
|---|---|---|---|
| **UND (∧)** | Funktion läuft, wenn **alle** Ereignisse eingetreten sind | **mehrere** Ereignisse treten ein | Ereignis tritt ein, wenn **alle** vorangestellten Funktionen ausgeführt wurden |
| **ODER (∨)** | Funktion läuft, wenn **mindestens ein** Ereignis eingetreten ist | **mindestens eines** der Ereignisse tritt ein | Ereignis tritt ein, wenn **mindestens eine** Funktion ausgeführt wurde |
| **XOR** | Funktion läuft, wenn **genau ein** Ereignis eingetreten ist | **genau eines** der Ereignisse tritt ein | Ereignis tritt ein, wenn **genau eine** Funktion ausgeführt wurde |

**Antwort auf die Standardfrage „Welche Ereignisse müssen eintreten?“:** UND → Ereignis 1 **und** Ereignis 2 (beide). ODER → Ereignis 1 **oder** Ereignis 2 **oder** beide (mindestens eines). XOR → Ereignis 1 **oder** Ereignis 2 (genau eines).

## 3.2 Weitere Symbole des Beiblatts

| Symbol | Bedeutung |
|---|---|
| Ereignis (Sechseck) | eingetretener Zustand, der den weiteren Ablauf festlegt |
| Funktion (abgerundetes Rechteck) | betrieblicher Vorgang, der einen Eingangs- in einen Zielzustand überführt |
| Organisationseinheit (Ellipse mit Strich) | Abteilung, der eine Funktion oder ein Ereignis zugeordnet ist |
| **Objekt** (Rechteck) | Informationsobjekt, Material, Ressource oder Produkt |
| Kontrollfluss (Pfeil) | Reihenfolge von Ereignissen, Funktionen und Konnektoren |
| Informationsfluss (Doppelpfeil) | Funktion **liest von** oder **schreibt auf** ein Informationsobjekt |
| Zuordnung (Linie) | verbindet Organisationseinheit oder Objekt mit der Funktion |

**Pfeilrichtung beim Informationsfluss:** Pfeil **zur Funktion** = Daten werden gelesen; Pfeil **zum Objekt** = Daten werden geschrieben. Erfasst eine Funktion einen Vorgang im System, zeigt der Pfeil zum Objekt.

## 3.3 So zeichnest du eine eEPK aus einem Fließtext – Vorgehen

1. **Text in Sätze und Schritte zerlegen.** Jedes Verb ist eine Funktion, jeder erreichte Zustand ein Ereignis.
2. **Auslöser = Startereignis** (steht im ersten Satz: „Geht … ein“ → „… ist eingegangen“).
3. **Signalwörter markieren:** „parallel / gleichzeitig / außerdem“ → UND; „wenn … sonst / entweder … oder / liegt vor … liegt nicht vor“ → XOR; „und/oder“ → ODER.
4. **Zwischen jeder Funktion ein Ereignis** setzen (Ereignis ↔ Funktion wechseln sich ab). Konnektoren zählen nicht als Funktionen.
5. **Nach einem Ereignis niemals XOR- oder ODER-Split.** Entscheidungen gehen immer von einer **Funktion** aus („Mangel prüfen“ → XOR → „Mangel liegt vor“ / „liegt nicht vor“).
6. **Jede Verzweigung sauber schließen** (oder jeden Zweig mit eigenem Endereignis beenden). Das Zusammenführen geschieht mit **gleichem Konnektor-Typ**; ein XOR-Zweig wird nicht von einem UND zusammengeführt (Deadlock).
7. **Objekte nach dem Hinweis der Aufgabe** zeichnen: Systeme und Dokumente, die in der Aufgabe ausdrücklich genannt sind, **müssen** an die Funktion, die sie nutzt.
8. **Rückläufe (Schleifen)** über einen XOR-Join vor der wiederholten Funktion modellieren („bis die Lösung funktioniert“).

**Typische Punktverteilung:** je Ereignis, Funktion und Objekt **0,5 P**, je Konnektor **1,5 P** – Konnektoren sind also **dreimal** so viel wert wie ein einzelnes Element. Ein vergessener oder falscher Konnektor kostet mehr als ein fehlendes Ereignis.

---

# Teil 4 – Typ C: Prozess digitalisieren

## 4.1 Nachteile papiergesteuerter Prozesse

Nenne **Nachteil + Folge** (je 2 Punkte, ohne Folge oft nur 1):

| Nachteil | Folge |
|---|---|
| **Zeitaufwand** durch manuelle Erfassung und Weitergabe | lange Durchlaufzeit |
| **Fehleranfälligkeit** (unleserliche Handschrift, Abtippen) | Nacharbeit, Verwechslungen |
| **mangelnde Transparenz** (Status nur auf Papier) | Rückfragen, kein Überblick |
| **Medienbrüche** (Papier → System → Excel) | Mehrfacherfassung |
| **ineffiziente Kommunikation** (Übergabe per Mappe/Tagessammlung) | Wartezeiten |
| **schwierige Nachverfolgung/Archivierung** | Suche kostet Zeit, kaum Auswertung |
| **hoher Platz- und Materialbedarf** | Kosten für Ablage und Archiv |

## 4.2 Aktivitäten im digitalen Prozess ableiten

Die Aufgabe liefert eine **Tabelle**: links der Papierprozess mit Aktivitäten je Prozessschritt, rechts der digitale Prozess mit **einer vorgegebenen** und **drei zu beschreibenden** Aktivitäten je Schritt. Pro Aktivität 2 Punkte.

**Methode „Papier → digital“:** Nimm jede Aktivität links und frage:
- **Was ersetzt das Hilfsmittel?** (Lieferschein unterschreiben → App bestätigt und setzt Zeitstempel automatisch)
- **Was entfällt?** (Sammeln und Transportieren von Papier)
- **Was entsteht neu?** (automatische Prüfung gegen Bestelldaten, Fehlermeldung bei Abweichung)
- **Wer sieht die Daten sofort?** (nachfolgender Bereich ruft sie direkt ab)

**Wichtig:** Die neuen Aktivitäten müssen sich **aus den vorgegebenen Hilfsmitteln** ergeben (z. B. App, Endgerät, Scanner/Drucker). Nur **umbenannte** Aktivitäten („Lieferschein abgeben“ → „Lieferschein digital abgeben“) bringen wenig.

## 4.3 Zielüberprüfung („Zeit um 20 % verkürzen“)

Der Erwartungshorizont ist ein **Vorher-Nachher-Vergleich**:

1. **Ist-Zeit messen**, die der Papierprozess vom Start bis zum Ende benötigt – **ausreichend große Stichprobe**, **Durchschnitt** bilden.
2. **Prozess einführen** (idealerweise Pilotbereich).
3. **Soll-Zeit messen** mit gleicher Methode und ähnlich großer Stichprobe, **Durchschnitt** bilden.
4. **Vergleichen:** Reduktion = (Ist − Soll) ÷ Ist × 100. Ist die Reduktion **≥ Ziel**, wurde das Ziel erreicht.

**Zusätze, die Punkte bringen:** Messpunkte genau definieren (Start = Wareneingang, Ende = Einlagerung), vergleichbare Bedingungen (Saison, Menge), Ausreißer beachten (Median ergänzen).

---

# Teil 5 – Typ D: Kostenanalyse mit Grafik

## 5.1 Quantitative Aussage zu einem Kostenverlauf

Eine **quantitative** Aussage nennt **Zahlen**: Anfangswert, Endwert und die **prozentuale Veränderung** oder den absoluten Anstieg. Beispiel: „Die Kosten sind von 400.000 € (2016) auf 1.000.000 € (2025) gestiegen, das sind +150 %.“

$$\text{Veränderung in \%} = \frac{\text{Endwert} - \text{Anfangswert}}{\text{Anfangswert}} \cdot 100$$

⚠️ **Prüfungsfalle:** Bezugsgröße ist der **Anfangswert**. „Von 1 auf 3 Mio. €“ ist ein Anstieg um **200 %** (nicht um 66 %; die Kosten sind aber auf **300 %** des Anfangswerts angewachsen).

## 5.2 Aussagekraft einer Grafik prüfen

Verlangt: **Kriterium nennen (1 P) – beschreiben (2 P) – Schlussfolgerung (2 P)**. Die Schlussfolgerung zur Grafik lautet in der Regel: **„Die Grafik ist nicht (ausreichend) aussagekräftig und kann nicht als alleinige Entscheidungsgrundlage dienen.“**

| Kriterium | Beschreibung |
|---|---|
| **Fehlende Kostenarten** | keine Aufschlüsselung in Personal-, Material-, Energiekosten |
| **Mengengerüst fehlt** | nicht erkennbar, wie viele Vorgänge (z. B. Kontrollen, Aufträge) pro Jahr anfallen – Kosten je Vorgang unbekannt |
| **Wirtschaftliche Entwicklung** | Kosten können steigen, weil das Unternehmen wächst und mehr Verkehr/Aufträge hat |
| **Inflation** | nominale Werte verzerren den realen Verlauf |
| **Grad der Digitalisierung** | evtl. noch viel manuelle Arbeit; Kosten sagen nichts über Effizienz |
| **Veränderte Prozesse/Anforderungen** | z. B. Kontrollen wurden intensiviert |
| **Fremdpersonal** | Aufgabe wurde ausgelagert, Kosten verschieben sich |
| **Wartung und Energie** | Anteile, die nichts mit dem Kernvorgang zu tun haben |
| **Zeitraum / Skalierung der Achse** | Achse beginnt nicht bei null oder Zeitraum zu kurz |

## 5.3 Personalkosten kalkulieren – das Rechenschema

Gegeben sind: **Besetzung pro Stelle**, **Betriebsstunden pro Tag**, **Tage pro Woche**, **52 Wochen**, **Abwesenheitsquote** und **Urlaubstage**, dazu der **kalkulatorische Stundensatz**.

1. **Jahresstunden** = Stunden pro Tag × Personen × Standorte × Tage pro Woche × 52
2. **Mehrbedarf Abwesenheit** = Jahresstunden × Quote (z. B. 0,10)
3. **Mehrbedarf Urlaub** = **Stunden pro Tag (alle Personen zusammen)** × Urlaubstage
4. **Summe Stunden** × **Stundensatz** = Personalkosten pro Jahr

⚠️ Schritt 3 ist die Besonderheit der Prüfung: Du ersetzt **die Abdeckung eines Tages** (alle Personen an allen Standorten) für jeden Urlaubstag – nicht einfach „30 Tage × 8 Stunden“. Der Erwartungshorizont rechnet mit den **Tagesstunden des gesamten Teams**.

**Eintragen in die Grafik:** Wert auf der Kostenachse markieren und **mit der Kurve vergleichen**. Liegt der Wert **über** der Kurve, enthält die Kurve die Personalkosten **nicht vollständig** (Gesamtkosten sind unvollständig). Liegt er **darunter**, sind die Personalkosten enthalten – ob die übrigen Kosten gedeckt sind, ist ohne weitere Daten nicht beurteilbar.

## 5.4 Was ein Stundensatz enthalten muss

Der kalkulatorische Stundensatz ist **mehr als der Bruttolohn**. Nenne vier Bestandteile:

| Bestandteil | Erklärung |
|---|---|
| **Arbeitgeberanteil zur Sozialversicherung** | Renten-, Arbeitslosen-, Kranken-, Pflege- und Unfallversicherung |
| **Sonderzahlungen** | 13. Monatsgehalt, Urlaubs- und Weihnachtsgeld |
| **Lohnfortzahlung** im Krankheits- und Urlaubsfall | bezahlte Ausfallzeiten |
| **Arbeitskleidung, Schutzausrüstung** | Betriebsmittel pro Beschäftigten |
| **Freiwillige Sozialleistungen** | Zuschuss zur Kantine, betriebliche Altersvorsorge |
| **Arbeitsplatz- und Gemeinkosten** | Raum, Energie, IT-Ausstattung, Verwaltungsumlage |
| **Aus- und Weiterbildung** | Schulungen |

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. Mehr Nennungen als gefordert – nur die ersten zählen, die falsche Nennung unter den ersten kostet den Punkt.
2. Datenschutzmaßnahme ohne Konkretisierung („Datenschutz beachten“) statt TOM, Löschkonzept, Schulung.
3. Gegenmaßnahme passt nicht zur Befürchtung (Schulung gegen Überwachungsangst).
4. Konnektoren falsch gedeutet: ODER als „genau eines“ oder XOR als „mindestens eines“.
5. In der eEPK **XOR direkt nach einem Ereignis** oder zwei Funktionen hintereinander.
6. In der eEPK **Objekte oder Systeme** aus dem Aufgabentext nicht eingezeichnet.
7. Zielüberprüfung ohne **Messung vorher und nachher** und ohne Durchschnitt/Stichprobe.
8. Kostenvergleich: **Prozentwert falsch bezogen** oder Grafik ohne Schlussfolgerung bewertet.

---

# Übungsklausur Prozessanalyse im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Notiere stichwortartig, gib bei Berechnungen den Rechenweg an, und halte dich an die geforderte Anzahl der Nennungen. Bearbeite die Klausur **am Ende des Themas** am Stück, ohne Unterlagen.

## Ausgangssituation

Die **Möbelhaus Nordholz GmbH** betreibt am Hauptstandort Verwaltung, Lager und Kundenservice mit rund 140 Beschäftigten. Mitarbeiter aus Verwaltung und Lager erfassen ihre Arbeitszeiten bisher per Papierstundenzettel. Geplant sind ein **digitales Zeiterfassungssystem mit Chipkarten-Terminals**, ein **Reklamationssystem** für den Kundenservice, die **Digitalisierung der Eingangsrechnungen** und eine **Kostenanalyse des Kundenservice-Telefons (Hotline)**. Sie arbeiten in der IT-Abteilung des Unternehmens mit.

## Block A – Zeiterfassung: Datenschutz und Akzeptanz (22 P)

Für die Einführung des Zeiterfassungssystems erfassen Terminals an den Eingängen und im Lager die Anwesenheitszeiten der Beschäftigten per Chipkarte. Die Daten werden an die Lohnabrechnung übergeben.

**A1 (4 P):** Die EU-Datenschutz-Grundverordnung (DSGVO) stellt hohe Anforderungen an den Schutz personenbezogener Daten. Beschreiben Sie **zwei** Maßnahmen zur Einhaltung des Datenschutzes, um den Anforderungen der DSGVO gerecht zu werden.

**A2 (6 P):** Ein wichtiges Ziel der Geschäftsleitung ist eine fälschungssichere Zeiterfassung ohne Mehraufwand für die Beschäftigten. Beschreiben Sie **drei** technische Anforderungen, die das neue System dazu erfüllen muss.

**A3 (12 P):** Der Erfolg des Projekts hängt maßgeblich von der Akzeptanz der Beschäftigten im Lager und des Betriebsrats ab. Nennen Sie jeweils **zwei Befürchtungen** und beschreiben Sie zu jeder Befürchtung eine **geeignete Gegenmaßnahme**. Tragen Sie Ihre Antworten in die Tabelle ein.

| Betroffener | Befürchtungen | Gegenmaßnahmen |
|---|---|---|
| Beschäftigte im Lager | | |
| Betriebsrat | | |

## Block B – Reklamationsmanagement mit eEPK (25 P)

Der Kundenservice bearbeitet Reklamationen bisher per E-Mail und Telefon. Es ist geplant, ein Reklamationssystem einzuführen.

**B1 (4 P):** Beschreiben Sie **zwei** mögliche Vorteile eines Reklamationssystems (Ticketsystems) für den Kundenservice.

**B2 (3 P):** In Ereignisgesteuerten Prozessketten (EPK) gibt es drei mögliche Konnektoren. Geben Sie jeweils an, **welche Ereignisse eintreten müssen**, damit die Funktion ausgeführt wird. Die Konnektoren stehen jeweils zwischen **Ereignis 1**, **Ereignis 2** und der **Funktion**.

| Konnektor | Welche Ereignisse müssen eintreten? |
|---|---|
| ∧ (UND) | |
| ∨ (ODER) | |
| XOR | |

**B3 (18 P):** Der Ablauf der Reklamationsbearbeitung ist wie folgt beschrieben: Geht eine Reklamation ein, muss der Kunde über den Eingang informiert werden. **Parallel** dazu wird die Reklamation einem Sachbearbeiter zugewiesen. Der Sachbearbeiter erfasst den Vorgang im Reklamationssystem. Danach prüft er anhand der Produktdokumentation, ob ein Mangel vorliegt. Liegt kein Mangel vor, wird dem Kunden eine Ablehnung gesendet. Liegt ein Mangel vor, wird geprüft, ob eine Reparatur möglich ist. Ist sie möglich, wird die Reparatur beauftragt, sonst wird ein Ersatzprodukt geliefert. Nach Ablehnung, Reparaturauftrag oder Ersatzlieferung wird die Reklamation im Reklamationssystem geschlossen.

Setzen Sie diese Prozessbeschreibung in einer **eEPK** um. Die Objekte „Reklamationssystem“ und „Produktdokumentation“ sollen dargestellt werden. Beschreiben Sie die eEPK in Textform als geordnete Liste (Ereignis → Funktion → Konnektor …) und geben Sie an, welche Objekte Sie welcher Funktion zuordnen.

## Block C – Digitalisierung der Eingangsrechnungen (28 P)

Der Prozess 1 „Eingangsrechnung papiergesteuert“ soll digitalisiert werden. Er ist in der linken Spalte der folgenden Tabelle dargestellt.

| Prozess 1: Eingangsrechnung papiergesteuert | Prozess 2: Eingangsrechnung digital unterstützt |
|---|---|
| **1. Rechnungseingang** – Aktivitäten im Posteingang: öffnen die Post und sortieren Rechnungen aus · stempeln das Eingangsdatum auf die Rechnung · sammeln die Rechnungen in einer Mappe · bringen die Mappe einmal täglich in die Fachabteilung | Aktivität: scannen die Rechnung mit dem Scanner ein · *drei ähnliche Aktivitäten zu beschreiben* |
| **2. Sachliche Prüfung** – Aktivitäten in der Fachabteilung: vergleichen die Rechnung mit dem Lieferschein aus der Ablage · prüfen Menge und Preis von Hand anhand der Bestellung · vermerken die Prüfung mit Unterschrift · geben die Mappe an die Buchhaltung weiter | Aktivität: rufen die Rechnung am Bildschirm auf · *drei ähnliche Aktivitäten zu beschreiben* |
| **3. Freigabe und Buchung** – Aktivitäten in der Buchhaltung: legen die Rechnung dem Abteilungsleiter zur Freigabe vor · übertragen die Rechnungsdaten von Hand ins Buchhaltungssystem · heften die Rechnung in Aktenordnern ab | Aktivität: bestätigen die Freigabe im System · *drei ähnliche Aktivitäten zu beschreiben* |

**C1 (6 P):** Beschreiben Sie **drei** Nachteile, die sich aus dem Prozess 1 „Eingangsrechnung papiergesteuert“ ergeben.

**C2 (18 P):** Zur Optimierung von Prozess 1 werden folgende Hilfsmittel angeschafft:
- Dokumentenmanagementsystem mit Rechnungs-Workflow (Texterkennung/OCR),
- digitale Endgeräte (PC und Tablet) für jeden Beteiligten,
- Scanner im Posteingang, Anbindung an das Buchhaltungssystem.

Sie sollen den Prozess 2 „Eingangsrechnung digital unterstützt“ definieren. Beschreiben Sie hierzu für **jeden Prozessschritt (1.–3.)** drei Aktivitäten, die aufgrund der technischen Hilfsmittel neu definiert bzw. angepasst werden können.

**C3 (4 P):** Die Geschäftsleitung hat das Ziel festgelegt, die Zeit vom Rechnungseingang bis zur Buchung um 30 % zu verkürzen. Erläutern Sie, wie dieses Ziel überprüft werden kann.

## Block D – Kosten der Kundenhotline (25 P)

Die Geschäftsleitung beauftragt Sie, die Kosten der Kundenhotline zu analysieren. Es werden nur die Kosten betrachtet, die sich aus den Tätigkeiten der beiden Hotline-Standorte ergeben. Sie erhalten folgende Kostenübersicht (die Grafik wird als Tabelle dargestellt):

| Jahr | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---|---|---|---|---|---|---|---|---|---|
| Kosten in € | 400.000 | 450.000 | 450.000 | 600.000 | 650.000 | 700.000 | 800.000 | 850.000 | 950.000 | 1.000.000 |

**D1 (2 P):** Formulieren Sie eine **quantitative Aussage** zum Kostenverlauf.

**D2 (8 P):** Nennen Sie **zwei Kriterien** zur Aussagekraft der Grafik, beschreiben Sie diese und ziehen Sie eine Schlussfolgerung. Tragen Sie Ihre Antworten in die Tabelle ein.

| Kriterium | Beschreibung |
|---|---|
| Fehlende Kostenarten | keine Aufschlüsselung in Personalkosten, Materialkosten usw. |
| | |
| | |

Schlussfolgerung: …

**Nachkalkulation (D3a bis D3c, zusammen 11 P):** In Ihren Überlegungen identifizieren Sie die Personalkosten als einen Haupttreiber. Sie führen deshalb eine Nachkalkulation für das Jahr 2025 mit folgenden Daten durch: Die Hotline ist an **zwei Standorten** besetzt. An jedem Standort arbeiten immer **vier Mitarbeiter gleichzeitig**. Die Hotline muss **12 Stunden pro Tag von Montag bis Freitag** abgedeckt sein. Ein Jahr hat 52 Wochen.

**D3a (2 P):** Berechnen Sie die Anzahl der Arbeitsstunden, die für den Betrieb der Hotline für ein Jahr anfallen.

**D3b (5 P):** Da Mitarbeiter aufgrund von Fortbildungen und Krankheit gefehlt haben, waren Vertretungen einzusetzen. Der zusätzliche Stundenbedarf ergibt sich aus einer Abwesenheitsquote von **12 %**, bezogen auf die in D3a berechneten Stunden pro Jahr. Außerdem sind **30 Urlaubstage** zu berücksichtigen (Tagesstunden der gesamten Besetzung). Ermitteln Sie aufgrund eines kalkulatorischen Stundensatzes von **58,00 EUR** die Personalkosten der beiden Hotline-Standorte.

**D3c (4 P):** Tragen Sie Ihren errechneten Wert in die Kostenübersicht (2025) ein und leiten Sie aus der Lage des Wertes zur Kurve ein Urteil über die Datengrundlage der Kurve ab.

**D4 (4 P):** In einem letzten Schritt überprüfen Sie noch einmal, ob der kalkulatorische Stundensatz alle Kosten abdeckt. Nennen Sie neben dem Lohn- bzw. Gehaltsstundensatz **vier weitere Bestandteile**, die in jedem Fall im durchschnittlichen Stundensatz enthalten sein müssen, um eine sinnvolle Kalkulation erstellen zu können.

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich nenne konkrete Maßnahmen zur Einhaltung der DSGVO (TOM, Verzeichnis, Schulung, Löschkonzept, Folgenabschätzung).
- [ ] Ich begründe technische Anforderungen an ein neues System mit Wirkung im Szenario.
- [ ] Ich ordne jeder Befürchtung eine passende Gegenmaßnahme zu (Betriebsvereinbarung, Qualifizierung, frühe Einbindung).
- [ ] Ich beschreibe die Bedeutung der drei EPK-Konnektoren als Join und als Split.
- [ ] Ich zeichne aus einem Fließtext eine eEPK mit Objekten, UND-Split und XOR-Zweigen.
- [ ] Ich nenne Nachteile eines Papierprozesses mit Folge und leite digitale Aktivitäten aus Hilfsmitteln ab.
- [ ] Ich erläutere eine Zielüberprüfung mit Stichprobe, Durchschnitt und Vorher-Nachher-Vergleich.
- [ ] Ich formuliere eine quantitative Aussage mit richtiger prozentualer Veränderung.
- [ ] Ich bewerte die Aussagekraft einer Grafik mit Kriterium, Beschreibung und Schlussfolgerung.
- [ ] Ich kalkuliere Personalkosten mit Abwesenheitsquote, Urlaubstagen und Stundensatz.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
