// XML-Übungen: Import mit Prüfung, die Übungen selbst (Musterlösung richtig, Vorgabe fehlerhaft, Fehler der Reihe nach) und die Seiten.

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { emptyProgress } from '../domain/progress';
import { pruefeXmlSyntax } from '../domain/xml';
import { parseXmlUebungen, pruefeXmlAntwort, pruefeXpathAntwort, pruefeXmlUebung } from '../domain/xmlUebungen';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { xmlUebungen } from '../src/lib/jsonUebungen';

const content = loadContent(CONTENT_DIR);

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, firstVisit: false }),
}));
const { XmlUebungen } = await import('../src/pages/XmlUebungen');
const { XmlUebung } = await import('../src/pages/XmlUebung');

const alle = xmlUebungen(content);
const uebung = (id: string) => alle.find((u) => u.id === id)!;

describe('Import', () => {
  it('alle Übungen kommen ohne Meldung an, beide Arten sind vertreten', () => {
    expect(content.issues.filter((i) => /Xml_Uebungen/.test(i.file))).toEqual([]);
    expect(alle.length).toBeGreaterThanOrEqual(13);
    expect(alle.filter((u) => u.art === 'dokument').length).toBeGreaterThanOrEqual(7);
    expect(alle.filter((u) => u.art === 'xpath').length).toBeGreaterThanOrEqual(6);
    expect(new Set(alle.map((u) => u.id)).size).toBe(alle.length);
    for (const u of alle) expect(u.aufgabe, u.id).toMatch(/^[^*]*\*(Erstellen|Prüfen|Formulieren)\* Sie/m);
  });

  it('fehlerhafte Übungen werden übersprungen und gemeldet', () => {
    const roh = (u: object) => JSON.stringify({ uebungen: [u] });
    const basis = { id: 'X', titel: 'T', stufe: 1, aufgabe: 'A', hinweise: [], tags: [] };
    expect(
      parseXmlUebungen('f', roh({ ...basis, art: 'dokument', loesung: '<a>', pruefungen: [{ xpath: '/a' }] })).issues[0].message,
    ).toMatch(/nicht wohlgeformt/);
    expect(
      parseXmlUebungen('f', roh({ ...basis, art: 'dokument', loesung: '<a/>', pruefungen: [{ xpath: '/b' }] })).issues[0].message,
    ).toMatch(/erfüllt die Regel nicht/);
    expect(
      parseXmlUebungen('f', roh({ ...basis, art: 'xpath', dokument: '<a/>', loesung: '/b', pruefungen: [] })).issues[0].message,
    ).toMatch(/findet nichts/);
    expect(parseXmlUebungen('f', roh({ ...basis, art: 'xpath', loesung: '/a' })).issues[0].message).toMatch(/braucht ein Dokument/);
    expect(
      parseXmlUebungen('f', roh({ ...basis, art: 'dokument', loesung: '<a/>', pruefungen: [{ xpath: '/a', wert: 1, fehlt: true }] }))
        .issues[0].message,
    ).toMatch(/nur eins von/);
  });
});

describe('Die Übungen', () => {
  it('jede Musterlösung ist richtig; jede Vorgabe ist noch nicht fertig', () => {
    for (const u of alle) expect(pruefeXmlUebung(u), u.id).toEqual([]);
  });

  it('XML-004: die vier Fehler werden der Reihe nach gemeldet', () => {
    const u = uebung('XML-004');
    const schritte = [
      u.vorgabe!,
      u.vorgabe!.replace('id=L-07', 'id="L-07"'),
      u.vorgabe!.replace('id=L-07', 'id="L-07"').replace('<Name>', '<name>'),
      u.vorgabe!.replace('id=L-07', 'id="L-07"').replace('<Name>', '<name>').replace('<ort>Celle', '<ort>Celle</ort>'),
    ];
    const meldungen = schritte.map((t) => {
      const s = pruefeXmlSyntax(t);
      return s.ok ? 'ok' : s.fehler.meldung;
    });
    expect(meldungen[0]).toMatch(/Anführungszeichen/);
    expect(meldungen[1]).toMatch(/Groß-\/Kleinschreibung/);
    expect(meldungen[2]).toMatch(/Falsch verschachtelt: <\/kontakt> kommt, bevor <telefon>/);
    expect(meldungen[3]).toMatch(/Falsch verschachtelt/);
    // <ort> nicht geschlossen, aber ans Ende gesetzt: wohlgeformt, doch der Ort stimmt nicht.
    const falschGeschlossen = u.loesung.replace('<ort>Celle</ort>', '<ort>Celle').replace('</lieferant>', '</ort>\n</lieferant>');
    const p = pruefeXmlAntwort(falschGeschlossen, u.pruefungen);
    expect(p.syntax.ok).toBe(true);
    expect(p.regeln.find((r) => !r.ok)?.meldung).toMatch(/nur „Celle“/);
  });

  it('XML-005: zwei Wurzelelemente, & und < im Text, Groß-/Kleinschreibung', () => {
    const v = uebung('XML-005').vorgabe!;
    const m = (t: string) => {
      const s = pruefeXmlSyntax(t);
      return s.ok ? 'ok' : s.fehler.meldung;
    };
    expect(m(v)).toMatch(/&amp;/);
    const ohneAmp = v.replace(' & ', ' &amp; ');
    expect(m(ohneAmp)).toMatch(/genau ein Wurzelelement/);
  });

  it('XPath-Übungen: Musterlösung und Alternativen gelten, typische Fehler nicht', () => {
    const d = (id: string) => {
      const s = pruefeXmlSyntax(uebung(id).dokument!);
      if (!s.ok) throw new Error(s.fehler.meldung);
      return s.dokument;
    };
    const ok = (id: string, x: string) => pruefeXpathAntwort(d(id), x, uebung(id).loesung).ok;
    expect(ok('XML-008', '//@nr')).toBe(false); // auch Kundennummern
    expect(ok('XML-009', "//kunde[@nr='1002']")).toBe(true); // gleicher Text, anderer Weg
    expect(ok('XML-010', '//position[@preis > 100]/bezeichnung')).toBe(false);
    expect(ok('XML-011', "count(//kunde[@nr='1001'])")).toBe(true);
    expect(ok('XML-012', "count(//position[@artikel='A-10'])")).toBe(false);
    expect(ok('XML-013', '//bestellung[count(//position) > 1]/@nr')).toBe(false);
  });
});

describe('Seiten', () => {
  const seite = (pfad: string) =>
    renderToString(
      createElement(
        ConfirmContext.Provider,
        { value: async () => true },
        createElement(
          MemoryRouter,
          { initialEntries: [pfad] },
          createElement(
            Routes,
            null,
            createElement(Route, { path: '/xml', element: createElement(XmlUebungen) }),
            createElement(Route, { path: '/xml/:id', element: createElement(XmlUebung) }),
          ),
        ),
      ),
    ).replace(/<!-- -->/g, '');

  it('Liste mit Fortschritt und Link zur nächsten Übung', () => {
    const h = seite('/xml');
    expect(h).toContain('XML-Übungen');
    expect(h).toContain('XML-001');
    expect(h).toContain(`0 / ${alle.length} gelöst`);
    expect(h).toContain('href="/xml/XML-001"');
  });

  it('Dokument-Übung: Eingabefeld; eine Vorgabe zeigt ihren ersten Fehler', () => {
    expect(seite('/xml/XML-001')).toContain('Schreib dein XML');
    const k = seite('/xml/XML-004');
    expect(k).toContain('Zeile 1, Spalte 15');
    expect(k).toContain('Attributwerte stehen in Anführungszeichen');
  });

  it('XPath-Übung: Dokument unter der Aufgabe, Eingabezeile', () => {
    const h = seite('/xml/XML-009');
    expect(h).toContain('xml-dokument');
    expect(h).toContain('&lt;kunde nr=&quot;1002&quot;&gt;Schulz KG');
    expect(h).toContain('xpath-eingabe');
  });

  it('unbekannte Übung: Link zurück', () => {
    expect(seite('/xml/NICHT-DA')).toContain('href="/xml"');
  });
});
