# Formate der Inhaltsdateien

Kurzreferenz mit Beispielen aus `content/`. Die vollständige technische Beschreibung (Parser, Prüfungen, alle Rechen-Vorlagen)
steht in `DOKUMENTATION.md` § 4 – dort nachlesen, bevor du SQL-, Rechen- oder Diagramm-Übungen anlegst.

Inhalt: 1 Lernkarten · 2 Deep Dive (Lernblatt) · 3 Übungsklausur · 4 Lösungsdatei · 5 Begriffsseiten · 6 Übungen (Verweise)

---

## 1. Lernkarten (`AP2_FIDPA_Lernkarten.json`, `AP2_Fachbegriffe_Lernkarten.json`)

```json
{
  "meta": { "anzahl_decks": 28, "anzahl_karten": 696, "karten_nach_typ": { … }, "aktualisiert_am": "2026-10-17", "hinweise": ["…"] },
  "decks": [
    {
      "id": "st2",
      "titel": "Statistik II – Zusammenhänge & Prognosen",
      "pruefungsbereich": "…",
      "quelle": "Deep Dive 4",
      "status": "behandelt",
      "anzahl_karten": 25,
      "karten": [ … ]
    }
  ]
}
```

- `quelle` mit „Deep Dive N“ ordnet das Deck dem Thema zu (Filter, Statistik). Ohne Deep Dive (WiSo-Projektkarten, Taktik) → nur über
  den Deck-Filter erreichbar. `status`: `behandelt` (Deep Dive deckt es ab) oder `offen`.
- Neue Datei mit Karten: jede `*Lernkarten*.json` wird importiert – meist gehört eine Karte aber in ein bestehendes Deck.

**Karte** (Felder in dieser Reihenfolge, `mc` immer als letztes; der `mc`-Block hier ist nur ein Beispiel – die echte Karte hat keinen):

```json
{
  "id": "ML-048",
  "frage": "Ein Prüfling rechnet die Sigmoid-Funktion als σ(z) = 1 / (1 + e^z). Was ist falsch?",
  "antwort": "Im Exponenten fehlt das Minus: σ(z) = 1 / (1 + e^(−z)). Mit e^(+z) kommt 1 − σ(z) heraus – bei z = 0,75 also 0,32 statt 0,68.",
  "typ": "falle",
  "schwierigkeit": 2,
  "tags": ["neuronales-netz", "sigmoid"],
  "mc": {
    "richtig": "Im Exponenten fehlt das Minus: e^(−z)",
    "falsch": ["Der Nenner muss 1 − e^(−z) lauten", "Es fehlt der Faktor 2 im Zähler", "Sigmoid ist max(0; z)"],
    "erklaerung": "max(0; z) ist ReLU; 1 − e^(−z) wird für z < 0 negativ."
  }
}
```

- `frage`/`antwort` sind Markdown (fett, Listen, Tabellen gehen). Zeilen, die mit einem großgeschriebenen SQL-Schlüsselwort beginnen
  (`SELECT`, `FROM`, `WHERE`, `JOIN` …), werden automatisch zu einem SQL-Codeblock; alternativ selbst ```` ```sql ```` schreiben.
  Zeilenumbruch im JSON-String als `\n`.
- Typografie: echtes Minus `−`, Malpunkt `·`, Gedankenstrich `–`, deutsche Anführungszeichen „…“, Dezimalkomma `0,68`,
  Tausenderpunkt `9.160`.
- `begriff`-Karten (Fachbegriffe-Datei): `frage` nur der Begriff, `antwort` 1–2 Sätze, `tags: ["fachbegriff"]`. Kein Begriff doppelt,
  der schon als `wissen`-Karte definiert ist (ACID, KPI, PDCA …).
- Gute `falle`-Karte: Die Frage provoziert den typischen Fehler („Ein Prüfling rechnet …“, „Warum ist … falsch?“), die Antwort
  benennt den Fehler, die richtige Lösung und – wenn möglich – woran man ihn erkennt.
- Gute `abgrenzung`-Karte: beide Seiten nennen, das entscheidende Unterscheidungsmerkmal zuerst, gern mit Beispiel.

---

## 2. Deep Dive (`DeepDive_NN_Thema.md`)

Nur Dateien nach dem Muster `DeepDive_NN_*.md` (und die Material-Dateien) werden gelesen – Notizdateien landen nie in der App.

```markdown
# Deep Dive 9: Datenqualität sicherstellen
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz
Warum das Thema dran kommt, typische Aufgaben, der rote Faden. Szenario: **Möbelhaus Nordholz GmbH**.

---

# Teil 1 – Die Dimensionen der Datenqualität
Text …

## 2.1 Spaltenanalyse (Column Profiling)        ← Unterabschnitte unter einem „# Teil N – …“
Text …

> ❓ **Prüferfrage:** Sie haben 2.400 Dubletten bereinigt. Warum ist das allein keine ausreichende Antwort?
> *Weil die Bereinigung nur den Ist-Bestand korrigiert, nicht die Ursache. …*

## Die 8 häufigsten Fehler aus Prüfersicht

# Übungsklausur Datenqualität (100 Punkte, 90 Minuten)
… (Abschnitt 3)

## Fachgespräch: typische Fragen des Ausschusses
1. „Wie haben Sie die Qualität Ihrer Datenbasis geprüft – und was haben Sie dabei gefunden?"
2. …

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)
- [ ] Ich nenne fünf Dimensionen mit je einer Prüf- und einer Sicherungsmaßnahme.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
```

- **Prüferfrage** = Karte `kind: prueferfrage`: genau dieses Zitat-Format, Frage in der ersten Zeile, Antwort *kursiv* in der nächsten
  Zitatzeile. Sie bleibt auch im Lernblatt sichtbar (aufklappbar).
- **Fachgespräch**: nummerierte Liste unter `## Fachgespräch…` = Karten `kind: fachgespraech` (ohne Antwort; Fragen zum eigenen Projekt).
- **Lernziele**: `- [ ]` unter `## Lernziel-Check…` (abhakbar in der App).
- Kein `(KW …)` und keine persönlichen Zeitbezüge in Titeln.
- Formeln: `$…$` auf einer Zeile, `{,}` als Dezimalkomma, `\%`, `\text{…}` für Wörter. Blockformeln `$$` auf eigenen Zeilen.
- Diagramme: ```` ```svg ````-Block, nur Zeichenelemente und `dg-*`-Klassen (siehe DOKUMENTATION § 4.1 „Diagrams“ und DD17 als Vorlage).
- Rechenbeispiele im Theorieteil, die eine Rechenübung nachbildet, verweisen dort mit `quelleAufgabe: "DDn Teil 4.3"` – ihre Zahlen
  müssen zum Text passen (Smoke-Test).

---

## 3. Übungsklausur (im Deep Dive)

```markdown
# Übungsklausur Datenqualität (100 Punkte, 90 Minuten)

Situationsbeschreibung (Möbelhaus Nordholz …).

## Anlage – Auszug aus der Kundentabelle (10 Datensätze)

| Nr | kunden_id | name | email | plz |
|---|---|---|---|---|
| 1 | K-1001 | Huber GmbH | info@huber.de | 80331 |

## Block A – Dimensionen (20 P)

**A1 (15 P):** *Nennen* Sie fünf Dimensionen der Datenqualität. *Erläutern* Sie je Dimension kurz die Bedeutung und *nennen* Sie je eine Maßnahme.

**A2 (5 P):** *Erläutern* Sie den Unterschied zwischen **Gültigkeit** und **Korrektheit** und *belegen* Sie ihn mit einem Beispiel aus der Anlage.
```

- Blockpunkte = Summe der Aufgabenpunkte; alle Blöcke zusammen **100 P** (Test). Codes `A1`, `B3` … sind innerhalb der Klausur eindeutig
  und bleiben stabil (Aufgaben-ID = `<DD>-<Code>`, z. B. `09-A1`).
- Jeder Arbeitsauftrag beginnt mit einem kursiven Operator in Sie-Form. Mehrteilige Aufträge: jeder Teil mit eigenem Operator.
- Punkte passend zum Operator und zur verlangten Menge („*Nennen* Sie **sechs** …“ → 6 oder 12 P je nach Begründung).
- Anlagen (`## Anlage …`) sind Material zur Aufgabe: Tabellen, Auszüge, Diagramme – keine Lösungshinweise.

### 3a. Prüfungsformat der echten AP2 (Standard für jede Übungsklausur)

Abgeleitet aus sechs Original-Klausuren (ZPA, 2022/23: zweimal Prozessanalyse, zweimal Datenqualität, zweimal WiSo). Die Originale
sind urheberrechtlich geschützt – **nie wörtlich übernehmen**, nur Aufbau, Aufgabentypen und Niveau nachbauen (eigene Texte, eigene Zahlen,
Szenario Möbelhaus Nordholz). So sehen die Aufgaben dort aus:

**Fachteile (Prozessanalyse, Datenqualität und alle Fach-Deep-Dives): 90 Minuten, 100 Punkte**
- Ein **Kasten „Ausgangssituation“** für alle Aufgaben (Unternehmen, Vorhaben). Dann **vier Aufgaben à 20–30 P**; in der App ist jede
  Original-Aufgabe ein Block. Jeder Block beginnt mit einer **Handlungssituation** (Block-Intro, 2–6 Sätze, konkret: wer, was, welche
  Zahlen, welches Problem) – erst danach die Teilaufgaben. Teilaufgaben greifen die Situation auf („… wenden Sie diese auf die Situation an“,
  „Beziehen Sie sich dabei auf Teilaufgabe b)“).
- **Punkte je Teilaufgabe meist 2–6 P**; groß nur Modellierung (eEPK, Aktivitätsdiagramm 13–21 P), Programmieren/Pseudocode (15–20 P),
  Rechnen mit Tabelle (8–13 P), Diagrammvorlage füllen (10–12 P). Faustregel: *Nennen* 1 P je Angabe, *Beschreiben*/*Erläutern* 2 P je Punkt.
- **Menge immer ausdrücklich**: „*Nennen* Sie **drei** …“, „*Beschreiben* Sie je **zwei** Vor- und Nachteile …“. Es zählen nur so viele
  Angaben, wie verlangt sind.
- **Vorstrukturierte Antworttabellen** statt Freitext, wo das Original sie hat – Kopfzeile plus leere Zeilen, manchmal eine vorgegebene
  Beispielzeile: `Risiko | Auswirkung | Ursache`, `Stakeholder | Befürchtung | Gegenmaßnahme`, `Prozessproblem | Auswirkung |
  Verbesserungsvorschlag`, `Kriterium | SQL | NoSQL`, `Sachverhalt | zulässig/nicht zulässig | Begründung`, Vor-/Nachteil-Matrix,
  SWOT-Vierfeld, Kennzahl | Nutzen. In der App: im Text „*Tragen* Sie … in die Tabelle ein“ und die Musterlösung beginnt mit der gefüllten
  Tabelle → Antworttabelle (`werteTabelle.ts`). Die Vorlagentabelle ist die **erste** Tabelle der Aufgabe; Material gehört davor ins
  Block-Intro oder in eine Anlage. Leere Zellen bleiben leer (kein `___`). Danach `tests/editorAufgaben.test.ts` ergänzen.
- **Material in der Aufgabe**: Gesetzesauszüge (DSGVO-Artikel, BetrVG, JArbSchG, Tarifvertrag), **englische Fachtexte** (GDPR-Artikel im
  Originalwortlaut sind amtliche Texte und dürfen zitiert werden; sonstige englische Texte selbst schreiben) mit deutschen Fragen dazu,
  Klassendiagramme, Datenbankschemata mit Felderklärungen, Diagrammgerüste (Ishikawa mit den 5M und einer vorgegebenen Ursache,
  Lebenslinien eines Sequenzdiagramms, Schwimmbahnen, Entscheidungsbaum-Gerüst) – als Text oder Tabelle beschrieben.
- **Formeln** stehen in der Aufgabe (`> **Formel:** …`), wie im Original die Entropieformel.
- Operatoren wie im Original: *Nennen*, *Beschreiben*, *Erläutern*, *Erklären*, *Begründen*, *Ermitteln*, *Berechnen*, *Erstellen*,
  *Stellen* Sie … *dar*, *Vervollständigen*, *Ergänzen*, *Analysieren*, *Leiten* Sie … *ab*, *Identifizieren*, *Entscheiden*, *Prüfen*,
  *Formulieren* (SQL), *Programmieren*. Fallen in der App kursiv, im Original nicht.
- Typische Fallen im Original: Angabe passt nicht ins Schema (Feld „Wuchsform“ ohne Spalte), Daten mit Ungereimtheit (Alter 21 in Gruppe G2),
  Zusammenhänge über mehrere Teilaufgaben.

**WiSo: 60 Minuten, 30 Aufgaben, 100 Punkte** (Original 3,33 P je Aufgabe; in der App 3 bzw. 4 P, Summe 100)
- Kasten „Ausgangssituation“ (ein Unternehmen, wiederkehrende Personen), je Aufgabe 1–3 Sätze Situation, dann die Frage und
  *(Ziffer eintragen)*. Fünf Antworten; sechs, wenn „**zwei** zutreffende“ verlangt sind. Negativfragen fett: **nicht**, **auf keinen Fall**.
- Weitere Formen: Zuordnung (a–e → Ziffern 1–3), Reihenfolge (1, 2, 3 …), Rechnen mit Ergebnisfeld (Prozent, Anzahl, Uhrzeit hh:mm,
  Urlaubstage, Auftragsnummer), Gesetzes- oder Tarifauszug zum Anwenden (BetrVG § 9 Staffel, JArbSchG § 14/§ 19), Statistik-Tabelle zum
  Auswerten, Sicherheitszeichen beschrieben (Form, Farbe, Bild). Teilbewertung im Original nur bei Zuordnung, Reihenfolge und „zwei“.
- Eine kurze „Situation zu Aufgabe x und y“ darf zwei Aufgaben verbinden.

---

## 4. Lösungsdatei (`DeepDive_NN_Thema_Loesungen.md`)

```markdown
# Musterlösungen Übungsklausur Datenqualität (Deep Dive 9)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Worauf du beim Vergleichen achten sollst. 92+ P = sehr gut.

---

## Block A – Dimensionen (20 P)

**A1 (15 P):** *(je Dimension 1 P Nennung, 1 P Erläuterung, 1 P Maßnahme)*

1. **Vollständigkeit** – Alle für den Zweck erforderlichen Werte sind vorhanden. Maßnahme: Pflichtfelder (NOT NULL) …

*Prüferkommentar: Die Konsequenz ist der Punkt, der am häufigsten fehlt. …*

**C1 (12 P):** *(je Teilaufgabe 3 P: 1 P Ansatz, 1 P Rechnung, 1 P Ergebnis)*

(a) **Vollständigkeitsgrad E-Mail:** 3 von 10 Feldern leer (Datensätze 2, 7, 10)
$\frac{\text{gefüllte Felder}}{\text{alle Felder}} \cdot 100 = \frac{7}{10} \cdot 100$ = **70,00 %**

**B1 (18 P):** Erforderliche Elemente und Punktevergabe:

| Element | P |
|---|---|
| Pool „Möbelhaus Nordholz" mit **drei Lanes** | 3 |
| Startereignis in der Serviceannahme | 2 |
```

- Jede Aufgabe der Klausur braucht hier einen Eintrag mit **gleichem Code und gleichen Punkten** (sonst Importhinweis).
- Punkte im Text: `*(3 P)*` am Zeilenende → Punkte-Abzeichen; längere Hinweise `*(je 4 P: …)*`.
- Eine Tabelle `| Element | P |` wird in der App zur Checkliste für die Selbstbewertung – gut für Modellierungs- und Aufzählungsaufgaben.
- `*Prüferkommentar: …*` als eigener Absatz → Kasten „Prüferkommentar“: typische Fehler, was für volle Punkte nötig ist.
- Rechenergebnis **fett hinter** der Formel, mit Einheit (`= **70,00 %**`) → Ergebnis-Kasten. Labels ohne Doppelpunkt im Fettdruck
  (`**F1** = $…$`, nicht `**F1:**` – das würde als Lösung der Aufgabe F1 gelesen).

---

## 5. Begriffsseiten (`Begriffsseiten_<A–Z>.md`)

```markdown
## Machbarkeitsstudie
<!-- id: machbarkeitsstudie · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Definition in einem Satz (Klartext, keine $-Formeln in der Definition).

### Erklärung
### Beispiel
### Abgrenzung
| Instrument | Frage |
|---|---|
### Prüfungsfalle
### Merksatz

Siehe auch: Wirtschaftlichkeitsbetrachtung · Nutzwertanalyse · Lastenheft
Mehr: Deep Dive 12, Teil 2
```

- Die `id` muss zu einem Glossar-Eintrag passen (meist die `FB-…`-Karte ohne `FB-`); ids eindeutig.
- „Siehe auch“: nur Begriffe, die selbst eine Seite haben (sonst Importhinweis). „Mehr:“ zeigt auf einen Abschnitt
  (`Deep Dive 5, 6.5`, `Deep Dive 5, Teil 3`, `Deep Dive 11, A3`).
- In Erklärung/Beispiel sind `$…$`-Formeln erlaubt (die Seite rendert mit KaTeX).
- Abgrenzung + „Siehe auch“ liefern im Leicht-Modus die falschen Antworten für die Begriffskarte – nah verwandte Begriffe wählen.

---

## 6. Übungen – nur Verweise

| Datei | Wichtigste Regeln | Nachlesen |
|---|---|---|
| `AP2_SQL_Uebungen.json` | id `SQL-MH-NNN` (moebelhaus), `SQL-DF-NNN` (datafit), `SQL-DQ-NNN` (kundenimport), `loesung` muss im Datensatz laufen, `vergleich` passend, optional `aufgaben`/`karten` verknüpfen | DOKUMENTATION § 4.3, § 7 |
| `AP2_Rechen_Uebungen.json` | id `RE-<BEREICH>-NNN`, möglichst mit `vorlage` + `daten`; feste Zahlen müssen die Musterlösung reproduzieren (`quelleAufgabe`) | DOKUMENTATION § 4.4 (Tabelle aller Vorlagen) |
| `AP2_Diagramm_Uebungen.json` | jede Lücke in `loesung`, Lösung verletzt keine Formregel | DOKUMENTATION § 4.4b |
| `AP2_Quellen.json` | nur https, `ziel` muss existieren, `geprueft` = `JJJJ-MM`; Links mit `npm run quellen-pruefen` testen | DOKUMENTATION § 4.4c |

Bestehende Einträge derselben Art sind die beste Vorlage: eine ähnliche Übung suchen und deren Aufbau übernehmen.
