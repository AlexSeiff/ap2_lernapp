<!-- Begriffsseiten S · Stand 2026-10 -->
## Sachmangel
<!-- id: sachmangel · quellen: Karte DD14, DD14 2.5 · stand: 2026-10 -->

Die gekaufte Sache entspricht bei Übergabe nicht den vereinbarten, den üblichen oder den Montageanforderungen (§ 434 BGB) – dazu zählen auch Montagefehler, Falsch- und Zuweniglieferung.

### Erklärung
Seit 2022 prüft man drei Ebenen: subjektive Anforderungen (was vereinbart ist, z. B. Farbe, Menge, Funktion), objektive Anforderungen (was bei Sachen dieser Art üblich ist) und Montageanforderungen. Liefert der Verkäufer eine andere Sache als geschuldet, steht das einem Sachmangel gleich (§ 434 Abs. 5 BGB). Der Käufer muss zuerst **Nacherfüllung** verlangen – Nachbesserung oder Ersatzlieferung nach seiner Wahl; erst wenn sie scheitert, folgen Rücktritt oder Minderung, ggf. zusätzlich Schadensersatz (§ 437 BGB). Die Gewährleistung dauert bei neuen Sachen zwei Jahre (§ 438 BGB).

### Beispiel
Das Möbelhaus Nordholz liefert einem Privatkunden ein Sofa in Grau statt des bestellten Blau. Der Kunde verlangt Ersatzlieferung. Zeigt sich ein Defekt innerhalb eines Jahres nach Übergabe, wird beim Verbrauchsgüterkauf vermutet, dass er schon bei Übergabe vorlag (§ 477 BGB).

### Abgrenzung
Ein **Rechtsmangel** liegt vor, wenn Dritte Rechte an der Sache geltend machen können (z. B. die Ware gehört noch dem Lieferanten). Die **Garantie** ist ein freiwilliges Zusatzversprechen, meist des Herstellers – die gesetzliche Gewährleistung besteht unabhängig davon.

### Prüfungsfalle
Wer bei einem Mangel sofort Rücktritt oder Minderung wählt, verliert die Punkte – zuerst kommt die Nacherfüllung.

### Merksatz
Erst reparieren oder tauschen lassen, dann zurücktreten oder mindern.

Siehe auch: Gewährleistung · Garantie · Mangelhafte Lieferung · Werkvertrag
Mehr: Deep Dive 14, 2.5

## Salt
<!-- id: salt · quellen: Karte DD10, DD10 4.2 · stand: 2026-10 -->

Zufallswert, der für jedes Passwort einzeln erzeugt und vor dem Hashen angehängt wird, damit gleiche Passwörter unterschiedliche Hashwerte ergeben.

### Erklärung
Passwörter werden nicht verschlüsselt, sondern als Hash gespeichert. Ohne Salt hätten alle Nutzer mit dem Passwort „Sommer2026“ denselben Hash – ein Angreifer erkennt sie auf einen Blick und kann vorberechnete Tabellen (Rainbow Tables) nutzen. Der Salt ist nicht geheim; er wird neben dem Hash gespeichert und macht jeden Hash einzigartig. Zusätzlich verwendet man bewusst langsame Verfahren wie Argon2, bcrypt, scrypt oder PBKDF2, die Brute-Force-Angriffe ausbremsen.

### Beispiel
Lea und Jonas wählen im Kundenportal zufällig dasselbe Passwort. Mit den Salts „x7Qa“ und „mP2v“ entstehen zwei völlig verschiedene Hashwerte in der Datenbank.

### Abgrenzung
Ein **Pepper** ist ein zusätzlicher geheimer Wert, der für alle Passwörter gleich ist und getrennt von der Datenbank aufbewahrt wird. Der Salt ist je Passwort verschieden und darf offen gespeichert werden.

### Prüfungsfalle
Den Salt als „Schlüssel“ bezeichnen – Hashing bleibt eine Einwegfunktion, der Salt macht sie nicht umkehrbar.

### Merksatz
Gleiches Passwort, anderer Salt, anderer Hash.

Siehe auch: Hashing · Brute Force · Authentifizierung
Mehr: Deep Dive 10, 4.2

## Säulendiagramm
<!-- id: saulendiagramm · quellen: DD17 6.2 · stand: 2026-10 -->

Diagramm mit senkrechten Säulen zum Vergleich von Werten weniger Kategorien; weil die Säulenlänge den Wert codiert, beginnt die y-Achse bei 0.

### Erklärung
Säulen eignen sich für den Vergleich von Kategorien (Umsatz je Filiale) und für wenige Zeitpunkte. Die Höhe jeder Säule ist proportional zum Wert – deshalb ist ein Nullpunkt zwingend, sonst wirken kleine Unterschiede dramatisch. Kategorien sortiert man nach Wert, hebt das Wichtige mit einer Farbe hervor und beschriftet die Achse mit Einheit.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 170" width="300" height="170" role="img" aria-label="Säulendiagramm mit drei Säulen und Nullpunkt">
<line x1="40" y1="140" x2="280" y2="140" class="dg-linie"/>
<line x1="40" y1="140" x2="40" y2="15" class="dg-linie"/>
<text x="34" y="140" text-anchor="end" dominant-baseline="middle" class="dg-klein">0</text>
<rect x="65" y="44" width="50" height="96" class="dg-grau"/>
<rect x="135" y="41" width="50" height="99" class="dg-grau"/>
<rect x="205" y="38" width="50" height="102" class="dg-akzent"/>
<text x="90" y="156" text-anchor="middle" class="dg-klein">2024</text>
<text x="160" y="156" text-anchor="middle" class="dg-klein">2025</text>
<text x="230" y="156" text-anchor="middle" class="dg-klein">2026</text>
<text x="230" y="30" text-anchor="middle" class="dg-klein">5,10 Mio. €</text>
</svg>
```

### Beispiel
Umsätze des Möbelhauses: 4,80; 4,95; 5,10 Mio. €. Mit Nullpunkt sind die Säulen fast gleich hoch (+6,25 %). Beginnt die Achse bei 4,70 Mio. €, stehen die sichtbaren Höhen im Verhältnis 1 : 2,5 : 4 – das Bild lügt.

### Abgrenzung
Das **Balkendiagramm** zeigt dieselbe Information waagerecht und ist bei langen Kategorienamen oder vielen Kategorien besser. Das **Liniendiagramm** passt zu längeren Zeitreihen; bei kategorialen Daten wäre die Verbindungslinie sachlich falsch.

### Prüfungsfalle
Eine abgeschnittene y-Achse bei Säulen nicht beanstanden – das ist der Klassiker der Manipulationsaufgaben.

### Merksatz
Säulen ohne Nullpunkt lügen.

Siehe auch: Balkendiagramm · Liniendiagramm · Kreisdiagramm · Chartjunk
Mehr: Deep Dive 17, 6.2

## SAZ
<!-- id: saz · quellen: Karte DD12, DD12 3.2 · stand: 2026-10 -->

Spätester Anfangszeitpunkt eines Vorgangs im Netzplan: $\text{SAZ} = \text{SEZ} - \text{Dauer}$.

### Erklärung
Der SAZ entsteht in der **Rückwärtsrechnung** vom Projektende aus. Er gibt an, wann ein Vorgang spätestens beginnen muss, damit der Projekttermin nicht gefährdet ist. Zusammen mit dem frühesten Anfang ergibt er den Gesamtpuffer: $\text{GP} = \text{SAZ} - \text{FAZ}$.

### Beispiel
Netzplan des Reporting-Projekts: Vorgang B (Datenmodell entwerfen, 4 Tage) hat FAZ 5 und SEZ 11. Daraus folgt $\text{SAZ} = 11 - 4 = 7$ und $\text{GP} = 7 - 5 = 2$ Tage. B darf also zwei Tage später beginnen, ohne das Projektende (Tag 25) zu verschieben.

### Abgrenzung
| Wert | Rechnung | Richtung |
|---|---|---|
| FAZ | größtes FEZ der Vorgänger | vorwärts |
| FEZ | FAZ + Dauer | vorwärts |
| SEZ | kleinstes SAZ der Nachfolger | rückwärts |
| SAZ | SEZ − Dauer | rückwärts |

### Prüfungsfalle
SAZ mit FAZ + Puffer verwechseln oder in der Rückwärtsrechnung das Maximum statt des Minimums bilden.

### Merksatz
Rückwärts rechnen, Minimum nehmen, Dauer abziehen.

Siehe auch: SEZ · FAZ · Gesamtpuffer · Kritischer Pfad · Netzplan
Mehr: Deep Dive 12, 3.2

## Schadsoftware
<!-- id: schadsoftware · quellen: Karte DD10, DD10 5.2 · stand: 2026-10 -->

Sammelbegriff (Malware) für Programme, die ohne Wissen der Nutzer Schaden anrichten – vor allem Virus, Wurm, Trojaner und Ransomware.

### Erklärung
Die Arten unterscheiden sich nach der Verbreitung: Ein **Virus** hängt sich an Dateien oder Programme und braucht einen Wirt, der ausgeführt wird. Ein **Wurm** verbreitet sich selbstständig über das Netz, etwa über ungepatchte Lücken. Ein **Trojaner** tarnt sich als nützliches Programm und öffnet im Hintergrund z. B. eine Hintertür. **Ransomware** verschlüsselt Daten und erpresst Lösegeld. Schutz: Virenschutz, Patchmanagement, keine Administratorrechte im Alltag, Schulung und Offline-Backups.

### Beispiel
Eine Mitarbeiterin des Möbelhauses öffnet eine angebliche Rechnung („Rechnung_2026.pdf.exe“) – ein Trojaner, der anschließend Ransomware nachlädt.

### Abgrenzung
| Art | Verbreitung |
|---|---|
| Virus | mit befallener Datei, braucht Ausführung |
| Wurm | selbstständig über das Netz |
| Trojaner | getarnt als nützliches Programm |

### Prüfungsfalle
Virus und Wurm gleichsetzen – der Wurm braucht keine Wirtsdatei.

### Merksatz
Virus reist mit, Wurm reist allein, Trojaner reist verkleidet.

Siehe auch: Ransomware · Phishing · Patchmanagement · Social Engineering
Mehr: Deep Dive 10, 5.2

## Schätzverfahren
<!-- id: schatzverfahren · quellen: DD12 3.1 · stand: 2026-10 -->

Methoden, um Aufwand und Dauer von Arbeitspaketen vorab zu bestimmen – vor allem Analogieschätzung, Expertenschätzung und die Drei-Zeiten-Methode (PERT).

### Erklärung
Bei der **Analogieschätzung** vergleicht man mit ähnlichen abgeschlossenen Projekten, bei der **Expertenschätzung** schätzen erfahrene Personen. Die **Drei-Zeiten-Methode** kombiniert eine optimistische (o), eine wahrscheinliche (m) und eine pessimistische (p) Schätzung: $t_e = \frac{o + 4 \cdot m + p}{6}$. Die Unsicherheit zeigt $\sigma = \frac{p - o}{6}$. Agile Teams schätzen relativ in Story Points, z. B. mit Planning Poker.

### Beispiel
Arbeitspaket „Datenquellen anbinden“: o = 4, m = 7, p = 16 Tage. $t_e = \frac{4 + 28 + 16}{6} = 8$ Tage, $\sigma = \frac{16 - 4}{6} = 2$ Tage.

### Prüfungsfalle
Den einfachen Mittelwert $\frac{o + m + p}{3}$ rechnen – der wahrscheinliche Wert zählt vierfach, geteilt wird durch 6.

### Merksatz
Eins plus vier plus eins, durch sechs.

Siehe auch: Drei-Zeiten-Methode · Projektstrukturplan · Netzplan
Mehr: Deep Dive 12, 3.1

## Scheinkorrelation
<!-- id: scheinkorrelation · quellen: Karte DD4, DD4 1.3 · stand: 2026-10 -->

Hohe Korrelation zweier Merkmale ohne inhaltlichen Zusammenhang – entstanden durch Zufall, einen gemeinsamen Zeittrend oder eine Drittvariable.

### Erklärung
Ein hoher Korrelationskoeffizient beweist keine Ursache. Neben echter Kausalität (in eine der beiden Richtungen) gibt es zwei Erklärungen ohne Wirkzusammenhang: eine **Drittvariable** beeinflusst beide Merkmale, oder die Korrelation ist **zufällig** – besonders häufig bei Zeitreihen, die beide im Zeitverlauf wachsen. Wer viele Merkmalspaare prüft, findet allein durch Zufall einige hohe Werte.

### Beispiel
Eisverkauf und Sonnenbrände korrelieren stark – Ursache ist in beiden Fällen die Sonneneinstrahlung. Im Möbelhaus steigen über fünf Jahre sowohl die Zahl der Gartenmöbel-Reklamationen als auch die Zahl der Mitarbeitenden – beide wachsen mit dem Unternehmen, nicht miteinander.

### Abgrenzung
Die Drittvariable (Confounder) ist eine mögliche Ursache einer Scheinkorrelation; der Begriff Scheinkorrelation beschreibt das Ergebnis: Zusammenhang in den Zahlen, aber nicht in der Sache.

### Prüfungsfalle
Aus r = 0,9 auf „x verursacht y“ schließen. Richtig: „starker Zusammenhang; Kausalität ist damit nicht belegt“.

### Merksatz
Korrelation zeigt, dass etwas zusammen auftritt – nicht, warum.

Siehe auch: Korrelation · Kausalität · Drittvariable · Signifikanz
Mehr: Deep Dive 4, 1.3

## Schema-on-Read
<!-- id: schema-on-read · quellen: Karte DD8, DD8 5.1, DD15 4.1 · stand: 2026-10 -->

Prinzip, bei dem die Struktur der Daten erst beim Lesen bzw. Auswerten festgelegt wird – typisch für Data Lakes und schemafreie NoSQL-Datenbanken.

### Erklärung
Rohdaten aller Formate (JSON, Logs, Bilder, CSV) werden unverändert gespeichert. Erst die Auswertung interpretiert sie: Sie bestimmt, welche Felder gelesen und wie sie typisiert werden. Das ist flexibel – auch Fragen, die beim Speichern noch unbekannt waren, lassen sich beantworten. Die Datenbank prüft dann aber keine Pflichtfelder oder Datentypen; diese Prüfungen wandern in die Anwendung oder die ETL-Strecke.

### Beispiel
Das Möbelhaus legt Klickdaten des Webshops als JSON-Dateien im Data Lake ab. Ein Data Scientist liest später nur die Felder `produkt_id` und `verweildauer` aus – erst in diesem Moment entsteht die Struktur.

### Abgrenzung
**Schema-on-Write** legt die Struktur vor dem Laden fest und weist ungültige Daten ab (Data Warehouse) – verlässlich, aber unflexibel.

### Prüfungsfalle
„Schemafrei“ mit „regelfrei“ gleichsetzen – ohne Prüfungen in der Anwendung entsteht ein **Data Swamp**.

### Merksatz
Erst speichern, beim Lesen verstehen.

Siehe auch: Schema-on-Write · Data Lake · Data Warehouse · Semistrukturierte Daten
Mehr: Deep Dive 8, 5.1 · Deep Dive 15, 4.1

## Schema-on-Write
<!-- id: schema-on-write · quellen: Karte DD8, DD8 5.1 · stand: 2026-10 -->

Prinzip, bei dem die Struktur der Daten vor dem Laden festgelegt und beim Schreiben geprüft wird – typisch für das klassische Data Warehouse und relationale Datenbanken.

### Erklärung
Tabellen, Spalten, Datentypen und Constraints stehen fest, bevor Daten geladen werden. Was nicht passt, wird abgewiesen oder im ETL in eine Quarantäne ausgeleitet. Dadurch sind die Kennzahlen verlässlich und für Fachanwender verständlich. Der Preis: Neue Anforderungen oder neue Datenquellen erfordern Änderungen am Modell und an der ETL-Strecke.

### Beispiel
Die Faktentabelle `fakt_verkauf` erwartet `menge` als ganze Zahl und `zeit_id` als gültigen Fremdschlüssel. Ein Kassendatensatz mit der Menge „zwei“ wird beim Laden abgewiesen und protokolliert.

### Abgrenzung
**Schema-on-Read** (Data Lake) speichert zuerst roh und strukturiert erst bei der Auswertung – flexibel, aber ohne eingebaute Prüfung.

### Prüfungsfalle
Die Zuordnung vertauschen: Data Warehouse = Schema-on-Write, Data Lake = Schema-on-Read.

### Merksatz
Erst prüfen, dann speichern.

Siehe auch: Schema-on-Read · Data Warehouse · ETL · Data Lake
Mehr: Deep Dive 8, 5.1

## Schlüsselkandidat
<!-- id: schlusselkandidat · quellen: Karte DD2, DD2 1.2 · stand: 2026-10 -->

Minimale Attributkombination, die jede Zeile einer Tabelle eindeutig identifiziert; einer der Kandidaten wird Primärschlüssel, die übrigen sind Alternativschlüssel.

### Erklärung
„Minimal“ heißt: Kein Attribut der Kombination kann weggelassen werden, ohne dass die Eindeutigkeit verloren geht. Eine Tabelle kann mehrere Schlüsselkandidaten haben. Man wählt einen als **Primärschlüssel** (stabil, kurz, nie NULL); die anderen bleiben Alternativschlüssel und werden in SQL mit `UNIQUE` abgesichert.

### Beispiel
Tabelle `mitarbeiter` des Möbelhauses: `personal_nr` ist eindeutig, `steuer_id` ebenfalls. Beide sind Schlüsselkandidaten. `(personal_nr, name)` ist dagegen kein Schlüsselkandidat, weil `name` überflüssig ist – das ist nur ein Superschlüssel.

```sql
CREATE TABLE mitarbeiter (
  personal_nr INT PRIMARY KEY,
  steuer_id   CHAR(11) NOT NULL UNIQUE,
  name        VARCHAR(100)
);
```

### Abgrenzung
| Begriff | Bedeutung |
|---|---|
| Superschlüssel | identifiziert eindeutig, darf überflüssige Attribute enthalten |
| Schlüsselkandidat | minimaler Superschlüssel |
| Primärschlüssel | der ausgewählte Kandidat |
| Fremdschlüssel | verweist auf den Primärschlüssel einer anderen Tabelle |

### Prüfungsfalle
Eine Kombination mit überflüssigem Attribut als Schlüsselkandidat angeben – die Minimalität fehlt.

### Merksatz
Jeder Primärschlüssel ist ein Kandidat, nicht jeder Kandidat wird Primärschlüssel.

Siehe auch: Primärschlüssel · Fremdschlüssel · Surrogatschlüssel · Natürlicher Schlüssel
Mehr: Deep Dive 2, 1.2

## Schnittstelle
<!-- id: schnittstelle · quellen: Karte DD15, DD15 3.1 · stand: 2026-10 -->

Definierter Übergabepunkt, über den Systeme Daten austauschen – z. B. Dateiaustausch, direkter Datenbankzugriff, REST-API oder Nachrichten.

### Erklärung
Eine Schnittstelle legt fest, welche Daten in welchem Format, über welchen Weg und mit welcher Berechtigung übergeben werden. Die Wahl ist eine Abwägung: Dateiaustausch (CSV über SFTP) ist einfach, aber nicht aktuell; eine REST-API ist aktuell und zugriffsgesteuert, kostet aber Entwicklungs- und Betriebsaufwand; direkter Datenbankzugriff ist schnell eingerichtet, koppelt die Systeme aber eng und belastet die Quelle; Nachrichten (Message Queue) liefern Echtzeit bei komplexer Architektur.

### Beispiel
Die Filialen des Möbelhauses rufen Reparaturaufträge über `GET /reparaturauftraege?status=offen` ab, statt nachts eine CSV-Datei zu bekommen – die Daten sind damit immer aktuell.

### Abgrenzung
Im Test prüft der **Integrationstest** das Zusammenspiel über Schnittstellen. In der Prozessanalyse ist eine Schnittstelle dagegen ein Übergabepunkt zwischen Abteilungen – oft eine Quelle von Liegezeiten und Medienbrüchen.

### Prüfungsfalle
Bei der Bewertung nur die Technik nennen – Aktualität, Sicherheit (HTTPS, Authentifizierung) und Last auf dem Quellsystem gehören in die Begründung.

### Merksatz
Eine Schnittstelle ist ein Vertrag über Format, Weg und Rechte.

Siehe auch: API · REST · Integrationstest · JSON
Mehr: Deep Dive 15, 3.1

## Schriftform
<!-- id: schriftform · quellen: Karte DD14, DD13 3.1, DD14 2.3 · stand: 2026-10 -->

Gesetzliche Formvorschrift, die eine eigenhändig unterschriebene Urkunde verlangt (§ 126 BGB).

### Erklärung
Grundsätzlich sind Verträge formfrei. Wo das Gesetz Schriftform vorschreibt, muss der Aussteller die Urkunde eigenhändig unterschreiben; ein Verstoß macht das Rechtsgeschäft nichtig. Die elektronische Form mit qualifizierter elektronischer Signatur kann die Schriftform ersetzen – außer das Gesetz schließt das aus. Genau das tut § 623 BGB für **Kündigung** und **Aufhebungsvertrag** eines Arbeitsverhältnisses. Auch die **Befristung** eines Arbeitsvertrags bedarf der Schriftform (§ 14 Abs. 4 TzBfG).

### Beispiel
Herr Kaya kündigt per E-Mail und zusätzlich per WhatsApp-Foto des unterschriebenen Briefs. Beides ist unwirksam; erst der unterschriebene Brief im Original, der dem Möbelhaus zugeht, wahrt die Form.

### Abgrenzung
| Form | Anforderung | Beispiel |
|---|---|---|
| Textform | lesbare Erklärung auf dauerhaftem Datenträger, E-Mail genügt | Mieterhöhungsverlangen |
| Schriftform | eigenhändige Unterschrift | Kündigung, Befristung |
| öffentliche Beglaubigung | Notar beglaubigt die Unterschrift | Handelsregisteranmeldung |
| notarielle Beurkundung | Notar beurkundet den ganzen Inhalt | GmbH-Gesellschaftsvertrag |

### Prüfungsfalle
Schriftform und Textform verwechseln – eine E-Mail ist Textform und reicht für eine Kündigung nie.

### Merksatz
Schriftform heißt: Original mit eigener Unterschrift.

Siehe auch: Textform · Notarielle Beurkundung · Ordentliche Kündigung · Außerordentliche Kündigung
Mehr: Deep Dive 13, 3.1 · Deep Dive 14, 2.3

## Schutzbedarfsfeststellung
<!-- id: schutzbedarfsfeststellung · quellen: Karte DD10, DD10 5.1 · stand: 2026-10 -->

Schritt im IT-Grundschutz, in dem für jedes Zielobjekt und jedes Schutzziel der Schutzbedarf „normal“, „hoch“ oder „sehr hoch“ bestimmt wird – anhand der möglichen Schäden.

### Erklärung
Nach der Strukturanalyse fragt man je Geschäftsprozess, Anwendung, IT-System, Raum und Netz: Welcher Schaden entsteht, wenn Vertraulichkeit, Integrität oder Verfügbarkeit verletzt werden? Bewertet werden typische Schadensszenarien wie Gesetzesverstöße, finanzielle Folgen, Imageschaden und Beeinträchtigung der Aufgabe. Anwendungen vererben ihren Schutzbedarf an die Systeme, auf denen sie laufen (**Maximumprinzip**); Kumulations- und Verteilungseffekt können ihn erhöhen bzw. senken.

### Beispiel
Die Gehaltsabrechnung des Möbelhauses: Vertraulichkeit hoch (Personaldaten, Bußgeldrisiko), Integrität hoch, Verfügbarkeit normal (ein Tag Ausfall ist überbrückbar). Der Server, auf dem sie neben dem Kantinenplan läuft, erhält für die Vertraulichkeit ebenfalls „hoch“.

### Abgrenzung
Die **Strukturanalyse** erfasst vorher, was es gibt; die **Risikoanalyse** nach BSI-Standard 200-3 folgt nur für Objekte mit hohem oder sehr hohem Schutzbedarf.

### Prüfungsfalle
Einen einzigen Wert pro System angeben – der Schutzbedarf wird je Schutzziel getrennt festgestellt.

### Merksatz
Je Objekt, je Schutzziel: Wie schlimm wäre der Schaden?

Siehe auch: Schutzbedarfskategorien · Strukturanalyse · Maximumprinzip · IT-Grundschutz · Kumulationseffekt
Mehr: Deep Dive 10, 5.1

## Schutzbedarfskategorien
<!-- id: schutzbedarfskategorien · quellen: DD10 5.1 · stand: 2026-10 -->

Die drei Stufen des Schutzbedarfs nach BSI-Standard 200-2: normal, hoch und sehr hoch.

### Erklärung
| Kategorie | Schadensauswirkungen |
|---|---|
| normal | begrenzt und überschaubar |
| hoch | beträchtlich |
| sehr hoch | existenziell bedrohlich, katastrophal |

Jedes Unternehmen legt vorab fest, was „beträchtlich“ für es bedeutet, z. B. über Schadensgrenzen in Euro oder die Zahl betroffener Personen. Die Kategorie bestimmt das weitere Vorgehen: Für „normal“ genügen meist die Standardanforderungen der Grundschutz-Bausteine, für „hoch“ und „sehr hoch“ folgt eine Risikoanalyse.

### Beispiel
Öffentlicher Produktkatalog: Vertraulichkeit normal. Kundendaten mit Umsätzen: hoch. Ein Ausfall des Kassensystems über mehrere Tage, der den gesamten Verkauf stoppt: Verfügbarkeit sehr hoch.

### Prüfungsfalle
„Sehr hoch“ vorschnell vergeben – es setzt existenzbedrohende Folgen voraus.

### Merksatz
Normal – beträchtlich – existenziell.

Siehe auch: Schutzbedarfsfeststellung · Maximumprinzip · Schutzziele
Mehr: Deep Dive 10, 5.1

## Schutzziele
<!-- id: schutzziele · quellen: Karte DD10, DD10 4.1 · stand: 2026-10 -->

Grundziele der Informationssicherheit: Vertraulichkeit, Integrität und Verfügbarkeit (CIA-Trias), ergänzt um Authentizität und Verbindlichkeit (Nichtabstreitbarkeit).

### Erklärung
| Ziel | Bedeutung | Maßnahme |
|---|---|---|
| Vertraulichkeit | nur Berechtigte können lesen | Verschlüsselung, Berechtigungskonzept |
| Integrität | Daten sind unverändert und vollständig | Hashwerte, Signaturen, Protokollierung |
| Verfügbarkeit | Systeme sind nutzbar, wenn gebraucht | Backup, Redundanz, USV |
| Authentizität | Absender ist echt | Zertifikate, digitale Signatur |
| Verbindlichkeit | Handlungen sind nicht abstreitbar | revisionssichere Protokolle |

Die Ziele stehen teils im Zielkonflikt: Maximale Vertraulichkeit (alles verschlüsselt, kaum Rechte) senkt die Verfügbarkeit.

### Beispiel
Ein Ransomware-Angriff auf das Möbelhaus verletzt die Verfügbarkeit (Daten verschlüsselt) und – wenn Kundendaten abfließen – zusätzlich die Vertraulichkeit.

### Prüfungsfalle
Jedem Ziel eine passende Maßnahme zuordnen und dabei Backup als Schutz der Vertraulichkeit nennen – Backup sichert die Verfügbarkeit.

### Merksatz
CIA: Wer darf lesen, ist es noch richtig, ist es da?

Siehe auch: Vertraulichkeit · Integrität · Verfügbarkeit · Schutzbedarfsfeststellung
Mehr: Deep Dive 10, 4.1

## Schwachstellenanalyse
<!-- id: schwachstellenanalyse · quellen: Karte DD5, DD5 1.2, DD5 4.1 · stand: 2026-10 -->

Systematische Suche nach Ursachen von Problemen in einem Ist-Prozess – Schritt 4 der Prozessanalyse, z. B. mit Ishikawa-Diagramm, 5-Why, Pareto- oder Wertstromanalyse.

### Erklärung
Nach Ist-Aufnahme und Ist-Modellierung fragt man nicht nur „Was läuft schlecht?“, sondern „Warum?“. Typische Schwachstellen sind lange Liegezeiten an Abteilungsgrenzen, Medienbrüche, Mehrfacherfassung, unnötige Genehmigungsschleifen und hohe Nacharbeit. Methoden: Ishikawa (Ursachen nach 6M), 5-Why (bis zur Grundursache fragen), Pareto (wenige Ursachen erklären die meisten Fälle), Wertstromanalyse (Bearbeitungs- gegen Liegezeit). Das Ergebnis ist die Grundlage der Soll-Konzeption.

### Beispiel
Im Reparaturservice dauert ein Auftrag 30 Stunden, davon nur 6 Stunden Bearbeitung. Die Wertstromanalyse zeigt zwei Tage Liegezeit zwischen Serviceannahme und Werkstatt – Ursache laut 5-Why: Aufträge werden nur einmal täglich ausgedruckt und weitergegeben.

### Abgrenzung
Die **Schwachstellenanalyse** findet Ursachen im Ist; die **Soll-Konzeption** entwirft den verbesserten Prozess.

### Prüfungsfalle
Symptome („Kunden beschweren sich“) als Ursache angeben – gefragt ist die Grundursache.

### Merksatz
Erst die Ursache finden, dann den Prozess ändern.

Siehe auch: Ishikawa-Diagramm · Pareto-Analyse · Wertstromanalyse · Soll-Konzeption · Ist-Aufnahme
Mehr: Deep Dive 5, 1.2 · Deep Dive 5, 4.1

## Schwerbehinderte Menschen
<!-- id: schwerbehinderte-menschen · quellen: DD13 2.4 · stand: 2026-10 -->

Menschen mit einem Grad der Behinderung von mindestens 50; sie genießen besonderen Kündigungsschutz und Zusatzurlaub nach SGB IX.

### Erklärung
Die Kündigung eines schwerbehinderten Menschen durch den Arbeitgeber braucht die **vorherige Zustimmung des Integrationsamts** (§ 168 SGB IX; in einigen Ländern heißt die Behörde Inklusionsamt). Der Schutz greift, wenn das Arbeitsverhältnis bei Zugang der Kündigung schon länger als sechs Monate besteht (§ 173 SGB IX). Zusätzlich ist die Schwerbehindertenvertretung zu beteiligen. Schwerbehinderte erhalten **5 Arbeitstage Zusatzurlaub** im Jahr bei einer Fünf-Tage-Woche (§ 208 SGB IX). Bei der Sozialauswahl ist die Schwerbehinderung eines der vier Kriterien.

### Beispiel
Das Möbelhaus will einem schwerbehinderten Lagermitarbeiter nach acht Jahren betriebsbedingt kündigen. Ohne vorherige Zustimmung des Integrationsamts ist die Kündigung unwirksam.

### Abgrenzung
Der allgemeine Kündigungsschutz nach KSchG verlangt eine sozial gerechtfertigte Kündigung; der **besondere Kündigungsschutz** setzt zusätzlich eine behördliche Zustimmung voraus.

### Prüfungsfalle
Die Zustimmung erst nach der Kündigung einholen – sie muss vorher vorliegen.

### Merksatz
Erst das Integrationsamt, dann die Kündigung.

Siehe auch: Besonderer Kündigungsschutz · Sozialauswahl · Kündigungsschutzgesetz · Mutterschutz
Mehr: Deep Dive 13, 2.4

## Scope Creep
<!-- id: scope-creep · quellen: Karte DD12, DD12 Teil 5 · stand: 2026-10 -->

Schleichendes, unkontrolliertes Anwachsen des Projektumfangs bei unverändertem Zeit- und Kostenrahmen.

### Erklärung
Scope Creep entsteht, wenn Änderungswünsche „nebenbei“ eingebaut werden, ohne ihre Auswirkung auf Zeit, Kosten und Qualität zu bewerten. Jede einzelne Erweiterung wirkt klein, in der Summe reißen Termine und Budget – das magische Dreieck gerät aus dem Gleichgewicht. Gegenmittel: klare Abgrenzung im Pflichtenheft (auch was **nicht** dazugehört), formales Änderungsmanagement, Neues nur im Tausch gegen Bestehendes oder mit angepasstem Termin.

### Beispiel
Im Reporting-Projekt wünscht der Vertrieb „noch schnell“ eine Exportfunktion, dann eine Filialkarte, dann eine Prognose. Keiner der Wünsche wird bewertet – nach vier Wochen ist der Test nicht begonnen.

### Abgrenzung
**Änderungsmanagement** ist der geregelte Umgang mit Änderungen (bewerten, entscheiden, dokumentieren); Scope Creep ist das Problem, das entsteht, wenn er fehlt.

### Prüfungsfalle
Scope Creep mit jeder Änderung gleichsetzen – genehmigte Änderungen mit angepasstem Plan sind normal.

### Merksatz
Jede Änderung braucht einen Preis in Zeit oder Geld.

Siehe auch: Änderungsmanagement · Pflichtenheft · Magisches Dreieck · Soll-Ist-Vergleich
Mehr: Deep Dive 12, Teil 5

## Scrum
<!-- id: scrum · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Agiles Rahmenwerk für iterativ-inkrementelle Entwicklung in Sprints mit drei Verantwortlichkeiten, fünf Events und drei Artefakten (Scrum Guide 2020, weiterhin aktuelle Fassung – Stand 2026).

### Erklärung
| Bestandteil | Inhalt |
|---|---|
| Verantwortlichkeiten | Product Owner, Scrum Master, Developers |
| Events | Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint-Retrospektive |
| Artefakte (Commitment) | Product Backlog (Produktziel), Sprint Backlog (Sprint-Ziel), Inkrement (Definition of Done) |

Der Sprint dauert höchstens einen Monat; in jedem Sprint entsteht ein nutzbares Inkrement. Scrum passt, wenn Anforderungen unklar oder veränderlich sind und der Fachbereich laufend mitarbeitet.

### Beispiel
Das Reporting-Projekt des Möbelhauses läuft in Zwei-Wochen-Sprints. Nach jedem Sprint sieht der Vertrieb im Sprint Review ein lauffähiges Dashboard und priorisiert die nächsten Wünsche.

### Abgrenzung
**Wasserfall** plant alle Phasen vorab sequenziell; **Kanban** hat keine Sprints und keine festen Rollen, sondern begrenzt die gleichzeitige Arbeit (WIP-Limits).

### Prüfungsfalle
Backlog Refinement als Event nennen – es ist eine laufende Tätigkeit, kein Event.

### Merksatz
3 – 5 – 3: drei Verantwortlichkeiten, fünf Events, drei Artefakte.

Siehe auch: Sprint · Scrum Master · Product Owner · Kanban · Wasserfallmodell
Mehr: Deep Dive 12, Teil 2

## Scrum Master
<!-- id: scrum-master · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Scrum-Verantwortlichkeit, die für die Einführung und Einhaltung von Scrum und die Effektivität des Scrum Teams sorgt – als dienende Führungskraft, nicht als Vorgesetzter.

### Erklärung
Der Scrum Master coacht Team und Organisation im Umgang mit Scrum, moderiert bei Bedarf die Events und beseitigt Hindernisse (Impediments), die das Team bremsen. Er unterstützt den Product Owner, etwa bei der Pflege des Product Backlogs. Über Inhalte und Prioritäten entscheidet er nicht, Aufgaben verteilt er nicht – die Developers organisieren sich selbst.

### Beispiel
Die Developers im Reporting-Projekt warten seit Tagen auf Lesezugriff auf das Warenwirtschaftssystem. Der Scrum Master klärt das mit der IT-Leitung, damit das Team weiterarbeiten kann.

### Abgrenzung
| Verantwortlichkeit | Kernaufgabe |
|---|---|
| Product Owner | Wert des Produkts, Reihenfolge des Product Backlogs |
| Scrum Master | Scrum-Prozess, Hindernisse beseitigen |
| Developers | nutzbares Inkrement je Sprint |

### Prüfungsfalle
Den Scrum Master als Projektleiter beschreiben, der Aufgaben zuteilt.

### Merksatz
Der Scrum Master räumt den Weg frei, er gibt nicht die Richtung vor.

Siehe auch: Scrum · Product Owner · Developers · Daily Scrum
Mehr: Deep Dive 12, Teil 2

## Security by Design
<!-- id: security-by-design · quellen: Karte DD10, DD10 5.3 · stand: 2026-10 -->

Grundsatz, Sicherheit von Anfang an in Anforderungen, Architektur und Entwicklung einzubauen statt sie nachträglich zu ergänzen.

### Erklärung
Sicherheitsanforderungen werden schon im Lasten- und Pflichtenheft festgelegt, Bedrohungen im Entwurf analysiert, sichere Voreinstellungen gewählt (z. B. Least Privilege, Verschlüsselung standardmäßig an) und Sicherheit im Test geprüft. Nachträgliche Sicherheit ist teurer und lückenhafter. Rechtlich gewinnt der Grundsatz an Gewicht: Der EU Cyber Resilience Act verlangt ihn für Produkte mit digitalen Elementen; Meldepflichten gelten ab September 2026, die übrigen Pflichten ab Dezember 2027 (Stand 2026).

### Beispiel
Die neue Reparatur-API des Möbelhauses wird von Beginn an nur über HTTPS angeboten, nutzt parametrisierte Abfragen und vergibt jeder Filiale nur Leserechte auf ihre eigenen Aufträge.

### Abgrenzung
**Privacy by Design** (Art. 25 DSGVO) baut den **Datenschutz** von Anfang an ein; Security by Design die **Informationssicherheit**. Beide ergänzen sich.

### Prüfungsfalle
Security by Design mit einem Penetrationstest am Ende gleichsetzen – der Test prüft, der Grundsatz verlangt Sicherheit schon im Entwurf.

### Merksatz
Sicherheit wird eingebaut, nicht angeschraubt.

Siehe auch: Privacy by Design · Penetrationstest · Härtung · SQL-Injection
Mehr: Deep Dive 10, 5.3

## Selbstbeschreibungsfähigkeit
<!-- id: selbstbeschreibungsfahigkeit · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Interaktionsprinzip der ISO 9241-110: Nutzer wissen jederzeit, wo sie sich befinden, was das System anzeigt und welche Handlungen möglich sind.

### Erklärung
Eine selbstbeschreibungsfähige Oberfläche erklärt sich aus sich heraus: Titel, Einheiten, aktive Filter, Status und mögliche nächste Schritte sind sichtbar, ohne dass man ein Handbuch braucht. In Dashboards heißt das: aussagekräftige Diagrammtitel, Achsen mit Einheit, sichtbarer Datenstand und erkennbare Filter.

### Beispiel
Das Umsatz-Dashboard des Möbelhauses zeigt oben „Umsatz in Tsd. € – Filiale Nord – Filter: 2. Quartal 2026 – Datenstand 06.10.2026, 06:00 Uhr“.

### Abgrenzung
| Prinzip | Kernfrage |
|---|---|
| Selbstbeschreibungsfähigkeit | Weiß ich, wo ich bin und was geht? |
| Erwartungskonformität | Verhält sich das System wie gewohnt? |
| Steuerbarkeit | Bestimme ich Ablauf und Tempo? |

### Prüfungsfalle
Selbstbeschreibungsfähigkeit mit Erlernbarkeit verwechseln – Erlernbarkeit betrifft das Lernen über die Zeit, Selbstbeschreibung die Orientierung im Moment.

### Merksatz
Die Oberfläche sagt selbst, was sie zeigt.

Siehe auch: Erwartungskonformität · Steuerbarkeit · Aufgabenangemessenheit · Interaktionsprinzipien
Mehr: Deep Dive 11, A5

## Selbstverwaltung
<!-- id: selbstverwaltung · quellen: DD14 1.1 · stand: 2026-10 -->

Prinzip der Sozialversicherung: Die Träger verwalten sich selbst durch gewählte Vertreter der Versicherten und der Arbeitgeber, unter staatlicher Rechtsaufsicht.

### Erklärung
Krankenkassen, Rentenversicherung und Berufsgenossenschaften sind Körperschaften des öffentlichen Rechts. Ihre Selbstverwaltungsorgane (z. B. Verwaltungsrat, Vertreterversammlung) beschließen u. a. Satzung und Haushalt. Die Vertreter werden alle sechs Jahre in den **Sozialwahlen** bestimmt (zuletzt 2023). Der Staat setzt den gesetzlichen Rahmen und prüft nur die Rechtmäßigkeit, nicht die Zweckmäßigkeit.

### Beispiel
Der Verwaltungsrat der Krankenkasse, bei der Jonas versichert ist, beschließt deren Zusatzbeitrag für das kommende Jahr.

### Abgrenzung
Die vier Prinzipien der Sozialversicherung: **Pflichtversicherung** (kraft Gesetzes), **Solidarprinzip** (Beitrag nach Einkommen, Leistung nach Bedarf), **Umlageverfahren** (laufende Beiträge finanzieren laufende Leistungen), **Selbstverwaltung** (Organisation der Träger).

### Prüfungsfalle
Selbstverwaltung mit Solidarprinzip verwechseln – das eine betrifft die Verwaltung, das andere die Finanzierung.

### Merksatz
Versicherte und Arbeitgeber verwalten ihre Kassen selbst.

Siehe auch: Solidarprinzip · Umlageverfahren · Pflichtversicherung · Sozialversicherung
Mehr: Deep Dive 14, 1.1

## Selection Sort
<!-- id: selection-sort · quellen: Karte DD11, DD11 B7 · stand: 2026-10 -->

Sortieren durch Auswählen: Im unsortierten Rest wird jeweils das kleinste Element gesucht und an die vorderste unsortierte Position getauscht; Aufwand immer O(n²).

### Erklärung
Die Liste besteht aus einem sortierten Teil vorn und einem unsortierten Rest. In jedem Durchlauf wird der ganze Rest nach dem Minimum durchsucht – auch wenn die Liste schon sortiert ist. Daher braucht Selection Sort stets $\frac{n \cdot (n - 1)}{2}$ Vergleiche, aber höchstens n − 1 Vertauschungen. Das Verfahren ist **nicht stabil**, weil der Tausch über große Abstände gleiche Schlüssel überholen kann.

### Beispiel
Lieferzeiten 5, 3, 8, 1:
1. Minimum 1 → mit 5 tauschen: 1, 3, 8, 5
2. Minimum im Rest 3 → bleibt: 1, 3, 8, 5
3. Minimum im Rest 5 → mit 8 tauschen: 1, 3, 5, 8

Insgesamt 3 + 2 + 1 = 6 Vergleiche, 2 Vertauschungen.

### Abgrenzung
| Verfahren | bester Fall | stabil |
|---|---|---|
| Selection Sort | O(n²) | nein |
| Bubble Sort | O(n) mit Abbruch | ja |
| Insertion Sort | O(n) bei fast sortierten Daten | ja |

### Prüfungsfalle
Selection Sort einen besten Fall O(n) zuschreiben – die Minimumsuche läuft immer vollständig.

### Merksatz
Kleinstes suchen, nach vorn tauschen, Rest wiederholen.

Siehe auch: Bubble Sort · Insertion Sort · Stabiles Sortierverfahren · O-Notation
Mehr: Deep Dive 11, B7

## Semistrukturierte Daten
<!-- id: semistrukturierte-daten · quellen: Karte DD15, DD15 1.1 · stand: 2026-10 -->

Daten mit flexibler, selbstbeschreibender Struktur ohne festes Tabellenschema – z. B. JSON, XML oder Logdateien.

### Erklärung
Die Struktur steckt in den Daten selbst: Schlüssel oder Tags benennen jedes Feld, Elemente lassen sich verschachteln, und nicht jeder Datensatz muss dieselben Felder haben. Für die Analyse muss man sie parsen und oft „flachklopfen“, also verschachtelte Listen in Zeilen und Spalten überführen. Typisch sind Web-APIs (JSON), Austauschformate von Behörden und Industrie (XML) und Dokumentdatenbanken.

### Beispiel
Eine Bestellung als JSON enthält den Kunden als verschachteltes Objekt und die Positionen als Array. Für die Umsatzauswertung wird daraus eine Tabelle mit einer Zeile je Position.

### Abgrenzung
| Art | Merkmal | Beispiel |
|---|---|---|
| strukturiert | festes Schema, Tabellenform | Kundentabelle |
| semistrukturiert | selbstbeschreibend, verschachtelt | JSON, XML |
| unstrukturiert | kein vorgegebenes Schema | Freitext, Bilder |

### Prüfungsfalle
CSV als semistrukturiert einordnen – CSV ist eine flache Tabelle ohne Selbstbeschreibung der Felder je Wert, also strukturiert.

### Merksatz
Die Feldnamen reisen mit den Daten.

Siehe auch: Strukturierte Daten · Unstrukturierte Daten · JSON · XML · Schema-on-Read
Mehr: Deep Dive 15, 1.1

## Sequenz
<!-- id: sequnz · quellen: Karte DD11, DD11 B1, DD17 4.2 · stand: 2026-10 -->

Kontrollstruktur, bei der Anweisungen in fester Reihenfolge nacheinander ausgeführt werden.

### Erklärung
Jeder Algorithmus lässt sich aus drei Bausteinen bilden: Sequenz, Verzweigung (Selektion) und Wiederholung (Iteration). Die Sequenz ist der einfachste: keine Bedingung, kein Rücksprung, jede Anweisung genau einmal. Im Struktogramm erscheint sie als Rechtecke untereinander, im Programmablaufplan als Rechtecke mit Pfeilen.

### Beispiel
```
summe ← 0
anzahl ← 0
AUSGABE "Auswertung gestartet"
```
Die drei Anweisungen laufen genau einmal in dieser Reihenfolge.

### Abgrenzung
| Kontrollstruktur | Ablauf |
|---|---|
| Sequenz | nacheinander |
| Verzweigung | abhängig von einer Bedingung |
| Wiederholung | mehrfach, solange bzw. bis eine Bedingung gilt |

Nicht verwechseln mit dem **Sequenzdiagramm** (UML) und dem **Sequenzfluss** (BPMN).

### Prüfungsfalle
Initialisierungen in einer Sequenz nach der Schleife statt davor schreiben – die Reihenfolge ist die Bedeutung.

### Merksatz
Sequenz heißt: eins nach dem anderen.

Siehe auch: Verzweigung · Wiederholung · Struktogramm · Pseudocode
Mehr: Deep Dive 11, B1 · Deep Dive 17, 4.2

## Sequenzdiagramm
<!-- id: sequnzdiagramm · quellen: Karte DD15, DD15 5.4, DD17 2.5 · stand: 2026-10 -->

UML-Verhaltensdiagramm, das den zeitlichen Nachrichtenaustausch zwischen Beteiligten zeigt; die Zeit läuft von oben nach unten.

### Erklärung
Jeder Beteiligte (Akteur, Objekt oder System) steht oben und hat eine gestrichelte **Lebenslinie** nach unten. Nachrichten sind waagerechte Pfeile zwischen den Lebenslinien: synchron mit gefüllter Spitze (der Sender wartet), asynchron mit offener Spitze, Antworten gestrichelt. Schmale **Aktivierungsbalken** zeigen, wann ein Beteiligter arbeitet. Kombinierte Fragmente wie `alt`, `opt` oder `loop` bilden Alternativen, optionale Teile und Wiederholungen ab. Typischer Einsatz: API-Aufrufe und das Zusammenspiel von Systemen beschreiben.

### Beispiel
Filiale ruft `GET /reparaturauftraege/5001` auf → die API fragt die Datenbank ab → die Datenbank liefert den Datensatz → die API antwortet mit 200 und JSON.

### Abgrenzung
| Diagramm | Zeigt |
|---|---|
| Aktivitätsdiagramm | Ablauf von Tätigkeiten mit Verzweigungen |
| Sequenzdiagramm | wer wem wann welche Nachricht schickt |
| Zustandsdiagramm | Lebenszyklus eines einzelnen Objekts |

### Prüfungsfalle
Die Zeitachse waagerecht zeichnen oder Antworten als durchgezogene Pfeile darstellen.

### Merksatz
Oben die Beteiligten, nach unten die Zeit, dazwischen die Nachrichten.

Siehe auch: Lebenslinie · Synchrone Nachricht · Asynchrone Nachricht · Aktivitätsdiagramm · Zustandsdiagramm
Mehr: Deep Dive 15, 5.4 · Deep Dive 17, 2.5

## Sequenzfluss
<!-- id: sequnzfluss · quellen: Karte DD5, DD5 2.1, DD17 1.1 · stand: 2026-10 -->

Durchgezogener Pfeil in BPMN, der die Reihenfolge der Flussobjekte festlegt – nur innerhalb eines Pools erlaubt.

### Erklärung
Sequenzflüsse verbinden Ereignisse, Aktivitäten und Gateways eines Teilnehmers. Ihnen folgt beim Lesen des Modells das Token. Zwischen Lanes **desselben** Pools steht ein normaler Sequenzfluss; zwischen **verschiedenen** Pools fließen nur Nachrichten, weil verschiedene Teilnehmer keinen gemeinsamen Ablauf haben. Ein Sequenzfluss mit Querstrich am Gateway-Ausgang ist der Standardfluss.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 110" width="320" height="110" role="img" aria-label="Sequenzfluss im Pool und Nachrichtenfluss zwischen Pools">
<defs><marker id="sequnzfluss-voll" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker><marker id="sequnzfluss-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker></defs>
<rect x="10" y="10" width="300" height="50" class="dg-form"/>
<rect x="30" y="20" width="90" height="30" rx="8" class="dg-form"/>
<text x="75" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag erfassen</text>
<rect x="200" y="20" width="90" height="30" rx="8" class="dg-form"/>
<text x="245" y="35" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag prüfen</text>
<line x1="120" y1="35" x2="200" y2="35" class="dg-linie" marker-end="url(#sequnzfluss-voll)"/>
<text x="160" y="27" text-anchor="middle" class="dg-klein">Sequenzfluss</text>
<rect x="10" y="80" width="300" height="24" class="dg-grau"/>
<text x="160" y="92" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Pool Kunde</text>
<line x1="245" y1="50" x2="245" y2="80" class="dg-linie dg-strich" marker-end="url(#sequnzfluss-offen)"/>
<text x="252" y="70" class="dg-klein">Nachrichtenfluss</text>
</svg>
```

### Beispiel
Im Reparaturprozess führt ein Sequenzfluss von „Auftrag erfassen“ (Lane Serviceannahme) zu „Reparatur durchführen“ (Lane Werkstatt). Die Rechnung an den Kunden geht dagegen als Nachrichtenfluss in den Pool „Kunde“.

### Abgrenzung
**Nachrichtenfluss:** gestrichelter Pfeil mit Kreis am Anfang, nur zwischen Pools. **Assoziation:** gepunktete Linie zu Datenobjekten und Anmerkungen, ohne Ablaufwirkung.

### Prüfungsfalle
Ein durchgezogener Pfeil über eine Poolgrenze – das ist der Standardfehler in BPMN-Aufgaben.

### Merksatz
Im Pool durchgezogen, zwischen Pools gestrichelt.

Siehe auch: Nachrichtenfluss · Pool · Lane · Standardfluss · Token (BPMN)
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## SEZ
<!-- id: sez · quellen: Karte DD12, DD12 3.2 · stand: 2026-10 -->

Spätester Endzeitpunkt eines Vorgangs im Netzplan: das kleinste SAZ aller direkten Nachfolger (Rückwärtsrechnung).

### Erklärung
Die Rückwärtsrechnung beginnt am Projektende: Der letzte Vorgang erhält als SEZ die Projektdauer (sein FEZ). Danach gilt für jeden Vorgang $\text{SEZ} = \min(\text{SAZ der Nachfolger})$ und $\text{SAZ} = \text{SEZ} - \text{Dauer}$. Der Gesamtpuffer lässt sich auch als $\text{GP} = \text{SEZ} - \text{FEZ}$ berechnen.

### Beispiel
Vorgang B (Datenmodell) hat die Nachfolger D (SAZ 11) und E (SAZ 16). Also $\text{SEZ}_B = \min(11; 16) = 11$. B muss spätestens an Tag 11 fertig sein, sonst verzögert sich D und damit das Projekt.

### Abgrenzung
Das **FEZ** ist das früheste mögliche Ende aus der Vorwärtsrechnung (FAZ + Dauer). Ist SEZ = FEZ, hat der Vorgang keinen Puffer und liegt auf dem kritischen Pfad.

### Prüfungsfalle
Rückwärts das Maximum der Nachfolger nehmen – vorwärts gilt das Maximum, rückwärts das Minimum.

### Merksatz
Spätestes Ende = frühester spätester Anfang der Nachfolger.

Siehe auch: SAZ · FEZ · Gesamtpuffer · Kritischer Pfad · Netzplan
Mehr: Deep Dive 12, 3.2

## Sharding
<!-- id: sharding · quellen: Karte DD8, DD8 5.3 · stand: 2026-10 -->

Horizontale Partitionierung, bei der die Teile einer Tabelle (Shards) auf mehrere Server verteilt werden – Grundlage der horizontalen Skalierung.

### Erklärung
Die Zeilen werden nach einem **Shard-Schlüssel** aufgeteilt, z. B. nach Bereich (Kundennummer 1–100.000), nach Liste (Region) oder per Hash-Funktion für gleichmäßige Verteilung. Jeder Server hält und verarbeitet nur seinen Teil; mehr Last bedeutet mehr Server statt eines größeren Servers. Nachteile: Abfragen über mehrere Shards und Joins werden aufwendiger, die Wahl des Schlüssels ist kritisch (ungleich verteilte „heiße“ Shards).

### Beispiel
Die Bestelldaten des Webshops werden per Hash auf die `kunden_id` auf vier Server verteilt. Alle Bestellungen eines Kunden liegen auf demselben Server – eine Auswertung je Kunde fragt nur einen Shard ab.

### Abgrenzung
**Partitionierung** zerlegt eine Tabelle physisch, meist auf einem Server; Sharding verteilt die Partitionen auf mehrere Server. **Replikation** kopiert dieselben Daten auf mehrere Server (Ausfallsicherheit), Sharding teilt sie auf.

### Prüfungsfalle
Sharding mit Replikation verwechseln – beim Sharding hat jeder Server andere Daten.

### Merksatz
Sharding: aufteilen und verteilen.

Siehe auch: Partitionierung · Horizontale Skalierung · Horizontale Partitionierung · CAP-Theorem
Mehr: Deep Dive 8, 5.3

## Sichere HTTP-Methode
<!-- id: sichere-http-methode · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

HTTP-Methode, die auf dem Server keinen Zustand verändert, sondern nur liest – GET, HEAD und OPTIONS (RFC 9110).

Auch: Sicher

### Erklärung
„Sicher“ (safe) bedeutet: Der Client fordert keine Änderung an; Server und Zwischenspeicher dürfen solche Anfragen beliebig wiederholen, vorab laden oder cachen. Jede sichere Methode ist zugleich idempotent, aber nicht umgekehrt: PUT und DELETE verändern den Server und sind trotzdem idempotent, weil Wiederholung zum selben Zustand führt.

### Beispiel
| Methode | sicher | idempotent |
|---|---|---|
| GET | ja | ja |
| POST | nein | nein |
| PUT | nein | ja |
| PATCH | nein | nicht garantiert |
| DELETE | nein | ja |

`GET /reparaturauftraege/5001` darf eine Filiale beliebig oft senden; `DELETE` auf denselben Auftrag ist idempotent, aber nicht sicher.

### Abgrenzung
**Sicher** heißt hier nicht „verschlüsselt“ oder „abgesichert“ – das regelt HTTPS. Es geht nur um fehlende Seiteneffekte auf dem Server.

### Prüfungsfalle
Eine GET-Route bauen, die Daten löscht (`GET /loeschen?id=5`) – das verletzt die Semantik, Crawler oder Vorabladen lösen dann Löschungen aus.

### Merksatz
Sicher = nur lesen; idempotent = Wiederholen schadet nicht.

Siehe auch: Idempotent · GET · REST · HTTP-Statuscode
Mehr: Deep Dive 15, 3.2

## Sicherheitsvorfall
<!-- id: sicherheitsvorfall · quellen: Karte DD10, DD10 5.4 · stand: 2026-10 -->

Ereignis (Incident), das Vertraulichkeit, Integrität oder Verfügbarkeit von Informationen verletzt oder verletzen kann.

### Erklärung
Ablauf im Incident Management:
1. erkennen und melden (Monitoring, Meldestelle für Beschäftigte)
2. bewerten und priorisieren
3. eindämmen (Systeme vom Netz trennen, Konten sperren)
4. beseitigen und wiederherstellen
5. nachbereiten (Ursache, Lessons Learned, Maßnahmen)

Parallel laufen Meldepflichten: Sind personenbezogene Daten betroffen, an die Datenschutz-Aufsichtsbehörde binnen 72 Stunden (Art. 33 DSGVO). NIS2-pflichtige Einrichtungen melden erhebliche Vorfälle zusätzlich an das BSI: Erstmeldung nach 24 Stunden, Folgemeldung nach 72 Stunden, Abschlussmeldung nach einem Monat (§ 32 BSIG, Stand 2026).

### Beispiel
Ransomware verschlüsselt im Möbelhaus den Dateiserver mit Kundendaten. Die IT trennt den Server vom Netz, informiert den Datenschutzbeauftragten, meldet binnen 72 Stunden und stellt aus dem Offline-Backup wieder her.

### Abgrenzung
**Notfallmanagement** (Business Continuity) sichert den Weiterbetrieb kritischer Prozesse bei schweren Ausfällen; ein Sicherheitsvorfall kann, muss aber kein Notfall sein.

### Prüfungsfalle
Den Schritt „eindämmen“ vergessen oder die Meldefrist mit „unverzüglich, spätestens nach einer Woche“ angeben.

### Merksatz
Erkennen, eindämmen, beheben, lernen – und die Fristen im Blick.

Siehe auch: Notfallmanagement · Datenpanne · Ransomware · Schutzziele
Mehr: Deep Dive 10, 5.4

## Sicherheitszeichen
<!-- id: sicherheitszeichen · quellen: Karte DD14, DD14 5.1 · stand: 2026-10 -->

Genormte Zeichen (ASR A1.3, DIN EN ISO 7010), die über Form und Farbe Verbote, Warnungen, Gebote, Rettungswege und Brandschutzeinrichtungen kennzeichnen.

### Erklärung
| Bedeutung | Form | Farbe |
|---|---|---|
| Verbot | rund, durchgestrichen | rot |
| Warnung | dreieckig | gelb mit schwarzem Rand |
| Gebot | rund | blau |
| Rettung, Erste Hilfe | rechteckig oder quadratisch | grün |
| Brandschutz | rechteckig oder quadratisch | rot |

Der Arbeitgeber muss Sicherheitszeichen einsetzen, wenn Gefahren nicht anders vermieden werden können – sie ergänzen technische und organisatorische Maßnahmen, ersetzen sie aber nicht.

### Beispiel
Im Lager des Möbelhauses: Gebotszeichen „Fußschutz benutzen“ (blau, rund), Warnzeichen „Warnung vor Flurförderzeugen“ (gelbes Dreieck), Rettungszeichen „Notausgang“ (grün, rechteckig), Brandschutzzeichen „Feuerlöscher“ (rot, quadratisch).

### Abgrenzung
Verbots- und Brandschutzzeichen sind beide rot – unterscheidbar an der Form: rund mit Balken gegen eckig.

### Prüfungsfalle
Gebot und Verbot verwechseln: blau rund = du musst, rot rund = du darfst nicht.

### Merksatz
Rund verbietet oder gebietet, das Dreieck warnt, grün rettet, rot-eckig löscht.

Siehe auch: Arbeitsschutz · STOP-Prinzip · Gefährdungsbeurteilung · Berufsgenossenschaft
Mehr: Deep Dive 14, 5.1

## Sicherstellen der Datenqualität
<!-- id: sicherstellen-der-datenqualitat · quellen: DD1 Prüfungsrelevanz, DD2 Prüfungsrelevanz, DD8 Prüfungsrelevanz, DD10 Prüfungsrelevanz · stand: 2026-10 -->

Schriftlicher Prüfungsbereich der AP2 für Fachinformatiker/-innen Daten- und Prozessanalyse (§ 30 FIAusbV): 90 Minuten, 10 % der Gesamtnote.

### Erklärung
Der Prüfling soll zeigen, dass er Daten identifizieren, klassifizieren und bereitstellen, ihre Qualität prüfen und sichern, Zugriff und Verfügbarkeit gewährleisten und die Anforderungen an Datenschutz und Informationssicherheit umsetzen kann. Dazu gehören in den Deep Dives vor allem SQL, Datenmodellierung, Data Warehouse, Datenqualität, Datenschutz und IT-Sicherheit, Datenbereitstellung (Formate, Schnittstellen, NoSQL) sowie Testen und Verfügbarkeit.

### Beispiel
Typische Aufgaben: eine SQL-Abfrage schreiben, eine Tabelle in die 3. Normalform überführen, ein Star-Schema entwerfen, Datenqualitätskennzahlen berechnen, Löschanspruch und Aufbewahrungspflicht abwägen, JSON korrigieren, eine Verfügbarkeit berechnen.

### Abgrenzung
| Prüfungsbereich AP2 | Gewicht |
|---|---|
| Planen und Durchführen eines Projektes der Datenanalyse | 50 % |
| Durchführen einer Prozessanalyse | 10 % |
| Sicherstellen der Datenqualität | 10 % |
| Wirtschafts- und Sozialkunde | 10 % |

Die übrigen 20 % stammen aus Teil 1 (Einrichten eines IT-gestützten Arbeitsplatzes).

### Merksatz
Daten finden, ordnen, bereitstellen, prüfen und schützen.

Siehe auch: Datenqualität · Durchführen einer Prozessanalyse · DSGVO · Data Warehouse
Mehr: Deep Dive 1, Prüfungsrelevanz · Deep Dive 2, Prüfungsrelevanz · Deep Dive 8, Prüfungsrelevanz · Deep Dive 10, Prüfungsrelevanz

## Signifikanz
<!-- id: signifikanz · quellen: Karte DD4, DD4 1.3 · stand: 2026-10 -->

Ein Ergebnis ist statistisch signifikant, wenn es unter der Annahme der Nullhypothese sehr unwahrscheinlich wäre – üblich ist die Schwelle p < 0,05.

### Erklärung
Ein Signifikanztest geht von der **Nullhypothese** aus („kein Zusammenhang“, „kein Unterschied“). Der **p-Wert** gibt an, wie wahrscheinlich ein mindestens so deutliches Ergebnis wäre, wenn die Nullhypothese stimmt. Liegt er unter dem vorab festgelegten Signifikanzniveau (meist 5 %), verwirft man die Nullhypothese. Signifikant heißt nur „vermutlich kein Zufall“ – nicht „stark“, nicht „wichtig“ und nicht „kausal“.

### Beispiel
Bei 2 Mio. Kundendatensätzen ist die Korrelation zwischen Alter und Warenkorbwert mit r = 0,03 hochsignifikant (p < 0,001). Praktisch ist sie bedeutungslos: $R^2 = 0{,}03^2 = 0{,}0009$, das Alter erklärt rund 0,1 % der Streuung.

### Abgrenzung
**Signifikanz** beantwortet „Ist der Effekt wahrscheinlich echt?“, die **Stärke** (r, R²) „Wie groß ist er?“. Bei sehr großen Datenmengen wird fast alles signifikant, bei sehr kleinen kann selbst ein auffälliges r Zufall sein.

### Prüfungsfalle
„Signifikant, also ist der Zusammenhang stark bzw. ursächlich“ – beides folgt nicht.

### Merksatz
Signifikant heißt „kein Zufall“, nicht „wichtig“.

Siehe auch: Nullhypothese · P-Wert · Korrelation · Scheinkorrelation · Stärke
Mehr: Deep Dive 4, 1.3

## Single Point of Failure
<!-- id: single-point-of-failure · quellen: Karte DD16, DD16 4.3 · stand: 2026-10 -->

Einzelne Komponente, deren Ausfall allein das gesamte System lahmlegt – beseitigt wird sie durch Redundanz.

### Erklärung
In einer Reihenschaltung muss jede Komponente laufen; jede nicht redundante Komponente ist damit ein Single Point of Failure (SPOF): ein einzelner Datenbankserver, eine einzige Netzleitung, ein Netzteil, ein Switch – oder eine einzige Person, die als Einzige ein System bedienen kann. Redundanz lohnt sich zuerst an der schwächsten Stelle.

### Beispiel
Reporting: Webserver 99,9 % und Datenbank 99 % in Reihe: $0{,}999 \cdot 0{,}99 = 0{,}98901$, also 98,901 %. Die Datenbank ist der SPOF. Zwei gespiegelte Datenbankserver erreichen $1 - (1 - 0{,}99)^2 = 0{,}9999$; das Gesamtsystem steigt auf $0{,}999 \cdot 0{,}9999 \approx 99{,}890\ \%$.

### Abgrenzung
Redundanz beseitigt SPOFs und erhöht die Verfügbarkeit, **ersetzt aber kein Backup**: Ein gelöschter Datensatz wird sofort auf alle Spiegel übertragen.

### Prüfungsfalle
RAID als Lösung für jeden SPOF nennen – RAID schützt nur vor Plattenausfall, nicht vor dem Ausfall des Servers.

### Merksatz
Was es nur einmal gibt, kann alles stoppen.

Siehe auch: Verfügbarkeit · Georedundanz · Verfügbarkeitsklassen · SLA
Mehr: Deep Dive 16, 4.3

## SIPOC
<!-- id: sipoc · quellen: Karte DD5, DD5 4.1, DD17 1.4 · stand: 2026-10 -->

Einseitige Tabelle zur Abgrenzung eines Prozesses: Supplier, Input, Process (4–7 Hauptschritte), Output, Customer – typisch für die Define-Phase von Six Sigma.

### Erklärung
SIPOC klärt in wenigen Minuten, wo ein Prozess beginnt und endet, wer liefert, was hineingeht, welche Hauptschritte es gibt, was herauskommt und wer es erhält. Damit ist der Rahmen gesetzt, bevor jemand ein detailliertes BPMN-Modell zeichnet – Schritt 1 der Prozessanalyse (Abgrenzung: Start, Ende, Schnittstellen).

### Beispiel
| Supplier | Input | Process | Output | Customer |
|---|---|---|---|---|
| Kunde, Ersatzteillieferant | Reparaturmeldung, Ersatzteil | erfassen → Kostenvoranschlag → reparieren → abrechnen | reparierte Ware, Rechnung | Kunde, Buchhaltung |

### Abgrenzung
SIPOC zeigt nur die grobe Kette ohne Verzweigungen und Rollen; **BPMN** modelliert den Ablauf im Detail, das **Wertstromdiagramm** zusätzlich Zeiten.

### Prüfungsfalle
Im Process-Feld 20 Detailschritte mit Verzweigungen eintragen – SIPOC bleibt bei wenigen Hauptschritten.

### Merksatz
Von wem, was hinein, was passiert, was heraus, für wen.

Siehe auch: Six Sigma · DMAIC · Wertstromdiagramm · Ist-Aufnahme
Mehr: Deep Dive 5, 4.1 · Deep Dive 17, 1.4

## Six Sigma
<!-- id: six-sigma · quellen: Karte DD5, DD5 6.3 · stand: 2026-10 -->

Datengetriebener Ansatz des Qualitätsmanagements, der die Streuung von Prozessergebnissen verringert; Ziel sind höchstens 3,4 Fehler pro Million Fehlermöglichkeiten.

### Erklärung
Six Sigma arbeitet in Projekten nach **DMAIC**: Define (Problem, Ziel, Kunden – oft mit SIPOC), Measure (Ist-Zustand messen), Analyze (Ursachen mit Daten nachweisen), Improve (Lösungen erproben), Control (Verbesserung absichern). Gemessen wird in DPMO: $\text{DPMO} = \frac{\text{Fehler}}{\text{Einheiten} \cdot \text{Möglichkeiten je Einheit}} \cdot 1.000.000$. Die 3,4 DPMO gelten unter der üblichen Annahme einer langfristigen Mittelwertverschiebung um 1,5 Sigma.

### Beispiel
200 Reparaturaufträge mit je 5 Fehlermöglichkeiten, 30 Fehler: $\frac{30}{200 \cdot 5} \cdot 1.000.000 = 30.000$ DPMO – zwischen 3 Sigma (rund 66.800) und 4 Sigma (rund 6.200).

### Abgrenzung
**Lean Management** beseitigt Verschwendung und beschleunigt den Fluss; **Six Sigma** senkt Streuung und Fehler; **TQM** ist die umfassende Unternehmenshaltung; **KVP/Kaizen** setzt auf viele kleine Verbesserungen.

### Prüfungsfalle
Die Fehlermöglichkeiten je Einheit im Nenner vergessen.

### Merksatz
Weniger Streuung, weniger Fehler – gemessen, nicht gefühlt.

Siehe auch: DMAIC · DPMO · SIPOC · Lean Management · Total Quality Management
Mehr: Deep Dive 5, 6.3

## Skalenniveau
<!-- id: skalenniveau · quellen: Karte DD3, DD3 Teil 1 · stand: 2026-10 -->

Messniveau eines Merkmals – nominal, ordinal, intervall- oder verhältnisskaliert; es bestimmt, welche Kennzahlen und Rechenoperationen zulässig sind.

### Erklärung
| Skala | Eigenschaft | Beispiel | zulässig |
|---|---|---|---|
| nominal | nur gleich/ungleich | Reklamationsgrund, PLZ | Häufigkeit, Modus |
| ordinal | Rangfolge, ungleiche Abstände | Zufriedenheit 1–5 | + Median, Quartile |
| intervall | gleiche Abstände, kein absoluter Nullpunkt | Temperatur in °C | + Mittelwert, Differenzen |
| verhältnis | absoluter Nullpunkt | Umsatz, Dauer | + Verhältnisse, Variationskoeffizient |

Intervall- und Verhältnisskala heißen zusammen **metrisch**.

### Beispiel
Kundennummern und Postleitzahlen sind Zahlen, aber nominal – ihr Mittelwert ist sinnlos. Bei Umsätzen ist „doppelt so viel“ zulässig, bei 20 °C gegen 10 °C nicht.

### Abgrenzung
Das Skalenniveau beschreibt die Messqualität; **diskret/stetig** beschreibt, ob die Werte abzählbar oder beliebig teilbar sind – eine zweite, unabhängige Einteilung.

### Prüfungsfalle
Den Mittelwert ordinaler Daten ohne Hinweis berechnen – formal korrekt ist der Median.

### Merksatz
Je höher die Skala, desto mehr darf man rechnen.

Siehe auch: Nominalskala · Ordinalskala · Intervallskala · Verhältnisskala · Median
Mehr: Deep Dive 3, Teil 1

## Skalieren
<!-- id: skalieren · quellen: Karte DD6, DD6 Teil 5 · stand: 2026-10 -->

Merkmale auf einen vergleichbaren Wertebereich bringen – per Min-Max-Normalisierung auf 0 bis 1 oder per Standardisierung auf Mittelwert 0 und Standardabweichung 1; Pflicht bei k-Means und k-NN.

### Erklärung
Abstandsbasierte Verfahren vergleichen Merkmale über Distanzen. Ohne Skalierung dominiert das Merkmal mit den größten Zahlen: Ein Jahresumsatz in Euro (bis 45.000) überdeckt das Alter in Jahren völlig. Die Kennwerte (Minimum, Maximum, Mittelwert, Standardabweichung) werden nur aus den Trainingsdaten berechnet und auf die Testdaten übertragen, sonst entsteht Data Leakage. Entscheidungsbäume brauchen keine Skalierung.

### Beispiel
Min-Max: Umsatz 9.160 € bei Spanne 200 bis 45.000 €: $x' = \frac{9160 - 200}{45000 - 200} = 0{,}20$. Standardisierung: Lieferdauer 7 Tage bei Mittel 4 und Standardabweichung 1,5: $z = \frac{7 - 4}{1{,}5} = 2{,}00$.

### Abgrenzung
**Skalieren** (Datenvorbereitung) ist nicht **Skalierung** einer Datenbank (mehr Leistung durch stärkere oder mehr Server) und nicht **Normalisierung** im Datenbankentwurf (Normalformen).

### Prüfungsfalle
k-Means auf unskalierten Daten rechnen und das Ergebnis als Kundensegmentierung verkaufen.

### Merksatz
Erst vergleichbar machen, dann Abstände messen.

Siehe auch: Min-Max-Normalisierung · Standardisierung · K-Means · K-Nächste-Nachbarn
Mehr: Deep Dive 6, Teil 5

## Skalierung
<!-- id: skalierung · quellen: DD15 4.1 · stand: 2026-10 -->

Fähigkeit eines Systems, mit wachsender Last Schritt zu halten – vertikal durch einen stärkeren Server oder horizontal durch mehr Server.

### Erklärung
**Vertikale Skalierung** (Scale-up): mehr CPU, Arbeitsspeicher oder schnellere Platten für denselben Server – einfach, aber durch die größte verfügbare Maschine begrenzt und ohne Ausfallsicherheit. **Horizontale Skalierung** (Scale-out): zusätzliche Server teilen sich Daten und Arbeit, z. B. per Sharding – nahezu unbegrenzt, aber verteilte Systeme bringen Konsistenzfragen (CAP-Theorem). Relationale Datenbanken skalieren klassisch vertikal, viele NoSQL-Systeme und Big-Data-Werkzeuge wie Hadoop und Spark horizontal.

### Beispiel
Der Webshop des Möbelhauses wird zur Black-Week-Aktion langsam. Statt den Datenbankserver auf die doppelte Arbeitsspeichergröße aufzurüsten (vertikal), verteilt das Team die Sitzungsdaten auf drei Key-Value-Server (horizontal).

### Abgrenzung
Nicht verwechseln mit **Skalieren** von Merkmalen in der Datenvorbereitung (Normalisierung, Standardisierung).

### Prüfungsfalle
„Horizontal“ und „vertikal“ vertauschen – horizontal heißt mehr Rechner nebeneinander.

### Merksatz
Scale-up macht den Server größer, Scale-out macht es mehr Server.

Siehe auch: Horizontale Skalierung · Vertikale Skalierung · Sharding · CAP-Theorem
Mehr: Deep Dive 15, 4.1

## SLA
<!-- id: sla · quellen: Karte DD16, DD16 4.4 · stand: 2026-10 -->

Service Level Agreement: vertragliche Vereinbarung über messbare Dienstqualität zwischen Dienstleister und Kunde – z. B. Servicezeit, Verfügbarkeit, Reaktions- und Wiederherstellungszeit, Vertragsstrafen.

### Erklärung
Typische Inhalte: Leistungsbeschreibung, Servicezeit (24/7 oder Mo–Fr 8–18 Uhr), Verfügbarkeit innerhalb dieser Zeit, Reaktions- und Wiederherstellungszeiten je Störungspriorität, Messverfahren und Berichte, Eskalationswege, Wartungsfenster (zählen meist nicht als Ausfall) und Vertragsstrafen. Die Verfügbarkeit bezieht sich immer auf die vereinbarte Servicezeit.

### Beispiel
SLA mit dem Rechenzentrum: 99,9 % pro Jahr, 24/7. Erlaubt: $8.760\ \text{h} \cdot (1 - 0{,}999) = 8{,}76$ Stunden Ausfall. Tatsächlich waren es 12 Stunden: $\frac{8.760 - 12}{8.760} \cdot 100\ \% \approx 99{,}863\ \%$ – das SLA ist verfehlt, die Vertragsstrafe wird fällig.

### Abgrenzung
**Reaktionszeit:** bis jemand mit der Bearbeitung beginnt. **Wiederherstellungszeit:** bis der Dienst wieder läuft. **RTO/RPO** sind interne Ziele des Notfallmanagements, das SLA ist die vertragliche Zusage nach außen.

### Prüfungsfalle
Reaktionszeit und Wiederherstellungszeit gleichsetzen oder die Servicezeit ignorieren.

### Merksatz
Ein SLA macht Qualität messbar – und Verstöße teuer.

Siehe auch: Verfügbarkeit · Single Point of Failure · Verfügbarkeitsklassen · Notfallmanagement
Mehr: Deep Dive 16, 4.4

## Slice
<!-- id: slice · quellen: Karte DD8, DD8 4.5 · stand: 2026-10 -->

OLAP-Operation, die eine Dimension des Datenwürfels auf genau einen Wert festlegt und so eine „Scheibe“ herausschneidet.

### Erklärung
Der OLAP-Würfel hat z. B. die Dimensionen Zeit, Produkt und Filiale. Ein Slice fixiert eine davon – übrig bleibt eine zweidimensionale Sicht auf die restlichen Dimensionen. In SQL entspricht das einer WHERE-Bedingung mit Gleichheit auf eine Dimension.

### Beispiel
Umsatz je Produktkategorie und Filiale, nur für das Jahr 2025:

```sql
SELECT p.kategorie, f.filialname, SUM(v.umsatz) AS umsatz
FROM fakt_verkauf v
JOIN dim_zeit z     ON v.zeit_id = z.zeit_id
JOIN dim_produkt p  ON v.produkt_id = p.produkt_id
JOIN dim_filiale f  ON v.filial_id = f.filial_id
WHERE z.jahr = 2025
GROUP BY p.kategorie, f.filialname;
```

### Abgrenzung
| Operation | Wirkung |
|---|---|
| Slice | eine Dimension auf einen Wert |
| Dice | mehrere Dimensionen auf Bereiche (Teilwürfel) |
| Drill-down / Roll-up | feiner bzw. gröber verdichten |
| Pivot | Achsen tauschen |

### Prüfungsfalle
Slice und Dice vertauschen: „nur Möbel und Region Nord und 1. Halbjahr“ ist ein Dice.

### Merksatz
Slice schneidet eine Scheibe, Dice einen Würfel.

Siehe auch: Dice · Drill-down · Roll-up · OLAP · Pivot
Mehr: Deep Dive 8, 4.5

## SMART-Ziele
<!-- id: smart-ziele · quellen: Karte DD12, DD12 1.2 · stand: 2026-10 -->

Kriterien für gut formulierte Ziele: spezifisch, messbar, attraktiv bzw. akzeptiert, realistisch und terminiert.

Auch: SMART

### Erklärung
Ein SMART-Ziel lässt sich am Projektende eindeutig überprüfen und ist damit die Grundlage des Soll-Ist-Vergleichs. **Spezifisch:** konkret und eindeutig, nicht „Prozesse verbessern“. **Messbar:** Kennzahl mit Ausgangs- und Zielwert. **Attraktiv/akzeptiert:** von den Beteiligten getragen. **Realistisch:** mit den vorhandenen Ressourcen erreichbar. **Terminiert:** mit festem Datum.

### Beispiel
„Die durchschnittliche Durchlaufzeit im Reparaturprozess wird bis zum 31.03.2027 von 30 auf 20 Stunden gesenkt.“ Spezifisch: Durchlaufzeit Reparaturprozess. Messbar: 30 → 20 Stunden. Terminiert: 31.03.2027. Attraktiv und realistisch: mit dem Fachbereich abgestimmt, durch die Wertstromanalyse belegt.

### Abgrenzung
SMART-Ziele beschreiben das gewünschte Ergebnis; **Anforderungen** im Lasten- und Pflichtenheft beschreiben, was die Lösung dafür können muss.

### Prüfungsfalle
In der Aufgabe „Weisen Sie alle fünf Kriterien nach“ nur das Ziel formulieren, ohne jedes Kriterium im Satz zu zeigen.

### Merksatz
Ohne Zahl und Datum ist es ein Wunsch, kein Ziel.

Siehe auch: Lastenheft · Pflichtenheft · Soll-Ist-Vergleich · Magisches Dreieck
Mehr: Deep Dive 12, 1.2

## Smoke-Test
<!-- id: smoke-test · quellen: Karte DD16, DD16 2.4 · stand: 2026-10 -->

Kurzer Grundtest nach einer Installation oder Auslieferung: Startet das System, funktionieren die Kernfunktionen?

### Erklärung
Der Smoke-Test prüft in wenigen Minuten, ob sich ein ausführlicher Test überhaupt lohnt. Schlägt er fehl, wird die Version zurückgewiesen, statt Zeit in detaillierte Testfälle zu stecken. Er läuft typischerweise nach jedem Deployment, oft automatisiert. Der Name stammt aus der Elektronik: Einschalten und schauen, ob Rauch aufsteigt.

### Beispiel
Nach dem Update des Reporting-Systems: Anmeldung funktioniert, das Umsatz-Dashboard öffnet sich, der nächtliche ETL-Lauf hat Daten geladen. Erst danach beginnt der Regressionstest.

### Abgrenzung
| Testart | Zweck |
|---|---|
| Smoke-Test | Grundfunktion nach Installation |
| Regressionstest | keine ungewollten Nebenwirkungen nach Änderung |
| Fehlernachtest | gemeldeter Fehler ist behoben |
| Systemtest | Gesamtsystem gegen das Pflichtenheft |

### Prüfungsfalle
Einen bestandenen Smoke-Test als Nachweis der Fehlerfreiheit werten – er prüft nur das Nötigste.

### Merksatz
Läuft es überhaupt? Dann testen wir weiter.

Siehe auch: Regressionstest · Fehlernachtest · Systemtest · Testpyramide
Mehr: Deep Dive 16, 2.4

## SMOTE
<!-- id: smote · quellen: DD7 4.5 · stand: 2026-10 -->

Synthetic Minority Over-sampling Technique: Oversampling-Verfahren, das für die seltene Klasse künstliche Datensätze zwischen vorhandenen Fällen und ihren nächsten Nachbarn erzeugt.

### Erklärung
Bei unausgeglichenen Klassen lernt ein Modell die seltene Klasse schlecht. Statt Fälle der Minderheit einfach zu kopieren, wählt SMOTE zu einem Fall einen seiner k nächsten Nachbarn aus derselben Klasse und erzeugt einen neuen Punkt auf der Verbindungsstrecke dazwischen. So entstehen neue, ähnliche, aber nicht identische Fälle. SMOTE wird nur auf die Trainingsdaten angewendet – und zwar nach dem Train-Test-Split.

### Beispiel
Im Reklamationsmodell sind 10 % der Aufträge reklamiert. Zwischen einem reklamierten Auftrag mit 3 Tagen Lieferzeit und seinem Nachbarn mit 5 Tagen entsteht ein synthetischer Fall mit z. B. 4,2 Tagen. Die Testmenge behält ihre reale Verteilung.

### Abgrenzung
**Undersampling** entfernt Fälle der Mehrheit (kostet Information); einfaches **Oversampling** dupliziert Fälle (Gefahr des Auswendiglernens); **Klassengewichte** lassen die Daten unverändert und gewichten Fehler unterschiedlich.

### Prüfungsfalle
Erst SMOTE auf alle Daten anwenden und dann aufteilen – synthetische Verwandte landen im Test, die Güte wird geschönt.

### Merksatz
Erst aufteilen, dann nur das Training auffüllen.

Siehe auch: Oversampling · Undersampling · Unausgeglichene Klassen · Stratifizierte Aufteilung
Mehr: Deep Dive 7, 4.5

## Snowflake-Schema
<!-- id: snowflake-schema · quellen: Karte DD8, DD8 4.3, DD17 3.5 · stand: 2026-10 -->

Variante des Star-Schemas, bei der die Dimensionstabellen normalisiert und Hierarchieebenen in eigene Tabellen ausgelagert sind (z. B. Produkt → Warengruppe → Kategorie).

### Erklärung
Durch die Normalisierung sinkt die Redundanz in den Dimensionen, Hierarchien sind leichter zu pflegen und der Speicherbedarf ist geringer. Dafür braucht jede Abfrage mehr Joins, sie wird langsamer und für Fachanwender schwerer verständlich. Das Snowflake-Schema lohnt bei sehr großen Dimensionen mit häufig geänderten Hierarchien.

### Beispiel
`fakt_verkauf` → `dim_produkt` (produkt_id, bezeichnung, warengruppe_id) → `dim_warengruppe` (warengruppe_id, name, kategorie_id) → `dim_kategorie`. Für „Umsatz je Kategorie“ sind drei Joins statt einem nötig.

### Abgrenzung
| | Star | Snowflake |
|---|---|---|
| Dimensionen | denormalisiert | normalisiert |
| Joins | wenige | mehr |
| Abfragetempo | höher | geringer |
| Speicher | höher | geringer |

### Prüfungsfalle
„Snowflake ist besser, weil normalisiert“ – im DWH zählt Abfragegeschwindigkeit, deshalb ist das Star-Schema der Normalfall.

### Merksatz
Schneeflocke spart Speicher, Stern spart Joins.

Siehe auch: Star-Schema · Galaxy-Schema · Dimensionstabelle · Normalisierung
Mehr: Deep Dive 8, 4.3 · Deep Dive 17, 3.5

## SOAP
<!-- id: soap · quellen: Karte DD15, DD15 3.2 · stand: 2026-10 -->

XML-basiertes Protokoll für Webservices: Nachrichten bestehen aus Envelope, optionalem Header und Body und werden meist per HTTP POST übertragen; die Schnittstelle beschreibt eine WSDL.

### Erklärung
SOAP (W3C-Standard, aktuell Version 1.2) definiert ein festes Nachrichtenformat und streng typisierte Operationen. Fehler werden als Fault-Element im Body gemeldet. Die **WSDL** (Web Services Description Language) beschreibt Operationen, Datentypen und Adresse maschinenlesbar, sodass Clients daraus Code erzeugen können. SOAP ist verbreitet bei Banken, Behörden und ERP-Systemen, wo Verträge streng und Erweiterungen wie WS-Security gefragt sind.

### Beispiel
```xml
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Body>
    <getAuftrag><auftrag_id>5001</auftrag_id></getAuftrag>
  </soap:Body>
</soap:Envelope>
```

### Abgrenzung
| Stil | Merkmal | Beschreibung |
|---|---|---|
| REST | Ressourcen + HTTP-Methoden, meist JSON | OpenAPI |
| SOAP | Protokoll mit XML-Nachrichten, Operationen | WSDL |
| GraphQL | Client wählt Felder, ein Endpunkt | Schema |

### Prüfungsfalle
SOAP als „Architekturstil“ und REST als „Protokoll“ bezeichnen – es ist umgekehrt.

### Merksatz
SOAP verpackt alles in einen XML-Umschlag.

Siehe auch: REST · WSDL · XML · API
Mehr: Deep Dive 15, 3.2

## Social Engineering
<!-- id: social-engineering · quellen: Karte DD10, DD10 4.5 · stand: 2026-10 -->

Angriff, der Menschen statt Technik manipuliert – über Vertrauen, Zeitdruck, Autorität oder Hilfsbereitschaft –, um Zugangsdaten, Informationen oder Handlungen zu erschleichen.

### Erklärung
Angreifer geben sich als IT-Support, Vorgesetzte oder Lieferanten aus. Bekannte Formen: Phishing (gefälschte Nachrichten), Vishing (Telefon), CEO-Fraud (angebliche Anweisung der Geschäftsführung zu einer Überweisung), Pretexting (erfundene Geschichte) und Tailgating (hinter Berechtigten durch die Tür). Technische Maßnahmen helfen nur begrenzt; entscheidend sind Schulung, Rückrufverfahren über bekannte Nummern, klare Prozesse (Vier-Augen-Prinzip bei Zahlungen) und eine Kultur, in der Nachfragen erwünscht ist.

### Beispiel
Ein Anrufer meldet sich als „IT-Support der Zentrale“ bei der Filiale und bittet Lea, für ein dringendes Update ihr Passwort zu nennen. Richtig: auflegen und über die bekannte Hotline zurückrufen.

### Abgrenzung
**Phishing** ist eine Form des Social Engineering per Nachricht. **Brute Force** ist ein rein technischer Angriff durch Durchprobieren.

### Prüfungsfalle
Nur technische Gegenmaßnahmen nennen (Firewall, Virenschutz) – gegen Manipulation hilft vor allem Schulung.

### Merksatz
Der Mensch ist die Schwachstelle, die man nicht patchen kann – aber schulen.

Siehe auch: Phishing · Mehr-Faktor-Authentifizierung · Vier-Augen-Prinzip · Schadsoftware
Mehr: Deep Dive 10, 4.5

## Solidaritätszuschlag
<!-- id: solidaritatszuschlag · quellen: Karte DD14, DD14 1.4 · stand: 2026-10 -->

Ergänzungsabgabe von 5,5 % der Lohn- bzw. Einkommensteuer, die seit 2021 nur noch bei hohen Einkommen anfällt.

### Erklärung
Unterhalb einer Freigrenze fällt kein Soli an; 2026 liegt sie bei 20.350 € Lohn- bzw. Einkommensteuer im Jahr für Einzelveranlagte und 40.700 € bei Zusammenveranlagung (Stand 2026). Knapp darüber gilt eine **Milderungszone**: Der Soli beträgt dort höchstens 11,9 % des Betrags, um den die Steuer die Freigrenze übersteigt. Weit darüber gelten die vollen 5,5 %. In der Praxis berücksichtigen die Lohnsteuertabellen das automatisch.

### Beispiel
Jonas zahlt keine Lohnsteuer, also auch keinen Soli. Eine Geschäftsführerin zahlt 40.000 € Lohnsteuer im Jahr: voller Soli $40.000 \cdot 0{,}055 = 2.200$ €; die Grenze der Milderungszone $0{,}119 \cdot (40.000 - 20.350) = 2.338{,}35$ € liegt höher, also gilt 2.200 €.

### Abgrenzung
Soli und **Kirchensteuer** (8 bzw. 9 %) bemessen sich beide an der Lohnsteuer, nicht am Brutto; die Sozialversicherungsbeiträge dagegen am Bruttoentgelt.

### Prüfungsfalle
5,5 % vom Brutto rechnen – Bemessungsgrundlage ist die Steuer.

### Merksatz
Soli: 5,5 % auf die Steuer, und nur noch für hohe Einkommen.

Siehe auch: Lohnsteuer · Kirchensteuer · Nettoentgelt · Steuerklassen
Mehr: Deep Dive 14, 1.4

## Solidarprinzip
<!-- id: solidarprinzip · quellen: Karte DD14, DD14 1.1 · stand: 2026-10 -->

Grundsatz der Sozialversicherung: Die Beiträge richten sich nach dem Einkommen, die Leistungen nach dem Bedarf.

### Erklärung
Wer mehr verdient, zahlt mehr – bis zur Beitragsbemessungsgrenze. Leistungen erhält jeder nach Bedarf, unabhängig von der Beitragshöhe: Die Krankenkasse zahlt dieselbe Operation für Geringverdiener wie für Gutverdiener. In der Krankenversicherung sind Familienangehörige ohne eigenes Einkommen beitragsfrei mitversichert. So tragen die Starken die Schwachen, Gesunde die Kranken, Junge die Alten.

### Beispiel
Lea (1.200 € brutto) und ein Abteilungsleiter (5.000 € brutto) sind bei derselben Krankenkasse. Er zahlt gut das Vierfache an Beitrag; beim Beinbruch bekommen beide dieselbe Behandlung.

### Abgrenzung
In der **privaten Krankenversicherung** gilt das Äquivalenzprinzip: Der Beitrag richtet sich nach Risiko, Alter und Leistungsumfang. Das **Umlageverfahren** beschreibt dagegen die Finanzierung über die Zeit (laufende Beiträge zahlen laufende Renten).

### Prüfungsfalle
„Wer mehr zahlt, bekommt mehr Leistung“ – das gilt in der Krankenversicherung nicht (bei Rente und Arbeitslosengeld hängt die Höhe allerdings vom früheren Einkommen ab).

### Merksatz
Zahlen nach Können, Leistung nach Bedarf.

Siehe auch: Sozialversicherung · Selbstverwaltung · Umlageverfahren · Beitragsbemessungsgrenze
Mehr: Deep Dive 14, 1.1

## Soll-Ist-Vergleich
<!-- id: soll-ist-vergleich · quellen: Karte DD12, DD12 Teil 5, DD16 1.1 · stand: 2026-10 -->

Regelmäßiger Abgleich von Plan- und Ist-Werten bei Terminen, Kosten und Leistung – Grundlage jeder Projektsteuerung und Kern des Abschlusskapitels der Projektdokumentation.

### Erklärung
Man vergleicht, was geplant war (Soll aus Projektplan, Pflichtenheft, SMART-Zielen), mit dem, was erreicht wurde (Ist), erklärt Abweichungen und leitet Maßnahmen ab. Im laufenden Projekt dient er der Steuerung, am Ende der Bewertung. In der Qualitätssicherung prüft er das Ergebnis gegen die Anforderungen; im IT-Grundschutz heißt der entsprechende Schritt IT-Grundschutz-Check.

### Beispiel
| Größe | Soll | Ist | Abweichung |
|---|---|---|---|
| Dauer | 25 Tage | 28 Tage | +3 Tage (Datenquelle verspätet) |
| Kosten | 12.000 € | 11.400 € | −600 € |
| Durchlaufzeit Reparatur | 20 h | 22 h | Ziel knapp verfehlt |

### Abgrenzung
**Soll-Konzeption** entwirft den künftigen Zustand eines Prozesses; der **Soll-Ist-Vergleich** misst, ob er erreicht wurde.

### Prüfungsfalle
Abweichungen nur auflisten, ohne Ursachen und Konsequenzen zu nennen.

### Merksatz
Plan gegen Wirklichkeit – und dann erklären, warum.

Siehe auch: SMART-Ziele · Änderungsmanagement · Qualitätskontrolle · Meilenstein
Mehr: Deep Dive 12, Teil 5 · Deep Dive 16, 1.1

## Soll-Konzeption
<!-- id: soll-konzeption · quellen: Karte DD5, DD5 1.2 · stand: 2026-10 -->

Schritt 5 der Prozessanalyse: Entwurf des optimierten Prozesses auf Basis der Schwachstellenanalyse.

### Erklärung
Für jede gefundene Ursache wird eine Maßnahme entworfen und im Soll-Modell (BPMN) dargestellt. Bewährt ist die Prüfreihenfolge **ESUA**: Eliminieren (überflüssige Schritte streichen), Standardisieren, Umstellen/Parallelisieren, Automatisieren. Danach folgen Wirtschaftlichkeitsbetrachtung und Umsetzung mit Erfolgskontrolle über Kennzahlen.

### Beispiel
Ist: Ersatzteilbestellung und Technikereinplanung laufen nacheinander. Soll: Beide starten parallel nach einem AND-Gateway – die Durchlaufzeit sinkt um die Dauer des kürzeren Schritts.

### Abgrenzung
| Schritt | Frage |
|---|---|
| Ist-Aufnahme | Wie läuft es heute? |
| Schwachstellenanalyse | Warum läuft es schlecht? |
| Soll-Konzeption | Wie soll es künftig laufen? |
| Soll-Ist-Vergleich | Wurde das Ziel erreicht? |

### Prüfungsfalle
Gleich automatisieren – einen überflüssigen Schritt zu automatisieren ist die teuerste Lösung.

### Merksatz
Erst weglassen, dann ordnen, dann parallelisieren, zuletzt automatisieren.

Siehe auch: Schwachstellenanalyse · Ist-Aufnahme · Soll-Ist-Vergleich · Wirtschaftlichkeitsbetrachtung
Mehr: Deep Dive 5, 1.2

## Sortieren
<!-- id: sortieren · quellen: DD11 A2 · stand: 2026-10 -->

Gestaltungsregel für Diagramme: Kategorien nach ihrem Wert ordnen statt alphabetisch oder zufällig – die Reihenfolge ist selbst eine Information.

### Erklärung
In einem sortierten Balken- oder Säulendiagramm erkennt man auf einen Blick Rangfolge, Spitzenreiter und Schlusslichter, ohne Längen mühsam vergleichen zu müssen. Absteigend sortiert man meist, wenn die größten Werte interessieren (Pareto-Logik). Ausnahmen: natürliche Reihenfolgen wie Monate, Altersgruppen oder Noten bleiben in ihrer Ordnung.

### Beispiel
Reklamationen je Ursache im Möbelhaus: Transportschaden 120, Montagefehler 85, Falschlieferung 40, Sonstiges 15. Absteigend sortiert zeigt das Balkendiagramm sofort, wo Maßnahmen am meisten bringen.

### Abgrenzung
Gemeint ist hier die Darstellung. Für das algorithmische Sortieren von Listen gibt es Verfahren wie Bubble Sort, Selection Sort oder Merge Sort.

### Prüfungsfalle
Monate nach Umsatz sortieren – bei Zeitachsen zerstört das den Verlauf.

### Merksatz
Nach Wert sortieren, außer die Kategorien haben schon eine Ordnung.

Siehe auch: Balkendiagramm · Pareto-Diagramm · Sparsam mit Farben · Stabiles Sortierverfahren
Mehr: Deep Dive 11, A2

## Sozialauswahl
<!-- id: sozialauswahl · quellen: Karte DD13, DD13 3.4 · stand: 2026-10 -->

Pflicht bei einer betriebsbedingten Kündigung im Geltungsbereich des KSchG: Unter vergleichbaren Beschäftigten ist derjenige zu kündigen, der sozial am wenigsten schutzbedürftig ist (§ 1 Abs. 3 KSchG).

### Erklärung
Die vier gesetzlichen Kriterien sind Dauer der **Betriebszugehörigkeit**, **Lebensalter**, **Unterhaltspflichten** und **Schwerbehinderung**. Verglichen werden nur Beschäftigte, die austauschbar sind (gleiche Ebene, ähnliche Tätigkeit). Leistungsträger dürfen ausnahmsweise herausgenommen werden, wenn ihre Weiterbeschäftigung im berechtigten betrieblichen Interesse liegt. Eine fehlerhafte Sozialauswahl macht die Kündigung sozial ungerechtfertigt.

### Beispiel
Im Lager fällt eine Stelle weg. Herr Kaya (6 Jahre im Betrieb, ein Kind) und ein lediger Kollege (1 Jahr, keine Unterhaltspflichten) sind vergleichbar. Sozial weniger schutzbedürftig ist der Kollege.

### Abgrenzung
Die Sozialauswahl gehört nur zur **betriebsbedingten** Kündigung. Bei personen- und verhaltensbedingter Kündigung geht es um die Person selbst (Prognose, Abmahnung).

### Prüfungsfalle
Leistung oder Krankheitstage als Kriterium nennen – sie gehören nicht zu den vier gesetzlichen Kriterien.

### Merksatz
Jahre, Alter, Kinder, Behinderung.

Siehe auch: Kündigungsschutzgesetz · Schwerbehinderte Menschen · Kündigungsschutzklage · Ordentliche Kündigung
Mehr: Deep Dive 13, 3.4

## Soziale Marktwirtschaft
<!-- id: soziale-marktwirtschaft · quellen: Karte DD14, DD14 4.3 · stand: 2026-10 -->

Wirtschaftsordnung Deutschlands: Preisbildung über Markt und Wettbewerb, ergänzt durch sozialen Ausgleich, Wettbewerbsschutz und staatliche Konjunkturpolitik.

### Erklärung
Grundlage sind Privateigentum, Vertragsfreiheit und freie Preisbildung. Der Staat greift ein, wo der Markt allein zu unerwünschten Ergebnissen führt: Er schützt den Wettbewerb (Kartellverbot, Fusionskontrolle durch das Bundeskartellamt), sichert sozial ab (Sozialversicherung, Bürgergeld, Kündigungsschutz, Mindestlohn) und steuert die Konjunktur (Fiskalpolitik, Ziele des magischen Vierecks). Geprägt wurde das Modell nach 1948 von Ludwig Erhard und Alfred Müller-Armack.

### Beispiel
Das Möbelhaus legt seine Preise selbst fest und konkurriert mit anderen Händlern. Gleichzeitig muss es den Mindestlohn zahlen, Sozialversicherungsbeiträge abführen und darf keine Preisabsprachen mit Wettbewerbern treffen.

### Abgrenzung
| Ordnung | Merkmal |
|---|---|
| Freie Marktwirtschaft | Preisbildung allein am Markt, Staat nur Ordnungshüter |
| Zentralverwaltungswirtschaft | Staat plant Produktion und Preise |
| Soziale Marktwirtschaft | Markt plus sozialer Ausgleich und Wettbewerbsschutz |

### Prüfungsfalle
Soziale Marktwirtschaft als „Mischung aus Planwirtschaft und Markt“ beschreiben – Produktion und Preise plant der Staat gerade nicht.

### Merksatz
So viel Markt wie möglich, so viel Staat wie nötig.

Siehe auch: Gleichgewichtspreis · Staatliche Eingriffe · Fiskalpolitik · Sozialversicherung
Mehr: Deep Dive 14, 4.3

## Sozialversicherung
<!-- id: sozialversicherung · quellen: Karte DD14, DD14 1.2 · stand: 2026-10 -->

Gesetzliche Pflichtversicherung mit fünf Zweigen – Kranken-, Pflege-, Renten-, Arbeitslosen- und Unfallversicherung –, organisiert nach Solidarprinzip und Selbstverwaltung.

### Erklärung
| Zweig | Träger | Satz 2026 | Arbeitnehmeranteil |
|---|---|---|---|
| Kranken | Krankenkassen | 14,6 % + Zusatzbeitrag (Ø 2,9 %) | 7,3 % + halber Zusatzbeitrag |
| Pflege | Pflegekassen | 3,6 % | 1,8 % + 0,6 % für Kinderlose ab 23 |
| Rente | Deutsche Rentenversicherung | 18,6 % | 9,3 % |
| Arbeitslosen | Bundesagentur für Arbeit | 2,6 % | 1,3 % |
| Unfall | Berufsgenossenschaften | je nach Gefahrklasse | 0 % – Arbeitgeber allein |

(Stand 2026; in Sachsen tragen Arbeitnehmer in der Pflegeversicherung 2,3 %, Arbeitgeber 1,3 %.) Beiträge werden nur bis zur Beitragsbemessungsgrenze erhoben; bei Azubis bis 325 € monatlich zahlt der Arbeitgeber allein.

### Beispiel
Jonas (17), 1.200 € brutto, Zusatzbeitrag 2,9 %: 105,00 + 21,60 + 111,60 + 15,60 = 253,80 € Arbeitnehmeranteil.

### Abgrenzung
Die **Unfallversicherung** ist der einzige Zweig, den der Arbeitgeber allein finanziert; sie deckt Arbeits- und Wegeunfälle sowie Berufskrankheiten.

### Prüfungsfalle
Die Unfallversicherung hälftig rechnen oder den Kinderlosenzuschlag dem Arbeitgeber zuordnen.

### Merksatz
Vier Zweige teilen sich AG und AN, die Unfallversicherung zahlt der Arbeitgeber allein.

Siehe auch: Solidarprinzip · Selbstverwaltung · Beitragsbemessungsgrenze · Summe SV-Arbeitnehmeranteil · Unfallversicherung
Mehr: Deep Dive 14, 1.2

## Spaltenorientierte Speicherung
<!-- id: spaltenorientierte-speicherung · quellen: Karte DD8, DD8 5.3 · stand: 2026-10 -->

Speicherprinzip (Column Store), bei dem die Werte einer Spalte zusammenhängend abgelegt werden – z. B. im Dateiformat Parquet; ideal für analytische Abfragen.

### Erklärung
Analytische Abfragen lesen meist wenige Spalten über sehr viele Zeilen („Summe Umsatz je Monat“). Ein Column Store liest dann nur diese Spalten von der Platte. Weil gleichartige Werte nebeneinander liegen, lassen sie sich stark komprimieren (z. B. wiederholte Filialnamen). Das Schreiben einzelner kompletter Datensätze ist dagegen aufwendiger.

### Beispiel
Die Faktentabelle hat 20 Spalten und 50 Mio. Zeilen. Die Abfrage „Umsatz je Monat“ braucht nur `datum` und `umsatz` – ein Column Store liest also etwa ein Zehntel der Daten, ein Row Store alle 20 Spalten.

### Abgrenzung
| | Zeilenorientiert (Row Store) | Spaltenorientiert (Column Store) |
|---|---|---|
| ideal für | OLTP: ganze Datensätze lesen/schreiben | OLAP: wenige Spalten über viele Zeilen |
| Kompression | gering | hoch |

Nicht verwechseln mit dem **Wide-Column-Store** (z. B. Cassandra), einer NoSQL-Datenbank mit flexiblen Spaltenfamilien.

### Prüfungsfalle
Column Store für das Kassensystem empfehlen – für viele kurze Schreibvorgänge ist der Row Store besser.

### Merksatz
Analyse liest Spalten, Tagesgeschäft schreibt Zeilen.

Siehe auch: Parquet · OLAP · Partitionierung · Data Warehouse
Mehr: Deep Dive 8, 5.3

## Spannweite
<!-- id: spannweite · quellen: Karte DD3, DD3 4.1 · stand: 2026-10 -->

Einfachstes Streuungsmaß: größter minus kleinster Wert, $R = x_{\max} - x_{\min}$.

### Erklärung
Die Spannweite ist schnell berechnet und anschaulich, hängt aber nur von den beiden Extremwerten ab. Ein einziger Ausreißer verändert sie stark, über die Verteilung dazwischen sagt sie nichts. Robuster ist der Interquartilsabstand, aussagekräftiger die Standardabweichung.

### Beispiel
Lieferzeiten in Tagen: 2, 3, 3, 4, 5, 5, 5, 6, 8, 19. Spannweite $19 - 2 = 17$ Tage. Ohne den Ausreißer 19 wären es nur $8 - 2 = 6$ Tage; der IQR liegt bei 3 Tagen.

### Abgrenzung
| Maß | Grundlage | ausreißerempfindlich |
|---|---|---|
| Spannweite | Max und Min | sehr |
| Interquartilsabstand | mittlere 50 % | nein |
| Standardabweichung | alle Werte | ja |

### Prüfungsfalle
Aus einer großen Spannweite auf eine insgesamt starke Streuung schließen – oft steckt nur ein Ausreißer dahinter.

### Merksatz
Zwei Werte bestimmen die Spannweite – ein Ausreißer reicht, um sie zu verzerren.

Siehe auch: Streuungsmaß · Interquartilsabstand (IQR) · Standardabweichung · Ausreißer
Mehr: Deep Dive 3, 4.1

## Sparsam mit Farben
<!-- id: sparsam-mit-farben · quellen: DD11 A2 · stand: 2026-10 -->

Gestaltungsregel für Diagramme: Farbe trägt Bedeutung und dekoriert nicht – meist genügt eine Hervorhebungsfarbe plus Grautöne.

### Erklärung
Jede Farbe lenkt den Blick. Eine Regenbogenpalette lässt alle Elemente gleich wichtig erscheinen und überfordert, besonders bei mehr als fünf Kategorien. Besser: das Wichtige farbig, den Rest grau. Die Farbskala passt zum Datentyp: qualitativ für Kategorien, sequenziell (hell → dunkel) für geordnete Werte, divergierend (zwei Farbtöne mit neutraler Mitte) für Abweichungen, z. B. Ist gegen Plan. Weil rund 8 % der Männer eine Rot-Grün-Schwäche haben, wird Information nie allein über Farbe codiert.

### Beispiel
Im Filialvergleich des Möbelhauses ist nur die Filiale Nord blau hervorgehoben, alle anderen Säulen sind grau – die Botschaft „Nord liegt vorn“ ist sofort klar.

### Abgrenzung
Die Regel gehört zur Data-Ink-Ratio nach Tufte: Alles, was keine Information trägt, ist Chartjunk.

### Prüfungsfalle
Ampelfarben Rot und Grün ohne zusätzliche Kennzeichnung (Symbol, Beschriftung) verwenden – das verletzt die Barrierefreiheit.

### Merksatz
Eine Farbe für die Botschaft, Grau für den Rest.

Siehe auch: Data-Ink-Ratio · Chartjunk · Barrierefreiheit · Sortieren
Mehr: Deep Dive 11, A2

## Speicherbegrenzung
<!-- id: speicherbegrenzung · quellen: Karte DD10, DD10 2.1 · stand: 2026-10 -->

Grundsatz der DSGVO (Art. 5 Abs. 1 lit. e): Personenbezogene Daten dürfen nur so lange in identifizierbarer Form gespeichert werden, wie es für den Zweck erforderlich ist.

### Erklärung
Für jede Datenart braucht es eine Löschfrist, die sich am Zweck oder an gesetzlichen Aufbewahrungspflichten orientiert, und ein Löschkonzept, das sie umsetzt. Ist der Zweck entfallen, wird gelöscht oder anonymisiert. Bestehen Aufbewahrungspflichten, werden die Daten gesperrt (eingeschränkte Verarbeitung) und nach Fristablauf gelöscht. Die Rechenschaftspflicht verlangt, dass das Unternehmen dies nachweisen kann.

### Beispiel
Ein Kunde verlangt nach einem Küchenkauf die Löschung. Newsletter- und Werbedaten löscht das Möbelhaus sofort; die Rechnung ist Buchungsbeleg und wird acht Jahre aufbewahrt (seit 2025, Stand 2026), bis dahin gesperrt und danach gelöscht.

### Abgrenzung
**Datenminimierung** begrenzt, **welche** Daten erhoben werden; **Speicherbegrenzung** begrenzt, **wie lange** sie gespeichert bleiben.

### Prüfungsfalle
Analysedaten „für alle Fälle“ unbegrenzt aufbewahren – nach Projektende braucht es Löschung oder Anonymisierung.

### Merksatz
Zweck erfüllt – Daten weg.

Siehe auch: Datenminimierung · Zweckbindung · DSGVO · Personenbezogene Daten
Mehr: Deep Dive 10, 2.1

## Spezifität
<!-- id: spezifitat · quellen: Karte DD7, DD7 2.2 · stand: 2026-10 -->

Anteil der tatsächlich negativen Fälle, die ein Klassifikationsmodell richtig als negativ erkennt: $\text{Spezifität} = \frac{TN}{TN + FP}$.

### Erklärung
Die Spezifität ist das Gegenstück zum Recall: Der Recall misst, wie viele Positive gefunden werden, die Spezifität, wie gut die Negativen „in Ruhe gelassen“ werden. Daraus folgt die Falsch-Positiv-Rate $\text{FPR} = 1 - \text{Spezifität}$, die auf der x-Achse der ROC-Kurve steht. Bei unausgeglichenen Klassen ist die Spezifität meist hoch und allein wenig aussagekräftig.

### Beispiel
1.000 Aufträge, 900 ohne Reklamation; davon erkennt das Modell 810 richtig (TN) und 90 fälschlich als Reklamation (FP): $\frac{810}{810 + 90} = 90{,}00\ \%$, FPR = 10 %.

### Abgrenzung
| Kennzahl | Formel | Bezug |
|---|---|---|
| Recall (Sensitivität) | TP / (TP + FN) | tatsächlich Positive |
| Spezifität | TN / (TN + FP) | tatsächlich Negative |
| Precision | TP / (TP + FP) | vorhergesagt Positive |

### Prüfungsfalle
Spezifität mit Precision verwechseln – die Spezifität schaut nur auf die tatsächlich negativen Fälle.

### Merksatz
Spezifität: Wie oft schlägt das Modell zu Recht keinen Alarm?

Siehe auch: Recall · Precision · Falsch-Positiv-Rate · Konfusionsmatrix
Mehr: Deep Dive 7, 2.2

## Sprint
<!-- id: sprint · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Scrum-Event fester Länge von höchstens einem Monat (meist 1–4 Wochen), in dem ein nutzbares Inkrement entsteht; er enthält alle anderen Events.

### Erklärung
Ein Sprint beginnt mit dem Sprint Planning und endet mit Sprint Review und Sprint-Retrospektive; dazwischen findet täglich das Daily Scrum statt. Der nächste Sprint beginnt unmittelbar danach. Während des Sprints wird nichts geändert, was das Sprint-Ziel gefährdet; der Umfang kann mit dem Product Owner nachverhandelt werden. Nur der Product Owner kann einen Sprint abbrechen, wenn das Sprint-Ziel hinfällig wird.

### Beispiel
Reporting-Projekt, Sprint 3 (zwei Wochen), Sprint-Ziel: „Der Vertrieb sieht den Tagesumsatz je Filiale.“ Am Ende zeigen die Developers das lauffähige Dashboard im Review.

### Abgrenzung
Ein Sprint ist **zeitlich** begrenzt (Timebox); eine Phase im Wasserfallmodell ist **inhaltlich** begrenzt und endet, wenn ihr Ergebnis fertig ist. Kanban kennt keine Sprints.

### Prüfungsfalle
Sprintlängen über einen Monat nennen oder die Sprintlänge je nach Arbeitsumfang verlängern.

### Merksatz
Fest getaktet, höchstens ein Monat, am Ende ein nutzbares Inkrement.

Siehe auch: Scrum · Sprint Planning · Sprint Review · Sprint Backlog · Daily Scrum
Mehr: Deep Dive 12, Teil 2

## Sprint Backlog
<!-- id: sprint-backlog · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Scrum-Artefakt aus Sprint-Ziel, den dafür ausgewählten Product-Backlog-Einträgen und dem Plan zu ihrer Umsetzung; es gehört den Developers, sein Commitment ist das Sprint-Ziel.

### Erklärung
Das Sprint Backlog entsteht im Sprint Planning und beantwortet „Warum?“ (Sprint-Ziel), „Was?“ (ausgewählte Einträge) und „Wie?“ (Plan, oft als Aufgaben). Die Developers aktualisieren es während des Sprints laufend – es ist ein sichtbares Echtzeitbild ihrer Arbeit, z. B. auf einem Taskboard oder in einem Burndown-Chart.

### Beispiel
Sprint-Ziel „Tagesumsatz je Filiale sichtbar“; Einträge: Kassendaten anbinden, Faktentabelle laden, Dashboard-Seite bauen; Aufgaben: View anlegen, ETL-Job planen, Test mit Filiale Nord.

### Abgrenzung
| Artefakt | Commitment | verantwortet |
|---|---|---|
| Product Backlog | Produktziel | Product Owner |
| Sprint Backlog | Sprint-Ziel | Developers |
| Inkrement | Definition of Done | Scrum Team |

### Prüfungsfalle
Den Product Owner als Eigentümer des Sprint Backlogs nennen – es gehört den Developers.

### Merksatz
Das Sprint Backlog ist der Plan der Developers für genau diesen Sprint.

Siehe auch: Product Backlog · Sprint Planning · Inkrement · Definition of Done
Mehr: Deep Dive 12, Teil 2

## Sprint Planning
<!-- id: sprint-planning · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Scrum-Event zu Beginn jedes Sprints (höchstens 8 Stunden bei einem Ein-Monats-Sprint), in dem das Scrum Team festlegt, warum der Sprint wertvoll ist, was umgesetzt wird und wie.

### Erklärung
Drei Themen: **Warum?** – der Product Owner schlägt vor, wie der Sprint den Produktwert steigert; daraus formuliert das Team das Sprint-Ziel. **Was?** – die Developers wählen Einträge aus dem Product Backlog, die in den Sprint passen. **Wie?** – sie planen die Arbeit bis zum fertigen Inkrement. Ergebnis ist das Sprint Backlog. Bei kürzeren Sprints ist die Timebox meist kürzer.

### Beispiel
Zweiwöchiger Sprint im Reporting-Projekt: In drei Stunden einigt sich das Team auf das Sprint-Ziel „Reklamationsquote je Filiale“ und zerlegt die drei passenden Einträge in Aufgaben.

### Abgrenzung
| Event | Zeitpunkt | max. Timebox (1-Monats-Sprint) |
|---|---|---|
| Sprint Planning | Sprintbeginn | 8 h |
| Daily Scrum | täglich | 15 min |
| Sprint Review | Sprintende | 4 h |
| Sprint-Retrospektive | nach dem Review | 3 h |

### Prüfungsfalle
Den Product Owner die Arbeitsmenge festlegen lassen – wie viel in den Sprint passt, entscheiden die Developers.

### Merksatz
Warum, was, wie – dann geht der Sprint los.

Siehe auch: Sprint · Sprint Backlog · Product Owner · Daily Scrum
Mehr: Deep Dive 12, Teil 2

## Sprint Review
<!-- id: sprint-review · quellen: Karte DD12, DD12 Teil 2 · stand: 2026-10 -->

Scrum-Event am Ende des Sprints (höchstens 4 Stunden bei einem Ein-Monats-Sprint), in dem Scrum Team und Stakeholder das Ergebnis prüfen und das weitere Vorgehen anpassen.

### Erklärung
Die Developers zeigen das Inkrement, die Stakeholder geben Rückmeldung, und gemeinsam wird besprochen, was sich im Umfeld geändert hat. Daraus passt der Product Owner das Product Backlog an. Das Review ist eine Arbeitssitzung zur Überprüfung und Anpassung des Produkts, keine reine Präsentation.

### Beispiel
Nach Sprint 3 zeigt das Team dem Vertriebsleiter das Filial-Dashboard. Er wünscht einen Vorjahresvergleich – der Product Owner nimmt ihn als neuen Eintrag mit hoher Priorität ins Product Backlog auf.

### Abgrenzung
**Sprint Review:** Was haben wir gebaut, und passt es? (Produkt) **Sprint-Retrospektive:** Wie haben wir gearbeitet, und was verbessern wir? (Zusammenarbeit, Prozess, Qualität)

### Prüfungsfalle
Review und Retrospektive vertauschen.

### Merksatz
Review prüft das Produkt, Retrospektive die Arbeitsweise.

Siehe auch: Sprint · Product Backlog · Inkrement · Stakeholder
Mehr: Deep Dive 12, Teil 2

## SQL-Injection
<!-- id: sql-injection · quellen: Karte DD10, DD10 4.5 · stand: 2026-10 -->

Angriff, bei dem ungeprüfte Eingaben in eine SQL-Anweisung eingebaut werden, sodass Angreifer eigenen SQL-Code ausführen – Daten auslesen, ändern oder löschen.

### Erklärung
Die Lücke entsteht, wenn eine Anwendung SQL durch Zusammensetzen von Text baut. Die wirksame Gegenmaßnahme sind **parametrisierte Abfragen** (Prepared Statements): Die Datenbank erhält Befehl und Werte getrennt, Eingaben werden nie als Code interpretiert. Flankierend: Eingabevalidierung (z. B. nur Zahlen für IDs) und minimale Datenbankrechte für das Anwendungskonto.

### Beispiel
Unsicher:
```sql
-- Eingabe im Suchfeld: ' OR '1'='1
SELECT * FROM kunde WHERE name = '' OR '1'='1';
```
Die Bedingung ist immer wahr – alle Kundendaten werden ausgegeben. Sicher (Platzhalter, Wert getrennt übergeben):
```sql
SELECT * FROM kunde WHERE name = ?;
```

### Abgrenzung
**Eingabevalidierung** prüft, ob eine Eingabe plausibel ist; die **Parametrisierung** verhindert, dass sie überhaupt als Code wirkt. Nur Letztere schließt die Lücke zuverlässig.

### Prüfungsfalle
„Anführungszeichen herausfiltern“ als Lösung nennen – Filter lassen sich umgehen.

### Merksatz
Daten nie in den Befehl kleben – immer als Parameter übergeben.

Siehe auch: Security by Design · Härtung · Penetrationstest · Phishing
Mehr: Deep Dive 10, 4.5

## Staatliche Eingriffe
<!-- id: staatliche-eingriffe · quellen: DD14 4.2 · stand: 2026-10 -->

Eingriffe des Staates in die freie Preisbildung, vor allem durch Höchst- und Mindestpreise.

### Erklärung
Ein **Höchstpreis** liegt unter dem Gleichgewichtspreis und schützt Verbraucher. Zu diesem Preis fragen mehr Kunden nach, als angeboten wird – es entsteht ein Nachfrageüberhang mit Knappheit, Wartelisten und Schwarzmärkten. Ein **Mindestpreis** liegt über dem Gleichgewichtspreis und schützt Erzeuger; es entsteht ein Angebotsüberhang, den oft der Staat aufkaufen oder lagern muss. Liegt ein Höchstpreis über bzw. ein Mindestpreis unter dem Gleichgewicht, bleibt er wirkungslos.

### Beispiel
Markt aus Deep Dive 14: Gleichgewicht bei 14 € (650 Stück). Höchstpreis 12 €: Nachfrage 800, Angebot 500 → Nachfrageüberhang 300. Mindestpreis 16 €: Nachfrage 500, Angebot 800 → Angebotsüberhang 300.

### Abgrenzung
Der **Mindestlohn** ist ein Mindestpreis auf dem Arbeitsmarkt (Stand 2026: 13,90 € pro Stunde). Mietpreisbremse und Preisdeckel bei Energie wirken wie Höchstpreise.

### Prüfungsfalle
Höchst- und Mindestpreis über die Wirkung vertauschen: Höchstpreis → Nachfrageüberhang, Mindestpreis → Angebotsüberhang.

### Merksatz
Deckel unten erzeugt Knappheit, Boden oben erzeugt Überschuss.

Siehe auch: Gleichgewichtspreis · Soziale Marktwirtschaft · Marktformen · Mindestlohn
Mehr: Deep Dive 14, 4.2

## Stabiles Sortierverfahren
<!-- id: stabiles-sortierverfahren · quellen: Karte DD11, DD11 B7 · stand: 2026-10 -->

Sortierverfahren, das Elemente mit gleichem Sortierschlüssel in ihrer ursprünglichen Reihenfolge belässt – z. B. Bubble Sort, Insertion Sort und Merge Sort.

### Erklärung
Stabilität spielt eine Rolle, wenn nacheinander nach mehreren Kriterien sortiert wird: Erst nach dem Nebenkriterium sortieren, dann stabil nach dem Hauptkriterium – die Reihenfolge des Nebenkriteriums bleibt innerhalb gleicher Hauptwerte erhalten. Instabil sind Selection Sort und Quicksort, weil sie Elemente über große Abstände tauschen.

### Beispiel
Aufträge nach Datum sortiert: (03.10., Nord), (04.10., Süd), (05.10., Nord). Stabil nach Filiale sortiert: Nord 03.10., Nord 05.10., Süd 04.10. – innerhalb von Nord bleibt die Datumsfolge erhalten.

### Abgrenzung
| Verfahren | stabil |
|---|---|
| Bubble Sort, Insertion Sort, Merge Sort | ja |
| Selection Sort, Quicksort | nein |

Stabilität sagt nichts über die Geschwindigkeit aus.

### Prüfungsfalle
„Stabil“ als „funktioniert zuverlässig“ oder „ist schnell“ deuten.

### Merksatz
Stabil heißt: Gleiche bleiben in ihrer Reihenfolge.

Siehe auch: Bubble Sort · Selection Sort · Merge Sort · Quicksort
Mehr: Deep Dive 11, B7

## Stabliniensystem
<!-- id: stabliniensystem · quellen: Karte DD5, DD5 6.1 · stand: 2026-10 -->

Organisationsform: Einliniensystem, ergänzt um Stabsstellen, die beraten, aber kein Weisungsrecht haben – z. B. Controlling, Recht, Datenschutz.

### Erklärung
Jede Stelle hat weiterhin genau einen Vorgesetzten (klare Linie). Die Stäbe bringen Spezialwissen ein, bereiten Entscheidungen vor und beraten die Leitung, entscheiden aber nicht selbst und erteilen der Linie keine Anweisungen. Vorteil: Fachwissen ohne Bruch der Weisungslinie. Nachteil: Stäbe können nur empfehlen; Konflikte zwischen Stab und Linie sind möglich.

### Beispiel
Der Datenschutzbeauftragte des Möbelhauses ist als Stabsstelle der Geschäftsführung zugeordnet. Er berät die Abteilungen zum neuen Analysesystem, kann der IT aber keine Weisungen erteilen.

### Abgrenzung
| Form | Merkmal |
|---|---|
| Einliniensystem | genau ein Vorgesetzter |
| Stabliniensystem | Einlinie + beratende Stäbe |
| Mehrliniensystem | mehrere fachliche Vorgesetzte |
| Matrixorganisation | Funktion und Projekt/Objekt kreuzen sich |

### Prüfungsfalle
Stäben Weisungsbefugnis zuschreiben.

### Merksatz
Der Stab berät, die Linie entscheidet.

Siehe auch: Einliniensystem · Mehrliniensystem · Matrixorganisation · Organigramm
Mehr: Deep Dive 5, 6.1

## Staging Area
<!-- id: staging-area · quellen: Karte DD8, DD8 Teil 2 · stand: 2026-10 -->

Zwischenspeicher im Data Warehouse, in dem die Rohdaten aus den Quellsystemen unverändert abgelegt werden, bevor sie transformiert werden.

### Erklärung
Der Extraktionsschritt kopiert die Daten schnell in die Staging Area – die Quellsysteme sind danach sofort wieder entlastet. Bereinigung, Vereinheitlichung und Prüfung laufen anschließend auf der Kopie. Schlägt ein Ladelauf fehl, kann man ohne erneuten Zugriff auf die Quelle nachladen, und Abweichungen lassen sich gegen die Rohdaten nachvollziehen.

### Beispiel
Nachts um 2 Uhr werden die Tagesbestellungen aus der Warenwirtschaft und die Kassendaten der Filialen als CSV in die Staging Area kopiert. Der ETL-Prozess vereinheitlicht danach Datumsformate und lädt ins Core-DWH.

### Abgrenzung
| Schicht | Inhalt |
|---|---|
| Staging Area | unveränderte Rohdaten |
| Core-DWH | integriert, historisiert, unternehmensweit |
| Data Mart | fachbereichsbezogener Ausschnitt |

Die **Quarantäne** nimmt fehlerhafte Datensätze auf; die Staging Area enthält alle Rohdaten.

### Prüfungsfalle
In der Staging Area schon bereinigen – dann gehen die Rohdaten für Nachladen und Fehleranalyse verloren.

### Merksatz
Erst roh ablegen, dann veredeln.

Siehe auch: ETL · Data Warehouse · Data Mart · Data Lake
Mehr: Deep Dive 8, Teil 2

## Stakeholder
<!-- id: stakeholder · quellen: Karte DD12, DD12 1.4 · stand: 2026-10 -->

Alle Personen und Gruppen, die von einem Projekt betroffen sind oder es beeinflussen können.

### Erklärung
Stakeholder können intern (Geschäftsführung, Fachbereich, IT, Betriebsrat, Datenschutzbeauftragter) oder extern sein (Kunden, Lieferanten, Dienstleister, Behörden). Sie haben unterschiedliche Interessen und unterschiedlich viel Einfluss – wer sie übersieht, erlebt späten Widerstand, z. B. ein Veto des Betriebsrats kurz vor Go-live. Deshalb gehört eine Stakeholderanalyse an den Projektbeginn.

### Beispiel
Stakeholder des Reporting-Projekts im Möbelhaus: Geschäftsführung (Auftraggeber), Vertriebsleitung (Hauptnutzer), Filialleitungen, IT-Abteilung, Betriebsrat (Leistungs- und Verhaltenskontrolle), Datenschutzbeauftragter, externer BI-Dienstleister.

### Abgrenzung
**Stakeholder** sind alle Betroffenen und Beteiligten; der **Auftraggeber** ist nur einer davon. Im Scrum-Kontext sind Stakeholder z. B. die Teilnehmer am Sprint Review außerhalb des Scrum Teams.

### Prüfungsfalle
Betriebsrat und Datenschutzbeauftragten vergessen, wenn das Projekt Beschäftigtendaten berührt.

### Merksatz
Wer betroffen ist oder Einfluss hat, ist Stakeholder.

Siehe auch: Stakeholderanalyse · Risikomanagement · Lastenheft · Sprint Review
Mehr: Deep Dive 12, 1.4

## Stakeholderanalyse
<!-- id: stakeholderanalyse · quellen: Karte DD12, DD12 1.4 · stand: 2026-10 -->

Methode, Stakeholder zu identifizieren, nach Einfluss und Interesse zu bewerten und daraus eine Einbindungsstrategie abzuleiten.

### Erklärung
Die Einfluss-Interesse-Matrix ergibt vier Felder:

| | geringes Interesse | hohes Interesse |
|---|---|---|
| hoher Einfluss | zufriedenstellen | eng einbinden (Schlüsselakteure) |
| geringer Einfluss | beobachten | informieren |

Aus der Einordnung folgen Maßnahmen: regelmäßige Abstimmungen, Lenkungsausschuss, Newsletter oder nur gelegentliche Information.

### Beispiel
Reporting-Projekt: Vertriebsleitung (hoher Einfluss, hohes Interesse) → eng einbinden, Teilnahme an jedem Review. Betriebsrat (hoher Einfluss, mittleres Interesse) → früh zufriedenstellen, Betriebsvereinbarung abstimmen. Filialmitarbeitende (geringer Einfluss, hohes Interesse) → informieren und schulen.

### Abgrenzung
Die **Stakeholderanalyse** bewertet Personen und Gruppen; die **Risikoanalyse** bewertet Ereignisse nach Wahrscheinlichkeit und Schaden. Ein kritischer Stakeholder kann allerdings selbst ein Risiko sein.

### Prüfungsfalle
Stakeholder nur auflisten, ohne Bewertung und Strategie.

### Merksatz
Wer hat Macht, wer hat Interesse – und wie gehe ich mit ihm um?

Siehe auch: Stakeholder · Risikomanagement · Projektstrukturplan
Mehr: Deep Dive 12, 1.4

## Stammdaten
<!-- id: stammdaten · quellen: Karte DD15, DD9 5.4, DD15 1.1 · stand: 2026-10 -->

Langlebige Grunddaten, die von vielen Prozessen genutzt werden und sich selten ändern – z. B. Kunden, Artikel, Lieferanten, Mitarbeitende.

### Erklärung
Bewegungsdaten (Bestellungen, Buchungen) verweisen auf Stammdaten. Ein Fehler im Kundenstamm wirkt daher in jede Bestellung, Rechnung und Auswertung hinein – Stammdatenqualität hat die größte Hebelwirkung. **Master Data Management** sorgt für eine abgestimmte Version je Stammdatenart (Golden Record): ein führendes System, klare Zuständigkeit (Data Owner, Data Steward) und Dublettenprüfung bei der Neuanlage. Im Data Warehouse werden Stammdaten als Dimensionen historisiert.

### Beispiel
Die Huber GmbH ist im CRM als „Huber GmbH“, in der Warenwirtschaft als „Huber G.m.b.H.“ angelegt. Der Umsatz je Kunde wird dadurch auf zwei Kunden verteilt – bis das MDM beide zu einem Golden Record zusammenführt.

### Abgrenzung
| Datenart | Merkmal | Beispiel |
|---|---|---|
| Stammdaten | langlebig, selten geändert | Kunde, Artikel |
| Bewegungsdaten | entstehen laufend im Prozess | Bestellung, Buchung |
| Metadaten | beschreiben Daten | Herkunft, Format, Verantwortlicher |

### Prüfungsfalle
Den Artikelpreis einer konkreten Bestellung als Stammdatum einordnen – der zum Bestellzeitpunkt gültige Preis gehört zur Bewegung.

### Merksatz
Stammdaten sind das Wer und Was, Bewegungsdaten das Wann und Wie viel.

Siehe auch: Bewegungsdaten · Metadaten · Master Data Management · Dimensionstabelle
Mehr: Deep Dive 9, 5.4 · Deep Dive 15, 1.1

## Standardabweichung
<!-- id: standardabweichung · quellen: Karte DD3, DD3 4.3 · stand: 2026-10 -->

Wurzel aus der Varianz – sie steht in derselben Einheit wie die Daten und ist deshalb direkt interpretierbar.

### Erklärung
Rechenweg: Mittelwert bilden, Abweichungen bilden, quadrieren und summieren, durch n (Grundgesamtheit, σ) bzw. n − 1 (Stichprobe, s) teilen, Wurzel ziehen. Bei annähernder Normalverteilung liegen etwa 68 % der Werte im Bereich Mittelwert ± 1 Standardabweichung, etwa 95 % im Bereich ± 2. In Excel unterscheidet man STABW.N und STABW.S, in SQL STDDEV_POP und STDDEV_SAMP.

### Beispiel
Durchlaufzeiten 2, 4, 5, 6, 8 Tage: Mittelwert 5, Summe der Abweichungsquadrate $9 + 1 + 0 + 1 + 9 = 20$. Grundgesamtheit: $\sigma = \sqrt{\frac{20}{5}} = 2$ Tage. Stichprobe: $s = \sqrt{\frac{20}{4}} = \sqrt{5} \approx 2{,}24$ Tage.

### Abgrenzung
Die **Varianz** ist die quadrierte Hilfsgröße (Tage²); der **Variationskoeffizient** $\frac{\sigma}{\bar{x}}$ macht die Streuung zwischen Datensätzen mit unterschiedlichem Niveau vergleichbar.

### Prüfungsfalle
Nicht angeben, ob durch n oder n − 1 geteilt wurde – die Wahl ist richtig, wenn sie begründet ist.

### Merksatz
Varianz rechnen, Wurzel ziehen, Einheit behalten.

Siehe auch: Varianz · Variationskoeffizient · Stichprobe · Streuungsmaß · Normalverteilung
Mehr: Deep Dive 3, 4.3

## Standardfluss
<!-- id: standardfluss · quellen: Karte DD5, DD5 2.1 · stand: 2026-10 -->

Ausgehender Sequenzfluss eines XOR- oder OR-Gateways (oder einer Aktivität), der mit einem Querstrich markiert ist und genommen wird, wenn keine andere Bedingung zutrifft (Default).

### Erklärung
Der Standardfluss garantiert, dass das Token immer einen Weg findet, auch wenn die Bedingungen der übrigen Pfade nicht vollständig sind. Er trägt selbst keine Bedingung. Je Gateway gibt es höchstens einen Standardfluss.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120" width="300" height="120" role="img" aria-label="XOR-Gateway mit bedingtem Pfad und Standardfluss mit Querstrich">
<defs><marker id="standardfluss-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker></defs>
<polygon points="60,40 85,65 60,90 35,65" class="dg-form"/>
<line x1="52" y1="57" x2="68" y2="73" class="dg-linie"/>
<line x1="68" y1="57" x2="52" y2="73" class="dg-linie"/>
<path d="M85,65 L120,65 L120,30 L190,30" class="dg-linie" marker-end="url(#standardfluss-pfeil)"/>
<text x="150" y="22" text-anchor="middle" class="dg-klein">[Wert über 2.000 €]</text>
<path d="M60,90 L60,100 L190,100" class="dg-linie" marker-end="url(#standardfluss-pfeil)"/>
<line x1="74" y1="94" x2="82" y2="106" class="dg-linie"/>
<text x="130" y="114" text-anchor="middle" class="dg-klein">Standardfluss</text>
<rect x="190" y="15" width="100" height="30" rx="8" class="dg-form"/>
<text x="240" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Freigabe holen</text>
<rect x="190" y="85" width="100" height="30" rx="8" class="dg-form"/>
<text x="240" y="100" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Bestellung senden</text>
</svg>
```

### Beispiel
Bestellung ab 2.000 € → „Freigabe einholen“; in allen anderen Fällen geht es über den Standardfluss direkt zu „Bestellung senden“.

### Abgrenzung
Ein **bedingter Fluss** trägt eine Bedingung; der Standardfluss ist der Rest-Fall. Er ist kein eigener Verbindungstyp, sondern ein markierter Sequenzfluss.

### Prüfungsfalle
Den Querstrich am Gateway-Ausgang als „gesperrten“ Pfad deuten.

### Merksatz
Querstrich heißt: Wenn sonst nichts passt, hier entlang.

Siehe auch: XOR-Gateway · OR-Gateway · Sequenzfluss · Gateway
Mehr: Deep Dive 5, 2.1

## Standardisierung
<!-- id: standardisierung · quellen: Karte DD6, DD6 Teil 5 · stand: 2026-10 -->

z-Transformation eines Merkmals: $z = \frac{x - \bar{x}}{\sigma}$; danach hat es Mittelwert 0 und Standardabweichung 1.

### Erklärung
Der z-Wert gibt an, wie viele Standardabweichungen ein Wert über oder unter dem Mittel liegt. Damit werden Merkmale mit unterschiedlichen Einheiten und Größenordnungen vergleichbar – wichtig für abstandsbasierte Verfahren wie k-Means und k-NN. Die Standardisierung ist weniger ausreißerempfindlich als die Min-Max-Normalisierung. Mittelwert und Standardabweichung stammen nur aus den Trainingsdaten. Ein |z| über 3 gilt oft als Ausreißerhinweis.

### Beispiel
Lieferdauer 7 Tage, Mittelwert 4 Tage, Standardabweichung 1,5 Tage: $z = \frac{7 - 4}{1{,}5} = 2{,}00$ – zwei Standardabweichungen über dem Mittel.

### Abgrenzung
| Verfahren | Ergebnis | Ausreißer |
|---|---|---|
| Min-Max-Normalisierung | Werte zwischen 0 und 1 | empfindlich |
| Standardisierung | Mittel 0, Standardabweichung 1 | weniger empfindlich |

Normalisierung im Datenbankentwurf (Normalformen) ist etwas völlig anderes.

### Prüfungsfalle
Durch die Spannweite statt durch die Standardabweichung teilen – das ist eine andere Skalierung.

### Merksatz
z sagt, wie viele Standardabweichungen ein Wert vom Mittel entfernt ist.

Siehe auch: Skalieren · Min-Max-Normalisierung · Standardabweichung · Normalverteilung
Mehr: Deep Dive 6, Teil 5

## Standardvertragsklauseln
<!-- id: standardvertragsklauseln · quellen: Karte DD10, DD10 2.4 · stand: 2026-10 -->

Von der EU-Kommission vorgegebene Vertragsklauseln (Durchführungsbeschluss (EU) 2021/914), mit denen ein Datentransfer in ein Drittland ohne Angemessenheitsbeschluss abgesichert wird (Art. 46 Abs. 2 lit. c DSGVO).

### Erklärung
Personenbezogene Daten dürfen die EU/den EWR nur verlassen, wenn im Zielland ein angemessenes Schutzniveau besteht – per Angemessenheitsbeschluss (z. B. EU-US Data Privacy Framework für zertifizierte US-Unternehmen) oder über geeignete Garantien. Die Standardvertragsklauseln sind die häufigste Garantie; sie werden unverändert übernommen und je nach Konstellation als Modul gewählt (z. B. Verantwortlicher an Auftragsverarbeiter). Seit dem Schrems-II-Urteil des EuGH (2020) muss der Exporteur zusätzlich prüfen, ob das Recht des Drittlands den Schutz aushebelt (Transfer Impact Assessment), und ggf. Zusatzmaßnahmen wie Verschlüsselung ergreifen.

### Beispiel
Das Möbelhaus lässt Analysen bei einem Cloud-Anbieter mit Rechenzentrum in Indien laufen. Es schließt einen AVV, vereinbart die Standardvertragsklauseln (Modul 2) und dokumentiert die Transferprüfung.

### Abgrenzung
Der **Auftragsverarbeitungsvertrag** (Art. 28) regelt die weisungsgebundene Verarbeitung; die Standardvertragsklauseln regeln den **Drittlandtransfer**. Bei Cloud-Diensten außerhalb des EWR braucht man oft beides.

### Prüfungsfalle
Standardvertragsklauseln selbst umformulieren – Änderungen am Wortlaut nehmen ihnen die Wirkung.

### Merksatz
Kein Angemessenheitsbeschluss? Dann Standardvertragsklauseln plus Transferprüfung.

Siehe auch: DSGVO · Personenbezogene Daten · Datenschutzbeauftragter
Mehr: Deep Dive 10, 2.4

## Star-Schema
<!-- id: star-schema · quellen: Karte DD8, DD8 4.2, DD8 4.3, DD17 3.4 · stand: 2026-10 -->

Datenmodell im Data Warehouse: eine zentrale Faktentabelle mit Kennzahlen und Fremdschlüsseln, sternförmig umgeben von denormalisierten Dimensionstabellen.

### Erklärung
Die **Faktentabelle** enthält messbare Kennzahlen (Menge, Umsatz) und je einen Fremdschlüssel zu jeder Dimension. Die **Dimensionstabellen** beschreiben Wer, Was, Wann, Wo – und sind bewusst denormalisiert: Die Warengruppe steht direkt beim Produkt. Ergebnis: wenige Joins, schnelle Abfragen, für Fachanwender verständlich. Der Preis ist Redundanz in den Dimensionen. Vor dem Entwurf wird die Granularität festgelegt (z. B. eine Zeile je Bestellposition).

### Beispiel
`fakt_verkauf(zeit_id, produkt_id, kunde_id, filial_id, menge, umsatz)` mit den Dimensionen `dim_zeit`, `dim_produkt`, `dim_kunde` und `dim_filiale`. „Umsatz je Warengruppe und Quartal“ braucht genau zwei Joins.

### Abgrenzung
| | Star | Snowflake | Galaxy |
|---|---|---|---|
| Dimensionen | denormalisiert | normalisiert | gemeinsam genutzt |
| Faktentabellen | eine | eine | mehrere |

### Prüfungsfalle
Kennzahlen in die Dimension oder beschreibende Merkmale in die Faktentabelle legen.

### Merksatz
In der Mitte die Zahlen, außen die Beschreibungen.

Siehe auch: Faktentabelle · Dimensionstabelle · Snowflake-Schema · Galaxy-Schema · OLAP
Mehr: Deep Dive 8, 4.2 · Deep Dive 17, 3.4

## Stärke
<!-- id: starke · quellen: DD4 1.1, DD4 Teil 2 · stand: 2026-10 -->

Maß dafür, wie eng zwei Merkmale zusammenhängen: Eine enge Punktwolke im Streudiagramm bedeutet einen starken, eine breit gestreute einen schwachen Zusammenhang.

### Erklärung
Rechnerisch misst der Korrelationskoeffizient r die Stärke eines linearen Zusammenhangs (Betrag von 0 bis 1), das Bestimmtheitsmaß $R^2$ den Anteil der erklärten Streuung. Übliche Einordnung des Betrags: unter 0,2 kein bis sehr schwach, 0,2–0,5 schwach, 0,5–0,8 mittel, ab 0,8 stark – eine Konvention, kein Naturgesetz. Das Vorzeichen gibt die Richtung an, nicht die Stärke.

### Beispiel
Werbebudget und Umsatz im Möbelhaus: r = 0,983, also ein starker positiver Zusammenhang; $R^2 = 0{,}966$ – rund 96,6 % der Umsatzschwankungen erklärt das Budget.

### Abgrenzung
| Merkmal | Frage |
|---|---|
| Richtung | steigend oder fallend? |
| Stärke | wie eng? |
| Form | linear oder gekrümmt? |
| Signifikanz | vermutlich kein Zufall? |

### Prüfungsfalle
r = −0,9 als schwachen Zusammenhang deuten – der Betrag zählt, das Minus zeigt nur die Gegenläufigkeit.

### Merksatz
Je enger die Wolke, desto stärker der Zusammenhang.

Siehe auch: Korrelation · Streudiagramm · Signifikanz · Regressionsgerade
Mehr: Deep Dive 4, 1.1 · Deep Dive 4, Teil 2

## Startereignis
<!-- id: startereignis · quellen: Karte DD5, DD5 2.1, DD17 1.1 · stand: 2026-10 -->

BPMN-Ereignis als Kreis mit dünnem Rand, das einen Prozess auslöst; es hat keinen eingehenden Sequenzfluss.

### Erklärung
Ein Symbol im Kreis zeigt den Auslöser: Umschlag = Nachricht, Uhr = Timer, leer = unbestimmt. Jeder Prozess in einem Pool beginnt mit einem Startereignis; von dort folgt das Token den Sequenzflüssen. Ein Nachrichten-Startereignis darf einen eingehenden Nachrichtenfluss aus einem anderen Pool haben.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 70" width="300" height="70" role="img" aria-label="BPMN-Ereignisse: Start dünn, Zwischen doppelt, Ende dick">
<circle cx="50" cy="30" r="15" class="dg-form"/>
<circle cx="150" cy="30" r="15" class="dg-form"/>
<circle cx="150" cy="30" r="11" class="dg-form"/>
<circle cx="250" cy="30" r="15" class="dg-form dg-dick"/>
<text x="50" y="62" text-anchor="middle" class="dg-klein">Start</text>
<text x="150" y="62" text-anchor="middle" class="dg-klein">Zwischen</text>
<text x="250" y="62" text-anchor="middle" class="dg-klein">Ende</text>
</svg>
```

### Beispiel
Reparaturprozess: Das Startereignis „Reparaturmeldung eingegangen“ (Nachricht) wird durch den Nachrichtenfluss aus dem Pool „Kunde“ ausgelöst.

### Abgrenzung
| Ereignis | Rand | Bedeutung |
|---|---|---|
| Startereignis | dünn | löst aus |
| Zwischenereignis | doppelt | tritt während des Ablaufs ein |
| Endereignis | dick | beendet einen Pfad |

### Prüfungsfalle
Den Startknoten des UML-Aktivitätsdiagramms (gefüllter Kreis) in BPMN verwenden.

### Merksatz
Dünn startet, doppelt wartet, dick endet.

Siehe auch: Endereignis · Zwischenereignis · Sequenzfluss · Startknoten
Mehr: Deep Dive 5, 2.1 · Deep Dive 17, 1.1

## Startknoten
<!-- id: startknoten · quellen: DD17 2.4 · stand: 2026-10 -->

Element im UML-Aktivitätsdiagramm, dargestellt als gefüllter Kreis, an dem der Ablauf beginnt.

### Erklärung
Vom Startknoten führt eine Kante zur ersten Aktion. Er hat keine eingehenden Kanten. Das Gegenstück ist der Endknoten (Kreis mit gefülltem Kreis innen), der die gesamte Aktivität beendet. Dieselben Symbole nutzt das Zustandsdiagramm für Start- und Endzustand.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 60" width="300" height="60" role="img" aria-label="Startknoten, Aktion und Endknoten im Aktivitätsdiagramm">
<defs><marker id="startknoten-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker></defs>
<circle cx="25" cy="30" r="10" class="dg-voll"/>
<line x1="35" y1="30" x2="95" y2="30" class="dg-linie" marker-end="url(#startknoten-pfeil)"/>
<rect x="95" y="12" width="110" height="36" rx="12" class="dg-form"/>
<text x="150" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Auftrag erfassen</text>
<line x1="205" y1="30" x2="259" y2="30" class="dg-linie" marker-end="url(#startknoten-pfeil)"/>
<circle cx="272" cy="30" r="12" class="dg-form"/>
<circle cx="272" cy="30" r="7" class="dg-voll"/>
</svg>
```

### Beispiel
Aktivitätsdiagramm „Bestellung bearbeiten“: Startknoten → „Bestellung prüfen“ → Entscheidungsknoten [verfügbar] / [nicht verfügbar] → … → Endknoten.

### Abgrenzung
Das **Startereignis** in BPMN ist ein Kreis mit dünnem Rand und **nicht** gefüllt; der UML-Startknoten ist gefüllt.

### Prüfungsfalle
Start- und Endknoten verwechseln: gefüllt = Start, Kreis mit Punkt = Ende.

### Merksatz
Voller Punkt startet, Punkt im Ring beendet.

Siehe auch: Endknoten · Aktivitätsdiagramm · Entscheidungsknoten · Startereignis
Mehr: Deep Dive 17, 2.4

## Statische Prüfung
<!-- id: statische-prufung · quellen: Karte DD16, DD16 1.2 · stand: 2026-10 -->

Prüfung, bei der das Prüfobjekt nicht ausgeführt wird – Reviews von Dokumenten, Modellen und Code sowie statische Codeanalyse durch Werkzeuge (Linter).

### Erklärung
Statisch prüfen lassen sich alle Arbeitsergebnisse, auch solche, die gar nicht ausführbar sind: Pflichtenheft, Datenmodell, SQL-Skript, Testkonzept. Reviews reichen von informell (Kollege schaut drüber) über Walkthrough und technisches Review bis zur formalen Inspektion mit Rollen, Checklisten und Protokoll. Linter melden etwa ungenutzte Variablen, unsichere Konstrukte oder Verstöße gegen Programmierrichtlinien. Statische Prüfungen finden Fehler früh und billig.

### Beispiel
Vor dem ersten Lauf liest eine Kollegin das ETL-Skript gegen und bemerkt, dass Brutto- statt Nettobeträge summiert werden – der Fehler wird gefunden, bevor ein falscher Bericht entsteht.

### Abgrenzung
**Dynamische Prüfung** führt das Programm aus und vergleicht Ist- mit Soll-Ergebnis – das ist ein Test. **Analytische** Qualitätssicherung (finden) umfasst beides; **konstruktive** Qualitätssicherung (vermeiden) setzt vorher an, z. B. mit Programmierrichtlinien.

### Prüfungsfalle
Ein Review als Test bezeichnen – beim Review läuft nichts.

### Merksatz
Statisch wird gelesen, dynamisch wird ausgeführt.

Siehe auch: Dynamische Prüfung · Review · Analytische Qualitätssicherung · Konstruktive Qualitätssicherung
Mehr: Deep Dive 16, 1.2

## Steuerbarkeit
<!-- id: steurbarkeit · quellen: Karte DD11, DD11 A5 · stand: 2026-10 -->

Interaktionsprinzip der ISO 9241-110: Der Nutzer bestimmt Ablauf, Richtung und Tempo der Interaktion, bis das Ziel erreicht ist.

### Erklärung
Ein steuerbares System lässt Nutzer Vorgänge unterbrechen, abbrechen, rückgängig machen, Schritte überspringen und die Ansicht nach ihren Bedürfnissen wechseln. Es zwingt nicht in einen starren Ablauf und erzwingt keine Wartezeiten ohne Abbruchmöglichkeit.

### Beispiel
Im Dashboard des Möbelhauses kann der Vertriebsleiter Filter jederzeit zurücksetzen, zwischen Tabelle und Diagramm wechseln und einen laufenden Export über 50.000 Zeilen abbrechen.

### Abgrenzung
| Prinzip | Kernfrage |
|---|---|
| Steuerbarkeit | Bestimme ich Ablauf und Tempo? |
| Aufgabenangemessenheit | Unterstützt es meine Aufgabe ohne Umwege? |
| Robustheit gegen Benutzungsfehler | Werden Fehler verhindert oder leicht korrigiert? |

### Prüfungsfalle
Steuerbarkeit mit Individualisierbarkeit verwechseln – die ist seit der Fassung 2020 kein eigenes Prinzip mehr.

### Merksatz
Der Nutzer führt, das System folgt.

Siehe auch: Selbstbeschreibungsfähigkeit · Erwartungskonformität · Aufgabenangemessenheit · Interaktionsprinzipien
Mehr: Deep Dive 11, A5

## Steuerklassen
<!-- id: steurklassen · quellen: Karte DD14, DD14 1.4 · stand: 2026-10 -->

Einteilung der Arbeitnehmer in sechs Lohnsteuerklassen, nach denen der Arbeitgeber die monatliche Lohnsteuer berechnet (§ 38b EStG).

### Erklärung
| Klasse | Für wen |
|---|---|
| I | Ledige, Geschiedene, dauernd getrennt Lebende |
| II | Alleinerziehende mit Entlastungsbetrag |
| III | Verheiratete mit deutlich höherem Einkommen, Partner in V |
| IV | Verheiratete mit ähnlichem Einkommen (auch mit Faktor) |
| V | Partner zu III |
| VI | zweites und jedes weitere Dienstverhältnis |

Die Steuerklasse beeinflusst nur den monatlichen Abzug, nicht die endgültige Einkommensteuer – die ergibt sich aus der Veranlagung. Die Kombination III/V besteht weiterhin; eine früher geplante Abschaffung zugunsten des Faktorverfahrens wurde nicht beschlossen (Stand 2026).

### Beispiel
Lea (ledig) hat Steuerklasse I. Nimmt sie zusätzlich einen Minijob mit individueller Besteuerung oder eine zweite Teilzeitstelle an, wird die zweite Stelle nach Klasse VI besteuert – sofern der Minijob nicht pauschal versteuert wird.

### Abgrenzung
Die **Steuerklasse** regelt den Lohnsteuerabzug; **Solidaritätszuschlag** und **Kirchensteuer** werden danach von der Lohnsteuer berechnet.

### Prüfungsfalle
Annehmen, Klasse III/V spare insgesamt Steuern – sie verteilt nur den Abzug anders; Nachzahlungen sind möglich.

### Merksatz
I ledig, II allein mit Kind, III/V ungleich, IV/IV gleich, VI Zweitjob.

Siehe auch: Lohnsteuer · Solidaritätszuschlag · Kirchensteuer · Nettoentgelt
Mehr: Deep Dive 14, 1.4

## Stichprobe
<!-- id: stichprobe · quellen: Karte DD3, DD3 4.3 · stand: 2026-10 -->

Ausgewählte Teilmenge der Grundgesamtheit, aus der auf das Ganze geschlossen wird; Varianz und Standardabweichung werden dann mit dem Teiler n − 1 berechnet.

### Erklärung
Eine Stichprobe ist sinnvoll, wenn eine Vollerhebung zu teuer oder unmöglich ist. Damit der Schluss auf die Grundgesamtheit trägt, muss sie **repräsentativ** sein, idealerweise zufällig gezogen. Weil der Stichprobenmittelwert näher an den eigenen Daten liegt als der wahre Mittelwert, würde der Teiler n die Streuung unterschätzen; n − 1 korrigiert das (s² statt σ²).

### Beispiel
Das Möbelhaus befragt 200 von 12.000 Kunden zur Zufriedenheit mit dem Lieferservice. Für Durchlaufzeiten 2, 4, 5, 6, 8 Tage als Stichprobe gilt $s^2 = \frac{20}{4} = 5$ und $s \approx 2{,}24$ Tage.

### Abgrenzung
| | Grundgesamtheit | Stichprobe |
|---|---|---|
| Umfang | alle Elemente | Teilmenge |
| Varianz | σ², Teiler n | s², Teiler n − 1 |
| Excel | VAR.P, STABW.N | VAR.S, STABW.S |

### Prüfungsfalle
Eine Stichprobe aus nur freiwilligen Online-Bewertungen für repräsentativ halten (Selbstselektion).

### Merksatz
Stichprobe heißt: Schluss aufs Ganze – und n − 1 im Nenner.

Siehe auch: Grundgesamtheit · Varianz · Standardabweichung · Stratifizierte Aufteilung
Mehr: Deep Dive 3, 4.3

## STOP-Prinzip
<!-- id: stop-prinzip · quellen: Karte DD14, DD14 5.1 · stand: 2026-10 -->

Rangfolge der Schutzmaßnahmen im Arbeitsschutz: Substitution vor technischen, vor organisatorischen, vor personenbezogenen Maßnahmen.

### Erklärung
Nach der Gefährdungsbeurteilung prüft der Arbeitgeber die Maßnahmen in dieser Reihenfolge (§ 4 ArbSchG: Gefahren an der Quelle bekämpfen, individuelle Schutzmaßnahmen sind nachrangig):
- **S**ubstitution: Gefahr beseitigen oder durch Ungefährlicheres ersetzen
- **T**echnisch: Abschirmung, Absaugung, Schutzgitter
- **O**rganisatorisch: Arbeitszeiten, Unterweisung, Zutrittsregeln
- **P**ersonenbezogen: persönliche Schutzausrüstung, z. B. Handschuhe, Gehörschutz

Erst wenn die höhere Stufe nicht reicht, kommt die nächste dazu.

### Beispiel
Lösemittelhaltiger Möbelkleber in der Werkstatt: lösemittelfreien Kleber verwenden (S); falls nicht möglich, Absaugung einbauen (T); Arbeiten zeitlich begrenzen und unterweisen (O); zuletzt Atemschutzmaske (P).

### Abgrenzung
Das STOP-Prinzip ordnet Maßnahmen; die **Gefährdungsbeurteilung** ermittelt vorher die Gefahren. **Sicherheitszeichen** sind eine ergänzende organisatorische Kennzeichnung.

### Prüfungsfalle
Persönliche Schutzausrüstung als erste Maßnahme nennen – sie ist das letzte Mittel.

### Merksatz
Erst die Gefahr weg, zuletzt die Schutzbrille auf.

Siehe auch: Arbeitsschutz · Gefährdungsbeurteilung · Sicherheitszeichen · Berufsgenossenschaft
Mehr: Deep Dive 14, 5.1

## Stratifizierte Aufteilung
<!-- id: stratifizierte-aufteilung · quellen: Karte DD7, DD7 4.5 · stand: 2026-10 -->

Train-Test-Split oder Kreuzvalidierung, bei der jede Teilmenge denselben Klassenanteil wie der Gesamtbestand erhält – wichtig bei seltenen Klassen.

### Erklärung
Bei einer rein zufälligen Aufteilung kann die seltene Klasse in einer Teilmenge zufällig unter- oder überrepräsentiert sein. Dann misst der Test etwas anderes als die Realität, und die Ergebnisse der Folds der Kreuzvalidierung schwanken stark. Die stratifizierte Aufteilung zieht getrennt je Klasse, sodass die Anteile überall gleich bleiben. Erst danach werden ggf. nur die Trainingsdaten per Over- oder Undersampling ausgeglichen.

### Beispiel
1.000 Aufträge, 10 % reklamiert. Split 80 : 20 stratifiziert: Training 800 Aufträge mit 80 Reklamationen, Test 200 mit 20 Reklamationen. Ohne Stratifizierung könnten im Test zufällig nur 8 Reklamationen landen.

### Abgrenzung
Die **stratifizierte Stichprobe** in der Statistik folgt derselben Idee (Schichten nach Merkmalen); **Oversampling** verändert die Klassenanteile bewusst, die Stratifizierung erhält sie.

### Prüfungsfalle
Erst resamplen und dann aufteilen – richtig ist: stratifiziert aufteilen, dann nur das Training resamplen.

### Merksatz
Jede Teilmenge ein Spiegel des Ganzen.

Siehe auch: Train-Test-Split · Kreuzvalidierung · Unausgeglichene Klassen · SMOTE
Mehr: Deep Dive 7, 4.5

## Streik
<!-- id: streik · quellen: Karte DD13, DD13 5.4 · stand: 2026-10 -->

Gemeinsame, planmäßige Arbeitsniederlegung von Beschäftigten, organisiert von einer Gewerkschaft, um ein tariflich regelbares Ziel durchzusetzen – zulässig erst nach Ende der Friedenspflicht.

### Erklärung
Das Streikrecht folgt aus der Koalitionsfreiheit (Art. 9 Abs. 3 GG). Rechtmäßig ist ein Streik nur, wenn eine Gewerkschaft ihn trägt, er ein tariflich regelbares Ziel verfolgt und verhältnismäßig ist (Ultima Ratio). Politische Streiks sind unzulässig. Typischer Ablauf: Verhandlungen → nach Ende der Friedenspflicht ggf. Warnstreiks → Scheitern → Urabstimmung (meist 75 %) → Streik, ggf. Aussperrung → Schlichtung → Urabstimmung über das Ergebnis → neuer Tarifvertrag. Während des Streiks entfällt der Lohn; Mitglieder erhalten Streikgeld, die Arbeitsagentur zahlt kein Arbeitslosengeld.

### Beispiel
Nach gescheiterten Tarifverhandlungen im Einzelhandel streiken die Verkäuferinnen der Filiale Nord zwei Tage. Das Möbelhaus zahlt für diese Tage kein Entgelt.

### Abgrenzung
**Aussperrung** ist die Gegenmaßnahme der Arbeitgeber; **Warnstreik** ist ein kurzer Streik schon während laufender Verhandlungen nach Ablauf der Friedenspflicht.

### Prüfungsfalle
Einen Streik während der Laufzeit des Tarifvertrags über die dort geregelten Punkte für zulässig halten – die Friedenspflicht verbietet ihn.

### Merksatz
Gewerkschaft, tarifliches Ziel, Friedenspflicht vorbei – dann darf gestreikt werden.

Siehe auch: Friedenspflicht · Aussperrung · Günstigkeitsprinzip
Mehr: Deep Dive 13, 5.4

## Stresstest
<!-- id: stresstest · quellen: Karte DD16, DD16 2.4 · stand: 2026-10 -->

Nicht-funktionaler Test, bei dem die Last bis über die Belastungsgrenze gesteigert wird, um Bruchstelle und Verhalten bei Überlast zu finden.

### Erklärung
Gefragt wird: Ab welcher Last bricht das System ein, wie verhält es sich dann (langsamer, Fehlermeldungen, Absturz, Datenverlust?) und erholt es sich danach wieder? Daraus folgen Kapazitätsplanung, Grenzwerte für Rate Limiting und Notfallmaßnahmen. Ein gutes System verschlechtert sich kontrolliert (z. B. 503 statt Datenverlust).

### Beispiel
Das Reporting-System wird mit 100, 200, 400 und 800 gleichzeitigen Nutzern belastet. Ab 600 Nutzern steigt die Antwortzeit auf über 30 Sekunden, ab 750 bricht der Datenbank-Verbindungspool zusammen; nach Lastende läuft das System wieder normal.

### Abgrenzung
| Testart | Last |
|---|---|
| Lasttest | erwartete Last, Antwortzeit innerhalb der Anforderungen? |
| Stresstest | über die Grenze hinaus, wo und wie bricht es? |
| Smoke-Test | keine Last, startet es überhaupt? |

### Prüfungsfalle
Last- und Stresstest gleichsetzen – der Lasttest bleibt im erwarteten Bereich.

### Merksatz
Lasttest prüft den Alltag, Stresstest sucht den Bruch.

Siehe auch: Lasttest · Smoke-Test · Verfügbarkeit · Systemtest
Mehr: Deep Dive 16, 2.4

## Streudiagramm
<!-- id: streudiagramm · quellen: Karte DD4, DD4 1.1, DD17 6.5 · stand: 2026-10 -->

Punktdiagramm zweier metrischer Merkmale; es zeigt Richtung, Form und Stärke eines Zusammenhangs sowie Ausreißer.

### Erklärung
Die unabhängige Variable (Einflussgröße) steht auf der x-Achse, die abhängige (Zielgröße) auf der y-Achse. Vor jeder Rechnung schaut man auf das Bild: Steigt die Wolke oder fällt sie? Ist sie eng oder breit? Linear oder gekrümmt? Gibt es Punkte weit abseits? Eine Regressionsgerade kann die Prognose ergänzen.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 170" width="260" height="170" role="img" aria-label="Streudiagramm Werbebudget und Umsatz mit Regressionsgerade">
<line x1="35" y1="145" x2="250" y2="145" class="dg-linie"/>
<line x1="35" y1="145" x2="35" y2="10" class="dg-linie"/>
<circle cx="70" cy="115" r="4" class="dg-akzent"/>
<circle cx="105" cy="85" r="4" class="dg-akzent"/>
<circle cx="140" cy="79" r="4" class="dg-akzent"/>
<circle cx="175" cy="49" r="4" class="dg-akzent"/>
<circle cx="210" cy="37" r="4" class="dg-akzent"/>
<line x1="70" y1="111" x2="210" y2="38" class="dg-linie dg-strich"/>
<text x="142" y="162" text-anchor="middle" class="dg-klein">Werbebudget (T€)</text>
<text x="20" y="80" text-anchor="middle" class="dg-klein" transform="rotate(-90 20 80)">Umsatz (T€)</text>
</svg>
```

### Beispiel
Werbebudget 1 bis 5 T€ gegen Umsatz 30 bis 56 T€: Die Punkte liegen eng um eine steigende Gerade – starker positiver Zusammenhang, r = 0,983.

### Abgrenzung
Das **Liniendiagramm** zeigt eine Entwicklung über die Zeit; das **Streudiagramm** den Zusammenhang zweier Merkmale. Das **Histogramm** zeigt die Verteilung eines einzigen Merkmals.

### Prüfungsfalle
Aus r ≈ 0 ohne Blick auf das Diagramm „kein Zusammenhang“ folgern – ein U-förmiger Zusammenhang bleibt unentdeckt.

### Merksatz
Erst das Streudiagramm ansehen, dann rechnen.

Siehe auch: Korrelation · Regressionsgerade · Stärke · Ausreißer
Mehr: Deep Dive 4, 1.1 · Deep Dive 17, 6.5

## Streuungsmaß
<!-- id: streuungsmass · quellen: Karte DD3, DD3 Teil 4 · stand: 2026-10 -->

Kennzahl dafür, wie weit die Werte eines Merkmals auseinanderliegen – Spannweite, Interquartilsabstand, Varianz, Standardabweichung, Variationskoeffizient.

### Erklärung
Zwei Datensätze können denselben Mittelwert haben und völlig verschieden sein. Erst das Streuungsmaß zeigt, wie zuverlässig ein Prozess läuft – oft wichtiger als der Mittelwert selbst.

| Maß | Stärke | Schwäche |
|---|---|---|
| Spannweite | einfach | nur zwei Werte, ausreißeranfällig |
| Interquartilsabstand | robust | ignoriert die Ränder |
| Varianz | nutzt alle Werte | quadrierte Einheit |
| Standardabweichung | gleiche Einheit wie die Daten | ausreißerempfindlich |
| Variationskoeffizient | vergleicht unterschiedliche Niveaus | nur verhältnisskaliert, positives Mittel |

### Beispiel
Team A: Mittel 50 min, σ = 5 min (VK 10 %). Team B: Mittel 100 min, σ = 8 min (VK 8 %). B streut absolut stärker, relativ aber weniger.

### Abgrenzung
**Lagemaße** (Mittelwert, Median, Modus) beschreiben die Mitte, **Streuungsmaße** die Breite der Verteilung. Ein Boxplot zeigt beides.

### Prüfungsfalle
Bei schiefen Daten mit Ausreißern nur die Standardabweichung nennen – der IQR ist dann aussagekräftiger.

### Merksatz
Die Mitte sagt wo, die Streuung sagt wie verlässlich.

Siehe auch: Spannweite · Interquartilsabstand (IQR) · Varianz · Standardabweichung · Variationskoeffizient
Mehr: Deep Dive 3, Teil 4

## Struktogramm
<!-- id: struktogramm · quellen: Karte DD11, DD11 B2, DD17 4.2 · stand: 2026-10 -->

Nassi-Shneiderman-Diagramm nach DIN 66261: blockorientierte Darstellung eines Algorithmus, die strukturierte Programmierung erzwingt – beliebige Sprünge (GOTO) sind nicht darstellbar.

### Erklärung
Der Algorithmus ist ein Rechteck aus ineinander geschachtelten Strukturblöcken; jeder Block hat genau einen Eingang oben und einen Ausgang unten. Sequenz: Rechtecke untereinander. Verzweigung: Kopf mit zwei Diagonalen, Bedingung oben, darunter ja- und nein-Spalte. Kopfgesteuerte Schleife: Bedingung oben, Rumpf eingerückt (L-Form). Fußgesteuerte Schleife: Rumpf oben, Bedingung unten.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 150" width="260" height="150" role="img" aria-label="Struktogramm mit Sequenz, Verzweigung und kopfgesteuerter Schleife">
<rect x="10" y="10" width="240" height="130" class="dg-form"/>
<line x1="10" y1="35" x2="250" y2="35" class="dg-linie"/>
<text x="20" y="23" dominant-baseline="middle" class="dg-klein">summe ← 0</text>
<text x="20" y="48" dominant-baseline="middle" class="dg-klein">FÜR i VON 1 BIS n</text>
<line x1="30" y1="60" x2="250" y2="60" class="dg-linie"/>
<line x1="30" y1="60" x2="30" y2="140" class="dg-linie"/>
<line x1="30" y1="60" x2="140" y2="90" class="dg-linie"/>
<line x1="250" y1="60" x2="140" y2="90" class="dg-linie"/>
<text x="140" y="70" text-anchor="middle" dominant-baseline="middle" class="dg-klein">wert[i] &gt; 0?</text>
<text x="45" y="83" class="dg-klein">ja</text>
<text x="230" y="83" text-anchor="end" class="dg-klein">nein</text>
<line x1="30" y1="90" x2="250" y2="90" class="dg-linie"/>
<line x1="140" y1="90" x2="140" y2="140" class="dg-linie"/>
<text x="85" y="115" text-anchor="middle" dominant-baseline="middle" class="dg-klein">summe ← summe + wert[i]</text>
<text x="195" y="115" text-anchor="middle" dominant-baseline="middle" class="dg-klein">∅</text>
</svg>
```

### Beispiel
Das Bild summiert alle positiven Werte einer Liste: Initialisierung als Sequenz, Zählschleife in L-Form, darin eine Verzweigung mit leerem nein-Zweig (∅).

### Abgrenzung
Der **Programmablaufplan** (DIN 66001) zeigt den Kontrollfluss mit Pfeilen und kann Sprünge darstellen – anschaulicher, aber schnell unübersichtlich.

### Prüfungsfalle
Eine Schleife im Struktogramm mit Rückpfeil zeichnen – Wiederholungen sind eigene Blöcke.

### Merksatz
Blöcke statt Pfeile, Schachteln statt Springen.

Siehe auch: Programmablaufplan · Sequenz · Verzweigung · Kopfgesteuerte Schleife · Fußgesteuerte Schleife
Mehr: Deep Dive 11, B2 · Deep Dive 17, 4.2

## Strukturanalyse
<!-- id: strukturanalyse · quellen: Karte DD10, DD10 5.1 · stand: 2026-10 -->

Erster Schritt im IT-Grundschutz nach BSI-Standard 200-2: Geschäftsprozesse, Anwendungen, IT-Systeme, Räume und Netze des Informationsverbunds erfassen und ihre Abhängigkeiten dokumentieren.

### Erklärung
Ohne vollständige Übersicht lässt sich kein Schutzbedarf bestimmen. Die Strukturanalyse beantwortet: Welche Prozesse gibt es, welche Anwendungen unterstützen sie, auf welchen Systemen laufen diese, in welchen Räumen stehen sie und wie sind sie vernetzt? Ähnliche Objekte werden zu Gruppen zusammengefasst (z. B. alle Kassen-PCs). Ergebnis sind Listen und ein Netzplan als Grundlage für Schutzbedarfsfeststellung und Modellierung.

### Beispiel
Möbelhaus: Prozess „Verkauf“ → Anwendungen Kassensystem und Warenwirtschaft → Kassen-PCs (Gruppe, 40 Stück), Datenbankserver → Serverraum Zentrale → Filialnetz über VPN.

### Abgrenzung
| Schritt | Ergebnis |
|---|---|
| Strukturanalyse | was gibt es? |
| Schutzbedarfsfeststellung | wie schutzbedürftig ist es? |
| Modellierung | welche Bausteine passen? |
| IT-Grundschutz-Check | Soll-Ist-Vergleich der Anforderungen |

Nicht verwechseln mit der Strukturanalyse im Datenmodell oder in der Statistik.

### Prüfungsfalle
Mit der Schutzbedarfsfeststellung beginnen – erst muss der Informationsverbund erfasst sein.

### Merksatz
Erst erfassen, dann bewerten.

Siehe auch: IT-Grundschutz · Schutzbedarfsfeststellung · IT-Grundschutz-Check · BSI
Mehr: Deep Dive 10, 5.1

## Strukturierte Daten
<!-- id: strukturierte-daten · quellen: Karte DD15, DD15 1.1 · stand: 2026-10 -->

Daten mit festem Schema in Tabellenform – jede Zeile hat dieselben Spalten mit festgelegten Datentypen, typisch für relationale Datenbanken.

### Erklärung
Weil Struktur und Datentypen vorab feststehen (Schema-on-Write), lassen sich strukturierte Daten direkt mit SQL filtern, verknüpfen und aggregieren. Constraints wie NOT NULL, UNIQUE oder CHECK sichern die Datenqualität schon beim Speichern. Nachteil: Neue oder wechselnde Attribute erfordern Schemaänderungen.

### Beispiel
Die Kundentabelle des Möbelhauses mit `kunden_id`, `name`, `ort`, `registriert_am`; auch eine CSV-Datei mit fester Kopfzeile ist strukturiert.

### Abgrenzung
| Art | Merkmal | Beispiel |
|---|---|---|
| strukturiert | festes Schema, Tabelle | Kundentabelle, CSV |
| semistrukturiert | selbstbeschreibend, verschachtelt | JSON, XML |
| unstrukturiert | kein Schema | Freitext, Bilder, Audio |

### Prüfungsfalle
Eine Tabelle mit Freitextspalte „Bemerkung“ für unstrukturiert halten – die Tabelle ist strukturiert, nur der Inhalt der Spalte ist unstrukturiert.

### Merksatz
Feste Spalten, feste Typen, direkt per SQL auswertbar.

Siehe auch: Semistrukturierte Daten · Unstrukturierte Daten · Schema-on-Write · Datentypen
Mehr: Deep Dive 15, 1.1

## Summe bilden
<!-- id: summe-bilden · quellen: DD11 B5 · stand: 2026-10 -->

Standardalgorithmus: eine Summenvariable vor der Schleife mit 0 initialisieren und in der Schleife jeden Wert hinzuaddieren.

### Erklärung
Der Akkumulator `summe` sammelt das Zwischenergebnis über alle Durchläufe. Die Initialisierung gehört **vor** die Schleife; steht sie darin, wird die Summe bei jedem Durchlauf zurückgesetzt. Fehlende Werte (NULL) müssen ausdrücklich behandelt werden. Das Muster ist Grundlage für Mittelwert (Summe durch Anzahl, mit Prüfung auf Division durch null) und bedingte Summen.

### Beispiel
```
summe ← 0
FÜR i VON 1 BIS n
    WENN umsatz[i] ≠ NULL DANN
        summe ← summe + umsatz[i]
    ENDE WENN
ENDE FÜR
AUSGABE summe
```
Umsätze 120, 80, NULL, 200 ergeben 400.

### Abgrenzung
**Zählen mit Bedingung** erhöht einen Zähler um 1 statt den Wert zu addieren; **Maximum suchen** initialisiert mit dem ersten Listenelement statt mit 0.

### Prüfungsfalle
`summe ← 0` innerhalb der Schleife – das Ergebnis ist dann nur der letzte Wert.

### Merksatz
Vorher auf null, drinnen aufaddieren, danach ausgeben.

Siehe auch: Pseudocode · Maximum suchen · Wiederholung · Struktogramm
Mehr: Deep Dive 11, B5

## Summe SV-Arbeitnehmeranteil
<!-- id: summe-sv-arbeitnehmeranteil · quellen: DD14 1.4 · stand: 2026-10 -->

Summe der Arbeitnehmeranteile zu Kranken-, Pflege-, Renten- und Arbeitslosenversicherung, die vom Bruttoentgelt abgezogen wird.

### Erklärung
Rechenweg je Zweig: Bruttoentgelt (bis zur Beitragsbemessungsgrenze) mal Arbeitnehmersatz. Sätze 2026: KV 7,3 % + halber Zusatzbeitrag, PV 1,8 % (+ 0,6 % für Kinderlose ab 23), RV 9,3 %, ALV 1,3 % (Stand 2026). Die Unfallversicherung fehlt, weil sie der Arbeitgeber allein trägt. Vor dem Rechnen Alter und Kinderzahl prüfen; bei Azubis bis 325 € monatlich zahlt der Arbeitgeber alles.

### Beispiel
Lea (24, kinderlos), 1.200 € brutto, Zusatzbeitrag 2,9 %:

| Zweig | Satz | Betrag |
|---|---|---|
| KV | (14,6 % + 2,9 %) / 2 = 8,75 % | 105,00 € |
| PV | 1,8 % + 0,6 % = 2,4 % | 28,80 € |
| RV | 9,3 % | 111,60 € |
| ALV | 1,3 % | 15,60 € |
| Summe | 21,75 % | 261,00 € |

Bei Jonas (17) entfällt der Zuschlag: 21,15 % = 253,80 €.

### Abgrenzung
Der SV-Arbeitnehmeranteil bemisst sich am **Brutto**; Lohnsteuer, Solidaritätszuschlag und Kirchensteuer folgen eigenen Regeln. Netto = Brutto − Steuern − SV-Arbeitnehmeranteil.

### Prüfungsfalle
Den Kinderlosenzuschlag halbieren oder bei unter 23-Jährigen ansetzen.

### Merksatz
Vier Zweige, halbe Sätze – der Kinderlosenzuschlag ganz für den Arbeitnehmer.

Siehe auch: Sozialversicherung · Nettoentgelt · Beitragsbemessungsgrenze · Pflegeversicherung
Mehr: Deep Dive 14, 1.4

## Support
<!-- id: support · quellen: Karte DD6, DD6 4.1 · stand: 2026-10 -->

Kennzahl der Assoziationsanalyse: Anteil aller Transaktionen, die A und B gemeinsam enthalten.

### Erklärung
$\text{Support}(A \to B) = \frac{\text{Transaktionen mit A und B}}{\text{alle Transaktionen}}$. Er zeigt, wie häufig eine Regel überhaupt vorkommt und ob sie wirtschaftlich relevant ist. Der Apriori-Algorithmus nutzt einen Mindestsupport, um seltene Kombinationen früh auszusortieren. Der Support ist symmetrisch: A → B und B → A haben denselben Wert.

### Beispiel
Zehn Warenkörbe, vier davon mit Schreibtisch und Bürostuhl: $\text{Support} = \frac{4}{10} = 40\ \%$. Konfidenz S → B $= \frac{0{,}40}{0{,}50} = 80\ \%$, Lift $= \frac{0{,}80}{0{,}60} \approx 1{,}33$.

### Abgrenzung
| Kennzahl | Frage |
|---|---|
| Support | Wie häufig ist die Kombination? |
| Konfidenz | Wie oft folgt B, wenn A vorliegt? (richtungsabhängig) |
| Lift | Wie viel häufiger als zufällig? (symmetrisch) |

### Prüfungsfalle
Support mit Konfidenz verwechseln – der Support teilt durch alle Transaktionen, die Konfidenz nur durch die mit A.

### Merksatz
Support: Wie oft steckt beides zusammen im Korb?

Siehe auch: Konfidenz · Lift · Assoziationsanalyse
Mehr: Deep Dive 6, 4.1

## Support Vector Machine
<!-- id: support-vector-machine · quellen: Karte DD6, DD6 8.3 · stand: 2026-10 -->

Klassifikationsverfahren, das die Trennlinie (allgemein Hyperebene) zwischen zwei Klassen mit dem größten Abstand (Margin) zu den nächstgelegenen Punkten beider Klassen sucht.

### Erklärung
Die Punkte, die direkt am Rand des Abstandsstreifens liegen, heißen **Stützvektoren** (Support Vectors) – nur sie bestimmen die Trennlinie. Ein großer Abstand macht das Modell robust gegenüber neuen Fällen. Sind die Klassen nicht geradlinig trennbar, bildet der **Kernel-Trick** die Daten gedanklich in einen höherdimensionalen Raum ab, in dem eine Trennung möglich wird. SVMs sind stark bei vielen Merkmalen und mittleren Datenmengen, aber schwer zu erklären und brauchen skalierte Merkmale.

### Beispiel
Reklamationsvorhersage aus Lieferdauer und Bestellwert: Die SVM legt die Grenze so, dass der Abstand zu den nächstgelegenen reklamierten und nicht reklamierten Aufträgen maximal ist.

### Abgrenzung
| Verfahren | Prinzip | erklärbar |
|---|---|---|
| Entscheidungsbaum | Schwellenwerte je Merkmal | gut |
| Random Forest | viele Bäume stimmen ab | mäßig |
| k-NN | Mehrheit der Nachbarn | gut |
| SVM | Trennlinie mit maximalem Abstand | schwer |

### Prüfungsfalle
SVM als Clustering-Verfahren einordnen – sie ist überwacht und braucht Labels.

### Merksatz
Die SVM zieht die Grenze mit dem breitesten Sicherheitsabstand.

Siehe auch: Random Forest · K-Nächste-Nachbarn · Skalieren
Mehr: Deep Dive 6, 8.3

## Surrogatschlüssel
<!-- id: surrogatschlussel · quellen: Karte DD2, DD2 1.2, DD8 4.4 · stand: 2026-10 -->

Künstlicher Schlüssel ohne fachliche Bedeutung, z. B. eine fortlaufende ID – stabil und kurz; Gegenstück zum natürlichen, fachlichen Schlüssel.

### Erklärung
Natürliche Schlüssel wie Name, E-Mail oder Kennzeichen können sich ändern, doppelt vorkommen oder fehlen. Ein Surrogatschlüssel ändert sich nie und ist schnell zu verknüpfen. Im Data Warehouse ist er zwingend bei der Historisierung nach **SCD Typ 2**: Der fachliche Schlüssel kommt dann mehrfach vor, jede Version erhält einen eigenen Surrogatschlüssel. Außerdem macht er das DWH unabhängig von Nummernkreisen der Quellsysteme.

### Beispiel
| kunde_sk | kunde_id | ort | gültig_von | gültig_bis |
|---|---|---|---|---|
| 1 | K-1001 | München | 01.01.2024 | 14.05.2026 |
| 2 | K-1001 | Hamburg | 15.05.2026 | 31.12.9999 |

Verkäufe vor dem Umzug verweisen auf `kunde_sk = 1` und bleiben München zugeordnet.

### Abgrenzung
**Natürlicher Schlüssel:** fachlich vorhanden (ISBN, Kfz-Kennzeichen, K-1001). **Surrogatschlüssel:** im System erzeugt (kunde_sk). Beide können nebeneinander existieren; der natürliche bleibt dann oft als UNIQUE-Alternativschlüssel erhalten (im DWH nicht, wegen der Versionen).

### Prüfungsfalle
Surrogatschlüssel und fachlichen Schlüssel gleichsetzen.

### Merksatz
Der Surrogatschlüssel bedeutet nichts – und genau deshalb ändert er sich nie.

Siehe auch: Natürlicher Schlüssel · Primärschlüssel · Schlüsselkandidat · Dimensionstabelle
Mehr: Deep Dive 2, 1.2 · Deep Dive 8, 4.4

## SWOT-Analyse
<!-- id: swot-analyse · quellen: Karte DD5, DD5 6.5 · stand: 2026-10 -->

Strategisches Analyseinstrument, das interne Stärken und Schwächen externen Chancen und Risiken gegenüberstellt und daraus Strategien ableitet.

### Erklärung
| | Chancen (extern) | Risiken (extern) |
|---|---|---|
| Stärken (intern) | SO: Stärken nutzen, um Chancen zu ergreifen | ST: Stärken nutzen, um Risiken abzuwehren |
| Schwächen (intern) | WO: Schwächen abbauen, um Chancen zu nutzen | WT: Schwächen abbauen, um Risiken zu vermeiden |

Intern ist, was das Unternehmen selbst beeinflusst; extern sind Markt, Wettbewerb, Recht und Technik.

### Beispiel
Möbelhaus Nordholz: Stärke – eigener Reparaturservice; Schwäche – veralteter Webshop; Chance – wachsende Nachfrage nach Möbelreparatur statt Neukauf; Risiko – Onlinehändler mit Gratisversand. SO-Strategie: Reparaturservice online buchbar machen und als nachhaltiges Angebot vermarkten.

### Abgrenzung
Die **Portfolioanalyse** (BCG-Matrix) bewertet Produkte nach Marktwachstum und Marktanteil; **Benchmarking** vergleicht Kennzahlen mit einem Vorbild.

### Prüfungsfalle
Interne und externe Faktoren vertauschen – „neuer Wettbewerber“ ist ein Risiko, keine Schwäche.

### Merksatz
Innen Stärken und Schwächen, außen Chancen und Risiken – dann kombinieren.

Siehe auch: Portfolioanalyse · Benchmarking · ABC-Analyse
Mehr: Deep Dive 5, 6.5

## Symmetrische Verschlüsselung
<!-- id: symmetrische-verschlusselung · quellen: Karte DD10, DD10 4.2 · stand: 2026-10 -->

Verschlüsselungsverfahren, bei dem Sender und Empfänger denselben geheimen Schlüssel zum Ver- und Entschlüsseln verwenden – schnell, aber der Schlüssel muss sicher ausgetauscht werden.

Auch: Symmetrisch

### Erklärung
Symmetrische Verfahren wie AES verschlüsseln große Datenmengen effizient, z. B. Festplatten, Backups oder Datenströme. Das Problem ist der **Schlüsselaustausch**: Wer den Schlüssel unterwegs abfängt, kann alles lesen. Außerdem braucht jedes Kommunikationspaar einen eigenen Schlüssel. In der Praxis kombiniert man deshalb: asymmetrisch einen Sitzungsschlüssel vereinbaren, dann symmetrisch verschlüsseln (hybride Verschlüsselung, z. B. TLS).

### Beispiel
Das Möbelhaus verschlüsselt die nächtlichen Backups mit AES-256. Der Schlüssel liegt getrennt vom Backup in einem Schlüsseltresor – ohne ihn ist das Backup unlesbar, auch für Angreifer.

### Abgrenzung
| Verfahren | Schlüssel | Eigenschaft | Beispiel |
|---|---|---|---|
| symmetrisch | ein gemeinsamer | schnell, Austauschproblem | AES |
| asymmetrisch | öffentlicher + privater | löst Austausch, langsam | RSA |
| hybrid | beides kombiniert | Praxisstandard | TLS |

### Prüfungsfalle
Hashing als symmetrische Verschlüsselung bezeichnen – Hashing ist nicht umkehrbar und braucht keinen Schlüssel.

### Merksatz
Ein Schlüssel für beide Richtungen – schnell, aber gut verstecken.

Siehe auch: Asymmetrische Verschlüsselung · Hybride Verschlüsselung · Hashing · Vertraulichkeit
Mehr: Deep Dive 10, 4.2

## Synchrone Nachricht
<!-- id: synchrone-nachricht · quellen: DD17 2.5 · stand: 2026-10 -->

Nachricht im UML-Sequenzdiagramm, dargestellt als durchgezogener Pfeil mit gefüllter Spitze – der Sender wartet, bis die Antwort eintrifft.

### Erklärung
Typisch für Methoden- und API-Aufrufe: Der Aufrufer blockiert, bis der Empfänger fertig ist und mit einer **Antwortnachricht** (gestrichelter Pfeil, offene Spitze) zurückmeldet. Der Aktivierungsbalken des Senders läuft währenddessen weiter.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 110" width="280" height="110" role="img" aria-label="Synchrone Nachricht mit gefüllter Spitze und gestrichelte Antwort">
<defs><marker id="synchrone-nachricht-voll" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" class="dg-voll"/></marker><marker id="synchrone-nachricht-offen" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10" class="dg-linie"/></marker></defs>
<rect x="20" y="5" width="80" height="24" class="dg-form"/>
<text x="60" y="17" text-anchor="middle" dominant-baseline="middle" class="dg-klein">:Filiale</text>
<rect x="180" y="5" width="80" height="24" class="dg-form"/>
<text x="220" y="17" text-anchor="middle" dominant-baseline="middle" class="dg-klein">:API</text>
<line x1="60" y1="29" x2="60" y2="105" class="dg-linie dg-strich"/>
<line x1="220" y1="29" x2="220" y2="105" class="dg-linie dg-strich"/>
<rect x="215" y="45" width="10" height="40" class="dg-grau"/>
<line x1="60" y1="45" x2="215" y2="45" class="dg-linie" marker-end="url(#synchrone-nachricht-voll)"/>
<text x="138" y="38" text-anchor="middle" class="dg-klein">holeAuftrag(5001)</text>
<line x1="215" y1="85" x2="60" y2="85" class="dg-linie dg-strich" marker-end="url(#synchrone-nachricht-offen)"/>
<text x="138" y="78" text-anchor="middle" class="dg-klein">Auftrag (JSON)</text>
</svg>
```

### Beispiel
Die Filiale ruft `holeAuftrag(5001)` an der API auf und wartet; die API antwortet mit dem Auftrag als JSON.

### Abgrenzung
| Nachricht | Darstellung | Sender |
|---|---|---|
| synchron | durchgezogen, gefüllte Spitze | wartet |
| asynchron | durchgezogen, offene Spitze | wartet nicht |
| Antwort | gestrichelt, offene Spitze | – |

### Prüfungsfalle
Gefüllte und offene Spitze vertauschen – die Spitze ist der einzige Unterschied zwischen synchron und asynchron.

### Merksatz
Volle Spitze, volles Warten.

Siehe auch: Asynchrone Nachricht · Antwortnachricht · Sequenzdiagramm · Lebenslinie
Mehr: Deep Dive 17, 2.5

## Systemgrenze
<!-- id: systemgrenze · quellen: DD15 5.1, DD17 2.2 · stand: 2026-10 -->

Rechteck mit dem Systemnamen im UML-Use-Case-Diagramm, das die Anwendungsfälle des Systems umschließt; Akteure stehen außerhalb.

### Erklärung
Die Systemgrenze legt fest, was das System leisten soll und was nicht – eine Abgrenzung wie im Pflichtenheft. Innen liegen die Anwendungsfälle (Ellipsen), außen die Akteure (Personen oder Fremdsysteme), die über Assoziationslinien mit ihnen verbunden sind.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120" width="300" height="120" role="img" aria-label="Use-Case-Diagramm mit Akteur außerhalb der Systemgrenze">
<circle cx="30" cy="35" r="8" class="dg-form"/>
<line x1="30" y1="43" x2="30" y2="68" class="dg-linie"/>
<line x1="16" y1="52" x2="44" y2="52" class="dg-linie"/>
<line x1="30" y1="68" x2="20" y2="85" class="dg-linie"/>
<line x1="30" y1="68" x2="40" y2="85" class="dg-linie"/>
<text x="30" y="100" text-anchor="middle" class="dg-klein">Kunde</text>
<rect x="90" y="10" width="200" height="100" class="dg-form"/>
<text x="190" y="25" text-anchor="middle" class="dg-klein dg-fett">Reparaturportal</text>
<ellipse cx="190" cy="55" rx="75" ry="15" class="dg-form"/>
<text x="190" y="55" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reparatur beauftragen</text>
<ellipse cx="190" cy="90" rx="75" ry="15" class="dg-form"/>
<text x="190" y="90" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Status abfragen</text>
<line x1="44" y1="55" x2="115" y2="55" class="dg-linie"/>
<line x1="44" y1="60" x2="117" y2="88" class="dg-linie"/>
</svg>
```

### Beispiel
Reparaturportal des Möbelhauses: „Reparatur beauftragen“ und „Status abfragen“ liegen innerhalb der Grenze; der Kunde und das externe Zahlungssystem als Akteure außerhalb.

### Abgrenzung
Der **Pool** in BPMN umrahmt einen Teilnehmer eines Geschäftsprozesses; die Systemgrenze umrahmt den Funktionsumfang eines Softwaresystems.

### Prüfungsfalle
Akteure innerhalb der Systemgrenze zeichnen – sie nutzen das System, sie sind nicht Teil davon.

### Merksatz
Drinnen, was das System tut; draußen, wer es nutzt.

Siehe auch: Use-Case-Diagramm · Akteur · Anwendungsfall · Include · Extend
Mehr: Deep Dive 15, 5.1 · Deep Dive 17, 2.2

## Systemtest
<!-- id: systemtest · quellen: Karte DD16, DD16 2.1 · stand: 2026-10 -->

Teststufe, in der das Gesamtsystem in einer produktionsnahen Testumgebung gegen die Anforderungen des Pflichtenhefts geprüft wird – meist durch ein Testteam.

### Erklärung
Nach Komponenten- und Integrationstest wird das vollständige System aus Nutzersicht getestet: funktionale Anforderungen (z. B. Berichte, Exporte) und nicht-funktionale (Antwortzeit, Sicherheit, Bedienbarkeit). Meist kommen Black-Box-Verfahren wie Äquivalenzklassen und Grenzwertanalyse zum Einsatz. Im V-Modell steht er dem Systementwurf gegenüber.

### Beispiel
Das Reporting-System wird mit einer Kopie anonymisierter Produktivdaten getestet: Stimmen die Umsätze je Filiale mit der Buchhaltung überein, lädt jede Seite in höchstens zwei Sekunden, sieht jede Filialleitung nur ihre Filiale?

### Abgrenzung
| Teststufe | Prüft | Grundlage |
|---|---|---|
| Komponententest | einzelne Funktion | technischer Entwurf |
| Integrationstest | Schnittstellen | Architektur |
| Systemtest | Gesamtsystem | Pflichtenheft |
| Abnahmetest | Einsatzeignung, durch den Auftraggeber | Lastenheft |

### Prüfungsfalle
System- und Abnahmetest verwechseln – den Abnahmetest führt der Auftraggeber bzw. Fachbereich durch.

### Merksatz
Systemtest: alles zusammen, gegen das Pflichtenheft.

Siehe auch: Integrationstest · Abnahmetest · Komponententest · V-Modell · Black-Box-Test
Mehr: Deep Dive 16, 2.1

## Ausgelassen
- Schema – Etikett Brutto-Netto-Schema (Inhalt bei Nettoentgelt)
- Scrum im Detail – Abschnittstitel
- Sonderfall Generalisierung/Spezialisierung – Abschnittstitel (Inhalt bei Generalisierung)
