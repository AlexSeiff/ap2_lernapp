import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress, type ExamRun, type Progress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { ConfirmContext } from '../src/hooks/useConfirm';
import {
  baueMischKlausur,
  FALLBACK_GEWICHTE,
  gewichteAusThemenliste,
  klausurFuer,
  klausurName,
  MISCH_PUNKTE,
  type MischBereich,
  mischId,
  parseMischId,
  themenliste,
  UNTERBEREICHE,
  verteile,
} from '../src/lib/mischKlausur';
import { finishExam } from '../src/lib/progress';
import { examSheet } from '../src/lib/sheets';
import { examTrends, topicStats } from '../src/lib/stats';

// Gemischte Probeklausur (ROADMAP 8.5): Zusammenstellung, IDs, Statistik und Seiten.

const content = loadContent(CONTENT_DIR);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { Klausur, KlausurAuswahl } = await import('../src/pages/Klausur');
const { Dashboard } = await import('../src/pages/Dashboard');
const { Druck } = await import('../src/pages/Druck');

function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/klausur', element: createElement(KlausurAuswahl) }),
    createElement(Route, { path: '/klausur/:topicId', element: createElement(Klausur) }),
    createElement(Route, { path: '/druck', element: createElement(Druck) }),
    createElement(Route, { path: '/', element: createElement(Dashboard) }),
  );
  const app = createElement(MemoryRouter, { initialEntries: [path] }, routes);
  return renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, app)).replace(/<!-- -->/g, '');
}

const BEREICHE: MischBereich[] = ['gemischt', 'prozess', 'qualitaet'];
const SEEDS = Array.from({ length: 120 }, (_, i) => i * 7919 + 1);

describe('Gewichte aus der Themenliste', () => {
  it('zählt die Checklistenpunkte je Unterbereich der echten Themenliste', () => {
    expect(gewichteAusThemenliste(themenliste(content.materials)?.markdown)).toEqual({
      A1: 7,
      A2: 6,
      A3: 5,
      A4: 3,
      B1: 7,
      B2: 8,
      B3: 4,
      B4: 6,
    });
  });

  it('liest eigene Überschriften, fehlende Bereiche und fehlende Datei → Fallback', () => {
    const md = '### A1 Prozesse\n- [ ] a\n- [ ] b\n\n**Beispielfragen:**\n1. x\n### A2 PM\n- [x] c\n## 4. C\n- [ ] gehört zu nichts';
    expect(gewichteAusThemenliste(md)).toEqual({ ...FALLBACK_GEWICHTE, A1: 2, A2: 1 });
    expect(gewichteAusThemenliste(undefined)).toEqual(FALLBACK_GEWICHTE);
  });

  it('verteilt 100 Punkte ganzzahlig nach Gewicht (größter Rest)', () => {
    expect(verteile([7, 6, 5, 3], 100)).toEqual([33, 29, 24, 14]);
    expect(verteile([1, 1, 1], 100)).toEqual([34, 33, 33]);
    expect(verteile([0, 0], 100)).toEqual([0, 0]);
    for (const g of [[7, 6, 5, 3, 7, 8, 4, 6], [3], [2, 9]]) expect(verteile(g, 100).reduce((s, x) => s + x, 0)).toBe(100);
  });

  it('jede Quelle der Unterbereiche gibt es in content/ (Deep Dive mit Übungsklausur, Block vorhanden)', () => {
    for (const u of UNTERBEREICHE) {
      for (const q of u.quellen) {
        const exam = content.topics.find((t) => t.id === q.topicId)?.exam;
        expect(exam, `${u.id} → ${q.topicId}`).toBeDefined();
        for (const b of q.bloecke ?? [])
          expect(
            exam!.blocks.map((x) => x.letter),
            `${u.id} → ${q.topicId}-${b}`,
          ).toContain(b);
      }
    }
  });
});

describe('baueMischKlausur', () => {
  for (const bereich of BEREICHE) {
    it(`${bereich}: Punkte stimmen, höchstens 100 und mindestens 98, keine Aufgabe doppelt`, () => {
      for (const seed of SEEDS) {
        const k = baueMischKlausur(content, bereich, seed);
        const ids = k.blocks.flatMap((b) => b.taskIds);
        expect(new Set(ids).size).toBe(ids.length);
        const summe = ids.reduce((s, id) => s + content.tasks[id].points, 0);
        expect(k.totalPoints).toBe(summe);
        expect(k.blocks.reduce((s, b) => s + b.points, 0)).toBe(summe);
        expect(summe).toBeLessThanOrEqual(MISCH_PUNKTE);
        expect(summe).toBeGreaterThanOrEqual(98);
        for (const b of k.blocks) expect(b.gruppen.flatMap((g) => g.taskIds)).toEqual(b.taskIds);
      }
    });
  }

  it('meist genau 100 Punkte', () => {
    const genau = SEEDS.filter((s) => baueMischKlausur(content, 'gemischt', s).totalPoints === 100).length;
    expect(genau / SEEDS.length).toBeGreaterThan(0.9);
  });

  it('reproduzierbar: gleicher Seed → gleiche Klausur; andere Seeds → andere Zusammenstellungen', () => {
    expect(baueMischKlausur(content, 'gemischt', 4711)).toEqual(baueMischKlausur(content, 'gemischt', 4711));
    const varianten = new Set(
      SEEDS.map((s) =>
        baueMischKlausur(content, 'gemischt', s)
          .blocks.flatMap((b) => b.taskIds)
          .join(),
      ),
    );
    expect(varianten.size).toBeGreaterThan(SEEDS.length * 0.9);
  });

  it('streut über die Themen: gemischt aus beiden Bereichen und mehreren Deep Dives', () => {
    for (const seed of SEEDS) {
      const k = baueMischKlausur(content, 'gemischt', seed);
      const themen = new Set(k.blocks.flatMap((b) => b.gruppen.map((g) => g.topicId)));
      expect(themen.size).toBeGreaterThanOrEqual(4);
      expect(k.blocks.map((b) => b.unterbereich[0])).toEqual(expect.arrayContaining(['A', 'B']));
      expect(k.blocks.length).toBeGreaterThanOrEqual(6);
    }
  });

  it('Bereich Prozessanalyse nimmt nur Quellen von A1–A4, Datenqualität nur von B1–B4', () => {
    for (const [bereich, praefix] of [
      ['prozess', 'A'],
      ['qualitaet', 'B'],
    ] as const) {
      const erlaubt = new Set(UNTERBEREICHE.filter((u) => u.id.startsWith(praefix)).flatMap((u) => u.quellen.map((q) => q.topicId)));
      for (const seed of SEEDS.slice(0, 40)) {
        const k = baueMischKlausur(content, bereich, seed);
        expect(k.blocks.every((b) => b.unterbereich.startsWith(praefix))).toBe(true);
        for (const b of k.blocks) for (const g of b.gruppen) expect(erlaubt.has(g.topicId)).toBe(true);
      }
    }
  });

  it('Blockpunkte folgen ungefähr der Gewichtung der Themenliste', () => {
    const k = baueMischKlausur(content, 'qualitaet', 99);
    expect(k.ziele).toEqual({ B1: 28, B2: 32, B3: 16, B4: 24 });
    for (const b of k.blocks) expect(Math.abs(b.points - k.ziele[b.unterbereich])).toBeLessThanOrEqual(12);
  });

  it('jede Gruppe ist ein zusammenhängender Anfang ihres Originalblocks, mit dessen Einleitung', () => {
    for (const seed of SEEDS.slice(0, 40)) {
      for (const b of baueMischKlausur(content, 'gemischt', seed).blocks) {
        for (const g of b.gruppen) {
          const orig = content.topics.find((t) => t.id === g.topicId)!.exam!.blocks.find((x) => x.letter === g.block)!;
          expect(orig.taskIds.slice(0, g.taskIds.length)).toEqual(g.taskIds);
          expect(g.intro).toBe(orig.intro);
          expect(g.punkte).toBe(g.taskIds.reduce((s, id) => s + content.tasks[id].points, 0));
        }
      }
    }
  });

  it('nimmt Anlagen aller beteiligten Deep Dives mit Herkunft im Titel mit', () => {
    const k = baueMischKlausur(content, 'qualitaet', 5);
    const themen = new Set(k.blocks.flatMap((b) => b.gruppen.map((g) => g.topicId)));
    for (const id of themen) {
      for (const a of content.topics.find((t) => t.id === id)!.exam!.attachments) {
        expect(k.attachments.some((x) => x.id === a.id && x.title.endsWith(a.title))).toBe(true);
      }
    }
  });
});

describe('IDs und Klausurquelle', () => {
  it('mischId und parseMischId passen zusammen; Deep-Dive-IDs sind keine gemischten', () => {
    expect(parseMischId(mischId('prozess', 123))).toEqual({ bereich: 'prozess', seed: 123 });
    expect(parseMischId('03')).toBeUndefined();
    expect(parseMischId('mix-unbekannt-1')).toBeUndefined();
    expect(parseMischId('mix-gemischt-')).toBeUndefined();
    expect(parseMischId(undefined)).toBeUndefined();
  });

  it('klausurFuer: Deep Dive mit Thema, gemischte ohne Thema; Unbekanntes → undefined', () => {
    expect(klausurFuer(content, '03')?.topic?.id).toBe('03');
    const m = klausurFuer(content, 'mix-gemischt-42')!;
    expect(m.topic).toBeUndefined();
    expect(m.misch?.seed).toBe(42);
    expect(m.untertitel).toContain('Nr. 42');
    expect(klausurFuer(content, 'xx')).toBeUndefined();
  });

  it('klausurName für die Historie', () => {
    expect(klausurName(content, '03')).toBe(content.topics.find((t) => t.id === '03')!.title);
    expect(klausurName(content, 'mix-prozess-1')).toBe('Gemischt (Prozessanalyse)');
  });
});

describe('Historie und Statistik mit einer gemischten Klausur', () => {
  const id = 'mix-gemischt-42';
  const k = klausurFuer(content, id)!;
  const tasks = k.exam.blocks.flatMap((b) => b.taskIds).map((t) => content.tasks[t]);
  const run: ExamRun = {
    id: 'ex-mix',
    topicId: id,
    startedAt: '2026-10-01T08:00:00.000Z',
    submittedAt: '2026-10-01T09:30:00.000Z',
    answers: {},
    scores: Object.fromEntries(tasks.map((t) => [t.id, t.points / 2])),
    max: k.exam.totalPoints,
  };
  const p = finishExam({ ...emptyProgress(), activeExam: run }, run, tasks, '2026-10-01T10:00:00.000Z');

  it('finishExam: Versuche je Aufgabe (mit ihrem Deep Dive), Klausur in der Historie', () => {
    expect(p.exams).toHaveLength(1);
    expect(p.exams[0].total).toBe(k.exam.totalPoints / 2);
    expect(p.attempts).toHaveLength(tasks.length);
    expect(Object.keys(p.journal)).toHaveLength(tasks.length);
  });

  it('Trend und Bestwert je Thema ignorieren die gemischte Klausur, Aufgabenschnitt zählt sie', () => {
    expect(examTrends(content, p)).toEqual([]);
    const stats = topicStats(content, p);
    expect(stats.every((s) => s.bestExam === undefined && s.lastExam === undefined)).toBe(true);
    const t = stats.find((s) => s.topic.id === tasks[0].topicId)!;
    expect(t.avgTaskPct).toBe(50);
  });

  it('Lösungsblatt /druck mit derselben Aufgabenfolge', () => {
    const sheet = examSheet(content, id, 'loesungen')!;
    expect(sheet.groups.flatMap((g) => g.tasks.map((t) => t.id))).toEqual(tasks.map((t) => t.id));
    expect(sheet.totalPoints).toBe(k.exam.totalPoints);
    expect(sheet.groups[0].heading).toMatch(/^Block A – /);
  });

  it('Seiten: Auswahl, Startseite, laufende Klausur, Druck und Übersicht', () => {
    progress = emptyProgress();
    const auswahl = render('/klausur');
    expect(auswahl).toContain('Gemischte Probeklausur');
    expect(auswahl).toContain('Prozessanalyse');

    const start = render(`/klausur/${id}`);
    expect(start).toContain('Gemischte Probeklausur');
    expect(start).toContain('Nr. 42');
    expect(start).toContain('Neu mischen');
    expect(start).toContain(`/druck?art=aufgaben&amp;thema=${id}`);
    expect(start).not.toContain('Fallen-Karten');

    progress = { ...emptyProgress(), activeExam: { ...run, submittedAt: undefined } };
    const laufend = render(`/klausur/${id}`);
    expect(laufend.match(/>Wie sicher bist du\?</g)).toHaveLength(tasks.length);
    expect(laufend).toContain('class="exam-quelle"');
    expect(render('/klausur')).toContain('Laufende Klausur: <b>Gemischt (gemischt)</b>');

    expect(render(`/druck?art=aufgaben&thema=${id}`)).toContain('Aufgabenblatt: Gemischte Probeklausur');

    progress = p;
    expect(render('/')).toContain('Gemischt (gemischt)');
  });
});
