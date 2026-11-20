// JSON-Übungen (AP2_Json_Uebungen.json): JSON-Dokumente selbst als Text schreiben. Die App prüft in zwei Stufen: 1. die Syntax mit
// eigenem, strengem Parser (Zeile/Spalte und deutsche Hinweise zu typischen Fehlern: einfache Anführungszeichen, Komma am Ende,
// Dezimalkomma, Schlüssel ohne Anführungszeichen …), 2. die Struktur gegen Regeln der Übung (Pfad, Typ, Wert, Länge) – nicht gegen
// einen Textvergleich, damit Reihenfolge der Schlüssel und Einrückung frei bleiben. Import mit Prüfung wie bei den anderen Übungen:
// fehlerhafte Übungen werden übersprungen und gemeldet; jede Musterlösung muss ihre eigenen Regeln erfüllen. Rein, ohne React.

import { z } from 'zod';
import type { ImportIssue } from './types.ts';

// ---------- Syntax ----------

export interface JsonFehler {
  /** Was nicht stimmt, in einem Satz. */
  meldung: string;
  /** Stelle des Fehlers, ab 1. */
  zeile: number;
  spalte: number;
  /** Zeichenstelle im Text (ab 0). */
  stelle: number;
}

export type JsonSyntax = { ok: true; wert: unknown } | { ok: false; fehler: JsonFehler };

class Abbruch extends Error {
  constructor(
    readonly stelle: number,
    meldung: string,
  ) {
    super(meldung);
  }
}

const ZIFFER = /[0-9]/;
const WORTZEICHEN = /[A-Za-z_$äöüÄÖÜß]/;

/** Strenger JSON-Parser nach RFC 8259 mit deutschen Fehlermeldungen; wirft `Abbruch` an der ersten fehlerhaften Stelle. */
function lese(text: string): unknown {
  let i = 0;
  const fehler = (meldung: string, stelle = i): never => {
    throw new Abbruch(stelle, meldung);
  };
  const leerraum = () => {
    while (i < text.length && ' \t\n\r'.includes(text[i])) i++;
  };
  const textBeginn = (c: string | undefined) =>
    c === '"' ||
    c === "'" ||
    c === '{' ||
    c === '[' ||
    (c !== undefined && (ZIFFER.test(c) || c === '-')) ||
    (c !== undefined && WORTZEICHEN.test(c));

  function wert(): unknown {
    leerraum();
    if (i >= text.length) return fehler('Hier fehlt ein Wert – das Dokument endet zu früh.');
    const c = text[i];
    if (c === '{') return objekt();
    if (c === '[') return liste();
    if (c === '"') return zeichenkette();
    if (c === "'") return fehler('Einfache Anführungszeichen gibt es in JSON nicht – Texte stehen in doppelten Anführungszeichen ("…").');
    if (c === '-' || ZIFFER.test(c)) return zahl();
    if (c === '/') return fehler('Kommentare gibt es in JSON nicht.');
    if (c === '+' || c === '.') return fehler(`Zahlen dürfen nicht mit „${c}“ beginnen.`);
    if (WORTZEICHEN.test(c)) {
      const wort = /^[A-Za-z_$äöüÄÖÜß]+/.exec(text.slice(i))![0];
      if (wort === 'true' || wort === 'false' || wort === 'null') {
        i += wort.length;
        return wort === 'true' ? true : wort === 'false' ? false : null;
      }
      if (/^(true|false|null)$/i.test(wort)) return fehler(`„${wort}“ muss klein geschrieben werden (true, false, null).`);
      if (wort === 'undefined' || wort === 'NaN' || wort === 'Infinity')
        return fehler(`„${wort}“ gibt es in JSON nicht – erlaubt sind true, false und null.`);
      return fehler(
        `„${wort}“ ist kein gültiger Wert. Texte stehen in doppelten Anführungszeichen; sonst sind nur Zahlen, true, false, null, Listen und Objekte erlaubt.`,
      );
    }
    return fehler(`Unerwartetes Zeichen „${c}“ – hier muss ein Wert stehen.`);
  }

  function zeichenkette(): string {
    const start = i;
    i++; // "
    let aus = '';
    while (i < text.length) {
      const c = text[i];
      if (c === '"') {
        i++;
        return aus;
      }
      if (c === '\n' || c === '\r')
        return fehler('Ein Text darf keinen Zeilenumbruch enthalten (dafür \\n schreiben) – oder das schließende " fehlt.', i);
      if (c === '\\') {
        const n = text[i + 1];
        if (n === undefined) break;
        if ('"\\/'.includes(n)) aus += n;
        else if (n === 'b') aus += '\b';
        else if (n === 'f') aus += '\f';
        else if (n === 'n') aus += '\n';
        else if (n === 'r') aus += '\r';
        else if (n === 't') aus += '\t';
        else if (n === 'u') {
          const hex = text.slice(i + 2, i + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) return fehler('Nach \\u müssen vier Hexadezimalziffern folgen.', i);
          aus += String.fromCharCode(parseInt(hex, 16));
          i += 4;
        } else return fehler(`„\\${n}“ ist keine gültige Escape-Folge (erlaubt: \\" \\\\ \\/ \\b \\f \\n \\r \\t \\u).`, i);
        i += 2;
        continue;
      }
      if (c < ' ') return fehler('In einem Text sind Steuerzeichen nicht erlaubt.', i);
      aus += c;
      i++;
    }
    return fehler('Der Text ist nicht geschlossen – das schließende " fehlt.', start);
  }

  function zahl(): number {
    const start = i;
    if (text[i] === '-') i++;
    if (!ZIFFER.test(text[i] ?? '')) return fehler('Nach dem Minuszeichen muss eine Ziffer folgen.');
    if (text[i] === '0' && ZIFFER.test(text[i + 1] ?? ''))
      return fehler('Zahlen dürfen nicht mit einer 0 beginnen (außer der Zahl 0 selbst).', i);
    while (ZIFFER.test(text[i] ?? '')) i++;
    if (text[i] === '.') {
      i++;
      if (!ZIFFER.test(text[i] ?? '')) return fehler('Nach dem Dezimalpunkt fehlt eine Ziffer.');
      while (ZIFFER.test(text[i] ?? '')) i++;
    }
    if (text[i] === 'e' || text[i] === 'E') {
      i++;
      if (text[i] === '+' || text[i] === '-') i++;
      if (!ZIFFER.test(text[i] ?? '')) return fehler('Nach dem Exponenten fehlt eine Ziffer.');
      while (ZIFFER.test(text[i] ?? '')) i++;
    }
    return Number(text.slice(start, i));
  }

  function objekt(): Record<string, unknown> {
    const start = i;
    i++; // {
    const aus: Record<string, unknown> = {};
    leerraum();
    if (text[i] === '}') {
      i++;
      return aus;
    }
    for (;;) {
      leerraum();
      if (i >= text.length) return fehler('Das Objekt ist nicht geschlossen – ein } fehlt.', start);
      const c = text[i];
      if (c === '}') return fehler('Nach dem letzten Eintrag darf kein Komma stehen.', lastComma(i));
      if (c === "'")
        return fehler('Einfache Anführungszeichen gibt es in JSON nicht – Schlüssel stehen in doppelten Anführungszeichen ("…").');
      if (c !== '"') {
        if (ZIFFER.test(c))
          return fehler(
            'Hier muss ein Schlüssel in Anführungszeichen stehen. Falls eine Dezimalzahl mit Komma gemeint war: In JSON schreibt man den Dezimalpunkt (1.5), nicht das Komma.',
          );
        if (WORTZEICHEN.test(c)) return fehler('Schlüssel müssen in doppelten Anführungszeichen stehen ("name": …).');
        return fehler(`Unerwartetes Zeichen „${c}“ – hier muss ein Schlüssel in Anführungszeichen stehen.`);
      }
      const schluessel = zeichenkette();
      leerraum();
      if (text[i] !== ':')
        return fehler(
          i >= text.length
            ? 'Nach dem Schlüssel fehlt der Doppelpunkt.'
            : `Nach dem Schlüssel „${schluessel}“ muss ein Doppelpunkt stehen.`,
        );
      i++;
      aus[schluessel] = wert();
      leerraum();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === '}') {
        i++;
        return aus;
      }
      if (i >= text.length) return fehler('Das Objekt ist nicht geschlossen – ein } fehlt.', start);
      if (textBeginn(text[i])) return fehler('Zwischen zwei Einträgen fehlt ein Komma.');
      return fehler(`Unerwartetes Zeichen „${text[i]}“ – hier muss ein Komma oder } stehen.`);
    }
  }

  function liste(): unknown[] {
    const start = i;
    i++; // [
    const aus: unknown[] = [];
    leerraum();
    if (text[i] === ']') {
      i++;
      return aus;
    }
    for (;;) {
      leerraum();
      if (i >= text.length) return fehler('Die Liste ist nicht geschlossen – ein ] fehlt.', start);
      if (text[i] === ']') return fehler('Nach dem letzten Element darf kein Komma stehen.', lastComma(i));
      aus.push(wert());
      leerraum();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === ']') {
        i++;
        return aus;
      }
      if (i >= text.length) return fehler('Die Liste ist nicht geschlossen – ein ] fehlt.', start);
      if (textBeginn(text[i])) return fehler('Zwischen zwei Elementen fehlt ein Komma.');
      return fehler(`Unerwartetes Zeichen „${text[i]}“ – hier muss ein Komma oder ] stehen.`);
    }
  }

  /** Stelle des letzten Kommas vor `ende` (für „Komma am Ende“). */
  function lastComma(ende: number): number {
    const k = text.lastIndexOf(',', ende);
    return k >= 0 ? k : ende;
  }

  if (!text.trim()) throw new Abbruch(0, 'Noch nichts geschrieben.');
  const ergebnis = wert();
  leerraum();
  if (i < text.length)
    return fehler(
      'Nach dem JSON-Dokument steht noch Text. Mehrere Objekte gehören in eine Liste ([ … , … ]) oder in ein gemeinsames Objekt.',
    );
  return ergebnis;
}

/** Zeile und Spalte (ab 1) einer Zeichenstelle. */
export function zeileSpalte(text: string, stelle: number): { zeile: number; spalte: number } {
  const davor = text.slice(0, Math.max(0, Math.min(stelle, text.length)));
  const zeilen = davor.split('\n');
  return { zeile: zeilen.length, spalte: zeilen[zeilen.length - 1].length + 1 };
}

/** Prüft die Syntax: gültig → der gelesene Wert, sonst die erste fehlerhafte Stelle mit Hinweis. */
export function pruefeJsonSyntax(text: string): JsonSyntax {
  try {
    return { ok: true, wert: lese(text) };
  } catch (e) {
    if (e instanceof Abbruch) return { ok: false, fehler: { meldung: e.message, stelle: e.stelle, ...zeileSpalte(text, e.stelle) } };
    throw e;
  }
}

// ---------- Regeln ----------

export const JSON_TYPEN = ['string', 'number', 'boolean', 'null', 'array', 'object'] as const;
export type JsonTyp = (typeof JSON_TYPEN)[number];

export const JSON_TYP_NAMEN: Record<JsonTyp, string> = {
  string: 'Text',
  number: 'Zahl',
  boolean: 'Wahrheitswert (true/false)',
  null: 'null',
  array: 'Liste',
  object: 'Objekt',
};

export type JsonPrimitiv = string | number | boolean | null;

export interface JsonRegel {
  /** Pfad zum Wert: leer = das ganze Dokument; `kunde.name`, `positionen[0].menge`, `[1]` (bei Liste als Wurzel). */
  pfad: string;
  /** Der Wert hat diesen Typ. */
  typ?: JsonTyp;
  /** Der Wert ist genau dieser (Typ und Inhalt; „false“ als Text ist nicht false). */
  wert?: JsonPrimitiv;
  /** Länge der Liste (bzw. des Texts). */
  laenge?: number;
  /** Das Objekt hat mindestens diese Schlüssel. */
  schluessel?: string[];
  /** Der Pfad darf nicht vorkommen. */
  fehlt?: boolean;
  /** Eigener Hinweis, wenn die Regel nicht erfüllt ist. */
  hinweis?: string;
}

/** Typ mit Artikel für Sätze („muss eine Zahl sein“). */
const MIT_ARTIKEL: Record<JsonTyp, string> = {
  string: 'ein Text',
  number: 'eine Zahl',
  boolean: 'ein Wahrheitswert (true oder false)',
  null: 'null',
  array: 'eine Liste',
  object: 'ein Objekt',
};

const typVon = (w: unknown): JsonTyp =>
  w === null ? 'null' : Array.isArray(w) ? 'array' : typeof w === 'object' ? 'object' : (typeof w as JsonTyp);

/** Pfad zerlegen: `a.b[2].c` → ['a', 'b', 2, 'c']; undefined bei ungültiger Schreibweise. */
export function pfadTeile(pfad: string): (string | number)[] | undefined {
  if (pfad === '') return [];
  const teile: (string | number)[] = [];
  const re = /(?:^|\.)([A-Za-z0-9_äöüÄÖÜß-]+)|\[(\d+)\]/y;
  let pos = 0;
  while (pos < pfad.length) {
    re.lastIndex = pos;
    const m = re.exec(pfad);
    if (!m) return undefined;
    teile.push(m[2] !== undefined ? Number(m[2]) : m[1]);
    pos = re.lastIndex;
  }
  return teile;
}

/** Wert unter dem Pfad; `gefunden: false`, wenn es ihn nicht gibt. */
export function wertAm(wurzel: unknown, pfad: string): { gefunden: boolean; wert?: unknown } {
  const teile = pfadTeile(pfad);
  if (!teile) return { gefunden: false };
  let aktuell: unknown = wurzel;
  for (const t of teile) {
    if (typeof t === 'number') {
      if (!Array.isArray(aktuell) || t >= aktuell.length) return { gefunden: false };
      aktuell = aktuell[t];
    } else {
      if (aktuell === null || typeof aktuell !== 'object' || Array.isArray(aktuell) || !Object.hasOwn(aktuell, t))
        return { gefunden: false };
      aktuell = (aktuell as Record<string, unknown>)[t];
    }
  }
  return { gefunden: true, wert: aktuell };
}

const zeige = (w: unknown): string =>
  typeof w === 'string' ? `„${w}“` : w === null ? 'null' : typeof w === 'object' ? JSON.stringify(w) : String(w);
const ort = (pfad: string) => (pfad === '' ? 'das Dokument' : `„${pfad}“`);

/** Kurze Beschreibung dessen, was die Regel verlangt (für die Anzeige der Prüfung). */
export function beschreibeRegel(r: JsonRegel): string {
  const teile: string[] = [];
  if (r.fehlt) return `${ort(r.pfad)} kommt nicht vor`;
  if (r.wert !== undefined)
    teile.push(
      `ist ${typeof r.wert === 'string' ? 'der Text ' : r.wert === null ? '' : typeof r.wert === 'boolean' ? 'der Wert ' : 'die Zahl '}${zeige(r.wert)}`,
    );
  else if (r.typ) teile.push(`ist ${MIT_ARTIKEL[r.typ]}`);
  if (r.laenge !== undefined) teile.push(`hat die Länge ${r.laenge}`);
  if (r.schluessel?.length) teile.push(`hat die Schlüssel ${r.schluessel.map((s) => `„${s}“`).join(', ')}`);
  return `${ort(r.pfad)} ${teile.join(' und ') || 'ist vorhanden'}`;
}

export interface RegelErgebnis {
  regel: JsonRegel;
  ok: boolean;
  /** Was die Regel verlangt. */
  verlangt: string;
  /** Warum sie nicht erfüllt ist (leer, wenn ok). */
  meldung?: string;
}

const gleichWert = (a: unknown, b: JsonPrimitiv) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-9 : a === b);

/** Eine Regel gegen den gelesenen Wert prüfen. */
export function pruefeRegel(wurzel: unknown, r: JsonRegel): RegelErgebnis {
  const verlangt = beschreibeRegel(r);
  const { gefunden, wert } = wertAm(wurzel, r.pfad);
  const nein = (meldung: string): RegelErgebnis => ({ regel: r, ok: false, verlangt, meldung: r.hinweis ?? meldung });
  if (r.fehlt) return gefunden ? nein(`${ort(r.pfad)} darf nicht vorkommen.`) : { regel: r, ok: true, verlangt };
  if (!gefunden) return nein(`${ort(r.pfad)} fehlt.`);
  if (r.wert !== undefined && !gleichWert(wert, r.wert)) {
    const gleicherTyp = typVon(wert) === typVon(r.wert);
    return nein(
      gleicherTyp
        ? `${ort(r.pfad)} ist ${zeige(wert)}, verlangt ist ${zeige(r.wert)}.`
        : `${ort(r.pfad)} hat den falschen Typ: ${JSON_TYP_NAMEN[typVon(wert)]} statt ${JSON_TYP_NAMEN[typVon(r.wert)]} – achte auf Anführungszeichen (Text) bzw. keine (Zahl, true, false, null).`,
    );
  }
  if (r.typ && typVon(wert) !== r.typ)
    return nein(`${ort(r.pfad)} muss ${MIT_ARTIKEL[r.typ]} sein, ist aber ${MIT_ARTIKEL[typVon(wert)]}.`);
  if (r.laenge !== undefined) {
    const n = Array.isArray(wert) ? wert.length : typeof wert === 'string' ? wert.length : undefined;
    if (n !== r.laenge)
      return nein(
        n === undefined
          ? `${ort(r.pfad)} hat keine Länge (weder Liste noch Text).`
          : `${ort(r.pfad)} hat ${n} statt ${r.laenge} ${Array.isArray(wert) ? 'Elemente' : 'Zeichen'}.`,
      );
  }
  if (r.schluessel?.length) {
    const obj = wert !== null && typeof wert === 'object' && !Array.isArray(wert) ? (wert as Record<string, unknown>) : undefined;
    const fehlend = r.schluessel.filter((s) => !obj || !Object.hasOwn(obj, s));
    if (fehlend.length) return nein(`${ort(r.pfad)} braucht noch ${fehlend.map((s) => `„${s}“`).join(', ')}.`);
  }
  return { regel: r, ok: true, verlangt };
}

export interface JsonPruefung {
  syntax: JsonSyntax;
  /** Die Regeln (leer bei Syntaxfehler). */
  regeln: RegelErgebnis[];
  /** Syntax gültig und alle Regeln erfüllt. */
  ok: boolean;
}

export function pruefeJsonAntwort(text: string, regeln: readonly JsonRegel[]): JsonPruefung {
  const syntax = pruefeJsonSyntax(text);
  if (!syntax.ok) return { syntax, regeln: [], ok: false };
  const ergebnisse = regeln.map((r) => pruefeRegel(syntax.wert, r));
  return { syntax, regeln: ergebnisse, ok: ergebnisse.every((e) => e.ok) };
}

// ---------- Übungen (Inhalt) ----------

export interface JsonUebung {
  id: string;
  titel: string;
  /** 1 = leicht, 2 = mittel, 3 = schwer. */
  stufe: 1 | 2 | 3;
  /** Deep-Dive-Id, zu dem die Übung gehört (z. B. „15“ für Datenbereitstellung). */
  topicId?: string;
  /** Aufgabentext (Markdown, Anrede „Sie“ wie in der Prüfung). */
  aufgabe: string;
  /** Vorgabe im Eingabefeld (z. B. fehlerhaftes JSON zum Korrigieren); sonst leer. */
  vorgabe?: string;
  /** Musterlösung als JSON-Text. */
  loesung: string;
  pruefungen: JsonRegel[];
  hinweise: string[];
  erklaerung?: string;
  tags: string[];
}

const text = z.string().min(1);
const regelSchema = z
  .object({
    pfad: z.string(),
    typ: z.enum(JSON_TYPEN).optional(),
    wert: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
    laenge: z.number().int().min(0).optional(),
    schluessel: z.array(text).min(1).optional(),
    fehlt: z.boolean().optional(),
    hinweis: z.string().optional(),
  })
  .refine((r) => r.fehlt || r.typ !== undefined || r.wert !== undefined || r.laenge !== undefined || r.schluessel !== undefined, {
    message: 'Regel ohne Bedingung (typ, wert, laenge, schluessel oder fehlt)',
  });

const uebungSchema = z.object({
  id: text,
  titel: text,
  stufe: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  topicId: z.string().optional(),
  aufgabe: text,
  vorgabe: z.string().optional(),
  loesung: text,
  pruefungen: z.array(regelSchema).min(1),
  hinweise: z.array(z.string()).default([]),
  erklaerung: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

/** Inhaltliche Prüfung: gültige Pfade, Musterlösung ist gültiges JSON und erfüllt alle eigenen Regeln. */
export function pruefeJsonUebung(u: JsonUebung): string[] {
  const fehler: string[] = [];
  for (const r of u.pruefungen) if (!pfadTeile(r.pfad)) fehler.push(`Pfad „${r.pfad}“ ist ungültig`);
  if (fehler.length) return fehler;
  const p = pruefeJsonAntwort(u.loesung, u.pruefungen);
  if (!p.syntax.ok) return [`Musterlösung ist kein gültiges JSON: ${p.syntax.fehler.meldung} (Zeile ${p.syntax.fehler.zeile})`];
  for (const e of p.regeln) if (!e.ok) fehler.push(`Musterlösung erfüllt die Regel nicht: ${e.verlangt}`);
  if (u.vorgabe !== undefined && u.vorgabe.trim() && pruefeJsonAntwort(u.vorgabe, u.pruefungen).ok)
    fehler.push('Die Vorgabe erfüllt die Regeln schon – es gäbe nichts zu tun');
  return fehler;
}

function beschreibeZod(error: z.ZodError): string {
  const first = error.issues[0];
  if (!first) return 'ungültig';
  return first.path.length ? `${first.path.join('.')}: ${first.message}` : first.message;
}

export function parseJsonUebungen(fileName: string, raw: string): { uebungen: JsonUebung[]; issues: ImportIssue[] } {
  const issues: ImportIssue[] = [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { uebungen: [], issues: [{ file: fileName, message: `Kein gültiges JSON: ${e instanceof Error ? e.message : String(e)}` }] };
  }
  const liste = (data as { uebungen?: unknown })?.uebungen;
  if (!Array.isArray(liste)) return { uebungen: [], issues: [{ file: fileName, message: 'Feld „uebungen“ fehlt.' }] };
  const uebungen: JsonUebung[] = [];
  const gesehen = new Set<string>();
  liste.forEach((roh, i) => {
    const r = uebungSchema.safeParse(roh);
    const name = (roh as { id?: unknown })?.id ?? `Nr. ${i + 1}`;
    if (!r.success) {
      issues.push({ file: fileName, message: `JSON-Übung ${String(name)} übersprungen: ${beschreibeZod(r.error)}` });
      return;
    }
    const u = r.data as JsonUebung;
    const fehler = pruefeJsonUebung(u);
    if (gesehen.has(u.id)) fehler.unshift('ID doppelt');
    if (fehler.length) {
      issues.push({ file: fileName, message: `JSON-Übung ${u.id} übersprungen: ${fehler.slice(0, 3).join('; ')}` });
      return;
    }
    gesehen.add(u.id);
    uebungen.push(u);
  });
  return { uebungen, issues };
}
