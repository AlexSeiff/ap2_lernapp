import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, isContentFile } from '../build/inhalt';
import { JSON_DATEIEN, istJsonInhalt } from '../domain/inhaltsdateien';

// Welche Dateien liest die App? Die Dateimuster stehen an einer Stelle (domain/inhaltsdateien.ts). Dieser Test enthält die ALTE Regel als
// Referenz (Umbauplan Phase 7) und prüft, dass die neue für jede Datei im Inhaltsordner und für Grenzfälle dasselbe entscheidet.
const INHALT_MD = [
  /^DeepDive_\d+_.+\.md$/,
  /^Deep_Dive_SQL.*\.md$/,
  /^Lernzettel_Kernthemen\.md$/,
  /^AP2_Themenliste.*\.md$/,
  /^AP2_SQL_Belegsatz\.md$/,
  /^Begriffsseiten_(?:[A-Z]|0-9)\.md$/,
];
const alteRegel = (name: string): boolean =>
  INHALT_MD.some((re) => re.test(name)) ||
  /Lernkarten.*\.json$/i.test(name) ||
  /SQL_Uebungen.*\.json$/i.test(name) ||
  /Rechen_Uebungen.*\.json$/i.test(name) ||
  /Diagramm_Uebungen.*\.json$/i.test(name) ||
  /Json_Uebungen.*\.json$/i.test(name) ||
  /^AP2_Quellen\.json$/.test(name);

const GRENZFAELLE = [
  'AP2_FIDPA_Lernkarten.json',
  'AP2_Fachbegriffe_Lernkarten.json',
  'ap2_lernkarten_neu.JSON',
  'AP2_SQL_Uebungen.json',
  'AP2_SQL_Uebungen_2.json',
  'AP2_Rechen_Uebungen.json',
  'AP2_Diagramm_Uebungen.json',
  'AP2_Json_Uebungen.json',
  'AP2_Quellen.json',
  'AP2_Quellen_alt.json',
  'AP2_Quellen.json.bak',
  'Notizen.md',
  'Entwurf_Lernkarten.md',
  'DeepDive_17_Glossar_Diagramme.md',
  'DeepDive_17_Glossar_Diagramme_Loesungen.md',
  'Begriffsseiten_A.md',
  'Begriffsseiten_0-9.md',
  'Begriffsseiten_AB.md',
  'README.md',
  'package.json',
];

describe('Inhaltsdateien: eine Stelle für die Dateimuster', () => {
  it('jede Datei im Inhaltsordner wird wie bisher eingeordnet', () => {
    const namen = readdirSync(CONTENT_DIR);
    expect(namen.length).toBeGreaterThan(50);
    for (const name of namen) expect(isContentFile(name), name).toBe(alteRegel(name));
  });

  it('Grenzfälle werden wie bisher eingeordnet', () => {
    for (const name of GRENZFAELLE) expect(isContentFile(name), name).toBe(alteRegel(name));
  });

  it('die JSON-Muster sind vollständig und überschneiden sich nicht', () => {
    expect(Object.keys(JSON_DATEIEN).sort()).toEqual(['diagramme', 'json', 'lernkarten', 'quellen', 'rechnen', 'sql']);
    for (const name of [...readdirSync(CONTENT_DIR), ...GRENZFAELLE]) {
      const treffer = Object.entries(JSON_DATEIEN).filter(([, re]) => re.test(name));
      expect(treffer.length, `${name} passt zu ${treffer.map(([a]) => a).join(' und ')}`).toBeLessThanOrEqual(1);
      expect(istJsonInhalt(name), name).toBe(treffer.length === 1);
    }
  });

  it('der Inhaltsordner liegt, wo der Test ihn erwartet', () => {
    expect(CONTENT_DIR).toBe(join(import.meta.dirname, '..', 'content'));
  });
});
