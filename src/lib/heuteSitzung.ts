// Laufende „Heute lernen“-Runde (ROADMAP 8.1): welcher Schritt dran ist. Gilt nur für den Tag und dieses Gerät, deshalb im
// localStorage (Schlüssel `ap2-heute`) und nicht im Fortschritt – verloren geht dabei nichts, gelernt wird ja in den normalen Seiten.
// Reine Funktionen + ein kleiner Speicher für useSyncExternalStore (hooks/useHeute.ts).

import type { HeuteArt, HeuteItem } from './heute';

export interface HeuteSitzung {
  datum: string;
  items: HeuteItem[];
  /** Index des aktuellen Schritts; = items.length → fertig. */
  index: number;
  /** Höchster bisher erreichter Index; bleibt beim Wiederöffnen früherer Schritte erhalten. */
  maxIndex: number;
  /** Keys der erledigten (weiter geklickten) Schritte. */
  erledigt: string[];
  /** Keys der übersprungenen Schritte. */
  uebersprungen: string[];
  /** IDs aus früheren Runden von heute (erledigt, übersprungen oder beim Beenden offen) – planeHeute lässt sie weg. */
  frueher: string[];
}

export const HEUTE_SPEICHER = 'ap2-heute';

const ARTEN: HeuteArt[] = ['wiederholung', 'aufgabe', 'sql', 'rechnen', 'diagramm', 'karten'];

/** Neue Runde; `vorher` (die letzte Runde von heute) gibt weiter, was heute schon dran war. */
export function starteSitzung(items: HeuteItem[], datum: string, vorher?: HeuteSitzung): HeuteSitzung {
  return { datum, items, index: 0, maxIndex: 0, erledigt: [], uebersprungen: [], frueher: vorher ? schonDran(vorher) : [] };
}

const istOffen = (s: HeuteSitzung, it: HeuteItem) => !s.erledigt.includes(it.key) && !s.uebersprungen.includes(it.key);

export function offeneSchritte(s: HeuteSitzung): HeuteItem[] {
  return s.items.slice(s.index).filter((it) => istOffen(s, it));
}

/** Alle IDs, die heute schon dran waren, einschließlich des aktuellen und aller bereits bearbeiteten Schritte. */
export function schonDran(s: HeuteSitzung): string[] {
  const dran = s.items.slice(0, s.maxIndex + 1);
  return [...new Set([...s.frueher, ...dran.flatMap((it) => it.ids)])];
}

/** Runde abbrechen: Schritte fallen weg, das bisher Gelernte bleibt für die nächste Runde von heute vermerkt. */
export function beende(s: HeuteSitzung): HeuteSitzung {
  return starteSitzung([], s.datum, s);
}

export const istFertig = (s: HeuteSitzung) => s.index >= s.items.length;
export const aktuellerSchritt = (s: HeuteSitzung): HeuteItem | undefined => s.items[s.index];

/** Aktuellen Schritt als erledigt (oder übersprungen) markieren und zum nächsten gehen. */
export function weiter(s: HeuteSitzung, uebersprungen = false): HeuteSitzung {
  const item = aktuellerSchritt(s);
  if (!item) return s;
  const naechster = s.items.findIndex((it, i) => i > s.index && istOffen(s, it));
  const index = naechster < 0 ? s.items.length : naechster;
  const liste = uebersprungen ? 'uebersprungen' : 'erledigt';
  return { ...s, index, maxIndex: Math.max(s.maxIndex, index), [liste]: [...s[liste], item.key] };
}

/** Häkchen in der Tagesliste ändern. Beim Wiederöffnen bleiben spätere erledigte und übersprungene Schritte erhalten. */
export function setzeSchrittErledigt(s: HeuteSitzung, key: string, erledigt: boolean): HeuteSitzung {
  const index = s.items.findIndex((it) => it.key === key);
  if (index < 0 || index > s.maxIndex || s.uebersprungen.includes(key) || erledigt === s.erledigt.includes(key)) return s;
  if (erledigt) return index === s.index ? weiter(s) : { ...s, erledigt: [...s.erledigt, key] };
  return { ...s, index: Math.min(s.index, index), erledigt: s.erledigt.filter((k) => k !== key) };
}

/** Sitzung nur am selben Tag fortsetzen – morgen wird neu geplant. */
export const sitzungVonHeute = (s: HeuteSitzung | undefined, today: string) => (s && s.datum === today ? s : undefined);

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

function leseItem(v: unknown): HeuteItem | undefined {
  if (!isObj(v)) return undefined;
  const { key, art, ids, thema, titel, minuten, link } = v;
  if (typeof key !== 'string' || typeof link !== 'string' || !link.startsWith('/') || !ARTEN.includes(art as HeuteArt)) return undefined;
  return {
    key,
    art: art as HeuteArt,
    ids: strings(ids),
    thema: typeof thema === 'string' ? thema : '',
    titel: typeof titel === 'string' ? titel : key,
    minuten: typeof minuten === 'number' && minuten >= 0 ? minuten : 0,
    link,
  };
}

/** Gespeicherte Sitzung tolerant lesen; Unbrauchbares → undefined. */
export function leseSitzung(raw: unknown): HeuteSitzung | undefined {
  if (!isObj(raw) || typeof raw.datum !== 'string' || !Array.isArray(raw.items)) return undefined;
  const items = raw.items.map(leseItem).filter((x): x is HeuteItem => x !== undefined);
  const index = typeof raw.index === 'number' && Number.isInteger(raw.index) ? Math.min(Math.max(raw.index, 0), items.length) : 0;
  const maxIndex =
    typeof raw.maxIndex === 'number' && Number.isInteger(raw.maxIndex) ? Math.min(Math.max(raw.maxIndex, index), items.length) : index;
  return {
    datum: raw.datum,
    items,
    index,
    maxIndex,
    erledigt: strings(raw.erledigt),
    uebersprungen: strings(raw.uebersprungen),
    frueher: strings(raw.frueher),
  };
}

// --- Speicher (localStorage, abgesichert) ---

let aktuell: HeuteSitzung | undefined;
let geladen = false;
const hoerer = new Set<() => void>();

function lade(): HeuteSitzung | undefined {
  try {
    const text = localStorage.getItem(HEUTE_SPEICHER);
    return text ? leseSitzung(JSON.parse(text)) : undefined;
  } catch {
    return undefined;
  }
}

export function holeSitzung(): HeuteSitzung | undefined {
  if (!geladen) {
    aktuell = lade();
    geladen = true;
  }
  return aktuell;
}

export function setzeSitzung(s: HeuteSitzung | undefined): void {
  aktuell = s;
  geladen = true;
  try {
    if (s) localStorage.setItem(HEUTE_SPEICHER, JSON.stringify(s));
    else localStorage.removeItem(HEUTE_SPEICHER);
  } catch {
    /* ohne Speicher gilt die Sitzung nur bis zum Neuladen */
  }
  for (const h of hoerer) h();
}

export function abonniereSitzung(h: () => void): () => void {
  hoerer.add(h);
  return () => hoerer.delete(h);
}

// --- „Schritt geschafft“ (Aufgabe gespeichert, Übung richtig gelöst): die HeuteLeiste führt dann von selbst zum nächsten Schritt ---

const fertigHoerer = new Set<(id: string) => void>();

/** Die Seite meldet: Aufgabe/Übung mit dieser ID ist erledigt. Ohne laufende Runde oder passenden Schritt geschieht nichts. */
export function meldeFertig(id: string): void {
  for (const h of fertigHoerer) h(id);
}

export function abonniereFertig(h: (id: string) => void): () => void {
  fertigHoerer.add(h);
  return () => fertigHoerer.delete(h);
}
