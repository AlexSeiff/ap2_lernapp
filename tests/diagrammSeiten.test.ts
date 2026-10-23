import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, type Progress } from '../shared/progress';
import { CONTENT_DIR, ladeInhalt } from '../server/loadContent';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { aktiverBereich, aktivesUnterziel, bereich } from '../src/lib/navigation';

// Diagramm-Übungen (Umsetzungsplan Phase 7): Liste, Übungsseite, Verknüpfung von den Begriffsseiten, Navigation.

const { content, seiten } = ladeInhalt(CONTENT_DIR);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { DiagrammUebungen } = await import('../src/pages/DiagrammUebungen');
const { DiagrammUebung } = await import('../src/pages/DiagrammUebung');
const { BegriffsSeiteAnsicht } = await import('../src/pages/Begriff');

function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/diagramme', element: createElement(DiagrammUebungen) }),
    createElement(Route, { path: '/diagramme/:id', element: createElement(DiagrammUebung) }),
  );
  const app = createElement(MemoryRouter, { initialEntries: [path] }, routes);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, app)).replace(/<!-- -->/g, '');
}

describe('Diagramm-Übungen', () => {
  const alle = content.diagrammUebungen!;

  it('Liste mit Filter nach Typ aus der URL', () => {
    const html = render('/diagramme');
    expect(html).toContain('Diagramm-Übungen</h1>');
    expect(html).toContain(`0 / ${alle.length} gelöst`);
    const epk = render('/diagramme?typ=epk');
    expect(epk).toContain(`${alle.filter((u) => u.typ === 'epk').length} Übungen`);
    expect(epk).not.toContain('DG-BPMN-001');
  });

  it('Übungsseite: Szenario, Lücken als Knöpfe über dem Diagramm, Palette', () => {
    const html = render('/diagramme/DG-EPK-001');
    expect(html).toContain('eEPK: Bestellung prüfen');
    expect(html.match(/class="diagramm-slot/g)).toHaveLength(6);
    expect(html).toContain('aria-label="Lücke 1: leer"');
    expect(html).toContain('class="palette-element"');
    expect(html).toContain('Bestellung prüfen');
    expect(html).toMatch(/<button type="button" disabled="">.*Prüfen/);
  });

  it('beginnt nach einem Versuch leer – die alte Belegung kommt nicht zurück', () => {
    progress = {
      ...emptyProgress(),
      diagramme: { 'DG-EPK-001': { attempts: 1, hintsUsed: 0, lastCheckedAt: '2026-10-01', zuletztRichtig: true } },
    };
    const html = render('/diagramme/DG-EPK-001');
    expect(html).toContain('aria-label="Lücke 1: leer"');
    progress = emptyProgress();
  });

  it('unbekannte Übung', () => {
    expect(render('/diagramme/gibt-es-nicht')).toContain('Übung nicht gefunden');
  });

  it('Begriffsseite EPK verlinkt alle EPK-Übungen', () => {
    const seite = seiten.find((s) => /^(EPK|Ereignisgesteuerte Prozesskette)/.test(s.begriff))!;
    expect(seite).toBeDefined();
    const html = renderToString(createElement(MemoryRouter, null, createElement(BegriffsSeiteAnsicht, { seite })));
    for (const u of alle.filter((x) => x.typ === 'epk')) expect(html, u.id).toContain(`href="/diagramme/${u.id}"`);
  });

  it('Navigation: unter „Lernen“', () => {
    expect(aktiverBereich('/diagramme/DG-EPK-001')).toBe('lernen');
    expect(aktivesUnterziel('/diagramme/DG-EPK-001', bereich('lernen'))?.label).toBe('Diagramm-Übungen');
  });
});
