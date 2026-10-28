// Der Anhang der Prüfung, so aufgebaut wie im Belegsatz der AP2 (Daten: src/lib/pruefungsanhang.ts): Formelübersicht mit Netzplan
// und Präfixen, SQL-Syntax-Auszug. Zieht KaTeX nach – nur lazy laden (AnhangPanel in Belegsatz.tsx).

import 'katex/dist/katex.min.css';
import katex from 'katex';
import { Fragment, useMemo } from 'react';
import { FORMEL_GRUPPEN, NETZPLAN_LEGENDE, PRAEFIXE, SQL_GRUPPEN, SQL_STAND } from '../lib/pruefungsanhang';

function Formel({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: block, throwOnError: false, strict: 'ignore', errorColor: 'var(--low)' }),
    [tex, block],
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Text mit eingebetteten `$…$`-Formeln. */
function MitFormeln({ text }: { text: string }) {
  return <>{text.split(/\$([^$]+)\$/).map((teil, i) => (i % 2 ? <Formel key={i} tex={teil} /> : <Fragment key={i}>{teil}</Fragment>))}</>;
}

/** Schlüsselwörter (Wörter in Großbuchstaben) fett, wie im Auszug. */
function Syntax({ text }: { text: string }) {
  return (
    <code className="anhang-syntax">
      {text.split(/\b([A-Z]{2,})\b/).map((teil, i) => (i % 2 ? <b key={i}>{teil}</b> : <Fragment key={i}>{teil}</Fragment>))}
    </code>
  );
}

export function FormelUebersicht() {
  return (
    <div className="belegsatz pruefungsanhang">
      <table className="anhang-tabelle anhang-formeln">
        <tbody>
          {FORMEL_GRUPPEN.map((g) => (
            <Fragment key={g.titel}>
              <tr className="anhang-gruppe">
                <th colSpan={2} scope="colgroup">
                  <MitFormeln text={g.titel} />
                </th>
              </tr>
              {g.zeilen.map((z) => (
                <tr key={g.titel + z.name}>
                  <th scope="row">{z.name}</th>
                  <td className="anhang-formel">
                    {z.vorsatz && (
                      <p className="small">
                        <MitFormeln text={z.vorsatz} />
                      </p>
                    )}
                    <Formel tex={z.tex} block />
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>

      <h2>Netzplan</h2>
      <div className="anhang-netzplan">
        <div className="anhang-knoten" aria-label="Aufbau eines Netzplanknotens">
          <div className="anhang-knoten-ecken">
            <span>FAZ</span>
            <span>FEZ</span>
          </div>
          <table>
            <tbody>
              <tr>
                <td>Vorgang</td>
                <td colSpan={2}>Beschreibung</td>
              </tr>
              <tr>
                <td>Dauer</td>
                <td>GP</td>
                <td>FP</td>
              </tr>
            </tbody>
          </table>
          <div className="anhang-knoten-ecken">
            <span>SAZ</span>
            <span>SEZ</span>
          </div>
        </div>
        <table className="anhang-tabelle">
          <tbody>
            {NETZPLAN_LEGENDE.map(([kurz, lang]) => (
              <tr key={kurz}>
                <th scope="row">{kurz}</th>
                <td>{lang}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Präfixe</h2>
      <div className="table-wrap">
        <table className="anhang-tabelle">
          <thead>
            <tr>
              <th scope="col">Datenmengen (IEC)</th>
              <th scope="col">Wert</th>
              <th scope="col">Physik. Größen (SI)</th>
              <th scope="col">Wert</th>
            </tr>
          </thead>
          <tbody>
            {PRAEFIXE.map((p) => (
              <tr key={p.binaer}>
                <td>{p.binaer}</td>
                <td>
                  <Formel tex={p.wert} />
                </td>
                <td>{p.dezimal}</td>
                <td>
                  <Formel tex={p.dezimalWert} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SqlAuszug() {
  return (
    <div className="belegsatz pruefungsanhang">
      <h2>SQL-Syntax (Auszug)</h2>
      <table className="anhang-tabelle anhang-sql">
        <thead>
          <tr>
            <th scope="col">Syntax</th>
            <th scope="col">Beschreibung</th>
          </tr>
        </thead>
        <tbody>
          {SQL_GRUPPEN.map((g) => (
            <Fragment key={g.titel}>
              <tr className="anhang-gruppe">
                <th colSpan={2} scope="colgroup">
                  {g.titel}
                </th>
              </tr>
              {g.zeilen.map((z) => (
                <tr key={z.syntax}>
                  <td>
                    <Syntax text={z.syntax} />
                  </td>
                  <td>{z.beschreibung}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
      <p className="small muted">Stand {SQL_STAND}</p>
    </div>
  );
}
