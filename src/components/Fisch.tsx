import fischGif from '../assets/fisch.gif';

/**
 * Kleiner schwimmender Fisch unten links (reine Deko): fängt keine Klicks ab, ist für Screenreader unsichtbar,
 * fehlt im Druck und bei „Bewegung reduzieren“ (ein GIF lässt sich nicht anhalten).
 */
export function Fisch() {
  return <img className="fisch" src={fischGif} alt="" aria-hidden="true" width={72} height={50} decoding="async" />;
}
