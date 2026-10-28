// Zeichnet eine Diagramm-Übung (Umsetzungsplan Phase 7) als SVG mit den dg-*-Klassen der Diagramme aus Deep Dive 17 und legt über
// jeden Slot einen HTML-Knopf (Tippen, Tastatur, Screenreader, Ablegen beim Ziehen). Rein darstellend: was eingesetzt ist und
// was beim Antippen passiert, entscheidet die Seite.

import type { ReactNode } from 'react';
import type { DiagrammKante, DiagrammKnoten, DiagrammUebung, Eingesetzt, Form, KantenForm } from '../../shared/diagrammUebungen';
import { KANTEN_FORMEN } from '../../shared/diagrammUebungen';

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
export const istKantenForm = (f: string): f is KantenForm => (KANTEN_FORMEN as readonly string[]).includes(f);

/** Zeilen für SVG-Text: Wörter umbrechen, damit sie in `breite` Pixel passen (grob 6,6 px je Zeichen bei 12 px Schrift). */
export function umbrechen(text: string, breite: number, zeichenBreite = 6.6): string[] {
  const max = Math.max(4, Math.floor(breite / zeichenBreite));
  const zeilen: string[] = [];
  let zeile = '';
  for (const wort of text.split(/\s+/)) {
    if (!zeile) zeile = wort;
    else if ((zeile + ' ' + wort).length <= max) zeile += ' ' + wort;
    else {
      zeilen.push(zeile);
      zeile = wort;
    }
  }
  if (zeile) zeilen.push(zeile);
  return zeilen;
}

function Text({ x, y, w, text, klasse }: { x: number; y: number; w: number; text: string; klasse?: string }) {
  const zeilen = umbrechen(text, w);
  const hoehe = 14;
  const start = y - ((zeilen.length - 1) * hoehe) / 2;
  return (
    <text x={x} y={start} textAnchor="middle" dominantBaseline="middle" className={klasse ?? 'dg-klein'}>
      {zeilen.map((z, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : hoehe}>
          {z}
        </tspan>
      ))}
    </text>
  );
}

/** Beschriftung eines Ereignisses: unten (Standard) oder – wenn `lage` es verlangt – darüber bzw. daneben. */
function EreignisText({ k, text }: { k: DiagrammKnoten; text: string }) {
  const breite = Math.max(k.w, 110);
  const zeilen = umbrechen(text, breite).length;
  const cx = k.x + k.w / 2;
  const cy = k.y + k.h / 2;
  if (k.lage === 'links' || k.lage === 'rechts') {
    // Neben dem Kreis, knapp unterhalb der Mittellinie: so bleibt der Rand eines Tasks, auf dem ein Grenzereignis sitzt, frei.
    const seite = k.lage === 'links' ? -1 : 1;
    const b = 110;
    const z = umbrechen(text, b).length;
    return <Text x={cx + seite * (k.w / 2 + 6 + b / 2)} y={cy + 4 + z * 7} w={b} text={text} />;
  }
  if (k.lage === 'oben') return <Text x={cx} y={k.y - 12 - (zeilen - 1) * 7} w={breite} text={text} />;
  return <Text x={cx} y={k.y + k.h + 12 + (zeilen - 1) * 7} w={breite} text={text} />;
}

/** Eine Form im Rechteck (x, y, w, h). */
export function FormZeichnung({ form, k, text }: { form: Form; k: DiagrammKnoten; text?: string }): ReactNode {
  const { x, y, w, h } = k;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.min(w, h) / 2;
  const beschriftung = text ? <Text x={cx} y={cy} w={w - 12} text={text} /> : null;
  switch (form) {
    case 'ereignis':
      return (
        <>
          <polygon
            points={`${x + 14},${y} ${x + w - 14},${y} ${x + w},${cy} ${x + w - 14},${y + h} ${x + 14},${y + h} ${x},${cy}`}
            className="dg-rot"
          />
          {text && <Text x={cx} y={cy} w={w - 28} text={text} />}
        </>
      );
    case 'funktion':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} rx={10} className="dg-gut" />
          {beschriftung}
        </>
      );
    case 'xor':
    case 'and':
    case 'or':
      return (
        <>
          <circle cx={cx} cy={cy} r={r} className="dg-form" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
            {form === 'xor' ? 'XOR' : form === 'and' ? '∧' : '∨'}
          </text>
        </>
      );
    case 'org':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} className="dg-mittel" />
          <line x1={x + w * 0.1} y1={cy - h * 0.3} x2={x + w * 0.1} y2={cy + h * 0.3} className="dg-linie dg-duenn" />
          {text && <Text x={cx + 4} y={cy} w={w - 30} text={text} />}
        </>
      );
    case 'info':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-akzent" />
          {beschriftung}
        </>
      );
    case 'start':
    case 'zwischen':
    case 'ende':
      return (
        <>
          <circle cx={cx} cy={cy} r={r} className={form === 'ende' ? 'dg-form dg-dick' : 'dg-form'} />
          {form === 'zwischen' && <circle cx={cx} cy={cy} r={r - 4} className="dg-linie" />}
          {text && <EreignisText k={k} text={text} />}
        </>
      );
    case 'task':
    case 'aktion':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} rx={form === 'aktion' ? 16 : 10} className="dg-form" />
          {beschriftung}
        </>
      );
    case 'zustand':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} rx={14} className="dg-form" />
          {beschriftung}
        </>
      );
    case 'gw-xor':
    case 'gw-and':
    case 'gw-or':
    case 'entscheidung': {
      const d = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
      const m = Math.min(w, h) * 0.18;
      return (
        <>
          <polygon points={d} className="dg-form" />
          {form === 'gw-xor' && (
            <>
              <line x1={cx - m} y1={cy - m} x2={cx + m} y2={cy + m} className="dg-linie" />
              <line x1={cx + m} y1={cy - m} x2={cx - m} y2={cy + m} className="dg-linie" />
            </>
          )}
          {form === 'gw-and' && (
            <>
              <line x1={cx} y1={cy - m * 1.3} x2={cx} y2={cy + m * 1.3} className="dg-linie" />
              <line x1={cx - m * 1.3} y1={cy} x2={cx + m * 1.3} y2={cy} className="dg-linie" />
            </>
          )}
          {form === 'gw-or' && <circle cx={cx} cy={cy} r={m * 1.1} className="dg-linie" />}
          {/* Nur das XOR-Gateway trägt seine Frage; AND/OR und die UML-Raute bleiben ohne Text (die Form sagt alles). */}
          {text && form === 'gw-xor' && <Text x={cx} y={y - 10} w={Math.max(w, 120)} text={text} />}
        </>
      );
    }
    case 'aufruf': {
      // Aufrufaktion: Aktion mit dem Gabelsymbol (Harke) rechts unten – ruft eine eigene Aktivität auf.
      const hx = x + w - 16;
      const hy = y + h - 17;
      return (
        <>
          <rect x={x} y={y} width={w} height={h} rx={16} className="dg-form" />
          <path d={`M${hx},${hy} v6 M${hx - 6},${hy + 12} v-6 h12 v6 M${hx},${hy + 6} v6`} className="dg-linie" />
          {text && <Text x={cx} y={cy} w={w - 48} text={text} />}
        </>
      );
    }
    case 'gabel':
      return <rect x={x} y={y} width={w} height={h} className="dg-voll" />;
    case 'startpunkt':
      return <circle cx={cx} cy={cy} r={r} className="dg-voll" />;
    case 'endpunkt':
      return (
        <>
          <circle cx={cx} cy={cy} r={r} className="dg-form" />
          <circle cx={cx} cy={cy} r={r * 0.55} className="dg-voll" />
        </>
      );
    case 'ablaufende': {
      const d = r * 0.7;
      return (
        <>
          <circle cx={cx} cy={cy} r={r} className="dg-form" />
          <path d={`M${cx - d},${cy - d} L${cx + d},${cy + d} M${cx + d},${cy - d} L${cx - d},${cy + d}`} className="dg-linie" />
        </>
      );
    }
    case 'schwimmbahn': {
      // Senkrechte Bahn mit dem Namen im Kopf – die Aktionen darunter gehören zu dieser Rolle.
      const kopf = Math.min(32, h / 3);
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-linie" />
          <line x1={x} y1={y + kopf} x2={x + w} y2={y + kopf} className="dg-linie" />
          {text && (
            <text x={cx} y={y + kopf / 2} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
              {text}
            </text>
          )}
        </>
      );
    }
    case 'pool':
    case 'lane':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className={form === 'pool' ? 'dg-form' : 'dg-linie'} />
          <line x1={x + 26} y1={y} x2={x + 26} y2={y + h} className="dg-linie" />
          {text && (
            <text
              x={x + 13}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              className="dg-klein"
              transform={`rotate(-90 ${x + 13} ${cy})`}
            >
              {text}
            </text>
          )}
        </>
      );
    case 'lebenslinie':
      return (
        <>
          <rect x={x} y={y} width={w} height={36} className="dg-form" />
          <line x1={cx} y1={y + 36} x2={cx} y2={y + h} className="dg-linie dg-strich" />
          {text && <Text x={cx} y={y + 18} w={w - 10} text={text} />}
        </>
      );
    case 'fragment': {
      // Reiter links oben so breit wie der Text; „alt“ teilt das Fragment mit einer gestrichelten Linie in zwei Bereiche.
      const reiter = Math.min(w, (text?.length ?? 4) * 6.4 + 22);
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-linie" />
          <polygon
            points={`${x},${y} ${x + reiter},${y} ${x + reiter},${y + 14} ${x + reiter - 10},${y + 24} ${x},${y + 24}`}
            className="dg-grau"
          />
          {text?.startsWith('alt') && <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} className="dg-linie dg-strich" />}
          {text && (
            <text x={x + 6} y={y + 12} dominantBaseline="middle" className="dg-klein dg-fett">
              {text}
            </text>
          )}
        </>
      );
    }
    case 'entitaet':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-form" />
          {beschriftung}
        </>
      );
    case 'beziehung':
      return (
        <>
          <polygon points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} className="dg-akzent" />
          {text && <Text x={cx} y={cy} w={w * 0.6} text={text} />}
        </>
      );
    case 'attribut':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} className="dg-form" />
          {text && <Text x={cx} y={cy} w={w - 16} text={text} />}
        </>
      );
    case 'anwendungsfall':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} className="dg-akzent" />
          {text && <Text x={cx} y={cy} w={w - 24} text={text} />}
        </>
      );
    case 'klasse': {
      // Text: „Name“ oder „Name|Attribute|Methoden“ (Abschnitte mit „;“ getrennt) – drei Fächer wie in UML.
      const [name, attrs, meth] = (text ?? '').split('|');
      const kopf = 26;
      const zeilen = (t?: string) => (t ? t.split(';').map((z) => z.trim()) : []);
      const a = zeilen(attrs);
      const m = zeilen(meth);
      const hatFaecher = attrs !== undefined;
      const hoeheA = hatFaecher ? Math.max(20, a.length * 15 + 8) : 0;
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-form" />
          <text x={cx} y={y + kopf / 2} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
            {name}
          </text>
          {hatFaecher && (
            <>
              <line x1={x} y1={y + kopf} x2={x + w} y2={y + kopf} className="dg-linie" />
              <line x1={x} y1={y + kopf + hoeheA} x2={x + w} y2={y + kopf + hoeheA} className="dg-linie" />
              {a.map((z, i) => (
                <text key={`a${i}`} x={x + 8} y={y + kopf + 14 + i * 15} className="dg-klein">
                  {z}
                </text>
              ))}
              {m.map((z, i) => (
                <text key={`m${i}`} x={x + 8} y={y + kopf + hoeheA + 14 + i * 15} className="dg-klein">
                  {z}
                </text>
              ))}
            </>
          )}
        </>
      );
    }
    case 'systemgrenze':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-linie" />
          {text && (
            <text x={cx} y={y + 14} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
              {text}
            </text>
          )}
        </>
      );
    case 'text':
      return text ? <Text x={cx} y={cy} w={w} text={text} /> : null;
    case 'akteur':
      return (
        <>
          <circle cx={cx} cy={y + 9} r={8} className="dg-form" />
          <line x1={cx} y1={y + 17} x2={cx} y2={y + 38} className="dg-linie" />
          <line x1={cx - 12} y1={y + 26} x2={cx + 12} y2={y + 26} className="dg-linie" />
          <line x1={cx} y1={y + 38} x2={cx - 10} y2={y + 54} className="dg-linie" />
          <line x1={cx} y1={y + 38} x2={cx + 10} y2={y + 54} className="dg-linie" />
          {text && <Text x={cx} y={y + 66} w={Math.max(w, 90)} text={text} />}
        </>
      );
    case 'notiz':
      return (
        <>
          <polygon points={`${x},${y} ${x + w - 12},${y} ${x + w},${y + 12} ${x + w},${y + h} ${x},${y + h}`} className="dg-grau" />
          {beschriftung}
        </>
      );
  }
}

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
  const inhalt = istKantenForm(form) ? (
    <line x1={2} y1={14} x2={36} y2={14} className={`dg-linie${form === 'antwort' ? ' dg-strich' : ''}`} />
  ) : (
    <FormZeichnung form={form} k={form === 'gabel' ? balken : rund.includes(form) ? kreis : k} />
  );
  return (
    <svg viewBox="0 0 40 28" className="diagramm form-symbol" aria-hidden="true" focusable="false">
      {inhalt}
    </svg>
  );
}
