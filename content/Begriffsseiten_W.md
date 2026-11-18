<!-- Begriffsseiten W · Stand 2026-10 -->
## Wählbar
<!-- id: wahlbar · quellen: DD13 4.1, DD13 4.3 · stand: 2026-10 -->

Wählbar ist, wer bei einer Betriebsrats- oder JAV-Wahl selbst kandidieren und gewählt werden darf (passives Wahlrecht).

### Erklärung
Für den **Betriebsrat** (§ 8 BetrVG) gilt: wahlberechtigt, mindestens 18 Jahre alt und mindestens **6 Monate** im Betrieb (Zeiten in anderen Betrieben desselben Unternehmens oder Konzerns zählen mit). Für die **Jugend- und Auszubildendenvertretung** (§ 61 Abs. 2 BetrVG) gilt: Wer das **25. Lebensjahr noch nicht vollendet** hat oder zur Berufsausbildung beschäftigt ist – also Auszubildende jeden Alters. Betriebsratsmitglieder können nicht zugleich in die JAV gewählt werden. Amtszeit: Betriebsrat **4 Jahre**, JAV **2 Jahre**.

### Beispiel
Lea Sommer (24 Jahre, 3. Ausbildungsjahr) ist für die JAV des Möbelhauses wählbar. Wäre sie 26 und weiterhin Auszubildende, wäre sie es ebenfalls – seit 2021 gibt es für Auszubildende keine Altersgrenze mehr.

### Abgrenzung
| Gremium | wahlberechtigt | wählbar |
|---|---|---|
| Betriebsrat | Arbeitnehmer ab 16 | ab 18, 6 Monate im Betrieb |
| JAV | unter 18 oder Azubi | unter 25 oder Azubi, nicht im Betriebsrat |

### Prüfungsfalle
Wahlberechtigt und wählbar werden verwechselt: Ein 17-jähriger Azubi darf den Betriebsrat wählen, aber nicht in ihn gewählt werden.

### Merksatz
Wählen ab 16, gewählt werden ab 18 – in der JAV bis unter 25 oder als Azubi.

Siehe auch: Wahlberechtigt · Betriebsrat · Jugend- und Auszubildendenvertretung
Mehr: Deep Dive 13, 4.1 · Deep Dive 13, 4.3

## Wahlberechtigt
<!-- id: wahlberechtigt · quellen: DD13 4.1 · stand: 2026-10 -->

Wahlberechtigt zur Betriebsratswahl sind alle Arbeitnehmer des Betriebs, die das **16. Lebensjahr** vollendet haben (§ 7 BetrVG).

### Erklärung
Das aktive Wahlrecht hängt nicht von der Dauer der Betriebszugehörigkeit ab. Leiharbeitnehmer sind wahlberechtigt, wenn sie **länger als drei Monate** im Betrieb eingesetzt werden. Die Zahl der wahlberechtigten Arbeitnehmer entscheidet, ob überhaupt ein Betriebsrat gewählt werden kann (in der Regel mindestens 5, davon 3 wählbar) und wie groß er wird. Für die JAV wählen die Beschäftigten unter 18 und alle Auszubildenden (§ 61 Abs. 1 BetrVG).

### Beispiel
Das Möbelhaus Nordholz hat 140 wahlberechtigte Beschäftigte. Nach der Staffel 101–200 hat der Betriebsrat **7 Mitglieder**. Jonas Brandt (17, Azubi) darf mitwählen.

### Abgrenzung
Wahlberechtigt (aktiv: wählen ab 16) ist nicht wählbar (passiv: kandidieren ab 18 und nach 6 Monaten Betriebszugehörigkeit, § 8 BetrVG).

### Prüfungsfalle
„Wahlberechtigt ab 18“ ist falsch – seit dem Betriebsrätemodernisierungsgesetz 2021 genügt das 16. Lebensjahr.

### Merksatz
Wählen darf, wer 16 ist – Betriebszugehörigkeit egal.

Siehe auch: Wählbar · Betriebsrat · Jugend- und Auszubildendenvertretung
Mehr: Deep Dive 13, 4.1

## Walkthrough
<!-- id: walkthrough · quellen: Karte DD16, DD16 1.2 · stand: 2026-10 -->

Wenig formales Review, bei dem der Autor sein Arbeitsergebnis vorstellt und die Teilnehmer Fragen stellen und Hinweise geben; Ziel ist vor allem gemeinsames Verständnis.

### Erklärung
Der Walkthrough gehört zu den **statischen Prüfungen**: Das Prüfobjekt (Dokument, Datenmodell, SQL-Skript) wird nicht ausgeführt, sondern besprochen. Der Autor führt durch das Ergebnis, oft anhand eines Szenarios. Es gibt kaum Vorbereitung, keine festen Rollen und meist nur ein knappes Protokoll. Er eignet sich, um Wissen zu verteilen und Missverständnisse früh zu finden.

### Beispiel
Die Entwicklerin stellt dem Fachbereich das Datenmodell für das Reparatur-Reporting vor und spielt einen Auftrag von der Annahme bis zur Rechnung durch. Dabei fällt auf, dass Teillieferungen von Ersatzteilen nicht abbildbar sind.

### Abgrenzung
| Review-Art | Formalität | Leitung |
|---|---|---|
| informelles Review | keine | – |
| Walkthrough | gering | Autor |
| technisches Review | mittel | Moderator, Fachkollegen |
| Inspektion | hoch (Rollen, Checklisten, Metriken) | geschulter Moderator |

### Prüfungsfalle
Ein Walkthrough ist kein Test – es wird nichts ausgeführt, er ist eine statische Prüfung.

### Merksatz
Beim Walkthrough führt der Autor durch sein Werk.

Siehe auch: Review · Inspektion · Statische Prüfung
Mehr: Deep Dive 16, 1.2

## Wasserfall, V-Modell, Scrum und Kanban im Vergleich
<!-- id: wasserfall-v-modell-scrum-und-kanban-im-vergleich · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-11 -->

Vier Vorgehensmodelle für IT-Projekte: Wasserfall und V-Modell planen alle Phasen im Voraus nacheinander (klassisch), Scrum und Kanban liefern in kleinen Schritten und passen sich laufend an (agil).

### Erklärung
| Kriterium | Wasserfall | V-Modell | Scrum | Kanban |
|---|---|---|---|---|
| Prinzip | Phasen streng nacheinander | wie Wasserfall, jeder Entwurfsstufe steht eine Teststufe gegenüber | iterativ-inkrementell in Sprints (höchstens ein Monat) | kontinuierlicher Fluss, Arbeit wird gezogen (Pull) |
| Planung | vorab vollständig | vorab vollständig, Tests früh mitgeplant | je Sprint, Product Backlog laufend priorisiert | keine feste Planung, WIP-Limits steuern |
| Rollen | Projektleiter, Fachabteilung, Entwicklung | wie Wasserfall, mit Qualitätssicherung | Product Owner, Scrum Master, Developers | keine vorgeschrieben |
| Änderungen | teuer, Rückschritt in frühere Phase | teuer, Entwurf und Testfälle der Ebene ändern sich mit | jederzeit über das Backlog | jederzeit als neue Karte |
| Ergebnis sichtbar | am Ende | am Ende | nach jedem Sprint | laufend, Karte für Karte |
| Qualitätssicherung | Test am Ende | Teststufen je Entwurfsebene, hohe Nachweisbarkeit | Definition of Done je Inkrement | Prüfspalte, Fertig-Kriterien |
| Dokumentation | hoch | sehr hoch | so viel wie nötig | gering |
| Stärke | klare Termine und Kosten | Qualitätsnachweis | schnelle Rückmeldung, flexibel | einfach einführbar, deckt Engpässe auf |
| Schwäche | starr, Fehler spät entdeckt | starr, dokumentationsintensiv | Endtermin und Aufwand schwer festzulegen | keine Planungsstruktur |
| passt, wenn | Anforderungen klar und stabil | zusätzlich Prüf- und Nachweispflicht (z. B. Behörden, V-Modell XT) | Anforderungen unklar oder veränderlich, Fachbereich arbeitet mit | laufender Betrieb mit unregelmäßigen Aufgaben |

**Wann nehme ich was?** Frage zuerst: Sind die Anforderungen klar und stabil? Dann reicht ein klassisches Modell; kommen Prüf- und Nachweispflichten hinzu, ist das V-Modell passender als der reine Wasserfall. Sind sie unklar oder ändern sie sich und der Fachbereich kann laufend mitarbeiten, wähle Scrum. Kommen die Aufgaben als Strom unterschiedlich großer Anfragen und gibt es keine Projektlaufzeit, wähle Kanban. Bei einer festen Frist mit unklaren Details (typisch IHK-Projekt) ist oft ein **hybrides** Vorgehen sinnvoll: fester Rahmen mit Meilensteinen, iterative Umsetzung darin. Eine Auswahl wird immer mit dem Szenario begründet, nicht mit „agil ist moderner“.

### Beispiel
Die Möbelhaus Nordholz GmbH will ein Reporting-Dashboard bauen. Dasselbe Vorhaben in den vier Modellen:

**Wasserfall:** Anforderungen (Lasten- und Pflichtenheft) 3 Wochen, Entwurf 2, Implementierung 6, Test 2, Einführung 1: $3 + 2 + 6 + 2 + 1 = 14$ Wochen. Der Vertrieb sieht das erste lauffähige Dashboard in Woche 14.

**V-Modell:** Plan ebenfalls 14 Wochen. Die Testfälle entstehen aber mit der jeweiligen Entwurfsstufe: Abnahmekriterien aus dem Lastenheft, Systemtestfälle aus dem Pflichtenheft. Der Fachbereich sieht das Ergebnis ebenfalls erst am Ende, aber der Qualitätsnachweis liegt lückenlos vor.

**Scrum:** Das Product Backlog umfasst 120 Story Points, das Team schafft 20 Punkte je Zwei-Wochen-Sprint: $\frac{120}{20} = 6$ Sprints, $6 \cdot 2 = 12$ Wochen. Nach Sprint 1 (Woche 2) gibt es ein erstes nutzbares Inkrement. In Woche 8 wünscht der Vertrieb eine weitere Kennzahl mit 20 Punkten: $\frac{140}{20} = 7$ Sprints, also 14 Wochen – oder der Product Owner tauscht die Kennzahl gegen 20 Punkte weniger wichtige Wünsche, dann bleibt es bei 12 Wochen. Im Wasserfall wäre dieselbe Änderung ein Änderungsantrag mit Rückschritt in den Entwurf.

**Kanban:** Nach dem Livegang kommen Berichtsanfragen unregelmäßig herein. Das Team arbeitet höchstens 6 Anfragen gleichzeitig ab (WIP-Limit) und schließt im Schnitt 3 Anfragen pro Woche ab. Faustformel für einen stabilen Fluss: Durchlaufzeit $= \frac{\text{WIP}}{\text{Durchsatz}} = \frac{6}{3} = 2$ Wochen. Ohne Limit, etwa 12 angefangene Anfragen bei gleichem Durchsatz, wären es $\frac{12}{3} = 4$ Wochen: Mit WIP-Limit wird jede Anfrage im Schnitt in der halben Zeit fertig.

### Abgrenzung
- **Wasserfall und V-Modell** sind klassisch (sequenziell), **Scrum und Kanban** agil; das V-Modell ist keine agile Methode, nur weil es Tests früh plant.
- **Scrum** ist ein Rahmenwerk mit Rollen (Verantwortlichkeiten), Events und Artefakten; **Kanban** ist eine Methode ohne Sprints und Pflichtrollen, das **Kanban-Board** ist ihr Werkzeug.
- Das **V-Modell XT** ist das Vorgehensmodell des Bundes mit Projekttypen und Tailoring, nicht dasselbe wie das allgemeine V-Modell.
- Der **Scrum Master** ist kein Projektleiter, sondern verantwortet Scrum und räumt Hindernisse aus dem Weg.

### Prüfungsfalle
Das Wasserfallmodell bei unklaren, veränderlichen Anforderungen begründen oder Scrum bei festem Pflichtenheft und Festpreis – die Begründung muss zum Szenario passen. Weitere Klassiker: Kanban mit Sprints, „agil heißt ohne Planung und Dokumentation“, Backlog Refinement als Scrum-Event nennen und V-Modell und Wasserfall gleichsetzen, obwohl das V-Modell jeder Entwurfsstufe eine Teststufe zuordnet.

### Merksatz
Klar und stabil: klassisch (mit Nachweispflicht V-Modell); unklar und veränderlich: Scrum; Dauerbetrieb mit Anfragenstrom: Kanban.

Siehe auch: Wasserfallmodell · V-Modell · V-Modell XT · Scrum · Kanban · Agile Vorgehensmodelle · Kanban-Board · WIP-Limit · Sprint · Product Backlog · Product Owner · Scrum Master · Lastenheft · Pflichtenheft · Durchlaufzeit
Mehr: Deep Dive 12, Teil 2

## Wasserfallmodell
<!-- id: wasserfallmodell · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Klassisches Vorgehensmodell mit streng sequenziellen Phasen, in dem jede Phase abgeschlossen sein muss, bevor die nächste beginnt.
Auch: Wasserfall

### Erklärung
Typische Phasen: Anforderungsanalyse (Lastenheft, Pflichtenheft) – Entwurf – Implementierung – Test – Einführung und Betrieb. Jede Phase endet mit einem Dokument oder Meilenstein, das die nächste Phase als Eingabe nutzt. Stärken sind klare Planung, feste Termine und Kosten; Schwächen: Änderungen sind teuer und der Auftraggeber sieht das Ergebnis erst am Ende. Das Modell passt, wenn Anforderungen **klar und stabil** sind.

Die Abbildung zeigt die Phasen als Treppe: Jede Stufe liefert ein Dokument für die nächste, ein Rücksprung kostet viel.

**Abbildung: Wasserfallmodell mit Rücksprung**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 224" width="360" height="224" role="img" aria-label="Wasserfallmodell als Treppe mit fünf Phasen: Anforderungen, Entwurf, Implementierung, Test, Einführung; ein gestrichelter Pfeil zeigt den teuren Rücksprung vom Test zum Entwurf">
<defs><marker id="wasserfallmodell-pfeil" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker><marker id="wasserfallmodell-rueck" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<path d="M190,143 H44 V63 H64" class="dg-linie dg-strich" marker-end="url(#wasserfallmodell-rueck)"/>
<rect x="4" y="10" width="96" height="26" class="dg-akzent"/>
<text x="52" y="23" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Anforderungen</text>
<text x="104" y="23" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">→ Lasten- und Pflichtenheft</text>
<line x1="84" y1="36" x2="84" y2="50" class="dg-linie" marker-end="url(#wasserfallmodell-pfeil)"/>
<rect x="66" y="50" width="96" height="26" class="dg-akzent"/>
<text x="114" y="63" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Entwurf</text>
<text x="166" y="63" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">→ Entwurfsdokumente</text>
<line x1="146" y1="76" x2="146" y2="90" class="dg-linie" marker-end="url(#wasserfallmodell-pfeil)"/>
<rect x="128" y="90" width="96" height="26" class="dg-akzent"/>
<text x="176" y="103" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Implementierung</text>
<text x="228" y="103" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">→ Quellcode</text>
<line x1="208" y1="116" x2="208" y2="130" class="dg-linie" marker-end="url(#wasserfallmodell-pfeil)"/>
<rect x="190" y="130" width="96" height="26" class="dg-akzent"/>
<text x="238" y="143" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Test</text>
<text x="290" y="143" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">→ Protokoll</text>
<line x1="270" y1="156" x2="270" y2="170" class="dg-linie" marker-end="url(#wasserfallmodell-pfeil)"/>
<rect x="252" y="170" width="96" height="26" class="dg-akzent"/>
<text x="300" y="183" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Einführung</text>
<text x="50" y="168" text-anchor="start" dominant-baseline="middle" class="dg-klein">Fehler im Test: Rücksprung</text>
<text x="50" y="182" text-anchor="start" dominant-baseline="middle" class="dg-klein">zum Entwurf ist teuer</text>
<text x="180" y="214" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Jede Phase endet mit einem Dokument oder Meilenstein.</text>
</svg>
```

### Beispiel
Die Umstellung des Möbelhauses auf ein gesetzlich vorgeschriebenes Exportformat ist vollständig spezifiziert – das Wasserfallmodell mit festem Endtermin passt hier gut.

### Abgrenzung
| Modell | Prinzip |
|---|---|
| Wasserfall | Phasen nacheinander, Test am Ende |
| V-Modell | Wasserfall mit gegenübergestellten Teststufen |
| Scrum | iterativ-inkrementell in Sprints |

### Prüfungsfalle
Wer bei unklaren, sich ändernden Anforderungen das Wasserfallmodell begründet, verliert Punkte – dann passt ein agiles oder hybrides Vorgehen.

### Merksatz
Wasser fließt nicht bergauf – zurück in eine frühere Phase ist teuer.

Siehe auch: V-Modell · Scrum · Agile Vorgehensmodelle · Lastenheft · Wasserfall, V-Modell, Scrum und Kanban im Vergleich
Mehr: Deep Dive 12, Teil 2

## WCAG
<!-- id: wcag · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Web Content Accessibility Guidelines – internationaler Standard des W3C für barrierefreie Webinhalte mit den vier Prinzipien wahrnehmbar, bedienbar, verständlich, robust.

### Erklärung
Aktuelle Fassung ist **WCAG 2.2** (Stand 2026). Jedes Prinzip ist in Richtlinien und prüfbare Erfolgskriterien der Stufen A, AA und AAA gegliedert; rechtlich gefordert ist meist **AA**. In Deutschland verpflichtet die **BITV 2.0** öffentliche Stellen, seit dem 28. Juni 2025 das **Barrierefreiheitsstärkungsgesetz (BFSG)** viele Unternehmen mit Angeboten für Verbraucher. Für Dashboards heißt das: Information nie nur über Farbe, ausreichender Kontrast (normaler Text 4,5 : 1, Grafikelemente 3 : 1), Alternativtexte oder Datentabelle, Bedienung per Tastatur.

### Beispiel
Die Ampel im Reparatur-Dashboard zeigt den Status zusätzlich als Text („kritisch“) und Symbol, damit Nutzer mit Rot-Grün-Sehschwäche ihn erkennen.

### Abgrenzung
WCAG regelt die Barrierefreiheit (Nutzbarkeit für Menschen mit Einschränkungen); ISO 9241-110 regelt allgemeine Interaktionsprinzipien der Gebrauchstauglichkeit.

### Prüfungsfalle
Die vier Prinzipien werden mit den ISO-9241-Prinzipien vermischt – WCAG hat genau vier: wahrnehmbar, bedienbar, verständlich, robust.

### Merksatz
Wahrnehmen, bedienen, verstehen – und robust für jede Technik.

Siehe auch: Barrierefreiheit · Gebrauchstauglichkeit · Dashboard
Mehr: Deep Dive 11, A5

## Webhook
<!-- id: webhook · quellen: Karte DD15, DD15 3.1 · stand: 2026-10 -->

Mechanismus, bei dem der Sender eine Änderung aktiv per HTTP-Aufruf (meist POST mit JSON) an eine vorher vereinbarte Adresse des Empfängers meldet.

### Erklärung
Der Empfänger registriert beim Quellsystem eine URL. Tritt ein Ereignis ein (neuer Auftrag, Statuswechsel), ruft das Quellsystem diese URL sofort auf. Das ist effizient und nahezu in Echtzeit, setzt aber voraus, dass der Empfänger erreichbar ist und Aufrufe absichert (HTTPS, Signatur oder geheimes Token, Wiederholung bei Fehlern).

### Beispiel
Der Onlineshop meldet jede neue Bestellung per Webhook an das Lagersystem: `POST /webhooks/bestellung` mit der Bestellnummer im JSON-Body. Das Lager muss nicht minütlich nachfragen.

### Abgrenzung
| Verfahren | Wer wird aktiv? | Nachteil |
|---|---|---|
| Polling | Empfänger fragt regelmäßig | viele leere Anfragen, Verzögerung |
| Webhook | Sender meldet sofort | Empfänger muss erreichbar sein |

### Prüfungsfalle
Webhook und Polling werden vertauscht – beim Webhook „ruft der Sender an“, beim Polling „schaut der Empfänger nach“.

### Merksatz
Polling fragt, Webhook sagt Bescheid.

Siehe auch: Polling · REST-API · API
Mehr: Deep Dive 15, 3.1

## Wegeunfall
<!-- id: wegeunfall · quellen: Karte DD14, DD14 5.1 · stand: 2026-10 -->

Unfall auf dem unmittelbaren Weg zwischen Wohnung und Arbeitsstätte bzw. Berufsschule; er ist wie ein Arbeitsunfall über die gesetzliche Unfallversicherung (Berufsgenossenschaft) versichert (§ 8 Abs. 2 SGB VII).

### Erklärung
Der Weg beginnt mit dem Durchschreiten der **Außentür des Wohngebäudes** – ein Sturz im Treppenhaus davor ist nicht versichert. Versichert sind auch Umwege, um Kinder in fremde Obhut zu geben (Kita), und Fahrgemeinschaften. Private Unterbrechungen (Einkauf) sind nicht versichert. Im **Homeoffice** besteht seit 2021 Versicherungsschutz im gleichen Umfang wie im Betrieb, einschließlich des Wegs zur Kita. Die Beiträge zahlt allein der Arbeitgeber.

### Beispiel
Herr Kaya bringt auf dem Weg zur Arbeit seine Tochter in die Kita und stürzt vor dem Kita-Eingang – das ist ein versicherter Wegeunfall. Hält er danach zum Einkaufen beim Supermarkt, ist der Abstecher nicht versichert.

### Abgrenzung
Arbeitsunfall: Unfall bei der versicherten Tätigkeit selbst. Wegeunfall: Unfall auf dem Weg dorthin oder zurück. Beide trägt die Unfallversicherung, nicht die Krankenkasse.

### Prüfungsfalle
Der Sturz auf der Treppe im eigenen Mehrfamilienhaus wird als Wegeunfall gewertet – versichert ist erst ab der Haustür.

### Merksatz
Versichert ab der Haustür – Kita-Umweg ja, Einkaufsbummel nein.

Siehe auch: Unfallversicherung · Berufsgenossenschaft · Unfall
Mehr: Deep Dive 14, 5.1

## Weisungsrecht
<!-- id: weisungsrecht · quellen: Karte DD13, DD13 3.1, DD25 Teil 2, DD32 Teil 4 · stand: 2026-11 -->

Recht des Arbeitgebers, Inhalt, Ort und Zeit der Arbeitsleistung sowie Ordnung und Verhalten im Betrieb nach billigem Ermessen näher zu bestimmen, soweit Vertrag, Betriebsvereinbarung, Tarifvertrag oder Gesetz nichts anderes festlegen (§ 106 GewO).

Auch: Direktionsrecht

### Erklärung
Der Arbeitsvertrag beschreibt die Arbeit nur im Rahmen; der Arbeitgeber **konkretisiert** sie durch Weisungen (§ 611a BGB: weisungsgebundene Arbeit). Gegenstand sind **Inhalt** (welche Aufgaben im Rahmen der vereinbarten Tätigkeit), **Ort** (z. B. andere Filiale, wenn der Vertrag den Einsatzort offen lässt), **Zeit** (Lage der Arbeitszeit, nicht ihr Umfang) und **Ordnung und Verhalten** (Dienstkleidung, Zugangsregeln, Umgang mit IT-Systemen).

**Grenzen:** Die Weisung muss billiges Ermessen wahren (Interessen beider Seiten abwägen) und darf nicht gegen Gesetz (Arbeitszeitgesetz, JArbSchG, Mutterschutz, AGG), Tarifvertrag, Betriebsvereinbarung oder Arbeitsvertrag verstoßen. Bei Arbeitszeitlage, Überwachung oder Versetzungen redet der Betriebsrat mit (§ 87, § 99 BetrVG). Rechtswidrige Weisungen müssen nicht befolgt werden; wer eine rechtmäßige Weisung verweigert, riskiert Abmahnung und verhaltensbedingte Kündigung.

**Besonderheiten:** Dem Auszubildenden dürfen nur Aufgaben übertragen werden, die dem Ausbildungszweck dienen und seinen Kräften angemessen sind (§ 14 BBiG); er muss Weisungen im Rahmen der Ausbildung befolgen (§ 13 BBiG). Bei **Leiharbeit** erteilt der Entleiher die fachlichen Weisungen.

### Beispiel
| Weisung | zulässig? |
|---|---|
| Die Verkäuferin soll ab Montag in der zweiten Filiale der Möbelhaus Nordholz GmbH im selben Stadtgebiet arbeiten; der Vertrag lässt den Einsatzort offen | ja, Konkretisierung des Orts |
| Der Datenanalystin wird das Gehalt gekürzt, weil sie „zu langsam“ sei | nein, Vergütung ist Vertragsinhalt; nur Vertragsänderung oder Änderungskündigung |
| Der Azubi soll dauerhaft nur Regale einräumen statt IT-Aufgaben zu lernen | nein, kein Ausbildungszweck (§ 14 BBiG) |
| Die Arbeitszeit wird ohne Betriebsrat auf Schichtdienst umgestellt | nur mit Mitbestimmung des Betriebsrats (§ 87 BetrVG) |

### Abgrenzung
Von der **Weisungsbefugnis im Organigramm** (wer darf wem Anweisungen geben: Einlinien-, Mehrlinien-, Stabliniensystem) unterscheidet sich das arbeitsrechtliche Weisungsrecht durch Rechtsgrundlage und Grenzen. In der DSGVO ist der Auftragsverarbeiter „weisungsgebunden“ – anderer Zusammenhang.

### Prüfungsfalle
Das Weisungsrecht für grenzenlos halten oder glauben, durch Weisung ließen sich wesentliche Vertragsbedingungen (Vergütung, Arbeitszeitumfang, Art der Tätigkeit) ändern. Das geht nur durch Vertragsänderung oder Änderungskündigung.

### Merksatz
Der Arbeitgeber darf den Vertrag konkretisieren, nicht ändern – und nur nach billigem Ermessen.

Siehe auch: Arbeitsvertrag · Mitbestimmung · Betriebsvereinbarung · Einliniensystem · Stabliniensystem · Leiharbeit · Abmahnung · Ausbildungsbetrieb
Mehr: Deep Dive 13, 3.1 · Deep Dive 25, Teil 2

## Weiterarbeit ohne Vereinbarung
<!-- id: weiterarbeit-ohne-vereinbarung · quellen: DD13 1.4 · stand: 2026-10 -->

Wird ein Auszubildender nach dem Ende der Ausbildung weiterbeschäftigt, ohne dass ausdrücklich etwas vereinbart wurde, gilt ein **unbefristetes Arbeitsverhältnis** als begründet (§ 24 BBiG).

### Erklärung
Die Regel schützt Auszubildende davor, nach der Prüfung ohne klare Rechtsgrundlage weiterzuarbeiten. Es genügt, dass der Betrieb die Arbeitsleistung im Anschluss an das Ausbildungsende tatsächlich annimmt. Eine Befristung müsste vorher **schriftlich** vereinbart werden (§ 14 Abs. 4 TzBfG). Das Ausbildungsverhältnis endet regulär mit Ablauf der Ausbildungszeit oder – bei vorzeitigem Bestehen – mit der **Bekanntgabe des Prüfungsergebnisses**.

### Beispiel
Lea Sommer besteht ihre Abschlussprüfung, das Ergebnis wird ihr am 20.01.2027 mitgeteilt. Sie kommt am 21.01. wie gewohnt in den Betrieb und arbeitet weiter, ohne dass ein neuer Vertrag geschlossen wurde – damit besteht ein unbefristetes Arbeitsverhältnis.

### Abgrenzung
Übernahmeanspruch nach § 78a BetrVG: JAV- oder Betriebsratsmitglieder können die Übernahme aktiv verlangen. § 24 BBiG greift dagegen ohne jede Erklärung, allein durch Weiterarbeit.

### Prüfungsfalle
Das Ausbildungsende wird auf das Vertragsende gelegt – bei vorzeitigem Bestehen zählt die Bekanntgabe des Ergebnisses; wer danach weiterarbeitet, ist unbefristet angestellt.

### Merksatz
Weiterarbeiten ohne Absprache heißt: unbefristet eingestellt.

Siehe auch: Probezeit · Ausbildungsbetrieb · Jugend- und Auszubildendenvertretung
Mehr: Deep Dive 13, 1.4

## Werktage und Arbeitstage
<!-- id: werktage-und-arbeitstage · quellen: Karte DD13, DD13 2.3, DD26 Teil 1 · stand: 2026-11 -->

Werktage sind alle Kalendertage außer Sonn- und gesetzlichen Feiertagen (also Montag bis Samstag, sechs je Woche, § 3 Abs. 2 BUrlG); Arbeitstage sind die Tage, an denen im Betrieb tatsächlich gearbeitet wird, meist Montag bis Freitag.

Auch: Werktage, Arbeitstage, Werktag, Arbeitstag

### Erklärung
Das Gesetz zählt Urlaub in **Werktagen** (BUrlG, JArbSchG). Tarif- und Arbeitsverträge nennen ihn oft in **Arbeitstagen**; wie die Tage gezählt werden, steht dann im Vertrag (häufig: alle Kalendertage außer Samstag, Sonntag und Feiertag). Wer verschiedene Quellen vergleicht, muss erst auf dieselbe Einheit umrechnen:

$\text{Arbeitstage} = \text{Werktage} \cdot \frac{\text{Arbeitstage je Woche}}{6}$

Bei der Fünf-Tage-Woche also Arbeitstage = Werktage · 5/6, umgekehrt Werktage = Arbeitstage · 6/5. Bei einer Vier-Tage-Woche rechnet man mit 4/6. Feiertage, an denen ohnehin keine Arbeitspflicht besteht, zählen nicht als Urlaubstage; bei zulässiger dienstplanmäßiger Feiertagsarbeit kann dagegen ein Urlaubstag nötig sein.

### Beispiel
Mia ist am 01.01.2026 16 Jahre alt, also „noch nicht 17“: Das JArbSchG gibt ihr **27 Werktage**. Der Tarifvertrag der Möbelhaus Nordholz GmbH nennt **26 Arbeitstage**.

Gesetz in Arbeitstagen: $27 \cdot \frac{5}{6}$ = **22,5 Arbeitstage**

Der Tarifvertrag mit 26 Arbeitstagen ist günstiger, also gilt er. Ohne Umrechnung hätte „27 gegen 26“ fälschlich das Gesetz gewinnen lassen. Der gesetzliche Mindesturlaub Erwachsener von 24 Werktagen entspricht ebenso $24 \cdot \frac{5}{6}$ = **20 Arbeitstagen**.

### Abgrenzung
**Kalendertage** zählen jeden Tag (z. B. Fristen wie die Unfallanzeige bei Arbeitsunfähigkeit von mehr als drei Kalendertagen). Auch das Arbeitszeitgesetz rechnet „werktäglich“, also Montag bis Samstag.

### Prüfungsfalle
Werktage und Arbeitstage ohne Umrechnung vergleichen oder falsch herum umrechnen (· 6/5 statt · 5/6). Bei einem Ergebnis wie 22,5 nicht eigenmächtig auf- oder abrunden, wenn die Aufgabe es nicht verlangt.

### Merksatz
Werktage zählen Montag bis Samstag, Arbeitstage Montag bis Freitag: von Werktagen zu Arbeitstagen mal fünf Sechstel.

Siehe auch: Urlaub · JArbSchG · Arbeitszeitgesetz · Günstigkeitsprinzip · Tarifvertrag
Mehr: Deep Dive 26, Teil 1 · Deep Dive 13, 2.3

## Werkvertrag
<!-- id: werkvertrag · quellen: Karte DD14, DD14 2.4 · stand: 2026-10 -->

Vertrag, in dem sich der Unternehmer zur Herstellung eines vereinbarten **Erfolgs** (Werk) gegen Vergütung verpflichtet (§ 631 BGB).

### Erklärung
Geschuldet ist das Ergebnis, nicht der Aufwand. Der Besteller muss das vertragsgemäß hergestellte Werk **abnehmen** (§ 640 BGB); mit der Abnahme wird die Vergütung fällig und die Gewährleistungsfrist beginnt. Bei Mängeln hat der Besteller zuerst Anspruch auf **Nacherfüllung**, danach Selbstvornahme, Rücktritt, Minderung oder Schadensersatz (§ 634 BGB). In IT-Projekten ist die Individualentwicklung mit festgelegten Funktionen typischerweise ein Werkvertrag.

### Beispiel
Das Möbelhaus beauftragt einen Dienstleister mit einem Dashboard, das fünf im Pflichtenheft beschriebene Kennzahlen zeigt. Fehlt eine Kennzahl, ist der Erfolg nicht erbracht – der Dienstleister muss nachbessern.

### Abgrenzung
| Vertrag | geschuldet | Beispiel |
|---|---|---|
| Werkvertrag | Erfolg | Software mit festgelegten Funktionen, Reparatur |
| Dienstvertrag | Tätigkeit | Beratung, Arbeitsvertrag |
| Kaufvertrag | Eigentum an einer Sache | Standardsoftware, Möbel |

### Prüfungsfalle
Der Arbeitsvertrag wird als Werkvertrag eingeordnet – er ist ein Dienstvertrag, weil die Arbeitsleistung, nicht ein Erfolg geschuldet ist.

### Merksatz
Werk = Ergebnis, Dienst = Bemühen.

Siehe auch: Dienstvertrag · Kaufvertrag · Abnahme · Gewährleistung
Mehr: Deep Dive 14, 2.4

## Wertebereichsprüfung (CHECK)
<!-- id: wertebereichsprufung · quellen: DD9 5.1 · stand: 2026-10 -->

Technische Maßnahme der Datenqualität, bei der die Datenbank über einen `CHECK`-Constraint nur Werte innerhalb eines erlaubten Bereichs speichert.

### Erklärung
Die Bedingung wird bei jedem `INSERT` und `UPDATE` geprüft; verletzt ein Wert sie, lehnt das DBMS die Änderung ab. Damit wirkt die Prüfung **präventiv** – der Fehler entsteht gar nicht erst, statt später bereinigt zu werden. Geeignet für Wertebereiche, Auswahllisten und einfache Regeln innerhalb einer Zeile. Einige Systeme (MySQL, Oracle) erlauben in `CHECK` keine nicht-deterministischen Funktionen wie `CURRENT_DATE`; dann prüft man per Trigger oder in der Anwendung.

### Beispiel
```sql
CREATE TABLE reparaturauftrag (
  auftrag_id INTEGER PRIMARY KEY,
  kosten     DECIMAL(8,2) CHECK (kosten >= 0),
  status     VARCHAR(20) CHECK (status IN ('angelegt','in Bearbeitung','erledigt','storniert'))
);
```
Ein Auftrag mit `kosten = -50` wird abgewiesen.

### Abgrenzung
| Constraint | sichert |
|---|---|
| `NOT NULL` | Vollständigkeit |
| `UNIQUE` | keine exakten Dubletten |
| `CHECK` | erlaubter Wertebereich |
| `FOREIGN KEY` | referenzielle Integrität |

### Prüfungsfalle
`CHECK` erkennt keine fachlich falschen, aber erlaubten Werte – ein Tippfehler 150 statt 15 € bleibt unentdeckt.

### Merksatz
CHECK hält unmögliche Werte draußen, nicht falsche.

Siehe auch: CHECK · NOT NULL · UNIQUE-Constraint · Plausibilitätsprüfung
Mehr: Deep Dive 9, 5.1

## Wertschöpfungskette nach Porter
<!-- id: wertschopfungskette-nach-porter · quellen: Karte DD5, DD5 6.5 · stand: 2026-10 -->

Modell von Michael E. Porter, das ein Unternehmen in **primäre Aktivitäten** (direkter Beitrag zum Produkt) und **unterstützende Aktivitäten** gliedert, um zu zeigen, wo Wert und Kosten entstehen.

### Erklärung
Primäre Aktivitäten: Eingangslogistik, Produktion (Operationen), Ausgangslogistik, Marketing und Vertrieb, Kundendienst. Unterstützende Aktivitäten: Unternehmensinfrastruktur, Personalwirtschaft, Technologieentwicklung, Beschaffung. Die Differenz zwischen dem Wert für den Kunden und den Kosten aller Aktivitäten ist die **Gewinnspanne**. Das Modell dient der strategischen Analyse: Wo entsteht ein Wettbewerbsvorteil, wo fallen Kosten ohne Wertbeitrag an?

### Beispiel
Im Möbelhaus Nordholz sind Wareneingang (Eingangslogistik), Auslieferung (Ausgangslogistik) und der Reparaturservice (Kundendienst) primäre Aktivitäten; die IT-Abteilung mit dem Data Warehouse ist eine unterstützende Aktivität (Technologieentwicklung bzw. Infrastruktur).

### Abgrenzung
Prozesslandkarte: Kern-, Unterstützungs- und Managementprozesse eines konkreten Unternehmens. Porter: allgemeines Raster für die Wertanalyse. SWOT bewertet dagegen Stärken, Schwächen, Chancen und Risiken.

### Prüfungsfalle
Die IT oder die Personalabteilung wird als primäre Aktivität eingeordnet – sie unterstützt nur.

### Merksatz
Primär macht das Produkt, unterstützend macht es möglich.

Siehe auch: SWOT-Analyse · Benchmarking · Unterstützungsprozess
Mehr: Deep Dive 5, 6.5

## Wertstromanalyse
<!-- id: wertstromanalyse · quellen: Karte DD5, DD5 4.1 · stand: 2026-10 -->

Lean-Methode (Value Stream Mapping), die Material- und Informationsfluss sowie Bearbeitungs- und Liegezeiten je Prozessschritt aufnimmt, um Verschwendung sichtbar zu machen.

### Erklärung
Man nimmt den Ist-Wertstrom vom Kunden rückwärts auf und hält je Schritt Bearbeitungszeit, Bestände bzw. Wartezeiten und Informationsflüsse fest. Eine Zeitlinie unter dem Diagramm summiert Liege- und Bearbeitungszeiten; daraus ergeben sich Durchlaufzeit und **Wertschöpfungsanteil**. Auf die Ist-Analyse folgt das **Wertstromdesign** (Soll-Zustand).

### Beispiel
Reparaturauftrag: Bearbeitungszeit 1,5 h, Liegezeit 28,5 h → Durchlaufzeit 30 h.
$\text{Wertschöpfungsanteil} = \frac{1{,}5}{30} \cdot 100 = 5\ \%$
In 95 % der Zeit passiert mit dem Auftrag nichts – der Hebel liegt bei den Liegezeiten.

### Abgrenzung
Wertstromanalyse = Methode (Aufnehmen und Auswerten). Wertstromdiagramm = die grafische Darstellung dazu. Ishikawa-Diagramm sucht Ursachen eines Problems, nicht Zeiten.

### Prüfungsfalle
Als Maßnahme „schneller arbeiten“ vorzuschlagen – die Wertstromanalyse zeigt fast immer, dass die Liegezeiten das Problem sind.

### Merksatz
Der Wertstrom zeigt, wie lange gewartet und wie kurz gearbeitet wird.

Siehe auch: Wertstromdiagramm · Liegezeit · Durchlaufzeit · Lean Management
Mehr: Deep Dive 5, 4.1

## Wertstromdiagramm
<!-- id: wertstromdiagramm · quellen: DD17 1.3 · stand: 2026-10 -->

Darstellung aus dem Lean Management mit Prozessschritten, Beständen zwischen den Schritten und einer Zeitlinie; Grundlage der Wertstromanalyse.

### Erklärung
Prozessschritte stehen als Kästen mit Datenkasten (z. B. Bearbeitungszeit BZ), Bestände als Dreiecke mit „I“ (Inventory) dazwischen. Die **Zeitlinie** am unteren Rand ist eine Treppe: oben stehen die Liegezeiten (keine Wertschöpfung), unten die Bearbeitungszeiten (wertschöpfend). Summiert ergibt sich die Durchlaufzeit, der Quotient Bearbeitungszeit / Durchlaufzeit ist der Wertschöpfungsanteil.

### Beispiel
Auftrag erfassen (10 min) – Bestand 4 h – Kommissionieren (25 min) – Bestand 2 h – Versenden (15 min).
Bearbeitungszeit 50 min, Liegezeit 360 min, Durchlaufzeit 410 min.
$\text{Wertschöpfungsanteil} = \frac{50}{410} \cdot 100 \approx 12{,}2\ \%$

### Abgrenzung
BPMN zeigt Ablauflogik mit Verzweigungen, aber keine Zeiten und Bestände. Das Wertstromdiagramm zeigt einen linearen Fluss mit Zeiten – ohne Entscheidungen.

### Prüfungsfalle
Oben und unten der Zeitlinie werden vertauscht: Oben steht die Liegezeit, unten die Bearbeitungszeit.

### Merksatz
Oben warten, unten werken.

Siehe auch: Wertstromanalyse · Liegezeit · Bearbeitungszeit · Durchlaufzeit
Mehr: Deep Dive 17, 1.3

## WHERE
<!-- id: where · quellen: Karte DD1, SQL-Zusatz 3.1 · stand: 2026-10 -->

SQL-Klausel, die **einzelne Zeilen vor** der Gruppierung filtert; Aggregatfunktionen sind darin nicht erlaubt.

### Erklärung
Logische Reihenfolge: FROM → **WHERE** → GROUP BY → HAVING → SELECT → ORDER BY. Weil WHERE vor SELECT ausgewertet wird, kennt es keine Spaltenaliasse aus dem SELECT. Vergleiche mit NULL immer über `IS NULL` bzw. `IS NOT NULL`, denn `= NULL` liefert „unbekannt“. AND bindet stärker als OR – bei gemischten Bedingungen Klammern setzen.

### Beispiel
```sql
SELECT ort, COUNT(*) AS anzahl_kunden
FROM kunde
WHERE registriert_am >= '2025-01-01'
GROUP BY ort;
```
DataFit: Nur Clara (Köln), David (München) und Emre (Hamburg) erfüllen die Bedingung – je Ort 1 Kunde.

### Abgrenzung
| Klausel | filtert | Aggregatfunktion erlaubt? |
|---|---|---|
| WHERE | Zeilen vor der Gruppierung | nein |
| HAVING | Gruppen nach GROUP BY | ja |

### Prüfungsfalle
`WHERE COUNT(*) > 2` ist ein Syntaxfehler – Bedingungen auf Aggregate gehören in HAVING.

### Merksatz
WHERE siebt Zeilen, HAVING siebt Gruppen.

Siehe auch: HAVING · GROUP BY · NULL · WHERE und HAVING im Vergleich
Mehr: SQL-Zusatz 3.1

## WHERE und HAVING im Vergleich
<!-- id: where-und-having-im-vergleich · quellen: DD1 2.1, SQL-Belegsatz 1 · stand: 2026-11 -->

WHERE und HAVING filtern beide Ergebnisse einer SQL-Abfrage, aber an verschiedenen Stellen: WHERE sortiert einzelne Zeilen aus, bevor gruppiert wird, HAVING prüft die fertigen Gruppen. Die Entscheidung hängt davon ab, ob die Bedingung eine einzelne Zeile oder einen berechneten Gruppenwert betrifft.

Auch: WHERE vs. HAVING

### Erklärung
| Kriterium | WHERE | HAVING |
|---|---|---|
| Zweck | einzelne Zeilen aussortieren | ganze Gruppen aussortieren |
| Zeitpunkt | nach FROM/JOIN, **vor** GROUP BY | **nach** GROUP BY |
| Bedingung betrifft | Spaltenwerte einer Zeile (`preis > 100`, `ort = 'Köln'`) | berechnete Gruppenwerte (`SUM(…) > 500`, `COUNT(*) >= 2`) |
| Aggregatfunktionen | nicht erlaubt | erlaubt |
| Wirkung auf die Aggregate | sie rechnen nur mit den übrig gebliebenen Zeilen | sie rechnen mit allen Zeilen der Gruppe, erst danach fällt die Gruppe weg |
| Aufwand | senkt die Zeilenzahl früh, effizient | arbeitet auf den fertigen Gruppen |
| Spalten ohne Aggregat | beliebige Spalten der Tabellen | nur Gruppierungsspalten (sonst Fehler oder zufälliger Wert) |

Beide dürfen in **derselben** Abfrage stehen und wirken nacheinander: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.

**Wann nehme ich was?** Frage dich: Kann ich die Bedingung an einer einzelnen Zeile ablesen? Dann WHERE. Muss ich erst summieren, zählen oder mitteln, bevor ich die Bedingung prüfen kann? Dann HAVING. Bedingungen ohne Aggregat schreibst du auch dann ins WHERE, wenn HAVING technisch ginge (z. B. `HAVING kunden_id = 1`) – das ist schneller und leichter zu lesen.

### Beispiel
Möbelhaus Nordholz: Umsatz je Bestellung aus `bestellposition` und `produkt`. Die Abfrage ist in vier Varianten möglich:

```sql
SELECT bp.bestell_id, SUM(bp.menge * p.preis) AS umsatz
FROM bestellposition bp
JOIN produkt p ON p.produkt_id = bp.produkt_id
WHERE p.kategorie = 'Elektronik'          -- Variante B und D
GROUP BY bp.bestell_id
HAVING SUM(bp.menge * p.preis) > 500;     -- Variante C und D
```

| Variante | Filter | Ergebnis (Bestellung: Umsatz in €) |
|---|---|---|
| A | keiner | 100: 876,00 · 101: 518,70 · 102: 516,00 · 103: 945,00 · 104: 249,00 · 105: 79,80 |
| B | nur WHERE (Elektronik) | 100: 378,00 · 102: 516,00 · 103: 945,00 |
| C | nur HAVING (Umsatz > 500) | 100: 876,00 · 101: 518,70 · 102: 516,00 · 103: 945,00 |
| D | beide | 102: 516,00 · 103: 945,00 |

Nachgerechnet: Bestellung 100 besteht aus 2 Bürostühlen (2 · 249,00 = 498,00 €) und 2 Monitoren (2 · 189,00 = 378,00 €), zusammen 876,00 €. In Variante C zählt der ganze Bestellwert, deshalb bleibt sie. In Variante D rechnet die Summe nur mit den Elektronik-Zeilen: 378,00 € sind nicht mehr als 500 €, die Bestellung fällt heraus. Bestellung 101 (Schreibtisch und Lampen, 518,70 €) enthält keine Elektronik und fehlt in B und D. Die Fragen sind also verschieden: C beantwortet „Welche Bestellungen sind insgesamt größer als 500 €?“, D „Bei welchen Bestellungen liegt der **Elektronik**-Umsatz über 500 €?“.

### Abgrenzung
Weder WHERE noch HAVING ist das bessere Werkzeug – sie beantworten verschiedene Fragen. Verwechsle HAVING nicht mit `ORDER BY` oder mit `LIMIT`: HAVING entfernt Gruppen, es sortiert und begrenzt nicht. Auch ein Aliasname aus dem SELECT (`umsatz`) hilft im Standard-SQL weder im WHERE noch im HAVING: Dort steht die Berechnung selbst.

### Prüfungsfalle
`WHERE SUM(bp.menge * p.preis) > 500` oder `WHERE COUNT(*) > 1` schreiben – in der Prüfung ein Syntaxfehler (SQLite meldet „misuse of aggregate“), weil es zum Zeitpunkt des WHERE noch keine Gruppen gibt. Auch die Gegenrichtung kostet Punkte: Einen Zeilenfilter wie `kategorie = 'Elektronik'` ins HAVING zu schreiben, obwohl die Spalte nicht gruppiert ist. Standard-SQL lehnt das ab, SQLite nimmt stillschweigend den Wert irgendeiner Zeile der Gruppe – das Ergebnis ist dann nicht verlässlich.

### Merksatz
WHERE siebt Zeilen vor dem Gruppieren, HAVING siebt Gruppen danach – und nur HAVING darf Aggregate prüfen.

Siehe auch: WHERE · HAVING · GROUP BY · NULL
Mehr: Deep Dive 1, 2.1

## Whisker
<!-- id: whisker · quellen: Karte DD3, DD3 5.1 · stand: 2026-10 -->

Linien eines Boxplots, die von der Box bis zum letzten Datenwert innerhalb der 1,5-fachen IQR-Grenze reichen; Werte außerhalb werden als Ausreißer einzeln gezeichnet.

### Erklärung
Grenzen (Zäune) nach Tukey: unterer Zaun $Q_1 - 1{,}5 \cdot \text{IQR}$, oberer Zaun $Q_3 + 1{,}5 \cdot \text{IQR}$. Der Whisker endet nicht am Zaun selbst, sondern beim **äußersten tatsächlichen Datenwert** innerhalb des Zauns. Nur wenn es keine Ausreißer gibt, reichen die Whisker bis Minimum und Maximum. Manche Darstellungen ziehen die Whisker immer bis Minimum und Maximum (Fünf-Punkte-Zusammenfassung).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 90" width="420" height="90" role="img" aria-label="Boxplot mit Whiskern und einem Ausreißer">
<line x1="40" y1="40" x2="110" y2="40" class="dg-linie"/>
<line x1="40" y1="28" x2="40" y2="52" class="dg-linie"/>
<rect x="110" y="22" width="110" height="36" class="dg-form"/>
<line x1="160" y1="22" x2="160" y2="58" class="dg-linie dg-dick"/>
<line x1="220" y1="40" x2="290" y2="40" class="dg-linie"/>
<line x1="290" y1="28" x2="290" y2="52" class="dg-linie"/>
<circle cx="370" cy="40" r="5" class="dg-rot"/>
<text x="75" y="72" text-anchor="middle" class="dg-klein">Whisker</text>
<text x="255" y="72" text-anchor="middle" class="dg-klein">Whisker</text>
<text x="165" y="14" text-anchor="middle" class="dg-klein">Q1 · Median · Q3</text>
<text x="370" y="72" text-anchor="middle" class="dg-klein">Ausreißer</text>
</svg>
```

### Beispiel
Lieferzeiten: Q1 = 3, Q3 = 6, IQR = 3 → oberer Zaun $6 + 4{,}5 = 10{,}5$. Der größte Wert unter 10,5 ist 8 – dort endet der obere Whisker; der Wert 19 ist ein Ausreißer.

### Prüfungsfalle
Den Whisker bis zum Zaun 10,5 zeichnen – er endet beim letzten echten Wert (8).

### Merksatz
Der Whisker hört beim letzten echten Wert vor dem Zaun auf.

Siehe auch: Boxplot · Interquartilsabstand (IQR) · Ausreißer
Mehr: Deep Dive 3, 5.1

## White-Box-Test
<!-- id: white-box-test · quellen: Karte DD16, DD16 2.2 · stand: 2026-10 -->

Testverfahren, das Testfälle aus der **inneren Struktur** des Codes ableitet, z. B. so, dass jede Anweisung oder jeder Zweig mindestens einmal durchlaufen wird.

### Erklärung
Grundlage ist der Quellcode bzw. das SQL-Skript. Gemessen wird der **Überdeckungsgrad**: Anweisungsüberdeckung (C0) – jede Anweisung mindestens einmal; Zweigüberdeckung (C1) – jeder Zweig jeder Verzweigung, auch der leere Else-Zweig. White-Box-Tests schreibt meist der Entwickler im Komponententest.
$\text{Überdeckungsgrad} = \frac{\text{durchlaufene Zweige}}{\text{alle Zweige}} \cdot 100\ \%$

### Beispiel
`WENN menge > 20 DANN status ← 'Sonderanfrage'` ohne Else: Ein Test mit menge = 25 ergibt 100 % C0, aber nur 1 von 2 Zweigen = 50 % C1. Ein zweiter Test mit menge = 10 bringt 100 % C1.

### Abgrenzung
| | Black-Box | White-Box |
|---|---|---|
| Grundlage | Spezifikation | Quellcode |
| Verfahren | Äquivalenzklassen, Grenzwerte | C0, C1 |
| typische Stufe | System-, Abnahmetest | Komponententest |

### Prüfungsfalle
100 % Überdeckung heißt nicht fehlerfrei – eine fehlende Anforderung findet kein White-Box-Test, weil es dafür keinen Code gibt.

### Merksatz
White-Box schaut hinein, Black-Box schaut auf das Verhalten.

Siehe auch: Black-Box-Test · Anweisungsüberdeckung (C0) · Zweigüberdeckung (C1) · Grey-Box-Test
Mehr: Deep Dive 16, 2.2

## Wide-Column-Store
<!-- id: wide-column-store · quellen: Karte DD15, DD15 4.1 · stand: 2026-10 -->

NoSQL-Datenbanktyp, der Zeilen mit flexiblen Spalten in **Spaltenfamilien** speichert und auf viele Server verteilt, z. B. Apache Cassandra.

### Erklärung
Jede Zeile hat einen Schlüssel und kann beliebig viele, je Zeile unterschiedliche Spalten haben. Daten werden über den Partitionsschlüssel auf Knoten verteilt; das System skaliert **horizontal** und verkraftet sehr hohe Schreiblasten. Abfragen sind meist nur über den Schlüssel effizient; Joins gibt es nicht. Viele Systeme dieser Art sind auf Verfügbarkeit ausgelegt und nur **eventually consistent** (BASE).

### Beispiel
Sensordaten der Kühlräume eines Möbellagers: Schlüssel = Sensor-ID und Tag, Spalten = Messzeitpunkte mit Temperaturwerten – Millionen Schreibvorgänge pro Tag, gelesen wird je Sensor und Zeitraum.

### Abgrenzung
| Typ | Beispiel | geeignet für |
|---|---|---|
| Wide-Column-Store | Cassandra | Schreiblast, Zeitreihen |
| Column Store (analytisch) | Parquet, DWH-Systeme | Aggregation über wenige Spalten |
| Dokumentenorientiert | MongoDB | flexible Dokumente |
| Key-Value | Redis | Cache, Sitzungen |

### Prüfungsfalle
Wide-Column-Store und spaltenorientierte Speicherung im Data Warehouse gleichsetzen – Cassandra legt nicht jede Spalte am Stück ab, sondern gruppiert Zeilen in Spaltenfamilien.

### Merksatz
Wide Column: breite, flexible Zeilen für riesige Schreiblasten.

Siehe auch: NoSQL · Spaltenorientierte Speicherung · Horizontale Skalierung · BASE
Mehr: Deep Dive 15, 4.1

## Widerrufsrecht
<!-- id: widerrufsrecht · quellen: Karte DD14, DD14 2.6 · stand: 2026-10 -->

Recht eines **Verbrauchers**, einen Fernabsatzvertrag oder einen außerhalb von Geschäftsräumen geschlossenen Vertrag innerhalb von **14 Tagen** ohne Angabe von Gründen zu widerrufen (§§ 312g, 355 BGB).

### Erklärung
Die Frist beginnt bei Waren mit dem **Erhalt** der Ware, bei Dienstleistungen mit Vertragsschluss – jeweils nur nach ordnungsgemäßer Widerrufsbelehrung. Fehlt die Belehrung, erlischt das Recht erst nach 12 Monaten und 14 Tagen. Der Widerruf ist eine Erklärung (eine kommentarlose Rücksendung genügt nicht). Seit dem **19. Juni 2026** müssen Onlineshops eine elektronische **Widerrufsfunktion** („Widerrufsbutton“, § 356a BGB) anbieten (Stand 2026). Ausnahmen gibt es u. a. für individuell angefertigte Waren und versiegelte Software nach Entsiegelung.

### Beispiel
Eine Kundin bestellt im Onlineshop des Möbelhauses einen Bürostuhl, Lieferung am 05.10.2026. Sie kann bis einschließlich 19.10.2026 widerrufen.

### Abgrenzung
Gewährleistung: gesetzliche Mängelhaftung, 2 Jahre, nur bei Mangel. Widerrufsrecht: ohne Mangel, 14 Tage, nur Verbraucher im Fernabsatz. Ein Kauf im Ladengeschäft hat kein gesetzliches Widerrufsrecht – ein „Umtausch“ ist dort Kulanz.

### Prüfungsfalle
Auch Unternehmen (B2B) ein Widerrufsrecht zuzusprechen – es gilt nur für Verbraucher.

### Merksatz
Online gekauft, privat gekauft: 14 Tage ab Erhalt zurück ohne Grund.

Siehe auch: Gewährleistung · Kaufvertrag · AGB
Mehr: Deep Dive 14, 2.6

## Widerspruch / Zustimmungsverweigerung
<!-- id: widerspruch-zustimmungsverweigerung · quellen: DD13 4.2 · stand: 2026-10 -->

Beteiligungsrecht des Betriebsrats, mit dem er einer personellen Maßnahme die Zustimmung verweigern oder einer Kündigung widersprechen kann – die Maßnahme wird dadurch blockiert oder erschwert.

### Erklärung
Bei **Einstellung, Versetzung, Ein- und Umgruppierung** in Unternehmen mit mehr als 20 wahlberechtigten Arbeitnehmern braucht der Arbeitgeber die Zustimmung (§ 99 BetrVG). Der Betriebsrat kann sie nur aus den im Gesetz genannten Gründen innerhalb **einer Woche** schriftlich verweigern; der Arbeitgeber kann dann beim Arbeitsgericht die **Ersetzung** der Zustimmung beantragen. Einer ordentlichen Kündigung kann der Betriebsrat binnen einer Woche widersprechen (§ 102 Abs. 3); die Kündigung bleibt möglich, der Arbeitnehmer hat aber einen Weiterbeschäftigungsanspruch bis zum Ende des Prozesses.

### Beispiel
Das Möbelhaus will eine externe Bewerberin einstellen, obwohl die Stelle nicht wie vereinbart intern ausgeschrieben wurde. Der Betriebsrat verweigert binnen einer Woche schriftlich die Zustimmung (§ 99 Abs. 2 Nr. 5).

### Abgrenzung
| Stufe | Wirkung |
|---|---|
| Anhörung | BR muss gehört werden, sonst Kündigung unwirksam |
| Widerspruch / Zustimmungsverweigerung | Maßnahme blockiert, Arbeitsgericht entscheidet |
| Mitbestimmung (§ 87) | ohne Zustimmung keine Maßnahme, Einigungsstelle entscheidet |

### Prüfungsfalle
„Der Betriebsrat muss jeder Kündigung zustimmen“ ist falsch – er muss angehört werden und kann widersprechen.

### Merksatz
Bei Personalmaßnahmen kann der Betriebsrat bremsen, aber das Gericht hat das letzte Wort.

Siehe auch: Anhörung · Mitbestimmung · Einigungsstelle · Betriebsrat
Mehr: Deep Dive 13, 4.2

## Widerspruchsverfahren
<!-- id: widerspruchsverfahren · quellen: Karte DD20, DD20 3.2, DD32 Teil 3 · stand: 2026-11 -->

Verwaltungsrechtliches Vorverfahren: Die Behörde prüft ihren Bescheid auf den Widerspruch des Betroffenen noch einmal, bevor dieser vor dem Sozial- oder Verwaltungsgericht klagen kann.

Auch: Vorverfahren

### Erklärung
1. Die Behörde (z. B. Berufsgenossenschaft, Krankenkasse, Rentenversicherung) erlässt einen **Bescheid** mit Rechtsbehelfsbelehrung.
2. Der Betroffene legt innerhalb **eines Monats** nach Bekanntgabe **Widerspruch** ein (schriftlich oder zur Niederschrift, bei der Behörde, die den Bescheid erlassen hat).
3. Die Behörde prüft Recht- und Zweckmäßigkeit: Sie **hilft ab** oder erlässt einen **Widerspruchsbescheid**.
4. Gegen den Widerspruchsbescheid kann der Betroffene innerhalb **eines Monats** nach Zustellung **Klage** erheben.

Fehlt die Rechtsbehelfsbelehrung oder ist sie fehlerhaft, verlängert sich die Frist auf **ein Jahr**. Im Sozialrecht ist das Vorverfahren grundsätzlich Voraussetzung der Klage und kostenfrei; im allgemeinen Verwaltungsrecht richtet es sich nach Landesrecht und ist in einigen Ländern abgeschafft oder eingeschränkt.

### Beispiel
Die Berufsgenossenschaft lehnt es ab, einen Sturz der Mitarbeiterin Dietrich als Wegeunfall anzuerkennen. Frau Dietrich legt innerhalb eines Monats Widerspruch ein. Weist die BG ihn zurück, kann sie binnen eines Monats beim **Sozialgericht** klagen, nicht beim Arbeitsgericht.

### Abgrenzung
Das Wort „Widerspruch“ kommt in anderen Zusammenhängen vor: Widerspruch des **Betriebsrats** (Beteiligungsrecht), **Widerspruch** nach DSGVO (Betroffenenrecht) und Widerspruch gegen den **Mahnbescheid** (zwei Wochen). Gegen eine **Kündigung** gibt es kein Widerspruchsverfahren, sondern die Kündigungsschutzklage binnen drei Wochen.

### Prüfungsfalle
Sofort klagen, ohne vorher Widerspruch eingelegt zu haben, oder die Frist von einem Monat mit den drei Wochen der Kündigungsschutzklage verwechseln. Bei Streit mit einem Sozialversicherungsträger ist das **Sozialgericht** zuständig.

### Merksatz
Erst Widerspruch binnen eines Monats, dann Klage binnen eines Monats.

Siehe auch: Gerichtszuständigkeit · Berufsgenossenschaft · Unfallversicherung · Kündigungsschutzklage · Widerspruch / Zustimmungsverweigerung · Betroffenenrechte
Mehr: Deep Dive 20, 3.2

## Wiederherstellungszeit
<!-- id: wiederherstellungszeit · quellen: Karte DD16, DD16 4.4 · stand: 2026-10 -->

Im SLA vereinbarte maximale Zeit von der Störungsmeldung, bis der Dienst wieder nutzbar ist.

### Erklärung
Die Wiederherstellungszeit wird meist je **Priorität** der Störung gestaffelt und nur innerhalb der vereinbarten Servicezeit gezählt. Sie ist eine Zusage über die maximale Dauer im Einzelfall. Die MTTR (Mean Time To Repair) ist dagegen ein Mittelwert aus Betriebsdaten. Kürzere Wiederherstellungszeiten erhöhen die Verfügbarkeit, verlangen aber Bereitschaftsdienst, Ersatzteile vor Ort oder Redundanz.

### Beispiel
SLA des Möbelhauses mit dem Rechenzentrum: Priorität 1 (Reporting komplett ausgefallen) – Reaktionszeit 30 Minuten, Wiederherstellungszeit 4 Stunden. Meldung 09:00 Uhr, Dienst wieder verfügbar 14:30 Uhr → 5,5 h, die Zusage ist verletzt.

### Abgrenzung
| Begriff | Zeitraum |
|---|---|
| Reaktionszeit | Meldung → Beginn der Bearbeitung |
| Wiederherstellungszeit | Meldung → Dienst wieder nutzbar |
| MTTR | mittlere Reparaturdauer über viele Ausfälle |
| RTO | maximal tolerierbare Ausfallzeit im Notfallmanagement |

### Prüfungsfalle
Reaktionszeit und Wiederherstellungszeit verwechseln – dass jemand nach 30 Minuten „dran ist“, heißt nicht, dass das System wieder läuft.

### Merksatz
Reagieren heißt anfangen, wiederherstellen heißt fertig sein.

Siehe auch: SLA · Reaktionszeit · MTTR · RTO
Mehr: Deep Dive 16, 4.4

## Wiederholung
<!-- id: wiederholung · quellen: Karte DD11, DD11 B1 · stand: 2026-10 -->

Kontrollstruktur (Schleife, Iteration), die Anweisungen wiederholt ausführt – kopfgesteuert, fußgesteuert oder als Zählschleife.

### Erklärung
Neben Sequenz und Verzweigung ist die Wiederholung eine der drei Grundstrukturen jedes Algorithmus. Die **kopfgesteuerte** Schleife (SOLANGE) prüft die Bedingung vor dem Durchlauf und kann nullmal laufen. Die **fußgesteuerte** Schleife (WIEDERHOLE … BIS) prüft danach und läuft mindestens einmal. Die **Zählschleife** (FÜR i VON 1 BIS n) läuft eine vorher bekannte Anzahl von Durchläufen.

### Beispiel
```
summe ← 0
FÜR i VON 1 BIS n
    summe ← summe + umsatz[i]
ENDE FÜR
```
Bei den Umsätzen 120, 138 und 126 ergibt sich summe = 384.

### Abgrenzung
| Schleife | Prüfung | Mindestdurchläufe |
|---|---|---|
| kopfgesteuert | vorher | 0 |
| fußgesteuert | nachher | 1 |
| Zählschleife | Zähler | bekannte Anzahl |

### Prüfungsfalle
Eine Endlosschleife entsteht, wenn sich die Abbruchbedingung im Schleifenrumpf nie ändert; ebenso häufig: Initialisierung innerhalb statt vor der Schleife.

### Merksatz
Kopf prüft vorher, Fuß prüft nachher.

Siehe auch: Kopfgesteuerte Schleife · Fußgesteuerte Schleife · Verzweigung · Sequenz
Mehr: Deep Dive 11, B1

## WIP-Limit
<!-- id: wip-limit · quellen: Karte DD12, DD12 Teil 2, DD17 5.4 · stand: 2026-10 -->

Obergrenze im Kanban für die Zahl der Aufgaben, die gleichzeitig in einer Spalte (Work in Progress) bearbeitet werden dürfen.

### Erklärung
Ist eine Spalte voll, darf keine neue Karte nachgezogen werden – das Team hilft zuerst, begonnene Arbeit abzuschließen (**Pull-Prinzip**: „Stop starting, start finishing“). So staut sich die Arbeit sichtbar vor dem Engpass, statt in vielen halbfertigen Aufgaben zu versickern. Nach dem Gesetz von Little sinkt bei gleichem Durchsatz mit weniger paralleler Arbeit die **Durchlaufzeit**.

### Beispiel
Das BI-Team des Möbelhauses hat für „Test“ ein WIP-Limit von 2. Drei Berichte warten fertig entwickelt auf den Test – die Entwickler helfen beim Testen, statt einen vierten Bericht zu beginnen. Der Engpass Test wird sichtbar.

### Abgrenzung
Scrum begrenzt die Arbeit über den Sprint (Timebox und Sprint Backlog), Kanban über WIP-Limits je Spalte – ohne Sprints und feste Rollen.

### Prüfungsfalle
WIP-Limits als Leistungsbremse deuten – sie erhöhen den Fluss, weil weniger parallel begonnen und mehr fertiggestellt wird.

### Merksatz
Weniger gleichzeitig anfangen, schneller fertig werden.

Siehe auch: Kanban · Kanban-Board · Durchlaufzeit · Scrum
Mehr: Deep Dive 12, Teil 2 · Deep Dive 17, 5.4

## Wireframe
<!-- id: wireframe · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Grobe, meist schwarz-weiße Skizze der Anordnung eines Bildschirms, in der Kästen und Platzhalter statt echter Inhalte stehen.

### Erklärung
Ein Wireframe klärt früh Struktur, Navigation und Informationshierarchie: Was steht wo, was ist am wichtigsten? Farben, Schriften und echte Daten fehlen bewusst, damit die Diskussion beim Aufbau bleibt. Er ist schnell auf Papier oder im Tool erstellt und billig zu ändern – ideal für die Abstimmung mit dem Fachbereich vor jeder Zeile SQL.

### Beispiel
Für das Reparatur-Dashboard skizziert die Analystin oben links vier Kennzahlkästen, darunter einen Platzhalter „Liniendiagramm Durchlaufzeit“ und rechts eine Filterleiste. Der Fachbereich merkt sofort, dass der Filter nach Filiale fehlt.

### Abgrenzung
| Stufe | Gestaltung | Interaktion |
|---|---|---|
| Wireframe | grob, Kästen | keine |
| Mock-up | realistisch, statisch | keine |
| Prototyp | realistisch | klickbar |

### Prüfungsfalle
Wireframe und Mock-up gleichsetzen – das Mock-up zeigt bereits das echte Aussehen.

### Merksatz
Wireframe = Drahtgerüst: Struktur ja, Aussehen nein.

Siehe auch: Mock-up · Prototyp · Dashboard · Usability-Test
Mehr: Deep Dive 11, A5

## Wirtschaftliche Bewertung
<!-- id: wirtschaftliche-bewertung · quellen: DD7 4.1, DD7 4.2 · stand: 2026-10 -->

Teil der Modellbewertung, der die Fehler eines Klassifikationsmodells in Kosten übersetzt: Was kostet ein falsch-negativer (FN), was ein falsch-positiver (FP) Fall?

### Erklärung
Prozentkennzahlen wie Accuracy sagen nichts über den Nutzen. Erst die Fehlerkosten zeigen, ob ein Modell besser ist als die Baseline:
$\text{Fehlerkosten} = FN \cdot K_{FN} + FP \cdot K_{FP}$
Daraus folgt auch die kostenoptimale Entscheidungsschwelle $p > \frac{K_{FP}}{K_{FP} + K_{FN}}$ – die übliche Schwelle 50 % passt nur bei gleich teuren Fehlern.

### Beispiel
Ein übersehener Reklamationsfall kostet 120 €, eine unnötige Prüfung 15 €. Modell: 40 FN, 90 FP → $40 \cdot 120 + 90 \cdot 15 = 4.800 + 1.350 = 6.150$ €. Triviales Modell „nie Reklamation“: $100 \cdot 120 = 12.000$ €. Schwelle: $\frac{15}{135} \approx 11{,}11\ \%$.

### Abgrenzung
Wirtschaftlichkeitsbetrachtung (Projekt): Aufwand einer Maßnahme gegen ihren Nutzen, z. B. Amortisationszeit. Wirtschaftliche Bewertung (Modell): Kosten der Fehlentscheidungen eines Modells.

### Prüfungsfalle
Das Modell mit der höchsten Accuracy für das beste zu halten – bei teuren FN kann ein Modell mit niedrigerer Accuracy deutlich günstiger sein.

### Merksatz
Nicht die Prozente zählen, sondern was die Fehler kosten.

Siehe auch: Konfusionsmatrix · Accuracy · Baseline · Recall
Mehr: Deep Dive 7, 4.1 · Deep Dive 7, 4.2

## Wirtschaftlichkeitsbetrachtung
<!-- id: wirtschaftlichkeitsbetrachtung · quellen: DD5 1.2, DD5 3.3 · stand: 2026-10 -->

Schritt der Prozessanalyse, in dem der Aufwand einer geplanten Verbesserung ihrem Nutzen gegenübergestellt wird, meist über die Amortisationszeit.

### Erklärung
Sie folgt auf die Soll-Konzeption und entscheidet, ob die Umsetzung sich lohnt. Rechenschema: Zeitersparnis je Fall × Fälle pro Jahr = eingesparte Stunden; × Kostensatz = jährliche Einsparung; Investition / jährliche Einsparung = Amortisationszeit. Danach mit der geplanten Nutzungsdauer vergleichen und **qualitative Faktoren** ergänzen (Fehlerreduktion, Zufriedenheit, Skalierbarkeit, Anbieterabhängigkeit).

### Beispiel
Eine Werkstatt-App spart 15 min je Reparaturauftrag, 4.000 Aufträge pro Jahr → 1.000 h. Bei 45 €/h sind das 45.000 € Einsparung pro Jahr. Investition 60.000 €:
$\text{Amortisationszeit} = \frac{60.000}{45.000} \approx 1{,}33\ \text{Jahre}$ – bei 5 Jahren Nutzungsdauer lohnend.

### Abgrenzung
Die statischen Verfahren (Kostenvergleich, Amortisation) reichen für Prüfungsaufgaben meist aus; der Kapitalwert berücksichtigt zusätzlich den Zeitwert des Geldes.

### Prüfungsfalle
Nur rechnen und die qualitative Beurteilung vergessen – sie ist regelmäßig eigenständig bepunktet.

### Merksatz
Erst rechnen, dann beurteilen – Zahl plus Begründung.

Siehe auch: Amortisationszeit · Kapitalwert · Schwachstellenanalyse
Mehr: Deep Dive 5, 1.2 · Deep Dive 5, 3.3

## Wirtschaftskreislauf
<!-- id: wirtschaftskreislauf · quellen: Karte DD14, DD14 4.1 · stand: 2026-10 -->

Modell der Güter- und Geldströme zwischen den Sektoren einer Volkswirtschaft: Haushalte, Unternehmen, Staat, Banken und Ausland.

### Erklärung
Im **einfachen** Kreislauf gibt es nur Haushalte und Unternehmen: Haushalte liefern Arbeit (Güterstrom) und erhalten Einkommen (Geldstrom); Unternehmen liefern Konsumgüter und erhalten Konsumausgaben. Güter- und Geldströme laufen stets **entgegengesetzt**. Der **erweiterte** Kreislauf ergänzt den Staat (Steuern, Transfers, Subventionen), die Banken (Sparen und Kredite, also Investitionen) und das Ausland (Exporte, Importe).

### Beispiel
Ein Beschäftigter des Möbelhauses erhält Lohn (Geldstrom Unternehmen → Haushalt), zahlt davon Lohnsteuer (Haushalt → Staat), spart einen Teil bei der Bank (Haushalt → Banken) und kauft ein Sofa im Möbelhaus (Konsumausgabe Haushalt → Unternehmen, Güterstrom umgekehrt).

### Abgrenzung
Das Bruttoinlandsprodukt misst den Wert der in einem Zeitraum im Inland erzeugten Güter – eine Größe, die man aus den Strömen des Kreislaufs ableitet. Der Kreislauf selbst ist ein Erklärungsmodell, keine Kennzahl.

### Prüfungsfalle
Güter- und Geldstrom in dieselbe Richtung einzeichnen – zu jedem Güterstrom gehört ein Geldstrom in Gegenrichtung.

### Merksatz
Ware hin, Geld zurück – zwischen allen fünf Sektoren.

Siehe auch: Bruttoinlandsprodukt · Bedürfnis · Geldpolitik
Mehr: Deep Dive 14, 4.1

## Wirtschaftssektoren
<!-- id: wirtschaftssektoren · quellen: Karte DD20, DD20 6.3, DD26 Teil 4 · stand: 2026-11 -->

Einteilung der Wirtschaft nach der Art der Tätigkeit in den primären Sektor (Urproduktion), den sekundären Sektor (Verarbeitung) und den tertiären Sektor (Dienstleistungen).

Auch: Drei-Sektoren-Modell, Primärer Sektor, Sekundärer Sektor, Tertiärer Sektor

### Erklärung
| Sektor | Tätigkeit | Beispiele |
|---|---|---|
| primär | Gewinnung von Rohstoffen und Naturprodukten (Urproduktion) | Land- und Forstwirtschaft, Fischerei, Bergbau |
| sekundär | Be- und Verarbeitung von Rohstoffen zu Gütern | Industrie, produzierendes Handwerk, Bau |
| tertiär | Dienstleistungen ohne eigene Gütererzeugung | Handel, Logistik, IT, Banken, Gesundheit |

Der Bergbau wird in der Lehre meist zum primären Sektor gezählt (Rohstoffgewinnung); die amtliche Statistik rechnet ihn zum produzierenden Gewerbe. In Industrieländern verschiebt sich die Beschäftigung im Strukturwandel vom primären über den sekundären zum tertiären Sektor. Zusätzlich unterscheidet man Betriebe nach dem Ziel: **erwerbswirtschaftlich** (Gewinnerzielung) und **gemeinwirtschaftlich** (Bedarfsdeckung, z. B. Stadtwerke).

### Beispiel
Eine Region hat 20.000 Erwerbstätige: 600 im primären, 5.400 im sekundären und 14.000 im tertiären Sektor.
- primär: $\frac{600}{20.000} \cdot 100$ = **3,00 %**
- sekundär: $\frac{5.400}{20.000} \cdot 100$ = **27,00 %**
- tertiär: $\frac{14.000}{20.000} \cdot 100$ = **70,00 %**

Zuordnung in der Lieferkette der Möbelhaus Nordholz GmbH: Der Forstbetrieb, der das Holz schlägt, ist primär; die Möbelfabrik und die Tischlerei sind sekundär; das Möbelhaus (Handel) und die Spedition sind tertiär.

### Abgrenzung
Die Sektoren des **Wirtschaftskreislaufs** (Haushalte, Unternehmen, Staat, Banken, Ausland) sind etwas anderes: Sie ordnen Wirtschaftsakteure, nicht Tätigkeitsarten.

### Prüfungsfalle
Handel und Logistik dem sekundären Sektor zuordnen, weil sie mit Waren zu tun haben – wer nichts herstellt, sondern Leistungen erbringt (auch den Warenhandel), gehört zum tertiären Sektor.

### Merksatz
Primär holt, sekundär macht, tertiär leistet.

Siehe auch: Arbeitsteilung · Wirtschaftskreislauf · Konjunkturphasen
Mehr: Deep Dive 20, 6.3 · Deep Dive 26, Teil 4

## Wohlgeformt
<!-- id: wohlgeformt · quellen: Karte DD15, DD15 2.3 · stand: 2026-10 -->

Ein XML-Dokument ist wohlgeformt, wenn es die Syntaxregeln von XML einhält – unabhängig von einem Schema.

### Erklärung
Regeln: genau **ein Wurzelelement**, jedes Start-Tag hat ein End-Tag (oder ist leer `<x/>`), Elemente sind **korrekt verschachtelt**, Attributwerte stehen in Anführungszeichen, Groß- und Kleinschreibung der Tags stimmt überein, Sonderzeichen sind maskiert (`&lt;`, `&amp;`). Ein nicht wohlgeformtes Dokument kann kein XML-Parser lesen.

### Beispiel
```xml
<kunde id="1"><name>Huber & Söhne</name><ort>München</kunde></ort>
```
Zwei Fehler: `&` ist nicht maskiert (`&amp;`), und `ort` und `kunde` sind falsch verschachtelt.

### Abgrenzung
**Valide** heißt zusätzlich: Das Dokument entspricht einem Schema (XSD oder DTD). Jedes valide Dokument ist wohlgeformt, aber nicht jedes wohlgeformte valide.

### Prüfungsfalle
„Wohlgeformt“ und „valide“ gleichsetzen – Wohlgeformtheit prüft nur die Syntax, nicht die Struktur oder Datentypen.

### Merksatz
Wohlgeformt ist die Grammatik, valide der Bauplan.

Siehe auch: XML · Valide · XSD · DTD
Mehr: Deep Dive 15, 2.3

## WSDL
<!-- id: wsdl · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

Web Services Description Language – XML-Format, das einen SOAP-Webservice maschinenlesbar beschreibt: Operationen, Nachrichten, Datentypen und Adresse.

### Erklärung
Die WSDL ist der „Vertrag“ zwischen Anbieter und Nutzer eines SOAP-Dienstes. Datentypen werden über XML Schema (XSD) festgelegt. Aus einer WSDL können Werkzeuge automatisch Client-Code erzeugen. SOAP-Dienste mit WSDL sind streng typisiert und verbreitet in Banken, Behörden und ERP-Systemen.

### Beispiel
Das ERP eines Lieferanten bietet die SOAP-Operation `getLieferstatus(bestellnummer)` an. Die WSDL beschreibt Eingabe- und Antwortnachricht sowie die Endpunkt-URL; das Möbelhaus generiert daraus den Aufruf.

### Abgrenzung
| Stil | Schnittstellenbeschreibung |
|---|---|
| SOAP | WSDL (XML) |
| REST | OpenAPI (YAML oder JSON) |
| GraphQL | Schema mit Typsystem |

### Prüfungsfalle
OpenAPI und WSDL vertauschen – WSDL gehört zu SOAP, OpenAPI zu REST.

### Merksatz
SOAP spricht WSDL, REST spricht OpenAPI.

Siehe auch: SOAP · OpenAPI · XML · XSD
Mehr: Deep Dive 15, 3.2

## Ausgelassen
- Wenige Kennzahlen – Gestaltungsregel Dashboard
- Wiederholen – Schritt k-Means
