import { expect, type Page } from '@playwright/test';

/** Der Lernstand liegt in IndexedDB (Datenbank „ap2-lernstand“, Eintrag „fortschritt“, siehe src/lib/idbFortschritt.ts). */
const IDB_NAME = 'ap2-lernstand';

/** Öffnet eine Adresse der App (HashRouter) und schließt die Willkommensseite, falls sie erscheint. */
export async function oeffne(page: Page, hash = '/'): Promise<void> {
  await page.goto(`./#${hash}`);
  // Erst den Ladezustand abwarten: Die Willkommensseite erscheint erst, wenn der Lernstand geladen ist (unter Last dauert das länger).
  await expect(page.locator('.loading')).toHaveCount(0, { timeout: 30_000 });
  const los = page.getByRole('button', { name: /Los geht/ });
  if (await los.isVisible({ timeout: 1000 }).catch(() => false)) await los.click();
  await expect(page.locator('.page, .buch, main').first()).toBeVisible();
}

/**
 * Gespeicherter Lernstand (geparst) oder null. Vorsicht beim Nachsehen: `indexedDB.open` legt eine fehlende Datenbank an – ohne den
 * Speicher der App darin, den sie beim Anlegen erzeugt. Deshalb nur öffnen, wenn es sie schon gibt.
 */
export async function lernstand(page: Page): Promise<Record<string, unknown> | null> {
  const text = await page.evaluate(async (name) => {
    const alle = (await indexedDB.databases?.()) ?? [];
    if (!alle.some((d) => d.name === name)) return null;
    const db = await new Promise<IDBDatabase>((ok, nein) => {
      const req = indexedDB.open(name);
      req.onsuccess = () => ok(req.result);
      req.onerror = () => nein(req.error);
    });
    try {
      if (!db.objectStoreNames.contains('kv')) return null;
      return await new Promise<string | null>((ok, nein) => {
        const req = db.transaction('kv', 'readonly').objectStore('kv').get('fortschritt');
        req.onsuccess = () => ok((req.result as string | undefined) ?? null);
        req.onerror = () => nein(req.error);
      });
    } finally {
      db.close();
    }
  }, IDB_NAME);
  return text ? (JSON.parse(text) as Record<string, unknown>) : null;
}

/** Wartet, bis der verzögerte Speicher den Lernstand geschrieben hat. */
export async function warteAufSpeichern(page: Page): Promise<Record<string, unknown>> {
  await expect.poll(async () => (await lernstand(page)) !== null, { timeout: 10_000 }).toBe(true);
  return (await lernstand(page))!;
}
