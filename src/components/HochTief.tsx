import { teileHochTief } from '../lib/hochTief';

/** Klartext mit Hoch- und Tiefstellung („e^(−z)“, „x_i“) – für Stellen ohne Markdown, z. B. die Antworten im Leicht-Modus. */
export function HochTief({ text }: { text: string }) {
  const teile = teileHochTief(text);
  if (teile.length === 1 && !teile[0].art) return text;
  return teile.map((t, i) => (t.art === 'sup' ? <sup key={i}>{t.text}</sup> : t.art === 'sub' ? <sub key={i}>{t.text}</sub> : t.text));
}
