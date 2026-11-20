// JSON-Übungen: reine Update-Funktionen und Selektoren für den Fortschritt (Progress.json). Wiederholung wie bei den Diagramm-,
// Rechen- und SQL-Übungen (src/lib/wiederholung.ts). Der Text im Eingabefeld wird nicht gespeichert: Beim nächsten Öffnen beginnt
// die Übung neu.

import type { JsonState, Progress } from '../../domain/progress';
import type { JsonUebung } from '../../domain/jsonUebungen';
import type { Content } from '../../domain/types';
import { isDue, localDate } from './progress';
import { nachPruefung, restartRepetition } from './wiederholung';

export type JsonStatus = 'offen' | 'geloest' | 'faellig' | 'mit-loesung';

const leer = (): JsonState => ({ attempts: 0, hintsUsed: 0 });
const mit = (p: Progress, id: string, s: JsonState): Progress => ({ ...p, json: { ...p.json, [id]: s } });

/** Alle JSON-Übungen des Inhalts (ältere Stände ohne das Feld: keine). */
export const jsonUebungen = (content: Pick<Content, 'jsonUebungen'>): JsonUebung[] => content.jsonUebungen ?? [];

/**
 * „Prüfen“: zählt als Versuch. Alle Regeln erfüllt ohne vorher gezeigte Lösung → gelöst (erstes Mal).
 * Nicht erfüllt → Wiederholung ab Stufe 1; erfüllt bei fälliger Wiederholung → nächste Stufe.
 */
export function recordJsonCheck(p: Progress, id: string, ok: boolean, today = localDate()): Progress {
  const prev = p.json[id] ?? leer();
  let next: JsonState = { ...prev, attempts: prev.attempts + 1, lastCheckedAt: today, zuletztRichtig: ok };
  if (ok && !next.solutionShown && !next.solvedAt) next = { ...next, solvedAt: today };
  return mit(p, id, nachPruefung(next, ok, today));
}

/** Ein Hinweis wurde aufgedeckt. */
export function recordJsonHint(p: Progress, id: string): Progress {
  const prev = p.json[id] ?? leer();
  return mit(p, id, { ...prev, hintsUsed: prev.hintsUsed + 1 });
}

/** Lösung angesehen: zählt danach als „mit Lösung“ und nicht als richtig, kommt morgen zur Wiederholung. */
export function recordJsonLoesung(p: Progress, id: string, today = localDate()): Progress {
  const prev = p.json[id] ?? leer();
  return mit(p, id, restartRepetition({ ...prev, solutionShown: true, zuletztRichtig: false }, today));
}

/** Status für Liste und Filter; eine fällige Wiederholung hat Vorrang. */
export function jsonStatus(state: JsonState | undefined, today = localDate()): JsonStatus {
  if (!state) return 'offen';
  if (state.due !== undefined && isDue(state.due, today)) return 'faellig';
  if (state.solvedAt) return 'geloest';
  if (state.solutionShown) return 'mit-loesung';
  return 'offen';
}

/** Gelöst, Anzahl und fällige Wiederholungen (Liste). */
export function jsonSummary(p: Pick<Progress, 'json'>, ids: string[], today = localDate()): { solved: number; total: number; due: number } {
  let solved = 0;
  let due = 0;
  for (const id of ids) {
    const s = p.json[id];
    if (s?.solvedAt) solved++;
    if (jsonStatus(s, today) === 'faellig') due++;
  }
  return { solved, total: ids.length, due };
}
