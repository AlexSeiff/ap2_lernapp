// KI-Funktionen (Aufgaben generieren, offene Antworten bewerten) über die Claude API.
// Ohne ANTHROPIC_API_KEY bleibt die App voll nutzbar – nur diese beiden Funktionen sind dann aus.

import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import type { GradeResult } from '../shared/api.ts';
import { TASK_TYPES, type Content, type Task, type TaskType } from '../shared/types.ts';
import { HttpError } from './router.ts';

export const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

export function aiEnabled(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

let client: Anthropic | null = null;
export function getClient(): Anthropic {
  if (!aiEnabled()) throw new HttpError(400, 'Kein ANTHROPIC_API_KEY gesetzt – KI-Funktionen sind deaktiviert.');
  client ??= new Anthropic();
  return client;
}

export function explainApiError(err: unknown): never {
  if (err instanceof HttpError) throw err;
  if (err instanceof Anthropic.AuthenticationError) throw new HttpError(401, 'API-Schlüssel ungültig. Bitte ANTHROPIC_API_KEY prüfen.');
  if (err instanceof Anthropic.RateLimitError) throw new HttpError(429, 'Rate-Limit erreicht – bitte kurz warten und erneut versuchen.');
  if (err instanceof Anthropic.APIConnectionError) throw new HttpError(502, 'Keine Verbindung zur Claude API (Internet prüfen).');
  if (err instanceof Anthropic.APIError) throw new HttpError(502, `Claude API Fehler ${err.status ?? ''}: ${err.message}`);
  throw err;
}

const TYPE_LABELS: Record<TaskType, string> = {
  offen: 'offene Aufgabe (erläutern, begründen, beurteilen, SQL schreiben, Fehler finden, Fachgespräch-Frage)',
  mc: 'Multiple Choice (eine oder mehrere richtige Antworten)',
  lueckentext: 'Lückentext',
  zuordnung: 'Zuordnungsaufgabe (Begriff ↔ Erklärung)',
  rechnen: 'Rechenaufgabe mit eindeutigem Zahlenergebnis (Statistik, Kennzahlen, Wirtschaftlichkeit)',
};

const GeneratedSchema = z.object({
  aufgaben: z.array(
    z.object({
      typ: z.enum(TASK_TYPES),
      punkte: z.number(),
      aufgabentext: z.string(),
      optionen: z.array(z.string()).nullable(),
      richtige_optionen: z.array(z.number()).nullable(),
      luecken_loesungen: z.array(z.string()).nullable(),
      paare: z.array(z.object({ links: z.string(), rechts: z.string() })).nullable(),
      zahl_ergebnis: z.object({ wert: z.number(), toleranz: z.number(), einheit: z.string().nullable() }).nullable(),
      musterloesung: z.string(),
      prueferkommentar: z.string(),
    }),
  ),
});

const SYSTEM_GENERATE = `Du bist erfahrene/r IHK-Prüfer/in für die Abschlussprüfung Teil 2 „Fachinformatiker/-in Daten- und Prozessanalyse".
Du erstellst neue Übungsaufgaben im Stil der IHK-Prüfung – ausschließlich auf Grundlage des mitgelieferten Lernblatts.
Regeln:
- Alles auf Deutsch. Verwende IHK-Operatoren kursiv (*Erläutern* Sie …, *Nennen* Sie …, *Berechnen* Sie …).
- Nutze das Szenario des Lernblatts (z. B. „Möbelhaus Nordholz GmbH"), erfinde aber neue Daten und Fragestellungen; kopiere keine vorhandenen Aufgaben.
- Nur Fachinhalte, die im Lernblatt vorkommen. Keine Fakten erfinden.
- Aufgabentext und Musterlösung in Markdown (Tabellen und \`\`\`sql-Codeblöcke erlaubt). Die Aufgabe muss ohne Lösung lösbar formuliert sein und darf die Lösung nicht verraten.
- Punkte: 2–12 je Aufgabe, ca. 1 Punkt pro Bearbeitungsminute.
- prueferkommentar: konkrete Punktevergabe („je 1 P für …").
- Typspezifische Felder (alle nicht passenden Felder = null):
  - mc: optionen (3–6 Einträge), richtige_optionen = 0-basierte Indizes.
  - lueckentext: Im aufgabentext steht jede Lücke als ___ (genau drei Unterstriche); luecken_loesungen in derselben Reihenfolge, jeweils ein kurzes Wort/Begriff.
  - zuordnung: paare (3–6), links = Begriff, rechts = passende Erklärung.
  - rechnen: zahl_ergebnis mit Wert, sinnvoller Toleranz (Rundung) und Einheit; Rechenweg in die Musterlösung.
  - offen: nur Musterlösung und Kommentar.`;

export async function generateTasks(content: Content, topicId: string, count: number, types: TaskType[]): Promise<Task[]> {
  const topic = content.topics.find((t) => t.id === topicId);
  if (!topic) throw new HttpError(404, `Thema ${topicId} nicht gefunden.`);
  const sheet = topic.sections.map((s) => `${'#'.repeat(Math.max(2, s.level))} ${s.title}\n\n${s.markdown}`).join('\n\n');
  const existing = Object.values(content.tasks)
    .filter((t) => t.topicId === topicId)
    .map((t) => `- ${t.code}: ${t.markdown.split('\n')[0].slice(0, 160)}`)
    .join('\n');
  const n = Math.min(Math.max(Math.round(count), 1), 10);
  const typeList = types.length ? types : (['offen', 'mc', 'rechnen'] as TaskType[]);

  try {
    const response = await getClient().messages.parse({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM_GENERATE,
      messages: [
        {
          role: 'user',
          content:
            `<lernblatt thema="${topic.title}">\n${sheet}\n</lernblatt>\n\n` +
            `<vorhandene_aufgaben>\n${existing}\n</vorhandene_aufgaben>\n\n` +
            `Erstelle ${n} neue Aufgaben. Verteile sie auf diese Typen: ${typeList.map((t) => TYPE_LABELS[t]).join('; ')}.`,
        },
      ],
      output_config: { format: zodOutputFormat(GeneratedSchema) },
    });
    if (response.stop_reason === 'refusal') throw new HttpError(422, 'Die Anfrage wurde vom Modell abgelehnt.');
    if (response.stop_reason === 'max_tokens') throw new HttpError(502, 'Antwort abgeschnitten – bitte weniger Aufgaben anfordern.');
    const parsed = response.parsed_output;
    if (!parsed) throw new HttpError(502, 'Antwort der KI konnte nicht gelesen werden.');

    const stamp = Date.now().toString(36);
    return parsed.aufgaben.map((a, i): Task => {
      const auto =
        a.typ === 'mc'
          ? { options: a.optionen ?? [], correct: a.richtige_optionen ?? [] }
          : a.typ === 'lueckentext'
            ? { blanks: a.luecken_loesungen ?? [] }
            : a.typ === 'zuordnung'
              ? { pairs: (a.paare ?? []).map((p) => ({ left: p.links, right: p.rechts })) }
              : a.typ === 'rechnen' && a.zahl_ergebnis
                ? {
                    numeric: {
                      value: a.zahl_ergebnis.wert,
                      tolerance: Math.abs(a.zahl_ergebnis.toleranz),
                      unit: a.zahl_ergebnis.einheit ?? undefined,
                    },
                  }
                : undefined;
      return {
        id: `gen-${topicId}-${stamp}-${i + 1}`,
        code: `K${i + 1}`,
        topicId,
        block: 'KI',
        points: Math.max(1, Math.round(a.punkte * 2) / 2),
        markdown: a.aufgabentext,
        type: a.typ,
        generated: true,
        auto,
        solution: { markdown: a.musterloesung, kommentar: a.prueferkommentar },
      };
    });
  } catch (err) {
    explainApiError(err);
  }
}

const GradeSchema = z.object({
  punkte: z.number(),
  feedback: z.string(),
  fehlende_aspekte: z.array(z.string()),
});

export async function gradeAnswer(task: Task, answer: string): Promise<GradeResult> {
  if (!task.solution) throw new HttpError(400, 'Für diese Aufgabe gibt es keine Musterlösung.');
  if (!answer.trim()) return { points: 0, feedback: 'Keine Antwort abgegeben.', missing: [] };
  try {
    const response = await getClient().messages.parse({
      model: MODEL,
      max_tokens: 4000,
      system:
        'Du bist IHK-Prüfer/in (AP2 Fachinformatiker/-in Daten- und Prozessanalyse) und bewertest eine Prüfungsantwort. ' +
        'Bewerte fair nach Musterlösung und Prüferkommentar: richtige Struktur und fachlich gleichwertige Formulierungen zählen, ' +
        'kleine Syntaxfehler kosten nichts. Vergib Punkte in 0,5er-Schritten zwischen 0 und der Maximalpunktzahl. ' +
        'Feedback kurz (max. 4 Sätze), auf Deutsch, direkt an den Prüfling („Du …").',
      messages: [
        {
          role: 'user',
          content:
            `<aufgabe punkte="${task.points}">\n${task.markdown}\n</aufgabe>\n\n` +
            `<musterloesung>\n${task.solution.markdown}\n</musterloesung>\n\n` +
            (task.solution.kommentar ? `<prueferkommentar>\n${task.solution.kommentar}\n</prueferkommentar>\n\n` : '') +
            `<antwort_des_prueflings>\n${answer}\n</antwort_des_prueflings>`,
        },
      ],
      output_config: { format: zodOutputFormat(GradeSchema) },
    });
    if (response.stop_reason === 'refusal') throw new HttpError(422, 'Die Bewertung wurde vom Modell abgelehnt.');
    const parsed = response.parsed_output;
    if (!parsed) throw new HttpError(502, 'Bewertung der KI konnte nicht gelesen werden.');
    const points = Math.min(task.points, Math.max(0, Math.round(parsed.punkte * 2) / 2));
    return { points, feedback: parsed.feedback, missing: parsed.fehlende_aspekte };
  } catch (err) {
    explainApiError(err);
  }
}
