// Importprüfung einer Rechenübung gegen ihre Vorlage (für buildContent → ImportIssues auf „Daten & Import“ und im Importbericht):
// Vorlage bekannt, Daten gültig, jede Eingabe vorhanden, Zahlen endlich, Platzhalter bekannt – mit den festen Daten
// und, wenn „🎲 Neue Zahlen“ angeboten wird, auch für einige Zufalls-Seeds.

import type { RechenUebung, RechenWert } from '../../shared/types.ts';
import { baueInstanz } from './instanz.ts';

/** Seeds, mit denen „Neue Zahlen“ beim Import ausprobiert wird. */
const TEST_SEEDS = [1, 2, 3, 42, 20260930];

const endlich = (w: RechenWert) => (typeof w === 'number' ? Number.isFinite(w) : Array.isArray(w) ? w.every(Number.isFinite) : true);

function pruefeInstanz(u: RechenUebung, seed?: number): string | undefined {
  const inst = baueInstanz(u, seed);
  const kaputt = inst.eingaben.filter((e) => !endlich(e.erwartet)).map((e) => e.id);
  if (kaputt.length) return `keine endliche Lösung für ${kaputt.join(', ')}${seed === undefined ? '' : ` (Seed ${seed})`}`;
  if (inst.unbekanntePlatzhalter.length) return `unbekannte Platzhalter ${inst.unbekanntePlatzhalter.map((p) => `{{${p}}}`).join(', ')}`;
  return undefined;
}

/** Fehlermeldung oder undefined, wenn die Übung zu ihrer Vorlage passt. */
export function pruefeRechenUebung(u: RechenUebung): string | undefined {
  try {
    const fest = pruefeInstanz(u);
    if (fest) return fest;
    if (u.neueZahlen) {
      for (const seed of TEST_SEEDS) {
        const zufall = pruefeInstanz(u, seed);
        if (zufall) return `mit „Neue Zahlen“: ${zufall}`;
      }
    }
    return undefined;
  } catch (e) {
    return (e as Error).message;
  }
}
