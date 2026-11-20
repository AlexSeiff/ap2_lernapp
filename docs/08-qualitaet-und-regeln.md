# AP2 Lern-App – Quality gates and rules for changes

> Part of the technical documentation (sections 9–10). Overview: [DOKUMENTATION.md](../DOKUMENTATION.md).

## 9. Quality gates

```bash
npm test            # Vitest: parser (fixtures), smoke test on real content/, progress migration, stats, SQL checker/lint/errors/runner,
                    # Rechenübungen (templates, properties, checker, content, pages)
npm run typecheck   # tsc -b (tsconfig.app.json: src + domain without Node types; tsconfig.node.json: build, tools, tests)
npm run lint        # ESLint flat config, typescript-eslint, react-hooks, --max-warnings=0
npm run format:check
npm run build        # tsc -b, then vite build; fails on ImportIssues in content/
npm run test:e2e     # builds, then Playwright browser tests against `vite preview` (port 4174); locally the installed Edge, in CI Chromium
npm run import-report # must end with „Hinweise (0)“
```

The CI runs the same chain (`.github/workflows/pages.yml`); only `main` deploys.

- Tests read the real sheets in `content/` (smoke tests) and small fixtures in `tests/fixtures/`.
- The SQL content smoke test runs every setup and solution in Node (sql.js), checks unique IDs, dataset integrity against the DD1 tables
  and that no model solution triggers its own dialect warnings.
- Rechenübungen: `rechenVorlagen.test.ts` (each template reproduces the sheet example), `rechenEigenschaften.test.ts` (every template over
  150 seeds: valid data, finite results, plausible ranges, Fehlerbilder ≠ right value after rounding, the checker accepts the shown right value
  and recognises every Fehlerbild), `rechenChecker.test.ts`, `rechenUebungen.test.ts` (parser), `rechnenProgress.test.ts`,
  `rechenInhalte.smoke.test.ts` (content/: no ImportIssues, 100 seeds per exercise, fixed exercises match the numbers of the sheet solutions)
  and `rechnenSeiten.test.ts` (server-side render of both pages for every exercise).
- Leicht-Modus: `leicht.test.ts` (card selection, option building: exactly 4, correct one included, no duplicates, shuffled; all real cards;
  filter counts), `logic.test.ts` (box cap), `leichtRechnen.test.ts` (Rechnen options incl. every exercise of `content/` with several seeds,
  checker agrees; progress), `leichtSeiten.test.ts` (render of Karteikarten and every Rechenübung in Leicht), `lernkarten.test.ts` (`mc` block).
- Phase 4.4/4.5: `math.test.ts` (every formula in `content/` renders with KaTeX, no result inside a formula), `druck.test.ts` (`/druck` renders
  every solution sheet with formulas, no `katex-error`), `loesungStil.test.ts` (result box after a formula), `formeln.test.ts` (every template has
  formulas, no unknown template ids, valid KaTeX, Rechenwege use the formulas, Formelsammlung page, Material link, `?vorlage=` filter).
  `rechenInhalte.smoke.test.ts` reads numbers inside formulas as text (`70{,}00` = 70,00).
- Phase 7: `pwa.test.ts` (manifest paths relative, icons exist in the declared size, precache patterns, prompt update; update state),
  `navigation.test.ts` (bottom bar groups, badges, render).
- Phase 8.1–8.4: `heute.test.ts` (planner: weakest topic, exercises, journal share, cards incl. settings and Leicht, interleaving, day seed,
  real content; session), `heuteSeite.test.ts` (`/heute`, Dashboard button, `?karten=`), `eigeneAntwort.test.ts`, `kalibrierung.test.ts`
  (calibration, threshold, `finishExam`, `SicherheitWahl`), `sicherheitSeiten.test.ts` (task, exam, Dashboard card), `progress.test.ts`/
  `mergeProgress.test.ts` (v6 fixture, `sicherheit` migration/schema/merge), `operatoren.test.ts` (tokenizer incl. false positives, coverage of
  the italic operators in `content/` > 95 %, marking keeps Markdown and skips code, quiz), `operatorenSeite.test.ts` (trainer, Material tile, task page).
- Phase 8.5–8.9: `mischKlausur.test.ts` (weights from the topic list, distribution, sources exist, points ≤ 100 and ≥ 98, no duplicates, spread,
  reproducible by seed, prefixes with intro, attachments, ids, statistics ignore mixed exams, `/druck`, pages), `beispiel.test.ts` (stage,
  visibility, seed, every exercise without leaked results, Rechenweg `sicht`, page), `fehlergruende.test.ts` (statistics, `setzeFehlergrund`,
  `finishExam`, exam/journal/Dashboard pages) plus `progress.test.ts`/`mergeProgress.test.ts` (`fehlergrund` migration/schema/merge),
  `suche.test.ts` (normalisation, plain text, index and targets, settings, ranking, snippet, dialog, card selection), `glossar.test.ts`
  (card questions, term filter, definitions from lines, dedupe, sorting, sources, search, page), `diagramme.test.ts` (SVG allow-list, rendering
  as figure or code, every diagram in `content/` valid with unique ids, Deep Dive 17 structure, topic list A–Z complete, bold-free, not searched).
- Plan phase 8: `quellen.test.ts` (import with skipped entries, unknown targets, real file: no issues, > 300 entries, every target exists, https
  only; sheet and term page show the links with `target="_blank"`; no iframe and no YouTube address before the click; Datenschutz; grouping).
  Links themselves are checked by `npm run quellen-pruefen` (network, not part of `npm test`).
- Plan phase 9: `uebersicht.test.ts` (every Deep Dive in exactly one Prüfungsbereich and consistent with `UNTERBEREICHE`; ring counts:
  box 3 vs 2, 80 % vs 70 %, solved SQL and diagram; due counts; term of the day fixed per day and varying; exam history; reading position;
  rings and mini rings; page: all widgets, no `.bar`, every topic row with labels, countdown and exams with data).
- Plan phase 10: `performance.test.ts` (core + texts give exactly the content again, section ids unique, core < 75 %, missing text throws,
  Pages build emits core/texts/term pages and the preload; Lernblatt and Glossar show „Lädt …“ with the core and render normally with the full
  content; text request from the address; glossary/search index/Leicht caches; hyphen words equal to the old regex on all texts; Markdown fast
  path: detection and identical HTML for every plain text in `content/`).
- Editor-Aufgaben: `editorAufgaben.test.ts` (detection on `content/` = exact list, string round trip and text fallback, geometry, form rules
  incl. the model solutions of 02-B1/18-B3 without hints, model tables of 02-C1/02-B2/08-C1, comparison finds typical mistakes, editors render
  without any answer content, submitted view, grading aids, task page loads the editor).
- November 2026: `details.test.ts` (Übersicht renders with the start file alone, `useStore()` throws without details, `<MitDetails>`
  shows „Lädt …“ until then, details requested at start for sub pages) and `performance.test.ts` (start + details give the core again,
  start at most half the size, mismatching versions throw, the plugin emits `details.json`).
- **Browser tests** (`e2e/`, Playwright, new in the November 2026 restructuring; `playwright.config.ts`; every test starts with an empty browser profile, the
  service worker is blocked, the real progress is never touched): `rauch.spec.ts` (smoke paths: rate a card, hand in an exam, download/delete/restore a
  backup, SQL, diagram exercise, search, theme, Rechenübung with solution, diagram editor, table editor), `handy.spec.ts` (no horizontal overflow at phone
  width), `zugaenglichkeit.spec.ts` (axe-core, WCAG 2.1 A/AA, 17 pages × light/dark; serious/critical violations fail the test; known open ones are listed in the
  file), `zweiTabs.spec.ts` (two tabs: nothing is lost, no reload loop, a running card round and a half-written exam answer survive), `speicher.spec.ts` (the
  move from `localStorage` to IndexedDB and the fallback). The helper `lernstand()` in `e2e/hilfen.ts` reads IndexedDB and **does not open a missing database**
  (that would stop the app from creating its store).
- **Pixel comparison** (`e2e/visuell.spec.ts`, only with `E2E_VISUELL=1`, reference images local in `e2e-visuell/`): for refactorings that must not change the
  look (§ 3.2). Allow 0 differing pixels; masks only for content that changes by itself (import time on `/daten`).
- **Equality tests** that pin behaviour before a refactoring: `umbauGleichheit.test.ts` (SHA-256 of every file the build emits from `content/`, and every real progress
  file in `data/` survives migration and a JSON round trip), `rechenVorlagenGleichheit.test.ts` (task, solution, worked solution and typical mistakes of all
  Rechenübungen for fixed seeds; renew the snapshot only on purpose: `npx vitest run tests/rechenVorlagenGleichheit.test.ts -u`), `inhaltsdateien.test.ts`
  (which files are content), `vorlagen.test.ts` (every Rechenvorlage: required fields, schema, finite results, reproducible), `idbFortschritt.test.ts` (IndexedDB store, move
  from `localStorage`, simultaneous saves, all real progress files), `diagrammPlatz.test.ts` (where a new diagram element appears).
- One commit per logical change; formatting-only changes in their own commit.

## 10. Rules for future changes (for AI agents)

1. **Never lose progress.** Schema change ⇒ migration + test with the old fixtures. Old backups must still import.
2. **Never break Pages.** Check `npm run build` + `npm run preview` for anything touching loading, paths, WASM or storage.
   A broken service worker hits every user: keep `registerType: 'prompt'` and relative paths, and check that `sw.js`, `manifest.webmanifest`
   and every precached URL answer 200. A new file type the app loads at runtime must be added to `globPatterns`, or it is missing offline.
3. **Multi-user on Pages:** no personal data, dates or names in code or UI; per-user settings go into progress (so they are in the backup)
   or `localStorage`; no server, no tracking.
4. Keep content read-only in the app; content changes are edits in `content/` (`CONTRIBUTING.md`).
5. Pure logic in `domain/` or `src/lib/` with tests; pages mostly render.
6. German UI, existing tone and style (2 spaces, single quotes, printWidth ~140, trailing commas).
7. **Section texts are not in the store** (§ 3.1): a page that needs `Section.markdown` uses `useThemaTexte` or `useVollerInhalt`; lib
   functions that don't need texts take `KernInhalt`. Keep the main bundle small: new pages are lazy, and add them to `SEITEN` in `App.tsx`.
8. **Card and task texts are not in the start file** (§ 3.1): the Übersicht and everything in the app frame use `useStartStore()` and
   must not read `question`, `answer`, `markdown` or `solution`; new routes go inside the `<MitDetails>` layout route. A new text
   field of cards or tasks belongs into `KARTEN_TEXT` / `AUFGABEN_TEXT` (`domain/texte.ts`). No server, no API key in the app.
9. **Styles:** all CSS lives in `src/styles/`; the import order in `index.css` is binding (§ 3.2). A change that must not change the look is checked with the pixel
   comparison before and after; do not merge the three design layers rule by rule.
10. **New kinds of content:** a new JSON file kind gets its pattern in `domain/inhaltsdateien.ts` (the one place), a block in `buildContent` and a section in
    `tools/report.ts`. A new Rechenvorlage goes into `src/rechnen/vorlagen/index.ts`; `tests/vorlagen.test.ts` then checks it automatically, and the equality test
    shows what changes for the existing exercises.
11. **Storage:** the progress format, the IndexedDB name/keys and the move from `localStorage` change only with a migration and tests (§ 6). The old `localStorage`
    entry stays as a fallback and is never deleted by new code without an explicit decision. Before creating a test file, check that the name is free (`ls tests/`): an
    existing test of the same name must never be overwritten.
