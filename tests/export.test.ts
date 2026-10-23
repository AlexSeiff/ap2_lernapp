import { describe, expect, it } from 'vitest';
import { emptyProgress } from '../shared/progress';
import type { Flashcard } from '../shared/types';
import { ankiText, kalenderIcs } from '../src/lib/export';

const content = { decks: [{ id: 'd1', title: 'Fachbegriffe – SQL' }], topics: [], tasks: {} } as never;
const karte = (p: Partial<Flashcard>): Flashcard => ({ id: 'K', kind: 'lernkarte', question: 'Frage?', ...p });

describe('ankiText', () => {
  it('Tabulator-Format mit Kopf, Zeilenumbruch als <br> und Schlagwörtern', () => {
    const text = ankiText([karte({ answer: 'a\nb', topicId: '01', deckId: 'd1', typ: 'wissen' })], content);
    const [sep, html, tags, zeile] = text.trim().split('\n');
    expect([sep, html, tags]).toEqual(['#separator:tab', '#html:true', '#tags column:3']);
    expect(zeile.split('\t')).toEqual(['Frage?', 'a<br>b', 'DD01 Fachbegriffe_SQL wissen']);
  });
  it('Begriffskarte: abgeleitete Frage ohne Sterne; Rechenweg hinter der Antwort', () => {
    const t = ankiText([karte({ question: 'Lohnsteuer', typ: 'begriff', answer: 'Vorauszahlung', deckId: 'd1' })], content);
    expect(t).toContain('Was versteht man unter Lohnsteuer (SQL)?');
    const r = ankiText([karte({ typ: 'rechnung', answer: 'x', rechenweg: '$1+1$' })], content);
    expect(r).toContain('x<br><br>$1+1$');
  });
});

describe('kalenderIcs', () => {
  it('fasst Fälligkeiten je Tag zusammen, Vergangenes landet auf heute, Prüfungstermin als Ereignis', () => {
    const p = emptyProgress();
    p.cards = {
      a: { box: 1, due: '2026-10-01', reviews: 1 },
      b: { box: 1, due: '2026-10-22', reviews: 1 },
      c: { box: 1, due: '2026-10-22', reviews: 1 },
    };
    p.settings = { ...p.settings, examDate: '2026-12-15' };
    const ics = kalenderIcs(p, '2026-10-20', new Date('2026-10-20T10:00:00Z'));
    expect(ics).toContain('SUMMARY:AP2: 1 Karten');
    expect(ics).toContain('SUMMARY:AP2: 2 Karten');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261020');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261222'.replace('1222', '1215'));
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
  });
});
