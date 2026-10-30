// „Heute lernen“ (ROADMAP 8.1): plant aus dem, was fällig ist, eine gemischte Runde von etwa HEUTE_MINUTEN Minuten.
// Rein (ohne React, ohne Speicher): gleicher Stand + gleicher Tag → gleicher Plan. Die Sitzung (welcher Schritt gerade dran ist)
// steht in lib/heuteSitzung.ts, die Seite in pages/Heute.tsx.

import { HEUTE_KARTEN_BLOCK, HEUTE_MINUTEN, HEUTE_ZEITEN, NEW_PER_SESSION } from '../../shared/config';
import type { Progress } from '../../shared/progress';
import type { Flashcard, Task } from '../../shared/types';
import { erzeugeZufall, seedAusText } from '../rechnen/zufall';
import { cardPool, rundenKarten } from './cards';
import { leichtAutomatischAn, leichtKartenGemerkt } from './leicht';
import { isDue, localDate } from './progress';
import { diagrammUebungen } from './diagramme';
import { istAusgeblendet } from './settings';
import { topicStats } from './stats';
import { letzterStand } from './wiederholung';
import type { IconName } from './icons';
import type { KernInhalt } from '../../shared/texte';

export type HeuteArt = 'wiederholung' | 'aufgabe' | 'sql' | 'rechnen' | 'diagramm' | 'karten';

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
  diagramm: 'workflow',
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
 * 1. Eine Aufgabe aus dem schwächsten Thema und eine zweite (nicht bei kurzer Runde) aus dem am längsten nicht geübten Thema (letzte
 *    Klausur, sonst Ø Aufgaben; ohne Daten: das Thema mit den wenigsten Versuchen) – nur eine noch nie bearbeitete, die neben dem
 *    Fehlerjournal und einer Übung in die Dauer passt; ist das Thema durch oder passt keine, das nächste. Falsch beantwortete Aufgaben
 *    kommen über das Fehlerjournal (3.).
 * 2. 1–2 Übungen (SQL, Rechnen, Diagramm): zuletzt nicht richtig gelöste (falsch oder Lösung angesehen; am längsten her zuerst,
 *    höchstens 2); gibt es keine, eine noch nie bearbeitete (bevorzugt aus dem schwächsten Thema). Zuletzt richtig gelöste nie.
 * 3. Fällige Fehlerjournal-Aufgaben, deren letzter Versuch unter voller Punktzahl lag (älteste zuerst), bis etwa zur Hälfte der Zeit,
 *    mindestens eine.
 * 4. Die übrige Zeit: neue Karteikarten, solange es noch nie gesehene gibt; erst danach fällige (am längsten fällig, niedrigstes
 *    Fach zuerst, siehe rundenKarten). Es gelten die
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
    .filter((j) => !j.resolvedAt && isDue(j.due, today) && j.lastPoints < j.max && content.tasks[j.taskId] && !schonHeute.has(j.taskId))
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

  // 2. (vorab) SQL-, Rechen- und Diagramm-Übungen: nur neue und zuletzt nicht richtig gelöste. Vor den Aufgaben ausgewählt, damit
  // ihre Zeit reserviert ist – Fehler wiederholen geht vor neuem Stoff.
  type Uebung = {
    art: 'sql' | 'rechnen' | 'diagramm';
    id: string;
    titel: string;
    topicId?: string;
    stand: Parameters<typeof letzterStand>[0];
  };
  const alleUebungen: Uebung[] = [
    ...content.sqlExercises.map((e): Uebung => ({ art: 'sql', id: e.id, titel: e.titel, topicId: e.topicId, stand: progress.sql[e.id] })),
    ...content.rechenUebungen.map((u): Uebung => ({
      art: 'rechnen',
      id: u.id,
      titel: u.titel,
      topicId: u.topicId,
      stand: progress.rechnen[u.id],
    })),
    ...diagrammUebungen(content).map((u): Uebung => ({ art: 'diagramm', id: u.id, titel: u.titel, stand: progress.diagramme[u.id] })),
  ].filter((u) => !schonHeute.has(u.id) && !heuteGeprueft(u.stand));
  const seit = (u: Uebung) => u.stand?.due ?? u.stand?.lastCheckedAt ?? '';
  const falsch = alleUebungen
    .filter((u) => letzterStand(u.stand) === 'falsch')
    .sort((a, b) => seit(a).localeCompare(seit(b)) || a.id.localeCompare(b.id));
  // Eine Übung immer, eine zweite falsch gelöste nur, wenn neben dem Fehlerjournal Platz für beide ist.
  const falschGeplant = falsch.slice(0, ziel - journalMinuten >= 2 * HEUTE_ZEITEN.sql ? 2 : 1);
  const uebungMinuten = falschGeplant.length
    ? falschGeplant.reduce((s, u) => s + HEUTE_ZEITEN[u.art], 0)
    : alleUebungen.some((u) => letzterStand(u.stand) === 'neu')
      ? HEUTE_ZEITEN.sql
      : 0;

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
    // Zeitbudget: Aufgaben nur, wenn sie neben Fehlerjournal und Übungen in die gewählte Dauer passen. Ohne diese Grenze machte
    // eine 25-P-Aufgabe (~23 min) aus einer 20-Minuten-Runde 40 Minuten. Passt im Thema keine, kommt das nächste dran.
    const budget = () => ziel - journalMinuten - uebungMinuten - minuten;
    const offen = (s: (typeof stats)[number]) =>
      Object.values(content.tasks).filter(
        (t) =>
          t.topicId === s.topic.id &&
          !t.generated &&
          !verplant.has(t.id) &&
          !beantwortet.has(t.id) &&
          !schonHeute.has(t.id) &&
          aufgabeMinuten(t.points) <= budget(),
      );
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

  // 2. Übungen eintragen: die falsch gelösten von oben, sonst eine neue (bevorzugt aus dem schwächsten Thema).
  let uebungen = falschGeplant;
  if (!uebungen.length) {
    const neu = alleUebungen.filter((u) => letzterStand(u.stand) === 'neu');
    const passend = neu.filter((u) => schwaechstesThema && u.topicId === schwaechstesThema);
    const pool = passend.length ? passend : neu;
    if (pool.length) uebungen = [pool[Math.floor(zufall() * pool.length)]];
  }
  const UEBUNG = {
    sql: { name: 'SQL', minuten: HEUTE_ZEITEN.sql, link: (id: string) => `/sql/uebung/${id}` },
    rechnen: { name: 'Rechnen', minuten: HEUTE_ZEITEN.rechnen, link: (id: string) => `/rechnen/${id}` },
    diagramm: { name: 'Diagramm', minuten: HEUTE_ZEITEN.diagramm, link: (id: string) => `/diagramme/${id}` },
  };
  for (const u of uebungen) {
    add({
      key: `${u.art}:${u.id}`,
      art: u.art,
      ids: [u.id],
      thema: themaVon(u.topicId, u.art),
      titel: `${UEBUNG[u.art].name}: ${u.titel}`,
      minuten: UEBUNG[u.art].minuten,
      link: UEBUNG[u.art].link(u.id),
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
  // Neue Karten: erst Prüfungskarten, Begriffskarten danach – wie das Kartenziel im Lernplan (lib/lernplan.ts).
  const neu = pool.filter((c) => !progress.cards[c.id]);
  const neueKarten = [
    ...mischeNachThema(neu.filter((c) => c.typ !== 'begriff')),
    ...mischeNachThema(neu.filter((c) => c.typ === 'begriff')),
  ];
  const kandidaten = rundenKarten(faelligeKarten, neueKarten, NEW_PER_SESSION);
  const platz = Math.max(Math.floor((ziel - minuten) / proKarte), Math.min(5, kandidaten.length));
  const karten = kandidaten.slice(0, platz);
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
        // Genau, nicht je Block aufgerundet: 5 einzelne Karten aus 5 Themen sind 2,5 min, nicht 5. Gerundet wird erst in der Anzeige.
        minuten: block.length * proKarte,
        link: `/karteikarten?karten=${block.map((c) => encodeURIComponent(c.id)).join(',')}`,
      });
    }
  }

  return { items: verschraenke(items), minuten, schwaechstesThema };
}
