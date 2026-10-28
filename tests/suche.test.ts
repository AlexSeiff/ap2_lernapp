import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { defaultSettings, emptyProgress, type Progress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { OPERATOREN } from '../src/lib/operatoren';
import { ausschnitt, baueSuchIndex, bewerte, klartext, normalisiere, suche, SUCH_ART, type SuchArt } from '../src/lib/suche';
import { FORMELN } from '../src/rechnen/formeln';

// Globale Suche (ROADMAP 8.8): Normalisierung, Index, Rangfolge, Ziele, Dialog.

const content = loadContent(CONTENT_DIR);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { SucheDialog } = await import('../src/components/SucheDialog');
const { Karteikarten } = await import('../src/pages/Karteikarten');

function render(path: string, element: ReturnType<typeof createElement>, route = '*'): string {
  const routes = createElement(Routes, null, createElement(Route, { path: route, element }));
  const app = createElement(MemoryRouter, { initialEntries: [path] }, routes);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, app)).replace(/<!-- -->/g, '');
}

const alle = defaultSettings();
const index = baueSuchIndex(content, alle);

describe('Normalisierung', () => {
  it('Umlaute, Umschreibung, ß, Groß/klein und Akzente sind egal', () => {
    expect(normalisiere('Prüfung')).toBe(normalisiere('Pruefung'));
    expect(normalisiere('PRUFUNG')).toBe(normalisiere('prüfung'));
    expect(normalisiere('Größe')).toBe(normalisiere('Groesse'));
    expect(normalisiere('Straße')).toBe('strasse');
    expect(normalisiere('Café-Übersicht (3. NF)!')).toBe('cafe ubersicht 3 nf');
  });

  it('Klartext ohne Markdown, Links, Formelbefehle und Platzhalter', () => {
    expect(klartext('**Fett** und [Link](http://x) mit $\\bar{x} = \\frac{a}{b}$ und {{werte}}\n- [ ] Ziel')).toBe(
      'Fett und Link mit x = a b und … Ziel',
    );
  });
});

describe('Index', () => {
  it('enthält jede Art und jedes Ziel gibt es', () => {
    const arten = new Set(index.map((e) => e.art));
    for (const a of Object.keys(SUCH_ART) as SuchArt[]) if (a !== 'glossar' && a !== 'begriff') expect(arten.has(a), a).toBe(true);
    const sektionen = new Set(content.topics.flatMap((t) => t.sections.map((s) => `/lernen/${t.id}?stelle=${encodeURIComponent(s.id)}`)));
    for (const e of index.filter((x) => x.art === 'abschnitt')) expect(sektionen.has(e.link), e.link).toBe(true);
    expect(index.filter((e) => e.art === 'formel')).toHaveLength(FORMELN.length);
    expect(index.filter((e) => e.art === 'operator')).toHaveLength(OPERATOREN.length);
    expect(index.filter((e) => e.art === 'aufgabe')).toHaveLength(Object.keys(content.tasks).length);
    expect(index.filter((e) => e.art === 'sql')).toHaveLength(content.sqlExercises.length);
    expect(index.filter((e) => e.art === 'rechnen')).toHaveLength(content.rechenUebungen.length);
    expect(index.filter((e) => e.art === 'karte')).toHaveLength(content.flashcards.length);
    const mitLoesung = Object.values(content.tasks).filter((t) => t.solution?.markdown.trim());
    expect(index.filter((e) => e.art === 'loesung')).toHaveLength(mitLoesung.length);
  });

  it('findet Begriffe, die nur in einer Musterlösung stehen – als eigener Treffer zur Aufgabe', () => {
    // „Informationsdurchsickern“ steht nur in der Lösung zu DD6 E2 (Data Leakage), nicht in der Aufgabe.
    const treffer = suche(index, 'Informationsdurchsickern');
    expect(treffer.some((t) => t.eintrag.art === 'aufgabe')).toBe(false);
    const l = treffer.find((t) => t.eintrag.art === 'loesung')!;
    expect(l.eintrag.link).toBe('/aufgabe/06-B4');
    expect(l.eintrag.kontext).toBe('Musterlösung · Deep Dive 6 · CRISP-DM & Machine Learning');
    expect(l.ausschnitt).toContain('Informationsdurchsickern');
  });

  it('respektiert die Einstellungen Prüferfragen und Fachgespräch', () => {
    const ohne = baueSuchIndex(content, { prueferfragen: false, fachgespraech: false });
    const karten = (i: typeof index, art: string) => i.filter((e) => e.art === 'karte' && e.kontext.startsWith(art)).length;
    expect(karten(index, 'Prüferfrage')).toBeGreaterThan(0);
    expect(karten(index, 'Fachgespräch')).toBeGreaterThan(0);
    expect(karten(ohne, 'Prüferfrage')).toBe(0);
    expect(karten(ohne, 'Fachgespräch')).toBe(0);
    // Prüferfragen stehen auch nicht mehr im Text der Lernblätter.
    expect(index.filter((e) => e.art === 'abschnitt').some((e) => e.text.includes('Prüferfrage:'))).toBe(true);
    expect(ohne.filter((e) => e.art === 'abschnitt').some((e) => e.text.includes('Prüferfrage:'))).toBe(false);
  });
});

describe('Rangfolge', () => {
  it('alle Wörter müssen vorkommen; Titeltreffer vor Texttreffern', () => {
    const e = index.find((x) => x.art === 'formel' && x.titel === 'Arithmetisches Mittel')!;
    expect(bewerte(e, ['arithmetisches', 'mittel'], 'arithmetisches mittel')).toBeGreaterThan(20);
    expect(bewerte(e, ['arithmetisches', 'xyzzy'], 'arithmetisches xyzzy')).toBe(0);
    expect(suche(index, 'Median')[0].eintrag.titelN).toContain(' median');
  });

  it('findet typische Begriffe, auch mit Umschreibung', () => {
    const top = (q: string, n = 5) => suche(index, q).slice(0, n);
    expect(top('Normalform').some((t) => t.eintrag.titel.includes('Normalform'))).toBe(true);
    expect(top('Precision Recall').length).toBeGreaterThan(0);
    expect(top('Pruefung').length).toBe(top('Prüfung').length);
    expect(top('nennen').some((t) => t.eintrag.art === 'operator')).toBe(true);
    expect(top('Standardabweichung').some((t) => t.eintrag.art === 'formel')).toBe(true);
    expect(suche(index, 'x')).toEqual([]);
    expect(suche(index, 'qqqqzzzz')).toEqual([]);
    expect(suche(index, 'daten', 7)).toHaveLength(7);
  });

  it('Bindestrich-Wörter auch zusammengeschrieben: „knn“ findet „k-NN“', () => {
    const titel = (q: string) => suche(index, q, 10).map((t) => t.eintrag.titel);
    expect(titel('knn')).toContain('7.1 k-Nächste-Nachbarn (k-NN)');
    expect(ausschnitt('Verfahren wie k-NN (überwacht) und mehr', ['knn'])).toContain('k-NN');
  });

  it('Ausschnitt um den ersten Treffer', () => {
    expect(ausschnitt('Der Median ist robust gegenüber Ausreißern.', ['median'])).toContain('Median ist robust');
    const lang = `${'Wort '.repeat(40)}Kardinalität ${'Rest '.repeat(40)}`;
    const a = ausschnitt(lang, ['kardinalitat']);
    expect(a.startsWith('… ')).toBe(true);
    expect(a.endsWith(' …')).toBe(true);
    expect(a).toContain('Kardinalität');
    expect(ausschnitt('nichts', ['median'])).toBe('');
  });
});

describe('Dialog und Ziele', () => {
  it('Dialog: Eingabe als Combobox mit Trefferliste, Hinweis vor dem Tippen', () => {
    progress = emptyProgress();
    const html = render('/', createElement(SucheDialog, { onClose: () => {} }));
    expect(html).toContain('role="dialog"');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('Umlaute egal');
  });

  it('Karteikarte aus der Suche: genau diese Karte, als Suche beschriftet', () => {
    progress = emptyProgress();
    const card = content.flashcards.find((c) => c.kind === 'lernkarte')!;
    const html = render(`/karteikarten?karten=${card.id}&von=suche`, createElement(Karteikarten), '/karteikarten');
    expect(html).toContain('Aus der Suche: 1 Karte.');
  });
});
