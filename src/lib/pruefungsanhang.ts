// Der Anhang der AP2 nachgebaut (Formelübersicht, Netzplan, Präfixe, SQL-Syntax-Auszug Stand 2024-10-07): Aufbau und Inhalt wie
// im Belegsatz der Prüfung, Beschreibungen in eigenen Worten. Nur Formeln und Syntax – keine Erklärungen, Tipps oder Fallen; die
// stehen in Deep Dive 17 (Teil 7), in der Formelsammlung und im ausführlichen SQL-Belegsatz. Angezeigt im AnhangPanel.

const L = String.raw;

export interface FormelZeile {
  name: string;
  /** Formel in LaTeX (KaTeX). */
  tex: string;
  /** Satz vor der Formel, wie im Anhang („Für aufsteigend sortierte Ausprägungen … gilt:“). */
  vorsatz?: string;
}

export interface FormelGruppe {
  titel: string;
  zeilen: FormelZeile[];
}

export const FORMEL_GRUPPEN: FormelGruppe[] = [
  {
    titel: L`Für ein Attribut $x$ mit $n$ Ausprägungen $x_i,\ i = 1, \dots, n$ gilt:`,
    zeilen: [
      { name: 'Mittelwert', tex: L`\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i` },
      {
        name: 'Median bzw. Zentralwert',
        vorsatz: L`Für aufsteigend sortierte Ausprägungen $x_i,\ i = 1, \dots, n$ gilt:`,
        tex: L`x_{median} = \begin{cases} x_{\left(\frac{n+1}{2}\right)} & n \text{ ungerade} \\ \frac{1}{2}\left(x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}\right) & n \text{ gerade} \end{cases}`,
      },
      { name: 'Empirische Varianz', tex: L`s^2 = \frac{1}{n-1} \sum_{i=1}^{n} (x_i - \bar{x})^2` },
      { name: 'Standardabweichung', tex: L`s = \sqrt{s^2}` },
    ],
  },
  {
    titel: L`Für metrisch skalierte Merkmale $(X, Y)$ mit den Beobachtungen $(x_i, y_i)$ der $i$-ten Untersuchungseinheit, $i = 1, \dots, n$, gilt:`,
    zeilen: [
      { name: 'Kovarianz', tex: L`s_{xy} = \frac{1}{n-1} \sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})` },
      { name: 'Pearson-Korrelationskoeffizient', tex: L`r_{xy} = \frac{s_{xy}}{s_x s_y}` },
    ],
  },
  {
    titel: L`Für Zufallsvariablen $X, Y$ mit den Werten $x_i$ und den Wahrscheinlichkeiten $p_i$ gilt:`,
    zeilen: [
      { name: 'Erwartungswert', tex: L`E(X) = \sum_{i=1}^{n} x_i \, p_i` },
      { name: 'Varianz', tex: L`Var(X) = E\big(X - E(X)\big)^2` },
      { name: 'Kovarianz', tex: L`COV(X, Y) = E\big[(X - E(X))(Y - E(Y))\big]` },
    ],
  },
  {
    titel: 'Lineare Regression',
    zeilen: [
      { name: 'Regressionsgerade', tex: L`\hat{y} = \beta_0 + \beta_1 x` },
      { name: 'Modell', tex: L`y = \beta_0 + \beta_1 x + \epsilon` },
      { name: 'Kleinste Quadrate', tex: L`RSS = \sum_{i=1}^{n} (y_i - \hat{y}_i)^2 \rightarrow \min` },
    ],
  },
  {
    titel: 'Entscheidungsbaum (ID3)',
    zeilen: [
      { name: 'Entropie', tex: L`Info(A) = \sum_{i} -p(a_i) \log_2 p(a_i)` },
      { name: 'Entropie nach Aufteilung', tex: L`Info(A, a_i) = \sum_{i} \frac{|a_i|}{|A|} \, Info(a_i)` },
      { name: 'Informationsgewinn', tex: L`Gewinn(A) = Info(A) - Info(A, a_i)` },
    ],
  },
  {
    titel: 'k-Nearest-Neighbor',
    zeilen: [{ name: 'Euklidischer Abstand', tex: L`dist_E(v, w) = \sqrt{\sum_{i=1}^{n} (v_i - w_i)^2}` }],
  },
  {
    titel: 'Konfusionsmatrix',
    zeilen: [
      { name: 'Accuracy', tex: L`\frac{TP + TN}{TP + TN + FP + FN}` },
      { name: 'Precision', tex: L`\frac{TP}{TP + FP}` },
      { name: 'Recall / Sensitivity', tex: L`\frac{TP}{TP + FN}` },
      { name: 'Specificity', tex: L`\frac{TN}{TN + FP}` },
    ],
  },
];

/** Netzplan: Abkürzungen im Knoten und die Puffer-Formeln. */
export const NETZPLAN_LEGENDE: [string, string][] = [
  ['Vorgang', 'Vorgangs-ID (A, B, C …)'],
  ['Dauer', 'Dauer in Arbeitstagen'],
  ['FAZ', 'Frühester Anfangszeitpunkt'],
  ['FEZ', 'Frühester Endzeitpunkt'],
  ['SAZ', 'Spätester Anfangszeitpunkt'],
  ['SEZ', 'Spätester Endzeitpunkt'],
  ['GP', 'Gesamtpuffer, GP = SAZ − FAZ oder GP = SEZ − FEZ'],
  ['FP', 'Freier Puffer, FP = FAZ des Nachfolgers − FEZ des Vorgangs'],
];

/** Präfixe: Datenmengen binär (IEC), physikalische Größen dezimal (SI). */
export const PRAEFIXE: { binaer: string; wert: string; dezimal: string; dezimalWert: string }[] = [
  { binaer: 'Kibi (Ki)', wert: '2^{10}', dezimal: 'Kilo (k)', dezimalWert: '10^{3}' },
  { binaer: 'Mebi (Mi)', wert: '2^{20}', dezimal: 'Mega (M)', dezimalWert: '10^{6}' },
  { binaer: 'Gibi (Gi)', wert: '2^{30}', dezimal: 'Giga (G)', dezimalWert: '10^{9}' },
  { binaer: 'Tebi (Ti)', wert: '2^{40}', dezimal: 'Tera (T)', dezimalWert: '10^{12}' },
  { binaer: 'Pebi (Pi)', wert: '2^{50}', dezimal: 'Peta (P)', dezimalWert: '10^{15}' },
  { binaer: 'Exbi (Ei)', wert: '2^{60}', dezimal: 'Exa (E)', dezimalWert: '10^{18}' },
  { binaer: 'Zebi (Zi)', wert: '2^{70}', dezimal: 'Zetta (Z)', dezimalWert: '10^{21}' },
  { binaer: 'Yobi (Yi)', wert: '2^{80}', dezimal: 'Yotta (Y)', dezimalWert: '10^{24}' },
];

export interface SqlZeile {
  /** Syntax, mehrzeilig mit `\n`; Schlüsselwörter in Großbuchstaben werden fett gesetzt. */
  syntax: string;
  beschreibung: string;
}

export interface SqlGruppe {
  titel: string;
  zeilen: SqlZeile[];
}

export const SQL_STAND = '2024-10-07';

export const SQL_GRUPPEN: SqlGruppe[] = [
  {
    titel: 'Tabelle',
    zeilen: [
      {
        syntax: 'CREATE TABLE Tabellenname(\n    Spaltenname DATENTYP,\n    […]\n    Primärschlüssel,\n    Fremdschlüssel)',
        beschreibung: 'Legt eine neue, leere Tabelle mit der angegebenen Struktur an',
      },
      {
        syntax:
          'ALTER TABLE Tabellenname\n  ADD COLUMN Spaltenname DATENTYP\n  DROP COLUMN Spaltenname DATENTYP\n  MODIFY COLUMN Spaltenname DATENTYP\n  ADD Fremdschlüssel',
        beschreibung: 'Ändert eine Tabelle: Spalte hinzufügen, Spalte entfernen, Spalte ändern, Fremdschlüssel hinzufügen',
      },
      { syntax: 'DROP TABLE Tabellenname', beschreibung: 'Löscht eine Tabelle' },
    ],
  },
  {
    titel: 'Schlüssel',
    zeilen: [
      { syntax: 'PRIMARY KEY (Spaltenname)', beschreibung: 'Legt den Primärschlüssel an' },
      {
        syntax: 'FOREIGN KEY (Spaltenname)\n  REFERENCES Tabellenname(\n    Primärschlüsselspaltenname)',
        beschreibung: 'Legt eine Fremdschlüssel-Beziehung an',
      },
    ],
  },
  {
    titel: 'Datentypen',
    zeilen: [
      { syntax: 'CHARACTER', beschreibung: 'Text' },
      { syntax: 'CHAR(anzahl)', beschreibung: 'Zeichenkette mit anzahl Zeichen' },
      { syntax: 'VARCHAR(anzahl)', beschreibung: 'Zeichenkette mit höchstens anzahl Zeichen' },
      { syntax: 'DECIMAL', beschreibung: 'Zahl (Festkomma)' },
      { syntax: 'DOUBLE', beschreibung: 'Zahl (Gleitkomma)' },
      { syntax: 'INTEGER', beschreibung: 'Ganze Zahl' },
      { syntax: 'DATE', beschreibung: 'Datum (Format DD.MM.YYYY)' },
    ],
  },
  {
    titel: 'Befehle, Klauseln, Attribute',
    zeilen: [
      {
        syntax: 'SELECT * | Spaltenname1 [, Spaltenname2] …',
        beschreibung: 'Wählt die auszugebenden Spalten: alle (*) oder die genannten',
      },
      { syntax: 'FROM', beschreibung: 'Tabelle oder Tabellen, aus denen die Daten stammen' },
      {
        syntax: 'SELECT …\nFROM …\n  (SELECT …\n   FROM …\n   WHERE …) AS tbl\nWHERE …',
        beschreibung: 'Unterabfrage (subquery) in einer äußeren Abfrage; ihr Ergebnis wird wie eine Tabelle (hier „tbl“) behandelt',
      },
      { syntax: 'SELECT DISTINCT', beschreibung: 'Entfernt doppelte Zeilen aus dem Ergebnis' },
      { syntax: 'JOIN / INNER JOIN … ON …', beschreibung: 'Nur die Datensätze beider Tabellen mit übereinstimmenden Werten' },
      {
        syntax: 'LEFT JOIN / LEFT OUTER JOIN … ON …',
        beschreibung: 'Alle Datensätze der ersten (linken) Tabelle, aus der zweiten nur die übereinstimmenden',
      },
      {
        syntax: 'RIGHT JOIN / RIGHT OUTER JOIN … ON …',
        beschreibung: 'Alle Datensätze der zweiten (rechten) Tabelle, aus der ersten nur die übereinstimmenden',
      },
      { syntax: 'WHERE', beschreibung: 'Bedingung, nach der Datensätze ausgewählt werden' },
      {
        syntax: 'WHERE EXISTS ( subquery )\nWHERE NOT EXISTS ( subquery )',
        beschreibung: 'Wahr, wenn die Unterabfrage mindestens eine Zeile liefert; NOT kehrt das um',
      },
      {
        syntax: 'WHERE … IN ( subquery )\nWHERE … NOT IN ( subquery )',
        beschreibung: 'Wert ist in der Ergebnismenge enthalten bzw. nicht enthalten',
      },
      { syntax: 'GROUP BY Spaltenname1 [, Spaltenname2] …', beschreibung: 'Gruppiert (aggregiert) nach den genannten Spalten' },
      { syntax: 'HAVING Bedingung', beschreibung: 'Zeigt nur die Gruppen, die die Bedingung erfüllen' },
      {
        syntax: 'ORDER BY Spaltenname1 [, Spaltenname2] …\nASC | DESC',
        beschreibung: 'Sortiert nach den genannten Spalten, je Kriterium ASC aufsteigend oder DESC absteigend',
      },
    ],
  },
  {
    titel: 'Datenmanipulation',
    zeilen: [
      { syntax: 'DELETE FROM Tabellenname', beschreibung: 'Löscht Datensätze der Tabelle' },
      { syntax: 'UPDATE Tabellenname SET', beschreibung: 'Ändert Werte in Feldern der Tabelle' },
      {
        syntax:
          'INSERT INTO Tabellenname[(spalte1, spalte2, …)]\n  VALUES (Wert für Spalte 1 [, Wert für Spalte 2, …])\noder\n  SELECT … FROM … WHERE',
        beschreibung: 'Fügt Datensätze ein: mit festen Werten oder als Ergebnis eines SELECT',
      },
    ],
  },
  {
    titel: 'Berechtigungen kontrollieren',
    zeilen: [
      {
        syntax: "CREATE USER Benutzer | Rolle IDENTIFIED BY\n  'Passwort'",
        beschreibung: 'Legt einen Benutzer oder eine Rolle mit Passwort an',
      },
      {
        syntax: 'GRANT Recht | Rolle ON *.* | Datenbank.* |\n  Datenbank.Objekt\nTO Benutzer | Rolle [WITH GRANT OPTION]',
        beschreibung: 'Gibt einem Benutzer oder einer Rolle ein Recht auf ein Datenbankobjekt; gibt einem Benutzer eine Rolle',
      },
      {
        syntax: 'REVOKE Rechte | Rollen ON *.* | Datenbank.* |\n  Datenbank.Objekt\nFROM Benutzer | Rolle',
        beschreibung: 'Entzieht einem Benutzer oder einer Rolle ein Recht auf ein Datenbankobjekt; entzieht einem Benutzer eine Rolle',
      },
    ],
  },
  {
    titel: 'Aggregatfunktionen',
    zeilen: [
      { syntax: 'AVG(Spaltenname | Ausdruck)', beschreibung: 'Arithmetisches Mittel der Werte' },
      {
        syntax: 'COUNT(Spaltenname | * )',
        beschreibung: 'Anzahl der Datensätze mit Wert (nicht NULL) in der Spalte, mit * alle Datensätze der Tabelle',
      },
      { syntax: 'SUM(Spaltenname | Ausdruck)', beschreibung: 'Summe der Werte bzw. Ausdrücke' },
      { syntax: 'MIN(Spaltenname | Ausdruck)', beschreibung: 'Kleinster Wert' },
      { syntax: 'MAX(Spaltenname | Ausdruck)', beschreibung: 'Größter Wert' },
      { syntax: 'STDDEV(Spaltenname)', beschreibung: 'Standardabweichung vom arithmetischen Mittel' },
      { syntax: 'VARIANCE(Spaltenname)', beschreibung: 'Varianz' },
      {
        syntax: 'CORR(Spaltenname_1, Spaltenname_2)',
        beschreibung: 'Korrelation zweier Merkmale (1 = vollständig korreliert, 0 = kein Zusammenhang)',
      },
    ],
  },
  {
    titel: 'Funktionen',
    zeilen: [
      { syntax: 'LEFT(Zeichenkette, Anzahlzeichen)', beschreibung: 'Anzahlzeichen Zeichen von links' },
      { syntax: 'RIGHT(Zeichenkette, Anzahlzeichen)', beschreibung: 'Anzahlzeichen Zeichen von rechts' },
      { syntax: 'NOW()', beschreibung: 'Aktuelles Datum mit Uhrzeit' },
      { syntax: 'YEAR(DatumZeit)', beschreibung: 'Jahr als Zahl' },
      { syntax: 'MONTH(DatumZeit)', beschreibung: 'Monat als Zahl' },
      { syntax: 'WEEKDAY(DatumZeit)', beschreibung: 'Wochentag als Zahl (Montag = 0)' },
      { syntax: 'DAY(DatumZeit)', beschreibung: 'Tag des Monats als Zahl' },
      { syntax: 'HOUR(DatumZeit)', beschreibung: 'Stunde als Zahl' },
      { syntax: 'MINUTE(DatumZeit)', beschreibung: 'Minute als Zahl' },
      { syntax: 'DATEADD(Datumsteil, Intervall, Datum)', beschreibung: 'Addiert ein Intervall in der Einheit Datumsteil zum Datum' },
      {
        syntax: 'DATEDIFF(Datumsteil, Anfangsdatum, Enddatum)',
        beschreibung: 'Enddatum − Anfangsdatum in der Einheit Datumsteil',
      },
    ],
  },
  {
    titel: 'Datumsteil',
    zeilen: [{ syntax: 'DAY, MONTH, YEAR, HOUR, MINUTE', beschreibung: 'Mögliche Datumsteile' }],
  },
  {
    titel: 'Operatoren',
    zeilen: [
      { syntax: 'UNION', beschreibung: 'Vereinigt Abfrageergebnisse zu einem Ergebnis' },
      { syntax: 'AND', beschreibung: 'Logisches UND' },
      { syntax: 'OR', beschreibung: 'Logisches ODER' },
      { syntax: 'NOT', beschreibung: 'Logische Negation' },
      { syntax: 'IS NULL', beschreibung: 'Prüft auf NULL' },
      { syntax: 'LIKE', beschreibung: 'Vergleicht Zeichenketten mit Platzhaltern ( %, _ )' },
      { syntax: '=', beschreibung: 'Gleich' },
      { syntax: '>, >=, <, <=, < >', beschreibung: 'Ungleich (größer, kleiner, verschieden)' },
      { syntax: '*', beschreibung: 'Multiplikation' },
      { syntax: '/', beschreibung: 'Division' },
      { syntax: '+', beschreibung: 'Addition, positives Vorzeichen' },
      { syntax: '-', beschreibung: 'Subtraktion, negatives Vorzeichen' },
    ],
  },
];
