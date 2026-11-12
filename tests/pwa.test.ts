import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PWA_OPTIONS } from '../build/pwaPlugin';
import { createUpdateState } from '../src/lib/pwa';

const PUBLIC = join(import.meta.dirname, '..', 'public');

/** Breite und Höhe aus dem IHDR-Block einer PNG-Datei. */
function pngGroesse(datei: string) {
  const b = readFileSync(datei);
  expect(b.subarray(1, 4).toString('latin1')).toBe('PNG');
  return `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`;
}

describe('PWA-Konfiguration (Pages)', () => {
  it('Manifest mit relativen Pfaden, Icons vorhanden und in der angegebenen Größe', () => {
    const m = PWA_OPTIONS.manifest;
    expect(m.start_url).toBe('./');
    expect(m.scope).toBe('./');
    expect(m.display).toBe('standalone');
    expect(m.icons.some((i) => i.purpose === 'maskable')).toBe(true);
    for (const icon of m.icons) {
      expect(icon.src.startsWith('/')).toBe(false);
      const datei = join(PUBLIC, icon.src);
      expect(existsSync(datei)).toBe(true);
      expect(pngGroesse(datei)).toBe(icon.sizes);
    }
    for (const a of PWA_OPTIONS.includeAssets) expect(existsSync(join(PUBLIC, a))).toBe(true);
  });

  it('Precache umfasst content.json, WASM und KaTeX-Schriften; Update nur auf Nachfrage', () => {
    const glob = PWA_OPTIONS.workbox.globPatterns.join(' ');
    for (const ext of ['html', 'js', 'css', 'json', 'wasm', 'woff2']) expect(glob).toContain(ext);
    expect(PWA_OPTIONS.registerType).toBe('prompt');
    expect('skipWaiting' in PWA_OPTIONS.workbox).toBe(false);
  });
});

describe('createUpdateState', () => {
  it('meldet Änderungen genau einmal und lässt sich abbestellen', () => {
    const s = createUpdateState();
    let aufrufe = 0;
    const ab = s.subscribe(() => aufrufe++);
    expect(s.get()).toBe(false);
    s.set(true);
    s.set(true);
    expect(s.get()).toBe(true);
    expect(aufrufe).toBe(1);
    ab();
    s.set(false);
    expect(aufrufe).toBe(1);
  });
});
