import { useEffect, useRef } from 'react';
import { wischRichtung } from '../lib/blaettern';

/** Hier wird nie geblättert: Eingaben, Editoren und alles, was selbst waagerecht wischt oder gezogen wird. */
const KEIN_WISCHEN = 'input, textarea, select, [contenteditable="true"], .cm-editor, table, pre, svg, .katex-display, [data-no-swipe]';
/** So breit ist der Rand, an dem das System selbst wischt (Zurück-Geste); dort beginnt kein Blättern. */
const RAND = 24;

/** Steckt das Element in einem waagerecht scrollbaren Bereich (breite Tabelle, Code, Formel)? */
function inWaagerechtemScroller(el: Element | null): boolean {
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    if (n.scrollWidth > n.clientWidth + 1 && /(auto|scroll)/.test(getComputedStyle(n).overflowX)) return true;
  }
  return false;
}

/** Läuft das Ereignis in einem Eingabefeld o. Ä.? */
const inEingabe = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest('input, select, textarea, [contenteditable="true"]');

/**
 * Blättern per Wischen (Touch: nach links = weiter, nach rechts = zurück) und Pfeiltasten (← zurück, → weiter) auf der ganzen Seite.
 * Ohne Ziel (`undefined`) tut die Richtung nichts. Kein Blättern bei markiertem Text, in Eingaben/Editoren/Tabellen/Grafiken,
 * in waagerecht scrollbaren Bereichen und mit Strg/Alt/⌘.
 */
export function useSeitenWischen(zurueck: (() => void) | undefined, weiter: (() => void) | undefined) {
  const ziele = useRef({ zurueck, weiter });
  useEffect(() => {
    ziele.current = { zurueck, weiter };
  });

  useEffect(() => {
    let start: { x: number; y: number } | null = null;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      const ziel = e.target instanceof Element ? e.target : null;
      const gueltig =
        e.touches.length === 1 &&
        t.clientX > RAND &&
        t.clientX < window.innerWidth - RAND &&
        !ziel?.closest(KEIN_WISCHEN) &&
        !inWaagerechtemScroller(ziel);
      start = gueltig ? { x: t.clientX, y: t.clientY } : null;
    };
    const onEnd = (e: TouchEvent) => {
      const s = start;
      start = null;
      if (!s || !window.getSelection()?.isCollapsed) return;
      const t = e.changedTouches[0];
      const richtung = wischRichtung(t.clientX - s.x, t.clientY - s.y);
      if (richtung === 'links') ziele.current.weiter?.();
      else if (richtung === 'rechts') ziele.current.zurueck?.();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (inEingabe(e.target)) return;
      const ziel = e.key === 'ArrowLeft' ? ziele.current.zurueck : ziele.current.weiter;
      if (!ziel) return;
      e.preventDefault();
      ziel();
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, []);
}
