import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { BackupInfo } from '../shared/api.ts';
import type { Task } from '../shared/types.ts';

export const DATA_DIR = join(import.meta.dirname, '..', 'data');
/** Anzahl der aufbewahrten Tagessicherungen in data/backups/. */
export const BACKUP_KEEP = 14;
const BACKUP_FILE = /^fortschritt-(\d{4}-\d{2}-\d{2})\.json$/;

/** Fehlercodes, mit denen Windows ein Umbenennen ablehnt, solange OneDrive o. Ä. die Datei offen hält. */
const RETRY_CODES = new Set(['EPERM', 'EBUSY', 'EACCES']);
/** Wartezeiten zwischen den Versuchen: 5 Versuche über insgesamt ca. 500 ms. */
export const RENAME_RETRY_DELAYS_MS = [50, 100, 150, 200];

function sleepSync(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/** renameSync mit kurzem Wiederholen, falls die Zieldatei gerade gesperrt ist (OneDrive-Ordner unter Windows). */
export function renameWithRetry(from: string, to: string, rename: (from: string, to: string) => void = renameSync, sleep = sleepSync) {
  for (let attempt = 0; ; attempt++) {
    try {
      rename(from, to);
      return;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code ?? '';
      if (!RETRY_CODES.has(code)) throw err;
      if (attempt >= RENAME_RETRY_DELAYS_MS.length) {
        console.error(
          `[lern-app] ${to} konnte nach ${attempt + 1} Versuchen nicht ersetzt werden (${code}). Hält OneDrive oder ein anderes Programm die Datei offen?`,
        );
        throw new Error(
          'Speichern fehlgeschlagen: Die Datei ist gerade gesperrt (z. B. durch OneDrive). Bitte gleich noch einmal versuchen.',
          { cause: err },
        );
      }
      sleep(RENAME_RETRY_DELAYS_MS[attempt]);
    }
  }
}

function localDate(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Datenablage in einem Ordner – der Ordner ist injizierbar, damit Tests nie data/ berühren. */
export function createStore(dataDir = DATA_DIR) {
  const backupDir = join(dataDir, 'backups');

  function readJson<T>(file: string, fallback: T): T {
    const path = join(dataDir, file);
    if (!existsSync(path)) return fallback;
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as T;
    } catch {
      // Beschädigte Datei nicht überschreiben, sondern sichern und neu beginnen.
      renameWithRetry(path, `${path}.defekt-${Date.now()}`);
      return fallback;
    }
  }

  /** Schreibt atomar (erst Temp-Datei, dann umbenennen), damit ein Absturz keine halbe Datei hinterlässt. */
  function writeJson(file: string, data: unknown) {
    const path = join(dataDir, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(`${path}.tmp`, JSON.stringify(data, null, 2), 'utf8');
    renameWithRetry(`${path}.tmp`, path);
  }

  function listBackups(): string[] {
    if (!existsSync(backupDir)) return [];
    return readdirSync(backupDir)
      .filter((f) => BACKUP_FILE.test(f))
      .sort();
  }

  /**
   * Legt vor dem ersten Überschreiben eines Tages eine Kopie von fortschritt.json an
   * (also den Stand vom Tagesbeginn) und behält nur die letzten BACKUP_KEEP Tage.
   */
  function backupProgress(today = localDate()) {
    const source = join(dataDir, 'fortschritt.json');
    if (!existsSync(source)) return;
    const target = join(backupDir, `fortschritt-${today}.json`);
    if (existsSync(target)) return;
    mkdirSync(backupDir, { recursive: true });
    copyFileSync(source, target);
    const files = listBackups();
    for (const f of files.slice(0, Math.max(0, files.length - BACKUP_KEEP))) unlinkSync(join(backupDir, f));
  }

  function writeProgress(data: unknown, today = localDate()) {
    try {
      backupProgress(today);
    } catch (err) {
      // Eine fehlgeschlagene Sicherung darf das Speichern nicht verhindern.
      console.warn('[lern-app] Tagessicherung des Fortschritts fehlgeschlagen:', err);
    }
    writeJson('fortschritt.json', data);
  }

  function backupInfo(): BackupInfo {
    const files = listBackups();
    const newest = files.at(-1);
    return { newest: newest ? BACKUP_FILE.exec(newest)![1] : null, count: files.length };
  }

  return {
    dataDir,
    backupDir,
    readProgress: () => readJson<unknown>('fortschritt.json', null),
    writeProgress,
    backupInfo,
    readGenerated: () => readJson<Task[]>('generierte-aufgaben.json', []),
    writeGenerated: (tasks: Task[]) => writeJson('generierte-aufgaben.json', tasks),
  };
}

const store = createStore();

export const readProgress = store.readProgress;
export const writeProgress = (data: unknown) => store.writeProgress(data);
export const backupInfo = store.backupInfo;
export const readGenerated = store.readGenerated;
export const writeGenerated = store.writeGenerated;
