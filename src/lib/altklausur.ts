// „Altklausur“: Themen, Aufgaben und Karten, die aus dem Altklausur-Training stammen (Deep Dive 18 bis 33). Das Merkmal ist abgeleitet,
// nicht gespeichert: ein Thema, dessen Titel mit „Altklausur“ beginnt, und – für Karten außerhalb dieser Themen – das Tag `altklausur`.

import type { Flashcard, Task, Topic } from '../../shared/types';

/** Tag an Karten (z. B. Fachbegriffe), die in den Altklausuren vorkommen, aber zu einem anderen Thema gehören. */
export const ALTKLAUSUR_TAG = 'altklausur';

export const istAltklausurThema = (t: Pick<Topic, 'title'>): boolean => /^Altklausur/i.test(t.title);

/** Die Ids aller Altklausur-Themen. */
export const altklausurThemen = (topics: readonly Pick<Topic, 'id' | 'title'>[]): Set<string> =>
  new Set(topics.filter(istAltklausurThema).map((t) => t.id));

/** Gehört die Karte zum Altklausur-Training: Thema ist ein Altklausur-Thema oder die Karte trägt das Tag. */
export const istAltklausurKarte = (c: Pick<Flashcard, 'topicId' | 'tags'>, themen: ReadonlySet<string>): boolean =>
  (c.topicId !== undefined && themen.has(c.topicId)) || (c.tags?.includes(ALTKLAUSUR_TAG) ?? false);

/** Gehört die Aufgabe zu einer Altklausur-Übungsklausur. */
export const istAltklausurAufgabe = (t: Pick<Task, 'topicId'>, themen: ReadonlySet<string>): boolean => themen.has(t.topicId);
