// Alle Rechenvorlagen nach ID. Neue Vorlage: Datei in diesem Ordner, hier in `alle` eintragen (tests/vorlagen.test.ts prüft sie dann
// automatisch), Übung in AP2_Rechen_Uebungen.json anlegen und die Vorlage in der Dokumentation beschreiben.

import type { Vorlage } from '../typen.ts';
import { assoziation, kmeans } from './crispdm.ts';
import { qualitaetsgrad } from './datenqualitaet.ts';
import { id3, knn } from './klassifikation.ts';
import { konfusionsmatrix, regressionsguete } from './modellguete.ts';
import { neuron, perzeptron } from './neuronal.ts';
import { breakEven, netzplan, nutzwert, pert, risiko } from './projekt.ts';
import { amortisation, durchlaufzeit, fehlerquote, fmea } from './prozess.ts';
import { datensicherung, rpo } from './sicherung.ts';
import { gewichtetesMittel, haeufigkeiten, lagemasse, quartile, varianz, variationskoeffizient } from './statistik1.ts';
import { mtbf, systemverfuegbarkeit, verfuegbarkeit } from './verfuegbarkeit.ts';
import { gleitenderDurchschnitt, korrelation, prozentVeraenderung, regression } from './statistik2.ts';
import { gleichgewicht, minijob, sozialversicherung } from './wiso.ts';

const alle = [
  lagemasse,
  gewichtetesMittel,
  quartile,
  varianz,
  variationskoeffizient,
  haeufigkeiten,
  korrelation,
  regression,
  gleitenderDurchschnitt,
  prozentVeraenderung,
  konfusionsmatrix,
  regressionsguete,
  assoziation,
  kmeans,
  knn,
  id3,
  neuron,
  perzeptron,
  durchlaufzeit,
  fehlerquote,
  amortisation,
  fmea,
  qualitaetsgrad,
  netzplan,
  nutzwert,
  breakEven,
  risiko,
  pert,
  sozialversicherung,
  minijob,
  gleichgewicht,
  datensicherung,
  rpo,
  verfuegbarkeit,
  mtbf,
  systemverfuegbarkeit,
] as unknown as Vorlage<unknown>[];

/** Vorlagen nach ID. Eine doppelte ID würde die erste stillschweigend überschreiben – deshalb bricht schon das Laden ab. */
export function registriereVorlagen(liste: readonly Vorlage<unknown>[]): Record<string, Vorlage<unknown>> {
  const nachId: Record<string, Vorlage<unknown>> = {};
  for (const v of liste) {
    if (Object.hasOwn(nachId, v.id)) throw new Error(`Doppelte Rechenvorlage „${v.id}“ (src/rechnen/vorlagen/index.ts)`);
    nachId[v.id] = v;
  }
  return nachId;
}

export const VORLAGEN: Record<string, Vorlage<unknown>> = registriereVorlagen(alle);

export function findeVorlage(id: string | undefined): Vorlage<unknown> | undefined {
  return id === undefined ? undefined : Object.hasOwn(VORLAGEN, id) ? VORLAGEN[id] : undefined;
}
