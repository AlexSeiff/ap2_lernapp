// Koordinatensystem als Antwort (src/lib/koordinatenAntwort.ts): Punkte per Klick (oder Eingabe) setzen, Geraden als Gleichung eintragen –
// die App zeichnet beides maßstäblich im Raster, in den Farben der Blatt-Diagramme (hell/dunkel). Beim Bewerten steht darunter der Abgleich
// mit den Datenpunkten und Geraden der Aufgabe.

import { useId, useState, type CSSProperties, type MouseEvent } from 'react';
import {
  achsenFuer,
  FORM_NAMEN,
  FORMEN,
  geradeImBereich,
  gleicheKoordinatenAb,
  lesbareGeraden,
  leseGerade,
  pruefeKoordinaten,
  type Achsen,
  type AufgabeMitKontext,
  type KoordinatenAntwort,
  type PunktForm,
} from '../lib/koordinatenAntwort';
import { zahlAus } from '../lib/werteTabelle';
import { Formhinweise } from './DiagrammEditor';
import { Icon } from './Icon';

const B = 640;
const H = 380;
const RAND = { l: 46, r: 20, t: 16, b: 36 };
const zahl = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

/** Teilstriche: der kleinste „runde“ Schritt (1, 2, 5, 10 …), der höchstens etwa 14 Striche ergibt. */
function schritt(von: number, bis: number): number {
  const roh = (bis - von) / 14;
  const basis = 10 ** Math.floor(Math.log10(Math.max(roh, 1e-6)));
  return [1, 2, 5, 10].map((f) => f * basis).find((s) => s >= roh) ?? basis * 10;
}

const striche = (von: number, bis: number) => {
  const s = schritt(von, bis);
  const aus: number[] = [];
  for (let v = Math.ceil(von / s) * s; v <= bis + s / 1000; v += s) aus.push(Math.round(v * 1e6) / 1e6);
  return aus;
};

interface SvgProps {
  achsen: Achsen;
  punkte: KoordinatenAntwort['punkte'];
  geraden: { nr: number; gerade: NonNullable<ReturnType<typeof leseGerade>> }[];
  label: string;
  /** Klick ins Feld: Koordinaten, Bildeinheiten je Einheit der Achsen (für „nächster Punkt“) und ob die Umschalttaste gedrückt war. */
  onKlick?: (x: number, y: number, proEinheit: { x: number; y: number }, fein: boolean) => void;
}

/** Das Koordinatensystem mit Raster, Punkten und Geraden. */
export function KoordinatenSvg({ achsen, punkte, geraden, label, onKlick }: SvgProps) {
  const clip = `ko-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const w = B - RAND.l - RAND.r;
  const h = H - RAND.t - RAND.b;
  const px = (x: number) => RAND.l + ((x - achsen.xVon) / (achsen.xBis - achsen.xVon)) * w;
  const py = (y: number) => RAND.t + h - ((y - achsen.yVon) / (achsen.yBis - achsen.yVon)) * h;
  const xs = striche(achsen.xVon, achsen.xBis);
  const ys = striche(achsen.yVon, achsen.yBis);
  const klick = (e: MouseEvent<SVGSVGElement>) => {
    if (!onKlick) return;
    const r = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - r.left) / r.width) * B;
    const sy = ((e.clientY - r.top) / r.height) * H;
    const x = achsen.xVon + ((sx - RAND.l) / w) * (achsen.xBis - achsen.xVon);
    const y = achsen.yVon + ((RAND.t + h - sy) / h) * (achsen.yBis - achsen.yVon);
    if (x < achsen.xVon - 0.2 || x > achsen.xBis + 0.2 || y < achsen.yVon - 0.2 || y > achsen.yBis + 0.2) return;
    onKlick(x, y, { x: w / (achsen.xBis - achsen.xVon), y: h / (achsen.yBis - achsen.yVon) }, e.shiftKey);
  };
  return (
    <figure className="diagramm ko-zeichnung" style={{ '--dg-breite': B } as CSSProperties}>
      <svg
        viewBox={`0 0 ${B} ${H}`}
        width={B}
        height={H}
        role="img"
        aria-label={label}
        className={onKlick ? 'ko-klickbar' : undefined}
        onClick={klick}
      >
        <defs>
          <clipPath id={clip}>
            <rect x={RAND.l} y={RAND.t} width={w} height={h} />
          </clipPath>
        </defs>
        {xs.map((v) => (
          <g key={`x${v}`}>
            <line x1={px(v)} y1={RAND.t} x2={px(v)} y2={RAND.t + h} className="dg-linie dg-duenn ko-raster" />
            <text x={px(v)} y={RAND.t + h + 16} textAnchor="middle" className="dg-klein dg-leise">
              {zahl(v)}
            </text>
          </g>
        ))}
        {ys.map((v) => (
          <g key={`y${v}`}>
            <line x1={RAND.l} y1={py(v)} x2={RAND.l + w} y2={py(v)} className="dg-linie dg-duenn ko-raster" />
            <text x={RAND.l - 7} y={py(v) + 4} textAnchor="end" className="dg-klein dg-leise">
              {zahl(v)}
            </text>
          </g>
        ))}
        <rect x={RAND.l} y={RAND.t} width={w} height={h} className="dg-linie ko-rahmen" />
        <g clipPath={`url(#${clip})`}>
          {geraden.map(({ nr, gerade }) => {
            const ende = geradeImBereich(gerade, achsen);
            if (!ende) return null;
            const [[x1, y1], [x2, y2]] = ende;
            return (
              <g key={nr}>
                <line x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)} className="dg-linie-akzent dg-dick" />
              </g>
            );
          })}
        </g>
        {geraden.map(({ nr, gerade }) => {
          const ende = geradeImBereich(gerade, achsen);
          if (!ende) return null;
          // Beschriftung am rechten (bei senkrechten am oberen) Ende, innerhalb des Rahmens
          const [, [x2, y2]] = ende;
          const yy = Math.min(Math.max(py(y2), RAND.t + 12), RAND.t + h - 4);
          return (
            <text
              key={`t${nr}`}
              x={Math.min(px(x2), RAND.l + w - 4) - 4}
              y={yy - 6}
              textAnchor="end"
              className="dg-klein dg-fett dg-akzent-text"
            >
              Gerade {nr}
            </text>
          );
        })}
        {punkte.map((p, i) => {
          const x = px(p.x);
          const y = py(p.y);
          return p.form === 'kreis' ? (
            <circle key={i} cx={x} cy={y} r={5} className="dg-voll" />
          ) : p.form === 'kreuz' ? (
            <g key={i}>
              <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} className="dg-linie dg-dick" />
              <line x1={x - 5} y1={y + 5} x2={x + 5} y2={y - 5} className="dg-linie dg-dick" />
            </g>
          ) : (
            <rect key={i} x={x - 8} y={y - 8} width={16} height={16} className="dg-linie" />
          );
        })}
      </svg>
    </figure>
  );
}

const beschreibung = (a: KoordinatenAntwort) =>
  `Koordinatensystem mit ${a.punkte.length} Punkt${a.punkte.length === 1 ? '' : 'en'} und ${lesbareGeraden(a).length} Gerade${lesbareGeraden(a).length === 1 ? '' : 'n'}`;

/** Rasterung: auf halbe Einheiten, mit gedrückter Umschalttaste auf Zehntel. */
const rastern = (v: number, fein: boolean) => (fein ? Math.round(v * 10) / 10 : Math.round(v * 2) / 2);

interface EditorProps {
  wert: KoordinatenAntwort;
  onChange: (w: KoordinatenAntwort) => void;
  task: AufgabeMitKontext;
  /** Formprüfung anzeigen (Einzelaufgabe ja, Klausur nein). */
  hilfen: boolean;
}

export function KoordinatenEditor({ wert, onChange, task, hilfen }: EditorProps) {
  const achsen = achsenFuer(task);
  const [werkzeug, setWerkzeug] = useState<PunktForm | 'radierer'>('kreis');
  const [eingabe, setEingabe] = useState({ x: '', y: '' });
  const meldungen = pruefeKoordinaten(wert, achsen);

  const setzePunkt = (x: number, y: number, form: PunktForm) => {
    const vorhanden = wert.punkte.findIndex((p) => p.form === form && Math.abs(p.x - x) < 1e-9 && Math.abs(p.y - y) < 1e-9);
    // Derselbe Punkt noch einmal: nimmt ihn wieder weg (zweiter Klick auf dasselbe Symbol)
    onChange({ ...wert, punkte: vorhanden >= 0 ? wert.punkte.filter((_, i) => i !== vorhanden) : [...wert.punkte, { x, y, form }] });
  };
  const klick = (x: number, y: number, pro: { x: number; y: number }, fein: boolean) => {
    if (werkzeug === 'radierer') {
      // der nächste Punkt innerhalb von 14 Bildeinheiten (die Zeichnung ist 640 Einheiten breit)
      let best = -1;
      let abstand = 14;
      wert.punkte.forEach((p, i) => {
        const d = Math.hypot((p.x - x) * pro.x, (p.y - y) * pro.y);
        if (d < abstand) {
          abstand = d;
          best = i;
        }
      });
      if (best >= 0) onChange({ ...wert, punkte: wert.punkte.filter((_, i) => i !== best) });
      return;
    }
    setzePunkt(rastern(x, fein), rastern(y, fein), werkzeug);
  };
  const fuegeHinzu = () => {
    const x = zahlAus(eingabe.x);
    const y = zahlAus(eingabe.y);
    if (x === undefined || y === undefined) return;
    if (werkzeug !== 'radierer') setzePunkt(x, y, werkzeug);
    setEingabe({ x: '', y: '' });
  };
  const geraden = lesbareGeraden(wert);

  return (
    <div className="ko">
      <div className="ko-werkzeuge" role="radiogroup" aria-label="Werkzeug">
        {FORMEN.map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={werkzeug === f}
            className={werkzeug === f ? '' : 'secondary'}
            onClick={() => setWerkzeug(f)}
          >
            {FORM_NAMEN[f]}
          </button>
        ))}
        <button
          type="button"
          role="radio"
          aria-checked={werkzeug === 'radierer'}
          className={werkzeug === 'radierer' ? '' : 'secondary'}
          onClick={() => setWerkzeug('radierer')}
        >
          <Icon name="x" /> Radierer
        </button>
      </div>
      <p className="hint small">
        Klick ins Raster setzt einen Punkt (auf halbe Einheiten gerastet, mit Umschalttaste auf Zehntel); ein zweiter Klick auf denselben
        Punkt nimmt ihn weg. Mit dem Radierer entfernst du den nächsten Punkt. Oder gib die Koordinaten ein:
      </p>
      <form
        className="ko-eingabe"
        onSubmit={(e) => {
          e.preventDefault();
          fuegeHinzu();
        }}
      >
        <label>
          <span className="small muted">x</span>
          <input
            inputMode="decimal"
            value={eingabe.x}
            onChange={(e) => setEingabe({ ...eingabe, x: e.target.value })}
            aria-label="x-Wert"
          />
        </label>
        <label>
          <span className="small muted">y</span>
          <input
            inputMode="decimal"
            value={eingabe.y}
            onChange={(e) => setEingabe({ ...eingabe, y: e.target.value })}
            aria-label="y-Wert"
          />
        </label>
        <button
          type="submit"
          className="secondary"
          disabled={werkzeug === 'radierer' || zahlAus(eingabe.x) === undefined || zahlAus(eingabe.y) === undefined}
        >
          Punkt setzen
        </button>
      </form>

      <KoordinatenSvg achsen={achsen} punkte={wert.punkte} geraden={geraden} label={beschreibung(wert)} onKlick={klick} />

      <div className="ko-geraden">
        <p className="small muted">Geraden als Gleichung, z. B. y = 7,5 oder y = 1,5 · x − 1:</p>
        {wert.geraden.map((g, i) => (
          <div key={i} className="ko-gerade">
            <span className="small">Gerade {i + 1}</span>
            <input
              value={g}
              aria-label={`Gleichung der Gerade ${i + 1}`}
              placeholder="y = …"
              onChange={(e) => onChange({ ...wert, geraden: wert.geraden.map((x, k) => (k === i ? e.target.value : x)) })}
            />
            {g.trim() && (leseGerade(g) ? <span className="ok">✓</span> : <span className="bad">nicht lesbar</span>)}
            <button
              type="button"
              className="ghost small"
              aria-label={`Gerade ${i + 1} entfernen`}
              onClick={() => onChange({ ...wert, geraden: wert.geraden.filter((_, k) => k !== i) })}
            >
              <Icon name="x" />
            </button>
          </div>
        ))}
        <button type="button" className="secondary small" onClick={() => onChange({ ...wert, geraden: [...wert.geraden, ''] })}>
          + Gerade
        </button>
      </div>

      {wert.punkte.length > 0 && (
        <details className="ko-liste">
          <summary>{wert.punkte.length} Punkte (Liste)</summary>
          <ul>
            {wert.punkte.map((p, i) => (
              <li key={i}>
                {FORM_NAMEN[p.form]} ({zahl(p.x)} | {zahl(p.y)}){' '}
                <button
                  type="button"
                  className="ghost small"
                  aria-label={`Punkt ${i + 1} entfernen`}
                  onClick={() => onChange({ ...wert, punkte: wert.punkte.filter((_, k) => k !== i) })}
                >
                  <Icon name="x" />
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
      {hilfen && meldungen.length > 0 && <Formhinweise meldungen={meldungen} />}
    </div>
  );
}

export function KoordinatenAnsicht({ wert, task }: { wert: KoordinatenAntwort; task: AufgabeMitKontext }) {
  const achsen = achsenFuer(task);
  const leer = !wert.punkte.length && !lesbareGeraden(wert).length;
  return (
    <div className="ko">
      {leer ? (
        <p className="muted small">Kein Koordinatensystem gezeichnet.</p>
      ) : (
        <KoordinatenSvg achsen={achsen} punkte={wert.punkte} geraden={lesbareGeraden(wert)} label={beschreibung(wert)} />
      )}
      {wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
    </div>
  );
}

/** Beim Bewerten: deine Zeichnung neben den Daten der Aufgabe – fehlende, zusätzliche Punkte, Symbole und Geraden. */
export function KoordinatenPruefung({ task, wert }: { task: AufgabeMitKontext; wert: KoordinatenAntwort }) {
  const a = gleicheKoordinatenAb(task, wert);
  if (!a) return null;
  const nenne = (ps: { label: string }[]) => ps.map((p) => p.label).join(', ');
  return (
    <div className="editor-pruefung">
      <h4>Abgleich mit den Daten der Aufgabe</h4>
      {a.erwartet.length > 0 && (
        <p className="small">
          <b>
            {a.getroffen.length} von {a.erwartet.length}
          </b>{' '}
          Datenpunkten sind eingezeichnet.
        </p>
      )}
      <ul className="te-befund">
        {a.fehlend.length > 0 && (
          <li className="bad">
            fehlt: {nenne(a.fehlend.slice(0, 12))}
            {a.fehlend.length > 12 ? ' …' : ''}
          </li>
        )}
        {a.zusaetzlich.length > 0 && (
          <li>
            {a.zusaetzlich.length} Punkt{a.zusaetzlich.length === 1 ? '' : 'e'} ohne Gegenstück in der Tabelle:{' '}
            {a.zusaetzlich.map((p) => `(${zahl(p.x)} | ${zahl(p.y)})`).join(', ')}
          </li>
        )}
        {a.symboleStimmig === true && <li className="ok">✓ Jede Klasse hat ihr eigenes Symbol.</li>}
        {a.symboleStimmig === false && (
          <li className="bad">Die Klassen haben keine einheitlichen, verschiedenen Symbole (z. B. Kreis für G, Kreuz für P).</li>
        )}
        {a.geraden.map((g) => (
          <li key={g.text} className={g.gezeichnet ? 'ok' : 'bad'}>
            {g.gezeichnet ? '✓' : '✗'} {g.text}
            {g.gezeichnet ? ' ist eingezeichnet' : ' fehlt'}
          </li>
        ))}
      </ul>
      <p className="hint">
        Der Abgleich prüft Lage der Punkte und Geraden – Achsenbeschriftung, Skala und welches Symbol zu welcher Klasse gehört, beurteilst
        du mit der Musterlösung selbst.
      </p>
    </div>
  );
}
