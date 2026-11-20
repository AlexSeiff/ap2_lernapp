import { Link, useNavigate } from 'react-router-dom';
import { examMinutes } from '../../lib/examTimer';
import { ihkGrade, percent } from '../../lib/grading';
import { istMischId, klausurName, MISCH_BEREICHE, type MischBereich, mischId } from '../../lib/mischKlausur';
import { useStore } from '../../lib/store';
import { neuerSeed } from '../../rechnen/zufall';
import { Icon } from '../../components/Icon';

/** Link zu einer neu gemischten Probeklausur (neuer Seed bei jedem Klick). */
export function useNeueMischKlausur() {
  const navigate = useNavigate();
  return (bereich: MischBereich) => navigate(`/klausur/${mischId(bereich, neuerSeed())}`);
}

export function KlausurAuswahl() {
  const { content, progress } = useStore();
  const neueMisch = useNeueMischKlausur();
  const navigate = useNavigate();
  // Neu gemischt zum Ausdrucken (Umsetzungsplan Phase 6): gleicher Seed → Aufgaben- und Lösungsblatt passen zusammen.
  const druckeMisch = () => navigate(`/druck?misch=${mischId('gemischt', neuerSeed())}&art=aufgaben`);
  const active = progress.activeExam;
  const activeKnown = active && (istMischId(active.topicId) || content.topics.some((t) => t.id === active.topicId));
  const mischRuns = progress.exams.filter((e) => istMischId(e.topicId) && e.total !== undefined && e.max > 0);
  const mischBest = mischRuns.length ? Math.max(...mischRuns.map((e) => percent(e.total!, e.max))) : undefined;
  return (
    <div className="page">
      <h1>Übungsklausur</h1>
      <p className="lead">
        100 Punkte, ohne Unterlagen – wie in der IHK-Prüfung: Fachklausuren 90 Minuten, WiSo 60 Minuten. Die Musterlösungen bleiben
        gesperrt, bis du abgibst.
      </p>
      {active && activeKnown && (
        <div className="card warn">
          Laufende Klausur: <b>{klausurName(content, active.topicId)}</b> (
          {active.submittedAt ? 'abgegeben, Bewertung offen' : 'in Bearbeitung'}) –{' '}
          <Link to={`/klausur/${active.topicId}`}>fortsetzen →</Link>
        </div>
      )}
      <section className="card misch-start">
        <h2>
          <Icon name="dices" /> Gemischte Probeklausur
        </h2>
        <p>
          Wie die echte AP2: Aufgaben aus mehreren Deep Dives, gewichtet nach der Themenliste – 90 Minuten, 100 Punkte. Jedes Mal neu
          gemischt.
          {mischRuns.length > 0 &&
            ` Bisher ${mischRuns.length}× geschrieben · bestes ${Math.round(mischBest!)} % (Note ${ihkGrade(mischBest!).note}).`}
        </p>
        <div className="actions">
          {MISCH_BEREICHE.map((b) => (
            <button key={b.id} type="button" className={b.id === 'gemischt' ? '' : 'secondary'} onClick={() => neueMisch(b.id)}>
              <Icon name="dices" /> {b.id === 'gemischt' ? 'Gemischte Probeklausur' : b.kurz}
            </button>
          ))}
          <button
            type="button"
            className="secondary"
            onClick={druckeMisch}
            title="Neu gemischte Probeklausur mit Deckblatt zum Ausdrucken; das passende Lösungsblatt ist einen Klick entfernt"
          >
            <Icon name="printer" /> Drucken
          </button>
        </div>
      </section>
      <h2>Je Deep Dive</h2>
      <div className="grid">
        {content.topics
          .filter((t) => t.exam)
          .map((t) => {
            const runs = progress.exams.filter((e) => e.topicId === t.id && e.total !== undefined);
            const best = runs.length ? Math.max(...runs.map((e) => percent(e.total!, e.max))) : undefined;
            return (
              <Link key={t.id} to={`/klausur/${t.id}`} className="tile">
                <span className="tile-num">{t.id === '00' ? '＋' : t.number}</span>
                <span className="tile-title">{t.title}</span>
                <span className="tile-meta">
                  {examMinutes(t.exam)} min ·{' '}
                  {runs.length
                    ? `${runs.length}× geschrieben · bestes ${Math.round(best!)} % (Note ${ihkGrade(best!).note})`
                    : 'noch nicht geschrieben'}
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
