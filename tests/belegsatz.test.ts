import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { aktivesUnterziel, bereich } from '../src/lib/navigation';

// SQL-Belegsatz (Umsetzungsplan Phase 6, E3): Material aus AP2_SQL_Belegsatz.md, Seite unter Glossar, Knopf im SQL-Editor.

const content = loadContent(CONTENT_DIR);

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

const { SqlBelegsatz } = await import('../src/pages/SqlBelegsatz');
const { AnhangPanel, BelegsatzPanel, ohneTitel } = await import('../src/components/Belegsatz');
const { FormelUebersicht, SqlAuszug } = await import('../src/components/PruefungsAnhang');
const { FORMEL_GRUPPEN, SQL_GRUPPEN } = await import('../src/lib/pruefungsanhang');
const { anhangFuer } = await import('../src/lib/anhang');

const render = (el: React.ReactElement, path = '/material/sql-belegsatz') =>
  renderToString(
    createElement(MemoryRouter, { initialEntries: [path] }, createElement(Routes, null, createElement(Route, { path, element: el }))),
  ).replace(/<!-- -->/g, '');

describe('SQL-Belegsatz', () => {
  const doc = content.materials.find((m) => m.id === 'sql-belegsatz');

  it('wird als Material geladen und deckt die Themen des Plans ab', () => {
    expect(doc?.file).toBe('AP2_SQL_Belegsatz.md');
    for (const t of [
      'SELECT',
      'JOIN',
      'Aggregatfunktionen',
      'Unterabfragen',
      'INSERT',
      'CREATE TABLE',
      'Constraint',
      'Datentypen',
      'VIEW',
      'INDEX',
      'STRFTIME',
    ]) {
      expect(doc!.markdown, t).toContain(t);
    }
  });

  it('Seite: Überschrift, Druckknopf, Inhalt ohne doppelten Titel', () => {
    const html = render(createElement(SqlBelegsatz));
    expect(html).toContain('SQL-Belegsatz</h1>');
    expect(html).toContain('Drucken');
    expect(html).toContain('<h2>1. SELECT');
    expect(ohneTitel('# SQL-Belegsatz\n\nText')).toBe('Text');
  });

  it('SQL-Editor: Knopf zum Seitenpanel (zu Beginn geschlossen)', () => {
    const html = render(createElement(BelegsatzPanel), '/sql');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('SQL-Belegsatz');
    expect(html).not.toContain('<aside');
  });

  it('Anhang nachgebaut wie im Belegsatz: Formelübersicht und SQL-Auszug in der Reihenfolge der Prüfung', () => {
    const formeln = FORMEL_GRUPPEN.flatMap((g) => g.zeilen.map((z) => z.name));
    expect(formeln.slice(0, 6)).toEqual([
      'Mittelwert',
      'Median bzw. Zentralwert',
      'Empirische Varianz',
      'Standardabweichung',
      'Kovarianz',
      'Pearson-Korrelationskoeffizient',
    ]);
    expect(SQL_GRUPPEN.map((g) => g.titel)).toEqual([
      'Tabelle',
      'Schlüssel',
      'Datentypen',
      'Befehle, Klauseln, Attribute',
      'Datenmanipulation',
      'Berechtigungen kontrollieren',
      'Aggregatfunktionen',
      'Funktionen',
      'Datumsteil',
      'Operatoren',
    ]);
    const f = render(createElement(FormelUebersicht), '/aufgabe/x');
    expect(f).toContain('class="katex');
    expect(f).not.toContain('katex-error');
    expect(f).toContain('Netzplan');
    const sql = render(createElement(SqlAuszug), '/sql');
    expect(sql).toContain('<b>CREATE</b> <b>TABLE</b>');
    expect(sql).toContain('Stand 2024-10-07');
  });

  it('Anhang-Knöpfe: beide oder einzeln, zu Beginn geschlossen', () => {
    const beide = render(createElement(AnhangPanel, { sql: true, formeln: true }), '/aufgabe/x');
    expect(beide).toContain('SQL-Belegsatz');
    expect(beide).toContain('Formelübersicht');
    expect(beide).not.toContain('<aside');
    const formeln = render(createElement(AnhangPanel, { formeln: true }), '/rechnen/x');
    expect(formeln).toContain('Formelübersicht');
    expect(formeln).not.toContain('SQL-Belegsatz');
    expect(render(createElement(AnhangPanel, {}), '/x')).toBe('');
  });

  it('anhangFuer: Belegsatz zu SQL-Aufgaben, Formeln zu Rechenaufgaben', () => {
    const sqlAufgaben = Object.values(content.tasks).filter((t) => t.sqlUebung);
    expect(sqlAufgaben.length).toBeGreaterThan(0);
    for (const t of sqlAufgaben) expect(anhangFuer([t]).sql, t.id).toBe(true);
    const c1 = content.tasks['03-B1'];
    expect(c1.markdown).toContain('*Berechnen*');
    expect(anhangFuer([c1])).toEqual({ sql: false, formeln: true });
    // Deutungsaufgabe zu einem Rechenergebnis: kein Rechen-Operator, aber ein Formelblock.
    const a3 = content.tasks['04-A3'];
    expect(a3.markdown).toContain('*Interpretieren*');
    expect(anhangFuer([a3]).formeln).toBe(true);
    // Eine Klausur bekommt, was eine ihrer Aufgaben braucht.
    expect(anhangFuer([c1, sqlAufgaben[0]])).toEqual({ sql: true, formeln: true });
    const wiso = Object.values(content.tasks).filter((t) => t.topicId === '13' && !anhangFuer([t]).sql && !anhangFuer([t]).formeln);
    expect(wiso.length).toBeGreaterThan(0);
  });

  it('Navigation: Unterziel im Bereich Glossar', () => {
    expect(aktivesUnterziel('/material/sql-belegsatz', bereich('glossar'))?.label).toBe('SQL-Belegsatz');
  });
});
