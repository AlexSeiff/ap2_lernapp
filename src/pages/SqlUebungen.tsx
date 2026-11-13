// Liste der SQL-Übungen (/sql/uebungen). Filter stehen in der URL (?thema=…&stufe=…&tag=…&status=…) wie bei den Karteikarten.

import { Link, useSearchParams } from 'react-router-dom';
import type { SqlExercise } from '../../shared/types';
import { sqlStatus, sqlSummary } from '../lib/sql';
import { useStore } from '../lib/store';
import { LEVEL_LABELS, stars, STATUS_CLASS, STATUS_LABELS } from '../lib/uebungLabels';
import { Icon } from '../components/Icon';

type Filter = { thema: string; stufe: string; tag: string; status: string };
const KEYS: (keyof Filter)[] = ['thema', 'stufe', 'tag', 'status'];

function readFilter(params: URLSearchParams): Filter {
  const f = {} as Filter;
  for (const k of KEYS) f[k] = params.get(k) ?? 'alle';
  return f;
}

export function SqlUebungen() {
  const { content, progress } = useStore();
  const [params, setParams] = useSearchParams();
  const f = readFilter(params);
  const set = (changes: Partial<Filter>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (!v || v === 'alle') next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: true });
  };

  const all = content.sqlExercises;
  const summary = sqlSummary(
    progress,
    all.map((e) => e.id),
  );
  const themen = [...new Set(all.map((e) => e.thema))];
  const tags = [...new Set(all.flatMap((e) => e.tags))].sort((a, b) => a.localeCompare(b, 'de'));
  const datasetTitle = (id: string) => content.sqlDatasets.find((d) => d.id === id)?.titel ?? id;

  const list = all.filter(
    (e: SqlExercise) =>
      (f.thema === 'alle' || e.thema === f.thema) &&
      (f.stufe === 'alle' || String(e.schwierigkeit) === f.stufe) &&
      (f.tag === 'alle' || e.tags.includes(f.tag)) &&
      (f.status === 'alle' || sqlStatus(progress.sql[e.id]) === f.status),
  );
  const pct = summary.total ? (summary.solved / summary.total) * 100 : 0;
  const nextOpen =
    list.find((e) => sqlStatus(progress.sql[e.id]) === 'faellig') ?? list.find((e) => sqlStatus(progress.sql[e.id]) === 'offen');

  return (
    <div className="page">
      <h1>
        <Icon name="target" /> SQL-Übungen
      </h1>
      <p className="lead">Schreib die Abfrage – die App vergleicht dein Ergebnis mit dem der Musterlösung.</p>

      <div className="sql-progress">
        <span className="bar wide" title={`${Math.round(pct)} %`}>
          <span className="bar-fill good" style={{ width: `${pct}%` }} />
        </span>
        <b>
          {summary.solved} / {summary.total} gelöst
        </b>
        {summary.due > 0 && (
          <button type="button" className="ghost small" onClick={() => set({ status: 'faellig' })}>
            <Icon name="rotate-cw" /> {summary.due} {summary.due === 1 ? 'Wiederholung' : 'Wiederholungen'} fällig
          </button>
        )}
      </div>

      <div className="filters">
        <label>
          Thema
          <select value={f.thema} onChange={(e) => set({ thema: e.target.value })}>
            <option value="alle">Alle Themen</option>
            {themen.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label>
          Schwierigkeit
          <select value={f.stufe} onChange={(e) => set({ stufe: e.target.value })}>
            <option value="alle">Alle</option>
            {Object.entries(LEVEL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {stars(Number(k))} {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tag
          <select value={f.tag} onChange={(e) => set({ tag: e.target.value })}>
            <option value="alle">Alle Tags</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={f.status} onChange={(e) => set({ status: e.target.value })}>
            <option value="alle">Alle</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="selection-bar">
        <span>
          {list.length} {list.length === 1 ? 'Übung' : 'Übungen'}
        </span>
        {KEYS.some((k) => f[k] !== 'alle') && (
          <button type="button" className="ghost" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
            Filter zurücksetzen
          </button>
        )}
        {nextOpen && (
          <Link className="button" to={`/sql/uebung/${nextOpen.id}`}>
            <Icon name="play" /> {sqlStatus(progress.sql[nextOpen.id]) === 'faellig' ? 'Wiederholen' : 'Nächste offene'}
          </Link>
        )}
      </div>

      {!list.length ? (
        <p className="muted">Keine Übung passt zu den Filtern.</p>
      ) : (
        <ul className="task-list">
          {list.map((e) => {
            const status = sqlStatus(progress.sql[e.id]);
            return (
              <li key={e.id}>
                <Link className="task-link" to={`/sql/uebung/${e.id}`}>
                  <span className="task-code sql-code">{e.id}</span>
                  <span className="task-preview">
                    {e.titel}{' '}
                    <span className="muted small">
                      · {stars(e.schwierigkeit)} · {datasetTitle(e.datensatz)}
                    </span>
                  </span>
                </Link>
                <span className={`status sql-status ${STATUS_CLASS[status]}`}>{STATUS_LABELS[status]}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
