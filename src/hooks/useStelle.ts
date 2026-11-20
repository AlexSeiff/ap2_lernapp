import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Springt zu `?stelle=<id>` (Ziel der globalen Suche, ROADMAP 8.8): scrollt das Element mit dieser ID in den Blick und hebt es kurz
 * hervor. Ein Hash-Anker geht nicht, weil die App den HashRouter nutzt. `bereit` = Inhalt ist gerendert (z. B. Thema gefunden).
 */
export function useStelle(bereit = true) {
  const [params] = useSearchParams();
  const stelle = params.get('stelle');
  useEffect(() => {
    if (!stelle || !bereit) return;
    let nachher = 0;
    // Nach dem Rendern (und nachdem lazy Teile wie KaTeX Platz bekommen haben) springen.
    const t = window.setTimeout(() => {
      const el = document.getElementById(stelle);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('stelle-ziel');
      window.setTimeout(() => el.classList.remove('stelle-ziel'), 2500);
      // Nachladende Teile darüber (Formeln, Diagramme) verschieben das Ziel während des sanften Scrollens noch. Sobald das Scrollen
      // steht, einmal nachkorrigieren, damit das Ziel nicht unter der Kopfleiste landet (scroll-margin-top in styles/02-lernen-aufgaben-karten.css).
      let letzteY = -1;
      let runden = 0;
      nachher = window.setInterval(() => {
        runden++;
        if (window.scrollY !== letzteY && runden < 20) {
          letzteY = window.scrollY;
          return;
        }
        window.clearInterval(nachher);
        const soll = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        if (Math.abs(el.getBoundingClientRect().top - soll) > 4) el.scrollIntoView({ block: 'start' });
      }, 150);
    }, 80);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(nachher);
    };
  }, [stelle, bereit]);
  return stelle;
}
