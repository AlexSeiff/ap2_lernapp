import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { inhaltDateien } from '../build/inhaltPlugin';
import { migrateProgress, ProgressSchema } from '../shared/progress';
import { umgezogen } from './umgezogen';

describe('Umbau: unveränderte ausgelieferte Inhalte', () => {
  afterEach(() => vi.useRealTimers());
  it('hält den SHA-256 jeder erzeugten JSON-Datei fest', () => {
    // Der Importzeitpunkt gehört zur Ausgabe; feste Uhr statt eines ausgelassenen Felds.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-20T00:00:00.000Z'));
    const { dateien, issues } = inhaltDateien();
    expect(issues).toEqual([]);
    expect(
      Object.fromEntries(
        [...dateien].sort(([a], [b]) => a.localeCompare(b)).map(([name, text]) => [name, createHash('sha256').update(text).digest('hex')]),
      ),
    ).toMatchSnapshot();
  });
});
const data = join(import.meta.dirname, '..', 'data');
const backups = join(data, 'backups');
const files = [
  ...(existsSync(join(data, 'fortschritt.json')) ? [join(data, 'fortschritt.json')] : []),
  ...(existsSync(backups)
    ? readdirSync(backups, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
        .map((entry) => join(entry.parentPath, entry.name))
    : []),
];
describe('Umbau: private Lernstände ausschließlich lesen', () => {
  it.skipIf(files.length === 0)('erhält Versuche, Karten und Markierungen in jedem Stand und beim JSON-Rundlauf', () => {
    for (const file of files) {
      const raw = JSON.parse(readFileSync(file, 'utf8'));
      const expected = (raw.version ?? 1) < 9 ? umgezogen(raw) : raw;
      const migrated = migrateProgress(raw);
      expect(ProgressSchema.safeParse(migrated).success).toBe(true);
      expect(migrated.attempts).toEqual(expected.attempts ?? []);
      expect(migrated.cards).toEqual(expected.cards ?? {});
      expect(migrated.markiert).toEqual(expected.markiert ?? {});
      expect(migrated.lernziele).toEqual(expected.lernziele ?? {});
      expect(migrated.exams).toEqual(expected.exams ?? []);
      expect(migrated.journal).toEqual(expected.journal ?? {});
      expect(migrated.hervorhebungen).toEqual(expected.hervorhebungen ?? {});
      expect(migrateProgress(JSON.parse(JSON.stringify(migrated)))).toEqual(migrated);
    }
  });
});
