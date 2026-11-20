// Seitenblättern zwischen Themen (Deep-Dive-Blätter) und Begriffsseiten: reine Funktionen – Reihenfolge, Nachbarn, Wischrichtung.
// Die Oberfläche (Knöpfe, Wischen, Pfeiltasten) steht in components/ThemaBlaettern.tsx.

import type { Settings } from '../../domain/progress';
import type { BegriffsSeite, Topic } from '../../domain/types';
import { istAusgeblendet } from './settings';

export interface Nachbarn {
  zurueck?: string;
  weiter?: string;
}

/** Vorheriger und nächster Eintrag der Folge; an den Rändern fehlt die jeweilige Seite, bei unbekannter Id beide. */
export function nachbarn(ids: readonly string[], id: string): Nachbarn {
  const i = ids.indexOf(id);
  if (i < 0) return {};
  return { ...(i > 0 ? { zurueck: ids[i - 1] } : {}), ...(i < ids.length - 1 ? { weiter: ids[i + 1] } : {}) };
}

/**
 * Die Reihenfolge der Lernblätter beim Blättern: die der Themenliste (nach Dateinummer), ausgeblendete Blätter übersprungen.
 * Das gerade offene Blatt bleibt in der Folge, auch wenn es ausgeblendet ist – so findet man von dort aus weiter.
 */
export function themenFolge(
  topics: readonly Pick<Topic, 'id'>[],
  settings: Pick<Settings, 'ausgeblendeteThemen'>,
  aktuell: string,
): string[] {
  return topics.filter((t) => t.id === aktuell || !istAusgeblendet(settings, t.id)).map((t) => t.id);
}

/** Die Begriffsseiten alphabetisch (deutsche Sortierung) nach Begriff – wie im Glossar. */
export function begriffsFolge(seiten: readonly Pick<BegriffsSeite, 'id' | 'begriff'>[]): string[] {
  return [...seiten].sort((a, b) => a.begriff.localeCompare(b.begriff, 'de')).map((s) => s.id);
}

export type Wisch = 'links' | 'rechts';

/**
 * Wischrichtung aus dem Weg eines Fingers: deutlich waagerecht (mindestens `minDx`, höchstens `maxDy` senkrecht und mehr als
 * doppelt so weit waagerecht wie senkrecht), sonst keine – so wird Scrollen nicht als Blättern gewertet.
 */
export function wischRichtung(
  dx: number,
  dy: number,
  { minDx = 80, maxDy = 50 }: { minDx?: number; maxDy?: number } = {},
): Wisch | undefined {
  if (Math.abs(dx) < minDx || Math.abs(dy) > maxDy || Math.abs(dx) < 2 * Math.abs(dy)) return undefined;
  return dx < 0 ? 'links' : 'rechts';
}
