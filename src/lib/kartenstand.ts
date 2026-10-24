// Kartenstand: alle schon bewerteten Karteikarten nach der letzten Bewertung – gewusst, unsicher, nicht gewusst.
// Rein, ohne React; die Seite steht in pages/Kartenstand.tsx. Grundlage ist CardState.last (rateCard, rateCardLeicht).

import type { CardState, Progress, Rating } from '../../shared/progress';
import type { Flashcard } from '../../shared/types';
import { isDue, localDate } from './progress';

export const STAENDE: Rating[] = ['gewusst', 'unsicher', 'nicht'];

export const isStand = (v: unknown): v is Rating => (STAENDE as unknown[]).includes(v);

export const STAND_TEXT: Record<Rating, { titel: string; kurz: string; zeichen: string }> = {
  gewusst: { titel: 'Gewusst', kurz: 'gewusst', zeichen: '✓' },
  unsicher: { titel: 'Unsicher', kurz: 'unsicher', zeichen: '~' },
  nicht: { titel: 'Nicht gewusst', kurz: 'nicht gewusst', zeichen: '✗' },
};

export interface StandEintrag {
  card: Flashcard;
  state: CardState;
  stand: Rating;
}

export interface Kartenstand {
  gruppen: Record<Rating, StandEintrag[]>;
  /** Karten im Pool, die noch nie bewertet wurden. */
  neu: number;
  gesamt: number;
}

/**
 * Stand einer bewerteten Karte. Ältere Stände ohne `last` (vor der Bewertung mit Datum) ordnet das Fach ein:
 * ab Fach 2 war die letzte Bewertung „gewusst“, in Fach 1 lässt sich „unsicher“ nicht von „nicht gewusst“ trennen – also unsicher.
 */
export const standVon = (s: CardState): Rating => s.last ?? (s.box >= 2 ? 'gewusst' : 'unsicher');

/** Teilt die Karten des Pools nach der letzten Bewertung auf; neue Karten zählen nur mit. */
export function kartenstand(pool: Flashcard[], progress: Pick<Progress, 'cards'>): Kartenstand {
  const gruppen: Record<Rating, StandEintrag[]> = { gewusst: [], unsicher: [], nicht: [] };
  let neu = 0;
  for (const card of pool) {
    const state = progress.cards[card.id];
    if (!state) {
      neu++;
      continue;
    }
    const stand = standVon(state);
    gruppen[stand].push({ card, state, stand });
  }
  return { gruppen, neu, gesamt: pool.length };
}

export type StandSortierung = 'faellig' | 'fach' | 'thema';

/**
 * Sortierung der Liste: „faellig“ = am längsten fällig zuerst, „fach“ = niedrigstes Fach zuerst (dann fällig),
 * „thema“ = Reihenfolge des Pools (Deep Dive, Deck) – die Seite gruppiert dann nach Thema.
 */
export function sortiereStand(eintraege: StandEintrag[], nach: StandSortierung): StandEintrag[] {
  if (nach === 'thema') return eintraege;
  const kopie = [...eintraege];
  if (nach === 'faellig') return kopie.sort((a, b) => a.state.due.localeCompare(b.state.due) || a.state.box - b.state.box);
  return kopie.sort((a, b) => a.state.box - b.state.box || a.state.due.localeCompare(b.state.due));
}

/** Suche in Frage, Antwort, Tags und Id (ohne Groß-/Kleinschreibung). */
export function passtZurSuche(card: Flashcard, suche: string): boolean {
  const q = suche.trim().toLowerCase();
  if (!q) return true;
  return [card.question, card.answer ?? '', card.id, ...(card.tags ?? [])].some((t) => t.toLowerCase().includes(q));
}

/** „fällig“, „morgen“, „in 3 Tagen“ – wann die Karte wieder drankommt. */
export function faelligText(due: string, today = localDate()): string {
  if (isDue(due, today)) return 'fällig';
  const [y, m, d] = due.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  const tage = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86_400_000);
  return tage === 1 ? 'morgen' : `in ${tage} Tagen`;
}
