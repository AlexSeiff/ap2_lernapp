// Welche JSON-Dateien im Inhaltsordner liest die App, und welche Art Inhalt steckt darin? Die Dateimuster stehen NUR hier – der Import
// (parser.ts, buildContent) und die Dateiauswahl des Builds und des Entwicklungsservers (build/inhalt.ts) benutzen dieselben.
//
// Neue Art von JSON-Inhalt: hier ein Muster eintragen, dann in buildContent einen Block für die Art ergänzen (Parser in domain/,
// Prüfung der IDs wie bei den anderen) und im Importbericht (tools/report.ts) einen Abschnitt. Die Lernblätter (Markdown) haben eigene
// Muster in build/inhalt.ts.

export const JSON_DATEIEN = {
  lernkarten: /Lernkarten.*\.json$/i,
  sql: /SQL_Uebungen.*\.json$/i,
  rechnen: /Rechen_Uebungen.*\.json$/i,
  diagramme: /Diagramm_Uebungen.*\.json$/i,
  json: /Json_Uebungen.*\.json$/i,
  xml: /Xml_Uebungen.*\.json$/i,
  normalisierung: /Normalisierung_Uebungen.*\.json$/i,
  quellen: /^AP2_Quellen\.json$/,
} as const;

export type JsonArt = keyof typeof JSON_DATEIEN;

/** Gehört die Datei zu dieser Art JSON-Inhalt? */
export const istJsonArt = (name: string, art: JsonArt): boolean => JSON_DATEIEN[art].test(name);

/** Ist es eine JSON-Datei, die die App liest (egal welche Art)? */
export const istJsonInhalt = (name: string): boolean => Object.values(JSON_DATEIEN).some((re) => re.test(name));
