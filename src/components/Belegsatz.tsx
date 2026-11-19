// Anhang der Prüfung zum Nachschlagen: SQL-Syntax-Auszug und Formelübersicht, nachgebaut wie im Belegsatz der AP2
// (components/PruefungsAnhang.tsx). In der AP2 liegt beides bei – deshalb gibt es sie als Seitenpanel überall, wo gerechnet oder SQL
// geschrieben wird (SQL-Editor, Rechenübungen, Aufgaben, Klausur). Der ausführliche SQL-Belegsatz der App (Material „sql-belegsatz“
// aus AP2_SQL_Belegsatz.md) hat seine eigene Seite und ist aus dem Panel verlinkt.

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Section } from '../../shared/types';
import { useStore } from '../lib/store';
import { Icon, type IconName } from './Icon';
import { Markdown } from './Markdown';

const FormelUebersicht = lazy(() => import('./PruefungsAnhang').then((m) => ({ default: m.FormelUebersicht })));
const SqlAuszug = lazy(() => import('./PruefungsAnhang').then((m) => ({ default: m.SqlAuszug })));

export const BELEGSATZ_ID = 'sql-belegsatz';
export const BELEGSATZ_PFAD = `/material/${BELEGSATZ_ID}`;

/** Der Belegsatz aus dem Inhalt, oder undefined (Datei fehlt). */
export function useBelegsatz() {
  const { content } = useStore();
  return content.materials.find((m) => m.id === BELEGSATZ_ID);
}

/** Inhalt ohne die erste Überschrift (die Seite bzw. das Panel setzt eine eigene). */
export const ohneTitel = (md: string) => md.replace(/^#\s+[^\n]*\n+/, '');

type Art = 'situation' | 'sql' | 'formeln';

const TITEL: Record<Art, string> = { situation: 'Ausgangssituation', sql: 'SQL-Belegsatz', formeln: 'Formelübersicht' };
const ICON: Record<Art, IconName> = { situation: 'paperclip', sql: 'book-open', formeln: 'sigma' };

/** Weiter zum ausführlichen Material der App (die Ausgangssituation hat keins). */
const MEHR: Partial<Record<Art, { to: string; label: string }>> = {
  sql: { to: BELEGSATZ_PFAD, label: 'ausführlicher Belegsatz' },
  formeln: { to: '/material/formeln', label: 'ganze Formelsammlung' },
};

/** Gibt es etwas anzuzeigen? Für die Bedingung um die Knopfleiste (nicht leer rendern). */
export const hatAnhang = (a: { sql?: boolean; formeln?: boolean; situation?: readonly Section[] }) =>
  !!(a.sql || a.formeln || a.situation?.length);

/**
 * Knöpfe „Ausgangssituation“, „SQL-Belegsatz“ und/oder „Formelübersicht“ und das Seitenpanel dazu (rechts, auf dem Handy über die ganze
 * Breite; immer nur eins offen). Esc oder „Schließen“ schließen es, der Fokus geht dann zurück auf den Knopf.
 * `situation`: die Anlagen der Übungsklausur (Ausgangssituation, Tabellen …) – jederzeit einblendbar, auch mit der Taste A
 * (nicht beim Tippen, nicht mit Strg/Alt/⌘), damit man beim Beantworten nicht zum Seitenanfang scrollen muss.
 */
export function AnhangPanel({
  sql = false,
  formeln = false,
  situation,
}: {
  sql?: boolean;
  formeln?: boolean;
  situation?: readonly Section[];
}) {
  const [offen, setOffen] = useState<Art | null>(null);
  const knoepfe = useRef<Partial<Record<Art, HTMLButtonElement | null>>>({});
  const schliessen = useRef<HTMLButtonElement>(null);
  const zuletzt = useRef<Art | null>(null);

  useEffect(() => {
    if (offen) {
      schliessen.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOffen(null);
      };
      window.addEventListener('keydown', onKey);
      zuletzt.current = offen;
      return () => window.removeEventListener('keydown', onKey);
    }
    if (zuletzt.current) knoepfe.current[zuletzt.current]?.focus();
    return undefined;
  }, [offen]);

  const mitSituation = !!situation?.length;
  const arten: Art[] = [
    ...(mitSituation ? (['situation'] as const) : []),
    ...(sql ? (['sql'] as const) : []),
    ...(formeln ? (['formeln'] as const) : []),
  ];

  useEffect(() => {
    if (!mitSituation) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.key !== 'a' && e.key !== 'A') || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof Element && e.target.closest('input, select, textarea, [contenteditable="true"]')) return;
      e.preventDefault();
      setOffen((x) => (x === 'situation' ? null : 'situation'));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mitSituation]);

  if (!arten.length) return null;
  return (
    <>
      {arten.map((a) => (
        <button
          key={a}
          ref={(el) => {
            knoepfe.current[a] = el;
          }}
          type="button"
          className="secondary"
          aria-expanded={offen === a}
          aria-controls="anhang-panel"
          onClick={() => setOffen((x) => (x === a ? null : a))}
        >
          <Icon name={ICON[a]} /> {TITEL[a]}
          {a === 'situation' && (
            <>
              {' '}
              <kbd>A</kbd>
            </>
          )}
        </button>
      ))}
      {offen && (
        <aside id="anhang-panel" className="belegsatz-panel" aria-label={TITEL[offen]}>
          <div className="belegsatz-kopf">
            <h2>{TITEL[offen]}</h2>
            {MEHR[offen] && (
              <Link to={MEHR[offen].to} className="small">
                {MEHR[offen].label}
              </Link>
            )}
            <button ref={schliessen} type="button" className="ghost" onClick={() => setOffen(null)}>
              <Icon name="x" /> Schließen
            </button>
          </div>
          {offen === 'situation' ? (
            (situation ?? []).map((a) => (
              <section key={a.id} className="situation-teil">
                <h3>{a.title}</h3>
                <Markdown source={false}>{a.markdown}</Markdown>
              </section>
            ))
          ) : (
            <Suspense fallback={<p className="muted">Lädt …</p>}>{offen === 'sql' ? <SqlAuszug /> : <FormelUebersicht />}</Suspense>
          )}
        </aside>
      )}
    </>
  );
}

/** Nur der SQL-Belegsatz (SQL-Editor und SQL-Übungen). */
export const BelegsatzPanel = () => <AnhangPanel sql />;
