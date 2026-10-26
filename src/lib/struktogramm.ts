// Struktogramm-Baukasten (Nassi-Shneiderman, DIN 66261) für „Zeichnen Sie ein Struktogramm“: ein Baum aus Bausteinen – Anweisung,
// Verzweigung (ja/nein), kopfgesteuerte Schleife (auch Zählschleife „FÜR …“) und fußgesteuerte Schleife. Zweige und Schleifenrümpfe
// sind wieder Folgen von Bausteinen. Die Formprüfung achtet nur auf die Form (leere Bedingung, leerer Rumpf …), nie auf die Lösung.
// Rein, ohne React.

export type BausteinArt = 'anweisung' | 'wenn' | 'solange' | 'wiederhole';

export type Baustein =
  | { id: string; art: 'anweisung'; text: string }
  | { id: string; art: 'wenn'; text: string; ja: Baustein[]; nein: Baustein[] }
  | { id: string; art: 'solange' | 'wiederhole'; text: string; rumpf: Baustein[] };

export interface StruktogrammAntwort {
  editor: 'struktogramm';
  bausteine: Baustein[];
  notiz?: string;
}

export const BAUSTEIN_NAMEN: Record<BausteinArt, string> = {
  anweisung: 'Anweisung',
  wenn: 'Verzweigung (ja/nein)',
  solange: 'Schleife, kopfgesteuert (SOLANGE / FÜR)',
  wiederhole: 'Schleife, fußgesteuert (WIEDERHOLE BIS)',
};

/** Platzhalter der Textfelder – zeigen die übliche Schreibweise. */
export const PLATZHALTER: Record<BausteinArt, string> = {
  anweisung: 'z. B. summe ← 0',
  wenn: 'Bedingung, z. B. betrag > 1000?',
  solange: 'z. B. FÜR i VON 1 BIS n',
  wiederhole: 'WIEDERHOLE BIS …',
};

/** Ein Ort für Bausteine: die oberste Folge oder Zweig/Rumpf eines Bausteins. */
export type Ort = { in: 'wurzel' } | { in: string; teil: 'ja' | 'nein' | 'rumpf' };

export const leereStruktogrammAntwort = (): StruktogrammAntwort => ({ editor: 'struktogramm', bausteine: [] });

let zaehler = 0;
const neueId = () => `s${Date.now().toString(36)}${(zaehler++).toString(36)}`;

export function neuerBaustein(art: BausteinArt, id = neueId()): Baustein {
  if (art === 'anweisung') return { id, art, text: '' };
  if (art === 'wenn') return { id, art, text: '', ja: [], nein: [] };
  return { id, art, text: '', rumpf: [] };
}

/** Die Unterfolgen eines Bausteins (Zweige bzw. Rumpf). */
export function teile(b: Baustein): { teil: 'ja' | 'nein' | 'rumpf'; liste: Baustein[] }[] {
  if (b.art === 'wenn')
    return [
      { teil: 'ja', liste: b.ja },
      { teil: 'nein', liste: b.nein },
    ];
  if (b.art === 'anweisung') return [];
  return [{ teil: 'rumpf', liste: b.rumpf }];
}

/** Eine Folge (am Ort) mit fn umbauen; alles andere bleibt, wie es ist (unveränderliche Kopien). */
export function mitFolge(liste: Baustein[], ort: Ort, fn: (folge: Baustein[]) => Baustein[]): Baustein[] {
  if (ort.in === 'wurzel') return fn(liste);
  const o = ort as { in: string; teil: 'ja' | 'nein' | 'rumpf' };
  return liste.map((b) => {
    if (b.id === o.in) {
      if (b.art === 'wenn' && (o.teil === 'ja' || o.teil === 'nein')) return { ...b, [o.teil]: fn(b[o.teil]) };
      if ((b.art === 'solange' || b.art === 'wiederhole') && o.teil === 'rumpf') return { ...b, rumpf: fn(b.rumpf) };
      return b;
    }
    if (b.art === 'wenn') return { ...b, ja: mitFolge(b.ja, ort, fn), nein: mitFolge(b.nein, ort, fn) };
    if (b.art === 'solange' || b.art === 'wiederhole') return { ...b, rumpf: mitFolge(b.rumpf, ort, fn) };
    return b;
  });
}

/** Text eines Bausteins ändern (Anweisung bzw. Bedingung). */
export function setzeText(liste: Baustein[], id: string, text: string): Baustein[] {
  return liste.map((b) => {
    if (b.id === id) return { ...b, text };
    if (b.art === 'wenn') return { ...b, ja: setzeText(b.ja, id, text), nein: setzeText(b.nein, id, text) };
    if (b.art === 'solange' || b.art === 'wiederhole') return { ...b, rumpf: setzeText(b.rumpf, id, text) };
    return b;
  });
}

/** In welcher Folge steht der Baustein? (undefined: gibt es nicht) */
function ortVon(liste: Baustein[], id: string, ort: Ort = { in: 'wurzel' }): Ort | undefined {
  if (liste.some((b) => b.id === id)) return ort;
  for (const b of liste) {
    for (const t of teile(b)) {
      const o = ortVon(t.liste, id, { in: b.id, teil: t.teil });
      if (o) return o;
    }
  }
  return undefined;
}

export function entferne(liste: Baustein[], id: string): Baustein[] {
  const ort = ortVon(liste, id);
  return ort ? mitFolge(liste, ort, (f) => f.filter((b) => b.id !== id)) : liste;
}

/** Innerhalb seiner Folge eine Stelle nach oben (−1) oder unten (+1). */
export function verschiebe(liste: Baustein[], id: string, richtung: -1 | 1): Baustein[] {
  const ort = ortVon(liste, id);
  if (!ort) return liste;
  return mitFolge(liste, ort, (f) => {
    const i = f.findIndex((b) => b.id === id);
    const j = i + richtung;
    if (j < 0 || j >= f.length) return f;
    const neu = [...f];
    [neu[i], neu[j]] = [neu[j], neu[i]];
    return neu;
  });
}

export function fuegeAn(liste: Baustein[], ort: Ort, b: Baustein): Baustein[] {
  return mitFolge(liste, ort, (f) => [...f, b]);
}

// ---------- Prüfen und beschreiben ----------

const zaehle = (liste: Baustein[]): number => liste.reduce((n, b) => n + 1 + teile(b).reduce((m, t) => m + zaehle(t.liste), 0), 0);

export const istStruktogrammLeer = (a: StruktogrammAntwort) => !a.notiz?.trim() && zaehle(a.bausteine) === 0;

/** Formfehler – ohne Blick auf die Musterlösung. */
export function pruefeStruktogramm(a: StruktogrammAntwort): string[] {
  const m: string[] = [];
  const gehe = (liste: Baustein[]) => {
    for (const b of liste) {
      const name = b.text.trim() ? `„${b.text.trim()}“` : '';
      if (b.art === 'anweisung' && !b.text.trim()) m.push('Eine Anweisung ist leer – beschrifte sie oder entferne sie.');
      if (b.art === 'wenn') {
        if (!b.text.trim()) m.push('Eine Verzweigung hat keine Bedingung.');
        if (!b.ja.length && !b.nein.length) m.push(`Die Verzweigung ${name} hat zwei leere Zweige – dann ist sie überflüssig.`);
      }
      if (b.art === 'solange' || b.art === 'wiederhole') {
        if (!b.text.trim()) m.push(`Eine ${b.art === 'solange' ? 'kopfgesteuerte' : 'fußgesteuerte'} Schleife hat keine Bedingung.`);
        if (!b.rumpf.length) m.push(`Die Schleife ${name} hat keinen Rumpf – was soll wiederholt werden?`);
      }
      for (const t of teile(b)) gehe(t.liste);
    }
  };
  gehe(a.bausteine);
  return [...new Set(m)];
}

/** Gliederung als Pseudocode (KI-Bewertung, Übersicht beim Bewerten). Leere Zweige als ∅. */
export function struktogrammAlsText(a: StruktogrammAntwort): string {
  const zeilen: string[] = [];
  const einr = (t: number) => '  '.repeat(t);
  const gehe = (liste: Baustein[], tiefe: number) => {
    if (!liste.length) zeilen.push(`${einr(tiefe)}∅`);
    for (const b of liste) {
      const text = b.text.trim() || '…';
      if (b.art === 'anweisung') zeilen.push(`${einr(tiefe)}${text}`);
      if (b.art === 'wenn') {
        zeilen.push(`${einr(tiefe)}WENN ${text}`, `${einr(tiefe + 1)}ja:`);
        gehe(b.ja, tiefe + 2);
        zeilen.push(`${einr(tiefe + 1)}nein:`);
        gehe(b.nein, tiefe + 2);
      }
      if (b.art === 'solange') {
        zeilen.push(`${einr(tiefe)}${/^(FÜR|SOLANGE)\b/i.test(text) ? text : `SOLANGE ${text}`}`);
        gehe(b.rumpf, tiefe + 1);
      }
      if (b.art === 'wiederhole') {
        zeilen.push(`${einr(tiefe)}WIEDERHOLE`);
        gehe(b.rumpf, tiefe + 1);
        zeilen.push(`${einr(tiefe)}${/^(WIEDERHOLE )?BIS\b/i.test(text) ? text.replace(/^WIEDERHOLE /i, '') : `BIS ${text}`}`);
      }
    }
  };
  gehe(a.bausteine, 0);
  const text = `Struktogramm:\n${zeilen.join('\n')}`;
  return a.notiz?.trim() ? `${text}\n\n${a.notiz.trim()}` : text;
}
