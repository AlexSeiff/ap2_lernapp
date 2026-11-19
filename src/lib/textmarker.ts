// Textmarker: Wörter im Aufgabentext oder in der Ausgangssituation farbig markieren (Keywords, Zahlen, Bedingungen). Reine Funktionen
// auf Zeichenstellen (von/bis im Text des Bereichs); die Anzeige per CSS Custom Highlight API steht in lib/textmarkerDom.ts,
// die Auswahlleiste in components/Textmarker.tsx. Gespeichert in progress.hervorhebungen (shared/progress.ts, Version 10).

import type { Progress, Textmarke } from '../../shared/progress';

export type { Textmarke };

/** Die beiden Markerfarben (Gelb, Grün) – im CSS `::highlight(textmarker-1)` und `-2`. */
export const FARBEN = [1, 2] as const;
export type Farbe = (typeof FARBEN)[number];

/** Die Marke als Stück des Texts, ohne Leerraum an den Rändern; undefined, wenn nichts Sichtbares übrig bleibt. */
function marke(text: string, von: number, bis: number, farbe: number): Textmarke | undefined {
  let v = von;
  let b = Math.min(bis, text.length);
  while (v < b && /\s/.test(text[v])) v++;
  while (b > v && /\s/.test(text[b - 1])) b--;
  return b > v ? { von: v, bis: b, text: text.slice(v, b), farbe } : undefined;
}

const nachVon = (a: Textmarke, b: Textmarke) => a.von - b.von;

/** Nur die Marken, die noch zum Text passen (gleicher Wortlaut an gleicher Stelle) – nach einer Textänderung fallen die übrigen weg. */
export function gueltigeMarken(marken: readonly Textmarke[], text: string): Textmarke[] {
  return marken.filter((m) => m.bis <= text.length && text.slice(m.von, m.bis) === m.text).sort(nachVon);
}

/** Berührt der Bereich [von, bis) eine Marke? */
export const beruehrt = (marken: readonly Textmarke[], von: number, bis: number): boolean => marken.some((m) => m.von < bis && m.bis > von);

/** Die Marken ohne den Bereich [von, bis): überdeckte Stücke fallen weg, halb überdeckte werden gekürzt oder geteilt. */
export function entferne(marken: readonly Textmarke[], von: number, bis: number, text: string): Textmarke[] {
  const rest: Textmarke[] = [];
  for (const m of marken) {
    if (m.bis <= von || m.von >= bis) {
      rest.push(m);
      continue;
    }
    for (const stueck of [
      m.von < von ? marke(text, m.von, von, m.farbe) : undefined,
      m.bis > bis ? marke(text, bis, m.bis, m.farbe) : undefined,
    ])
      if (stueck) rest.push(stueck);
  }
  return rest.sort(nachVon);
}

/**
 * Den Bereich [von, bis) in `farbe` markieren. Was darunter schon markiert war, gehört nun zur neuen Marke (auch bei anderer Farbe);
 * Marken gleicher Farbe, zwischen denen nur Leerraum liegt, werden eins. Leerraum am Rand der Auswahl wird nicht mitmarkiert.
 */
export function markiere(marken: readonly Textmarke[], von: number, bis: number, farbe: number, text: string): Textmarke[] {
  const neu = marke(text, von, bis, farbe);
  if (!neu) return [...marken];
  const mit = [...entferne(marken, neu.von, neu.bis, text), neu].sort(nachVon);
  const verschmolzen: Textmarke[] = [];
  for (const m of mit) {
    const letzte = verschmolzen[verschmolzen.length - 1];
    if (letzte && letzte.farbe === m.farbe && text.slice(letzte.bis, m.von).trim() === '') {
      verschmolzen[verschmolzen.length - 1] = { von: letzte.von, bis: m.bis, text: text.slice(letzte.von, m.bis), farbe: m.farbe };
    } else verschmolzen.push(m);
  }
  return verschmolzen;
}

// ---------- Speicher ----------

/** Die gespeicherten Marken eines Bereichs (leer, wenn es keine gibt). */
export const markenVon = (p: Pick<Progress, 'hervorhebungen'>, bereich: string): readonly Textmarke[] =>
  p.hervorhebungen[bereich]?.marken ?? [];

/**
 * Marken eines Bereichs setzen. Eine leere Liste bleibt mit Zeitpunkt stehen (für das Zusammenführen); wo nie etwas stand und nichts
 * kommt, ändert sich nichts. Gleiche Marken ändern auch den Zeitpunkt nicht.
 */
export function setzeMarken(p: Progress, bereich: string, marken: readonly Textmarke[], jetzt = new Date().toISOString()): Progress {
  const alt = p.hervorhebungen[bereich];
  if (!alt && !marken.length) return p;
  if (alt && JSON.stringify(alt.marken) === JSON.stringify(marken)) return p;
  return { ...p, hervorhebungen: { ...p.hervorhebungen, [bereich]: { marken: [...marken], am: jetzt } } };
}

/** Alle Marken eines Bereichs entfernen. */
export const loescheMarken = (p: Progress, bereich: string, jetzt?: string): Progress => setzeMarken(p, bereich, [], jetzt);
