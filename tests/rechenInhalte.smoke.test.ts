import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatZahl } from '../shared/rechenweg';
import { parseRechenUebungen } from '../shared/rechenUebungen';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { formatWert, pruefeAntworten } from '../src/rechnen/checker';
import { baueInstanz } from '../src/rechnen/instanz';
import { pruefeRechenUebung } from '../src/rechnen/pruefen';
import { findeVorlage } from '../src/rechnen/vorlagen/index';

// Rauchtest der echten Rechenübungen (content/AP2_Rechen_Uebungen.json):
// alles wird ohne Importhinweis gelesen, jede Vorlage existiert, „Neue Zahlen“ funktioniert für viele Seeds, und die
// festen Übungen ergeben genau die Zahlen, die in der Musterlösung der angegebenen Aufgabe stehen – bzw. bei einem
// Rechenbeispiel aus dem Theorieteil (Quelle ohne „Übungsklausur“, z. B. „DD3 Teil 4.3“) im Theorieteil des Lernblatts.
// Zahlen in Formeln ($…$) zählen mit (`70{,}00` = 70,00).

const DATEI = 'AP2_Rechen_Uebungen.json';
const content = loadContent(CONTENT_DIR);
const uebungen = content.rechenUebungen;

/** Aufgaben-Kürzel aus „DD3 Übungsklausur E1–E3“ oder „DD4 Übungsklausur C1/C3“. */
function aufgaben(quelle: string): string[] {
  const m = /Übungsklausur\s+(.+)$/.exec(quelle);
  if (!m) return [];
  return m[1].split('/').flatMap((teil) => {
    const r = /^([A-Z])(\d+)[–-]([A-Z])?(\d+)$/.exec(teil.trim());
    if (!r) return [teil.trim()];
    return Array.from({ length: Number(r[4]) - Number(r[2]) + 1 }, (_, i) => `${r[1]}${Number(r[2]) + i}`);
  });
}

/** Typografisches Minus und geschützte/schmale Leerzeichen (U+00A0, U+202F) wie im Zahlformat vereinheitlichen. */
const SCHMALE_LEERZEICHEN = new RegExp('[\\u00a0\\u202f]', 'g');
/**
 * Zahlen in Formeln (`$…$`, Roadmap 4.4) wie Text lesen: `70{,}00` → `70,00`, `1{.}080` → `1.080`,
 * LaTeX-Abstände (`\,`, `\;`, `\ `) → Leerzeichen, `\%` → `%`.
 */
const latexZahlen = (s: string) =>
  s
    .replace(/\{([,.])\}/g, '$1')
    .replace(/\\[,;: ]/g, ' ')
    .replace(/\\%/g, '%');
const norm = (s: string) => latexZahlen(s).replace(/−/g, '-').replace(SCHMALE_LEERZEICHEN, ' ');

describe('Rechenübungen in content/', () => {
  it('werden ohne Importhinweis gelesen, IDs sind eindeutig und jede Vorlage existiert', () => {
    const json = readFileSync(join(CONTENT_DIR, DATEI), 'utf8');
    const parsed = parseRechenUebungen(DATEI, json, new Map(content.topics.map((t) => [t.id, t.title])), pruefeRechenUebung);
    expect(parsed.issues).toEqual([]);
    expect(parsed.exercises.length).toBe((JSON.parse(json) as { uebungen: unknown[] }).uebungen.length);
    expect(content.issues.filter((i) => i.file === DATEI)).toEqual([]);
    expect(new Set(uebungen.map((u) => u.id)).size).toBe(uebungen.length);
    for (const u of uebungen) {
      expect(u.id, u.id).toMatch(/^RE-[A-Z0-9]+-\d{3}$/);
      expect(u.topicId, u.id).toBeDefined();
      if (u.vorlage) expect(findeVorlage(u.vorlage), u.id).toBeDefined();
    }
  });

  it('jede Übung baut mit festen Zahlen und mit 100 Seeds („Neue Zahlen“) eine prüfbare Instanz', () => {
    for (const u of uebungen) {
      const seeds = u.neueZahlen ? [undefined, ...Array.from({ length: 100 }, (_, i) => i * 104729 + 3)] : [undefined];
      for (const seed of seeds) {
        const inst = baueInstanz(u, seed);
        const wo = `${u.id} Seed ${seed ?? 'fest'}`;
        expect(inst.unbekanntePlatzhalter, wo).toEqual([]);
        expect(inst.aufgabe, wo).not.toMatch(/NaN|Infinity|undefined/);
        expect(inst.eingaben.length, wo).toBeGreaterThan(0);
        // Die richtigen Werte, wie die Lösung sie zeigt, sind „alles richtig“.
        const antworten = Object.fromEntries(inst.eingaben.map((e) => [e.id, formatWert(e.erwartet, e)]));
        expect(pruefeAntworten(inst, antworten).ok, wo).toBe(true);
      }
    }
  }, 60_000); // 85 Übungen × 101 Seeds – braucht länger als die Standardzeit von 5 s

  it('feste Übungen ergeben die Zahlen der Musterlösung ihrer Aufgabe (z. B. DD3 C1 → 70,00 / 55 / 40)', () => {
    const geprueft: string[] = [];
    for (const u of uebungen) {
      if (!u.quelleAufgabe || (u.vorlage && !u.daten)) continue;
      const codes = aufgaben(u.quelleAufgabe);
      const quelle = codes.length
        ? codes.map((code) => content.tasks[`${u.topicId}-${code}`]?.solution?.markdown ?? '').join('\n')
        : (content.topics
            .find((t) => t.id === u.topicId)
            ?.sections.map((s) => s.markdown)
            .join('\n') ?? '');
      const loesung = norm(quelle);
      expect(loesung.trim(), `${u.id}: keine Musterlösung bzw. kein Theorieteil zu ${u.quelleAufgabe}`).not.toBe('');
      const inst = baueInstanz(u);
      for (const e of inst.eingaben) {
        const w = e.erwartet;
        if (typeof w === 'string') {
          // Texte (Name, ja/nein, kritischer Pfad): ein kennzeichnendes Wort oder der ganze Text muss in der Lösung vorkommen.
          if (/^(ja|nein)$/i.test(w)) continue;
          const woerter = w.split(/[^\p{L}\d]+/u).filter((x) => x.length >= 4);
          expect(
            woerter.length ? woerter.some((x) => loesung.toLowerCase().includes(x.toLowerCase())) : loesung.includes(w),
            `${u.id}: ${e.id} „${w}“`,
          ).toBe(true);
          continue;
        }
        for (const x of typeof w === 'number' ? [w] : w) {
          const formen = [formatZahl(x, e.runden), formatZahl(x)].flatMap((s) => [s, s.replace(/\./g, '')]).map(norm);
          expect(
            formen.some((s) => loesung.includes(s)),
            `${u.id}: ${e.id} = ${formen[0]} steht nicht in der Lösung zu ${u.quelleAufgabe}`,
          ).toBe(true);
        }
      }
      geprueft.push(u.id);
    }
    expect(geprueft).toEqual(
      expect.arrayContaining(['RE-ST1-001', 'RE-MG-001', 'RE-PM-001', 'RE-ST1-008', 'RE-MG-004', 'RE-PM-008', 'RE-WI-010']),
    );
    expect(geprueft.length).toBeGreaterThanOrEqual(55);
  });

  it('DD3 C1 und DD7 B2 im Detail', () => {
    const dd3 = baueInstanz(uebungen.find((u) => u.id === 'RE-ST1-001')!);
    expect(dd3.eingaben.map((e) => formatWert(e.erwartet, e))).toEqual(['70,00 min', '55,00 min', '40 min']);
    const dd7 = baueInstanz(uebungen.find((u) => u.id === 'RE-MG-001')!);
    const werte = Object.fromEntries(dd7.eingaben.map((e) => [e.id, formatWert(e.erwartet, e)]));
    expect(werte).toMatchObject({ accuracy: '93,00 %', precision: '60,00 %', recall: '90,00 %', f1: '72,00 %', spezifitaet: '93,33 %' });
  });
});
