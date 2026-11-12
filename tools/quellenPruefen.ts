// npm run quellen-pruefen (Umsetzungsplan Phase 8): ruft jeden Link aus content/AP2_Quellen.json erneut ab und meldet alles, was nicht
// mit 2xx antwortet. Vor der Prüfung laufen lassen; tote Links in content/AP2_Quellen.json ersetzen oder entfernen.
// Eine Anfrage nach der anderen mit kurzer Pause – die Anbieter sollen nicht belastet werden.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseQuellen } from '../shared/quellen.ts';
import { CONTENT_DIR } from '../build/inhalt.ts';

const DATEI = join(CONTENT_DIR, 'AP2_Quellen.json');
const PAUSE_MS = 400;
const UA = 'Mozilla/5.0 (AP2-Lern-App Quellenpruefung; privat)';

async function pruefe(url: string): Promise<number> {
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': UA, 'Accept-Language': 'de' },
      signal: AbortSignal.timeout(20_000),
    });
    return r.status;
  } catch {
    return 0;
  }
}

const { quellen, issues } = parseQuellen('AP2_Quellen.json', readFileSync(DATEI, 'utf8'));
for (const i of issues) console.log(`Datei: ${i.message}`);
const urls = [...new Set(quellen.map((q) => q.url))];
console.log(`${urls.length} Links in ${quellen.length} Quellen werden geprüft …`);
const kaputt: string[] = [];
for (const [i, url] of urls.entries()) {
  const status = await pruefe(url);
  if (status < 200 || status >= 300) {
    kaputt.push(`${status || 'keine Antwort'}  ${url}`);
    console.log(`  ✗ ${status || '—'} ${url}`);
  }
  if ((i + 1) % 25 === 0) console.log(`  … ${i + 1}/${urls.length}`);
  await new Promise((r) => setTimeout(r, PAUSE_MS));
}
console.log(kaputt.length ? `\n${kaputt.length} Links prüfen:\n${kaputt.join('\n')}` : '\nAlle Links antworten.');
process.exitCode = kaputt.length ? 1 : 0;
