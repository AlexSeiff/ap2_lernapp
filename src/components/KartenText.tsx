import type { Flashcard } from '../../shared/types';
import { pruefeSvg } from '../../shared/svgDiagramm';
import { Icon } from './Icon';
import { Markdown } from './Markdown';

// Vorder- und Rückseite einer Karteikarte, je nach Art gestaltet: Fachbegriffe als Begriff mit Aufforderung, Fragen mit „Frage“-Etikett,
// Rechnungen mit Formelsatz (KaTeX) und eigenem „Rechnung“-Kasten. Gilt in allen Kartenansichten (Lernen, Leicht, Blättern).

const istBegriff = (c: Flashcard) => c.typ === 'begriff';
const istFrage = (c: Flashcard) => c.kind !== 'lernkarte' || !(c.typ === 'begriff' || c.typ === 'rechnung');

export function KartenFrage({ card }: { card: Flashcard }) {
  if (istBegriff(card)) {
    return (
      <div className="fc-vorne begriff">
        <p className="fc-label">
          <Icon name="book-open" /> Begriff
        </p>
        <Markdown math className="fc-question fc-term">
          {card.question}
        </Markdown>
        <p className="fc-aufforderung">Erkläre den Begriff in eigenen Worten.</p>
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
      {card.diagramm && !pruefeSvg(card.diagramm) && <figure className="diagramm" dangerouslySetInnerHTML={{ __html: card.diagramm }} />}
    </div>
  );
}
