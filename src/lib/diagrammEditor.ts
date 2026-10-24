// Freier Diagramm-Editor für Modellierungsaufgaben (ERM, EPK, BPMN, Use-Case): Modell, Notationen (Palette, Standardgrößen,
// Kantenarten), Geometrie und Formprüfung. Anders als die Diagramm-Übungen gibt es kein Gerüst – man zeichnet alles selbst und
// vergleicht danach mit der Musterlösung. Die Formprüfung sind Hinweise zur Selbstbewertung, keine Punkte. Rein, ohne React.

import { formregeln, type DiagrammUebung, type Form } from '../../shared/diagrammUebungen';

export const DIAGRAMM_NOTATIONEN = ['erm', 'epk', 'bpmn', 'usecase'] as const;
export type DiagrammNotation = (typeof DIAGRAMM_NOTATIONEN)[number];

export const EDITOR_KANTEN = ['fluss', 'nachricht', 'zuordnung', 'linie', 'include', 'extend'] as const;
export type EditorKantenArt = (typeof EDITOR_KANTEN)[number];

export interface EditorKnoten {
  id: string;
  form: Form;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  /** ERM-Attribut: Teil des Primärschlüssels (unterstrichen). */
  schluessel?: boolean;
}

export interface EditorKante {
  id: string;
  von: string;
  nach: string;
  art: EditorKantenArt;
  /** Beschriftung, im ERM die Kardinalität (steht an der Entität). */
  text?: string;
}

export interface DiagrammAntwort {
  editor: DiagrammNotation;
  knoten: EditorKnoten[];
  kanten: EditorKante[];
  /** Anmerkungen, Annahmen (frei). */
  notiz?: string;
}

export interface NotationsInfo {
  name: string;
  /** Formen der Leiste mit Standardgröße. */
  formen: { form: Form; w: number; h: number; text: string }[];
  kanten: EditorKantenArt[];
  /** Kurze Bedienhilfe unter der Leiste. */
  tipp: string;
}

export const NOTATIONEN: Record<DiagrammNotation, NotationsInfo> = {
  erm: {
    name: 'ER-Diagramm',
    formen: [
      { form: 'entitaet', w: 140, h: 56, text: 'ENTITÄT' },
      { form: 'beziehung', w: 130, h: 70, text: 'beziehung' },
      { form: 'attribut', w: 120, h: 42, text: 'attribut' },
      { form: 'text', w: 140, h: 30, text: 'Notiz' },
    ],
    kanten: ['linie'],
    tipp: 'Kardinalitäten trägst du an der Verbindung zwischen Beziehung und Entität ein – sie steht dann an der Entität.',
  },
  epk: {
    name: 'EPK / eEPK',
    formen: [
      { form: 'ereignis', w: 160, h: 56, text: 'Ereignis ist eingetreten' },
      { form: 'funktion', w: 160, h: 56, text: 'Funktion ausführen' },
      { form: 'xor', w: 40, h: 40, text: '' },
      { form: 'and', w: 40, h: 40, text: '' },
      { form: 'or', w: 40, h: 40, text: '' },
      { form: 'org', w: 150, h: 50, text: 'Organisationseinheit' },
      { form: 'info', w: 150, h: 50, text: 'Informationsobjekt' },
    ],
    kanten: ['fluss', 'zuordnung'],
    tipp: 'Ereignis und Funktion wechseln sich ab; Verzweigungen laufen über Konnektoren. Org-Einheiten und Informationsobjekte hängst du per Zuordnung an Funktionen.',
  },
  bpmn: {
    name: 'BPMN 2.0',
    formen: [
      { form: 'pool', w: 760, h: 240, text: 'Pool' },
      { form: 'lane', w: 734, h: 120, text: 'Lane' },
      { form: 'start', w: 36, h: 36, text: '' },
      { form: 'zwischen', w: 36, h: 36, text: '' },
      { form: 'ende', w: 36, h: 36, text: '' },
      { form: 'task', w: 130, h: 60, text: 'Task' },
      { form: 'gw-xor', w: 50, h: 50, text: '' },
      { form: 'gw-and', w: 50, h: 50, text: '' },
      { form: 'gw-or', w: 50, h: 50, text: '' },
      { form: 'info', w: 110, h: 46, text: 'Datenobjekt' },
      { form: 'text', w: 140, h: 30, text: 'Notiz' },
    ],
    kanten: ['fluss', 'nachricht', 'zuordnung'],
    tipp: 'Lanes legst du in den Pool. Zwischen zwei Pools wird eine Verbindung automatisch zum gestrichelten Nachrichtenfluss.',
  },
  usecase: {
    name: 'Anwendungsfalldiagramm',
    formen: [
      { form: 'systemgrenze', w: 460, h: 320, text: 'System' },
      { form: 'akteur', w: 50, h: 76, text: 'Akteur' },
      { form: 'anwendungsfall', w: 170, h: 56, text: 'Anwendungsfall' },
      { form: 'text', w: 140, h: 30, text: 'Notiz' },
    ],
    kanten: ['linie', 'include', 'extend'],
    tipp: 'Akteure stehen außerhalb der Systemgrenze. «include» zeigt vom Basisfall auf den eingebundenen Fall, «extend» von der Erweiterung auf den Basisfall.',
  },
};

export const KANTEN_NAMEN: Record<EditorKantenArt, string> = {
  fluss: 'Kontroll-/Sequenzfluss',
  nachricht: 'Nachrichtenfluss',
  zuordnung: 'Zuordnung',
  linie: 'Linie',
  include: '«include»',
  extend: '«extend»',
};

/** Behälter liegen hinter den anderen Formen; zieht man sie, wandert ihr Inhalt mit. */
export const BEHAELTER: readonly Form[] = ['pool', 'lane', 'systemgrenze'];
export const istBehaelter = (f: Form) => BEHAELTER.includes(f);

/** Formen, die keinen Text brauchen (Konnektoren, Gateways, Ereignisse in BPMN dürfen ohne Namen sein). */
const OHNE_TEXT: readonly Form[] = ['xor', 'and', 'or', 'gw-and', 'gw-or', 'gw-xor', 'start', 'zwischen', 'ende'];

export function leereDiagrammAntwort(editor: DiagrammNotation): DiagrammAntwort {
  return { editor, knoten: [], kanten: [] };
}

export const istLeer = (a: DiagrammAntwort) => !a.knoten.length && !a.notiz?.trim();

/** Nächste freie ID mit Präfix (k1, k2 … bzw. v1, v2 …). */
export function neueId(prefix: string, vorhanden: { id: string }[]): string {
  let max = 0;
  for (const { id } of vorhanden) {
    const m = id.startsWith(prefix) ? Number(id.slice(prefix.length)) : NaN;
    if (Number.isFinite(m)) max = Math.max(max, m);
  }
  return `${prefix}${max + 1}`;
}

export const RASTER = 10;
export const einrasten = (v: number) => Math.round(v / RASTER) * RASTER;

// ---------- Geometrie ----------

export type Punkt = [number, number];
type Box = Pick<EditorKnoten, 'x' | 'y' | 'w' | 'h' | 'form'>;
export const mitte = (k: Box): Punkt => [k.x + k.w / 2, k.y + k.h / 2];
const enthaelt = (aussen: Box, p: Punkt) =>
  p[0] >= aussen.x && p[0] <= aussen.x + aussen.w && p[1] >= aussen.y && p[1] <= aussen.y + aussen.h;

const RUND: readonly Form[] = ['attribut', 'anwendungsfall', 'org', 'xor', 'and', 'or', 'start', 'zwischen', 'ende'];
const RAUTE: readonly Form[] = ['beziehung', 'gw-xor', 'gw-and', 'gw-or'];

/** Punkt auf dem Rand der Form in Richtung p (von der Mitte aus) – Rechteck, Ellipse oder Raute. */
export function randPunkt(k: Box, p: Punkt): Punkt {
  const [cx, cy] = mitte(k);
  const dx = p[0] - cx;
  const dy = p[1] - cy;
  if (dx === 0 && dy === 0) return [cx, cy];
  const a = k.w / 2;
  const b = k.h / 2;
  let s: number;
  if (RUND.includes(k.form)) s = 1 / Math.sqrt((dx * dx) / (a * a) + (dy * dy) / (b * b));
  else if (RAUTE.includes(k.form)) s = 1 / (Math.abs(dx) / a + Math.abs(dy) / b);
  else s = Math.min(dx === 0 ? Infinity : a / Math.abs(dx), dy === 0 ? Infinity : b / Math.abs(dy));
  return [cx + dx * s, cy + dy * s];
}

/**
 * Anfangs- und Endpunkt jeder Kante. Mehrere Kanten zwischen denselben Knoten (rekursive Beziehung im ERM) werden
 * nebeneinander versetzt, damit beide sichtbar und anklickbar bleiben.
 */
export function kantenLinien(knoten: EditorKnoten[], kanten: EditorKante[]): Map<string, [Punkt, Punkt]> {
  const nachId = new Map(knoten.map((k) => [k.id, k]));
  const paare = new Map<string, EditorKante[]>();
  for (const e of kanten) {
    const schluessel = [e.von, e.nach].sort().join('|');
    paare.set(schluessel, [...(paare.get(schluessel) ?? []), e]);
  }
  const linien = new Map<string, [Punkt, Punkt]>();
  for (const gruppe of paare.values()) {
    gruppe.forEach((e, i) => {
      const a = nachId.get(e.von);
      const b = nachId.get(e.nach);
      if (!a || !b) return;
      const [ax, ay] = mitte(a);
      const [bx, by] = mitte(b);
      const laenge = Math.hypot(bx - ax, by - ay) || 1;
      // Senkrecht zur Verbindung versetzen (bezogen auf eine feste Richtung, damit Hin- und Rückkante nicht zusammenfallen).
      const richtung = e.von < e.nach ? 1 : -1;
      const versatz = (i - (gruppe.length - 1) / 2) * 18 * richtung;
      const nx = (-(by - ay) / laenge) * versatz;
      const ny = ((bx - ax) / laenge) * versatz;
      const zielA: Punkt = [bx + nx, by + ny];
      const zielB: Punkt = [ax + nx, ay + ny];
      const pa = randPunkt({ ...a, x: a.x + nx, y: a.y + ny }, zielA);
      const pb = randPunkt({ ...b, x: b.x + nx, y: b.y + ny }, zielB);
      linien.set(e.id, [pa, pb]);
    });
  }
  return linien;
}

/** Ort der Beschriftung: mittig, im ERM nahe an der Entität (dort steht die Kardinalität). */
export function beschriftungsPunkt(linie: [Punkt, Punkt], nahAnfang?: boolean, nahEnde?: boolean): Punkt {
  const [[x1, y1], [x2, y2]] = linie;
  const laenge = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / laenge;
  const uy = (y2 - y1) / laenge;
  // Seitlich versetzt, damit der Text nicht auf der Linie liegt.
  const seitlich: Punkt = [-uy * 12, ux * 12];
  const abstand = Math.min(28, laenge / 3);
  if (nahAnfang && !nahEnde) return [x1 + ux * abstand + seitlich[0], y1 + uy * abstand + seitlich[1]];
  if (nahEnde && !nahAnfang) return [x2 - ux * abstand + seitlich[0], y2 - uy * abstand + seitlich[1]];
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}

/** Umgebendes Rechteck aller Knoten (für die Ansicht nach der Abgabe). */
export function umriss(knoten: EditorKnoten[]): { x: number; y: number; w: number; h: number } {
  if (!knoten.length) return { x: 0, y: 0, w: 300, h: 120 };
  // Beschriftungen unter BPMN-Ereignissen und Akteuren ragen über das Rechteck hinaus.
  const x1 = Math.min(...knoten.map((k) => k.x));
  const y1 = Math.min(...knoten.map((k) => k.y));
  const x2 = Math.max(...knoten.map((k) => k.x + k.w));
  const y2 = Math.max(...knoten.map((k) => k.y + k.h + (['start', 'zwischen', 'ende'].includes(k.form) ? 34 : 0)));
  return { x: x1 - 30, y: y1 - 30, w: x2 - x1 + 60, h: y2 - y1 + 60 };
}

/** Kleinster Behälter einer Form (Pool/Lane/Systemgrenze), in dem ihre Mitte liegt. */
export function behaelterVon(k: EditorKnoten, knoten: EditorKnoten[], form?: Form): EditorKnoten | undefined {
  const m = mitte(k);
  return knoten
    .filter((b) => b.id !== k.id && istBehaelter(b.form) && (!form || b.form === form) && b.w * b.h > k.w * k.h && enthaelt(b, m))
    .sort((a, b) => a.w * a.h - b.w * b.h)[0];
}

/** Knoten, die beim Verschieben eines Behälters mitwandern (Mitte im Behälter, kleiner als er). */
export function inhaltVon(behaelter: EditorKnoten, knoten: EditorKnoten[]): string[] {
  return knoten
    .filter((k) => k.id !== behaelter.id && k.w * k.h < behaelter.w * behaelter.h && enthaelt(behaelter, mitte(k)))
    .map((k) => k.id);
}

/** Pool einer Form (Lanes zählen zu ihrem Pool). */
const poolVon = (k: EditorKnoten, knoten: EditorKnoten[]) => behaelterVon(k, knoten, 'pool');

/** Sinnvolle Kantenart für eine neue Verbindung. */
export function standardKante(a: DiagrammAntwort, von: EditorKnoten, nach: EditorKnoten): EditorKantenArt {
  const beide = [von.form, nach.form];
  switch (a.editor) {
    case 'erm':
      return 'linie';
    case 'epk':
      return beide.some((f) => f === 'org' || f === 'info') ? 'zuordnung' : 'fluss';
    case 'bpmn': {
      if (beide.some((f) => f === 'info' || f === 'text')) return 'zuordnung';
      const pa = poolVon(von, a.knoten);
      const pb = poolVon(nach, a.knoten);
      return pa && pb && pa.id !== pb.id ? 'nachricht' : 'fluss';
    }
    case 'usecase':
      return von.form === 'anwendungsfall' && nach.form === 'anwendungsfall' ? 'include' : 'linie';
  }
}

// ---------- Text (KI-Bewertung, Vorlesen) ----------

const FORM_KURZ: Partial<Record<Form, string>> = {
  entitaet: 'Entität',
  beziehung: 'Beziehung',
  attribut: 'Attribut',
  ereignis: 'Ereignis',
  funktion: 'Funktion',
  xor: 'XOR-Konnektor',
  and: 'AND-Konnektor',
  or: 'OR-Konnektor',
  org: 'Organisationseinheit',
  info: 'Informationsobjekt',
  pool: 'Pool',
  lane: 'Lane',
  start: 'Startereignis',
  zwischen: 'Zwischenereignis',
  ende: 'Endereignis',
  task: 'Task',
  'gw-xor': 'XOR-Gateway',
  'gw-and': 'AND-Gateway',
  'gw-or': 'OR-Gateway',
  systemgrenze: 'Systemgrenze',
  akteur: 'Akteur',
  anwendungsfall: 'Anwendungsfall',
  text: 'Notiz',
};
export const formKurz = (f: Form) => FORM_KURZ[f] ?? f;

/** Bezeichnung eines Knotens im Text: „Entität „KUNDE““ bzw. „XOR-Konnektor 2“, wenn er keinen Text hat. */
export function knotenName(k: EditorKnoten, knoten: EditorKnoten[]): string {
  if (k.text.trim()) return `${formKurz(k.form)} „${k.text.trim()}“${k.schluessel ? ' (Schlüssel)' : ''}`;
  const gleiche = knoten.filter((x) => x.form === k.form);
  return gleiche.length > 1 ? `${formKurz(k.form)} ${gleiche.indexOf(k) + 1}` : formKurz(k.form);
}

/** Das Diagramm als Text: Elemente (mit Pool/Lane bzw. Systemgrenze) und Verbindungen. */
export function diagrammAlsText(a: DiagrammAntwort): string {
  const name = (id: string) => {
    const k = a.knoten.find((x) => x.id === id);
    return k ? knotenName(k, a.knoten) : '?';
  };
  const zeilen = [`${NOTATIONEN[a.editor].name} (im Editor gezeichnet)`, '', 'Elemente:'];
  for (const k of a.knoten) {
    const lage = istBehaelter(k.form) ? undefined : behaelterVon(k, a.knoten);
    zeilen.push(`- ${knotenName(k, a.knoten)}${lage ? ` – in ${knotenName(lage, a.knoten)}` : ''}`);
  }
  if (a.kanten.length) {
    zeilen.push('', 'Verbindungen:');
    for (const e of a.kanten) {
      const pfeil = e.art === 'linie' || e.art === 'zuordnung' ? '—' : '→';
      const art = e.art === 'linie' || e.art === 'fluss' ? '' : ` [${KANTEN_NAMEN[e.art]}]`;
      zeilen.push(`- ${name(e.von)} ${pfeil} ${name(e.nach)}${art}${e.text?.trim() ? ` (${e.text.trim()})` : ''}`);
    }
  }
  if (a.notiz?.trim()) zeilen.push('', 'Anmerkungen:', a.notiz.trim());
  return zeilen.join('\n');
}

// ---------- Formprüfung ----------

/** Für formregeln (Diagramm-Übungen): dieselben Regeln für EPK und BPMN, ohne Lücken. */
function alsUebung(a: DiagrammAntwort): DiagrammUebung {
  return {
    id: 'editor',
    typ: a.editor === 'erm' ? 'er' : a.editor,
    stufe: 1,
    titel: '',
    szenario: '',
    breite: 0,
    hoehe: 0,
    knoten: a.knoten.map((k) => ({ id: k.id, form: k.form, x: k.x, y: k.y, w: k.w, h: k.h, text: k.text })),
    kanten: a.kanten.filter((e) => e.art === 'fluss').map((e) => ({ von: e.von, nach: e.nach, art: 'fluss' as const })),
    palette: [],
    loesung: {},
    varianten: [],
    hinweise: [],
    tags: [],
  };
}

/**
 * Hinweise zur Form des gezeichneten Diagramms (keine Bewertung des Inhalts – den vergleichst du mit der Musterlösung):
 * fehlende Beschriftungen und Verbindungen, die Regeln der jeweiligen Notation.
 */
export function pruefeDiagrammAntwort(a: DiagrammAntwort): string[] {
  const meldungen: string[] = [];
  if (!a.knoten.length) return meldungen;
  const nachId = new Map(a.knoten.map((k) => [k.id, k]));
  const name = (k: EditorKnoten) => knotenName(k, a.knoten);
  const kantenVon = (id: string) => a.kanten.filter((e) => e.von === id || e.nach === id);
  const andere = (e: EditorKante, id: string) => nachId.get(e.von === id ? e.nach : e.von)!;

  const ohneText = a.knoten.filter((k) => !k.text.trim() && !OHNE_TEXT.includes(k.form) && k.form !== 'text');
  if (ohneText.length) meldungen.push(`Ohne Beschriftung: ${ohneText.map(name).join(', ')}.`);
  const lose = a.knoten.filter((k) => !istBehaelter(k.form) && k.form !== 'text' && !kantenVon(k.id).length);
  if (lose.length && a.knoten.length > 1) meldungen.push(`Ohne Verbindung: ${lose.map(name).join(', ')}.`);

  if (a.editor === 'epk' || a.editor === 'bpmn') meldungen.push(...formregeln(alsUebung(a), {}));

  if (a.editor === 'epk') {
    for (const k of a.knoten) {
      const fluss = a.kanten.filter((e) => e.art === 'fluss');
      if (k.form === 'ereignis' || k.form === 'funktion') {
        const raus = fluss.filter((e) => e.von === k.id).length;
        const rein = fluss.filter((e) => e.nach === k.id).length;
        if (raus > 1 || rein > 1)
          meldungen.push(`${name(k)} hat mehrere ${raus > 1 ? 'aus' : 'ein'}gehende Pfeile – Verzweigungen laufen über einen Konnektor.`);
      }
      if (k.form === 'org' || k.form === 'info') {
        for (const e of kantenVon(k.id)) {
          if (e.art === 'fluss') meldungen.push(`${name(k)} gehört nicht in den Kontrollfluss – hänge es per Zuordnung an eine Funktion.`);
          else if (andere(e, k.id).form !== 'funktion')
            meldungen.push(`${name(k)} wird einer Funktion zugeordnet, nicht einem Ereignis oder Konnektor.`);
        }
      }
    }
  }

  if (a.editor === 'bpmn') {
    const pools = a.knoten.filter((k) => k.form === 'pool');
    for (const e of a.kanten) {
      const von = nachId.get(e.von)!;
      const nach = nachId.get(e.nach)!;
      const pa = poolVon(von, a.knoten);
      const pb = poolVon(nach, a.knoten);
      if (e.art === 'fluss' && pa && pb && pa.id !== pb.id)
        meldungen.push('Zwischen zwei Pools gibt es nur Nachrichtenflüsse (gestrichelt), keinen Sequenzfluss.');
      if (e.art === 'nachricht' && pa && pb && pa.id === pb.id)
        meldungen.push('Innerhalb eines Pools verbindet der Sequenzfluss – Nachrichtenflüsse laufen nur zwischen Pools.');
      if (e.art === 'fluss' && von.form === 'ende') meldungen.push('Ein Endereignis hat keinen ausgehenden Sequenzfluss.');
      if (e.art === 'fluss' && nach.form === 'start') meldungen.push('Ein Startereignis hat keinen eingehenden Sequenzfluss.');
    }
    const ablauf = a.knoten.filter((k) => !istBehaelter(k.form) && k.form !== 'text' && k.form !== 'info');
    if (ablauf.length && !a.knoten.some((k) => k.form === 'start')) meldungen.push('Es fehlt ein Startereignis.');
    if (ablauf.length && !a.knoten.some((k) => k.form === 'ende')) meldungen.push('Es fehlt ein Endereignis.');
    if (pools.length) {
      const draussen = ablauf.filter((k) => !poolVon(k, a.knoten));
      if (draussen.length) meldungen.push(`Außerhalb jedes Pools: ${draussen.map(name).join(', ')}.`);
    }
    for (const gw of a.knoten.filter((k) => k.form === 'gw-xor')) {
      const raus = a.kanten.filter((e) => e.art === 'fluss' && e.von === gw.id);
      if (raus.length > 1 && raus.some((e) => !e.text?.trim()))
        meldungen.push('Beschrifte die ausgehenden Pfade eines XOR-Gateways mit ihrer Bedingung.');
    }
  }

  if (a.editor === 'erm') {
    for (const e of a.kanten) {
      const formen = [nachId.get(e.von)!.form, nachId.get(e.nach)!.form];
      if (formen[0] === 'entitaet' && formen[1] === 'entitaet')
        meldungen.push('Entitäten verbindest du über eine Beziehung (Raute), nicht direkt.');
      if (formen.includes('entitaet') && formen.includes('beziehung') && !e.text?.trim())
        meldungen.push('An jeder Verbindung zwischen Beziehung und Entität steht eine Kardinalität.');
    }
    for (const b of a.knoten.filter((k) => k.form === 'beziehung')) {
      const zuEntitaeten = kantenVon(b.id).filter((e) => andere(e, b.id).form === 'entitaet').length;
      if (zuEntitaeten < 2) meldungen.push(`${name(b)} verbindet weniger als zwei Entitäten (rekursiv: zwei Linien zur selben Entität).`);
    }
    for (const at of a.knoten.filter((k) => k.form === 'attribut')) {
      const an = kantenVon(at.id).filter((e) => ['entitaet', 'beziehung'].includes(andere(e, at.id).form));
      if (an.length > 1)
        meldungen.push(`${name(at)} hängt an mehreren Elementen – ein Attribut gehört zu genau einer Entität oder Beziehung.`);
    }
    for (const en of a.knoten.filter((k) => k.form === 'entitaet')) {
      const attribute = kantenVon(en.id)
        .map((e) => andere(e, en.id))
        .filter((k) => k.form === 'attribut');
      if (attribute.length && !attribute.some((k) => k.schluessel)) meldungen.push(`${name(en)} hat Attribute, aber keinen Schlüssel.`);
    }
  }

  if (a.editor === 'usecase') {
    const grenzen = a.knoten.filter((k) => k.form === 'systemgrenze');
    for (const k of a.knoten) {
      const drin = behaelterVon(k, a.knoten, 'systemgrenze');
      if (k.form === 'akteur' && drin) meldungen.push(`${name(k)} steht innerhalb der Systemgrenze – Akteure stehen außerhalb.`);
      if (k.form === 'anwendungsfall' && grenzen.length && !drin) meldungen.push(`${name(k)} liegt außerhalb der Systemgrenze.`);
    }
    for (const e of a.kanten) {
      const formen = [nachId.get(e.von)!.form, nachId.get(e.nach)!.form];
      if ((e.art === 'include' || e.art === 'extend') && formen.some((f) => f !== 'anwendungsfall'))
        meldungen.push(`${KANTEN_NAMEN[e.art]} verbindet zwei Anwendungsfälle, keinen Akteur.`);
      if (e.art === 'linie' && formen.every((f) => f === 'anwendungsfall'))
        meldungen.push('Zwei Anwendungsfälle verbindest du mit «include» oder «extend», nicht mit einer einfachen Linie.');
      if (e.art === 'linie' && formen.every((f) => f === 'akteur'))
        meldungen.push('Akteure sind über Anwendungsfälle verbunden, nicht direkt.');
    }
  }
  return [...new Set(meldungen)];
}
