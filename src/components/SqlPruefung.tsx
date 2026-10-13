// Automatische Prüfung einer im SQL-Editor abgegebenen Aufgabe (Task.sqlUebung): Ergebnisvergleich mit der Musterlösung
// der verknüpften SQL-Übung, wie „✓ Prüfen“ auf der Übungsseite. Richtig → volle Punktzahl vorgeschlagen (außer bei
// Teilaufgaben); die Punkte bleiben änderbar. Lazy geladen aus GradePanel.

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SqlDataset, SqlExercise, Task } from '../../shared/types';
import { formatPoints } from '../lib/grading';
import { type CheckOutcome, pruefeAntwort, verdictMessage } from '../sql/pruefeUebung';
import type { LintWarning } from '../sql/types';
import { Icon } from './Icon';
import { DiffTable, LintWarnings, ResultTable, SqlError, withCode } from './ResultTable';

interface Props {
  task: Task;
  ex: SqlExercise;
  ds: SqlDataset;
  answer: string | undefined;
  points: number | undefined;
  onPoints: (p: number) => void;
  /** Wird nach der Prüfung einmal aufgerufen (Einzelaufgabe: zählt auch für die SQL-Übung). */
  onGeprueft?: (ok: boolean, query: string) => void;
}

type Stand = { kind: 'laeuft' } | { kind: 'fertig'; outcome: CheckOutcome; warnings: LintWarning[] };

export default function SqlPruefung({ task, ex, ds, answer, points, onPoints, onGeprueft }: Props) {
  const query = (answer ?? '').trim();
  const [stand, setStand] = useState<Stand>({ kind: 'laeuft' });
  const [showDiff, setShowDiff] = useState(false);
  // Aktuelle Werte für den einmaligen Prüflauf (Punkte nicht überschreiben, die schon vergeben sind).
  const latest = useRef({ points, onPoints, onGeprueft });
  useEffect(() => {
    latest.current = { points, onPoints, onGeprueft };
  });
  const gemeldet = useRef(false);

  useEffect(() => {
    if (!query) {
      if (latest.current.points === undefined) latest.current.onPoints(0);
      return;
    }
    let alive = true;
    void pruefeAntwort(ex, ds, query).then((r) => {
      if (!alive) return;
      setStand({ kind: 'fertig', ...r });
      if (r.outcome.kind === 'data-error' || gemeldet.current) return;
      gemeldet.current = true;
      const ok = r.outcome.kind === 'verdict' && r.outcome.ok;
      if (ok && !ex.teilaufgabe && latest.current.points === undefined) latest.current.onPoints(task.points);
      latest.current.onGeprueft?.(ok, query);
    });
    return () => {
      alive = false;
    };
  }, [ex, ds, query, task.points]);

  const uebungLink = (
    <Link className="sql-open" to={`/sql/uebung/${ex.id}`}>
      <Icon name="database" /> Als SQL-Übung öffnen
    </Link>
  );

  if (!query) {
    return (
      <div className="card sql-pruefung">
        <p className="verdict bad">
          <Icon name="circle-x" /> Keine Abfrage abgegeben – 0 Punkte.
        </p>
        {uebungLink}
      </div>
    );
  }
  if (stand.kind === 'laeuft') return <p className="muted small sql-pruefung">Abfrage wird mit der Musterlösung verglichen …</p>;

  const { outcome, warnings } = stand;
  if (outcome.kind === 'data-error') {
    return (
      <div className="card warn sql-pruefung">
        <Icon name="triangle-alert" /> Die Musterlösung lief nicht – bitte selbst bewerten.
        <div className="mono small error-text">{outcome.error}</div>
      </div>
    );
  }
  if (outcome.kind === 'error') {
    return (
      <div className="card verdict-fail sql-pruefung">
        <p className="verdict bad">
          <Icon name="circle-x" /> Automatische Prüfung: Deine Abfrage bricht mit einem Fehler ab.
        </p>
        <SqlError error={outcome.error} />
        <p className="hint">Teilpunkte vergibst du unten selbst – vergleiche mit der Musterlösung.</p>
        {uebungLink}
      </div>
    );
  }

  const { verdict } = outcome;
  const hasDiff = !outcome.ok && (verdict.missing.length > 0 || verdict.extra.length > 0);
  return (
    <div className={`card sql-pruefung ${outcome.ok ? 'success' : 'verdict-fail'}`}>
      <div className="verdict-row">
        <p className={`verdict ${outcome.ok ? 'ok' : 'bad'}`}>
          <Icon name={outcome.ok ? 'circle-check' : 'circle-x'} /> Automatische Prüfung: {withCode(verdictMessage(outcome))}
        </p>
        {hasDiff && (
          <button type="button" className="secondary" aria-expanded={showDiff} onClick={() => setShowDiff((x) => !x)}>
            Unterschiede {showDiff ? '▴' : '▾'}
          </button>
        )}
      </div>
      {outcome.ok && !ex.teilaufgabe && (
        <p className="hint">Volle Punktzahl ({formatPoints(task.points)} P) eingetragen – prüfe trotzdem kurz gegen die Musterlösung.</p>
      )}
      {outcome.ok && ex.teilaufgabe && (
        <p className="hint">Die korrigierte Abfrage stimmt. Benennung und Begründung der Fehler bewertest du unten selbst.</p>
      )}
      {!outcome.ok && <p className="hint">Teilpunkte vergibst du unten selbst – vergleiche mit der Musterlösung.</p>}
      <LintWarnings warnings={warnings} exercise />
      {hasDiff && showDiff && <DiffTable columns={outcome.expectedColumns} missing={verdict.missing} extra={verdict.extra} />}
      {outcome.userSet && (
        <details className="own-result">
          <summary>Dein Ergebnis</summary>
          <ResultTable columns={outcome.userSet.columns} rows={outcome.userSet.rows} ms={outcome.ms} />
        </details>
      )}
      {uebungLink}
    </div>
  );
}
