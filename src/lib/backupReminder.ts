// Erinnerung an eine heruntergeladene Sicherung (Banner auf der Übersicht): rein, damit testbar.

import type { Progress } from '../../shared/progress';
import { localDate } from './progress';
import { activityDays } from './stats';

export interface BackupReminder {
  /** Tag der letzten heruntergeladenen Sicherung; fehlt, wenn in diesem Fortschritt noch nie eine geladen wurde. */
  lastDownload?: string;
  /** Tage seit der letzten Sicherung – oder, ohne Sicherung, seit dem ersten Lerntag. */
  daysSince: number;
}

/** Ganze Tage von `from` bis `to` (beides YYYY-MM-DD). */
function daysBetween(from: string, to: string): number {
  const utc = (d: string) => {
    const [y, m, day] = d.split('-').map(Number);
    return Date.UTC(y, m - 1, day);
  };
  return Math.round((utc(to) - utc(from)) / 86_400_000);
}

/**
 * Soll an eine Sicherung erinnert werden? Ja, wenn die letzte heruntergeladene Sicherung mindestens `backupReminderDays`
 * Tage alt ist und seitdem an mindestens einem Tag gelernt wurde. Ohne Sicherung zählt der erste Lerntag.
 * Sonst undefined.
 */
export function backupReminder(progress: Progress, today = localDate()): BackupReminder | undefined {
  const { lastBackupDownloadAt: last, backupReminderDays } = progress.settings;
  const days = [...activityDays(progress)].sort();
  if (last) {
    const daysSince = daysBetween(last, today);
    if (daysSince < backupReminderDays || !days.some((d) => d > last)) return undefined;
    return { lastDownload: last, daysSince };
  }
  if (!days.length) return undefined;
  const daysSince = daysBetween(days[0], today);
  return daysSince >= backupReminderDays ? { daysSince } : undefined;
}
