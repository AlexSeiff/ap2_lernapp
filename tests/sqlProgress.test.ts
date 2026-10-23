import { describe, expect, it } from 'vitest';
import { emptyProgress, ProgressSchema, type Progress } from '../shared/progress';
import { addDays } from '../src/lib/progress';
import { recordSolutionShown, recordSqlCheck, recordSqlHint, saveSqlQuery, sqlEntwurf, sqlStatus, sqlSummary } from '../src/lib/sql';
import { activityDays, studyStreak } from '../src/lib/stats';

const T0 = '2026-09-28';
const ID = 'SQL-MH-008';
const Q = 'SELECT 1';

describe('recordSqlCheck', () => {
  it('richtig beim ersten Mal → gelöst, keine Wiederholung, Lerntag gezählt', () => {
    const before = emptyProgress();
    const p = recordSqlCheck(before, ID, true, T0);
    expect(p.sql[ID]).toEqual({ attempts: 1, hintsUsed: 0, lastCheckedAt: T0, zuletztRichtig: true, solvedAt: T0 });
    expect(p.sqlDays).toEqual({ [T0]: 1 });
    expect(sqlStatus(p.sql[ID], T0)).toBe('geloest');
    expect(before).toEqual(emptyProgress()); // unveränderlich
    expect(ProgressSchema.safeParse(p).success).toBe(true);
  });

  it('falsch → Stufe 1, morgen fällig; sofort danach richtig ändert die Wiederholung nicht', () => {
    let p = recordSqlCheck(emptyProgress(), ID, false, T0);
    expect(p.sql[ID]).toMatchObject({ attempts: 1, stage: 1, due: addDays(T0, 1) });
    expect(p.sql[ID].solvedAt).toBeUndefined();
    expect(sqlStatus(p.sql[ID], T0)).toBe('offen');
    p = recordSqlCheck(p, ID, true, T0);
    expect(p.sql[ID]).toMatchObject({ attempts: 2, solvedAt: T0, stage: 1, due: addDays(T0, 1) });
    expect(p.sqlDays[T0]).toBe(2);
    expect(sqlStatus(p.sql[ID], T0)).toBe('geloest');
    expect(sqlStatus(p.sql[ID], addDays(T0, 1))).toBe('faellig');
  });

  it('Stufen 1 → 3 → 7 Tage, danach erledigt', () => {
    let p = recordSqlCheck(emptyProgress(), ID, false, T0);
    const d1 = addDays(T0, 1);
    p = recordSqlCheck(p, ID, true, d1);
    expect(p.sql[ID]).toMatchObject({ stage: 2, due: addDays(d1, 3), solvedAt: d1 });
    const d2 = addDays(d1, 3);
    p = recordSqlCheck(p, ID, true, d2);
    expect(p.sql[ID]).toMatchObject({ stage: 3, due: addDays(d2, 7) });
    const d3 = addDays(d2, 7);
    p = recordSqlCheck(p, ID, true, d3);
    expect(p.sql[ID].stage).toBeUndefined();
    expect(p.sql[ID].due).toBeUndefined();
    expect(p.sql[ID]).toMatchObject({ attempts: 4, solvedAt: d1 });
    expect(sqlStatus(p.sql[ID], addDays(d3, 100))).toBe('geloest');
  });

  it('falsch in einer späteren Stufe → zurück auf Stufe 1', () => {
    let p = recordSqlCheck(emptyProgress(), ID, false, T0);
    p = recordSqlCheck(p, ID, true, addDays(T0, 1));
    p = recordSqlCheck(p, ID, false, addDays(T0, 4));
    expect(p.sql[ID]).toMatchObject({ stage: 1, due: addDays(T0, 5) });
  });

  it('Prüfen löscht den Entwurf – die geprüfte Abfrage kommt beim nächsten Öffnen nicht zurück', () => {
    let p = saveSqlQuery(emptyProgress(), ID, Q);
    expect(sqlEntwurf(p.sql[ID])).toBe(Q);
    p = recordSqlCheck(p, ID, false, T0);
    expect(p.sql[ID]).not.toHaveProperty('lastQuery');
    expect(p.sql[ID].zuletztRichtig).toBe(false);
    expect(sqlEntwurf(p.sql[ID])).toBe('');
    // Danach geschriebener Entwurf wird wieder fortgesetzt.
    p = saveSqlQuery(p, ID, 'SELECT 2');
    expect(sqlEntwurf(p.sql[ID])).toBe('SELECT 2');
  });

  it('ältere Stände: nach einer Prüfung ist die gespeicherte Abfrage die geprüfte – kein Entwurf', () => {
    expect(sqlEntwurf({ attempts: 1, hintsUsed: 0, lastCheckedAt: T0, lastQuery: Q })).toBe('');
    expect(sqlEntwurf({ attempts: 0, hintsUsed: 0, lastQuery: Q })).toBe(Q);
    expect(sqlEntwurf(undefined)).toBe('');
  });

  it('SQL-Lerntage zählen für die Lernserie', () => {
    let p = recordSqlCheck(emptyProgress(), ID, false, addDays(T0, -1));
    p = recordSqlCheck(p, ID, true, T0);
    expect(activityDays(p).has(T0)).toBe(true);
    expect(studyStreak(p, T0)).toMatchObject({ current: 2, today: true });
  });
});

describe('recordSolutionShown', () => {
  it('„mit Lösung“ statt gelöst, morgen zur Wiederholung, kein Versuch', () => {
    let p = recordSolutionShown(emptyProgress(), ID, T0);
    expect(p.sql[ID]).toEqual({ attempts: 0, hintsUsed: 0, solutionShown: true, zuletztRichtig: false, stage: 1, due: addDays(T0, 1) });
    expect(p.sqlDays).toEqual({});
    expect(sqlStatus(p.sql[ID], T0)).toBe('mit-loesung');
    // Richtig nach gezeigter Lösung gilt nicht als gelöst, bringt aber die Wiederholung weiter.
    p = recordSqlCheck(p, ID, true, addDays(T0, 1));
    expect(p.sql[ID].solvedAt).toBeUndefined();
    expect(p.sql[ID]).toMatchObject({ stage: 2, due: addDays(T0, 4) });
    expect(sqlStatus(p.sql[ID], addDays(T0, 2))).toBe('mit-loesung');
    expect(sqlStatus(p.sql[ID], addDays(T0, 4))).toBe('faellig');
  });

  it('eine schon gelöste Übung bleibt gelöst', () => {
    let p = recordSqlCheck(emptyProgress(), ID, true, T0);
    p = recordSolutionShown(p, ID, T0);
    expect(p.sql[ID]).toMatchObject({ solvedAt: T0, solutionShown: true, stage: 1 });
    expect(sqlStatus(p.sql[ID], T0)).toBe('geloest');
  });
});

describe('recordSqlHint und saveSqlQuery', () => {
  it('zählt Hinweise hoch, ohne Versuch oder Lerntag', () => {
    let p = recordSqlHint(emptyProgress(), ID);
    p = recordSqlHint(p, ID);
    expect(p.sql[ID]).toEqual({ attempts: 0, hintsUsed: 2 });
    expect(p.sqlDays).toEqual({});
    expect(sqlStatus(p.sql[ID], T0)).toBe('offen');
  });

  it('speichert den Entwurf gekürzt und ändert sonst nichts', () => {
    const p = saveSqlQuery(emptyProgress(), ID, 'y'.repeat(5000));
    expect(p.sql[ID]).toEqual({ attempts: 0, hintsUsed: 0, lastQuery: 'y'.repeat(4000) });
    expect(saveSqlQuery(p, ID, 'y'.repeat(4000))).toBe(p);
  });
});

describe('sqlStatus und sqlSummary', () => {
  it('ohne Stand offen', () => {
    expect(sqlStatus(undefined, T0)).toBe('offen');
  });

  it('zählt gelöst, gesamt und fällige Wiederholungen nur für die übergebenen Übungen', () => {
    let p: Progress = emptyProgress();
    p = recordSqlCheck(p, 'A', true, T0); // gelöst
    p = recordSqlCheck(p, 'B', false, T0); // morgen fällig
    p = recordSolutionShown(p, 'C', T0); // morgen fällig, mit Lösung
    p = recordSqlCheck(p, 'X', true, T0); // unbekannte Übung
    expect(sqlSummary(p, ['A', 'B', 'C', 'D'], T0)).toEqual({ solved: 1, total: 4, due: 0 });
    expect(sqlSummary(p, ['A', 'B', 'C', 'D'], addDays(T0, 1))).toEqual({ solved: 1, total: 4, due: 2 });
  });
});
