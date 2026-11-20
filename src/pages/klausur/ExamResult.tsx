import { Link } from 'react-router-dom';
import type { ExamRun } from '../../../domain/progress';
import { formatPoints, ihkGrade, percent } from '../../lib/grading';
import { klausurName } from '../../lib/mischKlausur';
import { useStore } from '../../lib/store';

export function ExamResult({ titel, misch, run }: { titel: string; misch: boolean; run: ExamRun }) {
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
