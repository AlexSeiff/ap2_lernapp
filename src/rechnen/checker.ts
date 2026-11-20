// Prüfen der Eingaben einer Rechenübung (rein, getestet in tests/rechenChecker.test.ts).
// Zahlen: deutsches Komma oder Punkt, Tausenderpunkte, Leerzeichen, typografisches Minus, optionale Einheit.
// Toleranz: explizit (`toleranz`) oder eine halbe Einheit der letzten Stelle aus `runden`.
// Falsche Werte werden mit den Fehlerbildern der Vorlage verglichen und erklärt; dazu kommen allgemeine Fehlerbilder
// (Anteil statt Prozent, Vorzeichen, zu früh oder falsch gerundet).

import { formatZahl } from '../../domain/rechenweg';
import type { RechenWert } from '../../domain/types';
import type { AufgeloesteEingabe, RechenInstanz } from './instanz';
import type { Fehlerbild } from './typen';

export type EingabeStatus = 'richtig' | 'falsch' | 'leer' | 'ungueltig';

export interface EingabeErgebnis {
  status: EingabeStatus;
  /** Erklärung eines erkannten typischen Fehlers oder Hinweis zur Eingabe. */
  meldung?: string;
  /** true, wenn `meldung` ein Fehlerbild der Vorlage oder ein allgemeines Fehlerbild erklärt. */
  fehlerbild?: boolean;
  /** Hinweis zur Einheit (die Zahl zählt trotzdem). */
  einheitHinweis?: string;
}

export interface PruefErgebnis {
  ok: boolean;
  richtig: number;
  gesamt: number;
  ergebnisse: Record<string, EingabeErgebnis>;
}

// ---------- Zahlen lesen ----------

const MINUS = /^[−–—]/;
const LEER = /[\s\u00a0\u202f']/g;

/**
 * Liest eine Zahl mit optionaler Einheit: „1.080,50 €“, „1080.5“, „−5“, „70 min“, „93,33 %“.
 * `kandidaten`: mögliche Werte, der wahrscheinlichste zuerst (bei „1.080“ ist neben 1,08 auch 1080 denkbar).
 */
export function leseZahl(text: string): { kandidaten: number[]; einheit: string } | undefined {
  const t = text
    .trim()
    .replace(/^(?:=|≈|ca\.?)\s*/i, '')
    .replace(MINUS, '-');
  const m = /^([+-]?[\s\u00a0\u202f]*(?:\d[\d.,'\s\u00a0\u202f]*)?\d|[+-]?[.,]\d+)(.*)$/.exec(t);
  if (!m) return undefined;
  const zahl = m[1].replace(LEER, '');
  const einheit = m[2].trim();
  const komma = (zahl.match(/,/g) ?? []).length;
  const punkt = (zahl.match(/\./g) ?? []).length;
  const num = (s: string) => Number(s);
  let kandidaten: number[];
  if (komma && punkt) {
    // Das letzte Trennzeichen ist das Dezimaltrennzeichen, das andere trennt Tausender.
    const dez = zahl.lastIndexOf(',') > zahl.lastIndexOf('.') ? ',' : '.';
    const tausend = dez === ',' ? '.' : ',';
    kandidaten = [num(zahl.split(tausend).join('').replace(dez, '.'))];
  } else if (komma || punkt) {
    const sep = komma ? ',' : '.';
    const anzahl = komma || punkt;
    const tausender = new RegExp(`^[+-]?\\d{1,3}(\\${sep}\\d{3})+$`).test(zahl);
    if (anzahl > 1) kandidaten = tausender ? [num(zahl.split(sep).join(''))] : [];
    else {
      const dezimal = num(zahl.replace(sep, '.'));
      kandidaten = tausender ? [dezimal, num(zahl.replace(sep, ''))] : [dezimal];
    }
  } else kandidaten = [num(zahl)];
  kandidaten = kandidaten.filter((k) => Number.isFinite(k));
  return kandidaten.length ? { kandidaten, einheit } : undefined;
}

// ---------- Einheiten ----------

const SYNONYME: string[][] = [
  ['min', 'minute', 'minuten', 'mins'],
  ['h', 'std', 'stunde', 'stunden'],
  ['€', 'eur', 'euro'],
  ['t€', 'teur', 'tsd€', 'tsdeur'],
  ['%', 'prozent', 'v.h.'],
  ['prozentpunkte', 'prozentpunkt', 'pp', '%-punkte', '%punkte', 'pkt'],
  ['tage', 'tag', 'd'],
  ['tage2', 'tag2', 'd2'],
  ['jahre', 'jahr', 'j', 'a'],
  ['monate', 'monat', 'mon'],
  ['stück', 'stk', 'st', 'stueck'],
  ['gb', 'gbyte', 'gigabyte'],
  ['werte', 'wert'],
];

const normEinheit = (s: string) =>
  s
    .toLowerCase()
    .replace(/²/g, '2')
    .replace(/[\s^.]/g, '')
    .replace(/(?:pro|je|\/)(?:jahr|monat|auftrag|stück|einheit|h|std)$/, '');

/** Passt die eingegebene Einheit zur erwarteten (Synonyme, Groß-/Kleinschreibung egal)? */
export function einheitPasst(eingabe: string, erwartet: string): boolean {
  const a = normEinheit(eingabe);
  const b = normEinheit(erwartet);
  if (!a || a === b) return true;
  return SYNONYME.some((gruppe) => gruppe.includes(a) && gruppe.includes(b));
}

// ---------- Toleranz und Format ----------

/** Erlaubte Abweichung: explizit, sonst halbe Einheit der letzten Stelle, sonst nur Rechenungenauigkeit. */
export function toleranz(e: Pick<AufgeloesteEingabe, 'toleranz' | 'runden'>, wert = 0): number {
  const eps = 1e-9 * Math.max(1, Math.abs(wert));
  if (e.toleranz !== undefined) return e.toleranz + eps;
  if (e.runden !== undefined) return 0.5 * 10 ** -e.runden + eps;
  return eps;
}

/** Wert zum Anzeigen: Zahl gerundet im deutschen Format mit Einheit, Liste mit „; “, leere Liste „keine“. */
export function formatWert(w: RechenWert, e: Pick<AufgeloesteEingabe, 'runden' | 'einheit'>): string {
  const mitEinheit = (s: string) => (e.einheit ? `${s} ${e.einheit}` : s);
  if (typeof w === 'number') return mitEinheit(formatZahl(w, e.runden));
  if (Array.isArray(w)) return w.length ? mitEinheit(w.map((x) => formatZahl(x, e.runden)).join('; ')) : 'keine';
  return w;
}

// ---------- Text und Mengen ----------

const normText = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Wörter, die allein keine Antwort sind („Filiale“ für „Filiale Süd“). */
const ALLGEMEIN = new Set([
  'filiale',
  'anbieter',
  'gruppe',
  'team',
  'kategorie',
  'variante',
  'alternative',
  'risiko',
  'abteilung',
  'standort',
  'der',
  'die',
  'das',
]);
const JA = new Set(['ja', 'j', 'yes', 'y', 'eingehalten']);
const NEIN = new Set(['nein', 'n', 'no', 'nicht eingehalten', 'verfehlt']);

/** Text ohne Groß-/Kleinschreibung und Umlaut-Schreibweise; ein kennzeichnendes Teilwort genügt („Süd“, „B“). */
export function textPasst(eingabe: string, erwartet: string): boolean {
  const a = normText(eingabe);
  const b = normText(erwartet);
  if (!a) return false;
  if (a === b) return true;
  if (b === 'ja' || b === 'nein') return (b === 'ja' ? JA : NEIN).has(a);
  const wa = a.split(' ');
  const wb = b.split(' ');
  if (!wa.every((w) => wb.includes(w))) return false;
  return wa.includes(wb[wb.length - 1]) || wa.some((w) => w.length >= 4 && !ALLGEMEIN.has(w));
}

/** Kürzel einer Menge („A → C → D“, „A, C, D“) als sortierte Liste. */
const kuerzel = (text: string) =>
  text
    .toUpperCase()
    .split(/[^A-Z0-9ÄÖÜ]+/)
    .filter(Boolean)
    .sort();

/** Menge von Kürzeln, Reihenfolge und Trennzeichen egal; „ACDFG“ ohne Trennzeichen geht, wenn alle Kürzel einzelne Zeichen sind. */
export function mengePasst(eingabe: string, erwartet: string): boolean {
  const soll = kuerzel(erwartet);
  let ist = kuerzel(eingabe);
  if (soll.every((k) => k.length === 1)) ist = ist.flatMap((t) => [...t]).sort();
  return ist.length === soll.length && ist.every((k, i) => k === soll[i]);
}

// ---------- Listen ----------

const KEINE = /^(?:keine?r?|kein ausreißer|keine ausreißer|-|–|—|∅|leer|0)$/i;

/** Zahlenliste „220“, „19; 220“, „19 220“, „19, 220“ (Komma mit Leerzeichen trennt) oder „keine“. */
export function leseListe(text: string): number[] | undefined {
  const t = text.trim();
  if (KEINE.test(t)) return [];
  const teile = t
    .replace(/,\s+/g, ';')
    .replace(/[a-zA-ZäöüÄÖÜß€%]+\.?/g, ' ')
    .split(/[;|\n\s]+/)
    .filter(Boolean);
  if (!teile.length) return undefined;
  const werte = teile.map((p) => leseZahl(p)?.kandidaten[0]);
  return werte.every((w) => w !== undefined) ? (werte as number[]) : undefined;
}

function listeGleich(a: number[], b: number[], tol: number): boolean {
  if (a.length !== b.length) return false;
  const x = [...a].sort((p, q) => p - q);
  const y = [...b].sort((p, q) => p - q);
  return x.every((v, i) => Math.abs(v - y[i]) <= tol);
}

// ---------- Prüfen ----------

/** Prüft eine Eingabe gegen den erwarteten Wert und erklärt erkannte Fehlerbilder. */
export function pruefeEingabe(e: AufgeloesteEingabe, text: string, fehlerbilder: Fehlerbild[] = []): EingabeErgebnis {
  if (!text.trim()) return { status: 'leer' };
  const eigene = fehlerbilder.filter((f) => f.eingabe === e.id);

  if (e.vergleich === 'text' || e.vergleich === 'menge') {
    const erwartet = String(e.erwartet);
    const passt = (soll: string) => (e.vergleich === 'menge' ? mengePasst(text, soll) : textPasst(text, soll));
    if (passt(erwartet)) return { status: 'richtig' };
    const fb = eigene.find((f) => typeof f.wert === 'string' && passt(f.wert));
    return fb ? { status: 'falsch', meldung: fb.text, fehlerbild: true } : { status: 'falsch' };
  }

  if (e.vergleich === 'liste') {
    const liste = leseListe(text);
    if (!liste) return { status: 'ungueltig', meldung: 'Gib die Zahlen mit Semikolon getrennt ein (z. B. „19; 220“) oder „keine“.' };
    const soll = Array.isArray(e.erwartet) ? e.erwartet : [];
    const tol = toleranz(e, Math.max(0, ...soll.map(Math.abs)));
    if (listeGleich(liste, soll, tol)) return { status: 'richtig' };
    const fb = eigene.find((f) => Array.isArray(f.wert) && listeGleich(liste, f.wert, tol));
    if (fb) return { status: 'falsch', meldung: fb.text, fehlerbild: true };
    if (liste.length < soll.length) return { status: 'falsch', meldung: 'Es fehlt mindestens ein Wert.' };
    if (liste.length > soll.length) return { status: 'falsch', meldung: 'Da ist mindestens ein Wert zu viel.' };
    return { status: 'falsch' };
  }

  const gelesen = leseZahl(text);
  if (!gelesen) return { status: 'ungueltig', meldung: 'Das ist keine Zahl. Beispiel: „70,5“ oder „1.080,50 €“.' };
  const soll = typeof e.erwartet === 'number' ? e.erwartet : NaN;
  const tol = toleranz(e, soll);
  const einheitHinweis =
    gelesen.einheit && e.einheit && !einheitPasst(gelesen.einheit, e.einheit)
      ? `Einheit „${gelesen.einheit}“ passt nicht zu „${e.einheit}“ – gezählt wird nur die Zahl.`
      : undefined;
  const mit = (r: EingabeErgebnis): EingabeErgebnis => (einheitHinweis ? { ...r, einheitHinweis } : r);
  const trifft = (ziel: number, t = tol) => gelesen.kandidaten.some((k) => Math.abs(k - ziel) <= t);

  if (trifft(soll)) return mit({ status: 'richtig' });
  const fb = eigene.find((f) => typeof f.wert === 'number' && trifft(f.wert, toleranz(e, f.wert)));
  if (fb) return mit({ status: 'falsch', meldung: fb.text, fehlerbild: true });
  if (e.einheit === '%' && gelesen.kandidaten.some((k) => Math.abs(k * 100 - soll) <= tol)) {
    return mit({ status: 'falsch', meldung: 'Das ist der Anteil – gib ihn in Prozent an (× 100).', fehlerbild: true });
  }
  if (soll !== 0 && trifft(-soll)) return mit({ status: 'falsch', meldung: 'Fast: Prüfe das Vorzeichen.', fehlerbild: true });
  // Richtig bis auf die Rundung: Wert gleich dem erwarteten, auf die Stellen der Eingabe gerundet – oder knapp daneben.
  const nachkomma = /[.,](\d+)\D*$/.exec(text.trim());
  const stellen = nachkomma ? nachkomma[1].length : 0;
  const gerundetGleich =
    e.runden !== undefined &&
    stellen < e.runden &&
    gelesen.kandidaten.some((k) => Math.abs(k - soll) <= 0.5 * 10 ** -stellen + 1e-9 * Math.max(1, Math.abs(soll)));
  if (gerundetGleich || trifft(soll, tol * 10)) {
    const r = e.runden !== undefined ? `auf ${e.runden} ${e.runden === 1 ? 'Nachkommastelle' : 'Nachkommastellen'}` : 'genauer';
    return mit({
      status: 'falsch',
      meldung: `Fast – rechne mit ungerundeten Zwischenergebnissen und runde erst am Ende ${r}.`,
      fehlerbild: true,
    });
  }
  return mit({ status: 'falsch' });
}

/** Prüft alle Eingaben einer Übung. `ok` nur, wenn jede Eingabe richtig ist. */
export function pruefeAntworten(inst: RechenInstanz, antworten: Record<string, string>): PruefErgebnis {
  const ergebnisse: Record<string, EingabeErgebnis> = {};
  let richtig = 0;
  for (const e of inst.eingaben) {
    const r = pruefeEingabe(e, antworten[e.id] ?? '', inst.loesung.fehlerbilder);
    ergebnisse[e.id] = r;
    if (r.status === 'richtig') richtig++;
  }
  return { ok: richtig === inst.eingaben.length, richtig, gesamt: inst.eingaben.length, ergebnisse };
}
