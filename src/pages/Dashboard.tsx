import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FehlergrundKarte } from '../components/FehlergrundKarte';
import { MiniRing, Ringe } from '../components/Ring';
import { Welcome } from '../components/Welcome';
import { useBackupDownload } from '../hooks/useBackupDownload';
import { useHeuteSitzung } from '../hooks/useHeute';
import { IS_STATIC } from '../lib/api';
import { backupReminder } from '../lib/backupReminder';
import { begriffPfad } from '../lib/begriffe';
import { formatPoints, ihkGrade } from '../lib/grading';
import { cardPool } from '../lib/cards';
import { diagrammSummary, diagrammUebungen } from '../lib/diagramme';
import { istFertig } from '../lib/heuteSitzung';
import { kalibrierung } from '../lib/kalibrierung';
import { holeLeseStelle } from '../lib/leseStelle';
import { istAusgeblendet } from '../lib/settings';
import { markierteIds } from '../lib/markiert';
import { localDate } from '../lib/progress';
import { rechenSummary } from '../lib/rechnen';
import { sqlSummary } from '../lib/sql';
import { daysUntilExam, examTrends, formatIsoDate, studyStreak, topicStats } from '../lib/stats';
import { useStore } from '../lib/store';
import { begriffDesTages, bereichFortschritt, faellig, klausurVerlauf, quote, type Anteil } from '../lib/uebersicht';
import { HEUTE_MINUTEN, SICHER_RICHTIG_AB } from '../../shared/config';
import { Icon } from '../components/Icon';
import type { IconName } from '../lib/icons';

const pct = (v?: number) => (v === undefined ? '–' : `${Math.round(v)} %`);
const prozent = (a: Anteil) => `${Math.round(quote(a) * 100)} %`;

export function Dashboard() {
  const { firstVisit } = useStore();
  return firstVisit ? <Welcome /> : <Uebersicht />;
}

/**
 * Übersicht im Stil von iOS-Widgets (Umsetzungsplan Phase 9): mobil zwei Spalten (kleine Widgets halb, alle anderen ganz breit),
 * ab 900 px vier Spalten (klein = 1, sonst 2). Darunter die Tabellen je Thema in voller Breite.
 */
function Uebersicht() {
  const { content, progress } = useStore();
  const today = localDate();
  const stats = topicStats(content, progress);
  const trends = examTrends(content, progress);
  const weakest = stats
    .filter((s) => (s.avgTaskPct !== undefined || s.lastExam !== undefined) && !istAusgeblendet(progress.settings, s.topic.id))
    .sort((a, b) => (a.lastExam ?? a.avgTaskPct!) - (b.lastExam ?? b.avgTaskPct!))
    .slice(0, 3);
  const offeneJournal = Object.values(progress.journal).filter((j) => !j.resolvedAt).length;

  return (
    <div className="page">
      <h1>Übersicht</h1>
      <BackupBanner />
      {progress.settings.leichtModus && (
        <p className="card info" role="note">
          <Icon name="list-checks" /> Leicht-Modus ist zum Einstieg – für die Prüfung frei antworten. Karten kommen mit 4 Antworten
          höchstens bis Fach 2; Fach 3–5 erreichst du nur mit „Aufdecken“.
        </p>
      )}
      <div className="widgets">
        <Weiterlernen />
        <Countdown />
        <Lernserie />
        <BereichRinge />
        <FaelligWidget today={today} />
        <UebungenWidget today={today} />
        <MarkiertWidget />
        <BegriffWidget today={today} />
        <KlausurWidget />
        {!!weakest.length && (
          <section className="widget">
            <h2>
              <Icon name="trending-down" /> Schwächste Themen
            </h2>
            <ul className="plain">
              {weakest.map((s) => (
                <li key={s.topic.id}>
                  <Link to={`/lernen/${s.topic.id}`}>{s.topic.title}</Link> – {pct(s.lastExam ?? s.avgTaskPct)}{' '}
                  <Link className="small" to={`/aufgaben?thema=${s.topic.id}`}>
                    Aufgaben üben
                  </Link>
                </li>
              ))}
            </ul>
            {offeneJournal > 0 && (
              <p className="hint">
                <Link to="/fehlerjournal">
                  {offeneJournal} {offeneJournal === 1 ? 'Aufgabe' : 'Aufgaben'} im Fehlerjournal →
                </Link>
              </p>
            )}
          </section>
        )}
        <FehlergrundKarte />
        <KalibrierungKarte />
      </div>

      <section className="card">
        <h2>Fortschritt je Thema</h2>
        <ul className="thema-fortschritt">
          <li className="tf-kopf" aria-hidden="true">
            <span>Thema</span>
            <span>Klausur (bestes)</span>
            <span>Ø Aufgaben</span>
            <span>Karten sicher</span>
            <span>Lernziele</span>
            <span>Fehlerjournal</span>
          </li>
          {stats.map((s) => (
            <li key={s.topic.id}>
              <Link className="tf-titel" to={`/lernen/${s.topic.id}`}>
                {s.topic.id === '00' ? '＋' : s.topic.number}. {s.topic.title}
              </Link>
              <span className="tf-wert">
                <MiniRing pct={s.bestExam} titel="Klausur (bestes)" />
                <span className="tf-label">Klausur</span>
              </span>
              <span className="tf-wert">
                <span>
                  <MiniRing pct={s.avgTaskPct} titel="Ø Aufgaben" />
                  {s.attempts > 0 && <span className="muted small"> ({s.attempts})</span>}
                </span>
                <span className="tf-label">Ø Aufgaben</span>
              </span>
              <span className="tf-wert">
                <span>
                  {s.cardsKnown}/{s.cardsTotal}
                </span>
                <span className="tf-label">Karten sicher</span>
              </span>
              <span className="tf-wert">
                <span>
                  {s.lernzieleDone}/{s.topic.lernziele.length}
                </span>
                <span className="tf-label">Lernziele</span>
              </span>
              <span className="tf-wert">
                <span>{s.openJournal || '–'}</span>
                <span className="tf-label">Fehlerjournal</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="hint">
          „Ø Aufgaben" zählt jeweils deinen letzten Versuch je Aufgabe. Karten gelten ab Fach 3 als sicher. Ziel für die 1: ≥ 92 %.
        </p>
      </section>

      {!!trends.length && (
        <section className="card">
          <h2>Klausur-Trend je Thema</h2>
          <div className="table-wrap">
            <table className="stats">
              <thead>
                <tr>
                  <th>Thema</th>
                  <th>Verlauf</th>
                  <th>Letzte</th>
                  <th>Veränderung</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((t) => (
                  <tr key={t.topic.id}>
                    <td>
                      <Link to={`/klausur/${t.topic.id}`}>{t.topic.title}</Link>
                      <span className="muted small"> ({t.runs.length}×)</span>
                    </td>
                    <td>
                      <Sparkline values={t.runs.map((r) => r.pct)} />
                    </td>
                    <td>
                      <MiniRing pct={t.latest} titel="Letzte Klausur" />
                    </td>
                    <td>
                      <Delta value={t.delta} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hint">Veränderung: letzte gegenüber vorletzter Klausur zum selben Thema, in Prozentpunkten.</p>
        </section>
      )}
    </div>
  );
}

/** „Weiterlernen“: Einstieg in „Heute lernen“ (ROADMAP 8.1; läuft schon eine Runde, geht es dort weiter) und die letzte Lesestelle. */
function Weiterlernen() {
  const { content, progress } = useStore();
  const sitzung = useHeuteSitzung();
  const laeuft = sitzung && !istFertig(sitzung);
  const [stelle] = useState(holeLeseStelle);
  const topic = stelle && !istAusgeblendet(progress.settings, stelle.topicId) && content.topics.find((t) => t.id === stelle.topicId);
  const abschnitt = topic && topic.sections.find((s) => s.id === stelle.sectionId);
  return (
    <section className="widget widget-weiter">
      <h2>
        <Icon name="play" /> Weiterlernen
      </h2>
      <div className="actions heute-start">
        <Link className="button" to="/heute">
          <Icon name="play" /> {laeuft ? `Heute lernen fortsetzen (${sitzung.index + 1}/${sitzung.items.length})` : 'Heute lernen'}
        </Link>
        <span className="muted">
          {sitzung && !laeuft && sitzung.items.length > 0
            ? '✓ Heute schon eine Runde geschafft.'
            : `Gemischte Runde, etwa ${HEUTE_MINUTEN} Minuten – aus dem, was fällig ist.`}
        </span>
      </div>
      {topic && abschnitt ? (
        <p className="weiterlesen">
          <Link to={`/lernen/${topic.id}?stelle=${encodeURIComponent(abschnitt.id)}`}>
            <Icon name="book-open" /> Weiterlesen: {topic.id === '00' ? 'Zusatz' : `DD ${topic.number}`} · {abschnitt.title}
          </Link>
        </p>
      ) : (
        <p className="weiterlesen">
          <Link to="/lernen">
            <Icon name="book-open" /> Lernblätter ansehen
          </Link>
        </p>
      )}
    </section>
  );
}

/** Countdown bis zum eigenen Prüfungstermin; ohne Termin ein Link zum Eintragen. */
function Countdown() {
  const { progress } = useStore();
  const { examDate } = progress.settings;
  const days = daysUntilExam(examDate);
  if (days === undefined || !examDate)
    return (
      <Link to="/einstellungen" className="widget w-klein kpi">
        <span className="w-titel">Prüfung</span>
        <span className="kpi-value">
          <Icon name="calendar" />
        </span>
        <span className="kpi-label">Prüfungstermin eintragen →</span>
      </Link>
    );
  return (
    <Link to="/einstellungen" className="widget w-klein kpi" title="Prüfungstermin ändern">
      <span className="w-titel">Prüfung</span>
      <span className="kpi-value">{days > 0 ? days : days === 0 ? 'Heute!' : '–'}</span>
      <span className="kpi-label">
        {days > 1
          ? `Tage bis zur Prüfung (${formatIsoDate(examDate)})`
          : days === 1
            ? `Tag bis zur Prüfung (${formatIsoDate(examDate)})`
            : days === 0
              ? 'Prüfungstag – viel Erfolg!'
              : `Prüfung am ${formatIsoDate(examDate)} vorbei · neuen Termin eintragen →`}
      </span>
    </Link>
  );
}

function Lernserie() {
  const { progress } = useStore();
  const streak = studyStreak(progress);
  return (
    <div className="widget w-klein kpi" title="Tage in Folge mit Aufgaben, Klausuren, Karteikarten, SQL-, Rechen- oder Diagramm-Übungen">
      <span className="w-titel">Lernserie</span>
      <span className="kpi-value">
        {streak.current > 0 && <Icon name="flame" />}
        {streak.current} {streak.current === 1 ? 'Tag' : 'Tage'}
      </span>
      <span className="kpi-label">
        {streak.current > 0 && !streak.today ? 'heute noch lernen, sonst reißt sie' : streak.today ? 'heute schon gelernt' : 'in Folge'}
        {streak.longest > streak.current && ` · Rekord ${streak.longest}`}
      </span>
    </div>
  );
}

/** Fortschrittsringe je Prüfungsbereich: außen Karten sicher, innen Übungen gelöst. */
function BereichRinge() {
  const { content, progress } = useStore();
  const bereiche = bereichFortschritt(content, progress);
  return (
    <section className="widget">
      <h2>
        <Icon name="target" /> Prüfungsbereiche
      </h2>
      <ul className="bereich-ringe">
        {bereiche.map((b) => (
          <li key={b.bereich.id}>
            <Ringe
              werte={[
                { wert: quote(b.karten), klasse: 'ring-karten' },
                { wert: quote(b.uebungen), klasse: 'ring-uebungen' },
              ]}
              label={`${b.bereich.titel}: Karten sicher ${prozent(b.karten)}, Übungen gelöst ${prozent(b.uebungen)}`}
            />
            <b>{b.bereich.titel}</b>
            <span className="small" aria-hidden="true">
              <span className="punkt ring-karten" /> {b.karten.erreicht}/{b.karten.gesamt} Karten
            </span>
            <span className="small" aria-hidden="true">
              <span className="punkt ring-uebungen" /> {b.uebungen.erreicht}/{b.uebungen.gesamt} Übungen
            </span>
          </li>
        ))}
      </ul>
      <p className="hint">
        Karten ab Fach 3; Übungen: Einzelaufgaben mit mindestens {Math.round(SICHER_RICHTIG_AB * 100)} % der Punkte im letzten Versuch und
        gelöste SQL-, Rechen- und Diagramm-Übungen.
      </p>
    </section>
  );
}

function FaelligWidget({ today }: { today: string }) {
  const { content, progress } = useStore();
  const f = faellig(content, progress, today);
  const zeilen: { to: string; icon: IconName; label: string; anzahl: number }[] = [
    { to: '/fehlerjournal', icon: 'notebook-pen', label: 'Wiederholungen fällig', anzahl: f.journal },
    { to: '/karteikarten', icon: 'layers', label: 'Karteikarten fällig', anzahl: f.karten },
    { to: '/sql/uebungen?status=faellig', icon: 'database', label: 'SQL-Wiederholungen', anzahl: f.sql },
    { to: '/rechnen?status=faellig', icon: 'calculator', label: 'Rechen-Wiederholungen', anzahl: f.rechnen },
    { to: '/diagramme?status=faellig', icon: 'workflow', label: 'Diagramm-Wiederholungen', anzahl: f.diagramme },
  ];
  return (
    <section className="widget">
      <h2>
        <Icon name="clock" /> Fällig
      </h2>
      <ul className="w-zeilen">
        {zeilen.map((z) => (
          <li key={z.to}>
            <Link to={z.to}>
              <Icon name={z.icon} />
              <span className="w-zeile-text">{z.label}</span>
              <span className={`w-zahl${z.anzahl ? '' : ' muted'}`}>{z.anzahl}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** SQL-, Rechen- und Diagramm-Übungen: gelöst und fällige Wiederholungen. */
function UebungenWidget({ today }: { today: string }) {
  const { content, progress } = useStore();
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
    <section className="widget">
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

/** Markierte Karten (Umsetzungsplan Phase 4): Anzahl, die ersten Fragen und Start. */
function MarkiertWidget() {
  const { content, progress } = useStore();
  const markiert = markierteIds(progress);
  const karten = cardPool(content.flashcards, progress.settings).filter((c) => markiert.has(c.id));
  return (
    <section className="widget">
      <h2>
        <Icon name="star" /> Markiert
      </h2>
      <Link to="/karteikarten?markiert=1" className="kpi w-innen" title="Mit dem Stern markierte Karteikarten lernen">
        <span className="kpi-value">{karten.length}</span>
        <span className="kpi-label">{karten.length === 1 ? 'markierte Karte lernen →' : 'markierte Karten lernen →'}</span>
      </Link>
      {karten.length > 0 ? (
        <ul className="plain w-liste">
          {karten.slice(0, 3).map((c) => (
            <li key={c.id} className="small">
              {c.question}
            </li>
          ))}
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
function BegriffWidget({ today }: { today: string }) {
  const { content } = useStore();
  const tag = useMemo(() => begriffDesTages(content, today), [content, today]);
  if (!tag) return null;
  return (
    <section className="widget">
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
function KlausurWidget() {
  const { content, progress } = useStore();
  const { laeufe, schnitt } = klausurVerlauf(content, progress);
  return (
    <section className="widget">
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

/** Mini-Verlauf der Klausurergebnisse (0–100 %) als Inline-SVG; die gestrichelte Linie markiert 50 % (bestanden). */
function Sparkline({ values }: { values: number[] }) {
  const w = 110;
  const h = 26;
  const pad = 3;
  const x = (i: number) => (values.length === 1 ? w / 2 : pad + (i * (w - 2 * pad)) / (values.length - 1));
  const y = (v: number) => pad + ((100 - Math.max(0, Math.min(100, v))) * (h - 2 * pad)) / 100;
  const label = `Klausurergebnisse: ${values.map((v) => `${Math.round(v)} %`).join(', ')}`;
  return (
    <svg className="sparkline" width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
      <title>{label}</title>
      <line className="sparkline-pass" x1={0} x2={w} y1={y(50)} y2={y(50)} />
      {values.length > 1 && <polyline points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />}
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 3 : 2} />
      ))}
    </svg>
  );
}

function Delta({ value }: { value?: number }) {
  if (value === undefined) return <span className="muted small">erst ab 2 Klausuren</span>;
  const rounded = Math.round(value);
  if (rounded === 0) return <span className="muted">± 0</span>;
  return (
    <span className={rounded > 0 ? 'ok' : 'bad'}>
      {rounded > 0 ? '▲ +' : '▼ −'}
      {Math.abs(rounded)} %-Pkt.
    </span>
  );
}

/** Selbsteinschätzung (ROADMAP 8.3): Wie oft lagst du bei „sicher“, „teils“, „unsicher“ richtig? */
function KalibrierungKarte() {
  const { progress } = useStore();
  const k = kalibrierung(progress.attempts);
  if (!k.anzahl) return null;
  const ab = Math.round(SICHER_RICHTIG_AB * 100);
  return (
    <section className="card">
      <h2>
        <Icon name="target" /> Selbsteinschätzung
      </h2>
      <ul className="plain">
        {k.stufen
          .filter((s) => s.anzahl > 0)
          .reverse()
          .map((s) => (
            <li key={s.stufe}>
              Bei „{s.kurz}“ lagst du in <b>{Math.round(s.quote!)} %</b> richtig{' '}
              <span className="muted small">
                ({s.richtig} von {s.anzahl} {s.anzahl === 1 ? 'Aufgabe' : 'Aufgaben'} · Ø {Math.round(s.schnitt!)} % der Punkte)
              </span>
            </li>
          ))}
      </ul>
      {k.hinweis === 'zu-sicher' && (
        <p className="bad">
          <Icon name="triangle-alert" /> Vorsicht, falsche Sicherheit: Prüf bei „sicher“ genauer, ob du den Operator und alle Teilfragen
          beantwortet hast.
        </p>
      )}
      {k.hinweis === 'unterschaetzt' && (
        <p className="ok">
          <Icon name="lightbulb" /> Du kannst mehr, als du denkst – auch bei „unsicher“ lagst du meist richtig.
        </p>
      )}
      {k.hinweis === 'passt' && (
        <p className="ok">
          <Icon name="thumbs-up" /> Deine Einschätzung passt gut zu deinen Ergebnissen.
        </p>
      )}
      <p className="hint">
        „Richtig“ heißt mindestens {ab} % der Punkte. Gezählt werden Aufgaben, bei denen du vor dem Abgeben „Wie sicher bist du?“
        beantwortet hast.
      </p>
    </section>
  );
}

/** Pages-Version: Erinnerung, eine Sicherung herunterzuladen (nach settings.backupReminderDays mit mindestens einem Lerntag seitdem). */
function BackupBanner() {
  const { progress } = useStore();
  const downloadBackup = useBackupDownload();
  const [later, setLater] = useState(false);
  const reminder = IS_STATIC && !later ? backupReminder(progress) : undefined;
  if (!reminder) return null;
  return (
    <div className="card warn actions" role="status">
      <span>
        <Icon name="save" />{' '}
        {reminder.lastDownload ? `Letzte Sicherung vor ${reminder.daysSince} Tagen` : 'Du hast noch keine Sicherung heruntergeladen'} – dein
        Fortschritt liegt nur in diesem Browser.
      </span>
      <button type="button" onClick={downloadBackup}>
        <Icon name="download" /> jetzt herunterladen
      </button>
      <button type="button" className="ghost" onClick={() => setLater(true)}>
        Später
      </button>
    </div>
  );
}
