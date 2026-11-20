import { expect, test } from '@playwright/test';
import { oeffne } from './hilfen';

test('Handybreite: keine seitliche Bildlaufleiste auf den Hauptseiten', async ({ page }) => {
  for (const hash of ['/', '/karteikarten', '/lernen', '/glossar', '/sql', '/einstellungen']) {
    await oeffne(page, hash);
    const breiter = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(breiter, `Seite ${hash} läuft über den Bildschirm hinaus`).toBe(false);
  }
});
