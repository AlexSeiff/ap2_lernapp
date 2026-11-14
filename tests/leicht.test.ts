import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { mcNorm } from '../shared/lernkarten';
import type { Flashcard } from '../shared/types';
import { cardPool } from '../src/lib/cards';
import {
  kartenOptionen,
  kosinus,
  LEICHT_AUTO_MAX,
  leichtAbfrage,
  leichtAutomatischAn,
  leichtKarten,
  leichtZahlen,
  optionText,
  tfidf,
  woerter,
  type LeichtKarte,
} from '../src/lib/leicht';

/** mulberry32 – reproduzierbarer Zufall. */
function seeded(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const karte = (id: string, answer: string, extra: Partial<Flashcard> = {}): Flashcard => ({
  id,
  kind: 'lernkarte',
  question: `Frage ${id}`,
  answer,
  deckId: 'd',
  topicId: '01',
  typ: 'wissen',
  tags: [],
  ...extra,
});

describe('optionText', () => {
  it('macht aus Markdown einen einzeiligen Auswahltext', () => {
    expect(optionText('**Fett** und `code`  \nzweite Zeile')).toBe('Fett und code zweite Zeile');
    expect(optionText('```sql\nSELECT 1\n```')).toBe('SELECT 1');
    expect(optionText('Zaun: Q1\u00a0−\u00a01,5\u00a0·\u00a0IQR')).toBe('Zaun: Q1\u00a0−\u00a01,5\u00a0·\u00a0IQR');
  });
});

describe('leichtKarten', () => {
  // Antworten mit gemeinsamen Fachwörtern – ähnlich genug für die Qualitätsschwelle.
  const sql = [
    karte('A', 'Filtert einzelne Zeilen einer Tabelle.', { question: 'Was macht WHERE in einer SQL-Abfrage?' }),
    karte('B', 'Filtert Gruppen anhand von Aggregaten.', { question: 'Was macht HAVING in einer SQL-Abfrage?' }),
    karte('C', 'Bildet Gruppen gleicher Werte.', { question: 'Was macht GROUP BY in einer SQL-Abfrage?' }),
    karte('D', 'Sortiert das Ergebnis auf- oder absteigend.', { question: 'Was macht ORDER BY in einer SQL-Abfrage?' }),
  ];
  const fremd = [
    karte('X1', 'Kündigungsschutz gilt nach sechs Monaten Betriebszugehörigkeit.'),
    karte('X2', 'Die Probezeit dauert mindestens einen Monat.'),
    karte('X3', 'Der Betriebsrat wird für vier Jahre gewählt.'),
  ];

  it('ähnliche Karten desselben Themas: 3–4 Kandidaten, die richtige nie darunter', () => {
    const m = leichtKarten([...sql, ...fremd], { automatisch: true });
    const a = m.get('A')!;
    expect(a.art).toBe('automatisch');
    expect(a.richtig).toBe(sql[0].answer);
    expect([...a.falsch].sort()).toEqual([sql[1].answer, sql[2].answer, sql[3].answer].sort());
  });

  it('Qualitätsschwelle: ohne ähnliche Antworten fällt die Karte weg – auch wenn es 3 andere im Deck gibt', () => {
    const m = leichtKarten([...sql, ...fremd], { automatisch: true });
    expect([...m.keys()].sort()).toEqual(['A', 'B', 'C', 'D']);
    // Ohne Schwelle hätten die fremden Karten Antworten bekommen (Test-Hebel minAehnlichkeit)
    expect(leichtKarten([...sql, ...fremd], { automatisch: true, minAehnlichkeit: 0 }).has('X1')).toBe(true);
  });

  it('seltene gemeinsame Schlagworte zählen als Ähnlichkeit', () => {
    const tag = (id: string, question: string, answer: string) => karte(id, answer, { question, tags: ['betriebsrat'] });
    const mitTag = [
      tag('T1', 'Wie oft wird gewählt?', 'Alle vier Jahre.'),
      tag('T2', 'Ab welcher Größe?', 'Ab fünf Beschäftigten.'),
      tag('T3', 'Wobei mitbestimmen?', 'Bei der Arbeitszeit.'),
      tag('T4', 'Was gilt vor einer Kündigung?', 'Anhörung.'),
    ];
    const ohne = mitTag.map((c) => ({ ...c, tags: [] }));
    expect(leichtKarten([...mitTag, ...sql], { automatisch: true }).has('T1')).toBe(true);
    expect(leichtKarten([...ohne, ...sql], { automatisch: true }).has('T1')).toBe(false);
  });

  it('lange Antworten, anwendung, Fachgespräch und andere Themen nicht', () => {
    const cards = [
      ...sql,
      karte('L', `WHERE Gruppierung Aggregatfunktionen ${'x'.repeat(LEICHT_AUTO_MAX)}`),
      karte('F', 'WHERE filtert Zeilen vor der Gruppierung, ohne Aggregatfunktionen.', { typ: 'anwendung' }),
      karte('FG', 'HAVING filtert Gruppen.', { kind: 'fachgespraech', deckId: undefined, typ: undefined }),
      karte('Z', 'HAVING filtert Gruppen nach der Gruppierung.', { topicId: '02', deckId: 'z' }),
    ];
    const m = leichtKarten(cards, { automatisch: true });
    expect([...m.keys()].sort()).toEqual(['A', 'B', 'C', 'D']);
    const alleFalschen = [...m.values()].flatMap((l) => l.falsch);
    expect(alleFalschen.some((f) => f.includes('xxxx'))).toBe(false);
    expect(alleFalschen).not.toContain('HAVING filtert Gruppen.');
    expect(alleFalschen).not.toContain('HAVING filtert Gruppen nach der Gruppierung.');
    // anwendung-Antworten dürfen als falsche Antwort vorkommen, nur die Karte selbst bekommt keine automatischen
  });

  it('gleiche und zu ähnliche Antworten zählen nie als falsche', () => {
    const doppelt = [...sql, karte('E', sql[0].answer!.toUpperCase()), karte('G', `${sql[1].answer} Beispiel: HAVING COUNT(*) > 1.`)];
    const m = leichtKarten(doppelt, { automatisch: true });
    expect(m.get('A')!.falsch.map(mcNorm)).not.toContain(mcNorm(sql[0].answer!));
    expect(m.get('B')!.falsch.some((f) => f.includes('Beispiel: HAVING'))).toBe(false);
  });

  it('Begriffskarten: zuerst Abgrenzung, dann Siehe auch – auch ohne Wortähnlichkeit, aus anderen Decks; nur Begriffe als Antworten', () => {
    const begriff = (id: string, frage: string, answer: string, extra: Partial<Flashcard> = {}) =>
      karte(id, answer, { question: frage, typ: 'begriff', ...extra });
    const cards = [
      begriff('FB-having', 'HAVING', 'Filtert Gruppen nach der Gruppierung.', {
        abgrenzung: ['FB-where'],
        siehe: ['FB-group', 'FB-fenster'],
      }),
      begriff('FB-where', 'WHERE', 'Filtert einzelne Zeilen vorab.'),
      begriff('FB-group', 'GROUP BY', 'Bildet Gruppen gleicher Werte.', { deckId: 'anderes', topicId: '07' }),
      begriff('FB-fenster', 'Fensterfunktion', 'Rechnet über ein Fenster mit OVER.'),
      begriff('FB-mut', 'Mutterschutz', 'Beschäftigungsverbot sechs Wochen vor der Geburt.'),
      karte('SQL-1', 'HAVING filtert Gruppen nach der Gruppierung mit COUNT.'),
    ];
    const l = leichtKarten(cards, { automatisch: true }).get('FB-having')!;
    expect(l.falsch).toEqual(['Filtert einzelne Zeilen vorab.', 'Bildet Gruppen gleicher Werte.', 'Rechnet über ein Fenster mit OVER.']);
    expect(l.umgekehrt).toEqual({
      frage: 'Filtert Gruppen nach der Gruppierung.',
      richtig: 'HAVING',
      falsch: ['WHERE', 'GROUP BY', 'Fensterfunktion'],
    });
    // WHERE hat keine verwandten Karten und keine ähnlichen → fällt weg
    expect(leichtKarten(cards, { automatisch: true }).has('FB-where')).toBe(false);
  });

  it('mc-Block hat Vorrang und gilt auch ohne Automatik und für anwendung; nie für Fachgespräch', () => {
    const mc = { richtig: 'r', falsch: ['f1', 'f2', 'f3'] as [string, string, string], erklaerung: 'weil' };
    const cards = [...sql, karte('M', 'x'.repeat(500), { typ: 'anwendung', mc }), karte('M2', 'kurz', { kind: 'fachgespraech', mc })];
    const ohne = leichtKarten(cards, { automatisch: false });
    expect([...ohne.keys()]).toEqual(['M']);
    expect(ohne.get('M')).toEqual({ art: 'mc', richtig: 'r', falsch: ['f1', 'f2', 'f3'], erklaerung: 'weil' });
    expect(leichtKarten(cards, { automatisch: true }).get('M')!.art).toBe('mc');
  });

  it('Prüferfragen: nur andere Prüferfragen desselben Themas', () => {
    const pf = (id: string, topicId: string, answer: string) =>
      karte(id, answer, { kind: 'prueferfrage', deckId: undefined, typ: undefined, topicId });
    const cards = [...sql.map((c, i) => pf(`P${i + 1}`, '01', c.answer!)), pf('Q1', '02', sql[0].answer!), ...sql];
    const m = leichtKarten(cards, { automatisch: true });
    expect([...m.keys()].filter((id) => /^[PQ]/.test(id)).sort()).toEqual(['P1', 'P2', 'P3', 'P4']);
    expect([...m.get('P1')!.falsch].sort()).toEqual([sql[1].answer, sql[2].answer, sql[3].answer].sort());
  });

  it('Einstellung: fehlt = an', () => {
    expect(leichtAutomatischAn({})).toBe(true);
    expect(leichtAutomatischAn({ leichtAutomatisch: true })).toBe(true);
    expect(leichtAutomatischAn({ leichtAutomatisch: false })).toBe(false);
  });
});

describe('Wortähnlichkeit', () => {
  it('woerter: klein, ohne Umlaute und Stoppwörter, auf 7 Zeichen gekürzt', () => {
    expect(woerter('Die Gruppierung über Aggregatfunktionen – ist für WHERE verboten!')).toEqual([
      'gruppie',
      'aggrega',
      'where',
      'verbote',
    ]);
  });

  it('tfidf + kosinus: gleiche Texte 1, ohne gemeinsame Wörter 0, Wörter in allen Texten zählen nicht', () => {
    const [a, b, c, d] = tfidf([
      woerter('Zeilen filtern Gruppen'),
      woerter('Zeilen filtern Gruppen'),
      woerter('Zeilen Probezeit Monat'),
      woerter('Zeilen Betriebsrat Wahl'),
    ]);
    expect(kosinus(a, b)).toBeCloseTo(1);
    expect(kosinus(a, d)).toBe(0); // „Zeilen“ steht überall
    expect(kosinus(c, d)).toBe(0);
  });
});

describe('leichtAbfrage (Richtung)', () => {
  const l: LeichtKarte = {
    art: 'automatisch',
    richtig: 'Definition',
    falsch: ['d1', 'd2', 'd3'],
    umgekehrt: { frage: '**Definition**', richtig: 'Begriff', falsch: ['B1', 'B2', 'B3'] },
  };

  it('Begriffskarten kommen etwa zur Hälfte umgekehrt, dann mit Begriffen als Antworten', () => {
    let umgekehrt = 0;
    for (let s = 1; s <= 200; s++) {
      const a = leichtAbfrage(l, seeded(s));
      expect(a.optionen).toHaveLength(4);
      if (a.frage) {
        umgekehrt++;
        expect(a.frage).toBe('**Definition**');
        expect(a.optionen.find((o) => o.richtig)!.text).toBe('Begriff');
      } else expect(a.optionen.find((o) => o.richtig)!.text).toBe('Definition');
    }
    expect(umgekehrt).toBeGreaterThan(60);
    expect(umgekehrt).toBeLessThan(140);
  });

  it('ohne `umgekehrt` immer vorwärts', () => {
    const { umgekehrt: _u, ...vor } = l;
    for (let s = 1; s <= 50; s++) expect(leichtAbfrage(vor, seeded(s)).frage).toBeUndefined();
  });
});

describe('kartenOptionen', () => {
  const pruefe = (l: LeichtKarte, seed: number) => {
    const o = kartenOptionen(l, seeded(seed));
    expect(o).toHaveLength(4);
    expect(o.filter((x) => x.richtig)).toEqual([{ text: l.richtig, richtig: true }]);
    expect(new Set(o.map((x) => mcNorm(x.text))).size).toBe(4);
    for (const x of o.filter((y) => !y.richtig)) expect(l.falsch).toContain(x.text);
    return o;
  };

  it('genau 4, die richtige dabei, keine doppelt (mc und automatisch, viele Seeds)', () => {
    const mc: LeichtKarte = { art: 'mc', richtig: 'r', falsch: ['a', 'b', 'c'] };
    const auto: LeichtKarte = { art: 'automatisch', richtig: 'r', falsch: ['a', 'b', 'c', 'd', 'e', 'f'] };
    const plaetze = new Set<number>();
    const gezogen = new Set<string>();
    for (let s = 1; s <= 200; s++) {
      plaetze.add(pruefe(mc, s).findIndex((x) => x.richtig));
      for (const x of pruefe(auto, s)) gezogen.add(x.text);
    }
    expect(plaetze).toEqual(new Set([0, 1, 2, 3])); // gemischt: die richtige steht mal hier, mal da
    expect(gezogen.size).toBe(7); // aus dem Pool wird abwechselnd gezogen
  });

  it('mit dem echten Inhalt: jede unterstützte Karte bekommt 4 verschiedene Antworten', () => {
    const c = loadContent(CONTENT_DIR);
    const m = leichtKarten(c.flashcards, { automatisch: true });
    expect(m.size).toBeGreaterThan(700);
    let s = 1;
    for (const l of m.values()) {
      pruefe(l, s++);
      if (l.umgekehrt) pruefe({ art: 'automatisch', ...l.umgekehrt }, s++);
    }
  });

  it('mit dem echten Inhalt: HAVING bekommt zuerst WHERE als falsche Antwort, Begriffskarten fast alle (Umsetzungsplan Phase 5)', () => {
    const c = loadContent(CONTENT_DIR);
    const m = leichtKarten(c.flashcards, { automatisch: true });
    const def = (id: string) => optionText(c.flashcards.find((x) => x.id === id)!.answer!);
    const having = m.get('FB-having')!;
    expect(having.falsch[0]).toBe(def('FB-where'));
    expect(having.umgekehrt?.falsch).toContain('WHERE');
    expect(having.umgekehrt?.falsch).toContain('GROUP BY');
    const begriffe = c.flashcards.filter((x) => x.typ === 'begriff');
    expect(begriffe.filter((x) => m.has(x.id)).length).toBeGreaterThan(begriffe.length * 0.9);
  });
});

describe('leichtZahlen (Filteranzeige)', () => {
  it('zählt unterstützte Karten nach Quelle', () => {
    const m = new Map<string, LeichtKarte>([
      ['A', { art: 'mc', richtig: 'r', falsch: ['a', 'b', 'c'] }],
      ['B', { art: 'automatisch', richtig: 'r', falsch: ['a', 'b', 'c'] }],
    ]);
    expect(leichtZahlen([{ id: 'A' }, { id: 'B' }, { id: 'C' }], m)).toEqual({ gesamt: 3, mc: 1, automatisch: 1 });
  });

  it('ausgeschaltete Prüferfragen fallen auch im Leicht-Modus weg', () => {
    const sql = [
      karte('A', 'Filtert einzelne Zeilen einer Tabelle.', { question: 'Was macht WHERE in einer SQL-Abfrage?' }),
      karte('B', 'Filtert Gruppen anhand von Aggregaten.', { question: 'Was macht HAVING in einer SQL-Abfrage?' }),
      karte('C', 'Bildet Gruppen gleicher Werte.', { question: 'Was macht GROUP BY in einer SQL-Abfrage?' }),
      karte('D', 'Sortiert das Ergebnis auf- oder absteigend.', { question: 'Was macht ORDER BY in einer SQL-Abfrage?' }),
    ];
    const pf = (c: Flashcard, i: number): Flashcard => ({ ...c, id: `P${i + 1}`, kind: 'prueferfrage', deckId: undefined, typ: undefined });
    const fremd = [karte('X1', 'Nach sechs Monaten.'), karte('X2', 'Mindestens einen Monat.'), karte('X3', 'Für vier Jahre.')];
    const cards = [...sql.map(pf), ...sql, ...fremd];
    const pool = cardPool(cards, { prueferfragen: false, fachgespraech: true });
    expect(leichtZahlen(pool, leichtKarten(pool, { automatisch: true }))).toEqual({ gesamt: 7, mc: 0, automatisch: 4 });
  });
});
