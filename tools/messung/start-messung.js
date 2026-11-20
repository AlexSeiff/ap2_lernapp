// Messung für den Start der Offline-App (Umbauplan Phase 8). Aufruf siehe unten; vorher `npm run build` und den Drossel-Server starten:
//   node tools/messung/drossel-server.js dist 4180 200 150     (200 KB/s ≈ 1,6 Mbit/s, 150 ms Latenz, gzip)
//   node tools/messung/start-messung.js 4180 3 1500
// Misst den ersten Besuch (leeres Profil) gegen den gedrosselten Server: Start (LCP, Übersicht sichtbar) und die Wartezeit einer Navigation kurz danach,
// einmal mit und einmal ohne Service Worker. Aufruf: node start-messung.js <Port> [Durchläufe] [Wartezeit vor Navigation in ms]
import { chromium } from '@playwright/test';

const port = process.argv[2] ?? '4180';
const lauefe = Number(process.argv[3] ?? 3);
const vorNavigation = Number(process.argv[4] ?? 1500);
const browser = await chromium.launch({ channel: 'msedge' });
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

async function einmal(mitSw) {
  const ctx = await browser.newContext({ serviceWorkers: mitSw ? 'allow' : 'block', viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); // wie Lighthouse mobil
  await page.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  const t0 = Date.now();
  await page.goto(`http://localhost:${port}/#/`, { waitUntil: 'commit' });
  await page
    .getByRole('heading', { name: /Übersicht|Willkommen/ })
    .first()
    .waitFor({ timeout: 120000 });
  const sichtbar = Date.now() - t0;
  // Beim ersten Besuch erscheint die Willkommensseite; sie wegklicken, wie ein Nutzer es täte.
  const los = page.getByRole('button', { name: /Los geht/ });
  if (await los.isVisible({ timeout: 500 }).catch(() => false)) await los.click();
  await page.waitForLoadState('load');
  await page.waitForTimeout(vorNavigation);
  // Navigation zu Karteikarten (lädt Seitenchunk + details.json)
  const t1 = Date.now();
  await page.evaluate(() => {
    location.hash = '#/karteikarten';
  });
  await page.locator('.karten-start, h1:has-text("Karteikarten")').first().waitFor({ timeout: 120000 });
  await page.getByRole('button', { name: /Lernen starten/ }).waitFor({ timeout: 120000 });
  const navigation = Date.now() - t1;
  const lcp = await page.evaluate(() => Math.round(window.__lcp));
  // Wann ist alles offline bereit? (nur mit Service Worker)
  let bereitNach = null;
  if (mitSw) {
    for (let i = 0; i < 240; i++) {
      const n = await page.evaluate(async () => {
        try {
          const k = await caches.keys();
          let s = 0;
          for (const x of k) s += (await (await caches.open(x)).keys()).length;
          return s;
        } catch {
          return -1;
        }
      });
      if (n >= 150) {
        bereitNach = Date.now() - t0;
        break;
      }
      await page.waitForTimeout(500);
    }
  }
  const stand = await (await fetch(`http://localhost:${port}/__stand`)).json();
  await ctx.close();
  return { sichtbar, lcp, navigation, bereitNach, mb: stand.bytes / 1048576 };
}

for (const mitSw of [false, true]) {
  const erg = [];
  for (let i = 0; i < lauefe; i++) erg.push(await einmal(mitSw));
  const f = (k) => median(erg.map((e) => e[k]).filter((x) => x !== null));
  console.log(
    `${mitSw ? 'mit Service Worker (Ist)' : 'ohne Service Worker       '}  Übersicht sichtbar ${f('sichtbar')} ms | LCP ${f('lcp')} ms | Navigation Karteikarten ${f('navigation')} ms${mitSw ? ` | offline bereit nach ${f('bereitNach')} ms` : ''}   [Einzelwerte Navigation: ${erg.map((e) => e.navigation).join(', ')}]`,
  );
}
await browser.close();
