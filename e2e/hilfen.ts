import { expect, type Page } from '@playwright/test';

/** Schlüssel des Lernstands im localStorage (siehe src/lib/staticApi.ts). */
export const PROGRESS_KEY = 'ap2-fortschritt';

/** Öffnet eine Adresse der App (HashRouter) und schließt die Willkommensseite, falls sie erscheint. */
export async function oeffne(page: Page, hash = '/'): Promise<void> {
  await page.goto(`./#${hash}`);
  // Erst den Ladezustand abwarten: Die Willkommensseite erscheint erst, wenn der Lernstand geladen ist (unter Last dauert das länger).
  await expect(page.locator('.loading')).toHaveCount(0, { timeout: 30_000 });
  const los = page.getByRole('button', { name: /Los geht/ });
  if (await los.isVisible({ timeout: 1000 }).catch(() => false)) await los.click();
  await expect(page.locator('.page, .buch, main').first()).toBeVisible();
}

/** Gespeicherter Lernstand (geparst) oder null. */
export async function lernstand(page: Page): Promise<Record<string, unknown> | null> {
  const raw = await page.evaluate((k) => localStorage.getItem(k), PROGRESS_KEY);
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
}

/** Wartet, bis der verzögerte Speicher den Lernstand geschrieben hat. */
export async function warteAufSpeichern(page: Page): Promise<Record<string, unknown>> {
  await expect.poll(async () => (await lernstand(page)) !== null, { timeout: 10_000 }).toBe(true);
  return (await lernstand(page))!;
}
