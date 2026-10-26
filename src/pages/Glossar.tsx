// Glossar (/glossar, ROADMAP 8.9; früher /material/glossar): Fachbegriffe aus Begriffs- und Wissenskarten und fetten Begriffen der Lernblätter,
// alphabetisch mit Buchstaben-Sprungleiste und Filter. Lazy geladen; Logik in src/lib/glossar.ts.

import { memo, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Markdown } from '../components/Markdown';
import { useStelle } from '../hooks/useStelle';
import { begriffPfad, seitenFinder } from '../lib/begriffe';
import { glossarBuchstaben, glossarVon, type GlossarEintrag } from '../lib/glossar';
import { normalisiere } from '../lib/normalisiere';
import { useVollerInhalt } from '../lib/texte';
import type { Content } from '../../shared/types';
import { KartenWechsel } from '../components/KartenWechsel';
import { Icon } from '../components/Icon';

export function Glossar() {
  const [params] = useSearchParams();
  const stelle = params.get('stelle') ?? '';
  // Das Glossar sammelt auch die fetten Begriffe der Lernblätter – es braucht die nachgeladenen Abschnittstexte.
  const { inhalt, fehler } = useVollerInhalt();
  if (fehler) return <div className="page card warn">{fehler}</div>;
  if (!inhalt) return <div className="page loading">Lädt …</div>;
  return <GlossarSeite key={stelle} content={inhalt} stelle={stelle} />;
}

function GlossarSeite({ content, stelle }: { content: Content; stelle: string }) {
  const eintraege = glossarVon(content);
  const [filter, setFilter] = useState('');
  const [seite, setSeite] = useState(() => {
    const ziel = eintraege.findIndex((e) => `g-${e.id}` === stelle || `buchstabe-${e.buchstabe}` === stelle);
    return Math.floor(Math.max(0, ziel) / 6);
  });
  const [zurueck, setZurueck] = useState(false);
  useStelle();
  const f = normalisiere(filter);
  const sichtbar = f ? eintraege.filter((e) => normalisiere(e.begriff).includes(f)) : eintraege;
  const buchstaben = glossarBuchstaben(sichtbar);
  // Kleine Doppelseiten bleiben auch bei langen Definitionen vollständig lesbar.
  const umfang = 6;
  const anzahlSeiten = Math.max(1, Math.ceil(sichtbar.length / umfang));
  const aktuell = Math.min(seite, anzahlSeiten - 1);
  const aufgeschlagen = sichtbar.slice(aktuell * umfang, (aktuell + 1) * umfang);
  const blaettere = (ziel: number) => {
    setZurueck(ziel < aktuell);
    setSeite(Math.max(0, Math.min(anzahlSeiten - 1, ziel)));
  };
  const mitDefinition = eintraege.filter((e) => e.definition).length;
  const begriffskarten = content.flashcards.filter((c) => c.typ === 'begriff').length;
  const seiteZu = useMemo(() => seitenFinder(content.begriffe ?? []), [content]);
  const seitenZahl = content.begriffe?.length ?? 0;

  return (
    <div className="page glossar">
      <h1>
        <Icon name="library" /> Glossar
      </h1>
      <p className="lead">
        Dein Nachschlagewerk für die AP2. Wähle einen Buchstaben oder suche einen Begriff und blättere durch die Seiten.
      </p>
      <p className="small muted">
        {eintraege.length} Begriffe · {mitDefinition} Erklärungen{seitenZahl > 0 && ` · ${seitenZahl} vertiefende Begriffsseiten`}
      </p>
      {begriffskarten > 0 && (
        <p>
          <Link to="/karteikarten?typ=begriff">
            <Icon name="layers" /> {begriffskarten} Begriffskarten lernen
          </Link>{' '}
          ·{' '}
          <Link to="/karteikarten?typ=begriff&blaettern=1">
            <Icon name="book-open" /> durchblättern
          </Link>
          <span className="muted small"> – Vorderseite Begriff, Rückseite Erklärung, mit Wiederholung wie alle Karteikarten.</span>
        </p>
      )}
      <div className="glossar-filter">
        <input
          type="search"
          placeholder="Begriff filtern …"
          aria-label="Begriffe filtern"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setSeite(0);
          }}
        />
        {f && (
          <span className="muted small">
            {sichtbar.length} von {eintraege.length}
          </span>
        )}
      </div>
      <nav className="glossar-abc" aria-label="Buchstaben">
        {buchstaben.map(({ buchstabe, anzahl }) =>
          anzahl ? (
            <button
              type="button"
              key={buchstabe}
              aria-pressed={aufgeschlagen.some((e) => e.buchstabe === buchstabe)}
              onClick={() => blaettere(Math.floor(sichtbar.findIndex((e) => e.buchstabe === buchstabe) / umfang))}
            >
              {buchstabe}
            </button>
          ) : (
            <span key={buchstabe} className="muted" aria-hidden="true">
              {buchstabe}
            </span>
          ),
        )}
      </nav>
      {!sichtbar.length && <p className="muted">Kein Begriff passt zu „{filter}“.</p>}
      {sichtbar.length > 0 && (
        <>
          <div className="book-cover">
            <KartenWechsel id={`${filter}-${aktuell}`} zurueck={zurueck}>
              <div className="book-spread">
                {[0, 1].map((haelfte) => (
                  <section className="book-page" key={haelfte} aria-label={`Seite ${aktuell * 2 + haelfte + 1}`}>
                    <div className="book-running-head">
                      <span>AP2 · Nachschlagewerk</span>
                      <span>{aufgeschlagen[haelfte * 3]?.buchstabe ?? 'Register'}</span>
                    </div>
                    <dl>
                      {aufgeschlagen.slice(haelfte * 3, haelfte * 3 + 3).map((e) => (
                        <GlossarZeile
                          key={e.id}
                          e={e}
                          seite={seiteZu(e)}
                          buchstabenAnker={aufgeschlagen.find((eintrag) => eintrag.buchstabe === e.buchstabe)?.id === e.id}
                        />
                      ))}
                    </dl>
                    <span className="book-page-number">{aktuell * 2 + haelfte + 1}</span>
                  </section>
                ))}
              </div>
            </KartenWechsel>
          </div>
          <nav className="book-navigation" aria-label="Glossarseiten">
            <button type="button" className="secondary" disabled={aktuell === 0} onClick={() => blaettere(aktuell - 1)}>
              ← Zurück
            </button>
            <span role="status">
              Doppelseite {aktuell + 1} von {anzahlSeiten}
            </span>
            <button type="button" className="secondary" disabled={aktuell === anzahlSeiten - 1} onClick={() => blaettere(aktuell + 1)}>
              Weiter →
            </button>
          </nav>
        </>
      )}
    </div>
  );
}

// memo: Beim Tippen im Filter rendert nur die Liste neu, nicht jede der über 1000 Erklärungen (Markdown) erneut.
const GlossarZeile = memo(function GlossarZeile({
  e,
  seite,
  buchstabenAnker,
}: {
  e: GlossarEintrag;
  seite?: string;
  buchstabenAnker?: boolean;
}) {
  return (
    <div className="glossar-eintrag" id={`g-${e.id}`}>
      <dt id={buchstabenAnker ? `buchstabe-${e.buchstabe}` : undefined}>
        {seite ? (
          <Link to={begriffPfad(seite)} className="glossar-seite-link">
            {e.begriff} <Icon name="chevron-right" />
          </Link>
        ) : (
          e.begriff
        )}
      </dt>
      <dd>
        {e.definition ? (
          <Markdown math={e.definition.includes('$')} source={false} className="glossar-def">
            {e.definition}
          </Markdown>
        ) : (
          <p className="muted small">Keine Erklärung im Material – schau an der Fundstelle nach.</p>
        )}
        <p className="glossar-quellen small">
          {e.quellen.map((q, i) => (
            <span key={q.link}>
              {i > 0 && ' · '}
              <Link to={q.link}>
                <Icon name={q.art === 'karte' ? 'layers' : 'book-open'} /> {q.titel}
              </Link>
            </span>
          ))}
        </p>
      </dd>
    </div>
  );
});
