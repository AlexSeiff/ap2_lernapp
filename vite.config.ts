/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { DEV_PORT } from './shared/config';

export default defineConfig(async ({ mode }) => {
  // npm run build:pages: statische Version für GitHub Pages – ohne Server und KI, Inhalte aus content/ als content.json.
  // Relative Pfade (base './'), damit sie unter https://alexseiff.github.io/ap2_lernapp/ funktioniert (HashRouter).
  // .env.local wird hier gar nicht erst gelesen, der API-Schlüssel kann also nicht in den Build geraten.
  if (mode === 'pages') {
    const { contentJsonPlugin } = await import('./server/pagesPlugin');
    const { pwaPlugin } = await import('./server/pwaPlugin');
    return { base: './', plugins: [react(), contentJsonPlugin(), pwaPlugin()] };
  }

  // ANTHROPIC_API_KEY / ANTHROPIC_MODEL / LERN_QUELLE dürfen auch in .env.local stehen (gilt für dev und preview).
  // Das API-Plugin erst danach laden: server/ai.ts und server/loadContent.ts lesen MODEL und LERN_QUELLE beim Import.
  const env = loadEnv(mode, import.meta.dirname, '');
  for (const key of ['ANTHROPIC_API_KEY', 'ANTHROPIC_MODEL', 'LERN_QUELLE']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }
  const { apiPlugin } = await import('./server/apiPlugin');
  return {
    plugins: [react(), apiPlugin()],
    server: { port: DEV_PORT },
    // npm start (vite preview): gebaute App mit derselben API und denselben Daten auf demselben Port –
    // deshalb nicht gleichzeitig mit npm run dev starten.
    preview: { port: DEV_PORT },
    test: { include: ['tests/**/*.test.ts'] },
  };
});
