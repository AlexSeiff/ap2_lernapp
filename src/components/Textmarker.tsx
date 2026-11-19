import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { beruehrt, entferne, gueltigeMarken, loescheMarken, markenVon, markiere, setzeMarken, type Farbe } from '../lib/textmarker';
import { auswahlStellen, entferneMarken, textmarkerMoeglich, zeigeMarken } from '../lib/textmarkerDom';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

type Leiste = { x: number; y: number; von: number; bis: number; markiert: boolean };

/**
 * Text, in dem man Stellen mit dem Finger oder der Maus markieren kann (Keywords, Zahlen, Bedingungen): Text auswählen → Leiste mit
 * zwei Farben und „Entfernen“. `bereich`: Id für die Speicherung (Aufgaben-Id bzw. Id der Anlage); dieselbe Id zeigt dieselben Marken
 * an mehreren Stellen. Die Marken stehen im Fortschritt (Sicherung, Zusammenführen) und werden nur gezeichnet, wo der Text noch passt.
 */
export function Textmarker({ bereich, children }: { bereich: string; children: ReactNode }) {
  const { progress, update } = useStore();
  const moeglich = textmarkerMoeglich();
  const wurzel = useRef<HTMLDivElement>(null);
  const id = useId();
  const marken = progress.hervorhebungen[bereich]?.marken;
  const [leiste, setLeiste] = useState<Leiste | null>(null);

  // Marken zeichnen und nachführen, wenn sich der Text ändert (z. B. Formeln werden nachgeladen).
  useEffect(() => {
    const el = wurzel.current;
    if (!moeglich || !el) return undefined;
    const zeichne = () => zeigeMarken(id, el, gueltigeMarken(marken ?? [], el.textContent ?? ''));
    zeichne();
    const beobachter = new MutationObserver(zeichne);
    beobachter.observe(el, { childList: true, subtree: true, characterData: true });
    return () => {
      beobachter.disconnect();
      entferneMarken(id);
    };
  }, [moeglich, marken, id]);

  // Auswahl beobachten: Leiste unter der Auswahl, sobald sie ganz in diesem Text liegt und eine kurze Pause vergangen ist.
  useEffect(() => {
    const el = wurzel.current;
    if (!moeglich || !el) return undefined;
    let timer: number | undefined;
    const pruefe = () => {
      const sel = window.getSelection();
      const range = sel && sel.rangeCount ? sel.getRangeAt(0) : undefined;
      const stellen = range && auswahlStellen(el, range);
      if (!range || !stellen) return setLeiste(null);
      const r = range.getBoundingClientRect();
      const text = el.textContent ?? '';
      const markiert = beruehrt(gueltigeMarken(markenVon(progress, bereich), text), stellen.von, stellen.bis);
      // Unter der Auswahl: Über ihr zeigen Handys ihre eigene Leiste (Kopieren, Teilen …).
      setLeiste({ x: Math.min(Math.max(r.left + r.width / 2, 110), window.innerWidth - 110), y: r.bottom + 8, ...stellen, markiert });
    };
    const verzoegert = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(pruefe, 200);
    };
    document.addEventListener('selectionchange', verzoegert);
    window.addEventListener('scroll', pruefe, { passive: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('selectionchange', verzoegert);
      window.removeEventListener('scroll', pruefe);
    };
  }, [moeglich, progress, bereich]);

  const wende = (aenderung: (alt: ReturnType<typeof gueltigeMarken>, text: string) => ReturnType<typeof gueltigeMarken>) => {
    const text = wurzel.current?.textContent ?? '';
    update((p) => setzeMarken(p, bereich, aenderung(gueltigeMarken(markenVon(p, bereich), text), text)));
    window.getSelection()?.removeAllRanges();
    setLeiste(null);
  };

  if (!moeglich) return <>{children}</>;
  return (
    <>
      <div ref={wurzel} className="textmarker">
        {children}
      </div>
      {!!marken?.length && (
        <p className="textmarker-weg no-print">
          <button type="button" className="ghost small" onClick={() => update((p) => loescheMarken(p, bereich))}>
            <Icon name="x" /> Markierungen im Text entfernen
          </button>
        </p>
      )}
      {leiste && (
        <div
          className="textmarker-leiste no-print"
          style={{ left: leiste.x, top: leiste.y }}
          role="toolbar"
          aria-label="Textstelle markieren"
        >
          {([1, 2] as Farbe[]).map((f) => (
            <button
              key={f}
              type="button"
              className={`marke-farbe marke-${f}`}
              aria-label={f === 1 ? 'Gelb markieren' : 'Grün markieren'}
              title={f === 1 ? 'Gelb markieren' : 'Grün markieren'}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => wende((alt, text) => markiere(alt, leiste.von, leiste.bis, f, text))}
            />
          ))}
          {leiste.markiert && (
            <button
              type="button"
              className="ghost small"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => wende((alt, text) => entferne(alt, leiste.von, leiste.bis, text))}
            >
              Entfernen
            </button>
          )}
        </div>
      )}
    </>
  );
}
