// Zentrale Einstellungen der Lern-App. Nur Werte, keine Logik – wird von Client, Server und vite.config.ts importiert.

// Der Prüfungstermin ist eine persönliche Einstellung (Progress.settings.examDate), kein fester Wert.

/** Bearbeitungszeit einer Übungsklausur in Minuten. */
export const EXAM_MINUTES = 90;

/** Höchstzahl neuer Karteikarten pro Lernrunde (fällige Karten kommen immer dazu). */
export const NEW_PER_SESSION = 20;

/** Wiederholungsabstände im Fehlerjournal (Tage) je Stufe. */
export const JOURNAL_INTERVALS = [1, 3, 7];

/** Abstände für Karteikarten-Fächer 1–5 (Tage bis zur nächsten Abfrage). */
export const CARD_INTERVALS = [0, 1, 3, 7, 14, 30];

/** Wartezeit in ms, bevor Änderungen am Fortschritt gespeichert werden (sammelt schnelle Folgeänderungen). */
export const SAVE_DELAY_MS = 400;

/** Port des Dev-Servers – `Lern-App starten.cmd` öffnet http://localhost:5178. */
export const DEV_PORT = 5178;

/** „Heute lernen“ (ROADMAP 8.1): Ziel-Dauer der gemischten Tagesrunde in Minuten. */
export const HEUTE_MINUTEN = 20;

/**
 * Geschätzte Minuten je Element der Tagesrunde (grob, nur für die Planung).
 * Aufgaben: wie in der Prüfung etwa 0,9 min je Punkt (90 min / 100 P), mindestens `aufgabeMin`.
 */
export const HEUTE_ZEITEN = {
  /** Karteikarte im Modus „Aufdecken“ (lesen, Antwort formulieren, bewerten). */
  karte: 0.5,
  /** Karteikarte im Leicht-Modus (4 Antworten). */
  karteLeicht: 0.33,
  aufgabeProPunkt: 0.9,
  aufgabeMin: 3,
  sql: 5,
  rechnen: 5,
  diagramm: 5,
} as const;

/** Höchstens so viele Karten je Karten-Block der Tagesrunde (dazwischen kommen andere Themen). */
export const HEUTE_KARTEN_BLOCK = 8;

/**
 * Selbsteinschätzung (ROADMAP 8.3): Ein Versuch gilt für die Kalibrierung als „richtig“, wenn er mindestens diesen Anteil der Punkte hat
 * (0,8 = 80 % – etwa die Note 2; volle Punkte sind bei offenen Aufgaben selten).
 */
export const SICHER_RICHTIG_AB = 0.8;
