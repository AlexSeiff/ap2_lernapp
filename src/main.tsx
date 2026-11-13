import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ConfirmProvider } from './components/ConfirmDialog';
import { registriereServiceWorker } from './lib/pwa';
import { StoreProvider } from './lib/store';
import { ladeDetailsFuerAdresse } from './lib/details';
import { ladeTexteFuerAdresse } from './lib/texte';
import { leseTheme, wendeThemeAn } from './lib/theme';
import './styles.css';
import './apple.css';
import './paper.css';
// Schriften des Notizbuchs, mit der App ausgeliefert (offline): Atkinson Hyperlegible für Text, Kalam für Handschriftliches.
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-400-italic.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
import '@fontsource/kalam/latin-400.css';
import '@fontsource/kalam/latin-700.css';
import './notizbuch.css';

// Farbschema vor dem ersten Zeichnen setzen (kein Aufblitzen im falschen Design).
wendeThemeAn(leseTheme());
// Direkt geöffnetes Lernblatt: seinen Text gleich mit dem Inhalt laden (lib/texte.ts).
ladeTexteFuerAdresse(window.location.hash);
ladeDetailsFuerAdresse(window.location.hash);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </StoreProvider>
  </StrictMode>,
);

// Service Worker für offline und Updates (Roadmap 7.1), nur im gebauten Stand – der Entwicklungsserver hat kein sw.js.
// Erst nach dem Laden, damit er den Start nicht bremst.
if (import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void registriereServiceWorker();
  });
}
