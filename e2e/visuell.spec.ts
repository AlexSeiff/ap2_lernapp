import { expect, test, type Page } from '@playwright/test';
import { oeffne } from './hilfen';

// Pixelvergleich der Hauptseiten für reine Umbauten am Aussehen (CSS-Aufräumen, Phase 4 des Umbauplans).
// Läuft nur mit E2E_VISUELL=1 (siehe playwright.config.ts) und gegen lokal erzeugte Bilder: Sie hängen von Rechner, Browser und
// Schrift ab und gehören deshalb nicht ins Repository (e2e-visuell/ steht in .gitignore).
//   Bilder vom aktuellen Stand erzeugen:  E2E_VISUELL=1 npx playwright test --project=visuell --update-snapshots
//   Nach dem Umbau vergleichen:           E2E_VISUELL=1 npx playwright test --project=visuell
const SEITEN = [
  '/',
  '/heute',
  '/lernen',
  '/lernen/01',
  '/karteikarten',
  '/karteikarten/stand',
  '/klausur',
  '/aufgaben',
  '/aufgabe/02-B1',
  '/sql',
  '/sql/uebungen',
  '/rechnen',
  '/diagramme',
  '/diagramme/DG-EPK-001',
  '/json',
  '/fehlerjournal',
  '/glossar',
  '/glossar/median',
  '/material',
  '/material/formeln',
  '/material/sql-belegsatz',
  '/einstellungen',
  '/daten',
];

/** Wartet, bis die Seitenhöhe sechsmal hintereinander gleich ist: Abschnittstexte und Widgets laden teils nach dem ersten Zeichnen. */
async function warteBisRuhig(page: Page): Promise<void> {
  let letzte = -1;
  let gleich = 0;
  for (let i = 0; i < 40 && gleich < 6; i++) {
    const hoehe = await page.evaluate(() => document.documentElement.scrollHeight);
    gleich = hoehe === letzte ? gleich + 1 : 0;
    letzte = hoehe;
    await page.waitForTimeout(250);
  }
}

const FESTE_ZEIT = new Date('2026-11-20T10:00:00');

for (const farbe of ['light', 'dark'] as const) {
  test.describe(`Aussehen, ${farbe}`, () => {
    test.use({ colorScheme: farbe, reducedMotion: 'reduce' });
    for (const seite of SEITEN) {
      test(seite, async ({ page }) => {
        await page.clock.setFixedTime(FESTE_ZEIT);
        await oeffne(page, seite);
        await page.waitForLoadState('networkidle');
        // Schriften und Bilder abwarten, dann Eingabemarken und Animationen ruhigstellen.
        await page.evaluate(() => document.fonts.ready);
        // Erst wenn kein Ladetext („Lade Lernblätter …“, „Lade Rechenweg …“) mehr da ist, ist die Seite fertig aufgebaut.
        await expect(page.getByText(/^Läd[et] /)).toHaveCount(0, { timeout: 30_000 });
        await warteBisRuhig(page);
        await expect(page).toHaveScreenshot(`${farbe}${seite.replace(/[^a-zA-Z0-9]+/g, '_')}.png`, {
          fullPage: true,
          animations: 'disabled',
          caret: 'hide',
          maxDiffPixels: 0,
          // Der Importzeitpunkt („Stand: …“) ändert sich bei jedem Build und gehört nicht zum Aussehen.
          mask: seite === '/daten' ? [page.locator('p').filter({ hasText: /^Stand: \d/ })] : [],
        });
      });
    }
  });
}
