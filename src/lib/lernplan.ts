// Lernplan bis zum Prüfungstermin: verteilt die Themen nach Schwäche und Umfang auf die Wochen und rechnet das nötige Tempo aus.
// Rein (ohne React, ohne Speicher): gleicher Stand + gleicher Tag → gleicher Plan.

import { CARD_INTERVALS, HEUTE_ZEITEN } from '../../shared/config';
import type { Progress } from '../../shared/progress';
import type { KernInhalt } from '../../shared/texte';
import { cardPool } from './cards';
import { istAusgeblendet } from './settings';
import { daysUntilExam, topicStats } from './stats';

/** Themen mit Schwerpunkt je Woche. */
export const THEMEN_PRO_WOCHE = 3;
/** Die letzten Tage vor der Prüfung sind für Wiederholung und Übungsklausuren reserviert. */
export const PUFFER_TAGE = 3;
/** Anteil der Prüfungskarten (ohne Begriffskarten), der bis zur Prüfung „sicher“ (Fach ≥ 3) sein soll. */
export const ZIEL_KARTEN = 0.8;
/** Grobe Annahme: nicht jede Antwort sitzt beim ersten Mal – so viel mehr Bewertungen als das Minimum bis Fach 3. */
export const WIEDERHOLUNGS_FAKTOR = 1.5;

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
  /** Prüfungskarten der geplanten Themen (ohne Begriffskarten), Ziel „sicher“ (Fach 3+) und was davon noch fehlt. */
  kartenGesamt: number;
  kartenZiel: number;
  kartenOffen: number;
  /** Nie gelernte Karten je Tag, damit jede vor dem Puffer noch Fach 3 erreichen kann (die angefangenen zählen schon mit). */
  neueKartenProTag: number;
  /** Geschätzte Minuten Karteikarten je Tag für das Ziel: neue Karten und ihre Wiederholungen. */
  kartenMinutenProTag: number;
  /** Begriffskarten zählen nicht zum Ziel – nur zur Info. */
  begriffe: { gesamt: number; sicher: number };
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

  // Kartenziel nur über Prüfungskarten: die rund 800 Begriffskarten machten daraus „42 Karten pro Tag“, die keine Tagesrunde schafft.
  const themen = new Set(stats.map((s) => s.topic.id));
  const karten = cardPool(content.flashcards, progress.settings).filter((c) => c.topicId && themen.has(c.topicId));
  const fach = (id: string) => progress.cards[id]?.box ?? 0;
  const pruefung = karten.filter((c) => c.typ !== 'begriff');
  const begriffe = karten.filter((c) => c.typ === 'begriff');
  const sicher = pruefung.filter((c) => fach(c.id) >= 3).length;
  const angefangen = pruefung.filter((c) => fach(c.id) > 0 && fach(c.id) < 3);
  const kartenZiel = Math.ceil(pruefung.length * ZIEL_KARTEN);
  const kartenOffen = Math.max(0, kartenZiel - sicher);
  const neuNoetig = Math.max(0, kartenOffen - angefangen.length);
  // Neue Karte: „gewusst“ → Fach 2, nach CARD_INTERVALS[2] Tagen noch einmal „gewusst“ → Fach 3. Später begonnen schafft sie es nicht mehr.
  const startTage = Math.max(1, nutzbar - CARD_INTERVALS[2]);
  // Bewertungen bis Fach 3: neue Karten 2, angefangene 3 − Fach – mal WIEDERHOLUNGS_FAKTOR für die, die nicht gleich sitzen.
  const bewertungen = (neuNoetig * 2 + angefangen.reduce((a, c) => a + 3 - fach(c.id), 0)) * WIEDERHOLUNGS_FAKTOR;
  return {
    tage,
    wochen,
    kartenGesamt: pruefung.length,
    kartenZiel,
    kartenOffen,
    neueKartenProTag: Math.ceil(neuNoetig / startTage),
    kartenMinutenProTag: kartenOffen ? Math.ceil((bewertungen * HEUTE_ZEITEN.karte) / nutzbar) : 0,
    begriffe: { gesamt: begriffe.length, sicher: begriffe.filter((c) => fach(c.id) >= 3).length },
  };
}
