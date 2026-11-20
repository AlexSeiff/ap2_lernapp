// Liste der Rechenübungen (/rechnen). Filter stehen in der URL (?thema=…&stufe=…&tag=…&status=…) wie bei den SQL-Übungen.
// ?vorlage=a,b (Link aus der Formelsammlung) zeigt nur Übungen dieser Rechenvorlagen.

import { Link, useSearchParams } from 'react-router-dom';
import type { RechenUebung } from '../../domain/types';
import { rechenStatus, rechenSummary } from '../lib/rechnen';
import { useStore } from '../lib/store';
import { findeVorlage } from '../rechnen/vorlagen/index';
import { LEVEL_LABELS, stars, STATUS_CLASS, STATUS_LABELS } from '../lib/uebungLabels';
import { Icon } from '../components/Icon';

type Filter = { thema: string; stufe: string; tag: string; status: string; vorlage: string };
const KEYS: (keyof Filter)[] = ['thema', 'stufe', 'tag', 'status', 'vorlage'];

function readFilter(params: URLSearchParams): Filter {
  const f = {} as Filter;
  for (const k of KEYS) f[k] = params.get(k) ?? 'alle';
  return f;
}

export function RechenUebungen() {
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

  const all = content.rechenUebungen;
  const summary = rechenSummary(
    progress,
    all.map((u) => u.id),
  );
  const themen = [...new Set(all.map((u) => u.thema))].sort((a, b) => a.localeCompare(b, 'de', { numeric: true }));
  const tags = [...new Set(all.flatMap((u) => u.tags))].sort((a, b) => a.localeCompare(b, 'de'));
  const status = (u: RechenUebung) => rechenStatus(progress.rechnen[u.id]);
  const vorlagen = f.vorlage === 'alle' ? [] : f.vorlage.split(',').filter(Boolean);

  const list = all.filter(
    (u) =>
      (f.thema === 'alle' || u.thema === f.thema) &&
      (f.stufe === 'alle' || String(u.schwierigkeit) === f.stufe) &&
      (f.tag === 'alle' || u.tags.includes(f.tag)) &&
      (f.status === 'alle' || status(u) === f.status) &&
      (!vorlagen.length || vorlagen.includes(u.vorlage ?? '')),
  );
  const pct = summary.total ? (summary.solved / summary.total) * 100 : 0;
  const nextOpen = list.find((u) => status(u) === 'faellig') ?? list.find((u) => status(u) === 'offen');

  return (
    <div className="page">
      <h1>
        <Icon name="calculator" /> Rechenübungen
      </h1>
      <p className="lead">
        Rechne wie in der Prüfung – auf Papier – und trag nur die Ergebnisse ein. Bei Übungen mit <Icon name="dices" /> bekommst du beliebig
        oft neue Zahlen.
      </p>

      {!all.length ? (
        <p className="card warn">Keine Rechenübungen gefunden. Prüfe die Datei AP2_Rechen_Uebungen.json unter „Daten &amp; Import“.</p>
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

          {vorlagen.length > 0 && (
            <p className="hint">
              <Icon name="sigma" /> Nur Übungen zu: {vorlagen.map((id) => findeVorlage(id)?.titel ?? id).join(' · ')}{' '}
              <button type="button" className="ghost small" onClick={() => set({ vorlage: 'alle' })}>
                ✕ alle Vorlagen
              </button>
            </p>
          )}

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
              <Link className="button" to={`/rechnen/${nextOpen.id}`}>
                <Icon name="play" /> {status(nextOpen) === 'faellig' ? 'Wiederholen' : 'Nächste offene'}
              </Link>
            )}
          </div>

          {!list.length ? (
            <p className="muted">Keine Übung passt zu den Filtern.</p>
          ) : (
            <ul className="task-list">
              {list.map((u) => {
                const s = status(u);
                return (
                  <li key={u.id}>
                    <Link className="task-link" to={`/rechnen/${u.id}`}>
                      <span className="task-code sql-code">{u.id}</span>
                      <span className="task-preview">
                        {u.titel}{' '}
                        <span className="muted small">
                          · {stars(u.schwierigkeit)} · {u.thema}
                          {u.neueZahlen && (
                            <>
                              {' · '}
                              <Icon name="dices" label="neue Zahlen möglich" />
                            </>
                          )}
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
