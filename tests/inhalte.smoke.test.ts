import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../server/loadContent';

// Grober Rauchtest gegen die echten Lernblätter (Kopie in content/, npm run sync-content).
// Bewusst keine Detailprüfungen: Wer ein Lernblatt bearbeitet, soll nur echte Importfehler sehen.
// Das genaue Format prüfen parser.test.ts und lernkarten.test.ts mit den Fixtures in tests/fixtures/inhalt/.
const content = loadContent(CONTENT_DIR);
// Deep Dive 17 (Glossar & Diagramme) ist ein Nachschlagethema ohne Übungsklausur und Lösungsdatei.
const NACHSCHLAGEN = ['17'];
const sheets = content.topics.filter((t) => t.id !== '00' && !NACHSCHLAGEN.includes(t.id));

describe('Echte Lernblätter in content/', () => {
  it('ergeben keine Importhinweise', () => {
    expect(content.issues).toEqual([]);
  });

  it('enthalten alle 16 Deep Dives mit Lösungsdatei, Übungsklausur und Lernzielen', () => {
    expect(sheets.map((t) => t.id)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
    ]);
    for (const t of sheets) {
      expect(t.solutionFile, t.file).toBe(t.file.replace('.md', '_Loesungen.md'));
      expect(t.exam?.blocks.length, t.file).toBeGreaterThan(0);
      expect(t.lernziele.length, t.file).toBeGreaterThan(0);
    }
  });

  it('jede Übungsklausur ergibt 100 Punkte und jede Aufgabe hat eine Musterlösung', () => {
    for (const t of content.topics.filter((x) => !NACHSCHLAGEN.includes(x.id))) expect(t.exam?.totalPoints, t.file).toBe(100);
    const missing = Object.values(content.tasks)
      .filter((t) => !t.solution?.markdown)
      .map((t) => t.id);
    expect(missing).toEqual([]);
  });

  it('liefert Lernkarten mit eindeutigen IDs und Material (ohne persönlichen Lernplan)', () => {
    const cards = content.flashcards.filter((c) => c.kind === 'lernkarte');
    expect(content.decks.length).toBeGreaterThan(0);
    expect(cards.length).toBeGreaterThan(0);
    expect(new Set(content.flashcards.map((c) => c.id)).size).toBe(content.flashcards.length);
    expect(content.materials.map((m) => m.id)).toEqual(['lernzettel-kernthemen', 'themenliste-beispielfragen', 'sql-belegsatz']);
    for (const t of content.topics) expect(t.title, t.file).not.toMatch(/\bKW\b/);
  });
});
