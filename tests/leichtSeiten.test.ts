import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, type Progress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { leichtKarten } from '../src/lib/leicht';

// Rauchtest des Leicht-Modus (Server-Rendering ohne Browser): Moduswahl, Filteranzeige und Zahlen auf /karteikarten.

const content = loadContent(CONTENT_DIR);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '' }),
}));

const { Karteikarten } = await import('../src/pages/Karteikarten');
const { RechenUebung } = await import('../src/pages/RechenUebung');

function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/karteikarten', element: createElement(Karteikarten) }),
    createElement(Route, { path: '/rechnen/:id', element: createElement(RechenUebung) }),
  );
  const app = createElement(MemoryRouter, { initialEntries: [path] }, routes);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, app)).replace(/<!-- -->/g, '');
}

const mitSettings = (s: Partial<Progress['settings']>): Progress => ({
  ...emptyProgress(),
  settings: { ...emptyProgress().settings, ...s },
});

describe('Karteikarten im Leicht-Modus', () => {
  it('Aufdecken: Moduswahl sichtbar, alle Karten zählen', () => {
    progress = emptyProgress();
    const html = render('/karteikarten');
    expect(html).toContain('Aufdecken');
    expect(html).toContain('Leicht (4 Antworten)');
    expect(html).not.toContain('Karten dieser Auswahl haben 4 Antworten');
    expect(html).toContain(`Alle ${content.flashcards.length} durchgehen`);
  });

  it('Leicht: nur unterstützte Karten, mit Anzahl; ohne Fachgespräch-Filter', () => {
    progress = mitSettings({ leichtModus: true });
    const n = leichtKarten(content.flashcards, { automatisch: true }).size;
    const html = render('/karteikarten');
    expect(html).toContain(`${n} von ${content.flashcards.length} Karten dieser Auswahl haben 4 Antworten`);
    expect(html).toContain(`Alle ${n} durchgehen`);
    expect(html).not.toContain('<option value="fachgespraech">');
    expect(html).toMatch(/Wissen \(\d+ mit 4 Antworten\)/);
  });

  it('Leicht ohne automatische Antworten: keine Karte (es gibt noch keine mc-Blöcke)', () => {
    progress = mitSettings({ leichtModus: true, leichtAutomatisch: false });
    const html = render('/karteikarten');
    const mc = content.flashcards.filter((c) => c.mc && c.kind !== 'fachgespraech').length;
    expect(html).toContain(`${mc} von ${content.flashcards.length} Karten`);
    expect(html).toContain(`Alle ${mc} durchgehen`);
  });

  it('Filter im Leicht-Modus: Typ-Filter zählt nur unterstützte Karten', () => {
    progress = mitSettings({ leichtModus: true });
    const m = leichtKarten(content.flashcards, { automatisch: true });
    const falle = content.flashcards.filter((c) => c.typ === 'falle');
    const html = render('/karteikarten?typ=falle');
    expect(html).toContain(`${falle.filter((c) => m.has(c.id)).length} von ${falle.length} Karten`);
  });
});

describe('Rechenübungen: Ergebnis auswählen', () => {
  it('Eintippen: Moduswahl und Eingabefelder', () => {
    progress = emptyProgress();
    const html = render('/rechnen/RE-ST1-001');
    expect(html).toContain('Eintippen');
    expect(html).toContain('Ergebnis auswählen');
    expect(html).toContain('✓ Prüfen');
    expect(html).not.toContain('leicht-option');
  });

  it('jede Übung zeigt im Leicht-Modus Auswahlknöpfe statt Eingabefeldern', () => {
    progress = mitSettings({ leichtModus: true });
    for (const u of content.rechenUebungen) {
      const html = render(`/rechnen/${u.id}`);
      expect(html, u.id).toContain('leicht-option');
      expect(html, u.id).not.toContain('✓ Prüfen');
      expect(html, u.id).not.toContain('keine Auswahl');
    }
  });
});
