import { useCallback } from 'react';
import { backupFileName } from '../lib/backup';
import { localDate } from '../lib/progress';
import { withSettings } from '../lib/settings';
import { downloadText } from '../lib/sheets';
import { useStartStore } from '../lib/store';

/** Lädt den Fortschritt als Sicherungsdatei herunter und merkt sich den Tag (settings.lastBackupDownloadAt) für die Erinnerung. */
export function useBackupDownload(): () => void {
  const { progress, update } = useStartStore();
  return useCallback(() => {
    const today = localDate();
    downloadText(backupFileName(today), JSON.stringify(progress, null, 2), 'application/json');
    if (progress.settings.lastBackupDownloadAt !== today) update((p) => withSettings(p, { lastBackupDownloadAt: today }));
  }, [progress, update]);
}
