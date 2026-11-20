import { type RefObject } from 'react';
import {
  type DiagrammAntwort,
  type EditorKante,
  type EditorKantenArt,
  type EditorKnoten,
  KANTEN_NAMEN,
  knotenName,
  NIE_TEXT,
} from '../../lib/diagrammEditor';
import { formName } from '../DiagrammSvg';
import { KARDINALITAETEN } from './typen';

export function KnotenFeld({
  k,
  antwort,
  textRef,
  onText,
  onSchluessel,
  onDrehen,
  onVerbinden,
  onKante,
  onDuplizieren,
  onLoeschen,
}: {
  k: EditorKnoten;
  antwort: DiagrammAntwort;
  textRef: RefObject<HTMLInputElement | null>;
  onText: (t: string) => void;
  onSchluessel: (s: boolean) => void;
  onDrehen: () => void;
  onVerbinden: () => void;
  onKante: (id: string) => void;
  onDuplizieren: () => void;
  onLoeschen: () => void;
}) {
  const kanten = antwort.kanten.filter((e) => e.von === k.id || e.nach === k.id);
  const name = (id: string) => {
    const x = antwort.knoten.find((n) => n.id === id);
    return x ? knotenName(x, antwort.knoten, antwort.kanten) : '?';
  };
  return (
    <div className="ed-feld">
      {NIE_TEXT.includes(k.form) ? (
        <p className="small">{knotenName(k, antwort.knoten, antwort.kanten)}</p>
      ) : (
        <label className="ed-text">
          <span>{formName(k.form)}</span>
          <input ref={textRef} type="text" value={k.text} placeholder="Beschriftung" onChange={(e) => onText(e.target.value)} />
        </label>
      )}
      {k.form === 'attribut' && (
        <label className="ed-schalter">
          <input type="checkbox" checked={!!k.schluessel} onChange={(e) => onSchluessel(e.target.checked)} /> Schlüsselattribut
          (unterstrichen)
        </label>
      )}
      <div className="ed-knoepfe">
        <button type="button" className="secondary" onClick={onVerbinden}>
          Verbinden mit …
        </button>
        {k.form === 'gabel' && (
          <button type="button" className="ghost" onClick={onDrehen}>
            {k.w >= k.h ? 'Senkrecht stellen' : 'Waagerecht legen'}
          </button>
        )}
        <button type="button" className="ghost" onClick={onDuplizieren}>
          Duplizieren
        </button>
        <button type="button" className="ghost danger" onClick={onLoeschen}>
          Löschen
        </button>
      </div>
      {kanten.length > 0 && (
        <p className="small ed-verbindungen">
          Verbindungen:{' '}
          {kanten.map((e) => (
            <button key={e.id} type="button" className="ghost" onClick={() => onKante(e.id)}>
              {e.von === k.id ? `→ ${name(e.nach)}` : `← ${name(e.von)}`}
            </button>
          ))}
        </p>
      )}
    </div>
  );
}

export function KantenFeld({
  e,
  antwort,
  arten,
  onAendern,
  onLoeschen,
}: {
  e: EditorKante;
  antwort: DiagrammAntwort;
  arten: EditorKantenArt[];
  onAendern: (teil: Partial<EditorKante>, zusammen?: string) => void;
  onLoeschen: () => void;
}) {
  const von = antwort.knoten.find((k) => k.id === e.von)!;
  const nach = antwort.knoten.find((k) => k.id === e.nach)!;
  const erm = antwort.editor === 'erm';
  const aktivitaet = antwort.editor === 'aktivitaet';
  const entitaet = [von, nach].find((k) => k.form === 'entitaet');
  return (
    <div className="ed-feld">
      <p className="small">
        Verbindung {knotenName(von, antwort.knoten, antwort.kanten)} → {knotenName(nach, antwort.knoten, antwort.kanten)}
      </p>
      {arten.length > 1 && (
        <label className="ed-text">
          <span>Art</span>
          <select value={e.art} onChange={(ev) => onAendern({ art: ev.target.value as EditorKantenArt })}>
            {arten.map((a) => (
              <option key={a} value={a}>
                {KANTEN_NAMEN[a]}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="ed-text">
        <span>
          {erm ? `Kardinalität${entitaet ? ` (an ${entitaet.text || 'der Entität'})` : ''}` : aktivitaet ? 'Bedingung' : 'Beschriftung'}
        </span>
        <input
          type="text"
          value={e.text ?? ''}
          placeholder={
            erm
              ? 'z. B. (1,n)'
              : antwort.editor === 'bpmn'
                ? 'z. B. ja / angenommen'
                : aktivitaet && von.form === 'entscheidung'
                  ? 'z. B. bezahlt – wird zu [bezahlt]'
                  : 'optional'
          }
          onChange={(ev) => onAendern({ text: ev.target.value }, `kante:${e.id}`)}
        />
      </label>
      {erm && (
        <div className="ed-knoepfe" aria-label="Kardinalität wählen">
          {KARDINALITAETEN.map((k) => (
            <button key={k} type="button" className={`ghost${e.text === k ? ' aktiv' : ''}`} onClick={() => onAendern({ text: k })}>
              {k}
            </button>
          ))}
        </div>
      )}
      <div className="ed-knoepfe">
        {!erm && (
          <button type="button" className="ghost" onClick={() => onAendern({ von: e.nach, nach: e.von })}>
            Richtung umkehren
          </button>
        )}
        <button type="button" className="ghost danger" onClick={onLoeschen}>
          Löschen
        </button>
      </div>
    </div>
  );
}

// ---------- Zeichnung (Editor und Ansicht) ----------
