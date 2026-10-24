import { Link } from 'react-router-dom';
import type { Flashcard } from '../../shared/types';
import { kartenstand, STAENDE, STAND_TEXT } from '../lib/kartenstand';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

/**
 * Kurzfassung des Kartenstands (pages/Kartenstand.tsx) für eine Kartenauswahl: schmaler Farbbalken und je Gruppe ein Link
 * „✓ 117 gewusst · ~ 15 unsicher · ✗ 131 nicht gewusst“. `thema` gibt den Filter an die Seite weiter.
 */
export function KartenstandLeiste({ cards, thema }: { cards: Flashcard[]; thema?: string }) {
  const { progress } = useStore();
  const stand = kartenstand(cards, progress);
  const bewertet = stand.gesamt - stand.neu;
  if (!bewertet) return null;
  const ziel = (s?: string) => {
    const q = new URLSearchParams();
    if (s) q.set('stand', s);
    if (thema && thema !== 'alle') q.set('thema', thema);
    const suche = q.toString();
    return suche ? `/karteikarten/stand?${suche}` : '/karteikarten/stand';
  };
  return (
    <nav className="stand-leiste" aria-label="Kartenstand">
      <div className="verteilung-balken schmal" aria-hidden="true">
        {STAENDE.map(
          (s) => stand.gruppen[s].length > 0 && <span key={s} className={`vb-${s}`} style={{ flexGrow: stand.gruppen[s].length }} />,
        )}
        {stand.neu > 0 && <span className="vb-neu" style={{ flexGrow: stand.neu }} />}
      </div>
      <ul>
        {STAENDE.map((s) => (
          <li key={s}>
            <Link to={ziel(s)} className={`stand-chip stand-${s}`}>
              {STAND_TEXT[s].zeichen} <b>{stand.gruppen[s].length}</b> {STAND_TEXT[s].kurz}
            </Link>
          </li>
        ))}
        <li>
          <Link to={ziel()} className="stand-chip mehr">
            <Icon name="chart-column" /> Kartenstand
          </Link>
        </li>
      </ul>
    </nav>
  );
}
