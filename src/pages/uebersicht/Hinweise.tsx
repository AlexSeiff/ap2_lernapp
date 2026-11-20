import { useState } from 'react';
import { useBackupDownload } from '../../hooks/useBackupDownload';
import { backupReminder } from '../../lib/backupReminder';
import { kalibrierung } from '../../lib/kalibrierung';
import { useStartStore } from '../../lib/store';
import { SICHER_RICHTIG_AB } from '../../../domain/config';
import { Icon } from '../../components/Icon';

/** Selbsteinschätzung (ROADMAP 8.3): Wie oft lagst du bei „sicher“, „teils“, „unsicher“ richtig? */
export function KalibrierungKarte() {
  const { progress } = useStartStore();
  const k = kalibrierung(progress.attempts);
  if (!k.anzahl) return null;
  const ab = Math.round(SICHER_RICHTIG_AB * 100);
  return (
    <section className="card">
      <h2>
        <Icon name="target" /> Selbsteinschätzung
      </h2>
      <ul className="plain">
        {k.stufen
          .filter((s) => s.anzahl > 0)
          .reverse()
          .map((s) => (
            <li key={s.stufe}>
              Bei „{s.kurz}“ lagst du in <b>{Math.round(s.quote!)} %</b> richtig{' '}
              <span className="muted small">
                ({s.richtig} von {s.anzahl} {s.anzahl === 1 ? 'Aufgabe' : 'Aufgaben'} · Ø {Math.round(s.schnitt!)} % der Punkte)
              </span>
            </li>
          ))}
      </ul>
      {k.hinweis === 'zu-sicher' && (
        <p className="bad">
          <Icon name="triangle-alert" /> Vorsicht, falsche Sicherheit: Prüf bei „sicher“ genauer, ob du den Operator und alle Teilfragen
          beantwortet hast.
        </p>
      )}
      {k.hinweis === 'unterschaetzt' && (
        <p className="ok">
          <Icon name="lightbulb" /> Du kannst mehr, als du denkst – auch bei „unsicher“ lagst du meist richtig.
        </p>
      )}
      {k.hinweis === 'passt' && (
        <p className="ok">
          <Icon name="thumbs-up" /> Deine Einschätzung passt gut zu deinen Ergebnissen.
        </p>
      )}
      <p className="hint">
        „Richtig“ heißt mindestens {ab} % der Punkte. Gezählt werden Aufgaben, bei denen du vor dem Abgeben „Wie sicher bist du?“
        beantwortet hast.
      </p>
    </section>
  );
}

/** Erinnerung, eine Sicherung herunterzuladen (nach settings.backupReminderDays mit mindestens einem Lerntag seitdem). */
export function BackupBanner() {
  const { progress } = useStartStore();
  const downloadBackup = useBackupDownload();
  const [later, setLater] = useState(false);
  const reminder = !later ? backupReminder(progress) : undefined;
  if (!reminder) return null;
  return (
    <div className="card warn actions" role="status">
      <span>
        <Icon name="save" />{' '}
        {reminder.lastDownload ? `Letzte Sicherung vor ${reminder.daysSince} Tagen` : 'Du hast noch keine Sicherung heruntergeladen'} – dein
        Fortschritt liegt nur in diesem Browser.
      </span>
      <button type="button" onClick={downloadBackup}>
        <Icon name="download" /> jetzt herunterladen
      </button>
      <button type="button" className="ghost" onClick={() => setLater(true)}>
        Später
      </button>
    </div>
  );
}
