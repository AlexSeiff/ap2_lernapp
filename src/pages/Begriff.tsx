// Begriffsseite (/glossar/:id, Umsetzungsplan Phase 3): Definition, Erklärung, Grafik, Beispiel, Abgrenzung, Prüfungsfalle, Merksatz –
// dazu „Siehe auch“, die passenden Übungen und die Stellen zum Nachlesen. Die Seiten selbst lädt lib/begriffe.ts bei Bedarf nach.

import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { mehrZiel } from '../../shared/begriffsseiten';
import type { BegriffsSeite } from '../../shared/types';
import { Icon, type IconName } from '../components/Icon';
import { MarkierStern } from '../components/MarkierStern';
import { Markdown } from '../components/Markdown';
import { QuellenListe, useQuellen } from '../components/Quellen';
import { begriffPfad, ladeBegriffe, seitenFinder, uebungenZuBegriff, verweisAufloeser } from '../lib/begriffe';
import { cardPool } from '../lib/cards';
import { glossarVon, type GlossarEintrag } from '../lib/glossar';
import { useStore } from '../lib/store';
import { useVollerInhalt } from '../lib/texte';

const KEIN_GLOSSAR: GlossarEintrag[] = [];

/** „### Erklärung“ usw. folgen direkt auf die Seitenüberschrift (h1) – als h2 bleibt die Gliederung lückenlos (Barrierefreiheit). */
const abschnitteAlsH2 = (md: string) => md.replace(/^### /gm, '## ');

/** So viele Einträge je Übungsart zeigt die Seite, der Rest steckt hinter „alle …“. */
const MAX_JE_ART = 6;

export function Begriff() {
  const { id = '' } = useParams();
  const [seiten, setSeiten] = useState<BegriffsSeite[] | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  useEffect(() => {
    let aktiv = true;
    ladeBegriffe().then(
      (s) => aktiv && setSeiten(s),
      (e: unknown) => aktiv && setFehler(e instanceof Error ? e.message : String(e)),
    );
    return () => {
      aktiv = false;
    };
  }, []);
  // Nach dem Wechsel zu einem anderen Begriff oben anfangen.
  // In Block-Klammern: Neuere Browser geben bei scrollTo ein Promise zurück – React hielte es sonst für die Aufräumfunktion.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Glossar (Fundstellen, Verweise) braucht die nachgeladenen Abschnittstexte der Lernblätter.
  const { inhalt, fehler: textFehler } = useVollerInhalt();
  if (fehler || textFehler) return <div className="page card warn">{fehler ?? textFehler}</div>;
  if (!seiten || !inhalt) return <div className="page loading">Lädt …</div>;
  const seite = seiten.find((s) => s.id === id);
  if (!seite) return <OhneSeite id={id} seiten={seiten} />;
  return <BegriffsSeiteAnsicht seite={seite} />;
}

/** Keine Seite mit dieser id: andere Schreibweise einer Seite → dorthin, sonst zum Eintrag im Glossar. */
function OhneSeite({ id, seiten }: { id: string; seiten: BegriffsSeite[] }) {
  const { inhalt } = useVollerInhalt();
  const eintrag = inhalt && glossarVon(inhalt).find((e) => e.id === id);
  const andere = eintrag && seitenFinder(seiten)(eintrag);
  return <Navigate to={andere ? begriffPfad(andere) : `/glossar?stelle=g-${encodeURIComponent(id)}`} replace />;
}

export function BegriffsSeiteAnsicht({ seite }: { seite: BegriffsSeite }) {
  const { content, progress } = useStore();
  // Begriff() wartet auf den vollen Inhalt; das Glossar ist je Inhalt nur einmal gebaut (glossarVon).
  const { inhalt } = useVollerInhalt();
  const glossar = useMemo(() => (inhalt ? glossarVon(inhalt) : KEIN_GLOSSAR), [inhalt]);
  const eintrag = glossar.find((e) => e.id === seite.id);
  const verweis = useMemo(() => verweisAufloeser(content.begriffe ?? [], glossar, content), [content, glossar]);
  const uebungen = useMemo(
    () => uebungenZuBegriff(seite, content, cardPool(content.flashcards, progress.settings)),
    [seite, content, progress.settings],
  );
  const mehr = seite.mehr.map((m) => mehrZiel(m, content));
  const nachlesen = [
    ...mehr.filter((m) => m.link).map((m) => ({ text: m.text, link: m.link! })),
    // Fundstellen aus dem Glossar, die „Mehr“ noch nicht nennt
    ...(eintrag?.quellen ?? [])
      .filter((q) => q.art === 'abschnitt' && !mehr.some((m) => m.link === q.link))
      .map((q) => ({ text: q.titel, link: q.link })),
  ];
  const buchstabe = eintrag?.buchstabe ?? seite.begriff.charAt(0).toUpperCase();
  const quellen = useQuellen(`begriff:${seite.id}`);

  return (
    <article className="page narrow begriff-seite notebook-page concept-sheet">
      <div className="notebook-running-head">
        <span>AP2 · Nachschlagewerk</span>
        <span>Register {buchstabe}</span>
      </div>
      <p className="crumbs">
        <Link to="/glossar">Glossar</Link> / <Link to={`/glossar?stelle=buchstabe-${encodeURIComponent(buchstabe)}`}>{buchstabe}</Link>
      </p>
      <div className="begriff-kopf">
        <h1>{seite.begriff}</h1>
        {uebungen.begriffskarte && <MarkierStern cardId={uebungen.begriffskarte.id} text="Karte markieren" />}
      </div>
      {seite.auch && <p className="begriff-auch muted">Auch: {seite.auch.join(' · ')}</p>}
      <Markdown math={seite.markdown.includes('$')} source={false} className="begriff-text">
        {abschnitteAlsH2(seite.markdown)}
      </Markdown>

      {seite.siehe.length > 0 && (
        <section className="begriff-block">
          <h2>Siehe auch</h2>
          <ul className="begriff-chips">
            {seite.siehe.map(verweis).map((v) => (
              <li key={v.text}>{v.link ? <Link to={v.link}>{v.text}</Link> : <span className="muted">{v.text}</span>}</li>
            ))}
          </ul>
        </section>
      )}

      <Ueben seite={seite} uebungen={uebungen} />

      {nachlesen.length > 0 && (
        <section className="begriff-block">
          <h2>
            <Icon name="book-open" /> Nachlesen
          </h2>
          <ul className="begriff-liste">
            {nachlesen.map((n) => (
              <li key={n.link}>
                <Link to={n.link}>{n.text}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {quellen.length > 0 && (
        <section className="begriff-block">
          <h2>
            <Icon name="external-link" /> Weiterlesen und Videos
          </h2>
          <QuellenListe quellen={quellen} titel="Externe Quellen" />
        </section>
      )}
      {seite.stand && <p className="hint">Stand der Seite: {seite.stand}</p>}
    </article>
  );
}

function Ueben({ seite, uebungen }: { seite: BegriffsSeite; uebungen: ReturnType<typeof uebungenZuBegriff> }) {
  const { content } = useStore();
  const { karten, aufgaben, rechnen, sql, diagramme } = uebungen;
  if (!karten.length && !aufgaben.length && !rechnen.length && !sql.length && !diagramme.length) return null;
  const kartenLink = (ids: string[]) => `/karteikarten?karten=${ids.map(encodeURIComponent).join(',')}&von=begriff`;
  const topicTitel = (id?: string) => content.topics.find((t) => t.id === id)?.title;
  return (
    <section className="card begriff-ueben">
      <h2>
        <Icon name="target" /> Üben
      </h2>
      {karten.length > 0 && (
        <UebenGruppe
          icon="layers"
          titel={`${karten.length} ${karten.length === 1 ? 'Karteikarte' : 'Karteikarten'}`}
          alle={{ to: kartenLink(karten.map((c) => c.id)), text: karten.length === 1 ? 'Karte lernen' : 'Alle lernen' }}
          eintraege={karten.map((c) => ({ key: c.id, to: kartenLink([c.id]), text: c.question.replace(/\*\*|`/g, ''), karte: c.id }))}
        />
      )}
      {aufgaben.length > 0 && (
        <UebenGruppe
          icon="file-pen-line"
          titel={`${aufgaben.length} ${aufgaben.length === 1 ? 'Einzelaufgabe' : 'Einzelaufgaben'}`}
          eintraege={aufgaben.map((t) => ({
            key: t.id,
            to: `/aufgabe/${t.id}`,
            text: `${t.code} · ${topicTitel(t.topicId) ?? ''}`,
          }))}
        />
      )}
      {rechnen.length > 0 && (
        <UebenGruppe
          icon="calculator"
          titel={`${rechnen.length} ${rechnen.length === 1 ? 'Rechenübung' : 'Rechenübungen'}`}
          eintraege={rechnen.map((u) => ({ key: u.id, to: `/rechnen/${u.id}`, text: u.titel }))}
        />
      )}
      {diagramme.length > 0 && (
        <UebenGruppe
          icon="workflow"
          titel={`${diagramme.length} ${diagramme.length === 1 ? 'Diagramm-Übung' : 'Diagramm-Übungen'}`}
          eintraege={diagramme.map((u) => ({ key: u.id, to: `/diagramme/${u.id}`, text: u.titel }))}
        />
      )}
      {sql.length > 0 && (
        <UebenGruppe
          icon="database"
          titel={`${sql.length} ${sql.length === 1 ? 'SQL-Übung' : 'SQL-Übungen'}`}
          eintraege={sql.map((u) => ({ key: u.id, to: `/sql/uebung/${u.id}`, text: u.titel }))}
        />
      )}
      <p className="hint">
        Gefunden über den Begriff „{seite.begriff}“{seite.auch ? ' und seine anderen Schreibweisen' : ''} in Fragen und Aufgabentexten.
      </p>
    </section>
  );
}

function UebenGruppe(props: {
  icon: IconName;
  titel: string;
  /** `karte`: Karteikarten-Id – dann steht ein Stern zum Markieren vor dem Eintrag. */
  eintraege: { key: string; to: string; text: string; karte?: string }[];
  alle?: { to: string; text: string };
}) {
  const [offen, setOffen] = useState(false);
  const sichtbar = offen ? props.eintraege : props.eintraege.slice(0, MAX_JE_ART);
  const rest = props.eintraege.length - sichtbar.length;
  return (
    <div className="ueben-gruppe">
      <h3>
        <Icon name={props.icon} /> {props.titel}
        {props.alle && (
          <Link className="button small" to={props.alle.to}>
            {props.alle.text}
          </Link>
        )}
      </h3>
      <ul className="begriff-liste">
        {sichtbar.map((e) => (
          <li key={e.key} className={e.karte ? 'mit-stern' : undefined}>
            {e.karte && <MarkierStern cardId={e.karte} nurIcon label={`Markieren: ${e.text.slice(0, 80)}`} />}
            <Link to={e.to}>{e.text}</Link>
          </li>
        ))}
      </ul>
      {rest > 0 && (
        <button type="button" className="ghost small" onClick={() => setOffen(true)}>
          {rest} weitere anzeigen
        </button>
      )}
    </div>
  );
}
