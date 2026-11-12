import katex from 'katex';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { F, FORMELN, formelnDerVorlage, formelnNachThema, THEMA_NAMEN, uebungenLink } from '../src/rechnen/formeln';
import { VORLAGEN } from '../src/rechnen/vorlagen/index';

// Formelsammlung (ROADMAP 4.5): eine Quelle für /material/formeln und die Rechenwege der Vorlagen.

const content = loadContent(CONTENT_DIR);

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, aiEnabled: false, aiModel: '' }),
}));

const { Formelsammlung } = await import('../src/pages/Formelsammlung');
const { Material } = await import('../src/pages/Material');
const { RechenUebungen } = await import('../src/pages/RechenUebungen');

function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/material', element: createElement(Material) }),
    createElement(Route, { path: '/material/formeln', element: createElement(Formelsammlung) }),
    createElement(Route, { path: '/rechnen', element: createElement(RechenUebungen) }),
  );
  return renderToString(createElement(MemoryRouter, { initialEntries: [path] }, routes)).replace(/<!-- -->/g, '');
}

/** Vorlagen, deren Rechenweg die allgemeine Formel nur in konkreter Form zeigt (Fenster k, abgerundete Stunden, Uhrzeiten). */
const OHNE_ALLGEMEINE_FORMEL_IM_RECHENWEG = ['gleitender-durchschnitt', 'minijob', 'rpo'];

describe('Formeln (src/rechnen/formeln.ts)', () => {
  it('jede Vorlage hat mindestens eine Formel, keine Formel verweist auf eine unbekannte Vorlage', () => {
    for (const id of Object.keys(VORLAGEN)) expect(formelnDerVorlage(id).length, id).toBeGreaterThan(0);
    for (const f of FORMELN) for (const v of f.vorlagen) expect(Object.keys(VORLAGEN), `${f.id} → ${v}`).toContain(v);
    // Formeln nur aus den Lernblättern (Umsetzungsplan Phase 6) haben keine Rechenübung – die Seite zeigt dann keinen Link.
    expect(FORMELN.filter((f) => !f.vorlagen.length).map((f) => f.id)).toEqual([
      'laplace',
      'gegenereignis',
      'mindestensEinmal',
      'erwartungswert',
      'zWert',
      'spearman',
      'wachstumsrate',
      'falschPositivRate',
      'kostenSchwelle',
      'mape',
    ]);
  });

  it('IDs eindeutig, Pflichtangaben gefüllt, Thema bekannt und als Lernblatt vorhanden', () => {
    expect(new Set(FORMELN.map((f) => f.id)).size).toBe(FORMELN.length);
    for (const f of FORMELN) {
      expect(f.name.trim(), f.id).not.toBe('');
      expect(f.erklaerung.trim(), f.id).not.toBe('');
      expect(THEMA_NAMEN[f.thema], f.id).toBeDefined();
      expect(
        content.topics.some((t) => t.id === f.thema),
        f.id,
      ).toBe(true);
    }
  });

  it('jede Formel und jedes Variablensymbol ist gültiges KaTeX', () => {
    for (const f of FORMELN) {
      for (const tex of [f.latex, ...f.variablen.map((v) => v.symbol)]) {
        expect(() => katex.renderToString(tex, { throwOnError: true, strict: 'ignore' }), `${f.id}: ${tex}`).not.toThrow();
      }
    }
  });

  it('die Rechenwege der Vorlagen verwenden die Formeln der Sammlung (eine Quelle)', () => {
    for (const v of Object.values(VORLAGEN)) {
      if (OHNE_ALLGEMEINE_FORMEL_IM_RECHENWEG.includes(v.id)) continue;
      const schritte = [1, 2, 3].flatMap((seed) => v.loese(v.schema.parse(v.erzeuge(seed))).schritte.map((s) => s.formel));
      const eigene = formelnDerVorlage(v.id).map((f) => f.latex);
      expect(
        eigene.some((tex) => schritte.some((s) => s.includes(tex))),
        `${v.id}: kein Rechenschritt nutzt eine seiner Formeln`,
      ).toBe(true);
    }
    expect(VORLAGEN.lagemasse.loese(VORLAGEN.lagemasse.schema.parse({ werte: [1, 2, 3] })).schritte.map((s) => s.formel)).toContain(
      F.mittel.latex,
    );
  });

  it('Gruppen nach Thema und Links zu den Übungen', () => {
    const gruppen = formelnNachThema();
    expect(gruppen.map((g) => g.thema)).toEqual(['03', '04', '05', '06', '07', '09', '10', '12', '14', '16']);
    expect(gruppen.reduce((s, g) => s + g.formeln.length, 0)).toBe(FORMELN.length);
    expect(uebungenLink(F.mittel)).toBe('/rechnen?vorlage=lagemasse,varianz');
  });
});

describe('Seite /material/formeln', () => {
  it('zeigt alle Formeln mit KaTeX, gruppiert nach Lernblatt, mit Links zu den Rechenübungen', () => {
    const html = render('/material/formeln');
    expect(html).toContain('Formelsammlung');
    expect(html).not.toContain('katex-error');
    for (const f of FORMELN) expect(html, f.id).toContain(`id="formel-${f.id}"`);
    expect((html.match(/class="katex"/g) ?? []).length).toBeGreaterThanOrEqual(FORMELN.length);
    for (const t of ['03', '07', '12']) expect(html).toContain(content.topics.find((x) => x.id === t)!.title.replace(/&/g, '&amp;'));
    expect(html).toContain('href="/rechnen?vorlage=lagemasse,varianz"');
    expect(html).toContain('Drucken');
  });

  it('Material verlinkt die Formelsammlung', () => {
    expect(render('/material')).toContain('href="/material/formeln"');
  });

  it('/rechnen?vorlage=… zeigt nur Übungen dieser Vorlagen', () => {
    const html = render('/rechnen?vorlage=lagemasse,varianz');
    const passend = content.rechenUebungen.filter((u) => u.vorlage === 'lagemasse' || u.vorlage === 'varianz');
    expect(passend.length).toBeGreaterThan(0);
    for (const u of content.rechenUebungen) expect(html.includes(`/rechnen/${u.id}"`), u.id).toBe(passend.includes(u));
    expect(html).toContain('Nur Übungen zu:');
  });
});
