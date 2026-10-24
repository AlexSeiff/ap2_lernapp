import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Rating } from '../../shared/progress';
import type { Flashcard } from '../../shared/types';
import { Icon, type IconName } from '../components/Icon';
import { KartenAntwort } from '../components/KartenText';
import { MarkierStern } from '../components/MarkierStern';
import { cardPool } from '../lib/cards';
import { farbKlasse, themaFarbe, TYP_FARBE } from '../lib/farben';
import {
  faelligText,
  isStand,
  kartenstand,
  passtZurSuche,
  sortiereStand,
  STAENDE,
  STAND_TEXT,
  type StandEintrag,
  type StandSortierung,
} from '../lib/kartenstand';
import { isDue, localDate } from '../lib/progress';
import { useStore } from '../lib/store';
import { CARD_TYPE_LABELS } from './Karteikarten';

const STAND_ICON: Record<Rating, IconName> = { gewusst: 'circle-check', unsicher: 'circle-question-mark', nicht: 'circle-x' };
const SORTIERUNGEN: { wert: StandSortierung; text: string }[] = [
  { wert: 'thema', text: 'nach Thema' },
  { wert: 'faellig', text: 'am längsten fällig zuerst' },
  { wert: 'fach', text: 'niedrigstes Fach zuerst' },
];
/** So viele Karten zeigt die Liste zuerst; „Mehr zeigen“ lädt weitere nach (bei „gewusst“ können es Hunderte sein). */
const SEITE = 60;

const anzahl = (n: number) => `${n} ${n === 1 ? 'Karte' : 'Karten'}`;
/** Anteil in Prozent; ein kleiner, aber vorhandener Anteil heißt „< 1 %“ statt „0 %“. */
const anteil = (n: number, gesamt: number) => {
  const p = gesamt ? Math.round((n / gesamt) * 100) : 0;
  return p === 0 && n > 0 ? '< 1 %' : `${p} %`;
};
const kartenParam = (eintraege: StandEintrag[]) => eintraege.map((e) => encodeURIComponent(e.card.id)).join(',');

/**
 * Kartenstand: alle bewerteten Karteikarten nach der letzten Bewertung – gewusst, unsicher, nicht gewusst – zum Nachlesen,
 * Durchblättern oder gezielt noch einmal Lernen. Ändert selbst keinen Lernstand (außer dem Stern).
 */
export function Kartenstand() {
  const { content, progress } = useStore();
  const [params, setParams] = useSearchParams();
  const pool = useMemo(() => cardPool(content.flashcards, progress.settings), [content, progress.settings]);
  const stand = useMemo(() => kartenstand(pool, progress), [pool, progress]);
  const bewertet = stand.gesamt - stand.neu;
  // Ausgeschaltete Prüfer-/Fachgesprächsfragen behalten ihren Stand, zählen hier aber nicht mit – sagen, wie viele das sind.
  const ausgeblendet = useMemo(() => {
    const imPool = new Set(pool.map((c) => c.id));
    return content.flashcards.filter((c) => !imPool.has(c.id) && progress.cards[c.id]).length;
  }, [content, pool, progress.cards]);

  const param = params.get('stand');
  // Ohne Wahl: die erste nicht leere Gruppe, beginnend mit dem, was am meisten Übung braucht.
  const gewaehlt: Rating = isStand(param)
    ? param
    : ((['nicht', 'unsicher', 'gewusst'] as Rating[]).find((s) => stand.gruppen[s].length) ?? 'nicht');
  const thema = params.get('thema') ?? 'alle';
  const suche = params.get('q') ?? '';
  const sortParam = params.get('sort');
  const sortierung: StandSortierung = SORTIERUNGEN.some((s) => s.wert === sortParam) ? (sortParam as StandSortierung) : 'thema';
  const setze = (aenderung: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(aenderung)) {
      if (!v || v === 'alle') next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: true });
  };

  const liste = useMemo(
    () =>
      sortiereStand(
        stand.gruppen[gewaehlt].filter((e) => (thema === 'alle' || e.card.topicId === thema) && passtZurSuche(e.card, suche)),
        sortierung,
      ),
    [stand, gewaehlt, thema, suche, sortierung],
  );
  const themenMitKarten = content.topics.filter((t) => STAENDE.some((s) => stand.gruppen[s].some((e) => e.card.topicId === t.id)));

  return (
    <div className="page kartenstand">
      <h1>
        <Icon name="chart-column" /> Kartenstand
      </h1>
      <p className="lead">
        Alle Karten, die du schon bewertet hast – sortiert nach deiner letzten Bewertung. Hier liest du nach, blätterst durch oder lernst
        eine Gruppe gezielt noch einmal.
      </p>

      <Verteilung gruppen={stand.gruppen} neu={stand.neu} gesamt={stand.gesamt} />
      {ausgeblendet > 0 && (
        <p className="hint">
          <Icon name="eye-off" /> {anzahl(ausgeblendet)} mit Bewertung {ausgeblendet === 1 ? 'ist' : 'sind'} Prüfer- oder
          Fachgesprächsfragen, die gerade ausgeschaltet sind – einschalten unter <Link to="/einstellungen">Einstellungen</Link>.
        </p>
      )}

      {bewertet === 0 ? (
        <section className="card info">
          <p>
            Du hast noch keine Karteikarte bewertet. Nach jeder Karte wählst du <b>Gewusst</b>, <b>Unsicher</b> oder <b>Nicht gewusst</b> –
            hier siehst du dann, wo du stehst.
          </p>
          <Link className="button" to="/karteikarten">
            <Icon name="layers" /> Zu den Karteikarten
          </Link>
        </section>
      ) : (
        <>
          <div className="stand-kacheln" role="group" aria-label="Gruppe wählen">
            {STAENDE.map((s) => (
              <button
                key={s}
                type="button"
                className={`stand-kachel stand-${s}`}
                aria-pressed={s === gewaehlt}
                onClick={() => setze({ stand: s })}
              >
                <span className="stand-kachel-kopf">
                  <Icon name={STAND_ICON[s]} /> {STAND_TEXT[s].titel}
                </span>
                <span className="stand-kachel-zahl">{stand.gruppen[s].length}</span>
                <span className="stand-kachel-fuss">{kachelText(s, stand.gruppen[s])}</span>
              </button>
            ))}
          </div>

          <div className="filters stand-filter">
            <label>
              Thema
              <select value={thema} onChange={(e) => setze({ thema: e.target.value })}>
                <option value="alle">Alle Themen</option>
                {themenMitKarten.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id === '00' ? 'Zusatz' : `DD ${t.number}`} · {t.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Suche
              <input type="search" value={suche} placeholder="z. B. Median" onChange={(e) => setze({ q: e.target.value })} />
            </label>
            <label>
              Reihenfolge
              <select value={sortierung} onChange={(e) => setze({ sort: e.target.value === 'thema' ? '' : e.target.value })}>
                {SORTIERUNGEN.map((s) => (
                  <option key={s.wert} value={s.wert}>
                    {s.text}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={`actions stand-aktionen stand-${gewaehlt}`}>
            {liste.length > 0 && (
              <>
                <Link className="button" to={`/karteikarten?von=stand&karten=${kartenParam(liste)}`}>
                  <Icon name="layers" /> {anzahl(liste.length)} lernen
                </Link>
                <Link className="button secondary" to={`/karteikarten?blaettern=1&karten=${kartenParam(liste)}`}>
                  <Icon name="book-open" /> Durchblättern
                </Link>
              </>
            )}
            <span className="muted small">
              {liste.length === stand.gruppen[gewaehlt].length
                ? anzahl(liste.length)
                : `${liste.length} von ${stand.gruppen[gewaehlt].length} Karten`}{' '}
              „{STAND_TEXT[gewaehlt].kurz}“
            </span>
          </div>

          {liste.length === 0 ? (
            <p className="hint">
              {stand.gruppen[gewaehlt].length
                ? 'Keine Karte passt zu Thema und Suche.'
                : `Noch keine Karte mit „${STAND_TEXT[gewaehlt].kurz}“ bewertet.`}
            </p>
          ) : (
            <StandListe key={`${gewaehlt}-${thema}-${suche}-${sortierung}`} eintraege={liste} nachThema={sortierung === 'thema'} />
          )}

          <p className="hint">
            Gezählt wird die <b>letzte</b> Bewertung je Karte – im Leicht-Modus zählt richtig als „gewusst“ und falsch als „nicht gewusst“.
            Lernen und Durchblättern öffnen die Karteikarten mit genau dieser Auswahl; Durchblättern ändert den Lernstand nicht.
          </p>
        </>
      )}
    </div>
  );
}

function kachelText(s: Rating, eintraege: StandEintrag[]): string {
  if (!eintraege.length) return 'noch keine';
  const heute = localDate();
  const faellig = eintraege.filter((e) => isDue(e.state.due, heute)).length;
  if (s === 'gewusst') {
    const sicher = eintraege.filter((e) => e.state.box >= 3).length;
    return `${sicher} davon sicher (ab Fach 3)`;
  }
  return faellig ? `${faellig} heute fällig` : 'keine fällig';
}

/** Gestapelter Balken über alle Karten: gewusst, unsicher, nicht gewusst, neu – mit Legende. */
function Verteilung({ gruppen, neu, gesamt }: { gruppen: Record<Rating, StandEintrag[]>; neu: number; gesamt: number }) {
  const teile = [
    ...STAENDE.map((s) => ({ key: s, text: STAND_TEXT[s].titel, n: gruppen[s].length })),
    { key: 'neu', text: 'Noch neu', n: neu },
  ];
  const label = teile.map((t) => `${t.text}: ${t.n}`).join(', ');
  return (
    <section className="card verteilung">
      <div className="verteilung-balken" role="img" aria-label={`${gesamt} Karten – ${label}`}>
        {teile
          .filter((t) => t.n > 0)
          .map((t) => (
            <span key={t.key} className={`vb-${t.key}`} style={{ flexGrow: t.n }} title={`${t.text}: ${t.n}`} />
          ))}
      </div>
      <ul className="verteilung-legende" aria-hidden="true">
        {teile.map((t) => (
          <li key={t.key}>
            <span className={`punkt vb-${t.key}`} /> {t.text} <b>{t.n}</b>
            <span className="muted small"> · {anteil(t.n, gesamt)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Liste der Karten einer Gruppe; „nach Thema“ mit farbigen Zwischenüberschriften. Lädt in Seiten nach. */
function StandListe({ eintraege, nachThema }: { eintraege: StandEintrag[]; nachThema: boolean }) {
  const { content } = useStore();
  const [sichtbar, setSichtbar] = useState(SEITE);
  const zeige = eintraege.slice(0, sichtbar);
  const gruppen: { key: string; titel?: string; topicId?: string; eintraege: StandEintrag[] }[] = [];
  for (const e of zeige) {
    const key = nachThema ? (e.card.topicId ?? `deck:${e.card.deckId ?? ''}`) : 'alle';
    let g = gruppen.at(-1);
    if (!g || g.key !== key) {
      const topic = content.topics.find((t) => t.id === e.card.topicId);
      const deck = content.decks.find((d) => d.id === e.card.deckId);
      g = {
        key,
        topicId: e.card.topicId,
        titel: nachThema
          ? topic
            ? `${topic.id === '00' ? 'Zusatz' : `DD ${topic.number}`} · ${topic.title}`
            : (deck?.title ?? 'Weitere Karten')
          : undefined,
        eintraege: [],
      };
      gruppen.push(g);
    }
    g.eintraege.push(e);
  }
  return (
    <>
      {gruppen.map((g, i) => (
        <section key={`${g.key}-${i}`} className={`stand-gruppe ${farbKlasse(themaFarbe(g.topicId))}`}>
          {g.titel && <h2 className="stand-gruppe-titel">{g.titel}</h2>}
          <ul className="stand-liste">
            {g.eintraege.map((e) => (
              <StandZeile key={e.card.id} eintrag={e} />
            ))}
          </ul>
        </section>
      ))}
      {eintraege.length > sichtbar && (
        <div className="actions">
          <button type="button" className="secondary" onClick={() => setSichtbar((n) => n + SEITE)}>
            Mehr zeigen ({eintraege.length - sichtbar} weitere)
          </button>
        </div>
      )}
    </>
  );
}

/** Eine Karte: Frage, Deck, Fach und nächste Wiederholung; aufgeklappt die Antwort. */
function StandZeile({ eintrag }: { eintrag: StandEintrag }) {
  const { content } = useStore();
  const [offen, setOffen] = useState(false);
  const { card, state } = eintrag;
  const deck = content.decks.find((d) => d.id === card.deckId);
  const faellig = faelligText(state.due);
  return (
    <li className={`stand-zeile ${card.typ ? farbKlasse(TYP_FARBE[card.typ]) : ''}${offen ? ' offen' : ''}`}>
      <div className="stand-zeile-kopf">
        <button type="button" className="stand-frage" aria-expanded={offen} onClick={() => setOffen((x) => !x)}>
          <Icon name="chevron-right" />
          <span className={card.typ === 'begriff' ? 'stand-begriff' : ''}>{card.question}</span>
        </button>
        <MarkierStern cardId={card.id} nurIcon />
      </div>
      <div className="stand-meta">
        {card.typ && <span className={`badge typ-${card.typ}`}>{CARD_TYPE_LABELS[card.typ]}</span>}
        <span className="badge fach" title="Leitner-Fach (1–5)">
          Fach {state.box}
        </span>
        <span className={`small ${faellig === 'fällig' ? 'stand-faellig' : 'muted'}`}>{faellig}</span>
        <span className="muted small">
          {deck?.title ?? kindText(card)} · {state.reviews}× bewertet
        </span>
      </div>
      {offen && (
        <div className="stand-antwort">
          {card.answer || card.rechenweg ? <KartenAntwort card={card} /> : <p className="muted">Keine Musterantwort im Lernblatt.</p>}
        </div>
      )}
    </li>
  );
}

const kindText = (c: Flashcard) => (c.kind === 'prueferfrage' ? 'Prüferfrage' : c.kind === 'fachgespraech' ? 'Fachgespräch' : 'Lernkarte');
