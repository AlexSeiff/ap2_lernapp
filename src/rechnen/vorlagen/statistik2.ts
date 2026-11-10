// Statistik II (Deep Dive 4): Korrelation nach Pearson, lineare Regression (a, b, Prognosen, Residuen),
// gleitender Durchschnitt, prozentuale Veränderung (auch Inflationsrate und Prozent vs. Prozentpunkte).

import { z } from 'zod';
import { fz, fzListe, intParam, L, LoesungsBau, lz, lzk, lzSumme, mittel, runde, summe, textParam, vorlage } from '../hilfen.ts';
import { F } from '../formeln.ts';
import type { Params, Tabelle } from '../typen.ts';
import type { Zufall } from '../zufall.ts';

const zahl = z.number().finite();

const xySchema = z
  .object({
    x: z.array(zahl).min(3).max(20),
    y: z.array(zahl).min(3).max(20),
    xName: z.string().trim().min(1).optional(),
    yName: z.string().trim().min(1).optional(),
    einheitY: z.string().trim().min(1).optional(),
  })
  .refine((d) => d.x.length === d.y.length, { message: 'x und y brauchen gleich viele Werte' })
  .refine((d) => new Set(d.x).size > 1, { message: 'x braucht mindestens zwei verschiedene Werte' });
type XY = z.infer<typeof xySchema>;

const regressionSchema = z
  .object({
    x: z.array(zahl).min(3).max(20),
    y: z.array(zahl).min(3).max(20),
    prognose: z.array(zahl).max(5).optional(),
    xName: z.string().trim().min(1).optional(),
    yName: z.string().trim().min(1).optional(),
    einheitY: z.string().trim().min(1).optional(),
  })
  .refine((d) => d.x.length === d.y.length, { message: 'x und y brauchen gleich viele Werte' })
  .refine((d) => new Set(d.x).size > 1, { message: 'x braucht mindestens zwei verschiedene Werte' });

/**
 * Zufällige Punktwolke mit linearem Trend: y = a + b · x + Rauschen (ganzzahlig oder in halben Schritten).
 * Mit Vorbild bleiben die x-Werte, Steigung, Niveau und Streuung ähneln denen des Vorbilds. Params: n.
 */
function erzeugeXY(z: Zufall, params: Params, vorbild?: XY): { x: number[]; y: number[] } {
  const n = vorbild ? vorbild.x.length : intParam(params, 'n', z.ganz(5, 7), 3, 20);
  const ref = vorbild ? kennzahlen(vorbild.x, vorbild.y) : undefined;
  const refB = ref ? ref.sxy / ref.sxx : undefined;
  const halb = vorbild ? !vorbild.y.every(Number.isInteger) : z.ja(0.4);
  for (let versuch = 0; ; versuch++) {
    const start = z.ganz(1, 4);
    const schritt = z.ganz(1, 3);
    const x = vorbild ? [...vorbild.x] : Array.from({ length: n }, (_, i) => start + i * schritt);
    const abstand = (Math.max(...x) - Math.min(...x)) / (n - 1);
    const steigung =
      refB !== undefined && ref ? runde(refB * (0.6 + z.zahl() * 0.8) || 0.5, 1) : z.wahl([-1.5, -1, -0.5, 0.5, 1, 1.5, 2, 3, 4, 5, 6]);
    const achse = ref && refB !== undefined ? Math.round(ref.ym - refB * ref.xm) + z.ganz(-5, 5) : z.ganz(5, 40);
    const streuRef = ref && refB !== undefined ? Math.sqrt(Math.max(0, ref.syy - refB * ref.sxy) / n) * 1.5 : 0;
    const streuung = Math.max(streuRef, Math.abs(steigung) * abstand * 1.2, 0.5);
    const y = x.map((xi) => {
      const roh = achse + steigung * xi + (z.zahl() - 0.5) * 2 * streuung;
      return halb ? Math.round(roh * 2) / 2 : Math.round(roh);
    });
    if (new Set(y).size > 1 || versuch > 50) return { x, y };
  }
}

function kennzahlen(x: number[], y: number[]) {
  const xm = mittel(x);
  const ym = mittel(y);
  const dx = x.map((v) => v - xm);
  const dy = y.map((v) => v - ym);
  const sxy = summe(dx.map((v, i) => v * dy[i]));
  const sxx = summe(dx.map((v) => v * v));
  const syy = summe(dy.map((v) => v * v));
  return { xm, ym, dx, dy, sxy, sxx, syy };
}

function xyTabelle(d: { x: number[]; y: number[]; xName?: string; yName?: string }): Tabelle {
  return {
    kopf: ['', ...d.x.map((_, i) => String(i + 1))],
    zeilen: [
      [d.xName ?? 'x', ...d.x.map((v) => fz(v))],
      [d.yName ?? 'y', ...d.y.map((v) => fz(v))],
    ],
  };
}

const xyPlatzhalter = (d: { x: number[]; y: number[] }) => ({ x: fzListe(d.x), y: fzListe(d.y), n: String(d.x.length) });

export const korrelation = vorlage<XY>({
  id: 'korrelation',
  titel: 'Korrelationskoeffizient nach Pearson',
  bereich: 'Statistik II',
  beschreibung: 'Mittelwerte, Sxy, Sxx, Syy, r und R² aus einer Wertetabelle.',
  schema: xySchema,
  hinweise: [
    'Mittelwerte x̄ und ȳ, dann je Zeile die Abweichungen x − x̄ und y − ȳ.',
    'Sxy = Σ(x − x̄)(y − ȳ), Sxx = Σ(x − x̄)², Syy = Σ(y − ȳ)².',
    'r = Sxy / √(Sxx · Syy). Das Vorzeichen von r kommt aus Sxy.',
  ],
  erzeuge: (z, params, vorbild) => {
    const { x, y } = erzeugeXY(z, params, vorbild);
    return { x, y, ...(vorbild?.xName ? { xName: vorbild.xName } : {}), ...(vorbild?.yName ? { yName: vorbild.yName } : {}) };
  },
  platzhalter: xyPlatzhalter,
  tabelle: xyTabelle,
  loese(d) {
    const b = new LoesungsBau();
    const k = kennzahlen(d.x, d.y);
    b.wert('xMittel', k.xm, { label: 'x̄', runden: 2 });
    b.wert('yMittel', k.ym, { label: 'ȳ', runden: 2 });
    b.wert('sxy', k.sxy, { label: 'Sxy = Σ(x − x̄)(y − ȳ)', runden: 2 });
    b.wert('sxx', k.sxx, { label: 'Sxx = Σ(x − x̄)²', runden: 2 });
    b.wert('syy', k.syy, { label: 'Syy = Σ(y − ȳ)²', runden: 2 });
    const r = b.wert('r', k.syy > 0 ? k.sxy / Math.sqrt(k.sxx * k.syy) : 0, { label: 'Korrelationskoeffizient r', runden: 2 });
    const r2 = b.wert('r2', r * r, { label: 'Bestimmtheitsmaß R²', runden: 2, zusatz: true });
    schritteKorrelation(b, d.x, d.y, k, r, r2);
    return b.fertig();
  },
});

function schritteKorrelation(b: LoesungsBau, x: number[], y: number[], k: ReturnType<typeof kennzahlen>, r: number, r2: number) {
  b.schritt({
    titel: 'Mittelwert x̄',
    formel: L`\bar{x} = \frac{\sum x_i}{n}`,
    einsetzen: L`\bar{x} = \frac{${lzSumme(x)}}{${x.length}}`,
    ergebnis: k.xm,
    runden: 2,
  });
  b.schritt({
    titel: 'Mittelwert ȳ',
    formel: L`\bar{y} = \frac{\sum y_i}{n}`,
    einsetzen: L`\bar{y} = \frac{${lzSumme(y)}}{${y.length}}`,
    ergebnis: k.ym,
    runden: 2,
  });
  b.schritt({
    titel: 'Sxy',
    formel: F.sxy.latex,
    einsetzen: `S_{xy} = ${k.dx.map((v, i) => L`${lzk(v, 2)} \cdot ${lzk(k.dy[i], 2)}`).join(' + ')}`,
    ergebnis: k.sxy,
    runden: 2,
    hinweis: 'Kontrolle: Σ(x − x̄) = 0 und Σ(y − ȳ) = 0.',
  });
  b.schritt({
    titel: 'Sxx',
    formel: F.sxx.latex,
    einsetzen: `S_{xx} = ${k.dx.map((v) => L`${lzk(v, 2)}^2`).join(' + ')}`,
    ergebnis: k.sxx,
    runden: 2,
  });
  b.schritt({
    titel: 'Syy',
    formel: F.syy.latex,
    einsetzen: `S_{yy} = ${k.dy.map((v) => L`${lzk(v, 2)}^2`).join(' + ')}`,
    ergebnis: k.syy,
    runden: 2,
  });
  b.schritt({
    titel: 'Korrelationskoeffizient',
    formel: F.pearson.latex,
    einsetzen: L`r = \frac{${lz(k.sxy, 2)}}{\sqrt{${lz(k.sxx, 2)} \cdot ${lz(k.syy, 2)}}} = \frac{${lz(k.sxy, 2)}}{${lz(Math.sqrt(k.sxx * k.syy), 2)}}`,
    ergebnis: r,
    runden: 2,
    hinweis: `${r < 0 ? 'Negativ: gegenläufiger' : 'Positiv: gleichläufiger'} Zusammenhang, ${Math.abs(r) >= 0.8 ? 'stark' : Math.abs(r) >= 0.5 ? 'mittel' : Math.abs(r) >= 0.2 ? 'schwach' : 'kein bis sehr schwach'} (Faustregel des Lernblatts).`,
  });
  b.schritt({ titel: 'Bestimmtheitsmaß', formel: F.bestimmtheitsmass.latex, einsetzen: L`R^2 = ${lzk(r, 4)}^2`, ergebnis: r2, runden: 2 });

  b.fehler('r', -r, 'Vorzeichenfehler – das Vorzeichen von r ist das von Sxy.');
  b.fehler('r', k.sxy / (k.sxx * k.syy), 'Du hast die Wurzel im Nenner vergessen: r = Sxy / √(Sxx · Syy).');
  b.fehler('r', r * r, 'Das ist R² – r ist die Wurzel daraus (mit dem Vorzeichen von Sxy).');
  b.fehler('r2', r, 'Das ist r – das Bestimmtheitsmaß ist r².');
  b.fehler('sxy', summe(x.map((v, i) => v * y[i])), 'Du hast Σ x · y ohne Abzug der Mittelwerte gerechnet – Sxy = Σ(x − x̄)(y − ȳ).');
  b.fehler('sxx', summe(x.map((v) => v * v)), 'Du hast Σ x² ohne Abzug des Mittelwerts gerechnet – Sxx = Σ(x − x̄)².');
}

export const regression = vorlage<z.infer<typeof regressionSchema>>({
  id: 'regression',
  titel: 'Lineare Regression',
  bereich: 'Statistik II',
  beschreibung: 'Steigung b, Achsenabschnitt a, Prognosen ŷ, Residuen e = y − ŷ, dazu r und R².',
  schema: regressionSchema,
  hinweise: ['b = Sxy / Sxx, danach a = ȳ − b · x̄.', 'Probe: x̄ eingesetzt ergibt ȳ.', 'Residuum e = y − ŷ (tatsächlich minus geschätzt).'],
  erzeuge: (z, params, vorbild) => {
    const { x, y } = erzeugeXY(z, params, vorbild);
    const letztes = x[x.length - 1];
    const prognose = vorbild?.prognose?.map((p, i) => (p <= letztes ? p : letztes + (i + 1) * (x[1] - x[0])));
    return {
      x,
      y,
      ...(prognose?.length ? { prognose } : {}),
      ...(vorbild?.xName ? { xName: vorbild.xName } : {}),
      ...(vorbild?.yName ? { yName: vorbild.yName } : {}),
      ...(vorbild?.einheitY ? { einheitY: vorbild.einheitY } : {}),
    };
  },
  platzhalter: (d) => {
    const p: Record<string, string> = xyPlatzhalter(d);
    d.prognose?.forEach((v, i) => (p[`prognoseX${i + 1}`] = fz(v)));
    return p;
  },
  tabelle: xyTabelle,
  loese(d) {
    const b = new LoesungsBau();
    const e = d.einheitY;
    const k = kennzahlen(d.x, d.y);
    b.wert('xMittel', k.xm, { label: 'x̄', runden: 2, zusatz: true });
    b.wert('yMittel', k.ym, { label: 'ȳ', runden: 2, zusatz: true });
    b.wert('sxy', k.sxy, { label: 'Sxy', runden: 2, zusatz: true });
    b.wert('sxx', k.sxx, { label: 'Sxx', runden: 2, zusatz: true });
    b.wert('syy', k.syy, { label: 'Syy', runden: 2, zusatz: true });
    const steig = b.wert('b', k.sxy / k.sxx, { label: 'Steigung b', runden: 2 });
    const achse = b.wert('a', k.ym - steig * k.xm, { label: 'Achsenabschnitt a', runden: 2 });
    const yDach = (x: number) => achse + steig * x;
    b.schritt({
      titel: 'Mittelwerte',
      formel: L`\bar{x} = \frac{\sum x_i}{n},\ \bar{y} = \frac{\sum y_i}{n}`,
      einsetzen: L`\bar{x} = \frac{${lz(summe(d.x))}}{${d.x.length}},\ \bar{y} = \frac{${lz(summe(d.y))}}{${d.y.length}} = ${lz(k.ym, 2)}`,
      ergebnis: k.xm,
      runden: 2,
    });
    b.schritt({
      titel: 'Sxy und Sxx',
      formel: L`S_{xy} = \sum (x_i - \bar{x})(y_i - \bar{y}),\ S_{xx} = \sum (x_i - \bar{x})^2`,
      einsetzen: L`S_{xy} = ${lz(k.sxy, 2)},\ S_{xx} = ${lz(k.sxx, 2)}`,
      ergebnis: k.sxy,
      runden: 2,
    });
    b.schritt({
      titel: 'Steigung',
      formel: F.steigung.latex,
      einsetzen: L`b = \frac{${lz(k.sxy, 2)}}{${lz(k.sxx, 2)}}`,
      ergebnis: steig,
      runden: 2,
    });
    b.schritt({
      titel: 'Achsenabschnitt',
      formel: F.achsenabschnitt.latex,
      einsetzen: L`a = ${lz(k.ym, 2)} - ${lzk(steig, 4)} \cdot ${lzk(k.xm, 2)}`,
      ergebnis: achse,
      runden: 2,
      hinweis: `Regressionsgerade: ŷ = ${fz(achse, 2)} ${steig < 0 ? '−' : '+'} ${fz(Math.abs(steig), 2)} · x. Probe: ŷ(x̄) = ȳ.`,
    });
    d.prognose?.forEach((xp, i) => {
      const w = b.wert(`prognose${i + 1}`, yDach(xp), { label: `Prognose ŷ für x = ${fz(xp)}`, einheit: e, runden: 2 });
      b.schritt({
        titel: `Prognose für x = ${fz(xp)}`,
        formel: F.regressionsgerade.latex,
        einsetzen: L`\hat{y} = ${lz(achse, 2)} + ${lzk(steig, 2)} \cdot ${lzk(xp)}`,
        ergebnis: w,
        einheit: e,
        runden: 2,
      });
      b.fehler(`prognose${i + 1}`, steig + achse * xp, 'Du hast a und b vertauscht – ŷ = a + b · x mit b als Steigung.');
    });
    const zeilen: { label: string; ids: string[] }[] = [];
    d.x.forEach((xi, i) => {
      const yd = b.wert(`yDach${i + 1}`, yDach(xi), { label: `ŷ für x = ${fz(xi)}`, einheit: e, runden: 2, zusatz: true });
      const res = b.wert(`residuum${i + 1}`, d.y[i] - yd, {
        label: `Residuum e${i + 1} (x = ${fz(xi)})`,
        einheit: e,
        runden: 2,
        zusatz: true,
      });
      b.fehler(`residuum${i + 1}`, -res, 'Vorzeichen: Residuum e = y − ŷ (tatsächlich minus geschätzt).');
      zeilen.push({ label: `x = ${fz(xi)}, y = ${fz(d.y[i])}`, ids: [`yDach${i + 1}`, `residuum${i + 1}`] });
    });
    b.schritt({
      titel: 'Residuen',
      formel: F.residuum.latex,
      einsetzen: d.x.map((xi, i) => lz(runde(d.y[i] - yDach(xi), 2), 2)).join(L`;\ `),
      ergebnis: summe(d.x.map((xi, i) => d.y[i] - yDach(xi))),
      runden: 2,
      hinweis: 'Ergebnis = Summe der Residuen (bei der Kleinste-Quadrate-Geraden immer 0). Achte auf ein musterloses Vorzeichen.',
    });
    const r = b.wert('r', k.syy > 0 ? k.sxy / Math.sqrt(k.sxx * k.syy) : 0, {
      label: 'Korrelationskoeffizient r',
      runden: 2,
      zusatz: true,
    });
    const r2 = b.wert('r2', r * r, { label: 'Bestimmtheitsmaß R²', runden: 2, zusatz: true });
    b.schritt({
      titel: 'Güte: r und R²',
      formel: L`r = \frac{S_{xy}}{\sqrt{S_{xx} \cdot S_{yy}}},\ R^2 = r^2`,
      einsetzen: L`r = \frac{${lz(k.sxy, 2)}}{\sqrt{${lz(k.sxx, 2)} \cdot ${lz(k.syy, 2)}}} = ${lz(r, 4)}`,
      ergebnis: r2,
      runden: 2,
    });

    b.fehler('b', achse, 'Du hast a und b vertauscht – b ist die Steigung (Sxy / Sxx).');
    b.fehler('a', steig, 'Du hast a und b vertauscht – a ist der Achsenabschnitt (ȳ − b · x̄).');
    b.fehler('b', k.sxx / k.sxy, 'Bruch umgedreht – b = Sxy / Sxx.');
    b.fehler('a', k.ym + steig * k.xm, 'Vorzeichen: a = ȳ − b · x̄.');
    b.fehler('r2', r, 'Das ist r – das Bestimmtheitsmaß ist r².');
    b.fehler('r', -r, 'Vorzeichenfehler – das Vorzeichen von r ist das von Sxy.');
    return b.fertig({ spalten: ['ŷ', 'e = y − ŷ'], zeilen });
  },
});

const gdSchema = z
  .object({
    werte: z.array(zahl).min(3).max(40),
    k: z.number().int().min(2).max(12).default(3),
    anzahl: z.number().int().min(1).optional(),
    einheit: z.string().trim().min(1).optional(),
  })
  .refine((d) => d.werte.length >= d.k, { message: 'weniger Werte als die Fensterbreite k' });

export const gleitenderDurchschnitt = vorlage({
  id: 'gleitender-durchschnitt',
  titel: 'Gleitender Durchschnitt',
  bereich: 'Statistik II',
  beschreibung: 'Gleitende k-Perioden-Durchschnitte einer Zeitreihe (die ersten `anzahl` möglichen Werte).',
  schema: gdSchema,
  hinweise: ['Fenster aus k aufeinanderfolgenden Werten, Summe durch k.', 'Dann das Fenster um eine Periode weiterschieben.'],
  erzeuge(z, params, vorbild) {
    const n = intParam(params, 'n', vorbild?.werte.length ?? 8, 3, 40);
    const k = intParam(params, 'k', vorbild?.k ?? 3, 2, Math.min(12, n));
    let wert = z.ganz(80, 150, 2);
    const trend = z.ganz(2, 10, 2);
    const werte = Array.from({ length: n }, (_, i) => (i === 0 ? wert : (wert = Math.max(2, wert + trend + z.ganz(-12, 12, 2)))));
    return {
      werte,
      k,
      ...(vorbild?.anzahl ? { anzahl: Math.min(vorbild.anzahl, n - k + 1) } : {}),
      ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}),
    };
  },
  platzhalter: (d) => ({
    werte: fzListe(d.werte),
    k: String(d.k),
    n: String(d.werte.length),
    anzahl: String(Math.min(d.anzahl ?? Infinity, d.werte.length - d.k + 1)),
  }),
  tabelle: (d) => ({ kopf: ['Periode', ...d.werte.map((_, i) => String(i + 1))], zeilen: [['Wert', ...d.werte.map((v) => fz(v))]] }),
  loese(d) {
    const b = new LoesungsBau();
    const m = Math.min(d.anzahl ?? Infinity, d.werte.length - d.k + 1);
    for (let i = 0; i < m; i++) {
      const fenster = d.werte.slice(i, i + d.k);
      const gd = b.wert(`gd${i + 1}`, mittel(fenster), {
        label: `${i + 1}. Durchschnitt (Perioden ${i + 1}–${i + d.k})`,
        einheit: d.einheit,
        runden: 2,
      });
      b.schritt({
        titel: `${i + 1}. gleitender Durchschnitt`,
        formel: L`\bar{x}_{${i + 1}} = \frac{x_{${i + 1}} + \dots + x_{${i + d.k}}}{${d.k}}`,
        einsetzen: L`\frac{${lzSumme(fenster)}}{${d.k}} = \frac{${lz(summe(fenster))}}{${d.k}}`,
        ergebnis: gd,
        einheit: d.einheit,
        runden: 2,
      });
      b.fehler(`gd${i + 1}`, summe(fenster), `Du hast die Summe nicht durch k = ${d.k} geteilt.`);
      if (i + d.k < d.werte.length)
        b.fehler(`gd${i + 1}`, mittel(d.werte.slice(i + 1, i + 1 + d.k)), 'Das Fenster ist um eine Periode verrutscht.');
    }
    return b.fertig();
  },
});

const pvSchema = z.object({
  alt: z
    .number()
    .finite()
    .refine((v) => v !== 0, { message: 'alt darf nicht 0 sein' }),
  neu: zahl,
  einheit: z.string().trim().min(1).optional(),
});

export const prozentVeraenderung = vorlage({
  id: 'prozent-veraenderung',
  titel: 'Prozentuale Veränderung',
  bereich: 'Statistik II',
  beschreibung:
    'Differenz und relative Veränderung (neu − alt) / alt · 100 %; auch Inflationsrate aus dem Verbraucherpreisindex und Prozent vs. Prozentpunkte.',
  schema: pvSchema,
  hinweise: [
    'Veränderung = (neu − alt) / alt · 100 %.',
    'Die Basis ist immer der **Ausgangswert** (alt).',
    'Differenz zweier Prozentwerte = Prozentpunkte, nicht Prozent.',
  ],
  erzeuge(z, params, vorbild) {
    const pct = z.wahl([-30, -25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30, 40, 50, 60]);
    const klein = vorbild ? Math.abs(vorbild.alt) <= 20 : textParam(params, 'art', '') === 'quote';
    if (klein) {
      const alt = z.ganz(2, 12);
      const neu = z.ganz(1, 16);
      return { alt, neu: neu === alt ? alt + 1 : neu, ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}) };
    }
    const alt = z.ganz(4, 12) * 20;
    return { alt, neu: runde(alt * (1 + pct / 100), 2), ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}) };
  },
  platzhalter: (d) => ({ alt: fz(d.alt), neu: fz(d.neu) }),
  loese(d) {
    const b = new LoesungsBau();
    const diff = b.wert('differenz', d.neu - d.alt, {
      label: d.einheit === '%' ? 'Differenz (Prozentpunkte)' : 'Differenz',
      einheit: d.einheit === '%' ? 'Prozentpunkte' : d.einheit,
    });
    const p = b.wert('prozent', ((d.neu - d.alt) / d.alt) * 100, { label: 'Veränderung in %', einheit: '%', runden: 2 });
    b.wert('faktor', d.neu / d.alt, { label: 'Wachstumsfaktor', runden: 4, zusatz: true });
    b.schritt({
      titel: 'Differenz',
      formel: F.differenz.latex,
      einsetzen: L`\Delta = ${lz(d.neu)} - ${lzk(d.alt)}`,
      ergebnis: diff,
      einheit: d.einheit === '%' ? 'Prozentpunkte' : d.einheit,
    });
    b.schritt({
      titel: 'Relative Veränderung',
      formel: F.prozentVeraenderung.latex,
      einsetzen: L`\frac{${lzk(diff)}}{${lz(d.alt)}} \cdot 100\,\%`,
      ergebnis: p,
      einheit: '%',
      runden: 2,
    });
    b.fehler(
      'prozent',
      ((d.neu - d.alt) / d.neu) * 100,
      'Falsche Basis – geteilt wird durch den **Ausgangswert** (alt), nicht durch den neuen Wert.',
    );
    b.fehler('prozent', (d.neu / d.alt) * 100, 'Das ist das Verhältnis neu / alt · 100 % – davon musst du noch 100 % abziehen.');
    b.fehler(
      'prozent',
      diff,
      d.einheit === '%'
        ? 'Das sind **Prozentpunkte** (Differenz der Prozentwerte) – gefragt ist die relative Veränderung in Prozent.'
        : 'Das ist die absolute Differenz – bezieh sie auf den Ausgangswert.',
    );
    b.fehler('prozent', -p, 'Vorzeichen: neu minus alt.');
    b.fehler('differenz', -diff, 'Vorzeichen: neu minus alt.');
    return b.fertig();
  },
});
