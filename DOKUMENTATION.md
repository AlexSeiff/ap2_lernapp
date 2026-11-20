# AP2 Lern-App – Technical Documentation

> Merges the earlier working documents `IMPROVEMENTS_PROMPT.md` (refactoring/safety plan, P0–P3) and `SQL_EDITOR_PLAN.md`
> (SQL editor, phases 1–4) and the original build prompt (`../Prompt_Lern_App.md`). Everything in them has been implemented;
> these files describe **the app as it is** (state: all ROADMAP phases 0–8 done incl. 4.4/4.5, without 7.5 (decision Q3), October 2026).
> `ROADMAP.md` was deleted after completion; comments like "ROADMAP 8.3" refer to it (`git show d21984e:ROADMAP.md`).
> Content license (Q4, decided 2026-10-10): CC BY-NC-SA 4.0 for `content/` only, see `LIZENZ-INHALTE.txt`; the code (everything outside `content/`) is MIT, see `LICENSE`. How to install and start the app is in `README.md` (German).

---

---

## Contents

The documentation is split by topic. **Section numbers are kept** (`§ 3.1`, `§ 4.4`, `§ 6` …): code comments and content files refer to them, so
look the number up in this table.

| § | Topic | File |
|---|---|---|
| 1–2 | Purpose, conventions, run modes (dev, build, Pages, CI) | [docs/01-ueberblick.md](docs/01-ueberblick.md) |
| 3, 3.1, 3.2 | Architecture and folder layout, loading and performance, **styles** | [docs/02-architektur.md](docs/02-architektur.md) |
| 4 (4.1–4.5) | Content formats: learning sheets, flashcards, SQL / Rechen- / Diagramm- / JSON-Übungen, Quellen, updating content | [docs/03-inhalte.md](docs/03-inhalte.md) |
| 5 (part 1) | Features: routes, Markdown and formulas, Rechenübungen, Leicht-Modus, Heute lernen, Anhang, Lernplan, Podcast, Editor-Aufgaben, Operatoren, Probeklausur, Fehlergründe | [docs/04-funktionen-lernen.md](docs/04-funktionen-lernen.md) |
| 5 (part 2) | Features: search, Glossar, Begriffsseiten, Quellen, Übersicht, navigation (notebook), mobile, PWA | [docs/05-funktionen-nachschlagen.md](docs/05-funktionen-nachschlagen.md) |
| 6 | Progress: format, versions, **storage (IndexedDB)**, backups, merge, multiple tabs | [docs/06-lernstand.md](docs/06-lernstand.md) |
| 7–8 | SQL editor; the removed AI features | [docs/07-sql-editor.md](docs/07-sql-editor.md) |
| 9–10 | Quality gates (unit, **browser**, pixel and equality tests), rules for future changes | [docs/08-qualitaet-und-regeln.md](docs/08-qualitaet-und-regeln.md) |

Other documents: [README.md](README.md) (for learners and quick start), [CONTRIBUTING.md](CONTRIBUTING.md) (adding tasks and cards),
[docs/UMBAUPLAN.md](docs/UMBAUPLAN.md) and [docs/UMBAU_STATUS.md](docs/UMBAU_STATUS.md) (the November 2026 restructuring: plan and what was done),
[docs/CODEX_UEBERGABE.md](docs/CODEX_UEBERGABE.md) (open points), [docs/ALTKLAUSUR_QUELLEN_DD27-33.md](docs/ALTKLAUSUR_QUELLEN_DD27-33.md) (origin of the old-exam tasks).

**Where do I find …**
- *how a content file must look* → § 4 · *which page does what* → § 5 · *what is stored and how* → § 6 · *which checks must pass* → § 9 · *what I must not break* → § 10
- *how the CSS is organised and how to check a style change* → § 3.2 · *how to add a Rechenvorlage or a new kind of JSON content* → § 10 rules 10 and § 4.4
