import { describe, expect, it } from 'vitest';
import { emptyProgress, migrateProgress, type Progress } from '../domain/progress';
import { createBrowserBackups, planBackup, summarizeBackup, type BackupRecord, type BackupStorage } from '../src/lib/browserBackups';
import { recordAttempt } from '../src/lib/progress';
import { createLocalProgressStore, createStaticApi } from '../src/lib/staticApi';

/** IndexedDB-Attrappe */
function memoryBackupStorage(initial: BackupRecord[] = []): BackupStorage & { data: Map<string, BackupRecord> } {
  const data = new Map(initial.map((r) => [r.date, r]));
  return {
    data,
    list: async () => [...data.values()],
    get: async (date) => data.get(date),
    put: async (record) => void data.set(record.date, record),
    remove: async (dates) => dates.forEach((d) => data.delete(d)),
  };
}

const record = (date: string, json = '{"attempts":[]}'): BackupRecord => ({ date, savedAt: `${date}T08:00:00.000Z`, json });
const days = (n: number) => Array.from({ length: n }, (_, i) => `2026-09-${String(i + 1).padStart(2, '0')}`);

describe('planBackup (Rotation)', () => {
  it('höchstens eine Sicherung pro Tag', () => {
    expect(planBackup([], '2026-09-30')).toEqual({ add: true, remove: [] });
    expect(planBackup(['2026-09-30'], '2026-09-30')).toEqual({ add: false, remove: [] });
  });

  it('behält die neuesten 7 Tage und löscht die ältesten zuerst', () => {
    expect(planBackup(days(6), '2026-09-30')).toEqual({ add: true, remove: [] });
    expect(planBackup(days(7), '2026-09-30')).toEqual({ add: true, remove: ['2026-09-01'] });
    expect(planBackup(days(9), '2026-09-30')).toEqual({ add: true, remove: ['2026-09-01', '2026-09-02', '2026-09-03'] });
    // unsortierte Eingabe, heute schon gesichert
    expect(planBackup(['2026-09-05', '2026-09-01', '2026-09-03'], '2026-09-05', 2)).toEqual({ add: false, remove: ['2026-09-01'] });
  });
});

describe('Tagessicherungen im Browser', () => {
  it('sichert den Stand vor dem Überschreiben, einmal pro Tag, und rotiert', async () => {
    const storage = memoryBackupStorage(days(7).map((d) => record(d)));
    const backups = createBrowserBackups(async () => storage);
    expect(await backups.backupBeforeSave('{"attempts":[1]}', '2026-09-30', 'jetzt')).toBe(true);
    expect(await backups.backupBeforeSave('{"attempts":[1,2]}', '2026-09-30')).toBe(false);
    expect(storage.data.get('2026-09-30')).toEqual({ date: '2026-09-30', savedAt: 'jetzt', json: '{"attempts":[1]}' });
    expect([...storage.data.keys()].sort()).toEqual([...days(7).slice(1), '2026-09-30']);
  });

  it('zwei gleichzeitige Speichervorgänge schreiben die Tagessicherung nur einmal', async () => {
    const storage = memoryBackupStorage();
    const backups = createBrowserBackups(async () => storage);
    const results = await Promise.all([
      backups.backupBeforeSave('{"n":1}', '2026-09-30'),
      backups.backupBeforeSave('{"n":2}', '2026-09-30'),
    ]);
    expect(results).toEqual([true, false]);
    expect(storage.data.get('2026-09-30')?.json).toBe('{"n":1}');
  });

  it('ohne vorherigen oder mit kaputtem Stand: keine Sicherung', async () => {
    const storage = memoryBackupStorage();
    const backups = createBrowserBackups(async () => storage);
    expect(await backups.backupBeforeSave(null, '2026-09-30')).toBe(false);
    expect(await backups.backupBeforeSave('{kaputt', '2026-09-30')).toBe(false);
    expect(storage.data.size).toBe(0);
  });

  it('listet neueste zuerst mit Kurzinfo und liest eine Sicherung', async () => {
    const storage = memoryBackupStorage([
      record('2026-09-28', JSON.stringify({ attempts: [{}, {}], cards: { a: {} } })),
      record('2026-09-29', '{kaputt'),
    ]);
    const backups = createBrowserBackups(async () => storage);
    expect(await backups.info()).toEqual({
      newest: '2026-09-29',
      count: 2,
      items: [
        { date: '2026-09-29', savedAt: '2026-09-29T08:00:00.000Z', attempts: 0, cards: 0 },
        { date: '2026-09-28', savedAt: '2026-09-28T08:00:00.000Z', attempts: 2, cards: 1 },
      ],
    });
    expect(await backups.read('2026-09-29')).toBe('{kaputt');
    await expect(backups.read('2026-01-01')).rejects.toThrow('Keine Sicherung vom 2026-01-01 gefunden.');
  });

  it('ohne IndexedDB (privates Fenster, alter Browser): kein Fehler, leere Liste', async () => {
    const backups = createBrowserBackups(() => Promise.reject(new Error('IndexedDB gesperrt')));
    expect(await backups.backupBeforeSave('{}', '2026-09-30')).toBe(false);
    expect(await backups.info()).toEqual({ newest: null, count: 0, items: [] });
    await expect(backups.read('2026-09-30')).rejects.toThrow(/konnte nicht gelesen werden \(IndexedDB gesperrt\)/);
    expect(summarizeBackup(record('2026-09-30', 'null'))).toMatchObject({ attempts: 0, cards: 0 });
  });

  it('Pages-API: das Speichern sichert den vorherigen Stand im Browser', async () => {
    const data = new Map<string, string>();
    const store = createLocalProgressStore(() => ({ getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) }));
    const storage = memoryBackupStorage();
    const api = createStaticApi(
      store,
      async () => true,
      createBrowserBackups(async () => storage),
    );
    let p: Progress = emptyProgress();
    await api.saveProgress(p); // erster Besuch: noch nichts zu sichern
    p = recordAttempt(p, { taskId: '01-A1', date: 'd', points: 1, max: 1, mode: 'einzel' });
    await api.saveProgress(p);
    const info = await api.backups();
    expect(info.count).toBe(1);
    const restored = migrateProgress(JSON.parse(await api.readBackup(info.newest!)));
    expect(restored.attempts).toHaveLength(0);
    expect(restored).not.toHaveProperty('revision');
  });
});
