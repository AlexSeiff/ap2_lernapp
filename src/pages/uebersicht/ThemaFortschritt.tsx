import { Link } from 'react-router-dom';
import { MiniRing } from '../../components/Ring';
import { topicStats } from '../../lib/stats';

/** Fortschritt je Thema: Klausur, Ø Aufgaben, Karten, Lernziele und Fehlerjournal. */
export function ThemaFortschritt({ stats }: { stats: ReturnType<typeof topicStats> }) {
  return (
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
  );
}
