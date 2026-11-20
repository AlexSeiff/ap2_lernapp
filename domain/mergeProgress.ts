// Sicherung zusammenführen statt ersetzen (Daten & Import → „Zusammenführen“): rein, damit testbar.
// So lässt sich zwischen Handy und PC umziehen, ohne dass eine Seite verloren geht.
// Beide Stände müssen schon migriert sein (migrateProgress bzw. parseBackup).

import {
  PROGRESS_VERSION,
  type Attempt,
  type CardState,
  type ExamRun,
  type JournalEntry,
  type Hervorhebung,
  type Markierung,
  type Progress,
} from './progress';

/** Zeitpunkt als Zahl zum Vergleichen; fehlend oder ungültig = ganz früh. */
const time = (v: string | undefined) => {
  const t = v ? Date.parse(v) : NaN;
  return Number.isNaN(t) ? -Infinity : t;
};

/** Derselbe Versuch in beiden Ständen: gleiche Aufgabe zum gleichen Zeitpunkt. */
const attemptKey = (a: Attempt) => `${a.taskId}\u0000${a.date}`;

/**
 * Vereinigung der Versuche ohne Doppelte, nach Datum sortiert (stabil: bei gleichem Datum bleibt die Reihenfolge).
 * Bei Doppelten gilt der aktuelle Versuch; fehlen ihm Selbsteinschätzung (sicherheit) oder Fehlergrund, kommen sie aus der Sicherung.
 */
function mergeAttempts(a: Attempt[], b: Attempt[]): Attempt[] {
  const fromB = new Map(b.map((x) => [attemptKey(x), x]));
  const current = a.map((x) => {
    const other = fromB.get(attemptKey(x));
    const s = other?.sicherheit;
    const g = other?.fehlergrund;
    return {
      ...x,
      ...(x.sicherheit === undefined && s !== undefined ? { sicherheit: s } : {}),
      ...(x.fehlergrund === undefined && g !== undefined ? { fehlergrund: g } : {}),
    };
  });
  const seen = new Set(a.map(attemptKey));
  const merged = [...current, ...b.filter((x) => !seen.has(attemptKey(x)) && seen.add(attemptKey(x)))];
  return merged
    .map((x, i) => ({ x, i, t: time(x.date) }))
    .sort((p, q) => p.t - q.t || p.i - q.i)
    .map(({ x }) => x);
}

/** Wie weit ist eine Klausur? abgeschlossen > abgegeben > nur begonnen; bei Gleichstand der spätere Zeitpunkt. */
const examRank = (e: ExamRun): [number, number] =>
  e.finishedAt ? [2, time(e.finishedAt)] : e.submittedAt ? [1, time(e.submittedAt)] : [0, time(e.startedAt)];

const newerExam = (a: ExamRun, b: ExamRun) => {
  const [ra, ta] = examRank(a);
  const [rb, tb] = examRank(b);
  return rb > ra || (rb === ra && tb > ta) ? b : a;
};

/** Vereinigung der Klausuren nach id; kommt eine in beiden vor, gewinnt die weiter fortgeschrittene. */
function mergeExams(a: ExamRun[], b: ExamRun[]): ExamRun[] {
  const byId = new Map<string, ExamRun>();
  for (const e of [...a, ...b]) {
    const prev = byId.get(e.id);
    byId.set(e.id, prev ? newerExam(prev, e) : e);
  }
  // Stabil nach Abschluss (sonst Beginn) sortiert – so stehen sie wie in der App in der Reihenfolge, in der sie fertig wurden.
  const when = (e: ExamRun) => time(e.finishedAt ?? e.submittedAt ?? e.startedAt);
  return [...byId.values()]
    .map((e, i) => ({ e, i, t: when(e) }))
    .sort((x, y) => x.t - y.t || x.i - y.i)
    .map(({ e }) => e);
}

/** Pro Schlüssel beide Einträge vergleichen; `pick` wählt den neueren (bei Gleichstand den ersten = aktuellen). */
function mergeRecord<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T, y: T, key: string) => T): Record<string, T> {
  const out: Record<string, T> = { ...a };
  for (const [key, value] of Object.entries(b)) out[key] = key in a ? pick(a[key], value, key) : value;
  return out;
}

/** Karteikarte: CardState hat kein Datum – mehr Wiederholungen heißt neuerer Stand, bei Gleichstand das spätere `due`. */
const newerCard = (x: CardState, y: CardState) => (y.reviews > x.reviews || (y.reviews === x.reviews && y.due > x.due) ? y : x);

/** Markierung: die neuere Aktion gewinnt (markiert oder entmarkiert), bei Gleichstand der aktuelle Stand. */
const newerMarkierung = (x: Markierung, y: Markierung) => (time(y.am) > time(x.am) ? y : x);

/** Textmarken eines Bereichs: die neuere Änderung (`am`) gewinnt als Ganzes, bei Gleichstand der aktuelle Stand. */
const newerHervorhebung = (x: Hervorhebung, y: Hervorhebung) => (time(y.am) > time(x.am) ? y : x);

/** Gemeinsame Felder von SQL- und Rechenübungen (SqlState, RechenState). */
type UebungState = { attempts: number; hintsUsed: number; lastCheckedAt?: string; solvedAt?: string };

/**
 * SQL- oder Rechenübung: der Stand mit dem neueren `lastCheckedAt` (ohne: mehr Prüfungen, dann mehr Hinweise).
 * Gelöst bleibt gelöst: das frühere `solvedAt` beider Seiten bleibt erhalten.
 */
function newerUebung<T extends UebungState>(x: T, y: T): T {
  const tx = time(x.lastCheckedAt);
  const ty = time(y.lastCheckedAt);
  const winner = ty > tx || (ty === tx && (y.attempts > x.attempts || (y.attempts === x.attempts && y.hintsUsed > x.hintsUsed))) ? y : x;
  const solved = [x.solvedAt, y.solvedAt].filter((s): s is string => s !== undefined).sort((p, q) => time(p) - time(q))[0];
  return solved === undefined ? winner : { ...winner, solvedAt: solved };
}

/** Zähler je Tag: pro Tag das Maximum (dieselben Lerntage stehen oft in beiden Ständen – Addieren würde doppelt zählen). */
function mergeDays(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  return mergeRecord(a, b, (x, y) => Math.max(x, y));
}

/**
 * Führt eine Sicherung (`incoming`) in den aktuellen Stand (`current`) ein. Regeln:
 * - attempts: Vereinigung, doppelt = gleiche taskId und gleiches date; nach Datum sortiert. Es werden also nie weniger Versuche.
 *   Fehlen dem aktuellen Versuch Selbsteinschätzung (sicherheit) oder Fehlergrund (fehlergrund), werden die der Sicherung übernommen.
 * - exams/activeExam tragen ihre Selbsteinschätzungen und Fehlergründe (je Aufgabe) mit dem gewählten Lauf.
 * - exams: Vereinigung nach id; in beiden → die weiter fortgeschrittene (abgeschlossen > abgegeben > begonnen, dann später).
 * - activeExam: die laufende Klausur dieses Browsers; nur wenn hier keine läuft, die aus der Sicherung.
 *   Ist sie in der Historie schon abgeschlossen, entfällt sie.
 * - cards: je Karte der Stand mit mehr Wiederholungen (dann späteres due).
 * - sql, rechnen, diagramme, json: je Übung der Stand mit dem neueren lastCheckedAt; solvedAt bleibt, wenn eine Seite gelöst hat.
 * - journal: je Aufgabe der Eintrag der Seite mit dem neueren Versuch zu dieser Aufgabe (dann höhere Stufe, dann späteres due).
 * - lernziele: abgehakt, wenn auf einer Seite abgehakt.
 * - markiert: je Karte die neuere Aktion (`am`), auch ein Entmarkieren – so taucht eine entfernte Markierung nicht wieder auf.
 * - hervorhebungen: je Bereich (Aufgabe, Ausgangssituation) die Textmarken der neueren Änderung (`am`), auch eine leere Liste.
 * - cardReviewDays / sqlDays / rechnenDays / diagrammDays: je Tag das Maximum.
 * - settings und unbekannte Felder: vom aktuellen Stand (Einstellungen gehören zu diesem Browser).
 * Bei gleichen Ständen kommt der aktuelle Stand heraus (mergeProgress(p, p) ≈ p).
 */
export function mergeProgress(current: Progress, incoming: Progress): Progress {
  const attempts = mergeAttempts(current.attempts, incoming.attempts);
  const exams = mergeExams(current.exams, incoming.exams);

  const lastAttempt = (p: Progress) => {
    const latest = new Map<string, number>();
    for (const a of p.attempts) latest.set(a.taskId, Math.max(latest.get(a.taskId) ?? -Infinity, time(a.date)));
    return latest;
  };
  const lastA = lastAttempt(current);
  const lastB = lastAttempt(incoming);
  const newerJournal = (x: JournalEntry, y: JournalEntry, taskId: string) => {
    const ta = lastA.get(taskId) ?? -Infinity;
    const tb = lastB.get(taskId) ?? -Infinity;
    if (ta !== tb) return tb > ta ? y : x;
    return y.stage > x.stage || (y.stage === x.stage && y.due > x.due) ? y : x;
  };

  const finished = new Set(exams.filter((e) => e.finishedAt).map((e) => e.id));
  const running = (e: ExamRun | undefined) => (e && !finished.has(e.id) ? e : undefined);
  let activeExam = running(current.activeExam);
  if (!activeExam) activeExam = running(incoming.activeExam);
  else if (incoming.activeExam?.id === activeExam.id) activeExam = newerExam(activeExam, incoming.activeExam);

  const { activeExam: _dropped, ...base } = { ...incoming, ...current };
  return {
    ...base,
    version: PROGRESS_VERSION,
    attempts,
    exams,
    ...(activeExam ? { activeExam } : {}),
    cards: mergeRecord(current.cards, incoming.cards, newerCard),
    journal: mergeRecord(current.journal, incoming.journal, newerJournal),
    lernziele: mergeRecord(current.lernziele, incoming.lernziele, (x, y) => x || y),
    cardReviewDays: mergeDays(current.cardReviewDays, incoming.cardReviewDays),
    sql: mergeRecord(current.sql, incoming.sql, newerUebung),
    sqlDays: mergeDays(current.sqlDays, incoming.sqlDays),
    rechnen: mergeRecord(current.rechnen, incoming.rechnen, newerUebung),
    rechnenDays: mergeDays(current.rechnenDays, incoming.rechnenDays),
    markiert: mergeRecord(current.markiert, incoming.markiert, newerMarkierung),
    diagramme: mergeRecord(current.diagramme, incoming.diagramme, newerUebung),
    json: mergeRecord(current.json, incoming.json, newerUebung),
    diagrammDays: mergeDays(current.diagrammDays, incoming.diagrammDays),
    hervorhebungen: mergeRecord(current.hervorhebungen, incoming.hervorhebungen, newerHervorhebung),
    settings: current.settings,
  };
}
