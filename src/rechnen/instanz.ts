// Eine Rechenübung mit konkreten Zahlen: Daten (fest oder aus einem Seed erzeugt), Lösung der Vorlage,
// aufgelöste Eingaben (Label, Einheit, Rundung, erwarteter Wert) und der Aufgabentext mit ersetzten Platzhaltern.

import type { RechenEingabe, RechenUebung, RechenWert } from '../../shared/types.ts';
import type { Loesung, Tabelle, Vergleich } from './typen.ts';
import { findeVorlage } from './vorlagen/index.ts';
import { seedAusText } from './zufall.ts';

export interface AufgeloesteEingabe {
  id: string;
  label: string;
  einheit?: string;
  runden?: number;
  toleranz?: number;
  erwartet: RechenWert;
  vergleich: Vergleich;
}

export interface RechenInstanz {
  /** undefined = die festen Daten der Übung. */
  seed?: number;
  loesung: Loesung;
  eingaben: AufgeloesteEingabe[];
  /** Aufgabentext mit ersetzten Platzhaltern. */
  aufgabe: string;
  hinweise: string[];
  tabelle?: Tabelle;
  /** Platzhalter im Text, die die Vorlage nicht kennt (für die Importprüfung). */
  unbekanntePlatzhalter: string[];
}

const PLATZHALTER = /\{\{\s*([\w.-]+)\s*\}\}/g;

export function ersetzePlatzhalter(text: string, werte: Record<string, string>, unbekannt: string[] = []): string {
  return text.replace(PLATZHALTER, (m, name: string) => {
    if (Object.hasOwn(werte, name)) return werte[name];
    unbekannt.push(name);
    return m;
  });
}

const vergleichVon = (w: RechenWert): Vergleich => (typeof w === 'number' ? 'zahl' : Array.isArray(w) ? 'liste' : 'text');

/**
 * Baut die Übung mit konkreten Zahlen. `seed` undefined → feste Daten der Übung (oder, ohne Daten, ein Seed aus der ID);
 * sonst Zufallsdaten der Vorlage (die festen Daten geben dabei die Form vor). Wirft einen Error mit deutscher Meldung,
 * wenn Vorlage, Daten und Eingaben nicht zusammenpassen.
 */
export function baueInstanz(u: RechenUebung, seed?: number): RechenInstanz {
  if (!u.vorlage) {
    const werte: Record<string, RechenWert> = {};
    for (const e of u.eingaben) werte[e.id] = e.loesung!;
    return {
      loesung: { werte, felder: {}, schritte: [], fehlerbilder: [] },
      eingaben: u.eingaben.map((e) => ({
        id: e.id,
        label: e.label ?? e.id,
        einheit: e.einheit,
        runden: e.runden,
        toleranz: e.toleranz,
        erwartet: e.loesung!,
        vergleich: vergleichVon(e.loesung!),
      })),
      aufgabe: u.aufgabe,
      hinweise: u.hinweise,
      unbekanntePlatzhalter: [],
    };
  }

  const v = findeVorlage(u.vorlage);
  if (!v) throw new Error(`unbekannte Vorlage „${u.vorlage}“`);
  let daten: unknown;
  let vorbild: unknown;
  if (u.daten) {
    const parsed = v.schema.safeParse(u.daten);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      throw new Error(
        `Daten passen nicht zur Vorlage ${v.id}: ${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'ungültig'}`,
      );
    }
    vorbild = parsed.data;
  }
  const genutzterSeed = seed ?? (vorbild === undefined ? seedAusText(u.id) : undefined);
  if (genutzterSeed === undefined) daten = vorbild;
  else {
    const erzeugt = v.schema.safeParse(v.erzeuge(genutzterSeed, u.params ?? {}, vorbild));
    if (!erzeugt.success)
      throw new Error(`Vorlage ${v.id} hat ungültige Zufallsdaten erzeugt (${erzeugt.error.issues[0]?.message ?? 'ungültig'})`);
    daten = erzeugt.data;
  }

  const loesung = v.loese(daten);
  const ids: RechenEingabe[] = u.eingaben.length
    ? u.eingaben
    : Object.keys(loesung.felder)
        .filter((id) => !loesung.felder[id].zusatz)
        .map((id) => ({ id }));
  const eingaben: AufgeloesteEingabe[] = ids.map((e) => {
    const erwartet = loesung.werte[e.id];
    const feld = loesung.felder[e.id];
    if (erwartet === undefined || !feld) throw new Error(`Eingabe „${e.id}“ gibt es in der Vorlage ${v.id} nicht (bei diesen Daten)`);
    return {
      id: e.id,
      label: e.label ?? feld.label,
      einheit: e.einheit ?? feld.einheit,
      runden: e.runden ?? feld.runden,
      toleranz: e.toleranz,
      erwartet,
      vergleich: feld.vergleich ?? vergleichVon(erwartet),
    };
  });
  const unbekannt: string[] = [];
  const platz = v.platzhalter(daten);
  return {
    seed: genutzterSeed,
    loesung,
    eingaben,
    aufgabe: ersetzePlatzhalter(u.aufgabe, platz, unbekannt),
    hinweise: (u.hinweise.length ? u.hinweise : v.hinweise).map((h) => ersetzePlatzhalter(h, platz, unbekannt)),
    tabelle: v.tabelle?.(daten),
    unbekanntePlatzhalter: [...new Set(unbekannt)],
  };
}
