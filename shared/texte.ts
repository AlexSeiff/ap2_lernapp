// Lernblatt-Texte getrennt vom Kern (Umsetzungsplan Phase 10): Die Abschnittstexte machen gut ein Drittel des Inhalts aus, gebraucht
// werden sie aber nur auf der Lernblatt-Seite, im Glossar, auf Begriffsseiten und in der Suche. content.json bzw. /api/content enthält
// deshalb nur den Kern (Abschnitte ohne Text); die Texte liegen je Thema in texte/<id>.json bzw. /api/texte/<id> und werden nachgeladen.
// Rein, ohne Dateizugriff; getestet in tests/texte.test.ts.

import type { Content, Section, Topic } from './types.ts';

/** Abschnitt ohne Text – so steht er im Kern. */
export type SectionKopf = Omit<Section, 'markdown'>;
export type KernTopic = Omit<Topic, 'sections'> & { sections: SectionKopf[] };
/** Inhalt ohne Abschnittstexte (content.json). Ein vollständiger `Content` ist auch ein `KernInhalt`. */
export type KernInhalt = Omit<Content, 'topics'> & { topics: KernTopic[] };

/** Texte eines Themas: Abschnitts-id → Markdown. */
export type ThemaTexte = Record<string, string>;

/** Teilt den Inhalt in Kern und Texte je Thema (Build und lokaler Server). Das Original bleibt unverändert. */
export function teileInhalt(content: Content): { kern: KernInhalt; texte: Record<string, ThemaTexte> } {
  const texte: Record<string, ThemaTexte> = {};
  const topics = content.topics.map((t) => {
    texte[t.id] = Object.fromEntries(t.sections.map((s) => [s.id, s.markdown]));
    return { ...t, sections: t.sections.map(({ markdown: _markdown, ...kopf }) => kopf) };
  });
  return { kern: { ...content, topics }, texte };
}

/** Hat jeder Abschnitt dieses Themas seinen Text? */
export const themaHatTexte = (t: KernTopic): t is Topic => t.sections.every((s) => typeof (s as Partial<Section>).markdown === 'string');

/** Ist das ein vollständiger Inhalt (alle Texte da)? So ist es z. B. in Tests oder nach dem Zusammensetzen. */
export const istVoll = (c: KernInhalt): c is Content => c.topics.every(themaHatTexte);

/** Setzt die Texte eines Themas ein. Fehlt ein Text (Kern und Texte aus verschiedenen Ständen), gibt es einen Fehler statt leerer Abschnitte. */
export function themaMitTexten(t: KernTopic, texte: ThemaTexte): Topic {
  return {
    ...t,
    sections: t.sections.map((s) => {
      const markdown = texte[s.id];
      if (typeof markdown !== 'string') throw new Error(`Text zu Abschnitt ${s.id} fehlt – bitte die Seite neu laden.`);
      return { ...s, markdown };
    }),
  };
}

/** Setzt alle Texte ein (`texte` je Thema-id). */
export function inhaltMitTexten(kern: KernInhalt, texte: Record<string, ThemaTexte>): Content {
  return { ...kern, topics: kern.topics.map((t) => (themaHatTexte(t) ? t : themaMitTexten(t, texte[t.id] ?? {}))) };
}
