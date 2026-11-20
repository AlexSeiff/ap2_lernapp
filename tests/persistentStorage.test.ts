import { describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../domain/progress';
import { createPersistRequest, isStoragePersisted } from '../src/lib/persistentStorage';
import { createLocalProgressStore, createStaticApi } from '../src/lib/staticApi';

describe('Dauerhafter Speicher (navigator.storage.persist)', () => {
  it('fragt nur einmal und nicht, wenn der Speicher schon dauerhaft ist', async () => {
    const persist = vi.fn(async () => true);
    const request = createPersistRequest(() => ({ persist, persisted: async () => false }));
    expect(await request()).toBe(true);
    expect(await request()).toBeUndefined();
    expect(persist).toHaveBeenCalledTimes(1);

    const persist2 = vi.fn(async () => true);
    expect(await createPersistRequest(() => ({ persist: persist2, persisted: async () => true }))()).toBe(true);
    expect(persist2).not.toHaveBeenCalled();
  });

  it('ohne Storage-API oder bei Fehlern: kein Absturz, Ergebnis unbekannt', async () => {
    expect(await createPersistRequest(() => undefined)()).toBeUndefined();
    expect(
      await createPersistRequest(() => ({
        persist: async () => {
          throw new Error('nope');
        },
      }))(),
    ).toBeUndefined();
    expect(await isStoragePersisted(undefined)).toBeUndefined();
    expect(await isStoragePersisted({ persisted: async () => false })).toBe(false);
    expect(
      await isStoragePersisted({
        persisted: () => {
          throw new Error('nope');
        },
      }),
    ).toBeUndefined();
  });

  it('die Pages-API bittet nach dem Speichern um dauerhaften Speicher', async () => {
    const data = new Map<string, string>();
    const store = createLocalProgressStore(() => ({ getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) }));
    const request = vi.fn(async () => true);
    const api = createStaticApi(store, request);
    expect(request).not.toHaveBeenCalled();
    await api.saveProgress(emptyProgress());
    expect(request).toHaveBeenCalledTimes(1);
  });
});
