// Seit Oktober 2026 löscht migrateProgress früher gespeicherte Antworten (Rechenübungen: antworten, Diagramm-Übungen: belegung):
// eine Wiederholung soll leer beginnen. So sehen die alten Fixtures nach dem Laden aus – sonst bleibt alles gleich.

type Staende = Record<string, Record<string, unknown>>;

const ohne = (s: Staende | undefined, feld: string) =>
  s && Object.fromEntries(Object.entries(s).map(([id, v]) => [id, Object.fromEntries(Object.entries(v).filter(([k]) => k !== feld))]));

export function ohneAntworten<T extends { rechnen?: unknown; diagramme?: unknown }>(p: T): T {
  return {
    ...p,
    ...(p.rechnen ? { rechnen: ohne(p.rechnen as Staende, 'antworten') } : {}),
    ...(p.diagramme ? { diagramme: ohne(p.diagramme as Staende, 'belegung') } : {}),
  };
}
