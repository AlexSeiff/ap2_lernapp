import { Link } from 'react-router-dom';
import { Strichliste } from '../../components/Kaestchen';
import { daysUntilExam, formatIsoDate, studyStreak } from '../../lib/stats';
import { useStartStore } from '../../lib/store';
import { Icon } from '../../components/Icon';

/** Countdown bis zum eigenen Prüfungstermin; ohne Termin ein Link zum Eintragen. */
export function Countdown() {
  const { progress } = useStartStore();
  const { examDate } = progress.settings;
  const days = daysUntilExam(examDate);
  if (days === undefined || !examDate)
    return (
      <Link to="/einstellungen" className="haft">
        <span>Prüfung</span>
        <b>
          <Icon name="calendar" />
        </b>
        <span>Prüfungstermin eintragen →</span>
      </Link>
    );
  return (
    <Link to="/einstellungen" className="haft w-countdown" title="Prüfungstermin ändern">
      <span>{days > 0 ? 'Prüfung in' : 'Prüfung'}</span>
      <b>{days > 1 ? `${days} Tagen` : days === 1 ? '1 Tag' : days === 0 ? 'Heute!' : '–'}</b>
      <span>
        {days > 1
          ? `Tage bis zur Prüfung (${formatIsoDate(examDate)})`
          : days === 1
            ? `Tag bis zur Prüfung (${formatIsoDate(examDate)})`
            : days === 0
              ? 'Prüfungstag – viel Erfolg!'
              : `Prüfung am ${formatIsoDate(examDate)} vorbei · neuen Termin eintragen →`}
      </span>
    </Link>
  );
}

export function Lernserie() {
  const { progress } = useStartStore();
  const streak = studyStreak(progress);
  return (
    <div className="haft gruen w-serie" title="Tage in Folge mit Aufgaben, Klausuren, Karteikarten, SQL-, Rechen- oder Diagramm-Übungen">
      <span>Lernserie</span>
      <b>
        {streak.current > 0 && <Icon name="flame" />}
        {streak.current} {streak.current === 1 ? 'Tag' : 'Tage'}
      </b>
      <Strichliste n={streak.current} />
      <span>
        {streak.current > 0 && !streak.today ? 'heute noch lernen, sonst reißt sie' : streak.today ? 'heute schon gelernt' : 'in Folge'}
        {streak.longest > streak.current && ` · Rekord ${streak.longest}`}
      </span>
    </div>
  );
}
