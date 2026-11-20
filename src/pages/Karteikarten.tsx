import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Flashcard } from '../../domain/types';
import { Icon } from '../components/Icon';
import { KartenstandLeiste } from '../components/KartenstandLeiste';
import { useCardFilters, useCardSession } from '../hooks/useCardSession';
import { istAltklausurKarte } from '../lib/altklausur';
import { fallenKarten, rundenKarten } from '../lib/cards';
import { leichtZahlen } from '../lib/leicht';
import { isDue, LEICHT_MAX_BOX } from '../lib/progress';
import { withSettings } from '../lib/settings';
import { useStore } from '../lib/store';
import { NEW_PER_SESSION } from '../../domain/config';
import { AufdeckRunde } from './karten/AufdeckRunde';
import { DeckTabelle } from './karten/DeckTabelle';
import { KartenBlaettern } from './karten/KartenBlaettern';
import { KartenFilter } from './karten/KartenFilter';
import { LeichtRunde } from './karten/LeichtRunde';

export function Karteikarten() {
  const { content, progress, update } = useStore();
  const { f, set, deck, alle, pool, leicht, leichtModus, markiert, altklausur, auswahl, ausSuche, vonBegriff, vonStand } = useCardFilters();
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
  const startRunde = (cards: Flashcard[]) => start(cards, leichtModus ? leicht : null);
  // Der Lernstart bleibt oben sichtbar; gezielt verlinkte Auswahlen zeigen ihre Filter sofort.
  const [filterOffen, setFilterOffen] = useState(() => typeof window !== 'undefined' && window.location.hash.includes('?'));
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
  const naechsteRunde = rundenKarten(due, fresh, NEW_PER_SESSION);

  if (session && card && runde) {
    return <LeichtRunde card={card} index={index} anzahl={session.length} runde={runde} end={end} waehle={waehle} next={next} />;
  }

  if (session && card) {
    return (
      <AufdeckRunde
        card={card}
        index={index}
        anzahl={session.length}
        flipped={flipped}
        flip={flip}
        rate={rate}
        end={end}
        eigeneAntwort={eigeneAntwort}
        setEigeneAntwort={setEigeneAntwort}
        kannRueckgaengig={kannRueckgaengig}
        rueckgaengig={rueckgaengig}
      />
    );
  }

  const traps = fallenKarten(pool, f).filter((c) => !leichtModus || leicht.has(c.id));
  const lz = leichtZahlen(alle, leicht);
  const typLeicht = (typ: string) => pool.filter((c) => c.typ === typ && leicht.has(c.id)).length;
  const setMode = (an: boolean) => update((p) => withSettings(p, { leichtModus: an }));
  const known = (ids: Flashcard[]) => ids.filter((c) => (progress.cards[c.id]?.box ?? 0) >= 3).length;
  const aktiveFilter = [f.thema, f.deck, f.art, f.typ, f.stufe, f.markiert, f.altklausur].filter((x) => x !== 'alle').length;
  const anzahlMarkiert = pool.filter((c) => markiert.has(c.id)).length;
  const anzahlAltklausur = pool.filter((c) => istAltklausurKarte(c, altklausur)).length;

  return (
    <div className="page">
      <h1>Karteikarten</h1>
      {!auswahl && (
        <section className="karten-start" aria-label="Lernrunde starten">
          <div>
            <p className="karten-start-titel">Bereit für deine nächste Runde?</p>
            <p className="muted">
              {due.length} fällig · {fresh.length} neu · {deck.length} Karten in deiner Auswahl
            </p>
            {!!due.length && !!fresh.length && (
              <p className="muted small">Fällige Wiederholungen kommen dran, sobald du jede Karte der Auswahl einmal gesehen hast.</p>
            )}
          </div>
          <button type="button" disabled={!naechsteRunde.length} onClick={() => startRunde(naechsteRunde)}>
            <Icon name="play" /> Lernen starten ({naechsteRunde.length})
          </button>
        </section>
      )}
      {session && (
        <div className="card success actions runde-ende">
          <span>
            Runde beendet: <span className="ok">✓ {done.gewusst} gewusst</span> ·{' '}
            <span className="mid-text">~ {done.unsicher} unsicher</span> · <span className="bad">✗ {done.nicht} nicht gewusst</span>
          </span>
          <Link to="/karteikarten/stand" className="small">
            <Icon name="chart-column" /> Zum Kartenstand
          </Link>
        </div>
      )}
      {auswahl && (
        <div className="card info actions">
          <span>
            <Icon name={ausSuche ? 'search' : vonBegriff ? 'book-bookmark' : vonStand ? 'chart-column' : 'play'} />{' '}
            {ausSuche
              ? `Aus der Suche: ${deck.length} ${deck.length === 1 ? 'Karte' : 'Karten'}.`
              : vonBegriff
                ? `Zum Begriff: ${deck.length} ${deck.length === 1 ? 'Karte' : 'Karten'}.`
                : vonStand
                  ? `Aus dem Kartenstand: ${deck.length} ${deck.length === 1 ? 'Karte' : 'Karten'}.`
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
      <KartenFilter
        f={f}
        set={set}
        leichtModus={leichtModus}
        typLeicht={typLeicht}
        aktiveFilter={aktiveFilter}
        anzahlMarkiert={anzahlMarkiert}
        anzahlAltklausur={anzahlAltklausur}
        offen={filterOffen}
        setOffen={setFilterOffen}
      />
      <div className="kpis drei">
        <div className="kpi farbe-orange">
          <span className="kpi-value">{due.length}</span>
          <span className="kpi-label">fällig</span>
        </div>
        <div className="kpi farbe-sky">
          <span className="kpi-value">{fresh.length}</span>
          <span className="kpi-label">neu</span>
        </div>
        <div className="kpi farbe-green">
          <span className="kpi-value">
            {known(deck)}/{deck.length}
          </span>
          <span className="kpi-label">sicher (ab Fach 3)</span>
        </div>
      </div>
      <KartenstandLeiste cards={alle} thema={f.thema} />
      <div className="actions">
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

      <DeckTabelle pool={pool} leichtModus={leichtModus} leicht={leicht} set={set} known={known} />

      <p className="hint">
        Leitner-System mit 5 Fächern: „Gewusst" schiebt die Karte ein Fach weiter (Abstände 1, 3, 7, 14, 30 Tage), „Nicht gewusst" zurück in
        Fach 1. Tastatur: <kbd>Leertaste</kbd> umdrehen, <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> bewerten. Im Leicht-Modus wählst du mit{' '}
        <kbd>1</kbd>–<kbd>4</kbd>; richtig bringt die Karte höchstens in Fach {LEICHT_MAX_BOX}, falsch zurück in Fach 1.{' '}
        <Icon name="book-open" />
        Durchblättern zeigt die Karten nur an (<kbd>←</kbd> <kbd>→</kbd> blättern, auf dem Handy wischen) und ändert den Lernstand nicht.{' '}
        <Icon name="star" />
        Mit dem Stern oder <kbd>M</kbd> markierst du schwierige Karten; „Nur markierte“ im Filter holt sie zurück. Markieren ändert das Fach
        nicht.
      </p>
    </div>
  );
}
