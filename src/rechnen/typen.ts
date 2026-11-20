// Datentypen der Rechenvorlagen (ROADMAP Phase 5). Rein, ohne React – auch Build (Importprüfung) und Tests nutzen sie.

import type { z } from 'zod';
import type { RechenSchritt } from '../../domain/rechenweg';
import type { RechenWert } from '../../domain/types';

/**
 * Wie eine Eingabe verglichen wird: `zahl` mit Toleranz, `liste` als Zahlenmenge (Reihenfolge egal),
 * `text` ohne Groß-/Kleinschreibung (Teilwort genügt, z. B. „Süd“ für „Filiale Süd“), `menge` als Menge von Kürzeln
 * (z. B. kritischer Pfad „A, C, D“ – Reihenfolge und Trennzeichen egal).
 */
export type Vergleich = 'zahl' | 'liste' | 'text' | 'menge';

/** Standardangaben zu einem Ergebnis der Vorlage; eine Übung kann Label, Einheit und Rundung überschreiben. */
export interface Feld {
  label: string;
  einheit?: string;
  runden?: number;
  /** Ohne Angabe: aus dem Werttyp (Zahl → zahl, Zahlenliste → liste, Text → text). */
  vergleich?: Vergleich;
  /** Zwischenergebnis: wird nur abgefragt, wenn die Übung es in `eingaben` ausdrücklich nennt. */
  zusatz?: boolean;
}

/** Typischer Fehler mit dem falschen Wert, der dabei herauskommt (auch für die Distraktoren im Leicht-Modus, Phase 6). */
export interface Fehlerbild {
  /** ID des Ergebnisses, zu dem der falsche Wert gehört. */
  eingabe: string;
  wert: RechenWert;
  /** Erklärung in du-Form, z. B. „Du hast durch n geteilt – bei einer Stichprobe teilt man durch n − 1.“ */
  text: string;
}

/** Eingaben als Tabelle (z. B. Netzplan: je Vorgang FAZ, FEZ, SAZ, SEZ, GP, FP). */
export interface EingabeLayout {
  spalten: string[];
  zeilen: { label: string; ids: (string | null)[] }[];
}

/** Daten der Aufgabe als Tabelle zum Anzeigen (Zahlen schon im deutschen Format). */
export interface Tabelle {
  titel?: string;
  kopf: string[];
  zeilen: string[][];
}

export interface Loesung {
  /** Alle Ergebnisse der Vorlage, ungerundet. */
  werte: Record<string, RechenWert>;
  /** Angaben je Ergebnis, in der Standard-Reihenfolge (so erscheinen sie, wenn die Übung keine Eingaben auswählt). */
  felder: Record<string, Feld>;
  /** Rechenweg für „👁 Lösung zeigen“. */
  schritte: RechenSchritt[];
  fehlerbilder: Fehlerbild[];
  layout?: EingabeLayout;
}

export type Params = Record<string, unknown>;

export interface Vorlage<D = unknown> {
  id: string;
  titel: string;
  /** Themengebiet, z. B. „Statistik I“. */
  bereich: string;
  /** Kurzbeschreibung für Doku und Import-Meldungen. */
  beschreibung: string;
  /** Prüft `daten` aus der JSON-Datei. */
  schema: z.ZodType<D>;
  /** Erzeugt Daten aus einem Seed. `vorbild` (die festen Daten der Übung) gibt die Form vor, z. B. Anzahl Werte oder Netzplan-Struktur. */
  erzeuge(seed: number, params?: Params, vorbild?: D): D;
  loese(daten: D): Loesung;
  /** Werte für `{{name}}` im Aufgabentext (deutsches Zahlenformat). */
  platzhalter(daten: D): Record<string, string>;
  /** Datentabelle über den Eingaben. */
  tabelle?(daten: D): Tabelle | undefined;
  /** Hinweise, falls die Übung keine eigenen hat. */
  hinweise: string[];
}
