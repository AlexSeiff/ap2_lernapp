// Koordinatensystem als Antwort („Zeichnen Sie die Daten in ein Koordinatensystem … Kreis, Kreuz … zeichnen Sie die Gerade y = 7,5 ein“):
// Statt einer Skizze auf Papier setzt du Punkte (Kreis, Kreuz, Kästchen) ins Koordinatensystem und trägst Geraden als Gleichung ein, die
// App zeichnet sie maßstäblich. Achsenbereiche kommen aus dem Aufgabentext („x-Achse 0 bis 10“) oder aus der Datentabelle der Aufgabe.
// Nach der Abgabe vergleicht der Abgleich deine Punkte mit der Tabelle der Aufgabe und die Geraden mit den genannten Gleichungen – eine
// Hilfe zur Selbstbewertung, die Punkte vergibst du selbst. Rein, ohne React.

import type { Task, Topic } from '../../shared/types';
import { markdownTabellen } from './tabellenEditor';
import { zahlAus } from './werteTabelle';

export const FORMEN = ['kreis', 'kreuz', 'kasten'] as const;
export type PunktForm = (typeof FORMEN)[number];

export const FORM_NAMEN: Record<PunktForm, string> = { kreis: 'Kreis ●', kreuz: 'Kreuz ✕', kasten: 'Kästchen □' };

export interface KoordPunkt {
  x: number;
  y: number;
  form: PunktForm;
}

export interface KoordinatenAntwort {
  editor: 'koordinaten';
  punkte: KoordPunkt[];
  /** Geraden als Gleichung, wie getippt („y = 1,5 · x − 1“). */
  geraden: string[];
  notiz?: string;
}

export const leereKoordinatenAntwort = (): KoordinatenAntwort => ({ editor: 'koordinaten', punkte: [], geraden: [] });

/** Leer = nichts gezeichnet, keine Geradenzeile und keine Anmerkung. Eine angelegte, noch leere Geradenzeile zählt mit – sonst verschwände sie sofort. */
export const istKoordinatenLeer = (a: KoordinatenAntwort) => !a.punkte.length && !a.geraden.length && !a.notiz?.trim();

/**
 * Die Aufgabe und ihr Umfeld: Die Datentabelle steht meist nicht im Text der Teilaufgabe, sondern im Einleitungstext des Blocks oder
 * in der Ausgangssituation (`kontext`).
 */
export type AufgabeMitKontext = Pick<Task, 'markdown'> & { kontext?: string };

/** Einleitung des Blocks und Anlagen der Übungsklausur, in der die Aufgabe steht (leer, wenn es sie nicht gibt). */
export function kontextAus(topics: readonly Pick<Topic, 'id' | 'exam'>[], task: Pick<Task, 'id' | 'topicId'>): string {
  const exam = topics.find((t) => t.id === task.topicId)?.exam;
  if (!exam) return '';
  const block = exam.blocks.find((b) => b.taskIds.includes(task.id));
  return [block?.intro ?? '', ...exam.attachments.map((a) => a.markdown)].filter(Boolean).join('\n\n');
}

// ---------- Achsen ----------

export interface Achsen {
  xVon: number;
  xBis: number;
  yVon: number;
  yBis: number;
}

const STANDARD_ACHSEN: Achsen = { xVon: 0, xBis: 10, yVon: 0, yBis: 10 };

const ZAHL = String.raw`(−?-?\d+(?:[.,]\d+)?)`;

/** „x-Achse 0 bis 10, y-Achse 0 bis 13“ aus dem Aufgabentext; undefined, wenn nicht beide Achsen genannt sind. */
export function achsenAusText(markdown: string): Achsen | undefined {
  const bereich = (achse: string) => {
    const m = markdown.match(new RegExp(String.raw`${achse}-?\s*Achse\s*(?:von\s*)?${ZAHL}\s*(?:bis|–|-)\s*${ZAHL}`, 'i'));
    const von = m ? zahlAus(m[1]) : undefined;
    const bis = m ? zahlAus(m[2]) : undefined;
    return von !== undefined && bis !== undefined && bis > von ? { von, bis } : undefined;
  };
  const x = bereich('x');
  const y = bereich('y');
  return x && y ? { xVon: x.von, xBis: x.bis, yVon: y.von, yBis: y.bis } : undefined;
}

// ---------- Datenpunkte der Aufgabe ----------

export interface DatenPunkt {
  /** Beschriftung der Zeile („Training 3“). */
  label: string;
  x: number;
  y: number;
  /** Klasse, falls die Tabelle eine kurze Textspalte hat („G“, „P“). */
  klasse?: string;
}

const ohneMarkup = (s: string) => s.replace(/\*\*|__|`/g, '').trim();

/** Punkte der ersten Tabelle in der Aufgabe, die mindestens zwei Zahlenspalten hat (x = erste, y = zweite Zahlenspalte). */
export function datenpunkte(task: AufgabeMitKontext): DatenPunkt[] {
  for (const t of markdownTabellen(`${task.markdown}\n\n${task.kontext ?? ''}`)) {
    const zeilen = t.zeilen.map((r) => t.kopf.map((_, i) => ohneMarkup(r[i] ?? '')));
    if (!zeilen.length) continue;
    const zahlenSpalten = t.kopf.map((_, i) => i).filter((i) => zeilen.every((z) => zahlAus(z[i]) !== undefined));
    if (zahlenSpalten.length < 2) continue;
    const [sx, sy] = zahlenSpalten;
    const textSpalten = t.kopf.map((_, i) => i).filter((i) => !zahlenSpalten.includes(i));
    const labelSpalte = textSpalten.find((i) => i < sx);
    const klassenSpalte = textSpalten.find((i) => i > sy && zeilen.every((z) => z[i].length <= 3));
    return zeilen.map((z, i) => ({
      label: (labelSpalte !== undefined ? z[labelSpalte] : '') || `Punkt ${i + 1}`,
      x: zahlAus(z[sx])!,
      y: zahlAus(z[sy])!,
      ...(klassenSpalte !== undefined && z[klassenSpalte] ? { klasse: z[klassenSpalte] } : {}),
    }));
  }
  return [];
}

/** Achsen: aus dem Text; sonst von 0 bis zum größten Wert der Datentabelle + 1; sonst 0 bis 10. */
export function achsenFuer(task: AufgabeMitKontext): Achsen {
  const ausText = achsenAusText(task.markdown);
  if (ausText) return ausText;
  const d = datenpunkte(task);
  if (!d.length) return STANDARD_ACHSEN;
  const xs = d.map((p) => p.x);
  const ys = d.map((p) => p.y);
  return {
    xVon: Math.min(0, Math.floor(Math.min(...xs))),
    xBis: Math.ceil(Math.max(...xs)) + 1,
    yVon: Math.min(0, Math.floor(Math.min(...ys))),
    yBis: Math.ceil(Math.max(...ys)) + 1,
  };
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Welche Punkte der Tabelle sind gemeint? Hat die Tabelle Gruppen („Training 1 …“, „Test 1 …“), zählen die im Text genannten
 * („die Trainingsdaten“) – ausgenommen, was ausdrücklich ausgeschlossen ist („nicht die Testdaten“). Sonst alle.
 */
export function gesuchtePunkte(task: AufgabeMitKontext): DatenPunkt[] {
  const alle = datenpunkte(task);
  const gruppe = (p: DatenPunkt) => p.label.split(/\s+/)[0];
  const gruppen = [...new Set(alle.map(gruppe))];
  if (gruppen.length < 2) return alle;
  const gemeint = gruppen.filter((g) => {
    if (new RegExp(String.raw`(?<!\p{L})nicht\s+(?:die|den|das)?\s*${esc(g)}\p{L}*`, 'iu').test(task.markdown)) return false;
    return new RegExp(String.raw`(?<!\p{L})${esc(g)}\p{L}*`, 'iu').test(task.markdown);
  });
  return gemeint.length ? alle.filter((p) => gemeint.includes(gruppe(p))) : alle;
}

// ---------- Geraden ----------

export type Gerade = { art: 'y'; m: number; b: number } | { art: 'x'; x: number };

/**
 * Gleichung lesen: „y = 7,5“, „y = 1,5 · x − 1“, „y=-x+2“, „y = 3 + 0,5x“, „x = 4“ (senkrecht). Dezimalkomma, Malpunkt und
 * Minuszeichen (−) sind erlaubt; alles andere ergibt undefined.
 */
export function leseGerade(roh: string): Gerade | undefined {
  const t = roh
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/[·*⋅×]/g, '*')
    .replace(/,/g, '.')
    .replace(/\s+/g, '');
  const zahl = String.raw`\d+(?:\.\d+)?|\.\d+`;
  const senkrecht = t.match(new RegExp(String.raw`^x=([+-]?(?:${zahl}))$`));
  if (senkrecht) return { art: 'x', x: Number(senkrecht[1]) };
  const rechts = t.replace(/^(?:y|f\(x\))=/, '');
  if (rechts === t) return undefined;
  const konstante = rechts.match(new RegExp(String.raw`^([+-]?(?:${zahl}))$`));
  if (konstante) return { art: 'y', m: 0, b: Number(konstante[1]) };
  const koeff = (s: string) => (s === '' || s === '+' ? 1 : s === '-' ? -1 : Number(s));
  const mx = rechts.match(new RegExp(String.raw`^([+-]?(?:${zahl})?)\*?x([+-](?:${zahl}))?$`));
  if (mx) return { art: 'y', m: koeff(mx[1]), b: mx[2] ? Number(mx[2]) : 0 };
  const bm = rechts.match(new RegExp(String.raw`^([+-]?(?:${zahl}))([+-](?:${zahl})?)\*?x$`));
  if (bm) return { art: 'y', m: koeff(bm[2]), b: Number(bm[1]) };
  return undefined;
}

export const gleicheGerade = (a: Gerade, b: Gerade): boolean =>
  a.art === 'x' && b.art === 'x'
    ? Math.abs(a.x - b.x) < 0.01
    : a.art === 'y' && b.art === 'y' && Math.abs(a.m - b.m) < 0.01 && Math.abs(a.b - b.b) < 0.01;

/** Die Gleichungen „y = …“ bzw. „x = …“, die im Aufgabentext genannt werden (lesbare, ohne Doppelte). */
export function geradenAusText(markdown: string): { text: string; gerade: Gerade }[] {
  const treffer = markdown.matchAll(/(?<![\p{L}\d])([yx])\s*=\s*([^\n.;]*?)(?=\s+und\s|\s*[;)]|\.(?:\s|$)|$)/gu);
  const aus: { text: string; gerade: Gerade }[] = [];
  for (const m of treffer) {
    const text = `${m[1]} = ${m[2].trim()}`;
    const gerade = leseGerade(text);
    if (gerade && !aus.some((a) => gleicheGerade(a.gerade, gerade))) aus.push({ text, gerade });
  }
  return aus;
}

/** Die lesbaren Geraden einer Antwort mit ihrer Nummer in der Eingabe. */
export const lesbareGeraden = (a: Pick<KoordinatenAntwort, 'geraden'>): { nr: number; text: string; gerade: Gerade }[] =>
  a.geraden.flatMap((text, i) => {
    const gerade = leseGerade(text);
    return gerade ? [{ nr: i + 1, text, gerade }] : [];
  });

/** Gerade als Zeichen-Endpunkte innerhalb der Achsen; undefined, wenn sie den Bereich nicht trifft. */
export function geradeImBereich(g: Gerade, a: Achsen): [[number, number], [number, number]] | undefined {
  if (g.art === 'x')
    return g.x >= a.xVon && g.x <= a.xBis
      ? [
          [g.x, a.yVon],
          [g.x, a.yBis],
        ]
      : undefined;
  return [
    [a.xVon, g.m * a.xVon + g.b],
    [a.xBis, g.m * a.xBis + g.b],
  ];
}

// ---------- Formprüfung ----------

/** Formfehler (ohne Blick auf die Lösung): unlesbare Gleichungen, Punkte außerhalb der Achsen. */
export function pruefeKoordinaten(a: KoordinatenAntwort, achsen: Achsen): string[] {
  const m: string[] = [];
  a.geraden.forEach((g, i) => {
    if (g.trim() && !leseGerade(g))
      m.push(`Gerade ${i + 1}: „${g.trim()}“ ist nicht lesbar – schreib sie wie „y = 1,5 · x − 1“ oder „y = 7,5“ (senkrecht: „x = 4“).`);
  });
  const draussen = a.punkte.filter((p) => p.x < achsen.xVon || p.x > achsen.xBis || p.y < achsen.yVon || p.y > achsen.yBis);
  if (draussen.length)
    m.push(
      `${draussen.length} Punkt${draussen.length === 1 ? '' : 'e'} liegt außerhalb der Achsen (x ${achsen.xVon}–${achsen.xBis}, y ${achsen.yVon}–${achsen.yBis}).`,
    );
  return m;
}

// ---------- Abgleich nach der Abgabe ----------

export interface KoordinatenAbgleich {
  erwartet: DatenPunkt[];
  /** Punkte der Aufgabe, zu denen ein eigener Punkt gesetzt ist (Toleranz 0,05). */
  getroffen: DatenPunkt[];
  fehlend: DatenPunkt[];
  /** Eigene Punkte, die zu keinem Punkt der Aufgabe passen. */
  zusaetzlich: KoordPunkt[];
  /** Hat jede Klasse (z. B. G, P) ihr eigenes Symbol und nur dieses? undefined, wenn die Tabelle keine Klassen hat. */
  symboleStimmig?: boolean;
  geraden: { text: string; gezeichnet: boolean }[];
}

const NAH = 0.05;

/** Eigene Punkte neben die Datentabelle und die genannten Geraden der Aufgabe legen; undefined ohne Datenpunkte und Geraden. */
export function gleicheKoordinatenAb(task: AufgabeMitKontext, a: KoordinatenAntwort): KoordinatenAbgleich | undefined {
  const erwartet = gesuchtePunkte(task);
  const genannt = geradenAusText(task.markdown);
  if (!erwartet.length && !genannt.length) return undefined;
  const frei = a.punkte.map((p, i) => ({ p, i }));
  const getroffen: DatenPunkt[] = [];
  const fehlend: DatenPunkt[] = [];
  const formen = new Map<string, Set<PunktForm>>();
  for (const e of erwartet) {
    const k = frei.findIndex(({ p }) => Math.abs(p.x - e.x) <= NAH && Math.abs(p.y - e.y) <= NAH);
    if (k < 0) {
      fehlend.push(e);
      continue;
    }
    const [{ p }] = frei.splice(k, 1);
    getroffen.push(e);
    if (e.klasse) formen.set(e.klasse, (formen.get(e.klasse) ?? new Set()).add(p.form));
  }
  // „Umrahmen mit einem Kästchen“ o. Ä.: weitere Symbole auf einem Datenpunkt sind keine zusätzlichen Punkte.
  const zusaetzlich = frei.map(({ p }) => p).filter((p) => !erwartet.some((e) => Math.abs(p.x - e.x) <= NAH && Math.abs(p.y - e.y) <= NAH));
  const alleFormen = [...formen.values()];
  const stimmig =
    formen.size > 1
      ? alleFormen.every((s) => s.size === 1) && new Set(alleFormen.map((s) => [...s][0])).size === alleFormen.length
      : undefined;
  const eigene = lesbareGeraden(a);
  return {
    erwartet,
    getroffen,
    fehlend,
    zusaetzlich,
    ...(stimmig !== undefined ? { symboleStimmig: stimmig } : {}),
    geraden: genannt.map((g) => ({ text: g.text, gezeichnet: eigene.some((e) => gleicheGerade(e.gerade, g.gerade)) })),
  };
}

// ---------- Text ----------

const zahl = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

export function koordinatenAlsText(a: KoordinatenAntwort): string {
  const teile: string[] = [];
  for (const f of FORMEN) {
    const ps = a.punkte.filter((p) => p.form === f);
    if (ps.length) teile.push(`${FORM_NAMEN[f]}: ${ps.map((p) => `(${zahl(p.x)} | ${zahl(p.y)})`).join(', ')}`);
  }
  const g = a.geraden.filter((x) => x.trim());
  if (g.length) teile.push(`Geraden: ${g.join('; ')}`);
  const text = `Koordinatensystem – ${teile.join(' · ') || 'leer'}`;
  return a.notiz?.trim() ? `${text}\n\n${a.notiz.trim()}` : text;
}
