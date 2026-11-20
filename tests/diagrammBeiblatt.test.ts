import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ladeInhalt } from '../build/inhalt';
import { DIAGRAMM_TYPEN } from '../domain/diagrammUebungen';
import { AnhangPanel, hatAnhang } from '../src/components/Belegsatz';
import { DiagrammBeiblatt } from '../src/components/DiagrammBeiblatt';
import { FormSymbol, formName } from '../src/components/DiagrammSvg';
import { anhangFuer } from '../src/lib/anhang';
import { BEIBLATT, BEIBLATT_ARTEN, BEIBLATT_ZU_TYP, beiblattFuerText, beiblattVereinigen } from '../src/lib/diagrammBeiblatt';
import { NOTATIONEN } from '../src/lib/diagrammEditor';

// Das Beiblatt „Diagrammelemente“ (Umbauplan Phase 10): beschreibt die Elemente der Notationen, wie die App sie zeichnet.
const EDITOR_NOTATIONEN = Object.keys(NOTATIONEN) as (keyof typeof NOTATIONEN)[];

describe('Beiblatt: Vollständigkeit gegenüber den Editoren', () => {
  it.each(EDITOR_NOTATIONEN)('%s: jedes Element der Leiste und jede Verbindungsart ist beschrieben', (art) => {
    const beschrieben = new Set(BEIBLATT[art].elemente.map((e) => e.form));
    for (const f of NOTATIONEN[art].formen) expect(beschrieben, `${art}: ${f.form}`).toContain(f.form);
    const kanten = new Set(BEIBLATT[art].kanten.map((k) => k.editorArt));
    for (const k of NOTATIONEN[art].kanten) expect(kanten, `${art}: Verbindung ${k}`).toContain(k);
  });

  it('die Notationen der Editoren haben alle ein Beiblatt', () => {
    for (const art of EDITOR_NOTATIONEN) expect(BEIBLATT_ARTEN).toContain(art);
  });

  it('jeder Typ einer Diagramm-Übung hat ein Beiblatt', () => {
    for (const typ of DIAGRAMM_TYPEN) expect(BEIBLATT_ARTEN, typ).toContain(BEIBLATT_ZU_TYP[typ]);
  });
});

describe('Beiblatt: Inhalt', () => {
  it.each(BEIBLATT_ARTEN)('%s: Titel, Beschreibungen vollständig, keine Doppelten, Symbole lassen sich zeichnen', (art) => {
    const b = BEIBLATT[art];
    expect(b.titel.length).toBeGreaterThan(3);
    expect(b.elemente.length).toBeGreaterThan(0);
    const formen = b.elemente.map((e) => e.form);
    expect(new Set(formen).size, 'Form doppelt').toBe(formen.length);
    for (const e of b.elemente) {
      expect(formName(e.form), `Name für ${e.form}`).toBeTruthy();
      expect(e.beschreibung.trim()).toMatch(/[.)]$/);
      expect(e.beschreibung.length, e.form).toBeGreaterThan(15);
      expect(renderToStaticMarkup(createElement(FormSymbol, { form: e.form })), e.form).toContain('<svg');
    }
    for (const k of b.kanten) {
      expect(k.name.length).toBeGreaterThan(2);
      expect(k.beschreibung.trim()).toMatch(/[.)]$/);
    }
  });
});

describe('Beiblatt: welche Notationen eine Aufgabe braucht', () => {
  it('erkennt die Notationen im Text, in fester Reihenfolge und ohne Doppelte', () => {
    expect(beiblattFuerText('Erstellen Sie ein ER-Diagramm.')).toEqual(['erm']);
    expect(beiblattFuerText('Modellieren Sie den Ablauf als BPMN-Diagramm.')).toEqual(['bpmn']);
    expect(beiblattFuerText('Zeichnen Sie die eEPK.')).toEqual(['epk']);
    expect(beiblattFuerText('Ergänzen Sie das Aktivitätsdiagramm und das Zustandsdiagramm.')).toEqual(['aktivitaet', 'zustand']);
    expect(beiblattFuerText('Berechnen Sie den Mittelwert.')).toEqual([]);
    expect(beiblattVereinigen(['bpmn', 'erm'], ['erm', 'epk'])).toEqual(['erm', 'epk', 'bpmn']);
  });

  const { content } = ladeInhalt();
  const aufgabe = (id: string) => content.tasks[id];

  it('echte Aufgaben: ER-Diagramm (02-B1) und BPMN (05-B1) bekommen ihr Beiblatt, eine Rechenaufgabe keins', () => {
    expect(anhangFuer([aufgabe('02-B1')]).diagramme).toContain('erm');
    expect(anhangFuer([aufgabe('05-B1')]).diagramme).toContain('bpmn');
    expect(anhangFuer([aufgabe('03-A1')]).diagramme).toEqual([]);
  });

  it('eine Klausur sammelt die Notationen aller ihrer Aufgaben', () => {
    const alle = Object.values(content.tasks).filter((t) => t.topicId === '05');
    const teile = anhangFuer(alle);
    expect(teile.diagramme.length).toBeGreaterThan(0);
    expect(teile.diagramme).toEqual(beiblattVereinigen(teile.diagramme));
  });
});

describe('Beiblatt: Anzeige', () => {
  it('zeigt je Notation eine Tabelle mit Symbol, Name und Bedeutung', () => {
    const html = renderToStaticMarkup(createElement(DiagrammBeiblatt, { arten: ['epk', 'bpmn'] }));
    expect(html).toContain('Ereignisgesteuerte Prozesskette');
    expect(html).toContain('BPMN 2.0');
    expect(html).toContain('Kontrollfluss');
    expect(html).toContain('Nachrichtenfluss');
    expect(html).toContain('scope="row"');
    expect(html.match(/<table/g)).toHaveLength(2);
    expect(html.match(/<svg/g)!.length).toBeGreaterThan(12);
  });

  it('der Anhang bietet „Diagrammelemente“ nur an, wenn es Notationen gibt', () => {
    expect(hatAnhang({ diagramme: [] })).toBe(false);
    expect(hatAnhang({ diagramme: ['erm'] })).toBe(true);
    expect(renderToStaticMarkup(createElement(AnhangPanel, { diagramme: ['erm'] }))).toContain('Diagrammelemente');
    expect(renderToStaticMarkup(createElement(AnhangPanel, { diagramme: [] }))).toBe('');
  });
});
