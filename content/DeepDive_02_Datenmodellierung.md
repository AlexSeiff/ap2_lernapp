# Deep Dive 2: Datenmodellierung & Normalisierung
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Datenmodellierung ist neben SQL der zweite Dauerbrenner in **„Sicherstellen der Datenqualität"**: ER-Diagramme lesen und erstellen, Kardinalitäten bestimmen, Tabellen normalisieren. Die Normalisierungsaufgabe („Überführen Sie die Tabelle schrittweise in die 3. Normalform") gehört zu den zuverlässigsten Punktelieferanten überhaupt – sie folgt immer demselben Schema und ist mit Übung nahezu fehlerfrei lösbar. Im **Fachgespräch** wirst du dein Projektdatenmodell erklären und verteidigen müssen.

Der rote Faden dieses Deep Dives: Am Ende weißt du, **wie die Möbelhaus-Nordholz-Datenbank aus Deep Dive 1 überhaupt entstanden ist.**

---

# Teil 1 – Das Entity-Relationship-Modell (ERM)

## 1.1 Die drei Ebenen der Datenmodellierung

1. **Konzeptionell** – ER-Modell: fachliche Sicht, unabhängig von Technik („Was gibt es, wie hängt es zusammen?").
2. **Logisch** – Relationenmodell: Tabellen, Primär- und Fremdschlüssel.
3. **Physisch** – SQL/DDL: konkrete Umsetzung mit Datentypen, Indizes (→ Deep Dive 1, CREATE TABLE).

In der Prüfung bewegst du dich meist zwischen Ebene 1 und 2: ERM erstellen bzw. in Tabellen überführen.

## 1.2 Bausteine des ERM

- **Entität(styp)**: Objekt der realen Welt, über das Daten gespeichert werden (KUNDE, PRODUKT) – im Diagramm ein Rechteck.
- **Attribut**: Eigenschaft einer Entität (name, preis); der **Schlüssel** identifiziert jede Ausprägung eindeutig.
- **Beziehung**: Verbindung zwischen Entitäten (Kunde *erteilt* Bestellung) – klassisch als Raute. Beziehungen können **eigene Attribute** tragen (z. B. *menge* an der Beziehung „enthält").

Schlüsselbegriffe, die in Begründungsaufgaben fallen:
- **Schlüsselkandidat**: minimale Attributkombination, die jede Zeile eindeutig identifiziert (kein Attribut kann weggelassen werden). Einer wird **Primärschlüssel**, die übrigen bleiben **Alternativschlüssel** (in SQL per UNIQUE abgesichert).
- **Zusammengesetzter Schlüssel**: Primärschlüssel aus mehreren Attributen, z. B. (bestell_id, produkt_id).
- **Natürlicher Schlüssel** (fachlich vorhanden, z. B. ISBN, Kfz-Kennzeichen) vs. **Surrogatschlüssel** (künstlich, z. B. fortlaufende kunden_id): Der Surrogatschlüssel ist stabil, kurz und ohne Fachbedeutung – Namen, E-Mail-Adressen oder Kennzeichen können sich ändern oder doppelt vorkommen.
- **Fremdschlüssel**: Attribut, das auf den Primärschlüssel einer anderen (oder derselben) Tabelle verweist.

## 1.3 Kardinalitäten – die drei Notationen

**Chen-Notation:** 1:1, 1:n, m:n – beschreibt das Verhältnis der Entitätsmengen zueinander. Sie zeigt nur die **Maximalwerte**; ob eine Teilnahme Pflicht oder optional ist (Minimum 0 oder 1), lässt sich damit nicht ausdrücken.

**Min-Max-Notation:** an jeder Entität steht (min, max) – *wie oft nimmt DIESE eine Ausprägung an der Beziehung teil?*

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 730 130" width="730" height="130" role="img" aria-label="ER-Diagramm in Min-Max-Notation: KUNDE (0,n) erteilt (1,1) BESTELLUNG (1,n) enthält (0,n) PRODUKT, Beziehungsattribut menge an enthält">
<rect x="10" y="20" width="110" height="40" class="dg-form"/>
<text x="65" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-fett">KUNDE</text>
<line x1="120" y1="40" x2="155" y2="40" class="dg-linie"/>
<polygon points="210,15 265,40 210,65 155,40" class="dg-form"/>
<text x="210" y="40" text-anchor="middle" dominant-baseline="middle">erteilt</text>
<line x1="265" y1="40" x2="300" y2="40" class="dg-linie"/>
<rect x="300" y="20" width="130" height="40" class="dg-form"/>
<text x="365" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-fett">BESTELLUNG</text>
<line x1="430" y1="40" x2="465" y2="40" class="dg-linie"/>
<polygon points="520,15 575,40 520,65 465,40" class="dg-form"/>
<text x="520" y="40" text-anchor="middle" dominant-baseline="middle">enthält</text>
<line x1="575" y1="40" x2="610" y2="40" class="dg-linie"/>
<rect x="610" y="20" width="110" height="40" class="dg-form"/>
<text x="665" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-fett">PRODUKT</text>
<line x1="520" y1="65" x2="520" y2="87" class="dg-linie"/>
<ellipse cx="520" cy="105" rx="42" ry="18" class="dg-form"/>
<text x="520" y="105" text-anchor="middle" dominant-baseline="middle" class="dg-klein">menge</text>
<text x="126" y="28" text-anchor="start" dominant-baseline="middle" class="dg-klein">(0,n)</text>
<text x="294" y="28" text-anchor="end" dominant-baseline="middle" class="dg-klein">(1,1)</text>
<text x="436" y="28" text-anchor="start" dominant-baseline="middle" class="dg-klein">(1,n)</text>
<text x="604" y="28" text-anchor="end" dominant-baseline="middle" class="dg-klein">(0,n)</text>
</svg>
```

Gelesen: Ein Kunde erteilt 0 bis n Bestellungen (Neukunde ohne Bestellung möglich). Eine Bestellung gehört zu genau einem Kunden. Eine Bestellung enthält 1 bis n Produkte; ein Produkt kommt in 0 bis n Bestellungen vor.

⚠️ **Die klassische Prüfungsfalle:** In Chen steht das „n" auf der *anderen* Seite als in Min-Max! Chen: „KUNDE 1 —— n BESTELLUNG" (ein Kunde hat n Bestellungen, das n klebt an BESTELLUNG). Min-Max: das (0,n) steht bei KUNDE, weil es die Teilnahme *des Kunden* beschreibt. Wer das verwechselt, dreht alle Kardinalitäten um – und verliert die halbe Aufgabe.

**Krähenfußnotation (Martin):** Linienenden codieren die Kardinalität – Krähenfuß = „viele", Querstrich = „genau 1", Kreis = „0/optional". Wird in Prüfungen ebenfalls verwendet (auch als IE-Notation, z. B. in MySQL Workbench); die Leserichtung entspricht der **Chen-Logik, nicht Min-Max**: Das Symbol am Linienende bei BESTELLUNG sagt, wie viele Bestellungen *ein* Kunde haben kann. Je Linienende stehen zwei Zeichen – das Zeichen direkt an der Entität ist das Maximum, das weiter außen das Minimum.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 80" width="660" height="80" role="img" aria-label="Krähenfuß-Notation: KUNDE mit Doppelstrich (genau eins), BESTELLUNG mit Kreis und Krähenfuß (null bis viele)">
<rect x="40" y="12" width="130" height="44" class="dg-form"/>
<text x="105" y="34" text-anchor="middle" dominant-baseline="middle" class="dg-fett">KUNDE</text>
<rect x="470" y="12" width="150" height="44" class="dg-form"/>
<text x="545" y="34" text-anchor="middle" dominant-baseline="middle" class="dg-fett">BESTELLUNG</text>
<line x1="170" y1="34" x2="470" y2="34" class="dg-linie"/>
<line x1="178" y1="24" x2="178" y2="44" class="dg-linie"/>
<line x1="194" y1="24" x2="194" y2="44" class="dg-linie"/>
<line x1="454" y1="34" x2="470" y2="23" class="dg-linie"/>
<line x1="454" y1="34" x2="470" y2="34" class="dg-linie"/>
<line x1="454" y1="34" x2="470" y2="45" class="dg-linie"/>
<circle cx="444" cy="34" r="6" class="dg-form"/>
<text x="320" y="22" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-kursiv">erteilt</text>
<text x="186" y="64" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">|| genau eins</text>
<text x="462" y="64" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">o&lt; null bis viele</text>
</svg>
```

Gelesen: Ein Kunde hat null bis viele Bestellungen (o< bei BESTELLUNG); eine Bestellung gehört zu genau einem Kunden (|| bei KUNDE). Gegenüber Min-Max stehen die Angaben also auf der jeweils anderen Seite – dieselbe Falle wie bei Chen.

**MC-Notation** (modifizierte Chen-Notation, in Berufsschul- und Prüfungsaufgaben verbreitet): 1 = genau eins, c = null oder eins, m bzw. n = eins oder mehrere, mc bzw. nc = null oder mehrere. Leserichtung wie Chen: KUNDE 1 ── mc BESTELLUNG. Auch **UML-Klassendiagramme** notieren Multiplizitäten (0..1, 1..*, 0..*) in dieser Chen-Leserichtung.

> ❓ **Prüferfrage:** Was sagt die 0 in „KUNDE (0,n) – erteilt – (1,1) BESTELLUNG" fachlich aus?
> *Ein Kunde kann im System existieren, ohne jemals eine Bestellung erteilt zu haben – z. B. ein neu angelegter Interessent. Genau diese Kunden fanden wir in Deep Dive 1 per LEFT JOIN.*

## 1.4 Sonderfall: rekursive Beziehung

Eine Entität steht in Beziehung zu sich selbst: MITARBEITER *führt* MITARBEITER. Kardinalität z. B.: als Vorgesetzter (0,n), als Geführter (0,1) – „jeder hat höchstens einen Vorgesetzten, nicht jeder führt". Umsetzung: Fremdschlüssel `vorgesetzter_id` in derselben Tabelle, **NULL-fähig** (die Geschäftsführung hat keinen Vorgesetzten).

## 1.5 Überführung ins Relationenmodell – die vier Transformationsregeln

1. **Jede Entität** wird eine Tabelle mit Primärschlüssel.
2. **1:n**: Der Primärschlüssel der 1-Seite wandert als Fremdschlüssel auf die n-Seite. (Der Kunde „weiß" nichts von seinen Bestellungen – die Bestellung kennt ihren Kunden.)
3. **m:n**: Es entsteht eine **eigene Beziehungstabelle** mit zusammengesetztem Primärschlüssel aus beiden Fremdschlüsseln; Beziehungsattribute (menge, einkaufspreis) wandern dorthin.
4. **1:1**: Fremdschlüssel auf einer Seite (mit UNIQUE) – oder beide Tabellen zusammenlegen, wenn fachlich sinnvoll. Am besten auf die Seite, die *zwingend* teilnimmt: Bei MITARBEITER (0,1) – nutzt – (1,1) FIRMENWAGEN bekommt firmenwagen den Fremdschlüssel mitarbeiter_id (NOT NULL, UNIQUE) – so entstehen keine NULL-Werte.

**Vom Minimum zur NULL-Fähigkeit:** Die Min-Angabe der n-Seite entscheidet über den Fremdschlüssel. (1,1) bei BESTELLUNG → kunden_id ist **NOT NULL** (jede Bestellung braucht einen Kunden); (0,1) → der Fremdschlüssel darf NULL sein (z. B. vorgesetzter_id).

**Referenzielle Integrität:** Jeder Fremdschlüsselwert muss als Primärschlüssel in der referenzierten Tabelle existieren (oder NULL sein) – keine verwaisten Datensätze. Das DBMS prüft das über FOREIGN KEY; beim Löschen/Ändern des referenzierten Satzes greift die festgelegte Regel: RESTRICT bzw. NO ACTION (verhindern), CASCADE (abhängige Sätze mitlöschen/-ändern), SET NULL (Fremdschlüssel auf NULL setzen) oder SET DEFAULT (→ Deep Dive 1).

**Sonderfall Generalisierung/Spezialisierung** („ist-ein", im ERM als Dreieck oder Raute „is-a"): z. B. KUNDE mit den Spezialisierungen PRIVATKUNDE und GESCHÄFTSKUNDE. Drei Umsetzungsvarianten:
- **Eine Tabelle je Entitätstyp**: kunde(**kunden_id**, name, ort), geschaeftskunde(**kunden_id↑**, ust_id) – der Primärschlüssel der Untertabelle ist zugleich Fremdschlüssel auf die Obertabelle (1:1). Redundanzfrei, aber Joins nötig.
- **Nur Untertabellen**: Die Attribute des Obertyps werden in jede Untertabelle kopiert – nur sinnvoll, wenn jede Ausprägung genau einem Untertyp angehört (total und disjunkt).
- **Eine Gesamttabelle**: alle Attribute in einer Tabelle plus Typ-Spalte (kundentyp) – keine Joins, aber viele NULL-Werte in den typfremden Spalten.

**Schreibweise in der Prüfung** (Konvention am Blattrand angeben!): Primärschlüssel unterstreichen, Fremdschlüssel gestrichelt unterstreichen oder mit ↑ kennzeichnen. In diesem Dokument: **fett** = PK, ↑ = FK.

Beispiel Möbelhaus:
- kunde(**kunden_id**, name, ort, registriert_am)
- bestellung(**bestell_id**, bestelldatum, kunden_id↑)
- produkt(**produkt_id**, bezeichnung, kategorie, preis)
- bestellposition(**bestell_id↑, produkt_id↑**, menge) ← aufgelöste m:n-Beziehung

> ❓ **Prüferfrage:** Warum kann eine m:n-Beziehung nicht einfach über einen Fremdschlüssel abgebildet werden?
> *Ein Fremdschlüsselfeld kann je Zeile nur einen Wert aufnehmen. Bei m:n müssten auf beiden Seiten mehrere Werte gespeichert werden – das verletzt die Atomarität (1. NF) oder erzwingt redundante Zeilen. Die Beziehungstabelle löst das sauber über den zusammengesetzten Schlüssel.*

---

# Teil 2 – Funktionale Abhängigkeiten und Anomalien

## 2.1 Funktionale Abhängigkeit

**A → B**: B ist funktional abhängig von A, wenn zu jedem Wert von A genau ein Wert von B gehört. Beispiel: kunden_id → kundenname (eine ID, genau ein Name).

- **Voll funktional abhängig**: B hängt vom *gesamten* zusammengesetzten Schlüssel ab, nicht schon von einem Teil. (menge hängt von bestell_id **und** produkt_id ab.)
- **Partiell abhängig**: B hängt nur von einem *Teil* des Schlüssels ab → verletzt die 2. NF.
- **Transitiv abhängig**: A → B → C, ein Nichtschlüsselattribut hängt von einem anderen Nichtschlüsselattribut ab (auftrag → kunden_id → kundenname) → verletzt die 3. NF.

## 2.2 Die drei Anomalien (Folgen fehlender Normalisierung)

Ausgangspunkt: eine breite Tabelle, in der Auftrags-, Kunden- und Technikerdaten gemeinsam liegen.

- **Änderungsanomalie**: Ändert sich der Stundensatz eines Technikers, muss er in vielen Zeilen geändert werden – wird eine vergessen, ist der Bestand **inkonsistent** (Datenqualitätsdimension Konsistenz!).
- **Einfügeanomalie**: Ein neuer Techniker ohne Auftrag kann nicht erfasst werden – es fehlt der Schlüsselwert (auftrag_nr).
- **Löschanomalie**: Wird der letzte Auftrag eines Kunden gelöscht, verschwinden ungewollt auch alle Kundendaten.

**Merke den Dreiklang für die Prüfung:** Redundanz → Anomalien → Inkonsistenz. Normalisierung ist damit eine **präventive Datenqualitätsmaßnahme** – genau so solltest du es im Fachgespräch formulieren.

---

# Teil 3 – Normalisierung Schritt für Schritt

**Merksatz (3NF):** Jedes Nichtschlüsselattribut hängt ab *vom Schlüssel* (1. NF), *vom ganzen Schlüssel* (2. NF) *und nur vom Schlüssel* (3. NF).

## Das durchgängige Beispiel: So entstand die Möbelhaus-Datenbank

Aus dem Altsystem kommt dieser Export (Bestellungen als eine Zeile je Bestellung, Produkte in einer Zelle):

**bestellliste (unnormalisiert)**
| bestell_id | bestelldatum | kunden_id | kundenname | kundenort | produktliste |
|---|---|---|---|---|---|
| 100 | 2026-01-15 | 1 | Huber GmbH | München | 10 Bürostuhl Comfort, 249,00, 2 St.; 12 Monitor 27 Zoll, 189,00, 2 St. |
| 101 | 2026-02-03 | 3 | Fischer KG | München | 11 Schreibtisch Basic, 399,00, 1 St.; 14 Schreibtischlampe, 39,90, 3 St. |

### Schritt 1 → 1. Normalform: Alle Attributwerte atomar

Die Zelle *produktliste* enthält Wiederholungsgruppen → auflösen in eine Zeile **je Bestellung und Produkt**. Neuer Primärschlüssel: zusammengesetzt aus (**bestell_id, produkt_id**).

| **bestell_id** | **produkt_id** | bestelldatum | kunden_id | kundenname | kundenort | bezeichnung | preis | menge |
|---|---|---|---|---|---|---|---|---|
| 100 | 10 | 2026-01-15 | 1 | Huber GmbH | München | Bürostuhl Comfort | 249,00 | 2 |
| 100 | 12 | 2026-01-15 | 1 | Huber GmbH | München | Monitor 27 Zoll | 189,00 | 2 |
| 101 | 11 | 2026-02-03 | 3 | Fischer KG | München | Schreibtisch Basic | 399,00 | 1 |
| 101 | 14 | 2026-02-03 | 3 | Fischer KG | München | Schreibtischlampe | 39,90 | 3 |

Atomar ja – aber massiv redundant (Datum, Kunde je Position wiederholt).

### Schritt 2 → 2. Normalform: Keine partiellen Abhängigkeiten

Prüfe jedes Nichtschlüsselattribut gegen den zusammengesetzten Schlüssel:
- bestelldatum, kunden_id, kundenname, kundenort hängen **nur von bestell_id** ab → partiell!
- bezeichnung, preis hängen **nur von produkt_id** ab → partiell!
- menge hängt vom **ganzen** Schlüssel ab → bleibt.

Zerlegen in drei Tabellen:
- bestellung(**bestell_id**, bestelldatum, kunden_id, kundenname, kundenort)
- produkt(**produkt_id**, bezeichnung, preis)
- bestellposition(**bestell_id↑, produkt_id↑**, menge)

*(Hinweis: Hat eine Tabelle einen einteiligen Primärschlüssel, ist sie automatisch in 2. NF – partielle Abhängigkeiten setzen einen zusammengesetzten Schlüssel voraus.)*

### Schritt 3 → 3. Normalform: Keine transitiven Abhängigkeiten

In *bestellung* gilt: bestell_id → kunden_id → kundenname, kundenort. Kundenname/-ort hängen von einem Nichtschlüsselattribut ab → herauslösen:
- kunde(**kunden_id**, kundenname, kundenort)
- bestellung(**bestell_id**, bestelldatum, kunden_id↑)

**Endergebnis = die vier Tabellen aus Deep Dive 1** (dort zusätzlich mit Spalten wie kategorie und registriert_am, die im Altsystem-Export fehlen). Die Datenbank, mit der du SQL geübt hast, ist das Produkt einer sauberen Normalisierung.

> ❓ **Prüferfrage (Transfer, gern im Fachgespräch):** In der Praxis speichert man den Verkaufspreis oft *zusätzlich* in der Bestellposition. Verstößt das nicht gegen die Normalisierung?
> *Nur scheinbar. produkt.preis ist der aktuelle Listenpreis und ändert sich; der Preis zum Bestellzeitpunkt ist ein eigenes Attribut, das von Bestellung und Produkt gemeinsam abhängt – nicht allein von produkt_id. Formal liegt also keine partielle Abhängigkeit vor. Er muss historisch korrekt bleiben, sonst verfälschen spätere Preisänderungen alle Umsatzauswertungen. Diese bewusste Historisierung sichert die Datenqualitätsdimension Korrektheit – wer das erklären kann, zeigt Prüfern echtes Verständnis. Ein echter Verstoß gegen die 2. NF wäre es nur, wenn dort stets der aktuelle Listenpreis mitgepflegt würde.*

**Über die 3. NF hinaus – BCNF:** Die **Boyce-Codd-Normalform** verschärft die 3. NF: Jede Determinante (linke Seite einer funktionalen Abhängigkeit) muss ein Schlüsselkandidat sein. Ein Unterschied zur 3. NF tritt nur bei mehreren, sich überlappenden zusammengesetzten Schlüsselkandidaten auf. Beispiel: betreuung(kunden_id, kategorie, berater_id) – jeder Berater betreut genau eine Kategorie, jeder Kunde hat je Kategorie genau einen Berater. Schlüsselkandidaten: (kunden_id, kategorie) und (kunden_id, berater_id). Die Abhängigkeit berater_id → kategorie verletzt die BCNF (berater_id ist kein Schlüsselkandidat), nicht aber die 3. NF (kategorie ist Teil eines Schlüsselkandidaten). Lösung: berater(**berater_id**, kategorie) und betreuung(**kunden_id↑, berater_id↑**). In der Prüfung wird meist nur bis zur 3. NF verlangt.

## Denormalisierung – die DPA-Perspektive

Im **operativen System (OLTP)** wird bis zur 3. NF normalisiert: Konsistenz und Redundanzfreiheit haben Vorrang. Im **Data Warehouse** wird bewusst denormalisiert (Star-Schema, → Deep Dive 8): wenige Joins, schnelle Lesezugriffe, verständliche Struktur für Analysten. Beides ist richtig – **im jeweiligen Kontext**. Diese Abwägung ist eine typische Beurteilungsaufgabe für DPA-Prüflinge.

---

## Die 7 häufigsten Fehler aus Prüfersicht

1. Kardinalitäten in Min-Max „Chen-herum" notiert (die Falle aus 1.3).
2. m:n-Beziehung nicht über eine Beziehungstabelle aufgelöst.
3. Beziehungstabelle ohne zusammengesetzten Primärschlüssel.
4. Fremdschlüssel auf die 1-Seite statt die n-Seite gesetzt.
5. Bei der 2. NF vergessen, dass sie nur bei zusammengesetzten Schlüsseln „Arbeit macht".
6. In der 3. NF die transitive Kette nicht benannt (Begründung fehlt → Punktabzug trotz richtigem Schema).
7. Normalisierungsschritte ohne Angabe der neuen Primär-/Fremdschlüssel.

---

# Übungsklausur Datenmodellierung (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Bearbeite die Klausur **am Ende des Themas** am Stück, handschriftlich, ohne Unterlagen. Lösungen erst danach öffnen. Halte dich an die geforderte Anzahl der Nennungen.

## Ausgangssituation

Der Reparaturservice der **Möbelhaus Nordholz GmbH** verwaltet seine Aufträge bisher in einer einzigen Exporttabelle (**Anlage 1**). Weil Kundenadressen dort mehrfach und teils widersprüchlich stehen, soll eine normalisierte Datenbank entstehen, die später auch Lieferanten und Mitarbeiter abbildet. Sie übernehmen in der IT-Abteilung die Datenmodellierung.

## Anlage 1 – Export „auftrags_export" (Reparaturservice des Möbelhauses)

| auftrag_nr | datum | kunden_id | kundenname | techniker_id | technikername | stundensatz | leistungen |
|---|---|---|---|---|---|---|---|
| 5001 | 2026-03-02 | 1 | Huber GmbH | T7 | Yilmaz | 68,00 | L1 Stuhlmechanik justieren (0,5 h); L4 Rollenwechsel (0,25 h) |
| 5002 | 2026-03-05 | 3 | Fischer KG | T2 | Petrow | 62,00 | L4 Rollenwechsel (0,25 h) |
| 5003 | 2026-03-09 | 1 | Huber GmbH | T7 | Yilmaz | 68,00 | L2 Tischplatte tauschen (1,0 h) |

## Block A – Abhängigkeiten und Anomalien (22 P)

Der Serviceleiter fragt, warum die Exporttabelle überhaupt Probleme macht.

**A1 (9 P):** *Nennen* Sie die **drei** Anomalien unnormalisierter Datenbestände und *erläutern* Sie jede an einem konkreten Beispiel aus Anlage 1.

**A2 (6 P):** *Definieren* Sie funktionale, partielle und transitive Abhängigkeit und *geben* Sie je ein Beispiel aus Anlage 1 *an*.

**A3 (7 P):** Gegeben: KUNDE (0,n) ── erteilt ── (1,1) AUFTRAG (Min-Max-Notation).
a) *Erläutern* Sie die Aussage beider Kardinalitätsangaben in je einem Satz. (4 P)
b) Was bedeutet die 0 fachlich? (1 P)
c) *Übersetzen* Sie die Beziehung in die Chen-Notation. (2 P)

## Block B – Modellieren (28 P)

Szenario: Das Möbelhaus erweitert sein System. **Lieferanten** (lieferanten_id, firmenname) liefern Produkte: Jedes Produkt wird von mindestens einem Lieferanten bezogen, jeder Lieferant liefert mindestens ein Produkt; je Kombination wird ein **Einkaufspreis** vereinbart. Jeder Reparaturauftrag wird von genau einem **Mitarbeiter** erfasst; Mitarbeiter erfassen beliebig viele Aufträge, neu eingestellte auch noch keinen. Jeder Mitarbeiter hat höchstens einen Vorgesetzten, der selbst Mitarbeiter ist; ein Vorgesetzter führt mehrere Mitarbeiter.

**B1 (13 P):** *Erstellen* Sie das ER-Diagramm (Entitäten LIEFERANT, PRODUKT, MITARBEITER, AUFTRAG) mit allen Beziehungen, dem Beziehungsattribut und Kardinalitäten in Min-Max-Notation.

**B2 (9 P):** *Überführen* Sie Ihr ER-Modell in das Relationenmodell (Relationenschreibweise, Primär- und Fremdschlüssel kennzeichnen).

**B3 (6 P):** *Begründen* Sie, warum die Beziehung „liefert" eine eigene Tabelle benötigt, welchen Primärschlüssel diese erhält und warum der Einkaufspreis genau dort gespeichert wird.

## Block C – Normalisierung (25 P)

Bevor das neue Modell umgesetzt wird, soll die Exporttabelle aus **Anlage 1** sauber normalisiert werden.

**C1 (25 P):** *Überführen* Sie Anlage 1 schrittweise in die 3. Normalform:
a) 1. NF mit Angabe des neuen Primärschlüssels (6 P)
b) 2. NF – *benennen* Sie zunächst alle partiellen Abhängigkeiten, dann das Tabellenschema (9 P)
c) 3. NF – *benennen* Sie die transitiven Abhängigkeiten und *geben* Sie das Endschema mit allen Primär- und Fremdschlüsseln *an* (10 P)

## Block D – Modelle beurteilen (25 P)

Aus dem Team kommen zwei Vorschläge zum Datenmodell, die Sie fachlich prüfen sollen.

Ein Werkstudent hat für den Onlineshop einen ersten Tabellenentwurf geliefert, den Sie prüfen sollen.

**D1 (9 P):** Ein Kollege schlägt vor, den Kundennamen zusätzlich in der Auftragstabelle zu speichern, „damit die Auswertungen schneller laufen". *Beurteilen* Sie den Vorschlag. Gehen Sie auf Vor- und Nachteile ein und *geben* Sie eine differenzierte Empfehlung für das operative System einerseits und das Berichtswesen andererseits.

**D2 (10 P):** Gegeben ist folgender Entwurf: bestellung(**bestell_id**, kunden_id↑, produkt_id, bezeichnung, preis, menge). *Benennen* Sie **zwei** Modellierungsschwächen und *skizzieren* Sie für jede die Verbesserung.

**D3 (6 P):** *Bestimmen* Sie für die drei Situationen jeweils die Kardinalität in Min-Max- **und** Chen-Notation:
a) Jeder Mitarbeiter nutzt höchstens einen Firmenwagen; jeder Firmenwagen ist genau einem Mitarbeiter zugeordnet.
b) Eine Abteilung beschäftigt mindestens einen Mitarbeiter; jeder Mitarbeiter gehört genau einer Abteilung an.
c) Ein Produkt lagert in mehreren Lagern, ein Lager führt viele Produkte; beides kann auch noch keinem zugeordnet sein.

---

## Fachgespräch: typische Fragen des Ausschusses zur Datenmodellierung

1. „Bis zu welcher Normalform haben Sie Ihr Projektdatenmodell normalisiert – und *warum genau bis dahin*?"
2. „Wo haben Sie bewusst Redundanz zugelassen, und wie stellen Sie dort Konsistenz sicher?" (Erwartet z. B.: Preis-Historisierung in Bewegungsdaten.)
3. „Wie haben Sie sich das bestehende Datenmodell der Quellsysteme erschlossen?" (Erwartet: Reverse Engineering, Gespräche mit Fachbereich, Data Profiling.)
4. „Welche Datenqualitätsprobleme entstehen typischerweise durch fehlende Normalisierung – und welche davon haben Sie in Ihren Quelldaten tatsächlich vorgefunden?"
5. „Ihr Data Mart ist denormalisiert – widerspricht das nicht dem, was Sie gerade über die 3. NF gesagt haben?" (Erwartet: OLTP vs. OLAP, Star-Schema, Lese-Workload.)

---

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich kann ER-Diagramme in Chen-, Min-Max- und Krähenfußnotation lesen und die Notationen ineinander übersetzen – inklusive der „Seitenwechsel-Falle".
- [ ] Ich kenne die vier Transformationsregeln ins Relationenmodell und setze Fremdschlüssel immer auf die richtige Seite.
- [ ] Ich kann m:n-Beziehungen mit Beziehungstabelle und zusammengesetztem Primärschlüssel auflösen (inkl. Beziehungsattributen).
- [ ] Ich kann funktionale, partielle und transitive Abhängigkeiten definieren und in einer Tabelle aufspüren.
- [ ] Ich kann die drei Anomalien an einem beliebigen Beispiel erläutern und den Bogen zur Datenqualität schlagen.
- [ ] Ich normalisiere jede breite Tabelle sicher bis zur 3. NF – mit Begründung je Schritt und vollständigen Schlüsselangaben.
- [ ] Ich kann Denormalisierung im DWH-Kontext fachlich begründen.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
- [ ] Ich kann Generalisierung/Spezialisierung in Tabellen überführen und aus den Min-Angaben ableiten, ob ein Fremdschlüssel NULL sein darf.
