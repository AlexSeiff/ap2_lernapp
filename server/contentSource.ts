import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** Explizite Quellen bleiben verbindlich; alte AP-2-Installationen behalten ihren Quellordner. */
export function resolveContentSource(appDir: string, configured?: string): string {
  if (configured?.trim()) return resolve(configured);
  const parent = resolve(appDir, '..');
  try {
    if (readdirSync(parent).some((name) => /^DeepDive_\d+_.+\.md$/.test(name) || /^AP2_.*Lernkarten\.json$/.test(name))) return parent;
  } catch {
    // Eigenständige Checkouts verwenden die mitgelieferten Inhalte.
  }
  return join(appDir, 'content');
}
