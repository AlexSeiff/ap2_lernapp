// Speichert den Fortschritt verzögert (Debounce) über die Datenquelle (lib/api.ts) – ohne React, damit es testbar bleibt.
// Es läuft immer höchstens ein Speichern gleichzeitig, sonst könnten Antworten in falscher Reihenfolge ankommen.
// Jeder PUT trägt die Revision, auf der dieser Tab aufbaut. Antwortet der Server mit 409 (ein anderer Tab hat
// inzwischen gespeichert), speichert dieser Tab bis zum Neuladen gar nicht mehr, statt fremden Fortschritt zu überschreiben.

import { SAVE_DELAY_MS } from '../../shared/config';
import type { SaveProgressRequest } from '../../shared/api';
import { CONFLICT_MESSAGE, type Progress } from '../../shared/progress';

export type SaveState = 'gespeichert' | 'speichert' | 'fehler' | 'konflikt';

export interface SaverOptions {
  /** Sendet den Body an den Server und liefert die neue Revision; lehnt mit einer Fehlermeldung (und ggf. `status`) ab. */
  send: (body: SaveProgressRequest) => Promise<{ revision: number }>;
  /** `error` undefined = bisherige Fehlermeldung stehen lassen. */
  onState: (state: SaveState, error?: string | null) => void;
  delay?: number;
}

export function createProgressSaver({ send, onState, delay = SAVE_DELAY_MS }: SaverOptions) {
  let latest: Progress | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let inFlight = false;
  /** Während eines Speicherns kam eine Änderung dazu → danach gleich noch einmal speichern. */
  let again = false;
  // Zähler statt Flags: So löscht eine ältere, erfolgreiche Antwort keine neuere Änderung oder Reset-Anforderung.
  let changeSeq = 0;
  let savedSeq = 0;
  let resetSeq = 0;
  /** Revision des zuletzt geladenen oder gespeicherten Stands auf dem Server. */
  let baseRevision = 0;
  let conflict = false;

  // Nach „Zurücksetzen“/„Sicherung einspielen“ darf der Server deutlich weniger Versuche annehmen (reset: true).
  // Die Revision kommt immer vom Saver, nicht aus `latest` – eine eingespielte Sicherung trägt ihre alte Revision.
  // latest ist gesetzt, sobald etwas geplant wurde – vorher wird nie gesendet.
  const body = (): SaveProgressRequest => ({ ...(latest as Progress), revision: baseRevision, ...(resetSeq ? { reset: true } : {}) });

  function save() {
    if (conflict) return;
    inFlight = true;
    const seq = changeSeq;
    const sentReset = resetSeq;
    send(body())
      .then(
        (res) => {
          baseRevision = res.revision;
          savedSeq = Math.max(savedSeq, seq);
          if (resetSeq === sentReset) resetSeq = 0;
          onState(savedSeq === changeSeq ? 'gespeichert' : 'speichert', null);
        },
        (e: Error & { status?: number }) => {
          if (e.status === 409) stop();
          else onState('fehler', e.message);
        },
      )
      .finally(() => {
        inFlight = false;
        if (again) {
          again = false;
          save();
        }
      });
  }

  /** Konflikt mit einem anderen Tab: ab jetzt nichts mehr speichern, bis die Seite neu geladen wird. */
  function stop() {
    conflict = true;
    again = false;
    clearTimeout(timer);
    timer = undefined;
    onState('konflikt', CONFLICT_MESSAGE);
  }

  function fire() {
    timer = undefined;
    if (inFlight) again = true;
    else save();
  }

  return {
    /** Revision des vom Server geladenen Stands – Grundlage für das erste Speichern. */
    setBaseRevision(revision: number) {
      baseRevision = revision;
    },
    /** Merkt einen neuen Stand vor und speichert ihn nach `delay` ms, falls keine weitere Änderung folgt. */
    schedule(p: Progress, reset = false) {
      if (conflict) return;
      latest = p;
      changeSeq++;
      if (reset) resetSeq = changeSeq;
      onState('speichert');
      clearTimeout(timer);
      timer = setTimeout(fire, delay);
    },
    /** Ein anderer Tab hat gespeichert (storage-Ereignis) – wie ein 409 behandeln. */
    markConflict() {
      if (!conflict) stop();
    },
    /** Gibt es Änderungen, die der Server noch nicht bestätigt hat (geplant, unterwegs oder fehlgeschlagen)? */
    get pending() {
      return !conflict && latest !== null && changeSeq !== savedSeq;
    },
    /** Body für das letzte Senden beim Schließen des Tabs – oder undefined, wenn nichts aussteht. */
    flushBody(): SaveProgressRequest | undefined {
      return this.pending ? body() : undefined;
    },
  };
}

export type ProgressSaver = ReturnType<typeof createProgressSaver>;
