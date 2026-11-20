// Ein anderer Tab hat gespeichert: Wie wird sein Stand in diesem Tab übernommen? Der Vorgang ist asynchron (eigenes Speichern, dann Lesen), und in der
// Zwischenzeit kann der Nutzer hier etwas getan haben. Dann darf der gespeicherte Stand die neue Eingabe nicht überschreiben.

import { migrateProgress, type Progress } from '../../domain/progress';
import { mergeProgress } from '../../domain/mergeProgress';

export interface Uebernahme {
  /** Der Stand, den dieser Tab danach hat. */
  stand: Progress;
  /** true: Der Stand enthält Eigenes, das noch nicht gespeichert ist – er muss (wieder) gespeichert werden. */
  speichern: boolean;
}

/**
 * @param aktuell    der Stand dieses Tabs jetzt (nach dem Warten)
 * @param gespeichert der gerade gelesene gespeicherte Stand (roh)
 * @param ausstehend  gibt es hier Änderungen, die noch nicht gespeichert sind (zum Beispiel ein Tipp, der erst während des Wartens kam)?
 */
export function uebernehmeFremdenStand(aktuell: Progress, gespeichert: unknown, ausstehend: boolean): Uebernahme {
  const fremd = migrateProgress(gespeichert);
  // Nichts Eigenes offen: den gespeicherten Stand genau übernehmen (so verschwinden auch dort gelöschte Einträge).
  if (!ausstehend) return { stand: fremd, speichern: false };
  // Eigene Änderung offen: beides zusammenführen und das Ergebnis speichern.
  return { stand: mergeProgress(aktuell, fremd), speichern: true };
}
