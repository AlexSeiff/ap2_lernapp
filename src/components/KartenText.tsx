import type { Flashcard } from '../../shared/types';
import { pruefeSvg } from '../../shared/svgDiagramm';
import { useStore } from '../lib/store';
import { begriffsFrage, bereichAusDeck } from '../lib/begriffsFrage';
import { Icon } from './Icon';
import { Markdown } from './Markdown';
import { SvgDiagramm } from './SvgDiagramm';

// Vorder- und Rückseite einer Karteikarte, je nach Art gestaltet: Fachbegriffe als Begriff mit Aufforderung, Fragen mit „Frage“-Etikett,
// Rechnungen mit Formelsatz (KaTeX) und eigenem „Rechnung“-Kasten. Gilt in allen Kartenansichten (Lernen, Leicht, Blättern).

const istBegriff = (c: Flashcard) => c.typ === 'begriff';
const istFrage = (c: Flashcard) => c.kind !== 'lernkarte' || !(c.typ === 'begriff' || c.typ === 'rechnung');

/** Kontext der Frage: Thema bzw. Deck und Prüfungsbereich (z. B. „SQL · Sicherstellen der Datenqualität“). */
function Kontext({ card }: { card: Flashcard }) {
  const { content } = useStore();
  const deck = content.decks.find((d) => d.id === card.deckId);
  const thema = content.topics.find((t) => t.id === card.topicId)?.title;
  const teile = [bereichAusDeck(deck?.title) ?? thema, deck?.area].filter((t, i, a): t is string => !!t && a.indexOf(t) === i);
  if (!teile.length) return null;
  return <p className="fc-kontext">Kontext: {teile.join(' · ')}</p>;
}

export function KartenFrage({ card }: { card: Flashcard }) {
  const { content } = useStore();
  if (istBegriff(card)) {
    return (
      <div className="fc-vorne frage">
        <p className="fc-label">
          <Icon name="circle-question-mark" /> Frage
        </p>
        <Markdown math className="fc-question">
          {begriffsFrage(card.question, card.answer, bereichAusDeck(content.decks.find((d) => d.id === card.deckId)?.title))}
        </Markdown>
        <Kontext card={card} />
      </div>
    );
  }
  const rechnung = card.typ === 'rechnung';
  return (
    <div className={`fc-vorne ${rechnung ? 'rechnung' : 'frage'}`}>
      <p className="fc-label">
        <Icon name={rechnung ? 'calculator' : 'circle-question-mark'} /> {rechnung ? 'Rechenaufgabe' : istFrage(card) ? 'Frage' : ''}
      </p>
      <Markdown math className="fc-question">
        {card.question}
      </Markdown>
      <Kontext card={card} />
    </div>
  );
}

export function KartenAntwort({ card }: { card: Flashcard }) {
  const rechnung = card.typ === 'rechnung';
  return (
    <div className={`fc-hinten ${rechnung ? 'rechnung' : ''}`}>
      {rechnung && (
        <p className="fc-label">
          <Icon name="calculator" /> Rechenweg &amp; Ergebnis
        </p>
      )}
      <Markdown math>{(rechnung && card.rechenweg) || card.answer || ''}</Markdown>
      {card.diagramm && !pruefeSvg(card.diagramm) && <SvgDiagramm svg={card.diagramm} />}
    </div>
  );
}
