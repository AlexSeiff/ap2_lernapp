// Globale Suche (ROADMAP 8.8, Strg+K): Index über Lernblätter (Abschnitte), Material, Karteikarten, Aufgaben samt Musterlösungen, SQL- und
// Rechenübungen, Formeln, Operatoren und Glossar – und die Rangfolge der Treffer. Rein, ohne React; geladen wird das Modul
// erst mit dem Suchdialog (lazy), der Index entsteht beim ersten Öffnen.
//
// Normalisierung (deutschfreundlich): klein, Akzente weg (é → e), Umlaute und ihre Umschreibung gleich (ä/ae → a, ö/oe → o,
// ü/ue → u), ß → ss, Satzzeichen → Leerzeichen. So findet „Pruefung“, „Prüfung“ und „prufung“ dasselbe, „Groesse“ auch „Größe“.
// Rangfolge: Jedes Suchwort muss vorkommen (UND). Punkte je Wort: Titel-Wort genau 12, Titel-Wortanfang 8, im Titel 5,
// Text-Wortanfang 2, im Text 1; der ganze Suchtext im Titel +10, Titel beginnt damit +6; dazu ein kleiner Bonus je Art
// (Glossar, Formel, Operator, Abschnitt vor Karte, Aufgabe, Musterlösung, Übung). Gleichstand → kürzerer Titel, dann Index-Reihenfolge.

import { stripPrueferfragen } from '../../shared/prueferfragen';
import type { Settings } from '../../shared/progress';
import type { BegriffsSeite, Content } from '../../shared/types';
import { FORMELN, THEMA_NAMEN } from '../rechnen/formeln';
import { cardPool } from './cards';
import { ueberschriftKern } from './glossar';
import type { IconName } from './icons';
import { normalisiere } from './normalisiere';
import { OPERATOREN } from './operatoren';

export { normalisiere };

export type SuchArt =
  'begriff' | 'glossar' | 'abschnitt' | 'formel' | 'operator' | 'material' | 'karte' | 'aufgabe' | 'loesung' | 'sql' | 'rechnen';

export const SUCH_ART: Record<SuchArt, { icon: IconName; name: string; bonus: number }> = {
  begriff: { icon: 'book-bookmark', name: 'Begriffsseite', bonus: 4 },
  glossar: { icon: 'library', name: 'Glossar', bonus: 3 },
  abschnitt: { icon: 'book-open', name: 'Lernblatt', bonus: 2 },
  formel: { icon: 'sigma', name: 'Formel', bonus: 2 },
  operator: { icon: 'message-square-quote', name: 'Operator', bonus: 2 },
  material: { icon: 'file-text', name: 'Material', bonus: 1 },
  karte: { icon: 'layers', name: 'Karteikarte', bonus: 1 },
  aufgabe: { icon: 'file-pen-line', name: 'Aufgabe', bonus: 0 },
  loesung: { icon: 'circle-check', name: 'Musterlösung', bonus: 0 },
  sql: { icon: 'database', name: 'SQL-Übung', bonus: 0 },
  rechnen: { icon: 'calculator', name: 'Rechenübung', bonus: 0 },
};

export interface SuchEintrag {
  art: SuchArt;
  titel: string;
  /** Wo: „Deep Dive 3 · Statistik I“ usw. */
  kontext: string;
  /** Klartext für Treffer und Ausschnitt. */
  text: string;
  /** Ziel in der App (HashRouter-Pfad), z. B. „/lernen/03?stelle=03-teil-3-lagemasse“. */
  link: string;
  titelN: string;
  textN: string;
  /** Titel und andere Schreibweisen, normalisiert (für „genau dieser Begriff“). */
  namenN: string[];
}

export interface SuchTreffer {
  eintrag: SuchEintrag;
  punkte: number;
  /** Textausschnitt um den ersten Treffer (leer, wenn das Suchwort nur im Titel steht). */
  ausschnitt: string;
}

/** Markdown/LaTeX → Klartext für die Suche (grob, aber robust). */
export function klartext(md: string): string {
  return md
    .replace(/```svg[\s\S]*?```/g, ' ') // Diagramme (SVG-Markup) nicht durchsuchen
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\{\{\s*[\w.-]+\s*\}\}/g, ' … ')
    .replace(/\\(text|mathrm|mathbf)\{([^}]*)\}/g, '$2')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/^\s*[-*+]\s+\[[ xX]\]\s*/gm, '')
    .replace(/[*_`#>|$~{}\\]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Bindestrich-Wort, nur ab Wortanfang (sonst probiert die Regex jede Stelle mitten im Wort erneut). */
const BINDESTRICH_WORT = /(?<![\p{L}\p{N}])[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+/gu;

/**
 * Bindestrich-Wörter zusätzlich zusammengeschrieben („k-NN“ → „knn“, „E-Mail“ → „email“), damit auch „knn“ sie findet.
 * Nur Wörter mit „-“ prüfen: ein Treffer enthält nie Leerraum, das Ergebnis ist dasselbe wie über den ganzen Text – aber etwa 6× schneller.
 */
export const zusammen = (s: string) =>
  s
    .split(/\s+/)
    .flatMap((w) => (w.includes('-') ? (w.match(BINDESTRICH_WORT) ?? []) : []))
    .map((w) => normalisiere(w).replace(/ /g, ''))
    .join(' ');

/** `auch`: weitere Namen, die wie der Titel zählen (andere Schreibweisen einer Begriffsseite). */
const eintrag = (art: SuchArt, titel: string, kontext: string, text: string, link: string, auch: string[] = []): SuchEintrag => ({
  art,
  titel,
  kontext,
  text,
  link,
  titelN: ` ${[titel, ...auch].map((t) => `${normalisiere(t)} ${zusammen(t)}`).join(' | ')} `,
  textN: ` ${normalisiere(text)} ${zusammen(text)} `,
  namenN: [titel, ...auch].map(normalisiere),
});

/** Kurztext für Titel aus einem längeren Text (erste Zeile, gekürzt). */
const kurz = (s: string, max = 90) => {
  const t = klartext(s.split('\n').find((l) => l.trim()) ?? s);
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()} …` : t;
};

const ddName = (content: Content, topicId: string | undefined) => {
  const t = content.topics.find((x) => x.id === topicId);
  if (!t) return '';
  return t.id === '00' ? `SQL-Zusatz · ${t.title}` : `Deep Dive ${t.number} · ${t.title}`;
};

/** Zusätzliche Einträge (Begriffsseiten, Glossar aus 8.9), die der Index übernimmt. */
export type ZusatzEintrag = { art: SuchArt; titel: string; kontext: string; text: string; link: string; auch?: string[] };

/**
 * Baut den Suchindex. `settings`: ausgeschaltete Prüferfragen/Fachgespräch-Karten fehlen (cardPool), ausgeschaltete Prüferfragen
 * auch im Text der Lernblätter (wie in „Lernen“).
 */
export function baueSuchIndex(
  content: Content,
  settings: Pick<Settings, 'prueferfragen' | 'fachgespraech'>,
  zusatz: ZusatzEintrag[] = [],
): SuchEintrag[] {
  const out: SuchEintrag[] = [];
  for (const z of zusatz) out.push(eintrag(z.art, z.titel, z.kontext, z.text, z.link, z.auch));
  // Begriffskarten, deren Begriff schon als Begriffsseite oder Glossar-Eintrag im Index steht, wären nur ein Doppel mit derselben Erklärung.
  const imGlossar = new Set(zusatz.filter((z) => z.art === 'glossar' || z.art === 'begriff').map((z) => normalisiere(z.titel)));

  for (const t of content.topics) {
    const kontext = ddName(content, t.id);
    for (const s of t.sections) {
      if (s.generiert) continue; // Glossar-Liste: die Begriffe stehen schon als Glossar-Einträge im Index
      const md = settings.prueferfragen ? s.markdown : stripPrueferfragen(s.markdown);
      out.push(eintrag('abschnitt', s.title, kontext, klartext(md), `/lernen/${t.id}?stelle=${encodeURIComponent(s.id)}`));
    }
  }
  for (const m of content.materials) {
    out.push(eintrag('material', m.title, 'Material', klartext(m.markdown), `/material/${m.id}`));
  }
  for (const c of cardPool(content.flashcards, settings)) {
    if (c.typ === 'begriff' && imGlossar.has(normalisiere(c.question))) continue;
    const deck = c.deckId ? content.decks.find((d) => d.id === c.deckId)?.title : undefined;
    const art =
      c.kind === 'prueferfrage' ? 'Prüferfrage' : c.kind === 'fachgespraech' ? 'Fachgespräch' : `Lernkarte${deck ? ` · ${deck}` : ''}`;
    const wo = ddName(content, c.topicId);
    out.push(
      eintrag(
        'karte',
        kurz(c.question, 110),
        wo ? `${art} · ${wo}` : art,
        klartext(`${c.question}\n${c.answer ?? ''}`),
        `/karteikarten?karten=${encodeURIComponent(c.id)}&von=suche`,
      ),
    );
  }
  for (const task of Object.values(content.tasks)) {
    out.push(
      eintrag(
        'aufgabe',
        `${task.code}: ${kurz(task.markdown)}`,
        ddName(content, task.topicId),
        klartext(task.markdown),
        `/aufgabe/${encodeURIComponent(task.id)}`,
      ),
    );
    // Musterlösung als eigener Treffer: Begriffe, die nur in der Lösung stehen (z. B. aus den *_Loesungen.md), werden gefunden,
    // ohne dass der Ausschnitt beim Treffer „Aufgabe“ die Lösung verrät.
    if (task.solution?.markdown.trim()) {
      out.push(
        eintrag(
          'loesung',
          `${task.code}: ${kurz(task.markdown, 80)}`,
          `Musterlösung · ${ddName(content, task.topicId)}`,
          klartext(task.solution.markdown),
          `/aufgabe/${encodeURIComponent(task.id)}`,
        ),
      );
    }
  }
  for (const e of content.sqlExercises) {
    out.push(
      eintrag(
        'sql',
        e.titel,
        `${e.thema} · ${e.id}`,
        klartext(`${e.aufgabe}\n${e.tags.join(' ')}`),
        `/sql/uebung/${encodeURIComponent(e.id)}`,
      ),
    );
  }
  for (const u of content.rechenUebungen) {
    out.push(
      eintrag(
        'rechnen',
        u.titel,
        `${u.thema} · ${u.id}`,
        klartext(`${u.aufgabe}\n${u.tags.join(' ')}`),
        `/rechnen/${encodeURIComponent(u.id)}`,
      ),
    );
  }
  for (const f of FORMELN) {
    const text = `${f.erklaerung} ${f.variablen.map((v) => v.bedeutung).join(' ')}`;
    out.push(
      eintrag('formel', f.name, `Formelsammlung · ${THEMA_NAMEN[f.thema] ?? f.thema}`, text, `/material/formeln?stelle=formel-${f.id}`),
    );
  }
  for (const o of OPERATOREN) {
    out.push(eintrag('operator', o.name, 'Operatoren', `${o.verlangt} ${o.punkte} ${o.tipp}`, `/material/operatoren?stelle=op-${o.id}`));
  }
  return out;
}

const wortAnfang = (hay: string, w: string) => hay.includes(` ${w}`);
const wortGenau = (hay: string, w: string) => hay.includes(` ${w} `);

/** Punkte eines Eintrags für die Suchwörter (0 = kein Treffer: mindestens ein Wort fehlt). */
export function bewerte(e: SuchEintrag, woerter: string[], ganz: string): number {
  let punkte = 0;
  for (const w of woerter) {
    if (wortGenau(e.titelN, w)) punkte += 12;
    else if (wortAnfang(e.titelN, w)) punkte += 8;
    else if (e.titelN.includes(w)) punkte += 5;
    else if (wortAnfang(e.textN, w)) punkte += 2;
    else if (e.textN.includes(w)) punkte += 1;
    else return 0;
  }
  if (woerter.length > 1 && e.titelN.includes(ganz)) punkte += 10;
  // Abschnitte ohne Nummerierung vergleichen („2.5 Sequenzdiagramm“, „Teil 5 – Boxplot“): Die Überschrift zum Begriff soll weit oben stehen.
  const titel = e.art === 'abschnitt' ? e.titelN.replace(/^ (?:teil \d+ )?(?:\d+ )*/, ' ') : e.titelN;
  if (titel.startsWith(` ${ganz}`)) punkte += 6;
  // Genau der gesuchte Begriff: zuerst Begriffsseite bzw. Glossar-Eintrag (auch über eine andere Schreibweise), dann der Abschnitt mit
  // dieser Überschrift (vor Karten mit dem Begriff im Titel).
  if ((e.art === 'begriff' || e.art === 'glossar') && e.namenN.includes(ganz)) punkte += 8;
  else if (e.art === 'abschnitt' && normalisiere(ueberschriftKern(e.titel)) === ganz) punkte += 4;
  return punkte + SUCH_ART[e.art].bonus;
}

/** Ausschnitt aus dem Klartext um das erste Wort, das ein Suchwort enthält (etwa 160 Zeichen). */
export function ausschnitt(text: string, woerter: string[], laenge = 160): string {
  const teile = text.split(/(\s+)/);
  let pos = -1;
  let zeichen = 0;
  for (const t of teile) {
    const n = normalisiere(t);
    const z = n.replace(/ /g, '');
    if (n && woerter.some((w) => n.includes(w) || z.includes(w))) {
      pos = zeichen;
      break;
    }
    zeichen += t.length;
  }
  if (pos < 0) return '';
  const start = Math.max(0, pos - 50);
  const roh = text.slice(start, start + laenge);
  const anfang = start > 0 ? roh.replace(/^\S*\s/, '') : roh;
  return `${start > 0 ? '… ' : ''}${anfang}${start + laenge < text.length ? ' …' : ''}`;
}

/** Die ersten etwa 160 Zeichen, an einer Wortgrenze gekürzt. */
const textAnfang = (text: string, laenge = 160) => (text.length <= laenge ? text : `${text.slice(0, laenge).replace(/\s+\S*$/, '')} …`);

/** Sucht im Index; höchstens `max` Treffer, beste zuerst. Suchtext kürzer als 2 Zeichen → keine Treffer. */
export function suche(index: SuchEintrag[], anfrage: string, max = 40): SuchTreffer[] {
  const ganz = normalisiere(anfrage);
  if (ganz.length < 2) return [];
  const woerter = [...new Set(ganz.split(' ').filter(Boolean))];
  const treffer: { e: SuchEintrag; punkte: number; i: number }[] = [];
  index.forEach((e, i) => {
    const punkte = bewerte(e, woerter, ganz);
    if (punkte > 0) treffer.push({ e, punkte, i });
  });
  treffer.sort((a, b) => b.punkte - a.punkte || a.e.titel.length - b.e.titel.length || a.i - b.i);
  return treffer.slice(0, max).map(({ e, punkte }) => ({
    eintrag: e,
    punkte,
    // Begriffsseite, deren Name passt: der Anfang der Definition sagt mehr als eine Stelle mitten im Text.
    ausschnitt: e.art === 'begriff' && woerter.every((w) => e.titelN.includes(w)) ? textAnfang(e.text) : ausschnitt(e.text, woerter),
  }));
}

/** Begriffsseiten als Sucheinträge (Umsetzungsplan Phase 3): Begriff und andere Schreibweisen zählen wie der Titel, der Seitentext als Text. */
export function begriffSuchEintraege(seiten: BegriffsSeite[]): ZusatzEintrag[] {
  return seiten.map((s) => ({
    art: 'begriff' as const,
    titel: s.begriff,
    kontext: s.auch ? `auch: ${s.auch.join(', ')}` : '',
    text: klartext(s.markdown),
    link: `/glossar/${encodeURIComponent(s.id)}`,
    ...(s.auch ? { auch: s.auch } : {}),
  }));
}

/** Ist der Treffer ein Begriff (Begriffsseite oder Glossar-Eintrag ohne Seite)? */
export const istBegriff = (t: SuchTreffer) => t.eintrag.art === 'begriff' || t.eintrag.art === 'glossar';

/**
 * Suche, die immer zuerst auf Begriffe führt (Entscheidung E1): Gibt es Begriffe, sind nur sie das Ergebnis – die übrigen Treffer
 * (Lernblätter, Karten, Aufgaben …) gibt es auf Wunsch (`alle`). Passt kein Begriff, kommen die übrigen Treffer direkt (Rückfall).
 */
export function sucheBegriffe(
  index: SuchEintrag[],
  anfrage: string,
  alle = false,
  max = 40,
): { treffer: SuchTreffer[]; weitere: number; rueckfall: boolean } {
  const gesamt = suche(index, anfrage, 400);
  const begriffe = gesamt.filter(istBegriff);
  if (!begriffe.length) return { treffer: gesamt.slice(0, max), weitere: 0, rueckfall: gesamt.length > 0 };
  if (alle) return { treffer: gesamt.slice(0, max), weitere: 0, rueckfall: false };
  return { treffer: begriffe.slice(0, max), weitere: gesamt.length - begriffe.length, rueckfall: false };
}
