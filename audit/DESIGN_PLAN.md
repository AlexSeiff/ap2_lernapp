# Design improvement plan — 25 October 2026

## Direction and evidence

Make the app feel like a guided learning workspace: the next useful action should be obvious, practice should be calm and focused, and progress should explain what has actually been measured. Keep German product copy and the existing light/dark palette. Improve hierarchy and flow before adding decoration.

This is a **code-based proposal**, not a completed visual or accessibility audit. No fresh browser inspection was possible in this session. `VERBESSERUNGEN.md` contains a prior browser review; changes already present there, including corrected due/new counts and darker rating buttons, should not be presented as new work.

Evidence in the current implementation:

- `src/lib/navigation.ts`: 11 destinations under Lernen, but only 2 under SQL. Material is grouped under Einstellungen while formula/reference material lives under Glossar. The navigation mixes activities, content types, and settings.
- `src/styles.css:207`: secondary navigation scrolls horizontally with its scrollbar hidden. `Kopfleiste.tsx` automatically centers the active destination, but this does not make other destinations discoverable.
- `src/pages/Karteikarten.tsx:352` onwards: the normal learning CTA comes after filters and KPIs, around line 457. Desktop filters default open. A preselected session already gets an early CTA; extend that successful pattern to normal entry.
- `Dashboard.tsx`: seven main widgets before the optional section and further statistics. An expandable “Mehr” section already exists; refine this hierarchy instead of adding another disclosure layer everywhere.
- `Ring.tsx`: progress rings have accessible labels; keep those. Self-rated card familiarity and exercise success are different measurements and should remain separately explained.
- `Quellen.tsx`: source links exist, but the displayed source list does not explain whether a statement was fact checked or only a link was checked.
- Mobile touch styles already use 44px heights for many controls, and rating buttons have 48px height. Smaller controls are exceptions that need measurement, not an assumption that the whole app lacks touch support.

## Implementation sequence

| Phase | Work | Files / areas | Acceptance criteria |
|---|---|---|---|
| 0 — Content trust | Resolve P0 factual errors first; give claims stable review records. Distinguish “Link erreichbar” from “Fachlich geprüft”. Add source/version dates where they matter. | Content, `shared/quellen.ts`, `Quellen.tsx`, audit data | All P0 findings closed across lesson, solution, glossary and cards; each “Fachlich geprüft” label has claim-level evidence and review date. Existing saved card IDs continue to work. |
| 1 — Navigation and entry | Use task-based groups: **Heute**, **Lernen**, **Üben**, **Nachschlagen**. Put settings and backup in a utility area. Give SQL both a prominent practice entry and its existing direct links. | `navigation.ts`, `Kopfleiste.tsx`, `MobileNav.tsx` | Every existing destination remains reachable; existing URLs keep working; key actions are accessible without discovering a hidden horizontal scroll. Keyboard focus and active state remain explicit. |
| 2 — Fast flashcard start | Place “Lernen starten” with an explained selection count directly below the title. Show active filter chips; put advanced filters behind an explicit disclosure on desktop too. Move the deck inventory below the primary task. | `Karteikarten.tsx`, `useCardSession.ts`, shared filter styles | At 390×844 and 1440×900, start CTA is visible without scrolling in the default state. Filters retain their behavior and counts; empty selections explain why and provide a reset. |
| 3 — Guided home | Lead with one “Heute lernen” action and duration choices. Put resume-reading second; due work and concrete next steps third. Keep detailed topic analytics in an expandable section. | `Dashboard.tsx`, `Heute.tsx`, `uebersicht.ts` | New and returning users can identify their next action within 5 seconds in a small usability study. New, due, and reviewed counts stay distinct. Suggested duration includes what is counted and remains an estimate. |
| 4 — Focused practice | Share a stable exercise frame: context/title → prompt/workspace → action → feedback. Keep hints, source material and schema available without overwhelming the prompt. Use a focus layout during a session. | Card, calculation, SQL, diagram and task pages | No learning action is hidden behind a decorative dashboard. Feedback states what was checked, why an answer is wrong, and the next action. SQL clearly names SQLite and distinguishes training execution from exam simulation. |
| 5 — Reading and reference | Use a readable prose column, clearer heading spacing, a useful contents rail on wide screens and a contents disclosure on small screens. Put source evidence and one related practice action close to the explanation. | `Themen.tsx`, `Begriff.tsx`, Markdown/theory styles | Long lessons work at 200% zoom and 320 CSS px reflow; anchors remain visible below sticky navigation. Wide tables/code/diagrams have contained scrolling rather than making the entire page scroll sideways. |
| 6 — Progress semantics | Show explicit numerators/denominators beside rings. Separate “selbst eingeschätzt,” “automatisch geprüft,” and “Klausur-Selbsteinschätzung.” Explain hidden/excluded question types. | Dashboard, Kartenstand, stats, ring labels | A user can explain each percentage's denominator. Excluding question types cannot silently imply lost progress. No percentage is described as a prediction of an IHK result without validation. |
| 7 — Accessibility and polish | Measure contrast, focus, reflow, touch targets, status announcements and diagram alternatives. Then refine spacing, typography and palette consistency. | `styles.css`, shared controls, diagrams, result panels | Keyboard-only completion of all practice modes; visible focus; status changes announced without excessive repetition; no information conveyed by color alone; reduced-motion preference respected. |

## Proposed layouts

Home, in reading order:

```text
Heute lernen                         Search / utility controls
[10 min] [20 min] [40 min]            [Starten]
Your next steps and estimated scope

Weiterlesen                          Wiederholen
Last lesson + position               Due cards / mistakes, with counts

Fortschritt verstehen
Cards: self-rated familiarity        Exercises: checked success
[Details nach Thema]
```

Flashcard setup:

```text
Karteikarten
182 fällig · 20 neue in dieser Runde
[Lernen starten] [Durchblättern]
Aufdecken / Leicht — short explanation of what each measures
Active filter chips                  [Filter ändern]
Optional: deck inventory and detailed statistics
```

These are structural wireframes; the numbers illustrate display hierarchy and must be computed from the real selection. Validate navigation labels and grouping with learners before treating them as final.

## Component and visual rules

- One visually dominant action per section. Use secondary styling for alternatives and text links for occasional reference actions.
- Reuse the existing accent palette with a stable meaning. Reserve success/warning/error colors for feedback; topic colors should not look like grades.
- Use an 8px spacing rhythm as a design convention, consistent content widths, a small number of heading sizes, and tabular numerals for scores/timers. These are proposals, not current defects proven by measurement.
- Make sources useful: concise source title, primary/secondary designation, relevant section, effective date and review status. Keep detailed evidence behind disclosure so normal learning remains readable.
- Preserve useful existing behavior: search shortcuts, resume position, offline support, backup reminders, keyboard ratings, and tap alternatives to dragging. Verify those through the redesigned flows.
- Add restrained round-completion feedback describing what improved and what is due next. Decorative celebration is optional and lower priority than task flow and accessibility.

## Verification and release gates

Use the current tests for regression coverage; add targeted tests only where navigation semantics or behavior changes. Do not use assertions about CSS class names as proof of usability.

Visually inspect default/active/empty/error/completed states at 390×844, 768×1024, and 1440×900 in both themes; test 320 CSS px reflow and 200% zoom. Check mobile keyboard overlap in SQL/text answers, sticky elements, source disclosures, diagram labels and print output. No such screenshots or measurements have been produced in this session.

Adopt **44×44 CSS px** as the preferred touch design target. WCAG 2.2 AA's target-size criterion uses **24×24 CSS px or qualifying spacing/exceptions**; do not incorrectly call 44px the universal AA requirement. [W3C target-size explanation](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Test reflow using the relevant exceptions for tables and diagrams rather than hiding overflow globally. [W3C reflow explanation](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

Run five representative tasks with a small group of learners: start today's round, find a definition, correct a SQL answer, revisit a mistake, and download a backup. Record task completion, time to first action, navigation mistakes, and understanding of progress labels. The proposed 5-second discoverability target and CTA placement criteria are acceptance goals, not observed results.

Recommended order: **factual P0 corrections → navigation and flashcard start → home/practice flow → reading/progress → accessibility measurements and visual polish**. Keep phases reviewable; avoid a simultaneous rewrite of storage, learning algorithms, routing and visual presentation.
