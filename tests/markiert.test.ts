// Karten markieren (Umsetzungsplan Phase 4): Datenmodell (Version 7), Migration, Zusammenführen, reine Funktionen.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mergeProgress } from '../shared/mergeProgress';
import { checkProgressPut, emptyProgress, migrateProgress, PROGRESS_VERSION, ProgressSchema, type Progress } from '../shared/progress';
import { parseBackup } from '../src/lib/backup';
import { istMarkiert, markierteIds, setzeMarkierung, wechsleMarkierung } from '../src/lib/markiert';
import { rateCard } from '../src/lib/progress';
import { ohneAntworten } from './ohneAntworten';

const roh = (name: string) => readFileSync(join(import.meta.dirname, 'fixtures', name), 'utf8');
const T1 = '2026-10-08T10:00:00.000Z';
const T2 = '2026-10-09T10:00:00.000Z';

describe('Markierungen – reine Funktionen', () => {
  it('markieren, entmarkieren und umschalten; entmarkiert bleibt mit Zeitpunkt stehen', () => {
    let p = setzeMarkierung(emptyProgress(), '01-pf1', true, T1);
    expect(istMarkiert(p, '01-pf1')).toBe(true);
    expect(p.markiert['01-pf1']).toEqual({ an: true, am: T1 });
    p = wechsleMarkierung(p, '01-pf1', T2);
    expect(istMarkiert(p, '01-pf1')).toBe(false);
    expect(p.markiert['01-pf1']).toEqual({ an: false, am: T2 });
    p = wechsleMarkierung(p, 'ML-001', T2);
    expect([...markierteIds(p)]).toEqual(['ML-001']);
  });

  it('gleicher Zustand ändert nichts (auch nicht den Zeitpunkt)', () => {
    const p = setzeMarkierung(emptyProgress(), 'a', true, T1);
    expect(setzeMarkierung(p, 'a', true, T2)).toBe(p);
    const leer = emptyProgress();
    expect(setzeMarkierung(leer, 'a', false, T2)).toBe(leer);
  });

  it('Markieren ändert nichts an der Wiederholungsplanung: eine neue Karte bleibt neu, das Fach bleibt', () => {
    const neu = setzeMarkierung(emptyProgress(), 'a', true, T1);
    expect(neu.cards).toEqual({});
    const gelernt = rateCard(emptyProgress(), 'a', 'gewusst', '2026-10-01');
    const markiert = wechsleMarkierung(gelernt, 'a', T1);
    expect(markiert.cards).toBe(gelernt.cards);
    expect(markiert.cardReviewDays).toBe(gelernt.cardReviewDays);
  });
});

describe('Markierungen – Format Version 7', () => {
  it('Version 6 → 7: ergänzt leere Markierungen, alles andere bleibt', () => {
    const raw = JSON.parse(roh('fortschritt-v6-2026-10-01.json'));
    const migrated = migrateProgress(raw);
    expect(PROGRESS_VERSION).toBeGreaterThanOrEqual(7);
    expect(migrated).toEqual(ohneAntworten({ ...raw, version: PROGRESS_VERSION, markiert: {}, diagramme: {}, diagrammDays: {} }));
    expect(checkProgressPut(migrated, raw)).toMatchObject({ ok: true, progress: { version: PROGRESS_VERSION, revision: 35 } });
  });

  it('Version 7 lädt unverändert, auch entmarkierte Einträge und markierte Karten ohne Lernstand', () => {
    const raw = JSON.parse(roh('fortschritt-v7-2026-10-09.json'));
    const migrated = migrateProgress(raw);
    expect(migrated).toEqual(ohneAntworten({ ...raw, version: PROGRESS_VERSION, diagramme: {}, diagrammDays: {} }));
    expect(ProgressSchema.safeParse(raw).success).toBe(true);
    expect([...markierteIds(migrated)].sort()).toEqual(['01-pf1', 'FB-normalisierung']);
    expect(migrated.cards['FB-normalisierung']).toBeUndefined();
    expect(checkProgressPut(migrated, raw)).toMatchObject({ ok: true, progress: { revision: 41 } });
  });

  it('alte Sicherungen bleiben importierbar (parseBackup), ohne Markierungen', () => {
    for (const name of ['fortschritt-v1-2026-09-22.json', 'fortschritt-v5-2026-09-30.json', 'fortschritt-v6-2026-10-01.json']) {
      const p = parseBackup(roh(name));
      expect(p.version, name).toBe(PROGRESS_VERSION);
      expect(p.markiert, name).toEqual({});
    }
    expect(Object.keys(parseBackup(roh('fortschritt-v7-2026-10-09.json')).markiert)).toHaveLength(3);
  });

  it('ungültige Einträge fallen bei der Migration weg, unbekannte Felder bleiben; das Schema lehnt sie ab', () => {
    const migrated = migrateProgress({
      version: 7,
      attempts: [],
      markiert: { a: { an: true, am: T1, quelle: 'handy' }, b: { an: 'ja', am: T1 }, c: { an: true }, d: true },
    });
    expect(migrated.markiert).toEqual({ a: { an: true, am: T1, quelle: 'handy' } });
    expect(ProgressSchema.safeParse({ version: 7, attempts: [], markiert: { a: { an: 1, am: T1 } } }).success).toBe(false);
    expect(ProgressSchema.safeParse({ version: 6, attempts: [] }).success).toBe(true);
    expect(migrateProgress(migrated)).toEqual(migrated);
  });
});

describe('Markierungen – Zusammenführen zweier Geräte', () => {
  const mit = (eintraege: Progress['markiert']): Progress => ({ ...emptyProgress(), markiert: eintraege });

  it('hier markiert, auf dem anderen Gerät später entmarkiert → entmarkiert (und umgekehrt)', () => {
    const hier = mit({ a: { an: true, am: T1 }, b: { an: false, am: T2 } });
    const dort = mit({ a: { an: false, am: T2 }, b: { an: true, am: T1 } });
    const m = mergeProgress(hier, dort).markiert;
    expect(m.a).toEqual({ an: false, am: T2 });
    expect(m.b).toEqual({ an: false, am: T2 });
    expect(mergeProgress(dort, hier).markiert).toEqual(m);
  });

  it('die neuere Markierung gewinnt; nur auf einer Seite vorhanden → bleibt; gleicher Zeitpunkt → aktueller Stand', () => {
    const hier = mit({ a: { an: false, am: T1 }, c: { an: true, am: T1 } });
    const dort = mit({ a: { an: true, am: T2 }, d: { an: true, am: T1 }, c: { an: false, am: T1 } });
    const m = mergeProgress(hier, dort).markiert;
    expect(m).toEqual({ a: { an: true, am: T2 }, c: { an: true, am: T1 }, d: { an: true, am: T1 } });
  });

  it('eine alte Sicherung ohne Markierungen lässt die hiesigen stehen', () => {
    const hier = mit({ a: { an: true, am: T1 } });
    const alt = parseBackup(roh('fortschritt-v6-2026-10-01.json'));
    expect(mergeProgress(hier, alt).markiert).toEqual(hier.markiert);
    expect(mergeProgress(alt, hier).markiert).toEqual(hier.markiert);
  });
});
