import type { Flashcard } from '../../../domain/types';
import type { useCardSession } from '../../hooks/useCardSession';
import { Icon } from '../../components/Icon';
import { KartenAntwort, KartenFrage } from '../../components/KartenText';
import { KartenWechsel } from '../../components/KartenWechsel';
import { LeichtOptionen } from '../../components/LeichtOptionen';
import { Markdown } from '../../components/Markdown';
import { MarkierStern } from '../../components/MarkierStern';
import { SqlUebungLinks } from '../../components/SqlUebungLinks';
import { LEICHT_MAX_BOX } from '../../lib/progress';
import { useStore } from '../../lib/store';
import { CARD_TYPE_LABELS } from './kartenAnzeige';
import { KIND_ICONS, KIND_LABELS, typKlasse } from './kartenAnzeige';
import { RundenBalken } from './RundenBalken';

type Sitzung = ReturnType<typeof useCardSession>;

/** Eine Karte im Leicht-Modus: vier Antworten zur Auswahl, danach die ganze Antwort und „Weiter“. */
export function LeichtRunde({
  card,
  index,
  anzahl,
  runde,
  end,
  waehle,
  next,
}: {
  card: Flashcard;
  index: number;
  anzahl: number;
  runde: NonNullable<Sitzung['runde']>;
  end: () => void;
  waehle: Sitzung['waehle'];
  next: () => void;
}) {
  const { content } = useStore();
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
          <Icon name="list-checks" /> Leicht · Karte {index + 1} / {anzahl}
        </span>
        <MarkierStern id={card.id} taste />
      </div>
      <RundenBalken index={index} gesamt={anzahl} />
      <KartenWechsel id={String(index)}>
        <div className={`flashcard leicht ${typKlasse(card)}`}>
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
                  : 'Leider falsch – die Karte kommt in der nächsten Runde wieder.'}
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
