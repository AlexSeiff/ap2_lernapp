# AP2 Lern-App – Technical Documentation

> Merges the earlier working documents `IMPROVEMENTS_PROMPT.md` (refactoring/safety plan, P0–P3) and `SQL_EDITOR_PLAN.md`
> (SQL editor, phases 1–4) and the original build prompt (`../Prompt_Lern_App.md`). Everything in them has been implemented;
> this file describes **the app as it is** (state: all ROADMAP phases 0–8 done incl. 4.4/4.5, without 7.5 (decision Q3), October 2026).
> `ROADMAP.md` was deleted after completion; comments like "ROADMAP 8.3" refer to it (`git show d21984e:ROADMAP.md`).
> Content license (Q4, decided 2026-10-10): CC BY-NC-SA 4.0 for `content/` only, see `LIZENZ-INHALTE.txt`; the code (everything outside `content/`) is MIT, see `LICENSE`. How to install and start the app is in `README.md` (German).

---

## 1. Purpose

A learning app for the IHK exam **Abschlussprüfung Teil 2 – Fachinformatiker/-in Daten- und Prozessanalyse (FIDPA)**.
It turns German Markdown learning sheets ("Deep Dives") and a flashcard JSON into interactive exercises: theory, flashcards,
timed practice exams with **separate solution sheets**, single tasks, an error journal with spaced repetition, a browser SQL editor
with auto-checked exercises, auto-checked calculation exercises (Rechenübungen) with new numbers on demand, and optional AI-generated tasks
(local app only). The Pages version is an installable PWA that works offline.

**Conventions**
- All UI text is German, informal *du*, short sentences.
- **Look:** Apple-like (iOS/macOS). Colours, radii and shadows are tokens on `:root` in `styles.css` (light + dark): grouped background
  `--bg`, cards `--surface` without borders (`--card-border`), `--fill` for segmented controls and search, `--accent` for links/text,
  `--accent-fill` for filled buttons (white text, contrast ≥ 4.5 : 1 in both themes), `--glas` for translucent bars (`backdrop-filter`).
  Secondary buttons are "tinted" (`--accent-soft`), mode switches are segmented controls (`.mode-switch`), tables only have row lines.
- **Icons, not emoji:** UI symbols are line icons from `src/lib/icons.ts` (paths copied from Lucide, ISC licence – only the icons in use),
  rendered by `<Icon name="…" />` (`src/components/Icon.tsx`; decorative = `aria-hidden`, with `label` = `role="img"`). Data in `src/lib`
  carries an `icon: IconName` field instead of an emoji in the label. Plain text glyphs (✓ ✗ ✕ → ★ ☆ ☐) are fine. Learning content
  (Markdown/JSON) keeps its emoji (e.g. „> ❓ **Prüferfrage:**“ is part of the sheet format). `tests/icons.test.ts` fails on colourful emoji
  in `src/` and on unused icons. New icon: copy its elements from lucide.dev into `ICONS`.
- Code identifiers are mixed German/English; don't rename public identifiers just to change the language.
- Content files (Markdown sheets, JSON) are **read only** by the app.
- No heavy dependencies (no state library, no CSS framework, no backend framework). `zod` is used for validation.

## 2. Run modes

One React UI, three ways to run it:

| | `npm run dev` | `npm start` (vite preview) | `npm run build:pages` (GitHub Pages) |
|---|---|---|---|
| API `/api/…` | `server/apiPlugin.ts` via `configureServer` | same middleware via `configurePreviewServer` | none; `src/lib/staticApi.ts` |
| Learning sheets | live from `AP-2/`, page reloads on change | from `AP-2/`, cache cleared on change (F5) | `content/` → `content.json` + `texte/<id>.json` in the build (§ 3.1) |
| Progress | `data/fortschritt.json` + daily backups | like dev | `localStorage` of the browser + daily backups in IndexedDB |
| AI (`.env.local`) | yes | yes | never read, the key can't end up in the build; no AI UI at all (§ 8) |
| Service worker / PWA | no | no | yes (`server/pwaPlugin.ts`, § 5 "PWA") |

- `src/lib/api.ts` picks the data source by `import.meta.env.MODE` (`pages` → static API).
- Public URL: **https://alexseiff.github.io/ap2_lernapp/** (HashRouter, `base: './'`).
- Every push to `main` runs `.github/workflows/pages.yml`: `npm ci` → `npm test` → `npm run lint` → `npm run build:pages` → deploy.
- The Pages version is **used by several people**. Each browser has its own progress; there is no shared state and no account.
- `AP-2/` = the folder above the repo by default; `LERN_QUELLE` in `.env.local` overrides it (e.g. when the repo lives outside OneDrive);
  `sync-content`, `import-report` and the `mc-*` scripts read it via `server/ladeEnv.ts`.
- An Electron desktop build existed on a local `desktop` branch; it was dropped in October 2026 – Pages is the version for users.

## 3. Architecture

Stack: React 19, Vite 8, TypeScript 7 (`@typescript/native` for `tsc`; TypeScript 6 under the name `typescript` for typescript-eslint),
Vitest 5, React Router 7 (HashRouter), react-markdown + remark-gfm, remark-math + rehype-katex + KaTeX (formulas, lazy chunk), zod 4,
sql.js (SQLite/WASM), CodeMirror 6, `@anthropic-ai/sdk`.

```
lern-app/
├─ shared/            used by client, server and tests (no file-system access)
│  ├─ config.ts         constants: EXAM_MINUTES, NEW_PER_SESSION, JOURNAL_INTERVALS, CARD_INTERVALS, SAVE_DELAY_MS, DEV_PORT,
│  │                    HEUTE_MINUTEN / HEUTE_ZEITEN / HEUTE_KARTEN_BLOCK (8.1), SICHER_RICHTIG_AB (8.3)
│  ├─ types.ts          content model (Topic, Task, Flashcard, Deck, Exam, SqlDataset, SqlExercise, Content …)
│  ├─ parser.ts         Markdown sheet + solution parser (pure, line/regex based)
│  ├─ prueferfragen.ts  Prüferfrage blocks: read, split and strip (pure)
│  ├─ lernkarten.ts     flashcard JSON import (zod, ImportIssues)
│  ├─ sqlUebungen.ts    SQL exercise JSON import (zod, ImportIssues)
│  ├─ rechenUebungen.ts Rechenübungen JSON import (zod, ImportIssues); the template check is injected (BuildOptions.pruefeRechenUebung)
│  ├─ progress.ts       persisted progress: types, zod schema, checkProgressPut, migrateProgress
│  ├─ mergeProgress.ts  merge a backup into the current progress (Daten & Import → Zusammenführen)
│  ├─ rechenweg.ts      RechenSchritt type + German number formatting for worked solutions (Rechenweg)
│  ├─ texte.ts          content split (plan phase 10): KernInhalt (sections without text) + texts per topic; teileInhalt, inhaltMitTexten
│  └─ api.ts            API contract: request schemas + response types per route
├─ server/            runs only inside Vite (dev/preview)
│  ├─ apiPlugin.ts      route table + middleware for /api/*
│  ├─ router.ts         tiny router (method, path/regex, handler)
│  ├─ store.ts          JSON files in data/, atomic write (temp + rename, retry for OneDrive EPERM/EBUSY), daily backups
│  ├─ contentCache.ts   cached loadContent(), cleared by the file watcher
│  ├─ loadContent.ts    reads AP-2/*.md, *Lernkarten*.json, *SQL_Uebungen*.json, *Rechen_Uebungen*.json → buildContent()
│  │                    (Rechenübungen are checked against their template here → ImportIssues; content.json for Pages is built the same way)
│  ├─ ai.ts             Claude: generateTasks(), gradeAnswer() with structured output
│  ├─ mcWerkzeug.ts     pure logic of npm run mc-entwurf / mc-uebernehmen (mcEntwurf.ts, mcUebernehmen.ts, mcEntwurfPfade.ts, ladeEnv.ts)
│  ├─ pagesPlugin.ts    emits content.json (core), texte/<id>.json and begriffe.json (term pages) for the Pages build; preload tag for content.json
│  ├─ pwaPlugin.ts      vite-plugin-pwa options (manifest, precache) for the Pages build (PWA_OPTIONS, tested)
│  ├─ report.ts         npm run import-report
│  ├─ quellenPruefen.ts npm run quellen-pruefen (re-check every link of AP2_Quellen.json)
│  └─ syncContent.ts    npm run sync-content (AP-2 → content/)
├─ content/           copy of sheets + JSON for Pages and tests (committed, therefore public)
├─ public/icons/      PWA icons (192, 512, maskable 512, apple-touch-icon 180), generated once from the desktop icon
├─ src/
│  ├─ pages/            one file per page, mostly rendering
│  ├─ hooks/            useExamRun, useCardSession (+ useCardFilters), useSqlSession, useRechenUebung, useConfirm, useBackupDownload,
│  │                    useHeute (running „Heute lernen“ session)
│  ├─ components/       AnswerInput, Markdown (+ MathMarkdown, markdownComponents), TheoryMarkdown, Rechenweg, TaskParts, ErrorBoundary,
│  │                    ConfirmDialog, SqlEditor, ResultTable, SchemaBrowser, SqlTabs, Kopfleiste (header + Unterleiste), MobileNav (tab bar < 600 px), UpdateHinweis (PWA toast),
│  │                    HeuteLeiste, EigeneAntwort, SicherheitWahl, OperatorTipp, FehlergrundWahl + FehlergrundKarte (8.7),
│  │                    SucheDialog (8.8, lazy) (phase 8)
│  ├─ lib/              pure logic (progress, grading, stats, cards, leicht + leichtRechnen (Leicht-Modus), shuffle, examTimer, sheets, sql, sqlLinks, loesungStil, mathDollar,
│  │                    rechnen (RechenState updates/selectors), wiederholung (repetition stages, SQL + Rechnen), uebungLabels)
│  │                    + store.tsx (React context), progressSaver.ts, api.ts, staticApi.ts, apiError.ts,
│  │                    backup.ts, browserBackups.ts (IndexedDB), backupReminder.ts, persistentStorage.ts, pwa.ts (service worker registration),
│  │                    navigation.ts (bottom bar groups, pure), heute + heuteSitzung (8.1), kalibrierung (8.3), operatoren + operatorStil (8.4),
│  │                    mischKlausur (8.5), fehlergruende (8.7), suche + normalisiere (8.8), glossar (8.9),
│  │                    texte (load section texts, hooks), suchIndex (search index cache), markdownSchlicht (Markdown fast path) (plan phase 10)
│  ├─ rechnen/          Rechenübungen (pure, no React): typen.ts, zufall.ts (seeded PRNG), hilfen.ts (statistics helpers, LoesungsBau,
│  │                    vorlage()), vorlagen/*.ts (28 templates, index.ts = registry), instanz.ts (baueInstanz), pruefen.ts (import check),
│  │                    checker.ts (input checking + Fehlerbilder), formeln.ts (Formelsammlung data, also used by the Rechenwege),
│  │                    beispiel.ts (faded worked examples, 8.6)
│  └─ sql/              sqlWorker.ts, engine.ts, runner.ts, checker.ts, errors.ts, lint.ts, types.ts
├─ tests/             Vitest; fixtures/ with old progress formats and a mini sheet set
└─ data/              fortschritt.json, generierte-aufgaben.json, backups/ (gitignored, local app only)
```

### 3.1 Loading and performance (plan phase 10)

Rule of the phase: nothing visible changes (before/after screenshots in `AP-2/Messung/phase10/`, Lighthouse values in
`AP-2/Messung_Ausgangslage.md`).

- **Core and texts** (`shared/texte.ts`): `content.json` / `GET /api/content` is a `KernInhalt` – everything except the section texts
  (`Section.markdown`, about a third of the content). The texts lie per topic in `texte/<id>.json` / `GET /api/texte/<id>` (section id →
  Markdown; DD17 includes the generated glossary list). The store's `content` is typed `KernInhalt`, so the compiler shows every place that
  needs texts. Only four do: the Lernblatt page (`useThemaTexte(topic)`), Glossar, Begriffsseite and search (`useVollerInhalt()`), all in
  `src/lib/texte.ts` (once per session per topic, `startTransition` for the render, „Lädt …“ until then, error text if loading fails).
  A complete `Content` (tests, fixtures) is used directly (`istVoll`). Missing texts for a section (core and texts of different versions) throw
  instead of showing empty sections. `ladeTexteFuerAdresse` (main.tsx) requests the text of a directly opened `#/lernen/<id>` at start.
- **Preload**: the Pages `index.html` gets `<link rel="preload" href="./content.json" as="fetch" crossorigin>` (pagesPlugin), so the core
  downloads in parallel to the JavaScript.
- **Lazy pages**: only the Übersicht (start page) is in the main bundle; Themen/Thema, Karteikarten, Klausur, Aufgaben, Aufgabe, Material,
  Fehlerjournal, Einstellungen, Daten, Druck (and Generator) are lazy (`SEITEN` in `App.tsx`) – with them react-markdown/remark-gfm.
- **Preloading in idle time** (`useVorladen` in `App.tsx`, `imLeerlauf` = `requestIdleCallback`, Safari: timeout): page chunks, all texts and
  the search index (`bereiteSucheVor`, `src/lib/suchIndex.ts`) – **only** in the local app or when the service worker controls the page (data
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

## 4. Content

### 4.1 Learning sheets (Markdown)

| File | Parsed into |
|---|---|
| `DeepDive_NN_Thema.md` | `Topic`: theory sections (`# Teil …`, `## 1.1 …`), `lernziele` (`- [ ]` under `## Lernziel-Check…`), flashcards from Prüferfragen and Fachgespräch, `Exam` from `# Übungsklausur …` with blocks `## Block A – Titel (19 P)` and tasks `**A1 (6 P):** …`, attachments (Anlagen) |
| `DeepDive_NN_Thema_Loesungen.md` | `Solution` per task (`**A1 (6 P):**`), `kommentar` from `*Prüferkommentar: …*`, `criteria` from a points table `| Element | P |` |
| `DeepDive_17_Glossar_Diagramme.md` | reference topic **without** Übungsklausur and Lösungsdatei: every diagram type as an SVG example (Teil 1–6) and the placeholder `<!-- glossar-a-z -->` (Teil 7), which `loadContent` replaces with the whole glossary (see Glossar below). Edit it like any sheet; the SVG code sits directly in the file |
| `Deep_Dive_SQL_KW28_29.md` | extra topic (id `00`), solutions inside the sheet; keep the file name (SQL links depend on it) |
| `Lernzettel_Kernthemen.md`, `AP2_Themenliste_und_Beispielfragen.md`, `AP2_SQL_Belegsatz.md` | `MaterialDoc` (Material page); the Belegsatz (id `sql-belegsatz`) also has its own page and the SQL-editor panel (plan phase 6) |
| `Begriffsseiten_<A–Z>.md`, `Begriffsseiten_0-9.md` | `BegriffsSeite[]` (term pages, plan phase 3): **not** in `content.json`, but in `begriffe.json` (Pages) or `GET /api/begriffe`; `content.begriffe` holds only the index (id, term, variants) |
| everything else (`Lernplan_*.md`, `Prompt_*.md`, `Ideen.md`, `Begriffsseiten_Hinweise.md`, plan/measurement notes …) | **not read**, not synced: `isContentFile` is an **allow-list** (`INHALT_MD` in `server/loadContent.ts`: `DeepDive_NN_*.md`, `Deep_Dive_SQL*.md`, `Lernzettel_Kernthemen.md`, `AP2_Themenliste*.md`, `AP2_SQL_Belegsatz.md`, `Begriffsseiten_<Buchstabe>.md` + the JSON patterns incl. `AP2_Quellen.json`) – notes in `AP-2/` never end up in the app |

- **Prüferfragen**: `> ❓ **Prüferfrage:** Frage` with the italic answer in the next quote line → `Flashcard{kind:'prueferfrage'}`.
  They also remain inside the section Markdown, so they show up in the Lernen view. `shared/prueferfragen.ts` reads the block
  (`readPrueferfrage`, used by the parser) and splits/strips it for the Lernen view (`splitPrueferfragen`, `stripPrueferfragen`).
- **Fachgespräch**: numbered list under `## Fachgespräch…` → `Flashcard{kind:'fachgespraech'}`.
- A trailing `(KW …)` in a sheet or section title is removed (`stripKw`); there is no calendar week in the data model any more.
  The sheets themselves no longer contain personal time references ("am Ende des Themas" instead of "am Ende von KW 31").
- Problems (task without solution etc.) are collected as `ImportIssue`s and shown on *Daten & Import* / `npm run import-report`.
- **Sheets without Übungsklausur**: allowed if there is no `_Loesungen.md` (otherwise "Kein Abschnitt „Übungsklausur" gefunden"). A level-2
  `## Fachgespräch…` / `## Lernziel…` heading then starts the appendix, so cards and Lernziele work as usual. The Lernen page hides
  Übungsklausur and Einzelaufgaben for such topics; `tests/inhalte.smoke.test.ts` lists them in `NACHSCHLAGEN`.
- **Diagrams**: a ```` ```svg ```` block holds a hand-drawn SVG that `<Markdown>` shows as `<figure class="diagramm">` (inline, so it works
  offline and in print). `shared/svgDiagramm.ts` (`pruefeSvg`) allows only drawing elements (`svg g defs marker path line polyline polygon rect
  circle ellipse text tspan title desc`) and drawing attributes – no scripts, events, links, `style`, comments or external `url(…)`; a block that
  fails is shown as code and reported as ImportIssue (`pruefeDiagramme`), as is an `id` used twice (markers are page-wide). Colours only via
  classes from `styles.css` (`dg-linie`, `dg-form`, `dg-grau`, `dg-akzent`, `dg-gut`, `dg-mittel`, `dg-rot`, `dg-voll`, `dg-linie-akzent`,
  `dg-strich`, `dg-dick` …; text: `dg-klein`, `dg-fett`, `dg-leise` …), so light, dark and print mode work. The search ignores SVG markup.

### 4.2 Flashcards `AP2_FIDPA_Lernkarten.json`

```json
{ "meta": { "hinweise": ["…"] },
  "decks": [ { "id": "sql", "titel": "SQL", "pruefungsbereich": "…", "quelle": "Deep Dive 1", "status": "behandelt",
               "karten": [ { "id": "SQL-001", "frage": "…", "antwort": "…", "typ": "wissen", "schwierigkeit": 1, "tags": ["join"] } ] } ] }
```

- Currently 25 decks and 539 cards (typ: wissen 256, falle 93, abgrenzung 82, anwendung 62, rechnung 46).
- **Term cards** `AP2_Fachbegriffe_Lernkarten.json` (same format, any `*Lernkarten*.json` is imported): 16 decks `fb01`–`fb16`, one per Deep Dive,
  802 cards with `typ: "begriff"` – `frage` is just the term, `antwort` a one- or two-sentence explanation, ids `FB-<term-slug>` (stable,
  independent of order). Terms already defined by a `wissen` card (ACID, KPI, PDCA …) are not repeated. In the app: Typ filter „Fachbegriff“
  (`/karteikarten?typ=begriff`), Leicht-Modus with automatic answers (`begriff` is in `LEICHT_TYPEN`), and the glossary uses them first.
- `quelle` containing "Deep Dive N" maps the deck to a topic; decks without one (WiSo, project work) are reachable via the deck filter.
- Progress is keyed by card `id`. **Never change IDs.**
- Optional **`mc`** block per card for the Leicht-Modus (phase 6): `{ "richtig": "…", "falsch": ["…", "…", "…"], "erklaerung"?: "…" }`.
  Validated by `KartenMcSchema` / `pruefeMc` (`shared/lernkarten.ts`): exactly 3 `falsch`, pairwise distinct and none equal to `richtig`
  (compared with `mcNorm`: case, whitespace and a final full stop ignored). An invalid block → ImportIssue, the card is imported without `mc`.
  Today no card has `mc`; the Leicht-Modus uses the automatic fallback (§ 5).

**Authoring helper for `mc` (local only, the owner runs it, `server/mcWerkzeug.ts` = pure logic, tested in `tests/mcWerkzeug.test.ts`
with a mock client – no API call in tests):**
- `npm run mc-entwurf -- --deck <id> [--max 30] [--anwendung]` (`server/mcEntwurf.ts`): `.env.local` is loaded first (`server/ladeEnv.ts`,
  same keys as `vite.config.ts`), then `server/ai.ts` provides the client (`getClient`) and `MODEL` (`ANTHROPIC_MODEL`, default
  `claude-sonnet-5`). Candidates (`mcKandidaten`): cards of the deck with typ wissen/abgrenzung/falle/rechnung (+ anwendung with
  `--anwendung`), no `mc` yet, not yet in the draft. Requests in batches of 15 (`entwerfeMc`) via `messages.parse` with structured output
  (`zodOutputFormat(McAntwortSchema)`, like `ai.ts`); every proposal is checked with `pruefeMc` (`pruefeMcAntwort`: unknown/duplicate/missing ids
  and invalid blocks are reported, a failed batch doesn't stop the others). New entries are appended to `data/mc-entwurf.json`
  (`{ hinweis, eintraege: [{ id, deck, frage, antwort, status: "offen", mc }] }`); entries already there are kept (`ergaenzeEntwurf`).
- The owner edits the draft and sets `status` to `angenommen` or `abgelehnt`.
- `npm run mc-uebernehmen [-- --probe]` (`server/mcUebernehmen.ts`, `uebernehmeMc`): writes the accepted blocks as the last key `mc` of the card
  into `AP-2/AP2_FIDPA_Lernkarten.json` (temp file + rename). The file is `JSON.stringify(…, null, 2)` formatted (checked: a round trip
  must reproduce it exactly, otherwise nothing is written); line endings, final newline and BOM are kept; ids and order never change;
  cards that already have `mc` are not overwritten. Then `npm run sync-content`.

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

Currently 3 datasets (`moebelhaus`, `datafit`, `kundenimport`) and 73 exercises; 26 tasks and 46 cards are linked.

- **Links** (optional, `shared/sqlUebungen.ts` → `verknuepfeSqlUebungen`, run in `buildContent`): `aufgaben` = task ids from the
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
for worked examples. **Content today: 105 exercises** – 71 fixed (65 with a template, 6 without: JArbSchG/BUrlG/Reallohn, normal distribution, expected value) and 34 generated
(no `daten`, one per template). Fixed exercises cover every calculation task of the sheets: the Übungsklausur tasks (`quelleAufgabe`
"DDn Übungsklausur X1") and the calculation examples in the theory parts (`quelleAufgabe` "DDn Teil 4.3" etc. – the smoke test then
looks for the numbers in the theory sections of that sheet). Per sheet: DD3 19, DD4 12, DD5 11, DD6 12, DD7 7, DD9 3, DD10 4, DD11 1, DD12 13,
DD13 3, DD14 10, DD16 10. IDs: `RE-ST1`/`ST2` (DD3/DD4), `MG` (DD7), `ML` (DD6), `PA` (DD5), `DQ` (DD9), `VI` (DD11), `PM` (DD12), `WI` (DD13/DD14),
`IT` (DD10), `QS` (DD16); the file is sorted in this order. Not included (no arithmetic or no number to check): pure lookups in DD13 (Pausen B1/B5,
Betriebsrat D1, Günstigkeitsprinzip E3), Kündigungstermine (dates), DD11 algorithm/pseudocode tasks.

**New template**: file in `src/rechnen/vorlagen/`, defined with `vorlage({ id, titel, bereich, beschreibung, schema, erzeuge, loese, platzhalter,
tabelle?, hinweise })`; `loese` uses `LoesungsBau` (`wert`, `schritt`, `fehler`, `fertig(layout?)`). Register it in `vorlagen/index.ts`,
add it to the table above, add a sheet example to `tests/rechenVorlagen.test.ts`; the property tests (`tests/rechenEigenschaften.test.ts`)
pick it up automatically. Add at least one formula with the template id in `vorlagen` to `src/rechnen/formeln.ts` and use
`F.<id>.latex` as the step `formel` where the general formula appears as is (`tests/formeln.test.ts` checks both).

### 4.4b Diagramm-Übungen `AP2_Diagramm_Uebungen.json` (plan phase 7)

`{ meta, uebungen: [...] }`, parsed by `parseDiagrammUebungen` (`shared/diagrammUebungen.ts`, zod + `pruefeDiagrammUebung`; a broken
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
and variant to score fully and break no rule (`tests/diagrammUebungen.test.ts`). The content (25 exercises, incl. four boundary-event BPMN exercises DG-BPMN-005…008 added directly in the JSON, scenario Möbelhaus Nordholz) was
generated by `AP-2/Messung/diagramme_gen.py` (`python diagramme_gen.py <AP-2>/AP2_Diagramm_Uebungen.json`) from compact definitions; edit the script and regenerate, or edit the JSON directly. `AP-2/Messung/diagramme_shots.mjs` photographs every exercise with its model solution (needs the Pages preview).

### 4.4c Quellen `AP2_Quellen.json` (plan phase 8)

`{ meta, quellen: [...] }`, parsed by `parseQuellen` (`shared/quellen.ts`, zod; a broken entry is skipped and reported as ImportIssue).
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
**Re-check:** `npm run quellen-pruefen` (`server/quellenPruefen.ts`) fetches every URL again (one at a time, 400 ms pause, 20 s timeout) and
lists everything that doesn't answer 2xx (exit code 1). Replace or remove dead links in `AP-2/AP2_Quellen.json`, then `npm run sync-content`.
Size: about 80 KB of `content.json` (core since plan phase 10: ~1.34 MB, ~351 KB gzip).

### 4.5 Updating content for Pages

Formulas in the sheets are written as `$…$` (see § 5 "Markdown, formulas"). Edit files in `AP-2/`, then `npm run sync-content` (copies to `content/`), commit, push. The Pages build reads `content/` only.
AI-generated tasks (`data/`) never go into the Pages build.

## 5. Features (pages and routes)

| Route | Page | What it does |
|---|---|---|
| `/` | Dashboard | Pages: backup reminder banner (see § 6). **First visit** (API returns no stored progress, `store.firstVisit`): welcome screen (`components/Welcome.tsx`: what the app is, progress stays in this browser → download backups, optional exam date; "Los geht's" / "Sicherung einspielen"), gone after the first change. Otherwise a **widget grid** (plan phase 9, see „Übersicht“ below): Weiterlernen ("▶ Heute lernen" + last reading position), countdown to `settings.examDate` (without one: "Prüfungstermin eintragen →"), study streak, rings per Prüfungsbereich, Fällig, Übungen (SQL/Rechen/Diagramm), Markiert → `/karteikarten?markiert=1`, Begriff des Tages, Übungsklausuren (average + IHK grade, trend, last 5), weakest topics, "Woran es meistens liegt", "🎯 Selbsteinschätzung" (§ 5 phase 8.3); below in full width "Fortschritt je Thema" and "Klausur-Trend je Thema" |
| `/heute` | Heute lernen | lazy page: plan of today's mixed round, start, progress, skip, end (§ 5 "Heute lernen") |
| `/lernen`, `/lernen/:topicId` | Themen / Thema | **hiding sheets**: button „Ausblenden“ on the sheet (`setzeAusgeblendet`, `src/lib/settings.ts`) → the sheet leaves the tile grid (collapsible „Ausgeblendet (n)“ below it with „Einblenden“), the dashboard's „Weiterlesen“ link and „Schwächste Themen“, and the weakest-topic pick of „Heute lernen“; a hidden sheet still opens by link and shows a note with „Wieder einblenden“; cards, tasks, journal repetitions, search and „Fortschritt je Thema“ are unchanged; theory with table of contents, after each section a box „Weiterlesen und ansehen“ with its sources (plan phase 8, see Quellen below), Prüferfragen as a box "❓ Prüferfrage – erst selbst überlegen" with the answer behind "👁 Antwort zeigen" (`TheoryMarkdown`), ticking off learning goals |
| `/karteikarten` | Karteikarten | filters (Deep Dive, deck, kind, typ, difficulty; kept in the URL), quick switches for Prüferfragen/Fachgespräch (same settings), Leitner boxes (`CARD_INTERVALS`), max `NEW_PER_SESSION` new cards per round, "⚠️ Fallen wiederholen", keyboard: Space flip, 1/2/3 rate; mode switch "🃏 Aufdecken \| 🟢 Leicht (4 Antworten)" (see Leicht-Modus below); optional "✍️ Deine Antwort" field (8.2); `?karten=ID,ID,…` = exactly these cards (used by "Heute lernen"); "📖 Durchblättern" (`?blaettern=1`, `KartenBlaettern`): all filtered cards (`alle`, also in Leicht-Modus) one by one, ←/→ or swipe, Space flip, Esc end, options "gemischt" and "Antwort gleich zeigen", slider to jump – no rating, progress untouched (`tests/blaettern.test.ts`); **marking** (plan phase 4): star button `MarkierStern` in the session head of all three card views (outside the clickable card, so no nested controls), key `M`, filter checkbox "Nur markierte (n)" (`?markiert=1`, combines with all other filters and Leicht) |
| `/klausur`, `/klausur/:topicId` | Übungsklausur | 90-min timer (`aria-live` announcements), attachments, "Wie sicher bist du?" per task (8.3), operators marked (8.4), solutions locked until submission, self-assessment with criteria checkboxes, "Woran lag's?" below full points (8.7), IHK grade, auto-submit on timeout, resumable (`activeExam`). Card "🎲 Gemischte Probeklausur" on `/klausur`; `:topicId` can also be `mix-<bereich>-<seed>` (8.5) |
| `/aufgaben`, `/aufgabe/:taskId` | Einzelaufgaben | filter by topic/block/difficulty/status/search; export a selection as task sheet/solution sheet; task page asks "Wie sicher bist du?" before submitting (8.3) and "Woran lag's?" below full points (8.7); operators in task texts are marked (8.4) |
| `/druck` | Druck | print view (task sheet or solution sheet, same numbering) → "Als PDF speichern"; also Markdown download. Whole exams (`thema=<id>`, also `thema=mix-…`; `misch=mix-…` is the same, plan phase 6): task sheet with a **cover page** (`Deckblatt`: name, date, `EXAM_MINUTES`, aids, points per block to fill in), solution sheet with a **grading sheet** (`Bewertungsbogen`: every task with max points, empty column, sum, IHK scale; mixed exams show the source „DD n“ because codes repeat). In print every block starts on a new page (`SheetGroup.neuerBlock`); `@page` margin boxes put the title and „Name“ (or the subtitle) in the header and „Seite x von y“ in the footer (Chromium; other browsers print without them), not on the first page. The free selection (`ids=`) stays as before. `/klausur` has a button „Drucken“ that mixes a new exam (`mix-gemischt-<seed>`) and opens its task sheet |
| `/sql`, `/sql/uebungen`, `/sql/uebung/:id` | SQL-Editor | free mode + exercises (see § 7) |
| `/diagramme`, `/diagramme/:id` | Diagramm-Übungen | plan phase 7, lazy pages. List with filters in the URL (`typ`, `stufe`, `status`), progress bar, "Nächste offene". Exercise page: scenario, diagram (`components/DiagrammSvg.tsx`: SVG with the `dg-*` classes of DD17, every gap an HTML button laid over the SVG in %, so tap, keyboard and screen reader work), palette below (on phones sticky above the tab bar). Placing: **drag** with Pointer Events (captured on `pointerdown`, start after 6 px, drop target via `elementFromPoint` → `data-slot`; no HTML5 drag and drop – unreliable on iOS) or **tap** an element, then a gap (Esc cancels; tapping a filled gap takes the element out and selects it). `einsetzen` moves single-use elements. "Prüfen" marks every gap green/red and lists violated shape rules; "Hinweis", "Lösung zeigen" (fills the model solution, counts as "mit Lösung"), "Leeren". Progress `diagramme` (§ 6) with repetition like Rechenübungen, badge `diagramme` in the navigation (Lernen → Diagramm-Übungen). Begriffsseiten list matching exercises under „Üben“ (type terms such as EPK, BPMN, Aktivitätsdiagramm show all of that type; otherwise word match in title, scenario and palette); DD5 2.2/2.3 and DD17 1.1/1.2/2.4–2.6 end with a link `#/diagramme?typ=…`. Not (yet) part of "Heute lernen" and the Fehlerjournal |
| `/rechnen`, `/rechnen/:id` | Rechenübungen | list with filters in the URL (Thema, Schwierigkeit, Tag, Status), progress bar, "Nächste offene"; exercise page (see below) with a faded worked example (8.6) |
| `/fehlerjournal` | Fehlerjournal | every task below full points comes back after 1, 3, 7 days (`JOURNAL_INTERVALS`); card "🧩 Woran es meistens liegt" and the last error category per entry (8.7) |
| `/generator` | KI-Aufgaben | Claude generates IHK-style tasks (mc, lueckentext, zuordnung, rechnen, offen) with model solution; local app only (Pages: no nav item, the route redirects to `/`) |
| `/material`, `/material/:docId` | Material | cheat sheet, topic list, tiles "📏 Formelsammlung" and "🗣️ Operatoren-Trainer" |
| `/material/operatoren` | Operatoren-Trainer | lazy page: quiz "Was verlangt der Operator hier?" with real tasks, table of all operators (§ 5 phase 8.4) |
| `/glossar` (old `/material/glossar` redirects, keeps `?stelle=`) | Glossar | lazy page: terms A–Z from `begriff` and `wissen` cards and bold terms of the sheets, letter jump bar, filter, links to the sources; terms with a term page link to it (§ 5 phase 8.9, plan phase 3) |
| `/glossar/:id` | Begriff | lazy term page (plan phase 3; section „Weiterlesen und Videos“ since plan phase 8): definition, Erklärung, Beispiel, Abgrenzung, Prüfungsfalle, Merksatz, diagrams; „Siehe auch“, „Üben“ (cards, tasks, Rechen- and SQL-Übungen), „Nachlesen“; star "Karte markieren" next to the h1 for the term's own card (`uebungen.begriffskarte`) and an icon-only star before every card in „Üben“ |
| (dialog) | Suche | `Strg+K` / `⌘K`, search button in the header (Kopfleiste): global search, lazy (§ 5 phase 8.8) |
| `/material/sql-belegsatz` | SQL-Belegsatz | lazy page (`pages/SqlBelegsatz.tsx`) of `AP2_SQL_Belegsatz.md` with „Drucken“ (print CSS: two columns, small font → 2 pages A4); in the Glossar area. The same content as a side panel in the SQL editor (`components/Belegsatz.tsx`, `BelegsatzPanel`: button in the toolbar of `/sql` and on every exercise, fixed panel on the right, full width on phones, Esc/„Schließen“ close it and focus returns to the button) |
| `/material/formeln` | Formelsammlung | lazy page (`pages/Formelsammlung.tsx`, KaTeX): all formulas of `src/rechnen/formeln.ts` grouped by Deep Dive, each with explanation, variables and a link "📐 n Rechenübungen →" to `/rechnen?vorlage=a,b`; jump bar, "🖨️ Drucken" (print CSS: one column, no links). Plan phase 6 added neuron formulas (gewichtete Summe, Stufe, Sigmoid, ReLU, Perzeptron-Lernregel) and formulas that only the sheets had (Laplace, Gegenereignis, mindestens einmal, Erwartungswert, z-Wert, Spearman, Wachstumsrate, Falsch-Positiv-Rate, kostenoptimale Schwelle, MAPE) – those have `vorlagen: []` and show no exercise link |
| `/einstellungen` | Einstellungen | per-user settings (`Progress.settings`, see § 6): own exam date; switches "❓ Prüferfragen einbeziehen" / "🎤 Fachgespräch-Fragen einbeziehen"; "🤖 Automatische Antworten erlauben" (Leicht-Modus, `leichtAutomatisch`); Datenschutz-Hinweis (`components/Datenschutz.tsx`: no account, no tracking, no cookies, data stays in the browser, only app + content loaded from GitHub Pages; content license line CC BY-NC-SA 4.0 with link to the deed; source links open in a new tab, YouTube only after a click via youtube-nocookie.com) |
| `/daten` | Daten & Import | import report, re-import (local), backup download, backup import as **🔀 Zusammenführen** (merge) or **⬆ Einspielen (ersetzen)** (replace), reset; local: newest daily backup in `data/backups/`; Pages: "Speicher dauerhaft: ja/nein" and the list of browser daily backups with "↩ Wiederherstellen" |

**Not affected by the Prüferfragen switch:** the *Prüferkommentar* in solutions (the scoring scheme; `Solution.kommentar`) is always shown
(owner decision Q1; tested in `tests/prueferfragen.test.ts`).

**Grading**
- Automatic: MC, Lückentext, Zuordnung, numeric (`rechnen`, with tolerance). These types currently only exist for AI-generated tasks.
- Sheet tasks are `offen`: self-assessment against the model solution; a points table becomes checkable criteria.
- Optional AI grading (local app): points suggestion + feedback + missing aspects; the user can adjust.
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
- **Rechenweg** (`components/Rechenweg.tsx` + `shared/rechenweg.ts`): numbered steps, each `Formel` (KaTeX) → `Einsetzen` (KaTeX) →
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
  The last checked answers are restored when the page is opened again (`RechenState.antworten`).
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
     (`Flashcard.siehe`), also from other decks. Filled in at load time by `ergaenzeVerwandte` (`shared/verwandt.ts`, called in
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
    answers for them come from `npm run mc-entwurf` (owner's decision). Sample of 50 cards before/after: `AP-2/Messung/MC_Vergleich_Phase5.md`.
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

- **Planner** `planeHeute(content, progress, { today, zufall, minuten })` in `src/lib/heute.ts` (pure, `tests/heute.test.ts`). Target
  `HEUTE_MINUTEN` = 20 min; estimates in `HEUTE_ZEITEN` (`shared/config.ts`): card 0.5 min (Leicht 0.33), task 0.9 min per point (min 3),
  SQL 5, Rechnen 5. Steps:
  1. **Fehlerjournal**: due open entries (oldest due first) until about half the time, at least one.
  2. **One task from the weakest topic** (lowest last exam, else Ø tasks; without any data the topic with the fewest attempts): a task never
     attempted (random), else the one with the worst last result; never one of the planned repetitions, never AI tasks.
  3. **1–2 exercises**: due SQL and Rechenübungen (oldest due first, at most 2); none due → one unsolved exercise, preferably of the weakest topic.
  4. **Cards** with the remaining time (at least 5 if available): due cards (longest due, lowest box first), then new ones (≤ `NEW_PER_SESSION`).
     `cardPool` applies the Prüferfragen/Fachgespräch switches; in Leicht-Modus only cards with 4 answers. Grouped per topic (deck if no
     topic) into blocks of at most `HEUTE_KARTEN_BLOCK` = 8.
  5. **Interleaving** (`verschraenke`): greedy, always the topic with the most remaining items that is not the previous one → never the same topic
     twice in a row unless only one is left; the order within a topic is kept.

  Randomness is seeded by the date (`textSeed(today)`), so the plan stays the same for a day unless progress changes.
- **Flow**: every plan item has a `link` into the existing pages (`/aufgabe/:id?modus=wiederholung`, `/aufgabe/:id`, `/sql/uebung/:id`,
  `/rechnen/:id`, `/karteikarten?karten=…`). "▶ Los geht's" stores the session and opens the first link; `components/HeuteLeiste.tsx` (above every
  page while a session runs, not on `/heute`) shows "Schritt n/m: …" and **"Weiter →"** (last step: "Fertig ✓"), which marks the step done and
  opens the next one. `/heute` shows the list with ✓/⏭/▶, "⏭ Überspringen", "Runde beenden" and, when done, "🎉 Runde geschafft" + "Noch eine Runde".
  The pages themselves are unchanged – learning is recorded as usual. Karteikarten with `?karten=` show "▶ Heute lernen: n Karten" and a start
  button (no auto start: setting state in an effect is against the lint rules, and a click is more robust).
- **Session** (`src/lib/heuteSitzung.ts`, pure + tiny store for `useSyncExternalStore`): `{ datum, items, index, erledigt, uebersprungen }` in
  `localStorage` key **`ap2-heute`** (try/catch, read tolerantly with `leseSitzung`). Only valid on the same day and device – it is navigation
  state, not progress, so it is not part of `Progress` or the backup.
- Entry points: Dashboard button (shows "fortsetzen (n/m)" while running), first sub-target of the area „Lernen“.

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

### Globale Suche (phase 8.8)

- **Index** `baueSuchIndex(content, settings, zusatz)` (`src/lib/suche.ts`, pure, `tests/suche.test.ts`): theory sections of every sheet (link
  `/lernen/<topic>?stelle=<section id>`), material docs, flashcards (`cardPool` → the Prüferfragen/Fachgespräch switches apply; link
  `/karteikarten?karten=<id>&von=suche`, shown as "🔎 Aus der Suche: 1 Karte."), tasks, their model solutions (kind `loesung`,
  "✅ Musterlösung", own entry linking to the task – so terms that only occur in a `*_Loesungen.md` are found without the task snippet
  giving the solution away), SQL exercises, Rechenübungen, formulas
  (`/material/formeln?stelle=formel-<id>`), operators (`/material/operatoren?stelle=op-<id>`) and the glossary (8.9). With Prüferfragen off,
  their blockquotes are also stripped from the section text. Today **2,384 entries** (352 sections, 2 material docs, 565 cards, 273 tasks,
  273 solutions, 59 SQL, 105 Rechnen, 76 formulas, 29 operators, 650 glossary terms); built in about 30 ms, a query takes a few ms.
- **Normalisation** `normalisiere` (`src/lib/normalisiere.ts`): lower case, accents removed, ä/ae → a, ö/oe → o, ü/ue → u, ß → ss, everything else
  → space. So "Pruefung", "Prüfung" and "prufung" match, "Groesse" finds "Größe".
  Hyphenated words are indexed a second time joined (`zusammen`: "k-NN" → "knn", "E-Mail" → "email"), and the snippet also matches the joined form.
- **Ranking** `suche(index, query, max = 40)`: every query word must occur (AND). Per word: exact title word 12, title word start 8, in title 5,
  text word start 2, in text 1; whole query in the title +10, title starts with it +6 (section titles compared without numbering,
  `ueberschriftKern`: „2.5 Sequenzdiagramm“, „Teil 5 – Boxplot …“); title **is** the query: glossary +8, section +4; small bonus per kind
  (glossary 3, section/formula/operator 2, material/card 1). So a term search shows the glossary entry first, then the section headed by the
  term, then cards. Ties → shorter title, then index order. Snippet (`ausschnitt`) around the first matching word. Fewer than 2 characters → nothing.
- **Glossary hits** (`glossarSuchEintraege(eintraege, content)`): context „Glossar · Deep Dive 17 · 2.5 Sequenzdiagramm“ – the term's topic
  (`glossarThema`: the section whose heading is the term, else one starting with it, else the first sheet source). Term cards (`typ: begriff`)
  whose term is already a glossary hit are left out of the index (same definition twice).
- **Term pages first (plan phase 3, owner decision E1)**: `begriffSuchEintraege(seiten)` adds every term page (kind `begriff`, title = term,
  „Auch“ variants count as title, `namenN`; text = page text; link `/glossar/<id>`). Glossary entries that have a page (also via a variant,
  `seitenFinder`) are left out; the others stay as kind `glossar`. `sucheBegriffe(index, query, alle)` returns **only terms** (pages and glossary
  entries) when at least one matches – the dialog offers „n weitere in Lernblättern, Karten und Aufgaben“ (`alle`); if no term matches, the
  other hits come directly (`rueckfall`, with a note). A page whose name matches shows the start of its definition as snippet. The dialog loads
  the section texts (`useVollerInhalt`) and the term pages (`ladeBegriffe()`; if that fails, the glossary entries are searched) and takes the
  index from `suchIndex()` (`src/lib/suchIndex.ts`, built once per session and setting, usually already in idle time – § 3.1).
- **Dialog** `components/SucheDialog.tsx` is a lazy chunk together with the index, formulas, operators and glossary; it loads on the first
  `Strg+K`/`⌘K` (listener in `App.tsx`, `useSuche`) or click on the search button in the header. Combobox pattern
  (`role=combobox` + `listbox`/`option`, `aria-activedescendant`), ↑/↓/Home, Enter opens, Esc or a click outside closes, focus returns.
- **Jump**: `hooks/useStelle.ts` reads `?stelle=<id>` (a hash anchor can't be used with the HashRouter), scrolls the element into view and
  highlights it briefly (`.stelle-ziel`). Used by Thema, Formelsammlung, Operatoren and Glossar.

### Glossar (phase 8.9)

- **Builder** `baueGlossar(content)` (`src/lib/glossar.ts`, pure, `tests/glossar.test.ts`):
  - `begriff` cards (term cards): the question is the term, the answer its definition – this definition wins over all others; source `🃏 Begriffskarte`.
  - `wissen` cards whose question names one term (`begriffAusFrage`: "Was ist (ein/eine/der …) X?", "Was bedeutet X?", "Was versteht man unter X?",
    "Wofür steht X?", "Was misst/beschreibt/bezeichnet X?"; no lists, no "Was ist bei … erforderlich?") → definition = the card answer (26 terms).
  - Bold terms in the theory sections (Prüferfragen and code blocks skipped, `begriffeAusZeile`): `**Term:** …`, `**Term** – …`, `**Term** = …`
    at the line start (also in lists) and table rows `| **Term** | … |` give a definition; `**Term** ist/bezeichnet/beschreibt …` keeps the
    sentence; other bold terms are kept without a definition. `pruefeBegriff` drops results, points, numbers and paragraphs (digits except
    "3. Normalform"/"3-2-1-Regel"), lists, sentences (more than one lower-case word, final punctuation), sentence starts ("Die …", "Für …"),
    learning hints ("Prüfungstaktik", "Merkhilfe") and emphasis ("nicht", "Drei", "Achtung" …); a definition needs at least two real words
    (`guteDefinition`). A bold word inside running text without a definition only counts with two findings or as an abbreviation.
  - **Dedupe** by `glossarSchluessel` (normalised, bracket suffix ignored: "OLAP" = "OLAP (Online Analytical Processing)"); term card before `wissen` card before sheet definition; up to 4 sources (`📖 Deep Dive n · Abschnitt` or `🃏 Karte`). Sorted with `Intl.Collator('de')`, letter = first
    normalised letter (Ä → A), `#` otherwise. Today **1.135 terms, 1.064 with a definition**. The page links to `/karteikarten?typ=begriff`. Some noise remains (e.g. names from WiSo scenarios).
- **Page** `/glossar` (lazy `pages/Glossar.tsx`; `/material/glossar` redirects; waits for the section texts and uses `glossarVon`, § 3.1): sticky letter bar A–Z (letters without terms greyed), filter field,
  `<dl>` per letter with anchors `g-<id>`, definitions as Markdown (KaTeX only if a `$` occurs), source links; a term with a term page is a
  link to it („›“). Glossary search hits link to `/glossar?stelle=g-<id>`. It belongs to the area „Glossar“ (sub-target „Begriffe A–Z“).
- **Navigation to Deep Dive 17**: sub-target „Diagramme“ of the area „Glossar“ (`GLOSSAR_PFAD = '/lernen/17'` in `navigation.ts`; „Themen“ is
  not highlighted at the same time).
- **Topic list A–Z** (Deep Dive 17, `src/lib/glossarThema.ts`, `ergaenzeGlossarThema`, called in `loadContent` – so local app, Pages build and
  tests are identical): the section with `<!-- glossar-a-z -->` gets a count sentence, and one section per letter (`17-begriffe-a` …, `generiert: true`)
  is inserted after it, one line per entry `- Begriff – Definition *(DD n)*`; terms with a term page are a Markdown link `[Begriff](#/glossar/<id>)`
  (internal `#/…` links render as router `<Link>`, `markdownComponents.tsx`). The lines contain no bold, so `baueGlossar` (which only reads bold
  terms) is unchanged by them; the search skips `generiert` sections because the glossary entries are already indexed.

### Begriffsseiten (plan phase 3)

- **Content**: `AP-2/Begriffsseiten_<A–Z>.md` and `Begriffsseiten_0-9.md` (written by agents from `AP-2/Prompt_Glossar_Begriffsseiten.md`, part A).
  One page per `## Begriff`, first line `<!-- id: <glossary id> · quellen: … · stand: JJJJ-MM -->`, then the definition paragraph, optional
  `Auch: …`, `### Erklärung/Beispiel/Abgrenzung/Prüfungsfalle/Merksatz`, `Siehe auch: A · B`, `Mehr: Deep Dive 5, 6.5 · …`; `## Ausgelassen`
  at the end of each file lists skipped labels and is ignored. Today **1,003 pages** for 1,135 glossary terms.
- **Parser/check** `shared/begriffsseiten.ts` (pure, `tests/begriffe.test.ts`): `parseBegriffsseiten` (page without id comment → ImportIssue),
  `pruefeBegriffsseiten` (id must exist in the glossary, ids unique, every „Siehe auch“ name must lead to a page, a glossary term or a section
  heading), `mehrZiel` („Deep Dive 5, 6.5“ → section, „Teil 3“ → part, „A3“ → section „A3 …“ or else task `NN-A3`, „SQL-Zusatz 1.2“ → topic 00).
  `ladeInhalt(dir)` in `server/loadContent.ts` returns `{ content, seiten }`; `loadContent` = `ladeInhalt().content`.
- **Delivery**: pages are about 1.5 MB, so they are **not** part of `content.json` (only the index `content.begriffe`). Pages build: `begriffe.json`
  next to `content.json` (precached by the service worker like all JSON); local app: `GET /api/begriffe` (same cache as `/api/content`).
  Client: `ladeBegriffe()` in `src/lib/begriffe.ts` (once per session, `api.begriffe()`).
- **Page** `pages/Begriff.tsx` (`/glossar/:id`, lazy): crumbs Glossar / letter, title, „Auch“, the page Markdown (`###` shown as `h2` for a
  gapless heading order), „Siehe auch“ as chips (`verweisAufloeser`: page → glossary entry → section), **Üben** (`uebungenZuBegriff`: term card
  first, cards whose question or answer names the term or a variant as whole words, tasks, Rechen- and SQL-Übungen; 6 per kind, „n weitere
  anzeigen“; „Alle lernen“ → `/karteikarten?karten=…&von=begriff`, shown as „Zum Begriff: n Karten“), **Nachlesen** (`Mehr` targets + glossary
  sources). An id without a page redirects to the page of the same term under another spelling (`seitenFinder`) or to the glossary entry.

**Other**: theme switch (system/light/dark) in **Einstellungen → Design** (`src/lib/theme.ts`, `hooks/useTheme.ts`; localStorage key `theme`,
applied in `main.tsx` before the first render), error boundary per route, own confirm dialog (`useConfirm`), print CSS (no navigation).

### Quellen und Lehrvideos (plan phase 8)

- **Data** `AP2_Quellen.json` (§ 4.4c) → `content.quellen`; `quellenNachZiel` groups by target in file order.
- **Display** `src/components/Quellen.tsx`: `QuellenListe` (box `.quellen-box`, hidden in print) – link text, provider, „mit Video“; links
  open in a new tab (`target="_blank" rel="noopener noreferrer"`, screen reader hint „öffnet in neuem Tab“). On the learning sheet after
  every section that has sources (`Themen.tsx`), on term pages as section „Weiterlesen und Videos“ (`Begriff.tsx`, `useQuellen`).
- **Video embedding (decision E5)** `YoutubeZweiKlick`: before the click only a note and the button „Video laden“ – nothing is loaded from
  YouTube; after it an iframe to `https://www.youtube-nocookie.com/embed/<id>?rel=0`. Offline: „Video nur online verfügbar“. Studyflix videos
  are only linked (no embedding of third-party players). The Datenschutz note names both (both modes).
- Tests: `tests/quellen.test.ts`.

### Übersicht (plan phase 9; replaces the KPI tiles and bars of the dashboard)

- **Layout** (`pages/Dashboard.tsx`, CSS `.widgets`): iOS-style widgets in a grid with `grid-auto-flow: dense` – from 900 px 4 columns
  (small widgets `.w-klein` = 1 column, all others 2), below 2 columns (small = half, others full width). Nothing of the old dashboard was
  dropped; FehlergrundKarte and KalibrierungKarte are grid items too (they render nothing without data). "Fortschritt je Thema" is a list
  (`.thema-fortschritt`) instead of a table: desktop aligned columns with a header row (`aria-hidden`, every value carries its own
  `.tf-label`, visually hidden there), phones show "Label Wert" chips that wrap under the title – no column is hidden any more.
- **Pure logic** `src/lib/uebersicht.ts`: `PRUEFUNGSBEREICHE` (prozess: DD5, 12, 16, 18; qualitaet: DD0–4, 6–11, 15, 19; wiso: DD13, 14, 20 – DD18 to DD20 are the Altklausur-Training sheets modelled on the real Sommer-2026 exams, each with its own 100-point Übungsklausur; DD17
  nowhere – each Deep Dive counts once, to the area most of its exam blocks belong to in `UNTERBEREICHE`), `bereichFortschritt` (cards in box ≥ 3;
  exercises = tasks whose last attempt reached `SICHER_RICHTIG_AB` + solved SQL, Rechen and Diagramm exercises; diagram exercises count to
  Prozessanalyse), `faellig` (journal, cards incl. new, SQL/Rechen/Diagramm repetitions), `begriffDesTages` (term page fixed per day via
  `seedAusText` (`src/rechnen/zufall.ts`), preferring terms with a Begriffskarte so the short definition is shown without loading `begriffe.json`), `klausurVerlauf`.
- **Rings** `src/components/Ring.tsx`: `Ringe` (concentric inline-SVG circles with `pathLength=100`, `role="img"` + label; outer = cards,
  inner = exercises) and `MiniRing` (one ring in the IHK colour step + percent; replaces the `.bar` with `mix-blend-mode` on the dashboard –
  the plain `.bar.wide` progress bars of the exercise lists stay).
- **Weiterlesen**: `hooks/useLeseStelle.ts` (in `Thema`) stores the section at the top of the viewport (on open, then throttled to 400 ms while
  scrolling) in `localStorage` **`ap2-lesestelle`** (`src/lib/leseStelle.ts`, try/catch, read tolerantly). The dashboard links to
  `/lernen/<id>?stelle=<section>`; per device, not part of progress or backups.
- Tests: `tests/uebersicht.test.ts`.

### Navigation (plan phase 2; replaces the sidebar and the mobile „Üben“/„Mehr“ menus)

- **Four areas** (`BEREICHE` in `src/lib/navigation.ts`, pure and tested), the logo leads to the Übersicht (`/`). No URL changed – the areas
  only group the existing routes:

  | Area | Sub-targets (Unterleiste) |
  |---|---|
  | Lernen (`/lernen`) | Heute lernen, Themen, Karteikarten, Einzelaufgaben, Rechenübungen, Übungsklausur, Fehlerjournal |
  | Glossar (`/material/glossar`) | Begriffe A–Z, Diagramme (`GLOSSAR_PFAD` = `/lernen/17`), Formelsammlung, Operatoren |
  | SQL-Editor (`/sql`) | Freier Editor (exact match), Übungen (incl. `/sql/uebung/:id`) |
  | Einstellungen (`/einstellungen`) | Einstellungen, Material (`/material`, `/material/:docId`), Daten & Import, KI-Aufgaben (local only) |

  `aktiverBereich(pathname)` maps every route (`/lernen/17` and the three glossary pages under `/material` → Glossar, other `/material/*` →
  Einstellungen); `aktivesUnterziel` picks the longest matching sub-target. **Due badges**: an area shows the sum of its sub-targets
  (Lernen = Rechnen + Fehlerjournal, SQL = SQL), each sub-target its own; screen readers get ", n fällig".
- **Desktop/tablet** (`components/Kopfleiste.tsx`): sticky translucent header (`.kopf`, height `--kopf-hoehe` 56 px + safe area =
  `--kopf-gesamt`) with logo, the four areas (pill, `aria-current="page"`), save state (green dot; text only on error/conflict) and search
  button (`⌘K` on Apple devices, otherwise `Strg K`). Below it the **Unterleiste** of the active area (pills, horizontally scrollable, the
  active pill is scrolled into view; not on the Übersicht). Below 760 px the header shows icons only (labels stay as screen-reader text).
- **Phone (< 600 px)**: slim header (48 px) with logo, area title and round search button; the Unterleiste as swipeable pills; fixed **tab
  bar** at the bottom (`components/MobileNav.tsx`): Übersicht, Lernen, Glossar, SQL, Einstellungen. `main` has bottom padding so the bar never
  hides content; the PWA toast sits above it.
- **Sticky offsets**: everything that sticks or is a jump target respects the header: `.toc`, `.exam-bar`, `.glossar-abc` use
  `top: var(--kopf-gesamt)`, `.theory`, glossary entries and `.stelle-ziel` have `scroll-margin-top`. `useStelle` corrects the position once
  scrolling has settled (content above, e.g. formulas, can still grow during smooth scrolling).
- **Accessibility**: „Zum Inhalt springen“ (`.skip-link`, first focusable element, focuses `main#inhalt`); labels hidden on small screens
  are visually hidden, not removed (accessible names stay).
- `index.html`: `viewport-fit=cover` (safe areas for notch and home indicator), `theme-color` light `#f2f2f7` / dark `#000000`, SVG favicon
  (graduation cap). Manifest `theme_color`/`background_color` `#f2f2f7`.

### Mobile details (phase 7.3, plan phase 2)

- **iPhone fixes** (findings in `AP-2/Messung_Ausgangslage.md`), all below 600 px: inputs, selects, textareas and the SQL editor use 16 px
  (iOS Safari no longer zooms in), page padding 16 px, KPI tiles in two columns, tables keep a minimum column width and scroll sideways with a
  shadow at the right edge (`--tabelle-bg`), columns with class `nur-breit` are hidden (deck table: Prüfungsbereich, Quelle; Übersicht:
  Lernziele, Fehlerjournal), „Wie sicher bist du?“ and the rating buttons as three equal columns, rows that only contain buttons as a
  two-column grid (main button full width), flashcard padding 20 px, cards inside cards are flat, compact exam bar. The flashcard filters are a
  `<details class="filter-box">` – open on desktop (summary hidden), closed on phones unless the URL has filter parameters.
- **Touch targets** (7.3, below 600 px): buttons, `.button` links, selects and inputs at least 44 px high (except the small helper buttons
  `.small`, schema browser and query history; table inputs of Rechenübungen 36 px), larger checkboxes/radios, more padding for choices, tabs and
  `<summary>`. Filters wrap into two columns instead of overflowing, theory pages no longer overflow horizontally, and filter checkboxes are no
  longer 160 px wide (also fixed on desktop). Swiping on flashcards (optional in the roadmap) is not implemented.

### PWA (phase 7.1, Pages only)

- `vite-plugin-pwa` (devDependency, Workbox **generateSW**; `workbox-window` as dependency) is added **only in `--mode pages`**
  (`server/pwaPlugin.ts`, `PWA_OPTIONS`). `npm run dev`, `npm start` and `npm run build` never produce or register a service worker
  (`dist/` of `npm run build` has no `sw.js` and no manifest; only an unused 6 kB `workbox-window` chunk is emitted there).
- **Manifest** `manifest.webmanifest`: name "AP2 Lern-App", short name "AP2 Lernen", `id`/`start_url`/`scope` `./` (relative, works under
  `/ap2_lernapp/` with the HashRouter), `display: standalone`, theme colour `#f2f2f7` (light grouped background). Icons in `public/icons/`: `icon-192.png`,
  `icon-512.png`, `icon-maskable-512.png` (icon at 80 % on a blue gradient, inside the maskable safe zone) and `apple-touch-icon.png` (180 px,
  linked in `index.html`). They were generated once from the icon of the former desktop build (512 × 512) with Windows System.Drawing
  (high-quality bicubic) and committed – no image library in the project. `tests/pwa.test.ts` checks that every icon exists with the declared size.
- **Precache** (`globPatterns` `**/*.{html,js,css,json,wasm,woff2}` + manifest + icons): index.html, all JS chunks including the lazy ones
  (SQL, Rechnen, KaTeX, CodeMirror, the lazy pages), CSS, `content.json`, `texte/*.json`, `sql-wasm.wasm`, the KaTeX **woff2** fonts (woff/ttf
  are not cached; every current browser uses woff2), `begriffe.json`. Today **98 entries, about 6.4 MB**. `maximumFileSizeToCacheInBytes` is
  8 MB (content.json ~1.3 MB, begriffe.json ~1.5 MB).
  Navigations fall back to the cached `index.html`, so the app starts offline after the first visit (SQL editor and formulas included).
- **Updates** (`registerType: 'prompt'`, no `skipWaiting`/`clientsClaim`): every precached file has a revision hash in `sw.js`, so any change
  (also only `content.json` after `npm run sync-content`) changes `sw.js`. The browser installs the new worker, which then **waits**.
  `src/lib/pwa.ts` registers `sw.js` with `workbox-window` after `load` and sets `updateState` on `waiting` (also when a worker from an earlier
  visit is already waiting); `components/UpdateHinweis.tsx` shows the toast **"🔄 Neue Version verfügbar – neu laden?"** with "↻ Neu laden"
  (sends `SKIP_WAITING`, reloads on `controlling`, fallback reload after 3 s) and "Später". Nothing reloads by itself (an exam in progress
  is never interrupted); after "Später" the new version takes over once all tabs of the app were closed. Because the HashRouter never
  navigates, an open app also asks for a new `sw.js` every hour and when the tab becomes visible again (at most every 10 minutes).
  Progress is unaffected (the service worker doesn't touch localStorage/IndexedDB; the saver flushes on `pagehide` before the reload).
- Checked in a headless Edge against `npx vite preview --mode pages`: worker active with 45 cache entries, toast after a rebuild, "Neu laden"
  activates the new build; offline reload of `/sql` runs queries (WASM) and the Rechenweg renders KaTeX with the cached fonts.
- **Testing locally:** the worker caches the preview origin (`localhost:<port>`). After a new `build:pages` reload once and click
  "↻ Neu laden", or unregister it in the dev tools (Application → Service Workers).

## 6. Progress (persisted data)

Defined in `shared/progress.ts`, **`PROGRESS_VERSION = 8`**.

```ts
type Progress = {
  version: 8;
  revision: number;                        // bumped on every save; stale tab → 409 (v2)
  attempts: Attempt[];                     // task attempts (taskId, points, max, date, mode, sicherheit?)
  exams: ExamRun[]; activeExam?: ExamRun;
  cards: Record<string, CardState>;        // Leitner box + due, keyed by flashcard id
  journal: Record<string, JournalEntry>;   // error journal (stage, due, resolvedAt)
  lernziele: Record<string, boolean>;
  cardReviewDays: Record<string, number>;  // YYYY-MM-DD → count, for the streak (v3)
  sql: Record<string, SqlState>;           // attempts, solvedAt, hintsUsed, solutionShown, lastQuery, stage, due (v4)
  sqlDays: Record<string, number>;         // for the streak (v4)
  rechnen: Record<string, RechenState>;    // Rechenübungen per exercise id (v6)
  rechnenDays: Record<string, number>;     // checked Rechenübungen per day, for the streak (v6)
  settings: Settings;                      // per-user settings, part of the backup (v5)
  markiert: Record<string, Markierung>;    // marked flashcards by card id (v7)
  diagramme: Record<string, DiagrammState>; // Diagramm-Übungen per exercise id (v8): attempts, solvedAt, lastCheckedAt, hintsUsed,
                                           // solutionShown, stage, due, belegung (last checked slot → palette id, restored on reopen)
  diagrammDays: Record<string, number>;    // checked Diagramm-Übungen per day, for the streak (v8)
};

type Markierung = { an: boolean; am: string }; // am = ISO timestamp of the last change; unmarking keeps the entry with an: false

type Attempt = {
  taskId: string; date: string; points: number; max: number; mode: 'klausur' | 'einzel' | 'wiederholung';
  sicherheit?: 1 | 2 | 3;        // "Wie sicher bist du?" before submitting (phase 8.3, optional, no version bump)
  fehlergrund?: 'begriff' | 'formel' | 'rechenfehler' | 'operator' | 'zeit'; // why below full points (phase 8.7, optional, no version bump)
};
// ExamRun additionally has sicherheit?: Record<taskId, 1 | 2 | 3> (chosen before submission) and fehlergrund?: Record<taskId, Fehlergrund>
// (chosen while grading); finishExam copies both into the attempts (fehlergrund only below full points).
// ExamRun.topicId is a topic id or the id of a mixed exam "mix-<bereich>-<seed>" (phase 8.5, no format change).

type RechenState = {
  attempts: number;              // counted "✓ Prüfen" clicks
  solvedAt?: string;             // first check with all inputs right, without having seen the solution
  lastCheckedAt?: string;
  hintsUsed: number;
  solutionShown?: boolean;
  stage?: number; due?: string;  // repetition like SQL (JOURNAL_INTERVALS 1/3/7 days, src/lib/wiederholung.ts)
  lastSeed?: number;             // seed of "🎲 Neue Zahlen"; missing = the exercise's fixed numbers
  antworten?: Record<string, string>; // last checked inputs (max 200 chars each), restored on reopen; cleared when the numbers change
};

type Settings = {
  examDate?: string;            // YYYY-MM-DD, own exam date for the countdown (unset = no countdown)
  prueferfragen: boolean;       // default true: Prüferfragen in flashcards and theory
  fachgespraech: boolean;       // default true: Fachgespräch questions as flashcards
  leichtModus: boolean;         // default false: remembered flashcard mode (phase 6)
  backupReminderDays: number;   // default 7: backup reminder after N days (Pages)
  lastBackupDownloadAt?: string; // YYYY-MM-DD of the last downloaded backup (optional, no version bump, see below)
  leichtAutomatisch?: boolean;   // Leicht-Modus: automatic answers for cards without mc; missing = on (optional, no version bump, phase 6)
  ausgeblendeteThemen?: string[]; // hidden learning sheets (topic ids, in hiding order); missing = none (optional, no version bump)
};
```

**Safety rules (all implemented, keep them):**
- `checkProgressPut` validates with zod, rejects a strong drop in `attempts` unless `reset: true` (reset button, backup restore),
  and rejects a stale `revision` with 409. Same rules on the server and in `staticApi.ts`.
- `migrateProgress(raw)` runs versioned `MIGRATIONS` (1→2 revision, 2→3 cardReviewDays, 3→4 sql/sqlDays, 4→5 settings, 5→6 rechnen/rechnenDays, 6→7 markiert, 7→8 diagramme/diagrammDays) and fills missing fields.
  `migrateSettings` fills defaults, drops an invalid `examDate`/`lastBackupDownloadAt` and keeps unknown fields.
  `lastBackupDownloadAt` was added without a version bump: it is optional, `SettingsSchema` is a loose object with all fields optional
  and `migrateSettings` already kept unknown fields, so every v5 file (old or new) is valid and nothing needs converting.
  `leichtAutomatisch` (phase 6.4) was added the same way (optional boolean, missing = on, a wrong type is dropped): every v6 file stays valid,
  so `PROGRESS_VERSION` stays **6**. Phase 6 needed no other format change (Leicht answers use the existing `CardState`/`RechenState` fields).
  **Phase 8.3** added `Attempt.sicherheit` and `ExamRun.sicherheit` the same way (decision: optional fields, no bump): `AttemptSchema` and
  `ExamRunSchema` are loose objects and `migrateAttempt`/`migrateExam` already kept unknown fields, so every v6 file stays valid and an older
  app (e.g. a not yet updated PWA) keeps the fields too. `migrateAttempt`/`migrateExam` now drop invalid values (anything but 1, 2, 3);
  `checkProgressPut` rejects them. Fixture `tests/fixtures/fortschritt-v6-2026-10-01.json` (v6 before 8.3) is tested to load unchanged.
  **Phase 8.7** added `Attempt.fehlergrund` and `ExamRun.fehlergrund` by the same rule (optional, loose schemas, `migrateAttempt`/`migrateExam` kept
  unknown fields): `FEHLERGRUENDE` in `shared/progress.ts`, invalid values dropped on migration (`isFehlergrund`) and rejected by
  `checkProgressPut` (`z.enum`); `PROGRESS_VERSION` stays **6**. Tested with the v6 fixture (which has no `fehlergrund`). Phases 8.5, 8.6, 8.8 and
  8.9 need no format change (mixed exam id in `topicId`; example stage from `RechenState`; search and glossary are derived data).
  Adding a **required** field or changing a meaning still needs a version bump.
  **Plan phase 4 (version 7):** `markiert` is a required collection, so it got a real bump (6→7, starts empty). It is deliberately **not** a
  field of `CardState`: a `CardState` means "already learned" (`!progress.cards[id]` = new card in Karteikarten, Heute, Dashboard), and marking
  must not change scheduling. `migrateMarkierung` drops entries without boolean `an` / string `am` and keeps unknown fields; `MarkierungSchema`
  is a loose object. Pure helpers in `src/lib/markiert.ts` (`istMarkiert`, `setzeMarkierung`, `wechsleMarkierung`, `markierteIds`).
  Fixture `tests/fixtures/fortschritt-v7-2026-10-09.json`; tests in `tests/markiert.test.ts` and `tests/markierenSeiten.test.ts`.
  **Hidden sheets** (`settings.ausgeblendeteThemen`) were added like `leichtAutomatisch`: optional, `SettingsSchema` allows `string[]`,
  `migrateSettings` keeps unique non-empty strings and drops an empty or invalid list; `PROGRESS_VERSION` stays **8**. Tests: `tests/ausgeblendet.test.ts`.
  Not in `Progress`: the "Heute lernen" session (`localStorage` `ap2-heute`, per day and device, § 5), the last reading position
  (`localStorage` `ap2-lesestelle`, § 5 „Übersicht“) and the "Deine Antwort" text (not stored).
  Backup files are read with `parseBackup` (`src/lib/backup.ts`, used by Daten & Import and the welcome screen).
  **Every schema change:** bump `PROGRESS_VERSION`, add a migration step, extend `tests/progress.test.ts` (fixtures in `tests/fixtures/`, one per version).
- Settings are changed only through `withSettings` (`src/lib/settings.ts`). "Fortschritt zurücksetzen" keeps the settings. The theme stays in `localStorage` (per device).
- Local app: atomic writes with retry, daily backup `data/backups/fortschritt-YYYY-MM-DD.json` (last 14 kept), broken file → `*.defekt-<ts>`.
- Pages: `localStorage` key `ap2-fortschritt`; an unreadable value is moved to `ap2-fortschritt-defekt`.
- **Pages protection (phase 3):**
  - `navigator.storage.persist()` once per page load after the first successful save (`persistentStorage.ts`, via `createStaticApi`);
    *Daten & Import* shows "Speicher dauerhaft: ja/nein/unbekannt". Unsupported or throwing → ignored.
  - **Daily backups in IndexedDB** (`browserBackups.ts`, DB `ap2-lernapp`, store `sicherungen`, key = date): before the first save of a day
    the previously stored JSON (state at the start of the day) is copied, at most one per day, the last 7 kept (`planBackup`, pure).
    Runs fire-and-forget and serialized after the `localStorage` write, so a missing/blocked IndexedDB never delays or breaks saving.
    `staticApi.backups()` returns `{ newest, count, items }`, `readBackup(date)` the JSON; restore = `parseBackup` + `replaceProgress`.
    The local app is unchanged (`data/backups/`; its `readBackup` rejects with 501).
  - **Backup reminder** (`backupReminder.ts`, pure): Dashboard banner "Letzte Sicherung vor N Tagen – ⬇ jetzt herunterladen" when
    `lastBackupDownloadAt` is at least `backupReminderDays` old and there is a learning day (`activityDays`) after it; without any download
    it counts from the first learning day. "Später" hides it until reload. The number of days is adjustable on `/einstellungen` (Pages only).
  - Downloads go through `useBackupDownload` (all modes): file `ap2-lernapp-sicherung-YYYY-MM-DD.json` (`backupFileName`), then
    `settings.lastBackupDownloadAt = today`.
- **Merge on import** (`shared/mergeProgress.ts`, `mergeProgress(current, incoming)`, pure, `tests/mergeProgress.test.ts`), both sides migrated:
  - `attempts`: union, duplicate = same `taskId` + `date`, sorted by date (stable) → never fewer attempts than before. For a duplicate the
    current attempt wins, but a missing `sicherheit` (8.3) or `fehlergrund` (8.7) is taken from the backup.
  - `exams`: union by `id`; in both → the more advanced run (finished > submitted > started, then later time); sorted by finish time.
    The chosen run carries its `sicherheit` and `fehlergrund` maps.
  - `activeExam`: this browser's running exam; the backup's only if none runs here; dropped if the merged history has it finished.
  - `cards`: `CardState` has no date → more `reviews` wins, then later `due`.
  - `sql`, `rechnen`, `diagramme`: newer `lastCheckedAt` wins (then more attempts/hints); the earliest `solvedAt` of both sides is kept.
    `diagrammDays` like the other day counters (max per day). Plan phase 7: fixture `tests/fixtures/fortschritt-v8-2026-10-09.json`.
  - `journal`: entry of the side with the newer attempt for that task (from `attempts`); tie → higher `stage`, then later `due`.
  - `markiert`: per card the newer action by `am` (marking or unmarking), tie → current state; so an unmarked card does not come back.
  - `lernziele`: true on either side wins. `cardReviewDays` / `sqlDays` / `rechnenDays`: max per day (not the sum – shared history would count twice).
  - `settings`, `revision`, unknown fields: from the current state. Keeping the current revision (the saver sends its own base revision anyway)
    and never dropping attempts means the following normal PUT (no `reset`) passes `checkProgressPut`.
  - UI: merge uses `update()` (normal save), replace uses `replaceProgress()` (`reset: true`). The welcome screen only replaces (nothing stored yet).
- Saving is debounced (`SAVE_DELAY_MS`), flushed on `pagehide`; state updates are pure, persisting happens outside the updater.
- Multiple tabs: after a 409 the tab stops saving and shows a reload banner. On Pages the `storage` event marks other tabs as stale.

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

## 8. AI (local app only)

- **Pages has no AI** (owner decision Q3, roadmap 7.4): no "KI-Aufgaben" nav item (sub-target of Einstellungen, `nurLokal`), `/generator` redirects to `/`,
  no "🤖 KI-Bewertung" button in `GradePanel`, no "Quelle" filter on Einzelaufgaben (`?quelle=` is ignored), no KI section or KI task count
  on Daten & Import, and the Klausur hint doesn't mention AI grading. Tested in `tests/pagesOhneKi.test.ts` (MODE stubbed to `pages`).
  AI with a per-user API key in the browser (roadmap 7.5) is **not** implemented.

- `ANTHROPIC_API_KEY` (and optional `ANTHROPIC_MODEL`, default `claude-sonnet-5`) in `lern-app/.env.local`. The key stays in Node.
- `POST /api/ai/generate` (topicId, count 1–10, types) → tasks with `generated: true`, stored in `data/generierte-aufgaben.json`, deletable.
- `POST /api/ai/grade` (taskId, answer) → `{ points, feedback, missing }`.
- Pages: the static API still rejects every AI call with 501 "Nur in der lokalen App verfügbar" (nothing in the UI calls it any more).

## 9. Quality gates

```bash
npm test            # Vitest: parser (fixtures), smoke test on real content/, progress migration, stats, SQL checker/lint/errors/runner,
                    # Rechenübungen (templates, properties, checker, content, pages)
npm run typecheck   # tsc -b
npm run lint        # ESLint flat config, typescript-eslint, react-hooks, --max-warnings=0
npm run format:check
npm run build && npm run build:pages
```

- Tests don't depend on the live `AP-2/` sheets except one broad smoke test on `content/`.
- The SQL content smoke test runs every setup and solution in Node (sql.js), checks unique IDs, dataset integrity against the DD1 tables
  and that no model solution triggers its own dialect warnings.
- Rechenübungen: `rechenVorlagen.test.ts` (each template reproduces the sheet example), `rechenEigenschaften.test.ts` (every template over
  150 seeds: valid data, finite results, plausible ranges, Fehlerbilder ≠ right value after rounding, the checker accepts the shown right value
  and recognises every Fehlerbild), `rechenChecker.test.ts`, `rechenUebungen.test.ts` (parser), `rechnenProgress.test.ts`,
  `rechenInhalte.smoke.test.ts` (content/: no ImportIssues, 100 seeds per exercise, fixed exercises match the numbers of the sheet solutions)
  and `rechnenSeiten.test.ts` (server-side render of both pages for every exercise).
- Leicht-Modus: `leicht.test.ts` (card selection, option building: exactly 4, correct one included, no duplicates, shuffled; all real cards;
  filter counts), `logic.test.ts` (box cap), `leichtRechnen.test.ts` (Rechnen options incl. every exercise of `content/` with several seeds,
  checker agrees; progress), `leichtSeiten.test.ts` (render of Karteikarten and every Rechenübung in Leicht), `lernkarten.test.ts` (`mc` block),
  `mcWerkzeug.test.ts` (authoring helper with a mock client).
- Phase 4.4/4.5: `math.test.ts` (every formula in `content/` renders with KaTeX, no result inside a formula), `druck.test.ts` (`/druck` renders
  every solution sheet with formulas, no `katex-error`), `loesungStil.test.ts` (result box after a formula), `formeln.test.ts` (every template has
  formulas, no unknown template ids, valid KaTeX, Rechenwege use the formulas, Formelsammlung page, Material link, `?vorlage=` filter).
  `rechenInhalte.smoke.test.ts` reads numbers inside formulas as text (`70{,}00` = 70,00).
- Phase 7: `pwa.test.ts` (manifest paths relative, icons exist in the declared size, precache patterns, prompt update; update state),
  `navigation.test.ts` (bottom bar groups, badges, render), `pagesOhneKi.test.ts` (no AI UI in the Pages build).
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
- One commit per logical change; formatting-only changes in their own commit.

## 10. Rules for future changes (for AI agents)

1. **Never lose progress.** Schema change ⇒ migration + test with the old fixtures. Old backups must still import.
2. **Never break Pages.** Check `npm run build:pages` + `npx vite preview --mode pages` for anything touching loading, paths, WASM or storage.
   A broken service worker hits every user: keep `registerType: 'prompt'` and relative paths, and check that `sw.js`, `manifest.webmanifest`
   and every precached URL answer 200. A new file type the app loads at runtime must be added to `globPatterns`, or it is missing offline.
3. **Multi-user on Pages:** no personal data, dates or names in code or UI; per-user settings go into progress (so they are in the backup)
   or `localStorage`; no server, no tracking.
4. Keep content read-only in the app; content changes go through `AP-2/` + `npm run sync-content`.
5. Pure logic in `shared/` or `src/lib/` with tests; pages mostly render.
6. German UI, existing tone and style (2 spaces, single quotes, printWidth ~140, trailing commas).
7. **Section texts are not in the store** (§ 3.1): a page that needs `Section.markdown` uses `useThemaTexte` or `useVollerInhalt`; lib
   functions that don't need texts take `KernInhalt`. Keep the main bundle small: new pages are lazy, and add them to `SEITEN` in `App.tsx`.
