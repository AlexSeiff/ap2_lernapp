import type { CSSProperties } from 'react';
import { HEUTE_ICONS, type HeuteItem } from '../lib/heute';
import { Icon } from './Icon';

const ART_TEXT: Record<HeuteItem['art'], string> = {
  wiederholung: 'Fehlerjournal',
  // Nicht „schwächstes Thema“: die zweite Aufgabe kommt aus dem am längsten nicht geübten Thema.
  aufgabe: 'neue Aufgabe',
  sql: 'SQL-Übung',
  rechnen: 'Rechenübung',
  diagramm: 'Diagramm-Übung',
  karten: 'Karteikarten',
};

export function HeuteSchritte({
  items,
  index,
  onAbhaken,
  erledigt = [],
  uebersprungen = [],
}: {
  items: HeuteItem[];
  index?: number;
  onAbhaken?: () => void;
  erledigt?: string[];
  uebersprungen?: string[];
}) {
  return (
    <ol className="heute-liste" aria-label="Schritte der Tagesrunde">
      {items.map((it, i) => {
        const status = erledigt.includes(it.key)
          ? 'erledigt'
          : uebersprungen.includes(it.key)
            ? 'übersprungen'
            : i === index
              ? 'aktuell'
              : '';
        const beschriftung = (
          <span>
            {status && <span className="sr-only">{status}: </span>}
            <Icon name={HEUTE_ICONS[it.art]} /> {it.titel}
            <span className="muted small">
              {' '}
              · {ART_TEXT[it.art]} · ~{Math.max(1, Math.round(it.minuten))} min
            </span>
          </span>
        );
        return (
          <li key={it.key} className={status === 'aktuell' ? 'aktuell' : status ? 'erledigt' : ''} style={{ '--i': i } as CSSProperties}>
            {onAbhaken ? (
              <label>
                <input type="checkbox" checked={status === 'erledigt'} disabled={i !== index} onChange={onAbhaken} />
                {beschriftung}
              </label>
            ) : (
              <>
                <span className="heute-status" aria-hidden="true">
                  {status && <Icon name={status === 'erledigt' ? 'check' : status === 'übersprungen' ? 'skip-forward' : 'play'} />}
                </span>
                {beschriftung}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
