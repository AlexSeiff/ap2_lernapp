// WiSo (Deep Dive 14): Sozialversicherung (Arbeitnehmeranteil) und Nettoentgelt, Minijob-Stunden, Gleichgewichtspreis.
// Beitragssätze wie im Lernblatt (Stand 2026); eine Übung kann sie in `saetze` überschreiben.
// Die Inflationsrate rechnet die Vorlage „prozent-veraenderung“ (VPI alt → neu).

import { z } from 'zod';
import { fz, intParam, L, LoesungsBau, lz, runde, summe, vorlage, zahlParam } from '../hilfen.ts';
import { F } from '../formeln.ts';

const SAETZE = { kv: 14.6, pv: 3.6, rv: 18.6, alv: 2.6, kinderlosZuschlag: 0.6, geringverdiener: 325 };

const svSchema = z.object({
  brutto: z.number().positive(),
  zusatzbeitrag: z.number().nonnegative(),
  /** Kinderlos und mindestens 23 Jahre → Zuschlag zur Pflegeversicherung (trägt der AN allein). */
  kinderlos: z.boolean(),
  /** Auszubildende bis zur Geringverdienergrenze: Arbeitgeber trägt alles. */
  azubi: z.boolean().optional(),
  lohnsteuer: z.number().nonnegative().optional(),
  kirchensteuersatz: z.number().nonnegative().max(20).optional(),
  soli: z.number().nonnegative().optional(),
  saetze: z
    .object({
      kv: z.number().positive(),
      pv: z.number().positive(),
      rv: z.number().positive(),
      alv: z.number().positive(),
      kinderlosZuschlag: z.number().nonnegative(),
      geringverdiener: z.number().nonnegative(),
    })
    .partial()
    .optional(),
});

const cent = (x: number) => runde(x, 2);

export const sozialversicherung = vorlage({
  id: 'sozialversicherung',
  titel: 'Sozialversicherung und Nettoentgelt',
  bereich: 'WiSo',
  beschreibung:
    'Arbeitnehmeranteile zu KV, PV, RV, ALV (jeweils auf Cent gerundet), Summe; mit Lohnsteuer auch Kirchensteuer und Nettoentgelt.',
  schema: svSchema,
  hinweise: [
    'AN-Anteil: KV (14,6 % + Zusatzbeitrag) / 2, PV 1,8 %, RV 9,3 %, ALV 1,3 %.',
    'Kinderlos ab 23: + 0,6 % Pflegeversicherung (nur Arbeitnehmer).',
    'Kirchensteuer = 8 % bzw. 9 % **der Lohnsteuer**. Netto = Brutto − Steuern − SV-Anteil.',
  ],
  erzeuge(z, params, vorbild) {
    const brutto = zahlParam(params, 'brutto', z.ganz(18, 90) * 50, 1);
    const mitSteuer = vorbild ? vorbild.lohnsteuer !== undefined : z.ja(0.5);
    return {
      brutto,
      zusatzbeitrag: vorbild?.zusatzbeitrag ?? 2.9,
      kinderlos: z.ja(0.5),
      ...(vorbild?.azubi ? { azubi: true } : {}),
      ...(mitSteuer
        ? { lohnsteuer: brutto < 1300 ? 0 : runde(brutto * (0.04 + z.zahl() * 0.1), 0), kirchensteuersatz: z.wahl([0, 8, 9]) }
        : {}),
      ...(vorbild?.saetze ? { saetze: vorbild.saetze } : {}),
    };
  },
  platzhalter: (d) => ({
    brutto: fz(d.brutto, 2),
    zusatzbeitrag: fz(d.zusatzbeitrag),
    kinderlos: d.kinderlos ? 'kinderlos, über 23' : 'mit Kind',
    lohnsteuer: d.lohnsteuer === undefined ? '–' : fz(d.lohnsteuer, 2),
    kirchensteuersatz: fz(d.kirchensteuersatz ?? 0),
  }),
  loese(d) {
    const b = new LoesungsBau();
    const s = { ...SAETZE, ...d.saetze };
    const gering = !!d.azubi && d.brutto <= s.geringverdiener;
    const kvSatz = (s.kv + d.zusatzbeitrag) / 2;
    const pvSatz = s.pv / 2 + (d.kinderlos ? s.kinderlosZuschlag : 0);
    const teile = [
      { id: 'kv', label: 'Krankenversicherung', satz: kvSatz, text: L`\frac{${lz(s.kv)} + ${lz(d.zusatzbeitrag)}}{2}` },
      {
        id: 'pv',
        label: 'Pflegeversicherung',
        satz: pvSatz,
        text: d.kinderlos ? L`\frac{${lz(s.pv)}}{2} + ${lz(s.kinderlosZuschlag)}` : L`\frac{${lz(s.pv)}}{2}`,
      },
      { id: 'rv', label: 'Rentenversicherung', satz: s.rv / 2, text: L`\frac{${lz(s.rv)}}{2}` },
      { id: 'alv', label: 'Arbeitslosenversicherung', satz: s.alv / 2, text: L`\frac{${lz(s.alv)}}{2}` },
    ];
    const betraege = teile.map((t) => {
      const w = b.wert(t.id, gering ? 0 : cent((d.brutto * t.satz) / 100), { label: `AN-Anteil ${t.label}`, einheit: '€', runden: 2 });
      b.schritt({
        titel: t.label,
        formel: F.svBeitrag.latex,
        einsetzen: L`${lz(d.brutto, 2)} \cdot ${t.text}\,\%`,
        ergebnis: w,
        einheit: '€',
        runden: 2,
        hinweis: `AN-Satz ${fz(t.satz, 2)} %`,
      });
      return w;
    });
    const satz = summe(teile.map((t) => t.satz));
    b.wert('svSatz', gering ? 0 : satz, { label: 'AN-Beitragssatz gesamt', einheit: '%', runden: 2, zusatz: true });
    const sv = b.wert('sv', summe(betraege), { label: 'Arbeitnehmeranteil Sozialversicherung', einheit: '€', runden: 2 });
    b.schritt({
      titel: 'Summe Arbeitnehmeranteil',
      formel: L`KV + PV + RV + ALV`,
      einsetzen: betraege.map((x) => lz(x, 2)).join(' + '),
      ergebnis: sv,
      einheit: '€',
      runden: 2,
      hinweis: gering
        ? `Auszubildender bis ${fz(s.geringverdiener)} € (Geringverdienergrenze): Der Arbeitgeber trägt die Beiträge allein.`
        : `Gesamtsatz ${fz(satz, 2)} %.`,
    });
    if (!gering) {
      const ohneZuschlag = cent((d.brutto * (satz - (d.kinderlos ? s.kinderlosZuschlag : 0))) / 100);
      const mitZuschlag = cent((d.brutto * (satz + (d.kinderlos ? 0 : s.kinderlosZuschlag))) / 100);
      if (d.kinderlos)
        b.fehler('sv', ohneZuschlag, 'Der Kinderlosenzuschlag fehlt – kinderlos ab 23 zahlt man 0,6 % mehr Pflegeversicherung.');
      else b.fehler('sv', mitZuschlag, 'Mit Kind fällt der Kinderlosenzuschlag weg.');
      b.fehler(
        'kv',
        cent((d.brutto * (s.kv + d.zusatzbeitrag)) / 100),
        'Das ist der ganze Beitrag – Arbeitnehmer und Arbeitgeber teilen ihn sich (÷ 2).',
      );
      b.fehler(
        'kv',
        cent((d.brutto * (s.kv / 2 + d.zusatzbeitrag)) / 100),
        'Auch der Zusatzbeitrag wird geteilt: (14,6 % + Zusatzbeitrag) / 2.',
      );
      b.fehler(
        'sv',
        cent((d.brutto * (s.kv + s.pv + s.rv + s.alv + d.zusatzbeitrag)) / 100),
        'Das ist der Gesamtbeitrag von Arbeitgeber und Arbeitnehmer – gefragt ist nur der AN-Anteil.',
      );
    } else {
      b.fehler(
        'sv',
        cent((d.brutto * satz) / 100),
        `Bis ${fz(s.geringverdiener)} € trägt bei Auszubildenden der Arbeitgeber die Beiträge allein.`,
      );
    }
    if (d.lohnsteuer !== undefined) {
      const kist = b.wert('kirchensteuer', cent((d.lohnsteuer * (d.kirchensteuersatz ?? 0)) / 100), {
        label: 'Kirchensteuer',
        einheit: '€',
        runden: 2,
        zusatz: !d.kirchensteuersatz,
      });
      const soli = d.soli ?? 0;
      const netto = b.wert('netto', d.brutto - d.lohnsteuer - soli - kist - sv, { label: 'Nettoentgelt', einheit: '€', runden: 2 });
      if (d.kirchensteuersatz) {
        b.schritt({
          titel: 'Kirchensteuer',
          formel: L`\text{Lohnsteuer} \cdot \text{KiSt-Satz}`,
          einsetzen: L`${lz(d.lohnsteuer, 2)} \cdot ${lz(d.kirchensteuersatz)}\,\%`,
          ergebnis: kist,
          einheit: '€',
          runden: 2,
        });
        b.fehler(
          'kirchensteuer',
          cent((d.brutto * d.kirchensteuersatz) / 100),
          'Die Kirchensteuer bezieht sich auf die **Lohnsteuer**, nicht auf das Brutto.',
        );
        b.fehler(
          'netto',
          d.brutto - d.lohnsteuer - soli - cent((d.brutto * d.kirchensteuersatz) / 100) - sv,
          'Die Kirchensteuer bezieht sich auf die **Lohnsteuer**, nicht auf das Brutto.',
        );
      }
      b.schritt({
        titel: 'Nettoentgelt',
        formel: F.netto.latex,
        einsetzen: L`${lz(d.brutto, 2)} - ${lz(d.lohnsteuer, 2)} - ${lz(soli, 2)} - ${lz(kist, 2)} - ${lz(sv, 2)}`,
        ergebnis: netto,
        einheit: '€',
        runden: 2,
      });
      b.fehler('netto', d.brutto - sv, 'Die Steuern (Lohnsteuer, Kirchensteuer, Soli) fehlen.');
      b.fehler('netto', d.brutto - d.lohnsteuer - soli - kist, 'Der Sozialversicherungsanteil fehlt.');
    }
    return b.fertig();
  },
});

const minijobSchema = z.object({ grenze: z.number().positive(), stundenlohn: z.number().positive() });

export const minijob = vorlage({
  id: 'minijob',
  titel: 'Minijob: Stunden bis zur Verdienstgrenze',
  bereich: 'WiSo',
  beschreibung: 'Wie viele volle Stunden sind bis zur Minijob-Grenze möglich (abrunden) und was wird dabei verdient?',
  schema: minijobSchema,
  hinweise: ['Grenze / Stundenlohn.', 'Nur volle Stunden, die die Grenze **nicht überschreiten** → abrunden.'],
  erzeuge(z, _params, vorbild) {
    return { grenze: vorbild?.grenze ?? 603, stundenlohn: runde(z.ganz(1250, 1700, 5) / 100, 2) };
  },
  platzhalter: (d) => ({ grenze: fz(d.grenze, 2), stundenlohn: fz(d.stundenlohn, 2) }),
  loese(d) {
    const b = new LoesungsBau();
    const q = d.grenze / d.stundenlohn;
    const h = b.wert('stunden', Math.floor(q + 1e-9), { label: 'Volle Stunden höchstens', einheit: 'Stunden' });
    const v = b.wert('verdienst', runde(h * d.stundenlohn, 2), {
      label: 'Verdienst bei diesen Stunden',
      einheit: '€',
      runden: 2,
      zusatz: true,
    });
    b.schritt({
      titel: 'Stunden',
      formel: L`\frac{\text{Grenze}}{\text{Stundenlohn}}`,
      einsetzen: L`\frac{${lz(d.grenze, 2)}}{${lz(d.stundenlohn, 2)}} = ${lz(q, 2)}`,
      ergebnis: h,
      einheit: 'Stunden',
      hinweis: 'Abrunden – eine Stunde mehr würde die Grenze überschreiten.',
    });
    b.schritt({
      titel: 'Probe',
      formel: L`h \cdot \text{Stundenlohn} \le \text{Grenze}`,
      einsetzen: L`${h} \cdot ${lz(d.stundenlohn, 2)}`,
      ergebnis: v,
      einheit: '€',
      runden: 2,
    });
    b.fehler('stunden', Math.ceil(q - 1e-9), 'Aufgerundet überschreitest du die Grenze – nur volle Stunden **bis** zur Grenze (abrunden).');
    b.fehler('stunden', runde(q, 2), 'Gefragt sind **volle** Stunden – abrunden.');
    return b.fertig();
  },
});

const ggSchema = z
  .object({
    zeilen: z
      .array(z.object({ preis: z.number().nonnegative(), nachfrage: z.number().nonnegative(), angebot: z.number().nonnegative() }))
      .min(2)
      .max(12),
  })
  .refine((d) => d.zeilen.some((r) => r.nachfrage === r.angebot), { message: 'keine Zeile mit Angebot = Nachfrage' });

export const gleichgewicht = vorlage({
  id: 'gleichgewicht',
  titel: 'Gleichgewichtspreis',
  bereich: 'WiSo',
  beschreibung: 'Preis und Menge, bei denen angebotene und nachgefragte Menge übereinstimmen (aus einer Tabelle).',
  schema: ggSchema,
  hinweise: ['Suche die Zeile, in der Angebot = Nachfrage.', 'Dort wird die größtmögliche Menge umgesetzt.'],
  erzeuge(z, params, vorbild) {
    const k = intParam(params, 'zeilen', vorbild?.zeilen.length ?? 5, 3, 12);
    const start = z.ganz(4, 12);
    const schritt = z.wahl([1, 2, 5]);
    const g = z.ganz(1, k - 2);
    const menge = z.ganz(4, 12) * 50;
    const dn = z.ganz(1, 4) * 50;
    const da = z.ganz(1, 4) * 50;
    return {
      zeilen: Array.from({ length: k }, (_, i) => ({
        preis: start + i * schritt,
        nachfrage: Math.max(0, menge - (i - g) * dn),
        angebot: Math.max(0, menge + (i - g) * da),
      })),
    };
  },
  platzhalter: (d) => ({
    tabelle: d.zeilen.map((r) => `${fz(r.preis)} € – Nachfrage ${fz(r.nachfrage)}, Angebot ${fz(r.angebot)}`).join(', '),
  }),
  tabelle: (d) => ({
    kopf: ['Preis (€)', 'Nachfrage', 'Angebot'],
    zeilen: d.zeilen.map((r) => [fz(r.preis), fz(r.nachfrage), fz(r.angebot)]),
  }),
  loese(d) {
    const b = new LoesungsBau();
    const gg = d.zeilen.find((r) => r.nachfrage === r.angebot)!;
    b.wert('preis', gg.preis, { label: 'Gleichgewichtspreis', einheit: '€' });
    b.wert('menge', gg.nachfrage, { label: 'Gleichgewichtsmenge', einheit: 'Stück', zusatz: true });
    b.schritt({
      titel: 'Gleichgewicht',
      formel: F.gleichgewicht.latex,
      einsetzen: L`${lz(gg.angebot)} = ${lz(gg.nachfrage)}`,
      ergebnis: gg.preis,
      einheit: '€',
      hinweis: `Menge im Gleichgewicht: ${fz(gg.nachfrage)}.`,
    });
    const maxN = d.zeilen.reduce((a, r) => (r.nachfrage > a.nachfrage ? r : a));
    const maxA = d.zeilen.reduce((a, r) => (r.angebot > a.angebot ? r : a));
    b.fehler('preis', maxN.preis, 'Dort ist die Nachfrage am größten – im Gleichgewicht sind Angebot und Nachfrage **gleich**.');
    b.fehler('preis', maxA.preis, 'Dort ist das Angebot am größten – im Gleichgewicht sind Angebot und Nachfrage **gleich**.');
    return b.fertig();
  },
});
