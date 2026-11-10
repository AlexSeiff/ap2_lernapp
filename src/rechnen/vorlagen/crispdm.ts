// CRISP-DM / Machine Learning (Deep Dive 6): Assoziationsregeln (Support, Konfidenz, Lift) und
// die erste k-Means-Iteration (euklidische Abstände, Zuordnung, neue Zentren).

import { z } from 'zod';
import { fz, intParam, L, LoesungsBau, lz, lzk, median, mittel, tx, vorlage } from '../hilfen.ts';
import { F } from '../formeln.ts';

const artikel = z.string().trim().min(1);
const assoSchema = z
  .object({
    transaktionen: z.array(z.array(artikel).min(1)).min(2).max(40),
    wenn: z.array(artikel).min(1),
    dann: z.array(artikel).min(1),
  })
  .refine((d) => d.transaktionen.some((t) => d.wenn.every((a) => t.includes(a))), {
    message: 'der Wenn-Teil kommt in keiner Transaktion vor',
  })
  .refine((d) => d.transaktionen.some((t) => d.dann.every((a) => t.includes(a))), {
    message: 'der Dann-Teil kommt in keiner Transaktion vor',
  });

/** ID-Teil für einen Artikel: „Schreibtisch“ → „Schreibtisch“, „Lampe XL“ → „Lampe_XL“. */
export const artikelId = (a: string) => a.replace(/[^\p{L}\p{N}]+/gu, '_');

export const assoziation = vorlage({
  id: 'assoziation',
  titel: 'Assoziationsregel: Support, Konfidenz, Lift',
  bereich: 'CRISP-DM / ML',
  beschreibung: 'Support der Einzelartikel und für eine Regel Wenn → Dann: Support, Konfidenz und Lift.',
  schema: assoSchema,
  hinweise: [
    'Support(X) = Anzahl Transaktionen mit X / Gesamtzahl.',
    'Konfidenz(X → Y) = Support(X und Y) / Support(X) – geteilt wird durch den **Wenn**-Teil.',
    'Lift = Konfidenz / Support(Y). Über 1: positiver Zusammenhang, unter 1: negativer.',
  ],
  erzeuge(z, params, vorbild) {
    const alle = vorbild ? [...new Set(vorbild.transaktionen.flat())] : ['S', 'B', 'M', 'L'];
    const n = intParam(params, 'n', vorbild?.transaktionen.length ?? 10, 4, 40);
    const w = vorbild?.wenn ?? [alle[0]];
    const d = vorbild?.dann ?? [alle[1]];
    for (let versuch = 0; ; versuch++) {
      const transaktionen = Array.from({ length: n }, () =>
        z.stichprobe(alle, z.ganz(1, Math.min(3, alle.length))).sort((a, b) => alle.indexOf(a) - alle.indexOf(b)),
      );
      const mit = (xs: string[]) => transaktionen.filter((t) => xs.every((a) => t.includes(a))).length;
      const beide = mit([...w, ...d]);
      // Jeder Artikel kommt mindestens einmal vor, damit z. B. „Support(L)“ auch bei neuen Zahlen gefragt werden kann.
      const vollstaendig = alle.every((a) => mit([a]) > 0);
      if ((beide > 0 && mit(w) < n && mit(d) < n && vollstaendig) || versuch > 200) {
        if (beide === 0) transaktionen[0] = [...new Set([...w, ...d])];
        return { transaktionen, wenn: w, dann: d };
      }
    }
  },
  platzhalter: (d) => ({
    wenn: d.wenn.join(', '),
    dann: d.dann.join(', '),
    n: String(d.transaktionen.length),
    regel: `${d.wenn.join(', ')} → ${d.dann.join(', ')}`,
  }),
  tabelle: (d) => ({ kopf: d.transaktionen.map((_, i) => `T${i + 1}`), zeilen: [d.transaktionen.map((t) => t.join(', '))] }),
  loese(d) {
    const b = new LoesungsBau();
    const n = d.transaktionen.length;
    const mit = (xs: string[]) => d.transaktionen.filter((t) => xs.every((a) => t.includes(a))).length;
    const alle = [...new Set(d.transaktionen.flat())];
    for (const a of alle) {
      const s = b.wert(`support_${artikelId(a)}`, (mit([a]) / n) * 100, { label: `Support(${a})`, einheit: '%', runden: 2, zusatz: true });
      b.schritt({
        titel: `Support(${a})`,
        formel: L`\frac{\text{Anzahl mit } X}{n}`,
        einsetzen: L`\frac{${mit([a])}}{${n}}`,
        ergebnis: s,
        einheit: '%',
        runden: 2,
      });
    }
    const wenn = d.wenn.join(', ');
    const dann = d.dann.join(', ');
    const nW = mit(d.wenn);
    const nD = mit(d.dann);
    const nWD = mit([...d.wenn, ...d.dann]);
    b.wert('anzahlGemeinsam', nWD, { label: `Transaktionen mit ${wenn} und ${dann}`, zusatz: true });
    const sW = b.wert('supportWenn', (nW / n) * 100, { label: `Support(${wenn})`, einheit: '%', runden: 2, zusatz: true });
    const sD = b.wert('supportDann', (nD / n) * 100, { label: `Support(${dann})`, einheit: '%', runden: 2, zusatz: true });
    const sup = b.wert('support', (nWD / n) * 100, { label: `Support(${wenn} → ${dann})`, einheit: '%', runden: 2 });
    const konf = b.wert('konfidenz', (sup / sW) * 100, { label: `Konfidenz(${wenn} → ${dann})`, einheit: '%', runden: 2 });
    const lift = b.wert('lift', konf / sD, { label: `Lift(${wenn} → ${dann})`, runden: 2 });
    b.schritt({
      titel: `Support(${wenn} → ${dann})`,
      formel: F.support.latex,
      einsetzen: L`\frac{${nWD}}{${n}}`,
      ergebnis: sup,
      einheit: '%',
      runden: 2,
    });
    b.schritt({
      titel: 'Konfidenz',
      formel: F.konfidenz.latex,
      einsetzen: L`\frac{${lz(sup / 100, 4)}}{${lz(sW / 100, 4)}}`,
      ergebnis: konf,
      einheit: '%',
      runden: 2,
    });
    b.schritt({
      titel: 'Lift',
      formel: F.lift.latex,
      einsetzen: L`\frac{${lz(konf / 100, 4)}}{${lz(sD / 100, 4)}}`,
      ergebnis: lift,
      runden: 2,
      hinweis:
        lift > 1
          ? 'Lift > 1: häufiger zusammen gekauft als bei Unabhängigkeit.'
          : lift < 1
            ? 'Lift < 1: seltener zusammen als bei Unabhängigkeit.'
            : 'Lift = 1: unabhängig.',
    });
    b.fehler('konfidenz', sup, 'Du hast durch die Gesamtzahl geteilt – die Konfidenz teilt durch den Support des **Wenn**-Teils.');
    b.fehler(
      'konfidenz',
      (sup / sD) * 100,
      'Du hast durch den Support des Dann-Teils geteilt – das wäre die Konfidenz der umgekehrten Regel.',
    );
    b.fehler('lift', konf / sW, 'Der Lift teilt die Konfidenz durch den Support des **Dann**-Teils.');
    b.fehler('lift', konf, 'Das ist die Konfidenz (als Anteil) – Lift = Konfidenz / Support(Dann).');
    b.fehler('support', sW, 'Das ist der Support des Wenn-Teils allein – gefragt sind Transaktionen mit **beiden** Teilen.');
    return b.fertig();
  },
});

const punkt = z.tuple([z.number().finite(), z.number().finite()]);
const kmeansSchema = z.object({ punkte: z.array(punkt).min(2).max(20), zentren: z.array(punkt).min(2).max(5) });

const abstand = (p: readonly number[], c: readonly number[]) => Math.hypot(p[0] - c[0], p[1] - c[1]);

export const kmeans = vorlage({
  id: 'kmeans',
  titel: 'k-Means: erste Iteration',
  bereich: 'CRISP-DM / ML',
  beschreibung: 'Euklidische Abstände jedes Punkts zu jedem Startzentrum, Zuordnung zum nächsten Zentrum und neue Zentren (Mittelwerte).',
  schema: kmeansSchema,
  hinweise: [
    'Abstand = √((x − xZ)² + (y − yZ)²).',
    'Jeder Punkt gehört zum **nächsten** Zentrum.',
    'Neues Zentrum = arithmetisches Mittel der x- und y-Werte seiner Punkte (nicht der Median).',
  ],
  erzeuge(z, params, vorbild) {
    const k = vorbild?.zentren.length ?? 2;
    const n = intParam(params, 'n', vorbild?.punkte.length ?? 6, k, 20);
    for (let versuch = 0; ; versuch++) {
      const kerne = Array.from({ length: k }, (_, j) => [2 + j * 5 + z.ganz(0, 1), 2 + j * 5 + z.ganz(0, 1)]);
      const punkte = Array.from({ length: n }, (_, i) => {
        const c = kerne[i % k];
        return [c[0] + z.ganz(-2, 2), c[1] + z.ganz(-2, 2)] as [number, number];
      });
      const zentren = Array.from({ length: k }, (_, j) => [3 + j * 2 + z.ganz(0, 2), 3 + j * 2 + z.ganz(0, 2)] as [number, number]);
      // Ohne Gleichstand beim nächsten Zentrum und ohne leeres Cluster.
      const zuordnung = punkte.map((p) => zentren.map((c) => abstand(p, c)));
      const eindeutig = zuordnung.every((ds) => ds.filter((x) => Math.abs(x - Math.min(...ds)) < 1e-9).length === 1);
      const belegt = zentren.every((_, j) => zuordnung.some((ds) => ds.indexOf(Math.min(...ds)) === j));
      if ((eindeutig && belegt) || versuch > 200) return { punkte: z.mische(punkte), zentren };
    }
  },
  platzhalter: (d) => ({
    punkte: d.punkte.map((p, i) => `P${i + 1}(${fz(p[0])}|${fz(p[1])})`).join(', '),
    zentren: d.zentren.map((c, j) => `Z${j + 1}(${fz(c[0])}|${fz(c[1])})`).join(' und '),
    k: String(d.zentren.length),
  }),
  tabelle: (d) => ({
    kopf: ['Punkt', 'x', 'y'],
    zeilen: [
      ...d.punkte.map((p, i) => [`P${i + 1}`, fz(p[0]), fz(p[1])]),
      ...d.zentren.map((c, j) => [`Startzentrum Z${j + 1}`, fz(c[0]), fz(c[1])]),
    ],
  }),
  loese(d) {
    const b = new LoesungsBau();
    const k = d.zentren.length;
    const cluster: number[] = [];
    const zeilen: { label: string; ids: string[] }[] = [];
    d.punkte.forEach((p, i) => {
      const ds = d.zentren.map((c, j) => {
        const wert = b.wert(`abstand${i + 1}_${j + 1}`, abstand(p, c), { label: `Abstand P${i + 1} zu Z${j + 1}`, runden: 2 });
        b.fehler(
          `abstand${i + 1}_${j + 1}`,
          wert * wert,
          'Das ist der **quadrierte** Abstand – für die Zuordnung reicht er, gefragt ist aber die Wurzel.',
        );
        b.fehler(
          `abstand${i + 1}_${j + 1}`,
          Math.abs(p[0] - c[0]) + Math.abs(p[1] - c[1]),
          'Das ist der Manhattan-Abstand – gefragt ist der euklidische: √(Δx² + Δy²).',
        );
        return wert;
      });
      const naechster = ds.indexOf(Math.min(...ds));
      cluster.push(naechster);
      b.wert(`cluster${i + 1}`, naechster + 1, { label: `Cluster von P${i + 1} (Nummer des Zentrums)` });
      if (k === 2) b.fehler(`cluster${i + 1}`, 2 - naechster, 'Der Punkt gehört zum Zentrum mit dem **kleineren** Abstand.');
      zeilen.push({
        label: `P${i + 1}(${fz(p[0])}|${fz(p[1])})`,
        ids: [...d.zentren.map((_, j) => `abstand${i + 1}_${j + 1}`), `cluster${i + 1}`],
      });
      b.schritt({
        titel: `P${i + 1}(${fz(p[0])}|${fz(p[1])})`,
        formel: F.euklid.latex,
        einsetzen: d.zentren
          .map((c, j) => L`d_{Z${j + 1}} = \sqrt{(${lz(p[0])} - ${lzk(c[0])})^2 + (${lz(p[1])} - ${lzk(c[1])})^2} = ${lz(ds[j], 2)}`)
          .join(L`;\quad `),
        ergebnis: ds[naechster],
        runden: 2,
        hinweis: `Kleinster Abstand → Cluster Z${naechster + 1}.`,
      });
    });
    d.zentren.forEach((c, j) => {
      const mitglieder = d.punkte.filter((_, i) => cluster[i] === j);
      const leer = mitglieder.length === 0;
      const xs = mitglieder.map((p) => p[0]);
      const ys = mitglieder.map((p) => p[1]);
      const nx = b.wert(`zentrum${j + 1}x`, leer ? c[0] : mittel(xs), { label: `neues Z${j + 1}: x`, runden: 2 });
      const ny = b.wert(`zentrum${j + 1}y`, leer ? c[1] : mittel(ys), { label: `neues Z${j + 1}: y`, runden: 2 });
      b.schritt({
        titel: `Neues Zentrum Z${j + 1}`,
        formel: L`\left(\frac{\sum x}{n_${j + 1}} \,\middle|\, \frac{\sum y}{n_${j + 1}}\right)`,
        einsetzen: leer
          ? tx('kein Punkt – Zentrum bleibt')
          : L`\left(\frac{${xs.map((x) => lzk(x)).join(' + ')}}{${xs.length}} \,\middle|\, \frac{${ys.map((y) => lzk(y)).join(' + ')}}{${ys.length}}\right)`,
        ergebnis: nx,
        runden: 2,
        hinweis: `Neues Zentrum Z${j + 1}(${fz(nx, 2)} | ${fz(ny, 2)}).`,
      });
      if (!leer) {
        b.fehler(`zentrum${j + 1}x`, median(xs), 'Das ist der Median – das neue Zentrum ist das arithmetische **Mittel**.');
        b.fehler(`zentrum${j + 1}y`, median(ys), 'Das ist der Median – das neue Zentrum ist das arithmetische **Mittel**.');
        b.fehler(`zentrum${j + 1}x`, c[0], 'Das ist noch das alte Zentrum – berechne den Mittelwert der zugeordneten Punkte.');
        b.fehler(`zentrum${j + 1}y`, c[1], 'Das ist noch das alte Zentrum – berechne den Mittelwert der zugeordneten Punkte.');
      }
    });
    return b.fertig({ spalten: [...d.zentren.map((_, j) => `Abstand zu Z${j + 1}`), 'Cluster'], zeilen });
  },
});
