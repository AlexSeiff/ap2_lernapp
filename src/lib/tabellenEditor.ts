// Tabellen-Editor für Normalisierung (je Schritt 1. NF, 2. NF, 3. NF) und Relationenmodell/Star-Schema: Modell, Relationenschreibweise
// wie auf den Blättern (fett = PK, ↑ = FK), Ausgangstabelle aus der Anlage und der Abgleich mit den Tabellen der Musterlösung.
// Der Abgleich ist eine Hilfe zur Selbstbewertung: Namen dürfen abweichen, entscheiden tust du. Rein, ohne React.

import type { Section } from '../../shared/types';

export interface Spalte {
  name: string;
  pk?: boolean;
  fk?: boolean;
  /** Name der Tabelle, auf die der Fremdschlüssel verweist (optional). */
  ziel?: string;
}

export interface Tabelle {
  id: string;
  name: string;
  spalten: Spalte[];
  /** Beispieldaten (optional, z. B. für die 1. NF). */
  zeilen: string[][];
}

export interface TabellenSchritt {
  titel: string;
  /** Abhängigkeiten, Begründung (frei). */
  text: string;
  tabellen: Tabelle[];
}

export type TabellenArt = 'relationen' | 'normalform';

export interface TabellenAntwort {
  editor: TabellenArt;
  schritte: TabellenSchritt[];
  notiz?: string;
}

/** Was im Textfeld eines Schritts hilft (Platzhalter). */
export function schrittHinweis(art: TabellenArt, nf: number): string {
  if (art === 'relationen') return 'Begründung, Annahmen (optional) …';
  if (nf === 1) return 'Was hast du geändert? Neuer Primärschlüssel: …';
  if (nf === 2) return 'Partielle Abhängigkeiten: … hängt nur von … ab';
  return 'Transitive Abhängigkeiten: … → … → …';
}

export function leereTabellenAntwort(art: TabellenArt, schritte = 1): TabellenAntwort {
  const titel = (i: number) => (art === 'normalform' ? `${i + 1}. NF` : 'Relationenmodell');
  return { editor: art, schritte: Array.from({ length: Math.max(1, schritte) }, (_, i) => ({ titel: titel(i), text: '', tabellen: [] })) };
}

export const istTabellenLeer = (a: TabellenAntwort) => !a.notiz?.trim() && a.schritte.every((s) => !s.text.trim() && !s.tabellen.length);

// ---------- Relationenschreibweise ----------

/** Teile der Relationenschreibweise: aufeinanderfolgende PK-Spalten stehen gemeinsam fett, FK mit ↑. */
export function relationTeile(t: Pick<Tabelle, 'spalten'>): { text: string; fett: boolean }[] {
  const teile: { text: string; fett: boolean }[] = [];
  for (const s of t.spalten.filter((x) => x.name.trim())) {
    const text = `${s.name.trim()}${s.fk ? '↑' : ''}`;
    const letzter = teile[teile.length - 1];
    if (letzter && letzter.fett && s.pk) letzter.text += `, ${text}`;
    else teile.push({ text, fett: !!s.pk });
  }
  return teile;
}

/** „auftrag(**auftrag_nr**, datum, kunden_id↑)“ */
export function relationText(t: Pick<Tabelle, 'name' | 'spalten'>): string {
  const teile = relationTeile(t).map((x) => (x.fett ? `**${x.text}**` : x.text));
  return `${t.name.trim() || 'tabelle'}(${teile.join(', ')})`;
}

export function tabellenAlsText(a: TabellenAntwort): string {
  const zeilen: string[] = [];
  for (const s of a.schritte) {
    if (a.schritte.length > 1 || a.editor === 'normalform') zeilen.push(`${s.titel}:`);
    if (s.text.trim()) zeilen.push(s.text.trim());
    for (const t of s.tabellen) {
      zeilen.push(`- ${relationText(t)}`);
      const fks = t.spalten.filter((x) => x.fk && x.ziel);
      if (fks.length) zeilen.push(`  Fremdschlüssel: ${fks.map((x) => `${x.name} → ${x.ziel}`).join(', ')}`);
      for (const z of t.zeilen) zeilen.push(`  | ${z.join(' | ')} |`);
    }
    zeilen.push('');
  }
  if (a.notiz?.trim()) zeilen.push('Anmerkungen:', a.notiz.trim());
  return zeilen.join('\n').trim();
}

// ---------- Markdown-Tabellen ----------

/** Zellen einer Tabellenzeile; ein maskierter Strich (\|, z. B. Betrag |e|) trennt nicht und wird zum Zeichen. */
const zellen = (zeile: string) =>
  zeile
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
    .split(/(?<!\\)\|/)
    .map((z) => z.trim().replace(/\\\|/g, '|'));

/** Alle Markdown-Tabellen eines Texts: Kopfzeile, Datenzeilen und die Zeile davor (für den Namen). */
export function markdownTabellen(md: string): { kopf: string[]; zeilen: string[][]; davor: string }[] {
  const z = md.split(/\r?\n/);
  const tabellen: { kopf: string[]; zeilen: string[][]; davor: string }[] = [];
  for (let i = 0; i < z.length - 1; i++) {
    if (!z[i].trim().startsWith('|') || !/^\s*\|?\s*:?-{3,}/.test(z[i + 1])) continue;
    const kopf = zellen(z[i]);
    const zeilen: string[][] = [];
    let j = i + 2;
    for (; j < z.length && z[j].trim().startsWith('|'); j++) zeilen.push(zellen(z[j]));
    const davor =
      z
        .slice(0, i)
        .reverse()
        .find((x) => x.trim()) ?? '';
    tabellen.push({ kopf, zeilen, davor });
    i = j - 1;
  }
  return tabellen;
}

/** Tabellenname aus einer Überschrift: Text in Anführungszeichen, sonst „tabelle“. */
function nameAus(titel: string): string {
  const m = titel.match(/[„"“]([^"“”]+)["“”]/);
  return (m?.[1] ?? 'tabelle').trim().replace(/\s+/g, '_');
}

/** Tabellen der Anlagen – als Ausgangstabelle (z. B. die unnormalisierte Tabelle für die 1. NF). */
export function anlageTabellen(anlagen: Section[]): { titel: string; tabelle: Omit<Tabelle, 'id'> }[] {
  return anlagen.flatMap((a) =>
    markdownTabellen(a.markdown).map((t) => ({
      titel: a.title,
      tabelle: {
        name: nameAus(a.title),
        spalten: t.kopf.map((name) => ({ name: name.replace(/\*/g, '') })),
        zeilen: t.zeilen.map((r) => t.kopf.map((_, i) => (r[i] ?? '').replace(/\*\*/g, ''))),
      },
    })),
  );
}

// ---------- Musterlösung einlesen ----------

export interface MusterSpalte {
  name: string;
  pk: boolean;
  fk: boolean;
}

export interface MusterTabelle {
  /** Leer bei einer Tabelle ohne Namen (z. B. die 1. NF als Datentabelle). */
  name: string;
  spalten: MusterSpalte[];
  /** „…“ in der Spaltenliste: weitere Spalten sind erlaubt. */
  offen: boolean;
}

/** Spaltenliste „**a↑, b↑**, c, **d** PK, e FK“ → Spalten. Fett kann sich über mehrere Spalten erstrecken. */
function spaltenListe(inhalt: string): { spalten: MusterSpalte[]; offen: boolean } {
  let fett = false;
  let offen = false;
  const spalten: MusterSpalte[] = [];
  for (const roh of inhalt.split(',')) {
    const sterne = (roh.match(/\*\*/g) ?? []).length;
    const pk = fett || sterne > 0 || /\bPK\b/.test(roh);
    if (sterne % 2) fett = !fett;
    const name = roh
      .replace(/\*\*/g, '')
      .replace(/\b(PK|FK)\b/g, '')
      .replace(/[↑*]/g, '')
      .trim();
    if (/^(…|\.\.\.)$/.test(name)) {
      offen = true;
      continue;
    }
    if (!name || /\s/.test(name)) continue;
    spalten.push({ name, pk, fk: roh.includes('↑') || /\bFK\b/.test(roh) });
  }
  return { spalten, offen };
}

/** Relationen („- name(**pk**, a, b↑)“) und Tabellen mit fetten Schlüsselspalten bzw. „Spalte | Art“-Tabellen eines Texts. */
function tabellenIn(md: string): MusterTabelle[] {
  const tabellen: MusterTabelle[] = [];
  for (const m of md.matchAll(/^\s*[-*]\s+\**([A-Za-zÄÖÜäöüß_][\wÄÖÜäöüß]*)\**\s*\(([^()\n]+)\)/gm)) {
    const { spalten, offen } = spaltenListe(m[2]);
    if (spalten.length) tabellen.push({ name: m[1], spalten, offen });
  }
  for (const t of markdownTabellen(md)) {
    if (/^spalte$/i.test(t.kopf[0]?.replace(/\*/g, '') ?? '')) {
      // „Spalte | Art“: Name aus der fetten Zeile davor („**Faktentabelle fakt_verkauf**“), optionale Zeilen in Klammern weglassen.
      const name = t.davor.replace(/\*/g, '').trim().split(/\s+/).pop() ?? '';
      const spalten = t.zeilen
        .filter((r) => r[0] && !/^\*?\(/.test(r[0]))
        .map((r) => ({ name: r[0].replace(/\*/g, '').trim(), pk: /\bPK\b/.test(r[1] ?? ''), fk: /\bFK\b/.test(r[1] ?? '') }));
      if (spalten.length) tabellen.push({ name, spalten, offen: false });
    } else if (t.kopf.some((k) => /^\*\*.+\*\*$/.test(k))) {
      tabellen.push({
        name: '',
        spalten: t.kopf.map((k) => ({ name: k.replace(/\*/g, '').trim(), pk: /^\*\*.+\*\*$/.test(k), fk: false })),
        offen: false,
      });
    }
  }
  return tabellen;
}

/**
 * Tabellen der Musterlösung, je Teilaufgabe (a), b), c) …) eine Liste. Hat die Lösung keine Teile, ist es eine Liste.
 * Teile ohne Tabelle bleiben leer.
 */
export function musterTabellen(md: string): MusterTabelle[][] {
  const starts = [...md.matchAll(/^\*\*[a-z]\)/gm)].map((m) => m.index!);
  if (starts.length < 2) return [tabellenIn(md)];
  return starts.map((s, i) => tabellenIn(md.slice(s, starts[i + 1] ?? md.length)));
}

/** Zu welchem Teil der Musterlösung gehört Schritt i? Gleich viele Teile wie Schritte → je einer, sonst alle Tabellen zum letzten Schritt. */
export function musterFuerSchritt(teile: MusterTabelle[][], schritte: number, i: number): MusterTabelle[] {
  if (teile.length === schritte) return teile[i];
  return i === schritte - 1 ? teile.flat() : [];
}

// ---------- Abgleich ----------

/** Spalten- und Tabellennamen vergleichbar machen: klein, ohne Zeichen außer Buchstaben, Ziffern und _. */
export const normName = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_äöüß]/g, '');

export interface Abgleich {
  muster: MusterTabelle;
  /** Name deiner passenden Tabelle (fehlt: keine gefunden). */
  deine?: string;
  fehlend: string[];
  zusaetzlich: string[];
  pkOk: boolean;
  /** Spalten, die in der Musterlösung Fremdschlüssel sind, bei dir aber nicht markiert. */
  fkFehlt: string[];
}

export interface SchemaAbgleich {
  zeilen: Abgleich[];
  /** Deine Tabellen ohne Gegenstück in der Musterlösung. */
  uebrig: string[];
}

const jaccard = (a: Set<string>, b: Set<string>) => {
  const schnitt = [...a].filter((x) => b.has(x)).length;
  return schnitt / (a.size + b.size - schnitt || 1);
};

/** Ordnet jeder Tabelle der Musterlösung deine ähnlichste zu (gleicher Name zählt mehr als gleiche Spalten) und vergleicht sie. */
export function gleicheAb(deine: Tabelle[], muster: MusterTabelle[]): SchemaAbgleich {
  const eigene = deine.filter((t) => t.spalten.some((s) => s.name.trim()));
  const spaltenVon = (t: Tabelle) => new Set(t.spalten.map((s) => normName(s.name)).filter(Boolean));
  const paare: { m: number; d: number; wert: number }[] = [];
  muster.forEach((m, mi) => {
    const ms = new Set(m.spalten.map((s) => normName(s.name)));
    eigene.forEach((d, di) => {
      const gleicherName = !!m.name && normName(m.name) === normName(d.name);
      const j = jaccard(ms, spaltenVon(d));
      if (gleicherName || j >= 0.3) paare.push({ m: mi, d: di, wert: (gleicherName ? 1 : 0) + j });
    });
  });
  paare.sort((a, b) => b.wert - a.wert);
  const zuMuster = new Map<number, number>();
  const vergeben = new Set<number>();
  for (const p of paare) {
    if (zuMuster.has(p.m) || vergeben.has(p.d)) continue;
    zuMuster.set(p.m, p.d);
    vergeben.add(p.d);
  }
  const zeilen = muster.map((m, mi): Abgleich => {
    const di = zuMuster.get(mi);
    if (di === undefined) return { muster: m, fehlend: m.spalten.map((s) => s.name), zusaetzlich: [], pkOk: false, fkFehlt: [] };
    const d = eigene[di];
    const dein = new Map(d.spalten.filter((s) => s.name.trim()).map((s) => [normName(s.name), s]));
    const musterNamen = new Set(m.spalten.map((s) => normName(s.name)));
    const pkM = m.spalten.filter((s) => s.pk).map((s) => normName(s.name));
    const pkD = [...dein.entries()].filter(([, s]) => s.pk).map(([n]) => n);
    return {
      muster: m,
      deine: d.name.trim() || '(ohne Namen)',
      fehlend: m.spalten.filter((s) => !dein.has(normName(s.name))).map((s) => s.name),
      zusaetzlich: m.offen ? [] : [...dein.values()].filter((s) => !musterNamen.has(normName(s.name))).map((s) => s.name.trim()),
      pkOk: pkM.length === pkD.length && pkM.every((n) => pkD.includes(n)),
      fkFehlt: m.spalten.filter((s) => s.fk && dein.has(normName(s.name)) && !dein.get(normName(s.name))!.fk).map((s) => s.name),
    };
  });
  return { zeilen, uebrig: eigene.filter((_, i) => !vergeben.has(i)).map((t) => t.name.trim() || '(ohne Namen)') };
}

export const abgleichOk = (a: Abgleich) => !!a.deine && !a.fehlend.length && !a.zusaetzlich.length && a.pkOk && !a.fkFehlt.length;
