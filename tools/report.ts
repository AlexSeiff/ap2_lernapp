// Importbericht: `npm run import-report`
import { CONTENT_DIR, loadContent } from '../build/inhalt.ts';
import { aufgabenBedeutung } from '../src/lib/aufgabenBedeutung.ts';
import { VORLAGEN } from '../src/rechnen/vorlagen/index.ts';

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
const ohneUebung = Object.keys(VORLAGEN).filter((id) => !byVorlage.has(id));
console.log(
  `  Vorlagen im Code: ${Object.keys(VORLAGEN).length}${ohneUebung.length ? `, ohne Übung: ${ohneUebung.join(', ')}` : ', jede hat mindestens eine Übung'}`,
);
const rechenByTopic = new Map<string, number>();
for (const u of rechnen) rechenByTopic.set(u.topicId ?? '–', (rechenByTopic.get(u.topicId ?? '–') ?? 0) + 1);
if (rechenByTopic.size) console.log(`  je Deep Dive: ${[...rechenByTopic].map(([t, n]) => `${t}: ${n}`).join(', ')}`);
const jsonUebungen = c.jsonUebungen ?? [];
console.log(
  `\nJSON-Übungen: ${jsonUebungen.length} (${[1, 2, 3].map((s) => `Stufe ${s}: ${jsonUebungen.filter((u) => u.stufe === s).length}`).join(', ')})`,
);
const xmlUebungen = c.xmlUebungen ?? [];
console.log(
  `XML-Übungen: ${xmlUebungen.length} (Dokument: ${xmlUebungen.filter((u) => u.art === 'dokument').length}, XPath: ${xmlUebungen.filter((u) => u.art === 'xpath').length})`,
);
const diagramme = c.diagrammUebungen ?? [];
const zaehle = <T>(liste: T[], schluessel: (x: T) => string | number) => {
  const m = new Map<string | number, number>();
  for (const x of liste) m.set(schluessel(x), (m.get(schluessel(x)) ?? 0) + 1);
  return [...m].map(([k, n]) => `${k}: ${n}`).join(', ');
};
console.log(
  `\nDiagramm-Übungen: ${diagramme.length} (je Typ: ${zaehle(diagramme, (u) => u.typ)}; je Stufe: ${zaehle(diagramme, (u) => u.stufe)})`,
);
// Was die App aus dem Aufgabentext erschließt (der Parser selbst setzt nur type „offen“): Antwort-Editor, Anhang, Operator.
const aufgaben = Object.values(c.tasks);
const bedeutung = aufgaben.map((t) => ({ t, b: aufgabenBedeutung(t) }));
console.log(`\nAufgaben nach erkannter Bedeutung (aus dem Text erschlossen, ${aufgaben.length} Aufgaben):`);
console.log(`  Antwort-Editor: ${zaehle(bedeutung, (x) => x.b.editor)}`);
console.log(
  `  Anhang: SQL ${bedeutung.filter((x) => x.b.sql).length}, Formeln ${bedeutung.filter((x) => x.b.formeln).length}, Diagrammelemente ${bedeutung.filter((x) => x.b.diagramme.length).length}`,
);
console.log(`  ohne Operator: ${bedeutung.filter((x) => x.b.operator === 'keiner').length}`);
const verdacht = bedeutung.filter((x) => x.b.verdacht);
if (verdacht.length) {
  console.log(
    `  Sieht nach Editor aus, hat aber keinen (${verdacht.length}; oft richtig, manchmal hat eine Umformulierung die Erkennung gebrochen):`,
  );
  for (const x of verdacht) console.log(`    - ${x.t.id}: ${x.b.verdacht}`);
}
console.log(`\nMaterialien: ${c.materials.map((m) => m.title).join(', ')}`);
console.log(`\nHinweise (${c.issues.length}):`);
for (const i of c.issues) console.log(`  - ${i.file}: ${i.message}`);
