// Textmarker: reine Funktionen auf Zeichenstellen, Speicherung im Fortschritt (Version 10), Migration, Zusammenführen.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mergeProgress } from '../domain/mergeProgress';
import { emptyProgress, migrateProgress, ProgressSchema, PROGRESS_VERSION } from '../domain/progress';
import { parseBackup } from '../src/lib/backup';
import { beruehrt, entferne, gueltigeMarken, loescheMarken, markenVon, markiere, setzeMarken, type Textmarke } from '../src/lib/textmarker';

const TEXT = 'Nennen Sie drei funktionale Anforderungen an die App.';
const T1 = '2026-11-19T10:00:00.000Z';
const T2 = '2026-11-19T11:00:00.000Z';
const m = (von: number, bis: number, farbe = 1): Textmarke => ({ von, bis, text: TEXT.slice(von, bis), farbe });
const wort = (w: string) => {
  const von = TEXT.indexOf(w);
  return m(von, von + w.length);
};

describe('markiere', () => {
  it('markiert eine Stelle und kürzt Leerraum an den Rändern', () => {
    expect(markiere([], 0, 7, 1, TEXT)).toEqual([m(0, 6)]); // „Nennen “ → „Nennen“
    expect(markiere([], 0, 0, 1, TEXT)).toEqual([]);
    expect(markiere([], 6, 7, 1, TEXT)).toEqual([]); // nur ein Leerzeichen
  });

  it('wirkt über das Ende hinaus nur bis zum Textende', () => {
    expect(markiere([], 48, 99, 1, TEXT)).toEqual([m(49, 53)]); // Leerzeichen am Anfang fällt weg
  });

  it('ordnet nach Stelle, nicht nach Reihenfolge des Markierens', () => {
    const a = markiere([], 20, 30, 1, TEXT);
    const b = markiere(a, 0, 6, 2, TEXT);
    expect(b.map((x) => x.von)).toEqual([0, 20]);
  });

  it('überlappende Auswahl: das Darunterliegende gehört zur neuen Marke, andere Farbe überschreibt', () => {
    const start = [m(0, 20, 1)];
    expect(markiere(start, 10, 30, 1, TEXT)).toEqual([m(0, 30, 1)]);
    // die Auswahl beginnt am Leerzeichen nach „Sie“: dieses fällt aus der neuen Marke, die alte endet davor
    expect(markiere(start, 10, 30, 2, TEXT)).toEqual([m(0, 10, 1), m(11, 30, 2)]);
  });

  it('Marken gleicher Farbe, zwischen denen nur Leerraum liegt, werden eine – bei anderer Farbe oder Text dazwischen nicht', () => {
    const a = markiere([], 0, 6, 1, TEXT);
    expect(markiere(a, 7, 10, 1, TEXT)).toEqual([m(0, 10)]); // „Nennen“ + „Sie“
    expect(markiere(a, 7, 10, 2, TEXT)).toEqual([m(0, 6, 1), m(7, 10, 2)]);
    expect(markiere(a, 11, 15, 1, TEXT)).toEqual([m(0, 6), m(11, 15)]); // „Sie“ dazwischen
    expect(markiere([m(0, 6)], 6, 6, 1, TEXT)).toEqual([m(0, 6)]);
    expect(markiere([m(0, 3)], 3, 6, 1, TEXT)).toEqual([m(0, 6)]);
  });
});

describe('entferne', () => {
  it('lässt unberührte Marken stehen und löscht ganz überdeckte', () => {
    const marken = [wort('Nennen'), wort('funktionale')];
    expect(entferne(marken, 0, 6, TEXT)).toEqual([wort('funktionale')]);
    expect(entferne(marken, 40, 50, TEXT)).toEqual(marken);
  });

  it('teilt eine Marke, wenn aus der Mitte entfernt wird', () => {
    const lang = m(0, 20);
    const r = entferne([lang], 7, 12, TEXT);
    expect(r).toEqual([m(0, 6), m(12, 20)]);
    expect(r.every((x) => x.text === TEXT.slice(x.von, x.bis))).toBe(true);
  });

  it('kürzt am Rand', () => {
    expect(entferne([m(0, 20)], 15, 25, TEXT)).toEqual([m(0, 15)]);
  });
});

describe('beruehrt und gueltigeMarken', () => {
  it('beruehrt: auch halb überdeckt, nicht bei bloßem Aneinanderstoßen', () => {
    const marken = [m(10, 20)];
    expect(beruehrt(marken, 15, 18)).toBe(true);
    expect(beruehrt(marken, 5, 12)).toBe(true);
    expect(beruehrt(marken, 20, 25)).toBe(false);
    expect(beruehrt(marken, 0, 10)).toBe(false);
  });

  it('gueltigeMarken: nur Marken, deren Wortlaut noch an der Stelle steht', () => {
    const marken = [wort('Nennen'), wort('App.')];
    expect(gueltigeMarken(marken, TEXT)).toEqual(marken);
    expect(gueltigeMarken(marken, 'Nenne Sie drei funktionale Anforderungen an die App.')).toEqual([]);
    expect(gueltigeMarken(marken, 'Nennen')).toEqual([marken[0]]);
  });
});

describe('Speicherung im Fortschritt', () => {
  it('setzen, lesen, löschen – entfernt bleibt als leere Liste mit Zeitpunkt', () => {
    let p = setzeMarken(emptyProgress(), '01-A1', [wort('Nennen')], T1);
    expect(markenVon(p, '01-A1')).toEqual([wort('Nennen')]);
    expect(p.hervorhebungen['01-A1'].am).toBe(T1);
    p = loescheMarken(p, '01-A1', T2);
    expect(markenVon(p, '01-A1')).toEqual([]);
    expect(p.hervorhebungen['01-A1']).toEqual({ marken: [], am: T2 });
  });

  it('ändert nichts, wenn nichts zu ändern ist (auch nicht den Zeitpunkt)', () => {
    const leer = emptyProgress();
    expect(setzeMarken(leer, 'x', [], T1)).toBe(leer);
    const p = setzeMarken(leer, 'x', [wort('Sie')], T1);
    expect(setzeMarken(p, 'x', [wort('Sie')], T2)).toBe(p);
  });

  it('Schema und Speichern lassen Textmarken zu', () => {
    const p = setzeMarken(emptyProgress(), '01-A1', [wort('Nennen')], T1);
    expect(ProgressSchema.safeParse(p).success).toBe(true);
    expect(ProgressSchema.safeParse(p).success).toBe(true);
  });
});

describe('Version 10: Migration und Zusammenführen', () => {
  const fixture = (name: string) => JSON.parse(readFileSync(join(import.meta.dirname, 'fixtures', name), 'utf8'));

  it('Version 9 → 10: leere Textmarken, alles andere bleibt', () => {
    const v9 = fixture('fortschritt-v9-2026-11-19.json');
    expect(v9.version).toBe(9);
    expect(PROGRESS_VERSION).toBeGreaterThanOrEqual(10);
    const { hervorhebungen, version, ...rest } = migrateProgress(v9);
    expect(hervorhebungen).toEqual({});
    expect(version).toBe(PROGRESS_VERSION);
    const { version: _v, ...ursprung } = v9;
    expect(rest).toMatchObject({ attempts: ursprung.attempts });
    expect(ProgressSchema.safeParse(migrateProgress(v9)).success).toBe(true);
  });

  it('ungültige Textmarken fallen bei der Migration weg, gültige bleiben', () => {
    const roh = {
      ...fixture('fortschritt-v9-2026-11-19.json'),
      version: 10,
      hervorhebungen: {
        gut: {
          am: T1,
          marken: [
            { von: 0, bis: 3, text: 'Abc', farbe: 2 },
            { von: 5, bis: 5, text: '', farbe: 1 },
            { von: -1, bis: 2, text: 'x', farbe: 1 },
            'kaputt',
          ],
        },
        ohneZeit: { marken: [] },
        keineListe: { am: T1, marken: 'x' },
      },
    };
    const p = migrateProgress(roh);
    expect(Object.keys(p.hervorhebungen)).toEqual(['gut']);
    expect(p.hervorhebungen.gut.marken).toEqual([{ von: 0, bis: 3, text: 'Abc', farbe: 2 }]);
  });

  it('eine Sicherung von heute bleibt beim Importieren erhalten', () => {
    const p = setzeMarken(emptyProgress(), '01-A1', [wort('Nennen')], T1);
    const roh = JSON.stringify(p);
    const r = parseBackup(roh);
    expect(r.hervorhebungen['01-A1'].marken).toEqual([wort('Nennen')]);
  });

  it('Zusammenführen: je Bereich die neuere Änderung gewinnt, auch ein Entfernen', () => {
    const hier = setzeMarken(setzeMarken(emptyProgress(), 'a', [wort('Nennen')], T1), 'b', [wort('Sie')], T1);
    const dort = setzeMarken(setzeMarken(emptyProgress(), 'a', [wort('drei')], T2), 'c', [wort('App.')], T1);
    const dortGeloescht = loescheMarken(setzeMarken(emptyProgress(), 'b', [wort('Sie')], T1), 'b', T2);
    const r = mergeProgress(hier, dort);
    expect(markenVon(r, 'a')).toEqual([wort('drei')]); // später geändert
    expect(markenVon(r, 'b')).toEqual([wort('Sie')]); // nur hier
    expect(markenVon(r, 'c')).toEqual([wort('App.')]); // nur dort
    expect(markenVon(mergeProgress(hier, dortGeloescht), 'b')).toEqual([]); // dort später entfernt
    expect(markenVon(mergeProgress(dortGeloescht, hier), 'b')).toEqual([]); // und umgekehrt: Entfernen ist neuer
  });
});
