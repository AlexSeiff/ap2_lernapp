// Das Beiblatt „Diagrammelemente“ (lib/diagrammBeiblatt.ts): je Notation eine Tabelle mit dem Symbol, wie es in der Zeichnung der App aussieht,
// dem Namen und der Bedeutung. Angezeigt im AnhangPanel (components/Belegsatz.tsx), lazy geladen wie die anderen Anhänge.

import { BEIBLATT, type BeiblattArt, type BeiblattKante } from '../lib/diagrammBeiblatt';
import { FormSymbol, formName } from './DiagrammSvg';

/** Kleine Probe einer Verbindung: Linienart und Pfeilspitze, in denselben Farben wie die Zeichnung. */
function KantenProbe({ kante }: { kante: BeiblattKante }) {
  const klasse = `dg-linie${kante.linie === 'gestrichelt' ? ' dg-strich' : ''}${kante.linie === 'gepunktet' ? ' dg-punkt' : ''}`;
  return (
    <svg viewBox="0 0 40 28" className="diagramm form-symbol" aria-hidden="true" focusable="false">
      <line x1={3} y1={14} x2={kante.pfeil === 'keiner' ? 37 : 32} y2={14} className={klasse} />
      {kante.pfeil === 'gefuellt' && <polygon points="38,14 31,10.5 31,17.5" className="dg-voll" />}
      {kante.pfeil === 'offen' && <polyline points="31,10 37,14 31,18" className="dg-linie" fill="none" />}
    </svg>
  );
}

export function DiagrammBeiblatt({ arten }: { arten: readonly BeiblattArt[] }) {
  return (
    <div className="diagramm-beiblatt">
      {arten.map((art) => {
        const b = BEIBLATT[art];
        return (
          <section key={art} className="beiblatt-art" aria-labelledby={`beiblatt-${art}`}>
            <h3 id={`beiblatt-${art}`}>{b.titel}</h3>
            <table className="anhang-tabelle beiblatt-tabelle">
              <caption className="sr-only">Elemente: {b.titel}</caption>
              <thead>
                <tr>
                  <th scope="col">Symbol</th>
                  <th scope="col">Element</th>
                  <th scope="col">Bedeutung</th>
                </tr>
              </thead>
              <tbody>
                {b.elemente.map((e) => (
                  <tr key={e.form}>
                    <td className="beiblatt-symbol">
                      {e.form === 'text' ? (
                        // Eine Notiz hat keine Form; im Editor steht dafür „Aa“.
                        <span className="beiblatt-notiz" aria-hidden="true">
                          Aa
                        </span>
                      ) : (
                        <FormSymbol form={e.form} />
                      )}
                    </td>
                    <th scope="row">{e.name ?? formName(e.form)}</th>
                    <td>{e.beschreibung}</td>
                  </tr>
                ))}
                {b.kanten.length > 0 && (
                  <tr className="anhang-gruppe">
                    <th colSpan={3} scope="colgroup">
                      Verbindungen
                    </th>
                  </tr>
                )}
                {b.kanten.map((k) => (
                  <tr key={k.name}>
                    <td className="beiblatt-symbol">
                      <KantenProbe kante={k} />
                    </td>
                    <th scope="row">{k.name}</th>
                    <td>{k.beschreibung}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {b.hinweis && <p className="hint">{b.hinweis}</p>}
          </section>
        );
      })}
    </div>
  );
}
