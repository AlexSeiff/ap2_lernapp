// Einzelne Normalisierungs-Übung (/normalisierung/:id): Aufgabe mit Ausgangstabelle bzw. Beschreibung, darunter der Tabellen-Editor
// mit einem Reiter je Schritt (1. NF, 2. NF, 3. NF) und dem Beziehungsdiagramm. „Prüfen“ gleicht jeden Schritt mit der Musterlösung ab,
// ohne sie zu verraten (nur deine Tabellen und wie viele fehlen); die Lösung zeigt je Schritt Begründung, Diagramm und
// Relationenschreibweise. Der Entwurf bleibt in diesem Browser erhalten, bis die Übung gelöst ist.

import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { NormalisierungUebung as NfUebung } from '../../domain/normalisierungUebungen';
import { Icon } from '../components/Icon';
import { Markdown } from '../components/Markdown';
import { SchemaDiagramm } from '../components/SchemaDiagramm';
import { RelationText } from '../components/tabellen/TabellenKarte';
import { TabellenEditor } from '../components/TabellenEditor';
import { useConfirm } from '../hooks/useConfirm';
import { jsonStatus, recordJsonCheck, recordJsonHint, recordJsonLoesung } from '../lib/jsonUebungen';
import {
  ausgangAlsAnlage,
  leereNfAntwort,
  leseNfAntwort,
  leseNfEntwurf,
  normalisierungUebungen,
  pruefeNfAntwort,
  schreibeNfEntwurf,
  tabellenDesSchritts,
  type NfPruefung,
  type SchrittPruefung,
} from '../lib/normalisierung';
import { useStore } from '../lib/store';
import { istTabellenLeer, relationTeile, type TabellenAntwort } from '../lib/tabellenEditor';
import { LEVEL_LABELS, STATUS_LABELS, stars } from '../lib/uebungLabels';

export function NormalisierungUebung() {
  const { id = '' } = useParams();
  const { content } = useStore();
  const u = normalisierungUebungen(content).find((x) => x.id === id);
  if (!u) {
    return (
      <div className="page">
        <h1>Übung nicht gefunden</h1>
        <p>
          <Link to="/normalisierung">← Zu den Normalisierungs-Übungen</Link>
        </p>
      </div>
    );
  }
  return <NfUebungView key={id} u={u} />;
}

function NfUebungView({ u }: { u: NfUebung }) {
  const { content, progress, update } = useStore();
  const confirm = useConfirm();
  const status = jsonStatus(progress.json[u.id]);
  const [wert, setWert] = useState<TabellenAntwort>(() => leseNfAntwort(u, leseNfEntwurf(u.id)));
  const [pruefung, setPruefung] = useState<NfPruefung | null>(null);
  const [hinweise, setHinweise] = useState(0);
  const [loesungOffen, setLoesungOffen] = useState(false);
  const anlagen = useMemo(() => ausgangAlsAnlage(u), [u]);
  const leer = istTabellenLeer(wert);
  const ok = !!pruefung?.ok;

  const alle = normalisierungUebungen(content);
  const nach = alle.slice(alle.findIndex((x) => x.id === u.id) + 1);
  const naechste =
    [...nach, ...alle].find((x) => x.id !== u.id && jsonStatus(progress.json[x.id]) === 'faellig') ??
    [...nach, ...alle].find((x) => x.id !== u.id && jsonStatus(progress.json[x.id]) === 'offen');
  const thema = u.topicId ? content.topics.find((t) => t.id === u.topicId) : undefined;

  const aendere = (a: TabellenAntwort) => {
    setWert(a);
    setPruefung(null);
    schreibeNfEntwurf(u.id, a);
  };
  const pruefen = () => {
    if (leer) return;
    const p = pruefeNfAntwort(u, wert);
    setPruefung(p);
    update((s) => recordJsonCheck(s, u.id, p.ok));
    // Gelöst: Der Entwurf hat seinen Zweck erfüllt, bei der Wiederholung beginnt die Übung leer.
    if (p.ok) schreibeNfEntwurf(u.id, undefined);
  };
  const hinweis = () => {
    setHinweise((h) => h + 1);
    update((s) => recordJsonHint(s, u.id));
  };
  const zeigeLoesung = async () => {
    const ja = await confirm({
      title: 'Lösung zeigen?',
      message: 'Die Musterlösung erscheint unter dem Editor. Die Übung zählt dann als „mit Lösung“ und kommt morgen zur Wiederholung.',
      confirmLabel: 'Lösung zeigen',
    });
    if (!ja) return;
    setLoesungOffen(true);
    update((s) => recordJsonLoesung(s, u.id));
  };
  const zuruecksetzen = async () => {
    const ja = await confirm({
      title: 'Neu beginnen?',
      message: 'Alle Tabellen und Begründungen dieser Übung werden gelöscht.',
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (ja) aendere(leereNfAntwort(u));
  };

  return (
    <div className="page paper-sheet json-page">
      <p className="crumbs">
        <Link to="/normalisierung">Normalisierung</Link> / {u.id}
      </p>
      <h1>{u.titel}</h1>
      <div className="task-card">
        <div className="task-head">
          <span className="task-code sql-code">{u.id}</span>
          <span className="badge" title={LEVEL_LABELS[u.stufe]}>
            {stars(u.stufe)} {LEVEL_LABELS[u.stufe]}
          </span>
          <span className="badge">{u.quelle === 'tabelle' ? 'aus Tabelle' : 'aus Text'}</span>
          {status !== 'offen' && <span className="badge">{STATUS_LABELS[status]}</span>}
        </div>
        <Markdown source={false}>{u.aufgabe}</Markdown>
        {u.ausgang && (
          <div className="table-wrap nf-ausgang">
            <table>
              <caption>Ausgangstabelle „{u.ausgang.name}“</caption>
              <thead>
                <tr>
                  {u.ausgang.kopf.map((k) => (
                    <th key={k} scope="col">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {u.ausgang.zeilen.map((z, i) => (
                  <tr key={i}>
                    {z.map((c, j) => (
                      <td key={j}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="editor-antwort">
        <p className="ed-titel small">
          <Icon name="table" />{' '}
          {u.loesung.length > 1
            ? 'Leg je Schritt deine Tabellen an: Spalten benennen, PK und FK↑ markieren, Abhängigkeiten ins Textfeld. „Aus … übernehmen“ kopiert den vorigen Schritt zum Weiterzerlegen.'
            : 'Leg die Tabellen des Endschemas an: Spalten benennen, PK und FK↑ markieren, beim FK die Zieltabelle wählen. Abhängigkeiten ins Textfeld.'}
        </p>
        <TabellenEditor wert={wert} onChange={aendere} anlagen={anlagen} />
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
        <button type="button" className="ghost" onClick={() => void zuruecksetzen()} disabled={leer}>
          <Icon name="rotate-ccw" /> Neu beginnen
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
              <Icon name={ok ? 'circle-check' : 'circle-x'} />{' '}
              {ok
                ? 'Richtig! Alle Tabellen, Primär- und Fremdschlüssel stimmen mit der Musterlösung überein.'
                : `Noch nicht fertig: ${pruefung.schritte.filter((s) => s.ok).length} von ${pruefung.schritte.length} ${pruefung.schritte.length === 1 ? 'Schritt stimmt' : 'Schritten stimmen'}.`}
            </p>
            {ok && naechste && (
              <Link className="button" to={`/normalisierung/${naechste.id}`}>
                Weiter →
              </Link>
            )}
          </div>
          {!ok && pruefung.schritte.map((s) => <SchrittBefund key={s.titel} s={s} mehrere={pruefung.schritte.length > 1} />)}
          {!ok && (
            <p className="hint small">
              Verglichen werden die Spaltennamen – nimm die Namen aus der Aufgabe. Tabellennamen und Spaltenreihenfolge sind frei.
            </p>
          )}
        </div>
      )}

      {(loesungOffen || ok) && <Musterloesung u={u} />}

      {(ok || loesungOffen) && u.erklaerung && (
        <section className="card">
          <h2>
            <Icon name="book-open" /> Prüferkommentar
          </h2>
          <Markdown source={false}>{u.erklaerung}</Markdown>
        </section>
      )}

      <p className="hint">
        Nachlesen: <Link to="/glossar/1-normalform">1. NF</Link>
        {' · '}
        <Link to="/glossar/2-normalform">2. NF</Link>
        {' · '}
        <Link to="/glossar/3-normalform">3. NF</Link>
        {' · '}
        <Link to="/glossar/funktionale-abhangigkeit">Funktionale Abhängigkeit</Link>
        {thema && (
          <>
            {' · '}
            <Link to={`/lernen/${thema.id}`}>{thema.title}</Link>
          </>
        )}
        {naechste && !ok && (
          <>
            {' · '}
            <Link to={`/normalisierung/${naechste.id}`}>Nächste Übung: {naechste.titel} →</Link>
          </>
        )}
      </p>
    </div>
  );
}

/** Befund eines Schritts, ohne die Musterlösung zu verraten: deine Tabellen, wie viele fehlen. */
function SchrittBefund({ s, mehrere }: { s: SchrittPruefung; mehrere: boolean }) {
  const passend = s.abgleich.zeilen.filter((z) => z.deine);
  const fehlend = s.abgleich.zeilen.length - passend.length;
  const anzahl = (n: number, eins: string, viele: string) => `${n} ${n === 1 ? eins : viele}`;
  return (
    <div className="nf-schritt">
      {mehrere && (
        <h3 className="small">
          {s.ok ? '✓' : '✗'} {s.titel}
        </h3>
      )}
      {s.leer ? (
        <p className="small muted">Noch keine Tabellen angelegt.</p>
      ) : (
        <ul className="nf-befund">
          {passend.map((z, i) => {
            const probleme = [
              z.fehlend.length ? `${anzahl(z.fehlend.length, 'Spalte fehlt', 'Spalten fehlen')}` : '',
              z.zusaetzlich.length ? `gehört nicht hierher: ${z.zusaetzlich.join(', ')}` : '',
              z.pkOk ? '' : 'Primärschlüssel stimmt nicht',
              z.fkFehlt.length ? `nicht als FK↑ markiert: ${z.fkFehlt.join(', ')}` : '',
            ].filter(Boolean);
            return (
              <li key={i} className={probleme.length ? 'bad' : 'ok'}>
                {probleme.length ? '✗' : '✓'} <b>{z.deine}</b>
                {probleme.length ? ` – ${probleme.join(' · ')}` : ' stimmt'}
              </li>
            );
          })}
          {s.abgleich.uebrig.map((n) => (
            <li key={n} className="bad">
              ✗ <b>{n}</b> – passt zu keiner Tabelle der Lösung (zu viel zerlegt oder Spalten falsch verteilt?)
            </li>
          ))}
          {fehlend > 0 && <li className="bad">✗ Es {fehlend === 1 ? 'fehlt noch 1 Tabelle' : `fehlen noch ${fehlend} Tabellen`}.</li>}
          {s.fk.map((f) => (
            <li key={`${f.tabelle}.${f.spalte}`} className="bad">
              ✗ {f.meldung}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Musterloesung({ u }: { u: NfUebung }) {
  return (
    <section className="card">
      <h2>
        <Icon name="eye" /> Musterlösung
      </h2>
      {u.loesung.map((s) => {
        const tabellen = tabellenDesSchritts(s);
        return (
          <div key={s.titel} className="nf-schritt">
            {u.loesung.length > 1 && <h3>{s.titel}</h3>}
            <Markdown source={false}>{s.text}</Markdown>
            {tabellen.length > 1 && <SchemaDiagramm tabellen={tabellen} titel={`Musterlösung ${s.titel}`} />}
            <ul>
              {tabellen.map((t) => (
                <li key={t.id}>
                  <RelationText name={t.name} teile={relationTeile(t)} />
                </li>
              ))}
            </ul>
            {tabellen
              .filter((t) => t.zeilen.length)
              .map((t) => (
                <div key={`d${t.id}`} className="table-wrap nf-ausgang">
                  <table>
                    <caption>{t.name}</caption>
                    <thead>
                      <tr>
                        {t.spalten.map((x) => (
                          <th key={x.name} scope="col" className={x.pk ? 'pk' : ''}>
                            {x.pk ? <u>{x.name}</u> : x.name}
                            {x.fk ? '↑' : ''}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.zeilen.map((z, i) => (
                        <tr key={i}>
                          {z.map((c, j) => (
                            <td key={j}>{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
        );
      })}
      <p className="hint small">
        Andere, aber sinnvolle Tabellennamen sind in der Prüfung kein Fehler. Punkte bringen die Zerlegung, die gekennzeichneten Schlüssel
        und die Begründung über die Abhängigkeiten.
      </p>
    </section>
  );
}
