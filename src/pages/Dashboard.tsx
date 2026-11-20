import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FehlergrundKarte } from '../components/FehlergrundKarte';
import { Welcome } from '../components/Welcome';
import { Icon } from '../components/Icon';
import { localDate } from '../lib/progress';
import { istAusgeblendet } from '../lib/settings';
import { examTrends, topicStats } from '../lib/stats';
import { useStartStore } from '../lib/store';
import { BereichRinge } from './uebersicht/BereichRinge';
import { BackupBanner, KalibrierungKarte } from './uebersicht/Hinweise';
import { KlausurTrend } from './uebersicht/KlausurTrend';
import { Countdown, Lernserie } from './uebersicht/RandNotizen';
import { ThemaFortschritt } from './uebersicht/ThemaFortschritt';
import { BegriffWidget, FaelligWidget, KartenstandWidget, KlausurWidget, MarkiertWidget, UebungenWidget } from './uebersicht/Widgets';
import { Weiterlernen } from './uebersicht/Weiterlernen';

/** Merkt, ob „Mehr“ auf der Übersicht aufgeklappt ist (pro Gerät). */
const MEHR_SPEICHER = 'ap2-uebersicht-mehr';

const pct = (v?: number) => (v === undefined ? '–' : `${Math.round(v)} %`);

export function Dashboard() {
  const { firstVisit } = useStartStore();
  return firstVisit ? <Welcome /> : <Uebersicht />;
}

/** Persönliches Lernjournal: Tagesplan, Randnotizen und Fortschritt auf einer Notizbuchseite. */
function Uebersicht() {
  const { content, progress } = useStartStore();
  const today = localDate();
  const stats = topicStats(content, progress);
  const trends = examTrends(content, progress);
  const weakest = stats
    .filter((s) => (s.avgTaskPct !== undefined || s.lastExam !== undefined) && !istAusgeblendet(progress.settings, s.topic.id))
    .sort((a, b) => (a.lastExam ?? a.avgTaskPct!) - (b.lastExam ?? b.avgTaskPct!))
    .slice(0, 3);
  const offeneJournal = Object.values(progress.journal).filter((j) => !j.resolvedAt).length;
  const [mehrOffen, setMehrOffen] = useState(() => {
    try {
      return localStorage.getItem(MEHR_SPEICHER) === '1';
    } catch {
      return false;
    }
  });

  return (
    <div className="page dashboard-page">
      <h1>Übersicht</h1>
      <p className="lead">Dein Lernplan und dein Fortschritt auf einen Blick.</p>
      <BackupBanner />
      {progress.settings.leichtModus && (
        <p className="card info" role="note">
          <Icon name="list-checks" /> Leicht-Modus ist zum Einstieg – für die Prüfung frei antworten. Karten kommen mit 4 Antworten
          höchstens bis Fach 2; Fach 3–5 erreichst du nur mit „Aufdecken“.
        </p>
      )}
      {/* Wie im Heft: links der Text auf dem Karo, rechts hinter der roten Randlinie die Haftnotizen. */}
      <div className="spalten">
        <div className="raster">
          <Weiterlernen />
          <BereichRinge />
          <KartenstandWidget />
          <FaelligWidget today={today} />
          <UebungenWidget today={today} />
        </div>
        <aside className="rand" aria-label="Prüfungstermin und Lernserie">
          <Countdown />
          <Lernserie />
        </aside>
      </div>
      <details
        className="mehr-widgets"
        open={mehrOffen}
        onToggle={(e) => {
          const offen = e.currentTarget.open;
          setMehrOffen(offen);
          try {
            localStorage.setItem(MEHR_SPEICHER, offen ? '1' : '0');
          } catch {
            /* ohne Speicher gilt die Wahl nur bis zum Neuladen */
          }
        }}
      >
        <summary>Mehr: Markiertes, Begriff des Tages, Klausuren, schwächste Themen</summary>
        <div className="widgets">
          <MarkiertWidget />
          <BegriffWidget today={today} />
          <KlausurWidget />
          {!!weakest.length && (
            <section className="widget farbe-red">
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
      </details>

      <ThemaFortschritt stats={stats} />

      {!!trends.length && <KlausurTrend trends={trends} />}
    </div>
  );
}
