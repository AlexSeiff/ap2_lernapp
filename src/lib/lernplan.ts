// Lernplan bis zum Prüfungstermin: verteilt die Themen nach Schwäche und Umfang auf die Wochen und rechnet das nötige Tempo aus.
// Rein (ohne React, ohne Speicher): gleicher Stand + gleicher Tag → gleicher Plan.

import type { Progress } from '../../shared/progress';
import type { KernInhalt } from '../../shared/texte';
import { istAusgeblendet } from './settings';
import { daysUntilExam, topicStats } from './stats';

/** Themen mit Schwerpunkt je Woche. */
export const THEMEN_PRO_WOCHE = 3;
/** Die letzten Tage vor der Prüfung sind für Wiederholung und Übungsklausuren reserviert. */
export const PUFFER_TAGE = 3;
/** Anteil der Karten, der bis zur Prüfung „sicher“ (Fach ≥ 3) sein soll. */
export const ZIEL_KARTEN = 0.8;

export interface LernWoche {
  /** 1-basiert. */
  nummer: number;
  /** Datum des Wochenbeginns (YYYY-MM-DD). */
  ab: string;
  themen: { id: string; titel: string; stand?: number }[];
}

export interface Lernplan {
  tage: number;
  wochen: LernWoche[];
  /** Karten, die bis zur Prüfung noch „sicher“ werden müssen, und das nötige Tempo je Tag. */
  kartenZiel: number;
  kartenOffen: number;
  kartenProTag: number;
}

const addTage = (datum: string, n: number) => {
  const [y, m, d] = datum.split('-').map(Number);
  const t = new Date(y, m - 1, d + n);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
};

/** undefined, wenn kein Termin gesetzt oder er vorbei ist. */
export function planeLernplan(content: KernInhalt, progress: Progress, today: string): Lernplan | undefined {
  const [y, m, d] = today.split('-').map(Number);
  const tage = daysUntilExam(progress.settings.examDate, new Date(y, m - 1, d));
  if (tage === undefined || tage < 1) return undefined;

  const stats = topicStats(content, progress).filter((s) => !istAusgeblendet(progress.settings, s.topic.id) && s.topic.exam?.blocks.length);
  const nutzbar = Math.max(1, tage - PUFFER_TAGE);
  const anzahlWochen = Math.max(1, Math.ceil(nutzbar / 7));
  const plaetze = anzahlWochen * THEMEN_PRO_WOCHE;

  // Bedarf je Thema: Abstand zum Ziel 92 % (ohne Daten: voll), gewichtet mit dem Umfang (Aufgaben + Karten).
  const bedarf = stats.map((s) => {
    const stand = s.lastExam ?? s.avgTaskPct;
    const umfang = Math.max(
      1,
      Object.values(content.tasks).filter((t) => t.topicId === s.topic.id && !t.generated).length + s.cardsTotal / 10,
    );
    return { s, stand, bedarf: Math.max(5, 92 - (stand ?? 0)) * umfang };
  });
  const summe = bedarf.reduce((a, b) => a + b.bedarf, 0) || 1;
  // Plätze nach Bedarf verteilen (Größte-Reste-Verfahren), jedes Thema mindestens einmal, solange Plätze reichen.
  const anteile = bedarf.map((b) => ({
    ...b,
    platz: Math.max(1, Math.floor((b.bedarf / summe) * plaetze)),
    rest: ((b.bedarf / summe) * plaetze) % 1,
  }));
  let belegt = anteile.reduce((a, b) => a + b.platz, 0);
  for (const a of [...anteile].sort((p, q) => q.rest - p.rest)) {
    if (belegt >= plaetze) break;
    a.platz += 1;
    belegt += 1;
  }
  while (belegt > plaetze) {
    const g = [...anteile].filter((a) => a.platz > 1).sort((p, q) => q.platz - p.platz)[0];
    if (!g) break;
    g.platz -= 1;
    belegt -= 1;
  }

  // Auf die Wochen verteilen: schwächste Themen zuerst, reihum, damit ein Thema nicht in jeder Woche steht.
  const wochen: LernWoche[] = Array.from({ length: anzahlWochen }, (_, i) => ({ nummer: i + 1, ab: addTage(today, i * 7), themen: [] }));
  const reihe: typeof anteile = [];
  const rest = anteile.map((a) => ({ ...a })).sort((p, q) => q.bedarf - p.bedarf);
  while (rest.some((a) => a.platz > 0)) {
    for (const a of rest) {
      if (a.platz > 0) {
        reihe.push(a);
        a.platz -= 1;
      }
    }
  }
  let w = 0;
  for (const a of reihe) {
    // nächste Woche mit freiem Platz, in der das Thema noch nicht steht
    let versuch = 0;
    while (
      versuch < anzahlWochen &&
      (wochen[w % anzahlWochen].themen.length >= THEMEN_PRO_WOCHE || wochen[w % anzahlWochen].themen.some((t) => t.id === a.s.topic.id))
    ) {
      w += 1;
      versuch += 1;
    }
    const woche = wochen[w % anzahlWochen];
    if (woche.themen.length < THEMEN_PRO_WOCHE && !woche.themen.some((t) => t.id === a.s.topic.id)) {
      woche.themen.push({ id: a.s.topic.id, titel: a.s.topic.title, ...(a.stand !== undefined ? { stand: a.stand } : {}) });
    }
    w += 1;
  }

  const gesamt = stats.reduce((a, s) => a + s.cardsTotal, 0);
  const sicher = stats.reduce((a, s) => a + s.cardsKnown, 0);
  const kartenZiel = Math.ceil(gesamt * ZIEL_KARTEN);
  const kartenOffen = Math.max(0, kartenZiel - sicher);
  return { tage, wochen, kartenZiel, kartenOffen, kartenProTag: Math.ceil(kartenOffen / nutzbar) };
}
