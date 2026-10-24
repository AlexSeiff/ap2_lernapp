import { describe, expect, it } from 'vitest';
import { CARD_INTERVALS } from '../shared/config';
import { emptyProgress } from '../shared/progress';
import { PUFFER_TAGE, planeLernplan, THEMEN_PRO_WOCHE, ZIEL_KARTEN } from '../src/lib/lernplan';
import { loadContent, CONTENT_DIR } from '../server/loadContent';

describe('planeLernplan', async () => {
  const content = await loadContent(CONTENT_DIR);
  const mitTermin = (examDate?: string) => {
    const p = emptyProgress();
    return { ...p, settings: { ...p.settings, ...(examDate ? { examDate } : {}) } };
  };
  // Prüfungskarten der Themen, die der Plan berücksichtigt (mit Klausurblöcken)
  const planThemen = new Set(content.topics.filter((t) => t.exam?.blocks.length).map((t) => t.id));
  const pruefungskarten = content.flashcards.filter((c) => c.typ !== 'begriff' && c.topicId && planThemen.has(c.topicId));
  const mitKarten = (box: number, karten = pruefungskarten) => ({
    ...mitTermin('2026-12-15'),
    cards: Object.fromEntries(karten.map((c) => [c.id, { box, due: '2026-10-20', reviews: 1 }])),
  });

  it('ohne Termin oder nach dem Termin: kein Plan', () => {
    expect(planeLernplan(content, mitTermin(), '2026-10-20')).toBeUndefined();
    expect(planeLernplan(content, mitTermin('2026-10-01'), '2026-10-20')).toBeUndefined();
  });

  it('verteilt die Themen auf die Wochen: höchstens THEMEN_PRO_WOCHE, nie zweimal dasselbe Thema in einer Woche', () => {
    const plan = planeLernplan(content, mitTermin('2026-12-15'), '2026-10-20')!;
    expect(plan.tage).toBe(56);
    expect(plan.wochen).toHaveLength(Math.ceil((56 - PUFFER_TAGE) / 7));
    for (const w of plan.wochen) {
      expect(w.themen.length).toBeLessThanOrEqual(THEMEN_PRO_WOCHE);
      expect(new Set(w.themen.map((t) => t.id)).size).toBe(w.themen.length);
    }
    expect(plan.wochen.flatMap((w) => w.themen).length).toBeGreaterThan(0);
    expect(plan.neueKartenProTag).toBeGreaterThan(0);
    expect(plan.kartenMinutenProTag).toBeGreaterThan(0);
  });

  it('Kartenziel nur über Prüfungskarten, Begriffskarten getrennt', () => {
    const plan = planeLernplan(content, mitTermin('2026-12-15'), '2026-10-20')!;
    expect(plan.kartenGesamt).toBe(pruefungskarten.length);
    expect(plan.begriffe.gesamt).toBeGreaterThan(0);
    expect(plan.kartenZiel).toBe(Math.ceil(plan.kartenGesamt * ZIEL_KARTEN));
    // ohne Fortschritt: alles neu, verteilt auf die Tage, an denen eine neue Karte noch Fach 3 erreicht
    const startTage = 56 - PUFFER_TAGE - CARD_INTERVALS[2];
    expect(plan.neueKartenProTag).toBe(Math.ceil(plan.kartenOffen / startTage));
  });

  it('angefangene Karten zählen schon mit: weniger neue Karten nötig', () => {
    const ohne = planeLernplan(content, mitTermin('2026-12-15'), '2026-10-20')!;
    const mit = planeLernplan(content, mitKarten(2, pruefungskarten.slice(0, 100)), '2026-10-20')!;
    expect(mit.kartenOffen).toBe(ohne.kartenOffen);
    expect(mit.neueKartenProTag).toBeLessThan(ohne.neueKartenProTag);
  });

  it('Ziel erreicht: keine Karten mehr nötig', () => {
    const plan = planeLernplan(content, mitKarten(3), '2026-10-20')!;
    expect(plan.kartenOffen).toBe(0);
    expect(plan.neueKartenProTag).toBe(0);
    expect(plan.kartenMinutenProTag).toBe(0);
  });

  it('gleicher Stand → gleicher Plan', () => {
    const a = planeLernplan(content, mitTermin('2026-12-15'), '2026-10-20');
    expect(planeLernplan(content, mitTermin('2026-12-15'), '2026-10-20')).toEqual(a);
  });
});
