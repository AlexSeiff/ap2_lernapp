// JSON-Übungen: strenger Parser mit deutschen Hinweisen, Regeln gegen den gelesenen Wert, Import mit Prüfung, die Übungen selbst,
// Fortschritt (Version 10) und die Seiten.

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { mergeProgress } from '../domain/mergeProgress';
import { emptyProgress, migrateProgress, ProgressSchema } from '../domain/progress';
import {
  beschreibeRegel,
  parseJsonUebungen,
  pfadTeile,
  pruefeJsonAntwort,
  pruefeJsonSyntax,
  pruefeRegel,
  wertAm,
  zeileSpalte,
  type JsonRegel,
} from '../domain/jsonUebungen';
import { ConfirmContext } from '../src/hooks/useConfirm';
import { jsonStatus, jsonSummary, jsonUebungen, recordJsonCheck, recordJsonHint, recordJsonLoesung } from '../src/lib/jsonUebungen';

const content = loadContent(CONTENT_DIR);

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, firstVisit: false }),
}));
const { JsonUebungen } = await import('../src/pages/JsonUebungen');
const { JsonUebung } = await import('../src/pages/JsonUebung');

/** Fehlermeldung eines absichtlich kaputten Dokuments. */
const fehler = (text: string) => {
  const r = pruefeJsonSyntax(text);
  if (r.ok) throw new Error(`unerwartet gültig: ${text}`);
  return r.fehler;
};

describe('Syntax: gültiges JSON', () => {
  it('liest alle Wertarten', () => {
    const r = pruefeJsonSyntax('{"a": 1, "b": [true, false, null], "c": {"d": "x\\ny"}, "e": -2.5e3, "f": ""}');
    expect(r).toEqual({ ok: true, wert: { a: 1, b: [true, false, null], c: { d: 'x\ny' }, e: -2500, f: '' } });
    expect(pruefeJsonSyntax('[]')).toEqual({ ok: true, wert: [] });
    expect(pruefeJsonSyntax('  {}  ')).toEqual({ ok: true, wert: {} });
    expect(pruefeJsonSyntax('"nur ein Text"')).toEqual({ ok: true, wert: 'nur ein Text' });
    expect(pruefeJsonSyntax('0')).toEqual({ ok: true, wert: 0 });
  });

  it('entspricht JSON.parse bei gültigen Dokumenten', () => {
    for (const t of ['{"a":[1,2,{"b":null}],"c":"\\u00e4\\"x"}', '[1, 2.0, -0, 1e2, 1E-2]', '{"k":"v"}\n']) {
      expect(pruefeJsonSyntax(t)).toEqual({ ok: true, wert: JSON.parse(t) });
    }
  });
});

describe('Syntax: typische Fehler mit Hinweis, Zeile und Spalte', () => {
  it('leere Eingabe', () => {
    expect(fehler('').meldung).toContain('Noch nichts');
    expect(fehler('  \n ').meldung).toContain('Noch nichts');
  });

  it('einfache Anführungszeichen (Schlüssel und Wert)', () => {
    const f = fehler("{\n  'id': 101\n}");
    expect(f).toMatchObject({ zeile: 2, spalte: 3 });
    expect(f.meldung).toContain('Einfache Anführungszeichen');
    expect(fehler('{"a": \'x\'}').meldung).toContain('Einfache Anführungszeichen');
  });

  it('Komma am Ende von Objekt und Liste', () => {
    const o = fehler('{"a": 1,}');
    expect(o.meldung).toContain('kein Komma');
    expect(o).toMatchObject({ zeile: 1, spalte: 8 });
    expect(fehler('[1, 2,]').meldung).toContain('kein Komma');
  });

  it('fehlendes Komma zwischen Einträgen und Elementen', () => {
    expect(fehler('{"a": 1 "b": 2}').meldung).toContain('Komma');
    expect(fehler('[1 2]').meldung).toContain('Komma');
    expect(fehler('{"a": [1]\n"b": 2}')).toMatchObject({ zeile: 2, spalte: 1 });
  });

  it('Schlüssel ohne Anführungszeichen', () => {
    expect(fehler('{name: "x"}').meldung).toContain('doppelten Anführungszeichen');
  });

  it('Dezimalkomma in einem Objekt', () => {
    const f = fehler('{"preis": 1,5, "menge": 2}');
    expect(f.meldung).toContain('Dezimalpunkt');
  });

  it('Zahlenformate', () => {
    expect(fehler('[01]').meldung).toContain('0 beginnen');
    expect(fehler('[1.]').meldung).toContain('Dezimalpunkt');
    expect(fehler('[+1]').meldung).toContain('nicht mit „+“');
    expect(fehler('[.5]').meldung).toContain('nicht mit „.“');
    expect(fehler('[-]').meldung).toContain('Minuszeichen');
    expect(fehler('[1e]').meldung).toContain('Exponenten');
  });

  it('Schlüsselwörter: Groß-/Kleinschreibung, undefined, NaN, Wörter ohne Anführungszeichen', () => {
    expect(fehler('{"a": True}').meldung).toContain('klein geschrieben');
    expect(fehler('{"a": undefined}').meldung).toContain('gibt es in JSON nicht');
    expect(fehler('{"a": NaN}').meldung).toContain('gibt es in JSON nicht');
    expect(fehler('{"a": Hannover}').meldung).toContain('doppelten Anführungszeichen');
  });

  it('Kommentare, falsche Doppelpunkte, nicht geschlossene Texte und Klammern', () => {
    expect(fehler('{"a": 1 // Kommentar\n}').meldung).toContain('Komma'); // „/“ gilt als Beginn eines weiteren Werts nicht
    expect(fehler('// Kopf\n{}').meldung).toContain('Kommentare');
    expect(fehler('{"a" 1}').meldung).toContain('Doppelpunkt');
    expect(fehler('{"a": "offen}').meldung).toMatch(/Zeilenumbruch|nicht geschlossen/);
    expect(fehler('{"a": "offen').meldung).toContain('nicht geschlossen');
    expect(fehler('{"a": 1').meldung).toContain('} fehlt');
    expect(fehler('[1, 2').meldung).toContain('] fehlt');
    expect(fehler('{"a": ').meldung).toContain('endet zu früh');
  });

  it('Escape-Folgen und Steuerzeichen', () => {
    expect(fehler('"a\\xb"').meldung).toContain('Escape');
    expect(fehler('"\\u12"').meldung).toContain('Hexadezimal');
    expect(fehler('"a\tb"').meldung).toContain('Steuerzeichen');
  });

  it('Text nach dem Dokument', () => {
    expect(fehler('{"a": 1} {"b": 2}').meldung).toContain('steht noch Text');
    expect(fehler('{"a": 1}\n[2]')).toMatchObject({ zeile: 2, spalte: 1 });
  });

  it('jede Meldung hat eine plausible Stelle und der Parser stimmt mit JSON.parse überein (gültig ⇔ gültig)', () => {
    const faelle = ["{'a':1}", '{"a":1,}', '[1,]', '{a:1}', '{"a":01}', '[1 2]', '{"a":}', '{', '', '"x', 'tru', '{"a":1}}'];
    for (const t of faelle) {
      const eigen = pruefeJsonSyntax(t);
      let nativ = true;
      try {
        JSON.parse(t);
      } catch {
        nativ = false;
      }
      expect(eigen.ok, t).toBe(nativ);
      if (!eigen.ok) {
        expect(eigen.fehler.zeile).toBeGreaterThanOrEqual(1);
        expect(eigen.fehler.spalte).toBeGreaterThanOrEqual(1);
        expect(eigen.fehler.stelle).toBeLessThanOrEqual(t.length);
      }
    }
  });

  it('zeileSpalte zählt ab 1', () => {
    expect(zeileSpalte('abc', 0)).toEqual({ zeile: 1, spalte: 1 });
    expect(zeileSpalte('a\nbc', 3)).toEqual({ zeile: 2, spalte: 2 });
    expect(zeileSpalte('a', 99)).toEqual({ zeile: 1, spalte: 2 });
  });
});

describe('Pfade und Regeln', () => {
  const doc = {
    kunde: { name: 'Meier', plz: '30159' },
    positionen: [
      { artikel: 'A', menge: 2 },
      { artikel: 'B', menge: 3 },
    ],
    aktiv: true,
    x: null,
  };

  it('Pfade zerlegen und auflösen', () => {
    expect(pfadTeile('')).toEqual([]);
    expect(pfadTeile('kunde.name')).toEqual(['kunde', 'name']);
    expect(pfadTeile('positionen[1].menge')).toEqual(['positionen', 1, 'menge']);
    expect(pfadTeile('[0]')).toEqual([0]);
    expect(pfadTeile('a..b')).toBeUndefined();
    expect(pfadTeile('a[')).toBeUndefined();
    expect(wertAm(doc, 'kunde.plz')).toEqual({ gefunden: true, wert: '30159' });
    expect(wertAm(doc, 'positionen[1].artikel')).toEqual({ gefunden: true, wert: 'B' });
    expect(wertAm(doc, 'x')).toEqual({ gefunden: true, wert: null });
    expect(wertAm(doc, 'positionen[2]').gefunden).toBe(false);
    expect(wertAm(doc, 'kunde.fehlt').gefunden).toBe(false);
    expect(wertAm(doc, 'aktiv.name').gefunden).toBe(false);
    expect(wertAm(doc, 'toString').gefunden).toBe(false);
  });

  const r = (regel: JsonRegel) => pruefeRegel(doc, regel);

  it('Wert: Typ und Inhalt müssen stimmen', () => {
    expect(r({ pfad: 'aktiv', wert: true }).ok).toBe(true);
    expect(r({ pfad: 'kunde.plz', wert: '30159' }).ok).toBe(true);
    expect(r({ pfad: 'kunde.plz', wert: 30159 }).ok).toBe(false);
    const f = r({ pfad: 'aktiv', wert: 'true' });
    expect(f.ok).toBe(false);
    expect(f.meldung).toContain('falschen Typ');
    expect(r({ pfad: 'x', wert: null }).ok).toBe(true);
    expect(r({ pfad: 'kunde.name', wert: 'Müller' }).meldung).toContain('verlangt ist „Müller“');
    expect(r({ pfad: 'positionen[0].menge', wert: 2 }).ok).toBe(true);
  });

  it('Zahlen: Dezimalstellen mit Toleranz', () => {
    expect(pruefeRegel({ p: 0.1 + 0.2 }, { pfad: 'p', wert: 0.3 }).ok).toBe(true);
    expect(pruefeRegel({ p: 0.31 }, { pfad: 'p', wert: 0.3 }).ok).toBe(false);
  });

  it('Typ, Länge, Schlüssel, fehlt', () => {
    expect(r({ pfad: 'positionen', typ: 'array' }).ok).toBe(true);
    expect(r({ pfad: 'positionen', typ: 'object' }).meldung).toContain('muss ein Objekt sein, ist aber eine Liste');
    expect(r({ pfad: 'positionen', laenge: 2 }).ok).toBe(true);
    expect(r({ pfad: 'positionen', laenge: 3 }).meldung).toContain('2 statt 3 Elemente');
    expect(r({ pfad: 'aktiv', laenge: 1 }).meldung).toContain('keine Länge');
    expect(r({ pfad: 'kunde', schluessel: ['name', 'plz'] }).ok).toBe(true);
    expect(r({ pfad: 'kunde', schluessel: ['name', 'ort'] }).meldung).toContain('„ort“');
    expect(r({ pfad: 'kunde.ort', fehlt: true }).ok).toBe(true);
    expect(r({ pfad: 'kunde.name', fehlt: true }).ok).toBe(false);
  });

  it('fehlender Pfad und eigener Hinweis', () => {
    expect(r({ pfad: 'kunde.ort', wert: 'x' }).meldung).toContain('fehlt');
    expect(r({ pfad: 'kunde.ort', wert: 'x', hinweis: 'Ort ergänzen' }).meldung).toBe('Ort ergänzen');
  });

  it('beschreibeRegel nennt, was verlangt wird', () => {
    expect(beschreibeRegel({ pfad: 'aktiv', wert: true })).toBe('„aktiv“ ist der Wert true');
    expect(beschreibeRegel({ pfad: 'kunde.name', wert: 'Meier' })).toBe('„kunde.name“ ist der Text „Meier“');
    expect(beschreibeRegel({ pfad: 'preis', wert: 0.12 })).toBe('„preis“ ist die Zahl 0.12');
    expect(beschreibeRegel({ pfad: 'x', wert: null })).toBe('„x“ ist null');
    expect(beschreibeRegel({ pfad: '', typ: 'array' })).toBe('das Dokument ist eine Liste');
    expect(beschreibeRegel({ pfad: 'liste', laenge: 2 })).toBe('„liste“ hat die Länge 2');
    expect(beschreibeRegel({ pfad: 'a', fehlt: true })).toBe('„a“ kommt nicht vor');
  });

  it('pruefeJsonAntwort: Syntaxfehler hat Vorrang, sonst alle Regeln', () => {
    const regeln: JsonRegel[] = [
      { pfad: 'a', wert: 1 },
      { pfad: 'b', typ: 'array' },
    ];
    const kaputt = pruefeJsonAntwort('{"a": 1,}', regeln);
    expect(kaputt.ok).toBe(false);
    expect(kaputt.regeln).toEqual([]);
    const teils = pruefeJsonAntwort('{"a": 1, "b": 5}', regeln);
    expect(teils.ok).toBe(false);
    expect(teils.regeln.map((x) => x.ok)).toEqual([true, false]);
    expect(pruefeJsonAntwort('{"b": [], "a": 1}', regeln).ok).toBe(true); // Reihenfolge egal
  });
});

describe('Import', () => {
  const gut = {
    id: 'J-1',
    titel: 'Test',
    stufe: 1,
    aufgabe: 'Schreiben Sie {"a": 1}.',
    loesung: '{"a": 1}',
    pruefungen: [{ pfad: 'a', wert: 1 }],
  };
  const lade = (...uebungen: unknown[]) => parseJsonUebungen('test.json', JSON.stringify({ uebungen }));

  it('übernimmt eine gültige Übung (mit Standardwerten)', () => {
    const r = lade(gut);
    expect(r.issues).toEqual([]);
    expect(r.uebungen).toEqual([{ ...gut, hinweise: [], tags: [] }]);
  });

  it('meldet und überspringt: Schemafehler, Syntax der Datei, doppelte ID', () => {
    expect(parseJsonUebungen('x.json', 'kein json').issues[0].message).toContain('Kein gültiges JSON');
    expect(parseJsonUebungen('x.json', '{}').issues[0].message).toContain('„uebungen“ fehlt');
    const r = lade(gut, { ...gut, id: 'J-2', stufe: 4 }, { ...gut }, { ...gut, id: 'J-4', pruefungen: [{ pfad: 'a' }] });
    expect(r.uebungen.map((u) => u.id)).toEqual(['J-1']);
    expect(r.issues).toHaveLength(3);
    expect(r.issues.map((i) => i.message).join('\n')).toContain('J-2 übersprungen');
    expect(r.issues.map((i) => i.message).join('\n')).toContain('ID doppelt');
    expect(r.issues.every((i) => i.file === 'test.json')).toBe(true);
  });

  it('die Musterlösung muss gültiges JSON sein und die eigenen Regeln erfüllen', () => {
    const kaputt = lade({ ...gut, loesung: '{"a": 1,}' });
    expect(kaputt.uebungen).toEqual([]);
    expect(kaputt.issues[0].message).toContain('kein gültiges JSON');
    const falsch = lade({ ...gut, loesung: '{"a": 2}' });
    expect(falsch.uebungen).toEqual([]);
    expect(falsch.issues[0].message).toContain('erfüllt die Regel nicht');
    const pfad = lade({ ...gut, pruefungen: [{ pfad: 'a..b', wert: 1 }] });
    expect(pfad.issues[0].message).toContain('ungültig');
  });

  it('eine Vorgabe, die schon alles erfüllt, ist ein Inhaltsfehler', () => {
    expect(lade({ ...gut, vorgabe: '{"a": 1}' }).issues[0].message).toContain('nichts zu tun');
    expect(lade({ ...gut, vorgabe: '{"a": 2}' }).issues).toEqual([]);
  });
});

describe('Die Übungen im Inhalt', () => {
  const alle = jsonUebungen(content);

  it('werden ohne Hinweise importiert', () => {
    expect(content.issues.filter((i) => /JSON/.test(i.message))).toEqual([]);
    expect(alle.length).toBeGreaterThanOrEqual(10);
    expect(new Set(alle.map((u) => u.id)).size).toBe(alle.length);
  });

  it('jede Musterlösung besteht ihre Prüfung, jede Vorgabe nicht', () => {
    for (const u of alle) {
      expect(pruefeJsonAntwort(u.loesung, u.pruefungen).ok, u.id).toBe(true);
      if (u.vorgabe) expect(pruefeJsonAntwort(u.vorgabe, u.pruefungen).ok, u.id).toBe(false);
    }
  });

  it('eine leere Eingabe besteht nie; Reihenfolge der Schlüssel und Einrückung sind frei', () => {
    for (const u of alle) {
      expect(pruefeJsonAntwort('', u.pruefungen).ok, u.id).toBe(false);
      const wert = JSON.parse(u.loesung) as unknown;
      const kompakt = JSON.stringify(wert);
      const umgekehrt = JSON.stringify(wert, (_k, v: unknown) =>
        v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).reverse()) : v,
      );
      expect(pruefeJsonAntwort(kompakt, u.pruefungen).ok, `${u.id} kompakt`).toBe(true);
      expect(pruefeJsonAntwort(umgekehrt, u.pruefungen).ok, `${u.id} umgekehrt`).toBe(true);
    }
  });

  it('Stufen 1 bis 3 sind vertreten; Aufgaben nennen einen Operator in Kursivschrift', () => {
    expect(new Set(alle.map((u) => u.stufe))).toEqual(new Set([1, 2, 3]));
    for (const u of alle) expect(u.aufgabe, u.id).toMatch(/\*[A-ZÄÖÜ][a-zäöüß]+\*/);
  });
});

describe('Fortschritt', () => {
  const T = '2026-11-19';

  it('Prüfen zählt, ohne vorherige Lösung gilt es beim ersten Treffer als gelöst', () => {
    let p = recordJsonCheck(emptyProgress(), 'J-1', false, T);
    expect(p.json['J-1']).toMatchObject({ attempts: 1, zuletztRichtig: false, lastCheckedAt: T });
    expect(p.json['J-1'].solvedAt).toBeUndefined();
    expect(jsonStatus(p.json['J-1'], T)).toBe('offen'); // die Wiederholung ist erst morgen fällig
    p = recordJsonCheck(p, 'J-1', true, T);
    expect(p.json['J-1']).toMatchObject({ attempts: 2, solvedAt: T, zuletztRichtig: true });
  });

  it('mit angesehener Lösung zählt ein späterer Treffer nicht als gelöst', () => {
    let p = recordJsonLoesung(emptyProgress(), 'J-1', T);
    expect(jsonStatus(p.json['J-1'], T)).toBe('mit-loesung');
    p = recordJsonCheck(p, 'J-1', true, T);
    expect(p.json['J-1'].solvedAt).toBeUndefined();
  });

  it('Hinweise werden gezählt', () => {
    const p = recordJsonHint(recordJsonHint(emptyProgress(), 'J-1'), 'J-1');
    expect(p.json['J-1']).toMatchObject({ hintsUsed: 2, attempts: 0 });
  });

  it('Status und Summe', () => {
    expect(jsonStatus(undefined, T)).toBe('offen');
    let p = recordJsonCheck(emptyProgress(), 'J-1', true, T);
    expect(jsonStatus(p.json['J-1'], T)).toBe('geloest');
    p = recordJsonCheck(p, 'J-2', false, T);
    expect(jsonSummary(p, ['J-1', 'J-2', 'J-3'], T)).toMatchObject({ solved: 1, total: 3 });
  });

  it('Schema, Migration und Zusammenführen', () => {
    const p = recordJsonCheck(emptyProgress(), 'J-1', true, T);
    expect(ProgressSchema.safeParse(p).success).toBe(true);
    expect(migrateProgress({ ...p, json: { 'J-1': p.json['J-1'], kaputt: 'x' } }).json).toEqual({ 'J-1': p.json['J-1'] });
    expect(migrateProgress({ version: 9, attempts: [] }).json).toEqual({});
    const dort = recordJsonCheck(emptyProgress(), 'J-1', false, '2026-11-20');
    expect(mergeProgress(p, dort).json['J-1'].lastCheckedAt).toBe('2026-11-20'); // neuerer Stand
    expect(mergeProgress(p, dort).json['J-1'].solvedAt).toBe(T); // gelöst bleibt gelöst
  });
});

describe('Seiten', () => {
  const seite = (pfad: string) =>
    // React setzt zwischen Textteilen <!-- --> ein; für die Vergleiche weglassen
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
            createElement(Route, { path: '/json', element: createElement(JsonUebungen) }),
            createElement(Route, { path: '/json/:id', element: createElement(JsonUebung) }),
          ),
        ),
      ),
    ).replace(/<!-- -->/g, '');

  it('Liste: alle Übungen mit Status und Stufe', () => {
    const h = seite('/json');
    expect(h).toContain('JSON-Übungen');
    expect(h).toContain('JSON-001');
    expect(h).toContain('0 / 12 gelöst');
    expect(h).toContain('Nächste offene');
  });

  it('Übung: Aufgabe, Eingabefeld, Prüfen; eine Vorgabe steht im Feld und zeigt ihren ersten Fehler', () => {
    const h = seite('/json/JSON-001');
    expect(h).toContain('Ein Kunde als Objekt');
    expect(h).toContain('<textarea');
    expect(h).toContain('Prüfen');
    expect(h).toContain('Schreib dein JSON');
    const k = seite('/json/JSON-011');
    expect(k).toContain('Zeile 2, Spalte 3');
    expect(k).toContain('Einfache Anführungszeichen');
  });

  it('unbekannte Übung: freundliche Meldung mit Link zurück', () => {
    const h = seite('/json/GIBT-ES-NICHT');
    expect(h).toContain('Übung nicht gefunden');
    expect(h).toContain('href="/json"');
  });
});
