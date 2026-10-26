import { useState } from 'react';
import type { Fehlergrund, Sicherheit } from '../../shared/progress';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnswerInput } from '../components/AnswerInput';
import { AnhangPanel } from '../components/Belegsatz';
import { FehlergrundWahl } from '../components/FehlergrundWahl';
import { Markdown } from '../components/Markdown';
import { SicherheitWahl } from '../components/SicherheitWahl';
import { Attachments, GradePanel, TaskText } from '../components/TaskParts';
import { anhangFuer } from '../lib/anhang';
import { formatPoints } from '../lib/grading';
import { sicherheitLabel } from '../lib/kalibrierung';
import { isDue, recordAttempt, resetAufgabenAntworten, setzeFehlergrund } from '../lib/progress';
import { meldeFertig } from '../lib/heuteSitzung';
import { recordSqlCheck } from '../lib/sql';
import { useStore } from '../lib/store';

export function Aufgabe() {
  const { taskId } = useParams();
  // Beim Wechsel zur nächsten Aufgabe alles zurücksetzen: neuer key = frischer Zustand.
  return <AufgabeSeite key={taskId} taskId={taskId} />;
}

function AufgabeSeite({ taskId }: { taskId: string | undefined }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { content, progress, update, replaceProgress } = useStore();
  const task = taskId ? content.tasks[taskId] : undefined;
  const repeat = params.get('modus') === 'wiederholung';
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [points, setPoints] = useState<number | undefined>();
  const [saved, setSaved] = useState<string | undefined>();
  const [sicherheit, setSicherheit] = useState<Sicherheit | undefined>();
  const [fehlergrund, setFehlergrund] = useState<Fehlergrund | undefined>();

  if (!task)
    return (
      <div className="page">
        <h1>Aufgabe nicht gefunden</h1>
        <Link to="/aufgaben">Zur Aufgabenliste</Link>
      </div>
    );
  const topic = content.topics.find((t) => t.id === task.topicId);
  const block = topic?.exam?.blocks.find((b) => b.taskIds.includes(task.id));
  const history = progress.attempts.filter((a) => a.taskId === task.id);
  const journal = progress.journal[task.id];

  const nextDue = Object.values(progress.journal).find(
    (j) => !j.resolvedAt && isDue(j.due) && j.taskId !== task.id && content.tasks[j.taskId],
  );

  const unterVoll = points !== undefined && points < task.points;
  const anhang = anhangFuer([task]);

  const save = () => {
    if (points === undefined) return;
    const date = new Date().toISOString();
    update((p) =>
      recordAttempt(p, {
        taskId: task.id,
        date,
        points,
        max: task.points,
        mode: repeat ? 'wiederholung' : 'einzel',
        ...(sicherheit ? { sicherheit } : {}),
        ...(fehlergrund && unterVoll ? { fehlergrund } : {}),
      }),
    );
    setSaved(date);
    meldeFertig(task.id);
  };

  /** Fehlergrund wählen – auch nach dem Speichern, dann wird der gespeicherte Versuch angepasst (ROADMAP 8.7). */
  const waehleGrund = (g: Fehlergrund | undefined) => {
    setFehlergrund(g);
    if (saved) update((p) => setzeFehlergrund(p, task.id, saved, g));
  };

  return (
    <div className="page narrow notebook-page exercise-sheet">
      <div className="notebook-running-head">
        <span>AP2 · Übungsblatt</span>
        <span>{formatPoints(task.points)} Punkte</span>
      </div>
      <p className="crumbs">
        <Link to={repeat ? '/fehlerjournal' : `/aufgaben?thema=${task.topicId}`}>{repeat ? 'Fehlerjournal' : 'Einzelaufgaben'}</Link> /{' '}
        {topic?.title} {block && `/ Block ${block.letter} – ${block.title}`}
      </p>
      <h1>Einzelaufgabe {task.code}</h1>
      {journal && !journal.resolvedAt && (
        <p className="card warn">
          Im Fehlerjournal · Stufe {journal.stage + 1}/3 · zuletzt {formatPoints(journal.lastPoints)}/{formatPoints(journal.max)} P · fällig{' '}
          {new Date(journal.due).toLocaleDateString('de-DE')}
        </p>
      )}
      {topic?.exam && <Attachments items={topic.exam.attachments} />}
      {(anhang.sql || anhang.formeln) && (
        <div className="anhang-leiste no-print">
          <AnhangPanel {...anhang} />
        </div>
      )}
      {block?.intro && <Markdown source={false}>{block.intro}</Markdown>}

      <div className="task-card">
        <TaskText task={task} showMeta />
        <AnswerInput task={task} value={answer} onChange={setAnswer} disabled={revealed} />
        {!revealed ? (
          <SicherheitWahl value={sicherheit} onChange={setSicherheit} />
        ) : (
          sicherheit && <p className="muted small">Deine Einschätzung: {sicherheitLabel(sicherheit)}</p>
        )}
        {!revealed ? (
          <div className="actions">
            <button type="button" onClick={() => setRevealed(true)}>
              Abgeben &amp; Lösung anzeigen
            </button>
          </div>
        ) : (
          <>
            <GradePanel
              task={task}
              answer={answer}
              points={points}
              onPoints={setPoints}
              onSqlGeprueft={task.sqlUebung ? (ok) => update((p) => recordSqlCheck(p, task.sqlUebung!, ok)) : undefined}
            />
            {unterVoll && <FehlergrundWahl value={fehlergrund} onChange={waehleGrund} />}
            <div className="actions">
              {!saved ? (
                <button type="button" onClick={save} disabled={points === undefined}>
                  Ergebnis speichern{points !== undefined && ` (${formatPoints(points)} / ${formatPoints(task.points)} P)`}
                </button>
              ) : (
                <span className="ok">✓ Gespeichert{points! < task.points ? ' – kommt morgen im Fehlerjournal wieder.' : '.'}</span>
              )}
              {saved && repeat && nextDue && (
                <button type="button" onClick={() => navigate(`/aufgabe/${nextDue.taskId}?modus=wiederholung`)}>
                  Nächste Wiederholung →
                </button>
              )}
              {saved && !repeat && (
                <Link className="button secondary" to={`/aufgaben?thema=${task.topicId}`}>
                  Weitere Aufgaben
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {history.length > 0 && (
        <p className="hint">
          Bisherige Versuche:{' '}
          {history
            .map((h) => `${new Date(h.date).toLocaleDateString('de-DE')}: ${formatPoints(h.points)}/${formatPoints(h.max)} P`)
            .join(' · ')}{' '}
          <button
            type="button"
            className="ghost danger"
            onClick={() => {
              replaceProgress(resetAufgabenAntworten(progress, [task.id]));
              setSaved(undefined);
            }}
          >
            Antworten zurücksetzen
          </button>
        </p>
      )}
    </div>
  );
}
