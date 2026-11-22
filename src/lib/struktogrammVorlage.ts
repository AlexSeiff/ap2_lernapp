// Struktogramm zum Zuordnen wie auf dem Prüfungsbogen: ein Gerüst mit leeren Feldern und eine nummerierte Liste von Anweisungen;
// in jedes Feld kommt die Ziffer der passenden Anweisung. Steht in Aufgabe und Lösung als ```struktogramm-Block. Rein, ohne React.
//
//   ```struktogramm
//   titel: + lernen(daten : Double[][]) : void
//   e := 0
//   ___
//   schleife: ___
//     schleife: ___
//       ___
//       wenn: ___
//         ja:
//           ___
//         nein:
//     ___
//   auswahl:
//   1 fehler := soll − vorhersage(x)
//   2 für z := 0, solange z < Anzahl der Zeilen von daten, z := z + 1
//   ```
//
// „schleife:“ ist kopfgesteuert (SOLANGE/FÜR), „wiederhole:“ fußgesteuert mit „bis: …“ auf derselben Einrückung danach, „wenn:“ hat
// die Unterblöcke „ja:“ und „nein:“. „___“ ist ein leeres Feld, in der Lösung steht dort „[6]“ (Ziffer der Anweisung). Felder werden
// in Lesereihenfolge (Zeile für Zeile) nummeriert – so wie die Tabelle „Feld | 1 | 2 | …“ in der Musterlösung.

import type { Baustein } from './struktogramm';

export interface Anweisung {
  nr: string;
  text: string;
}

export interface StruktogrammVorlage {
  titel?: string;
  bausteine: Baustein[];
  auswahl: Anweisung[];
  /** Feld-Nr. (1, 2, …) je Baustein-ID, nur für leere Felder bzw. Felder mit Verweis. */
  felder: Map<string, number>;
  /** Anzahl der Felder. */
  anzahl: number;
}

/** Antwort: je Feld die eingetragene Ziffer (Feld 1 = Index 0). */
export interface ZuordnungAntwort {
  editor: 'zuordnung';
  felder: string[];
  notiz?: string;
}

export const leereZuordnungAntwort = (anzahl: number): ZuordnungAntwort => ({
  editor: 'zuordnung',
  felder: Array<string>(anzahl).fill(''),
});
export const istZuordnungLeer = (a: ZuordnungAntwort) => !a.notiz?.trim() && a.felder.every((f) => !f.trim());
export const passeZuordnungAn = (a: ZuordnungAntwort, anzahl: number): ZuordnungAntwort => ({
  ...a,
  felder: Array.from({ length: anzahl }, (_, i) => a.felder[i] ?? ''),
});
export const zuordnungAlsText = (a: ZuordnungAntwort): string => {
  const t = `Struktogramm: ${a.felder.map((f, i) => `Feld ${i + 1} → ${f.trim() || '…'}`).join(' · ')}`;
  return a.notiz?.trim() ? `${t}\n\n${a.notiz.trim()}` : t;
};

const LUECKE = /^_{3,}$/;
const VERWEIS = /^\[(\d+)\]$/;
const BLOCK = /^```struktogramm[ \t]*\n([\s\S]*?)\n```[ \t]*$/m;

export function struktogrammBlock(markdown: string): string | undefined {
  return BLOCK.exec(markdown)?.[1];
}

export function ohneStruktogramm(markdown: string): string {
  return markdown
    .replace(BLOCK, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Feldinhalt: leer (___), Verweis auf eine Anweisung ([6]) oder fester Text. */
export type FeldInhalt = { art: 'leer' } | { art: 'verweis'; nr: string } | { art: 'text'; text: string };

export function feldInhalt(text: string): FeldInhalt {
  const t = text.trim();
  if (LUECKE.test(t)) return { art: 'leer' };
  const v = VERWEIS.exec(t);
  return v ? { art: 'verweis', nr: v[1] } : { art: 'text', text: t };
}

interface Zeile {
  tiefe: number;
  text: string;
}

export function leseStruktogrammVorlage(text: string): { vorlage?: StruktogrammVorlage; fehler?: string } {
  const roh = text.split('\n');
  const auswahlAb = roh.findIndex((z) => /^auswahl:\s*$/i.test(z.trim()));
  const auswahl: Anweisung[] = [];
  if (auswahlAb >= 0) {
    for (const z of roh.slice(auswahlAb + 1)) {
      if (!z.trim()) continue;
      const m = /^\s*(\d+)[.):]?\s+(.+)$/.exec(z);
      if (!m) return { fehler: `Auswahl-Zeile „${z.trim()}“ beginnt nicht mit einer Ziffer.` };
      auswahl.push({ nr: m[1], text: m[2].trim() });
    }
  }
  let titel: string | undefined;
  const zeilen: Zeile[] = [];
  for (const z of auswahlAb >= 0 ? roh.slice(0, auswahlAb) : roh) {
    if (!z.trim()) continue;
    const t = /^titel:\s*(.*)$/i.exec(z.trim());
    if (t && !zeilen.length) {
      titel = t[1].trim();
      continue;
    }
    zeilen.push({ tiefe: z.length - z.trimStart().length, text: z.trim() });
  }
  if (!zeilen.length) return { fehler: 'Das Struktogramm ist leer.' };

  const felder = new Map<string, number>();
  let anzahl = 0;
  let laufend = 0;
  const neu = (inhalt: string) => {
    const id = `z${laufend++}`;
    const f = feldInhalt(inhalt);
    if (f.art !== 'text') felder.set(id, ++anzahl);
    return id;
  };

  let pos = 0;
  /** Folge aller Zeilen mit genau dieser Einrückung (tiefere gehören zu den Blöcken). */
  const folge = (tiefe: number): Baustein[] | string => {
    const liste: Baustein[] = [];
    while (pos < zeilen.length && zeilen[pos].tiefe >= tiefe) {
      const z = zeilen[pos];
      if (z.tiefe > tiefe) return `Zeile „${z.text}“ ist zu weit eingerückt.`;
      const m = /^(schleife|wiederhole|wenn|bis|ja|nein):\s*(.*)$/i.exec(z.text);
      const art = m?.[1].toLowerCase();
      if (art === 'bis' || art === 'ja' || art === 'nein') return liste;
      pos++;
      if (art === 'schleife') {
        const id = neu(m![2]);
        const rumpf = folge(naechsteTiefe(tiefe));
        if (typeof rumpf === 'string') return rumpf;
        liste.push({ id, art: 'solange', text: m![2], rumpf });
      } else if (art === 'wiederhole') {
        const rumpf = folge(naechsteTiefe(tiefe));
        if (typeof rumpf === 'string') return rumpf;
        const bis = zeilen[pos];
        const b = bis && bis.tiefe === tiefe ? /^bis:\s*(.*)$/i.exec(bis.text) : null;
        if (!b) return 'Nach „wiederhole:“ fehlt „bis: …“ auf derselben Einrückung.';
        pos++;
        liste.push({ id: neu(b[1]), art: 'wiederhole', text: b[1], rumpf });
      } else if (art === 'wenn') {
        const id = neu(m![2]);
        const zweige: Record<'ja' | 'nein', Baustein[]> = { ja: [], nein: [] };
        const innen = naechsteTiefe(tiefe);
        while (pos < zeilen.length && zeilen[pos].tiefe === innen && /^(ja|nein):\s*$/i.test(zeilen[pos].text)) {
          const teil = zeilen[pos].text.replace(/:.*$/, '').toLowerCase() as 'ja' | 'nein';
          pos++;
          const f = folge(naechsteTiefe(innen));
          if (typeof f === 'string') return f;
          zweige[teil] = f;
        }
        liste.push({ id, art: 'wenn', text: m![2], ja: zweige.ja, nein: zweige.nein });
      } else {
        liste.push({ id: neu(z.text), art: 'anweisung', text: z.text });
      }
    }
    return liste;
  };
  // Einrückung: so tief wie die nächste tiefere Zeile (2 oder 4 Leerzeichen – beides geht).
  const naechsteTiefe = (tiefe: number) => zeilen.slice(pos).find((z) => z.tiefe > tiefe)?.tiefe ?? tiefe + 2;

  const bausteine = folge(zeilen[0].tiefe);
  if (typeof bausteine === 'string') return { fehler: bausteine };
  if (pos < zeilen.length) return { fehler: `Zeile „${zeilen[pos].text}“ passt nicht in die Struktur.` };
  const doppelt = auswahl.find((a, i) => auswahl.findIndex((b) => b.nr === a.nr) !== i);
  if (doppelt) return { fehler: `Ziffer ${doppelt.nr} steht zweimal in der Auswahl.` };
  return { vorlage: { titel, bausteine, auswahl, felder, anzahl } };
}

/** Ziffern der Lösung je Feld (1-basiert in der Reihenfolge der Felder) – aus einem Block mit „[6]“ statt „___“. */
export function loesungsZiffern(loesung: StruktogrammVorlage): string[] {
  const ziffern: string[] = [];
  const gehe = (liste: Baustein[]) => {
    for (const b of liste) {
      // Reihenfolge der Felder = Reihenfolge der Zeilen: Kopf vor Rumpf, beim Fuß (wiederhole) erst der Rumpf.
      const eigen = () => {
        const n = loesung.felder.get(b.id);
        const f = feldInhalt(b.text);
        if (n) ziffern[n - 1] = f.art === 'verweis' ? f.nr : '';
      };
      if (b.art === 'wiederhole') {
        gehe(b.rumpf);
        eigen();
      } else {
        eigen();
        if (b.art === 'wenn') {
          gehe(b.ja);
          gehe(b.nein);
        }
        if (b.art === 'solange') gehe(b.rumpf);
      }
    }
  };
  gehe(loesung.bausteine);
  return ziffern;
}

/** Formhinweise beim Eintragen: unbekannte und doppelt vergebene Ziffern. */
export function pruefeZuordnung(vorlage: StruktogrammVorlage, eintraege: string[]): string[] {
  const m: string[] = [];
  const nrs = new Set(vorlage.auswahl.map((a) => a.nr));
  const gesehen = new Map<string, number>();
  eintraege.forEach((e, i) => {
    const t = e.trim();
    if (!t) return;
    if (!nrs.has(t)) m.push(`Feld ${i + 1}: „${t}“ steht nicht in der Auswahl.`);
    gesehen.set(t, (gesehen.get(t) ?? 0) + 1);
  });
  for (const [nr, n] of gesehen)
    if (n > 1 && nrs.has(nr)) m.push(`Ziffer ${nr} steht in ${n} Feldern – jede Anweisung gehört an genau eine Stelle.`);
  return m;
}
