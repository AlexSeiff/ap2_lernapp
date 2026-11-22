// Einzelne JSON-Übung (/json/:id): Aufgabentext, Eingabefeld (Monospace) mit laufender Syntaxprüfung, „Prüfen“ gegen die Regeln der
// Übung, Hinweise, Musterlösung. Der Text im Feld wird nicht gespeichert – jeder Besuch beginnt neu (bzw. mit der Vorgabe).

import { useMemo, useState, type KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  type JsonFehler,
  type JsonPruefung,
  type JsonUebung as JsonUebungTyp,
  pruefeJsonAntwort,
  pruefeJsonSyntax,
} from '../../domain/jsonUebungen';
import { Icon } from '../components/Icon';
import { Markdown } from '../components/Markdown';
import { useConfirm } from '../hooks/useConfirm';
import { jsonStatus, jsonUebungen, recordJsonCheck, recordJsonHint, recordJsonLoesung } from '../lib/jsonUebungen';
import { useStore } from '../lib/store';
import { LEVEL_LABELS, STATUS_LABELS, stars } from '../lib/uebungLabels';

export function JsonUebung() {
  const { id = '' } = useParams();
  const { content } = useStore();
  const u = jsonUebungen(content).find((x) => x.id === id);
  if (!u) {
    return (
      <div className="page">
        <h1>Übung nicht gefunden</h1>
        <p>
          <Link to="/json">← Zu den JSON-Übungen</Link>
        </p>
      </div>
    );
  }
  return <JsonUebungView key={id} u={u} />;
}

/** Die fehlerhafte Zeile mit einem ^ unter der Stelle (auch für die XML-Übungen). */
export function Fehlerstelle({ text, fehler }: { text: string; fehler: Pick<JsonFehler, 'zeile' | 'spalte'> }) {
  const zeile = text.split('\n')[fehler.zeile - 1] ?? '';
  // lange Zeilen kürzen: höchstens 60 Zeichen vor und 20 nach der Stelle
  const von = Math.max(0, fehler.spalte - 1 - 60);
  const ausschnitt = zeile.slice(von, fehler.spalte - 1 + 20).replace(/\t/g, ' ');
  return (
    <pre className="json-fehlerzeile" aria-hidden="true">
      {von > 0 ? '…' : ''}
      {ausschnitt}
      {'\n'}
      {' '.repeat(Math.max(0, fehler.spalte - 1 - von) + (von > 0 ? 1 : 0))}^
    </pre>
  );
}

function JsonUebungView({ u }: { u: JsonUebungTyp }) {
  const { content, progress, update } = useStore();
  const confirm = useConfirm();
  const state = progress.json[u.id];
  const status = jsonStatus(state);
  const [text, setText] = useState(u.vorgabe ?? '');
  const [pruefung, setPruefung] = useState<JsonPruefung | null>(null);
  const [hinweise, setHinweise] = useState(0);
  const [loesungOffen, setLoesungOffen] = useState(false);
  const syntax = useMemo(() => pruefeJsonSyntax(text), [text]);
  const leer = !text.trim();

  const alle = jsonUebungen(content);
  const nach = alle.slice(alle.findIndex((x) => x.id === u.id) + 1);
  const naechste =
    [...nach, ...alle].find((x) => x.id !== u.id && jsonStatus(progress.json[x.id]) === 'faellig') ??
    [...nach, ...alle].find((x) => x.id !== u.id && jsonStatus(progress.json[x.id]) === 'offen');
  const thema = u.topicId ? content.topics.find((t) => t.id === u.topicId) : undefined;

  const aendere = (neu: string) => {
    setText(neu);
    setPruefung(null);
  };
  const pruefen = () => {
    const p = pruefeJsonAntwort(text, u.pruefungen);
    setPruefung(p);
    update((s) => recordJsonCheck(s, u.id, p.ok));
  };
  const hinweis = () => {
    setHinweise((h) => h + 1);
    update((s) => recordJsonHint(s, u.id));
  };
  const zeigeLoesung = async () => {
    const ok = await confirm({
      title: 'Lösung zeigen?',
      message: 'Die Musterlösung erscheint unter dem Eingabefeld. Die Übung zählt dann als „mit Lösung“ und kommt morgen zur Wiederholung.',
      confirmLabel: 'Lösung zeigen',
    });
    if (!ok) return;
    setLoesungOffen(true);
    update((s) => recordJsonLoesung(s, u.id));
  };
  /** Tab schreibt zwei Leerzeichen statt den Fokus zu verlassen (Esc, dann Tab verlässt das Feld – Tastaturnutzer bleiben nicht hängen). */
  const taste = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab' || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    const a = e.currentTarget;
    const { selectionStart: von, selectionEnd: bis } = a;
    aendere(`${text.slice(0, von)}  ${text.slice(bis)}`);
    requestAnimationFrame(() => a.setSelectionRange(von + 2, von + 2));
  };

  return (
    <div className="page paper-sheet json-page">
      <p className="crumbs">
        <Link to="/json">JSON-Übungen</Link> / {u.id}
      </p>
      <h1>{u.titel}</h1>
      <div className="task-card">
        <div className="task-head">
          <span className="task-code sql-code">{u.id}</span>
          <span className="badge" title={LEVEL_LABELS[u.stufe]}>
            {stars(u.stufe)} {LEVEL_LABELS[u.stufe]}
          </span>
          {status !== 'offen' && <span className="badge">{STATUS_LABELS[status]}</span>}
        </div>
        <Markdown source={false}>{u.aufgabe}</Markdown>
      </div>

      <label className="json-feld">
        <span className="small muted">Dein JSON-Dokument</span>
        <textarea
          className="answer mono json-eingabe"
          rows={Math.min(24, Math.max(10, text.split('\n').length + 2))}
          value={text}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-describedby="json-status"
          onChange={(e) => aendere(e.target.value)}
          onKeyDown={taste}
        />
      </label>
      <div id="json-status" className="json-status" role="status" aria-live="polite">
        {leer ? (
          <span className="muted small">Schreib dein JSON. Die Syntax wird laufend geprüft.</span>
        ) : syntax.ok ? (
          <span className="ok">
            <Icon name="circle-check" /> Gültiges JSON
          </span>
        ) : (
          <>
            <span className="bad">
              <Icon name="circle-x" /> Zeile {syntax.fehler.zeile}, Spalte {syntax.fehler.spalte}: {syntax.fehler.meldung}
            </span>
            <Fehlerstelle text={text} fehler={syntax.fehler} />
          </>
        )}
      </div>

      <div className="actions">
        <button type="button" onClick={pruefen} disabled={leer}>
          <Icon name="circle-check" /> Prüfen
        </button>
        {u.hinweise.length > 0 && (
          <button type="button" className="secondary" onClick={hinweis} disabled={hinweise >= u.hinweise.length}>
            <Icon name="lightbulb" /> Hinweis ({hinweise}/{u.hinweise.length})
          </button>
        )}
        <button type="button" className="secondary" onClick={() => void zeigeLoesung()} disabled={loesungOffen}>
          <Icon name="eye" /> Lösung zeigen
        </button>
        <button type="button" className="ghost" onClick={() => aendere(u.vorgabe ?? '')} disabled={text === (u.vorgabe ?? '')}>
          <Icon name="rotate-ccw" /> {u.vorgabe ? 'Zurücksetzen' : 'Leeren'}
        </button>
      </div>

      {hinweise > 0 && (
        <div className="card info">
          <ol className="hints">
            {u.hinweise.slice(0, hinweise).map((h) => (
              <li key={h}>
                <Markdown source={false}>{h}</Markdown>
              </li>
            ))}
          </ol>
        </div>
      )}

      {pruefung && (
        <div className={`card ${pruefung.ok ? 'success' : 'verdict-fail'}`} role="status">
          <div className="verdict-row">
            <p className={`verdict ${pruefung.ok ? 'ok' : 'bad'}`}>
              <Icon name={pruefung.ok ? 'circle-check' : 'circle-x'} />{' '}
              {pruefung.ok
                ? 'Richtig! Syntax und Struktur stimmen.'
                : !pruefung.syntax.ok
                  ? 'Noch kein gültiges JSON – siehe die Meldung unter dem Eingabefeld.'
                  : `Noch nicht: ${pruefung.regeln.filter((r) => r.ok).length} von ${pruefung.regeln.length} Anforderungen erfüllt.`}
            </p>
            {pruefung.ok && naechste && (
              <Link className="button" to={`/json/${naechste.id}`}>
                Weiter →
              </Link>
            )}
          </div>
          {pruefung.regeln.length > 0 && (
            <ul className="json-regeln">
              {pruefung.regeln.map((r, i) => (
                <li key={i} className={r.ok ? 'ok' : 'bad'}>
                  <Icon name={r.ok ? 'circle-check' : 'circle-x'} /> {r.ok ? r.verlangt : r.meldung}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {loesungOffen && (
        <section className="card">
          <h2>
            <Icon name="eye" /> Musterlösung
          </h2>
          <pre className="json-loesung">
            <code>{u.loesung}</code>
          </pre>
          <p className="hint small">Andere Reihenfolge der Schlüssel oder eine andere Einrückung sind genauso richtig.</p>
        </section>
      )}

      {(pruefung?.ok || loesungOffen) && u.erklaerung && (
        <section className="card">
          <h2>
            <Icon name="book-open" /> Erklärung
          </h2>
          <Markdown source={false}>{u.erklaerung}</Markdown>
        </section>
      )}

      <p className="hint">
        Nachlesen: <Link to="/glossar/json">Begriff JSON</Link>
        {thema && (
          <>
            {' · '}
            <Link to={`/lernen/${thema.id}`}>{thema.title}</Link>
          </>
        )}
        {naechste && !pruefung?.ok && (
          <>
            {' · '}
            <Link to={`/json/${naechste.id}`}>Nächste Übung: {naechste.titel} →</Link>
          </>
        )}
      </p>
    </div>
  );
}
