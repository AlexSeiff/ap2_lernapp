import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { JournalEntry } from '../../shared/progress';
import { FehlergrundKarte } from '../components/FehlergrundKarte';
import { FEHLERGRUND_INFO, letzterFehlergrund } from '../lib/fehlergruende';
import { formatPoints } from '../lib/grading';
import { fuelleFehlerjournal, isDue, localDate } from '../lib/progress';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icon';

export function Fehlerjournal() {
  const { content, progress, update } = useStore();
  // Aufgaben mit schlechtem letztem Ergebnis, die noch nicht im Journal stehen, werden hier aufgenommen.
  useEffect(() => {
    const next = fuelleFehlerjournal(progress, (id) => !!content.tasks[id]);
    if (next !== progress) update((p) => fuelleFehlerjournal(p, (id) => !!content.tasks[id]));
  }, [progress, content, update]);
  const entries = Object.values(progress.journal).filter((j) => content.tasks[j.taskId]);
  const open = entries.filter((j) => !j.resolvedAt).sort((a, b) => a.due.localeCompare(b.due));
  const due = open.filter((j) => isDue(j.due));
  const upcoming = open.filter((j) => !isDue(j.due));
  const resolved = entries.filter((j) => j.resolvedAt).sort((a, b) => b.resolvedAt!.localeCompare(a.resolvedAt!));

  return (
    <div className="page">
      <h1>Fehlerjournal</h1>
      <p className="lead">
        Jede Aufgabe unter voller Punktzahl landet automatisch hier und kommt nach <b>1, 3 und 7 Tagen</b> wieder. Erst nach drei vollen
        Wiederholungen gilt sie als erledigt; ein Fehler setzt sie auf Tag 1 zurück.
      </p>
      <FehlergrundKarte />
      <section className="card">
        <h2>Heute fällig ({due.length})</h2>
        {due.length ? (
          <>
            <Link className="button" to={`/aufgabe/${due[0].taskId}?modus=wiederholung`}>
              <Icon name="play" /> Wiederholung starten
            </Link>
            <EntryList entries={due} />
          </>
        ) : (
          <p className="muted">
            Nichts fällig – stark! <Icon name="party-popper" />
          </p>
        )}
      </section>
      {upcoming.length > 0 && (
        <section className="card">
          <h2>Demnächst ({upcoming.length})</h2>
          <EntryList entries={upcoming} />
        </section>
      )}
      {resolved.length > 0 && (
        <section className="card">
          <h2>Erledigt ({resolved.length})</h2>
          <EntryList entries={resolved} />
        </section>
      )}
    </div>
  );
}

function EntryList({ entries }: { entries: JournalEntry[] }) {
  const { content, progress } = useStore();
  const today = localDate();
  return (
    <ul className="task-list">
      {entries.map((j) => {
        const t = content.tasks[j.taskId];
        const topic = content.topics.find((x) => x.id === t.topicId);
        const grund = j.resolvedAt ? undefined : letzterFehlergrund(progress.attempts, j.taskId);
        return (
          <li key={j.taskId}>
            <Link to={`/aufgabe/${t.id}${j.resolvedAt ? '' : '?modus=wiederholung'}`} className="task-link">
              <span className="task-code">{t.code}</span>
              <span className="task-preview">
                {t.markdown
                  .replace(/[*`#>|]/g, '')
                  .split('\n')[0]
                  .slice(0, 120)}
              </span>
            </Link>
            <span className="muted small">
              {topic?.title}
              {grund && (
                <span className="badge fehlergrund-badge">
                  <Icon name={FEHLERGRUND_INFO[grund].icon} /> {FEHLERGRUND_INFO[grund].label}
                </span>
              )}
            </span>
            <span className="small">
              {formatPoints(j.lastPoints)}/{formatPoints(j.max)} P
            </span>
            <span className="small">
              {j.resolvedAt
                ? `✓ ${new Date(j.resolvedAt).toLocaleDateString('de-DE')}`
                : j.due <= today
                  ? 'fällig'
                  : `ab ${new Date(j.due).toLocaleDateString('de-DE')} · Stufe ${j.stage + 1}/3`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
