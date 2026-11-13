import { useEffect } from 'react';

/**
 * Blöcke, die direkt auf dem karierten Papier liegen. Dieselbe Liste steht in notizbuch.css („Raster“) – dort bekommen sie ihren
 * Abstand nach unten als `var(--abstand) + var(--rest)`.
 */
export const RASTER_BLOECKE = '#inhalt > *, .page > *, .raster > *, .learning-sheet > *, .theory > *, .theory > .md > *, .page > .md > *';

/**
 * Hält die Seite im Kästchenraster (notizbuch.css): Jede Textzeile ist ein Kästchen (--k) hoch, aber Tabellen, Formeln, Bilder oder
 * Karten haben beliebige Höhen. Der Haken misst jeden Block und setzt `--rest` auf das, was bis zur nächsten Kästchenlinie fehlt –
 * so beginnt der folgende Block wieder auf einer Linie und das Karo läuft zwischen den Textzeilen statt durch die Buchstaben.
 * Nur der Abstand ändert sich, nie die Größe des Blocks; deshalb löst die Messung keine neue Messung aus.
 */
export function useRaster() {
  useEffect(() => {
    const main = document.getElementById('inhalt');
    if (!main || typeof ResizeObserver === 'undefined' || typeof MutationObserver === 'undefined') return;
    const k = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--k')) || 26;
    const setze = (el: HTMLElement, hoehe: number) => {
      const ueber = hoehe % k;
      const fehlt = ueber < 0.5 || k - ueber < 0.5 ? 0 : k - ueber;
      if (fehlt) el.style.setProperty('--rest', `${fehlt.toFixed(2)}px`);
      else el.style.removeProperty('--rest');
    };
    const groesse = new ResizeObserver((eintraege) => {
      for (const e of eintraege) setze(e.target as HTMLElement, e.borderBoxSize?.[0]?.blockSize ?? (e.target as HTMLElement).offsetHeight);
    });
    const gesehen = new WeakSet<Element>();
    const sammeln = () => {
      for (const el of main.querySelectorAll<HTMLElement>(RASTER_BLOECKE)) {
        if (gesehen.has(el)) continue;
        gesehen.add(el);
        groesse.observe(el);
      }
    };
    sammeln();
    let geplant = 0;
    const baum = new MutationObserver(() => {
      if (geplant) return;
      geplant = requestAnimationFrame(() => {
        geplant = 0;
        sammeln();
      });
    });
    baum.observe(main, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(geplant);
      baum.disconnect();
      groesse.disconnect();
    };
  }, []);
}
