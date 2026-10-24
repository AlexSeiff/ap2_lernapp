// Tabellen-Editor für Normalisierung (je Schritt 1. NF, 2. NF, 3. NF mit Abhängigkeiten) und Relationenmodell/Star-Schema:
// Tabellen anlegen, Spalten als Primär-/Fremdschlüssel markieren, zwischen Tabellen verschieben, optional Beispieldaten.
// Die Ausgangstabelle lässt sich aus der Anlage übernehmen, jeder Schritt aus dem vorigen. Darunter steht live die
// Relationenschreibweise wie auf den Blättern (fett = PK, ↑ = FK). TabellenAnsicht zeigt die Abgabe ohne Bedienelemente.

import { useState } from 'react';
import type { Section } from '../../shared/types';
import { useConfirm } from '../hooks/useConfirm';
import { neueId } from '../lib/diagrammEditor';
import {
  anlageTabellen,
  relationTeile,
  schrittHinweis,
  type Spalte,
  type Tabelle,
  type TabellenAntwort,
  type TabellenSchritt,
} from '../lib/tabellenEditor';

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
          placeholder={schrittHinweis(wert.editor, i + 1)}
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

const ohneSpalte = (t: Tabelle, s: number): Tabelle => ({
  ...t,
  spalten: t.spalten.filter((_, j) => j !== s),
  zeilen: t.zeilen.map((z) => z.filter((_, j) => j !== s)),
});

function tausche<T>(liste: T[], a: number, b: number): T[] {
  const next = [...liste];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

function TabellenKarte({
  t,
  andere,
  alle,
  onAendern,
  onDuplizieren,
  onLoeschen,
  onSpalteNach,
}: {
  t: Tabelle;
  andere: Tabelle[];
  alle: Tabelle[];
  onAendern: (teil: Partial<Tabelle>) => void;
  onDuplizieren: () => void;
  onLoeschen: () => void;
  onSpalteNach: (s: number, ziel: string, verschieben: boolean) => void;
}) {
  const setzeSpalte = (s: number, teil: Partial<Spalte>) =>
    onAendern({ spalten: t.spalten.map((x, j) => (j === s ? { ...x, ...teil } : x)) });
  const spalteAktion = (s: number, aktion: string) => {
    if (aktion === 'links' && s > 0)
      onAendern({ spalten: tausche(t.spalten, s, s - 1), zeilen: t.zeilen.map((z) => tausche(z, s, s - 1)) });
    else if (aktion === 'rechts' && s < t.spalten.length - 1)
      onAendern({ spalten: tausche(t.spalten, s, s + 1), zeilen: t.zeilen.map((z) => tausche(z, s, s + 1)) });
    else if (aktion === 'loeschen') onAendern(ohneSpalte(t, s));
    else if (aktion.startsWith('kopie:')) onSpalteNach(s, aktion.slice(6), false);
    else if (aktion.startsWith('weg:')) onSpalteNach(s, aktion.slice(4), true);
  };
  const setzeZelle = (z: number, s: number, v: string) =>
    onAendern({ zeilen: t.zeilen.map((zeile, j) => (j === z ? zeile.map((c, k) => (k === s ? v : c)) : zeile)) });
  const teile = relationTeile(t);
  const breite = (v: string, min = 6) => Math.min(40, Math.max(min, v.length + 1));

  return (
    <section className="te-karte" aria-label={`Tabelle ${t.name || 'ohne Namen'}`}>
      <div className="te-kopf">
        <input
          type="text"
          className="te-name"
          value={t.name}
          placeholder="tabellenname"
          aria-label="Tabellenname"
          size={breite(t.name, 12)}
          onChange={(e) => onAendern({ name: e.target.value })}
        />

        <button type="button" className="ghost small" onClick={onDuplizieren}>
          Duplizieren
        </button>
        <button type="button" className="ghost small danger" onClick={onLoeschen}>
          Löschen
        </button>
      </div>
      <div className="te-scroll">
        <table className="te-tabelle">
          <thead>
            <tr>
              {t.spalten.map((s, j) => (
                <th key={j} className={`${s.pk ? 'pk' : ''}${s.fk ? ' fk' : ''}`}>
                  <input
                    type="text"
                    value={s.name}
                    placeholder="spalte"
                    aria-label={`Spalte ${j + 1}`}
                    size={breite(s.name)}
                    onChange={(e) => setzeSpalte(j, { name: e.target.value })}
                  />
                  <div className="te-spalte-knoepfe">
                    <button
                      type="button"
                      className="ghost small"
                      aria-pressed={!!s.pk}
                      title="Primärschlüssel"
                      onClick={() => setzeSpalte(j, { pk: !s.pk })}
                    >
                      PK
                    </button>
                    <button
                      type="button"
                      className="ghost small"
                      aria-pressed={!!s.fk}
                      title="Fremdschlüssel"
                      onClick={() => setzeSpalte(j, { fk: !s.fk })}
                    >
                      FK↑
                    </button>
                    <select
                      className="te-aktion"
                      value=""
                      aria-label={`Spalte ${s.name || j + 1}: Aktion`}
                      onChange={(e) => spalteAktion(j, e.target.value)}
                    >
                      <option value="">⋯</option>
                      <option value="links" disabled={j === 0}>
                        ← nach links
                      </option>
                      <option value="rechts" disabled={j === t.spalten.length - 1}>
                        → nach rechts
                      </option>
                      {andere.map((x) => (
                        <option key={`w${x.id}`} value={`weg:${x.id}`}>
                          nach „{x.name || 'ohne Namen'}“ verschieben
                        </option>
                      ))}
                      {andere.map((x) => (
                        <option key={`k${x.id}`} value={`kopie:${x.id}`}>
                          nach „{x.name || 'ohne Namen'}“ kopieren
                        </option>
                      ))}
                      <option value="kopie:neu">in neue Tabelle kopieren</option>
                      <option value="weg:neu">in neue Tabelle verschieben</option>
                      <option value="loeschen">Spalte löschen</option>
                    </select>
                  </div>
                  {s.fk && (
                    <select
                      className="te-ziel"
                      value={s.ziel ?? ''}
                      aria-label={`Fremdschlüssel ${s.name} verweist auf`}
                      onChange={(e) => setzeSpalte(j, { ziel: e.target.value || undefined })}
                    >
                      <option value="">verweist auf …</option>
                      {alle
                        .filter((x) => x.name.trim())
                        .map((x) => (
                          <option key={x.id} value={x.name.trim()}>
                            → {x.name.trim()}
                          </option>
                        ))}
                    </select>
                  )}
                </th>
              ))}
              <th className="te-neu">
                <button
                  type="button"
                  className="ghost small"
                  onClick={() => onAendern({ spalten: [...t.spalten, { name: '' }], zeilen: t.zeilen.map((z) => [...z, '']) })}
                >
                  + Spalte
                </button>
              </th>
            </tr>
          </thead>
          {t.zeilen.length > 0 && (
            <tbody>
              {t.zeilen.map((z, zi) => (
                <tr key={zi}>
                  {t.spalten.map((_, si) => (
                    <td key={si}>
                      <input
                        type="text"
                        value={z[si] ?? ''}
                        aria-label={`Zeile ${zi + 1}, ${t.spalten[si].name || `Spalte ${si + 1}`}`}
                        size={breite(z[si] ?? '', 4)}
                        onChange={(e) => setzeZelle(zi, si, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="te-neu">
                    <button
                      type="button"
                      className="ghost small"
                      title="Zeile duplizieren"
                      aria-label={`Zeile ${zi + 1} duplizieren`}
                      onClick={() => onAendern({ zeilen: [...t.zeilen.slice(0, zi + 1), [...z], ...t.zeilen.slice(zi + 1)] })}
                    >
                      ⧉
                    </button>
                    <button
                      type="button"
                      className="ghost small danger"
                      title="Zeile löschen"
                      aria-label={`Zeile ${zi + 1} löschen`}
                      onClick={() => onAendern({ zeilen: t.zeilen.filter((_, j) => j !== zi) })}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="te-fuss">
        <button
          type="button"
          className="ghost small"
          onClick={() => onAendern({ zeilen: [...t.zeilen, t.spalten.map(() => '')] })}
          disabled={!t.spalten.length}
        >
          + Datenzeile
        </button>
        <span className="te-relation" aria-label="Relationenschreibweise">
          <RelationText name={t.name} teile={teile} />
        </span>
      </div>
    </section>
  );
}

function RelationText({ name, teile }: { name: string; teile: { text: string; fett: boolean }[] }) {
  return (
    <code>
      {name.trim() || 'tabelle'}(
      {teile.map((x, i) => (
        <span key={i}>
          {i > 0 && ', '}
          {x.fett ? <b className="te-pk">{x.text}</b> : x.text}
        </span>
      ))}
      )
    </code>
  );
}

/** Die abgegebenen Tabellen ohne Bedienelemente. */
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
          {!s.text.trim() && !s.tabellen.length && <p className="muted small">Nichts eingetragen.</p>}
        </section>
      ))}
      {wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
    </div>
  );
}
