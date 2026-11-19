// Reihenfolge der Einzelaufgaben und „Nächste Aufgabe“: reine Funktionen für Aufgabenregister (/aufgaben) und Einzelaufgabe
// (/aufgabe/:id). Im Altklausur-Modus (?altklausur=1) gehören nur Aufgaben der Altklausur-Themen zur Folge.

import type { Task, Topic } from '../../shared/types';
import { altklausurThemen, istAltklausurAufgabe } from './altklausur';

/** Alle Aufgaben: nach Thema (Reihenfolge der Themenliste), dann nach Aufgaben-Id (Zahlen als Zahlen). */
export function aufgabenGeordnet(topics: readonly Pick<Topic, 'id'>[], tasks: Readonly<Record<string, Task>>): Task[] {
  const topicOrder = new Map(topics.map((t, i) => [t.id, i]));
  return Object.values(tasks).sort(
    (a, b) => (topicOrder.get(a.topicId) ?? 0) - (topicOrder.get(b.topicId) ?? 0) || a.id.localeCompare(b.id, 'de', { numeric: true }),
  );
}

/** Die Aufgaben im gewählten Modus: alle oder nur die der Altklausur-Themen (geordnet wie `aufgabenGeordnet`). */
export function aufgabenImModus(
  topics: readonly Pick<Topic, 'id' | 'title'>[],
  tasks: Readonly<Record<string, Task>>,
  nurAltklausur: boolean,
): Task[] {
  const alle = aufgabenGeordnet(topics, tasks);
  if (!nurAltklausur) return alle;
  const themen = altklausurThemen(topics);
  return alle.filter((t) => istAltklausurAufgabe(t, themen));
}

/**
 * Die Aufgabe, die nach `aktuell` kommt: die nächste noch nicht bearbeitete (nach der aktuellen, danach von vorn); sind alle
 * bearbeitet, einfach die nächste der Folge. Ohne weitere Aufgabe (oder wenn `aktuell` nicht in der Folge steht) undefined.
 */
export function naechsteAufgabe(folge: readonly Pick<Task, 'id'>[], aktuell: string, bearbeitet: ReadonlySet<string>): string | undefined {
  const i = folge.findIndex((t) => t.id === aktuell);
  if (i < 0 || folge.length < 2) return undefined;
  const danach = [...folge.slice(i + 1), ...folge.slice(0, i)];
  return (danach.find((t) => !bearbeitet.has(t.id)) ?? danach[0]).id;
}
