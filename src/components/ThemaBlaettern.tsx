import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSeitenWischen } from '../hooks/useSeitenWischen';
import { Icon } from './Icon';

export interface BlaetternZiel {
  to: string;
  titel: string;
}

/**
 * „Voriges / Nächstes“ am Ende eines Lernblatts oder einer Begriffsseite. Dieselbe Richtung gilt für Wischen (links = weiter) und
 * Pfeiltasten (hooks/useSeitenWischen.ts). `aktuell` (Id der Seite) setzt nach dem Blättern die Ansicht wieder nach oben.
 */
export function ThemaBlaettern({
  aktuell,
  zurueck,
  weiter,
  art,
}: {
  aktuell: string;
  zurueck?: BlaetternZiel;
  weiter?: BlaetternZiel;
  art: 'Thema' | 'Begriff';
}) {
  const navigate = useNavigate();
  useSeitenWischen(zurueck ? () => navigate(zurueck.to) : undefined, weiter ? () => navigate(weiter.to) : undefined);
  // Beim Seitenwechsel oben anfangen – nicht beim ersten Anzeigen (dort setzen Lesestelle und Sprungmarken die Position).
  const erste = useRef(true);
  useEffect(() => {
    if (erste.current) {
      erste.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [aktuell]);

  if (!zurueck && !weiter) return null;
  return (
    <nav
      className="blaettern-seiten no-print"
      aria-label={art === 'Thema' ? 'Zwischen den Themen blättern' : 'Zwischen den Begriffen blättern'}
    >
      {zurueck ? (
        <Link to={zurueck.to} rel="prev" className="blaettern-zurueck">
          <span className="blaettern-richtung">
            <Icon name="skip-back" /> {art === 'Thema' ? 'Voriges Thema' : 'Voriger Begriff'}
          </span>
          <span className="blaettern-titel">{zurueck.titel}</span>
        </Link>
      ) : (
        <span />
      )}
      {weiter ? (
        <Link to={weiter.to} rel="next" className="blaettern-weiter">
          <span className="blaettern-richtung">
            {art === 'Thema' ? 'Nächstes Thema' : 'Nächster Begriff'} <Icon name="skip-forward" />
          </span>
          <span className="blaettern-titel">{weiter.titel}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
