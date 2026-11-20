import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, migrateProgress, type Progress } from '../domain/progress';
import { createAutoProgressStore } from '../src/lib/fortschrittSpeicher';
import { createIdbFortschritt, oeffneDb } from '../src/lib/idbFortschritt';
import { createLocalProgressStore } from '../src/lib/localFortschritt';
import { arbeiteNachtragEin, leseNachtrag, loescheNachtrag, NACHTRAG_KEY, schreibeNachtrag } from '../src/lib/nachtrag';
import { recordAttempt } from '../src/lib/progress';
import { createProgressSaver } from '../src/lib/progressSaver';

// Sicherheitskopie beim Schließen des Tabs (src/lib/nachtrag.ts, Review-Befund 2): IndexedDB schreibt asynchron und wird beim Schließen eventuell nicht mehr fertig.
const versuch = (p: Progress, id: string) => recordAttempt(p, { taskId: id, date: 'd', points: 1, max: 1, mode: 'einzel' }, '2026-09-22');

function kv(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

async function neuerIdbSpeicher() {
  const factory = new IDBFactory();
  return createIdbFortschritt(await oeffneDb(() => factory), undefined);
}

describe('Sicherheitskopie lesen und schreiben', () => {
  it('schreibt sofort synchron und liest dieselbe Kopie wieder', () => {
    const speicher = kv();
    const stand = versuch(emptyProgress(), '01-A1');
    schreibeNachtrag(stand, () => speicher);
    expect(speicher.data.has(NACHTRAG_KEY)).toBe(true);
    expect(leseNachtrag(() => speicher)?.attempts).toHaveLength(1);
    loescheNachtrag(() => speicher);
    expect(leseNachtrag(() => speicher)).toBeNull();
  });

  it('eine unlesbare oder ungültige Kopie wird verworfen, statt jedes Mal zu stören', () => {
    for (const roh of ['{kaputt', JSON.stringify({ attempts: 'kaputt' })]) {
      const speicher = kv({ [NACHTRAG_KEY]: roh });
      expect(leseNachtrag(() => speicher)).toBeNull();
      expect(speicher.data.has(NACHTRAG_KEY)).toBe(false);
    }
  });

  it('ein voller oder gesperrter Speicher wirft nicht (es ist nur ein zusätzliches Netz)', () => {
    const gesperrt = () => ({
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => undefined,
    });
    expect(() => schreibeNachtrag(emptyProgress(), gesperrt)).not.toThrow();
  });
});

describe('Sicherheitskopie einarbeiten', () => {
  it('führt Kopie und gespeicherten Stand zusammen, nimmt die jüngeren Einstellungen der Kopie und löscht sie danach', async () => {
    const idb = await neuerIdbSpeicher();
    await idb.save(versuch(versuch(emptyProgress(), '01-A1'), '01-A2'));
    const speicher = kv();
    schreibeNachtrag(
      { ...versuch(emptyProgress(), '02-B1'), settings: { ...emptyProgress().settings, examDate: '2027-01-15' } },
      () => speicher,
    );

    expect(await arbeiteNachtragEin(idb, () => speicher)).toBe('eingearbeitet');
    const stand = migrateProgress(await idb.read());
    expect(stand.attempts.map((a) => a.taskId).sort()).toEqual(['01-A1', '01-A2', '02-B1']);
    expect(stand.settings.examDate).toBe('2027-01-15');
    expect(speicher.data.has(NACHTRAG_KEY)).toBe(false);
  });

  it('ohne Kopie passiert nichts', async () => {
    const idb = await neuerIdbSpeicher();
    expect(await arbeiteNachtragEin(idb, () => kv())).toBe('nichts');
    expect(await idb.readText()).toBeNull();
  });

  it('schlägt das Speichern fehl, bleibt die Kopie für den nächsten Start liegen', async () => {
    const speicher = kv();
    schreibeNachtrag(versuch(emptyProgress(), '02-B1'), () => speicher);
    const kaputt = {
      readText: async () => null,
      read: async () => null,
      save: async () => {
        throw new Error('Speicher voll');
      },
      replace: async () => null,
    };
    await expect(arbeiteNachtragEin(kaputt, () => speicher)).rejects.toThrow('Speicher voll');
    expect(speicher.data.has(NACHTRAG_KEY)).toBe(true);
  });

  it('der Start (automatische Speicherwahl) arbeitet die Kopie ein und löscht sie', async () => {
    const speicher = kv();
    vi.stubGlobal('localStorage', speicher);
    try {
      const factory = new IDBFactory();
      const oeffne = async () => createIdbFortschritt(await oeffneDb(() => factory), undefined);
      const auto = createAutoProgressStore(
        createLocalProgressStore(() => speicher),
        oeffne,
      );
      await auto.save(versuch(emptyProgress(), '01-A1'));
      schreibeNachtrag(versuch(emptyProgress(), '02-B1'), () => speicher);
      // Ein neuer Start (neue Speicherwahl) findet die Kopie.
      const neuerStart = createAutoProgressStore(
        createLocalProgressStore(() => speicher),
        oeffne,
      );
      expect(await neuerStart.art()).toBe('indexeddb');
      expect(
        migrateProgress(await neuerStart.read())
          .attempts.map((a) => a.taskId)
          .sort(),
      ).toEqual(['01-A1', '02-B1']);
      expect(speicher.data.has(NACHTRAG_KEY)).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('Saver: ausstehender Stand für die Kopie', () => {
  it('liefert den noch nicht gespeicherten Stand und danach null', async () => {
    vi.useFakeTimers();
    try {
      const saver = createProgressSaver({ send: async () => undefined, onState: () => undefined });
      expect(saver.pendingState).toBeNull();
      const stand = versuch(emptyProgress(), '01-A1');
      saver.schedule(stand);
      expect(saver.pendingState).toBe(stand);
      await saver.flush();
      expect(saver.pendingState).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
