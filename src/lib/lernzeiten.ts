// Lernzeiten und Lernplan im Kalender: Aus den Einstellungen (wann unter der Woche, wann am Wochenende) und dem Lernplan bis zur
// Prüfung (lib/lernplan.ts) werden Lerntermine – als .ics-Datei für Google, Outlook, Apple oder jedes andere Kalenderprogramm.
// Rein (ohne React, ohne Speicher). Uhrzeiten sind „schwebend“ (ohne Zeitzone): Der Kalender zeigt sie in der Ortszeit des Geräts.

import { type Lernzeit, type Settings, WERKTAGE, WOCHENENDTAGE } from '../../shared/progress';
import { addDays } from './progress';
import { ics } from './export';
import { PUFFER_TAGE, type Lernplan } from './lernplan';

export type Lernzeiten = NonNullable<Settings['lernzeiten']>;

/** Standard, solange nichts eingestellt ist: Mo–Fr 18:00 für 30 Minuten, Sa 10:00 für 60 Minuten. */
export const STANDARD_LERNZEITEN: Lernzeiten = {
  werktags: { tage: [...WERKTAGE], von: '18:00', minuten: 30 },
  wochenende: { tage: [6], von: '10:00', minuten: 60 },
};

/** Auswahl für die Dauer in den Einstellungen. */
export const LERN_DAUERN = [15, 20, 30, 45, 60, 90, 120];

/** Kurzname je Wochentag (Date.getDay). */
export const TAG_KURZ = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

/** Ohne Kalender-Export ohne Prüfungstermin: so viele Tage im Voraus. */
export const OHNE_TERMIN_TAGE = 28;

export const lernzeitenVon = (settings: Pick<Settings, 'lernzeiten'>): Lernzeiten => settings.lernzeiten ?? STANDARD_LERNZEITEN;

const wochentag = (datum: string) => {
  const [y, m, d] = datum.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
};

/** Die Lernzeit an diesem Tag (Wochenende oder unter der Woche) – oder undefined, wenn an dem Tag nicht gelernt wird. */
export function lernzeitAm(lernzeiten: Lernzeiten, datum: string): Lernzeit | undefined {
  const tag = wochentag(datum);
  const gruppe = WOCHENENDTAGE.includes(tag) ? lernzeiten.wochenende : lernzeiten.werktags;
  return gruppe.tage.includes(tag) ? gruppe : undefined;
}

/** Lerntage je Woche (für das Kartentempo je Sitzung). */
export const sitzungenProWoche = (lernzeiten: Lernzeiten) => lernzeiten.werktags.tage.length + lernzeiten.wochenende.tage.length;

/** Gesamte Lernzeit je Woche in Minuten. */
export const minutenProWoche = (l: Lernzeiten) =>
  l.werktags.tage.length * l.werktags.minuten + l.wochenende.tage.length * l.wochenende.minuten;

export interface LernTermin {
  datum: string;
  von: string;
  minuten: number;
  titel: string;
  text: string;
}

/**
 * Lerntermine von `heute` bis zum Tag vor der Prüfung (ohne Termin: OHNE_TERMIN_TAGE Tage). In den Wochen des Lernplans stehen
 * die Schwerpunktthemen und das Kartentempo je Sitzung; die letzten PUFFER_TAGE vor der Prüfung sind Wiederholung und Übungsklausuren.
 */
export function lernTermine(plan: Lernplan | undefined, lernzeiten: Lernzeiten, heute: string, examDate?: string): LernTermin[] {
  const tage = plan ? plan.tage : OHNE_TERMIN_TAGE;
  const proWoche = Math.max(1, sitzungenProWoche(lernzeiten));
  const kartenProSitzung = plan ? Math.ceil((plan.kartenProTag * 7) / proWoche) : 0;
  const termine: LernTermin[] = [];
  for (let i = 0; i < tage; i++) {
    const datum = addDays(heute, i);
    const zeit = lernzeitAm(lernzeiten, datum);
    if (!zeit) continue;
    const puffer = plan && examDate && i >= tage - PUFFER_TAGE;
    const woche = plan?.wochen[Math.min(Math.floor(i / 7), plan.wochen.length - 1)];
    let titel: string;
    const zeilen: string[] = [];
    if (puffer) {
      titel = 'AP2: Wiederholung & Übungsklausur';
      zeilen.push('Endspurt: Fehlerjournal, fällige Karten und eine Übungsklausur unter Zeitdruck.');
    } else if (woche?.themen.length) {
      titel = `AP2 lernen: ${woche.themen.map((t) => t.titel).join(', ')}`;
      zeilen.push(`Woche ${woche.nummer} – Schwerpunkte:`, ...woche.themen.map((t) => `• ${t.titel}`));
      if (kartenProSitzung > 0) zeilen.push(`Ziel heute: etwa ${kartenProSitzung} Karten sicher machen.`);
    } else {
      titel = 'AP2 lernen';
      zeilen.push('„Heute lernen“ stellt eine gemischte Runde aus dem zusammen, was fällig ist.');
    }
    zeilen.push(`Dauer: ${zeit.minuten} Minuten.`);
    termine.push({ datum, von: zeit.von, minuten: zeit.minuten, titel, text: zeilen.join('\n') });
  }
  return termine;
}

const zweistellig = (n: number) => String(n).padStart(2, '0');

/** „2026-10-24“ + „18:30“ (+ Minuten) → „20261024T183000“; über Mitternacht geht es am nächsten Tag weiter. */
function zeitpunkt(datum: string, von: string, plusMinuten = 0): string {
  const [y, m, d] = datum.split('-').map(Number);
  const [h, min] = von.split(':').map(Number);
  const t = new Date(y, m - 1, d, h, min + plusMinuten);
  return `${t.getFullYear()}${zweistellig(t.getMonth() + 1)}${zweistellig(t.getDate())}T${zweistellig(t.getHours())}${zweistellig(t.getMinutes())}00`;
}

/** Zeilen länger als 75 Byte falten (RFC 5545, 3.1): Fortsetzung beginnt mit einem Leerzeichen; Zeichen werden nicht zerteilt. */
export function falte(zeile: string): string {
  const enc = new TextEncoder();
  const teile: string[] = [];
  let aktuell = '';
  let bytes = 0;
  for (const z of zeile) {
    const n = enc.encode(z).length;
    const grenze = teile.length ? 74 : 75;
    if (bytes + n > grenze) {
      teile.push(aktuell);
      aktuell = '';
      bytes = 0;
    }
    aktuell += z;
    bytes += n;
  }
  teile.push(aktuell);
  return teile.join('\r\n ');
}

export interface IcsOptionen {
  /** Link in die App (z. B. https://…/#/heute) für die Beschreibung; fehlt = ohne Link. */
  appLink?: string;
  /** Erinnerung so viele Minuten vorher; 0 = keine. */
  erinnerung?: number;
  jetzt?: Date;
}

/**
 * Lerntermine (und den Prüfungstag, ganztägig) als iCalendar. Feste UIDs je Tag: Wer die Datei nach einer Änderung erneut
 * importiert, aktualisiert die Termine in den meisten Kalendern, statt sie zu verdoppeln.
 */
export function lernplanIcs(termine: LernTermin[], examDate: string | undefined, opt: IcsOptionen = {}): string {
  const stempel = (opt.jetzt ?? new Date()).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const erinnerung = opt.erinnerung ?? 10;
  const zeilen = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AP2 Lern-App//Lernplan//DE',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:AP2 Lernplan',
  ];
  for (const t of termine) {
    const text = opt.appLink ? `${t.text}\n\nIn der App: ${opt.appLink}` : t.text;
    zeilen.push(
      'BEGIN:VEVENT',
      `UID:lernplan-${t.datum}@ap2-lern-app`,
      `DTSTAMP:${stempel}`,
      `DTSTART:${zeitpunkt(t.datum, t.von)}`,
      `DTEND:${zeitpunkt(t.datum, t.von, t.minuten)}`,
      `SUMMARY:${ics(t.titel)}`,
      `DESCRIPTION:${ics(text)}`,
      ...(opt.appLink ? [`URL:${opt.appLink}`] : []),
      ...(erinnerung > 0
        ? ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${ics(t.titel)}`, `TRIGGER:-PT${erinnerung}M`, 'END:VALARM']
        : []),
      'END:VEVENT',
    );
  }
  if (examDate) {
    zeilen.push(
      'BEGIN:VEVENT',
      'UID:lernplan-pruefung@ap2-lern-app',
      `DTSTAMP:${stempel}`,
      `DTSTART;VALUE=DATE:${examDate.replace(/-/g, '')}`,
      `DTEND;VALUE=DATE:${addDays(examDate, 1).replace(/-/g, '')}`,
      'SUMMARY:AP2-Prüfung',
      'DESCRIPTION:IHK Abschlussprüfung Teil 2 – viel Erfolg!',
      'END:VEVENT',
    );
  }
  zeilen.push('END:VCALENDAR');
  return zeilen.map(falte).join('\r\n') + '\r\n';
}
