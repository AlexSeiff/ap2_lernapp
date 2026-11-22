// Struktogramm-Baukasten (src/lib/struktogramm.ts): Bausteine als verschachtelte Nassi-Shneiderman-Kästen – Verzweigung mit Dreieck
// und ja/nein, Schleifen mit Balken links. Texte stehen direkt im Kasten, die schmale Zeile „+ Baustein“ am Ende jeder Folge klappt
// die vier Bausteine als kleine Bildchen auf (ein leerer Zweig ist selbst die Zeile), ↑ ↓ ✕ ordnen um.
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
import { Formhinweise } from './diagramm/Formhinweise';
import { Icon } from './Icon';

interface Ctx {
  /** undefined: nur ansehen. */
  aendere?: (fn: (liste: Baustein[]) => Baustein[]) => void;
  /** Eigener Inhalt der Textzelle (Zuordnungs-Struktogramm: Ziffernfeld bzw. Anweisung), statt Text oder Eingabefeld. */
  zelle?: (b: Baustein) => ReactNode;
  /** Zuletzt angefügter Baustein: sein Textfeld bekommt gleich den Fokus. */
  neuId?: string;
  setNeuId?: (id: string) => void;
}

const ARTEN: BausteinArt[] = ['anweisung', 'wenn', 'solange', 'wiederhole'];

/** Kurzname unter dem Bildchen; der volle Name steht im title. */
const KURZ: Record<BausteinArt, string> = {
  anweisung: 'Anweisung',
  wenn: 'Verzweigung',
  solange: 'Kopfgesteuert',
  wiederhole: 'Fußgesteuert',
};

/** Jeder Baustein als Mini-Struktogramm – so, wie er nachher aussieht. */
function Bildchen({ art }: { art: BausteinArt }) {
  return (
    <svg className="sg-bildchen" viewBox="0 0 26 18" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="24" height="16" />
      {art === 'wenn' && <path d="M1 1 13 9 25 1M1 9h24M13 9v8" />}
      {art === 'solange' && <path d="M7 17V6h18" />}
      {art === 'wiederhole' && <path d="M7 1v11h18" />}
    </svg>
  );
}

/**
 * Anfügen am Ende einer Folge: zu eine schmale Zeile, offen die vier Bausteine. Ein leerer Zweig ist selbst diese Zeile (∅ + Baustein),
 * ein leeres Struktogramm zeigt die Auswahl gleich offen. Escape oder Klick daneben klappt wieder zu.
 */
function NeuZeile({ ort, ctx, leer }: { ort: Ort; ctx: Ctx; leer: boolean }) {
  const start = leer && ort.in === 'wurzel';
  const [offen, setOffen] = useState(false);
  const plus = useRef<HTMLButtonElement>(null);
  const erster = useRef<HTMLButtonElement>(null);
  const zurueck = useRef(false);
  useEffect(() => {
    if (offen) erster.current?.focus();
    else if (zurueck.current) plus.current?.focus();
    zurueck.current = false;
  }, [offen]);
  const waehle = (art: BausteinArt) => {
    const b = neuerBaustein(art);
    ctx.setNeuId?.(b.id);
    ctx.aendere!((l) => fuegeAn(l, ort, b));
    setOffen(false);
  };
  const klasse = `sg-neu-zeile${leer ? ' sg-neu-leer' : ''}${start ? ' sg-neu-start' : ''}`;
  if (!offen && !start)
    return (
      <div className={klasse}>
        <button
          type="button"
          ref={plus}
          className="sg-plus"
          aria-expanded={false}
          aria-label={leer ? 'Leerer Zweig – Baustein hinzufügen' : 'Baustein hinzufügen'}
          onClick={() => setOffen(true)}
        >
          {leer && (
            <span className="sg-leer-zeichen" aria-hidden="true">
              ∅
            </span>
          )}
          <span aria-hidden="true">+ Baustein</span>
        </button>
      </div>
    );
  return (
    <div
      className={`${klasse} offen`}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && !start) {
          e.stopPropagation();
          zurueck.current = true;
          setOffen(false);
        }
      }}
      onBlur={(e) => {
        if (!start && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOffen(false);
      }}
    >
      {start && <p className="sg-start-text">Womit beginnt dein Struktogramm?</p>}
      <div className="sg-wahl" role="group" aria-label="Baustein hinzufügen">
        {ARTEN.map((a, i) => (
          <button
            key={a}
            ref={i === 0 && !start ? erster : undefined}
            type="button"
            className="sg-wahl-knopf"
            title={BAUSTEIN_NAMEN[a]}
            onClick={() => waehle(a)}
          >
            <Bildchen art={a} />
            <span>{KURZ[a]}</span>
          </button>
        ))}
        {!start && (
          <button
            type="button"
            className="sg-wahl-zu"
            aria-label="Abbrechen"
            onClick={() => {
              zurueck.current = true;
              setOffen(false);
            }}
          >
            <Icon name="x" />
          </button>
        )}
      </div>
    </div>
  );
}

function Folge({ liste, ort, ctx }: { liste: Baustein[]; ort: Ort; ctx: Ctx }) {
  return (
    <div className="sg-folge">
      {!liste.length && !ctx.aendere && (
        <div className="sg-leer" title="leerer Zweig: keine Anweisung">
          ∅
        </div>
      )}
      {liste.map((b, i) => (
        <BausteinKasten key={b.id} b={b} erster={i === 0} letzter={i === liste.length - 1} ctx={ctx} />
      ))}
      {ctx.aendere && <NeuZeile ort={ort} ctx={ctx} leer={!liste.length} />}
    </div>
  );
}

function Text({ b, ctx, label }: { b: Baustein; ctx: Ctx; label: string }) {
  if (ctx.zelle) return ctx.zelle(b);
  if (!ctx.aendere) return <span className="sg-text">{b.text.trim() || '…'}</span>;
  return (
    <input
      className="sg-text"
      value={b.text}
      placeholder={PLATZHALTER[b.art]}
      aria-label={label}
      autoFocus={b.id === ctx.neuId}
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
  const [neuId, setNeuId] = useState<string>();
  const ctx: Ctx = { aendere: (fn) => onChange({ ...wert, bausteine: fn(wert.bausteine) }), neuId, setNeuId };
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

/** Vorgegebenes Gerüst (Zuordnungsaufgabe): dieselben Kästen, der Inhalt jeder Zelle kommt von außen. */
export function StruktogrammGeruest({ bausteine, zelle }: { bausteine: Baustein[]; zelle: (b: Baustein) => ReactNode }) {
  return (
    <div className="sg">
      <Folge liste={bausteine} ort={{ in: 'wurzel' }} ctx={{ zelle }} />
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
