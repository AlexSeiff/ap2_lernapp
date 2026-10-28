---
name: inhalte-schreiben
description: Conventions for writing and changing the learning content of the AP2 Lern-App – flashcards (AP2_FIDPA_Lernkarten.json, AP2_Fachbegriffe_Lernkarten.json), Deep Dive sheets and their _Loesungen.md, Übungsklausur tasks, Prüferfragen, Fachgespräch, Begriffsseiten, the Leicht-Modus `mc` block, formulas and IHK operators – plus how to validate it (import-report, tests). Use this whenever the user wants to add, fix, rewrite, extend or check cards, exercises, exam tasks, model solutions, term pages or anything in content/, even when they just say "add a few cards about X", "this card is wrong", "explain this better in the sheet" or "make an exam task in IHK style".
---

# Inhalte schreiben

The content is the product: people learn for a real IHK exam (FIDPA AP2) with it, several of them via GitHub Pages. A wrong
number or a card that teaches a misconception costs someone points, and a changed id silently wipes their progress. So: be
correct first, keep the house style, and let the importer and tests confirm the files are well-formed.

Exact formats with examples: **`references/formate.md`** – read the section for the file you're about to touch.

## 1. Where to edit

`.env.local` → `LERN_QUELLE` decides the source folder:
- `LERN_QUELLE` points at `content/` (the case on this machine) → edit `content/` directly. **Don't** run `npm run sync-content`.
- otherwise the sources live in `AP-2/` (folder above the repo) → edit there, then `npm run sync-content` copies to `content/`.

`content/` is committed and public (Pages build, tests). Content license CC BY-NC-SA – only write your own text, no copied
exam papers or textbook passages.

## 2. Rules that protect users

- **Never change or reuse an id** (cards `SQL-012`, `FB-median`, tasks `A1`, exercises `RE-ST1-001`, term page `<!-- id: … -->`).
  Progress, Leitner boxes and the Fehlerjournal are keyed by id. To fix a card, change its text; to retire it, ask the owner first.
- New card id = deck prefix + next free number in that deck – the numbers are not sorted in the file, so ask the helper:
  `node .claude/skills/inhalte-schreiben/scripts/karten.mjs naechste content/AP2_FIDPA_Lernkarten.json st2 3`.
  Term cards: `FB-<slug>` of the term (lower case, umlauts without dots, bracket note dropped: „Primärschlüssel“ → `FB-primarschlussel`,
  „CTE (Common Table Expression)“ → `FB-cte`).
- After adding/removing cards the deck's `anzahl_karten` and the `meta` counters must match (the importer reports a mismatch):
  `node .claude/skills/inhalte-schreiben/scripts/karten.mjs zaehlen <datei> --schreiben` fixes them and sets `aktualisiert_am`.
- The card files are exactly `JSON.stringify(data, null, 2)` + newline (the `mc-uebernehmen` tool depends on it; Prettier ignores
  `content/`). Small edits with Edit are fine – keep 2-space indentation and `\n` inside strings; for many cards write a short Node
  script that parses, changes and writes back in that format.
- Facts with a date (Beitragssätze, Minijob-Grenze, Mindestlohn …) say „Stand 2026“ – check them, they change yearly.
- No personal data, no names of real people or companies, no personal dates. The running scenario is the fictional
  **Möbelhaus Nordholz GmbH** (also DataFit, Kundenimport datasets).

## 3. House style

- German. Cards and sheet explanations use **du**; exam tasks, Prüferfragen and Fachgespräch questions use **Sie** (that's how the
  IHK and the examiners speak).
- Short, concrete sentences; one idea per card. Answers say *why*, not only *what* – the reason is what earns points.
- Exam tasks start with an IHK **operator in italics**: `*Nennen* Sie …`, `*Erläutern* Sie …`, `*Berechnen* Sie …`. The operator
  decides the expected depth (nennen = list, erläutern = explain with reasons, beurteilen = judgement with justification). The full
  list with point weights is in `src/lib/operatoren.ts`; use those verbs so the operator tooltips and the trainer pick them up.
- **Every Übungsklausur follows the real AP2 format** (owner's decision): Ausgangssituation box, blocks = original „Aufgaben“ with a
  Handlungssituation intro, explicit quantities, small point steps, pre-structured answer tables, legal/English source texts. Details and the
  WiSo variant: `references/formate.md` § 3a. Never copy original exam text (© ZPA) – rebuild type and level in the Nordholz scenario. When
  reworking an existing exam keep every task code and the 100 P.
- **Calculation tasks always state the formula they need** (owner's rule). In an exam task, add a quote block in plain-text
  notation right after the task text (after its a)/b) lines): `> **Formel:** VK = σ / x̄ · 100 %`, or for several
  `> **Formeln:**` + `> - …` lines. Give the general formula, never the numbers or the result; don't ask the student to
  „*Geben* Sie die Formel *an*“ (and drop such points from the solution). A task that interprets or judges a computed value
  (*Interpretieren* Sie r / R² / den Lift …, *Beurteilen* Sie auf Grundlage der Fehlerkosten …) repeats the formula of that value –
  in the single-task view the preceding task isn't visible. Rechenübungen with a `vorlage` show their formulas
  automatically from `src/rechnen/formeln.ts` (`AufgabenFormeln`) – a new vorlage needs its entries there. Without a `vorlage`, end
  the `aufgabe` text with the same `> **Formel:** …` block. Pure legal rules (Ruhepausen, JArbSchG-Urlaub …) are not formulas.
- Modelling tasks (ERM, EPK/eEPK, BPMN, Use-Case-Diagramm, Relationenmodell/Star-Schema, Normalisierung) are answered in an **editor**,
  detected from the task text (`editorFuer`, `src/lib/editorAufgabe.ts`): use a create operator (*Erstellen*, *Modellieren*, *Zeichnen*,
  *Entwerfen*; *Überführen* for Relationenmodell/Normalform) and name the diagram type. Write the model solution of a relation schema as
  `- name(**pk**, spalte, fk↑)` lines and split steps with `**a)** … **b)**` – the table comparison reads exactly that. Never put solution
  elements into the task. Then update the expected list in `tests/editorAufgaben.test.ts`.
- Points: block headings `## Block A – Titel (20 P)`, tasks `**A1 (15 P):**`; every Übungsklausur sums to **100 P** (tested).
- Model solutions show points `*(3 P)*`, a scoring note `*(je Dimension 1 P Nennung, 1 P Erläuterung)*`, end with
  `*Prüferkommentar: …*` where useful (typical mistakes, what gets full points).

## 4. Formulas – two different worlds

| Where | How | Why |
|---|---|---|
| Deep Dive theory and `_Loesungen.md` | LaTeX `$…$` on one line, decimal comma `{,}`, percent `\%`; **result as bold text after the formula**: `$\frac{7}{10} \cdot 100$ = **70,00 %**` | rendered with KaTeX; the bold result gets the „Ergebnis“ box and stays readable without KaTeX |
| Cards, Prüferfragen, task texts, term-page definitions | plain text: `·`, `−`, `√`, `Σ`, `x̄`, `σ²`, `e^(−z)`, `x_i`, `s_xy`, `(a / b)^(1/n)` | cards render without KaTeX; `^(…)`, `^x` and `x_i` (single lower-case letter before `_`) are set as super-/subscript automatically (`src/lib/hochTief.ts`) |

Never put `$` into cards (it would show literally). In sheets, a `$` that isn't a formula is a mistake – write „Euro“/„€“.
Don't put the final result inside the formula (`\mathbf`, `\boxed`) – the result box and a test depend on it being outside.

## 5. Cards: choosing `typ` and `schwierigkeit`

`wissen` (definition/fact) · `abgrenzung` (A vs. B – answer contrasts both) · `rechnung` (worked calculation with numbers – paper
first) · `anwendung` (transfer to a concrete case) · `falle` (typical exam mistake – frage provokes it, antwort names the trap and the
right way) · `begriff` (only in the Fachbegriffe file: frage = the bare term, antwort = 1–2 sentences).
`schwierigkeit`: 1 Basis, 2 Standard, 3 Transfer. `tags`: lower case German, reuse existing ones (look in the deck).

Optional `mc` (Leicht-Modus): exactly 3 `falsch`, plausible (same length and style as `richtig`, typical confusions), all distinct
and none equal to `richtig`; `erklaerung` says why the wrong ones are wrong. Without `mc` the app builds automatic distractors.

## 6. Validate

```bash
node .claude/skills/inhalte-schreiben/scripts/karten.mjs pruefen <kartendatei>   # ids, fields, typ, mc block, „$“ in card text
npm run import-report      # counts per Deep Dive/deck + "Hinweise (n)" – must end with Hinweise (0)
npm test                   # ~20 s; content smoke tests: 100 P per exam, solutions for every task, KaTeX for every formula,
                           # stray $, operators, card ids unique, Rechenübungen reproduce sheet numbers, SQL solutions run
```

Then look at the result in the app when rendering matters (formulas, tables, long answers): use the **app-pruefen** skill, e.g.
`#/karteikarten?blaettern=1&karten=<new ids>` to page through new cards safely.

Report to the user what you added or changed (ids, deck, counts), what you checked, and any fact you weren't sure about – say so
rather than guessing.

## 7. Commit

One commit per logical content change, German message in the repo's style (e.g. „LEFT/RIGHT JOIN verständlicher erklärt: Treffer
plus übrige Zeilen“), only when the user asks.
