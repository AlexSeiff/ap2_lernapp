import { describe, expect, it } from 'vitest';
import type { Flashcard, Task } from '../shared/types';
import { ALTKLAUSUR_TAG, altklausurThemen, istAltklausurAufgabe, istAltklausurKarte, istAltklausurThema } from '../src/lib/altklausur';
import { aufgabenGeordnet, aufgabenImModus, naechsteAufgabe } from '../src/lib/aufgabenFolge';
import { filterCards, readCardFilter, withCardFilter } from '../src/lib/cards';

const topics = [
  { id: '01', title: 'SQL' },
  { id: '18', title: 'Altklausur-Training Prozessanalyse' },
  { id: '19', title: 'Altklausur-Training Datenqualität' },
];
const karte = (id: string, extra: Partial<Flashcard>): Flashcard => ({ id, kind: 'lernkarte', question: '?', ...extra });
const aufgabe = (id: string, topicId: string): Task =>
  ({ id, code: id, topicId, block: 'A', points: 5, markdown: 'x', type: 'offen' }) as Task;

describe('Altklausur-Merkmal', () => {
  it('erkennt Themen am Titel', () => {
    expect(istAltklausurThema({ title: 'Altklausur-Training WiSo' })).toBe(true);
    expect(istAltklausurThema({ title: 'altklausur …' })).toBe(true);
    expect(istAltklausurThema({ title: 'Statistik I' })).toBe(false);
    expect([...altklausurThemen(topics)]).toEqual(['18', '19']);
  });

  it('Karten: Thema oder Tag', () => {
    const themen = altklausurThemen(topics);
    expect(istAltklausurKarte(karte('a', { topicId: '18' }), themen)).toBe(true);
    expect(istAltklausurKarte(karte('b', { topicId: '01', tags: ['sql', ALTKLAUSUR_TAG] }), themen)).toBe(true);
    expect(istAltklausurKarte(karte('c', { topicId: '01', tags: ['sql'] }), themen)).toBe(false);
    expect(istAltklausurKarte(karte('d', {}), themen)).toBe(false);
  });

  it('Aufgaben: nach dem Thema', () => {
    const themen = altklausurThemen(topics);
    expect(istAltklausurAufgabe(aufgabe('18-A1', '18'), themen)).toBe(true);
    expect(istAltklausurAufgabe(aufgabe('01-A1', '01'), themen)).toBe(false);
  });
});

describe('Karten-Filter „nur Altklausur“', () => {
  const cards = [karte('a', { topicId: '01' }), karte('b', { topicId: '18' }), karte('c', { topicId: '01', tags: [ALTKLAUSUR_TAG] })];
  const themen = altklausurThemen(topics);
  const ids = (q: string) => filterCards(cards, readCardFilter(new URLSearchParams(q)), new Set(), themen).map((c) => c.id);

  it('liest ?altklausur=1, alles andere gilt als „alle“', () => {
    expect(readCardFilter(new URLSearchParams('altklausur=1')).altklausur).toBe('1');
    expect(readCardFilter(new URLSearchParams('altklausur=ja')).altklausur).toBe('alle');
    expect(withCardFilter(new URLSearchParams('altklausur=1&typ=falle'), { altklausur: 'alle' }).toString()).toBe('typ=falle');
  });

  it('lässt nur Karten der Altklausur-Themen oder mit Tag durch und kombiniert mit anderen Filtern', () => {
    expect(ids('')).toEqual(['a', 'b', 'c']);
    expect(ids('altklausur=1')).toEqual(['b', 'c']);
    expect(ids('altklausur=1&thema=18')).toEqual(['b']);
    // ohne die Themenmenge zählt nur das Tag
    expect(filterCards(cards, readCardFilter(new URLSearchParams('altklausur=1'))).map((c) => c.id)).toEqual(['c']);
  });
});

describe('Aufgabenfolge', () => {
  const tasks = Object.fromEntries(
    [aufgabe('18-A2', '18'), aufgabe('01-A1', '01'), aufgabe('18-A10', '18'), aufgabe('19-A1', '19'), aufgabe('18-A1', '18')].map((t) => [
      t.id,
      t,
    ]),
  );

  it('ordnet nach Thema, dann nach Aufgaben-Id mit Zahlen als Zahlen', () => {
    expect(aufgabenGeordnet(topics, tasks).map((t) => t.id)).toEqual(['01-A1', '18-A1', '18-A2', '18-A10', '19-A1']);
  });

  it('Altklausur-Modus lässt nur Aufgaben der Altklausur-Themen zu', () => {
    expect(aufgabenImModus(topics, tasks, true).map((t) => t.id)).toEqual(['18-A1', '18-A2', '18-A10', '19-A1']);
    expect(aufgabenImModus(topics, tasks, false)).toHaveLength(5);
  });

  it('„Nächste Aufgabe“: nächste unbearbeitete, dann von vorn, sonst die nächste', () => {
    const folge = aufgabenImModus(topics, tasks, true);
    expect(naechsteAufgabe(folge, '18-A1', new Set())).toBe('18-A2');
    expect(naechsteAufgabe(folge, '18-A1', new Set(['18-A2']))).toBe('18-A10');
    expect(naechsteAufgabe(folge, '19-A1', new Set(['18-A2']))).toBe('18-A1');
    expect(naechsteAufgabe(folge, '18-A2', new Set(['18-A1', '18-A2', '18-A10', '19-A1']))).toBe('18-A10');
    expect(naechsteAufgabe(folge, 'gibt-es-nicht', new Set())).toBeUndefined();
    expect(naechsteAufgabe([folge[0]], folge[0].id, new Set())).toBeUndefined();
  });
});
