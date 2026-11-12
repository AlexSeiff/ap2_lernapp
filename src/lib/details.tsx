// Texte der Karten und Aufgaben nachladen (Aufteilung in shared/texte.ts): einmal je Sitzung aus details.json
// (offline aus dem Service-Worker-Cache). Die Übersicht kommt ohne sie aus; jede andere Seite steht unterhalb von <MitDetails>
// und sieht über useStore() den Inhalt mit Texten. Bereits vollständiger Inhalt (Tests) wird direkt genommen.

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { hatDetails, inhaltMitDetails, type Details, type KernInhalt, type StartInhalt } from '../../shared/texte';
import { api } from './api';
import { StoreContext, useStartStore } from './store';

let geladen: Details | undefined;
let laufend: Promise<Details> | undefined;
const cache = new WeakMap<StartInhalt, KernInhalt>();

/** Details – einmal je Sitzung; nach einem Fehler wird beim nächsten Aufruf neu geladen. */
export function ladeDetails(): Promise<Details> {
  if (geladen) return Promise.resolve(geladen);
  laufend ??= api.details().then(
    (d) => {
      geladen = d;
      laufend = undefined;
      return d;
    },
    (e: unknown) => {
      laufend = undefined;
      throw e;
    },
  );
  return laufend;
}

/** Beim Start schon anfordern, wenn die Adresse nicht die Übersicht ist (parallel zu content.json). */
export function ladeDetailsFuerAdresse(hash: string): boolean {
  const noetig = !/^(#\/?)?(\?.*)?$/.test(hash);
  if (noetig) void ladeDetails().catch(() => {});
  return noetig;
}

/** Inhalt mit Details, falls schon geladen – immer dasselbe Objekt je Start (useMemo und Caches greifen). */
export function inhaltSofort(start: StartInhalt): KernInhalt | undefined {
  if (hatDetails(start)) return start;
  if (!geladen) return undefined;
  let voll = cache.get(start);
  if (!voll) cache.set(start, (voll = inhaltMitDetails(start, geladen)));
  return voll;
}

/** Inhalt mit Details laden. */
export async function ladeInhaltMitDetails(start: StartInhalt): Promise<KernInhalt> {
  if (!hatDetails(start)) await ladeDetails();
  return inhaltSofort(start)!;
}

/** Zeigt `children` erst, wenn die Details da sind; darunter liefert useStore() den Inhalt mit Texten. */
export function MitDetails({
  children,
  fallback = <div className="page loading">Lädt …</div>,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const store = useStartStore();
  const inhalt = inhaltSofort(store.content);
  const [, setGeladen] = useState(0);
  const [fehler, setFehler] = useState<string>();
  useEffect(() => {
    if (inhalt) return;
    let aktiv = true;
    ladeDetails().then(
      () => aktiv && setGeladen((n) => n + 1),
      (e: Error) => aktiv && setFehler(e.message),
    );
    return () => {
      aktiv = false;
    };
  }, [inhalt]);
  const wert = useMemo(() => (inhalt ? { ...store, content: inhalt } : undefined), [store, inhalt]);
  if (wert) return <StoreContext.Provider value={wert}>{children}</StoreContext.Provider>;
  if (fehler)
    return (
      <div className="page">
        <p className="error">{fehler}</p>
        <p>Prüf deine Internetverbindung und lade die Seite neu.</p>
      </div>
    );
  return fallback;
}

/**
 * Für die Übersicht: Inhalt mit Details, sobald sie da sind (bis dahin undefined) – ohne die Seite aufzuhalten.
 * Stößt das Laden an; ein Fehler bleibt still, die betroffenen Angaben fehlen dann einfach.
 */
export function useDetailsWennDa(): KernInhalt | undefined {
  const { content } = useStartStore();
  const inhalt = inhaltSofort(content);
  const [, setGeladen] = useState(0);
  useEffect(() => {
    if (inhalt) return;
    let aktiv = true;
    ladeDetails().then(
      () => aktiv && setGeladen((n) => n + 1),
      () => {},
    );
    return () => {
      aktiv = false;
    };
  }, [inhalt]);
  return inhalt;
}
