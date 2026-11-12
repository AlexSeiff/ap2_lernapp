import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { emptyProgress } from '../shared/progress';
import { inhaltMitDetails, teileInhalt } from '../shared/texte';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { inhaltSofort, ladeDetailsFuerAdresse, MitDetails } from '../src/lib/details';
import { StoreContext, useStore, type Store } from '../src/lib/store';
import { Dashboard } from '../src/pages/Dashboard';

// Start (content.json) ohne die Texte der Karten und Aufgaben: Die Übersicht muss damit auskommen, alle anderen Seiten stehen
// unterhalb von <MitDetails> und warten auf details.json.
const content = loadContent(CONTENT_DIR);
const { kern: start, details } = teileInhalt(content);
const kern = inhaltMitDetails(start, details);

const store = (inhalt: typeof start): Store<typeof start> => ({
  content: inhalt,
  progress: emptyProgress(),
  update: () => {},
  replaceProgress: () => {},
  firstVisit: false,
});

function render(inhalt: typeof start, kind: ReturnType<typeof createElement>): string {
  const mitStore = createElement(StoreContext.Provider, { value: store(inhalt) }, kind);
  const mitRouter = createElement(MemoryRouter, null, mitStore);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, mitRouter)).replace(/<!-- -->/g, '');
}

function Probe() {
  const { content: c } = useStore();
  return createElement('p', null, `Frage: ${c.flashcards[0].question}`);
}

describe('Start und Details', () => {
  it('die Übersicht rendert mit dem Start allein – ohne Fragen, Antworten und Aufgabentexte', () => {
    const html = render(start, createElement(Dashboard));
    expect(html).toContain('Heute lernen');
    expect(html).toContain('Kartenstand');
    // Der Begriff des Tages braucht die Begriffskarten mit Text und erscheint erst mit den Details.
    expect(html).not.toContain('w-begriff');
    expect(render(kern, createElement(Dashboard))).toContain('w-begriff');
  });

  it('useStore() gibt es nur mit Details: ohne sie ein klarer Fehler statt Karten ohne Frage', () => {
    expect(() => render(start, createElement(Probe))).toThrow(/MitDetails/);
    expect(render(kern, createElement(Probe))).toContain(`Frage: ${content.flashcards[0].question}`);
  });

  it('<MitDetails> zeigt „Lädt …“, bis die Details da sind, und dann die Seite mit Texten', () => {
    const seite = createElement(MitDetails, null, createElement(Probe));
    expect(render(start, seite)).toContain('Lädt …');
    expect(render(start, seite)).not.toContain('Frage:');
    expect(render(kern, seite)).toContain('Frage:');
    expect(inhaltSofort(kern)).toBe(kern);
    expect(inhaltSofort(start)).toBeUndefined();
  });

  it('nur andere Adressen als die Übersicht fordern die Details schon beim Start an', () => {
    expect(ladeDetailsFuerAdresse('')).toBe(false);
    expect(ladeDetailsFuerAdresse('#/')).toBe(false);
    expect(ladeDetailsFuerAdresse('#/karteikarten')).toBe(true);
    expect(ladeDetailsFuerAdresse('#/lernen/03?stelle=03-teil-1')).toBe(true);
  });
});
