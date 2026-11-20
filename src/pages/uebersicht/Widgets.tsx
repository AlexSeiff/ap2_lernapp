import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Ringe } from '../../components/Ring';
import { begriffPfad } from '../../lib/begriffe';
import { formatPoints, ihkGrade } from '../../lib/grading';
import { cardPool } from '../../lib/cards';
import { diagrammSummary, diagrammUebungen } from '../../lib/diagramme';
import { kartenstand, STAENDE, STAND_TEXT } from '../../lib/kartenstand';
import { markierteIds } from '../../lib/markiert';
import { rechenSummary } from '../../lib/rechnen';
import { sqlSummary } from '../../lib/sql';
import { useDetailsWennDa } from '../../lib/details';
import { useStartStore } from '../../lib/store';
import { begriffDesTages, faellig, klausurVerlauf } from '../../lib/uebersicht';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../lib/icons';
import { Sparkline } from './Verlauf';

export function FaelligWidget({ today }: { today: string }) {
  const { content, progress } = useStartStore();
  const f = faellig(content, progress, today);
  const zeilen: { to: string; icon: IconName; label: string; anzahl: number; zusatz?: string }[] = [
    { to: '/fehlerjournal', icon: 'notebook-pen', label: 'Wiederholungen fällig', anzahl: f.journal },
    {
      to: '/karteikarten',
      icon: 'layers',
      label: 'Karteikarten fällig',
      anzahl: f.karten,
      zusatz: f.kartenNeu ? `${f.kartenNeu} neu` : undefined,
    },
    { to: '/sql/uebungen?status=faellig', icon: 'database', label: 'SQL-Wiederholungen', anzahl: f.sql },
    { to: '/rechnen?status=faellig', icon: 'calculator', label: 'Rechen-Wiederholungen', anzahl: f.rechnen },
    { to: '/diagramme?status=faellig', icon: 'workflow', label: 'Diagramm-Wiederholungen', anzahl: f.diagramme },
  ];
  return (
    <section className="widget farbe-orange">
      <h2>
        <Icon name="clock" /> Fällig
      </h2>
      <ul className="w-zeilen">
        {zeilen.map((z) => (
          <li key={z.to}>
            <Link to={z.to}>
              <Icon name={z.icon} />
              <span className="w-zeile-text">
                {z.label}
                {z.zusatz && <span className="muted small"> · {z.zusatz}</span>}
              </span>
              <span className={`w-zahl${z.anzahl ? '' : ' muted'}`}>{z.anzahl}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** SQL-, Rechen- und Diagramm-Übungen: gelöst und fällige Wiederholungen. */
export function UebungenWidget({ today }: { today: string }) {
  const { content, progress } = useStartStore();
  const arten = [
    {
      to: '/sql/uebungen',
      label: 'SQL-Übungen',
      s: sqlSummary(
        progress,
        content.sqlExercises.map((e) => e.id),
        today,
      ),
    },
    {
      to: '/rechnen',
      label: 'Rechenübungen',
      s: rechenSummary(
        progress,
        content.rechenUebungen.map((u) => u.id),
        today,
      ),
    },
    {
      to: '/diagramme',
      label: 'Diagramm-Übungen',
      s: diagrammSummary(
        progress,
        diagrammUebungen(content).map((u) => u.id),
        today,
      ),
    },
  ].filter((a) => a.s.total > 0);
  if (!arten.length) return null;
  return (
    <section className="widget farbe-teal">
      <h2>
        <Icon name="file-pen-line" /> Übungen
      </h2>
      <ul className="w-zeilen">
        {arten.map((a) => (
          <li key={a.to}>
            <Link to={a.to}>
              <Ringe
                werte={[{ wert: a.s.solved / a.s.total, klasse: 'ring-uebungen' }]}
                groesse={28}
                label={`${a.label}: ${Math.round((a.s.solved / a.s.total) * 100)} % gelöst`}
              />
              <span className="w-zeile-text">
                {a.label} gelöst
                {a.s.due > 0 && (
                  <span className="muted small">
                    {' '}
                    · {a.s.due} {a.s.due === 1 ? 'Wiederholung' : 'Wiederholungen'} fällig
                  </span>
                )}
              </span>
              <span className="w-zahl">
                {a.s.solved}/{a.s.total}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Kartenstand: wie viele Karten zuletzt gewusst, unsicher oder nicht gewusst waren – mit Sprung auf die Seite. */
export function KartenstandWidget() {
  const { content, progress } = useStartStore();
  const pool = useMemo(() => cardPool(content.flashcards, progress.settings), [content, progress.settings]);
  const stand = kartenstand(pool, progress);
  return (
    <section className="widget farbe-green">
      <h2>
        <Icon name="chart-column" /> Kartenstand
      </h2>
      {stand.gesamt > stand.neu ? (
        <>
          <div className="verteilung-balken" aria-hidden="true">
            {STAENDE.map(
              (s) => stand.gruppen[s].length > 0 && <span key={s} className={`vb-${s}`} style={{ flexGrow: stand.gruppen[s].length }} />,
            )}
            {stand.neu > 0 && <span className="vb-neu" style={{ flexGrow: stand.neu }} />}
          </div>
          <ul className="stand-zahlen">
            {STAENDE.map((s) => (
              <li key={s}>
                <Link to={`/karteikarten/stand?stand=${s}`} className={`stand-${s}`}>
                  <b>{stand.gruppen[s].length}</b>
                  <span>{STAND_TEXT[s].kurz}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="hint">
            {stand.neu} {stand.neu === 1 ? 'Karte' : 'Karten'} noch neu · <Link to="/karteikarten/stand">Zum Kartenstand →</Link>
          </p>
        </>
      ) : (
        <p className="hint">
          Noch keine Karte bewertet. <Link to="/karteikarten">Zu den Karteikarten →</Link>
        </p>
      )}
    </section>
  );
}

/** Markierte Karten (Umsetzungsplan Phase 4): Anzahl, die ersten Fragen und Start. */
export function MarkiertWidget() {
  const { content, progress } = useStartStore();
  const markiert = markierteIds(progress);
  const karten = cardPool(content.flashcards, progress.settings).filter((c) => markiert.has(c.id));
  // Die Fragen stehen in details.json – sie erscheinen, sobald es geladen ist.
  const voll = useDetailsWennDa();
  const fragen = karten.slice(0, 3).map((c) => ({ id: c.id, frage: voll?.flashcards.find((v) => v.id === c.id)?.question }));
  return (
    <section className="widget farbe-amber">
      <h2>
        <Icon name="star" /> Markiert
      </h2>
      <Link to="/karteikarten?markiert=1" className="kpi w-innen" title="Mit dem Stern markierte Karteikarten lernen">
        <span className="kpi-value">{karten.length}</span>
        <span className="kpi-label">{karten.length === 1 ? 'markierte Karte lernen →' : 'markierte Karten lernen →'}</span>
      </Link>
      {karten.length > 0 ? (
        <ul className="plain w-liste">
          {fragen.map(
            (c) =>
              c.frage && (
                <li key={c.id} className="small">
                  {c.frage}
                </li>
              ),
          )}
          {karten.length > 3 && (
            <li className="small">
              <Link to="/karteikarten?markiert=1&blaettern=1">Alle {karten.length} durchblättern →</Link>
            </li>
          )}
        </ul>
      ) : (
        <p className="hint">Mit dem Stern (Taste M) markierst du Karten, die du dir merken willst.</p>
      )}
    </section>
  );
}

/** Begriff des Tages: eine Begriffsseite, fest je Tag. */
export function BegriffWidget({ today }: { today: string }) {
  // Braucht die Begriffskarten mit Text (details.json) – das Widget erscheint, sobald sie geladen sind.
  const voll = useDetailsWennDa();
  const tag = useMemo(() => voll && begriffDesTages(voll, today), [voll, today]);
  if (!tag) return null;
  return (
    <section className="widget farbe-sky">
      <h2>
        <Icon name="lightbulb" /> Begriff des Tages
      </h2>
      <h3 className="w-begriff">
        <Link to={begriffPfad(tag.begriff.id)}>{tag.begriff.begriff}</Link>
      </h3>
      {tag.karte?.answer && <p className="w-definition">{tag.karte.answer}</p>}
      <p className="hint">
        <Link to={begriffPfad(tag.begriff.id)}>Zur Begriffsseite →</Link>
      </p>
    </section>
  );
}

/** Klausurverlauf: Durchschnitt mit IHK-Note, Verlauf aller Übungsklausuren und die letzten fünf. */
export function KlausurWidget() {
  const { content, progress } = useStartStore();
  const { laeufe, schnitt } = klausurVerlauf(content, progress);
  return (
    <section className="widget farbe-green">
      <h2>
        <Icon name="timer" /> Übungsklausuren
      </h2>
      {schnitt === undefined ? (
        <>
          <p className="muted">Noch keine Übungsklausur abgeschlossen.</p>
          <p>
            <Link to="/klausur">Übungsklausur starten →</Link>
          </p>
        </>
      ) : (
        <>
          <div className="klausur-kopf">
            <span className="kpi-value">{Math.round(schnitt)} %</span>
            <span className="kpi-label">
              Ø Übungsklausuren · Note {ihkGrade(schnitt).note}
              <br />
              {laeufe.length} {laeufe.length === 1 ? 'Klausur' : 'Klausuren'}
            </span>
            {laeufe.length > 1 && <Sparkline values={laeufe.map((l) => l.pct)} />}
          </div>
          <h3 className="w-unter">Letzte Klausuren</h3>
          <ul className="plain">
            {laeufe
              .slice(-5)
              .reverse()
              .map((l) => (
                <li key={l.id} className="small">
                  {new Date(l.datum).toLocaleDateString('de-DE')} · {l.name} ·{' '}
                  <b>
                    {formatPoints(l.punkte)} / {formatPoints(l.max)} P
                  </b>{' '}
                  · Note {ihkGrade(l.pct).note}
                </li>
              ))}
          </ul>
        </>
      )}
    </section>
  );
}
