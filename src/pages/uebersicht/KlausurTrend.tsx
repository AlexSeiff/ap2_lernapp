import { Link } from 'react-router-dom';
import { MiniRing } from '../../components/Ring';
import { examTrends } from '../../lib/stats';
import { Delta, Sparkline } from './Verlauf';

/** Klausur-Trend je Thema: Verlauf, letzte Klausur und Veränderung. */
export function KlausurTrend({ trends }: { trends: ReturnType<typeof examTrends> }) {
  return (
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
  );
}
