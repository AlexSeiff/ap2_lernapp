import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { emptyProgress } from '../shared/progress';
import type { Form } from '../shared/diagrammUebungen';
import { ConfirmContext } from '../src/hooks/useConfirm';
import {
  balkenPunkt,
  diagrammAlsText,
  kantenLinien,
  pruefeDiagrammAntwort,
  randPunkt,
  standardKante,
  type DiagrammAntwort,
  type DiagrammNotation,
  type EditorKantenArt,
} from '../src/lib/diagrammEditor';
import { antwortAlsText, editorFuer, leseEditorAntwort, normalformSchritte, schreibeEditorAntwort } from '../src/lib/editorAufgabe';
import {
  abgleichOk,
  anlageTabellen,
  gleicheAb,
  musterFuerSchritt,
  musterTabellen,
  relationText,
  type MusterTabelle,
  type Tabelle,
  type TabellenAntwort,
} from '../src/lib/tabellenEditor';

// Modellierungsaufgaben im Editor (ERM, EPK, BPMN, Use-Case, Aktivitätsdiagramm, Normalisierung, Relationenmodell).

const content = loadContent(CONTENT_DIR);
const task = (id: string) => content.tasks[id];

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { default: EditorAntwort, EditorPruefung } = await import('../src/components/EditorAntwort');
const { Aufgabe } = await import('../src/pages/Aufgabe');

const html = (el: ReturnType<typeof createElement>) =>
  renderToString(createElement(ConfirmContext.Provider, { value: async () => true }, el)).replace(/<!-- -->/g, '');

/** Kleines Diagramm aus einer Kurzschreibweise: Knoten [id, form, text, x, y], Kanten [von, nach, art, text]. */
function diagramm(
  editor: DiagrammNotation,
  knoten: [string, Form, string, number?, number?, number?, number?][],
  kanten: [string, string, EditorKantenArt?, string?][],
): DiagrammAntwort {
  return {
    editor,
    knoten: knoten.map(([id, form, text, x = 0, y = 0, w = 100, h = 50]) => ({ id, form, text, x, y, w, h })),
    kanten: kanten.map(([von, nach, art = 'fluss', text], i) => ({ id: `v${i + 1}`, von, nach, art, ...(text ? { text } : {}) })),
  };
}

/** Musterlösung von 21-A1 (Warenausgabe): zwei Schwimmbahnen, zwei Entscheidungen, Zusammenführung, Fork/Join, ⊗ und ◉. */
const warenausgabe = (): DiagrammAntwort =>
  diagramm(
    'aktivitaet',
    [
      ['bk', 'schwimmbahn', 'Kunde', 0, 0, 300, 900],
      ['bm', 'schwimmbahn', 'Mitarbeiter Warenausgabe', 300, 0, 340, 900],
      ['s', 'startpunkt', '', 135, 50, 30, 30],
      ['a1', 'aktion', 'Abholschein vorlegen', 70, 110, 160, 56],
      ['a2', 'aktion', 'Auftragsnummer scannen und Zahlung prüfen', 390, 110, 160, 56],
      ['d1', 'entscheidung', '', 448, 200, 44, 44],
      ['a3', 'aktion', 'Kunden zur Kasse schicken', 470, 260, 160, 56],
      ['fe', 'ablaufende', '', 535, 330, 30, 30],
      ['d2', 'entscheidung', '', 400, 300, 44, 44],
      ['a4', 'aktion', 'Vollmacht und Ausweis zeigen', 70, 380, 160, 56],
      ['a5', 'aktion', 'Vollmacht und Ausweis prüfen', 340, 380, 160, 56],
      ['m', 'entscheidung', '', 448, 470, 44, 44],
      ['f', 'gabel', '', 340, 550, 240, 10],
      ['a6', 'aktion', 'Ware im Lager anfordern', 480, 600, 140, 56],
      ['a7', 'aktion', 'Lieferschein drucken', 320, 600, 140, 56],
      ['a8', 'aktion', 'Lieferschein unterschreiben', 70, 680, 160, 56],
      ['j', 'gabel', '', 340, 770, 240, 10],
      ['a9', 'aktion', 'Ware übergeben', 390, 800, 160, 56],
      ['e', 'endpunkt', '', 455, 865, 30, 30],
    ],
    [
      ['s', 'a1'], ['a1', 'a2'], ['a2', 'd1'], ['d1', 'a3', 'fluss', 'nicht bezahlt'], ['a3', 'fe'], ['d1', 'd2', 'fluss', '[bezahlt]'],
      ['d2', 'a4', 'fluss', 'Abholung durch Dritte'], ['a4', 'a5'], ['a5', 'm'], ['d2', 'm', 'fluss', 'Käufer selbst'], ['m', 'f'],
      ['f', 'a6'], ['f', 'a7'], ['a7', 'a8'], ['a6', 'j'], ['a8', 'j'], ['j', 'a9'], ['a9', 'e'],
    ], // prettier-ignore
  );

describe('Erkennung', () => {
  it('genau die Modellierungsaufgaben der Blätter bekommen einen Editor', () => {
    const mitEditor = Object.fromEntries(
      Object.values(content.tasks)
        .filter((t) => !t.generated && editorFuer(t))
        .map((t) => [t.id, editorFuer(t)]),
    );
    expect(mitEditor).toEqual({
      '02-B1': 'erm',
      '02-B2': 'relationen',
      '02-C1': 'normalform',
      '05-B1': 'bpmn',
      '08-C1': 'relationen',
      '15-A3': 'usecase',
      '18-B3': 'epk',
      '21-B3': 'epk',
      '21-A1': 'aktivitaet',
      '22-B1': 'aktivitaet',
      '03-D3': 'boxplot', // tests/boxplotAntwort.test.ts
      '11-D2': 'struktogramm', // tests/struktogramm.test.ts
      // Verlangte Tabellen (tests/werteTabelle.test.ts)
      ...Object.fromEntries(
        [
          '01-A4',
          '03-A1',
          '03-A3',
          '03-C2',
          '03-C4',
          '04-A2',
          '04-C1',
          '05-A2',
          '05-D1',
          '05-D4',
          '06-B1',
          '06-C2',
          '06-B5',
          '07-A2',
          '07-D3',
          '08-A1',
          '08-C3',
          '08-D2',
          '08-A3',
          '08-D4',
          '09-A1',
          '09-C4',
          '09-D2',
          '10-A3',
          '10-C3',
          '11-A1',
          '11-B4',
          '12-B1',
          '12-C1',
          '12-D2',
          '12-B3',
          '15-B1',
          '15-C1',
          '15-D1',
          '16-A2',
          '16-B1',
          '16-C2',
          '18-A3',
          '18-D2',
          '19-C1',
          '19-C2',
          '21-B1',
          '21-B2',
          '21-C2',
          '21-D3',
          '22-A1',
          '22-B2',
          '22-C1',
          '22-C7',
          '22-D1',
          '22-D3',
          '23-A5',
          '23-B1',
          '23-C1',
          '23-C3',
          '23-D1',
          '24-C1',
          '24-C2',
          '24-C3',
          '24-C4',
          '24-D3',
        ].map((id) => [id, 'werte']),
      ),
    });
  });

  it('Textaufgaben über Diagramme bleiben Textaufgaben', () => {
    for (const id of ['05-B2', '15-A4', '18-B2', '02-B3', '02-D2']) expect(editorFuer(task(id)), id).toBeUndefined();
    expect(editorFuer({ markdown: '*Erstellen* Sie ein ER-Diagramm.', type: 'mc' })).toBeUndefined();
    expect(editorFuer({ markdown: '*Erstellen* Sie ein ER-Diagramm.', type: 'offen', sqlUebung: 'SQL-1' })).toBeUndefined();
  });

  it('Normalisierung: so viele Schritte wie die höchste Normalform', () => {
    expect(normalformSchritte(task('02-C1').markdown)).toBe(3);
    expect(normalformSchritte('Bringen Sie die Tabelle in die 2. NF.')).toBe(2);
    expect(normalformSchritte('Normalisieren Sie die Tabelle.')).toBe(1);
  });
});

describe('Antwort lesen und schreiben', () => {
  const t = task('02-B1');

  it('leer bleibt leer, Inhalt übersteht den Weg über den String', () => {
    expect(schreibeEditorAntwort(leseEditorAntwort('erm', t, undefined))).toBe('');
    const a = diagramm('erm', [['k1', 'entitaet', 'KUNDE']], []);
    expect(leseEditorAntwort('erm', t, schreibeEditorAntwort(a))).toEqual(a);
  });

  it('Aktivitätsdiagramm mit den neuen Formen übersteht den Weg über den String', () => {
    const a = warenausgabe();
    expect(leseEditorAntwort('aktivitaet', task('21-A1'), schreibeEditorAntwort(a))).toEqual(a);
    // Eine Zeichnung aus einem anderen Diagramm-Editor bleibt erhalten (dieselbe Familie).
    const alt = diagramm('epk', [['k1', 'funktion', 'Ware übergeben']], []);
    expect((leseEditorAntwort('aktivitaet', task('21-A1'), JSON.stringify(alt)) as DiagrammAntwort).knoten).toEqual(alt.knoten);
  });

  it('ein alter Text geht nicht verloren, kaputte Kanten fallen weg', () => {
    expect(leseEditorAntwort('erm', t, 'KUNDE (0,n) erteilt (1,1) AUFTRAG').notiz).toBe('KUNDE (0,n) erteilt (1,1) AUFTRAG');
    const roh = JSON.stringify({
      ...diagramm('erm', [['k1', 'entitaet', 'A']], []),
      kanten: [{ id: 'v1', von: 'k1', nach: 'weg', art: 'linie' }],
    });
    expect((leseEditorAntwort('erm', t, roh) as DiagrammAntwort).kanten).toEqual([]);
    expect(leseEditorAntwort('erm', t, '{kaputt').notiz).toBe('{kaputt');
  });

  it('Tabellen: Schritte je Normalform, Notiz zählt als Inhalt', () => {
    const c1 = task('02-C1');
    const leer = leseEditorAntwort('normalform', c1, '') as TabellenAntwort;
    expect(leer.schritte.map((s) => s.titel)).toEqual(['1. NF', '2. NF', '3. NF']);
    expect(schreibeEditorAntwort(leer)).toBe('');
    expect(schreibeEditorAntwort({ ...leer, notiz: 'Annahme: dauer_h ist die tatsächliche Zeit' })).not.toBe('');
  });

  it('als Text für die KI-Bewertung', () => {
    const a = diagramm(
      'erm',
      [
        ['k1', 'entitaet', 'KUNDE'],
        ['k2', 'beziehung', 'erteilt'],
        ['k3', 'entitaet', 'AUFTRAG'],
      ],
      [
        ['k1', 'k2', 'linie', '(0,n)'],
        ['k2', 'k3', 'linie', '(1,1)'],
      ],
    );
    const text = antwortAlsText(t, JSON.stringify(a));
    expect(text).toContain('Entität „KUNDE“ — Beziehung „erteilt“ ((0,n))');
    expect(text).toBe(diagrammAlsText(a));
    expect(antwortAlsText(task('02-A1'), 'nur Text')).toBe('nur Text');
  });
});

describe('Geometrie', () => {
  it('Kanten enden am Rand der Form', () => {
    expect(randPunkt({ form: 'entitaet', x: 0, y: 0, w: 100, h: 50 }, [300, 25])).toEqual([100, 25]);
    const [x, y] = randPunkt({ form: 'beziehung', x: 0, y: 0, w: 100, h: 50 }, [50, -100]);
    expect([x, y]).toEqual([50, 0]);
    const [ex, ey] = randPunkt({ form: 'attribut', x: 0, y: 0, w: 100, h: 50 }, [100, 50]);
    expect(((ex - 50) / 50) ** 2 + ((ey - 25) / 25) ** 2).toBeCloseTo(1);
  });

  it('zwei Kanten zwischen denselben Knoten (rekursive Beziehung) liegen nebeneinander', () => {
    const a = diagramm(
      'erm',
      [
        ['m', 'entitaet', 'MITARBEITER', 0, 0],
        ['f', 'beziehung', 'führt', 300, 0],
      ],
      [
        ['m', 'f', 'linie', '(0,n)'],
        ['m', 'f', 'linie', '(0,1)'],
      ],
    );
    const l = kantenLinien(a.knoten, a.kanten);
    expect(l.get('v1')![0][1]).not.toBe(l.get('v2')![0][1]);
  });

  it('Aktivitätsdiagramm: Kanten verlassen den Balken senkrecht über bzw. unter dem Partner', () => {
    const a = diagramm(
      'aktivitaet',
      [
        ['f', 'gabel', '', 100, 100, 200, 10],
        ['p', 'aktion', 'Ware anfordern', 100, 200, 100, 50],
        ['q', 'aktion', 'Lieferschein drucken', 220, 200, 100, 50],
        ['r', 'aktion', 'weit links', -300, 0, 100, 50],
      ],
      [
        ['f', 'p'],
        ['f', 'q'],
        ['r', 'f'],
      ],
    );
    const l = kantenLinien(a.knoten, a.kanten);
    expect(l.get('v1')).toEqual([
      [150, 110],
      [150, 200],
    ]);
    expect(l.get('v2')).toEqual([
      [270, 110],
      [270, 200],
    ]);
    // Liegt der Partner neben dem Balken, endet die Kante an dessen Ende (nicht in der Mitte).
    expect(l.get('v3')![1]).toEqual([104, 100]);
    expect(balkenPunkt({ form: 'gabel', x: 0, y: 0, w: 10, h: 200 }, [100, 50])).toEqual([10, 50]);
  });

  it('BPMN: zwischen zwei Pools wird die neue Verbindung ein Nachrichtenfluss', () => {
    const a = diagramm(
      'bpmn',
      [
        ['p1', 'pool', 'Möbelhaus', 0, 0, 600, 200],
        ['p2', 'pool', 'Kunde', 0, 240, 600, 100],
        ['t', 'task', 'Kostenvoranschlag senden', 100, 50, 130, 60],
        ['k', 'task', 'prüfen', 100, 260, 130, 60],
      ],
      [],
    );
    const k = (id: string) => a.knoten.find((x) => x.id === id)!;
    expect(standardKante(a, k('t'), k('k'))).toBe('nachricht');
    expect(standardKante(a, k('t'), k('t'))).toBe('fluss');
  });
});

describe('Formprüfung', () => {
  it('ERM: direkte Linie zwischen Entitäten, fehlende Kardinalität, Beziehung mit nur einer Entität', () => {
    const m = pruefeDiagrammAntwort(
      diagramm(
        'erm',
        [
          ['a', 'entitaet', 'KUNDE'],
          ['b', 'entitaet', 'AUFTRAG'],
          ['r', 'beziehung', 'erteilt'],
        ],
        [
          ['a', 'b', 'linie'],
          ['a', 'r', 'linie'],
        ],
      ),
    );
    expect(m.join(' ')).toMatch(/nicht direkt/);
    expect(m.join(' ')).toMatch(/Kardinalität/);
    expect(m.join(' ')).toMatch(/weniger als zwei Entitäten/);
  });

  it('ERM: die Musterlösung von 02-B1 (inkl. rekursiver Beziehung) ist formal in Ordnung', () => {
    const a = diagramm(
      'erm',
      [
        ['l', 'entitaet', 'LIEFERANT', 0, 0],
        ['li', 'beziehung', 'liefert', 200, 0],
        ['p', 'entitaet', 'PRODUKT', 400, 0],
        ['ep', 'attribut', 'einkaufspreis', 200, 100],
        ['m', 'entitaet', 'MITARBEITER', 0, 300],
        ['er', 'beziehung', 'erfasst', 200, 300],
        ['au', 'entitaet', 'AUFTRAG', 400, 300],
        ['fu', 'beziehung', 'führt', 0, 450],
      ],
      [
        ['l', 'li', 'linie', '(1,n)'],
        ['li', 'p', 'linie', '(1,n)'],
        ['li', 'ep', 'linie'],
        ['m', 'er', 'linie', '(0,n)'],
        ['er', 'au', 'linie', '(1,1)'],
        ['m', 'fu', 'linie', '(0,n)'],
        ['fu', 'm', 'linie', '(0,1)'],
      ],
    );
    expect(pruefeDiagrammAntwort(a)).toEqual([]);
  });

  it('EPK: Musterlösung von 18-B3 ohne Hinweise, typische Fehler mit Hinweis', () => {
    const k: [string, Form, string][] = [
      ['e1', 'ereignis', 'Reklamation ist eingegangen'],
      ['und', 'and', ''],
      ['f1', 'funktion', 'Kunden informieren'],
      ['e2', 'ereignis', 'Kunde ist informiert'],
      ['f2', 'funktion', 'Sachbearbeiter zuweisen'],
      ['e3', 'ereignis', 'Sachbearbeiter ist zugewiesen'],
      ['f3', 'funktion', 'Reklamation erfassen'],
      ['e4', 'ereignis', 'Reklamation ist erfasst'],
      ['f4', 'funktion', 'Mangel prüfen'],
      ['x1', 'xor', ''],
      ['e5', 'ereignis', 'Mangel liegt nicht vor'],
      ['e6', 'ereignis', 'Mangel liegt vor'],
      ['f5', 'funktion', 'Ablehnung senden'],
      ['e7', 'ereignis', 'Ablehnung ist gesendet'],
      ['f6', 'funktion', 'Reparaturmöglichkeit prüfen'],
      ['x2', 'xor', ''],
      ['e8', 'ereignis', 'Reparatur möglich'],
      ['e9', 'ereignis', 'Reparatur nicht möglich'],
      ['f7', 'funktion', 'Reparatur beauftragen'],
      ['e10', 'ereignis', 'Reparatur beauftragt'],
      ['f8', 'funktion', 'Ersatz liefern'],
      ['e11', 'ereignis', 'Ersatz ist geliefert'],
      ['xj', 'xor', ''],
      ['f9', 'funktion', 'Reklamation schließen'],
      ['e12', 'ereignis', 'Reklamation ist geschlossen'],
      ['rs', 'info', 'Reklamationssystem'],
      ['pd', 'info', 'Produktdokumentation'],
    ];
    const fluss: [string, string][] = [
      ['e1', 'und'], ['und', 'f1'], ['und', 'f2'], ['f1', 'e2'], ['f2', 'e3'], ['e3', 'f3'], ['f3', 'e4'], ['e4', 'f4'],
      ['f4', 'x1'], ['x1', 'e5'], ['x1', 'e6'], ['e5', 'f5'], ['f5', 'e7'], ['e6', 'f6'], ['f6', 'x2'], ['x2', 'e8'], ['x2', 'e9'],
      ['e8', 'f7'], ['f7', 'e10'], ['e9', 'f8'], ['f8', 'e11'], ['e7', 'xj'], ['e10', 'xj'], ['e11', 'xj'], ['xj', 'f9'], ['f9', 'e12'],
    ]; // prettier-ignore
    const knoten = k.map(([id, form, text], i): [string, Form, string, number, number] => [
      id,
      form,
      text,
      (i % 5) * 200,
      Math.floor(i / 5) * 100,
    ]);
    const kanten: [string, string, EditorKantenArt][] = [
      ...fluss.map(([a, b]): [string, string, EditorKantenArt] => [a, b, 'fluss']),
      ['f3', 'rs', 'zuordnung'],
      ['f9', 'rs', 'zuordnung'],
      ['pd', 'f4', 'zuordnung'],
    ];
    expect(pruefeDiagrammAntwort(diagramm('epk', knoten, kanten))).toEqual([]);

    // XOR direkt nach dem Ereignis, AND-Join statt XOR-Join, Objekt im Kontrollfluss.
    const falsch = kanten
      .filter(([a, b]) => !(a === 'f4' && b === 'x1') && !(a === 'e4' && b === 'f4'))
      .concat([
        ['e4', 'x1', 'fluss'],
        ['pd', 'f4', 'fluss'],
      ]);
    const m = pruefeDiagrammAntwort(
      diagramm(
        'epk',
        knoten.map((x) => (x[0] === 'xj' ? [x[0], 'and', '', x[3], x[4]] : x)),
        falsch,
      ),
    );
    expect(m.join(' ')).toMatch(/Nach einem Ereignis darf kein XOR/);
    expect(m.join(' ')).toMatch(/Deadlock/);
    expect(m.join(' ')).toMatch(/gehört nicht in den Kontrollfluss/);
  });

  it('BPMN: Sequenzfluss über Poolgrenzen, unbeschriftete XOR-Pfade, fehlendes Endereignis', () => {
    const a = diagramm(
      'bpmn',
      [
        ['p1', 'pool', 'Möbelhaus', 0, 0, 800, 200],
        ['p2', 'pool', 'Kunde', 0, 240, 800, 100],
        ['s', 'start', '', 40, 80, 36, 36],
        ['t', 'task', 'Kostenvoranschlag erstellen', 120, 70, 130, 60],
        ['g', 'gw-xor', '', 300, 75, 50, 50],
        ['a', 'task', 'Absage senden', 400, 20, 130, 60],
        ['b', 'task', 'Reparatur durchführen', 400, 120, 130, 60],
        ['k', 'task', 'Angebot prüfen', 120, 260, 130, 60],
      ],
      [
        ['s', 't'],
        ['t', 'g'],
        ['g', 'a'],
        ['g', 'b', 'fluss', 'angenommen'],
        ['t', 'k', 'fluss'],
      ],
    );
    const m = pruefeDiagrammAntwort(a).join(' ');
    expect(m).toMatch(/nur Nachrichtenflüsse/);
    expect(m).toMatch(/XOR-Gateways mit ihrer Bedingung/);
    expect(m).toMatch(/Es fehlt ein Endereignis/);
  });

  it('Aktivitätsdiagramm: Musterlösung von 21-A1 ohne Hinweise', () => {
    expect(pruefeDiagrammAntwort(warenausgabe())).toEqual([]);
  });

  it('Aktivitätsdiagramm: typische Punktverluste der Altklausur werden gemeldet', () => {
    const a = diagramm(
      'aktivitaet',
      [
        ['b', 'schwimmbahn', 'Kunde', 0, 0, 300, 600],
        ['a', 'aktion', 'Abholschein vorlegen', 70, 60, 160, 56],
        ['d', 'entscheidung', '', 128, 160, 44, 44],
        ['x', 'aktion', 'Kunden zur Kasse schicken', 400, 160, 160, 56],
        ['f', 'gabel', '', 60, 260, 180, 10],
        ['p', 'aktion', 'Ware anfordern', 20, 300, 120, 56],
        ['q', 'aktion', 'Lieferschein drucken', 160, 300, 120, 56],
        ['u', 'aktion', 'Ware übergeben', 70, 400, 160, 56],
        ['e', 'endpunkt', '', 135, 500, 30, 30],
      ],
      [
        ['a', 'd'], ['d', 'x', 'fluss', 'nicht bezahlt'], ['d', 'f'], ['f', 'p'], ['f', 'q'], ['p', 'u'], ['q', 'u'], ['u', 'e'], ['e', 'x'],
      ], // prettier-ignore
    );
    const m = pruefeDiagrammAntwort(a).join(' ');
    expect(m).toMatch(/Es fehlt ein Startknoten/);
    expect(m).toMatch(/jede Kante aus einer Entscheidung mit ihrer Bedingung/);
    expect(m).toMatch(/fehlt die Vereinigung \(Join\)/);
    expect(m).toMatch(/Aktion „Ware übergeben“ hat mehrere eingehende Kanten/);
    expect(m).toMatch(/Endknoten hat eine ausgehende Kante/);
    expect(m).toMatch(/Außerhalb jeder Schwimmbahn: Aktion „Kunden zur Kasse schicken“/);
  });

  it('Aktivitätsdiagramm als Text: Bahnen, Aktionen, Bedingungen in eckigen Klammern, Fork und Join', () => {
    const text = antwortAlsText(task('21-A1'), JSON.stringify(warenausgabe()));
    expect(text).toMatch(/^UML-Aktivitätsdiagramm \(im Editor gezeichnet\)/);
    expect(text).toContain('- Schwimmbahn „Mitarbeiter Warenausgabe“');
    expect(text).toContain('- Aktion „Abholschein vorlegen“ – in Schwimmbahn „Kunde“');
    expect(text).toContain('- Entscheidung 1 → Aktion „Kunden zur Kasse schicken“ [nicht bezahlt]');
    expect(text).toContain('- Entscheidung 1 → Entscheidung 2 [bezahlt]');
    expect(text).toContain('- Entscheidung 2 → Zusammenführung [Käufer selbst]');
    expect(text).toContain('- Aktion „Kunden zur Kasse schicken“ → Ablaufende');
    expect(text).toContain('- Zusammenführung → Gabelung (Fork)');
    expect(text).toContain('- Vereinigung (Join) → Aktion „Ware übergeben“');
    expect(text).toContain('- Aktion „Ware übergeben“ → Endknoten');
  });

  it('Use-Case: Akteur in der Systemgrenze, «include» an einem Akteur', () => {
    const a = diagramm(
      'usecase',
      [
        ['sys', 'systemgrenze', 'Portal', 100, 0, 400, 300],
        ['ku', 'akteur', 'Kunde', 120, 20, 50, 76],
        ['uc', 'anwendungsfall', 'Reparatur beauftragen', 250, 50, 170, 56],
      ],
      [['uc', 'ku', 'include']],
    );
    const m = pruefeDiagrammAntwort(a).join(' ');
    expect(m).toMatch(/Akteure stehen außerhalb/);
    expect(m).toMatch(/verbindet zwei Anwendungsfälle/);
  });
});

/** Deine Tabellen aus den Tabellen der Musterlösung (für den Abgleich). */
const ausMuster = (muster: MusterTabelle[]): Tabelle[] =>
  muster.map((m, i) => ({ id: `t${i}`, name: m.name, spalten: m.spalten.map((s) => ({ ...s })), zeilen: [] }));

describe('Tabellen und Abgleich', () => {
  it('Relationenschreibweise wie auf den Blättern', () => {
    expect(
      relationText({
        name: 'liefert',
        spalten: [{ name: 'lieferanten_id', pk: true, fk: true }, { name: 'produkt_id', pk: true, fk: true }, { name: 'einkaufspreis' }],
      }),
    ).toBe('liefert(**lieferanten_id↑, produkt_id↑**, einkaufspreis)');
  });

  it('Ausgangstabelle aus Anlage 1 von Deep Dive 2', () => {
    const [v] = anlageTabellen(content.topics.find((t) => t.id === '02')!.exam!.attachments);
    expect(v.tabelle.name).toBe('auftrags_export');
    expect(v.tabelle.spalten.map((s) => s.name)).toEqual([
      'auftrag_nr', 'datum', 'kunden_id', 'kundenname', 'techniker_id', 'technikername', 'stundensatz', 'leistungen',
    ]); // prettier-ignore
    expect(v.tabelle.zeilen).toHaveLength(3);
  });

  it('Musterlösung 02-C1: drei Teile mit 1, 3 und 5 Tabellen', () => {
    const teile = musterTabellen(task('02-C1').solution!.markdown);
    expect(teile.map((t) => t.length)).toEqual([1, 3, 5]);
    expect(teile[0][0].spalten.filter((s) => s.pk).map((s) => s.name)).toEqual(['auftrag_nr', 'leistungs_id']);
    const pos = teile[2].find((t) => t.name === 'auftragsposition')!;
    expect(pos.spalten).toEqual([
      { name: 'auftrag_nr', pk: true, fk: true },
      { name: 'leistungs_id', pk: true, fk: true },
      { name: 'dauer_h', pk: false, fk: false },
    ]);
  });

  it('Musterlösungen 02-B2 und 08-C1 werden gelesen', () => {
    const [b2] = musterTabellen(task('02-B2').solution!.markdown);
    expect(b2.map((t) => t.name)).toEqual(['lieferant', 'produkt', 'liefert', 'mitarbeiter', 'auftrag']);
    expect(b2.find((t) => t.name === 'auftrag')!.offen).toBe(true);
    const [c1] = musterTabellen(task('08-C1').solution!.markdown);
    expect(c1.map((t) => t.name).sort()).toEqual(['dim_filiale', 'dim_kunde', 'dim_produkt', 'dim_zeit', 'fakt_verkauf']);
    expect(c1.find((t) => t.name === 'fakt_verkauf')!.spalten.filter((s) => s.fk)).toHaveLength(4);
  });

  it('richtige Lösung passt überall, typische Fehler werden gefunden', () => {
    const teile = musterTabellen(task('02-C1').solution!.markdown);
    for (let i = 0; i < 3; i++) {
      const muster = musterFuerSchritt(teile, 3, i);
      expect(gleicheAb(ausMuster(muster), muster).zeilen.every(abgleichOk)).toBe(true);
    }
    // stundensatz bleibt im Auftrag hängen, FK nicht markiert, andere Reihenfolge der Tabellen.
    const endschema = teile[2];
    const deine = ausMuster(endschema).reverse();
    const auftrag = deine.find((t) => t.name === 'auftrag')!;
    auftrag.spalten.push({ name: 'stundensatz' });
    auftrag.spalten = auftrag.spalten.map((s) => (s.name === 'kunden_id' ? { ...s, fk: false } : s));
    const techniker = deine.find((t) => t.name === 'techniker')!;
    techniker.spalten = techniker.spalten.filter((s) => s.name !== 'stundensatz');
    const a = gleicheAb(deine, endschema);
    const zeile = (n: string) => a.zeilen.find((z) => z.muster.name === n)!;
    expect(zeile('auftrag').zusaetzlich).toEqual(['stundensatz']);
    expect(zeile('auftrag').fkFehlt).toEqual(['kunden_id']);
    expect(zeile('techniker').fehlend).toEqual(['stundensatz']);
    expect(zeile('kunde').deine).toBe('kunde');
    expect(a.uebrig).toEqual([]);
  });

  it('andere Tabellennamen werden über die Spalten zugeordnet', () => {
    const muster = musterTabellen(task('02-C1').solution!.markdown)[1];
    const deine = ausMuster(muster).map((t) => ({ ...t, name: `${t.name}_x` }));
    expect(gleicheAb(deine, muster).zeilen.map((z) => z.deine)).toEqual(['auftrag_x', 'leistung_x', 'auftragsposition_x']);
  });
});

describe('Seiten', () => {
  const editor = (id: string, value?: string, disabled = false) =>
    html(
      createElement(EditorAntwort, {
        task: task(id),
        art: editorFuer(task(id))!,
        value,
        onChange: () => {},
        disabled,
        hilfen: true,
      }),
    );

  it('jede Editor-Aufgabe zeigt ihren Editor ohne Musterlösung', () => {
    const erwartet: Record<string, string[]> = {
      '02-B1': ['Entität', 'Beziehung', 'Attribut'],
      '05-B1': ['Pool', 'Lane', 'XOR-Gateway', 'Startereignis'],
      '18-B3': ['Ereignis', 'Funktion', 'XOR-Konnektor', 'Informationsobjekt'],
      '15-A3': ['Akteur', 'Anwendungsfall', 'Systemgrenze'],
      '21-A1': ['Aktivitätsdiagramm-Editor', 'Schwimmbahn', 'Startknoten', 'Gabelung/Vereinigung', 'Ablaufende', 'Endknoten'],
      '22-B1': ['Aktivitätsdiagramm-Editor', 'Aufrufaktion', 'Entscheidung/Merge'],
      '02-C1': ['1. NF', '2. NF', '3. NF', 'Ausgangstabelle „auftrags_export“ übernehmen'],
      '02-B2': ['+ Tabelle'],
      '08-C1': ['+ Tabelle'],
    };
    for (const [id, texte] of Object.entries(erwartet)) {
      const h = editor(id);
      for (const t of texte) expect(h, `${id}: ${t}`).toContain(t);
      expect(h, id).not.toContain('Musterlösung</h4>');
      // Keine Antworten vorab: weder Begriffe der Musterlösung noch fertige Tabellen.
      expect(h, id).not.toMatch(/LIEFERANT|Reklamationssystem|kundenname|dim_zeit|Lieferschein|Zentrallager/);
    }
  });

  it('nach der Abgabe: Zeichnung bzw. Tabellen ohne Bedienelemente', () => {
    const a = diagramm('erm', [['k1', 'entitaet', 'KUNDE', 10, 10]], []);
    const h = editor('02-B1', JSON.stringify(a), true);
    expect(h).toContain('Deine Lösung');
    expect(h).toContain('KUNDE');
    expect(h).not.toContain('Rückgängig');
    expect(editor('02-B1', '', true)).toContain('Kein Diagramm gezeichnet');
  });

  it('Bewerten: Abgleich der Normalisierung und Formprüfung des Diagramms', () => {
    const t = task('02-C1');
    const teile = musterTabellen(t.solution!.markdown);
    const antwort: TabellenAntwort = {
      editor: 'normalform',
      schritte: ['1. NF', '2. NF', '3. NF'].map((titel, i) => ({ titel, text: '', tabellen: ausMuster(teile[i]) })),
    };
    const h = html(createElement(EditorPruefung, { task: t, art: 'normalform', answer: JSON.stringify(antwort) }));
    expect(h).toContain('Abgleich mit den Tabellen der Musterlösung');
    expect(h.match(/✓ passt/g)).toHaveLength(9);

    const erm = diagramm('erm', [['a', 'entitaet', 'A'], ['b', 'entitaet', 'B']], [['a', 'b', 'linie']]); // prettier-ignore
    const f = html(createElement(EditorPruefung, { task: task('02-B1'), art: 'erm', answer: JSON.stringify(erm) }));
    expect(f).toContain('Formprüfung deiner Zeichnung');
    expect(f).toContain('nicht direkt');
  });

  it('Einzelaufgabe lädt den Editor statt des Textfelds', () => {
    const app = createElement(
      MemoryRouter,
      { initialEntries: ['/aufgabe/02-C1'] },
      createElement(Routes, null, createElement(Route, { path: '/aufgabe/:taskId', element: createElement(Aufgabe) })),
    );
    const h = html(app);
    expect(h).toContain('Editor lädt');
    expect(h).not.toContain('Deine Antwort …');
  });
});
