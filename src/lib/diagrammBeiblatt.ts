// Das Beiblatt „Diagrammelemente“: In der AP2 liegt bei Aufgaben mit Diagrammen ein Blatt bei, auf dem beschrieben ist, wie die verwendeten Elemente
// dargestellt werden und was sie bedeuten. Hier steht es als Daten, die der Anhang (components/Belegsatz.tsx, AnhangPanel) anzeigt. Die
// Beschreibungen sind in eigenen Worten geschrieben; die Symbole selbst kommen aus der Zeichnung der App (components/DiagrammSvg.tsx),
// damit Blatt, Editor und Übung dieselben Formen zeigen.

import type { DiagrammTyp, Form, KantenForm } from '../../domain/diagrammUebungen';

/** Notationen mit einem Beiblatt: die fünf Editor-Notationen und die UML-Diagramme der Diagramm-Übungen. */
export const BEIBLATT_ARTEN = ['erm', 'epk', 'bpmn', 'usecase', 'aktivitaet', 'sequenz', 'zustand', 'klasse'] as const;
export type BeiblattArt = (typeof BEIBLATT_ARTEN)[number];

export interface BeiblattElement {
  /** Die Form, wie sie in der Zeichnung aussieht; der Name kommt aus `formName`. */
  form: Form | KantenForm;
  /** Was das Element bedeutet und wann man es benutzt. */
  beschreibung: string;
  /** Name auf dem Blatt, wenn er von `formName` abweicht (z. B. heißt „info“ in der BPMN „Datenobjekt“, „text“ überall „Notiz“). */
  name?: string;
}

/** Linienart eines Verbindungstyps: durchgezogen, gestrichelt oder gepunktet; dazu die Pfeilspitze am Ende. */
export interface BeiblattKante {
  name: string;
  linie: 'voll' | 'gestrichelt' | 'gepunktet';
  pfeil: 'keiner' | 'offen' | 'gefuellt';
  beschreibung: string;
  /** Die Art in den Editoren (diagrammEditor.ts, EditorKantenArt), falls es sie dort gibt – für den Vollständigkeitstest. */
  editorArt?: 'fluss' | 'nachricht' | 'zuordnung' | 'linie' | 'include' | 'extend';
}

export interface BeiblattEintrag {
  titel: string;
  elemente: BeiblattElement[];
  kanten: BeiblattKante[];
  /** Eine Regel oder ein Hinweis zur Notation, der in der Prüfung oft gefragt wird. */
  hinweis?: string;
}

export const BEIBLATT: Record<BeiblattArt, BeiblattEintrag> = {
  erm: {
    titel: 'ER-Diagramm',
    elemente: [
      {
        form: 'entitaet',
        beschreibung:
          'Gegenstand oder Begriff, über den Daten gespeichert werden (z. B. Kunde, Bestellung). Im Relationenmodell wird daraus in der Regel eine Tabelle.',
      },
      {
        form: 'beziehung',
        beschreibung:
          'Zusammenhang zwischen Entitäten (z. B. „bestellt“). Sie wird an den Verbindungen mit den Kardinalitäten beschriftet.',
      },
      {
        form: 'attribut',
        beschreibung: 'Eigenschaft einer Entität oder einer Beziehung. Der Name des Primärschlüssels wird unterstrichen.',
      },
      { form: 'text', name: 'Notiz', beschreibung: 'Notiz zur Erläuterung; sie gehört nicht zum Modell.' },
    ],
    kanten: [
      {
        name: 'Linie',
        linie: 'voll',
        pfeil: 'keiner',
        editorArt: 'linie',
        beschreibung:
          'Verbindet Entität, Beziehung und Attribute. An der Verbindung zur Entität steht die Kardinalität (min, max), z. B. (0,1), (1,1), (0,n) oder (1,n): wie wenige und wie viele Beziehungen eine Entität höchstens eingehen kann.',
      },
    ],
  },
  epk: {
    titel: 'Ereignisgesteuerte Prozesskette (EPK, eEPK)',
    elemente: [
      {
        form: 'ereignis',
        beschreibung:
          'Zustand, der eingetreten ist und einen Schritt auslöst oder sein Ergebnis beschreibt. Eine EPK beginnt und endet mit einem Ereignis.',
      },
      {
        form: 'funktion',
        beschreibung: 'Tätigkeit, die im Prozess ausgeführt wird. Auf ein Ereignis folgt eine Funktion, auf eine Funktion ein Ereignis.',
      },
      {
        form: 'xor',
        beschreibung:
          'Exklusives Oder: Genau einer der Wege wird durchlaufen (Verzweigung) bzw. es kommt genau einer an (Zusammenführung).',
      },
      {
        form: 'and',
        beschreibung:
          'Und: Alle Wege werden gleichzeitig durchlaufen (Parallelisierung); beim Zusammenführen wird gewartet, bis alle angekommen sind.',
      },
      { form: 'or', beschreibung: 'Oder: Mindestens ein Weg wird durchlaufen; es können auch mehrere gleichzeitig sein.' },
      { form: 'org', beschreibung: 'Nur in der eEPK: Stelle oder Abteilung, die eine Funktion ausführt oder dafür verantwortlich ist.' },
      { form: 'info', beschreibung: 'Nur in der eEPK: Daten oder Dokument, die eine Funktion braucht oder erzeugt.' },
    ],
    kanten: [
      {
        name: 'Kontrollfluss',
        linie: 'voll',
        pfeil: 'gefuellt',
        editorArt: 'fluss',
        beschreibung: 'Legt die Reihenfolge von Ereignissen, Funktionen und Konnektoren fest.',
      },
      {
        name: 'Zuordnung',
        linie: 'voll',
        pfeil: 'keiner',
        editorArt: 'zuordnung',
        beschreibung:
          'Nur in der eEPK: hängt eine Organisationseinheit oder ein Informationsobjekt an eine Funktion. Sie legt keine Reihenfolge fest.',
      },
    ],
    hinweis: 'Nach einem Ereignis darf kein XOR- oder OR-Konnektor verzweigen: Ein Ereignis entscheidet nicht, das tut eine Funktion.',
  },
  bpmn: {
    titel: 'BPMN 2.0',
    elemente: [
      {
        form: 'pool',
        beschreibung:
          'Teilnehmer am Prozess, z. B. ein Unternehmen. Der Pool umschließt den Ablauf dieses Teilnehmers; mehrere Pools tauschen Nachrichten aus.',
      },
      {
        form: 'lane',
        beschreibung: 'Unterteilung eines Pools nach Rollen oder Abteilungen. Jede Aufgabe liegt in der Lane des Verantwortlichen.',
      },
      { form: 'start', beschreibung: 'Startereignis: Hier beginnt der Prozess.' },
      { form: 'zwischen', beschreibung: 'Zwischenereignis: Ein Ereignis, das während des Ablaufs eintritt oder ausgelöst wird.' },
      { form: 'ende', beschreibung: 'Endereignis: Hier endet der Prozess.' },
      { form: 'task', beschreibung: 'Aufgabe: ein Arbeitsschritt, der nicht weiter zerlegt wird.' },
      {
        form: 'gw-xor',
        beschreibung: 'Exklusives Gateway: Genau einer der ausgehenden Wege wird gewählt; beim Zusammenführen genügt ein ankommender Weg.',
      },
      {
        form: 'gw-and',
        beschreibung:
          'Paralleles Gateway: Alle ausgehenden Wege werden gleichzeitig durchlaufen; beim Zusammenführen wird auf alle gewartet.',
      },
      { form: 'gw-or', beschreibung: 'Inklusives Gateway: Ein oder mehrere ausgehende Wege werden gewählt.' },
      { form: 'info', name: 'Datenobjekt', beschreibung: 'Datenobjekt: Dokument oder Daten, die eine Aufgabe benutzt oder erzeugt.' },
      { form: 'text', name: 'Notiz', beschreibung: 'Notiz zur Erläuterung; sie gehört nicht zum Ablauf.' },
    ],
    kanten: [
      {
        name: 'Sequenzfluss',
        linie: 'voll',
        pfeil: 'gefuellt',
        editorArt: 'fluss',
        beschreibung: 'Reihenfolge der Elemente innerhalb eines Pools.',
      },
      {
        name: 'Nachrichtenfluss',
        linie: 'gestrichelt',
        pfeil: 'offen',
        editorArt: 'nachricht',
        beschreibung: 'Austausch zwischen zwei Pools. Innerhalb eines Pools gibt es keinen Nachrichtenfluss.',
      },
      {
        name: 'Assoziation',
        linie: 'gepunktet',
        pfeil: 'keiner',
        editorArt: 'zuordnung',
        beschreibung: 'Verbindet ein Datenobjekt oder eine Notiz mit einem Element.',
      },
    ],
  },
  usecase: {
    titel: 'Anwendungsfalldiagramm (UML)',
    elemente: [
      { form: 'systemgrenze', beschreibung: 'Rahmen um das System. Alle Anwendungsfälle liegen darin, die Akteure außerhalb.' },
      {
        form: 'akteur',
        beschreibung:
          'Rolle einer Person oder eines anderen Systems, die mit dem System arbeitet. Gezeichnet wird die Rolle, nicht die einzelne Person.',
      },
      {
        form: 'anwendungsfall',
        beschreibung:
          'Leistung des Systems, die für einen Akteur einen Nutzen bringt. Der Name besteht aus Verb und Objekt (z. B. „Bestellung erfassen“).',
      },
      { form: 'text', name: 'Notiz', beschreibung: 'Notiz zur Erläuterung; sie gehört nicht zum Modell.' },
    ],
    kanten: [
      {
        name: 'Assoziation',
        linie: 'voll',
        pfeil: 'keiner',
        editorArt: 'linie',
        beschreibung: 'Verbindet einen Akteur mit den Anwendungsfällen, an denen er beteiligt ist.',
      },
      {
        name: '«include»',
        linie: 'gestrichelt',
        pfeil: 'offen',
        editorArt: 'include',
        beschreibung: 'Pfeil vom Basisfall zum eingebundenen Fall: Der eingebundene Fall wird immer mit ausgeführt.',
      },
      {
        name: '«extend»',
        linie: 'gestrichelt',
        pfeil: 'offen',
        editorArt: 'extend',
        beschreibung: 'Pfeil vom erweiternden Fall zum Basisfall: Der erweiternde Fall kommt nur unter einer Bedingung dazu.',
      },
    ],
  },
  aktivitaet: {
    titel: 'Aktivitätsdiagramm (UML)',
    elemente: [
      {
        form: 'schwimmbahn',
        beschreibung: 'Verantwortungsbereich (Spalte): Alle Aktionen darin gehören zu einer Rolle, Abteilung oder einem System.',
      },
      { form: 'startpunkt', beschreibung: 'Startknoten: Hier beginnt die Aktivität.' },
      { form: 'aktion', beschreibung: 'Ein einzelner Arbeitsschritt.' },
      {
        form: 'entscheidung',
        beschreibung:
          'Verzweigt den Ablauf. An den ausgehenden Kanten stehen Bedingungen in eckigen Klammern, z. B. [Betrag > 100]. Dieselbe Raute führt als Merge Wege wieder zusammen.',
      },
      { form: 'gabel', beschreibung: 'Teilt den Ablauf in parallele Wege oder führt sie wieder zusammen (dann wird auf alle gewartet).' },
      { form: 'aufruf', beschreibung: 'Ruft eine andere Aktivität auf, die in einem eigenen Diagramm beschrieben ist.' },
      { form: 'endpunkt', beschreibung: 'Endknoten: beendet die gesamte Aktivität, auch alle noch laufenden Wege.' },
      { form: 'ablaufende', beschreibung: 'Ablaufende: beendet nur den eigenen Weg; andere Wege laufen weiter.' },
      { form: 'text', name: 'Notiz', beschreibung: 'Notiz zur Erläuterung; sie gehört nicht zum Ablauf.' },
    ],
    kanten: [{ name: 'Kontrollfluss', linie: 'voll', pfeil: 'gefuellt', editorArt: 'fluss', beschreibung: 'Reihenfolge der Aktionen.' }],
  },
  sequenz: {
    titel: 'Sequenzdiagramm (UML)',
    elemente: [
      {
        form: 'lebenslinie',
        beschreibung: 'Ein Teilnehmer (Objekt oder Rolle) mit einer senkrechten Linie. Die Zeit läuft von oben nach unten.',
      },
      {
        form: 'fragment',
        beschreibung: 'Rahmen mit Kürzel (z. B. alt, opt, loop): kennzeichnet Alternativen, Optionen oder Wiederholungen im Ablauf.',
      },
    ],
    kanten: [
      {
        name: 'Synchrone Nachricht',
        linie: 'voll',
        pfeil: 'gefuellt',
        beschreibung: 'Der Sender wartet, bis der Empfänger geantwortet hat.',
      },
      {
        name: 'Asynchrone Nachricht',
        linie: 'voll',
        pfeil: 'offen',
        beschreibung: 'Der Sender arbeitet weiter, ohne auf eine Antwort zu warten.',
      },
      { name: 'Antwortnachricht', linie: 'gestrichelt', pfeil: 'offen', beschreibung: 'Rückgabe an den Aufrufer.' },
    ],
  },
  zustand: {
    titel: 'Zustandsdiagramm (UML)',
    elemente: [
      { form: 'startpunkt', beschreibung: 'Startzustand: von hier geht es in den ersten Zustand.' },
      {
        form: 'zustand',
        beschreibung: 'Situation, in der sich ein Objekt befindet, bis ein Ereignis es in einen anderen Zustand überführt.',
      },
      { form: 'endpunkt', beschreibung: 'Endzustand: Das Objekt ist am Ende seines Lebenszyklus.' },
    ],
    kanten: [
      {
        name: 'Transition',
        linie: 'voll',
        pfeil: 'offen',
        beschreibung:
          'Übergang von einem Zustand in einen anderen. Beschriftet wird sie mit Ereignis [Bedingung] / Aktion; jeder Teil ist optional.',
      },
    ],
  },
  klasse: {
    titel: 'Klassendiagramm (UML)',
    elemente: [
      {
        form: 'klasse',
        beschreibung: 'Rechteck mit drei Feldern: Name, Attribute und Methoden. Sichtbarkeit: + öffentlich, − privat, # geschützt.',
      },
    ],
    kanten: [],
    hinweis:
      'Beziehungen werden als Linien mit Multiplizitäten gezeichnet (z. B. 1, 0..*, 1..*). Eine Vererbung ist ein Pfeil mit leerem Dreieck, der auf die Oberklasse zeigt.',
  },
};

/** Welche Notation gehört zu welchem Typ einer Diagramm-Übung? */
export const BEIBLATT_ZU_TYP: Record<DiagrammTyp, BeiblattArt> = {
  epk: 'epk',
  bpmn: 'bpmn',
  aktivitaet: 'aktivitaet',
  sequenz: 'sequenz',
  zustand: 'zustand',
  er: 'erm',
  klasse: 'klasse',
  usecase: 'usecase',
};

/** Woran man im Aufgabentext erkennt, dass mit einer Notation gearbeitet wird. */
const ERKENNUNG: [BeiblattArt, RegExp][] = [
  ['erm', /ER-Diagramm|ER-Modell|\bERM\b|Entity-Relationship/],
  ['epk', /\be?EPK\b|Prozesskette/],
  ['bpmn', /BPMN/],
  ['usecase', /Use-Case-Diagramm|Anwendungsfalldiagramm/i],
  ['aktivitaet', /Aktivitätsdiagramm/i],
  ['sequenz', /Sequenzdiagramm/i],
  ['zustand', /Zustandsdiagramm|Zustandsautomat/i],
  ['klasse', /Klassendiagramm/i],
];

/** Notationen, die ein Text nennt (in der Reihenfolge von BEIBLATT_ARTEN, ohne Doppelte). */
export function beiblattFuerText(text: string): BeiblattArt[] {
  return ERKENNUNG.filter(([, re]) => re.test(text)).map(([art]) => art);
}

/** Mehrere Mengen zusammenführen, sortiert wie BEIBLATT_ARTEN. */
export function beiblattVereinigen(...mengen: readonly (readonly BeiblattArt[])[]): BeiblattArt[] {
  const alle = new Set(mengen.flat());
  return BEIBLATT_ARTEN.filter((a) => alle.has(a));
}
