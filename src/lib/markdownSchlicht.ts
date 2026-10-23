// Schneller Weg für <Markdown> (Umsetzungsplan Phase 10): Ein einzeiliger Text ohne jedes Markdown-Zeichen wird zu genau einem <p>
// mit demselben Text – dafür muss react-markdown nicht erst parsen. Das spart z. B. im Glossar (über 1000 Erklärungen) den Großteil
// der Renderzeit. tests/performance.test.ts prüft für alle passenden Texte aus content/, dass die Ausgabe gleich bleibt.

/**
 * Würde Markdown (mit GFM) aus diesem Text etwas anderes als einen einzigen Absatz mit genau diesem Text machen? Ausgeschlossen sind
 * alle Zeichen für Hervorhebung, Code, Links, Bilder, HTML, Entities, Tabellen, Formeln, Hochstellung (^, lib/hochTief.ts), Durchstreichen und Escapes, GFM-Autolinks
 * (www., ://, @), Zeilenumbrüche, Zeilenanfänge von Listen, Zitaten, Überschriften und Setext-Linien sowie Leerraum am Rand.
 */
export function istSchlicht(text: string): boolean {
  return !/[\\*_^`[\]<>!#~|$&@\n\r]|:\/\/|www\./i.test(text) && !/^(?:[-+>=]|\d+[.)])/.test(text) && text.trim() === text && text !== '';
}
