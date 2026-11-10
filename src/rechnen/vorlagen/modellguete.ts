// Modellgüte (Deep Dive 7): Konfusionsmatrix mit Accuracy, Precision, Recall, F1, Spezifität, trivialem Modell und
// Fehlerkosten; Regressionsgüte mit MAE, MSE, RMSE und R².

import { z } from 'zod';
import { fz, fzListe, intParam, L, LoesungsBau, lz, lzk, mittel, summe, vorlage } from '../hilfen.ts';
import { F } from '../formeln.ts';

const anzahl = z.number().int().nonnegative();
const kmSchema = z
  .object({
    tp: anzahl,
    fp: anzahl,
    fn: anzahl,
    tn: anzahl,
    kostenFN: z.number().nonnegative().optional(),
    kostenFP: z.number().nonnegative().optional(),
    positiv: z.string().trim().min(1).optional(),
  })
  .refine((d) => d.tp + d.fn > 0 && d.fp + d.tn > 0 && d.tp + d.fp > 0, {
    message: 'jede Klasse und jede Vorhersage braucht mindestens einen Fall',
  });

const pct = (x: number) => x * 100;

export const konfusionsmatrix = vorlage({
  id: 'konfusionsmatrix',
  titel: 'Konfusionsmatrix: Accuracy, Precision, Recall, F1, Spezifität',
  bereich: 'Modellgüte',
  beschreibung: 'Gütemaße aus TP, FP, FN, TN, dazu das triviale Modell („immer negativ“) und optional die Fehlerkosten.',
  schema: kmSchema,
  hinweise: [
    'Accuracy = (TP + TN) / n. Precision = TP / (TP + FP) – „Wie oft stimmt ein Alarm?“',
    'Recall = TP / (TP + FN) – „Wie viele echte Fälle findet das Modell?“ Spezifität = TN / (TN + FP).',
    'F1 = 2 · P · R / (P + R) – das **harmonische** Mittel, nicht (P + R) / 2.',
  ],
  erzeuge(z, params, vorbild) {
    const positive = intParam(params, 'positive', z.ganz(5, 20) * 10, 5, 100000);
    const negative = intParam(params, 'negative', z.ganz(8, 30) * 50, 5, 1000000);
    const tp = Math.round(positive * (0.6 + z.zahl() * 0.35));
    const tn = Math.round(negative * (0.85 + z.zahl() * 0.13));
    const mitKosten = vorbild ? vorbild.kostenFN !== undefined : params.kosten === true;
    return {
      tp,
      fn: positive - tp,
      fp: negative - tn,
      tn,
      ...(mitKosten ? { kostenFN: z.ganz(5, 20) * 10, kostenFP: z.ganz(1, 6) * 5 } : {}),
      ...(vorbild?.positiv ? { positiv: vorbild.positiv } : {}),
    };
  },
  platzhalter: (d) => ({
    tp: fz(d.tp),
    fp: fz(d.fp),
    fn: fz(d.fn),
    tn: fz(d.tn),
    n: fz(d.tp + d.fp + d.fn + d.tn),
    positive: fz(d.tp + d.fn),
    kostenFN: d.kostenFN === undefined ? '–' : fz(d.kostenFN),
    kostenFP: d.kostenFP === undefined ? '–' : fz(d.kostenFP),
    positiv: d.positiv ?? 'positiv',
  }),
  tabelle: (d) => ({
    kopf: ['', `Vorhersage: ${d.positiv ?? 'positiv'}`, `Vorhersage: nicht ${d.positiv ?? 'positiv'}`],
    zeilen: [
      [`Tatsächlich ${d.positiv ?? 'positiv'}`, `TP = ${fz(d.tp)}`, `FN = ${fz(d.fn)}`],
      [`Tatsächlich nicht ${d.positiv ?? 'positiv'}`, `FP = ${fz(d.fp)}`, `TN = ${fz(d.tn)}`],
    ],
  }),
  loese(d) {
    const b = new LoesungsBau();
    const n = b.wert('n', d.tp + d.fp + d.fn + d.tn, { label: 'Anzahl n', zusatz: true });
    const acc = b.wert('accuracy', pct((d.tp + d.tn) / n), { label: 'Accuracy', einheit: '%', runden: 2 });
    const prec = b.wert('precision', pct(d.tp / (d.tp + d.fp)), { label: 'Precision', einheit: '%', runden: 2 });
    const rec = b.wert('recall', pct(d.tp / (d.tp + d.fn)), { label: 'Recall (Sensitivität)', einheit: '%', runden: 2 });
    const f1 = b.wert('f1', prec + rec > 0 ? (2 * prec * rec) / (prec + rec) : 0, { label: 'F1-Maß', einheit: '%', runden: 2 });
    const spez = b.wert('spezifitaet', pct(d.tn / (d.tn + d.fp)), { label: 'Spezifität', einheit: '%', runden: 2 });
    const tAcc = b.wert('trivialAccuracy', pct((d.fp + d.tn) / n), {
      label: 'Accuracy trivial („immer negativ“)',
      einheit: '%',
      runden: 2,
      zusatz: true,
    });
    b.wert('trivialRecall', 0, { label: 'Recall trivial', einheit: '%', runden: 2, zusatz: true });

    b.schritt({
      titel: 'Accuracy',
      formel: F.accuracy.latex,
      einsetzen: L`\frac{${lz(d.tp)} + ${lz(d.tn)}}{${lz(n)}}`,
      ergebnis: acc,
      einheit: '%',
      runden: 2,
    });
    b.schritt({
      titel: 'Precision',
      formel: F.precision.latex,
      einsetzen: L`\frac{${lz(d.tp)}}{${lz(d.tp)} + ${lz(d.fp)}}`,
      ergebnis: prec,
      einheit: '%',
      runden: 2,
    });
    b.schritt({
      titel: 'Recall',
      formel: F.recall.latex,
      einsetzen: L`\frac{${lz(d.tp)}}{${lz(d.tp)} + ${lz(d.fn)}}`,
      ergebnis: rec,
      einheit: '%',
      runden: 2,
    });
    b.schritt({
      titel: 'F1-Maß',
      formel: F.f1.latex,
      einsetzen: L`\frac{2 \cdot ${lz(prec / 100, 4)} \cdot ${lz(rec / 100, 4)}}{${lz(prec / 100, 4)} + ${lz(rec / 100, 4)}}`,
      ergebnis: f1,
      einheit: '%',
      runden: 2,
      hinweis: 'Harmonisches Mittel – liegt immer näher am kleineren Wert.',
    });
    b.schritt({
      titel: 'Spezifität',
      formel: F.spezifitaet.latex,
      einsetzen: L`\frac{${lz(d.tn)}}{${lz(d.tn)} + ${lz(d.fp)}}`,
      ergebnis: spez,
      einheit: '%',
      runden: 2,
    });
    b.schritt({
      titel: 'Triviales Modell („immer negativ“)',
      formel: L`Acc = \frac{FP + TN}{n},\ Recall = \frac{0}{TP + FN}`,
      einsetzen: L`\frac{${lz(d.fp)} + ${lz(d.tn)}}{${lz(n)}}`,
      ergebnis: tAcc,
      einheit: '%',
      runden: 2,
      hinweis: 'Recall des trivialen Modells: 0 % – es findet keinen einzigen positiven Fall (Accuracy-Paradox).',
    });

    b.fehler('precision', rec, 'Precision und Recall vertauscht – Precision teilt durch alle **Vorhersagen** „positiv“ (TP + FP).');
    b.fehler('recall', prec, 'Precision und Recall vertauscht – Recall teilt durch alle **tatsächlich** positiven Fälle (TP + FN).');
    b.fehler('f1', (prec + rec) / 2, 'Das ist das arithmetische Mittel – F1 ist das **harmonische** Mittel: 2 · P · R / (P + R).');
    b.fehler('spezifitaet', pct(d.tn / (d.tn + d.fn)), 'Spezifität = TN / (TN + FP) – alle tatsächlich negativen Fälle im Nenner.');
    b.fehler('accuracy', pct(d.tp / n), 'Die richtig negativen (TN) gehören auch zu den richtigen Vorhersagen.');
    b.fehler('precision', pct(d.tp / n), 'Precision teilt nur durch die positiven Vorhersagen (TP + FP), nicht durch n.');
    b.fehler(
      'trivialAccuracy',
      pct((d.tp + d.fn) / n),
      'Das triviale Modell sagt immer „negativ“ – richtig sind alle tatsächlich negativen Fälle.',
    );

    if (d.kostenFN !== undefined && d.kostenFP !== undefined) {
      const k = b.wert('kostenModell', d.fn * d.kostenFN + d.fp * d.kostenFP, { label: 'Fehlerkosten Modell', einheit: '€', runden: 2 });
      const kt = b.wert('kostenTrivial', (d.tp + d.fn) * d.kostenFN, { label: 'Fehlerkosten triviales Modell', einheit: '€', runden: 2 });
      b.wert('ersparnis', kt - k, { label: 'Ersparnis durch das Modell', einheit: '€', runden: 2, zusatz: true });
      b.schritt({
        titel: 'Fehlerkosten',
        formel: F.fehlerkosten.latex,
        einsetzen: L`${lz(d.fn)} \cdot ${lz(d.kostenFN)} + ${lz(d.fp)} \cdot ${lz(d.kostenFP)}`,
        ergebnis: k,
        einheit: '€',
        runden: 2,
      });
      b.schritt({
        titel: 'Fehlerkosten triviales Modell',
        formel: L`K = (TP + FN) \cdot k_{FN}`,
        einsetzen: L`${lz(d.tp + d.fn)} \cdot ${lz(d.kostenFN)}`,
        ergebnis: kt,
        einheit: '€',
        runden: 2,
        hinweis: 'Keine FP – das triviale Modell schlägt nie Alarm, übersieht aber jeden echten Fall.',
      });
      b.fehler(
        'kostenModell',
        d.fn * d.kostenFP + d.fp * d.kostenFN,
        'Kostensätze vertauscht – ein übersehener Fall (FN) und ein Fehlalarm (FP) kosten unterschiedlich viel.',
      );
      b.fehler('kostenModell', d.fn * d.kostenFN, 'Die Fehlalarme (FP) kosten auch etwas.');
      b.fehler(
        'kostenTrivial',
        d.fn * d.kostenFN,
        'Das triviale Modell übersieht **alle** positiven Fälle (TP + FN), nicht nur die FN des Modells.',
      );
    }
    return b.fertig();
  },
});

const zahl = z.number().finite();
const rgSchema = z
  .object({ y: z.array(zahl).min(2).max(30), yDach: z.array(zahl).min(2).max(30), einheit: z.string().trim().min(1).optional() })
  .refine((d) => d.y.length === d.yDach.length, { message: 'y und yDach brauchen gleich viele Werte' });

export const regressionsguete = vorlage({
  id: 'regressionsguete',
  titel: 'Regressionsgüte: MAE, MSE, RMSE, R²',
  bereich: 'Modellgüte',
  beschreibung: 'Fehler e = y − ŷ, MAE, MSE, RMSE und R² = 1 − SSres / SStot.',
  schema: rgSchema,
  hinweise: [
    'Fehlertabelle: e = y − ŷ, |e| und e².',
    'MAE = Σ|e| / n. MSE = Σe² / n, RMSE = √MSE.',
    'Beim MAE den **Betrag** nehmen – sonst heben sich die Fehler auf.',
  ],
  erzeuge(z, params, vorbild) {
    const n = intParam(params, 'n', vorbild?.y.length ?? z.ganz(5, 6), 2, 30);
    const y = Array.from({ length: n }, () => z.ganz(8, 14) * 10);
    const yDach = y.map((v) => v + z.ganz(-5, 5) * 2);
    return { y, yDach, ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}) };
  },
  platzhalter: (d) => ({ y: fzListe(d.y), yDach: fzListe(d.yDach), n: String(d.y.length) }),
  tabelle: (d) => ({
    kopf: ['', ...d.y.map((_, i) => String(i + 1))],
    zeilen: [
      ['y (tatsächlich)', ...d.y.map((v) => fz(v))],
      ['ŷ (prognostiziert)', ...d.yDach.map((v) => fz(v))],
    ],
  }),
  loese(d) {
    const b = new LoesungsBau();
    const e = d.einheit;
    const n = d.y.length;
    const err = d.y.map((v, i) => v - d.yDach[i]);
    const sa = b.wert('summeBetraege', summe(err.map(Math.abs)), { label: 'Σ|e|', einheit: e, zusatz: true });
    const sq = b.wert('summeQuadrate', summe(err.map((x) => x * x)), { label: 'Σe²', zusatz: true });
    const mae = b.wert('mae', sa / n, { label: 'MAE', einheit: e, runden: 2 });
    const mse = b.wert('mse', sq / n, { label: 'MSE', runden: 2, zusatz: true });
    const rmse = b.wert('rmse', Math.sqrt(mse), { label: 'RMSE', einheit: e, runden: 2 });
    const ym = mittel(d.y);
    const sst = summe(d.y.map((v) => (v - ym) ** 2));
    const r2 = sst > 0 ? b.wert('r2', 1 - sq / sst, { label: 'R² = 1 − SSres / SStot', runden: 2, zusatz: true }) : undefined;

    b.schritt({
      titel: 'Fehler',
      formel: F.residuum.latex,
      einsetzen: err.map((x) => lz(x)).join(L`;\ `),
      ergebnis: summe(err),
      einheit: e,
      hinweis: 'Ergebnis = Summe der Fehler mit Vorzeichen – als Gütemaß unbrauchbar, weil sich Plus und Minus aufheben.',
    });
    b.schritt({
      titel: 'MAE',
      formel: F.mae.latex,
      einsetzen: L`\frac{${err.map((x) => lz(Math.abs(x))).join(' + ')}}{${n}} = \frac{${lz(sa)}}{${n}}`,
      ergebnis: mae,
      einheit: e,
      runden: 2,
    });
    b.schritt({
      titel: 'MSE',
      formel: F.mse.latex,
      einsetzen: L`\frac{${err.map((x) => L`${lzk(x)}^2`).join(' + ')}}{${n}} = \frac{${lz(sq)}}{${n}}`,
      ergebnis: mse,
      runden: 2,
    });
    b.schritt({
      titel: 'RMSE',
      formel: F.rmse.latex,
      einsetzen: L`\sqrt{${lz(mse, 2)}}`,
      ergebnis: rmse,
      einheit: e,
      runden: 2,
      hinweis: 'RMSE ≥ MAE – große Einzelfehler zählen durch das Quadrieren stärker.',
    });
    if (r2 !== undefined) {
      b.schritt({
        titel: 'R²',
        formel: F.r2Modell.latex,
        einsetzen: L`1 - \frac{${lz(sq)}}{${lz(sst, 2)}}`,
        ergebnis: r2,
        runden: 2,
      });
    }

    b.fehler('mae', Math.abs(summe(err)) / n, 'Du hast die Fehler mit Vorzeichen addiert – beim MAE zählt der **Betrag** |e|.');
    b.fehler('mae', summe(err) / n, 'Du hast die Fehler mit Vorzeichen addiert – beim MAE zählt der **Betrag** |e|.');
    b.fehler('rmse', mse, 'Das ist der MSE – für den RMSE noch die Wurzel ziehen.');
    b.fehler('rmse', Math.sqrt(sq), 'Du hast nicht durch n geteilt: RMSE = √(Σe² / n).');
    b.fehler('rmse', mae, 'Das ist der MAE – für den RMSE quadrieren, mitteln, Wurzel ziehen.');
    return b.fertig();
  },
});
