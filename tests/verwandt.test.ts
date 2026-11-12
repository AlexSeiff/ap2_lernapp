import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, ladeInhalt } from '../build/inhalt';
import type { BegriffsSeite, Flashcard } from '../shared/types';
import { abgrenzungsNamen, ergaenzeVerwandte } from '../shared/verwandt';

// Verwandte Begriffskarten aus „Abgrenzung“ und „Siehe auch“ (Umsetzungsplan Phase 5) – Grundlage der kuratierten falschen Antworten.

const seite = (begriff: string, markdown: string, extra: Partial<BegriffsSeite> = {}): BegriffsSeite => ({
  id: begriff.toLowerCase(),
  begriff,
  markdown,
  siehe: [],
  mehr: [],
  quellen: '',
  datei: 'Begriffsseiten_X.md',
  ...extra,
});
const karte = (id: string, question: string, typ: Flashcard['typ'] = 'begriff'): Flashcard => ({
  id,
  kind: 'lernkarte',
  question,
  answer: `Definition ${question}`,
  typ,
});

describe('abgrenzungsNamen', () => {
  it('Kopfzeile und erste Spalte der Tabelle, Fettgedrucktes im Text; nur im Abschnitt „Abgrenzung“', () => {
    const md = [
      'Kurz **Definition**.',
      '### Abgrenzung',
      '| | WHERE | `HAVING` |',
      '|---|---|---|',
      '| filtert | Zeilen | Gruppen |',
      '| **GROUP BY** | davor | danach |',
      '',
      'Nicht zu verwechseln mit **Fensterfunktion** oder [Unterabfrage](#/glossar/unterabfrage).',
      '### Merksatz',
      'Merke **WHERE vor HAVING**.',
    ].join('\n');
    expect(abgrenzungsNamen(md)).toEqual(['WHERE', 'HAVING', 'filtert', 'GROUP BY', 'Fensterfunktion']);
  });

  it('ohne Abschnitt: leer; Abschnitt am Ende der Seite wird gelesen', () => {
    expect(abgrenzungsNamen('### Erklärung\n**Fett**')).toEqual([]);
    expect(abgrenzungsNamen('### Abgrenzung\nAnders als **Kanban**')).toEqual(['Kanban']);
  });
});

describe('ergaenzeVerwandte', () => {
  const cards = [
    karte('FB-having', 'HAVING'),
    karte('FB-where', 'WHERE'),
    karte('FB-group-by', 'GROUP BY'),
    karte('FB-pk', 'Primärschlüssel (PK)'),
    karte('SQL-1', 'WHERE', 'wissen'),
  ];
  const seiten = [
    seite('HAVING', '### Abgrenzung\n| | WHERE | HAVING |\n|---|---|---|\n| filtert | Zeilen | Gruppen |', {
      siehe: ['GROUP BY', 'WHERE', 'Primary Key', 'Unbekannt'],
      mehr: ['Deep Dive 1, 2.1', 'SQL-Zusatz, 3.1'],
    }),
    seite('Primärschlüssel', 'Text', { auch: ['Primary Key'] }),
  ];
  const out = ergaenzeVerwandte(cards, seiten);
  const nachId = (id: string) => out.find((c) => c.id === id)!;

  it('Abgrenzung und Siehe auch getrennt, ohne sich selbst und ohne Doppelte; Auch-Varianten und Klammerzusätze passen', () => {
    expect(nachId('FB-having')).toMatchObject({ abgrenzung: ['FB-where'], siehe: ['FB-group-by', 'FB-pk'], abschnitt: 'Deep Dive 1, 2.1' });
  });

  it('nur Begriffskarten bekommen Verweise; Karten ohne Seite und ohne Treffer bleiben, wie sie sind', () => {
    expect(nachId('SQL-1')).toBe(cards[4]);
    expect(nachId('FB-where')).toBe(cards[1]);
    expect(nachId('FB-pk')).not.toHaveProperty('abgrenzung');
    expect(nachId('FB-pk')).not.toHaveProperty('siehe');
  });

  it('echter Inhalt: fast alle Begriffskarten haben verwandte Karten, alle Verweise zeigen auf Begriffskarten', () => {
    const { content } = ladeInhalt(CONTENT_DIR);
    const begriffe = content.flashcards.filter((c) => c.typ === 'begriff');
    const ids = new Set(begriffe.map((c) => c.id));
    expect(begriffe.filter((c) => c.abgrenzung?.length || c.siehe?.length).length).toBeGreaterThan(begriffe.length * 0.95);
    for (const c of begriffe)
      for (const v of [...(c.abgrenzung ?? []), ...(c.siehe ?? [])]) expect(ids.has(v), `${c.id} → ${v}`).toBe(true);
    expect(begriffe.find((c) => c.id === 'FB-having')!.abgrenzung).toEqual(['FB-where']);
  });
});
