# AP2 Lern-App – Features: search, reference, shell and PWA

> Part of the technical documentation (section 5, part 2). Overview: [DOKUMENTATION.md](../DOKUMENTATION.md).

## 5. Features (continued)

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
- **Topic list A–Z** (Deep Dive 17, `src/lib/glossarThema.ts`, `ergaenzeGlossarThema`, called in `ladeInhalt` – so dev server, build and
  tests are identical): the section with `<!-- glossar-a-z -->` gets a count sentence, and one section per letter (`17-begriffe-a` …, `generiert: true`)
  is inserted after it, one line per entry `- Begriff – Definition *(DD n)*`; terms with a term page are a Markdown link `[Begriff](#/glossar/<id>)`
  (internal `#/…` links render as router `<Link>`, `markdownComponents.tsx`). The lines contain no bold, so `baueGlossar` (which only reads bold
  terms) is unchanged by them; the search skips `generiert` sections because the glossary entries are already indexed.

### Begriffsseiten (plan phase 3)

- **Content**: `AP-2/Begriffsseiten_<A–Z>.md` and `Begriffsseiten_0-9.md` (written by agents from `AP-2/Prompt_Glossar_Begriffsseiten.md`, part A).
  One page per `## Begriff`, first line `<!-- id: <glossary id> · quellen: … · stand: JJJJ-MM -->`, then the definition paragraph, optional
  `Auch: …`, `### Erklärung/Beispiel/Abgrenzung/Prüfungsfalle/Merksatz`, `Siehe auch: A · B`, `Mehr: Deep Dive 5, 6.5 · …`; `## Ausgelassen`
  at the end of each file lists skipped labels and is ignored. Today **1,003 pages** for 1,135 glossary terms.
- **Parser/check** `domain/begriffsseiten.ts` (pure, `tests/begriffe.test.ts`): `parseBegriffsseiten` (page without id comment → ImportIssue),
  `pruefeBegriffsseiten` (id must exist in the glossary, ids unique, every „Siehe auch“ name must lead to a page, a glossary term or a section
  heading), `mehrZiel` („Deep Dive 5, 6.5“ → section, „Teil 3“ → part, „A3“ → section „A3 …“ or else task `NN-A3`, „SQL-Zusatz 1.2“ → topic 00).
  `ladeInhalt(dir)` in `build/inhalt.ts` returns `{ content, seiten }`; `loadContent` = `ladeInhalt().content`.
- **Delivery**: pages are about 1.5 MB, so they are **not** part of `content.json` (only the index `content.begriffe`). `begriffe.json`
  next to `content.json` (precached by the service worker like all JSON).
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
- **Pure logic** `src/lib/uebersicht.ts`: `PRUEFUNGSBEREICHE` (prozess: DD5, 12, 16, 18, 21, 22, 27, 28; qualitaet: DD0–4, 6–11, 15, 19, 23, 24, 29–31; wiso: DD13, 14, 20, 25, 26, 32, 33 – DD18 to DD20 are the Altklausur-Training sheets modelled on the real Sommer-2026 exams, DD21 to DD33 further exam-style variants (sources of DD27–DD33: `docs/ALTKLAUSUR_QUELLEN_DD27-33.md`), each with its own 100-point Übungsklausur; DD17
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

Under **Einstellungen → Design → Karo-Stärke**, learners can choose **Kräftig**, **Dezent** (default) or **Aus**. The choice is stored on the device in `ap2-karo`. It controls the notebook grid and flashcard ruling. Each sheet has a subject-specific margin note from `content/AP2_Randnotizen.json`, keyed by the sheet's topic ID. Narrow screens show the note above the theory.

- **Four areas** (`BEREICHE` in `src/lib/navigation.ts`, pure and tested), the logo leads to the Übersicht (`/`). No URL changed – the areas
  only group the existing routes:

  | Area | Sub-targets (table of contents) |
  |---|---|
  | Lernen (`/lernen`) | Heute lernen, Themen, Karteikarten, Kartenstand, Einzelaufgaben, Rechenübungen, Diagramm-Übungen, Übungsklausur, Fehlerjournal, Podcast, Fachgespräch |
  | Glossar (`/glossar`) | Begriffe A–Z, Diagramme (`GLOSSAR_PFAD` = `/lernen/17`), Formelsammlung, SQL-Belegsatz, Operatoren |
  | SQL-Editor (`/sql`) | Freier Editor (exact match), Übungen (incl. `/sql/uebung/:id`) |
  | Einstellungen (`/einstellungen`) | Einstellungen, Material (`/material`, `/material/:docId`), Daten & Import |

  `aktiverBereich(pathname)` maps every route (`/lernen/17` and the glossary pages under `/material` → Glossar, other `/material/*` →
  Einstellungen); `aktivesUnterziel` picks the longest matching sub-target. **Due badges**: an area shows the sum of its sub-targets
  (Lernen = Rechnen + Diagramme + Fehlerjournal, SQL = SQL). Each sub-target shows its own count.
- **Notebook design** (`components/Buch.tsx`, `src/styles/notizbuch.css`): the app is one book.
  - **Desktop (≥ 1100 px)**. The left page (`Inhaltsseite`) lists the Übersicht and all four areas. The active area expands to show its links with due counts and the current page's sections (`lib/inhaltSlot.ts`). The right page (`.blatt`) holds the content, path, date, save indicator and search. The glossary has letter tabs along the right edge of the book.
  - **Phone/tablet (< 1100 px)**. The sticky header contains search and the “Inhalt” button. The button opens the table of contents in a drawer. Choosing a link, pressing Escape or tapping its backdrop closes it. The glossary offers a letter selector in its search panel.
  - **Raster**: one square = `--k` (26 px). Every text line is exactly one square high and block spacing is whole squares, so the
    horizontal lines run between text lines, not through the letters. Blocks of arbitrary height (tables, formulas, cards) sit on plain
    “Zettel” surfaces; `hooks/useRaster.ts` measures each block lying directly on the paper (`RASTER_BLOECKE`, same selector list as in
    `styles/notizbuch.css`) and sets `--rest` so the next block starts on a grid line again. Only the margin changes, never the block size.
  - **Pieces**: taped sticky notes (`.haft`) and the red margin line (`.rand`) on the Übersicht and learning sheets, progress as hatched squares and
    the study streak as tally marks (`components/Kaestchen.tsx`), headings in ink blue underlined in red.
  - **Fonts**: Atkinson Hyperlegible for text, Kalam for handwritten bits – bundled via `@fontsource/*` (latin subsets, woff2 precached).
- **Sticky offsets**: on desktop nothing sticks at the top (`--kopf-gesamt` is 0); on phones the Kopfzeile is two squares high and
  `.exam-bar`, `.glossar-abc` use `top: var(--kopf-gesamt)`, `.theory`, glossary entries and `.stelle-ziel` have `scroll-margin-top`.
  `useStelle` corrects the position once scrolling has settled (content above, e.g. formulas, can still grow during smooth scrolling).
- **Accessibility**: „Zum Inhalt springen“ (`.skip-link`, first focusable element, focuses `main#inhalt`); labels hidden on small screens
  are visually hidden, not removed (accessible names stay).
- `index.html`: `viewport-fit=cover` (safe areas for notch and home indicator), `theme-color` light `#fdfcf8` / dark `#1f242b` (the paper), SVG favicon
  (graduation cap). Manifest `theme_color`/`background_color` `#fdfcf8`.

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

### PWA (phase 7.1)

- `vite-plugin-pwa` (devDependency, Workbox **generateSW**; `workbox-window` as dependency) is part of every build
  (`build/pwaPlugin.ts`, `PWA_OPTIONS`). `npm run dev` never produces or registers a service worker (`main.tsx`: `import.meta.env.PROD`).
- **Manifest** `manifest.webmanifest`: name "AP2 Lern-App", short name "AP2 Lernen", `id`/`start_url`/`scope` `./` (relative, works under
  `/ap2_lernapp/` with the HashRouter), `display: standalone`, theme colour `#fdfcf8` (the paper). Icons in `public/icons/`: `icon-192.png`,
  `icon-512.png`, `icon-maskable-512.png` (icon at 80 % on a blue gradient, inside the maskable safe zone) and `apple-touch-icon.png` (180 px,
  linked in `index.html`). They were generated once from the icon of the former desktop build (512 × 512) with Windows System.Drawing
  (high-quality bicubic) and committed – no image library in the project. `tests/pwa.test.ts` checks that every icon exists with the declared size.
- **Precache** (`globPatterns` `**/*.{html,js,css,json,wasm,woff2}` + manifest + icons): index.html, all JS chunks including the lazy ones
  (SQL, Rechnen, KaTeX, CodeMirror, the lazy pages), CSS, `content.json`, `texte/*.json`, `sql-wasm.wasm`, the KaTeX **woff2** fonts (woff/ttf
  are not cached; every current browser uses woff2), `begriffe.json`. Today **155 entries, 8.5 MB raw / 3.1 MB gzip** (the original figure of 98 entries was from phase 7.1). `maximumFileSizeToCacheInBytes` is
  8 MB (content.json ~1.3 MB, begriffe.json ~1.5 MB).
  Navigations fall back to the cached `index.html`, so the app starts offline after the first visit (SQL editor and formulas included).
- **Updates** (`registerType: 'prompt'`, no `skipWaiting`/`clientsClaim`): every precached file has a revision hash in `sw.js`, so any change
  (also only `content.json`) changes `sw.js`. The browser installs the new worker, which then **waits**.
  `src/lib/pwa.ts` registers `sw.js` with `workbox-window` after `load` and sets `updateState` on `waiting` (also when a worker from an earlier
  visit is already waiting); `components/UpdateHinweis.tsx` shows the toast **"🔄 Neue Version verfügbar – neu laden?"** with "↻ Neu laden"
  (sends `SKIP_WAITING`, reloads on `controlling`, fallback reload after 3 s) and "Später". Nothing reloads by itself (an exam in progress
  is never interrupted); after "Später" the new version takes over once all tabs of the app were closed. Because the HashRouter never
  navigates, an open app also asks for a new `sw.js` every hour and when the tab becomes visible again (at most every 10 minutes).
  Progress is unaffected (the service worker doesn't touch localStorage/IndexedDB; the saver flushes on `pagehide` before the reload).
- **First visit: registration waits for quiet** (November 2026, `wartebisRuhig` in `src/lib/pwa.ts`). Workbox already installs the precache one file at a
  time, but on a slow network those ~3 MB still slow down every page the user opens during the first seconds. A throttled-network measurement
  (`tools/messung/`: `drossel-server.js` ≈ 1.6 Mbit/s, 150 ms latency, gzip; `start-messung.js`; CPU ×4; median of 3 runs) showed the start itself is unaffected
  (LCP 1.8 s with and without the worker) but a click 1.5 s after load took **4.2 s instead of 2.1 s** (a click after 4 s: 1.9 s → 1.5 s; after 8 s: 1.5 s → 1.8 s,
  because the load only moves later). So on the **first visit only** (no registration yet) `registriereServiceWorker` waits until 4 s without navigation, tap or
  key press (at most 60 s) before it registers; returning visitors register at once (nothing big to load, early update check). The offline-ready time grows by
  about 4 s (≈ 42 s → 46 s on that network). The Workbox precache itself is unchanged (all files, one consistent set per version), because splitting it would
  have meant a hand-written service worker and the risk of mixed versions offline. Tests: `tests/pwaRegistrierung.test.ts` and `e2e/offline.spec.ts` (first visit,
  wait for the precache, go offline, reload, open every main page and run a SQL query; a counter-check proves "offline" really is offline).
- Checked in a headless Edge against `npx vite preview --mode pages`: worker active with 45 cache entries, toast after a rebuild, "Neu laden"
  activates the new build; offline reload of `/sql` runs queries (WASM) and the Rechenweg renders KaTeX with the cached fonts.
- **Testing locally:** the worker caches the preview origin (`localhost:<port>`). After a new `npm run build` reload once and click
  "↻ Neu laden", or unregister it in the dev tools (Application → Service Workers).
