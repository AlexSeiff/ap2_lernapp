// Zeichenfläche für das Relationenmodell (Modell: lib/schemaZeichner.ts): Tabellen als Kästen frei platzieren und benennen,
// Spalten eintragen und als Primärschlüssel markieren, Spalten am Griff ⠿ in eine andere Tabelle oder auf die freie Fläche (neue
// Tabelle) ziehen, am Punkt ● einen Fremdschlüssel zur Zieltabelle ziehen. Antippen des Punkts schaltet FK aus und ein.
// Pointer Events (Maus, Finger, Stift). Dasselbe Modell lässt sich in der Tabellenform (TabellenKarte) bearbeiten.

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  benenneUm,
  kastenBreite,
  mitLage,
  neuAnordnen,
  neueTabelleBei,
  SZ_KOPF,
  SZ_ZEILE,
  verbinde,
  verschiebeSpalte,
  verschiebeTabelle,
  zeichnerLinien,
} from '../lib/schemaZeichner';
import type { Spalte, Tabelle } from '../lib/tabellenEditor';
import { Icon } from './Icon';

interface Props {
  tabellen: Tabelle[];
  onChange: (t: Tabelle[]) => void;
  /** Tabellen der anderen Schritte – neue IDs bleiben über alle Schritte eindeutig. */
  andereIds: { id: string }[];
  titel: string;
}

type Zug =
  | { art: 'tabelle'; id: string; dx: number; dy: number; start: [number, number]; bewegt: boolean }
  | { art: 'spalte'; von: string; index: number; p: [number, number]; text: string }
  | { art: 'fk'; von: string; index: number; p: [number, number]; start: [number, number]; bewegt: boolean };

const ziel = (x: number, y: number) =>
  (document.elementFromPoint(x, y)?.closest('[data-sz-tabelle]') as HTMLElement | null)?.dataset.szTabelle;

export function SchemaZeichner({ tabellen: roh, onChange, andereIds, titel }: Props) {
  const tabellen = useMemo(() => mitLage(roh), [roh]);
  const [zug, setZug] = useState<Zug | null>(null);
  const [zurueck, setZurueck] = useState<Tabelle[][]>([]);
  const flaeche = useRef<HTMLDivElement>(null);

  const aendere = (neu: Tabelle[], merken = true) => {
    if (merken) setZurueck((z) => [...z.slice(-29), tabellen]);
    onChange(neu);
  };
  const punkt = (e: { clientX: number; clientY: number }): [number, number] => {
    const r = flaeche.current!.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const fange = (e: ReactPointerEvent) => {
    e.preventDefault();
    try {
      flaeche.current?.setPointerCapture?.(e.pointerId);
    } catch {
      // Zeiger schon weg (oder ein künstliches Ereignis): dann eben ohne Fangen – Bewegen und Loslassen kommen trotzdem an.
    }
  };

  const setzeSpalte = (t: Tabelle, i: number, teil: Partial<Spalte>) =>
    aendere(tabellen.map((x) => (x.id === t.id ? { ...x, spalten: x.spalten.map((s, j) => (j === i ? { ...s, ...teil } : s)) } : x)));
  const spalteWeg = (t: Tabelle, i: number) =>
    aendere(
      tabellen.map((x) =>
        x.id === t.id
          ? { ...x, spalten: x.spalten.filter((_, j) => j !== i), zeilen: x.zeilen.map((z) => z.filter((_, j) => j !== i)) }
          : x,
      ),
    );
  const neueSpalte = (t: Tabelle) =>
    aendere(
      tabellen.map((x) => (x.id === t.id ? { ...x, spalten: [...x.spalten, { name: '' }], zeilen: x.zeilen.map((z) => [...z, '']) } : x)),
    );

  const bewege = (e: ReactPointerEvent) => {
    if (!zug) return;
    const p = punkt(e);
    if (zug.art === 'tabelle') {
      const bewegt = zug.bewegt || Math.hypot(p[0] - zug.start[0], p[1] - zug.start[1]) > 3;
      if (bewegt) onChange(verschiebeTabelle(tabellen, zug.id, p[0] - zug.dx, p[1] - zug.dy));
      if (bewegt !== zug.bewegt) setZug({ ...zug, bewegt });
    } else if (zug.art === 'fk') setZug({ ...zug, p, bewegt: zug.bewegt || Math.hypot(p[0] - zug.start[0], p[1] - zug.start[1]) > 6 });
    else setZug({ ...zug, p });
  };
  const lasseLos = (e: ReactPointerEvent) => {
    if (!zug) return;
    const p = punkt(e);
    const id = ziel(e.clientX, e.clientY);
    if (zug.art === 'spalte') {
      if (id && id !== zug.von) aendere(verschiebeSpalte(tabellen, andereIds, zug.von, zug.index, id));
      else if (!id) aendere(verschiebeSpalte(tabellen, andereIds, zug.von, zug.index, { x: p[0] - 20, y: p[1] - 15 }));
    } else if (zug.art === 'fk') {
      const t = tabellen.find((x) => x.id === zug.von)!;
      if (!zug.bewegt) setzeSpalte(t, zug.index, t.spalten[zug.index].fk ? { fk: false, ziel: undefined } : { fk: true });
      else if (id && id !== zug.von) aendere(verbinde(tabellen, zug.von, zug.index, id));
    }
    setZug(null);
  };

  const linien = zeichnerLinien(tabellen);
  const breite = Math.max(720, ...tabellen.map((t) => (t.x ?? 0) + kastenBreite(t) + 120));
  const hoehe = Math.max(380, ...tabellen.map((t) => (t.y ?? 0) + SZ_KOPF + (t.spalten.length + 1) * SZ_ZEILE + 100));
  const vonZug = zug && zug.art !== 'tabelle' ? tabellen.find((t) => t.id === zug.von) : undefined;
  const zugY = vonZug && zug && zug.art !== 'tabelle' ? (vonZug.y ?? 0) + SZ_KOPF + zug.index * SZ_ZEILE + SZ_ZEILE / 2 : 0;

  return (
    <div className="ed-karte sz-karte">
      <div className="ed-kopf">
        <p className="small muted sz-anleitung">
          <b>⠿</b> Spalte in eine andere Tabelle ziehen (auf die freie Fläche: neue Tabelle) · <b>●</b> zur Zieltabelle ziehen =
          Fremdschlüssel, antippen schaltet FK aus · Kasten am Kopf verschieben
        </p>
        <div className="ed-werkzeuge">
          <button type="button" className="ghost" onClick={() => aendere(neueTabelleBei(tabellen, andereIds, 20, hoehe - 80))}>
            <Icon name="table" /> + Tabelle
          </button>
          <button type="button" className="ghost" onClick={() => aendere(neuAnordnen(tabellen))} disabled={!tabellen.length}>
            <Icon name="layers" /> Anordnen
          </button>
          <span className="ed-abstand" />
          <button
            type="button"
            className="ghost"
            onClick={() => {
              const vorher = zurueck[zurueck.length - 1];
              if (!vorher) return;
              setZurueck((z) => z.slice(0, -1));
              onChange(vorher);
            }}
            disabled={!zurueck.length}
            aria-label="Rückgängig"
            title="Rückgängig"
          >
            <Icon name="rotate-ccw" />
          </button>
        </div>
      </div>
      <div className="ed-scroll" role="region" aria-label={`Zeichenfläche ${titel}`}>
        <div
          ref={flaeche}
          className={`sz-flaeche${zug ? ` zug-${zug.art}` : ''}`}
          style={{ width: breite, height: hoehe }}
          onPointerMove={bewege}
          onPointerUp={lasseLos}
          onPointerCancel={() => setZug(null)}
        >
          <svg className="sz-linien" width={breite} height={hoehe} aria-hidden="true">
            {linien.map((l) => (
              <g key={l.key} className="sd-linie">
                <path d={l.d} />
                <text x={l.n.x} y={l.n.y} textAnchor="middle">
                  n
                </text>
                <text x={l.eins.x} y={l.eins.y} textAnchor="middle">
                  1
                </text>
              </g>
            ))}
            {zug?.art === 'fk' && zug.bewegt && vonZug && (
              <line className="sz-vorschau" x1={(vonZug.x ?? 0) + kastenBreite(vonZug)} y1={zugY} x2={zug.p[0]} y2={zug.p[1]} />
            )}
          </svg>

          {tabellen.map((t) => (
            <div
              key={t.id}
              className={`sz-tabelle${zug && zug.art !== 'tabelle' && zug.von !== t.id ? ' ziel' : ''}`}
              data-sz-tabelle={t.id}
              style={{ left: t.x, top: t.y, width: kastenBreite(t) }}
            >
              <div
                className="sz-kopf"
                style={{ height: SZ_KOPF }}
                onPointerDown={(e) => {
                  if ((e.target as HTMLElement).closest('input, button')) return;
                  const p = punkt(e);
                  fange(e);
                  setZurueck((z) => [...z.slice(-29), tabellen]);
                  setZug({ art: 'tabelle', id: t.id, dx: p[0] - (t.x ?? 0), dy: p[1] - (t.y ?? 0), start: p, bewegt: false });
                }}
              >
                <input
                  className="sz-name"
                  value={t.name}
                  placeholder="tabelle"
                  aria-label="Tabellenname"
                  size={1}
                  onChange={(e) => aendere(benenneUm(tabellen, t.id, e.target.value), false)}
                />
                <button
                  type="button"
                  className="ghost sz-weg"
                  aria-label={`Tabelle ${t.name || 'ohne Namen'} löschen`}
                  title="Tabelle löschen"
                  onClick={() => aendere(tabellen.filter((x) => x.id !== t.id))}
                >
                  ×
                </button>
              </div>
              {t.spalten.map((s, i) => (
                <div key={i} className={`sz-zeile${s.pk ? ' pk' : ''}${s.fk ? ' fk' : ''}`} style={{ height: SZ_ZEILE }}>
                  <span
                    className="sz-griff"
                    title="In eine andere Tabelle ziehen"
                    aria-hidden="true"
                    onPointerDown={(e) => {
                      fange(e);
                      setZug({ art: 'spalte', von: t.id, index: i, p: punkt(e), text: s.name || 'spalte' });
                    }}
                  >
                    ⠿
                  </span>
                  <button
                    type="button"
                    className="ghost sz-pk"
                    aria-pressed={!!s.pk}
                    title="Primärschlüssel"
                    onClick={() => setzeSpalte(t, i, { pk: !s.pk })}
                  >
                    PK
                  </button>
                  <input
                    value={s.name}
                    placeholder="spalte"
                    aria-label={`Spalte ${i + 1} von ${t.name || 'Tabelle'}`}
                    size={1}
                    onChange={(e) =>
                      aendere(
                        tabellen.map((x) =>
                          x.id === t.id ? { ...x, spalten: x.spalten.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)) } : x,
                        ),
                        false,
                      )
                    }
                  />
                  <span className="sz-fk-text" aria-hidden="true">
                    {s.fk ? '↑' : ''}
                  </span>
                  <span
                    className={`sz-punkt${s.fk ? ' an' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={!!s.fk}
                    aria-label={`${s.name || 'Spalte'} als Fremdschlüssel`}
                    title="Zur Zieltabelle ziehen (Fremdschlüssel) – antippen schaltet FK um"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setzeSpalte(t, i, s.fk ? { fk: false, ziel: undefined } : { fk: true });
                      }
                    }}
                    onPointerDown={(e) => {
                      const p = punkt(e);
                      fange(e);
                      setZug({ art: 'fk', von: t.id, index: i, p, start: p, bewegt: false });
                    }}
                  />
                  <button
                    type="button"
                    className="ghost sz-weg"
                    aria-label={`Spalte ${s.name || i + 1} löschen`}
                    onClick={() => spalteWeg(t, i)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" className="ghost sz-neu" onClick={() => neueSpalte(t)}>
                + Spalte
              </button>
            </div>
          ))}

          {zug?.art === 'spalte' && (
            <div className="sz-geist" style={{ left: zug.p[0] + 8, top: zug.p[1] - 12 }}>
              {zug.text}
            </div>
          )}
          {!tabellen.length && <p className="sz-leer muted">Noch keine Tabelle. Leg mit „+ Tabelle“ die erste an.</p>}
        </div>
      </div>
    </div>
  );
}
