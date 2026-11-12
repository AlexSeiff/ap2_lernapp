<!-- Begriffsseiten B · Stand 2026-10 -->
## Backpropagation
<!-- id: backpropagation · quellen: Karte DD6, DD6 8.2, DD6 9.6 · stand: 2026-10 -->

Trainingsverfahren für mehrschichtige neuronale Netze: Der Fehler an der Ausgabe wird Schicht für Schicht zurückgerechnet, und jedes Gewicht wird ein Stück in die Richtung verändert, die den Fehler verringert.

### Erklärung
Ein Trainingsfall läuft zuerst vorwärts durch das Netz. Die Ausgabe wird mit dem richtigen Label verglichen. Dann wird mit der Kettenregel berechnet, wie stark jedes Gewicht zum Fehler beigetragen hat, beginnend bei der letzten Schicht. Jedes Gewicht wird entgegen diesem Beitrag angepasst (Gradientenabstieg), die Schrittweite gibt die Lernrate vor. Das wird über viele Epochen wiederholt. Dafür müssen die Aktivierungsfunktionen ableitbar sein – deshalb Sigmoid oder ReLU statt der Stufenfunktion.

### Beispiel
Ein Netz soll aus Fotos von Rücksendungen erkennen, ob ein Möbelstück beschädigt ist. Sagt es bei einem beschädigten Tisch „unbeschädigt“, verteilt Backpropagation diesen Fehler zurück auf alle Gewichte, die zur falschen Ausgabe beigetragen haben.

### Abgrenzung
Die Perzeptron-Lernregel trainiert nur ein einzelnes Neuron mit Stufenfunktion und kennt keine verdeckten Schichten. Backpropagation ist das Verfahren für mehrschichtige Netze und damit für Deep Learning.

### Merksatz
Vorwärts rechnen, Fehler rückwärts verteilen, Gewichte anpassen.

Siehe auch: Mehrschichtiges Perzeptron · Perzeptron-Lernregel · Lernrate · Neuronale Netze
Mehr: Deep Dive 6, 8.2 · Deep Dive 6, 9.6

## Bagging
<!-- id: bagging · quellen: Karte DD6, DD6 8.3 · stand: 2026-10 -->

Bootstrap Aggregating: Viele Modelle werden auf Zufallsstichproben mit Zurücklegen trainiert und stimmen gemeinsam ab – die Grundlage des Random Forest.

### Erklärung
Aus den Trainingsdaten werden mehrere gleich große Stichproben **mit Zurücklegen** gezogen (Bootstrap-Stichproben): Ein Fall kann mehrfach vorkommen, ein anderer gar nicht. Auf jeder Stichprobe wird ein eigenes Modell trainiert, meist ein Entscheidungsbaum. Für einen neuen Fall stimmen alle Modelle ab (Klassifikation: Mehrheit, Regression: Mittelwert). Weil sich die Fehler der einzelnen, leicht überangepassten Modelle teilweise ausgleichen, ist das Ensemble robuster und meist genauer als ein Einzelmodell.

### Beispiel
Das Möbelhaus will Reklamationen vorhersagen. Statt eines Baums werden 200 Bäume auf je einer Bootstrap-Stichprobe der Aufträge trainiert; sagen 130 Bäume „Reklamation“, lautet die Vorhersage „Reklamation“.

### Abgrenzung
Bagging allein zieht nur zufällige **Fälle**. Der Random Forest wählt zusätzlich an jedem Knoten nur aus einer zufälligen Teilmenge der **Merkmale** – das macht die Bäume unterschiedlicher.

### Prüfungsfalle
„Ohne Zurücklegen“ ist falsch – gerade das Ziehen mit Zurücklegen erzeugt die unterschiedlichen Stichproben.

### Merksatz
Viele Bäume auf zufällig gezogenen Daten, dann Mehrheitsentscheid.

Siehe auch: Random Forest · Entscheidungsbaum · Overfitting · Stichprobe
Mehr: Deep Dive 6, 8.3

## Balanced Accuracy
<!-- id: balanced-accuracy · quellen: Karte DD7, DD7 4.5 · stand: 2026-10 -->

Mittelwert aus Recall und Spezifität; bei unausgeglichenen Klassen aussagekräftiger als die Accuracy, weil ein triviales Modell nur 50 % erreicht.

### Erklärung
Die normale Accuracy wird von der Mehrheitsklasse dominiert. Die Balanced Accuracy gewichtet beide Klassen gleich: Sie mittelt die Trefferquote in der positiven Klasse (Recall) und in der negativen Klasse (Spezifität). Ein Modell, das immer die Mehrheitsklasse vorhersagt, kommt so auf genau 50 %.

$\text{Balanced Accuracy} = \frac{\text{Recall} + \text{Spezifität}}{2}$

### Beispiel
1.000 Aufträge, 100 Reklamationen; TP = 60, FN = 40, FP = 90, TN = 810. Recall $= \frac{60}{100} = 60\,\%$, Spezifität $= \frac{810}{900} = 90\,\%$, Balanced Accuracy $= \frac{60 + 90}{2} = 75\,\%$. Das triviale Modell „nie Reklamation“: $\frac{0 + 100}{2} = 50\,\%$ – obwohl seine Accuracy mit 90 % höher liegt als die des Modells (87 %).

### Abgrenzung
Die Accuracy zählt alle richtigen Vorhersagen über alle Fälle; die Balanced Accuracy mittelt die Quoten je Klasse. Bei ausgeglichenen Klassen liegen beide nah beieinander.

### Prüfungsfalle
Bei 1 % Betrugsfällen eine Accuracy von 99 % als gutes Ergebnis werten – das schafft schon die Baseline.

### Merksatz
Jede Klasse zählt gleich viel – Zufall und Mehrheitsraten landen bei 50 %.

Siehe auch: Accuracy · Recall · Spezifität · Unausgeglichene Klassen · Baseline
Mehr: Deep Dive 7, 4.5

## Balanced Scorecard
<!-- id: balanced-scorecard · quellen: Karte DD5, DD5 6.6 · stand: 2026-10 -->

Kennzahlensystem, das Ziele und Kennzahlen vier Perspektiven zuordnet: Finanzen, Kunden, interne Prozesse sowie Lernen und Entwicklung.

### Erklärung
Die Balanced Scorecard (Kaplan und Norton) soll verhindern, dass ein Unternehmen nur nach Finanzkennzahlen gesteuert wird. Finanzzahlen zeigen die Vergangenheit; Kunden-, Prozess- und Lernkennzahlen sind Frühindikatoren für künftigen Erfolg. Je Perspektive werden wenige Ziele mit KPI, Zielwert und Maßnahme festgelegt, die über Ursache-Wirkungs-Ketten zusammenhängen.

### Beispiel
Reparaturservice des Möbelhauses:

| Perspektive | Kennzahl |
|---|---|
| Finanzen | Prozesskosten je Fall |
| Kunden | Kundenzufriedenheit, Termintreue |
| Interne Prozesse | Durchlaufzeit, First Pass Yield |
| Lernen und Entwicklung | Schulungstage je Techniker |

### Abgrenzung
Ein **KPI** ist eine einzelne zentrale Kennzahl; die Balanced Scorecard ist das System, das mehrere KPIs ausgewogen ordnet.

### Prüfungsfalle
„Mitarbeiter“ oder „Qualität“ als vierte Perspektive nennen – richtig ist „Lernen und Entwicklung“ (auch „Lernen und Wachstum“).

### Merksatz
Nicht nur aufs Geld schauen: Finanzen, Kunden, Prozesse, Lernen.

Siehe auch: KPI · Wenige Kennzahlen · Reifegradmodelle · Kennzahlentypen
Mehr: Deep Dive 5, 6.6

## Balkendiagramm
<!-- id: balkendiagramm · quellen: Karte DD11, DD17 6.2 · stand: 2026-10 -->

Diagramm mit waagrechten Balken zum Vergleich von Kategorien oder Rangfolgen; die Balkenlänge codiert den Wert.

### Erklärung
Balken eignen sich besonders bei vielen Kategorien oder langen Namen, weil die Beschriftung links waagrecht lesbar bleibt. Die Balken werden nach Wert sortiert, damit die Rangfolge sofort sichtbar ist. Da die Länge den Wert trägt, muss die Achse bei null beginnen.

### Beispiel
Top-5-Artikel nach Umsatz in T€: Ecksofa Lund 185, Boxspringbett Aalborg 150, Esstisch Eiche massiv 120 … – absteigend sortiert, mit Wert am Balkenende.

### Abgrenzung
| Diagramm | Einsatz |
|---|---|
| Säulendiagramm | wenige Kategorien oder Zeitpunkte, senkrecht |
| Balkendiagramm | viele Kategorien, lange Namen, Rangfolgen |
| Histogramm | Verteilung eines metrischen Merkmals in Klassen, Balken ohne Lücke |

### Prüfungsfalle
Eine abgeschnittene Achse bei Balken – kleine Unterschiede wirken dann riesig (Lügenfaktor).

### Merksatz
Balken für Rangfolgen: sortiert, beschriftet, ab null.

Siehe auch: Säulendiagramm · Abgeschnittene Achse · Histogramm · Lügenfaktor
Mehr: Deep Dive 17, 6.2

## Barrierefreiheit
<!-- id: barrierefreiheit · quellen: Karte DD11, DD11 A2, DD11 A5 · stand: 2026-10 -->

Anforderung, dass Angebote und Darstellungen auch für Menschen mit Einschränkungen nutzbar sind.

### Erklärung
Grundlage sind die **WCAG** (aktuell 2.2, Stand 2026) mit den Prinzipien wahrnehmbar, bedienbar, verständlich, robust. Öffentliche Stellen verpflichtet die BITV 2.0, viele Unternehmen mit Angeboten für Verbraucher seit dem 28.06.2025 das Barrierefreiheitsstärkungsgesetz (BFSG). Für Dashboards heißt das: Information nie nur über Farbe, ausreichender Kontrast (Text mindestens 4,5 : 1, Grafikelemente 3 : 1), Alternativtexte oder Datentabelle, Bedienung per Tastatur, skalierbare Schrift.

### Beispiel
Im Filial-Dashboard ist „Ziel verfehlt“ nicht nur rot, sondern zusätzlich mit Symbol und Text markiert – rund 8 % der Männer haben eine Rot-Grün-Schwäche.

### Abgrenzung
Gebrauchstauglichkeit (ISO 9241-11) fragt, ob Nutzer ihre Ziele effektiv, effizient und zufriedenstellend erreichen; Barrierefreiheit stellt sicher, dass das auch mit Einschränkungen möglich ist.

### Prüfungsfalle
Eine Ampel-Darstellung nur mit Rot und Grün als „intuitiv“ verkaufen.

### Merksatz
Farbe darf unterstützen, aber nie allein informieren.

Siehe auch: WCAG · Alternativtext · Gebrauchstauglichkeit · Sparsam mit Farben
Mehr: Deep Dive 11, A2 · Deep Dive 11, A5

## BASE
<!-- id: base · quellen: Karte DD15, DD15 4.1 · stand: 2026-10 -->

Konsistenzmodell vieler NoSQL-Systeme: Basically Available, Soft State, Eventually Consistent.

### Erklärung
Verteilte NoSQL-Systeme setzen auf hohe Verfügbarkeit statt strikter Konsistenz. **Basically Available**: Das System antwortet fast immer. **Soft State**: Der Zustand kann sich auch ohne neue Eingaben ändern, weil Replikate nachziehen. **Eventually Consistent**: Eine Änderung ist nicht sofort, aber nach kurzer Zeit auf allen Knoten sichtbar.

### Beispiel
Ein Bewertungstext im Onlineshop des Möbelhauses erscheint auf einem Server sofort, auf einem anderen erst Sekunden später – für Bewertungen unkritisch, für Kontostände nicht akzeptabel.

### Abgrenzung
| | ACID | BASE |
|---|---|---|
| typisch für | relationale Datenbanken | viele NoSQL-Systeme |
| Konsistenz | sofort, je Transaktion | stellt sich mit Verzögerung ein |
| Schwerpunkt | Korrektheit | Verfügbarkeit, Skalierung |

### Prüfungsfalle
BASE als „keine Konsistenz“ erklären – die Konsistenz kommt, nur verzögert.

### Merksatz
ACID ist sofort richtig, BASE ist sofort erreichbar und bald richtig.

Siehe auch: ACID · CAP-Theorem · NoSQL · Horizontale Skalierung
Mehr: Deep Dive 15, 4.1

## Baseline
<!-- id: baseline · quellen: Karte DD7, DD7 4.1, DD7 4.5 · stand: 2026-10 -->

Vergleichswert eines trivialen Ansatzes, ohne den keine Gütekennzahl eines Modells einzuordnen ist.
Auch: Baseline zum Vergleich

### Erklärung
Eine Kennzahl wie „87 % Accuracy“ sagt allein nichts. Erst der Vergleich mit einer Baseline zeigt, ob das Modell einen Mehrwert bringt. Typische Baselines: immer die Mehrheitsklasse (Klassifikation), immer der Mittelwert (Regression, R² = 0), naive Prognose mit dem letzten Wert oder Vorjahresmonat (Zeitreihe) und die bisherige Regel des Fachbereichs.

### Beispiel
Bei 100 Reklamationen unter 1.000 Aufträgen erreicht „nie Reklamation“ 90 % Accuracy bei 0 % Recall. Das Modell mit 87 % Accuracy und 60 % Recall ist fachlich trotzdem besser – das zeigt erst der Vergleich.

### Abgrenzung
Die Baseline ist kein Zielwert des Fachbereichs, sondern die Untergrenze: Was ein Modell nicht schlägt, braucht niemand.

### Prüfungsfalle
Eine Modellbewertung ohne Vergleichsmaßstab abgeben – das kostet in Klausur und Fachgespräch regelmäßig Punkte.

### Merksatz
Kein Gütewert ohne Baseline daneben.

Siehe auch: Accuracy · Unausgeglichene Klassen · Balanced Accuracy · Vergleichsmaßstab mitliefern
Mehr: Deep Dive 7, 4.1 · Deep Dive 7, 4.5

## Basic Auth
<!-- id: basic-auth · quellen: DD15 3.3 · stand: 2026-10 -->

Einfaches HTTP-Authentifizierungsverfahren, bei dem Benutzername und Passwort Base64-kodiert im Authorization-Header mitgeschickt werden.

### Erklärung
Der Client sendet bei jeder Anfrage `Authorization: Basic …` mit „benutzer:passwort“ in Base64. Das ist leicht umzusetzen, aber Base64 ist nur eine Kodierung, keine Verschlüsselung – jeder, der mitliest, kann sie zurückwandeln. Basic Auth ist deshalb nur über HTTPS vertretbar.

### Abgrenzung
| Verfahren | Prinzip |
|---|---|
| API-Schlüssel | fester Schlüssel je Anwendung |
| Basic Auth | Benutzername und Passwort bei jeder Anfrage |
| OAuth 2.0 | zeitlich begrenztes Token mit Rechten, Passwort bleibt beim Autorisierungsserver |

### Prüfungsfalle
„Base64 verschlüsselt das Passwort“ – falsch, es ist nur kodiert.

### Merksatz
Basic Auth nie ohne HTTPS.

Siehe auch: API-Schlüssel · OAuth 2.0 · Nur HTTPS · Authentifizierung an APIs
Mehr: Deep Dive 15, 3.3

## BBiG
<!-- id: bbig · quellen: Karte DD13, DD13 1.1 · stand: 2026-10 -->

Berufsbildungsgesetz: regelt die betriebliche Berufsausbildung – Vertrag, Probezeit, Pflichten, Vergütung, Kündigung und Prüfungen.

### Erklärung
Wichtige Regeln: Probezeit mindestens einen, höchstens vier Monate (§ 20); Mindestausbildungsvergütung (§ 17); Anrechnung von Berufsschulzeiten (§ 15); Kündigung nach der Probezeit nur aus wichtigem Grund oder durch den Azubi mit vier Wochen Frist bei Berufsaufgabe, immer schriftlich (§ 22); Verlängerung bei nicht bestandener Prüfung (§ 21); Ausbildungsnachweis als Zulassungsvoraussetzung (§ 43).

### Beispiel
Ein Azubi der Möbelhaus Nordholz GmbH wird nach bestandener Prüfung ohne Vereinbarung weiterbeschäftigt: Nach § 24 BBiG entsteht ein Arbeitsverhältnis auf unbestimmte Zeit.

### Abgrenzung
Das BBiG gilt für den Betrieb; die Berufsschule richtet sich nach Rahmenlehrplan und Schulgesetzen der Länder. Für Minderjährige gilt zusätzlich das JArbSchG.

### Prüfungsfalle
Die Ausbildungsordnung der IHK zuschreiben – sie erlässt das zuständige Bundesministerium.

### Merksatz
Ausbildung im Betrieb: BBiG und Ausbildungsordnung.

Siehe auch: Probezeit · Ausbildungsordnung · JArbSchG · Mindestausbildungsvergütung · Duale Ausbildung
Mehr: Deep Dive 13, 1.1

## BDSG
<!-- id: bdsg · quellen: Karte DD10, DD10 2.2, DD10 2.4 · stand: 2026-10 -->

Bundesdatenschutzgesetz: ergänzt die unmittelbar geltende DSGVO in Deutschland dort, wo sie nationale Regelungen zulässt.

### Erklärung
Die DSGVO geht als EU-Verordnung vor; das BDSG füllt Öffnungsklauseln aus. Prüfungsrelevant sind vor allem § 38 (Pflicht zur Benennung eines Datenschutzbeauftragten ab in der Regel 20 Personen, die ständig automatisiert personenbezogene Daten verarbeiten, Stand 2026), § 35 Abs. 3 (Sperren statt Löschen bei Aufbewahrungspflichten) und § 26 zu Beschäftigtendaten.

### Beispiel
Ein Kunde verlangt Löschung, seine Rechnung muss aber acht Jahre aufbewahrt werden: Die Daten werden gesperrt (Art. 18 DSGVO, § 35 Abs. 3 BDSG) und nach Fristablauf gelöscht.

### Abgrenzung
DSGVO = EU-weit, gilt direkt; BDSG = deutsches Ergänzungsgesetz. Cookies regelt das TDDDG.

### Prüfungsfalle
§ 26 Abs. 1 Satz 1 BDSG noch als eigene Rechtsgrundlage für Beschäftigtendaten nennen – seit EuGH C-34/21 (2023) gilt direkt Art. 6 DSGVO.

### Merksatz
Erst die DSGVO, dann das BDSG für die deutschen Lücken.

Siehe auch: DSGVO · Betrieblicher Datenschutzbeauftragter · Beschäftigtendaten · TDDDG
Mehr: Deep Dive 10, 2.2 · Deep Dive 10, 2.4

## Bearbeitungszeit
<!-- id: bearbeitungszeit · quellen: Karte DD5, DD5 3.1 · stand: 2026-10 -->

Teil der Durchlaufzeit, in dem tatsächlich am Vorgang gearbeitet wird – die Zeit echter Wertschöpfung.

### Erklärung
Die Durchlaufzeit setzt sich aus Bearbeitungs-, Liege-, Transport- und Rüstzeit zusammen. Nur die Bearbeitungszeit schafft Wert; ihr Anteil an der Durchlaufzeit ist der Wertschöpfungsanteil. In der Praxis liegt er oft unter 10 % – der Verbesserungshebel liegt deshalb meist bei den Liegezeiten.

$\text{Wertschöpfungsanteil} = \frac{\text{Bearbeitungszeit}}{\text{Durchlaufzeit}} \cdot 100$

### Beispiel
Reparaturauftrag: Bearbeitungszeit 1,5 h, Liegezeit 28,5 h → Durchlaufzeit 30 h, Wertschöpfungsanteil $\frac{1{,}5}{30} \cdot 100 = 5\,\%$.

### Abgrenzung
Liegezeit = Warten auf den nächsten Schritt; Durchlaufzeit = gesamte Zeit vom Start bis zum Ende.

### Prüfungsfalle
Vorschlagen, die Techniker sollten schneller arbeiten – der Engpass ist fast immer das Warten.

### Merksatz
Gearbeitet wird kurz, gewartet wird lang.

Siehe auch: Durchlaufzeit · Liegezeit · Wertstromanalyse · Lean Management
Mehr: Deep Dive 5, 3.1

## Bedürfnis
<!-- id: bedurfnis · quellen: Karte DD14, DD14 4.1 · stand: 2026-10 -->

Empfinden eines Mangels, verbunden mit dem Wunsch, ihn zu beseitigen.

### Erklärung
Bedürfnisse sind unbegrenzt, die Mittel knapp – daraus entsteht wirtschaftliches Handeln. Die Kette lautet: **Bedürfnis** (Mangelempfinden) → **Bedarf** (Bedürfnis mit Kaufkraft) → **Nachfrage** (am Markt wirksamer Bedarf). Bedürfnisse werden oft nach Dringlichkeit eingeteilt: Existenz-, Kultur- und Luxusbedürfnisse.

### Beispiel
Eine Kundin wünscht sich ein bequemeres Sofa (Bedürfnis). Sie hat 1.500 € dafür eingeplant (Bedarf). Sie bestellt im Onlineshop des Möbelhauses (Nachfrage).

### Abgrenzung
Bedürfnis ohne Geld bleibt Wunsch; erst mit Kaufkraft wird es Bedarf, erst mit Kaufentscheidung Nachfrage.

### Prüfungsfalle
Bedürfnis und Bedarf gleichsetzen – das Unterscheidungsmerkmal ist die Kaufkraft.

### Merksatz
Wunsch – plus Geld – plus Markt.

Siehe auch: Ökonomisches Prinzip · Produktionsfaktoren · Gleichgewichtspreis · Wirtschaftskreislauf
Mehr: Deep Dive 14, 4.1

## Beitragsbemessungsgrenze
<!-- id: beitragsbemessungsgrenze · quellen: Karte DD14, DD14 1.3 · stand: 2026-10 -->

Einkommenshöhe, bis zu der Sozialversicherungsbeiträge berechnet werden; der Teil darüber ist beitragsfrei.

### Erklärung
Die Grenzen werden jährlich an die Lohnentwicklung angepasst und gelten seit 2025 bundeseinheitlich. Werte 2026 (Stand 2026):

| Zweig | Monat | Jahr |
|---|---|---|
| Kranken- und Pflegeversicherung | 5.812,50 € | 69.750 € |
| Renten- und Arbeitslosenversicherung | 8.450 € | 101.400 € |

### Beispiel
Bruttogehalt 7.000 € im Monat: RV-Beitrag (Arbeitnehmer 9,3 %) auf das volle Gehalt, $7.000 \cdot 0{,}093 = 651$ €. KV-Beitrag (allgemeiner Satz, Arbeitnehmer 7,3 %) nur auf 5.812,50 €: $5.812{,}50 \cdot 0{,}073 = 424{,}31$ € – plus halber Zusatzbeitrag.

### Abgrenzung
Die **Versicherungspflichtgrenze** (Jahresarbeitsentgeltgrenze, 2026: 77.400 € im Jahr) entscheidet, ob jemand in die private Krankenversicherung wechseln darf; die Beitragsbemessungsgrenze nur, bis zu welchem Betrag Beiträge anfallen.

### Prüfungsfalle
Beide Grenzen verwechseln oder den Beitrag auf das volle Gehalt über der Grenze rechnen.

### Merksatz
Über der Beitragsbemessungsgrenze wird nichts mehr abgezogen.

Siehe auch: Versicherungspflichtgrenze · Sozialversicherung · Krankenversicherung · Rentenversicherung
Mehr: Deep Dive 14, 1.3

## Benchmarking
<!-- id: benchmarking · quellen: Karte DD5, DD5 6.5 · stand: 2026-10 -->

Systematischer Vergleich von Kennzahlen und Prozessen mit einem Vorbild, um von den Besten zu lernen.

### Erklärung
Es gibt drei Formen: **intern** (Filiale gegen Filiale), **wettbewerbsbezogen** (mit Konkurrenten) und **branchenübergreifend** (mit dem Klassenbesten eines Prozesses, egal aus welcher Branche). Ablauf: Prozess und Kennzahlen festlegen, Vergleichspartner wählen, Daten erheben, Lücken analysieren, Ursachen verstehen, Maßnahmen umsetzen. Ziel ist nicht Kopieren, sondern zu verstehen, warum der andere besser ist.

### Beispiel
Das Möbelhaus vergleicht seine Versandabwicklung (Durchlaufzeit, Fehlerquote) mit der eines großen Onlinehändlers – branchenübergreifendes Benchmarking.

### Abgrenzung
Ein Soll-Ist-Vergleich misst gegen eigene Ziele; Benchmarking misst gegen fremde Bestwerte.

### Prüfungsfalle
Kennzahlen vergleichen, ohne die Definitionen anzugleichen – dann vergleicht man Äpfel mit Birnen.

### Merksatz
Vom Besten lernen, nicht ihn abschreiben.

Siehe auch: KPI · Soll-Ist-Vergleich · SWOT-Analyse · Balanced Scorecard
Mehr: Deep Dive 5, 6.5

## Benutzerbindung
<!-- id: benutzerbindung · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Interaktionsprinzip der ISO 9241-110: Die Gestaltung motiviert dazu, das System weiter zu nutzen.

### Erklärung
Benutzerbindung kam mit der Neufassung der ISO 9241-110 (2020) hinzu; Individualisierbarkeit entfiel. Ein ansprechendes, übersichtliches und vertrauenswürdiges System wird gern und dauerhaft genutzt – das fördert die Akzeptanz neuer Dashboards.

### Beispiel
Das Filial-Dashboard ist aufgeräumt, lädt schnell und zeigt auf einen Blick die wichtigste Kennzahl – die Filialleitung öffnet es täglich freiwillig.

### Prüfungsfalle
Die sieben Prinzipien nach der alten Fassung von 2006 aufzählen (Individualisierbarkeit, Fehlertoleranz, Lernförderlichkeit).

### Merksatz
Wer gern wiederkommt, ist gebunden.

Siehe auch: Interaktionsprinzipien · Gebrauchstauglichkeit · Erlernbarkeit · Robustheit gegen Benutzungsfehler
Mehr: Deep Dive 11, A5

## Beratung
<!-- id: beratung · quellen: DD13 4.2 · stand: 2026-10 -->

Beteiligungsrecht des Betriebsrats, bei dem der Arbeitgeber eine Maßnahme mit ihm gemeinsam erörtern muss, aber allein entscheidet.

### Erklärung
In der Stufenfolge der Beteiligungsrechte liegt die Beratung zwischen Anhörung und Widerspruch: Der Betriebsrat kann Vorschläge machen und Bedenken äußern, die Maßnahme aber nicht verhindern. Typisch ist die Gestaltung von Arbeitsplätzen, Arbeitsabläufen und technischen Anlagen (§ 90 BetrVG).

### Beispiel
Das Möbelhaus plant neue Bildschirmarbeitsplätze in der Disposition und berät die Anordnung rechtzeitig mit dem Betriebsrat.

### Abgrenzung
Anhörung = Betriebsrat wird gehört (z. B. vor Kündigungen); Beratung = gemeinsame Erörterung; Mitbestimmung = ohne Zustimmung keine Maßnahme.

### Merksatz
Beraten heißt mitreden, nicht mitentscheiden.

Siehe auch: Beteiligungsrechte · Anhörung · Mitbestimmung · Information
Mehr: Deep Dive 13, 4.2

## Berechtigtes Interesse
<!-- id: berechtigtes-interesse · quellen: Karte DD10, DD10 2.2 · stand: 2026-10 -->

Rechtsgrundlage nach Art. 6 Abs. 1 lit. f DSGVO: Verarbeitung ist zulässig, wenn das Interesse des Verantwortlichen nach Abwägung die Interessen der Betroffenen überwiegt.

### Erklärung
Geprüft wird in drei Schritten: Liegt ein berechtigtes Interesse vor (rechtlich, wirtschaftlich, ideell)? Ist die Verarbeitung dafür erforderlich? Überwiegen nicht die Interessen und Grundrechte der Betroffenen – unter Berücksichtigung ihrer vernünftigen Erwartungen? Die Abwägung ist zu dokumentieren (Rechenschaftspflicht). Betroffene können nach Art. 21 widersprechen.

### Beispiel
Das Möbelhaus prüft Bestellungen automatisiert auf Betrugsmuster – berechtigtes Interesse an Betrugsprävention, Kunden rechnen mit solchen Prüfungen.

### Abgrenzung
Einwilligung (lit. a) muss eingeholt werden und ist widerrufbar; berechtigtes Interesse braucht keine Zustimmung, aber eine Abwägung und eröffnet ein Widerspruchsrecht.

### Prüfungsfalle
Das berechtigte Interesse als Freibrief verstehen – ohne dokumentierte Abwägung trägt es nicht.

### Merksatz
Eigenes Interesse plus Abwägung plus Dokumentation.

Siehe auch: Rechtsgrundlagen · Einwilligung · Vertragserfüllung · Rechenschaftspflicht
Mehr: Deep Dive 10, 2.2

## Bereinigen
<!-- id: bereinigen · quellen: DD8 3.1 · stand: 2026-10 -->

Transformationsschritt im ETL-Prozess, in dem fehlende Werte behandelt, Dubletten entfernt und Ausreißer geprüft werden.

### Erklärung
Bereinigen ist Teil von T – Transform, neben Vereinheitlichen, Harmonisieren, Anreichern, Aggregieren und Prüfen. Fehlerhafte Sätze werden nicht stillschweigend verworfen, sondern in eine Quarantäne ausgeleitet und protokolliert, damit die Ursache in der Quelle behoben werden kann.

### Beispiel
Beim nächtlichen Laden der Bestellungen werden doppelte Kundensätze zusammengeführt, fehlende Postleitzahlen markiert und ein Auftragswert von 99.999 € zur Prüfung ausgeleitet.

### Abgrenzung
Vereinheitlichen gleicht Formate an (Datum, Einheit); Bereinigen beseitigt fehlerhafte oder doppelte Inhalte.

### Merksatz
Bereinigen heißt korrigieren und dokumentieren, nicht löschen und vergessen.

Siehe auch: ETL · Dublettenbereinigung · Quarantäne · Fehlende Werte · Ausreißer
Mehr: Deep Dive 8, 3.1

## Bereitstellung
<!-- id: bereitstellung · quellen: DD6 6.1 · stand: 2026-10 -->

Überführung eines Analyseergebnisses in die Nutzung – als Bericht, Dashboard, automatisierter Prozess oder Schnittstelle.

### Erklärung
Die Bereitstellung gehört zur CRISP-DM-Phase Deployment. Mit ihr beginnt der Betrieb: Die Modellgüte wird laufend überwacht (Monitoring), bei Model Drift wird nachtrainiert, Datenquellen, Annahmen und Grenzen werden dokumentiert und übergeben.

### Beispiel
Das Reklamationsmodell liefert jeden Morgen eine Liste gefährdeter Aufträge an die Disposition, die Trefferquote wird monatlich geprüft.

### Prüfungsfalle
Das Projekt mit dem trainierten Modell für abgeschlossen erklären – ohne Bereitstellung und Monitoring entsteht kein Nutzen.

### Merksatz
Nach dem Modell ist vor dem Betrieb.

Siehe auch: CRISP-DM · Monitoring · Model Drift · Dokumentation und Übergabe
Mehr: Deep Dive 6, 6.1

## Berufsgenossenschaft
<!-- id: berufsgenossenschaft · quellen: Karte DD14, DD14 5.1 · stand: 2026-10 -->

Träger der gesetzlichen Unfallversicherung für die gewerbliche Wirtschaft; erlässt Unfallverhütungsvorschriften und überwacht deren Einhaltung.

### Erklärung
Die Beiträge zahlt allein der Arbeitgeber. Versichert sind Arbeitsunfälle, Wegeunfälle und Berufskrankheiten; seit 2021 ist auch das Homeoffice wie der Betrieb versichert. Spitzenverband ist die DGUV; wichtig sind DGUV Vorschrift 1 (Grundsätze der Prävention) und DGUV Vorschrift 3 (Prüfung elektrischer Geräte). Ein Unfall mit mehr als drei Tagen Arbeitsunfähigkeit ist innerhalb von drei Tagen anzuzeigen.

### Beispiel
Eine Mitarbeiterin des Möbelhauses stürzt auf dem direkten Weg zur Arbeit und ist eine Woche krank – die Berufsgenossenschaft trägt die Kosten, der Betrieb erstattet die Unfallanzeige.

### Abgrenzung
Die Krankenkasse zahlt bei privaten Unfällen und Krankheit; die Berufsgenossenschaft bei Arbeits- und Wegeunfällen.

### Prüfungsfalle
Annehmen, der Arbeitnehmer zahle die Hälfte des Unfallversicherungsbeitrags.

### Merksatz
Unfall bei der Arbeit – die BG zahlt, der Arbeitgeber finanziert.

Siehe auch: Unfallversicherung · DGUV · Wegeunfall · Arbeitsschutz
Mehr: Deep Dive 14, 5.1

## Berufsschule
<!-- id: berufsschule · quellen: DD13 1.1 · stand: 2026-10 -->

Lernort der dualen Ausbildung, der Allgemeinbildung und Fachtheorie nach dem Rahmenlehrplan vermittelt.

### Erklärung
Neben dem Ausbildungsbetrieb ist die Berufsschule der zweite Lernort. Ihr Unterricht folgt dem Rahmenlehrplan der Kultusministerkonferenz, der mit der Ausbildungsordnung abgestimmt ist; im Übrigen gelten die Schulgesetze der Länder. Der Betrieb muss den Azubi für den Unterricht freistellen; ein Berufsschultag mit mehr als fünf Unterrichtsstunden wird einmal pro Woche mit der durchschnittlichen täglichen Ausbildungszeit angerechnet (§ 15 BBiG).

### Abgrenzung
| Lernort | Grundlage | Inhalt |
|---|---|---|
| Ausbildungsbetrieb | Ausbildungsordnung | Praxis |
| Berufsschule | Rahmenlehrplan | Theorie, Allgemeinbildung |
| IHK | BBiG | Überwachung, Prüfungen |

### Prüfungsfalle
Der Berufsschule die Abschlussprüfung zuschreiben – die nimmt die IHK ab.

### Merksatz
Betrieb nach Ausbildungsordnung, Schule nach Rahmenlehrplan.

Siehe auch: Duale Ausbildung · Rahmenlehrplan · Ausbildungsbetrieb · IHK
Mehr: Deep Dive 13, 1.1

## Beschäftigtendaten
<!-- id: beschaftigtendaten · quellen: DD10 2.2 · stand: 2026-10 -->

Personenbezogene Daten von Bewerbern und Beschäftigten, die der Arbeitgeber für das Beschäftigungsverhältnis verarbeitet.

### Erklärung
Die frühere Generalklausel § 26 Abs. 1 Satz 1 BDSG darf nach dem EuGH-Urteil vom 30.03.2023 (C-34/21) nicht mehr als eigene Rechtsgrundlage dienen; das BAG hat das 2025 bestätigt. Rechtsgrundlage ist direkt die DSGVO: Art. 6 Abs. 1 lit. b (Arbeitsvertrag), lit. c (z. B. Lohnsteuer, Sozialversicherung), lit. f oder eine **Betriebsvereinbarung** nach Art. 88 DSGVO, die die DSGVO voll einhalten muss. Ein Beschäftigtendatengesetz ist nicht verabschiedet (Stand 2026). Die Einwilligung ist wegen des Abhängigkeitsverhältnisses nur eingeschränkt freiwillig.

### Beispiel
Ein Dashboard mit Bearbeitungszeiten je Techniker braucht eine Betriebsvereinbarung (Mitbestimmung nach § 87 Abs. 1 Nr. 6 BetrVG), Aggregation auf Teamebene und enge Zugriffsrechte.

### Prüfungsfalle
Mitarbeiterauswertungen auf eine Einwilligung stützen – die Freiwilligkeit ist zweifelhaft.

### Merksatz
Beschäftigtendaten: DSGVO direkt, Betriebsrat immer mitdenken.

Siehe auch: Betriebsvereinbarung · BDSG · Einwilligung · Mitbestimmung des Betriebsrats
Mehr: Deep Dive 10, 2.2

## Besitz
<!-- id: besitz · quellen: Karte DD14, DD14 2.4, DD10 4.3 · stand: 2026-10 -->

Die tatsächliche Herrschaft über eine Sache – im Unterschied zum Eigentum als rechtlicher Herrschaft.

### Erklärung
Besitzer ist, wer die Sache tatsächlich in der Hand hat (§ 854 BGB); Eigentümer ist, wem sie rechtlich gehört (§ 903 BGB). Beides fällt oft zusammen, aber nicht immer. Bei beweglichen Sachen geht das Eigentum durch Einigung und Übergabe über; beim Eigentumsvorbehalt erhält der Käufer zunächst nur den Besitz.

### Beispiel
Ein Kunde kauft ein Sofa auf Raten unter Eigentumsvorbehalt: Er ist Besitzer, das Möbelhaus bleibt bis zur letzten Rate Eigentümer. Ebenso: Der Mieter besitzt die Wohnung, der Vermieter ist Eigentümer.

### Abgrenzung
In der IT-Sicherheit ist **Besitz** einer der drei Authentifizierungsfaktoren (Token, Smartphone) neben Wissen und Sein.

### Prüfungsfalle
„Der Dieb ist Eigentümer des Fahrrads“ – er ist nur (unrechtmäßiger) Besitzer.

### Merksatz
Besitz hat man in der Hand, Eigentum auf dem Papier.

Siehe auch: Eigentum · Eigentumsvorbehalt · Mietvertrag · Mehr-Faktor-Authentifizierung
Mehr: Deep Dive 14, 2.4 · Deep Dive 10, 4.3

## Besondere Kategorien personenbezogener Daten
<!-- id: besondere-kategorien-personenbezogener-daten · quellen: Karte DD10, DD10 2.2 · stand: 2026-10 -->

Besonders schützenswerte Daten nach Art. 9 DSGVO, deren Verarbeitung grundsätzlich verboten und nur ausnahmsweise erlaubt ist.

### Erklärung
Dazu gehören: ethnische Herkunft, politische Meinungen, religiöse oder weltanschauliche Überzeugungen, Gewerkschaftszugehörigkeit, genetische Daten, biometrische Daten zur eindeutigen Identifizierung, Gesundheitsdaten sowie Sexualleben und sexuelle Orientierung. Ausnahmen nach Art. 9 Abs. 2 sind u. a. die ausdrückliche Einwilligung oder Pflichten aus dem Arbeits- und Sozialrecht. Solche Verarbeitungen erfordern meist eine Datenschutz-Folgenabschätzung.

### Beispiel
Die Personalabteilung speichert Krankmeldungen (Gesundheitsdaten) wegen der Entgeltfortzahlung – zulässig über die arbeitsrechtliche Ausnahme, aber mit streng begrenztem Zugriff. Für ein Krankheitstage-Dashboard je Mitarbeiter fehlt dagegen eine Grundlage.

### Abgrenzung
Normale personenbezogene Daten brauchen eine Rechtsgrundlage nach Art. 6; besondere Kategorien zusätzlich eine Ausnahme nach Art. 9.

### Prüfungsfalle
Die Kirchensteuermerkmale auf der Lohnabrechnung vergessen – auch die Religionszugehörigkeit ist eine besondere Kategorie.

### Merksatz
Art. 9: erst verboten, dann eng erlaubt.

Siehe auch: Personenbezogene Daten · Einwilligung · Datenschutz-Folgenabschätzung · DSGVO
Mehr: Deep Dive 10, 2.2

## Besonderer Kündigungsschutz
<!-- id: besonderer-kundigungsschutz · quellen: Karte DD13, DD13 3.4 · stand: 2026-10 -->

Zusätzlicher Schutz bestimmter Beschäftigtengruppen, denen nur eingeschränkt oder mit behördlicher Zustimmung gekündigt werden darf.

### Erklärung
Er gilt neben dem allgemeinen Kündigungsschutzgesetz, teils unabhängig von Betriebsgröße und Wartezeit:

| Gruppe | Regel |
|---|---|
| Schwangere, Mütter bis vier Monate nach Entbindung | Kündigungsverbot (MuSchG) |
| Beschäftigte in Elternzeit | Kündigungsverbot (BEEG), Ausnahme nur mit Behördenzustimmung |
| Schwerbehinderte Menschen | Zustimmung des Integrationsamts (SGB IX) |
| Betriebsrats- und JAV-Mitglieder | nur außerordentliche Kündigung mit Zustimmung des Betriebsrats (KSchG, BetrVG) |
| Auszubildende nach der Probezeit | nur aus wichtigem Grund (§ 22 BBiG) |

### Beispiel
Ein JAV-Mitglied des Möbelhauses kann nicht betriebsbedingt ordentlich gekündigt werden.

### Prüfungsfalle
Glauben, der besondere Schutz mache jede Kündigung unmöglich – eine außerordentliche Kündigung aus wichtigem Grund bleibt mit Zustimmung möglich.

### Merksatz
Schwanger, Elternzeit, schwerbehindert, Betriebsrat, Azubi – hier wird es schwer.

Siehe auch: Kündigungsschutzgesetz · Außerordentliche Kündigung · Schwerbehinderte Menschen · Elternzeit · Mutterschutz
Mehr: Deep Dive 13, 3.4

## Bestimmtheitsmaß
<!-- id: bestimmtheitsmass · quellen: Karte DD4, DD4 2.3 · stand: 2026-10 -->

R²: Anteil der Streuung der Zielgröße y, den das Regressionsmodell erklärt.

### Erklärung
Allgemein gilt $R^2 = 1 - \frac{\sum e^2}{S_{yy}}$ (unerklärte durch gesamte Streuung). Auf den Trainingsdaten liegt R² zwischen 0 und 1, auf Testdaten kann es negativ werden, wenn das Modell schlechter ist als der Mittelwert. Bei der einfachen linearen Regression gilt $R^2 = r^2$. Ein hohes R² beweist weder Kausalität noch Prognosefähigkeit außerhalb des beobachteten Bereichs.

### Beispiel
Werbebudget und Umsatz über fünf Monate: $r = \frac{64}{\sqrt{10 \cdot 424}} = 0{,}983$, also $R^2 = 0{,}983^2 = 0{,}966$. Rund 96,6 % der Umsatzschwankungen werden durch das Werbebudget erklärt. Kontrolle: $1 - \frac{14{,}4}{424} = 0{,}966$.

### Abgrenzung
r (Korrelationskoeffizient) misst Stärke und Richtung zwischen −1 und +1; R² misst den erklärten Anteil und hat kein Vorzeichen.

### Prüfungsfalle
„R² = 0,95, also ist das Werbebudget die Ursache“ – R² sagt nichts über Kausalität.

### Merksatz
R² sagt, wie viel erklärt ist – nicht warum.

Siehe auch: R² · Korrelationskoeffizient nach Pearson · Regressionsgerade · Grenzen von R² · Kausalität
Mehr: Deep Dive 4, 2.3

## Beteiligungsrechte
<!-- id: beteiligungsrechte · quellen: Karte DD13, DD13 4.2 · stand: 2026-10 -->

Abgestufte Rechte des Betriebsrats nach dem BetrVG, vom schwachen Informationsrecht bis zur echten Mitbestimmung.

### Erklärung
| Stufe | Bedeutung | Beispiel |
|---|---|---|
| Information | Arbeitgeber muss unterrichten | wirtschaftliche Lage, Personalplanung |
| Anhörung | Betriebsrat muss gehört werden | jede Kündigung (§ 102), sonst unwirksam |
| Beratung | gemeinsame Erörterung | Arbeitsplatzgestaltung |
| Widerspruch / Zustimmungsverweigerung | Maßnahme kann blockiert werden | Einstellung, Versetzung (§ 99, mehr als 20 Wahlberechtigte im Unternehmen) |
| Mitbestimmung | ohne Zustimmung keine Maßnahme | soziale Angelegenheiten (§ 87) |

Bei Streit in Mitbestimmungsfragen entscheidet die Einigungsstelle verbindlich.

### Beispiel
Process Mining mit Resource-Feld kann Leistung einzelner Beschäftigter auswerten – nach § 87 Abs. 1 Nr. 6 mitbestimmungspflichtig, die technische Eignung genügt.

### Prüfungsfalle
Den Widerspruch des Betriebsrats gegen eine Kündigung für ein Veto halten – er verhindert sie nicht; nur die fehlende Anhörung macht sie unwirksam.

### Merksatz
Informieren, anhören, beraten, widersprechen, mitbestimmen – von schwach nach stark.

Siehe auch: Betriebsrat · Mitbestimmung · Anhörung · Einigungsstelle · BetrVG
Mehr: Deep Dive 13, 4.2

## Betriebliche Altersversorgung
<!-- id: betriebliche-altersversorgung · quellen: Karte DD14, DD14 1.5 · stand: 2026-10 -->

Zweite Säule der Altersvorsorge: Versorgungsleistungen, die der Arbeitgeber zusagt oder über Entgeltumwandlung finanziert.

### Erklärung
Die gesetzliche Rente allein sichert den Lebensstandard meist nicht. Bei der **Entgeltumwandlung** wird ein Teil des Bruttolohns steuer- und sozialabgabenfrei in eine Betriebsrente eingezahlt. Beschäftigte haben einen Anspruch darauf bis 4 % der Beitragsbemessungsgrenze der Rentenversicherung (§ 1a BetrAVG; 2026: $101.400 \cdot 0{,}04 = 4.056$ € im Jahr); spart der Arbeitgeber dadurch Sozialabgaben, muss er 15 % des umgewandelten Betrags zuschießen.

### Beispiel
Ein Mitarbeiter wandelt 100 € seines Bruttogehalts im Monat um; das Möbelhaus legt 15 € Zuschuss dazu – 115 € fließen in die Betriebsrente.

### Abgrenzung
| Säule | Beispiel |
|---|---|
| 1. gesetzlich | gesetzliche Rente (Umlageverfahren) |
| 2. betrieblich | Direktversicherung, Pensionskasse |
| 3. privat | private Rentenversicherung, Fonds, Immobilien |

### Merksatz
Zweite Säule: der Betrieb spart mit.

Siehe auch: Drei-Säulen-Modell der Altersvorsorge · Gesetzliche Rente · Private Vorsorge · Umlageverfahren
Mehr: Deep Dive 14, 1.5

## Betrieblicher Datenschutzbeauftragter
<!-- id: betrieblicher-datenschutzbeauftragter · quellen: DD10 2.4 · stand: 2026-10 -->

Vom Unternehmen benannte Person, die zum Datenschutz berät und die Einhaltung überwacht; in Deutschland ab in der Regel 20 ständig mit automatisierter Verarbeitung Beschäftigten Pflicht.

### Erklärung
Nach § 38 Abs. 1 BDSG (Stand 2026) besteht die Pflicht, wenn in der Regel mindestens 20 Personen ständig mit der automatisierten Verarbeitung personenbezogener Daten beschäftigt sind – unabhängig von der Zahl, wenn eine Datenschutz-Folgenabschätzung nötig ist oder Daten geschäftsmäßig zur Übermittlung oder Markt- und Meinungsforschung verarbeitet werden. Die Bundesregierung plant, diese nationale Schwelle zu streichen; dann gälte nur noch Art. 37 DSGVO – vor der Prüfung den Stand prüfen. Der Datenschutzbeauftragte ist weisungsfrei, berichtet der Geschäftsleitung und darf nicht benachteiligt werden (Art. 38 DSGVO).

### Beispiel
Im Möbelhaus arbeiten 60 Beschäftigte regelmäßig mit Kunden- und Personaldaten am PC – ein Datenschutzbeauftragter (intern oder extern) ist zu benennen.

### Prüfungsfalle
Den Datenschutzbeauftragten für verantwortlich halten – er berät und überwacht, die Verantwortung bleibt beim Unternehmen.

### Merksatz
20 Köpfe am Bildschirm mit Personendaten – DSB benennen (Stand 2026).

Siehe auch: Datenschutzbeauftragter · BDSG · Datenschutz-Folgenabschätzung · Verantwortlicher
Mehr: Deep Dive 10, 2.4

## Betriebsrat
<!-- id: betriebsrat · quellen: Karte DD13, DD13 4.1, DD12 1.4 · stand: 2026-10 -->

Gewählte Vertretung der Arbeitnehmer im Betrieb, die ihre Interessen gegenüber dem Arbeitgeber wahrnimmt.

### Erklärung
Ein Betriebsrat kann gewählt werden, wenn in der Regel mindestens fünf ständige wahlberechtigte Arbeitnehmer beschäftigt sind, von denen drei wählbar sind (§ 1 BetrVG). Wahlberechtigt sind Arbeitnehmer ab 16 Jahren, wählbar ab 18 Jahren nach sechs Monaten Betriebszugehörigkeit. Die Amtszeit beträgt vier Jahre; die Kosten trägt der Arbeitgeber. Die Größe richtet sich nach der Zahl der Wahlberechtigten (5–20: 1, 21–50: 3, 51–100: 5, 101–200: 7, 201–400: 9).

### Beispiel
Das Möbelhaus hat 140 wahlberechtigte Beschäftigte → Betriebsrat mit 7 Mitgliedern. In einem Datenprojekt ist er ein Stakeholder mit hohem Einfluss, sobald Leistungs- oder Verhaltensdaten auswertbar sind.

### Abgrenzung
Die JAV vertritt Jugendliche und Azubis, aber nur über den Betriebsrat; die Gewerkschaft verhandelt Tarifverträge, der Betriebsrat Betriebsvereinbarungen.

### Prüfungsfalle
Den Betriebsrat erst nach der Einführung eines Dashboards informieren – Mitbestimmung muss vorher eingeholt werden.

### Merksatz
Ab 5 wählbar, ab 16 wählen, ab 18 gewählt werden, 4 Jahre im Amt.

Siehe auch: BetrVG · Beteiligungsrechte · Betriebsvereinbarung · Jugend- und Auszubildendenvertretung · Stakeholderanalyse
Mehr: Deep Dive 13, 4.1 · Deep Dive 12, 1.4

## Betriebsvereinbarung
<!-- id: betriebsvereinbarung · quellen: Karte DD13, DD13 4.4 · stand: 2026-10 -->

Schriftliche Vereinbarung zwischen Arbeitgeber und Betriebsrat, die unmittelbar für alle Beschäftigten des Betriebs gilt.

### Erklärung
Betriebsvereinbarungen (§ 77 BetrVG) regeln vor allem mitbestimmungspflichtige Angelegenheiten wie Arbeitszeit oder die Einführung technischer Überwachungseinrichtungen. Sie dürfen nicht regeln, was üblicherweise durch Tarifvertrag geregelt wird (**Tarifvorbehalt**). In der Rangfolge stehen sie unter dem Tarifvertrag und über dem Arbeitsvertrag; Abweichungen zugunsten des Arbeitnehmers bleiben möglich (Günstigkeitsprinzip). Nach Art. 88 DSGVO können sie Rechtsgrundlage für die Verarbeitung von Beschäftigtendaten sein.

### Beispiel
Vor dem Start des Process Mining im Reparaturservice schließt das Möbelhaus eine Betriebsvereinbarung: Auswertung nur auf Teamebene, Mindestgruppengröße, Zugriff nur für die Prozessverantwortlichen.

### Abgrenzung
Tarifvertrag: Arbeitgeber(verband) und Gewerkschaft; Betriebsvereinbarung: Arbeitgeber und Betriebsrat; Arbeitsvertrag: Arbeitgeber und einzelner Beschäftigter.

### Prüfungsfalle
Eine Betriebsvereinbarung über Lohnhöhen in einem tarifgebundenen Bereich – das sperrt der Tarifvorbehalt.

### Merksatz
Betriebsrat und Arbeitgeber unterschreiben, alle im Betrieb sind gebunden.

Siehe auch: Betriebsrat · Tarifvertrag · Günstigkeitsprinzip · Beschäftigtendaten · Mitbestimmung des Betriebsrats
Mehr: Deep Dive 13, 4.4

## Betriebsversammlung
<!-- id: betriebsversammlung · quellen: DD13 4.1 · stand: 2026-10 -->

Versammlung aller Arbeitnehmer des Betriebs, die der Betriebsrat einmal in jedem Kalendervierteljahr einberuft.

### Erklärung
Der Betriebsrat erstattet dort seinen Tätigkeitsbericht (§ 43 BetrVG); der Arbeitgeber ist einzuladen und berichtet mindestens einmal im Jahr über Personalwesen und wirtschaftliche Lage. Die Versammlung findet grundsätzlich während der Arbeitszeit statt, die Teilnahme wird wie Arbeitszeit vergütet (§ 44 BetrVG).

### Beispiel
In der Betriebsversammlung des Möbelhauses stellt der Betriebsrat die neue Betriebsvereinbarung zum Process Mining vor.

### Prüfungsfalle
Sie für ein Beschlussorgan halten – sie kann dem Betriebsrat Anträge unterbreiten, aber nicht anstelle des Betriebsrats entscheiden.

### Merksatz
Einmal im Quartal: Betriebsrat berichtet allen.

Siehe auch: Betriebsrat · BetrVG · Beteiligungsrechte
Mehr: Deep Dive 13, 4.1

## Betroffene Person
<!-- id: betroffene-person · quellen: Karte DD10, DD10 Teil 1 · stand: 2026-10 -->

Die identifizierte oder identifizierbare natürliche Person, deren personenbezogene Daten verarbeitet werden (Art. 4 Nr. 1 DSGVO).

### Erklärung
Die DSGVO schützt nur natürliche Personen. Ihnen stehen die Betroffenenrechte zu (Auskunft, Löschung, Widerspruch usw.). Identifizierbar ist eine Person schon, wenn sie mit vertretbarem Aufwand bestimmt werden kann – etwa über Kundennummer, IP-Adresse oder Personalnummer.

### Beispiel
Die Huber GmbH als Firma ist keine betroffene Person; ihr Ansprechpartner Herr Huber mit Name und Durchwahl dagegen schon.

### Abgrenzung
Verantwortlicher entscheidet über Zweck und Mittel, Auftragsverarbeiter verarbeitet weisungsgebunden, betroffene Person ist die, um deren Daten es geht.

### Merksatz
Betroffen ist immer ein Mensch, nie eine Firma.

Siehe auch: Personenbezogene Daten · Betroffenenrechte · Verantwortlicher · Natürliche Personen
Mehr: Deep Dive 10, Teil 1

## Betroffenenrechte
<!-- id: betroffenenrechte · quellen: Karte DD10, DD10 2.3 · stand: 2026-10 -->

Rechte, die die DSGVO betroffenen Personen gegenüber dem Verantwortlichen einräumt.

### Erklärung
| Recht | Artikel |
|---|---|
| Information bei Erhebung | 13/14 |
| Auskunft | 15 |
| Berichtigung | 16 |
| Löschung („Vergessenwerden“) | 17 |
| Einschränkung der Verarbeitung | 18 |
| Datenübertragbarkeit | 20 |
| Widerspruch | 21 |
| keine ausschließlich automatisierte Entscheidung | 22 |

Anträge sind unverzüglich, spätestens innerhalb eines Monats zu beantworten; bei komplexen Fällen ist eine Verlängerung um zwei Monate möglich (Art. 12 Abs. 3). Die Auskunft ist grundsätzlich kostenlos.

### Beispiel
Ein Kunde verlangt Löschung, die Rechnung unterliegt aber acht Jahren Aufbewahrungspflicht (Stand 2026): Die Rechnungsdaten werden gesperrt, Newsletter- und Werbedaten sofort gelöscht.

### Prüfungsfalle
Die Monatsfrist als „30 Werktage“ oder die Auskunft als kostenpflichtig darstellen.

### Merksatz
Auskunft, Berichtigung, Löschung, Einschränkung, Übertragung, Widerspruch – Antwort binnen eines Monats.

Siehe auch: Betroffene Person · DSGVO · Rechenschaftspflicht · Widerrufsrecht
Mehr: Deep Dive 10, 2.3

## BetrVG
<!-- id: betrvg · quellen: Karte DD13, DD13 4.1, DD13 4.2 · stand: 2026-10 -->

Betriebsverfassungsgesetz: regelt Wahl, Aufgaben und Beteiligungsrechte von Betriebsrat und Jugend- und Auszubildendenvertretung.

### Erklärung
Wichtige Paragrafen: § 1 (Errichtung ab fünf Wahlberechtigten), §§ 7–9 (Wahlrecht, Wählbarkeit, Größe), § 43 (Betriebsversammlung), § 77 (Betriebsvereinbarung), § 87 (Mitbestimmung in sozialen Angelegenheiten, Nr. 6: technische Überwachungseinrichtungen), § 99 (personelle Einzelmaßnahmen), § 102 (Anhörung vor Kündigung).

### Beispiel
Ein neues Dashboard mit Bearbeitungszeiten je Mitarbeiter fällt unter § 87 Abs. 1 Nr. 6 BetrVG – ohne Zustimmung des Betriebsrats darf es nicht eingeführt werden.

### Abgrenzung
Das BetrVG regelt die Mitbestimmung im Betrieb; die Mitbestimmung im Aufsichtsrat regeln Drittelbeteiligungs- und Mitbestimmungsgesetz.

### Merksatz
Betriebsrat-Fragen beantwortet das BetrVG.

Siehe auch: Betriebsrat · Beteiligungsrechte · Mitbestimmung · Unternehmensmitbestimmung
Mehr: Deep Dive 13, 4.1 · Deep Dive 13, 4.2

## Bewegungsdaten
<!-- id: bewegungsdaten · quellen: Karte DD15, DD15 1.1, DD9 5.4 · stand: 2026-10 -->

Daten, die laufend im Geschäftsprozess entstehen und sich auf Stammdaten beziehen, z. B. Bestellungen, Buchungen, Lieferungen.

### Erklärung
Bewegungsdaten sind zeitpunktbezogen, entstehen in großer Menge und werden nach der Erfassung kaum noch geändert. Sie verweisen über Fremdschlüssel auf Stammdaten (Kunde, Artikel). Im Data Warehouse landen sie typischerweise in Faktentabellen, Stammdaten in Dimensionstabellen.

### Beispiel
Die Bestellung 100 vom 03.03.2026 (Bewegungsdaten) verweist auf den Kunden Huber GmbH und den Artikel Ecksofa Lund (Stammdaten).

### Abgrenzung
| | Stammdaten | Bewegungsdaten |
|---|---|---|
| Lebensdauer | lang, selten geändert | laufend neu |
| Beispiel | Kunden, Artikel, Lieferanten | Bestellungen, Buchungen |
| Fehlerwirkung | wirkt in jeden Vorgang | betrifft einen Vorgang |

### Prüfungsfalle
Den Artikelpreis als Bewegungsdatum einordnen – der aktuelle Listenpreis ist Stammdatum, der Preis zum Bestellzeitpunkt gehört zur Bestellposition.

### Merksatz
Stammdaten bleiben, Bewegungsdaten bewegen sich.

Siehe auch: Stammdaten · Metadaten · Faktentabelle · Master Data Management
Mehr: Deep Dive 15, 1.1 · Deep Dive 9, 5.4

## Beweislastumkehr beim Verbrauchsgüterkauf
<!-- id: beweislastumkehr-beim-verbrauchsguterkauf · quellen: Karte DD14, DD14 2.5 · stand: 2026-10 -->

Zeigt sich beim Kauf durch einen Verbraucher von einem Unternehmer innerhalb eines Jahres ein Mangel, wird vermutet, dass er schon bei Gefahrübergang vorlag (§ 477 BGB).

### Erklärung
Normalerweise muss der Käufer beweisen, dass die Sache bei Übergabe mangelhaft war. Beim Verbrauchsgüterkauf kehrt § 477 BGB das im ersten Jahr nach Gefahrübergang (in der Regel die Übergabe) um: Der Verkäufer muss beweisen, dass der Mangel damals noch nicht vorlag. Bei lebenden Tieren gilt die Vermutung sechs Monate. Die Gewährleistungsfrist von zwei Jahren bei neuen Sachen bleibt davon unberührt.

### Beispiel
Nach neun Monaten löst sich die Naht eines Sofas, das eine Privatkundin beim Möbelhaus gekauft hat. Das Möbelhaus muss beweisen, dass die Naht bei Lieferung in Ordnung war – sonst muss es nachbessern oder ersetzen.

### Abgrenzung
Gewährleistung = gesetzliche Mängelhaftung (zwei Jahre); Garantie = freiwilliges Versprechen; Beweislastumkehr = Regel, wer was beweisen muss.

### Prüfungsfalle
Die Beweislastumkehr mit der Gewährleistungsdauer verwechseln oder sie auf Käufe zwischen zwei Unternehmen anwenden.

### Merksatz
Im ersten Jahr muss der Händler beweisen.

Siehe auch: Gewährleistung · Sachmangel · Garantie · Mangelhafte Lieferung
Mehr: Deep Dive 14, 2.5

## Beziehung
<!-- id: beziehung · quellen: Karte DD2, DD2 1.2 · stand: 2026-10 -->

Verbindung zwischen Entitäten im ER-Modell, z. B. Kunde *erteilt* Bestellung; in Chen-Notation als Raute gezeichnet.

### Erklärung
Beziehungen werden mit einem Verb benannt und durch Kardinalitäten näher bestimmt (1:1, 1:n, m:n oder Min-Max-Angaben). Sie können eigene Attribute tragen, die weder zur einen noch zur anderen Entität allein gehören. Bei der Überführung ins Relationenmodell wird eine 1:n-Beziehung zum Fremdschlüssel auf der n-Seite, eine m:n-Beziehung zu einer eigenen Zwischentabelle.

### Beispiel
Bestellung *enthält* Produkt (m:n) mit dem Attribut menge – daraus wird die Tabelle bestellposition(bestell_id, produkt_id, menge).

### Abgrenzung
Entität = Objekt (Rechteck), Attribut = Eigenschaft (Ellipse), Beziehung = Verbindung (Raute).

### Prüfungsfalle
Das Attribut menge an Bestellung oder Produkt hängen – es gehört zur Beziehung.

### Merksatz
Entitäten sind Substantive, Beziehungen sind Verben.

Siehe auch: Entität · Kardinalität · Chen-Notation · Zwischentabelle · Rekursive Beziehung
Mehr: Deep Dive 2, 1.2

## Bias
<!-- id: bias · quellen: Karte DD6, DD6 6.2 · stand: 2026-10 -->

Verzerrung, durch die ein Modell Benachteiligungen aus seinen Trainingsdaten übernimmt – auch über Stellvertretermerkmale.
Auch: Bias / Verzerrung

### Erklärung
Ein Modell lernt die Muster seiner Daten einschließlich vorhandener Ungleichbehandlungen. Selbst wenn geschützte Merkmale wie Geschlecht oder Herkunft entfernt werden, können **Stellvertretermerkmale** (Proxys) wie die Postleitzahl sie indirekt abbilden. Ursachen sind auch nicht repräsentative Stichproben. Gegenmaßnahmen: Datenbasis auf Repräsentativität prüfen, Ergebnisse nach Teilgruppen auswerten, menschliche Kontrolle vorsehen.

### Beispiel
Ein Bonitätsmodell für Ratenkäufe lehnt Kunden aus bestimmten Stadtteilen überdurchschnittlich oft ab – die Postleitzahl wirkt als Ersatz für soziale Herkunft.

### Abgrenzung
In der Statistik bezeichnet „Bias“ auch den systematischen Fehler eines Schätzers bzw. die Verzerrung durch zu einfache Modelle (Underfitting); im Prüfungskontext DSGVO und Ethik ist die Benachteiligung von Gruppen gemeint.

In einem neuronalen Netz ist der Bias dagegen eine lernbare Zahl jedes Neurons, die zur gewichteten Summe addiert wird (z = Σ wᵢ · xᵢ + b). Er verschiebt die Schwelle, ab der das Neuron feuert, und hat mit Benachteiligung nichts zu tun. Gelernt wird er wie ein Gewicht: b neu = b + η · (t − y).

### Prüfungsfalle
„Wir haben das Merkmal Geschlecht gelöscht, also ist das Modell fair.“

### Merksatz
Wer verzerrte Daten füttert, erntet verzerrte Entscheidungen.

Siehe auch: Transparenz und Erklärbarkeit · Stichprobe · Trainingsdaten · KI-Verordnung · Neuron
Mehr: Deep Dive 6, 6.2 · Deep Dive 6, 9.2

## Big Data
<!-- id: big-data · quellen: Karte DD8, DD8 5.2 · stand: 2026-10 -->

Datenbestände, die wegen Menge, Geschwindigkeit und Formatvielfalt die klassische Verarbeitung überfordern.

### Erklärung
Doug Laney beschrieb 2001 die ursprünglichen 3 V: **Volume** (Menge), **Velocity** (Geschwindigkeit), **Variety** (Formatvielfalt). Später kamen **Veracity** (Verlässlichkeit) und **Value** (Wertschöpfung) hinzu – die 5 V. Verarbeitet wird durch horizontale Skalierung: Speicherung und Berechnung werden auf viele Rechner verteilt (Hadoop mit HDFS und MapReduce, Spark im Arbeitsspeicher).

### Beispiel
Möbelhaus: Millionen Kassenbons (Volume), Live-Bestände der Filialen (Velocity), Bilder und Bewertungstexte (Variety), Bewertungen unklarer Herkunft (Veracity), konkreter Nutzen wie bessere Bestandsplanung (Value).

### Abgrenzung
Ein Data Warehouse speichert strukturierte, bereinigte Daten (Schema-on-Write); ein Data Lake nimmt Big-Data-Rohdaten in jedem Format auf (Schema-on-Read).

### Prüfungsfalle
Value vergessen – ohne Nutzen ist der Rest Selbstzweck.

### Merksatz
Viel, schnell, vielfältig – und nur sinnvoll, wenn verlässlich und wertvoll.

Siehe auch: Volume · Velocity · Variety · Veracity · Data Lake
Mehr: Deep Dive 8, 5.2

## Bildschirmarbeit
<!-- id: bildschirmarbeit · quellen: DD14 5.1 · stand: 2026-10 -->

Tätigkeit an Bildschirmgeräten, für die die Arbeitsstättenverordnung besondere Schutzanforderungen festlegt.

### Erklärung
Der Arbeitgeber muss den Bildschirmarbeitsplatz ergonomisch gestalten (Bildschirm, Stuhl, Beleuchtung, blendfreie Anordnung; ArbStättV Anhang Nr. 6), die Bildschirmarbeit regelmäßig durch Pausen oder Tätigkeitswechsel unterbrechen und eine **Angebotsvorsorge** zu Augen und Sehvermögen anbieten (ArbMedVV). Die Anforderungen gehören in die Gefährdungsbeurteilung.

### Beispiel
Die Analystin im Möbelhaus erhält einen höhenverstellbaren Tisch, einen zweiten Monitor ohne Spiegelung zum Fenster und alle drei Jahre das Angebot einer Augenuntersuchung.

### Prüfungsfalle
Angebotsvorsorge mit Pflichtvorsorge verwechseln – der Arbeitgeber muss sie anbieten, die Beschäftigten müssen sie nicht wahrnehmen.

### Merksatz
Ergonomisch einrichten, unterbrechen, Augenvorsorge anbieten.

Siehe auch: Arbeitsschutz · Gefährdungsbeurteilung · Arbeitgeberpflichten · Unterweisung
Mehr: Deep Dive 14, 5.1

## Binäre Suche
<!-- id: binare-suche · quellen: Karte DD11, DD11 B7 · stand: 2026-10 -->

Suchverfahren für sortierte Listen, das das mittlere Element prüft und nur in der passenden Hälfte weitersucht; Aufwand O(log n).

### Erklärung
Weil sich der Suchbereich mit jedem Vergleich halbiert, braucht die binäre Suche bei n Elementen höchstens etwa $\log_2 n$ Vergleiche. Voraussetzung ist eine sortierte Liste. Genau dieses Prinzip nutzt ein Datenbankindex.

```text
links ← 1, rechts ← n, position ← 0
SOLANGE links <= rechts UND position = 0
    mitte ← (links + rechts) DIV 2
    WENN liste[mitte] = gesucht DANN position ← mitte
    SONST WENN liste[mitte] < gesucht DANN links ← mitte + 1
    SONST rechts ← mitte - 1
ENDE SOLANGE
```

### Beispiel
Liste 12, 19, 23, 31, 42, 57, 64, 78, gesucht 57: Mitte (1 + 8) DIV 2 = 4 → 31 < 57, links ← 5; Mitte (5 + 8) DIV 2 = 6 → 57 gefunden. Bei 1.000.000 Datensätzen genügen höchstens 20 Vergleiche ($2^{20} = 1.048.576$).

### Abgrenzung
Lineare Suche: unsortiert möglich, O(n). Binäre Suche: nur sortiert, O(log n).

### Prüfungsfalle
Die binäre Suche auf eine unsortierte Liste anwenden.

### Merksatz
Halbieren statt durchblättern – aber nur, wenn sortiert.

Siehe auch: Lineare Suche · O-Notation · Index · Pseudocode
Mehr: Deep Dive 11, B7

## Black-Box-Test
<!-- id: black-box-test · quellen: Karte DD16, DD16 2.2 · stand: 2026-10 -->

Test auf Grundlage der Spezifikation, ohne Kenntnis des Quellcodes: Tut das System, was es soll?

### Erklärung
Testfälle werden aus Anforderungen abgeleitet. Verfahren: **Äquivalenzklassen** (ein Repräsentant je gültiger und ungültiger Klasse), **Grenzwertanalyse** (Werte an und neben jeder Grenze), Entscheidungstabellentest und Zustandsübergangstest. Typische Teststufen sind System- und Abnahmetest.

### Beispiel
Regel: Ab 21 Stück wird eine Bestellung zur Sonderanfrage. Äquivalenzklassen: 1–20 (normal), ab 21 (Sonderanfrage), ≤ 0 (ungültig). Grenzwerte: 0, 1, 20, 21.

### Abgrenzung
| | Black-Box | White-Box |
|---|---|---|
| Grundlage | Spezifikation | Quellcode |
| Verfahren | Äquivalenzklassen, Grenzwerte | Anweisungs- (C0), Zweigüberdeckung (C1) |
| Stufe | System-, Abnahmetest | Komponententest |

Grey-Box mischt beides.

### Prüfungsfalle
Codeüberdeckung als Black-Box-Verfahren nennen.

### Merksatz
Black Box: Man sieht nur Ein- und Ausgabe, nicht hinein.

Siehe auch: White-Box-Test · Äquivalenzklasse · Grenzwertanalyse · Grey-Box-Test · Systemtest
Mehr: Deep Dive 16, 2.2

## Box
<!-- id: box · quellen: DD3 5.1 · stand: 2026-10 -->

Rechteck im Boxplot von Q1 bis Q3, das die mittleren 50 % der Daten enthält; seine Breite ist der Interquartilsabstand.

### Erklärung
Der Strich in der Box markiert den Median. Liegt er nicht mittig, ist die Verteilung schief. Aus der Boxbreite (IQR) werden die Zäune für Ausreißer berechnet: Q1 − 1,5 · IQR und Q3 + 1,5 · IQR.

### Beispiel
Bearbeitungsdauer: Q1 = 40, Q3 = 70 Minuten → IQR = 30, Box von 40 bis 70, Median 55 liegt genau in der Mitte.

### Abgrenzung
Die Box zeigt die mittlere Hälfte, die Whisker reichen bis zum letzten Wert innerhalb der Zäune.

### Merksatz
Die Box ist der IQR – die Hälfte aller Werte liegt darin.

Siehe auch: Boxplot · Interquartilsabstand (IQR) · Quartil · Whisker · Median
Mehr: Deep Dive 3, 5.1

## Boxplot
<!-- id: boxplot · quellen: Karte DD3, DD3 5.1, DD17 6.7 · stand: 2026-10 -->

Grafik der Verteilung aus Box (Q1 bis Q3 mit Median-Strich), Whiskern bis zum letzten Wert innerhalb von 1,5 · IQR und einzeln markierten Ausreißern.

### Erklärung
Der Boxplot nach Tukey zeigt Lage, Streuung, Schiefe und Ausreißer auf einen Blick. Die Zäune liegen bei Q1 − 1,5 · IQR und Q3 + 1,5 · IQR; der Whisker endet beim letzten tatsächlichen Datenwert innerhalb des Zauns. Mehrere Boxplots nebeneinander vergleichen Gruppen, z. B. Filialen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110" width="400" height="110" role="img" aria-label="Boxplot der Bearbeitungsdauer mit Ausreißer">
<line x1="20" y1="80" x2="380" y2="80" class="dg-linie"/>
<text x="20" y="96" text-anchor="middle" class="dg-klein">0</text>
<text x="140" y="96" text-anchor="middle" class="dg-klein">80</text>
<text x="260" y="96" text-anchor="middle" class="dg-klein">160</text>
<text x="380" y="96" text-anchor="middle" class="dg-klein">240</text>
<line x1="72.5" y1="45" x2="80" y2="45" class="dg-linie"/>
<line x1="125" y1="45" x2="155" y2="45" class="dg-linie"/>
<line x1="72.5" y1="35" x2="72.5" y2="55" class="dg-linie"/>
<line x1="155" y1="35" x2="155" y2="55" class="dg-linie"/>
<rect x="80" y="28" width="45" height="34" class="dg-akzent"/>
<line x1="102.5" y1="28" x2="102.5" y2="62" class="dg-linie dg-dick"/>
<line x1="192.5" y1="20" x2="192.5" y2="70" class="dg-linie dg-strich"/>
<circle cx="350" cy="45" r="4" class="dg-form"/>
<text x="102.5" y="20" text-anchor="middle" class="dg-klein">Median 55</text>
<text x="192.5" y="14" text-anchor="middle" class="dg-klein">Zaun 115</text>
<text x="350" y="32" text-anchor="middle" class="dg-klein">Ausreißer 220</text>
</svg>
```

### Beispiel
Elf Reparaturaufträge: Q1 = 40, Median = 55, Q3 = 70 Minuten. IQR = 30, oberer Zaun $70 + 1{,}5 \cdot 30 = 115$. Der größte Wert unter 115 ist 90 → dort endet der Whisker; 220 ist ein Ausreißer.

### Abgrenzung
Histogramm: zeigt die Form der Verteilung in Klassen; Boxplot: verdichtet sie auf fünf Kennwerte und Ausreißer, ideal für Gruppenvergleiche.

### Prüfungsfalle
Den Whisker bis zum Zaun (115) oder bis zum Ausreißer (220) zeichnen – er endet beim letzten Datenwert innerhalb des Zauns.

### Merksatz
Box = mittlere Hälfte, Strich = Median, Whisker bis zum letzten Wert im Zaun.

Siehe auch: Box · Whisker · Interquartilsabstand (IQR) · Ausreißer · Fünf-Punkte-Zusammenfassung
Mehr: Deep Dive 3, 5.1 · Deep Dive 17, 6.7

## Boyce-Codd-Normalform (BCNF)
<!-- id: boyce-codd-normalform · quellen: Karte DD2, DD2 Teil 3 · stand: 2026-10 -->

Verschärfte 3. Normalform: Jede Determinante einer funktionalen Abhängigkeit muss ein Schlüsselkandidat sein.

### Erklärung
Die 3. NF verbietet transitive Abhängigkeiten von Nichtschlüsselattributen, lässt aber Abhängigkeiten zu, bei denen ein Teil eines Schlüsselkandidaten von einem Nicht-Schlüsselkandidaten abhängt. Die BCNF schließt auch diese Lücke. Ein Unterschied tritt nur bei mehreren, sich überlappenden zusammengesetzten Schlüsselkandidaten auf; in der Prüfung wird meist nur bis zur 3. NF verlangt.

### Beispiel
betreuung(kunden_id, kategorie, berater_id): Jeder Berater betreut genau eine Kategorie. Schlüsselkandidaten sind (kunden_id, kategorie) und (kunden_id, berater_id). Die Abhängigkeit berater_id → kategorie verletzt die BCNF, nicht aber die 3. NF. Lösung: berater(berater_id, kategorie) und betreuung(kunden_id, berater_id).

### Abgrenzung
2. NF: keine partiellen Abhängigkeiten; 3. NF: keine transitiven Abhängigkeiten von Nichtschlüsselattributen; BCNF: jede Determinante ist Schlüsselkandidat.

### Prüfungsfalle
Behaupten, jede Tabelle in 3. NF sei auch in BCNF – umgekehrt gilt es: BCNF schließt die 3. NF ein.

### Merksatz
In der BCNF bestimmt nur ein Schlüssel etwas.

Siehe auch: 3. Normalform · Funktionale Abhängigkeit · Schlüsselkandidat · Normalisierung
Mehr: Deep Dive 2, Teil 3

## BPMN
<!-- id: bpmn · quellen: Karte DD5, DD5 Teil 2, DD17 1.1 · stand: 2026-10 -->

Business Process Model and Notation: standardisierte grafische Sprache für Prozessmodelle mit Ereignissen, Aktivitäten, Gateways, Pools und Lanes.

### Erklärung
BPMN 2.0 wird von der OMG gepflegt und ist als ISO/IEC 19510 genormt. Grundelemente: **Ereignisse** (Kreise – Start dünn, Zwischen doppelt, Ende dick), **Aktivitäten** (abgerundete Rechtecke, Verb + Objekt), **Gateways** (Rauten – XOR, AND, OR), **Sequenzflüsse** innerhalb eines Pools, **Nachrichtenflüsse** (gestrichelt) zwischen Pools. Pools stehen für Organisationen, Lanes für Rollen darin. BPMN-Modelle sind mit Workflow-Engines technisch ausführbar.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 160" width="520" height="160" role="img" aria-label="BPMN-Ausschnitt mit Startereignis, Task, XOR-Gateway und zwei Endereignissen">
<defs><marker id="bpmn-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<circle cx="30" cy="80" r="14" class="dg-form"/>
<line x1="44" y1="80" x2="80" y2="80" class="dg-linie" marker-end="url(#bpmn-pfeil)"/>
<rect x="80" y="58" width="110" height="44" rx="8" class="dg-form"/>
<text x="135" y="80" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag prüfen</text>
<line x1="190" y1="80" x2="230" y2="80" class="dg-linie" marker-end="url(#bpmn-pfeil)"/>
<polygon points="252,58 274,80 252,102 230,80" class="dg-form"/>
<text x="252" y="80" text-anchor="middle" dominant-baseline="middle" class="dg-fett">X</text>
<polyline points="252,58 252,30 320,30" class="dg-linie" fill="none" marker-end="url(#bpmn-pfeil)"/>
<polyline points="252,102 252,130 320,130" class="dg-linie" fill="none" marker-end="url(#bpmn-pfeil)"/>
<text x="262" y="44" class="dg-klein">machbar</text>
<text x="262" y="120" class="dg-klein">nicht machbar</text>
<rect x="320" y="10" width="120" height="40" rx="8" class="dg-form"/>
<text x="380" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reparatur planen</text>
<rect x="320" y="110" width="120" height="40" rx="8" class="dg-form"/>
<text x="380" y="130" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Absage senden</text>
<line x1="440" y1="30" x2="470" y2="30" class="dg-linie" marker-end="url(#bpmn-pfeil)"/>
<line x1="440" y1="130" x2="470" y2="130" class="dg-linie" marker-end="url(#bpmn-pfeil)"/>
<circle cx="484" cy="30" r="14" class="dg-form dg-dick"/>
<circle cx="484" cy="130" r="14" class="dg-form dg-dick"/>
</svg>
```

### Beispiel
Reparaturprozess des Möbelhauses: Pool „Möbelhaus“ mit Lanes Serviceannahme, Werkstatt, Buchhaltung; Pool „Kunde“, verbunden nur über Nachrichtenflüsse (Auftrag, Kostenvoranschlag, Rechnung).

### Abgrenzung
EPK: im deutschsprachigen Raum verbreitet, Ereignis und Funktion wechseln sich ab, rein beschreibend; BPMN: internationaler Standard, Pools und Lanes, ausführbar.

### Prüfungsfalle
Ein durchgezogener Sequenzfluss zwischen zwei Pools – zwischen Pools fließen nur Nachrichten.

### Merksatz
Kreise passieren, Rechtecke tun, Rauten verzweigen.

Siehe auch: EPK · XOR-Gateway · Pools und Lanes · Nachrichtenfluss · Token (BPMN)
Mehr: Deep Dive 5, Teil 2 · Deep Dive 17, 1.1

## Break-even-Menge
<!-- id: break-even-menge · quellen: Karte DD12, DD12 4.2 · stand: 2026-10 -->

Absatzmenge, bei der Erlöse und Kosten gleich sind; ab der nächsten Einheit entsteht Gewinn.

### Erklärung
Jedes verkaufte Stück erwirtschaftet den Deckungsbeitrag (Preis minus variable Stückkosten). Die Break-even-Menge ist erreicht, wenn die Summe der Deckungsbeiträge die Fixkosten deckt. Sie gehört zu den statischen Verfahren der Wirtschaftlichkeitsrechnung.

$\text{Break-even-Menge} = \frac{\text{Fixkosten}}{\text{Preis} - \text{variable Stückkosten}}$

### Beispiel
Fixkosten 24.000 €, Preis 80 €, variable Stückkosten 50 €: $\frac{24.000}{80 - 50} = \frac{24.000}{30} = 800$ Stück. Probe: $800 \cdot 80 = 64.000$ € Erlös, $24.000 + 800 \cdot 50 = 64.000$ € Kosten.

### Abgrenzung
Die kritische Menge der Kostenvergleichsrechnung vergleicht zwei Verfahren (gleiche Gesamtkosten), die Break-even-Menge Erlös und Kosten eines Produkts.

### Prüfungsfalle
Durch den Preis statt durch den Deckungsbeitrag teilen: $\frac{24.000}{80} = 300$ ist falsch.

### Merksatz
Fixkosten durch Deckungsbeitrag je Stück.

Siehe auch: Deckungsbeitrag · Fixkosten · Variable Kosten · Kritische Menge · Amortisationszeit
Mehr: Deep Dive 12, 4.2

## Brute Force
<!-- id: brute-force · quellen: Karte DD10, DD10 4.5 · stand: 2026-10 -->

Angriff, bei dem systematisch alle möglichen Passwörter oder Schlüssel durchprobiert werden.

### Erklärung
Der Aufwand wächst exponentiell mit Länge und Zeichenvorrat des Passworts. Varianten sind Wörterbuchangriffe (häufige Passwörter) und Credential Stuffing (geleakte Zugangsdaten anderer Dienste). Gegenmaßnahmen: Sperr- und Verzögerungsmechanismen nach Fehlversuchen, lange Passwörter, Mehr-Faktor-Authentifizierung, gesalzene Hashes mit langsamen Verfahren.

### Beispiel
Bei 4 Ziffern gibt es $10^4 = 10.000$ Möglichkeiten, bei 12 Zeichen aus 62 Zeichen $62^{12} \approx 3{,}2 \cdot 10^{21}$ – das Kundenportal sperrt nach fünf Fehlversuchen zusätzlich für 15 Minuten.

### Abgrenzung
Phishing erschleicht das Passwort durch Täuschung, Brute Force errät es durch Rechenleistung.

### Prüfungsfalle
Komplexitätsregeln für ausreichend halten – Länge und MFA wirken stärker.

### Merksatz
Lang, gesperrt, zweiter Faktor – dann hilft Raten nicht.

Siehe auch: Mehr-Faktor-Authentifizierung · Hashing · Salt · Phishing
Mehr: Deep Dive 10, 4.5

## Bruttoinlandsprodukt
<!-- id: bruttoinlandsprodukt · quellen: Karte DD14, DD14 4.5 · stand: 2026-10 -->

Wert aller im Inland innerhalb eines Jahres erzeugten Waren und Dienstleistungen (abzüglich Vorleistungen).

### Erklärung
Das BIP ist das wichtigste Maß der Wirtschaftsleistung und wird in Deutschland von Destatis berechnet. **Nominal** wird zu aktuellen Preisen bewertet, **real** preisbereinigt – nur das reale BIP zeigt echtes Wachstum. Kritik: Hausarbeit, Ehrenamt, Umweltschäden und die Verteilung des Wohlstands werden nicht erfasst.

### Beispiel
Steigt das nominale BIP um 3 % bei 2 % Preissteigerung, wächst die Wirtschaft real nur um rund 1 % ($\frac{1{,}03}{1{,}02} - 1 \approx 0{,}98\,\%$).

### Abgrenzung
Inlandsprinzip: Das BIP zählt, was im Inland erwirtschaftet wird – auch von ausländischen Unternehmen; das Bruttonationaleinkommen zählt, was Inländer erwirtschaften.

### Prüfungsfalle
Ein nominales Wachstum als Wohlstandsgewinn deuten, obwohl es nur Inflation ist.

### Merksatz
Real zählt – nominal kann die Inflation mitwachsen.

Siehe auch: Inflation · Inflationsrate · Konjunkturphasen · Magisches Viereck
Mehr: Deep Dive 14, 4.5

## BSI
<!-- id: bsi · quellen: Karte DD10, DD10 5.1, DD10 5.5 · stand: 2026-10 -->

Bundesamt für Sicherheit in der Informationstechnik: die zentrale Cybersicherheitsbehörde des Bundes mit Sitz in Bonn.

### Erklärung
Das BSI gibt den **IT-Grundschutz** heraus (BSI-Standards 200-1 ISMS, 200-2 Methodik, 200-3 Risikoanalyse, 200-4 Business Continuity Management) und warnt vor Sicherheitslücken. Seit dem NIS2-Umsetzungsgesetz (in Kraft seit 06.12.2025, neues BSIG) müssen sich betroffene Unternehmen beim BSI registrieren und erhebliche Sicherheitsvorfälle melden: Erstmeldung nach 24 Stunden, Bewertung nach 72 Stunden, Abschluss nach einem Monat (Stand 2026).

### Beispiel
Ein NIS2-pflichtiger Möbelhändler wird Opfer von Ransomware: Meldung an das BSI nach § 32 BSIG, parallel bei Kundendaten Meldung an die Datenschutz-Aufsichtsbehörde binnen 72 Stunden.

### Abgrenzung
Das BSI ist für Informationssicherheit zuständig, die Datenschutz-Aufsichtsbehörden für personenbezogene Daten.

### Prüfungsfalle
Eine Datenpanne nach Art. 33 DSGVO an das BSI melden.

### Merksatz
BSI = Sicherheit der IT, Aufsichtsbehörde = Schutz der Personen.

Siehe auch: IT-Grundschutz · NIS2 · Schutzbedarfsfeststellung · ISMS
Mehr: Deep Dive 10, 5.1 · Deep Dive 10, 5.5

## Bubble Sort
<!-- id: bubble-sort · quellen: Karte DD11, DD11 B7 · stand: 2026-10 -->

Sortierverfahren, das benachbarte Elemente vergleicht und bei falscher Reihenfolge tauscht, bis ein Durchlauf ohne Tausch bleibt; Aufwand O(n²), stabil.

### Erklärung
Nach jedem Durchlauf steht das größte noch unsortierte Element („die größte Blase“) am Ende, der zu prüfende Bereich wird um eins kürzer. Im schlechtesten Fall sind $\frac{n \cdot (n - 1)}{2}$ Vergleiche nötig; eine bereits sortierte Liste ist mit Abbruchbedingung nach einem Durchlauf erledigt (O(n)).

```text
ende ← n - 1
WIEDERHOLE
    getauscht ← FALSCH
    FÜR j VON 1 BIS ende
        WENN liste[j] > liste[j+1] DANN tausche, getauscht ← WAHR
    ENDE FÜR
    ende ← ende - 1
BIS getauscht = FALSCH ODER ende = 0
```

### Beispiel
Lieferzeiten 5, 3, 8, 1: Durchlauf 1 → 3, 5, 1, 8, Durchlauf 2 → 3, 1, 5, 8, Durchlauf 3 → 1, 3, 5, 8. Insgesamt 3 + 2 + 1 = 6 Vergleiche und 4 Vertauschungen.

### Abgrenzung
Selection Sort sucht das Minimum und tauscht es nach vorn (nicht stabil); Merge Sort braucht immer nur O(n log n).

### Prüfungsfalle
Nach dem ersten Durchlauf das kleinste Element vorn erwarten – sicher ist nur das größte hinten.

### Merksatz
Die größte Blase steigt nach jedem Durchlauf nach oben.

Siehe auch: Selection Sort · Insertion Sort · Merge Sort · Stabiles Sortierverfahren · O-Notation
Mehr: Deep Dive 11, B7

## Burndown-Chart
<!-- id: burndown-chart · quellen: DD17 5.4 · stand: 2026-10 -->

Diagramm, das im Sprint die noch offene Arbeit (meist Story Points) über die Tage zeigt; eine Ideallinie fällt gleichmäßig auf null.

### Erklärung
Die x-Achse zeigt die Sprint-Tage, die y-Achse die offene Arbeit. Liegt die Ist-Linie über der Ideallinie, ist das Team hinter dem Plan; eine waagrechte Strecke bedeutet, dass nichts fertig wurde; ein Anstieg zeigt neu hinzugekommene Arbeit. Das Chart macht den Fortschritt für alle sichtbar.

### Beispiel
Sprint mit 40 Story Points über 10 Tage: Ideal sind 4 Punkte je Tag. An Tag 6 sind noch 22 Punkte offen statt der idealen 16 – das Team liegt 6 Punkte zurück; am Sprintende bleiben 3 Punkte offen.

### Abgrenzung
Burn-up-Chart zeigt die erledigte Arbeit steigend und macht Umfangsänderungen sichtbar; Kanban-Board zeigt den aktuellen Stand jeder Aufgabe.

### Prüfungsfalle
Die Ideallinie als Plan für jeden einzelnen Tag missverstehen – sie ist nur Orientierung.

### Merksatz
Burndown: Was noch offen ist, muss bis zum Sprintende auf null.

Siehe auch: Sprint · Scrum · Kanban-Board · Sprint Backlog
Mehr: Deep Dive 17, 5.4

## Business Process Reengineering
<!-- id: business-process-reengineering · quellen: Karte DD5, DD5 6.2 · stand: 2026-10 -->

Radikale Neugestaltung eines Geschäftsprozesses „auf der grünen Wiese“ statt schrittweiser Verbesserung – große Wirkung, hohes Risiko.

### Erklärung
Business Process Reengineering (Hammer und Champy) stellt den Prozess grundsätzlich infrage und gestaltet ihn vom Kundennutzen her neu, oft gestützt auf neue IT. Ziel sind sprunghafte Verbesserungen bei Kosten, Zeit und Qualität. Nachteile: hoher Aufwand, Widerstand der Beschäftigten, Risiko des Scheiterns.

### Beispiel
Das Möbelhaus ersetzt die papiergebundene Reparaturannahme mit drei Übergaben komplett durch ein Onlineportal mit automatischer Terminvergabe.

### Abgrenzung
| | Kaizen / KVP | Business Process Reengineering |
|---|---|---|
| Ansatz | viele kleine Schritte | radikaler Neuentwurf |
| Träger | Beschäftigte | Management, Projektteam |
| Risiko | gering | hoch |

### Prüfungsfalle
BPR und KVP als gleichwertige Methoden für kleine Verbesserungen nennen.

### Merksatz
KVP verbessert, BPR erfindet neu.

Siehe auch: Kaizen · KVP · Lean Management · Soll-Konzeption
Mehr: Deep Dive 5, 6.2

## Business-Impact-Analyse
<!-- id: business-impact-analyse · quellen: Karte DD10, DD10 5.4 · stand: 2026-10 -->

Analyse im Notfallmanagement, die ermittelt, welche Geschäftsprozesse kritisch sind und wie lange sie höchstens ausfallen dürfen.

### Erklärung
Für jeden Prozess werden die Schäden eines Ausfalls über die Zeit bewertet (finanziell, rechtlich, Image). Daraus folgen die Wiederanlaufziele: **RTO** (maximal tolerierbare Ausfallzeit) und **RPO** (maximal tolerierbarer Datenverlust). Die Business-Impact-Analyse ist Grundlage für Notfallhandbuch, Backup-Konzept und Redundanzmaßnahmen (BSI-Standard 200-4).

### Beispiel
Der Onlineshop des Möbelhauses verliert je Stunde Ausfall rund 5.000 € Umsatz → RTO 4 Stunden; die Kasse darf höchstens 15 Minuten Buchungen verlieren → RPO 15 Minuten.

### Abgrenzung
Risikoanalyse fragt nach Eintrittswahrscheinlichkeit und Schaden einer Bedrohung; die Business-Impact-Analyse fragt nach den Folgen eines Ausfalls, egal aus welchem Grund.

### Prüfungsfalle
RTO und RPO vertauschen: RTO ist Zeit bis zum Wiederanlauf, RPO der Zeitraum verlorener Daten.

### Merksatz
Erst wissen, was wie lange ausfallen darf – dann vorsorgen.

Siehe auch: RTO und RPO · Notfallmanagement · Notfallhandbuch · Disaster Recovery
Mehr: Deep Dive 10, 5.4

## Ausgelassen
- Beispiel Günstigkeitsprinzip – Beispielüberschrift DD13
- Berechnung – kein Fachbegriff
- Binäre Suche in Pseudocode – Abschnittstitel
- Bubble Sort in Pseudocode – Abschnittstitel
