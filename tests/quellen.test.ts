import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../shared/progress';
import { parseQuellen, pruefeQuellenZiele, quellenNachZiel, type Quelle } from '../shared/quellen';
import { CONTENT_DIR, ladeInhalt, isContentFile } from '../build/inhalt';

// Quellen und Lehrvideos (Umsetzungsplan Phase 8): Import, Ziele, Anzeige auf Begriffsseiten und Lernblättern, Zwei-Klick-Video.

const { content, seiten } = ladeInhalt(CONTENT_DIR);

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, firstVisit: false }),
  useStartStore: () => ({ content, progress: emptyProgress(), update: () => {}, firstVisit: false }),
}));

const { Thema } = await import('../src/pages/Themen');
const { BegriffsSeiteAnsicht } = await import('../src/pages/Begriff');
const { QuellenListe, YoutubeZweiKlick } = await import('../src/components/Quellen');
const { Datenschutz } = await import('../src/components/Datenschutz');

const q = (extra: Partial<Quelle> = {}) => ({
  ziel: 'begriff:median',
  titel: 'Median',
  url: 'https://studyflix.de/statistik/median-2215',
  anbieter: 'Studyflix',
  art: 'video',
  geprueft: '2026-10',
  ...extra,
});

describe('Import', () => {
  it('liest gültige Quellen, überspringt fehlerhafte mit Meldung', () => {
    const { quellen, issues } = parseQuellen(
      'Q.json',
      JSON.stringify({
        quellen: [q(), q({ url: 'http://unsicher.de' }), q({ ziel: 'irgendwo' }), q({ youtubeId: 'zu-kurz' }), q({ geprueft: 'Oktober' })],
      }),
    );
    expect(quellen).toHaveLength(1);
    expect(issues.map((i) => i.message)).toEqual([
      expect.stringContaining('Nr. 2 übersprungen: url'),
      expect.stringContaining('Nr. 3 übersprungen: ziel'),
      expect.stringContaining('Nr. 4 übersprungen: youtubeId'),
      expect.stringContaining('Nr. 5 übersprungen: geprueft'),
    ]);
    expect(parseQuellen('Q.json', '[]').issues[0].message).toContain('„quellen“ fehlt');
  });

  it('Ziele, die es nicht gibt, werden gemeldet', () => {
    const qs = [q() as Quelle, q({ ziel: 'abschnitt:03-gibt-es-nicht' }) as Quelle];
    expect(pruefeQuellenZiele('Q.json', qs, new Set(['03-x']), new Set(['median']))).toEqual([
      { file: 'Q.json', message: expect.stringContaining('abschnitt:03-gibt-es-nicht gibt es nicht') },
    ]);
  });

  it('AP2_Quellen.json ist Inhalt, wird synchronisiert und hat keine Importfehler', () => {
    expect(isContentFile('AP2_Quellen.json')).toBe(true);
    expect(content.issues.filter((i) => i.file === 'AP2_Quellen.json')).toEqual([]);
    const qs = content.quellen ?? [];
    expect(qs.length).toBeGreaterThan(300);
    // nur https, nur geprüft; jedes Ziel existiert
    const abschnitte = new Set(content.topics.flatMap((t) => t.sections.map((s) => s.id)));
    const begriffe = new Set(seiten.map((s) => s.id));
    expect(pruefeQuellenZiele('x', qs, abschnitte, begriffe)).toEqual([]);
    for (const x of qs) expect(x.url, x.titel).toMatch(/^https:\/\//);
    // Studyflix-Videos werden verlinkt, nicht eingebettet
    expect(qs.filter((x) => x.youtubeId && x.anbieter === 'Studyflix' && !x.url.includes('youtube'))).toEqual([]);
  });
});

describe('Anzeige', () => {
  it('Lernblatt: Quellen am Ende des Abschnitts, öffnen in neuem Tab', () => {
    const html = renderToString(
      createElement(
        MemoryRouter,
        { initialEntries: ['/lernen/03'] },
        createElement(Routes, null, createElement(Route, { path: '/lernen/:topicId', element: createElement(Thema) })),
      ),
    );
    expect(html).toContain('href="https://studyflix.de/statistik/boxplot-1044" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('Weiterlesen und ansehen');
  });

  it('Begriffsseite: Abschnitt „Weiterlesen und Videos“', () => {
    const seite = seiten.find((s) => s.id === 'median')!;
    const html = renderToString(createElement(MemoryRouter, null, createElement(BegriffsSeiteAnsicht, { seite })));
    expect(html).toContain('Weiterlesen und Videos');
    expect(html).toContain('https://studyflix.de/statistik/median-2215');
  });

  it('YouTube nur nach Klick: vorher kein iframe und keine Adresse von YouTube', () => {
    const html = renderToString(createElement(YoutubeZweiKlick, { id: 'abcdefghijk', titel: 'Test' }));
    expect(html).toContain('Video laden');
    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('youtube');
    const liste = renderToString(createElement(QuellenListe, { quellen: [q({ youtubeId: 'abcdefghijk' }) as Quelle] }));
    expect(liste).not.toContain('<iframe');
    expect(liste).toContain('mit Video');
  });

  it('Datenschutz nennt die Zwei-Klick-Lösung', () => {
    expect(renderToString(createElement(Datenschutz))).toMatch(/youtube-nocookie\.com|Links zu Quellen/);
  });

  it('Einstellungen nennen die Lizenz der Lerninhalte, wie in LIZENZ-INHALTE.txt', () => {
    const html = renderToString(createElement(Datenschutz));
    expect(html).toContain('CC BY-NC-SA 4.0');
    expect(html).toContain('https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de');
    expect(readFileSync(new URL('../LIZENZ-INHALTE.txt', import.meta.url), 'utf8')).toContain(
      'Attribution-NonCommercial-ShareAlike 4.0 International',
    );
  });

  it('quellenNachZiel gruppiert in Dateireihenfolge', () => {
    const m = quellenNachZiel([q() as Quelle, q({ url: 'https://de.wikipedia.org/wiki/Median' }) as Quelle]);
    expect(m.get('begriff:median')?.map((x) => x.url)).toEqual([
      'https://studyflix.de/statistik/median-2215',
      'https://de.wikipedia.org/wiki/Median',
    ]);
  });
});
