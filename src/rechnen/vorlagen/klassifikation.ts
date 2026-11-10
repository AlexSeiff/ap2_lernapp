// Klassifikation von Hand (Deep Dive 6, Teil 7): k-Nächste-Nachbarn (Abstände, k nächste Nachbarn, Mehrheitsentscheid)
// und ID3 (Entropie, Informationsgewinn je Merkmal, Wurzel des Entscheidungsbaums).

import { z } from 'zod';
import { fz, intParam, L, LoesungsBau, lz, lzk, tx, vorlage } from '../hilfen.ts';
import { F } from '../formeln.ts';
import type { Zufall } from '../zufall.ts';

// ---------- k-NN ----------

const punkt = z.tuple([z.number().finite(), z.number().finite()]);
const klasse = z.string().trim().min(1);
const knnSchema = z
  .object({
    punkte: z.array(punkt).min(3).max(20),
    klassen: z.array(klasse).min(3).max(20),
    neu: punkt,
    k: z.number().int().min(1).max(15),
  })
  .refine((d) => d.klassen.length === d.punkte.length, { message: 'je Punkt genau eine Klasse' })
  .refine((d) => d.k < d.punkte.length, { message: 'k muss kleiner als die Anzahl der Punkte sein' })
  .refine((d) => new Set(d.klassen).size >= 2, { message: 'mindestens zwei Klassen' });

const abstand = (p: readonly number[], c: readonly number[]) => Math.hypot(p[0] - c[0], p[1] - c[1]);
const manhattan = (p: readonly number[], c: readonly number[]) => Math.abs(p[0] - c[0]) + Math.abs(p[1] - c[1]);
/** Reihenfolge der Klassen: wie sie in den Daten zuerst vorkommen. */
const klassenVon = (klassen: readonly string[]) => [...new Set(klassen)];

/** Indizes nach Abstand (stabil: bei Gleichstand der kleinere Index zuerst). */
const nachAbstand = (ds: readonly number[]) => ds.map((d, i) => ({ d, i })).sort((a, b) => a.d - b.d || a.i - b.i);

/** Mehrheitsentscheid; bei Stimmengleichstand gewinnt die Klasse des nächsten Nachbarn unter den Gleichauf liegenden. */
function mehrheit(nachbarn: number[], klassen: readonly string[]): { klasse: string; stimmen: Map<string, number> } {
  const stimmen = new Map<string, number>();
  for (const i of nachbarn) stimmen.set(klassen[i], (stimmen.get(klassen[i]) ?? 0) + 1);
  const max = Math.max(...stimmen.values());
  const klasse = klassen[nachbarn.find((i) => stimmen.get(klassen[i]) === max)!];
  return { klasse, stimmen };
}

export const knn = vorlage({
  id: 'knn',
  titel: 'k-NN: neuen Fall klassifizieren',
  bereich: 'CRISP-DM / ML',
  beschreibung: 'Euklidische Abstände des neuen Falls zu allen Trainingsfällen, die k nächsten Nachbarn und der Mehrheitsentscheid.',
  schema: knnSchema,
  hinweise: [
    'Abstand = √((x − xN)² + (y − yN)²) – zu **jedem** Trainingsfall.',
    'Zum Sortieren reichen die quadrierten Abstände.',
    'Nur die k nächsten Nachbarn stimmen ab; die häufigste Klasse unter ihnen ist die Vorhersage.',
  ],
  erzeuge(z, params, vorbild) {
    const namen = vorbild ? klassenVon(vorbild.klassen) : ['ja', 'nein'];
    const n = intParam(params, 'n', vorbild?.punkte.length ?? 6, Math.max(3, namen.length), 20);
    const k = Math.min(intParam(params, 'k', vorbild?.k ?? 3, 1, 15), n - 1);
    for (let versuch = 0; ; versuch++) {
      // Je Klasse ein Schwerpunkt, die Punkte streuen darum; der neue Fall liegt in der Mitte zwischen den Gruppen.
      const kerne = namen.map(() => [z.ganz(1, 8), z.ganz(1, 8)]);
      const klassen = z.mische(Array.from({ length: n }, (_, i) => namen[i % namen.length]));
      const punkte = klassen.map((c) => {
        const m = kerne[namen.indexOf(c)];
        return [Math.max(0, m[0] + z.ganz(-2, 2)), Math.max(0, m[1] + z.ganz(-2, 2))] as [number, number];
      });
      const neu: [number, number] = [z.ganz(2, 7), z.ganz(2, 7)];
      const q = punkte.map((p) => (p[0] - neu[0]) ** 2 + (p[1] - neu[1]) ** 2);
      // Keine gleichen Abstände (eindeutige Rangfolge), kein Punkt auf dem neuen Fall, kein Stimmengleichstand.
      const eindeutig = new Set(q).size === q.length && !q.includes(0);
      const nachbarn = nachAbstand(q)
        .slice(0, k)
        .map((x) => x.i);
      const stimmen = [...mehrheit(nachbarn, klassen).stimmen.values()].sort((a, b) => b - a);
      const klar = stimmen.length === 1 || stimmen[0] > stimmen[1];
      if ((eindeutig && klar) || versuch > 300) return { punkte, klassen, neu, k };
    }
  },
  platzhalter: (d) => ({
    punkte: d.punkte.map((p, i) => `P${i + 1}(${fz(p[0])}|${fz(p[1])}) ${d.klassen[i]}`).join(' · '),
    neu: `N(${fz(d.neu[0])}|${fz(d.neu[1])})`,
    k: String(d.k),
    n: String(d.punkte.length),
    klassen: klassenVon(d.klassen).join('/'),
  }),
  tabelle: (d) => ({
    kopf: ['Fall', 'x', 'y', 'Klasse'],
    zeilen: [...d.punkte.map((p, i) => [`P${i + 1}`, fz(p[0]), fz(p[1]), d.klassen[i]]), ['neuer Fall N', fz(d.neu[0]), fz(d.neu[1]), '?']],
  }),
  loese(d) {
    const b = new LoesungsBau();
    const ds = d.punkte.map((p, i) => {
      const wert = b.wert(`abstand${i + 1}`, abstand(p, d.neu), { label: `Abstand P${i + 1} zu N`, runden: 2 });
      b.fehler(
        `abstand${i + 1}`,
        wert * wert,
        'Das ist der **quadrierte** Abstand – zum Sortieren reicht er, gefragt ist aber die Wurzel.',
      );
      b.fehler(`abstand${i + 1}`, manhattan(p, d.neu), 'Das ist der Manhattan-Abstand – gefragt ist der euklidische: √(Δx² + Δy²).');
      b.schritt({
        titel: `P${i + 1}(${fz(p[0])}|${fz(p[1])}) – ${d.klassen[i]}`,
        formel: F.euklid.latex,
        einsetzen: L`\sqrt{(${lz(p[0])} - ${lzk(d.neu[0])})^2 + (${lz(p[1])} - ${lzk(d.neu[1])})^2}`,
        ergebnis: wert,
        runden: 2,
      });
      return wert;
    });

    const rang = nachAbstand(ds);
    const nachbarn = rang.slice(0, d.k).map((x) => x.i);
    const name = (i: number) => `P${i + 1}`;
    b.wert('nachbarn', nachbarn.map(name).join(', '), { label: `Die ${d.k} nächsten Nachbarn`, vergleich: 'menge' });
    const mitManhattan = nachAbstand(d.punkte.map((p) => manhattan(p, d.neu)))
      .slice(0, d.k)
      .map((x) => x.i);
    if ([...mitManhattan].sort().join() !== [...nachbarn].sort().join()) {
      b.fehler(
        'nachbarn',
        mitManhattan.map(name).join(', '),
        'Diese Auswahl ergibt der Manhattan-Abstand – sortiere nach dem euklidischen.',
      );
    }
    const grenzeGleich = d.k < rang.length && Math.abs(rang[d.k].d - rang[d.k - 1].d) < 1e-9;
    b.schritt({
      titel: `Die ${d.k} nächsten Nachbarn`,
      formel: tx('Abstände aufsteigend sortieren, die ersten k nehmen'),
      einsetzen: tx(
        rang
          .slice(0, Math.min(rang.length, d.k + 1))
          .map((x) => `${name(x.i)} (${fz(x.d, 2)})`)
          .join(' < '),
      ),
      ergebnis: d.k,
      einheit: d.k === 1 ? 'Nachbar' : 'Nachbarn',
      hinweis: grenzeGleich
        ? `Gleicher Abstand an der Grenze – hier zählt der Fall mit der kleineren Nummer (${nachbarn.map(name).join(', ')}).`
        : `Nächste Nachbarn: ${nachbarn.map(name).join(', ')}.`,
    });

    const { klasse: vorhersage, stimmen } = mehrheit(nachbarn, d.klassen);
    for (const c of klassenVon(d.klassen)) {
      b.wert(`stimmen_${c.replace(/[^\p{L}\p{N}]+/gu, '_')}`, stimmen.get(c) ?? 0, { label: `Stimmen für „${c}“`, zusatz: true });
    }
    b.wert('klasse', vorhersage, { label: 'Vorhergesagte Klasse' });
    const werte = [...stimmen.values()].sort((a, c) => c - a);
    b.schritt({
      titel: 'Mehrheitsentscheid',
      formel: tx('häufigste Klasse unter den k Nachbarn'),
      einsetzen: tx([...stimmen].map(([c, s]) => `${c}: ${s}`).join(', ')),
      ergebnis: stimmen.get(vorhersage)!,
      einheit: 'Stimmen',
      hinweis:
        werte.length > 1 && werte[0] === werte[1]
          ? `Gleichstand – es entscheidet der nächste Nachbar: ${vorhersage}.`
          : `Vorhersage: ${vorhersage}.`,
    });

    const einNachbar = d.klassen[rang[0].i];
    if (d.k > 1 && einNachbar !== vorhersage) {
      b.fehler('klasse', einNachbar, `Das sagt nur der **nächste** Nachbar (k = 1) – abstimmen dürfen alle k = ${d.k} Nachbarn.`);
    }
    const gesamt = mehrheit(
      rang.map((x) => x.i),
      d.klassen,
    ).klasse;
    if (gesamt !== vorhersage) {
      b.fehler('klasse', gesamt, 'Das ist die Mehrheit **aller** Trainingsfälle – abstimmen dürfen nur die k nächsten Nachbarn.');
    }
    for (const c of klassenVon(d.klassen)) {
      if (c !== vorhersage) b.fehler('klasse', c, 'Zähle die Klassen der k nächsten Nachbarn aus – die Mehrheit entscheidet.');
    }
    return b.fertig();
  },
});

// ---------- ID3 ----------

const wert = z.string().trim().min(1);
const id3Schema = z
  .object({
    merkmale: z.array(wert).min(1).max(5),
    /** Name der Zielklasse, z. B. „Reklamation“. */
    ziel: wert.optional(),
    /** Je Zeile die Werte der Merkmale, als letzter Eintrag die Klasse. */
    zeilen: z.array(z.array(wert)).min(4).max(24),
  })
  .refine((d) => d.zeilen.every((r) => r.length === d.merkmale.length + 1), {
    message: 'jede Zeile braucht je Merkmal einen Wert und am Ende die Klasse',
  })
  .refine((d) => new Set(d.merkmale).size === d.merkmale.length, { message: 'Merkmalsnamen doppelt' })
  .refine((d) => new Set(d.zeilen.map((r) => r[r.length - 1])).size >= 2, { message: 'mindestens zwei Klassen' });

type Id3Daten = z.infer<typeof id3Schema>;

/** Das Beispiel aus Deep Dive 6, Teil 7.4 – Form für „Neue Zahlen“ ohne feste Daten. */
const ID3_BEISPIEL: Id3Daten = {
  merkmale: ['Spediteur', 'Lieferdauer', 'Verpackung'],
  ziel: 'Reklamation',
  zeilen: [
    ['Nordtrans', 'lang', 'Standard', 'ja'],
    ['Nordtrans', 'lang', 'Spezial', 'ja'],
    ['Nordtrans', 'lang', 'Standard', 'ja'],
    ['Nordtrans', 'kurz', 'Spezial', 'nein'],
    ['Rheinlogistik', 'kurz', 'Spezial', 'ja'],
    ['Rheinlogistik', 'lang', 'Standard', 'nein'],
    ['Rheinlogistik', 'kurz', 'Standard', 'nein'],
    ['Eigenlieferung', 'kurz', 'Standard', 'nein'],
    ['Eigenlieferung', 'lang', 'Spezial', 'nein'],
    ['Eigenlieferung', 'kurz', 'Standard', 'nein'],
  ],
};

/** Ausprägungen einer Spalte in der Reihenfolge ihres ersten Vorkommens. */
const auspraegungen = (zeilen: readonly string[][], spalte: number) => [...new Set(zeilen.map((r) => r[spalte]))];

/** Anzahl je Klasse (Reihenfolge wie `klassen`). */
const zaehle = (zeilen: readonly string[][], klassen: readonly string[]) =>
  klassen.map((c) => zeilen.filter((r) => r[r.length - 1] === c).length);

/** Entropie mit Logarithmus zur Basis `basis` (2 richtig; e und 10 für Fehlerbilder). */
function entropie(anzahlen: readonly number[], basis = 2): number {
  const n = anzahlen.reduce((s, x) => s + x, 0);
  return anzahlen.reduce((h, x) => (x === 0 ? h : h - (x / n) * (Math.log(x / n) / Math.log(basis))), 0);
}

/** −a/n · log₂ a/n − … für den Rechenweg (Klassen ohne Fall fallen weg). */
const entropieLatex = (anzahlen: readonly number[]) => {
  const n = anzahlen.reduce((s, x) => s + x, 0);
  return anzahlen
    .filter((x) => x > 0)
    .map((x) => L`- \frac{${x}}{${n}} \log_2 \frac{${x}}{${n}}`)
    .join(' ');
};

interface MerkmalsAuswertung {
  teile: { wert: string; anzahl: number; anzahlen: number[]; h: number }[];
  rest: number;
  gewinn: number;
}

function werteMerkmalAus(zeilen: readonly string[][], spalte: number, klassen: readonly string[], hGesamt: number): MerkmalsAuswertung {
  const teile = auspraegungen(zeilen, spalte).map((w) => {
    const teil = zeilen.filter((r) => r[spalte] === w);
    const anzahlen = zaehle(teil, klassen);
    return { wert: w, anzahl: teil.length, anzahlen, h: entropie(anzahlen) };
  });
  const rest = teile.reduce((s, t) => s + (t.anzahl / zeilen.length) * t.h, 0);
  return { teile, rest, gewinn: hGesamt - rest };
}

function erzeugeId3(z: Zufall, vorbild: Id3Daten): Id3Daten {
  const m = vorbild.merkmale.length;
  const domaenen = vorbild.merkmale.map((_, j) => auspraegungen(vorbild.zeilen, j));
  const klassen = auspraegungen(vorbild.zeilen, m);
  const n = vorbild.zeilen.length;
  let letzte: Id3Daten = vorbild;
  for (let versuch = 0; versuch < 400; versuch++) {
    // Ein Merkmal bestimmt die Klasse überwiegend (je Ausprägung eine bevorzugte Klasse), der Rest ist Rauschen.
    const haupt = z.ganz(0, m - 1);
    const bevorzugt = new Map(domaenen[haupt].map((w) => [w, z.wahl(klassen)]));
    const zeilen = Array.from({ length: n }, () => {
      const werte = domaenen.map((d) => z.wahl(d));
      const c = z.ja(0.75) ? bevorzugt.get(werte[haupt])! : z.wahl(klassen);
      return [...werte, c];
    });
    letzte = { ...vorbild, zeilen };
    // Jede Ausprägung und jede Klasse kommt vor; der größte Informationsgewinn ist eindeutig (Abstand ≥ 0,01).
    const vollstaendig =
      domaenen.every((d, j) => auspraegungen(zeilen, j).length === d.length) && auspraegungen(zeilen, m).length === klassen.length;
    if (!vollstaendig) continue;
    const h = entropie(zaehle(zeilen, klassen));
    const gewinne = domaenen.map((_, j) => werteMerkmalAus(zeilen, j, klassen, h).gewinn).sort((a, b) => b - a);
    if (gewinne[0] > 0.05 && (gewinne.length === 1 || gewinne[0] - gewinne[1] >= 0.01)) return letzte;
  }
  return letzte;
}

export const id3 = vorlage({
  id: 'id3',
  titel: 'ID3: Entropie und Informationsgewinn',
  bereich: 'CRISP-DM / ML',
  beschreibung: 'Entropie der Gesamtmenge, Informationsgewinn je Merkmal und das Merkmal für die Wurzel des Entscheidungsbaums.',
  schema: id3Schema,
  hinweise: [
    'Entropie H = −Σ pᵢ · log₂ pᵢ; log₂ x = ln x / ln 2. Reine Menge: H = 0, halbe-halbe: H = 1.',
    'Rest-Entropie eines Merkmals: Entropie jeder Teilmenge, gewichtet mit ihrem Anteil |Sᵥ| / |S|.',
    'Informationsgewinn = H(S) − Rest-Entropie. Die Wurzel ist das Merkmal mit dem **größten** Gewinn.',
  ],
  erzeuge: (z, _params, vorbild) => erzeugeId3(z, vorbild ?? ID3_BEISPIEL),
  platzhalter: (d) => ({
    n: String(d.zeilen.length),
    ziel: d.ziel ?? 'Klasse',
    merkmale: d.merkmale.join(', '),
    klassen: auspraegungen(d.zeilen, d.merkmale.length).join('/'),
  }),
  tabelle: (d) => ({
    kopf: ['Nr', ...d.merkmale, d.ziel ?? 'Klasse'],
    zeilen: d.zeilen.map((r, i) => [String(i + 1), ...r]),
  }),
  loese(d) {
    const b = new LoesungsBau();
    const m = d.merkmale.length;
    const klassen = auspraegungen(d.zeilen, m);
    const n = d.zeilen.length;
    const anzahlen = zaehle(d.zeilen, klassen);
    const verteilung = (xs: readonly number[]) => klassen.map((c, i) => `${xs[i]} × ${c}`).join(', ');

    const h = b.wert('entropie', entropie(anzahlen), { label: 'Entropie der Gesamtmenge H(S)', runden: 3 });
    b.fehler('entropie', entropie(anzahlen, Math.E), 'Du hast mit ln statt log₂ gerechnet – log₂ x = ln x / ln 2.');
    b.fehler('entropie', entropie(anzahlen, 10), 'Du hast mit lg (log₁₀) statt log₂ gerechnet – log₂ x = lg x / lg 2.');
    b.schritt({
      titel: 'Entropie der Gesamtmenge',
      formel: F.entropie.latex,
      einsetzen: entropieLatex(anzahlen),
      ergebnis: h,
      runden: 3,
      hinweis: `Verteilung: ${verteilung(anzahlen)}.`,
    });

    const gewinne = d.merkmale.map((name, j) => {
      const nr = j + 1;
      const a = werteMerkmalAus(d.zeilen, j, klassen, h);
      a.teile.forEach((t, v) => {
        b.wert(`entropie${nr}_${v + 1}`, t.h, { label: `H(${name} = ${t.wert})`, runden: 3, zusatz: true });
        b.schritt({
          titel: `${name} = ${t.wert}`,
          formel: L`H(S_v)`,
          einsetzen: t.anzahlen.filter((x) => x > 0).length < 2 ? tx('nur eine Klasse – rein') : entropieLatex(t.anzahlen),
          ergebnis: t.h,
          runden: 3,
          hinweis: `${t.anzahl} Fälle: ${verteilung(t.anzahlen)}.`,
        });
      });
      const rest = b.wert(`rest${nr}`, a.rest, { label: `Rest-Entropie nach ${name}`, runden: 3, zusatz: true });
      b.schritt({
        titel: `Rest-Entropie nach ${name}`,
        formel: L`\sum_v \frac{|S_v|}{|S|} \cdot H(S_v)`,
        einsetzen: a.teile.map((t) => L`\frac{${t.anzahl}}{${n}} \cdot ${lz(t.h, 3)}`).join(' + '),
        ergebnis: rest,
        runden: 3,
      });
      const g = b.wert(`gewinn${nr}`, a.gewinn, { label: `Informationsgewinn ${name}`, runden: 3 });
      b.schritt({
        titel: `Informationsgewinn ${name}`,
        formel: F.informationsgewinn.latex,
        einsetzen: L`${lz(h, 3)} - ${lz(rest, 3)}`,
        ergebnis: g,
        runden: 3,
      });
      b.fehler(`gewinn${nr}`, rest, 'Das ist die Rest-Entropie – der Gewinn ist H(S) **minus** Rest-Entropie.');
      const ungewichtet = a.teile.reduce((s, t) => s + t.h, 0) / a.teile.length;
      b.fehler(`gewinn${nr}`, h - ungewichtet, 'Die Teilentropien werden mit ihrem Anteil |Sᵥ| / |S| gewichtet, nicht einfach gemittelt.');
      b.fehler(`gewinn${nr}`, g * Math.LN2, 'Du hast mit ln statt log₂ gerechnet – log₂ x = ln x / ln 2.');
      return g;
    });

    const best = gewinne.indexOf(Math.max(...gewinne));
    b.wert('wurzel', d.merkmale[best], { label: 'Merkmal für die Wurzel' });
    b.schritt({
      titel: 'Wurzel des Baums',
      formel: tx('Merkmal mit dem größten Informationsgewinn'),
      einsetzen: tx(d.merkmale.map((name, j) => `${name}: ${fz(gewinne[j], 3)}`).join(' · ')),
      ergebnis: gewinne[best],
      runden: 3,
      hinweis: `Wurzel: ${d.merkmale[best]}.`,
    });
    const schlechtestes = gewinne.indexOf(Math.min(...gewinne));
    d.merkmale.forEach((name, j) => {
      if (j === best) return;
      b.fehler(
        'wurzel',
        name,
        j === schlechtestes
          ? 'Das ist das Merkmal mit dem **kleinsten** Informationsgewinn – gewählt wird das mit dem größten.'
          : 'Vergleiche die Informationsgewinne – die Wurzel ist das Merkmal mit dem **größten**.',
      );
    });
    return b.fertig();
  },
});
