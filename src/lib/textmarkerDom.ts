// Textmarker im Browser: Auswahl → Zeichenstellen und Zeichenstellen → Anzeige. Die Marken werden mit der CSS Custom Highlight API
// (`CSS.highlights`, `::highlight(textmarker-1)`) gezeichnet – das DOM, das React verwaltet, bleibt unverändert. Ohne die API
// (ältere Browser) gibt es den Textmarker nicht; Aufgaben und Lesen funktionieren wie bisher.

import type { Textmarke } from './textmarker';
import { FARBEN } from './textmarker';

/** Kennt der Browser die Highlight-API? */
export const textmarkerMoeglich = (): boolean =>
  typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined' && typeof Range !== 'undefined';

/** Zeichenstellen einer Auswahl im Text von `container` (textContent); undefined, wenn sie nicht ganz darin liegt oder leer ist. */
export function auswahlStellen(container: Element, range: Range): { von: number; bis: number } | undefined {
  if (range.collapsed || !container.contains(range.startContainer) || !container.contains(range.endContainer)) return undefined;
  const bis = stelle(container, range.endContainer, range.endOffset);
  const von = stelle(container, range.startContainer, range.startOffset);
  return bis > von ? { von, bis } : undefined;
}

/** Wie viele Zeichen Text stehen in `container` vor diesem Punkt? */
function stelle(container: Element, node: Node, offset: number): number {
  const davor = document.createRange();
  davor.selectNodeContents(container);
  davor.setEnd(node, offset);
  return davor.toString().length;
}

/** Der Bereich [von, bis) als Range im Text von `container`, auch über mehrere Textknoten; undefined, wenn er nicht hineinpasst. */
export function stellenRange(container: Element, von: number, bis: number): Range | undefined {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let pos = 0;
  let begonnen = false;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const laenge = n.nodeValue?.length ?? 0;
    if (!begonnen && von < pos + laenge) {
      range.setStart(n, von - pos);
      begonnen = true;
    }
    if (begonnen && bis <= pos + laenge) {
      range.setEnd(n, bis - pos);
      return range;
    }
    pos += laenge;
  }
  return undefined;
}

// Mehrere Textmarker stehen gleichzeitig auf einer Seite (Klausur: viele Aufgaben). Die Highlight-Namen sind aber global – deshalb
// sammelt diese Tabelle die Ranges aller Instanzen und setzt je Farbe ein gemeinsames Highlight.
const instanzen = new Map<string, Map<number, Range[]>>();

function abgleichen() {
  for (const farbe of FARBEN) {
    const name = `textmarker-${farbe}`;
    const alle = [...instanzen.values()].flatMap((m) => m.get(farbe) ?? []);
    if (alle.length) CSS.highlights.set(name, new Highlight(...alle));
    else CSS.highlights.delete(name);
  }
}

/** Die Marken einer Instanz anzeigen (ersetzt ihre bisherigen). Marken, die nicht in den Text passen, bleiben unsichtbar. */
export function zeigeMarken(instanz: string, container: Element, marken: readonly Textmarke[]) {
  const nachFarbe = new Map<number, Range[]>();
  for (const m of marken) {
    const r = stellenRange(container, m.von, m.bis);
    if (r) nachFarbe.set(m.farbe, [...(nachFarbe.get(m.farbe) ?? []), r]);
  }
  instanzen.set(instanz, nachFarbe);
  abgleichen();
}

/** Alle Marken einer Instanz ausblenden (beim Verlassen der Seite). */
export function entferneMarken(instanz: string) {
  if (instanzen.delete(instanz)) abgleichen();
}
