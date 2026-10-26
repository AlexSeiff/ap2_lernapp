// Modellierungsaufgaben im Editor statt im Textfeld: ERM, EPK, BPMN und Use-Case im Diagramm-Editor, Normalisierung und
// Relationenmodell/Star-Schema im Tabellen-Editor, ausdrücklich verlangte Tabellen (Häufigkeitstabelle, Rechenweg „tabellarisch“)
// als Wertetabelle. Erkannt wird am Aufgabentext (Operator + Diagrammtyp bzw. Tabelle + Lösungstabelle), die Blätter bleiben,
// wie sie sind. Die Antwort bleibt ein String (JSON), so ändern sich Fortschritt, Klausur und Sicherungen nicht. Rein, ohne React.

import { z } from 'zod';
import { FORMEN } from '../../shared/diagrammUebungen';
import type { Task } from '../../shared/types';
import {
  diagrammAlsText,
  EDITOR_KANTEN,
  istLeer,
  leereDiagrammAntwort,
  type DiagrammAntwort,
  type DiagrammNotation,
} from './diagrammEditor';
import { istTabellenLeer, leereTabellenAntwort, tabellenAlsText, type TabellenAntwort, type TabellenArt } from './tabellenEditor';
import { istWerteLeer, leereWerteAntwort, passeAn, werteAlsText, werteVorlage, type WerteAntwort, type WerteVorlage } from './werteTabelle';

export type EditorArt = DiagrammNotation | TabellenArt | 'werte';
export type EditorAntwort = DiagrammAntwort | TabellenAntwort | WerteAntwort;
/** Was die Erkennung braucht: Aufgabentext, Typ und – für die Wertetabelle – die Musterlösung. */
type AufgabeFuerEditor = Pick<Task, 'markdown' | 'type' | 'sqlUebung'> & Partial<Pick<Task, 'solution'>>;
type AufgabeFuerVorlage = Pick<Task, 'markdown'> & Partial<Pick<Task, 'solution'>>;

export const EDITOR_NAMEN: Record<EditorArt, string> = {
  erm: 'ER-Diagramm',
  epk: 'EPK',
  bpmn: 'BPMN-Diagramm',
  usecase: 'Use-Case-Diagramm',
  relationen: 'Tabellenschema',
  normalform: 'Normalisierung',
  werte: 'Tabellen',
};

export const istDiagrammArt = (art: EditorArt): art is DiagrammNotation => art !== 'relationen' && art !== 'normalform' && art !== 'werte';
/** Diagramm, Tabellenschema oder Wertetabelle – eine gespeicherte Antwort wechselt die Art nur innerhalb ihrer Familie. */
const familie = (art: EditorArt) => (art === 'werte' ? 'werte' : istDiagrammArt(art) ? 'diagramm' : 'schema');

/** Eines der Wörter als ganzes Wort – auch mit Umlaut am Rand („Überführen“; \b kennt nur ASCII-Buchstaben). */
const wort = (...woerter: string[]) => new RegExp(`(?<!\\p{L})(?:${woerter.join('|')})(?!\\p{L})`, 'iu');
/** Operatoren, die ein Diagramm verlangen (nicht: benennen, beurteilen, vergleichen …). */
const ERSTELLEN = wort('erstellen', 'modellieren', 'zeichnen', 'skizzieren', 'entwerfen', 'setzen sie[^.]{0,120}\\sum');
const NORMALISIEREN = wort('überführen', 'normalisieren', 'bringen');
const SCHEMA_ERSTELLEN = wort('überführen', 'entwerfen', 'erstellen', 'modellieren');

/** Welcher Editor passt zur Aufgabe? undefined = Textfeld wie bisher. */
export function editorFuer(task: AufgabeFuerEditor): EditorArt | undefined {
  if (task.type !== 'offen' || task.sqlUebung) return undefined;
  const t = task.markdown;
  if (/Normalform|\b[123]\.\s?NF\b/.test(t) && NORMALISIEREN.test(t)) return 'normalform';
  if (
    /Relationenmodell|Relationenschreibweise|Relationsschema|Star-Schema|Sternschema|Snowflake-Schema/i.test(t) &&
    SCHEMA_ERSTELLEN.test(t)
  )
    return 'relationen';
  if (ERSTELLEN.test(t)) {
    if (/ER-Diagramm|ER-Modell|\bERM\b|Entity-Relationship/.test(t)) return 'erm';
    if (/BPMN/.test(t)) return 'bpmn';
    if (/\be?EPK\b|Prozesskette/.test(t)) return 'epk';
    if (/Use-Case-Diagramm|Anwendungsfalldiagramm/i.test(t)) return 'usecase';
  }
  return werteVorlage(task) ? 'werte' : undefined;
}

/** Vorlage der Wertetabelle; passt keine Tabelle mehr (Aufgabe geändert), eine leere Spalte – die Antwort geht trotzdem nicht verloren. */
export const vorlageFuer = (task: AufgabeFuerVorlage): WerteVorlage => werteVorlage(task) ?? { kopf: [''], zeilen: [['']] };

/** Normalisierung: so viele Schritte wie die höchste verlangte Normalform (mindestens 1). */
export function normalformSchritte(markdown: string): number {
  const stufen = [...markdown.matchAll(/\b([123])\.\s?(?:NF|Normalform)\b/g)].map((m) => Number(m[1]));
  return Math.max(1, ...stufen);
}

export function leereEditorAntwort(art: EditorArt, task: AufgabeFuerVorlage): EditorAntwort {
  if (art === 'werte') return leereWerteAntwort(vorlageFuer(task));
  if (istDiagrammArt(art)) return leereDiagrammAntwort(art);
  return leereTabellenAntwort(art, art === 'normalform' ? normalformSchritte(task.markdown) : 1);
}

// ---------- Lesen und Schreiben ----------

const KnotenSchema = z.object({
  id: z.string(),
  form: z.enum(FORMEN),
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  h: z.number().positive(),
  text: z.string(),
  schluessel: z.boolean().optional(),
});
const KanteSchema = z.object({
  id: z.string(),
  von: z.string(),
  nach: z.string(),
  art: z.enum(EDITOR_KANTEN),
  text: z.string().optional(),
});
const DiagrammSchema = z.object({
  editor: z.enum(['erm', 'epk', 'bpmn', 'usecase']),
  knoten: z.array(KnotenSchema),
  kanten: z.array(KanteSchema),
  notiz: z.string().optional(),
});
const SpalteSchema = z.object({ name: z.string(), pk: z.boolean().optional(), fk: z.boolean().optional(), ziel: z.string().optional() });
const TabelleSchema = z.object({ id: z.string(), name: z.string(), spalten: z.array(SpalteSchema), zeilen: z.array(z.array(z.string())) });
const WerteSchema = z.object({
  editor: z.literal('werte'),
  kopf: z.array(z.string()),
  zeilen: z.array(z.array(z.string())),
  notiz: z.string().optional(),
});
const TabellenSchema = z.object({
  editor: z.enum(['relationen', 'normalform']),
  schritte: z.array(z.object({ titel: z.string(), text: z.string(), tabellen: z.array(TabelleSchema) })).min(1),
  notiz: z.string().optional(),
});

function parse(raw: string): EditorAntwort | undefined {
  if (!raw.trimStart().startsWith('{')) return undefined;
  try {
    const json: unknown = JSON.parse(raw);
    const d = DiagrammSchema.safeParse(json);
    if (d.success) {
      const ids = new Set(d.data.knoten.map((k) => k.id));
      return { ...d.data, kanten: d.data.kanten.filter((e) => ids.has(e.von) && ids.has(e.nach) && e.von !== e.nach) };
    }
    const t = TabellenSchema.safeParse(json);
    if (t.success) return t.data;
    const w = WerteSchema.safeParse(json);
    return w.success ? w.data : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Gespeicherte Antwort lesen. Leer → leerer Editor. Ein Text (z. B. aus einer Klausur, die vor dem Editor begonnen wurde)
 * geht nicht verloren: Er landet in den Anmerkungen. Passt die Editorart nicht mehr zur Aufgabe, gilt dasselbe.
 */
export function leseEditorAntwort(art: EditorArt, task: AufgabeFuerVorlage, raw: string | undefined): EditorAntwort {
  const leer = leereEditorAntwort(art, task);
  if (!raw?.trim()) return leer;
  const a = parse(raw);
  if (a && familie(art) === familie(a.editor)) {
    if (art === 'werte') return passeAn(vorlageFuer(task), a as WerteAntwort);
    if (!istDiagrammArt(art) && a.editor !== art) return { ...(a as TabellenAntwort), editor: art };
    return istDiagrammArt(art) ? { ...(a as DiagrammAntwort), editor: art } : a;
  }
  return { ...leer, notiz: a ? editorAlsText(a) : raw };
}

/**
 * Antwort speichern: nichts gezeichnet und nichts geschrieben → leerer String (zählt in der Klausur als „nicht bearbeitet“).
 * Bei der Wertetabelle zählen die von der Aufgabe vorgegebenen Zellen nicht als eigene Eintragung.
 */
export function schreibeEditorAntwort(a: EditorAntwort, task?: AufgabeFuerVorlage): string {
  const leer =
    a.editor === 'werte'
      ? istWerteLeer(task ? vorlageFuer(task) : { kopf: a.kopf, zeilen: [] }, a)
      : istDiagrammArt(a.editor)
        ? istLeer(a as DiagrammAntwort)
        : istTabellenLeer(a as TabellenAntwort);
  return leer ? '' : JSON.stringify(a);
}

export function editorAlsText(a: EditorAntwort): string {
  if (a.editor === 'werte') return werteAlsText(a);
  return istDiagrammArt(a.editor) ? diagrammAlsText(a as DiagrammAntwort) : tabellenAlsText(a as TabellenAntwort);
}

/** Antwort als Text (KI-Bewertung): Editor-Antworten werden beschrieben, alles andere bleibt, wie es ist. */
export function antwortAlsText(task: AufgabeFuerEditor, raw: string | undefined): string {
  const art = editorFuer(task);
  if (!art || !raw) return raw ?? '';
  return editorAlsText(leseEditorAntwort(art, task, raw));
}
