import { lazy, Suspense, useMemo } from 'react';
import type { Task } from '../../shared/types';
import { editorFuer } from '../lib/editorAufgabe';
import type { AutoAnswer } from '../lib/grading';
import { sqlUebungZuAufgabe } from '../lib/sqlAufgabe';
import { useStore } from '../lib/store';

// Nur bei Aufgaben mit verknüpfter SQL-Übung: CodeMirror und sql.js kommen erst dann.
const SqlAntwort = lazy(() => import('./SqlAntwort'));
// Nur bei Modellierungsaufgaben (ERM, EPK, BPMN, Use-Case, Normalisierung, Relationenmodell): Diagramm- bzw. Tabellen-Editor.
const EditorAntwort = lazy(() => import('./EditorAntwort'));

/** Antworten werden immer als String gespeichert; objektive Aufgaben als JSON. */
export function decodeAnswer(task: Task, raw: string | undefined): AutoAnswer | null {
  if (!task.auto || task.type === 'offen') return null;
  try {
    const parsed = raw ? (JSON.parse(raw) as AutoAnswer) : null;
    if (parsed && parsed.kind === kindOf(task)) return parsed;
  } catch {
    /* leer → Standardwert */
  }
  switch (task.type) {
    case 'mc':
      return { kind: 'mc', selected: [] };
    case 'lueckentext':
      return { kind: 'lueckentext', values: [] };
    case 'zuordnung':
      return { kind: 'zuordnung', mapping: {} };
    default:
      return { kind: 'rechnen', value: '' };
  }
}

const kindOf = (t: Task) => (t.type === 'offen' ? null : t.type);

/** Deterministisch gemischte Reihenfolge (pro Aufgabe stabil), damit Zuordnungen nicht trivial sind. */
export function shuffledOrder(n: number, seed: string): number[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

/** Monospace-Eingabe für SQL-Themen und Aufgaben mit Code (SQL, Pseudocode). */
export function looksLikeCode(task: Task, topicTitle = ''): boolean {
  return /^SQL\b/.test(topicTitle) || /```sql|\bSQL\b|Abfrage|Pseudocode|Struktogramm/i.test(task.markdown);
}

interface Props {
  task: Task;
  value: string | undefined;
  onChange: (v: string) => void;
  disabled?: boolean;
  /**
   * Hilfen während der Bearbeitung (Einzelaufgabe ja, Übungsklausur nein): SQL-Abfrage auf dem Datensatz ausprobieren,
   * Formprüfung im Diagramm-Editor.
   */
  sqlAusfuehren?: boolean;
}

export function AnswerInput({ task, value, onChange, disabled, sqlAusfuehren = true }: Props) {
  const { content } = useStore();
  const auto = decodeAnswer(task, value);
  const order = useMemo(() => shuffledOrder(task.auto?.pairs?.length ?? 0, task.id), [task]);
  const set = (a: AutoAnswer) => onChange(JSON.stringify(a));
  const sql = sqlUebungZuAufgabe(content, task);

  if (sql) {
    return (
      <Suspense fallback={<p className="muted small">SQL-Editor lädt …</p>}>
        <SqlAntwort ex={sql.ex} ds={sql.ds} value={value} onChange={onChange} disabled={disabled} ausfuehren={sqlAusfuehren} />
      </Suspense>
    );
  }

  const editor = editorFuer(task);
  if (editor) {
    return (
      <Suspense fallback={<p className="muted small">Editor lädt …</p>}>
        <EditorAntwort task={task} art={editor} value={value} onChange={onChange} disabled={disabled} hilfen={sqlAusfuehren} />
      </Suspense>
    );
  }

  if (!auto) {
    const code = looksLikeCode(task, content.topics.find((t) => t.id === task.topicId)?.title);
    return (
      <textarea
        className={`answer ${code ? 'mono' : ''}`}
        value={value ?? ''}
        disabled={disabled}
        placeholder={code ? 'Deine Lösung (SQL / Pseudocode) …' : 'Deine Antwort …'}
        rows={Math.min(18, Math.max(4, Math.round(task.points * 0.9)))}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={!code}
      />
    );
  }

  const a = task.auto!;
  switch (auto.kind) {
    case 'mc':
      return (
        <div className="choices">
          {(a.options ?? []).map((opt, i) => (
            <label key={i} className="choice">
              <input
                type="checkbox"
                disabled={disabled}
                checked={auto.selected.includes(i)}
                onChange={(e) =>
                  set({ kind: 'mc', selected: e.target.checked ? [...auto.selected, i] : auto.selected.filter((x) => x !== i) })
                }
              />
              <span>
                <b>{String.fromCharCode(65 + i)})</b> {opt}
              </span>
            </label>
          ))}
          <p className="hint">Es können mehrere Antworten richtig sein.</p>
        </div>
      );
    case 'lueckentext':
      return (
        <div className="blanks">
          {(a.blanks ?? []).map((_, i) => (
            <label key={i}>
              <span>[{i + 1}]</span>
              <input
                type="text"
                disabled={disabled}
                value={auto.values[i] ?? ''}
                onChange={(e) => {
                  const values = [...auto.values];
                  values[i] = e.target.value;
                  set({ kind: 'lueckentext', values });
                }}
              />
            </label>
          ))}
        </div>
      );
    case 'zuordnung':
      return (
        <div className="pairs">
          {(a.pairs ?? []).map((p, i) => (
            <label key={i}>
              <span className="pair-left">{p.left}</span>
              <select
                disabled={disabled}
                value={auto.mapping[i] ?? ''}
                onChange={(e) => set({ kind: 'zuordnung', mapping: { ...auto.mapping, [i]: Number(e.target.value) } })}
              >
                <option value="">– bitte wählen –</option>
                {order.map((j) => (
                  <option key={j} value={j}>
                    {a.pairs![j].right}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      );
    case 'rechnen':
      return (
        <label className="numeric">
          Ergebnis:
          <input
            type="text"
            inputMode="decimal"
            disabled={disabled}
            value={auto.value}
            placeholder="z. B. 12,5"
            onChange={(e) => set({ kind: 'rechnen', value: e.target.value })}
          />
          {a.numeric?.unit && <span>{a.numeric.unit}</span>}
          <span className="hint">Rechenweg auf Papier notieren – er steht in der Musterlösung.</span>
        </label>
      );
  }
}
