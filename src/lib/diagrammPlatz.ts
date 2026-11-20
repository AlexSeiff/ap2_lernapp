// Wo erscheint ein neues Element im Diagramm-Editor? Reine Rechnung (ohne React), damit sie sich testen lässt.

import type { Form } from '../../domain/diagrammUebungen';
import { behaelterVon, einrasten, istBehaelter, mitte, type EditorKnoten } from './diagrammEditor';

/** Editoren, in denen die Abläufe von oben nach unten laufen (die anderen von links nach rechts). */
export const SENKRECHT = new Set(['epk', 'usecase', 'aktivitaet']);

/** Was die Platzwahl vom Editor braucht. */
export interface PlatzKontext {
  knoten: EditorKnoten[];
  /** Das ausgewählte Element, falls eins ausgewählt ist. */
  gewaehlt: EditorKnoten | undefined;
  /** Neue Elemente an die Auswahl anhängen (statt in den sichtbaren Bereich zu setzen). */
  anhaengen: boolean;
  /** Art des Editors (bestimmt die Hauptrichtung: senkrecht oder waagerecht). */
  editor: string;
  /** Horizontale Bildlaufposition des Zeichenbereichs in Pixeln, oder null, wenn er nicht da ist. */
  scrollLinks: number | null;
  zoom: number;
}

/** Platz für ein neues Element: an der Auswahl (rechts bzw. darunter), sonst im sichtbaren Bereich. */
export function neuerPlatz(
  form: Form,
  w: number,
  h: number,
  { knoten, gewaehlt, anhaengen, editor, scrollLinks, zoom }: PlatzKontext,
): { x: number; y: number; h?: number; pool?: EditorKnoten } {
  const ueberlappt = (x: number, y: number, w: number, h: number) =>
    knoten.some((k) => !istBehaelter(k.form) && x < k.x + k.w && x + w > k.x && y < k.y + k.h && y + h > k.y);

  if (form === 'schwimmbahn') {
    // Neue Schwimmbahn rechts neben die letzte, gleich hoch – so entstehen nebeneinanderliegende Bahnen.
    const bahnen = knoten.filter((k) => k.form === 'schwimmbahn');
    if (bahnen.length) {
      const rechts = bahnen.reduce((a, b) => (b.x + b.w > a.x + a.w ? b : a));
      return { x: rechts.x + rechts.w, y: rechts.y, h: rechts.h };
    }
    return { x: 40, y: 40 };
  }
  if (form === 'lane') {
    const pool =
      (gewaehlt?.form === 'pool' ? gewaehlt : undefined) ??
      (gewaehlt ? behaelterVon(gewaehlt, knoten, 'pool') : undefined) ??
      knoten.find((k) => k.form === 'pool');
    if (pool) {
      const lanes = knoten.filter((k) => k.form === 'lane' && behaelterVon(k, knoten, 'pool')?.id === pool.id);
      const y = lanes.length ? Math.max(...lanes.map((l) => l.y + l.h)) : pool.y;
      return { x: pool.x + 26, y, pool };
    }
  }
  if (istBehaelter(form)) {
    const unten = knoten.length ? Math.max(...knoten.map((k) => k.y + k.h)) + 40 : 40;
    return { x: form === 'systemgrenze' ? 160 : 40, y: knoten.some((k) => istBehaelter(k.form)) || !knoten.length ? unten : 40 };
  }
  const sel = gewaehlt;
  const grenze = knoten.find((k) => k.form === 'systemgrenze');
  if (form === 'akteur' && grenze) {
    // Akteure stehen links außerhalb der Systemgrenze, auf Höhe des ausgewählten Anwendungsfalls.
    const x = Math.max(10, grenze.x - w - 60);
    let y = sel && !istBehaelter(sel.form) ? mitte(sel)[1] - h / 2 : grenze.y + 20;
    for (let i = 0; i < 20 && ueberlappt(x, y, w, h); i++) y += h + 30;
    return { x: einrasten(x), y: Math.max(10, einrasten(y)) };
  }
  if (sel && istBehaelter(sel.form)) {
    // In den ausgewählten Pool, die Lane, die Schwimmbahn oder die Systemgrenze hinein (links beginnend, nach rechts weiter).
    // Systemgrenze und Schwimmbahn: untereinander, unter dem Kopf der Bahn.
    const untereinander = sel.form === 'systemgrenze' || sel.form === 'schwimmbahn';
    let x = untereinander ? sel.x + sel.w / 2 - w / 2 : sel.x + (sel.form === 'pool' ? 60 : 40);
    let y = untereinander ? sel.y + (sel.form === 'schwimmbahn' ? 60 : 40) : sel.y + sel.h / 2 - h / 2;
    for (let i = 0; i < 20 && ueberlappt(x, y, w, h); i++) {
      if (untereinander) y += h + 30;
      else x += w + 40;
    }
    return { x: einrasten(x), y: einrasten(y) };
  }
  if (sel && anhaengen) {
    const [cx, cy] = mitte(sel);
    const senkrecht = SENKRECHT.has(editor);
    let x = senkrecht ? cx - w / 2 : sel.x + sel.w + 50;
    let y = senkrecht ? sel.y + sel.h + 40 : cy - h / 2;
    for (let i = 0; i < 12 && ueberlappt(x, y, w, h); i++) {
      if (senkrecht) x += w + 30;
      else y += h + 30;
    }
    return { x: Math.max(10, einrasten(x)), y: Math.max(10, einrasten(y)) };
  }
  const x0 = scrollLinks !== null ? scrollLinks / zoom + 40 : 40;
  let x = x0;
  let y = 40;
  for (let i = 0; i < 60 && ueberlappt(x, y, w, h); i++) {
    x += w + 30;
    if (x > x0 + 600) {
      x = x0;
      y += h + 40;
    }
  }
  return { x: einrasten(x), y: einrasten(y) };
}
