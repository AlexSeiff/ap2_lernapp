// Prüferfragen in der Theorie (`> ❓ **Prüferfrage:** Frage` + kursive Antwort in der nächsten Zitatzeile).
// Rein und ohne Abhängigkeiten: der Parser liest daraus Karteikarten, die Lernen-Ansicht blendet sie aus oder zeigt sie als Box.

export interface MdLine {
  text: string;
  inFence: boolean;
}

const START = /^>\s*❓\s*\*\*(Prüferfrage[^*]*?):\*\*\s*(.*)$/;

export interface PrueferfrageBlock {
  /** „Prüferfrage“ oder z. B. „Prüferfrage (Fehleranalyse)“. */
  label: string;
  question: string;
  answer?: string;
  /** Index der ersten Zeile nach dem Zitat. */
  end: number;
}

function stripItalics(s: string): string {
  const t = s.trim();
  const m = /^\*(?!\*)([\s\S]*)\*$/.exec(t);
  return m ? m[1].trim() : t;
}

/** Zeilen mit Markierung, ob sie in einem Codeblock liegen (wie toLines im Parser). */
export function markFences(markdown: string): MdLine[] {
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

/** Beginnt in Zeile `i` eine Prüferfrage? Dann Frage, Antwort und das Ende des Zitats. */
export function readPrueferfrage(lines: MdLine[], i: number): PrueferfrageBlock | null {
  const line = lines[i];
  if (!line || line.inFence) return null;
  const m = START.exec(line.text);
  if (!m) return null;
  const question = [m[2]];
  const answer: string[] = [];
  let j = i + 1;
  // Folgezeilen des Zitats: Frage läuft weiter, bis die kursive Antwort beginnt.
  for (; j < lines.length && /^>/.test(lines[j].text); j++) {
    const t = lines[j].text.replace(/^>\s?/, '');
    if (answer.length || /^\s*\*(?!\*)/.test(t)) answer.push(t);
    else question.push(t);
  }
  return {
    label: m[1].trim(),
    question: question.join('\n').trim(),
    answer: answer.length ? stripItalics(answer.join('\n')) : undefined,
    end: j,
  };
}

export type TheorySegment = { type: 'text'; markdown: string } | { type: 'prueferfrage'; label: string; question: string; answer?: string };

/** Entfernt Leerzeilen am Anfang und Ende. */
function trimBlank(lines: string[]): string {
  let a = 0;
  let b = lines.length;
  while (a < b && lines[a].trim() === '') a++;
  while (b > a && lines[b - 1].trim() === '') b--;
  return lines.slice(a, b).join('\n');
}

/** Zerlegt Theorie-Markdown in Text und Prüferfragen (Reihenfolge bleibt erhalten, Codeblöcke werden nicht angefasst). */
export function splitPrueferfragen(markdown: string): TheorySegment[] {
  const lines = markFences(markdown);
  const segments: TheorySegment[] = [];
  let text: string[] = [];
  const flush = () => {
    const md = trimBlank(text);
    if (md) segments.push({ type: 'text', markdown: md });
    text = [];
  };
  for (let i = 0; i < lines.length;) {
    const pf = readPrueferfrage(lines, i);
    if (pf) {
      flush();
      segments.push({
        type: 'prueferfrage',
        label: pf.label,
        question: pf.question,
        ...(pf.answer !== undefined ? { answer: pf.answer } : {}),
      });
      i = pf.end;
    } else {
      text.push(lines[i].text);
      i++;
    }
  }
  flush();
  return segments;
}

/** Theorie ohne Prüferfragen (Frage- und Antwortzeilen des Zitats fallen weg). */
export function stripPrueferfragen(markdown: string): string {
  return splitPrueferfragen(markdown)
    .flatMap((s) => (s.type === 'text' ? [s.markdown] : []))
    .join('\n\n');
}
