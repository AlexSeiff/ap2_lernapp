import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mergeProgress } from '../shared/mergeProgress';
import { checkProgressPut, emptyProgress, migrateProgress, type Attempt, type ExamRun, type Progress } from '../shared/progress';
import { parseBackup } from '../src/lib/backup';
import { recordAttempt } from '../src/lib/progress';
import { withSettings } from '../src/lib/settings';

const fixture = (name: string) => parseBackup(readFileSync(join(import.meta.dirname, 'fixtures', name), 'utf8'));

const attempt = (taskId: string, date: string, points = 1, max = 2): Attempt => ({ taskId, date, points, max, mode: 'einzel' });
const exam = (id: string, extra: Partial<ExamRun> = {}): ExamRun => ({
  id,
  topicId: '01',
  startedAt: '2026-09-20T10:00:00.000Z',
  answers: {},
  scores: {},
  max: 100,
  ...extra,
});
const withAttempts = (p: Progress, ...list: Attempt[]) => list.reduce((acc, a) => recordAttempt(acc, a, a.date.slice(0, 10)), p);

describe('mergeProgress', () => {
  it('Versuche: Vereinigung ohne Doppelte, nach Datum sortiert', () => {
    const shared = attempt('01-A1', '2026-09-20T10:00:00.000Z');
    const a = { ...emptyProgress(), attempts: [shared, attempt('01-A2', '2026-09-22T10:00:00.000Z')] };
    const b = { ...emptyProgress(), attempts: [shared, attempt('01-A3', '2026-09-21T10:00:00.000Z')] };
    expect(mergeProgress(a, b).attempts.map((x) => x.taskId)).toEqual(['01-A1', '01-A3', '01-A2']);
    // gleiche Aufgabe zu anderer Zeit ist ein eigener Versuch
    const c = { ...emptyProgress(), attempts: [attempt('01-A1', '2026-09-23T10:00:00.000Z')] };
    expect(mergeProgress(a, c).attempts).toHaveLength(3);
  });

  it('Versuche: Selbsteinschätzung bleibt erhalten, fehlt sie hier, kommt sie aus der Sicherung', () => {
    const a1 = attempt('01-A1', '2026-09-20T10:00:00.000Z');
    const a = { ...emptyProgress(), attempts: [a1, { ...attempt('01-A2', '2026-09-21T10:00:00.000Z'), sicherheit: 1 as const }] };
    const b = {
      ...emptyProgress(),
      attempts: [
        { ...a1, sicherheit: 3 as const },
        { ...attempt('01-A2', '2026-09-21T10:00:00.000Z'), sicherheit: 2 as const },
      ],
    };
    expect(mergeProgress(a, b).attempts.map((x) => x.sicherheit)).toEqual([3, 1]);
    const ex = exam('ex-1', { sicherheit: { '01-A1': 2 }, finishedAt: '2026-09-20T11:00:00.000Z' });
    expect(mergeProgress(emptyProgress(), { ...emptyProgress(), exams: [ex] }).exams[0].sicherheit).toEqual({ '01-A1': 2 });
  });

  it('Versuche: Fehlergrund bleibt erhalten, fehlt er hier, kommt er aus der Sicherung (8.7)', () => {
    const a1 = attempt('01-A1', '2026-09-20T10:00:00.000Z');
    const a2 = attempt('01-A2', '2026-09-21T10:00:00.000Z');
    const a = { ...emptyProgress(), attempts: [a1, { ...a2, fehlergrund: 'zeit' as const }] };
    const b = {
      ...emptyProgress(),
      attempts: [
        { ...a1, fehlergrund: 'formel' as const, sicherheit: 2 as const },
        { ...a2, fehlergrund: 'begriff' as const },
      ],
    };
    const m = mergeProgress(a, b);
    expect(m.attempts.map((x) => x.fehlergrund)).toEqual(['formel', 'zeit']);
    expect(m.attempts[0].sicherheit).toBe(2);
    const ex = exam('ex-1', { fehlergrund: { '01-A1': 'operator' }, finishedAt: '2026-09-20T11:00:00.000Z' });
    expect(mergeProgress(emptyProgress(), { ...emptyProgress(), exams: [ex] }).exams[0].fehlergrund).toEqual({ '01-A1': 'operator' });
  });

  it('gleiche Stände: kommt unverändert heraus', () => {
    for (const name of [
      'fortschritt-v1-2026-09-22.json',
      'fortschritt-v3-2026-09-28.json',
      'fortschritt-v4-2026-09-30.json',
      'fortschritt-v5-2026-09-30.json',
      'fortschritt-v6-2026-10-01.json',
    ]) {
      const p = fixture(name);
      expect(mergeProgress(p, p), name).toEqual(p);
      expect(mergeProgress(p, emptyProgress()), name).toEqual(p);
    }
  });

  it('in einen leeren Stand zusammengeführt: alle Daten der Sicherung, aber die eigenen Einstellungen und Revision', () => {
    const backup = withSettings(fixture('fortschritt-v4-2026-09-30.json'), { prueferfragen: false, examDate: '2027-05-01' });
    const current = withSettings({ ...emptyProgress(), revision: 4 }, { backupReminderDays: 3 });
    const merged = mergeProgress(current, backup);
    expect({ ...merged, settings: backup.settings, revision: backup.revision }).toEqual(backup);
    expect(merged.settings).toEqual(current.settings);
    expect(merged.revision).toBe(4);
  });

  it('das anschließende Speichern wird weder als veraltet noch als Versuchs-Rückgang abgelehnt', () => {
    const many = Array.from({ length: 12 }, (_, i) => attempt(`01-A${i}`, `2026-09-${10 + i}`));
    const stored = { ...withAttempts(emptyProgress(), ...many), revision: 7 };
    const backup = { ...withAttempts(emptyProgress(), attempt('02-A1', '2026-09-25')), revision: 1 };
    const merged = mergeProgress(stored, backup);
    expect(merged.attempts).toHaveLength(13);
    expect(checkProgressPut(merged, stored)).toMatchObject({ ok: true, progress: { revision: 8 } });
  });

  it('Klausuren: Vereinigung nach id, die weiter fortgeschrittene gewinnt', () => {
    const done = exam('ex-1', { submittedAt: '2026-09-20T11:00:00.000Z', finishedAt: '2026-09-20T11:30:00.000Z', total: 70 });
    const a = { ...emptyProgress(), exams: [exam('ex-1', { submittedAt: '2026-09-20T11:00:00.000Z' }), exam('ex-2')] };
    const b = { ...emptyProgress(), exams: [done, exam('ex-3', { startedAt: '2026-09-19T10:00:00.000Z' })] };
    const merged = mergeProgress(a, b);
    expect(merged.exams.map((e) => e.id)).toEqual(['ex-3', 'ex-2', 'ex-1']);
    expect(merged.exams.find((e) => e.id === 'ex-1')).toEqual(done);
  });

  it('laufende Klausur: die eigene bleibt, sonst die aus der Sicherung, abgeschlossene entfallen', () => {
    const mine = exam('ex-mine', { answers: { a: 'x' } });
    const theirs = exam('ex-theirs');
    const active = (e?: ExamRun): Progress => ({ ...emptyProgress(), ...(e ? { activeExam: e } : {}) });
    expect(mergeProgress(active(mine), active(theirs)).activeExam).toEqual(mine);
    expect(mergeProgress(active(), active(theirs)).activeExam).toEqual(theirs);
    expect(mergeProgress(active(mine), active()).activeExam).toEqual(mine);
    // dieselbe Klausur, in der Sicherung schon abgegeben → abgegebene Fassung
    const submitted = { ...mine, submittedAt: '2026-09-20T11:00:00.000Z' };
    expect(mergeProgress(active(mine), active(submitted)).activeExam).toEqual(submitted);
    // in der Sicherung schon abgeschlossen → nicht mehr laufend, aber in der Historie
    const finished = { ...mine, submittedAt: 's', finishedAt: '2026-09-20T12:00:00.000Z', total: 50 };
    const merged = mergeProgress(active(mine), { ...emptyProgress(), exams: [finished] });
    expect(merged).not.toHaveProperty('activeExam');
    expect(merged.exams).toEqual([finished]);
  });

  it('Karteikarten: der Stand mit mehr Wiederholungen, bei Gleichstand das spätere due', () => {
    const a: Progress = {
      ...emptyProgress(),
      cards: { k1: { box: 3, due: '2026-10-05', reviews: 4 }, k2: { box: 1, due: '2026-09-30', reviews: 2 } },
    };
    const b: Progress = {
      ...emptyProgress(),
      cards: {
        k1: { box: 1, due: '2026-10-01', reviews: 6, last: 'nicht' },
        k2: { box: 2, due: '2026-10-02', reviews: 2 },
        k3: { box: 1, due: '2026-09-30', reviews: 1 },
      },
    };
    expect(mergeProgress(a, b).cards).toEqual(b.cards);
    expect(mergeProgress(b, a).cards).toEqual(b.cards);
  });

  it('SQL: der Stand mit dem neueren lastCheckedAt, gelöst bleibt gelöst', () => {
    const a: Progress = {
      ...emptyProgress(),
      sql: { s1: { attempts: 2, hintsUsed: 0, solvedAt: '2026-09-20', lastCheckedAt: '2026-09-20T10:00:00.000Z' } },
    };
    const b: Progress = {
      ...emptyProgress(),
      sql: {
        s1: { attempts: 1, hintsUsed: 2, solutionShown: true, lastCheckedAt: '2026-09-25T10:00:00.000Z', stage: 1, due: '2026-09-26' },
        s2: { attempts: 1, hintsUsed: 0 },
      },
    };
    const merged = mergeProgress(a, b);
    expect(merged.sql.s1).toEqual({ ...b.sql.s1, solvedAt: '2026-09-20' });
    expect(merged.sql.s2).toEqual(b.sql.s2);
    expect(mergeProgress(b, a).sql.s1).toEqual(merged.sql.s1);
  });

  it('Rechenübungen: der Stand mit dem neueren lastCheckedAt (samt Seed), gelöst bleibt gelöst', () => {
    const a: Progress = {
      ...emptyProgress(),
      rechnen: {
        r1: { attempts: 2, hintsUsed: 0, solvedAt: '2026-09-20', lastCheckedAt: '2026-09-20', lastSeed: 7 },
        r3: { attempts: 1, hintsUsed: 0, lastCheckedAt: '2026-09-28' },
      },
    };
    const b: Progress = {
      ...emptyProgress(),
      rechnen: {
        r1: { attempts: 1, hintsUsed: 2, solutionShown: true, lastCheckedAt: '2026-09-25', stage: 1, due: '2026-09-26', lastSeed: 99 },
        r2: { attempts: 1, hintsUsed: 0, solvedAt: '2026-09-24' },
        r3: { attempts: 4, hintsUsed: 1, lastCheckedAt: '2026-09-27' },
      },
    };
    const merged = mergeProgress(a, b);
    expect(merged.rechnen.r1).toEqual({ ...b.rechnen.r1, solvedAt: '2026-09-20' });
    expect(merged.rechnen.r2).toEqual(b.rechnen.r2);
    expect(merged.rechnen.r3).toEqual(a.rechnen.r3);
    expect(mergeProgress(b, a).rechnen).toEqual(merged.rechnen);
    // ohne lastCheckedAt auf beiden Seiten: mehr Prüfungen gewinnen
    const x: Progress = { ...emptyProgress(), rechnen: { r: { attempts: 1, hintsUsed: 3 } } };
    const y: Progress = { ...emptyProgress(), rechnen: { r: { attempts: 2, hintsUsed: 0 } } };
    expect(mergeProgress(x, y).rechnen.r).toEqual(y.rechnen.r);
  });

  it('Fehlerjournal: der Eintrag der Seite mit dem neueren Versuch – auch wenn die Stufe dort niedriger ist', () => {
    // Beide Geräte: A1 am 20. falsch. Handy: am 21. richtig (Stufe 1). PC: am 23. wieder falsch (Stufe 0).
    const start = withAttempts(emptyProgress(), attempt('01-A1', '2026-09-20', 0));
    const phone = withAttempts(start, attempt('01-A1', '2026-09-21', 2));
    const pc = withAttempts(start, attempt('01-A1', '2026-09-23', 0));
    expect(phone.journal['01-A1'].stage).toBe(1);
    expect(mergeProgress(phone, pc).journal['01-A1']).toEqual(pc.journal['01-A1']);
    expect(mergeProgress(pc, phone).journal['01-A1']).toEqual(pc.journal['01-A1']);
    // ohne Versuche (z. B. alte Datei): höhere Stufe gewinnt
    const noAttempts = (p: Progress) => ({ ...p, attempts: [] });
    expect(mergeProgress(noAttempts(pc), noAttempts(phone)).journal['01-A1']).toEqual(phone.journal['01-A1']);
  });

  it('Lernziele: abgehakt gewinnt; Lerntage: je Tag das Maximum', () => {
    const a: Progress = {
      ...emptyProgress(),
      lernziele: { 'l-1': true, 'l-2': false },
      cardReviewDays: { '2026-09-20': 5 },
      sqlDays: { '2026-09-21': 1 },
      rechnenDays: { '2026-09-21': 3, '2026-09-23': 1 },
    };
    const b: Progress = {
      ...emptyProgress(),
      lernziele: { 'l-2': true, 'l-3': false },
      cardReviewDays: { '2026-09-20': 3, '2026-09-22': 4 },
      sqlDays: { '2026-09-21': 2 },
      rechnenDays: { '2026-09-21': 2, '2026-09-24': 5 },
    };
    const merged = mergeProgress(a, b);
    expect(merged.lernziele).toEqual({ 'l-1': true, 'l-2': true, 'l-3': false });
    expect(merged.cardReviewDays).toEqual({ '2026-09-20': 5, '2026-09-22': 4 });
    expect(merged.sqlDays).toEqual({ '2026-09-21': 2 });
    expect(merged.rechnenDays).toEqual({ '2026-09-21': 3, '2026-09-23': 1, '2026-09-24': 5 });
  });

  it('das Ergebnis ist gültiger Fortschritt im aktuellen Format', () => {
    const merged = mergeProgress(fixture('fortschritt-v3-2026-09-28.json'), fixture('fortschritt-v4-2026-09-30.json'));
    expect(migrateProgress(merged)).toEqual(merged);
    const mitRechnen = mergeProgress(fixture('fortschritt-v5-2026-09-30.json'), {
      ...emptyProgress(),
      rechnen: { 'RE-ST1-001': { attempts: 1, hintsUsed: 0, solvedAt: '2026-09-30', lastCheckedAt: '2026-09-30' } },
      rechnenDays: { '2026-09-30': 1 },
    });
    expect(mitRechnen.rechnen['RE-ST1-001'].solvedAt).toBe('2026-09-30');
    expect(mitRechnen.settings).toEqual(fixture('fortschritt-v5-2026-09-30.json').settings);
    expect(migrateProgress(mitRechnen)).toEqual(mitRechnen);
  });
});
