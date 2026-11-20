import { useRef } from 'react';
import type { Flashcard } from '../../../domain/types';
import type { useCardSession } from '../../hooks/useCardSession';
import { AntwortVergleich, EigeneAntwortFeld } from '../../components/EigeneAntwort';
import { Icon } from '../../components/Icon';
import { KartenAntwort, KartenFrage } from '../../components/KartenText';
import { KartenWechsel } from '../../components/KartenWechsel';
import { MarkierStern } from '../../components/MarkierStern';
import { SqlUebungLinks } from '../../components/SqlUebungLinks';
import { useStore } from '../../lib/store';
import { CARD_TYPE_LABELS, KIND_ICONS, KIND_LABELS, LEVEL_LABELS, typKlasse } from './kartenAnzeige';
import { RundenBalken } from './RundenBalken';

type Sitzung = ReturnType<typeof useCardSession>;

/** Eine Karte im Aufdecken-Modus: Frage, umdrehen, Lösung vergleichen und bewerten (Leitner). */
export function AufdeckRunde({
  card,
  index,
  anzahl,
  flipped,
  flip,
  rate,
  end,
  eigeneAntwort,
  setEigeneAntwort,
  kannRueckgaengig,
  rueckgaengig,
}: {
  card: Flashcard;
  index: number;
  anzahl: number;
  flipped: boolean;
  flip: () => void;
  rate: Sitzung['rate'];
  end: () => void;
  eigeneAntwort: string;
  setEigeneAntwort: (s: string) => void;
  kannRueckgaengig: boolean;
  rueckgaengig: () => void;
}) {
  const { content } = useStore();
  const touch = useRef<{ x: number; y: number } | null>(null);
  const topic = content.topics.find((t) => t.id === card.topicId);
  const cardDeck = content.decks.find((d) => d.id === card.deckId);
  return (
    <div className="page narrow">
      <div className="session-head">
        <button type="button" className="ghost" onClick={end}>
          ← Beenden
        </button>
        <span>
          Karte {index + 1} / {anzahl}
        </span>
        {kannRueckgaengig && (
          <button type="button" className="ghost" onClick={rueckgaengig} title="Letzte Bewertung zurücknehmen (Taste U)">
            <Icon name="rotate-ccw" /> Rückgängig
          </button>
        )}
        <MarkierStern id={card.id} taste />
      </div>
      <RundenBalken index={index} gesamt={anzahl} />
      {/* Kein <button>: die Karte enthält Markdown mit Absätzen, Listen und Codeblöcken – das ist in einem Button ungültig. */}
      <KartenWechsel id={String(index)}>
        <div
          className={`flashcard ${flipped ? 'flipped' : ''} ${typKlasse(card)}`}
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
          <div className={`paper-turn ${flipped ? 'is-turned' : ''}`}>
            <div className="paper-face paper-front" aria-hidden={flipped} inert={flipped}>
              <KartenFrage card={card} />
              {card.typ === 'rechnung' && (
                <p className="hint">
                  <Icon name="pencil" /> Erst auf Papier rechnen, dann umdrehen.
                </p>
              )}
              <p className="hint">Leertaste oder klicken · Karte umdrehen ↻</p>
            </div>
            <div className="paper-face paper-back" aria-hidden={!flipped} inert={!flipped}>
              <p className="fc-label">Rückseite · Lösung</p>

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
            </div>
          </div>
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
