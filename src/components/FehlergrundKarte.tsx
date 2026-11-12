import { Link } from 'react-router-dom';
import { FEHLERGRUND_INFO, fehlerStatistik } from '../lib/fehlergruende';
import { useStartStore } from '../lib/store';
import { Icon } from './Icon';

/** Häufigste Fehlergründe (ROADMAP 8.7) mit Tipp – auch auf der Übersicht. */
export function FehlergrundKarte() {
  const { progress } = useStartStore();
  const s = fehlerStatistik(progress.attempts);
  if (!s.anzahl) return null;
  const top = s.haeufigster ? FEHLERGRUND_INFO[s.haeufigster] : undefined;
  return (
    <section className="card">
      <h2>
        <Icon name="puzzle" /> Woran es meistens liegt
      </h2>
      {top ? (
        <p>
          Häufigster Grund:{' '}
          <b>
            <Icon name={top.icon} /> {top.label}
          </b>{' '}
          ({s.je[0].anzahl} von {s.anzahl}). {top.tipp} <Link to={top.link.to}>{top.link.text} →</Link>
        </p>
      ) : (
        <p>Kein Grund überwiegt – {s.je.map((x) => `${FEHLERGRUND_INFO[x.grund].label} ${x.anzahl}×`).join(' · ')}.</p>
      )}
      {top && s.je.length > 1 && (
        <p className="muted small">{s.je.map((x) => `${FEHLERGRUND_INFO[x.grund].label} ${x.anzahl}×`).join(' · ')}</p>
      )}
      <p className="hint">Den Grund wählst du nach der Selbstbewertung einer Aufgabe unter voller Punktzahl („Woran lag&apos;s?“).</p>
    </section>
  );
}
