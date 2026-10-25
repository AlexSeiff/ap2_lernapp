import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import console from 'node:console';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

// Reproducible inventory and targeted searches; this does not certify factual accuracy.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rules = [
  ['F01', /11(?:,|\{,\})25.*11(?:\*\*)? Werktage/],
  ['F02', /4 Wochen Beschäftigung, auch für Azubis/],
  ['V01', /(?:QUARTILE\.INKL.*(?:3,25|5,75)|Excel.*interpoliert.*5,75)/],
  ['F04', /(?:keine Steuern und Sozialabgaben|keine Steuern.*Rentenversicherung)/],
  ['F05', /Ein negativer Zaun heißt nur/],
  ['F06', /(?:Auf den Trainingsdaten liegt R² zwischen|Bestimmtheitsmaß R².*0–1)/],
  ['F07', /Accuracy fast nie/],
  ['F08', /(?:95\+ Punkte am realistischsten|praktisch garantiert|fast ausschließlich durch.*Flüchtigkeit)/],
  ['F09', /§ 35 Abs\. 3 BDSG/],
  ['R01', /(?:Gesetzentwurf.*Juni 2026|Digital Omnibus|§ 26 Abs\. 1 Satz 1 BDSG)/],
  ['F10', /Benötigt zwingend skalierte Merkmale/],
  ['F11', /Fehlt sie, bleibt nur unüberwachtes Lernen/],
  ['F12', /Die Methode verändert auf dem Server gar nichts/],
  ['F13', /403.*authentifiziert, aber kein Recht/],
  ['F14', /Fremdschlüssel.*auf den Primärschlüssel/],
  ['F15', /keine Validierung beim Empfänger/],
];
const inventory = [];
const occurrences = [];
const jsonShapes = {};
for (const name of readdirSync(resolve(root, 'content')).sort()) {
  const raw = readFileSync(resolve(root, 'content', name), 'utf8');
  const lines = raw.split(/\r?\n/);
  const entry = {
    file: `content/${name}`,
    bytes: Buffer.byteLength(raw),
    lines: lines.length,
    sha256: createHash('sha256').update(raw).digest('hex'),
    semanticReview: 'not-exhaustively-verified',
  };
  if (name.endsWith('.json')) {
    const data = JSON.parse(raw);
    entry.arrays = Object.fromEntries(
      Object.entries(data)
        .filter(([, v]) => Array.isArray(v))
        .map(([k, v]) => [k, v.length]),
    );
    jsonShapes[name] = Object.fromEntries(
      Object.entries(data)
        .filter(([, v]) => Array.isArray(v))
        .map(([k, v]) => [k, { count: v.length, firstItemKeys: Object.keys(v[0] ?? {}) }]),
    );
    if (data.decks) {
      const cards = data.decks.flatMap((d) => d.karten ?? []);
      entry.cards = cards.length;
      entry.cardsWithMc = cards.filter((c) => c.mc).length;
      entry.duplicateCardIds = cards.map((c) => c.id).filter((id, i, ids) => ids.indexOf(id) !== i);
      entry.metadataCardCount = data.meta?.anzahl_karten;
      entry.metadataCountMatches = data.meta?.anzahl_karten === undefined ? null : data.meta.anzahl_karten === cards.length;
      entry.cardTypes = Object.fromEntries([...new Set(cards.map((c) => c.typ))].map((t) => [t, cards.filter((c) => c.typ === t).length]));
    }
  } else {
    entry.sections = lines.filter((l) => /^#{1,6} /.test(l)).length;
  }
  inventory.push(entry);
  lines.forEach((line, index) => {
    for (const [finding, pattern] of rules)
      if (pattern.test(line)) {
        occurrences.push({ finding, file: entry.file, line: index + 1, text: line.trim() });
      }
  });
}
const sourceData = JSON.parse(readFileSync(resolve(root, 'content/AP2_Quellen.json'), 'utf8'));
const sourceProviders = {};
for (const q of sourceData.quellen) sourceProviders[q.anbieter] = (sourceProviders[q.anbieter] ?? 0) + 1;
const values = [2, 3, 3, 4, 5, 5, 5, 6, 8, 19];
function percentileInc(p) {
  const position = (values.length - 1) * p;
  const lower = Math.floor(position);
  return values[lower] + (position - lower) * (values[Math.ceil(position)] - values[lower]);
}
const summary = {
  snapshotDate: '2026-10-25',
  scope: 'All checked-in content files inventoried; targeted factual review, not exhaustive verification.',
  files: inventory.length,
  totalBytes: inventory.reduce((sum, f) => sum + f.bytes, 0),
  jsonShapes,
  sourceProviders,
  sourceTargets: new Set(sourceData.quellen.map((q) => q.ziel)).size,
  independentCalculations: {
    inclusiveQuartiles: { values, q1: percentileInc(0.25), q3: percentileInc(0.75), iqr: percentileInc(0.75) - percentileInc(0.25) },
    holidayEntitlementBeforeAnyLawfulRounding: (27 * 5) / 12,
    negativeFenceCounterexample: { q1: -10, q3: 0, fence: -25, value: -30, lowerOutlier: -30 < -25 },
    confusionMatrixExample: { accuracy: (60 + 810) / 1000, precision: 60 / 150, recall: 60 / 100, f1: 120 / 250, specificity: 810 / 900 },
    payrollExample: { socialContributions: 1200 * 0.2115, netBeforeTax: 1200 * (1 - 0.2115) },
  },
};
writeFileSync(resolve(root, 'audit/content-inventory.json'), JSON.stringify({ summary, inventory, occurrences }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
console.log('Targeted finding occurrences:', occurrences.length);
