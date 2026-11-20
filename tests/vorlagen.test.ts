import { describe, expect, it } from 'vitest';
import { registriereVorlagen, VORLAGEN } from '../src/rechnen/vorlagen';
import type { RechenWert } from '../domain/types';

// Jede Rechenvorlage muss in sich stimmig sein (Umbauplan Phase 7): Wer eine Vorlage in vorlagen/index.ts einträgt, bekommt diese
// Prüfungen automatisch – dieselben Pflichtangaben und Gegenproben für alle.
const SEEDS = [1, 2, 3, 42, 20260930];
const endlich = (w: RechenWert) => (typeof w === 'number' ? Number.isFinite(w) : Array.isArray(w) ? w.every(Number.isFinite) : true);

describe('Vorlagen-Liste', () => {
  it('weist doppelte IDs ab, statt sie zu überschreiben', () => {
    const v = Object.values(VORLAGEN)[0];
    expect(() => registriereVorlagen([v, v])).toThrow(/Doppelte Rechenvorlage/);
  });

  it('enthält alle 36 Vorlagen mit eindeutiger, schreibbarer ID', () => {
    const ids = Object.keys(VORLAGEN);
    expect(ids).toHaveLength(36);
    for (const id of ids) {
      expect(id, id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(VORLAGEN[id].id).toBe(id);
    }
  });
});

describe.each(Object.values(VORLAGEN).map((v) => [v.id, v] as const))('Vorlage %s', (_id, v) => {
  it('hat Titel, Bereich, Beschreibung und Hinweise', () => {
    for (const feld of [v.titel, v.bereich, v.beschreibung]) expect(feld.trim().length).toBeGreaterThan(2);
    expect(Array.isArray(v.hinweise)).toBe(true);
  });

  it.each(SEEDS)('Seed %i: Zufallsdaten passen zum Schema und die Lösung ist vollständig und endlich', (seed) => {
    const daten = v.schema.parse(v.erzeuge(seed, {}));
    const l = v.loese(daten);
    const ids = Object.keys(l.werte);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(endlich(l.werte[id]), `${id}=${String(l.werte[id])}`).toBe(true);
    // Angaben und typische Fehler beziehen sich auf vorhandene Ergebnisse.
    for (const id of Object.keys(l.felder)) expect(ids, `Feld ${id}`).toContain(id);
    for (const f of l.fehlerbilder) {
      expect(ids, `Fehlerbild zu ${f.eingabe}`).toContain(f.eingabe);
      expect(f.text.trim().length).toBeGreaterThan(5);
      expect(endlich(f.wert)).toBe(true);
    }
    for (const [name, wert] of Object.entries(v.platzhalter(daten))) {
      expect(typeof wert, `Platzhalter ${name}`).toBe('string');
    }
  });

  it('ist bei gleichem Seed reproduzierbar', () => {
    expect(v.erzeuge(7, {})).toEqual(v.erzeuge(7, {}));
  });
});
