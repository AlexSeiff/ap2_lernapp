// Diagramm-Übungen (Umsetzungsplan Phase 7): reine Update-Funktionen und Selektoren für den Fortschritt (Progress.diagramme /
// Progress.diagrammDays). Wiederholung wie bei Rechen- und SQL-Übungen (src/lib/wiederholung.ts).

import type { DiagrammState, Progress } from '../../shared/progress';
import type { Content } from '../../shared/types';
import type { DiagrammUebung } from '../../shared/diagrammUebungen';
import { isDue, localDate } from './progress';
import { nachPruefung, restartRepetition } from './wiederholung';

export type DiagrammStatus = 'offen' | 'geloest' | 'faellig' | 'mit-loesung';

const leer = (): DiagrammState => ({ attempts: 0, hintsUsed: 0 });
const mit = (p: Progress, id: string, s: DiagrammState): Progress => ({ ...p, diagramme: { ...p.diagramme, [id]: s } });

/** Alle Diagramm-Übungen des Inhalts (ältere Stände ohne das Feld: keine). */
export const diagrammUebungen = (content: Pick<Content, 'diagrammUebungen'>): DiagrammUebung[] => content.diagrammUebungen ?? [];

/**
 * „Prüfen“: zählt als Versuch und Lerntag. Fehlerfrei ohne vorher gezeigte Lösung → gelöst (erstes Mal).
 * Fehler → Wiederholung ab Stufe 1; fehlerfrei bei fälliger Wiederholung → nächste Stufe.
 * Die Belegung wird nicht gespeichert: Beim nächsten Öffnen beginnt die Übung leer.
 */
export function recordDiagrammCheck(p: Progress, id: string, ok: boolean, today = localDate()): Progress {
  const prev = p.diagramme[id] ?? leer();
  let next: DiagrammState = { ...prev, attempts: prev.attempts + 1, lastCheckedAt: today, zuletztRichtig: ok };
  if (ok && !next.solutionShown && !next.solvedAt) next = { ...next, solvedAt: today };
  next = nachPruefung(next, ok, today);
  return { ...mit(p, id, next), diagrammDays: { ...p.diagrammDays, [today]: (p.diagrammDays[today] ?? 0) + 1 } };
}

/** Ein Hinweis wurde aufgedeckt. */
export function recordDiagrammHint(p: Progress, id: string): Progress {
  const prev = p.diagramme[id] ?? leer();
  return mit(p, id, { ...prev, hintsUsed: prev.hintsUsed + 1 });
}

/** Lösung angesehen: zählt danach als „mit Lösung“ und nicht als richtig, kommt morgen zur Wiederholung. */
export function recordDiagrammLoesung(p: Progress, id: string, today = localDate()): Progress {
  const prev = p.diagramme[id] ?? leer();
  return mit(p, id, restartRepetition({ ...prev, solutionShown: true, zuletztRichtig: false }, today));
}

/** Status für Liste und Filter; eine fällige Wiederholung hat Vorrang. */
export function diagrammStatus(state: DiagrammState | undefined, today = localDate()): DiagrammStatus {
  if (!state) return 'offen';
  if (state.due !== undefined && isDue(state.due, today)) return 'faellig';
  if (state.solvedAt) return 'geloest';
  if (state.solutionShown) return 'mit-loesung';
  return 'offen';
}

/** Gelöst, Anzahl und fällige Wiederholungen (Übersicht, Navigation, Liste). */
export function diagrammSummary(p: Progress, ids: string[], today = localDate()): { solved: number; total: number; due: number } {
  let solved = 0;
  let due = 0;
  for (const id of ids) {
    const s = p.diagramme[id];
    if (s?.solvedAt) solved++;
    if (diagrammStatus(s, today) === 'faellig') due++;
  }
  return { solved, total: ids.length, due };
}
