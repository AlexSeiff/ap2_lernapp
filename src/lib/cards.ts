// Karteikarten-Filter: reine Funktionen, der Zustand steht in der URL (?thema=…&deck=…).

import type { Settings } from '../../shared/progress';
import type { Flashcard } from '../../shared/types';

/** `markiert`: '1' = nur markierte Karten (Phase 4), sonst 'alle'. */
export type CardFilter = { thema: string; deck: string; art: string; typ: string; stufe: string; markiert: string };

/** Liest die Filter aus den URL-Parametern; fehlende Werte bedeuten „alle". */
export function readCardFilter(params: URLSearchParams): CardFilter {
  return {
    thema: params.get('thema') ?? 'alle',
    deck: params.get('deck') ?? 'alle',
    art: params.get('art') ?? 'alle',
    typ: params.get('typ') ?? 'alle',
    stufe: params.get('stufe') ?? 'alle',
    markiert: params.get('markiert') === '1' ? '1' : 'alle',
  };
}

/** Übernimmt Filteränderungen in neue URL-Parameter; „alle" oder leer entfernt den Parameter. */
export function withCardFilter(params: URLSearchParams, changes: Partial<CardFilter>): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const [k, v] of Object.entries(changes)) {
    if (!v || v === 'alle') next.delete(k);
    else next.set(k, v);
  }
  return next;
}

/** `markiert`: die Ids der markierten Karten – nötig für den Filter „Nur markierte“ (ohne sie bleibt dabei nichts übrig). */
export function filterCards(cards: Flashcard[], f: CardFilter, markiert: ReadonlySet<string> = new Set()): Flashcard[] {
  return cards.filter(
    (c) =>
      (f.thema === 'alle' || c.topicId === f.thema) &&
      (f.deck === 'alle' || c.deckId === f.deck) &&
      (f.art === 'alle' || c.kind === f.art) &&
      (f.typ === 'alle' || c.typ === f.typ) &&
      (f.stufe === 'alle' || String(c.schwierigkeit) === f.stufe) &&
      (f.markiert !== '1' || markiert.has(c.id)),
  );
}

/** Welche Kartenarten die Einstellungen zulassen (Prüferfragen und Fachgespräch lassen sich ausschalten). */
export type CardKindSettings = Pick<Settings, 'prueferfragen' | 'fachgespraech'>;

/** Ist diese Kartenart (bzw. der Filterwert „alle“) eingeschaltet? */
export function isKindEnabled(kind: string, s: CardKindSettings): boolean {
  if (kind === 'prueferfrage') return s.prueferfragen;
  if (kind === 'fachgespraech') return s.fachgespraech;
  return true;
}

/**
 * Alle Karten, mit denen gelernt wird: ausgeschaltete Arten fallen weg. Ihr Lernstand (CardState) bleibt gespeichert –
 * beim Einschalten ist alles wieder da. Übersicht, Themenstatistik und Karteikarten nutzen denselben Pool.
 */
export function cardPool<T extends Pick<Flashcard, 'kind'>>(cards: T[], s: CardKindSettings): T[] {
  return cards.filter((c) => isKindEnabled(c.kind, s));
}

/**
 * Karten einer Lernrunde: Solange die Auswahl noch nie gesehene Karten hat, nur neue (höchstens `maxNeu`) – fällige
 * Wiederholungen erst, wenn jede Karte einmal dran war. Sonst füllen nicht gewusste Karten die Runden und der übrige Stoff kommt
 * nie. „Nicht gewusst“ kommt in der laufenden Runde trotzdem noch einmal (useCardSession).
 */
export function rundenKarten<T>(faellig: T[], neu: T[], maxNeu: number): T[] {
  return neu.length ? neu.slice(0, maxNeu) : faellig;
}
