// Normalisierungs-Übungen: Import mit Prüfung, jede Musterlösung besteht ihre eigene Prüfung, typische Fehler fallen auf, das
// Beziehungsdiagramm findet jeden Fremdschlüssel, und die Seiten rendern.

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { fkZiel, leseRelation, parseNormalisierungUebungen, type NormalisierungUebung } from '../domain/normalisierungUebungen';
import { emptyProgress } from '../domain/progress';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { leereNfAntwort, leseNfAntwort, normalisierungUebungen, pruefeNfAntwort, tabellenDesSchritts } from '../src/lib/normalisierung';
import { schemaLayout } from '../src/lib/schemaDiagramm';
import { benenneUm, kastenBreite, kastenHoehe, mitLage, verbinde, verschiebeSpalte, zeichnerLinien } from '../src/lib/schemaZeichner';
import type { TabellenAntwort } from '../src/lib/tabellenEditor';

const content = loadContent(CONTENT_DIR);

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, firstVisit: false }),
}));
const { NormalisierungUebungen } = await import('../src/pages/NormalisierungUebungen');
const { NormalisierungUebung } = await import('../src/pages/NormalisierungUebung');

const alle = normalisierungUebungen(content);
const uebung = (id: string) => alle.find((u) => u.id === id)!;

/** Die Musterlösung so, wie man sie im Editor eingeben würde. */
const alsAntwort = (u: NormalisierungUebung): TabellenAntwort => ({
  editor: 'normalform',
  schritte: u.loesung.map((s) => ({ titel: s.titel, text: s.text, tabellen: tabellenDesSchritts(s) })),
});

describe('Import', () => {
  it('alle Übungen kommen ohne Meldung an, beide Quellen sind vertreten', () => {
    expect(content.issues.filter((i) => /Normalisierung_Uebungen/.test(i.file))).toEqual([]);
    expect(alle.length).toBeGreaterThanOrEqual(8);
    expect(alle.filter((u) => u.quelle === 'tabelle').length).toBeGreaterThanOrEqual(5);
    expect(alle.filter((u) => u.quelle === 'text').length).toBeGreaterThanOrEqual(3);
    expect(new Set(alle.map((u) => u.id)).size).toBe(alle.length);
    for (const u of alle) {
      expect(u.aufgabe, u.id).toMatch(/\*(Überführen|Erstellen)\* Sie/);
      expect(u.aufgabe, u.id).toMatch(/3\. Normalform/);
      // Aus Tabelle: Schritt für Schritt bis zur 3. NF; aus Text: direkt das Endschema.
      expect(
        u.loesung.map((s) => s.titel),
        u.id,
      ).toEqual(u.quelle === 'tabelle' ? ['1. NF', '2. NF', '3. NF'] : ['3. NF']);
    }
  });

  it('fehlerhafte Übungen werden übersprungen und gemeldet', () => {
    const roh = (u: object) => JSON.stringify({ uebungen: [u] });
    const basis = { id: 'NF-900', titel: 'T', stufe: 1, quelle: 'text', aufgabe: '*Erstellen* Sie …' };
    const schritt = (tabellen: string[]) => [{ titel: '3. NF', text: 'x', tabellen }];
    expect(parseNormalisierungUebungen('f', roh({ ...basis, loesung: schritt(['a(**x**)', 'b(**y**, z↑)']) })).issues[0].message).toMatch(
      /z findet keine Tabelle/,
    );
    expect(parseNormalisierungUebungen('f', roh({ ...basis, loesung: schritt(['a(x, y)']) })).issues[0].message).toMatch(
      /ohne Primärschlüssel/,
    );
    expect(
      parseNormalisierungUebungen('f', roh({ ...basis, quelle: 'tabelle', loesung: schritt(['a(**x**)']) })).issues[0].message,
    ).toMatch(/Ausgangstabelle/);
    expect(parseNormalisierungUebungen('f', roh({ ...basis, loesung: schritt(['a(**x**)']) })).uebungen).toHaveLength(1);
  });

  it('Relationenschreibweise: Fett über mehrere Spalten, FK mit ↑', () => {
    expect(leseRelation('pos(**a↑, b↑**, c, d↑)')).toEqual({
      name: 'pos',
      spalten: [
        { name: 'a', pk: true, fk: true },
        { name: 'b', pk: true, fk: true },
        { name: 'c', pk: false, fk: false },
        { name: 'd', pk: false, fk: true },
      ],
    });
    expect(leseRelation('kaputt(**a, b)')).toBeUndefined();
    expect(leseRelation('zwei woerter(a)')).toBeUndefined();
  });
});

describe('Prüfung', () => {
  it('jede Musterlösung besteht ihre eigene Prüfung', () => {
    for (const u of alle) expect(pruefeNfAntwort(u, alsAntwort(u)).ok, u.id).toBe(true);
  });

  it('Tabellennamen, Spaltenreihenfolge und Großschreibung sind frei', () => {
    const u = uebung('NF-002');
    const a = alsAntwort(u);
    for (const s of a.schritte)
      s.tabellen = s.tabellen.map((t, i) => ({
        ...t,
        name: `Tabelle${i}`,
        spalten: [...t.spalten].reverse().map((x) => ({ ...x, name: x.name.toUpperCase() })),
      }));
    expect(pruefeNfAntwort(u, a).ok).toBe(true);
  });

  it('typische Fehler fallen auf', () => {
    const u = uebung('NF-004');
    // Nur die Ausgangstabelle übernommen: Schritt 1 ohne Schlüssel, Schritte 2 und 3 leer.
    const nurAusgang = leereNfAntwort(u);
    nurAusgang.schritte[0].tabellen = [{ id: 't1', name: 'einkauf', spalten: u.ausgang!.kopf.map((name) => ({ name })), zeilen: [] }];
    const p = pruefeNfAntwort(u, nurAusgang);
    expect(p.ok).toBe(false);
    expect(p.schritte[0].abgleich.zeilen[0].pkOk).toBe(false);
    expect(p.schritte[1].leer).toBe(true);

    // 3. NF: Einkaufspreis beim Artikel statt in der Bestellposition, FK nicht markiert.
    const a = alsAntwort(u);
    const ende = a.schritte[2].tabellen;
    const artikel = ende.find((t) => t.name === 'artikel')!;
    const position = ende.find((t) => t.name === 'bestellposition')!;
    artikel.spalten.push({ name: 'einkaufspreis' });
    position.spalten = position.spalten.filter((x) => x.name !== 'einkaufspreis');
    ende.find((t) => t.name === 'bestellung')!.spalten.find((x) => x.name === 'lieferanten_nr')!.fk = false;
    const q = pruefeNfAntwort(u, a).schritte[2];
    expect(q.ok).toBe(false);
    const zeile = (name: string) => q.abgleich.zeilen.find((z) => z.muster.name === name)!;
    expect(zeile('artikel').zusaetzlich).toEqual(['einkaufspreis']);
    expect(zeile('bestellposition').fehlend).toEqual(['einkaufspreis']);
    expect(zeile('bestellung').fkFehlt).toEqual(['lieferanten_nr']);
  });

  it('ein falsch gewähltes FK-Ziel fällt auf, ein ausdrücklich erlaubtes nicht', () => {
    const u = uebung('NF-008');
    const a = alsAntwort(u);
    expect(a.schritte[0].tabellen.find((t) => t.name === 'projekt')!.spalten.find((x) => x.name === 'projektleiter_nr')!.ziel).toBe(
      'mitarbeiter',
    );
    expect(pruefeNfAntwort(u, a).ok).toBe(true);
    a.schritte[0].tabellen.find((t) => t.name === 'zeitbuchung')!.spalten.find((x) => x.name === 'projekt_nr')!.ziel = 'abteilung';
    const p = pruefeNfAntwort(u, a);
    expect(p.ok).toBe(false);
    expect(p.schritte[0].fk[0].meldung).toMatch(/projekt_nr verweist auf „abteilung“/);
  });

  it('Entwurf: gespeicherte Antwort wird an die Schritte angepasst, Unlesbares ergibt einen leeren Editor', () => {
    const u = uebung('NF-001');
    const a = alsAntwort(u);
    expect(leseNfAntwort(u, JSON.stringify(a)).schritte[2].tabellen).toHaveLength(2);
    expect(leseNfAntwort(u, 'kein json')).toEqual(leereNfAntwort(u));
    expect(leseNfAntwort(u, JSON.stringify({ ...a, schritte: a.schritte.slice(0, 1) })).schritte).toHaveLength(3);
  });
});

describe('Beziehungsdiagramm', () => {
  it('zeichnet für jeden Fremdschlüssel der Musterlösungen eine Linie', () => {
    for (const u of alle)
      for (const s of u.loesung) {
        const tabellen = tabellenDesSchritts(s);
        const fks = tabellen.flatMap((t) => t.spalten.filter((x) => x.fk)).length;
        const l = schemaLayout(tabellen);
        expect(l.linien, `${u.id} ${s.titel}`).toHaveLength(fks);
        expect(l.kaesten).toHaveLength(tabellen.length);
        // Kästen überlappen sich nicht.
        for (const [i, k] of l.kaesten.entries())
          for (const m of l.kaesten.slice(i + 1))
            expect(k.x + k.w <= m.x || m.x + m.w <= k.x || k.y + k.h <= m.y || m.y + m.h <= k.y, `${u.id}: ${k.name}/${m.name}`).toBe(true);
      }
  });

  it('FK-Ziel: gleichnamiger Primärschlüssel, einteiliger Schlüssel bevorzugt, sonst ausdrücklich', () => {
    const t = (name: string, spalten: [string, boolean][]) => ({ name, spalten: spalten.map(([n, pk]) => ({ name: n, pk })) });
    const kunde = t('kunde', [['kunden_nr', true]]);
    const bewertung = t('bewertung', [
      ['kunden_nr', true],
      ['artikel_nr', true],
    ]);
    const projekt = t('projekt', [
      ['projekt_nr', true],
      ['leiter_nr', false],
    ]);
    const alleT = [bewertung, kunde, projekt];
    expect(fkZiel(alleT, projekt, 'kunden_nr')).toBe(kunde);
    expect(fkZiel(alleT, projekt, 'leiter_nr')).toBeUndefined();
    expect(fkZiel(alleT, projekt, 'leiter_nr', 'kunde')).toBe(kunde);
  });
});

describe('Zeichenfläche', () => {
  const basis = () => [
    {
      id: 't1',
      name: 'lagerbestand',
      spalten: [{ name: 'lager_nr', pk: true }, { name: 'lagerort' }, { name: 'bestand' }],
      zeilen: [['L1', 'Kiel', '3']],
      x: 20,
      y: 20,
    },
  ];

  it('Spalte auf die freie Fläche ziehen: neue Tabelle, Daten wandern mit', () => {
    const t = verschiebeSpalte(basis(), [], 't1', 1, { x: 401, y: 58 });
    expect(t).toHaveLength(2);
    expect(t[0].spalten.map((s) => s.name)).toEqual(['lager_nr', 'bestand']);
    expect(t[0].zeilen).toEqual([['L1', '3']]);
    expect(t[1]).toMatchObject({ id: 't2', spalten: [{ name: 'lagerort' }], x: 400, y: 60 });
  });

  it('Fremdschlüssel ziehen und Tabelle umbenennen', () => {
    let t = verschiebeSpalte(basis(), [], 't1', 1, { x: 400, y: 20 });
    t = t.map((x) => (x.id === 't2' ? { ...x, name: 'lager', spalten: [{ name: 'lager_nr', pk: true }, ...x.spalten] } : x));
    t = verbinde(t, 't1', 0, 't2');
    expect(t[0].spalten[0]).toMatchObject({ fk: true, ziel: 'lager' });
    expect(zeichnerLinien(t)).toHaveLength(1);
    t = benenneUm(t, 't2', 'lagerort_tabelle');
    expect(t[0].spalten[0].ziel).toBe('lagerort_tabelle');
    expect(zeichnerLinien(t)).toHaveLength(1);
  });

  it('Musterlösungen: alle Kästen platziert, keine Überlappung, eine Linie je Fremdschlüssel', () => {
    for (const u of alle) {
      const tabellen = mitLage(tabellenDesSchritts(u.loesung[u.loesung.length - 1]));
      for (const [i, a] of tabellen.entries()) {
        expect(a.x, `${u.id} ${a.name}`).toBeTypeOf('number');
        for (const b of tabellen.slice(i + 1)) {
          const getrennt =
            a.x! + kastenBreite(a) <= b.x! ||
            b.x! + kastenBreite(b) <= a.x! ||
            a.y! + kastenHoehe(a) <= b.y! ||
            b.y! + kastenHoehe(b) <= a.y!;
          expect(getrennt, `${u.id}: ${a.name}/${b.name}`).toBe(true);
        }
      }
      const fks = tabellen.flatMap((t) => t.spalten.filter((s) => s.fk)).length;
      expect(zeichnerLinien(tabellen), u.id).toHaveLength(fks);
    }
  });

  it('platzierte Tabellen bleiben, neue kommen darunter', () => {
    const t = mitLage([...basis(), { id: 't2', name: 'neu', spalten: [{ name: 'a' }], zeilen: [] }]);
    expect(t[0]).toMatchObject({ x: 20, y: 20 });
    expect(t[1].y).toBeGreaterThanOrEqual(20 + kastenHoehe(t[0]));
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
            createElement(Route, { path: '/normalisierung', element: createElement(NormalisierungUebungen) }),
            createElement(Route, { path: '/normalisierung/:id', element: createElement(NormalisierungUebung) }),
          ),
        ),
      ),
    );

  it('Liste zeigt alle Übungen', () => {
    const html = seite('/normalisierung');
    for (const u of alle) expect(html).toContain(u.id);
  });

  it('Übung aus Tabelle: Ausgangstabelle, Schritte und Übernahme-Knopf', () => {
    const html = seite('/normalisierung/NF-003');
    expect(html).toContain('Ausgangstabelle „schulungen“');
    expect(html).toContain('P101 Kraus (bestanden); P103 Schulz (bestanden)');
    for (const s of ['1. NF', '2. NF', '3. NF']) expect(html).toContain(s);
    expect(html).toContain('übernehmen');
    // Die Lösung steht erst nach „Lösung zeigen“ da.
    expect(html).not.toContain('trainer(');
  });

  it('Übung aus Text: ein Schritt, keine Ausgangstabelle', () => {
    const html = seite('/normalisierung/NF-006');
    expect(html).toContain('Fahrtenbuch');
    expect(html).not.toContain('Ausgangstabelle „');
  });
});
