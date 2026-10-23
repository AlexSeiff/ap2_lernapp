// Umblättern beim Kartenwechsel (Karteikarten, Leicht-Modus, Durchblättern): Die bisherige Karte bleibt kurz als stilles Abbild
// liegen und schlägt nach links um wie eine Buchseite; darunter liegt schon die neue. Zurück: Die neue Karte schlägt von links her zu,
// das Abbild der alten sinkt darunter weg.
// Das Abbild ist eine DOM-Kopie aus getSnapshotBeforeUpdate (also vor dem Austausch – danach gibt es die alte Karte nicht mehr). Sie
// liegt in einer eigenen Ebene, deren Inhalt React nie anfasst, und verschwindet nach der Animation. Deshalb eine Klassenkomponente:
// Nur sie kommt vor dem Austausch an das alte DOM. Bei „Bewegung reduzieren“ endet die Animation sofort (styles.css).

import { Component, createRef, type ReactNode } from 'react';

interface Props {
  /** Wechselt mit jeder Karte; eine neue id blättert um. */
  id: string;
  /** Zurückblättern (Durchblättern mit ← oder Wischen nach rechts). */
  zurueck?: boolean;
  children: ReactNode;
}

/** Höchstens so lange bleibt ein Abbild liegen, falls `animationend` ausbleibt. */
const ABBILD_MAX_MS = 1000;

export class KartenWechsel extends Component<Props> {
  private ebene = createRef<HTMLDivElement>();
  private seite = createRef<HTMLDivElement>();

  getSnapshotBeforeUpdate(vorher: Props): HTMLElement | null {
    if (vorher.id === this.props.id || !this.seite.current) return null;
    return this.seite.current.cloneNode(true) as HTMLElement;
  }

  componentDidUpdate(_vorher: Props, _zustand: unknown, abbild: HTMLElement | null) {
    const ebene = this.ebene.current;
    if (!abbild || !ebene) return;
    ebene.replaceChildren();
    ebene.dataset.art = this.props.zurueck ? 'darunter' : 'weg';
    abbild.className = 'blatt-abbild';
    abbild.setAttribute('aria-hidden', 'true');
    abbild.inert = true;
    ebene.append(abbild);
    const weg = () => abbild.remove();
    abbild.addEventListener('animationend', weg, { once: true });
    setTimeout(weg, ABBILD_MAX_MS);
  }

  render() {
    const { id, zurueck, children } = this.props;
    return (
      <div className="karte-wechsel">
        <div ref={this.ebene} className="blatt-ebene" aria-hidden="true" />
        <div key={id} ref={this.seite} className={`blatt-seite ${zurueck ? 'kommt-zurueck' : 'liegt-unten'}`}>
          {children}
        </div>
      </div>
    );
  }
}
