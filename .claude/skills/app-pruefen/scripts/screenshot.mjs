#!/usr/bin/env node
// Screenshots der App mit dem installierten Edge (oder Chrome) im Headless-Modus – ohne zusätzliche Pakete.
// Spricht das Chrome DevTools Protocol direkt über den WebSocket von Node (ab Node 22 eingebaut).
//
// Aufruf (Aktionen laufen in der angegebenen Reihenfolge):
//   node screenshot.mjs --url "http://localhost:5178/#/karteikarten?blaettern=1" \
//     [--breite 1280] [--hoehe 900] [--handy] [--dunkel] [--ganz] [--wenig-bewegung] [--warten 800] \
//     [--klick "Text oder CSS-Selektor"] [--taste " "] [--pause 500] [--js "ausdruck"] \
//     --bild out.png [--klick …] [--bild out2.png]
//
// --handy     = 390 × 844, Touch, mobile Ansicht
// --dunkel    = prefers-color-scheme: dark (die App folgt dem System, solange in den Einstellungen „System“ gilt)
// --ganz      = ganze Seite statt nur des sichtbaren Bereichs
// --wenig-bewegung = prefers-reduced-motion: reduce (Animationen müssen dann aus sein)
// --klick     = erst als CSS-Selektor versucht, sonst das erste sichtbare Bedienelement, dessen Text den Wert enthält
// --taste     = " ", Enter, Escape, ArrowLeft, ArrowRight, Tab, 1–9 oder ein einzelnes Zeichen
// --js        = Ausdruck im Seitenkontext; das Ergebnis wird ausgegeben (z. B. document.title)
// Ausgabe: Pfade der Bilder, Ergebnisse von --js und alle Konsolenfehler/Ausnahmen der Seite (Exit-Code 1 bei Ausnahmen).

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const BROWSER = [
  process.env.BROWSER_PFAD,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

function leseArgumente(argv) {
  const opt = { breite: 1280, hoehe: 900, handy: false, dunkel: false, ganz: false, warten: 800, aktionen: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const wert = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${a} braucht einen Wert`);
      return v;
    };
    if (a === '--url') opt.url = wert();
    else if (a === '--breite') opt.breite = Number(wert());
    else if (a === '--hoehe') opt.hoehe = Number(wert());
    else if (a === '--handy') opt.handy = true;
    else if (a === '--dunkel') opt.dunkel = true;
    else if (a === '--ganz') opt.ganz = true;
    else if (a === '--wenig-bewegung') opt.wenigBewegung = true;
    else if (a === '--warten') opt.warten = Number(wert());
    else if (a === '--edge' || a === '--browser') opt.browser = wert();
    else if (a === '--klick') opt.aktionen.push({ art: 'klick', wert: wert() });
    else if (a === '--taste') opt.aktionen.push({ art: 'taste', wert: wert() });
    else if (a === '--pause') opt.aktionen.push({ art: 'pause', wert: Number(wert()) });
    else if (a === '--js') opt.aktionen.push({ art: 'js', wert: wert() });
    else if (a === '--bild') opt.aktionen.push({ art: 'bild', wert: wert() });
    else throw new Error(`Unbekannte Option: ${a}`);
  }
  if (!opt.url) throw new Error('--url fehlt');
  if (opt.handy) Object.assign(opt, { breite: 390, hoehe: 844 });
  if (!opt.aktionen.some((x) => x.art === 'bild')) opt.aktionen.push({ art: 'bild', wert: 'screenshot.png' });
  return opt;
}

const schlafe = (ms) => new Promise((r) => setTimeout(r, ms));

async function warteAufPort(profil, ms = 15000) {
  const datei = join(profil, 'DevToolsActivePort');
  const ende = Date.now() + ms;
  while (Date.now() < ende) {
    if (existsSync(datei)) {
      const [port] = readFileSync(datei, 'utf8').split('\n');
      if (port) return Number(port);
    }
    await schlafe(100);
  }
  throw new Error('Browser hat keinen DevTools-Port geöffnet');
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.offen = new Map();
    this.hoerer = [];
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.offen.has(m.id)) {
        const { ok, fehler } = this.offen.get(m.id);
        this.offen.delete(m.id);
        m.error ? fehler(new Error(`${m.error.message} ${m.error.data ?? ''}`)) : ok(m.result);
      } else if (m.method) for (const h of this.hoerer) h(m);
    });
  }
  static async verbinde(url) {
    const ws = new WebSocket(url);
    await new Promise((ok, fehler) => {
      ws.addEventListener('open', ok, { once: true });
      ws.addEventListener('error', () => fehler(new Error('WebSocket-Verbindung fehlgeschlagen')), { once: true });
    });
    return new Cdp(ws);
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((ok, fehler) => this.offen.set(id, { ok, fehler }));
  }
  einmal(method, ms = 20000) {
    return new Promise((ok) => {
      const t = setTimeout(ok, ms);
      const h = (m) => {
        if (m.method !== method) return;
        clearTimeout(t);
        this.hoerer = this.hoerer.filter((x) => x !== h);
        ok(m.params);
      };
      this.hoerer.push(h);
    });
  }
}

const TASTEN = {
  ' ': { key: ' ', code: 'Space', vk: 32, text: ' ' },
  Enter: { key: 'Enter', code: 'Enter', vk: 13, text: '\r' },
  Escape: { key: 'Escape', code: 'Escape', vk: 27 },
  Tab: { key: 'Tab', code: 'Tab', vk: 9 },
  ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', vk: 37 },
  ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', vk: 39 },
  ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', vk: 38 },
  ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', vk: 40 },
};

function tastenInfo(t) {
  if (t === 'Space' || t === 'Leertaste') t = ' ';
  if (TASTEN[t]) return TASTEN[t];
  if (t.length === 1) {
    const gross = t.toUpperCase();
    const code = /\d/.test(t) ? `Digit${t}` : /[a-z]/i.test(t) ? `Key${gross}` : '';
    return { key: t, code, vk: gross.charCodeAt(0), text: t };
  }
  throw new Error(`Unbekannte Taste: ${t}`);
}

// Läuft im Browser: Element per Selektor oder sichtbarem Text finden und anklicken.
const KLICK = (ziel) => {
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
  };
  let el = null;
  try {
    el = [...document.querySelectorAll(ziel)].find(sichtbar) ?? null;
  } catch {
    /* kein gültiger Selektor */
  }
  if (!el) {
    const kandidaten = [...document.querySelectorAll('button, a, [role="button"], label, summary, [role="tab"], option')].filter(sichtbar);
    el = kandidaten.find((k) => k.textContent.replace(/\s+/g, ' ').trim() === ziel) ??
      kandidaten.find((k) => k.textContent.replace(/\s+/g, ' ').includes(ziel)) ?? null;
    if (!el) {
      const texte = kandidaten.map((k) => k.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 40);
      return { ok: false, texte };
    }
  }
  el.scrollIntoView({ block: 'center' });
  el.click();
  return { ok: true, was: `${el.tagName.toLowerCase()} „${el.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)}“` };
};

async function main() {
  const opt = leseArgumente(process.argv.slice(2));
  const pfad = opt.browser ?? BROWSER.find((p) => existsSync(p));
  if (!pfad) throw new Error('Kein Edge/Chrome gefunden – Pfad mit --browser oder BROWSER_PFAD angeben');

  const profil = mkdtempSync(join(tmpdir(), 'app-pruefen-'));
  const browser = spawn(
    pfad,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profil}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  const fehler = [];
  let ausnahme = false;
  try {
    const port = await warteAufPort(profil);
    const ziel = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
    const cdp = await Cdp.verbinde(ziel.webSocketDebuggerUrl);
    cdp.hoerer.push((m) => {
      if (m.method === 'Runtime.exceptionThrown') {
        ausnahme = true;
        const d = m.params.exceptionDetails;
        fehler.push(`Ausnahme: ${d.exception?.description ?? d.text}`);
      } else if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning')) {
        fehler.push(`console.${m.params.type}: ${m.params.args.map((x) => x.value ?? x.description ?? '').join(' ')}`);
      } else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
        fehler.push(`${m.params.entry.source}: ${m.params.entry.text} ${m.params.entry.url ?? ''}`);
      }
    });
    await Promise.all([cdp.send('Page.enable'), cdp.send('Runtime.enable'), cdp.send('Log.enable')]);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: opt.breite,
      height: opt.hoehe,
      deviceScaleFactor: opt.handy ? 2 : 1,
      mobile: opt.handy,
    });
    if (opt.handy) await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [
        { name: 'prefers-color-scheme', value: opt.dunkel ? 'dark' : 'light' },
        { name: 'prefers-reduced-motion', value: opt.wenigBewegung ? 'reduce' : 'no-preference' },
      ],
    });
    const geladen = cdp.einmal('Page.loadEventFired');
    await cdp.send('Page.navigate', { url: opt.url });
    await geladen;
    await schlafe(opt.warten);

    for (const a of opt.aktionen) {
      if (a.art === 'pause') await schlafe(a.wert);
      else if (a.art === 'klick') {
        const r = await cdp.send('Runtime.evaluate', { expression: `(${KLICK})(${JSON.stringify(a.wert)})`, returnByValue: true });
        const v = r.result.value;
        if (!v?.ok) throw new Error(`Nichts zum Klicken gefunden: „${a.wert}“. Sichtbar: ${JSON.stringify(v?.texte ?? [])}`);
        console.log(`klick: ${v.was}`);
        await schlafe(600);
      } else if (a.art === 'taste') {
        const t = tastenInfo(a.wert);
        const basis = { key: t.key, code: t.code, windowsVirtualKeyCode: t.vk, nativeVirtualKeyCode: t.vk };
        await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', ...basis, ...(t.text ? { text: t.text } : {}) });
        await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', ...basis });
        console.log(`taste: ${JSON.stringify(a.wert)}`);
        await schlafe(600);
      } else if (a.art === 'js') {
        const r = await cdp.send('Runtime.evaluate', { expression: a.wert, returnByValue: true, awaitPromise: true });
        console.log(`js: ${JSON.stringify(r.result.value ?? r.result.description ?? null)}`);
      } else if (a.art === 'bild') {
        const datei = resolve(a.wert);
        mkdirSync(dirname(datei), { recursive: true });
        const r = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: opt.ganz });
        writeFileSync(datei, Buffer.from(r.data, 'base64'));
        console.log(`bild: ${datei}`);
      }
    }
    cdp.ws.close();
  } finally {
    browser.kill();
    await schlafe(300);
    try {
      rmSync(profil, { recursive: true, force: true });
    } catch {
      /* Edge hält das Profil manchmal noch kurz fest */
    }
  }
  if (fehler.length) {
    console.log(`\nKonsole/Fehler der Seite (${fehler.length}):`);
    for (const f of fehler) console.log(`  ${f}`);
  } else console.log('Keine Konsolenfehler.');
  process.exitCode = ausnahme ? 1 : 0;
}

main().catch((e) => {
  console.error(`Fehler: ${e.message}`);
  process.exitCode = 2;
});
