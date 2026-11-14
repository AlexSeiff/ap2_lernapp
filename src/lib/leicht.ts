// Leicht-Modus der Karteikarten (ROADMAP Phase 6, Umsetzungsplan Phase 5): 4 Antworten, 1 richtig. Reine Funktionen, getestet in
// tests/leicht.test.ts. Quelle der Antworten: der geprüfte Block „mc“ der Karte, sonst (abschaltbar) automatisch die Antworten
// verwandter bzw. ähnlicher Karten – siehe leichtKarten().

import { mcNorm } from '../../shared/lernkarten';
import type { Settings } from '../../shared/progress';
import type { CardType, Flashcard } from '../../shared/types';
import { shuffle } from './shuffle';

/** Kartentypen, für die automatische Antworten erzeugt werden (ROADMAP 6.1). `anwendung` nur mit eigenem mc-Block. */
export const LEICHT_TYPEN: readonly CardType[] = ['wissen', 'abgrenzung', 'falle', 'rechnung', 'begriff'];

/**
 * Höchstlänge einer Antwort (als Auswahltext) für automatische Antworten. Die Roadmap nennt 120 Zeichen – damit kämen aber nur
 * 4 der 407 Lernkarten in Frage (die meisten Antworten sind 150–250 Zeichen lang). 200 Zeichen sind noch gut als Auswahl lesbar.
 */
export const LEICHT_AUTO_MAX = 200;

/** Aus so vielen besten Kandidaten werden je Runde die 3 falschen gezogen (etwas Abwechslung, ohne schwache Kandidaten). */
const AUTO_POOL = 4;

/**
 * Qualitätsschwelle (Umsetzungsplan Phase 5): Ein nicht kuratierter Kandidat braucht mindestens diese Ähnlichkeit (Wortähnlichkeit
 * von Frage und Antwort plus Bonus für gemeinsame Schlagworte bzw. denselben Abschnitt). Gibt es keine 3 solchen, fällt die Karte im
 * Leicht-Modus weg – besser als offensichtlich falsche Antworten.
 */
export const MIN_AEHNLICHKEIT = 0.1;

/**
 * Antworten, die sich ähnlicher sind als das (Kosinus der Antworttexte), sagen fast dasselbe – als falsche Antwort wären sie unfair.
 * Bei Lernkarten und Prüferfragen strenger: Die Antwort einer anderen Karte ist ja auch eine wahre Aussage, und zum selben Punkt
 * (WHERE vs. HAVING ↔ „Warum ist WHERE COUNT(*) falsch?“, 0,39) wäre sie kaum falsch. Bei Begriffskarten ist die Definition eines
 * anderen Begriffs dagegen klar falsch, auch wenn sie ähnlich klingt.
 */
const MAX_GLEICHE_ANTWORT = { begriff: 0.8, sonst: 0.35 } as const;

const BONUS = { abgrenzung: 10, siehe: 5, abschnitt: 0.15, tag: 0.15, typ: 0.05 } as const;

export type LeichtArt = 'mc' | 'automatisch';

export interface LeichtKarte {
  art: LeichtArt;
  richtig: string;
  /** mc: genau 3; automatisch: 3–4 Kandidaten (die besten zuerst), aus denen je Runde 3 gezogen werden. */
  falsch: string[];
  erklaerung?: string;
  /**
   * Nur Begriffskarten: umgekehrt abfragen – die Erklärung ist gegeben (`frage`, Markdown), gesucht ist der Begriff;
   * die falschen Antworten sind die Begriffe der verwandten Karten.
   */
  umgekehrt?: { frage: string; richtig: string; falsch: string[] };
}

export interface LeichtOption {
  text: string;
  richtig: boolean;
}

/** Ist der automatische Ersatz eingeschaltet? Fehlt die Einstellung (ältere Stände), gilt: ja. */
export const leichtAutomatischAn = (s: Pick<Settings, 'leichtAutomatisch'>) => s.leichtAutomatisch !== false;

/** Antwort (Markdown aus der Lernkarten-Datei) als einzeiliger Auswahltext: ohne Codezäune, Fettdruck und harte Umbrüche. */
export function optionText(markdown: string): string {
  return (
    markdown
      .replace(/```\w*\n?/g, ' ')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      // Bewusst geschützte Leerzeichen in Formeln bleiben auch auf den Auswahlknöpfen erhalten.
      .replace(/[ \t\r\n]+/g, ' ')
      .trim()
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Wortähnlichkeit (TF-IDF, Kosinus)

/** Häufige deutsche Wörter ohne Aussagekraft (in der Form nach `woerter`: klein, ohne Umlaute). */
const STOPPWOERTER = new Set(
  (
    'der die das den dem des ein eine einer eines einem einen und oder aber nicht kein keine ist sind war wird werden wurde kann können ' +
    'muss soll mit von vom zum zur aus auf bei fur uber unter nach vor durch ohne gegen als wie was wer wen wem welche welcher welches ' +
    'auch noch nur schon sehr mehr sich sie ihr ihre sein seine man hat haben dass wenn dann also bzw etwa jede jeder jedes alle ' +
    'diese dieser dieses nennen beschreiben erlautern erklare erklaren warum wozu wann heisst bedeutet versteht gibt'
  ).split(/\s+/),
);

/** Wörter eines Textes für den Vergleich: klein, ohne Umlaute/Akzente, ohne Stoppwörter, auf 7 Zeichen gekürzt (grober Wortstamm). */
export function woerter(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !STOPPWOERTER.has(w))
    .map((w) => w.slice(0, 7));
}

type Vektor = Map<string, number>;

/** TF-IDF-Vektoren (L2-normiert) zu Wortlisten; Wörter, die in allen Texten vorkommen, zählen nicht. */
export function tfidf(texte: string[][]): Vektor[] {
  const df = new Map<string, number>();
  for (const t of texte) for (const w of new Set(t)) df.set(w, (df.get(w) ?? 0) + 1);
  const n = texte.length;
  return texte.map((t) => {
    const v: Vektor = new Map();
    for (const w of t) v.set(w, (v.get(w) ?? 0) + 1);
    let summe = 0;
    for (const [w, tf] of v) {
      const x = tf * Math.log((1 + n) / (1 + df.get(w)!));
      v.set(w, x);
      summe += x * x;
    }
    const laenge = Math.sqrt(summe) || 1;
    for (const [w, x] of v) v.set(w, x / laenge);
    return v;
  });
}

export function kosinus(a: Vektor, b: Vektor): number {
  const [klein, gross] = a.size <= b.size ? [a, b] : [b, a];
  let s = 0;
  for (const [w, x] of klein) s += x * (gross.get(w) ?? 0);
  return s;
}

// ---------------------------------------------------------------------------------------------------------------------------------

/** Antwortart einer Karte: Begriffskarten nur mit Begriffskarten (eine Definition unter Sätzen fiele auf), Prüferfragen unter sich. */
function art(c: Flashcard): 'begriff' | 'pf' | 'karte' | undefined {
  if (c.kind === 'fachgespraech') return undefined;
  if (c.kind === 'prueferfrage') return 'pf';
  return c.typ === 'begriff' ? 'begriff' : 'karte';
}

/** Kandidaten für Ähnlichkeit: dieselbe Antwortart im selben Thema (ohne Thema: im selben Deck). */
function bereich(c: Flashcard): string | undefined {
  const a = art(c);
  const ort = c.topicId ?? (c.deckId ? `deck:${c.deckId}` : undefined);
  return a && ort ? `${a}:${ort}` : undefined;
}

type Kurz = { card: Flashcard; text: string; norm: string; voll: Vektor; antwort: Vektor };

/** Zuletzt berechnete Ergebnisse von leichtKartenGemerkt (Karten, Schalter, Ergebnis). */
const gemerkt: { cards: Flashcard[]; automatisch: boolean; ergebnis: Map<string, LeichtKarte> }[] = [];

/**
 * leichtKarten() mit Gedächtnis (Umsetzungsplan Phase 10): Die Ähnlichkeitsrechnung über alle Karten kostet auf dem Handy einige
 * hundert Millisekunden – bisher bei jedem Öffnen der Karteikarten und auf „Heute lernen“ nach jeder Bewertung. Gleiche Karten
 * (dieselben Objekte in derselben Reihenfolge, der Inhalt ändert sich in der App nie) → dasselbe Ergebnis. Das Ergebnis nicht verändern.
 */
export function leichtKartenGemerkt(cards: Flashcard[], opts: { automatisch: boolean }): Map<string, LeichtKarte> {
  const treffer = gemerkt.find(
    (g) => g.automatisch === opts.automatisch && g.cards.length === cards.length && g.cards.every((c, i) => c === cards[i]),
  );
  if (treffer) return treffer.ergebnis;
  const ergebnis = leichtKarten(cards, opts);
  gemerkt.unshift({ cards, automatisch: opts.automatisch, ergebnis });
  gemerkt.length = Math.min(gemerkt.length, 4);
  return ergebnis;
}

/**
 * Alle Karten, die den Leicht-Modus unterstützen, mit ihrer Antwortquelle.
 * - Mit Block „mc“: immer (außer Fachgespräch-Fragen – die sind fürs freie Sprechen).
 * - Automatisch (wenn eingeschaltet): Lernkarten der Typen in LEICHT_TYPEN und Prüferfragen, deren Antwort höchstens LEICHT_AUTO_MAX
 *   Zeichen hat. Die falschen Antworten sind Antworten anderer Karten, ausgewählt in Stufen (Umsetzungsplan Phase 5):
 *   1. kuratiert: Begriffe aus „Abgrenzung“, dann aus „Siehe auch“ der Begriffsseite (Flashcard.abgrenzung/.siehe);
 *   2. ähnlich: Karten derselben Art im selben Thema – Wortähnlichkeit von Frage und Antwort (TF-IDF, Kosinus), dazu ein Bonus für
 *      denselben Abschnitt, gemeinsame seltene Schlagworte und gleichen Typ; die Länge sortiert nur noch fein;
 *   3. Schwelle: nicht kuratierte Kandidaten brauchen MIN_AEHNLICHKEIT. Zu ähnliche Antworten (MAX_GLEICHE_ANTWORT) und doppelte fallen
 *      weg. Bleiben keine 3, fällt die Karte im Leicht-Modus weg.
 *   Begriffskarten mit 3 Kandidaten lassen sich auch umgekehrt abfragen (`umgekehrt`).
 */
export function leichtKarten(cards: Flashcard[], opts: { automatisch: boolean; minAehnlichkeit?: number }): Map<string, LeichtKarte> {
  const minAehnlichkeit = opts.minAehnlichkeit ?? MIN_AEHNLICHKEIT;
  const out = new Map<string, LeichtKarte>();
  const roh: { card: Flashcard; text: string }[] = [];
  for (const c of cards) {
    if (c.kind === 'fachgespraech') continue;
    if (c.mc) {
      out.set(c.id, {
        art: 'mc',
        richtig: c.mc.richtig,
        falsch: [...c.mc.falsch],
        ...(c.mc.erklaerung ? { erklaerung: c.mc.erklaerung } : {}),
      });
    }
    if (!opts.automatisch || !bereich(c) || !c.answer) continue;
    const text = optionText(c.answer);
    if (text && text.length <= LEICHT_AUTO_MAX) roh.push({ card: c, text });
  }
  if (!opts.automatisch) return out;

  const voll = tfidf(roh.map((k) => woerter(`${k.card.question} ${k.text}`)));
  const antwort = tfidf(roh.map((k) => woerter(k.text)));
  const kurz: Kurz[] = roh.map((k, i) => ({ ...k, norm: mcNorm(k.text), voll: voll[i], antwort: antwort[i] }));
  const nachId = new Map(kurz.map((k) => [k.card.id, k]));
  const nachBereich = new Map<string, Kurz[]>();
  for (const k of kurz) {
    const b = bereich(k.card)!;
    const liste = nachBereich.get(b) ?? [];
    liste.push(k);
    nachBereich.set(b, liste);
  }
  // Seltene Schlagworte (an höchstens 8 Karten bzw. 5 %) verbinden; „fachbegriff“ steht an jeder Begriffskarte und sagt nichts.
  const tagDf = new Map<string, number>();
  for (const k of kurz) for (const t of new Set(k.card.tags ?? [])) tagDf.set(t, (tagDf.get(t) ?? 0) + 1);
  const selten = (t: string) => (tagDf.get(t) ?? 0) <= Math.max(8, kurz.length * 0.05);

  for (const k of kurz) {
    const c = k.card;
    if (out.has(c.id)) continue;
    if (c.kind === 'lernkarte' && !(c.typ && LEICHT_TYPEN.includes(c.typ))) continue;
    const kuratiert = new Map<string, number>();
    for (const id of c.abgrenzung ?? []) kuratiert.set(id, BONUS.abgrenzung);
    for (const id of c.siehe ?? []) if (!kuratiert.has(id)) kuratiert.set(id, BONUS.siehe);
    const kandidaten = new Set(nachBereich.get(bereich(c)!) ?? []);
    for (const id of kuratiert.keys()) {
      const x = nachId.get(id);
      if (x && art(x.card) === art(c)) kandidaten.add(x);
    }
    const tags = new Set((c.tags ?? []).filter(selten));
    const maxGleich = art(c) === 'begriff' ? MAX_GLEICHE_ANTWORT.begriff : MAX_GLEICHE_ANTWORT.sonst;
    const bewertet: { x: Kurz; wert: number }[] = [];
    for (const x of kandidaten) {
      if (x === k || x.norm === k.norm || kosinus(x.antwort, k.antwort) >= maxGleich) continue;
      const gemeinsam = (x.card.tags ?? []).filter((t) => tags.has(t)).length;
      const aehnlich =
        kosinus(x.voll, k.voll) +
        Math.min(gemeinsam, 2) * BONUS.tag +
        (c.abschnitt && x.card.abschnitt === c.abschnitt ? BONUS.abschnitt : 0) +
        (x.card.typ === c.typ ? BONUS.typ : 0);
      const kur = kuratiert.get(x.card.id) ?? 0;
      if (!kur && aehnlich < minAehnlichkeit) continue;
      const laenge = Math.abs(Math.log(x.text.length / k.text.length)) * 0.05;
      bewertet.push({ x, wert: kur + aehnlich - laenge });
    }
    bewertet.sort((a, b) => b.wert - a.wert);
    const gesehen = new Set([k.norm]);
    const pool = bewertet
      .map((b) => b.x)
      .filter((x) => !gesehen.has(x.norm) && gesehen.add(x.norm))
      .slice(0, AUTO_POOL);
    if (pool.length < 3) continue;
    const karte: LeichtKarte = { art: 'automatisch', richtig: k.text, falsch: pool.map((x) => x.text) };
    if (art(c) === 'begriff') {
      const begriff = optionText(c.question);
      const namen = new Set([mcNorm(begriff)]);
      const andere = pool.map((x) => optionText(x.card.question)).filter((n) => !namen.has(mcNorm(n)) && namen.add(mcNorm(n)));
      if (andere.length >= 3) karte.umgekehrt = { frage: c.answer!, richtig: begriff, falsch: andere };
    }
    out.set(c.id, karte);
  }
  return out;
}

/** Die 4 Auswahlmöglichkeiten einer Karte in zufälliger Reihenfolge (Fisher–Yates): die richtige und 3 verschiedene falsche. */
export function kartenOptionen(l: Pick<LeichtKarte, 'art' | 'richtig' | 'falsch'>, rng: () => number = Math.random): LeichtOption[] {
  const falsch = l.art === 'mc' ? l.falsch.slice(0, 3) : shuffle(l.falsch, rng).slice(0, 3);
  return shuffle([{ text: l.richtig, richtig: true }, ...falsch.map((text) => ({ text, richtig: false }))], rng);
}

/** Eine Leicht-Abfrage: die Optionen und – bei umgekehrter Abfrage – die gegebene Erklärung (`frage`, sonst gilt die Kartenfrage). */
export interface LeichtAbfrage {
  optionen: LeichtOption[];
  frage?: string;
}

/** Richtung und Optionen einer Runde: Begriffskarten mit `umgekehrt` kommen zur Hälfte umgekehrt (Erklärung → Begriff). */
export function leichtAbfrage(l: LeichtKarte, rng: () => number = Math.random): LeichtAbfrage {
  if (l.umgekehrt && rng() < 0.5) {
    return { frage: l.umgekehrt.frage, optionen: kartenOptionen({ art: 'automatisch', ...l.umgekehrt }, rng) };
  }
  return { optionen: kartenOptionen(l, rng) };
}

export interface LeichtZahlen {
  gesamt: number;
  mc: number;
  automatisch: number;
}

/** Wie viele der Karten den Leicht-Modus unterstützen (für die Anzeige an den Filtern). */
export function leichtZahlen(cards: Pick<Flashcard, 'id'>[], leicht: Map<string, LeichtKarte>): LeichtZahlen {
  const z = { gesamt: cards.length, mc: 0, automatisch: 0 };
  for (const c of cards) {
    const l = leicht.get(c.id);
    if (l?.art === 'mc') z.mc++;
    else if (l) z.automatisch++;
  }
  return z;
}
