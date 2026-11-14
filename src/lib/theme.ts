// Farbschema (System / Hell / Dunkel): je Gerät im localStorage (Schlüssel „theme“), nicht im Fortschritt.
// Angewendet als data-theme am <html> – beim Start in main.tsx, beim Umschalten in den Einstellungen (hooks/useTheme.ts).

export type Theme = 'system' | 'light' | 'dark';

export const THEMES: { id: Theme; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Hell' },
  { id: 'dark', label: 'Dunkel' },
];

const istTheme = (x: unknown): x is Theme => x === 'system' || x === 'light' || x === 'dark';

export function leseTheme(): Theme {
  try {
    const t = localStorage.getItem('theme');
    return istTheme(t) ? t : 'system';
  } catch {
    return 'system';
  }
}

export function wendeThemeAn(theme: Theme): void {
  if (theme === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* ohne Speicher einfach nicht merken */
  }
}

export const KARO_STAERKEN = { kraeftig: 'Kräftig', dezent: 'Dezent', aus: 'Aus' } as const;
export type KaroStaerke = keyof typeof KARO_STAERKEN;
const KARO_SPEICHER = 'ap2-karo';

export function leseKaro(): KaroStaerke {
  try {
    const wert = localStorage.getItem(KARO_SPEICHER);
    if (wert === 'kraeftig' || wert === 'aus') return wert;
  } catch {
    /* Ohne Browserspeicher gilt die normale Linienstärke. */
  }
  return 'dezent';
}

export function wendeKaroAn(karo: KaroStaerke): void {
  document.documentElement.dataset.karo = karo;
  try {
    localStorage.setItem(KARO_SPEICHER, karo);
  } catch {
    /* Die Auswahl wirkt auch ohne Speicher bis zum Neuladen. */
  }
}
