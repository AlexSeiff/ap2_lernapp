import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { aktiverBereich, aktivesUnterziel, badgeSumme, bereich, BEREICHE, type NavBadge } from '../lib/navigation';
import { Icon } from './Icon';

// Rahmen des Notizbuchs (notizbuch.css): links die Inhaltsseite, in der Mitte die Ringe, rechts das Blatt mit Kopfzeile und Seite,
// am Buchrand die Haftstreifen der Bereiche. Auf dem Handy: ein Spiralblock, die Haftstreifen unten, die Inhaltsseite als Einschub.

type Badges = Record<NavBadge, number>;

/** Tastenkürzel der Suche passend zum Gerät (⌘K auf Apple-Geräten, sonst Strg K). */
function suchKuerzel(): string {
  if (typeof navigator === 'undefined') return 'Strg K';
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Strg K';
}

/** Datum wie von Hand oben aufs Blatt geschrieben: „Fr., 13.11.2026“. */
const datumHeute = () => new Date().toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });

/**
 * Linke Buchseite: Etikett und Inhaltsverzeichnis. Auf der Übersicht stehen alle Bereiche, sonst nur der aktive – unter seinem
 * aktiven Ziel ist Platz für die Abschnitte der offenen Seite (lib/inhaltSlot.ts). Auf dem Handy ein Einschub von links.
 */
export function Inhaltsseite({
  badges,
  offen,
  onSchliessen,
  slotRef,
}: {
  badges: Badges;
  offen: boolean;
  onSchliessen: () => void;
  slotRef: (el: HTMLElement | null) => void;
}) {
  const { pathname } = useLocation();
  const aktiv = aktiverBereich(pathname);
  const ziel = aktiv ? aktivesUnterziel(pathname, bereich(aktiv)) : undefined;
  const gruppen = aktiv ? [bereich(aktiv)] : BEREICHE;
  useEffect(() => {
    if (!offen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSchliessen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [offen, onSchliessen]);
  return (
    <>
      <aside id="inhaltsseite" className={`inhaltsseite seite${offen ? ' offen' : ''}`} aria-label="Inhaltsverzeichnis">
        <div className="inhaltsseite-innen">
          <button type="button" className="inhalt-zu" onClick={onSchliessen}>
            <Icon name="x" /> Schließen
          </button>
          <Link to="/" className="etikett" aria-current={pathname === '/' ? 'page' : undefined}>
            <b>AP2 Lern-App</b>
            <span>Abschlussprüfung Teil 2</span>
            <span>Daten- und Prozessanalyse</span>
          </Link>
          {gruppen.map((b) => (
            <nav key={b.id} className="inhalt-gruppe" aria-label={b.label}>
              <p className="inhalt-titel">{b.label}</p>
              <ul className="inhalt">
                {b.unter.map((z) => {
                  const n = z.badge ? badges[z.badge] : 0;
                  const hier = z === ziel;
                  return [
                    <li key={z.to} className={hier ? 'hier' : undefined}>
                      <Link to={z.to} aria-current={hier ? 'page' : undefined}>
                        {z.label}
                      </Link>
                      {n > 0 && <small className="faellig">{n} fällig</small>}
                    </li>,
                    hier && <li key="abschnitte" className="inhalt-abschnitte" ref={slotRef} />,
                  ];
                })}
              </ul>
            </nav>
          ))}
        </div>
      </aside>
      {offen && <div className="inhalt-schleier" onClick={onSchliessen} aria-hidden="true" />}
    </>
  );
}

/** Haftstreifen am Buchrand (auf dem Handy unten): Übersicht und die vier Bereiche, mit der Zahl der fälligen Wiederholungen. */
export function Register({ badges }: { badges: Badges }) {
  const { pathname } = useLocation();
  const aktiv = aktiverBereich(pathname);
  const start = pathname === '/';
  return (
    <nav className="register" aria-label="Bereiche">
      <Link to="/" className={`streifen s-uebersicht${start ? ' active' : ''}`} aria-current={start ? 'page' : undefined}>
        <Icon name="house" />
        <span className="streifen-name">Übersicht</span>
      </Link>
      {BEREICHE.map((b) => {
        const n = badgeSumme(b.unter, badges);
        return (
          <Link
            key={b.id}
            to={b.to}
            className={`streifen s-${b.id}${aktiv === b.id ? ' active' : ''}`}
            aria-current={aktiv === b.id ? 'page' : undefined}
          >
            <Icon name={b.icon} />
            <span className="streifen-name">{b.label}</span>
            {n > 0 && (
              <>
                <span className="streifen-zahl" aria-hidden="true">
                  {n}
                </span>
                <span className="sr-only">, {n} fällig</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** Oberste Zeile des Blatts: wo man ist, Datum, Speicherstand und Suche; auf dem Handy der Knopf zur Inhaltsseite. */
export function Kopfzeile({
  onSuche,
  onInhalt,
  inhaltOffen,
  saveText,
  saveState,
}: {
  onSuche: () => void;
  onInhalt: () => void;
  inhaltOffen: boolean;
  saveText: string;
  saveState: string;
}) {
  const { pathname } = useLocation();
  const aktiv = aktiverBereich(pathname);
  const ziel = aktiv ? aktivesUnterziel(pathname, bereich(aktiv)) : undefined;
  const problem = saveState === 'fehler' || saveState === 'konflikt';
  return (
    <header className="kopfzeile">
      <button type="button" className="inhalt-knopf" onClick={onInhalt} aria-expanded={inhaltOffen} aria-controls="inhaltsseite">
        <Icon name="list" /> Inhalt
      </button>
      <p className="pfad">
        {aktiv ? (
          <>
            {bereich(aktiv).label}
            {ziel && ziel.label !== bereich(aktiv).label && (
              <>
                {' › '}
                <b>{ziel.label}</b>
              </>
            )}
          </>
        ) : (
          <b>{pathname === '/' ? 'Übersicht' : 'AP2 Lern-App'}</b>
        )}
      </p>
      <span className="kopfzeile-rechts">
        <span className="datum" aria-hidden="true">
          {datumHeute()}
        </span>
        <span className={`save-state ${saveState}`} role="status" title={saveText}>
          <span className={problem ? '' : 'sr-only'}>{saveText}</span>
        </span>
        <button type="button" className="suche-knopf" onClick={onSuche} title={`Suchen (${suchKuerzel()})`}>
          <Icon name="search" />
          <span className="suche-name">Suchen</span>
          <kbd aria-hidden="true">{suchKuerzel()}</kbd>
        </button>
      </span>
    </header>
  );
}
