// Vertrag der lokalen API (/api/…): Request-Schemas (zod) und Antworttypen für jede Route.
// Server (server/apiPlugin.ts) und Client (src/lib/api.ts) nutzen dieselben Typen.
// Achtung: wird in den Browser gebündelt – hier nichts aus server/ oder dem Claude-SDK importieren.

import { z } from 'zod';
import type { Progress } from './progress.ts';
import type { KernInhalt, ThemaTexte } from './texte.ts';
import { TASK_TYPES, type BegriffsSeite, type Task } from './types.ts';

// ── Request-Schemas ─────────────────────────────────────────────────────────
// Fehlermeldungen auf Deutsch, weil sie direkt in der Oberfläche landen.

const NOT_AN_OBJECT = { error: 'Die Anfrage muss ein JSON-Objekt sein.' };

/** POST /api/ai/generate */
export const GenerateRequestSchema = z.object(
  {
    topicId: z.string({ error: 'Thema fehlt.' }).min(1, 'Thema fehlt.'),
    count: z
      .number({ error: 'Anzahl muss eine Zahl sein.' })
      .int('Anzahl muss eine ganze Zahl sein.')
      .min(1, 'Anzahl muss zwischen 1 und 10 liegen.')
      .max(10, 'Anzahl muss zwischen 1 und 10 liegen.')
      .default(3),
    types: z
      .array(z.enum(TASK_TYPES, { error: `Unbekannter Aufgabentyp (erlaubt: ${TASK_TYPES.join(', ')}).` }), {
        error: 'Aufgabentypen müssen eine Liste sein.',
      })
      .default([]),
  },
  NOT_AN_OBJECT,
);
export type GenerateRequest = z.input<typeof GenerateRequestSchema>;

/** POST /api/ai/grade */
export const GradeRequestSchema = z.object(
  {
    taskId: z.string({ error: 'Aufgabe fehlt.' }).min(1, 'Aufgabe fehlt.'),
    answer: z.string({ error: 'Antwort muss Text sein.' }).default(''),
  },
  NOT_AN_OBJECT,
);
export type GradeRequest = z.input<typeof GradeRequestSchema>;

/**
 * PUT /api/progress: der Fortschritt plus optional `reset: true` für bewusstes Zurücksetzen/Einspielen.
 * Geprüft wird mit ProgressPutSchema/checkProgressPut aus shared/progress.ts.
 */
export type SaveProgressRequest = Progress & { reset?: boolean };

// ── Antworten ───────────────────────────────────────────────────────────────

/**
 * POST /api/ai/grade: Ergebnis der KI-Bewertung einer offenen Antwort.
 * server/ai.ts übersetzt die Modellantwort (GradeSchema: punkte, feedback, fehlende_aspekte) in diese Form.
 */
export interface GradeResult {
  /** 0 bis Maximalpunktzahl der Aufgabe, in 0,5er-Schritten. */
  points: number;
  feedback: string;
  missing: string[];
}

/** GET /api/progress/backups */
export interface BackupInfo {
  /** Datum der neuesten Tagessicherung (YYYY-MM-DD) oder null. */
  newest: string | null;
  count: number;
  /** Nur die Pages-Version: die Sicherungen im Browser (IndexedDB), neueste zuerst – zum Wiederherstellen. */
  items?: BackupItem[];
}

/** Eine Tagessicherung im Browser (Pages-Version). */
export interface BackupItem {
  /** Tag der Sicherung (YYYY-MM-DD); sie enthält den Stand vor dem ersten Speichern an diesem Tag. */
  date: string;
  /** Zeitpunkt der Sicherung (ISO). */
  savedAt: string;
  attempts: number;
  cards: number;
}

/** GET /api/ai/status */
export interface AiStatus {
  enabled: boolean;
  model: string;
}

export interface OkResponse {
  ok: true;
}

/** Antworttypen je Route. Fehler kommen immer als ErrorResponse mit passendem HTTP-Status. */
export interface ApiResponses {
  /** Kern ohne Abschnittstexte (Umsetzungsplan Phase 10, shared/texte.ts). */
  'GET /api/content': KernInhalt;
  /** Abschnittstexte eines Themas (Abschnitts-id → Markdown). */
  'GET /api/texte/:id': ThemaTexte;
  /** Begriffsseiten mit ganzem Text (Umsetzungsplan Phase 3). */
  'GET /api/begriffe': BegriffsSeite[];
  /** Rohdaten aus data/fortschritt.json (oder null) – der Client migriert sie mit migrateProgress(). */
  'GET /api/progress': unknown;
  'PUT /api/progress': OkResponse & { revision: number };
  'GET /api/progress/backups': BackupInfo;
  'GET /api/ai/status': AiStatus;
  'POST /api/ai/generate': Task[];
  'POST /api/ai/grade': GradeResult;
  'DELETE /api/generated/:id': OkResponse;
}

export interface ErrorResponse {
  error: string;
}
