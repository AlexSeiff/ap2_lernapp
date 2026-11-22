// Entscheidungsbaum zum Ausfüllen wie auf dem Prüfungsbogen (ID3, erste Entscheidungsebene): oben die Gesamtmenge, darunter je
// Merkmal ein Knoten mit seinen Zweigen und den Teilmengen T = [ja, nein] samt Entropie. Steht in Aufgaben, Lösungen und
// Rechenübungen als ```entscheidungsbaum-Block; „___“ ist eine Lücke. Rein, ohne React.
//
//   ```entscheidungsbaum
//   T = ___ | Entropie(T) = ___
//   Altersgruppe
//     A1 | T₁ = [3, 0] | Entropie(T₁) = 0
//     ___ | T₂ = ___ | Entropie(T₂) = ___
//   ___
//     ___ | T₁ = ___ | Entropie(T₁) = ___
//   ```
//
// Erste Zeile: die Gesamtmenge (Felder „Name = Wert“, getrennt durch „|“). Zeile ohne Einrückung: ein Merkmal (Knoten). Eingerückte
// Zeile: ein Zweig dieses Merkmals – erst die Beschriftung, dann die Felder. Lücken werden in Lesereihenfolge gezählt.

export type BaumWert = { art: 'text'; text: string } | { art: 'luecke'; index: number };

export interface BaumFeld {
  /** z. B. „T₂“ oder „Entropie(T₂)“; leer, wenn die Zelle nur einen Wert hat. */
  name: string;
  wert: BaumWert;
}

export interface BaumZweig {
  name: BaumWert;
  felder: BaumFeld[];
}

export interface Teilbaum {
  merkmal: BaumWert;
  zweige: BaumZweig[];
}

export interface Entscheidungsbaum {
  wurzel: BaumFeld[];
  baeume: Teilbaum[];
  /** Anzahl der Lücken („___“). */
  luecken: number;
}

/** Antwort in Klausur und Einzelaufgabe: ein Eintrag je Lücke (Lesereihenfolge), dazu die Begründung. */
export interface BaumAntwort {
  editor: 'baum';
  luecken: string[];
  notiz?: string;
}

export const leereBaumAntwort = (anzahl: number): BaumAntwort => ({ editor: 'baum', luecken: Array<string>(anzahl).fill('') });
export const istBaumLeer = (a: BaumAntwort) => !a.notiz?.trim() && a.luecken.every((l) => !l.trim());
/** Gespeicherte Antwort an die Zahl der Lücken anpassen (Aufgabe geändert). */
export const passeBaumAn = (a: BaumAntwort, anzahl: number): BaumAntwort => ({
  ...a,
  luecken: Array.from({ length: anzahl }, (_, i) => a.luecken[i] ?? ''),
});
export const baumAntwortAlsText = (a: BaumAntwort): string => {
  const t = `Entscheidungsbaum: ${a.luecken.map((l, i) => `(${i + 1}) ${l.trim() || '…'}`).join(' · ')}`;
  return a.notiz?.trim() ? `${t}\n\n${a.notiz.trim()}` : t;
};

const LUECKE = /^_{3,}$/;

/** ```entscheidungsbaum-Blöcke eines Markdown-Texts (Inhalt ohne Zaun). */
const BLOCK = /^```entscheidungsbaum[ \t]*\n([\s\S]*?)\n```[ \t]*$/m;

export function baumBlock(markdown: string): string | undefined {
  return BLOCK.exec(markdown)?.[1];
}

/** Markdown ohne den Baum (der steht dann als Antwortformular darunter). */
export function ohneBaum(markdown: string): string {
  return markdown
    .replace(BLOCK, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function leseBaum(text: string): { baum?: Entscheidungsbaum; fehler?: string } {
  let index = 0;
  const wert = (t: string): BaumWert => (LUECKE.test(t.trim()) ? { art: 'luecke', index: index++ } : { art: 'text', text: t.trim() });
  const feld = (t: string): BaumFeld => {
    const i = t.indexOf('=');
    return i < 0 ? { name: '', wert: wert(t) } : { name: t.slice(0, i).trim(), wert: wert(t.slice(i + 1)) };
  };
  const zeilen = text.split('\n').filter((z) => z.trim());
  if (!zeilen.length) return { fehler: 'Der Entscheidungsbaum ist leer.' };
  const [kopf, ...rest] = zeilen;
  if (/^\s/.test(kopf) || !kopf.includes('='))
    return { fehler: 'Die erste Zeile muss die Gesamtmenge sein, z. B. „T = ___ | Entropie(T) = ___“.' };
  const wurzel = kopf.split('|').map(feld);
  const baeume: Teilbaum[] = [];
  for (const z of rest) {
    if (/^\s/.test(z)) {
      const aktuell = baeume[baeume.length - 1];
      if (!aktuell) return { fehler: `Zweig „${z.trim()}“ steht vor dem ersten Merkmal.` };
      const [name, ...felder] = z.split('|');
      aktuell.zweige.push({ name: wert(name), felder: felder.map(feld) });
    } else {
      baeume.push({ merkmal: wert(z), zweige: [] });
    }
  }
  if (!baeume.length) return { fehler: 'Der Entscheidungsbaum hat kein Merkmal.' };
  const ohne = baeume.find((b) => !b.zweige.length);
  if (ohne) return { fehler: 'Ein Merkmal hat keine Zweige – Zweige werden eingerückt.' };
  return { baum: { wurzel, baeume, luecken: index } };
}

// ---------- Vergleich mit der Musterlösung ----------

/** Zahl mit Komma oder Punkt („0,9183“, „0.918“) – sonst undefined. */
function zahl(t: string): number | undefined {
  const s = t.trim().replace(/\s/g, '');
  if (!/^[-−]?\d+(?:[.,]\d+)?$/.test(s)) return undefined;
  return Number(s.replace('−', '-').replace(',', '.'));
}

/** Geordnete Zahlenliste in Klammern oder mit Trennzeichen: „[2, 1]“, „2;1“, „2 1“. */
export function paar(t: string): number[] | undefined {
  const s = t
    .trim()
    .replace(/^\[|\]$/g, '')
    .trim();
  if (!s || !/^[\d\s,;]+$/.test(s)) return undefined;
  const teile = s.split(/[\s,;]+/).filter(Boolean);
  return teile.length >= 2 ? teile.map(Number) : undefined;
}

const normText = (t: string) =>
  t
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * Stimmt ein Eintrag mit dem Wert der Musterlösung überein? Zahlen bis auf die vierte Nachkommastelle (Prüfungsvorgabe), Teilmengen
 * in Reihenfolge [ja, nein], Text ohne Groß-/Kleinschreibung.
 */
export function baumWertGleich(eingabe: string, soll: string): boolean {
  if (!eingabe.trim()) return false;
  const zs = zahl(soll);
  if (zs !== undefined) {
    const ze = zahl(eingabe);
    return ze !== undefined && Math.abs(ze - zs) <= 0.00051;
  }
  const ps = paar(soll);
  if (ps) {
    const pe = paar(eingabe);
    return !!pe && pe.length === ps.length && pe.every((v, i) => v === ps[i]);
  }
  return normText(eingabe) === normText(soll);
}

export type BaumBefund = { soll: string; status: 'gleich' | 'abweichend' | 'leer' };

const text = (w: BaumWert, eintraege: string[]) => (w.art === 'text' ? w.text : (eintraege[w.index] ?? ''));

/**
 * Lücke für Lücke mit der Musterlösung (gleiche Form, ohne Lücken) vergleichen. Die Merkmale der Teilbäume dürfen in anderer
 * Reihenfolge stehen als in der Lösung, ebenso die Zweige eines Merkmals: zugeordnet wird über den Namen.
 */
export function gleicheBaumAb(vorlage: Entscheidungsbaum, eintraege: string[], loesung: Entscheidungsbaum): BaumBefund[] | undefined {
  const befunde: BaumBefund[] = Array.from({ length: vorlage.luecken }, () => ({ soll: '', status: 'leer' as const }));
  const setze = (w: BaumWert, soll: BaumWert | undefined) => {
    if (w.art !== 'luecke') return;
    const s = soll?.art === 'text' ? soll.text : '';
    const e = eintraege[w.index] ?? '';
    befunde[w.index] = { soll: s, status: !e.trim() ? 'leer' : baumWertGleich(e, s) ? 'gleich' : 'abweichend' };
  };
  const felder = (v: BaumFeld[], l: BaumFeld[] | undefined) => v.forEach((f, i) => setze(f.wert, l?.[i]?.wert));
  if (vorlage.baeume.length !== loesung.baeume.length) return undefined;
  felder(vorlage.wurzel, loesung.wurzel);
  const frei = new Set(loesung.baeume.map((_, i) => i));
  vorlage.baeume.forEach((b, bi) => {
    const name = text(b.merkmal, eintraege);
    const passend = [...frei].find((i) => name && baumWertGleich(name, text(loesung.baeume[i].merkmal, [])));
    const li = passend ?? (frei.has(bi) ? bi : [...frei][0]);
    frei.delete(li);
    const l = loesung.baeume[li];
    setze(b.merkmal, l?.merkmal);
    const zfrei = new Set(l?.zweige.map((_, i) => i) ?? []);
    b.zweige.forEach((z, zi) => {
      const zname = text(z.name, eintraege);
      const zp = [...zfrei].find((i) => zname && baumWertGleich(zname, text(l.zweige[i].name, [])));
      const zli = zp ?? (zfrei.has(zi) ? zi : [...zfrei][0]);
      zfrei.delete(zli);
      const lz = l?.zweige[zli];
      setze(z.name, lz?.name);
      felder(z.felder, lz?.felder);
    });
  });
  return befunde;
}

/** Der Baum als Text (für die Übersicht beim Bewerten und als Rückfall). */
export function baumAlsText(baum: Entscheidungsbaum, eintraege: string[]): string {
  const w = (x: BaumWert) => text(x, eintraege).trim() || '…';
  const f = (x: BaumFeld) => (x.name ? `${x.name} = ${w(x.wert)}` : w(x.wert));
  const zeilen = [baum.wurzel.map(f).join(' | ')];
  for (const b of baum.baeume) {
    zeilen.push(w(b.merkmal));
    for (const z of b.zweige) zeilen.push(`  ${[w(z.name), ...z.felder.map(f)].join(' | ')}`);
  }
  return zeilen.join('\n');
}
