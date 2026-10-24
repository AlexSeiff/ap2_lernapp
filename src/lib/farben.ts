// Farben der Oberfläche: Jedes Thema, jeder Kartentyp und jedes Widget bekommt eine Farbe aus derselben Palette.
// Die Werte stehen als CSS-Variablen in styles.css (--c-<name>, -fill, -soft; hell und dunkel); hier nur die Zuordnung.
// Eine Klasse `farbe-<name>` setzt --f, --f-fill und --f-soft für das Element und seine Kinder.

import type { CardType } from '../../shared/types';

export const FARBEN = ['indigo', 'sky', 'teal', 'green', 'amber', 'orange', 'pink', 'violet'] as const;
export type Farbe = (typeof FARBEN)[number] | 'red' | 'slate';

/** Farbe eines Deep Dives: reihum aus der Palette, damit Nachbarn in der Kachelliste verschieden aussehen. */
export function themaFarbe(topicId: string | undefined): Farbe {
  const n = Number(topicId);
  if (!topicId || !Number.isFinite(n) || n <= 0) return 'slate';
  return FARBEN[(n - 1) % FARBEN.length];
}

export const TYP_FARBE: Record<CardType, Farbe> = {
  wissen: 'sky',
  abgrenzung: 'violet',
  rechnung: 'green',
  anwendung: 'teal',
  falle: 'red',
  begriff: 'indigo',
};

export const farbKlasse = (f: Farbe) => `farbe-${f}`;
