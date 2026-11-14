import { describe, expect, it } from 'vitest';
import { EXAM_MINUTES } from '../shared/config';
import { examMinutes, examRemaining, formatRemaining, timerAnnouncement } from '../src/lib/examTimer';

const min = 60_000;

describe('examMinutes', () => {
  it('liest die Bearbeitungszeit aus dem Titel der Übungsklausur', () => {
    expect(examMinutes({ title: 'Übungsklausur WiSo I (100 Punkte, 60 Minuten)' })).toBe(60);
    expect(examMinutes({ title: 'Übungsklausur SQL (100 Punkte, 90 Minuten)' })).toBe(90);
    expect(examMinutes({ title: 'Übungsklausur SQL – 100 Punkte, Richtzeit 90 Minuten' })).toBe(90);
  });

  it('fällt ohne brauchbare Angabe auf EXAM_MINUTES zurück', () => {
    expect(EXAM_MINUTES).toBe(90);
    expect(examMinutes({ title: 'Gemischte Probeklausur – Prozessanalyse' })).toBe(90);
    expect(examMinutes({ title: 'Übungsklausur' })).toBe(90);
    expect(examMinutes({ title: 'Übungsklausur Test (100 Punkte, 0 Minuten)' })).toBe(90);
    expect(examMinutes({ title: 'Übungsklausur Test (100 Punkte, 1234 Minuten)' })).toBe(90);
    expect(examMinutes(undefined)).toBe(90);
  });
});

describe('examRemaining', () => {
  const start = '2026-11-14T09:00:00Z';
  const at = Date.parse(start);

  it.each([60, 90])('begrenzt die Anzeige vor dem ersten Tick auf %i Minuten und zählt ab dem Start', (minutes) => {
    expect(examRemaining(start, minutes, at - 7 * min)).toBe(minutes * min);
    expect(examRemaining(start, minutes, at + 2200)).toBe(minutes * min - 2200);
    expect(examRemaining(start, minutes, at + minutes * min + 1000)).toBe(0);
  });
});

describe('formatRemaining', () => {
  it('zeigt mm:ss und nie negative Zeit', () => {
    expect(formatRemaining(90 * min)).toBe('90:00');
    expect(formatRemaining(65_500)).toBe('01:05');
    expect(formatRemaining(-5)).toBe('00:00');
  });
});

describe('timerAnnouncement', () => {
  it('ändert sich nur an den 5-Minuten-Marken', () => {
    expect(timerAnnouncement(90 * min)).toBe('Noch 90 Minuten.');
    expect(timerAnnouncement(85 * min + 1)).toBe('Noch 90 Minuten.');
    expect(timerAnnouncement(85 * min)).toBe('Noch 85 Minuten.');
    expect(timerAnnouncement(81 * min)).toBe('Noch 85 Minuten.');
    expect(timerAnnouncement(10 * min)).toBe('Noch 10 Minuten.');
  });

  it('sagt die letzte Minute und das Ende an', () => {
    expect(timerAnnouncement(2 * min)).toBe('Noch 5 Minuten.');
    expect(timerAnnouncement(min)).toBe('Noch 1 Minute.');
    expect(timerAnnouncement(1000)).toBe('Noch 1 Minute.');
    expect(timerAnnouncement(0)).toBe('Die Zeit ist abgelaufen.');
  });

  it('bleibt innerhalb eines Intervalls sekundengenau gleich', () => {
    const texts = new Set<string>();
    for (let ms = 80 * min + 1000; ms <= 85 * min; ms += 1000) texts.add(timerAnnouncement(ms));
    expect([...texts]).toEqual(['Noch 85 Minuten.']);
  });
});
