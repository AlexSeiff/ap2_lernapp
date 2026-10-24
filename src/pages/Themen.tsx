import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quellenNachZiel } from '../../shared/quellen';
import { QuellenListe } from '../components/Quellen';
import { Markdown } from '../components/Markdown';
import { useLeseStelle } from '../hooks/useLeseStelle';
import { useStelle } from '../hooks/useStelle';
import { useStore } from '../lib/store';
import { useThemaTexte } from '../lib/texte';
import { cardPool } from '../lib/cards';
import { istAusgeblendet, setzeAusgeblendet } from '../lib/settings';
import { TheoryMarkdown } from '../components/TheoryMarkdown';
import type { Topic } from '../../shared/types';
import { Icon } from '../components/Icon';
import { hatPodcastThema } from '../lib/podcast';
import { farbKlasse, themaFarbe } from '../lib/farben';
import { kartenstand, STAENDE } from '../lib/kartenstand';

/** „Deep Dive 3“ oder „Zusatz“ für das ältere SQL-Blatt. */
const topicLabel = (t: Pick<Topic, 'id' | 'number'>) => (t.id === '00' ? 'Zusatz' : `Deep Dive ${t.number}`);

export function Themen() {
  const { content, progress, update } = useStore();
  const sichtbar = content.topics.filter((t) => !istAusgeblendet(progress.settings, t.id));
  const ausgeblendet = content.topics.filter((t) => istAusgeblendet(progress.settings, t.id));
  const pool = useMemo(() => cardPool(content.flashcards, progress.settings), [content, progress.settings]);
  return (
    <div className="page">
      <h1>Lernen</h1>
      <p className="lead">
        Theorie aller Deep Dives – mit {progress.settings.prueferfragen ? 'Prüferfragen, ' : ''}Lernziel-Check und direktem Sprung in Übung
        und Klausur.
      </p>
      <div className="grid">
        {sichtbar.map((t) => {
          const s = kartenstand(
            pool.filter((c) => c.topicId === t.id),
            progress,
          );
          return (
            <Link key={t.id} to={`/lernen/${t.id}`} className={`tile thema-kachel ${farbKlasse(themaFarbe(t.id))}`}>
              <span className="tile-num">{t.id === '00' ? '＋' : t.number}</span>
              <span className="tile-title">{t.title}</span>
              <span className="tile-meta">
                {topicLabel(t)} · {t.sections.length} Abschnitte{s.gesamt > 0 && ` · ${s.gesamt} Karten`}
              </span>
              {s.gesamt > 0 && (
                <span
                  className="verteilung-balken schmal"
                  role="img"
                  aria-label={`Karten: ${s.gruppen.gewusst.length} gewusst, ${s.gruppen.unsicher.length} unsicher, ${s.gruppen.nicht.length} nicht gewusst, ${s.neu} neu`}
                >
                  {STAENDE.map(
                    (st) => s.gruppen[st].length > 0 && <span key={st} className={`vb-${st}`} style={{ flexGrow: s.gruppen[st].length }} />,
                  )}
                  {s.neu > 0 && <span className="vb-neu" style={{ flexGrow: s.neu }} />}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      {!!ausgeblendet.length && (
        <details className="card ausgeblendet">
          <summary>
            <Icon name="eye-off" /> Ausgeblendet ({ausgeblendet.length})
          </summary>
          <ul className="plain">
            {ausgeblendet.map((t) => (
              <li key={t.id}>
                <Link to={`/lernen/${t.id}`}>
                  {topicLabel(t)} · {t.title}
                </Link>{' '}
                <button type="button" className="small secondary" onClick={() => update((p) => setzeAusgeblendet(p, t.id, false))}>
                  <Icon name="eye" /> Einblenden
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export function Thema() {
  const { topicId } = useParams();
  const { content, progress, update } = useStore();
  const quellen = useMemo(() => quellenNachZiel(content.quellen), [content.quellen]);
  const topic = content.topics.find((t) => t.id === topicId);
  // Abschnittstexte kommen nachgeladen (lib/texte.ts); Sprung und Lesestelle erst, wenn sie im Bild stehen.
  const { topic: mitTexten, fehler } = useThemaTexte(topic);
  useStelle(!!mitTexten);
  useLeseStelle(mitTexten?.id, mitTexten?.sections.map((s) => s.id) ?? []);
  if (!topic)
    return (
      <div className="page">
        <h1>Thema nicht gefunden</h1>
      </div>
    );
  const cards = cardPool(content.flashcards, progress.settings).filter((c) => c.topicId === topic.id).length;
  const ausgeblendet = istAusgeblendet(progress.settings, topic.id);

  return (
    <div className="page with-toc">
      <aside className="toc">
        <b>Inhalt</b>
        {topic.sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`toc-l${s.level}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {s.title}
          </a>
        ))}
        {!!topic.lernziele.length && (
          <a
            href="#lernziele"
            className="toc-l2"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('lernziele')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Lernziel-Check
          </a>
        )}
      </aside>
      <article>
        <p className="crumbs">
          <Link to="/lernen">Lernen</Link> / {topicLabel(topic)}
        </p>
        <h1>{topic.title}</h1>
        <div className="actions">
          {/* Nachschlagethemen ohne Übungsklausur (Glossar & Diagramme) haben auch keine Einzelaufgaben. */}
          {topic.exam && (
            <>
              <Link className="button" to={`/klausur/${topic.id}`}>
                <Icon name="file-pen-line" /> Übungsklausur
              </Link>
              <Link className="button secondary" to={`/aufgaben?thema=${topic.id}`}>
                Einzelaufgaben
              </Link>
            </>
          )}
          {cards > 0 && (
            <Link className="button secondary" to={`/karteikarten?thema=${topic.id}`}>
              <Icon name="layers" /> {cards} Karteikarten
            </Link>
          )}
          {hatPodcastThema(topic) && (
            <Link className="button secondary" to={`/podcast/${topic.id}`}>
              <Icon name="headphones" /> Podcast
            </Link>
          )}
          {!ausgeblendet && (
            <button type="button" className="secondary" onClick={() => update((p) => setzeAusgeblendet(p, topic.id, true))}>
              <Icon name="eye-off" /> Ausblenden
            </button>
          )}
        </div>
        {ausgeblendet && (
          <p className="card info" role="note">
            <Icon name="eye-off" /> Dieses Lernblatt ist ausgeblendet: Es fehlt in der Themenliste, bei „Weiterlesen“ und in „Heute lernen“.
            Karteikarten und Aufgaben bleiben.{' '}
            <button type="button" className="small secondary" onClick={() => update((p) => setzeAusgeblendet(p, topic.id, false))}>
              <Icon name="eye" /> Wieder einblenden
            </button>
          </p>
        )}
        {fehler && <p className="card warn">{fehler}</p>}
        {!mitTexten && !fehler && <p className="loading">Lädt …</p>}
        {mitTexten?.sections.map((s) => (
          <section key={s.id} id={s.id} className="theory">
            {s.level <= 1 ? <h2 className="part">{s.title}</h2> : s.level === 2 ? <h2>{s.title}</h2> : <h3>{s.title}</h3>}
            <TheoryMarkdown source={topic.file} markdown={s.markdown} prueferfragen={progress.settings.prueferfragen} />
            <QuellenListe quellen={quellen.get(`abschnitt:${s.id}`) ?? []} />
          </section>
        ))}
        {mitTexten && !!topic.lernziele.length && (
          <section id="lernziele" className="card">
            <h2>Lernziel-Check</h2>
            {topic.lernziele.map((z, i) => {
              const key = `${topic.id}-${i}`;
              return (
                <label key={key} className="choice">
                  <input
                    type="checkbox"
                    checked={!!progress.lernziele[key]}
                    onChange={(e) => update((p) => ({ ...p, lernziele: { ...p.lernziele, [key]: e.target.checked } }))}
                  />
                  <Markdown className="inline">{z}</Markdown>
                </label>
              );
            })}
          </section>
        )}
      </article>
    </div>
  );
}
