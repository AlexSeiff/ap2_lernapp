// Wertetabelle als Antwort (src/lib/werteTabelle.ts): sieht aus wie eine Tabelle auf dem Blatt – Kopfzeile, waagerechte Linien,
// sonst nichts –, nur sind die Zellen randlose Eingabefelder („Kreuzen Sie an“: Kästchen). Vorgegebene Zellen der Aufgabe stehen als
// Text; gibt die Aufgabe die Tabelle so vor, bleibt die Zeilenzahl fest, sonst lassen sich Zeilen ergänzen und entfernen.
// WerteAnsicht zeigt die abgegebene Tabelle ohne Eingabe.

import { istVorgegeben, type WerteAntwort, type WerteVorlage } from '../lib/werteTabelle';
import { Icon } from './Icon';

interface Props {
  wert: WerteAntwort;
  vorlage: WerteVorlage;
  onChange: (w: WerteAntwort) => void;
}

export function WerteEditor({ wert, vorlage, onChange }: Props) {
  const setze = (zi: number, si: number, text: string) =>
    onChange({ ...wert, zeilen: wert.zeilen.map((r, i) => (i === zi ? r.map((z, j) => (j === si ? text : z)) : r)) });
  const neueZeile = () => onChange({ ...wert, zeilen: [...wert.zeilen, wert.kopf.map(() => '')] });
  const entferne = (zi: number) => onChange({ ...wert, zeilen: wert.zeilen.filter((_, i) => i !== zi) });
  // Gibt die Aufgabe die Tabelle mit Zellen vor (wie auf dem Prüfungsbogen), bleibt die Zeilenzahl fest.
  const fest = vorlage.zeilen.some((r) => r.some((z) => z.trim()));
  const entfernbar = !fest && wert.zeilen.length > 1;

  return (
    <div className="wt">
      <div className="table-wrap">
        <table className="wt-tabelle">
          <thead>
            <tr>
              {wert.kopf.map((k, i) => (
                <th key={i} scope="col">
                  {k}
                </th>
              ))}
              {!fest && <th className="wt-aktion" aria-hidden="true" />}
            </tr>
          </thead>
          <tbody>
            {wert.zeilen.map((r, zi) => (
              <tr key={zi}>
                {r.map((z, si) =>
                  istVorgegeben(vorlage, zi, si) ? (
                    <td key={si} className="wt-fest">
                      {z}
                    </td>
                  ) : vorlage.kreuze && si > 0 ? (
                    <td key={si} className="wt-kreuz">
                      <input
                        type="checkbox"
                        checked={!!z.trim()}
                        aria-label={`${r[0] || `Zeile ${zi + 1}`}: ${wert.kopf[si]}`}
                        onChange={(e) => setze(zi, si, e.target.checked ? 'X' : '')}
                      />
                    </td>
                  ) : (
                    <td key={si}>
                      <input
                        className="wt-zelle"
                        value={z}
                        aria-label={`${wert.kopf[si] || `Spalte ${si + 1}`}, Zeile ${zi + 1}`}
                        onChange={(e) => setze(zi, si, e.target.value)}
                      />
                    </td>
                  ),
                )}
                {!fest && (
                  <td className="wt-aktion">
                    {entfernbar && (
                      <button type="button" className="ghost small" aria-label={`Zeile ${zi + 1} entfernen`} onClick={() => entferne(zi)}>
                        <Icon name="x" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!fest && (
        <button type="button" className="ghost small wt-neu" onClick={neueZeile}>
          + Zeile
        </button>
      )}
    </div>
  );
}

export function WerteAnsicht({ wert }: { wert: WerteAntwort }) {
  const zeilen = wert.zeilen.filter((r) => r.some((z) => z.trim()));
  return (
    <div className="wt">
      <div className="table-wrap">
        <table className="wt-tabelle">
          <thead>
            <tr>
              {wert.kopf.map((k, i) => (
                <th key={i} scope="col">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zeilen.map((r, zi) => (
              <tr key={zi}>
                {r.map((z, si) => (
                  <td key={si}>{z}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
    </div>
  );
}
