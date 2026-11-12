/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { contentJsonPlugin } from './build/inhaltPlugin.ts';
import { pwaPlugin } from './build/pwaPlugin.ts';
import { DEV_PORT } from './shared/config.ts';

// Die App ist rein statisch: Inhalte aus content/ als JSON neben der App, Fortschritt im Browser, kein Server.
// Relative Pfade (base './'), damit sie unter https://alexseiff.github.io/ap2_lernapp/ funktioniert (HashRouter).
export default defineConfig({
  base: './',
  plugins: [react(), contentJsonPlugin(), pwaPlugin()],
  server: { port: DEV_PORT },
  preview: { port: DEV_PORT },
  test: { include: ['tests/**/*.test.ts'] },
});
