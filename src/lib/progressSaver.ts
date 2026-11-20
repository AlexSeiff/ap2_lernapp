// Speichert verzögert und höchstens einmal gleichzeitig; ausstehende Änderungen bleiben bei Fehlern erhalten.
import { SAVE_DELAY_MS } from '../../domain/config';
import type { Progress } from '../../domain/progress';

export type SaveState = 'gespeichert' | 'speichert' | 'fehler';
type Write = (progress: Progress) => Promise<void>;
export interface SaverOptions {
  send: Write;
  onState: (state: SaveState, error?: string | null) => void;
  delay?: number;
}

export function createProgressSaver({ send, onState, delay = SAVE_DELAY_MS }: SaverOptions) {
  let latest: Progress | null = null;
  let writer = send;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let inFlight = false;
  let again = false;
  let changeSeq = 0;
  let savedSeq = 0;

  function save() {
    inFlight = true;
    const seq = changeSeq;
    const sentWriter = writer;
    writer(latest as Progress)
      .then(
        () => {
          savedSeq = Math.max(savedSeq, seq);
          if (seq === changeSeq && writer === sentWriter) writer = send;
          onState(savedSeq === changeSeq ? 'gespeichert' : 'speichert', null);
        },
        (e: Error) => onState('fehler', e.message),
      )
      .finally(() => {
        inFlight = false;
        if (again) {
          again = false;
          save();
        }
      });
  }

  function fire() {
    timer = undefined;
    if (inFlight) again = true;
    else save();
  }

  return {
    /** Ein eigener Schreibweg erlaubt bewusstes Ersetzen, ohne Metadaten in der Sicherung. */
    schedule(p: Progress, write?: Write) {
      latest = p;
      if (write) writer = write;
      changeSeq++;
      onState('speichert');
      clearTimeout(timer);
      timer = setTimeout(fire, delay);
    },
    get pending() {
      return latest !== null && changeSeq !== savedSeq;
    },
    /** Der lokale Schreibweg schreibt synchron, bevor sein Promise zurückkehrt (auch bei pagehide). */
    flush() {
      if (this.pending) {
        clearTimeout(timer);
        return writer(latest as Progress).then(
          () => true,
          (e: Error) => {
            onState('fehler', e.message);
            return false;
          },
        );
      }
      return Promise.resolve(true);
    },
  };
}
export type ProgressSaver = ReturnType<typeof createProgressSaver>;
