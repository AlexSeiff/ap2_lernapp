// Klausur-Builder: ID hin und zurück, Aufbau der eigenen Klausur, Suche, Auffüllen aus Themen, Hinweis auf fehlende Bezüge,
// Anschluss an Klausurseite, Historie und Druck, und die Seite selbst.

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { emptyProgress } from '../domain/progress';
import { ConfirmContext } from '../src/hooks/useConfirm';
import {
  baueEigeneKlausur,
  EIGENE_MAX,
  eigeneId,
  eigeneMinuten,
  fehlendeBezuege,
  fuelleAuf,
  parseEigeneId,
  sucheAufgaben,
  waehlbareAufgaben,
} from '../src/lib/eigeneKlausur';
import { examMinutes } from '../src/lib/examTimer';
import { istZusammengestellt, klausurFuer, klausurName } from '../src/lib/mischKlausur';
import { examSheet } from '../src/lib/sheets';

const content = loadContent(CONTENT_DIR);

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, firstVisit: false }),
}));
const { KlausurBuilder } = await import('../src/pages/klausur/KlausurBuilder');

/** Erste Übungsklausur mit mindestens zwei Blöcken – unabhängig davon, welche Deep Dives es gibt. */
const topic = content.topics.find((t) => (t.exam?.blocks.length ?? 0) >= 2 && t.exam!.blocks[0].taskIds.length >= 2)!;
const [blockA, blockB] = topic.exam!.blocks;

describe('ID', () => {
  it('eigeneId und parseEigeneId passen zusammen; andere IDs sind keine eigene Klausur', () => {
    expect(parseEigeneId(eigeneId(['03-A1', '34-C3']))).toEqual(['03-A1', '34-C3']);
    expect(parseEigeneId('03')).toBeUndefined();
    expect(parseEigeneId('mix-gemischt-3')).toBeUndefined();
    expect(parseEigeneId('bau-03-A1.<script>')).toBeUndefined();
    expect(parseEigeneId(eigeneId(Array.from({ length: EIGENE_MAX + 1 }, (_, i) => `x-${i}`)))).toBeUndefined();
    expect(istZusammengestellt('bau-03-A1')).toBe(true);
    expect(istZusammengestellt('mix-prozess-1')).toBe(true);
    expect(istZusammengestellt('03')).toBe(false);
  });
});

describe('Aufbau', () => {
  it('gruppiert nach Herkunftsblock in Original-Reihenfolge, mit Einleitung und Anlagen', () => {
    // Absichtlich vertauscht und aus zwei Blöcken gemischt.
    const ids = [blockA.taskIds[1], blockB.taskIds[0], blockA.taskIds[0]];
    const k = baueEigeneKlausur(content, ids)!;
    expect(k.blocks).toHaveLength(2);
    expect(k.blocks[0].taskIds).toEqual([blockA.taskIds[0], blockA.taskIds[1]]);
    expect(k.blocks[1].taskIds).toEqual([blockB.taskIds[0]]);
    expect(k.blocks[0].gruppen[0].intro).toBe(blockA.intro);
    expect(k.blocks[0].title).toBe(blockA.title);
    const punkte = ids.reduce((s, id) => s + content.tasks[id].points, 0);
    expect(k.totalPoints).toBe(punkte);
    expect(examMinutes(k)).toBe(eigeneMinuten(punkte));
    expect(k.attachments.length).toBeGreaterThanOrEqual(topic.exam!.attachments.length);
  });

  it('Unbekanntes wird übergangen, ohne gültige Aufgabe gibt es keine Klausur', () => {
    expect(baueEigeneKlausur(content, ['gibt-es-nicht'])).toBeUndefined();
    expect(baueEigeneKlausur(content, ['gibt-es-nicht', blockA.taskIds[0]])!.blocks).toHaveLength(1);
  });

  it('Bearbeitungszeit: 90 Minuten je 100 Punkte, auf 5 gerundet, mindestens 10', () => {
    expect(eigeneMinuten(100)).toBe(90);
    expect(eigeneMinuten(50)).toBe(45);
    expect(eigeneMinuten(4)).toBe(10);
  });
});

describe('Auswahl', () => {
  it('Suche: alle Wörter, ohne Groß/klein und Umlautpunkte; Thema grenzt ein', () => {
    const t = content.tasks[blockA.taskIds[0]];
    const wort = t.markdown
      .replace(/[^A-Za-zÄÖÜäöüß ]/g, ' ')
      .split(/\s+/)
      .find((w) => w.length > 6)!;
    const treffer = sucheAufgaben(content, wort.toUpperCase(), topic.id);
    expect(treffer.map((x) => x.id)).toContain(t.id);
    expect(treffer.every((x) => x.topicId === topic.id)).toBe(true);
    expect(sucheAufgaben(content, `${wort} xyzzyunbekannt`)).toEqual([]);
    expect(sucheAufgaben(content, '').length).toBe(waehlbareAufgaben(content).length);
  });

  it('Auffüllen: nie über das Ziel, nur Anfänge bzw. Fortsetzungen, nichts doppelt, reproduzierbar', () => {
    const themen = content.topics
      .filter((t) => t.exam?.blocks.length)
      .map((t) => t.id)
      .slice(0, 4);
    const start = [blockA.taskIds[0]];
    const a = fuelleAuf(content, themen, start, 100, 7);
    expect(a.slice(0, 1)).toEqual(start);
    expect(new Set(a).size).toBe(a.length);
    expect(a.reduce((s, id) => s + content.tasks[id].points, 0)).toBeLessThanOrEqual(100);
    expect(fuelleAuf(content, themen, start, 100, 7)).toEqual(a);
    // Je Herkunftsblock lückenlos ab der ersten Aufgabe.
    for (const t of content.topics.filter((x) => themen.includes(x.id)))
      for (const b of t.exam!.blocks) {
        const drin = b.taskIds.map((id) => a.includes(id));
        const erstes = drin.indexOf(true);
        if (erstes < 0) continue;
        expect(erstes, `${b.taskIds[0]}`).toBe(0);
        expect(drin.slice(0, drin.lastIndexOf(true) + 1).every(Boolean), b.taskIds.join()).toBe(true);
      }
  });

  it('Hinweis, wenn eine Aufgabe auf eine nicht gewählte Aufgabe ihres Blocks verweist', () => {
    const mitBezug = waehlbareAufgaben(content).find((t) => fehlendeBezuege(content, t, new Set()).length > 0)!;
    expect(mitBezug).toBeDefined();
    const fehlt = fehlendeBezuege(content, mitBezug, new Set());
    const ids = new Set(
      fehlt.map((code) =>
        content.topics
          .find((x) => x.id === mitBezug.topicId)!
          .exam!.blocks.flatMap((b) => b.taskIds)
          .find((id) => content.tasks[id].code === code)!,
      ),
    );
    expect(fehlendeBezuege(content, mitBezug, ids)).toEqual([]);
  });
});

describe('Anschluss', () => {
  it('Klausurseite, Historie und Druck bauen die eigene Klausur aus der ID', () => {
    const id = eigeneId([blockA.taskIds[0], blockB.taskIds[0]]);
    const q = klausurFuer(content, id)!;
    expect(q.topic).toBeUndefined();
    expect(q.misch && 'eigene' in q.misch).toBe(true);
    expect(q.exam.blocks).toHaveLength(2);
    expect(klausurName(content, id)).toBe('Eigene Klausur');
    const blatt = examSheet(content, id, 'aufgaben')!;
    expect(blatt.fileBase).toMatch(/^Aufgabenblatt_Eigene_Klausur_/);
    expect(blatt.groups.flatMap((g) => g.tasks.map((t) => t.id))).toEqual([blockA.taskIds[0], blockB.taskIds[0]]);
  });
});

describe('Seite', () => {
  const seite = (pfad: string) =>
    renderToString(
      createElement(
        ConfirmContext.Provider,
        { value: async () => true },
        createElement(
          MemoryRouter,
          { initialEntries: [pfad] },
          createElement(Routes, null, createElement(Route, { path: '/klausur/bauen', element: createElement(KlausurBuilder) })),
        ),
      ),
    ).replace(/<!-- -->/g, '');

  it('leer: Suche, Themen und leere Klausur', () => {
    const html = seite('/klausur/bauen');
    expect(html).toContain('Aufgaben suchen');
    expect(html).toContain('Aus Themen auffüllen');
    expect(html).toContain('Noch leer');
  });

  it('?aufgaben= lädt eine Klausur zum Bearbeiten', () => {
    const html = seite(`/klausur/bauen?aufgaben=${blockA.taskIds[0]}.${blockA.taskIds[1]}`);
    const punkte = content.tasks[blockA.taskIds[0]].points + content.tasks[blockA.taskIds[1]].points;
    expect(html).toContain(`${punkte} P`);
    expect(html).toContain('2 Aufgaben');
  });
});
