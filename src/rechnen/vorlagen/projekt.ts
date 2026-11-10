// Projektmanagement (Deep Dive 12): Netzplan (FAZ, FEZ, SAZ, SEZ, Gesamt- und freier Puffer, kritischer Pfad),
// Nutzwertanalyse, Break-even-Menge, Risikoprioritätszahl und Drei-Zeiten-Schätzung (PERT).

import { z } from 'zod';
import { fz, intParam, L, LoesungsBau, lz, summe, tx, vorlage } from '../hilfen.ts';
import { F } from '../formeln.ts';
import type { EingabeLayout } from '../typen.ts';

// ---------- Netzplan ----------

const vorgangSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9]{1,4}$/, '1–4 Buchstaben/Ziffern'),
  name: z.string().trim().min(1).optional(),
  dauer: z.number().finite().nonnegative(),
  vorgaenger: z.array(z.string()).default([]),
});

type Vorgang = z.infer<typeof vorgangSchema>;

/** Topologische Reihenfolge (Kahn, stabil nach Eingabereihenfolge) oder undefined bei Zyklus/unbekanntem Vorgänger. */
function topologisch(vorgaenge: Vorgang[]): Vorgang[] | undefined {
  const ids = new Set(vorgaenge.map((v) => v.id));
  if (vorgaenge.some((v) => v.vorgaenger.some((p) => !ids.has(p)))) return undefined;
  const fertig = new Set<string>();
  const out: Vorgang[] = [];
  while (out.length < vorgaenge.length) {
    const next = vorgaenge.find((v) => !fertig.has(v.id) && v.vorgaenger.every((p) => fertig.has(p)));
    if (!next) return undefined;
    fertig.add(next.id);
    out.push(next);
  }
  return out;
}

const netzplanSchema = z
  .object({ vorgaenge: z.array(vorgangSchema).min(2).max(15), einheit: z.string().trim().min(1).optional() })
  .superRefine((d, ctx) => {
    if (new Set(d.vorgaenge.map((v) => v.id)).size !== d.vorgaenge.length)
      ctx.addIssue({ code: 'custom', message: 'Vorgangs-IDs doppelt' });
    else if (!topologisch(d.vorgaenge)) ctx.addIssue({ code: 'custom', message: 'unbekannter Vorgänger oder Zyklus' });
  });

interface Plan {
  faz: Record<string, number>;
  fez: Record<string, number>;
  saz: Record<string, number>;
  sez: Record<string, number>;
  dauer: number;
}

/** Vorwärts- und Rückwärtsrechnung; `vorwaerts`/`rueckwaerts` erlauben die typischen Fehler (min statt max usw.). */
function rechne(
  vorgaenge: Vorgang[],
  vorwaerts: (xs: number[]) => number = (xs) => Math.max(...xs),
  rueckwaerts: (xs: number[]) => number = (xs) => Math.min(...xs),
): Plan {
  const topo = topologisch(vorgaenge)!;
  const faz: Record<string, number> = {};
  const fez: Record<string, number> = {};
  for (const v of topo) {
    faz[v.id] = v.vorgaenger.length ? vorwaerts(v.vorgaenger.map((p) => fez[p])) : 0;
    fez[v.id] = faz[v.id] + v.dauer;
  }
  const dauer = Math.max(...Object.values(fez));
  const saz: Record<string, number> = {};
  const sez: Record<string, number> = {};
  for (const v of [...topo].reverse()) {
    const nach = vorgaenge.filter((w) => w.vorgaenger.includes(v.id));
    sez[v.id] = nach.length ? rueckwaerts(nach.map((w) => saz[w.id])) : dauer;
    saz[v.id] = sez[v.id] - v.dauer;
  }
  return { faz, fez, saz, sez, dauer };
}

const STRUKTUREN: { id: string; vorgaenger: string[] }[][] = [
  [
    { id: 'A', vorgaenger: [] },
    { id: 'B', vorgaenger: ['A'] },
    { id: 'C', vorgaenger: ['A'] },
    { id: 'D', vorgaenger: ['B', 'C'] },
    { id: 'E', vorgaenger: ['B'] },
    { id: 'F', vorgaenger: ['D', 'E'] },
    { id: 'G', vorgaenger: ['F'] },
  ],
  [
    { id: 'A', vorgaenger: [] },
    { id: 'B', vorgaenger: [] },
    { id: 'C', vorgaenger: ['A'] },
    { id: 'D', vorgaenger: ['A', 'B'] },
    { id: 'E', vorgaenger: ['C'] },
    { id: 'F', vorgaenger: ['D'] },
    { id: 'G', vorgaenger: ['E', 'F'] },
  ],
  [
    { id: 'A', vorgaenger: [] },
    { id: 'B', vorgaenger: ['A'] },
    { id: 'C', vorgaenger: ['A'] },
    { id: 'D', vorgaenger: ['B'] },
    { id: 'E', vorgaenger: ['C'] },
    { id: 'F', vorgaenger: ['D', 'E'] },
  ],
];

export const netzplan = vorlage({
  id: 'netzplan',
  titel: 'Netzplan: FAZ, FEZ, SAZ, SEZ, Puffer, kritischer Pfad',
  bereich: 'Projektmanagement',
  beschreibung:
    'Vorwärts- und Rückwärtsrechnung, Gesamtpuffer (GP), freier Puffer (FP), Projektdauer und kritischer Pfad. Projektstart = 0.',
  schema: netzplanSchema,
  hinweise: [
    'Vorwärts: FAZ = **größtes** FEZ der Vorgänger (Start = 0), FEZ = FAZ + Dauer.',
    'Rückwärts: SEZ = **kleinstes** SAZ der Nachfolger (Ende = Projektdauer), SAZ = SEZ − Dauer.',
    'GP = SAZ − FAZ. FP = kleinstes FAZ der Nachfolger − FEZ. Kritisch sind alle Vorgänge mit GP = 0.',
  ],
  erzeuge(z, params, vorbild) {
    const struktur = vorbild?.vorgaenge ?? z.wahl(STRUKTUREN);
    const dauern = vorbild?.vorgaenge.map((v) => v.dauer) ?? [];
    const min = intParam(params, 'dauerMin', dauern.length ? Math.max(1, Math.min(...dauern)) : 2, 1, 100);
    const max = intParam(params, 'dauerMax', dauern.length ? Math.max(...dauern) : 9, min, 200);
    return {
      vorgaenge: struktur.map((v) => ({ ...v, vorgaenger: [...v.vorgaenger], dauer: z.ganz(min, max) })),
      ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}),
    };
  },
  platzhalter: (d) => ({ vorgaenge: d.vorgaenge.map((v) => v.id).join(', '), einheit: d.einheit ?? 'Tage' }),
  tabelle: (d) => ({
    kopf: ['Vorgang', ...(d.vorgaenge.some((v) => v.name) ? ['Beschreibung'] : []), `Dauer (${d.einheit ?? 'Tage'})`, 'Vorgänger'],
    zeilen: d.vorgaenge.map((v) => [
      v.id,
      ...(d.vorgaenge.some((w) => w.name) ? [v.name ?? ''] : []),
      fz(v.dauer),
      v.vorgaenger.join(', ') || '–',
    ]),
  }),
  loese(d) {
    const b = new LoesungsBau();
    const e = d.einheit ?? 'Tage';
    const p = rechne(d.vorgaenge);
    const topo = topologisch(d.vorgaenge)!;
    const nach = (id: string) => d.vorgaenge.filter((w) => w.vorgaenger.includes(id));
    const fp: Record<string, number> = {};
    const gp: Record<string, number> = {};
    const zeilen: EingabeLayout['zeilen'] = [];
    for (const v of d.vorgaenge) {
      const id = v.id;
      b.wert(`FAZ_${id}`, p.faz[id], { label: `FAZ ${id}` });
      b.wert(`FEZ_${id}`, p.fez[id], { label: `FEZ ${id}` });
      b.wert(`SAZ_${id}`, p.saz[id], { label: `SAZ ${id}` });
      b.wert(`SEZ_${id}`, p.sez[id], { label: `SEZ ${id}` });
      gp[id] = b.wert(`GP_${id}`, p.saz[id] - p.faz[id], { label: `Gesamtpuffer ${id}`, einheit: e });
      const ns = nach(id);
      fp[id] = b.wert(`FP_${id}`, (ns.length ? Math.min(...ns.map((w) => p.faz[w.id])) : p.dauer) - p.fez[id], {
        label: `Freier Puffer ${id}`,
        einheit: e,
      });
      zeilen.push({
        label: `${id}${v.name ? ` – ${v.name}` : ''} (${fz(v.dauer)})`,
        ids: ['FAZ', 'FEZ', 'SAZ', 'SEZ', 'GP', 'FP'].map((k) => `${k}_${id}`),
      });
    }
    b.wert('projektdauer', p.dauer, { label: 'Projektdauer', einheit: e });
    const kritisch = topo.filter((v) => gp[v.id] === 0).map((v) => v.id);
    b.wert('kritischerPfad', kritisch.join(' → '), { label: 'Kritischer Pfad (Vorgänge, z. B. „A, C, D“)', vergleich: 'menge' });

    for (const v of topo) {
      b.schritt({
        titel: `Vorwärts: ${v.id}`,
        formel: v.vorgaenger.length ? F.vorwaerts.latex : L`FAZ = 0,\ FEZ = FAZ + D`,
        einsetzen: v.vorgaenger.length
          ? L`FAZ = \max(${v.vorgaenger.map((x) => lz(p.fez[x])).join(L`;\ `)}) = ${lz(p.faz[v.id])},\ FEZ = ${lz(p.faz[v.id])} + ${lz(v.dauer)}`
          : L`FEZ = 0 + ${lz(v.dauer)}`,
        ergebnis: p.fez[v.id],
        einheit: e,
        hinweis: `FAZ ${v.id} = ${fz(p.faz[v.id])}, FEZ ${v.id} = ${fz(p.fez[v.id])}.`,
      });
    }
    b.schritt({ titel: 'Projektdauer', formel: L`\max(FEZ)`, einsetzen: tx(`größtes FEZ`), ergebnis: p.dauer, einheit: e });
    for (const v of [...topo].reverse()) {
      const ns = nach(v.id);
      b.schritt({
        titel: `Rückwärts und Puffer: ${v.id}`,
        formel: ns.length
          ? L`${F.rueckwaerts.latex},\ ${F.gesamtpuffer.latex},\ ${F.freierPuffer.latex}`
          : L`SEZ = \text{Projektdauer},\ SAZ = SEZ - D,\ GP = SAZ - FAZ,\ FP = \text{Projektdauer} - FEZ`,
        einsetzen: ns.length
          ? L`SEZ = \min(${ns.map((w) => lz(p.saz[w.id])).join(L`;\ `)}) = ${lz(p.sez[v.id])},\ SAZ = ${lz(p.sez[v.id])} - ${lz(v.dauer)} = ${lz(p.saz[v.id])},\ GP = ${lz(p.saz[v.id])} - ${lz(p.faz[v.id])},\ FP = ${lz(Math.min(...ns.map((w) => p.faz[w.id])))} - ${lz(p.fez[v.id])}`
          : L`SEZ = ${lz(p.dauer)},\ SAZ = ${lz(p.saz[v.id])},\ GP = ${lz(p.saz[v.id])} - ${lz(p.faz[v.id])},\ FP = ${lz(p.dauer)} - ${lz(p.fez[v.id])}`,
        ergebnis: gp[v.id],
        einheit: e,
        hinweis: `SAZ ${v.id} = ${fz(p.saz[v.id])}, SEZ ${v.id} = ${fz(p.sez[v.id])}, GP = ${fz(gp[v.id])}, FP = ${fz(fp[v.id])}${gp[v.id] === 0 ? ' → kritisch' : ''}.`,
      });
    }
    b.schritt({
      titel: 'Kritischer Pfad',
      formel: tx('alle Vorgänge mit GP = 0'),
      einsetzen: tx(kritisch.join(' → ')),
      ergebnis: summe(topo.filter((v) => gp[v.id] === 0).map((v) => v.dauer)),
      einheit: e,
      hinweis: 'Ergebnis = Summe der Dauern auf dem kritischen Pfad (= Projektdauer, wenn es nur einen Pfad gibt).',
    });

    // Typische Fehler: vorwärts Minimum statt Maximum, rückwärts Maximum statt Minimum, FP = GP, Dauern einfach addiert.
    const vorMin = rechne(d.vorgaenge, (xs) => Math.min(...xs));
    const rueckMax = rechne(d.vorgaenge, undefined, (xs) => Math.max(...xs));
    for (const v of d.vorgaenge) {
      b.fehler(
        `FAZ_${v.id}`,
        vorMin.faz[v.id],
        'Vorwärts gilt das **größte** FEZ der Vorgänger – erst wenn alle fertig sind, kann der Vorgang starten.',
      );
      b.fehler(
        `FEZ_${v.id}`,
        vorMin.fez[v.id],
        'Vorwärts gilt das **größte** FEZ der Vorgänger – erst wenn alle fertig sind, kann der Vorgang starten.',
      );
      b.fehler(`SEZ_${v.id}`, rueckMax.sez[v.id], 'Rückwärts gilt das **kleinste** SAZ der Nachfolger.');
      b.fehler(`SAZ_${v.id}`, rueckMax.saz[v.id], 'Rückwärts gilt das **kleinste** SAZ der Nachfolger.');
      b.fehler(`FP_${v.id}`, gp[v.id], 'Das ist der Gesamtpuffer – der freie Puffer ist kleinstes FAZ der Nachfolger − FEZ.');
      b.fehler(`GP_${v.id}`, fp[v.id], 'Das ist der freie Puffer – der Gesamtpuffer ist SAZ − FAZ.');
    }
    b.fehler(
      'projektdauer',
      summe(d.vorgaenge.map((v) => v.dauer)),
      'Du hast alle Dauern addiert – parallele Vorgänge laufen gleichzeitig. Projektdauer = größtes FEZ.',
    );
    const fpNull = topo.filter((v) => fp[v.id] === 0).map((v) => v.id);
    b.fehler(
      'kritischerPfad',
      fpNull.join(' → '),
      'Kritisch sind die Vorgänge mit **Gesamtpuffer** 0 – ein freier Puffer von 0 reicht nicht.',
    );
    return b.fertig({ spalten: ['FAZ', 'FEZ', 'SAZ', 'SEZ', 'GP', 'FP'], zeilen });
  },
});

// ---------- Nutzwertanalyse ----------

const nwSchema = z
  .object({
    kriterien: z
      .array(z.object({ name: z.string().trim().min(1), gewicht: z.number().positive() }))
      .min(2)
      .max(10),
    alternativen: z
      .array(z.object({ name: z.string().trim().min(1), punkte: z.array(z.number().finite()) }))
      .min(2)
      .max(5),
  })
  .refine((d) => d.alternativen.every((a) => a.punkte.length === d.kriterien.length), { message: 'je Kriterium ein Punktwert' })
  .refine((d) => Math.abs(summe(d.kriterien.map((k) => k.gewicht)) - 100) < 1e-6, { message: 'Gewichte müssen 100 % ergeben' });

const GEWICHTE = [
  [40, 30, 20, 10],
  [35, 25, 25, 15],
  [30, 30, 20, 20],
  [50, 20, 20, 10],
  [45, 25, 20, 10],
];

export const nutzwert = vorlage({
  id: 'nutzwert',
  titel: 'Nutzwertanalyse',
  bereich: 'Projektmanagement',
  beschreibung: 'Teilnutzen = Gewicht · Punkte je Kriterium und Alternative, Nutzwert = Summe der Teilnutzen, beste Alternative.',
  schema: nwSchema,
  hinweise: [
    'Teilnutzen = Gewicht (als Anteil, 40 % = 0,4) · Punkte.',
    'Nutzwert = Summe der Teilnutzen einer Alternative.',
    'Knappe Ergebnisse kritisch beurteilen (Sensitivität der Gewichte).',
  ],
  erzeuge(z, _params, vorbild) {
    const kn = vorbild?.kriterien.map((k) => k.name) ?? ['Funktionsumfang', 'Kosten', 'Integrationsfähigkeit', 'Support'];
    const an = vorbild?.alternativen.map((a) => a.name) ?? ['Anbieter A', 'Anbieter B'];
    for (let versuch = 0; ; versuch++) {
      const passend = GEWICHTE.filter((g) => g.length === kn.length);
      const gewichte = passend.length ? z.mische(z.wahl(passend)) : kn.map(() => 100 / kn.length);
      const alternativen = an.map((name) => ({ name, punkte: kn.map(() => z.ganz(3, 10)) }));
      const werte = alternativen.map((a) => summe(a.punkte.map((p, i) => (p * gewichte[i]) / 100)));
      if (new Set(werte.map((w) => w.toFixed(4))).size === werte.length || versuch > 100) {
        return { kriterien: kn.map((name, i) => ({ name, gewicht: gewichte[i] })), alternativen };
      }
    }
  },
  platzhalter: (d) => ({
    kriterien: d.kriterien.map((k) => `${k.name} ${fz(k.gewicht)} %`).join(', '),
    alternativen: d.alternativen.map((a) => a.name).join(', '),
  }),
  tabelle: (d) => ({
    kopf: ['Kriterium', 'Gewicht', ...d.alternativen.map((a) => a.name)],
    zeilen: d.kriterien.map((k, i) => [k.name, `${fz(k.gewicht)} %`, ...d.alternativen.map((a) => fz(a.punkte[i]))]),
  }),
  loese(d) {
    const b = new LoesungsBau();
    const nw = d.alternativen.map((a, ai) => {
      const teile = d.kriterien.map((k, ki) =>
        b.wert(`teil${ai + 1}_${ki + 1}`, (k.gewicht / 100) * a.punkte[ki], { label: `Teilnutzen ${a.name}: ${k.name}`, runden: 2 }),
      );
      d.kriterien.forEach((k, ki) =>
        b.fehler(`teil${ai + 1}_${ki + 1}`, k.gewicht * a.punkte[ki], 'Gewicht als Anteil nehmen: 40 % = 0,4.'),
      );
      const w = b.wert(`nutzwert${ai + 1}`, summe(teile), { label: `Nutzwert ${a.name}`, runden: 2 });
      b.schritt({
        titel: `Nutzwert ${a.name}`,
        formel: F.nutzwert.latex,
        einsetzen: d.kriterien.map((k, ki) => L`${lz(k.gewicht / 100)} \cdot ${lz(a.punkte[ki])}`).join(' + '),
        ergebnis: w,
        runden: 2,
      });
      b.fehler(`nutzwert${ai + 1}`, summe(a.punkte), 'Du hast die Punkte ohne Gewichtung addiert.');
      b.fehler(`nutzwert${ai + 1}`, w * 100, 'Gewicht als Anteil nehmen: 40 % = 0,4 (sonst ist alles 100-mal zu groß).');
      b.fehler(`nutzwert${ai + 1}`, summe(a.punkte) / a.punkte.length, 'Das ist der ungewichtete Durchschnitt der Punkte.');
      return w;
    });
    const beste = d.alternativen[nw.indexOf(Math.max(...nw))].name;
    b.wert('beste', beste, { label: 'Höchster Nutzwert', vergleich: 'text' });
    const roh = d.alternativen.map((a) => summe(a.punkte));
    b.fehler(
      'beste',
      d.alternativen[roh.indexOf(Math.max(...roh))].name,
      'Das ist die Alternative mit den meisten **ungewichteten** Punkten.',
    );
    for (const a of d.alternativen)
      b.fehler('beste', a.name, `${a.name} hat einen niedrigeren Nutzwert – vergleiche die gewichteten Summen.`);
    return b.fertig({
      spalten: d.alternativen.map((a) => `Teilnutzen ${a.name}`),
      zeilen: d.kriterien.map((k, ki) => ({
        label: `${k.name} (${fz(k.gewicht)} %)`,
        ids: d.alternativen.map((_, ai) => `teil${ai + 1}_${ki + 1}`),
      })),
    });
  },
});

// ---------- Break-even ----------

const beSchema = z
  .object({
    fixkosten: z.number().positive(),
    preis: z.number().positive(),
    variabel: z.number().nonnegative(),
    menge: z.number().nonnegative().optional(),
  })
  .refine((d) => d.preis > d.variabel, { message: 'Preis muss über den variablen Stückkosten liegen' });

export const breakEven = vorlage({
  id: 'break-even',
  titel: 'Break-even-Menge',
  bereich: 'Wirtschaftlichkeit',
  beschreibung: 'Deckungsbeitrag je Stück, Break-even-Menge (aufgerundet auf ganze Stück) und optional der Gewinn bei einer Menge.',
  schema: beSchema,
  hinweise: [
    'Deckungsbeitrag = Preis − variable Stückkosten.',
    'Break-even-Menge = Fixkosten / Deckungsbeitrag (auf ganze Stück aufrunden).',
  ],
  erzeuge(z, _params, vorbild) {
    const db = z.ganz(1, 12) * 5;
    const variabel = z.ganz(2, 20) * 5;
    const be = z.ganz(4, 40) * 50;
    return {
      fixkosten: db * be,
      preis: variabel + db,
      variabel,
      ...(vorbild?.menge !== undefined ? { menge: be + z.ganz(-3, 6) * 50 } : {}),
    };
  },
  platzhalter: (d) => ({
    fixkosten: fz(d.fixkosten, 2),
    preis: fz(d.preis, 2),
    variabel: fz(d.variabel, 2),
    menge: d.menge === undefined ? '–' : fz(d.menge),
  }),
  loese(d) {
    const b = new LoesungsBau();
    const db = b.wert('db', d.preis - d.variabel, { label: 'Deckungsbeitrag je Stück', einheit: '€', runden: 2 });
    const exakt = d.fixkosten / db;
    const be = b.wert('breakEven', Math.ceil(exakt - 1e-9), { label: 'Break-even-Menge', einheit: 'Stück' });
    b.schritt({
      titel: 'Deckungsbeitrag',
      formel: F.deckungsbeitrag.latex,
      einsetzen: L`${lz(d.preis, 2)} - ${lz(d.variabel, 2)}`,
      ergebnis: db,
      einheit: '€',
      runden: 2,
    });
    b.schritt({
      titel: 'Break-even-Menge',
      formel: F.breakEven.latex,
      einsetzen: L`\frac{${lz(d.fixkosten, 2)}}{${lz(db, 2)}} = ${lz(exakt, 2)}`,
      ergebnis: be,
      einheit: 'Stück',
      hinweis: Number.isInteger(exakt) ? undefined : 'Auf ganze Stück aufgerundet – erst ab dieser Menge sind die Kosten gedeckt.',
    });
    b.fehler(
      'breakEven',
      d.fixkosten / d.preis,
      'Du hast durch den Preis geteilt – geteilt wird durch den **Deckungsbeitrag** (Preis − variable Kosten).',
    );
    b.fehler(
      'breakEven',
      d.fixkosten / d.variabel,
      'Du hast durch die variablen Kosten geteilt – geteilt wird durch den **Deckungsbeitrag**.',
    );
    if (!Number.isInteger(exakt))
      b.fehler('breakEven', Math.floor(exakt), 'Abgerundet reicht es noch nicht – auf ganze Stück **aufrunden**.');
    if (d.menge !== undefined) {
      const g = b.wert('gewinn', db * d.menge - d.fixkosten, { label: `Gewinn bei ${fz(d.menge)} Stück`, einheit: '€', runden: 2 });
      b.schritt({
        titel: 'Gewinn',
        formel: F.gewinn.latex,
        einsetzen: L`${lz(db, 2)} \cdot ${lz(d.menge)} - ${lz(d.fixkosten, 2)}`,
        ergebnis: g,
        einheit: '€',
        runden: 2,
      });
      b.fehler('gewinn', d.preis * d.menge - d.fixkosten, 'Die variablen Kosten fehlen – rechne mit dem Deckungsbeitrag.');
    }
    return b.fertig();
  },
});

// ---------- Risikoprioritätszahl ----------

const risikoSchema = z.object({
  risiken: z
    .array(z.object({ name: z.string().trim().min(1), w: z.number().positive(), s: z.number().positive() }))
    .min(1)
    .max(10),
});

export const risiko = vorlage({
  id: 'risiko',
  titel: 'Risikobewertung (W · S)',
  bereich: 'Projektmanagement',
  beschreibung: 'Risikoprioritätszahl = Eintrittswahrscheinlichkeit · Schadensausmaß je Risiko und das höchste Risiko.',
  schema: risikoSchema,
  hinweise: ['Risikozahl = W · S (multiplizieren, nicht addieren).'],
  erzeuge(z, _params, vorbild) {
    const namen = vorbild?.risiken.map((r) => r.name) ?? [
      'Dienstleister fällt aus',
      'Datenqualität schlechter als erwartet',
      'Fachbereich ohne Zeit',
    ];
    for (let versuch = 0; ; versuch++) {
      const risiken = namen.map((name) => ({ name, w: z.ganz(1, 5), s: z.ganz(1, 5) }));
      const rpz = risiken.map((r) => r.w * r.s);
      if (rpz.filter((x) => x === Math.max(...rpz)).length === 1 || versuch > 100) return { risiken };
    }
  },
  platzhalter: (d) => ({ risiken: d.risiken.map((r) => `${r.name} (W = ${fz(r.w)}, S = ${fz(r.s)})`).join(' · ') }),
  tabelle: (d) => ({ kopf: ['Risiko', 'W', 'S'], zeilen: d.risiken.map((r) => [r.name, fz(r.w), fz(r.s)]) }),
  loese(d) {
    const b = new LoesungsBau();
    const rpz = d.risiken.map((r, i) => {
      const w = b.wert(`rpz${i + 1}`, r.w * r.s, { label: `Risikozahl: ${r.name}` });
      b.schritt({ titel: r.name, formel: F.risiko.latex, einsetzen: L`${lz(r.w)} \cdot ${lz(r.s)}`, ergebnis: w });
      b.fehler(`rpz${i + 1}`, r.w + r.s, 'Du hast addiert – die Risikozahl ist das **Produkt** W · S.');
      return w;
    });
    b.wert('hoechstes', d.risiken[rpz.indexOf(Math.max(...rpz))].name, { label: 'Höchstes Risiko', vergleich: 'text', zusatz: true });
    const summen = d.risiken.map((r) => r.w + r.s);
    b.fehler(
      'hoechstes',
      d.risiken[summen.indexOf(Math.max(...summen))].name,
      'Das ist das höchste Risiko nach W **+** S – gerechnet wird W · S.',
    );
    for (const r of d.risiken) b.fehler('hoechstes', r.name, `„${r.name}“ hat eine kleinere Risikozahl W · S.`);
    return b.fertig();
  },
});

// ---------- Drei-Zeiten-Schätzung (PERT) ----------

const schaetzSchema = z.object({
  vorgaenge: z
    .array(
      z
        .object({ name: z.string().trim().min(1), o: z.number().nonnegative(), m: z.number().nonnegative(), p: z.number().nonnegative() })
        .refine((v) => v.o <= v.m && v.m <= v.p, { message: 'es muss optimistisch ≤ wahrscheinlich ≤ pessimistisch gelten' }),
    )
    .min(1)
    .max(8),
  einheit: z.string().trim().min(1).optional(),
});

const ARBEITSPAKETE = [
  'Anforderungsanalyse',
  'Datenmodell entwerfen',
  'ETL-Strecke entwickeln',
  'Dashboard entwerfen',
  'Test',
  'Dokumentation',
  'Schulung',
  'Abnahme',
];

export const pert = vorlage({
  id: 'pert',
  titel: 'Drei-Zeiten-Schätzung (PERT)',
  bereich: 'Projektmanagement',
  beschreibung: 'Erwartete Dauer t_e = (o + 4 · m + p) / 6 je Arbeitspaket und bei mehreren Paketen die Summe.',
  schema: schaetzSchema,
  hinweise: [
    't_e = (optimistisch + 4 · wahrscheinlich + pessimistisch) / 6.',
    'Der wahrscheinlichste Wert zählt vierfach – geteilt wird deshalb durch 6, nicht durch 3.',
  ],
  erzeuge(z, params, vorbild) {
    const namen = vorbild?.vorgaenge.map((v) => v.name) ?? ARBEITSPAKETE;
    const k = intParam(params, 'vorgaenge', vorbild?.vorgaenge.length ?? 1, 1, 8);
    return {
      vorgaenge: Array.from({ length: k }, (_, i) => {
        const o = z.ganz(2, 8);
        const m = o + z.ganz(1, 5);
        return { name: namen[i] ?? `Arbeitspaket ${i + 1}`, o, m, p: m + z.ganz(3, 12) };
      }),
      ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}),
    };
  },
  platzhalter: (d) => {
    const p: Record<string, string> = { einheit: d.einheit ?? 'Tage', anzahl: String(d.vorgaenge.length) };
    d.vorgaenge.forEach((v, i) => {
      p[`name${i + 1}`] = v.name;
      p[`o${i + 1}`] = fz(v.o);
      p[`m${i + 1}`] = fz(v.m);
      p[`p${i + 1}`] = fz(v.p);
    });
    return p;
  },
  tabelle: (d) => ({
    kopf: ['Arbeitspaket', 'optimistisch (o)', 'wahrscheinlich (m)', 'pessimistisch (p)'],
    zeilen: d.vorgaenge.map((v) => [v.name, ...[v.o, v.m, v.p].map((x) => `${fz(x)} ${d.einheit ?? 'Tage'}`)]),
  }),
  loese(d) {
    const b = new LoesungsBau();
    const e = d.einheit ?? 'Tage';
    const te = d.vorgaenge.map((v, i) => {
      const id = `te${i + 1}`;
      const w = b.wert(id, (v.o + 4 * v.m + v.p) / 6, { label: `Erwartete Dauer ${v.name}`, einheit: e, runden: 2 });
      b.schritt({
        titel: v.name,
        formel: F.pert.latex,
        einsetzen: L`t_e = \frac{${lz(v.o)} + 4 \cdot ${lz(v.m)} + ${lz(v.p)}}{6} = \frac{${lz(v.o + 4 * v.m + v.p)}}{6}`,
        ergebnis: w,
        einheit: e,
        runden: 2,
      });
      b.fehler(id, (v.o + v.m + v.p) / 3, 'Das ist das einfache Mittel – bei PERT zählt der wahrscheinlichste Wert **vierfach**.');
      b.fehler(id, (v.o + v.m + v.p) / 6, 'Der wahrscheinlichste Wert muss mit 4 multipliziert werden.');
      b.fehler(id, (v.o + 4 * v.m + v.p) / 3, 'Geteilt wird durch 6 (1 + 4 + 1 Gewichte), nicht durch 3.');
      b.fehler(id, v.o + 4 * v.m + v.p, 'Du hast die gewichtete Summe nicht durch 6 geteilt.');
      b.fehler(id, v.m, 'Das ist nur der wahrscheinlichste Wert – optimistische und pessimistische Schätzung gehören dazu.');
      return w;
    });
    if (d.vorgaenge.length > 1) {
      const s = b.wert('summe', summe(te), { label: 'Erwartete Dauer gesamt (nacheinander)', einheit: e, runden: 2 });
      b.schritt({
        titel: 'Summe',
        formel: tx('Summe der erwarteten Dauern'),
        einsetzen: te.map((x) => lz(x, 2)).join(' + '),
        ergebnis: s,
        einheit: e,
        runden: 2,
      });
      b.fehler(
        'summe',
        summe(d.vorgaenge.map((v) => v.m)),
        'Das ist die Summe der wahrscheinlichsten Werte – addiere die erwarteten Dauern t_e.',
      );
    }
    return b.fertig();
  },
});
