import { relationTeile, type Spalte, type Tabelle } from '../../lib/tabellenEditor';

export const ohneSpalte = (t: Tabelle, s: number): Tabelle => ({
  ...t,
  spalten: t.spalten.filter((_, j) => j !== s),
  zeilen: t.zeilen.map((z) => z.filter((_, j) => j !== s)),
});

function tausche<T>(liste: T[], a: number, b: number): T[] {
  const next = [...liste];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

export function TabellenKarte({
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

export function RelationText({ name, teile }: { name: string; teile: { text: string; fett: boolean }[] }) {
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
