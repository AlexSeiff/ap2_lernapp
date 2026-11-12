// Thema „Glossar & Diagramme“ (Deep Dive 17): Das Blatt enthält nur den Platzhalter GLOSSAR_PLATZHALTER. Beim Laden des Inhalts
// (build/inhalt.ts, also für Entwicklungsserver, Build und Tests gleich) wird an seiner Stelle das komplette Glossar eingesetzt –
// ein Abschnitt je Anfangsbuchstabe, gebaut mit baueGlossar(). So ist die Liste nie veraltet, wenn sich Karten oder Blätter ändern.
// Die Zeilen enthalten keinen Fettdruck: baueGlossar() liest Begriffe nur aus fetten Stellen, die eingesetzte Liste verändert das
// Glossar also nicht (sonst würde jeder Begriff zusätzlich auf diese Liste verweisen).

import type { Content, Section } from '../../shared/types.ts';
import { baueGlossar, glossarBuchstaben, type GlossarEintrag } from './glossar.ts';

export const GLOSSAR_PLATZHALTER = '<!-- glossar-a-z -->';

/** Fundstellen eines Eintrags kurz: „DD 3, DD 7“ (Karten und Abschnitte desselben Deep Dive zählen einmal). */
function fundstellen(e: GlossarEintrag): string {
  const dd = new Set<string>();
  for (const q of e.quellen) {
    const m = /Deep Dive (\d+)/.exec(q.titel);
    if (m) dd.add(`DD ${m[1]}`);
    else if (/SQL-Zusatz/.test(q.titel)) dd.add('SQL-Zusatz');
  }
  return [...dd].join(', ');
}

/** Eine Listenzeile: Begriff – Definition (einzeilig, ohne Fettdruck) *(Fundstellen)*; mit Begriffsseite ist der Begriff ein Link darauf. */
export function glossarZeile(e: GlossarEintrag, mitSeite = false): string {
  const def = e.definition
    ?.replace(/\*\*|__/g, '')
    .replace(/\s*\n\s*(?:[-*]\s+)?/g, ' ')
    .trim();
  const wo = fundstellen(e);
  const name = mitSeite ? `[${e.begriff.replace(/[[\]]/g, (k) => `\\${k}`)}](#/glossar/${encodeURIComponent(e.id)})` : e.begriff;
  return `- ${name}${def ? ` – ${def}` : ''}${wo ? ` *(${wo})*` : ''}`;
}

/** Setzt das Glossar an die Stelle des Platzhalters (verändert `content`). */
export function ergaenzeGlossarThema(content: Content): void {
  for (const topic of content.topics) {
    const idx = topic.sections.findIndex((s) => s.markdown.includes(GLOSSAR_PLATZHALTER));
    if (idx < 0) continue;
    const eintraege = baueGlossar(content);
    const seiten = new Set((content.begriffe ?? []).map((b) => b.id));
    const basis = topic.sections[idx];
    const mitDefinition = eintraege.filter((e) => e.definition).length;
    basis.markdown = basis.markdown.replace(
      GLOSSAR_PLATZHALTER,
      `Zurzeit ${eintraege.length.toLocaleString('de-DE')} Begriffe, ${mitDefinition.toLocaleString('de-DE')} davon mit Erklärung. In Klammern steht, in welchem Deep Dive der Begriff vorkommt.`,
    );
    const neu: Section[] = glossarBuchstaben(eintraege)
      .filter((b) => b.anzahl > 0)
      .map(({ buchstabe }) => ({
        id: `${topic.id}-begriffe-${buchstabe === '#' ? 'ziffern' : buchstabe.toLowerCase()}`,
        title: buchstabe === '#' ? 'Begriffe 0–9' : `Begriffe ${buchstabe}`,
        level: basis.level + 1,
        generiert: true as const,
        markdown: eintraege
          .filter((e) => e.buchstabe === buchstabe)
          .map((e) => glossarZeile(e, seiten.has(e.id)))
          .join('\n'),
      }));
    topic.sections.splice(idx + 1, 0, ...neu);
    return;
  }
}
