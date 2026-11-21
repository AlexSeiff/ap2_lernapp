// Datendiagramme in Lernblättern, Aufgaben und Lösungen: ```diagramm-Codeblöcke mit einfacher Datenangabe statt SVG-Markup.
// Die App zeichnet daraus ein Linien-, Säulen-, gestapeltes Säulen- oder Pareto-Diagramm (src/components/DatenDiagramm.tsx).
// Die Werte stehen als Text im Block und werden unverändert angezeigt (Beschriftung und Wertetabelle) – Rechenaufgaben bauen darauf auf.
//
//   ```diagramm
//   typ: linie
//   titel: Mittlere Holzfeuchte im Lager
//   x: Monat
//   y: Holzfeuchte in %
//   kategorien: 1; 2; 3; 4; 5; 6
//   reihe: Holzfeuchte | 28; 22; 22; 21; 16; 11
//   ```
//
// Zahlen deutsch (Dezimalkomma, Tausenderpunkt), Listen mit „;“ getrennt.

export const DIAGRAMM_TYPEN = ['linie', 'saeulen', 'gestapelt', 'pareto'] as const;
export type DiagrammTyp = (typeof DIAGRAMM_TYPEN)[number];

export interface DiagrammWert {
  /** Wie im Block geschrieben, z. B. „4,80“ – so wird er beschriftet. */
  text: string;
  wert: number;
}

export interface DiagrammReihe {
  name: string;
  werte: DiagrammWert[];
}

export interface DiagrammPunkt {
  x: DiagrammWert | string;
  y: DiagrammWert;
  text: string;
}

export interface DatenDiagramm {
  typ: DiagrammTyp;
  titel: string;
  x: string;
  y: string;
  kategorien: string[];
  reihen: DiagrammReihe[];
  yMin?: number;
  yMax?: number;
  schritt?: number;
  /** Werte an Punkten/Säulen beschriften (Standard: ja). */
  werte: boolean;
  punkte: DiagrammPunkt[];
  /** Zahlen der Kategorien, wenn alle Kategorien Zahlen sind (Liniendiagramm mit maßstäblicher x-Achse). */
  xZahlen?: number[];
}

const ZAHL = /^[−-]?\d{1,3}(?:\.\d{3})*(?:,\d+)?$|^[−-]?\d+(?:,\d+)?$/;

/** Deutsche Zahl („1.000.000“, „4,80“, „−5“) → number; undefined, wenn es keine Zahl ist. */
export function deZahl(text: string): number | undefined {
  const t = text.trim().replace(/\s*%$/, '');
  if (!ZAHL.test(t)) return undefined;
  return Number(t.replace(/\./g, '').replace(',', '.').replace('−', '-'));
}

function wert(text: string): DiagrammWert | undefined {
  const w = deZahl(text);
  return w === undefined ? undefined : { text: text.trim(), wert: w };
}

const liste = (s: string) => s.split(';').map((x) => x.trim());

export type DiagrammErgebnis = { diagramm: DatenDiagramm; fehler?: undefined } | { diagramm?: undefined; fehler: string };

/** Liest einen ```diagramm-Block; bei einem Fehler die Meldung (der Block wird dann als Code gezeigt und beim Import gemeldet). */
export function leseDiagramm(block: string): DiagrammErgebnis {
  const felder = new Map<string, string>();
  const reihen: DiagrammReihe[] = [];
  const punkte: DiagrammPunkt[] = [];
  for (const [i, zeile] of block.split(/\r?\n/).entries()) {
    if (!zeile.trim() || zeile.trim().startsWith('#')) continue;
    const m = zeile.match(/^\s*([a-z-]+)\s*:\s*(.*)$/);
    if (!m) return { fehler: `Zeile ${i + 1}: „Schlüssel: Wert“ erwartet.` };
    const [, key, rest] = m;
    if (key === 'reihe') {
      const [name, daten] = rest.split('|');
      if (daten === undefined) return { fehler: `Zeile ${i + 1}: „reihe: Name | Wert; Wert; …“ erwartet.` };
      const werte: DiagrammWert[] = [];
      for (const t of liste(daten)) {
        const w = wert(t);
        if (!w) return { fehler: `Zeile ${i + 1}: „${t}“ ist keine Zahl.` };
        werte.push(w);
      }
      reihen.push({ name: name.trim(), werte });
    } else if (key === 'punkt') {
      const teile = rest.split('|').map((x) => x.trim());
      const y = wert(teile[1] ?? '');
      if (teile.length !== 3 || !y) return { fehler: `Zeile ${i + 1}: „punkt: x | y | Beschriftung“ erwartet.` };
      punkte.push({ x: wert(teile[0]) ?? teile[0], y, text: teile[2] });
    } else if (['typ', 'titel', 'x', 'y', 'kategorien', 'y-min', 'y-max', 'schritt', 'werte'].includes(key)) {
      if (felder.has(key)) return { fehler: `„${key}“ steht doppelt im Block.` };
      felder.set(key, rest.trim());
    } else return { fehler: `Unbekannter Schlüssel „${key}“.` };
  }

  const typ = felder.get('typ') as DiagrammTyp;
  if (!DIAGRAMM_TYPEN.includes(typ)) return { fehler: `„typ“ muss ${DIAGRAMM_TYPEN.join(', ')} sein.` };
  const titel = felder.get('titel');
  if (!titel) return { fehler: '„titel“ fehlt.' };
  const kategorien = liste(felder.get('kategorien') ?? '').filter(Boolean);
  if (kategorien.length < 2) return { fehler: '„kategorien“ braucht mindestens zwei Einträge.' };
  if (!reihen.length) return { fehler: 'Mindestens eine „reihe“ fehlt.' };
  for (const r of reihen)
    if (r.werte.length !== kategorien.length)
      return { fehler: `Reihe „${r.name}“ hat ${r.werte.length} Werte, es gibt aber ${kategorien.length} Kategorien.` };
  if (typ === 'pareto' && reihen.length !== 1) return { fehler: 'Ein Pareto-Diagramm hat genau eine Reihe.' };
  if ((typ === 'gestapelt' || typ === 'pareto') && reihen.some((r) => r.werte.some((w) => w.wert < 0)))
    return { fehler: 'Gestapelte Säulen und Pareto-Diagramme brauchen Werte ≥ 0.' };

  const zahl = (key: string) => {
    const t = felder.get(key);
    if (t === undefined) return { ok: true as const, wert: undefined };
    const w = deZahl(t);
    return w === undefined ? { ok: false as const, key } : { ok: true as const, wert: w };
  };
  const yMin = zahl('y-min');
  const yMax = zahl('y-max');
  const schritt = zahl('schritt');
  for (const z of [yMin, yMax, schritt]) if (!z.ok) return { fehler: `„${z.key}“ ist keine Zahl.` };
  if (schritt.wert !== undefined && schritt.wert <= 0) return { fehler: '„schritt“ muss größer als 0 sein.' };
  const werteFeld = felder.get('werte') ?? 'ja';
  if (werteFeld !== 'ja' && werteFeld !== 'nein') return { fehler: '„werte“ muss ja oder nein sein.' };

  const xZahlenRoh = kategorien.map(deZahl);
  const xZahlen =
    typ === 'linie' &&
    xZahlenRoh.every((z): z is number => z !== undefined) &&
    xZahlenRoh.every((z, i) => i === 0 || z > xZahlenRoh[i - 1]!)
      ? xZahlenRoh
      : undefined;

  for (const p of punkte) {
    if (typeof p.x === 'string' ? !kategorien.includes(p.x) : !xZahlen && !kategorien.includes(p.x.text))
      return { fehler: `Punkt „${p.text}“: x muss eine Kategorie sein${typ === 'linie' ? ' oder bei Zahlenkategorien eine Zahl' : ''}.` };
  }

  const diagramm: DatenDiagramm = {
    typ,
    titel,
    x: felder.get('x') ?? '',
    y: felder.get('y') ?? '',
    kategorien,
    reihen,
    yMin: yMin.wert,
    yMax: yMax.wert,
    schritt: schritt.wert,
    werte: werteFeld === 'ja',
    punkte,
    xZahlen,
  };
  const [lo, hi] = wertebereich(diagramm);
  if (diagramm.yMin !== undefined && diagramm.yMax !== undefined && diagramm.yMin >= diagramm.yMax)
    return { fehler: '„y-min“ muss kleiner als „y-max“ sein.' };
  if (diagramm.yMin !== undefined && diagramm.yMin > lo) return { fehler: `„y-min“ (${diagramm.yMin}) liegt über dem kleinsten Wert.` };
  if (diagramm.yMax !== undefined && diagramm.yMax < hi) return { fehler: `„y-max“ (${diagramm.yMax}) liegt unter dem größten Wert.` };
  return { diagramm };
}

/** Kleinster und größter Wert, die die y-Achse zeigen muss (gestapelt: Summen je Kategorie, Pareto: Gesamtsumme). */
export function wertebereich(d: DatenDiagramm): [number, number] {
  const summen = d.kategorien.map((_, i) => d.reihen.reduce((s, r) => s + r.werte[i].wert, 0));
  const ys =
    d.typ === 'gestapelt'
      ? summen
      : d.typ === 'pareto'
        ? [...d.reihen[0].werte.map((w) => w.wert), summen.reduce((a, b) => a + b, 0)]
        : d.reihen.flatMap((r) => r.werte.map((w) => w.wert));
  ys.push(...d.punkte.map((p) => p.y.wert));
  return [Math.min(...ys), Math.max(...ys)];
}

/** Kumulierte Anteile in % je Kategorie (Pareto-Linie). */
export function kumuliertProzent(werte: number[]): number[] {
  const summe = werte.reduce((a, b) => a + b, 0);
  let lauf = 0;
  return werte.map((w) => {
    lauf += w;
    return summe ? (lauf / summe) * 100 : 0;
  });
}

/** Alle ```diagramm-Blöcke eines Markdown-Texts (Inhalt ohne Zaun). */
export function diagrammBloecke(markdown: string): string[] {
  return [...markdown.matchAll(/^[ \t]*```diagramm[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```[ \t]*$/gm)].map((m) => m[1]);
}
