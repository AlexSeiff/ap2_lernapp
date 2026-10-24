import { lazy, Suspense, useEffect, useState } from 'react';
import type { Section, Task } from '../../shared/types';
import { api } from '../lib/api';
import { antwortAlsText, editorFuer } from '../lib/editorAufgabe';
import { autoGrade, difficulty, formatPoints } from '../lib/grading';
import { numberBlanks, solutionMarkdown } from '../lib/sheets';
import { sqlUebungZuAufgabe } from '../lib/sqlAufgabe';
import { useStore } from '../lib/store';
import { decodeAnswer } from './AnswerInput';
import { Markdown } from './Markdown';
import { Icon } from './Icon';

const SqlPruefung = lazy(() => import('./SqlPruefung'));
const EditorPruefung = lazy(() => import('./EditorAntwort').then((m) => ({ default: m.EditorPruefung })));

export function TaskText({ task, showMeta }: { task: Task; showMeta?: boolean }) {
  const { content } = useStore();
  const topic = content.topics.find((t) => t.id === task.topicId);
  return (
    <div className="task-text">
      <div className="task-head">
        <span className="task-code">{task.code}</span>
        <span className="badge">{formatPoints(task.points)} P</span>
        {showMeta && topic && <span className="badge muted">{topic.title}</span>}
        {showMeta && <span className={`badge diff-${difficulty(task.points)}`}>{difficulty(task.points)}</span>}
        {task.generated && <span className="badge ai">KI</span>}
      </div>
      <Markdown source={false} operatoren>
        {task.type === 'lueckentext' ? numberBlanks(task.markdown) : task.markdown}
      </Markdown>
    </div>
  );
}

export function Attachments({ items, open }: { items: Section[]; open?: boolean }) {
  if (!items.length) return null;
  return (
    <div className="attachments">
      {items.map((a) => (
        <details key={a.id} open={open}>
          <summary>
            <Icon name="paperclip" /> {a.title}
          </summary>
          <Markdown source={false}>{a.markdown}</Markdown>
        </details>
      ))}
    </div>
  );
}

interface GradeProps {
  task: Task;
  answer: string | undefined;
  points: number | undefined;
  onPoints: (p: number) => void;
  /** SQL-Aufgaben: nach der automatischen Prüfung einmal aufgerufen (Einzelaufgabe zählt auch für die SQL-Übung). */
  onSqlGeprueft?: (ok: boolean, query: string) => void;
}

/**
 * Lösungsansicht mit Bewertung: automatisch (objektive Aufgaben), per Kriterien-Checkliste,
 * per Punkteeingabe oder per KI-Bewertung.
 */
export function GradePanel({ task, answer, points, onPoints, onSqlGeprueft }: GradeProps) {
  const { aiEnabled, content } = useStore();
  const sql = sqlUebungZuAufgabe(content, task);
  const editor = editorFuer(task);
  const auto = decodeAnswer(task, answer);
  const autoResult = auto ? autoGrade(task, auto) : null;
  const criteria = task.solution?.criteria;
  const [checked, setChecked] = useState<boolean[]>(() => criteria?.map(() => false) ?? []);
  const [ai, setAi] = useState<{ loading?: boolean; error?: string; feedback?: string; missing?: string[] }>({});

  // Automatische Bewertung sofort übernehmen.
  useEffect(() => {
    if (autoResult && points !== autoResult.points) onPoints(autoResult.points);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoResult?.points]);

  const toggle = (i: number) => {
    const next = checked.map((c, j) => (j === i ? !c : c));
    setChecked(next);
    const sum = criteria!.reduce((s, c, j) => s + (next[j] ? c.points : 0), 0);
    onPoints(Math.min(task.points, sum));
  };

  const runAi = async () => {
    setAi({ loading: true });
    try {
      const r = await api.grade(task.id, antwortAlsText(task, answer));
      setAi({ feedback: r.feedback, missing: r.missing });
      onPoints(r.points);
    } catch (e) {
      setAi({ error: (e as Error).message });
    }
  };

  return (
    <div className="grade-panel">
      <div className="solution">
        <h4>Musterlösung</h4>
        <Markdown math loesung source={task.topicId}>
          {solutionMarkdown({ ...task, solution: task.solution && { ...task.solution, kommentar: undefined } })}
        </Markdown>
        {task.solution?.kommentar && (
          <aside className="pk-box">
            <div className="pk-label">Prüferkommentar</div>
            <Markdown math>{task.solution.kommentar}</Markdown>
          </aside>
        )}
      </div>

      <div className="grading">
        {autoResult ? (
          <p className={autoResult.points === task.points ? 'ok' : 'bad'}>
            Automatisch bewertet:{' '}
            <b>
              {formatPoints(autoResult.points)} / {formatPoints(task.points)} P
            </b>
            {task.type === 'mc' && autoResult.points === 0 && ' (Multiple Choice zählt nur vollständig richtig)'}
          </p>
        ) : (
          <>
            {sql && (
              <Suspense fallback={<p className="muted small">Abfrage wird mit der Musterlösung verglichen …</p>}>
                <SqlPruefung
                  task={task}
                  ex={sql.ex}
                  ds={sql.ds}
                  answer={answer}
                  points={points}
                  onPoints={onPoints}
                  onGeprueft={onSqlGeprueft}
                />
              </Suspense>
            )}
            {editor && (
              <Suspense fallback={null}>
                <EditorPruefung task={task} art={editor} answer={answer} />
              </Suspense>
            )}
            {criteria && (
              <div className="criteria">
                <p className="hint">Hake jedes Kriterium ab, das deine Lösung erfüllt:</p>
                {criteria.map((c, i) => (
                  <label key={i} className="choice">
                    <input type="checkbox" checked={checked[i] ?? false} onChange={() => toggle(i)} />
                    <span>
                      {c.label} <b>({formatPoints(c.points)} P)</b>
                    </span>
                  </label>
                ))}
              </div>
            )}
            <div className="points-input">
              <span>Selbstbewertung:</span>
              <button type="button" onClick={() => onPoints(0)}>
                0
              </button>
              <button type="button" onClick={() => onPoints(Math.round(task.points) / 2)}>
                ½
              </button>
              <button type="button" onClick={() => onPoints(task.points)}>
                voll
              </button>
              <input
                type="number"
                min={0}
                max={task.points}
                step={0.5}
                value={points ?? ''}
                placeholder="–"
                onChange={(e) => onPoints(Math.min(task.points, Math.max(0, Number(e.target.value))))}
              />
              <span>/ {formatPoints(task.points)} P</span>
              {aiEnabled && (
                <button type="button" className="secondary" onClick={runAi} disabled={ai.loading}>
                  {ai.loading ? (
                    'KI bewertet …'
                  ) : (
                    <>
                      <Icon name="sparkles" /> KI-Bewertung
                    </>
                  )}
                </button>
              )}
            </div>
            {ai.error && <p className="error">{ai.error}</p>}
            {ai.feedback && (
              <div className="ai-feedback">
                <b>KI-Feedback:</b> {ai.feedback}
                {!!ai.missing?.length && (
                  <ul>
                    {ai.missing.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
                <p className="hint">Die KI-Punkte sind ein Vorschlag – du kannst sie oben anpassen.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
