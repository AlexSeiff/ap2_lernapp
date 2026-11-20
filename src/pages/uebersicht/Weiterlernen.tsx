import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeuteSchritte } from '../../components/HeuteSchritte';
import { useHeuteSitzung } from '../../hooks/useHeute';
import { planeHeute } from '../../lib/heute';
import { istFertig, schonDran, setzeSchrittErledigt, setzeSitzung, starteSitzung } from '../../lib/heuteSitzung';
import { leseDauer } from '../../lib/heuteZeit';
import { holeLeseStelle } from '../../lib/leseStelle';
import { istAusgeblendet } from '../../lib/settings';
import { localDate } from '../../lib/progress';
import { useDetailsWennDa } from '../../lib/details';
import { useStartStore } from '../../lib/store';
import { Icon } from '../../components/Icon';

/** „Weiterlernen“: Einstieg in „Heute lernen“ (ROADMAP 8.1; läuft schon eine Runde, geht es dort weiter) und die letzte Lesestelle. */
export function Weiterlernen() {
  const { content, progress } = useStartStore();
  const sitzung = useHeuteSitzung();
  const laeuft = sitzung && !istFertig(sitzung);
  const voll = useDetailsWennDa();
  const today = localDate();
  const dauer = leseDauer();
  const schritte = useMemo(
    () =>
      sitzung?.items.length
        ? sitzung.items
        : voll && planeHeute(voll, progress, { today, minuten: dauer, ausschliessen: sitzung && schonDran(sitzung) }).items,
    [sitzung, voll, progress, today, dauer],
  );
  const [stelle] = useState(holeLeseStelle);
  const topic = stelle && !istAusgeblendet(progress.settings, stelle.topicId) && content.topics.find((t) => t.id === stelle.topicId);
  const abschnitt = topic && topic.sections.find((s) => s.id === stelle.sectionId);
  return (
    <section className="raster blatt-teil">
      <div className="knopfzeile heute-start">
        <h2>
          <Link className="button weiterlernen" to="/heute">
            <Icon name="play" />
            <span>
              Weiterlernen{laeuft && ` · Schritt ${sitzung.index + 1}/${sitzung.items.length}`}
              <small>
                {sitzung && !laeuft && sitzung.items.length > 0
                  ? `Heute erledigt: ${sitzung.erledigt.length} von ${sitzung.items.length} Schritten.`
                  : `Tagesrunde, etwa ${dauer} Minuten.`}
              </small>
            </span>
          </Link>
        </h2>
        {topic && abschnitt ? (
          <Link className="button secondary weiterlesen" to={`/lernen/${topic.id}?stelle=${encodeURIComponent(abschnitt.id)}`}>
            <Icon name="book-open" /> Weiterlesen: {topic.id === '00' ? 'Zusatz' : `DD ${topic.number}`} · {abschnitt.title}
          </Link>
        ) : (
          <Link className="button secondary weiterlesen" to="/lernen">
            <Icon name="book-open" /> Lernblätter ansehen
          </Link>
        )}
      </div>
      {!!schritte?.length && (
        <HeuteSchritte
          items={schritte}
          index={sitzung?.items.length ? sitzung.index : 0}
          maxIndex={sitzung?.maxIndex}
          erledigt={sitzung?.erledigt}
          uebersprungen={sitzung?.uebersprungen}
          onAbhaken={(key, erledigt) => {
            const runde = sitzung?.items.length ? sitzung : starteSitzung(schritte, today, sitzung);
            setzeSitzung(setzeSchrittErledigt(runde, key, erledigt));
          }}
        />
      )}
    </section>
  );
}
