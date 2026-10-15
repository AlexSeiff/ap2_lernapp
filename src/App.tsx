import { lazy, type ReactNode, Suspense, useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CONFLICT_MESSAGE } from '../shared/progress';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Icon } from './components/Icon';
import { Kopfleiste } from './components/Kopfleiste';
import { HeuteLeiste } from './components/HeuteLeiste';
import { MobileNav } from './components/MobileNav';
import { UpdateHinweis } from './components/UpdateHinweis';
import { IS_STATIC } from './lib/api';
import type { NavBadge } from './lib/navigation';
import { isDue } from './lib/progress';
import { rechenSummary } from './lib/rechnen';
import { diagrammSummary, diagrammUebungen } from './lib/diagramme';
import { sqlSummary } from './lib/sql';
import { useSpeicherStand, useStore } from './lib/store';
import { imLeerlauf, ladeTexteImLeerlauf } from './lib/texte';
import { Dashboard } from './pages/Dashboard';

// Umsetzungsplan Phase 10: Nur die Übersicht (Startseite) steckt im Hauptbundle. Die übrigen Seiten, die früher mit ihm kamen, sind
// lazy – mit ihnen Markdown (react-markdown, remark-gfm). Damit der Seitenwechsel nicht erst lädt, holt useVorladen() sie im Leerlauf.
const SEITEN = {
  aufgabe: () => import('./pages/Aufgabe'),
  aufgaben: () => import('./pages/Aufgaben'),
  daten: () => import('./pages/Daten'),
  druck: () => import('./pages/Druck'),
  einstellungen: () => import('./pages/Einstellungen'),
  fehlerjournal: () => import('./pages/Fehlerjournal'),
  karteikarten: () => import('./pages/Karteikarten'),
  klausur: () => import('./pages/Klausur'),
  material: () => import('./pages/Material'),
  themen: () => import('./pages/Themen'),
};
const Aufgabe = lazy(() => SEITEN.aufgabe().then((m) => ({ default: m.Aufgabe })));
const Aufgaben = lazy(() => SEITEN.aufgaben().then((m) => ({ default: m.Aufgaben })));
const Daten = lazy(() => SEITEN.daten().then((m) => ({ default: m.Daten })));
const Druck = lazy(() => SEITEN.druck().then((m) => ({ default: m.Druck })));
const Einstellungen = lazy(() => SEITEN.einstellungen().then((m) => ({ default: m.Einstellungen })));
const Fehlerjournal = lazy(() => SEITEN.fehlerjournal().then((m) => ({ default: m.Fehlerjournal })));
const Karteikarten = lazy(() => SEITEN.karteikarten().then((m) => ({ default: m.Karteikarten })));
const Klausur = lazy(() => SEITEN.klausur().then((m) => ({ default: m.Klausur })));
const KlausurAuswahl = lazy(() => SEITEN.klausur().then((m) => ({ default: m.KlausurAuswahl })));
const Material = lazy(() => SEITEN.material().then((m) => ({ default: m.Material })));
const Themen = lazy(() => SEITEN.themen().then((m) => ({ default: m.Themen })));
const Thema = lazy(() => SEITEN.themen().then((m) => ({ default: m.Thema })));
// KI-Aufgaben nur in der lokalen App.
const Generator = lazy(() => import('./pages/Generator').then((m) => ({ default: m.Generator })));

// SQL-Seiten lazy: sql.js (WASM) und CodeMirror landen so nicht im Hauptbundle.
const SqlFrei = lazy(() => import('./pages/SqlFrei').then((m) => ({ default: m.SqlFrei })));
const SqlUebungen = lazy(() => import('./pages/SqlUebungen').then((m) => ({ default: m.SqlUebungen })));
const SqlUebung = lazy(() => import('./pages/SqlUebung').then((m) => ({ default: m.SqlUebung })));
// Rechenübungen lazy: Vorlagen, Prüfung und (beim Rechenweg) KaTeX bleiben aus dem Hauptbundle.
const RechenUebungen = lazy(() => import('./pages/RechenUebungen').then((m) => ({ default: m.RechenUebungen })));
const RechenUebung = lazy(() => import('./pages/RechenUebung').then((m) => ({ default: m.RechenUebung })));
const DiagrammUebungen = lazy(() => import('./pages/DiagrammUebungen').then((m) => ({ default: m.DiagrammUebungen })));
const DiagrammUebung = lazy(() => import('./pages/DiagrammUebung').then((m) => ({ default: m.DiagrammUebung })));
// „Heute lernen“ lazy: der Planer braucht nur diese Seite.
const Heute = lazy(() => import('./pages/Heute').then((m) => ({ default: m.Heute })));
// Operatoren-Trainer lazy: Quiz und Tabelle braucht nur diese Seite.
const Operatoren = lazy(() => import('./pages/Operatoren').then((m) => ({ default: m.Operatoren })));
// Formelsammlung lazy: zieht KaTeX nach.
const SqlBelegsatz = lazy(() => import('./pages/SqlBelegsatz').then((m) => ({ default: m.SqlBelegsatz })));
const Formelsammlung = lazy(() => import('./pages/Formelsammlung').then((m) => ({ default: m.Formelsammlung })));
// Glossar lazy: baut den Index der Begriffe erst beim Öffnen.
const Glossar = lazy(() => import('./pages/Glossar').then((m) => ({ default: m.Glossar })));
// Begriffsseiten lazy (Umsetzungsplan Phase 3): Seite und Seitentexte (begriffe.json) laden erst beim Öffnen.
const Begriff = lazy(() => import('./pages/Begriff').then((m) => ({ default: m.Begriff })));
// Globale Suche lazy: Index und Dialog laden erst beim ersten Öffnen (Strg+K oder Lupe in der Kopfleiste).
const SucheDialog = lazy(() => import('./components/SucheDialog').then((m) => ({ default: m.SucheDialog })));

/** Suche öffnen/schließen; Strg+K (Mac: ⌘K) überall in der App. Nach dem Schließen geht der Fokus zurück. */
function useSuche() {
  const [offen, setOffen] = useState(false);
  const [vorher, setVorher] = useState<HTMLElement | null>(null);
  const oeffnen = () => {
    setVorher(document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setOffen(true);
  };
  const schliessen = () => {
    setOffen(false);
    vorher?.focus();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setVorher(document.activeElement instanceof HTMLElement ? document.activeElement : null);
        setOffen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return { offen, oeffnen, schliessen };
}

/** Fällige Wiederholungen je Art (Badges in Kopfleiste, Unterleiste und Tab-Bar). */
function useNavBadges(): Record<NavBadge, number> {
  const { content, progress } = useStore();
  return {
    journal: Object.values(progress.journal).filter((j) => !j.resolvedAt && isDue(j.due)).length,
    sql: sqlSummary(
      progress,
      content.sqlExercises.map((e) => e.id),
    ).due,
    rechnen: rechenSummary(
      progress,
      content.rechenUebungen.map((u) => u.id),
    ).due,
    diagramme: diagrammSummary(
      progress,
      diagrammUebungen(content).map((u) => u.id),
    ).due,
  };
}

/**
 * Im Leerlauf vorladen (Umsetzungsplan Phase 10): Seiten, Lernblatt-Texte und Suchindex, damit Seitenwechsel, Glossar und Suche nicht
 * warten. Nur wo die Daten nichts kosten – in der lokalen App oder wenn der Service Worker sie aus seinem Cache liefert. Beim
 * allerersten Besuch nicht: Da lädt der Service Worker selbst gerade alles herunter, und jede weitere Anfrage bremst den Start
 * (auf langsamen Verbindungen sichtbar, Lighthouse misst es mit). Dann lädt jede Seite, was sie braucht, beim Öffnen.
 */
function useVorladen() {
  const { content, progress } = useStore();
  const { prueferfragen, fachgespraech } = progress.settings;
  useEffect(() => {
    if (IS_STATIC && !navigator.serviceWorker?.controller) return;
    const abbrechen = [
      // Die Seiten, die früher im Hauptbundle steckten.
      imLeerlauf(() => {
        for (const laden of Object.values(SEITEN)) void laden().catch(() => {});
      }, 3000),
      ladeTexteImLeerlauf(content),
      imLeerlauf(() => {
        void import('./lib/suchIndex').then((m) => m.bereiteSucheVor(content, { prueferfragen, fachgespraech }));
      }, 8000),
    ];
    return () => abbrechen.forEach((f) => f());
  }, [content, prueferfragen, fachgespraech]);
}

const SAVE_TEXT: Record<string, string> = {
  gespeichert: 'Gespeichert',
  speichert: 'Speichert …',
  konflikt: 'Nicht gespeichert – neu laden',
  fehler: 'Speichern fehlgeschlagen',
};

function Nav({ onSuche }: { onSuche: () => void }) {
  const { saveState } = useSpeicherStand();
  const badges = useNavBadges();
  useVorladen();
  return (
    <>
      <Kopfleiste onSuche={onSuche} badges={badges} saveText={SAVE_TEXT[saveState] ?? SAVE_TEXT.fehler} saveState={saveState} />
      <MobileNav badges={badges} />
    </>
  );
}

/** „Zum Inhalt springen“: erstes fokussierbares Element, damit Tastatur und Screenreader die Navigation überspringen können. */
function SkipLink() {
  return (
    <button type="button" className="skip-link" onClick={() => document.getElementById('inhalt')?.focus()}>
      Zum Inhalt springen
    </button>
  );
}

function SaveErrorBanner() {
  const { saveError, saveState } = useSpeicherStand();
  if (saveState === 'konflikt') {
    // Dieser Tab speichert nicht mehr, sonst würde er den Fortschritt aus dem anderen Tab überschreiben.
    return (
      <div className="card warn" role="alert">
        <p>
          <Icon name="triangle-alert" /> {CONFLICT_MESSAGE}. Änderungen in diesem Tab werden nicht mehr gespeichert.
        </p>
        <button type="button" onClick={() => window.location.reload()}>
          <Icon name="rotate-cw" /> Neu laden
        </button>
      </div>
    );
  }
  return saveError ? (
    <p className="card warn" role="alert">
      <Icon name="triangle-alert" /> {saveError}
    </p>
  ) : null;
}

/** Das Glossar lag früher unter /material/glossar – Lesezeichen und alte Links (mit ?stelle=…) führen weiter. */
function AlteGlossarAdresse() {
  const { search } = useLocation();
  return <Navigate to={`/glossar${search}`} replace />;
}

// Neuer key pro Route: nach einem Absturz reicht ein Klick in der Navigation, um weiterzulernen.
function PageErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <ErrorBoundary key={pathname}>{children}</ErrorBoundary>;
}

export function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}

function Layout() {
  const sucheSteuerung = useSuche();
  return (
    <>
      <Routes>
        <Route
          path="/druck"
          element={
            <Suspense fallback={<div className="page loading">Lädt …</div>}>
              <Druck />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <div className="layout">
              <SkipLink />
              <Nav onSuche={sucheSteuerung.oeffnen} />
              <main id="inhalt" tabIndex={-1}>
                <SaveErrorBanner />
                <HeuteLeiste />
                <PageErrorBoundary>
                  <Suspense fallback={<div className="page loading">Lädt …</div>}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/heute" element={<Heute />} />
                      <Route path="/lernen" element={<Themen />} />
                      <Route path="/lernen/:topicId" element={<Thema />} />
                      <Route path="/karteikarten" element={<Karteikarten />} />
                      <Route path="/klausur" element={<KlausurAuswahl />} />
                      <Route path="/klausur/:topicId" element={<Klausur />} />
                      <Route path="/aufgaben" element={<Aufgaben />} />
                      <Route path="/aufgabe/:taskId" element={<Aufgabe />} />
                      <Route path="/sql" element={<SqlFrei />} />
                      <Route path="/sql/uebungen" element={<SqlUebungen />} />
                      <Route path="/sql/uebung/:id" element={<SqlUebung />} />
                      <Route path="/rechnen" element={<RechenUebungen />} />
                      <Route path="/rechnen/:id" element={<RechenUebung />} />
                      <Route path="/diagramme" element={<DiagrammUebungen />} />
                      <Route path="/diagramme/:id" element={<DiagrammUebung />} />
                      <Route path="/fehlerjournal" element={<Fehlerjournal />} />
                      <Route path="/generator" element={IS_STATIC ? <Navigate to="/" replace /> : <Generator />} />
                      <Route path="/material" element={<Material />} />
                      <Route path="/material/formeln" element={<Formelsammlung />} />
                      <Route path="/material/sql-belegsatz" element={<SqlBelegsatz />} />
                      <Route path="/material/operatoren" element={<Operatoren />} />
                      <Route path="/glossar" element={<Glossar />} />
                      <Route path="/glossar/:id" element={<Begriff />} />
                      <Route path="/material/glossar" element={<AlteGlossarAdresse />} />
                      <Route path="/material/:docId" element={<Material />} />
                      <Route path="/einstellungen" element={<Einstellungen />} />
                      <Route path="/daten" element={<Daten />} />
                      <Route
                        path="*"
                        element={
                          <div className="page">
                            <h1>Seite nicht gefunden</h1>
                          </div>
                        }
                      />
                    </Routes>
                  </Suspense>
                </PageErrorBoundary>
              </main>
              {IS_STATIC && <UpdateHinweis />}
              {sucheSteuerung.offen && (
                <Suspense fallback={null}>
                  <SucheDialog onClose={sucheSteuerung.schliessen} />
                </Suspense>
              )}
            </div>
          }
        />
      </Routes>
    </>
  );
}
