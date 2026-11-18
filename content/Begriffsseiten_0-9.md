<!-- Begriffsseiten 0-9 · Stand 2026-10 -->
## 1. Normalform
<!-- id: 1-normalform · quellen: Karte DD2, DD2 Teil 3 · stand: 2026-10 -->

Eine Tabelle ist in 1. Normalform, wenn alle Attributwerte atomar sind – keine Listen und keine Wiederholungsgruppen in einer Zelle.

### Erklärung
Die 1. NF ist der erste Schritt der Normalisierung. Jede Zelle enthält genau einen, nicht weiter zerlegbaren Wert; mehrere Werte derselben Art werden in eigene Zeilen aufgelöst. Dadurch entsteht meist ein neuer, **zusammengesetzter Schlüssel**. Erst atomare Werte lassen sich filtern, zählen und per Fremdschlüssel verknüpfen.

### Beispiel
Der Altsystem-Export der Möbelhaus Nordholz GmbH enthält in der Zelle *produktliste* „10 Bürostuhl Comfort, 249,00, 2 St.; 12 Monitor 27 Zoll, 189,00, 2 St.“. In der 1. NF wird daraus eine Zeile je Bestellung und Produkt mit dem Schlüssel (bestell_id, produkt_id). Atomar ist die Tabelle dann – aber noch stark redundant (Datum und Kunde stehen in jeder Position).

### Abgrenzung
Die 1. NF beseitigt nur Mehrfachwerte. Partielle Abhängigkeiten behandelt erst die 2. NF, transitive die 3. NF.

### Prüfungsfalle
„Atomar“ heißt fachlich unteilbar für den Zweck: Eine Adresse „Hauptstr. 5, 50667 Köln“ in einem Feld gilt meist als nicht atomar, weil man nach PLZ oder Ort auswerten will.

### Merksatz
1. NF: In jeder Zelle steht genau ein Wert.

Siehe auch: 2. Normalform · 3. Normalform · Normalisierung · Zusammengesetzter Schlüssel · Anomalie
Mehr: Deep Dive 2, Teil 3

## 2. Normalform
<!-- id: 2-normalform · quellen: Karte DD2, DD2 Teil 3, DD2 2.1 · stand: 2026-10 -->

Eine Tabelle ist in 2. Normalform, wenn sie in 1. NF ist und jedes Nichtschlüsselattribut vom ganzen Primärschlüssel abhängt – es gibt keine partiellen Abhängigkeiten.

### Erklärung
Partielle Abhängigkeiten kann es nur bei einem **zusammengesetzten Schlüssel** geben: Ein Attribut hängt dann schon von einem Teil des Schlüssels ab. Solche Attribute werden mit diesem Schlüsselteil in eine eigene Tabelle ausgelagert. Eine Tabelle in 1. NF mit einteiligem Primärschlüssel ist automatisch in 2. NF.

### Beispiel
Tabelle (**bestell_id, produkt_id**, bestelldatum, kunden_id, bezeichnung, preis, menge):
- bestelldatum und kunden_id hängen nur von bestell_id ab → Tabelle *bestellung*
- bezeichnung und preis hängen nur von produkt_id ab → Tabelle *produkt*
- menge hängt vom ganzen Schlüssel ab → bleibt in *bestellposition*

### Abgrenzung
| Normalform | verbietet |
|---|---|
| 1. NF | Mehrfachwerte in einer Zelle |
| 2. NF | Abhängigkeit von einem Teil des Schlüssels |
| 3. NF | Abhängigkeit von einem Nichtschlüsselattribut |

### Prüfungsfalle
Bei einteiligem Schlüssel nach partiellen Abhängigkeiten suchen – es gibt keine; die Prüfung gehört dann zur 3. NF.

### Merksatz
2. NF: vom ganzen Schlüssel abhängig, nicht nur von einem Teil.

Siehe auch: 1. Normalform · 3. Normalform · Partielle Abhängigkeit · Funktionale Abhängigkeit · Zusammengesetzter Schlüssel
Mehr: Deep Dive 2, Teil 3 · Deep Dive 2, 2.1

## 3-2-1-Regel
<!-- id: 3-2-1-regel · quellen: Karte DD10, DD10 4.4 · stand: 2026-10 -->

Backup-Faustregel: drei Kopien der Daten auf zwei verschiedenen Medientypen, davon eine außer Haus (offsite); ergänzend heute mindestens eine Kopie offline oder unveränderbar.

### Erklärung
Die drei Kopien (Original plus zwei Sicherungen) schützen vor dem Ausfall einer einzelnen Kopie. Zwei Medientypen (z. B. Festplatte im NAS und Band oder Cloud-Speicher) verhindern, dass ein typbedingter Fehler alle Kopien trifft. Die Kopie außer Haus übersteht Brand, Wasser oder Diebstahl am Standort. Weil Ransomware alle erreichbaren Sicherungen mitverschlüsselt, ergänzt man heute eine Offline-Kopie oder einen unveränderbaren Speicher (oft als 3-2-1-1-0 bezeichnet: zusätzlich null Fehler bei der Wiederherstellungsprüfung).

### Beispiel
Die Möbelhaus-Datenbank läuft auf dem Server (Kopie 1), wird nachts auf ein NAS gesichert (Kopie 2, Medium Festplatte) und wöchentlich auf ein Band, das im Bankschließfach liegt (Kopie 3, anderes Medium, offsite, offline).

Die Abbildung zeigt, welche Kopie welche der drei Zahlen erfüllt.

**Abbildung: 3-2-1-Regel am Beispiel des Möbelhauses**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 238" width="360" height="238" role="img" aria-label="Drei Kopien auf zwei Medien, eine außer Haus: Server und NAS auf Festplatte im Möbelhaus, ein Band im Bankschließfach außer Haus">
<defs><marker id="drei-zwei-eins-pfeil" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<rect x="4" y="8" width="218" height="150" class="dg-linie dg-strich"/>
<rect x="238" y="8" width="118" height="150" class="dg-linie dg-strich"/>
<text x="113" y="22" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">vor Ort (Möbelhaus)</text>
<text x="297" y="22" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">außer Haus</text>
<rect x="12" y="40" width="84" height="56" class="dg-akzent"/>
<text x="54" y="58" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Server</text>
<text x="54" y="78" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Festplatte</text>
<text x="54" y="112" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Kopie 1</text>
<text x="54" y="126" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">Original</text>
<rect x="124" y="40" width="84" height="56" class="dg-akzent"/>
<text x="166" y="58" text-anchor="middle" dominant-baseline="middle" class="dg-fett">NAS</text>
<text x="166" y="78" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Festplatte</text>
<text x="166" y="112" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Kopie 2</text>
<text x="166" y="126" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">nachts</text>
<rect x="254" y="40" width="84" height="56" class="dg-mittel"/>
<text x="296" y="58" text-anchor="middle" dominant-baseline="middle" class="dg-fett">Band</text>
<text x="296" y="78" text-anchor="middle" dominant-baseline="middle" class="dg-klein">offline</text>
<text x="296" y="112" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">Kopie 3</text>
<text x="296" y="126" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-leise">wöchentlich</text>
<line x1="96" y1="68" x2="122" y2="68" class="dg-linie" marker-end="url(#drei-zwei-eins-pfeil)"/>
<line x1="208" y1="68" x2="252" y2="68" class="dg-linie" marker-end="url(#drei-zwei-eins-pfeil)"/>
<text x="10" y="180" text-anchor="start" dominant-baseline="middle" class="dg-fett">3 Kopien</text>
<text x="120" y="180" text-anchor="start" dominant-baseline="middle" class="dg-klein">Server, NAS, Band</text>
<text x="10" y="202" text-anchor="start" dominant-baseline="middle" class="dg-fett">2 Medien</text>
<text x="120" y="202" text-anchor="start" dominant-baseline="middle" class="dg-klein">Festplatte und Band</text>
<text x="10" y="224" text-anchor="start" dominant-baseline="middle" class="dg-fett">1 außer Haus</text>
<text x="120" y="224" text-anchor="start" dominant-baseline="middle" class="dg-klein">Band im Bankschließfach</text>
</svg>
```

### Abgrenzung
**RAID** spiegelt Änderungen sofort auf alle Platten und ersetzt kein Backup – versehentliches Löschen und Verschlüsselung landen ebenfalls auf allen Platten.

### Prüfungsfalle
Zwei Sicherungen auf zwei Festplatten im selben Serverraum erfüllen weder „zwei Medientypen“ noch „offsite“.

### Merksatz
Drei Kopien, zwei Medien, eine außer Haus – und eine, die kein Angreifer erreicht.

Siehe auch: Vollsicherung · Generationenprinzip (Großvater-Vater-Sohn) · RAID · Ransomware · RTO und RPO
Mehr: Deep Dive 10, 4.4

## 3. Normalform
<!-- id: 3-normalform · quellen: Karte DD2, DD2 Teil 3, DD2 2.1 · stand: 2026-10 -->

Eine Tabelle ist in 3. Normalform, wenn sie in 2. NF ist und kein Nichtschlüsselattribut von einem anderen Nichtschlüsselattribut abhängt – es gibt keine transitiven Abhängigkeiten.

### Erklärung
Bei einer **transitiven Abhängigkeit** gilt Schlüssel → A → B: Das Attribut B hängt nur über das Nichtschlüsselattribut A vom Schlüssel ab. A und B werden in eine eigene Tabelle ausgelagert, A bleibt als Fremdschlüssel zurück. Ergebnis: Jede Tatsache ist nur einmal gespeichert, Änderungsanomalien verschwinden. Operative Datenbanken (OLTP) werden üblicherweise bis zur 3. NF normalisiert.

### Beispiel
bestellung(**bestell_id**, bestelldatum, kunden_id, kundenname, kundenort): Es gilt bestell_id → kunden_id → kundenname, kundenort. Zerlegung in kunde(**kunden_id**, kundenname, kundenort) und bestellung(**bestell_id**, bestelldatum, kunden_id↑). Klassiker aus Aufgaben: PLZ → Ort.

### Abgrenzung
Die **Boyce-Codd-Normalform (BCNF)** verschärft die 3. NF: Jede Determinante muss ein Schlüsselkandidat sein. Ein Unterschied tritt nur bei überlappenden zusammengesetzten Schlüsselkandidaten auf. Im Data Warehouse wird bewusst denormalisiert (Star-Schema).

### Prüfungsfalle
Die Zwischenschritte überspringen: Erwartet wird meist die Begründung je Schritt (atomar → partiell → transitiv), nicht nur das Endergebnis.

### Merksatz
Jedes Nichtschlüsselattribut hängt vom Schlüssel, vom ganzen Schlüssel und nur vom Schlüssel ab.

Siehe auch: 2. Normalform · Transitive Abhängigkeit · Boyce-Codd-Normalform (BCNF) · Denormalisierung · Änderungsanomalie
Mehr: Deep Dive 2, Teil 3 · Deep Dive 2, 2.1

## 5S
<!-- id: 5s · quellen: Karte DD5, DD5 6.2 · stand: 2026-10 -->

Lean-Methode für einen geordneten Arbeitsplatz in fünf Schritten: Sortieren, Systematisieren, Säubern, Standardisieren, Selbstdisziplin.

### Erklärung
5S bekämpft vor allem die Verschwendungsart **Bewegung** – Suchen nach Werkzeug, Unterlagen oder Dateien. Die Schritte: Unnötiges aussortieren (Sortieren), jedem Gegenstand einen festen Platz geben (Systematisieren), sauber halten (Säubern), die Ordnung als Regel festschreiben (Standardisieren) und dauerhaft einhalten und verbessern (Selbstdisziplin). Die Methode wirkt auch digital: Ablagestruktur, Laufwerke, Ordner- und Dateinamen.

### Beispiel
Im Reparaturservice sucht ein Techniker regelmäßig Ersatzteillisten. Nach 5S liegen nur noch aktuelle Listen in einem einheitlich benannten Ordner „Reparatur/Ersatzteile/<Jahr>“, veraltete Dateien sind archiviert, und eine Namenskonvention ist verbindlich.

### Abgrenzung
5S ordnet den Arbeitsplatz; **Kaizen** bzw. **KVP** ist die übergreifende Haltung der ständigen kleinen Verbesserung, in die 5S eingebettet ist.

### Prüfungsfalle
5S für eine einmalige Aufräumaktion halten – ohne Standardisieren und Selbstdisziplin fällt der Arbeitsplatz in den alten Zustand zurück.

### Merksatz
Fünf S gegen das Suchen: aussortieren, ordnen, säubern, festschreiben, dranbleiben.

Siehe auch: Lean Management · Kaizen · KVP · Wertstromanalyse
Mehr: Deep Dive 5, 6.2
