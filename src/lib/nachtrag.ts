// Sicherheitskopie beim Schließen des Tabs. IndexedDB schreibt asynchron; ein Browser garantiert nicht, dass ein Schreibvorgang, der erst beim Schließen der Seite
// (pagehide) beginnt, noch fertig wird (Safari und Handys sind am ehesten betroffen). Deshalb wird in diesem Augenblick der noch nicht gespeicherte Stand
// SYNCHRON in den localStorage geschrieben – das ist garantiert. Wird der Schreibvorgang fertig, löscht der Tab die Kopie wieder; sonst arbeitet der nächste Start sie
// in den Lernstand ein.

import { migrateProgress, ProgressSchema, type Progress } from '../../domain/progress';
import { mergeProgress } from '../../domain/mergeProgress';
import type { FortschrittsSpeicher } from './fortschrittSpeicher';

export const NACHTRAG_KEY = 'ap2-fortschritt-nachtrag';

type KeyValue = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const browserSpeicher = (): KeyValue => localStorage;

/** Schreibt den ausstehenden Stand sofort in den localStorage. Fehler (voll, gesperrt) werden geschluckt: Es ist nur ein zusätzliches Netz. */
export function schreibeNachtrag(stand: Progress, speicher: () => KeyValue = browserSpeicher): void {
  try {
    speicher().setItem(NACHTRAG_KEY, JSON.stringify(stand));
  } catch {
    /* ohne die Kopie gilt der normale Schreibvorgang */
  }
}

export function loescheNachtrag(speicher: () => KeyValue = browserSpeicher): void {
  try {
    speicher().removeItem(NACHTRAG_KEY);
  } catch {
    /* egal */
  }
}

/** Die Kopie, wenn sie lesbar und gültig ist; sonst null (und eine kaputte Kopie wird entfernt, damit sie nicht jedes Mal stört). */
export function leseNachtrag(speicher: () => KeyValue = browserSpeicher): Progress | null {
  try {
    const roh = speicher().getItem(NACHTRAG_KEY);
    if (roh === null) return null;
    const geparst = ProgressSchema.safeParse(JSON.parse(roh));
    if (geparst.success) return migrateProgress(geparst.data);
  } catch {
    /* unlesbar: unten entfernen */
  }
  loescheNachtrag(speicher);
  return null;
}

/**
 * Arbeitet eine übrig gebliebene Kopie in den Lernstand ein: beide Stände werden zusammengeführt (die Kopie ist der jüngere, ihre Einstellungen gelten),
 * gespeichert, und erst dann wird die Kopie gelöscht. Schlägt das Speichern fehl, bleibt sie für den nächsten Start liegen.
 */
export async function arbeiteNachtragEin(
  speicher: FortschrittsSpeicher,
  kv: () => KeyValue = browserSpeicher,
): Promise<'nichts' | 'eingearbeitet'> {
  const nachtrag = leseNachtrag(kv);
  if (!nachtrag) return 'nichts';
  const gespeichert = migrateProgress(await speicher.read());
  await speicher.save(mergeProgress(nachtrag, gespeichert));
  loescheNachtrag(kv);
  return 'eingearbeitet';
}
