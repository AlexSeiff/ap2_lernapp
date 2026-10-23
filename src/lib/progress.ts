// Lernfortschritt: reine Update-Funktionen (Fehlerjournal, Klausur, Karteikarten). Das gespeicherte Datenmodell liegt in shared/progress.ts.

import { CARD_INTERVALS, JOURNAL_INTERVALS } from '../../shared/config';
import type { Attempt, ExamRun, Fehlergrund, Progress, Rating } from '../../shared/progress';
import type { Task } from '../../shared/types';

export function localDate(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return localDate(new Date(y, m - 1, d + days));
}

/**
 * Speichert einen Bearbeitungsversuch und pflegt das Fehlerjournal:
 * Unter voller Punktzahl → (zurück) auf Stufe 0, Wiederholung morgen.
 * Volle Punktzahl bei offenem Eintrag → nächste Stufe (3, dann 7 Tage); nach der 7-Tage-Wiederholung erledigt.
 */
export function recordAttempt(p: Progress, attempt: Attempt, today = localDate()): Progress {
  const journal = { ...p.journal };
  const entry = journal[attempt.taskId];
  const open = entry && !entry.resolvedAt;
  if (attempt.points < attempt.max) {
    journal[attempt.taskId] = {
      taskId: attempt.taskId,
      addedAt: open ? entry.addedAt : today,
      stage: 0,
      due: addDays(today, JOURNAL_INTERVALS[0]),
      lastPoints: attempt.points,
      max: attempt.max,
    };
  } else if (open) {
    const stage = entry.stage + 1;
    journal[attempt.taskId] =
      stage >= JOURNAL_INTERVALS.length
        ? { ...entry, stage, lastPoints: attempt.points, resolvedAt: today }
        : { ...entry, stage, due: addDays(today, JOURNAL_INTERVALS[stage]), lastPoints: attempt.points };
  }
  return { ...p, attempts: [...p.attempts, attempt], journal };
}

/**
 * Nimmt Aufgaben, deren letzter Versuch unter voller Punktzahl blieb, ins Fehlerjournal auf, falls sie dort nicht offen stehen
 * (z. B. ältere Versuche oder zurückgesetztes Journal). Sie sind sofort fällig. Ohne Änderung kommt dasselbe Objekt zurück.
 */
export function fuelleFehlerjournal(p: Progress, taskExists: (id: string) => boolean, today = localDate()): Progress {
  const letzte = new Map<string, Attempt>();
  for (const a of p.attempts) letzte.set(a.taskId, a);
  let journal: Progress['journal'] | undefined;
  for (const [taskId, a] of letzte) {
    if (a.points >= a.max || !taskExists(taskId)) continue;
    const entry = p.journal[taskId];
    if (entry && !entry.resolvedAt) continue;
    journal ??= { ...p.journal };
    journal[taskId] = { taskId, addedAt: today, stage: 0, due: today, lastPoints: a.points, max: a.max };
  }
  return journal ? { ...p, journal } : p;
}

/** Setzt die Antworten (Versuche und Fehlerjournal) der angegebenen Aufgaben zurück; ohne Angabe: aller Aufgaben. */
export function resetAufgabenAntworten(p: Progress, taskIds?: string[]): Progress {
  if (!taskIds) return { ...p, attempts: [], journal: {}, exams: [], activeExam: undefined };
  const ids = new Set(taskIds);
  return {
    ...p,
    attempts: p.attempts.filter((a) => !ids.has(a.taskId)),
    journal: Object.fromEntries(Object.entries(p.journal).filter(([id]) => !ids.has(id))),
  };
}

/**
 * Überträgt eine bewertete Klausur in die Historie und alle Einzelergebnisse (mit Selbsteinschätzung und – unter voller
 * Punktzahl – Fehlergrund) ins Fehlerjournal.
 */
export function finishExam(p: Progress, run: ExamRun, tasks: Task[], now = new Date().toISOString()): Progress {
  let next = p;
  for (const t of tasks) {
    const sicherheit = run.sicherheit?.[t.id];
    const points = run.scores[t.id] ?? 0;
    const fehlergrund = points < t.points ? run.fehlergrund?.[t.id] : undefined;
    next = recordAttempt(next, {
      taskId: t.id,
      date: now,
      points,
      max: t.points,
      mode: 'klausur',
      ...(sicherheit ? { sicherheit } : {}),
      ...(fehlergrund ? { fehlergrund } : {}),
    });
  }
  const total = tasks.reduce((s, t) => s + (run.scores[t.id] ?? 0), 0);
  return { ...next, activeExam: undefined, exams: [...next.exams, { ...run, total, finishedAt: now }] };
}

/**
 * Fehlergrund eines gespeicherten Versuchs setzen oder (undefined) entfernen – der Versuch ist durch Aufgabe und Zeitpunkt bestimmt.
 * Nur unter voller Punktzahl; sonst bleibt alles, wie es ist.
 */
export function setzeFehlergrund(p: Progress, taskId: string, date: string, grund: Fehlergrund | undefined): Progress {
  let geaendert = false;
  const attempts = p.attempts.map((a) => {
    if (a.taskId !== taskId || a.date !== date || a.points >= a.max) return a;
    geaendert = true;
    const { fehlergrund: _alt, ...rest } = a;
    return grund ? { ...rest, fehlergrund: grund } : rest;
  });
  return geaendert ? { ...p, attempts } : p;
}

/** Gibt die laufende Klausur ab. Eine bereits abgegebene behält ihren Zeitpunkt (Timer und StrictMode können doppelt auslösen). */
export function submitExam(p: Progress, now = new Date().toISOString()): Progress {
  if (!p.activeExam || p.activeExam.submittedAt) return p;
  return { ...p, activeExam: { ...p.activeExam, submittedAt: now } };
}

export function rateCard(p: Progress, cardId: string, rating: Rating, today = localDate()): Progress {
  const prev = p.cards[cardId] ?? { box: 1, due: today, reviews: 0 };
  const box = rating === 'gewusst' ? Math.min(prev.box + 1, 5) : rating === 'unsicher' ? Math.max(prev.box, 1) : 1;
  const days = rating === 'gewusst' ? CARD_INTERVALS[box] : rating === 'unsicher' ? 1 : 0;
  return {
    ...p,
    cards: { ...p.cards, [cardId]: { box, due: addDays(today, days), reviews: prev.reviews + 1, last: rating } },
    cardReviewDays: { ...p.cardReviewDays, [today]: (p.cardReviewDays[today] ?? 0) + 1 },
  };
}

export const isDue = (due: string, today = localDate()) => due <= today;

/** Höchstes Leitner-Fach, das eine Karte mit Antworten aus dem Leicht-Modus erreicht (ROADMAP 6.6, Entscheidung Q5). */
export const LEICHT_MAX_BOX = 2;

/**
 * Bewertung im Leicht-Modus (4 Antworten): Wiedererkennen ist leichter als freies Erinnern.
 * Richtig → höchstens ein Fach weiter und höchstens bis Fach 2 (eine Karte in Fach 3–5 bleibt, wo sie ist);
 * falsch → Fach 1, heute wieder fällig. Zählt wie jede Bewertung für die Lernserie (cardReviewDays).
 */
export function rateCardLeicht(p: Progress, cardId: string, richtig: boolean, today = localDate()): Progress {
  const prev = p.cards[cardId] ?? { box: 1, due: today, reviews: 0 };
  const box = richtig ? Math.max(prev.box, Math.min(prev.box + 1, LEICHT_MAX_BOX)) : 1;
  const days = richtig ? CARD_INTERVALS[box] : 0;
  const last: Rating = richtig ? 'gewusst' : 'nicht';
  return {
    ...p,
    cards: { ...p.cards, [cardId]: { box, due: addDays(today, days), reviews: prev.reviews + 1, last } },
    cardReviewDays: { ...p.cardReviewDays, [today]: (p.cardReviewDays[today] ?? 0) + 1 },
  };
}
