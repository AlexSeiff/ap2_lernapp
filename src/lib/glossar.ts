// Glossar (ROADMAP 8.9): Fachbegriffe aus den Begriffskarten (typ „begriff“), den Wissenskarten (typ „wissen“) und den fett
// gesetzten Begriffen der Lernblätter, mit Definition, wo es eine gibt. Rein, ohne React; Seite /glossar und die globale
// Suche nutzen es.
//
// - Begriffskarten (AP2_Fachbegriffe_Lernkarten.json): Vorderseite = Begriff, Rückseite = Definition. Sie gehen allen anderen vor.
// - Karten: Begriff aus Fragen wie „Was ist (ein/eine/der …) X?“, „Was bedeutet X?“, „Was versteht man unter X?“, „Wofür steht X?“,
//   „Was misst/beschreibt/bezeichnet X?“ – Definition = Antwort der Karte. Fragen mit Aufzählungen („Was sind A, B und C?“) zählen nicht.
// - Lernblätter (nur Theorie-Abschnitte, ohne Prüferfragen): **Begriff** am Zeilenanfang (auch in Listen) mit „:“, „–“ oder „=“
//   dahinter → Definition = Rest der Zeile; „**Begriff** ist/bezeichnet/… “ → der Satz; Tabellenzeile „| **Begriff** | … |“ → zweite
//   Zelle. Sonst ein Begriff ohne Definition mit Link zur Stelle. Keine Ergebnisse, Punkte, Hervorhebungen („**nicht**“, „**Drei**“).
// - Doppelte (gleich nach normalisiere, ohne Klammerzusatz) werden zusammengelegt: Definition der Karte vor der des Lernblatts,
//   alle Fundstellen bleiben (höchstens GLOSSAR_MAX_QUELLEN). Reihenfolge: Begriffskarte, Wissenskarte, Lernblatt.

import { stripPrueferfragen } from '../../shared/prueferfragen.ts';
import type { Content, Topic } from '../../shared/types.ts';
import type { KernInhalt } from '../../shared/texte.ts';
import { normalisiere } from './normalisiere.ts';

export interface GlossarQuelle {
  titel: string;
  link: string;
  /** Karteikarte oder Abschnitt eines Lernblatts (bestimmt das Icon). */
  art: 'karte' | 'abschnitt';
}

export interface GlossarEintrag {
  /** Stabil aus dem Begriff, für Anker (`g-<id>`). */
  id: string;
  begriff: string;
  /** Markdown; fehlt, wenn nur der fette Begriff ohne Erklärung gefunden wurde. */
  definition?: string;
  /** Woher die Definition stammt. */
  definitionAus?: 'karte' | 'lernblatt';
  quellen: GlossarQuelle[];
  /** Großbuchstabe A–Z (Ä → A …) oder „#“. */
  buchstabe: string;
}

export const GLOSSAR_MAX_QUELLEN = 4;

/** Hervorhebungen und Überschriften-Wörter, die kein Fachbegriff sind. */
const STOPP = new Set(
  [
    'achtung',
    'merke',
    'merksatz',
    'tipp',
    'hinweis',
    'wichtig',
    'beispiel',
    'beispiele',
    'lösung',
    'ergebnis',
    'summe',
    'regel',
    'faustregel',
    'prüfungsrelevanz',
    'prüfungstipp',
    'selbstbewertung',
    'selbstdiagnose',
    'vorteil',
    'vorteile',
    'nachteil',
    'nachteile',
    'ziel',
    'ablauf',
    'formel',
    'definition',
    'fazit',
    'nie',
    'immer',
    'nicht',
    'kein',
    'keine',
    'nur',
    'alle',
    'jede',
    'jeder',
    'beide',
    'zwei',
    'drei',
    'vier',
    'fünf',
    'erst',
    'dann',
    'vorher',
    'nachher',
    'ja',
    'nein',
    'und',
    'oder',
    'falsch',
    'richtig',
    'gut',
    'schlecht',
    'typisch',
    'falle',
    'gefahr',
    'warum',
    'wie',
    'was',
    'wann',
  ].map(normalisiere),
);

/** Schlüssel zum Zusammenlegen: ohne Klammerzusatz und Doppelpunkt, normalisiert. */
export const glossarSchluessel = (begriff: string) => normalisiere(begriff.replace(/\s*\([^)]*\)\s*/g, ' '));

/** Bereinigt einen Begriff (Doppelpunkt, Leerzeichen, Anführungszeichen) – oder undefined, wenn er keiner ist. */
export function pruefeBegriff(roh: string): string | undefined {
  const b = roh
    .replace(/\s+/g, ' ')
    .replace(/[:：]\s*$/, '')
    .replace(/^[„"“']+|[“"”']+$/g, '')
    .trim();
  if (b.length < 2 || b.length > 50) return undefined;
  if (b.split(' ').length > 5) return undefined;
  if (/[=→⇒≈$Σ<>|`]/.test(b) || /\(\s*\d+(,\d+)?\s*P\b/.test(b) || /\bP\)$/.test(b)) return undefined;
  // Zahlen, Ergebnisse, Paragrafen („Art. 25“) – außer „3. Normalform“, „3-2-1-Regel“.
  if (/\d/.test(b) && !/^\d\.\s*Normalform|^\d(-\d)+-Regel/.test(b)) return undefined;
  if (/[,;:]/.test(b)) return undefined; // Aufzählungen und „Amtszeit: 4 Jahre“
  if (/^(Der|Die|Das|Ein|Eine|Einen|Dein|Deine|Herr|Herrn|Frau|Für|Wichtige|Typische|Typischer|Weitere)\s/.test(b)) return undefined; // Satzanfänge
  if (/^(Prüfungs(antwort|formulierung|relevant|taktik|tipp)|Merkhilfe|Merksatz|Nenner-Merkhilfe|Durchgerechnet)/.test(b)) return undefined; // Lernhinweise („Prüfungstaktik“, „Merkhilfe“)
  // Höchstens ein kleingeschriebenes Wort („funktionale Abhängigkeit“, „k-Means“), sonst ist es eher ein Satz.
  if (b.split(' ').filter((w) => /^[a-zäöü]/.test(w) && !['und', 'vs.', '&'].includes(w)).length > 1) return undefined;
  if (/[.!?…]$/.test(b)) return undefined; // ganze Sätze
  if ((b.match(/\(/g)?.length ?? 0) !== (b.match(/\)/g)?.length ?? 0)) return undefined;
  if (!/^[A-ZÄÖÜ]/.test(b) && !/^[a-z]-[A-Z]/.test(b) && !/^\d\.\s*Normalform/.test(b)) return undefined; // Substantive/Abkürzungen; „k-Means“ darf
  if (/^[A-H]\d/.test(b)) return undefined; // Aufgabennummern wie „A1 (6 P)“
  if (STOPP.has(normalisiere(b))) return undefined;
  return b;
}

/** Begriff aus einer Kartenfrage („Was ist eine funktionale Abhängigkeit?“ → „funktionale Abhängigkeit“) oder undefined. */
export function begriffAusFrage(frage: string): string | undefined {
  const f = frage.trim();
  const muster = [
    /^Was versteht man unter (?:(?:einer|einem|einen|eine|ein|dem|der|den|die|das)\s+)?(.+?)\s*\?$/,
    /^Wofür steht (?:die Abkürzung |das Kürzel )?(.+?)\s*\?$/,
    /^Was (?:ist|bedeutet|bezeichnet|beschreibt|misst|meint) (?:man mit )?(?:(?:einer|einem|einen|eine|ein|der|die|das|den)\s+)?(.+?)\s*(?:\?|,\s*und\b.*|\s+und\s+(?:wo|wie|warum|wann|welche|was)\b.*|\s+[–-]\s+.*)$/,
  ];
  for (const m of muster) {
    const hit = m.exec(f);
    if (!hit) continue;
    const roh = hit[1].replace(/\?$/, '').trim();
    if (/,|\s(und|oder)\s/.test(roh)) return undefined; // Aufzählung mehrerer Begriffe
    // „Was ist bei … erforderlich?“ fragt nach etwas anderem als einem Begriff.
    if (/^(bei|für|im|in|an|am|auf|mit|nach|von|vom|zu|zum|zur|zwischen|unter|über|vor|wenn|wichtig|zu)\s/i.test(roh)) return undefined;
    // Kleingeschriebene Adjektive vor dem Substantiv sind ok („funktionale Abhängigkeit“) – geprüft wird das Wort mit Großbuchstaben.
    const gross = roh.charAt(0).toUpperCase() + roh.slice(1);
    return pruefeBegriff(gross) ? roh : undefined;
  }
  return undefined;
}

const topicLabel = (t: Pick<Topic, 'id' | 'number'>) => (t.id === '00' ? 'SQL-Zusatz' : `Deep Dive ${t.number}`);

/** Definition auf eine handliche Länge kürzen (am Satzende, höchstens etwa `max` Zeichen). */
function kuerzeDefinition(md: string, max = 320): string {
  const t = md.trim();
  if (t.length <= max) return t;
  const schnitt = t.slice(0, max);
  const satz = schnitt.lastIndexOf('. ');
  return `${satz > 80 ? schnitt.slice(0, satz + 1) : schnitt.trimEnd()} …`;
}

type Fund = {
  begriff: string;
  definition?: string;
  aus?: 'karte' | 'lernblatt';
  /** Aus einer Begriffskarte (typ „begriff“) – deren Definition geht vor. */
  begriffskarte?: boolean;
  quelle: GlossarQuelle;
  imSatz?: boolean;
};

/** Abkürzung wie „OLAP“, „ETL“, „RBAC“, „SQL-Injection“ zählt auch einzeln im Fließtext. */
const ABKUERZUNG = /^[A-ZÄÖÜ][A-ZÄÖÜ0-9&/-]{1,9}$/;

/** Taugt der Text als Erklärung? Mindestens ein paar Wörter, nicht nur eine Zahl oder ein fettes Ergebnis. */
export function guteDefinition(md: string | undefined): boolean {
  if (!md) return false;
  const text = md.replace(/\$[^$]*\$/g, ' ').replace(/[*_`|]/g, ' ');
  return (text.match(/[A-Za-zÄÖÜäöüß]{3,}/g)?.length ?? 0) >= 2;
}

const SATZ_VERBEN = /^(ist|sind|bezeichnet|bezeichnen|beschreibt|beschreiben|meint|heißt|bedeutet|nennt man|steht für|misst)\b/;

/** Fette Begriffe einer Zeile mit Definition, falls die Zeile eine hergibt. */
export function begriffeAusZeile(zeile: string): { begriff: string; definition?: string; imSatz?: boolean }[] {
  const out: { begriff: string; definition?: string; imSatz?: boolean }[] = [];
  // Tabellenzeile: erste Zelle nur fett → Definition aus der zweiten Zelle.
  const tab = /^\s*\|\s*\*\*([^*|]+?)\*\*\s*\|\s*([^|]+?)\s*\|/.exec(zeile);
  if (tab) {
    const b = pruefeBegriff(tab[1]);
    const def = tab[2].trim();
    if (b) out.push({ begriff: b, ...(guteDefinition(def) ? { definition: def } : {}) });
    return out;
  }
  // Zeilenanfang (auch Listenpunkt): **Begriff:** Definition / **Begriff** – Definition / **Begriff** ist …
  const anfang = /^\s*(?:[-*+]\s+|\d+\.\s+)?\*\*([^*]+?)\*\*\s*(.*)$/.exec(zeile);
  if (anfang) {
    const b = pruefeBegriff(anfang[1]);
    const rest = anfang[2].trim();
    let definition: string | undefined;
    const mitDoppelpunkt = /:\s*$/.test(anfang[1]);
    if (b) {
      if ((mitDoppelpunkt || /^[:–—=]/.test(rest) || /^-\s/.test(rest)) && rest.replace(/^[:–—=-]\s*/, '').length >= 8) {
        definition = rest.replace(/^[:–—=-]\s*/, '');
      } else if (SATZ_VERBEN.test(rest)) {
        definition = `**${b}** ${rest}`;
      }
      out.push({ begriff: b, ...(definition && guteDefinition(definition) ? { definition: kuerzeDefinition(definition) } : {}) });
    }
  }
  // Weitere fette Begriffe der Zeile (ohne Definition).
  const re = /\*\*([^*]+?)\*\*/g;
  let m: RegExpExecArray | null;
  let erster = true;
  while ((m = re.exec(zeile))) {
    if (erster && anfang && m.index === zeile.indexOf('**')) {
      erster = false;
      continue;
    }
    erster = false;
    const b = pruefeBegriff(m[1]);
    if (b) out.push({ begriff: b, imSatz: true });
  }
  return out;
}

const glossarCache = new WeakMap<Content, GlossarEintrag[]>();

/**
 * baueGlossar() einmal je Inhalt: Glossar-Seite, Begriffsseiten und Suche teilen sich das Ergebnis (der volle Inhalt aus lib/texte.ts
 * ist je Sitzung dasselbe Objekt). Nur für den Client – das Ergebnis nicht verändern.
 */
export function glossarVon(content: Content): GlossarEintrag[] {
  let g = glossarCache.get(content);
  if (!g) glossarCache.set(content, (g = baueGlossar(content)));
  return g;
}

/** Baut das Glossar aus den Inhalten: alphabetisch (deutsch), ohne Doppelte. */
export function baueGlossar(content: Content): GlossarEintrag[] {
  const funde: Fund[] = [];

  for (const c of content.flashcards) {
    if ((c.typ !== 'wissen' && c.typ !== 'begriff') || !c.answer) continue;
    const begriff = c.typ === 'begriff' ? c.question : begriffAusFrage(c.question);
    if (!begriff) continue;
    const t = content.topics.find((x) => x.id === c.topicId);
    const deck = content.decks.find((d) => d.id === c.deckId);
    funde.push({
      begriff,
      definition: kuerzeDefinition(c.answer, 600),
      aus: 'karte',
      ...(c.typ === 'begriff' ? { begriffskarte: true } : {}),
      quelle: {
        art: 'karte',
        titel: `${c.typ === 'begriff' ? 'Begriffskarte' : 'Karte'}${t ? ` · ${topicLabel(t)}` : deck ? ` · ${deck.title}` : ''}`,
        link: `/karteikarten?karten=${encodeURIComponent(c.id)}&von=suche`,
      },
    });
  }

  for (const t of content.topics) {
    for (const s of t.sections) {
      const quelle: GlossarQuelle = {
        art: 'abschnitt',
        titel: `${topicLabel(t)} · ${s.title}`,
        link: `/lernen/${t.id}?stelle=${encodeURIComponent(s.id)}`,
      };
      let imCode = false;
      for (const zeile of stripPrueferfragen(s.markdown).split('\n')) {
        if (/^\s*```/.test(zeile)) imCode = !imCode;
        if (imCode || /^\s*#/.test(zeile)) continue;
        for (const f of begriffeAusZeile(zeile)) {
          funde.push({
            begriff: f.begriff,
            ...(f.definition ? { definition: f.definition, aus: 'lernblatt' as const } : {}),
            ...(f.imSatz ? { imSatz: true } : {}),
            quelle,
          });
        }
      }
    }
  }

  const nachSchluessel = new Map<
    string,
    {
      varianten: Map<string, number>;
      defBegriff?: Fund;
      defKarte?: Fund;
      defBlatt?: Fund;
      quellen: GlossarQuelle[];
      anzahl: number;
      nurImSatz: boolean;
    }
  >();
  for (const f of funde) {
    const key = glossarSchluessel(f.begriff);
    if (!key) continue;
    let e = nachSchluessel.get(key);
    if (!e) nachSchluessel.set(key, (e = { varianten: new Map(), quellen: [], anzahl: 0, nurImSatz: true }));
    e.varianten.set(f.begriff, (e.varianten.get(f.begriff) ?? 0) + 1);
    e.anzahl++;
    if (!f.imSatz) e.nurImSatz = false;
    if (f.definition && f.begriffskarte && !e.defBegriff) e.defBegriff = f;
    if (f.definition && f.aus === 'karte' && !f.begriffskarte && !e.defKarte) e.defKarte = f;
    if (f.definition && f.aus === 'lernblatt' && !e.defBlatt) e.defBlatt = f;
    if (!e.quellen.some((q) => q.link === f.quelle.link)) e.quellen.push(f.quelle);
  }

  const ids = new Set<string>();
  const eintraege: GlossarEintrag[] = [];
  for (const [key, e] of nachSchluessel) {
    const def = e.defBegriff ?? e.defKarte ?? e.defBlatt;
    // Ein fettes Wort mitten im Satz ohne Erklärung ist oft nur betont („**Jonas**“): erst ab zwei Fundstellen oder als Abkürzung.
    if (!def && e.nurImSatz && e.anzahl < 2 && ![...e.varianten.keys()].some((v) => ABKUERZUNG.test(v))) continue;
    // Anzeige: die Schreibweise der Definition, sonst die häufigste (bei Gleichstand die längere, z. B. mit Klammerzusatz).
    const begriff =
      def?.begriff ?? [...e.varianten.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length || a[0].localeCompare(b[0]))[0][0];
    let id = key.replace(/ /g, '-');
    while (ids.has(id)) id += '-x';
    ids.add(id);
    const anfang = normalisiere(begriff).charAt(0).toUpperCase();
    eintraege.push({
      id,
      begriff: begriff.charAt(0).toUpperCase() + begriff.slice(1),
      ...(def ? { definition: def.definition, definitionAus: def.aus } : {}),
      quellen: e.quellen.slice(0, GLOSSAR_MAX_QUELLEN),
      buchstabe: /[A-Z]/.test(anfang) ? anfang : '#',
    });
  }
  const collator = new Intl.Collator('de', { sensitivity: 'base', numeric: true });
  return eintraege.sort((a, b) => collator.compare(a.begriff, b.begriff) || a.id.localeCompare(b.id));
}

/** Buchstaben A–Z (und „#“, falls vorhanden) mit der Zahl der Einträge – für die Sprungleiste. */
export function glossarBuchstaben(eintraege: GlossarEintrag[]): { buchstabe: string; anzahl: number }[] {
  const zahl = new Map<string, number>();
  for (const e of eintraege) zahl.set(e.buchstabe, (zahl.get(e.buchstabe) ?? 0) + 1);
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return [...(zahl.has('#') ? ['#'] : []), ...abc].map((buchstabe) => ({ buchstabe, anzahl: zahl.get(buchstabe) ?? 0 }));
}

/** Abschnittsüberschrift ohne Nummerierung: „2.5 Sequenzdiagramm“ → „Sequenzdiagramm“, „Teil 5 – Boxplot und Ausreißer“ → „Boxplot und Ausreißer“. */
export const ueberschriftKern = (titel: string) => titel.replace(/^(?:Teil\s+\d+\s*[–-]\s*)?(?:\d+(?:\.\d+)*\.?\s+)?/, '');

/** Einträge für die globale Suche (ROADMAP 8.8): Begriff + Definition, Ziel ist der Eintrag im Glossar; im Kontext das Thema des Begriffs. */
export function glossarSuchEintraege(eintraege: GlossarEintrag[], content?: KernInhalt) {
  // Jede Überschrift einmal normalisieren. Die erste genaue Überschrift hat Vorrang vor dem ersten Wortpräfix.
  const genau = new Map<string, string>();
  const beginnt = new Map<string, string>();
  for (const t of content?.topics ?? []) {
    for (const s of t.sections) {
      if (s.generiert) continue;
      const kern = glossarSchluessel(ueberschriftKern(s.title));
      const titel = `${topicLabel(t)} · ${s.title}`;
      if (!genau.has(kern)) genau.set(kern, titel);
      for (let i = kern.indexOf(' '); i !== -1; i = kern.indexOf(' ', i + 1)) {
        const anfang = kern.slice(0, i);
        if (!beginnt.has(anfang)) beginnt.set(anfang, titel);
      }
    }
  }
  return eintraege.map((e) => {
    const key = glossarSchluessel(e.begriff);
    const thema = (key && (genau.get(key) ?? beginnt.get(key))) || e.quellen.find((q) => q.art === 'abschnitt')?.titel;
    return {
      art: 'glossar' as const,
      titel: e.begriff,
      kontext: `Glossar${e.definition ? '' : ' · ohne Definition'}${thema ? ` · ${thema}` : ''}`,
      text: (e.definition ?? '').replace(/[*_`$>|]/g, ' ').replace(/\s+/g, ' '),
      link: `/glossar?stelle=g-${e.id}`,
    };
  });
}
