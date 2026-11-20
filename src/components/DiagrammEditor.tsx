// Freier Diagramm-Editor für Modellierungsaufgaben (ERM, EPK, BPMN, Use-Case, Aktivitätsdiagramm): Elemente aus der Leiste
// einfügen, verschieben, in der Größe ändern, verbinden und beschriften – ohne Vorlage. Nach der Abgabe zeigt DiagrammAnsicht
// dieselbe Zeichnung ohne Bedienelemente neben der Musterlösung. Zeichnen mit Pointer Events (Maus, Finger, Stift); alles geht
// auch über die Leiste und den Bereich „Auswahl“ (Tastatur: Tab zum Element, Pfeiltasten verschieben, Entf löscht, Strg+Z macht
// rückgängig).

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { type Form } from '../../domain/diagrammUebungen';
import {
  type DiagrammAntwort,
  type EditorKante,
  type EditorKnoten,
  einrasten,
  inhaltVon,
  istBehaelter,
  mitte,
  neueId,
  NOTATIONEN,
  OHNE_TEXT,
  pruefeDiagrammAntwort,
  type Punkt,
  standardKante,
} from '../lib/diagrammEditor';
import { formName, FormSymbol } from './DiagrammSvg';
import { Icon } from './Icon';
import { neuerPlatz } from '../lib/diagrammPlatz';
import { KantenFeld, KnotenFeld } from './diagramm/Felder';
import { Formhinweise } from './diagramm/Formhinweise';
import { Zeichnung } from './diagramm/Zeichnung';
import { minGroesse, type Auswahl, type Zug } from './diagramm/typen';

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

  /** Platz für ein neues Element: an der Auswahl (rechts bzw. darunter), sonst im sichtbaren Bereich. */
  const platz = (form: Form, w: number, h: number) =>
    neuerPlatz(form, w, h, {
      knoten,
      gewaehlt: gewaehlterKnoten,
      anhaengen,
      editor: wert.editor,
      scrollLinks: scrollRef.current ? scrollRef.current.scrollLeft : null,
      zoom,
    });
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
