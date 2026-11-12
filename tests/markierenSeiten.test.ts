import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, type Progress } from '../shared/progress';
import { CONTENT_DIR, ladeInhalt } from '../build/inhalt';

// Karten markieren (Umsetzungsplan Phase 4): Stern in der Runde und beim Durchblättern, Filter „Nur markierte“,
// Kachel auf der Übersicht, Stern auf der Begriffsseite.

const { content, seiten } = ladeInhalt(CONTENT_DIR);
const begriffe = content.flashcards.filter((c) => c.typ === 'begriff');
const [m1, m2, m3] = begriffe.filter((c) => c.id !== 'FB-primarschlussel');
const progress: Progress = {
  ...emptyProgress(),
  markiert: {
    [m1.id]: { an: true, am: '2026-10-09T08:00:00.000Z' },
    [m2.id]: { an: true, am: '2026-10-09T08:01:00.000Z' },
    [m3.id]: { an: false, am: '2026-10-09T08:02:00.000Z' },
    'FB-primarschlussel': { an: true, am: '2026-10-09T08:03:00.000Z' },
  },
};

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { Karteikarten } = await import('../src/pages/Karteikarten');
const { Dashboard } = await import('../src/pages/Dashboard');
const { BegriffsSeiteAnsicht } = await import('../src/pages/Begriff');

const ohneKommentare = (html: string) => html.replace(/<!-- -->/g, '');
function render(path: string): string {
  const routes = createElement(Routes, null, createElement(Route, { path: '/karteikarten', element: createElement(Karteikarten) }));
  return ohneKommentare(renderToString(createElement(MemoryRouter, { initialEntries: [path] }, routes)));
}

describe('Karteikarten markieren', () => {
  it('Filter „Nur markierte“ zählt die markierten Karten und kombiniert sich mit dem Typ', () => {
    const alle = render('/karteikarten');
    expect(alle).toContain('Nur markierte (3)');
    const nur = render('/karteikarten?markiert=1');
    expect(nur).toMatch(/<input type="checkbox" checked=""\/><svg[^]*?<\/svg> Nur markierte \(3\)/);
    expect(nur).toContain('Filter (1 aktiv)');
    expect(nur).toContain('Durchblättern (3)');
    expect(render('/karteikarten?markiert=1&typ=wissen')).toContain('Durchblättern (0)');
  });

  it('beim Durchblättern: Stern als Umschaltknopf mit Taste M, gedrückt bei markierten Karten', () => {
    const html = render(`/karteikarten?markiert=1&typ=begriff&blaettern=1`);
    expect(html).toContain('Karte 1 / 3');
    expect(html).toMatch(/<button type="button" class="stern [^"]*" aria-pressed="true"[^>]*>.*Markieren <kbd>M<\/kbd><\/button>/);
    const frei = render(`/karteikarten?karten=${m3.id}&blaettern=1`);
    expect(frei).toContain('aria-pressed="false"');
  });

  it('Übersicht: Widget „Markiert“ mit Anzahl führt zum Filter', () => {
    const html = ohneKommentare(renderToString(createElement(MemoryRouter, null, createElement(Dashboard))));
    expect(html).toMatch(/<a class="kpi w-innen"[^>]*href="\/karteikarten\?markiert=1"[^>]*><span class="kpi-value">3<\/span>/);
  });

  it('Begriffsseite: Stern für die Begriffskarte neben der Überschrift und vor jeder Karte der Liste', () => {
    const pk = seiten.find((s) => s.id === 'primarschlussel')!;
    const html = ohneKommentare(renderToString(createElement(MemoryRouter, null, createElement(BegriffsSeiteAnsicht, { seite: pk }))));
    expect(html).toMatch(
      /<h1>Primärschlüssel<\/h1><button type="button" class="stern [^"]*" aria-pressed="true"[^>]*>.*Karte markieren<\/button>/,
    );
    expect(html).toMatch(
      /<li class="mit-stern"><button type="button" class="stern nur-icon" aria-pressed="true" aria-label="Markieren: Primärschlüssel"/,
    );
  });
});
