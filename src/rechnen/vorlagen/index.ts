// Alle Rechenvorlagen nach ID. Neue Vorlage: Datei in diesem Ordner, hier eintragen, in DOKUMENTATION § 4.4 beschreiben.

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

export const VORLAGEN: Record<string, Vorlage<unknown>> = Object.fromEntries(alle.map((v) => [v.id, v]));

export function findeVorlage(id: string | undefined): Vorlage<unknown> | undefined {
  return id === undefined ? undefined : Object.hasOwn(VORLAGEN, id) ? VORLAGEN[id] : undefined;
}
