// Podcast je Thema: ein Gespräch zwischen Lea (Moderation) und Ben (erklärt) über das Lernblatt – Prüfungsrelevanz, je Teil die
// Begriffe mit Erklärung, Beispiel, Prüfungsfalle und Merksatz (aus den Begriffsseiten) und zum Schluss ein Quiz mit den
// Prüferfragen. Alles stammt aus den geprüften Inhalten; erfunden wird nichts, nur verbunden.
// Rein (ohne React): Die Seite (pages/Podcast.tsx) liest die Folge mit der Sprachausgabe des Browsers vor (lib/sprachausgabe.ts).
// Nicht für WiSo (eigener Prüfungsteil), nicht für Fachgespräch und Prüfungsablauf; Themen ohne Begriffsseiten bekommen keine Folge.

import type { BegriffsSeite, Flashcard, Topic } from '../../shared/types';
import { PRUEFUNGSBEREICHE } from './uebersicht';

export type Sprecher = 'lea' | 'ben';

export const SPRECHER_NAMEN: Record<Sprecher, string> = { lea: 'Lea', ben: 'Ben' };

export type Zeile = { sprecher: Sprecher; text: string } | { pause: number };

export interface Kapitel {
  titel: string;
  zeilen: Zeile[];
}

export interface Folge {
  topicId: string;
  titel: string;
  kapitel: Kapitel[];
  /** Anzahl der besprochenen Begriffe und Prüferfragen. */
  begriffe: number;
  fragen: number;
}

/** Denkpause im Quiz (ms). */
export const DENKPAUSE = 5000;
/** Wörter je Minute bei normaler Geschwindigkeit – für die geschätzte Dauer. */
const WOERTER_PRO_MINUTE = 150;

/** WiSo-Themen bekommen keinen Podcast (eigener Prüfungsteil). */
const OHNE_PODCAST = new Set(PRUEFUNGSBEREICHE.find((b) => b.id === 'wiso')?.themen ?? []);

/**
 * Bekommt das Thema eine Folge? Nicht WiSo, nicht das Altklausur-Training (Aufgaben, kein Stoff zum Erklären) und kein Zusatzmaterial
 * ohne eigene Teile. Ob es Begriffe gibt, zeigt erst bauePodcast.
 */
export const hatPodcastThema = (t: Pick<Topic, 'id' | 'title'> & { sections: { level: number }[] }) =>
  !OHNE_PODCAST.has(t.id) && !/^Altklausur/i.test(t.title) && t.sections.some((s) => s.level === 1);

// ---------- Text zum Vorlesen ----------

const GRIECHISCH: Record<string, string> = {
  alpha: 'Alpha',
  beta: 'Beta',
  gamma: 'Gamma',
  delta: 'Delta',
  epsilon: 'Epsilon',
  lambda: 'Lambda',
  mu: 'Mü',
  sigma: 'Sigma',
  Sigma: 'Summe',
  rho: 'Rho',
  pi: 'Pi',
  theta: 'Theta',
};

/** LaTeX einer Formel in gesprochene Worte („\frac{a}{b}“ → „a geteilt durch b“). Was unbekannt ist, verliert nur den Backslash. */
export function formelSprechen(tex: string): string {
  let s = tex
    .replace(/\{,\}/g, ',')
    .replace(/\\%/g, ' Prozent')
    .replace(/\\[ ,;:!]/g, ' ');
  s = s.replace(/\\text\{([^{}]*)\}|\\mathrm\{([^{}]*)\}/g, (_, a, b) => ` ${a ?? b} `);
  for (let i = 0; i < 5; i++) {
    s = s
      .replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, ' ($1) geteilt durch ($2) ')
      .replace(/\\sqrt\[([^\]]*)\]\{([^{}]*)\}/g, ' $1-te Wurzel aus ($2) ')
      .replace(/\\sqrt\{([^{}]*)\}/g, ' Wurzel aus ($1) ')
      .replace(/\\bar\{([^{}]*)\}|\\overline\{([^{}]*)\}/g, (_, a, b) => ` ${a ?? b} quer `)
      .replace(/\\hat\{([^{}]*)\}/g, ' $1 Dach ');
  }
  s = s
    .replace(/\^\{?2\}?/g, ' Quadrat ')
    .replace(/\^\{([^{}]*)\}|\^(\S)/g, (_, a, b) => ` hoch ${a ?? b} `)
    .replace(/_\{([^{}]*)\}|_(\w)/g, (_, a, b) => ` ${a ?? b} `)
    .replace(/\{,\}/g, ',')
    .replace(/\\%/g, ' Prozent')
    .replace(/\\(cdot|times)/g, ' mal ')
    .replace(/\\sum/g, ' Summe ')
    .replace(/\\(leq?|leqslant)\b/g, ' kleiner gleich ')
    .replace(/\\(geq?|geqslant)\b/g, ' größer gleich ')
    .replace(/\\neq?\b/g, ' ungleich ')
    .replace(/\\approx/g, ' ungefähr ')
    .replace(/\\(to|rightarrow|Rightarrow)\b/g, ' ergibt ')
    .replace(/\\(left|right|big|Big|quad|qquad|displaystyle)\b/g, ' ')
    .replace(/\\([a-zA-Z]+)/g, (_, w: string) => ` ${GRIECHISCH[w] ?? w} `)
    .replace(/<=/g, ' kleiner gleich ')
    .replace(/>=/g, ' größer gleich ')
    .replace(/</g, ' kleiner als ')
    .replace(/>/g, ' größer als ')
    .replace(/[{}\\]/g, ' ')
    .replace(/\s*=\s*/g, ' gleich ')
    .replace(/\s*\+\s*/g, ' plus ')
    .replace(/\s+[-−]\s+/g, ' minus ')
    .replace(/\s*\/\s*/g, ' geteilt durch ')
    .replace(/\(\s*([^()\s]+)\s*\)/g, ' $1 ');
  return s.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();
}

/** Zeichen, die Sprachausgaben schlecht oder gar nicht lesen. */
const ZEICHEN: [RegExp, string | ((treffer: string, ...gruppen: string[]) => string)][] = [
  // SQL und Vergleiche, bevor Markdown-Zeichen fallen („COUNT(*) > 5“)
  [/\(\*\)/g, '(Stern)'],
  [/\bSELECT \*/g, 'SELECT Stern'],
  [/(\S)\s+\*\s+(\S)/g, '$1 mal $2'],
  // Hervorhebungen ohne Lücke entfernen: „**CR**oss-**I**ndustry“ ist „Cross-Industry“, nicht „CR oss- I ndustry“ oder „CRoss“
  [/\*\*([A-ZÄÖÜ])([A-ZÄÖÜ]*)\*\*([a-zäöüß])/g, (_: string, a: string, b: string, c: string) => `${a}${b.toLowerCase()}${c}`],
  [/\*+/g, ''],
  [/\(\)/g, ''],
  [/\s*<>\s*/g, ' ungleich '],
  [/\s*<=\s*/g, ' kleiner gleich '],
  [/\s*>=\s*/g, ' größer gleich '],
  [/(\S)\s*<\s*(?=[\w(−-])/g, '$1 kleiner als '],
  [/(\S)\s*>\s*(?=[\w(−-])/g, '$1 größer als '],
  [/[─━│┃┌┐└┘├┤┬┴┼═]+/g, ' '],
  [/x̄/g, 'x quer'],
  [/ȳ/g, 'y quer'],
  [/ŷ/g, 'y Dach'],
  [/²/g, ' Quadrat'],
  [/³/g, ' hoch drei'],
  [/√/g, 'Wurzel aus '],
  [/Σ/g, 'Summe '],
  [/σ/g, 'Sigma'],
  [/μ/g, 'Mü'],
  [/≈/g, ' ungefähr '],
  [/≤/g, ' kleiner gleich '],
  [/≥/g, ' größer gleich '],
  [/≠/g, ' ungleich '],
  [/\(\s*(?:→|⇒)\s*/g, '(siehe '],
  [/\s*(→|⇒|->)\s*/g, ', also '],
  [/\s*↔\s*/g, ' und umgekehrt '],
  [/\s+·\s+/g, ', '],
  [/(\d)\s*×\s*(\d)/g, '$1 mal $2'],
  [/(\d)\s*·\s*(\d)/g, '$1 mal $2'],
  [/\s+=\s+/g, ' gleich '],
  [/\bDD\s?(\d+)/g, 'Deep Dive $1'],
  [/\bz\.\s?B\./g, 'zum Beispiel'],
  [/\bd\.\s?h\./g, 'das heißt'],
  [/\bu\.\s?a\./g, 'unter anderem'],
  [/\bbzw\./g, 'beziehungsweise'],
  [/\bggf\./g, 'gegebenenfalls'],
  [/\bvs\./g, 'gegenüber'],
  [/\bca\./g, 'circa'],
  [/\bi\.\s?d\.\s?R\./g, 'in der Regel'],
  [/\b(?:usw|etc)\./g, 'und so weiter'],
  [/\binkl\./g, 'inklusive'],
  [/\bengl\./g, 'englisch'],
  [/\bArt\.\s?(?=\d)/g, 'Artikel '],
  [/\bAbs\.\s?(?=\d)/g, 'Absatz '],
  [/\blit\.\s?(?=[a-z]\b)/g, 'Buchstabe '],
  [/\bNr\.\s?(?=\d)/g, 'Nummer '],
  [/\bMio\./g, 'Millionen'],
  [/\bMrd\./g, 'Milliarden'],
  [/\bStd\./g, 'Stunden'],
  // Einheiten nach Zahlen
  [/(\d)\s?T€/g, '$1 Tausend Euro'],
  [/\(T€\)/g, '(in Tausend Euro)'],
  [/(\d)\s?h\b/g, '$1 Stunden'],
  [/(\d)\s?min\b\.?/g, '$1 Minuten'],
  [/(\d)\s?ms\b/g, '$1 Millisekunden'],
  [/(\d)\s?s\b/g, '$1 Sekunden'],
  [/(\d)\s?KB\b/gi, '$1 Kilobyte'],
  [/(\d)\s?MB\b/g, '$1 Megabyte'],
  [/(\d)\s?GB\b/g, '$1 Gigabyte'],
  [/(\d)\s?TB\b/g, '$1 Terabyte'],
  [/(\d)\s?GiB\b/g, '$1 Gibibyte'],
  [/(\d)\s?TiB\b/g, '$1 Tebibyte'],
  // Kardinalitäten
  [/\b([01nmc])\s?:\s?([1nmc])\b(?!\d)/g, '$1 zu $2'],
  [/\s+\/\s+/g, ' oder '],
  [/[„“"‚‘]/g, ''],
  [/[_~#<>|\\]/g, ' '],
];

/** Markdown in vorlesbaren Text: ohne Codeblöcke, Tabellen, Bilder, SVG und Markup; Formeln in Worten. */
export function sprechText(md: string): string {
  let s = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .split('\n')
    .filter((z) => !/^\s*\|/.test(z) && !/^\s*-{3,}\s*$/.test(z))
    .map((z) =>
      z
        .replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '')
        .replace(/^\s*#+\s*/, '')
        .replace(/^\s*>\s?/, ''),
    )
    .map((z) => (z.trim() && !/[.!?:;]$/.test(z.trim()) ? `${z.trim()}.` : z))
    .join(' ');
  s = s
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, f: string) => ` ${formelSprechen(f)} `)
    .replace(/\$([^$\n]+?)\$/g, (_, f: string) => ` ${formelSprechen(f)} `)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\\\$/g, ' Dollar ');
  for (const [re, ersatz] of ZEICHEN) s = typeof ersatz === 'string' ? s.replace(re, ersatz) : s.replace(re, ersatz);
  return s
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\.{2,}/g, '.')
    .replace(/:\./g, ':')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Abkürzungen, nach denen kein Satz endet. */
const KEIN_ENDE = /(?:\b(?:z|B|d|h|u|a|bzw|ggf|ca|Nr|Abs|Art|vgl|evtl|inkl|max|min|sog|bspw|usw|etc|Dr|S|Mio|Mrd|Tsd)|\d)\.$/;

/** Text in Sätze zerlegen (für kurze Äußerungen – lange brechen manche Sprachausgaben ab). */
export function saetze(text: string): string[] {
  // Nur an Satzzeichen mit Leerraum dahinter trennen – „20.000“ oder „3.1“ bleiben ganz.
  const roh = text.split(/(?<=[.!?])\s+/);
  const out: string[] = [];
  for (const teil of roh) {
    const t = teil.trim();
    if (!t) continue;
    if (out.length && KEIN_ENDE.test(out[out.length - 1])) out[out.length - 1] += ` ${t}`;
    else out.push(t);
  }
  return out;
}

/** Die ersten `n` Sätze. */
export const ersteSaetze = (text: string, n: number) => saetze(text).slice(0, n).join(' ');

// ---------- Begriffsseiten ----------

interface BegriffTeile {
  definition: string;
  erklaerung?: string;
  beispiel?: string;
  falle?: string;
  merksatz?: string;
}

/** Abschnitte einer Begriffsseite: Absatz vor der ersten ###-Überschrift = Definition, dann Erklärung, Beispiel, Prüfungsfalle, Merksatz. */
export function begriffTeile(markdown: string): BegriffTeile {
  const teile = markdown.split(/^###\s+/m);
  const abschnitt = (name: RegExp) => {
    const t = teile.slice(1).find((x) => name.test(x.split('\n')[0]));
    return t ? sprechText(t.split('\n').slice(1).join('\n')) || undefined : undefined;
  };
  return {
    definition: sprechText(teile[0]),
    erklaerung: abschnitt(/^Erklärung/),
    beispiel: abschnitt(/^Beispiel/),
    falle: abschnitt(/^Prüfungsfalle/),
    merksatz: abschnitt(/^Merksatz/),
  };
}

/** Zu welchem Thema und Teil gehört die Seite? Aus „Mehr: Deep Dive 5, 6.5“ / „…, Teil 3“, sonst aus den Fundstellen („DD12 Teil 2“). */
export function fundstelle(seite: Pick<BegriffsSeite, 'mehr' | 'quellen'>): { topicId: string; teil?: number; unter?: number } | undefined {
  for (const m of seite.mehr) {
    const r = /Deep Dive (\d+)(?:,\s*(?:Teil\s+(\d+)|(\d+)\.(\d+)))?/.exec(m);
    if (r) return { topicId: r[1].padStart(2, '0'), teil: Number(r[2] ?? r[3]) || undefined, unter: Number(r[4]) || undefined };
  }
  const q = /DD(\d+)(?:\s+(?:Teil\s+(\d+)|(\d+)\.(\d+)))?/.exec(seite.quellen);
  if (q) return { topicId: q[1].padStart(2, '0'), teil: Number(q[2] ?? q[3]) || undefined, unter: Number(q[4]) || undefined };
  return undefined;
}

/** Begriffsseiten eines Themas. */
export const seitenZumThema = (topicId: string, seiten: BegriffsSeite[]) => seiten.filter((s) => fundstelle(s)?.topicId === topicId);

// ---------- Folge bauen ----------

const FRAGE = ['Was ist eigentlich {B}?', 'Nächster Begriff: {B}. Was steckt dahinter?', 'Und was bedeutet {B}?', 'Kommen wir zu {B}.'];
const BEISPIEL = ['Hast du ein Beispiel?', 'Wie sieht das in der Praxis aus?', 'Kannst du das an einem Beispiel zeigen?'];
const FALLE = [
  'Und wo liegt die typische Falle in der Prüfung?',
  'Worauf muss man in der Prüfung achten?',
  'Was geht in der Prüfung oft schief?',
];

/** Satzzeichen glätten, wo Vorlagen und vorlesbarer Text aufeinandertreffen („Statistik..“, „Daten?.“). */
const glatt = (text: string) =>
  text
    .replace(/\.{2,}/g, '.')
    .replace(/([!?:])\./g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
const lea = (text: string): Zeile => ({ sprecher: 'lea', text: glatt(text) });
const ben = (text: string): Zeile => ({ sprecher: 'ben', text: glatt(text) });

/** Einleitender Text eines Teils: der eigene Text des Teils, sonst der Anfang seines ersten Abschnitts. */
function einleitung(topic: Topic, index: number): string {
  const teil = topic.sections[index];
  const eigen = sprechText(teil.markdown);
  if (eigen.length > 40) return ersteSaetze(eigen, 3);
  const naechster = topic.sections[index + 1];
  return naechster && naechster.level > 1 ? ersteSaetze(sprechText(naechster.markdown), 3) : eigen;
}

const teilNummer = (titel: string) => Number(/^Teil\s+(\d+)/.exec(titel)?.[1]) || undefined;

/**
 * Die Folge zu einem Thema (mit Abschnittstexten) – oder undefined für WiSo und Themen ohne Begriffsseiten.
 * Kapitel: Einstieg (Prüfungsrelevanz), je Teil des Lernblatts seine Begriffe, weitere Begriffe ohne Teil, Quiz, Abschluss.
 */
export function bauePodcast(topic: Topic, seiten: BegriffsSeite[], karten: Flashcard[]): Folge | undefined {
  if (!hatPodcastThema(topic)) return undefined;
  const eigene = seitenZumThema(topic.id, seiten);
  if (!eigene.length) return undefined;

  const kapitel: Kapitel[] = [];
  const relevanz = topic.sections.find((s) => /^Prüfungsrelevanz/.test(s.title));
  kapitel.push({
    titel: 'Einstieg',
    zeilen: [
      lea(`Hallo und willkommen beim AP2-Podcast! Ich bin Lea, und mit mir ist Ben. Heute geht es um ${sprechText(topic.title)}.`),
      ben('Hallo! Ich erkläre dir die wichtigsten Begriffe, jeweils mit einem Beispiel, und am Ende gibt es ein kleines Quiz.'),
      ...(relevanz ? [lea('Warum ist das Thema für die Prüfung wichtig?'), ben(ersteSaetze(sprechText(relevanz.markdown), 4))] : []),
    ],
  });

  // Begriffe nach Teil (und Unterabschnitt) ordnen.
  const nachTeil = new Map<number | undefined, { seite: BegriffsSeite; unter: number }[]>();
  for (const s of eigene) {
    const f = fundstelle(s)!;
    nachTeil.set(f.teil, [...(nachTeil.get(f.teil) ?? []), { seite: s, unter: f.unter ?? 0 }]);
  }
  let nr = 0;
  const begriffZeilen = (seite: BegriffsSeite): Zeile[] => {
    const t = begriffTeile(seite.markdown);
    const i = nr++;
    const zeilen: Zeile[] = [lea(FRAGE[i % FRAGE.length].replace('{B}', seite.begriff)), ben(t.definition)];
    if (t.erklaerung) zeilen.push(ben(ersteSaetze(t.erklaerung, 3)));
    if (t.beispiel) zeilen.push(lea(BEISPIEL[i % BEISPIEL.length]), ben(ersteSaetze(t.beispiel, 3)));
    if (t.falle) zeilen.push(lea(FALLE[i % FALLE.length]), ben(ersteSaetze(t.falle, 2)));
    if (t.merksatz) zeilen.push(ben(`Zum Merken: ${t.merksatz}`));
    return zeilen;
  };
  const sortiert = (liste: { seite: BegriffsSeite; unter: number }[]) =>
    [...liste].sort((a, b) => a.unter - b.unter || a.seite.begriff.localeCompare(b.seite.begriff, 'de'));

  topic.sections.forEach((s, index) => {
    if (s.level !== 1 || s.generiert) return;
    const n = teilNummer(s.title);
    const begriffe = n !== undefined ? nachTeil.get(n) : undefined;
    if (!begriffe?.length) return;
    nachTeil.delete(n);
    const titel = sprechText(s.title.replace(/^Teil\s+\d+\s*[–-]\s*/, ''));
    kapitel.push({
      titel: s.title,
      zeilen: [lea(`Teil ${n}: ${titel}.`), ben(einleitung(topic, index)), ...sortiert(begriffe).flatMap((b) => begriffZeilen(b.seite))],
    });
  });
  const uebrig = [...nachTeil.values()].flat();
  if (uebrig.length) {
    kapitel.push({
      titel: 'Weitere Begriffe',
      zeilen: [lea('Ein paar Begriffe gehören noch dazu.'), ...sortiert(uebrig).flatMap((b) => begriffZeilen(b.seite))],
    });
  }

  const fragen = karten.filter((k) => k.topicId === topic.id && k.kind === 'prueferfrage' && k.answer);
  if (fragen.length) {
    kapitel.push({
      titel: 'Quiz: Prüferfragen',
      zeilen: [
        lea('Zum Schluss ein kleines Quiz mit Fragen, wie sie der Prüfungsausschuss stellt. Überleg bei jeder Frage kurz selbst.'),
        ...fragen.flatMap((k, i) => [
          lea(`Frage ${i + 1}: ${sprechText(k.question)}`),
          { pause: DENKPAUSE },
          ben(ersteSaetze(sprechText(k.answer!), 4)),
        ]),
      ],
    });
  }

  kapitel.push({
    titel: 'Abschluss',
    zeilen: [
      lea(`Das war unsere Folge zu ${sprechText(topic.title)}.`),
      ben('Jetzt am besten gleich die Karteikarten zum Thema wiederholen oder eine Aufgabe aus der Übungsklausur rechnen.'),
      lea('Viel Erfolg beim Lernen, bis zum nächsten Mal!'),
    ],
  });
  return { topicId: topic.id, titel: topic.title, kapitel, begriffe: eigene.length, fragen: fragen.length };
}

/** Geschätzte Dauer in Minuten bei normaler Geschwindigkeit. */
export function dauerMinuten(kapitel: Kapitel[]): number {
  let woerter = 0;
  let pausen = 0;
  for (const k of kapitel)
    for (const z of k.zeilen) {
      if ('pause' in z) pausen += z.pause;
      else woerter += z.text.split(/\s+/).length;
    }
  return Math.max(1, Math.round(woerter / WOERTER_PRO_MINUTE + pausen / 60000));
}
