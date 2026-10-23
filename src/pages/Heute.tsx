import { type CSSProperties, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHeuteSitzung } from '../hooks/useHeute';
import { HEUTE_ICONS, planeHeute, type HeuteItem } from '../lib/heute';
import { aktuellerSchritt, beende, istFertig, schonDran, setzeSitzung, starteSitzung, weiter } from '../lib/heuteSitzung';
import { HEUTE_DAUERN, leseDauer, speichereDauer } from '../lib/heuteZeit';
import { planeLernplan } from '../lib/lernplan';
import { addDays, localDate } from '../lib/progress';
import { formatIsoDate } from '../lib/stats';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icon';

const ART_TEXT: Record<HeuteItem['art'], string> = {
  wiederholung: 'Fehlerjournal',
  aufgabe: 'schwächstes Thema',
  sql: 'SQL-Übung',
  rechnen: 'Rechenübung',
  diagramm: 'Diagramm-Übung',
  karten: 'Karteikarten',
};

/** „▶ Heute lernen“ (ROADMAP 8.1): Plan der Tagesrunde, Start und Stand. Die Schritte selbst laufen in den normalen Seiten. */
export function Heute() {
  const { content, progress } = useStore();
  const navigate = useNavigate();
  const sitzung = useHeuteSitzung();
  const today = localDate();
  const [dauer, setDauer] = useState(leseDauer);
  // Nur planen, wenn keine Runde läuft – sonst bliebe der Plan nicht stehen, während du lernst.
  const laeuft = sitzung && !istFertig(sitzung);
  // Was frühere Runden von heute schon hatten, plant „Noch eine Runde“ nicht noch einmal.
  const frueher = useMemo(() => (sitzung && !laeuft ? schonDran(sitzung) : undefined), [sitzung, laeuft]);
  const plan = useMemo(
    () => (laeuft ? undefined : planeHeute(content, progress, { today, minuten: dauer, ausschliessen: frueher })),
    [laeuft, content, progress, today, dauer, frueher],
  );

  const starte = (items: HeuteItem[]) => {
    setzeSitzung(starteSitzung(items, today, sitzung));
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
          <button type="button" className="ghost" onClick={() => setzeSitzung(beende(sitzung))}>
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

  // Eine beendete Runde hat keine Schritte mehr – dann keine Erfolgsmeldung, nur der neue Plan.
  const fertig = sitzung && istFertig(sitzung) && sitzung.items.length > 0;
  const morgenTag = addDays(today, 1);
  const morgen =
    Object.values(progress.cards).filter((c) => c.due === morgenTag).length +
    Object.values(progress.journal).filter((j) => !j.resolvedAt && j.due === morgenTag).length;
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
          {morgen > 0 && ` Morgen warten ${morgen} ${morgen === 1 ? 'Wiederholung' : 'Wiederholungen'} auf dich.`}
        </p>
      )}
      <div className="actions" role="group" aria-label="Dauer der Runde">
        {HEUTE_DAUERN.map((m) => (
          <button
            key={m}
            type="button"
            className={m === dauer ? '' : 'secondary'}
            aria-pressed={m === dauer}
            onClick={() => {
              speichereDauer(m);
              setDauer(m);
            }}
          >
            {m} min
          </button>
        ))}
      </div>
      <p className="lead">
        Eine gemischte Runde von etwa {dauer} Minuten aus dem, was gerade dran ist: Fehlerjournal, fällige Karteikarten, eine SQL- oder
        Rechenübung und eine Aufgabe aus deinem schwächsten Thema. Die Themen wechseln sich ab – das bleibt besser hängen.
      </p>
      {plan && plan.items.length > 0 ? (
        <>
          <div className="actions">
            <button type="button" onClick={() => starte(plan.items)}>
              <Icon name="play" /> {fertig ? 'Noch eine Runde' : "Los geht's"} (~{Math.round(plan.minuten)} min)
            </button>
            {fertig && dauer > 10 && (
              <button
                type="button"
                className="secondary"
                onClick={() => starte(planeHeute(content, progress, { today, minuten: 10 }).items)}
              >
                Noch 10 Minuten
              </button>
            )}
          </div>
          <Schritte items={plan.items} />
          <p className="hint">
            Zeiten sind grobe Schätzungen. Jeder Schritt öffnet die passende Seite; dort lernst du wie gewohnt, danach geht es von selbst
            weiter.
          </p>
        </>
      ) : (
        <p className="muted">Gerade gibt es nichts zu planen – schau in die Karteikarten oder starte eine Übungsklausur.</p>
      )}
      <LernplanKarte />
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
          <li key={it.key} className={status === 'aktuell' ? 'aktuell' : status ? 'erledigt' : ''} style={{ '--i': i } as CSSProperties}>
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

/** Lernplan bis zum Prüfungstermin (lib/lernplan.ts): Schwerpunktthemen je Woche und nötiges Kartentempo. */
function LernplanKarte() {
  const { content, progress } = useStore();
  const plan = useMemo(() => planeLernplan(content, progress, localDate()), [content, progress]);
  if (!plan)
    return (
      <section className="card">
        <h2>
          <Icon name="calendar" /> Lernplan
        </h2>
        <p className="muted">
          Trage unter <Link to="/einstellungen">Einstellungen</Link> deinen Prüfungstermin ein – dann verteilt die App die Themen auf die
          Wochen bis dahin.
        </p>
      </section>
    );
  return (
    <section className="card">
      <h2>
        <Icon name="calendar" /> Lernplan – noch {plan.tage} {plan.tage === 1 ? 'Tag' : 'Tage'}
      </h2>
      {plan.kartenOffen > 0 ? (
        <p>
          Ziel: {plan.kartenZiel} Karten sicher (Fach 3+). Dir fehlen noch <b>{plan.kartenOffen}</b> – das sind etwa{' '}
          <b>{plan.kartenProTag} Karten pro Tag</b>.
        </p>
      ) : (
        <p>Kartenziel erreicht – jetzt Fehlerjournal, Aufgaben und Übungsklausuren.</p>
      )}
      <ol className="lernplan">
        {plan.wochen.map((w) => (
          <li key={w.nummer}>
            <b>Woche {w.nummer}</b> <span className="muted small">ab {formatIsoDate(w.ab)}</span>
            <ul className="plain">
              {w.themen.map((t) => (
                <li key={t.id}>
                  <Link to={`/lernen/${t.id}`}>{t.titel}</Link>
                  <span className="muted small"> · {t.stand === undefined ? 'noch keine Daten' : `Stand ${Math.round(t.stand)} %`}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="hint">
        Die letzten Tage vor der Prüfung bleiben für Wiederholung und Übungsklausuren frei. Schwächere und größere Themen bekommen mehr
        Wochen.
      </p>
    </section>
  );
}
