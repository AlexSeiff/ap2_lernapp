import { describe, expect, it } from 'vitest';
import { ladeInhalt } from '../build/inhalt';
import type { Task } from '../domain/types';
import { aufgabenBedeutung, bedeutungKurz, editorVerdacht } from '../src/lib/aufgabenBedeutung';

// Der Parser setzt bei jeder Aufgabe nur type „offen“; Editor, Anhang und Operator erschließt die App aus dem Aufgabentext (Umbauplan Phase 6,
// Bestandsaufnahme). Dieser Test macht das sichtbar und hält es fest: Formuliert jemand eine Aufgabe um und die Erkennung bricht, nennt der Test die Aufgabe.
const aufgabe = (markdown: string): Task => ({ id: 'x-A1', code: 'A1', topicId: 'x', block: 'A', points: 4, markdown, type: 'offen' });

describe('Bedeutung einer Aufgabe aus ihrem Text', () => {
  const { content } = ladeInhalt();
  const alle = Object.values(content.tasks);

  it('hält Editor, Anhang und Operator jeder Aufgabe fest (ein Snapshot je Aufgabe)', () => {
    const erkannt = Object.fromEntries(alle.map((t) => [t.id, bedeutungKurz(aufgabenBedeutung(t))]));
    expect(Object.keys(erkannt)).toHaveLength(alle.length);
    expect(erkannt).toMatchSnapshot();
  });

  it('keine Aufgabe sieht nach einem Editor aus, bekommt aber keinen', () => {
    const verdacht = alle.map((t) => [t.id, aufgabenBedeutung(t).verdacht] as const).filter(([, v]) => v);
    // Taucht hier eine Aufgabe auf: entweder hat eine Umformulierung die Erkennung in editorFuer gebrochen (Text anpassen) oder die Aufgabe braucht
    // bewusst nur ein Textfeld (dann hier mit Begründung erlauben).
    expect(verdacht).toEqual([]);
  });

  it('es gibt Aufgaben mit Editor, mit Anhang und ohne Operator – die Erkennung läuft überhaupt', () => {
    const b = alle.map(aufgabenBedeutung);
    expect(b.filter((x) => x.editor !== 'textfeld').length).toBeGreaterThan(50);
    expect(b.filter((x) => x.sql).length).toBeGreaterThan(20);
    expect(b.filter((x) => x.formeln).length).toBeGreaterThan(40);
    expect(b.filter((x) => x.diagramme.length).length).toBeGreaterThan(10);
  });
});

describe('Verdacht: eine Umformulierung hat den Editor verloren', () => {
  it('„Erstellen Sie das ER-Diagramm“ bekommt den Editor, kein Verdacht', () => {
    const b = aufgabenBedeutung(aufgabe('*Erstellen* Sie das ER-Diagramm mit allen Beziehungen und Kardinalitäten.'));
    expect(b.editor).toBe('erm');
    expect(b.verdacht).toBeUndefined();
  });

  it('„Fertigen Sie das ER-Diagramm an“ verliert den Editor (kein Operator) und wird gemeldet', () => {
    const b = aufgabenBedeutung(aufgabe('Fertigen Sie das ER-Diagramm mit allen Beziehungen und Kardinalitäten an.'));
    expect(b.editor).toBe('textfeld');
    expect(b.operator).toBe('keiner');
    expect(b.verdacht).toMatch(/kein Operator und „ER-Diagramm“, aber kein Editor/);
  });

  it('ein Zeichen-Operator ohne Editor (anderes Verb für die Erkennung) wird gemeldet', () => {
    expect(editorVerdacht(aufgabe('Skizzieren Sie den Ablauf als BPMN-Diagramm.'), 'skizzieren', 'textfeld')).toMatch(
      /Operator „skizzieren“ und „BPMN“/,
    );
  });

  it('eine Frage nach dem Diagramm (beschreiben, nennen) braucht keinen Editor und wird nicht gemeldet', () => {
    expect(aufgabenBedeutung(aufgabe('*Beschreiben* Sie, wofür der Pool im BPMN-Diagramm steht.')).verdacht).toBeUndefined();
    expect(aufgabenBedeutung(aufgabe('*Nennen* Sie zwei Elemente eines ER-Diagramms.')).verdacht).toBeUndefined();
  });

  it('mit Editor gibt es nie einen Verdacht', () => {
    expect(editorVerdacht(aufgabe('Erstellen Sie ein ER-Diagramm.'), 'erstellen', 'erm')).toBeUndefined();
  });
});
