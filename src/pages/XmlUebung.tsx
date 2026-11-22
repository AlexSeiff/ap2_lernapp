// Einzelne XML-Übung (/xml/:id). Art „dokument“: Eingabefeld mit laufender Prüfung der Wohlgeformtheit, „Prüfen“ gegen die Regeln der
// Übung. Art „xpath“: das Dokument steht unter der Aufgabe, darunter eine Zeile für den Ausdruck; „Prüfen“ wertet ihn aus und vergleicht
// mit dem, was die Musterlösung liefert. Wie bei den JSON-Übungen wird der Text im Feld nicht gespeichert.

import { useMemo, useState, type KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ergebnisListe, istKnotenmenge, pruefeXmlSyntax, pruefeXpathSyntax, werteXpath, type XmlDokument } from '../../domain/xml';
import {
  pruefeXmlAntwort,
  pruefeXpathAntwort,
  type XmlPruefung,
  type XmlUebung as XmlUebungTyp,
  type XpathPruefung,
} from '../../domain/xmlUebungen';
import { Icon } from '../components/Icon';
import { Markdown } from '../components/Markdown';
import { useConfirm } from '../hooks/useConfirm';
import { jsonStatus, recordJsonCheck, recordJsonHint, recordJsonLoesung, xmlUebungen } from '../lib/jsonUebungen';
import { useStore } from '../lib/store';
import { LEVEL_LABELS, STATUS_LABELS, stars } from '../lib/uebungLabels';
import { Fehlerstelle } from './JsonUebung';

export function XmlUebung() {
  const { id = '' } = useParams();
  const { content } = useStore();
  const u = xmlUebungen(content).find((x) => x.id === id);
  if (!u) {
    return (
      <div className="page">
        <h1>Übung nicht gefunden</h1>
        <p>
          <Link to="/xml">← Zu den XML-Übungen</Link>
        </p>
      </div>
    );
  }
  return <XmlUebungView key={id} u={u} />;
}

type Pruefung = { art: 'dokument'; p: XmlPruefung } | { art: 'xpath'; p: XpathPruefung };

function XmlUebungView({ u }: { u: XmlUebungTyp }) {
  const { content, progress, update } = useStore();
  const confirm = useConfirm();
  const status = jsonStatus(progress.json[u.id]);
  const [text, setText] = useState(u.vorgabe ?? '');
  const [pruefung, setPruefung] = useState<Pruefung | null>(null);
  const [hinweise, setHinweise] = useState(0);
  const [loesungOffen, setLoesungOffen] = useState(false);
  const xpath = u.art === 'xpath';
  const dokument = useMemo<XmlDokument | undefined>(() => {
    if (!u.dokument) return undefined;
    const s = pruefeXmlSyntax(u.dokument);
    return s.ok ? s.dokument : undefined;
  }, [u.dokument]);
  const leer = !text.trim();

  const alle = xmlUebungen(content);
  const nach = alle.slice(alle.findIndex((x) => x.id === u.id) + 1);
  const naechste =
    [...nach, ...alle].find((x) => x.id !== u.id && jsonStatus(progress.json[x.id]) === 'faellig') ??
    [...nach, ...alle].find((x) => x.id !== u.id && jsonStatus(progress.json[x.id]) === 'offen');
  const thema = u.topicId ? content.topics.find((t) => t.id === u.topicId) : undefined;
  const ok = pruefung ? pruefung.p.ok : false;

  const aendere = (neu: string) => {
    setText(neu);
    setPruefung(null);
  };
  const pruefen = () => {
    if (leer) return;
    const p: Pruefung =
      xpath && dokument
        ? { art: 'xpath', p: pruefeXpathAntwort(dokument, text, u.loesung) }
        : { art: 'dokument', p: pruefeXmlAntwort(text, u.pruefungen) };
    setPruefung(p);
    update((s) => recordJsonCheck(s, u.id, p.p.ok));
  };
  const hinweis = () => {
    setHinweise((h) => h + 1);
    update((s) => recordJsonHint(s, u.id));
  };
  const zeigeLoesung = async () => {
    const ja = await confirm({
      title: 'Lösung zeigen?',
      message: 'Die Musterlösung erscheint unter dem Eingabefeld. Die Übung zählt dann als „mit Lösung“ und kommt morgen zur Wiederholung.',
      confirmLabel: 'Lösung zeigen',
    });
    if (!ja) return;
    setLoesungOffen(true);
    update((s) => recordJsonLoesung(s, u.id));
  };
  /** Tab schreibt zwei Leerzeichen (wie bei den JSON-Übungen). */
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
        <Link to="/xml">XML-Übungen</Link> / {u.id}
      </p>
      <h1>{u.titel}</h1>
      <div className="task-card">
        <div className="task-head">
          <span className="task-code sql-code">{u.id}</span>
          <span className="badge" title={LEVEL_LABELS[u.stufe]}>
            {stars(u.stufe)} {LEVEL_LABELS[u.stufe]}
          </span>
          {xpath && <span className="badge">XPath</span>}
          {status !== 'offen' && <span className="badge">{STATUS_LABELS[status]}</span>}
        </div>
        <Markdown source={false}>{u.aufgabe}</Markdown>
        {xpath && u.dokument && (
          <pre className="xml-dokument" aria-label="XML-Dokument zur Aufgabe">
            <code>{u.dokument}</code>
          </pre>
        )}
      </div>

      {xpath ? (
        <XpathEingabe text={text} aendere={aendere} pruefen={pruefen} />
      ) : (
        <>
          <label className="json-feld">
            <span className="small muted">Dein XML-Dokument</span>
            <textarea
              className="answer mono json-eingabe"
              rows={Math.min(24, Math.max(10, text.split('\n').length + 2))}
              value={text}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-describedby="xml-status"
              onChange={(e) => aendere(e.target.value)}
              onKeyDown={taste}
            />
          </label>
          <XmlStatus text={text} />
        </>
      )}

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
        <div className={`card ${ok ? 'success' : 'verdict-fail'}`} role="status">
          <div className="verdict-row">
            <p className={`verdict ${ok ? 'ok' : 'bad'}`}>
              <Icon name={ok ? 'circle-check' : 'circle-x'} /> {urteil(pruefung)}
            </p>
            {ok && naechste && (
              <Link className="button" to={`/xml/${naechste.id}`}>
                Weiter →
              </Link>
            )}
          </div>
          {pruefung.art === 'dokument' && pruefung.p.regeln.length > 0 && (
            <ul className="json-regeln">
              {pruefung.p.regeln.map((r, i) => (
                <li key={i} className={r.ok ? 'ok' : 'bad'}>
                  <Icon name={r.ok ? 'circle-check' : 'circle-x'} /> {r.ok ? r.verlangt : r.meldung}
                </li>
              ))}
            </ul>
          )}
          {pruefung.art === 'xpath' && 'ergebnis' in pruefung.p && (
            <Ergebnis liste={pruefung.p.ergebnis} knoten={pruefung.p.knoten} titel="Dein Ausdruck liefert" />
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
          {xpath ? (
            <>
              {u.alternativen?.length ? (
                <p className="small">
                  Ebenso richtig:{' '}
                  {u.alternativen.map((a, i) => (
                    <span key={a}>
                      {i > 0 && ' · '}
                      <code>{a}</code>
                    </span>
                  ))}
                </p>
              ) : null}
              {dokument && <LoesungsErgebnis dokument={dokument} ausdruck={u.loesung} />}
            </>
          ) : (
            <p className="hint small">
              Eine andere Einrückung, eine andere Reihenfolge der Attribute oder eine fehlende XML-Deklaration sind genauso richtig.
            </p>
          )}
        </section>
      )}

      {(ok || loesungOffen) && u.erklaerung && (
        <section className="card">
          <h2>
            <Icon name="book-open" /> Erklärung
          </h2>
          <Markdown source={false}>{u.erklaerung}</Markdown>
        </section>
      )}

      <p className="hint">
        Nachlesen: <Link to="/glossar/xml">Begriff XML</Link>
        {' · '}
        {xpath ? <Link to="/glossar/xpath">Begriff XPath</Link> : <Link to="/glossar/wohlgeformt">Begriff Wohlgeformt</Link>}
        {thema && (
          <>
            {' · '}
            <Link to={`/lernen/${thema.id}`}>{thema.title}</Link>
          </>
        )}
        {naechste && !ok && (
          <>
            {' · '}
            <Link to={`/xml/${naechste.id}`}>Nächste Übung: {naechste.titel} →</Link>
          </>
        )}
      </p>
    </div>
  );
}

function urteil(pr: Pruefung): string {
  if (pr.art === 'xpath') return 'meldung' in pr.p ? pr.p.meldung : `Der Ausdruck lässt sich nicht lesen: ${pr.p.fehler.meldung}`;
  const p = pr.p;
  if (p.ok) return 'Richtig! Das Dokument ist wohlgeformt und die Struktur stimmt.';
  if (!p.syntax.ok) return 'Das Dokument ist noch nicht wohlgeformt – siehe die Meldung unter dem Eingabefeld.';
  return `Wohlgeformt, aber noch nicht fertig: ${p.regeln.filter((r) => r.ok).length} von ${p.regeln.length} Anforderungen erfüllt.`;
}

function XmlStatus({ text }: { text: string }) {
  const syntax = useMemo(() => pruefeXmlSyntax(text), [text]);
  return (
    <div id="xml-status" className="json-status" role="status" aria-live="polite">
      {!text.trim() ? (
        <span className="muted small">Schreib dein XML. Die App prüft laufend, ob es wohlgeformt ist.</span>
      ) : syntax.ok ? (
        <span className="ok">
          <Icon name="circle-check" /> Wohlgeformt
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
  );
}

function XpathEingabe({ text, aendere, pruefen }: { text: string; aendere: (t: string) => void; pruefen: () => void }) {
  const syntax = useMemo(() => pruefeXpathSyntax(text), [text]);
  return (
    <>
      <label className="json-feld">
        <span className="small muted">Dein XPath-Ausdruck</span>
        <input
          className="answer mono xpath-eingabe"
          value={text}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-describedby="xml-status"
          onChange={(e) => aendere(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              pruefen();
            }
          }}
        />
      </label>
      <div id="xml-status" className="json-status" role="status" aria-live="polite">
        {!text.trim() ? (
          <span className="muted small">Schreib den Ausdruck und drück Enter oder „Prüfen“.</span>
        ) : syntax.ok ? (
          <span className="muted small">Ausdruck lesbar – „Prüfen“ wertet ihn auf dem Dokument aus.</span>
        ) : (
          <>
            <span className="bad">
              <Icon name="circle-x" /> {syntax.fehler.meldung}
            </span>
            <Fehlerstelle text={text} fehler={{ zeile: 1, spalte: syntax.fehler.stelle + 1 }} />
          </>
        )}
      </div>
    </>
  );
}

function Ergebnis({ liste, titel, knoten }: { liste: { anzeige: string }[]; titel: string; knoten: boolean }) {
  if (!knoten)
    return (
      <p className="small xml-ergebnis">
        {titel}: <code>{liste[0]?.anzeige}</code>
      </p>
    );
  return (
    <div className="xml-ergebnis">
      <p className="small">
        {titel}: {liste.length === 1 ? '1 Treffer' : `${liste.length} Treffer`}
        {liste.length ? '' : ' (nichts gefunden)'}
      </p>
      {liste.length > 0 && (
        <ol className="small">
          {liste.slice(0, 12).map((e, i) => (
            <li key={i}>
              <code>{e.anzeige}</code>
            </li>
          ))}
          {liste.length > 12 && <li className="muted">… und {liste.length - 12} weitere</li>}
        </ol>
      )}
    </div>
  );
}

function LoesungsErgebnis({ dokument, ausdruck }: { dokument: XmlDokument; ausdruck: string }) {
  const w = werteXpath(dokument, ausdruck);
  if (!w.ok) return null;
  return <Ergebnis liste={ergebnisListe(w.wert)} knoten={istKnotenmenge(w.wert)} titel="Die Musterlösung liefert" />;
}
