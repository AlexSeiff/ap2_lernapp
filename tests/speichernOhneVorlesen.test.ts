import { describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../domain/progress';
import type { BrowserBackups } from '../src/lib/browserBackups';
import { createStaticApi } from '../src/lib/staticApi';

// Review-Befund 2: Beim Schließen des Tabs zählt jeder Schritt vor dem Schreiben. Das Speichern liest deshalb nicht mehr vorher; der vorherige Stand für die
// Tagessicherung kommt aus dem Schreibvorgang selbst.
describe('Speichern ohne vorheriges Lesen', () => {
  it('schreibt sofort und gibt den vorherigen Text an die Tagessicherung weiter', async () => {
    const reihenfolge: string[] = [];
    const store = {
      readText: vi.fn(() => {
        reihenfolge.push('readText');
        return null;
      }),
      read: vi.fn(),
      save: vi.fn(async () => {
        reihenfolge.push('save');
        return '{"vorher":1}';
      }),
      replace: vi.fn(async () => {
        reihenfolge.push('replace');
        return '{"vorher":2}';
      }),
    };
    const backupBeforeSave = vi.fn();
    const api = createStaticApi(store, () => Promise.resolve(true), { backupBeforeSave } as unknown as BrowserBackups);

    await api.saveProgress(emptyProgress());
    expect(reihenfolge).toEqual(['save']);
    expect(store.readText).not.toHaveBeenCalled();
    expect(backupBeforeSave).toHaveBeenCalledWith('{"vorher":1}', expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));

    await api.replaceProgress(emptyProgress());
    expect(backupBeforeSave).toHaveBeenLastCalledWith('{"vorher":2}', expect.any(String));
  });
});
