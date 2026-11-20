// Selbsteinschätzung „Wie sicher bist du?“ (ROADMAP 8.3): Beschriftungen und Kalibrierung (rein, getestet).
// Zeigt, ob „sicher“ wirklich sicher ist – falsche Sicherheit vor der Prüfung erkennen.

import { SICHER_RICHTIG_AB } from '../../domain/config';
import type { Attempt, Sicherheit } from '../../domain/progress';

export const SICHERHEIT_STUFEN: { wert: Sicherheit; label: string; kurz: string }[] = [
  { wert: 1, label: 'unsicher', kurz: 'unsicher' },
  { wert: 2, label: 'teils', kurz: 'teils' },
  { wert: 3, label: 'sicher', kurz: 'sicher' },
];

export const sicherheitLabel = (s: Sicherheit) => SICHERHEIT_STUFEN.find((x) => x.wert === s)!.label;

/** Gilt ein Versuch als richtig? Mindestens SICHER_RICHTIG_AB der Punkte (bei max 0: nie). */
export const istRichtig = (a: Pick<Attempt, 'points' | 'max'>, ab = SICHER_RICHTIG_AB) => a.max > 0 && a.points / a.max >= ab - 1e-9;

export interface KalibrierungsStufe {
  stufe: Sicherheit;
  kurz: string;
  /** Versuche mit dieser Einschätzung. */
  anzahl: number;
  /** Davon „richtig“ (istRichtig). */
  richtig: number;
  /** Anteil richtig in Prozent (undefined ohne Versuche). */
  quote?: number;
  /** Durchschnittlich erreichte Punkte in Prozent. */
  schnitt?: number;
}

export interface Kalibrierung {
  stufen: KalibrierungsStufe[];
  /** Versuche mit Einschätzung insgesamt. */
  anzahl: number;
  /** Hinweis, wenn genug Daten da sind: falsche Sicherheit oder unterschätzt. */
  hinweis?: 'zu-sicher' | 'unterschaetzt' | 'passt';
}

/** Ab so vielen Versuchen je Stufe gibt es einen Hinweis. */
export const KALIBRIERUNG_MIN = 5;

/** Kalibrierung aller Versuche mit Selbsteinschätzung (aus Einzelaufgaben, Wiederholungen und Klausuren). */
export function kalibrierung(attempts: Attempt[], ab = SICHER_RICHTIG_AB): Kalibrierung {
  const stufen = SICHERHEIT_STUFEN.map(({ wert, kurz }): KalibrierungsStufe => {
    const liste = attempts.filter((a) => a.sicherheit === wert && a.max > 0);
    const richtig = liste.filter((a) => istRichtig(a, ab)).length;
    return {
      stufe: wert,
      kurz,
      anzahl: liste.length,
      richtig,
      ...(liste.length
        ? { quote: (richtig / liste.length) * 100, schnitt: (liste.reduce((s, a) => s + a.points / a.max, 0) / liste.length) * 100 }
        : {}),
    };
  });
  const anzahl = stufen.reduce((s, x) => s + x.anzahl, 0);
  const sicher = stufen[2];
  const unsicher = stufen[0];
  let hinweis: Kalibrierung['hinweis'];
  if (sicher.anzahl >= KALIBRIERUNG_MIN && sicher.quote! < 70) hinweis = 'zu-sicher';
  else if (unsicher.anzahl >= KALIBRIERUNG_MIN && unsicher.quote! >= 70) hinweis = 'unterschaetzt';
  else if (sicher.anzahl >= KALIBRIERUNG_MIN) hinweis = 'passt';
  return { stufen, anzahl, ...(hinweis ? { hinweis } : {}) };
}
