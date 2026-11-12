// Statistik I (Deep Dive 3): Lagemaße, gewichtetes Mittel, Quartile/IQR/Ausreißer, Varianz, Variationskoeffizient, Häufigkeiten.
// Quartile nach der Konvention des Lernblatts (Position n · p, aufrunden; ganze Zahl → Mittel mit dem nächsten Wert).

import { z } from 'zod';
import {
  boolParam,
  fz,
  fzListe,
  intParam,
  L,
  LoesungsBau,
  lz,
  lzk,
  lzSumme,
  median,
  mittel,
  modi,
  quartil,
  quartilInterpoliert,
  runde,
  sortiert,
  summe,
  textParam,
  tx,
  vorlage,
  zahlParam,
} from '../hilfen.ts';
import { F } from '../formeln.ts';
import type { Params } from '../typen.ts';
import type { Zufall } from '../zufall.ts';

const zahl = z.number().finite();
const einheit = z.string().trim().min(1).optional();
const werteSchema = z.object({ werte: z.array(zahl).min(3).max(40), einheit });
type WerteDaten = z.infer<typeof werteSchema>;

/** Werte ohne Ausreißer (1,5-IQR-Regel) – Grundlage, um ähnliche Zufallszahlen zu erzeugen. */
function ohneAusreisser(werte: readonly number[]): { rest: number[]; ausreisser: boolean } {
  const q1 = quartil(werte, 0.25).wert;
  const q3 = quartil(werte, 0.75).wert;
  const iqr = q3 - q1;
  const rest = werte.filter((x) => x >= q1 - 1.5 * iqr && x <= q3 + 1.5 * iqr);
  return { rest, ausreisser: rest.length < werte.length };
}

/**
 * Zufällige Werteliste: n Werte im Raster [min, max] mit Schrittweite `schritt`, genau ein Wert doppelt (eindeutiger Modus),
 * optional ein großer Ausreißer. Unsortiert. Params: n, min, max, schritt, ausreisser.
 */
export function erzeugeWerte(z: Zufall, params: Params, vorbild?: WerteDaten): WerteDaten {
  const basis = vorbild ? ohneAusreisser(vorbild.werte) : undefined;
  const alleGanz5 = vorbild?.werte.every((x) => x % 5 === 0);
  const n = intParam(params, 'n', vorbild?.werte.length ?? z.ganz(7, 12), 3, 30);
  const schritt = zahlParam(params, 'schritt', vorbild ? (alleGanz5 ? 5 : 1) : 5, 1);
  const min = zahlParam(params, 'min', basis ? Math.min(...basis.rest) : z.ganz(20, 40, 5));
  let max = zahlParam(params, 'max', basis ? Math.max(...basis.rest) : min + z.ganz(40, 70, 5));
  const ausreisser = boolParam(params, 'ausreisser', basis ? basis.ausreisser : z.ja(0.5));
  const unterschiedliche = ausreisser ? n - 2 : n - 1;
  // Genug Rasterpunkte für lauter verschiedene Werte.
  if ((max - min) / schritt + 1 < unterschiedliche) max = min + (unterschiedliche - 1) * schritt;
  const raster: number[] = [];
  for (let x = min; x <= max + 1e-9; x += schritt) raster.push(Math.round(x * 1e6) / 1e6);
  const werte = z.stichprobe(raster, unterschiedliche);
  werte.push(z.wahl(werte));
  // Mindestens 2 Spannweiten über dem Maximum – liegt damit sicher über Q3 + 1,5 · IQR.
  if (ausreisser) werte.push(Math.round((max + z.ganz(4, 7) * (max - min) * 0.5) / schritt) * schritt);
  return { werte: z.mische(werte), ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}) };
}

const einheitVon = (d: { einheit?: string }) => d.einheit;
const listePlatzhalter = (werte: number[]) => ({ werte: fzListe(werte), werteSortiert: fzListe(sortiert(werte)), n: String(werte.length) });

export const lagemasse = vorlage({
  id: 'lagemasse',
  titel: 'Mittelwert, Median, Modus, Spannweite',
  bereich: 'Statistik I',
  beschreibung: 'Arithmetisches Mittel, Median, Modus und Spannweite einer Werteliste.',
  schema: werteSchema,
  erzeuge: erzeugeWerte,
  hinweise: [
    'Sortiere die Werte zuerst aufsteigend.',
    'Mittelwert = Summe / n. Median: n ungerade → Wert an Position (n + 1) / 2, n gerade → Mittel der beiden mittleren Werte.',
    'Modus = häufigster Wert. Spannweite = Maximum − Minimum.',
  ],
  platzhalter: (d) => listePlatzhalter(d.werte),
  loese(d) {
    const b = new LoesungsBau();
    const e = einheitVon(d);
    const s = sortiert(d.werte);
    const n = s.length;
    const sum = b.wert('summe', summe(s), { label: 'Summe', einheit: e, zusatz: true });
    const m = b.wert('mittel', sum / n, { label: 'Arithmetisches Mittel', einheit: e, runden: 2 });
    const med = b.wert('median', median(s), { label: 'Median', einheit: e, runden: 2 });
    const mod = modi(s);
    b.wert('modus', mod.length === 1 ? mod[0] : mod, { label: mod.length === 1 ? 'Modus' : 'Modus (alle häufigsten Werte)', einheit: e });
    const r = b.wert('spannweite', s[n - 1] - s[0], { label: 'Spannweite', einheit: e });
    b.wert('minimum', s[0], { label: 'Minimum', einheit: e, zusatz: true });
    b.wert('maximum', s[n - 1], { label: 'Maximum', einheit: e, zusatz: true });

    b.schritt({
      titel: `Sortieren (n = ${n})`,
      formel: L`x_{(1)} \le x_{(2)} \le \dots \le x_{(n)}`,
      einsetzen: s.map((x) => lz(x)).join(L` \le `),
      ergebnis: n,
      einheit: 'Werte',
    });
    b.schritt({
      titel: 'Arithmetisches Mittel',
      formel: F.mittel.latex,
      einsetzen: L`\bar{x} = \frac{${lzSumme(s)}}{${n}} = \frac{${lz(sum)}}{${n}}`,
      ergebnis: m,
      einheit: e,
      runden: 2,
    });
    if (n % 2) {
      const pos = (n + 1) / 2;
      b.schritt({
        titel: 'Median',
        formel: F.medianUngerade.latex,
        einsetzen: L`\tilde{x} = x_{(${pos})}`,
        ergebnis: med,
        einheit: e,
        runden: 2,
        hinweis: `n = ${n} ist ungerade → Position ${pos} der sortierten Reihe.`,
      });
    } else {
      b.schritt({
        titel: 'Median',
        formel: F.medianGerade.latex,
        einsetzen: L`\tilde{x} = \frac{${lzk(s[n / 2 - 1])} + ${lzk(s[n / 2])}}{2}`,
        ergebnis: med,
        einheit: e,
        runden: 2,
        hinweis: `n = ${n} ist gerade → Mittel der Werte an Position ${n / 2} und ${n / 2 + 1}.`,
      });
    }
    if (mod.length) {
      const anzahl = s.filter((x) => x === mod[0]).length;
      b.schritt({
        titel: 'Modus',
        formel: tx('häufigster Wert'),
        einsetzen: L`${mod.map((x) => lz(x)).join(L`;\ `)}\ \ (${anzahl}\times)`,
        ergebnis: mod[0],
        einheit: e,
        hinweis: mod.length > 1 ? `Mehrere Modi: ${fzListe(mod)}.` : undefined,
      });
    }
    b.schritt({
      titel: 'Spannweite',
      formel: F.spannweite.latex,
      einsetzen: L`R = ${lz(s[n - 1])} - ${lzk(s[0])}`,
      ergebnis: r,
      einheit: e,
    });

    const mitte = Math.floor(n / 2);
    const unsortiert = n % 2 ? d.werte[mitte] : (d.werte[mitte - 1] + d.werte[mitte]) / 2;
    b.fehler('median', unsortiert, 'Du hast die Werte nicht sortiert – der Median ist der mittlere Wert der **sortierten** Reihe.');
    b.fehler('median', n % 2 ? (n + 1) / 2 : n / 2 + 0.5, 'Das ist die **Position** des Medians, nicht sein Wert.');
    if (n % 2 === 0) {
      b.fehler('median', s[n / 2 - 1], 'Bei gerader Anzahl ist der Median das Mittel der **beiden** mittleren Werte.');
      b.fehler('median', s[n / 2], 'Bei gerader Anzahl ist der Median das Mittel der **beiden** mittleren Werte.');
    }
    b.fehler('median', m, 'Das ist das arithmetische Mittel – der Median ist der mittlere Wert der sortierten Reihe.');
    b.fehler('mittel', sum / (n - 1), 'Du hast durch n − 1 geteilt – beim Mittelwert teilt man durch n.');
    b.fehler('mittel', med, 'Das ist der Median – das arithmetische Mittel ist Summe / n.');
    b.fehler('mittel', sum, 'Du hast die Summe nicht durch n geteilt.');
    if (mod.length === 1) {
      b.fehler('modus', s.filter((x) => x === mod[0]).length, 'Das ist die **Häufigkeit** des Modus – gefragt ist der Wert selbst.');
      b.fehler('modus', med, 'Das ist der Median – der Modus ist der häufigste Wert.');
    }
    b.fehler('spannweite', s[n - 1], 'Das ist nur das Maximum – Spannweite = Maximum − Minimum.');
    b.fehler(
      'spannweite',
      d.werte[n - 1] - d.werte[0],
      'Du hast letzten minus ersten Wert der **unsortierten** Liste gerechnet – nimm Maximum − Minimum.',
    );
    return b.fertig();
  },
});

const gewichtetSchema = z.object({
  gruppen: z
    .array(z.object({ anzahl: z.number().positive(), wert: zahl }))
    .min(2)
    .max(10),
  einheit,
});

export const gewichtetesMittel = vorlage({
  id: 'gewichtetes-mittel',
  titel: 'Gewichtetes arithmetisches Mittel',
  bereich: 'Statistik I',
  beschreibung: 'Mittelwert aus Gruppen mit unterschiedlicher Anzahl (z. B. 4 Aufträge à 45 min, 6 à 70 min).',
  schema: gewichtetSchema,
  hinweise: ['Jeder Gruppenwert zählt so oft, wie er vorkommt.', 'x̄ = Σ(Anzahl · Wert) / Σ Anzahl.'],
  erzeuge(z, params, vorbild) {
    const k = intParam(params, 'gruppen', vorbild?.gruppen.length ?? z.ganz(2, 3), 2, 6);
    const werte = z.stichprobe([30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90], k);
    return {
      gruppen: werte.map((wert) => ({ anzahl: z.ganz(2, 9), wert })),
      ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}),
    };
  },
  platzhalter: (d) => {
    const p: Record<string, string> = { gruppen: d.gruppen.map((g) => `${fz(g.anzahl)} × ${fz(g.wert)}`).join('; ') };
    d.gruppen.forEach((g, i) => {
      p[`anzahl${i + 1}`] = fz(g.anzahl);
      p[`wert${i + 1}`] = fz(g.wert);
    });
    p.gesamt = fz(summe(d.gruppen.map((g) => g.anzahl)));
    return p;
  },
  loese(d) {
    const b = new LoesungsBau();
    const e = d.einheit;
    const gew = b.wert('summeGewichte', summe(d.gruppen.map((g) => g.anzahl)), { label: 'Summe der Anzahlen', zusatz: true });
    const prod = b.wert('summeProdukte', summe(d.gruppen.map((g) => g.anzahl * g.wert)), { label: 'Σ Anzahl · Wert', zusatz: true });
    const m = b.wert('mittel', prod / gew, { label: 'Gewichtetes Mittel', einheit: e, runden: 2 });
    b.schritt({
      titel: 'Gewichtetes arithmetisches Mittel',
      formel: F.gewichtetesMittel.latex,
      einsetzen: L`\bar{x} = \frac{${d.gruppen.map((g) => L`${lz(g.anzahl)} \cdot ${lzk(g.wert)}`).join(' + ')}}{${d.gruppen.map((g) => lz(g.anzahl)).join(' + ')}} = \frac{${lz(prod)}}{${lz(gew)}}`,
      ergebnis: m,
      einheit: e,
      runden: 2,
    });
    b.fehler(
      'mittel',
      mittel(d.gruppen.map((g) => g.wert)),
      'Du hast die Gruppenwerte einfach gemittelt – jede Gruppe muss mit ihrer Anzahl gewichtet werden.',
    );
    b.fehler('mittel', prod / d.gruppen.length, 'Du hast durch die Zahl der Gruppen geteilt – geteilt wird durch die Summe der Anzahlen.');
    return b.fertig();
  },
});

export const quartile = vorlage({
  id: 'quartile',
  titel: 'Quartile, IQR und Ausreißer (1,5-IQR-Regel)',
  bereich: 'Statistik I',
  beschreibung: 'Q1, Q3, IQR, Zäune, Ausreißer und Whisker-Enden nach der Konvention des Lernblatts.',
  schema: werteSchema,
  erzeuge: erzeugeWerte,
  hinweise: [
    'Sortiere zuerst. Position = n · p (p = 0,25 bzw. 0,75).',
    'Keine ganze Zahl → aufrunden und den Wert an dieser Position nehmen. Ganze Zahl → Mittel aus diesem und dem nächsten Wert.',
    'IQR = Q3 − Q1. Zäune: Q1 − 1,5 · IQR und Q3 + 1,5 · IQR. Whisker enden beim äußersten Wert **innerhalb** der Zäune.',
  ],
  platzhalter: (d) => listePlatzhalter(d.werte),
  loese(d) {
    const b = new LoesungsBau();
    const e = d.einheit;
    const s = sortiert(d.werte);
    const n = s.length;
    const Q1 = quartil(s, 0.25);
    const Q3 = quartil(s, 0.75);
    const q1 = b.wert('q1', Q1.wert, { label: 'Q1 (unteres Quartil)', einheit: e, runden: 2 });
    const q3 = b.wert('q3', Q3.wert, { label: 'Q3 (oberes Quartil)', einheit: e, runden: 2 });
    const iqr = b.wert('iqr', q3 - q1, { label: 'Interquartilsabstand (IQR)', einheit: e, runden: 2 });
    b.wert('median', quartil(s, 0.5).wert, { label: 'Median', einheit: e, runden: 2, zusatz: true });
    const zu = b.wert('zaunUnten', q1 - 1.5 * iqr, { label: 'Unterer Zaun', einheit: e, runden: 2 });
    const zo = b.wert('zaunOben', q3 + 1.5 * iqr, { label: 'Oberer Zaun', einheit: e, runden: 2 });
    const aus = b.wert(
      'ausreisser',
      s.filter((x) => x < zu || x > zo),
      { label: 'Ausreißer (alle; „keine“, wenn es keine gibt)', einheit: e },
    );
    const innen = s.filter((x) => x >= zu && x <= zo);
    const wu = b.wert('whiskerUnten', innen[0], { label: 'Ende unterer Whisker', einheit: e, zusatz: true });
    const wo = b.wert('whiskerOben', innen[innen.length - 1], { label: 'Ende oberer Whisker', einheit: e, zusatz: true });

    const schrittQ = (name: string, p: number, q: ReturnType<typeof quartil>) => {
      const pos = q.position;
      b.schritt({
        titel: name,
        formel: F.quartilPosition.latex,
        einsetzen: q.ganz
          ? L`${n} \cdot ${lz(p)} = ${lz(pos)} \Rightarrow \frac{x_{(${pos})} + x_{(${pos + 1})}}{2} = \frac{${lzk(s[pos - 1])} + ${lzk(s[pos])}}{2}`
          : L`${n} \cdot ${lz(p)} = ${lz(pos)} \Rightarrow \text{aufrunden: } x_{(${Math.ceil(pos)})}`,
        ergebnis: q.wert,
        einheit: e,
        runden: 2,
        hinweis: q.ganz
          ? `Position ${fz(pos)} ist ganzzahlig → Mittel der Werte an Position ${pos} und ${pos + 1}.`
          : `Position ${fz(pos)} → aufrunden auf Position ${Math.ceil(pos)} → Wert ${fz(q.wert)} (Position ist nicht der Wert!).`,
      });
    };
    b.schritt({
      titel: `Sortieren (n = ${n})`,
      formel: L`x_{(1)} \le \dots \le x_{(n)}`,
      einsetzen: s.map((x) => lz(x)).join(L` \le `),
      ergebnis: n,
      einheit: 'Werte',
      hinweis: 'Konvention: Position = n · p; keine ganze Zahl → aufrunden, ganze Zahl → Mittel mit dem nächsten Wert.',
    });
    schrittQ('Unteres Quartil Q1', 0.25, Q1);
    schrittQ('Oberes Quartil Q3', 0.75, Q3);
    b.schritt({
      titel: 'Interquartilsabstand',
      formel: F.iqr.latex,
      einsetzen: L`IQR = ${lz(q3)} - ${lzk(q1)}`,
      ergebnis: iqr,
      einheit: e,
      runden: 2,
    });
    b.schritt({
      titel: 'Unterer Zaun',
      formel: F.zaunUnten.latex,
      einsetzen: L`${lz(q1)} - 1{,}5 \cdot ${lzk(iqr)} = ${lz(q1)} - ${lzk(1.5 * iqr)}`,
      ergebnis: zu,
      einheit: e,
      runden: 2,
    });
    b.schritt({
      titel: 'Oberer Zaun',
      formel: F.zaunOben.latex,
      einsetzen: L`${lz(q3)} + 1{,}5 \cdot ${lzk(iqr)} = ${lz(q3)} + ${lzk(1.5 * iqr)}`,
      ergebnis: zo,
      einheit: e,
      runden: 2,
      hinweis: aus.length
        ? `Ausreißer (außerhalb der Zäune): ${fzListe(aus)}. Whisker: ${fz(wu)} bis ${fz(wo)}.`
        : `Keine Ausreißer – alle Werte liegen zwischen den Zäunen. Whisker: ${fz(wu)} bis ${fz(wo)}.`,
    });

    const excel =
      'Das ist die Interpolations-Methode (wie Excel QUARTILE.INKL). In der Prüfung ok, wenn du die Methode nennst – hier gilt die Konvention des Lernblatts: Position n · p, aufrunden.';
    b.fehler('q1', quartilInterpoliert(s, 0.25), excel);
    b.fehler('q3', quartilInterpoliert(s, 0.75), excel);
    b.fehler('q1', Q1.ganz ? Q1.position : Math.ceil(Q1.position), 'Das ist die **Position** von Q1, nicht der Wert an dieser Position.');
    b.fehler('q3', Q3.ganz ? Q3.position : Math.ceil(Q3.position), 'Das ist die **Position** von Q3, nicht der Wert an dieser Position.');
    if (!Q1.ganz) b.fehler('q1', d.werte[Math.ceil(Q1.position) - 1], 'Du hast in der **unsortierten** Liste abgezählt – erst sortieren.');
    if (!Q3.ganz) b.fehler('q3', d.werte[Math.ceil(Q3.position) - 1], 'Du hast in der **unsortierten** Liste abgezählt – erst sortieren.');
    b.fehler('iqr', quartilInterpoliert(s, 0.75) - quartilInterpoliert(s, 0.25), excel);
    b.fehler('zaunOben', q3 + 1.5 * q3, 'Du hast 1,5 · Q3 gerechnet – der Zaun ist Q3 + 1,5 · **IQR**.');
    b.fehler('zaunUnten', q1 - 1.5 * q1, 'Du hast 1,5 · Q1 gerechnet – der Zaun ist Q1 − 1,5 · **IQR**.');
    b.fehler('zaunOben', q3 + iqr, 'Du hast den IQR nicht mit 1,5 multipliziert.');
    b.fehler('zaunUnten', q1 - iqr, 'Du hast den IQR nicht mit 1,5 multipliziert.');
    b.fehler('whiskerOben', zo, 'Der Whisker endet nicht am Zaun, sondern beim größten Wert **innerhalb** des Zauns.');
    b.fehler('whiskerOben', s[n - 1], 'Das ist ein Ausreißer – der Whisker endet beim größten Wert **innerhalb** des Zauns.');
    b.fehler('whiskerUnten', zu, 'Der Whisker endet nicht am Zaun, sondern beim kleinsten Wert **innerhalb** des Zauns.');
    b.fehler('whiskerUnten', s[0], 'Das ist ein Ausreißer – der Whisker endet beim kleinsten Wert **innerhalb** des Zauns.');
    if (aus.length) b.fehler('ausreisser', [], 'Prüfe jeden Wert gegen **beide** Zäune – mindestens einer liegt außerhalb.');
    return b.fertig();
  },
});

const varianzSchema = z.object({
  werte: z.array(zahl).min(2).max(30),
  art: z.enum(['grundgesamtheit', 'stichprobe']),
  einheit,
});

export const varianz = vorlage({
  id: 'varianz',
  titel: 'Varianz und Standardabweichung',
  bereich: 'Statistik I',
  beschreibung: 'Varianz und Standardabweichung der Grundgesamtheit (÷ n) oder der Stichprobe (÷ (n − 1)), mit Abweichungstabelle.',
  schema: varianzSchema,
  hinweise: [
    '1. Mittelwert, 2. Abweichungen x − x̄, 3. quadrieren und summieren (SAQ), 4. teilen.',
    'Grundgesamtheit: σ² = SAQ / n. Stichprobe: s² = SAQ / (n − 1).',
    'Die Standardabweichung ist die Wurzel der Varianz. Kontrolle: Σ(x − x̄) = 0.',
  ],
  erzeuge(z, params, vorbild) {
    const n = intParam(params, 'n', vorbild?.werte.length ?? z.ganz(5, 8), 2, 20);
    const min = zahlParam(params, 'min', vorbild ? Math.min(...vorbild.werte) : 1);
    const max = zahlParam(params, 'max', vorbild ? Math.max(...vorbild.werte) + 2 : min + 11, min + n);
    const art: 'grundgesamtheit' | 'stichprobe' =
      textParam(params, 'art', vorbild?.art ?? z.wahl(['grundgesamtheit', 'stichprobe'])) === 'stichprobe'
        ? 'stichprobe'
        : 'grundgesamtheit';
    const werte = Array.from({ length: n - 1 }, () => z.ganz(min, max));
    // Letzten Wert so wählen, dass der Mittelwert ganzzahlig ist (rechnet sich auf Papier leichter).
    const passend: number[] = [];
    for (let v = Math.ceil(min); v <= max; v++) if ((((summe(werte) + v) % n) + n) % n === 0) passend.push(v);
    werte.push(passend.length ? z.wahl(passend) : z.ganz(min, max));
    return { werte, art, ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}) };
  },
  platzhalter: (d) => ({
    ...listePlatzhalter(d.werte),
    art: d.art === 'stichprobe' ? 'Stichprobe' : 'Grundgesamtheit',
    artLang: d.art === 'stichprobe' ? 'einer Stichprobe' : 'der Grundgesamtheit',
  }),
  tabelle: (d) => ({ kopf: ['i', ...d.werte.map((_, i) => String(i + 1))], zeilen: [['x', ...d.werte.map((x) => fz(x))]] }),
  loese(d) {
    const b = new LoesungsBau();
    const e = d.einheit;
    const n = d.werte.length;
    const stich = d.art === 'stichprobe';
    const m = b.wert('mittel', mittel(d.werte), { label: 'Mittelwert', einheit: e, runden: 2, zusatz: true });
    const abw = d.werte.map((x) => x - m);
    const saq = b.wert('saq', summe(abw.map((a) => a * a)), { label: 'Summe der Abweichungsquadrate (SAQ)', runden: 2, zusatz: true });
    const teiler = stich ? n - 1 : n;
    const v = b.wert('varianz', saq / teiler, { label: stich ? 'Varianz s²' : 'Varianz σ²', einheit: e ? `${e}²` : undefined, runden: 2 });
    const sd = b.wert('stdabw', Math.sqrt(v), { label: stich ? 'Standardabweichung s' : 'Standardabweichung σ', einheit: e, runden: 2 });

    b.schritt({
      titel: 'Mittelwert',
      formel: F.mittel.latex,
      einsetzen: L`\bar{x} = \frac{${lzSumme(d.werte)}}{${n}}`,
      ergebnis: m,
      einheit: e,
      runden: 2,
    });
    b.schritt({
      titel: 'Summe der Abweichungsquadrate',
      formel: F.saq.latex,
      einsetzen: `SAQ = ${abw.map((a) => L`${lzk(a, 2)}^2`).join(' + ')}`,
      ergebnis: saq,
      runden: 2,
      hinweis: `Kontrolle: Σ(x − x̄) = ${fz(summe(abw), 2)}.`,
    });
    b.schritt({
      titel: stich ? 'Varianz der Stichprobe' : 'Varianz der Grundgesamtheit',
      formel: stich ? F.varianzStichprobe.latex : F.varianzGrundgesamtheit.latex,
      einsetzen: stich ? L`s^2 = \frac{${lz(saq, 2)}}{${n} - 1}` : L`\sigma^2 = \frac{${lz(saq, 2)}}{${n}}`,
      ergebnis: v,
      einheit: e ? `${e}²` : undefined,
      runden: 2,
    });
    b.schritt({
      titel: 'Standardabweichung',
      formel: stich ? L`s = \sqrt{s^2}` : L`\sigma = \sqrt{\sigma^2}`,
      einsetzen: L`\sqrt{${lz(v, 2)}}`,
      ergebnis: sd,
      einheit: e,
      runden: 2,
    });

    const anders = saq / (stich ? n : n - 1);
    const textAnders = stich
      ? 'Du hast durch n geteilt – bei einer Stichprobe teilt man durch n − 1.'
      : 'Du hast durch n − 1 geteilt – für die Grundgesamtheit teilt man durch n.';
    b.fehler('varianz', anders, textAnders);
    b.fehler('stdabw', Math.sqrt(anders), textAnders);
    b.fehler('varianz', saq, 'Du hast die Summe der Abweichungsquadrate nicht geteilt.');
    b.fehler('varianz', sd, 'Das ist die Standardabweichung – die Varianz ist das Quadrat davon (vor dem Wurzelziehen).');
    b.fehler('stdabw', v, 'Du hast die Wurzel vergessen – die Standardabweichung ist √Varianz.');
    b.fehler(
      'stdabw',
      summe(abw.map(Math.abs)) / teiler,
      'Du hast die Beträge der Abweichungen gemittelt – für die Standardabweichung quadrieren, teilen, Wurzel ziehen.',
    );
    b.fehler('saq', summe(abw.map(Math.abs)), 'Die Abweichungen werden **quadriert**, nicht nur als Betrag genommen.');
    return b.fertig();
  },
});

const vkSchema = z.object({
  gruppen: z
    .array(z.object({ name: z.string().trim().min(1), mittel: z.number().positive(), stdabw: z.number().nonnegative() }))
    .min(1)
    .max(6),
  einheit,
});

export const variationskoeffizient = vorlage({
  id: 'variationskoeffizient',
  titel: 'Variationskoeffizient',
  bereich: 'Statistik I',
  beschreibung: 'VK = σ / x̄ in Prozent für eine oder mehrere Gruppen und die gleichmäßigere Gruppe.',
  schema: vkSchema,
  hinweise: [
    'VK = Standardabweichung / Mittelwert · 100 %.',
    'Gleichmäßiger arbeitet die Gruppe mit dem **kleineren VK** – nicht die mit dem kleineren σ.',
  ],
  erzeuge(z, params, vorbild) {
    const namen = vorbild?.gruppen.map((g) => g.name) ?? ['Filiale Nord', 'Filiale Süd'];
    const k = intParam(params, 'gruppen', namen.length, 1, 6);
    const falle = z.ja(0.7);
    for (let versuch = 0; ; versuch++) {
      const gruppen = Array.from({ length: k }, (_, i) => {
        const mittel = z.ganz(4, 15) * 10;
        const vk = z.ganz(5, 20);
        return { name: namen[i] ?? `Gruppe ${i + 1}`, mittel, stdabw: (mittel * vk) / 100 };
      });
      const vks = gruppen.map((g) => g.stdabw / g.mittel);
      const besteVk = vks.indexOf(Math.min(...vks));
      const sds = gruppen.map((g) => g.stdabw);
      const eindeutig = new Set(vks.map((v) => runde(v, 6))).size === vks.length;
      // Meist so, dass die gleichmäßigere Gruppe absolut stärker streut (die typische Falle der Aufgabe).
      if ((eindeutig && (k < 2 || !falle || sds[besteVk] !== Math.min(...sds))) || versuch > 200)
        return { gruppen, ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}) };
    }
  },
  platzhalter: (d) => {
    const p: Record<string, string> = {};
    d.gruppen.forEach((g, i) => {
      p[`name${i + 1}`] = g.name;
      p[`mittel${i + 1}`] = fz(g.mittel);
      p[`stdabw${i + 1}`] = fz(g.stdabw);
    });
    return p;
  },
  tabelle: (d) => ({
    kopf: ['Gruppe', 'x̄', 'σ'],
    zeilen: d.gruppen.map((g) => [
      g.name,
      fz(g.mittel) + (d.einheit ? ` ${d.einheit}` : ''),
      fz(g.stdabw) + (d.einheit ? ` ${d.einheit}` : ''),
    ]),
  }),
  loese(d) {
    const b = new LoesungsBau();
    const vks = d.gruppen.map((g, i) => {
      const vk = b.wert(`vk${i + 1}`, (g.stdabw / g.mittel) * 100, { label: `VK ${g.name}`, einheit: '%', runden: 2 });
      b.schritt({
        titel: `Variationskoeffizient ${g.name}`,
        formel: F.variationskoeffizient.latex,
        einsetzen: L`VK = \frac{${lz(g.stdabw)}}{${lz(g.mittel)}} \cdot 100\,\%`,
        ergebnis: vk,
        einheit: '%',
        runden: 2,
      });
      b.fehler(`vk${i + 1}`, (g.mittel / g.stdabw) * 100, 'Du hast den Bruch umgedreht – VK = σ / x̄.');
      return vk;
    });
    if (d.gruppen.length > 1) {
      const beste = d.gruppen[vks.indexOf(Math.min(...vks))].name;
      b.wert('gleichmaessiger', beste, { label: 'Gleichmäßiger arbeitet', vergleich: 'text' });
      const kleinstesSigma = d.gruppen.reduce((a, g) => (g.stdabw < a.stdabw ? g : a)).name;
      b.fehler(
        'gleichmaessiger',
        kleinstesSigma,
        'Du hast die **absolute** Streuung (σ) verglichen – vergleichbar macht sie erst der VK (relativ zum Mittelwert).',
      );
    }
    return b.fertig();
  },
});

const haeufigSchema = z.object({
  kategorien: z
    .array(z.object({ name: z.string().trim().min(1), h: z.number().int().nonnegative() }))
    .min(2)
    .max(12),
  schwelle: z.number().positive().max(100).optional(),
});

export const haeufigkeiten = vorlage({
  id: 'haeufigkeiten',
  titel: 'Häufigkeitstabelle und Pareto',
  bereich: 'Statistik I',
  beschreibung: 'Relative und kumulierte Häufigkeiten (absteigend sortiert) und wie viele Kategorien die 80-%-Marke erreichen.',
  schema: haeufigSchema,
  hinweise: [
    'Zuerst absteigend nach Häufigkeit sortieren.',
    'Relativ = h / n · 100 %. Kumuliert = laufende Summe der relativen Häufigkeiten.',
    'Pareto: die kleinste Zahl von Kategorien, deren kumulierter Anteil die Schwelle erreicht.',
  ],
  erzeuge(z, params, vorbild) {
    const namen = vorbild?.kategorien.map((k) => k.name) ?? [
      'Transportschaden',
      'Montagefehler',
      'Falschlieferung',
      'Materialfehler',
      'Sonstiges',
    ];
    const k = intParam(params, 'kategorien', namen.length, 2, 12);
    const n = intParam(
      params,
      'n',
      vorbild ? summe(vorbild.kategorien.map((x) => x.h)) : z.wahl([40, 50, 80, 100, 120, 200]),
      k * 2,
      10000,
    );
    for (let versuch = 0; ; versuch++) {
      const gewichte = Array.from({ length: k }, (_, i) => (k - i) ** 1.6 * (0.6 + z.zahl()));
      const g = summe(gewichte);
      const h = gewichte.map((w) => Math.max(1, Math.round((w / g) * n)));
      h[0] += n - summe(h);
      // Verschiedene Häufigkeiten, damit die Sortierung eindeutig ist (nach vielen Versuchen genügt h > 0).
      if (h[0] > 0 && (new Set(h).size === k || versuch > 200)) {
        const zu = z.mische(namen.slice(0, k));
        return {
          kategorien: h.map((x, i) => ({ name: zu[i] ?? `Kategorie ${i + 1}`, h: x })),
          ...(vorbild?.schwelle ? { schwelle: vorbild.schwelle } : {}),
        };
      }
    }
  },
  platzhalter: (d) => ({
    n: fz(summe(d.kategorien.map((k) => k.h))),
    kategorien: d.kategorien.map((k) => `${k.name} ${fz(k.h)}`).join(', '),
    schwelle: fz(d.schwelle ?? 80),
  }),
  tabelle: (d) => ({ kopf: ['Kategorie', 'h'], zeilen: d.kategorien.map((k) => [k.name, fz(k.h)]) }),
  loese(d) {
    const b = new LoesungsBau();
    const schwelle = d.schwelle ?? 80;
    const n = b.wert('n', summe(d.kategorien.map((k) => k.h)), { label: 'Summe n', zusatz: true });
    const sort = [...d.kategorien].sort((a, c) => c.h - a.h);
    let kum = 0;
    let anzahl = 0;
    const zeilen: { label: string; ids: string[] }[] = [];
    sort.forEach((k, i) => {
      const rel = b.wert(`rel${i + 1}`, (k.h / n) * 100, { label: `relativ: ${k.name}`, einheit: '%', runden: 1 });
      kum += rel;
      b.wert(`kum${i + 1}`, kum, { label: `kumuliert: ${k.name}`, einheit: '%', runden: 1 });
      if (!anzahl && kum >= schwelle - 1e-9) anzahl = i + 1;
      zeilen.push({ label: `${i + 1}. ${k.name} (h = ${fz(k.h)})`, ids: [`rel${i + 1}`, `kum${i + 1}`] });
      b.fehler(`rel${i + 1}`, k.h, 'Das ist die absolute Häufigkeit – relativ = h / n · 100 %.');
    });
    b.wert('anzahlSchwelle', anzahl, { label: `Kategorien bis ${fz(schwelle)} %` });
    b.wert('modus', sort[0].name, { label: 'Modus (häufigste Kategorie)', vergleich: 'text', zusatz: true });

    b.schritt({ titel: 'Summe', formel: L`n = \sum h_i`, einsetzen: L`n = ${lzSumme(sort.map((k) => k.h))}`, ergebnis: n });
    let lauf = 0;
    sort.forEach((k, i) => {
      const rel = (k.h / n) * 100;
      lauf += rel;
      b.schritt({
        titel: `${i + 1}. ${k.name}`,
        formel: F.haeufigkeiten.latex,
        einsetzen: L`f = \frac{${lz(k.h)}}{${lz(n)}} \cdot 100\,\% = ${lz(rel, 1)}\,\%,\quad F = ${lz(lauf, 1)}\,\%`,
        ergebnis: lauf,
        einheit: '%',
        runden: 1,
      });
    });
    b.schritt({
      titel: `Pareto: ${fz(schwelle)}-%-Marke`,
      formel: L`\min k: F_k \ge ${lz(schwelle)}\,\%`,
      einsetzen: L`F_{${anzahl}} = ${lz((summe(sort.slice(0, anzahl).map((k) => k.h)) / n) * 100, 1)}\,\%`,
      ergebnis: anzahl,
      einheit: 'Kategorien',
      hinweis:
        anzahl > 1
          ? `Mit ${anzahl - 1} Kategorien wären es erst ${fz((summe(sort.slice(0, anzahl - 1).map((k) => k.h)) / n) * 100, 1)} %.`
          : undefined,
    });

    // Fehlerbild: kumuliert in der Reihenfolge der Aufgabe statt absteigend sortiert.
    let kumRoh = 0;
    const rohKum = new Map<string, number>();
    for (const k of d.kategorien) rohKum.set(k.name, (kumRoh += (k.h / n) * 100));
    sort.forEach((k, i) =>
      b.fehler(`kum${i + 1}`, rohKum.get(k.name)!, 'Du hast nicht absteigend sortiert – kumuliert wird in der sortierten Reihenfolge.'),
    );
    if (anzahl > 1)
      b.fehler(
        'anzahlSchwelle',
        anzahl - 1,
        `Damit bleibt der kumulierte Anteil unter ${fz(schwelle)} % – die Marke muss erreicht werden.`,
      );
    b.fehler('anzahlSchwelle', anzahl + 1, 'Gefragt ist die **kleinste** Anzahl, die die Marke erreicht.');
    return b.fertig({ spalten: ['relativ (%)', 'kumuliert (%)'], zeilen });
  },
});
