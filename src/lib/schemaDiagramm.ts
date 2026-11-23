// Beziehungsdiagramm eines Tabellenschemas: jede Tabelle als Kasten (Name oben, darunter die Spalten, Primärschlüssel unterstrichen,
// Fremdschlüssel mit ↑), Linien vom Fremdschlüssel zum Primärschlüssel der Zieltabelle mit „n“ und „1“ – so, wie man das Endschema in
// der Prüfung von Hand zeichnet. Hier nur die Anordnung, gezeichnet wird in components/SchemaDiagramm.tsx. Rein, ohne React.

import { fkZiel, nfName } from '../../domain/normalisierungUebungen';
import type { Tabelle } from './tabellenEditor';

export const ZEILE = 22;
export const KOPF = 28;
/** Breite eines Zeichens: Spalten in Monospace 13 px (0,6 em). */
export const ZEICHEN = 7.8;
const RAND = 14;
const ABSTAND_X = 90;
const ABSTAND_Y = 28;

export interface DiagrammZeile {
  text: string;
  pk: boolean;
  fk: boolean;
  /** Mitte der Zeile (y). */
  y: number;
}

export interface DiagrammKasten {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  zeilen: DiagrammZeile[];
}

export interface DiagrammLinie {
  /** SVG-Pfad (kubische Kurve). */
  d: string;
  /** Beschriftung „n“ am Fremdschlüssel, „1“ am Primärschlüssel. */
  n: { x: number; y: number };
  eins: { x: number; y: number };
  titel: string;
}

export interface SchemaLayout {
  breite: number;
  hoehe: number;
  kaesten: DiagrammKasten[];
  linien: DiagrammLinie[];
}

/**
 * Spalten nach Abhängigkeit: ganz links die Tabellen, auf die niemand verweist (meist die Beziehungstabellen), jede referenzierte Tabelle
 * eine Spalte rechts von der rechtesten Tabelle, die auf sie verweist. So laufen die Linien von links nach rechts zur Nachbarspalte und
 * kreuzen kaum Kästen. Ringe (A → B → A) brechen ab.
 */
function spaltenNachVerweisen(tabellen: Tabelle[]): number[] {
  const verweiser = (t: Tabelle) =>
    tabellen.filter((r) => r !== t && r.spalten.some((s) => s.fk && s.name.trim() && fkZiel(tabellen, r, s.name, s.ziel) === t));
  const spalte = new Map<Tabelle, number>();
  const rechne = (t: Tabelle, pfad: Set<Tabelle>): number => {
    const bekannt = spalte.get(t);
    if (bekannt !== undefined) return bekannt;
    if (pfad.has(t)) return 0;
    pfad.add(t);
    const v = verweiser(t).map((r) => rechne(r, pfad));
    pfad.delete(t);
    const c = v.length ? 1 + Math.max(...v) : 0;
    spalte.set(t, c);
    return c;
  };
  return tabellen.map((t) => rechne(t, new Set()));
}

export function schemaLayout(eingabe: Tabelle[]): SchemaLayout {
  const tabellen = eingabe.filter((t) => t.spalten.some((s) => s.name.trim()));
  const kaesten: DiagrammKasten[] = tabellen.map((t) => {
    const spalten = t.spalten.filter((s) => s.name.trim());
    const texte = spalten.map((s) => `${s.name.trim()}${s.fk ? ' ↑' : ''}`);
    const name = t.name.trim() || 'tabelle';
    const w = Math.round(Math.max(110, ...[name, ...texte].map((x) => x.length * ZEICHEN + 2 * RAND + (x === name ? 6 : 16))));
    return {
      name,
      x: 0,
      y: 0,
      w,
      h: KOPF + spalten.length * ZEILE + 6,
      zeilen: spalten.map((s, i) => ({ text: texte[i], pk: !!s.pk, fk: !!s.fk, y: KOPF + i * ZEILE + ZEILE / 2 + 3 })),
    };
  });

  // Spaltenweise anordnen; innerhalb einer Spalte nach der Lage der Tabellen, die auf sie verweisen (weniger Kreuzungen).
  const spalte = spaltenNachVerweisen(tabellen);
  const anzahl = Math.max(0, ...spalte) + 1;
  const mittelY = new Map<number, number>();
  let x = 0;
  let breite = 0;
  let hoehe = 0;
  const spaltenKaesten: number[][] = [];
  for (let c = 0; c < anzahl; c++) {
    const idx = tabellen.map((_, i) => i).filter((i) => spalte[i] === c);
    const lage = (i: number) => {
      const von = tabellen
        .map((t, j) => ({ t, j }))
        .filter(({ t, j }) => spalte[j] < c && t.spalten.some((s) => s.fk && fkZiel(tabellen, t, s.name, s.ziel) === tabellen[i]))
        .map(({ j }) => mittelY.get(j) ?? 0);
      return von.length ? von.reduce((a, b) => a + b, 0) / von.length : Number.MAX_SAFE_INTEGER;
    };
    idx.sort((a, b) => lage(a) - lage(b) || a - b);
    let y = 0;
    const w = Math.max(...idx.map((i) => kaesten[i].w));
    for (const i of idx) {
      kaesten[i].x = x;
      kaesten[i].y = y;
      mittelY.set(i, y + kaesten[i].h / 2);
      y += kaesten[i].h + ABSTAND_Y;
    }
    hoehe = Math.max(hoehe, y - ABSTAND_Y);
    breite = x + w;
    x += w + ABSTAND_X;
    spaltenKaesten.push(idx);
  }
  // Niedrigere Spalten senkrecht mittig.
  for (const idx of spaltenKaesten) {
    const unten = Math.max(...idx.map((i) => kaesten[i].y + kaesten[i].h));
    const versatz = Math.round((hoehe - unten) / 2);
    for (const i of idx) kaesten[i].y += versatz;
  }

  const linien: DiagrammLinie[] = [];
  tabellen.forEach((t, ti) => {
    const von = kaesten[ti];
    const spalten = t.spalten.filter((s) => s.name.trim());
    spalten.forEach((s, si) => {
      if (!s.fk) return;
      const ziel = fkZiel(tabellen, t, s.name, s.ziel);
      if (!ziel || ziel === t) return;
      const nach = kaesten[tabellen.indexOf(ziel)];
      const zielSpalten = ziel.spalten.filter((x) => x.name.trim());
      // Zeile des Primärschlüssels: die gleichnamige Spalte, bei anderem Namen (projektleiter_nr → mitarbeiter) die erste PK-Spalte.
      const gleich = zielSpalten.findIndex((x) => x.pk && nfName(x.name) === nfName(s.name));
      const zielPk = gleich >= 0 ? gleich : zielSpalten.findIndex((x) => x.pk);
      const y1 = von.y + von.zeilen[si].y;
      const y2 = nach.y + (nach.zeilen[Math.max(0, zielPk)]?.y ?? KOPF / 2);
      const mitte1 = von.x + von.w / 2;
      const mitte2 = nach.x + nach.w / 2;
      // Seiten: zur Zieltabelle hin; liegen die Kästen übereinander, beide rechts mit Bogen nach außen.
      const ueberlappt = von.x < nach.x + nach.w && nach.x < von.x + von.w;
      const rechts1 = ueberlappt ? true : mitte2 > mitte1;
      const rechts2 = ueberlappt ? true : !rechts1;
      const x1 = rechts1 ? von.x + von.w : von.x;
      const x2 = rechts2 ? nach.x + nach.w : nach.x;
      const bogen = ueberlappt ? 40 : Math.max(30, Math.abs(x2 - x1) / 2);
      const c1 = x1 + (rechts1 ? bogen : -bogen);
      const c2 = x2 + (rechts2 ? bogen : -bogen);
      linien.push({
        d: `M ${x1} ${y1} C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}`,
        n: { x: x1 + (rechts1 ? 9 : -9), y: y1 - 6 },
        eins: { x: x2 + (rechts2 ? 9 : -9), y: y2 - 6 },
        titel: `${t.name.trim()}.${s.name.trim()} → ${ziel.name.trim()}`,
      });
      if (ueberlappt) breite = Math.max(breite, Math.max(x1, x2) + bogen);
    });
  });

  return { breite, hoehe, kaesten, linien };
}
