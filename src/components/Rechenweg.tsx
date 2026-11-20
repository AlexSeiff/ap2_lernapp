import 'katex/dist/katex.min.css';
import katex from 'katex';
import { useMemo } from 'react';
import { formatErgebnis, type RechenSchritt, rundungsHinweis } from '../../domain/rechenweg';
import type { SchrittSicht } from '../rechnen/beispiel';
import { Icon } from './Icon';

// Zieht KaTeX nach: nur in lazy geladenen Seiten verwenden (z. B. Rechenübungen, ROADMAP Phase 5), nicht im Hauptbundle.

/** LaTeX als Formel (inline). Fehler erscheinen rot statt die Seite abstürzen zu lassen. */
export function Tex({ tex }: { tex: string }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false, strict: 'ignore', errorColor: 'var(--low)' }), [tex]);
  return <span className="rw-tex" dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Nummerierter Rechenweg: je Schritt Formel → Einsetzen → Ergebnis (deutsches Zahlenformat, Einheit, Rundungshinweis).
 * `sicht` (ausgeblendetes Beispiel, ROADMAP 8.6) zeigt je Schritt alles, nur die Formel oder nur den Titel („rechnest du selbst“).
 */
export function Rechenweg({ schritte, sicht }: { schritte: RechenSchritt[]; sicht?: SchrittSicht[] }) {
  return (
    <ol className="rechenweg">
      {schritte.map((s, i) => {
        const gerundet = rundungsHinweis(s.ergebnis, s.runden);
        const art = sicht?.[i] ?? 'ganz';
        if (art === 'verdeckt') {
          return (
            <li key={i} className="rw-schritt rw-verdeckt">
              <div className="rw-titel">{s.titel}</div>
              <p className="hint">
                <Icon name="pencil" /> Diesen Schritt rechnest du selbst.
              </p>
            </li>
          );
        }
        if (art === 'formel') {
          return (
            <li key={i} className="rw-schritt">
              <div className="rw-titel">{s.titel}</div>
              <dl className="rw-zeilen">
                <dt>Formel</dt>
                <dd>
                  <Tex tex={s.formel} />
                </dd>
              </dl>
            </li>
          );
        }
        return (
          <li key={i} className="rw-schritt">
            <div className="rw-titel">{s.titel}</div>
            <dl className="rw-zeilen">
              <dt>Formel</dt>
              <dd>
                <Tex tex={s.formel} />
              </dd>
              {s.einsetzen && (
                <>
                  <dt>Einsetzen</dt>
                  <dd>
                    <Tex tex={s.einsetzen} />
                  </dd>
                </>
              )}
              <dt>Ergebnis</dt>
              <dd>
                <strong className="rw-ergebnis">{formatErgebnis(s)}</strong>
                {gerundet && <span className="hint"> ({gerundet})</span>}
              </dd>
            </dl>
            {s.hinweis && <p className="hint">{s.hinweis}</p>}
          </li>
        );
      })}
    </ol>
  );
}
