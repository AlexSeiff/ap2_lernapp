// Quellen und Lehrvideos (Umsetzungsplan Phase 8, AP2_Quellen.json): je Eintrag ein Ziel (Lernblatt-Abschnitt oder Begriffsseite)
// und ein geprüfter Link. Import mit Prüfung; Ziele, die es nicht gibt, meldet ladeInhalt() als ImportIssue. Rein, ohne React.

import { z } from 'zod';
import type { ImportIssue } from './types.ts';

export const QUELLEN_ARTEN = ['artikel', 'video'] as const;
export type QuellenArt = (typeof QUELLEN_ARTEN)[number];

export interface Quelle {
  /** `abschnitt:<Abschnitts-ID>` oder `begriff:<Begriffs-ID>`. */
  ziel: string;
  titel: string;
  url: string;
  /** Z. B. „Studyflix“, „Wikipedia“, „Gesetze im Internet“. */
  anbieter: string;
  /** `video`: Seite mit Lehrvideo (wird verlinkt); eingebettet wird nur mit `youtubeId`. */
  art: QuellenArt;
  /** Nur für Videos, die der Anbieter selbst auf YouTube veröffentlicht hat – Einbettung mit Zwei-Klick-Lösung (youtube-nocookie.com). */
  youtubeId?: string;
  /** Monat der letzten Prüfung, z. B. „2026-10“. */
  geprueft: string;
}

const quelleSchema = z.object({
  ziel: z.string().regex(/^(abschnitt|begriff):[^\s]+$/, 'Ziel muss abschnitt:<id> oder begriff:<id> sein'),
  titel: z.string().trim().min(1),
  url: z
    .string()
    .url()
    .refine((u) => u.startsWith('https://'), 'nur https-Links'),
  anbieter: z.string().trim().min(1),
  art: z.enum(QUELLEN_ARTEN).default('artikel'),
  youtubeId: z
    .string()
    .regex(/^[A-Za-z0-9_-]{11}$/, 'YouTube-ID hat 11 Zeichen')
    .optional(),
  geprueft: z.string().regex(/^\d{4}-\d{2}$/, 'geprueft als JJJJ-MM'),
});

export function parseQuellen(fileName: string, raw: string): { quellen: Quelle[]; issues: ImportIssue[] } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { quellen: [], issues: [{ file: fileName, message: `Kein gültiges JSON: ${e instanceof Error ? e.message : String(e)}` }] };
  }
  const liste = (data as { quellen?: unknown })?.quellen;
  if (!Array.isArray(liste)) return { quellen: [], issues: [{ file: fileName, message: 'Feld „quellen“ fehlt.' }] };
  const quellen: Quelle[] = [];
  const issues: ImportIssue[] = [];
  liste.forEach((roh, i) => {
    const r = quelleSchema.safeParse(roh);
    if (!r.success) {
      const f = r.error.issues[0];
      issues.push({ file: fileName, message: `Quelle Nr. ${i + 1} übersprungen: ${f.path.join('.')}: ${f.message}` });
      return;
    }
    quellen.push(r.data);
  });
  return { quellen, issues };
}

/** Meldungen für Quellen, deren Ziel es nicht gibt (Abschnitt umbenannt, Begriffsseite entfernt). */
export function pruefeQuellenZiele(fileName: string, quellen: Quelle[], abschnitte: Set<string>, begriffe: Set<string>): ImportIssue[] {
  return quellen
    .filter((q) => {
      const [art, id] = [q.ziel.slice(0, q.ziel.indexOf(':')), q.ziel.slice(q.ziel.indexOf(':') + 1)];
      return art === 'abschnitt' ? !abschnitte.has(id) : !begriffe.has(id);
    })
    .map((q) => ({ file: fileName, message: `Quelle „${q.titel}“: Ziel ${q.ziel} gibt es nicht.` }));
}

/** Quellen je Ziel (Reihenfolge wie in der Datei). */
export function quellenNachZiel(quellen: Quelle[] = []): Map<string, Quelle[]> {
  const m = new Map<string, Quelle[]>();
  for (const q of quellen) m.set(q.ziel, [...(m.get(q.ziel) ?? []), q]);
  return m;
}
