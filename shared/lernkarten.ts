// Import der Lernkarten-Datei (z. B. AP2_FIDPA_Lernkarten.json) mit Decks, Kartentyp, Schwierigkeit, Tags und optionalem Block „mc“ (Leicht-Modus).

import { z } from 'zod';
import { pruefeSvg } from './svgDiagramm.ts';
import type { CardType, Deck, Flashcard, ImportIssue, KartenMc } from './types.ts';

const CARD_TYPES: CardType[] = ['wissen', 'abgrenzung', 'rechnung', 'anwendung', 'falle', 'begriff'];

const pflichtText = z.string().trim().min(1);
// Wahlfelder wie „mc“ und „diagramm“ haben eigene Prüfungen und Fehlerhinweise.
const kartenSchema = z.looseObject({ id: pflichtText, frage: pflichtText, antwort: pflichtText });

interface RawDeck {
  id?: unknown;
  titel?: unknown;
  pruefungsbereich?: unknown;
  quelle?: unknown;
  status?: unknown;
  anzahl_karten?: unknown;
  karten?: unknown;
}

/** Vergleichsform für „gleiche Antwort“: ohne Groß-/Kleinschreibung, Mehrfach-Leerzeichen und Schlusspunkt. */
export const mcNorm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.\s]+$/, '')
    .trim();

const McText = z.string().trim().min(1, 'leerer Text');

/**
 * Optionaler Block „mc“ einer Lernkarte (Leicht-Modus, ROADMAP 6.2): genau 3 verschiedene falsche Antworten,
 * keine davon gleich der richtigen.
 */
export const KartenMcSchema = z
  .object({
    richtig: McText,
    falsch: z.array(McText).length(3, 'genau 3 falsche Antworten nötig'),
    erklaerung: z.string().trim().min(1).optional(),
  })
  .superRefine((mc, ctx) => {
    const r = mcNorm(mc.richtig);
    const f = mc.falsch.map(mcNorm);
    if (new Set(f).size !== f.length) ctx.addIssue({ code: 'custom', path: ['falsch'], message: 'falsche Antworten doppelt' });
    if (f.includes(r)) ctx.addIssue({ code: 'custom', path: ['falsch'], message: 'eine falsche Antwort ist gleich der richtigen' });
  });

/** Prüft einen mc-Block; liefert den bereinigten Block oder eine deutsche Fehlermeldung. */
export function pruefeMc(raw: unknown): { mc: KartenMc; fehler?: undefined } | { mc?: undefined; fehler: string } {
  const r = KartenMcSchema.safeParse(raw);
  if (r.success) {
    const { richtig, falsch, erklaerung } = r.data;
    return { mc: { richtig, falsch: [falsch[0], falsch[1], falsch[2]], ...(erklaerung ? { erklaerung } : {}) } };
  }
  const i = r.error.issues[0];
  return { fehler: `${i.path.length ? `${i.path.join('.')}: ` : ''}${i.message}` };
}

export interface ParsedCards {
  decks: Deck[];
  cards: Flashcard[];
  hints: string[];
  issues: ImportIssue[];
}

/**
 * Ordnet ein Deck über seine Quelle einem Deep Dive zu. Nennt die Quelle mehrere
 * („Deep Dive 5 und 12"), gewinnt der Deep Dive, dessen Titel den Decktitel enthält.
 */
export function topicFromSource(source: string, deckTitle: string, topics: Map<string, string>): string | undefined {
  const nums = [...source.matchAll(/(?:Deep Dive|und|,|\+)\s*(\d+)/gi)].map((m) => m[1].padStart(2, '0')).filter((id) => topics.has(id));
  if (!/Deep Dive/i.test(source) || !nums.length) return undefined;
  const title = deckTitle.toLowerCase();
  return nums.find((id) => topics.get(id)!.toLowerCase().includes(title)) ?? nums[0];
}

/**
 * Antworten enthalten „\n" als Zeilenumbruch (z. B. SQL). Für die Markdown-Anzeige werden
 * zusammenhängende Code-Zeilen zu einem Codeblock, alle übrigen Umbrüche bleiben erhalten.
 */
export function answerToMarkdown(answer: string): string {
  // Nur ganze, großgeschriebene SQL-Schlüsselwörter – sonst landet z. B. „Alternative:" im Codeblock.
  const CODE =
    /^\s*(?:(?:SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|INSERT|UPDATE|DELETE|SET|VALUES|CREATE|ALTER|DROP|UNION|WITH|LIMIT|ON|AND|OR|(?:(?:LEFT|RIGHT|INNER|FULL)(?: OUTER)? )?JOIN)\b|\)|--)/;
  const lines = answer.replace(/\r/g, '').split('\n');
  if (lines.length === 1) return answer;
  const out: string[] = [];
  let code: string[] = [];
  const flush = () => {
    if (code.length) out.push('```sql\n' + code.join('\n') + '\n```');
    code = [];
  };
  for (const line of lines) {
    if (CODE.test(line)) code.push(line);
    else {
      flush();
      out.push(line);
    }
  }
  flush();
  // Einzelne Textzeilen als harte Umbrüche, Codeblöcke als eigene Absätze.
  return out
    .map((l) => (l.startsWith('```') ? `\n${l}\n` : `${l}  `))
    .join('\n')
    .trim();
}

export function parseLernkarten(fileName: string, json: string, topics: Map<string, string>): ParsedCards {
  const issues: ImportIssue[] = [];
  const result: ParsedCards = { decks: [], cards: [], hints: [], issues };
  let data: { meta?: { hinweise?: unknown; anzahl_karten?: unknown }; decks?: unknown } | null;
  try {
    data = JSON.parse(json);
  } catch (e) {
    issues.push({ file: fileName, message: `Ungültiges JSON: ${(e as Error).message}` });
    return result;
  }
  if (!Array.isArray(data?.decks)) {
    issues.push({ file: fileName, message: 'Kein Feld „decks" gefunden.' });
    return result;
  }
  if (Array.isArray(data.meta?.hinweise)) result.hints = data.meta!.hinweise.filter((h): h is string => typeof h === 'string');

  const seen = new Set<string>();
  for (const raw of data.decks as (RawDeck | null)[]) {
    const deckId = String(raw?.id ?? '').trim();
    if (!deckId || !Array.isArray(raw?.karten)) {
      issues.push({ file: fileName, message: `Deck ohne ID oder Karten übersprungen (${String(raw?.titel ?? '?')}).` });
      continue;
    }
    const source = String(raw.quelle ?? '');
    const topicId = topicFromSource(source, String(raw.titel ?? ''), topics);
    const cards: Flashcard[] = [];
    for (const [index, eintrag] of raw.karten.entries()) {
      const parsed = kartenSchema.safeParse(eintrag);
      if (!parsed.success) {
        const feld = parsed.error.issues[0].path[0];
        const grund = feld ? `Feld „${String(feld)}“ fehlt oder ist kein ausgefüllter Text` : 'Objekt erwartet';
        issues.push({ file: fileName, message: `Deck „${deckId}“, Karte ${index + 1} übersprungen: ${grund}.` });
        continue;
      }
      const k = parsed.data;
      const { id, frage: question } = k;
      if (seen.has(id)) {
        issues.push({ file: fileName, message: `Doppelte Karten-ID ${id} übersprungen.` });
        continue;
      }
      seen.add(id);
      const typ = CARD_TYPES.includes(k.typ as CardType) ? (k.typ as CardType) : undefined;
      if (k.typ !== undefined && !typ) issues.push({ file: fileName, message: `Karte ${id}: unbekannter Typ „${String(k.typ)}".` });
      // Ein fehlerhafter mc-Block wird gemeldet, die Karte bleibt (ohne Leicht-Antworten) nutzbar.
      const mc = k.mc === undefined ? undefined : pruefeMc(k.mc);
      if (mc?.fehler) issues.push({ file: fileName, message: `Karte ${id}: Block „mc“ ignoriert (${mc.fehler}).` });
      // Zeichnung (SVG, Positivliste wie in den Lernblättern): bei Verstoß gemeldet und weggelassen, die Karte bleibt nutzbar.
      let diagramm = typeof k.diagramm === 'string' && k.diagramm.trim() ? k.diagramm.trim() : undefined;
      const svgFehler = diagramm ? pruefeSvg(diagramm) : undefined;
      if (svgFehler) {
        issues.push({ file: fileName, message: `Karte ${id}: Feld „diagramm“ ignoriert (${svgFehler})` });
        diagramm = undefined;
      }
      const rechenweg = typeof k.rechenweg === 'string' && k.rechenweg.trim() ? k.rechenweg.trim() : undefined;
      cards.push({
        id,
        topicId,
        kind: 'lernkarte',
        question,
        answer: answerToMarkdown(k.antwort),
        deckId,
        typ,
        schwierigkeit: typeof k.schwierigkeit === 'number' ? k.schwierigkeit : undefined,
        tags: Array.isArray(k.tags) ? k.tags.map(String) : [],
        ...(mc?.mc ? { mc: mc.mc } : {}),
        ...(diagramm ? { diagramm } : {}),
        ...(rechenweg ? { rechenweg } : {}),
      });
    }
    if (typeof raw.anzahl_karten === 'number' && raw.anzahl_karten !== cards.length) {
      issues.push({ file: fileName, message: `Deck „${deckId}": ${cards.length} Karten importiert, laut Datei ${raw.anzahl_karten}.` });
    }
    result.decks.push({
      id: deckId,
      title: String(raw.titel ?? deckId),
      area: String(raw.pruefungsbereich ?? ''),
      source,
      status: raw.status === 'offen' ? 'offen' : 'behandelt',
      topicId,
      cardCount: cards.length,
    });
    result.cards.push(...cards);
  }
  return result;
}
