import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { namensSchluessel, parseBegriffsseiten, pruefeBegriffsseiten } from '../shared/begriffsseiten.ts';
import { buildContent } from '../shared/parser.ts';
import { parseQuellen, pruefeQuellenZiele } from '../shared/quellen.ts';
import { ergaenzeVerwandte } from '../shared/verwandt.ts';
import type { BegriffsSeite, Content } from '../shared/types.ts';
import { baueGlossar, ueberschriftKern } from '../src/lib/glossar.ts';
import { ergaenzeGlossarThema } from '../src/lib/glossarThema.ts';
import { pruefeRechenUebung } from '../src/rechnen/pruefen.ts';

/** Die Lernblätter im Repository – einzige Quelle für Entwicklungsserver, Build und Tests. */
export const CONTENT_DIR = resolve(import.meta.dirname, '..', 'content');

/**
 * Markdown-Dateien, die die App liest (Positivliste): Lernblätter samt Lösungen, das alte SQL-Lernblatt, die beiden Materialien und die
 * Begriffsseiten (eine Datei je Buchstabe). Alles andere im Ordner – Notizen, Entwürfe – gehört nicht in die App (sie wird von mehreren Leuten genutzt).
 */
const INHALT_MD = [
  /^DeepDive_\d+_.+\.md$/,
  /^Deep_Dive_SQL.*\.md$/,
  /^Lernzettel_Kernthemen\.md$/,
  /^AP2_Themenliste.*\.md$/,
  /^AP2_SQL_Belegsatz\.md$/,
  /^Begriffsseiten_(?:[A-Z]|0-9)\.md$/,
];

/** Dateiname eines Lernblatts (siehe INHALT_MD), einer Lernkarten-JSON, der SQL- oder der Rechenübungen-JSON? */
export function isContentFile(name: string): boolean {
  return (
    INHALT_MD.some((re) => re.test(name)) ||
    /Lernkarten.*\.json$/i.test(name) ||
    /SQL_Uebungen.*\.json$/i.test(name) ||
    /Rechen_Uebungen.*\.json$/i.test(name) ||
    /Diagramm_Uebungen.*\.json$/i.test(name) ||
    /^AP2_Quellen\.json$/.test(name)
  );
}

/** Liegt `file` direkt im Quellordner und wird von loadContent() gelesen? (Für den Datei-Watcher.) */
export function isContentSource(file: string, dir = CONTENT_DIR): boolean {
  // Windows: Laufwerksbuchstaben können unterschiedlich geschrieben sein.
  const same = resolve(dirname(file)).toLowerCase() === resolve(dir).toLowerCase();
  return same && isContentFile(basename(file));
}

/** Namen aller Dateien in `dir`, die loadContent() liest (sortiert). */
export function listContentFiles(dir = CONTENT_DIR): string[] {
  return readdirSync(dir).filter(isContentFile).sort();
}

export interface Inhalt {
  content: Content;
  /** Begriffsseiten mit ganzem Text – die App lädt sie getrennt (begriffe.json), content.begriffe ist das Verzeichnis. */
  seiten: BegriffsSeite[];
}

/** Lernblätter, Karten, Übungen und Begriffsseiten lesen, prüfen und zusammensetzen. */
export function ladeInhalt(dir = CONTENT_DIR): Inhalt {
  const files = listContentFiles(dir).map((name) => ({ name, text: readFileSync(join(dir, name), 'utf8') }));
  // Rechenübungen werden gegen ihre Vorlage geprüft (unbekannte Vorlage, falsche Daten, fehlende Eingaben → Importhinweis).
  const content = buildContent(files, { pruefeRechenUebung });
  // Begriffsseiten (Umsetzungsplan Phase 3): ids müssen zum Glossar passen, „Siehe auch“ zu einer Seite führen.
  const seiten: BegriffsSeite[] = [];
  for (const f of files.filter((x) => x.name.startsWith('Begriffsseiten_'))) {
    const p = parseBegriffsseiten(f.name, f.text);
    seiten.push(...p.seiten);
    content.issues.push(...p.issues);
  }
  if (seiten.length) {
    const glossar = baueGlossar(content);
    const weitere = new Set([
      ...glossar.map((e) => namensSchluessel(e.begriff)),
      ...content.topics.flatMap((t) => t.sections.map((s) => namensSchluessel(ueberschriftKern(s.title)))),
    ]);
    content.issues.push(...pruefeBegriffsseiten(seiten, new Set(glossar.map((e) => e.id)), weitere));
    content.begriffe = seiten.map((s) => ({ id: s.id, begriff: s.begriff, ...(s.auch ? { auch: s.auch } : {}) }));
    // Leicht-Modus (Umsetzungsplan Phase 5): verwechselbare Begriffe aus „Abgrenzung“ und „Siehe auch“ an die Begriffskarten.
    content.flashcards = ergaenzeVerwandte(content.flashcards, seiten);
  }
  // Thema „Glossar & Diagramme“: Platzhalter durch das aktuelle Glossar A–Z ersetzen (src/lib/glossarThema.ts).
  ergaenzeGlossarThema(content);
  // Quellen und Lehrvideos (Umsetzungsplan Phase 8): Ziele müssen Abschnitte bzw. – wenn es Begriffsseiten gibt – Begriffe sein.
  const quellenDatei = files.find((f) => f.name === 'AP2_Quellen.json');
  if (quellenDatei) {
    const q = parseQuellen(quellenDatei.name, quellenDatei.text);
    content.issues.push(...q.issues);
    const abschnitte = new Set(content.topics.flatMap((t) => t.sections.map((s) => s.id)));
    const begriffe = new Set(seiten.map((s) => s.id));
    const pruefbar = seiten.length ? q.quellen : q.quellen.filter((x) => x.ziel.startsWith('abschnitt:'));
    content.issues.push(...pruefeQuellenZiele(quellenDatei.name, pruefbar, abschnitte, begriffe));
    content.quellen = q.quellen;
  }
  return { content, seiten };
}

export function loadContent(dir = CONTENT_DIR): Content {
  return ladeInhalt(dir).content;
}
