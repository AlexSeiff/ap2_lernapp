import { type Form } from '../../../domain/diagrammUebungen';
import { type Punkt } from '../../lib/diagrammEditor';

export type Auswahl = { typ: 'knoten' | 'kante'; id: string } | null;

export type Zug =
  | { art: 'verschieben'; ids: string[]; start: Punkt; dx: number; dy: number; bewegt: boolean; pointer: number }
  | { art: 'groesse'; id: string; start: Punkt; dw: number; dh: number; pointer: number }
  | { art: 'linie'; von: string; p: Punkt; pointer: number };

/** Kardinalitäten zum Antippen (Min-Max und Chen). */
export const KARDINALITAETEN = ['(0,1)', '(1,1)', '(0,n)', '(1,n)', '1', 'n', 'm'];
/** Senkrecht arbeitende Notationen: Neue Elemente kommen unter das ausgewählte. */
/** Kleinste Größe beim Ziehen am Griff; der Balken (Fork/Join) darf dünn bleiben. */
export const minGroesse = (f: Form) => (f === 'gabel' ? 6 : 24);
