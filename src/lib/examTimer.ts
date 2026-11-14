// Dauer und Restzeit der Übungsklausur: Bearbeitungszeit je Klausur, sichtbare Anzeige (mm:ss) und Ansage für Screenreader.
import { EXAM_MINUTES } from '../../shared/config';
import type { Exam } from '../../shared/types';

/**
 * Bearbeitungszeit einer Klausur in Minuten. Sie steht im Titel der Übungsklausur („… (100 Punkte, 60 Minuten)“ – WiSo 60,
 * Fachklausuren 90). Ohne Angabe im Titel (z. B. gemischte Probeklausur) gilt `EXAM_MINUTES`.
 * Gespeichert wird die Dauer nicht: Die Frist eines laufenden Klausurlaufs ergibt sich aus `startedAt` + dieser Dauer.
 */
export function examMinutes(exam: Pick<Exam, 'title'> | undefined): number {
  const m = exam && /\b(\d{1,3})\s*Minuten\b/.exec(exam.title);
  const minutes = m ? Number(m[1]) : 0;
  return minutes > 0 ? minutes : EXAM_MINUTES;
}

/** Vor dem ersten Timer-Tick kann `now` noch vom Öffnen der Startseite stammen. */
export function examRemaining(startedAt: string, minutes: number, now: number): number {
  const elapsed = Math.max(0, now - Date.parse(startedAt));
  return Math.max(0, minutes * 60_000 - elapsed);
}

/** Sichtbare Restzeit als „mm:ss“. */
export function formatRemaining(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

/**
 * Text für die aria-live-Region des Timers. Er ändert sich nur alle 5 Minuten und in der letzten Minute –
 * Screenreader sagen eine Live-Region nur bei Änderung an, eine sekündliche Ansage wäre unbenutzbar.
 */
export function timerAnnouncement(remainingMs: number): string {
  if (remainingMs <= 0) return 'Die Zeit ist abgelaufen.';
  const minutesLeft = Math.ceil(remainingMs / 60_000);
  if (minutesLeft <= 1) return 'Noch 1 Minute.';
  // Angesagt wird beim Erreichen jeder 5-Minuten-Marke (90, 85, 80, … bzw. 60, 55, …); bis zur nächsten Marke bleibt der Text gleich.
  const mark = Math.ceil(minutesLeft / 5) * 5;
  return `Noch ${mark} Minuten.`;
}
