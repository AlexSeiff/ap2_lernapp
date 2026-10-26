// Einzelne SQL-Übung (/sql/uebung/:id): Ausprobieren, Prüfen (Ergebnisvergleich mit der Musterlösung),
// Hinweise einzeln aufdecken, Lösung zeigen. Ein unfertiger Entwurf wird im Fortschritt gespeichert; nach „Prüfen“ oder
// „Lösung zeigen“ nicht mehr – beim nächsten Öffnen (Wiederholung, „Heute lernen“) beginnt die Übung leer.

import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Markdown } from '../components/Markdown';
import { DiffTable, ExecOutput, LintWarnings, ResultTable, SqlError, withCode } from '../components/ResultTable';
import { BelegsatzPanel } from '../components/Belegsatz';
import { SchemaBrowser } from '../components/SchemaBrowser';
import { SqlEditor, type SqlEditorHandle } from '../components/SqlEditor';
import { SqlTabs } from '../components/SqlTabs';
import { useConfirm } from '../hooks/useConfirm';
import { useSqlSession } from '../hooks/useSqlSession';
import { meldeFertig } from '../lib/heuteSitzung';
import { recordSolutionShown, recordSqlCheck, recordSqlHint, saveSqlQuery, SQL_QUERY_MAX, sqlEntwurf, sqlStatus } from '../lib/sql';
import { useStore } from '../lib/store';
import { LEVEL_LABELS, stars, STATUS_LABELS } from '../lib/uebungLabels';
import { checkQuery, type CheckOutcome, verdictMessage } from '../sql/pruefeUebung';
import { hasBlockingWarning, lintSql } from '../sql/lint';
import type { ExecResult, LintWarning } from '../sql/types';
import { Icon } from '../components/Icon';

/** Verzögerung, bevor die Abfrage im Fortschritt gespeichert wird. */
const SAVE_DELAY_MS = 800;
export function SqlUebung() {
  const { id = '' } = useParams();
  // Neuer key je Übung: Editor, Hinweise und Ergebnis starten frisch.
  return <SqlUebungView key={id} id={id} />;
}

function SqlUebungView({ id }: { id: string }) {
  const { content, progress, update } = useStore();
  const confirm = useConfirm();
  const ex = content.sqlExercises.find((e) => e.id === id);
  const ds = ex && content.sqlDatasets.find((d) => d.id === ex.datensatz);
  const state = progress.sql[id];

  // Nur einen unfertigen Entwurf fortsetzen (samt seinen Hinweisen); eine geprüfte Antwort kommt nicht zurück.
  const [entwurf] = useState(() => sqlEntwurf(state));
  const [query, setQuery] = useState(entwurf);
  const [hintsShown, setHintsShown] = useState(() => (entwurf ? Math.min(state?.hintsUsed ?? 0, ex?.hinweise.length ?? 0) : 0));
  const [tryResult, setTryResult] = useState<ExecResult | null>(null);
  const [warnings, setWarnings] = useState<LintWarning[]>([]);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [busy, setBusy] = useState<'try' | 'check' | null>(null);
  const editor = useRef<SqlEditorHandle>(null);
  const session = useSqlSession(ds?.setup);

  // Entwurf verzögert im Fortschritt merken (und beim Verlassen der Seite sofort). Die gerade geprüfte Abfrage ist kein Entwurf
  // mehr; nach „Lösung zeigen“ wird gar nichts mehr gemerkt (sonst stünde beim nächsten Mal die abgeschriebene Lösung da).
  const pendingSave = useRef<string | null>(null);
  const geprueft = useRef<string | null>(null);
  const [ohneEntwurf, setOhneEntwurf] = useState(false);
  useEffect(() => {
    const saved = progress.sql[id]?.lastQuery ?? '';
    if (ohneEntwurf || query === geprueft.current || query.slice(0, SQL_QUERY_MAX) === saved) {
      pendingSave.current = null;
      return;
    }
    pendingSave.current = query;
    const timer = setTimeout(() => {
      pendingSave.current = null;
      update((p) => saveSqlQuery(p, id, query));
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query, id, progress.sql, update, ohneEntwurf]);
  useEffect(
    () => () => {
      const q = pendingSave.current;
      if (q !== null) update((p) => saveSqlQuery(p, id, q));
    },
    [id, update],
  );

  if (!ex || !ds) {
    return (
      <div className="page">
        <SqlTabs />
        <h1>Übung nicht gefunden</h1>
        <p>
          <Link to="/sql/uebungen">← Zur Übungsliste</Link>
        </p>
      </div>
    );
  }

  const status = sqlStatus(state);
  const idx = content.sqlExercises.indexOf(ex);
  const after = [...content.sqlExercises.slice(idx + 1), ...content.sqlExercises.slice(0, idx)];
  const next = after.find((e) => sqlStatus(progress.sql[e.id]) !== 'geloest') ?? after[0];

  const tryIt = async () => {
    if (!query.trim() || busy) return;
    setBusy('try');
    setOutcome(null);
    setWarnings(lintSql(query, { columns: session.errorSchema.columns }));
    try {
      setTryResult(await session.execFresh(query));
    } finally {
      setBusy(null);
    }
  };

  const check = async () => {
    if (busy || !query.trim()) return;
    setBusy('check');
    setTryResult(null);
    setShowDiff(false);
    const lint = lintSql(query, { columns: session.errorSchema.columns });
    setWarnings(lint);
    try {
      const r = await checkQuery(ex, ds, query);
      if (r.kind === 'data-error') {
        setOutcome(r);
        return;
      }
      geprueft.current = query;
      pendingSave.current = null;
      if (r.kind === 'error') {
        setOutcome(r);
        update((p) => recordSqlCheck(p, id, false));
        return;
      }
      const blocked = r.verdict.ok && hasBlockingWarning(lint);
      const ok = r.ok && !blocked;
      setOutcome({ ...r, ok, blocked });
      update((p) => recordSqlCheck(p, id, ok));
      if (ok) meldeFertig(id);
    } finally {
      setBusy(null);
    }
  };

  const showHint = () => {
    if (hintsShown >= ex.hinweise.length) return;
    setHintsShown(hintsShown + 1);
    // Nur neue Hinweise zählen – schon früher aufgedeckte stehen oben wieder da.
    if (hintsShown + 1 > (state?.hintsUsed ?? 0)) update((p) => recordSqlHint(p, id));
  };

  const showSolution = async () => {
    const ok = await confirm({
      title: 'Lösung zeigen?',
      message: 'Die Übung zählt dann als „mit Lösung“ statt „gelöst“ und kommt morgen zur Wiederholung.',
      confirmLabel: 'Lösung zeigen',
    });
    if (!ok) return;
    pendingSave.current = null;
    setOhneEntwurf(true);
    update((p) => recordSolutionShown(p, id));
    setSolutionOpen(true);
  };

  const verdictBox = () => {
    if (!outcome) return null;
    if (outcome.kind === 'data-error') {
      return (
        <div className="card warn">
          <Icon name="triangle-alert" /> Die Musterlösung lief nicht – das ist ein Fehler in den Übungsdaten, nicht bei dir.
          <div className="mono small error-text">{outcome.error}</div>
        </div>
      );
    }
    if (outcome.kind === 'error') {
      return (
        <>
          <p className="verdict bad">
            <Icon name="circle-x" /> Noch nicht: Deine Abfrage bricht mit einem Fehler ab.
          </p>
          <SqlError error={outcome.error} schema={session.errorSchema} />
        </>
      );
    }
    const { verdict } = outcome;
    const message = verdictMessage(outcome);
    const hasDiff = !outcome.ok && (verdict.missing.length > 0 || verdict.extra.length > 0);
    return (
      <div className={`card ${outcome.ok ? 'success' : 'verdict-fail'}`}>
        <div className="verdict-row">
          <p className={`verdict ${outcome.ok ? 'ok' : 'bad'}`}>
            <Icon name={outcome.ok ? 'circle-check' : 'circle-x'} /> {withCode(message)}
          </p>
          {outcome.ok && next && (
            <Link className="button" to={`/sql/uebung/${next.id}`}>
              Weiter →
            </Link>
          )}
          {hasDiff && (
            <button type="button" className="secondary" aria-expanded={showDiff} onClick={() => setShowDiff((x) => !x)}>
              Unterschiede {showDiff ? '▴' : '▾'}
            </button>
          )}
        </div>
        {hasDiff && showDiff && <DiffTable columns={outcome.expectedColumns} missing={verdict.missing} extra={verdict.extra} />}
        {outcome.userSet && (
          <details className="own-result" open={!outcome.ok && !hasDiff}>
            <summary>Dein Ergebnis</summary>
            <ResultTable columns={outcome.userSet.columns} rows={outcome.userSet.rows} ms={outcome.ms} />
          </details>
        )}
      </div>
    );
  };

  return (
    <div className="page sql-page paper-sheet">
      <SqlTabs />
      <p className="crumbs">
        <Link to="/sql/uebungen">Übungen</Link> / {ex.thema}
      </p>
      <h1>{ex.titel}</h1>
      <div className="task-card">
        <div className="task-head">
          <span className="task-code sql-code">{ex.id}</span>
          <span className="badge" title={LEVEL_LABELS[ex.schwierigkeit]}>
            {stars(ex.schwierigkeit)} {LEVEL_LABELS[ex.schwierigkeit]}
          </span>
          <span className="badge muted">{ex.thema}</span>
          {status !== 'offen' && <span className="badge">{STATUS_LABELS[status]}</span>}
          {ex.quelleAufgabe && <span className="muted small">{ex.quelleAufgabe}</span>}
        </div>
        <Markdown source={false}>{ex.aufgabe}</Markdown>
        {ex.aufgaben?.some((t) => content.tasks[t]) && (
          <p className="hint">
            Auch als Klausuraufgabe:{' '}
            {ex.aufgaben
              .filter((t) => content.tasks[t])
              .map((t, i) => (
                <Fragment key={t}>
                  {i > 0 && ' · '}
                  <Link to={`/aufgabe/${t}`}>
                    {content.topics.find((x) => x.id === content.tasks[t].topicId)?.title ?? ''} {content.tasks[t].code}
                  </Link>
                </Fragment>
              ))}
          </p>
        )}
        <p className="hint">
          Datensatz: {ds.titel}
          {state && state.attempts > 0 && ` · ${state.attempts} ${state.attempts === 1 ? 'Versuch' : 'Versuche'}`}
        </p>
      </div>

      {session.error && (
        <p className="card warn">
          <Icon name="triangle-alert" /> {session.error}
        </p>
      )}

      <div className="sql-toolbar">
        <BelegsatzPanel />
      </div>
      <SchemaBrowser
        tables={session.schema}
        defaultOpen={false}
        onInsert={(text) => editor.current?.insert(text)}
        onShowTable={(t) => {
          setOutcome(null);
          setWarnings([]);
          void session.execFresh(`SELECT * FROM ${t};`).then(setTryResult);
        }}
      />

      <SqlEditor
        ref={editor}
        value={query}
        onChange={setQuery}
        onRun={() => void tryIt()}
        onCheck={() => void check()}
        schema={session.schema}
      />
      <div className="actions">
        <button type="button" className="secondary" onClick={() => void tryIt()} disabled={!!busy || !session.ready || !query.trim()}>
          <Icon name="play" /> Ausprobieren
        </button>
        <button type="button" onClick={() => void check()} disabled={!!busy || !query.trim()}>
          ✓ Prüfen
        </button>
        {ex.hinweise.length > 0 && (
          <button type="button" className="secondary" onClick={showHint} disabled={hintsShown >= ex.hinweise.length}>
            <Icon name="lightbulb" /> Hinweis {Math.min(hintsShown + 1, ex.hinweise.length)}/{ex.hinweise.length}
          </button>
        )}
        <button type="button" className="secondary" onClick={() => void showSolution()} disabled={solutionOpen}>
          <Icon name="eye" /> Lösung zeigen
        </button>
        {busy && <span className="muted small">{busy === 'check' ? 'prüft …' : 'läuft …'}</span>}
      </div>
      <p className="hint">
        <kbd>Strg</kbd> + <kbd>Enter</kbd> = Ausprobieren · <kbd>Strg</kbd> + <kbd>Umschalt</kbd> + <kbd>Enter</kbd> = Prüfen. Nur „Prüfen“
        zählt.
      </p>

      {hintsShown > 0 && (
        <div className="card info">
          <b>
            <Icon name="lightbulb" /> Hinweise
          </b>
          <ol className="hints">
            {ex.hinweise.slice(0, hintsShown).map((h, i) => (
              <li key={i}>{withCode(h)}</li>
            ))}
          </ol>
        </div>
      )}

      <LintWarnings warnings={warnings} exercise />
      {verdictBox()}
      {tryResult && <ExecOutput result={tryResult} schema={session.errorSchema} />}

      {solutionOpen && (
        <section className="card">
          <h2>Musterlösung</h2>
          <div className="solution-compare">
            <div>
              <h3>Musterlösung</h3>
              <pre>
                <code>{ex.loesung}</code>
              </pre>
            </div>
            <div>
              <h3>Deine Abfrage</h3>
              {query.trim() ? (
                <pre>
                  <code>{query}</code>
                </pre>
              ) : (
                <p className="muted">Noch leer.</p>
              )}
            </div>
          </div>
          {ex.erklaerung && (
            <div className="solution">
              <h4>Erklärung</h4>
              <Markdown source={false}>{ex.erklaerung}</Markdown>
            </div>
          )}
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setOutcome(null);
                setWarnings([]);
                void session.execFresh(ex.loesung).then(setTryResult);
              }}
            >
              <Icon name="play" /> Musterlösung ausführen
            </button>
            {next && (
              <Link className="button" to={`/sql/uebung/${next.id}`}>
                Weiter →
              </Link>
            )}
          </div>
          <p className="hint">Andere Schreibweisen sind genauso richtig, solange das Ergebnis stimmt – probier es mit „✓ Prüfen“ aus.</p>
        </section>
      )}
    </div>
  );
}
