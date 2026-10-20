import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHeuteSitzung } from '../hooks/useHeute';
import { HEUTE_ICONS, planeHeute, type HeuteItem } from '../lib/heute';
import { aktuellerSchritt, istFertig, setzeSitzung, starteSitzung, weiter } from '../lib/heuteSitzung';
import { localDate } from '../lib/progress';
import { useStore } from '../lib/store';
import { HEUTE_MINUTEN } from '../../shared/config';
import { Icon } from '../components/Icon';

const ART_TEXT: Record<HeuteItem['art'], string> = {
  wiederholung: 'Fehlerjournal',
  aufgabe: 'schwächstes Thema',
  sql: 'SQL-Übung',
  rechnen: 'Rechenübung',
  karten: 'Karteikarten',
};

/** „▶ Heute lernen“ (ROADMAP 8.1): Plan der Tagesrunde, Start und Stand. Die Schritte selbst laufen in den normalen Seiten. */
export function Heute() {
  const { content, progress } = useStore();
  const navigate = useNavigate();
  const sitzung = useHeuteSitzung();
  const today = localDate();
  // Nur planen, wenn keine Runde läuft – sonst bliebe der Plan nicht stehen, während du lernst.
  const laeuft = sitzung && !istFertig(sitzung);
  const plan = useMemo(() => (laeuft ? undefined : planeHeute(content, progress, { today })), [laeuft, content, progress, today]);

  const starte = (items: HeuteItem[]) => {
    setzeSitzung(starteSitzung(items, today));
    navigate(items[0].link);
  };

  if (sitzung && laeuft) {
    const schritt = aktuellerSchritt(sitzung)!;
    const minuten = sitzung.items.slice(sitzung.index).reduce((s, it) => s + it.minuten, 0);
    return (
      <div className="page narrow">
        <h1>
          <Icon name="play" /> Heute lernen
        </h1>
        <p className="lead">
          Schritt {sitzung.index + 1} von {sitzung.items.length} · noch etwa {Math.round(minuten)} min
        </p>
        <div className="actions">
          <Link className="button" to={schritt.link}>
            <Icon name={HEUTE_ICONS[schritt.art]} /> {schritt.titel} →
          </Link>
          <button type="button" className="secondary" onClick={() => setzeSitzung(weiter(sitzung, true))}>
            <Icon name="skip-forward" /> Überspringen
          </button>
          <button type="button" className="ghost" onClick={() => setzeSitzung(undefined)}>
            Runde beenden
          </button>
        </div>
        <Schritte items={sitzung.items} index={sitzung.index} erledigt={sitzung.erledigt} uebersprungen={sitzung.uebersprungen} />
        <p className="hint">
          Sobald ein Schritt geschafft ist (Aufgabe gespeichert, Übung richtig, Karten bewertet), geht es von selbst weiter – oder oben mit
          „Weiter →“.
        </p>
      </div>
    );
  }

  const fertig = sitzung && istFertig(sitzung);
  return (
    <div className="page narrow">
      <h1>
        <Icon name="play" /> Heute lernen
      </h1>
      {fertig && (
        <p className="card success" role="status">
          <Icon name="party-popper" /> Runde geschafft: {sitzung.erledigt.length} {sitzung.erledigt.length === 1 ? 'Schritt' : 'Schritte'}{' '}
          erledigt
          {sitzung.uebersprungen.length > 0 && `, ${sitzung.uebersprungen.length} übersprungen`}. Gut gemacht!
        </p>
      )}
      <p className="lead">
        Eine gemischte Runde von etwa {HEUTE_MINUTEN} Minuten aus dem, was gerade dran ist: Fehlerjournal, fällige Karteikarten, eine SQL-
        oder Rechenübung und eine Aufgabe aus deinem schwächsten Thema. Die Themen wechseln sich ab – das bleibt besser hängen.
      </p>
      {plan && plan.items.length > 0 ? (
        <>
          <div className="actions">
            <button type="button" onClick={() => starte(plan.items)}>
              <Icon name="play" /> {fertig ? 'Noch eine Runde' : "Los geht's"} (~{Math.round(plan.minuten)} min)
            </button>
          </div>
          <Schritte items={plan.items} />
          <p className="hint">
            Zeiten sind grobe Schätzungen. Jeder Schritt öffnet die passende Seite; dort lernst du wie gewohnt und klickst oben auf „Weiter
            →“.
          </p>
        </>
      ) : (
        <p className="muted">Gerade gibt es nichts zu planen – schau in die Karteikarten oder starte eine Übungsklausur.</p>
      )}
    </div>
  );
}

function Schritte({
  items,
  index,
  erledigt = [],
  uebersprungen = [],
}: {
  items: HeuteItem[];
  index?: number;
  erledigt?: string[];
  uebersprungen?: string[];
}) {
  return (
    <ol className="heute-liste">
      {items.map((it, i) => {
        const status = erledigt.includes(it.key)
          ? 'erledigt'
          : uebersprungen.includes(it.key)
            ? 'übersprungen'
            : i === index
              ? 'aktuell'
              : '';
        return (
          <li key={it.key} className={status === 'aktuell' ? 'aktuell' : status ? 'erledigt' : ''}>
            <span className="heute-status" aria-hidden="true">
              {status && <Icon name={status === 'erledigt' ? 'check' : status === 'übersprungen' ? 'skip-forward' : 'play'} />}
            </span>
            {status && <span className="sr-only">{status}: </span>}
            <span>
              <Icon name={HEUTE_ICONS[it.art]} /> {it.titel}
              <span className="muted small">
                {' '}
                · {ART_TEXT[it.art]} · ~{Math.round(it.minuten)} min
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
