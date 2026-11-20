# AP2 Lern-App – Architecture

> Part of the technical documentation (section 3). Overview: [DOKUMENTATION.md](../DOKUMENTATION.md).

## 3. Architecture

Stack: React 19, Vite 8, TypeScript 7 (`@typescript/native` for `tsc`; TypeScript 6 under the name `typescript` for typescript-eslint),
Vitest 5, Playwright + axe-core (browser tests), React Router 7 (HashRouter), react-markdown + remark-gfm, remark-math + rehype-katex + KaTeX (formulas, lazy chunk), zod 4,
sql.js (SQLite/WASM), CodeMirror 6.

```
lern-app/
├─ domain/            used by app, build and tests (no file-system access)
│  ├─ config.ts         constants: EXAM_MINUTES (fallback; the duration per exam comes from its title), NEW_PER_SESSION, JOURNAL_INTERVALS, CARD_INTERVALS, SAVE_DELAY_MS, DEV_PORT,
│  │                    HEUTE_MINUTEN / HEUTE_ZEITEN / HEUTE_KARTEN_BLOCK (8.1), SICHER_RICHTIG_AB (8.3)
│  ├─ types.ts          content model (Topic, Task, Flashcard, Deck, Exam, SqlDataset, SqlExercise, Content …)
│  ├─ parser.ts         Markdown sheet + solution parser (pure, line/regex based); buildContent() assembles everything
│  ├─ inhaltsdateien.ts the file-name patterns of the JSON content files (one place; used by buildContent and build/inhalt.ts)
│  ├─ prueferfragen.ts  Prüferfrage blocks: read, split and strip (pure)
│  ├─ lernkarten.ts     flashcard JSON import (zod, ImportIssues)
│  ├─ sqlUebungen.ts    SQL exercise JSON import (zod, ImportIssues)
│  ├─ rechenUebungen.ts Rechenübungen JSON import (zod, ImportIssues); the template check is injected (BuildOptions.pruefeRechenUebung)
│  ├─ progress.ts       persisted progress: types, zod schema, migrateProgress, isSuspiciousAttemptDrop
│  ├─ mergeProgress.ts  merge a backup into the current progress (Daten & Import → Zusammenführen)
│  ├─ rechenweg.ts      RechenSchritt type + German number formatting for worked solutions (Rechenweg)
│  ├─ texte.ts          content split: StartInhalt (content.json) + Details (card/task texts) + texts per topic; teileInhalt,
│  │                    inhaltMitDetails, inhaltMitTexten (§ 3.1)
│  └─ api.ts            types of the browser backups (BackupInfo, BackupItem)
├─ build/             runs in Node: Vite plugins and content loading (tsconfig.node.json)
│  ├─ inhalt.ts         reads content/*.md and the JSON files → buildContent() (Rechenübungen are checked against their template
│  │                    here → ImportIssues); imports three pure modules from src/ (glossar, glossarThema, rechnen/pruefen)
│  ├─ inhaltPlugin.ts   inhaltDateien(): content.json (start), details.json, texte/<id>.json, begriffe.json – emitted in the build,
│  │                    served from memory in dev; preload tag for content.json; the build fails on ImportIssues
│  └─ pwaPlugin.ts      vite-plugin-pwa options (manifest, precache) (PWA_OPTIONS, tested)
├─ tools/             npm scripts run with tsx
│  ├─ report.ts         npm run import-report
│  └─ quellenPruefen.ts npm run quellen-pruefen (re-check every link of AP2_Quellen.json)
├─ content/           the learning sheets and JSON files – the only source (committed, therefore public)
├─ public/icons/      PWA icons (192, 512, maskable 512, apple-touch-icon 180), generated once from the desktop icon
├─ src/
│  ├─ pages/            one file per page, mostly rendering; large pages keep their parts in a folder next to them: uebersicht/ (widgets of the
│  │                    Übersicht), karten/ (card rounds, filter, deck table), rechenuebung/, klausur/ (selection, result)
│  ├─ styles/           all CSS: tokens.css, 01–08 base styles, apple/paper/notizbuch layers, index.css = binding import order (§ 3.2)
│  ├─ hooks/            useExamRun, useCardSession (+ useCardFilters), useSqlSession, useRechenUebung, useConfirm, useBackupDownload,
│  │                    useHeute (running „Heute lernen“ session)
│  ├─ components/       diagramm/ (parts of the diagram editor and drawing), tabellen/ (table editor card),
│  │                    AnswerInput, Markdown (+ MathMarkdown, markdownComponents), TheoryMarkdown, Rechenweg, TaskParts, ErrorBoundary,
│  │                    ConfirmDialog, SqlEditor, ResultTable, SchemaBrowser, Buch (notebook frame: Inhaltsseite, Register, Kopfzeile), Kaestchen (squared progress bars, tally marks), UpdateHinweis (PWA toast),
│  │                    HeuteLeiste, EigeneAntwort, SicherheitWahl, OperatorTipp, FehlergrundWahl + FehlergrundKarte (8.7),
│  │                    SucheDialog (8.8, lazy) (phase 8)
│  ├─ lib/              pure logic (progress, grading, stats, cards, leicht + leichtRechnen (Leicht-Modus), shuffle, examTimer, sheets, sql, sqlLinks, loesungStil, mathDollar,
│  │                    rechnen (RechenState updates/selectors), wiederholung (repetition stages, SQL + Rechnen), uebungLabels)
│  │                    + store.tsx (React context), progressSaver.ts, api.ts, staticApi.ts, progressSchreiben.ts (pure save logic), idbFortschritt.ts
│  │                    (IndexedDB store), localFortschritt.ts (localStorage store), fortschrittSpeicher.ts (which store + the one-time move, § 6),
│  │                    diagrammPlatz.ts (placement of new diagram elements),
│  │                    backup.ts, browserBackups.ts (IndexedDB), backupReminder.ts, persistentStorage.ts, pwa.ts (service worker registration),
│  │                    navigation.ts (bottom bar groups, pure), heute + heuteSitzung (8.1), kalibrierung (8.3), operatoren + operatorStil (8.4),
│  │                    mischKlausur (8.5), fehlergruende (8.7), suche + normalisiere (8.8), glossar (8.9),
│  │                    texte (load section texts, hooks), suchIndex (search index cache), markdownSchlicht (Markdown fast path) (plan phase 10)
│  ├─ rechnen/          Rechenübungen (pure, no React): typen.ts, zufall.ts (seeded PRNG), hilfen.ts (statistics helpers, LoesungsBau,
│  │                    vorlage()), vorlagen/*.ts (36 templates, index.ts = registry; duplicate ids abort loading), instanz.ts (baueInstanz), pruefen.ts (import check),
│  │                    checker.ts (input checking + Fehlerbilder), formeln.ts (Formelsammlung data, also used by the Rechenwege),
│  │                    beispiel.ts (faded worked examples, 8.6)
│  └─ sql/              sqlWorker.ts, engine.ts, runner.ts, checker.ts, errors.ts, lint.ts, types.ts
├─ e2e/               Playwright browser tests (smoke, accessibility with axe, two tabs, storage, optional pixel comparison; § 9)
└─ tests/             Vitest; fixtures/ with old progress formats and a mini sheet set; __snapshots__/ (content hashes, template output)
```

### 3.1 Loading and performance (plan phase 10)

Rule of the phase: nothing visible changes (before/after screenshots in `AP-2/Messung/phase10/`, Lighthouse values in
`AP-2/Messung_Ausgangslage.md`).

- **Start and details** (`domain/texte.ts`, `src/lib/details.tsx`, November 2026): `content.json` is a `StartInhalt` – cards and tasks
  only as heads (id, topic, deck, kind, typ, points …; ~0.8 MB instead of ~1.96 MB, gzip 167 kB instead of 506 kB). Questions, answers,
  `mc`, `rechenweg`, tags and cross references of the cards and `markdown`/`solution` of the tasks lie in `details.json`.
  The Übersicht and the app frame use `useStartStore()` and render as soon as `content.json` is there. Every other route sits below
  `<MitDetails>` (layout route in `App.tsx`, also `/druck` and the search dialog), which loads `details.json` once per session and
  provides the store with the merged content; `useStore()` **throws** outside of it instead of handing out cards without a question.
  Two widgets of the Übersicht need texts (Markiert, Begriff des Tages): `useDetailsWennDa()` fills them in when the details arrive.
  `ladeDetailsFuerAdresse` (main.tsx) requests the details at start for any address but the Übersicht; `useVorladen` loads them in
  idle time. Start and details of different versions throw ("bitte die Seite neu laden"). Tested in `tests/details.test.ts`.
- **Core and texts** (`domain/texte.ts`): the content below `<MitDetails>` is a `KernInhalt` – everything except the section texts
  (`Section.markdown`, about a third of the content). The texts lie per topic in `texte/<id>.json` (section id →
  Markdown; DD17 includes the generated glossary list). The store's `content` is typed `KernInhalt`, so the compiler shows every place that
  needs texts. Only four do: the Lernblatt page (`useThemaTexte(topic)`), Glossar, Begriffsseite and search (`useVollerInhalt()`), all in
  `src/lib/texte.ts` (once per session per topic, `startTransition` for the render, „Lädt …“ until then, error text if loading fails).
  A complete `Content` (tests, fixtures) is used directly (`istVoll`). Missing texts for a section (core and texts of different versions) throw
  instead of showing empty sections. `ladeTexteFuerAdresse` (main.tsx) requests the text of a directly opened `#/lernen/<id>` at start.
- **Preload**: `index.html` gets `<link rel="preload" href="./content.json" as="fetch" crossorigin>` (inhaltPlugin), so the start file
  downloads in parallel to the JavaScript.
- **Lazy pages**: only the Übersicht (start page) is in the main bundle; Themen/Thema, Karteikarten, Klausur, Aufgaben, Aufgabe, Material,
  Fehlerjournal, Einstellungen, Daten, Druck are lazy (`SEITEN` in `App.tsx`) – with them react-markdown/remark-gfm.
- **Preloading in idle time** (`useVorladen` in `App.tsx`, `imLeerlauf` = `requestIdleCallback`, Safari: timeout): page chunks, all texts and
  the search index (`bereiteSucheVor`, `src/lib/suchIndex.ts`) – **only** when the service worker controls the page (data
  from its cache). Not on the very first visit: the service worker downloads everything then, extra requests slow the start (Lighthouse's
  slow-4G model showed +1 s LCP). On the first visit each page loads what it needs when opened.
- **Caches**: `glossarVon(content)` (client: glossary built once per content object, shared by Glossar, Begriffsseite, search; the server
  calls the uncached `baueGlossar`, it mutates content while loading), `suchIndex(inhalt, seiten, settings)` (once per session and setting),
  `leichtKartenGemerkt` (Leicht-Modus distractors: the TF-IDF over all cards ran on every Karteikarten visit and after every rating on
  `/heute`; same card objects → same result, the pure `leichtKarten` stays uncached for tests).
- **Store contexts**: the store value is memoised; the save state (`saveState`, `saveError`) has its own context (`useSpeicherStand`), so the
  two state changes per save re-render only the header and the error banner instead of the whole page.
- **Markdown fast path** (`src/lib/markdownSchlicht.ts`, `components/Markdown.tsx`): a one-line text without any Markdown character
  (`istSchlicht`) renders as `<p>` without the parser – identical HTML, checked for every such text in `content/`. Not with `loesung` or
  `operatoren` styling. The Glossar's 1,000+ definitions mostly take this path (script time −40 % on a throttled phone); `GlossarZeile` is
  `memo`, so typing in the filter does not re-render the rows.
- **Search**: `zusammen` (hyphen words) splits into words first and anchors the regex at word starts – same result, about 6× faster (the
  old regex retried every position inside every word).
- **KaTeX** once: `overrides` in `package.json` forces rehype-katex and micromark-extension-math onto the app's KaTeX 0.18 (before, a second
  KaTeX 0.16 was bundled – and rendered with the 0.18 CSS, so subscripts in sheet formulas sat on the baseline).
- Checked and left: `lint-*.js` (395 KB) is CodeMirror + the SQL grammar, not duplicated. zod (in `store-*.js`, 32 KB gzip) stays in the start
  path (progress schema). `content-visibility: auto` for long lists was not used: iOS Safari has no scroll anchoring, so the A–Z jump bar and
  `?stelle=` jumps would land off; layout is only about a fifth of the Glossar's render time.

### 3.2 Styles (`src/styles/`)

`src/styles/index.css` (imported once by `main.tsx`) pulls all stylesheets in a **binding order**: where two rules have the same specificity, the
later one wins, and the layers deliberately override each other. Do not reorder without comparing the pages (below).

1. `tokens.css` – every design value (colours, radii, shadows, sizes) as a custom property on `:root`, for light, dark and „system“ (the
   `prefers-color-scheme` block) and the grid strength (`data-karo`). The one place to change a colour.
2. `01-grundlagen.css` … `08-koordinaten-json.css` – the base styles, in the order they grew (each file has several titled sections).
3. `apple.css`, `paper.css`, `notizbuch.css` – three design layers (workspace, paper, squared notebook); each overrides the one before. They are
   kept separate on purpose: merging them rule by rule would be a visible design change, not a cleanup.
4. `glossar-register.css` – imported by the Glossar page (the coloured register tabs on the book edge).
5. `postits.css` – the notes at the book edge for the attachments (desktop only, § 5 „Anhang der Prüfung“); imported **last** because it deliberately overrides the layers.

New styles for a component go into a **new numbered file before the layers** (add it to `index.css`), or at the end of the fitting file; check that no
layer below overrides them unintentionally.

Check a style change that must not change the look: `E2E_VISUELL=1 npx playwright test --project=visuell --project=visuell-handy --update-snapshots`
on the old state creates reference images (23 pages × light/dark × desktop/phone, kept locally in `e2e-visuell/`, not in git); the same command without
`--update-snapshots` after the change compares them pixel by pixel (use `--workers=2`). See `e2e/visuell.spec.ts`.
