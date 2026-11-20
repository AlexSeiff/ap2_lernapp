import type { PointerEvent as ReactPointerEvent } from 'react';
import { useId } from 'react';
import {
  beschriftungsPunkt,
  type DiagrammAntwort,
  type EditorKante,
  type EditorKnoten,
  istBehaelter,
  kantenLinien,
  knotenName,
  mitte,
  NOTATIONEN,
  umriss,
  waechter,
} from '../../lib/diagrammEditor';
import { FormZeichnung } from './FormZeichnung';
import type { Auswahl } from './typen';

interface ZeichnungProps {
  antwort: DiagrammAntwort;
  auswahl?: Auswahl;
  knotenDruck?: (k: EditorKnoten) => (e: ReactPointerEvent<SVGGElement>) => void;
  kanteDruck?: (e: EditorKante) => (ev: ReactPointerEvent<SVGGElement>) => void;
  griffDruck?: (k: EditorKnoten, art: 'groesse' | 'linie') => (e: ReactPointerEvent<SVGElement>) => void;
  onFokus?: (id: string) => void;
}

export function Zeichnung({ antwort, auswahl, knotenDruck, kanteDruck, griffDruck, onFokus }: ZeichnungProps) {
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
