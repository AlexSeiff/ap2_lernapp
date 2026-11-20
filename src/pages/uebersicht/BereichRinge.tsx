import { Kaestchen } from '../../components/Kaestchen';
import { useStartStore } from '../../lib/store';
import { bereichFortschritt, quote, type Anteil } from '../../lib/uebersicht';
import { SICHER_RICHTIG_AB } from '../../../domain/config';
import { Icon } from '../../components/Icon';

const prozent = (a: Anteil) => `${Math.round(quote(a) * 100)} %`;

/** Fortschritt je Prüfungsbereich als ausgemalte Kästchen: oben Karten sicher, darunter Übungen gelöst. */
export function BereichRinge() {
  const { content, progress } = useStartStore();
  const bereiche = bereichFortschritt(content, progress);
  return (
    <section className="raster blatt-teil bereiche">
      <h2>
        <Icon name="target" /> Prüfungsbereiche
      </h2>
      {bereiche.map((b) => (
        <div key={b.bereich.id} className="bereich-balken">
          <p className="balken-kopf">
            <b>{b.bereich.titel}</b>
            <small>
              <span className="punkt k-blau" /> {b.karten.erreicht}/{b.karten.gesamt} Karten · <span className="punkt k-rot" />{' '}
              {b.uebungen.erreicht}/{b.uebungen.gesamt} Übungen
            </small>
          </p>
          <Kaestchen anteil={quote(b.karten)} farbe="blau" label={`${b.bereich.titel}: Karten sicher ${prozent(b.karten)}`} />
          <Kaestchen anteil={quote(b.uebungen)} farbe="rot" label={`${b.bereich.titel}: Übungen gelöst ${prozent(b.uebungen)}`} />
        </div>
      ))}
      <p className="hint">
        Karten ab Fach 3; Übungen: Einzelaufgaben mit mindestens {Math.round(SICHER_RICHTIG_AB * 100)} % der Punkte im letzten Versuch und
        gelöste SQL-, Rechen- und Diagramm-Übungen.
      </p>
    </section>
  );
}
