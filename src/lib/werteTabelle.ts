// Wertetabelle als Antwort: Aufgaben, die ausdrücklich eine Tabelle verlangen („tabellarisch“, „Häufigkeitstabelle“, „Tragen Sie … in die
// Tabelle ein“) und deren Musterlösung eine Tabelle ist. Die Vorlage kommt aus der Aufgabe (Tabelle mit vorgegebenen Zellen) oder –
// nur die Kopfzeile – aus der Musterlösung; Inhalte der Lösung werden nie vorab gezeigt. Nach der Abgabe vergleicht der Abgleich
// Zahlen- und Kreuzzellen mit der Musterlösung (Hilfe zur Selbstbewertung). Rein, ohne React.

import type { Task } from '../../shared/types';
import { markdownTabellen } from './tabellenEditor';

export interface WerteAntwort {
  editor: 'werte';
  kopf: string[];
  zeilen: string[][];
  notiz?: string;
}

export interface WerteVorlage {
  kopf: string[];
  /** Zeilen mit den vorgegebenen Zellen ('' = auszufüllen). */
  zeilen: string[][];
  /** „Kreuzen Sie … an“ und die Lösung besteht aus Kreuzen: Kästchen statt Textfelder (gespeichert als „X“). */
  kreuze?: true;
}

/** Die Aufgabe verlangt eine Tabelle als Antwort (nicht: „die Tabelle kunde“, „eine eigene Tabelle benötigt“). */
const VERLANGT_TABELLE =
  /tabellarisch|(?<!\p{L})(?:in die|in der|eine|einer) Tabelle(?!\p{L})|Häufigkeitstabelle|Ergebnistabelle|Wertetabelle/iu;

const ohneMarkup = (s: string) => s.replace(/\*\*|__|`/g, '').trim();

/** Punkte-Tabellen („| Element | P |“) sind Bewertungsschemata, keine Lösungstabellen. */
const istPunkteTabelle = (kopf: string[]) => kopf.some((k) => /^(P|Punkte)$/i.test(ohneMarkup(k)));

/** Erste Lösungstabelle der Musterlösung. */
export function musterWerteTabelle(task: Pick<Task, 'solution'>): { kopf: string[]; zeilen: string[][] } | undefined {
  const t = markdownTabellen(task.solution?.markdown ?? '').find((x) => !istPunkteTabelle(x.kopf));
  return t && { kopf: t.kopf.map(ohneMarkup), zeilen: t.zeilen.map((r) => t.kopf.map((_, i) => ohneMarkup(r[i] ?? ''))) };
}

/** Vorlage für die Antworttabelle; undefined = keine Tabellenaufgabe. */
export function werteVorlage(task: Pick<Task, 'markdown' | 'solution'>): WerteVorlage | undefined {
  if (!VERLANGT_TABELLE.test(task.markdown)) return undefined;
  const muster = musterWerteTabelle(task);
  if (!muster) return undefined;
  const inAufgabe = markdownTabellen(task.markdown)[0];
  if (inAufgabe) {
    const kopf = inAufgabe.kopf.map(ohneMarkup);
    const kreuze = /kreuzen/i.test(task.markdown) && istKreuzTabelle(muster.zeilen);
    return { kopf, zeilen: inAufgabe.zeilen.map((r) => kopf.map((_, i) => ohneMarkup(r[i] ?? ''))), ...(kreuze ? { kreuze } : {}) };
  }
  // Nur die Kopfzeile der Lösung; so viele leere Zeilen wie dort (Summenzeile eingeschlossen).
  return { kopf: muster.kopf, zeilen: muster.zeilen.map(() => muster.kopf.map(() => '')) };
}

/**
 * Aufgabentext ohne die Vorlagentabelle – die steht schon als Antworttabelle darunter. Text vor und nach der Tabelle bleibt
 * („Schlussfolgerung: …“, Einleitung der nächsten Teilaufgabe).
 */
export function ohneVorlageTabelle(markdown: string): string {
  const z = markdown.split('\n');
  const start = z.findIndex((x, i) => x.trim().startsWith('|') && /^\s*\|?\s*:?-{3,}/.test(z[i + 1] ?? ''));
  if (start < 0) return markdown;
  let ende = start;
  while (ende < z.length && z[ende].trim().startsWith('|')) ende++;
  return [...z.slice(0, start), ...z.slice(ende)].join('\n');
}

/** Ist die Zelle vorgegeben (aus der Vorlage der Aufgabe)? */
export const istVorgegeben = (v: WerteVorlage, zeile: number, spalte: number) => !!v.zeilen[zeile]?.[spalte]?.trim();

export function leereWerteAntwort(v: WerteVorlage): WerteAntwort {
  return { editor: 'werte', kopf: [...v.kopf], zeilen: v.zeilen.map((r) => [...r]) };
}

/** Gespeicherte Zeilen an die aktuelle Vorlage anpassen: Spaltenzahl der Vorlage, vorgegebene Zellen aus der Vorlage. */
export function passeAn(v: WerteVorlage, a: Pick<WerteAntwort, 'zeilen' | 'notiz'>): WerteAntwort {
  const zeilen = (a.zeilen.length ? a.zeilen : v.zeilen).map((r, zi) =>
    v.kopf.map((_, si) => (istVorgegeben(v, zi, si) ? v.zeilen[zi][si] : (r[si] ?? ''))),
  );
  return { editor: 'werte', kopf: [...v.kopf], zeilen, ...(a.notiz ? { notiz: a.notiz } : {}) };
}

/** Nichts eingetragen (vorgegebene Zellen zählen nicht). */
export function istWerteLeer(v: WerteVorlage, a: WerteAntwort): boolean {
  return !a.notiz?.trim() && a.zeilen.every((r, zi) => r.every((z, si) => istVorgegeben(v, zi, si) || !z.trim()));
}

/** Als Markdown-Tabelle (KI-Bewertung, Übersicht). */
export function werteAlsText(a: WerteAntwort): string {
  const zeile = (r: string[]) => `| ${r.map((z) => z.replace(/\|/g, '\\|').trim() || ' ').join(' | ')} |`;
  const teile = [zeile(a.kopf), `|${a.kopf.map(() => '---').join('|')}|`, ...a.zeilen.filter((r) => r.some((z) => z.trim())).map(zeile)];
  if (a.notiz?.trim()) teile.push('', a.notiz.trim());
  return teile.join('\n');
}

// ---------- Abgleich ----------

/** Zahl einer Zelle: der Wert nach dem letzten „=“, ohne Σ, Einheiten und Vorzeichen-Plus; Dezimalkomma oder -punkt. */
export function zahlAus(zelle: string): number | undefined {
  const teil = zelle.split('=').pop()!;
  const s = teil
    .replace(/T€|Mio\.?|Tage²?|Tag|min/g, '')
    .replace(/[Σ%€\s]/g, '')
    .replace(/[−–]/g, '-')
    .replace(/^\+/, '');
  if (!/^-?[\d.,]+$/.test(s) || !/\d/.test(s)) return undefined;
  let n = s;
  if (n.includes(',')) n = n.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(n)) n = n.replace(/\./g, '');
  const wert = Number(n);
  return Number.isFinite(wert) ? wert : undefined;
}

function istKreuz(z: string): boolean {
  return /^[x✓✗×]$/i.test(z.trim());
}
/** Alle Zellen außer der ersten Spalte sind leer oder ein Kreuz (und mindestens ein Kreuz). */
function istKreuzTabelle(zeilen: string[][]): boolean {
  const zellen = zeilen.flatMap((r) => r.slice(1));
  return zellen.some(istKreuz) && zellen.every((z) => !z.trim() || istKreuz(z));
}
const textNorm = (z: string) =>
  z
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

export type ZellBefund = 'gleich' | 'abweichend' | 'fehlt' | 'offen';

export interface WerteAbgleich {
  /** Je Zeile der Musterlösung: Befund je Spalte. */
  zeilen: { muster: string[]; deine: string[]; befund: ZellBefund[] }[];
  /** Vergleichbare Zellen (Zahlen und Kreuze) und davon gleich. */
  vergleichbar: number;
  gleich: number;
}

/**
 * Zellweiser Abgleich in der Reihenfolge der Zeilen (die Reihenfolge ist oft Teil der Aufgabe, z. B. absteigend sortiert).
 * Verglichen werden Zahlen (Rundung auf die angegebene Stelle genügt) und Kreuzspalten; Text vergleichst du selbst.
 * undefined, wenn die Lösung kaum Zahlen oder Kreuze enthält (reine Texttabelle).
 */
export function gleicheWerteAb(task: Pick<Task, 'markdown' | 'solution'>, a: WerteAntwort): WerteAbgleich | undefined {
  const m = musterWerteTabelle(task);
  const v = werteVorlage(task);
  if (!m || !v) return undefined;
  const kreuzTabelle = istKreuzTabelle(m.zeilen);
  const zellen = m.zeilen.flatMap((r, zi) => r.map((z, si) => ({ z, vorgegeben: istVorgegeben(v, zi, si) }))).filter((x) => !x.vorgegeben);
  const zahlen = zellen.filter((x) => zahlAus(x.z) !== undefined).length;
  if (!kreuzTabelle && zahlen < zellen.length * 0.3) return undefined;

  let vergleichbar = 0;
  let gleich = 0;
  const zeilen = m.zeilen.map((r, zi) => {
    const deine = a.zeilen[zi] ?? [];
    const befund = r.map((muster, si): ZellBefund => {
      if (istVorgegeben(v, zi, si)) return 'offen';
      const dein = (deine[si] ?? '').trim();
      const mz = zahlAus(muster);
      if (kreuzTabelle && si > 0) {
        vergleichbar++;
        const ok = istKreuz(dein) === istKreuz(muster);
        if (ok) gleich++;
        return ok ? 'gleich' : 'abweichend';
      }
      if (mz === undefined) return textNorm(dein) && textNorm(dein) === textNorm(muster) ? 'gleich' : 'offen';
      vergleichbar++;
      if (!dein) return 'fehlt';
      const dz = zahlAus(dein);
      const ok = dz !== undefined && Math.abs(dz - mz) <= Math.max(0.006, Math.abs(mz) * 0.0015);
      if (ok) gleich++;
      return ok ? 'gleich' : 'abweichend';
    });
    return { muster: r, deine: r.map((_, si) => deine[si] ?? ''), befund };
  });
  return { zeilen, vergleichbar, gleich };
}
