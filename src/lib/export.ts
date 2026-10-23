// Exporte: Karteikarten für Anki (Text mit Tabulatoren) und fällige Wiederholungen als Kalender (.ics).

import type { Progress } from '../../shared/progress';
import type { KernInhalt } from '../../shared/texte';
import type { Flashcard } from '../../shared/types';
import { begriffsFrage, bereichAusDeck } from './begriffsFrage';

const einzeilig = (s: string) => s.replace(/\r?\n/g, '<br>').replace(/\t/g, ' ').trim();
const slug = (s: string) => s.replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_|_$/g, '');

/** Vorderseite wie in der App: bei Begriffen die abgeleitete Frage (ohne Markdown-Sterne). */
function vorne(c: Flashcard, content: KernInhalt): string {
  if (c.typ !== 'begriff') return c.question;
  const deck = content.decks.find((d) => d.id === c.deckId);
  return begriffsFrage(c.question, c.answer, bereichAusDeck(deck?.title)).replace(/\*\*/g, '');
}

/**
 * Anki-Import (Datei → Importieren, Trennzeichen Tabulator): Vorderseite, Rückseite, Schlagwörter.
 * Rechenkarten bekommen ihren Rechenweg (Markdown) hinter die Antwort. Zeilenumbrüche werden zu `<br>`.
 */
export function ankiText(cards: Flashcard[], content: KernInhalt): string {
  const zeilen = cards.map((c) => {
    const deck = content.decks.find((d) => d.id === c.deckId);
    const tags = [c.topicId ? `DD${c.topicId}` : '', deck ? slug(deck.title) : '', c.typ ?? c.kind].filter(Boolean).join(' ');
    const hinten = [c.answer ?? '', c.rechenweg ?? ''].filter(Boolean).join('\n\n');
    return [einzeilig(vorne(c, content)), einzeilig(hinten), tags].join('\t');
  });
  return ['#separator:tab', '#html:true', '#tags column:3', ...zeilen].join('\n') + '\n';
}

/** Text für iCalendar maskieren (Backslash, Semikolon, Komma, Zeilenumbruch). */
export const ics = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const tagOhneStrich = (d: string) => d.replace(/-/g, '');
const naechsterTag = (d: string) => {
  const [y, m, t] = d.split('-').map(Number);
  const x = new Date(Date.UTC(y, m - 1, t + 1));
  return x.toISOString().slice(0, 10).replace(/-/g, '');
};

/** Fällige Wiederholungen je Tag (Karten, Fehlerjournal, SQL-/Rechenübungen) ab `heute` – und der Prüfungstermin – als iCalendar. */
export function kalenderIcs(progress: Progress, heute: string, jetzt = new Date()): string {
  const je = new Map<string, { karten: number; journal: number; uebungen: number }>();
  const eintrag = (due: string | undefined) => {
    if (!due) return undefined;
    const tag = due < heute ? heute : due;
    if (!je.has(tag)) je.set(tag, { karten: 0, journal: 0, uebungen: 0 });
    return je.get(tag)!;
  };
  for (const c of Object.values(progress.cards)) {
    const e = eintrag(c.due);
    if (e) e.karten += 1;
  }
  for (const j of Object.values(progress.journal)) {
    const e = !j.resolvedAt ? eintrag(j.due) : undefined;
    if (e) e.journal += 1;
  }
  for (const u of [...Object.values(progress.sql), ...Object.values(progress.rechnen), ...Object.values(progress.diagramme)]) {
    const e = eintrag(u.due);
    if (e) e.uebungen += 1;
  }
  const stempel = jetzt.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const zeilen = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AP2 Lern-App//DE', 'CALSCALE:GREGORIAN'];
  const ereignis = (uid: string, tag: string, titel: string, text: string) =>
    zeilen.push(
      'BEGIN:VEVENT',
      `UID:${uid}@ap2-lern-app`,
      `DTSTAMP:${stempel}`,
      `DTSTART;VALUE=DATE:${tagOhneStrich(tag)}`,
      `DTEND;VALUE=DATE:${naechsterTag(tag)}`,
      `SUMMARY:${ics(titel)}`,
      `DESCRIPTION:${ics(text)}`,
      'END:VEVENT',
    );
  for (const [tag, e] of [...je].sort(([a], [b]) => a.localeCompare(b))) {
    const teile = [
      e.karten && `${e.karten} Karten`,
      e.journal && `${e.journal} Fehlerjournal`,
      e.uebungen && `${e.uebungen} Übungen`,
    ].filter(Boolean);
    if (teile.length) ereignis(`faellig-${tag}`, tag, `AP2: ${teile.join(' · ')}`, `Fällig am ${tag}: ${teile.join(', ')}.`);
  }
  if (progress.settings.examDate) ereignis('pruefung', progress.settings.examDate, 'AP2-Prüfung', 'IHK Abschlussprüfung Teil 2');
  zeilen.push('END:VCALENDAR');
  return zeilen.join('\r\n') + '\r\n';
}

/** Datei im Browser speichern. */
export function ladeHerunter(name: string, text: string, typ: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: `${typ};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
