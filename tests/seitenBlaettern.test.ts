// Seitenblättern zwischen Themen und Begriffen: Reihenfolge, Nachbarn, Wischrichtung, Anzeige.

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { begriffsFolge, nachbarn, themenFolge, wischRichtung } from '../src/lib/blaettern';
import { ThemaBlaettern } from '../src/components/ThemaBlaettern';

const topics = ['00', '01', '02', '03', '04'].map((id) => ({ id }));

describe('nachbarn', () => {
  it('liefert vorher und nachher, an den Rändern nur eine Seite', () => {
    const ids = ['a', 'b', 'c'];
    expect(nachbarn(ids, 'b')).toEqual({ zurueck: 'a', weiter: 'c' });
    expect(nachbarn(ids, 'a')).toEqual({ weiter: 'b' });
    expect(nachbarn(ids, 'c')).toEqual({ zurueck: 'b' });
  });

  it('unbekannte Id und einzelne Seite: kein Nachbar', () => {
    expect(nachbarn(['a', 'b'], 'x')).toEqual({});
    expect(nachbarn(['a'], 'a')).toEqual({});
    expect(nachbarn([], 'a')).toEqual({});
  });
});

describe('themenFolge', () => {
  it('behält die Reihenfolge der Themenliste', () => {
    expect(themenFolge(topics, {}, '02')).toEqual(['00', '01', '02', '03', '04']);
  });

  it('überspringt ausgeblendete Blätter – außer dem gerade offenen', () => {
    const settings = { ausgeblendeteThemen: ['01', '03'] };
    expect(themenFolge(topics, settings, '02')).toEqual(['00', '02', '04']);
    expect(nachbarn(themenFolge(topics, settings, '02'), '02')).toEqual({ zurueck: '00', weiter: '04' });
    // das offene Blatt ist selbst ausgeblendet: es bleibt in der Folge, die Nachbarn sind die sichtbaren
    expect(nachbarn(themenFolge(topics, settings, '03'), '03')).toEqual({ zurueck: '02', weiter: '04' });
  });
});

describe('begriffsFolge', () => {
  it('sortiert nach Begriff mit deutscher Sortierung (Umlaute bei ihren Grundbuchstaben)', () => {
    const seiten = [
      { id: 'zeta', begriff: 'Zeta' },
      { id: 'aepfel', begriff: 'Äpfel' },
      { id: 'anker', begriff: 'Anker' },
      { id: 'bit', begriff: 'Bit' },
    ];
    expect(begriffsFolge(seiten)).toEqual(['anker', 'aepfel', 'bit', 'zeta']);
  });

  it('verändert die übergebene Liste nicht', () => {
    const seiten = [
      { id: 'b', begriff: 'B' },
      { id: 'a', begriff: 'A' },
    ];
    begriffsFolge(seiten);
    expect(seiten.map((s) => s.id)).toEqual(['b', 'a']);
  });
});

describe('wischRichtung', () => {
  it('deutlich waagerecht: links = nach links gewischt', () => {
    expect(wischRichtung(-120, 10)).toBe('links');
    expect(wischRichtung(120, -10)).toBe('rechts');
  });

  it('zu kurz, zu schräg oder senkrecht (Scrollen): keine Richtung', () => {
    expect(wischRichtung(-60, 0)).toBeUndefined();
    expect(wischRichtung(-120, 70)).toBeUndefined();
    expect(wischRichtung(-100, 60)).toBeUndefined();
    expect(wischRichtung(-90, 46)).toBeUndefined(); // weniger als doppelt so weit waagerecht wie senkrecht
    expect(wischRichtung(5, 200)).toBeUndefined();
  });

  it('Schwellen lassen sich anpassen', () => {
    expect(wischRichtung(-60, 0, { minDx: 50 })).toBe('links');
    expect(wischRichtung(-120, 30, { maxDy: 20 })).toBeUndefined();
  });
});

describe('ThemaBlaettern', () => {
  const html = (props: Parameters<typeof ThemaBlaettern>[0]) =>
    renderToString(createElement(MemoryRouter, null, createElement(ThemaBlaettern, props)));

  it('zeigt beide Ziele mit Titel und Link', () => {
    const h = html({
      aktuell: '02',
      art: 'Thema',
      zurueck: { to: '/lernen/01', titel: 'Deep Dive 1 · SQL' },
      weiter: { to: '/lernen/03', titel: 'Deep Dive 3 · Statistik' },
    });
    expect(h).toContain('href="/lernen/01"');
    expect(h).toContain('href="/lernen/03"');
    expect(h).toContain('Voriges Thema');
    expect(h).toContain('Nächstes Thema');
    expect(h).toContain('Deep Dive 3 · Statistik');
  });

  it('am Ende der Folge nur „Voriger Begriff“; ohne Nachbarn nichts', () => {
    const h = html({ aktuell: 'z', art: 'Begriff', zurueck: { to: '/glossar/y', titel: 'Y' } });
    expect(h).toContain('Voriger Begriff');
    expect(h).not.toContain('Nächster Begriff');
    expect(html({ aktuell: 'a', art: 'Begriff' })).toBe('');
  });
});
