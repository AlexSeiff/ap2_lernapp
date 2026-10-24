// Neue Übersicht (Umsetzungsplan Phase 9): reine Auswertungen für die Widgets der Startseite – Fortschritt je Prüfungsbereich
// (Ringe), fällige Wiederholungen, Begriff des Tages, Klausurverlauf. Die Seite selbst steht in pages/Dashboard.tsx.

import { SICHER_RICHTIG_AB } from '../../shared/config';
import type { Progress } from '../../shared/progress';
import type { BegriffKurz, Content, Flashcard } from '../../shared/types';
import { cardPool } from './cards';
import { diagrammSummary, diagrammUebungen } from './diagramme';
import { glossarSchluessel } from './glossar';
import { seedAusText } from '../rechnen/zufall';
import { klausurName } from './mischKlausur';
import { isDue, localDate } from './progress';
import { rechenSummary } from './rechnen';
import { sqlSummary } from './sql';
import { percent } from './grading';
import type { KernInhalt } from '../../shared/texte';

export type PruefungsbereichId = 'prozess' | 'qualitaet' | 'wiso';

export interface Pruefungsbereich {
  id: PruefungsbereichId;
  titel: string;
  /** Deep Dives, die zu diesem Bereich zählen. */
  themen: string[];
}

/**
 * Prüfungsbereiche der AP2 und ihre Deep Dives. Jeder Deep Dive zählt genau einmal, und zwar zu dem Bereich, aus dem die meisten
 * seiner Klausurblöcke stammen (UNTERBEREICHE in mischKlausur.ts): DD12 und DD16 (A–C) zur Prozessanalyse, DD10 und DD15 zur
 * Datenqualität. DD18 bis DD20 sind das Altklausur-Training (Prozessanalyse, Datenqualität, WiSo). WiSo ist ein eigener Prüfungsteil. DD17 (Glossar & Diagramme) ist Nachschlagematerial und zählt nirgends.
 */
export const PRUEFUNGSBEREICHE: Pruefungsbereich[] = [
  { id: 'prozess', titel: 'Prozessanalyse', themen: ['05', '12', '16', '18'] },
  { id: 'qualitaet', titel: 'Datenqualität', themen: ['00', '01', '02', '03', '04', '06', '07', '08', '09', '10', '11', '15', '19'] },
  { id: 'wiso', titel: 'WiSo', themen: ['13', '14', '20'] },
];

/** Diagramm-Übungen (EPK, BPMN, UML) haben kein Thema; sie gehören zur Prozessmodellierung. */
const DIAGRAMM_BEREICH: PruefungsbereichId = 'prozess';

export interface Anteil {
  erreicht: number;
  gesamt: number;
}

export interface BereichFortschritt {
  bereich: Pruefungsbereich;
  /** Karteikarten ab Fach 3 (wie „Karten sicher“ in topicStats). */
  karten: Anteil;
  /** Einzelaufgaben (letzter Versuch ≥ SICHER_RICHTIG_AB der Punkte) sowie gelöste SQL-, Rechen- und Diagramm-Übungen. */
  uebungen: Anteil;
}

/** Anteil 0–1 (0, wenn es nichts gibt). */
export const quote = (a: Anteil) => (a.gesamt > 0 ? a.erreicht / a.gesamt : 0);

/** Fortschritt je Prüfungsbereich für die Ringe. Es gelten die Einstellungen Prüferfragen/Fachgespräch (cardPool). */
export function bereichFortschritt(content: KernInhalt, progress: Progress): BereichFortschritt[] {
  const pool = cardPool(content.flashcards, progress.settings);
  const letzter = new Map<string, number>();
  for (const a of progress.attempts) letzter.set(a.taskId, a.max > 0 ? a.points / a.max : 0);
  const aufgaben = Object.values(content.tasks).filter((t) => !t.generated);
  return PRUEFUNGSBEREICHE.map((bereich) => {
    const drin = (topicId: string | undefined) => !!topicId && bereich.themen.includes(topicId);
    const karten = pool.filter((c) => drin(c.topicId));
    const eigeneAufgaben = aufgaben.filter((t) => drin(t.topicId));
    const sql = content.sqlExercises.filter((e) => drin(e.topicId));
    const rechnen = content.rechenUebungen.filter((u) => drin(u.topicId));
    const diagramme = bereich.id === DIAGRAMM_BEREICH ? diagrammUebungen(content) : [];
    const uebungenGesamt = eigeneAufgaben.length + sql.length + rechnen.length + diagramme.length;
    const uebungenErreicht =
      eigeneAufgaben.filter((t) => (letzter.get(t.id) ?? 0) >= SICHER_RICHTIG_AB).length +
      sql.filter((e) => progress.sql[e.id]?.solvedAt).length +
      rechnen.filter((u) => progress.rechnen[u.id]?.solvedAt).length +
      diagramme.filter((u) => progress.diagramme[u.id]?.solvedAt).length;
    return {
      bereich,
      karten: { erreicht: karten.filter((c) => (progress.cards[c.id]?.box ?? 0) >= 3).length, gesamt: karten.length },
      uebungen: { erreicht: uebungenErreicht, gesamt: uebungenGesamt },
    };
  });
}

export interface Faellig {
  journal: number;
  /** Schon bewertete Karten, die heute wieder dran sind. */
  karten: number;
  /** Noch nie bewertete Karten (früher in „karten“ mitgezählt – 1.500 „fällige“ Karten am ersten Tag schrecken eher ab). */
  kartenNeu: number;
  sql: number;
  rechnen: number;
  diagramme: number;
}

/** Was heute fällig ist: Fehlerjournal, Karteikarten (fällige und neue getrennt), SQL-, Rechen- und Diagramm-Wiederholungen. */
export function faellig(content: KernInhalt, progress: Progress, today = localDate()): Faellig {
  const pool = cardPool(content.flashcards, progress.settings);
  return {
    journal: Object.values(progress.journal).filter((j) => !j.resolvedAt && isDue(j.due, today)).length,
    karten: pool.filter((c) => {
      const s = progress.cards[c.id];
      return !!s && isDue(s.due, today);
    }).length,
    kartenNeu: pool.filter((c) => !progress.cards[c.id]).length,
    sql: sqlSummary(
      progress,
      content.sqlExercises.map((e) => e.id),
      today,
    ).due,
    rechnen: rechenSummary(
      progress,
      content.rechenUebungen.map((u) => u.id),
      today,
    ).due,
    diagramme: diagrammSummary(
      progress,
      diagrammUebungen(content).map((u) => u.id),
      today,
    ).due,
  };
}

export interface BegriffDesTages {
  begriff: BegriffKurz;
  /** Begriffskarte mit der Kurzdefinition (falls es eine gibt). */
  karte?: Flashcard;
}

/**
 * Begriff des Tages: eine Begriffsseite, fest je Tag (gleicher Tag → gleicher Begriff). Bevorzugt Begriffe mit Begriffskarte, damit
 * eine Kurzdefinition dabeisteht – die ganze Seite (begriffe.json) muss dafür nicht geladen werden.
 */
export function begriffDesTages(content: Pick<Content, 'begriffe' | 'flashcards'>, today = localDate()): BegriffDesTages | undefined {
  const karten = new Map<string, Flashcard>();
  for (const c of content.flashcards) {
    if (c.typ === 'begriff' && c.answer && !karten.has(glossarSchluessel(c.question))) karten.set(glossarSchluessel(c.question), c);
  }
  const alle = [...(content.begriffe ?? [])].sort((a, b) => a.id.localeCompare(b.id));
  const mitKarte = alle.filter((b) => karten.has(glossarSchluessel(b.begriff)));
  const auswahl = mitKarte.length ? mitKarte : alle;
  if (!auswahl.length) return undefined;
  const begriff = auswahl[seedAusText(`begriff:${today}`) % auswahl.length];
  const karte = karten.get(glossarSchluessel(begriff.begriff));
  return { begriff, ...(karte ? { karte } : {}) };
}

export interface KlausurLauf {
  id: string;
  datum: string;
  name: string;
  pct: number;
  punkte: number;
  max: number;
}

/** Alle abgeschlossenen Übungsklausuren (auch gemischte), älteste zuerst, und der Durchschnitt in Prozent. */
export function klausurVerlauf(content: KernInhalt, progress: Progress): { laeufe: KlausurLauf[]; schnitt?: number } {
  const laeufe = progress.exams
    .filter((e) => typeof e.total === 'number' && e.max > 0)
    .map((e) => ({
      id: e.id,
      datum: e.finishedAt ?? e.submittedAt ?? e.startedAt,
      name: klausurName(content, e.topicId),
      pct: percent(e.total!, e.max),
      punkte: e.total!,
      max: e.max,
    }))
    .sort((a, b) => a.datum.localeCompare(b.datum));
  return laeufe.length ? { laeufe, schnitt: laeufe.reduce((s, l) => s + l.pct, 0) / laeufe.length } : { laeufe };
}
