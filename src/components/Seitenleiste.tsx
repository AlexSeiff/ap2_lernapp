import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IS_STATIC } from '../lib/api';
import { aktiverBereich, aktivesUnterziel, BEREICHE, sichtbareZiele, type NavBadge } from '../lib/navigation';
import { Icon } from './Icon';

/** Alle Lernwerkzeuge an einem Ort; Routen und gespeicherte Lernstände bleiben unverändert. */
export function Seitenleiste({ badges, onSuche }: { badges: Record<NavBadge, number>; onSuche: () => void }) {
  const { pathname } = useLocation();
  const aktiv = aktiverBereich(pathname);
  const register = useRef<HTMLElement>(null);
  useEffect(() => {
    const box = register.current;
    const ziel = box?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!box || !ziel || !box.clientHeight) return;
    const rahmen = box.getBoundingClientRect();
    const zeile = ziel.getBoundingClientRect();
    if (zeile.top < rahmen.top) box.scrollTop += zeile.top - rahmen.top - 8;
    else if (zeile.bottom > rahmen.bottom) box.scrollTop += zeile.bottom - rahmen.bottom + 8;
  }, [pathname]);
  return (
    <aside className="seitenleiste" aria-label="Lernraum">
      <Link className="seitenleiste-marke" to="/">
        <span className="app-marke">
          <Icon name="graduation-cap" />
        </span>
        <span>
          AP2<span className="marke-untertitel">Dein Lernnotizbuch</span>
        </span>
      </Link>
      <button type="button" className="seitenleiste-suche" onClick={onSuche}>
        <Icon name="search" /> <span>Alles durchsuchen</span>
        <kbd>⌕</kbd>
      </button>
      <p className="register-titel">Inhaltsverzeichnis</p>
      <nav ref={register} className="seitenleiste-navigation" aria-label="Alle Lernbereiche">
        <Link
          to="/"
          className={`seitenleiste-ziel${pathname === '/' ? ' active' : ''}`}
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          <Icon name="house" />
          <span>Übersicht</span>
        </Link>
        {BEREICHE.map((b, index) => {
          const ziel = aktiv === b.id ? aktivesUnterziel(pathname, b) : undefined;
          return (
            <section className={`seitenleiste-gruppe gruppe-${b.id}`} key={b.id}>
              <h2>
                <span className="register-nummer" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {b.label}
              </h2>
              {sichtbareZiele(b, IS_STATIC).map((z) => (
                <Link
                  key={z.to}
                  to={z.to}
                  className={`seitenleiste-ziel${ziel === z ? ' active' : ''}`}
                  aria-current={ziel === z ? 'page' : undefined}
                >
                  <Icon name={z.icon} />
                  <span>{z.label}</span>
                  {z.badge && badges[z.badge] > 0 && (
                    <span className="seitenleiste-zahl" aria-label={`${badges[z.badge]} fällig`}>
                      {badges[z.badge]}
                    </span>
                  )}
                </Link>
              ))}
            </section>
          );
        })}
      </nav>
      <div className="seitenleiste-fuss">
        <span className="lernraum-punkt" /> In deinem Tempo. Schritt für Schritt.
      </div>
    </aside>
  );
}
