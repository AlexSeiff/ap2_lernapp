// Wiederholung für Übungen (SQL und Rechnen) wie im Fehlerjournal (JOURNAL_INTERVALS):
// falsch oder Lösung gezeigt → morgen wieder (Stufe 1), richtig bei fälliger Wiederholung → nächste Stufe (3, dann 7 Tage),
// nach der letzten Stufe erledigt (keine Stufe, kein Fälligkeitsdatum).

import { JOURNAL_INTERVALS } from '../../shared/config';
import { addDays, isDue } from './progress';

type Wiederholbar = { stage?: number; due?: string };

/** Setzt die Wiederholung auf Stufe 1 zurück (fällig morgen). */
export const restartRepetition = <S extends Wiederholbar>(s: S, today: string): S => ({
  ...s,
  stage: 1,
  due: addDays(today, JOURNAL_INTERVALS[0]),
});

/** Nächste Wiederholungsstufe; nach der letzten Stufe ist die Übung erledigt. */
export function advanceRepetition<S extends Wiederholbar>(s: S, today: string): S {
  const { due: _due, stage: _stage, ...rest } = s;
  const next = (s.stage ?? 1) + 1;
  return (next > JOURNAL_INTERVALS.length ? rest : { ...rest, stage: next, due: addDays(today, JOURNAL_INTERVALS[next - 1]) }) as S;
}

type Geprueft = Wiederholbar & {
  attempts: number;
  solvedAt?: string;
  lastCheckedAt?: string;
  solutionShown?: boolean;
  zuletztRichtig?: boolean;
};

/**
 * Wie die Übung zuletzt ausging – für „Heute lernen“, das nur neue und zuletzt nicht richtig gelöste Übungen nimmt:
 * `neu` (noch nie geprüft), `falsch` (zuletzt falsch oder Lösung angesehen), `richtig`.
 * Ältere Stände ohne `zuletztRichtig`: nie gelöst oder nach dem Lösen wieder auf Stufe 1 → falsch.
 */
export function letzterStand(s: Geprueft | undefined): 'neu' | 'falsch' | 'richtig' {
  if (!s) return 'neu';
  if (s.zuletztRichtig !== undefined) return s.zuletztRichtig ? 'richtig' : 'falsch';
  if (s.attempts === 0 && !s.solutionShown && s.stage === undefined) return 'neu';
  return !s.solvedAt || s.stage === 1 ? 'falsch' : 'richtig';
}

/** Nach einer Prüfung: falsch → Stufe 1; richtig bei fälliger Wiederholung → nächste Stufe; sonst unverändert. */
export function nachPruefung<S extends Wiederholbar>(s: S, ok: boolean, today: string): S {
  if (!ok) return restartRepetition(s, today);
  return s.stage !== undefined && s.due !== undefined && isDue(s.due, today) ? advanceRepetition(s, today) : s;
}
