// Stern zum Markieren einer Karteikarte (Umsetzungsplan Phase 4) oder einer Aufgabe. Gespeichert in progress.markiert (Schlüssel = Karten- bzw.
// Aufgaben-Id, die sich nicht überschneiden), ohne Einfluss auf das Leitner-Fach oder die Aufgabenergebnisse.

import { useEffect } from 'react';
import { istMarkiert, wechsleMarkierung } from '../lib/markiert';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

/**
 * Umschaltknopf (aria-pressed) mit Stern; gefüllt, solange der Eintrag markiert ist.
 * `id`: Id der Karte bzw. Aufgabe. `gegenstand`: „Karte“ (Standard) oder „Aufgabe“ – nur für Titel und Namen des Knopfs.
 * `taste`: zusätzlich Kurzbefehl M (nicht beim Tippen, nicht mit Strg/Alt/⌘) – nur für den gerade gezeigten Eintrag setzen.
 * `nurIcon`: ohne sichtbaren Text, z. B. in Listen; der Name steht dann im aria-label (`label`, sonst „Karte markieren“).
 * `text`: sichtbarer Text (Standard „Markieren“).
 */
export function MarkierStern(props: {
  id: string;
  gegenstand?: 'Karte' | 'Aufgabe';
  taste?: boolean;
  nurIcon?: boolean;
  label?: string;
  text?: string;
}) {
  const { id, gegenstand = 'Karte', taste = false, nurIcon = false, text = 'Markieren' } = props;
  const label = props.label ?? `${gegenstand} markieren`;
  const { progress, update } = useStore();
  const an = istMarkiert(progress, id);
  const wechsle = () => update((p) => wechsleMarkierung(p, id));

  useEffect(() => {
    if (!taste) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'm' && e.key !== 'M') return;
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('input, select, textarea, [contenteditable="true"]')) return;
      e.preventDefault();
      update((p) => wechsleMarkierung(p, id));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [taste, id, update]);

  return (
    <button
      type="button"
      className={`stern ${nurIcon ? 'nur-icon' : ''}`}
      aria-pressed={an}
      aria-label={nurIcon ? label : undefined}
      title={an ? 'Markiert – zum Entfernen klicken' : label}
      onClick={wechsle}
    >
      <Icon name="star" />
      {!nurIcon && (
        <>
          {' '}
          {text}
          {taste && (
            <>
              {' '}
              <kbd>M</kbd>
            </>
          )}
        </>
      )}
    </button>
  );
}
