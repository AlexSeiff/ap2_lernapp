# AP2 Lern-App – Progress (persisted learning state)

> Part of the technical documentation (section 6). Overview: [DOKUMENTATION.md](../DOKUMENTATION.md).

## 6. Progress (persisted data)

Defined in `domain/progress.ts`, **`PROGRESS_VERSION = 10`**.

```ts
type Progress = {
  version: 10;                             // 10: hervorhebungen + json added; 9: task ids of the rebuilt Übungsklausuren moved (no new field)
                                           // (a `revision` field of versions 2–9 is gone: files that still carry it load, the field is dropped)
  attempts: Attempt[];                     // task attempts (taskId, points, max, date, mode, sicherheit?)
  exams: ExamRun[]; activeExam?: ExamRun;
  cards: Record<string, CardState>;        // Leitner box + due, keyed by flashcard id
  journal: Record<string, JournalEntry>;   // error journal (stage, due, resolvedAt)
  lernziele: Record<string, boolean>;
  cardReviewDays: Record<string, number>;  // YYYY-MM-DD → count, for the streak (v3)
  sql: Record<string, SqlState>;           // attempts, solvedAt, hintsUsed, solutionShown, lastQuery (unchecked draft only), stage, due,
                                           // zuletztRichtig (v4; draft and zuletztRichtig: see below)
  sqlDays: Record<string, number>;         // for the streak (v4)
  rechnen: Record<string, RechenState>;    // Rechenübungen per exercise id (v6)
  rechnenDays: Record<string, number>;     // checked Rechenübungen per day, for the streak (v6)
  settings: Settings;                      // per-user settings, part of the backup (v5)
  markiert: Record<string, Markierung>;    // marked flashcards by card id (v7)
  diagramme: Record<string, DiagrammState>; // Diagramm-Übungen per exercise id (v8): attempts, solvedAt, lastCheckedAt, hintsUsed,
                                           // solutionShown, stage, due, zuletztRichtig (an old belegung is dropped on load)
  diagrammDays: Record<string, number>;    // checked Diagramm-Übungen per day, for the streak (v8)
  hervorhebungen: Record<string, Hervorhebung>; // Textmarker per area id (task id or attachment id) (v10): { marken: { von, bis, text, farbe }[], am }
                                           // – offsets into the rendered text of the area, `text` checks that the text is unchanged; merge: newer `am` wins
  json: Record<string, JsonState>;         // JSON-, XML- and Normalisierungs-Übungen per exercise id (v10; XML-…, NF-… ids since 2026-11): same fields as DiagrammState
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
// The duration is not stored: the deadline of a running exam is startedAt + examMinutes(exam) (from the exam title: WiSo 60, otherwise 90
// minutes; no format change). A WiSo run started before this rule therefore ends after 60 instead of 90 minutes (auto-submit keeps all answers).

type RechenState = {
  attempts: number;              // counted "✓ Prüfen" clicks
  solvedAt?: string;             // first check with all inputs right, without having seen the solution
  lastCheckedAt?: string;
  hintsUsed: number;
  solutionShown?: boolean;
  stage?: number; due?: string;  // repetition like SQL (JOURNAL_INTERVALS 1/3/7 days, src/lib/wiederholung.ts)
  lastSeed?: number;             // seed of "🎲 Neue Zahlen"; missing = the exercise's fixed numbers
  zuletztRichtig?: boolean;      // result of the last check: false also after "Lösung zeigen" (October 2026, optional, no version bump)
};
// SqlState and DiagrammState have the same zuletztRichtig. Checked answers are never stored: a repetition starts empty.
// SQL keeps only an unchecked draft (lastQuery); "Prüfen" and "Lösung zeigen" delete it (`sqlEntwurf` decides what is restored;
// in older states a lastQuery after a check is the checked query and is not restored). Old RechenState.antworten and
// DiagrammState.belegung are removed by migrateProgress.

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
- `berechneSpeicherstand` (`src/lib/progressSchreiben.ts`, pure, used by the IndexedDB and the localStorage store) validates with zod
  (`ProgressSchema`), rejects a strong drop in `attempts` (`isSuspiciousAttemptDrop`) unless the state is replaced on purpose (reset button,
  backup restore), and merges what another tab saved in the meantime (`mergeProgress`) so one tab never overwrites another tab's progress.
- `migrateProgress(raw)` runs versioned `MIGRATIONS` (1→2 revision field (since removed), 2→3 cardReviewDays, 3→4 sql/sqlDays, 4→5 settings, 5→6 rechnen/rechnenDays, 6→7 markiert, 7→8 diagramme/diagrammDays, 8→9 task ids moved, 9→10 hervorhebungen/json) and fills missing fields.
  `migrateSettings` fills defaults, drops an invalid `examDate`/`lastBackupDownloadAt` and keeps unknown fields.
  `lastBackupDownloadAt` was added without a version bump: it is optional, `SettingsSchema` is a loose object with all fields optional
  and `migrateSettings` already kept unknown fields, so every v5 file (old or new) is valid and nothing needs converting.
  `leichtAutomatisch` (phase 6.4) was added the same way (optional boolean, missing = on, a wrong type is dropped): every v6 file stays valid,
  so `PROGRESS_VERSION` stays **6**. Phase 6 needed no other format change (Leicht answers use the existing `CardState`/`RechenState` fields).
  **Phase 8.3** added `Attempt.sicherheit` and `ExamRun.sicherheit` the same way (decision: optional fields, no bump): `AttemptSchema` and
  `ExamRunSchema` are loose objects and `migrateAttempt`/`migrateExam` already kept unknown fields, so every v6 file stays valid and an older
  app (e.g. a not yet updated PWA) keeps the fields too. `migrateAttempt`/`migrateExam` now drop invalid values (anything but 1, 2, 3);
  the schema rejects them. Fixture `tests/fixtures/fortschritt-v6-2026-10-01.json` (v6 before 8.3) is tested to load unchanged.
  **Phase 8.7** added `Attempt.fehlergrund` and `ExamRun.fehlergrund` by the same rule (optional, loose schemas, `migrateAttempt`/`migrateExam` kept
  unknown fields): `FEHLERGRUENDE` in `domain/progress.ts`, invalid values dropped on migration (`isFehlergrund`) and rejected by
  the schema (`z.enum`); `PROGRESS_VERSION` stays **6**. Tested with the v6 fixture (which has no `fehlergrund`). Phases 8.5, 8.6, 8.8 and
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
  **Version 9 (October 2026): task ids moved.** The Übungsklausuren 01–16 were rebuilt in the format of the Altklausuren (subject exams: four
  Aufgaben of 20–30 P; WiSo: 30 tasks in five blocks of 20 P), which gave 84 tasks a new code. `domain/aufgabenUmzug.ts` (`AUFGABEN_UMZUG_V9`,
  old id → new id, never edit afterwards) and `zieheAufgabenUm` rename them in attempts, journal (key and `taskId`) and exam runs (answers,
  scores, sicherheit, fehlergrund) – all at once, so no id moves twice. Three new WiSo tasks reuse freed codes (14-B6, 14-D5, 14-D6); their old
  state moved with the shifted task. Tests: `tests/aufgabenUmzug.test.ts`; old fixtures are compared via `tests/umgezogen.ts`. Renumbering tasks
  again needs a new map and a new version.
  **Every schema change:** bump `PROGRESS_VERSION`, add a migration step, extend `tests/progress.test.ts` (fixtures in `tests/fixtures/`, one per version).
- Settings are changed only through `withSettings` (`src/lib/settings.ts`). "Fortschritt zurücksetzen" keeps the settings. The theme stays in `localStorage` (per device).
- **Where the progress is stored** (November 2026, `src/lib/fortschrittSpeicher.ts`): in **IndexedDB** – database `ap2-lernstand`, store `kv`, one entry
  `fortschritt` holding the same JSON text as a downloaded backup (`src/lib/idbFortschritt.ts`). Reasons: no 5 MB limit like `localStorage`, and reading
  and writing happen in **one transaction**, so two tabs cannot overwrite each other. An unreadable text is copied to the entry `fortschritt-defekt` before
  anything overwrites it. Other tabs learn about a save over a `BroadcastChannel`; the tab adopts the new state without reloading (a running card round or a
  half-written exam answer stays). It is deliberately **one entry, not one record per attempt or card**: the state is small (about 74 KB), and records would
  have needed a new merge logic and file format.
  - **Move from `localStorage`** (older versions stored the progress under the key `ap2-fortschritt`): at the first start with IndexedDB the old text is
    copied 1:1 into an empty IndexedDB, read back and compared (`uebernehmeAusLocalStorage`). Existing IndexedDB progress is never overwritten. The old
    `localStorage` entry stays untouched as a fallback (it is not deleted); the move is noted under `ap2-fortschritt-in-indexeddb`.
  - **Fallback:** if IndexedDB is not available (blocked, some private windows, no answer within 4 s) or a step fails, the app keeps working with the
    `localStorage` store (`src/lib/localFortschritt.ts`, key `ap2-fortschritt`, unreadable value → `ap2-fortschritt-defekt`) for that session. Nothing is lost.
  - Tests: `tests/idbFortschritt.test.ts` (with `fake-indexeddb`, incl. all real progress files from `data/` when the folder exists), `e2e/speicher.spec.ts`.
  - **Closing the tab** (`src/lib/nachtrag.ts`): IndexedDB writes asynchronously, and a browser does not guarantee that a write started in `pagehide` still finishes (Safari and phones are the likeliest to drop it). So the
    writer starts at once (it returns the previous text for the daily backup, no read before it) and `pagehide` also writes the not-yet-saved state **synchronously** to `localStorage` (`ap2-fortschritt-nachtrag`).
    When the save is confirmed the tab deletes that copy; otherwise the next start merges it into the progress (`arbeiteNachtragEin`: the copy is the younger state, its settings win) and deletes it.
  - **IndexedDB failing after the move** (`arbeiteAusfallAenderungenEin`): the move stores a fingerprint of the copied text in `ap2-fortschritt-in-indexeddb` (`{am, hash}`). A session without IndexedDB keeps working on the old
    `localStorage` copy; at the next start with IndexedDB a changed fingerprint means "edits from the outage", which are merged into the IndexedDB state (nothing is lost). Without a marker (older move) only the starting
    point is remembered. While the fallback is active after a move, *Daten & Import* shows a warning and names the real store (`api.speicherInfo()`).
  - **Saving**: `flush()` (on `pagehide` and when another tab saved) marks what it wrote as saved. Before, "pending" stayed set forever: the header showed "Speichert ...", and two tabs with unsaved edits triggered each other
    endlessly through `watchOtherTabs`. Taking over another tab's state (`src/lib/fremdUebernahme.ts`) merges instead of overwrites when the user did something in the meantime.
  - Tests: `tests/progressSaver.test.ts` (flush, endless loop), `tests/nachtrag.test.ts`, `tests/ausfallNachUmzug.test.ts` (day 1 move / day 2 outage with edits / day 3 back), `tests/fremdUebernahme.test.ts`,
    `tests/speichernOhneVorlesen.test.ts`, and in the browser `e2e/zweiTabs.spec.ts` (both tabs with unsaved edits: message count bounded), `e2e/speicher.spec.ts` (copy at start, outage and return with warning).
- **Pages protection (phase 3):**
  - `navigator.storage.persist()` once per page load after the first successful save (`persistentStorage.ts`, via `createStaticApi`);
    *Daten & Import* shows "Speicher dauerhaft: ja/nein/unbekannt". Unsupported or throwing → ignored.
  - **Daily backups in IndexedDB** (`browserBackups.ts`, DB `ap2-lernapp`, store `sicherungen`, key = date): before the first save of a day
    the previously stored JSON (state at the start of the day) is copied, at most one per day, the last 7 kept (`planBackup`, pure).
    Runs fire-and-forget and serialized after the progress write, so a missing/blocked IndexedDB never delays or breaks saving.
    `staticApi.backups()` returns `{ newest, count, items }`, `readBackup(date)` the JSON; restore = `parseBackup` + `replaceProgress`.
  - **Backup reminder** (`backupReminder.ts`, pure): Dashboard banner "Letzte Sicherung vor N Tagen – ⬇ jetzt herunterladen" when
    `lastBackupDownloadAt` is at least `backupReminderDays` old and there is a learning day (`activityDays`) after it; without any download
    it counts from the first learning day. "Später" hides it until reload. The number of days is adjustable on `/einstellungen` (Pages only).
  - Downloads go through `useBackupDownload` (all modes): file `ap2-lernapp-sicherung-YYYY-MM-DD.json` (`backupFileName`), then
    `settings.lastBackupDownloadAt = today`.
- **Merge on import** (`domain/mergeProgress.ts`, `mergeProgress(current, incoming)`, pure, `tests/mergeProgress.test.ts`), both sides migrated:
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
  - `settings`, unknown fields (e.g. an old `revision`): from the current state.
  - UI: merge uses `update()` (normal save), replace uses `replaceProgress()` (deliberate replace, no protection against a drop in attempts).
    The welcome screen only replaces (nothing stored yet).
- Saving is debounced (`SAVE_DELAY_MS`), flushed on `pagehide`; state updates are pure, persisting happens outside the updater.
- **Multiple tabs:** before every write the store reads the saved state inside the same transaction; if it differs from what this tab last knew, it merges
  (`mergeProgress`), otherwise it writes the own state directly (a merge would bring back deleted answers). After a save the other tabs get a message and
  adopt the new state (`src/lib/store.tsx`, `api.watchOtherTabs`). Tests: `tests/idbFortschritt.test.ts` (simultaneous saves) and `e2e/zweiTabs.spec.ts`.
