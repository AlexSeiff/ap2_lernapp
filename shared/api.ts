// Typen rund ums Speichern des Fortschritts im Browser (src/lib/staticApi.ts, browserBackups.ts, progressSaver.ts).

import type { Progress } from './progress.ts';

/**
 * Speichern des Fortschritts: der Stand plus optional `reset: true` für bewusstes Zurücksetzen/Einspielen.
 * Geprüft wird mit ProgressPutSchema/checkProgressPut aus shared/progress.ts.
 */
export type SaveProgressRequest = Progress & { reset?: boolean };

/** Übersicht der automatischen Tagessicherungen im Browser (IndexedDB). */
export interface BackupInfo {
  /** Datum der neuesten Tagessicherung (YYYY-MM-DD) oder null. */
  newest: string | null;
  count: number;
  /** Die Sicherungen, neueste zuerst – zum Wiederherstellen. */
  items?: BackupItem[];
}

/** Eine Tagessicherung im Browser. */
export interface BackupItem {
  /** Tag der Sicherung (YYYY-MM-DD); sie enthält den Stand vor dem ersten Speichern an diesem Tag. */
  date: string;
  /** Zeitpunkt der Sicherung (ISO). */
  savedAt: string;
  attempts: number;
  cards: number;
}
