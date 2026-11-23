// Klausur-Builder (/klausur/bauen): eigene Klausur aus Aufgaben aller Übungsklausuren zusammenstellen – einzeln über die Suche
// oder aus gewählten Themen bis zu einer Punktzahl aufgefüllt. „Klausur erstellen“ öffnet die Klausur im normalen Klausurmodus
// (ID „bau-…“, lib/eigeneKlausur.ts). Die Auswahl bleibt als Entwurf in diesem Browser; „?aufgaben=…“ lädt eine bestehende
// eigene Klausur zum Bearbeiten.

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { Task } from '../../../domain/types';
import { Icon } from '../../components/Icon';
import { useConfirm } from '../../hooks/useConfirm';
import {
  EIGENE_MAX,
  eigeneId,
  eigeneMinuten,
  fehlendeBezuege,
  fuelleAuf,
  leseBuilderEntwurf,
  schreibeBuilderEntwurf,
  sucheAufgaben,
  type BuilderEntwurf,
} from '../../lib/eigeneKlausur';
import { formatPoints } from '../../lib/grading';
import { useStore } from '../../lib/store';
import { PRUEFUNGSBEREICHE } from '../../lib/uebersicht';
import { neuerSeed } from '../../rechnen/zufall';

const TREFFER_MAX = 40;
const vorschau = (t: Task) =>
  t.markdown
    .replace(/[*`#>|]/g, '')
    .split('\n')
    .find((z) => z.trim())
    ?.slice(0, 160) ?? '';

function startEntwurf(param: string | null): BuilderEntwurf {
  const ausLink = param?.split('.').filter(Boolean);
  if (ausLink?.length) return { auswahl: ausLink, themen: [], ziel: 100 };
  return leseBuilderEntwurf() ?? { auswahl: [], themen: [], ziel: 100 };
}

export function KlausurBuilder() {
  const { content } = useStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [params] = useSearchParams();
  const [entwurf, setEntwurf] = useState<BuilderEntwurf>(() => startEntwurf(params.get('aufgaben')));
  const [suche, setSuche] = useState('');
  const [thema, setThema] = useState('');
  const [hinweis, setHinweis] = useState('');

  useEffect(() => schreibeBuilderEntwurf(entwurf), [entwurf]);

  const themen = useMemo(() => content.topics.filter((t) => t.exam?.blocks.length), [content.topics]);
  const themaTitel = (id: string) => {
    const t = content.topics.find((x) => x.id === id);
    return t ? `${t.id === '00' ? 'SQL-Zusatz' : `DD ${t.number}`} · ${t.title}` : id;
  };
  const auswahl = entwurf.auswahl.filter((id) => content.tasks[id]);
  const gewaehlt = new Set(auswahl);
  const summe = auswahl.reduce((s, id) => s + (content.tasks[id]?.points ?? 0), 0);
  const voll = auswahl.length >= EIGENE_MAX;
  const treffer = useMemo(() => (suche.trim() || thema ? sucheAufgaben(content, suche, thema || undefined) : []), [content, suche, thema]);

  /** Änderung am Entwurf – immer auf den aktuellen Stand (mehrere Klicks kurz nacheinander gehen nicht verloren). */
  const aendere = (f: (e: BuilderEntwurf) => Partial<BuilderEntwurf>) => {
    setEntwurf((e) => ({ ...e, ...f(e) }));
    setHinweis('');
  };
  const hinzu = (ids: string[]) => {
    const neu = ids.filter((id) => !gewaehlt.has(id));
    const platz = Math.max(0, EIGENE_MAX - auswahl.length);
    aendere((e) => ({ auswahl: [...e.auswahl, ...neu.filter((id) => !e.auswahl.includes(id))].slice(0, EIGENE_MAX) }));
    if (neu.length > platz) setHinweis(`Höchstens ${EIGENE_MAX} Aufgaben – ${neu.length - platz} nicht hinzugefügt.`);
  };
  const weg = (id: string) => aendere((e) => ({ auswahl: e.auswahl.filter((x) => x !== id) }));
  const themaUmschalten = (id: string) =>
    aendere((e) => ({ themen: e.themen.includes(id) ? e.themen.filter((x) => x !== id) : [...e.themen, id] }));
  const auffuellen = () => {
    const neu = fuelleAuf(content, entwurf.themen, auswahl, entwurf.ziel, neuerSeed()).slice(0, EIGENE_MAX);
    const dazu = neu.length - auswahl.length;
    aendere(() => ({ auswahl: neu }));
    setHinweis(
      dazu > 0
        ? `${dazu} ${dazu === 1 ? 'Aufgabe' : 'Aufgaben'} hinzugefügt.`
        : 'Nichts mehr gefunden, das noch in die Zielpunkte passt – wähle weitere Themen oder erhöhe das Ziel.',
    );
  };
  const leeren = async () => {
    if (!(await confirm({ message: 'Alle ausgewählten Aufgaben entfernen?', confirmLabel: 'Leeren', danger: true }))) return;
    aendere(() => ({ auswahl: [] }));
  };

  // Auswahl gruppiert nach Herkunft (wie später in der Klausur).
  const gruppenMap = new Map<string, Task[]>();
  for (const id of auswahl) {
    const t = content.tasks[id];
    const key = `${t.topicId}|${t.block}`;
    gruppenMap.set(key, [...(gruppenMap.get(key) ?? []), t]);
  }
  const gruppen = [...gruppenMap.values()];

  return (
    <div className="page kb-page">
      <p className="crumbs">
        <Link to="/klausur">Übungsklausur</Link> / Klausur-Builder
      </p>
      <h1>
        <Icon name="pencil" /> Klausur-Builder
      </h1>
      <p className="lead">
        Stell dir eine Klausur aus allen Übungsklausuren zusammen: Aufgaben suchen und einzeln hinzufügen oder Themen wählen und automatisch
        bis zur Punktzahl auffüllen lassen. Die Klausur läuft danach wie jede andere – mit Zeit, Abgabe und Selbstbewertung.
      </p>

      <div className="kb-layout">
        <div className="kb-quellen">
          <section className="card">
            <h2>
              <Icon name="search" /> Aufgaben suchen
            </h2>
            <div className="filters">
              <label className="kb-suche">
                Stichwort
                <input
                  type="search"
                  id="kb-suche"
                  value={suche}
                  placeholder="z. B. Entropie, RAID, Kick-off, HTTP"
                  onChange={(e) => setSuche(e.target.value)}
                />
              </label>
              <label>
                Thema
                <select id="kb-thema" value={thema} onChange={(e) => setThema(e.target.value)}>
                  <option value="">Alle Themen</option>
                  {themen.map((t) => (
                    <option key={t.id} value={t.id}>
                      {themaTitel(t.id)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {!suche.trim() && !thema ? (
              <p className="muted small">Gib ein Stichwort ein oder wähle ein Thema.</p>
            ) : !treffer.length ? (
              <p className="muted small">Keine Aufgabe passt dazu.</p>
            ) : (
              <>
                <div className="kb-trefferkopf">
                  <span className="muted small">
                    {treffer.length} {treffer.length === 1 ? 'Treffer' : 'Treffer'}
                    {treffer.length > TREFFER_MAX ? ` – die ersten ${TREFFER_MAX} angezeigt` : ''}
                  </span>
                  <button
                    type="button"
                    className="ghost small"
                    disabled={voll || treffer.every((t) => gewaehlt.has(t.id))}
                    onClick={() => hinzu(treffer.slice(0, TREFFER_MAX).map((t) => t.id))}
                  >
                    + Alle hinzufügen
                  </button>
                </div>
                <ul className="kb-liste">
                  {treffer.slice(0, TREFFER_MAX).map((t) => {
                    const drin = gewaehlt.has(t.id);
                    return (
                      <li key={t.id} className={drin ? 'drin' : ''}>
                        <button
                          type="button"
                          className={drin ? 'secondary small' : 'small'}
                          onClick={() => (drin ? weg(t.id) : hinzu([t.id]))}
                          disabled={!drin && voll}
                          aria-label={drin ? `${t.id} entfernen` : `${t.id} hinzufügen`}
                        >
                          {drin ? '✓' : '+'}
                        </button>
                        <span className="kb-text">
                          <span className="kb-kopf">
                            <Link to={`/aufgabe/${t.id}`} className="task-code">
                              {t.id}
                            </Link>
                            <span className="muted small">{themaTitel(t.topicId)}</span>
                          </span>
                          <span className="kb-vorschau">{vorschau(t)}</span>
                        </span>
                        <span className="badge">{formatPoints(t.points)} P</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </section>

          <section className="card">
            <h2>
              <Icon name="dices" /> Aus Themen auffüllen
            </h2>
            <p className="small muted">
              Wähle Themen. „Auffüllen“ ergänzt deine Auswahl um ganze Aufgabenanfänge aus deren Übungsklausuren (A1, A1 + A2 …), bis die
              Zielpunkte erreicht sind – spätere Aufgaben bauen oft auf frühere auf.
            </p>
            {PRUEFUNGSBEREICHE.map((b) => (
              <fieldset key={b.id} className="kb-bereich">
                <legend>{b.titel}</legend>
                <div className="kb-themen">
                  {b.themen
                    .filter((id) => themen.some((t) => t.id === id))
                    .map((id) => (
                      <label key={id} className="kb-thema">
                        <input type="checkbox" checked={entwurf.themen.includes(id)} onChange={() => themaUmschalten(id)} />
                        {themaTitel(id)}
                      </label>
                    ))}
                </div>
              </fieldset>
            ))}
            <div className="actions kb-ziel">
              <label>
                Zielpunkte{' '}
                <input
                  type="number"
                  id="kb-ziel"
                  min={10}
                  max={200}
                  step={5}
                  value={entwurf.ziel}
                  onChange={(e) => {
                    const ziel = Math.max(10, Math.min(200, Number(e.target.value) || 100));
                    aendere(() => ({ ziel }));
                  }}
                />
              </label>
              <button type="button" onClick={auffuellen} disabled={!entwurf.themen.length || summe >= entwurf.ziel || voll}>
                <Icon name="dices" /> Bis {entwurf.ziel} P auffüllen
              </button>
            </div>
          </section>
        </div>

        <aside className="card kb-klausur" aria-label="Deine Klausur">
          <h2>Deine Klausur</h2>
          <p className="kb-summe">
            <b>{formatPoints(summe)} P</b> · {auswahl.length} {auswahl.length === 1 ? 'Aufgabe' : 'Aufgaben'}
            {auswahl.length > 0 && <> · {eigeneMinuten(summe)} min</>}
          </p>
          <span className="bar wide" title={`${summe} von ${entwurf.ziel} Punkten`}>
            <span className="bar-fill good" style={{ width: `${Math.min(100, (summe / entwurf.ziel) * 100)}%` }} />
          </span>
          {hinweis && (
            <p className="small kb-hinweis" role="status">
              {hinweis}
            </p>
          )}
          {!auswahl.length ? (
            <p className="muted small">Noch leer. Suche Aufgaben oder fülle aus Themen auf.</p>
          ) : (
            <ol className="kb-gruppen">
              {gruppen.map((g) => (
                <li key={`${g[0].topicId}|${g[0].block}`}>
                  <span className="small muted">
                    {themaTitel(g[0].topicId)} · Block {g[0].block}
                  </span>
                  <ul className="kb-auswahl">
                    {g.map((t) => {
                      const fehlt = fehlendeBezuege(content, t, gewaehlt);
                      return (
                        <li key={t.id}>
                          <Link to={`/aufgabe/${t.id}`} className="task-code">
                            {t.code}
                          </Link>
                          <span className="kb-vorschau">
                            {vorschau(t)}
                            {fehlt.length > 0 && (
                              <span className="kb-bezug" title="Diese Aufgabe bezieht sich auf eine Aufgabe, die nicht ausgewählt ist">
                                {' '}
                                · bezieht sich auf {fehlt.join(', ')}
                              </span>
                            )}
                          </span>
                          <span className="badge">{formatPoints(t.points)} P</span>
                          <button type="button" className="ghost small danger" onClick={() => weg(t.id)} aria-label={`${t.id} entfernen`}>
                            ✕
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          )}
          <div className="actions">
            <button type="button" disabled={!auswahl.length} onClick={() => navigate(`/klausur/${eigeneId(auswahl)}`)}>
              <Icon name="play" /> Klausur erstellen
            </button>
            <button
              type="button"
              className="secondary"
              disabled={!auswahl.length}
              onClick={() => navigate(`/druck?art=aufgaben&thema=${eigeneId(auswahl)}`)}
            >
              <Icon name="printer" /> Drucken
            </button>
            <button type="button" className="ghost" disabled={!auswahl.length} onClick={() => void leeren()}>
              <Icon name="rotate-ccw" /> Leeren
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
