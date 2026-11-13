import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Inhaltsseite, Kopfzeile, Register } from '../src/components/Buch';
import { aktiverBereich, aktivesUnterziel, badgeSumme, bereich, BEREICHE, GLOSSAR_PFAD, passtZuZiel } from '../src/lib/navigation';

// Navigation: vier Bereiche mit Unterzielen. Im Notizbuch stehen sie als Haftstreifen am Buchrand (Handy: unten), die Unterziele im
// Inhaltsverzeichnis auf der linken Seite (components/Buch.tsx).

const ohneTrenner = (html: string) => html.replace(/<!-- -->/g, '');

describe('Bereiche', () => {
  it('ordnet jeden Pfad dem richtigen Bereich zu', () => {
    const erwartet: Record<string, string | undefined> = {
      '/': undefined,
      '/gibtsnicht': undefined,
      '/heute': 'lernen',
      '/lernen': 'lernen',
      '/lernen/03': 'lernen',
      '/karteikarten': 'lernen',
      '/aufgaben': 'lernen',
      '/aufgabe/03-A1': 'lernen',
      '/rechnen': 'lernen',
      '/rechnen/RE-ST1-001': 'lernen',
      '/klausur': 'lernen',
      '/klausur/03': 'lernen',
      '/fehlerjournal': 'lernen',
      [GLOSSAR_PFAD]: 'glossar',
      '/material/glossar': 'glossar',
      '/glossar': 'glossar',
      '/glossar/sequnzdiagramm': 'glossar',
      '/material/formeln': 'glossar',
      '/material/sql-belegsatz': 'glossar',
      '/material/operatoren': 'glossar',
      '/sql': 'sql',
      '/sql/uebungen': 'sql',
      '/sql/uebung/SQL-MH-001': 'sql',
      '/einstellungen': 'einstellungen',
      '/material': 'einstellungen',
      '/material/lernzettel': 'einstellungen',
      '/daten': 'einstellungen',
    };
    for (const [pfad, b] of Object.entries(erwartet)) expect(aktiverBereich(pfad), pfad).toBe(b);
  });

  it('jedes Unterziel gehört zu seinem eigenen Bereich (keine Ziele, die woanders hervorgehoben würden)', () => {
    for (const b of BEREICHE) for (const z of b.unter) expect(aktiverBereich(z.to), z.to).toBe(b.id);
    for (const b of BEREICHE) expect(aktiverBereich(b.to), b.to).toBe(b.id);
  });

  it('hebt das passende Unterziel hervor – das längste passende, mit Sonderfällen', () => {
    const ziel = (pfad: string) => aktivesUnterziel(pfad, bereich(aktiverBereich(pfad)!))?.label;
    expect(ziel('/lernen')).toBe('Themen');
    expect(ziel('/lernen/06')).toBe('Themen');
    expect(ziel(GLOSSAR_PFAD)).toBe('Diagramme');
    expect(ziel('/aufgabe/01-A1')).toBe('Einzelaufgaben');
    expect(ziel('/klausur/mix-gemischt-5')).toBe('Übungsklausur');
    expect(ziel('/sql')).toBe('Freier Editor');
    expect(ziel('/sql/uebungen')).toBe('Übungen');
    expect(ziel('/sql/uebung/SQL-MH-001')).toBe('Übungen');
    expect(ziel('/material')).toBe('Material');
    expect(ziel('/material/lernzettel')).toBe('Material');
    expect(ziel('/glossar')).toBe('Begriffe A–Z');
    expect(ziel('/glossar/sequnzdiagramm')).toBe('Begriffe A–Z');
    expect(ziel('/daten')).toBe('Daten & Import');
  });

  it('passtZuZiel: Präfix nur an Pfadgrenzen', () => {
    expect(passtZuZiel('/sql', '/sqlx')).toBe(false);
    expect(passtZuZiel('/', '/lernen')).toBe(false);
    expect(passtZuZiel('/sql/uebungen', '/sql/uebung/X')).toBe(true);
  });

  it('keine KI-Aufgaben im Menü; Badges = Summe der fälligen Einträge eines Bereichs', () => {
    expect(bereich('einstellungen').unter.map((z) => z.to)).not.toContain('/generator');
    const badges = { sql: 2, rechnen: 3, diagramme: 5, journal: 4 };
    expect(badgeSumme(bereich('lernen').unter, badges)).toBe(12);
    expect(badgeSumme(bereich('sql').unter, badges)).toBe(2);
    expect(badgeSumme(bereich('glossar').unter, badges)).toBe(0);
  });
});

describe('Komponenten', () => {
  const badges = { sql: 2, rechnen: 0, diagramme: 0, journal: 1 };
  const render = (pfad: string, kind: ReturnType<typeof createElement>) =>
    ohneTrenner(renderToString(createElement(MemoryRouter, { initialEntries: [pfad] }, kind)));

  it('Haftstreifen: Übersicht und vier Bereiche, aktiver Streifen mit aria-current, Zahl der fälligen Wiederholungen', () => {
    const html = render('/sql/uebungen', createElement(Register, { badges }));
    for (const l of ['Übersicht', 'Lernen', 'Glossar', 'SQL-Editor', 'Einstellungen'])
      expect(html).toContain(`<span class="streifen-name">${l}</span>`);
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toMatch(
      /class="streifen s-sql active" aria-current="page" href="\/sql".*?<span class="streifen-zahl" aria-hidden="true">2<\/span>/,
    );
    expect(html).toContain(', 1 fällig');
    expect(html).not.toMatch(/class="streifen s-glossar[^>]*>.*?streifen-zahl.*?s-sql/);
  });

  it('Inhaltsseite im Bereich: nur dessen Ziele, das aktive hervorgehoben, darunter Platz für die Abschnitte der Seite', () => {
    const html = render('/karteikarten', createElement(Inhaltsseite, { badges, offen: false, onSchliessen: () => {}, slotRef: () => {} }));
    expect(html).toContain('AP2 Lern-App');
    expect(html).toContain('<nav class="inhalt-gruppe" aria-label="Lernen">');
    expect(html).not.toContain('aria-label="Glossar"');
    expect(html).toMatch(
      /<li class="hier"><a aria-current="page" href="\/karteikarten"[^>]*>Karteikarten<\/a><\/li><li class="inhalt-abschnitte"><\/li>/,
    );
    expect(html).toContain('Fehlerjournal</a><small class="faellig">1 fällig</small>');
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).not.toContain('inhalt-schleier');
  });

  it('Inhaltsseite auf der Übersicht: alle Bereiche, kein Platz für Abschnitte; geöffnet mit Schleier zum Schließen', () => {
    const html = render('/', createElement(Inhaltsseite, { badges, offen: true, onSchliessen: () => {}, slotRef: () => {} }));
    for (const l of ['Lernen', 'Glossar', 'SQL-Editor', 'Einstellungen'])
      expect(html).toContain(`<nav class="inhalt-gruppe" aria-label="${l}">`);
    expect(html).not.toContain('inhalt-abschnitte');
    expect(html).toContain('class="inhaltsseite seite offen"');
    expect(html).toContain('inhalt-schleier');
    expect(html).toMatch(/class="etikett" aria-current="page" href="\/"/);
  });

  it('Kopfzeile: Pfad, Suche, Speicherstand und der Knopf zur Inhaltsseite', () => {
    const zeile = (pfad: string, saveText: string, saveState: string) =>
      render(pfad, createElement(Kopfzeile, { onSuche: () => {}, onInhalt: () => {}, inhaltOffen: false, saveText, saveState }));
    const html = zeile('/karteikarten', 'Gespeichert', 'gespeichert');
    expect(html).toContain('<p class="pfad">Lernen › <b>Karteikarten</b></p>');
    expect(html).toContain('<span class="suche-name">Suchen</span>');
    expect(html).toContain('<span class="sr-only">Gespeichert</span>');
    expect(html).toMatch(/class="inhalt-knopf" aria-expanded="false" aria-controls="inhaltsseite"/);
    // Übersicht ohne Bereich; Speicherfehler sichtbar als Text
    const start = zeile('/', 'Speichern fehlgeschlagen', 'fehler');
    expect(start).toContain('<p class="pfad"><b>Übersicht</b></p>');
    expect(start).toContain('<span class="">Speichern fehlgeschlagen</span>');
    // Bereich und Ziel heißen gleich: nur einmal nennen
    expect(zeile('/einstellungen', 'Gespeichert', 'gespeichert')).toContain('<p class="pfad">Einstellungen</p>');
  });
});
