import { describe, expect, it } from 'vitest';
import { emptyProgress } from '../shared/progress';
import { CONTENT_DIR, loadContent } from '../server/loadContent';
import { naheWerte, rechenAuswahl, rechenOptionen } from '../src/lib/leichtRechnen';
import { recordRechenCheck, recordRechenLeicht, rechenStatus } from '../src/lib/rechnen';
import { pruefeEingabe } from '../src/rechnen/checker';
import { baueInstanz } from '../src/rechnen/instanz';
import type { AufgeloesteEingabe } from '../src/rechnen/instanz';
import type { Fehlerbild } from '../src/rechnen/typen';
import { erzeugeZufall } from '../src/rechnen/zufall';

const rng = (seed = 1) => erzeugeZufall(seed).zahl;
const zahl = (erwartet: number, extra: Partial<AufgeloesteEingabe> = {}): AufgeloesteEingabe => ({
  id: 'x',
  label: 'X',
  erwartet,
  vergleich: 'zahl',
  runden: 2,
  ...extra,
});
const fb = (wert: Fehlerbild['wert'], text = 'Fehler'): Fehlerbild => ({ eingabe: 'x', wert, text });

describe('rechenOptionen', () => {
  it('nimmt die Fehlerbilder als falsche Antworten, mit Erklärung', () => {
    const a = rechenOptionen(
      zahl(70, { einheit: 'min' }),
      [fb(55, 'unsortiert'), fb(40, 'Modus'), fb(77, 'n − 1'), fb(1, 'andere Eingabe')].slice(0, 3),
      rng(),
    )!;
    expect(a.optionen).toHaveLength(4);
    expect(a.aufgefuellt).toBe(0);
    expect(a.optionen.filter((o) => o.richtig)).toEqual([{ text: '70,00 min', richtig: true }]);
    expect(a.optionen.find((o) => o.text === '55,00 min')).toEqual({ text: '55,00 min', richtig: false, erklaerung: 'unsortiert' });
  });

  it('entfernt Doppelte nach dem Runden und füllt mit nahen Werten auf', () => {
    const a = rechenOptionen(zahl(70), [fb(70.001), fb(55.004), fb(55.001), { eingabe: 'y', wert: 1, text: 'fremd' }], rng())!;
    const texte = a.optionen.map((o) => o.text);
    expect(texte).toHaveLength(4);
    expect(new Set(texte).size).toBe(4);
    expect(texte.filter((t) => t === '55,00')).toHaveLength(1);
    expect(texte).not.toContain('1,00');
    expect(a.aufgefuellt).toBe(2);
  });

  it('ohne Fehlerbilder: 3 nahe Werte, gleiches Vorzeichen, Prozent bleibt ≤ 100', () => {
    for (let s = 1; s <= 50; s++) {
      const a = rechenOptionen(zahl(95, { einheit: '%' }), [], rng(s))!;
      expect(a.optionen).toHaveLength(4);
      expect(a.aufgefuellt).toBe(3);
      for (const o of a.optionen) {
        const v = Number(o.text.replace(' %', '').replace('.', '').replace(',', '.'));
        expect(v).toBeGreaterThan(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
    expect(naheWerte(0, { runden: 0 }, rng()).every((x) => x >= 0 && x !== 0)).toBe(true);
    expect(naheWerte(-5, { runden: 0 }, rng()).every((x) => x < 0)).toBe(true);
  });

  it('die richtige Antwort steht nicht immer an derselben Stelle', () => {
    const plaetze = new Set<number>();
    for (let s = 1; s <= 100; s++) plaetze.add(rechenOptionen(zahl(42), [], rng(s))!.optionen.findIndex((o) => o.richtig));
    expect(plaetze).toEqual(new Set([0, 1, 2, 3]));
  });

  it('Listen, ja/nein und Texte', () => {
    const liste = rechenOptionen({ id: 'x', label: 'Ausreißer', erwartet: [220], vergleich: 'liste' }, [], rng())!;
    expect(liste.optionen).toHaveLength(4);
    expect(liste.optionen.map((o) => o.text)).toContain('keine');
    const pfad = rechenOptionen({ id: 'x', label: 'Kritischer Pfad', erwartet: 'A → C → D → F', vergleich: 'menge' }, [], rng())!;
    expect(pfad.optionen).toHaveLength(4);
    for (const o of pfad.optionen.filter((x) => !x.richtig)) expect(o.text.split(' → ')).toHaveLength(3);
    const jn = rechenOptionen({ id: 'x', label: 'eingehalten', erwartet: 'ja', vergleich: 'text' }, [], rng())!;
    expect(jn.optionen.map((o) => o.text).sort()).toEqual(['ja', 'nein']);
    expect(rechenOptionen({ id: 'x', label: 'Beste', erwartet: 'Anbieter B', vergleich: 'text' }, [], rng())).toBeUndefined();
    expect(
      rechenOptionen({ id: 'x', label: 'Beste', erwartet: 'Anbieter B', vergleich: 'text' }, [fb('Anbieter A')], rng())!.optionen,
    ).toHaveLength(2);
  });
});

describe('rechenAuswahl mit allen Übungen aus content/', () => {
  const content = loadContent(CONTENT_DIR);

  it('jede Übung lässt sich auswählen; je Eingabe 2–4 Antworten, genau eine richtig, keine doppelt; der Checker stimmt zu', () => {
    let eingaben = 0;
    let vier = 0;
    for (const u of content.rechenUebungen) {
      for (const seed of [undefined, ...(u.neueZahlen ? [11, 22, 33] : [])]) {
        const inst = baueInstanz(u, seed);
        const auswahl = rechenAuswahl(inst, rng(seed ?? 7));
        expect(auswahl, u.id).toBeDefined();
        for (const a of auswahl!) {
          const e = inst.eingaben.find((x) => x.id === a.eingabe)!;
          const texte = a.optionen.map((o) => o.text.toLowerCase());
          expect(a.optionen.length, `${u.id} ${a.eingabe}`).toBeGreaterThanOrEqual(2);
          expect(a.optionen.length).toBeLessThanOrEqual(4);
          if (e.vergleich === 'zahl' || e.vergleich === 'liste') expect(a.optionen, `${u.id} ${a.eingabe}`).toHaveLength(4);
          expect(a.optionen.filter((o) => o.richtig)).toHaveLength(1);
          expect(new Set(texte).size, `${u.id} ${a.eingabe}`).toBe(texte.length);
          for (const o of a.optionen) {
            const status = pruefeEingabe(e, o.text).status;
            expect(status, `${u.id} ${a.eingabe} „${o.text}“`).toBe(o.richtig ? 'richtig' : 'falsch');
          }
          eingaben++;
          if (a.optionen.length === 4) vier++;
        }
      }
    }
    expect(vier / eingaben).toBeGreaterThan(0.95);
  });
});

describe('Fortschritt im Leicht-Modus der Rechenübungen', () => {
  const T = '2026-10-01';
  it('richtig: Lerntag, aber kein Versuch und nicht gelöst', () => {
    const p = recordRechenLeicht(emptyProgress(), 'RE-1', true, T);
    expect(p.rechnen['RE-1']).toEqual({ attempts: 0, hintsUsed: 0, lastCheckedAt: T });
    expect(p.rechnenDays).toEqual({ [T]: 1 });
    expect(rechenStatus(p.rechnen['RE-1'], T)).toBe('offen');
  });

  it('falsch: Wiederholung ab morgen; gelöst bleibt gelöst', () => {
    let p = recordRechenCheck(emptyProgress(), 'RE-1', true, T);
    expect(p.rechnen['RE-1'].solvedAt).toBe(T);
    p = recordRechenLeicht(p, 'RE-1', false, T);
    expect(p.rechnen['RE-1']).toMatchObject({ attempts: 1, solvedAt: T, stage: 1, due: '2026-10-02' });
    expect(p.rechnenDays).toEqual({ [T]: 2 });
  });

  it('gelöst wird nur durch Eintippen', () => {
    let p = recordRechenLeicht(emptyProgress(), 'RE-1', true, T);
    expect(p.rechnen['RE-1'].solvedAt).toBeUndefined();
    p = recordRechenCheck(p, 'RE-1', true, T);
    expect(p.rechnen['RE-1'].solvedAt).toBe(T);
  });
});
