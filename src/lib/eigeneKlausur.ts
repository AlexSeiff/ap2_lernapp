// Eigene Klausur (Klausur-Builder, /klausur/bauen): Aufgaben aus allen Übungsklausuren selbst zusammenstellen – einzeln über die
// Suche oder automatisch aus gewählten Themen aufgefüllt. Wie bei der gemischten Probeklausur steckt die ganze Klausur in ihrer ID
// („bau-03-A1.03-A2.34-C3“, steht in ExamRun.topicId): Sie lässt sich nach dem Neuladen, in der Historie und im Druck wieder aufbauen,
// ohne dass sich das Format des Fortschritts ändert. Rein, ohne React.
//
// Aufbau der Klausur: Aufgaben, die aus demselben Block einer Übungsklausur stammen, bilden einen Block – in der Reihenfolge
// des Originals und mit dessen Einleitung (Handlungssituation, Material). Die Blöcke stehen in der Reihenfolge, in der ihre
// erste Aufgabe ausgewählt wurde. Die Bearbeitungszeit richtet sich nach den Punkten (90 Minuten je 100 Punkte).

import type { Exam, Section, Task } from '../../domain/types';
import type { KernInhalt } from '../../domain/texte';
import { erzeugeZufall } from '../rechnen/zufall';
import type { MischBlock } from './mischKlausur';

export const EIGENE_PREFIX = 'bau-';
/** Höchstens so viele Aufgaben in einer eigenen Klausur (die ID wird sonst unhandlich lang). */
export const EIGENE_MAX = 40;

export interface EigeneKlausur extends Exam {
  blocks: MischBlock[];
  eigene: true;
}

const ID_TEIL = /^[A-Za-z0-9_-]+$/;

export function eigeneId(taskIds: string[]): string {
  return EIGENE_PREFIX + taskIds.join('.');
}

/** „bau-03-A1.34-C3“ → ['03-A1', '34-C3']; keine eigene Klausur → undefined. */
export function parseEigeneId(id: string | undefined): string[] | undefined {
  if (!id?.startsWith(EIGENE_PREFIX)) return undefined;
  const ids = id.slice(EIGENE_PREFIX.length).split('.');
  if (!ids.length || ids.length > EIGENE_MAX || ids.some((x) => !ID_TEIL.test(x))) return undefined;
  return ids;
}

export const istEigeneId = (id: string | undefined) => parseEigeneId(id) !== undefined;

/** Bearbeitungszeit: 90 Minuten je 100 Punkte, auf 5 Minuten gerundet, mindestens 10. */
export const eigeneMinuten = (punkte: number) => Math.max(10, Math.round((punkte * 0.9) / 5) * 5);

const themaLabel = (content: KernInhalt, topicId: string) => {
  const t = content.topics.find((x) => x.id === topicId);
  return !t ? topicId : t.id === '00' ? 'SQL-Zusatz' : `Deep Dive ${t.number}`;
};

/** Block der Übungsklausur, aus dem eine Aufgabe stammt. */
function herkunft(content: KernInhalt, task: Task) {
  const topic = content.topics.find((t) => t.id === task.topicId);
  const block = topic?.exam?.blocks.find((b) => b.taskIds.includes(task.id));
  return { topic, block };
}

/** Baut die eigene Klausur aus den Aufgaben-IDs. Unbekannte IDs werden übergangen; ohne gültige Aufgabe gibt es keine Klausur. */
export function baueEigeneKlausur(content: KernInhalt, taskIds: string[]): EigeneKlausur | undefined {
  const tasks = [...new Set(taskIds)].map((id) => content.tasks[id]).filter((t): t is Task => !!t && t.points > 0);
  if (!tasks.length) return undefined;

  // Nach Herkunft gruppieren (Thema + Block), Reihenfolge der ersten Auswahl.
  const gruppen = new Map<string, Task[]>();
  for (const t of tasks) {
    const { block } = herkunft(content, t);
    const key = `${t.topicId}|${block?.letter ?? t.block}`;
    gruppen.set(key, [...(gruppen.get(key) ?? []), t]);
  }

  const blocks: MischBlock[] = [];
  for (const liste of gruppen.values()) {
    const { topic, block } = herkunft(content, liste[0]);
    const reihenfolge = block?.taskIds ?? [];
    liste.sort((a, b) => reihenfolge.indexOf(a.id) - reihenfolge.indexOf(b.id));
    const punkte = liste.reduce((s, t) => s + t.points, 0);
    const letter = String.fromCharCode(65 + blocks.length);
    const titel = block?.title ?? liste[0].block;
    blocks.push({
      letter,
      title: titel,
      points: punkte,
      intro: '',
      taskIds: liste.map((t) => t.id),
      unterbereich: '',
      gruppen: [
        {
          topicId: liste[0].topicId,
          block: block?.letter ?? liste[0].block,
          quelle: `${themaLabel(content, liste[0].topicId)}${topic ? ` (${topic.title})` : ''} · Block ${block?.letter ?? '?'} – ${titel}`,
          intro: block?.intro ?? '',
          taskIds: liste.map((t) => t.id),
          punkte,
        },
      ],
    });
  }

  // Ausgangssituation und Anlagen der beteiligten Übungsklausuren, mit Herkunft im Titel.
  const themen = [...new Set(tasks.map((t) => t.topicId))];
  const attachments: Section[] = [];
  for (const id of themen) {
    const exam = content.topics.find((t) => t.id === id)?.exam;
    if (!exam) continue;
    if (exam.intro.trim())
      attachments.push({
        id: `${id}-bau-intro`,
        title: `${themaLabel(content, id)}: Hinweise zur Klausur`,
        level: 2,
        markdown: exam.intro,
      });
    for (const a of exam.attachments) attachments.push({ ...a, title: `${themaLabel(content, id)}: ${a.title}` });
  }

  const totalPoints = blocks.reduce((s, b) => s + b.points, 0);
  return {
    title: `Eigene Klausur (${totalPoints} Punkte, ${eigeneMinuten(totalPoints)} Minuten)`,
    intro:
      `Selbst zusammengestellt: ${tasks.length} ${tasks.length === 1 ? 'Aufgabe' : 'Aufgaben'} aus ${themen.length} ` +
      `${themen.length === 1 ? 'Übungsklausur' : 'Übungsklausuren'}. Ohne Unterlagen; die Ausgangssituationen und Anlagen stehen beim jeweiligen Deep Dive.`,
    attachments,
    blocks,
    totalPoints,
    eigene: true,
  };
}

// ---------- Auswahl im Builder ----------

/** Aufgaben, die eine Klausur haben kann (mit Punkten, aus einer Übungsklausur). */
export function waehlbareAufgaben(content: KernInhalt): Task[] {
  const out: Task[] = [];
  for (const topic of content.topics)
    for (const block of topic.exam?.blocks ?? [])
      for (const id of block.taskIds) {
        const t = content.tasks[id];
        if (t && t.points > 0) out.push(t);
      }
  return out;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[*_`#>|]/g, ' ');

/** Suche: alle Wörter müssen im Aufgabentext, im Code, im Blocktitel oder im Thema vorkommen (ohne Groß/klein, ohne Umlautpunkte). */
export function sucheAufgaben(content: KernInhalt, suche: string, themaId?: string): Task[] {
  const woerter = norm(suche).split(/\s+/).filter(Boolean);
  return waehlbareAufgaben(content).filter((t) => {
    if (themaId && t.topicId !== themaId) return false;
    if (!woerter.length) return true;
    const { topic, block } = herkunft(content, t);
    const text = norm(`${t.id} ${t.markdown} ${block?.title ?? ''} ${topic?.title ?? ''}`);
    return woerter.every((w) => text.includes(w));
  });
}

/**
 * Bezieht sich die Aufgabe auf eine andere Aufgabe ihres Blocks, die nicht ausgewählt ist? („mit Ihrem Ergebnis aus C1“,
 * „siehe D2“). Dann fehlt in der eigenen Klausur der Zusammenhang – der Builder weist darauf hin.
 */
export function fehlendeBezuege(content: KernInhalt, task: Task, auswahl: Set<string>): string[] {
  const { block } = herkunft(content, task);
  if (!block) return [];
  const codes = new Map(block.taskIds.map((id) => [content.tasks[id]?.code, id]));
  const fehlend = new Set<string>();
  for (const m of task.markdown.matchAll(/\b([A-H]\d{1,2})\b/g)) {
    const id = codes.get(m[1]);
    if (id && id !== task.id && !auswahl.has(id)) fehlend.add(m[1]);
  }
  return [...fehlend];
}

/**
 * Füllt die Auswahl aus den gewählten Themen bis zu den Zielpunkten auf (nie darüber). Wie bei der gemischten Probeklausur
 * kommen nur zusammenhängende Anfänge eines Blocks (A1, A1+A2 …) bzw. die direkte Fortsetzung schon gewählter Aufgaben dazu,
 * weil spätere Aufgaben oft auf frühere aufbauen. Reproduzierbar über den Seed.
 */
export function fuelleAuf(content: KernInhalt, themen: string[], auswahl: string[], ziel: number, seed: number): string[] {
  const zufall = erzeugeZufall(seed);
  const benutzt = new Set(auswahl);
  const punkte = (id: string) => content.tasks[id]?.points ?? 0;
  let summe = auswahl.reduce((s, id) => s + punkte(id), 0);
  const neu: string[] = [];
  const nimm = (t: Task) => {
    benutzt.add(t.id);
    neu.push(t.id);
    summe += t.points;
  };
  const bloecke = zufall.mische(
    themen.flatMap((id) =>
      (content.topics.find((t) => t.id === id)?.exam?.blocks ?? []).map((b) =>
        b.taskIds.map((x) => content.tasks[x]).filter((t): t is Task => !!t && t.points > 0),
      ),
    ),
  );

  // 1. Unberührte Blöcke: längster Anfang, der noch passt.
  for (const tasks of bloecke) {
    if (summe >= ziel) break;
    if (tasks.some((t) => benutzt.has(t.id))) continue;
    for (const t of tasks) {
      if (summe + t.points > ziel) break;
      nimm(t);
    }
  }
  // 2. Begonnene Blöcke fortsetzen: direkt nach der letzten gewählten Aufgabe, solange es passt.
  for (const tasks of bloecke) {
    if (summe >= ziel) break;
    const letzte = tasks.map((t) => benutzt.has(t.id)).lastIndexOf(true);
    if (letzte < 0) continue;
    for (const t of tasks.slice(letzte + 1)) {
      if (benutzt.has(t.id) || summe + t.points > ziel) break;
      nimm(t);
    }
  }
  return [...auswahl, ...neu];
}

// ---------- Entwurf (nur dieser Browser) ----------

export interface BuilderEntwurf {
  auswahl: string[];
  themen: string[];
  ziel: number;
}

const ENTWURF_SPEICHER = 'ap2-klausur-entwurf';

export function leseBuilderEntwurf(): BuilderEntwurf | undefined {
  try {
    const roh = localStorage.getItem(ENTWURF_SPEICHER);
    const d = roh ? (JSON.parse(roh) as Partial<BuilderEntwurf>) : undefined;
    if (!d || !Array.isArray(d.auswahl) || !Array.isArray(d.themen)) return undefined;
    return {
      auswahl: d.auswahl.filter((x): x is string => typeof x === 'string'),
      themen: d.themen.filter((x): x is string => typeof x === 'string'),
      ziel: typeof d.ziel === 'number' && d.ziel > 0 ? d.ziel : 100,
    };
  } catch {
    return undefined;
  }
}

export function schreibeBuilderEntwurf(e: BuilderEntwurf) {
  try {
    localStorage.setItem(ENTWURF_SPEICHER, JSON.stringify(e));
  } catch {
    // Speicher gesperrt: dann ohne Entwurf.
  }
}
