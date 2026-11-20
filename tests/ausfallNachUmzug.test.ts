import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { emptyProgress, migrateProgress, type Progress } from '../domain/progress';
import {
  arbeiteAusfallAenderungenEin,
  createAutoProgressStore,
  leseUmzugsMarke,
  textHash,
  UMZUG_KEY,
} from '../src/lib/fortschrittSpeicher';
import { createIdbFortschritt, oeffneDb } from '../src/lib/idbFortschritt';
import { createLocalProgressStore, PROGRESS_KEY } from '../src/lib/localFortschritt';
import { recordAttempt } from '../src/lib/progress';

// Review-Befund 3: Geht IndexedDB nach dem Umzug in einer Sitzung nicht, arbeitet die App mit dem (inzwischen alten) localStorage-Stand weiter. Diese Eingaben dürfen
// nicht verloren gehen, wenn IndexedDB wieder geht.
const versuch = (p: Progress, id: string) => recordAttempt(p, { taskId: id, date: 'd', points: 1, max: 1, mode: 'einzel' }, '2026-09-22');
const ids = (p: unknown) =>
  migrateProgress(p)
    .attempts.map((a) => a.taskId)
    .sort();

function kv(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

afterEach(() => vi.unstubAllGlobals());

/** Ein „Browserprofil“: gemeinsamer localStorage und gemeinsame IndexedDB; jeder Aufruf von start() ist ein neuer Tag mit frischer Speicherwahl. */
function browser(anfang: Progress) {
  const speicher = kv({ [PROGRESS_KEY]: JSON.stringify(anfang) });
  vi.stubGlobal('localStorage', speicher);
  const factory = new IDBFactory();
  const start = (idbGeht: boolean) =>
    createAutoProgressStore(
      createLocalProgressStore(() => speicher),
      idbGeht
        ? async () => createIdbFortschritt(await oeffneDb(() => factory), undefined)
        : async () => {
            throw new Error('IndexedDB gesperrt');
          },
    );
  return { speicher, start };
}

describe('IndexedDB fällt nach dem Umzug aus und kommt wieder', () => {
  it('Tag 1 Umzug, Tag 2 ohne IndexedDB mit eigenen Eingaben, Tag 3 wieder mit IndexedDB: nichts ist verloren', async () => {
    const b = browser(versuch(emptyProgress(), '01-A1'));

    const tag1 = b.start(true);
    expect(await tag1.art()).toBe('indexeddb');
    expect(ids(await tag1.read())).toEqual(['01-A1']);
    await tag1.save(versuch(versuch(emptyProgress(), '01-A1'), '01-A2')); // Tag 1 lernt weiter, nur in IndexedDB

    const tag2 = b.start(false);
    expect(await tag2.art()).toBe('localstorage');
    expect((await tag2.speicherInfo()).umgezogen).toBe(true);
    // Die Sitzung sieht den (älteren) localStorage-Stand und arbeitet darauf.
    const lokal = migrateProgress(await tag2.read());
    expect(lokal.attempts.map((a) => a.taskId)).toEqual(['01-A1']);
    await tag2.save(versuch(lokal, '02-B1'));

    const tag3 = b.start(true);
    expect(await tag3.art()).toBe('indexeddb');
    // IndexedDB hatte 01-A1 und 01-A2, der localStorage 01-A1 und 02-B1: Alles ist da.
    expect(ids(await tag3.read())).toEqual(['01-A1', '01-A2', '02-B1']);

    // Ein weiterer Start fasst nichts noch einmal an.
    const tag4 = b.start(true);
    expect(ids(await tag4.read())).toEqual(['01-A1', '01-A2', '02-B1']);
  });

  it('die Warnung kennt den Zustand: ohne Umzug ist der localStorage kein Rückfall, nach dem Umzug schon', async () => {
    const b = browser(emptyProgress());
    expect(await b.start(false).speicherInfo()).toEqual({ art: 'localstorage', umgezogen: false });
    b.speicher.data.delete(UMZUG_KEY);
    await b.start(true).read();
    expect(await b.start(false).speicherInfo()).toEqual({ art: 'localstorage', umgezogen: true });
    expect(await b.start(true).speicherInfo()).toEqual({ art: 'indexeddb', umgezogen: true });
  });
});

describe('arbeiteAusfallAenderungenEin', () => {
  const fakeIdb = (gespeichert: Progress) => {
    const save = vi.fn(async () => null);
    return { speicher: { readText: async () => null, read: async () => gespeichert, save, replace: save }, save };
  };

  it('nichts zu tun ohne localStorage-Stand oder bei unverändertem Stand', async () => {
    const { speicher, save } = fakeIdb(emptyProgress());
    expect(await arbeiteAusfallAenderungenEin(speicher, null, () => kv())).toBe('nichts');
    const text = JSON.stringify(versuch(emptyProgress(), '01-A1'));
    const speicherKv = kv({ [UMZUG_KEY]: JSON.stringify({ am: 'x', hash: textHash(text) }) });
    expect(await arbeiteAusfallAenderungenEin(speicher, text, () => speicherKv)).toBe('nichts');
    expect(save).not.toHaveBeenCalled();
  });

  it('ohne Marke (Umzug durch eine ältere Version) wird nur der Ausgangspunkt gemerkt, nichts zusammengeführt', async () => {
    const { speicher, save } = fakeIdb(emptyProgress());
    const speicherKv = kv({ [UMZUG_KEY]: new Date().toISOString() }); // altes Format: nur ein Zeitstempel
    const text = JSON.stringify(versuch(emptyProgress(), '01-A1'));
    expect(await arbeiteAusfallAenderungenEin(speicher, text, () => speicherKv)).toBe('markiert');
    expect(save).not.toHaveBeenCalled();
    expect(leseUmzugsMarke(() => speicherKv)?.hash).toBe(textHash(text));
  });

  it('ein unlesbarer localStorage-Text wird nicht angefasst', async () => {
    const { speicher, save } = fakeIdb(emptyProgress());
    const speicherKv = kv({ [UMZUG_KEY]: JSON.stringify({ am: 'x', hash: 'anders' }) });
    expect(await arbeiteAusfallAenderungenEin(speicher, '{kaputt', () => speicherKv)).toBe('nichts');
    expect(save).not.toHaveBeenCalled();
  });

  it('Eingaben aus dem Ausfall gewinnen bei den Einstellungen, alles andere wird vereint', async () => {
    const gespeichert = { ...versuch(emptyProgress(), '01-A1'), settings: { ...emptyProgress().settings, examDate: '2026-12-01' } };
    const lokal = { ...versuch(emptyProgress(), '02-B1'), settings: { ...emptyProgress().settings, examDate: '2027-01-15' } };
    const { speicher, save } = fakeIdb(gespeichert);
    const speicherKv = kv({ [UMZUG_KEY]: JSON.stringify({ am: 'x', hash: 'alt' }) });
    expect(await arbeiteAusfallAenderungenEin(speicher, JSON.stringify(lokal), () => speicherKv)).toBe('eingearbeitet');
    const geschrieben = migrateProgress((save.mock.calls[0] as unknown[])[0]);
    expect(geschrieben.attempts.map((a) => a.taskId).sort()).toEqual(['01-A1', '02-B1']);
    expect(geschrieben.settings.examDate).toBe('2027-01-15');
  });
});
