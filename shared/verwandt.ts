// Verwandte Begriffskarten (Umsetzungsplan Phase 5): Welche Begriffe werden mit einem Begriff verwechselt? Quelle sind die Begriffsseiten –
// die Begriffe aus „Abgrenzung“ (Tabellenköpfe, erste Spalte, Fettgedrucktes) und aus „Siehe auch“. Ergebnis landet beim Laden des Inhalts
// an den Begriffskarten (Flashcard.abgrenzung, .siehe, .abschnitt), damit der Leicht-Modus ohne die nachgeladenen Seiten auskommt.

import { namensSchluessel } from './begriffsseiten.ts';
import type { BegriffsSeite, Flashcard } from './types.ts';

/** Text ohne Fett- und Code-Markierung, ohne Links. */
const klar = (s: string) =>
  s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|`/g, '')
    .trim();

/** Abschnitt „### Abgrenzung“ einer Seite (bis zur nächsten ###-Überschrift), leer, wenn es keinen gibt. */
export function abgrenzungsText(markdown: string): string {
  const m = /^###\s+Abgrenzung\s*$([\s\S]*?)(?=^###\s|(?![\s\S]))/m.exec(markdown);
  return m ? m[1] : '';
}

/**
 * Namen, die im Abschnitt „Abgrenzung“ gegeneinander gestellt werden: Kopfzeile und erste Spalte jeder Tabelle, dazu fett gesetzte Wörter
 * im Fließtext. Reihenfolge wie im Text, ohne Doppelte. Ob ein Name ein Begriff ist, entscheidet erst der Abgleich mit den Karten.
 */
export function abgrenzungsNamen(markdown: string): string[] {
  const namen: string[] = [];
  let tabellenZeile = 0;
  for (const zeile of abgrenzungsText(markdown).split('\n')) {
    const t = zeile.trim();
    if (!t.startsWith('|')) {
      tabellenZeile = 0;
      for (const m of t.matchAll(/\*\*([^*]+)\*\*/g)) namen.push(klar(m[1]));
      continue;
    }
    tabellenZeile++;
    if (/^\|[\s:|-]+\|$/.test(t)) continue; // Trennzeile |---|---|
    const zellen = t
      .replace(/^\||\|$/g, '')
      .split('|')
      .map(klar);
    if (tabellenZeile === 1) namen.push(...zellen);
    else if (zellen[0]) namen.push(zellen[0]);
  }
  return [...new Set(namen.filter((n) => n && n.length <= 60))];
}

/**
 * Ergänzt an jeder Begriffskarte (typ „begriff“) mit Begriffsseite:
 * - `abgrenzung`: ids anderer Begriffskarten aus „Abgrenzung“, `siehe`: aus „Siehe auch“ (ohne die Karte selbst, ohne Doppelte –
 *   was schon in `abgrenzung` steht, fehlt in `siehe`);
 * - `abschnitt`: die erste „Mehr:“-Angabe der Seite (z. B. „Deep Dive 1, 2.1“) – Karten aus demselben Abschnitt gelten als ähnlich.
 * Ein Name passt zu einer Karte, wenn er (ohne Klammerzusatz) ihrer Frage oder Begriff bzw. „Auch“-Variante ihrer Seite entspricht.
 * Gibt neue Kartenobjekte zurück; Karten ohne Seite bleiben unverändert.
 */
export function ergaenzeVerwandte(cards: Flashcard[], seiten: BegriffsSeite[]): Flashcard[] {
  const begriffskarten = cards.filter((c) => c.typ === 'begriff');
  const karteNachName = new Map<string, string>();
  for (const c of begriffskarten) {
    const k = namensSchluessel(c.question);
    if (k && !karteNachName.has(k)) karteNachName.set(k, c.id);
  }
  const karteDerSeite = new Map<BegriffsSeite, string>();
  for (const s of seiten) {
    const id = [s.begriff, ...(s.auch ?? [])].map((n) => karteNachName.get(namensSchluessel(n))).find(Boolean);
    if (id) karteDerSeite.set(s, id);
  }
  // Auch-Varianten führen zur Karte ihrer Seite („Primary Key“ → Primärschlüssel), ohne vorhandene Namen zu überschreiben.
  for (const [s, id] of karteDerSeite)
    for (const n of [s.begriff, ...(s.auch ?? [])]) {
      const k = namensSchluessel(n);
      if (k && !karteNachName.has(k)) karteNachName.set(k, id);
    }

  const zusatz = new Map<string, Pick<Flashcard, 'abgrenzung' | 'siehe' | 'abschnitt'>>();
  for (const [s, id] of karteDerSeite) {
    const karten = (namen: string[], ohne: Set<string>) => [
      ...new Set(namen.map((n) => karteNachName.get(namensSchluessel(n))).filter((x): x is string => !!x && !ohne.has(x))),
    ];
    const abgrenzung = karten(abgrenzungsNamen(s.markdown), new Set([id]));
    const siehe = karten(s.siehe, new Set([id, ...abgrenzung]));
    const abschnitt = s.mehr[0]?.trim();
    zusatz.set(id, {
      ...(abgrenzung.length ? { abgrenzung } : {}),
      ...(siehe.length ? { siehe } : {}),
      ...(abschnitt ? { abschnitt } : {}),
    });
  }
  return cards.map((c) => (zusatz.has(c.id) ? { ...c, ...zusatz.get(c.id) } : c));
}
