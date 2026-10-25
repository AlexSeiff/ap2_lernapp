import { useRef, useState } from 'react';
import { isIsoDate } from '../../shared/progress';
import { IS_STATIC } from '../lib/api';
import { parseBackup } from '../lib/backup';
import { withSettings } from '../lib/settings';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

/** Willkommensseite beim ersten Besuch (noch kein gespeicherter Fortschritt). Verschwindet mit der ersten Änderung. */
export function Welcome() {
  const { update, replaceProgress } = useStore();
  const [examDate, setExamDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const start = () => update((p) => withSettings(p, { examDate: isIsoDate(examDate) ? examDate : undefined }));

  const importBackup = async (file: File) => {
    try {
      // Beim ersten Besuch gibt es nichts zu überschreiben – deshalb ohne Rückfrage.
      replaceProgress(parseBackup(await file.text()));
    } catch (e) {
      setError(`Fehler: ${(e as Error).message}`);
    }
  };

  return (
    <div className="page narrow welcome-page">
      <div className="welcome-symbol" aria-hidden="true">
        <Icon name="graduation-cap" />
      </div>
      <p className="seiten-auftakt">DEIN LERNRAUM</p>
      <h1>Willkommen!</h1>
      <p className="lead">Alles für deine AP2. Ein Ort zum Verstehen, Üben und Weiterkommen.</p>
      <ol className="welcome">
        <li>
          <b>
            <Icon name="graduation-cap" /> Was das ist:
          </b>{' '}
          Eine Lern-App für die IHK-Abschlussprüfung Teil 2 – Fachinformatiker/-in Daten- und Prozessanalyse. Theorie, Karteikarten,
          Übungsklausuren mit Musterlösungen und SQL-Übungen. Ohne Anmeldung.
        </li>
        <li>
          <b>
            <Icon name="save" /> Dein Fortschritt
          </b>{' '}
          bleibt nur {IS_STATIC ? 'in diesem Browser' : 'auf diesem Rechner'} – lade ab und zu eine Sicherung herunter (
          <i>Daten &amp; Import</i>). Mit der Sicherung kannst du auch auf ein anderes Gerät umziehen.
        </li>
        <li>
          <b>
            <Icon name="calendar" /> Optional:
          </b>{' '}
          Trag deinen Prüfungstermin ein, dann zählt die Übersicht die Tage herunter. Das geht auch später unter
          <i>
            {' '}
            <Icon name="settings" /> Einstellungen
          </i>
          .
          <label className="field">
            Datum der schriftlichen AP2
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
          </label>
        </li>
      </ol>
      {error && (
        <p className="card warn" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <button type="button" onClick={start}>
          Los geht&apos;s
        </button>
        <button type="button" className="secondary" onClick={() => fileRef.current?.click()}>
          <Icon name="upload" /> Sicherung einspielen
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])}
        />
      </div>
    </div>
  );
}
