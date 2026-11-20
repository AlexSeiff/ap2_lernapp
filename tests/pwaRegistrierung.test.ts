import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RUHE_MS, WARTEN_HOECHSTENS_MS, wartebisRuhig } from '../src/lib/pwa';

// Beim ersten Besuch wartet die Registrierung des Service Workers auf Ruhe (Umbauplan Phase 8): Der Vorabspeicher (rund 3 MB) lädt sonst
// genau dann, wenn der Nutzer die erste Seite öffnet, und bremst sie auf einem langsamen Netz um etwa das Doppelte.
describe('wartebisRuhig', () => {
  let fenster: EventTarget;
  beforeEach(() => {
    vi.useFakeTimers();
    fenster = new EventTarget();
    vi.stubGlobal('window', fenster);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const merke = (p: Promise<void>) => {
    const zustand = { fertig: false };
    void p.then(() => (zustand.fertig = true));
    return zustand;
  };

  it('ist nach der Ruhezeit ohne Bedienung fertig', async () => {
    const z = merke(wartebisRuhig());
    await vi.advanceTimersByTimeAsync(RUHE_MS - 600);
    expect(z.fertig).toBe(false);
    await vi.advanceTimersByTimeAsync(1100);
    expect(z.fertig).toBe(true);
  });

  it('jede Bedienung (Navigation, Antippen, Taste) beginnt die Ruhezeit neu', async () => {
    const z = merke(wartebisRuhig());
    for (const ereignis of ['hashchange', 'pointerdown', 'keydown']) {
      await vi.advanceTimersByTimeAsync(RUHE_MS - 1000);
      fenster.dispatchEvent(new Event(ereignis));
      expect(z.fertig, ereignis).toBe(false);
    }
    await vi.advanceTimersByTimeAsync(RUHE_MS + 600);
    expect(z.fertig).toBe(true);
  });

  it('wartet höchstens die vorgegebene Zeit, auch wenn ständig bedient wird', async () => {
    const z = merke(wartebisRuhig());
    for (let t = 0; t < WARTEN_HOECHSTENS_MS; t += 1000) {
      fenster.dispatchEvent(new Event('pointerdown'));
      await vi.advanceTimersByTimeAsync(1000);
    }
    await vi.advanceTimersByTimeAsync(600);
    expect(z.fertig).toBe(true);
  });

  it('meldet seine Zuhörer wieder ab', async () => {
    const abgemeldet: string[] = [];
    const roh = fenster.removeEventListener.bind(fenster);
    fenster.removeEventListener = ((typ: string, ...rest: unknown[]) => {
      abgemeldet.push(typ);
      return roh(typ, ...(rest as [EventListenerOrEventListenerObject]));
    }) as EventTarget['removeEventListener'];
    const z = merke(wartebisRuhig());
    await vi.advanceTimersByTimeAsync(RUHE_MS + 600);
    expect(z.fertig).toBe(true);
    expect(abgemeldet.sort()).toEqual(['hashchange', 'keydown', 'pointerdown']);
  });
});
