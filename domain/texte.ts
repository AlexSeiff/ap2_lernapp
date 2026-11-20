// Lernblatt-Texte getrennt vom Kern (Umsetzungsplan Phase 10): Die Abschnittstexte machen gut ein Drittel des Inhalts aus, gebraucht
// werden sie aber nur auf der Lernblatt-Seite, im Glossar, auf Begriffsseiten und in der Suche. content.json enthält
// deshalb nur den Kern (Abschnitte ohne Text); die Texte liegen je Thema in texte/<id>.json und werden nachgeladen.
// Rein, ohne Dateizugriff; getestet in tests/texte.test.ts.

import type { Content, Flashcard, Section, Task, Topic } from './types.ts';

/** Abschnitt ohne Text – so steht er im Kern. */
export type SectionKopf = Omit<Section, 'markdown'>;
export type KernTopic = Omit<Topic, 'sections'> & { sections: SectionKopf[] };
/** Inhalt ohne Abschnittstexte (content.json). Ein vollständiger `Content` ist auch ein `KernInhalt`. */
export type KernInhalt = Omit<Content, 'topics'> & { topics: KernTopic[] };

/** Texte eines Themas: Abschnitts-id → Markdown. */
export type ThemaTexte = Record<string, string>;

// ── Start und Details ──────────────────────────────────────────────
// Die Übersicht braucht von Karten und Aufgaben nur Kopfdaten (id, Thema, Deck, Punkte …). Fragen, Antworten, Aufgabentexte und
// Musterlösungen machen rund zwei Drittel von content.json aus; sie liegen deshalb in details.json und werden nachgeladen,
// sobald eine andere Seite als die Übersicht sie braucht (src/lib/details.tsx).

// Auch Schlagwörter und Verweise der Karten: Die Übersicht zählt nur nach Thema, Deck, Art und Typ.
const KARTEN_TEXT = [
  'question',
  'answer',
  'mc',
  'diagramm',
  'rechenweg',
  'tags',
  'abgrenzung',
  'siehe',
  'abschnitt',
  'sqlUebungen',
] as const;
const AUFGABEN_TEXT = ['markdown', 'solution', 'auto'] as const;

/** Textfelder einer Karte (details.json). */
export type KartenText = Pick<Flashcard, (typeof KARTEN_TEXT)[number]>;
/** Karte ohne Texte – so steht sie in content.json. */
export type KartenKopf = Omit<Flashcard, (typeof KARTEN_TEXT)[number]>;
/** Textfelder einer Aufgabe (details.json). */
export type AufgabenText = Pick<Task, (typeof AUFGABEN_TEXT)[number]>;
/** Aufgabe ohne Texte – so steht sie in content.json. */
export type AufgabenKopf = Omit<Task, (typeof AUFGABEN_TEXT)[number]>;

/** content.json: Kern ohne die Texte der Karten und Aufgaben. Ein `KernInhalt` ist auch ein `StartInhalt`. */
export type StartInhalt = Omit<KernInhalt, 'flashcards' | 'tasks'> & { flashcards: KartenKopf[]; tasks: Record<string, AufgabenKopf> };

/** details.json: Texte der Karten und Aufgaben, je id. */
export interface Details {
  karten: Record<string, KartenText>;
  aufgaben: Record<string, AufgabenText>;
}

function trenne<T extends object, K extends keyof T>(objekt: T, felder: readonly K[]): { kopf: Omit<T, K>; text: Pick<T, K> } {
  const kopf = { ...objekt } as Record<string, unknown>;
  const text: Record<string, unknown> = {};
  for (const f of felder) {
    if (f in objekt) text[f as string] = objekt[f];
    delete kopf[f as string];
  }
  return { kopf: kopf as Omit<T, K>, text: text as Pick<T, K> };
}

/** Teilt den Inhalt in Start (content.json), Details und Texte je Thema (Build und Entwicklungsserver). Das Original bleibt unverändert. */
export function teileInhalt(content: Content): { kern: StartInhalt; details: Details; texte: Record<string, ThemaTexte> } {
  const texte: Record<string, ThemaTexte> = {};
  const topics = content.topics.map((t) => {
    texte[t.id] = Object.fromEntries(t.sections.map((s) => [s.id, s.markdown]));
    return { ...t, sections: t.sections.map(({ markdown: _markdown, ...kopf }) => kopf) };
  });
  const details: Details = { karten: {}, aufgaben: {} };
  const flashcards = content.flashcards.map((karte) => {
    const { kopf, text } = trenne(karte, KARTEN_TEXT);
    details.karten[karte.id] = text;
    return kopf;
  });
  const tasks: Record<string, AufgabenKopf> = {};
  for (const [id, aufgabe] of Object.entries(content.tasks)) {
    const { kopf, text } = trenne(aufgabe, AUFGABEN_TEXT);
    details.aufgaben[id] = text;
    tasks[id] = kopf;
  }
  return { kern: { ...content, topics, flashcards, tasks }, details, texte };
}

/** Sind die Texte der Karten und Aufgaben schon da? So ist es in Tests oder nach dem Zusammensetzen. */
export const hatDetails = (c: StartInhalt): c is KernInhalt =>
  c.flashcards.every((k) => typeof (k as Partial<Flashcard>).question === 'string') &&
  Object.values(c.tasks).every((t) => typeof (t as Partial<Task>).markdown === 'string');

/** Setzt die Texte der Karten und Aufgaben ein. Fehlt einer (Start und Details aus verschiedenen Ständen), gibt es einen Fehler. */
export function inhaltMitDetails(start: StartInhalt, details: Details): KernInhalt {
  const fehlt = (was: string, id: string): never => {
    throw new Error(`Text zu ${was} ${id} fehlt – bitte die Seite neu laden.`);
  };
  const flashcards = start.flashcards.map((k) => ({ ...k, ...(details.karten[k.id] ?? fehlt('Karte', k.id)) }) as Flashcard);
  const tasks: Record<string, Task> = {};
  for (const [id, t] of Object.entries(start.tasks)) tasks[id] = { ...t, ...(details.aufgaben[id] ?? fehlt('Aufgabe', id)) } as Task;
  return { ...start, flashcards, tasks };
}

/** Hat jeder Abschnitt dieses Themas seinen Text? */
export const themaHatTexte = (t: KernTopic): t is Topic => t.sections.every((s) => typeof (s as Partial<Section>).markdown === 'string');

/** Ist das ein vollständiger Inhalt (alle Texte da)? So ist es z. B. in Tests oder nach dem Zusammensetzen. */
export const istVoll = (c: KernInhalt): c is Content => c.topics.every(themaHatTexte);

/** Setzt die Texte eines Themas ein. Fehlt ein Text (Kern und Texte aus verschiedenen Ständen), gibt es einen Fehler statt leerer Abschnitte. */
export function themaMitTexten(t: KernTopic, texte: ThemaTexte): Topic {
  return {
    ...t,
    sections: t.sections.map((s) => {
      const markdown = texte[s.id];
      if (typeof markdown !== 'string') throw new Error(`Text zu Abschnitt ${s.id} fehlt – bitte die Seite neu laden.`);
      return { ...s, markdown };
    }),
  };
}

/** Setzt alle Texte ein (`texte` je Thema-id). */
export function inhaltMitTexten(kern: KernInhalt, texte: Record<string, ThemaTexte>): Content {
  return { ...kern, topics: kern.topics.map((t) => (themaHatTexte(t) ? t : themaMitTexten(t, texte[t.id] ?? {}))) };
}
