// Suchdialog (ROADMAP 8.8): lazy geladen, sobald jemand Strg+K drückt oder die Lupe anklickt.
// Der Index entsteht hier (einmal je Inhalt und Einstellung), die Logik steht in src/lib/suche.ts.
// Umsetzungsplan Phase 3 (Entscheidung E1): Ergebnis sind Begriffsseiten (und Glossar-Einträge ohne Seite); die übrigen Treffer gibt es
// auf Wunsch oder automatisch, wenn kein Begriff passt.

import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BegriffsSeite } from '../../shared/types';
import { ladeBegriffe } from '../lib/begriffe';
import { useStore } from '../lib/store';
import { SUCH_ART, sucheBegriffe } from '../lib/suche';
import { suchIndex } from '../lib/suchIndex';
import { useVollerInhalt } from '../lib/texte';
import { Icon } from './Icon';

export function SucheDialog({ onClose }: { onClose: () => void }) {
  const { progress } = useStore();
  const navigate = useNavigate();
  const { prueferfragen, fachgespraech } = progress.settings;
  // Lernblatt-Texte und Begriffsseiten nachladen (meist schon im Leerlauf geschehen, lib/suchIndex.ts); ohne Begriffsseiten
  // (Ladefehler) führt die Suche zu den Glossar-Einträgen.
  const { inhalt, fehler } = useVollerInhalt();
  const [seiten, setSeiten] = useState<BegriffsSeite[] | null>(null);
  useEffect(() => {
    let aktiv = true;
    ladeBegriffe().then(
      (s) => aktiv && setSeiten(s),
      () => aktiv && setSeiten([]),
    );
    return () => {
      aktiv = false;
    };
  }, []);
  // Einmal je Sitzung gebaut und gemerkt (suchIndex), nicht bei jedem Öffnen.
  const index = useMemo(
    () => (inhalt && seiten ? suchIndex(inhalt, seiten, { prueferfragen, fachgespraech }) : []),
    [inhalt, seiten, prueferfragen, fachgespraech],
  );
  const laedt = !fehler && (!inhalt || !seiten);
  const [anfrage, setAnfrage] = useState('');
  const [aktiv, setAktiv] = useState(0);
  const [alle, setAlle] = useState(false);
  const { treffer, weitere, rueckfall } = useMemo(() => sucheBegriffe(index, anfrage, alle), [index, anfrage, alle]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const ausloeser = document.activeElement;
    dialog?.showModal();
    inputRef.current?.focus();
    return () => {
      dialog?.close();
      if (ausloeser instanceof HTMLElement && ausloeser.isConnected) ausloeser.focus();
    };
  }, []);

  // Der aktive Treffer bleibt beim Blättern mit den Pfeiltasten sichtbar.
  useEffect(() => {
    listRef.current?.querySelector(`[data-i="${aktiv}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [aktiv]);

  const oeffne = (i: number) => {
    const t = treffer[i];
    if (!t) return;
    onClose();
    navigate(t.eintrag.link);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAktiv((a) => Math.min(a + 1, Math.max(0, treffer.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAktiv((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Home' && treffer.length) {
      setAktiv(0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      oeffne(aktiv);
    } else if (e.key === 'Escape') {
      // type="search" leert das Feld beim ersten Escape; die Suche soll sofort schließen.
      e.preventDefault();
      onClose();
    }
  };

  const listId = `${id}-liste`;
  return (
    <dialog
      ref={dialogRef}
      className="suche-overlay"
      aria-label="Suche"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="suche-dialog">
        <div className="suche-kopf">
          <span aria-hidden="true">
            <Icon name="search" />
          </span>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={treffer.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={treffer.length ? `${id}-t${aktiv}` : undefined}
            aria-label="Suchbegriff"
            placeholder="Begriff, Formel, Aufgabe … (z. B. Median, 3. Normalform)"
            value={anfrage}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setAnfrage(e.target.value);
              setAktiv(0);
              setAlle(false);
            }}
            onKeyDown={onKeyDown}
          />
          <button type="button" className="ghost small" onClick={onClose} aria-label="Suche schließen">
            Esc
          </button>
        </div>
        {fehler && <p className="card warn">{fehler}</p>}
        {laedt && anfrage.trim().length >= 2 && <p className="muted suche-leer">Lädt …</p>}
        {!laedt && anfrage.trim().length >= 2 && !treffer.length && (
          <p className="muted suche-leer">Keine Treffer für „{anfrage.trim()}“.</p>
        )}
        {anfrage.trim().length < 2 && (
          <p className="muted suche-leer">
            Findet die Begriffsseite zu deinem Suchwort – dort stehen Erklärung, Beispiel und die passenden Übungen. Auf Wunsch auch
            Lernblätter, Karten, Aufgaben, Formeln und Operatoren. Umlaute egal: „Pruefung“ findet „Prüfung“.
          </p>
        )}
        {rueckfall && <p className="muted suche-leer small">Kein Begriff gefunden – Treffer in Lernblättern, Karten und Aufgaben:</p>}
        <ul className="suche-liste" role="listbox" id={listId} ref={listRef} aria-label="Treffer">
          {treffer.map((t, i) => {
            const art = SUCH_ART[t.eintrag.art];
            return (
              <li
                key={`${t.eintrag.link}-${i}`}
                id={`${id}-t${i}`}
                data-i={i}
                role="option"
                aria-selected={i === aktiv}
                className={i === aktiv ? 'aktiv' : undefined}
                onMouseMove={() => i !== aktiv && setAktiv(i)}
                onClick={() => oeffne(i)}
              >
                <span className="suche-art" title={art.name}>
                  <Icon name={art.icon} />
                </span>
                <span className="suche-inhalt">
                  <span className="suche-titel">{t.eintrag.titel}</span>
                  <span className="suche-kontext small muted">
                    {art.name}
                    {t.eintrag.kontext && ` · ${t.eintrag.kontext}`}
                  </span>
                  {t.ausschnitt && <span className="suche-ausschnitt small">{t.ausschnitt}</span>}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="suche-fuss small muted">
          <kbd>↑</kbd> <kbd>↓</kbd> wählen · <kbd>Enter</kbd> öffnen · <kbd>Esc</kbd> schließen
          {treffer.length > 0 && ` · ${treffer.length}${treffer.length === 40 ? '+' : ''} Treffer`}
          {weitere > 0 && (
            <>
              {' · '}
              <button type="button" className="ghost small" onClick={() => setAlle(true)}>
                {weitere} weitere in Lernblättern, Karten und Aufgaben
              </button>
            </>
          )}
        </p>
      </div>
    </dialog>
  );
}
