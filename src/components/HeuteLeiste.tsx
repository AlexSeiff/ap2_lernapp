import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useHeuteSitzung } from '../hooks/useHeute';
import { HEUTE_ICONS } from '../lib/heute';
import { abonniereFertig, aktuellerSchritt, holeSitzung, istFertig, setzeSitzung, weiter } from '../lib/heuteSitzung';
import { useStore } from '../lib/store';
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
  const { progress } = useStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [geschafft, setGeschafft] = useState<string | undefined>(); // Schlüssel des Schritts, der gerade als geschafft gilt
  const kartenStand = useRef<{ key: string; reviews: number } | undefined>(undefined);

  const naechster = useCallback(() => {
    const aktuell = holeSitzung();
    if (!aktuell) return;
    const next = weiter(aktuell);
    setzeSitzung(next);
    setGeschafft(undefined);
    navigate(istFertig(next) ? '/heute' : aktuellerSchritt(next)!.link);
    window.scrollTo(0, 0);
  }, [navigate]);

  // Aufgabe gespeichert / Übung richtig gelöst → der aktuelle Schritt ist geschafft.
  useEffect(
    () =>
      abonniereFertig((id) => {
        const schritt = holeSitzung() && aktuellerSchritt(holeSitzung()!);
        if (schritt && schritt.art !== 'karten' && schritt.ids.includes(id)) setGeschafft(schritt.key);
      }),
    [],
  );

  // Karten: geschafft, sobald jede Karte des Blocks seit Beginn des Schritts bewertet wurde.
  const schritt = sitzung && !istFertig(sitzung) ? aktuellerSchritt(sitzung) : undefined;
  const bewertet = schritt?.art === 'karten' ? schritt.ids.reduce((n, id) => n + (progress.cards[id]?.reviews ?? 0), 0) : 0;
  useEffect(() => {
    if (!schritt || schritt.art !== 'karten') return;
    if (kartenStand.current?.key !== schritt.key) kartenStand.current = { key: schritt.key, reviews: bewertet };
    else if (bewertet - kartenStand.current.reviews >= schritt.ids.length) setGeschafft(schritt.key);
  }, [schritt, bewertet]);

  const schrittKey = schritt?.key;
  const istGeschafft = !!schrittKey && geschafft === schrittKey;
  useEffect(() => {
    if (!istGeschafft) return;
    const t = setTimeout(naechster, AUTO_WEITER_MS);
    return () => clearTimeout(t);
  }, [istGeschafft, naechster]);

  if (!sitzung || !schritt || pathname === '/heute') return null;
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
        {sitzung.index + 1 < sitzung.items.length ? 'Weiter →' : 'Fertig ✓'}
      </button>
    </div>
  );
}
