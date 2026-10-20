import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_DIR, ladeInhalt } from '../server/loadContent';
import { contentJsonPlugin } from '../server/pagesPlugin';
import { defaultSettings, emptyProgress } from '../shared/progress';
import { inhaltMitTexten, istVoll, teileInhalt, themaMitTexten, type KernInhalt } from '../shared/texte';
import { Markdown } from '../src/components/Markdown';
import { cardPool } from '../src/lib/cards';
import { baueGlossar, glossarVon } from '../src/lib/glossar';
import { leichtKarten, leichtKartenGemerkt } from '../src/lib/leicht';
import { rehypeTabellen } from '../src/lib/loesungStil';
import { istSchlicht } from '../src/lib/markdownSchlicht';
import { normalisiere } from '../src/lib/normalisiere';
import { begriffSuchEintraege, zusammen } from '../src/lib/suche';
import { suchIndex } from '../src/lib/suchIndex';
import { ladeTexteFuerAdresse, themaSofort, vollerInhaltSofort } from '../src/lib/texte';

// Umsetzungsplan Phase 10 (Performance): Aufteilung von content.json, schneller Weg für schlichten Text, Caches – alles muss dieselben
// Ergebnisse liefern wie vorher.

const { content, seiten } = ladeInhalt(CONTENT_DIR);
const { kern, texte } = teileInhalt(content);
let storeInhalt: KernInhalt = content;

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content: storeInhalt, progress: emptyProgress(), update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { Thema } = await import('../src/pages/Themen');
const { Glossar } = await import('../src/pages/Glossar');

describe('content.json: Kern und Texte je Thema', () => {
  it('Kern ohne Abschnittstexte, zusammengesetzt wieder genau der Inhalt', () => {
    expect(kern.topics.every((t) => t.sections.every((s) => !('markdown' in s)))).toBe(true);
    expect(istVoll(kern)).toBe(false);
    expect(istVoll(content)).toBe(true);
    expect(Object.keys(texte).sort()).toEqual(content.topics.map((t) => t.id).sort());
    expect(inhaltMitTexten(kern, texte)).toEqual(content);
    // Das Original bleibt unverändert (der lokale Server cacht es).
    expect(content.topics[0].sections[0].markdown.length).toBeGreaterThan(0);
  });

  it('Abschnitts-ids je Thema eindeutig (sie sind die Schlüssel der Textdateien)', () => {
    for (const t of content.topics) expect(new Set(t.sections.map((s) => s.id)).size).toBe(t.sections.length);
  });

  it('der Kern ist deutlich kleiner – die Texte machen gut ein Drittel aus', () => {
    const voll = JSON.stringify(content).length;
    expect(JSON.stringify(kern).length).toBeLessThan(voll * 0.75);
  });

  it('fehlt ein Text (Kern und Texte aus verschiedenen Ständen), gibt es einen Fehler statt leerer Abschnitte', () => {
    const t = kern.topics[0];
    expect(() => themaMitTexten(t, {})).toThrow(/neu laden/);
  });

  it('Pages-Build: content.json ist der Kern, je Thema texte/<id>.json, dazu begriffe.json und ein Preload im HTML', () => {
    const dateien = new Map<string, string>();
    const plugin = contentJsonPlugin();
    const gen = plugin.generateBundle as unknown as (this: unknown) => void;
    gen.call({
      emitFile: (f: { fileName: string; source: string }) => dateien.set(f.fileName, f.source),
      error: (m: string) => {
        throw new Error(m);
      },
    });
    // importedAt ist der Zeitpunkt des Ladens.
    expect({ ...JSON.parse(dateien.get('content.json')!), importedAt: kern.importedAt }).toEqual(kern);
    for (const t of content.topics) expect(JSON.parse(dateien.get(`texte/${t.id}.json`)!)).toEqual(texte[t.id]);
    expect(dateien.has('begriffe.json')).toBe(true);
    const html = (plugin.transformIndexHtml as () => { tag: string; attrs: Record<string, string> }[])();
    expect(html).toEqual([
      expect.objectContaining({ tag: 'link', attrs: expect.objectContaining({ rel: 'preload', href: './content.json', as: 'fetch' }) }),
    ]);
  });
});

describe('Seiten mit nachgeladenen Texten', () => {
  const thema = (id: string) =>
    renderToString(
      createElement(
        MemoryRouter,
        { initialEntries: [`/lernen/${id}`] },
        createElement(Routes, null, createElement(Route, { path: '/lernen/:topicId', element: createElement(Thema) })),
      ),
    );

  it('Lernblatt: ohne Texte „Lädt …“ statt leerer Abschnitte, mit Texten wie bisher', () => {
    storeInhalt = kern;
    const ohne = thema('06');
    expect(ohne).toContain('Lädt …');
    expect(ohne).toContain('CRISP-DM'); // Titel und Inhaltsverzeichnis stehen schon da
    expect(ohne).not.toContain('class="theory"');
    expect(ohne).not.toContain('Lernziel-Check</h2>');
    storeInhalt = content;
    const mit = thema('06');
    expect(mit).not.toContain('Lädt …');
    expect(mit.match(/class="theory"/g)?.length).toBe(content.topics.find((t) => t.id === '06')!.sections.length);
  });

  it('Glossar wartet auf die Texte (es sammelt die fetten Begriffe der Lernblätter)', () => {
    storeInhalt = kern;
    expect(renderToString(createElement(MemoryRouter, null, createElement(Glossar)))).toContain('Lädt …');
    storeInhalt = content;
    expect(renderToString(createElement(MemoryRouter, null, createElement(Glossar)))).toContain('glossar-eintrag');
  });

  it('direkt geöffnetes Lernblatt: Text wird schon beim Start angefordert', () => {
    expect(ladeTexteFuerAdresse('#/lernen/06?stelle=06-teil-1')).toBe('06');
    expect(ladeTexteFuerAdresse('#/lernen')).toBeUndefined();
    expect(ladeTexteFuerAdresse('#/glossar')).toBeUndefined();
  });

  it('vollständiger Inhalt wird direkt genommen, ein Thema mit Texten auch', () => {
    expect(vollerInhaltSofort(content)).toBe(content);
    expect(vollerInhaltSofort(kern)).toBeUndefined();
    expect(themaSofort(content.topics[0])).toBe(content.topics[0]);
    expect(themaSofort(kern.topics[0])).toBeUndefined();
  });
});

describe('Caches', () => {
  it('Glossar je Inhalt nur einmal gebaut, gleiches Ergebnis wie baueGlossar', () => {
    const g = glossarVon(content);
    expect(glossarVon(content)).toBe(g);
    expect(g).toEqual(baueGlossar(content));
  });

  it('Suchindex je Inhalt, Begriffsseiten und Einstellung gemerkt', () => {
    const s = { prueferfragen: true, fachgespraech: true };
    const a = suchIndex(content, seiten, s);
    expect(suchIndex(content, seiten, s)).toBe(a);
    expect(suchIndex(content, seiten, { ...s, prueferfragen: false })).not.toBe(a);
    expect(a.some((e) => e.art === 'begriff')).toBe(true);
  });
});

describe('Bindestrich-Wörter in der Suche (schnellere Regex, gleiches Ergebnis)', () => {
  const alt = (s: string) => (s.match(/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+/gu) ?? []).map((w) => normalisiere(w).replace(/ /g, '')).join(' ');

  it('Beispiele', () => {
    expect(zusammen('k-NN und E-Mail, x--y, -a, b-, Ä-Ö-Ü1 (IT-Sicherheit)')).toBe(
      alt('k-NN und E-Mail, x--y, -a, b-, Ä-Ö-Ü1 (IT-Sicherheit)'),
    );
    expect(zusammen('k-NN')).toBe('knn');
  });

  it('alle Texte aus content/ und den Begriffsseiten', () => {
    const alle = [
      ...content.topics.flatMap((t) => t.sections.map((s) => s.markdown)),
      ...content.flashcards.map((c) => `${c.question}\n${c.answer ?? ''}`),
      ...Object.values(content.tasks).map((t) => t.markdown),
      ...begriffSuchEintraege(seiten).map((e) => e.text),
    ];
    for (const t of alle) expect(zusammen(t)).toBe(alt(t));
  });
});

describe('Markdown: schneller Weg für schlichten Text', () => {
  const voll = (text: string, className?: string) =>
    renderToString(
      createElement(
        'div',
        { className: `md ${className ?? ''}` },
        createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeTabellen] }, text),
      ),
    );
  const schnell = (text: string, className?: string) =>
    renderToString(createElement(MemoryRouter, null, createElement(Markdown, { source: false, className, children: text })));

  it('erkennt Markdown-Zeichen, Listen, Autolinks und Zeilenumbrüche', () => {
    expect(istSchlicht('Ein Wert, der (fast) immer gilt – 3,5 % mehr: ja?')).toBe(true);
    for (const t of [
      '**fett**',
      'a_b',
      '`code`',
      '[x](y)',
      '<b>',
      'a & b',
      'a | b',
      '$x$',
      '~~x~~',
      'a\\b',
      'www.example.de',
      'https://x.de',
      'a@b.de',
      'zwei\nZeilen',
      '- Liste',
      '+ Liste',
      '1. Liste',
      '2) Liste',
      '> Zitat',
      '# Titel',
      '=== ',
      ' Leerraum',
      'Leerraum ',
      '',
      '!x',
    ])
      expect(istSchlicht(t), t).toBe(false);
  });

  it('für jeden schlichten Text aus content/ dieselbe Ausgabe wie react-markdown', () => {
    const texte = [
      ...baueGlossar(content).flatMap((e) => (e.definition ? [e.definition] : [])),
      ...content.flashcards.flatMap((c) => [c.question, c.answer ?? '']),
      ...content.topics.flatMap((t) => t.lernziele),
      ...content.topics.flatMap((t) => t.sections.flatMap((s) => s.markdown.split('\n'))),
    ].filter(istSchlicht);
    expect(texte.length).toBeGreaterThan(1500);
    for (const t of new Set(texte)) expect(schnell(t, 'glossar-def'), t).toBe(voll(t, 'glossar-def'));
  }, 30000);

  it('Lösungs- und Operatoren-Stil gehen weiter durch den Parser', () => {
    const t = 'Nennen Sie zwei Gründe';
    const html = renderToString(
      createElement(MemoryRouter, null, createElement(Markdown, { source: false, operatoren: true, children: t })),
    );
    expect(html).toContain('class="operator"');
  });
});

describe('Leicht-Modus: Ähnlichkeitsrechnung gemerkt', () => {
  it('gleiche Karten → dasselbe Ergebnis wie leichtKarten, ohne neu zu rechnen; andere Karten → neu', () => {
    const pool = cardPool(content.flashcards, defaultSettings());
    const a = leichtKartenGemerkt(pool, { automatisch: true });
    expect(a).toEqual(leichtKarten(pool, { automatisch: true }));
    // neues Array mit denselben Karten (wie cardPool bei jedem Rendern)
    expect(leichtKartenGemerkt([...pool], { automatisch: true })).toBe(a);
    expect(leichtKartenGemerkt(pool, { automatisch: false })).not.toBe(a);
    expect(leichtKartenGemerkt(pool.slice(1), { automatisch: true })).not.toBe(a);
    // Kopien der Karten (z. B. andere Inhalte mit denselben ids) zählen nicht als gleich.
    expect(
      leichtKartenGemerkt(
        pool.map((c) => ({ ...c })),
        { automatisch: true },
      ),
    ).not.toBe(a);
  });
});
