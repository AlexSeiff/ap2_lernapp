// „Heute lernen“ (ROADMAP 8.1): plant aus dem, was fällig ist, eine gemischte Runde von etwa HEUTE_MINUTEN Minuten.
// Rein (ohne React, ohne Speicher): gleicher Stand + gleicher Tag → gleicher Plan. Die Sitzung (welcher Schritt gerade dran ist)
// steht in lib/heuteSitzung.ts, die Seite in pages/Heute.tsx.

import { HEUTE_KARTEN_BLOCK, HEUTE_MINUTEN, HEUTE_ZEITEN, NEW_PER_SESSION } from '../../shared/config';
import type { Progress } from '../../shared/progress';
import type { Flashcard, Task } from '../../shared/types';
import { erzeugeZufall, seedAusText } from '../rechnen/zufall';
import { cardPool } from './cards';
import { leichtAutomatischAn, leichtKartenGemerkt } from './leicht';
import { isDue, localDate } from './progress';
import { rechenStatus } from './rechnen';
import { istAusgeblendet } from './settings';
import { sqlStatus } from './sql';
import { topicStats } from './stats';
import type { IconName } from './icons';
import type { KernInhalt } from '../../shared/texte';

export type HeuteArt = 'wiederholung' | 'aufgabe' | 'sql' | 'rechnen' | 'karten';

export interface HeuteItem {
  /** Eindeutig innerhalb des Plans. */
  key: string;
  art: HeuteArt;
  /** Aufgaben-, Übungs- oder Karten-IDs (Karten: mehrere). */
  ids: string[];
  /** Thema fürs Verschränken (Deep Dive, sonst Deck). */
  thema: string;
  titel: string;
  minuten: number;
  /** Ziel in der App (HashRouter-Pfad). */
  link: string;
}

export interface HeutePlan {
  items: HeuteItem[];
  minuten: number;
  /** Schwächstes Thema (Deep-Dive-ID), aus dem die Zusatzaufgabe stammt. */
  schwaechstesThema?: string;
}

export const HEUTE_ICONS: Record<HeuteArt, IconName> = {
  wiederholung: 'notebook-pen',
  aufgabe: 'file-pen-line',
  sql: 'database',
  rechnen: 'calculator',
  karten: 'layers',
};

/** Geschätzte Minuten für eine Aufgabe mit `punkte` Punkten (wie in der Prüfung, mindestens HEUTE_ZEITEN.aufgabeMin). */
export const aufgabeMinuten = (punkte: number) => Math.max(HEUTE_ZEITEN.aufgabeMin, Math.round(punkte * HEUTE_ZEITEN.aufgabeProPunkt));

/**
 * Verschränkt die Elemente nach Thema: nie zweimal hintereinander dasselbe Thema, solange es sich vermeiden lässt.
 * Gierig: immer aus dem Thema mit den meisten übrigen Elementen (bei Gleichstand das zuerst vorkommende), aber nicht dem letzten.
 * Innerhalb eines Themas bleibt die Reihenfolge erhalten.
 */
export function verschraenke<T extends { thema: string }>(items: T[]): T[] {
  const gruppen = new Map<string, T[]>();
  for (const it of items) gruppen.set(it.thema, [...(gruppen.get(it.thema) ?? []), it]);
  const out: T[] = [];
  let letztes: string | undefined;
  while (out.length < items.length) {
    let wahl: string | undefined;
    for (const [thema, rest] of gruppen) {
      if (!rest.length || thema === letztes) continue;
      if (wahl === undefined || rest.length > gruppen.get(wahl)!.length) wahl = thema;
    }
    wahl ??= letztes!; // nur noch ein Thema übrig
    out.push(gruppen.get(wahl)!.shift()!);
    letztes = wahl;
  }
  return out;
}

export interface PlanOptionen {
  today?: string;
  /** Zufall für die Auswahl offener Übungen und Aufgaben; Standard: fest je Tag. */
  zufall?: () => number;
  minuten?: number;
  /** Aufgaben-, Übungs- und Karten-IDs aus früheren Runden von heute – „Noch eine Runde“ bringt sie nicht noch einmal. */
  ausschliessen?: Iterable<string>;
}

const themaVon = (topicId: string | undefined, fallback: string) => topicId ?? fallback;

/**
 * Plant die Tagesrunde:
 * 1. Eine Aufgabe aus dem schwächsten Thema (letzte Klausur, sonst Ø Aufgaben; ohne Daten: das Thema mit den wenigsten Versuchen) –
 *    bevorzugt eine noch nie bearbeitete, sonst die mit dem schlechtesten letzten Ergebnis.
 * 2. 1–2 Übungen: fällige SQL- und Rechenübungen (älteste zuerst, höchstens 2); ist keine fällig, eine ungelöste
 *    (bevorzugt aus dem schwächsten Thema).
 * 3. Fällige Fehlerjournal-Aufgaben (älteste zuerst) bis etwa zur Hälfte der Zeit, mindestens eine.
 * 4. Die übrige Zeit: fällige Karteikarten (am längsten fällig, niedrigstes Fach zuerst), sonst neue Karten. Es gelten die
 *    Einstellungen Prüferfragen/Fachgespräch; im Leicht-Modus nur Karten mit 4 Antworten. Je Thema Blöcke bis HEUTE_KARTEN_BLOCK.
 * 5. Alles nach Thema verschränkt (verschraenke).
 * Was heute schon dran war (`ausschliessen`, dazu heute bearbeitete Aufgaben und geprüfte Übungen), kommt nicht noch einmal.
 */
export function planeHeute(content: KernInhalt, progress: Progress, opt: PlanOptionen = {}): HeutePlan {
  const today = opt.today ?? localDate();
  const zufall = opt.zufall ?? erzeugeZufall(seedAusText(today)).zahl;
  const ziel = opt.minuten ?? HEUTE_MINUTEN;
  const topicTitle = (id: string | undefined) => content.topics.find((t) => t.id === id)?.title;
  // Heute schon dran: aus früheren Runden, heute bearbeitete Aufgaben, heute geprüfte SQL- und Rechenübungen.
  const schonHeute = new Set(opt.ausschliessen);
  for (const a of progress.attempts) if ((a.date.length === 10 ? a.date : localDate(new Date(a.date))) === today) schonHeute.add(a.taskId);
  const heuteGeprueft = (s: { lastCheckedAt?: string } | undefined) => s?.lastCheckedAt?.slice(0, 10) === today;
  const items: HeuteItem[] = [];
  let minuten = 0;
  const add = (it: HeuteItem) => {
    items.push(it);
    minuten += it.minuten;
  };
  const aufgabeItem = (art: 'wiederholung' | 'aufgabe', task: Task): HeuteItem => ({
    key: `${art}:${task.id}`,
    art,
    ids: [task.id],
    thema: task.topicId,
    titel: `${art === 'wiederholung' ? 'Wiederholung' : 'Aufgabe'} ${task.code} · ${topicTitle(task.topicId) ?? task.topicId}`,
    minuten: aufgabeMinuten(task.points),
    link: art === 'wiederholung' ? `/aufgabe/${task.id}?modus=wiederholung` : `/aufgabe/${task.id}`,
  });

  // 3. Fehlerjournal (zuerst ausgewählt, damit die Zusatzaufgabe keine fällige Wiederholung doppelt nimmt).
  const journal = Object.values(progress.journal)
    .filter((j) => !j.resolvedAt && isDue(j.due, today) && content.tasks[j.taskId] && !schonHeute.has(j.taskId))
    .sort((a, b) => a.due.localeCompare(b.due) || a.addedAt.localeCompare(b.addedAt));
  const journalItems: HeuteItem[] = [];
  let journalMinuten = 0;
  for (const j of journal) {
    const it = aufgabeItem('wiederholung', content.tasks[j.taskId]);
    if (journalItems.length && journalMinuten + it.minuten > ziel / 2) break;
    journalItems.push(it);
    journalMinuten += it.minuten;
  }
  const verplant = new Set(journalItems.map((it) => it.ids[0]));

  // 1. Schwächstes Thema und eine Aufgabe daraus.
  // Ausgeblendete Lernblätter kommen nicht als schwächstes Thema in Frage; fällige Wiederholungen ihrer Aufgaben bleiben.
  const stats = topicStats(content, progress).filter((s) => s.topic.exam?.blocks.length && !istAusgeblendet(progress.settings, s.topic.id));
  const mitDaten = stats.filter((s) => s.lastExam !== undefined || s.avgTaskPct !== undefined);
  const schwach = mitDaten.length
    ? mitDaten.reduce((a, b) => ((b.lastExam ?? b.avgTaskPct!) < (a.lastExam ?? a.avgTaskPct!) ? b : a))
    : stats.reduce<(typeof stats)[number] | undefined>((a, b) => (!a || b.attempts < a.attempts ? b : a), undefined);
  const schwaechstesThema = schwach?.topic.id;
  if (schwach) {
    const letzte = new Map<string, number>();
    for (const a of progress.attempts) letzte.set(a.taskId, a.max > 0 ? a.points / a.max : 0);
    const kandidaten = Object.values(content.tasks).filter(
      (t) => t.topicId === schwach.topic.id && !t.generated && !verplant.has(t.id) && !schonHeute.has(t.id),
    );
    const neu = kandidaten.filter((t) => !letzte.has(t.id));
    const unvollstaendig = kandidaten.filter((t) => (letzte.get(t.id) ?? 1) < 1).sort((a, b) => letzte.get(a.id)! - letzte.get(b.id)!);
    const wahl = neu.length
      ? neu[Math.floor(zufall() * neu.length)]
      : (unvollstaendig[0] ?? kandidaten[Math.floor(zufall() * kandidaten.length)]);
    if (wahl) add(aufgabeItem('aufgabe', wahl));
  }

  // 2. SQL- und Rechenübungen.
  type Uebung = { art: 'sql' | 'rechnen'; id: string; titel: string; topicId?: string; due: string };
  const sqlUebungen: Uebung[] = content.sqlExercises.map((e) => ({
    art: 'sql',
    id: e.id,
    titel: e.titel,
    topicId: e.topicId,
    due: progress.sql[e.id]?.due ?? '',
  }));
  const rechenUebungen: Uebung[] = content.rechenUebungen.map((u) => ({
    art: 'rechnen',
    id: u.id,
    titel: u.titel,
    topicId: u.topicId,
    due: progress.rechnen[u.id]?.due ?? '',
  }));
  const frisch = (u: Uebung) => !schonHeute.has(u.id) && !heuteGeprueft(u.art === 'sql' ? progress.sql[u.id] : progress.rechnen[u.id]);
  const faellig = [
    ...sqlUebungen.filter((u) => sqlStatus(progress.sql[u.id], today) === 'faellig'),
    ...rechenUebungen.filter((u) => rechenStatus(progress.rechnen[u.id], today) === 'faellig'),
  ]
    .filter(frisch)
    .sort((a, b) => a.due.localeCompare(b.due) || a.id.localeCompare(b.id));
  let uebungen = faellig.slice(0, 2);
  if (!uebungen.length) {
    const offen = [
      ...rechenUebungen.filter((u) => !progress.rechnen[u.id]?.solvedAt),
      ...sqlUebungen.filter((u) => !progress.sql[u.id]?.solvedAt),
    ].filter(frisch);
    const passend = offen.filter((u) => schwaechstesThema && u.topicId === schwaechstesThema);
    const pool = passend.length ? passend : offen;
    if (pool.length) uebungen = [pool[Math.floor(zufall() * pool.length)]];
  }
  for (const u of uebungen) {
    add({
      key: `${u.art}:${u.id}`,
      art: u.art,
      ids: [u.id],
      thema: themaVon(u.topicId, u.art),
      titel: `${u.art === 'sql' ? 'SQL' : 'Rechnen'}: ${u.titel}`,
      minuten: u.art === 'sql' ? HEUTE_ZEITEN.sql : HEUTE_ZEITEN.rechnen,
      link: u.art === 'sql' ? `/sql/uebung/${u.id}` : `/rechnen/${u.id}`,
    });
  }

  for (const it of journalItems) add(it);

  // 4. Karteikarten mit der übrigen Zeit.
  const { settings } = progress;
  let pool: Flashcard[] = cardPool(content.flashcards, settings).filter((c) => !schonHeute.has(c.id));
  if (settings.leichtModus) {
    const leicht = leichtKartenGemerkt(pool, { automatisch: leichtAutomatischAn(settings) });
    pool = pool.filter((c) => leicht.has(c.id));
  }
  const proKarte = settings.leichtModus ? HEUTE_ZEITEN.karteLeicht : HEUTE_ZEITEN.karte;
  const faelligeKarten = pool
    .filter((c) => progress.cards[c.id] && isDue(progress.cards[c.id].due, today))
    .sort(
      (a, b) => progress.cards[a.id].due.localeCompare(progress.cards[b.id].due) || progress.cards[a.id].box - progress.cards[b.id].box,
    );
  const neueKarten = pool.filter((c) => !progress.cards[c.id]);
  const platz = Math.max(Math.floor((ziel - minuten) / proKarte), Math.min(5, faelligeKarten.length + neueKarten.length));
  const karten = [...faelligeKarten, ...neueKarten.slice(0, NEW_PER_SESSION)].slice(0, platz);
  const nachThema = new Map<string, Flashcard[]>();
  for (const c of karten) {
    const thema = themaVon(c.topicId, c.deckId ? `deck:${c.deckId}` : 'karten');
    nachThema.set(thema, [...(nachThema.get(thema) ?? []), c]);
  }
  for (const [thema, liste] of nachThema) {
    for (let i = 0; i < liste.length; i += HEUTE_KARTEN_BLOCK) {
      const block = liste.slice(i, i + HEUTE_KARTEN_BLOCK);
      const deck = content.decks.find((d) => d.id === block[0].deckId);
      const name = topicTitle(block[0].topicId) ?? deck?.title ?? 'gemischt';
      add({
        key: `karten:${thema}:${i}`,
        art: 'karten',
        ids: block.map((c) => c.id),
        thema,
        titel: `${block.length} ${block.length === 1 ? 'Karteikarte' : 'Karteikarten'} · ${name}`,
        minuten: Math.max(1, Math.round(block.length * proKarte)),
        link: `/karteikarten?karten=${block.map((c) => encodeURIComponent(c.id)).join(',')}`,
      });
    }
  }

  return { items: verschraenke(items), minuten, schwaechstesThema };
}
