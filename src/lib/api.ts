import type { BackupInfo, SaveProgressRequest } from '../../shared/api';
import type { Details, StartInhalt, ThemaTexte } from '../../shared/texte';
import type { BegriffsSeite } from '../../shared/types';
import { ApiError } from './apiError';
import { createStaticApi } from './staticApi';

export { ApiError };

/** Woher die App Inhalte und Fortschritt bekommt: JSON-Dateien neben der App und der Speicher des Browsers (staticApi.ts). */
export interface DataSource {
  /** Start: Inhalt ohne Abschnittstexte und ohne die Texte der Karten und Aufgaben (shared/texte.ts). */
  content(): Promise<StartInhalt>;
  /** Texte der Karten und Aufgaben – nachgeladen, sobald eine andere Seite als die Übersicht sie braucht (lib/details.tsx). */
  details(): Promise<Details>;
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
