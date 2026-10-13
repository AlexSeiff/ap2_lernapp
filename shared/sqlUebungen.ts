// Import der SQL-Übungsdatei (AP2_SQL_Uebungen.json): Übungsdatenbanken („datensaetze") und Aufgaben („uebungen").
// Tolerant wie der Lernkarten-Import: Fehlerhafte Einträge werden übersprungen und als ImportIssue gemeldet.

import { z } from 'zod';
import { topicFromSource } from './lernkarten';
import type { Content, ImportIssue, SqlDataset, SqlExercise } from './types';

export interface ParsedSqlUebungen {
  datasets: SqlDataset[];
  exercises: SqlExercise[];
  issues: ImportIssue[];
}

const text = z.string().trim().min(1);
const optText = z
  .string()
  .nullish()
  .transform((s) => s?.trim() || undefined);

const datasetSchema = z.object({
  id: text,
  titel: text,
  quelle: z.string().default(''),
  beschreibung: optText,
  setup: text,
  variante: optText,
});

const exerciseSchema = z.object({
  id: text,
  datensatz: text,
  thema: z.string().default(''),
  titel: text,
  aufgabe: text,
  schwierigkeit: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  tags: z.array(z.string()).default([]),
  loesung: text,
  vergleich: z
    .object({
      reihenfolge: z.enum(['auto', 'streng', 'egal']).default('auto'),
      spaltennamen: z.array(text).optional(),
      toleranz: z.number().nonnegative().optional(),
    })
    .default({ reihenfolge: 'auto' }),
  pruefabfrage: optText,
  leerErlaubt: z.boolean().optional(),
  hinweise: z.array(z.string()).default([]),
  erklaerung: optText,
  quelle_aufgabe: optText,
  aufgaben: z.array(text).default([]),
  karten: z.array(text).default([]),
  teilaufgabe: z.boolean().optional(),
  spalten_frei: z.boolean().optional(),
});

/** Erste zod-Meldung als kurzer Text, z. B. „schwierigkeit: Invalid input". */
function describe(error: z.ZodError): string {
  const first = error.issues[0];
  if (!first) return 'ungültig';
  return first.path.length ? `${first.path.join('.')}: ${first.message}` : first.message;
}

function label(raw: unknown): string {
  const id = raw && typeof raw === 'object' ? (raw as { id?: unknown }).id : undefined;
  return typeof id === 'string' && id.trim() ? id.trim() : '?';
}

/**
 * Liest AP2_SQL_Uebungen.json. `topics` (Deep-Dive-ID → Titel) ordnet `thema` bzw. `quelle` einem Deep Dive zu,
 * genau wie bei den Lernkarten.
 */
export function parseSqlUebungen(fileName: string, json: string, topics: Map<string, string> = new Map()): ParsedSqlUebungen {
  const issues: ImportIssue[] = [];
  const result: ParsedSqlUebungen = { datasets: [], exercises: [], issues };
  const issue = (message: string) => issues.push({ file: fileName, message });

  let data: { datensaetze?: unknown; uebungen?: unknown };
  try {
    data = JSON.parse(json);
  } catch (e) {
    issue(`Ungültiges JSON: ${(e as Error).message}`);
    return result;
  }
  if (!data || typeof data !== 'object' || !Array.isArray(data.datensaetze)) {
    issue('Kein Feld „datensaetze" gefunden.');
    return result;
  }

  for (const raw of data.datensaetze) {
    const parsed = datasetSchema.safeParse(raw);
    if (!parsed.success) {
      issue(`Datensatz ${label(raw)} übersprungen (${describe(parsed.error)}).`);
      continue;
    }
    const d = parsed.data;
    if (result.datasets.some((x) => x.id === d.id)) {
      issue(`Doppelte Datensatz-ID ${d.id} übersprungen.`);
      continue;
    }
    result.datasets.push({ ...d, topicId: topicFromSource(d.quelle, d.titel, topics) });
  }

  if (!Array.isArray(data.uebungen)) {
    issue('Kein Feld „uebungen" gefunden.');
    return result;
  }
  const datasetIds = new Set(result.datasets.map((d) => d.id));
  const seen = new Set<string>();
  for (const raw of data.uebungen) {
    const parsed = exerciseSchema.safeParse(raw);
    if (!parsed.success) {
      issue(`Übung ${label(raw)} übersprungen (${describe(parsed.error)}).`);
      continue;
    }
    const { quelle_aufgabe, aufgaben, karten, teilaufgabe, spalten_frei, ...u } = parsed.data;
    if (seen.has(u.id)) {
      issue(`Doppelte Übungs-ID ${u.id} übersprungen.`);
      continue;
    }
    if (!datasetIds.has(u.datensatz)) {
      issue(`Übung ${u.id}: unbekannter Datensatz „${u.datensatz}" – übersprungen.`);
      continue;
    }
    seen.add(u.id);
    if (!u.hinweise.length) issue(`Übung ${u.id}: keine Hinweise.`);
    if ((teilaufgabe || spalten_frei) && !aufgaben.length) issue(`Übung ${u.id}: „teilaufgabe“/„spalten_frei“ gelten nur mit „aufgaben“.`);
    result.exercises.push({
      ...u,
      topicId: topicFromSource(u.thema, u.titel, topics),
      leerErlaubt: u.leerErlaubt || undefined,
      quelleAufgabe: quelle_aufgabe,
      ...(aufgaben.length ? { aufgaben } : {}),
      ...(karten.length ? { karten } : {}),
      ...(teilaufgabe ? { teilaufgabe } : {}),
      ...(spalten_frei ? { spaltenFrei: true } : {}),
    });
  }
  return result;
}

/**
 * Verknüpft SQL-Übungen mit Aufgaben aus den Lernblättern (`aufgaben` → Task.sqlUebung: dort wird im SQL-Editor geantwortet)
 * und mit Karteikarten (`karten` → Flashcard.sqlUebungen: Link „Im SQL-Editor üben“). Unbekannte ids und Aufgaben, die
 * mehreren Übungen zugeordnet sind, werden als ImportIssue gemeldet und nicht verknüpft. Ändert `content` direkt.
 */
export function verknuepfeSqlUebungen(content: Pick<Content, 'tasks' | 'flashcards' | 'sqlExercises'>, fileName: string): ImportIssue[] {
  const issues: ImportIssue[] = [];
  const cards = new Map(content.flashcards.map((c) => [c.id, c]));
  for (const ex of content.sqlExercises) {
    for (const taskId of ex.aufgaben ?? []) {
      const task = content.tasks[taskId];
      if (!task) issues.push({ file: fileName, message: `Übung ${ex.id}: unbekannte Aufgabe „${taskId}“ in „aufgaben“.` });
      else if (task.sqlUebung)
        issues.push({ file: fileName, message: `Übung ${ex.id}: Aufgabe ${taskId} ist schon mit ${task.sqlUebung} verknüpft.` });
      else task.sqlUebung = ex.id;
    }
    for (const cardId of ex.karten ?? []) {
      const card = cards.get(cardId);
      if (!card) issues.push({ file: fileName, message: `Übung ${ex.id}: unbekannte Karte „${cardId}“ in „karten“.` });
      else if (!card.sqlUebungen?.includes(ex.id)) card.sqlUebungen = [...(card.sqlUebungen ?? []), ex.id];
    }
  }
  return issues;
}
