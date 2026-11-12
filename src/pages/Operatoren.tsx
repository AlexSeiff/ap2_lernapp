import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LeichtOptionen } from '../components/LeichtOptionen';
import { Markdown } from '../components/Markdown';
import { BEREICH_TEXT, OPERATOREN, OPERATOR_NACH_ID, operatorFrage, operatorHaeufigkeit, type OperatorFrage } from '../lib/operatoren';
import { useStelle } from '../hooks/useStelle';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icon';

/** Operatoren-Trainer (ROADMAP 8.4): Quiz „Was verlangt dieser Operator?“ mit echten Aufgaben und eine Übersicht aller Operatoren. */
export function Operatoren() {
  const { content } = useStore();
  useStelle();
  const aufgaben = useMemo(() => Object.values(content.tasks).map((t) => ({ id: t.id, text: t.markdown })), [content]);
  const haeufigkeit = useMemo(() => operatorHaeufigkeit(aufgaben.map((a) => a.text)), [aufgaben]);
  const [frage, setFrage] = useState<OperatorFrage | undefined>(() => operatorFrage(aufgaben));
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const [stand, setStand] = useState({ richtig: 0, gesamt: 0 });

  const neueFrage = () => {
    setFrage(operatorFrage(aufgaben));
    setGewaehlt(null);
  };
  const waehle = (i: number) => {
    if (!frage || gewaehlt !== null) return;
    setGewaehlt(i);
    const ok = frage.optionen[i] === frage.operatorId;
    setStand((s) => ({ richtig: s.richtig + (ok ? 1 : 0), gesamt: s.gesamt + 1 }));
  };

  const task = frage && content.tasks[frage.aufgabeId];
  const op = frage && OPERATOR_NACH_ID[frage.operatorId];
  const optionen = frage?.optionen.map((id) => ({ text: OPERATOR_NACH_ID[id].verlangt, richtig: id === frage.operatorId })) ?? [];
  const topic = task && content.topics.find((t) => t.id === task.topicId);
  const sortiert = [...OPERATOREN].sort((a, b) => a.bereich - b.bereich || (haeufigkeit[b.id] ?? 0) - (haeufigkeit[a.id] ?? 0));

  return (
    <div className="page">
      <h1>
        <Icon name="message-square-quote" /> Operatoren-Trainer
      </h1>
      <p className="lead">
        Der Operator („nennen“, „erläutern“, „beurteilen“ …) sagt, wie ausführlich du antworten musst. Wer „erläutern“ mit Stichpunkten
        beantwortet oder bei „beurteilen“ kein Urteil fällt, verschenkt Punkte. In Aufgaben und Klausuren sind die Operatoren unterstrichen
        – Maus drauf oder mit <kbd>Tab</kbd> hinspringen zeigt, was verlangt ist.
      </p>

      {frage && task && op ? (
        <section className="card">
          <h2>
            Quiz{' '}
            {stand.gesamt > 0 && (
              <span className="muted small">
                · {stand.richtig}/{stand.gesamt} richtig
              </span>
            )}
          </h2>
          <p className="muted small">
            {topic?.title} · Aufgabe {task.code}
          </p>
          <div className="task-text">
            <Markdown source={false}>{task.markdown}</Markdown>
          </div>
          <p>
            <b>Was verlangt der Operator „{frage.wort}“ hier?</b>
          </p>
          <LeichtOptionen
            optionen={optionen}
            gewaehlt={gewaehlt}
            onWaehle={waehle}
            tasten={false}
            label={`Was verlangt der Operator ${frage.wort}?`}
          />
          {gewaehlt !== null && (
            <div className="leicht-feedback" role="status">
              <p className={`verdict ${optionen[gewaehlt].richtig ? 'ok' : 'bad'}`}>
                <Icon name={optionen[gewaehlt].richtig ? 'circle-check' : 'circle-x'} />{' '}
                {optionen[gewaehlt].richtig ? 'Richtig!' : `Nicht ganz – „${frage.wort}“ heißt „${op.name}“.`}
              </p>
              <p>
                <b>{op.name}</b> ({BEREICH_TEXT[op.bereich]}): {op.verlangt} <i>Punkte: {op.punkte}.</i>
              </p>
              <p>
                <Icon name="lightbulb" /> {op.tipp}
              </p>
            </div>
          )}
          <div className="actions">
            <button type="button" onClick={neueFrage} autoFocus={gewaehlt !== null}>
              {gewaehlt === null ? 'Andere Aufgabe' : 'Nächste Frage →'}
            </button>
            <Link className="button secondary" to={`/aufgabe/${task.id}`}>
              Aufgabe bearbeiten
            </Link>
          </div>
        </section>
      ) : (
        <p className="muted">Keine Aufgaben mit Operatoren gefunden.</p>
      )}

      <section className="card">
        <h2>Alle Operatoren</h2>
        <div className="table-wrap">
          <table className="stats operatoren">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Bereich</th>
                <th>Was verlangt wird</th>
                <th>Typische Punkte</th>
                <th>Aufgaben</th>
              </tr>
            </thead>
            <tbody>
              {sortiert.map((o) => (
                <tr key={o.id} id={`op-${o.id}`}>
                  <td>
                    <b>{o.name}</b>
                  </td>
                  <td className="small">{BEREICH_TEXT[o.bereich]}</td>
                  <td>
                    {o.verlangt}
                    <br />
                    <span className="muted small">
                      <Icon name="lightbulb" /> {o.tipp}
                    </span>
                  </td>
                  <td className="small">{o.punkte}</td>
                  <td className="num">{haeufigkeit[o.id] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hint">
          Anforderungsbereiche: I wiedergeben, II anwenden und Zusammenhänge herstellen, III beurteilen und Probleme lösen. „Aufgaben“
          zählt, in wie vielen Aufgaben der Lernblätter der Operator vorkommt. Punkte sind Richtwerte – maßgeblich ist der
          Bewertungsschlüssel der Aufgabe.
        </p>
      </section>
    </div>
  );
}
