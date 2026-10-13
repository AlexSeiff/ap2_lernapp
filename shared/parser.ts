// Parser für die Markdown-Lernblätter (DeepDive_NN_*.md) und ihre Lösungsdateien (*_Loesungen.md).
// Reine Funktionen ohne Dateisystemzugriff, damit Server und Tests sie gleichermaßen nutzen können.

import type { Content, Exam, ExamBlock, Flashcard, ImportIssue, MaterialDoc, Section, Solution, Task, Topic } from './types';
import { parseLernkarten } from './lernkarten';
import { readPrueferfrage } from './prueferfragen';
import { parseDiagrammUebungen } from './diagrammUebungen';
import { parseRechenUebungen, type RechenUebungPruefer } from './rechenUebungen';
import { parseSqlUebungen, verknuepfeSqlUebungen } from './sqlUebungen';
import { pruefeSvg, svgBloecke, svgIds } from './svgDiagramm';

interface Line {
  text: string;
  inFence: boolean;
}

const HEADING = /^(#{1,6})\s+(.*)$/;
const EXAM_HEADING = /^(?:\d+\.\s*)?Übungsklausur\b/;
const BLOCK_HEADING = /^(?:Block|Teil)\s+([A-Z])\s*[–-]\s*(.+?)\s*\((\d+(?:,\d+)?)\s*P\)\s*$/;
const TASK_START = /^(?:[-*]\s+)?\*\*([A-Z]\d+[a-z]?)\s*\((\d+(?:,\d+)?)\s*P\):\*\*\s*(.*)$/;
// Auch „**C7 – die vier Fehler:**" (älteres Format) wird als Lösungsbeginn erkannt.
const SOLUTION_START = /^(?:[-*]\s+)?\*\*([A-Z]\d+[a-z]?)(?:\s*\((\d+(?:,\d+)?)\s*P\))?(?:\s*[–-][^*]*)?:\*\*\s*(.*)$/;

export function toLines(markdown: string): Line[] {
  let inFence = false;
  return markdown
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((text) => {
      const isFence = /^\s*(```|~~~)/.test(text);
      const line = { text, inFence: inFence || isFence };
      if (isFence) inFence = !inFence;
      return line;
    });
}

function heading(line: Line): { level: number; title: string } | null {
  if (line.inFence) return null;
  const m = HEADING.exec(line.text);
  return m ? { level: m[1].length, title: m[2].trim() } : null;
}

/**
 * Entfernt eine persönliche Zeitangabe am Ende eines Titels, z. B. „SQL (KW 28–29)“ → „SQL“.
 * Ältere Lernblätter hatten sie aus einem Lernplan mit Kalenderwochen; angezeigt wird sie nicht mehr.
 */
export function stripKw(title: string): string {
  return title.replace(/\s*\(\s*KW\b[^)]*\)\s*$/i, '').trim();
}

export function parseNumber(s: string): number {
  return Number(s.replace(',', '.'));
}

/** Entfernt führende/abschließende Leerzeilen und Trennlinien. */
export function trimBlock(lines: string[]): string {
  const out = [...lines];
  const isEmpty = (s: string) => s.trim() === '' || /^\s*(---|\*\*\*|___)\s*$/.test(s);
  while (out.length && isEmpty(out[0])) out.shift();
  while (out.length && isEmpty(out[out.length - 1])) out.pop();
  return out.join('\n');
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Zerlegt einen Bereich an Überschriften bis `maxLevel` (außerhalb von Codeblöcken). */
function splitByHeadings(lines: Line[], maxLevel: number): { title: string; level: number; body: Line[] }[] {
  const parts: { title: string; level: number; body: Line[] }[] = [];
  let current: { title: string; level: number; body: Line[] } = { title: '', level: 0, body: [] };
  for (const line of lines) {
    const h = heading(line);
    if (h && h.level <= maxLevel) {
      parts.push(current);
      current = { title: h.title, level: h.level, body: [] };
    } else {
      current.body.push(line);
    }
  }
  parts.push(current);
  return parts.filter((p) => p.title || trimBlock(p.body.map((l) => l.text)));
}

function stripItalics(s: string): string {
  const t = s.trim();
  const m = /^\*(?!\*)([\s\S]*)\*$/.exec(t);
  return m ? m[1].trim() : t;
}

export function parsePrueferfragen(lines: Line[], topicId: string): Flashcard[] {
  const cards: Flashcard[] = [];
  for (let i = 0; i < lines.length; i++) {
    const pf = readPrueferfrage(lines, i);
    if (!pf) continue;
    i = pf.end - 1;
    cards.push({ id: `${topicId}-pf${cards.length + 1}`, topicId, kind: 'prueferfrage', question: pf.question, answer: pf.answer });
  }
  return cards;
}

export function parseFachgespraech(body: Line[], topicId: string): Flashcard[] {
  const cards: Flashcard[] = [];
  for (const line of body) {
    if (line.inFence) continue;
    const m = /^\d+\.\s+(.*)$/.exec(line.text);
    if (!m) continue;
    let q = m[1].trim();
    let answer: string | undefined;
    const exp = /\s*\((Erwartet[^:)]*:\s*[\s\S]*)\)\s*$/.exec(q);
    if (exp) {
      answer = exp[1].replace(/^Erwartet[^:]*:\s*/, '').trim();
      q = q.slice(0, exp.index).trim();
    }
    q = q.replace(/^„|“$|"$/g, '').replace(/^"/, '');
    cards.push({ id: `${topicId}-fg${cards.length + 1}`, topicId, kind: 'fachgespraech', question: q, answer });
  }
  return cards;
}

export function parseLernziele(body: Line[]): string[] {
  return body.map((l) => /^\s*[-*]\s+\[[ xX]\]\s+(.*)$/.exec(l.text)?.[1].trim()).filter((s): s is string => !!s);
}

/** Liest Aufgaben (A1, B2 …) aus einem Klausurblock. */
function parseTasks(body: Line[], topicId: string, block: string): { intro: string; tasks: Task[] } {
  const intro: string[] = [];
  const tasks: Task[] = [];
  let current: { code: string; points: number; lines: string[] } | null = null;
  const flush = () => {
    if (!current) return;
    tasks.push({
      id: `${topicId}-${current.code}`,
      code: current.code,
      topicId,
      block,
      points: current.points,
      markdown: trimBlock(current.lines),
      type: 'offen',
    });
  };
  for (const line of body) {
    const m = line.inFence ? null : TASK_START.exec(line.text);
    if (m) {
      flush();
      current = { code: m[1], points: parseNumber(m[2]), lines: m[3] ? [m[3]] : [] };
    } else if (current) {
      // Aufgaben aus Aufzählungen (älteres Format „- **W1 (5 P):**") sind eingerückt fortgesetzt.
      current.lines.push(line.text.replace(/^ {2}(?=\S)/, ''));
    } else {
      intro.push(line.text);
    }
  }
  flush();
  return { intro: trimBlock(intro), tasks };
}

export function parseExam(lines: Line[], topicId: string, extraAttachments: Section[] = []): { exam: Exam; tasks: Task[] } {
  const [first, ...rest] = lines;
  const title = first ? (heading(first)?.title ?? 'Übungsklausur') : 'Übungsklausur';
  const parts = splitByHeadings(rest, 3);
  const exam: Exam = { title, intro: '', attachments: [...extraAttachments], blocks: [], totalPoints: 0 };
  const tasks: Task[] = [];
  for (const part of parts) {
    const text = trimBlock(part.body.map((l) => l.text));
    if (!part.title) {
      exam.intro = text;
      continue;
    }
    const bm = BLOCK_HEADING.exec(part.title);
    if (bm) {
      const { intro, tasks: blockTasks } = parseTasks(part.body, topicId, bm[1]);
      const block: ExamBlock = {
        letter: bm[1],
        title: bm[2],
        points: parseNumber(bm[3]),
        intro,
        taskIds: blockTasks.map((t) => t.id),
      };
      exam.blocks.push(block);
      tasks.push(...blockTasks);
    } else {
      exam.attachments.push({ id: `${topicId}-anlage-${slugify(part.title)}`, title: part.title, level: part.level, markdown: text });
    }
  }
  exam.totalPoints = tasks.reduce((s, t) => s + t.points, 0);
  return { exam, tasks };
}

/** Extrahiert Kriterien aus einer Punktetabelle, deren letzte Spalte „P" heißt. */
export function parseCriteria(markdown: string): { label: string; points: number }[] | undefined {
  const lines = markdown.split('\n');
  const criteria: { label: string; points: number }[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const header = splitRow(lines[i]);
    if (!header || header[header.length - 1] !== 'P' || !/^\s*\|?\s*:?-+/.test(lines[i + 1])) continue;
    for (let j = i + 2; j < lines.length; j++) {
      const row = splitRow(lines[j]);
      if (!row) break;
      const pts = parseNumber(row[row.length - 1].replace(/\*/g, ''));
      if (!Number.isFinite(pts) || /^\**\s*(summe|gesamt)/i.test(row[0])) continue;
      criteria.push({ label: row.slice(0, -1).join(' – ').replace(/\*\*/g, ''), points: pts });
    }
  }
  return criteria.length ? criteria : undefined;
}

function splitRow(line: string): string[] | null {
  if (!/^\s*\|.*\|\s*$/.test(line)) return null;
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());
}

export function buildSolution(lines: string[]): Solution {
  const body: string[] = [];
  const kommentar: string[] = [];
  let inKommentar = false;
  for (const l of lines) {
    if (/^\*Prüferkommentar:/.test(l.trim())) inKommentar = true;
    else if (inKommentar && l.trim() === '') inKommentar = false;
    (inKommentar ? kommentar : body).push(l);
  }
  const markdown = trimBlock(body);
  const k = kommentar.length ? stripItalics(kommentar.join(' ')).replace(/^Prüferkommentar:\s*/, '') : undefined;
  return { markdown, kommentar: k, criteria: parseCriteria(markdown) };
}

/** Liest alle Musterlösungen (Code → Lösung) aus einer Lösungsdatei bzw. einem Lösungsabschnitt. */
export function parseSolutions(lines: Line[]): Map<string, { points?: number; solution: Solution }> {
  const result = new Map<string, { points?: number; solution: Solution }>();
  let current: { code: string; points?: number; lines: string[] } | null = null;
  const flush = () => {
    if (current) result.set(current.code, { points: current.points, solution: buildSolution(current.lines) });
    current = null;
  };
  for (const line of lines) {
    const h = heading(line);
    const isRule = !line.inFence && /^\s*---\s*$/.test(line.text);
    const m = line.inFence ? null : SOLUTION_START.exec(line.text);
    if (h || isRule) {
      flush();
      if (h && /^(Auswertung|Zwischenstand)/.test(h.title)) break;
    } else if (m) {
      flush();
      current = { code: m[1], points: m[2] ? parseNumber(m[2]) : undefined, lines: m[3] ? [m[3]] : [] };
    } else if (current) {
      current.lines.push(line.text);
    }
  }
  flush();
  return result;
}

export interface ParsedTopic {
  topic: Topic;
  tasks: Task[];
  flashcards: Flashcard[];
  issues: ImportIssue[];
}

/**
 * Parst ein Lernblatt samt optionaler Lösungsdatei.
 * Liegen die Musterlösungen im Blatt selbst (älteres Format), werden sie dort gesucht.
 */
export function parseTopic(id: string, file: string, markdown: string, solutionFile?: string, solutionMarkdown?: string): ParsedTopic {
  const issues: ImportIssue[] = [];
  const lines = toLines(markdown);
  const titleLine = lines.find((l) => heading(l)?.level === 1);
  const rawTitle = titleLine ? heading(titleLine)!.title : file;
  const tm = /^(?:Deep[- ]Dive(?:-Lernzettel)?\s*(\d+)?\s*:\s*)?(.*)$/.exec(rawTitle)!;
  const number = tm[1] ? Number(tm[1]) : Number(id);
  const title = stripKw(tm[2]) || stripKw(rawTitle);

  // Bereiche bestimmen: Theorie | Klausur | Anhang (Fachgespräch, Lernziele, Musterlösungen …)
  let examStart = -1;
  let examLevel = 0;
  let examEnd = lines.length;
  lines.forEach((l, i) => {
    const h = heading(l);
    if (!h) return;
    if (examStart < 0 && h.level <= 2 && EXAM_HEADING.test(h.title)) {
      examStart = i;
      examLevel = h.level;
    } else if (
      examStart >= 0 &&
      examEnd === lines.length &&
      i > examStart &&
      h.level <= Math.max(examLevel, 2) &&
      (h.level <= examLevel || /Fachgespräch|Musterlösung|Lernziel/.test(h.title))
    ) {
      examEnd = i;
    }
  });

  // Blatt ohne Übungsklausur (z. B. Glossar & Diagramme): Fachgespräch und Lernziel-Check am Ende sind trotzdem Anhang.
  const anhangStart =
    examStart >= 0 ? examEnd : lines.findIndex((l) => (heading(l)?.level ?? 0) === 2 && /^(Fachgespräch|Lernziel)/.test(heading(l)!.title));
  const theoryLines = examStart >= 0 ? lines.slice(0, examStart) : anhangStart >= 0 ? lines.slice(0, anhangStart) : lines;
  const trailingLines = anhangStart >= 0 ? lines.slice(anhangStart) : [];

  const sections: Section[] = [];
  const flashcards: Flashcard[] = parsePrueferfragen(theoryLines, id);
  let lernziele: string[] = [];
  let inlineSolutions: Line[] | null = null;
  const attachmentsFromTheory: Section[] = [];

  for (const part of splitByHeadings(theoryLines, 3)) {
    if (part.level === 1 && part.title === rawTitle) {
      const intro = trimBlock(part.body.map((l) => l.text).filter((t) => !/^##\s/.test(t)));
      if (intro) sections.push({ id: `${id}-einleitung`, title: 'Einleitung', level: 2, markdown: intro });
      continue;
    }
    if (!part.title) continue;
    const section: Section = {
      id: `${id}-${slugify(stripKw(part.title))}`,
      title: stripKw(part.title),
      level: part.level,
      markdown: trimBlock(part.body.map((l) => l.text)),
    };
    if (section.level === 2 && part.title.startsWith('Lernzettel mit Übungsklausur')) continue;
    sections.push(section);
    if (/Übungsdatenbank|Beispieldatenbank/i.test(part.title)) attachmentsFromTheory.push(section);
  }

  for (const part of splitByHeadings(trailingLines, 2)) {
    if (!part.title) continue;
    if (/Fachgespräch/.test(part.title)) flashcards.push(...parseFachgespraech(part.body, id));
    else if (/Lernziel/.test(part.title)) lernziele = parseLernziele(part.body);
    else if (/Musterlösung/.test(part.title)) inlineSolutions = part.body;
    else
      sections.push({
        id: `${id}-${slugify(part.title)}`,
        title: part.title,
        level: part.level,
        markdown: trimBlock(part.body.map((l) => l.text)),
      });
  }

  let exam: Exam | undefined;
  let tasks: Task[] = [];
  if (examStart >= 0) {
    ({ exam, tasks } = parseExam(lines.slice(examStart, examEnd), id, attachmentsFromTheory));
    if (!tasks.length) issues.push({ file, message: 'Klausurabschnitt gefunden, aber keine Aufgaben erkannt.' });
  } else if (solutionMarkdown) {
    // Ein Blatt ohne Lösungsdatei darf reine Theorie sein; mit Lösungsdatei fehlt die Klausur wohl nur wegen der Überschrift.
    issues.push({ file, message: 'Kein Abschnitt „Übungsklausur" gefunden.' });
  }

  // Musterlösungen zuordnen
  const solutionLines = solutionMarkdown ? toLines(solutionMarkdown) : inlineSolutions;
  if (solutionLines) {
    const solutions = parseSolutions(solutionLines);
    const srcFile = solutionMarkdown ? (solutionFile ?? file) : file;
    for (const task of tasks) {
      const sol = solutions.get(task.code);
      if (!sol) {
        issues.push({ file: srcFile, message: `Keine Musterlösung für Aufgabe ${task.code} gefunden.` });
        continue;
      }
      if (sol.points !== undefined && sol.points !== task.points) {
        issues.push({ file: srcFile, message: `Punktzahl ${task.code} weicht ab: Blatt ${task.points} P, Lösung ${sol.points} P.` });
      }
      task.solution = sol.solution;
      solutions.delete(task.code);
    }
    for (const code of solutions.keys()) {
      issues.push({ file: srcFile, message: `Lösung ${code} ohne passende Aufgabe im Lernblatt.` });
    }
  } else if (tasks.length) {
    issues.push({ file, message: 'Keine Lösungsdatei gefunden.' });
  }

  if (exam && exam.totalPoints !== 100) {
    issues.push({ file, message: `Klausur ergibt ${exam.totalPoints} statt 100 Punkte.` });
  }

  const topic: Topic = {
    id,
    number,
    title,
    file,
    solutionFile,
    sections,
    exam,
    lernziele,
  };
  return { topic, tasks, flashcards, issues };
}

export interface SourceFile {
  name: string;
  text: string;
}

export interface BuildOptions {
  /** Prüft Rechenübungen gegen ihre Vorlage (server/loadContent.ts übergibt src/rechnen/pruefen.ts). */
  pruefeRechenUebung?: RechenUebungPruefer;
}

/** Baut den kompletten Inhaltsbestand aus allen Markdown-Dateien des Ordners. */
export function buildContent(files: SourceFile[], options: BuildOptions = {}): Content {
  const byName = new Map(files.map((f) => [f.name, f]));
  const content: Content = {
    importedAt: new Date().toISOString(),
    topics: [],
    tasks: {},
    flashcards: [],
    decks: [],
    cardHints: [],
    materials: [],
    sqlDatasets: [],
    sqlExercises: [],
    rechenUebungen: [],
    diagrammUebungen: [],
    issues: [],
  };

  const add = (parsed: ParsedTopic) => {
    content.topics.push(parsed.topic);
    for (const t of parsed.tasks) content.tasks[t.id] = t;
    content.flashcards.push(...parsed.flashcards);
    content.issues.push(...parsed.issues);
  };

  const sheets = files
    .map((f) => ({ f, m: /^DeepDive_(\d+)_(.+)\.md$/.exec(f.name) }))
    .filter((x) => x.m && !x.m[2].endsWith('_Loesungen'))
    .sort((a, b) => Number(a.m![1]) - Number(b.m![1]));

  for (const { f, m } of sheets) {
    const id = m![1].padStart(2, '0');
    const solName = f.name.replace(/\.md$/, '_Loesungen.md');
    const sol = byName.get(solName);
    add(parseTopic(id, f.name, f.text, sol ? solName : undefined, sol?.text));
  }

  for (const f of files) {
    const m = /^DeepDive_(\d+)_(.+)_Loesungen\.md$/.exec(f.name);
    if (m && !byName.has(`DeepDive_${m[1]}_${m[2]}.md`)) {
      content.issues.push({ file: f.name, message: 'Lösungsdatei ohne zugehöriges Lernblatt.' });
    }
  }

  // Älteres SQL-Blatt mit integrierten Lösungen als Zusatzthema
  const legacy = files.find((f) => /^Deep_Dive_SQL.*\.md$/.test(f.name));
  if (legacy) {
    const parsed = parseTopic('00', legacy.name, legacy.text);
    parsed.topic.title = `${parsed.topic.title} (Zusatzmaterial DataFit)`;
    add(parsed);
  }

  // Lernkarten-Dateien (JSON mit Decks) den passenden Deep Dives zuordnen
  const topicTitles = new Map(content.topics.filter((t) => t.id !== '00').map((t) => [t.id, t.title]));
  for (const f of files.filter((x) => /Lernkarten.*\.json$/i.test(x.name))) {
    const parsed = parseLernkarten(f.name, f.text, topicTitles);
    content.decks.push(...parsed.decks);
    content.flashcards.push(...parsed.cards);
    content.cardHints.push(...parsed.hints);
    content.issues.push(...parsed.issues);
  }

  // SQL-Übungen (Übungsdatenbanken und Aufgaben für den SQL-Editor)
  for (const f of files.filter((x) => /SQL_Uebungen.*\.json$/i.test(x.name))) {
    const parsed = parseSqlUebungen(f.name, f.text, topicTitles);
    content.sqlDatasets.push(...parsed.datasets);
    content.sqlExercises.push(...parsed.exercises);
    content.issues.push(...parsed.issues, ...verknuepfeSqlUebungen({ ...content, sqlExercises: parsed.exercises }, f.name));
  }

  // Rechenübungen (Vorlagen mit Zufallszahlen oder feste Aufgaben aus den Lernblättern)
  for (const f of files.filter((x) => /Rechen_Uebungen.*\.json$/i.test(x.name))) {
    const parsed = parseRechenUebungen(f.name, f.text, topicTitles, options.pruefeRechenUebung);
    content.rechenUebungen.push(...parsed.exercises);
    content.issues.push(...parsed.issues);
  }

  // Diagramm-Übungen (Umsetzungsplan Phase 7)
  for (const f of files.filter((x) => /Diagramm_Uebungen.*\.json$/i.test(x.name))) {
    const parsed = parseDiagrammUebungen(f.name, f.text);
    content.diagrammUebungen!.push(...parsed.uebungen);
    content.issues.push(...parsed.issues);
  }

  const materialFiles: [RegExp, string][] = [
    [/^Lernzettel_Kernthemen\.md$/, 'Lernzettel Kernthemen'],
    [/^AP2_Themenliste.*\.md$/, 'Themenliste & Beispielfragen'],
    [/^AP2_SQL_Belegsatz\.md$/, 'SQL-Belegsatz'],
  ];
  for (const [re, title] of materialFiles) {
    const f = files.find((x) => re.test(x.name));
    if (!f) continue;
    content.materials.push({ id: slugify(title), title, file: f.name, markdown: f.text.replace(/\r\n?/g, '\n') });
  }

  content.issues.push(...pruefeDiagramme(content));
  return content;
}

/** ```svg-Diagramme in Theorie und Material: Positivliste (shared/svgDiagramm.ts) und eindeutige ids (Marker gelten seitenweit). */
export function pruefeDiagramme(content: Content): ImportIssue[] {
  const issues: ImportIssue[] = [];
  const ids = new Map<string, string>();
  const quellen = [
    ...content.topics.flatMap((t) => t.sections.map((s) => ({ file: t.file, ort: s.title, md: s.markdown }))),
    ...content.materials.map((m) => ({ file: m.file, ort: m.title, md: m.markdown })),
  ];
  for (const q of quellen) {
    for (const svg of svgBloecke(q.md)) {
      const fehler = pruefeSvg(svg);
      if (fehler) issues.push({ file: q.file, message: `Diagramm in „${q.ort}“: ${fehler}` });
      for (const id of svgIds(svg)) {
        const vorher = ids.get(id);
        if (vorher)
          issues.push({
            file: q.file,
            message: `Diagramm in „${q.ort}“: id „${id}“ gibt es schon (${vorher}) – ids müssen eindeutig sein.`,
          });
        else ids.set(id, q.ort);
      }
    }
  }
  return issues;
}

export type { MaterialDoc };
