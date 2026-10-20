// Gewählte Dauer der Tagesrunde („Ich habe nur 10 Minuten“): pro Gerät im localStorage, Standard HEUTE_MINUTEN.

import { HEUTE_MINUTEN } from '../../shared/config';

export const HEUTE_DAUERN = [10, 20, 40] as const;
export const HEUTE_DAUER_SPEICHER = 'ap2-heute-dauer';

export function leseDauer(): number {
  try {
    const n = Number(localStorage.getItem(HEUTE_DAUER_SPEICHER));
    return (HEUTE_DAUERN as readonly number[]).includes(n) ? n : HEUTE_MINUTEN;
  } catch {
    return HEUTE_MINUTEN;
  }
}

export function speichereDauer(minuten: number): void {
  try {
    localStorage.setItem(HEUTE_DAUER_SPEICHER, String(minuten));
  } catch {
    /* ohne Speicher gilt die Wahl nur bis zum Neuladen */
  }
}
