// Altklausur-Tags für die Fachbegriffe-Karten: `npm run altklausur-tags -- kandidaten` listet die Begriffe, die in Aufgaben oder
// Musterlösungen des Altklausur-Trainings (Deep Dive 18–33) vorkommen. `... -- anwenden <Datei>` setzt das Tag `altklausur` an
// die Karten, deren Ids in der Datei stehen (eine Id je Zeile; `#` beginnt einen Kommentar). Ids und Reihenfolge bleiben unverändert.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENT_DIR, loadContent } from '../build/inhalt.ts';
import { ALTKLAUSUR_TAG, altklausurThemen } from '../src/lib/altklausur.ts';

const FACHBEGRIFFE = join(CONTENT_DIR, 'AP2_Fachbegriffe_Lernkarten.json');

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Suchmuster für einen Begriff: ganze Wörter, Groß-/Kleinschreibung egal, Beugungsendung (Plural, Genitiv) erlaubt. */
function muster(begriff: string): RegExp[] {
  const ohneKlammer = begriff.replace(/\([^)]*\)/g, ' ');
  const teile = ohneKlammer
    .split(/\s*(?:\/|,|;| oder )\s*/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);
  return teile.map((t) => new RegExp(`(?<![\\p{L}\\p{N}])${escape(t)}(?:e|en|er|n|s)?(?![\\p{L}\\p{N}])`, 'iu'));
}

const modus = process.argv[2];
const content = loadContent();
const themen = altklausurThemen(content.topics);

if (modus === 'kandidaten') {
  const aufgaben = new Map<string, string>();
  const loesungen = new Map<string, string>();
  for (const t of Object.values(content.tasks)) {
    if (!themen.has(t.topicId)) continue;
    aufgaben.set(t.id, t.markdown);
    loesungen.set(t.id, t.solution?.markdown ?? '');
  }
  const anlagen = content.topics
    .filter((t) => themen.has(t.id))
    .flatMap((t) => [
      t.exam?.intro ?? '',
      ...(t.exam?.attachments.map((a) => a.markdown) ?? []),
      ...(t.exam?.blocks.map((b) => b.intro) ?? []),
    ])
    .join('\n');
  const karten = content.flashcards.filter((c) => c.tags?.includes('fachbegriff') && !istSchonAltklausur(c.topicId));
  function istSchonAltklausur(topicId: string | undefined) {
    return topicId !== undefined && themen.has(topicId);
  }
  console.log(`# Kandidaten für das Tag „${ALTKLAUSUR_TAG}“ (Fachbegriffe-Karten)\n`);
  console.log(
    'Spalten: Id · Begriff · Treffer in Aufgabentexten · in Musterlösungen · in Anlagen. Zeilen mit `#` werden beim Anwenden ignoriert.\n',
  );
  let n = 0;
  for (const c of karten) {
    const ms = muster(c.question);
    if (!ms.length) continue;
    const zaehle = (texte: Iterable<string>) => {
      let k = 0;
      for (const t of texte) if (ms.some((m) => m.test(t))) k++;
      return k;
    };
    const a = zaehle(aufgaben.values());
    const l = zaehle(loesungen.values());
    const an = ms.some((m) => m.test(anlagen)) ? 1 : 0;
    if (a + l + an === 0) continue;
    n++;
    console.log(`${c.id}\t# ${c.question}\t${a}\t${l}\t${an}`);
  }
  console.error(`${n} Kandidaten von ${karten.length} Fachbegriffen.`);
} else if (modus === 'anwenden') {
  const datei = process.argv[3];
  if (!datei) throw new Error('Aufruf: altklausur-tags anwenden <Datei mit Ids>');
  const ids = new Set(
    readFileSync(datei, 'utf8')
      .split(/\r?\n/)
      .map((z) => z.replace(/#.*$/, '').trim().split(/\s+/)[0])
      .filter(Boolean),
  );
  const daten = JSON.parse(readFileSync(FACHBEGRIFFE, 'utf8')) as { decks: { karten: { id: string; tags?: string[] }[] }[] };
  let gesetzt = 0;
  const gefunden = new Set<string>();
  for (const d of daten.decks)
    for (const k of d.karten) {
      if (!ids.has(k.id)) continue;
      gefunden.add(k.id);
      k.tags = k.tags ?? [];
      if (!k.tags.includes(ALTKLAUSUR_TAG)) {
        k.tags.push(ALTKLAUSUR_TAG);
        gesetzt++;
      }
    }
  const fehlen = [...ids].filter((i) => !gefunden.has(i));
  if (fehlen.length) throw new Error(`Unbekannte Ids: ${fehlen.join(', ')}`);
  writeFileSync(FACHBEGRIFFE, JSON.stringify(daten, null, 2) + '\n');
  console.log(`${gesetzt} Karten erhalten das Tag „${ALTKLAUSUR_TAG}“ (${ids.size} Ids in der Datei).`);
} else {
  console.error('Aufruf: altklausur-tags kandidaten | altklausur-tags anwenden <Datei>');
  process.exit(1);
}
