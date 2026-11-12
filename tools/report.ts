// Importbericht: `npm run import-report`
import { CONTENT_DIR, loadContent } from '../build/inhalt.ts';

const c = loadContent();
console.log(`Quelle: ${CONTENT_DIR}\n`);
for (const t of c.topics) {
  const tasks = Object.values(c.tasks).filter((x) => x.topicId === t.id);
  const withSol = tasks.filter((x) => x.solution).length;
  const cards = c.flashcards.filter((f) => f.topicId === t.id);
  console.log(
    `${t.id} ${t.title.padEnd(48)} Abschnitte ${String(t.sections.length).padStart(2)} | Aufgaben ${String(tasks.length).padStart(2)} (${withSol} mit Lösung) | ` +
      `${t.exam?.totalPoints ?? 0} P | Karten ${cards.length} | Lernziele ${t.lernziele.length} | Anlagen ${t.exam?.attachments.length ?? 0}`,
  );
}
console.log(`\nLernkarten: ${c.flashcards.filter((f) => f.kind === 'lernkarte').length} in ${c.decks.length} Decks`);
for (const d of c.decks) {
  console.log(
    `  ${d.id.padEnd(5)} ${d.title.padEnd(48)} ${String(d.cardCount).padStart(3)} Karten → ${d.topicId ? `Deep Dive ${d.topicId}` : 'kein Deep Dive'}`,
  );
}
console.log(`\nSQL-Übungen: ${c.sqlExercises.length} in ${c.sqlDatasets.length} Datensätzen`);
for (const d of c.sqlDatasets) {
  const n = c.sqlExercises.filter((u) => u.datensatz === d.id).length;
  console.log(
    `  ${d.id.padEnd(14)} ${d.titel.padEnd(40)} ${String(n).padStart(3)} Übungen${d.variante ? ' · mit Variante' : ''} → ${d.topicId ? `Deep Dive ${d.topicId}` : 'kein Deep Dive'}`,
  );
}
const byTopic = new Map<string, number>();
for (const u of c.sqlExercises) byTopic.set(u.topicId ?? '–', (byTopic.get(u.topicId ?? '–') ?? 0) + 1);
if (byTopic.size) console.log(`  je Deep Dive: ${[...byTopic].map(([t, n]) => `${t}: ${n}`).join(', ')}`);
const rechnen = c.rechenUebungen;
const mitVorlage = rechnen.filter((u) => u.vorlage);
console.log(
  `\nRechenübungen: ${rechnen.length} (${mitVorlage.length} mit Vorlage, davon ${mitVorlage.filter((u) => u.daten).length} mit festen Zahlen · ` +
    `${rechnen.filter((u) => u.neueZahlen).length} mit „Neue Zahlen“)`,
);
const byVorlage = new Map<string, number>();
for (const u of rechnen) byVorlage.set(u.vorlage ?? '(ohne)', (byVorlage.get(u.vorlage ?? '(ohne)') ?? 0) + 1);
if (byVorlage.size) console.log(`  je Vorlage: ${[...byVorlage].map(([v, n]) => `${v}: ${n}`).join(', ')}`);
const rechenByTopic = new Map<string, number>();
for (const u of rechnen) rechenByTopic.set(u.topicId ?? '–', (rechenByTopic.get(u.topicId ?? '–') ?? 0) + 1);
if (rechenByTopic.size) console.log(`  je Deep Dive: ${[...rechenByTopic].map(([t, n]) => `${t}: ${n}`).join(', ')}`);
console.log(`\nMaterialien: ${c.materials.map((m) => m.title).join(', ')}`);
console.log(`\nHinweise (${c.issues.length}):`);
for (const i of c.issues) console.log(`  - ${i.file}: ${i.message}`);
