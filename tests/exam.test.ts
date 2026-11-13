import { describe, expect, it } from 'vitest';
import { emptyProgress, type ExamRun, type Progress } from '../shared/progress';
import type { Flashcard, Task } from '../shared/types';
import { fallenKarten, filterCards, readCardFilter, withCardFilter } from '../src/lib/cards';
import { finishExam, submitExam } from '../src/lib/progress';

const NOW = '2026-09-22T10:00:00.000Z';
const task = (id: string, points: number): Task => ({ id, code: id, topicId: '01', block: 'A', points, markdown: '', type: 'offen' });
const tasks = [task('01-A1', 10), task('01-A2', 5), task('01-A3', 5)];
const run: ExamRun = {
  id: 'ex-1',
  topicId: '01',
  startedAt: '2026-09-22T08:00:00.000Z',
  submittedAt: '2026-09-22T09:30:00.000Z',
  answers: { '01-A1': 'x' },
  scores: { '01-A1': 10, '01-A2': 3 },
  max: 20,
};

describe('finishExam', () => {
  const before: Progress = { ...emptyProgress(), activeExam: run };
  const after = finishExam(before, run, tasks, NOW);

  it('legt die Klausur mit Summe und Abschlusszeit in der Historie ab und beendet sie', () => {
    expect(after.activeExam).toBeUndefined();
    expect(after.exams).toHaveLength(1);
    expect(after.exams[0]).toMatchObject({ id: 'ex-1', total: 13, max: 20, finishedAt: NOW });
  });

  it('speichert je Aufgabe einen Versuch (unbewertet = 0 P) im Modus „klausur"', () => {
    expect(after.attempts).toEqual([
      { taskId: '01-A1', date: NOW, points: 10, max: 10, mode: 'klausur' },
      { taskId: '01-A2', date: NOW, points: 3, max: 5, mode: 'klausur' },
      { taskId: '01-A3', date: NOW, points: 0, max: 5, mode: 'klausur' },
    ]);
  });

  it('übernimmt nur Aufgaben unter voller Punktzahl ins Fehlerjournal', () => {
    expect(Object.keys(after.journal).sort()).toEqual(['01-A2', '01-A3']);
  });

  it('verändert den alten Stand nicht', () => {
    expect(before.exams).toHaveLength(0);
    expect(before.activeExam).toBe(run);
  });
});

describe('submitExam', () => {
  const open: ExamRun = { ...run, submittedAt: undefined };

  it('setzt den Abgabezeitpunkt', () => {
    expect(submitExam({ ...emptyProgress(), activeExam: open }, NOW).activeExam?.submittedAt).toBe(NOW);
  });

  it('überschreibt eine schon abgegebene Klausur nicht und ignoriert fehlende Klausur', () => {
    const p = { ...emptyProgress(), activeExam: run };
    expect(submitExam(p, NOW)).toBe(p);
    const empty = emptyProgress();
    expect(submitExam(empty, NOW)).toBe(empty);
  });
});

describe('Karteikarten-Filter', () => {
  const card = (id: string, extra: Partial<Flashcard>): Flashcard => ({ id, kind: 'lernkarte', question: '?', ...extra });
  const cards = [
    card('a', { topicId: '01', typ: 'falle', schwierigkeit: 1, deckId: 'd1' }),
    card('b', { topicId: '02', typ: 'wissen', schwierigkeit: 2, deckId: 'd2' }),
    card('c', { topicId: '01', kind: 'prueferfrage' }),
  ];

  it('liest fehlende URL-Parameter als „alle"', () => {
    expect(readCardFilter(new URLSearchParams('thema=01&typ=falle'))).toEqual({
      thema: '01',
      deck: 'alle',
      art: 'alle',
      typ: 'falle',
      stufe: 'alle',
      markiert: 'alle',
    });
  });

  it('„alle" entfernt den Parameter, andere Parameter bleiben', () => {
    const next = withCardFilter(new URLSearchParams('thema=01&typ=falle'), { thema: 'alle', deck: 'd1' });
    expect(next.toString()).toBe('typ=falle&deck=d1');
  });

  it('filtert nach allen Kriterien gleichzeitig', () => {
    const ids = (q: string) => filterCards(cards, readCardFilter(new URLSearchParams(q))).map((c) => c.id);
    expect(ids('')).toEqual(['a', 'b', 'c']);
    expect(ids('thema=01')).toEqual(['a', 'c']);
    expect(ids('thema=01&art=prueferfrage')).toEqual(['c']);
    expect(ids('stufe=2')).toEqual(['b']);
    expect(ids('deck=d1&typ=falle')).toEqual(['a']);
  });

  it('„Nur markierte“ (?markiert=1) lässt sich mit den anderen Filtern kombinieren', () => {
    const markiert = new Set(['a', 'c']);
    const ids = (q: string) => filterCards(cards, readCardFilter(new URLSearchParams(q)), markiert).map((c) => c.id);
    expect(ids('markiert=1')).toEqual(['a', 'c']);
    expect(ids('markiert=1&thema=01&art=prueferfrage')).toEqual(['c']);
    expect(ids('markiert=1&typ=wissen')).toEqual([]);
    // ohne die Menge der markierten Karten bleibt nichts übrig; andere Werte als 1 gelten als „alle“
    expect(filterCards(cards, readCardFilter(new URLSearchParams('markiert=1'))).map((c) => c.id)).toEqual([]);
    expect(ids('markiert=ja')).toEqual(['a', 'b', 'c']);
    expect(withCardFilter(new URLSearchParams('markiert=1&typ=falle'), { markiert: 'alle' }).toString()).toBe('typ=falle');
  });

  it('„Fallen wiederholen“ folgt Thema und Deck, nicht den übrigen Filtern', () => {
    const mitFallen = [...cards, card('d', { topicId: '02', typ: 'falle', deckId: 'd2' })];
    const ids = (q: string) => fallenKarten(mitFallen, readCardFilter(new URLSearchParams(q))).map((c) => c.id);
    expect(ids('')).toEqual(['a', 'd']);
    expect(ids('thema=02')).toEqual(['d']);
    expect(ids('deck=d1')).toEqual(['a']);
    expect(ids('deck=d2&typ=wissen&stufe=3&markiert=1')).toEqual(['d']);
    expect(ids('deck=gibt-es-nicht')).toEqual([]);
  });
});
