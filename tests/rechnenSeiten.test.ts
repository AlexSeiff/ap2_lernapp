import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, type Progress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { ConfirmContext } from '../src/hooks/useConfirm';

// Rauchtest der Seiten /rechnen und /rechnen/:id mit den echten Übungen (Server-Rendering ohne Browser):
// jede Übung rendert mit Aufgabe und Eingabefeldern, gespeicherte Antworten und Zufalls-Seeds werden übernommen.

const content = loadContent(CONTENT_DIR);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '' }),
}));

const { RechenUebung } = await import('../src/pages/RechenUebung');
const { RechenUebungen } = await import('../src/pages/RechenUebungen');

function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/rechnen', element: createElement(RechenUebungen) }),
    createElement(Route, { path: '/rechnen/:id', element: createElement(RechenUebung) }),
  );
  const app = createElement(MemoryRouter, { initialEntries: [path] }, routes);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, app)).replace(/<!-- -->/g, '');
}

describe('Rechenübungen-Seiten', () => {
  it('Liste zeigt alle Übungen, Fortschritt und Filter aus der URL', () => {
    progress = emptyProgress();
    const html = render('/rechnen');
    expect(html).toContain('Rechenübungen');
    expect(html).toContain(`0 / ${content.rechenUebungen.length} gelöst`);
    for (const u of content.rechenUebungen) expect(html).toContain(u.id);
    const gefiltert = render('/rechnen?stufe=3');
    for (const u of content.rechenUebungen) {
      if (u.schwierigkeit !== 3) expect(gefiltert).not.toContain(`/rechnen/${u.id}"`);
    }
  });

  it('jede Übung rendert mit ersetzten Platzhaltern und einem Eingabefeld je Ergebnis', () => {
    progress = emptyProgress();
    for (const u of content.rechenUebungen) {
      const html = render(`/rechnen/${u.id}`);
      expect(html, u.id).toContain('✓ Prüfen');
      expect(html, u.id).not.toContain('passt nicht zu ihrer Vorlage');
      expect(html, u.id).not.toMatch(/\{\{\s*[\w.-]+\s*\}\}/);
      expect(html, u.id).toContain('Rechne auf Papier, trage nur Ergebnisse ein.');
      expect(html, u.id).toContain('Formelübersicht');
      expect((html.match(/<input /g) ?? []).length, u.id).toBeGreaterThanOrEqual(Math.max(1, u.eingaben.length));
      expect(html.includes('Neue Zahlen'), u.id).toBe(u.neueZahlen);
    }
  });

  it('beginnt nach einem Versuch leer (keine alten Antworten, keine alten Hinweise), übernimmt aber die Zufallszahlen', () => {
    const u = content.rechenUebungen.find((x) => x.id === 'RE-ST1-001')!;
    progress = {
      ...emptyProgress(),
      rechnen: { [u.id]: { attempts: 1, hintsUsed: 1, lastCheckedAt: '2026-10-01', zuletztRichtig: true } },
    };
    let html = render(`/rechnen/${u.id}`);
    expect(html).not.toMatch(/<input[^>]*value="[^"]+"/);
    expect(html).not.toContain('<b>Hinweise');
    expect(html).not.toContain('Originalzahlen');
    progress = { ...emptyProgress(), rechnen: { [u.id]: { attempts: 0, hintsUsed: 0, lastSeed: 42 } } };
    html = render(`/rechnen/${u.id}`);
    expect(html).toContain('Originalzahlen');
    expect(html).not.toContain('60, 40, 220, 45');
  });

  it('unbekannte Übung → Hinweis mit Link zur Liste', () => {
    expect(render('/rechnen/GIBT-ES-NICHT')).toContain('Übung nicht gefunden');
  });
});
