import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnswerInput } from '../components/AnswerInput';
import { FehlergrundWahl } from '../components/FehlergrundWahl';
import { Markdown } from '../components/Markdown';
import { SicherheitWahl } from '../components/SicherheitWahl';
import { Attachments, GradePanel, TaskText } from '../components/TaskParts';
import { AnhangPanel, hatAnhang } from '../components/Belegsatz';
import { useConfirm } from '../hooks/useConfirm';
import { useExamRun } from '../hooks/useExamRun';
import { anhangFuer } from '../lib/anhang';
import { formatRemaining, timerAnnouncement } from '../lib/examTimer';
import { formatPoints } from '../lib/grading';
import { sicherheitLabel } from '../lib/kalibrierung';
import { blockGruppen, MISCH_BEREICHE, parseMischId } from '../lib/mischKlausur';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icon';
import { ExamResult } from './klausur/ExamResult';
import { useNeueMischKlausur } from './klausur/KlausurAuswahl';

export function Klausur() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { content } = useStore();
  const neueMisch = useNeueMischKlausur();
  const {
    quelle,
    topic,
    exam,
    tasks,
    run,
    otherRun,
    result,
    submitted,
    minutes,
    remaining,
    answered,
    scored,
    sum,
    start,
    setAnswer,
    setScore,
    setSicherheit,
    setFehlergrund,
    submit,
    finish,
    abort,
  } = useExamRun(topicId);
  const confirm = useConfirm();

  if (!quelle || !exam)
    return (
      <div className="page">
        <h1>Keine Klausur für dieses Thema</h1>
        <Link to="/klausur">← Zur Auswahl</Link>
      </div>
    );

  if (result) return <ExamResult titel={topic?.title ?? exam.title} misch={!topic} run={result} />;
  const traps = topic ? content.flashcards.filter((c) => c.topicId === topic.id && c.typ === 'falle').length : 0;
  const misch = parseMischId(quelle.id);

  if (!run) {
    return (
      <div className="page narrow">
        <p className="crumbs">
          <Link to="/klausur">Übungsklausur</Link>
        </p>
        <h1>{exam.title}</h1>
        <p className="lead">{quelle.untertitel}</p>
        {exam.intro && <Markdown source={false}>{exam.intro}</Markdown>}
        {misch && (
          <div className="mode-switch" role="group" aria-label="Prüfungsbereich">
            {MISCH_BEREICHE.map((b) => (
              <button key={b.id} type="button" aria-pressed={b.id === misch.bereich} onClick={() => neueMisch(b.id)}>
                {b.kurz}
              </button>
            ))}
          </div>
        )}
        <ul className="plain">
          {exam.blocks.map((b) => (
            <li key={b.letter}>
              Block {b.letter} – {b.title}{' '}
              <span className="muted">
                ({formatPoints(b.points)} P, {b.taskIds.length} Aufgaben)
              </span>
              {quelle.misch && (
                <ul className="plain small muted misch-quellen">
                  {blockGruppen(b).map((g) => (
                    <li key={g.taskIds[0]}>
                      {g.quelle} ({g.taskIds.map((id) => content.tasks[id]?.code).join(', ')})
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        {quelle.misch && <p className="muted small">Summe: {formatPoints(exam.totalPoints)} Punkte.</p>}
        {otherRun && <p className="card warn">Es läuft noch eine andere Klausur. Beim Start hier wird sie verworfen.</p>}
        <div className="actions">
          <button
            type="button"
            onClick={async () => {
              if (
                otherRun &&
                !(await confirm({
                  message: 'Die andere laufende Klausur wird verworfen – mit allen Antworten. Fortfahren?',
                  confirmLabel: 'Verwerfen und starten',
                  danger: true,
                }))
              )
                return;
              start();
            }}
          >
            <Icon name="play" /> Klausur starten ({minutes} min)
          </button>
          {misch && (
            <button type="button" className="secondary" onClick={() => neueMisch(misch.bereich)}>
              <Icon name="dices" /> Neu mischen
            </button>
          )}
          {topic && traps > 0 && (
            <Link
              className="button secondary"
              to={`/karteikarten?thema=${topic.id}&typ=falle`}
              title="Typische Prüfungsfehler vor der Klausur wiederholen"
            >
              <Icon name="triangle-alert" /> {traps} Fallen-Karten vorher
            </Link>
          )}
          <Link className="button secondary" to={`/druck?art=aufgaben&thema=${quelle.id}`}>
            <Icon name="printer" /> Aufgabenblatt (PDF)
          </Link>
          <Link className="button secondary" to={`/druck?art=loesungen&thema=${quelle.id}`}>
            <Icon name="printer" /> Lösungsblatt (PDF)
          </Link>
        </div>
        <p className="hint">
          Tipp: Aufgabenblatt ausdrucken, handschriftlich lösen und danach hier nur noch die Punkte eintragen – so trainierst du wie in der
          Prüfung.
        </p>
      </div>
    );
  }

  // Anhang der Prüfung wie in der AP2: SQL-Belegsatz und/oder Formelübersicht, je nachdem, was die Klausur verlangt.
  const anhang = anhangFuer(tasks);
  return (
    <div className="page exam">
      <div className="exam-bar">
        <b>{exam.title}</b>
        {!submitted ? (
          <>
            {/* Sichtbarer Timer tickt jede Sekunde, ist aber keine Live-Region; angesagt wird nur alle 5 Minuten (sr-only). */}
            <span role="timer" aria-label="Restzeit" className={`timer ${remaining < 10 * 60_000 ? 'low' : ''}`}>
              <Icon name="timer" /> {formatRemaining(remaining)}
            </span>
            <span className="sr-only" aria-live="polite">
              {timerAnnouncement(remaining)}
            </span>
            <span className="muted">
              {answered}/{tasks.length} beantwortet
            </span>
            <button
              type="button"
              onClick={async () => {
                const empty = tasks.length - answered;
                const ok = await confirm({
                  title: 'Klausur abgeben?',
                  message: empty
                    ? `${empty} Aufgaben sind noch leer. Nach der Abgabe kannst du nichts mehr ändern.`
                    : 'Nach der Abgabe kannst du nichts mehr ändern.',
                  confirmLabel: 'Abgeben',
                  cancelLabel: 'Weiterschreiben',
                });
                if (!ok) return;
                submit();
                window.scrollTo(0, 0);
              }}
            >
              Abgeben
            </button>
          </>
        ) : (
          <>
            <span className="muted">
              Bewertet: {scored}/{tasks.length} · Zwischenstand {formatPoints(sum)} P
            </span>
            <button
              type="button"
              onClick={async () => {
                const missing = tasks.length - scored;
                if (
                  missing &&
                  !(await confirm({
                    title: 'Bewertung abschließen?',
                    message: `${missing} Aufgaben sind noch nicht bewertet und zählen 0 Punkte.`,
                    confirmLabel: 'Abschließen',
                    cancelLabel: 'Weiter bewerten',
                  }))
                )
                  return;
                finish();
                window.scrollTo(0, 0);
              }}
            >
              Bewertung abschließen
            </button>
          </>
        )}
        <button
          type="button"
          className="ghost"
          onClick={async () => {
            const ok = await confirm({
              title: 'Klausur abbrechen?',
              message: 'Alle Antworten und Punkte dieser Klausur werden verworfen.',
              confirmLabel: 'Klausur verwerfen',
              cancelLabel: submitted ? 'Weiter bewerten' : 'Weiterschreiben',
              danger: true,
            });
            if (!ok) return;
            abort();
            navigate('/klausur');
          }}
        >
          Abbrechen
        </button>
      </div>

      {submitted && (
        <div className="card info">
          <b>Lösungsblatt freigeschaltet.</b> Vergleiche jede Antwort mit der Musterlösung und vergib Punkte wie ein Prüfer – Kriterien
          abhaken oder Punkte eintragen. <Link to={`/druck?art=loesungen&thema=${quelle.id}`}>Lösungsblatt drucken</Link>
        </div>
      )}

      <Attachments items={exam.attachments} open={!submitted} />
      {hatAnhang({ ...anhang, situation: exam.attachments }) && (
        <div className={`anhang-leiste no-print${exam.attachments.length ? ' klebt' : ''}`}>
          <AnhangPanel {...anhang} situation={exam.attachments} />
        </div>
      )}

      {exam.blocks.map((b) => (
        <section key={b.letter} className="exam-block">
          <h2>
            Block {b.letter} – {b.title} <span className="muted">({formatPoints(b.points)} P)</span>
          </h2>
          {blockGruppen(b).map((g) => (
            <div key={g.taskIds[0]} className="exam-gruppe">
              {g.quelle && <h3 className="exam-quelle">{g.quelle}</h3>}
              {g.intro && <Markdown source={false}>{g.intro}</Markdown>}
              {g.taskIds.map((id) => {
                const task = content.tasks[id];
                if (!task) return null;
                return (
                  <div key={id} className={`task-card ${submitted ? 'review' : ''}`}>
                    <TaskText task={task} />
                    <AnswerInput
                      task={task}
                      value={run.answers[id]}
                      onChange={(v) => setAnswer(id, v)}
                      disabled={submitted}
                      sqlAusfuehren={false}
                    />
                    {!submitted ? (
                      <SicherheitWahl value={run.sicherheit?.[id]} onChange={(s) => setSicherheit(id, s)} />
                    ) : (
                      run.sicherheit?.[id] && <p className="muted small">Deine Einschätzung: {sicherheitLabel(run.sicherheit[id])}</p>
                    )}
                    {submitted && (
                      <GradePanel task={task} answer={run.answers[id]} points={run.scores[id]} onPoints={(v) => setScore(id, v)} />
                    )}
                    {submitted && run.scores[id] !== undefined && run.scores[id] < task.points && (
                      <FehlergrundWahl value={run.fehlergrund?.[id]} onChange={(g) => setFehlergrund(id, g)} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

// Eine Seite, ein Ladeschritt: App und Tests holen Klausur und KlausurAuswahl aus diesem Modul.
export { KlausurAuswahl } from './klausur/KlausurAuswahl';
