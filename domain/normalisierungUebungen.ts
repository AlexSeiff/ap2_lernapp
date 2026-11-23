// Normalisierungs-Übungen (AP2_Normalisierung_Uebungen.json): aus einer unnormalisierten Tabelle oder aus einem Beschreibungstext ein
// relationales Modell in 3. NF erstellen – im Tabellen-Editor wie auf dem Prüfungsbogen (Tabellen zeichnen, PK/FK kennzeichnen).
// Zwei Quellen:
// - „tabelle“: Ausgangstabelle mit Beispieldaten, gelöst wird Schritt für Schritt (1. NF, 2. NF, 3. NF).
// - „text“: Beschreibung mit vorgegebenen Attributnamen, gelöst wird direkt das Endschema in 3. NF.
// Die Musterlösung steht je Schritt in Relationenschreibweise „name(**pk1, pk2↑**, spalte, fk↑)“. Fremdschlüssel verweisen auf die
// Tabelle, deren Primärschlüssel die gleichnamige Spalte ist; heißt die Spalte anders (projektleiter_nr → mitarbeiter), steht das Ziel
// in „ziele“. Der Import prüft die Musterlösung (Schlüssel vorhanden, jeder FK findet seine Tabelle, Spalten der Ausgangstabelle
// bleiben erhalten), sonst wird die Übung übersprungen. Rein, ohne React.

import { z } from 'zod';
import type { ImportIssue } from './types.ts';

export interface NfSpalte {
  name: string;
  pk: boolean;
  fk: boolean;
}

export interface NfRelation {
  name: string;
  spalten: NfSpalte[];
}

export interface NfMusterTabelle {
  /** Relationenschreibweise, z. B. „bestellposition(**bestell_nr↑, artikel_nr↑**, menge)“. */
  relation: string;
  /** Beispieldaten (optional, z. B. für die 1. NF) – je Zeile so viele Werte wie Spalten. */
  zeilen?: string[][];
}

export interface NfSchritt {
  /** „1. NF“, „2. NF“, „3. NF“. */
  titel: string;
  /** Abhängigkeiten und Begründung (Markdown). */
  text: string;
  tabellen: NfMusterTabelle[];
  /** Fremdschlüssel mit anderem Namen als der Primärschlüssel: „tabelle.spalte“ → Zieltabelle. */
  ziele?: Record<string, string>;
}

export interface NfAusgang {
  name: string;
  kopf: string[];
  zeilen: string[][];
}

export interface NormalisierungUebung {
  id: string;
  titel: string;
  stufe: 1 | 2 | 3;
  topicId?: string;
  quelle: 'tabelle' | 'text';
  /** Aufgabentext (Markdown, „Sie“, mit Operator). */
  aufgabe: string;
  /** Unnormalisierte Ausgangstabelle (nur Quelle „tabelle“). */
  ausgang?: NfAusgang;
  hinweise: string[];
  loesung: NfSchritt[];
  /** Prüferkommentar: typische Fehler, worauf es ankommt (Markdown). */
  erklaerung?: string;
  tags: string[];
}

// ---------- Relationenschreibweise ----------

const NAME = /^[A-Za-zÄÖÜäöüß_][\wÄÖÜäöüß]*$/;

/** „name(**a↑, b↑**, c, d↑)“ → Tabelle mit Spalten. Fett darf sich über mehrere Spalten erstrecken. undefined = nicht lesbar. */
export function leseRelation(relation: string): NfRelation | undefined {
  const m = /^\s*([^\s(]+)\s*\(([^()]+)\)\s*$/.exec(relation);
  if (!m || !NAME.test(m[1])) return undefined;
  let fett = false;
  const spalten: NfSpalte[] = [];
  for (const roh of m[2].split(',')) {
    const sterne = (roh.match(/\*\*/g) ?? []).length;
    const pk = fett || sterne > 0;
    if (sterne % 2) fett = !fett;
    const name = roh.replace(/\*\*/g, '').replace(/↑/g, '').trim();
    if (!NAME.test(name)) return undefined;
    spalten.push({ name, pk, fk: roh.includes('↑') });
  }
  return fett ? undefined : { name: m[1], spalten };
}

/** Spalten- und Tabellennamen vergleichbar machen (wie im Tabellen-Editor). */
export const nfName = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_äöüß]/g, '');

/**
 * Zieltabelle eines Fremdschlüssels: ausdrücklich angegeben (ziele bzw. im Editor gewählt), sonst die andere Tabelle, deren
 * Primärschlüssel die gleichnamige Spalte enthält – bevorzugt eine mit einteiligem Schlüssel.
 */
export function fkZiel<T extends { name: string; spalten: { name: string; pk?: boolean }[] }>(
  tabellen: T[],
  von: T,
  spalte: string,
  ausdruecklich?: string,
): T | undefined {
  if (ausdruecklich) {
    const t = tabellen.find((x) => nfName(x.name) === nfName(ausdruecklich));
    if (t) return t;
  }
  const kandidaten = tabellen.filter(
    (t) => t !== von && t.spalten.some((s) => s.pk && nfName(s.name) === nfName(spalte) && nfName(s.name) !== ''),
  );
  return kandidaten.find((t) => t.spalten.filter((s) => s.pk).length === 1) ?? kandidaten[0];
}

// ---------- Übungen (Inhalt) ----------

const text = z.string().min(1);
const tabelleSchema = z.union([
  text.transform((relation): NfMusterTabelle => ({ relation })),
  z.object({ relation: text, zeilen: z.array(z.array(z.string())).optional() }).strict(),
]);
const schrittSchema = z
  .object({
    titel: text,
    text: text,
    tabellen: z.array(tabelleSchema).min(1),
    ziele: z.record(z.string(), text).optional(),
  })
  .strict();

const uebungSchema = z
  .object({
    id: z.string().regex(/^NF-\d{3}$/, 'ID im Format NF-001'),
    titel: text,
    stufe: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    topicId: z.string().optional(),
    quelle: z.enum(['tabelle', 'text']),
    aufgabe: text,
    ausgang: z
      .object({ name: text, kopf: z.array(text).min(2), zeilen: z.array(z.array(z.string())).min(1) })
      .strict()
      .optional(),
    hinweise: z.array(z.string()).default([]),
    loesung: z.array(schrittSchema).min(1).max(3),
    erklaerung: z.string().optional(),
    tags: z.array(z.string()).default([]),
  })
  .strict();

/** Inhaltliche Prüfung: Musterlösung lesbar und in sich stimmig. */
export function pruefeNormalisierungUebung(u: NormalisierungUebung): string[] {
  const fehler: string[] = [];
  if (u.quelle === 'tabelle' && !u.ausgang) fehler.push('Quelle „tabelle“ braucht eine Ausgangstabelle (ausgang)');
  if (u.quelle === 'text' && u.ausgang) fehler.push('Quelle „text“ hat keine Ausgangstabelle');
  if (u.ausgang?.zeilen.some((z) => z.length !== u.ausgang!.kopf.length)) fehler.push('Ausgangstabelle: Zeile mit falscher Spaltenzahl');
  if (!/\*[A-ZÄÖÜ][a-zäöüß]+\*/.test(u.aufgabe)) fehler.push('Aufgabentext ohne Operator in Kursivschrift');
  u.loesung.forEach((s, i) => {
    const wo = `Lösung „${s.titel}“`;
    if (u.loesung.length > 1 && s.titel !== `${i + 1}. NF`) fehler.push(`${wo}: Schritt ${i + 1} heißt „${i + 1}. NF“`);
    const tabellen: NfRelation[] = [];
    for (const t of s.tabellen) {
      const r = leseRelation(t.relation);
      if (!r) {
        fehler.push(`${wo}: „${t.relation}“ ist keine Relationenschreibweise`);
        continue;
      }
      if (!r.spalten.some((x) => x.pk)) fehler.push(`${wo}: ${r.name} ohne Primärschlüssel`);
      if (new Set(r.spalten.map((x) => nfName(x.name))).size !== r.spalten.length) fehler.push(`${wo}: ${r.name} mit doppelter Spalte`);
      if (t.zeilen?.some((z) => z.length !== r.spalten.length)) fehler.push(`${wo}: ${r.name} – Datenzeile mit falscher Spaltenzahl`);
      tabellen.push(r);
    }
    if (new Set(tabellen.map((t) => nfName(t.name))).size !== tabellen.length) fehler.push(`${wo}: Tabellenname doppelt`);
    for (const t of tabellen)
      for (const sp of t.spalten.filter((x) => x.fk)) {
        const ziel = fkZiel(tabellen, t, sp.name, s.ziele?.[`${t.name}.${sp.name}`]);
        if (!ziel) fehler.push(`${wo}: Fremdschlüssel ${t.name}.${sp.name} findet keine Tabelle`);
      }
    for (const k of Object.keys(s.ziele ?? {}))
      if (!tabellen.some((t) => t.spalten.some((x) => x.fk && `${t.name}.${x.name}` === k)))
        fehler.push(`${wo}: Ziel „${k}“ ohne Fremdschlüssel`);
  });
  // Nichts geht verloren: Jede Spalte der Ausgangstabelle, die nicht zerlegt wird, steht auch im Endschema.
  const ende = u.loesung[u.loesung.length - 1].tabellen.map((t) => leseRelation(t.relation)).filter((r): r is NfRelation => !!r);
  const endSpalten = new Set(ende.flatMap((t) => t.spalten.map((x) => nfName(x.name))));
  const erste = leseRelation(u.loesung[0].tabellen[0]?.relation ?? '');
  for (const sp of erste?.spalten ?? []) if (!endSpalten.has(nfName(sp.name))) fehler.push(`Spalte ${sp.name} fehlt im Endschema`);
  return fehler;
}

function beschreibeZod(error: z.ZodError): string {
  const first = error.issues[0];
  if (!first) return 'ungültig';
  return first.path.length ? `${first.path.join('.')}: ${first.message}` : first.message;
}

export function parseNormalisierungUebungen(fileName: string, raw: string): { uebungen: NormalisierungUebung[]; issues: ImportIssue[] } {
  const issues: ImportIssue[] = [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { uebungen: [], issues: [{ file: fileName, message: `Kein gültiges JSON: ${e instanceof Error ? e.message : String(e)}` }] };
  }
  const liste = (data as { uebungen?: unknown })?.uebungen;
  if (!Array.isArray(liste)) return { uebungen: [], issues: [{ file: fileName, message: 'Feld „uebungen“ fehlt.' }] };
  const uebungen: NormalisierungUebung[] = [];
  const gesehen = new Set<string>();
  liste.forEach((roh, i) => {
    const r = uebungSchema.safeParse(roh);
    const name = (roh as { id?: unknown })?.id ?? `Nr. ${i + 1}`;
    if (!r.success) {
      issues.push({ file: fileName, message: `Normalisierungs-Übung ${String(name)} übersprungen: ${beschreibeZod(r.error)}` });
      return;
    }
    const u = r.data as NormalisierungUebung;
    const fehler = pruefeNormalisierungUebung(u);
    if (gesehen.has(u.id)) fehler.unshift('ID doppelt');
    if (fehler.length) {
      issues.push({ file: fileName, message: `Normalisierungs-Übung ${u.id} übersprungen: ${fehler.slice(0, 3).join('; ')}` });
      return;
    }
    gesehen.add(u.id);
    uebungen.push(u);
  });
  return { uebungen, issues };
}
