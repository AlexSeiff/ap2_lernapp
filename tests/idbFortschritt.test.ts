import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, migrateProgress, type Progress } from '../domain/progress';
import { createAutoProgressStore, uebernehmeAusLocalStorage } from '../src/lib/fortschrittSpeicher';
import { createIdbFortschritt, oeffneDb } from '../src/lib/idbFortschritt';
import { BROKEN_KEY, createLocalProgressStore, PROGRESS_KEY } from '../src/lib/localFortschritt';
import { recordAttempt } from '../src/lib/progress';

const withAttempts = (n: number): Progress => {
  let p = emptyProgress();
  for (let i = 0; i < n; i++) p = recordAttempt(p, { taskId: `01-A${i}`, date: 'd', points: 1, max: 1, mode: 'einzel' }, '2026-09-22');
  return p;
};

/** localStorage-Attrappe */
function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  };
}

/** Eine frische IndexedDB (eigene „Browserprofil“-Attrappe) und beliebig viele Verbindungen dazu – wie mehrere Tabs. */
async function neueDb() {
  const factory = new IDBFactory();
  const tab = async (kanal?: ConstructorParameters<typeof BroadcastChannel>[0]) =>
    createIdbFortschritt(await oeffneDb(() => factory), kanal ? new BroadcastChannel(kanal) : undefined);
  return { factory, tab };
}

const warte = (ms = 50) => new Promise((r) => setTimeout(r, ms));

describe('Lernstand in IndexedDB', () => {
  it('liest null, speichert und liest denselben Stand ohne Revision', async () => {
    const { tab } = await neueDb();
    const speicher = await tab();
    expect(await speicher.read()).toBeNull();
    await speicher.save(withAttempts(1));
    await speicher.save(withAttempts(2));
    const gelesen = await speicher.read();
    expect(migrateProgress(gelesen).attempts).toHaveLength(2);
    expect(gelesen).not.toHaveProperty('revision');
    expect(JSON.parse((await speicher.readText())!)).toEqual(gelesen);
  });

  it('führt vor dem Speichern fremde Änderungen aus einem zweiten Tab zusammen', async () => {
    const { tab } = await neueDb();
    const erster = await tab();
    const zweiter = await tab();
    await erster.read();
    await zweiter.read();
    await erster.save(withAttempts(10));
    const eigen = recordAttempt(emptyProgress(), { taskId: '02-A1', date: 'd', points: 1, max: 1, mode: 'einzel' });
    await zweiter.save(eigen);
    // Auch ohne Benachrichtigung darf ein weiteres Speichern fremde Versuche nicht verlieren.
    await zweiter.save({ ...eigen, lernziele: { a: true } });
    const gespeichert = migrateProgress(await zweiter.read());
    expect(gespeichert.attempts).toHaveLength(11);
    expect(gespeichert.attempts).toEqual(expect.arrayContaining([...withAttempts(10).attempts, ...eigen.attempts]));
  });

  it('zwei gleichzeitige Speichervorgänge aus zwei Tabs verlieren nichts', async () => {
    const { tab } = await neueDb();
    const a = await tab();
    const b = await tab();
    await a.read();
    await b.read();
    const ausA = recordAttempt(emptyProgress(), { taskId: '01-A1', date: 'd', points: 1, max: 1, mode: 'einzel' });
    const ausB = recordAttempt(emptyProgress(), { taskId: '02-B1', date: 'd', points: 1, max: 1, mode: 'einzel' });
    await Promise.all([a.save(ausA), b.save(ausB)]);
    const ids = migrateProgress(await a.read()).attempts.map((x) => x.taskId);
    expect(ids.sort()).toEqual(['01-A1', '02-B1']);
  });

  it('schützt vor leerem oder zu kleinem Stand und lässt den gespeicherten Stand unangetastet', async () => {
    const { tab } = await neueDb();
    const speicher = await tab();
    await speicher.save(withAttempts(10));
    const vorher = await speicher.readText();
    for (const anzahl of [0, 4]) {
      await expect(speicher.save(withAttempts(anzahl))).rejects.toThrow(`nur ${anzahl} statt 10 Versuche`);
      expect(await speicher.readText()).toBe(vorher);
    }
    await speicher.replace(emptyProgress());
    expect(migrateProgress(await speicher.read()).attempts).toEqual([]);
    expect(await speicher.read()).not.toHaveProperty('reset');
  });

  it('weist ungültige Daten ab und schreibt nichts', async () => {
    const { tab } = await neueDb();
    const speicher = await tab();
    await speicher.save(withAttempts(3));
    const vorher = await speicher.readText();
    await expect(speicher.save({ attempts: 'kaputt' })).rejects.toThrow(/^Fortschritt nicht gespeichert: Die Daten sind ungültig/);
    await expect(speicher.replace({ attempts: 'kaputt' })).rejects.toThrow(/ungültig/);
    expect(await speicher.readText()).toBe(vorher);
  });

  it('sichert einen nicht lesbaren Text unter „defekt“, bevor etwas überschrieben wird', async () => {
    const { factory, tab } = await neueDb();
    const roh = await oeffneDb(() => factory);
    await new Promise<void>((ok, nein) => {
      const tx = roh.transaction('kv', 'readwrite');
      tx.objectStore('kv').put('{kaputt', 'fortschritt');
      tx.oncomplete = () => ok();
      tx.onerror = () => nein(tx.error);
    });
    const speicher = await tab();
    expect(await speicher.read()).toBeNull();
    const defekt = await new Promise<unknown>((ok) => {
      const req = roh.transaction('kv', 'readonly').objectStore('kv').get('fortschritt-defekt');
      req.onsuccess = () => ok(req.result);
    });
    expect(defekt).toBe('{kaputt');
  });

  it('meldet Änderungen nur an die anderen Tabs und meldet den Zuhörer wieder ab', async () => {
    const { tab } = await neueDb();
    const kanal = `test-${Math.random()}`;
    const a = await tab(kanal);
    const b = await tab(kanal);
    const beiA = vi.fn();
    const beiB = vi.fn();
    const abA = a.watch(beiA);
    const abB = b.watch(beiB);
    await a.save(withAttempts(1));
    await warte();
    expect(beiB).toHaveBeenCalledTimes(1);
    expect(beiA).not.toHaveBeenCalled();
    abB();
    await a.save(withAttempts(2));
    await warte();
    expect(beiB).toHaveBeenCalledTimes(1);
    abA();
    a.close();
    b.close();
  });

  it('übernimmt nur in eine leere Datenbank und überschreibt nie', async () => {
    const { tab } = await neueDb();
    const speicher = await tab();
    const text = JSON.stringify(withAttempts(3));
    expect(await speicher.uebernehme(text)).toBe('uebernommen');
    expect(await speicher.uebernehme(JSON.stringify(withAttempts(1)))).toBe('vorhanden');
    expect(await speicher.readText()).toBe(text);
  });
});

describe('Umzug aus dem localStorage', () => {
  it('kopiert den Text 1:1, prüft ihn und lässt den alten Eintrag stehen', async () => {
    const { tab } = await neueDb();
    const speicher = await tab();
    const text = JSON.stringify(withAttempts(5));
    const lokalStorage = memoryStorage({ [PROGRESS_KEY]: text });
    const lokal = createLocalProgressStore(() => lokalStorage);
    const danach = vi.fn();
    expect(await uebernehmeAusLocalStorage(speicher, lokal, danach)).toBe('uebernommen');
    expect(danach).toHaveBeenCalledOnce();
    expect(await speicher.readText()).toBe(text);
    expect(lokalStorage.data.get(PROGRESS_KEY)).toBe(text);
    // Ein zweiter Aufruf (anderer Tab, nächster Start) ändert nichts mehr.
    expect(await uebernehmeAusLocalStorage(speicher, lokal)).toBe('vorhanden');
  });

  it('überschreibt vorhandenen Fortschritt in IndexedDB nicht mit dem älteren localStorage-Stand', async () => {
    const { tab } = await neueDb();
    const speicher = await tab();
    await speicher.save(withAttempts(8));
    const neu = await speicher.readText();
    const lokal = createLocalProgressStore(() => memoryStorage({ [PROGRESS_KEY]: JSON.stringify(withAttempts(2)) }));
    expect(await uebernehmeAusLocalStorage(speicher, lokal)).toBe('vorhanden');
    expect(await speicher.readText()).toBe(neu);
  });

  it('ohne alten Stand passiert nichts; ein kaputter alter Stand wird gesichert statt übernommen', async () => {
    const { tab } = await neueDb();
    const speicher = await tab();
    expect(
      await uebernehmeAusLocalStorage(
        speicher,
        createLocalProgressStore(() => memoryStorage()),
      ),
    ).toBe('nichts');
    const kaputt = memoryStorage({ [PROGRESS_KEY]: '{kaputt' });
    expect(
      await uebernehmeAusLocalStorage(
        speicher,
        createLocalProgressStore(() => kaputt),
      ),
    ).toBe('nichts');
    expect(kaputt.data.get(BROKEN_KEY)).toBe('{kaputt');
    expect(await speicher.readText()).toBeNull();
  });
});

describe('Automatische Wahl des Speichers', () => {
  it('nutzt IndexedDB, zieht den alten Stand um und schreibt danach nur noch dorthin', async () => {
    const { factory } = await neueDb();
    const alt = JSON.stringify(withAttempts(4));
    const lokalStorage = memoryStorage({ [PROGRESS_KEY]: alt });
    const speicher = createAutoProgressStore(
      createLocalProgressStore(() => lokalStorage),
      async () => createIdbFortschritt(await oeffneDb(() => factory), undefined),
    );
    expect(await speicher.art()).toBe('indexeddb');
    expect(migrateProgress(await speicher.read()).attempts).toHaveLength(4);
    await speicher.save(withAttempts(5));
    expect(migrateProgress(await speicher.read()).attempts).toHaveLength(5);
    expect(lokalStorage.data.get(PROGRESS_KEY)).toBe(alt); // alter Eintrag bleibt unberührt
  });

  it('fällt auf den localStorage zurück, wenn IndexedDB nicht geht, und verliert nichts', async () => {
    const lokalStorage = memoryStorage({ [PROGRESS_KEY]: JSON.stringify(withAttempts(3)) });
    const speicher = createAutoProgressStore(
      createLocalProgressStore(() => lokalStorage),
      async () => {
        throw new Error('IndexedDB gesperrt');
      },
    );
    expect(await speicher.art()).toBe('localstorage');
    expect(migrateProgress(await speicher.read()).attempts).toHaveLength(3);
    await speicher.save(withAttempts(6));
    expect(migrateProgress(JSON.parse(lokalStorage.data.get(PROGRESS_KEY)!)).attempts).toHaveLength(6);
  });
});

// Die echten Lernstände des Besitzers (nur lesen; ohne den Ordner data/ läuft der Test nicht).
const data = join(import.meta.dirname, '..', 'data');
const echteStaende = [
  ...(existsSync(join(data, 'fortschritt.json')) ? [join(data, 'fortschritt.json')] : []),
  ...(existsSync(join(data, 'backups'))
    ? readdirSync(join(data, 'backups'))
        .filter((n) => n.endsWith('.json'))
        .map((n) => join(data, 'backups', n))
    : []),
];

describe('Umzug mit den echten Lernständen', () => {
  it.skipIf(echteStaende.length === 0)('jeder echte Stand zieht ohne Verlust um und bleibt danach les- und speicherbar', async () => {
    for (const datei of echteStaende) {
      const text = readFileSync(datei, 'utf8');
      const { factory } = await neueDb();
      const lokalStorage = memoryStorage({ [PROGRESS_KEY]: text });
      const speicher = createAutoProgressStore(
        createLocalProgressStore(() => lokalStorage),
        async () => createIdbFortschritt(await oeffneDb(() => factory), undefined),
      );
      expect(await speicher.art(), datei).toBe('indexeddb');
      const roh = await speicher.read();
      // Exakt derselbe Inhalt und derselbe migrierte Stand wie aus der Datei.
      expect(roh, datei).toEqual(JSON.parse(text));
      expect(migrateProgress(roh), datei).toEqual(migrateProgress(JSON.parse(text)));
      // Und er lässt sich unverändert wieder speichern (Schema, Schutz vor Rückgang).
      await speicher.save(migrateProgress(roh));
      expect(migrateProgress(await speicher.read()).attempts, datei).toEqual(migrateProgress(JSON.parse(text)).attempts);
    }
  });
});
