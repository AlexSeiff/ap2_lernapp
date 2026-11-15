import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useHeuteSitzung } from '../hooks/useHeute';
import { HEUTE_ICONS, type HeuteItem } from '../lib/heute';
import {
  abonniereFertig,
  aktuellerSchritt,
  holeSitzung,
  istFertig,
  offeneSchritte,
  setzeSitzung,
  weiter,
  type HeuteSitzung,
} from '../lib/heuteSitzung';
import { useStartStore } from '../lib/store';
import { Icon } from './Icon';

/** So lange zeigt die Leiste „geschafft“, bevor sie von selbst zum nächsten Schritt führt (Zeit, das Ergebnis zu sehen). */
const AUTO_WEITER_MS = 1800;

/**
 * Leiste über jeder Seite, solange eine „Heute lernen“-Runde läuft (ROADMAP 8.1): zeigt den aktuellen Schritt und führt mit
 * „Weiter →“ zum nächsten – bei Aufgaben, Übungen und Karten automatisch, sobald der Schritt geschafft ist.
 * Die Seiten selbst bleiben bis auf die Meldung „fertig“ (meldeFertig) unverändert – gelernt wird wie sonst auch.
 */
export function HeuteLeiste() {
  const sitzung = useHeuteSitzung();
  const schritt = sitzung && aktuellerSchritt(sitzung);
  if (!sitzung || !schritt) return null;
  // Ein wieder geöffneter Schritt beginnt mit einem neuen Bewertungsstand und ohne ausstehenden Timer.
  return <SchrittLeiste key={schritt.key} sitzung={sitzung} schritt={schritt} />;
}

function SchrittLeiste({ sitzung, schritt }: { sitzung: HeuteSitzung; schritt: HeuteItem }) {
  const { progress } = useStartStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [geschafft, setGeschafft] = useState(false);

  const naechster = useCallback(() => {
    const aktuell = holeSitzung();
    if (!aktuell || aktuellerSchritt(aktuell) !== schritt) return;
    const next = weiter(aktuell);
    setzeSitzung(next);
    navigate(istFertig(next) ? '/heute' : aktuellerSchritt(next)!.link);
    window.scrollTo(0, 0);
  }, [navigate, schritt]);

  // Aufgabe gespeichert / Übung richtig gelöst → der aktuelle Schritt ist geschafft.
  useEffect(
    () =>
      abonniereFertig((id) => {
        if (schritt.art !== 'karten' && schritt.ids.includes(id)) setGeschafft(true);
      }),
    [schritt],
  );

  // Karten: geschafft, sobald jede Karte des Blocks seit Beginn des Schritts bewertet wurde.
  const bewertet = schritt.art === 'karten' ? schritt.ids.reduce((n, id) => n + (progress.cards[id]?.reviews ?? 0), 0) : 0;
  const [bewertungenAmStart] = useState(bewertet);
  const istGeschafft =
    geschafft || (schritt.art === 'karten' && schritt.ids.length > 0 && bewertet - bewertungenAmStart >= schritt.ids.length);
  useEffect(() => {
    if (!istGeschafft) return;
    const t = setTimeout(naechster, AUTO_WEITER_MS);
    return () => clearTimeout(t);
  }, [istGeschafft, naechster]);

  if (pathname === '/heute') return null;
  return (
    <div className="heute-leiste no-print" role="region" aria-label="Heute lernen">
      <span>
        <Link to="/heute">
          <Icon name="play" /> Heute lernen
        </Link>{' '}
        · Schritt {sitzung.index + 1}/{sitzung.items.length}:{' '}
        <Link to={schritt.link}>
          <Icon name={HEUTE_ICONS[schritt.art]} /> {schritt.titel}
        </Link>
        {istGeschafft && <b role="status"> · ✓ Geschafft – weiter …</b>}
      </span>
      <button type="button" onClick={naechster}>
        {offeneSchritte(sitzung).length > 1 ? 'Weiter →' : 'Fertig ✓'}
      </button>
    </div>
  );
}
