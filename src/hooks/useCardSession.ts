import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CardState, Rating } from '../../shared/progress';
import type { Flashcard } from '../../shared/types';
import { cardPool, filterCards, isKindEnabled, readCardFilter, withCardFilter, type CardFilter } from '../lib/cards';
import { markierteIds } from '../lib/markiert';
import { leichtAbfrage, leichtAutomatischAn, leichtKartenGemerkt, type LeichtKarte, type LeichtOption } from '../lib/leicht';
import { rateCard, rateCardLeicht } from '../lib/progress';
import { shuffle } from '../lib/shuffle';
import { useStore } from '../lib/store';
import { erzeugeZufall, neuerSeed } from '../rechnen/zufall';

/**
 * Filterzustand der Karteikarten-Seite – liegt in der URL, damit Links wie `?thema=03&typ=falle` funktionieren.
 * Im Leicht-Modus (settings.leichtModus) enthält `deck` nur Karten mit 4 Antworten; `alle` ist dann die ungefilterte Auswahl.
 */
export function useCardFilters() {
  const { content, progress } = useStore();
  const { prueferfragen, fachgespraech, leichtModus } = progress.settings;
  const automatisch = leichtAutomatischAn(progress.settings);
  const [params, setParams] = useSearchParams();
  const read = readCardFilter(params);
  // Eine ausgeschaltete Kartenart im Link (?art=prueferfrage) zählt wie „alle“ – im Leicht-Modus auch Fachgespräch (nur frei).
  const kindOk = isKindEnabled(read.art, { prueferfragen, fachgespraech }) && !(leichtModus && read.art === 'fachgespraech');
  const f = kindOk ? read : { ...read, art: 'alle' };
  const set = (changes: Partial<CardFilter>) => setParams(withCardFilter(params, changes), { replace: true });
  const pool = useMemo(() => cardPool(content.flashcards, { prueferfragen, fachgespraech }), [content, prueferfragen, fachgespraech]);
  const leicht = useMemo(() => leichtKartenGemerkt(pool, { automatisch }), [pool, automatisch]);
  const markiert = useMemo(() => markierteIds(progress), [progress]);
  // ?karten=ID,ID,… (aus „Heute lernen“): genau diese Karten, die übrigen Filter gelten dann nicht.
  const auswahlParam = params.get('karten');
  const alle = useMemo(() => {
    if (auswahlParam !== null) {
      const ids = new Set(auswahlParam.split(',').filter(Boolean));
      return pool.filter((c) => ids.has(c.id));
    }
    return filterCards(pool, { thema: f.thema, deck: f.deck, art: f.art, typ: f.typ, stufe: f.stufe, markiert: f.markiert }, markiert);
  }, [pool, auswahlParam, f.thema, f.deck, f.art, f.typ, f.stufe, f.markiert, markiert]);
  const deck = useMemo(() => (leichtModus ? alle.filter((c) => leicht.has(c.id)) : alle), [alle, leicht, leichtModus]);
  // ?von=suche: die Auswahl kommt aus der globalen Suche (ROADMAP 8.8), nicht aus „Heute lernen“.
  return {
    f,
    set,
    deck,
    alle,
    pool,
    leicht,
    leichtModus,
    markiert,
    auswahl: auswahlParam !== null,
    ausSuche: params.get('von') === 'suche',
    vonBegriff: params.get('von') === 'begriff',
    vonStand: params.get('von') === 'stand',
  };
}

/** Auswahl im Leicht-Modus: die gemischten Antworten der aktuellen Karte und die gewählte (null = noch offen). */
export interface LeichtRunde {
  karte: LeichtKarte;
  optionen: LeichtOption[];
  /** Umgekehrte Abfrage einer Begriffskarte: die gegebene Erklärung (Markdown); gesucht ist dann der Begriff. */
  frage?: string;
  gewaehlt: number | null;
}

/**
 * Eine Lernrunde: gemischte Kartenfolge, Umdrehen, Bewerten (Leitner) und Tastatur (Leertaste/Enter, 1 2 3).
 * Mit `leicht` (Leicht-Modus): 4 Antworten je Karte, Tasten 1–4 wählen, Enter/Leertaste → nächste Karte.
 */
export function useCardSession() {
  const { update, progress } = useStore();
  const [session, setSession] = useState<Flashcard[] | null>(null);
  const [leicht, setLeicht] = useState<Map<string, LeichtKarte> | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  /** „Deine Antwort“ zur aktuellen Karte (ROADMAP 8.2) – nur in der Runde, nicht gespeichert. */
  const [eigeneAntwort, setEigeneAntwort] = useState('');
  /** Zufall der Runde: die Reihenfolge der Antworten hängt von ihm und der Position ab – stabil beim erneuten Rendern. */
  const [rundenSeed, setRundenSeed] = useState(1);
  const [done, setDone] = useState({ gewusst: 0, unsicher: 0, nicht: 0 });
  /** Letzte Bewertung (Aufdecken-Modus) zum Rückgängigmachen: Karte, Stand davor und ob sie noch einmal hinten angehängt wurde. */
  const [letzte, setLetzte] = useState<{
    id: string;
    rating: Rating;
    vorher?: CardState;
    tage: Record<string, number>;
    angehaengt: boolean;
  } | null>(null);

  const start = (cards: Flashcard[], leichtModus: Map<string, LeichtKarte> | null = null) => {
    setSession(shuffle(cards));
    setLeicht(leichtModus);
    setRundenSeed(neuerSeed());
    setIndex(0);
    setFlipped(false);
    setGewaehlt(null);
    setEigeneAntwort('');
    setDone({ gewusst: 0, unsicher: 0, nicht: 0 });
    setLetzte(null);
  };
  const end = () => setSession(null);
  const flip = () => setFlipped((x) => !x);

  const card = session?.[index];
  const leichtKarte = card && leicht?.get(card.id);
  // Gemischt (und bei Begriffskarten die Richtung gewählt) je Runde und Position – eine wiederholte Karte kommt anders, beim erneuten
  // Rendern gleich.
  const abfrage = useMemo(
    () => (leichtKarte ? leichtAbfrage(leichtKarte, erzeugeZufall(rundenSeed + index).zahl) : null),
    [leichtKarte, rundenSeed, index],
  );
  const optionen = abfrage?.optionen ?? null;
  const runde: LeichtRunde | null =
    leichtKarte && abfrage
      ? { karte: leichtKarte, optionen: abfrage.optionen, ...(abfrage.frage ? { frage: abfrage.frage } : {}), gewaehlt }
      : null;

  const next = useCallback(() => {
    setIndex((i) => i + 1);
    setFlipped(false);
    setGewaehlt(null);
    setEigeneAntwort('');
  }, []);

  const rate = useCallback(
    (r: Rating) => {
      if (!card || !session) return;
      setLetzte({ id: card.id, rating: r, vorher: progress.cards[card.id], tage: progress.cardReviewDays, angehaengt: r === 'nicht' });
      update((p) => rateCard(p, card.id, r));
      setDone((d) => ({ ...d, [r]: d[r] + 1 }));
      // „Nicht gewusst" kommt in dieser Runde noch einmal dran.
      if (r === 'nicht') setSession([...session, card]);
      next();
    },
    [card, session, update, next, progress.cards, progress.cardReviewDays],
  );

  /** Letzte Bewertung zurücknehmen: Kartenstand und Lerntage wie vorher, die Karte steht wieder umgedreht zum Neubewerten bereit. */
  const rueckgaengig = useCallback(() => {
    if (!letzte || !session || index === 0) return;
    const { id, rating, vorher, tage, angehaengt } = letzte;
    update((p) => {
      const cards = { ...p.cards };
      if (vorher) cards[id] = vorher;
      else delete cards[id];
      return { ...p, cards, cardReviewDays: tage };
    });
    setDone((d) => ({ ...d, [rating]: Math.max(0, d[rating] - 1) }));
    if (angehaengt) setSession(session.slice(0, -1));
    setIndex((i) => i - 1);
    setFlipped(true);
    setEigeneAntwort('');
    setLetzte(null);
  }, [letzte, session, index, update]);

  /** Leicht-Modus: Antwort `i` wählen – sofort bewertet (Fach höchstens 2), falsche Karten kommen in der Runde wieder. */
  const waehle = useCallback(
    (i: number) => {
      if (!card || !session || !optionen || gewaehlt !== null || !optionen[i]) return;
      const richtig = optionen[i].richtig;
      setGewaehlt(i);
      update((p) => rateCardLeicht(p, card.id, richtig));
      setDone((d) => (richtig ? { ...d, gewusst: d.gewusst + 1 } : { ...d, nicht: d.nicht + 1 }));
      if (!richtig) setSession([...session, card]);
    },
    [card, session, optionen, gewaehlt, update],
  );

  useEffect(() => {
    if (!card) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      // Beim Tippen (z. B. „Deine Antwort“) keine Tastenkürzel.
      if (target?.closest('input, select, textarea, [contenteditable="true"]')) return;
      const weiterTaste = e.key === ' ' || e.code === 'Space' || e.key === 'Enter';
      if (optionen) {
        if (gewaehlt === null && /^[1-4]$/.test(e.key)) waehle(Number(e.key) - 1);
        else if (gewaehlt !== null && weiterTaste && !target?.closest('button, a, [role="button"]')) {
          e.preventDefault();
          next();
        }
        return;
      }
      if (weiterTaste) {
        // Fokus auf einem Button (auch der Karte selbst, role="button"): der löst selbst aus – sonst würde doppelt umgedreht
        // bzw. „✓ Gewusst“ per Enter nur umdrehen statt bewerten.
        if (target?.closest('button, a, [role="button"]')) return;
        e.preventDefault();
        setFlipped((x) => !x);
      } else if (flipped && e.key === '1') rate('gewusst');
      else if (flipped && e.key === '2') rate('unsicher');
      else if (flipped && e.key === '3') rate('nicht');
      else if ((e.key === 'u' || e.key === 'U') && letzte) rueckgaengig();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, flipped, rate, optionen, gewaehlt, waehle, next, letzte, rueckgaengig]);

  return {
    session,
    index,
    card,
    flipped,
    done,
    start,
    end,
    flip,
    rate,
    runde,
    waehle,
    next,
    eigeneAntwort,
    setEigeneAntwort,
    kannRueckgaengig: !!letzte && !runde,
    rueckgaengig,
  };
}
