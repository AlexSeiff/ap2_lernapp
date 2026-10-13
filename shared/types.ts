// Datenmodell der Lern-App – wird von Server, Client und Tests gemeinsam genutzt.

import type { DiagrammUebung } from './diagrammUebungen';
import type { Quelle } from './quellen';

export interface Section {
  id: string;
  title: string;
  level: number;
  markdown: string;
  /** Beim Laden aus dem Glossar eingesetzt (Glossar & Diagramme) – nicht in der Suche, die das Glossar schon enthält. */
  generiert?: true;
}

export type CardType = 'wissen' | 'abgrenzung' | 'rechnung' | 'anwendung' | 'falle' | 'begriff';

/** Geschriebene Auswahlantworten einer Lernkarte für den Leicht-Modus (ROADMAP 6.2): 1 richtige, genau 3 falsche. */
export interface KartenMc {
  richtig: string;
  falsch: [string, string, string];
  /** Optional: warum die anderen Antworten falsch sind (Markdown). */
  erklaerung?: string;
}

export interface Flashcard {
  id: string;
  /** Deep Dive, zu dem die Karte gehört (fehlt bei Decks ohne eigenen Deep Dive, z. B. WiSo). */
  topicId?: string;
  kind: 'prueferfrage' | 'fachgespraech' | 'lernkarte';
  question: string;
  answer?: string;
  /** Nur Lernkarten aus der JSON-Datei: */
  deckId?: string;
  typ?: CardType;
  schwierigkeit?: number;
  tags?: string[];
  /** Geprüfter Block „mc“ aus der Datei (Leicht-Modus); fehlt er, kann der Leicht-Modus automatische Antworten nutzen. */
  mc?: KartenMc;
  /**
   * Nur Begriffskarten mit Begriffsseite (beim Laden ergänzt, shared/verwandt.ts): ids der Begriffskarten, gegen die der Begriff im
   * Abschnitt „Abgrenzung“ abgegrenzt wird – die besten falschen Antworten im Leicht-Modus (Umsetzungsplan Phase 5).
   */
  abgrenzung?: string[];
  /** Wie `abgrenzung`, aber aus „Siehe auch“ (ohne die schon in `abgrenzung` genannten) – zweitbeste falsche Antworten. */
  siehe?: string[];
  /** Nur Begriffskarten mit Begriffsseite: erste „Mehr:“-Angabe der Seite (z. B. „Deep Dive 1, 2.1“). */
  abschnitt?: string;
  /** SQL-Übungen zum Üben im Editor (beim Laden aus deren Feld „karten“ ergänzt, shared/sqlUebungen.ts). */
  sqlUebungen?: string[];
}

export interface Deck {
  id: string;
  title: string;
  area: string;
  source: string;
  status: 'behandelt' | 'offen';
  topicId?: string;
  cardCount: number;
}

export interface Solution {
  markdown: string;
  /** Text des „Prüferkommentar"-Absatzes (Punktevergabe), falls vorhanden. */
  kommentar?: string;
  /** Bewertungskriterien aus einer Punktetabelle (| Element | P |), falls vorhanden. */
  criteria?: { label: string; points: number }[];
}

/** Alle Aufgabentypen – auch Grundlage für die zod-Prüfung der API-Anfragen. */
export const TASK_TYPES = ['offen', 'mc', 'lueckentext', 'zuordnung', 'rechnen'] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export interface Task {
  /** Global eindeutig, z. B. „01-A1" oder „gen-…". */
  id: string;
  /** Aufgabennummer wie auf dem Blatt, z. B. „A1". */
  code: string;
  topicId: string;
  block: string;
  points: number;
  markdown: string;
  solution?: Solution;
  type: TaskType;
  generated?: boolean;
  /** Nur für automatisch bewertbare (KI-generierte) Aufgaben. */
  auto?: AutoCheck;
  /**
   * SQL-Übung, mit der die Aufgabe im SQL-Editor beantwortet und nach der Abgabe automatisch geprüft wird
   * (beim Laden aus dem Feld „aufgaben“ der Übung ergänzt, shared/sqlUebungen.ts).
   */
  sqlUebung?: string;
}

export interface AutoCheck {
  options?: string[];
  correct?: number[];
  blanks?: string[];
  pairs?: { left: string; right: string }[];
  numeric?: { value: number; tolerance: number; unit?: string };
}

export interface ExamBlock {
  letter: string;
  title: string;
  points: number;
  intro: string;
  taskIds: string[];
}

export interface Exam {
  title: string;
  intro: string;
  /** Anlagen / Ausgangslage / Übungsdatenbank, die während der Klausur sichtbar sind. */
  attachments: Section[];
  blocks: ExamBlock[];
  totalPoints: number;
}

export interface Topic {
  id: string;
  number: number;
  title: string;
  file: string;
  solutionFile?: string;
  sections: Section[];
  exam?: Exam;
  lernziele: string[];
}

export interface MaterialDoc {
  id: string;
  title: string;
  file: string;
  markdown: string;
}

/** Übungsdatenbank für den SQL-Editor (aus AP2_SQL_Uebungen.json, Feld „datensaetze"). */
export interface SqlDataset {
  id: string;
  titel: string;
  quelle: string;
  beschreibung?: string;
  /** SQL-Skript, das die Datenbank anlegt und befüllt (beginnt mit PRAGMA foreign_keys = ON). */
  setup: string;
  /** Optionales Zusatzskript nach `setup` mit geänderten/zusätzlichen Zeilen – gegen fest eingetippte Ergebnisse. */
  variante?: string;
  /** Deep Dive laut `quelle` (fehlt z. B. beim DataFit-Zusatzmaterial). */
  topicId?: string;
}

/** Vergleichsregeln einer SQL-Übung – strukturgleich mit CompareOptions in src/sql/types.ts. */
export interface SqlCompareOptions {
  /** auto = streng, wenn die Musterlösung ein ORDER BY auf oberster Ebene hat, sonst egal. */
  reihenfolge: 'auto' | 'streng' | 'egal';
  /** Geforderte Spaltennamen (ohne Groß-/Kleinschreibung); sonst Vergleich nach Position. */
  spaltennamen?: string[];
  /** Toleranz für Zahlen. */
  toleranz?: number;
  /** Spalten über ihren Inhalt zuordnen (nur bei verknüpften Aufgaben gesetzt, siehe SqlExercise.spaltenFrei). */
  spaltenFrei?: boolean;
}

/** SQL-Übung (aus AP2_SQL_Uebungen.json, Feld „uebungen"). Feldnamen wie in der Datei, nur camelCase. */
export interface SqlExercise {
  /** Stabil, z. B. „SQL-MH-008" – der Fortschritt hängt daran. */
  id: string;
  /** ID eines SqlDataset. */
  datensatz: string;
  /** Anzeigename wie „Deep Dive 1". */
  thema: string;
  /** Deep Dive laut `thema` (wie topicFromSource bei den Lernkarten). */
  topicId?: string;
  titel: string;
  aufgabe: string;
  /** 1 Basis · 2 Standard · 3 Transfer */
  schwierigkeit: 1 | 2 | 3;
  tags: string[];
  loesung: string;
  vergleich: SqlCompareOptions;
  /** Bei INSERT/UPDATE/DELETE/CREATE: SELECT, das den Zustand danach prüft. */
  pruefabfrage?: string;
  /** Die Musterlösung darf 0 Zeilen liefern. */
  leerErlaubt?: boolean;
  /** Gestufte Hinweise, einer nach dem anderen. */
  hinweise: string[];
  erklaerung?: string;
  /** Aufgabe auf dem Blatt, z. B. „DD1 Übungsklausur B8". */
  quelleAufgabe?: string;
  /** Aufgaben (Task-ids wie „01-B8“), die im SQL-Editor mit dieser Übung beantwortet werden. */
  aufgaben?: string[];
  /** Karteikarten (ids), deren Rückseite auf diese Übung verweist. */
  karten?: string[];
  /** Die Übung deckt nur einen Teil der verknüpften Aufgabe ab (z. B. Fehler benennen und korrigieren) – keine volle Punktzahl automatisch. */
  teilaufgabe?: boolean;
  /**
   * Nur beim Prüfen einer verknüpften Aufgabe: Ihr Text gibt die Spalten nicht vor – Spalten werden über ihren Inhalt
   * zugeordnet, Namen und Spaltenreihenfolge zählen nicht, zusätzliche Spalten (z. B. SELECT *) sind erlaubt.
   */
  spaltenFrei?: boolean;
}

/**
 * Erwarteter Wert einer Rechenübung: Zahl, Text (z. B. Name oder kritischer Pfad) oder Zahlenliste (z. B. Ausreißer).
 */
export type RechenWert = number | string | number[];

/** Ein Eingabefeld einer Rechenübung (aus AP2_Rechen_Uebungen.json, Feld „eingaben“). */
export interface RechenEingabe {
  /** ID eines Ergebnisses der Vorlage (siehe DOKUMENTATION § 4.4) bzw. frei wählbar bei Übungen ohne Vorlage. */
  id: string;
  /** Beschriftung; ohne Angabe die der Vorlage. */
  label?: string;
  /** Einheit, z. B. „min“, „%“, „€“; ohne Angabe die der Vorlage. */
  einheit?: string;
  /** Nachkommastellen; bestimmt die Toleranz (halbe Einheit der letzten Stelle). Ohne Angabe die der Vorlage. */
  runden?: number;
  /** Erlaubte Abweichung (überschreibt die aus `runden`). */
  toleranz?: number;
  /** Nur bei Übungen ohne Vorlage: der richtige Wert. */
  loesung?: RechenWert;
}

/** Rechenübung (aus AP2_Rechen_Uebungen.json, Feld „uebungen“). */
export interface RechenUebung {
  /** Stabil, z. B. „RE-ST1-001“ – der Fortschritt hängt daran. */
  id: string;
  /** Anzeigename wie „Deep Dive 3“. */
  thema: string;
  /** Deep Dive laut `thema`. */
  topicId?: string;
  titel: string;
  /** 1 Basis · 2 Standard · 3 Transfer */
  schwierigkeit: 1 | 2 | 3;
  tags: string[];
  /** ID der Rechenvorlage (src/rechnen/vorlagen); fehlt bei Übungen mit fest angegebenen Lösungen. */
  vorlage?: string;
  /** Feste Daten für die Vorlage (z. B. die Zahlen aus dem Lernblatt). Fehlen sie, erzeugt die Vorlage die Zahlen. */
  daten?: Record<string, unknown>;
  /** Parameter für den Zufallsgenerator der Vorlage („🎲 Neue Zahlen“). */
  params?: Record<string, unknown>;
  /** „🎲 Neue Zahlen“ anbieten (Standard: ja, wenn es eine Vorlage gibt). */
  neueZahlen: boolean;
  /** Aufgabentext (Markdown); `{{name}}` wird durch Platzhalter der Vorlage ersetzt. */
  aufgabe: string;
  /** Leer = alle Ergebnisse der Vorlage in deren Reihenfolge. */
  eingaben: RechenEingabe[];
  hinweise: string[];
  /** Zusätzliche Erklärung zur Lösung (Markdown mit Formeln). */
  erklaerung?: string;
  /** Aufgabe auf dem Blatt, z. B. „DD3 Übungsklausur C1“. */
  quelleAufgabe?: string;
}

export interface ImportIssue {
  file: string;
  message: string;
}

/** Begriffsseite (AP-2/Begriffsseiten_<Buchstabe>.md, Umsetzungsplan Phase 3): ausführliche Seite zu einem Glossarbegriff. */
export interface BegriffsSeite {
  /** = id des Glossareintrags (src/lib/glossar.ts). */
  id: string;
  begriff: string;
  /** Andere Schreibweisen („Auch: …“). */
  auch?: string[];
  /** Seiteninhalt (Markdown) ohne id-Kommentar und ohne die Zeilen „Auch:“, „Siehe auch:“, „Mehr:“. */
  markdown: string;
  /** Namen aus „Siehe auch:“. */
  siehe: string[];
  /** Verweise aus „Mehr:“ wie „Deep Dive 5, 6.5“. */
  mehr: string[];
  /** Fundstellen laut id-Kommentar (Text). */
  quellen: string;
  stand?: string;
  datei: string;
}

/** Kurzform einer Begriffsseite im Inhalt (content.json); die ganzen Seiten lädt die App erst bei Bedarf (begriffe.json). */
export interface BegriffKurz {
  id: string;
  begriff: string;
  auch?: string[];
}

export interface Content {
  importedAt: string;
  topics: Topic[];
  tasks: Record<string, Task>;
  flashcards: Flashcard[];
  decks: Deck[];
  /** Lernhinweise aus der Lernkarten-Datei (meta.hinweise). */
  cardHints: string[];
  materials: MaterialDoc[];
  /** Übungsdatenbanken und -aufgaben des SQL-Editors (AP2_SQL_Uebungen.json). */
  sqlDatasets: SqlDataset[];
  sqlExercises: SqlExercise[];
  /** Rechenübungen (AP2_Rechen_Uebungen.json). */
  rechenUebungen: RechenUebung[];
  /** Diagramm-Übungen (AP2_Diagramm_Uebungen.json, Umsetzungsplan Phase 7); fehlt in älteren Ständen. */
  diagrammUebungen?: DiagrammUebung[];
  /** Quellen und Lehrvideos (AP2_Quellen.json, Umsetzungsplan Phase 8); fehlt in älteren Ständen. */
  quellen?: Quelle[];
  /** Verzeichnis der Begriffsseiten (ohne Seitentext); fehlt in älteren Ständen. */
  begriffe?: BegriffKurz[];
  issues: ImportIssue[];
}
