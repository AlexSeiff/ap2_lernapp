import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Kopfleiste } from '../src/components/Kopfleiste';
import { MobileNav } from '../src/components/MobileNav';
import {
  aktiverBereich,
  aktivesUnterziel,
  badgeSumme,
  bereich,
  BEREICHE,
  GLOSSAR_PFAD,
  passtZuZiel,
  sichtbareZiele,
} from '../src/lib/navigation';

// Navigation (Umsetzungsplan Phase 2): vier Bereiche mit Unterzielen, Kopfleiste oben, Tab-Bar unten auf dem Handy.

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
      '/generator': 'einstellungen',
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

  it('KI-Aufgaben nur lokal; Badges = Summe der fälligen Einträge eines Bereichs', () => {
    const e = bereich('einstellungen');
    expect(sichtbareZiele(e, true).map((z) => z.to)).not.toContain('/generator');
    expect(sichtbareZiele(e, false).map((z) => z.to)).toContain('/generator');
    const badges = { sql: 2, rechnen: 3, diagramme: 5, journal: 4 };
    expect(badgeSumme(bereich('lernen').unter, badges)).toBe(12);
    expect(badgeSumme(bereich('sql').unter, badges)).toBe(2);
    expect(badgeSumme(bereich('glossar').unter, badges)).toBe(0);
  });
});

describe('Komponenten', () => {
  const badges = { sql: 2, rechnen: 0, diagramme: 0, journal: 1 };

  it('Tab-Bar: Übersicht und vier Bereiche, aktiver Tab mit aria-current, Badges', () => {
    const html = ohneTrenner(
      renderToString(createElement(MemoryRouter, { initialEntries: ['/sql/uebungen'] }, createElement(MobileNav, { badges }))),
    );
    for (const l of ['Übersicht', 'Lernen', 'Glossar', 'SQL', 'Einstellungen'])
      expect(html).toContain(`<span class="bn-label">${l}</span>`);
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toMatch(/class="active" aria-current="page" href="\/sql".*?<span class="nav-badge">2<\/span>/);
    expect(html).toContain(', 1 fällig');
    expect(html).not.toContain('bn-panel');
  });

  it('Kopfleiste: Übersicht, vier Bereiche, Suche, Speicherstatus und die Unterleiste des aktiven Bereichs', () => {
    const html = ohneTrenner(
      renderToString(
        createElement(
          MemoryRouter,
          { initialEntries: ['/karteikarten'] },
          createElement(Kopfleiste, { onSuche: () => {}, badges, saveText: 'Gespeichert', saveState: 'gespeichert' }),
        ),
      ),
    );
    expect(html).toContain('AP2 Lern-App');
    expect(html).toMatch(/class="kopf-start" href="\/"/);
    for (const l of ['Lernen', 'Glossar', 'SQL-Editor', 'Einstellungen']) expect(html).toContain(`<span class="kopf-label">${l}</span>`);
    expect(html).toContain('<span class="kopf-label">Suchen</span>');
    expect(html).toContain('Gespeichert');
    // Unterleiste „Lernen“ mit Karteikarten als aktivem Ziel
    expect(html).toContain('<nav class="unterleiste" aria-label="Lernen">');
    expect(html).toMatch(/class="active" aria-current="page" href="\/karteikarten"/);
    expect(html).toContain('Fehlerjournal<span class="nav-badge">1</span>');
  });

  it('Übersicht ohne Unterleiste; Speicherfehler sichtbar als Text', () => {
    const html = ohneTrenner(
      renderToString(
        createElement(
          MemoryRouter,
          { initialEntries: ['/'] },
          createElement(Kopfleiste, { onSuche: () => {}, badges, saveText: 'Speichern fehlgeschlagen', saveState: 'fehler' }),
        ),
      ),
    );
    expect(html).not.toContain('unterleiste');
    expect(html).toMatch(/class="kopf-start active" aria-current="page" href="\/"/);
    expect(html).toContain('<span class="">Speichern fehlgeschlagen</span>');
  });
});
