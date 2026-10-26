# Musterlösungen Übungsklausur Datenmodellierung (Deep Dive 2)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Teilpunkte großzügig, aber ehrlich vergeben. Bei Modellierungsaufgaben zählt die **Begründung** genauso wie das Schema – ein richtiges Endschema ohne benannte Abhängigkeiten bekommt nie die volle Punktzahl. 92+ P = sehr gut. Alles darunter → Fehlerjournal.

---

## Block A

**A1 (9 P):**
- **Änderungsanomalie:** Steigt der Stundensatz von Techniker Yilmaz, muss er in den Zeilen 5001 *und* 5003 geändert werden. Wird eine Zeile vergessen, enthält der Bestand zwei verschiedene Stundensätze → Inkonsistenz.
- **Einfügeanomalie:** Ein neu eingestellter Techniker (oder eine neue Leistung im Katalog) kann nicht erfasst werden, solange kein Auftrag existiert – der Primärschlüsselwert auftrag_nr fehlt.
- **Löschanomalie:** Wird Auftrag 5002 storniert und gelöscht, verschwinden zugleich alle Informationen über Techniker Petrow und Kunde Fischer KG – sie kommen nur in dieser Zeile vor.

*Prüferkommentar: Je Anomalie 1 P für den Begriff, 2 P für das konkrete Beispiel aus der Anlage. Allgemeine Lehrbuchbeispiele ohne Anlagenbezug: nur 1 P je Beispiel – die Aufgabe verlangte ausdrücklich Anlage 1.*

**A2 (6 P):**
- **Funktionale Abhängigkeit** A → B: Zu jedem Wert von A gehört genau ein Wert von B. Beispiel: kunden_id → kundenname.
- **Partielle Abhängigkeit:** Ein Nichtschlüsselattribut hängt nur von einem *Teil* eines zusammengesetzten Schlüssels ab. Beispiel (nach 1. NF mit Schlüssel auftrag_nr + leistungs_id): datum hängt nur von auftrag_nr ab.
- **Transitive Abhängigkeit:** Nichtschlüsselattribut hängt über ein anderes Nichtschlüsselattribut vom Schlüssel ab. Beispiel: auftrag_nr → techniker_id → technikername/stundensatz.

*Prüferkommentar: Je Begriff 1 P Definition + 1 P Beispiel.*

**A3 (7 P):**
a) (0,n) bei KUNDE: Ein Kunde nimmt null- bis n-mal an der Beziehung teil, erteilt also keinen bis beliebig viele Aufträge. (1,1) bei AUFTRAG: Jeder Auftrag nimmt genau einmal teil, gehört also zu genau einem Kunden. *(je 2 P)*
b) Die 0 bedeutet: Ein Kunde kann existieren, ohne je einen Auftrag erteilt zu haben (z. B. Neukunde/Interessent). *(1 P)*
c) Chen: KUNDE 1 ──erteilt── n AUFTRAG, also **1:n**. *(2 P – wer hier n:1 „mitdreht", ist in die Notationsfalle getappt.)*

---

## Block B

**B1 (13 P):** ER-Diagramm (textuelle Darstellung):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 340" width="660" height="340" role="img" aria-label="ER-Diagramm in Min-Max-Notation: LIEFERANT (1,n) liefert (1,n) PRODUKT mit Attribut einkaufspreis, MITARBEITER (0,n) erfasst (1,1) AUFTRAG und die rekursive Beziehung führt an MITARBEITER (0,n als Vorgesetzter, 0,1 als Geführter)">
<rect x="130" y="20" width="150" height="40" class="dg-form"/>
<text x="205" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-fett">LIEFERANT</text>
<line x1="280" y1="40" x2="345" y2="40" class="dg-linie"/>
<polygon points="400,15 455,40 400,65 345,40" class="dg-form"/>
<text x="400" y="40" text-anchor="middle" dominant-baseline="middle">liefert</text>
<line x1="455" y1="40" x2="510" y2="40" class="dg-linie"/>
<rect x="510" y="20" width="130" height="40" class="dg-form"/>
<text x="575" y="40" text-anchor="middle" dominant-baseline="middle" class="dg-fett">PRODUKT</text>
<text x="288" y="28" text-anchor="start" dominant-baseline="middle" class="dg-klein">(1,n)</text>
<text x="502" y="28" text-anchor="end" dominant-baseline="middle" class="dg-klein">(1,n)</text>
<line x1="400" y1="65" x2="400" y2="87" class="dg-linie"/>
<ellipse cx="400" cy="105" rx="58" ry="18" class="dg-form"/>
<text x="400" y="105" text-anchor="middle" dominant-baseline="middle" class="dg-klein">einkaufspreis</text>
<rect x="130" y="170" width="150" height="40" class="dg-form"/>
<text x="205" y="190" text-anchor="middle" dominant-baseline="middle" class="dg-fett">MITARBEITER</text>
<line x1="280" y1="190" x2="345" y2="190" class="dg-linie"/>
<polygon points="400,165 455,190 400,215 345,190" class="dg-form"/>
<text x="400" y="190" text-anchor="middle" dominant-baseline="middle">erfasst</text>
<line x1="455" y1="190" x2="510" y2="190" class="dg-linie"/>
<rect x="510" y="170" width="130" height="40" class="dg-form"/>
<text x="575" y="190" text-anchor="middle" dominant-baseline="middle" class="dg-fett">AUFTRAG</text>
<text x="288" y="178" text-anchor="start" dominant-baseline="middle" class="dg-klein">(0,n)</text>
<text x="502" y="178" text-anchor="end" dominant-baseline="middle" class="dg-klein">(1,1)</text>
<line x1="165" y1="210" x2="180" y2="287.5" class="dg-linie"/>
<line x1="245" y1="210" x2="230" y2="287.5" class="dg-linie"/>
<polygon points="205,275 255,300 205,325 155,300" class="dg-form"/>
<text x="205" y="300" text-anchor="middle" dominant-baseline="middle">führt</text>
<text x="166" y="240" text-anchor="end" dominant-baseline="middle" class="dg-klein">(0,n)</text>
<text x="166" y="254" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">als Vorgesetzter</text>
<text x="250" y="240" text-anchor="start" dominant-baseline="middle" class="dg-klein">(0,1)</text>
<text x="250" y="254" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">als Geführter</text>
<text x="270" y="300" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">rekursive Beziehung</text>
</svg>
```

*Prüferkommentar: 2 P vier korrekte Entitäten · je 2 P für die drei Beziehungen (liefert, erfasst, führt – die rekursive wird am häufigsten vergessen!) · 1 P einkaufspreis als Beziehungsattribut an „liefert" · 4 P für die Kardinalitäten (je Beziehung ~1,3 P; „erfasst" muss die 0 bei MITARBEITER zeigen – neue Mitarbeiter ohne Auftrag).*

**B2 (9 P):**
- lieferant(**lieferanten_id**, firmenname)
- produkt(**produkt_id**, bezeichnung, kategorie, preis)
- liefert(**lieferanten_id↑, produkt_id↑**, einkaufspreis)
- mitarbeiter(**mitarbeiter_id**, name, vorgesetzter_id↑) — vorgesetzter_id referenziert mitarbeiter.mitarbeiter_id und ist **NULL-fähig**
- auftrag(**auftrag_nr**, datum, mitarbeiter_id↑, …) — mitarbeiter_id ist **NOT NULL**, weil jeder Auftrag (1,1) genau einen erfassenden Mitarbeiter hat

*Prüferkommentar: 3 P m:n-Tabelle „liefert" mit zusammengesetztem PK aus beiden FKs · 3 P rekursiver Fremdschlüssel in derselben Tabelle inkl. NULL-Fähigkeit (Geschäftsführung hat keinen Vorgesetzten) · 2 P FK mitarbeiter_id↑ korrekt auf der n-Seite (auftrag) · 1 P saubere PK/FK-Kennzeichnung.*

**B3 (6 P):**
Das relationale Modell kann Beziehungen nur über Fremdschlüssel abbilden, und ein Fremdschlüsselfeld nimmt je Zeile genau einen Wert auf. Bei m:n müssten beide Seiten mehrere Werte speichern – das verletzt die Atomarität bzw. erzwingt redundante Zeilen. *(3 P)* Die Beziehungstabelle „liefert" erhält den zusammengesetzten Primärschlüssel (lieferanten_id, produkt_id) – jede Kombination existiert genau einmal. *(2 P)* Der Einkaufspreis hängt fachlich von **beiden** ab (derselbe Artikel kostet je Lieferant unterschiedlich viel) und gehört deshalb genau in diese Tabelle. *(1 P)*

---

## Block C

**C1 (25 P):**

**a) 1. NF (6 P):** Die Spalte *leistungen* wird atomisiert – eine Zeile je Auftrag **und** Leistung; die Angaben werden in die Spalten leistungs_id, bezeichnung, dauer_h zerlegt. Neuer zusammengesetzter Primärschlüssel: (**auftrag_nr, leistungs_id**).

| **auftrag_nr** | **leistungs_id** | datum | kunden_id | kundenname | techniker_id | technikername | stundensatz | bezeichnung | dauer_h |
|---|---|---|---|---|---|---|---|---|---|
| 5001 | L1 | 2026-03-02 | 1 | Huber GmbH | T7 | Yilmaz | 68,00 | Stuhlmechanik justieren | 0,5 |
| 5001 | L4 | 2026-03-02 | 1 | Huber GmbH | T7 | Yilmaz | 68,00 | Rollenwechsel | 0,25 |
| 5002 | L4 | 2026-03-05 | 3 | Fischer KG | T2 | Petrow | 62,00 | Rollenwechsel | 0,25 |
| 5003 | L2 | 2026-03-09 | 1 | Huber GmbH | T7 | Yilmaz | 68,00 | Tischplatte tauschen | 1,0 |

*(3 P Atomisierung/Zeilenstruktur, 3 P neuer PK ausdrücklich benannt.)*

**b) 2. NF (9 P):** Partielle Abhängigkeiten benennen:
- datum, kunden_id, kundenname, techniker_id, technikername, stundensatz hängen **nur von auftrag_nr** ab.
- bezeichnung hängt **nur von leistungs_id** ab.
- dauer_h hängt vom **gesamten** Schlüssel ab und bleibt in der Beziehungstabelle. *(Annahme: dauer_h ist die tatsächlich im Auftrag angefallene Zeit. Wäre es eine feste Vorgabezeit aus dem Leistungskatalog, hinge sie nur von leistungs_id ab und gehörte in die Tabelle leistung – die Daten (L4 zweimal 0,25 h) lassen beides zu. Annahme in der Prüfung ausdrücklich hinschreiben.)*

Schema in 2. NF:
- auftrag(**auftrag_nr**, datum, kunden_id, kundenname, techniker_id, technikername, stundensatz)
- leistung(**leistungs_id**, bezeichnung)
- auftragsposition(**auftrag_nr↑, leistungs_id↑**, dauer_h)

*(4 P vollständig benannte partielle Abhängigkeiten – ohne diese Begründung max. 5 von 9! · 5 P korrektes Drei-Tabellen-Schema mit Schlüsseln.)*

**c) 3. NF (10 P):** Transitive Abhängigkeiten in *auftrag*:
- auftrag_nr → kunden_id → kundenname
- auftrag_nr → techniker_id → technikername, stundensatz

Endschema:
- auftrag(**auftrag_nr**, datum, kunden_id↑, techniker_id↑)
- kunde(**kunden_id**, kundenname)
- techniker(**techniker_id**, technikername, stundensatz)
- leistung(**leistungs_id**, bezeichnung)
- auftragsposition(**auftrag_nr↑, leistungs_id↑**, dauer_h)

*(4 P beide transitiven Ketten benannt · 6 P Endschema mit allen PK/FK. Häufigster Fehler: stundensatz bleibt im Auftrag „hängen" – er gehört zum Techniker.)*

**C2 (9 P):**
**Nachteile:** Redundante Speicherung des Kundennamens erzeugt eine Änderungsanomalie – bei Umfirmierung müssen alle Aufträge angepasst werden; wird eine Zeile vergessen, ist der Bestand inkonsistent (Datenqualitätsdimension Konsistenz verletzt). Zusätzlich steigt der Speicher- und Pflegeaufwand. *(3 P)*
**Vorteil:** Auswertungen kommen ohne Join auf die Kundentabelle aus – schnellere, einfachere Lesezugriffe. *(2 P)*
**Empfehlung:** Im operativen System (OLTP) bei der 3. NF bleiben – Konsistenz hat Vorrang, die Join-Kosten sind vernachlässigbar. Für das Berichtswesen ist kontrollierte Denormalisierung dagegen legitim und üblich: eine Auswertungssicht (View) oder ein Data Mart im Star-Schema, der regelmäßig per ETL befüllt wird. So bleibt die führende Datenhaltung sauber, und die Analyse wird trotzdem schnell. *(4 P – die Differenzierung OLTP vs. Reporting ist der Kern; ein pauschales „Nein, verstößt gegen 3. NF" bekommt max. 5 von 9.)*

---

## Block D

**D1 (10 P):**
- **Schwäche 1:** Die m:n-Beziehung zwischen Bestellung und Produkt ist nicht aufgelöst – produkt_id liegt direkt in der Bestellung. Eine Bestellung kann so nur **ein** Produkt enthalten (bzw. bestell_id müsste mehrfach vorkommen und wäre kein Primärschlüssel mehr). *(2 P)* **Verbesserung:** Beziehungstabelle bestellposition(**bestell_id↑, produkt_id↑**, menge) einführen; produkt_id, menge aus der Bestellung entfernen. *(3 P)*
- **Schwäche 2:** bezeichnung und preis sind transitiv von produkt_id abhängig – Verstoß gegen die 3. NF, redundante Produktdaten in jeder Bestellung, Änderungsanomalie bei Preisänderungen. *(2 P)* **Verbesserung:** Produktstammdaten ausschließlich in der Tabelle produkt führen und referenzieren. Zusatzpunkt-würdig: Wer ergänzt, dass ein *Verkaufspreis zum Bestellzeitpunkt* als bewusste Historisierung in der Bestellposition sinnvoll sein kann, zeigt Verständnis über die Regel hinaus. *(3 P)*

**D2 (6 P):**
a) MITARBEITER (0,1) ── nutzt ── (1,1) FIRMENWAGEN · Chen: **1:1** *(2 P)*
b) ABTEILUNG (1,n) ── beschäftigt ── (1,1) MITARBEITER · Chen: **1:n** *(2 P)*
c) PRODUKT (0,n) ── lagert in ── (0,n) LAGER · Chen: **m:n** *(2 P)*

*Prüferkommentar: Halber Punktabzug je Teilaufgabe, wenn Min-Max-Seiten vertauscht sind – das ist exakt die Falle aus Aufgabe A3c.*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Thema sitzt – Normalisierung nur noch als Karteikarte pflegen |
| 81–91 | gut | Fehlerthemen ins Fehlerjournal, in ein bis zwei Wochen eine neue breite Tabelle normalisieren |
| < 81 | | Teil 2 + 3 des Lernzettels wiederholen, Klausur nach einer Woche neu schreiben |

Ein Hinweis aus der Korrekturpraxis: Bei Normalisierungsaufgaben verlieren gute Kandidaten Punkte fast nie am Schema, sondern an **fehlenden Begründungen** (Abhängigkeiten nicht benannt) und **fehlenden Schlüsselkennzeichnungen**. Schreib beides immer explizit hin – das sind geschenkte Punkte auf dem Weg zur 1.
