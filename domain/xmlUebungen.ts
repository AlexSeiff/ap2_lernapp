// XML-Übungen (AP2_Xml_Uebungen.json), Gegenstück zu den JSON-Übungen. Zwei Arten:
// - „dokument“: XML selbst schreiben oder ein fehlerhaftes Dokument korrigieren. Geprüft wird erst die Wohlgeformtheit (domain/xml.ts), dann
//   die Struktur gegen Regeln der Übung. Jede Regel ist ein XPath-Ausdruck mit Erwartung (Wert, Anzahl, fehlt) – Reihenfolge der Attribute,
//   Einrückung und Deklaration bleiben frei.
// - „xpath“: einen XPath-Ausdruck zu einem gegebenen Dokument schreiben. Richtig ist er, wenn er dasselbe liefert wie die Musterlösung
//   (verglichen über die Textwerte, damit /kunde/name und /kunde/name/text() beide zählen).
// Import mit Prüfung wie bei den anderen Übungen: Jede Musterlösung muss ihre Regeln erfüllen, sonst wird die Übung übersprungen.

import { z } from 'zod';
import type { ImportIssue } from './types.ts';
import {
  ergebnisListe,
  istKnotenmenge,
  pruefeXmlSyntax,
  pruefeXpathSyntax,
  textwert,
  werteXpath,
  type XmlDokument,
  type XmlSyntax,
  type XpathFehler,
  type XpathWert,
} from './xml.ts';

// ---------- Regeln (Art „dokument“) ----------

export interface XmlRegel {
  /** XPath-Ausdruck, z. B. `/bestellung/@nr`, `count(//position)`, `/kunde/name`. */
  xpath: string;
  /** Erwarteter Wert: Textwert des ersten Treffers (Leerraum zusammengefasst) bzw. Ergebnis einer Funktion. */
  wert?: string | number | boolean;
  /** So viele Treffer. */
  anzahl?: number;
  /** Darf nicht vorkommen. */
  fehlt?: boolean;
  /** Anzeige, was verlangt ist (sonst aus dem Ausdruck gebildet). */
  text?: string;
  /** Eigener Hinweis, wenn die Regel nicht erfüllt ist. */
  hinweis?: string;
}

export interface XmlRegelErgebnis {
  regel: XmlRegel;
  ok: boolean;
  verlangt: string;
  meldung?: string;
}

const zeige = (w: string | number | boolean) => (typeof w === 'string' ? `„${w}“` : String(w));
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

export function beschreibeXmlRegel(r: XmlRegel): string {
  if (r.text) return r.text;
  if (r.fehlt) return `${r.xpath} kommt nicht vor`;
  if (r.anzahl !== undefined) return `${r.xpath} kommt ${r.anzahl}× vor`;
  if (r.wert !== undefined) return `${r.xpath} = ${zeige(r.wert)}`;
  return `${r.xpath} ist vorhanden`;
}

/** Fehlt `/a/@x`, gibt es aber `/a/x` (oder umgekehrt)? Dann ein gezielter Hinweis. */
function elementOderAttribut(dokument: XmlDokument, xpath: string): string | undefined {
  const attr = /^(.*)\/@([\p{L}_][\p{L}\p{N}_.-]*)$/u.exec(xpath);
  if (attr) {
    const w = werteXpath(dokument, `${attr[1]}/${attr[2]}`);
    if (w.ok && istKnotenmenge(w.wert) && w.wert.length)
      return `„${attr[2]}“ steht als Element im Dokument, verlangt ist ein Attribut: ${attr[2]}="…" im Start-Tag.`;
  }
  const el = /^(.*)\/([\p{L}_][\p{L}\p{N}_.-]*)$/u.exec(xpath);
  if (el && !el[1].endsWith('/@')) {
    const w = werteXpath(dokument, `${el[1]}/@${el[2]}`);
    if (w.ok && istKnotenmenge(w.wert) && w.wert.length)
      return `„${el[2]}“ steht als Attribut im Dokument, verlangt ist ein eigenes Element <${el[2]}>…</${el[2]}>.`;
  }
  return undefined;
}

export function pruefeXmlRegel(dokument: XmlDokument, r: XmlRegel): XmlRegelErgebnis {
  const verlangt = beschreibeXmlRegel(r);
  const nein = (meldung: string): XmlRegelErgebnis => ({
    regel: r,
    ok: false,
    verlangt,
    meldung: r.hinweis ?? (r.text ? `${r.text} – ${meldung}` : meldung),
  });
  const ja: XmlRegelErgebnis = { regel: r, ok: true, verlangt };
  const e = werteXpath(dokument, r.xpath);
  if (!e.ok) return nein(`Regel nicht auswertbar: ${e.fehler.meldung}`);
  const w = e.wert;
  const menge = istKnotenmenge(w) ? w : undefined;
  if (r.fehlt) return menge?.length ? nein(`${r.xpath} darf nicht vorkommen.`) : ja;
  if (r.anzahl !== undefined) {
    const n = menge ? menge.length : typeof w === 'number' ? w : NaN;
    if (n === r.anzahl) return ja;
    if (!n) return nein(elementOderAttribut(dokument, r.xpath) ?? `${r.xpath} fehlt – verlangt ist ${r.anzahl}×.`);
    return nein(`${r.xpath} kommt ${n}× vor, verlangt ist ${r.anzahl}×.`);
  }
  if (menge && !menge.length) return nein(elementOderAttribut(dokument, r.xpath) ?? `${r.xpath} fehlt.`);
  if (r.wert === undefined) return ja;
  const ist = menge ? norm(textwert(menge[0])) : typeof w === 'string' ? norm(w) : w;
  let gleich: boolean;
  if (typeof r.wert === 'number') {
    const zahl = typeof ist === 'number' ? ist : typeof ist === 'string' && /^-?[0-9]+(\.[0-9]+)?$/.test(ist) ? Number(ist) : NaN;
    gleich = Math.abs(zahl - r.wert) < 1e-9;
    if (!gleich && typeof ist === 'string' && /^-?[0-9]+,[0-9]+$/.test(ist))
      return nein(
        `${r.xpath} ist „${ist}“ – Dezimalzahlen stehen in XML-Daten mit Punkt (${String(r.wert)}), damit sie maschinell lesbar sind.`,
      );
  } else gleich = typeof r.wert === 'string' ? ist === norm(r.wert) : ist === r.wert;
  if (gleich) return ja;
  return nein(`${r.xpath} ist ${zeige(ist as string | number | boolean)}, verlangt ist ${zeige(r.wert)}.`);
}

export interface XmlPruefung {
  syntax: XmlSyntax;
  regeln: XmlRegelErgebnis[];
  ok: boolean;
}

export function pruefeXmlAntwort(text: string, regeln: readonly XmlRegel[]): XmlPruefung {
  const syntax = pruefeXmlSyntax(text);
  if (!syntax.ok) return { syntax, regeln: [], ok: false };
  const ergebnisse = regeln.map((r) => pruefeXmlRegel(syntax.dokument, r));
  return { syntax, regeln: ergebnisse, ok: ergebnisse.every((e) => e.ok) };
}

// ---------- XPath-Antwort (Art „xpath“) ----------

export type XpathPruefung =
  | { ok: false; fehler: XpathFehler }
  | {
      ok: boolean;
      /** Was der Ausdruck liefert (zum Anzeigen). */
      ergebnis: { anzeige: string; wert: string }[];
      /** Liefert er Knoten (sonst Zahl, Text oder Wahrheitswert)? */
      knoten: boolean;
      meldung: string;
    };

const beschreibeTreffer = (n: number) => (n === 1 ? '1 Treffer' : `${n} Treffer`);

/** Vergleicht den Ausdruck mit der Musterlösung über das, was beide auf dem Dokument liefern. */
export function pruefeXpathAntwort(dokument: XmlDokument, ausdruck: string, loesung: string): XpathPruefung {
  const eigen = werteXpath(dokument, ausdruck);
  if (!eigen.ok) return { ok: false, fehler: eigen.fehler };
  const muster = werteXpath(dokument, loesung);
  if (!muster.ok) throw new Error(`Musterlösung „${loesung}“ ist kein gültiger Ausdruck: ${muster.fehler.meldung}`);
  const ist = ergebnisListe(eigen.wert);
  const soll = ergebnisListe(muster.wert);
  const knoten = istKnotenmenge(eigen.wert);
  const sollKnoten = istKnotenmenge(muster.wert);
  const gleich = ist.length === soll.length && ist.every((x, i) => gleicherWert(x.wert, soll[i].wert));
  const basis = { ergebnis: ist, knoten };
  if (gleich && (knoten || !sollKnoten || ist.length === 1))
    return { ...basis, ok: true, meldung: 'Richtig! Dein Ausdruck liefert dasselbe wie die Musterlösung.' };
  if (knoten && !ist.length)
    return {
      ...basis,
      ok: false,
      meldung:
        'Dein Ausdruck findet nichts. Prüfe Groß- und Kleinschreibung, / (direktes Kind) gegen // (beliebige Tiefe) und ob der Wert in einem Attribut (@) oder einem Element steht.',
    };
  if (!sollKnoten && knoten)
    return {
      ...basis,
      ok: false,
      meldung: `Gesucht ist ${typeof muster.wert === 'number' ? 'eine Zahl' : 'ein einzelner Wert'}, dein Ausdruck liefert Knoten. Dafür gibt es Funktionen wie count() oder sum().`,
    };
  if (sollKnoten && !knoten)
    return { ...basis, ok: false, meldung: 'Gesucht sind Knoten aus dem Dokument, dein Ausdruck liefert einen berechneten Wert.' };
  if (knoten && ist.length !== soll.length)
    return {
      ...basis,
      ok: false,
      meldung: `Dein Ausdruck liefert ${beschreibeTreffer(ist.length)}, gesucht ${soll.length === 1 ? 'ist 1 Treffer' : `sind ${soll.length} Treffer`}${ist.length > soll.length ? ' – fehlt eine Bedingung in [ ]?' : '.'}`,
    };
  return {
    ...basis,
    ok: false,
    meldung: knoten
      ? 'Dein Ausdruck findet andere Knoten als gesucht.'
      : `Dein Ausdruck ergibt ${ist[0]?.anzeige}, das ist nicht das gesuchte Ergebnis.`,
  };
}

function gleicherWert(a: string, b: string): boolean {
  if (a === b) return true;
  const x = Number(a);
  const y = Number(b);
  return a.trim() !== '' && b.trim() !== '' && !Number.isNaN(x) && !Number.isNaN(y) && Math.abs(x - y) < 1e-9;
}

export type { XpathWert };

// ---------- Übungen (Inhalt) ----------

export interface XmlUebung {
  id: string;
  titel: string;
  stufe: 1 | 2 | 3;
  topicId?: string;
  art: 'dokument' | 'xpath';
  /** Aufgabentext (Markdown, „Sie“). */
  aufgabe: string;
  /** Art „xpath“: das Dokument, auf dem der Ausdruck läuft (wird unter der Aufgabe angezeigt). */
  dokument?: string;
  /** Vorgabe im Eingabefeld (z. B. fehlerhaftes XML zum Korrigieren). */
  vorgabe?: string;
  /** Musterlösung: XML-Dokument (Art „dokument“) bzw. XPath-Ausdruck (Art „xpath“). */
  loesung: string;
  /** Weitere richtige Ausdrücke, die in der Lösung mit angezeigt werden (nur Art „xpath“). */
  alternativen?: string[];
  pruefungen: XmlRegel[];
  hinweise: string[];
  erklaerung?: string;
  tags: string[];
}

const text = z.string().min(1);
const regelSchema = z
  .object({
    xpath: text,
    wert: z.union([z.string(), z.number(), z.boolean()]).optional(),
    anzahl: z.number().int().min(0).optional(),
    fehlt: z.boolean().optional(),
    text: z.string().optional(),
    hinweis: z.string().optional(),
  })
  .strict();

const uebungSchema = z
  .object({
    id: text,
    titel: text,
    stufe: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    topicId: z.string().optional(),
    art: z.enum(['dokument', 'xpath']),
    aufgabe: text,
    dokument: z.string().optional(),
    vorgabe: z.string().optional(),
    loesung: text,
    alternativen: z.array(text).optional(),
    pruefungen: z.array(regelSchema).default([]),
    hinweise: z.array(z.string()).default([]),
    erklaerung: z.string().optional(),
    tags: z.array(z.string()).default([]),
  })
  .strict();

/** Inhaltliche Prüfung: Musterlösung gültig und richtig, Regeln auswertbar, Vorgabe noch nicht fertig. */
export function pruefeXmlUebung(u: XmlUebung): string[] {
  const fehler: string[] = [];
  if (u.art === 'xpath') {
    if (!u.dokument) return ['Art „xpath“ braucht ein Dokument'];
    const d = pruefeXmlSyntax(u.dokument);
    if (!d.ok) return [`Dokument ist nicht wohlgeformt: ${d.fehler.meldung} (Zeile ${d.fehler.zeile})`];
    for (const a of [u.loesung, ...(u.alternativen ?? [])]) {
      const w = werteXpath(d.dokument, a);
      if (!w.ok) {
        fehler.push(`Ausdruck „${a}“: ${w.fehler.meldung}`);
        continue;
      }
      if (istKnotenmenge(w.wert) && !w.wert.length) fehler.push(`Ausdruck „${a}“ findet nichts`);
      if (a !== u.loesung && !pruefeXpathAntwort(d.dokument, a, u.loesung).ok)
        fehler.push(`Alternative „${a}“ liefert etwas anderes als die Lösung`);
    }
    if (u.pruefungen.length) fehler.push('Art „xpath“ hat keine Regeln');
    return fehler;
  }
  if (!u.pruefungen.length) return ['Art „dokument“ braucht Regeln (pruefungen)'];
  if (u.dokument) fehler.push('Art „dokument“ hat kein Feld „dokument“');
  for (const r of u.pruefungen) {
    const s = pruefeXpathSyntax(r.xpath);
    if (!s.ok) fehler.push(`Regel „${r.xpath}“: ${s.fehler.meldung}`);
    if ([r.wert !== undefined, r.anzahl !== undefined, r.fehlt].filter(Boolean).length > 1)
      fehler.push(`Regel „${r.xpath}“: nur eins von wert, anzahl, fehlt`);
  }
  if (fehler.length) return fehler;
  const p = pruefeXmlAntwort(u.loesung, u.pruefungen);
  if (!p.syntax.ok) return [`Musterlösung ist nicht wohlgeformt: ${p.syntax.fehler.meldung} (Zeile ${p.syntax.fehler.zeile})`];
  for (const e of p.regeln) if (!e.ok) fehler.push(`Musterlösung erfüllt die Regel nicht: ${e.verlangt} (${e.meldung})`);
  if (u.vorgabe !== undefined && u.vorgabe.trim() && pruefeXmlAntwort(u.vorgabe, u.pruefungen).ok)
    fehler.push('Die Vorgabe erfüllt die Regeln schon – es gäbe nichts zu tun');
  return fehler;
}

function beschreibeZod(error: z.ZodError): string {
  const first = error.issues[0];
  if (!first) return 'ungültig';
  return first.path.length ? `${first.path.join('.')}: ${first.message}` : first.message;
}

export function parseXmlUebungen(fileName: string, raw: string): { uebungen: XmlUebung[]; issues: ImportIssue[] } {
  const issues: ImportIssue[] = [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { uebungen: [], issues: [{ file: fileName, message: `Kein gültiges JSON: ${e instanceof Error ? e.message : String(e)}` }] };
  }
  const liste = (data as { uebungen?: unknown })?.uebungen;
  if (!Array.isArray(liste)) return { uebungen: [], issues: [{ file: fileName, message: 'Feld „uebungen“ fehlt.' }] };
  const uebungen: XmlUebung[] = [];
  const gesehen = new Set<string>();
  liste.forEach((roh, i) => {
    const r = uebungSchema.safeParse(roh);
    const name = (roh as { id?: unknown })?.id ?? `Nr. ${i + 1}`;
    if (!r.success) {
      issues.push({ file: fileName, message: `XML-Übung ${String(name)} übersprungen: ${beschreibeZod(r.error)}` });
      return;
    }
    const u = r.data as XmlUebung;
    const fehler = pruefeXmlUebung(u);
    if (gesehen.has(u.id)) fehler.unshift('ID doppelt');
    if (fehler.length) {
      issues.push({ file: fileName, message: `XML-Übung ${u.id} übersprungen: ${fehler.slice(0, 3).join('; ')}` });
      return;
    }
    gesehen.add(u.id);
    uebungen.push(u);
  });
  return { uebungen, issues };
}
