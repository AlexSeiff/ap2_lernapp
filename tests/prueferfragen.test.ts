import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { defaultSettings, emptyProgress } from '../shared/progress';
import { splitPrueferfragen, stripPrueferfragen } from '../shared/prueferfragen';
import { loadContent } from '../build/inhalt';
import { cardPool, isKindEnabled } from '../src/lib/cards';
import { rateCard } from '../src/lib/progress';
import { topicStats } from '../src/lib/stats';

const content = loadContent(join(import.meta.dirname, 'fixtures', 'inhalt'));
const topic = content.topics.find((t) => t.id === '01')!;
const section = (title: string) => topic.sections.find((s) => s.title === title)!.markdown;

describe('stripPrueferfragen (Fixture-Lernblatt)', () => {
  it('entfernt Frage und Antwort, der übrige Text bleibt', () => {
    const md = stripPrueferfragen(section('1.1 SELECT: Projektion und Selektion'));
    expect(md).not.toContain('Prüferfrage');
    expect(md).not.toContain('Projektion wählt Spalten');
    expect(md).toContain('**Projektion** = Auswahl von Spalten');
    expect(md).toContain('```sql\n# kein Heading, nur ein Kommentar im Codeblock\nSELECT name FROM kunde;\n```');
  });

  it('entfernt mehrzeilige Prüferfragen mit Zusatz im Titel vollständig', () => {
    const md = stripPrueferfragen(section('1.2 WHERE im Detail'));
    expect(md).not.toMatch(/Prüferfrage|NULL-Werte|UNKNOWN/);
  });

  it('lässt Theorie ohne Prüferfragen, normale Zitate und Codeblöcke unverändert', () => {
    const md = 'Text\n\n> Ein normales Zitat\n\n```md\n> ❓ **Prüferfrage:** nur ein Beispiel im Code\n> *Antwort*\n```';
    expect(stripPrueferfragen(md)).toBe(md);
    expect(stripPrueferfragen(section('Teil 1 – Grundlagen'))).toBe(section('Teil 1 – Grundlagen'));
  });

  it('der Prüferkommentar in Lösungen ist nicht betroffen', () => {
    const md = '**A1 (4 P):** Antwort\n\n*Prüferkommentar: 2 P je Aspekt.*';
    expect(stripPrueferfragen(md)).toBe(md);
    for (const task of Object.values(content.tasks)) {
      if (task.solution) expect(stripPrueferfragen(task.solution.markdown)).toBe(task.solution.markdown);
    }
  });
});

describe('splitPrueferfragen', () => {
  it('liefert Text und Prüferfragen in Originalreihenfolge – dieselben Fragen wie die Karteikarten', () => {
    const segments = topic.sections.flatMap((s) => splitPrueferfragen(s.markdown));
    const questions = segments.filter((s) => s.type === 'prueferfrage');
    const cards = content.flashcards.filter((c) => c.kind === 'prueferfrage');
    expect(questions.map((q) => [q.question, q.answer])).toEqual(cards.map((c) => [c.question, c.answer]));
    expect(questions.map((q) => q.label)).toEqual(['Prüferfrage', 'Prüferfrage (Fehleranalyse)']);
    const first = splitPrueferfragen(section('1.1 SELECT: Projektion und Selektion'));
    expect(first.map((s) => s.type)).toEqual(['text', 'prueferfrage']);
  });

  it('Prüferfrage ohne Antwortzeile', () => {
    expect(splitPrueferfragen('> ❓ **Prüferfrage:** Warum?\n\nWeiter')).toEqual([
      { type: 'prueferfrage', label: 'Prüferfrage', question: 'Warum?' },
      { type: 'text', markdown: 'Weiter' },
    ]);
  });
});

describe('Kartenpool nach Einstellungen', () => {
  const kinds = (s = defaultSettings()) => new Set(cardPool(content.flashcards, s).map((c) => c.kind));

  it('alle Arten eingeschaltet: alle Karten', () => {
    expect(cardPool(content.flashcards, defaultSettings())).toHaveLength(content.flashcards.length);
    expect(kinds()).toEqual(new Set(['prueferfrage', 'fachgespraech', 'lernkarte']));
  });

  it('Prüferfragen bzw. Fachgespräch aus: diese Art fällt weg, der Rest bleibt', () => {
    expect(kinds({ ...defaultSettings(), prueferfragen: false })).toEqual(new Set(['fachgespraech', 'lernkarte']));
    expect(kinds({ ...defaultSettings(), fachgespraech: false })).toEqual(new Set(['prueferfrage', 'lernkarte']));
    expect(kinds({ ...defaultSettings(), prueferfragen: false, fachgespraech: false })).toEqual(new Set(['lernkarte']));
  });

  it('isKindEnabled: Filterwerte „alle“ und „lernkarte“ sind immer an', () => {
    const off = { prueferfragen: false, fachgespraech: false };
    expect(isKindEnabled('alle', off)).toBe(true);
    expect(isKindEnabled('lernkarte', off)).toBe(true);
    expect(isKindEnabled('prueferfrage', off)).toBe(false);
    expect(isKindEnabled('fachgespraech', { prueferfragen: false, fachgespraech: true })).toBe(true);
  });

  it('Themenstatistik zählt nur den Pool; der Lernstand ausgeblendeter Karten bleibt gespeichert', () => {
    let p = emptyProgress();
    for (const c of content.flashcards.filter((x) => x.topicId === '01')) {
      for (let i = 0; i < 3; i++) p = rateCard(p, c.id, 'gewusst', '2026-09-30');
    }
    const on = topicStats(content, p).find((s) => s.topic.id === '01')!;
    expect(on.cardsKnown).toBe(on.cardsTotal);
    const off = { ...p, settings: { ...p.settings, prueferfragen: false, fachgespraech: false } };
    const stats = topicStats(content, off).find((s) => s.topic.id === '01')!;
    // Alle sichtbaren Karten sicher → weiterhin 100 %, kein Einbruch durch ausgeblendete Karten.
    expect(stats.cardsKnown).toBe(stats.cardsTotal);
    expect(stats.cardsTotal).toBe(on.cardsTotal - content.flashcards.filter((c) => c.topicId === '01' && c.kind !== 'lernkarte').length);
    expect(off.cards).toEqual(p.cards);
  });
});
