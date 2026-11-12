// Datensicherung (Deep Dive 10): Sicherungsvolumen und benötigte Medien bei inkrementeller und differenzieller Sicherung,
// maximaler Datenverlust gegenüber einer RPO-Vorgabe.

import { z } from 'zod';
import { fz, L, LoesungsBau, lz, vorlage } from '../hilfen.ts';
import { F } from '../formeln.ts';

const dsSchema = z.object({
  voll: z.number().positive(),
  aenderung: z.number().positive(),
  /** Anzahl der täglichen Sicherungen nach der Vollsicherung bis zum Ausfall (z. B. Mo–Mi = 3). */
  tage: z.number().int().min(1).max(30),
  einheit: z.string().trim().min(1).optional(),
});

export const datensicherung = vorlage({
  id: 'datensicherung',
  titel: 'Inkrementelle und differenzielle Sicherung',
  bereich: 'IT-Sicherheit',
  beschreibung: 'Gesamtes Sicherungsvolumen und Anzahl Medien für die Wiederherstellung – inkrementell und differenziell.',
  schema: dsSchema,
  hinweise: [
    'Inkrementell: jede Sicherung enthält nur die Änderungen seit der **letzten** Sicherung.',
    'Differenziell: jede Sicherung enthält alle Änderungen seit der **Vollsicherung** – sie wächst täglich.',
    'Wiederherstellung: inkrementell Vollsicherung + alle Inkremente; differenziell Vollsicherung + letzte Differenz.',
  ],
  erzeuge(z, _params, vorbild) {
    return {
      voll: z.ganz(2, 20) * 100,
      aenderung: z.ganz(1, 10) * 10,
      tage: z.ganz(2, 6),
      ...(vorbild?.einheit ? { einheit: vorbild.einheit } : {}),
    };
  },
  platzhalter: (d) => ({ voll: fz(d.voll), aenderung: fz(d.aenderung), tage: String(d.tage), einheit: d.einheit ?? 'GB' }),
  loese(d) {
    const b = new LoesungsBau();
    const e = d.einheit ?? 'GB';
    const t = d.tage;
    const ink = b.wert('volumenInkrementell', d.voll + t * d.aenderung, { label: 'Volumen inkrementell', einheit: e, runden: 2 });
    const tri = (t * (t + 1)) / 2;
    const dif = b.wert('volumenDifferenziell', d.voll + tri * d.aenderung, { label: 'Volumen differenziell', einheit: e, runden: 2 });
    b.wert('medienInkrementell', 1 + t, { label: 'Medien zur Wiederherstellung (inkrementell)' });
    b.wert('medienDifferenziell', 2, { label: 'Medien zur Wiederherstellung (differenziell)' });
    b.schritt({
      titel: 'Inkrementell',
      formel: F.sicherungInkrementell.latex,
      einsetzen: L`${lz(d.voll)} + ${t} \cdot ${lz(d.aenderung)}`,
      ergebnis: ink,
      einheit: e,
      hinweis: `Wiederherstellung: Vollsicherung + ${t} Inkremente = ${1 + t} Medien.`,
    });
    b.schritt({
      titel: 'Differenziell',
      formel: F.sicherungDifferenziell.latex,
      einsetzen: L`${lz(d.voll)} + ${Array.from({ length: t }, (_, i) => lz((i + 1) * d.aenderung)).join(' + ')}`,
      ergebnis: dif,
      einheit: e,
      hinweis: 'Wiederherstellung: Vollsicherung + letzte differenzielle Sicherung = 2 Medien.',
    });
    b.fehler(
      'volumenDifferenziell',
      ink,
      'So rechnet man inkrementell – differenziell enthält jede Sicherung **alle** Änderungen seit der Vollsicherung.',
    );
    b.fehler(
      'volumenInkrementell',
      dif,
      'So rechnet man differenziell – inkrementell enthält jede Sicherung nur die Änderungen seit der **letzten** Sicherung.',
    );
    b.fehler('medienDifferenziell', 1 + t, 'Differenziell brauchst du nur die Vollsicherung und die **letzte** differenzielle Sicherung.');
    b.fehler('medienInkrementell', 2, 'Inkrementell brauchst du die Vollsicherung und **alle** Inkremente.');
    b.fehler('medienInkrementell', t, 'Die Vollsicherung zählt auch als Medium.');
    return b.fertig();
  },
});

const rpoSchema = z.object({
  /** Uhrzeit der letzten Sicherung in Stunden (23 = 23:00 Uhr, 22,5 = 22:30 Uhr). */
  sicherungUm: z.number().min(0).max(24),
  /** Uhrzeit des Ausfalls (liegt sie vor der Sicherungszeit, ist es der nächste Tag). */
  ausfallUm: z.number().min(0).max(24),
  rpo: z.number().positive().optional(),
});

const uhr = (h: number) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

export const rpo = vorlage({
  id: 'rpo',
  titel: 'Maximaler Datenverlust und RPO',
  bereich: 'IT-Sicherheit',
  beschreibung: 'Zeit zwischen letzter Sicherung und Ausfall (über Mitternacht) und ob eine RPO-Vorgabe eingehalten wird.',
  schema: rpoSchema,
  hinweise: [
    'Datenverlust = Zeit seit der letzten erfolgreichen Sicherung.',
    'Über Mitternacht: bis 24:00 und ab 0:00 zusammenzählen.',
    'RPO eingehalten, wenn Verlust ≤ RPO.',
  ],
  erzeuge(z, _params, vorbild) {
    return {
      sicherungUm: z.ganz(18, 23),
      ausfallUm: z.ganz(6, 17),
      ...(vorbild?.rpo !== undefined ? { rpo: z.wahl([2, 4, 8, 12, 24]) } : {}),
    };
  },
  platzhalter: (d) => ({ sicherungUm: uhr(d.sicherungUm), ausfallUm: uhr(d.ausfallUm), rpo: d.rpo === undefined ? '–' : fz(d.rpo) }),
  loese(d) {
    const b = new LoesungsBau();
    const ueberNacht = d.ausfallUm < d.sicherungUm;
    const verlust = b.wert('verlust', ueberNacht ? 24 - d.sicherungUm + d.ausfallUm : d.ausfallUm - d.sicherungUm, {
      label: 'Maximaler Datenverlust',
      einheit: 'h',
      runden: 2,
    });
    b.schritt({
      titel: 'Maximaler Datenverlust',
      formel: ueberNacht ? L`(24 - t_{Sicherung}) + t_{Ausfall}` : L`t_{Ausfall} - t_{Sicherung}`,
      einsetzen: ueberNacht ? L`(24 - ${lz(d.sicherungUm)}) + ${lz(d.ausfallUm)}` : L`${lz(d.ausfallUm)} - ${lz(d.sicherungUm)}`,
      ergebnis: verlust,
      einheit: 'h',
      runden: 2,
    });
    b.fehler('verlust', Math.abs(d.ausfallUm - d.sicherungUm), 'Die Sicherung war am **Vortag** – rechne über Mitternacht.');
    b.fehler(
      'verlust',
      24 - verlust,
      'Du hast die Zeit von der Störung bis zur nächsten Sicherung gerechnet – verloren geht die Zeit **seit** der letzten Sicherung.',
    );
    if (d.rpo !== undefined) {
      const ok = verlust <= d.rpo;
      b.wert('eingehalten', ok ? 'ja' : 'nein', { label: `RPO von ${fz(d.rpo)} h eingehalten? (ja/nein)`, vergleich: 'text' });
      b.fehler(
        'eingehalten',
        ok ? 'nein' : 'ja',
        ok ? 'Der Verlust liegt innerhalb der RPO.' : 'Der mögliche Verlust ist größer als die RPO – sie wird verfehlt.',
      );
    }
    return b.fertig();
  },
});
