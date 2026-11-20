import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { oeffne } from './hilfen';

// Post-its am Buchrand (Umbauplan Phase 10, styles/postits.css): Ausgangssituation, SQL-Belegsatz, Formelübersicht und Diagrammelemente stehen auf dem Desktop
// als Zettel am rechten Buchrand, ein Klick öffnet das Blatt daneben. Unter 1100 px bleiben die Knöpfe im Text.

const zettel = (page: Page, name: string) => page.getByRole('button', { name, exact: false }).filter({ hasText: name });
const blatt = (page: Page) => page.locator('#anhang-panel');

async function box(page: Page, locator: ReturnType<Page['locator']>) {
  const b = await locator.boundingBox();
  expect(b).not.toBeNull();
  return b!;
}

test.describe('Desktop (1280 px): Zettel am Buchrand', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('die Zettel ragen rechts aus der Buchkante, sind farbig und senkrecht beschriftet', async ({ page }) => {
    await oeffne(page, '/aufgabe/02-B1');
    const diagramme = zettel(page, 'Diagrammelemente');
    const situation = zettel(page, 'Ausgangssituation');
    await expect(diagramme).toBeVisible();
    await expect(situation).toBeVisible();

    const buch = await box(page, page.locator('.buch'));
    const d = await box(page, diagramme);
    const s = await box(page, situation);
    // Sie sitzen an der rechten Buchkante und ragen darüber hinaus; schmal und hoch (senkrechte Schrift), untereinander.
    expect(d.x + d.width).toBeGreaterThan(buch.x + buch.width);
    expect(d.width).toBeLessThan(60);
    expect(d.height).toBeGreaterThan(d.width * 2);
    expect(d.y).toBeGreaterThan(s.y + s.height - 1);
    expect(await diagramme.evaluate((e) => getComputedStyle(e).writingMode)).toBe('vertical-rl');
    expect(await situation.evaluate((e) => getComputedStyle(e).backgroundColor)).not.toBe(
      await diagramme.evaluate((e) => getComputedStyle(e).backgroundColor),
    );
  });

  test('ein Klick öffnet das Blatt neben den Zetteln, ein zweiter oder Esc schließt es, der Fokus kehrt zurück', async ({ page }) => {
    await oeffne(page, '/aufgabe/02-B1');
    const diagramme = zettel(page, 'Diagrammelemente');
    await expect(diagramme).toHaveAttribute('aria-expanded', 'false');
    await diagramme.click();
    await expect(diagramme).toHaveAttribute('aria-expanded', 'true');
    await expect(blatt(page)).toBeVisible();
    await expect(blatt(page)).toContainText('ER-Diagramm');
    await expect(blatt(page).locator('table.beiblatt-tabelle')).toBeVisible();

    // Das Blatt verdeckt die Zettel nicht: Es endet links von ihnen.
    const b = await box(page, blatt(page));
    const z = await box(page, diagramme);
    expect(b.x + b.width).toBeLessThanOrEqual(z.x + 1);

    await page.keyboard.press('Escape');
    await expect(blatt(page)).toHaveCount(0);
    await expect(diagramme).toBeFocused();

    await diagramme.click();
    await expect(blatt(page)).toBeVisible();
    await diagramme.click();
    await expect(blatt(page)).toHaveCount(0);
  });

  test('es ist immer nur ein Blatt offen', async ({ page }) => {
    await oeffne(page, '/aufgabe/02-B1');
    await zettel(page, 'Ausgangssituation').click();
    await expect(blatt(page)).toContainText('Ausgangssituation');
    await zettel(page, 'Diagrammelemente').click();
    await expect(blatt(page)).toContainText('ER-Diagramm');
    await expect(page.locator('#anhang-panel')).toHaveCount(1);
    await expect(zettel(page, 'Ausgangssituation')).toHaveAttribute('aria-expanded', 'false');
  });

  test('in der Klausur bleibt das Antwortfeld bedienbar, während die Ausgangssituation offen ist (Taste A)', async ({ page }) => {
    await oeffne(page, '/klausur/05');
    await page.getByRole('button', { name: /Klausur starten/ }).click();
    await expect(zettel(page, 'Ausgangssituation')).toBeVisible();
    await expect(zettel(page, 'Diagrammelemente')).toBeVisible();

    await page.keyboard.press('a');
    await expect(blatt(page)).toBeVisible();
    // Nicht modal: ohne abgedunkelten Hintergrund, und man kann links im Text weiterschreiben.
    const feld = page.locator('textarea').first();
    await feld.scrollIntoViewIfNeeded();
    // Das offene Blatt steht rechts über der Seite (wie das alte Seitenpanel); angeklickt wird der freie linke Teil des Feldes.
    await feld.click({ position: { x: 30, y: 20 } });
    await feld.fill('Meine Antwort bei offener Ausgangssituation');
    await expect(feld).toHaveValue('Meine Antwort bei offener Ausgangssituation');
    await expect(blatt(page)).toBeVisible();
    // Die Taste A im Eingabefeld öffnet oder schließt nichts.
    await feld.press('a');
    await expect(blatt(page)).toBeVisible();
  });

  test('Rechenübung und SQL-Editor haben ihre Zettel (Formelübersicht, SQL-Belegsatz)', async ({ page }) => {
    await oeffne(page, '/rechnen');
    await page.locator('a[href*="#/rechnen/"]').first().click();
    await zettel(page, 'Formelübersicht').click();
    await expect(blatt(page)).toContainText('Mittelwert');
    await oeffne(page, '/sql');
    await zettel(page, 'SQL-Belegsatz').click();
    await expect(blatt(page)).toBeVisible();
  });

  test('Diagramm-Übung: Beiblatt zur Notation der Übung', async ({ page }) => {
    await oeffne(page, '/diagramme/DG-EPK-001');
    await zettel(page, 'Diagrammelemente').click();
    await expect(blatt(page)).toContainText('Ereignisgesteuerte Prozesskette');
    await expect(blatt(page)).not.toContainText('BPMN 2.0');
  });

  for (const farbe of ['light', 'dark'] as const) {
    test(`Barrierefreiheit mit offenem Blatt (${farbe}, axe)`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: farbe });
      await oeffne(page, '/aufgabe/05-B1');
      await zettel(page, 'Diagrammelemente').click();
      await expect(blatt(page)).toBeVisible();
      const ergebnis = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const schwer = ergebnis.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(schwer.map((v) => `${v.id}: ${v.nodes[0]?.target.join(' ')}`)).toEqual([]);
    });
  }

  test('mit „Bewegung reduzieren“ ploppt nichts auf (keine Animation)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await oeffne(page, '/aufgabe/02-B1');
    await zettel(page, 'Diagrammelemente').click();
    await expect(blatt(page)).toBeVisible();
    expect(await blatt(page).evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
  });

  test('ohne reduzierte Bewegung ploppt das Blatt auf', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await oeffne(page, '/aufgabe/02-B1');
    await zettel(page, 'Diagrammelemente').click();
    expect(await blatt(page).evaluate((e) => getComputedStyle(e).animationName)).toBe('postit-auf');
  });
});

test.describe('Handybreite (390 px): die Knöpfe bleiben im Text', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('Knopfleiste statt Zettel, das Blatt füllt die Breite', async ({ page }) => {
    await oeffne(page, '/aufgabe/02-B1');
    const diagramme = zettel(page, 'Diagrammelemente');
    await expect(diagramme).toBeVisible();
    expect(await diagramme.evaluate((e) => getComputedStyle(e).writingMode)).toBe('horizontal-tb');
    expect(await page.locator('.anhang-leiste').evaluate((e) => getComputedStyle(e).position)).not.toBe('fixed');
    await diagramme.click();
    const b = await box(page, blatt(page));
    expect(b.width).toBeGreaterThan(380);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });
});
