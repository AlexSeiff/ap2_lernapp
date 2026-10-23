import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { CardType, Flashcard } from '../../shared/types';
import { AntwortVergleich, EigeneAntwortFeld } from '../components/EigeneAntwort';
import { LeichtOptionen } from '../components/LeichtOptionen';
import { MarkierStern } from '../components/MarkierStern';
import { SqlUebungLinks } from '../components/SqlUebungLinks';
import { KartenAntwort, KartenFrage } from '../components/KartenText';
import { Markdown } from '../components/Markdown';
import { useCardFilters, useCardSession } from '../hooks/useCardSession';
import { leichtZahlen } from '../lib/leicht';
import { shuffle } from '../lib/shuffle';
import { isDue, LEICHT_MAX_BOX } from '../lib/progress';
import { withSettings } from '../lib/settings';
import { useStore } from '../lib/store';
import { NEW_PER_SESSION } from '../../shared/config';
import { Icon, type IconName } from '../components/Icon';

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  wissen: 'Wissen',
  abgrenzung: 'Abgrenzung',
  rechnung: 'Rechnung',
  anwendung: 'Anwendung',
  falle: 'Falle',
  begriff: 'Fachbegriff',
};
const LEVEL_LABELS: Record<number, string> = { 1: 'Basis', 2: 'Standard', 3: 'Transfer' };
const KIND_ICONS: Record<Flashcard['kind'], IconName> = { lernkarte: 'layers', prueferfrage: 'circle-question-mark', fachgespraech: 'mic' };
const KIND_LABELS: Record<Flashcard['kind'], string> = {
  lernkarte: 'Lernkarte',
  prueferfrage: 'Prüferfrage',
  fachgespraech: 'Fachgespräch',
};

export function Karteikarten() {
  const { content, progress, update } = useStore();
  const { settings } = progress;
  const { f, set, deck, alle, pool, leicht, leichtModus, markiert, auswahl, ausSuche, vonBegriff } = useCardFilters();
  const {
    session,
    index,
    card,
    flipped,
    done,
    start,
    end,
    flip,
    rate,
    runde,
    waehle,
    next,
    eigeneAntwort,
    setEigeneAntwort,
    kannRueckgaengig,
    rueckgaengig,
  } = useCardSession();
  const touch = useRef<{ x: number; y: number } | null>(null);
  const startRunde = (cards: Flashcard[]) => start(cards, leichtModus ? leicht : null);
  // Filter: auf dem Desktop offen, auf dem Handy zugeklappt (spart einen ganzen Bildschirm), mit aktiven Filtern immer offen.
  const [filterOffen, setFilterOffen] = useState(
    () =>
      typeof window === 'undefined' || window.matchMedia?.('(min-width: 600px)').matches !== false || window.location.hash.includes('?'),
  );
  // ?blaettern=1: Durchblättern der gefilterten Karten (ohne Bewertung). `alle`, weil die Antwort ohnehin sichtbar ist.
  const [params, setParams] = useSearchParams();
  const blaettern = params.get('blaettern') === '1';
  const setBlaettern = (an: boolean) => {
    const next = new URLSearchParams(params);
    if (an) next.set('blaettern', '1');
    else next.delete('blaettern');
    setParams(next);
  };

  if (blaettern && !session && alle.length > 0) return <KartenBlaettern cards={alle} onEnde={() => setBlaettern(false)} />;

  const due = deck.filter((c) => progress.cards[c.id] && isDue(progress.cards[c.id].due));
  const fresh = deck.filter((c) => !progress.cards[c.id]);

  if (session && card && runde) {
    const topic = content.topics.find((t) => t.id === card.topicId);
    const cardDeck = content.decks.find((d) => d.id === card.deckId);
    const fertig = runde.gewaehlt !== null;
    const richtig = fertig && runde.optionen[runde.gewaehlt!].richtig;
    return (
      <div className="page narrow">
        <div className="session-head">
          <button type="button" className="ghost" onClick={end}>
            ← Beenden
          </button>
          <span>
            <Icon name="list-checks" /> Leicht · Karte {index + 1} / {session.length}
          </span>
          <MarkierStern cardId={card.id} taste />
        </div>
        <RundenBalken index={index} gesamt={session.length} />
        <KartenWechsel id={String(index)}>
          <div className={`flashcard leicht ${card.typ === 'falle' ? 'trap' : ''}`}>
            <div className="fc-meta">
              <span>
                <Icon name={KIND_ICONS[card.kind]} /> {KIND_LABELS[card.kind]} · {cardDeck?.title ?? topic?.title}
              </span>
              {card.typ && <span className={`badge typ-${card.typ}`}>{CARD_TYPE_LABELS[card.typ]}</span>}
              {runde.karte.art === 'automatisch' && (
                <span
                  className="badge auto"
                  title="Die falschen Antworten stammen von verwandten Begriffen bzw. ähnlichen Karten – nicht von Hand geschrieben."
                >
                  <Icon name="sparkles" /> automatisch
                </span>
              )}
              <span className="muted small">{card.id}</span>
            </div>
            {runde.frage ? (
              <>
                <p className="leicht-richtung">
                  <Icon name="rotate-ccw" /> Umgekehrt: Welcher Begriff ist gemeint?
                </p>
                <Markdown className="fc-question umgekehrt">{runde.frage}</Markdown>
              </>
            ) : (
              <KartenFrage card={card} />
            )}
            <LeichtOptionen
              optionen={runde.optionen}
              gewaehlt={runde.gewaehlt}
              onWaehle={waehle}
              tasten
              label={runde.frage ? 'Begriffe' : 'Antworten'}
            />
            {fertig && (
              <div className="fc-answer leicht-feedback" role="status">
                <p className={`verdict ${richtig ? 'ok' : 'bad'}`}>
                  <Icon name={richtig ? 'circle-check' : 'circle-x'} />{' '}
                  {richtig
                    ? `Richtig! Die Karte kommt höchstens in Fach ${LEICHT_MAX_BOX}.`
                    : 'Leider falsch – die Karte kommt in dieser Runde noch einmal.'}
                </p>
                {runde.frage ? (
                  <>
                    <h4>Gesucht war</h4>
                    <Markdown>{`**${card.question}**`}</Markdown>
                  </>
                ) : (
                  card.answer && (
                    <>
                      <h4>Ganze Antwort</h4>
                      <KartenAntwort card={card} />
                    </>
                  )
                )}
                {runde.karte.erklaerung && (
                  <>
                    <h4>Warum die anderen falsch sind</h4>
                    <Markdown>{runde.karte.erklaerung}</Markdown>
                  </>
                )}
              </div>
            )}
          </div>
        </KartenWechsel>
        {fertig && <SqlUebungLinks card={card} />}
        {fertig ? (
          <div className="actions">
            <button type="button" onClick={next} autoFocus>
              Weiter → <kbd>Enter</kbd>
            </button>
          </div>
        ) : (
          <p className="hint">
            Wähle die richtige Antwort: klicken oder <kbd>1</kbd>–<kbd>4</kbd>.
          </p>
        )}
      </div>
    );
  }

  if (session && card) {
    const topic = content.topics.find((t) => t.id === card.topicId);
    const cardDeck = content.decks.find((d) => d.id === card.deckId);
    return (
      <div className="page narrow">
        <div className="session-head">
          <button type="button" className="ghost" onClick={end}>
            ← Beenden
          </button>
          <span>
            Karte {index + 1} / {session.length}
          </span>
          {kannRueckgaengig && (
            <button type="button" className="ghost" onClick={rueckgaengig} title="Letzte Bewertung zurücknehmen (Taste U)">
              <Icon name="rotate-ccw" /> Rückgängig
            </button>
          )}
          <MarkierStern cardId={card.id} taste />
        </div>
        <RundenBalken index={index} gesamt={session.length} />
        {/* Kein <button>: die Karte enthält Markdown mit Absätzen, Listen und Codeblöcken – das ist in einem Button ungültig. */}
        <KartenWechsel id={String(index)}>
          <div
            className={`flashcard ${flipped ? 'flipped' : ''} ${card.typ === 'falle' ? 'trap' : ''}`}
            role="button"
            tabIndex={0}
            aria-expanded={flipped}
            onClick={flip}
            onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
            onTouchEnd={(e) => {
              const t = touch.current;
              touch.current = null;
              if (!t || !flipped) return;
              const dx = e.changedTouches[0].clientX - t.x;
              const dy = e.changedTouches[0].clientY - t.y;
              // Nach dem Umdrehen: nach rechts wischen = gewusst, nach links = nicht gewusst.
              if (Math.abs(dx) > 90 && Math.abs(dy) < 60) rate(dx > 0 ? 'gewusst' : 'nicht');
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              if (!e.repeat) flip();
            }}
          >
            <div className="fc-meta">
              <span>
                <Icon name={KIND_ICONS[card.kind]} /> {KIND_LABELS[card.kind]} · {cardDeck?.title ?? topic?.title}
              </span>
              {card.typ && <span className={`badge typ-${card.typ}`}>{CARD_TYPE_LABELS[card.typ]}</span>}
              {card.schwierigkeit && <span className="badge muted">{LEVEL_LABELS[card.schwierigkeit] ?? card.schwierigkeit}</span>}
              <span className="muted small">{card.id}</span>
            </div>
            <KartenFrage card={card} />
            {card.typ === 'rechnung' && !flipped && (
              <p className="hint">
                <Icon name="pencil" /> Erst auf Papier rechnen, dann umdrehen.
              </p>
            )}
            {flipped && (
              <div className="fc-answer">
                <AntwortVergleich
                  eigene={eigeneAntwort}
                  muster={
                    card.answer ? (
                      <KartenAntwort card={card} />
                    ) : (
                      <p className="muted">
                        Keine Musterantwort im Lernblatt – beantworte die Frage laut und prüfe dich anhand des Theorieteils.
                      </p>
                    )
                  }
                />
                {!!card.tags?.length && (
                  <div className="tags">
                    {card.tags.map((t) => (
                      <span key={t} className="tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!flipped && card.typ !== 'rechnung' && (
              <p className="hint">Antwort formulieren – im Kopf oder unten aufschreiben –, dann klicken oder Leertaste drücken.</p>
            )}
          </div>
        </KartenWechsel>
        {flipped && <p className="hint wisch-hinweis">Auf dem Handy: nach rechts wischen = gewusst, nach links = nicht gewusst.</p>}
        {!flipped && <EigeneAntwortFeld value={eigeneAntwort} onChange={setEigeneAntwort} onFertig={flip} />}
        {flipped && <SqlUebungLinks card={card} />}
        {flipped && (
          <div className="rate-buttons">
            <button type="button" className="good" onClick={() => rate('gewusst')}>
              ✓ Gewusst <kbd>1</kbd>
            </button>
            <button type="button" className="mid" onClick={() => rate('unsicher')}>
              ~ Unsicher <kbd>2</kbd>
            </button>
            <button type="button" className="low" onClick={() => rate('nicht')}>
              ✗ Nicht gewusst <kbd>3</kbd>
            </button>
          </div>
        )}
      </div>
    );
  }

  const traps = pool.filter(
    (c) => c.typ === 'falle' && (f.thema === 'alle' || c.topicId === f.thema) && (!leichtModus || leicht.has(c.id)),
  );
  const lz = leichtZahlen(alle, leicht);
  const typLeicht = (typ: string) => pool.filter((c) => c.typ === typ && leicht.has(c.id)).length;
  const setMode = (an: boolean) => update((p) => withSettings(p, { leichtModus: an }));
  const known = (ids: Flashcard[]) => ids.filter((c) => (progress.cards[c.id]?.box ?? 0) >= 3).length;
  const aktiveFilter = [f.thema, f.deck, f.art, f.typ, f.stufe, f.markiert].filter((x) => x !== 'alle').length;
  const anzahlMarkiert = pool.filter((c) => markiert.has(c.id)).length;

  return (
    <div className="page">
      <h1>Karteikarten</h1>
      {session && (
        <div className="card success">
          Runde beendet: ✓ {done.gewusst} gewusst · ~ {done.unsicher} unsicher · ✗ {done.nicht} nicht gewusst
        </div>
      )}
      {auswahl && (
        <div className="card info actions">
          <span>
            <Icon name={ausSuche ? 'search' : vonBegriff ? 'book-bookmark' : 'play'} />{' '}
            {ausSuche
              ? `Aus der Suche: ${deck.length} ${deck.length === 1 ? 'Karte' : 'Karten'}.`
              : vonBegriff
                ? `Zum Begriff: ${deck.length} ${deck.length === 1 ? 'Karte' : 'Karten'}.`
                : `Heute lernen: ${deck.length} ${deck.length === 1 ? 'Karte' : 'Karten'} für diesen Schritt.`}
          </span>
          {deck.length > 0 && (
            <button type="button" onClick={() => startRunde(deck)} autoFocus={!session}>
              <Icon name="layers" /> {session ? 'Noch einmal' : 'Diese Karten lernen'}
            </button>
          )}
          <Link to="/karteikarten" className="small">
            alle Karten
          </Link>
        </div>
      )}
      <div className="mode-switch" role="group" aria-label="Modus">
        <button type="button" aria-pressed={!leichtModus} onClick={() => setMode(false)}>
          <Icon name="layers" /> Aufdecken
        </button>
        <button type="button" aria-pressed={leichtModus} onClick={() => setMode(true)}>
          <Icon name="list-checks" /> Leicht (4 Antworten)
        </button>
      </div>
      {leichtModus && (
        <p className="hint">
          <Icon name="list-checks" /> {lz.mc + lz.automatisch} von {lz.gesamt} Karten dieser Auswahl haben 4 Antworten
          {lz.automatisch > 0 && ` (${lz.automatisch} davon automatisch aus verwandten Begriffen und ähnlichen Karten)`}. Leicht-Modus ist
          zum Einstieg – für die Prüfung frei antworten: Mit 4 Antworten kommt eine Karte höchstens in Fach {LEICHT_MAX_BOX}.
        </p>
      )}
      <details className="filter-box" open={filterOffen} onToggle={(e) => setFilterOffen(e.currentTarget.open)}>
        <summary>
          <Icon name="chevron-right" /> Filter{aktiveFilter > 0 && ` (${aktiveFilter} aktiv)`}
        </summary>
        <div className="filters">
          <label>
            Deep Dive
            <select value={f.thema} onChange={(e) => set({ thema: e.target.value, deck: 'alle' })}>
              <option value="alle">Alle Themen</option>
              {content.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Deck
            <select value={f.deck} onChange={(e) => set({ deck: e.target.value, thema: 'alle' })}>
              <option value="alle">Alle Decks</option>
              {content.decks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                  {d.status === 'offen' ? ' (ohne Deep Dive)' : ''}
                </option>
              ))}
            </select>
          </label>
          <label>
            Kartenart
            <select value={f.art} onChange={(e) => set({ art: e.target.value })}>
              <option value="alle">Alle</option>
              <option value="lernkarte">Lernkarten</option>
              {settings.prueferfragen && <option value="prueferfrage">Prüferfragen</option>}
              {settings.fachgespraech && !leichtModus && <option value="fachgespraech">Fachgespräch-Fragen</option>}
            </select>
          </label>
          <label>
            Typ
            <select value={f.typ} onChange={(e) => set({ typ: e.target.value })}>
              <option value="alle">Alle</option>
              {Object.entries(CARD_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                  {leichtModus ? ` (${typLeicht(k)} mit 4 Antworten)` : ''}
                </option>
              ))}
            </select>
          </label>
          <label>
            Schwierigkeit
            <select value={f.stufe} onChange={(e) => set({ stufe: e.target.value })}>
              <option value="alle">Alle</option>
              {Object.entries(LEVEL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {k} – {v}
                </option>
              ))}
            </select>
          </label>
          <label className="check" title="Markieren mit dem Stern während einer Runde oder beim Durchblättern (Taste M)">
            <input type="checkbox" checked={f.markiert === '1'} onChange={(e) => set({ markiert: e.target.checked ? '1' : 'alle' })} />
            <Icon name="star" /> Nur markierte ({anzahlMarkiert})
          </label>
          <label className="check" title="Auch unter Einstellungen – ausgeblendete Karten behalten ihren Lernstand">
            <input
              type="checkbox"
              checked={settings.prueferfragen}
              onChange={(e) => update((p) => withSettings(p, { prueferfragen: e.target.checked }))}
            />
            <Icon name="circle-question-mark" /> Prüferfragen einbeziehen
          </label>
          <label className="check" title="Auch unter Einstellungen – ausgeblendete Karten behalten ihren Lernstand">
            <input
              type="checkbox"
              checked={settings.fachgespraech}
              onChange={(e) => update((p) => withSettings(p, { fachgespraech: e.target.checked }))}
            />
            <Icon name="mic" /> Fachgespräch einbeziehen
          </label>
        </div>
      </details>
      <div className="kpis">
        <div className="kpi">
          <span className="kpi-value">{due.length}</span>
          <span className="kpi-label">fällig</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">{fresh.length}</span>
          <span className="kpi-label">neu</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">
            {known(deck)}/{deck.length}
          </span>
          <span className="kpi-label">sicher (ab Fach 3)</span>
        </div>
      </div>
      <div className="actions">
        <button
          type="button"
          disabled={!due.length && !fresh.length}
          onClick={() => startRunde([...due, ...fresh.slice(0, NEW_PER_SESSION)])}
        >
          Lernen starten ({due.length + Math.min(fresh.length, NEW_PER_SESSION)})
        </button>
        <button type="button" className="secondary" disabled={!deck.length} onClick={() => startRunde(deck)}>
          Alle {deck.length} durchgehen
        </button>
        <button
          type="button"
          className="secondary"
          disabled={!alle.length}
          onClick={() => setBlaettern(true)}
          title="Karten nur ansehen und weiterblättern – ohne Bewertung, der Lernstand bleibt unverändert"
        >
          <Icon name="book-open" /> Durchblättern ({alle.length})
        </button>
        {traps.length > 0 && (
          <button
            type="button"
            className="secondary"
            onClick={() => startRunde(traps)}
            title="Typische Prüfungsfehler – vor jeder Übungsklausur wiederholen"
          >
            <Icon name="triangle-alert" /> Fallen wiederholen ({traps.length})
          </button>
        )}
      </div>

      {content.cardHints.length > 0 && (
        <ul className="hint">
          {content.cardHints.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}

      {content.decks.length > 0 && (
        <section className="card">
          <h2>Decks</h2>
          <div className="table-wrap">
            <table className="stats">
              <thead>
                <tr>
                  <th>Deck</th>
                  <th className="nur-breit">Prüfungsbereich</th>
                  <th className="nur-breit">Quelle</th>
                  <th>Karten</th>
                  <th>sicher</th>
                  <th>fällig</th>
                </tr>
              </thead>
              <tbody>
                {content.decks.map((d) => {
                  const cards = pool.filter((c) => c.deckId === d.id && (!leichtModus || leicht.has(c.id)));
                  const dueCount = cards.filter((c) => progress.cards[c.id] && isDue(progress.cards[c.id].due)).length;
                  return (
                    <tr key={d.id}>
                      <td>
                        <a
                          href={`#/karteikarten?deck=${d.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            set({ deck: d.id, thema: 'alle' });
                          }}
                        >
                          {d.title}
                        </a>
                        {d.status === 'offen' && <span className="badge muted"> ohne Deep Dive</span>}
                      </td>
                      <td className="small nur-breit">{d.area}</td>
                      <td className="small muted nur-breit">{d.source}</td>
                      <td>{cards.length}</td>
                      <td>{known(cards)}</td>
                      <td>{dueCount || ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className="hint">
        Leitner-System mit 5 Fächern: „Gewusst" schiebt die Karte ein Fach weiter (Abstände 1 · 3 · 7 · 14 · 30 Tage), „Nicht gewusst"
        zurück in Fach 1. Tastatur: <kbd>Leertaste</kbd> umdrehen, <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> bewerten. Im Leicht-Modus wählst
        du mit <kbd>1</kbd>–<kbd>4</kbd>; richtig bringt die Karte höchstens in Fach {LEICHT_MAX_BOX}, falsch zurück in Fach 1.{' '}
        <Icon name="book-open" />
        Durchblättern zeigt die Karten nur an (<kbd>←</kbd> <kbd>→</kbd> blättern, auf dem Handy wischen) und ändert den Lernstand nicht.{' '}
        <Icon name="star" />
        Mit dem Stern oder <kbd>M</kbd> markierst du schwierige Karten; „Nur markierte“ im Filter holt sie zurück. Markieren ändert das Fach
        nicht.
      </p>
    </div>
  );
}

/**
 * Hülle, die bei jeder neuen Karte neu entsteht (`id` als key) und sie hereingleiten lässt – getrennt von .flashcard, damit das
 * Umdrehen (eigene Animation auf .flashcard) den Wechsel nicht noch einmal abspielt.
 */
function KartenWechsel({ id, zurueck = false, children }: { id: string; zurueck?: boolean; children: ReactNode }) {
  return (
    <div key={id} className={`karte-wechsel ${zurueck ? 'zurueck' : ''}`}>
      {children}
    </div>
  );
}

/**
 * Durchblättern: alle Karten der Auswahl nacheinander ansehen, vor und zurück, ohne Bewertung (Lernstand bleibt unverändert).
 * Tastatur: ← → blättern, Leertaste/Enter umdrehen, Esc beenden. Auf dem Handy nach links/rechts wischen.
 */
export function KartenBlaettern({ cards, onEnde }: { cards: Flashcard[]; onEnde: () => void }) {
  const { content } = useStore();
  const [gemischt, setGemischt] = useState(false);
  const [antwortZeigen, setAntwortZeigen] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // Richtung des letzten Blätterns: Die neue Karte kommt von rechts (weiter) oder von links (zurück).
  const [zurueck, setZurueck] = useState(false);
  const reihe = useMemo(() => (gemischt ? shuffle(cards) : cards), [cards, gemischt]);
  const i = Math.min(index, reihe.length - 1);
  const card = reihe[i];
  const offen = antwortZeigen || flipped;
  const gehe = (neu: number) => {
    setZurueck(neu < i);
    setIndex(Math.max(0, Math.min(reihe.length - 1, neu)));
    setFlipped(false);
  };
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('input, select, textarea, [contenteditable="true"]')) return;
      if (e.key === 'ArrowRight') gehe(i + 1);
      else if (e.key === 'ArrowLeft') gehe(i - 1);
      else if (e.key === 'Escape') onEnde();
      else if ((e.key === ' ' || e.key === 'Enter') && !target?.closest('button, a, [role="button"]')) {
        e.preventDefault();
        setFlipped((x) => !x);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!card) return null;
  const topic = content.topics.find((t) => t.id === card.topicId);
  const cardDeck = content.decks.find((d) => d.id === card.deckId);
  return (
    <div className="page narrow">
      <div className="session-head">
        <button type="button" className="ghost" onClick={onEnde}>
          ← Beenden
        </button>
        <span>
          <Icon name="book-open" /> Karte {i + 1} / {reihe.length}
        </span>
        <MarkierStern cardId={card.id} taste />
      </div>
      <div className="blaettern-optionen">
        <label className="check">
          <input
            type="checkbox"
            checked={gemischt}
            onChange={(e) => {
              setGemischt(e.target.checked);
              gehe(0);
            }}
          />
          gemischt
        </label>
        <label className="check">
          <input type="checkbox" checked={antwortZeigen} onChange={(e) => setAntwortZeigen(e.target.checked)} />
          Antwort gleich zeigen
        </label>
        {reihe.length > 1 && (
          <input
            type="range"
            min={1}
            max={reihe.length}
            value={i + 1}
            aria-label="Zu Karte springen"
            onChange={(e) => gehe(Number(e.target.value) - 1)}
          />
        )}
      </div>
      <KartenWechsel id={`${gemischt}-${i}`} zurueck={zurueck}>
        <div
          className={`flashcard ${offen ? 'flipped' : ''} ${card.typ === 'falle' ? 'trap' : ''}`}
          role="button"
          tabIndex={0}
          aria-expanded={offen}
          onClick={() => setFlipped((x) => !x)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            if (!e.repeat) setFlipped((x) => !x);
          }}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 60) gehe(dx < 0 ? i + 1 : i - 1);
          }}
        >
          <div className="fc-meta">
            <span>
              <Icon name={KIND_ICONS[card.kind]} /> {KIND_LABELS[card.kind]} · {cardDeck?.title ?? topic?.title}
            </span>
            {card.typ && <span className={`badge typ-${card.typ}`}>{CARD_TYPE_LABELS[card.typ]}</span>}
          </div>
          <KartenFrage card={card} />
          {offen ? (
            <div className="fc-answer">
              {card.answer ? <KartenAntwort card={card} /> : <p className="muted">Keine Musterantwort im Lernblatt.</p>}
            </div>
          ) : (
            <p className="hint">Klicken oder Leertaste zum Umdrehen.</p>
          )}
        </div>
      </KartenWechsel>
      {offen && <SqlUebungLinks card={card} />}
      <div className="actions blaettern-nav">
        <button type="button" className="secondary" disabled={i === 0} onClick={() => gehe(i - 1)}>
          ← Zurück
        </button>
        {i < reihe.length - 1 ? (
          <button type="button" onClick={() => gehe(i + 1)}>
            Weiter →
          </button>
        ) : (
          <button type="button" onClick={onEnde}>
            ✓ Fertig
          </button>
        )}
      </div>
    </div>
  );
}

/** Fortschrittsbalken der Lernrunde (Karte x von y). */
function RundenBalken({ index, gesamt }: { index: number; gesamt: number }) {
  return (
    <div
      className="runden-balken"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={gesamt}
      aria-valuenow={index}
      aria-label="Fortschritt der Runde"
    >
      <div style={{ width: `${Math.min(100, (index / Math.max(1, gesamt)) * 100)}%` }} />
    </div>
  );
}
