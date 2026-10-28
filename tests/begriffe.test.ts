import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { mehrZiel, namensSchluessel, parseBegriffsseiten, pruefeBegriffsseiten } from '../shared/begriffsseiten';
import { emptyProgress } from '../shared/progress';
import { CONTENT_DIR, ladeInhalt } from '../server/loadContent';

// Begriffsseiten (Umsetzungsplan Phase 3): Parser, Prüfung, Verweise, Übungen zum Begriff, Suche und Seite.

const { content, seiten } = ladeInhalt(CONTENT_DIR);
const progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '' }),
}));

const { begriffsWoerter, seitenFinder, uebungenZuBegriff, verweisAufloeser } = await import('../src/lib/begriffe');
const { baueGlossar, glossarSuchEintraege } = await import('../src/lib/glossar');
const { baueSuchIndex, begriffSuchEintraege, sucheBegriffe } = await import('../src/lib/suche');
const { BegriffsSeiteAnsicht } = await import('../src/pages/Begriff');

const DATEI = [
  '<!-- Begriffsseiten X · Stand 2026-10 -->',
  '## Beispielbegriff (BB)',
  '<!-- id: beispielbegriff · quellen: Karte DD1, DD1 2.1 · stand: 2026-10 -->',
  '',
  'Kurze **Definition** in einem Absatz.',
  'Auch: Beispiel-Begriff, BBG',
  '',
  '### Erklärung',
  'Text.',
  '```svg',
  '## keine Überschrift im Code',
  '```',
  '',
  'Siehe auch: Anderer Begriff · Unbekannt',
  'Mehr: Deep Dive 1, 2.1 · Deep Dive 1, A1',
  '',
  '## Anderer Begriff',
  '<!-- id: anderer-begriff · quellen: DD1 1.1 · stand: 2026-10 -->',
  'Noch eine Definition.',
  '',
  '## Ohne Kommentar',
  'Text ohne id.',
  '',
  '## Ausgelassen',
  '- Jonas – Person',
].join('\n');

describe('Parser', () => {
  const { seiten: s, issues } = parseBegriffsseiten('Begriffsseiten_X.md', DATEI);

  it('liest Seiten mit id, Auch, Siehe auch und Mehr; „Ausgelassen“ und Code-Blöcke zählen nicht als Seite', () => {
    expect(s.map((x) => x.id)).toEqual(['beispielbegriff', 'anderer-begriff']);
    const b = s[0];
    expect(b.begriff).toBe('Beispielbegriff (BB)');
    expect(b.auch).toEqual(['Beispiel-Begriff', 'BBG']);
    expect(b.siehe).toEqual(['Anderer Begriff', 'Unbekannt']);
    expect(b.mehr).toEqual(['Deep Dive 1, 2.1', 'Deep Dive 1, A1']);
    expect(b.quellen).toBe('Karte DD1, DD1 2.1');
    expect(b.stand).toBe('2026-10');
    expect(b.markdown).toContain('## keine Überschrift im Code');
    expect(b.markdown).not.toMatch(/^(Auch|Siehe auch|Mehr):/m);
    expect(b.markdown.startsWith('Kurze **Definition**')).toBe(true);
  });

  it('Seite ohne id-Kommentar wird gemeldet und übersprungen', () => {
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('„Ohne Kommentar“');
  });

  it('Prüfung: unbekannte id, doppelte id, „Siehe auch“ ohne Ziel', () => {
    const doppelt = [...s, { ...s[1] }];
    const meldungen = pruefeBegriffsseiten(doppelt, new Set(['beispielbegriff']), new Set([namensSchluessel('Gibt es')])).map(
      (i) => i.message,
    );
    expect(meldungen.some((m) => m.includes('„anderer-begriff“ gibt es im Glossar nicht'))).toBe(true);
    expect(meldungen.some((m) => m.includes('doppelt'))).toBe(true);
    expect(meldungen.some((m) => m.includes('„Siehe auch“ ohne Seite: Unbekannt'))).toBe(true);
  });
});

describe('Echte Begriffsseiten in content/', () => {
  const glossar = baueGlossar(content);
  const ids = new Set(glossar.map((e) => e.id));

  it('alle Seiten gelesen, jede id gibt es im Glossar, keine Importhinweise', () => {
    expect(seiten.length).toBeGreaterThan(1000);
    for (const s of seiten) expect(ids.has(s.id), s.id).toBe(true);
    expect(content.issues.filter((i) => i.file.startsWith('Begriffsseiten_'))).toEqual([]);
    expect(content.begriffe).toHaveLength(seiten.length);
  });

  it('„Mehr“-Verweise führen zu Abschnitt, Teil oder Aufgabe', () => {
    expect(mehrZiel('Deep Dive 2, 1.2', content).link).toMatch(/^\/lernen\/02\?stelle=02-1-2-/);
    // DD11 hat einen Abschnitt „A3 – Manipulation erkennen“; ohne passenden Abschnitt führt die Nummer zur Aufgabe.
    expect(mehrZiel('Deep Dive 11, A3', content).link).toMatch(/^\/lernen\/11\?stelle=11-a3-/);
    expect(mehrZiel('Deep Dive 1, A1', content).link).toBe('/aufgabe/01-A1');
    expect(mehrZiel('Deep Dive 5, Teil 3', content).link).toMatch(/^\/lernen\/05\?stelle=05-teil-3/);
    expect(mehrZiel('irgendwas', content).link).toBeUndefined();
    // Jeder Verweis aller Seiten führt mindestens zum Deep Dive.
    const ohne = seiten.flatMap((s) => s.mehr.filter((m) => !mehrZiel(m, content).link).map((m) => `${s.id}: ${m}`));
    expect(ohne).toEqual([]);
  });

  it('„Siehe auch“: Seite, sonst Glossar-Eintrag oder Abschnitt – jeder Name bekommt einen Link', () => {
    const verweis = verweisAufloeser(content.begriffe!, glossar, content);
    expect(verweis('Fremdschlüssel')).toEqual({ text: 'Fremdschlüssel', link: '/glossar/fremdschlussel', art: 'seite' });
    const ohneLink = seiten.flatMap((s) => s.siehe.filter((n) => !verweis(n).link));
    expect(ohneLink).toEqual([]);
  });

  it('Übungen zum Begriff: Begriffskarte zuerst, dazu Aufgaben und SQL-Übungen', () => {
    const pk = seiten.find((s) => s.id === 'primarschlussel')!;
    expect(begriffsWoerter(pk)).toContain('primarschlussel');
    const u = uebungenZuBegriff(pk, content, content.flashcards);
    expect(u.karten[0].id).toBe('FB-primarschlussel');
    expect(u.karten.length).toBeGreaterThan(3);
    expect(u.aufgaben.length).toBeGreaterThan(0);
    // ganze Wörter: „Primärschlüsselspalte“ zählt nicht als „Primärschlüssel“
    expect(u.karten.every((c) => /primärschlüssel/i.test(`${c.question} ${c.answer}`))).toBe(true);
  });
});

describe('Suche führt zu Begriffsseiten (E1)', () => {
  const glossar = baueGlossar(content);
  const seiteZu = seitenFinder(seiten);
  const index = baueSuchIndex(content, progress.settings, [
    ...begriffSuchEintraege(seiten),
    ...glossarSuchEintraege(
      glossar.filter((e) => !seiteZu(e)),
      content,
    ),
  ]);

  it('Begriff gesucht: nur Begriffe, der gesuchte zuerst; die übrigen Treffer auf Wunsch', () => {
    const r = sucheBegriffe(index, 'Primärschlüssel');
    expect(r.treffer[0].eintrag.link).toBe('/glossar/primarschlussel');
    expect(r.treffer.every((t) => t.eintrag.art === 'begriff' || t.eintrag.art === 'glossar')).toBe(true);
    expect(r.weitere).toBeGreaterThan(0);
    expect(r.rueckfall).toBe(false);
    const alle = sucheBegriffe(index, 'Primärschlüssel', true);
    expect(alle.treffer.some((t) => t.eintrag.art === 'karte' || t.eintrag.art === 'abschnitt')).toBe(true);
  });

  it('andere Schreibweise („Auch“) findet die Seite', () => {
    const s = seiten.find((x) => x.auch?.length)!;
    expect(sucheBegriffe(index, s.auch![0]).treffer[0].eintrag.link).toBe(`/glossar/${encodeURIComponent(s.id)}`);
  });

  it('kein Begriff passt: Rückfall auf die übrigen Treffer', () => {
    const r = sucheBegriffe(index, '06-B4');
    expect(r.rueckfall || r.treffer.length === 0).toBe(true);
  });
});

describe('Seite', () => {
  it('zeigt Begriff, Text, Siehe auch, Üben und Nachlesen mit Links', () => {
    const pk = seiten.find((s) => s.id === 'primarschlussel')!;
    const html = renderToString(createElement(MemoryRouter, null, createElement(BegriffsSeiteAnsicht, { seite: pk }))).replace(
      /<!-- -->/g,
      '',
    );
    expect(html).toContain('<h1>Primärschlüssel</h1>');
    // Abschnitte als h2 direkt unter der h1 (lückenlose Gliederung)
    expect(html).toContain('<h2>Erklärung</h2>');
    expect(html).not.toContain('<h3>Erklärung');
    expect(html).toContain('href="/glossar/fremdschlussel"');
    expect(html).toContain('Üben');
    expect(html).toMatch(/href="\/karteikarten\?karten=FB-primarschlussel[^"]*&amp;von=begriff"/);
    expect(html).toMatch(/href="\/lernen\/02\?stelle=02-1-2-[^"]*"/);
    expect(html).toContain('Glossar</a> / <a');
  });
});
