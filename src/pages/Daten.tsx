import { useEffect, useRef, useState } from 'react';
import type { BackupInfo } from '../../shared/api';
import { mergeProgress } from '../../shared/mergeProgress';
import { emptyProgress } from '../../shared/progress';
import { resetAufgabenAntworten } from '../lib/progress';
import { useBackupDownload } from '../hooks/useBackupDownload';
import { useConfirm } from '../hooks/useConfirm';
import { api, IS_STATIC } from '../lib/api';
import { parseBackup } from '../lib/backup';
import { isStoragePersisted } from '../lib/persistentStorage';
import { formatIsoDate } from '../lib/stats';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icon';

export function Daten() {
  const { content, progress, reload, update, replaceProgress, aiEnabled, aiModel } = useStore();
  const confirm = useConfirm();
  const downloadBackup = useBackupDownload();
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  /** Was mit der gewählten Datei passiert: zusammenführen oder ersetzen. */
  const importMode = useRef<'merge' | 'replace'>('merge');
  const [backups, setBackups] = useState<BackupInfo | null>(null);
  /** Pages: Ist der Browser-Speicher dauerhaft (navigator.storage.persisted)? undefined = unbekannt. */
  const [persisted, setPersisted] = useState<boolean | undefined | null>(null);

  useEffect(() => {
    // Tagessicherungen: lokal in data/backups/, online im IndexedDB des Browsers.
    api.backups().then(setBackups, () => setBackups(null));
    if (IS_STATIC) isStoragePersisted().then(setPersisted);
  }, []);

  const tasks = Object.values(content.tasks);

  const reimport = async () => {
    await reload();
    setMsg(`Neu importiert: ${new Date().toLocaleTimeString('de-DE')}`);
  };

  const importBackup = async (file: File, mode: 'merge' | 'replace') => {
    try {
      const backup = parseBackup(await file.text());
      if (mode === 'merge') {
        const merged = mergeProgress(progress, backup);
        const added = [
          `${merged.attempts.length - progress.attempts.length} Versuche`,
          `${merged.exams.length - progress.exams.length} Klausuren`,
          `${Object.keys(merged.cards).length - Object.keys(progress.cards).length} Karteikarten`,
          `${Object.keys(merged.sql).length - Object.keys(progress.sql).length} SQL-Übungen`,
          `${Object.keys(merged.rechnen).length - Object.keys(progress.rechnen).length} Rechenübungen`,
        ].join(', ');
        const ok = await confirm({
          title: 'Sicherung zusammenführen?',
          message:
            `Die Sicherung „${file.name}“ wird mit deinem Fortschritt zusammengeführt – nichts geht verloren. ` +
            `Neu dazu: ${added}. Bei Karten, Übungen und dem Fehlerjournal gilt jeweils der neuere Stand. Deine Einstellungen bleiben.`,
          confirmLabel: 'Zusammenführen',
        });
        if (!ok) return;
        update((p) => mergeProgress(p, backup));
        setMsg(`Sicherung zusammengeführt (neu: ${added}).`);
        return;
      }
      const ok = await confirm({
        title: 'Sicherung einspielen?',
        message: `Dein aktueller Fortschritt wird komplett durch die Sicherung „${file.name}“ ersetzt (auch die Einstellungen).`,
        confirmLabel: 'Ersetzen',
        danger: true,
      });
      if (!ok) return;
      replaceProgress(backup);
      setMsg('Sicherung wiederhergestellt.');
    } catch (e) {
      setMsg(`Fehler: ${(e as Error).message}`);
    }
  };

  const pickFile = (mode: 'merge' | 'replace') => {
    importMode.current = mode;
    fileRef.current?.click();
  };

  const restoreBrowserBackup = async (date: string) => {
    try {
      const backup = parseBackup(await api.readBackup(date));
      const ok = await confirm({
        title: 'Tagessicherung wiederherstellen?',
        message: `Dein aktueller Fortschritt wird komplett durch den Stand vom ${formatIsoDate(date)} ersetzt. Lade den jetzigen Stand zur Sicherheit vorher herunter.`,
        confirmLabel: 'Wiederherstellen',
        danger: true,
      });
      if (!ok) return;
      replaceProgress(backup);
      setMsg(`Tagessicherung vom ${formatIsoDate(date)} wiederhergestellt.`);
    } catch (e) {
      setMsg(`Fehler: ${(e as Error).message}`);
    }
  };

  return (
    <div className="page">
      <h1>Daten &amp; Import</h1>
      {msg && <p className="card info">{msg}</p>}

      <section className="card">
        <h2>Importbericht</h2>
        <p>
          Stand: {new Date(content.importedAt).toLocaleString('de-DE')} · {content.topics.length} Themen ·{' '}
          {tasks.filter((t) => !t.generated).length} Aufgaben aus Lernblättern ({tasks.filter((t) => !t.generated && t.solution).length} mit
          Musterlösung) · {!IS_STATIC && <>{tasks.filter((t) => t.generated).length} KI-Aufgaben · </>}
          {content.flashcards.length} Karteikarten · {content.sqlExercises.length} SQL-Übungen · {content.rechenUebungen.length}{' '}
          Rechenübungen · {content.materials.length} Materialien
        </p>
        {IS_STATIC ? (
          <p className="hint">
            Online-Version: Die Lernblätter sind beim Veröffentlichen eingebaut. Änderungen erscheinen nach dem nächsten Push.
          </p>
        ) : (
          <>
            <button type="button" onClick={reimport}>
              <Icon name="rotate-cw" /> Lernblätter neu importieren
            </button>
            <p className="hint">Änderungen an den .md-Dateien werden auch automatisch erkannt – die Seite lädt dann neu.</p>
          </>
        )}
        {content.issues.length ? (
          <>
            <h3>Hinweise ({content.issues.length})</h3>
            <ul>
              {content.issues.map((i, n) => (
                <li key={n}>
                  <code>{i.file}</code>: {i.message}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="ok">✓ Keine Auffälligkeiten – jede Aufgabe hat eine Musterlösung.</p>
        )}
        <div className="table-wrap">
          <table className="stats">
            <thead>
              <tr>
                <th>Nr.</th>
                <th>Thema</th>
                <th>Datei</th>
                <th>Lösungen</th>
                <th>Aufgaben</th>
                <th>Punkte</th>
              </tr>
            </thead>
            <tbody>
              {content.topics.map((t) => {
                const tt = tasks.filter((x) => x.topicId === t.id && !x.generated);
                return (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td className="small">
                      <code>{t.file}</code>
                    </td>
                    <td className="small">
                      <code>{t.solutionFile ?? (tt.some((x) => x.solution) ? '(im Blatt)' : '–')}</code>
                    </td>
                    <td>
                      {tt.filter((x) => x.solution).length}/{tt.length}
                    </td>
                    <td>{t.exam?.totalPoints ?? '–'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Fortschritt</h2>
        <p>
          {IS_STATIC ? (
            <>Gespeichert in diesem Browser (localStorage) – nur auf diesem Gerät.</>
          ) : (
            <>
              Gespeichert in <code>lern-app/data/fortschritt.json</code> – nur auf diesem Rechner.
            </>
          )}{' '}
          {progress.attempts.length} Versuche, {progress.exams.length} Klausuren, {Object.keys(progress.cards).length} gelernte Karten.
        </p>
        {IS_STATIC && persisted !== null && (
          <p className="hint">
            <Icon name="hard-drive" /> Speicher dauerhaft:{' '}
            {persisted === true ? (
              <b>ja</b>
            ) : persisted === false ? (
              <>
                <b>nein</b> – der Browser darf die Daten bei Platzmangel oder nach längerer Pause löschen (Safari/iOS nach etwa 7 Tagen ohne
                Besuch). Er wird nach dem Speichern gefragt; manche Browser sagen erst ja, wenn du die Seite öfter nutzt oder als
                Lesezeichen speicherst.
              </>
            ) : (
              <>unbekannt (dein Browser kann das nicht melden).</>
            )}
          </p>
        )}
        {IS_STATIC && (
          <>
            <p className="hint">
              <Icon name="archive" /> Automatische Tagessicherung im Browser (IndexedDB): beim ersten Speichern eines Tages wird der Stand
              vom Tagesbeginn gesichert, die letzten 7 Tage bleiben. Sie liegt im selben Browser – gegen „Browserdaten löschen“ hilft nur
              eine heruntergeladene Sicherung. Umziehen aus der lokalen App oder zwischen Handy und PC: dort „Sicherung herunterladen“, hier
              „Sicherung zusammenführen“ (beide Stände bleiben) oder „einspielen“ (ersetzt).
            </p>
            {backups?.items?.length ? (
              <div className="table-wrap">
                <table className="stats">
                  <thead>
                    <tr>
                      <th>Tagessicherung</th>
                      <th>Versuche</th>
                      <th>Karten</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.items.map((b) => (
                      <tr key={b.date}>
                        <td>{formatIsoDate(b.date)}</td>
                        <td>{b.attempts}</td>
                        <td>{b.cards}</td>
                        <td>
                          <button type="button" className="secondary small" onClick={() => restoreBrowserBackup(b.date)}>
                            <Icon name="undo-2" /> Wiederherstellen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="hint">
                Noch keine Tagessicherung in diesem Browser – die erste entsteht beim ersten Speichern an einem neuen Tag.
              </p>
            )}
          </>
        )}
        {backups && !IS_STATIC && (
          <p className="hint">
            {backups.newest ? (
              <>
                <Icon name="archive" /> Automatische Tagessicherung: zuletzt vom{' '}
                {new Date(`${backups.newest}T00:00:00`).toLocaleDateString('de-DE')} ({backups.count} in <code>lern-app/data/backups/</code>
                , die letzten 14 Tage werden aufbewahrt).
              </>
            ) : (
              <>
                <Icon name="archive" /> Noch keine automatische Tagessicherung – sie entsteht beim ersten Speichern eines Tages in{' '}
                <code>lern-app/data/backups/</code>.
              </>
            )}
          </p>
        )}
        <div className="actions">
          <button type="button" className="secondary" onClick={downloadBackup}>
            <Icon name="download" /> Sicherung herunterladen
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => pickFile('merge')}
            title="Sicherung mit dem Fortschritt hier vereinen – z. B. zwischen Handy und PC"
          >
            <Icon name="shuffle" /> Sicherung zusammenführen
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => pickFile('replace')}
            title="Fortschritt komplett durch die Sicherung ersetzen"
          >
            <Icon name="upload" /> Sicherung einspielen (ersetzen)
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = ''; // dieselbe Datei später noch einmal wählbar
              if (file) importBackup(file, importMode.current);
            }}
          />
          <button
            type="button"
            className="ghost danger"
            onClick={async () => {
              const ok = await confirm({
                title: 'Aufgaben-Antworten zurücksetzen?',
                message:
                  'Alle bisherigen Antworten zu Aufgaben und Klausuren (Versuche, Fehlerjournal) löschen? Karteikarten, Übungen und Einstellungen bleiben. „Heute lernen“ schlägt dann wieder alle Aufgaben vor.',
                confirmLabel: 'Antworten löschen',
                danger: true,
              });
              if (!ok) return;
              replaceProgress(resetAufgabenAntworten(progress));
              setMsg('Aufgaben-Antworten zurückgesetzt.');
            }}
          >
            Aufgaben-Antworten zurücksetzen
          </button>
          <button
            type="button"
            className="ghost danger"
            onClick={async () => {
              const ok = await confirm({
                title: 'Fortschritt zurücksetzen?',
                message:
                  'Wirklich den GESAMTEN Lernfortschritt löschen? Deine Einstellungen bleiben erhalten. Lade vorher am besten eine Sicherung herunter.',
                confirmLabel: 'Alles löschen',
                danger: true,
              });
              if (!ok) return;
              replaceProgress({ ...emptyProgress(), settings: progress.settings });
              setMsg('Fortschritt zurückgesetzt.');
            }}
          >
            Fortschritt zurücksetzen
          </button>
        </div>
      </section>

      {!IS_STATIC && (
        <section className="card">
          <h2>KI</h2>
          <p>
            {aiEnabled ? (
              <>
                ✓ Aktiv mit Modell <code>{aiModel}</code>.
              </>
            ) : (
              'Deaktiviert – kein ANTHROPIC_API_KEY gesetzt (siehe README).'
            )}
          </p>
        </section>
      )}
    </div>
  );
}
