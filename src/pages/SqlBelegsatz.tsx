// SQL-Belegsatz als Seite (/material/sql-belegsatz, Bereich Glossar): Nachschlagen und Drucken (etwa 3 Seiten A4, siehe @media print).

import { Link } from 'react-router-dom';
import { ohneTitel, useBelegsatz } from '../components/Belegsatz';
import { Icon } from '../components/Icon';
import { Markdown } from '../components/Markdown';

export function SqlBelegsatz() {
  const doc = useBelegsatz();
  if (!doc) {
    return (
      <div className="page narrow">
        <h1>SQL-Belegsatz</h1>
        <p className="card warn">Der Belegsatz fehlt im Inhalt (Datei AP2_SQL_Belegsatz.md).</p>
      </div>
    );
  }
  return (
    <div className="page belegsatz-seite">
      <div className="belegsatz-titel">
        <h1>
          <Icon name="database" /> SQL-Belegsatz
        </h1>
        <button type="button" className="secondary" onClick={() => window.print()}>
          <Icon name="printer" /> Drucken
        </button>
      </div>
      <p className="hint nur-bildschirm">
        Auch im <Link to="/sql">SQL-Editor</Link> über den Knopf „SQL-Belegsatz“. Gedruckt passt er auf etwa drei Seiten A4.
      </p>
      <Markdown source={false} className="belegsatz">
        {ohneTitel(doc.markdown)}
      </Markdown>
    </div>
  );
}
