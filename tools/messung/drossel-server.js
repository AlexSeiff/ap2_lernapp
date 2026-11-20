// Teil der Messung des Starts (siehe start-messung.js). Statischer Server für dist/ mit gemeinsamer Bandbreitengrenze (wie ein langsames Handynetz), gzip wie GitHub Pages und fester Latenz je Anfrage.
// Aufruf: node drossel-server.js <dist-Ordner> <Port> [KB/s] [Latenz-ms]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';

const [wurzel, port, kbs = '200', latenz = '150'] = process.argv.slice(2);
const BYTES_PRO_SEKUNDE = Number(kbs) * 1024;
const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
};
const KOMPRIMIERBAR = new Set(['.html', '.js', '.css', '.json', '.wasm', '.webmanifest', '.svg']);

// Eine gemeinsame Warteschlange: Es wird immer nur so schnell gesendet, wie die gesamte Leitung hergibt.
let frei = Date.now();
const gesendet = { bytes: 0, anfragen: 0 };
async function drosselnd(res, daten) {
  const BLOCK = 8 * 1024;
  for (let i = 0; i < daten.length; i += BLOCK) {
    const teil = daten.subarray(i, i + BLOCK);
    const jetzt = Date.now();
    const start = Math.max(frei, jetzt);
    frei = start + (teil.length / BYTES_PRO_SEKUNDE) * 1000;
    const warten = start - jetzt;
    if (warten > 0) await new Promise((r) => setTimeout(r, warten));
    if (res.destroyed) return;
    res.write(teil);
    gesendet.bytes += teil.length;
  }
  res.end();
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/__stand') {
    res.end(JSON.stringify(gesendet));
    return;
  }
  let pfad = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
  if (pfad === '' || pfad.endsWith('/') || pfad.endsWith('\\')) pfad += 'index.html';
  const datei = join(wurzel, pfad);
  try {
    if (!(await stat(datei)).isFile()) throw new Error('keine Datei');
    gesendet.anfragen++;
    let daten = await readFile(datei);
    const art = extname(datei);
    const header = { 'content-type': TYPEN[art] ?? 'application/octet-stream', 'cache-control': 'max-age=0, must-revalidate' };
    if (KOMPRIMIERBAR.has(art) && /gzip/.test(req.headers['accept-encoding'] ?? '')) {
      daten = gzipSync(daten, { level: 6 });
      header['content-encoding'] = 'gzip';
    }
    header['content-length'] = daten.length;
    await new Promise((r) => setTimeout(r, Number(latenz)));
    res.writeHead(200, header);
    await drosselnd(res, daten);
  } catch {
    res.writeHead(404);
    res.end('nicht gefunden');
  }
}).listen(Number(port), () => console.log(`drossel-server :${port} ${kbs} KB/s, ${latenz} ms`));
