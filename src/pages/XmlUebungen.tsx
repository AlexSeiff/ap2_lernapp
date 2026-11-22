// Liste der XML-Übungen (/xml): XML schreiben und korrigieren, XPath formulieren. Gleiche Liste und gleicher Fortschritt wie die
// JSON-Übungen (DatenformatListe).

import { xmlUebungen } from '../lib/jsonUebungen';
import { useStore } from '../lib/store';
import { DatenformatListe } from './JsonUebungen';

export function XmlUebungen() {
  const { content } = useStore();
  return (
    <DatenformatListe
      titel="XML-Übungen"
      icon="code"
      pfad="/xml"
      alle={xmlUebungen(content)}
      leer="Keine XML-Übungen gefunden. Prüfe die Datei AP2_Xml_Uebungen.json unter „Daten & Import“."
    >
      XML selbst schreiben, fehlerhafte Dokumente reparieren und Knoten mit XPath auswählen. Die App prüft, ob das Dokument wohlgeformt ist,
      zeigt die erste fehlerhafte Stelle mit Hinweis und prüft die Struktur – Einrückung und Reihenfolge der Attribute sind frei.
    </DatenformatListe>
  );
}
