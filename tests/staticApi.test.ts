import { afterEach, describe, expect, it, vi } from 'vitest';
import { emptyProgress, migrateProgress, type Progress } from '../domain/progress';
import { recordAttempt } from '../src/lib/progress';
import { BROKEN_KEY, createLocalProgressStore, createStaticApi, PROGRESS_KEY } from '../src/lib/staticApi';

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

describe('Fortschritt im Browser', () => {
  it('liest null und speichert normalen Lernfortschritt ohne Revision', () => {
    const storage = memoryStorage();
    const store = createLocalProgressStore(() => storage);
    expect(store.read()).toBeNull();
    store.save(withAttempts(1));
    store.save(withAttempts(2));
    expect(migrateProgress(store.read()).attempts).toHaveLength(2);
    expect(store.read()).not.toHaveProperty('revision');
  });

  it('führt vor dem Speichern fremde Änderungen aus einem zweiten Tab zusammen', () => {
    const storage = memoryStorage();
    const first = createLocalProgressStore(() => storage);
    const second = createLocalProgressStore(() => storage);
    first.read();
    second.read();
    first.save(withAttempts(10));
    const own = recordAttempt(emptyProgress(), { taskId: '02-A1', date: 'd', points: 1, max: 1, mode: 'einzel' });
    second.save(own);
    // Auch vor Zustellung des storage-Ereignisses darf ein weiteres Speichern fremde Versuche nicht verlieren.
    second.save({ ...own, lernziele: { a: true } });
    const saved = migrateProgress(second.read());
    expect(saved.attempts).toHaveLength(11);
    expect(saved.attempts).toEqual(expect.arrayContaining([...withAttempts(10).attempts, ...own.attempts]));
  });

  it('schützt vor leerem oder zu kleinem Stand und lässt den gespeicherten Stand unangetastet', () => {
    const storage = memoryStorage();
    const store = createLocalProgressStore(() => storage);
    store.save(withAttempts(10));
    const before = storage.data.get(PROGRESS_KEY);
    for (const count of [0, 4]) {
      expect(() => store.save(withAttempts(count))).toThrow(`nur ${count} statt 10 Versuche`);
      expect(storage.data.get(PROGRESS_KEY)).toBe(before);
    }
    store.replace(emptyProgress());
    expect(migrateProgress(store.read()).attempts).toEqual([]);
    expect(store.read()).not.toHaveProperty('reset');
  });

  it('bewusstes Einspielen ersetzt den Stand, bewahrt aber inzwischen fremd gespeicherten Fortschritt', () => {
    const storage = memoryStorage();
    const first = createLocalProgressStore(() => storage);
    const second = createLocalProgressStore(() => storage);
    first.save(withAttempts(3));
    second.read();
    first.save(withAttempts(4));
    second.replace(emptyProgress());
    expect(migrateProgress(second.read()).attempts).toHaveLength(4);
    second.replace(withAttempts(1));
    expect(migrateProgress(second.read()).attempts).toHaveLength(1);
  });

  it('führt den eigenen unveränderten Speicher nicht erneut ein (Antworten und Lernziele dürfen entfernt werden)', () => {
    const storage = memoryStorage();
    const store = createLocalProgressStore(() => storage);
    store.save({ ...withAttempts(1), lernziele: { a: true }, cards: { a: { box: 3, reviews: 4, due: '2026-11-20' } } });
    store.save({ ...withAttempts(1), lernziele: { a: false }, cards: {} });
    expect(store.read()).toMatchObject({ lernziele: { a: false }, cards: {} });
  });

  it('prüft das Schema vor jedem Schreiben, auch beim bewussten Ersetzen', () => {
    const storage = memoryStorage();
    const store = createLocalProgressStore(() => storage);
    store.save(withAttempts(2));
    const before = storage.data.get(PROGRESS_KEY);
    for (const write of [store.save, store.replace]) {
      expect(() => write({})).toThrow(/^Fortschritt nicht gespeichert: Die Daten sind ungültig/);
      expect(storage.data.get(PROGRESS_KEY)).toBe(before);
    }
  });

  it('lädt alte Sicherungen mit revision und schreibt sie ohne Revisionsfeld', () => {
    const storage = memoryStorage({ [PROGRESS_KEY]: JSON.stringify({ ...withAttempts(2), revision: 19 }) });
    const store = createLocalProgressStore(() => storage);
    const p = migrateProgress(store.read());
    expect(p).not.toHaveProperty('revision');
    store.save(p);
    expect(store.read()).not.toHaveProperty('revision');
    expect(migrateProgress(store.read()).attempts).toEqual(p.attempts);
  });

  it('hebt einen kaputten Stand auf, statt ihn stillschweigend zu verlieren', () => {
    const storage = memoryStorage({ [PROGRESS_KEY]: '{kaputt' });
    const store = createLocalProgressStore(() => storage);
    expect(store.read()).toBeNull();
    expect(storage.data.get(BROKEN_KEY)).toBe('{kaputt');
  });

  it('ohne localStorage: lesen liefert null, speichern meldet einen deutschen Fehler', () => {
    const store = createLocalProgressStore(() => {
      throw new Error('SecurityError');
    });
    expect(store.read()).toBeNull();
    expect(() => store.save(withAttempts(1))).toThrow(/^Speichern im Browser fehlgeschlagen \(SecurityError\)/);
  });
});

describe('andere Tabs', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('meldet Fortschrittsänderungen und meldet den Listener wieder ab', () => {
    const target = new EventTarget();
    vi.stubGlobal('window', target);
    const api = createStaticApi();
    const reload = vi.fn();
    const unsubscribe = api.watchOtherTabs(reload);
    const event = (key: string) => Object.assign(new Event('storage'), { key });
    target.dispatchEvent(event('anderer-schluessel'));
    expect(reload).not.toHaveBeenCalled();
    target.dispatchEvent(event(PROGRESS_KEY));
    expect(reload).toHaveBeenCalledOnce();
    unsubscribe();
    target.dispatchEvent(event(PROGRESS_KEY));
    expect(reload).toHaveBeenCalledOnce();
  });
});
