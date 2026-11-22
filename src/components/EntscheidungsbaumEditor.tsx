// Entscheidungsbaum wie auf dem Prüfungsbogen (src/lib/entscheidungsbaum.ts): oben die Gesamtmenge, darunter je Merkmal ein Knoten
// (Ellipse) mit Ästen zu den Teilmengen. EntscheidungsbaumBild zeichnet ihn – mit leeren Lücken (Aufgabe, Druck), ausgefüllt
// (Lösung) oder mit Eingabefeldern in den Lücken (Antwort in Klausur und Einzelaufgabe, Rechenübung).

import type { ReactNode } from 'react';
import {
  baumBlock,
  gleicheBaumAb,
  leseBaum,
  type BaumAntwort,
  type BaumFeld,
  type BaumWert,
  type Entscheidungsbaum,
} from '../lib/entscheidungsbaum';

/** Inhalt einer Lücke; ohne Angabe eine leere Schreiblinie. */
type Luecke = (index: number, name: string) => ReactNode;

function Wert({ w, name, luecke }: { w: BaumWert; name: string; luecke?: Luecke }) {
  if (w.art === 'text') return <span className="eb-wert">{w.text}</span>;
  return luecke ? <>{luecke(w.index, name)}</> : <span className="eb-leer" aria-label={`${name}: leer`} />;
}

function Felder({ felder, luecke, wo }: { felder: BaumFeld[]; luecke?: Luecke; wo: string }) {
  return (
    <>
      {felder.map((f, i) => (
        <div key={i} className="eb-feld">
          {f.name && <span className="eb-name">{f.name} =</span>}
          <Wert w={f.wert} name={`${f.name || 'Wert'} (${wo})`} luecke={luecke} />
        </div>
      ))}
    </>
  );
}

export function EntscheidungsbaumBild({ baum, luecke }: { baum: Entscheidungsbaum; luecke?: Luecke }) {
  return (
    <div className="eb-scroll">
      <div className="eb" role="group" aria-label="Entscheidungsbaum">
        <div className="eb-kasten eb-wurzel">
          <Felder felder={baum.wurzel} luecke={luecke} wo="Gesamtmenge" />
        </div>
        {baum.baeume.map((b, bi) => {
          const n = b.zweige.length;
          const merkmal = b.merkmal.art === 'text' ? b.merkmal.text : `Merkmal ${bi + 1}`;
          return (
            <div key={bi} className="eb-baum">
              <div className="eb-knoten">
                <Wert w={b.merkmal} name={`Merkmal von Baum ${bi + 1}`} luecke={luecke} />
              </div>
              <svg className="eb-linien" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                {b.zweige.map((_, i) => (
                  <line key={i} x1="50" y1="0" x2={((i + 0.5) / n) * 100} y2="100" />
                ))}
              </svg>
              <div className="eb-zweige" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                {b.zweige.map((z, zi) => {
                  const wo = `${merkmal}, Zweig ${zi + 1}`;
                  return (
                    <div key={zi} className="eb-zweig">
                      <div className="eb-ast">
                        <Wert w={z.name} name={`Zweig ${zi + 1} von ${merkmal}`} luecke={luecke} />
                      </div>
                      <div className="eb-kasten eb-menge">
                        <Felder felder={z.felder} luecke={luecke} wo={wo} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** ```entscheidungsbaum im Markdown: Bild, bei Fehlern undefined (dann bleibt der Codeblock stehen). */
export function entscheidungsbaumAusText(text: string): ReactNode | undefined {
  const { baum } = leseBaum(text);
  return baum ? <EntscheidungsbaumBild baum={baum} /> : undefined;
}

export function BaumEditor({ baum, wert, onChange }: { baum: Entscheidungsbaum; wert: BaumAntwort; onChange: (w: BaumAntwort) => void }) {
  return (
    <EntscheidungsbaumBild
      baum={baum}
      luecke={(i, name) => (
        <input
          className="eb-eingabe"
          value={wert.luecken[i] ?? ''}
          aria-label={name}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            const luecken = [...wert.luecken];
            luecken[i] = e.target.value;
            onChange({ ...wert, luecken });
          }}
        />
      )}
    />
  );
}

export function BaumAnsicht({ baum, wert }: { baum: Entscheidungsbaum; wert: BaumAntwort }) {
  return (
    <>
      <EntscheidungsbaumBild baum={baum} luecke={(i) => <span className="eb-wert eb-eigen">{wert.luecken[i]?.trim() || '–'}</span>} />
      {wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
    </>
  );
}

/** Beim Bewerten: jede Lücke neben dem Wert der Musterlösung (Merkmale und Zweige dürfen anders sortiert sein). */
export function BaumPruefung({ baum, wert, loesungMarkdown }: { baum: Entscheidungsbaum; wert: BaumAntwort; loesungMarkdown: string }) {
  const block = baumBlock(loesungMarkdown);
  const loesung = block ? leseBaum(block).baum : undefined;
  const befunde = loesung && gleicheBaumAb(baum, wert.luecken, loesung);
  if (!befunde) return null;
  const gleich = befunde.filter((b) => b.status === 'gleich').length;
  return (
    <div className="editor-pruefung">
      <h4>Abgleich mit dem Baum der Musterlösung</h4>
      <p className="small">
        <b>
          {gleich} von {befunde.length}
        </b>{' '}
        Lücken stimmen mit der Musterlösung überein.
      </p>
      <EntscheidungsbaumBild
        baum={baum}
        luecke={(i) => {
          const b = befunde[i];
          return (
            <span className={`eb-wert eb-${b.status}`}>
              {wert.luecken[i]?.trim() || '–'}
              {b.status !== 'gleich' && <span className="wt-muster">Muster: {b.soll || 'leer'}</span>}
            </span>
          );
        }}
      />
      <p className="hint">
        Verglichen werden Zahlen auf vier Nachkommastellen, Teilmengen in der Reihenfolge [ja, nein] und die Namen der Merkmale und Zweige.
        Die Begründung deiner Entscheidung prüfst du selbst.
      </p>
    </div>
  );
}
