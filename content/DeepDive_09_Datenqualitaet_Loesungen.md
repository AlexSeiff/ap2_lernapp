# Musterlösungen Übungsklausur Datenqualität (Deep Dive 9)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Dieser Block ist argumentationslastig. Achte darauf, ob deine Antworten wirklich **Maßnahmen** enthalten und nicht nur Problembeschreibungen. 92+ P = sehr gut.

---

## Block A – Dimensionen (20 P)

**A1 (15 P):** *(je Dimension 1 P Nennung, 1 P Erläuterung, 1 P Maßnahme)*

| Dimension | Bedeutung | Maßnahme zur Sicherstellung |
|---|---|---|
| Vollständigkeit | Alle für den Zweck erforderlichen Werte sind vorhanden. | Pflichtfelder (NOT NULL) bei der Erfassung, regelmäßige Messung des Füllgrades |
| Korrektheit | Die Werte stimmen mit der Realität überein. | Abgleich mit Referenzquellen (Adressvalidierung), Stichproben, Vier-Augen-Prinzip |
| Konsistenz | Die Werte widersprechen sich weder im Datensatz noch zwischen Systemen. | feldübergreifende Plausibilitätsregeln, ein führendes System je Stammdatenart |
| Eindeutigkeit | Jeder Kunde existiert genau einmal. | UNIQUE-Constraint auf Schlüsselfeldern, Dublettenprüfung bei der Neuanlage |
| Gültigkeit | Die Werte entsprechen Format und Wertebereich. | Format- und Wertebereichsprüfung (CHECK), Auswahllisten statt Freitext |

*Ebenfalls anerkannt: Aktualität, Genauigkeit, Relevanz. Reine Aufzählung ohne Erläuterung und Maßnahme: max. 5 von 15 P.*

**A2 (5 P):**
**Gültigkeit** bedeutet, dass ein Wert den formalen Regeln entspricht – Format, Länge, Wertebereich. **Korrektheit** bedeutet, dass der Wert die Realität zutreffend abbildet. Ein Wert kann formal gültig und trotzdem sachlich falsch sein; Formatprüfungen erkennen deshalb nur einen Teil der Fehler. *(3 P)*

Beleg aus der Anlage: Die PLZ „8033" in Datensatz 3 ist **ungültig**, da deutsche Postleitzahlen fünfstellig sind – das erkennt eine Formatprüfung. Die PLZ „20095" in Datensatz 5 ist dagegen formal gültig; ob die Braun GmbH tatsächlich dort ansässig ist, kann nur ein Abgleich mit einer Referenzquelle klären. *(2 P)*

---

## Block B – Probleme identifizieren (24 P)

**B1 (18 P):** *(je Problem 3 P: 1 P Benennung mit Datensatznummer, 1 P Dimension, 1 P Konsequenz – sechs genügen)*

| # | Problem | Datensatz | Dimension | Konsequenz |
|---|---|---|---|---|
| 1 | E-Mail fehlt | 2, 7, 10 | Vollständigkeit | Kunden sind per Newsletter oder Auftragsbestätigung nicht erreichbar; Auswertungen zur Kontaktquote verzerrt |
| 2 | Exakte Dublette | 6 (= 1) | Eindeutigkeit | Umsatz wird doppelt gezählt (2.500 € statt 1.250 €); Kundenzahl zu hoch |
| 3 | Unscharfe Dublette | 8 (= 5) | Eindeutigkeit | Wird von einfachen Prüfungen nicht erkannt; Umsatz und Kundenzahl ebenfalls verfälscht |
| 4 | PLZ vierstellig | 3 | Gültigkeit | Regionale Auswertungen und Postversand schlagen fehl; Datensatz fällt bei Joins auf Regionsdaten heraus |
| 5 | Negativer Umsatz | 4 | Gültigkeit / Plausibilität | Summen und Mittelwerte werden systematisch zu niedrig; Vorzeichenfehler bleibt unentdeckt |
| 6 | Geburtsdatum in der Zukunft | 9 (12.02.2035) | Plausibilität / Konsistenz | Altersauswertungen liefern negative Werte; Zielgruppensegmentierung unbrauchbar |
| 7 | Platzhalterdatum 01.01.1900 | 3, 7 | Korrektheit | Wird als echtes Datum gerechnet; erzeugt ein Alter von über 120 Jahren |
| 8 | Ungültiges E-Mail-Format | 4 (`weber@mail`) | Gültigkeit | Zustellung schlägt fehl, ohne dass es auffällt |

*Prüferkommentar: Die Konsequenz ist der Punkt, der am häufigsten fehlt. „Dublette" allein ist eine Beobachtung – erst „der Umsatz wird doppelt gezählt" ist eine Analyse.*

**B2 (6 P):**
Typische Ursache: Ein **Platzhalter- bzw. Default-Wert** des Systems. Da das Feld technisch nicht leer bleiben darf, trägt das Erfassungsprogramm oder die Migration automatisch einen Ersatzwert ein – 01.01.1900 ist dabei ein verbreiteter Standardwert. *(3 P)*

Gefährlicher als ein leeres Feld ist er, weil er **wie ein echter Wert aussieht**: Ein NULL-Wert wird von Aggregatfunktionen ignoriert und fällt bei jeder Vollständigkeitsprüfung sofort auf. Der Platzhalter dagegen wird stillschweigend mitgerechnet, erzeugt hier ein Alter von über 120 Jahren, verzerrt Mittelwerte und Altersverteilungen und wird von keiner NULL-Prüfung erkannt. Er täuscht Vollständigkeit vor, wo faktisch keine Information vorliegt. *(3 P)*

---

## Block C – Kennzahlen und fehlende Werte (30 P)

**C1 (12 P):** *(je Teilaufgabe 3 P: 1 P Ansatz, 1 P Rechnung, 1 P Ergebnis)*

(a) **Vollständigkeitsgrad E-Mail:** 3 von 10 Feldern leer (Datensätze 2, 7, 10)
$\frac{\text{gefüllte Felder}}{\text{alle Felder}} \cdot 100 = \frac{7}{10} \cdot 100$ = **70,00 %**

(b) **Eindeutigkeitsgrad:** 10 Datensätze, darunter zwei Dublettenpaare (1/6 und 5/8) → 8 eindeutige Kunden
$\frac{\text{eindeutige Kunden}}{\text{Datensätze}} \cdot 100 = \frac{8}{10} \cdot 100$ = **80,00 %**

(c) **Gültigkeitsgrad PLZ:** 1 von 10 nicht fünfstellig (Datensatz 3)
$\frac{\text{gültige Werte}}{\text{alle Werte}} \cdot 100 = \frac{9}{10} \cdot 100$ = **90,00 %**

(d) **Anteil plausibler Geburtsdaten:** 3 unplausibel (zweimal 01.01.1900, einmal Zukunftsdatum)
$\frac{7}{10} \cdot 100$ = **70,00 %**

**C2 (4 P):**
57 gefüllte von 60 Pflichtzellen: $\frac{57}{60} \cdot 100$ = **95,00 %** *(2 P)*

Erläuterung: Die Kennzahl bezieht sich auf **alle Zellen über sechs Felder**, während C1 (a) nur das **eine** besonders lückenhafte Feld betrachtet. Die drei fehlenden Werte verteilen sich rechnerisch über 60 Zellen und fallen dadurch kaum ins Gewicht. Eine hohe Gesamtvollständigkeit kann also erhebliche Lücken in einzelnen, fachlich wichtigen Feldern verdecken – deshalb muss die **Bezugsgröße** stets angegeben und zusätzlich je Feld gemessen werden. *(2 P)*

*Prüferkommentar: Diese Aufgabe prüft, ob du Kennzahlen kritisch liest. Wer nur rechnet und die Erläuterung weglässt, verliert die Hälfte der Punkte.*

**C3 (4 P):** Beispiel für eine vollständige Kennzahldefinition *(je 1 P für Kennzahl, Zielwert, Intervall, Verantwortlichkeit)*:

> **Kennzahl:** Vollständigkeitsgrad des Feldes E-Mail in der Kundenstammdatentabelle
> **Berechnung:** gefüllte und formatgültige E-Mail-Adressen / alle aktiven Kunden · 100
> **Zielwert:** mindestens 90 %; unter 80 % ist eine Eskalation an die Bereichsleitung vorgesehen
> **Messintervall:** monatlich, automatisiert im Rahmen des ETL-Laufs
> **Verantwortlich:** Data Steward Kundenstammdaten (Nachpflege), Data Owner Vertriebsleitung (Regeln und Freigaben)

**C4 (6 P):** *(je Strategie 2 P: 1 P Vorteil, 1 P Nachteil)*

| Strategie | Vorteil | Nachteil |
|---|---|---|
| Datensätze löschen | einfach, keine erfundenen Werte im Bestand | Informationsverlust; sind die Lücken nicht zufällig verteilt, entsteht eine systematische Verzerrung |
| Mittelwert oder Median einsetzen | Fallzahl bleibt erhalten, alle Datensätze bleiben auswertbar | künstliche Werte verringern die Streuung und täuschen Genauigkeit vor; der Median ist robuster als der Mittelwert |
| Fachlich nachrecherchieren (Spedition, Lieferscheine) | liefert die tatsächlichen Werte und behebt die Ursache | hoher Aufwand, bei großen Datenmengen kaum praktikabel |

*Ebenfalls anerkannt: eigene Kategorie „unbekannt" (bei kategorialen Feldern); Kennzeichnung imputierter Werte in einer Zusatzspalte.*

**C5 (4 P):**
Ein Ersetzen durch den Mittelwert ist hier **nicht vertretbar**. Die Lücken sind **nicht zufällig** verteilt, sondern systematisch an einen Spediteur gebunden. Der Mittelwert stammt jedoch überwiegend aus den Daten der anderen Spediteure und bildet die Lieferdauer dieses einen Anbieters nicht ab. Fachbegriff: Hängt das Fehlen nur am (bekannten) Spediteur, liegt **MAR** vor; fehlen gerade die langen Lieferungen, liegt **MNAR** vor – in beiden Fällen nicht MCAR, ein Gesamtmittelwert verzerrt. Ein Gruppenmittelwert scheidet ebenfalls aus, weil für diesen Spediteur gar keine Werte vorliegen. *(2 P)*

Folge: Weicht der betroffene Spediteur tatsächlich vom Durchschnitt ab – was angesichts der fehlenden Meldung plausibel ist –, wird ausgerechnet der auffällige Fall systematisch geschönt und der Zusammenhang zwischen Spediteur und Lieferdauer verschwindet aus der Analyse. Richtig ist, die **Ursache zu klären** (fehlt die Schnittstelle, wird nicht gemeldet, wird anders erfasst?), die Lücke bis dahin als „unbekannt" zu kennzeichnen und die Auswertung mit und ohne diese Fälle zu rechnen und transparent zu berichten. *(2 P)*

---

## Block D – Bereinigen und vorbeugen (26 P)

**D1 (8 P):**
**Exakte Dubletten** (Datensatz 1 und 6): Alle fachlichen Feldwerte stimmen überein – nur der technische Schlüssel `kunden_id` (K-1001 / K-1006) unterscheidet sich und darf deshalb nicht in den Vergleich einfließen. Erkennung über eine Gruppierung nach den relevanten Feldern mit `HAVING COUNT(*) > 1` oder über einen UNIQUE-Vergleich. *(2 P)*

**Unscharfe Dubletten** (Datensatz 5 und 8): „Braun GmbH" gegenüber „Braun G.m.b.H." – identische E-Mail, PLZ und Geburtsdatum, abweichende Schreibweise des Namens. Vorgehen: *(4 P)*
1. **Normalisieren:** Groß-/Kleinschreibung vereinheitlichen, Punkte und Sonderzeichen entfernen, Rechtsformzusätze standardisieren, Umlaute umschreiben.
2. **Mehrfeldvergleich:** nicht nur den Namen prüfen, sondern die Kombination aus Name, E-Mail und PLZ.
3. **Ähnlichkeitsmaße** einsetzen: Levenshtein-Distanz oder phonetische Verfahren (Kölner Phonetik), mit einem Schwellenwert für die Trefferbewertung.
4. **Manuelle Prüfung** der Grenzfälle vor dem Zusammenführen, da eine fälschliche Zusammenführung zweier echter Kunden nicht mehr rückgängig zu machen ist.

**Golden Record:** der führende, bereinigte Datensatz je Realweltentität, der aus den Dubletten zusammengeführt wird. Dabei wird je Feld festgelegt, welche Quelle Vorrang hat (etwa der zuletzt gepflegte oder der vollständigste Wert); die übrigen Datensätze werden deaktiviert und ihre Beziehungen – Bestellungen, Belege – auf den Golden Record umgehängt. *(2 P)*

**D2 (10 P):** *(je Maßnahme 2 P: 1 P Maßnahme, 1 P Zuordnung zum Problem)*

| Maßnahme | Verhindert |
|---|---|
| **NOT NULL / Pflichtfeld** auf `email` | fehlende E-Mails (Datensätze 2, 7, 10) |
| **Formatprüfung / CHECK** auf `plz` (genau fünf Ziffern) | vierstellige PLZ (Datensatz 3) |
| **CHECK (umsatz >= 0)** | negativer Umsatz (Datensatz 4) |
| **CHECK (geburtsdatum < CURRENT_DATE)** sowie Untergrenze | Zukunftsdatum (Datensatz 9) und Platzhalter 01.01.1900 (3, 7) |
| **UNIQUE-Constraint** auf `email` bzw. Dublettenprüfung bei Neuanlage | exakte und unscharfe Dubletten (6 und 8) |
| **Musterprüfung des E-Mail-Formats** (Zeichen vor und nach dem @, gültige Domain) | ungültige Adresse `weber@mail` (Datensatz 4) |

*Ebenfalls anerkannt: Auswahllisten statt Freitext bei Rechtsformen; Default-Werte entfernen und stattdessen NULL zulassen; automatische Übernahme aus einem führenden System statt Mehrfacherfassung.*

**D3 (4 P):**
- **Data Owner:** trägt die **fachliche Verantwortung** für einen Datenbereich. Er legt fest, welche Qualitätsregeln und Zielwerte gelten, entscheidet über Zugriffsrechte und Freigaben und verantwortet die Datenqualität gegenüber der Geschäftsführung. Die Rolle ist im Fachbereich angesiedelt, typischerweise auf Leitungsebene. *(2 P)*
- **Data Steward:** setzt die Vorgaben **operativ** um – pflegt und bereinigt die Daten, überwacht die Kennzahlen, bearbeitet Fälle aus der Quarantäne und meldet wiederkehrende Probleme an den Data Owner. *(2 P)*

Abgrenzung in einem Satz: Der Owner **entscheidet und verantwortet**, der Steward **führt aus und überwacht**.

**D4 (4 P):**
Argumentation mit der **1-10-100-Regel**: Einen Fehler bereits bei der Erfassung zu vermeiden kostet etwa 1 Einheit, ihn später zu korrigieren rund 10, und ihn unentdeckt zu lassen rund 100 – etwa durch Fehlentscheidungen, Fehllieferungen, unzustellbare Post oder Imageschaden. *(2 P)*

Übertragen auf den Fall: Eine jährliche Bereinigung setzt erst auf der 10er-Stufe an und wiederholt sich jedes Jahr, weil die Ursache bestehen bleibt. Ein Pflichtfeld oder eine Formatprüfung kostet einmalig wenig Entwicklungsaufwand und verhindert den Fehler dauerhaft bereits an der Quelle. Zwischen zwei Bereinigungsläufen arbeitet das Unternehmen zudem bis zu zwölf Monate lang mit fehlerhaften Daten – die daraus resultierenden Fehlentscheidungen fallen in die 100er-Kategorie und übersteigen die Präventionskosten um ein Vielfaches. *(2 P)*

---

## Auswertung

| Punkte | Note | Konsequenz |
|---|---|---|
| 92–100 | sehr gut | Kernthema sitzt – Dimensionen als Karteikarte pflegen |
| 81–91 | gut | Prüfe, ob dir eher die Kennzahlen oder die Präventionsmaßnahmen fehlten |
| < 81 | | Teil 1 und 5 wiederholen, einen eigenen Datenbestand analysieren |

**Der Satz, mit dem du diesen Prüfungsbereich zusammenfassen kannst:** Datenqualität wird nicht bereinigt, sondern **sichergestellt** – durch Messung, technische Prüfregeln an der Erfassungsquelle und benannte Verantwortlichkeiten. Wer im Fachgespräch nur von Bereinigung spricht, beschreibt Symptombehandlung; wer Prävention, Kennzahl und Zuständigkeit nennt, beschreibt die Aufgabe, für die dein Beruf existiert.

---

## Zwischenstand

Mit Deep Dive 9 ist die **Vertiefung der Kernthemen** weitgehend abgedeckt. Es fehlen noch: DSGVO und IT-Sicherheit (Deep Dive 10) sowie Visualisierung und Pseudocode (Deep Dive 11). Danach folgt die Anwendung mit Projektmanagement, WiSo und den ersten vollständigen Altklausuren.

Vergiss über dem schriftlichen Stoff nicht den **Projektantrag** – er ist die Grundlage für den Prüfungsbereich „Planen und Durchführen eines Projektes der Datenanalyse“, der mit 50 % der Gesamtnote der größte Einzelposten ist (§ 32 FIAusbV), und die Frist deiner IHK liegt erfahrungsgemäß deutlich vor dem Prüfungstermin. Der Prüfungsbereich „Sicherstellen der Datenqualität“ selbst zählt 10 % (90 Minuten, schriftlich).
