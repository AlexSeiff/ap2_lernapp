// Begriffsseiten im Client (Umsetzungsplan Phase 3): Laden (getrennt von content.json), Verweise auflösen und die passenden Übungen
// eines Begriffs finden. Rein bis auf ladeBegriffe(); getestet in tests/begriffe.test.ts.

import { namensSchluessel, seitenNachName } from '../../shared/begriffsseiten';
import { DIAGRAMM_TYP_NAMEN, type DiagrammTyp, type DiagrammUebung } from '../../shared/diagrammUebungen';
import type { KernInhalt } from '../../shared/texte';
import type { BegriffKurz, BegriffsSeite, Flashcard, RechenUebung, SqlExercise, Task } from '../../shared/types';
import { api } from './api';
import { glossarSchluessel, ueberschriftKern, type GlossarEintrag } from './glossar';
import { normalisiere } from './normalisiere';

let laden: Promise<BegriffsSeite[]> | undefined;

/** Alle Begriffsseiten mit Text – einmal je Sitzung geladen (Pages: begriffe.json, offline aus dem Service-Worker-Cache). */
export function ladeBegriffe(): Promise<BegriffsSeite[]> {
  laden ??= api.begriffe().catch((e: unknown) => {
    laden = undefined; // beim nächsten Versuch neu laden
    throw e;
  });
  return laden;
}

export const begriffPfad = (id: string) => `/glossar/${encodeURIComponent(id)}`;

export interface Verweis {
  text: string;
  link?: string;
  /** Begriffsseite, Glossareintrag ohne Seite oder Abschnitt eines Lernblatts. */
  art?: 'seite' | 'glossar' | 'abschnitt';
}

/**
 * Löst Namen aus „Siehe auch“ auf: zuerst eine Begriffsseite (auch über „Auch“-Varianten), dann ein Glossareintrag ohne Seite,
 * zuletzt ein Lernblatt-Abschnitt mit genau dieser Überschrift. Sonst bleibt der Name ohne Link.
 */
export function verweisAufloeser(
  begriffe: Pick<BegriffKurz, 'id' | 'begriff' | 'auch'>[],
  glossar: Pick<GlossarEintrag, 'id' | 'begriff'>[],
  content: Pick<KernInhalt, 'topics'>,
): (name: string) => Verweis {
  const seiten = seitenNachName(begriffe);
  const eintraege = new Map(glossar.map((e) => [namensSchluessel(e.begriff), e.id]));
  const abschnitte = new Map<string, string>();
  for (const t of content.topics)
    for (const s of t.sections) {
      const k = namensSchluessel(ueberschriftKern(s.title));
      if (k && !s.generiert && !abschnitte.has(k)) abschnitte.set(k, `/lernen/${t.id}?stelle=${encodeURIComponent(s.id)}`);
    }
  return (name) => {
    const k = namensSchluessel(name);
    const seite = seiten.get(k);
    if (seite) return { text: name, link: begriffPfad(seite), art: 'seite' };
    const eintrag = eintraege.get(k);
    if (eintrag) return { text: name, link: `/glossar?stelle=g-${eintrag}`, art: 'glossar' };
    const abschnitt = abschnitte.get(k);
    if (abschnitt) return { text: name, link: abschnitt, art: 'abschnitt' };
    return { text: name };
  };
}

/**
 * Begriffsseite zu einem Glossareintrag: gleiche id oder ein Name, der Begriff bzw. „Auch“-Variante einer Seite ist
 * („Akteure“ → Seite „Akteur“). Liefert die id der Seite oder undefined.
 */
export function seitenFinder(
  begriffe: Pick<BegriffKurz, 'id' | 'begriff' | 'auch'>[],
): (e: Pick<GlossarEintrag, 'id' | 'begriff'>) => string | undefined {
  const ids = new Set(begriffe.map((b) => b.id));
  const namen = seitenNachName(begriffe);
  return (e) => (ids.has(e.id) ? e.id : namen.get(namensSchluessel(e.begriff)));
}

/** Suchwörter eines Begriffs: Begriff ohne Klammerzusatz, die Abkürzung in Klammern und die „Auch“-Varianten (normalisiert). */
export function begriffsWoerter(b: Pick<BegriffKurz, 'begriff' | 'auch'>): string[] {
  const roh = [b.begriff, b.begriff.replace(/\s*\([^)]*\)/g, ''), /\(([^)]+)\)/.exec(b.begriff)?.[1] ?? '', ...(b.auch ?? [])];
  return [...new Set(roh.map(normalisiere).filter((w) => w.length >= 2))];
}

/** Kommt eines der Wörter als ganzes Wort (bzw. Wortfolge) im normalisierten Text vor? */
const enthaelt = (textN: string, woerter: string[]) => woerter.some((w) => ` ${textN} `.includes(` ${w} `));

export interface Uebungen {
  karten: Flashcard[];
  /** Die Begriffskarte (typ „begriff“, Frage = der Begriff), falls es eine gibt – sie steht auch als erste in `karten`. */
  begriffskarte?: Flashcard;
  aufgaben: Task[];
  rechnen: RechenUebung[];
  sql: SqlExercise[];
  /** Diagramm-Übungen (Umsetzungsplan Phase 7): alle des Diagrammtyps, wenn der Begriff der Typ ist, sonst über den Text. */
  diagramme: DiagrammUebung[];
}

/** Begriffe, die einen Diagrammtyp bezeichnen (normalisiert) – ihre Seite zeigt alle Übungen dieses Typs. */
const TYP_BEGRIFFE: [DiagrammTyp, string[]][] = [
  ['epk', ['epk', 'eepk', 'ereignisgesteuerte prozesskette', 'erweiterte ereignisgesteuerte prozesskette']],
  ['bpmn', ['bpmn', 'bpmn 2 0', 'business process model and notation']],
  ['aktivitaet', ['aktivitatsdiagramm', 'uml aktivitatsdiagramm']],
  ['sequenz', ['sequenzdiagramm', 'uml sequenzdiagramm']],
  ['zustand', ['zustandsdiagramm', 'uml zustandsdiagramm', 'zustandsautomat']],
];

/**
 * Übungen zu einem Begriff (für „Üben“ auf der Begriffsseite): Karten, deren Frage den Begriff nennt (die Begriffskarte zuerst), dann
 * Karten, deren Antwort ihn nennt; Einzelaufgaben, Rechen- und SQL-Übungen, deren Text ihn nennt. Ganze Wörter, Groß-/Kleinschreibung
 * und Umlaut-Schreibweisen egal. `cards` = die Karten, die der Nutzer sieht (cardPool).
 */
export function uebungenZuBegriff(b: Pick<BegriffKurz, 'begriff' | 'auch'>, content: KernInhalt, cards: Flashcard[]): Uebungen {
  const woerter = begriffsWoerter(b);
  const schluessel = glossarSchluessel(b.begriff);
  const begriffskarte = (c: Flashcard) => c.typ === 'begriff' && glossarSchluessel(c.question) === schluessel;
  const inFrage = cards.filter((c) => !begriffskarte(c) && enthaelt(normalisiere(c.question), woerter));
  const inAntwort = cards.filter((c) => !begriffskarte(c) && !inFrage.includes(c) && c.answer && enthaelt(normalisiere(c.answer), woerter));
  const eigene = cards.filter(begriffskarte);
  return {
    karten: [...eigene, ...inFrage, ...inAntwort],
    ...(eigene.length ? { begriffskarte: eigene[0] } : {}),
    aufgaben: Object.values(content.tasks).filter((t) => enthaelt(normalisiere(t.markdown), woerter)),
    rechnen: content.rechenUebungen.filter((u) => enthaelt(normalisiere(`${u.titel} ${u.aufgabe}`), woerter)),
    sql: content.sqlExercises.filter((u) => enthaelt(normalisiere(`${u.titel} ${u.aufgabe}`), woerter)),
    diagramme: (content.diagrammUebungen ?? []).filter((u) => {
      const typ = (TYP_BEGRIFFE.find(([t]) => t === u.typ)?.[1] ?? []).map(normalisiere);
      if (woerter.some((w) => typ.includes(w))) return true;
      const text = `${u.titel} ${DIAGRAMM_TYP_NAMEN[u.typ]} ${u.szenario} ${u.palette.map((p) => p.text).join(' ')}`;
      return enthaelt(normalisiere(text), woerter);
    }),
  };
}
