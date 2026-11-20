import { ohneRevision } from './ohneRevision';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  defaultSettings,
  emptyProgress,
  isSuspiciousAttemptDrop,
  migrateProgress,
  migrateSettings,
  PROGRESS_VERSION,
  ProgressSchema,
  type Progress,
} from '../domain/progress';
import { recordAttempt } from '../src/lib/progress';
import type { z } from 'zod';
import { ohneAntworten } from './ohneAntworten';
import { umgezogen } from './umgezogen';

import { createLocalProgressStore } from '../src/lib/staticApi';

const gespeichert = (p: unknown): Progress => {
  let text: string | null = null;
  const store = createLocalProgressStore(() => ({
    getItem: () => text,
    setItem: (_key, value) => {
      text = value;
    },
  }));
  store.save(p);
  return migrateProgress(store.read());
};

const withAttempts = (n: number) => {
  let p = emptyProgress();
  for (let i = 0; i < n; i++)
    p = recordAttempt(p, { taskId: `01-A${i}`, date: '2026-09-21', points: 1, max: 1, mode: 'einzel' }, '2026-09-21');
  return p;
};

describe('ProgressSchema', () => {
  it('akzeptiert einen leeren und einen gefüllten Fortschritt', () => {
    expect(ProgressSchema.safeParse(emptyProgress()).success).toBe(true);
    expect(ProgressSchema.safeParse(withAttempts(3)).success).toBe(true);
  });

  it('Typen und Schema passen zusammen: jeder Progress der App erfüllt das Schema', () => {
    // Wird von `npm run typecheck` geprüft – weicht ein Typ vom Schema ab, schlägt der Typcheck fehl.
    const asStored = (p: Progress): z.input<typeof ProgressSchema> => p;
    expect(ProgressSchema.safeParse(asStored(withAttempts(1))).success).toBe(true);
  });

  it('behält unbekannte Felder und ergänzt fehlende Sammlungen', () => {
    const parsed = ProgressSchema.parse({ version: 1, attempts: [], zukunft: 42 });
    expect(parsed).toMatchObject({ zukunft: 42, exams: [], cards: {}, journal: {}, lernziele: {} });
  });

  it('lehnt leere und kaputte Daten ab', () => {
    for (const body of [null, {}, [], 'x', { version: 1 }, { version: 1, attempts: 'nein' }, { version: 1, attempts: [{ taskId: 1 }] }]) {
      expect(ProgressSchema.safeParse(body).success).toBe(false);
    }
  });

  it('akzeptiert die echte data/fortschritt.json (nur lesend)', () => {
    const file = join(import.meta.dirname, '..', 'data', 'fortschritt.json');
    if (!existsSync(file)) return;
    const result = ProgressSchema.safeParse(JSON.parse(readFileSync(file, 'utf8')));
    expect(result.error?.issues ?? []).toEqual([]);
  });
});

describe('isSuspiciousAttemptDrop', () => {
  it('Schwelle: mehr als 5 weniger oder weniger als die Hälfte', () => {
    expect(isSuspiciousAttemptDrop(10, 10)).toBe(false);
    expect(isSuspiciousAttemptDrop(10, 12)).toBe(false);
    expect(isSuspiciousAttemptDrop(20, 15)).toBe(false);
    expect(isSuspiciousAttemptDrop(20, 14)).toBe(true);
    expect(isSuspiciousAttemptDrop(4, 1)).toBe(true);
    expect(isSuspiciousAttemptDrop(4, 2)).toBe(false);
  });
});

describe('migrateProgress', () => {
  it('verwendet auch bei ungültiger Versionsnummer alle nötigen Migrationsschritte', () => {
    const alt = JSON.parse(readFileSync(join(import.meta.dirname, 'fixtures', 'fortschritt-v8-2026-10-09.json'), 'utf8'));
    const erwartet = migrateProgress({ ...alt, version: 1 });
    expect(migrateProgress({ ...alt, version: 0.5 })).toEqual(erwartet);
    expect(migrateProgress({ ...alt, version: -1e20 })).toEqual(erwartet);
  });

  const fixture = (name: string) => JSON.parse(readFileSync(join(import.meta.dirname, 'fixtures', name), 'utf8'));

  it('übernimmt den aktuellen Stand (Kopie von data/fortschritt.json vom 22.09.2026) ohne Verlust', () => {
    const raw = fixture('fortschritt-v1-2026-09-22.json');
    const migrated = migrateProgress(raw);
    // Einzige Änderungen: aktuelle Version, leere Karteikarten-Lerntage (Version 3),
    // leere SQL-Übungen (Version 4), Standard-Einstellungen (Version 5), leere Rechenübungen (Version 6) und keine Markierungen (Version 7).
    expect(migrated).toEqual({
      ...ohneRevision(umgezogen(raw)),
      version: PROGRESS_VERSION,
      cardReviewDays: {},
      sql: {},
      sqlDays: {},
      settings: defaultSettings(),
      rechnen: {},
      rechnenDays: {},
      markiert: {},
      diagramme: {},
      diagrammDays: {},
      hervorhebungen: {},
      json: {},
    });
    expect(migrated.attempts).toHaveLength(16);
    expect(migrated.exams).toHaveLength(1);
    expect(Object.keys(migrated.cards)).toHaveLength(8);
    expect(Object.keys(migrated.journal)).toHaveLength(13);
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
  });

  it('bringt eine alte Datei ohne version und mit fehlenden Feldern auf das aktuelle Format', () => {
    const raw = fixture('fortschritt-alt-ohne-felder.json');
    const migrated = migrateProgress(raw);
    expect(migrated.version).toBe(PROGRESS_VERSION);
    // Alle Einträge bleiben erhalten, fehlende Felder werden ergänzt, unbekannte bleiben stehen.
    // 03-C1 ist seit Version 9 03-B1 (domain/aufgabenUmzug.ts).
    expect(migrated.attempts.map((a) => a.taskId)).toEqual(['01-A1', '02-B2', '03-B1']);
    expect(migrated.attempts[1]).toEqual({ taskId: '02-B2', date: '', points: 4, max: 4, mode: 'einzel' });
    expect(migrated.attempts[2]).toMatchObject({ mode: 'wiederholung', notiz: 'alt' });
    expect(migrated.exams[0]).toEqual({ ...raw.exams[0], answers: {} });
    expect(migrated.activeExam).toEqual({ ...raw.activeExam, scores: {} });
    expect(migrated.cards).toEqual({
      '01-pf1': { box: 3, due: '2026-08-10', reviews: 0 },
      '02-fg2': { box: 1, due: '2026-08-05', reviews: 2, last: 'unsicher' },
    });
    expect(migrated.journal['01-A1']).toEqual({
      taskId: '01-A1',
      addedAt: '2026-08-01',
      stage: 0,
      due: '2026-08-02',
      lastPoints: 3,
      max: 6,
    });
    expect(migrated.lernziele).toEqual({ '01-1': true, '01-2': false });
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
  });

  it('Version 3 → 4: ergänzt leere SQL-Übungen und SQL-Lerntage, sonst bleibt alles gleich', () => {
    const raw = fixture('fortschritt-v3-2026-09-28.json');
    const migrated = migrateProgress(raw);
    expect(migrated).toEqual({
      ...ohneRevision(umgezogen(raw)),
      version: PROGRESS_VERSION,
      sql: {},
      sqlDays: {},
      settings: defaultSettings(),
      rechnen: {},
      rechnenDays: {},
      markiert: {},
      diagramme: {},
      diagrammDays: {},
      hervorhebungen: {},
      json: {},
    });
    expect(migrated).not.toHaveProperty('revision');
    expect(migrated.cardReviewDays).toEqual({ '2026-09-26': 4, '2026-09-27': 2 });
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
  });

  it('Version 4 → 5: ergänzt Standard-Einstellungen, sonst bleibt alles gleich', () => {
    const raw = fixture('fortschritt-v4-2026-09-30.json');
    const migrated = migrateProgress(raw);
    expect(migrated).toEqual({
      ...ohneRevision(umgezogen(raw)),
      version: PROGRESS_VERSION,
      settings: defaultSettings(),
      rechnen: {},
      rechnenDays: {},
      markiert: {},
      diagramme: {},
      diagrammDays: {},
      hervorhebungen: {},
      json: {},
    });
    expect(migrated.settings).toEqual({ prueferfragen: true, fachgespraech: true, leichtModus: false, backupReminderDays: 7 });
    expect(migrated.settings).not.toHaveProperty('examDate');
    expect(migrated).not.toHaveProperty('revision');
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
    // Auch nach dem Speichern bleibt der migrierte Stand erhalten.
    const r = gespeichert(migrated);
    expect(r).toMatchObject({ version: PROGRESS_VERSION, settings: defaultSettings() });
    expect(r.sql).toEqual(raw.sql);
  });

  it('Version 5 → 6: ergänzt leere Rechenübungen und Rechen-Lerntage, Einstellungen und alles andere bleiben', () => {
    const raw = fixture('fortschritt-v5-2026-09-30.json');
    const migrated = migrateProgress(raw);
    expect(migrated).toEqual({
      ...ohneRevision(umgezogen(raw)),
      version: PROGRESS_VERSION,
      rechnen: {},
      rechnenDays: {},
      markiert: {},
      diagramme: {},
      diagrammDays: {},
      hervorhebungen: {},
      json: {},
    });
    expect(migrated.settings).toEqual(raw.settings);
    expect(migrated).not.toHaveProperty('revision');
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
    // Auch nach dem Speichern bleibt der migrierte Stand erhalten.
    const r = gespeichert(migrated);
    expect(r).toMatchObject({ version: PROGRESS_VERSION, rechnen: {}, rechnenDays: {} });
    expect(r.attempts).toEqual(umgezogen(raw).attempts);
    expect(migrateProgress(migrated)).toEqual(migrated);
  });

  it('Version 6 (vor der Selbsteinschätzung): lädt bis auf die Version und leere neue Sammlungen unverändert, Versuche ohne sicherheit bleiben gültig', () => {
    const raw = fixture('fortschritt-v6-2026-10-01.json');
    const migrated = migrateProgress(raw);
    expect(migrated).toEqual(
      ohneAntworten({
        ...ohneRevision(umgezogen(raw)),
        version: PROGRESS_VERSION,
        markiert: {},
        diagramme: {},
        diagrammDays: {},
        hervorhebungen: {},
        json: {},
      }),
    );
    expect(ProgressSchema.safeParse(raw).success).toBe(true);
    const r = gespeichert(migrated);
    expect(r).toMatchObject({ version: PROGRESS_VERSION, markiert: {} });
  });

  it('Selbsteinschätzung (ROADMAP 8.3): optional ohne neue Version; gültige Werte bleiben, ungültige fallen weg', () => {
    const raw = fixture('fortschritt-v6-2026-10-01.json');
    raw.attempts[0].sicherheit = 3;
    raw.attempts[1].sicherheit = 'sehr';
    raw.attempts[2].sicherheit = 4;
    raw.activeExam.sicherheit = { '04-A1': 2, '04-A2': 0, '04-A3': 'x' };
    raw.exams[0].sicherheit = { '03-C2': 1 };
    const migrated = migrateProgress(raw);
    expect(migrated.attempts.map((a) => a.sicherheit)).toEqual([3, undefined, undefined]);
    expect('sicherheit' in migrated.attempts[1]).toBe(false);
    expect(migrated.activeExam?.sicherheit).toEqual({ '04-A1': 2 });
    // 03-C2 ist seit Version 9 03-B2 (domain/aufgabenUmzug.ts).
    expect(migrated.exams[0].sicherheit).toEqual({ '03-B2': 1 });
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
    expect(gespeichert(migrated)).toEqual(migrated);
    expect(migrateProgress(migrated)).toEqual(migrated);
    // Ein ungültiger Wert beim Speichern wird abgelehnt (die App schreibt nur 1–3).
    const bad = { ...migrated, attempts: [{ ...migrated.attempts[0], sicherheit: 5 }, ...migrated.attempts.slice(1)] };
    expect(() => gespeichert(bad)).toThrow(/Die Daten sind ungültig/);
  });

  it('Fehlergrund (ROADMAP 8.7): optional ohne neue Version; gültige Werte bleiben, ungültige fallen weg', () => {
    const raw = fixture('fortschritt-v6-2026-10-01.json');
    raw.attempts[0].fehlergrund = 'operator';
    raw.attempts[1].fehlergrund = 'faul';
    raw.attempts[2].fehlergrund = 3;
    raw.activeExam.fehlergrund = { '04-A1': 'zeit', '04-A2': 'nix' };
    raw.exams[0].fehlergrund = { '03-C2': 'formel' };
    const migrated = migrateProgress(raw);
    expect(migrated.attempts.map((a) => a.fehlergrund)).toEqual(['operator', undefined, undefined]);
    expect('fehlergrund' in migrated.attempts[1]).toBe(false);
    expect(migrated.activeExam?.fehlergrund).toEqual({ '04-A1': 'zeit' });
    expect(migrated.exams[0].fehlergrund).toEqual({ '03-B2': 'formel' });
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
    expect(gespeichert(migrated)).toEqual(migrated);
    expect(migrateProgress(migrated)).toEqual(migrated);
    const bad = { ...migrated, attempts: [{ ...migrated.attempts[0], fehlergrund: 'faul' }, ...migrated.attempts.slice(1)] };
    expect(() => gespeichert(bad)).toThrow(/Die Daten sind ungültig/);
    const badExam = { ...migrated, exams: [{ ...migrated.exams[0], fehlergrund: { x: 'faul' } }] };
    expect(() => gespeichert(badExam)).toThrow(/Die Daten sind ungültig/);
  });

  it('alle alten Fixtures laden in das aktuelle Format und erfüllen das Schema', () => {
    for (const name of [
      'fortschritt-alt-ohne-felder.json',
      'fortschritt-v1-2026-09-22.json',
      'fortschritt-v3-2026-09-28.json',
      'fortschritt-v4-2026-09-30.json',
      'fortschritt-v5-2026-09-30.json',
      'fortschritt-v6-2026-10-01.json',
      'fortschritt-v7-2026-10-09.json',
    ]) {
      const raw = fixture(name);
      const migrated = migrateProgress(raw);
      expect(migrated.version, name).toBe(PROGRESS_VERSION);
      expect(migrated.attempts.length, name).toBe(raw.attempts.length);
      expect(ProgressSchema.safeParse(migrated).success, name).toBe(true);
      // Die Datei ohne Felder ist absichtlich unvollständig; die echten Stände waren auch vor der Migration gültig.
      if (name !== 'fortschritt-alt-ohne-felder.json') expect(ProgressSchema.safeParse(raw).success, name).toBe(true);
    }
  });

  it('übernimmt Rechenübungs-Stände tolerant: falsche Typen fallen weg, alte Antworten werden gelöscht, unbekannte Felder bleiben', () => {
    const migrated = migrateProgress({
      version: 6,
      attempts: [],
      rechnen: {
        'RE-ST1-001': {
          attempts: 3,
          hintsUsed: 1,
          solvedAt: '2026-09-30',
          lastCheckedAt: '2026-09-30',
          stage: 2,
          due: '2026-10-03',
          lastSeed: 12345,
          antworten: { mittel: '70', median: 5, lang: 'x'.repeat(500) },
          zuletztRichtig: true,
          extra: 1,
        },
        'RE-ST1-002': { lastSeed: 1.5, antworten: 'nein', solutionShown: 'ja', zuletztRichtig: 'ja' },
        kaputt: 7,
      },
      rechnenDays: { '2026-09-30': 3, '2026-09-29': -2, x: 'y' },
    });
    expect(migrated.rechnen['RE-ST1-001']).toEqual({
      attempts: 3,
      hintsUsed: 1,
      solvedAt: '2026-09-30',
      lastCheckedAt: '2026-09-30',
      stage: 2,
      due: '2026-10-03',
      lastSeed: 12345,
      zuletztRichtig: true,
      extra: 1,
    });
    expect(migrated.rechnen['RE-ST1-002']).toEqual({ attempts: 0, hintsUsed: 0 });
    expect(migrated.rechnen).not.toHaveProperty('kaputt');
    expect(migrated.rechnenDays).toEqual({ '2026-09-30': 3 });
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
    expect(migrateProgress(migrated)).toEqual(migrated);
  });

  it('Schema: rechnen und rechnenDays sind optional (ältere Dateien) und werden geprüft', () => {
    expect(ProgressSchema.parse({ version: 5, attempts: [] })).toMatchObject({ rechnen: {}, rechnenDays: {} });
    expect(ProgressSchema.safeParse({ version: 6, attempts: [], rechnen: { a: { attempts: 1, hintsUsed: 'x' } } }).success).toBe(false);
    expect(
      ProgressSchema.safeParse({ version: 6, attempts: [], rechnen: { a: { attempts: 1, hintsUsed: 0, lastSeed: 1.5 } } }).success,
    ).toBe(false);
  });

  it('übernimmt Einstellungen tolerant: falsche Typen → Standardwert, unbekannte Felder bleiben', () => {
    expect(
      migrateSettings({ examDate: '2027-05-12', prueferfragen: false, fachgespraech: false, leichtModus: true, backupReminderDays: 14 }),
    ).toEqual({ examDate: '2027-05-12', prueferfragen: false, fachgespraech: false, leichtModus: true, backupReminderDays: 14 });
    expect(migrateSettings({ examDate: '25.11.2026', prueferfragen: 'nein', backupReminderDays: 0, zukunft: 1 })).toEqual({
      ...defaultSettings(),
      zukunft: 1,
    });
    expect(migrateSettings({ examDate: '2026-02-30', backupReminderDays: 2.5 })).toEqual(defaultSettings());
    // lastBackupDownloadAt (optional, ohne neue Version): gültiges Datum bleibt, alles andere fällt weg
    expect(migrateSettings({ lastBackupDownloadAt: '2026-09-30' })).toEqual({ ...defaultSettings(), lastBackupDownloadAt: '2026-09-30' });
    for (const bad of ['30.09.2026', 42, null]) expect(migrateSettings({ lastBackupDownloadAt: bad })).toEqual(defaultSettings());
    expect(ProgressSchema.safeParse({ version: 5, attempts: [], settings: { lastBackupDownloadAt: '2026-09-30' } }).success).toBe(true);
    // leichtAutomatisch (Phase 6.4, optional, ohne neue Version): nur boolean bleibt, fehlt = an
    expect(migrateSettings({ leichtAutomatisch: false })).toEqual({ ...defaultSettings(), leichtAutomatisch: false });
    for (const bad of ['nein', 0, null]) expect(migrateSettings({ leichtAutomatisch: bad })).toEqual(defaultSettings());
    expect(ProgressSchema.safeParse({ version: 6, attempts: [], settings: { leichtAutomatisch: false } }).success).toBe(true);
    expect(ProgressSchema.safeParse({ version: 6, attempts: [], settings: { leichtAutomatisch: 'nein' } }).success).toBe(false);
    for (const raw of [undefined, null, 'x', []]) expect(migrateSettings(raw)).toEqual(defaultSettings());
    const migrated = migrateProgress({ version: 5, attempts: [], settings: { examDate: '2026-11-25', prueferfragen: false } });
    expect(migrated.settings).toEqual({ ...defaultSettings(), examDate: '2026-11-25', prueferfragen: false });
    expect(migrateProgress(migrated)).toEqual(migrated);
  });

  it('Schema: settings ist optional (ältere Dateien) und wird geprüft', () => {
    expect(ProgressSchema.safeParse({ version: 4, attempts: [] }).success).toBe(true);
    expect(ProgressSchema.safeParse({ version: 5, attempts: [], settings: { prueferfragen: 'ja' } }).success).toBe(false);
    expect(ProgressSchema.safeParse({ version: 5, attempts: [], settings: 'x' }).success).toBe(false);
  });

  it('übernimmt SQL-Stände tolerant: falsche Typen fallen weg, unbekannte Felder bleiben', () => {
    const migrated = migrateProgress({
      version: 4,
      attempts: [],
      sql: {
        'SQL-MH-001': {
          attempts: 2,
          hintsUsed: 1,
          solvedAt: '2026-09-27',
          lastQuery: 'SELECT 1',
          stage: 2,
          due: '2026-09-30',
          zuletztRichtig: true,
          extra: 'x',
        },
        'SQL-MH-002': { solutionShown: 'ja', stage: '1', due: 5, zuletztRichtig: 1 },
        kaputt: 'nein',
      },
      sqlDays: { '2026-09-27': 3, '2026-09-28': -1, x: 'y' },
    });
    expect(migrated.sql).toEqual({
      'SQL-MH-001': {
        attempts: 2,
        hintsUsed: 1,
        solvedAt: '2026-09-27',
        lastQuery: 'SELECT 1',
        stage: 2,
        due: '2026-09-30',
        zuletztRichtig: true,
        extra: 'x',
      },
      'SQL-MH-002': { attempts: 0, hintsUsed: 0 },
    });
    expect(migrated.sqlDays).toEqual({ '2026-09-27': 3 });
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
    expect(migrateProgress(migrated)).toEqual(migrated);
  });

  it('Schema: sql und sqlDays sind optional (ältere Dateien) und werden geprüft', () => {
    expect(ProgressSchema.parse({ version: 3, attempts: [] })).toMatchObject({ sql: {}, sqlDays: {} });
    expect(ProgressSchema.safeParse({ version: 4, attempts: [], sql: { a: { attempts: 'x', hintsUsed: 0 } } }).success).toBe(false);
  });

  it('ist idempotent und liefert für Unbrauchbares einen leeren Stand', () => {
    const once = migrateProgress(fixture('fortschritt-alt-ohne-felder.json'));
    expect(migrateProgress(once)).toEqual(once);
    for (const raw of [null, undefined, 'x', 42, []]) expect(migrateProgress(raw)).toEqual(emptyProgress());
  });

  it('verwirft nur Einträge, die sich nicht zuordnen lassen, und Felder mit falschem Typ', () => {
    const migrated = migrateProgress({
      version: 1,
      attempts: [{ points: 1 }, 'x', { taskId: '01-A1', points: 1, max: 1, mode: 'einzel', date: 'd' }],
      exams: [null, { id: 'e', topicId: '01', startedAt: 's', submittedAt: null, max: 1, answers: {}, scores: {} }],
      cards: { a: 'kaputt', b: { box: 2, due: 'd', reviews: 1, last: 7 } },
      lernziele: { x: 'ja', y: true },
    });
    expect(migrated.attempts).toHaveLength(1);
    expect(migrated.exams).toEqual([{ id: 'e', topicId: '01', startedAt: 's', max: 1, answers: {}, scores: {} }]);
    expect(migrated.cards).toEqual({ b: { box: 2, due: 'd', reviews: 1 } });
    expect(migrated.lernziele).toEqual({ y: true });
    expect(ProgressSchema.safeParse(migrated).success).toBe(true);
  });

  it('lädt die echte data/fortschritt.json ohne Verlust (nur lesend)', () => {
    const file = join(import.meta.dirname, '..', 'data', 'fortschritt.json');
    if (!existsSync(file)) return;
    const raw = JSON.parse(readFileSync(file, 'utf8'));
    const migrated = migrateProgress(raw);
    const erwartet = (raw.version ?? 1) >= 9 ? raw : umgezogen(raw);
    expect(migrated.attempts).toEqual(erwartet.attempts);
    expect(migrated.exams).toEqual(erwartet.exams ?? []);
    expect(migrated.cards).toEqual(raw.cards ?? {});
    expect(migrated.journal).toEqual(erwartet.journal ?? {});
    expect(migrated.lernziele).toEqual(raw.lernziele ?? {});
  });
});

describe('fuelleFehlerjournal', () => {
  it('nimmt Aufgaben mit schlechtem letztem Versuch auf, sofort fällig; sonst unverändert', async () => {
    const { fuelleFehlerjournal } = await import('../src/lib/progress');
    const { emptyProgress } = await import('../domain/progress');
    const p = {
      ...emptyProgress(),
      attempts: [
        { taskId: 'a', date: '2026-01-01', points: 1, max: 5, mode: 'einzel' as const },
        { taskId: 'b', date: '2026-01-01', points: 1, max: 5, mode: 'einzel' as const },
        { taskId: 'b', date: '2026-01-02', points: 5, max: 5, mode: 'einzel' as const },
      ],
    };
    const r = fuelleFehlerjournal(p, () => true, '2026-02-01');
    expect(Object.keys(r.journal)).toEqual(['a']);
    expect(r.journal.a.due).toBe('2026-02-01');
    expect(fuelleFehlerjournal(r, () => true, '2026-02-01')).toBe(r);
  });
});
