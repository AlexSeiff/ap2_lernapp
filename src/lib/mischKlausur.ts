// Gemischte Probeklausur (ROADMAP 8.5): 90 Minuten über mehrere Deep Dives, aufgebaut wie die schriftlichen AP2-Bereiche
// „Durchführen einer Prozessanalyse“ (Themenblock A) und „Sicherstellen der Datenqualität“ (Themenblock B) der Themenliste.
// Rein (ohne React): gleicher Inhalt + gleicher Seed → gleiche Klausur. Die ID der Klausur („mix-<bereich>-<seed>“) steht in
// ExamRun.topicId, so lässt sich die Klausur jederzeit (auch nach einem Neuladen) wieder aufbauen.
//
// Aufbau:
// 1. Gewichte: je Unterbereich (A1–A4, B1–B4) die Zahl der Checklistenpunkte („- [ ]“) unter „### A1 …“ in der Themenliste
//    (MaterialDoc „themenliste-beispielfragen“); fehlt die Datei, gelten die Zahlen von Oktober 2026 (FALLBACK_GEWICHTE).
// 2. Zielpunkte je Unterbereich: 100 Punkte nach Gewicht verteilt (größter Rest).
// 3. Je Unterbereich ein Block der neuen Klausur. Er wird aus Blöcken der Übungsklausuren der zugeordneten Deep Dives gefüllt
//    (UNTERBEREICHE): Blöcke gemischt, je Block der längste Anfang (A1, A1+A2, …), der noch in die Zielpunkte passt. Nur Anfänge,
//    weil spätere Aufgaben eines Blocks oft auf frühere aufbauen („mit deinem Ergebnis aus C1 …“). Einleitung und Anlagen
//    des Blocks bzw. Deep Dives kommen mit.
// 4. Bleiben insgesamt Punkte offen, füllt ein zweiter Durchgang mit weiteren Anfängen (erst im selben Unterbereich, dann in allen),
//    bis 100 erreicht sind oder nichts mehr passt. Nie über 100 Punkte, keine Aufgabe doppelt.

import type { Exam, ExamBlock, MaterialDoc, Section, Task, Topic } from '../../shared/types';
import { erzeugeZufall } from '../rechnen/zufall';
import type { KernInhalt, KernTopic } from '../../shared/texte';

export type MischBereich = 'prozess' | 'qualitaet' | 'gemischt';

export const MISCH_BEREICHE: { id: MischBereich; titel: string; kurz: string }[] = [
  { id: 'gemischt', titel: 'Beide Bereiche gemischt', kurz: 'gemischt' },
  { id: 'prozess', titel: 'Durchführen einer Prozessanalyse', kurz: 'Prozessanalyse' },
  { id: 'qualitaet', titel: 'Sicherstellen der Datenqualität', kurz: 'Datenqualität' },
];

/** Zielsumme der Probeklausur. */
export const MISCH_PUNKTE = 100;

/** Woher die Aufgaben eines Unterbereichs kommen: Deep Dive und (optional) nur bestimmte Blöcke seiner Übungsklausur. */
export interface MischQuelle {
  topicId: string;
  bloecke?: string[];
}

export interface Unterbereich {
  id: string;
  bereich: Exclude<MischBereich, 'gemischt'>;
  titel: string;
  quellen: MischQuelle[];
}

/**
 * Unterbereiche der Themenliste und die Blöcke der Übungsklausuren, die sie prüfen. WiSo (DD13/14, Altklausur-Training DD20, DD25, DD26) fehlt bewusst:
 * das ist ein eigener 60-Minuten-Teil mit gebundenen Aufgaben.
 */
export const UNTERBEREICHE: Unterbereich[] = [
  {
    id: 'A1',
    bereich: 'prozess',
    titel: 'Geschäftsprozesse & Prozessmodellierung',
    quellen: [
      { topicId: '05', bloecke: ['A', 'B', 'C'] },
      { topicId: '18', bloecke: ['B'] },
      { topicId: '21', bloecke: ['A', 'B'] },
      { topicId: '22', bloecke: ['B', 'C'] },
    ],
  },
  {
    id: 'A2',
    bereich: 'prozess',
    titel: 'Anforderungen & Projektmanagement',
    quellen: [
      { topicId: '12', bloecke: ['A', 'B', 'C'] },
      { topicId: '15', bloecke: ['D'] },
      { topicId: '18', bloecke: ['A'] },
      { topicId: '21', bloecke: ['C'] },
      { topicId: '22', bloecke: ['A'] },
    ],
  },
  {
    id: 'A3',
    bereich: 'prozess',
    titel: 'Wirtschaftlichkeit & Qualitätskontrolle',
    quellen: [
      { topicId: '12', bloecke: ['D'] },
      { topicId: '05', bloecke: ['D'] },
      { topicId: '16', bloecke: ['A', 'B', 'C'] },
      { topicId: '18', bloecke: ['C', 'D'] },
      { topicId: '21', bloecke: ['D'] },
      { topicId: '22', bloecke: ['D'] },
    ],
  },
  {
    id: 'A4',
    bereich: 'prozess',
    titel: 'Rechtliche Auswirkungen von Prozessänderungen',
    quellen: [
      { topicId: '10', bloecke: ['C'] },
    ],
  },
  {
    id: 'B1',
    bereich: 'qualitaet',
    titel: 'Daten identifizieren, klassifizieren, bereitstellen',
    quellen: [
      { topicId: '01' },
      { topicId: '00' },
      { topicId: '02' },
      { topicId: '08' },
      { topicId: '15', bloecke: ['A', 'B', 'C'] },
      { topicId: '19', bloecke: ['D'] },
      { topicId: '24', bloecke: ['B', 'C'] },
    ],
  },
  {
    id: 'B2',
    bereich: 'qualitaet',
    titel: 'Datenqualität prüfen und sicherstellen',
    quellen: [
      { topicId: '09' },
      { topicId: '03' },
      { topicId: '04' },
      { topicId: '06' },
      { topicId: '07' },
      { topicId: '11' },
      { topicId: '19', bloecke: ['A', 'B', 'C'] },
      { topicId: '23', bloecke: ['A', 'B'] },
      { topicId: '24', bloecke: ['A'] },
    ],
  },
  {
    id: 'B3',
    bereich: 'qualitaet',
    titel: 'Zugriff und Verfügbarkeit gewährleisten',
    quellen: [
      { topicId: '10', bloecke: ['D'] },
      { topicId: '16', bloecke: ['D'] },
      { topicId: '23', bloecke: ['C'] },
    ],
  },
  {
    id: 'B4',
    bereich: 'qualitaet',
    titel: 'Datenschutz & Datensicherheit',
    quellen: [
      { topicId: '10', bloecke: ['A', 'B', 'C'] },
      { topicId: '23', bloecke: ['D'] },
      { topicId: '24', bloecke: ['D'] },
    ],
  },
];

/** Checklistenpunkte je Unterbereich in der Themenliste (Stand Oktober 2026), falls die Datei fehlt. */
export const FALLBACK_GEWICHTE: Record<string, number> = { A1: 7, A2: 6, A3: 5, A4: 3, B1: 7, B2: 8, B3: 4, B4: 6 };

/** Gewichte aus der Themenliste: Anzahl „- [ ]“ unter jeder Überschrift „### A1 …“. Fehlende Unterbereiche → Fallback. */
export function gewichteAusThemenliste(markdown: string | undefined): Record<string, number> {
  const out: Record<string, number> = { ...FALLBACK_GEWICHTE };
  if (!markdown) return out;
  const gezaehlt: Record<string, number> = {};
  let aktuell: string | undefined;
  for (const line of markdown.split(/\r?\n/)) {
    const h = /^#{1,6}\s+([A-Z]\d)\b/.exec(line);
    if (h) {
      aktuell = h[1];
      continue;
    }
    if (/^#{1,6}\s/.test(line)) aktuell = undefined;
    else if (aktuell && /^\s*[-*]\s+\[[ xX]\]/.test(line)) gezaehlt[aktuell] = (gezaehlt[aktuell] ?? 0) + 1;
  }
  for (const u of UNTERBEREICHE) if (gezaehlt[u.id]) out[u.id] = gezaehlt[u.id];
  return out;
}

/** Die Themenliste unter den Materialien (ID aus dem Titel „Themenliste & Beispielfragen“). */
export const themenliste = (materials: MaterialDoc[]) => materials.find((m) => /themenliste/i.test(m.id) || /Themenliste/.test(m.file));

/** Verteilt `summe` ganzzahlig nach Gewichten (Verfahren des größten Restes; bei Gleichstand die frühere Position). */
export function verteile(gewichte: number[], summe: number): number[] {
  const gesamt = gewichte.reduce((s, g) => s + g, 0);
  if (gesamt <= 0) return gewichte.map(() => 0);
  const roh = gewichte.map((g) => (g / gesamt) * summe);
  const ganz = roh.map(Math.floor);
  let rest = summe - ganz.reduce((s, g) => s + g, 0);
  const reihenfolge = roh.map((r, i) => ({ i, rest: r - Math.floor(r) })).sort((a, b) => b.rest - a.rest || a.i - b.i);
  for (const { i } of reihenfolge) {
    if (rest <= 0) break;
    ganz[i]++;
    rest--;
  }
  return ganz;
}

/** Aufgaben aus einem Block einer Übungsklausur (ein Anfang des Blocks) mit der Einleitung des Blocks. */
export interface MischGruppe {
  topicId: string;
  /** Buchstabe des Blocks in der Übungsklausur des Deep Dives. */
  block: string;
  /** „Deep Dive 5 · Block C – Kennzahlen“. */
  quelle: string;
  intro: string;
  taskIds: string[];
  punkte: number;
}

/** Block der gemischten Klausur = ein Unterbereich der Themenliste. */
export interface MischBlock extends ExamBlock {
  unterbereich: string;
  gruppen: MischGruppe[];
}

export interface MischKlausur extends Exam {
  blocks: MischBlock[];
  bereich: MischBereich;
  seed: number;
  /** Zielpunkte je Unterbereich (nach Gewichten der Themenliste). */
  ziele: Record<string, number>;
}

const topicLabel = (t: Pick<Topic, 'id' | 'number'>) => (t.id === '00' ? 'SQL-Zusatz' : `Deep Dive ${t.number}`);

type Kandidat = { topic: KernTopic; block: ExamBlock; tasks: Task[] };

/** Alle Blöcke der Übungsklausuren, aus denen ein Unterbereich schöpfen darf (ohne leere). */
function kandidaten(content: KernInhalt, u: Unterbereich): Kandidat[] {
  const out: Kandidat[] = [];
  for (const q of u.quellen) {
    const topic = content.topics.find((t) => t.id === q.topicId);
    for (const block of topic?.exam?.blocks ?? []) {
      if (q.bloecke && !q.bloecke.includes(block.letter)) continue;
      const tasks = block.taskIds.map((id) => content.tasks[id]).filter((t): t is Task => !!t && t.points > 0);
      if (tasks.length) out.push({ topic: topic!, block, tasks });
    }
  }
  return out;
}

/** Längster Anfang der (noch freien) Aufgaben eines Blocks, der in `rest` Punkte passt. */
function anfang(tasks: Task[], benutzt: Set<string>, rest: number): Task[] {
  const out: Task[] = [];
  let summe = 0;
  for (const t of tasks) {
    if (benutzt.has(t.id)) break; // nur zusammenhängende Anfänge – nach einer verwendeten Aufgabe nicht weiter
    if (summe + t.points > rest) break;
    out.push(t);
    summe += t.points;
  }
  return out;
}

/** Freie Aufgaben eines Blocks ab der ersten unbenutzten (für den zweiten Durchgang: Fortsetzung eines schon begonnenen Blocks). */
const freieAb = (tasks: Task[], benutzt: Set<string>) => {
  const i = tasks.findIndex((t) => !benutzt.has(t.id));
  return i < 0 ? [] : tasks.slice(i).every((t) => !benutzt.has(t.id)) ? tasks.slice(i) : [];
};

export function mischId(bereich: MischBereich, seed: number): string {
  return `mix-${bereich}-${seed}`;
}

/** „mix-prozess-123“ → { bereich, seed }; sonst undefined (dann ist es die ID eines Deep Dives). */
export function parseMischId(id: string | undefined): { bereich: MischBereich; seed: number } | undefined {
  const m = /^mix-(prozess|qualitaet|gemischt)-(\d{1,10})$/.exec(id ?? '');
  if (!m) return undefined;
  const seed = Number(m[2]);
  return Number.isSafeInteger(seed) ? { bereich: m[1] as MischBereich, seed } : undefined;
}

export const istMischId = (id: string | undefined) => parseMischId(id) !== undefined;

export const bereichTitel = (b: MischBereich) => MISCH_BEREICHE.find((x) => x.id === b)!.titel;

/** Höchstens so viele Zusammenstellungen probiert baueMischKlausur, um genau MISCH_PUNKTE zu erreichen. */
export const MISCH_VERSUCHE = 8;

/**
 * Baut die gemischte Klausur. Reproduzierbar: gleicher Inhalt, Bereich und Seed → gleiche Aufgaben in gleicher Reihenfolge.
 * Probiert bis zu MISCH_VERSUCHE Zusammenstellungen (aus dem Seed abgeleitet) und nimmt die erste mit genau 100 Punkten,
 * sonst die mit den meisten Punkten (nie mehr als 100).
 */
export function baueMischKlausur(content: KernInhalt, bereich: MischBereich, seed: number): MischKlausur {
  let beste: MischKlausur | undefined;
  for (let v = 0; v < MISCH_VERSUCHE; v++) {
    const k = stelleZusammen(content, bereich, seed, (seed + Math.imul(v, 0x9e3779b1)) >>> 0);
    if (k.totalPoints === MISCH_PUNKTE) return k;
    if (!beste || k.totalPoints > beste.totalPoints) beste = k;
  }
  return beste!;
}

function stelleZusammen(content: KernInhalt, bereich: MischBereich, seed: number, zufallsSeed: number): MischKlausur {
  const zufall = erzeugeZufall(zufallsSeed);
  const unter = UNTERBEREICHE.filter((u) => bereich === 'gemischt' || u.bereich === bereich);
  const gewichte = gewichteAusThemenliste(themenliste(content.materials)?.markdown);
  const zielListe = verteile(
    unter.map((u) => gewichte[u.id] ?? 1),
    MISCH_PUNKTE,
  );
  const ziele = Object.fromEntries(unter.map((u, i) => [u.id, zielListe[i]]));
  const benutzt = new Set<string>();
  const gruppen = new Map<string, MischGruppe[]>(unter.map((u) => [u.id, []]));
  const gemischt = new Map(unter.map((u) => [u.id, zufall.mische(kandidaten(content, u))]));

  const nimm = (u: Unterbereich, k: Kandidat, tasks: Task[]) => {
    for (const t of tasks) benutzt.add(t.id);
    const liste = gruppen.get(u.id)!;
    const punkte = tasks.reduce((s, t) => s + t.points, 0);
    const vorhanden = liste.find((g) => g.topicId === k.topic.id && g.block === k.block.letter);
    if (vorhanden) {
      vorhanden.taskIds.push(...tasks.map((t) => t.id));
      vorhanden.punkte += punkte;
      return;
    }
    liste.push({
      topicId: k.topic.id,
      block: k.block.letter,
      quelle: `${topicLabel(k.topic)} · Block ${k.block.letter} – ${k.block.title}`,
      intro: k.block.intro,
      taskIds: tasks.map((t) => t.id),
      punkte,
    });
  };
  const summe = (id: string) => gruppen.get(id)!.reduce((s, g) => s + g.punkte, 0);

  // 1. Durchgang: je Unterbereich bis zu den Zielpunkten, nur ganz neue Blöcke (je Block ein Anfang).
  for (const u of unter) {
    for (const k of gemischt.get(u.id)!) {
      const rest = ziele[u.id] - summe(u.id);
      if (rest <= 0) break;
      if (k.tasks.some((t) => benutzt.has(t.id))) continue;
      const a = anfang(k.tasks, benutzt, rest);
      if (a.length) nimm(u, k, a);
    }
  }

  // 2. Durchgang: fehlende Punkte auffüllen, immer im Unterbereich, der am weitesten unter seinem Ziel liegt (so bleibt die
  //    Gewichtung erhalten); auch Fortsetzungen schon begonnener Blöcke. Je Schritt der Anfang, der der Lücke
  //    des Unterbereichs am nächsten kommt (höchstens bis 100 Punkte).
  const gesamt = () => unter.reduce((s, u) => s + summe(u.id), 0);
  const erschoepft = new Set<string>();
  while (MISCH_PUNKTE - gesamt() > 0 && erschoepft.size < unter.length) {
    const offen = MISCH_PUNKTE - gesamt();
    const u = unter.filter((x) => !erschoepft.has(x.id)).reduce((a, b) => (ziele[b.id] - summe(b.id) > ziele[a.id] - summe(a.id) ? b : a));
    const fehlt = Math.max(1, ziele[u.id] - summe(u.id));
    let best: { k: Kandidat; a: Task[]; p: number } | undefined;
    for (const k of gemischt.get(u.id)!) {
      const frei = freieAb(k.tasks, benutzt);
      // Fortsetzung nur, wenn der Block schon in diesem Unterbereich steht (sonst fehlte der Anfang).
      const begonnen = frei.length < k.tasks.length;
      if (begonnen && !gruppen.get(u.id)!.some((g) => g.topicId === k.topic.id && g.block === k.block.letter)) continue;
      const a = anfang(frei, benutzt, offen);
      const p = a.reduce((s, t) => s + t.points, 0);
      const besser =
        !best || Math.abs(p - fehlt) < Math.abs(best.p - fehlt) || (Math.abs(p - fehlt) === Math.abs(best.p - fehlt) && p > best.p);
      if (a.length && besser) best = { k, a, p };
    }
    if (best) nimm(u, best.k, best.a);
    else erschoepft.add(u.id);
  }

  const blocks: MischBlock[] = [];
  for (const u of unter) {
    const g = gruppen.get(u.id)!;
    if (!g.length) continue;
    const letter = String.fromCharCode(65 + blocks.length);
    blocks.push({
      letter,
      title: `${u.id} ${u.titel}`,
      points: g.reduce((s, x) => s + x.punkte, 0),
      intro: '',
      taskIds: g.flatMap((x) => x.taskIds),
      unterbereich: u.id,
      gruppen: g,
    });
  }

  // Anlagen und Ausgangslagen aller beteiligten Deep Dives, mit Herkunft im Titel.
  const themen = [...new Set(blocks.flatMap((b) => b.gruppen.map((g) => g.topicId)))];
  const attachments: Section[] = [];
  for (const id of themen) {
    const topic = content.topics.find((t) => t.id === id)!;
    const exam = topic.exam!;
    if (exam.intro.trim()) {
      attachments.push({ id: `${id}-mix-intro`, title: `${topicLabel(topic)}: Hinweise zur Klausur`, level: 2, markdown: exam.intro });
    }
    for (const a of exam.attachments) attachments.push({ ...a, title: `${topicLabel(topic)}: ${a.title}` });
  }

  const totalPoints = blocks.reduce((s, b) => s + b.points, 0);
  return {
    title: `Gemischte Probeklausur – ${bereichTitel(bereich)}`,
    intro:
      `Zusammengestellt aus den Übungsklausuren von ${themen.length} Deep Dives, gewichtet wie die Themenliste ` +
      `(Nr. ${seed}). 90 Minuten, ohne Unterlagen. Die Anlagen stehen beim jeweiligen Deep Dive.`,
    attachments,
    blocks,
    totalPoints,
    bereich,
    seed,
    ziele,
  };
}

/** Eine Klausur, egal ob die eines Deep Dives oder eine gemischte – das, was Klausurseite, Druck und Übersicht brauchen. */
export interface KlausurQuelle {
  /** Deep-Dive-ID oder „mix-…“ (steht in ExamRun.topicId). */
  id: string;
  exam: Exam | MischKlausur;
  /** Nur bei der Klausur eines Deep Dives. */
  topic?: KernTopic;
  /** Nur bei einer gemischten Klausur. */
  misch?: MischKlausur;
  untertitel: string;
}

export function klausurFuer(content: KernInhalt, id: string | undefined): KlausurQuelle | undefined {
  const m = parseMischId(id);
  if (m) {
    const misch = baueMischKlausur(content, m.bereich, m.seed);
    if (!misch.blocks.length) return undefined;
    return { id: id!, exam: misch, misch, untertitel: `${bereichTitel(m.bereich)} · Nr. ${m.seed}` };
  }
  const topic = content.topics.find((t) => t.id === id);
  if (!topic?.exam) return undefined;
  return { id: topic.id, exam: topic.exam, topic, untertitel: `Deep Dive ${topic.number}: ${topic.title}` };
}

/** Anzeigename einer Klausur aus der Historie (ExamRun.topicId) – ohne die gemischte Klausur aufzubauen. */
export function klausurName(content: KernInhalt, id: string): string {
  const m = parseMischId(id);
  if (m) return `Gemischt (${MISCH_BEREICHE.find((b) => b.id === m.bereich)!.kurz})`;
  return content.topics.find((t) => t.id === id)?.title ?? id;
}

/** Gruppen eines Blocks: bei gemischten Klausuren die Herkunft je Deep Dive, sonst eine Gruppe mit der Block-Einleitung. */
export function blockGruppen(block: ExamBlock | MischBlock): { quelle?: string; intro: string; taskIds: string[] }[] {
  return 'gruppen' in block ? block.gruppen : [{ intro: block.intro, taskIds: block.taskIds }];
}
