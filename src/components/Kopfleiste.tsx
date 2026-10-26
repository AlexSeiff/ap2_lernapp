import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IS_STATIC } from '../lib/api';
import {
  aktiverBereich,
  aktivesUnterziel,
  badgeSumme,
  bereich,
  BEREICHE,
  type Bereich,
  type NavBadge,
  sichtbareZiele,
} from '../lib/navigation';
import { Icon } from './Icon';
import { Seitenleiste } from './Seitenleiste';

type Props = {
  onSuche: () => void;
  badges: Record<NavBadge, number>;
  saveText: string;
  saveState: string;
};

const Badge = ({ n }: { n: number }) => (n > 0 ? <span className="nav-badge">{n}</span> : null);

/** Tastenkürzel der Suche passend zum Gerät (⌘K auf Apple-Geräten, sonst Strg K). */
function suchKuerzel(): string {
  if (typeof navigator === 'undefined') return 'Strg K';
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Strg K';
}

/**
 * Kopfleiste (Umsetzungsplan Phase 2): Logo → Übersicht, die vier Bereiche, Suche und Speicherstatus; darunter die Unterleiste des
 * aktiven Bereichs. Unter 600 px blendet CSS die Bereiche aus (die stehen dann in der Tab-Bar unten) und zeigt den Bereichstitel.
 */
export function Kopfleiste({ onSuche, badges, saveText, saveState }: Props) {
  const { pathname } = useLocation();
  const aktiv = aktiverBereich(pathname);
  const problem = saveState === 'fehler' || saveState === 'konflikt';
  const ziel = aktiv ? aktivesUnterziel(pathname, bereich(aktiv)) : undefined;
  return (
    <>
      <Seitenleiste badges={badges} onSuche={onSuche} />
      <header className="kopf">
        <div className="kopf-innen">
          <Link to="/" className={`kopf-logo${pathname === '/' ? ' active' : ''}`} aria-current={pathname === '/' ? 'page' : undefined}>
            <Icon name="graduation-cap" />
            <span className="kopf-logo-text">AP2 Lern-App</span>
          </Link>
          <span className="kopf-titel" aria-hidden="true">
            {aktiv ? bereich(aktiv).label : 'AP2 Lern-App'}
          </span>
          <div className="toolbar-kontext" aria-hidden="true">
            <Icon name={aktiv ? bereich(aktiv).icon : 'house'} />
            <span>{aktiv ? bereich(aktiv).label : 'Dein Lernraum'}</span>
            <Icon name="chevron-right" />
            <b>{ziel?.label ?? 'Übersicht'}</b>
          </div>
          <nav className="kopf-bereiche" aria-label="Bereiche">
            {BEREICHE.map((b) => {
              const n = badgeSumme(sichtbareZiele(b, IS_STATIC), badges);
              return (
                <Link
                  key={b.id}
                  to={b.to}
                  className={`kopf-${b.id}${aktiv === b.id ? ' active' : ''}`}
                  aria-current={aktiv === b.id ? 'page' : undefined}
                  title={b.label}
                >
                  <Icon name={b.icon} />
                  <span className="kopf-label">{b.label}</span>
                  <Badge n={n} />
                  {n > 0 && <span className="sr-only">, {n} fällig</span>}
                </Link>
              );
            })}
          </nav>
          <div className="kopf-rechts">
            <span className={`save-state ${saveState}`} role="status" title={saveText}>
              <span className={problem ? '' : 'sr-only'}>{saveText}</span>
            </span>
            <button type="button" className="suche-knopf" onClick={onSuche} title={`Suchen (${suchKuerzel()})`}>
              <Icon name="search" />
              <span className="kopf-label">Suchen</span>
              <kbd className="kopf-label" aria-hidden="true">
                {suchKuerzel()}
              </kbd>
            </button>
          </div>
        </div>
      </header>
      {aktiv && <Unterleiste b={bereich(aktiv)} pathname={pathname} badges={badges} />}
    </>
  );
}

/** Unterziele des aktiven Bereichs als Papierregister; auf dem Handy wischbar, das aktive Ziel wird in die Mitte gerollt. */
function Unterleiste({ b, pathname, badges }: { b: Bereich; pathname: string; badges: Record<NavBadge, number> }) {
  const aktiv = aktivesUnterziel(pathname, b);
  const leiste = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = leiste.current;
    const el = box?.querySelector<HTMLElement>('a.active');
    if (!box || !el || box.scrollWidth <= box.clientWidth) return;
    box.scrollLeft = el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2;
  }, [aktiv]);
  return (
    <nav className="unterleiste" aria-label={b.label}>
      <div className="unterleiste-innen" ref={leiste}>
        {sichtbareZiele(b, IS_STATIC).map((z) => (
          <Link key={z.to} to={z.to} className={z === aktiv ? 'active' : ''} aria-current={z === aktiv ? 'page' : undefined}>
            <Icon name={z.icon} /> {z.label}
            {z.badge && <Badge n={badges[z.badge]} />}
          </Link>
        ))}
      </div>
    </nav>
  );
}
