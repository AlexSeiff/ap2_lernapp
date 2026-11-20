# AP2 Lern-App – SQL editor (and removed AI)

> Part of the technical documentation (sections 7–8). Overview: [DOKUMENTATION.md](../DOKUMENTATION.md).

## 7. SQL editor

**Decisions**
- Engine **sql.js** (SQLite/WASM, ~1 MB), in a **Web Worker** with a 3 s timeout (worker is killed and restarted), lazy-loaded
  with the SQL routes. WASM imported via `?url`, so it works with `base: './'` on Pages.
- Editor **CodeMirror 6** + `@codemirror/lang-sql`, autocomplete of the dataset's tables/columns, Tab accepts completion.
- Shortcuts: `Strg+Enter` run, `Strg+Shift+Enter` check.

**Free mode** (`/sql`): dataset selector, schema browser (row counts, PK/FK markers, click inserts the column), reset DB, examples,
multiple statements (last SELECT shown, DML row counts), max 500 displayed rows, query history (last 30, localStorage) and draft protection.
`NULL` shown greyed and italic; numbers right-aligned.

**Exercises**: list with filters in the URL and progress bar; single exercise with "▶ Ausprobieren" (doesn't count), "✓ Prüfen" (counts),
graded hints, "Lösung zeigen" (after confirmation; then counts as "mit Lösung", comes back for repetition), side-by-side comparison, diff view.

**Checking** (`src/sql/checker.ts`, pure): user query and model solution each run on a **fresh** DB; DML/DDL are checked through
`pruefabfrage`. Compares column count, optional required column names, values (numeric tolerance, `NULL` ≠ `''` ≠ `0`, text exact),
order (`streng`, or `auto` = strict if the solution has a top-level ORDER BY). If the dataset has a `variante`, the query must also match
on the changed data (anti-hardcoding). Feedback like "2 Zeilen fehlen, 1 Zeile zu viel" without giving the solution away.

**German error hints** (`errors.ts`, table-driven): unknown table/column with closest match, ambiguous column, aggregate in WHERE,
syntax error, MySQL date functions → `strftime`, constraint violations. `PRAGMA foreign_keys = ON` in every setup.

**Dialect warnings** (`lint.ts`, token-based): bare column not in GROUP BY, alias in WHERE, `"text"` as a string (these block "gelöst"),
integer division, LIKE case sensitivity, loose DECIMAL/DATE types (info).

**Progress**: `SqlState` per exercise; wrong or "Lösung gezeigt" → due in 1 day, then stages 3 and 7 days (`JOURNAL_INTERVALS`).
SQL exercises are deliberately **not** in `attempts`/`journal`. Checked exercises count for the streak (`sqlDays`).

**Integration**: ```` ```sql ```` blocks in the Lernen pages/solutions get "🧮 Im SQL-Editor öffnen" (dataset derived from the source);
hidden in task texts and exams (`source={false}`), so the editor doesn't reveal results.

**Tasks answered in the SQL editor** (`Task.sqlUebung`, see § 4.3): `AnswerInput` renders `SqlAntwort` (lazy, CodeMirror) instead of
the textarea; the answer stays a plain string (the query). Einzelaufgabe: „Ausprobieren“ on a fresh copy of the dataset; Übungsklausur
(`sqlAusfuehren={false}`): no execution and no session database, like on paper. After „Abgeben“ `GradePanel` shows `SqlPruefung`
(lazy): `pruefeAntwort` (`src/sql/pruefeUebung.ts`, shared with the exercise page's `checkQuery`) compares with the exercise's
solution incl. variant and blocking dialect warnings. Correct and not `teilaufgabe` → full points pre-filled (only if no points yet);
empty answer → 0; otherwise self-grading as usual. Einzelaufgabe also records the check for the exercise (`recordSqlCheck`), the exam
does not. The exercise page links back („Auch als Klausuraufgabe“). Tests: `sqlAufgaben.smoke.test.ts` (real content: every linked
task accepts its solution and typical exam answers, wrong ones fail), `sqlChecker.test.ts` (`spaltenFrei`), `sqlUebungen.test.ts` (links).

## 8. AI (removed)

The app has no AI features. Task generation and grading with Claude existed only in the local mode and were removed with it in
November 2026 (`server/ai.ts`, `/generator`, the "KI-Bewertung" button, `@anthropic-ai/sdk`). `/generator` redirects to `/`.
