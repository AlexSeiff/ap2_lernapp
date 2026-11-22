// Struktogramm zum Zuordnen wie auf dem Prüfungsbogen (src/lib/struktogrammVorlage.ts): oben die nummerierten Anweisungen, darunter
// das Gerüst. In jedes leere Feld kommt eine Ziffer – die App zeigt sofort die Anweisung dazu, so entsteht das Struktogramm beim
// Eintragen, und in der Liste ist abgehakt, was schon vergeben ist. Ohne Eingabe (Aufgabe im Druck, Lösung) dasselbe als Bild.

import type { ReactNode } from 'react';
import type { Baustein } from '../lib/struktogramm';
import {
  feldInhalt,
  leseStruktogrammVorlage,
  loesungsZiffern,
  pruefeZuordnung,
  struktogrammBlock,
  type Anweisung,
  type StruktogrammVorlage,
  type ZuordnungAntwort,
} from '../lib/struktogrammVorlage';
import { Formhinweise } from './diagramm/Formhinweise';
import { StruktogrammGeruest } from './StruktogrammEditor';

function Auswahl({ auswahl, vergeben }: { auswahl: Anweisung[]; vergeben?: Set<string> }) {
  if (!auswahl.length) return null;
  return (
    <div className="table-wrap">
      <table className="sz-auswahl">
        <tbody>
          {auswahl.map((a) => {
            const weg = vergeben?.has(a.nr);
            return (
              <tr key={a.nr} className={weg ? 'sz-vergeben' : undefined}>
                <th scope="row">{a.nr}</th>
                <td>
                  <code>{a.text}</code>
                </td>
                {vergeben && <td className="sz-haken">{weg ? <span title="schon eingetragen">✓</span> : null}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Anweisung zur Ziffer, wenn es sie gibt. */
const anweisung = (v: StruktogrammVorlage, nr: string) => v.auswahl.find((a) => a.nr === nr.trim())?.text;

function Bild({ vorlage, zelle, vergeben }: { vorlage: StruktogrammVorlage; zelle: (b: Baustein) => ReactNode; vergeben?: Set<string> }) {
  return (
    <div className="sz">
      <Auswahl auswahl={vorlage.auswahl} vergeben={vergeben} />
      {vorlage.titel && <p className="sz-titel">{vorlage.titel}</p>}
      <div className="sg-scroll">
        <StruktogrammGeruest bausteine={vorlage.bausteine} zelle={zelle} />
      </div>
    </div>
  );
}

/** Feste Zelle, leeres Feld oder (Lösung) Ziffer mit Anweisung. */
function statischeZelle(vorlage: StruktogrammVorlage, b: Baustein): ReactNode {
  const f = feldInhalt(b.text);
  if (f.art === 'text') return <span className="sg-text">{f.text}</span>;
  if (f.art === 'leer') return <span className="sg-text sz-leer" aria-label={`Feld ${vorlage.felder.get(b.id)}: leer`} />;
  return (
    <span className="sg-text sz-gefuellt">
      <b className="sz-nr">{f.nr}</b> <code>{anweisung(vorlage, f.nr) ?? '?'}</code>
    </span>
  );
}

/**
 * Gerüst einer Diagramm-Übung vom Typ Struktogramm: die Lücken kommen von außen (Feld 1, 2, … in Zeilenreihenfolge),
 * die Anweisungen stehen dort in der Palette.
 */
export function StruktogrammLueckenBild({ text, luecke }: { text: string; luecke: (feld: number) => ReactNode }) {
  const { vorlage, fehler } = leseStruktogrammVorlage(text);
  if (!vorlage) return <p className="bad">Das Struktogramm dieser Übung ist fehlerhaft: {fehler}</p>;
  return (
    <div className="sz">
      {vorlage.titel && <p className="sz-titel">{vorlage.titel}</p>}
      <div className="sg-scroll">
        <StruktogrammGeruest
          bausteine={vorlage.bausteine}
          zelle={(b) => {
            const n = vorlage.felder.get(b.id);
            return n ? luecke(n) : statischeZelle(vorlage, b);
          }}
        />
      </div>
    </div>
  );
}

export function StruktogrammVorlageBild({ vorlage }: { vorlage: StruktogrammVorlage }) {
  return <Bild vorlage={vorlage} zelle={(b) => statischeZelle(vorlage, b)} />;
}

/** ```struktogramm im Markdown: Bild, bei Fehlern undefined (dann bleibt der Codeblock stehen). */
export function struktogrammAusText(text: string): ReactNode | undefined {
  const { vorlage } = leseStruktogrammVorlage(text);
  return vorlage ? <StruktogrammVorlageBild vorlage={vorlage} /> : undefined;
}

/** Zelle mit eingetragener (oder eingebbarer) Ziffer und der Anweisung dazu. */
function Ziffernzelle({ vorlage, nr, feld, eingabe }: { vorlage: StruktogrammVorlage; nr: string; feld: number; eingabe?: ReactNode }) {
  const text = nr.trim() ? anweisung(vorlage, nr) : undefined;
  return (
    <span className="sg-text sz-zelle">
      {eingabe ?? <b className="sz-nr">{nr.trim() || '–'}</b>}
      <span className={`sz-anweisung${nr.trim() && !text ? ' bad' : ''}`}>
        {nr.trim() ? text ? <code>{text}</code> : 'nicht in der Liste' : <span className="muted">Feld {feld}</span>}
      </span>
    </span>
  );
}

export function ZuordnungEditor({
  vorlage,
  wert,
  onChange,
  hilfen,
}: {
  vorlage: StruktogrammVorlage;
  wert: ZuordnungAntwort;
  onChange: (w: ZuordnungAntwort) => void;
  hilfen: boolean;
}) {
  const vergeben = new Set(wert.felder.map((f) => f.trim()).filter(Boolean));
  return (
    <div className="sg-arbeit">
      <Bild
        vorlage={vorlage}
        vergeben={vergeben}
        zelle={(b) => {
          const n = vorlage.felder.get(b.id);
          if (!n) return statischeZelle(vorlage, b);
          const i = n - 1;
          return (
            <Ziffernzelle
              vorlage={vorlage}
              nr={wert.felder[i] ?? ''}
              feld={n}
              eingabe={
                <input
                  className="sz-eingabe"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={`Feld ${n}: Ziffer der Anweisung`}
                  value={wert.felder[i] ?? ''}
                  onChange={(e) => {
                    const felder = [...wert.felder];
                    felder[i] = e.target.value.replace(/[^\d]/g, '').slice(0, 3);
                    onChange({ ...wert, felder });
                  }}
                />
              }
            />
          );
        }}
      />
      {hilfen && vergeben.size > 0 && <Formhinweise meldungen={pruefeZuordnung(vorlage, wert.felder)} />}
    </div>
  );
}

export function ZuordnungAnsicht({ vorlage, wert }: { vorlage: StruktogrammVorlage; wert: ZuordnungAntwort }) {
  return (
    <>
      <Bild
        vorlage={vorlage}
        zelle={(b) => {
          const n = vorlage.felder.get(b.id);
          return n ? <Ziffernzelle vorlage={vorlage} nr={wert.felder[n - 1] ?? ''} feld={n} /> : statischeZelle(vorlage, b);
        }}
      />
      {wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
    </>
  );
}

/** Beim Bewerten: Feld für Feld neben der Ziffer der Musterlösung. */
export function ZuordnungPruefung({
  vorlage,
  wert,
  loesungMarkdown,
}: {
  vorlage: StruktogrammVorlage;
  wert: ZuordnungAntwort;
  loesungMarkdown: string;
}) {
  const block = struktogrammBlock(loesungMarkdown);
  const loesung = block ? leseStruktogrammVorlage(block).vorlage : undefined;
  if (!loesung || loesung.anzahl !== vorlage.anzahl) return null;
  const soll = loesungsZiffern(loesung);
  const gleich = soll.filter((s, i) => s && s === wert.felder[i]?.trim()).length;
  return (
    <div className="editor-pruefung">
      <h4>Abgleich mit der Musterlösung</h4>
      <p className="small">
        <b>
          {gleich} von {vorlage.anzahl}
        </b>{' '}
        Feldern stimmen mit der Musterlösung überein.
      </p>
      <div className="table-wrap">
        <table className="wt-tabelle wt-abgleich">
          <thead>
            <tr>
              <th scope="col">Feld</th>
              <th scope="col">Deine Ziffer</th>
              <th scope="col">Muster</th>
            </tr>
          </thead>
          <tbody>
            {soll.map((s, i) => {
              const d = wert.felder[i]?.trim() ?? '';
              const status = !d ? 'fehlt' : d === s ? 'gleich' : 'abweichend';
              return (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td className={`wt-${status}`}>
                    {d || '–'} {d && anweisung(vorlage, d) && <code className="small">{anweisung(vorlage, d)}</code>}
                  </td>
                  <td>
                    {s} <code className="small">{anweisung(vorlage, s)}</code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="hint">
        Der Abgleich kennt nur die eine Musterlösung. Lies den Prüferkommentar: Manche Felder dürfen getauscht sein (z. B. zwei
        Leseanweisungen hintereinander) – dann zählen sie trotzdem.
      </p>
    </div>
  );
}
