# AP2 Lern-App – Content formats

> Part of the technical documentation (section 4). Overview: [DOKUMENTATION.md](../DOKUMENTATION.md).

## 4. Content

### 4.1 Learning sheets (Markdown)

| File | Parsed into |
|---|---|
| `DeepDive_NN_Thema.md` | `Topic`: theory sections (`# Teil …`, `## 1.1 …`), `lernziele` (`- [ ]` under `## Lernziel-Check…`), flashcards from Prüferfragen and Fachgespräch, `Exam` from `# Übungsklausur … (100 Punkte, 90 Minuten)` (the „NN Minuten“ in this heading is the timer duration – WiSo 60, otherwise 90; without it 90) with blocks `## Block A – Titel (19 P)` and tasks `**A1 (6 P):** …`, attachments (Anlagen) |
| `DeepDive_NN_Thema_Loesungen.md` | `Solution` per task (`**A1 (6 P):**`), `kommentar` from `*Prüferkommentar: …*`, `criteria` from a points table `| Element | P |` |
| `DeepDive_17_Glossar_Diagramme.md` | reference topic **without** Übungsklausur and Lösungsdatei: every diagram type as an SVG example (Teil 1–6) and the placeholder `<!-- glossar-a-z -->` (Teil 7), which `loadContent` replaces with the whole glossary (see Glossar below). Edit it like any sheet; the SVG code sits directly in the file |
| `Deep_Dive_SQL_KW28_29.md` | extra topic (id `00`), solutions inside the sheet; keep the file name (SQL links depend on it) |
| `Lernzettel_Kernthemen.md`, `AP2_Themenliste_und_Beispielfragen.md`, `AP2_SQL_Belegsatz.md` | `MaterialDoc` (Material page); the Belegsatz (id `sql-belegsatz`) also has its own page and the SQL-editor panel (plan phase 6) |
| `Begriffsseiten_<A–Z>.md`, `Begriffsseiten_0-9.md` | `BegriffsSeite[]` (term pages, plan phase 3): **not** in `content.json`, but in `begriffe.json`; `content.begriffe` holds only the index (id, term, variants) |
| everything else (`Lernplan_*.md`, `Prompt_*.md`, `Ideen.md`, `Begriffsseiten_Hinweise.md`, plan/measurement notes …) | **not read**: `isContentFile` is an **allow-list** (`INHALT_MD` in `build/inhalt.ts`: `DeepDive_NN_*.md`, `Deep_Dive_SQL*.md`, `Lernzettel_Kernthemen.md`, `AP2_Themenliste*.md`, `AP2_SQL_Belegsatz.md`, `Begriffsseiten_<Buchstabe>.md` + the JSON patterns incl. `AP2_Quellen.json`) – notes in the folder never end up in the app |

- **Prüferfragen**: `> ❓ **Prüferfrage:** Frage` with the italic answer in the next quote line → `Flashcard{kind:'prueferfrage'}`.
  They also remain inside the section Markdown, so they show up in the Lernen view. `domain/prueferfragen.ts` reads the block
  (`readPrueferfrage`, used by the parser) and splits/strips it for the Lernen view (`splitPrueferfragen`, `stripPrueferfragen`).
- **Fachgespräch**: numbered list under `## Fachgespräch…` → `Flashcard{kind:'fachgespraech'}`.
- A trailing `(KW …)` in a sheet or section title is removed (`stripKw`); there is no calendar week in the data model any more.
  The sheets themselves no longer contain personal time references ("am Ende des Themas" instead of "am Ende von KW 31").
- Problems (task without solution etc.) are collected as `ImportIssue`s and shown on *Daten & Import* / `npm run import-report`.
- **Sheets without Übungsklausur**: allowed if there is no `_Loesungen.md` (otherwise "Kein Abschnitt „Übungsklausur" gefunden"). A level-2
  `## Fachgespräch…` / `## Lernziel…` heading then starts the appendix, so cards and Lernziele work as usual. The Lernen page hides
  Übungsklausur and Einzelaufgaben for such topics; `tests/inhalte.smoke.test.ts` lists them in `NACHSCHLAGEN`.
- **Diagrams**: a ```` ```svg ```` block holds a hand-drawn SVG that `<Markdown>` shows as `<figure class="diagramm">` (inline, so it works
  offline and in print). `domain/svgDiagramm.ts` (`pruefeSvg`) allows only drawing elements (`svg g defs marker path line polyline polygon rect
  circle ellipse text tspan title desc`) and drawing attributes – no scripts, events, links, `style`, comments or external `url(…)`; a block that
  fails is shown as code and reported as ImportIssue (`pruefeDiagramme`), as is an `id` used twice (markers are page-wide). Colours only via
  classes from `src/styles/` (`dg-linie`, `dg-form`, `dg-grau`, `dg-akzent`, `dg-gut`, `dg-mittel`, `dg-rot`, `dg-voll`, `dg-linie-akzent`,
  `dg-strich`, `dg-dick` …; text: `dg-klein`, `dg-fett`, `dg-leise` …), so light, dark and print mode work. The search ignores SVG markup.
- **Data charts**: a ```` ```diagramm ```` block holds plain data (`typ` linie/saeulen/gestapelt/pareto, `titel`, `x`, `y`, `kategorien`,
  `reihe: Name | 1; 2; …`, optional `y-min`, `y-max`, `schritt`, `werte`, `punkt`) instead of SVG. `domain/datenDiagramm.ts` (`leseDiagramm`)
  parses it (German numbers, the written text of every value is kept for labels and table), `src/components/DatenDiagramm.tsx` draws it
  as inline SVG at the container's real width (ResizeObserver, readable on phones), colours via `--accent/--mid/--good/--low` (light/dark/print),
  plus a `<details>` value table for screen readers. Allowed everywhere Markdown is rendered (sections, tasks, attachments, solutions);
  `pruefeDiagramme` reports broken blocks as ImportIssue, the search indexes only the title. Use it whenever a task or solution would
  otherwise describe a chart's values in words.

### 4.2 Flashcards `AP2_FIDPA_Lernkarten.json`

```json
{ "meta": { "hinweise": ["…"] },
  "decks": [ { "id": "sql", "titel": "SQL", "pruefungsbereich": "…", "quelle": "Deep Dive 1", "status": "behandelt",
               "karten": [ { "id": "SQL-001", "frage": "…", "antwort": "…", "typ": "wissen", "schwierigkeit": 1, "tags": ["join"] } ] } ] }
```

- Currently 28 decks and 696 cards (typ: wissen 256, falle 93, abgrenzung 82, anwendung 62, rechnung 46).
- **Term cards** `AP2_Fachbegriffe_Lernkarten.json` (same format, any `*Lernkarten*.json` is imported): 16 decks `fb01`–`fb16`, one per Deep Dive,
  802 cards with `typ: "begriff"` – `frage` is just the term, `antwort` a one- or two-sentence explanation, ids `FB-<term-slug>` (stable,
  independent of order). Terms already defined by a `wissen` card (ACID, KPI, PDCA …) are not repeated. In the app: Typ filter „Fachbegriff“
  (`/karteikarten?typ=begriff`), Leicht-Modus with automatic answers (`begriff` is in `LEICHT_TYPEN`), and the glossary uses them first.
- `quelle` containing "Deep Dive N" maps the deck to a topic; decks without one (WiSo, project work) are reachable via the deck filter.
- Progress is keyed by card `id`. **Never change IDs.**
- Optional **`mc`** block per card for the Leicht-Modus (phase 6): `{ "richtig": "…", "falsch": ["…", "…", "…"], "erklaerung"?: "…" }`.
  Validated by `KartenMcSchema` / `pruefeMc` (`domain/lernkarten.ts`): exactly 3 `falsch`, pairwise distinct and none equal to `richtig`
  (compared with `mcNorm`: case, whitespace and a final full stop ignored). An invalid block → ImportIssue, the card is imported without `mc`.
  Today no card has `mc`; the Leicht-Modus uses the automatic fallback (§ 5).

The AI authoring helper for `mc` (`npm run mc-entwurf` / `mc-uebernehmen`) was removed with the local mode; write `mc` blocks by hand.

### 4.3 SQL exercises `AP2_SQL_Uebungen.json`

```jsonc
{
  "meta": { "version": "1.0", "hinweise": ["…"] },
  "datensaetze": [ { "id": "moebelhaus", "titel": "Möbelhaus Nordholz GmbH", "quelle": "Deep Dive 1",
                     "beschreibung": "…", "setup": "PRAGMA foreign_keys = ON; CREATE TABLE …", "variante": "UPDATE …" } ],
  "uebungen": [ {
    "id": "SQL-MH-008", "datensatz": "moebelhaus", "thema": "Deep Dive 1", "titel": "Umsatz je Kunde",
    "aufgabe": "…", "schwierigkeit": 3, "tags": ["join", "group by"],
    "loesung": "SELECT …",
    "vergleich": { "reihenfolge": "auto", "spaltennamen": ["name", "umsatz"], "toleranz": 0.005 },
    "pruefabfrage": null, "leerErlaubt": false,
    "hinweise": ["…", "…"], "erklaerung": "…", "quelle_aufgabe": "DD1 Übungsklausur B8",
    "aufgaben": ["01-B8"], "karten": ["SQL-011"], "teilaufgabe": false, "spalten_frei": false
  } ]
}
```

Currently 5 datasets (`moebelhaus`, `datafit`, `kundenimport`, `holzlager` for the DD29 exam, `eventlager` for the DD31 exam) and 80 exercises; 33 tasks and 46 cards are linked.
IDs: `SQL-MH` (moebelhaus), `SQL-DF` (datafit), `SQL-DQ` (kundenimport), `SQL-HL` (holzlager), `SQL-EL` (eventlager). SQLite has no `STDDEV()`: SQL-EL-002 uses
`SQRT(AVG(x * x) - AVG(x) * AVG(x))` and says so in the task text.

- **Links** (optional, `domain/sqlUebungen.ts` → `verknuepfeSqlUebungen`, run in `buildContent`): `aufgaben` = task ids from the
  Lernblätter that are answered **in the SQL editor** with this exercise (sets `Task.sqlUebung`; a task may belong to only one
  exercise); `karten` = card ids whose back shows „Im SQL-Editor üben: …“ (`Flashcard.sqlUebungen`). Unknown ids or a task linked
  twice → ImportIssue, link skipped. Tasks that ask to *predict* a result (DD1 A2/C1, DataFit W2) stay text tasks on purpose.
- `teilaufgabe`: the exercise covers only part of the task (A3/C7: name and justify the errors, then correct) – no full points
  automatically; reasons go into SQL comments (`-- Fehler 1: …`). `spalten_frei`: the task text does not prescribe columns
  (`SELECT *`, `COUNT` without alias) – when grading the task, columns are matched by content (`CompareOptions.spaltenFrei`,
  `src/sql/checker.ts`): names and column order don't count, extra columns are allowed, rows and their order still do. Both
  only with `aufgaben` (else ImportIssue); the exercise page itself always compares strictly.

### 4.4 Rechenübungen `AP2_Rechen_Uebungen.json`

Calculation exercises with automatic checking. Most use a **template** (`vorlage`, code in `src/rechnen/vorlagen/`) that computes
the results, the worked solution (Rechenweg) and typical wrong values (Fehlerbilder) from the exercise's `daten`, and can generate
new numbers ("🎲 Neue Zahlen"). Exercises without a template give their solutions directly.

```jsonc
{
  "meta": { "version": "1.0", "hinweise": ["…"] },
  "uebungen": [ {
    "id": "RE-ST1-001",              // stable, unique, pattern RE-<AREA>-<NNN>; progress is keyed by it – never change
    "thema": "Deep Dive 3",          // "Deep Dive N" → topicId (filter "Thema"); WiSo = "Deep Dive 14" etc.
    "titel": "Mittelwert, Median und Modus",
    "schwierigkeit": 1,              // 1 Basis · 2 Standard · 3 Transfer
    "tags": ["lagemaße", "median"],  // lower case, German; reuse existing tags (list filter)
    "vorlage": "lagemasse",          // template id (table below); omit for a fixed exercise
    "daten": { "werte": [60, 40, 220, 45, 35, 90, 55, 40, 70, 50, 65], "einheit": "min" },  // shape depends on the template
    "params": { "n": 9 },            // optional: generator parameters for "Neue Zahlen" (per template, see table)
    "neueZahlen": true,              // optional, default: true with a template, always false without
    "aufgabe": "Bearbeitungsdauer von {{n}} Reparaturaufträgen (in Minuten): {{werte}}.\n\nBerechne …",  // Markdown + {{placeholders}}
    "eingaben": ["mittel", "median", { "id": "modus", "label": "Modus (häufigster Wert)" }],
    "hinweise": ["Sortiere die Werte zuerst.", "n = {{n}} …"],   // graded hints, placeholders allowed; empty → template hints
    "erklaerung": "optional, Markdown with $…$ formulas, shown with the solution",
    "quelleAufgabe": "DD3 Übungsklausur C1"                       // "DDn Übungsklausur X1", "X1/X3" or "X1–X3"
  } ]
}
```

**Rules**
- `daten` given → these numbers are the "Originalzahlen". `daten` omitted → numbers are generated from a seed derived from the id (stable).
  With "Neue Zahlen", `erzeuge(seed, params, daten)` creates new data **in the shape of `daten`** (same number of values, same names,
  same network structure, same options like costs or church tax). So a fixed exercise from a sheet automatically gets sensible variants.
- `eingaben`: which results are asked, in this order. A string is a result id of the template; an object can override
  `label`, `einheit`, `runden` (0–6 decimals; tolerance = half a unit of the last digit) and `toleranz` (absolute). Empty/omitted →
  every non-`zusatz` result of the template (column "asked by default" below). `zusatz` results (marked *) are only asked when listed.
  Results without `runden` are compared exactly (counts, integers, money already in cents).
- Text results (`vergleich: text`) accept a distinctive part ("Süd" for "Filiale Süd", "B" for "Anbieter B", ja/nein variants);
  sets (`menge`, critical path) ignore order and separators; lists (`liste`, outliers) are entered as `19; 220` or `keine`.
- Placeholders `{{name}}` in `aufgabe` and `hinweise` are replaced with the template's values in German number format
  (column "Placeholders"). An unknown placeholder is an import error. Without a template, placeholders are not allowed.
- **Without template**: every entry in `eingaben` is an object with `loesung` (number, text or number list) and normally `einheit`/`runden`;
  `neueZahlen` is always false and `hinweise` should not be empty. Example: `RE-WI-006` (JArbSchG).
- Import check (`src/rechnen/pruefen.ts`, ImportIssue on *Daten & Import* and in `npm run import-report`, exercise skipped): unknown template,
  `daten` not matching the template's zod schema, unknown result id in `eingaben`, non-finite result, unknown placeholder – with the fixed
  data and, if "Neue Zahlen" is offered, with five seeds. `tests/rechenInhalte.smoke.test.ts` additionally tries 100 seeds per exercise and checks
  that every fixed exercise with `quelleAufgabe` reproduces the numbers of that task's model solution in `content/`.
- Units: `daten.einheit` (where the template has it) sets the unit of all results of a value list; `%`, `€`, `h`, `Tage`, `GB` are set by the template.
- Quartiles follow the **sheet convention** (DD3 4.2): position = n · p; not an integer → round up and take that value; integer → mean of
  that and the next value. Variance: `art` decides ÷ n (`grundgesamtheit`) or ÷ (n − 1) (`stichprobe`) – the exercise text must say which.

**Templates** (id → `daten` shape, results; `*` = `zusatz`, only when listed; params for "Neue Zahlen"; placeholders).
Ids with a running number (`rel1`, `FAZ_A`, `teil1_2`) follow the data order given in brackets.

| Template id | `daten` | Results (asked by default unless `*`) | `params` | Placeholders |
|---|---|---|---|---|
| **Statistik I** (DD3) | | | | |
| `lagemasse` | `{ werte: number[3–40], einheit? }` | `mittel` (r2), `median` (r2), `modus` (number, or list if several), `spannweite`, `summe*`, `minimum*`, `maximum*` | `n`, `min`, `max`, `schritt`, `ausreisser` (bool) | `werte`, `werteSortiert`, `n` |
| `gewichtetes-mittel` | `{ gruppen: [{ anzahl, wert }] (2–10), einheit? }` | `mittel` (r2), `summeGewichte*`, `summeProdukte*` | `gruppen` (count) | `gruppen`, `anzahlN`, `wertN` (N = 1…), `gesamt` |
| `quartile` | like `lagemasse` | `q1`, `q3`, `iqr`, `zaunUnten`, `zaunOben` (r2), `ausreisser` (list), `median*`, `whiskerUnten*`, `whiskerOben*` | like `lagemasse` | like `lagemasse` |
| `varianz` | `{ werte: number[2–30], art: "grundgesamtheit"\|"stichprobe", einheit? }` | `varianz`, `stdabw` (r2), `mittel*`, `saq*` (unit²) | `n`, `min`, `max`, `art` | `werte`, `werteSortiert`, `n`, `art` (σ²/s²), `artLang` |
| `variationskoeffizient` | `{ gruppen: [{ name, mittel, stdabw }] (1–6), einheit? }` | `vkN` (% r2, N = group), `gleichmaessiger` (text, only with ≥ 2 groups) | `gruppen` | `nameN`, `mittelN`, `stdabwN` |
| `haeufigkeiten` | `{ kategorien: [{ name, h (int) }] (2–12), schwelle? (default 80) }` | `relN`, `kumN` (% r1; N = rank after sorting **descending**), `anzahlSchwelle` (categories until `schwelle` %), `n*`, `modus*` (text) | `kategorien`, `n` | `n`, `kategorien`, `schwelle` |
| **Statistik II** (DD4) | | | | |
| `korrelation` | `{ x: number[3–20], y: number[3–20], xName?, yName?, einheitY? }` | `xMittel`, `yMittel`, `sxy`, `sxx`, `syy`, `r` (r2), `r2*` | `n` (only without `daten`) | `x`, `y`, `n` |
| `regression` | like `korrelation` + `prognose?: number[≤5]` (x values) | `b`, `a` (r2), `prognoseN` (r2, one per `prognose` x), `xMittel*` … `syy*`, `yDachN*`, `residuumN*` (N = data point), `r*`, `r2*` | `n` | `x`, `y`, `n`, `prognoseXN` |
| `gleitender-durchschnitt` | `{ werte: number[3–40], k: 2–12 (default 3), anzahl?, einheit? }` | `gd1` … `gdM` (r2; M = `anzahl` or n − k + 1) | `n`, `k` | `werte`, `k`, `n`, `anzahl` |
| `prozent-veraenderung` | `{ alt ≠ 0, neu, einheit? }` (`einheit: "%"` → difference in Prozentpunkte) | `differenz`, `prozent` (% r2), `faktor*` (r4) | `art: "quote"` (small values) | `alt`, `neu` |
| **Modellgüte / CRISP-DM** (DD6, DD7) | | | | |
| `konfusionsmatrix` | `{ tp, fp, fn, tn (int), kostenFN?, kostenFP?, positiv? (class name) }` | `accuracy`, `precision`, `recall`, `f1`, `spezifitaet` (% r2), `trivialAccuracy*`, `trivialRecall*`, `n*`; with both costs: `kostenModell`, `kostenTrivial` (€), `ersparnis*` | `positive`, `negative`, `kosten` (bool) | `tp`, `fp`, `fn`, `tn`, `n`, `positive`, `kostenFN`, `kostenFP`, `positiv` |
| `regressionsguete` | `{ y: number[2–30], yDach: number[same length], einheit? }` | `mae`, `rmse` (r2), `mse*`, `summeBetraege*`, `summeQuadrate*`, `r2*` | `n` | `y`, `yDach`, `n` |
| `assoziation` | `{ transaktionen: string[][] (2–40), wenn: string[], dann: string[] }` | `support`, `konfidenz` (% r2), `lift` (r2), `support_<Artikel>*` (%, non-letters → `_`), `supportWenn*`, `supportDann*`, `anzahlGemeinsam*` | `n` | `wenn`, `dann`, `n`, `regel` |
| `kmeans` | `{ punkte: [x, y][2–20], zentren: [x, y][2–5] }` | `abstandI_J` (r2, point I to centre J), `clusterI` (number of the centre), `zentrumJx`, `zentrumJy` (r2) | `n` | `punkte`, `zentren`, `k` |
| `knn` | `{ punkte: [x, y][3–20], klassen: string[same length, ≥ 2 distinct], neu: [x, y], k (1–15, < n) }` | `abstandI` (r2, point I to the new case), `nachbarn` (menge, "P3, P2, P5" by distance; ties → lower number), `klasse` (text; vote tie → class of the nearest tied neighbour), `stimmen_<Klasse>*` | `n`, `k` | `punkte` (with class), `neu`, `k`, `n`, `klassen` |
| `neuron` | `{ x: number[1–5], w: number[same length], b, f: "stufe"\|"sigmoid"\|"relu" }` | `z` (r2, Σ wᵢxᵢ + b), `y` (stufe r0, sigmoid/relu r2) | `n`, `f` | `eingaben`, `gewichte`, `bias`, `funktion`, `n` |
| `perzeptron` | `{ x: number[1–5], w, b, t: 0\|1, eta (0–1] }` (step function, y = 1 for z ≥ 0) | `y`, `e` (t − y), `w1` … `wN`, `bNeu` (r2), `z*` (r2) | `n` | `eingaben`, `gewichte`, `bias`, `soll`, `eta`, `n` |
| `id3` | `{ merkmale: string[1–5], ziel?, zeilen: string[][4–24] (one value per feature, class last, ≥ 2 classes) }` | `entropie` (r3), `gewinnJ` (r3, information gain of feature J), `wurzel` (text, feature with the largest gain), `entropieJ_V*` (r3, value V in order of first occurrence), `restJ*` (r3, weighted entropy) | – (keeps features, values and n of the data; without `daten` the DD6 7.4 example gives the shape) | `n`, `ziel`, `merkmale`, `klassen` |
| **Prozessanalyse / Wirtschaftlichkeit** (DD5, DD12) | | | | |
| `durchlaufzeit` | `{ schritte: [{ name, bearbeitung, liege }] (1–15), einheit? (default "h") }` | `bearbeitung`, `liegezeit`, `durchlaufzeit` (r2), `wertschoepfung` (% r2) | `schritte` (count) | `einheit` |
| `fehlerquote` | `{ gesamt (int), fehler (int ≤ gesamt), nacharbeitJe? (h), kostensatz? (€/h) }` | `fehlerquote`, `fpy` (% r2); with both optional fields: `nacharbeitskosten`, `zuschlag` (€ r2), `nacharbeitZeit*` | `gesamt`, `kosten` (bool) | `gesamt`, `fehler`, `nacharbeitJe`, `kostensatz` |
| `amortisation` | `{ investition, einsparung? \| (auftraege + minutenJeAuftrag + kostensatz), nutzungsdauer? }` | `amortisation` (Jahre r2), `amortisationMonate*`; from orders: `stunden`, `einsparung` (else `einsparung*`); with `nutzungsdauer`: `roi` (% r2), `gesamtersparnis*`, `gewinn*`, `roiJahr*` | `auftraege` (bool) | `investition`, `einsparung`, `auftraege`, `minutenJeAuftrag`, `kostensatz`, `nutzungsdauer` |
| `fmea` | `{ fehler: [{ name, a, b, e }] (1–8, each int 1–10), schwelle? (int) }` | `rpzN` (A · B · E), `hoechstes` (text); with `schwelle`: `anzahlKritisch` (count with RPZ ≥ schwelle) | – | `fehler`, `schwelle`, `anzahl` |
| `break-even` | `{ fixkosten, preis > variabel, variabel, menge? }` | `db` (€ r2), `breakEven` (Stück, rounded **up**), with `menge`: `gewinn` (€) | – | `fixkosten`, `preis`, `variabel`, `menge` |
| **Datenqualität** (DD9) | | | | |
| `qualitaetsgrad` | `{ kennzahlen: [{ id, name, gut (int), gesamt (int) }] (1–10) }` | one result per kennzahl `id` (% r2) | – | `gesamt`, `name_<id>`, `gut_<id>`, `gesamt_<id>`, `schlecht_<id>` |
| **Projektmanagement** (DD12) | | | | |
| `netzplan` | `{ vorgaenge: [{ id (1–4 chars), name?, dauer, vorgaenger: id[] }] (2–15), einheit? (default "Tage") }`, start = 0 | `FAZ_<id>`, `FEZ_<id>`, `SAZ_<id>`, `SEZ_<id>`, `GP_<id>`, `FP_<id>`, `projektdauer`, `kritischerPfad` (menge) – entered as a table | `dauerMin`, `dauerMax` | `vorgaenge`, `einheit` |
| `nutzwert` | `{ kriterien: [{ name, gewicht }] (2–10, sum 100), alternativen: [{ name, punkte: number[per criterion] }] (2–5) }` | `teilA_K` (r2, alternative A, criterion K), `nutzwertA` (r2), `beste` (text) | – | `kriterien`, `alternativen` |
| `risiko` | `{ risiken: [{ name, w, s }] (1–10) }` | `rpzN`, `hoechstes*` (text) | – | `risiken` |
| `pert` | `{ vorgaenge: [{ name, o, m, p }] (1–8, o ≤ m ≤ p), einheit? (default "Tage") }` | `teN` (r2, (o + 4m + p) / 6), with ≥ 2 packages `summe` (r2) | `vorgaenge` (count) | `nameN`, `oN`, `mN`, `pN`, `anzahl`, `einheit` |
| **WiSo** (DD14) | | | | |
| `sozialversicherung` | `{ brutto, zusatzbeitrag, kinderlos, azubi?, lohnsteuer?, kirchensteuersatz?, soli?, saetze? }` (rates of the sheet in `SAETZE`: KV 14,6 %, PV 3,6 % + 0,6 % kinderlos, RV 18,6 %, ALV 2,6 %, Geringverdiener 325 €; `saetze` overrides) | `kv`, `pv`, `rv`, `alv`, `sv` (€ r2, each rounded to cents), `svSatz*`; with `lohnsteuer`: `kirchensteuer`, `netto` | `brutto` | `brutto`, `zusatzbeitrag`, `kinderlos`, `lohnsteuer`, `kirchensteuersatz` |
| `minijob` | `{ grenze, stundenlohn }` | `stunden` (rounded down), `verdienst*` (€) | – | `grenze`, `stundenlohn` |
| `gleichgewicht` | `{ zeilen: [{ preis, nachfrage, angebot }] (2–12), one row with nachfrage = angebot }` | `preis` (€), `menge*` | `zeilen` | `tabelle` |
| **Verfügbarkeit** (DD16) | | | | |
| `verfuegbarkeit` | `{ stunden (operating time, e.g. 720 or 8760), sla (% 0–100), ausfall (h ≤ stunden) }` | `erlaubt` (h r2), `verfuegbarkeit` (% r3), `eingehalten` (ja/nein), `erlaubtMin*` (min r1) | – | `stunden`, `sla`, `ausfall` |
| `mtbf` | `{ mtbf, mttr, stunden? (default 8760) }` | `verfuegbarkeit` (% r3, MTBF / (MTBF + MTTR)), `ausfallJahr` (h r2) | – | `mtbf`, `mttr`, `stunden` |
| `systemverfuegbarkeit` | `{ komponenten: [{ name, v (%), anzahl? (1–4 identical in parallel) }] (1–6, in series) }` | `gesamt` (% r3), `stufeN*` (% r3, 1 − (1 − V)ⁿ), `ausfallJahr*` (h r2) | – | `komponenten`, `anzahl` |
| **Datensicherung** (DD10) | | | | |
| `datensicherung` | `{ voll, aenderung (per day), tage (1–30), einheit? (default "GB") }` | `volumenInkrementell`, `volumenDifferenziell`, `medienInkrementell`, `medienDifferenziell` | – | `voll`, `aenderung`, `tage`, `einheit` |
| `rpo` | `{ sicherungUm (0–24, 22.5 = 22:30), ausfallUm (next day if earlier), rpo? (h) }` | `verlust` (h r2), with `rpo`: `eingehalten` (ja/nein) | – | `sicherungUm`, `ausfallUm`, `rpo` |

`(r2)` = rounded to 2 decimals by default; every result has a default label and unit, which `eingaben` can override.
The exact ids for given data are easiest to see in the solution table of the exercise page or with
`VORLAGEN[id].loese(VORLAGEN[id].schema.parse(daten)).felder` (e.g. in a Vitest test). Look at `content/AP2_Rechen_Uebungen.json`
for worked examples. **Content today: 122 exercises** – 86 fixed (70 with a template, 16 without: JArbSchG/BUrlG/Reallohn, normal distribution, expected value and the calculations of the Altklausur-Training DD27–DD33) and 36 generated
(no `daten`, one per template). Fixed exercises cover every calculation task of the sheets: the Übungsklausur tasks (`quelleAufgabe`
"DDn Übungsklausur X1") and the calculation examples in the theory parts (`quelleAufgabe` "DDn Teil 4.3" etc. – the smoke test then
looks for the numbers in the theory sections of that sheet). Per sheet: DD3 19, DD4 12, DD5 11, DD6 12, DD7 7, DD9 3, DD10 4, DD11 1, DD12 13,
DD13 3, DD14 10, DD16 10, DD27 1, DD28 3, DD29 1, DD30 1, DD31 2, DD32 3, DD33 2. IDs: `RE-ST1`/`ST2` (DD3/DD4), `MG` (DD7), `ML` (DD6), `PA` (DD5), `DQ` (DD9), `VI` (DD11), `PM` (DD12), `WI` (DD13/DD14),
`IT` (DD10), `QS` (DD16); the file is sorted in this order. Not included (no arithmetic or no number to check): pure lookups in DD13 (Pausen B1/B5,
Betriebsrat D1, Günstigkeitsprinzip E3), Kündigungstermine (dates), DD11 algorithm/pseudocode tasks.

**New template**: file in `src/rechnen/vorlagen/`, defined with `vorlage({ id, titel, bereich, beschreibung, schema, erzeuge, loese, platzhalter,
tabelle?, hinweise })`; `loese` uses `LoesungsBau` (`wert`, `schritt`, `fehler`, `fertig(layout?)`). Register it in `vorlagen/index.ts`,
add it to the table above, add a sheet example to `tests/rechenVorlagen.test.ts`; the property tests (`tests/rechenEigenschaften.test.ts`)
pick it up automatically. Add at least one formula with the template id in `vorlagen` to `src/rechnen/formeln.ts` and use
`F.<id>.latex` as the step `formel` where the general formula appears as is (`tests/formeln.test.ts` checks both).

### 4.4c JSON-Übungen `AP2_Json_Uebungen.json`

Write JSON as text. `{ meta, uebungen: [{ id, titel, stufe 1–3, topicId?, aufgabe (Markdown, "Sie"-form with an operator in italics), vorgabe?
(prefilled text, e.g. faulty JSON to correct), loesung (JSON as text), pruefungen: [{ pfad, typ? | wert? | laenge? | schluessel? | fehlt?,
hinweis? }], hinweise[], erklaerung?, tags[] }] }`. `domain/jsonUebungen.ts`: `pruefeJsonSyntax` is an own strict RFC 8259 parser (line/column and German hints
for single quotes, trailing comma, missing comma, unquoted key, decimal comma, leading zero, `True`/`undefined` …); `pruefeJsonAntwort` then checks the rules
against the parsed value – paths like `positionen[0].menge`, type and value must match exactly (`"false"` is not `false`), numbers with a tiny tolerance –
so key order and indentation are free. The importer skips (and reports) an exercise whose `loesung` is not valid JSON or fails its own rules, or whose
`vorgabe` already satisfies them. Pages `/json` and `/json/:id` (`src/pages/JsonUebungen.tsx`, `JsonUebung.tsx`): textarea with Tab → two spaces, live status,
Prüfen / Hinweis / Lösung zeigen; progress `json` (§ 6) with the repetition of the other exercises (`src/lib/jsonUebungen.ts`). Not (yet) part of "Heute lernen".

### 4.4d XML-Übungen `AP2_Xml_Uebungen.json`

Counterpart of the JSON-Übungen. `{ meta, uebungen: [{ id (XML-NNN), titel, stufe 1–3, topicId?, art: "dokument" | "xpath", aufgabe (Markdown, "Sie"-form,
operator *Erstellen* / *Prüfen* / *Formulieren*), dokument? (only `xpath`: the XML the expression runs on, shown under the task), vorgabe? (prefilled text,
e.g. a not well-formed document), loesung (XML document resp. XPath expression), alternativen? (`xpath`: further correct expressions, shown with the
solution and checked by the importer), pruefungen: [{ xpath, wert? | anzahl? | fehlt?, text?, hinweis? }] (only `dokument`), hinweise[], erklaerung?,
tags[] }] }`.

`domain/xml.ts` is pure (no DOM): `pruefeXmlSyntax` checks well-formedness with German messages and line/column (missing end tag, wrong nesting, case,
two root elements, unquoted or duplicate attribute, `&`/`<` in text, declaration not first …; reine Einrückung is not text), and `werteXpath` evaluates
XPath 1.0 as far as an exam needs it (`/`, `//`, `*`, `@`, `text()`, `node()`, `.`, `..`, axes, predicates with position/comparison, `and`/`or`, arithmetic,
`|`, count/sum/contains/starts-with/last/position/not/… with German syntax errors such as `==`, `&&`, decimal comma, typographic quotes).
`domain/xmlUebungen.ts`: a `dokument` answer must be well-formed and satisfy every rule; a rule is an XPath expression with an expectation – `wert`
compares the text of the first match (whitespace collapsed, numbers numerically, with a hint for decimal comma), `anzahl` the number of matches,
`fehlt` that nothing matches; without expectation the path must exist. If `/a/@x` is missing but `/a/x` exists (or vice versa), the message says
"element instead of attribute". `text` replaces the XPath in the display. An `xpath` answer is right when it yields the same as the model solution,
compared by text values (so `/kunde/name` and `/kunde/name/text()` both count); the feedback names "finds nothing", "too many matches – missing condition?",
"a number is wanted – count()/sum()". The importer skips (and reports) an exercise whose solution is not well-formed, fails its rules, finds nothing,
or whose `vorgabe` already satisfies the rules. Pages `/xml` and `/xml/:id` (`src/pages/XmlUebungen.tsx` – the list is the shared `DatenformatListe` of
`JsonUebungen.tsx` – and `XmlUebung.tsx`). Progress is stored in the same map `json` (§ 6) under the `XML-…` ids, with the same functions
(`src/lib/jsonUebungen.ts`); no format change. Tests: `tests/xml.test.ts`, `tests/xmlUebungen.test.ts`.

### 4.4e Normalisierungs-Übungen `AP2_Normalisierung_Uebungen.json`

A relational model in 3. NF from a table or from a text, answered in the Tabellen-Editor (the same one exam tasks use). `{ meta, uebungen: [{ id
(NF-NNN), titel, stufe 1–3, topicId?, quelle: "tabelle" | "text", aufgabe (Markdown, "Sie"-form, operator *Überführen* or *Erstellen*, attribute names
given in the text), ausgang? (only `tabelle`: `{ name, kopf[], zeilen[][] }`, shown under the task and offered as "Ausgangstabelle übernehmen"),
hinweise[], loesung: [{ titel ("1. NF" … "3. NF"; `text`: one step "3. NF"), text (dependencies, Markdown), tabellen: ["name(**pk1, pk2↑**, a, b↑)" |
{ relation, zeilen? }], ziele? ({ "tabelle.spalte": "zieltabelle" } for a FK whose name differs from the PK it points to) }], erklaerung? (Prüferkommentar),
tags[] }] }`.

`domain/normalisierungUebungen.ts` reads the relation notation (`leseRelation`) and finds FK targets (`fkZiel`: explicit target, else the other table whose
PK has that column, single-column PK preferred). The importer skips (and reports) an exercise whose solution has a table without PK, a FK without target,
a duplicate column/table, wrong step titles, or loses a column of the first step. "Prüfen" (`src/lib/normalisierung.ts`) compares every step with
`gleicheAb` of the Tabellen-Editor (column names normalised; table names and column order free) and checks FK targets chosen in the editor; the feedback
names the learner's own tables and how many tables/columns are missing, without revealing the solution. Pages `/normalisierung` (shared
`DatenformatListe`) and `/normalisierung/:id`. The Tabellen-Editor (also in exam tasks) opens in the view "Zeichnen" (`SchemaZeichner`, model changes in `src/lib/schemaZeichner.ts`): tables as freely placed boxes (position `x`/`y` stored in the table), columns dragged at ⠿ into another table or onto the free area (new table), a FK drawn from ● to its target table (sets `fk` and `ziel`); "Tabellenform" is the form view with sample data. In the form view it draws the tables as a Beziehungsdiagramm (`SchemaDiagramm`,
layout in `src/lib/schemaDiagramm.ts`: columns by references, FK lines n … 1); the solution shows one per step. The editor state is kept as a draft in
`localStorage` (`ap2-nf-entwurf`, per exercise, removed when solved) – a convenience, not progress. Progress in the map `json` (§ 6) under the `NF-…` ids,
no format change. Tests: `tests/normalisierungUebungen.test.ts`.

### 4.4b Diagramm-Übungen `AP2_Diagramm_Uebungen.json` (plan phase 7)

`{ meta, uebungen: [...] }`, parsed by `parseDiagrammUebungen` (`domain/diagrammUebungen.ts`, zod + `pruefeDiagrammUebung`; a broken
exercise is skipped and reported as ImportIssue). One exercise:

| Field | Meaning |
|---|---|
| `id`, `typ` (`epk` \| `bpmn` \| `aktivitaet` \| `sequenz` \| `zustand`), `stufe` (1 Lücken füllen, 2 Ablauf ordnen), `titel`, `szenario` (Markdown) | |
| `breite`, `hoehe` | drawing area in SVG units (the page shows it 1:1 and scrolls sideways on phones) |
| `knoten[]` | `{ id, form?, x, y, w, h, text?, slot?, lage? }` – `lage` (`oben` \| `unten` \| `links` \| `rechts`) sets the label side of BPMN events (boundary events sit as a `zwischen` circle on the task border, label beside it); a node with `slot` is a gap; its shape comes from the placed palette element. Forms: EPK `ereignis`, `funktion`, `xor`/`and`/`or`, `org`, `info`; BPMN `start`, `zwischen`, `ende`, `task`, `gw-xor`/`gw-and`/`gw-or`, `pool`, `lane`; UML `aktion`, `entscheidung`, `gabel`, `startpunkt`, `endpunkt`, `zustand`, `lebenslinie`, `fragment`, `notiz` |
| `kanten[]` | `{ von, nach, art (fluss \| nachricht \| zuordnung \| sync \| async \| antwort \| transition), text?, slot?, y? (sequence message height), punkte? (bends), label? ([x, y] of the label/slot) }` – an edge `slot` takes an edge element (`sync`, `async`, `antwort`, `transition`, `beschriftung`); in sequence diagrams the element also decides the arrow style |
| `palette[]` | `{ id, form, text, mehrfach? }` – solutions and distractors; `mehrfach` = may fill several gaps (connectors, fork bars) |
| `loesung` | slot → allowed palette id(s); `varianten[]`: further complete solutions (e.g. swapped branches) |
| `hinweise[]`, `erklaerung`, `quelle`, `tags` | step hints, explanation after solving, source in the sheets |

Checks on import: unique ids, edges between existing nodes, nodes inside the area, every slot solved in `loesung` and each variant, only
palette ids, node slots get node elements and edge slots edge elements, no single-use element planned twice.
**Scoring** (`bewerteDiagramm`): per gap against the solution and every variant, the best match counts. **Shape rules** (`formregeln`, shown
as hints after checking): EPK – Ereignis/Funktion alternate (connectors in between ignored), no XOR/OR split after an Ereignis, start and end
are Ereignisse; EPK/BPMN/Aktivität – a split is joined with the same type (XOR → AND adds the deadlock note). Tests require every solution
and variant to score fully and break no rule (`tests/diagrammUebungen.test.ts`). The content (32 exercises, incl. four boundary-event BPMN exercises DG-BPMN-005…008 and DG-EPK-006 / DG-SEQ-005 for the DD28 exam added directly in the JSON, scenario Möbelhaus Nordholz) was
generated by `AP-2/Messung/diagramme_gen.py` (`python diagramme_gen.py <AP-2>/AP2_Diagramm_Uebungen.json`) from compact definitions; edit the script and regenerate, or edit the JSON directly. `AP-2/Messung/diagramme_shots.mjs` photographs every exercise with its model solution (needs the Pages preview).

### 4.4c Quellen `AP2_Quellen.json` (plan phase 8)

`{ meta, quellen: [...] }`, parsed by `parseQuellen` (`domain/quellen.ts`, zod; a broken entry is skipped and reported as ImportIssue).
One entry: `{ ziel, titel, url, anbieter, art, youtubeId?, geprueft }`.

| Field | Meaning |
|---|---|
| `ziel` | `abschnitt:<section id>` (e.g. `abschnitt:03-teil-5-boxplot-und-ausreisser`) or `begriff:<term page id>` (e.g. `begriff:median`); `pruefeQuellenZiele` reports targets that don't exist (term targets only when the pages are loaded) |
| `titel`, `url`, `anbieter` | link text, **https only**, provider shown next to it (Studyflix, Wikipedia, Gesetze im Internet, DSGVO-Text, BSI, EU-Kommission) |
| `art` | `artikel` or `video` (page with a lecture video – shown as „mit Video“, only **linked**) |
| `youtubeId` | optional, 11 characters: only for a video the provider published on YouTube itself → embedded with the two-click solution (below). Today **no** entry has one: Studyflix hosts its videos itself (m3u8), and their YouTube ids could not be found reliably – add by hand after checking |
| `geprueft` | month of the last check, `JJJJ-MM` |

Today **393 entries, 236 different URLs** (Studyflix 227, Wikipedia 115, Gesetze im Internet 25, DSGVO-Text 20, BSI 4, EU-Kommission 2;
204 video pages, 189 articles), every one fetched and its page title checked (2026-10). Built with `AP-2/Messung/quellen_zuordnung.py`
(section/term → URLs; Studyflix URLs from `https://studyflix.de/system/sitemap1.xml`) and `quellen_pruefen.py` (fetch + title). EUR-Lex
answers bots with 202 and an empty page, so the AI Act links to the EU-Kommission page instead.
**Re-check:** `npm run quellen-pruefen` (`tools/quellenPruefen.ts`) fetches every URL again (one at a time, 400 ms pause, 20 s timeout) and
lists everything that doesn't answer 2xx (exit code 1). Replace or remove dead links in `content/AP2_Quellen.json`.
Size: about 80 KB of `content.json` (core since plan phase 10: ~1.34 MB, ~351 KB gzip).

### 4.5 Updating content

Formulas in the sheets are written as `$…$` (see § 5 "Markdown, formulas"). Edit the files in `content/` directly, run
`npm run import-report` and `npm test`, commit, open a pull request. `CONTRIBUTING.md` (German) has the steps.
