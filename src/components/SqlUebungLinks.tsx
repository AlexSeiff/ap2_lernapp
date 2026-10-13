// „Im SQL-Editor üben“ unter einer Karteikarte: Links zu den SQL-Übungen, die die Karte in ihrem Feld „karten“ nennen.

import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { Flashcard } from '../../shared/types';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

export function SqlUebungLinks({ card }: { card: Pick<Flashcard, 'sqlUebungen'> }) {
  const { content } = useStore();
  const uebungen = (card.sqlUebungen ?? []).flatMap((id) => content.sqlExercises.find((e) => e.id === id) ?? []);
  if (!uebungen.length) return null;
  return (
    <p className="sql-ueben small">
      <Icon name="database" /> Im SQL-Editor üben:{' '}
      {uebungen.map((e, i) => (
        <Fragment key={e.id}>
          {i > 0 && ' · '}
          <Link to={`/sql/uebung/${e.id}`}>{e.titel}</Link>
        </Fragment>
      ))}
    </p>
  );
}
