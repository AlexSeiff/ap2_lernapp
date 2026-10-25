import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveContentSource } from '../server/contentSource';
import { CONTENT_DIR, loadContent, SOURCE_DIR } from '../server/loadContent';

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});
function checkout() {
  const parent = mkdtempSync(join(tmpdir(), 'ap2-content-source-'));
  dirs.push(parent);
  const app = join(parent, 'lern-app');
  mkdirSync(app);
  return { parent, app };
}

describe('Inhaltsquelle bei lokalen Checkouts', () => {
  it('lädt die mitgelieferten Inhalte statt eines fachfremden Elternordners', () => {
    const { app, parent } = checkout();
    writeFileSync(join(parent, 'README.md'), 'Andere Projekte');
    expect(resolveContentSource(app)).toBe(join(app, 'content'));
  });

  it('behält vorhandene AP-2-Lernblätter als Live-Quelle', () => {
    const { app, parent } = checkout();
    writeFileSync(join(parent, 'DeepDive_01_SQL.md'), '# SQL');
    expect(resolveContentSource(app)).toBe(parent);
  });

  it('beachtet eine explizite Quelle auch dann, wenn diese noch nicht existiert', () => {
    const { app, parent } = checkout();
    const configured = join(parent, 'eigene-lernquelle');
    expect(resolveContentSource(app, configured)).toBe(resolve(configured));
  });

  it('liefert alle mitgelieferten Prüfungskarten und Begriffskarten', () => {
    const content = loadContent(CONTENT_DIR);
    expect(content.flashcards.filter((c) => c.deckId && c.deckId !== '').length).toBe(1550);
    expect(content.decks).toHaveLength(44);
    expect(content.issues).toEqual([]);
  });

  it('die Standardquelle dieses Checkouts enthält tatsächlich Lernkarten', () => {
    expect(loadContent(SOURCE_DIR).flashcards.length).toBeGreaterThanOrEqual(1550);
  });
});
