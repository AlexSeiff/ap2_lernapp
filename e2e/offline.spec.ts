import { expect, test } from '@playwright/test';
import { oeffne } from './hilfen';

// Nach dem ersten Besuch lädt der Service Worker alles vor (Vorabspeicher, siehe build/pwaPlugin.ts) – danach muss die App ohne Netz laufen:
// alle Hauptseiten, eine SQL-Abfrage (WASM), Formeln (KaTeX-Schriften), ein Lernblatt (Abschnittstexte) und Begriffsseiten.
// Die Registrierung wartet beim ersten Besuch auf Ruhe (src/lib/pwa.ts, Umbauplan Phase 8); der Test bedient die Seite danach nicht mehr.
test.use({ serviceWorkers: 'allow' });

/** Anzahl der Dateien im Vorabspeicher des Service Workers. */
const vorabgespeichert = (page: import('@playwright/test').Page) =>
  page.evaluate(async () => {
    let n = 0;
    for (const name of await caches.keys()) if (name.startsWith('workbox-precache')) n += (await (await caches.open(name)).keys()).length;
    return n;
  });

test('nach dem Vorabspeichern funktioniert die App ohne Netz', async ({ page, context }) => {
  test.setTimeout(240_000);
  await oeffne(page, '/');
  // Der Vorabspeicher füllt sich, sobald die Seite eine Weile ruhig war (RUHE_MS in src/lib/pwa.ts).
  await expect.poll(() => vorabgespeichert(page), { timeout: 180_000, intervals: [1000] }).toBeGreaterThanOrEqual(150);
  await page.evaluate(() => navigator.serviceWorker.ready);

  await context.setOffline(true);
  // Gegenprobe: Offline ist wirklich offline – eine Datei, die es nicht im Cache gibt, kommt nicht.
  expect(
    await page.evaluate(() =>
      fetch(`./gibt-es-nicht.json?${Date.now()}`).then(
        () => 'online',
        () => 'offline',
      ),
    ),
  ).toBe('offline');
  // Neu laden: Jetzt steht die Seite unter Kontrolle des Service Workers, und index.html kommt aus dem Cache.
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Übersicht' })).toBeVisible({ timeout: 30_000 });

  // Lernblatt (Abschnittstexte je Thema) und Karteikarten (Karten- und Aufgabentexte)
  await oeffne(page, '/lernen/01');
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await expect(page.locator('.md').first()).toBeVisible();
  await oeffne(page, '/karteikarten');
  await expect(page.getByRole('button', { name: /Lernen starten/ })).toBeVisible();

  // Begriffsseite (begriffe.json) und Formelsammlung (KaTeX-Schriften)
  await oeffne(page, '/glossar/median');
  await expect(page.getByRole('heading', { name: 'Median', exact: true }).first()).toBeVisible();
  await oeffne(page, '/material/formeln');
  await expect(page.locator('.katex').first()).toBeVisible();

  // SQL-Abfrage (sql.js/WASM aus dem Cache)
  await oeffne(page, '/sql');
  await page.locator('.cm-content').first().click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('SELECT 1 AS offline;');
  await page.getByRole('button', { name: /Ausführen/ }).click();
  await expect(page.locator('table').first()).toContainText('offline');

  // Rechenübung, Diagramm-Übung und Klausur (Seitenchunks)
  await oeffne(page, '/rechnen');
  await page.locator('a[href*="#/rechnen/"]').first().click();
  await expect(page.getByRole('button', { name: /Prüfen/ }).first()).toBeVisible();
  await oeffne(page, '/diagramme/DG-EPK-001');
  await expect(page.getByRole('button', { name: /^Prüfen/ })).toBeVisible();
  await oeffne(page, '/klausur');
  await expect(page.locator('a.tile[href*="/klausur/"]').first()).toBeVisible();
});
