import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CONTENT_DIR, loadContent } from '../build/inhalt';
import { Markdown } from '../src/components/Markdown';
import { findeOperatoren, OPERATOR_NACH_ID, OPERATOREN, operatorFrage, operatorHaeufigkeit, zerlegeText } from '../src/lib/operatoren';
import { erzeugeZufall } from '../src/rechnen/zufall';

// Operatoren-Trainer (ROADMAP 8.4): Tokenizer, Markierung im Aufgabentext, Quiz.

const ops = (text: string) => findeOperatoren(text).map((t) => `${t.wort}:${t.operatorId}`);

describe('findeOperatoren', () => {
  it('Sie-Form mit „Sie“ dahinter, auch kursiv und kleingeschrieben', () => {
    expect(ops('Nennen Sie zwei Ursachen und *begründen* Sie Ihre Wahl.')).toEqual(['Nennen:nennen', 'begründen:begruenden']);
    expect(ops('*Erläutern* Sie den Begriff.')).toEqual(['Erläutern:erlaeutern']);
    expect(ops('Wie würden Sie das bewerten?')).toEqual([]);
    expect(ops('Können Sie nennen, was fehlt?')).toEqual([]);
  });

  it('Du-Form am Satz- oder Teilsatzanfang', () => {
    expect(ops('Berechne den Median und gib die Einheit an.')).toEqual(['Berechne:berechnen', 'gib:angeben']);
    expect(ops('Sortiere die Werte. Bestimme dann Q1.')).toEqual(['Bestimme:bestimmen']);
    expect(ops('An dieser Stelle fehlt etwas.')).toEqual([]);
  });

  it('trennbare Verben nur mit Partikel im selben Satz', () => {
    expect(ops('*Geben* Sie die verwendete Konvention *an*.')).toEqual(['Geben:angeben']);
    expect(ops('*Stellen* Sie den Rechenweg tabellarisch dar.')).toEqual(['Stellen:darstellen']);
    expect(ops('Stellen Sie dar, wie der Datensatz gespeichert wird.')).toEqual(['Stellen:darstellen']);
    expect(ops('*Grenzen* Sie ETL und ELT *ab* und *nennen* Sie je einen Einsatzfall.')).toEqual(['Grenzen:abgrenzen', 'nennen:nennen']);
    expect(ops('Leiten Sie daraus ab, wo der Ansatzpunkt liegt.')).toEqual(['Leiten:ableiten']);
    expect(ops('Führen Sie die Nutzwertanalyse durch.')).toEqual(['Führen:durchfuehren']);
    // ohne Partikel kein Operator
    expect(ops('Stellen Sie sich vor, Sie wären Projektleiter.')).toEqual([]);
    expect(ops('Geben Sie Acht. Die Werte stehen an der Tafel.')).toEqual([]);
    expect(ops('Führen Sie Protokoll.')).toEqual([]);
    // „ordnen“ ist auch ohne „zu“ eine Zuordnung
    expect(ops('Ordnen Sie jedem Merkmal das Skalenniveau zu.')).toEqual(['Ordnen:zuordnen']);
    expect(ops('Ordnen Sie Ihr Projekt in CRISP-DM ein.')).toEqual(['Ordnen:zuordnen']);
  });

  it('Partikel nur als ganzes Wort („ab“ in „abändern“ zählt nicht)', () => {
    expect(ops('Grenzen Sie die Begriffe sauber voneinander. Ab morgen gilt das.')).toEqual([]);
    expect(ops('Grenzen Sie abändernde Begriffe.')).toEqual([]);
  });

  it('zerlegeText setzt den Text wieder zusammen', () => {
    const text = '**A1 (6 P):** *Erläutern* Sie den Begriff und *nennen* Sie ein Beispiel.';
    const teile = zerlegeText(text);
    expect(teile.map((t) => t.text).join('')).toBe(text);
    expect(teile.filter((t) => t.operatorId).map((t) => t.operatorId)).toEqual(['erlaeutern', 'nennen']);
  });

  it('jeder Operator hat Text, Punkte und Tipp; IDs eindeutig; Formen klein geschrieben', () => {
    expect(new Set(OPERATOREN.map((o) => o.id)).size).toBe(OPERATOREN.length);
    for (const o of OPERATOREN) {
      expect(o.verlangt.length, o.id).toBeGreaterThan(20);
      expect(o.punkte, o.id).toBeTruthy();
      expect(o.tipp, o.id).toBeTruthy();
      for (const f of [...o.formen.sie, ...o.formen.du, ...(o.trennbar?.sie ?? []), ...(o.trennbar?.du ?? [])])
        expect(f).toBe(f.toLowerCase());
    }
  });
});

describe('Operatoren in den echten Aufgaben (content/)', () => {
  const content = loadContent(CONTENT_DIR);
  const texte = Object.values(content.tasks).map((t) => t.markdown);

  it('die häufigsten Operatoren werden gefunden', () => {
    const h = operatorHaeufigkeit(texte);
    for (const id of ['erlaeutern', 'nennen', 'berechnen', 'angeben', 'beurteilen', 'begruenden', 'benennen', 'zuordnen', 'beschreiben']) {
      expect(h[id], id).toBeGreaterThanOrEqual(5);
    }
  });

  it('fast jede kursive Operator-Form in einer Aufgabe wird erkannt', () => {
    const formen = new Set(
      OPERATOREN.flatMap((o) => [...o.formen.sie, ...o.formen.du, ...(o.trennbar?.sie ?? []), ...(o.trennbar?.du ?? [])]),
    );
    let gesamt = 0;
    let erkannt = 0;
    for (const text of texte) {
      const treffer = new Set(findeOperatoren(text).map((t) => t.start));
      for (const m of text.matchAll(/(?<!\*)\*(\p{L}+)\*(?!\*)/gu)) {
        if (!formen.has(m[1].toLowerCase())) continue;
        gesamt++;
        if (treffer.has(m.index + 1)) erkannt++;
      }
    }
    expect(gesamt).toBeGreaterThan(200);
    expect(erkannt / gesamt).toBeGreaterThan(0.95);
  });
});

describe('Markierung im Aufgabentext', () => {
  const html = (md: string, operatoren = true) =>
    renderToString(createElement(MemoryRouter, null, createElement(Markdown, { source: false, operatoren, children: md }))).replace(
      /<!-- -->/g,
      '',
    );

  it('markiert das Verb mit Tooltip (aria-describedby) und lässt Markdown intakt', () => {
    const out = html('**A1 (6 P):** *Erläutern* Sie den Begriff.\n\n- *Nennen* Sie zwei Beispiele.\n\n| Spalte |\n|---|\n| Berechne x |');
    expect(out).toContain('<strong>A1 (6 P):</strong>');
    expect(out).toMatch(/<em><span class="operator" tabindex="0" aria-describedby="([^"]+)">Erläutern<span role="tooltip" id="\1"/);
    expect(out).toContain('Operator „erläutern“');
    expect(out).toMatch(/<li><em><span class="operator"[^>]*>Nennen/);
    expect(out).toMatch(/<td><span class="operator"[^>]*>Berechne/);
  });

  it('nichts in Code und ohne `operatoren`', () => {
    expect(html('`Nennen Sie` als Code\n\n```\nBerechne x\n```')).not.toContain('class="operator"');
    expect(html('*Nennen* Sie drei.', false)).not.toContain('class="operator"');
  });
});

describe('operatorFrage', () => {
  const aufgaben = [
    { id: 'a', text: '*Beurteilen* Sie das Vorgehen.' },
    { id: 'b', text: 'Keine Operatoren hier.' },
  ];

  it('4 verschiedene Antworten, die richtige dabei, mindestens eine aus einem anderen Bereich', () => {
    for (let seed = 1; seed < 40; seed++) {
      const f = operatorFrage(aufgaben, erzeugeZufall(seed).zahl)!;
      expect(f).toMatchObject({ aufgabeId: 'a', wort: 'Beurteilen', operatorId: 'beurteilen' });
      expect(new Set(f.optionen).size).toBe(4);
      expect(f.optionen).toContain('beurteilen');
      expect(f.optionen.some((id) => OPERATOR_NACH_ID[id].bereich !== 3)).toBe(true);
    }
  });

  it('gleicher Zufall → gleiche Frage; ohne Operatoren → undefined', () => {
    expect(operatorFrage(aufgaben, erzeugeZufall(7).zahl)).toEqual(operatorFrage(aufgaben, erzeugeZufall(7).zahl));
    expect(operatorFrage([aufgaben[1]])).toBeUndefined();
  });
});
