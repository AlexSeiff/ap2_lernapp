import { describe, expect, it } from 'vitest';
import { emptyProgress, type ExamRun, type Progress } from '../domain/progress';
import type { Content, Topic } from '../domain/types';
import { rateCard } from '../src/lib/progress';
import { activityDays, examTrends, studyStreak, toLocalDay } from '../src/lib/stats';

const TODAY = '2026-09-22';
/** Zeitpunkt mittags in lokaler Zeit – unabhängig von der Zeitzone des Testrechners derselbe Kalendertag. */
const at = (day: string) => new Date(`${day}T12:00:00`).toISOString();
const attempt = (day: string) => ({ taskId: '01-A1', date: at(day), points: 1, max: 2, mode: 'einzel' as const });
const withAttempts = (...days: string[]): Progress => ({ ...emptyProgress(), attempts: days.map(attempt) });

describe('toLocalDay', () => {
  it('liest ISO-Zeitpunkte und reine Datumsangaben, ignoriert Ungültiges', () => {
    expect(toLocalDay(at('2026-09-21'))).toBe('2026-09-21');
    expect(toLocalDay('2026-09-21')).toBe('2026-09-21');
    expect(toLocalDay('')).toBeUndefined();
    expect(toLocalDay('kaputt')).toBeUndefined();
  });
});

describe('activityDays', () => {
  it('zählt Versuche, Klausuren (auch die laufende) und Karteikarten-Tage', () => {
    const exam = { id: 'e', topicId: '01', startedAt: at('2026-09-10'), finishedAt: at('2026-09-11'), answers: {}, scores: {}, max: 100 };
    const p: Progress = {
      ...withAttempts('2026-09-01'),
      exams: [exam],
      activeExam: { ...exam, id: 'a', startedAt: at('2026-09-15'), finishedAt: undefined },
      cardReviewDays: { '2026-09-20': 3, '2026-09-21': 0 },
    };
    expect([...activityDays(p)].sort()).toEqual(['2026-09-01', '2026-09-10', '2026-09-11', '2026-09-15', '2026-09-20']);
  });

  it('rateCard trägt den Tag in cardReviewDays ein', () => {
    let p = rateCard(emptyProgress(), 'SQL-001', 'gewusst', TODAY);
    p = rateCard(p, 'SQL-002', 'nicht', TODAY);
    expect(p.cardReviewDays).toEqual({ [TODAY]: 2 });
    expect(activityDays(p).has(TODAY)).toBe(true);
  });
});

describe('studyStreak', () => {
  it('ist 0 ohne Aktivität', () => {
    expect(studyStreak(emptyProgress(), TODAY)).toEqual({ current: 0, today: false, longest: 0 });
  });

  it('zählt aufeinanderfolgende Tage bis heute', () => {
    const p = withAttempts('2026-09-20', '2026-09-21', '2026-09-22', '2026-09-22');
    expect(studyStreak(p, TODAY)).toEqual({ current: 3, today: true, longest: 3 });
  });

  it('läuft bis gestern weiter, solange heute noch nichts gelernt wurde', () => {
    expect(studyStreak(withAttempts('2026-09-20', '2026-09-21'), TODAY)).toEqual({ current: 2, today: false, longest: 2 });
  });

  it('reißt nach einem ausgelassenen Tag und merkt sich den Rekord', () => {
    const p = withAttempts('2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-20');
    expect(studyStreak(p, TODAY)).toEqual({ current: 0, today: false, longest: 4 });
  });

  it('zählt über Monatsgrenzen und mit Karteikarten-Tagen', () => {
    const p: Progress = { ...withAttempts('2026-08-31'), cardReviewDays: { '2026-09-01': 5 } };
    expect(studyStreak(p, '2026-09-01')).toMatchObject({ current: 2, today: true });
  });
});

describe('examTrends', () => {
  const topic = (id: string) => ({ id, title: `Thema ${id}` }) as Topic;
  const content = { topics: [topic('01'), topic('02'), topic('03')] } as Content;
  const run = (topicId: string, day: string, total: number | undefined, max = 100): ExamRun => ({
    id: `${topicId}-${day}`,
    topicId,
    startedAt: at(day),
    ...(total !== undefined ? { finishedAt: at(day), total } : {}),
    answers: {},
    scores: {},
    max,
  });

  it('liefert je Thema die Ergebnisse chronologisch und die Veränderung zur vorletzten Klausur', () => {
    const p: Progress = {
      ...emptyProgress(),
      exams: [
        run('01', '2026-09-15', 70),
        run('01', '2026-09-01', 50),
        run('02', '2026-09-10', 45, 50),
        run('01', '2026-09-20', undefined),
      ],
    };
    const trends = examTrends(content, p);
    expect(trends.map((t) => t.topic.id)).toEqual(['01', '02']);
    expect(trends[0].runs.map((r) => r.pct)).toEqual([50, 70]);
    expect(trends[0]).toMatchObject({ latest: 70, delta: 20 });
    expect(trends[1]).toMatchObject({ latest: 90 });
    expect(trends[1].delta).toBeUndefined();
  });

  it('ignoriert Klausuren ohne Gesamtpunkte (null aus alten Dateien)', () => {
    const broken = { ...run('03', '2026-09-01', 10), total: null as unknown as number };
    expect(examTrends(content, { ...emptyProgress(), exams: [broken] })).toEqual([]);
  });
});
