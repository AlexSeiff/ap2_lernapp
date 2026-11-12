import { describe, expect, it } from 'vitest';
import { emptyProgress, migrateProgress, type Progress } from '../shared/progress';
import { recordAttempt } from '../src/lib/progress';
import { BROKEN_KEY, createLocalProgressStore, PROGRESS_KEY } from '../src/lib/staticApi';

const withAttempts = (n: number, revision = 0): Progress => {
  let p = { ...emptyProgress(), revision };
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
  it('liest null, solange nichts gespeichert ist, und speichert mit steigender Revision', () => {
    const storage = memoryStorage();
    const store = createLocalProgressStore(() => storage);
    expect(store.read()).toBeNull();
    expect(store.save(withAttempts(1, 0))).toEqual({ ok: true, revision: 1 });
    expect(store.save(withAttempts(2, 1))).toEqual({ ok: true, revision: 2 });
    const saved = migrateProgress(store.read());
    expect(saved.attempts).toHaveLength(2);
    expect(saved.revision).toBe(2);
  });

  it('lehnt einen veralteten Tab mit 409 ab und überschreibt nichts', () => {
    const storage = memoryStorage();
    const store = createLocalProgressStore(() => storage);
    store.save(withAttempts(3, 0));
    const before = storage.data.get(PROGRESS_KEY);
    expect(() => store.save(withAttempts(4, 0))).toThrow(expect.objectContaining({ status: 409 }));
    expect(storage.data.get(PROGRESS_KEY)).toBe(before);
  });

  it('schützt vor versehentlich geleertem Stand – außer mit reset (Zurücksetzen, Sicherung einspielen)', () => {
    const storage = memoryStorage();
    const store = createLocalProgressStore(() => storage);
    store.save(withAttempts(10, 0));
    expect(() => store.save(withAttempts(0, 1))).toThrow(expect.objectContaining({ status: 400 }));
    expect(store.save({ ...withAttempts(0, 1), reset: true })).toEqual({ ok: true, revision: 2 });
    expect(storage.data.get(PROGRESS_KEY)).not.toContain('"reset"');
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
