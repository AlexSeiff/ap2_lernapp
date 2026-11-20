// Was beim Speichern des Lernstands gerechnet wird – ohne Speicher und ohne React, damit localStorage- und IndexedDB-Speicher dieselbe
// Logik nutzen (und sie sich einmal testen lässt): Daten prüfen, vor einem plötzlichen Versuchs-Rückgang schützen und Änderungen
// zusammenführen, die ein anderer Tab inzwischen gespeichert hat.

import { isSuspiciousAttemptDrop, migrateProgress, ProgressSchema, type Progress } from '../../domain/progress';
import { mergeProgress } from '../../domain/mergeProgress';

/** Fehlermeldungen, die der Nutzer lesen soll, beginnen so; alles andere wird als technischer Speicherfehler eingewickelt. */
export const NICHT_GESPEICHERT = 'Fortschritt nicht gespeichert:';

/**
 * @param body        der neue Stand dieses Tabs
 * @param storedRaw   der gerade gespeicherte Stand (roh, noch nicht migriert) oder null
 * @param known       der Stand, den dieser Tab zuletzt gelesen oder gespeichert hat (Vergleichsbasis), oder undefined
 * @param replace     bewusstes Ersetzen (Zurücksetzen, Sicherung einspielen): kein Schutz vor Versuchs-Rückgang
 * @returns `text` – was gespeichert wird; `progress` – der Stand, der danach als „zuletzt bekannt“ gilt
 */
export function berechneSpeicherstand(
  body: unknown,
  storedRaw: unknown,
  known: Progress | undefined,
  replace: boolean,
): { text: string; progress: Progress } {
  const parsed = ProgressSchema.safeParse(body);
  if (!parsed.success) {
    const where = parsed.error.issues
      .slice(0, 3)
      .map((issue) => issue.path.join('.') || '(gesamt)')
      .join(', ');
    throw new Error(`${NICHT_GESPEICHERT} Die Daten sind ungültig (Fehler bei ${where}).`);
  }
  const { revision: _revision, ...data } = parsed.data;
  const progress = data as Progress;
  const stored = migrateProgress(storedRaw);
  const baseline = known ?? stored;
  if (!replace && isSuspiciousAttemptDrop(baseline.attempts.length, progress.attempts.length)) {
    throw new Error(
      `${NICHT_GESPEICHERT} Er enthält nur ${progress.attempts.length} statt ${baseline.attempts.length} Versuche. ` +
        'Zum bewussten Zurücksetzen nutze „Fortschritt zurücksetzen“ oder „Sicherung einspielen“ auf der Seite Daten & Import. ' +
        'Ist die App in einem anderen Tab offen? Dann bitte diese Seite neu laden.',
    );
  }
  // Nur fremde Änderungen zusammenführen: sonst würden z. B. entfernte Antworten und Lernziele wieder auftauchen.
  const next = JSON.stringify(stored) === JSON.stringify(baseline) ? progress : mergeProgress(progress, stored);
  return { text: JSON.stringify(next), progress: migrateProgress(progress) };
}

/** Wickelt einen technischen Fehler (Speicher voll, gesperrt …) für den Nutzer ein; die eigenen Meldungen bleiben unverändert. */
export function alsSpeicherFehler(e: unknown): Error {
  if (e instanceof Error && e.message.startsWith(NICHT_GESPEICHERT)) return e;
  const grund = e instanceof Error ? e.message : String(e);
  return new Error(`Speichern im Browser fehlgeschlagen (${grund}). Lade zur Sicherheit eine Sicherung herunter.`, { cause: e });
}
