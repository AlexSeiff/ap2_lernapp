import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { shuffledOrder } from '../components/AnswerInput';
import { Markdown } from '../components/Markdown';
import { formatPoints, GRADE_SCALE } from '../lib/grading';
import { istMischId } from '../lib/mischKlausur';
import { EXAM_MINUTES } from '../../shared/config';
import {
  downloadText,
  examSheet,
  selectionSheet,
  sheetToMarkdown,
  solutionMarkdown,
  taskLabel,
  taskMarkdown,
  type Sheet,
  type SheetKind,
} from '../lib/sheets';
import { useStore } from '../lib/store';
import type { Task } from '../../shared/types';
import { Icon } from '../components/Icon';

/** Text für CSS `content: "…"` (Anführungszeichen und Backslashes maskiert, Zeilenumbrüche raus). */
const cssText = (s: string) => `"${s.replace(/[\\"]/g, '\\$&').replace(/\s+/g, ' ')}"`;

/** Schrift der Kopf- und Fußzeile (Randfelder erben die Schrift der Seite nicht). */
const RAND = "font-family: 'Segoe UI', system-ui, sans-serif; font-size: 8pt; color: #555;";

/**
 * Seitenränder im Druck: Kopfzeile mit dem Titel, Fußzeile mit Seitenzahl (Seite x von y). Chromium-Browser setzen das um;
 * andere drucken ohne Kopf- und Fußzeile. Das Deckblatt (erste Seite) bleibt ohne Kopfzeile.
 */
function DruckSeiten({ titel, rechts }: { titel: string; rechts: string }) {
  const css =
    `@page { size: A4; margin: 18mm 16mm 18mm;` +
    ` @top-left { content: ${cssText(titel)}; ${RAND} }` +
    ` @top-right { content: ${cssText(rechts)}; ${RAND} }` +
    ` @bottom-center { content: "Seite " counter(page) " von " counter(pages); ${RAND} } }` +
    ` @page :first { @top-left { content: none; } @top-right { content: none; } }`;
  return <style>{css}</style>;
}

/** Deckblatt einer Klausur zum Ausdrucken: Name, Datum, Zeit, Hilfsmittel, Punkte je Block zum Eintragen. */
function Deckblatt({ sheet }: { sheet: Sheet }) {
  return (
    <section className="deckblatt">
      <p className="deckblatt-art">Übungsklausur · AP2 Fachinformatiker/-in Daten- und Prozessanalyse</p>
      <h1>{sheet.title}</h1>
      <p>{sheet.subtitle}</p>
      <dl className="deckblatt-felder">
        <div>
          <dt>Name</dt>
          <dd className="feld" />
        </div>
        <div>
          <dt>Datum</dt>
          <dd className="feld" />
        </div>
        <div>
          <dt>Bearbeitungszeit</dt>
          <dd>{sheet.minuten ?? EXAM_MINUTES} Minuten</dd>
        </div>
        <div>
          <dt>Hilfsmittel</dt>
          <dd>nicht programmierbarer Taschenrechner, Schreibzeug</dd>
        </div>
      </dl>
      <table className="punkte-tabelle">
        <thead>
          <tr>
            <th scope="col">Block</th>
            <th scope="col">Thema</th>
            <th scope="col" className="num">
              Punkte
            </th>
            <th scope="col" className="num">
              erreicht
            </th>
          </tr>
        </thead>
        <tbody>
          {sheet.bloecke!.map((b) => (
            <tr key={b.label}>
              <th scope="row">{b.label}</th>
              <td>{b.titel}</td>
              <td className="num">{formatPoints(b.punkte)}</td>
              <td className="num eintrag" />
            </tr>
          ))}
          <tr className="summe">
            <th scope="row" colSpan={2}>
              Summe
            </th>
            <td className="num">{formatPoints(sheet.totalPoints)}</td>
            <td className="num eintrag" />
          </tr>
        </tbody>
      </table>
      <p className="hint">
        Alle Aufgaben bearbeiten, Rechenwege angeben. Operatoren beachten: „nennen“ verlangt Stichpunkte, „erläutern“ und „beurteilen“ ganze
        Sätze mit Begründung.
      </p>
    </section>
  );
}

/**
 * Bewertungsbogen vor dem Lösungsblatt: jede Aufgabe mit Höchstpunkten und Feld für die erreichten Punkte, dazu der Notenschlüssel.
 * `herkunft`: Zusatz je Aufgabe (gemischte Klausur: „DD 5“ – die Aufgabencodes wiederholen sich dort).
 */
function Bewertungsbogen({ sheet, herkunft }: { sheet: Sheet; herkunft?: (t: Task) => string }) {
  return (
    <section className="bewertungsbogen">
      <h2>Bewertungsbogen</h2>
      <p className="notenschluessel">
        IHK-Notenschlüssel (Punkte bei 100):{' '}
        {GRADE_SCALE.map((g, i) => `${i === 0 ? 100 : GRADE_SCALE[i - 1].min - 1}–${g.min} = ${g.note}`).join(' · ')}
      </p>
      <table className="punkte-tabelle">
        <thead>
          <tr>
            <th scope="col">Aufgabe</th>
            <th scope="col" className="num">
              max.
            </th>
            <th scope="col" className="num">
              erreicht
            </th>
          </tr>
        </thead>
        <tbody>
          {sheet.bloecke!.flatMap((b) => [
            <tr key={b.label} className="block-zeile">
              <th scope="colgroup" colSpan={3}>
                {b.label} – {b.titel} ({formatPoints(b.punkte)} P)
              </th>
            </tr>,
            ...b.tasks.map((t) => (
              <tr key={t.id}>
                <th scope="row">
                  {t.code}
                  {herkunft && <span className="muted"> · {herkunft(t)}</span>}
                </th>
                <td className="num">{formatPoints(t.points)}</td>
                <td className="num eintrag" />
              </tr>
            )),
          ])}
          <tr className="summe">
            <th scope="row">Summe</th>
            <td className="num">{formatPoints(sheet.totalPoints)}</td>
            <td className="num eintrag" />
          </tr>
        </tbody>
      </table>
    </section>
  );
}

/**
 * Druckansicht: Aufgaben- und Lösungsblatt sind getrennte Seiten mit identischer Nummerierung. Ganze Klausuren (`thema`, auch gemischt –
 * `misch=mix-…` ist gleichbedeutend) bekommen ein Deckblatt bzw. einen Bewertungsbogen; jeder Block beginnt auf einer neuen Seite.
 */
export function Druck() {
  const { content } = useStore();
  const [params] = useSearchParams();
  const kind: SheetKind = params.get('art') === 'loesungen' ? 'loesungen' : 'aufgaben';
  const thema = params.get('misch') ?? params.get('thema');
  const ids = params.get('ids')?.split(',').filter(Boolean) ?? [];
  const sheet = thema ? examSheet(content, thema, kind) : selectionSheet(content, ids, kind);

  // Der Seitentitel wird beim „Als PDF speichern" als Dateiname vorgeschlagen.
  const fileBase = sheet?.fileBase;
  useEffect(() => {
    const prev = document.title;
    if (fileBase) document.title = fileBase;
    return () => {
      document.title = prev;
    };
  }, [fileBase]);

  if (!sheet || !sheet.groups.some((g) => g.tasks.length)) {
    return (
      <div className="page">
        <h1>Keine Aufgaben ausgewählt</h1>
        <Link to="/aufgaben">Zur Aufgabenliste</Link>
      </div>
    );
  }

  const other = new URLSearchParams(params);
  other.set('art', kind === 'aufgaben' ? 'loesungen' : 'aufgaben');
  const klausur = !!sheet.bloecke?.length;
  const misch = !!thema && istMischId(thema);
  const herkunft = (t: Task) => {
    const n = content.topics.find((x) => x.id === t.topicId)?.number;
    return n ? `DD ${n}` : 'SQL-Zusatz';
  };

  return (
    <div className="print-page">
      <DruckSeiten
        titel={`${kind === 'aufgaben' ? 'Aufgabenblatt' : 'Lösungsblatt'}: ${sheet.title}`}
        rechts={kind === 'aufgaben' ? 'Name: ______________________' : sheet.subtitle}
      />
      <div className="print-toolbar no-print">
        <button type="button" className="ghost" onClick={() => history.back()}>
          ← Zurück
        </button>
        <button type="button" onClick={() => window.print()}>
          <Icon name="printer" /> Drucken / Als PDF speichern
        </button>
        <button type="button" className="secondary" onClick={() => downloadText(`${sheet.fileBase}.md`, sheetToMarkdown(sheet, kind))}>
          <Icon name="download" /> Markdown
        </button>
        <Link className="button secondary" to={`/druck?${other}`}>
          → {kind === 'aufgaben' ? 'Lösungsblatt' : 'Aufgabenblatt'}
        </Link>
        {misch && (
          <Link className="button secondary" to={`/klausur/${thema}`} title="Dieselbe Klausur in der App – dort trägst du die Punkte ein">
            <Icon name="pencil" /> Punkte eintragen
          </Link>
        )}
        <span className="hint">Im Druckdialog „Als PDF speichern" wählen – Dateiname: {sheet.fileBase}.pdf</span>
      </div>

      {klausur && kind === 'aufgaben' && <Deckblatt sheet={sheet} />}
      {klausur && kind === 'loesungen' && <Bewertungsbogen sheet={sheet} herkunft={misch ? herkunft : undefined} />}

      <header className="sheet-head">
        <div>
          <h1>
            {kind === 'aufgaben' ? 'Aufgabenblatt' : 'Lösungsblatt'}: {sheet.title}
          </h1>
          <p>{sheet.subtitle}</p>
        </div>
        <div className="sheet-meta">
          <span>{formatPoints(sheet.totalPoints)} Punkte</span>
          {kind === 'aufgaben' ? <span>Name: ____________________</span> : <span>Erreicht: _____ / {formatPoints(sheet.totalPoints)}</span>}
          <span>Datum: {new Date().toLocaleDateString('de-DE')}</span>
        </div>
      </header>

      {kind === 'aufgaben' &&
        sheet.attachments.map((a) => (
          <section key={a.id} className="sheet-attachment">
            <h2>{a.title}</h2>
            <Markdown source={false}>{a.markdown}</Markdown>
          </section>
        ))}

      {sheet.groups.map((g, gi) => (
        <section key={gi} className={`sheet-group${g.neuerBlock && gi > 0 ? ' neuer-block' : ''}`}>
          {g.heading && <h2>{g.heading}</h2>}
          {kind === 'aufgaben' && g.intro && <Markdown source={false}>{g.intro}</Markdown>}
          {g.tasks.map((t) => {
            const rights = t.auto?.pairs && shuffledOrder(t.auto.pairs.length, t.id).map((j) => t.auto!.pairs![j].right);
            return (
              <div key={t.id} className="sheet-task">
                <h3>{taskLabel(t)}</h3>
                <Markdown math={kind === 'loesungen'} loesung={kind === 'loesungen'} source={false}>
                  {kind === 'aufgaben' ? taskMarkdown(t, rights) : solutionMarkdown(t)}
                </Markdown>
                {kind === 'aufgaben' && t.type === 'offen' && (
                  <div className="write-space" style={{ height: `${Math.min(22, 3 + t.points * 1.1)}em` }} />
                )}
                {kind === 'loesungen' && <p className="score-line">Erreicht: ______ / {formatPoints(t.points)} P</p>}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
