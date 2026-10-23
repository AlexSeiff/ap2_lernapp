// Leicht-Modus: Auswahlantworten als Knöpfe (Karteikarten und Rechenübungen). Nach der Wahl: richtige grün, gewählte falsche rot.

import { HochTief } from './HochTief';

export function LeichtOptionen(props: {
  optionen: { text: string; richtig: boolean }[];
  gewaehlt: number | null;
  onWaehle: (i: number) => void;
  /** Tasten 1–4 anzeigen (nur bei der Auswahl, die gerade per Tastatur bedient wird). */
  tasten?: boolean;
  label: string;
}) {
  const { optionen, gewaehlt, onWaehle, tasten, label } = props;
  const fertig = gewaehlt !== null;
  return (
    <div className="leicht-optionen" role="group" aria-label={label}>
      {optionen.map((o, i) => {
        const cls = fertig ? (o.richtig ? 'richtig' : i === gewaehlt ? 'falsch' : '') : '';
        return (
          <button
            key={i}
            type="button"
            className={`leicht-option ${cls} ${i === gewaehlt ? 'gewaehlt' : ''}`}
            disabled={fertig}
            aria-pressed={i === gewaehlt}
            onClick={() => onWaehle(i)}
          >
            {tasten && !fertig && <kbd>{i + 1}</kbd>}
            {fertig && (o.richtig ? '✓ ' : i === gewaehlt ? '✗ ' : '')}
            <HochTief text={o.text} />
          </button>
        );
      })}
    </div>
  );
}
