import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IS_STATIC } from '../lib/api';
import { difficulty, formatPoints, percent } from '../lib/grading';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icon';

export function Aufgaben() {
  const { content, progress } = useStore();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const f = {
    thema: params.get('thema') ?? 'alle',
    block: params.get('block') ?? 'alle',
    stufe: params.get('stufe') ?? 'alle',
    // Pages hat keine KI-Aufgaben (Roadmap 7.4): dort gibt es den Filter nicht.
    quelle: IS_STATIC ? 'alle' : (params.get('quelle') ?? 'alle'),
    status: params.get('status') ?? 'alle',
    suche: params.get('suche') ?? '',
  };
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === 'alle' || !value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const lastScore = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of progress.attempts) m.set(a.taskId, percent(a.points, a.max));
    return m;
  }, [progress.attempts]);

  const topicOrder = new Map(content.topics.map((t, i) => [t.id, i]));
  const all = Object.values(content.tasks).sort(
    (a, b) => topicOrder.get(a.topicId)! - topicOrder.get(b.topicId)! || a.id.localeCompare(b.id, 'de', { numeric: true }),
  );
  const blocks = [...new Set(all.filter((t) => f.thema === 'alle' || t.topicId === f.thema).map((t) => t.block))].sort();
  const needle = f.suche.toLowerCase();

  const tasks = all.filter((t) => {
    if (f.thema !== 'alle' && t.topicId !== f.thema) return false;
    if (f.block !== 'alle' && t.block !== f.block) return false;
    if (f.stufe !== 'alle' && difficulty(t.points) !== f.stufe) return false;
    if (f.quelle === 'blatt' && t.generated) return false;
    if (f.quelle === 'ki' && !t.generated) return false;
    const s = lastScore.get(t.id);
    if (f.status === 'neu' && s !== undefined) return false;
    if (f.status === 'fehler' && (s === undefined || s >= 100)) return false;
    if (f.status === 'voll' && s !== 100) return false;
    if (needle && !t.markdown.toLowerCase().includes(needle)) return false;
    return true;
  });

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const ids = [...selected].join(',');
  const topicTitle = (id: string) => content.topics.find((t) => t.id === id)?.title ?? id;

  return (
    <div className="page notebook-page exercises-index">
      <div className="notebook-running-head">
        <span>AP2 · Aufgabenregister</span>
        <span>{tasks.length} Aufgaben</span>
      </div>
      <h1>Einzelaufgaben</h1>
      <div className="filters">
        <label>
          Thema
          <select
            value={f.thema}
            onChange={(e) => {
              set('thema', e.target.value);
              set('block', 'alle');
            }}
          >
            <option value="alle">Alle Themen</option>
            {content.topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Block
          <select value={f.block} onChange={(e) => set('block', e.target.value)}>
            <option value="alle">Alle</option>
            {blocks.map((b) => (
              <option key={b} value={b}>
                {b === 'KI' ? 'KI-generiert' : `Block ${b}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Schwierigkeit
          <select value={f.stufe} onChange={(e) => set('stufe', e.target.value)}>
            <option value="alle">Alle</option>
            <option value="leicht">leicht (≤ 5 P)</option>
            <option value="mittel">mittel (6–10 P)</option>
            <option value="schwer">schwer (&gt; 10 P)</option>
          </select>
        </label>
        {!IS_STATIC && (
          <label>
            Quelle
            <select value={f.quelle} onChange={(e) => set('quelle', e.target.value)}>
              <option value="alle">Alle</option>
              <option value="blatt">Lernblatt</option>
              <option value="ki">KI-generiert</option>
            </select>
          </label>
        )}
        <label>
          Status
          <select value={f.status} onChange={(e) => set('status', e.target.value)}>
            <option value="alle">Alle</option>
            <option value="neu">noch nicht bearbeitet</option>
            <option value="fehler">zuletzt nicht voll</option>
            <option value="voll">zuletzt volle Punkte</option>
          </select>
        </label>
        <label>
          Suche
          <input type="search" value={f.suche} placeholder="z. B. HAVING" onChange={(e) => set('suche', e.target.value)} />
        </label>
      </div>

      <div className="selection-bar">
        <span>
          {tasks.length} Aufgaben · {selected.size} ausgewählt
        </span>
        <button type="button" className="ghost" onClick={() => setSelected(new Set(tasks.map((t) => t.id)))}>
          Alle auswählen
        </button>
        <button type="button" className="ghost" onClick={() => setSelected(new Set())} disabled={!selected.size}>
          Auswahl leeren
        </button>
        {selected.size > 0 && (
          <>
            <Link className="button secondary" to={`/druck?art=aufgaben&ids=${ids}`}>
              <Icon name="printer" /> Aufgabenblatt
            </Link>
            <Link className="button secondary" to={`/druck?art=loesungen&ids=${ids}`}>
              <Icon name="printer" /> Lösungsblatt
            </Link>
          </>
        )}
        {tasks.length > 0 && (
          // Zufall erst beim Klick ziehen – beim Rendern wäre er unrein und bei jedem Neurendern anders.
          <button type="button" onClick={() => navigate(`/aufgabe/${tasks[Math.floor(Math.random() * tasks.length)].id}`)}>
            <Icon name="dices" /> Zufallsaufgabe
          </button>
        )}
      </div>

      <ul className="task-list">
        {tasks.map((t) => {
          const s = lastScore.get(t.id);
          return (
            <li key={t.id}>
              <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggle(t.id)} aria-label={`${t.code} auswählen`} />
              <Link to={`/aufgabe/${t.id}`} className="task-link">
                <span className="task-code">{t.code}</span>
                <span className="task-preview">
                  {t.markdown
                    .replace(/[*`#>|]/g, '')
                    .split('\n')[0]
                    .slice(0, 140)}
                </span>
              </Link>
              <span className="muted small">{topicTitle(t.topicId)}</span>
              <span className="badge">{formatPoints(t.points)} P</span>
              {t.generated && <span className="badge ai">KI</span>}
              <span className={`status ${s === undefined ? '' : s >= 100 ? 'good' : s >= 50 ? 'mid' : 'low'}`}>
                {s === undefined ? '–' : `${Math.round(s)} %`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
