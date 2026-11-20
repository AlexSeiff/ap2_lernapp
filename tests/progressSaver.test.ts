import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { emptyProgress, type Progress } from '../domain/progress';
import { recordAttempt } from '../src/lib/progress';
import { createProgressSaver, type SaveState } from '../src/lib/progressSaver';

const withAttempts = (n: number): Progress => {
  let p = emptyProgress();
  for (let i = 0; i < n; i++) p = recordAttempt(p, { taskId: `01-A${i}`, date: 'd', points: 1, max: 1, mode: 'einzel' }, '2026-09-22');
  return p;
};

/** Speicher-Attrappe mit kontrollierbar verzögertem Abschluss. */
function fakeStorage() {
  const calls: { body: unknown; resolve: () => void; reject: (e: Error) => void }[] = [];
  const send = vi.fn((body: unknown) => new Promise<void>((resolve, reject) => calls.push({ body, resolve, reject })));
  return { calls, send };
}

let states: [SaveState, string | null | undefined][];
const onState = (s: SaveState, e?: string | null) => states.push([s, e]);

beforeEach(() => {
  vi.useFakeTimers();
  states = [];
});
afterEach(() => {
  vi.useRealTimers();
});

describe('createProgressSaver', () => {
  it('fasst schnelle Änderungen zu einem Speichern mit dem neuesten Stand zusammen', async () => {
    const storage = fakeStorage();
    const saver = createProgressSaver({ send: storage.send, onState });
    saver.schedule(withAttempts(1));
    saver.schedule(withAttempts(2));
    saver.schedule(withAttempts(3));
    expect(storage.send).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(400);
    expect(storage.calls.map((c) => (c.body as Progress).attempts.length)).toEqual([3]);
    storage.calls[0].resolve();
    await vi.runAllTimersAsync();
    expect(states.at(-1)).toEqual(['gespeichert', null]);
  });

  it('meldet erst nach dem Speichern nichts Ausstehendes mehr (für den pagehide-Flush)', async () => {
    const storage = fakeStorage();
    const saver = createProgressSaver({ send: storage.send, onState });
    expect(saver.pending).toBe(false);
    saver.schedule(withAttempts(1));
    expect(saver.pending).toBe(true);
    await vi.advanceTimersByTimeAsync(400);
    // Unterwegs, aber noch nicht bestätigt → weiterhin ausstehend.
    expect(saver.pending).toBe(true);
    storage.calls[0].resolve();
    await vi.runAllTimersAsync();
    expect(saver.pending).toBe(false);
  });

  it('speichert nie parallel: eine Änderung während des Speicherns wird danach gesendet', async () => {
    const storage = fakeStorage();
    const saver = createProgressSaver({ send: storage.send, onState });
    saver.schedule(withAttempts(1));
    await vi.advanceTimersByTimeAsync(400);
    saver.schedule(withAttempts(2));
    await vi.advanceTimersByTimeAsync(400);
    expect(storage.send).toHaveBeenCalledTimes(1);
    storage.calls[0].resolve();
    await vi.advanceTimersByTimeAsync(0);
    expect(states.at(-1)).toEqual(['speichert', null]);
    expect(storage.send).toHaveBeenCalledTimes(2);
    expect((storage.calls[1].body as Progress).attempts).toHaveLength(2);
    storage.calls[1].resolve();
    await vi.runAllTimersAsync();
    expect(saver.pending).toBe(false);
    expect(states.at(-1)).toEqual(['gespeichert', null]);
  });

  it('behält Fehler und ausstehende Änderungen bis zum erfolgreichen Wiederholen', async () => {
    const storage = fakeStorage();
    const saver = createProgressSaver({ send: storage.send, onState });
    saver.schedule(withAttempts(1));
    await vi.advanceTimersByTimeAsync(400);
    storage.calls[0].reject(new Error('Speicher voll'));
    await vi.runAllTimersAsync();
    expect(states.at(-1)).toEqual(['fehler', 'Speicher voll']);
    expect(saver.pending).toBe(true);
    saver.schedule(withAttempts(2));
    await vi.advanceTimersByTimeAsync(400);
    storage.calls[1].resolve();
    await vi.runAllTimersAsync();
    expect(saver.pending).toBe(false);
    expect(states.at(-1)).toEqual(['gespeichert', null]);
  });

  it('behält bewusstes Ersetzen bei Fehlern und beim Schließen bei', async () => {
    const storage = fakeStorage();
    const replacement = fakeStorage();
    const saver = createProgressSaver({ send: storage.send, onState });
    saver.schedule(emptyProgress(), replacement.send);
    await vi.advanceTimersByTimeAsync(400);
    replacement.calls[0].reject(new Error('Speicher voll'));
    await vi.runAllTimersAsync();
    saver.schedule(withAttempts(1));
    saver.flush();
    expect(replacement.calls[1].body).toEqual(withAttempts(1));
    expect(storage.send).not.toHaveBeenCalled();
    replacement.calls[1].resolve();
    await vi.runAllTimersAsync();
  });

  it('eine späte Bestätigung verwirft kein neueres bewusstes Ersetzen', async () => {
    const storage = fakeStorage();
    const replacement = fakeStorage();
    const saver = createProgressSaver({ send: storage.send, onState });
    saver.schedule(withAttempts(1));
    await vi.advanceTimersByTimeAsync(400);
    saver.schedule(emptyProgress(), replacement.send);
    storage.calls[0].resolve();
    await vi.advanceTimersByTimeAsync(400);
    expect(replacement.calls[0].body).toEqual(emptyProgress());
    replacement.calls[0].resolve();
    await vi.runAllTimersAsync();
    saver.schedule(withAttempts(2));
    await vi.advanceTimersByTimeAsync(400);
    expect(storage.calls[1].body).toEqual(withAttempts(2));
  });
  it('meldet einen fehlgeschlagenen Flush, damit fremde Änderungen kein Neuladen mit Datenverlust auslösen', async () => {
    const send = vi.fn().mockRejectedValue(new Error('Speicher voll'));
    const saver = createProgressSaver({ send, onState });
    saver.schedule(withAttempts(1));
    expect(await saver.flush()).toBe(false);
    expect(saver.pending).toBe(true);
    expect(states.at(-1)).toEqual(['fehler', 'Speicher voll']);
  });

  it('schreibt beim Flush sofort den neuesten Stand und ohne Änderungen gar nichts', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const saver = createProgressSaver({ send, onState });
    expect(await saver.flush()).toBe(true);
    expect(send).not.toHaveBeenCalled();
    saver.schedule(withAttempts(2));
    const flushed = saver.flush();
    expect(send).toHaveBeenCalledWith(withAttempts(2));
    expect(await flushed).toBe(true);
    await vi.runAllTimersAsync();
    expect(send).toHaveBeenCalledOnce();
  });

  it('nach einem erfolgreichen Flush ist nichts mehr ausstehend und der Zustand heißt „gespeichert“', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const saver = createProgressSaver({ send, onState });
    saver.schedule(withAttempts(2));
    expect(saver.pending).toBe(true);
    expect(await saver.flush()).toBe(true);
    expect(saver.pending).toBe(false);
    expect(states.at(-1)).toEqual(['gespeichert', null]);
    // Ein zweiter Flush hat nichts mehr zu schreiben.
    expect(await saver.flush()).toBe(true);
    expect(send).toHaveBeenCalledOnce();
  });

  it('eine Änderung während des Flush bleibt ausstehend und wird danach gespeichert', async () => {
    const storage = fakeStorage();
    const saver = createProgressSaver({ send: storage.send, onState });
    saver.schedule(withAttempts(1));
    const flushed = saver.flush();
    saver.schedule(withAttempts(2));
    storage.calls[0].resolve();
    expect(await flushed).toBe(true);
    expect(saver.pending).toBe(true);
    await vi.advanceTimersByTimeAsync(400);
    expect(storage.calls.map((c) => (c.body as Progress).attempts.length)).toEqual([1, 2]);
    storage.calls[1].resolve();
    await vi.runAllTimersAsync();
    expect(saver.pending).toBe(false);
    expect(states.at(-1)).toEqual(['gespeichert', null]);
  });

  it('zwei Tabs mit ungespeicherten Änderungen stoßen sich nicht endlos gegenseitig an', async () => {
    // Jeder Tab flusht, wenn der andere schreibt (so arbeitet watchOtherTabs in store.tsx). Mit einem hängenbleibenden „ausstehend“ würde das ewig weitergehen.
    let schreibvorgaenge = 0;
    const tab: Record<'a' | 'b', ReturnType<typeof createProgressSaver>> = {} as never;
    const schreibe = (anderer: 'a' | 'b') =>
      vi.fn(async () => {
        schreibvorgaenge++;
        if (schreibvorgaenge < 50) queueMicrotask(() => void tab[anderer].flush());
      });
    tab.a = createProgressSaver({ send: schreibe('b'), onState });
    tab.b = createProgressSaver({ send: schreibe('a'), onState });
    tab.a.schedule(withAttempts(1));
    tab.b.schedule(withAttempts(2));
    await tab.a.flush();
    await vi.runAllTimersAsync();
    expect(schreibvorgaenge).toBeLessThanOrEqual(3);
    expect(tab.a.pending).toBe(false);
    expect(tab.b.pending).toBe(false);
  });
});
