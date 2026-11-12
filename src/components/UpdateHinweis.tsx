import { useState, useSyncExternalStore } from 'react';
import { aktualisieren, updateState } from '../lib/pwa';
import { Icon } from './Icon';

/** Hinweis „Neue Version verfügbar“ (Service Worker wartet, Roadmap 7.1). */
export function UpdateHinweis() {
  const wartet = useSyncExternalStore(updateState.subscribe, updateState.get, () => false);
  const [spaeter, setSpaeter] = useState(false);
  const [laedt, setLaedt] = useState(false);
  if (!wartet || spaeter) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span>
        <Icon name="refresh-cw" /> Neue Version verfügbar – neu laden?
      </span>
      <button
        type="button"
        disabled={laedt}
        onClick={() => {
          setLaedt(true);
          aktualisieren();
        }}
      >
        {laedt ? 'Lädt …' : 'Neu laden'}
      </button>
      <button type="button" className="ghost" onClick={() => setSpaeter(true)}>
        Später
      </button>
    </div>
  );
}
