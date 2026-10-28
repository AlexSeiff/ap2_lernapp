// Welche Teile des Prüfungsanhangs zu Aufgaben passen (components/Belegsatz.tsx, AnhangPanel): der SQL-Belegsatz zu SQL-Aufgaben,
// die Formelübersicht zu Rechenaufgaben. In der AP2 liegt der Anhang immer bei – hier soll er dort griffbereit sein, wo man ihn braucht.

import type { Task } from '../../shared/types';
import { findeOperatoren } from './operatoren';

/** SQL in der Aufgabe: Codeblock, das Wort „SQL“ oder typische Schlüsselwörter (großgeschrieben, wie in den Lernblättern). */
const SQL = /```sql|\bSQL\b|\b(?:SELECT|JOIN|GROUP BY|INSERT INTO|UPDATE|DELETE FROM|CREATE (?:TABLE|VIEW|INDEX))\b/;

/** Operatoren, die eine Rechnung verlangen. */
const RECHNEN = new Set(['berechnen', 'ermitteln']);

/** Formelblock unter der Aufgabe – auch Deutungsaufgaben, die auf einem Rechenergebnis aufbauen („Interpretieren Sie r …“). */
const FORMELBLOCK = /^> \*\*Formeln?:\*\*/m;

export interface AnhangTeile {
  sql: boolean;
  formeln: boolean;
}

/** Anhang für eine Aufgabe oder eine ganze Klausur (dann reicht eine passende Aufgabe). */
export function anhangFuer(tasks: Task[]): AnhangTeile {
  const sql = tasks.some((t) => !!t.sqlUebung || SQL.test(t.markdown));
  const formeln = tasks.some(
    (t) => t.type === 'rechnen' || FORMELBLOCK.test(t.markdown) || findeOperatoren(t.markdown).some((o) => RECHNEN.has(o.operatorId)),
  );
  return { sql, formeln };
}
