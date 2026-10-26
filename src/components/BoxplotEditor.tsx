// Boxplot als Antwort (src/lib/boxplotAntwort.ts): fünf Kennwerte und die Ausreißer eintragen, darunter entsteht der Boxplot
// maßstäblich – mit beschrifteter Box, Median, Whiskern und Ausreißern, in den Farben der Blatt-Diagramme (hell/dunkel).
// Beim Bewerten stehen dein Boxplot und der der Musterlösung auf derselben Achse untereinander.

import type { CSSProperties } from 'react';
import {
  achse,
  boxplotZahlen,
  gleicheBoxplotAb,
  KENNWERT_NAMEN,
  KENNWERTE,
  pruefeBoxplot,
  type BoxplotAntwort,
  type BoxplotZahlen,
} from '../lib/boxplotAntwort';
import type { Task } from '../../shared/types';
import { Formhinweise } from './DiagrammEditor';

const B = 640;
const ZEILE = 78;
const zahl = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

interface Reihe {
  titel?: string;
  z: BoxplotZahlen;
  akzent?: boolean;
}

/** Einer oder mehrere Boxplots auf gemeinsamer Achse; mit Titel je Reihe (Abgleich) rückt die Zeichnung nach rechts. */
export function BoxplotSvg({ reihen, label }: { reihen: Reihe[]; label: string }) {
  const links = reihen.some((r) => r.titel) ? 120 : 36;
  const rechts = 34;
  const a = achse(reihen.flatMap((r) => [r.z.min, r.z.max, ...r.z.ausreisser]));
  const x = (v: number) => links + ((v - a.von) / (a.bis - a.von)) * (B - links - rechts);
  const ay = 24 + reihen.length * ZEILE;
  const h = ay + 34;
  return (
    <figure className="diagramm bp-zeichnung" style={{ '--dg-breite': B } as CSSProperties}>
      <svg viewBox={`0 0 ${B} ${h}`} width={B} height={h} role="img" aria-label={label}>
        {reihen.map((r, i) => {
          const y = 40 + i * ZEILE;
          const { z } = r;
          const box = r.akzent ? 'dg-akzent' : 'dg-grau';
          return (
            <g key={i}>
              {r.titel && (
                <text x={8} y={y} dominantBaseline="middle" className="dg-klein dg-fett">
                  {r.titel}
                </text>
              )}
              <line x1={x(z.min)} y1={y} x2={x(z.q1)} y2={y} className="dg-linie" />
              <line x1={x(z.q3)} y1={y} x2={x(z.max)} y2={y} className="dg-linie" />
              <line x1={x(z.min)} y1={y - 11} x2={x(z.min)} y2={y + 11} className="dg-linie" />
              <line x1={x(z.max)} y1={y - 11} x2={x(z.max)} y2={y + 11} className="dg-linie" />
              <rect x={x(z.q1)} y={y - 16} width={Math.max(1, x(z.q3) - x(z.q1))} height={32} className={box} />
              <line x1={x(z.median)} y1={y - 16} x2={x(z.median)} y2={y + 16} className="dg-linie dg-dick" />
              {z.ausreisser.map((o, j) => (
                <g key={j}>
                  <circle cx={x(o)} cy={y} r={4.5} className="dg-form" />
                  <text x={x(o)} y={y + 24} textAnchor="middle" dominantBaseline="middle" className="dg-klein">
                    {zahl(o)}
                  </text>
                </g>
              ))}
              {!!z.ausreisser.length && (
                <text
                  x={x(z.ausreisser[z.ausreisser.length - 1])}
                  y={y - 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="dg-klein dg-leise"
                >
                  Ausreißer
                </text>
              )}
              <text x={x(z.q1)} y={y - 25} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
                {zahl(z.q1)}
              </text>
              <text x={x(z.median)} y={y - 25} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
                {zahl(z.median)}
              </text>
              <text x={x(z.q3)} y={y - 25} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
                {zahl(z.q3)}
              </text>
              <text x={x(z.min)} y={y + 24} textAnchor="middle" dominantBaseline="middle" className="dg-klein">
                {zahl(z.min)}
              </text>
              <text x={x(z.max)} y={y + 24} textAnchor="middle" dominantBaseline="middle" className="dg-klein">
                {zahl(z.max)}
              </text>
            </g>
          );
        })}
        <line x1={x(a.von)} y1={ay} x2={x(a.bis)} y2={ay} className="dg-linie" />
        {a.striche.map((v) => (
          <g key={v}>
            <line x1={x(v)} y1={ay} x2={x(v)} y2={ay + 5} className="dg-linie" />
            <text x={x(v)} y={ay + 17} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-leise">
              {zahl(v)}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

const beschreibung = (z: BoxplotZahlen) =>
  `Boxplot: Whisker von ${zahl(z.min)} bis ${zahl(z.max)}, Box von ${zahl(z.q1)} bis ${zahl(z.q3)}, Median ${zahl(z.median)}` +
  (z.ausreisser.length ? `, Ausreißer ${z.ausreisser.map(zahl).join('; ')}` : ', keine Ausreißer');

interface EditorProps {
  wert: BoxplotAntwort;
  onChange: (w: BoxplotAntwort) => void;
  /** Formprüfung anzeigen (Einzelaufgabe ja, Klausur nein). */
  hilfen: boolean;
}

export function BoxplotEditor({ wert, onChange, hilfen }: EditorProps) {
  const z = boxplotZahlen(wert);
  const meldungen = pruefeBoxplot(wert);
  return (
    <div className="bp">
      <div className="bp-felder">
        {KENNWERTE.map((k) => (
          <label key={k}>
            <span className="small muted">{KENNWERT_NAMEN[k]}</span>
            <input
              inputMode="decimal"
              value={wert.werte[k]}
              onChange={(e) => onChange({ ...wert, werte: { ...wert.werte, [k]: e.target.value } })}
            />
          </label>
        ))}
        <label className="bp-ausreisser">
          <span className="small muted">Ausreißer (mehrere mit ; trennen, sonst leer)</span>
          <input inputMode="decimal" value={wert.ausreisser} onChange={(e) => onChange({ ...wert, ausreisser: e.target.value })} />
        </label>
      </div>
      {z ? (
        <BoxplotSvg reihen={[{ z, akzent: true }]} label={beschreibung(z)} />
      ) : (
        <p className="hint">Sobald alle fünf Kennwerte eingetragen sind, zeichnet die App deinen Boxplot hier maßstäblich.</p>
      )}
      {/* Formprüfung erst, wenn es etwas zu prüfen gibt – „trag alle Werte ein“ sagt schon der Hinweis oben. */}
      {hilfen && (z || meldungen.length > 1 || (meldungen[0] && !meldungen[0].startsWith('Trag alle'))) && (
        <Formhinweise meldungen={meldungen.filter((m) => !m.startsWith('Trag alle'))} />
      )}
    </div>
  );
}

export function BoxplotAnsicht({ wert }: { wert: BoxplotAntwort }) {
  const z = boxplotZahlen(wert);
  return (
    <div className="bp">
      {z ? (
        <BoxplotSvg reihen={[{ z, akzent: true }]} label={beschreibung(z)} />
      ) : (
        <p className="muted small">Kein vollständiger Boxplot eingetragen.</p>
      )}
      {wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
    </div>
  );
}

/** Beim Bewerten: dein Boxplot über dem der Musterlösung, darunter die Werte im Vergleich. */
export function BoxplotPruefung({ task, wert }: { task: Task; wert: BoxplotAntwort }) {
  const a = gleicheBoxplotAb(task, wert);
  if (!a) return null;
  const z = boxplotZahlen(wert);
  const reihen: Reihe[] = [...(z ? [{ titel: 'Dein Boxplot', z, akzent: true }] : []), { titel: 'Musterlösung', z: a.muster }];
  return (
    <div className="editor-pruefung">
      <h4>Abgleich mit dem Boxplot der Musterlösung</h4>
      <BoxplotSvg reihen={reihen} label={`Vergleich – ${z ? `dein ${beschreibung(z)}; ` : ''}Musterlösung: ${beschreibung(a.muster)}`} />
      <div className="table-wrap">
        <table className="wt-tabelle wt-abgleich">
          <thead>
            <tr>
              <th scope="col">Element</th>
              <th scope="col">Deins</th>
              <th scope="col">Musterlösung</th>
            </tr>
          </thead>
          <tbody>
            {a.zeilen.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td className={r.ok ? 'wt-gleich' : 'wt-abweichend'}>{r.dein}</td>
                <td>{r.muster}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint">
        Andere Quartilskonventionen verschieben Q1 und Q3 leicht – das zählt, wenn du die Methode angibst (siehe Prüferkommentar).
        Entscheidend ist das obere Whisker-Ende: der größte Wert innerhalb des Zauns, nicht der Zaun selbst.
      </p>
    </div>
  );
}
