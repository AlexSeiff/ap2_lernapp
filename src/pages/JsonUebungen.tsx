// Liste der JSON-Übungen (/json): JSON selbst als Text schreiben. Filter in der URL (?stufe=1&status=…), wie bei den Diagramm- und
// Rechenübungen. Die Liste selbst (`DatenformatListe`) teilen sich JSON- und XML-Übungen (/xml); der Fortschritt beider steht in
// Progress.json, die IDs (JSON-…, XML-…) trennen sie.

import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon, type IconName } from '../components/Icon';
import { jsonStatus, jsonSummary, jsonUebungen } from '../lib/jsonUebungen';
import { useStore } from '../lib/store';
import { LEVEL_LABELS, STATUS_CLASS, STATUS_LABELS, stars } from '../lib/uebungLabels';

type Filter = { stufe: string; status: string };
const KEYS: (keyof Filter)[] = ['stufe', 'status'];

export function JsonUebungen() {
  const { content } = useStore();
  return (
    <DatenformatListe
      titel="JSON-Übungen"
      icon="pencil"
      pfad="/json"
      alle={jsonUebungen(content)}
      leer="Keine JSON-Übungen gefunden. Prüfe die Datei AP2_Json_Uebungen.json unter „Daten & Import“."
    >
      JSON selbst schreiben, wie in der Prüfung: Objekte, Listen, Zahlen, Texte, true/false/null. Die App zeigt Syntaxfehler mit Zeile und
      Hinweis und prüft die Struktur – Reihenfolge und Einrückung sind frei.
    </DatenformatListe>
  );
}

interface ListenUebung {
  id: string;
  titel: string;
  stufe: 1 | 2 | 3;
}

export function DatenformatListe({
  titel,
  icon,
  pfad,
  alle,
  leer,
  children,
}: {
  titel: string;
  icon: IconName;
  pfad: string;
  alle: ListenUebung[];
  leer: string;
  children: ReactNode;
}) {
  const { progress } = useStore();
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

  const summary = jsonSummary(
    progress,
    alle.map((u) => u.id),
  );
  const status = (u: ListenUebung) => jsonStatus(progress.json[u.id]);
  const liste = alle.filter((u) => (f.stufe === 'alle' || String(u.stufe) === f.stufe) && (f.status === 'alle' || status(u) === f.status));
  const pct = summary.total ? (summary.solved / summary.total) * 100 : 0;
  const naechste = liste.find((u) => status(u) === 'faellig') ?? liste.find((u) => status(u) === 'offen');

  return (
    <div className="page">
      <h1>
        <Icon name={icon} /> {titel}
      </h1>
      <p className="lead">{children}</p>

      {!alle.length ? (
        <p className="card warn">{leer}</p>
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
              Stufe
              <select value={f.stufe} onChange={(e) => set({ stufe: e.target.value })}>
                <option value="alle">Alle</option>
                {[1, 2, 3].map((s) => (
                  <option key={s} value={s}>
                    {s} – {LEVEL_LABELS[s]}
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
              {liste.length} {liste.length === 1 ? 'Übung' : 'Übungen'}
            </span>
            {KEYS.some((k) => f[k] !== 'alle') && (
              <button type="button" className="ghost" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Filter zurücksetzen
              </button>
            )}
            {naechste && (
              <Link className="button" to={`${pfad}/${naechste.id}`}>
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
                    <Link className="task-link" to={`${pfad}/${u.id}`}>
                      <span className="task-code sql-code">{u.id}</span>
                      <span className="task-preview">
                        {u.titel}{' '}
                        <span className="muted small" title={LEVEL_LABELS[u.stufe]}>
                          · {stars(u.stufe)}
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
