# Musterlösungen Übungsklausur Altklausur-Training Datenqualität (Deep Dive 19)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen**; andere sach- und fachgerechte Lösungen werden gleichwertig bewertet. Bei SQL zählt die **Logik**, die Syntax anderer SQL-Versionen ist ebenfalls richtig. 92+ P = sehr gut.

---

## Block A – Visualisierung und Auswertung (21 P)

**A1 (9 P):** *Je 2 P pro Personengruppe + 2 P Beschriftung + 1 P Legende*

Geeignet ist ein **gruppiertes Säulendiagramm**: Auf der x-Achse stehen die Rampen (Rampe 1 bis 3), je Rampe gibt es drei Säulen für die Gruppen Lieferanten, Selbstabholer und Montageteams. Die y-Achse zeigt die **prozentuale Verteilung** (0–100 %) bzw. die absolute Anzahl der Personen.

| Rampe | Lieferanten | Selbstabholer | Montageteams |
|---|---|---|---|
| Rampe 1 | 70 % | 20 % | 0 % |
| Rampe 2 | 30 % | 0 % | 50 % |
| Rampe 3 | 0 % | 80 % | 50 % |

Legende: Lieferanten, Selbstabholer, Montageteams (unterschiedliche Farben/Muster). Achsentitel: „Rampe“ und „Anteil der Gruppe in %“.

*Andere sinnvolle Visualisierungen sind möglich (z. B. Kreisdiagramme je Rampe, Darstellung der absoluten Werte), solange die Aussagekraft erhalten bleibt.*

**A2 (6 P):** Gesamt: 180 + 60 + 40 = **280 Personen pro Tag** *(1 P)*

| Rampe | Rechnung | Personen | Auslastung |
|---|---|---|---|
| Rampe 1 | 180 × 70 % + 60 × 20 % + 40 × 0 % = 126 + 12 + 0 | **138** | 138 ÷ 280 ≈ **49,3 %** |
| Rampe 2 | 180 × 30 % + 60 × 0 % + 40 × 50 % = 54 + 0 + 20 | **74** | 74 ÷ 280 ≈ **26,4 %** |
| Rampe 3 | 180 × 0 % + 60 × 80 % + 40 × 50 % = 0 + 48 + 20 | **68** | 68 ÷ 280 ≈ **24,3 %** |

*Prüferkommentar: Je Rampe 1,5 P (Personen und Prozentwert), Kontrolle: Summe 280 bzw. 100 %.*

**A3 (6 P):** *Je Rampe 2 P*

- **Rampe 1:** höchste Auslastung mit **138 Personen pro Tag (≈ 49 %)**; wird von Lieferanten (91 % der dortigen Zugänge) und Selbstabholern genutzt; Spitzen morgens und nachmittags → größte Kapazität und mehrere Abfertigungsspuren nötig.
- **Rampe 2:** mittlere Auslastung mit **74 Personen (≈ 26 %)**; Lieferanten und Montageteams, keine Selbstabholer; Montageteams sorgen für Dauerlast über den Tag.
- **Rampe 3:** geringste Auslastung mit **68 Personen (≈ 24 %)**; ausschließlich Selbstabholer und Montageteams, keine Lieferanten → Spitzenzeiten der Selbstabholer beachten (10–12 und 15–17 Uhr).

---

## Block B – Automatisierte Etikettenerkennung (28 P)

**B1 (4 P):** *Je Merkmal 1 P + 1 P Überprüfung*

| Merkmal | Initiale Überprüfung bei der Registrierung |
|---|---|
| Name/Firma der Spedition | Abgleich mit Frachtbrief bzw. Handelsregisterauszug |
| Name des Fahrers | Amtlicher Lichtbildausweis |
| Anlieferzweck / Bestellnummer | Rückfrage beim Einkauf bzw. Abgleich mit der Bestellung |

*Weitere Angaben sind möglich.*

**B2 (8 P):** *Je Schritt 1 P Nennung + 1 P Funktionalität*

| Nr. | Schritt | Funktionalität |
|---|---|---|
| 1 | Bildaufnahme | Kamera erzeugt ein digitales Bild der Palette *(vorgegeben)* |
| 2 | Vorverarbeitung des Bildes | Bildeigenschaften wie Helligkeit und Kontrast verbessern, Rauschen entfernen |
| 3 | Etikettenerkennung im Bild | Lokalisierung: Wo im Bild liegt das Etikett? Ausschnitt (Cropping) |
| 4 | Texterkennung (OCR) | Zeichen im Ausschnitt extrahieren |
| 5 | Validierung | Format mit regulärem Ausdruck prüfen (`^LS-\d{4}-\d{6}$`), Lieferscheinnummer mit der Bestellung im System abgleichen |
| 6 | Entscheidung: Freigabe oder nicht | Abhängig vom letzten Schritt wird die Entladung freigegeben oder nicht *(vorgegeben)* |

*Andere sinnvolle Lösungsvorschläge sind möglich.*

**B3 (4 P):** *2 × 2 P je Grund*
- **Vielfalt und Variabilität:** unterschiedliche Etikettenformate, Verschmutzung, Knicke, Perspektive und Lichtverhältnisse; neuronale Netze lernen aus Beispielen und können damit robust umgehen.
- **Klassische regelbasierte Algorithmen** müssten jede Ausnahme einzeln programmieren, neuronale Netze **lernen aus Beispielen**.
- Sie sind **lernfähig und anpassbar**: mit neuen Trainingsdaten (neue Etikettenformate) lassen sie sich nachtrainieren.

**B4 (4 P):** *2 × 2 P*
1. **Erkennung lokaler Muster:** CNNs erkennen Kanten, Ecken und Texturen mit Filtern. Buchstaben und Ziffern auf Etiketten bestehen aus klar abgegrenzten Linien und Kanten – genau solche Muster erfassen die Faltungsschichten zuverlässig.
2. **Räumliche Struktur bleibt erhalten:** Anders als vollständig verbundene Netze behält ein CNN die 2D-Anordnung der Pixel; es erkennt ein Etikett auch, wenn es **verschoben oder leicht gedreht** ist. Tiefere Schichten fügen einfache Muster zu Zeichen und Etiketten zusammen.

**B5 (4 P):**
- **Vorhandene Funktionalität** *(2 P)*: Das Verfahren erkennt wichtige Objekte (Palette, Person, Gabelstapler), gibt **Bounding Boxes** und **Wahrscheinlichkeiten** an. Damit könnte das Bild auf den Bereich der Palette **zugeschnitten (Cropping)** werden.
- **Fehlende Funktionalität** *(2 P)*: Die **Region mit dem Etikett** wird nicht erkannt; ohne sie ist keine Texterkennung möglich.

**B6 (2 P):** Das Standardmodell wird mit **geeigneten, gelabelten Etikettenbildern nachtrainiert** (Transfer Learning/Fine-Tuning), sodass das Etikett als relevante Region erkannt und ausgewiesen wird. Alternativ: ein zweites, spezialisiertes Modell für die Etikettenregion hinter das Standardmodell schalten.

**B7 (2 P):** *Je 1 P*
- Hinweisschilder auf die Videoerfassung.
- **Datenminimierung:** Beschränkung auf die Region des Etiketts, Personen werden nicht gespeichert.
- Anonymisierung bzw. Unkenntlichmachen von Personen.
- Automatische Löschung der Bilddaten nach kurzer Frist.

---

## Block C – Datenhaltung, ETL und Datenschutz (25 P)

**C1 (8 P):** *Je 1 P Nennung + 1 P Beschreibung*

| Vorteil (zentral) | Nachteil (zentral) |
|---|---|
| **Einheitlicher Datenbestand**: Änderungen und Berechtigungen werden einmal gepflegt und sind sofort an allen Rampen gültig | **Abhängigkeit von Netz und Anbieter**: Fällt die Verbindung aus, ist keine Prüfung möglich |
| **Einfaches Backup** und zentrale Absicherung durch den Anbieter | **Zentrale Angriffsfläche** und Datenschutzfragen (Standort der Daten, Auftragsverarbeitung) |

**C2 (3 P):** *Je 1 P*

| Datenbank | personenbezogene Daten | nicht personenbezogene Daten |
|---|---|---|
| Berechtigungsdatenbank | | X |
| Anlieferdatenbank | | X |
| Speditionsdatenbank | X | |

*Prüferkommentar: Die Speditionsdatenbank enthält Namen der Ansprechpartner. Berechtigungs- und Anlieferdatenbank führen nur IDs und Zeiten – sie werden nur durch die Verknüpfung mit der Speditionsdatenbank personenbeziehbar.*

**C3 (4 P):** *Je 2 P*
- **Verschlüsselung** der Datenbank und der Übertragung.
- Beim Datenbankdesign muss die **Löschung** der Daten möglich sein (referenzielle Integrität); **Löschfristen** möglichst automatisiert einhalten.
- **Zugriffe absichern:** Rollen- und Rechtekonzept, Protokollierung.

**C4 (8 P):** *Je Attribut 2 P Nennung + Zweck, je 2 P Datentyp*

| Attribut | Erläuterung |
|---|---|
| **Datum** | Wochentag, Tag und Monat zu **einem Datumsfeld** (`DATE`) zusammenfassen: einfache Sortierung, Filterung und Auswertung nach Zeiträumen |
| **Aufenthaltsdauer** | Aus Von/Bis die Dauer berechnen und als **numerischen Wert in Minuten** (`INTEGER`) speichern – die Dauer ist die gesuchte Analysegröße |
| **Rampen-ID** | Eigener **numerischer Schlüssel** (`INTEGER`) statt Text „Rampe 1“: Joins und Suche sind einfacher und schneller |
| **ExcelID** | Technische Nummer ohne Aussagekraft: kann **entfernt** werden |

*Andere sinnvolle Vorschläge sind möglich.*

**C5 (2 P):** Eine Beschreibung wie:
- **Verdacht auf eine Straftat**, z. B. Diebstahl von Waren, mit konkretem, dokumentiertem Verdacht und Zustimmung des Betriebsrats.
- **Arbeitssicherheit**: im Brandfall feststellen, wer sich im Gelände befindet.

---

## Block D – SQL für die Produktionsplanung (26 P)

**D1 (4 P):** *Je Klausel 1 P (SELECT, JOIN, WHERE, ORDER BY)*

```sql
SELECT pp.Produktionsdatum, m.M_Name, pp.Anzahl
FROM produktionsplan pp
JOIN moebel m ON pp.M_ID = m.M_ID
WHERE pp.Produktionsdatum BETWEEN '2026-05-11' AND '2026-05-12'
ORDER BY pp.Produktionsdatum, m.M_Name;
```

**D2 (8 P):**

```sql
SELECT bt.BT_ID, bt.BT_Name,
       SUM(sl.Anzahl * pp.Anzahl) AS Gesamtzahl     -- SUM 1 P + Multiplikation 1 P + AS 1 P
FROM bauteil bt                                      -- 1 P (SELECT-Spalten)
INNER JOIN stueckliste sl ON bt.BT_ID = sl.BT_ID     -- 2 P (zwei Joins mit Bedingung)
INNER JOIN produktionsplan pp ON sl.M_ID = pp.M_ID
WHERE pp.Produktionsdatum = '2026-05-12'             -- 1 P
GROUP BY bt.BT_ID, bt.BT_Name;                       -- 1 P
```

*Prüferkommentar: Der Weg über die Möbel-Tabelle (Bauteil → Stückliste → Möbel → Produktionsplan) ist gleichwertig. Fehlt eine Join-Bedingung, entsteht ein kartesisches Produkt – Punktverlust.*

**D3 (8 P):** *SUM, Multiplikation und AS wurden in D2 bereits mit 3 P bewertet – hier nur mit 1 P.*

```sql
SELECT m.M_Name, m.Verkaufspreis,
       SUM(sl.Anzahl * bt.Einkaufspreis) AS Variable_Kosten,                          -- 1 P
       m.Verkaufspreis - SUM(sl.Anzahl * bt.Einkaufspreis) AS Deckungsbeitrag         -- 1 P
FROM moebel m                                                                         -- 1 P
INNER JOIN stueckliste sl ON m.M_ID = sl.M_ID
INNER JOIN bauteil bt ON sl.BT_ID = bt.BT_ID                                          -- 1 P
GROUP BY m.M_ID, m.M_Name, m.Verkaufspreis                                            -- 1 P
HAVING m.Verkaufspreis - SUM(sl.Anzahl * bt.Einkaufspreis) > 50                       -- 1 P
ORDER BY Deckungsbeitrag DESC;                                                        -- 2 P
```

Ergebnis (Kontrolle):

| M_Name | Verkaufspreis | Variable_Kosten | Deckungsbeitrag |
|---|---|---|---|
| Schrank | 720 | 293 | 427 |
| Schreibtisch | 480 | 264 | 216 |
| Regal | 260 | 136 | 124 |

Der **Stuhl** (Verkaufspreis 110, variable Kosten 63 → Deckungsbeitrag 47) liegt unter 50 EUR und wird ausgeblendet.

**D4 (6 P):** *Relevant für die Bewertung ist die Logik und nicht die Auswahl der SQL-Funktion.*

```sql
UPDATE produktionsplan                                          -- 1 P
SET Produktionsdatum = DATEADD(DAY, 7, Produktionsdatum)        -- 2 P  (alternativ: Produktionsdatum + 7)
WHERE Produktionsdatum = '2026-05-12'                           -- 1 P
  AND A_ID IN (SELECT A_ID FROM anlage                          -- 1 P (Unterabfrage)
               WHERE Bezeichnung = 'Fräse F2');                 -- 1 P
```

*Prüferkommentar: Ohne WHERE würden alle Pläne verschoben. Wer nur auf die Bezeichnung filtert, ohne die Unterabfrage, kann die A_ID nicht ermitteln.*

---

## Auswertung

| Block | Punkte | Typischer Fehler |
|---|---|---|
| A | 21 | Achsen/Legende fehlen, Prozentwerte falsch bezogen |
| B | 28 | Validierung vergessen, CNN-Argumente ohne Szenario |
| C | 25 | Personenbezug falsch, ETL ohne Zweck und Datentyp |
| D | 26 | Aggregat in WHERE, Join-Bedingung fehlt, UPDATE ohne WHERE |
