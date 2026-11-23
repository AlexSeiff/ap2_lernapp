// Liste der Normalisierungs-Übungen (/normalisierung): Tabelle oder Text in die 3. NF überführen. Gleiche Liste und gleicher
// Fortschritt wie die JSON- und XML-Übungen (DatenformatListe, IDs „NF-…“).

import { normalisierungUebungen } from '../lib/normalisierung';
import { useStore } from '../lib/store';
import { DatenformatListe } from './JsonUebungen';

export function NormalisierungUebungen() {
  const { content } = useStore();
  return (
    <DatenformatListe
      titel="Normalisierung"
      icon="table"
      pfad="/normalisierung"
      alle={normalisierungUebungen(content)}
      leer="Keine Normalisierungs-Übungen gefunden. Prüfe die Datei AP2_Normalisierung_Uebungen.json unter „Daten & Import“."
    >
      Aus einer unnormalisierten Tabelle oder aus einem Beschreibungstext ein relationales Datenmodell in 3. Normalform erstellen – wie in
      der Prüfung: Tabellen zeichnen, Primär- und Fremdschlüssel kennzeichnen, Abhängigkeiten begründen. Die App zeichnet dein Schema als
      Beziehungsdiagramm und gleicht jeden Schritt mit der Musterlösung ab; Spaltenreihenfolge und Tabellennamen sind frei.
    </DatenformatListe>
  );
}
