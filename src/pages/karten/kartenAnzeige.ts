import type { CardType, Flashcard } from '../../../domain/types';
import type { IconName } from '../../components/Icon';
import { farbKlasse, TYP_FARBE } from '../../lib/farben';

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  wissen: 'Wissen',
  abgrenzung: 'Abgrenzung',
  rechnung: 'Rechnung',
  anwendung: 'Anwendung',
  falle: 'Falle',
  begriff: 'Fachbegriff',
};
/** Farbe der Karte (Streifen oben, Etiketten): nach Kartentyp, Prüfer- und Fachgesprächsfragen eigene Farben. */
export const typKlasse = (c: Flashcard) =>
  `${c.typ === 'falle' ? 'trap ' : ''}${farbKlasse(c.typ ? TYP_FARBE[c.typ] : c.kind === 'fachgespraech' ? 'pink' : c.kind === 'prueferfrage' ? 'violet' : 'indigo')}`;
export const LEVEL_LABELS: Record<number, string> = { 1: 'Basis', 2: 'Standard', 3: 'Transfer' };
export const KIND_ICONS: Record<Flashcard['kind'], IconName> = {
  lernkarte: 'layers',
  prueferfrage: 'circle-question-mark',
  fachgespraech: 'mic',
};
export const KIND_LABELS: Record<Flashcard['kind'], string> = {
  lernkarte: 'Lernkarte',
  prueferfrage: 'Prüferfrage',
  fachgespraech: 'Fachgespräch',
};
