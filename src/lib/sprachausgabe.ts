// Vorlesen mit der Sprachausgabe des Browsers (Web Speech API, speechSynthesis) – für den Podcast (pages/Podcast.tsx).
// Kein Server, keine Audiodateien: Die Stimmen liefert das Gerät (Windows, macOS, iOS, Android); das geht auch offline.
// Eine Zeile wird in Sätze zerlegt und Satz für Satz gesprochen – manche Sprachausgaben brechen lange Äußerungen sonst ab.
// Pausieren heißt hier „abbrechen und die Stelle merken“: speechSynthesis.pause() ist auf mehreren Systemen unzuverlässig.

import { saetze, type Sprecher, type Zeile } from './podcast';

export const sprachausgabeDa = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/** Deutsche Stimmen des Geräts (lokale zuerst). */
export function deutscheStimmen(): SpeechSynthesisVoice[] {
  if (!sprachausgabeDa()) return [];
  return speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('de'))
    .sort((a, b) => Number(b.localService) - Number(a.localService) || a.name.localeCompare(b.name));
}

// Häufige Stimmnamen (Windows, Apple, Google, Android) – nur um Lea eine weibliche und Ben eine männliche Stimme zu geben.
const WEIBLICH =
  /katja|hedda|anna|petra|marlene|vicki|helena|hanna|amala|seraphina|katharina|elke|gisela|louisa|maja|tanja|sabine|frau|female|weiblich/i;
const MAENNLICH = /stefan|conrad|markus|yannick|killian|hans|klaus|florian|ralf|bernd|jonas|daniel|reed|\bmann\b|\bmale\b|männlich/i;
/** Neuere, natürlich klingende Stimmen (Edge, Chrome, Apple) – brauchen meist eine Internetverbindung. */
const NATUERLICH = /natural|neural|premium|enhanced|online/i;

/** Rangfolge für den Vorschlag: online die natürlichen Stimmen zuerst, offline nur lokale; Deutschland vor Österreich und der Schweiz. */
function rang(v: Pick<SpeechSynthesisVoice, 'name' | 'lang' | 'localService'>, online: boolean): number {
  const natuerlich = NATUERLICH.test(v.name) ? 0 : 1;
  return (online ? natuerlich : v.localService === false ? 10 : 0) * 2 + (/^de-DE/i.test(v.lang ?? '') ? 0 : 1);
}

/** Vorschlag je Sprecher: Lea eher weiblich, Ben eher männlich, sonst zwei verschiedene Stimmen. */
export function stimmenVorschlag(
  stimmen: SpeechSynthesisVoice[],
  online = typeof navigator === 'undefined' || navigator.onLine !== false,
): Record<Sprecher, string | undefined> {
  const sortiert = [...stimmen].sort((a, b) => rang(a, online) - rang(b, online));
  const lea = sortiert.find((v) => WEIBLICH.test(v.name)) ?? sortiert[0];
  const ben = sortiert.find((v) => MAENNLICH.test(v.name) && v !== lea) ?? sortiert.find((v) => v !== lea) ?? lea;
  return { lea: lea?.name, ben: ben?.name };
}

export interface VorleserOptionen {
  stimmen: Record<Sprecher, string | undefined>;
  tempo: number;
  /** Nach jeder fertigen Zeile (auch Pausen) – mit dem Index der nächsten Zeile. */
  weiter: (naechste: number) => void;
  /** Am Ende der letzten Zeile. */
  fertig: () => void;
  /** Die Sprachausgabe hat einen Satz auch mit einer lokalen Stimme abgelehnt – das Vorlesen hält an. */
  fehler?: (meldung: string) => void;
}

/** Verständliche Meldung zu den Fehlercodes der Web Speech API. */
export function fehlerText(code: string): string {
  if (code === 'not-allowed') return 'Der Browser erlaubt das Vorlesen erst nach einem Tipp auf „Abspielen“.';
  if (code === 'network') return 'Die gewählte Stimme braucht eine Internetverbindung – wähle eine andere Stimme.';
  if (code === 'voice-unavailable' || code === 'language-unavailable')
    return 'Diese Stimme ist auf dem Gerät nicht verfügbar – wähle eine andere.';
  return `Die Sprachausgabe hat abgebrochen (${code}). Versuch es noch einmal oder wähle eine andere Stimme.`;
}

/**
 * Liest `zeilen` ab einem Index. Jeder Start bekommt eine neue Nummer: Rückmeldungen abgebrochener Äußerungen (Chrome meldet
 * auch nach cancel() noch „end“) werden daran erkannt und ignoriert.
 */
export class Vorleser {
  private lauf = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private zeilen: Zeile[],
    private opt: VorleserOptionen,
  ) {}

  setzeOptionen(opt: Partial<VorleserOptionen>) {
    this.opt = { ...this.opt, ...opt };
  }

  start(index: number) {
    this.stopp();
    const lauf = ++this.lauf;
    this.zeile(index, lauf);
  }

  stopp() {
    this.lauf++;
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    if (sprachausgabeDa()) speechSynthesis.cancel();
  }

  private zeile(index: number, lauf: number) {
    if (lauf !== this.lauf) return;
    const z = this.zeilen[index];
    if (!z) {
      this.opt.fertig();
      return;
    }
    const naechste = () => {
      if (lauf !== this.lauf) return;
      this.opt.weiter(index + 1);
      this.zeile(index + 1, lauf);
    };
    if ('pause' in z) {
      this.timer = setTimeout(naechste, z.pause / Math.max(0.5, this.opt.tempo));
      return;
    }
    const stimmen = deutscheStimmen();
    const gewaehlt = stimmen.find((v) => v.name === this.opt.stimmen[z.sprecher]);
    const lokal = stimmen.find((v) => v.localService);
    const teile = saetze(z.text);
    // Weiter immer über die Ereignisschleife – nie verschachtelt aus einem Rückruf heraus (sonst wächst der Stapel).
    const spaeter = (f: () => void) => setTimeout(f, 0);
    const sprich = (i: number, ersatz = false) => {
      if (lauf !== this.lauf) return;
      if (i >= teile.length) {
        naechste();
        return;
      }
      const stimme = ersatz ? lokal : gewaehlt;
      const u = new SpeechSynthesisUtterance(teile[i]);
      u.lang = stimme?.lang ?? 'de-DE';
      if (stimme) u.voice = stimme;
      u.rate = this.opt.tempo;
      // Gleiche Stimme für beide? Dann wenigstens die Tonhöhe unterscheiden.
      u.pitch = this.opt.stimmen.lea === this.opt.stimmen.ben ? (z.sprecher === 'lea' ? 1.15 : 0.9) : 1;
      u.onend = () => spaeter(() => sprich(i + 1));
      u.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled' || lauf !== this.lauf) return;
        // Ein Satz scheitert (z. B. Online-Stimme ohne Netz): einmal mit einer lokalen Stimme versuchen, sonst anhalten und melden –
        // nie stumm weiterspringen, sonst rauscht die Folge in Sekunden durch.
        if (!ersatz && lokal && lokal !== gewaehlt && e.error !== 'not-allowed') spaeter(() => sprich(i, true));
        else {
          this.lauf++;
          this.opt.fehler?.(fehlerText(e.error));
        }
      };
      speechSynthesis.speak(u);
    };
    sprich(0);
  }
}
