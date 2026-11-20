import { useEffect, useMemo, useRef, useState } from 'react';
import type { Flashcard } from '../../../domain/types';
import { Icon } from '../../components/Icon';
import { KartenAntwort, KartenFrage } from '../../components/KartenText';
import { KartenWechsel } from '../../components/KartenWechsel';
import { MarkierStern } from '../../components/MarkierStern';
import { SqlUebungLinks } from '../../components/SqlUebungLinks';
import { shuffle } from '../../lib/shuffle';
import { useStore } from '../../lib/store';
import { CARD_TYPE_LABELS, KIND_ICONS, KIND_LABELS, typKlasse } from './kartenAnzeige';

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
        <MarkierStern id={card.id} taste />
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
          className={`flashcard ${offen ? 'flipped' : ''} ${typKlasse(card)}`}
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
          <div className={`paper-turn ${offen ? 'is-turned' : ''}`}>
            <div className="paper-face paper-front" aria-hidden={offen} inert={offen}>
              <KartenFrage card={card} />
              <p className="hint">Klicken oder Leertaste zum Umdrehen ↻</p>
            </div>
            <div className="paper-face paper-back" aria-hidden={!offen} inert={!offen}>
              <p className="fc-label">Rückseite · Lösung</p>
              <div className="fc-answer">
                {card.answer ? <KartenAntwort card={card} /> : <p className="muted">Keine Musterantwort im Lernblatt.</p>}
              </div>
            </div>
          </div>
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
