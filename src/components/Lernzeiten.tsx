// Lernzeiten (Einstellungen) und der Knopf „Lernplan in den Kalender“ (Einstellungen und Lernplan auf „Heute lernen“).

import { WERKTAGE, type Lernzeit } from '../../shared/progress';
import { ladeHerunter } from '../lib/export';
import { planeLernplan } from '../lib/lernplan';
import {
  LERN_DAUERN,
  lernplanIcs,
  lernTermine,
  lernzeitenVon,
  minutenProWoche,
  sitzungenProWoche,
  TAG_KURZ,
  type Lernzeiten,
} from '../lib/lernzeiten';
import { localDate } from '../lib/progress';
import { withSettings } from '../lib/settings';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

/** „6 Lerntage, 3 Std. 30 Min. pro Woche“ */
export function lernzeitenText(l: Lernzeiten): string {
  const tage = sitzungenProWoche(l);
  if (!tage) return 'Keine Lerntage gewählt.';
  const min = minutenProWoche(l);
  const dauer = min >= 60 ? `${Math.floor(min / 60)} Std.${min % 60 ? ` ${min % 60} Min.` : ''}` : `${min} Min.`;
  return `${tage} ${tage === 1 ? 'Lerntag' : 'Lerntage'}, ${dauer} pro Woche`;
}

/** Knopf: Lernplan (mit Prüfungstermin bis zur Prüfung, sonst die nächsten vier Wochen) als .ics herunterladen. */
export function KalenderKnopf({ className }: { className?: string }) {
  const { content, progress } = useStore();
  const lernzeiten = lernzeitenVon(progress.settings);
  const leer = sitzungenProWoche(lernzeiten) === 0;
  const laden = () => {
    const heute = localDate();
    const plan = planeLernplan(content, progress, heute);
    const termine = lernTermine(plan, lernzeiten, heute, progress.settings.examDate);
    const appLink = `${window.location.origin}${window.location.pathname}#/heute`;
    ladeHerunter('ap2-lernplan.ics', lernplanIcs(termine, plan ? progress.settings.examDate : undefined, { appLink }), 'text/calendar');
  };
  return (
    <button
      type="button"
      className={className}
      onClick={laden}
      disabled={leer}
      title={leer ? 'Wähle zuerst Lerntage in den Einstellungen.' : undefined}
    >
      <Icon name="calendar" /> Lernplan in den Kalender (.ics)
    </button>
  );
}

function Gruppe({ titel, tage, zeit, onChange }: { titel: string; tage: number[]; zeit: Lernzeit; onChange: (z: Lernzeit) => void }) {
  const umschalten = (tag: number) =>
    onChange({ ...zeit, tage: zeit.tage.includes(tag) ? zeit.tage.filter((t) => t !== tag) : [...zeit.tage, tag].sort((a, b) => a - b) });
  return (
    <fieldset className="lernzeit">
      <legend>{titel}</legend>
      <div className="wochentage">
        {tage.map((t) => (
          <label key={t} className="wochentag">
            <input type="checkbox" checked={zeit.tage.includes(t)} onChange={() => umschalten(t)} />
            {TAG_KURZ[t]}
          </label>
        ))}
      </div>
      <div className="actions">
        <label className="field">
          Beginn
          <input
            type="time"
            value={zeit.von}
            onChange={(e) => {
              if (/^\d\d:\d\d$/.test(e.target.value)) onChange({ ...zeit, von: e.target.value });
            }}
          />
        </label>
        <label className="field">
          Dauer
          <select value={zeit.minuten} onChange={(e) => onChange({ ...zeit, minuten: Number(e.target.value) })}>
            {[...new Set([...LERN_DAUERN, zeit.minuten])]
              .sort((a, b) => a - b)
              .map((m) => (
                <option key={m} value={m}>
                  {m < 60 ? `${m} Minuten` : `${m / 60} ${m === 60 ? 'Stunde' : 'Stunden'}`}
                </option>
              ))}
          </select>
        </label>
      </div>
    </fieldset>
  );
}

/** Einstellungen → Lernzeiten: wann unter der Woche und wann am Wochenende gelernt wird. */
export function LernzeitenEinstellung() {
  const { progress, update } = useStore();
  const lernzeiten = lernzeitenVon(progress.settings);
  const setze = (neu: Lernzeiten) => update((p) => withSettings(p, { lernzeiten: neu }));
  return (
    <section className="card">
      <h2>
        <Icon name="clock" /> Lernzeiten
      </h2>
      <p>Wann möchtest du lernen? Daraus wird dein Lernplan mit festen Terminen – zum Eintragen in deinen Kalender.</p>
      <div className="lernzeiten">
        <Gruppe
          titel="Unter der Woche"
          tage={WERKTAGE}
          zeit={lernzeiten.werktags}
          onChange={(z) => setze({ ...lernzeiten, werktags: z })}
        />
        <Gruppe
          titel="Am Wochenende"
          tage={[6, 0]}
          zeit={lernzeiten.wochenende}
          onChange={(z) => setze({ ...lernzeiten, wochenende: z })}
        />
      </div>
      <p className="hint">{lernzeitenText(lernzeiten)}.</p>
      <div className="actions">
        <KalenderKnopf />
      </div>
      <p className="hint">
        {progress.settings.examDate
          ? 'Ein Termin je Lerntag bis zur Prüfung, mit den Schwerpunktthemen der Woche und einer Erinnerung 10 Minuten vorher; die letzten drei Tage sind für Wiederholung und Übungsklausuren.'
          : 'Ohne Prüfungstermin: Termine für die nächsten vier Wochen. Mit Termin verteilt der Lernplan die Themen bis zur Prüfung.'}{' '}
        Die Datei öffnest du mit deinem Kalender (Google Kalender: Einstellungen → Importieren). Nach Änderungen einfach neu herunterladen
        und wieder importieren.
      </p>
    </section>
  );
}
