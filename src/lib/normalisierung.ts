// Normalisierungs-Übungen (/normalisierung): Antwort im Tabellen-Editor, Prüfung gegen die Musterlösung je Schritt und der Entwurf im
// Browser. Fortschritt wie bei den JSON- und XML-Übungen in Progress.json (IDs „NF-…“, Funktionen aus jsonUebungen.ts). Rein, ohne React.

import { fkZiel, leseRelation, nfName, type NfSchritt, type NormalisierungUebung } from '../../domain/normalisierungUebungen';
import type { Content, Section } from '../../domain/types';
import { leseEditorAntwort } from './editorAufgabe';
import {
  abgleichOk,
  gleicheAb,
  istTabellenLeer,
  type MusterTabelle,
  type SchemaAbgleich,
  type Tabelle,
  type TabellenAntwort,
} from './tabellenEditor';

/** Alle Normalisierungs-Übungen (ältere Stände ohne das Feld: keine). */
export const normalisierungUebungen = (content: Pick<Content, 'normalisierungUebungen'>): NormalisierungUebung[] =>
  content.normalisierungUebungen ?? [];

/** Tabellen eines Lösungsschritts im Format des Tabellenabgleichs. */
export function musterDesSchritts(s: NfSchritt): MusterTabelle[] {
  return s.tabellen
    .map((t) => leseRelation(t.relation))
    .filter((r) => !!r)
    .map((r) => ({ name: r.name, spalten: r.spalten, offen: false }));
}

/** Lösungsschritt als Tabellen (für Diagramm und Ansicht), Fremdschlüsselziele eingesetzt. */
export function tabellenDesSchritts(s: NfSchritt): Tabelle[] {
  const tabellen: Tabelle[] = s.tabellen.flatMap((t, i) => {
    const r = leseRelation(t.relation);
    return r ? [{ id: `m${i}`, name: r.name, spalten: r.spalten.map((x) => ({ ...x })), zeilen: t.zeilen ?? [] }] : [];
  });
  for (const t of tabellen)
    for (const sp of t.spalten.filter((x) => x.fk)) sp.ziel = fkZiel(tabellen, t, sp.name, s.ziele?.[`${t.name}.${sp.name}`])?.name;
  return tabellen;
}

/** Leerer Editor: so viele Schritte wie die Musterlösung, gleiche Titel. */
export const leereNfAntwort = (u: NormalisierungUebung): TabellenAntwort => ({
  editor: 'normalform',
  schritte: u.loesung.map((s) => ({ titel: s.titel, text: '', tabellen: [] })),
});

/** Gespeicherten Entwurf lesen und an die Schritte der Übung anpassen; Unlesbares ergibt einen leeren Editor. */
export function leseNfAntwort(u: NormalisierungUebung, raw: string | undefined): TabellenAntwort {
  const leer = leereNfAntwort(u);
  if (!raw) return leer;
  const a = leseEditorAntwort('normalform', { markdown: '' }, raw);
  if (a.editor !== 'normalform' || !('schritte' in a) || a.notiz === raw) return leer;
  return {
    ...leer,
    schritte: leer.schritte.map((s, i) => ({ ...s, text: a.schritte[i]?.text ?? '', tabellen: a.schritte[i]?.tabellen ?? [] })),
  };
}

/** Ausgangstabelle als Anlage – der Editor bietet „Ausgangstabelle übernehmen“ an. */
export function ausgangAlsAnlage(u: NormalisierungUebung): Section[] {
  if (!u.ausgang) return [];
  const zeile = (z: string[]) => `| ${z.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`;
  return [
    {
      id: `${u.id}-ausgang`,
      title: `Ausgangstabelle „${u.ausgang.name}“`,
      level: 2,
      markdown: [zeile(u.ausgang.kopf), `|${u.ausgang.kopf.map(() => '---').join('|')}|`, ...u.ausgang.zeilen.map(zeile)].join('\n'),
    },
  ];
}

export interface FkBefund {
  tabelle: string;
  spalte: string;
  /** Gewähltes Ziel ohne passenden Primärschlüssel. */
  meldung: string;
}

/** Im Editor gewählte Fremdschlüsselziele: Hat die Zieltabelle die Spalte als Primärschlüssel? */
export function pruefeFkZiele(tabellen: Tabelle[], erlaubt?: Record<string, string>): FkBefund[] {
  const befunde: FkBefund[] = [];
  for (const t of tabellen)
    for (const sp of t.spalten.filter((x) => x.fk && x.ziel && x.name.trim())) {
      const ziel = tabellen.find((x) => nfName(x.name) === nfName(sp.ziel!));
      if (!ziel) continue;
      const anders = Object.entries(erlaubt ?? {}).some(
        ([k, v]) => nfName(k.split('.')[1] ?? '') === nfName(sp.name) && nfName(v) === nfName(ziel.name),
      );
      const passt = ziel.spalten.some((x) => x.pk && nfName(x.name) === nfName(sp.name));
      if (!passt && !anders && ziel !== t)
        befunde.push({
          tabelle: t.name.trim(),
          spalte: sp.name.trim(),
          meldung: `${sp.name.trim()} verweist auf „${ziel.name.trim()}“, dort ist ${sp.name.trim()} aber nicht der Primärschlüssel.`,
        });
    }
  return befunde;
}

export interface SchrittPruefung {
  titel: string;
  leer: boolean;
  abgleich: SchemaAbgleich;
  fk: FkBefund[];
  ok: boolean;
}

export interface NfPruefung {
  schritte: SchrittPruefung[];
  ok: boolean;
}

/** „Prüfen“: jeden Schritt mit der Musterlösung abgleichen. Richtig = alle Tabellen passen, keine übrig, FK-Ziele stimmig. */
export function pruefeNfAntwort(u: NormalisierungUebung, a: TabellenAntwort): NfPruefung {
  const schritte = u.loesung.map((s, i): SchrittPruefung => {
    const eigene = a.schritte[i]?.tabellen ?? [];
    const abgleich = gleicheAb(eigene, musterDesSchritts(s));
    const fk = pruefeFkZiele(eigene, s.ziele);
    const leer = !eigene.some((t) => t.spalten.some((x) => x.name.trim()));
    return { titel: s.titel, leer, abgleich, fk, ok: !leer && abgleich.zeilen.every(abgleichOk) && !abgleich.uebrig.length && !fk.length };
  });
  return { schritte, ok: schritte.every((s) => s.ok) };
}

// ---------- Entwurf (nur dieser Browser) ----------

const ENTWURF_SPEICHER = 'ap2-nf-entwurf';

function leseAlle(): Record<string, string> {
  try {
    const roh = localStorage.getItem(ENTWURF_SPEICHER);
    const d: unknown = roh ? JSON.parse(roh) : {};
    return d && typeof d === 'object' && !Array.isArray(d) ? (d as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** Gespeicherter Entwurf einer Übung (JSON des Tabellen-Editors) – fehlt, wenn nichts gespeichert oder der Speicher gesperrt ist. */
export const leseNfEntwurf = (id: string): string | undefined => leseAlle()[id];

/** Entwurf speichern; ein leerer Editor löscht ihn. Eine Bequemlichkeit – nicht Teil des Fortschritts und der Sicherung. */
export function schreibeNfEntwurf(id: string, a: TabellenAntwort | undefined) {
  try {
    const alle = leseAlle();
    if (!a || istTabellenLeer(a)) delete alle[id];
    else alle[id] = JSON.stringify(a);
    localStorage.setItem(ENTWURF_SPEICHER, JSON.stringify(alle));
  } catch {
    // Speicher gesperrt (privates Fenster): dann eben ohne Entwurf.
  }
}
