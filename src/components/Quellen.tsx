// Quellen und Lehrvideos (Umsetzungsplan Phase 8): Links zum Nachlesen und Ansehen auf Begriffsseiten und am Ende der Lernblatt-
// Abschnitte. Videos von Studyflix werden verlinkt; eingebettet wird nur ein YouTube-Video mit youtubeId – mit Zwei-Klick-Lösung:
// Vor dem Klick lädt nichts von YouTube, danach nur über youtube-nocookie.com (Entscheidung E5, Hinweis in Datenschutz.tsx).

import { useEffect, useMemo, useState } from 'react';
import { quellenNachZiel, type Quelle } from '../../domain/quellen';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

/** Quellen zu einem Ziel (`abschnitt:<id>` oder `begriff:<id>`) aus dem Inhalt. */
export function useQuellen(ziel: string): Quelle[] {
  const { content } = useStore();
  const nach = useMemo(() => quellenNachZiel(content.quellen), [content.quellen]);
  return nach.get(ziel) ?? [];
}

/** Ist der Browser online? Folgt den online/offline-Ereignissen. */
function useOnline() {
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine !== false);
  useEffect(() => {
    const an = () => setOnline(true);
    const aus = () => setOnline(false);
    window.addEventListener('online', an);
    window.addEventListener('offline', aus);
    return () => {
      window.removeEventListener('online', an);
      window.removeEventListener('offline', aus);
    };
  }, []);
  return online;
}

/** YouTube-Video mit Zwei-Klick-Lösung: erst nach „Video laden“ entsteht der iframe (youtube-nocookie.com). */
export function YoutubeZweiKlick({ id, titel }: { id: string; titel: string }) {
  const [geladen, setGeladen] = useState(false);
  const online = useOnline();
  if (!online) {
    return (
      <p className="video-hinweis muted">
        <Icon name="wifi-off" /> Video nur online verfügbar.
      </p>
    );
  }
  if (geladen) {
    return (
      <div className="video-rahmen">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`}
          title={`Video: ${titel}`}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="video-hinweis video-zweiklick">
      <p className="small">
        Das Video liegt bei YouTube. Erst wenn du es lädst, werden Daten wie deine IP-Adresse an YouTube (Google) übertragen.
      </p>
      <button type="button" className="secondary" onClick={() => setGeladen(true)}>
        <Icon name="circle-play" /> Video laden
      </button>
    </div>
  );
}

/** Liste externer Quellen; öffnet in einem neuen Tab. `titel`: Beschriftung über der Liste (ohne Überschrift-Semantik). */
export function QuellenListe({ quellen, titel = 'Weiterlesen und ansehen' }: { quellen: Quelle[]; titel?: string }) {
  if (!quellen.length) return null;
  return (
    <div className="quellen-box no-print">
      <p className="quellen-titel">
        <Icon name="external-link" /> {titel}
      </p>
      <ul className="quellen-liste" aria-label={titel}>
        {quellen.map((q) => (
          <li key={q.url}>
            <a href={q.url} target="_blank" rel="noopener noreferrer">
              {q.titel}
              <span className="sr-only"> (öffnet in neuem Tab)</span>
            </a>{' '}
            <span className="muted small">
              {q.anbieter}
              {q.art === 'video' && (
                <>
                  {' · '}
                  <Icon name="circle-play" /> mit Video
                </>
              )}
            </span>
            {q.youtubeId && <YoutubeZweiKlick id={q.youtubeId} titel={q.titel} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
