import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { examMinutes } from '../src/lib/examTimer';
import { klausurFuer } from '../src/lib/mischKlausur';
import { examSheet } from '../src/lib/sheets';

// Bearbeitungszeit je Klausur gegen die echten Lernblätter: WiSo 60 Minuten, Fachklausuren 90 (steht im Titel der Übungsklausur).
const content = loadContent(CONTENT_DIR);
const minuten = (id: string) => examMinutes(klausurFuer(content, id)!.exam);

describe('Bearbeitungszeit der Übungsklausuren', () => {
  it('WiSo-Klausur läuft 60 Minuten, Fachklausur 90', () => {
    expect(content.topics.find((t) => t.id === '13')!.exam!.title).toBe('Übungsklausur WiSo I (100 Punkte, 60 Minuten)');
    expect(minuten('13')).toBe(60);
    expect(minuten('01')).toBe(90);
  });

  it('jede Übungsklausur nennt ihre Dauer im Titel: WiSo 60, alle anderen 90', () => {
    const klausuren = content.topics.filter((t) => t.exam);
    expect(klausuren.length).toBeGreaterThan(20);
    for (const t of klausuren) {
      expect(t.exam!.title, t.file).toMatch(/\d+ Minuten/);
      expect(examMinutes(t.exam), t.file).toBe(/WiSo/.test(t.exam!.title) ? 60 : 90);
    }
    expect(klausuren.filter((t) => examMinutes(t.exam) === 60).length).toBeGreaterThanOrEqual(5);
  });

  it('die gemischte Probeklausur bleibt bei 90 Minuten', () => {
    expect(minuten('mix-gemischt-42')).toBe(90);
    expect(minuten('mix-prozess-7')).toBe(90);
  });

  it('das Deckblatt (Druck) bekommt dieselbe Dauer', () => {
    expect(examSheet(content, '13', 'aufgaben')!.minuten).toBe(60);
    expect(examSheet(content, '01', 'aufgaben')!.minuten).toBe(90);
    expect(examSheet(content, 'mix-gemischt-42', 'aufgaben')!.minuten).toBe(90);
  });
});
