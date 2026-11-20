import { expect, test } from '@playwright/test';
import { lernstand, oeffne, warteAufSpeichern } from './hilfen';

// Zwei Tabs im selben Browser teilen den localStorage. Ein Tab darf den Fortschritt des anderen nie überschreiben.
test.describe('Zwei Tabs', () => {
  test('Fortschritt aus beiden Tabs bleibt erhalten, kein Neuladen in Schleife', async ({ context }) => {
    const a = await context.newPage();
    const b = await context.newPage();
    await oeffne(a, '/karteikarten');
    await oeffne(b, '/karteikarten');

    // Zähler für Neuladen in Tab B: Jedes Laden der Seite zählt.
    let ladungenB = 0;
    b.on('load', () => ladungenB++);

    await a.getByRole('button', { name: /Lernen starten/ }).click();
    await a.locator('.flashcard').click();
    await a.getByRole('button', { name: /Gewusst/ }).click();
    await warteAufSpeichern(a);

    // Tab B sieht den neuen Stand (nach Neuladen oder per Ereignis) und gerät nicht in eine Schleife.
    await expect.poll(async () => Object.keys(((await lernstand(b))?.cards ?? {}) as object).length).toBe(1);
    await b.waitForTimeout(3000);
    expect(ladungenB, 'Tab B lädt mehrfach neu').toBeLessThanOrEqual(1);

    // Tab B bewertet jetzt eine andere Karte; nichts aus Tab A geht verloren.
    await oeffne(b, '/karteikarten');
    await b.getByRole('button', { name: /Lernen starten/ }).click();
    await b.locator('.flashcard').click();
    await b.getByRole('button', { name: /Gewusst/ }).click();
    await expect.poll(async () => Object.keys(((await lernstand(a))?.cards ?? {}) as object).length).toBe(2);
    await a.waitForTimeout(3000);
    expect(Object.keys(((await lernstand(a))?.cards ?? {}) as object)).toHaveLength(2);
  });

  test('Eine angefangene Klausurantwort geht beim Speichern im anderen Tab nicht verloren', async ({ context }) => {
    const a = await context.newPage();
    const b = await context.newPage();
    await oeffne(a, '/karteikarten');
    await oeffne(b, '/klausur');
    await b.locator('a.tile[href*="/klausur/"]').first().click();
    await b.getByRole('button', { name: /Klausur starten/ }).click();
    const feld = b.locator('textarea').first();
    await feld.fill('Meine angefangene Antwort');

    await a.getByRole('button', { name: /Lernen starten/ }).click();
    await a.locator('.flashcard').click();
    await a.getByRole('button', { name: /Gewusst/ }).click();
    await warteAufSpeichern(a);
    await b.waitForTimeout(3000);

    await expect(b.locator('textarea').first()).toHaveValue('Meine angefangene Antwort');
  });

  test('Eine laufende Kartenrunde bleibt erhalten, wenn ein anderer Tab speichert', async ({ context }) => {
    const a = await context.newPage();
    const b = await context.newPage();
    await oeffne(a, '/karteikarten');
    await oeffne(b, '/karteikarten');
    let ladungenA = 0;
    a.on('load', () => ladungenA++);

    await a.getByRole('button', { name: /Lernen starten/ }).click();
    await a.locator('.flashcard').click();
    await expect(a.locator('.flashcard.flipped')).toHaveCount(1);

    await b.getByRole('button', { name: /Lernen starten/ }).click();
    await b.locator('.flashcard').click();
    await b.getByRole('button', { name: /Gewusst/ }).click();
    await warteAufSpeichern(b);
    await a.waitForTimeout(3000);

    expect(ladungenA, 'Tab A darf nicht neu laden').toBe(0);
    await expect(a.locator('.flashcard.flipped')).toHaveCount(1);
    // Beim Bewerten in Tab A bleibt auch die Bewertung aus Tab B erhalten.
    await a.getByRole('button', { name: /Gewusst/ }).click();
    await expect.poll(async () => Object.keys(((await lernstand(a))?.cards ?? {}) as object).length).toBe(2);
  });

  test('beide Tabs mit gleichzeitig ungespeicherten Änderungen: keine Endlosschleife, nichts bleibt auf „Speichert …“ stehen', async ({
    context,
  }) => {
    const a = await context.newPage();
    const b = await context.newPage();
    const zaehler = await context.newPage();
    await oeffne(a, '/einstellungen');
    await oeffne(b, '/einstellungen');
    await oeffne(zaehler, '/');
    // Ein dritter Tab zählt die Nachrichten auf dem Kanal des Lernstands.
    await zaehler.evaluate(() => {
      const fenster = window as unknown as { __nachrichten: number };
      fenster.__nachrichten = 0;
      new BroadcastChannel('ap2-lernstand').onmessage = () => fenster.__nachrichten++;
    });

    // Beide Tabs ändern kurz nacheinander (innerhalb der Verzögerung des Speicherns): Beide haben dann Ungespeichertes, wenn der andere schreibt.
    await a.locator('input[type="date"]').first().fill('2027-01-15');
    await b.locator('input[type="date"]').first().fill('2027-02-20');
    await a.waitForTimeout(4000);

    const nachrichten = await zaehler.evaluate(() => (window as unknown as { __nachrichten: number }).__nachrichten);
    expect(nachrichten, 'Die Tabs stoßen sich endlos gegenseitig an').toBeLessThanOrEqual(6);
    for (const tab of [a, b]) await expect(tab.getByText('Speichert …')).toHaveCount(0);
    const stand = await lernstand(a);
    expect(['2027-01-15', '2027-02-20']).toContain((stand?.settings as { examDate?: string }).examDate);
  });
});
