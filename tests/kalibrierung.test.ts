import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SICHER_RICHTIG_AB } from '../domain/config';
import { emptyProgress, type Attempt, type ExamRun, type Sicherheit } from '../domain/progress';
import type { Task } from '../domain/types';
import { SicherheitWahl } from '../src/components/SicherheitWahl';
import { istRichtig, kalibrierung, KALIBRIERUNG_MIN } from '../src/lib/kalibrierung';
import { finishExam } from '../src/lib/progress';

// „Wie sicher bist du?“ (ROADMAP 8.3): Kalibrierung, Klausur übernimmt die Einschätzung in die Versuche.

const a = (points: number, max: number, sicherheit?: Sicherheit): Attempt => ({
  taskId: `t-${Math.random()}`,
  date: '2026-09-30',
  points,
  max,
  mode: 'einzel',
  ...(sicherheit ? { sicherheit } : {}),
});

describe('istRichtig', () => {
  it(`ab ${SICHER_RICHTIG_AB * 100} % der Punkte`, () => {
    expect(istRichtig({ points: 8, max: 10 })).toBe(true);
    expect(istRichtig({ points: 7.5, max: 10 })).toBe(false);
    expect(istRichtig({ points: 4, max: 5 })).toBe(true);
    expect(istRichtig({ points: 0, max: 0 })).toBe(false);
  });
});

describe('kalibrierung', () => {
  it('zählt je Stufe, ignoriert Versuche ohne Einschätzung', () => {
    const k = kalibrierung([a(10, 10, 3), a(5, 10, 3), a(8, 10, 3), a(2, 10, 1), a(10, 10)]);
    expect(k.anzahl).toBe(4);
    expect(k.stufen[2]).toMatchObject({ stufe: 3, kurz: 'sicher', anzahl: 3, richtig: 2 });
    expect(k.stufen[2].quote).toBeCloseTo(66.67, 1);
    expect(k.stufen[2].schnitt).toBeCloseTo(76.67, 1);
    expect(k.stufen[0]).toMatchObject({ anzahl: 1, richtig: 0, quote: 0 });
    expect(k.stufen[1]).toEqual({ stufe: 2, kurz: 'teils', anzahl: 0, richtig: 0 });
    expect(k.hinweis).toBeUndefined(); // zu wenige Daten
  });

  it(`Hinweise ab ${KALIBRIERUNG_MIN} Versuchen: zu sicher, unterschätzt, passt`, () => {
    const zuSicher = [...Array(3)].map(() => a(10, 10, 3)).concat([...Array(3)].map(() => a(2, 10, 3)));
    expect(kalibrierung(zuSicher).hinweis).toBe('zu-sicher');
    const unter = [...Array(5)].map(() => a(9, 10, 1));
    expect(kalibrierung(unter).hinweis).toBe('unterschaetzt');
    const passt = [...Array(5)].map(() => a(9, 10, 3));
    expect(kalibrierung(passt).hinweis).toBe('passt');
    expect(kalibrierung([]).anzahl).toBe(0);
  });
});

describe('Klausur', () => {
  it('finishExam schreibt die Einschätzung in die Versuche', () => {
    const tasks = [
      { id: '03-A1', points: 4 },
      { id: '03-A2', points: 6 },
    ] as Task[];
    const run: ExamRun = {
      id: 'ex',
      topicId: '03',
      startedAt: '2026-09-30T10:00:00.000Z',
      answers: {},
      scores: { '03-A1': 4, '03-A2': 1 },
      max: 10,
      sicherheit: { '03-A1': 3 },
    };
    const p = finishExam(emptyProgress(), run, tasks, '2026-09-30T11:00:00.000Z');
    expect(p.attempts.map((x) => x.sicherheit)).toEqual([3, undefined]);
    expect('sicherheit' in p.attempts[1]).toBe(false);
    expect(p.exams[0].sicherheit).toEqual({ '03-A1': 3 });
  });
});

describe('SicherheitWahl', () => {
  it('drei Knöpfe, gewählter mit aria-pressed', () => {
    const html = renderToString(createElement(SicherheitWahl, { value: 2, onChange: () => {} }));
    expect(html).toContain('Wie sicher bist du?');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html).toMatch(/aria-pressed="true"[^>]*>teils/);
    expect(html).toContain('unsicher');
    expect(html).toContain('sicher');
  });
});
