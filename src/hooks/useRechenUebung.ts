// Zustand einer Rechenübung (/rechnen/:id): konkrete Zahlen (feste Daten oder Seed), Eingaben, Prüfergebnis,
// aufgedeckte Hinweise und Lösung. Speichert über die reinen Funktionen aus src/lib/rechnen.ts im Fortschritt.
// Die Seite rendert nur.

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RechenUebung } from '../../shared/types';
import { rechenAuswahl } from '../lib/leichtRechnen';
import { meldeFertig } from '../lib/heuteSitzung';
import { recordRechenCheck, recordRechenHint, recordRechenLeicht, recordRechenLoesung, setRechenSeed } from '../lib/rechnen';
import { withSettings } from '../lib/settings';
import { useStore } from '../lib/store';
import { baueBeispiel } from '../rechnen/beispiel';
import { type PruefErgebnis, pruefeAntworten } from '../rechnen/checker';
import { baueInstanz, type RechenInstanz } from '../rechnen/instanz';
import { erzeugeZufall, neuerSeed, seedAusText } from '../rechnen/zufall';

type Gebaut = { inst: RechenInstanz; error?: undefined } | { inst?: undefined; error: string };

/** Instanz mit `seed`; passt der gespeicherte Seed nicht (mehr) zur Vorlage, die festen Zahlen. */
function baue(u: RechenUebung, seed: number | undefined): Gebaut {
  try {
    return { inst: baueInstanz(u, seed) };
  } catch (e) {
    if (seed !== undefined) return baue(u, undefined);
    return { error: (e as Error).message };
  }
}

export function useRechenUebung(u: RechenUebung) {
  const { progress, update } = useStore();
  const id = u.id;
  const state = progress.rechnen[id];

  const [seed, setSeed] = useState<number | undefined>(() => (u.neueZahlen ? state?.lastSeed : undefined));
  const gebaut = useMemo(() => baue(u, seed), [u, seed]);
  const inst = gebaut.inst;

  // Ausgeblendetes Beispiel (ROADMAP 8.6): Stufe nach dem Lernstand beim Öffnen – eine Prüfung ändert es nicht mitten in der Übung.
  const [stateBeimOeffnen] = useState(state);
  const beispiel = useMemo(() => (inst ? baueBeispiel(u, inst, stateBeimOeffnen) : undefined), [u, inst, stateBeimOeffnen]);

  // Jeder Besuch ist ein neuer Versuch wie in der Prüfung: leere Felder, keine aufgedeckten Hinweise (gezählt wird trotzdem nur Neues).
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [ergebnis, setErgebnis] = useState<PruefErgebnis | null>(null);
  const [leer, setLeer] = useState(false);
  const hinweise = inst?.hinweise ?? u.hinweise;
  const [hintsShown, setHintsShown] = useState(0);
  const [loesungOffen, setLoesungOffen] = useState(false);

  // Leicht-Modus („🟢 Ergebnis auswählen“, gleiche Einstellung wie bei den Karteikarten): je Eingabe 4 Antworten.
  const leichtModus = progress.settings.leichtModus;
  const [leichtRunde, setLeichtRunde] = useState(0);
  const [wahl, setWahl] = useState<Record<string, number>>({});
  // Reproduzierbar gemischt je Übung, Zahlen und Runde (gleich beim erneuten Rendern).
  const auswahl = useMemo(
    () => (inst ? rechenAuswahl(inst, erzeugeZufall(seedAusText(id) + (inst.seed ?? 0) + leichtRunde).zahl) : undefined),
    [inst, id, leichtRunde],
  );
  const leicht = leichtModus && !!auswahl;
  const leichtFertig = !!auswahl && auswahl.every((a) => wahl[a.eingabe] !== undefined);
  const leichtOk = leichtFertig && auswahl.every((a) => a.optionen[wahl[a.eingabe]].richtig);

  const setLeichtModus = (an: boolean) => update((p) => withSettings(p, { leichtModus: an }));

  /** Antwort `i` für eine Eingabe wählen; ist danach jede Eingabe gewählt, wird die Runde gespeichert. */
  const waehle = useCallback(
    (eingabe: string, i: number) => {
      if (!auswahl || wahl[eingabe] !== undefined) return;
      const neu = { ...wahl, [eingabe]: i };
      setWahl(neu);
      if (auswahl.every((a) => neu[a.eingabe] !== undefined)) {
        const ok = auswahl.every((a) => a.optionen[neu[a.eingabe]].richtig);
        update((p) => recordRechenLeicht(p, id, ok));
        if (ok) meldeFertig(id);
      }
    },
    [auswahl, wahl, update, id],
  );

  /** Gleiche Zahlen, Antworten neu gemischt. */
  const leichtNochmal = () => {
    setWahl({});
    setLeichtRunde((r) => r + 1);
  };

  // Tasten 1–4 wählen für die erste noch offene Eingabe.
  useEffect(() => {
    if (!leicht || !auswahl) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('input, select, textarea') || !/^[1-4]$/.test(e.key)) return;
      const offen = auswahl.find((a) => wahl[a.eingabe] === undefined);
      if (offen && offen.optionen[Number(e.key) - 1]) waehle(offen.eingabe, Number(e.key) - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [leicht, auswahl, wahl, waehle]);

  const setAntwort = useCallback((eingabe: string, text: string) => {
    setAntworten((a) => ({ ...a, [eingabe]: text }));
    setLeer(false);
  }, []);

  /** „✓ Prüfen“: zählt als Versuch, sobald mindestens ein Feld ausgefüllt ist. */
  const pruefen = () => {
    if (!inst) return;
    const eigene = Object.fromEntries(inst.eingaben.map((e) => [e.id, antworten[e.id] ?? '']));
    if (Object.values(eigene).every((t) => !t.trim())) {
      setLeer(true);
      setErgebnis(null);
      return;
    }
    const r = pruefeAntworten(inst, eigene);
    setErgebnis(r);
    update((p) => recordRechenCheck(p, id, r.ok));
    if (r.ok) meldeFertig(id);
  };

  /** Neue Zufallszahlen („🎲 Neue Zahlen“) oder zurück zu den festen Zahlen der Übung (`undefined`). */
  const wechsleZahlen = (neu: number | undefined) => {
    setSeed(neu);
    setAntworten({});
    setErgebnis(null);
    setLeer(false);
    setLoesungOffen(false);
    setWahl({});
    update((p) => setRechenSeed(p, id, neu));
  };

  const hinweis = () => {
    if (hintsShown >= hinweise.length) return;
    setHintsShown(hintsShown + 1);
    // Nur neue Hinweise zählen – schon früher aufgedeckte stehen oben wieder da.
    if (hintsShown + 1 > (state?.hintsUsed ?? 0)) update((p) => recordRechenHint(p, id));
  };

  const zeigeLoesung = () => {
    update((p) => recordRechenLoesung(p, id));
    setLoesungOffen(true);
  };

  return {
    state,
    inst,
    error: gebaut.error,
    /** true, wenn gerade Zufallszahlen statt der festen Zahlen zu sehen sind. */
    zufall: seed !== undefined && inst?.seed === seed,
    beispiel,
    antworten,
    setAntwort,
    ergebnis,
    leer,
    pruefen,
    neueZahlen: () => wechsleZahlen(neuerSeed()),
    originalZahlen: () => wechsleZahlen(undefined),
    hinweise: hinweise.slice(0, hintsShown),
    hinweiseGesamt: hinweise.length,
    hinweis,
    loesungOffen,
    zeigeLoesung,
    /** Einstellung Leicht-Modus an (auch wenn diese Übung keine Auswahl hat). */
    leichtModus,
    setLeichtModus,
    /** Leicht-Modus aktiv und für diese Übung möglich. */
    leicht,
    auswahl,
    wahl,
    waehle,
    leichtFertig,
    leichtOk,
    leichtNochmal,
  };
}
