import { describe, expect, it } from 'vitest';
import { defaultSettings, emptyProgress, ProgressSchema } from '../domain/progress';
import { withSettings } from '../src/lib/settings';

describe('withSettings', () => {
  it('ändert nur die übergebenen Einstellungen und lässt den Rest des Fortschritts gleich', () => {
    const p = emptyProgress();
    const next = withSettings(p, { prueferfragen: false, backupReminderDays: 14 });
    expect(next.settings).toEqual({ ...defaultSettings(), prueferfragen: false, backupReminderDays: 14 });
    expect({ ...next, settings: p.settings }).toEqual(p);
    expect(p.settings).toEqual(defaultSettings());
    expect(ProgressSchema.safeParse(next).success).toBe(true);
  });

  it('setzt und entfernt den Prüfungstermin', () => {
    const set = withSettings(emptyProgress(), { examDate: '2026-11-25' });
    expect(set.settings.examDate).toBe('2026-11-25');
    expect(withSettings(set, { examDate: '' }).settings).not.toHaveProperty('examDate');
    expect(withSettings(set, { examDate: undefined }).settings).not.toHaveProperty('examDate');
    expect(withSettings(set, { leichtModus: true }).settings.examDate).toBe('2026-11-25');
  });
});
