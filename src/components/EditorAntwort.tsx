// Antwort im Editor für Modellierungs- und Tabellenaufgaben (src/lib/editorAufgabe.ts): Diagramm-Editor, Tabellen-Editor,
// Wertetabelle, Boxplot bzw. Struktogramm-Baukasten, nach der Abgabe die Lösung ohne Bedienelemente. EditorPruefung steht beim Bewerten
// neben der Musterlösung: Formprüfung bzw. Abgleich mit Tabellen oder Boxplot der Musterlösung – Hilfen zur Selbstbewertung, die
// Punkte vergibst du selbst. Lazy geladen (nur bei solchen Aufgaben).

import { useMemo, type ReactNode } from 'react';
import type { Task } from '../../shared/types';
import { pruefeDiagrammAntwort, type DiagrammAntwort } from '../lib/diagrammEditor';
import { EDITOR_NAMEN, istDiagrammArt, leseEditorAntwort, schreibeEditorAntwort, vorlageFuer, type EditorArt } from '../lib/editorAufgabe';
import { abgleichOk, gleicheAb, musterFuerSchritt, musterTabellen, relationText, type TabellenAntwort } from '../lib/tabellenEditor';
import { gleicheWerteAb, type WerteAntwort } from '../lib/werteTabelle';
import type { BoxplotAntwort } from '../lib/boxplotAntwort';
import type { StruktogrammAntwort } from '../lib/struktogramm';
import { useStore } from '../lib/store';
import { BoxplotAnsicht, BoxplotEditor, BoxplotPruefung } from './BoxplotEditor';
import { DiagrammAnsicht, DiagrammEditor, Formhinweise } from './DiagrammEditor';
import { Icon } from './Icon';
import { StruktogrammAnsicht, StruktogrammEditor, StruktogrammPruefung } from './StruktogrammEditor';
import { TabellenAnsicht, TabellenEditor } from './TabellenEditor';
import { WerteAnsicht, WerteEditor } from './WerteEditor';

const NACH_ABGABE = 'Nach der Abgabe vergleichst du deine Lösung mit der Musterlösung und bewertest dich.';

/** Einleitung über dem Editor; ohne Eintrag „<Name>-Editor – erstelle deine Lösung selbst“. */
const EINLEITUNG: Partial<Record<EditorArt, string>> = {
  werte: 'Trag deine Lösung in die Tabelle ein – wie auf dem Prüfungsbogen.',
  boxplot: 'Rechne die Kennwerte selbst aus und trag sie ein – die App zeichnet daraus den Boxplot maßstäblich.',
  struktogramm:
    'Bau dein Struktogramm aus Bausteinen: „+ Baustein“ fügt am Ende einer Folge an, in Zweige und Schleifen genauso. Texte schreibst du direkt in die Kästen.',
};

/** Beschriftung des Felds unter dem Editor. */
const NOTIZ: Partial<Record<EditorArt, string>> = {
  werte: 'Was nicht in die Tabelle gehört: Ergebnis, Rechenweg, Begründung',
  boxplot: 'Rechenweg: Quartile, Zäune, Begründung der Whisker-Enden (optional)',
  struktogramm: 'Anmerkungen, z. B. Annahmen zu den Daten (optional)',
};

interface Props {
  task: Task;
  art: EditorArt;
  value: string | undefined;
  onChange: (v: string) => void;
  disabled?: boolean;
  /** Formprüfung während der Bearbeitung (Einzelaufgabe ja, Klausur nein). */
  hilfen: boolean;
}

export default function EditorAntwort({ task, art, value, onChange, disabled, hilfen }: Props) {
  const { content } = useStore();
  const wert = useMemo(() => leseEditorAntwort(art, task, value), [art, task, value]);
  const diagramm = istDiagrammArt(art);
  const anlagen = content.topics.find((t) => t.id === task.topicId)?.exam?.attachments ?? [];
  const setze = (a: typeof wert) => onChange(schreibeEditorAntwort(a, task));

  if (disabled) {
    const ansicht = (): ReactNode => {
      if (art === 'werte') return <WerteAnsicht wert={wert as WerteAntwort} />;
      if (art === 'boxplot') return <BoxplotAnsicht wert={wert as BoxplotAntwort} />;
      if (art === 'struktogramm') return <StruktogrammAnsicht wert={wert as StruktogrammAntwort} />;
      if (diagramm) return <DiagrammAnsicht wert={wert as DiagrammAntwort} />;
      return <TabellenAnsicht wert={wert as TabellenAntwort} />;
    };
    return (
      <div className="editor-antwort abgegeben">
        <p className="muted small">
          <Icon name="pen-line" /> Deine Lösung
        </p>
        {ansicht()}
        {diagramm && wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
      </div>
    );
  }

  const editor = (): ReactNode => {
    if (art === 'werte') return <WerteEditor wert={wert as WerteAntwort} vorlage={vorlageFuer(task)} onChange={setze} />;
    if (art === 'boxplot') return <BoxplotEditor wert={wert as BoxplotAntwort} onChange={setze} hilfen={hilfen} />;
    if (art === 'struktogramm') return <StruktogrammEditor wert={wert as StruktogrammAntwort} onChange={setze} hilfen={hilfen} />;
    if (diagramm) return <DiagrammEditor wert={wert as DiagrammAntwort} onChange={setze} hilfen={hilfen} />;
    return <TabellenEditor wert={wert as TabellenAntwort} onChange={setze} anlagen={anlagen} />;
  };
  return (
    <div className="editor-antwort">
      <p className="ed-titel small">
        {EINLEITUNG[art] ? (
          <>
            <Icon name="pencil" /> {EINLEITUNG[art]} {NACH_ABGABE}
          </>
        ) : (
          <>
            <Icon name="workflow" /> <b>{EDITOR_NAMEN[art]}-Editor</b> – erstelle deine Lösung selbst. {NACH_ABGABE}
          </>
        )}
      </p>
      {editor()}
      <label className="ed-notiz">
        <span className="small muted">{NOTIZ[art] ?? 'Anmerkungen, Annahmen (optional)'}</span>
        <textarea className="answer" rows={2} value={wert.notiz ?? ''} onChange={(e) => setze({ ...wert, notiz: e.target.value })} />
      </label>
    </div>
  );
}

/** Beim Bewerten: Formprüfung bzw. Tabellenabgleich als Hilfe neben der Musterlösung. */
export function EditorPruefung({ task, art, answer }: { task: Task; art: EditorArt; answer: string | undefined }) {
  const wert = useMemo(() => leseEditorAntwort(art, task, answer), [art, task, answer]);
  if (art === 'werte') return <WertePruefung task={task} wert={wert as WerteAntwort} />;
  if (art === 'boxplot') return <BoxplotPruefung task={task} wert={wert as BoxplotAntwort} />;
  if (art === 'struktogramm') return <StruktogrammPruefung wert={wert as StruktogrammAntwort} />;
  if (istDiagrammArt(art)) {
    const d = wert as DiagrammAntwort;
    if (!d.knoten.length) return null;
    return (
      <div className="editor-pruefung">
        <h4>Formprüfung deiner Zeichnung</h4>
        <Formhinweise meldungen={pruefeDiagrammAntwort(d)} />
        <p className="hint">
          Die Formprüfung ersetzt nicht den Vergleich: Geh die Musterlösung Element für Element durch (Beschriftungen, Verbindungen
          {art === 'erm' ? ', Kardinalitäten' : ''}) und vergib dann deine Punkte.
        </p>
      </div>
    );
  }
  const t = wert as TabellenAntwort;
  const teile = musterTabellen(task.solution?.markdown ?? '');
  const schritte = t.schritte
    .map((s, i) => ({ s, muster: musterFuerSchritt(teile, t.schritte.length, i) }))
    .filter((x) => x.muster.length && x.s.tabellen.length);
  if (!schritte.length) return null;
  return (
    <div className="editor-pruefung">
      <h4>Abgleich mit den Tabellen der Musterlösung</h4>
      {schritte.map(({ s, muster }) => {
        const a = gleicheAb(s.tabellen, muster);
        return (
          <div key={s.titel} className="te-abgleich">
            {t.schritte.length > 1 && <h5>{s.titel}</h5>}
            <table>
              <thead>
                <tr>
                  <th>Musterlösung</th>
                  <th>Deine Tabelle</th>
                  <th>Befund</th>
                </tr>
              </thead>
              <tbody>
                {a.zeilen.map((z, i) => (
                  <tr key={i}>
                    <td>
                      <code>{z.muster.name ? relationText(z.muster) : `(${z.muster.spalten.map((x) => x.name).join(', ')})`}</code>
                    </td>
                    <td>{z.deine ?? <span className="bad">nicht gefunden</span>}</td>
                    <td>
                      {abgleichOk(z) ? (
                        <span className="ok">✓ passt</span>
                      ) : (
                        z.deine && (
                          <ul className="te-befund">
                            {!!z.fehlend.length && <li>fehlt: {z.fehlend.join(', ')}</li>}
                            {!!z.zusaetzlich.length && <li>zusätzlich: {z.zusaetzlich.join(', ')}</li>}
                            {!z.pkOk && (
                              <li>
                                Primärschlüssel weicht ab (
                                {z.muster.spalten
                                  .filter((x) => x.pk)
                                  .map((x) => x.name)
                                  .join(', ') || '–'}
                                )
                              </li>
                            )}
                            {!!z.fkFehlt.length && <li>nicht als FK markiert: {z.fkFehlt.join(', ')}</li>}
                          </ul>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!!a.uebrig.length && <p className="small muted">Ohne Gegenstück in der Musterlösung: {a.uebrig.join(', ')}</p>}
          </div>
        );
      })}
      <p className="hint">
        Der Abgleich vergleicht Spaltennamen – andere, aber sinnvolle Namen sind in der Prüfung kein Fehler. Entscheidend sind die
        Zerlegung, die Schlüssel und deine Begründung.
      </p>
    </div>
  );
}

const BEFUND_TEXT = { gleich: 'stimmt', abweichend: 'weicht ab', fehlt: 'fehlt', offen: '' } as const;

/** Wertetabelle beim Bewerten: Zahlen und Kreuze Zelle für Zelle neben der Musterlösung, Text vergleichst du selbst. */
function WertePruefung({ task, wert }: { task: Task; wert: WerteAntwort }) {
  const a = gleicheWerteAb(task, wert);
  if (!a)
    return (
      <div className="editor-pruefung">
        <p className="hint">
          Vergleich deine Tabelle Zeile für Zeile mit der Musterlösung – bei Texttabellen zählen Inhalt und Begründung, nicht der genaue
          Wortlaut.
        </p>
      </div>
    );
  return (
    <div className="editor-pruefung">
      <h4>Abgleich mit der Tabelle der Musterlösung</h4>
      <p className="small">
        <b>
          {a.gleich} von {a.vergleichbar}
        </b>{' '}
        Werten stimmen mit der Musterlösung überein (Zeilen in der Reihenfolge der Lösung).
      </p>
      <div className="table-wrap">
        <table className="wt-tabelle wt-abgleich">
          <thead>
            <tr>
              {wert.kopf.map((k, i) => (
                <th key={i} scope="col">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {a.zeilen.map((z, zi) => (
              <tr key={zi}>
                {z.befund.map((b, si) => (
                  <td key={si} className={`wt-${b}`} title={BEFUND_TEXT[b] || undefined}>
                    {z.deine[si] || (b === 'offen' ? '' : '–')}
                    {(b === 'abweichend' || b === 'fehlt') && <span className="wt-muster">Muster: {z.muster[si] || 'leer'}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint">
        Verglichen werden Zahlen (auf die angegebene Stelle gerundet) und Kreuze; Textzellen prüfst du selbst. Steht ein richtiger Wert in
        einer anderen Zeile, stimmt meist die Reihenfolge nicht – oft ist sie Teil der Aufgabe (z. B. absteigend sortiert).
      </p>
    </div>
  );
}
