# AP2 Lern-App – Overview and run modes

> Part of the technical documentation (sections 1–2). Overview: [DOKUMENTATION.md](../DOKUMENTATION.md).

## 1. Purpose

A learning app for the IHK exam **Abschlussprüfung Teil 2 – Fachinformatiker/-in Daten- und Prozessanalyse (FIDPA)**.
It turns German Markdown learning sheets ("Deep Dives") and a flashcard JSON into interactive exercises: theory, flashcards,
timed practice exams with **separate solution sheets**, single tasks, an error journal with spaced repetition, a browser SQL editor
with auto-checked exercises, auto-checked calculation exercises (Rechenübungen) with new numbers on demand, and nothing else: no server, no AI.
The app is a static, installable PWA that works offline.

**Conventions**
- All UI text is German, informal *du*, short sentences.
- **Look:** a squared notebook – an open ring binder on desktop, a spiral pad on phones (see “Notebook design” under Navigation).
  All styles live in `src/styles/`; `index.css` imports them in a **binding order** (§ 3.2). Colours, radii and shadows are tokens
  on `:root` in `src/styles/tokens.css` (light + dark): grouped background
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

The app is **static only** (since November 2026): no server, no AI. Content comes from JSON files next to the app, progress lives in
the browser. The earlier local mode (Vite middleware `/api/…`, progress in a file, Claude tasks and grading, the `mc-*` and
`sync-content` tools, a source folder outside the repository) was removed; `git show audit-optimierung:DOKUMENTATION.md` describes it.

| | `npm run dev` | `npm run build` + `npm run preview` / GitHub Pages |
|---|---|---|
| Learning sheets | `content/`, served from memory by `build/inhaltPlugin.ts`; the page reloads when a sheet changes | `content/` → `content.json`, `details.json`, `texte/<id>.json`, `begriffe.json` in `dist/` (§ 3.1) |
| Progress | IndexedDB of the browser (fallback `localStorage`) + daily backups in IndexedDB (§ 6) | same |
| Service worker / PWA | no (`main.tsx` registers only in a production build) | yes (`build/pwaPlugin.ts`, § 5 "PWA") |

- `src/lib/api.ts` exports the one data source (`createStaticApi()`, `src/lib/staticApi.ts`); which store holds the progress is chosen in
  `src/lib/fortschrittSpeicher.ts` (§ 6).
- Public URL: **https://alexseiff.github.io/ap2_lernapp/** (HashRouter, `base: './'`).
- `.github/workflows/pages.yml`: pull requests and pushes to `main` run `npm ci` → `npm test` → `npm run lint` →
  `npm run format:check` → `npm run build` → browser tests (`npx playwright install --with-deps chromium`, `npx playwright test`, § 9);
  only `main` deploys.
- **The build stops on import issues** (missing required field, duplicate id, dead reference): `contentJsonPlugin` calls `this.error`
  when `content.issues` is not empty. The dev server still starts and shows them under Daten & Import.
- The app is **used by several people**. Each browser has its own progress; there is no shared state and no account.
- Moving a progress file of the old local mode: it is a valid backup – Daten & Import → „Sicherung einspielen“.
- Progress that an older version of the app left in `localStorage` moves to IndexedDB automatically at the first start (§ 6).
