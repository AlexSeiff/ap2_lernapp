import { describe, expect, it } from 'vitest';
import { emptyProgress, type Progress } from '../shared/progress';
import type { Flashcard } from '../shared/types';
import { FARBEN, themaFarbe, TYP_FARBE } from '../src/lib/farben';
import { faelligText, kartenstand, passtZurSuche, sortiereStand, standVon } from '../src/lib/kartenstand';
import { rateCard, rateCardLeicht } from '../src/lib/progress';

// Kartenstand: Karten nach der letzten Bewertung (gewusst, unsicher, nicht gewusst).

const karte = (id: string, extra: Partial<Flashcard> = {}): Flashcard => ({ id, kind: 'lernkarte', question: `Frage ${id}`, ...extra });
const pool = [karte('A'), karte('B'), karte('C'), karte('D', { answer: 'Der Median ist robust', tags: ['lagemass'] }), karte('E')];

describe('Kartenstand', () => {
  it('teilt nach der letzten Bewertung auf; unbewertete Karten zählen als neu', () => {
    let p: Progress = emptyProgress();
    p = rateCard(p, 'A', 'gewusst', '2026-10-01');
    p = rateCard(p, 'B', 'unsicher', '2026-10-01');
    p = rateCard(p, 'C', 'nicht', '2026-10-01');
    p = rateCard(p, 'C', 'gewusst', '2026-10-02'); // die letzte Bewertung zählt
    p = rateCardLeicht(p, 'D', false, '2026-10-02');
    const s = kartenstand(pool, p);
    expect(s.gruppen.gewusst.map((e) => e.card.id)).toEqual(['A', 'C']);
    expect(s.gruppen.unsicher.map((e) => e.card.id)).toEqual(['B']);
    expect(s.gruppen.nicht.map((e) => e.card.id)).toEqual(['D']);
    expect(s.neu).toBe(1);
    expect(s.gesamt).toBe(5);
  });

  it('nur Karten im Pool: ausgeschaltete Karten mit Stand zählen nicht mit', () => {
    const p = rateCard(emptyProgress(), 'X', 'gewusst', '2026-10-01');
    const s = kartenstand(pool, p);
    expect(s.gruppen.gewusst).toHaveLength(0);
    expect(s.neu).toBe(5);
  });

  it('ältere Stände ohne „last“: ab Fach 2 gewusst, sonst unsicher', () => {
    expect(standVon({ box: 3, due: '2026-10-01', reviews: 2 })).toBe('gewusst');
    expect(standVon({ box: 1, due: '2026-10-01', reviews: 2 })).toBe('unsicher');
    expect(standVon({ box: 1, due: '2026-10-01', reviews: 2, last: 'nicht' })).toBe('nicht');
  });

  it('sortiert nach Fälligkeit oder Fach; „thema“ lässt die Reihenfolge des Pools', () => {
    const e = (id: string, box: number, due: string) => ({
      card: karte(id),
      state: { box, due, reviews: 1, last: 'gewusst' as const },
      stand: 'gewusst' as const,
    });
    const liste = [e('a', 3, '2026-10-05'), e('b', 1, '2026-10-09'), e('c', 2, '2026-10-01')];
    expect(sortiereStand(liste, 'faellig').map((x) => x.card.id)).toEqual(['c', 'a', 'b']);
    expect(sortiereStand(liste, 'fach').map((x) => x.card.id)).toEqual(['b', 'c', 'a']);
    expect(sortiereStand(liste, 'thema')).toBe(liste);
  });

  it('Suche in Frage, Antwort, Tags und Id, ohne Groß-/Kleinschreibung', () => {
    expect(passtZurSuche(pool[3], 'median')).toBe(true);
    expect(passtZurSuche(pool[3], 'LAGEMASS')).toBe(true);
    expect(passtZurSuche(pool[3], 'd')).toBe(true);
    expect(passtZurSuche(pool[0], 'median')).toBe(false);
    expect(passtZurSuche(pool[0], '  ')).toBe(true);
  });

  it('nächste Wiederholung als Text', () => {
    expect(faelligText('2026-10-10', '2026-10-10')).toBe('fällig');
    expect(faelligText('2026-10-01', '2026-10-10')).toBe('fällig');
    expect(faelligText('2026-10-11', '2026-10-10')).toBe('morgen');
    expect(faelligText('2026-11-09', '2026-10-10')).toBe('in 30 Tagen');
  });
});

describe('Farben', () => {
  it('Themen reihum aus der Palette, Nachbarn verschieden; ohne Nummer Schiefer', () => {
    expect(themaFarbe('01')).toBe(FARBEN[0]);
    expect(themaFarbe('09')).toBe(FARBEN[0]);
    for (let n = 1; n < 20; n++) expect(themaFarbe(String(n).padStart(2, '0'))).not.toBe(themaFarbe(String(n + 1).padStart(2, '0')));
    expect(themaFarbe('00')).toBe('slate');
    expect(themaFarbe(undefined)).toBe('slate');
  });

  it('jeder Kartentyp hat eine Farbe, Fallen sind rot', () => {
    expect(TYP_FARBE.falle).toBe('red');
    expect(new Set(Object.values(TYP_FARBE)).size).toBe(Object.keys(TYP_FARBE).length);
  });
});
