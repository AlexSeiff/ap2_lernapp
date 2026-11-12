import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildContent, parseCriteria, parseSolutions, parseTopic, stripKw, toLines } from '../shared/parser';
import { loadContent } from '../build/inhalt';

// Kleine Lernblatt-Fixtures im Format der echten Blätter – so bricht das Bearbeiten eines Lernblatts keine Formattests.
// Grobe Prüfungen gegen die echten Inhalte stehen in inhalte.smoke.test.ts.
const FIXTURES = join(import.meta.dirname, 'fixtures', 'inhalt');
const content = loadContent(FIXTURES);
const topic = content.topics.find((t) => t.id === '01')!;

describe('Lernblatt-Format (tests/fixtures/inhalt)', () => {
  it('liest Titel (ohne Kalenderwoche) und Lösungsdatei ohne Importhinweise', () => {
    expect(content.issues).toEqual([]);
    expect(content.topics.map((t) => t.id)).toEqual(['01']);
    expect(topic).toMatchObject({ number: 1, title: 'SQL', solutionFile: 'DeepDive_01_SQL_Loesungen.md' });
    expect(topic).not.toHaveProperty('week');
  });

  it('zerlegt die Theorie in Abschnitte, Überschriften in Codeblöcken zählen nicht', () => {
    expect(topic.sections.map((s) => s.title)).toEqual([
      'Die Übungsdatenbank „Möbelhaus Test"',
      'Teil 1 – Grundlagen',
      '1.1 SELECT: Projektion und Selektion',
      '1.2 WHERE im Detail',
    ]);
    const select = topic.sections[2];
    expect(select.id).toBe('01-1-1-select-projektion-und-selektion');
    expect(select.markdown).toContain('# kein Heading');
  });

  it('liest Prüferfragen – auch über mehrere Zitatzeilen – samt kursiver Antwort', () => {
    const pf = content.flashcards.filter((c) => c.kind === 'prueferfrage');
    expect(pf.map((c) => c.id)).toEqual(['01-pf1', '01-pf2']);
    expect(pf[0]).toMatchObject({
      question: 'Worin unterscheiden sich Projektion und Selektion?',
      answer: 'Projektion wählt Spalten, Selektion filtert Zeilen.',
    });
    expect(pf[1].question).toBe('Warum liefert `WHERE telefon = NULL` keine Zeilen,\nobwohl NULL-Werte existieren?');
    expect(pf[1].answer).toMatch(/^Vergleiche mit NULL/);
  });

  it('baut die Übungsklausur mit Blöcken, Punkten und Anlagen', () => {
    const exam = topic.exam!;
    expect(exam.title).toBe('Übungsklausur SQL (100 Punkte, 90 Minuten)');
    expect(exam.intro).toMatch(/^Bearbeite die Klausur/);
    expect(exam.totalPoints).toBe(100);
    expect(exam.blocks.map((b) => [b.letter, b.title, b.points])).toEqual([
      ['A', 'Wissen und Fehleranalyse', 20],
      ['B', 'Abfragen entwickeln', 80],
    ]);
    expect(exam.blocks[0].taskIds).toEqual(['01-A1', '01-A2', '01-A3']);
    expect(exam.blocks[1].intro).toBe('Szenario: Das Möbelhaus erweitert seine Auswertungen.');
    // Übungsdatenbank aus der Theorie zuerst, dann die Anlagen der Klausur
    expect(exam.attachments.map((a) => a.title)).toEqual(['Die Übungsdatenbank „Möbelhaus Test"', 'Anlage 1 – Auszug Tabelle bestellung']);
    for (const b of exam.blocks) expect(b.taskIds.reduce((s, id) => s + content.tasks[id].points, 0)).toBe(b.points);
  });

  it('liest Aufgabentext inkl. Codeblock und ordnet Lösung und Prüferkommentar zu', () => {
    const a3 = content.tasks['01-A3'];
    expect(a3).toMatchObject({ code: 'A3', block: 'A', points: 9, type: 'offen' });
    expect(a3.markdown).toContain('```sql');
    expect(a3.markdown).toContain('GROUP BY name;');
    expect(a3.markdown).not.toContain('Block B');
    expect(a3.solution?.kommentar).toMatch(/^Je Fehler 1 P/);
    expect(a3.solution?.markdown).toContain('HAVING COUNT(*) > 1;');
    expect(a3.solution?.markdown).not.toContain('Prüferkommentar');
    expect(content.tasks['01-A2'].solution?.kommentar).toBeUndefined();
  });

  it('jede Aufgabe hat eine Lösung; „Auswertung" beendet die Lösungsdatei', () => {
    expect(Object.values(content.tasks).filter((t) => !t.solution?.markdown)).toEqual([]);
    expect(content.tasks['01-A1'].solution?.markdown).not.toContain('Auswertung');
    expect(content.tasks['01-B3'].solution?.markdown).not.toContain('---');
  });

  it('erkennt Punktetabellen als Bewertungskriterien und überspringt die Summenzeile', () => {
    expect(content.tasks['01-B1'].solution?.criteria).toEqual([
      { label: 'Pool „Möbelhaus" mit zwei Lanes', points: 3 },
      { label: 'Startereignis in der Annahme', points: 2 },
      { label: 'XOR-Gateway mit beschrifteten Pfaden', points: 3.5 },
      { label: 'Nachrichtenfluss zum Kundenpool', points: 2 },
    ]);
    expect(content.tasks['01-B2'].solution?.criteria).toBeUndefined();
  });

  it('liest Fachgespräch-Fragen mit erwarteter Antwort und den Lernziel-Check', () => {
    const fg = content.flashcards.filter((c) => c.kind === 'fachgespraech');
    expect(fg.map((c) => c.question)).toEqual([
      'Begründen Sie Ihre Wahl zwischen INNER und LEFT JOIN.',
      'Wie haben Sie sichergestellt, dass Ihre Abfragen **korrekte** Ergebnisse liefern?',
    ]);
    expect(fg[0].answer).toBeUndefined();
    expect(fg[1].answer).toBe('Plausibilisierung über Zeilenzahlen, Stichproben gegen das Quellsystem.');
    expect(topic.lernziele).toEqual([
      'Ich kann WHERE und HAVING sauber abgrenzen.',
      'Ich kenne das NULL-Verhalten aller Aggregatfunktionen.',
      'Übungsklausur mit ≥ 92 Punkten bestanden.',
    ]);
  });

  it('liefert mit Windows-Zeilenenden (CRLF) dasselbe Ergebnis', () => {
    const read = (name: string) => readFileSync(join(FIXTURES, name), 'utf8');
    const crlf = (s: string) => s.replace(/\n/g, '\r\n');
    const sheet = read('DeepDive_01_SQL.md');
    const sol = read('DeepDive_01_SQL_Loesungen.md');
    const lf = parseTopic('01', 'a.md', sheet, 'b.md', sol);
    const win = parseTopic('01', 'a.md', crlf(sheet), 'b.md', crlf(sol));
    expect(win.tasks).toEqual(lf.tasks);
    expect(win.issues).toEqual([]);
  });
});

describe('Älteres Format mit integrierten Lösungen (Deep_Dive_SQL_*.md)', () => {
  const legacy = [
    '# Deep-Dive-Lernzettel: SQL (KW 28–29)',
    '## 1. Beispieldatenbank „DataFit GmbH"',
    'Tabellen',
    '## 5. Übungsklausur SQL – 100 Punkte, Richtzeit 90 Minuten',
    '### Teil A – Wissensfragen (40 P)',
    '- **W1 (40 P):** Erläutern Sie WHERE und HAVING.',
    '  Mit Beispiel.',
    '### Teil C – Fortgeschritten (60 P)',
    '- **C7 (60 P):** Finden Sie die vier Fehler.',
    '## 6. Musterlösungen mit Bewertungshinweisen',
    '**W1:** WHERE vor, HAVING nach der Gruppierung.',
    '**C7 – die vier Fehler:**',
    '1. Aggregatbedingung im WHERE.',
    '**Auswertung:** 92–100 P = sehr gut',
    '## 7. Fachgespräch-Fragen rund um SQL',
    '1. „Warum LEFT JOIN?" (Erwartet: Kunden ohne Bestellung bleiben erhalten.)',
  ].join('\n');

  it('liest Aufgaben aus Aufzählungen und Lösungen aus dem Blatt selbst', () => {
    const c = buildContent([{ name: 'Deep_Dive_SQL_KW28_29.md', text: legacy }]);
    expect(c.issues).toEqual([]);
    const t = c.topics[0];
    expect(t).toMatchObject({ id: '00', title: 'SQL (Zusatzmaterial DataFit)' });
    expect(t.exam!.attachments[0].title).toMatch(/Beispieldatenbank/);
    expect(c.tasks['00-W1'].markdown).toBe('Erläutern Sie WHERE und HAVING.\nMit Beispiel.');
    expect(c.tasks['00-C7'].solution?.markdown).toMatch(/Aggregatbedingung/);
    expect(c.flashcards.find((f) => f.id === '00-fg1')?.answer).toBe('Kunden ohne Bestellung bleiben erhalten.');
  });
});

describe('Robustheit', () => {
  it('meldet Aufgaben ohne Lösung statt abzustürzen', () => {
    const sheet = `# Deep Dive 99: Test (KW 1)\n\n## Theorie\n\nText\n\n# Übungsklausur Test (100 Punkte, 90 Minuten)\n\n## Block A – Wissen (100 P)\n\n**A1 (60 P):** Frage 1\n\n**A2 (40 P):** Frage 2\n`;
    const sol = `# Lösungen\n\n## Block A\n\n**A1 (60 P):**\nAntwort 1\n\n**A9 (5 P):**\nverwaist\n`;
    const r = parseTopic('99', 'DeepDive_99_Test.md', sheet, 'DeepDive_99_Test_Loesungen.md', sol);
    expect(r.tasks).toHaveLength(2);
    expect(r.tasks[0].solution?.markdown).toBe('Antwort 1');
    expect(r.issues.map((i) => i.message)).toEqual([
      'Keine Musterlösung für Aufgabe A2 gefunden.',
      'Lösung A9 ohne passende Aufgabe im Lernblatt.',
    ]);
  });

  it('meldet abweichende Punktzahlen und Klausuren ungleich 100 Punkte', () => {
    const sheet = '# Deep Dive 98: Test\n\n# Übungsklausur\n\n## Block A – Wissen (90 P)\n\n**A1 (90 P):** Frage\n';
    const r = parseTopic('98', 'x.md', sheet, 'x_Loesungen.md', '**A1 (80 P):**\nAntwort');
    expect(r.issues.map((i) => i.message)).toEqual([
      'Punktzahl A1 weicht ab: Blatt 90 P, Lösung 80 P.',
      'Klausur ergibt 90 statt 100 Punkte.',
    ]);
  });

  it('ignoriert Überschriften und Aufgabenmuster in Codeblöcken', () => {
    const md = '**A1 (2 P):**\nLösung\n```\n# kein Heading\n**B1 (3 P):** kein Start\n```\n';
    const sols = parseSolutions(toLines(md));
    expect([...sols.keys()]).toEqual(['A1']);
    expect(sols.get('A1')!.solution.markdown).toContain('# kein Heading');
  });

  it('meldet verwaiste Lösungsdateien und Blätter ohne Klausur, die eine Lösungsdatei haben', () => {
    const c = buildContent([
      { name: 'DeepDive_50_Nur_Theorie.md', text: '# Deep Dive 50: Nur Theorie\n\n## A\n\nText' },
      { name: 'DeepDive_51_X_Loesungen.md', text: '# L' },
      { name: 'DeepDive_52_Ohne_Klausur.md', text: '# Deep Dive 52: Ohne Klausur\n\n## A\n\nText' },
      { name: 'DeepDive_52_Ohne_Klausur_Loesungen.md', text: '**A1 (2 P):** x' },
    ]);
    const messages = c.issues.map((i) => `${i.file}: ${i.message}`);
    expect(messages).not.toContain('DeepDive_50_Nur_Theorie.md: Kein Abschnitt „Übungsklausur" gefunden.');
    expect(messages).toContain('DeepDive_52_Ohne_Klausur.md: Kein Abschnitt „Übungsklausur" gefunden.');
    expect(messages).toContain('DeepDive_51_X_Loesungen.md: Lösungsdatei ohne zugehöriges Lernblatt.');
  });

  it('erkennt Fachgespräch und Lernziel-Check auch in einem Blatt ohne Übungsklausur', () => {
    const md =
      '# Deep Dive 53: Nur Theorie\n\n# Teil 1\n\n## 1.1 A\n\nText\n\n## Fachgespräch\n\n1. Frage?\n\n## Lernziel-Check\n\n- [ ] Ich kann A.\n';
    const { topic, flashcards, issues } = parseTopic('53', 'DeepDive_53_Nur_Theorie.md', md);
    expect(topic.lernziele).toEqual(['Ich kann A.']);
    expect(topic.sections.map((s) => s.title)).toEqual(['Teil 1', '1.1 A']);
    expect(flashcards.map((c) => c.kind)).toEqual(['fachgespraech']);
    expect(issues).toEqual([]);
  });

  it('parseCriteria überspringt Summenzeilen', () => {
    const md = '| Element | P |\n|---|---|\n| A | 2 |\n| B | 1,5 |\n| **Summe** | **3,5** |';
    expect(parseCriteria(md)).toEqual([
      { label: 'A', points: 2 },
      { label: 'B', points: 1.5 },
    ]);
  });

  it('stripKw entfernt eine Kalenderwoche am Titelende, sonst nichts', () => {
    expect(stripKw('SQL (KW 28–29)')).toBe('SQL');
    expect(stripKw('Teil 1 – Grundlagen (KW 28)')).toBe('Teil 1 – Grundlagen');
    expect(stripKw('Datenschutz (DSGVO) & IT-Sicherheit (kw 38) ')).toBe('Datenschutz (DSGVO) & IT-Sicherheit');
    expect(stripKw('Datenschutz (DSGVO) & IT-Sicherheit')).toBe('Datenschutz (DSGVO) & IT-Sicherheit');
    expect(stripKw('KW-Test (Kwartal)')).toBe('KW-Test (Kwartal)');
  });

  it('Lernplan-Dateien sind kein Material mehr', () => {
    const c = buildContent([{ name: 'Lernplan_Juli_bis_November.md', text: '- **KW 30:** Datenmodellierung' }]);
    expect(c.materials).toEqual([]);
    expect(c).not.toHaveProperty('weeks');
  });

  it('Titel und Abschnitte aus älteren Blättern verlieren die Kalenderwoche', () => {
    const sheet = '# Deep Dive 97: Test (KW 5)\n\n# Teil 1 – Grundlagen (KW 5)\n\n## 1.1 A\n\nText\n';
    const { topic: t } = parseTopic('97', 'DeepDive_97_Test.md', sheet);
    expect(t.title).toBe('Test');
    expect(t.sections.map((s) => [s.id, s.title])).toEqual([
      ['97-teil-1-grundlagen', 'Teil 1 – Grundlagen'],
      ['97-1-1-a', '1.1 A'],
    ]);
  });
});
