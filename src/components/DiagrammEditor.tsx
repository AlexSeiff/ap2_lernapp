// Freier Diagramm-Editor für Modellierungsaufgaben (ERM, EPK, BPMN, Use-Case, Aktivitätsdiagramm): Elemente aus der Leiste
// einfügen, verschieben, in der Größe ändern, verbinden und beschriften – ohne Vorlage. Nach der Abgabe zeigt DiagrammAnsicht
// dieselbe Zeichnung ohne Bedienelemente neben der Musterlösung. Zeichnen mit Pointer Events (Maus, Finger, Stift); alles geht
// auch über die Leiste und den Bereich „Auswahl“ (Tastatur: Tab zum Element, Pfeiltasten verschieben, Entf löscht, Strg+Z macht
// rückgängig).

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import type { Form } from '../../shared/diagrammUebungen';
import {
  beschriftungsPunkt,
  behaelterVon,
  einrasten,
  inhaltVon,
  istBehaelter,
  KANTEN_NAMEN,
  kantenLinien,
  knotenName,
  neueId,
  NIE_TEXT,
  NOTATIONEN,
  OHNE_TEXT,
  pruefeDiagrammAntwort,
  standardKante,
  umriss,
  mitte,
  waechter,
  type DiagrammAntwort,
  type EditorKante,
  type EditorKantenArt,
  type EditorKnoten,
  type Punkt,
} from '../lib/diagrammEditor';
import { FormSymbol, FormZeichnung, formName } from './DiagrammSvg';
import { Icon } from './Icon';

type Auswahl = { typ: 'knoten' | 'kante'; id: string } | null;

type Zug =
  | { art: 'verschieben'; ids: string[]; start: Punkt; dx: number; dy: number; bewegt: boolean; pointer: number }
  | { art: 'groesse'; id: string; start: Punkt; dw: number; dh: number; pointer: number }
  | { art: 'linie'; von: string; p: Punkt; pointer: number };

/** Kardinalitäten zum Antippen (Min-Max und Chen). */
const KARDINALITAETEN = ['(0,1)', '(1,1)', '(0,n)', '(1,n)', '1', 'n', 'm'];
/** Senkrecht arbeitende Notationen: Neue Elemente kommen unter das ausgewählte. */
const SENKRECHT = new Set(['epk', 'usecase', 'aktivitaet']);
/** Kleinste Größe beim Ziehen am Griff; der Balken (Fork/Join) darf dünn bleiben. */
const minGroesse = (f: Form) => (f === 'gabel' ? 6 : 24);

interface Props {
  wert: DiagrammAntwort;
  onChange: (a: DiagrammAntwort) => void;
  /** Formprüfung anbieten (Einzelaufgabe; in der Klausur nicht – wie auf Papier). */
  hilfen: boolean;
}

export function DiagrammEditor({ wert, onChange, hilfen }: Props) {
  const notation = NOTATIONEN[wert.editor];
  const [auswahl, setAuswahl] = useState<Auswahl>(null);
  const [verbinden, setVerbinden] = useState<string | null>(null);
  const [zug, setZug] = useState<Zug | null>(null);
  // Auf dem Handy kleiner beginnen, damit man mehr von der Fläche sieht.
  const [zoom, setZoom] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 600 ? 0.6 : 1));
  const [vollbild, setVollbild] = useState(false);
  const [anhaengen, setAnhaengen] = useState(true);
  const [pruefung, setPruefung] = useState(false);
  const [zurueck, setZurueck] = useState<DiagrammAntwort[]>([]);
  const [vor, setVor] = useState<DiagrammAntwort[]>([]);
  const [fokusText, setFokusText] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const zugRef = useRef<Zug | null>(null);
  const letzteAenderung = useRef<string | undefined>(undefined);
  const letzterTipp = useRef<{ id: string; zeit: number } | null>(null);

  const knoten = wert.knoten;
  const gewaehlterKnoten = auswahl?.typ === 'knoten' ? knoten.find((k) => k.id === auswahl.id) : undefined;
  const gewaehlteKante = auswahl?.typ === 'kante' ? wert.kanten.find((k) => k.id === auswahl.id) : undefined;

  useEffect(() => {
    if (fokusText) textRef.current?.select();
  }, [fokusText]);

  // Vollbild: Esc schließt, die Seite dahinter scrollt nicht mit.
  useEffect(() => {
    if (!vollbild) return undefined;
    const vorher = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = vorher;
    };
  }, [vollbild]);

  /** Änderung übernehmen; aufeinanderfolgende Tipp-Änderungen am selben Element sind ein Schritt für „Rückgängig“. */
  const aendern = (next: DiagrammAntwort, zusammen?: string) => {
    if (!zusammen || zusammen !== letzteAenderung.current) {
      setZurueck((z) => [...z.slice(-59), wert]);
      setVor([]);
    }
    letzteAenderung.current = zusammen;
    onChange(next);
  };
  const rueckgaengig = () => {
    const vorher = zurueck[zurueck.length - 1];
    if (!vorher) return;
    setZurueck((z) => z.slice(0, -1));
    setVor((v) => [wert, ...v]);
    letzteAenderung.current = undefined;
    onChange(vorher);
  };
  const wiederholen = () => {
    const danach = vor[0];
    if (!danach) return;
    setVor((v) => v.slice(1));
    setZurueck((z) => [...z, wert]);
    letzteAenderung.current = undefined;
    onChange(danach);
  };

  const setzeKnoten = (id: string, teil: Partial<EditorKnoten>, zusammen?: string) =>
    aendern({ ...wert, knoten: knoten.map((k) => (k.id === id ? { ...k, ...teil } : k)) }, zusammen);
  const setzeKante = (id: string, teil: Partial<EditorKante>, zusammen?: string) =>
    aendern({ ...wert, kanten: wert.kanten.map((k) => (k.id === id ? { ...k, ...teil } : k)) }, zusammen);

  const verbinde = (von: string, nach: string, basis = wert): DiagrammAntwort => {
    const a = basis.knoten.find((k) => k.id === von);
    const b = basis.knoten.find((k) => k.id === nach);
    if (!a || !b || von === nach) return basis;
    const kante: EditorKante = { id: neueId('v', basis.kanten), von, nach, art: standardKante(basis, a, b) };
    return { ...basis, kanten: [...basis.kanten, kante] };
  };

  const ueberlappt = (x: number, y: number, w: number, h: number) =>
    knoten.some((k) => !istBehaelter(k.form) && x < k.x + k.w && x + w > k.x && y < k.y + k.h && y + h > k.y);

  /** Platz für ein neues Element: an der Auswahl (rechts bzw. darunter), sonst im sichtbaren Bereich. */
  function platz(form: Form, w: number, h: number): { x: number; y: number; h?: number; pool?: EditorKnoten } {
    if (form === 'schwimmbahn') {
      // Neue Schwimmbahn rechts neben die letzte, gleich hoch – so entstehen nebeneinanderliegende Bahnen.
      const bahnen = knoten.filter((k) => k.form === 'schwimmbahn');
      if (bahnen.length) {
        const rechts = bahnen.reduce((a, b) => (b.x + b.w > a.x + a.w ? b : a));
        return { x: rechts.x + rechts.w, y: rechts.y, h: rechts.h };
      }
      return { x: 40, y: 40 };
    }
    if (form === 'lane') {
      const pool =
        (gewaehlterKnoten?.form === 'pool' ? gewaehlterKnoten : undefined) ??
        (gewaehlterKnoten ? behaelterVon(gewaehlterKnoten, knoten, 'pool') : undefined) ??
        knoten.find((k) => k.form === 'pool');
      if (pool) {
        const lanes = knoten.filter((k) => k.form === 'lane' && behaelterVon(k, knoten, 'pool')?.id === pool.id);
        const y = lanes.length ? Math.max(...lanes.map((l) => l.y + l.h)) : pool.y;
        return { x: pool.x + 26, y, pool };
      }
    }
    if (istBehaelter(form)) {
      const unten = knoten.length ? Math.max(...knoten.map((k) => k.y + k.h)) + 40 : 40;
      return { x: form === 'systemgrenze' ? 160 : 40, y: knoten.some((k) => istBehaelter(k.form)) || !knoten.length ? unten : 40 };
    }
    const sel = gewaehlterKnoten;
    const grenze = knoten.find((k) => k.form === 'systemgrenze');
    if (form === 'akteur' && grenze) {
      // Akteure stehen links außerhalb der Systemgrenze, auf Höhe des ausgewählten Anwendungsfalls.
      const x = Math.max(10, grenze.x - w - 60);
      let y = sel && !istBehaelter(sel.form) ? mitte(sel)[1] - h / 2 : grenze.y + 20;
      for (let i = 0; i < 20 && ueberlappt(x, y, w, h); i++) y += h + 30;
      return { x: einrasten(x), y: Math.max(10, einrasten(y)) };
    }
    if (sel && istBehaelter(sel.form)) {
      // In den ausgewählten Pool, die Lane, die Schwimmbahn oder die Systemgrenze hinein (links beginnend, nach rechts weiter).
      // Systemgrenze und Schwimmbahn: untereinander, unter dem Kopf der Bahn.
      const untereinander = sel.form === 'systemgrenze' || sel.form === 'schwimmbahn';
      let x = untereinander ? sel.x + sel.w / 2 - w / 2 : sel.x + (sel.form === 'pool' ? 60 : 40);
      let y = untereinander ? sel.y + (sel.form === 'schwimmbahn' ? 60 : 40) : sel.y + sel.h / 2 - h / 2;
      for (let i = 0; i < 20 && ueberlappt(x, y, w, h); i++) {
        if (untereinander) y += h + 30;
        else x += w + 40;
      }
      return { x: einrasten(x), y: einrasten(y) };
    }
    if (sel && anhaengen) {
      const [cx, cy] = mitte(sel);
      const senkrecht = SENKRECHT.has(wert.editor);
      let x = senkrecht ? cx - w / 2 : sel.x + sel.w + 50;
      let y = senkrecht ? sel.y + sel.h + 40 : cy - h / 2;
      for (let i = 0; i < 12 && ueberlappt(x, y, w, h); i++) {
        if (senkrecht) x += w + 30;
        else y += h + 30;
      }
      return { x: Math.max(10, einrasten(x)), y: Math.max(10, einrasten(y)) };
    }
    const sc = scrollRef.current;
    const x0 = sc ? sc.scrollLeft / zoom + 40 : 40;
    let x = x0;
    let y = 40;
    for (let i = 0; i < 60 && ueberlappt(x, y, w, h); i++) {
      x += w + 30;
      if (x > x0 + 600) {
        x = x0;
        y += h + 40;
      }
    }
    return { x: einrasten(x), y: einrasten(y) };
  }

  const hinzufuegen = (vorlage: (typeof notation.formen)[number]) => {
    const { form, w, text } = vorlage;
    const { x, y, pool, h = vorlage.h } = platz(form, w, vorlage.h);
    const breite = pool ? pool.w - 26 : w;
    const neu: EditorKnoten = { id: neueId('k', knoten), form, x, y, w: breite, h, text };
    let next: DiagrammAntwort = { ...wert, knoten: [...knoten, neu] };
    // Der Pool wächst mit seinen Lanes.
    if (pool && y + h > pool.y + pool.h)
      next = { ...next, knoten: next.knoten.map((k) => (k.id === pool.id ? { ...k, h: y + h - k.y } : k)) };
    if (gewaehlterKnoten && anhaengen && !istBehaelter(form) && !istBehaelter(gewaehlterKnoten.form) && form !== 'text')
      next = verbinde(gewaehlterKnoten.id, neu.id, next);
    aendern(next);
    setAuswahl({ typ: 'knoten', id: neu.id });
    setVerbinden(null);
    if (text || !OHNE_TEXT.includes(form)) setFokusText((n) => n + 1);
  };

  const loeschen = () => {
    if (gewaehlterKnoten) {
      const id = gewaehlterKnoten.id;
      aendern({ ...wert, knoten: knoten.filter((k) => k.id !== id), kanten: wert.kanten.filter((e) => e.von !== id && e.nach !== id) });
    } else if (gewaehlteKante) {
      aendern({ ...wert, kanten: wert.kanten.filter((e) => e.id !== gewaehlteKante.id) });
    }
    setAuswahl(null);
  };

  const duplizieren = () => {
    if (!gewaehlterKnoten) return;
    const neu = { ...gewaehlterKnoten, id: neueId('k', knoten), x: gewaehlterKnoten.x + 20, y: gewaehlterKnoten.y + 20 };
    aendern({ ...wert, knoten: [...knoten, neu] });
    setAuswahl({ typ: 'knoten', id: neu.id });
  };

  const verschiebeAuswahl = (dx: number, dy: number) => {
    if (!gewaehlterKnoten) return;
    const ids = new Set([gewaehlterKnoten.id, ...(istBehaelter(gewaehlterKnoten.form) ? inhaltVon(gewaehlterKnoten, knoten) : [])]);
    aendern(
      { ...wert, knoten: knoten.map((k) => (ids.has(k.id) ? { ...k, x: Math.max(0, k.x + dx), y: Math.max(0, k.y + dy) } : k)) },
      `pfeil:${gewaehlterKnoten.id}`,
    );
  };

  // ---------- Zeiger ----------

  const svgPunkt = (e: { clientX: number; clientY: number }): Punkt => {
    const r = svgRef.current!.getBoundingClientRect();
    return [(e.clientX - r.left) / zoom, (e.clientY - r.top) / zoom];
  };
  const beginne = (z: Zug, e: ReactPointerEvent) => {
    zugRef.current = z;
    try {
      svgRef.current?.setPointerCapture?.(e.pointerId);
    } catch {
      // Zeiger schon wieder weg (sehr kurzes Antippen): ohne Erfassung weiter, die Bewegungen kommen dann direkt an.
    }
  };

  const knotenDruck = (k: EditorKnoten) => (e: ReactPointerEvent<SVGGElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (verbinden) {
      if (verbinden !== k.id) aendern(verbinde(verbinden, k.id));
      setVerbinden(null);
      setAuswahl({ typ: 'knoten', id: k.id });
      return;
    }
    // Zweimal antippen: Text bearbeiten (Doppelklick kommt wegen der Zeigererfassung nicht am Element an).
    const jetzt = Date.now();
    if (letzterTipp.current?.id === k.id && jetzt - letzterTipp.current.zeit < 400) setFokusText((n) => n + 1);
    letzterTipp.current = { id: k.id, zeit: jetzt };
    setAuswahl({ typ: 'knoten', id: k.id });
    const ids = istBehaelter(k.form) ? [k.id, ...inhaltVon(k, knoten)] : [k.id];
    beginne({ art: 'verschieben', ids, start: svgPunkt(e), dx: 0, dy: 0, bewegt: false, pointer: e.pointerId }, e);
  };
  const griffDruck = (k: EditorKnoten, art: 'groesse' | 'linie') => (e: ReactPointerEvent<SVGElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const p = svgPunkt(e);
    beginne(
      art === 'groesse' ? { art, id: k.id, start: p, dw: 0, dh: 0, pointer: e.pointerId } : { art, von: k.id, p, pointer: e.pointerId },
      e,
    );
    setZug(zugRef.current);
  };
  const kanteDruck = (e: EditorKante) => (ev: ReactPointerEvent<SVGGElement>) => {
    if (ev.button !== 0 || verbinden) return;
    ev.stopPropagation();
    setAuswahl({ typ: 'kante', id: e.id });
  };
  const flaecheDruck = () => {
    setAuswahl(null);
    setVerbinden(null);
  };

  const bewege = (e: ReactPointerEvent<SVGSVGElement>) => {
    const z = zugRef.current;
    if (!z || z.pointer !== e.pointerId) return;
    const p = svgPunkt(e);
    let next: Zug;
    if (z.art === 'verschieben') {
      const dx = p[0] - z.start[0];
      const dy = p[1] - z.start[1];
      if (!z.bewegt && Math.hypot(dx, dy) * zoom < 4) return;
      next = { ...z, dx, dy, bewegt: true };
    } else if (z.art === 'groesse') next = { ...z, dw: p[0] - z.start[0], dh: p[1] - z.start[1] };
    else next = { ...z, p };
    zugRef.current = next;
    setZug(next);
  };
  const lasseLos = (e: ReactPointerEvent<SVGSVGElement>) => {
    const z = zugRef.current;
    if (!z || z.pointer !== e.pointerId) return;
    zugRef.current = null;
    setZug(null);
    if (z.art === 'verschieben' && z.bewegt) {
      const fuehrend = knoten.find((k) => k.id === z.ids[0])!;
      const ddx = Math.max(0, einrasten(fuehrend.x + z.dx)) - fuehrend.x;
      const ddy = Math.max(0, einrasten(fuehrend.y + z.dy)) - fuehrend.y;
      const ids = new Set(z.ids);
      aendern({ ...wert, knoten: knoten.map((k) => (ids.has(k.id) ? { ...k, x: Math.max(0, k.x + ddx), y: Math.max(0, k.y + ddy) } : k)) });
    } else if (z.art === 'groesse') {
      const k = knoten.find((x) => x.id === z.id)!;
      const w = Math.max(minGroesse(k.form), einrasten(k.w + z.dw));
      const h = Math.max(minGroesse(k.form), einrasten(k.h + z.dh));
      // Schwimmbahnen nebeneinander wachsen gemeinsam nach unten.
      const mit = (x: EditorKnoten) => x.id === k.id || (k.form === 'schwimmbahn' && x.form === 'schwimmbahn' && x.y === k.y);
      aendern({ ...wert, knoten: knoten.map((x) => (x.id === k.id ? { ...x, w, h } : mit(x) ? { ...x, h } : x)) });
    } else if (z.art === 'linie') {
      const ziel = (document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-knoten]') as SVGGElement | null)?.dataset.knoten;
      if (ziel && ziel !== z.von) aendern(verbinde(z.von, ziel));
    }
  };
  const abbrechen = () => {
    zugRef.current = null;
    setZug(null);
  };

  const taste = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const ziel = e.target as HTMLElement;
    const imFeld = ['INPUT', 'TEXTAREA', 'SELECT'].includes(ziel.tagName);
    const strg = e.ctrlKey || e.metaKey;
    if (e.key === 'Escape') {
      if (verbinden) setVerbinden(null);
      else if (vollbild) setVollbild(false);
      else setAuswahl(null);
      return;
    }
    if (imFeld) return;
    if (strg && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) wiederholen();
      else rueckgaengig();
    } else if (strg && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      wiederholen();
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && auswahl) {
      e.preventDefault();
      loeschen();
    } else if (gewaehlterKnoten && e.key.startsWith('Arrow')) {
      e.preventDefault();
      const s = e.shiftKey ? 50 : 10;
      const [dx, dy] = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key] ?? [0, 0];
      verschiebeAuswahl(dx, dy);
    } else if (gewaehlterKnoten && e.key === 'Enter') {
      e.preventDefault();
      setFokusText((n) => n + 1);
    }
  };

  // ---------- Zeichnen ----------

  const verschoben = (k: EditorKnoten): EditorKnoten => {
    if (zug?.art === 'verschieben' && zug.ids.includes(k.id)) return { ...k, x: k.x + zug.dx, y: k.y + zug.dy };
    if (zug?.art === 'groesse' && zug.id === k.id)
      return { ...k, w: Math.max(minGroesse(k.form), k.w + zug.dw), h: Math.max(minGroesse(k.form), k.h + zug.dh) };
    return k;
  };
  const gezeichnet = knoten.map(verschoben);
  const breite = Math.max(960, ...gezeichnet.map((k) => k.x + k.w + 240));
  const hoehe = Math.max(560, ...gezeichnet.map((k) => k.y + k.h + 200));
  const meldungen = pruefung ? pruefeDiagrammAntwort(wert) : [];
  const leer = !knoten.length;

  return (
    <div className={`diagramm-editor${vollbild ? ' vollbild' : ''}`} onKeyDown={taste}>
      <div className="ed-leiste" role="toolbar" aria-label={`${notation.name}: Elemente einfügen`}>
        {notation.formen.map((f) => (
          <button
            key={f.form}
            type="button"
            className="palette-element"
            onClick={() => hinzufuegen(f)}
            title={`${formName(f.form)} einfügen`}
          >
            {f.form === 'text' ? (
              <span className="form-symbol ed-text-symbol" aria-hidden="true">
                Aa
              </span>
            ) : (
              <FormSymbol form={f.form} />
            )}
            {formName(f.form)}
          </button>
        ))}
      </div>
      <div className="ed-werkzeuge">
        <label className="ed-schalter" title="Ein neues Element wird an das ausgewählte angehängt und gleich verbunden.">
          <input type="checkbox" checked={anhaengen} onChange={(e) => setAnhaengen(e.target.checked)} /> an Auswahl anhängen
        </label>
        <span className="ed-abstand" />
        <button type="button" className="ghost" onClick={rueckgaengig} disabled={!zurueck.length} title="Rückgängig (Strg+Z)">
          ↶ Rückgängig
        </button>
        <button type="button" className="ghost" onClick={wiederholen} disabled={!vor.length} title="Wiederholen (Strg+Y)">
          ↷
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
          aria-label="Verkleinern"
        >
          −
        </button>
        <span className="muted small ed-zoom">{Math.round(zoom * 100)} %</span>
        <button
          type="button"
          className="ghost"
          onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(1)))}
          aria-label="Vergrößern"
        >
          +
        </button>
        <button type="button" className="ghost" onClick={() => setVollbild((v) => !v)} aria-pressed={vollbild}>
          {vollbild ? 'Vollbild beenden' : 'Vollbild'}
        </button>
      </div>

      <div className="ed-scroll" ref={scrollRef}>
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          className={`diagramm ed-svg${verbinden ? ' verbinden' : ''}`}
          width={breite * zoom}
          height={hoehe * zoom}
          viewBox={`0 0 ${breite} ${hoehe}`}
          aria-label={`${notation.name}-Zeichenfläche mit ${knoten.length} Elementen und ${wert.kanten.length} Verbindungen`}
          onPointerDown={flaecheDruck}
          onPointerMove={bewege}
          onPointerUp={lasseLos}
          onPointerCancel={abbrechen}
        >
          <defs>
            <pattern id="ed-raster" width={20} height={20} patternUnits="userSpaceOnUse">
              <circle cx={1} cy={1} r={1} className="ed-rasterpunkt" />
            </pattern>
          </defs>
          <rect width={breite} height={hoehe} fill="url(#ed-raster)" />
          <Zeichnung
            antwort={{ ...wert, knoten: gezeichnet }}
            auswahl={auswahl}
            knotenDruck={knotenDruck}
            kanteDruck={kanteDruck}
            griffDruck={griffDruck}
            onFokus={(id) => setAuswahl({ typ: 'knoten', id })}
          />
          {zug?.art === 'linie' && (
            <line
              x1={mitte(knoten.find((k) => k.id === zug.von)!)[0]}
              y1={mitte(knoten.find((k) => k.id === zug.von)!)[1]}
              x2={zug.p[0]}
              y2={zug.p[1]}
              className="ed-vorschau"
            />
          )}
        </svg>
        {leer && (
          <p className="ed-leer muted">
            Noch leer. Tippe oben ein Element an – es erscheint hier. Danach ziehen, um es zu verschieben; am blauen Punkt ziehen, um es zu
            verbinden.
          </p>
        )}
      </div>

      <div className="ed-auswahl-feld" aria-live="polite">
        {verbinden ? (
          <p className="ed-hinweis">
            Tippe jetzt das Ziel der Verbindung an.{' '}
            <button type="button" className="ghost" onClick={() => setVerbinden(null)}>
              Abbrechen
            </button>
          </p>
        ) : gewaehlterKnoten ? (
          <KnotenFeld
            k={gewaehlterKnoten}
            antwort={wert}
            textRef={textRef}
            onText={(text) => setzeKnoten(gewaehlterKnoten.id, { text }, `text:${gewaehlterKnoten.id}`)}
            onSchluessel={(schluessel) => setzeKnoten(gewaehlterKnoten.id, { schluessel })}
            onDrehen={() => {
              const { x, y, w, h } = gewaehlterKnoten;
              const nx = Math.max(0, einrasten(x + w / 2 - h / 2));
              setzeKnoten(gewaehlterKnoten.id, { x: nx, y: Math.max(0, einrasten(y + h / 2 - w / 2)), w: h, h: w });
            }}
            onVerbinden={() => setVerbinden(gewaehlterKnoten.id)}
            onKante={(id) => setAuswahl({ typ: 'kante', id })}
            onDuplizieren={duplizieren}
            onLoeschen={loeschen}
          />
        ) : gewaehlteKante ? (
          <KantenFeld
            e={gewaehlteKante}
            antwort={wert}
            arten={notation.kanten}
            onAendern={(teil, zusammen) => setzeKante(gewaehlteKante.id, teil, zusammen)}
            onLoeschen={loeschen}
          />
        ) : (
          <p className="muted small">{notation.tipp} Tippe ein Element oder eine Verbindung an, um sie zu bearbeiten.</p>
        )}
      </div>

      {hilfen && (
        <div className="ed-pruefung">
          <button type="button" className="secondary" onClick={() => setPruefung((p) => !p)} aria-expanded={pruefung} disabled={leer}>
            <Icon name="list-checks" /> {pruefung ? 'Formprüfung ausblenden' : 'Form prüfen'}
          </button>
          {pruefung && <Formhinweise meldungen={meldungen} />}
        </div>
      )}
    </div>
  );
}

/** Hinweise der Formprüfung (oder: alles in Ordnung). */
export function Formhinweise({ meldungen }: { meldungen: string[] }) {
  if (!meldungen.length)
    return <p className="ok small">Keine Formfehler gefunden. Ob Inhalt und Beschriftungen stimmen, zeigt dir die Musterlösung.</p>;
  return (
    <ul className="diagramm-regeln">
      {meldungen.map((m) => (
        <li key={m}>
          <Icon name="triangle-alert" /> {m}
        </li>
      ))}
    </ul>
  );
}

function KnotenFeld({
  k,
  antwort,
  textRef,
  onText,
  onSchluessel,
  onDrehen,
  onVerbinden,
  onKante,
  onDuplizieren,
  onLoeschen,
}: {
  k: EditorKnoten;
  antwort: DiagrammAntwort;
  textRef: RefObject<HTMLInputElement | null>;
  onText: (t: string) => void;
  onSchluessel: (s: boolean) => void;
  onDrehen: () => void;
  onVerbinden: () => void;
  onKante: (id: string) => void;
  onDuplizieren: () => void;
  onLoeschen: () => void;
}) {
  const kanten = antwort.kanten.filter((e) => e.von === k.id || e.nach === k.id);
  const name = (id: string) => {
    const x = antwort.knoten.find((n) => n.id === id);
    return x ? knotenName(x, antwort.knoten, antwort.kanten) : '?';
  };
  return (
    <div className="ed-feld">
      {NIE_TEXT.includes(k.form) ? (
        <p className="small">{knotenName(k, antwort.knoten, antwort.kanten)}</p>
      ) : (
        <label className="ed-text">
          <span>{formName(k.form)}</span>
          <input ref={textRef} type="text" value={k.text} placeholder="Beschriftung" onChange={(e) => onText(e.target.value)} />
        </label>
      )}
      {k.form === 'attribut' && (
        <label className="ed-schalter">
          <input type="checkbox" checked={!!k.schluessel} onChange={(e) => onSchluessel(e.target.checked)} /> Schlüsselattribut
          (unterstrichen)
        </label>
      )}
      <div className="ed-knoepfe">
        <button type="button" className="secondary" onClick={onVerbinden}>
          Verbinden mit …
        </button>
        {k.form === 'gabel' && (
          <button type="button" className="ghost" onClick={onDrehen}>
            {k.w >= k.h ? 'Senkrecht stellen' : 'Waagerecht legen'}
          </button>
        )}
        <button type="button" className="ghost" onClick={onDuplizieren}>
          Duplizieren
        </button>
        <button type="button" className="ghost danger" onClick={onLoeschen}>
          Löschen
        </button>
      </div>
      {kanten.length > 0 && (
        <p className="small ed-verbindungen">
          Verbindungen:{' '}
          {kanten.map((e) => (
            <button key={e.id} type="button" className="ghost" onClick={() => onKante(e.id)}>
              {e.von === k.id ? `→ ${name(e.nach)}` : `← ${name(e.von)}`}
            </button>
          ))}
        </p>
      )}
    </div>
  );
}

function KantenFeld({
  e,
  antwort,
  arten,
  onAendern,
  onLoeschen,
}: {
  e: EditorKante;
  antwort: DiagrammAntwort;
  arten: EditorKantenArt[];
  onAendern: (teil: Partial<EditorKante>, zusammen?: string) => void;
  onLoeschen: () => void;
}) {
  const von = antwort.knoten.find((k) => k.id === e.von)!;
  const nach = antwort.knoten.find((k) => k.id === e.nach)!;
  const erm = antwort.editor === 'erm';
  const aktivitaet = antwort.editor === 'aktivitaet';
  const entitaet = [von, nach].find((k) => k.form === 'entitaet');
  return (
    <div className="ed-feld">
      <p className="small">
        Verbindung {knotenName(von, antwort.knoten, antwort.kanten)} → {knotenName(nach, antwort.knoten, antwort.kanten)}
      </p>
      {arten.length > 1 && (
        <label className="ed-text">
          <span>Art</span>
          <select value={e.art} onChange={(ev) => onAendern({ art: ev.target.value as EditorKantenArt })}>
            {arten.map((a) => (
              <option key={a} value={a}>
                {KANTEN_NAMEN[a]}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="ed-text">
        <span>
          {erm ? `Kardinalität${entitaet ? ` (an ${entitaet.text || 'der Entität'})` : ''}` : aktivitaet ? 'Bedingung' : 'Beschriftung'}
        </span>
        <input
          type="text"
          value={e.text ?? ''}
          placeholder={
            erm
              ? 'z. B. (1,n)'
              : antwort.editor === 'bpmn'
                ? 'z. B. ja / angenommen'
                : aktivitaet && von.form === 'entscheidung'
                  ? 'z. B. bezahlt – wird zu [bezahlt]'
                  : 'optional'
          }
          onChange={(ev) => onAendern({ text: ev.target.value }, `kante:${e.id}`)}
        />
      </label>
      {erm && (
        <div className="ed-knoepfe" aria-label="Kardinalität wählen">
          {KARDINALITAETEN.map((k) => (
            <button key={k} type="button" className={`ghost${e.text === k ? ' aktiv' : ''}`} onClick={() => onAendern({ text: k })}>
              {k}
            </button>
          ))}
        </div>
      )}
      <div className="ed-knoepfe">
        {!erm && (
          <button type="button" className="ghost" onClick={() => onAendern({ von: e.nach, nach: e.von })}>
            Richtung umkehren
          </button>
        )}
        <button type="button" className="ghost danger" onClick={onLoeschen}>
          Löschen
        </button>
      </div>
    </div>
  );
}

// ---------- Zeichnung (Editor und Ansicht) ----------

interface ZeichnungProps {
  antwort: DiagrammAntwort;
  auswahl?: Auswahl;
  knotenDruck?: (k: EditorKnoten) => (e: ReactPointerEvent<SVGGElement>) => void;
  kanteDruck?: (e: EditorKante) => (ev: ReactPointerEvent<SVGGElement>) => void;
  griffDruck?: (k: EditorKnoten, art: 'groesse' | 'linie') => (e: ReactPointerEvent<SVGElement>) => void;
  onFokus?: (id: string) => void;
}

function Zeichnung({ antwort, auswahl, knotenDruck, kanteDruck, griffDruck, onFokus }: ZeichnungProps) {
  const roh = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ids = { pfeil: `ep${roh}`, offen: `eo${roh}`, kreis: `ek${roh}` };
  const bearbeitbar = !!knotenDruck;
  const nachId = new Map(antwort.knoten.map((k) => [k.id, k]));
  const linien = kantenLinien(antwort.knoten, antwort.kanten);
  // Behälter zuerst (große unten), dann Kanten, dann die übrigen Formen.
  const behaelter = antwort.knoten.filter((k) => istBehaelter(k.form)).sort((a, b) => b.w * b.h - a.w * a.h);
  const formen = antwort.knoten.filter((k) => !istBehaelter(k.form));

  const knotenZeichnung = (k: EditorKnoten) => {
    const gewaehlt = auswahl?.typ === 'knoten' && auswahl.id === k.id;
    const [cx, cy] = mitte(k);
    return (
      <g
        key={k.id}
        data-knoten={k.id}
        className={`ed-knoten${gewaehlt ? ' gewaehlt' : ''}${istBehaelter(k.form) ? ' behaelter' : ''}`}
        {...(bearbeitbar
          ? {
              tabIndex: 0,
              role: 'button',
              'aria-label': knotenName(k, antwort.knoten, antwort.kanten),
              'aria-pressed': gewaehlt,
              onPointerDown: knotenDruck!(k),
              onFocus: () => onFokus?.(k.id),
            }
          : {})}
      >
        {/* Dünne Formen (Balken) bekommen eine größere Tippfläche. */}
        <rect
          x={k.x - Math.max(0, 24 - k.w) / 2}
          y={k.y - Math.max(0, 24 - k.h) / 2}
          width={Math.max(k.w, 24)}
          height={Math.max(k.h, 24)}
          className="ed-treffer"
        />
        <FormZeichnung form={k.form} k={k} text={k.text} />
        {k.schluessel && k.text && (
          <line
            x1={cx - Math.min(k.w - 16, k.text.length * 6.6) / 2}
            x2={cx + Math.min(k.w - 16, k.text.length * 6.6) / 2}
            y1={cy + 8}
            y2={cy + 8}
            className="dg-linie dg-duenn"
          />
        )}
        {gewaehlt && bearbeitbar && (
          <>
            <rect x={k.x - 5} y={k.y - 5} width={k.w + 10} height={k.h + 10} rx={6} className="ed-rahmen" />
            <g className="ed-griff" onPointerDown={griffDruck!(k, 'linie')} aria-hidden="true">
              <circle cx={k.x + k.w + 16} cy={cy} r={14} className="ed-griff-treffer" />
              <circle cx={k.x + k.w + 16} cy={cy} r={7} className="ed-griff-punkt" />
              <path d={`M${k.x + k.w + 12},${cy} h8 m-3,-3 l3,3 l-3,3`} className="ed-griff-pfeil" />
            </g>
            <g className="ed-griff groesse" onPointerDown={griffDruck!(k, 'groesse')} aria-hidden="true">
              <rect x={k.x + k.w - 4} y={k.y + k.h - 4} width={22} height={22} className="ed-griff-treffer" />
              <rect x={k.x + k.w} y={k.y + k.h} width={10} height={10} rx={2} className="ed-griff-punkt" />
            </g>
          </>
        )}
      </g>
    );
  };

  return (
    <>
      <defs>
        <marker
          id={ids.pfeil}
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
          id={ids.offen}
          viewBox="0 0 10 10"
          markerWidth="11"
          markerHeight="11"
          refX="10"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L10,5 L0,10" className="dg-linie" />
        </marker>
        <marker
          id={ids.kreis}
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
      {behaelter.map(knotenZeichnung)}
      {antwort.kanten.map((e) => {
        const linie = linien.get(e.id);
        if (!linie) return null;
        const [[x1, y1], [x2, y2]] = linie;
        const gewaehlt = auswahl?.typ === 'kante' && auswahl.id === e.id;
        const gestrichelt = e.art === 'nachricht' || e.art === 'include' || e.art === 'extend';
        const gepunktet = e.art === 'zuordnung' && antwort.editor === 'bpmn';
        const ende = e.art === 'fluss' ? ids.pfeil : gestrichelt ? ids.offen : undefined;
        const von = nachId.get(e.von)!;
        const nach = nachId.get(e.nach)!;
        const erm = antwort.editor === 'erm';
        const [lx, ly] = beschriftungsPunkt(linie, erm && von.form === 'entitaet', erm && nach.form === 'entitaet');
        const beschriftung = antwort.editor === 'aktivitaet' ? waechter(e.text ?? '') : (e.text?.trim() ?? '');
        const text = [e.art === 'include' ? '«include»' : e.art === 'extend' ? '«extend»' : '', beschriftung].filter(Boolean).join(' ');
        return (
          <g key={e.id} className={`ed-kante${gewaehlt ? ' gewaehlt' : ''}`} {...(kanteDruck ? { onPointerDown: kanteDruck(e) } : {})}>
            {bearbeitbar && <line x1={x1} y1={y1} x2={x2} y2={y2} className="ed-kante-treffer" />}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className={`dg-linie${gestrichelt ? ' dg-strich' : ''}${gepunktet ? ' dg-punkt' : ''}${gewaehlt ? ' ed-kante-gewaehlt' : ''}`}
              {...(ende ? { markerEnd: `url(#${ende})` } : {})}
              {...(e.art === 'nachricht' ? { markerStart: `url(#${ids.kreis})` } : {})}
            />
            {text && (
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-kantentext">
                {text}
              </text>
            )}
          </g>
        );
      })}
      {formen.map(knotenZeichnung)}
    </>
  );
}

/** Die gezeichnete Lösung ohne Bedienelemente (nach der Abgabe, neben der Musterlösung). */
export function DiagrammAnsicht({ wert }: { wert: DiagrammAntwort }) {
  if (!wert.knoten.length) return <p className="muted">Kein Diagramm gezeichnet.</p>;
  const u = umriss(wert.knoten);
  return (
    <figure className="diagramm ed-ansicht">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${u.x} ${u.y} ${u.w} ${u.h}`}
        width={u.w}
        role="img"
        aria-label={`Dein ${NOTATIONEN[wert.editor].name} mit ${wert.knoten.length} Elementen`}
      >
        <Zeichnung antwort={wert} />
      </svg>
    </figure>
  );
}
