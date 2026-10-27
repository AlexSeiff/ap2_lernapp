import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../shared/progress';
import { CONTENT_DIR, ladeInhalt } from '../server/loadContent';
import {
  bauePodcast,
  dauerMinuten,
  DENKPAUSE,
  ersteSaetze,
  formelSprechen,
  fundstelle,
  hatPodcastThema,
  saetze,
  sprechText,
  type Zeile,
} from '../src/lib/podcast';
import { fehlerText, stimmenVorschlag, Vorleser } from '../src/lib/sprachausgabe';

// Podcast je Thema: Gespräch aus Lernblatt, Begriffsseiten und Prüferfragen; Vorlesen mit der Sprachausgabe des Browsers.

const { content, seiten } = ladeInhalt(CONTENT_DIR);
const topic = (id: string) => content.topics.find((t) => t.id === id)!;

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ content, progress: emptyProgress(), update: () => {}, aiEnabled: false, aiModel: '', firstVisit: false }),
}));

describe('Text zum Vorlesen', () => {
  it('Formeln in Worten', () => {
    expect(formelSprechen(String.raw`\bar{x} = \frac{\sum x_i}{n}`)).toBe('x quer gleich (Summe x i) geteilt durch n');
    expect(formelSprechen(String.raw`\frac{1{,}5}{30} \cdot 100 = 5\,\%`)).toBe('1,5 geteilt durch 30 mal 100 gleich 5 Prozent');
    expect(formelSprechen(String.raw`s = \sqrt{s^2}`)).toBe('s gleich Wurzel aus (s Quadrat)');
    expect(formelSprechen(String.raw`\sqrt[7]{1{,}5} - 1`)).toBe('7-te Wurzel aus 1,5 minus 1');
    expect(formelSprechen(String.raw`p < 0{,}05`)).toBe('p kleiner als 0,05');
  });

  it('Markdown, Code, Tabellen und Zeichen', () => {
    const md = [
      '**Fett** und *kursiv* mit `SELECT` und [Link](https://x.de).',
      '',
      '| a | b |',
      '|---|---|',
      '| 1 | 2 |',
      '',
      '```sql',
      'SELECT 1;',
      '```',
      '- erster Punkt',
      '- zweiter Punkt',
      '',
      'Mit $x^2$ → Ergebnis ≈ 4, z. B. bei COUNT(*) > 5 (→ DD5).',
    ].join('\n');
    const t = sprechText(md);
    expect(t).toBe(
      'Fett und kursiv mit SELECT und Link. erster Punkt. zweiter Punkt. Mit x Quadrat, also Ergebnis ungefähr 4, zum Beispiel bei COUNT(Stern) größer als 5 (siehe Deep Dive 5).',
    );
  });

  it('Hervorhebungen im Wort, Abkürzungen, Einheiten und Kardinalitäten', () => {
    expect(sprechText('**CR**oss-**I**ndustry **S**tandard **P**rocess for **D**ata **M**ining')).toBe(
      'Cross-Industry Standard Process for Data Mining.',
    );
    expect(sprechText('SUM(a * b), KPIs und SQLite bleiben, bestellen()')).toBe('SUM(a mal b), KPIs und SQLite bleiben, bestellen.');
    expect(sprechText('Art. 6 Abs. 1 lit. f DSGVO, Nr. 3')).toBe('Artikel 6 Absatz 1 Buchstabe f DSGVO, Nummer 3.');
    expect(sprechText('4 TB, 30 h, 15 min, 200 ms, 120 T€, 2 Mio. Zeilen')).toBe(
      '4 Terabyte, 30 Stunden, 15 Minuten, 200 Millisekunden, 120 Tausend Euro, 2 Millionen Zeilen.',
    );
    expect(sprechText('Beziehung 1:n, m:n und 1:1, Uhrzeit 18:30')).toBe('Beziehung 1 zu n, m zu n und 1 zu 1, Uhrzeit 18:30.');
  });

  it('Sätze: Tausenderpunkte und Abkürzungen trennen nicht', () => {
    expect(saetze('Umsatz 20.000 €. Zweiter Satz, z. B. hier. Dritter!')).toEqual([
      'Umsatz 20.000 €.',
      'Zweiter Satz, z. B. hier.',
      'Dritter!',
    ]);
    expect(ersteSaetze('Eins. Zwei. Drei.', 2)).toBe('Eins. Zwei.');
  });

  it('Fundstelle aus „Mehr:“ oder den Quellen', () => {
    expect(fundstelle({ mehr: ['Deep Dive 5, 6.5'], quellen: '' })).toEqual({ topicId: '05', teil: 6, unter: 5 });
    expect(fundstelle({ mehr: ['Deep Dive 12, Teil 2'], quellen: '' })).toEqual({ topicId: '12', teil: 2, unter: undefined });
    expect(fundstelle({ mehr: [], quellen: 'Karte DD3, DD3 Teil 4' })).toEqual({ topicId: '03', teil: undefined, unter: undefined });
    expect(fundstelle({ mehr: [], quellen: 'Themenliste' })).toBeUndefined();
  });
});

describe('Folgen aus den echten Inhalten', () => {
  const folgen = new Map(content.topics.map((t) => [t.id, bauePodcast(t, seiten, content.flashcards)]));

  it('jedes Stoffthema hat eine Folge – WiSo, Altklausur-Training und Zusatzmaterial nicht', () => {
    for (const id of ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '15', '16', '17'])
      expect(folgen.get(id), id).toBeDefined();
    for (const id of ['13', '14', '20', '18', '19', '21', '22', '23', '24', '25', '26', '00']) {
      expect(folgen.get(id), id).toBeUndefined();
      expect(hatPodcastThema(topic(id)), id).toBe(false);
    }
  });

  it('Aufbau: Einstieg, Teile mit Begriffen, Quiz mit Denkpause, Abschluss; Lea fragt, Ben erklärt', () => {
    const f = folgen.get('03')!;
    expect(f.kapitel[0].titel).toBe('Einstieg');
    expect(f.kapitel.at(-1)!.titel).toBe('Abschluss');
    expect(f.kapitel.some((k) => k.titel.startsWith('Teil 1'))).toBe(true);
    const quiz = f.kapitel.find((k) => k.titel.startsWith('Quiz'))!;
    expect(quiz.zeilen.some((z) => 'pause' in z && z.pause === DENKPAUSE)).toBe(true);
    const teil1 = f.kapitel.find((k) => k.titel.startsWith('Teil 1'))!.zeilen as Exclude<Zeile, { pause: number }>[];
    expect(teil1[0].sprecher).toBe('lea');
    expect(teil1.some((z) => z.sprecher === 'ben' && /Beispiel|Lager/.test(z.text))).toBe(true);
    expect(f.begriffe).toBeGreaterThan(20);
    expect(dauerMinuten(f.kapitel)).toBeGreaterThan(10);
  });

  it('keine Folge enthält Unlesbares: kein Markup, kein LaTeX, keine leeren Zeilen, keine doppelten Punkte', () => {
    for (const f of folgen.values()) {
      if (!f) continue;
      for (const k of f.kapitel)
        for (const z of k.zeilen) {
          if ('pause' in z) continue;
          expect(z.text.trim().length, `${f.topicId} ${k.titel}`).toBeGreaterThan(0);
          expect(z.text, `${f.topicId} ${k.titel}: ${z.text.slice(0, 80)}`).not.toMatch(/[$\\*`|#<>]|\.\.|\?\.|\(\s*,|\d\. \d{3}|[→⇒≈≤≥]/);
        }
    }
  });

  it('keine Fachgesprächsfragen im Quiz', () => {
    const fg = new Set(content.flashcards.filter((c) => c.kind === 'fachgespraech').map((c) => sprechText(c.question)));
    for (const f of folgen.values())
      for (const k of f?.kapitel ?? [])
        for (const z of k.zeilen) if (!('pause' in z)) expect(fg.has(z.text.replace(/^Frage \d+: /, ''))).toBe(false);
  });
});

describe('Vorleser', () => {
  const gesprochen: { text: string; pitch: number; rate: number; stimme?: string }[] = [];
  let offen: { onend?: () => void; onerror?: (e: { error: string }) => void }[] = [];
  const fake = () => {
    gesprochen.length = 0;
    offen = [];
    vi.stubGlobal('window', globalThis);
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        lang = '';
        voice: unknown;
        rate = 1;
        pitch = 1;
        onend?: () => void;
        onerror?: (e: { error: string }) => void;
        constructor(public text: string) {}
      },
    );
    vi.stubGlobal('speechSynthesis', {
      getVoices: () => [
        { name: 'Katja Online', lang: 'de-DE', localService: false },
        { name: 'Microsoft Katja', lang: 'de-DE', localService: true },
      ],
      speak: (u: { text: string; pitch: number; rate: number; voice?: { name: string } }) => {
        gesprochen.push({ text: u.text, pitch: u.pitch, rate: u.rate, stimme: u.voice?.name });
        offen.push(u as never);
      },
      cancel: () => {},
    });
  };
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });
  // Nach jedem Satz geht es über die Ereignisschleife weiter (setTimeout 0).
  const fertig = () => {
    offen.shift()!.onend!();
    vi.advanceTimersByTime(0);
  };

  it('spricht Satz für Satz, wartet die Denkpause ab, meldet jede Zeile und das Ende', () => {
    fake();
    vi.useFakeTimers();
    const weiter = vi.fn();
    const ende = vi.fn();
    const zeilen: Zeile[] = [{ sprecher: 'lea', text: 'Hallo. Wie geht es?' }, { pause: 2000 }, { sprecher: 'ben', text: 'Gut.' }];
    const v = new Vorleser(zeilen, { stimmen: { lea: 'Microsoft Katja', ben: 'Microsoft Katja' }, tempo: 1.2, weiter, fertig: ende });
    v.start(0);
    expect(gesprochen.map((g) => g.text)).toEqual(['Hallo.']);
    fertig();
    expect(gesprochen.map((g) => g.text)).toEqual(['Hallo.', 'Wie geht es?']);
    // gleiche Stimme für beide → Lea höher
    expect(gesprochen[0]).toMatchObject({ pitch: 1.15, rate: 1.2 });
    fertig();
    expect(weiter).toHaveBeenLastCalledWith(1);
    vi.advanceTimersByTime(2000 / 1.2 + 1);
    expect(weiter).toHaveBeenLastCalledWith(2);
    expect(gesprochen.at(-1)).toMatchObject({ text: 'Gut.', pitch: 0.9 });
    fertig();
    expect(ende).toHaveBeenCalled();
  });

  it('nach stopp() oder Neustart zählen alte Rückmeldungen nicht mehr', () => {
    fake();
    vi.useFakeTimers();
    const weiter = vi.fn();
    const zeilen: Zeile[] = [
      { sprecher: 'lea', text: 'Eins.' },
      { sprecher: 'ben', text: 'Zwei.' },
    ];
    const v = new Vorleser(zeilen, { stimmen: { lea: 'a', ben: 'b' }, tempo: 1, weiter, fertig: () => {} });
    v.start(0);
    const alt = offen.shift()!;
    v.stopp();
    alt.onend!();
    expect(weiter).not.toHaveBeenCalled();
    v.start(1);
    expect(gesprochen.at(-1)!.text).toBe('Zwei.');
  });

  it('ein Fehler: einmal mit lokaler Stimme versuchen, dann anhalten und melden – nie stumm weiterspringen', () => {
    fake();
    vi.useFakeTimers();
    const weiter = vi.fn();
    const fehler = vi.fn();
    const zeilen: Zeile[] = [
      { sprecher: 'lea', text: 'Eins.' },
      { sprecher: 'ben', text: 'Zwei.' },
    ];
    const v = new Vorleser(zeilen, { stimmen: { lea: 'Katja Online', ben: 'Katja Online' }, tempo: 1, weiter, fertig: () => {}, fehler });
    v.start(0);
    expect(gesprochen.at(-1)!.stimme).toBe('Katja Online');
    offen.shift()!.onerror!({ error: 'network' });
    vi.advanceTimersByTime(0);
    expect(gesprochen.at(-1)).toMatchObject({ text: 'Eins.', stimme: 'Microsoft Katja' });
    offen.shift()!.onerror!({ error: 'synthesis-failed' });
    vi.advanceTimersByTime(0);
    expect(fehler).toHaveBeenCalledOnce();
    expect(weiter).not.toHaveBeenCalled();
    expect(gesprochen).toHaveLength(2);
    expect(fehlerText('network')).toContain('Internetverbindung');
  });

  it('Stimmenvorschlag: Lea weiblich, Ben männlich, sonst verschieden', () => {
    const v = (name: string) => ({ name }) as SpeechSynthesisVoice;
    expect(stimmenVorschlag([v('Microsoft Conrad'), v('Microsoft Katja')])).toEqual({ lea: 'Microsoft Katja', ben: 'Microsoft Conrad' });
    expect(stimmenVorschlag([v('A'), v('B')])).toEqual({ lea: 'A', ben: 'B' });
    expect(stimmenVorschlag([])).toEqual({ lea: undefined, ben: undefined });
    // Online: natürliche Stimmen aus Deutschland zuerst; offline nur lokale.
    const s = (name: string, lang: string, localService: boolean) => ({ name, lang, localService }) as SpeechSynthesisVoice;
    const alle = [
      s('Microsoft Hedda - German (Germany)', 'de-DE', true),
      s('Microsoft Stefan - German (Germany)', 'de-DE', true),
      s('Microsoft Ingrid Online (Natural) - German (Austria)', 'de-AT', false),
      s('Microsoft Katja Online (Natural) - German (Germany)', 'de-DE', false),
      s('Microsoft Conrad Online (Natural) - German (Germany)', 'de-DE', false),
    ];
    expect(stimmenVorschlag(alle, true)).toEqual({
      lea: 'Microsoft Katja Online (Natural) - German (Germany)',
      ben: 'Microsoft Conrad Online (Natural) - German (Germany)',
    });
    expect(stimmenVorschlag(alle, false)).toEqual({
      lea: 'Microsoft Hedda - German (Germany)',
      ben: 'Microsoft Stefan - German (Germany)',
    });
    // „Female“ gilt nicht als männlich
    expect(stimmenVorschlag([s('Google Female', 'de-DE', true), s('Google Male', 'de-DE', true)], false).ben).toBe('Google Male');
  });
});

describe('Seiten', () => {
  const render = (path: string, el: React.ReactElement, muster: string) =>
    renderToString(
      createElement(
        MemoryRouter,
        { initialEntries: [path] },
        createElement(Routes, null, createElement(Route, { path: muster, element: el })),
      ),
    ).replace(/<!-- -->/g, '');

  it('Lernblatt verlinkt die Folge – nur bei Themen mit Podcast', async () => {
    const { Thema } = await import('../src/pages/Themen');
    expect(render('/lernen/03', createElement(Thema), '/lernen/:topicId')).toContain('href="/podcast/03"');
    expect(render('/lernen/13', createElement(Thema), '/lernen/:topicId')).not.toContain('href="/podcast/13"');
  });

  it('Folgen-Übersicht und Player laden die Begriffe nach', async () => {
    const { Podcasts, Podcast } = await import('../src/pages/Podcast');
    expect(render('/podcast', createElement(Podcasts), '/podcast')).toContain('Podcast</h1>');
    expect(render('/podcast/03', createElement(Podcast), '/podcast/:topicId')).toContain('Lädt');
    expect(render('/podcast/13', createElement(Podcast), '/podcast/:topicId')).toContain('Keine Folge');
  });
});
