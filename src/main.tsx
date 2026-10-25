import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ConfirmProvider } from './components/ConfirmDialog';
import { IS_STATIC } from './lib/api';
import { registriereServiceWorker } from './lib/pwa';
import { StoreProvider } from './lib/store';
import { ladeTexteFuerAdresse } from './lib/texte';
import { leseTheme, wendeThemeAn } from './lib/theme';
import './styles.css';
import './apple.css';

// Farbschema vor dem ersten Zeichnen setzen (kein Aufblitzen im falschen Design).
wendeThemeAn(leseTheme());
// Direkt geöffnetes Lernblatt: seinen Text gleich mit dem Inhalt laden (lib/texte.ts).
ladeTexteFuerAdresse(window.location.hash);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </StoreProvider>
  </StrictMode>,
);

// Pages-Version: Service Worker für offline und Updates (Roadmap 7.1). Erst nach dem Laden, damit er den Start nicht bremst.
if (IS_STATIC) {
  window.addEventListener('load', () => {
    void registriereServiceWorker();
  });
}
