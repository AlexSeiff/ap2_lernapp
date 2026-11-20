import type { Flashcard } from '../../../domain/types';
import type { useCardFilters } from '../../hooks/useCardSession';
import { isDue } from '../../lib/progress';
import { useStore } from '../../lib/store';

type Filter = ReturnType<typeof useCardFilters>;

/** Tabelle der Decks mit Kartenzahl, sicheren und fälligen Karten; ein Klick auf den Decknamen filtert danach. */
export function DeckTabelle({
  pool,
  leichtModus,
  leicht,
  set,
  known,
}: {
  pool: Flashcard[];
  leichtModus: boolean;
  leicht: Filter['leicht'];
  set: Filter['set'];
  known: (karten: Flashcard[]) => number;
}) {
  const { content, progress } = useStore();
  if (!content.decks.length) return null;
  return (
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
  );
}
