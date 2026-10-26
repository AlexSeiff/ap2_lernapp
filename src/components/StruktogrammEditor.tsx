// Struktogramm-Baukasten (src/lib/struktogramm.ts): Bausteine als verschachtelte Nassi-Shneiderman-Kästen – Verzweigung mit Dreieck
// und ja/nein, Schleifen mit Balken links. Texte stehen direkt im Kasten, „+ Baustein“ am Ende jeder Folge fügt an, ↑ ↓ ✕ ordnen um.
// StruktogrammAnsicht zeigt dasselbe ohne Bedienelemente (nach der Abgabe), StruktogrammPruefung beim Bewerten Formprüfung und Gliederung.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  BAUSTEIN_NAMEN,
  entferne,
  fuegeAn,
  neuerBaustein,
  PLATZHALTER,
  pruefeStruktogramm,
  setzeText,
  struktogrammAlsText,
  verschiebe,
  type Baustein,
  type BausteinArt,
  type Ort,
  type StruktogrammAntwort,
} from '../lib/struktogramm';
import { Formhinweise } from './DiagrammEditor';
import { Icon } from './Icon';

interface Ctx {
  /** undefined: nur ansehen. */
  aendere?: (fn: (liste: Baustein[]) => Baustein[]) => void;
}

const ARTEN: BausteinArt[] = ['anweisung', 'wenn', 'solange', 'wiederhole'];

function Folge({ liste, ort, ctx }: { liste: Baustein[]; ort: Ort; ctx: Ctx }) {
  return (
    <div className="sg-folge">
      {!liste.length && (
        <div className="sg-leer" title="leerer Zweig: keine Anweisung">
          ∅
        </div>
      )}
      {liste.map((b, i) => (
        <BausteinKasten key={b.id} b={b} erster={i === 0} letzter={i === liste.length - 1} ctx={ctx} />
      ))}
      {ctx.aendere && (
        <div className="sg-neu-zeile">
          <select
            className="sg-neu"
            value=""
            aria-label="Baustein hinzufügen"
            onChange={(e) => {
              const art = e.target.value as BausteinArt;
              if (art) ctx.aendere!((l) => fuegeAn(l, ort, neuerBaustein(art)));
            }}
          >
            <option value="">+ Baustein</option>
            {ARTEN.map((a) => (
              <option key={a} value={a}>
                {BAUSTEIN_NAMEN[a]}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function Text({ b, ctx, label }: { b: Baustein; ctx: Ctx; label: string }) {
  if (!ctx.aendere) return <span className="sg-text">{b.text.trim() || '…'}</span>;
  return (
    <input
      className="sg-text"
      value={b.text}
      placeholder={PLATZHALTER[b.art]}
      aria-label={label}
      onChange={(e) => ctx.aendere!((l) => setzeText(l, b.id, e.target.value))}
    />
  );
}

function Aktionen({ b, erster, letzter, ctx }: { b: Baustein; erster: boolean; letzter: boolean; ctx: Ctx }) {
  if (!ctx.aendere) return null;
  const name = BAUSTEIN_NAMEN[b.art].replace(/ \(.*\)$/, '');
  return (
    <span className="sg-aktionen">
      <button
        type="button"
        className="ghost small"
        aria-label={`${name} nach oben`}
        disabled={erster}
        onClick={() => ctx.aendere!((l) => verschiebe(l, b.id, -1))}
      >
        ↑
      </button>
      <button
        type="button"
        className="ghost small"
        aria-label={`${name} nach unten`}
        disabled={letzter}
        onClick={() => ctx.aendere!((l) => verschiebe(l, b.id, 1))}
      >
        ↓
      </button>
      <button type="button" className="ghost small" aria-label={`${name} entfernen`} onClick={() => ctx.aendere!((l) => entferne(l, b.id))}>
        <Icon name="x" />
      </button>
    </span>
  );
}

/**
 * Die Zweige sind so breit wie ihr Inhalt (gleich breite Zweige verdoppeln die Breite mit jeder Verschachtelung). Damit die Spitze
 * des Dreiecks über der Trennlinie sitzt, wird der Anteil des Ja-Zweigs gemessen (ohne Messung, z. B. beim Server-Rendern: Mitte).
 */
function Verzweigung({ b, ctx, aktionen }: { b: Extract<Baustein, { art: 'wenn' }>; ctx: Ctx; aktionen: ReactNode }) {
  const zweige = useRef<HTMLDivElement>(null);
  const [spitze, setSpitze] = useState(50);
  useEffect(() => {
    const el = zweige.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const messe = () => {
      const ja = el.firstElementChild?.getBoundingClientRect().width ?? 0;
      const ganz = el.getBoundingClientRect().width;
      if (ja && ganz) setSpitze(Math.round((ja / ganz) * 1000) / 10);
    };
    messe();
    const ro = new ResizeObserver(messe);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="sg-b sg-wenn">
      <div className="sg-wenn-kopf">
        <svg className="sg-dreieck" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <line x1="0" y1="0" x2={spitze} y2="100" />
          <line x1="100" y1="0" x2={spitze} y2="100" />
        </svg>
        <Text b={b} ctx={ctx} label="Bedingung der Verzweigung" />
        <span className="sg-ja">ja</span>
        <span className="sg-nein">nein</span>
        {aktionen}
      </div>
      <div className="sg-zweige" ref={zweige}>
        <Folge liste={b.ja} ort={{ in: b.id, teil: 'ja' }} ctx={ctx} />
        <Folge liste={b.nein} ort={{ in: b.id, teil: 'nein' }} ctx={ctx} />
      </div>
    </div>
  );
}

function BausteinKasten({ b, erster, letzter, ctx }: { b: Baustein; erster: boolean; letzter: boolean; ctx: Ctx }) {
  const aktionen = <Aktionen b={b} erster={erster} letzter={letzter} ctx={ctx} />;
  if (b.art === 'anweisung')
    return (
      <div className="sg-b sg-anweisung">
        <Text b={b} ctx={ctx} label="Anweisung" />
        {aktionen}
      </div>
    );
  if (b.art === 'wenn') return <Verzweigung b={b} ctx={ctx} aktionen={aktionen} />;
  const kopf = (
    <div className="sg-kopf">
      <Text
        b={b}
        ctx={ctx}
        label={b.art === 'solange' ? 'Bedingung der kopfgesteuerten Schleife' : 'Abbruchbedingung der fußgesteuerten Schleife'}
      />
      {aktionen}
    </div>
  );
  return (
    <div className={`sg-b sg-schleife sg-${b.art}`}>
      {b.art === 'solange' && kopf}
      <div className="sg-rumpf">
        <Folge liste={b.rumpf} ort={{ in: b.id, teil: 'rumpf' }} ctx={ctx} />
      </div>
      {b.art === 'wiederhole' && kopf}
    </div>
  );
}

export function StruktogrammEditor({
  wert,
  onChange,
  hilfen,
}: {
  wert: StruktogrammAntwort;
  onChange: (w: StruktogrammAntwort) => void;
  /** Formprüfung anzeigen (Einzelaufgabe ja, Klausur nein). */
  hilfen: boolean;
}) {
  const ctx: Ctx = { aendere: (fn) => onChange({ ...wert, bausteine: fn(wert.bausteine) }) };
  return (
    <div className="sg-arbeit">
      <div className="sg-scroll">
        <div className="sg">
          <Folge liste={wert.bausteine} ort={{ in: 'wurzel' }} ctx={ctx} />
        </div>
      </div>
      {hilfen && !!wert.bausteine.length && <Formhinweise meldungen={pruefeStruktogramm(wert)} />}
    </div>
  );
}

export function StruktogrammAnsicht({ wert }: { wert: StruktogrammAntwort }) {
  if (!wert.bausteine.length) return <p className="muted small">Kein Struktogramm gebaut.</p>;
  return (
    <div className="sg-scroll">
      <div className="sg">
        <Folge liste={wert.bausteine} ort={{ in: 'wurzel' }} ctx={{}} />
      </div>
      {wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
    </div>
  );
}

/** Beim Bewerten: Formprüfung und deine Struktur als Gliederung – zum Abhaken der Punktevergabe Baustein für Baustein. */
export function StruktogrammPruefung({ wert }: { wert: StruktogrammAntwort }) {
  if (!wert.bausteine.length) return null;
  return (
    <div className="editor-pruefung">
      <h4>Formprüfung und Gliederung deines Struktogramms</h4>
      <Formhinweise meldungen={pruefeStruktogramm(wert)} />
      <pre className="sg-gliederung">{struktogrammAlsText({ ...wert, notiz: undefined }).replace(/^Struktogramm:\n/, '')}</pre>
      <p className="hint">
        Geh die Punktevergabe der Musterlösung Baustein für Baustein durch: Steht jeder Schritt an der richtigen Stelle – vor, in oder nach
        der Schleife, im richtigen Zweig, verschachtelt oder auf gleicher Ebene? Die Formulierung zählt nicht, die Logik schon.
      </p>
    </div>
  );
}
