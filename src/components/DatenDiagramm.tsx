import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { kumuliertProzent, wertebereich, type DatenDiagramm as Daten, type DiagrammPunkt } from '../../domain/datenDiagramm';

/**
 * Datendiagramm aus einem ```diagramm-Block (domain/datenDiagramm.ts): Linien-, Säulen-, gestapeltes Säulen- oder Pareto-Diagramm
 * als Inline-SVG. Gezeichnet wird in der tatsächlichen Breite des Containers (ResizeObserver), damit die Schrift auch auf dem Handy
 * lesbar bleibt. Farben nur über CSS-Klassen (Hell/Dunkel/Druck); jede Reihe hat zusätzlich eine eigene Punktform bzw. ein Muster
 * in der Legende. Für Screenreader trägt die Abbildung ihren Titel, die Werte stehen in einer aufklappbaren Tabelle.
 */

const SCHRIFT = 12;
const HOEHE = 280;
const zeichenBreite = (t: string, px = SCHRIFT) => t.length * px * 0.58;

function dezimalen(z: number): number {
  const s = String(Math.round(z * 1e6) / 1e6);
  return s.includes('.') ? s.split('.')[1].length : 0;
}

function zahlFormat(stellen: number) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
}

function schoenerSchritt(spanne: number): number {
  const roh = spanne / 5;
  const pot = 10 ** Math.floor(Math.log10(roh));
  const n = roh / pot;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * pot;
}

/** y-Achse: unten, oben, Schritt und Beschriftungen. */
export function yAchse(d: Daten) {
  const [lo, hi] = wertebereich(d);
  const unten0 = d.yMin ?? Math.min(0, lo);
  const schritt = d.schritt ?? schoenerSchritt((d.yMax ?? hi) - unten0 || 1);
  const unten = d.yMin ?? Math.floor(unten0 / schritt) * schritt;
  const oben = d.yMax ?? Math.ceil(hi / schritt - 1e-9) * schritt;
  // Nachkommastellen wie in den Daten („4,80“ → Achse 4,70 / 4,80 …), mindestens so viele, wie der Schritt braucht.
  const textStellen = d.reihen.flatMap((r) => r.werte.map((w) => w.text.split(',')[1]?.length ?? 0));
  const stellen = Math.min(4, Math.max(dezimalen(schritt), dezimalen(unten), ...textStellen));
  const fmt = zahlFormat(stellen);
  const ticks: number[] = [];
  for (let i = 0; unten + i * schritt <= oben + schritt * 1e-6; i++) ticks.push(Number((unten + i * schritt).toFixed(stellen + 2)));
  return { unten, oben: Math.max(oben, ticks[ticks.length - 1]), ticks, fmt };
}

const prozent = zahlFormat(1);
const prozentText = (p: number) => `${prozent.format(p).replace(/,0$/, '')} %`;

function useBreite<T extends HTMLElement>(start: number) {
  const ref = useRef<T>(null);
  const [breite, setBreite] = useState(start);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const messen = () => {
      const b = Math.round(el.clientWidth);
      if (b > 0) setBreite(Math.max(280, Math.min(b, 760)));
    };
    messen();
    const ro = new ResizeObserver(messen);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, breite] as const;
}

const FORMEN = ['kreis', 'quadrat', 'dreieck', 'raute', 'kreis'] as const;

function Marker({ form, x, y, cls }: { form: (typeof FORMEN)[number]; x: number; y: number; cls: string }) {
  if (form === 'quadrat') return <rect x={x - 4} y={y - 4} width={8} height={8} className={cls} />;
  if (form === 'dreieck') return <polygon points={`${x},${y - 5} ${x + 5},${y + 4} ${x - 5},${y + 4}`} className={cls} />;
  if (form === 'raute') return <polygon points={`${x},${y - 5.5} ${x + 5.5},${y} ${x},${y + 5.5} ${x - 5.5},${y}`} className={cls} />;
  return <circle cx={x} cy={y} r={4} className={cls} />;
}

export function DatenDiagramm({ daten: d }: { daten: Daten }) {
  const [ref, breite] = useBreite<HTMLElement>(640);
  const titelId = useId();
  const achse = yAchse(d);
  const pareto = d.typ === 'pareto';
  const mehrereReihen = d.reihen.length > 1;

  // Ränder: links Platz für die Zahlen der y-Achse, oben für den Achsentitel, rechts beim Pareto für die %-Achse.
  const yLabelBreite = Math.max(...achse.ticks.map((t) => zeichenBreite(achse.fmt.format(t), 11)));
  const rechts = pareto ? 46 : 18;
  const oben = pareto ? 40 : d.y ? 30 : 14;
  const n = d.kategorien.length;
  const xLabelMax = Math.max(...d.kategorien.map((k) => zeichenBreite(k, 11)));
  const links0 = Math.ceil(yLabelBreite + 14);
  const gedreht = xLabelMax + 6 > (breite - links0 - rechts) / n;
  // Gedrehte Beschriftungen ragen unter der ersten Kategorie nach links: so viel Rand, dass sie nicht abgeschnitten werden.
  const links = gedreht ? Math.max(links0, Math.ceil((xLabelMax * 0.82 - 4 - (breite - rechts) / (2 * n)) / (1 - 1 / (2 * n)))) : links0;
  const plotB = breite - links - rechts;
  const slot = plotB / n;
  const xLabelHoehe = gedreht ? Math.min(xLabelMax * 0.6 + 14, 70) : 18;
  const unten = xLabelHoehe + (d.x ? 22 : 6);
  const plotH = HOEHE - oben - unten;
  const yPos = (v: number) => oben + plotH - ((v - achse.unten) / (achse.oben - achse.unten)) * plotH;

  // x-Position: Kategorien in gleichen Abständen, Zahlenkategorien im Liniendiagramm maßstäblich.
  const xz = d.xZahlen;
  const xPos = (i: number) => (xz ? links + 20 + ((xz[i] - xz[0]) / (xz[n - 1] - xz[0])) * (plotB - 40) : links + slot * (i + 0.5));
  const xVonPunkt = (p: DiagrammPunkt) => {
    if (typeof p.x === 'string') return xPos(d.kategorien.indexOf(p.x));
    if (xz) return links + 20 + ((p.x.wert - xz[0]) / (xz[n - 1] - xz[0])) * (plotB - 40);
    return xPos(d.kategorien.indexOf(p.x.text));
  };

  const inhalt: ReactNode[] = [];
  const beschriftungen: ReactNode[] = [];
  const wertText = (key: string, x: number, y: number, text: string, cls = '') =>
    beschriftungen.push(
      <text key={key} x={x} y={y} textAnchor="middle" className={`dd-wert ${cls}`}>
        {text}
      </text>,
    );

  if (d.typ === 'linie') {
    // Wertebeschriftung nur, wenn sie zwischen die Punkte passt (sonst überlappen z. B. 7-stellige Beträge auf dem Handy).
    const abstand = Math.min(...d.kategorien.slice(1).map((_, i) => xPos(i + 1) - xPos(i)));
    const passt = Math.max(...d.reihen.flatMap((r) => r.werte.map((w) => zeichenBreite(w.text, 11)))) + 6 <= abstand;
    d.reihen.forEach((r, ri) => {
      const punkte = r.werte.map((w, i) => `${xPos(i)},${yPos(w.wert)}`).join(' ');
      inhalt.push(<polyline key={`l${ri}`} points={punkte} className={`dd-linie dd-reihe-${ri % 5}`} />);
      r.werte.forEach((w, i) => {
        inhalt.push(<Marker key={`m${ri}-${i}`} form={FORMEN[ri % 5]} x={xPos(i)} y={yPos(w.wert)} cls={`dd-marker dd-reihe-${ri % 5}`} />);
        if (d.werte && passt) wertText(`w${ri}-${i}`, xPos(i), yPos(w.wert) - 9, w.text);
      });
    });
  } else if (d.typ === 'gestapelt') {
    const sb = Math.min(slot * 0.6, 64);
    d.kategorien.forEach((_, i) => {
      let basis = 0;
      d.reihen.forEach((r, ri) => {
        const v = r.werte[i].wert;
        const y1 = yPos(basis + v);
        const h = yPos(basis) - y1;
        if (h > 0)
          inhalt.push(
            <rect key={`s${ri}-${i}`} x={xPos(i) - sb / 2} y={y1} width={sb} height={h} className={`dd-saeule dd-reihe-${ri % 5}`} />,
          );
        if (d.werte && h >= 15 && zeichenBreite(r.werte[i].text, 11) < sb)
          wertText(`w${ri}-${i}`, xPos(i), y1 + h / 2 + 4, r.werte[i].text, 'dd-wert-innen');
        basis += v;
      });
      if (d.werte) {
        const summe = d.reihen.reduce((s, r) => s + r.werte[i].wert, 0);
        wertText(`t${i}`, xPos(i), yPos(summe) - 5, achse.fmt.format(summe).replace(/,0+$/, ''), 'dd-wert-summe');
      }
    });
  } else {
    // Säulen (bei mehreren Reihen gruppiert) und Pareto.
    const k = d.reihen.length;
    const gruppe = Math.min(slot * 0.7, 44 * k);
    const sb = gruppe / k;
    const basis = Math.max(achse.unten, Math.min(0, achse.oben));
    d.reihen.forEach((r, ri) =>
      r.werte.forEach((w, i) => {
        const x = xPos(i) - gruppe / 2 + ri * sb;
        const y1 = yPos(Math.max(w.wert, basis));
        const h = Math.abs(yPos(basis) - yPos(w.wert));
        inhalt.push(
          <rect
            key={`s${ri}-${i}`}
            x={x + 1}
            y={w.wert >= basis ? y1 : yPos(basis)}
            width={Math.max(sb - 2, 2)}
            height={h}
            className={`dd-saeule dd-reihe-${ri % 5}`}
          />,
        );
        // Pareto: Wert in die Säule – über der ersten Säule liegt genau der erste Punkt der Summenlinie.
        if (d.werte && pareto && h >= 16 && zeichenBreite(w.text, 11) <= sb - 4)
          wertText(`w${ri}-${i}`, x + sb / 2, y1 + 14, w.text, 'dd-wert-innen');
        else if (d.werte && zeichenBreite(w.text, 11) <= sb + 6) wertText(`w${ri}-${i}`, x + sb / 2, y1 - 5, w.text);
      }),
    );
    if (pareto) {
      const kum = kumuliertProzent(d.reihen[0].werte.map((w) => w.wert));
      const yP = (p: number) => oben + plotH - (p / 100) * plotH;
      inhalt.push(<polyline key="kum" points={kum.map((p, i) => `${xPos(i)},${yP(p)}`).join(' ')} className="dd-linie dd-reihe-1" />);
      kum.forEach((p, i) => {
        inhalt.push(<Marker key={`km${i}`} form="quadrat" x={xPos(i)} y={yP(p)} cls="dd-marker dd-reihe-1" />);
        if (d.werte) wertText(`kw${i}`, xPos(i), yP(p) - 9, prozentText(p), 'dd-wert-kum');
      });
    }
  }

  d.punkte.forEach((p, i) => {
    const x = xVonPunkt(p);
    const y = yPos(p.y.wert);
    // Beschriftung neben den Punkt, aber innerhalb der Zeichenfläche (auf dem Handy sonst über den Zahlen der y-Achse).
    const tb = zeichenBreite(p.text, 12) * 1.05;
    const lx = Math.min(Math.max(x > links + plotB * 0.6 ? x - 10 - tb : x + 10, links + 4), links + plotB - tb);
    inhalt.push(
      <g key={`p${i}`} className="dd-punkt">
        <line x1={x} y1={y} x2={x} y2={oben + plotH} className="dd-hilfslinie" />
        <line x1={links} y1={y} x2={x} y2={y} className="dd-hilfslinie" />
        <circle cx={x} cy={y} r={6} className="dd-punkt-ring" />
      </g>,
    );
    beschriftungen.push(
      <text key={`pt${i}`} x={lx} y={y - 10} className="dd-punkt-text">
        {p.text}
      </text>,
    );
  });

  const legende = mehrereReihen || pareto;
  const tabelleKopf = [
    d.x || 'Kategorie',
    ...d.reihen.map((r) => r.name),
    ...(d.typ === 'gestapelt' ? ['Summe'] : []),
    ...(pareto ? ['kumuliert in %'] : []),
  ];
  const kum = pareto ? kumuliertProzent(d.reihen[0].werte.map((w) => w.wert)) : [];

  return (
    <figure ref={ref} className="diagramm daten-diagramm" aria-labelledby={titelId}>
      <figcaption id={titelId} className="dd-titel">
        {d.titel}
      </figcaption>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${breite} ${HOEHE}`}
        width={breite}
        height={HOEHE}
        aria-hidden="true"
        focusable="false"
      >
        {d.y && (
          <text x={links - 8} y={14} className="dd-achsentitel">
            {d.y}
          </text>
        )}
        {pareto && (
          <text x={breite - 4} y={14} textAnchor="end" className="dd-achsentitel">
            kumuliert in %
          </text>
        )}
        {achse.ticks.map((t) => (
          <g key={t}>
            <line x1={links} x2={links + plotB} y1={yPos(t)} y2={yPos(t)} className="dd-gitter" />
            <text x={links - 6} y={yPos(t) + 4} textAnchor="end" className="dd-tick">
              {achse.fmt.format(t)}
            </text>
          </g>
        ))}
        {pareto &&
          [0, 20, 40, 60, 80, 100].map((p) => (
            <text key={`r${p}`} x={links + plotB + 6} y={oben + plotH - (p / 100) * plotH + 4} className="dd-tick">
              {p} %
            </text>
          ))}
        {achse.unten !== 0 && achse.unten > 0 && (
          // Achse beginnt nicht bei null: Bruchzeichen am Fuß der y-Achse.
          <path d={`M${links - 5},${oben + plotH - 10} l10,-4 M${links - 5},${oben + plotH - 5} l10,-4`} className="dd-achse" />
        )}
        <line x1={links} y1={oben} x2={links} y2={oben + plotH} className="dd-achse" />
        <line
          x1={links}
          y1={yPos(Math.max(achse.unten, Math.min(0, achse.oben)))}
          x2={links + plotB}
          y2={yPos(Math.max(achse.unten, Math.min(0, achse.oben)))}
          className="dd-achse"
        />
        {pareto && <line x1={links + plotB} y1={oben} x2={links + plotB} y2={oben + plotH} className="dd-achse" />}
        {inhalt}
        {d.kategorien.map((k, i) =>
          gedreht ? (
            <text key={k} transform={`translate(${xPos(i) + 4},${oben + plotH + 12}) rotate(-35)`} textAnchor="end" className="dd-tick">
              {k}
            </text>
          ) : (
            <text key={k} x={xPos(i)} y={oben + plotH + 16} textAnchor="middle" className="dd-tick">
              {k}
            </text>
          ),
        )}
        {d.x && (
          <text x={links + plotB / 2} y={HOEHE - 6} textAnchor="middle" className="dd-achsentitel">
            {d.x}
          </text>
        )}
        {beschriftungen}
      </svg>
      {legende && (
        <ul className="dd-legende" aria-hidden="true">
          {d.reihen.map((r, ri) => (
            <li key={r.name}>
              <span className={`dd-symbol dd-symbol-${d.typ === 'linie' ? 'linie' : 'flaeche'} dd-reihe-${ri % 5}`} />
              {r.name}
            </li>
          ))}
          {pareto && (
            <li>
              <span className="dd-symbol dd-symbol-linie dd-reihe-1" />
              kumulierter Anteil in %
            </li>
          )}
        </ul>
      )}
      <details className="dd-tabelle no-print">
        <summary>Werte als Tabelle</summary>
        <div className="table-wrap">
          <table>
            <caption className="sr-only">{d.titel}</caption>
            <thead>
              <tr>
                {tabelleKopf.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.kategorien.map((k, i) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  {d.reihen.map((r) => (
                    <td key={r.name}>{r.werte[i].text}</td>
                  ))}
                  {d.typ === 'gestapelt' && (
                    <td>{achse.fmt.format(d.reihen.reduce((s, r) => s + r.werte[i].wert, 0)).replace(/,0+$/, '')}</td>
                  )}
                  {pareto && <td>{prozent.format(kum[i])}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {d.punkte.length > 0 && (
          <p>{d.punkte.map((p) => `${p.text}: ${typeof p.x === 'string' ? p.x : p.x.text} | ${p.y.text}`).join('; ')}</p>
        )}
      </details>
    </figure>
  );
}
