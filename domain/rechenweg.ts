// Rechenweg: Datentyp und reine Formatierung für strukturierte Lösungen von Rechenaufgaben
// (Anzeige: src/components/Rechenweg.tsx; die Rechenübungen aus ROADMAP Phase 5 liefern ihre `schritte` in diesem Format).

/** Ein Schritt eines Rechenwegs: Formel → Einsetzen → Ergebnis. */
export interface RechenSchritt {
  /** Was berechnet wird, z. B. „Arithmetisches Mittel“. */
  titel: string;
  /** Allgemeine Formel in LaTeX, z. B. `\bar{x} = \frac{\sum x_i}{n}`. */
  formel: string;
  /** Formel mit eingesetzten Zahlen in LaTeX, z. B. `\bar{x} = \frac{770}{11}` (Zahlen z. B. mit `latexZahl`). */
  einsetzen?: string;
  /** Exakter Wert (ungerundet); angezeigt wird er gerundet auf `runden` Nachkommastellen. */
  ergebnis: number;
  /** Einheit, z. B. „min“, „%“, „€“, „Tage“. */
  einheit?: string;
  /** Nachkommastellen der Anzeige. Ohne Angabe: so viele wie nötig, höchstens `MAX_STELLEN`. */
  runden?: number;
  /** Optionaler Zusatz, z. B. die verwendete Quartils-Konvention. */
  hinweis?: string;
}

/** Höchstens so viele Nachkommastellen, wenn `runden` fehlt. */
export const MAX_STELLEN = 4;

function formatter(runden?: number): Intl.NumberFormat {
  return new Intl.NumberFormat(
    'de-DE',
    runden === undefined ? { maximumFractionDigits: MAX_STELLEN } : { minimumFractionDigits: runden, maximumFractionDigits: runden },
  );
}

/** Zahl im deutschen Format (1.080,50), Minus als „−“; mit `runden` genau so viele Nachkommastellen. */
export function formatZahl(wert: number, runden?: number): string {
  const s = formatter(runden).format(wert);
  // „-0,00“ (gerundet) als „0,00“ zeigen; sonst typografisches Minus wie in den Lernblättern.
  return /^-0(,0*)?$/.test(s) ? s.slice(1) : s.replace(/^-/, '−');
}

/** Ergebnis mit Einheit: „70,00 min“, „93,33 %“ (Leerzeichen vor der Einheit, auch vor %). */
export function formatErgebnis(schritt: Pick<RechenSchritt, 'ergebnis' | 'einheit' | 'runden'>): string {
  const zahl = formatZahl(schritt.ergebnis, schritt.runden);
  return schritt.einheit ? `${zahl} ${schritt.einheit}` : zahl;
}

/** Hinweis, wenn die Anzeige gerundet ist („gerundet auf 2 Nachkommastellen“), sonst undefined. */
export function rundungsHinweis(wert: number, runden?: number): string | undefined {
  const stellen = runden ?? MAX_STELLEN;
  const faktor = 10 ** stellen;
  const gerundet = Math.round(wert * faktor) / faktor;
  if (Math.abs(gerundet - wert) <= Math.abs(wert) * 1e-12) return undefined;
  if (stellen === 0) return 'gerundet auf eine ganze Zahl';
  return `gerundet auf ${stellen} ${stellen === 1 ? 'Nachkommastelle' : 'Nachkommastellen'}`;
}

/** Zahl für LaTeX im deutschen Format: Dezimalkomma als `{,}` (sonst setzt KaTeX ein Leerzeichen dahinter), Minus als `-`. */
export function latexZahl(wert: number, runden?: number): string {
  return formatZahl(wert, runden).replace('−', '-').replace(',', '{,}');
}
