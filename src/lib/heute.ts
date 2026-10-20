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
}

/** Reihum je Thema/Deck eine Karte, damit neue Karten nicht alle aus dem ersten Thema der Datei stammen. */
function mischeNachThema(karten: Flashcard[]): Flashcard[] {
  const gruppen = new Map<string, Flashcard[]>();
  for (const c of karten) {
    const k = c.topicId ?? c.deckId ?? '';
    gruppen.set(k, [...(gruppen.get(k) ?? []), c]);
  }
  const listen = [...gruppen.values()];
  const out: Flashcard[] = [];
  for (let i = 0; out.length < karten.length; i++) for (const l of listen) if (i < l.length) out.push(l[i]);
  return out;
}

const themaVon = (topicId: string | undefined, fallback: string) => topicId ?? fallback;

/**
 * Plant die Tagesrunde:
 * 1. Eine Aufgabe aus dem schwächsten Thema und eine zweite (nicht bei kurzer Runde) aus dem am längsten nicht geübten Thema (letzte Klausur, sonst Ø Aufgaben; ohne Daten: das Thema mit den wenigsten Versuchen) –
 *    nur eine noch nie bearbeitete; ist das Thema durch, das nächstschwächere.
 * 2. 1–2 Übungen: fällige SQL- und Rechenübungen (älteste zuerst, höchstens 2); ist keine fällig, eine ungelöste
 *    (bevorzugt aus dem schwächsten Thema).
 * 3. Fällige Fehlerjournal-Aufgaben (älteste zuerst) bis etwa zur Hälfte der Zeit, mindestens eine.
 * 4. Die übrige Zeit: fällige Karteikarten (am längsten fällig, niedrigstes Fach zuerst), sonst neue Karten. Es gelten die
 *    Einstellungen Prüferfragen/Fachgespräch; im Leicht-Modus nur Karten mit 4 Antworten. Je Thema Blöcke bis HEUTE_KARTEN_BLOCK.
 * 5. Alles nach Thema verschränkt (verschraenke).
 */
export function planeHeute(content: KernInhalt, progress: Progress, opt: PlanOptionen = {}): HeutePlan {
  const today = opt.today ?? localDate();
  const zufall = opt.zufall ?? erzeugeZufall(seedAusText(today)).zahl;
  const ziel = opt.minuten ?? HEUTE_MINUTEN;
  const topicTitle = (id: string | undefined) => content.topics.find((t) => t.id === id)?.title;
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
    .filter((j) => !j.resolvedAt && isDue(j.due, today) && content.tasks[j.taskId])
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
    // Bereits beantwortete Aufgaben kommen nicht mehr vor (zurücksetzbar auf der Aufgabenseite); ist das schwächste Thema
    // durch, kommt das nächstschwächere an die Reihe.
    const beantwortet = new Set(progress.attempts.map((a) => a.taskId));
    const staerke = (s: (typeof stats)[number]) => s.lastExam ?? s.avgTaskPct ?? Infinity;
    const reihenfolge = [schwach, ...stats.filter((s) => s !== schwach).sort((a, b) => staerke(a) - staerke(b))];
    const offen = (s: (typeof stats)[number]) =>
      Object.values(content.tasks).filter((t) => t.topicId === s.topic.id && !t.generated && !verplant.has(t.id) && !beantwortet.has(t.id));
    const gewaehlt = reihenfolge.find((s) => offen(s).length);
    if (gewaehlt) {
      const neu = offen(gewaehlt);
      add(aufgabeItem('aufgabe', neu[Math.floor(zufall() * neu.length)]));
      // Zweite Aufgabe aus einem anderen Thema – dem, das am längsten nicht geübt wurde (nie geübt zuerst) –, damit über die
      // Tage alle Themen drankommen und nicht nur die schwächsten.
      const zuletzt = new Map<string, string>();
      for (const a of progress.attempts) {
        const t = content.tasks[a.taskId];
        if (t && a.date > (zuletzt.get(t.topicId) ?? '')) zuletzt.set(t.topicId, a.date);
      }
      const weitere = reihenfolge
        .filter((s) => s !== gewaehlt && offen(s).length)
        .sort((a, b) => (zuletzt.get(a.topic.id) ?? '').localeCompare(zuletzt.get(b.topic.id) ?? ''));
      if (weitere.length && ziel >= HEUTE_MINUTEN) {
        const rest = offen(weitere[0]);
        add(aufgabeItem('aufgabe', rest[Math.floor(zufall() * rest.length)]));
      }
    }
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
  const faellig = [
    ...sqlUebungen.filter((u) => sqlStatus(progress.sql[u.id], today) === 'faellig'),
    ...rechenUebungen.filter((u) => rechenStatus(progress.rechnen[u.id], today) === 'faellig'),
  ].sort((a, b) => a.due.localeCompare(b.due) || a.id.localeCompare(b.id));
  let uebungen = faellig.slice(0, 2);
  if (!uebungen.length) {
    const offen = [
      ...rechenUebungen.filter((u) => !progress.rechnen[u.id]?.solvedAt),
      ...sqlUebungen.filter((u) => !progress.sql[u.id]?.solvedAt),
    ];
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
  let pool: Flashcard[] = cardPool(content.flashcards, settings);
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
  const neueKarten = mischeNachThema(pool.filter((c) => !progress.cards[c.id]));
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
