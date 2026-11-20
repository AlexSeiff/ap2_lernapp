import { lazy, type ReactNode, Suspense } from 'react';
import type { Beispiel } from '../../rechnen/beispiel';
import { Markdown } from '../../components/Markdown';
import type { EingabeErgebnis } from '../../rechnen/checker';
import type { AufgeloesteEingabe } from '../../rechnen/instanz';
import type { EingabeLayout, Tabelle } from '../../rechnen/typen';
import { Icon } from '../../components/Icon';

// KaTeX erst laden, wenn jemand die Lösung ansieht.
export const Rechenweg = lazy(() => import('../../components/Rechenweg').then((m) => ({ default: m.Rechenweg })));

const BEISPIEL_TITEL: Record<Beispiel['stufe'], string> = {
  voll: 'Beispiel: so rechnest du das',
  luecke: 'Beispiel mit Lücke – den letzten Schritt rechnest du selbst',
  ergebnis: '',
};

/** Ausgeblendetes Lösungsbeispiel vor der Eingabe (ROADMAP 8.6): mit anderen Zahlen oder nur als Formel-Gerüst. */
export function BeispielKarte({ b, rechenweg }: { b: Beispiel; rechenweg: boolean }) {
  if (b.stufe === 'ergebnis') {
    return rechenweg ? (
      <p className="hint beispiel-fertig">
        <Icon name="target" /> Ohne Beispiel: Du hast die Übung schon gelöst – jetzt zählt nur dein Ergebnis.
      </p>
    ) : null;
  }
  if (b.quelle === 'keins' || !b.inst) return null;
  const andere = b.quelle === 'andere-zahlen';
  return (
    <details className="card beispiel" open={b.stufe === 'voll'}>
      <summary>
        <Icon name="book-bookmark" /> {BEISPIEL_TITEL[b.stufe]}{' '}
        <span className="muted small">{andere ? '(andere Zahlen)' : '(nur Schritte und Formeln)'}</span>
      </summary>
      {andere ? (
        <div className="beispiel-aufgabe small">
          <Markdown source={false}>{b.inst.aufgabe}</Markdown>
          {b.inst.tabelle && <DatenTabelle t={b.inst.tabelle} />}
        </div>
      ) : (
        <p className="hint">Die Zahlen deiner Aufgabe setzt du selbst ein.</p>
      )}
      <Suspense fallback={<p className="muted">Lade Beispiel …</p>}>
        <Rechenweg schritte={b.inst.loesung.schritte} sicht={b.sicht} />
      </Suspense>
    </details>
  );
}

/** Daten der Aufgabe als Tabelle (Zahlenspalten rechtsbündig). */
export function DatenTabelle({ t }: { t: Tabelle }) {
  const zahl = (s: string) => /^[−+-]?[\d.]+(,\d+)?\s*(%|€|h|min)?$/.test(s.trim());
  return (
    <div className="re-daten">
      {t.titel && <p className="small muted">{t.titel}</p>}
      <div className="result-scroll">
        <table className="result-table">
          <thead>
            <tr>
              {t.kopf.map((k, i) => (
                <th key={i}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.zeilen.map((z, i) => (
              <tr key={i}>
                {z.map((c, j) => (
                  <td key={j} className={zahl(c) ? 'num' : undefined}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const STATUS_ICON: Record<EingabeErgebnis['status'], string> = { richtig: '✓', falsch: '✗', leer: '–', ungueltig: '?' };

/** Ein Eingabefeld mit Einheit und Rückmeldung; `kompakt` für Zellen der Eingabetabelle (Meldungen stehen darunter). */
export function EingabeFeld(props: {
  e: AufgeloesteEingabe;
  wert: string;
  onChange: (text: string) => void;
  ergebnis?: EingabeErgebnis;
  kompakt?: boolean;
}) {
  const { e, wert, onChange, ergebnis, kompakt } = props;
  const cls = ergebnis ? `re-${ergebnis.status}` : '';
  const placeholder = e.vergleich === 'liste' ? 'z. B. 19; 220 oder keine' : e.vergleich === 'menge' ? 'z. B. A, C, D' : undefined;
  const input = (
    <input
      type="text"
      autoComplete="off"
      spellCheck={false}
      aria-label={e.label}
      aria-invalid={ergebnis && ergebnis.status !== 'richtig' ? true : undefined}
      placeholder={placeholder}
      value={wert}
      onChange={(ev) => onChange(ev.target.value)}
    />
  );
  if (kompakt) {
    return (
      <span className={`re-zelle ${cls}`} title={ergebnis?.meldung}>
        {input}
        {ergebnis && <span className="re-icon">{STATUS_ICON[ergebnis.status]}</span>}
      </span>
    );
  }
  return (
    <div className={`re-feld ${cls}`}>
      <label>
        <span className="re-label">{e.label}</span>
        <span className="re-input">
          {input}
          {e.einheit && <span className="re-einheit">{e.einheit}</span>}
          {ergebnis && <span className="re-icon">{STATUS_ICON[ergebnis.status]}</span>}
        </span>
      </label>
      {ergebnis && <Rueckmeldung r={ergebnis} />}
    </div>
  );
}

export function Rueckmeldung({ r }: { r: EingabeErgebnis }) {
  if (!r.meldung && !r.einheitHinweis && r.status !== 'leer') return null;
  return (
    <div className="re-meldung small">
      {r.status === 'leer' && <span className="muted">Noch leer.</span>}
      {r.meldung && <Markdown source={false}>{r.meldung}</Markdown>}
      {r.einheitHinweis && <span className="muted">{r.einheitHinweis}</span>}
    </div>
  );
}

/** Eingaben als Tabelle (z. B. Netzplan); nur Zeilen und Spalten, in denen gefragte Felder stehen. */
export function LayoutEingaben(props: {
  layout: EingabeLayout;
  felder: AufgeloesteEingabe[];
  feld: (e: AufgeloesteEingabe, kompakt: boolean) => ReactNode;
}) {
  const { layout, felder, feld } = props;
  const nachId = new Map(felder.map((e) => [e.id, e]));
  const gefragt = (x: string | null) => x !== null && nachId.has(x);
  const spalten = layout.spalten.map((s, i) => ({ s, i })).filter(({ i }) => layout.zeilen.some((z) => gefragt(z.ids[i] ?? null)));
  const zeilen = layout.zeilen.filter((z) => z.ids.some((x) => gefragt(x)));
  const einheit = felder.find((e) => e.einheit)?.einheit;
  return (
    <div className="result-scroll re-layout">
      <table className="result-table">
        <thead>
          <tr>
            <th />
            {spalten.map(({ s, i }) => (
              <th key={i}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z) => (
            <tr key={z.label}>
              <th scope="row">{z.label}</th>
              {spalten.map(({ i }) => {
                const id = z.ids[i] ?? null;
                const e = id === null ? undefined : nachId.get(id);
                return <td key={i}>{e ? feld(e, true) : null}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {einheit && felder.every((e) => !e.einheit || e.einheit === einheit) && (
        <p className="small muted re-layout-einheit">Einheit: {einheit}</p>
      )}
    </div>
  );
}

/** Rückmeldungen zu den Feldern der Eingabetabelle als Liste darunter. */
export function Meldungen({ felder, ergebnis }: { felder: AufgeloesteEingabe[]; ergebnis?: Record<string, EingabeErgebnis> }) {
  if (!ergebnis) return null;
  const mit = felder.filter((e) => ergebnis[e.id]?.meldung || ergebnis[e.id]?.einheitHinweis);
  if (!mit.length) return null;
  return (
    <ul className="re-meldungen small">
      {mit.map((e) => (
        <li key={e.id}>
          <b>{e.label}:</b> <Rueckmeldung r={ergebnis[e.id]} />
        </li>
      ))}
    </ul>
  );
}
