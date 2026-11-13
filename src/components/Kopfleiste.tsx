import { useEffect, useRef, type RefObject } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { aktiverBereich, aktivesUnterziel, badgeSumme, bereich, BEREICHE, type Bereich, type NavBadge } from '../lib/navigation';
import { Icon } from './Icon';

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
 * Merkt an einer waagerecht rollbaren Leiste, ob links bzw. rechts noch Reiter außerhalb des Sichtbereichs liegen
 * (`data-mehr-links`, `data-mehr-rechts`). Das CSS blendet danach die Rollpfeile ein. Direkt am Element statt im
 * React-Zustand – beim Rollen soll nichts neu gerendert werden. `inhalt` löst eine neue Messung aus, wenn die Reiter wechseln.
 */
function useRollHinweis(leiste: RefObject<HTMLElement | null>, inhalt: string) {
  useEffect(() => {
    const box = leiste.current;
    if (!box) return;
    const messen = () => {
      box.toggleAttribute('data-mehr-links', box.scrollLeft > 4);
      box.toggleAttribute('data-mehr-rechts', box.scrollLeft + box.clientWidth < box.scrollWidth - 4);
    };
    messen();
    box.addEventListener('scroll', messen, { passive: true });
    // Fehlt in sehr alten Browsern und in der Testumgebung – dann bleibt es bei der Messung beim Rollen.
    const groesse = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(messen);
    groesse?.observe(box);
    return () => {
      box.removeEventListener('scroll', messen);
      groesse?.disconnect();
    };
  }, [leiste, inhalt]);
}

/**
 * Rollpfeil am Rand einer Leiste: zeigt, dass dort noch Reiter liegen, und rollt sie auf Klick herein. Nicht in der
 * Tab-Reihenfolge – mit der Tastatur erreicht man die Reiter direkt, der Browser rollt sie dabei selbst ins Bild.
 */
function RollPfeil({ seite, leiste }: { seite: 'links' | 'rechts'; leiste: RefObject<HTMLElement | null> }) {
  const rollen = () => {
    const box = leiste.current;
    if (!box) return;
    const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.scrollBy({ left: (seite === 'links' ? -1 : 1) * box.clientWidth * 0.7, behavior: ruhig ? 'auto' : 'smooth' });
  };
  return (
    <span className={`roll-rand ${seite}`}>
      <button
        type="button"
        className="roll-pfeil"
        tabIndex={-1}
        aria-label={seite === 'links' ? 'Weitere Reiter links zeigen' : 'Weitere Reiter rechts zeigen'}
        onMouseDown={(e) => e.preventDefault()}
        onClick={rollen}
      >
        <Icon name="chevron-right" />
      </button>
    </span>
  );
}

/**
 * Notizbuchregister mit Übersicht und Bereichen; darunter die Ziele des aktiven Bereichs.
 */
export function Kopfleiste({ onSuche, badges, saveText, saveState }: Props) {
  const { pathname } = useLocation();
  const aktiv = aktiverBereich(pathname);
  const problem = saveState === 'fehler' || saveState === 'konflikt';
  const ziel = aktiv ? aktivesUnterziel(pathname, bereich(aktiv)) : undefined;
  const register = useRef<HTMLElement>(null);
  useEffect(() => {
    const box = register.current;
    const el = box?.querySelector<HTMLElement>('a.active');
    if (!box || !el || box.scrollWidth <= box.clientWidth) return;
    box.scrollLeft += el.getBoundingClientRect().left - box.getBoundingClientRect().left - (box.clientWidth - el.clientWidth) / 2;
  }, [aktiv, pathname]);
  useRollHinweis(register, 'bereiche');
  return (
    <>
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
          <nav ref={register} className="kopf-bereiche" aria-label="Bereiche">
            <Link to="/" className={`kopf-start${pathname === '/' ? ' active' : ''}`} aria-current={pathname === '/' ? 'page' : undefined}>
              <Icon name="house" />
              <span className="kopf-label">Übersicht</span>
            </Link>
            {BEREICHE.map((b) => {
              const n = badgeSumme(b.unter, badges);
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
            <RollPfeil seite="links" leiste={register} />
            <RollPfeil seite="rechts" leiste={register} />
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
    box.scrollLeft += el.getBoundingClientRect().left - box.getBoundingClientRect().left - (box.clientWidth - el.clientWidth) / 2;
  }, [aktiv]);
  useRollHinweis(leiste, b.id);
  return (
    <nav className="unterleiste" aria-label={b.label}>
      <div className="unterleiste-innen" ref={leiste}>
        {b.unter.map((z) => (
          <Link key={z.to} to={z.to} className={z === aktiv ? 'active' : ''} aria-current={z === aktiv ? 'page' : undefined}>
            <Icon name={z.icon} /> {z.label}
            {z.badge && <Badge n={badges[z.badge]} />}
          </Link>
        ))}
        <RollPfeil seite="links" leiste={leiste} />
        <RollPfeil seite="rechts" leiste={leiste} />
      </div>
    </nav>
  );
}
