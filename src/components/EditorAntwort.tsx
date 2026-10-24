// Antwort im Editor für Modellierungsaufgaben (src/lib/editorAufgabe.ts): Diagramm-Editor bzw. Tabellen-Editor, nach der Abgabe die
// Zeichnung ohne Bedienelemente. EditorPruefung steht beim Bewerten neben der Musterlösung: Formprüfung (Diagramme) bzw. Abgleich
// mit den Tabellen der Musterlösung – Hilfen zur Selbstbewertung, die Punkte vergibst du selbst. Lazy geladen (nur bei solchen Aufgaben).

import { useMemo } from 'react';
import type { Task } from '../../shared/types';
import { pruefeDiagrammAntwort, type DiagrammAntwort } from '../lib/diagrammEditor';
import { EDITOR_NAMEN, istDiagrammArt, leseEditorAntwort, schreibeEditorAntwort, type EditorArt } from '../lib/editorAufgabe';
import { abgleichOk, gleicheAb, musterFuerSchritt, musterTabellen, relationText, type TabellenAntwort } from '../lib/tabellenEditor';
import { useStore } from '../lib/store';
import { DiagrammAnsicht, DiagrammEditor, Formhinweise } from './DiagrammEditor';
import { Icon } from './Icon';
import { TabellenAnsicht, TabellenEditor } from './TabellenEditor';

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
  const setze = (a: typeof wert) => onChange(schreibeEditorAntwort(a));

  if (disabled) {
    return (
      <div className="editor-antwort abgegeben">
        <p className="muted small">
          <Icon name="pen-line" /> Deine Lösung
        </p>
        {diagramm ? <DiagrammAnsicht wert={wert as DiagrammAntwort} /> : <TabellenAnsicht wert={wert as TabellenAntwort} />}
        {diagramm && wert.notiz?.trim() && <p className="te-text">{wert.notiz}</p>}
      </div>
    );
  }

  return (
    <div className="editor-antwort">
      <p className="ed-titel small">
        <Icon name="workflow" /> <b>{EDITOR_NAMEN[art]}-Editor</b> – erstelle deine Lösung selbst. Nach der Abgabe vergleichst du sie mit
        der Musterlösung und bewertest dich.
      </p>
      {diagramm ? (
        <DiagrammEditor wert={wert as DiagrammAntwort} onChange={setze} hilfen={hilfen} />
      ) : (
        <TabellenEditor wert={wert as TabellenAntwort} onChange={setze} anlagen={anlagen} />
      )}
      <label className="ed-notiz">
        <span className="small muted">Anmerkungen, Annahmen (optional)</span>
        <textarea className="answer" rows={2} value={wert.notiz ?? ''} onChange={(e) => setze({ ...wert, notiz: e.target.value })} />
      </label>
    </div>
  );
}

/** Beim Bewerten: Formprüfung bzw. Tabellenabgleich als Hilfe neben der Musterlösung. */
export function EditorPruefung({ task, art, answer }: { task: Task; art: EditorArt; answer: string | undefined }) {
  const wert = useMemo(() => leseEditorAntwort(art, task, answer), [art, task, answer]);
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
