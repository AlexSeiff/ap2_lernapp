// Liste der Diagramm-Übungen (/diagramme, Umsetzungsplan Phase 7). Filter in der URL (?typ=epk&stufe=1&status=…), wie bei den
// Rechenübungen; Links aus Lernblättern und Begriffsseiten nutzen ?typ=.

import { Link, useSearchParams } from 'react-router-dom';
import { DIAGRAMM_TYP_NAMEN, DIAGRAMM_TYPEN, type DiagrammUebung } from '../../domain/diagrammUebungen';
import { Icon } from '../components/Icon';
import { diagrammStatus, diagrammSummary, diagrammUebungen } from '../lib/diagramme';
import { useStore } from '../lib/store';
import { STATUS_CLASS, STATUS_LABELS } from '../lib/uebungLabels';
import { STUFEN } from './DiagrammUebung';

type Filter = { typ: string; stufe: string; status: string };
const KEYS: (keyof Filter)[] = ['typ', 'stufe', 'status'];

export function DiagrammUebungen() {
  const { content, progress } = useStore();
  const [params, setParams] = useSearchParams();
  const f = Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? 'alle'])) as Filter;
  const set = (changes: Partial<Filter>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (!v || v === 'alle') next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: true });
  };

  const alle = diagrammUebungen(content);
  const summary = diagrammSummary(
    progress,
    alle.map((u) => u.id),
  );
  const status = (u: DiagrammUebung) => diagrammStatus(progress.diagramme[u.id]);
  const liste = alle.filter(
    (u) =>
      (f.typ === 'alle' || u.typ === f.typ) &&
      (f.stufe === 'alle' || String(u.stufe) === f.stufe) &&
      (f.status === 'alle' || status(u) === f.status),
  );
  const pct = summary.total ? (summary.solved / summary.total) * 100 : 0;
  const naechste = liste.find((u) => status(u) === 'faellig') ?? liste.find((u) => status(u) === 'offen');
  const typen = DIAGRAMM_TYPEN.filter((t) => alle.some((u) => u.typ === t));

  return (
    <div className="page">
      <h1>
        <Icon name="workflow" /> Diagramm-Übungen
      </h1>
      <p className="lead">
        EPK, BPMN und UML wie in der Prüfung: Elemente in ein vorgegebenes Diagramm einsetzen oder Abläufe ordnen – ziehen oder antippen.
      </p>

      {!alle.length ? (
        <p className="card warn">Keine Diagramm-Übungen gefunden. Prüfe die Datei AP2_Diagramm_Uebungen.json unter „Daten &amp; Import“.</p>
      ) : (
        <>
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
              Diagramm
              <select value={f.typ} onChange={(e) => set({ typ: e.target.value })}>
                <option value="alle">Alle Diagramme</option>
                {typen.map((t) => (
                  <option key={t} value={t}>
                    {DIAGRAMM_TYP_NAMEN[t]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Stufe
              <select value={f.stufe} onChange={(e) => set({ stufe: e.target.value })}>
                <option value="alle">Alle</option>
                <option value="1">1 – {STUFEN[1]}</option>
                <option value="2">2 – {STUFEN[2]}</option>
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
              {liste.length} {liste.length === 1 ? 'Übung' : 'Übungen'}
            </span>
            {KEYS.some((k) => f[k] !== 'alle') && (
              <button type="button" className="ghost" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Filter zurücksetzen
              </button>
            )}
            {naechste && (
              <Link className="button" to={`/diagramme/${naechste.id}`}>
                <Icon name="play" /> {status(naechste) === 'faellig' ? 'Wiederholen' : 'Nächste offene'}
              </Link>
            )}
          </div>

          {!liste.length ? (
            <p className="muted">Keine Übung passt zu den Filtern.</p>
          ) : (
            <ul className="task-list">
              {liste.map((u) => {
                const s = status(u);
                return (
                  <li key={u.id}>
                    <Link className="task-link" to={`/diagramme/${u.id}`}>
                      <span className="task-code sql-code">{u.id}</span>
                      <span className="task-preview">
                        {u.titel}{' '}
                        <span className="muted small">
                          · {DIAGRAMM_TYP_NAMEN[u.typ]} · {STUFEN[u.stufe]}
                        </span>
                      </span>
                    </Link>
                    <span className={`status sql-status ${STATUS_CLASS[s]}`}>{STATUS_LABELS[s]}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
