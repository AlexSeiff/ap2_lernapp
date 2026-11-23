// Tabellen-Editor für Normalisierung (je Schritt 1. NF, 2. NF, 3. NF mit Abhängigkeiten) und Relationenmodell/Star-Schema:
// Tabellen anlegen, Spalten als Primär-/Fremdschlüssel markieren, zwischen Tabellen verschieben, optional Beispieldaten.
// Die Ausgangstabelle lässt sich aus der Anlage übernehmen, jeder Schritt aus dem vorigen. Darunter steht live die
// Relationenschreibweise wie auf den Blättern (fett = PK, ↑ = FK), ab zwei Tabellen auch das Beziehungsdiagramm (SchemaDiagramm).
// TabellenAnsicht zeigt die Abgabe ohne Bedienelemente.

import { useState } from 'react';
import type { Section } from '../../domain/types';
import { useConfirm } from '../hooks/useConfirm';
import { neueId } from '../lib/diagrammEditor';
import {
  anlageTabellen,
  relationTeile,
  schrittHinweis,
  type Tabelle,
  type TabellenAntwort,
  type TabellenSchritt,
} from '../lib/tabellenEditor';
import { SchemaDiagramm } from './SchemaDiagramm';
import { RelationText, TabellenKarte, ohneSpalte } from './tabellen/TabellenKarte';

interface Props {
  wert: TabellenAntwort;
  onChange: (a: TabellenAntwort) => void;
  /** Anlagen der Klausur (Ausgangstabelle übernehmen). */
  anlagen: Section[];
}

/** Neue IDs über alle Schritte, damit kopierte Tabellen eindeutig bleiben. */
const alleTabellen = (a: TabellenAntwort) => a.schritte.flatMap((s) => s.tabellen);
const kopie = (t: Tabelle, id: string): Tabelle => ({
  ...t,
  id,
  spalten: t.spalten.map((s) => ({ ...s })),
  zeilen: t.zeilen.map((z) => [...z]),
});

export function TabellenEditor({ wert, onChange, anlagen }: Props) {
  const confirm = useConfirm();
  const [schritt, setSchritt] = useState(0);
  const i = Math.min(schritt, wert.schritte.length - 1);
  const aktuell = wert.schritte[i];
  const vorlagen = anlageTabellen(anlagen);

  const setzeSchritt = (teil: Partial<TabellenSchritt>) =>
    onChange({ ...wert, schritte: wert.schritte.map((s, j) => (j === i ? { ...s, ...teil } : s)) });
  const setzeTabellen = (tabellen: Tabelle[]) => setzeSchritt({ tabellen });
  const setzeTabelle = (id: string, teil: Partial<Tabelle>) =>
    setzeTabellen(aktuell.tabellen.map((t) => (t.id === id ? { ...t, ...teil } : t)));

  const neueTabelle = (t: Omit<Tabelle, 'id'>, basis = aktuell.tabellen) => [
    ...basis,
    { ...t, id: neueId('t', [...alleTabellen(wert), ...basis]) },
  ];

  const ausAnlage = (n: number) => {
    const v = vorlagen[n];
    if (v) setzeTabellen(neueTabelle(v.tabelle));
  };
  const ausVorigem = async () => {
    const vorige = wert.schritte[i - 1];
    if (!vorige) return;
    if (
      aktuell.tabellen.length &&
      !(await confirm({
        title: `Aus „${vorige.titel}“ übernehmen?`,
        message: `Die Tabellen in „${aktuell.titel}“ werden durch eine Kopie der Tabellen aus „${vorige.titel}“ ersetzt.`,
        confirmLabel: 'Ersetzen',
        danger: true,
      }))
    )
      return;
    const kopien: Tabelle[] = [];
    for (const t of vorige.tabellen) kopien.push(kopie(t, neueId('t', [...alleTabellen(wert), ...kopien])));
    setzeTabellen(kopien);
  };

  const tabelleLoeschen = async (t: Tabelle) => {
    const inhalt = t.spalten.some((s) => s.name.trim()) || t.zeilen.length;
    if (inhalt && !(await confirm({ message: `Tabelle „${t.name || 'ohne Namen'}“ löschen?`, confirmLabel: 'Löschen', danger: true })))
      return;
    setzeTabellen(aktuell.tabellen.filter((x) => x.id !== t.id));
  };

  /** Spalte in eine andere (oder neue) Tabelle kopieren bzw. verschieben. */
  const spalteNach = (von: Tabelle, s: number, ziel: string, verschieben: boolean) => {
    const spalte = { ...von.spalten[s] };
    let tabellen = aktuell.tabellen;
    if (ziel === 'neu') tabellen = neueTabelle({ name: '', spalten: [spalte], zeilen: [] }, tabellen);
    else
      tabellen = tabellen.map((t) =>
        t.id === ziel ? { ...t, spalten: [...t.spalten, spalte], zeilen: t.zeilen.map((z) => [...z, '']) } : t,
      );
    if (verschieben) tabellen = tabellen.map((t) => (t.id === von.id ? ohneSpalte(t, s) : t));
    setzeTabellen(tabellen);
  };

  return (
    <div className="tabellen-editor">
      {wert.schritte.length > 1 && (
        <div className="mode-switch" role="group" aria-label="Schritt">
          {wert.schritte.map((s, j) => (
            <button key={j} type="button" aria-pressed={j === i} onClick={() => setSchritt(j)}>
              {s.titel}
              {s.tabellen.length > 0 && <span className="muted small"> · {s.tabellen.length}</span>}
            </button>
          ))}
        </div>
      )}
      <label className="te-schritt-text">
        <span className="small muted">
          {wert.editor === 'normalform' ? `${aktuell.titel}: Abhängigkeiten und Begründung` : 'Begründung'}
        </span>
        <textarea
          className="answer"
          rows={3}
          value={aktuell.text}
          placeholder={schrittHinweis(wert.editor, Number(/^([123])\. NF/.exec(aktuell.titel)?.[1] ?? i + 1))}
          onChange={(e) => setzeSchritt({ text: e.target.value })}
        />
      </label>

      {aktuell.tabellen.map((t) => (
        <TabellenKarte
          key={t.id}
          t={t}
          andere={aktuell.tabellen.filter((x) => x.id !== t.id)}
          alle={aktuell.tabellen}
          onAendern={(teil) => setzeTabelle(t.id, teil)}
          onDuplizieren={() => setzeTabellen(neueTabelle({ ...kopie(t, ''), name: `${t.name}_kopie` }))}
          onLoeschen={() => tabelleLoeschen(t)}
          onSpalteNach={(s, ziel, verschieben) => spalteNach(t, s, ziel, verschieben)}
        />
      ))}
      {aktuell.tabellen.length > 1 && (
        <details className="te-diagramm" open>
          <summary>Als Beziehungsdiagramm – so zeichnest du das Schema auf den Prüfungsbogen</summary>
          <SchemaDiagramm tabellen={aktuell.tabellen} titel={`Beziehungsdiagramm ${aktuell.titel}`} />
        </details>
      )}
      {!aktuell.tabellen.length && (
        <p className="muted small">
          {wert.editor === 'normalform' && i === 0 && vorlagen.length
            ? 'Übernimm die Ausgangstabelle aus der Anlage oder lege eine neue Tabelle an.'
            : i > 0
              ? `Übernimm die Tabellen aus „${wert.schritte[i - 1].titel}“ und zerlege sie weiter – oder lege neue an.`
              : 'Lege die erste Tabelle an.'}
        </p>
      )}

      <div className="actions te-aktionen">
        <button
          type="button"
          className="secondary"
          onClick={() => setzeTabellen(neueTabelle({ name: '', spalten: [{ name: '' }], zeilen: [] }))}
        >
          + Tabelle
        </button>
        {vorlagen.map((v, n) => (
          <button key={n} type="button" className="ghost" onClick={() => ausAnlage(n)} title={v.titel}>
            Ausgangstabelle „{v.tabelle.name}“ übernehmen
          </button>
        ))}
        {i > 0 && wert.schritte[i - 1].tabellen.length > 0 && (
          <button type="button" className="ghost" onClick={ausVorigem}>
            Aus „{wert.schritte[i - 1].titel}“ übernehmen
          </button>
        )}
      </div>
    </div>
  );
}

export function TabellenAnsicht({ wert }: { wert: TabellenAntwort }) {
  return (
    <div className="tabellen-ansicht">
      {wert.schritte.map((s, i) => (
        <section key={i}>
          {(wert.schritte.length > 1 || wert.editor === 'normalform') && <h4>{s.titel}</h4>}
          {s.text.trim() && <p className="te-text">{s.text}</p>}
          {s.tabellen.map((t) => (
            <div key={t.id} className="te-ansicht-tabelle">
              <p>
                <RelationText name={t.name} teile={relationTeile(t)} />
                {t.spalten.some((x) => x.fk && x.ziel) && (
                  <span className="muted small">
                    {' '}
                    ·{' '}
                    {t.spalten
                      .filter((x) => x.fk && x.ziel)
                      .map((x) => `${x.name} → ${x.ziel}`)
                      .join(', ')}
                  </span>
                )}
              </p>
              {t.zeilen.length > 0 && (
                <div className="te-scroll">
                  <table>
                    <thead>
                      <tr>
                        {t.spalten.map((x, j) => (
                          <th key={j} className={x.pk ? 'pk' : ''}>
                            {x.name}
                            {x.fk ? '↑' : ''}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.zeilen.map((z, zi) => (
                        <tr key={zi}>
                          {t.spalten.map((_, j) => (
                            <td key={j}>{z[j]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          {s.tabellen.length > 1 && <SchemaDiagramm tabellen={s.tabellen} titel={`Beziehungsdiagramm ${s.titel}`} />}
          {!s.text.trim() && !s.tabellen.length && <p className="muted small">Nichts eingetragen.</p>}
        </section>
      ))}
      {wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
    </div>
  );
}
