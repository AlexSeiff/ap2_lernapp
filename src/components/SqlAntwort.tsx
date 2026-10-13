// Antwort im SQL-Editor für Aufgaben mit verknüpfter SQL-Übung (Task.sqlUebung) – Einzelaufgabe und Übungsklausur.
// Mit `ausfuehren` lässt sich die Abfrage auf dem Datensatz ausprobieren (Einzelaufgabe); in der Klausur nicht, wie auf Papier.
// Geprüft wird erst nach der Abgabe (SqlPruefung). Lazy geladen, damit CodeMirror und sql.js nur bei SQL-Aufgaben kommen.

import { useRef, useState } from 'react';
import type { SqlDataset, SqlExercise } from '../../shared/types';
import { useSqlSession } from '../hooks/useSqlSession';
import { lintSql } from '../sql/lint';
import type { ExecResult, LintWarning } from '../sql/types';
import { Icon } from './Icon';
import { ExecOutput, LintWarnings } from './ResultTable';
import { SchemaBrowser } from './SchemaBrowser';
import { SqlEditor, type SqlEditorHandle } from './SqlEditor';

interface Props {
  ex: SqlExercise;
  ds: SqlDataset;
  value: string | undefined;
  onChange: (v: string) => void;
  disabled?: boolean;
  /** Abfrage auf dem Datensatz ausführen dürfen („Ausprobieren“). */
  ausfuehren: boolean;
}

export default function SqlAntwort({ ex, ds, value, onChange, disabled, ausfuehren }: Props) {
  const query = value ?? '';
  const editor = useRef<SqlEditorHandle>(null);
  // Ohne Ausführen keine Sitzungsdatenbank: In der Klausur stehen mehrere SQL-Aufgaben auf einer Seite.
  const session = useSqlSession(ausfuehren && !disabled ? ds.setup : undefined);
  const [result, setResult] = useState<ExecResult | null>(null);
  const [warnings, setWarnings] = useState<LintWarning[]>([]);
  const [busy, setBusy] = useState(false);

  if (disabled) {
    return (
      <div className="sql-antwort">
        <p className="muted small">
          <Icon name="database" /> Deine Abfrage
        </p>
        {query.trim() ? (
          <pre className="sql-antwort-code">
            <code>{query}</code>
          </pre>
        ) : (
          <p className="muted">Keine Abfrage abgegeben.</p>
        )}
      </div>
    );
  }

  const tryIt = async () => {
    if (!ausfuehren || !query.trim() || busy) return;
    setBusy(true);
    setWarnings(lintSql(query, { columns: session.errorSchema.columns }));
    try {
      setResult(await session.execFresh(query));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sql-antwort">
      {ausfuehren && (
        <SchemaBrowser
          tables={session.schema}
          defaultOpen={false}
          onInsert={(text) => editor.current?.insert(text)}
          onShowTable={(t) => {
            setWarnings([]);
            void session.execFresh(`SELECT * FROM ${t};`).then(setResult);
          }}
        />
      )}
      <SqlEditor
        ref={editor}
        value={query}
        onChange={onChange}
        onRun={() => void tryIt()}
        schema={session.schema}
        ariaLabel="Deine Lösung (SQL)"
      />
      {ausfuehren ? (
        <div className="actions">
          <button type="button" className="secondary" onClick={() => void tryIt()} disabled={busy || !session.ready || !query.trim()}>
            <Icon name="play" /> Ausprobieren
          </button>
          <span className="hint">
            <kbd>Strg</kbd> + <kbd>Enter</kbd> · Datensatz: {ds.titel} · geprüft wird nach der Abgabe
          </span>
        </div>
      ) : (
        <p className="hint">
          <Icon name="database" /> SQL-Editor ohne Ausführen – wie auf Papier. Nach der Abgabe wird deine Abfrage automatisch mit der
          Musterlösung verglichen.
        </p>
      )}
      {ex.teilaufgabe && (
        <p className="hint">
          Benennen und begründen kannst du als Kommentar über der Abfrage (<code>-- Fehler 1: …</code>); geprüft wird nur die korrigierte
          Abfrage.
        </p>
      )}
      {session.error && (
        <p className="card warn">
          <Icon name="triangle-alert" /> {session.error}
        </p>
      )}
      <LintWarnings warnings={warnings} exercise />
      {result && <ExecOutput result={result} schema={session.errorSchema} />}
    </div>
  );
}
