// Beziehungsdiagramm eines Tabellenschemas (Anordnung: lib/schemaDiagramm.ts): Tabellen als Kästen, Primärschlüssel unterstrichen,
// Fremdschlüssel mit ↑ und einer Linie zum Primärschlüssel der Zieltabelle (n … 1). Farben aus den Theme-Variablen (hell und dunkel).

import { useMemo } from 'react';
import { KOPF, schemaLayout } from '../lib/schemaDiagramm';
import type { Tabelle } from '../lib/tabellenEditor';

const RAND = 14;

export function SchemaDiagramm({ tabellen, titel }: { tabellen: Tabelle[]; titel: string }) {
  const l = useMemo(() => schemaLayout(tabellen), [tabellen]);
  if (!l.kaesten.length) return null;
  const breite = l.breite + 2 * RAND;
  const hoehe = l.hoehe + 2 * RAND;
  return (
    <div className="schema-diagramm">
      <svg
        viewBox={`${-RAND} ${-RAND} ${breite} ${hoehe}`}
        width={breite}
        style={{ maxWidth: '100%', height: 'auto' }}
        role="img"
        aria-label={`${titel}: ${l.kaesten.map((k) => k.name).join(', ')}`}
      >
        {l.linien.map((li, i) => (
          <g key={`l${i}`} className="sd-linie">
            <title>{li.titel}</title>
            <path d={li.d} />
            <text x={li.n.x} y={li.n.y} textAnchor="middle">
              n
            </text>
            <text x={li.eins.x} y={li.eins.y} textAnchor="middle">
              1
            </text>
          </g>
        ))}
        {l.kaesten.map((k) => (
          <g key={k.name + k.x + k.y} className="sd-kasten" transform={`translate(${k.x} ${k.y})`}>
            <rect width={k.w} height={k.h} rx={6} />
            <path className="sd-kopf" d={`M 0 ${KOPF} V 6 Q 0 0 6 0 H ${k.w - 6} Q ${k.w} 0 ${k.w} 6 V ${KOPF} Z`} />
            <line x1={0} x2={k.w} y1={KOPF} y2={KOPF} />
            <text className="sd-name" x={k.w / 2} y={KOPF / 2 + 5} textAnchor="middle">
              {k.name}
            </text>
            {k.zeilen.map((z, i) => (
              <text key={i} className={`sd-spalte${z.pk ? ' pk' : ''}${z.fk ? ' fk' : ''}`} x={RAND} y={z.y + 4}>
                {z.text}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
