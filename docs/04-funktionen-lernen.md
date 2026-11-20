# AP2 Lern-App – Features: learning and exercises

> Part of the technical documentation (section 5, part 1). Overview: [DOKUMENTATION.md](../DOKUMENTATION.md).

## 5. Features (pages and routes)

| Route | Page | What it does |
|---|---|---|
| `/` | Dashboard | Pages: backup reminder banner (see § 6). **First visit** (API returns no stored progress, `store.firstVisit`): welcome screen (`components/Welcome.tsx`: what the app is, progress stays in this browser → download backups, optional exam date; "Los geht's" / "Sicherung einspielen"), gone after the first change. Otherwise a **widget grid** (plan phase 9, see „Übersicht“ below): Weiterlernen ("▶ Heute lernen" + last reading position), countdown to `settings.examDate` (without one: "Prüfungstermin eintragen →"), study streak, rings per Prüfungsbereich, Fällig, Übungen (SQL/Rechen/Diagramm), Markiert → `/karteikarten?markiert=1`, Begriff des Tages, Übungsklausuren (average + IHK grade, trend, last 5), weakest topics, "Woran es meistens liegt", "🎯 Selbsteinschätzung" (§ 5 phase 8.3); below in full width "Fortschritt je Thema" and "Klausur-Trend je Thema" |
| `/heute` | Heute lernen | lazy page: plan of today's mixed round, start, progress, skip, end (§ 5 "Heute lernen") |
| `/lernen`, `/lernen/:topicId` | Themen / Thema | **hiding sheets**: button „Ausblenden“ on the sheet (`setzeAusgeblendet`, `src/lib/settings.ts`) → the sheet leaves the tile grid (collapsible „Ausgeblendet (n)“ below it with „Einblenden“), the dashboard's „Weiterlesen“ link and „Schwächste Themen“, and the weakest-topic pick of „Heute lernen“; a hidden sheet still opens by link and shows a note with „Wieder einblenden“; cards, tasks, journal repetitions, search and „Fortschritt je Thema“ are unchanged; theory with table of contents, after each section a box „Weiterlesen und ansehen“ with its sources (plan phase 8, see Quellen below), Prüferfragen as a box "❓ Prüferfrage – erst selbst überlegen" with the answer behind "👁 Antwort zeigen" (`TheoryMarkdown`), ticking off learning goals |
| `/karteikarten` | Karteikarten | filters (Deep Dive, deck, kind, typ, difficulty; kept in the URL), quick switches for Prüferfragen/Fachgespräch (same settings), Leitner boxes (`CARD_INTERVALS`), max `NEW_PER_SESSION` new cards per round – due cards only once every card of the selection has been seen (`rundenKarten`), "⚠️ Fallen wiederholen", keyboard: Space flip, 1/2/3 rate; mode switch "🃏 Aufdecken \| 🟢 Leicht (4 Antworten)" (see Leicht-Modus below); optional "✍️ Deine Antwort" field (8.2); `?karten=ID,ID,…` = exactly these cards (used by "Heute lernen"); "📖 Durchblättern" (`?blaettern=1`, `KartenBlaettern`): all filtered cards (`alle`, also in Leicht-Modus) one by one, ←/→ or swipe, Space flip, Esc end, options "gemischt" and "Antwort gleich zeigen", slider to jump – no rating, progress untouched (`tests/blaettern.test.ts`); **marking** (plan phase 4): star button `MarkierStern` in the session head of all three card views (outside the clickable card, so no nested controls), key `M`, filter checkbox "Nur markierte (n)" (`?markiert=1`, combines with all other filters and Leicht) |
| `/klausur`, `/klausur/:topicId` | Übungsklausur | timer with the exam's own duration (`examMinutes(exam)` in `src/lib/examTimer.ts` reads „NN Minuten“ from the exam title: WiSo 60, all others 90; without a number – e.g. the mixed exam – `EXAM_MINUTES` = 90; shown on the start button, on the tiles of `/klausur` and on the print cover page; `tests/klausurDauer.test.ts`), `aria-live` announcements, attachments, "Wie sicher bist du?" per task (8.3), operators marked (8.4), solutions locked until submission, self-assessment with criteria checkboxes, "Woran lag's?" below full points (8.7), IHK grade, auto-submit on timeout, resumable (`activeExam`). Card "🎲 Gemischte Probeklausur" on `/klausur`; `:topicId` can also be `mix-<bereich>-<seed>` (8.5) |
| `/aufgaben`, `/aufgabe/:taskId` | Einzelaufgaben | filter by topic/block/difficulty/status/search; export a selection as task sheet/solution sheet; task page asks "Wie sicher bist du?" before submitting (8.3) and "Woran lag's?" below full points (8.7); operators in task texts are marked (8.4) |
| `/druck` | Druck | print view (task sheet or solution sheet, same numbering) → "Als PDF speichern"; also Markdown download. Whole exams (`thema=<id>`, also `thema=mix-…`; `misch=mix-…` is the same, plan phase 6): task sheet with a **cover page** (`Deckblatt`: name, date, duration `Sheet.minuten` = `examMinutes(exam)`, aids, points per block to fill in), solution sheet with a **grading sheet** (`Bewertungsbogen`: every task with max points, empty column, sum, IHK scale; mixed exams show the source „DD n“ because codes repeat). In print every block starts on a new page (`SheetGroup.neuerBlock`); `@page` margin boxes put the title and „Name“ (or the subtitle) in the header and „Seite x von y“ in the footer (Chromium; other browsers print without them), not on the first page. The free selection (`ids=`) stays as before. `/klausur` has a button „Drucken“ that mixes a new exam (`mix-gemischt-<seed>`) and opens its task sheet |
| `/sql`, `/sql/uebungen`, `/sql/uebung/:id` | SQL-Editor | free mode + exercises (see § 7) |
| `/diagramme`, `/diagramme/:id` | Diagramm-Übungen | plan phase 7, lazy pages. List with filters in the URL (`typ`, `stufe`, `status`), progress bar, "Nächste offene". Exercise page: scenario, diagram (`components/DiagrammSvg.tsx`: SVG with the `dg-*` classes of DD17, every gap an HTML button laid over the SVG in %, so tap, keyboard and screen reader work), palette below (on phones sticky above the tab bar). Placing: **drag** with Pointer Events (captured on `pointerdown`, start after 6 px, drop target via `elementFromPoint` → `data-slot`; no HTML5 drag and drop – unreliable on iOS) or **tap** an element, then a gap (Esc cancels; tapping a filled gap takes the element out and selects it). `einsetzen` moves single-use elements. "Prüfen" marks every gap green/red and lists violated shape rules; "Hinweis", "Lösung zeigen" (fills the model solution, counts as "mit Lösung"), "Leeren". Progress `diagramme` (§ 6) with repetition like Rechenübungen, badge `diagramme` in the navigation (Lernen → Diagramm-Übungen). Begriffsseiten list matching exercises under „Üben“ (type terms such as EPK, BPMN, Aktivitätsdiagramm show all of that type; otherwise word match in title, scenario and palette); DD5 2.2/2.3 and DD17 1.1/1.2/2.4–2.6 end with a link `#/diagramme?typ=…`. Not (yet) part of "Heute lernen" and the Fehlerjournal |
| `/rechnen`, `/rechnen/:id` | Rechenübungen | list with filters in the URL (Thema, Schwierigkeit, Tag, Status), progress bar, "Nächste offene"; exercise page (see below) with a faded worked example (8.6) |
| `/fehlerjournal` | Fehlerjournal | every task below full points comes back after 1, 3, 7 days (`JOURNAL_INTERVALS`); card "🧩 Woran es meistens liegt" and the last error category per entry (8.7) |
| `/material`, `/material/:docId` | Material | cheat sheet, topic list, tiles "📏 Formelsammlung" and "🗣️ Operatoren-Trainer" |
| `/material/operatoren` | Operatoren-Trainer | lazy page: quiz "Was verlangt der Operator hier?" with real tasks, table of all operators (§ 5 phase 8.4) |
| `/glossar` (old `/material/glossar` redirects, keeps `?stelle=`) | Glossar | lazy page: terms A–Z from `begriff` and `wissen` cards and bold terms of the sheets, letter jump bar, filter, links to the sources; terms with a term page link to it (§ 5 phase 8.9, plan phase 3) |
| `/glossar/:id` | Begriff | lazy term page (plan phase 3; section „Weiterlesen und Videos“ since plan phase 8): definition, Erklärung, Beispiel, Abgrenzung, Prüfungsfalle, Merksatz, diagrams; „Siehe auch“, „Üben“ (cards, tasks, Rechen- and SQL-Übungen), „Nachlesen“; star "Karte markieren" next to the h1 for the term's own card (`uebungen.begriffskarte`) and an icon-only star before every card in „Üben“ |
| (dialog) | Suche | `Strg+K` / `⌘K`, search button in the page header (Kopfzeile): global search, lazy (§ 5 phase 8.8) |
| `/material/sql-belegsatz` | SQL-Belegsatz | lazy page (`pages/SqlBelegsatz.tsx`) of `AP2_SQL_Belegsatz.md` with „Drucken“ (print CSS: two columns, small font → 2 pages A4); in the Glossar area. The same content as a side panel in the SQL editor (`components/Belegsatz.tsx`, `BelegsatzPanel`: button in the toolbar of `/sql` and on every exercise, fixed panel on the right, full width on phones, Esc/„Schließen“ close it and focus returns to the button) |
| `/material/formeln` | Formelsammlung | lazy page (`pages/Formelsammlung.tsx`, KaTeX): all formulas of `src/rechnen/formeln.ts` grouped by Deep Dive, each with explanation, variables and a link "📐 n Rechenübungen →" to `/rechnen?vorlage=a,b`; jump bar, "🖨️ Drucken" (print CSS: one column, no links). Plan phase 6 added neuron formulas (gewichtete Summe, Stufe, Sigmoid, ReLU, Perzeptron-Lernregel) and formulas that only the sheets had (Laplace, Gegenereignis, mindestens einmal, Erwartungswert, z-Wert, Spearman, Wachstumsrate, Falsch-Positiv-Rate, kostenoptimale Schwelle, MAPE) – those have `vorlagen: []` and show no exercise link |
| `/einstellungen` | Einstellungen | per-user settings (`Progress.settings`, see § 6): own exam date; switches "❓ Prüferfragen einbeziehen" / "🎤 Fachgespräch-Fragen einbeziehen"; "🤖 Automatische Antworten erlauben" (Leicht-Modus, `leichtAutomatisch`); Datenschutz-Hinweis (`components/Datenschutz.tsx`: no account, no tracking, no cookies, data stays in the browser, only app + content loaded from GitHub Pages; content license line CC BY-NC-SA 4.0 with link to the deed; source links open in a new tab, YouTube only after a click via youtube-nocookie.com) |
| `/daten` | Daten & Import | import report, backup download, backup import as **🔀 Zusammenführen** (merge) or **⬆ Einspielen (ersetzen)** (replace), reset; "Speicher dauerhaft: ja/nein" and the list of browser daily backups with "↩ Wiederherstellen" |

**Not affected by the Prüferfragen switch:** the *Prüferkommentar* in solutions (the scoring scheme; `Solution.kommentar`) is always shown
(owner decision Q1; tested in `tests/prueferfragen.test.ts`).

**Grading**
- Automatic: MC, Lückentext, Zuordnung, numeric (`rechnen`, with tolerance). No sheet task uses these types today (they came from the removed AI generator).
- Sheet tasks are `offen`: self-assessment against the model solution; a points table becomes checkable criteria.
- IHK scale: 100–92 = 1 · 91–81 = 2 · 80–67 = 3 · 66–50 = 4 · 49–30 = 5 · 29–0 = 6.

**Prüferfragen / Fachgespräch switched off** (`settings.prueferfragen` / `settings.fachgespraech`): `cardPool()` (`src/lib/cards.ts`) drops that
`kind` everywhere cards are counted or learned – Karteikarten (pool, kind filter options, due/new counts, sessions, traps, deck table),
Dashboard due count, topic stats (`topicStats`), the card button on Thema. A disabled `?art=` in the URL counts as "alle". `CardState` is kept,
so turning it back on restores everything. In Lernen, `TheoryMarkdown` removes the `> ❓ **Prüferfrage:** …` blockquotes and the lead text
drops the mention.

### Markdown, formulas and solution styling (phase 4.1–4.3)

- **`<Markdown>`** (react-markdown + GFM) is used everywhere. **`<Markdown math>`** additionally renders `$…$` / `$$…$$` with KaTeX
  (remark-math + rehype-katex). That variant (`components/MathMarkdown.tsx`) is a **lazy chunk** with the KaTeX CSS and fonts
  (bundled by Vite into `assets/` with relative URLs → works offline and on Pages); until it has loaded, the plain variant is shown.
  Used in: Lernen (theory + Prüferfrage boxes), model solutions (`GradePanel`), the solution sheet on `/druck` and Material.
  **Not** in task texts, exams, attachments and flashcards. KaTeX inherits the text colour (light/dark/print); long display formulas scroll.
- **`$` safety** (`src/lib/mathDollar.ts`, `escapeStrayDollars`, tested): before the math variant parses, every `$` that can't delimit
  a formula by the **Pandoc rule** is escaped to `\$` – the opening `$` needs a non-space right after it, the closing `$` a non-space
  before it and no digit after it; the next `$` closes (like remark-math); a formula stays on one line; `$$`, fenced code and inline
  code are left alone. So prices like `5 $ und 3 $` stay text. Every `$` in `content/` is a formula delimiter; `tests/math.test.ts` checks that
  `escapeStrayDollars` changes nothing there and that every formula renders with KaTeX (`throwOnError`).
  Write formulas as `$x = 70$`, not `$ x $`; one line; German decimal comma as `{,}` (`70{,}00`), percent as `\%`.
- **Solution styling** (`src/lib/loesungStil.ts`, rehype plugins, tested in `tests/loesungStil.test.ts`):
  - `rehypeLoesung` (only `<Markdown loesung>`: model solution and solution sheet):
    `*(3 P)*` / `*(je 1 P)*` → points badge (`span.punkte`), floated right when it ends a line (then a line break follows, like in the sheet);
    longer point notes (`*(je 4 P: 1 P Formel, …)*`) → small muted `span.punkte-hinweis`.
    **Result box** `span.ergebnis` "Ergebnis" – conservative: bold text that is a number with a unit (`%`, `€`, `min`, `Tage`, `T€`, `(Tage²)`,
    up to three words, not `P`/`Punkte`) directly after `=`, `≈`, `→` or `⇒`, or a bold equation/label ending in `= number unit` or
    `: number unit` (`**IQR = 70 − 40 = 30 Minuten**`, `**Projektdauer: 25 Tage**`). Never inside tables, headings, links, formulas or the
    Prüferkommentar. Bold numbers without a unit (`**−5**`, `**Q1 = 40**`, `**0,98**`) stay plain bold. About 60 results are boxed in the current sheets.
    **Formulas in the sheets (phase 4.4):** the calculation steps of the solutions (and the calculation formulas of the theory parts) are
    `$…$`, with the **final result as bold text after the formula**: `- Arithmetisches Mittel: $\bar{x} = \frac{\sum x_i}{n} = \frac{770}{11}$ = **70,00 Minuten** *(3 P)*`.
    So the result box rule applies unchanged (text " = " before the bold result), the result stays readable without KaTeX (plain
    Markdown, Markdown download) and the number is still plain text for the Rechenübungen smoke test. Never put the result into the
    formula (`\mathbf`, `\boxed`): it would not be boxed (test in `tests/math.test.ts`). Labels like `**F1** = $…$` keep the colon out of
    the bold text – `**F1:**` would be parsed as the solution of task F1. Prüferfragen (flashcards render no math), tables, points,
    Prüferkommentare and task texts stay plain text. Content today: about 220 formulas (102 in solutions, 119 in theory; DD3–DD7, DD9–DD14, DD16).
    A paragraph starting with `*Prüferkommentar: …*` (also inside a blockquote, as on the solution sheet) → callout `aside.pk-box`
    "🧑‍🏫 Prüferkommentar"; `GradePanel` renders `Solution.kommentar` in the same box.
  - `rehypeTabellen` (every `<Markdown>`): columns whose body cells are all numbers (German format, optional `Σ`, `%`, `€`, `P`; empty/`–` ignored)
    get `class="num"` (right-aligned, tabular figures) unless the column has an explicit alignment; rows whose first cell starts with
    `Σ`, `Summe`, `Gesamt` or `Insgesamt` get `class="sum-row"` (bold, top rule).
- **Rechenweg** (`components/Rechenweg.tsx` + `domain/rechenweg.ts`): numbered steps, each `Formel` (KaTeX) → `Einsetzen` (KaTeX) →
  `Ergebnis` (`formatErgebnis`: `Intl.NumberFormat('de-DE')`, fixed decimals from `runden`, typographic minus, unit with a space) plus a
  rounding note (`rundungsHinweis`, only if the shown value is actually rounded). `latexZahl` formats numbers for LaTeX (`70{,}00`).
  Used on the Rechenübung page (loaded lazily when the solution is opened); it imports KaTeX, so only use it in lazy-loaded pages.

### Rechenübungen (phase 5)

- Nav item "📐 Rechenübungen" with a badge for due repetitions (`rechenSummary`). Routes are **lazy** (`pages/RechenUebungen.tsx`,
  `pages/RechenUebung.tsx`): templates and checker are in the `RechenUebung` chunk, KaTeX in the `Rechenweg` chunk, nothing in the main bundle.
- Exercise page (state in `hooks/useRechenUebung.ts`, the page only renders): task text with filled `{{placeholders}}`, data table of the template,
  notice "✏️ Rechne auf Papier, trage nur Ergebnisse ein.", one input per result with unit (templates with a `layout` – Netzplan, Häufigkeiten,
  Regression, k-Means, Nutzwert – show the asked results as an input table), **Enter** or "✓ Prüfen" checks (counts as an attempt as soon as one
  field is filled): ✓/✗ per field, explanation of a recognised Fehlerbild ("🔎 Du hast durch n geteilt …"), unit hints.
  "💡 Hinweis n/m" reveals hints one by one. "🎲 Neue Zahlen" (template exercises) draws a new seed, stored as `lastSeed`, so reopening shows the
  same numbers; "↩ Originalzahlen" goes back. "👁 Lösung zeigen" (after `useConfirm`) → table "Deine Eingabe | Richtig" + Rechenweg + `erklaerung`.
  Every visit starts empty like a new attempt (no previous inputs, no revealed hints) – checked answers are not stored at all (since October
  2026; `migrateProgress` drops the old `antworten`). The page has „Σ Formelübersicht“ (exam appendix, see "Anhang der Prüfung" below).
- Checking (`src/rechnen/checker.ts`, pure): German decimal comma or dot, thousands separators, spaces, typographic minus, optional unit
  (synonyms; a different unit only gives a hint). Tolerance from `runden` (half a unit of the last digit) or `toleranz`. Wrong values are compared
  with the template's Fehlerbilder (concrete wrong values, e.g. median of the unsorted list, ÷ n instead of ÷ (n − 1), Precision/Recall swapped,
  wrong base for a percentage change) and general ones (share instead of percent, sign, rounded too early). Fehlerbilder that are not
  distinguishable from the right value after rounding are dropped by `LoesungsBau.fehler`.

### Leicht-Modus: 4 Antworten, 1 richtig (phase 6)

One setting `settings.leichtModus` (the remembered mode) for flashcards and Rechenübungen. Recognition is easier than recall, so the
mode is meant as an entry point; the Dashboard shows "🟢 Leicht-Modus ist zum Einstieg – für die Prüfung frei antworten." while it is on.

- **Which cards** (`src/lib/leicht.ts`, `leichtKarten`, pure): a card with an `mc` block (§ 4.2) always (except Fachgespräch questions);
  otherwise, if `settings.leichtAutomatisch` is not `false`, **automatic** answers: Lernkarten of typ wissen/abgrenzung/falle/rechnung and
  Prüferfragen whose answer as option text (`optionText`: one line, no code fences/bold) has at most **`LEICHT_AUTO_MAX` = 200 characters**.
  **Selection of the wrong answers (plan phase 5, replaces "same deck, closest length"):** candidates are answers of other cards of the same
  *kind* – Begriffskarten only among Begriffskarten, Prüferfragen only among Prüferfragen, other Lernkarten among themselves – and ranked in tiers:
  1. **Curated** (Begriffskarten): the terms from the Begriffsseite's „Abgrenzung“ section (`Flashcard.abgrenzung`), then from „Siehe auch“
     (`Flashcard.siehe`), also from other decks. Filled in at load time by `ergaenzeVerwandte` (`domain/verwandt.ts`, called in
     `ladeInhalt`): names = header row and first column of the Abgrenzung tables plus bold words in its text, and the „Siehe auch“ names,
     resolved to Begriffskarten via `namensSchluessel` of the card question or the page's „Auch“ variants. Also `Flashcard.abschnitt` = the
     page's first „Mehr:“ reference. About 99 KB extra in `content.json` (uncompressed).
  2. **Similar**: same kind in the same topic (no topic: same deck). Score = TF-IDF cosine of question + answer (`woerter`: lower case, no
     umlauts, no stop words, cut to 7 chars; `tfidf`, `kosinus`, computed once per `leichtKarten` call, ~100 ms for all cards)
     + 0.15 per shared *rare* tag (on ≤ 8 cards or 5 %; „fachbegriff“ does not count) + 0.15 same `abschnitt` + 0.05 same typ.
     Length only as a fine sort (−0.05 · |ln(length ratio)|).
  3. **Threshold**: a non-curated candidate needs `MIN_AEHNLICHKEIT` = 0.1. Answers too similar to the right one are dropped
     (answer-only cosine ≥ 0.8 for Begriffskarten, ≥ 0.35 for other cards – another card's answer is also a true statement, and on the same
     point, e.g. SQL-003 WHERE vs HAVING ↔ SQL-004 „Warum ist WHERE COUNT(*) falsch?“ at 0.39, it would hardly be wrong). Equal answers
     (`mcNorm`) count once. Pool = the best 4, each round draws 3. Fewer than 3 → the card is not offered in Leicht.
  Never: Fachgespräch, `anwendung` without `mc`.
  - **Numbers (content October 2026, no card has `mc` yet):** Begriffskarten 773 → **768** of 789, other Lernkarten 213 → **84** of 539,
    Prüferfragen 5 → **1**. Dropping the FIDPA cards is intended (plan: rather no card than obviously wrong answers); good hand-checked
    answers for them are written by hand (owner's decision). Sample of 50 cards before/after: `AP-2/Messung/MC_Vergleich_Phase5.md`.
  - **Reverse direction** (Begriffskarten): `LeichtKarte.umgekehrt` = { frage: the definition (Markdown), richtig: the term, falsch: the terms of
    the pool cards }. `leichtAbfrage(l, rng)` picks the direction per round and position (50 %); the page shows „Umgekehrt: Welcher Begriff ist
    gemeint?“, the definition as the question, the terms as options, and „Gesucht war“ after answering. Rating as usual (`rateCardLeicht`).
  - **Deviation from the roadmap (120 characters):** with 120 only 4 of 407 cards would qualify (median answer length ~200), so 200 is used.
- **Karteikarten**: mode switch "🃏 Aufdecken | 🟢 Leicht (4 Antworten)". In Leicht, `useCardFilters` restricts `deck` (and the trap button,
  deck table, due/new counts) to supported cards and the page shows "🟢 x von y Karten dieser Auswahl haben 4 Antworten (z davon 🤖 automatisch)";
  the kind filter drops Fachgespräch, the typ filter shows the count per typ. Round (`useCardSession` with a `LeichtKarte` map): options
  `leichtAbfrage` → `kartenOptionen` (correct + 3 wrong, Fisher–Yates; the rng is seeded per round and position so re-renders keep the order and
  the direction), keys 1–4 or click,
  immediate feedback (correct green, chosen wrong red), then the full `antwort` and the `mc.erklaerung`; "Weiter →" / Enter. Automatic cards
  carry the badge "🤖 automatisch". A wrong card comes back in the same round. Component `components/LeichtOptionen.tsx`.
- **Leitner boxes** (`rateCardLeicht` in `src/lib/progress.ts`, owner decision Q5): correct → one box up but at most to box
  `LEICHT_MAX_BOX` = 2 (a card already in box 3–5 stays there, due by its box interval); wrong → box 1, due today. Each answer counts in
  `cardReviewDays` (streak). Boxes 3–5 are only reached in the normal mode. No change to `CardState`.
- **Rechenübungen** ("✏️ Eintippen | 🟢 Ergebnis auswählen", `src/lib/leichtRechnen.ts`, `rechenAuswahl` / `rechenOptionen`, pure): per input the
  right value + up to 3 Fehlerbilder of the template, deduplicated after formatting with the input's rounding (`formatWert`), shuffled. Fewer
  than 3 distinct Fehlerbilder → filled with **nearby values** (`naheWerte`: × 0.5 … × 2 and ±1/2/5/10 units of the last digit, same sign,
  percent stays ≤ 100; lists: without one value, "keine", shifted; critical path: one activity left out; ja ↔ nein); the page says how many
  answers are such nearby values. Numbers and lists always get 4 answers, text results 2–4. An exercise is offered only if every input has
  ≥ 2 answers – today **all 85** (408 inputs, 399 with 4 answers; 369 inputs needed nearby values, most of them for templates with few
  Fehlerbilder per field such as `netzplan`, `kmeans`). The templates `nutzwert` and `risiko` got Fehlerbilder for their text result
  (every other alternative/risk, highest by W + S) for this. Keys 1–4 apply to the first unanswered input; feedback per input with the
  Fehlerbild explanation of a chosen wrong value. Tests check that the checker accepts the right option and rejects every wrong one.
- **Rechenübung progress decision** (`recordRechenLeicht`, no schema change): a finished Leicht round counts as a learning day (`rechnenDays`)
  and sets `lastCheckedAt` (merge), but is **not** an attempt and **never** sets `solvedAt` – an exercise is solved only by typing. A round
  with a wrong choice restarts the repetition (due tomorrow, like a wrong check); a right round changes nothing else. Because the right
  values were visible, the result card offers "✏️ Mit neuen Zahlen eintippen" (template exercises).

### Heute lernen (phase 8.1)

The **Weiterlernen** button opens **Heute lernen**. The checklist below it shares the same daily session. Ticking the current step selects the next open step. Completed steps can be unchecked and checked again in any order, including after the round is complete. Points and card ratings come from the respective exercise.

- **Planner** `planeHeute(content, progress, { today, zufall, minuten })` in `src/lib/heute.ts` (pure, `tests/heute.test.ts`). Target
  `HEUTE_MINUTEN` = 20 min; estimates in `HEUTE_ZEITEN` (`domain/config.ts`): card 0.5 min (Leicht 0.33), task 0.9 min per point (min 3),
  SQL 5, Rechnen 5, Diagramm 5. **Only things not yet done or last done wrong** – nothing whose last attempt was right (full points, or
  `zuletztRichtig`), even if a spaced repetition is due (owner decision, October 2026). Steps:
  1. **Fehlerjournal**: due open entries whose last attempt was below full points (oldest due first) until about half the time, at least one.
  2. **1–2 exercises** (SQL, Rechen, Diagramm), chosen before the tasks so their time is reserved (repeating mistakes beats new
     material): last result wrong or solution shown (`letzterStand` in `src/lib/wiederholung.ts`; oldest first, a second one only if
     both fit next to the Fehlerjournal); none → one never attempted exercise, preferably of the weakest topic.
  3. **Tasks**: one never attempted task from the weakest topic (lowest last exam, else Ø tasks; without any data the topic with the fewest
     attempts; if it has none left, the next weakest) and – not in a short round – a second one from the topic practised longest ago.
     **Time budget**: only tasks whose estimate fits into what is left after Fehlerjournal and exercises; if none in a topic fits, the next
     topic (before October 2026 a 25-P task made a 20-minute round take 40). Answered tasks never come here (wrong ones come back via the
     Fehlerjournal; „Antworten zurücksetzen“ on the task page brings one back). Never one of the planned repetitions, never AI tasks.
     Plans stay within the chosen duration + ~3 min (at least 5 cards; `tests/heute.test.ts` checks 10/20/40 min over 30 days of
     real content). Card blocks carry their exact minutes (5 cards = 2.5 min); the page rounds only for display.
  Anything already done today (earlier rounds of the day via `HeuteSitzung.frueher`, tasks attempted and exercises checked today) is skipped.
  4. **Cards** with the remaining time (at least 5 if available): new ones while any card of the pool is still unseen (≤ `NEW_PER_SESSION`;
     exam cards before Begriffskarten, matching the Lernplan's card target); due cards (longest due, lowest box first) only once every card
     has been seen (`rundenKarten` in `lib/cards.ts`, same rule as "Lernen starten" on `/karteikarten`).
     `cardPool` applies the Prüferfragen/Fachgespräch switches; in Leicht-Modus only cards with 4 answers. Grouped per topic (deck if no
     topic) into blocks of at most `HEUTE_KARTEN_BLOCK` = 8.
  5. **Interleaving** (`verschraenke`): greedy, always the topic with the most remaining items that is not the previous one → never the same topic
     twice in a row unless only one is left; the order within a topic is kept.

  Randomness is seeded by the date (`textSeed(today)`), so the plan stays the same for a day unless progress changes.
- **Flow**: every plan item has a `link` into the existing pages (`/aufgabe/:id?modus=wiederholung`, `/aufgabe/:id`, `/sql/uebung/:id`,
  `/rechnen/:id`, `/diagramme/:id`, `/karteikarten?karten=…`). "▶ Los geht's" stores the session and opens the first link; `components/HeuteLeiste.tsx` (above every
  page while a session runs, not on `/heute`) shows "Schritt n/m: …" and **"Weiter →"** (last step: "Fertig ✓"), which marks the step done and
  opens the next one. `/heute` shows the list with ✓/⏭/▶, "⏭ Überspringen", "Runde beenden" and, when done, "🎉 Runde geschafft" + "Noch eine Runde".
  The pages themselves are unchanged – learning is recorded as usual. Karteikarten with `?karten=` show "▶ Heute lernen: n Karten" and a start
  button (no auto start: setting state in an effect is against the lint rules, and a click is more robust).
- **Session** (`src/lib/heuteSitzung.ts`, pure + tiny store for `useSyncExternalStore`): `{ datum, items, index, maxIndex, erledigt, uebersprungen, frueher }` in
  `localStorage` key **`ap2-heute`** (try/catch, read tolerantly with `leseSitzung`). Only valid on the same day and device – it is navigation
  state, not progress, so it is not part of `Progress` or the backup.
- Entry points: Dashboard button (shows “Weiterlernen · Schritt n/m” while running), first sub-target of the area „Lernen“.

### Anhang der Prüfung (October 2026)

In the AP2 the appendix is always there, so the app offers it where it is needed: `AnhangPanel` (`components/Belegsatz.tsx`) shows the
buttons „SQL-Belegsatz“ and/or „Σ Formelübersicht“ with a side panel (one open at a time, Esc closes). The panel shows a rebuild of the
real appendix (`components/PruefungsAnhang.tsx`, data in `src/lib/pruefungsanhang.ts`, lazy because of KaTeX): the Formelübersicht as a
two-column table with grey group rows (statistics, random variables, regression, ID3, kNN, confusion matrix), the Netzplan node and legend,
the prefixes, and the SQL-Syntax-Auszug (Stand 2024-10-07) as Syntax | Beschreibung grouped like the appendix. Only formulas and syntax,
descriptions in our own words, no tips – those stay in Deep Dive 17 (Teil 7), the Formelsammlung and the detailed SQL-Belegsatz (both
linked from the panel). Where: SQL editor and SQL exercises (Belegsatz), Rechenübungen (formulas), task page and exam
(`anhangFuer` in `src/lib/anhang.ts`: Belegsatz for tasks with SQL, formulas for tasks with *berechnen*/*ermitteln*/*bestimmen*/*interpretieren* (formulas appear only in the appendix, never in the task text); an exam gets what
any of its tasks needs). `tests/belegsatz.test.ts` checks order and rendering of the rebuilt appendix.

**Post-its at the book edge and the diagram sheet (November 2026, restructuring phase 10).** On the desktop (from 1100 px) the buttons of the
`AnhangPanel` (Ausgangssituation, SQL-Belegsatz, Formelübersicht, **Diagrammelemente**) are drawn as coloured notes sticking out of the right edge of the book, with
vertical lettering – like the register letters in the Glossar. A click opens the sheet next to them and it „pops up“ (0.18 s; without animation for
`prefers-reduced-motion`); the open note stands out further and is highlighted. They are the **same buttons** as on the phone (`aria-expanded`, keyboard, Esc, focus returns,
key `A` for the Ausgangssituation, now shown in the tooltip): only the look changes, in `src/styles/postits.css` (imported last, § 3.2). Below 1100 px the button row stays in the text
as before. The sheet is **not modal** (no dimmed background): in an exam the answer fields stay usable while the Ausgangssituation is open (it covers the right part of the
page like the old side panel).
- **Diagrammelemente** is a new sheet like the one the real exam attaches to diagram tasks: per notation a table *symbol | element | meaning* (and the kinds of connections) –
  ER diagram, EPK/eEPK, BPMN 2.0, use case, activity, sequence, state and class diagram. The symbols are drawn by the app itself (`FormSymbol`, so sheet, editor and exercise
  show the same shapes); the texts are our own words (`src/lib/diagrammBeiblatt.ts`, component `components/DiagrammBeiblatt.tsx`, lazy). Where it appears: `anhangFuer` adds the
  notations that a task text names (`beiblattFuerText`: *ER-Diagramm*, *BPMN*, *EPK*, *Use-Case-Diagramm* … – drawing or reading), an exam collects those of all its tasks, and a
  **Diagramm-Übung** shows the notation of its type (`BEIBLATT_ZU_TYP`). Tests: `tests/diagrammBeiblatt.test.ts` (every palette element and connection of each editor is described, every symbol
  draws, detection on real tasks), `e2e/postits.spec.ts` (position, open/close, focus, one sheet at a time, exam answer field stays usable, phone width, axe with the sheet open, reduced motion).

### Lernplan im Kalender (October 2026)

- **Card target** (`planeLernplan`, `src/lib/lernplan.ts`, `tests/lernplan.test.ts`): only **exam cards** of the planned topics count
  (`typ !== 'begriff'`); Begriffskarten are reported separately (`begriffe`) and are optional. Goal: `ZIEL_KARTEN` (80 %) in box 3+.
  `neueKartenProTag` = (missing − cards already started) / (usable days − `CARD_INTERVALS[2]`), because a new card needs two „gewusst“
  ratings `CARD_INTERVALS[2]` days apart to reach box 3. `kartenMinutenProTag` = ratings still needed (new: 2, started: 3 − box) ×
  `WIEDERHOLUNGS_FAKTOR` × `HEUTE_ZEITEN.karte` / usable days. `/heute` shows both and points to Karteikarten for what the daily round
  leaves out. Before: all cards incl. ~800 Begriffskarten counted, giving „42 Karten pro Tag“.
- **Lernzeiten** (`Settings.lernzeiten`, optional, no version bump; read tolerantly by `leseLernzeiten` in `domain/progress.ts`):
  `{ werktags, wochenende }`, each `{ tage (Date.getDay, Mo–Fr resp. Sa/So), von 'HH:MM', minuten 5–600 }`. Missing = standard
  (Mo–Fr 18:00 for 30 min, Sa 10:00 for 60 min, `STANDARD_LERNZEITEN` in `src/lib/lernzeiten.ts`). Set in Einstellungen → „Lernzeiten“
  (`components/Lernzeiten.tsx`, weekday chips, start time, duration).
- **Kalender** (`lernTermine` + `lernplanIcs`, pure, `tests/lernzeiten.test.ts`): one event per study day from today until the day before
  the exam (without an exam date: 28 days), at the chosen local time (floating, no time zone). Title and description name the focus topics
  of that week from the Lernplan (`planeLernplan`) and the new cards and card minutes per session (per day × 7 / study days per week); the last
  `PUFFER_TAGE` are „Wiederholung & Übungsklausur“; the exam day is an all-day event. Reminder 10 minutes before (`VALARM`), fixed UIDs
  per day (re-importing updates instead of duplicating in most calendars), lines folded to 75 bytes (RFC 5545). Button „Lernplan in den
  Kalender (.ics)“ in Einstellungen and under the Lernplan on `/heute`. The older `kalenderIcs` (Daten & Import: due repetitions as
  all-day events) stays.

### Podcast (October 2026)

`/podcast` (list) and `/podcast/:topicId` (player), lazy page `pages/Podcast.tsx`, sub-target „Podcast“ under Lernen, button on every
Lernblatt with an episode.
- **Episode** (`bauePodcast` in `src/lib/podcast.ts`, pure): a dialogue of Lea (asks) and Ben (explains), built only from the content –
  Einstieg with the sheet's „Prüfungsrelevanz“, one chapter per „Teil“ with its intro and the term pages of that part (definition,
  Erklärung, Beispiel, Prüfungsfalle, Merksatz; assigned by „Mehr: Deep Dive N, Teil/N.M“, else the `quellen` comment), „Weitere
  Begriffe“, a quiz with the topic's Prüferfragen (5 s pause to think), Abschluss. No episode for WiSo (13, 14, 20), Altklausur-Training,
  topics without parts or term pages; no Fachgespräch questions (`hatPodcastThema`).
- **Speech text** (`sprechText`, `formelSprechen`): no code blocks, tables, SVG or markup; LaTeX and symbols in words („x quer“,
  „geteilt durch“, „kleiner als“, „COUNT(Stern)“), abbreviations spelled out; `saetze` splits only at punctuation followed by space.
  `tests/podcast.test.ts` checks every episode of `content/` for leftover markup or symbols.
- **Playback** (`src/lib/sprachausgabe.ts`, `Vorleser`): the browser's Web Speech API – no audio files, works offline with local voices.
  Sentence by sentence, every next step via `setTimeout` (no recursion); a failing sentence is retried once with a local voice, then
  playback stops with a message (never skips silently). Voice proposal: online natural voices from Germany first, offline local ones; Lea
  female, Ben male if the names allow it. Speed, voices and the position per episode are kept in `localStorage` (comfort, not progress);
  Media Session handlers for headset buttons. Limitation: some phones stop speech when the screen locks.

### Editor-Aufgaben: Modellieren ohne Vorlage (October 2026)

Sheet tasks that ask for a model get an editor instead of the text field – on `/aufgabe/:id`, in the Übungsklausur and in mixed exams.
Nothing is pre-filled: you build the whole solution yourself, submit, and grade yourself against the model solution as before.
- **Detection** (`editorFuer` in `src/lib/editorAufgabe.ts`, pure): only `offen` tasks without SQL exercise, by the task text – Normalform /
  „1.–3. NF“ + *überführen/normalisieren/bringen* → `normalform`; Relationenmodell/-schreibweise, Star-/Snowflake-Schema + *überführen/entwerfen/
  erstellen/modellieren* → `relationen`; otherwise a create operator (*erstellen, modellieren, zeichnen, skizzieren, entwerfen*, „Setzen Sie … um“)
  plus ER-Diagramm/ERM → `erm`, BPMN → `bpmn`, (e)EPK → `epk`, Use-Case-/Anwendungsfalldiagramm → `usecase`. Word boundaries are Unicode-aware
  (`` would miss „*Überführen*“). Today: 02-B1 erm, 02-B2 relationen, 02-C1 normalform, 05-B1 bpmn, 08-C1 relationen, 15-E1 usecase, 18-B3 epk;
  Altklausur-Training: 21-A1 and 22-B1 aktivitaet, 21-B3 and 28-D1 epk, 27-B2 bpmn, 31-B1 normalform
  (exact list tested; tasks that only *talk about* a diagram – 05-B2, 08-C3, 15-E2, 18-B2 – stay text tasks). Sheets are unchanged.
- **Answer format**: still a string (`Attempt`/`ExamRun.answers` unchanged, no version bump): JSON `{ editor, knoten, kanten, notiz? }`
  (diagram) or `{ editor, schritte: [{ titel, text, tabellen }], notiz? }` (tables), validated with zod on read (`leseEditorAntwort`); an empty
  editor is stored as `''` (counts as „not answered“ in the exam); a plain text (e.g. an exam started before this change) is kept in `notiz`.
  `antwortAlsText` describes the drawing for the AI grading.
- **Diagram editor** (`components/DiagrammEditor.tsx`, logic in `src/lib/diagrammEditor.ts`): palette per notation (`NOTATIONEN`, shapes
  drawn by `FormZeichnung` from `DiagrammSvg.tsx`, so it looks like the Diagramm-Übungen and DD17); tap a shape → it is inserted (inside a
  selected pool/lane/system boundary; with „an Auswahl anhängen“ next to/below the selection and connected); drag to move (containers take
  their content along), blue dot → drag (or „Verbinden mit …“ + tap) to connect, square → resize; edge type and label/cardinality in the
  „Auswahl“ panel (ERM quick buttons (0,1) … m; the cardinality sits at the entity end); parallel edges (recursive relationship) are offset.
  New edges get a sensible type (`standardKante`: BPMN across pools → Nachrichtenfluss, EPK org/info → Zuordnung, use case ↔ use case →
  «include»). Undo/redo (Strg+Z/Y), arrow keys move, Entf deletes, zoom (phones start at 60 %), full screen. Pointer Events like the
  Diagramm-Übungen; no HTML5 drag and drop.
- **Formprüfung** (`pruefeDiagrammAntwort`): hints only, no points – missing labels/connections; EPK and BPMN reuse `formregeln` of the
  Diagramm-Übungen plus: EPK branches only via connectors, org/info only by Zuordnung at functions; BPMN no sequence flow across pools, no message
  flow inside one, start/end events, labelled XOR paths, elements outside every pool; ERM no entity–entity line, cardinality on every
  entity–relationship edge, relationship with two entity ends, attribute at one element, key attribute; use case actors outside the boundary,
  «include»/«extend» only between use cases. Shown on demand while working on a single task („Form prüfen“, not in the exam – like on paper)
  and after submission next to the model solution. Tests build the model solutions of 02-B1 and 18-B3 and require zero hints.
- **Table editor** (`components/TabellenEditor.tsx`, logic in `src/lib/tabellenEditor.ts`): one step per normal form (as many as the highest
  NF in the task) with a text field for the dependencies; tables with PK/FK toggles, FK target, column actions (move left/right, move or copy to
  another/new table, delete), optional data rows (duplicate a row to split a non-atomic value); „Ausgangstabelle … übernehmen“ (Markdown
  tables of the exam attachments, `anlageTabellen`) and „Aus „1. NF“ übernehmen“. Live relation notation like the sheets (`relationText`:
  bold = PK, ↑ = FK).
- **Abgleich** after submission (`musterTabellen` + `gleicheAb`): reads the model solution's relations (`- name(**pk**, a, b↑)`, bold may span
  several columns, „…“ = more columns allowed), tables with bold header cells (1. NF) and „Spalte | Art“ tables (star schema); split by
  „**a)** … **b)**“ into one list per step if the counts match, else all to the last step. Each model table gets your most similar table (same
  name first, else column overlap ≥ 0.3) and shows missing/extra columns, PK and unmarked FKs. Wording makes clear names may differ.
- Lazy chunk `EditorAntwort` (~10 KB gzip), loaded only for such tasks. Tests: `tests/editorAufgaben.test.ts`.

### Deine Antwort (phase 8.2)

In "🃏 Aufdecken" a textarea "✍️ Deine Antwort (optional)" sits **below** the card (outside the clickable `role=button` card, so typing never
flips it). After flipping, `AntwortVergleich` shows your text (plain text, `pre-wrap`) next to the model answer (stacked below 600 px).
**Strg+Enter** flips. The global shortcuts (Space, 1–3) ignore events from `input`, `select`, `textarea` and `contenteditable`. The text lives
only in `useCardSession` state and is cleared for the next card – **not persisted**. Components in `components/EigeneAntwort.tsx`.

### Selbsteinschätzung „Wie sicher bist du?“ (phase 8.3)

- Single tasks and exams ask before submitting (optional; clicking the chosen level again clears it): 1 😟 unsicher · 2 🤔 teils · 3 💪 sicher
  (`components/SicherheitWahl.tsx`, `aria-pressed`). Single task: stored with the attempt; exam: `activeExam.sicherheit[taskId]` (only before
  submission, `useExamRun.setSicherheit`), copied into each attempt by `finishExam`. After revealing, "Deine Einschätzung: …" is shown.
- **Calibration** (`src/lib/kalibrierung.ts`, pure): per level the number of attempts, how many were **"richtig" = at least `SICHER_RICHTIG_AB` = 80 %
  of the points** (≈ grade 2; full points are rare for open tasks), the rate and the average score. Dashboard card "🎯 Selbsteinschätzung" (only
  with data): "Bei „sicher“ lagst du in 64 % richtig (7 von 11 Aufgaben · Ø 78 % der Punkte)". Hint from `KALIBRIERUNG_MIN` = 5 attempts per
  level: "sicher" < 70 % → "⚠️ Vorsicht, falsche Sicherheit"; "unsicher" ≥ 70 % → "Du kannst mehr, als du denkst"; otherwise "passt".
- Format decision: see § 6 (optional fields, no version bump).

### Operatoren (phase 8.4)

- **Data** `src/lib/operatoren.ts` (`OPERATOREN`, 29 entries): every operator that appears in italics in the Übungsklausuren plus the du-forms of the
  Rechenübungen – nennen, angeben, benennen, notieren, definieren, beschreiben, darstellen, skizzieren, zeichnen (Anforderungsbereich I);
  berechnen, ermitteln, bestimmen, zuordnen, erstellen, formulieren, erläutern, erklären, vergleichen, abgrenzen, interpretieren, analysieren,
  prüfen, durchführen, ableiten (II); begründen, beurteilen, bewerten, entwickeln, entwerfen (III). Each with `verlangt` (one sentence), typical
  `punkte`, a `tipp` and its trigger forms. Most frequent in `content/` (tasks containing it): erläutern 61, nennen 43, berechnen 31, angeben 23,
  beurteilen 23, begründen 18, benennen 14, beschreiben 14, zuordnen 14; 188 of 258 tasks contain at least one.
- **Tokenizer** `findeOperatoren(text)` (pure, tested): the Sie-form (= infinitive) only with "Sie" right after it ("*Nennen* Sie", "und *begründen* Sie");
  the du-form at the start of a (partial) sentence ("Berechne …", "… und gib … an"); separable verbs only with their particle in the same sentence
  ("Geben Sie … an" → angeben, "Stellen Sie … dar" → darstellen, "Grenzen Sie … ab", "Leiten Sie … ab", "Führen Sie … durch"; "Ordnen Sie" counts
  as zuordnen even without "zu"). So "Stellen Sie sich vor", "an dieser Stelle" or "Wie würden Sie das bewerten?" are not marked. Only the verb is
  marked. 304 of 306 italic operator forms in the tasks are recognised (the two misses are "geben Sie … Beispiele / eine Empfehlung" without "an").
- **Marking** `rehypeOperatoren` (`src/lib/operatorStil.ts`) runs on the HTML tree, only for `<Markdown operatoren>` = `TaskText` (single tasks and
  exams; not solutions, theory, flashcards or `/druck`). Per block (p, li, td, th, headings) the text nodes are joined (so "*Geben* Sie … *an*"
  across nodes works) and split at the hits into `<span class="operator" data-operator="…">`; code, links and formulas are skipped, the Markdown
  source is never changed. `components/OperatorTipp.tsx` renders it focusable (`tabindex=0`) with a `role="tooltip"` linked by `aria-describedby`,
  visible on hover and keyboard focus; Escape leaves it; hidden in print.
- **Trainer** `/material/operatoren` (lazy `pages/Operatoren.tsx`): quiz `operatorFrage(aufgaben, zufall)` – a random real task with an operator,
  "Was verlangt der Operator „…“ hier?", 4 answers (`verlangt` texts: the right one plus 3 others, at least one from another Anforderungsbereich),
  feedback with points and tip, score of this visit (not stored); table of all operators with Anforderungsbereich, requirement, points, tip and the
  number of tasks using it.

### Gemischte Probeklausur (phase 8.5)

- **Assembly** `baueMischKlausur(content, bereich, seed)` in `src/lib/mischKlausur.ts` (pure, `tests/mischKlausur.test.ts`). Three variants like the
  written AP2 parts: `prozess` ("Durchführen einer Prozessanalyse", Themenblock A1–A4), `qualitaet` ("Sicherstellen der Datenqualität", B1–B4) and
  `gemischt` (all eight). WiSo (DD13/14) is not used – it is its own 60-minute part with bound tasks.
- **Weights** = number of checklist items (`- [ ]`) under each `### A1 …` heading of the topic list (MaterialDoc `themenliste-beispielfragen`,
  `gewichteAusThemenliste`; today A1 7, A2 6, A3 5, A4 3, B1 7, B2 8, B3 4, B4 6; `FALLBACK_GEWICHTE` if the file is missing). 100 points are
  distributed by largest remainder (`verteile`; e.g. Prozessanalyse 33/29/24/14).
- **Sources** (`UNTERBEREICHE`, checked by a test against `content/`): A1 → DD5 A–C; A2 → DD12 A, B, C, E + DD15 D; A3 → DD12 D, DD5 D, DD16 A–C;
  A4 → DD5 E, DD10 C; B1 → DD1, SQL-Zusatz, DD2, DD8, DD15 A–C/E; B2 → DD9, DD3, DD4, DD6, DD7, DD11; B3 → DD10 D, E + DD16 D, E; B4 → DD10 A–C.
- **Filling**: each sub-area becomes one block (A, B, …). Its candidate blocks are shuffled with the seed (`erzeugeZufall`); from each block
  the longest **prefix** of tasks (A1, A1+A2, …) that still fits the target is taken – prefixes keep tasks that build on each other together,
  and the block intro (data, scenario) comes along. A second pass fills missing points in the sub-area furthest below its target, with
  the prefix closest to the gap (also continuing a block already used there). Never above 100 points, never a task twice. Up to
  `MISCH_VERSUCHE` = 8 derived arrangements are tried and the first with exactly 100 wins (over 500 seeds: 99.4 % / 82 % / 99 % exactly 100
  for gemischt/prozess/qualitaet; otherwise 98–99, never less – documented deviation from "100 points").
- **Id** `mix-<bereich>-<seed>` (`mischId`, `parseMischId`) is stored in `ExamRun.topicId` – no format change; `klausurFuer(content, id)` rebuilds
  the exam from it (same content + seed → same exam). If the content changes while a mixed exam runs, the exam is rebuilt from the new content.
- **UI**: `/klausur` card "🎲 Gemischte Probeklausur" with one button per variant (new random seed each click, `neuerSeed`). The start page shows
  each block with its sources ("Deep Dive 5 · Block C – Kennzahlen (C1, C2)"), "🎲 Neu mischen" and the variant switch. `useExamRun`, the exam
  page (groups with their source heading and intro), the attachments (all attachments/intros of the used Deep Dives, prefixed with the Deep
  Dive), `/druck?thema=mix-…` (`examSheet`) and the result page work as for a topic exam.
- **Statistics**: `topicStats`/`examTrends` only look at exams whose `topicId` is a topic, so per-topic trends and best scores ignore mixed exams;
  the single attempts count as usual (task averages, journal, calibration). Dashboard "Ø Übungsklausuren" includes them, "Letzte Klausuren"
  names them "🎲 Gemischt (…)" (`klausurName`).

### Ausgeblendete Lösungsbeispiele (phase 8.6)

- **Stage** `beispielStufe(state)` (`src/rechnen/beispiel.ts`, pure, `tests/beispiel.test.ts`) from the stored `RechenState` (no format change):
  never checked → `voll` (complete worked example before the inputs); checked but not solved, or back on repetition stage 1 (wrong or solution
  shown) → `luecke` (the **last** step is hidden: "✏️ Diesen Schritt rechnest du selbst." – backward fading); solved and not just reset →
  `ergebnis` (no example; a hint "🎯 Ohne Beispiel …"). The stage is taken when the page opens (`useRechenUebung`), a check doesn't change it mid-way.
- **No leak**: exercises with a template and "Neue Zahlen" (79 of 85) show the example with **other numbers** – seed `beispielSeed(id, currentSeed, n)`
  (never the current seed), data must differ, of up to `BEISPIEL_VERSUCHE` = 6 seeds the one with the fewest equal asked results. A step whose
  result still equals one of the current asked values (e.g. buffer 0, unchanged x values) shows only its formula. Fixed exercises without
  "Neue Zahlen" (2: `RE-PM-006`, `RE-WI-009`) show only step titles and general formulas (formulas with concrete numbers are hidden,
  `formelMitZahlen`); exercises without a Rechenweg (4) have no example. A test runs every exercise of `content/` with original and new numbers.
- **UI**: `<details class="beispiel">` "📘 Beispiel: so rechnest du das (andere Zahlen)" (open at `voll`, closed at `luecke`) with the example's
  task text and data table and the `Rechenweg` with `sicht` per step (`ganz` | `formel` | `verdeckt`). KaTeX (Rechenweg chunk) now loads when an
  exercise with an example opens, not only with the solution.

### Fehlergründe (phase 8.7)

- After the self-assessment **below full points** the task page and the exam (after submission, per task) ask "Woran lag's? (optional)":
  🔀 Begriff verwechselt (`begriff`), 📐 Formel falsch (`formel`), 🧮 Rechenfehler (`rechenfehler`), 🗣️ Operator nicht beachtet (`operator`),
  ⏱️ Zeit (`zeit`) – `components/FehlergrundWahl.tsx`, clicking again clears it. Task page: before or after saving (`setzeFehlergrund` updates
  the saved attempt by task id + date). Exam: `activeExam.fehlergrund[taskId]` (`useExamRun.setFehlergrund`, only after submission),
  copied into the attempts by `finishExam` only if the score is below the task's points.
- **Evaluation** `src/lib/fehlergruende.ts` (pure): `fehlerStatistik(attempts)` counts reasons of attempts below full points, most frequent first;
  `haeufigster` only without a tie. Card "🧩 Woran es meistens liegt" (`components/FehlergrundKarte.tsx`, Dashboard and Fehlerjournal, only with
  data): most frequent reason with a tip and a link (Abgrenzungs-Karten, Formelsammlung, Rechenübungen, Operatoren-Trainer, Übungsklausur).
  The Fehlerjournal shows the reason of the last attempt per open entry. Format: § 6.
