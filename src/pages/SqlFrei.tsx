// Freier Modus des SQL-Editors (/sql): beliebiges SQL gegen eine Übungsdatenbank im Browser (sql.js).
// Entwurf je Datensatz und Verlauf liegen im localStorage (nur Komfort – ohne Speicher geht es auch).

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ExecOutput, LintWarnings } from '../components/ResultTable';
import { BelegsatzPanel } from '../components/Belegsatz';
import { SchemaBrowser } from '../components/SchemaBrowser';
import { SqlEditor, type SqlEditorHandle } from '../components/SqlEditor';
import { useConfirm } from '../hooks/useConfirm';
import { useSqlSession } from '../hooks/useSqlSession';
import { decodeQuery } from '../lib/sqlLinks';
import { useStore } from '../lib/store';
import { lintSql } from '../sql/lint';
import type { ExecResult, LintWarning } from '../sql/types';
import { Icon } from '../components/Icon';

const HISTORY_KEY = 'sql-verlauf';
const HISTORY_MAX = 30;
const DATASET_KEY = 'sql-datensatz';
const draftKey = (ds: string) => `sql-entwurf:${ds}`;
const EXAMPLES_MAX = 12;

type HistoryEntry = { sql: string; ds: string; at: number };

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ohne Speicher einfach nicht merken */
  }
}

function readHistory(): HistoryEntry[] {
  try {
    const parsed: unknown = JSON.parse(readStorage(HISTORY_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e): e is HistoryEntry => typeof e?.sql === 'string' && typeof e?.ds === 'string' && typeof e?.at === 'number')
      .slice(0, HISTORY_MAX);
  } catch {
    return [];
  }
}

/** „vor 2 min“, „vor 3 h“, „gestern“ … */
export function relativeTime(at: number, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 60) return 'gerade eben';
  const min = Math.round(s / 60);
  if (min < 60) return `vor ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `vor ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'gestern' : `vor ${d} Tagen`;
}

const firstLine = (sql: string) => {
  const line = sql.trim().split('\n')[0];
  return line.length > 90 ? `${line.slice(0, 90)} …` : line;
};

export function SqlFrei() {
  const { content } = useStore();
  const confirm = useConfirm();
  const datasets = content.sqlDatasets;
  const [params, setParams] = useSearchParams();

  const wanted = params.get('ds') ?? readStorage(DATASET_KEY);
  const dataset = datasets.find((d) => d.id === wanted) ?? datasets[0];
  const ds = dataset?.id ?? '';

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [handledQ, setHandledQ] = useState<string | null>(null);
  const [result, setResult] = useState<ExecResult | null>(null);
  const [warnings, setWarnings] = useState<LintWarning[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(readHistory);
  const [now, setNow] = useState(() => Date.now());
  const editor = useRef<SqlEditorHandle>(null);

  const session = useSqlSession(dataset?.setup);

  // ?q=<base64> aus „🧮 Im SQL-Editor öffnen“: als Entwurf übernehmen und aus der URL nehmen (Reload behält den Entwurf).
  const q = params.get('q');
  if (q && q !== handledQ) {
    setHandledQ(q);
    const decoded = decodeQuery(q);
    if (decoded !== undefined) setDrafts((d) => ({ ...d, [ds]: decoded }));
    setResult(null);
    setWarnings([]);
  }
  useEffect(() => {
    if (!q) return;
    const decoded = decodeQuery(q);
    if (decoded !== undefined) writeStorage(draftKey(ds), decoded);
    const next = new URLSearchParams(params);
    next.delete('q');
    if (ds) next.set('ds', ds);
    setParams(next, { replace: true });
  }, [q, ds, params, setParams]);

  const query = drafts[ds] ?? readStorage(draftKey(ds)) ?? '';

  const setQuery = useCallback(
    (value: string) => {
      setDrafts((d) => ({ ...d, [ds]: value }));
      writeStorage(draftKey(ds), value);
    },
    [ds],
  );

  const addHistory = (sql: string) => {
    setHistory((prev) => {
      const next = [{ sql, ds, at: Date.now() }, ...prev.filter((e) => !(e.sql === sql && e.ds === ds))].slice(0, HISTORY_MAX);
      writeStorage(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
    setNow(Date.now());
  };

  const execute = async (sql: string, remember: boolean) => {
    if (!sql.trim() || busy) return;
    setBusy(true);
    setNotice(null);
    setWarnings(lintSql(sql, { columns: session.errorSchema.columns }));
    try {
      setResult(await session.exec(sql));
      if (remember) addHistory(sql.trim());
    } finally {
      setBusy(false);
    }
  };

  const run = () => void execute(query, true);

  const switchDataset = (id: string) => {
    writeStorage(DATASET_KEY, id);
    setParams({ ds: id }, { replace: true });
    setResult(null);
    setWarnings([]);
    setNotice(null);
  };

  const reset = async () => {
    await session.reset();
    setResult(null);
    setWarnings([]);
    setNotice('Datenbank ist wieder im Ausgangszustand.');
  };

  const examples = content.sqlExercises.filter((e) => e.datensatz === ds).slice(0, EXAMPLES_MAX);

  const loadExample = async (id: string) => {
    const ex = examples.find((e) => e.id === id);
    if (!ex) return;
    if (query.trim() && query.trim() !== ex.loesung.trim()) {
      const ok = await confirm({ message: 'Dein Entwurf im Editor wird durch das Beispiel ersetzt.', confirmLabel: 'Ersetzen' });
      if (!ok) return;
    }
    setQuery(ex.loesung);
    editor.current?.focus();
  };

  const loadHistory = (e: HistoryEntry) => {
    if (e.ds !== ds) switchDataset(e.ds);
    setDrafts((d) => ({ ...d, [e.ds]: e.sql }));
    writeStorage(draftKey(e.ds), e.sql);
    editor.current?.focus();
  };

  const clearHistory = () => {
    setHistory([]);
    writeStorage(HISTORY_KEY, '[]');
  };

  if (!dataset) {
    return (
      <div className="page">
        <h1>
          <Icon name="database" /> SQL-Editor
        </h1>
        <p className="card warn">Keine Übungsdatenbank gefunden. Liegt AP2_SQL_Uebungen.json im Inhaltsordner?</p>
      </div>
    );
  }

  return (
    <div className="page sql-page">
      <h1>
        <Icon name="database" /> SQL-Editor
      </h1>
      <p className="lead">Schreib SQL gegen die Übungsdatenbank und sieh sofort das Ergebnis. Alles läuft in deinem Browser.</p>

      <div className="sql-toolbar">
        <label>
          Datensatz
          <select value={ds} onChange={(e) => switchDataset(e.target.value)}>
            {datasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.titel}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="secondary" onClick={() => void reset()} title="Alle Änderungen an der Datenbank verwerfen">
          <Icon name="rotate-ccw" /> Zurücksetzen
        </button>
        <BelegsatzPanel />
        {!!examples.length && (
          <label>
            Beispiele
            <select value="" onChange={(e) => void loadExample(e.target.value)}>
              <option value="">
                <Icon name="file-text" /> Beispiel laden …
              </option>
              {examples.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.titel}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {dataset.beschreibung && (
        <p className="hint">
          {dataset.quelle} · {dataset.beschreibung}
        </p>
      )}
      {session.error && (
        <p className="card warn">
          <Icon name="triangle-alert" /> {session.error}
        </p>
      )}

      <div className="sql-layout">
        <aside>
          <SchemaBrowser
            tables={session.schema}
            onInsert={(text) => editor.current?.insert(text)}
            onShowTable={(t) => void execute(`SELECT * FROM ${t};`, false)}
          />
        </aside>
        <div className="sql-main">
          <SqlEditor ref={editor} value={query} onChange={setQuery} onRun={run} schema={session.schema} />
          <div className="actions">
            <button type="button" onClick={run} disabled={busy || !session.ready || !query.trim()}>
              <Icon name="play" /> Ausführen
            </button>
            <span className="hint">
              <kbd>Strg</kbd> + <kbd>Enter</kbd> · mehrere Anweisungen mit <code>;</code> trennen
            </span>
            {(busy || !session.ready) && !session.error && <span className="muted small">{busy ? 'läuft …' : 'Lade Datenbank …'}</span>}
          </div>
          {notice && <p className="card info">{notice}</p>}
          <LintWarnings warnings={warnings} />
          {result && <ExecOutput result={result} schema={session.errorSchema} />}
        </div>
      </div>

      <details className="card sql-history" onToggle={() => setNow(Date.now())}>
        <summary>
          <Icon name="rotate-ccw-clock" /> Verlauf ({history.length})
        </summary>
        {!history.length ? (
          <p className="muted small">Noch nichts ausgeführt. Die letzten {HISTORY_MAX} Abfragen erscheinen hier (nur auf diesem Gerät).</p>
        ) : (
          <>
            <ul className="plain">
              {history.map((e) => (
                <li key={`${e.at}-${e.ds}`}>
                  <button type="button" className="ghost history-item" title={e.sql} onClick={() => loadHistory(e)}>
                    <span className="mono">⟲ {firstLine(e.sql)}</span>
                    <span className="muted small">
                      {relativeTime(e.at, now)}
                      {e.ds !== ds && ` · ${datasets.find((d) => d.id === e.ds)?.titel ?? e.ds}`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="ghost small danger" onClick={clearHistory}>
              Verlauf leeren
            </button>
          </>
        )}
      </details>

      <details className="card">
        <summary>ℹ️ Dialekt-Hinweise (SQLite vs. Prüfung)</summary>
        <ul>
          <li>
            Nicht aggregierte Spalten gehören ins <code>GROUP BY</code> – SQLite erlaubt es trotzdem, die Prüfung nicht.
          </li>
          <li>Spalten-Aliase aus dem SELECT darfst du im WHERE nicht verwenden.</li>
          <li>
            Texte in einfache Anführungszeichen: <code>'München'</code>. Doppelte Anführungszeichen sind für Namen.
          </li>
          <li>
            <code>5 / 2</code> ergibt in SQLite <code>2</code> (Ganzzahldivision). Für Dezimalwerte <code>5.0 / 2</code>.
          </li>
          <li>
            <code>LIKE</code> unterscheidet in SQLite nicht zwischen Groß- und Kleinschreibung (ASCII).
          </li>
          <li>
            <code>DECIMAL(8,2)</code> und <code>DATE</code> prüft SQLite nicht streng: 249.00 erscheint als <code>249</code>, Datumswerte
            sind Text.
          </li>
          <li>
            Datumsfunktionen wie <code>YEAR()</code> gibt es nicht – nimm <code>strftime('%Y', datum)</code>.
          </li>
        </ul>
      </details>
    </div>
  );
}
