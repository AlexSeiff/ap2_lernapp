import type { useCardFilters } from '../../hooks/useCardSession';
import { Icon } from '../../components/Icon';
import { withSettings } from '../../lib/settings';
import { useStore } from '../../lib/store';
import { CARD_TYPE_LABELS, LEVEL_LABELS } from './kartenAnzeige';

type Filter = ReturnType<typeof useCardFilters>;

/** Aufklappbare Filterbox: Deep Dive, Deck, Kartenart, Typ, Schwierigkeit, Markierte, Altklausur, Prüfer-/Fachgesprächsfragen. */
export function KartenFilter({
  f,
  set,
  leichtModus,
  typLeicht,
  aktiveFilter,
  anzahlMarkiert,
  anzahlAltklausur,
  offen,
  setOffen,
}: {
  f: Filter['f'];
  set: Filter['set'];
  leichtModus: boolean;
  typLeicht: (typ: string) => number;
  aktiveFilter: number;
  anzahlMarkiert: number;
  anzahlAltklausur: number;
  offen: boolean;
  setOffen: (offen: boolean) => void;
}) {
  const { content, progress, update } = useStore();
  const { settings } = progress;
  return (
    <details className="filter-box" open={offen} onToggle={(e) => setOffen(e.currentTarget.open)}>
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
        <label
          className="check"
          title="Karten aus dem Altklausur-Training (Deep Dive 18–33) und Begriffe, die in den Altklausuren vorkommen"
        >
          <input type="checkbox" checked={f.altklausur === '1'} onChange={(e) => set({ altklausur: e.target.checked ? '1' : 'alle' })} />
          <Icon name="file-text" /> Nur Altklausur-Themen ({anzahlAltklausur})
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
  );
}
