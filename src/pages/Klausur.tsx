import { Link, useNavigate, useParams } from 'react-router-dom';
import type { ExamRun } from '../../shared/progress';
import { AnswerInput } from '../components/AnswerInput';
import { FehlergrundWahl } from '../components/FehlergrundWahl';
import { Markdown } from '../components/Markdown';
import { SicherheitWahl } from '../components/SicherheitWahl';
import { Attachments, GradePanel, TaskText } from '../components/TaskParts';
import { useConfirm } from '../hooks/useConfirm';
import { useExamRun } from '../hooks/useExamRun';
import { formatRemaining, timerAnnouncement } from '../lib/examTimer';
import { formatPoints, ihkGrade, percent } from '../lib/grading';
import { sicherheitLabel } from '../lib/kalibrierung';
import { blockGruppen, istMischId, klausurName, MISCH_BEREICHE, type MischBereich, mischId, parseMischId } from '../lib/mischKlausur';
import { useStore } from '../lib/store';
import { neuerSeed } from '../rechnen/zufall';
import { EXAM_MINUTES } from '../../shared/config';
import { Icon } from '../components/Icon';

/** Link zu einer neu gemischten Probeklausur (neuer Seed bei jedem Klick). */
export function useNeueMischKlausur() {
  const navigate = useNavigate();
  return (bereich: MischBereich) => navigate(`/klausur/${mischId(bereich, neuerSeed())}`);
}

export function KlausurAuswahl() {
  const { content, progress } = useStore();
  const neueMisch = useNeueMischKlausur();
  const navigate = useNavigate();
  // Neu gemischt zum Ausdrucken (Umsetzungsplan Phase 6): gleicher Seed → Aufgaben- und Lösungsblatt passen zusammen.
  const druckeMisch = () => navigate(`/druck?misch=${mischId('gemischt', neuerSeed())}&art=aufgaben`);
  const active = progress.activeExam;
  const activeKnown = active && (istMischId(active.topicId) || content.topics.some((t) => t.id === active.topicId));
  const mischRuns = progress.exams.filter((e) => istMischId(e.topicId) && e.total !== undefined && e.max > 0);
  const mischBest = mischRuns.length ? Math.max(...mischRuns.map((e) => percent(e.total!, e.max))) : undefined;
  return (
    <div className="page">
      <h1>Übungsklausur</h1>
      <p className="lead">
        90 Minuten, 100 Punkte, ohne Unterlagen – wie in der IHK-Prüfung. Die Musterlösungen bleiben gesperrt, bis du abgibst.
      </p>
      {active && activeKnown && (
        <div className="card warn">
          Laufende Klausur: <b>{klausurName(content, active.topicId)}</b> (
          {active.submittedAt ? 'abgegeben, Bewertung offen' : 'in Bearbeitung'}) –{' '}
          <Link to={`/klausur/${active.topicId}`}>fortsetzen →</Link>
        </div>
      )}
      <section className="card misch-start">
        <h2>
          <Icon name="dices" /> Gemischte Probeklausur
        </h2>
        <p>
          Wie die echte AP2: Aufgaben aus mehreren Deep Dives, gewichtet nach der Themenliste – 90 Minuten, 100 Punkte. Jedes Mal neu
          gemischt.
          {mischRuns.length > 0 &&
            ` Bisher ${mischRuns.length}× geschrieben · bestes ${Math.round(mischBest!)} % (Note ${ihkGrade(mischBest!).note}).`}
        </p>
        <div className="actions">
          {MISCH_BEREICHE.map((b) => (
            <button key={b.id} type="button" className={b.id === 'gemischt' ? '' : 'secondary'} onClick={() => neueMisch(b.id)}>
              <Icon name="dices" /> {b.id === 'gemischt' ? 'Gemischte Probeklausur' : b.kurz}
            </button>
          ))}
          <button
            type="button"
            className="secondary"
            onClick={druckeMisch}
            title="Neu gemischte Probeklausur mit Deckblatt zum Ausdrucken; das passende Lösungsblatt ist einen Klick entfernt"
          >
            <Icon name="printer" /> Drucken
          </button>
        </div>
      </section>
      <h2>Je Deep Dive</h2>
      <div className="grid">
        {content.topics
          .filter((t) => t.exam)
          .map((t) => {
            const runs = progress.exams.filter((e) => e.topicId === t.id && e.total !== undefined);
            const best = runs.length ? Math.max(...runs.map((e) => percent(e.total!, e.max))) : undefined;
            return (
              <Link key={t.id} to={`/klausur/${t.id}`} className="tile">
                <span className="tile-num">{t.id === '00' ? '＋' : t.number}</span>
                <span className="tile-title">{t.title}</span>
                <span className="tile-meta">
                  {runs.length
                    ? `${runs.length}× geschrieben · bestes ${Math.round(best!)} % (Note ${ihkGrade(best!).note})`
                    : 'noch nicht geschrieben'}
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export function Klausur() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { content, aiEnabled } = useStore();
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
            <Icon name="play" /> Klausur starten ({EXAM_MINUTES} min)
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
          abhaken{aiEnabled ? ', Punkte eintragen oder die KI-Bewertung nutzen.' : ' oder Punkte eintragen.'}{' '}
          <Link to={`/druck?art=loesungen&thema=${quelle.id}`}>Lösungsblatt drucken</Link>
        </div>
      )}

      <Attachments items={exam.attachments} open={!submitted} />

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

function ExamResult({ titel, misch, run }: { titel: string; misch: boolean; run: ExamRun }) {
  const { content } = useStore();
  const total = run.total ?? 0;
  const pct = percent(total, run.max);
  const grade = ihkGrade(pct);
  const lost = Object.entries(run.scores)
    .map(([id, pts]) => ({ task: content.tasks[id], pts }))
    .filter((x) => x.task && x.pts < x.task.points);
  return (
    <div className="page narrow">
      <h1>Ergebnis: {titel}</h1>
      <div className={`result grade-${grade.note}`}>
        <span className="result-points">
          {formatPoints(total)} / {formatPoints(run.max)} P
        </span>
        <span className="result-grade">
          Note {grade.note} – {grade.label}
        </span>
      </div>
      <p>
        {pct >= 92
          ? misch
            ? 'Stark – quer über die Themen auf Einser-Niveau.'
            : 'Stark – das Thema sitzt auf Einser-Niveau.'
          : `Bis zur 1 fehlen dir ${formatPoints(Math.max(0, Math.ceil(0.92 * run.max) - total))} Punkte.`}{' '}
        {lost.length > 0 &&
          `${lost.length} Aufgaben unter voller Punktzahl wurden ins Fehlerjournal übernommen (Wiederholung morgen, dann nach 3 und 7 Tagen).`}
      </p>
      {lost.length > 0 && (
        <ul className="plain">
          {lost.map(({ task, pts }) => (
            <li key={task.id}>
              <Link to={`/aufgabe/${task.id}`}>{misch ? `${klausurName(content, task.topicId)} · ${task.code}` : task.code}</Link> –{' '}
              {formatPoints(pts)} / {formatPoints(task.points)} P
            </li>
          ))}
        </ul>
      )}
      <div className="actions">
        <Link className="button" to="/fehlerjournal">
          Zum Fehlerjournal
        </Link>
        <Link className="button secondary" to="/klausur">
          Weitere Klausur
        </Link>
      </div>
    </div>
  );
}
