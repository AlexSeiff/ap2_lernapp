import { describe, expect, it } from 'vitest';
import { einrasten, type EditorKnoten } from '../src/lib/diagrammEditor';
import { neuerPlatz, type PlatzKontext } from '../src/lib/diagrammPlatz';

const knoten = (id: string, form: EditorKnoten['form'], x: number, y: number, w = 100, h = 50): EditorKnoten => ({
  id,
  form,
  x,
  y,
  w,
  h,
  text: id,
});
const kontext = (teil: Partial<PlatzKontext> = {}): PlatzKontext => ({
  knoten: [],
  gewaehlt: undefined,
  anhaengen: true,
  editor: 'erm',
  scrollLinks: null,
  zoom: 1,
  ...teil,
});

describe('neuerPlatz: wohin kommt ein neues Element im Diagramm-Editor?', () => {
  it('auf leerer Fläche oben links, am Raster eingerastet', () => {
    expect(neuerPlatz('funktion', 100, 50, kontext())).toEqual({ x: einrasten(40), y: einrasten(40) });
  });

  it('berücksichtigt den Bildlauf des Zeichenbereichs und den Zoom', () => {
    expect(neuerPlatz('funktion', 100, 50, kontext({ scrollLinks: 300, zoom: 0.5 }))).toEqual({
      x: einrasten(300 / 0.5 + 40),
      y: einrasten(40),
    });
  });

  it('weicht einem vorhandenen Element nach rechts aus', () => {
    const a = knoten('a', 'funktion', 40, 40);
    const platz = neuerPlatz('funktion', 100, 50, kontext({ knoten: [a] }));
    expect(platz.x).toBeGreaterThanOrEqual(a.x + a.w);
    expect(platz.y).toBe(einrasten(40));
  });

  it('hängt waagerecht rechts an das ausgewählte Element an (ERM)', () => {
    const a = knoten('a', 'funktion', 40, 40);
    const platz = neuerPlatz('funktion', 100, 50, kontext({ knoten: [a], gewaehlt: a }));
    expect(platz).toEqual({ x: einrasten(a.x + a.w + 50), y: einrasten(40 + 25 - 25) });
  });

  it('hängt in senkrechten Editoren (EPK) unter das ausgewählte Element an', () => {
    const a = knoten('a', 'funktion', 40, 40);
    const platz = neuerPlatz('funktion', 100, 50, kontext({ knoten: [a], gewaehlt: a, editor: 'epk' }));
    expect(platz).toEqual({ x: einrasten(40 + 50 - 50), y: einrasten(a.y + a.h + 40) });
  });

  it('setzt ohne „anhängen“ in den sichtbaren Bereich statt an die Auswahl', () => {
    const a = knoten('a', 'funktion', 400, 400);
    const platz = neuerPlatz('funktion', 100, 50, kontext({ knoten: [a], gewaehlt: a, anhaengen: false }));
    expect(platz).toEqual({ x: einrasten(40), y: einrasten(40) });
  });

  it('legt die erste Schwimmbahn oben links an, die nächste rechts daneben und gleich hoch', () => {
    expect(neuerPlatz('schwimmbahn', 200, 400, kontext())).toEqual({ x: 40, y: 40 });
    const bahn = knoten('b', 'schwimmbahn', 40, 40, 200, 400);
    expect(neuerPlatz('schwimmbahn', 200, 400, kontext({ knoten: [bahn] }))).toEqual({ x: 240, y: 40, h: 400 });
  });

  it('legt eine neue Lane unter die letzte Lane des gewählten Pools', () => {
    const pool = knoten('p', 'pool', 40, 40, 600, 300);
    const lane1 = knoten('l1', 'lane', 66, 40, 574, 100);
    const platz = neuerPlatz('lane', 574, 100, kontext({ knoten: [pool, lane1], gewaehlt: pool }));
    expect(platz).toEqual({ x: pool.x + 26, y: lane1.y + lane1.h, pool });
  });

  it('stellt Akteure links außerhalb der Systemgrenze auf', () => {
    const grenze = knoten('g', 'systemgrenze', 300, 40, 400, 400);
    const platz = neuerPlatz('akteur', 60, 80, kontext({ knoten: [grenze], editor: 'usecase' }));
    expect(platz.x).toBe(einrasten(Math.max(10, grenze.x - 60 - 60)));
    expect(platz.y).toBe(einrasten(grenze.y + 20));
  });
});
