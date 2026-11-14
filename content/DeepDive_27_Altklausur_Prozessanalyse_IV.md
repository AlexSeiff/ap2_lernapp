# Deep Dive 27: Altklausur-Training Prozessanalyse IV
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Dieser Deep Dive ist eine **Übungsvariante im Stil einer weiteren Prüfung „Durchführen einer Prozessanalyse“**: vier Aufgaben mit 26, 25, 23 und 26 Punkten, 90 Minuten, ein Unternehmen für alle Aufgaben. Texte, Zahlen und Szenario sind neu geschrieben – Aufbau, Aufgabentypen und Niveau entsprechen der Prüfung. Neu gegenüber den Deep Dives 18, 21 und 22 sind vier Aufgabentypen: **agile App-Entwicklung mit Testkonzept**, ein **BPMN-Diagramm aus einem Fließtext** (13 P), die **Kritik an einer stichwortartigen Prozessbeschreibung** (Schnittstellen, Ausnahmefälle, Problem – Folgen – Verbesserung) und eine **Zuschlagskalkulation für den neuen Prozess** mit anschließender **Diagrammauswertung**.

Das Muster der Prüfer bleibt: wenig reine Definitionen, viel Anwendung. Wer „Sprint Review“ nur nennt, bekommt die halbe Punktzahl – wer beschreibt, was dort mit der App passiert, die volle.

Szenario: **Möbelhaus Nordholz GmbH** mit der eigenen Massivholz-Werkstatt **Nordholz Manufaktur** und dem Messgerät „HolzCheck“.

---

# Teil 1 – So ist die Klausur aufgebaut

| Merkmal | Wert |
|---|---|
| Zeit / Punkte | 90 Minuten, 100 Punkte, 4 Aufgaben (26 · 25 · 23 · 26) |
| Aufgabe 1 | App-Projekt: Anforderungen, agile Entwicklung, Testkonzept, Risiken, Workshop |
| Aufgabe 2 | Ist-Prozess als BPMN, Vorteile der Notation, andere Darstellungsformen, Verbesserung |
| Aufgabe 3 | Stichwortartige Prozessbeschreibung bewerten: Schnittstellen, Ausnahmefälle, Tabelle Problem – Folgen – Verbesserung, Risikofaktoren |
| Aufgabe 4 | Kalkulation Ist/Neu vervollständigen, zwei Diagramme aus Tabellen, Zusammenhang herleiten |
| Belegsatz | BPMN-Symbole (Task, Sequenzfluss, Gateways XOR/OR/AND, Start-, Zwischen- und Endereignis, Nachrichten-, Zeit- und Fehlerereignis) |

**Punkte-Faustregel:** *Nennen* = 1 P je Angabe · *Beschreiben* = 2 P je Punkt · BPMN-Modell 13 P · Tabelle Problem – Folgen – Verbesserung 12 P · Kalkulation 12 P.

---

# Teil 2 – Agile Entwicklung und Testkonzept

## 2.1 Aktivitäten einer agilen Entwicklung (Scrum)

| Aktivität | Was passiert? | Ergebnis |
|---|---|---|
| **Product Backlog pflegen** | Anforderungen als User Storys sammeln, schätzen und priorisieren | geordnete Liste, das Wichtigste oben |
| **Sprint Planning** | Team wählt die Storys für den nächsten Sprint (2–4 Wochen) | Sprint Backlog, Sprintziel |
| **Daily Scrum** | 15 Minuten täglich: Was ist fertig, was kommt, was blockiert? | Hindernisse werden sofort sichtbar |
| **Sprint Review** | lauffähiges Inkrement wird den Anwendern gezeigt | Rückmeldung, neue oder geänderte Storys |
| **Retrospektive** | Team bespricht die Zusammenarbeit | ein bis zwei Verbesserungen für den nächsten Sprint |

Eine Aktivität zu **beschreiben** heißt: Wer macht was mit welchem Ergebnis – und möglichst mit Bezug zum Produkt („Im Review misst die Lagermeisterin mit dem Prototyp eine Lagerbox“).

## 2.2 Was gegen agiles Vorgehen sprechen kann

- **Festpreis und fester Umfang** sind vertraglich verlangt – der Umfang ist bei agilem Vorgehen bewusst offen.
- **Anwender haben keine Zeit** für Reviews und Rückfragen – ohne Product Owner mit Entscheidungsbefugnis funktioniert es nicht.
- **Stabile, vollständig bekannte Anforderungen** oder **Zulassungs- und Dokumentationspflichten** (Medizin, Eichrecht) – dann bringt die Flexibilität wenig.
- **Team ohne Erfahrung** in Selbstorganisation, verteilte Teams mit wenig gemeinsamer Zeit.

## 2.3 Inhalte eines Testkonzepts

| Inhalt | Frage, die er beantwortet |
|---|---|
| **Testziele und Testobjekte** | Was wird geprüft (App, Kopplung, Cloud-Schnittstelle), was nicht? |
| **Teststufen und Testarten** | Modul-, Integrations-, System-, Abnahmetest; Funktions-, Last-, Usability-, Sicherheitstest |
| **Testfälle und Testdaten** | Eingabe, erwartetes Ergebnis, Grenz- und Fehlerfälle (Messwert außerhalb des Bereichs, kein Netz) |
| **Testumgebung** | Geräte, Betriebssystemversionen, Testdatenbank getrennt von der Produktion |
| **Rollen und Zeitplan** | Wer testet wann, wer gibt frei? |
| **Abnahmekriterien und Fehlerklassen** | Wann gilt ein Test als bestanden, welche Fehler verhindern die Freigabe? |

> ❓ **Prüferfrage:** Warum reicht „Wir testen die App vor der Auslieferung“ nicht als Testkonzept?
> *Weil ein Konzept festlegt, was mit welchen Testfällen und Daten in welcher Umgebung geprüft wird und wann ein Test bestanden ist. Ohne Abnahmekriterien kann niemand entscheiden, ob die App freigegeben werden darf.*

---

# Teil 3 – BPMN aus einem Fließtext

## 3.1 Die Symbole des Belegsatzes

| Symbol | Bedeutung | Signal im Text |
|---|---|---|
| dünner Kreis | **Startereignis** | „Jeden Morgen …“, „Der Kunde ruft an …“ |
| doppelter Kreis | **Zwischenereignis** (mit Uhr: Zeit, mit Brief: Nachricht) | „am späten Nachmittag“, „nach drei Tagen“ |
| dicker Kreis | **Endereignis** | Ablauf ist abgeschlossen |
| abgerundetes Rechteck | **Task** (Verb + Objekt) | jede Tätigkeit |
| Raute mit X | **exklusives Gateway (XOR)** – genau ein Weg | „entscheidet sich für **eine** …“, „entweder … oder“ |
| Raute mit O | **inklusives Gateway (OR)** – ein Weg oder mehrere | „eine oder mehrere …“ |
| Raute mit + | **paralleles Gateway (AND)** – alle Wege | „gleichzeitig“, „parallel“ |
| Pool / Lane | Organisation / Rolle | „die Lagermeisterin …“, „ihre Mitarbeiter …“ |

## 3.2 Vorgehen

1. **Rollen** markieren → Lanes. Wer nur einen Auftrag bekommt und ausführt, hat trotzdem eine eigene Lane.
2. **Tätigkeiten** als Tasks übernehmen, kurz und mit Verb.
3. **Entscheidungen** suchen: Wie viele Wege gibt es, und schließen sie sich aus? Bedingungen an die ausgehenden Pfeile schreiben.
4. Wege **wieder zusammenführen**, bevor es gemeinsam weitergeht – oder den Zweig mit einem eigenen Endereignis beenden.
5. **Zeitangaben** als Zeitereignis modellieren, nicht als Task („Warten bis zum Nachmittag“ ist keine Tätigkeit).

## 3.3 BPMN und andere Darstellungsformen

| Darstellung | Unterscheidungsmerkmal zur BPMN |
|---|---|
| **EPK / eEPK** | Ereignisse und Funktionen wechseln sich streng ab; Rollen stehen als Organisationseinheit an der Funktion, nicht als Lane |
| **UML-Aktivitätsdiagramm** | stammt aus der Softwareentwicklung; kennt keine Pools für getrennte Organisationen und keine Nachrichtenflüsse dazwischen; Parallelität mit Balken statt Gateways |
| **Programmablaufplan / Flussdiagramm** | zeigt nur Schritte und Entscheidungen, keine Rollen, Ereignisse oder Nachrichten |
| **Tabellarische oder textliche Beschreibung** | nicht normiert, Verzweigungen und Parallelität sind schwer zu erkennen |

**Vorteile der BPMN:** genormt (ISO/IEC 19510) und damit für alle Beteiligten eindeutig lesbar · Rollen und Übergaben durch Pools und Lanes sichtbar · vom Fachbereich lesbar und zugleich so genau, dass eine Workflow-Engine das Modell ausführen kann.

---

# Teil 4 – Eine Prozessbeschreibung bewerten

## 4.1 Schnittstellen und Medienbrüche

Eine **Schnittstelle** ist jede Stelle, an der Arbeit oder Information den **Bearbeiter, die Abteilung oder das Medium wechselt**: Auftrag vom Vorgesetzten an die Hilfskraft, Zettel an die Lohnabrechnung, Übertragung ins Buchhaltungssystem. An Schnittstellen entstehen Wartezeiten, Rückfragen und Übertragungsfehler. Wechselt zusätzlich das Medium (Papier → Tabelle → System), heißt das **Medienbruch**.

## 4.2 Ausnahmefälle

Wer jeden Sonderfall ausmodelliert, verdeckt den **Standardablauf**: Das Modell wird unübersichtlich, teuer in der Pflege und für die Mitarbeiter schwer zu lesen. Besser: den Normalfall klar beschreiben und Ausnahmen als **eigenen Teilprozess** oder knappe Regel auslagern.

## 4.3 Problem – Folgen – Verbesserung

| Problem (im Prozess benennen) | Folgen | Verbesserung |
|---|---|---|
| handschriftliche Erfassung in uneinheitlichen Einheiten | Rechenfehler, Rückfragen | digitale Zeiterfassung mit festen Formaten |
| mehrfaches Übertragen derselben Daten | Übertragungsfehler, doppelte Arbeit | einmal erfassen, automatisch übernehmen |
| Fristen ohne Kontrolle | verspätete Abrechnung, Nachberechnung | automatische Erinnerung, Sperre nach Stichtag |

## 4.4 Risiken bewerten

Drei Faktoren reichen für die Bewertung: **Eintrittswahrscheinlichkeit**, **Schadenshöhe (Auswirkung)** und **Entdeckungswahrscheinlichkeit**. Aus Wahrscheinlichkeit · Auswirkung ergibt sich die Risikokennzahl; die FMEA multipliziert zusätzlich die Entdeckung (Deep Dive 5).

---

# Teil 5 – Kalkulation und Diagrammauswertung

## 5.1 Das Kalkulationsschema

| Zeile | Rechnung |
|---|---|
| Materialeinzelkosten | gegeben |
| + Materialgemeinkosten | Materialeinzelkosten · Zuschlagsatz |
| = Materialkosten | |
| + Personalkosten, Abschreibung, sonstige Kosten | gegeben oder aus der Annahme („−20 %“) |
| = Herstellkosten | |
| + sonstige Gemeinkosten | Herstellkosten · Zuschlagsatz |
| = Selbstkosten | |
| + Gewinn | Selbstkosten · Gewinnzuschlag – oder rückwärts: Umsatz − Selbstkosten |
| = Umsatz | |

Im **neuen Prozess** ist der Umsatz durch die Annahme vorgegeben („+10 %“). Dann rechnest du **von oben** bis zu den Selbstkosten und **von unten** vom Umsatz – der Gewinn ist die Differenz, der Gewinnzuschlag ergibt sich daraus.

Beispiel: Selbstkosten 200.000 €, Umsatz 250.000 €: $\frac{250.000 - 200.000}{200.000} \cdot 100\,\%$ = **25,00 %**

## 5.2 Zwei Diagramme aus zwei Tabellen

- **Verlauf über die Zeit** → Liniendiagramm (eine Linie je Lagerbox oder nur der Durchschnitt).
- **Mengen je Monat, zusammengesetzt aus Personen** → gestapeltes Säulendiagramm oder Säulen der Monatssummen.
- Immer: Titel, beschriftete Achsen mit Einheit, Legende, gleichmäßige Skala ab null bei Säulen.

## 5.3 Einen Zusammenhang herleiten

1. Jede Reihe einzeln beschreiben (steigt, fällt, Knick in Monat x).
2. Reihen **zeitlich übereinanderlegen**: Was passiert gleichzeitig, was folgt mit Verzögerung?
3. **Ursache benennen** und mit Zahlen belegen – und offen sagen, dass eine gemeinsame Bewegung noch kein Beweis ist.

> ❓ **Prüferfrage:** Zwei Kurven bewegen sich gleichzeitig. Was müssen Sie prüfen, bevor Sie von Ursache und Wirkung sprechen?
> *Ob es einen fachlich plausiblen Wirkmechanismus gibt, ob die Ursache zeitlich vor der Wirkung liegt und ob eine dritte Größe beide Reihen treibt. Eine Korrelation allein belegt keine Kausalität.*

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. **Agile Aktivitäten nur genannt** („Daily“), nicht beschrieben.
2. **Testkonzept mit Testfällen verwechselt** – verlangt sind Inhalte des Konzepts.
3. **Paralleles statt exklusives Gateway**, obwohl der Text „entscheidet sich für eine Tätigkeit“ sagt.
4. **Wege nach dem Gateway nicht zusammengeführt** oder Bedingungen an den Pfeilen vergessen.
5. **„Warten“ als Task** statt als Zeitereignis.
6. In der Tabelle **Folge und Problem vertauscht** oder nur eine statt zwei Folgen genannt.
7. Kalkulation: **Zuschlag auf die falsche Basis** (sonstige Gemeinkosten auf die Materialkosten statt auf die Herstellkosten).
8. Diagrammauswertung: **Kurven nur beschrieben**, kein Zusammenhang hergestellt.

---

# Übungsklausur Prozessanalyse IV im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Antworte stichwortartig, gib bei Berechnungen den Rechenweg an und halte dich an die geforderte Anzahl der Nennungen. Diagramme zeichnest du auf Papier oder im Editor und bewertest sie danach mit der Checkliste der Musterlösung.

## Ausgangssituation

Die **Möbelhaus Nordholz GmbH** fertigt in ihrer Werkstatt **Nordholz Manufaktur** Massivholzmöbel nach Maß. Das Holz lagert vor der Verarbeitung mehrere Monate in sechs Lagerboxen. Die IT-Abteilung hat mit der Manufaktur das Messgerät **„HolzCheck“** entwickelt: Es bestimmt in einer Messung **Holzfeuchte und Temperatur** eines Brettstapels. Daraus lässt sich ableiten, wann das Holz verarbeitet werden kann. Das Messgerät wird per NFC mit einem Tablet gekoppelt; eine App soll die Messwerte in eine Cloud-Datenbank übertragen. Sie arbeiten in der IT-Abteilung am Projekt der App-Entwicklung mit und sind in die Anforderungs- und Planungsphase eingebunden.

## Block A – Projekt HolzCheck-App (26 P)

Die App wird für die Lagermeisterin und ihre Mitarbeiter entwickelt. Die Geschäftsleitung verlangt, dass die App mit **agilen Verfahren** entsteht und vor der Einführung umfassend getestet wird. In der Manufaktur gibt es Vorbehalte: Bisher werden die Messwerte von Hand in eine Kladde geschrieben.

**A1 (3 P):** *Nennen* Sie **drei** funktionale Anforderungen an die HolzCheck-App.

**A2 (6 P):** Die App soll agil entwickelt werden. *Beschreiben* Sie **drei** Aktivitäten, die bei einer agilen Entwicklung der App durchgeführt werden.

**A3 (2 P):** *Nennen* Sie **zwei** Gründe, die gegen den Einsatz von agilem Projektmanagement sprechen können.

**A4 (6 P):** Die Funktionen der App sollen durch Tests abgesichert werden. *Beschreiben* Sie **drei** Inhalte eines Testkonzepts, die Sie für den Test der App planen.

**A5 (3 P):** *Nennen* Sie **drei** Risiken, die sich auf das App-Projekt auswirken können.

**A6 (6 P):** Sie rechnen mit Widerständen in der Manufaktur und laden die Beschäftigten deshalb zu einem Workshop ein. *Beschreiben* Sie **drei** Ziele, die Sie mit diesem Workshop erreichen wollen.

## Block B – Lagerkontrolle: Ist-Prozess (25 P)

Im Zuge der Digitalisierung wird der Ist-Zustand der Lagerkontrolle aufgenommen:

Die Lagermeisterin betreut sechs Lagerboxen. Von Montag bis Samstag kontrolliert sie jeden Morgen in fester Reihenfolge eine Lagerbox und misst dabei die Holzfeuchte. Je Lagerbox kann eine der folgenden Tätigkeiten nötig sein: Stapel umsetzen und neu mit Stapelleisten versehen, Schimmelbefall behandeln oder Bretter in die Trockenkammer bringen.

Nach der Begutachtung entscheidet sich die Lagermeisterin für **eine** Tätigkeit. Bei Schimmelbefall bereitet sie das Behandlungsmittel vor, für das Umsetzen legt sie Stapelleisten bereit, für die Trockenkammer stellt sie den Hubwagen bereit. Ist keine dieser Tätigkeiten nötig, erledigt sie Büroarbeit. Fällt Arbeit an, beauftragt sie ihre Mitarbeiter, die die Tätigkeit ausführen. Am späten Nachmittag kontrolliert die Lagermeisterin die geleistete Arbeit.

**B1 (4 P):** *Beschreiben* Sie **zwei** Vorteile, die sich aus der Verwendung der BPMN (Business Process Model and Notation) ergeben.

**B2 (13 P):** *Erstellen* Sie aufgrund der Beschreibung ein **BPMN-Diagramm** des Ist-Prozesses für eine Lagerbox mit den Lanes **Lagermeisterin** und **Mitarbeiter**.

**B3 (6 P):** *Nennen* Sie **zwei** weitere Möglichkeiten, Geschäftsprozesse darzustellen, und *beschreiben* Sie zu jeder Möglichkeit **ein** Unterscheidungsmerkmal zur BPMN.

**B4 (2 P):** *Beschreiben* Sie **einen** Verbesserungsvorschlag für den beschriebenen Prozess.

## Block C – Stundenabrechnung der Aushilfen (23 P)

Für die Abrechnung der Arbeitsstunden der Aushilfen hat die Manufaktur ihren Ablauf stichwortartig aufgeschrieben:

- Aushilfe erhält Auftrag; Auftrag durchführen; Zeit auf dem persönlichen Wochenzettel eintragen; Arbeit wird überprüft; Wochenzettel wird gegengezeichnet.
- Ende der Woche: Übertrag auf die gemeinsame Monatsliste.
- Verspätete Übertragung auf einem gesonderten Zettel, spätestens vier Tage nach Monatsende.
- Bei Krankheit: Eintrag in die Krankheitsliste; Abgleich mit den eingegangenen Arbeitsunfähigkeitsbescheinigungen.
- Abrechnung der Stunden je Aushilfe; Ablage der Wochenzettel und Monatslisten; Übertragung der Personalkosten in das Buchhaltungssystem.

**Anlage – Wochenzettel einer Aushilfe (Auszug)**

| Tag | Tätigkeit | Zeit |
|---|---|---|
| Mo | Stapel umsetzen | 3,5 Std |
| Di | Trockenkammer | 50 Minuten |
| Mi | Stapel ums. | 2,4 |
| Do | Schimmel | 3 |

**C1 (2 P):** Die Prozessbeschreibung verwendet keine normierte Darstellungsform. *Beschreiben* Sie **ein** Problem, das dadurch entsteht.

**C2 (3 P):** *Nennen* Sie **drei** Schnittstellen aus dem beschriebenen Prozess.

**C3 (3 P):** In Prozessbeschreibungen wird oft viel Aufwand betrieben, um Ausnahmefälle abzubilden – hier den Krankheitsfall. *Erläutern* Sie, worin die Problematik überbetonter Ausnahmefälle für eine Geschäftsprozessbeschreibung liegt.

**C4 (12 P):** *Nennen* Sie **zwei** weitere Elemente, die in dem beschriebenen Prozess problematisch sein können. *Beschreiben* Sie je **zwei** Folgen daraus und *nennen* Sie je **eine** Möglichkeit, den Prozess zu verbessern. *Tragen* Sie Ihre Antworten in die Tabelle *ein*.

| Problem | Folgen | Verbesserung |
|---|---|---|
| | | |
| | | |

**C5 (3 P):** Änderungen an Geschäftsprozessen können große Risiken mit sich bringen. *Nennen* Sie **drei** Faktoren, mit denen mögliche Risiken bewertet werden.

## Block D – Wirtschaftlichkeit und Auswertung (26 P)

Die Geschäftsleitung überlegt, HolzCheck samt App in der Manufaktur fest einzuführen. Erwartet wird, dass weniger Holz reißt oder sich verzieht: Der **Umsatz** soll dadurch um **10 %** steigen. Durch den höheren Grad der Digitalisierung sollen die **Personalkosten** um **20 %** sinken. Der Zuschlagsatz für die **sonstigen Gemeinkosten** sinkt auf **5 %**. Die Abschreibung auf Investitionen steigt auf 38.000 EUR.

**D1 (12 P):** Die Kalkulation bewertet den Ist-Prozess. *Ermitteln* Sie, wie sich der Gewinn durch die Einführung verändert, wenn alle Annahmen eintreffen: *Vervollständigen* Sie die Kalkulation für den neuen Prozess, *tragen* Sie die Werte in die Tabelle *ein* und *geben* Sie die Veränderung des Gewinns in EUR *an*.

| Kalkulation (EUR) | Zuschlagsatz Ist | Ist-Prozess | Zuschlagsatz neu | neuer Prozess |
|---|---|---|---|---|
| Materialeinzelkosten | | 240.000 | | 240.000 |
| + Materialgemeinkosten | 5 % | 12.000 | 5 % | 12.000 |
| = Materialkosten | | 252.000 | | 252.000 |
| + Personalkosten | | 150.000 | | |
| + Abschreibung auf Investitionen | | 2.000 | | 38.000 |
| + sonstige Kosten | | 4.000 | | 4.000 |
| = Herstellkosten | | 408.000 | | |
| + sonstige Gemeinkosten | 10 % | 40.800 | 5 % | |
| = Selbstkosten | | 448.800 | | |
| Gewinn | 25 % | 112.200 | | |
| Umsatz | | 561.000 | | |

> **Formeln:**
> - Herstellkosten = Materialkosten + Personalkosten + Abschreibung + sonstige Kosten
> - sonstige Gemeinkosten = Herstellkosten · Zuschlagsatz
> - Selbstkosten = Herstellkosten + sonstige Gemeinkosten
> - Gewinn = Umsatz − Selbstkosten
> - Gewinnzuschlag in % = Gewinn / Selbstkosten · 100 %

**D2 (8 P):** Im Idealfall sinkt die Holzfeuchte im Lager gleichmäßig mit der Zeit. Seit der Probephase mit HolzCheck werden die Holzfeuchte, der Anteil schlecht durchlüfteter Stapel und die Arbeitsstunden im Lager erfasst. *Stellen* Sie die Daten der beiden folgenden Übersichten in **zwei** übersichtlichen Diagrammen *dar* (Papier).

**Anteil schlecht durchlüfteter Stapel in % je Lagerbox**

| Lagerbox | Monat 1 | Monat 2 | Monat 3 | Monat 4 | Monat 5 | Monat 6 |
|---|---|---|---|---|---|---|
| Box 1 | 18 | 30 | 40 | 52 | 8 | 4 |
| Box 2 | 12 | 26 | 44 | 56 | 6 | 5 |
| Box 3 | 16 | 34 | 41 | 48 | 10 | 3 |
| Box 4 | 20 | 22 | 36 | 50 | 4 | 6 |
| Box 5 | 24 | 28 | 39 | 53 | 9 | 2 |
| Box 6 | 18 | 28 | 46 | 53 | 5 | 4 |
| Durchschnitt | 18 | 28 | 41 | 52 | 7 | 4 |

**Personaleinsatz im Lager in Stunden**

| Person | Monat 1 | Monat 2 | Monat 3 | Monat 4 | Monat 5 | Monat 6 |
|---|---|---|---|---|---|---|
| Jonas Reimers | 80 | 72 | 40 | 88 | 22 | 16 |
| Aylin Demir | 150 | 128 | 80 | 136 | 56 | 50 |
| Petra Lüders | 60 | 32 | 28 | 36 | 0 | 0 |
| Malte Hinrichs | 50 | 52 | 32 | 50 | 20 | 22 |
| Summe | 340 | 284 | 180 | 310 | 98 | 88 |

**D3 (6 P):** Ein Liniendiagramm zeigt die mittlere Holzfeuchte im Lager: Monat 1: 28 %, Monat 2: 22 %, Monat 3: 22 %, Monat 4: 21 %, Monat 5: 16 %, Monat 6: 11 %. *Analysieren* Sie die Daten aus D2 in Verbindung mit diesem Verlauf: *Stellen* Sie einen Zusammenhang *her* und *leiten* Sie **zwei** Gründe für den ungewöhnlichen Verlauf der Holzfeuchte *ab*.

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich nenne funktionale Anforderungen an eine App und grenze sie von nichtfunktionalen ab.
- [ ] Ich beschreibe drei Aktivitäten agiler Entwicklung mit Beteiligten und Ergebnis.
- [ ] Ich nenne Gründe, die gegen agiles Vorgehen sprechen.
- [ ] Ich beschreibe die Inhalte eines Testkonzepts und unterscheide sie von einzelnen Testfällen.
- [ ] Ich setze einen Fließtext in ein BPMN-Diagramm mit Lanes, exklusivem Gateway und Zeitereignis um.
- [ ] Ich nenne andere Darstellungsformen für Prozesse und je ein Unterscheidungsmerkmal zur BPMN.
- [ ] Ich finde Schnittstellen und Medienbrüche in einer Prozessbeschreibung.
- [ ] Ich fülle eine Tabelle Problem – Folgen – Verbesserung mit Bezug zum Prozess.
- [ ] Ich vervollständige eine Zuschlagskalkulation für einen geänderten Prozess und ermittle die Gewinnveränderung.
- [ ] Ich stelle Tabellendaten in passenden Diagrammen dar und leite aus mehreren Reihen einen Zusammenhang ab.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
