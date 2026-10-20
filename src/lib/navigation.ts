// Navigation (Umsetzungsplan Phase 2): vier Bereiche – Lernen, Glossar, SQL-Editor, Einstellungen – mit Unterzielen.
// Desktop: Kopfleiste oben mit Unterleiste; Handy (unter 600 px): Tab-Bar unten (Übersicht + die vier Bereiche).
// Rein, ohne React – die Komponenten stehen in components/Kopfleiste.tsx und components/MobileNav.tsx.
// Keine URL hat sich geändert: Die Bereiche ordnen nur die bestehenden Routen.

import type { IconName } from './icons';

export type NavBadge = 'sql' | 'rechnen' | 'diagramme' | 'journal';

export type NavZiel = {
  to: string;
  icon: IconName;
  label: string;
  badge?: NavBadge;
  /** Nur in der lokalen App (KI). */
  nurLokal?: boolean;
  /** Nur genau dieser Pfad (z. B. `/sql`, nicht `/sql/uebungen`). */
  genau?: boolean;
};

export type BereichId = 'lernen' | 'glossar' | 'sql' | 'einstellungen';

export interface Bereich {
  id: BereichId;
  /** Ziel beim Klick auf den Bereich. */
  to: string;
  icon: IconName;
  label: string;
  /** Kurzform für die Tab-Bar. */
  kurz: string;
  unter: NavZiel[];
}

/** Thema „Glossar & Diagramme“ (Deep Dive 17): gehört zum Bereich Glossar. */
export const GLOSSAR_PFAD = '/lernen/17';

export const BEREICHE: Bereich[] = [
  {
    id: 'lernen',
    to: '/lernen',
    icon: 'book-open',
    label: 'Lernen',
    kurz: 'Lernen',
    unter: [
      { to: '/heute', icon: 'play', label: 'Heute lernen' },
      { to: '/lernen', icon: 'book-open', label: 'Themen' },
      { to: '/karteikarten', icon: 'layers', label: 'Karteikarten' },
      { to: '/aufgaben', icon: 'file-pen-line', label: 'Einzelaufgaben' },
      { to: '/rechnen', icon: 'calculator', label: 'Rechenübungen', badge: 'rechnen' },
      { to: '/diagramme', icon: 'workflow', label: 'Diagramm-Übungen', badge: 'diagramme' },
      { to: '/klausur', icon: 'timer', label: 'Übungsklausur' },
      { to: '/fehlerjournal', icon: 'notebook-pen', label: 'Fehlerjournal', badge: 'journal' },
      { to: '/fachgespraech', icon: 'mic', label: 'Fachgespräch' },
    ],
  },
  {
    id: 'glossar',
    to: '/glossar',
    icon: 'book-bookmark',
    label: 'Glossar',
    kurz: 'Glossar',
    unter: [
      { to: '/glossar', icon: 'library', label: 'Begriffe A–Z' },
      { to: GLOSSAR_PFAD, icon: 'book-bookmark', label: 'Diagramme' },
      { to: '/material/formeln', icon: 'sigma', label: 'Formelsammlung' },
      { to: '/material/sql-belegsatz', icon: 'database', label: 'SQL-Belegsatz' },
      { to: '/material/operatoren', icon: 'message-square-quote', label: 'Operatoren' },
    ],
  },
  {
    id: 'sql',
    to: '/sql',
    icon: 'database',
    label: 'SQL-Editor',
    kurz: 'SQL',
    unter: [
      { to: '/sql', icon: 'pencil', label: 'Freier Editor', genau: true },
      { to: '/sql/uebungen', icon: 'target', label: 'Übungen', badge: 'sql' },
    ],
  },
  {
    id: 'einstellungen',
    to: '/einstellungen',
    icon: 'settings',
    label: 'Einstellungen',
    kurz: 'Einstellungen',
    unter: [
      { to: '/einstellungen', icon: 'settings', label: 'Einstellungen' },
      { to: '/material', icon: 'library', label: 'Material' },
      { to: '/daten', icon: 'save', label: 'Daten & Import' },
      { to: '/generator', icon: 'sparkles', label: 'KI-Aufgaben', nurLokal: true },
    ],
  },
];

/** Gehört der Pfad zu diesem Ziel? `/aufgaben` umfasst auch `/aufgabe/:id`, `/sql/uebungen` auch `/sql/uebung/:id` usw. */
export function passtZuZiel(to: string, pathname: string): boolean {
  if (to === '/') return pathname === '/';
  if (to === '/aufgaben' && pathname.startsWith('/aufgabe/')) return true;
  if (to === '/sql/uebungen' && pathname.startsWith('/sql/uebung/')) return true;
  return pathname === to || pathname.startsWith(`${to}/`);
}

/** Seiten unter /material, die zum Glossar gehören (Nachschlagen); alles andere unter /material gehört zu den Einstellungen. */
const GLOSSAR_MATERIAL = ['/material/glossar', '/material/formeln', '/material/sql-belegsatz', '/material/operatoren'];
const LERNEN = [
  '/heute',
  '/lernen',
  '/karteikarten',
  '/aufgaben',
  '/rechnen',
  '/diagramme',
  '/klausur',
  '/fehlerjournal',
  '/fachgespraech',
];
const EINSTELLUNGEN = ['/material', '/einstellungen', '/daten', '/generator'];

/** Zu welchem Bereich gehört der Pfad? Die Übersicht (`/`) und unbekannte Pfade gehören zu keinem. */
export function aktiverBereich(pathname: string): BereichId | undefined {
  if (pathname === '/') return undefined;
  if ([GLOSSAR_PFAD, '/glossar', ...GLOSSAR_MATERIAL].some((to) => passtZuZiel(to, pathname))) return 'glossar';
  if (EINSTELLUNGEN.some((to) => passtZuZiel(to, pathname))) return 'einstellungen';
  if (passtZuZiel('/sql', pathname)) return 'sql';
  if (LERNEN.some((to) => passtZuZiel(to, pathname))) return 'lernen';
  return undefined;
}

export const bereich = (id: BereichId): Bereich => BEREICHE.find((b) => b.id === id)!;

/** Unterziele eines Bereichs, ohne die nur lokalen in der Pages-Version. */
export const sichtbareZiele = (b: Bereich, statisch: boolean): NavZiel[] => b.unter.filter((z) => !(z.nurLokal && statisch));

/** Das hervorgehobene Unterziel: das mit dem längsten passenden Pfad (`/lernen/17` gehört nicht zu „Themen“). */
export function aktivesUnterziel(pathname: string, b: Bereich): NavZiel | undefined {
  const passend = b.unter.filter((z) => {
    if (z.genau) return pathname === z.to;
    if (z.to === '/lernen' && passtZuZiel(GLOSSAR_PFAD, pathname)) return false;
    if (z.to === '/material' && GLOSSAR_MATERIAL.some((to) => passtZuZiel(to, pathname))) return false;
    return passtZuZiel(z.to, pathname);
  });
  return passend.sort((a, c) => c.to.length - a.to.length)[0];
}

/** Summe der fälligen Wiederholungen einer Ziel-Liste (Badge am Bereich). */
export function badgeSumme(ziele: NavZiel[], badges: Record<NavBadge, number>): number {
  return ziele.reduce((s, z) => s + (z.badge ? badges[z.badge] : 0), 0);
}
