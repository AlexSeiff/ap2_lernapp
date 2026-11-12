import type { BackupInfo, SaveProgressRequest } from '../../shared/api';
import type { KernInhalt, ThemaTexte } from '../../shared/texte';
import type { BegriffsSeite } from '../../shared/types';
import { ApiError } from './apiError';
import { createStaticApi } from './staticApi';

export { ApiError };

/** Woher die App Inhalte und Fortschritt bekommt: JSON-Dateien neben der App und der Speicher des Browsers (staticApi.ts). */
export interface DataSource {
  /** Kern ohne Abschnittstexte (shared/texte.ts). */
  content(): Promise<KernInhalt>;
  /** Begriffsseiten mit Text – getrennt geladen, erst wenn sie gebraucht werden (lib/begriffe.ts). */
  begriffe(): Promise<BegriffsSeite[]>;
  /** Abschnittstexte eines Themas – getrennt vom Kern, nachgeladen (lib/texte.ts). */
  texte(topicId: string): Promise<ThemaTexte>;
  /** Rohdaten des gespeicherten Fortschritts (oder null) – der Store migriert sie mit migrateProgress(). */
  progress(): Promise<unknown>;
  saveProgress(p: SaveProgressRequest): Promise<{ ok: true; revision: number }>;
  /** Letztes Speichern beim Schließen des Tabs. */
  saveProgressOnUnload(p: SaveProgressRequest): void;
  backups(): Promise<BackupInfo>;
  /** JSON-Text einer Tagessicherung im Browser. */
  readBackup(date: string): Promise<string>;
  /** Meldet, wenn ein anderer Tab gespeichert hat; liefert die Abmelde-Funktion. */
  watchOtherTabs(onChange: () => void): () => void;
}

export const api: DataSource = createStaticApi();
