import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ladeInhalt } from '../build/inhalt';
import { baueInstanz } from '../src/rechnen/instanz';

// Gleichheitstest der Rechenvorlagen (Umbauplan Phase 7): Für jede Rechenübung und – wenn „Neue Zahlen“ angeboten wird – für feste Seeds
// hält ein Hash fest, was die Vorlage erzeugt: Aufgabentext, Hinweise, Eingaben mit erwarteten Werten, Lösung, Rechenweg und typische
// Fehler. Ändert sich das, wird der Test rot; dann entweder den Fehler beheben oder (nur wenn die Änderung gewollt ist) den Snapshot
// bewusst erneuern: npx vitest run tests/rechenVorlagen.test.ts -u
const SEEDS = [1, 2, 3, 42, 20260930];

const hash = (wert: unknown) => createHash('sha256').update(JSON.stringify(wert)).digest('hex').slice(0, 16);

describe('Rechenvorlagen erzeugen unverändert dieselben Aufgaben', () => {
  const { content } = ladeInhalt();
  const uebungen = content.rechenUebungen;

  it('es gibt Übungen mit und ohne Vorlage', () => {
    expect(uebungen.length).toBeGreaterThan(100);
    expect(uebungen.some((u) => u.vorlage)).toBe(true);
    expect(uebungen.some((u) => !u.vorlage)).toBe(true);
  });

  it('Aufgabe, Lösung, Rechenweg und typische Fehler je Übung (feste Daten und feste Seeds)', () => {
    const erzeugt: Record<string, string> = {};
    for (const u of uebungen) {
      erzeugt[u.id] = hash(baueInstanz(u));
      if (u.neueZahlen) for (const seed of SEEDS) erzeugt[`${u.id}@${seed}`] = hash(baueInstanz(u, seed));
    }
    expect(erzeugt).toMatchSnapshot();
  });
});
