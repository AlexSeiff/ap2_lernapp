// Markierte Karteikarten (Umsetzungsplan Phase 4): reine Funktionen. Gespeichert in progress.markiert (domain/progress.ts, Version 7).
// Markieren ändert nichts an der Wiederholungsplanung (CardState bleibt unberührt).

import type { Progress } from '../../domain/progress';

export const istMarkiert = (p: Pick<Progress, 'markiert'>, cardId: string) => p.markiert[cardId]?.an === true;

/** Markierung setzen oder entfernen; entfernt bleibt der Eintrag mit `an: false` und Zeitpunkt (für das Zusammenführen). */
export function setzeMarkierung(p: Progress, cardId: string, an: boolean, now = new Date().toISOString()): Progress {
  if (istMarkiert(p, cardId) === an) return p;
  return { ...p, markiert: { ...p.markiert, [cardId]: { an, am: now } } };
}

export const wechsleMarkierung = (p: Progress, cardId: string, now?: string) => setzeMarkierung(p, cardId, !istMarkiert(p, cardId), now);

/** Ids aller markierten Karten. */
export function markierteIds(p: Pick<Progress, 'markiert'>): Set<string> {
  return new Set(
    Object.entries(p.markiert)
      .filter(([, m]) => m.an)
      .map(([id]) => id),
  );
}
