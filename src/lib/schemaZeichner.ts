// Zeichenfläche für Tabellenschemata (components/SchemaZeichner.tsx): Tabellen als Kästen frei platzieren, Spalten zwischen Tabellen
// ziehen, Fremdschlüssel per Linie mit ihrer Tabelle verbinden – wie man das Relationenmodell auf dem Prüfungsbogen zeichnet.
// Hier die reinen Änderungen am Modell und die Geometrie der Linien; das Modell bleibt das des Tabellen-Editors (Tabelle mit x/y).

import { fkZiel, nfName } from '../../domain/normalisierungUebungen';
import { neueId } from './diagrammEditor';
import { schemaLayout } from './schemaDiagramm';
import type { Tabelle } from './tabellenEditor';

/** Maße der Kästen in Pixeln (CSS in 08-koordinaten-json.css: .sz-kopf, .sz-zeile). */
export const SZ_KOPF = 36;
export const SZ_ZEILE = 30;
export const SZ_BREITE = 200;
const RASTER = 10;

/** Breite eines Kastens aus dem längsten Text (Monospace 13 px ≈ 8 px je Zeichen plus Griff, PK, Punkt, Löschen). */
export function kastenBreite(t: Pick<Tabelle, 'name' | 'spalten'>): number {
  const spalte = Math.max(6, ...t.spalten.map((s) => s.name.length));
  const name = Math.max(6, t.name.length);
  return Math.round(Math.max(SZ_BREITE, spalte * 8 + 136, name * 10 + 56));
}

const rasten = (v: number) => Math.max(0, Math.round(v / RASTER) * RASTER);

/** Höhe eines Kastens: Kopf, Zeilen und „+ Spalte“. */
export const kastenHoehe = (t: Pick<Tabelle, 'spalten'>) => SZ_KOPF + t.spalten.length * SZ_ZEILE + 32;

/**
 * Tabellen ohne Lage bekommen eine – in Spalten wie im Beziehungsdiagramm (Beziehungstabellen links, Stammdaten rechts), unterhalb
 * der schon platzierten Tabellen.
 */
export function mitLage(tabellen: Tabelle[]): Tabelle[] {
  const ohne = tabellen.filter((t) => t.x === undefined || t.y === undefined);
  if (!ohne.length) return tabellen;
  const platziert = tabellen.filter((t) => !ohne.includes(t));
  const oben = platziert.length ? Math.max(...platziert.map((t) => (t.y ?? 0) + kastenHoehe(t))) + 40 : 20;
  // Spalte und Reihenfolge aus dem Beziehungsdiagramm, Maße von hier.
  const layout = schemaLayout(ohne.map((t) => ({ ...t, spalten: t.spalten.some((s) => s.name.trim()) ? t.spalten : [{ name: '·' }] })));
  const xs = [...new Set(layout.kaesten.map((k) => k.x))].sort((a, b) => a - b);
  const spalteVon = (i: number) => xs.indexOf(layout.kaesten[i].x);
  const lagen = new Map<Tabelle, { x: number; y: number }>();
  let x = 20;
  xs.forEach((_, c) => {
    const drin = ohne.map((t, i) => ({ t, i })).filter(({ i }) => spalteVon(i) === c);
    drin.sort((a, b) => layout.kaesten[a.i].y - layout.kaesten[b.i].y);
    let y = oben;
    for (const { t } of drin) {
      lagen.set(t, { x: rasten(x), y: rasten(y) });
      y += kastenHoehe(t) + 30;
    }
    x += Math.max(...drin.map(({ t }) => kastenBreite(t))) + 80;
  });
  return tabellen.map((t) => (lagen.has(t) ? { ...t, ...lagen.get(t)! } : t));
}

/** Alle Tabellen neu anordnen (Knopf „Anordnen“). */
export const neuAnordnen = (tabellen: Tabelle[]): Tabelle[] => mitLage(tabellen.map((t) => ({ ...t, x: undefined, y: undefined })));

export function verschiebeTabelle(tabellen: Tabelle[], id: string, x: number, y: number): Tabelle[] {
  return tabellen.map((t) => (t.id === id ? { ...t, x: rasten(x), y: rasten(y) } : t));
}

/** Neue, leere Tabelle an einer Stelle der Fläche. */
export function neueTabelleBei(tabellen: Tabelle[], alleIds: { id: string }[], x: number, y: number): Tabelle[] {
  const id = neueId('t', [...alleIds, ...tabellen]);
  return [...tabellen, { id, name: '', spalten: [{ name: '' }], zeilen: [], x: rasten(x), y: rasten(y) }];
}

/**
 * Spalte in eine andere Tabelle verschieben – oder in eine neue an der Stelle `neu`. Beispieldaten wandern mit (in der Zieltabelle
 * eine leere Zelle je Zeile). Eine leere Quelltabelle bleibt stehen, damit man sie selbst löscht oder weiter füllt.
 */
export function verschiebeSpalte(
  tabellen: Tabelle[],
  alleIds: { id: string }[],
  vonId: string,
  index: number,
  ziel: string | { x: number; y: number },
): Tabelle[] {
  const von = tabellen.find((t) => t.id === vonId);
  const spalte = von?.spalten[index];
  if (!von || !spalte || ziel === vonId) return tabellen;
  let neu = tabellen;
  let zielId = typeof ziel === 'string' ? ziel : '';
  if (typeof ziel !== 'string') {
    zielId = neueId('t', [...alleIds, ...tabellen]);
    neu = [...neu, { id: zielId, name: '', spalten: [], zeilen: [], x: rasten(ziel.x), y: rasten(ziel.y) }];
  }
  return neu.map((t) => {
    if (t.id === vonId)
      return { ...t, spalten: t.spalten.filter((_, j) => j !== index), zeilen: t.zeilen.map((z) => z.filter((_, j) => j !== index)) };
    if (t.id === zielId) return { ...t, spalten: [...t.spalten, { ...spalte }], zeilen: t.zeilen.map((z) => [...z, '']) };
    return t;
  });
}

/** Fremdschlüssel ziehen: Spalte wird FK und verweist auf die Zieltabelle. */
export function verbinde(tabellen: Tabelle[], vonId: string, index: number, zielId: string): Tabelle[] {
  const ziel = tabellen.find((t) => t.id === zielId);
  if (!ziel || zielId === vonId) return tabellen;
  return tabellen.map((t) =>
    t.id === vonId
      ? { ...t, spalten: t.spalten.map((s, j) => (j === index ? { ...s, fk: true, ziel: ziel.name.trim() || undefined } : s)) }
      : t,
  );
}

/** Tabelle umbenannt: Verweise der Fremdschlüssel ziehen mit. */
export function benenneUm(tabellen: Tabelle[], id: string, name: string): Tabelle[] {
  const alt = tabellen.find((t) => t.id === id)?.name.trim();
  const umbenannt = (s: Tabelle['spalten'][number]) =>
    alt && s.ziel && nfName(s.ziel) === nfName(alt) ? { ...s, ziel: name.trim() || undefined } : s;
  return tabellen.map((t) => ({ ...t, name: t.id === id ? name : t.name, spalten: t.spalten.map(umbenannt) }));
}

export interface SzLinie {
  key: string;
  d: string;
  n: { x: number; y: number };
  eins: { x: number; y: number };
}

/** Linien vom Fremdschlüssel zur Zeile des Primärschlüssels der Zieltabelle. */
export function zeichnerLinien(tabellen: Tabelle[]): SzLinie[] {
  const linien: SzLinie[] = [];
  const breite = kastenBreite;
  for (const t of tabellen) {
    t.spalten.forEach((s, i) => {
      if (!s.fk || !s.name.trim()) return;
      const z = fkZiel(tabellen, t, s.name, s.ziel);
      if (!z || z === t) return;
      // Zielzeile: gleichnamiger PK, sonst gleichnamige Spalte (PK noch nicht markiert), sonst erster PK, sonst erste Zeile.
      const zi =
        [
          z.spalten.findIndex((x) => x.pk && nfName(x.name) === nfName(s.name)),
          z.spalten.findIndex((x) => nfName(x.name) === nfName(s.name)),
          z.spalten.findIndex((x) => x.pk),
        ].find((k) => k >= 0) ?? 0;
      const y1 = (t.y ?? 0) + SZ_KOPF + i * SZ_ZEILE + SZ_ZEILE / 2;
      const y2 = (z.y ?? 0) + SZ_KOPF + zi * SZ_ZEILE + SZ_ZEILE / 2;
      const [ax, aw, bx, bw] = [t.x ?? 0, breite(t), z.x ?? 0, breite(z)];
      const ueberlappt = ax < bx + bw && bx < ax + aw;
      const rechts1 = ueberlappt ? true : bx + bw / 2 > ax + aw / 2;
      const rechts2 = ueberlappt ? true : !rechts1;
      const x1 = rechts1 ? ax + aw : ax;
      const x2 = rechts2 ? bx + bw : bx;
      const bogen = ueberlappt ? 40 : Math.max(30, Math.abs(x2 - x1) / 2);
      linien.push({
        key: `${t.id}.${i}`,
        d: `M ${x1} ${y1} C ${x1 + (rechts1 ? bogen : -bogen)} ${y1}, ${x2 + (rechts2 ? bogen : -bogen)} ${y2}, ${x2} ${y2}`,
        n: { x: x1 + (rechts1 ? 10 : -10), y: y1 - 6 },
        eins: { x: x2 + (rechts2 ? 10 : -10), y: y2 - 6 },
      });
    });
  }
  return linien;
}
