import { defineConfig } from '@playwright/test';

// Browser-Tests gegen den gebauten Stand (vite preview). Jeder Test bekommt ein leeres Browserprofil, der echte Lernstand bleibt unberührt.
// Lokal läuft der installierte Edge, in der CI (CI=true) das mit `npx playwright install chromium` geladene Chromium.
// E2E_KANAL überschreibt beides, z. B. E2E_KANAL=chrome.
const PORT = 4174;
const kanal = process.env.E2E_KANAL ?? (process.env.CI ? undefined : 'msedge');

export default defineConfig({
  testDir: 'e2e',
  // Bilder für den Pixelvergleich liegen lokal außerhalb der Versionsverwaltung (siehe e2e/visuell.spec.ts).
  snapshotPathTemplate: 'e2e-visuell/{projectName}/{arg}{ext}',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/`,
    channel: kanal,
    // Ohne Service Worker: Die Tests sollen den Stand der Dateien prüfen, nicht einen Zwischenspeicher.
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    acceptDownloads: true,
  },
  projects: process.env.E2E_VISUELL
    ? [
        { name: 'visuell', use: { viewport: { width: 1280, height: 900 } }, testMatch: /visuell\.spec\.ts/ },
        {
          name: 'visuell-handy',
          use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
          testMatch: /visuell\.spec\.ts/,
        },
      ]
    : [
        { name: 'desktop', use: { viewport: { width: 1280, height: 900 } }, testIgnore: /visuell\.spec\.ts/ },
        {
          name: 'handy',
          use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
          testMatch: /handy\.spec\.ts/,
        },
      ],
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
