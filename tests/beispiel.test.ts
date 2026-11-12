import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, type Progress, type RechenState } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { Rechenweg } from '../src/components/Rechenweg';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { baueBeispiel, beispielSeed, beispielSichtbarkeit, beispielStufe, formelMitZahlen } from '../src/rechnen/beispiel';
import { baueInstanz } from '../src/rechnen/instanz';

// Ausgeblendete Lösungsbeispiele der Rechenübungen (ROADMAP 8.6).

const content = loadContent(CONTENT_DIR);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '' }),
}));

const { RechenUebung } = await import('../src/pages/RechenUebung');

function render(path: string): string {
  const routes = createElement(Routes, null, createElement(Route, { path: '/rechnen/:id', element: createElement(RechenUebung) }));
  const app = createElement(MemoryRouter, { initialEntries: [path] }, routes);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, app)).replace(/<!-- -->/g, '');
}

const st = (s: Partial<RechenState>): RechenState => ({ attempts: 0, hintsUsed: 0, ...s });

describe('Stufe und Sichtbarkeit (rein)', () => {
  it('Stufe aus dem Lernstand: erst voll, dann mit Lücke, gelöst nur noch das Ergebnis', () => {
    expect(beispielStufe(undefined)).toBe('voll');
    expect(beispielStufe(st({}))).toBe('voll');
    expect(beispielStufe(st({ attempts: 2 }))).toBe('luecke');
    expect(beispielStufe(st({ attempts: 1, solutionShown: true, stage: 1, due: '2026-10-02' }))).toBe('luecke');
    expect(beispielStufe(st({ attempts: 1, solvedAt: '2026-10-01' }))).toBe('ergebnis');
    expect(beispielStufe(st({ attempts: 3, solvedAt: '2026-10-01', stage: 1, due: '2026-10-02' }))).toBe('luecke');
    expect(beispielStufe(st({ attempts: 4, solvedAt: '2026-10-01', stage: 2, due: '2026-10-05' }))).toBe('ergebnis');
  });

  it('voll: alle Schritte; Lücke: der letzte verdeckt; Ergebnis: keiner', () => {
    const f = ['a', 'b', 'c'];
    expect(beispielSichtbarkeit('voll', f, 'andere-zahlen')).toEqual(['ganz', 'ganz', 'ganz']);
    expect(beispielSichtbarkeit('luecke', f, 'andere-zahlen')).toEqual(['ganz', 'ganz', 'verdeckt']);
    expect(beispielSichtbarkeit('ergebnis', f, 'andere-zahlen')).toEqual([]);
    expect(beispielSichtbarkeit('luecke', ['a'], 'andere-zahlen')).toEqual(['verdeckt']);
    expect(beispielSichtbarkeit('voll', f, 'keins')).toEqual([]);
  });

  it('nur Formeln: nie Einsetzen/Ergebnis, Formeln mit konkreten Zahlen verdeckt', () => {
    expect(beispielSichtbarkeit('voll', ['\\frac{a}{n}', '603{,}00 / 13', 'x_1 + x_2'], 'formeln')).toEqual([
      'formel',
      'verdeckt',
      'formel',
    ]);
    expect(formelMitZahlen('x_{(n+1)/2}')).toBe(false);
    expect(formelMitZahlen('\\frac{770}{11}')).toBe(true);
  });

  it('Seed des Beispiels ist nie der aktuelle', () => {
    for (const s of [undefined, 1, 42, 123456]) {
      const b = beispielSeed('RE-ST1-001', s);
      expect(b).not.toBe(s);
      expect(beispielSeed('RE-ST1-001', s)).toBe(b);
    }
  });
});

describe('Beispiele für alle Übungen in content/', () => {
  const zahlen = (w: unknown): number[] => (typeof w === 'number' ? [w] : Array.isArray(w) ? (w as number[]) : []);

  it('verrät nie die Ergebnisse der aktuellen Zahlen (Originalzahlen und neue Zahlen, Stufe voll und Lücke)', () => {
    let andere = 0;
    for (const u of content.rechenUebungen) {
      for (const seed of u.neueZahlen ? [undefined, 7, 99_991] : [undefined]) {
        const aktuell = baueInstanz(u, seed);
        const deine = aktuell.eingaben.flatMap((e) => zahlen(e.erwartet));
        for (const state of [undefined, st({ attempts: 1 })]) {
          const b = baueBeispiel(u, aktuell, state);
          if (!aktuell.loesung.schritte.length) {
            expect(b.quelle, u.id).toBe('keins');
            continue;
          }
          if (b.quelle === 'andere-zahlen') {
            andere++;
            expect(b.inst!.loesung.werte, u.id).not.toEqual(aktuell.loesung.werte);
            b.inst!.loesung.schritte.forEach((s, i) => {
              if (b.sicht[i] === 'ganz')
                expect(
                  deine.some((d) => Math.abs(d - s.ergebnis) < 1e-9),
                  `${u.id} Schritt ${i}`,
                ).toBe(false);
            });
          } else {
            expect(b.quelle, u.id).toBe('formeln');
            expect(b.sicht, u.id).not.toContain('ganz');
            expect(u.neueZahlen, u.id).toBe(false);
          }
          expect(b.sicht.length, u.id).toBe(b.inst!.loesung.schritte.length);
          if (state) expect(b.sicht.at(-1), u.id).toBe('verdeckt');
        }
      }
    }
    expect(andere).toBeGreaterThan(200);
  });

  it('gelöste Übungen zeigen kein Beispiel', () => {
    const u = content.rechenUebungen.find((x) => x.vorlage === 'lagemasse')!;
    expect(baueBeispiel(u, baueInstanz(u), st({ attempts: 1, solvedAt: '2026-10-01' }))).toMatchObject({ stufe: 'ergebnis', sicht: [] });
  });
});

describe('Anzeige', () => {
  it('Rechenweg zeigt je nach Sicht alles, nur die Formel oder nur den Titel', () => {
    const schritte = [
      { titel: 'Summe', formel: '\\sum x_i', einsetzen: '1 + 2', ergebnis: 3 },
      { titel: 'Mittel', formel: '\\bar{x}', einsetzen: '3 / 2', ergebnis: 1.5 },
      { titel: 'Probe', formel: 'p', einsetzen: 'q', ergebnis: 9 },
    ];
    const html = renderToString(createElement(Rechenweg, { schritte, sicht: ['ganz', 'formel', 'verdeckt'] }));
    expect(html.match(/<dt>Einsetzen<\/dt>/g)).toHaveLength(1);
    expect(html.match(/<dt>Formel<\/dt>/g)).toHaveLength(2);
    expect(html).toContain('Diesen Schritt rechnest du selbst.');
    expect(html).not.toContain('>9<');
  });

  it('Übungsseite: erst volles Beispiel (offen), nach einem Versuch mit Lücke, gelöst nur der Hinweis', () => {
    const u = content.rechenUebungen.find((x) => x.vorlage === 'lagemasse' && x.neueZahlen)!;
    progress = emptyProgress();
    const voll = render(`/rechnen/${u.id}`);
    expect(voll).toContain('<details class="card beispiel" open="">');
    expect(voll).toContain('Beispiel: so rechnest du das');
    expect(voll).toContain('(andere Zahlen)');

    progress = { ...emptyProgress(), rechnen: { [u.id]: st({ attempts: 1 }) } };
    const luecke = render(`/rechnen/${u.id}`);
    expect(luecke).toContain('Beispiel mit Lücke');
    expect(luecke).not.toContain('open=""');

    progress = { ...emptyProgress(), rechnen: { [u.id]: st({ attempts: 1, solvedAt: '2026-10-01' }) } };
    const fertig = render(`/rechnen/${u.id}`);
    expect(fertig).not.toContain('class="card beispiel"');
    expect(fertig).toContain('Ohne Beispiel');
  });

  it('feste Übung ohne neue Zahlen: nur Schritte und Formeln', () => {
    const u = content.rechenUebungen.find((x) => x.vorlage && !x.neueZahlen)!;
    progress = emptyProgress();
    expect(render(`/rechnen/${u.id}`)).toContain('(nur Schritte und Formeln)');
  });
});
