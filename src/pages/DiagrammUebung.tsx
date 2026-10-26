// Einzelne Diagramm-Übung (/diagramme/:id, Umsetzungsplan Phase 7): Szenario, Diagramm-Gerüst mit Lücken, Palette.
// Einsetzen per Ziehen (Pointer Events – HTML5-Drag-and-Drop ist auf iOS Safari unzuverlässig) oder per Tippen: Element antippen,
// dann Lücke antippen (geht auch mit Tastatur und Screenreader). Prüfen bewertet jede Lücke und zeigt verletzte Formregeln.

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  bewerteDiagramm,
  DIAGRAMM_TYP_NAMEN,
  type DiagrammErgebnis,
  type DiagrammUebung as DiagrammUebungTyp,
  type Eingesetzt,
  formregeln,
  musterBelegung,
  slotsVon,
} from '../../shared/diagrammUebungen';
import { DiagrammSvg, FormSymbol, formName } from '../components/DiagrammSvg';
import { Icon } from '../components/Icon';
import { Markdown } from '../components/Markdown';
import { useConfirm } from '../hooks/useConfirm';
import { diagrammStatus, diagrammUebungen, recordDiagrammCheck, recordDiagrammHint, recordDiagrammLoesung } from '../lib/diagramme';
import { useStore } from '../lib/store';
import { STATUS_LABELS } from '../lib/uebungLabels';

export const STUFEN: Record<1 | 2, string> = { 1: 'Lücken füllen', 2: 'Ablauf ordnen' };

export function DiagrammUebung() {
  const { id = '' } = useParams();
  const { content } = useStore();
  const u = diagrammUebungen(content).find((x) => x.id === id);
  if (!u) {
    return (
      <div className="page">
        <h1>Übung nicht gefunden</h1>
        <p>
          <Link to="/diagramme">← Zu den Diagramm-Übungen</Link>
        </p>
      </div>
    );
  }
  return <DiagrammUebungView key={id} u={u} />;
}

/** Einsetzen: ein einfaches Element verlässt seine bisherige Lücke; was in der Ziellücke lag, geht zurück in die Palette. */
export function einsetzen(u: DiagrammUebungTyp, belegung: Eingesetzt, element: string, slot: string): Eingesetzt {
  const mehrfach = u.palette.find((p) => p.id === element)?.mehrfach;
  const next = Object.fromEntries(Object.entries(belegung).filter(([s, e]) => s !== slot && (mehrfach || e !== element)));
  return { ...next, [slot]: element };
}

function DiagrammUebungView({ u }: { u: DiagrammUebungTyp }) {
  const { content, progress, update } = useStore();
  const confirm = useConfirm();
  const state = progress.diagramme[u.id];
  const status = diagrammStatus(state);
  const slots = useMemo(() => slotsVon(u), [u]);
  // Jeder Besuch beginnt leer – eine Wiederholung soll nicht die alte Lösung zeigen.
  const [belegung, setBelegung] = useState<Eingesetzt>({});
  const [auswahl, setAuswahl] = useState<string | null>(null);
  const [ergebnis, setErgebnis] = useState<(DiagrammErgebnis & { regeln: string[] }) | null>(null);
  const [hinweise, setHinweise] = useState(0);
  const [loesungOffen, setLoesungOffen] = useState(false);
  const [ziehen, setZiehen] = useState<{ element: string; x: number; y: number; ueber: string | null } | null>(null);
  const druck = useRef<{ element: string; x: number; y: number; id: number } | null>(null);

  const liste = diagrammUebungen(content);
  const idx = liste.indexOf(u);
  const danach = [...liste.slice(idx + 1), ...liste.slice(0, idx)];
  const naechste = danach.find((x) => diagrammStatus(progress.diagramme[x.id]) !== 'geloest') ?? danach[0];

  const setze = (b: Eingesetzt) => {
    setBelegung(b);
    setErgebnis(null);
  };
  const lege = (element: string, slot: string) => {
    setze(einsetzen(u, belegung, element, slot));
    setAuswahl(null);
  };
  const aufSlot = (slot: string) => {
    if (auswahl) return lege(auswahl, slot);
    if (belegung[slot]) {
      // Belegte Lücke ohne Auswahl antippen: Element herausnehmen und zum Weitersetzen auswählen.
      const { [slot]: element, ...rest } = belegung;
      setze(rest);
      setAuswahl(element);
    }
  };

  // Esc bricht die Auswahl ab.
  useEffect(() => {
    if (!auswahl) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAuswahl(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [auswahl]);

  // Ziehen mit Pointer Events: erst ab 6 px Bewegung, sonst gilt es als Antippen (onClick).
  const slotUnter = (x: number, y: number) =>
    (document.elementFromPoint(x, y)?.closest('[data-slot]') as HTMLElement | null)?.dataset.slot ?? null;
  const onPointerDown = (element: string) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    druck.current = { element, x: e.clientX, y: e.clientY, id: e.pointerId };
    // Sofort einfangen: Sonst verlässt der Zeiger den Knopf, bevor das Ziehen beginnt, und die Bewegungen kommen nicht mehr an.
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = druck.current;
    if (!d || d.id !== e.pointerId) return;
    if (!ziehen && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) return;
    setZiehen({ element: d.element, x: e.clientX, y: e.clientY, ueber: slotUnter(e.clientX, e.clientY) });
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = druck.current;
    druck.current = null;
    if (!d || !ziehen) return;
    const slot = slotUnter(e.clientX, e.clientY);
    setZiehen(null);
    if (slot) lege(d.element, slot);
    e.preventDefault();
  };
  const istGezogen = useRef(false);
  istGezogen.current = !!ziehen;

  const benutzt = new Set(Object.values(belegung));
  const frei = u.palette.filter((p) => p.mehrfach || !benutzt.has(p.id));
  const offen = slots.filter((s) => !belegung[s]).length;

  const pruefen = () => {
    const r = bewerteDiagramm(u, belegung);
    setErgebnis({ ...r, regeln: formregeln(u, belegung) });
    update((p) => recordDiagrammCheck(p, u.id, r.ok));
  };
  const hinweis = () => {
    setHinweise((h) => h + 1);
    update((p) => recordDiagrammHint(p, u.id));
  };
  const zeigeLoesung = async () => {
    const ok = await confirm({
      title: 'Lösung zeigen?',
      message: 'Die Lücken werden mit der Musterlösung gefüllt. Die Übung zählt dann als „mit Lösung“ und kommt morgen zur Wiederholung.',
      confirmLabel: 'Lösung zeigen',
    });
    if (!ok) return;
    setBelegung(musterBelegung(u));
    setErgebnis(null);
    setLoesungOffen(true);
    update((p) => recordDiagrammLoesung(p, u.id));
  };
  const element = (id: string) => u.palette.find((p) => p.id === id);

  return (
    <div className="page diagramm-page paper-sheet">
      <p className="crumbs">
        <Link to="/diagramme">Diagramm-Übungen</Link> / {DIAGRAMM_TYP_NAMEN[u.typ]}
      </p>
      <h1>{u.titel}</h1>
      <div className="task-card">
        <div className="task-head">
          <span className="task-code sql-code">{u.id}</span>
          <span className="badge">{STUFEN[u.stufe]}</span>
          <span className="badge muted">{DIAGRAMM_TYP_NAMEN[u.typ]}</span>
          {status !== 'offen' && <span className="badge">{STATUS_LABELS[status]}</span>}
          {u.quelle && <span className="muted small">{u.quelle}</span>}
        </div>
        <Markdown source={false}>{u.szenario}</Markdown>
        <p className="hint">
          {u.stufe === 1 ? 'Setze die passenden Elemente in die Lücken.' : 'Bring die Schritte in die richtige Reihenfolge.'} Ziehen oder
          tippen: erst ein Element, dann die Lücke. Eine belegte Lücke antippen nimmt das Element wieder heraus.
        </p>
      </div>

      <div className="diagramm-arbeit">
        <div className="diagramm-scroll">
          <DiagrammSvg
            uebung={u}
            eingesetzt={belegung}
            ergebnis={ergebnis?.slots}
            ziel={ziehen?.ueber ?? null}
            auswahl={!!auswahl}
            onSlot={aufSlot}
          />
        </div>

        <section className="diagramm-palette" aria-label="Elemente">
          <h2 className="small">
            Elemente
            {auswahl && <span className="muted"> – „{element(auswahl)?.text}“ ausgewählt, jetzt eine Lücke antippen (Esc bricht ab)</span>}
          </h2>
          <div className="palette-liste">
            {frei.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`palette-element${auswahl === p.id ? ' gewaehlt' : ''}${ziehen?.element === p.id ? ' wird-gezogen' : ''}`}
                aria-pressed={auswahl === p.id}
                title={formName(p.form)}
                onClick={() => {
                  if (istGezogen.current) return;
                  setAuswahl((a) => (a === p.id ? null : p.id));
                }}
                onPointerDown={onPointerDown(p.id)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={() => {
                  druck.current = null;
                  setZiehen(null);
                }}
              >
                <FormSymbol form={p.form} />
                <span>{p.text}</span>
                <span className="sr-only"> ({formName(p.form)})</span>
              </button>
            ))}
            {!frei.length && <p className="muted small">Alle Elemente sind eingesetzt.</p>}
          </div>
        </section>
      </div>

      {ziehen && (
        <div className="zieh-element" style={{ left: ziehen.x, top: ziehen.y }} aria-hidden="true">
          {element(ziehen.element)?.text}
        </div>
      )}

      <div className="actions">
        <button type="button" onClick={pruefen} disabled={offen === slots.length}>
          <Icon name="circle-check" /> Prüfen{offen > 0 && offen < slots.length ? ` (${offen} leer)` : ''}
        </button>
        {u.hinweise.length > 0 && (
          <button type="button" className="secondary" onClick={hinweis} disabled={hinweise >= u.hinweise.length}>
            <Icon name="lightbulb" /> Hinweis ({hinweise}/{u.hinweise.length})
          </button>
        )}
        <button type="button" className="secondary" onClick={() => void zeigeLoesung()} disabled={loesungOffen}>
          <Icon name="eye" /> Lösung zeigen
        </button>
        <button type="button" className="ghost" onClick={() => setze({})} disabled={!Object.keys(belegung).length}>
          <Icon name="rotate-ccw" /> Leeren
        </button>
      </div>

      {hinweise > 0 && (
        <div className="card info">
          <ol className="hints">
            {u.hinweise.slice(0, hinweise).map((h) => (
              <li key={h}>
                <Markdown source={false}>{h}</Markdown>
              </li>
            ))}
          </ol>
        </div>
      )}

      {ergebnis && (
        <div className={`card ${ergebnis.ok ? 'success' : 'verdict-fail'}`} role="status">
          <div className="verdict-row">
            <p className={`verdict ${ergebnis.ok ? 'ok' : 'bad'}`}>
              <Icon name={ergebnis.ok ? 'circle-check' : 'circle-x'} />{' '}
              {ergebnis.ok
                ? 'Alles richtig!'
                : `Noch nicht: ${ergebnis.richtig} von ${ergebnis.gesamt} Lücken richtig. Die falschen sind rot markiert.`}
            </p>
            {ergebnis.ok && naechste && (
              <Link className="button" to={`/diagramme/${naechste.id}`}>
                Weiter →
              </Link>
            )}
          </div>
          {ergebnis.regeln.length > 0 && (
            <ul className="diagramm-regeln">
              {ergebnis.regeln.map((r) => (
                <li key={r}>
                  <Icon name="triangle-alert" /> {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {(ergebnis?.ok || loesungOffen) && u.erklaerung && (
        <section className="card">
          <h2>
            <Icon name="book-open" /> Erklärung
          </h2>
          <Markdown source={false}>{u.erklaerung}</Markdown>
        </section>
      )}

      {naechste && !ergebnis?.ok && (
        <p className="hint">
          <Link to={`/diagramme/${naechste.id}`}>Nächste Übung: {naechste.titel} →</Link>
        </p>
      )}
    </div>
  );
}
