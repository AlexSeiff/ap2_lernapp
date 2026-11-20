import { describe, expect, it } from 'vitest';
import { emptyProgress, migrateProgress, type Progress } from '../domain/progress';
import { recordAttempt } from '../src/lib/progress';
import { uebernehmeFremdenStand } from '../src/lib/fremdUebernahme';

const versuch = (p: Progress, id: string) => recordAttempt(p, { taskId: id, date: 'd', points: 1, max: 1, mode: 'einzel' }, '2026-09-22');

describe('Fremden Stand übernehmen (anderer Tab hat gespeichert)', () => {
  it('ohne eigene offene Änderung wird der gespeicherte Stand genau übernommen, auch Gelöschtes bleibt weg', () => {
    const aktuell = { ...emptyProgress(), lernziele: { alt: true } };
    const gespeichert = { ...emptyProgress(), lernziele: { neu: true } };
    const r = uebernehmeFremdenStand(aktuell, gespeichert, false);
    expect(r.speichern).toBe(false);
    expect(r.stand.lernziele).toEqual({ neu: true });
  });

  it('eine eigene Eingabe, die erst während des Wartens kam, geht nicht verloren: beides wird zusammengeführt und gespeichert', () => {
    const fremd = versuch(emptyProgress(), '01-A1');
    const aktuell = versuch(emptyProgress(), '02-B1'); // der Tipp, der gerade erst kam
    const r = uebernehmeFremdenStand(aktuell, fremd, true);
    expect(r.speichern).toBe(true);
    expect(r.stand.attempts.map((a) => a.taskId).sort()).toEqual(['01-A1', '02-B1']);
  });

  it('akzeptiert einen leeren oder ungelesenen gespeicherten Stand', () => {
    const aktuell = versuch(emptyProgress(), '01-A1');
    expect(uebernehmeFremdenStand(aktuell, null, true).stand.attempts).toHaveLength(1);
    expect(migrateProgress(uebernehmeFremdenStand(aktuell, null, false).stand).attempts).toEqual([]);
  });
});
