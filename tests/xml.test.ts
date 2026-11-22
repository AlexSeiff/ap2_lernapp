import { describe, expect, it } from 'vitest';
import { ergebnisListe, pruefeXmlSyntax, pruefeXpathSyntax, textwert, werteXpath, type XmlDokument } from '../domain/xml';
import { pruefeXmlAntwort, pruefeXpathAntwort } from '../domain/xmlUebungen';

const meldung = (xml: string) => {
  const s = pruefeXmlSyntax(xml);
  return s.ok ? 'ok' : s.fehler.meldung;
};
const stelle = (xml: string) => {
  const s = pruefeXmlSyntax(xml);
  return s.ok ? undefined : { zeile: s.fehler.zeile, spalte: s.fehler.spalte };
};

describe('XML: wohlgeformt oder nicht', () => {
  it('nimmt gültige Dokumente an: Deklaration, Kommentare, leere Elemente, Entitäten, CDATA, DOCTYPE', () => {
    expect(meldung('<a/>')).toBe('ok');
    expect(meldung('<?xml version="1.0" encoding="UTF-8"?>\n<kunde nr="1">\n  <name>Meier &amp; Co</name>\n</kunde>\n')).toBe('ok');
    expect(meldung('<!-- Kopf -->\n<a x=\'1\' y="2"><b/><![CDATA[1 < 2]]></a>\n<!-- Ende -->')).toBe('ok');
    expect(meldung('<!DOCTYPE a [<!ELEMENT a (#PCDATA)>]>\n<a>&#228;&#x20AC;</a>')).toBe('ok');
    expect(meldung('<größe einheit="cm">12</größe>')).toBe('ok');
  });

  it('erkennt die typischen Prüfungsfehler mit verständlicher Meldung und Stelle', () => {
    expect(meldung('')).toMatch(/Noch nichts/);
    expect(meldung('<a><b></a>')).toMatch(/Falsch verschachtelt: <\/a> kommt, bevor <b>/);
    expect(meldung('<a>\n  <b>x</b>\n')).toMatch(/<a> \(Zeile 1\) wird nicht geschlossen – es fehlt <\/a>/);
    expect(meldung('<Kunde>x</kunde>')).toMatch(/Groß-\/Kleinschreibung/);
    expect(meldung('<a>x</b>')).toMatch(/<\/b> passt zu keinem offenen Element – hier wird <\/a> erwartet/);
    expect(meldung('<a/>\n<b/>')).toMatch(/genau ein Wurzelelement/);
    expect(meldung('<a nr=4711/>')).toMatch(/Anführungszeichen: nr="…"/);
    expect(meldung('<a nr="1" nr="2"/>')).toMatch(/„nr“ kommt in <a> zweimal vor/);
    expect(meldung('<a nr="1"x="2"/>')).toMatch(/Zwischen zwei Attributen fehlt ein Leerzeichen/);
    expect(meldung('<a>Müller & Söhne</a>')).toMatch(/&amp;/);
    expect(meldung('<a>&euro;</a>')).toMatch(/kennt XML ohne DTD nicht/);
    expect(meldung('<a>1 < 2</a>')).toMatch(/&lt;/);
    expect(meldung('<1a/>')).toMatch(/nicht mit „1“ beginnen/);
    expect(meldung('<kunden nummer>1</kunden nummer>')).toMatch(/Leerzeichen/);
    expect(meldung(' <?xml version="1.0"?><a/>')).toMatch(/ganz am Anfang/);
    expect(meldung('Text<a/>')).toMatch(/Vor dem Wurzelelement/);
    expect(meldung('<a/>Text')).toMatch(/Nach dem Wurzelelement/);
    expect(meldung('<a></a></a>')).toMatch(/kein passendes Start-Tag/);
    expect(meldung('<a x="1>text</a>')).toMatch(/kein < stehen|schließende/);
    expect(meldung('<a><b</a>')).toMatch(/nicht geschlossen – vor diesem < fehlt das >/);
    expect(meldung('<a></a x="1">')).toMatch(/End-Tags haben keine Attribute/);
    expect(meldung('< a/>')).toMatch(/Nach < darf kein Leerzeichen/);
    expect(stelle('<a>\n  <b>\n</a>')).toEqual({ zeile: 3, spalte: 1 });
  });

  it('baut den Baum: Text ohne reinen Leerraum, Attribute, Textwert', () => {
    const s = pruefeXmlSyntax('<a x="1">\n  <b>eins</b>\n  <b>zwei</b>\n</a>');
    expect(s.ok).toBe(true);
    const d = (s as { dokument: XmlDokument }).dokument;
    const a = d.kinder[0];
    expect(a.kinder.map((k) => k.art)).toEqual(['element', 'element']);
    expect(a.attribute[0]).toMatchObject({ name: 'x', wert: '1' });
    // Reiner Leerraum zwischen Elementen (Einrückung) zählt nicht als Text.
    expect(textwert(a)).toBe('einszwei');
  });
});

const DOK = `<bestellungen>
  <bestellung nr="B-1" datum="2026-03-02">
    <kunde nr="1001">Meier GmbH</kunde>
    <position artikel="A-10" menge="4"><preis>12.50</preis></position>
    <position artikel="A-20" menge="1"><preis>149.90</preis></position>
  </bestellung>
  <bestellung nr="B-2" datum="2026-03-05">
    <kunde nr="1002">Schulz KG</kunde>
    <position artikel="A-10" menge="10"><preis>12.50</preis></position>
  </bestellung>
</bestellungen>`;
const dok = (pruefeXmlSyntax(DOK) as { dokument: XmlDokument }).dokument;
const werte = (x: string) => {
  const e = werteXpath(dok, x);
  if (!e.ok) throw new Error(e.fehler.meldung);
  return ergebnisListe(e.wert).map((v) => v.wert);
};

describe('XPath', () => {
  it('Pfade, //, @, *, text(), .., Positionen', () => {
    expect(werte('/bestellungen/bestellung/kunde')).toEqual(['Meier GmbH', 'Schulz KG']);
    expect(werte('//kunde/@nr')).toEqual(['1001', '1002']);
    expect(werte('//kunde/text()')).toEqual(['Meier GmbH', 'Schulz KG']);
    expect(werte('/bestellungen/*[2]/@nr')).toEqual(['B-2']);
    expect(werte('//bestellung[1]/position[last()]/@artikel')).toEqual(['A-20']);
    expect(werte('//position[1]/@menge')).toEqual(['4', '10']);
    expect(werte('(//position)[1]/@menge')).toEqual(['4']);
    expect(werte('//kunde[.="Schulz KG"]/../@nr')).toEqual(['B-2']);
    expect(werte('//@artikel')).toEqual(['A-10', 'A-20', 'A-10']);
    expect(werte('/bestellungen/bestellung/kunde | //bestellung/@nr')).toEqual(['B-1', 'Meier GmbH', 'B-2', 'Schulz KG']);
    expect(werte('//position[1]/following-sibling::position/@artikel')).toEqual(['A-20']);
    expect(werte('//preis/ancestor::bestellung[1]/@nr')).toEqual(['B-1', 'B-2']);
  });

  it('Prädikate mit Vergleichen, and/or, Funktionen', () => {
    expect(werte("//bestellung[kunde/@nr='1002']/@datum")).toEqual(['2026-03-05']);
    expect(werte('//position[@menge > 3]/@artikel')).toEqual(['A-10', 'A-10']);
    expect(werte('//position[preis > 100]/@artikel')).toEqual(['A-20']);
    expect(werte("//position[@artikel='A-10' and @menge >= 10]/@menge")).toEqual(['10']);
    expect(werte('count(//position)')).toEqual(['3']);
    expect(werte('sum(//position/@menge)')).toEqual(['15']);
    expect(werte('sum(//bestellung[@nr="B-1"]/position/preis)')).toEqual(['162.4']);
    expect(werte("//kunde[contains(., 'KG')]/@nr")).toEqual(['1002']);
    expect(werte("//bestellung[starts-with(@datum, '2026-03-0')][not(kunde = 'Meier GmbH')]/@nr")).toEqual(['B-2']);
    expect(werte('count(//bestellung[count(position) > 1])')).toEqual(['1']);
    expect(werte('//position[@menge * preis > 100]/@artikel')).toEqual(['A-20', 'A-10']);
    expect(werte('name(/*)')).toEqual(['bestellungen']);
  });

  it('meldet Fehler in der Schreibweise verständlich', () => {
    const m = (x: string) => {
      const s = pruefeXpathSyntax(x);
      return s.ok ? 'ok' : s.fehler.meldung;
    };
    expect(m('//kunde[@nr == 1]')).toMatch(/nicht mit ==/);
    expect(m('//kunde[@nr = 1 && x]')).toMatch(/and/);
    expect(m('//kunde[@nr = 1')).toMatch(/schließende eckige Klammer/);
    expect(m('count(//a')).toMatch(/schließende Klammer/);
    expect(m('avg(//preis)')).toMatch(/kennt die Übung nicht/);
    expect(m('//kunde[]')).toMatch(/leer/);
    expect(m('//preis[. > 12,5]')).toMatch(/Punkt/);
    expect(m('//kunde[.=„Meier“]')).toMatch(/geraden Anführungszeichen/);
    expect(m('//@')).toMatch(/Attributname/);
    expect(m('count()')).toMatch(/erwartet 1 Argument/);
    expect(m('/a/b c')).toMatch(/Nach dem Ausdruck steht noch/);
    expect(m('')).toMatch(/Noch kein Ausdruck/);
  });
});

describe('XPath-Antwort mit der Musterlösung vergleichen', () => {
  it('gleiche Treffer zählen, auch über anderen Weg oder text()', () => {
    expect(pruefeXpathAntwort(dok, '//kunde/text()', '/bestellungen/bestellung/kunde').ok).toBe(true);
    expect(pruefeXpathAntwort(dok, '//bestellung/kunde', '/bestellungen/bestellung/kunde').ok).toBe(true);
    expect(pruefeXpathAntwort(dok, 'count(//bestellung/position)', 'count(//position)').ok).toBe(true);
  });

  it('gibt gezielte Rückmeldung', () => {
    const p = (x: string, l: string) => {
      const r = pruefeXpathAntwort(dok, x, l);
      return 'meldung' in r ? r.meldung : r.fehler.meldung;
    };
    expect(p('//Kunde', '//kunde')).toMatch(/findet nichts/);
    expect(p('//kunde', "//kunde[@nr='1002']")).toMatch(/2 Treffer, gesucht ist 1 Treffer – fehlt eine Bedingung/);
    expect(p('//position', 'count(//position)')).toMatch(/count\(\) oder sum\(\)/);
    expect(p('count(//bestellung)', 'count(//position)')).toMatch(/ergibt 2/);
  });
});

describe('XML-Antwort gegen Regeln', () => {
  const regeln = [
    { xpath: '/artikel/@nr', wert: 'A-100' },
    { xpath: '/artikel/preis', wert: 0.12 },
    { xpath: 'count(/artikel/*)', wert: 2 },
  ];
  it('richtig, egal in welcher Reihenfolge oder Einrückung', () => {
    expect(pruefeXmlAntwort('<artikel nr="A-100"><preis>0.12</preis><bezeichnung>Schraube</bezeichnung></artikel>', regeln).ok).toBe(true);
  });
  it('Element statt Attribut, Dezimalkomma, falscher Wert', () => {
    const p = pruefeXmlAntwort('<artikel><nr>A-100</nr><preis>0,12</preis></artikel>', regeln);
    expect(p.regeln.map((r) => r.meldung)).toEqual([
      expect.stringMatching(/als Element im Dokument, verlangt ist ein Attribut/),
      expect.stringMatching(/Dezimalzahlen stehen in XML-Daten mit Punkt/),
      undefined,
    ]);
    const q = pruefeXmlAntwort('<artikel preis="0.12" nr="A-1"><x/></artikel>', regeln);
    expect(q.regeln[0].meldung).toMatch(/ist „A-1“, verlangt ist „A-100“/);
    expect(q.regeln[1].meldung).toMatch(/als Attribut im Dokument, verlangt ist ein eigenes Element/);
  });
});
