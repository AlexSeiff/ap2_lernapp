// Persönliche Einstellungen (Progress.settings): reine Update-Funktion. Typ, Standardwerte und Migration stehen in shared/progress.ts.

import type { Progress, Settings } from '../../shared/progress';

/** Übernimmt Änderungen an den Einstellungen; ein leerer oder fehlender Prüfungstermin wird entfernt. */
export function withSettings(p: Progress, changes: Partial<Settings>): Progress {
  const settings: Settings = { ...p.settings, ...changes };
  if (!settings.examDate) delete settings.examDate;
  return { ...p, settings };
}

/** Ist das Lernblatt ausgeblendet (Einstellungen → ausgeblendeteThemen)? */
export const istAusgeblendet = (settings: Pick<Settings, 'ausgeblendeteThemen'>, topicId: string) =>
  !!settings.ausgeblendeteThemen?.includes(topicId);

/** Lernblatt aus- oder wieder einblenden; die Liste bleibt in Reihenfolge des Ausblendens, eine leere Liste fällt weg. */
export function setzeAusgeblendet(p: Progress, topicId: string, aus: boolean): Progress {
  const ohne = (p.settings.ausgeblendeteThemen ?? []).filter((id) => id !== topicId);
  const liste = aus ? [...ohne, topicId] : ohne;
  const settings: Settings = { ...p.settings, ausgeblendeteThemen: liste };
  if (!liste.length) delete settings.ausgeblendeteThemen;
  return { ...p, settings };
}
