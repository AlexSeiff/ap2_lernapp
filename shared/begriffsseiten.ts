// Begriffsseiten (Umsetzungsplan Phase 3): eine ausführliche Seite je Glossarbegriff aus AP-2/Begriffsseiten_<Buchstabe>.md.
// Rein, ohne Node/React – Server (Import, Prüfung) und Client (Verweise auflösen) nutzen es gemeinsam.
//
// Format einer Seite (siehe AP-2/Prompt_Glossar_Begriffsseiten.md):
//   ## <Begriff>
//   <!-- id: <glossar-id> · quellen: <Fundstellen> · stand: <JJJJ-MM> -->
//   Definition (erster Absatz) …
//   Auch: <Variante>[, <Variante> …]            (optional)
//   ### Erklärung / ### Beispiel / ### Abgrenzung / ### Prüfungsfalle / ### Merksatz
//   Siehe auch: A · B · C
//   Mehr: Deep Dive 5, 6.5 · Deep Dive 11, A3
// Am Ende jeder Datei „## Ausgelassen“ mit Begriffen ohne Seite – wird übersprungen.

import type { KernInhalt } from './texte.ts';
import type { BegriffsSeite, ImportIssue } from './types.ts';

const ID_KOMMENTAR = /^<!--\s*id:\s*([^·]+?)\s*(?:·\s*quellen:\s*([^·]*?)\s*)?(?:·\s*stand:\s*([^·]*?)\s*)?-->\s*$/;

/** Liste aus „A · B · C“ (auch mit Komma, wenn kein Mittelpunkt vorkommt). */
function liste(text: string, komma = false): string[] {
  const teile = text.includes('·') || !komma ? text.split('·') : text.split(',');
  return teile.map((x) => x.trim()).filter(Boolean);
}

/** Alle Seiten einer Datei; Probleme (Seite ohne id) als ImportIssues. */
export function parseBegriffsseiten(datei: string, text: string): { seiten: BegriffsSeite[]; issues: ImportIssue[] } {
  const seiten: BegriffsSeite[] = [];
  const issues: ImportIssue[] = [];
  const zeilen = text.replace(/\r\n?/g, '\n').split('\n');
  let aktuell: { begriff: string; zeile: number; body: string[] } | null = null;
  let ausgelassen = false;
  let imCode = false;

  const abschliessen = () => {
    if (!aktuell) return;
    const { begriff, zeile } = aktuell;
    const body = aktuell.body;
    aktuell = null;
    // Die erste nicht leere Zeile ist der id-Kommentar.
    const erste = body.findIndex((z) => z.trim() !== '');
    const m = erste >= 0 ? ID_KOMMENTAR.exec(body[erste].trim()) : null;
    if (!m) {
      issues.push({ file: datei, message: `Begriffsseite „${begriff}“ (Zeile ${zeile}) ohne id-Kommentar – übersprungen.` });
      return;
    }
    const auch: string[] = [];
    const siehe: string[] = [];
    const mehr: string[] = [];
    const inhalt: string[] = [];
    let code = false;
    for (const z of body.slice(erste + 1)) {
      if (/^\s*```/.test(z)) code = !code;
      if (!code) {
        const a = /^Auch:\s*(.+)$/.exec(z);
        if (a) {
          auch.push(...liste(a[1], true));
          continue;
        }
        const s = /^Siehe auch:\s*(.*)$/.exec(z);
        if (s) {
          siehe.push(...liste(s[1]));
          continue;
        }
        const w = /^Mehr:\s*(.*)$/.exec(z);
        if (w) {
          mehr.push(...liste(w[1]));
          continue;
        }
      }
      inhalt.push(z);
    }
    seiten.push({
      id: m[1].trim(),
      begriff,
      ...(auch.length ? { auch } : {}),
      markdown: inhalt.join('\n').trim(),
      siehe,
      mehr,
      quellen: (m[2] ?? '').trim(),
      ...(m[3] ? { stand: m[3].trim() } : {}),
      datei,
    });
  };

  zeilen.forEach((z, i) => {
    if (/^\s*```/.test(z)) imCode = !imCode;
    const h = imCode ? null : /^## (.+)$/.exec(z);
    if (h) {
      abschliessen();
      ausgelassen = h[1].trim() === 'Ausgelassen';
      if (!ausgelassen) aktuell = { begriff: h[1].trim(), zeile: i + 1, body: [] };
      return;
    }
    if (aktuell) aktuell.body.push(z);
  });
  abschliessen();
  return { seiten, issues };
}

/** Schlüssel für Namensvergleiche („Siehe auch“ → Seite): klein, ohne Akzente/Satzzeichen, ohne Klammerzusatz. */
export function namensSchluessel(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Seite zu einem Namen (Begriff oder „Auch“-Variante), z. B. für „Siehe auch“. */
export function seitenNachName(seiten: Pick<BegriffsSeite, 'id' | 'begriff' | 'auch'>[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const s of seiten) {
    for (const n of [s.begriff, ...(s.auch ?? [])]) {
      const k = namensSchluessel(n);
      if (k && !map.has(k)) map.set(k, s.id);
    }
  }
  // Begriffe in Klammern („Online Analytical Processing (OLAP)“) auch über die Abkürzung finden.
  for (const s of seiten) {
    const klammer = /\(([^)]+)\)/.exec(s.begriff)?.[1];
    const k = klammer && namensSchluessel(klammer);
    if (k && !map.has(k)) map.set(k, s.id);
  }
  return map;
}

export interface MehrZiel {
  text: string;
  /** App-Pfad (HashRouter) oder undefined, wenn die Stelle nicht gefunden wurde. */
  link?: string;
}

/**
 * „Mehr: Deep Dive 5, 6.5“ → Abschnitt 6.5 von Deep Dive 5; „Deep Dive 5, Teil 3“ → Teil 3; „Deep Dive 11, A3“ → Abschnitt „A3 …“,
 * ohne solchen Abschnitt die Aufgabe 11-A3;
 * „Deep Dive 2, Denormalisierung“ → Abschnitt mit diesem Titel; „SQL-Zusatz 1.2“ → Zusatzmaterial SQL (Thema 00).
 */
export function mehrZiel(ref: string, content: Pick<KernInhalt, 'topics' | 'tasks'>): MehrZiel {
  const m = /^(?:Deep Dive\s+(\d+)|SQL-Zusatz)\s*,?\s*(.+)$/.exec(ref.trim());
  if (!m) return { text: ref };
  const topicId = m[1] ? m[1].padStart(2, '0') : '00';
  const stelle = m[2].trim();
  const topic = content.topics.find((t) => t.id === topicId);
  if (!topic) return { text: ref };
  const titel = (t: string) => t.toLowerCase();
  const passt = (s: { title: string }) => {
    const t = titel(s.title);
    if (/^\d+(\.\d+)*$/.test(stelle) || /^[A-F]\d+$/.test(stelle))
      return t.startsWith(`${stelle.toLowerCase()} `) || t === stelle.toLowerCase();
    if (/^teil \d+$/i.test(stelle)) return new RegExp(`^${stelle.toLowerCase()}\\b(?!\\.)`).test(t);
    return t === stelle.toLowerCase() || t.includes(stelle.toLowerCase());
  };
  const section = topic.sections.find(passt);
  if (section) return { text: ref, link: `/lernen/${topic.id}?stelle=${encodeURIComponent(section.id)}` };
  // Aufgabennummer ohne gleichnamigen Abschnitt (z. B. „A3“ der Übungsklausur) → die Einzelaufgabe.
  if (/^[A-F]\d+$/.test(stelle) && content.tasks[`${topicId}-${stelle}`]) return { text: ref, link: `/aufgabe/${topicId}-${stelle}` };
  return { text: ref, link: `/lernen/${topic.id}` };
}

/**
 * Prüft die Seiten gegen das Glossar: id muss es geben, ids eindeutig, „Siehe auch“ muss zu einer Seite führen – oder zu einem anderen
 * bekannten Namen (`weitereNamen`: Glossarbegriffe ohne Seite und Abschnittsüberschriften, als namensSchluessel), dorthin verlinkt die App.
 * `glossarIds` = ids aus baueGlossar (src/lib/glossar.ts).
 */
export function pruefeBegriffsseiten(seiten: BegriffsSeite[], glossarIds: Set<string>, weitereNamen = new Set<string>()): ImportIssue[] {
  const issues: ImportIssue[] = [];
  const gesehen = new Set<string>();
  const namen = seitenNachName(seiten);
  for (const s of seiten) {
    if (gesehen.has(s.id)) issues.push({ file: s.datei, message: `Begriffsseite „${s.begriff}“: id „${s.id}“ doppelt.` });
    gesehen.add(s.id);
    if (!glossarIds.has(s.id))
      issues.push({ file: s.datei, message: `Begriffsseite „${s.begriff}“: id „${s.id}“ gibt es im Glossar nicht.` });
    const fehlend = s.siehe.filter((n) => !namen.has(namensSchluessel(n)) && !weitereNamen.has(namensSchluessel(n)));
    if (fehlend.length)
      issues.push({ file: s.datei, message: `Begriffsseite „${s.begriff}“: „Siehe auch“ ohne Seite: ${fehlend.join(', ')}.` });
  }
  return issues;
}
