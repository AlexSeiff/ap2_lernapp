// Einzelne Rechenübung (/rechnen/:id): Aufgabe mit Daten, je Ergebnis ein Eingabefeld, Prüfen mit Rückmeldung je Feld
// (inkl. typischer Fehler), Hinweise, „🎲 Neue Zahlen“ und „👁 Lösung zeigen“ mit Rechenweg. Logik: useRechenUebung.

import { lazy, type ReactNode, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { RechenUebung as RechenUebungTyp } from '../../shared/types';
import type { Beispiel } from '../rechnen/beispiel';
import { AnhangPanel } from '../components/Belegsatz';
import { LeichtOptionen } from '../components/LeichtOptionen';
import { Markdown } from '../components/Markdown';
import { useConfirm } from '../hooks/useConfirm';
import { useRechenUebung } from '../hooks/useRechenUebung';
import { rechenStatus } from '../lib/rechnen';
import { useStore } from '../lib/store';
import { LEVEL_LABELS, stars, STATUS_LABELS } from '../lib/uebungLabels';
import { type EingabeErgebnis, formatWert } from '../rechnen/checker';
import type { AufgeloesteEingabe } from '../rechnen/instanz';
import type { EingabeLayout, Tabelle } from '../rechnen/typen';
import { Icon } from '../components/Icon';

// KaTeX erst laden, wenn jemand die Lösung ansieht.
const Rechenweg = lazy(() => import('../components/Rechenweg').then((m) => ({ default: m.Rechenweg })));

export function RechenUebung() {
  const { id = '' } = useParams();
  const { content } = useStore();
  const u = content.rechenUebungen.find((x) => x.id === id);
  if (!u) {
    return (
      <div className="page">
        <h1>Übung nicht gefunden</h1>
        <p>
          <Link to="/rechnen">← Zur Übungsliste</Link>
        </p>
      </div>
    );
  }
  // Neuer key je Übung: Eingaben, Hinweise und Ergebnis starten frisch.
  return <RechenUebungView key={id} u={u} />;
}

function RechenUebungView({ u }: { u: RechenUebungTyp }) {
  const { content, progress } = useStore();
  const confirm = useConfirm();
  const r = useRechenUebung(u);
  const { inst, ergebnis } = r;
  const status = rechenStatus(r.state);

  const idx = content.rechenUebungen.indexOf(u);
  const after = [...content.rechenUebungen.slice(idx + 1), ...content.rechenUebungen.slice(0, idx)];
  const next = after.find((x) => rechenStatus(progress.rechnen[x.id]) !== 'geloest') ?? after[0];

  const showSolution = async () => {
    const ok = await confirm({
      title: 'Lösung zeigen?',
      message: 'Die Übung zählt dann als „mit Lösung“ statt „gelöst“ und kommt morgen zur Wiederholung.',
      confirmLabel: 'Lösung zeigen',
    });
    if (ok) r.zeigeLoesung();
  };

  const feld = (e: AufgeloesteEingabe, kompakt = false) => (
    <EingabeFeld
      key={e.id}
      e={e}
      wert={r.antworten[e.id] ?? ''}
      onChange={(t) => r.setAntwort(e.id, t)}
      ergebnis={ergebnis?.ergebnisse[e.id]}
      kompakt={kompakt}
    />
  );

  const layout = inst?.loesung.layout;
  const imLayout = new Set(layout?.zeilen.flatMap((z) => z.ids.filter((x): x is string => !!x)) ?? []);
  const tabellenFelder = inst?.eingaben.filter((e) => imLayout.has(e.id)) ?? [];
  const listenFelder = inst?.eingaben.filter((e) => !imLayout.has(e.id)) ?? [];

  return (
    <div className="page rechnen-page paper-sheet">
      <p className="crumbs">
        <Link to="/rechnen">Rechenübungen</Link> / {u.thema}
      </p>
      <h1>{u.titel}</h1>
      <div className="task-card">
        <div className="task-head">
          <span className="task-code sql-code">{u.id}</span>
          <span className="badge" title={LEVEL_LABELS[u.schwierigkeit]}>
            {stars(u.schwierigkeit)} {LEVEL_LABELS[u.schwierigkeit]}
          </span>
          <span className="badge muted">{u.thema}</span>
          {status !== 'offen' && <span className="badge">{STATUS_LABELS[status]}</span>}
          {r.zufall && (
            <span className="badge ai">
              <Icon name="dices" /> neue Zahlen
            </span>
          )}
          {u.quelleAufgabe && <span className="muted small">{u.quelleAufgabe}</span>}
        </div>
        {inst ? (
          <>
            <Markdown source={false}>{inst.aufgabe}</Markdown>
            {inst.tabelle && <DatenTabelle t={inst.tabelle} />}
          </>
        ) : (
          <Markdown source={false}>{u.aufgabe}</Markdown>
        )}
        <p className="hint">
          <Icon name="pencil" /> Rechne auf Papier, trage nur Ergebnisse ein.
          {r.state && r.state.attempts > 0 && ` · ${r.state.attempts} ${r.state.attempts === 1 ? 'Versuch' : 'Versuche'}`}
        </p>
      </div>

      <div className="anhang-leiste no-print">
        <AnhangPanel formeln />
      </div>

      {r.beispiel && <BeispielKarte b={r.beispiel} rechenweg={!!inst?.loesung.schritte.length} />}

      {inst && !r.error && (
        <div className="mode-switch" role="group" aria-label="Modus">
          <button type="button" aria-pressed={!r.leichtModus} onClick={() => r.setLeichtModus(false)}>
            <Icon name="pencil" /> Eintippen
          </button>
          <button type="button" aria-pressed={r.leichtModus} onClick={() => r.setLeichtModus(true)}>
            <Icon name="list-checks" /> Ergebnis auswählen
          </button>
        </div>
      )}
      {r.leichtModus && inst && !r.auswahl && <p className="hint">Für diese Übung gibt es keine Auswahl – trag die Ergebnisse ein.</p>}

      {r.error || !inst ? (
        <p className="card warn">
          <Icon name="triangle-alert" /> Diese Übung passt nicht zu ihrer Vorlage: {r.error}. Das ist ein Fehler in den Übungsdaten, nicht
          bei dir.
        </p>
      ) : r.leicht && r.auswahl ? (
        <div className="card re-eingaben">
          {r.auswahl.map((a, ai) => {
            const e = inst.eingaben.find((x) => x.id === a.eingabe)!;
            const g = r.wahl[a.eingabe];
            const gewaehlt = g === undefined ? null : a.optionen[g];
            const aktuell = r.auswahl!.findIndex((x) => r.wahl[x.eingabe] === undefined) === ai;
            return (
              <div key={a.eingabe} className="re-feld">
                <span className="re-label">
                  <b>{e.label}</b>
                  {e.einheit && <span className="muted"> ({e.einheit})</span>}
                </span>
                <LeichtOptionen
                  optionen={a.optionen}
                  gewaehlt={g ?? null}
                  onWaehle={(i) => r.waehle(a.eingabe, i)}
                  tasten={aktuell}
                  label={e.label}
                />
                {gewaehlt && !gewaehlt.richtig && (
                  <div className="re-meldung small">
                    {gewaehlt.erklaerung ? (
                      <Markdown source={false}>{gewaehlt.erklaerung}</Markdown>
                    ) : (
                      <span className="muted">Kein typischer Fehler bekannt – rechne noch einmal nach.</span>
                    )}
                  </div>
                )}
                {a.aufgefuellt > 0 && (
                  <p className="small muted">
                    {a.aufgefuellt === a.optionen.length - 1
                      ? 'Die falschen Antworten sind Werte in der Nähe, keine bekannten typischen Fehler.'
                      : `${a.aufgefuellt} falsche ${a.aufgefuellt === 1 ? 'Antwort ist ein Wert' : 'Antworten sind Werte'} in der Nähe, kein bekannter typischer Fehler.`}
                  </p>
                )}
              </div>
            );
          })}
          {!r.leichtFertig && (
            <p className="hint">
              Wähle je Ergebnis die richtige Antwort: klicken oder <kbd>1</kbd>–<kbd>4</kbd>. Rechne vorher auf Papier.
            </p>
          )}
          <div className="actions">
            {r.hinweiseGesamt > 0 && (
              <button type="button" className="secondary" onClick={r.hinweis} disabled={r.hinweise.length >= r.hinweiseGesamt}>
                <Icon name="lightbulb" /> Hinweis {Math.min(r.hinweise.length + 1, r.hinweiseGesamt)}/{r.hinweiseGesamt}
              </button>
            )}
            <button type="button" className="secondary" onClick={() => void showSolution()} disabled={r.loesungOffen}>
              <Icon name="eye" /> Lösung zeigen
            </button>
          </div>
        </div>
      ) : (
        <form
          className="card re-eingaben"
          onSubmit={(ev) => {
            ev.preventDefault();
            r.pruefen();
          }}
        >
          {layout && tabellenFelder.length > 0 && <LayoutEingaben layout={layout} felder={tabellenFelder} feld={feld} />}
          {listenFelder.map((e) => feld(e))}
          {layout && tabellenFelder.length > 0 && <Meldungen felder={tabellenFelder} ergebnis={ergebnis?.ergebnisse} />}
          <div className="actions">
            <button type="submit">✓ Prüfen</button>
            {r.hinweiseGesamt > 0 && (
              <button type="button" className="secondary" onClick={r.hinweis} disabled={r.hinweise.length >= r.hinweiseGesamt}>
                <Icon name="lightbulb" /> Hinweis {Math.min(r.hinweise.length + 1, r.hinweiseGesamt)}/{r.hinweiseGesamt}
              </button>
            )}
            {u.neueZahlen && (
              <button type="button" className="secondary" onClick={r.neueZahlen} title="Gleiche Aufgabe mit anderen Zahlen">
                <Icon name="dices" /> Neue Zahlen
              </button>
            )}
            {r.zufall && (
              <button type="button" className="ghost" onClick={r.originalZahlen}>
                <Icon name="undo-2" /> Originalzahlen
              </button>
            )}
            <button type="button" className="secondary" onClick={() => void showSolution()} disabled={r.loesungOffen}>
              <Icon name="eye" /> Lösung zeigen
            </button>
          </div>
          <p className="hint">
            <kbd>Enter</kbd> = Prüfen. Dezimalkomma oder -punkt, Einheit optional. Mehrere Werte mit Semikolon trennen.
          </p>
        </form>
      )}

      {r.hinweise.length > 0 && (
        <div className="card info">
          <b>
            <Icon name="lightbulb" /> Hinweise
          </b>
          <ol className="hints">
            {r.hinweise.map((h, i) => (
              <li key={i}>
                <Markdown source={false} className="re-hinweis">
                  {h}
                </Markdown>
              </li>
            ))}
          </ol>
        </div>
      )}

      {r.leicht && r.leichtFertig && (
        <div className={`card ${r.leichtOk ? 'success' : 'verdict-fail'}`} role="status">
          <p className={`verdict ${r.leichtOk ? 'ok' : 'bad'}`}>
            <Icon name={r.leichtOk ? 'circle-check' : 'circle-x'} />{' '}
            {r.leichtOk ? 'Alles richtig ausgewählt!' : 'Nicht alles richtig – die Übung kommt morgen zur Wiederholung.'}
          </p>
          <p className="hint">
            <Icon name="list-checks" /> Auswählen ist zum Einstieg. Als „gelöst“ zählt die Übung erst, wenn du die Ergebnisse selbst
            eintippst
            {u.neueZahlen ? ' – am besten mit neuen Zahlen.' : '.'}
          </p>
          <div className="actions">
            <button type="button" className="secondary" onClick={r.leichtNochmal}>
              <Icon name="shuffle" /> Nochmal auswählen
            </button>
            {u.neueZahlen && (
              <button type="button" className="secondary" onClick={r.neueZahlen}>
                <Icon name="dices" /> Neue Zahlen
              </button>
            )}
            {u.neueZahlen && (
              <button
                type="button"
                onClick={() => {
                  r.setLeichtModus(false);
                  r.neueZahlen();
                }}
              >
                <Icon name="pencil" /> Mit neuen Zahlen eintippen
              </button>
            )}
            {next && (
              <Link className="button" to={`/rechnen/${next.id}`}>
                Weiter →
              </Link>
            )}
          </div>
        </div>
      )}

      {r.leer && <p className="card warn">Trag zuerst mindestens ein Ergebnis ein.</p>}
      {ergebnis && (
        <div className={`card ${ergebnis.ok ? 'success' : 'verdict-fail'}`} role="status">
          <div className="verdict-row">
            <p className={`verdict ${ergebnis.ok ? 'ok' : 'bad'}`}>
              <Icon name={ergebnis.ok ? 'circle-check' : 'circle-x'} />{' '}
              {ergebnis.ok
                ? 'Alles richtig!'
                : `Noch nicht: ${ergebnis.richtig} von ${ergebnis.gesamt} ${ergebnis.gesamt === 1 ? 'Ergebnis' : 'Ergebnissen'} richtig.`}
            </p>
            {ergebnis.ok && u.neueZahlen && (
              <button type="button" className="secondary" onClick={r.neueZahlen}>
                <Icon name="dices" /> Nochmal mit neuen Zahlen
              </button>
            )}
            {ergebnis.ok && next && (
              <Link className="button" to={`/rechnen/${next.id}`}>
                Weiter →
              </Link>
            )}
          </div>
        </div>
      )}

      {r.loesungOffen && inst && (
        <section className="card">
          <h2>Lösung</h2>
          <div className="result-scroll re-vergleich">
            <table className="result-table">
              <thead>
                <tr>
                  <th>Ergebnis</th>
                  <th>Deine Eingabe</th>
                  <th>Richtig</th>
                </tr>
              </thead>
              <tbody>
                {inst.eingaben.map((e) => {
                  const eigen = r.antworten[e.id]?.trim();
                  const st = ergebnis?.ergebnisse[e.id]?.status;
                  return (
                    <tr key={e.id}>
                      <td>{e.label}</td>
                      <td className={st === 'richtig' ? 're-ok' : st ? 're-falsch' : 'null'}>
                        {eigen || '–'}
                        {st === 'richtig' ? ' ✓' : st === 'falsch' || st === 'ungueltig' ? ' ✗' : ''}
                      </td>
                      <td className="num">
                        <b>{formatWert(e.erwartet, e)}</b>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {inst.loesung.schritte.length > 0 && (
            <>
              <h3>Rechenweg</h3>
              <Suspense fallback={<p className="muted">Lade Rechenweg …</p>}>
                <Rechenweg schritte={inst.loesung.schritte} />
              </Suspense>
            </>
          )}
          {u.erklaerung && (
            <div className="solution">
              <h4>Erklärung</h4>
              <Markdown math source={false}>
                {u.erklaerung}
              </Markdown>
            </div>
          )}
          <div className="actions">
            {u.neueZahlen && (
              <button type="button" className="secondary" onClick={r.neueZahlen}>
                <Icon name="dices" /> Mit neuen Zahlen üben
              </button>
            )}
            {next && (
              <Link className="button" to={`/rechnen/${next.id}`}>
                Weiter →
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

const BEISPIEL_TITEL: Record<Beispiel['stufe'], string> = {
  voll: 'Beispiel: so rechnest du das',
  luecke: 'Beispiel mit Lücke – den letzten Schritt rechnest du selbst',
  ergebnis: '',
};

/** Ausgeblendetes Lösungsbeispiel vor der Eingabe (ROADMAP 8.6): mit anderen Zahlen oder nur als Formel-Gerüst. */
function BeispielKarte({ b, rechenweg }: { b: Beispiel; rechenweg: boolean }) {
  if (b.stufe === 'ergebnis') {
    return rechenweg ? (
      <p className="hint beispiel-fertig">
        <Icon name="target" /> Ohne Beispiel: Du hast die Übung schon gelöst – jetzt zählt nur dein Ergebnis.
      </p>
    ) : null;
  }
  if (b.quelle === 'keins' || !b.inst) return null;
  const andere = b.quelle === 'andere-zahlen';
  return (
    <details className="card beispiel" open={b.stufe === 'voll'}>
      <summary>
        <Icon name="book-bookmark" /> {BEISPIEL_TITEL[b.stufe]}{' '}
        <span className="muted small">{andere ? '(andere Zahlen)' : '(nur Schritte und Formeln)'}</span>
      </summary>
      {andere ? (
        <div className="beispiel-aufgabe small">
          <Markdown source={false}>{b.inst.aufgabe}</Markdown>
          {b.inst.tabelle && <DatenTabelle t={b.inst.tabelle} />}
        </div>
      ) : (
        <p className="hint">Die Zahlen deiner Aufgabe setzt du selbst ein.</p>
      )}
      <Suspense fallback={<p className="muted">Lade Beispiel …</p>}>
        <Rechenweg schritte={b.inst.loesung.schritte} sicht={b.sicht} />
      </Suspense>
    </details>
  );
}

/** Daten der Aufgabe als Tabelle (Zahlenspalten rechtsbündig). */
function DatenTabelle({ t }: { t: Tabelle }) {
  const zahl = (s: string) => /^[−+-]?[\d.]+(,\d+)?\s*(%|€|h|min)?$/.test(s.trim());
  return (
    <div className="re-daten">
      {t.titel && <p className="small muted">{t.titel}</p>}
      <div className="result-scroll">
        <table className="result-table">
          <thead>
            <tr>
              {t.kopf.map((k, i) => (
                <th key={i}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.zeilen.map((z, i) => (
              <tr key={i}>
                {z.map((c, j) => (
                  <td key={j} className={zahl(c) ? 'num' : undefined}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const STATUS_ICON: Record<EingabeErgebnis['status'], string> = { richtig: '✓', falsch: '✗', leer: '–', ungueltig: '?' };

/** Ein Eingabefeld mit Einheit und Rückmeldung; `kompakt` für Zellen der Eingabetabelle (Meldungen stehen darunter). */
function EingabeFeld(props: {
  e: AufgeloesteEingabe;
  wert: string;
  onChange: (text: string) => void;
  ergebnis?: EingabeErgebnis;
  kompakt?: boolean;
}) {
  const { e, wert, onChange, ergebnis, kompakt } = props;
  const cls = ergebnis ? `re-${ergebnis.status}` : '';
  const placeholder = e.vergleich === 'liste' ? 'z. B. 19; 220 oder keine' : e.vergleich === 'menge' ? 'z. B. A, C, D' : undefined;
  const input = (
    <input
      type="text"
      autoComplete="off"
      spellCheck={false}
      aria-label={e.label}
      aria-invalid={ergebnis && ergebnis.status !== 'richtig' ? true : undefined}
      placeholder={placeholder}
      value={wert}
      onChange={(ev) => onChange(ev.target.value)}
    />
  );
  if (kompakt) {
    return (
      <span className={`re-zelle ${cls}`} title={ergebnis?.meldung}>
        {input}
        {ergebnis && <span className="re-icon">{STATUS_ICON[ergebnis.status]}</span>}
      </span>
    );
  }
  return (
    <div className={`re-feld ${cls}`}>
      <label>
        <span className="re-label">{e.label}</span>
        <span className="re-input">
          {input}
          {e.einheit && <span className="re-einheit">{e.einheit}</span>}
          {ergebnis && <span className="re-icon">{STATUS_ICON[ergebnis.status]}</span>}
        </span>
      </label>
      {ergebnis && <Rueckmeldung r={ergebnis} />}
    </div>
  );
}

function Rueckmeldung({ r }: { r: EingabeErgebnis }) {
  if (!r.meldung && !r.einheitHinweis && r.status !== 'leer') return null;
  return (
    <div className="re-meldung small">
      {r.status === 'leer' && <span className="muted">Noch leer.</span>}
      {r.meldung && <Markdown source={false}>{r.meldung}</Markdown>}
      {r.einheitHinweis && <span className="muted">{r.einheitHinweis}</span>}
    </div>
  );
}

/** Eingaben als Tabelle (z. B. Netzplan); nur Zeilen und Spalten, in denen gefragte Felder stehen. */
function LayoutEingaben(props: {
  layout: EingabeLayout;
  felder: AufgeloesteEingabe[];
  feld: (e: AufgeloesteEingabe, kompakt: boolean) => ReactNode;
}) {
  const { layout, felder, feld } = props;
  const nachId = new Map(felder.map((e) => [e.id, e]));
  const gefragt = (x: string | null) => x !== null && nachId.has(x);
  const spalten = layout.spalten.map((s, i) => ({ s, i })).filter(({ i }) => layout.zeilen.some((z) => gefragt(z.ids[i] ?? null)));
  const zeilen = layout.zeilen.filter((z) => z.ids.some((x) => gefragt(x)));
  const einheit = felder.find((e) => e.einheit)?.einheit;
  return (
    <div className="result-scroll re-layout">
      <table className="result-table">
        <thead>
          <tr>
            <th />
            {spalten.map(({ s, i }) => (
              <th key={i}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z) => (
            <tr key={z.label}>
              <th scope="row">{z.label}</th>
              {spalten.map(({ i }) => {
                const id = z.ids[i] ?? null;
                const e = id === null ? undefined : nachId.get(id);
                return <td key={i}>{e ? feld(e, true) : null}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {einheit && felder.every((e) => !e.einheit || e.einheit === einheit) && (
        <p className="small muted re-layout-einheit">Einheit: {einheit}</p>
      )}
    </div>
  );
}

/** Rückmeldungen zu den Feldern der Eingabetabelle als Liste darunter. */
function Meldungen({ felder, ergebnis }: { felder: AufgeloesteEingabe[]; ergebnis?: Record<string, EingabeErgebnis> }) {
  if (!ergebnis) return null;
  const mit = felder.filter((e) => ergebnis[e.id]?.meldung || ergebnis[e.id]?.einheitHinweis);
  if (!mit.length) return null;
  return (
    <ul className="re-meldungen small">
      {mit.map((e) => (
        <li key={e.id}>
          <b>{e.label}:</b> <Rueckmeldung r={ergebnis[e.id]} />
        </li>
      ))}
    </ul>
  );
}
