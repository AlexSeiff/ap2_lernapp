import type { CSSProperties } from 'react';

// Zeichnungen wie von Hand ins karierte Heft (notizbuch.css): Fortschritt als ausgemalte Kästchen, Tage als Strichliste.

type Farbe = 'blau' | 'rot' | 'gruen';

/** Anteil (0–1) je Kästchen: 1 = ganz ausgemalt, dazwischen = so weit von links, 0 = leer. */
export function kaestchenFuellung(anteil: number, von: number): number[] {
  const a = Math.max(0, Math.min(1, anteil));
  return Array.from({ length: von }, (_, i) => {
    const f = Math.max(0, Math.min(1, a * von - i));
    return f < 0.04 ? 0 : f > 0.96 ? 1 : f; // Haarstriche und fast volle Kästchen runden – sie sähen nach Fehler aus
  });
}

/**
 * Fortschrittsbalken aus ausgemalten Kästchen, die genau auf dem Karo der Seite liegen. Zwei Fassungen im Markup: 20 Kästchen für
 * breite Spalten, 10 für schmale (Handy) – das CSS zeigt je nach Platz eine davon. `label` beschreibt den Wert für Screenreader.
 */
export function Kaestchen({ anteil, label, farbe = 'blau' }: { anteil: number; label: string; farbe?: Farbe }) {
  const reihe = (von: number, klasse: string) => (
    <span className={`kaestchen ${klasse}`}>
      {kaestchenFuellung(anteil, von).map((f, i) => (
        <i
          key={i}
          className={f === 1 ? 'voll' : f > 0 ? 'teil' : undefined}
          style={f > 0 && f < 1 ? ({ '--f': f } as CSSProperties) : undefined}
        />
      ))}
    </span>
  );
  return (
    <span className={`kaestchen-balken k-${farbe}`} role="img" aria-label={label}>
      {reihe(20, 'breit')}
      {reihe(10, 'schmal')}
    </span>
  );
}

/** Höchstens so viele Striche werden gezeichnet – mehr passen nicht auf die Haftnotiz; die Zahl steht ohnehin daneben. */
const STRICHE_MAX = 20;

/** Strichliste: je fünf Tage ein Bündel aus vier Strichen und einem Querstrich. Rein dekorativ (die Zahl steht im Text). */
export function Strichliste({ n }: { n: number }) {
  const anzahl = Math.max(0, Math.min(STRICHE_MAX, Math.floor(n)));
  if (!anzahl) return null;
  const buendel = Array.from({ length: Math.ceil(anzahl / 5) }, (_, i) => Math.min(5, anzahl - i * 5));
  return (
    <span className="strichliste" aria-hidden="true">
      {buendel.map((striche, i) => (
        <svg key={i} viewBox="0 0 30 26" width="30" height="26">
          {Array.from({ length: Math.min(4, striche) }, (_, s) => (
            <path key={s} d={`M${5 + s * 6} 3 L${4 + s * 6} 23`} />
          ))}
          {striche === 5 && <path d="M1 19 L28 6" />}
        </svg>
      ))}
    </span>
  );
}
