// Abschnittstexte der Lernblätter nachladen (Umsetzungsplan Phase 10, Aufteilung in shared/texte.ts): je Thema einmal je Sitzung,
// Sie kommen aus texte/<id>.json (offline aus dem Service-Worker-Cache). Nach dem Start lädt die App alle
// Texte im Leerlauf vor, damit Lernblatt, Glossar und Suche beim Öffnen nicht erst warten.
// Bereits vollständiger Inhalt (Tests, lokale Fixtures) wird direkt genommen.

import { startTransition, useEffect, useState } from 'react';
import {
  inhaltMitTexten,
  istVoll,
  themaHatTexte,
  themaMitTexten,
  type KernInhalt,
  type KernTopic,
  type ThemaTexte,
} from '../../shared/texte';
import type { Content, Topic } from '../../shared/types';
import { api } from './api';
import { useStore } from './store';

const geladen = new Map<string, ThemaTexte>();
const laufend = new Map<string, Promise<ThemaTexte>>();
const themaCache = new WeakMap<KernTopic, Topic>();
const inhaltCache = new WeakMap<KernInhalt, Content>();

/** Texte eines Themas – einmal je Sitzung; nach einem Fehler wird beim nächsten Aufruf neu geladen. */
export function ladeTexte(topicId: string): Promise<ThemaTexte> {
  const fertig = geladen.get(topicId);
  if (fertig) return Promise.resolve(fertig);
  let p = laufend.get(topicId);
  if (!p) {
    p = api.texte(topicId).then(
      (t) => {
        geladen.set(topicId, t);
        laufend.delete(topicId);
        return t;
      },
      (e: unknown) => {
        laufend.delete(topicId);
        throw e;
      },
    );
    laufend.set(topicId, p);
  }
  return p;
}

/**
 * Beim Start schon anfordern, was die Adresse gleich braucht (parallel zu content.json statt erst nach dem ersten Rendern):
 * „#/lernen/06“ → texte/06.json. Gibt die Thema-id zurück (für Tests), sonst undefined.
 */
export function ladeTexteFuerAdresse(hash: string): string | undefined {
  const id = /^#\/lernen\/([\w-]+)/.exec(hash)?.[1];
  if (id) void ladeTexte(decodeURIComponent(id)).catch(() => {});
  return id;
}

/** Thema mit Texten, falls schon geladen (sonst undefined). */
export function themaSofort(topic: KernTopic): Topic | undefined {
  if (themaHatTexte(topic)) return topic;
  const texte = geladen.get(topic.id);
  if (!texte) return undefined;
  let t = themaCache.get(topic);
  if (!t) themaCache.set(topic, (t = themaMitTexten(topic, texte)));
  return t;
}

/** Ganzer Inhalt mit allen Texten, falls schon geladen – immer dasselbe Objekt je Kern (useMemo und Caches greifen). */
export function vollerInhaltSofort(kern: KernInhalt): Content | undefined {
  if (istVoll(kern)) return kern;
  if (!kern.topics.every((t) => geladen.has(t.id))) return undefined;
  let c = inhaltCache.get(kern);
  if (!c) inhaltCache.set(kern, (c = inhaltMitTexten(kern, Object.fromEntries(geladen))));
  return c;
}

/** Alle Texte laden. */
export async function ladeAlleTexte(kern: KernInhalt): Promise<Content> {
  if (!istVoll(kern)) await Promise.all(kern.topics.map((t) => ladeTexte(t.id)));
  return vollerInhaltSofort(kern)!;
}

/** `los` ausführen, wenn der Browser nichts zu tun hat (spätestens nach `spaetestens` ms). Liefert die Abbruch-Funktion. */
export function imLeerlauf(los: () => void, spaetestens = 4000): () => void {
  // Safari kennt requestIdleCallback nicht.
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(los, { timeout: spaetestens });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(los, Math.min(1500, spaetestens));
  return () => window.clearTimeout(id);
}

/** Im Leerlauf alle Texte vorladen (Fehler egal – dann lädt die Seite selbst und zeigt ihn). */
export const ladeTexteImLeerlauf = (kern: KernInhalt) => imLeerlauf(() => void ladeAlleTexte(kern).catch(() => {}));

/** Lädt nach, solange `bereit` false ist; danach neu rendern. Fehlertext bleibt am Schlüssel hängen. */
function useNachladen(schluessel: string | undefined, bereit: boolean, laden: () => Promise<unknown>): string | undefined {
  const [, setGeladen] = useState(0);
  const [fehler, setFehler] = useState<{ schluessel: string; text: string }>();
  useEffect(() => {
    if (schluessel === undefined || bereit) return;
    let aktiv = true;
    laden().then(
      // Als Transition: React rendert die (oft lange) Seite in kleinen Stücken, statt den Browser bis zu einer Sekunde zu blockieren.
      () => aktiv && startTransition(() => setGeladen((n) => n + 1)),
      (e: Error) => aktiv && setFehler({ schluessel, text: e.message }),
    );
    return () => {
      aktiv = false;
    };
    // laden hängt nur am Schlüssel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schluessel, bereit]);
  return fehler && fehler.schluessel === schluessel ? fehler.text : undefined;
}

/** Ein Thema mit seinen Abschnittstexten (Lernblatt-Seite); bis dahin `topic` undefined. */
export function useThemaTexte(kern: KernTopic | undefined): { topic?: Topic; fehler?: string } {
  const topic = kern && themaSofort(kern);
  const fehler = useNachladen(kern?.id, !!topic, () => ladeTexte(kern!.id));
  return { topic, fehler };
}

/** Der ganze Inhalt mit allen Texten (Glossar, Begriffsseiten, Suche); bis dahin `inhalt` undefined. */
export function useVollerInhalt(): { inhalt?: Content; fehler?: string } {
  const { content } = useStore();
  const inhalt = vollerInhaltSofort(content);
  const fehler = useNachladen('alle', !!inhalt, () => ladeAlleTexte(content));
  return { inhalt, fehler };
}
