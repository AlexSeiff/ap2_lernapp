// Podcast je Thema (/podcast, /podcast/:topicId): Lea und Ben sprechen über das Lernblatt (lib/podcast.ts), vorgelesen von der
// Sprachausgabe des Geräts (lib/sprachausgabe.ts). Mitlesen im Text, Kapitel anspringen, Geschwindigkeit und Stimmen wählen.
// Die Stelle je Folge und die Einstellungen merkt sich das Gerät (localStorage) – das ist Komfort, kein Lernfortschritt.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { BegriffsSeite } from '../../shared/types';
import { Icon } from '../components/Icon';
import { ladeBegriffe } from '../lib/begriffe';
import { bauePodcast, dauerMinuten, hatPodcastThema, SPRECHER_NAMEN, type Folge, type Sprecher, type Zeile } from '../lib/podcast';
import { deutscheStimmen, sprachausgabeDa, stimmenVorschlag, Vorleser } from '../lib/sprachausgabe';
import { useStore } from '../lib/store';
import { useThemaTexte, useVollerInhalt } from '../lib/texte';

const STELLE = (topicId: string) => `ap2-podcast:${topicId}`;
const EINSTELLUNGEN = 'ap2-podcast-einstellungen';
const TEMPI = [0.8, 0.9, 1, 1.15, 1.3, 1.5];

interface PodcastEinstellungen {
  tempo: number;
  stimmen: Partial<Record<Sprecher, string>>;
}

function lies<T>(schluessel: string, fallback: T): T {
  try {
    const t = localStorage.getItem(schluessel);
    return t ? ({ ...fallback, ...JSON.parse(t) } as T) : fallback;
  } catch {
    return fallback;
  }
}

function schreib(schluessel: string, wert: unknown) {
  try {
    localStorage.setItem(schluessel, JSON.stringify(wert));
  } catch {
    /* ohne Speicher gilt es nur bis zum Neuladen */
  }
}

/** Begriffsseiten (begriffe.json) einmal laden. */
function useBegriffsseiten(): { seiten?: BegriffsSeite[]; fehler?: string } {
  const [seiten, setSeiten] = useState<BegriffsSeite[]>();
  const [fehler, setFehler] = useState<string>();
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
  return { seiten, fehler };
}

/** Übersicht aller Folgen. */
export function Podcasts() {
  const { content } = useStore();
  const { inhalt, fehler: textFehler } = useVollerInhalt();
  const { seiten, fehler } = useBegriffsseiten();
  const folgen = useMemo(
    () =>
      inhalt && seiten
        ? inhalt.topics
            .filter((t) => hatPodcastThema(t))
            .map((t) => bauePodcast(t, seiten, content.flashcards))
            .filter((f): f is Folge => !!f)
        : undefined,
    [inhalt, seiten, content.flashcards],
  );
  return (
    <div className="page narrow">
      <h1>
        <Icon name="headphones" /> Podcast
      </h1>
      <p className="lead">
        Zu jedem Thema ein Gespräch zum Anhören: Lea fragt, Ben erklärt die Begriffe mit Beispielen und typischen Prüfungsfallen – am Ende
        ein Quiz mit Prüferfragen. Ideal für unterwegs.
      </p>
      {(fehler || textFehler) && <p className="card warn">{fehler ?? textFehler}</p>}
      {!folgen && !fehler && !textFehler && <p className="loading">Lädt …</p>}
      {folgen && (
        <ol className="podcast-liste">
          {folgen.map((f) => {
            const stelle = lies<{ index?: number }>(STELLE(f.topicId), {}).index;
            return (
              <li key={f.topicId}>
                <Link to={`/podcast/${f.topicId}`} className="tile podcast-folge">
                  <span className="podcast-nr">{Number(f.topicId)}</span>
                  <span>
                    <span className="tile-title">{f.titel}</span>
                    <span className="tile-meta">
                      {f.begriffe} Begriffe{f.fragen ? ` · ${f.fragen} Prüferfragen` : ''} · ~{dauerMinuten(f.kapitel)} min
                      {stelle ? ' · angefangen' : ''}
                    </span>
                  </span>
                  <Icon name="circle-play" />
                </Link>
              </li>
            );
          })}
        </ol>
      )}
      <p className="hint">Für WiSo, das Fachgespräch und den Prüfungsablauf gibt es keine Folgen.</p>
    </div>
  );
}

/** Eine Folge abspielen. */
export function Podcast() {
  const { topicId = '' } = useParams();
  const { content } = useStore();
  const kern = content.topics.find((t) => t.id === topicId);
  const { topic, fehler: textFehler } = useThemaTexte(kern);
  const { seiten, fehler } = useBegriffsseiten();
  const folge = useMemo(
    () => (topic && seiten ? bauePodcast(topic, seiten, content.flashcards) : undefined),
    [topic, seiten, content.flashcards],
  );

  if (!kern || !hatPodcastThema(kern))
    return (
      <div className="page narrow">
        <h1>Keine Folge</h1>
        <p>
          Zu diesem Thema gibt es keinen Podcast. <Link to="/podcast">Alle Folgen</Link>
        </p>
      </div>
    );
  if (fehler || textFehler) return <div className="page card warn">{fehler ?? textFehler}</div>;
  if (!topic || !seiten) return <div className="page loading">Lädt …</div>;
  if (!folge)
    return (
      <div className="page narrow">
        <h1>Keine Folge</h1>
        <p>
          Zu „{kern.title}“ gibt es noch keine Begriffe zum Besprechen. <Link to="/podcast">Alle Folgen</Link>
        </p>
      </div>
    );
  return <Player key={folge.topicId} folge={folge} />;
}

function Player({ folge }: { folge: Folge }) {
  const zeilen = useMemo(() => folge.kapitel.flatMap((k, ki) => k.zeilen.map((z) => ({ z, ki }))), [folge]);
  const kapitelStart = useMemo(() => folge.kapitel.map((_, ki) => zeilen.findIndex((x) => x.ki === ki)), [folge, zeilen]);
  const [index, setIndex] = useState(() => Math.min(lies<{ index?: number }>(STELLE(folge.topicId), {}).index ?? 0, zeilen.length - 1));
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string>();
  const [einst, setEinst] = useState<PodcastEinstellungen>(() => lies(EINSTELLUNGEN, { tempo: 1, stimmen: {} }));
  const [stimmen, setStimmen] = useState(deutscheStimmen);
  const da = sprachausgabeDa();
  const vorschlag = stimmenVorschlag(stimmen);
  const gewaehlt: Record<Sprecher, string | undefined> = {
    lea: stimmen.some((v) => v.name === einst.stimmen.lea) ? einst.stimmen.lea : vorschlag.lea,
    ben: stimmen.some((v) => v.name === einst.stimmen.ben) ? einst.stimmen.ben : vorschlag.ben,
  };

  // Stimmen kommen in Chrome erst nach „voiceschanged“.
  useEffect(() => {
    if (!da) return;
    const neu = () => setStimmen(deutscheStimmen());
    speechSynthesis.addEventListener('voiceschanged', neu);
    return () => speechSynthesis.removeEventListener('voiceschanged', neu);
  }, [da]);

  const vorleser = useRef<Vorleser | null>(null);
  useEffect(() => {
    const v = new Vorleser(
      zeilen.map((x) => x.z),
      {
        stimmen: gewaehlt,
        tempo: einst.tempo,
        weiter: setIndex,
        fertig: () => (setLaeuft(false), setIndex(0)),
        fehler: (m) => (setLaeuft(false), setFehler(m)),
      },
    );
    vorleser.current = v;
    return () => v.stopp();
    // Der Vorleser gehört zur Folge; Stimmen und Tempo kommen über setzeOptionen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zeilen]);
  useEffect(() => {
    vorleser.current?.setzeOptionen({ stimmen: gewaehlt, tempo: einst.tempo });
  }, [gewaehlt.lea, gewaehlt.ben, einst.tempo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => schreib(STELLE(folge.topicId), { index }), [folge.topicId, index]);

  const spiele = (ab = index) => {
    setFehler(undefined);
    setIndex(ab);
    setLaeuft(true);
    vorleser.current?.start(ab);
  };
  const halt = () => {
    setLaeuft(false);
    vorleser.current?.stopp();
  };
  const springe = (ziel: number) => {
    const i = Math.max(0, Math.min(zeilen.length - 1, ziel));
    if (laeuft) spiele(i);
    else setIndex(i);
  };
  const ki = zeilen[index]?.ki ?? 0;
  const kapitelZurueck = () => springe(index - kapitelStart[ki] > 2 ? kapitelStart[ki] : (kapitelStart[ki - 1] ?? 0));
  const kapitelVor = () => springe(kapitelStart[ki + 1] ?? zeilen.length - 1);

  // Kopfhörer- und Sperrbildschirm-Tasten (Media Session), soweit das Gerät sie an die Seite gibt.
  const aktionen = useRef({ spiele, halt, kapitelVor, kapitelZurueck });
  useEffect(() => {
    aktionen.current = { spiele, halt, kapitelVor, kapitelZurueck };
  });
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: folge.titel, artist: 'AP2-Podcast', album: 'AP2 Lern-App' });
    const ms = navigator.mediaSession;
    ms.setActionHandler('play', () => aktionen.current.spiele());
    ms.setActionHandler('pause', () => aktionen.current.halt());
    ms.setActionHandler('nexttrack', () => aktionen.current.kapitelVor());
    ms.setActionHandler('previoustrack', () => aktionen.current.kapitelZurueck());
    return () => {
      for (const a of ['play', 'pause', 'nexttrack', 'previoustrack'] as const) ms.setActionHandler(a, null);
    };
  }, [folge.titel]);

  // Beim Abspielen mitscrollen.
  const aktuell = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (laeuft) aktuell.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [index, laeuft]);

  const setze = (neu: Partial<PodcastEinstellungen>) => {
    const e = { ...einst, ...neu, stimmen: { ...einst.stimmen, ...neu.stimmen } };
    setEinst(e);
    schreib(EINSTELLUNGEN, e);
  };
  const fortschritt = Math.round((index / Math.max(1, zeilen.length - 1)) * 100);

  return (
    <div className="page narrow podcast">
      <p className="crumbs">
        <Link to="/podcast">Podcast</Link> / Deep Dive {Number(folge.topicId)}
      </p>
      <h1>{folge.titel}</h1>
      <p className="lead">
        {folge.begriffe} Begriffe{folge.fragen ? `, ${folge.fragen} Prüferfragen` : ''} · etwa {dauerMinuten(folge.kapitel)} Minuten
      </p>

      <section className="card podcast-player">
        <p className="podcast-kapitel">
          Kapitel {ki + 1}/{folge.kapitel.length}: <b>{folge.kapitel[ki].titel}</b>
        </p>
        <div
          className="runden-balken"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={fortschritt}
          aria-label="Fortschritt der Folge"
        >
          <div style={{ width: `${fortschritt}%` }} />
        </div>
        <div className="podcast-knoepfe">
          <button type="button" className="ghost" onClick={kapitelZurueck} aria-label="Kapitel zurück" disabled={!da}>
            <Icon name="skip-back" />
          </button>
          {laeuft ? (
            <button type="button" className="podcast-haupt" onClick={halt} aria-label="Pause">
              <Icon name="pause" />
            </button>
          ) : (
            <button
              type="button"
              className="podcast-haupt"
              onClick={() => spiele()}
              aria-label={index ? 'Weiterhören' : 'Abspielen'}
              disabled={!da}
            >
              <Icon name="play" />
            </button>
          )}
          <button type="button" className="ghost" onClick={kapitelVor} aria-label="Nächstes Kapitel" disabled={!da}>
            <Icon name="skip-forward" />
          </button>
        </div>
        {fehler && (
          <p className="card warn" role="alert">
            <Icon name="triangle-alert" /> {fehler}
          </p>
        )}
        {!da ? (
          <p className="card warn">Dein Browser hat keine Sprachausgabe – du kannst die Folge unten mitlesen.</p>
        ) : !stimmen.length ? (
          <p className="hint">
            Keine deutsche Stimme gefunden – es liest die Standardstimme. Deutsche Stimmen lassen sich in den Systemeinstellungen
            nachinstallieren.
          </p>
        ) : null}
        <div className="podcast-einstellungen">
          <label className="field">
            Tempo
            <select value={einst.tempo} onChange={(e) => setze({ tempo: Number(e.target.value) })}>
              {TEMPI.map((t) => (
                <option key={t} value={t}>
                  {String(t).replace('.', ',')}×
                </option>
              ))}
            </select>
          </label>
          {stimmen.length > 0 &&
            (['lea', 'ben'] as const).map((s) => (
              <label key={s} className="field">
                Stimme {SPRECHER_NAMEN[s]}
                <select value={gewaehlt[s]} onChange={(e) => setze({ stimmen: { [s]: e.target.value } })}>
                  {stimmen.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace(/^Microsoft\s+|\s+Online.*$|\s+-\s+German.*$/g, '')}
                    </option>
                  ))}
                </select>
              </label>
            ))}
        </div>
        <p className="hint">Auf dem Handy: Bildschirm an lassen – manche Geräte stoppen die Sprachausgabe bei gesperrtem Bildschirm.</p>
      </section>

      <nav className="podcast-inhalt" aria-label="Kapitel">
        {folge.kapitel.map((k, i) => (
          <button key={k.titel} type="button" className={`secondary ${i === ki ? 'aktiv' : ''}`} onClick={() => springe(kapitelStart[i])}>
            {k.titel}
          </button>
        ))}
      </nav>

      <ol className="podcast-text">
        {zeilen.map(({ z, ki: k }, i) => (
          <TextZeile
            key={i}
            z={z}
            kapitel={i === kapitelStart[k] ? folge.kapitel[k].titel : undefined}
            aktuell={i === index}
            zeileRef={i === index ? aktuell : undefined}
            onClick={() => (laeuft ? spiele(i) : setIndex(i))}
          />
        ))}
      </ol>
    </div>
  );
}

function TextZeile(props: { z: Zeile; kapitel?: string; aktuell: boolean; zeileRef?: React.Ref<HTMLLIElement>; onClick: () => void }) {
  const { z, kapitel, aktuell, zeileRef, onClick } = props;
  return (
    <li ref={zeileRef} className={`${aktuell ? 'aktuell' : ''} ${'pause' in z ? 'pause' : z.sprecher}`}>
      {kapitel && <h2>{kapitel}</h2>}
      {'pause' in z ? (
        <span className="muted small">… kurz nachdenken …</span>
      ) : (
        <button type="button" className="podcast-zeile" onClick={onClick}>
          <b>{SPRECHER_NAMEN[z.sprecher]}:</b> {z.text}
        </button>
      )}
    </li>
  );
}
