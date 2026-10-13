// Gespeicherter Lernfortschritt (data/fortschritt.json): Typen, zod-Schema und Prüfung von PUT /api/progress.
// Liegt in shared/, weil Client (lib/progress.ts, store.tsx) und Server (apiPlugin.ts) dasselbe Format nutzen.
// Die Typen beschreiben, was die App schreibt. Das Schema ist bewusst toleranter (unbekannte Felder bleiben erhalten,
// `mode` als beliebiger String, `null` statt NaN), damit ältere oder neuere Dateien nicht abgewiesen werden.
// Ein Typtest in tests/progress.test.ts stellt sicher, dass jeder `Progress` das Schema erfüllt.

import { z } from 'zod';

export type Mode = 'klausur' | 'einzel' | 'wiederholung';
export type Rating = 'gewusst' | 'unsicher' | 'nicht';

/** „Wie sicher bist du?“ vor dem Abgeben (ROADMAP 8.3): 1 = unsicher, 2 = teils, 3 = sicher. */
export type Sicherheit = 1 | 2 | 3;

export const isSicherheit = (v: unknown): v is Sicherheit => v === 1 || v === 2 || v === 3;

/**
 * Warum eine Aufgabe nicht volle Punkte bekam (Fehlerjournal, ROADMAP 8.7): Begriff verwechselt, Formel falsch, Rechenfehler,
 * Operator nicht beachtet, Zeit. Anzeige-Texte in src/lib/fehlergruende.ts.
 */
export const FEHLERGRUENDE = ['begriff', 'formel', 'rechenfehler', 'operator', 'zeit'] as const;
export type Fehlergrund = (typeof FEHLERGRUENDE)[number];

export const isFehlergrund = (v: unknown): v is Fehlergrund => (FEHLERGRUENDE as readonly unknown[]).includes(v);

export type Attempt = {
  taskId: string;
  date: string;
  points: number;
  max: number;
  mode: Mode;
  /**
   * Selbsteinschätzung vor dem Abgeben (ROADMAP 8.3); fehlt, wenn nicht angegeben oder bei älteren Versuchen.
   * Optional und in Version 6 schon zulässig (AttemptSchema ist offen, migrateAttempt behielt unbekannte Felder) – daher keine neue Version.
   */
  sicherheit?: Sicherheit;
  /**
   * Warum unter voller Punktzahl (ROADMAP 8.7); optional, nach der Selbstbewertung gewählt. Wie `sicherheit` ohne neue Version:
   * AttemptSchema ist offen und migrateAttempt behielt unbekannte Felder.
   */
  fehlergrund?: Fehlergrund;
};

export type ExamRun = {
  id: string;
  topicId: string;
  startedAt: string;
  submittedAt?: string;
  finishedAt?: string;
  answers: Record<string, string>;
  scores: Record<string, number>;
  total?: number;
  max: number;
  /** Selbsteinschätzung je Aufgabe (Task-ID → 1–3), vor der Abgabe gewählt; geht beim Abschließen in die Versuche (ROADMAP 8.3). */
  sicherheit?: Record<string, Sicherheit>;
  /** Fehlergrund je Aufgabe (Task-ID → Grund), nach der Abgabe beim Bewerten gewählt; geht beim Abschließen in die Versuche (ROADMAP 8.7). */
  fehlergrund?: Record<string, Fehlergrund>;
};

export type CardState = {
  box: number;
  due: string;
  reviews: number;
  last?: Rating;
};

/**
 * Markierung einer Karteikarte (seit Version 7, Umsetzungsplan Phase 4). Eigene Sammlung statt Feld im CardState: Ein CardState
 * heißt „schon gelernt“ – eine nur markierte Karte soll neu bleiben, und Markieren ändert nichts an der Wiederholungsplanung.
 * Beim Entfernen bleibt der Eintrag mit `an: false` stehen, damit das Zusammenführen zweier Stände die neuere Aktion erkennt.
 */
export type Markierung = {
  an: boolean;
  /** Zeitpunkt der letzten Änderung (ISO, mit Uhrzeit). */
  am: string;
};

export type JournalEntry = {
  taskId: string;
  addedAt: string;
  /** 0 = Wiederholung nach 1 Tag, 1 = nach 3 Tagen, 2 = nach 7 Tagen. */
  stage: number;
  due: string;
  lastPoints: number;
  max: number;
  resolvedAt?: string;
};

/** Stand einer SQL-Übung (seit Version 4). */
export type SqlState = {
  /** Gezählte „Prüfen“-Klicks. */
  attempts: number;
  /** Erste richtige Prüfung, ohne vorher die Lösung angesehen zu haben. */
  solvedAt?: string;
  lastCheckedAt?: string;
  hintsUsed: number;
  solutionShown?: boolean;
  /** Wird beim erneuten Öffnen der Übung wiederhergestellt (max. 4.000 Zeichen). */
  lastQuery?: string;
  /** Wiederholungsstufe wie im Fehlerjournal: 1 → nach 1 Tag, 2 → nach 3 Tagen, 3 → nach 7 Tagen. */
  stage?: number;
  due?: string;
};

/** Stand einer Rechenübung (seit Version 6). Wiederholung wie bei den SQL-Übungen. */
export type RechenState = {
  /** Gezählte „Prüfen“-Klicks. */
  attempts: number;
  /** Erste richtige Prüfung (alle Eingaben richtig), ohne vorher die Lösung angesehen zu haben. */
  solvedAt?: string;
  lastCheckedAt?: string;
  hintsUsed: number;
  solutionShown?: boolean;
  /** Wiederholungsstufe: 1 → nach 1 Tag, 2 → nach 3 Tagen, 3 → nach 7 Tagen (JOURNAL_INTERVALS). */
  stage?: number;
  due?: string;
  /** Seed der zuletzt gezeigten Zufallszahlen („🎲 Neue Zahlen“); fehlt = die festen Zahlen der Übung. */
  lastSeed?: number;
  /** Zuletzt geprüfte Eingaben (Eingabe-ID → Text) zu diesen Zahlen, zum Wiederherstellen beim erneuten Öffnen. */
  antworten?: Record<string, string>;
};

/** Stand einer Diagramm-Übung (seit Version 8, Umsetzungsplan Phase 7). Wiederholung wie bei den Rechenübungen. */
export type DiagrammState = {
  /** Gezählte „Prüfen“-Klicks. */
  attempts: number;
  /** Erste fehlerfreie Prüfung, ohne vorher die Lösung angesehen zu haben. */
  solvedAt?: string;
  lastCheckedAt?: string;
  hintsUsed: number;
  solutionShown?: boolean;
  stage?: number;
  due?: string;
  /** Zuletzt geprüfte Belegung (Slot-ID → Paletten-ID), zum Wiederherstellen beim erneuten Öffnen. */
  belegung?: Record<string, string>;
};

/**
 * Persönliche Einstellungen (seit Version 5). Sie stehen im Fortschritt, damit sie mit der Sicherung umziehen.
 * Das Farbschema bleibt im localStorage (gilt nur für das Gerät).
 */
export type Settings = {
  /** Eigener Prüfungstermin (YYYY-MM-DD) für den Countdown; fehlt, solange keiner eingetragen ist. */
  examDate?: string;
  /** Prüferfragen aus den Lernblättern in Karteikarten und Theorie zeigen. */
  prueferfragen: boolean;
  /** Fachgespräch-Fragen aus den Lernblättern als Karteikarten zeigen. */
  fachgespraech: boolean;
  /** Zuletzt gewählter Modus „Leicht“ (4 Antworten) – Karteikarten und Rechenübungen („Ergebnis auswählen“). */
  leichtModus: boolean;
  /** Nach wie vielen Tagen ohne heruntergeladene Sicherung erinnert wird. */
  backupReminderDays: number;
  /**
   * Tag (YYYY-MM-DD) der letzten heruntergeladenen Sicherung, für die Erinnerung auf der Übersicht; fehlt, solange keine geladen wurde.
   * Optional und in Version 5 schon zulässig (SettingsSchema ist offen, migrateSettings behält es) – daher keine neue Version.
   */
  lastBackupDownloadAt?: string;
  /**
   * Leicht-Modus: Karten ohne eigenen mc-Block bekommen automatisch Antworten anderer Karten (ROADMAP 6.4). Fehlt = an.
   * Optional wie lastBackupDownloadAt – jede Datei der Version 6 bleibt gültig, daher keine neue Version.
   */
  leichtAutomatisch?: boolean;
  /**
   * Ausgeblendete Lernblätter (Topic-Ids): fehlen in der Themenliste, bei „Weiterlesen“, „Schwächste Themen“ und in „Heute lernen“.
   * Optional wie leichtAutomatisch – jede Datei der Version 8 bleibt gültig, daher keine neue Version.
   */
  ausgeblendeteThemen?: string[];
};

export const defaultSettings = (): Settings => ({ prueferfragen: true, fachgespraech: true, leichtModus: false, backupReminderDays: 7 });

export type Progress = {
  version: typeof PROGRESS_VERSION;
  /**
   * Zähler, den der Server bei jedem Speichern erhöht. Ein PUT mit einem anderen Stand als dem gespeicherten
   * kommt aus einem veralteten Tab und wird mit 409 abgelehnt (seit Version 2, ältere Dateien: 0).
   */
  revision: number;
  attempts: Attempt[];
  exams: ExamRun[];
  activeExam?: ExamRun;
  cards: Record<string, CardState>;
  journal: Record<string, JournalEntry>;
  lernziele: Record<string, boolean>;
  /**
   * Anzahl bewerteter Karteikarten je lokalem Datum (YYYY-MM-DD), für die Lernserie auf der Übersicht.
   * CardState merkt sich nur den letzten Stand einer Karte, daraus lässt sich nicht ablesen, an welchen Tagen gelernt wurde
   * (seit Version 3, ältere Dateien: leer).
   */
  cardReviewDays: Record<string, number>;
  /** Stand der SQL-Übungen je Übungs-ID (seit Version 4, ältere Dateien: leer). */
  sql: Record<string, SqlState>;
  /** Anzahl geprüfter SQL-Übungen je lokalem Datum (YYYY-MM-DD), für die Lernserie (seit Version 4, ältere Dateien: leer). */
  sqlDays: Record<string, number>;
  /** Persönliche Einstellungen (seit Version 5, ältere Dateien: Standardwerte). */
  settings: Settings;
  /** Stand der Rechenübungen je Übungs-ID (seit Version 6, ältere Dateien: leer). */
  rechnen: Record<string, RechenState>;
  /** Anzahl geprüfter Rechenübungen je lokalem Datum (YYYY-MM-DD), für die Lernserie (seit Version 6, ältere Dateien: leer). */
  rechnenDays: Record<string, number>;
  /** Markierte (und wieder entmarkierte) Karteikarten je Karten-ID (seit Version 7, ältere Dateien: leer). */
  markiert: Record<string, Markierung>;
  /** Stand der Diagramm-Übungen je Übungs-ID (seit Version 8, ältere Dateien: leer). */
  diagramme: Record<string, DiagrammState>;
  /** Anzahl geprüfter Diagramm-Übungen je lokalem Datum, für die Lernserie (seit Version 8, ältere Dateien: leer). */
  diagrammDays: Record<string, number>;
};

/** Aktuelle Formatversion von data/fortschritt.json. Bei jeder Formatänderung erhöhen und in MIGRATIONS nachziehen. */
export const PROGRESS_VERSION = 8;

export const emptyProgress = (): Progress => ({
  version: PROGRESS_VERSION,
  revision: 0,
  attempts: [],
  exams: [],
  cards: {},
  journal: {},
  lernziele: {},
  cardReviewDays: {},
  sql: {},
  sqlDays: {},
  settings: defaultSettings(),
  rechnen: {},
  rechnenDays: {},
  markiert: {},
  diagramme: {},
  diagrammDays: {},
});

type Raw = Record<string, unknown>;

const isObject = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);
const num = (v: unknown, fallback = 0) => (typeof v === 'number' ? v : fallback);
/** Optionales Feld nur übernehmen, wenn es den richtigen Typ hat – sonst weglassen statt das Speichern zu blockieren. */
const opt = (key: string, value: unknown, ok: boolean) => (ok ? { [key]: value } : {});

/** Wendet `map` auf jeden Eintrag eines Objekts an und verwirft Einträge, für die es undefined liefert. */
function filterRecord<T>(v: unknown, map: (value: unknown, key: string) => T | undefined): Record<string, T> {
  if (!isObject(v)) return {};
  const out: Record<string, T> = {};
  for (const [key, value] of Object.entries(v)) {
    const mapped = map(value, key);
    if (mapped !== undefined) out[key] = mapped;
  }
  return out;
}

function migrateAttempt(v: unknown): Attempt | undefined {
  if (!isObject(v) || typeof v.taskId !== 'string') return undefined;
  const { sicherheit, fehlergrund, ...rest } = v;
  return {
    ...rest,
    ...opt('sicherheit', sicherheit, isSicherheit(sicherheit)),
    ...opt('fehlergrund', fehlergrund, isFehlergrund(fehlergrund)),
    taskId: v.taskId,
    date: str(v.date),
    points: num(v.points),
    max: num(v.max),
    mode: str(v.mode, 'einzel') as Mode,
  };
}

function migrateExam(v: unknown, index: number | string): ExamRun | undefined {
  if (!isObject(v)) return undefined;
  const { submittedAt, finishedAt, total, sicherheit, fehlergrund, ...rest } = v;
  return {
    ...rest,
    ...opt(
      'sicherheit',
      filterRecord(sicherheit, (s) => (isSicherheit(s) ? s : undefined)),
      isObject(sicherheit),
    ),
    ...opt(
      'fehlergrund',
      filterRecord(fehlergrund, (g) => (isFehlergrund(g) ? g : undefined)),
      isObject(fehlergrund),
    ),
    ...opt('submittedAt', submittedAt, typeof submittedAt === 'string'),
    ...opt('finishedAt', finishedAt, typeof finishedAt === 'string'),
    ...opt('total', total, typeof total === 'number' || total === null),
    id: str(v.id, `ex-migriert-${index}`),
    topicId: str(v.topicId),
    startedAt: str(v.startedAt),
    answers: filterRecord(v.answers, (a) => (typeof a === 'string' ? a : undefined)),
    // null (aus NaN) bleibt erhalten, damit sich an bewerteten Aufgaben nichts ändert.
    scores: filterRecord(v.scores, (s) => (typeof s === 'number' || s === null ? (s as number) : undefined)),
    max: num(v.max),
  };
}

function migrateCard(v: unknown): CardState | undefined {
  if (!isObject(v)) return undefined;
  const { last, ...rest } = v;
  return { ...rest, ...opt('last', last, typeof last === 'string'), box: num(v.box, 1), due: str(v.due), reviews: num(v.reviews) };
}

function migrateJournalEntry(v: unknown, taskId: string): JournalEntry | undefined {
  if (!isObject(v)) return undefined;
  const { resolvedAt, ...rest } = v;
  return {
    ...rest,
    ...opt('resolvedAt', resolvedAt, typeof resolvedAt === 'string'),
    taskId: str(v.taskId, taskId),
    addedAt: str(v.addedAt),
    stage: num(v.stage),
    due: str(v.due),
    lastPoints: num(v.lastPoints),
    max: num(v.max),
  };
}

function migrateSqlState(v: unknown): SqlState | undefined {
  if (!isObject(v)) return undefined;
  const { solvedAt, lastCheckedAt, solutionShown, lastQuery, stage, due, ...rest } = v;
  return {
    ...rest,
    ...opt('solvedAt', solvedAt, typeof solvedAt === 'string'),
    ...opt('lastCheckedAt', lastCheckedAt, typeof lastCheckedAt === 'string'),
    ...opt('solutionShown', solutionShown, typeof solutionShown === 'boolean'),
    ...opt('lastQuery', lastQuery, typeof lastQuery === 'string'),
    ...opt('stage', stage, typeof stage === 'number'),
    ...opt('due', due, typeof due === 'string'),
    attempts: num(v.attempts),
    hintsUsed: num(v.hintsUsed),
  };
}

/** Zeichen je gespeicherter Antwort einer Rechenübung (mehr braucht keine Zahl). */
const ANTWORT_MAX = 200;

function migrateRechenState(v: unknown): RechenState | undefined {
  if (!isObject(v)) return undefined;
  const { solvedAt, lastCheckedAt, solutionShown, stage, due, lastSeed, antworten, ...rest } = v;
  const texte = filterRecord(antworten, (a) => (typeof a === 'string' ? a.slice(0, ANTWORT_MAX) : undefined));
  return {
    ...rest,
    ...opt('solvedAt', solvedAt, typeof solvedAt === 'string'),
    ...opt('lastCheckedAt', lastCheckedAt, typeof lastCheckedAt === 'string'),
    ...opt('solutionShown', solutionShown, typeof solutionShown === 'boolean'),
    ...opt('stage', stage, typeof stage === 'number'),
    ...opt('due', due, typeof due === 'string'),
    ...opt('lastSeed', lastSeed, typeof lastSeed === 'number' && Number.isInteger(lastSeed)),
    ...opt('antworten', texte, isObject(antworten)),
    attempts: num(v.attempts),
    hintsUsed: num(v.hintsUsed),
  };
}

/** Zeichen je gespeicherter ID in einer Belegung (Slot- und Paletten-IDs sind kurz). */
const BELEGUNG_MAX = 80;

function migrateDiagrammState(v: unknown): DiagrammState | undefined {
  if (!isObject(v)) return undefined;
  const { solvedAt, lastCheckedAt, solutionShown, stage, due, belegung, ...rest } = v;
  const b = filterRecord(belegung, (x, k) => (typeof x === 'string' && k.length <= BELEGUNG_MAX ? x.slice(0, BELEGUNG_MAX) : undefined));
  return {
    ...rest,
    ...opt('solvedAt', solvedAt, typeof solvedAt === 'string'),
    ...opt('lastCheckedAt', lastCheckedAt, typeof lastCheckedAt === 'string'),
    ...opt('solutionShown', solutionShown, typeof solutionShown === 'boolean'),
    ...opt('stage', stage, typeof stage === 'number'),
    ...opt('due', due, typeof due === 'string'),
    ...opt('belegung', b, isObject(belegung)),
    attempts: num(v.attempts),
    hintsUsed: num(v.hintsUsed),
  };
}

function migrateMarkierung(v: unknown): Markierung | undefined {
  if (!isObject(v) || typeof v.an !== 'boolean' || typeof v.am !== 'string') return undefined;
  return { ...v, an: v.an, am: v.am };
}

/** Ist `v` ein gültiges Kalenderdatum im Format YYYY-MM-DD? */
export function isIsoDate(v: unknown): v is string {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/** Einstellungen tolerant übernehmen: falsche Typen → Standardwert, unbekannte Felder bleiben erhalten. */
export function migrateSettings(v: unknown): Settings {
  const d = defaultSettings();
  if (!isObject(v)) return d;
  const { examDate, lastBackupDownloadAt, leichtAutomatisch, ausgeblendeteThemen, ...rest } = v;
  const ausgeblendet = Array.isArray(ausgeblendeteThemen)
    ? [...new Set(ausgeblendeteThemen.filter((id): id is string => typeof id === 'string' && !!id))]
    : [];
  const bool = (x: unknown, fallback: boolean) => (typeof x === 'boolean' ? x : fallback);
  const days = v.backupReminderDays;
  return {
    ...rest,
    ...opt('examDate', examDate, isIsoDate(examDate)),
    ...opt('lastBackupDownloadAt', lastBackupDownloadAt, isIsoDate(lastBackupDownloadAt)),
    ...opt('leichtAutomatisch', leichtAutomatisch, typeof leichtAutomatisch === 'boolean'),
    ...opt('ausgeblendeteThemen', ausgeblendet, ausgeblendet.length > 0),
    prueferfragen: bool(v.prueferfragen, d.prueferfragen),
    fachgespraech: bool(v.fachgespraech, d.fachgespraech),
    leichtModus: bool(v.leichtModus, d.leichtModus),
    backupReminderDays: typeof days === 'number' && Number.isInteger(days) && days >= 1 ? days : d.backupReminderDays,
  };
}

/** Zähler je Tag: nur nicht-negative Zahlen übernehmen. */
const dayCount = (v: unknown) => (typeof v === 'number' && v >= 0 ? v : undefined);

/**
 * Schritte von Version n auf n+1, angewendet auf die rohen Daten vor dem Auffüllen.
 * Version 1 ist das erste Format (Dateien ohne `version` gelten als Version 1).
 */
const MIGRATIONS: Record<number, (raw: Raw) => Raw> = {
  // 1 → 2: Revisionszähler gegen Überschreiben aus einem zweiten Tab.
  1: (raw) => ({ ...raw, version: 2, revision: num(raw.revision) }),
  // 2 → 3: Karteikarten-Lerntage (cardReviewDays) für die Lernserie; startet leer, aufgefüllt wird unten in migrateProgress.
  2: (raw) => ({ ...raw, version: 3 }),
  // 3 → 4: SQL-Übungen (sql) und ihre Lerntage (sqlDays); starten leer, aufgefüllt wird unten in migrateProgress.
  3: (raw) => ({ ...raw, version: 4 }),
  // 4 → 5: Einstellungen (settings) mit Standardwerten; aufgefüllt wird unten in migrateProgress.
  4: (raw) => ({ ...raw, version: 5 }),
  // 5 → 6: Rechenübungen (rechnen) und ihre Lerntage (rechnenDays); starten leer, aufgefüllt wird unten in migrateProgress.
  5: (raw) => ({ ...raw, version: 6 }),
  // 6 → 7: markierte Karteikarten (markiert); starten leer, aufgefüllt wird unten in migrateProgress.
  6: (raw) => ({ ...raw, version: 7 }),
  // 7 → 8: Diagramm-Übungen (diagramme) und ihre Lerntage (diagrammDays); starten leer, aufgefüllt wird unten in migrateProgress.
  7: (raw) => ({ ...raw, version: 8 }),
};

/**
 * Bringt gespeicherten Fortschritt beliebigen Alters auf das aktuelle Format.
 * Fehlende Sammlungen und Felder werden mit neutralen Werten ergänzt, unbekannte Felder bleiben erhalten.
 * Verworfen wird nur, was sich keinem Eintrag zuordnen lässt (z. B. ein Versuch ohne taskId).
 */
export function migrateProgress(raw: unknown): Progress {
  if (!isObject(raw)) return emptyProgress();
  let data: Raw = raw;
  for (let v = num(data.version, 1); v < PROGRESS_VERSION; v++) data = MIGRATIONS[v]?.(data) ?? data;

  const { activeExam, ...rest } = data;
  const exam = migrateExam(activeExam, 'aktiv');
  return {
    ...rest,
    version: PROGRESS_VERSION,
    revision: revisionOf(data),
    attempts: Array.isArray(data.attempts) ? data.attempts.map(migrateAttempt).filter((a) => a !== undefined) : [],
    exams: Array.isArray(data.exams) ? data.exams.map(migrateExam).filter((e) => e !== undefined) : [],
    ...(exam ? { activeExam: exam } : {}),
    cards: filterRecord(data.cards, migrateCard),
    journal: filterRecord(data.journal, migrateJournalEntry),
    lernziele: filterRecord(data.lernziele, (v) => (typeof v === 'boolean' ? v : undefined)),
    cardReviewDays: filterRecord(data.cardReviewDays, dayCount),
    sql: filterRecord(data.sql, migrateSqlState),
    sqlDays: filterRecord(data.sqlDays, dayCount),
    settings: migrateSettings(data.settings),
    rechnen: filterRecord(data.rechnen, migrateRechenState),
    rechnenDays: filterRecord(data.rechnenDays, dayCount),
    markiert: filterRecord(data.markiert, migrateMarkierung),
    diagramme: filterRecord(data.diagramme, migrateDiagrammState),
    diagrammDays: filterRecord(data.diagrammDays, dayCount),
  };
}

export const AttemptSchema = z.looseObject({
  taskId: z.string(),
  date: z.string(),
  points: z.number(),
  max: z.number(),
  mode: z.string(),
  sicherheit: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  fehlergrund: z.enum(FEHLERGRUENDE).optional(),
});

export const ExamRunSchema = z.looseObject({
  id: z.string(),
  topicId: z.string(),
  startedAt: z.string(),
  submittedAt: z.string().optional(),
  finishedAt: z.string().optional(),
  answers: z.record(z.string(), z.string()),
  // NaN aus einem Eingabefeld wird in JSON zu null – das darf das Speichern nicht blockieren.
  scores: z.record(z.string(), z.number().nullable()),
  total: z.number().nullable().optional(),
  max: z.number(),
  sicherheit: z.record(z.string(), z.union([z.literal(1), z.literal(2), z.literal(3)])).optional(),
  fehlergrund: z.record(z.string(), z.enum(FEHLERGRUENDE)).optional(),
});

export const CardStateSchema = z.looseObject({
  box: z.number(),
  due: z.string(),
  reviews: z.number(),
  last: z.string().optional(),
});

export const MarkierungSchema = z.looseObject({
  an: z.boolean(),
  am: z.string(),
});

export const JournalEntrySchema = z.looseObject({
  taskId: z.string(),
  addedAt: z.string(),
  stage: z.number(),
  due: z.string(),
  lastPoints: z.number(),
  max: z.number(),
  resolvedAt: z.string().optional(),
});

export const SqlStateSchema = z.looseObject({
  attempts: z.number(),
  solvedAt: z.string().optional(),
  lastCheckedAt: z.string().optional(),
  hintsUsed: z.number(),
  solutionShown: z.boolean().optional(),
  lastQuery: z.string().optional(),
  stage: z.number().optional(),
  due: z.string().optional(),
});

export const RechenStateSchema = z.looseObject({
  attempts: z.number(),
  solvedAt: z.string().optional(),
  lastCheckedAt: z.string().optional(),
  hintsUsed: z.number(),
  solutionShown: z.boolean().optional(),
  stage: z.number().optional(),
  due: z.string().optional(),
  lastSeed: z.number().int().optional(),
  antworten: z.record(z.string(), z.string()).optional(),
});

export const DiagrammStateSchema = z.looseObject({
  attempts: z.number(),
  solvedAt: z.string().optional(),
  lastCheckedAt: z.string().optional(),
  hintsUsed: z.number(),
  solutionShown: z.boolean().optional(),
  stage: z.number().optional(),
  due: z.string().optional(),
  belegung: z.record(z.string(), z.string()).optional(),
});

export const SettingsSchema = z.looseObject({
  examDate: z.string().optional(),
  prueferfragen: z.boolean().optional(),
  fachgespraech: z.boolean().optional(),
  leichtModus: z.boolean().optional(),
  backupReminderDays: z.number().optional(),
  lastBackupDownloadAt: z.string().optional(),
  leichtAutomatisch: z.boolean().optional(),
  ausgeblendeteThemen: z.array(z.string()).optional(),
});

export const ProgressSchema = z.looseObject({
  version: z.number().int().min(1),
  // Optional, damit Dateien von vor Version 2 gültig bleiben (fehlend = 0).
  revision: z.number().int().min(0).optional(),
  attempts: z.array(AttemptSchema),
  exams: z.array(ExamRunSchema).default([]),
  activeExam: ExamRunSchema.optional(),
  cards: z.record(z.string(), CardStateSchema).default({}),
  journal: z.record(z.string(), JournalEntrySchema).default({}),
  lernziele: z.record(z.string(), z.boolean()).default({}),
  cardReviewDays: z.record(z.string(), z.number()).default({}),
  sql: z.record(z.string(), SqlStateSchema).default({}),
  sqlDays: z.record(z.string(), z.number()).default({}),
  settings: SettingsSchema.optional(),
  rechnen: z.record(z.string(), RechenStateSchema).default({}),
  rechnenDays: z.record(z.string(), z.number()).default({}),
  markiert: z.record(z.string(), MarkierungSchema).default({}),
  diagramme: z.record(z.string(), DiagrammStateSchema).default({}),
  diagrammDays: z.record(z.string(), z.number()).default({}),
});

export type ProgressData = z.infer<typeof ProgressSchema>;

/** Body von PUT /api/progress: der Fortschritt plus optional `reset: true` für bewusstes Zurücksetzen/Einspielen. */
export const ProgressPutSchema = ProgressSchema.extend({ reset: z.boolean().optional() });

/**
 * Ab wann ein neuer Stand „viel weniger“ Versuche hat als der gespeicherte.
 * Versuche werden in der App nur angehängt, nie gelöscht. Ein Rückgang um mehr als 5 Versuche
 * oder auf weniger als die Hälfte ist daher fast sicher ein Versehen (leerer Stand, alter Tab, falsche Datei).
 */
export function isSuspiciousAttemptDrop(storedCount: number, newCount: number): boolean {
  return newCount < storedCount && (storedCount - newCount > 5 || newCount < storedCount / 2);
}

/** Revision eines gespeicherten oder gesendeten Stands; fehlend (ältere Datei, alter Tab) = 0. */
export function revisionOf(data: unknown): number {
  const revision = (data as { revision?: unknown } | null | undefined)?.revision;
  return typeof revision === 'number' && Number.isInteger(revision) && revision >= 0 ? revision : 0;
}

/**
 * Ist der Stand, auf dem ein Tab aufbaut, veraltet? Bewusst streng (ungleich statt kleiner): Auch eine höhere
 * Revision als gespeichert heißt, dass die Datei inzwischen anders ist (z. B. von Hand zurückgespielt) – dann erst neu laden.
 */
export function isStaleRevision(baseRevision: number, storedRevision: number): boolean {
  return baseRevision !== storedRevision;
}

export const CONFLICT_MESSAGE = 'Die App ist in einem anderen Tab geöffnet – bitte neu laden';

function formatIssue(issue: z.core.$ZodIssue): string {
  return issue.path.length ? issue.path.join('.') : '(gesamt)';
}

export type ProgressPutResult =
  { ok: true; progress: ProgressData & { revision: number } } | { ok: false; status: 400 | 409; error: string };

/**
 * Prüft einen PUT-Body gegen das Schema und gegen den gespeicherten Stand.
 * Rein (ohne Dateizugriff), damit Server und Tests dieselbe Logik nutzen.
 * Bei Erfolg trägt der zurückgegebene Stand die nächste Revision; auch reset: true braucht die aktuelle Revision,
 * damit ein veralteter Tab nicht per „Zurücksetzen“ oder „Sicherung einspielen“ einen neueren Stand überschreibt.
 */
export function checkProgressPut(body: unknown, stored: unknown): ProgressPutResult {
  const parsed = ProgressPutSchema.safeParse(body);
  if (!parsed.success) {
    const where = parsed.error.issues.slice(0, 3).map(formatIssue).join(', ');
    return { ok: false, status: 400, error: `Fortschritt nicht gespeichert: Die Daten sind ungültig (Fehler bei ${where}).` };
  }
  const { reset, ...progress } = parsed.data;
  const storedRevision = revisionOf(stored);
  if (isStaleRevision(revisionOf(progress), storedRevision)) {
    return { ok: false, status: 409, error: `Fortschritt nicht gespeichert: ${CONFLICT_MESSAGE}.` };
  }
  const storedAttempts = (stored as { attempts?: unknown } | null)?.attempts;
  const storedCount = Array.isArray(storedAttempts) ? storedAttempts.length : 0;
  if (!reset && isSuspiciousAttemptDrop(storedCount, progress.attempts.length)) {
    return {
      ok: false,
      status: 400,
      error:
        `Fortschritt nicht gespeichert: Er enthält nur ${progress.attempts.length} statt ${storedCount} Versuche. ` +
        'Zum bewussten Zurücksetzen nutze „Fortschritt zurücksetzen“ oder „Sicherung einspielen“ auf der Seite Daten & Import. ' +
        'Ist die App in einem anderen Tab offen? Dann bitte diese Seite neu laden.',
    };
  }
  return { ok: true, progress: { ...progress, revision: storedRevision + 1 } };
}
