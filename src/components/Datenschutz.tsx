import { Icon } from './Icon';

/** Kurzer Datenschutz-Hinweis (Einstellungen), dazu die Lizenz der Lerninhalte (Frage Q4: CC BY-NC-SA 4.0, LIZENZ-INHALTE.txt). */
export function Datenschutz() {
  return (
    <section className="card" id="datenschutz">
      <h2>
        <Icon name="lock" /> Datenschutz
      </h2>
      <ul>
        <li>Kein Konto, keine Anmeldung.</li>
        <li>Kein Tracking, keine Statistik-Tools, keine Cookies, keine Werbung.</li>
        <li>
          Dein Fortschritt und deine Einstellungen bleiben <b>nur in diesem Browser</b> (localStorage) und werden nirgendwohin übertragen.
          Löschst du die Browserdaten, sind sie weg – lade deshalb ab und zu eine Sicherung herunter.
        </li>
        <li>
          Geladen werden nur die App und die Lerninhalte von GitHub Pages – nichts von anderen Anbietern. Wie bei jeder Website sieht der
          Hoster (GitHub) dabei technisch nötige Verbindungsdaten wie deine IP-Adresse.
        </li>
        <li>Die Lerninhalte sind öffentlich und für alle gleich.</li>
        <li>
          Links zu Quellen (z. B. Studyflix, Wikipedia, Gesetzestexte) öffnen die fremde Seite in einem neuen Tab – erst dann gelten deren
          Datenschutzregeln. Eingebettete YouTube-Videos laden erst nach einem Klick auf „Video laden“ und dann über youtube-nocookie.com;
          vorher wird keine Verbindung zu YouTube oder Google aufgebaut.
        </li>
      </ul>
      <p className="muted">
        Die Lerninhalte stehen unter{' '}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de" target="_blank" rel="noopener noreferrer">
          CC BY-NC-SA 4.0
        </a>{' '}
        – weitergeben und bearbeiten erlaubt, mit Namensnennung, nicht kommerziell, unter derselben Lizenz. Ausgenommen sind Inhalte Dritter
        wie Zitate und verlinkte Quellen.
      </p>
    </section>
  );
}
