import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { AUFGABEN_UMZUG_V9 } from '../shared/aufgabenUmzug';
import { migrateProgress, PROGRESS_VERSION } from '../shared/progress';

// Übungsklausuren im Format der Altklausuren (Oktober 2026): Aufgaben mit neuem Code ziehen beim Laden um (Fortschritt Version 9).

const content = loadContent(CONTENT_DIR);

describe('Umzug der Aufgaben-IDs (Version 8 → 9)', () => {
  it('jedes Ziel gibt es, keine alte ID bleibt stehen und keine zwei ziehen auf dasselbe Ziel', () => {
    const ziele = Object.values(AUFGABEN_UMZUG_V9);
    for (const z of ziele) expect(content.tasks[z], z).toBeDefined();
    expect(new Set(ziele).size).toBe(ziele.length);
    // Eine alte ID, die selbst kein Ziel ist, gibt es nicht mehr – außer drei neuen WiSo-Aufgaben in DD14, die frei gewordene
    // Codes übernehmen; ihr alter Lernstand ist zur verschobenen Aufgabe umgezogen, die neue beginnt leer.
    const neueAufgaben = ['14-B6', '14-D5', '14-D6'];
    for (const alt of Object.keys(AUFGABEN_UMZUG_V9))
      if (!ziele.includes(alt) && !neueAufgaben.includes(alt)) expect(content.tasks[alt], alt).toBeUndefined();
  });

  it('Versuche, Fehlerjournal und Klausurläufe ziehen um, alles andere bleibt', () => {
    const lauf = (id: string) => ({
      id,
      topicId: '03',
      startedAt: 's',
      max: 100,
      answers: { '03-E3': 'Box', '03-B1': 'Tabelle' },
      scores: { '03-E3': 6, '03-B1': 9 },
      sicherheit: { '03-E3': 2 },
      fehlergrund: { '03-B1': 'zeit' },
    });
    const m = migrateProgress({
      version: 8,
      attempts: [
        { taskId: '03-E3', date: 'd', points: 4, max: 6, mode: 'einzel' },
        { taskId: '01-A1', date: 'd', points: 6, max: 6, mode: 'einzel' },
        { taskId: '14-B6', date: 'd', points: 4, max: 4, mode: 'klausur' },
      ],
      journal: { '03-B1': { taskId: '03-B1', addedAt: 'a', stage: 1, due: 'd', lastPoints: 5, max: 9 } },
      exams: [lauf('e1')],
      activeExam: lauf('aktiv'),
    });
    expect(m.version).toBe(PROGRESS_VERSION);
    expect(m.attempts.map((a) => a.taskId)).toEqual(['03-D3', '01-A1', '14-C1']);
    expect(Object.keys(m.journal)).toEqual(['03-A3']);
    expect(m.journal['03-A3'].taskId).toBe('03-A3');
    for (const e of [m.exams[0], m.activeExam!]) {
      expect(e.answers).toEqual({ '03-D3': 'Box', '03-A3': 'Tabelle' });
      expect(e.scores).toEqual({ '03-D3': 6, '03-A3': 9 });
      expect(e.sicherheit).toEqual({ '03-D3': 2 });
      expect(e.fehlergrund).toEqual({ '03-A3': 'zeit' });
    }
    // Ein Stand der Version 9 zieht nicht noch einmal um (03-A3 ist dann schon die neue Aufgabe).
    expect(migrateProgress(m)).toEqual(m);
  });
});
