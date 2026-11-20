// Was bedeutet eine Aufgabe für die App? Der Parser (domain/parser.ts) liest nur die Struktur (Code, Punkte, Text) und setzt bei jeder Aufgabe
// `type: 'offen'`. Welchen Antwort-Editor sie bekommt, welcher Anhang dazugehört und welcher Operator sie einleitet, schließt die App aus dem
// TEXT der Aufgabe (editorAufgabe.ts, anhang.ts, operatoren.ts). Diese Datei fasst das für Importbericht und Tests an einer Stelle zusammen,
// damit sichtbar ist, was erraten wird – und auffällt, wenn eine Umformulierung die Erkennung bricht.

import type { Task } from '../../domain/types';
import { anhangFuer } from './anhang';
import { editorFuer } from './editorAufgabe';
import { findeOperatoren } from './operatoren';

export interface AufgabenBedeutung {
  /** Antwort-Editor oder „textfeld“, wenn es keinen gibt. */
  editor: string;
  sql: boolean;
  formeln: boolean;
  /** Notationen, deren Beiblatt dazugehört. */
  diagramme: string[];
  /** Der erste Operator im Text (operatorId) oder „keiner“. */
  operator: string;
  /** Gesetzt, wenn die Aufgabe nach einem Editor aussieht, aber keinen bekommt (siehe `editorVerdacht`). */
  verdacht?: string;
}

/** Operatoren, mit denen etwas gezeichnet oder aufgebaut werden soll. */
const ZEICHNEN = new Set(['erstellen', 'zeichnen', 'skizzieren', 'entwerfen', 'darstellen', 'entwickeln']);
/** Wörter, die auf eine Antwort in einem eigenen Editor hindeuten (Notationen und Tabellenformen). */
const EDITORWORT =
  /ER-Diagramm|ER-Modell|\bERM\b|\be?EPK\b|BPMN|Use-Case-Diagramm|Anwendungsfalldiagramm|Aktivitätsdiagramm|Struktogramm|Boxplot|Koordinatensystem|Relationenmodell|Normalform/i;

/**
 * Sieht die Aufgabe so aus, als sollte sie einen Editor bekommen (ein Zeichen-Operator oder keiner, dazu ein Notationswort), hat aber keinen?
 * Das ist keine Fehlermeldung, sondern ein Hinweis: Oft ist es richtig (die Aufgabe fragt nur nach dem Diagramm), manchmal hat eine Umformulierung die
 * Erkennung in `editorFuer` gebrochen.
 */
export function editorVerdacht(task: Pick<Task, 'markdown'>, operator: string, editor: string): string | undefined {
  // Ein Zeichen-Operator – oder gar keiner: Wer „Erstellen Sie“ in „Fertigen Sie … an“ umformuliert, hat danach keinen erkannten Operator mehr.
  if (editor !== 'textfeld' || !(ZEICHNEN.has(operator) || operator === 'keiner')) return undefined;
  const wort = EDITORWORT.exec(task.markdown)?.[0];
  return wort ? `${operator === 'keiner' ? 'kein Operator' : `Operator „${operator}“`} und „${wort}“, aber kein Editor` : undefined;
}

export function aufgabenBedeutung(task: Task): AufgabenBedeutung {
  const editor = editorFuer(task) ?? 'textfeld';
  const anhang = anhangFuer([task]);
  const operator = findeOperatoren(task.markdown)[0]?.operatorId ?? 'keiner';
  const verdacht = editorVerdacht(task, operator, editor);
  return { editor, sql: anhang.sql, formeln: anhang.formeln, diagramme: anhang.diagramme, operator, ...(verdacht ? { verdacht } : {}) };
}

/** Eine Zeile für Berichte und Snapshots: `editor | Anhang | Operator`. */
export function bedeutungKurz(b: AufgabenBedeutung): string {
  const anhang =
    [b.sql && 'SQL', b.formeln && 'Formeln', b.diagramme.length > 0 && `Diagramme(${b.diagramme.join(',')})`].filter(Boolean).join('+') ||
    '–';
  return `${b.editor} | ${anhang} | ${b.operator}`;
}
