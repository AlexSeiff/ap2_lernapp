// Zeichnet eine Diagramm-Übung (Umsetzungsplan Phase 7) als SVG mit den dg-*-Klassen der Diagramme aus Deep Dive 17 und legt über
// jeden Slot einen HTML-Knopf (Tippen, Tastatur, Screenreader, Ablegen beim Ziehen). Rein darstellend: was eingesetzt ist und
// was beim Antippen passiert, entscheidet die Seite.

import {
  type DiagrammKante,
  type DiagrammKnoten,
  type DiagrammUebung,
  type Eingesetzt,
  type Form,
  KANTEN_FORMEN,
  type KantenForm,
} from '../../domain/diagrammUebungen';
import { FormZeichnung, Text, umbrechen } from './diagramm/FormZeichnung';

const FORM_NAMEN: Record<Form | KantenForm, string> = {
  ereignis: 'Ereignis',
  funktion: 'Funktion',
  xor: 'XOR-Konnektor',
  and: 'AND-Konnektor',
  or: 'OR-Konnektor',
  org: 'Organisationseinheit',
  info: 'Informationsobjekt',
  start: 'Startereignis',
  zwischen: 'Zwischenereignis',
  ende: 'Endereignis',
  task: 'Task',
  'gw-xor': 'XOR-Gateway',
  'gw-and': 'AND-Gateway',
  'gw-or': 'OR-Gateway',
  pool: 'Pool',
  lane: 'Lane',
  aktion: 'Aktion',
  entscheidung: 'Entscheidung/Merge',
  gabel: 'Gabelung/Vereinigung',
  startpunkt: 'Startknoten',
  endpunkt: 'Endknoten',
  ablaufende: 'Ablaufende',
  aufruf: 'Aufrufaktion',
  schwimmbahn: 'Schwimmbahn',
  zustand: 'Zustand',
  lebenslinie: 'Lebenslinie',
  fragment: 'Kombiniertes Fragment',
  notiz: 'Notiz',
  entitaet: 'Entität',
  beziehung: 'Beziehung',
  attribut: 'Attribut',
  klasse: 'Klasse',
  akteur: 'Akteur',
  anwendungsfall: 'Anwendungsfall',
  systemgrenze: 'Systemgrenze',
  text: 'Beschriftung',
  sync: 'synchrone Nachricht',
  async: 'asynchrone Nachricht',
  antwort: 'Antwortnachricht',
  transition: 'Transition',
  beschriftung: 'Beschriftung',
};
export const formName = (f: Form | KantenForm) => FORM_NAMEN[f];

/** Sichtbares Kürzel der Nachrichtenart in der Elemente-Leiste – die Pfeilspitze allein ist dort klein. */
export const NACHRICHT_KURZ: Partial<Record<KantenForm, string>> = { sync: 'synchron', async: 'asynchron', antwort: 'Antwort' };
export const istKantenForm = (f: string): f is KantenForm => (KANTEN_FORMEN as readonly string[]).includes(f);

type Punkt = [number, number];
const mitte = (k: DiagrammKnoten): Punkt => [k.x + k.w / 2, k.y + k.h / 2];

/** Punkt auf dem Rand des Rechtecks von k in Richtung p (für Pfeilanfang und -ende). */
function rand(k: DiagrammKnoten, p: Punkt): Punkt {
  // Liegt der Nachbarpunkt genau über/unter bzw. neben dem Knoten, trifft die Kante senkrecht bzw. waagerecht auf (Balken, Knicke).
  if (p[0] >= k.x && p[0] <= k.x + k.w && (p[1] < k.y || p[1] > k.y + k.h)) return [p[0], p[1] < k.y ? k.y : k.y + k.h];
  if (p[1] >= k.y && p[1] <= k.y + k.h && (p[0] < k.x || p[0] > k.x + k.w)) return [p[0] < k.x ? k.x : k.x + k.w, p[1]];
  const [cx, cy] = mitte(k);
  const dx = p[0] - cx;
  const dy = p[1] - cy;
  if (dx === 0 && dy === 0) return [cx, cy];
  const sx = dx === 0 ? Infinity : k.w / 2 / Math.abs(dx);
  const sy = dy === 0 ? Infinity : k.h / 2 / Math.abs(dy);
  const s = Math.min(sx, sy);
  return [cx + dx * s, cy + dy * s];
}

/** Linienzug einer Kante (Sequenzdiagramm: waagerecht zwischen den Lebenslinien in Höhe y). */
export function kantenPunkte(k: DiagrammKante, knoten: Map<string, DiagrammKnoten>): Punkt[] {
  const a = knoten.get(k.von)!;
  const b = knoten.get(k.nach)!;
  if (k.y !== undefined)
    return [
      [mitte(a)[0], k.y],
      [mitte(b)[0], k.y],
    ];
  const zwischen = k.punkte ?? [];
  const erster = zwischen[0] ?? mitte(b);
  const letzter = zwischen[zwischen.length - 1] ?? mitte(a);
  return [rand(a, erster), ...zwischen, rand(b, letzter)];
}

/** Ort der Beschriftung bzw. des Kanten-Slots: Mitte des längsten Abschnitts. */
export function kantenMitte(punkte: Punkt[]): Punkt {
  let best = 0;
  let laenge = -1;
  for (let i = 0; i < punkte.length - 1; i++) {
    const l = Math.hypot(punkte[i + 1][0] - punkte[i][0], punkte[i + 1][1] - punkte[i][1]);
    if (l > laenge) {
      laenge = l;
      best = i;
    }
  }
  return [(punkte[best][0] + punkte[best + 1][0]) / 2, (punkte[best][1] + punkte[best + 1][1]) / 2];
}

/** Größe des Kanten-Slots. */
export const KANTEN_SLOT = { w: 170, h: 30 };

/** Formen, die hinter Kanten und anderen Knoten liegen. */
const HINTERGRUND = ['pool', 'lane', 'fragment', 'lebenslinie', 'systemgrenze', 'schwimmbahn'];

export interface DiagrammSvgProps {
  uebung: DiagrammUebung;
  eingesetzt: Eingesetzt;
  /** Nach dem Prüfen: je Slot richtig/falsch. */
  ergebnis?: Record<string, boolean>;
  /** Hervorgehobener Slot (Tastatur/Ziehen). */
  ziel?: string | null;
  /** Ein Element ist ausgewählt – Slots zeigen, dass man sie antippen kann. */
  auswahl?: boolean;
  onSlot?: (slot: string) => void;
}

export function DiagrammSvg({ uebung: u, eingesetzt, ergebnis, ziel, auswahl, onSlot }: DiagrammSvgProps) {
  const knoten = new Map(u.knoten.map((k) => [k.id, k]));
  const palette = new Map(u.palette.map((p) => [p.id, p]));
  const pfeil = `pf-${u.id}`;
  const offen = `po-${u.id}`;
  const kreis = `pk-${u.id}`;
  const nummer = new Map(
    [...u.knoten.flatMap((k) => (k.slot ? [k.slot] : [])), ...u.kanten.flatMap((k) => (k.slot ? [k.slot] : []))].map((s, i) => [s, i + 1]),
  );
  const slotKnoepfe: { slot: string; x: number; y: number; w: number; h: number; text?: string; form?: string }[] = [];

  const knotenZeichnung = u.knoten.map((k) => {
    if (k.slot) {
      const p = palette.get(eingesetzt[k.slot] ?? '');
      slotKnoepfe.push({ slot: k.slot, x: k.x, y: k.y, w: k.w, h: k.h, text: p?.text, form: p ? formName(p.form) : undefined });
      if (p && !istKantenForm(p.form)) return <FormZeichnung key={k.id} form={p.form} k={k} text={p.text} />;
      return (
        <g key={k.id}>
          <rect x={k.x} y={k.y} width={k.w} height={k.h} rx={8} className="dg-linie dg-strich" />
          <text x={k.x + k.w / 2} y={k.y + k.h / 2} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-leise">
            {nummer.get(k.slot)}
          </text>
        </g>
      );
    }
    return <FormZeichnung key={k.id} form={k.form!} k={k} text={k.text} />;
  });

  const kantenZeichnung = u.kanten.map((k, i) => {
    const punkte = kantenPunkte(k, knoten);
    const eingesetztesElement = k.slot ? palette.get(eingesetzt[k.slot] ?? '') : undefined;
    // Im Sequenzdiagramm bestimmt das eingesetzte Element die Art der Nachricht.
    const art = eingesetztesElement && ['sync', 'async', 'antwort'].includes(eingesetztesElement.form) ? eingesetztesElement.form : k.art;
    const gestrichelt = art === 'nachricht' || art === 'antwort';
    const ende = art === 'zuordnung' ? undefined : art === 'async' || art === 'antwort' ? `url(#${offen})` : `url(#${pfeil})`;
    const [mx, my] = k.label ?? kantenMitte(punkte);
    // Nachrichten im Sequenzdiagramm: Beschriftung über der Linie; sonst mittig (mit Hintergrund, damit die Linie nicht durchscheint).
    const ueber = k.y !== undefined && !k.label;
    const slotY = ueber ? my - KANTEN_SLOT.h - 2 : my - KANTEN_SLOT.h / 2;
    if (k.slot) {
      slotKnoepfe.push({
        slot: k.slot,
        x: mx - KANTEN_SLOT.w / 2,
        y: slotY,
        w: KANTEN_SLOT.w,
        h: KANTEN_SLOT.h,
        text: eingesetztesElement?.text,
        form: eingesetztesElement ? formName(eingesetztesElement.form) : undefined,
      });
    }
    const beschriftung = (text: string) => {
      const zeilen = umbrechen(text, KANTEN_SLOT.w).length;
      const ty = ueber ? my - 6 - ((zeilen - 1) * 14) / 2 - 6 : my;
      return (
        <>
          {!ueber && (
            <rect
              x={mx - KANTEN_SLOT.w / 2}
              y={ty - zeilen * 7 - 2}
              width={KANTEN_SLOT.w}
              height={zeilen * 14 + 4}
              rx={4}
              className="dg-flaeche"
            />
          )}
          <Text x={mx} y={ty} w={KANTEN_SLOT.w} text={text} />
        </>
      );
    };
    return (
      <g key={i}>
        <polyline
          points={punkte.map((p) => p.join(',')).join(' ')}
          className={`dg-linie${gestrichelt ? ' dg-strich' : ''}`}
          {...(ende ? { markerEnd: ende } : {})}
          {...(art === 'nachricht' ? { markerStart: `url(#${kreis})` } : {})}
        />
        {k.slot ? (
          eingesetztesElement ? (
            beschriftung(eingesetztesElement.text)
          ) : (
            <g>
              <rect
                x={mx - KANTEN_SLOT.w / 2}
                y={slotY}
                width={KANTEN_SLOT.w}
                height={KANTEN_SLOT.h}
                rx={6}
                className="dg-form dg-strich"
              />
              <text x={mx} y={slotY + KANTEN_SLOT.h / 2} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-leise">
                {nummer.get(k.slot)}
              </text>
            </g>
          )
        ) : (
          k.text &&
          (k.label || ueber ? (
            beschriftung(k.text)
          ) : (
            <text x={mx} y={my - 7} textAnchor="middle" className="dg-klein dg-kantentext">
              {k.text}
            </text>
          ))
        )}
      </g>
    );
  });

  return (
    <div className="diagramm-flaeche" style={{ width: u.breite, aspectRatio: `${u.breite} / ${u.hoehe}` }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${u.breite} ${u.hoehe}`}
        className="diagramm"
        role="img"
        aria-label={`${u.titel} – Diagramm mit ${nummer.size} Lücken`}
      >
        <defs>
          <marker
            id={pfeil}
            viewBox="0 0 10 10"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L10,5 L0,10 z" className="dg-voll" />
          </marker>
          <marker
            id={offen}
            viewBox="0 0 10 10"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L10,5 L0,10" className="dg-linie" />
          </marker>
          <marker
            id={kreis}
            viewBox="0 0 10 10"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <circle cx="5" cy="5" r="4" className="dg-form" />
          </marker>
        </defs>
        {/* Pools und Fragmente zuerst (Hintergrund), dann Kanten, dann alle anderen Knoten */}
        {knotenZeichnung.filter((_, i) => HINTERGRUND.includes(u.knoten[i].form ?? ''))}
        {kantenZeichnung}
        {knotenZeichnung.filter((_, i) => !HINTERGRUND.includes(u.knoten[i].form ?? ''))}
      </svg>
      {slotKnoepfe.map((roh) => {
        // Kleine Lücken (Balken, Startknoten) bekommen eine größere Tippfläche.
        const s = {
          ...roh,
          y: roh.h < 30 ? roh.y - (30 - roh.h) / 2 : roh.y,
          h: Math.max(roh.h, 30),
          x: roh.w < 30 ? roh.x - (30 - roh.w) / 2 : roh.x,
          w: Math.max(roh.w, 30),
        };
        const status = ergebnis?.[s.slot];
        return (
          <button
            key={s.slot}
            type="button"
            data-slot={s.slot}
            className={`diagramm-slot${s.text ? ' belegt' : ''}${status === true ? ' richtig' : status === false ? ' falsch' : ''}${ziel === s.slot ? ' ziel' : ''}${auswahl ? ' waehlbar' : ''}`}
            style={{
              left: `${(s.x / u.breite) * 100}%`,
              top: `${(s.y / u.hoehe) * 100}%`,
              width: `${(s.w / u.breite) * 100}%`,
              height: `${(s.h / u.hoehe) * 100}%`,
            }}
            aria-label={`Lücke ${nummer.get(s.slot)}: ${s.text ? `${s.form} „${s.text}“` : 'leer'}${status === true ? ', richtig' : status === false ? ', falsch' : ''}`}
            onClick={() => onSlot?.(s.slot)}
          />
        );
      })}
    </div>
  );
}

/** Kleines Symbol der Form für die Palette. */
export function FormSymbol({ form }: { form: Form | KantenForm }) {
  const k: DiagrammKnoten = { id: 'sym', x: 2, y: 4, w: 36, h: 20 };
  const kreis: DiagrammKnoten = { id: 'sym', x: 10, y: 4, w: 20, h: 20 };
  const balken: DiagrammKnoten = { id: 'sym', x: 2, y: 11, w: 36, h: 6 };
  const rund = [
    'xor',
    'and',
    'or',
    'start',
    'zwischen',
    'ende',
    'startpunkt',
    'endpunkt',
    'ablaufende',
    'gw-xor',
    'gw-and',
    'gw-or',
    'entscheidung',
  ];
  // Verbindungen mit derselben Pfeilspitze wie in der Zeichnung: synchron gefüllt, asynchron und Antwort offen.
  const spitze = form === 'sync' || form === 'transition' ? 'gefuellt' : form === 'async' || form === 'antwort' ? 'offen' : undefined;
  const inhalt = istKantenForm(form) ? (
    <>
      <line x1={3} y1={14} x2={spitze ? 32 : 37} y2={14} className={`dg-linie${form === 'antwort' ? ' dg-strich' : ''}`} />
      {spitze === 'gefuellt' && <polygon points="38,14 31,10.5 31,17.5" className="dg-voll" />}
      {spitze === 'offen' && <polyline points="31,10 37,14 31,18" className="dg-linie" fill="none" />}
    </>
  ) : (
    <FormZeichnung form={form} k={form === 'gabel' ? balken : rund.includes(form) ? kreis : k} />
  );
  return (
    <svg viewBox="0 0 40 28" className="diagramm form-symbol" aria-hidden="true" focusable="false">
      {inhalt}
    </svg>
  );
}
