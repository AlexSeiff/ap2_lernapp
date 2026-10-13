import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultSettings, emptyProgress, migrateSettings, ProgressSchema, type Progress } from '../shared/progress';
import { CONTENT_DIR, ladeInhalt } from '../server/loadContent';
import { planeHeute } from '../src/lib/heute';
import { istAusgeblendet, setzeAusgeblendet } from '../src/lib/settings';

// Lernblätter ausblenden (Einstellungen → ausgeblendeteThemen): Format, Helfer, Themenliste, Lernblatt, Übersicht, „Heute lernen“.

const { content } = ladeInhalt(CONTENT_DIR);
const [erstes, zweites] = content.topics.filter((t) => t.exam?.blocks.length);
let progress: Progress = emptyProgress();

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress, update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { Themen, Thema } = await import('../src/pages/Themen');
const { Dashboard } = await import('../src/pages/Dashboard');

const ohneKommentare = (html: string) => html.replace(/<!-- -->/g, '');
function render(path: string): string {
  const routes = createElement(
    Routes,
    null,
    createElement(Route, { path: '/lernen', element: createElement(Themen) }),
    createElement(Route, { path: '/lernen/:topicId', element: createElement(Thema) }),
    createElement(Route, { path: '/', element: createElement(Dashboard) }),
  );
  return ohneKommentare(renderToString(createElement(MemoryRouter, { initialEntries: [path] }, routes)));
}

/** Ein Versuch mit 0 Punkten macht das Thema zum schwächsten (Übersicht und „Heute lernen“). */
function mitSchwachemThema(topicId: string, ausgeblendet: string[] = []): Progress {
  const t = Object.values(content.tasks).find((x) => x.topicId === topicId)!;
  const p = {
    ...emptyProgress(),
    attempts: [{ taskId: t.id, date: '2026-10-01T08:00:00.000Z', points: 0, max: t.points, mode: 'einzel' as const }],
  };
  return ausgeblendet.length ? { ...p, settings: { ...p.settings, ausgeblendeteThemen: ausgeblendet } } : p;
}

describe('Format', () => {
  it('migrateSettings behält nur eindeutige, nicht leere Ids; Ungültiges fällt weg', () => {
    expect(migrateSettings({ ausgeblendeteThemen: ['05', '05', '', 3, '12'] })).toEqual({
      ...defaultSettings(),
      ausgeblendeteThemen: ['05', '12'],
    });
    for (const bad of ['05', null, {}, [], [1]]) expect(migrateSettings({ ausgeblendeteThemen: bad })).toEqual(defaultSettings());
  });

  it('ProgressSchema: optional, nur Texte erlaubt – ältere Dateien ohne das Feld bleiben gültig', () => {
    expect(ProgressSchema.safeParse({ version: 8, attempts: [], settings: { ausgeblendeteThemen: ['05'] } }).success).toBe(true);
    expect(ProgressSchema.safeParse({ version: 8, attempts: [], settings: { ausgeblendeteThemen: [5] } }).success).toBe(false);
    expect(ProgressSchema.safeParse({ version: 8, attempts: [], settings: {} }).success).toBe(true);
  });
});

describe('setzeAusgeblendet / istAusgeblendet', () => {
  it('blendet aus, doppelt nichts und entfernt die leere Liste wieder', () => {
    const p1 = setzeAusgeblendet(emptyProgress(), '05', true);
    const p2 = setzeAusgeblendet(setzeAusgeblendet(p1, '12', true), '05', true);
    expect(p2.settings.ausgeblendeteThemen).toEqual(['12', '05']);
    expect(istAusgeblendet(p2.settings, '05')).toBe(true);
    expect(istAusgeblendet(p2.settings, '01')).toBe(false);
    const leer = setzeAusgeblendet(setzeAusgeblendet(p2, '05', false), '12', false);
    expect(leer.settings).toEqual(emptyProgress().settings);
    expect('ausgeblendeteThemen' in leer.settings).toBe(false);
  });
});

describe('Seiten', () => {
  beforeEach(() => {
    progress = emptyProgress();
  });

  it('Themenliste: ausgeblendete Blätter nur unter „Ausgeblendet (n)“ mit „Einblenden“', () => {
    expect(render('/lernen')).not.toContain('Ausgeblendet (');
    progress = setzeAusgeblendet(emptyProgress(), erstes.id, true);
    const html = render('/lernen');
    const [kacheln, ausgeblendet] = html.split('Ausgeblendet (1)');
    expect(kacheln).not.toContain(`href="/lernen/${erstes.id}"`);
    expect(kacheln).toContain(`href="/lernen/${zweites.id}"`);
    expect(ausgeblendet).toContain(`href="/lernen/${erstes.id}"`);
    expect(ausgeblendet).toContain('Einblenden');
  });

  it('Lernblatt: Knopf „Ausblenden“, ausgeblendet ein Hinweis mit „Wieder einblenden“', () => {
    const sichtbar = render(`/lernen/${erstes.id}`);
    expect(sichtbar).toContain('Ausblenden</button>');
    expect(sichtbar).not.toContain('Wieder einblenden');
    progress = setzeAusgeblendet(emptyProgress(), erstes.id, true);
    const aus = render(`/lernen/${erstes.id}`);
    expect(aus).not.toContain('Ausblenden</button>');
    expect(aus).toContain('Dieses Lernblatt ist ausgeblendet');
    expect(aus).toContain('Wieder einblenden');
  });

  it('Übersicht: „Schwächste Themen“ ohne ausgeblendete Blätter', () => {
    const schwaechste = () => render('/').split('Schwächste Themen')[1]?.split('</section>')[0] ?? '';
    progress = mitSchwachemThema(erstes.id);
    expect(schwaechste()).toContain(`href="/lernen/${erstes.id}"`);
    progress = mitSchwachemThema(erstes.id, [erstes.id]);
    expect(schwaechste()).not.toContain(`href="/lernen/${erstes.id}"`);
  });
});

describe('Heute lernen', () => {
  it('nimmt ein ausgeblendetes Blatt nicht als schwächstes Thema', () => {
    const today = '2026-10-02';
    expect(planeHeute(content, mitSchwachemThema(erstes.id), { today }).schwaechstesThema).toBe(erstes.id);
    const plan = planeHeute(content, mitSchwachemThema(erstes.id, [erstes.id]), { today });
    expect(plan.schwaechstesThema).not.toBe(erstes.id);
    expect(plan.items.some((it) => it.art === 'aufgabe' && it.thema === erstes.id)).toBe(false);
  });
});
