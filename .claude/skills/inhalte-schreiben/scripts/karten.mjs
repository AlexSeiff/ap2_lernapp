#!/usr/bin/env node
// Hilfen für die Lernkarten-Dateien (AP2_FIDPA_Lernkarten.json, AP2_Fachbegriffe_Lernkarten.json).
// Die Dateien sind genau JSON.stringify(daten, null, 2) + Zeilenumbruch – so schreibt dieses Skript sie auch zurück.
//
//   node karten.mjs naechste <datei> <deck-id> [anzahl]   freie Karten-IDs im Deck (höchste Nummer + 1 …)
//   node karten.mjs zaehlen <datei> [--schreiben]          anzahl_karten je Deck und die meta-Zähler prüfen (und korrigieren)
//   node karten.mjs pruefen <datei>                        doppelte IDs, fehlende Felder, unbekannter typ, kaputte mc-Blöcke, $ im Text
//
// <datei> z. B. content/AP2_FIDPA_Lernkarten.json

import { readFileSync, writeFileSync } from 'node:fs';

const TYPEN = ['wissen', 'abgrenzung', 'rechnung', 'anwendung', 'falle', 'begriff'];
const [befehl, datei, ...rest] = process.argv.slice(2);
if (!befehl || !datei) {
  console.error('Aufruf: node karten.mjs naechste|zaehlen|pruefen <datei> …');
  process.exit(2);
}
const text = readFileSync(datei, 'utf8');
const daten = JSON.parse(text);
const decks = daten.decks ?? [];
const schreibe = () => writeFileSync(datei, JSON.stringify(daten, null, 2) + '\n');

if (befehl === 'naechste') {
  const [deckId, anzahl = '1'] = rest;
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) {
    console.error(`Deck „${deckId}“ gibt es nicht. Decks: ${decks.map((d) => d.id).join(', ')}`);
    process.exit(1);
  }
  const nummern = deck.karten.map((k) => /-(\d+)$/.exec(k.id)).filter(Boolean);
  if (!nummern.length) {
    console.log(`Deck ${deckId} hat keine nummerierten IDs (z. B. FB-<begriff>): ID aus dem Begriff bilden.`);
    process.exit(0);
  }
  const praefix = deck.karten[0].id.replace(/-\d+$/, '');
  const breite = nummern[0][1].length;
  const max = Math.max(...nummern.map((m) => Number(m[1])));
  const alle = new Set(decks.flatMap((d) => d.karten.map((k) => k.id)));
  const frei = [];
  for (let n = max + 1; frei.length < Number(anzahl); n++) {
    const id = `${praefix}-${String(n).padStart(breite, '0')}`;
    if (!alle.has(id)) frei.push(id);
  }
  console.log(frei.join('\n'));
} else if (befehl === 'zaehlen') {
  const karten = decks.flatMap((d) => d.karten.map((k) => ({ ...k, status: d.status })));
  const zaehle = (feld) => {
    const z = {};
    for (const k of karten) if (k[feld] !== undefined) z[k[feld]] = (z[k[feld]] ?? 0) + 1;
    return Object.fromEntries(Object.entries(z).sort(([a], [b]) => a.localeCompare(b)));
  };
  const abw = [];
  for (const d of decks) {
    if (typeof d.anzahl_karten === 'number' && d.anzahl_karten !== d.karten.length) {
      abw.push(`Deck ${d.id}: anzahl_karten ${d.anzahl_karten} → ${d.karten.length}`);
      d.anzahl_karten = d.karten.length;
    }
  }
  const meta = daten.meta ?? {};
  const soll = {
    anzahl_decks: decks.length,
    anzahl_karten: karten.length,
    karten_nach_typ: zaehle('typ'),
    karten_nach_status: zaehle('status'),
    karten_nach_schwierigkeit: zaehle('schwierigkeit'),
  };
  for (const [k, v] of Object.entries(soll)) {
    if (!(k in meta)) continue; // nur Zähler pflegen, die die Datei schon führt
    if (JSON.stringify(meta[k]) !== JSON.stringify(v)) {
      abw.push(`meta.${k}: ${JSON.stringify(meta[k])} → ${JSON.stringify(v)}`);
      meta[k] = v;
    }
  }
  if (!abw.length) console.log('Alle Zähler stimmen.');
  else {
    console.log(abw.join('\n'));
    if (rest.includes('--schreiben')) {
      if ('aktualisiert_am' in meta) meta.aktualisiert_am = new Date().toISOString().slice(0, 10);
      schreibe();
      console.log(`\n${datei} aktualisiert.`);
    } else console.log('\nMit --schreiben korrigieren.');
  }
} else if (befehl === 'pruefen') {
  const fehler = [];
  const gesehen = new Map();
  for (const d of decks) {
    for (const k of d.karten) {
      const wo = `${d.id}/${k.id ?? '(ohne id)'}`;
      if (gesehen.has(k.id)) fehler.push(`${wo}: id doppelt (auch in ${gesehen.get(k.id)})`);
      gesehen.set(k.id, d.id);
      for (const f of ['id', 'frage', 'antwort', 'typ']) if (typeof k[f] !== 'string' || !k[f].trim()) fehler.push(`${wo}: ${f} fehlt`);
      if (k.typ && !TYPEN.includes(k.typ)) fehler.push(`${wo}: unbekannter typ „${k.typ}“`);
      if (k.schwierigkeit !== undefined && ![1, 2, 3].includes(k.schwierigkeit)) fehler.push(`${wo}: schwierigkeit ${k.schwierigkeit}`);
      if (`${k.frage}${k.antwort}`.includes('$')) fehler.push(`${wo}: „$“ im Text – Karten haben keinen Formelsatz`);
      if (k.mc) {
        const norm = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').replace(/[.\s]+$/, '').trim();
        const f = Array.isArray(k.mc.falsch) ? k.mc.falsch.map(norm) : [];
        if (f.length !== 3) fehler.push(`${wo}: mc braucht genau 3 falsche Antworten`);
        if (new Set(f).size !== f.length) fehler.push(`${wo}: mc-Antworten doppelt`);
        if (f.includes(norm(k.mc.richtig ?? ''))) fehler.push(`${wo}: falsche mc-Antwort gleich der richtigen`);
      }
    }
  }
  console.log(fehler.length ? fehler.join('\n') : `OK: ${gesehen.size} Karten in ${decks.length} Decks.`);
  process.exitCode = fehler.length ? 1 : 0;
} else {
  console.error(`Unbekannter Befehl: ${befehl}`);
  process.exit(2);
}
