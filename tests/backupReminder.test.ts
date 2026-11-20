import { describe, expect, it } from 'vitest';
import { emptyProgress, type Progress } from '../domain/progress';
import { backupReminder } from '../src/lib/backupReminder';
import { withSettings } from '../src/lib/settings';

const learnedOn = (...days: string[]): Progress => ({ ...emptyProgress(), cardReviewDays: Object.fromEntries(days.map((d) => [d, 3])) });

describe('backupReminder', () => {
  it('ohne Lerntage keine Erinnerung', () => {
    expect(backupReminder(emptyProgress(), '2026-09-30')).toBeUndefined();
  });

  it('ohne Sicherung: ab backupReminderDays Tagen nach dem ersten Lerntag', () => {
    const p = learnedOn('2026-09-24');
    expect(backupReminder(p, '2026-09-30')).toBeUndefined();
    expect(backupReminder(p, '2026-10-01')).toEqual({ daysSince: 7 });
  });

  it('mit Sicherung: erst nach backupReminderDays Tagen und nur mit einem Lerntag seitdem', () => {
    const p = withSettings(learnedOn('2026-09-01', '2026-09-21'), { lastBackupDownloadAt: '2026-09-21' });
    expect(backupReminder(p, '2026-09-30')).toBeUndefined(); // seit der Sicherung nicht gelernt
    const learned = { ...p, sqlDays: { '2026-09-25': 1 } };
    expect(backupReminder(learned, '2026-09-27')).toBeUndefined(); // erst 6 Tage
    expect(backupReminder(learned, '2026-09-30')).toEqual({ lastDownload: '2026-09-21', daysSince: 9 });
  });

  it('beachtet die eingestellte Anzahl Tage und Versuche als Lerntage', () => {
    const p = withSettings(
      { ...emptyProgress(), attempts: [{ taskId: '01-A1', date: '2026-09-29T10:00:00', points: 1, max: 2, mode: 'einzel' }] },
      { lastBackupDownloadAt: '2026-09-28', backupReminderDays: 2 },
    );
    expect(backupReminder(p, '2026-09-29')).toBeUndefined();
    expect(backupReminder(p, '2026-09-30')).toEqual({ lastDownload: '2026-09-28', daysSince: 2 });
  });
});
