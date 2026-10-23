import { describe, expect, it } from 'vitest';
import { begriffsFrage, bereichAusDeck } from '../src/lib/begriffsFrage';

describe('begriffsFrage', () => {
  it.each([
    ['Termintreue', 'Pünktlich erledigte Fälle / Gesamtfälle · 100.', 'Wie berechnet man **Termintreue**, und was sagt es aus?'],
    ['Gesamtpuffer', 'GP = SAZ − FAZ: Verschiebung, die möglich ist.', 'Wie berechnet man **Gesamtpuffer**, und was sagt es aus?'],
    [
      'BSI',
      'Bundesamt für Sicherheit in der Informationstechnik; gibt den IT-Grundschutz heraus.',
      'Wofür steht **BSI**, und was bedeutet es?',
    ],
    ['Vollständigkeit', 'DQ-Dimension: Anteil der befüllten Pflichtfelder.', 'Was versteht man unter **Vollständigkeit** (DQ-Dimension)?'],
    ['Startereignis', 'BPMN-Kreis mit dünnem Rand – löst den Prozess aus.', 'Wie wird **Startereignis** dargestellt, und was bedeutet es?'],
    ['WHERE', 'Filtert einzelne Zeilen vor der Gruppierung.', 'Was leistet **WHERE**, und wann setzt man es ein?'],
    ['Lohnsteuer', 'Monatliche Vorauszahlung auf die Einkommensteuer.', 'Was versteht man unter **Lohnsteuer**?'],
    ['Sprint', 'Event fester Länge von höchstens einem Monat.', 'Was versteht man unter **Sprint**?'],
  ])('%s', (begriff, antwort, erwartet) => {
    expect(begriffsFrage(begriff, antwort)).toBe(erwartet);
  });
  it('Bereich als Kontext in der Frage', () => {
    expect(begriffsFrage('Lift', 'Konfidenz / Support', 'CRISP-DM & Machine Learning')).toBe(
      'Wie berechnet man **Lift** (CRISP-DM & Machine Learning), und was sagt es aus?',
    );
    expect(bereichAusDeck('Fachbegriffe – SQL')).toBe('SQL');
  });
  it('ohne Antwort die allgemeine Frage', () => {
    expect(begriffsFrage('Foo', undefined)).toBe('Was versteht man unter **Foo**?');
  });
});
