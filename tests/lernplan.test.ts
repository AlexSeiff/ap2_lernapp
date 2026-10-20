import { describe, expect, it } from 'vitest';
import { emptyProgress } from '../shared/progress';
import { PUFFER_TAGE, planeLernplan, THEMEN_PRO_WOCHE } from '../src/lib/lernplan';
import { loadContent, CONTENT_DIR } from '../server/loadContent';

describe('planeLernplan', async () => {
  const content = await loadContent(CONTENT_DIR);
  const mitTermin = (examDate?: string) => {
    const p = emptyProgress();
    return { ...p, settings: { ...p.settings, ...(examDate ? { examDate } : {}) } };
  };

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
    expect(plan.kartenProTag).toBeGreaterThan(0);
  });

  it('gleicher Stand → gleicher Plan', () => {
    const a = planeLernplan(content, mitTermin('2026-12-15'), '2026-10-20');
    expect(planeLernplan(content, mitTermin('2026-12-15'), '2026-10-20')).toEqual(a);
  });
});
