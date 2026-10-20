// Frage zu einer Begriffskarte (Vorderseite = nur der Begriff): aus Begriff und Erwartung der Antwort abgeleitet, damit die Karte
// eine echte Frage stellt („Wie berechnet man …?“ statt nur „Termintreue“). Nur zur Anzeige – `question` bleibt der Begriff
// (Glossar, Suche und Leicht-Modus brauchen ihn so).

const NOTATION = /^(?:BPMN|UML|EPK|eEPK|ERM|Raute|Kreis|Sechseck|Gestrichelter|Durchgezogener|Rechteck|Ellipse|Strichmännchen)\b/i;
const FORMEL = /(?:^|\s)=\s|\s\/\s|\s·\s|^(?:Summe|Anteil|Größter minus|Mittlerer|Verhältnis|Quotient|Differenz)\b/;
const VERB =
  /^(?:Filtert|Sortiert|Prüft|Dient|Zeigt|Erzeugt|Verbindet|Berechnet|Fasst|Ordnet|Legt|Sichert|Verhindert|Ermöglicht|Wandelt|Wählt|Liefert)\b/;
const KATEGORIE = /^([A-ZÄÖÜ][\wÄÖÜäöüß-]*(?: [\wÄÖÜäöüß-]+){0,2}):\s/;

/** Der Begriff ist eine Abkürzung (Großbuchstaben, ggf. mit Ziffern/Bindestrich), z. B. „BSI“, „AUC“, „CAP“. */
const istAbkuerzung = (begriff: string) => /^[A-ZÄÖÜ][A-ZÄÖÜ0-9&/-]{1,7}$/.test(begriff.trim());

/** Frage als Markdown; der Begriff steht fett darin. */
export function begriffsFrage(begriff: string, antwort: string | undefined, bereich?: string): string {
  const frage = grundFrage(begriff, antwort);
  // Kontext in die Frage: „… im Bereich SQL“ – nur, wenn die Frage nicht schon eine Kategorie nennt.
  if (!bereich || frage.includes('(')) return frage;
  return frage.replace(/(\*\*)(?=[,?])/, `$1 (${bereich})`);
}

/** Deckname ohne „Fachbegriffe – “ als Bereich einer Begriffskarte. */
export const bereichAusDeck = (titel: string | undefined) => titel?.replace(/^Fachbegriffe\s+[–-]\s+/, '');

function grundFrage(begriff: string, antwort: string | undefined): string {
  const b = `**${begriff.trim()}**`;
  const a = (antwort ?? '').trim();
  if (istAbkuerzung(begriff) && /^[A-ZÄÖÜ][^,;–]*[,;–]/.test(a) && !FORMEL.test(a.slice(0, 40)))
    return `Wofür steht ${b}, und was bedeutet es?`;
  const kat = KATEGORIE.exec(a);
  if (kat && !/ und |^Träger$/.test(kat[1])) return `Was versteht man unter ${b} (${kat[1]})?`;
  if (NOTATION.test(a)) return `Wie wird ${b} dargestellt, und was bedeutet es?`;
  if (FORMEL.test(a.slice(0, 60)) && !/^(?:Ein|Eine|Der|Die|Das)\b/.test(a)) return `Wie berechnet man ${b}, und was sagt es aus?`;
  if (VERB.test(a)) return `Was leistet ${b}, und wann setzt man es ein?`;
  return `Was versteht man unter ${b}?`;
}
