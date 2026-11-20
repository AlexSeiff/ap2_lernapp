import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { lernstand, oeffne, warteAufSpeichern } from './hilfen';

// Wo liegt der Lernstand? Seit Phase 5 des Umbauplans in IndexedDB; der alte localStorage-Eintrag zieht einmal verlustfrei um und bleibt
// als Rückfall stehen. Ohne IndexedDB (z. B. manche private Fenster) arbeitet die App mit dem localStorage weiter.
const ALT = readFileSync(join(import.meta.dirname, '..', 'tests', 'fixtures', 'fortschritt-v9-2026-11-19.json'), 'utf8');
const ALT_STAND = JSON.parse(ALT) as { attempts: unknown[]; cards: Record<string, unknown> };
const NEUES_DATUM = '2027-01-15';

const examDateIn = (stand: Record<string, unknown> | null) => (stand?.settings as { examDate?: string } | undefined)?.examDate;

/** Legt vor dem Start der App den alten Stand in den localStorage – so, als hätte der Browser ihn noch aus der Zeit vor dem Umbau. */
const mitAltemStand = (page: import('@playwright/test').Page, ohneIndexedDb = false) =>
  page.addInitScript(
    ({ text, ohne }) => {
      if (ohne) {
        Object.defineProperty(window, 'indexedDB', {
          get() {
            throw new Error('IndexedDB gesperrt');
          },
        });
      }
      if (localStorage.getItem('ap2-fortschritt') === null) localStorage.setItem('ap2-fortschritt', text);
    },
    { text: ALT, ohne: ohneIndexedDb },
  );

test.describe('Lernstand speichern', () => {
  test('ein alter Stand im localStorage zieht verlustfrei nach IndexedDB um, ohne Willkommensseite', async ({ page }) => {
    await mitAltemStand(page);
    await page.goto('./#/');
    await expect(page.locator('.loading')).toHaveCount(0, { timeout: 30_000 });
    // Es ist kein erster Besuch: keine Willkommensseite, sondern die Übersicht.
    await expect(page.getByRole('heading', { name: 'Übersicht' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Los geht/ })).toHaveCount(0);

    const stand = await warteAufSpeichern(page);
    expect(stand.attempts).toEqual(ALT_STAND.attempts);
    expect(stand.cards).toEqual(ALT_STAND.cards);
    // Der alte Eintrag bleibt als Rückfall unverändert stehen, der Umzug ist vermerkt.
    expect(await page.evaluate(() => localStorage.getItem('ap2-fortschritt'))).toBe(ALT);
    expect(await page.evaluate(() => localStorage.getItem('ap2-fortschritt-in-indexeddb'))).not.toBeNull();
  });

  test('nach dem Umzug wird nur noch in IndexedDB gespeichert, und nichts geht beim Neuladen verloren', async ({ page }) => {
    await mitAltemStand(page);
    await oeffne(page, '/einstellungen');
    await page.locator('input[type="date"]').first().fill(NEUES_DATUM);
    await expect.poll(async () => examDateIn(await lernstand(page))).toBe(NEUES_DATUM);

    await page.reload();
    await expect(page.locator('.loading')).toHaveCount(0, { timeout: 30_000 });
    const nachNeuladen = (await lernstand(page))!;
    expect(nachNeuladen.attempts).toEqual(ALT_STAND.attempts);
    expect(nachNeuladen.cards).toEqual(ALT_STAND.cards);
    expect(examDateIn(nachNeuladen)).toBe(NEUES_DATUM);
    // Der alte localStorage-Eintrag wurde nicht mehr angefasst.
    expect(await page.evaluate(() => localStorage.getItem('ap2-fortschritt'))).toBe(ALT);
  });

  test('ohne IndexedDB arbeitet die App mit dem localStorage weiter und verliert nichts', async ({ page }) => {
    await mitAltemStand(page, true);
    await oeffne(page, '/einstellungen');
    await page.locator('input[type="date"]').first().fill(NEUES_DATUM);
    const imLocalStorage = async () => {
      const raw = await page.evaluate(() => localStorage.getItem('ap2-fortschritt'));
      return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
    };
    await expect.poll(async () => examDateIn(await imLocalStorage())).toBe(NEUES_DATUM);
    // Der übrige Stand ist unverändert erhalten, und es wurde nichts umgezogen.
    expect((await imLocalStorage())!.attempts).toEqual(ALT_STAND.attempts);
    expect(await page.evaluate(() => localStorage.getItem('ap2-fortschritt-in-indexeddb'))).toBeNull();
  });
});
