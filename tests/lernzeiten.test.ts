import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, migrateSettings, ProgressSchema, type Progress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import type { Lernplan } from '../src/lib/lernplan';
import {
  falte,
  lernplanIcs,
  lernTermine,
  lernzeitAm,
  lernzeitenVon,
  minutenProWoche,
  OHNE_TERMIN_TAGE,
  sitzungenProWoche,
  STANDARD_LERNZEITEN,
  type Lernzeiten,
} from '../src/lib/lernzeiten';

// Lernzeiten (Einstellungen) und der Lernplan als Kalenderdatei (.ics).

const content = loadContent(CONTENT_DIR);
let progress: Progress = emptyProgress();
vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));
const { Einstellungen } = await import('../src/pages/Einstellungen');
const { Heute } = await import('../src/pages/Heute');
const render = (el: React.ReactElement) => renderToString(createElement(MemoryRouter, null, el)).replace(/<!-- -->/g, '');

// 2026-10-26 ist ein Montag.
const MO = '2026-10-26';
const L: Lernzeiten = {
  werktags: { tage: [1, 3], von: '18:30', minuten: 45 },
  wochenende: { tage: [6], von: '23:30', minuten: 60 },
};

const plan = (tage: number): Lernplan => ({
  tage,
  kartenGesamt: 125,
  kartenZiel: 100,
  kartenOffen: 70,
  neueKartenProTag: 4,
  kartenMinutenProTag: 6,
  begriffe: { gesamt: 0, sicher: 0 },
  wochen: [
    {
      nummer: 1,
      ab: MO,
      themen: [
        { id: '01', titel: 'SQL' },
        { id: '03', titel: 'Statistik I' },
      ],
    },
    { nummer: 2, ab: '2026-11-02', themen: [{ id: '05', titel: 'Prozessanalyse' }] },
  ],
});

describe('Lernzeiten in den Einstellungen', () => {
  it('Standard ohne Einstellung; gültige werden übernommen und bleiben im Schema gültig', () => {
    expect(lernzeitenVon(emptyProgress().settings)).toEqual(STANDARD_LERNZEITEN);
    const s = migrateSettings({ ...emptyProgress().settings, lernzeiten: L });
    expect(s.lernzeiten).toEqual(L);
    expect(ProgressSchema.safeParse({ ...emptyProgress(), settings: s }).success).toBe(true);
  });

  it('liest tolerant: falsche Tage fallen weg, doppelte zählen einmal; kaputte Uhrzeit oder Dauer → Standard', () => {
    const s = migrateSettings({
      lernzeiten: {
        werktags: { tage: [5, 1, 1, 6, 'x'], von: '07:05', minuten: 20 },
        wochenende: { tage: [0, 3], von: '09:00', minuten: 90 },
      },
    });
    expect(s.lernzeiten).toEqual({
      werktags: { tage: [1, 5], von: '07:05', minuten: 20 },
      wochenende: { tage: [0], von: '09:00', minuten: 90 },
    });
    expect(migrateSettings({ lernzeiten: { ...L, werktags: { ...L.werktags, von: '25:00' } } }).lernzeiten).toBeUndefined();
    expect(migrateSettings({ lernzeiten: { ...L, wochenende: { ...L.wochenende, minuten: 2 } } }).lernzeiten).toBeUndefined();
    expect(migrateSettings({ lernzeiten: 'abends' }).lernzeiten).toBeUndefined();
  });

  it('lernzeitAm: Wochenende oder unter der Woche, nur an gewählten Tagen; Summen je Woche', () => {
    expect(lernzeitAm(L, MO)).toBe(L.werktags); // Montag
    expect(lernzeitAm(L, '2026-10-27')).toBeUndefined(); // Dienstag nicht gewählt
    expect(lernzeitAm(L, '2026-10-31')).toBe(L.wochenende); // Samstag
    expect(lernzeitAm(L, '2026-11-01')).toBeUndefined(); // Sonntag nicht gewählt
    expect(sitzungenProWoche(L)).toBe(3);
    expect(minutenProWoche(L)).toBe(150);
  });
});

describe('Lerntermine', () => {
  it('mit Lernplan: nur an Lerntagen bis vor die Prüfung, Themen der Woche, Kartentempo je Sitzung, am Ende Endspurt', () => {
    const t = lernTermine(plan(14), L, MO, '2026-11-09');
    // 14 Tage ab Montag: Mo, Mi, Sa, Mo, Mi, Sa
    expect(t.map((x) => x.datum)).toEqual(['2026-10-26', '2026-10-28', '2026-10-31', '2026-11-02', '2026-11-04', '2026-11-07']);
    expect(t[0]).toMatchObject({ von: '18:30', minuten: 45, titel: 'AP2 lernen: SQL, Statistik I' });
    // 4 neue Karten je Tag · 7 Tage / 3 Lerntage = 10 je Sitzung; 6 min · 7 / 3 = 14 min
    expect(t[0].text).toContain('etwa 10 neue plus die fälligen (≈ 14 min)');
    expect(t[3].titel).toBe('AP2 lernen: Prozessanalyse');
    // die letzten 3 Tage vor der Prüfung (6.–8.11.): Samstag ist Endspurt
    expect(t[5].titel).toBe('AP2: Wiederholung & Übungsklausur');
    expect(t[4].titel).not.toContain('Wiederholung');
  });

  it('ohne Prüfungstermin: vier Wochen allgemeine Lerntermine', () => {
    const t = lernTermine(undefined, L, MO);
    expect(t).toHaveLength(12);
    expect(t.every((x) => x.titel === 'AP2 lernen')).toBe(true);
    expect(t.at(-1)!.datum < '2026-11-23').toBe(true);
    expect(OHNE_TERMIN_TAGE).toBe(28);
  });

  it('keine Lerntage → keine Termine', () => {
    const leer: Lernzeiten = { werktags: { ...L.werktags, tage: [] }, wochenende: { ...L.wochenende, tage: [] } };
    expect(lernTermine(plan(14), leer, MO, '2026-11-09')).toEqual([]);
  });
});

describe('Kalenderdatei', () => {
  const termine = lernTermine(plan(14), L, MO, '2026-11-09');
  const datei = lernplanIcs(termine, '2026-11-09', { appLink: 'https://example.org/app/#/heute', jetzt: new Date('2026-10-26T08:00:00Z') });
  const zeilen = datei.split('\r\n');

  it('ein Termin je Lerntag plus Prüfungstag, schwebende Ortszeit, über Mitternacht korrekt, Erinnerung', () => {
    expect(datei.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(datei.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(zeilen.filter((z) => z === 'BEGIN:VEVENT')).toHaveLength(termine.length + 1);
    expect(zeilen).toContain('DTSTART:20261026T183000');
    expect(zeilen).toContain('DTEND:20261026T191500');
    // Samstag 23:30 + 60 min → Sonntag 00:30
    expect(zeilen).toContain('DTSTART:20261031T233000');
    expect(zeilen).toContain('DTEND:20261101T003000');
    expect(zeilen).toContain('TRIGGER:-PT10M');
    expect(zeilen).toContain('DTSTART;VALUE=DATE:20261109');
    expect(zeilen).toContain('URL:https://example.org/app/#/heute');
    const uids = zeilen.filter((z) => z.startsWith('UID:'));
    expect(new Set(uids).size).toBe(uids.length);
  });

  it('maskiert Kommas und Zeilenumbrüche und faltet lange Zeilen auf höchstens 75 Byte', () => {
    expect(datei).toContain('SUMMARY:AP2 lernen: SQL\\, Statistik I');
    const enc = new TextEncoder();
    for (const z of zeilen) expect(enc.encode(z).length, z).toBeLessThanOrEqual(75);
    const lang = 'DESCRIPTION:' + 'Ü'.repeat(100);
    const gefaltet = falte(lang);
    expect(gefaltet.split('\r\n ').join('')).toBe(lang);
    for (const z of gefaltet.split('\r\n')) expect(enc.encode(z).length).toBeLessThanOrEqual(75);
  });

  it('ohne Erinnerung und ohne Link', () => {
    const ohne = lernplanIcs(termine.slice(0, 1), undefined, { erinnerung: 0 });
    expect(ohne).not.toContain('VALARM');
    expect(ohne).not.toContain('URL:');
    expect(ohne).not.toContain('AP2-Prüfung');
  });
});

describe('Seiten', () => {
  it('Einstellungen: Lernzeiten mit Wochentagen, Beginn, Dauer und Kalender-Knopf', () => {
    progress = { ...emptyProgress(), settings: { ...emptyProgress().settings, lernzeiten: L } };
    const html = render(createElement(Einstellungen));
    expect(html).toContain('Lernzeiten');
    expect(html).toContain('Unter der Woche');
    expect(html).toContain('Am Wochenende');
    for (const t of ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']) expect(html).toContain(`>${t}</label>`);
    expect(html).toContain('value="18:30"');
    expect(html).toContain('3 Lerntage, 2 Std. 30 Min. pro Woche');
    expect(html).toContain('Lernplan in den Kalender (.ics)');
    progress = emptyProgress();
  });

  it('Heute lernen: Kalender-Knopf beim Lernplan, auch ohne Prüfungstermin', () => {
    const html = render(createElement(Heute));
    expect(html).toContain('Lernplan in den Kalender (.ics)');
    expect(html).toContain('Lernzeiten ändern');
  });
});
