import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { defaultSettings, PROGRESS_VERSION } from '../shared/progress';
import { backupFileName, parseBackup } from '../src/lib/backup';

const fixture = (name: string) => readFileSync(join(import.meta.dirname, 'fixtures', name), 'utf8');

describe('parseBackup', () => {
  it('liest alte und aktuelle Sicherungen und bringt sie auf das aktuelle Format', () => {
    for (const name of ['fortschritt-v1-2026-09-22.json', 'fortschritt-v3-2026-09-28.json', 'fortschritt-v4-2026-09-30.json']) {
      const p = parseBackup(fixture(name));
      expect(p.version, name).toBe(PROGRESS_VERSION);
      expect(p.attempts.length, name).toBeGreaterThan(0);
      expect(p.settings, name).toEqual(defaultSettings());
    }
  });

  it('lehnt Dateien ohne Versuchsliste und kaputtes JSON mit deutscher Meldung ab', () => {
    expect(() => parseBackup('{ kaputt')).toThrow('kein gültiges JSON');
    for (const text of ['null', '[]', '{}', '{"attempts": 3}']) expect(() => parseBackup(text)).toThrow('Keine gültige Sicherungsdatei.');
  });

  it('lehnt eine Sicherung aus einer neueren App-Version ab, statt sie abzuschneiden', () => {
    const neu = JSON.stringify({ ...JSON.parse(fixture('fortschritt-v4-2026-09-30.json')), version: PROGRESS_VERSION + 1, unbekannt: 1 });
    expect(() => parseBackup(neu)).toThrow('neueren Version');
  });

  it('Dateiname mit App-Name und Datum', () => {
    expect(backupFileName('2026-09-30')).toBe('ap2-lernapp-sicherung-2026-09-30.json');
  });
});
