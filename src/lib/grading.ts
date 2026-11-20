import type { Task } from '../../domain/types';

/** IHK-Notenschlüssel (Punkte → Note). */
export const GRADE_SCALE = [
  { min: 92, note: 1, label: 'sehr gut' },
  { min: 81, note: 2, label: 'gut' },
  { min: 67, note: 3, label: 'befriedigend' },
  { min: 50, note: 4, label: 'ausreichend' },
  { min: 30, note: 5, label: 'mangelhaft' },
  { min: 0, note: 6, label: 'ungenügend' },
];

/** Note für einen Prozentwert (0–100). Die IHK rundet auf ganze Punkte. */
export function ihkGrade(percent: number) {
  const p = Math.round(percent);
  return GRADE_SCALE.find((g) => p >= g.min)!;
}

export const percent = (points: number, max: number) => (max > 0 ? (points / max) * 100 : 0);

export function formatPoints(n: number): string {
  return n.toLocaleString('de-DE', { maximumFractionDigits: 1 });
}

/** Liest „1.234,5", „1234.5", „12,5 %" usw. */
export function parseGermanNumber(input: string): number | null {
  let s = input
    .trim()
    .replace(/[^\d,.\-−]/g, '')
    .replace('−', '-');
  if (!s) return null;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[\s\-_.]+/g, ' ');

/** Antwortformat für automatisch bewertbare Aufgaben. */
export type AutoAnswer =
  | { kind: 'mc'; selected: number[] }
  | { kind: 'lueckentext'; values: string[] }
  | { kind: 'zuordnung'; mapping: Record<number, number> }
  | { kind: 'rechnen'; value: string };

export function canAutoGrade(task: Task): boolean {
  return !!task.auto && task.type !== 'offen';
}

/** Bewertet objektive Aufgaben. Gibt Punkte (0,5er-Schritte) und Einzelergebnisse zurück. */
export function autoGrade(task: Task, answer: AutoAnswer): { points: number; details: boolean[] } {
  const a = task.auto;
  const round = (x: number) => Math.round(x * task.points * 2) / 2;
  if (!a) return { points: 0, details: [] };
  switch (answer.kind) {
    case 'mc': {
      const correct = new Set(a.correct ?? []);
      const selected = new Set(answer.selected);
      const details = (a.options ?? []).map((_, i) => correct.has(i) === selected.has(i));
      const exact = details.every(Boolean);
      return { points: exact ? task.points : 0, details };
    }
    case 'lueckentext': {
      const blanks = a.blanks ?? [];
      const details = blanks.map((b, i) => b.split('/').some((alt) => normalize(alt) === normalize(answer.values[i] ?? '')));
      return { points: round(details.filter(Boolean).length / Math.max(blanks.length, 1)), details };
    }
    case 'zuordnung': {
      const pairs = a.pairs ?? [];
      const details = pairs.map((_, i) => answer.mapping[i] === i);
      return { points: round(details.filter(Boolean).length / Math.max(pairs.length, 1)), details };
    }
    case 'rechnen': {
      const value = parseGermanNumber(answer.value);
      const ok = value !== null && !!a.numeric && Math.abs(value - a.numeric.value) <= a.numeric.tolerance + 1e-9;
      return { points: ok ? task.points : 0, details: [ok] };
    }
  }
}

/** Grobe Schwierigkeit aus der Punktzahl (IHK: ~1 Punkt pro Minute). */
export function difficulty(points: number): 'leicht' | 'mittel' | 'schwer' {
  return points <= 5 ? 'leicht' : points <= 10 ? 'mittel' : 'schwer';
}
