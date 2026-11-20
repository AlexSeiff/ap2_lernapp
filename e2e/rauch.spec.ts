import { expect, test } from '@playwright/test';
import { lernstand, oeffne, warteAufSpeichern } from './hilfen';

test.describe('Rauchtests: die wichtigsten Wege durch die App', () => {
  test('Karte bewerten: Fach und Lernstand werden gespeichert', async ({ page }) => {
    await oeffne(page, '/karteikarten');
    await page.getByRole('button', { name: /Lernen starten/ }).click();
    await page.locator('.flashcard').click();
    await page.getByRole('button', { name: /Gewusst/ }).click();
    const stand = await warteAufSpeichern(page);
    const karten = stand.cards as Record<string, { box?: number; fach?: number }>;
    expect(Object.keys(karten)).toHaveLength(1);
    const [karte] = Object.values(karten);
    expect(JSON.stringify(karte)).toMatch(/\d/);
  });

  test('Übungsklausur starten und abgeben zeigt ein Ergebnis', async ({ page }) => {
    await oeffne(page, '/klausur');
    await page.locator('a.tile[href*="/klausur/"]').first().click();
    await page.getByRole('button', { name: /Klausur starten/ }).click();
    await expect(page.getByRole('timer', { name: 'Restzeit' })).toBeVisible();
    await page.getByRole('button', { name: 'Abgeben', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Abgeben' }).click();
    await expect(page.getByText('Lösungsblatt freigeschaltet.')).toBeVisible();
    await page.getByRole('button', { name: 'Bewertung abschließen' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Abschließen' }).click();
    await expect(page.getByRole('heading', { name: /^Ergebnis:/ })).toBeVisible();
    // Das Ergebnis landet im gespeicherten Lernstand.
    await expect.poll(async () => ((await lernstand(page))?.exams as unknown[] | undefined)?.length ?? 0).toBe(1);
  });

  test('Sicherung herunterladen, Fortschritt löschen, Sicherung einspielen', async ({ page }) => {
    await oeffne(page, '/karteikarten');
    await page.getByRole('button', { name: /Lernen starten/ }).click();
    await page.locator('.flashcard').click();
    await page.getByRole('button', { name: /Gewusst/ }).click();
    const vorher = await warteAufSpeichern(page);

    await oeffne(page, '/daten');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Sicherung herunterladen/ }).click(),
    ]);
    const datei = test.info().outputPath('sicherung.json');
    await download.saveAs(datei);

    await page.getByRole('button', { name: /Fortschritt zurücksetzen/ }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Alles löschen' }).click();
    await expect.poll(async () => Object.keys(((await lernstand(page)) ?? { cards: {} }).cards as object).length).toBe(0);

    const [auswahl] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('button', { name: /Sicherung einspielen/ }).click(),
    ]);
    await auswahl.setFiles(datei);
    await page.getByRole('dialog').getByRole('button', { name: 'Ersetzen' }).click();
    await expect
      .poll(async () => Object.keys(((await lernstand(page)) ?? { cards: {} }).cards as object).length)
      .toBe(Object.keys(vorher.cards as object).length);
  });

  test('SQL: Abfrage ausführen liefert eine Ergebnistabelle', async ({ page }) => {
    await oeffne(page, '/sql');
    await page.locator('.cm-content').first().click();
    await page.keyboard.press('Control+A');
    await page.keyboard.type('SELECT 1 AS zahl;');
    await page.getByRole('button', { name: /Ausführen/ }).click();
    await expect(page.locator('table').first()).toContainText('zahl');
  });

  test('Diagramm-Übung: Prüfen bewertet die Lücken', async ({ page }) => {
    await oeffne(page, '/diagramme/DG-EPK-001');
    const pruefen = page.getByRole('button', { name: /^Prüfen/ });
    await expect(pruefen).toBeVisible();
    await expect(pruefen).toBeDisabled();
    await page.locator('.palette-element').first().click();
    await page.locator('[data-slot]').first().click({ force: true });
    await expect(pruefen).toBeEnabled();
    await pruefen.click();
    await expect(page.locator('.page')).toContainText(/richtig/i);
  });

  test('Suche öffnet mit Strg K und findet Begriffe', async ({ page }) => {
    await oeffne(page, '/');
    const feld = page.getByRole('combobox', { name: 'Suchbegriff' });
    // Die Tastenkürzel hängen erst nach dem Start der App am Fenster; bis dahin geht ein zu früher Tastendruck ins Leere.
    await expect(async () => {
      await page.keyboard.press('Control+K');
      await expect(feld).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 20_000 });
    await feld.fill('Median');
    await expect(page.getByRole('listbox', { name: 'Treffer' }).getByRole('option').first()).toBeVisible();
  });

  test('Design: dunkel und hell lassen sich umschalten', async ({ page }) => {
    await oeffne(page, '/einstellungen');
    const gruppe = page.getByRole('group', { name: 'Farbschema' });
    await gruppe.getByRole('button', { name: /dunkel/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await gruppe.getByRole('button', { name: /hell/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
