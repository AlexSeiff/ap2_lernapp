---
name: app-pruefen
description: Start the AP2 Lern-App and check changes visually in a real browser – screenshots in light and dark mode, desktop and phone width, clicking through card sessions, reading console errors. Use this whenever a change touches what the user sees (CSS, animations, layout, a page or component, Markdown/formula rendering, content that renders differently) or the user asks to run, open, screenshot, "look at" or check the app, even if they don't say "screenshot". Also use it before reporting a UI change as done, so it is checked and not just assumed.
---

# App prüfen

Tests prove logic; they don't show whether a card slides in, whether a formula sits right in dark mode or whether a button wraps
on a phone. This skill gets the app in front of your own eyes: start it, drive it with the installed Edge (headless), look at
the screenshots with the Read tool, and report what you actually saw.

## 1. Which server

| Need | Server | Why |
|---|---|---|
| Look at pages, read-only clicking (browsing cards, opening sections, switching filters) | **dev**, port 5178 | live content, hot reload |
| Anything that **saves progress** (rating cards, „Heute lernen“ steps, submitting tasks/exams, Rechen-/SQL-„Prüfen“, settings such as the Leicht switch, marking a card) | **Pages preview**, port 4174 | progress lives in the headless browser's empty `localStorage`, thrown away after the run |
| PWA, offline, loading, paths | Pages preview | that is what users get |

The dev server writes progress to `data/fortschritt.json` – the owner's **real learning progress**. Never rate cards or
submit anything against port 5178; a test run would push cards into the wrong Leitner box and fill the Fehlerjournal.

**Dev server**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5178/   # 200 → already running (often the user's own) – reuse it, don't kill it
npx vite                                                        # otherwise start it with run_in_background (not `npm run dev`: that opens a browser window for the user)
```
Content comes from `LERN_QUELLE` in `.env.local` (on this machine `content/`). Code and content changes reload by themselves.

**Pages preview**
```bash
npm run build:pages                                                  # rebuild after every change you want to see
npx vite preview --mode pages --port 4174 --strictPort               # run_in_background; stop it when you're done
```
Every screenshot run uses a fresh browser profile, so the preview always starts with the welcome screen: begin with
`--klick "Los geht's"`.

## 2. Taking screenshots

`scripts/screenshot.mjs` (no extra packages; Node's WebSocket + Chrome DevTools Protocol). Actions run in the given order:

```bash
S=<scratchpad>/shots
node .claude/skills/app-pruefen/scripts/screenshot.mjs --url "http://localhost:5178/#/karteikarten?blaettern=1&karten=ST2-023" \
  --bild $S/vorne.png --taste " " --bild $S/hinten.png
node .claude/skills/app-pruefen/scripts/screenshot.mjs --url "http://localhost:5178/#/heute" --handy --dunkel --bild $S/heute-handy-dunkel.png
```

Options: `--handy` (390 × 844, touch), `--dunkel`, `--wenig-bewegung` (prefers-reduced-motion), `--ganz` (full page), `--breite/--hoehe`,
`--warten <ms>` after loading (default 800), `--danach <ms>` after every click/key (default 600; use 0 to catch frames of an animation). Actions: `--klick "<text or CSS>"` (exact button/link text first, then contains),
`--taste " " | Enter | Escape | ArrowRight | 1…`, `--pause <ms>`, `--js "<expression>"` (prints the result), `--bild <file.png>`.
The script prints page exceptions and console errors at the end and exits with 1 on an exception – treat that as a finding.

Then **open every screenshot with Read** and look at it. Save them in the scratchpad, never in the repo.

## 3. Useful addresses (HashRouter: everything after `#`)

| What | Address |
|---|---|
| Browse given cards, no rating (safe on dev) | `#/karteikarten?blaettern=1&karten=ID1,ID2` |
| Card session with these cards (Pages preview!) | `#/karteikarten?karten=ID1,ID2` → `--klick "Diese Karten lernen"` → `--taste " "` (flip) → `--taste 1/2/3` (rate) |
| Leicht-Modus (Pages preview – the switch is a setting saved in progress) | `#/karteikarten` → `--klick "Leicht (4 Antworten)"`, then as above; answers with `--taste 1`–`4` |
| Heute lernen | `#/heute` (plan) · `--klick "Los geht"` starts a round (Pages preview) |
| Lernblatt / section | `#/lernen/03`, `#/lernen/03?stelle=<section-id>` |
| Term page, glossary | `#/glossar/median`, `#/glossar` |
| Exercises | `#/rechnen/RE-ST1-001`, `#/sql/uebung/SQL-MH-008`, `#/diagramme/DG-EPK-001`, `#/aufgabe/03-C1` |
| Formulas, print | `#/material/formeln`, `#/druck?thema=03` |

Card ids are in `content/*Lernkarten*.json`, task ids look like `<DD>-<code>` (`03-C1`).
In the Pages preview `--js "location.hash='#/…'"` + `--pause 1500` changes the page without losing the welcome click.

## 4. What to check

Pick what the change touches; for a visual change cover at least light + dark and desktop + phone.

- **Dark mode**: text and borders still visible, no white boxes, formulas (KaTeX) in the text colour.
- **Phone (390 px)**: nothing wider than the screen, buttons don't wrap mid-word, the bottom tab bar doesn't cover content.
- **Animations**: with `--danach 0`, shoot the same step twice – `--pause 100 --bild mitte.png` (mid-animation: the element should be offset or faded)
  and `--pause 800 --bild ende.png` (settled). With `--wenig-bewegung` the mid shot must already look settled.
- **Formulas/Markdown**: no raw `$`, `^`, `_`, `**` or red KaTeX errors in the rendered text.
- **Console**: the script's error list should be empty (a Vite HMR notice is fine).

## 5. Report

Tell the user what you checked and what you saw – name the screenshots by their full path so they can open them, and say plainly
if something looked wrong or couldn't be checked (e.g. a state that needs real progress). Stop servers you started
(`npx vite preview` for Pages); leave a dev server the user was already running alone. On Windows:
`netstat -ano | grep ":4174 "` gives the PID (last column; the state is localized, e.g. „ABHÖREN“), then `taskkill //PID <pid> //F //T`.
