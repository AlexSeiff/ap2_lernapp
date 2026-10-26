import { Link, useLocation } from 'react-router-dom';
import { IS_STATIC } from '../lib/api';
import type { IconName } from '../lib/icons';
import { aktiverBereich, badgeSumme, BEREICHE, type NavBadge, sichtbareZiele } from '../lib/navigation';
import { Icon } from './Icon';

/**
 * Papierregister unten für Handys: Übersicht und die vier Bereiche, mit dem Daumen
 * erreichbar. Die Unterziele des Bereichs stehen oben in der Unterleiste (components/Kopfleiste.tsx). Per CSS ist sie nur auf dem Handy
 * sichtbar.
 */
export function MobileNav({ badges }: { badges: Record<NavBadge, number> }) {
  const { pathname } = useLocation();
  const aktiv = aktiverBereich(pathname);
  const tab = (to: string, istAktiv: boolean, icon: IconName, label: string, badge = 0) => (
    <Link key={to} to={to} className={istAktiv ? 'active' : ''} aria-current={istAktiv ? 'page' : undefined}>
      <span className="bn-icon" aria-hidden="true">
        <Icon name={icon} />
        {badge > 0 && <span className="nav-badge">{badge}</span>}
      </span>
      <span className="bn-label">{label}</span>
      {badge > 0 && <span className="sr-only">, {badge} fällig</span>}
    </Link>
  );
  return (
    <nav className="bottom-nav" aria-label="Navigation">
      <div className="bn-bar">
        {tab('/', pathname === '/', 'house', 'Übersicht')}
        {BEREICHE.map((b) => tab(b.to, aktiv === b.id, b.icon, b.kurz, badgeSumme(sichtbareZiele(b, IS_STATIC), badges)))}
      </div>
    </nav>
  );
}
