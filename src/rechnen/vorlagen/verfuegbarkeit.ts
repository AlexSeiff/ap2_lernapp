// Verfügbarkeit (Deep Dive 16, Teil 4): SLA-Prüfung (erlaubte Ausfallzeit, tatsächliche Verfügbarkeit), Verfügbarkeit aus
// MTBF und MTTR sowie die Gesamtverfügbarkeit einer Reihenschaltung, deren Stufen redundant (parallel) ausgelegt sein können.

import { z } from 'zod';
import { fz, L, LoesungsBau, lz, mittel, tx, vorlage } from '../hilfen.ts';
import { F } from '../formeln.ts';

const prozent = z.number().finite().gt(0).lt(100);
const STUNDEN_JAHR = 8760;

/** Anteil für LaTeX mit bis zu 6 Nachkommastellen, ohne Nullen am Ende (0,9996 → 0{,}9996). */
const az = (x: number) => x.toFixed(6).replace(/0+$/, '').replace(/\.$/, '').replace('.', '{,}');
/** Prozentwert für LaTeX als Anteil (99,5 → 0{,}995). */
const anteil = (p: number) => az(p / 100);

// ---------- SLA: erlaubte Ausfallzeit und tatsächliche Verfügbarkeit ----------

const slaSchema = z
  .object({
    /** Vereinbarte Betriebszeit im Zeitraum in Stunden (Monat 24/7 = 720, Jahr = 8.760). */
    stunden: z.number().finite().positive(),
    sla: prozent,
    /** Tatsächliche ungeplante Ausfallzeit in Stunden. */
    ausfall: z.number().finite().nonnegative(),
  })
  .refine((d) => d.ausfall <= d.stunden, { message: 'die Ausfallzeit ist länger als die Betriebszeit' });

export const verfuegbarkeit = vorlage({
  id: 'verfuegbarkeit',
  titel: 'SLA: erlaubte Ausfallzeit und Verfügbarkeit',
  bereich: 'Qualitätssicherung / Verfügbarkeit',
  beschreibung: 'Erlaubte Ausfallzeit aus der zugesicherten Verfügbarkeit, tatsächliche Verfügbarkeit und ob das SLA eingehalten ist.',
  schema: slaSchema,
  hinweise: [
    'Erlaubte Ausfallzeit = Betriebszeit · (1 − Verfügbarkeit); 99,5 % → 1 − 0,995 = 0,005.',
    'Tatsächliche Verfügbarkeit = (Betriebszeit − Ausfallzeit) / Betriebszeit · 100 %.',
    'Eingehalten, wenn die Ausfallzeit höchstens so groß ist wie die erlaubte.',
  ],
  erzeuge(z, _params, vorbild) {
    const stunden = vorbild?.stunden ?? z.wahl([720, 744, STUNDEN_JAHR]);
    for (let versuch = 0; ; versuch++) {
      const sla = z.wahl([99, 99.5, 99.8, 99.9, 99.95]);
      const erlaubt = stunden * (1 - sla / 100);
      // Ausfall in halben Stunden um die erlaubte Zeit herum – mal eingehalten, mal nicht, nie genau auf der Grenze.
      const ausfall = Math.max(0.5, Math.round(erlaubt * (0.4 + z.zahl() * 1.4) * 2) / 2);
      if (Math.abs(ausfall - erlaubt) > 0.05 || versuch > 50) return { stunden, sla, ausfall };
    }
  },
  platzhalter: (d) => ({ stunden: fz(d.stunden), sla: fz(d.sla), ausfall: fz(d.ausfall) }),
  loese(d) {
    const b = new LoesungsBau();
    const erlaubt = b.wert('erlaubt', d.stunden * (1 - d.sla / 100), { label: 'Erlaubte Ausfallzeit', einheit: 'h', runden: 2 });
    b.wert('erlaubtMin', erlaubt * 60, { label: 'Erlaubte Ausfallzeit in Minuten', einheit: 'min', runden: 1, zusatz: true });
    b.schritt({
      titel: 'Erlaubte Ausfallzeit',
      formel: F.ausfallzeit.latex,
      einsetzen: L`${lz(d.stunden)}\ \text{h} \cdot (1 - ${anteil(d.sla)})`,
      ergebnis: erlaubt,
      einheit: 'h',
      runden: 2,
    });
    b.fehler('erlaubt', d.stunden * (d.sla / 100), 'Das ist die zugesicherte **Betriebszeit** – erlaubt ist nur der Rest: · (1 − V).');
    b.fehler('erlaubt', d.stunden * (100 - d.sla), 'Die Prozentangabe muss durch 100 geteilt werden: 0,5 % = 0,005.');

    const v = b.wert('verfuegbarkeit', ((d.stunden - d.ausfall) / d.stunden) * 100, {
      label: 'Tatsächliche Verfügbarkeit',
      einheit: '%',
      runden: 3,
    });
    b.schritt({
      titel: 'Tatsächliche Verfügbarkeit',
      formel: F.verfuegbarkeit.latex,
      einsetzen: L`\frac{${lz(d.stunden)} - ${lz(d.ausfall)}}{${lz(d.stunden)}} \cdot 100\,\%`,
      ergebnis: v,
      einheit: '%',
      runden: 3,
    });
    b.fehler('verfuegbarkeit', (d.ausfall / d.stunden) * 100, 'Das ist der **Ausfall**anteil – gefragt ist der Anteil der nutzbaren Zeit.');

    const ok = d.ausfall <= erlaubt + 1e-9;
    b.wert('eingehalten', ok ? 'ja' : 'nein', { label: `SLA von ${fz(d.sla)} % eingehalten? (ja/nein)`, vergleich: 'text' });
    b.fehler(
      'eingehalten',
      ok ? 'nein' : 'ja',
      ok
        ? `Die Ausfallzeit von ${fz(d.ausfall)} h liegt innerhalb der erlaubten ${fz(erlaubt, 2)} h.`
        : `Die Ausfallzeit von ${fz(d.ausfall)} h ist größer als die erlaubten ${fz(erlaubt, 2)} h.`,
    );
    b.schritt({
      titel: 'SLA eingehalten?',
      formel: tx('Ausfallzeit ≤ erlaubte Ausfallzeit'),
      einsetzen: L`${lz(d.ausfall)}\ \text{h} ${ok ? '\\le' : '>'} ${lz(erlaubt, 2)}\ \text{h}`,
      ergebnis: v,
      einheit: '%',
      runden: 3,
      hinweis: ok ? 'Eingehalten.' : 'Nicht eingehalten – die vereinbarte Vertragsstrafe wird fällig.',
    });
    return b.fertig();
  },
});

// ---------- MTBF und MTTR ----------

const mtbfSchema = z.object({
  mtbf: z.number().finite().positive(),
  mttr: z.number().finite().positive(),
  /** Betriebszeit für die erwartete Ausfallzeit (Standard: Jahr rund um die Uhr). */
  stunden: z.number().finite().positive().optional(),
});

export const mtbf = vorlage({
  id: 'mtbf',
  titel: 'Verfügbarkeit aus MTBF und MTTR',
  bereich: 'Qualitätssicherung / Verfügbarkeit',
  beschreibung: 'Verfügbarkeit = MTBF / (MTBF + MTTR) und die daraus erwartete Ausfallzeit pro Jahr (bzw. Betriebszeit).',
  schema: mtbfSchema,
  hinweise: [
    'V = MTBF / (MTBF + MTTR) – im Nenner steht die Summe.',
    'Erwartete Ausfallzeit = Betriebszeit · (1 − V); ein Jahr hat 8.760 Stunden.',
  ],
  erzeuge(z, _params, vorbild) {
    return {
      mtbf: z.ganz(50, 500) * 10,
      mttr: z.wahl([2, 4, 5, 8, 10, 12, 24, 48]),
      ...(vorbild?.stunden !== undefined ? { stunden: vorbild.stunden } : {}),
    };
  },
  platzhalter: (d) => ({ mtbf: fz(d.mtbf), mttr: fz(d.mttr), stunden: fz(d.stunden ?? STUNDEN_JAHR) }),
  loese(d) {
    const b = new LoesungsBau();
    const stunden = d.stunden ?? STUNDEN_JAHR;
    const v = b.wert('verfuegbarkeit', (d.mtbf / (d.mtbf + d.mttr)) * 100, { label: 'Verfügbarkeit', einheit: '%', runden: 3 });
    b.schritt({
      titel: 'Verfügbarkeit',
      formel: F.mtbf.latex,
      einsetzen: L`\frac{${lz(d.mtbf)}}{${lz(d.mtbf)} + ${lz(d.mttr)}}`,
      ergebnis: v,
      einheit: '%',
      runden: 3,
    });
    b.fehler(
      'verfuegbarkeit',
      ((d.mtbf - d.mttr) / d.mtbf) * 100,
      'Du hast die MTTR von der MTBF abgezogen – die Formel ist MTBF / (MTBF **+** MTTR).',
    );
    b.fehler('verfuegbarkeit', (d.mttr / d.mtbf) * 100, 'Das ist das Verhältnis MTTR / MTBF – gesucht ist MTBF / (MTBF + MTTR).');

    const ausfall = b.wert('ausfallJahr', stunden * (1 - v / 100), {
      label: stunden === STUNDEN_JAHR ? 'Erwartete Ausfallzeit pro Jahr' : `Erwartete Ausfallzeit in ${fz(stunden)} h`,
      einheit: 'h',
      runden: 2,
    });
    b.schritt({
      titel: 'Erwartete Ausfallzeit',
      formel: F.ausfallzeit.latex,
      einsetzen: L`${lz(stunden)}\ \text{h} \cdot (1 - ${az(v / 100)})`,
      ergebnis: ausfall,
      einheit: 'h',
      runden: 2,
    });
    b.fehler('ausfallJahr', stunden * (v / 100), 'Das ist die erwartete **Betriebszeit** – gefragt ist der Rest: · (1 − V).');
    return b.fertig();
  },
});

// ---------- Systemverfügbarkeit: Reihenschaltung mit redundanten Stufen ----------

const stufe = z.object({
  name: z.string().trim().min(1),
  v: prozent,
  /** Anzahl gleichwertiger, parallel (redundant) betriebener Komponenten dieser Stufe; Standard 1. */
  anzahl: z.number().int().min(1).max(4).optional(),
});
const systemSchema = z.object({ komponenten: z.array(stufe).min(1).max(6) });

/** Verfügbarkeit (als Anteil) einer Stufe mit n parallelen Komponenten: 1 − (1 − V)^n. */
const stufenV = (v: number, n: number) => 1 - (1 - v / 100) ** n;

export const systemverfuegbarkeit = vorlage({
  id: 'systemverfuegbarkeit',
  titel: 'Verfügbarkeit von Reihen- und Parallelschaltungen',
  bereich: 'Qualitätssicherung / Verfügbarkeit',
  beschreibung:
    'Komponenten in Reihe: Verfügbarkeiten multiplizieren; redundante Stufen (parallel): 1 − (1 − V)ⁿ. Ergebnis: Gesamtverfügbarkeit.',
  schema: systemSchema,
  hinweise: [
    'Reihenschaltung: alle müssen laufen → V₁ · V₂ · … (als Anteil, 99 % = 0,99).',
    'Parallelschaltung: mindestens eine muss laufen → 1 − (1 − V)ⁿ – multipliziert werden die Ausfallwahrscheinlichkeiten.',
    'Erst jede redundante Stufe ausrechnen, dann alle Stufen multiplizieren.',
  ],
  erzeuge(z, _params, vorbild) {
    const vorlageStufen = vorbild?.komponenten ?? [{ name: 'Webserver' }, { name: 'Datenbank', anzahl: 2 }];
    return {
      komponenten: vorlageStufen.map((k) => ({
        name: k.name,
        v: z.wahl([95, 97, 98, 99, 99.5, 99.9]),
        ...(k.anzahl !== undefined ? { anzahl: k.anzahl } : {}),
      })),
    };
  },
  platzhalter: (d) => ({
    komponenten: d.komponenten
      .map((k) => `${k.name} (${fz(k.v)} %${(k.anzahl ?? 1) > 1 ? `, ${k.anzahl}-fach redundant` : ''})`)
      .join(' · '),
    anzahl: String(d.komponenten.length),
  }),
  tabelle: (d) => ({
    kopf: ['Komponente', 'Verfügbarkeit', 'Anzahl parallel'],
    zeilen: d.komponenten.map((k) => [k.name, `${fz(k.v)} %`, fz(k.anzahl ?? 1)]),
  }),
  loese(d) {
    const b = new LoesungsBau();
    const stufen = d.komponenten.map((k, i) => {
      const n = k.anzahl ?? 1;
      const sv = stufenV(k.v, n);
      b.wert(`stufe${i + 1}`, sv * 100, { label: `Verfügbarkeit Stufe ${k.name}`, einheit: '%', runden: 3, zusatz: true });
      if (n > 1) {
        b.schritt({
          titel: `${k.name} (${n}-fach parallel)`,
          formel: F.parallelschaltung.latex,
          einsetzen: L`1 - (1 - ${anteil(k.v)})^{${n}}`,
          ergebnis: sv * 100,
          einheit: '%',
          runden: 3,
        });
      }
      return sv;
    });
    const gesamt = b.wert('gesamt', stufen.reduce((p, s) => p * s, 1) * 100, { label: 'Gesamtverfügbarkeit', einheit: '%', runden: 3 });
    b.schritt({
      titel: d.komponenten.length > 1 ? 'Reihenschaltung aller Stufen' : 'Gesamtverfügbarkeit',
      formel: F.reihenschaltung.latex,
      einsetzen: stufen.map((s) => az(s)).join(L` \cdot `),
      ergebnis: gesamt,
      einheit: '%',
      runden: 3,
    });
    b.wert('ausfallJahr', STUNDEN_JAHR * (1 - gesamt / 100), {
      label: 'Erwartete Ausfallzeit pro Jahr (24/7)',
      einheit: 'h',
      runden: 2,
      zusatz: true,
    });

    if (d.komponenten.some((k) => (k.anzahl ?? 1) > 1)) {
      b.fehler(
        'gesamt',
        d.komponenten.reduce((p, k) => p * (k.v / 100), 1) * 100,
        'Hier fehlt die Redundanz: Die parallelen Komponenten einer Stufe erhöhen deren Verfügbarkeit auf 1 − (1 − V)ⁿ.',
      );
      b.fehler(
        'gesamt',
        d.komponenten.reduce((p, k) => p * (k.v / 100) ** (k.anzahl ?? 1), 1) * 100,
        'Bei der Parallelschaltung werden die **Ausfall**wahrscheinlichkeiten multipliziert, nicht die Verfügbarkeiten – sonst sinkt die Verfügbarkeit durch Redundanz.',
      );
    }
    if (d.komponenten.length > 1) {
      b.fehler(
        'gesamt',
        mittel(stufen) * 100,
        'Verfügbarkeiten in Reihe werden **multipliziert**, nicht gemittelt – jede Komponente ist ein eigener Ausfallgrund.',
      );
      b.fehler(
        'gesamt',
        Math.min(...stufen) * 100,
        'Das ist die schwächste Stufe – die Reihenschaltung ist noch schlechter, weil alle Stufen gleichzeitig laufen müssen.',
      );
    }
    return b.fertig();
  },
});
