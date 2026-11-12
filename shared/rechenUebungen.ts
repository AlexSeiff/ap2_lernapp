// Import der Rechenübungen (AP2_Rechen_Uebungen.json). Tolerant wie der SQL-Import: Fehlerhafte Übungen werden
// übersprungen und als ImportIssue gemeldet. Ob Vorlage, Daten und Eingaben zusammenpassen, prüft eine optionale
// Funktion `pruefe` (src/rechnen/pruefen.ts) – shared/ kennt die Rechenvorlagen selbst nicht.

import { z } from 'zod';
import { topicFromSource } from './lernkarten.ts';
import type { ImportIssue, RechenEingabe, RechenUebung } from './types.ts';

export interface ParsedRechenUebungen {
  exercises: RechenUebung[];
  issues: ImportIssue[];
}

/** Prüft eine gelesene Übung gegen ihre Vorlage; liefert eine Fehlermeldung (Übung wird übersprungen) oder undefined. */
export type RechenUebungPruefer = (u: RechenUebung) => string | undefined;

const text = z.string().trim().min(1);
const optText = z
  .string()
  .nullish()
  .transform((s) => s?.trim() || undefined);

const wert = z.union([z.number().finite(), z.string().trim().min(1), z.array(z.number().finite())]);

const eingabeSchema = z.union([
  text.transform((id): RechenEingabe => ({ id })),
  z.object({
    id: text,
    label: optText,
    einheit: optText,
    runden: z.number().int().min(0).max(6).optional(),
    toleranz: z.number().nonnegative().optional(),
    loesung: wert.optional(),
  }),
]);

const exerciseSchema = z.object({
  id: text,
  thema: z.string().default(''),
  titel: text,
  schwierigkeit: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  tags: z.array(z.string()).default([]),
  vorlage: optText,
  daten: z.record(z.string(), z.unknown()).optional(),
  params: z.record(z.string(), z.unknown()).optional(),
  neueZahlen: z.boolean().optional(),
  aufgabe: text,
  eingaben: z.array(eingabeSchema).default([]),
  hinweise: z.array(z.string()).default([]),
  erklaerung: optText,
  quelleAufgabe: optText,
  quelle_aufgabe: optText,
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

/** Übung ohne Vorlage: jede Eingabe braucht eine Lösung, Platzhalter gibt es nicht. */
function checkFixed(u: RechenUebung): string | undefined {
  if (!u.eingaben.length) return 'ohne Vorlage braucht es Eingaben';
  const missing = u.eingaben.filter((e) => e.loesung === undefined).map((e) => e.id);
  if (missing.length) return `ohne Vorlage braucht jede Eingabe eine „loesung“ (fehlt bei ${missing.join(', ')})`;
  if (/\{\{\s*[\w.-]+\s*\}\}/.test(u.aufgabe)) return 'Platzhalter {{…}} gibt es nur mit Vorlage';
  return undefined;
}

/**
 * Liest AP2_Rechen_Uebungen.json. `topics` (Deep-Dive-ID → Titel) ordnet `thema` einem Deep Dive zu,
 * `pruefe` meldet Übungen, deren Vorlage/Daten/Eingaben nicht zusammenpassen.
 */
export function parseRechenUebungen(
  fileName: string,
  json: string,
  topics: Map<string, string> = new Map(),
  pruefe?: RechenUebungPruefer,
): ParsedRechenUebungen {
  const issues: ImportIssue[] = [];
  const result: ParsedRechenUebungen = { exercises: [], issues };
  const issue = (message: string) => issues.push({ file: fileName, message });

  let data: { uebungen?: unknown };
  try {
    data = JSON.parse(json);
  } catch (e) {
    issue(`Ungültiges JSON: ${(e as Error).message}`);
    return result;
  }
  if (!data || typeof data !== 'object' || !Array.isArray(data.uebungen)) {
    issue('Kein Feld „uebungen" gefunden.');
    return result;
  }

  const seen = new Set<string>();
  for (const raw of data.uebungen) {
    const parsed = exerciseSchema.safeParse(raw);
    if (!parsed.success) {
      issue(`Übung ${label(raw)} übersprungen (${describe(parsed.error)}).`);
      continue;
    }
    const { quelle_aufgabe, quelleAufgabe, neueZahlen, ...rest } = parsed.data;
    if (seen.has(rest.id)) {
      issue(`Doppelte Übungs-ID ${rest.id} übersprungen.`);
      continue;
    }
    const ids = rest.eingaben.map((e) => e.id);
    const dup = ids.find((id, i) => ids.indexOf(id) !== i);
    if (dup) {
      issue(`Übung ${rest.id}: Eingabe „${dup}“ doppelt – übersprungen.`);
      continue;
    }
    const u: RechenUebung = {
      ...rest,
      topicId: topicFromSource(rest.thema, rest.titel, topics),
      neueZahlen: rest.vorlage ? (neueZahlen ?? true) : false,
      quelleAufgabe: quelleAufgabe ?? quelle_aufgabe,
    };
    const problem = u.vorlage ? pruefe?.(u) : checkFixed(u);
    if (problem) {
      issue(`Übung ${u.id} übersprungen (${problem}).`);
      continue;
    }
    seen.add(u.id);
    if (!u.hinweise.length && !u.vorlage) issue(`Übung ${u.id}: keine Hinweise.`);
    result.exercises.push(u);
  }
  return result;
}
