import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Rating } from '../../shared/progress';
import type { Flashcard } from '../../shared/types';
import { Icon } from '../components/Icon';
import { Markdown } from '../components/Markdown';
import { rateCard } from '../lib/progress';
import { shuffle } from '../lib/shuffle';
import { useStore } from '../lib/store';

const ANZAHL = [3, 5, 8] as const;
const MIN_PRO_FRAGE = 2;

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * Fachgespräch-Simulation: Prüferfragen und Fachgesprächsfragen zufällig, mit Zeitfenster je Frage – laut antworten (optional mit
 * Aufnahme zum Anhören; sie bleibt im Browser und wird nicht gespeichert), dann Musterantwort und Selbsteinschätzung.
 */
export function Fachgespraech() {
  const { content } = useStore();
  const pool = useMemo(() => content.flashcards.filter((c) => c.kind === 'prueferfrage' || c.kind === 'fachgespraech'), [content]);
  const [runde, setRunde] = useState<Flashcard[] | null>(null);
  const [anzahl, setAnzahl] = useState<number>(5);
  const [ergebnis, setErgebnis] = useState<Rating[]>([]);

  if (!runde)
    return (
      <div className="page narrow">
        <h1>
          <Icon name="mic" /> Fachgespräch üben
        </h1>
        <p className="lead">
          Wie im mündlichen Teil: Du bekommst Fragen aus den Lernblättern (Prüferfragen und Fachgespräch), antwortest laut in ganzen Sätzen
          und vergleichst danach mit der Musterantwort. Pro Frage hast du etwa {MIN_PRO_FRAGE} Minuten.
        </p>
        <div className="actions" role="group" aria-label="Anzahl der Fragen">
          {ANZAHL.map((n) => (
            <button
              key={n}
              type="button"
              className={n === anzahl ? '' : 'secondary'}
              aria-pressed={n === anzahl}
              onClick={() => setAnzahl(n)}
            >
              {n} Fragen
            </button>
          ))}
        </div>
        <div className="actions">
          <button
            type="button"
            disabled={!pool.length}
            onClick={() => {
              setErgebnis([]);
              setRunde(shuffle(pool).slice(0, anzahl));
            }}
          >
            <Icon name="play" /> Gespräch starten
          </button>
        </div>
        {!pool.length && <p className="muted">Keine Prüfer- oder Fachgesprächsfragen vorhanden.</p>}
        <p className="hint">{pool.length} Fragen im Pool.</p>
      </div>
    );

  if (ergebnis.length >= runde.length)
    return (
      <div className="page narrow">
        <h1>
          <Icon name="mic" /> Fachgespräch geschafft
        </h1>
        <p className="card success" role="status">
          ✓ {ergebnis.filter((r) => r === 'gewusst').length} sicher · ~ {ergebnis.filter((r) => r === 'unsicher').length} unsicher · ✗{' '}
          {ergebnis.filter((r) => r === 'nicht').length} nicht gewusst
        </p>
        <p>Unsichere und nicht gewusste Fragen kommen in den Karteikarten früher wieder.</p>
        <div className="actions">
          <button type="button" onClick={() => setRunde(null)}>
            Noch ein Gespräch
          </button>
          <Link className="button secondary" to="/karteikarten">
            Zu den Karteikarten
          </Link>
        </div>
      </div>
    );

  return (
    <Frage
      key={ergebnis.length}
      karte={runde[ergebnis.length]}
      nummer={ergebnis.length + 1}
      gesamt={runde.length}
      onFertig={(r) => setErgebnis([...ergebnis, r])}
      onEnde={() => setRunde(null)}
    />
  );
}

function Frage({
  karte,
  nummer,
  gesamt,
  onFertig,
  onEnde,
}: {
  karte: Flashcard;
  nummer: number;
  gesamt: number;
  onFertig: (r: Rating) => void;
  onEnde: () => void;
}) {
  const { update } = useStore();
  const [rest, setRest] = useState(MIN_PRO_FRAGE * 60);
  const [aufgedeckt, setAufgedeckt] = useState(false);
  const [aufnahme, setAufnahme] = useState<'aus' | 'laeuft' | 'fertig' | 'fehler'>('aus');
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const recorder = useRef<MediaRecorder | null>(null);
  const kannAufnehmen = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';

  useEffect(() => {
    if (aufgedeckt) return;
    const t = setInterval(() => setRest((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [aufgedeckt]);
  useEffect(() => () => recorder.current?.stream.getTracks().forEach((t) => t.stop()), []);
  useEffect(() => () => (audioUrl ? URL.revokeObjectURL(audioUrl) : undefined), [audioUrl]);

  const starteAufnahme = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const teile: Blob[] = [];
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => teile.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setAudioUrl(URL.createObjectURL(new Blob(teile, { type: rec.mimeType })));
        setAufnahme('fertig');
      };
      rec.start();
      recorder.current = rec;
      setAufnahme('laeuft');
    } catch {
      setAufnahme('fehler');
    }
  };
  const stoppeAufnahme = () => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
  };
  const deckeAuf = () => {
    stoppeAufnahme();
    setAufgedeckt(true);
  };
  const bewerte = (r: Rating) => {
    update((p) => rateCard(p, karte.id, r));
    onFertig(r);
  };

  return (
    <div className="page narrow">
      <div className="session-head">
        <button type="button" className="ghost" onClick={onEnde}>
          ← Beenden
        </button>
        <span>
          Frage {nummer} / {gesamt}
        </span>
        <span className={rest === 0 ? 'error' : 'muted'} aria-label="Restzeit">
          <Icon name="timer" /> {mmss(rest)}
        </span>
      </div>
      <div className="flashcard">
        <div className="fc-meta">
          <span>
            <Icon name="mic" /> {karte.kind === 'prueferfrage' ? 'Prüferfrage' : 'Fachgespräch'}
          </span>
        </div>
        <Markdown math className="fc-question">
          {karte.question}
        </Markdown>
        {!aufgedeckt ? (
          <>
            <p className="hint">
              Antworte laut in ganzen Sätzen: erst die Kernaussage, dann Begründung und ein Beispiel aus deinem Projekt.
            </p>
            <div className="actions">
              {kannAufnehmen && aufnahme === 'aus' && (
                <button type="button" className="secondary" onClick={() => void starteAufnahme()}>
                  <Icon name="mic" /> Aufnahme starten
                </button>
              )}
              {aufnahme === 'laeuft' && (
                <button type="button" className="secondary" onClick={stoppeAufnahme}>
                  ■ Aufnahme beenden
                </button>
              )}
              <button type="button" onClick={deckeAuf}>
                Musterantwort zeigen
              </button>
            </div>
            {aufnahme === 'fehler' && <p className="muted small">Mikrofon nicht verfügbar – du kannst auch ohne Aufnahme üben.</p>}
          </>
        ) : (
          <div className="fc-answer">
            {audioUrl && (
              <p>
                Deine Aufnahme: <audio controls src={audioUrl} />
              </p>
            )}
            {karte.answer ? <Markdown math>{karte.answer}</Markdown> : <p className="muted">Keine Musterantwort im Lernblatt.</p>}
          </div>
        )}
      </div>
      {aufgedeckt && (
        <div className="rate-buttons">
          <button type="button" className="good" onClick={() => bewerte('gewusst')}>
            ✓ Sicher
          </button>
          <button type="button" className="mid" onClick={() => bewerte('unsicher')}>
            ~ Unsicher
          </button>
          <button type="button" className="low" onClick={() => bewerte('nicht')}>
            ✗ Nicht gewusst
          </button>
        </div>
      )}
    </div>
  );
}
