// Anhang der Prüfung zum Nachschlagen: SQL-Belegsatz (Umsetzungsplan Phase 6, Entscheidung E3; Material „sql-belegsatz“ aus
// AP-2/AP2_SQL_Belegsatz.md) und die Formelübersicht des Anhangs (Deep Dive 17, Teil 7). In der AP2 liegt beides bei – deshalb
// gibt es sie als Seitenpanel überall, wo gerechnet oder SQL geschrieben wird (SQL-Editor, Rechenübungen, Aufgaben, Klausur).

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Section } from '../../shared/types';
import { useThemaTexte } from '../lib/texte';
import { useStore } from '../lib/store';
import { Icon } from './Icon';
import { Markdown } from './Markdown';

export const BELEGSATZ_ID = 'sql-belegsatz';
export const BELEGSATZ_PFAD = `/material/${BELEGSATZ_ID}`;

/** Deep Dive 17, Teil 7 („Der Anhang der Prüfung“): Abschnitte mit den Formeln des Anhangs – Formelübersicht, Netzplan, Präfixe. */
export const ANHANG_THEMA = '17';
export const FORMEL_ABSCHNITTE = ['17-7-8-', '17-7-4-', '17-7-9-'];

/** Der Belegsatz aus dem Inhalt, oder undefined (Datei fehlt). */
export function useBelegsatz() {
  const { content } = useStore();
  return content.materials.find((m) => m.id === BELEGSATZ_ID);
}

/** Inhalt ohne die erste Überschrift (die Seite bzw. das Panel setzt eine eigene). */
export const ohneTitel = (md: string) => md.replace(/^#\s+[^\n]*\n+/, '');

/** Die Formel-Abschnitte des Anhangs in ihrer Reihenfolge (aus den geladenen Texten von Deep Dive 17). */
export const formelAbschnitte = (sections: Section[]) =>
  FORMEL_ABSCHNITTE.map((p) => sections.find((s) => s.id.startsWith(p))).filter((s): s is Section => !!s);

type Art = 'sql' | 'formeln';

const TITEL: Record<Art, string> = { sql: 'SQL-Belegsatz', formeln: 'Formelübersicht' };

/**
 * Knöpfe „SQL-Belegsatz“ und/oder „Formelübersicht“ und das Seitenpanel dazu (rechts, auf dem Handy über die ganze Breite; immer nur
 * eins offen). Esc oder „Schließen“ schließen es, der Fokus geht dann zurück auf den Knopf. Fehlt der Inhalt, fehlt der Knopf.
 */
export function AnhangPanel({ sql = false, formeln = false }: { sql?: boolean; formeln?: boolean }) {
  const { content } = useStore();
  const belegsatz = useBelegsatz();
  const hatFormeln = content.topics.some((t) => t.id === ANHANG_THEMA);
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

  const arten = [...(sql && belegsatz ? (['sql'] as const) : []), ...(formeln && hatFormeln ? (['formeln'] as const) : [])];
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
          <Icon name={a === 'sql' ? 'book-open' : 'sigma'} /> {TITEL[a]}
        </button>
      ))}
      {offen && (
        <aside id="anhang-panel" className="belegsatz-panel" aria-label={TITEL[offen]}>
          <div className="belegsatz-kopf">
            <h2>{TITEL[offen]}</h2>
            <Link to={offen === 'sql' ? BELEGSATZ_PFAD : '/material/formeln'} className="small">
              {offen === 'sql' ? 'als Seite öffnen' : 'ganze Formelsammlung'}
            </Link>
            <button ref={schliessen} type="button" className="ghost" onClick={() => setOffen(null)}>
              <Icon name="x" /> Schließen
            </button>
          </div>
          {offen === 'sql' ? (
            <Markdown source={false} className="belegsatz">
              {ohneTitel(belegsatz!.markdown)}
            </Markdown>
          ) : (
            <FormelAnhang />
          )}
        </aside>
      )}
    </>
  );
}

/** Nur der SQL-Belegsatz (SQL-Editor und SQL-Übungen). */
export const BelegsatzPanel = () => <AnhangPanel sql />;

/** Formeln aus dem Anhang der Prüfung (Deep Dive 17, 7.8, 7.4, 7.9); die Texte werden beim ersten Öffnen geladen. */
function FormelAnhang() {
  const { content } = useStore();
  const { topic, fehler } = useThemaTexte(content.topics.find((t) => t.id === ANHANG_THEMA));
  if (fehler) return <p className="error">{fehler}</p>;
  if (!topic) return <p className="muted">Lädt …</p>;
  return (
    <div className="belegsatz">
      <p className="hint">So steht es im Anhang der Prüfung – was nicht drinsteht, musst du selbst wissen.</p>
      {formelAbschnitte(topic.sections).map((s) => (
        <section key={s.id}>
          <h2>{s.title}</h2>
          <Markdown math source={false}>
            {s.markdown}
          </Markdown>
        </section>
      ))}
    </div>
  );
}
