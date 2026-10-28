import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { emptyProgress } from '../shared/progress';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { antwortAlsText, editorFuer, leseEditorAntwort, schreibeEditorAntwort } from '../src/lib/editorAufgabe';
import { gleicheWerteAb, musterWerteTabelle, ohneVorlageTabelle, werteVorlage, zahlAus, type WerteAntwort } from '../src/lib/werteTabelle';

// Wertetabelle als Antwort: Aufgaben, die eine Tabelle verlangen (Häufigkeitstabelle, Rechenweg „tabellarisch“, „in die Tabelle eintragen“).

const content = loadContent(CONTENT_DIR);
const task = (id: string) => content.tasks[id];

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { default: EditorAntwort, EditorPruefung } = await import('../src/components/EditorAntwort');

const html = (el: ReturnType<typeof createElement>) =>
  renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, el)).replace(/<!-- -->/g, '');

/** Antwort mit den Zeilen der Musterlösung (die „richtige“ Abgabe). */
const ausMuster = (id: string): WerteAntwort => {
  const m = musterWerteTabelle(task(id))!;
  return { editor: 'werte', kopf: m.kopf, zeilen: m.zeilen.map((r) => [...r]) };
};

describe('Erkennung und Vorlage', () => {
  it('nur wenn die Aufgabe eine Tabelle verlangt und die Lösung eine hat', () => {
    expect(editorFuer(task('03-A3'))).toBe('werte');
    // Tabelle nur erwähnt („zusätzliche Tabelle“, „Kundentabelle“) → Textfeld.
    expect(editorFuer(task('15-A4'))).toBeUndefined();
    expect(editorFuer(task('15-A1'))).toBeUndefined();
    // Ohne Musterlösung keine Vorlage, also kein Editor.
    expect(editorFuer({ markdown: '*Stellen* Sie das Ergebnis tabellarisch dar.', type: 'offen' })).toBeUndefined();
  });

  it('Kopfzeile aus der Musterlösung, Zellen leer – keine Werte vorab', () => {
    const v = werteVorlage(task('03-A3'))!;
    expect(v.kopf).toEqual(['Grund', 'h', 'f in %', 'kumuliert %']);
    expect(v.zeilen).toHaveLength(6);
    expect(v.zeilen.flat().every((z) => z === '')).toBe(true);
  });

  it('Tabelle in der Aufgabe ist die Vorlage, vorgegebene Zellen bleiben', () => {
    const v = werteVorlage(task('19-C2'))!;
    expect(v.kopf).toEqual(['Datenbank', 'personenbezogene Daten', 'nicht personenbezogene Daten']);
    expect(v.zeilen.map((r) => r[0])).toEqual(['Berechtigungsdatenbank', 'Anlieferdatenbank', 'Speditionsdatenbank']);
    // Maskierte Striche in der Kopfzeile (Z1(4\|4)) trennen keine Spalten.
    expect(werteVorlage(task('06-C2'))!.kopf).toEqual(['Punkt', 'Abstand zu Z1(4|4)', 'Abstand zu Z2(6|6)', 'Cluster']);
  });

  it('Punkte-Tabellen der Lösung sind keine Lösungstabelle', () => {
    expect(musterWerteTabelle({ solution: { markdown: '| Element | P |\n|---|---|\n| Pool | 3 |' } })).toBeUndefined();
  });

  it('„Kreuzen Sie an“ mit Kreuzen in der Lösung: Kästchen', () => {
    expect(werteVorlage(task('19-C2'))!.kreuze).toBe(true);
    expect(werteVorlage(task('18-A3'))!.kreuze).toBeUndefined();
  });

  it('der Aufgabentext zeigt die Vorlage nicht doppelt, Text danach bleibt', () => {
    const text = ohneVorlageTabelle(task('18-D2').markdown);
    expect(text).not.toContain('| Kriterium | Beschreibung |');
    expect(text).toContain('Tragen Sie Ihre Antworten in die Tabelle ein.');
    expect(text).toContain('Schlussfolgerung: …');
    expect(ohneVorlageTabelle('ohne Tabelle')).toBe('ohne Tabelle');
  });
});

describe('Lesen, Schreiben, Text', () => {
  const t = task('19-C2');

  it('leer bleibt leer – vorgegebene Zellen zählen nicht als Eintragung', () => {
    const leer = leseEditorAntwort('werte', t, undefined) as WerteAntwort;
    expect(leer.zeilen[0][0]).toBe('Berechtigungsdatenbank');
    expect(schreibeEditorAntwort(leer, t)).toBe('');
    const mitKreuz = { ...leer, zeilen: leer.zeilen.map((r, i) => (i === 2 ? [r[0], 'X', ''] : r)) };
    expect(leseEditorAntwort('werte', t, schreibeEditorAntwort(mitKreuz, t))).toEqual(mitKreuz);
  });

  it('vorgegebene Zellen kommen aus der Aufgabe, ein alter Text geht nicht verloren', () => {
    const geaendert = JSON.stringify({ editor: 'werte', kopf: ['x'], zeilen: [['überschrieben', 'X', '']] });
    expect((leseEditorAntwort('werte', t, geaendert) as WerteAntwort).zeilen[0]).toEqual(['Berechtigungsdatenbank', 'X', '']);
    expect(leseEditorAntwort('werte', task('03-A3'), 'Transportschaden 18 …').notiz).toBe('Transportschaden 18 …');
  });

  it('für die KI-Bewertung als Markdown-Tabelle', () => {
    const a = ausMuster('03-A3');
    const text = antwortAlsText(task('03-A3'), JSON.stringify(a));
    expect(text.split('\n')[0]).toBe('| Grund | h | f in % | kumuliert % |');
    expect(text).toContain('| Transportschaden | 18 | 36,0 | 36,0 |');
  });
});

describe('Abgleich', () => {
  it('Zahlen aus Zellen: Komma, Vorzeichen, Σ, Einheit, Rechnung mit „=“', () => {
    expect(zahlAus('36,0')).toBe(36);
    expect(zahlAus('−10,00')).toBe(-10);
    expect(zahlAus('+10')).toBe(10);
    expect(zahlAus('Σ 26')).toBe(26);
    expect(zahlAus('√8 = 2,83')).toBe(2.83);
    expect(zahlAus('40 %')).toBe(40);
    expect(zahlAus('249.00')).toBe(249);
    expect(zahlAus('1.200')).toBe(1200);
    expect(zahlAus('Transportschaden')).toBeUndefined();
    expect(zahlAus('–')).toBeUndefined();
  });

  it('jede Lösungstabelle mit Zahlen passt zu sich selbst', () => {
    for (const id of ['01-A4', '03-A3', '03-C2', '04-A2', '04-C1', '06-C2', '07-D3', '12-C1', '12-D2']) {
      const a = gleicheWerteAb(task(id), ausMuster(id))!;
      expect(a, id).toBeDefined();
      expect(a.gleich, id).toBe(a.vergleichbar);
      expect(a.vergleichbar, id).toBeGreaterThan(0);
    }
  });

  it('03-A3: andere Rundung zählt, falsche Sortierung fällt auf', () => {
    const a = ausMuster('03-A3');
    a.zeilen[0][2] = '36';
    expect(gleicheWerteAb(task('03-A3'), a)!.gleich).toBe(gleicheWerteAb(task('03-A3'), ausMuster('03-A3'))!.gleich);
    const unsortiert = ausMuster('03-A3');
    [unsortiert.zeilen[0], unsortiert.zeilen[1]] = [unsortiert.zeilen[1], unsortiert.zeilen[0]];
    const b = gleicheWerteAb(task('03-A3'), unsortiert)!;
    expect(b.zeilen[0].befund).toContain('abweichend');
    expect(b.gleich).toBeLessThan(b.vergleichbar);
  });

  it('Kreuztabelle 19-C2 wird verglichen, Texttabelle 08-A1 nicht', () => {
    const leer = leseEditorAntwort('werte', task('19-C2'), undefined) as WerteAntwort;
    const a = gleicheWerteAb(task('19-C2'), leer)!;
    expect(a.vergleichbar).toBe(6);
    expect(a.gleich).toBe(3); // die leeren Zellen der Lösung stimmen
    expect(gleicheWerteAb(task('08-A1'), ausMuster('08-A1'))).toBeUndefined();
  });
});

describe('Darstellung', () => {
  const editor = (id: string, value?: string, disabled = false) =>
    html(createElement(EditorAntwort, { task: task(id), art: 'werte', value, onChange: () => {}, disabled, hilfen: true }));

  it('Tabelle mit Eingabefeldern, ohne Werte der Musterlösung', () => {
    const h = editor('03-A3');
    expect(h).toContain('Trag deine Lösung in die Tabelle ein');
    expect(h).toContain('<th scope="col">kumuliert %</th>');
    expect(h.match(/class="wt-zelle"/g)).toHaveLength(24);
    expect(h).toContain('+ Zeile');
    expect(h).not.toMatch(/Transportschaden|36,0|Musterlösung<\/h4>/);
  });

  it('vorgegebene Zellen stehen als Text, nicht als Feld; Kreuze als Kästchen', () => {
    const h = editor('19-C2');
    expect(h).toContain('<td class="wt-fest">Berechtigungsdatenbank</td>');
    expect(h.match(/type="checkbox"/g)).toHaveLength(6);
    expect(h).not.toContain('wt-zelle');
    expect(editor('18-A3').match(/class="wt-zelle"/g)).toHaveLength(4);
  });

  it('nach der Abgabe ohne Eingabe, beim Bewerten der Abgleich', () => {
    const a = ausMuster('03-A3');
    a.zeilen[1][2] = '29,0';
    const h = editor('03-A3', JSON.stringify(a), true);
    expect(h).toContain('Deine Lösung');
    expect(h).toContain('<td>Transportschaden</td>');
    expect(h).not.toContain('wt-zelle');
    const p = html(createElement(EditorPruefung, { task: task('03-A3'), art: 'werte', answer: JSON.stringify(a) }));
    expect(p).toContain('Abgleich mit der Tabelle der Musterlösung');
    expect(p).toContain('Muster: 30,0');
    expect(p).toMatch(/<b>\d+ von \d+<\/b>/);
  });
});
