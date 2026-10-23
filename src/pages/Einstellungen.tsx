import { Link } from 'react-router-dom';
import { isIsoDate } from '../../shared/progress';
import { Datenschutz } from '../components/Datenschutz';
import { LernzeitenEinstellung } from '../components/Lernzeiten';
import { IS_STATIC } from '../lib/api';
import { leichtAutomatischAn } from '../lib/leicht';
import { withSettings } from '../lib/settings';
import { daysUntilExam, formatIsoDate } from '../lib/stats';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icon';
import { useTheme } from '../hooks/useTheme';
import { THEMES } from '../lib/theme';

export function Einstellungen() {
  const { progress, update } = useStore();
  const { settings } = progress;
  const days = daysUntilExam(settings.examDate);
  const [theme, setTheme] = useTheme();

  return (
    <div className="page narrow">
      <h1>
        <Icon name="settings" /> Einstellungen
      </h1>
      <p className="lead">Passe die App an dich an. Alles gilt nur für dich.</p>

      <section className="card">
        <h2>
          <Icon name="sun" /> Design
        </h2>
        <div className="mode-switch" role="group" aria-label="Farbschema">
          {THEMES.map((t) => (
            <button key={t.id} type="button" aria-pressed={theme === t.id} onClick={() => setTheme(t.id)}>
              <Icon name={t.id === 'system' ? 'monitor' : t.id === 'light' ? 'sun' : 'moon'} /> {t.label}
            </button>
          ))}
        </div>
        <p className="hint">
          „System“ folgt der Einstellung deines Geräts (hell oder dunkel). Das Farbschema merkt sich jedes Gerät selbst.
        </p>
      </section>

      <section className="card">
        <h2>
          <Icon name="calendar" /> Mein Prüfungstermin
        </h2>
        <p>Trag den Tag deiner schriftlichen Prüfung ein – die Übersicht zählt dann die Tage herunter.</p>
        <div className="actions">
          <label className="field">
            Datum der schriftlichen AP2
            <input
              type="date"
              value={settings.examDate ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || isIsoDate(value)) update((p) => withSettings(p, { examDate: value || undefined }));
              }}
            />
          </label>
          {settings.examDate && (
            <button type="button" className="ghost" onClick={() => update((p) => withSettings(p, { examDate: undefined }))}>
              ✕ Termin entfernen
            </button>
          )}
        </div>
        {days !== undefined && (
          <p className="hint">
            {days > 1
              ? `Noch ${days} Tage.`
              : days === 1
                ? 'Morgen ist es so weit.'
                : days === 0
                  ? 'Heute ist Prüfungstag – viel Erfolg!'
                  : 'Der Termin liegt in der Vergangenheit.'}
          </p>
        )}
      </section>

      <LernzeitenEinstellung />

      <section className="card">
        <h2>
          <Icon name="circle-question-mark" /> Fragen aus den Lernblättern
        </h2>
        <label className="choice">
          <input
            type="checkbox"
            checked={settings.prueferfragen}
            onChange={(e) => update((p) => withSettings(p, { prueferfragen: e.target.checked }))}
          />
          <span>
            <b>
              <Icon name="circle-question-mark" /> Prüferfragen einbeziehen
            </b>
            <br />
            <span className="hint">Die Prüferfragen aus der Theorie – im Lernen-Teil und als Karteikarten.</span>
          </span>
        </label>
        <label className="choice">
          <input
            type="checkbox"
            checked={settings.fachgespraech}
            onChange={(e) => update((p) => withSettings(p, { fachgespraech: e.target.checked }))}
          />
          <span>
            <b>
              <Icon name="mic" /> Fachgespräch-Fragen einbeziehen
            </b>
            <br />
            <span className="hint">Die Fragen für das Fachgespräch am Ende jedes Lernblatts – als Karteikarten.</span>
          </span>
        </label>
        <p className="hint">
          Ausgeschaltet heißt nur ausgeblendet: Dein Lernstand dieser Karten bleibt erhalten und ist beim Einschalten wieder da. Der
          Prüferkommentar in den Musterlösungen (das Punkteschema) bleibt immer sichtbar.
        </p>
      </section>

      <section className="card">
        <h2>
          <Icon name="list-checks" /> Leicht-Modus (4 Antworten)
        </h2>
        <p>
          Im Leicht-Modus wählst du bei Karteikarten und Rechenübungen aus 4 Antworten die richtige. Das ist zum Einstieg gedacht – für die
          Prüfung frei antworten.
        </p>
        <label className="choice">
          <input
            type="checkbox"
            checked={leichtAutomatischAn(settings)}
            onChange={(e) => update((p) => withSettings(p, { leichtAutomatisch: e.target.checked }))}
          />
          <span>
            <b>
              <Icon name="sparkles" /> Automatische Antworten erlauben
            </b>
            <br />
            <span className="hint">
              Karten ohne eigene Auswahlantworten bekommen Antworten anderer Karten als falsche Antworten (markiert mit „automatisch“): bei
              Fachbegriffen die Begriffe, mit denen sie oft verwechselt werden (aus „Abgrenzung“ und „Siehe auch“ der Begriffsseite), sonst
              ähnliche Karten zum selben Thema. Passt nichts gut genug, bleibt die Karte im Leicht-Modus weg. Fachbegriffe kommen auch
              umgekehrt: Erklärung gegeben, welcher Begriff ist gemeint? Aus: nur Karten mit geprüften Auswahlantworten.
            </span>
          </span>
        </label>
      </section>

      {IS_STATIC && (
        <section className="card">
          <h2>
            <Icon name="save" /> Erinnerung an die Sicherung
          </h2>
          <p>Die Übersicht erinnert dich, eine Sicherung herunterzuladen, wenn die letzte so alt ist und du seitdem gelernt hast.</p>
          <label className="field">
            Erinnern nach … Tagen
            <input
              type="number"
              min={1}
              max={365}
              value={settings.backupReminderDays}
              onChange={(e) => {
                const days = Number(e.target.value);
                if (Number.isInteger(days) && days >= 1 && days <= 365) update((p) => withSettings(p, { backupReminderDays: days }));
              }}
            />
          </label>
          {settings.lastBackupDownloadAt && (
            <p className="hint">Letzte heruntergeladene Sicherung: {formatIsoDate(settings.lastBackupDownloadAt)}.</p>
          )}
        </section>
      )}

      <p className="hint">
        <Icon name="save" /> Deine Einstellungen stehen in deinem Fortschritt (
        {IS_STATIC ? 'in diesem Browser' : 'lokal auf diesem Rechner'}) und ziehen mit jeder Sicherung um. Sichern und Einspielen:{' '}
        <Link to="/daten">Daten &amp; Import</Link>. Nur das Farbschema (oben unter „Design“) merkt sich jedes Gerät selbst.
      </p>

      <Datenschutz />
    </div>
  );
}
