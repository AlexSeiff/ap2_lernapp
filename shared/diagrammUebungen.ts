// Diagramm-Übungen (Umsetzungsplan Phase 7, AP2_Diagramm_Uebungen.json): ein Diagramm-Gerüst mit leeren Slots und eine Palette mit
// Elementen (auch Ablenkern). Import mit Prüfung (wie die Rechenübungen: fehlerhafte Übungen werden übersprungen und gemeldet),
// Bewertung je Slot mit Lösungsvarianten und die Formregeln (EPK, BPMN, Aktivitätsdiagramm). Rein, ohne React.

import { z } from 'zod';
import type { ImportIssue } from './types';

export const DIAGRAMM_TYPEN = ['epk', 'bpmn', 'aktivitaet', 'sequenz', 'zustand', 'er', 'klasse', 'usecase'] as const;
export type DiagrammTyp = (typeof DIAGRAMM_TYPEN)[number];

export const DIAGRAMM_TYP_NAMEN: Record<DiagrammTyp, string> = {
  epk: 'EPK / eEPK',
  bpmn: 'BPMN 2.0',
  aktivitaet: 'Aktivitätsdiagramm',
  sequenz: 'Sequenzdiagramm',
  zustand: 'Zustandsdiagramm',
  er: 'ER-Modell',
  klasse: 'Klassendiagramm',
  usecase: 'Anwendungsfalldiagramm',
};

/** Formen der Knoten (gezeichnet von src/components/DiagrammSvg.tsx). */
export const FORMEN = [
  // EPK / eEPK
  'ereignis',
  'funktion',
  'xor',
  'and',
  'or',
  'org',
  'info',
  // BPMN
  'start',
  'zwischen',
  'ende',
  'task',
  'gw-xor',
  'gw-and',
  'gw-or',
  'pool',
  'lane',
  // UML
  'aktion',
  'entscheidung',
  'gabel',
  'startpunkt',
  'endpunkt',
  'ablaufende',
  'aufruf',
  'schwimmbahn',
  'zustand',
  'lebenslinie',
  'fragment',
  'notiz',
  // ER-Modell, Klassen- und Anwendungsfalldiagramm
  'entitaet',
  'beziehung',
  'attribut',
  'klasse',
  'akteur',
  'anwendungsfall',
  'systemgrenze',
  'text',
] as const;
export type Form = (typeof FORMEN)[number];

/** Arten von Kanten: Kontrollfluss, Nachricht (BPMN zwischen Pools), Zuordnung (eEPK), Nachrichten im Sequenzdiagramm, Transition. */
export const KANTEN_ARTEN = ['fluss', 'nachricht', 'zuordnung', 'sync', 'async', 'antwort', 'transition'] as const;
export type KantenArt = (typeof KANTEN_ARTEN)[number];

/** Formen, die eine Kante beschriften (Element einer Palette, das in einen Kanten-Slot gehört). */
export const KANTEN_FORMEN = ['sync', 'async', 'antwort', 'transition', 'beschriftung'] as const;
export type KantenForm = (typeof KANTEN_FORMEN)[number];

export interface DiagrammKnoten {
  id: string;
  /** Fehlt bei einem Slot: die Form kommt dann vom eingesetzten Element. */
  form?: Form;
  x: number;
  y: number;
  w: number;
  h: number;
  text?: string;
  /** Slot-ID: Hier wird ein Element der Palette eingesetzt. */
  slot?: string;
  /** BPMN-Ereignisse: Seite der Beschriftung (Standard unten), z. B. bei Grenzereignissen am Rand eines Tasks. */
  lage?: 'oben' | 'unten' | 'links' | 'rechts';
}

export interface DiagrammKante {
  von: string;
  nach: string;
  art: KantenArt;
  text?: string;
  /** Slot-ID für die Beschriftung bzw. (Sequenzdiagramm) die ganze Nachricht. */
  slot?: string;
  /** Sequenzdiagramm: Höhe der Nachricht (zwischen den Lebenslinien). */
  y?: number;
  /** Knickpunkte (x, y) zwischen Start und Ziel. */
  punkte?: [number, number][];
  /** Mittelpunkt der Beschriftung bzw. des Kanten-Slots (sonst: Mitte des längsten Abschnitts). */
  label?: [number, number];
}

export interface PalettenElement {
  id: string;
  form: Form | KantenForm;
  text: string;
  /** Darf in mehrere Slots (z. B. ein XOR-Konnektor). */
  mehrfach?: boolean;
}

/** Lösung: je Slot die erlaubten Elemente. */
export type Belegung = Record<string, string[]>;

export interface DiagrammUebung {
  id: string;
  typ: DiagrammTyp;
  /** 1 = Lücken füllen, 2 = Ablauf ordnen. */
  stufe: 1 | 2;
  titel: string;
  szenario: string;
  breite: number;
  hoehe: number;
  knoten: DiagrammKnoten[];
  kanten: DiagrammKante[];
  palette: PalettenElement[];
  loesung: Belegung;
  /** Weitere vollständig richtige Lösungen (z. B. parallele Zweige vertauscht). */
  varianten: Belegung[];
  hinweise: string[];
  erklaerung?: string;
  quelle?: string;
  tags: string[];
}

// ---------- Import ----------

const text = z.string().trim().min(1);
const optText = z
  .string()
  .nullish()
  .transform((s) => s?.trim() || undefined);
const zahl = z.number().finite();
const ids = z.union([text.transform((s) => [s]), z.array(text).min(1)]);
const belegung = z.record(z.string(), ids);

const knotenSchema = z.object({
  id: text,
  form: z.enum(FORMEN).optional(),
  x: zahl,
  y: zahl,
  w: z.number().positive(),
  h: z.number().positive(),
  text: optText,
  slot: optText,
  lage: z.enum(['oben', 'unten', 'links', 'rechts']).optional(),
});

const kanteSchema = z.object({
  von: text,
  nach: text,
  art: z.enum(KANTEN_ARTEN).default('fluss'),
  text: optText,
  slot: optText,
  y: zahl.optional(),
  punkte: z.array(z.tuple([zahl, zahl])).optional(),
  label: z.tuple([zahl, zahl]).optional(),
});

const uebungSchema = z.object({
  id: text,
  typ: z.enum(DIAGRAMM_TYPEN),
  stufe: z.union([z.literal(1), z.literal(2)]),
  titel: text,
  szenario: text,
  breite: z.number().positive().max(2000),
  hoehe: z.number().positive().max(3000),
  knoten: z.array(knotenSchema).min(1),
  kanten: z.array(kanteSchema).default([]),
  palette: z
    .array(z.object({ id: text, form: z.enum([...FORMEN, ...KANTEN_FORMEN]), text: text, mehrfach: z.boolean().optional() }))
    .min(2),
  loesung: belegung,
  varianten: z.array(belegung).default([]),
  hinweise: z.array(z.string()).default([]),
  erklaerung: optText,
  quelle: optText,
  tags: z.array(z.string()).default([]),
});

/** Alle Slot-IDs einer Übung in Lesereihenfolge (Knoten, dann Kanten). */
export function slotsVon(u: Pick<DiagrammUebung, 'knoten' | 'kanten'>): string[] {
  return [...u.knoten.flatMap((k) => (k.slot ? [k.slot] : [])), ...u.kanten.flatMap((k) => (k.slot ? [k.slot] : []))];
}

/** Inhaltliche Prüfung: ids eindeutig, Kanten verbinden vorhandene Knoten, jeder Slot hat eine Lösung aus der Palette. */
export function pruefeDiagrammUebung(u: DiagrammUebung): string[] {
  const fehler: string[] = [];
  const knotenIds = new Set<string>();
  for (const k of u.knoten) {
    if (knotenIds.has(k.id)) fehler.push(`Knoten ${k.id} doppelt`);
    knotenIds.add(k.id);
    if (!k.form && !k.slot) fehler.push(`Knoten ${k.id}: weder Form noch Slot`);
    if (k.x < 0 || k.y < 0 || k.x + k.w > u.breite || k.y + k.h > u.hoehe) fehler.push(`Knoten ${k.id} liegt außerhalb der Fläche`);
  }
  for (const k of u.kanten) {
    if (!knotenIds.has(k.von) || !knotenIds.has(k.nach)) fehler.push(`Kante ${k.von} → ${k.nach}: Knoten fehlt`);
  }
  const slots = slotsVon(u);
  if (!slots.length) fehler.push('keine Slots');
  if (new Set(slots).size !== slots.length) fehler.push('Slot-IDs doppelt');
  const palette = new Map(u.palette.map((p) => [p.id, p]));
  if (palette.size !== u.palette.length) fehler.push('Paletten-IDs doppelt');
  for (const [name, b] of [['loesung', u.loesung] as const, ...u.varianten.map((v, i) => [`variante ${i + 1}`, v] as const)]) {
    for (const s of slots) if (!b[s]?.length) fehler.push(`${name}: Slot ${s} ohne Lösung`);
    for (const [s, erlaubt] of Object.entries(b)) {
      if (!slots.includes(s)) fehler.push(`${name}: unbekannter Slot ${s}`);
      for (const id of erlaubt) if (!palette.has(id)) fehler.push(`${name}: Element ${id} fehlt in der Palette`);
    }
  }
  // Knoten-Slots brauchen Knotenformen, Kanten-Slots Kantenformen.
  const kantenSlots = new Set(u.kanten.flatMap((k) => (k.slot ? [k.slot] : [])));
  for (const [s, erlaubt] of Object.entries(u.loesung)) {
    for (const id of erlaubt) {
      const p = palette.get(id);
      if (!p) continue;
      const istKante = (KANTEN_FORMEN as readonly string[]).includes(p.form);
      if (kantenSlots.has(s) !== istKante) fehler.push(`Slot ${s}: Element ${id} passt nicht (Knoten/Kante)`);
    }
  }
  // Ablenker müssen nicht verwendet werden – aber jede Lösung muss sich ohne Doppelbelegung erreichen lassen.
  const einfach = (b: Belegung) =>
    Object.values(b)
      .filter((e) => e.length === 1 && !palette.get(e[0])?.mehrfach)
      .map((e) => e[0]);
  for (const b of [u.loesung, ...u.varianten]) {
    const eindeutig = einfach(b);
    if (new Set(eindeutig).size !== eindeutig.length) fehler.push('ein einfaches Element ist in der Lösung mehrfach eingeplant');
  }
  return fehler;
}

/** Erste zod-Meldung als kurzer Text. */
function describe(error: z.ZodError): string {
  const first = error.issues[0];
  if (!first) return 'ungültig';
  return first.path.length ? `${first.path.join('.')}: ${first.message}` : first.message;
}

export function parseDiagrammUebungen(fileName: string, raw: string): { uebungen: DiagrammUebung[]; issues: ImportIssue[] } {
  const issues: ImportIssue[] = [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { uebungen: [], issues: [{ file: fileName, message: `Kein gültiges JSON: ${e instanceof Error ? e.message : String(e)}` }] };
  }
  const liste = (data as { uebungen?: unknown })?.uebungen;
  if (!Array.isArray(liste)) return { uebungen: [], issues: [{ file: fileName, message: 'Feld „uebungen“ fehlt.' }] };
  const uebungen: DiagrammUebung[] = [];
  const gesehen = new Set<string>();
  liste.forEach((roh, i) => {
    const r = uebungSchema.safeParse(roh);
    const name = (roh as { id?: unknown })?.id ?? `Nr. ${i + 1}`;
    if (!r.success) {
      issues.push({ file: fileName, message: `Diagramm-Übung ${String(name)} übersprungen: ${describe(r.error)}` });
      return;
    }
    const u = r.data as DiagrammUebung;
    const fehler = pruefeDiagrammUebung(u);
    if (gesehen.has(u.id)) fehler.unshift('ID doppelt');
    if (fehler.length) {
      issues.push({ file: fileName, message: `Diagramm-Übung ${u.id} übersprungen: ${fehler.slice(0, 3).join('; ')}` });
      return;
    }
    gesehen.add(u.id);
    uebungen.push(u);
  });
  return { uebungen, issues };
}

// ---------- Bewertung ----------

/** Eingesetzte Elemente: Slot-ID → Paletten-ID. */
export type Eingesetzt = Record<string, string>;

export interface DiagrammErgebnis {
  /** Je Slot richtig oder falsch (nicht belegt = falsch). */
  slots: Record<string, boolean>;
  richtig: number;
  gesamt: number;
  /** Alles richtig. */
  ok: boolean;
  /** Die Lösung, an der gemessen wurde (die mit den meisten Treffern). */
  vergleich: Belegung;
}

/** Bewertet je Slot gegen die Lösung und alle Varianten; zählt die Variante mit den meisten Treffern. */
export function bewerteDiagramm(u: DiagrammUebung, eingesetzt: Eingesetzt): DiagrammErgebnis {
  const slots = slotsVon(u);
  let beste: { slots: Record<string, boolean>; richtig: number; vergleich: Belegung } | undefined;
  for (const b of [u.loesung, ...u.varianten]) {
    const je = Object.fromEntries(slots.map((s) => [s, !!eingesetzt[s] && (b[s] ?? []).includes(eingesetzt[s])]));
    const richtig = Object.values(je).filter(Boolean).length;
    if (!beste || richtig > beste.richtig) beste = { slots: je, richtig, vergleich: b };
  }
  return { ...beste!, gesamt: slots.length, ok: beste!.richtig === slots.length };
}

/** Musterlösung als Belegung (je Slot das erste erlaubte Element), z. B. für „Lösung zeigen“. */
export function musterBelegung(u: DiagrammUebung): Eingesetzt {
  return Object.fromEntries(slotsVon(u).map((s) => [s, u.loesung[s][0]]));
}

// ---------- Formregeln ----------

/** Die Form eines Knotens nach dem Einsetzen (fester Knoten oder eingesetztes Element). */
export function formVon(u: DiagrammUebung, k: DiagrammKnoten, eingesetzt: Eingesetzt): Form | undefined {
  if (k.form) return k.form;
  const id = k.slot ? eingesetzt[k.slot] : undefined;
  const p = id ? u.palette.find((x) => x.id === id) : undefined;
  return p && (FORMEN as readonly string[]).includes(p.form) ? (p.form as Form) : undefined;
}

const VERZWEIGUNG: Partial<Record<Form, string>> = {
  xor: 'xor',
  and: 'and',
  or: 'or',
  'gw-xor': 'xor',
  'gw-and': 'and',
  'gw-or': 'or',
  entscheidung: 'entscheidung',
  gabel: 'gabel',
};
const VERZWEIGUNG_NAME: Record<string, string> = {
  xor: 'XOR',
  and: 'AND',
  or: 'OR',
  entscheidung: 'Entscheidung (Raute)',
  gabel: 'Gabelung (Balken)',
};

/**
 * Formregeln, die die Belegung verletzt (Hinweise beim Prüfen). Geprüft wird nur, was eingesetzt ist:
 * - EPK: Ereignis und Funktion wechseln sich ab (Konnektoren dazwischen zählen nicht); nach einem Ereignis kein XOR-/OR-Split;
 *   Anfang und Ende sind Ereignisse.
 * - EPK, BPMN, Aktivitätsdiagramm: Eine Verzweigung wird mit demselben Typ zusammengeführt.
 */
export function formregeln(u: DiagrammUebung, eingesetzt: Eingesetzt): string[] {
  const form = new Map(u.knoten.map((k) => [k.id, formVon(u, k, eingesetzt)]));
  const fluss = u.kanten.filter((k) => k.art === 'fluss');
  const raus = (id: string) => fluss.filter((k) => k.von === id).map((k) => k.nach);
  const rein = (id: string) => fluss.filter((k) => k.nach === id).map((k) => k.von);
  const meldungen = new Set<string>();

  if (u.typ === 'epk') {
    const istKonnektor = (f?: Form) => f === 'xor' || f === 'and' || f === 'or';
    // Nächste Ereignisse/Funktionen hinter einem Knoten (durch Konnektoren hindurch).
    const naechste = (id: string, besucht = new Set<string>()): string[] =>
      raus(id).flatMap((n) => {
        if (besucht.has(n)) return [];
        besucht.add(n);
        return istKonnektor(form.get(n)) ? naechste(n, besucht) : [n];
      });
    for (const k of u.knoten) {
      const f = form.get(k.id);
      if (f !== 'ereignis' && f !== 'funktion') continue;
      for (const n of naechste(k.id)) {
        if (form.get(n) === f) meldungen.add('Ereignis und Funktion wechseln sich ab – zwei gleiche hintereinander sind nicht erlaubt.');
      }
      if (f === 'ereignis') {
        for (const n of raus(k.id)) {
          const g = form.get(n);
          if ((g === 'xor' || g === 'or') && raus(n).length > 1) {
            meldungen.add(
              'Nach einem Ereignis darf kein XOR- oder OR-Split folgen – ein Ereignis kann nicht entscheiden, das tut die Funktion davor.',
            );
          }
        }
      }
      if (
        (rein(k.id).length === 0 || raus(k.id).length === 0) &&
        f === 'funktion' &&
        fluss.some((e) => e.von === k.id || e.nach === k.id)
      ) {
        meldungen.add('Eine EPK beginnt und endet mit einem Ereignis.');
      }
    }
  }

  if (u.typ === 'epk' || u.typ === 'bpmn' || u.typ === 'aktivitaet') {
    // Zusammenführung (mehrere Eingänge) rückwärts verfolgen bis zur ersten Verzweigung (mehrere Ausgänge).
    const splitDavor = (id: string, besucht = new Set<string>()): string | undefined => {
      for (const v of rein(id)) {
        if (besucht.has(v)) continue;
        besucht.add(v);
        const t = VERZWEIGUNG[form.get(v) as Form];
        if (t && raus(v).length > 1) return t;
        const weiter = splitDavor(v, besucht);
        if (weiter) return weiter;
      }
      return undefined;
    };
    for (const k of u.knoten) {
      const t = VERZWEIGUNG[form.get(k.id) as Form];
      if (!t || rein(k.id).length < 2) continue;
      const s = splitDavor(k.id);
      if (s && s !== t) {
        meldungen.add(
          `Eine Verzweigung wird mit demselben Typ zusammengeführt: ${VERZWEIGUNG_NAME[s]} geöffnet, aber ${VERZWEIGUNG_NAME[t]} geschlossen.` +
            (s === 'xor' && t === 'and' ? ' Der AND-Join wartet auf einen Pfad, der nie kommt (Deadlock).' : ''),
        );
      }
    }
  }
  return [...meldungen];
}
