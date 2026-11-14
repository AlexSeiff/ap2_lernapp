# Deep Dive 28: Altklausur-Training Prozessanalyse V
## Lernzettel mit Übungsklausur im IHK-Stil – FIDPA AP2

---

## Prüfungsrelevanz

Eine weitere **Übungsvariante im Stil einer Prüfung „Durchführen einer Prozessanalyse“**: vier Aufgaben mit 23, 27, 23 und 27 Punkten. Texte, Zahlen und Szenario sind neu geschrieben, Aufbau und Niveau folgen der Prüfung. Diese Klausur ist **technischer** als die Deep Dives 18, 21, 22 und 27: ein **Sequenzdiagramm für eine Anmeldung über eine API** (14 P), eine **Zeitbetrachtung** der beteiligten Server, eine **Kapazitätsrechnung** für mobile Geräte, eine **Nutzwertanalyse mit eigener Bewertung**, **Kauf oder Miete** und eine **EPK aus Stichworten** (16 P).

Punkte bringt hier, wer Abläufe **Schritt für Schritt** liest: Wer ruft wen auf, wer wartet auf wen, was passiert im Ja- und im Nein-Fall?

Szenario: **Möbelhaus Nordholz GmbH**, Geschäftsbereich **Nordholz Eventservice** – Mietmöbel und mobile Erfassungsgeräte für Veranstaltungen.

---

# Teil 1 – So ist die Klausur aufgebaut

| Merkmal | Wert |
|---|---|
| Zeit / Punkte | 90 Minuten, 100 Punkte, 4 Aufgaben (23 · 27 · 23 · 27) |
| Aufgabe 1 | Ist-Aufnahme, Gerätemerkmale, Eigenentwicklung oder Fremdvergabe, Qualitätssicherung |
| Aufgabe 2 | Sequenzdiagramm ergänzen, Zeiten ermitteln, Gerätebedarf berechnen, Ausfall absichern |
| Aufgabe 3 | Nutzwertanalyse für drei Angebote, Kauf- und Mietmodell, Kostenvergleich je Monat |
| Aufgabe 4 | EPK der Geräterücknahme, Ursachen und Maßnahmen zu einem Betriebsproblem, Prozessänderung |
| Belegsatz | Notation von Sequenzdiagramm und EPK liegt bei |

---

# Teil 2 – Ist-Aufnahme, Make or Buy, Qualität

## 2.1 Merkmale mobiler Erfassungsgeräte

Bei einer Ist-Aufnahme von Geräten erfasst du Merkmale, die für **Betrieb, Software und Austausch** wichtig sind:

| Merkmal | Warum wichtig? |
|---|---|
| **Betriebssystem und Version** | bestimmt, welche Software läuft und wie lange es Updates gibt |
| **Erfassungstechnik** | Barcode-/QR-Scanner, RFID, NFC, Kartenleser – legt fest, was das Gerät lesen kann |
| **Funkverbindung** | WLAN, Mobilfunk, Bluetooth – bestimmt, wo das Gerät online arbeitet |
| **Akku** | Kapazität, Laufzeit, wechselbar oder fest verbaut |
| **Robustheit** | Schutzart (z. B. IP54 gegen Staub und Spritzwasser), Sturzfestigkeit |
| **Bedienung** | Displaygröße, Touch oder Tasten, mit Handschuhen bedienbar |

## 2.2 Eigenentwicklung oder Fremdvergabe

| | Eigenentwicklung | Fremdvergabe |
|---|---|---|
| **Vorteile** | Know-how bleibt im Haus · genau auf die eigenen Abläufe zugeschnitten · schnelle Änderungen ohne Vertragsverhandlung | Erfahrung des Dienstleisters · eigene IT wird entlastet · Festpreis und Gewährleistung |
| **Nachteile** | bindet eigene Entwickler · Risiko bei fehlender Erfahrung · Wartung dauerhaft im eigenen Team | Abhängigkeit · Know-how außer Haus · Abstimmungsaufwand, Auftragsverarbeitung |

Die Nachteile der einen Seite sind meist die Vorteile der anderen – aber nicht einfach umdrehen, sondern **auf die Situation beziehen**.

## 2.3 Maßnahmen zur Qualitätssicherung von Software

**Konstruktiv** (Fehler vermeiden): Programmierrichtlinien, Pair Programming, versionierte Anforderungen. **Analytisch** (Fehler finden): Code-Review, automatisierte Unit-Tests, Integrationstests mit echten Geräten, Abnahmetest gegen das Lastenheft, Pilotbetrieb. Dazu **organisatorisch**: Versionsverwaltung, Fehlerverfolgung mit Prioritäten, Freigabe nach dem Vier-Augen-Prinzip.

---

# Teil 3 – Sequenzdiagramm einer Anmeldung

## 3.1 Die drei Nachrichtenarten

| Nachricht | Pfeil | Bedeutung |
|---|---|---|
| **synchron** | durchgezogen, gefüllte Spitze | der Sender **wartet** auf die Antwort |
| **Antwort** | gestrichelt, offene Spitze | Rückgabe an den Aufrufer |
| **asynchron** | durchgezogen, offene Spitze | der Sender **wartet nicht** und arbeitet weiter |

Signalwörter: „meldet … zurück“, „gibt … zurück“ → Antwort · „Auf eine Rückmeldung wird nicht gewartet“ → asynchron.

## 3.2 Vorgehen bei „Ergänzen Sie das Sequenzdiagramm“

1. Jeden Satz der Beschreibung in **Sender, Empfänger, Inhalt** zerlegen.
2. Reihenfolge von oben nach unten einhalten – die Zeit läuft nach unten.
3. Zu jeder synchronen Nachricht die **Antwort** suchen. Eine weitergereichte Anfrage (API → Server) wird erst beantwortet, bevor die API selbst antwortet.
4. Beschriftung aus der Schnittstellenbeschreibung übernehmen: Methode und Pfad (`POST /api/…`), Funktionsname mit Klammern, Rückgabewert.

> ❓ **Prüferfrage:** Die API ruft den Abrechnungsserver auf, „ohne auf eine Rückmeldung zu warten“. Was ändert sich im Diagramm?
> *Die Nachricht wird asynchron gezeichnet (offene Pfeilspitze); eine Antwort wird hier nicht eingezeichnet, weil die API nicht darauf wartet. Die API kann dem Gerät sofort den Erfolg melden; fällt der Abrechnungsserver aus, merkt das Gerät davon zunächst nichts.*

## 3.3 Zeiten aus dem Ablauf ableiten

Bei einem synchronen Aufruf **wartet der Aufrufer genau so lange, wie der Aufgerufene insgesamt braucht**:

Wartezeit des Aufrufers = Laufzeit + Wartezeit des Aufgerufenen · Gesamtzeit = eigene Laufzeit + eigene Wartezeit

Beispiel: Die API rechnet 2 ms selbst, der aufgerufene Server braucht 6 ms: $2 + 6$ = **8 ms**

---

# Teil 4 – Kapazität berechnen

Wie viele Geräte braucht eine Veranstaltung? Drei Schritte:

1. **Vorgänge je Gerät** in der verfügbaren Zeit: verfügbare Zeit ÷ Zeit je Vorgang (gleiche Einheit!).
2. **Geräte** = Vorgänge insgesamt ÷ Vorgänge je Gerät – bei mehreren Stationen **je Station** rechnen und aufrunden.
3. **Reserve** aufschlagen und auf ganze Geräte **aufrunden**.

Beispiel: 6.000 Vorgänge in 30 Minuten, 6 Sekunden je Vorgang: $\frac{6.000}{1.800 / 6}$ = **20 Geräte**

---

# Teil 5 – Angebote bewerten: Nutzwert, Kauf oder Miete

## 5.1 Nutzwertanalyse mit eigener Bewertung

In dieser Prüfungsform vergibst du die **Punkte selbst** (1 = schlechteste, 3 = beste Bewertung). Lies jedes Kriterium quer über alle Angebote und vergib die Punkte **im Vergleich**. Dann: Punkte · Faktor = gewichteter Wert, Summe je Angebot = Nutzwert.

Die Gewichte verraten, was dem Unternehmen wichtig ist – dort entscheidet sich das Ergebnis. Die **Begründung** der Entscheidung nennt den Nutzwert **und** die Kriterien, die den Ausschlag geben.

## 5.2 Kauf oder Miete

| | Kauf | Miete |
|---|---|---|
| **Kunde** | auf Dauer meist günstiger · Eigentum, freie Verfügung · keine Vertragsbindung | keine Anschaffungskosten · Service und Verbrauchsmaterial inklusive · immer aktuelle Geräte |
| **Anbieter** | sofortiger Zahlungseingang · kein Ausfall- und Restwertrisiko | laufende, planbare Einnahmen · Kundenbindung |

**Kosten je Monat im Kaufmodell** = Anschaffungspreis ÷ Nutzungsdauer in Monaten + Verbrauchsmaterial je Monat.

---

# Teil 6 – EPK aus Stichworten

- Jede Tätigkeit wird eine **Funktion** (Verb + Objekt), davor und danach steht ein **Ereignis** (Zustand: „Gerät ist geprüft“).
- „Wenn … / wenn nicht …“ → **XOR-Konnektor** nach der prüfenden **Funktion**, danach je Zweig ein Ereignis. Nach einem Ereignis darf kein XOR-Split stehen.
- Laufen zwei Zweige in dieselben Schritte (hier: Funktionstest und Einlagerung), werden sie mit einem **XOR-Join** zusammengeführt statt doppelt gezeichnet.
- Jeder Pfad endet mit einem **Ereignis**.

---

## Die 8 häufigsten Fehler aus Prüfersicht

1. **Gerätemerkmale ohne Bezug** („Farbe“) statt Merkmalen, die für Software und Betrieb zählen.
2. Vor- und Nachteile **einfach gespiegelt**, ohne Bezug zur Situation.
3. Im Sequenzdiagramm die **Antworten vergessen** oder die asynchrone Nachricht mit Antwort gezeichnet.
4. **Wartezeit** der API mit 0 angesetzt, obwohl sie synchron auf den Server wartet.
5. Kapazität: **Sekunden und Stunden gemischt** oder die Reserve vergessen; abgerundet statt aufgerundet.
6. Nutzwert: Punkte **nicht im Vergleich** vergeben oder die Gewichtung nicht multipliziert.
7. Kauf oder Miete: **Anschaffungspreis nicht auf Monate verteilt**.
8. EPK: **XOR nach einem Ereignis**, zwei Funktionen hintereinander oder ein Pfad ohne Endereignis.

---

# Übungsklausur Prozessanalyse V im Stil der Altklausur (100 Punkte, 90 Minuten)

Vier Aufgaben, die sich auf die folgende Ausgangssituation beziehen. Antworte stichwortartig, gib bei Berechnungen den Rechenweg an und halte dich an die geforderte Anzahl der Nennungen. Diagramme zeichnest du auf Papier oder im Editor und bewertest sie danach mit der Checkliste der Musterlösung.

## Ausgangssituation

Der Geschäftsbereich **Nordholz Eventservice** der **Möbelhaus Nordholz GmbH** stattet Messen, Stadtfeste und Konzerte mit Mietmöbeln aus. Zum Angebot gehören **mobile Erfassungsgeräte (MDE-Geräte)** wie Handscanner und Tablets mit Kartenleser, dazu Ladestationen, mobile Etikettendrucker und Verbrauchsmaterial. Veranstalter buchen damit an Ausgabestellen die Ausleihe und Rückgabe von Leihartikeln, etwa Sitzkissen und Liegestühlen. Geräte und Zubehör können gekauft oder gemietet werden. Die Geschäftsleitung will die Abläufe rund um die MDE-Geräte verbessern und richtet dafür das Projekt **„MDE 2.0“** ein. Sie arbeiten in der IT-Abteilung im Projekt mit.

## Block A – Ist-Analyse und Softwarebeschaffung (23 P)

Bei den Kunden sind MDE-Geräte verschiedener Hersteller und Baujahre im Umlauf. Bevor eine einheitliche Software zur Erfassung dieser Hardware beschafft wird, sollen die Geräte aufgenommen werden. Offen ist, ob die Software von der eigenen IT-Abteilung oder von einem externen Softwarehaus erstellt wird.

**A1 (3 P):** *Nennen* Sie **drei** Methoden, die Sie bei der Ist-Aufnahme der MDE-Geräte einsetzen können.

**A2 (6 P):** *Beschreiben* Sie **drei** Eigenschaften oder Merkmale, in denen sich die MDE-Geräte unterscheiden können.

**A3 (8 P):** Für die Initialisierungsphase sollen Sie eine Entscheidungsgrundlage erarbeiten. *Beschreiben* Sie je **zwei** Vor- und **zwei** Nachteile der **Eigenentwicklung** durch die IT-Abteilung.

**A4 (6 P):** Die Geschäftsleitung verlangt hohe Qualitätsstandards. *Beschreiben* Sie **drei** geeignete Maßnahmen, um die Qualität der Erfassungssoftware sicherzustellen.

## Block B – Abrechnung nach Nutzung (27 P)

Die Nutzung der MDE-Geräte soll künftig nach Verbrauch abgerechnet werden („Pay per Use“). Ein Gerät meldet sich bei Inbetriebnahme am Server des Eventservice an; danach wird nach Zeit oder nach Anzahl der Buchungen abgerechnet. Die erfolgreiche Anmeldung läuft so ab:

- Das Gerät sendet Benutzername und Passwort mit einem POST-Request an die zentrale API.
- Die API reicht die Anfrage mit der Funktion `pruefeZugang()` an den Authentifizierungsserver weiter. Dieser prüft die Zugangsdaten und meldet `TRUE` zurück.
- Daraufhin gibt die API dem Gerät ein Token zurück.
- Mit dem Token und seiner Geräte-ID meldet sich das Gerät bei der API für den Einsatz an und startet damit eine Abrechnungssitzung.
- Die API reicht die Geräte-ID mit der Funktion `starteAbrechnung()` an den Abrechnungsserver weiter und meldet dem Gerät die erfolgreiche Anmeldung. Auf eine Rückmeldung des Abrechnungsservers wird nicht gewartet.

**API-Endpunkte**

| Methode | Endpunkt | Beschreibung | Parameter | Body | Antwort |
|---|---|---|---|---|---|
| POST | `/api/login` | erzeugt ein neues Token | – | `{benutzer, passwort}` | 200 – OK, Token im Body |
| POST | `/api/sitzung` | startet eine Abrechnungssitzung | `id` – ID des angemeldeten Geräts | `{token}` | 200 – OK |

**B1 (14 P):** Die Lebenslinien des Sequenzdiagramms sind `:Geraet`, `:API`, `:AuthServer` und `:Abrechnungsserver`. *Ergänzen* Sie das Sequenzdiagramm für die erfolgreiche Anmeldung: *Tragen* Sie alle Nachrichten in der richtigen Reihenfolge mit Art (synchron, asynchron, Antwort) und Beschriftung in die Tabelle *ein*.

| Nr. | von | an | Art | Beschriftung |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |

**B2 (4 P):** Für die Dokumentation sind folgende Zeiten der Token-Erzeugung im Normalbetrieb bekannt. *Ermitteln* Sie die fehlenden Zeiten anhand des beschriebenen Ablaufs und *tragen* Sie sie in die Tabelle *ein*. *Begründen* Sie Ihren Lösungsweg.

| Bezeichnung | Beschreibung | API | AuthServer |
|---|---|---|---|
| t_laufend | Prozess rechnet | 4 ms | 7 ms |
| t_wartend | Prozess wartet | | 0 ms |
| t_token | Gesamtzeit der Token-Erzeugung | | |

> **Formel:** Gesamtzeit = Laufzeit + Wartezeit

**B3 (7 P):** Sie beraten die **Küstenklang Veranstaltungs GmbH**, die für ein Open-Air-Konzert Leih-Sitzkissen ausgibt. Das Konzert ist mit **36.000 Besuchern** ausverkauft; jeder Besucher hat ein Sitzkissen gebucht. Die Ausgabe erfolgt zwischen 18:00 und 19:00 Uhr an **acht Ausgabestellen**. Jede Ausgabe wird mit einem MDE-Gerät gebucht und dauert im Mittel **4 Sekunden**. Je Ausgabestelle können mehrere Geräte eingesetzt werden. *Berechnen* Sie die Anzahl der mindestens benötigten MDE-Geräte, wenn alle Besucher kommen und sich gleichmäßig auf die Ausgabestellen und die Ausgabezeit verteilen. *Planen* Sie insgesamt **10 % Reserve** für defekte Geräte *ein*. Der Lösungsweg ist anzugeben.

> **Formeln:**
> - Vorgänge je Gerät = verfügbare Zeit / Zeit je Vorgang
> - Geräte = Anzahl der Vorgänge / Vorgänge je Gerät
> - Geräte mit Reserve = Geräte · (1 + Reservesatz)

**B4 (2 P):** *Beschreiben* Sie **eine** Maßnahme, die verhindert, dass eine Störung des Authentifizierungsservers die Ausgabe der Sitzkissen verzögert.

## Block C – Etikettendrucker: Angebote und Preismodell (23 P)

Zur Komplettlösung gehören mobile Etikettendrucker. Die Drucker des bisherigen Zulieferers fallen zuletzt häufig aus, deshalb wurden neue Zulieferer angefragt. Nach der Vorauswahl liegen drei Angebote vor. Der Eventservice legt besonderen Wert auf **Nachhaltigkeit** und **Qualität**.

- **Angebot 1:** Hersteller in Vietnam (Lieferung per Seefracht, rund 10.000 km) · Basisservice per E-Mail über den Importeur · kein Umweltzeichen, Lieferkette nicht nachvollziehbar, hoher Stromverbrauch · geringe Qualität (eigener Test und Bewertungen anderer Kunden)
- **Angebot 2:** Hersteller in Polen (EU, rund 900 km) · Vor-Ort-Service mit Austauschgerät inklusive · Gehäuse aus Recyclingkunststoff, Rücknahme alter Akkus, Lieferkette offengelegt, niedriger Stromverbrauch · sehr gute Qualität
- **Angebot 3:** Hersteller in Deutschland (rund 150 km) · kein Service im Preis enthalten · Gehäuse teilweise aus Recyclingmaterial, keine Rücknahme · mittlere Qualität

**C1 (9 P):** *Führen* Sie für die drei Angebote eine Nutzwertanalyse *durch*. *Bewerten* Sie jedes Kriterium mit 1 bis 3 Punkten (3 = beste, 1 = schlechteste Bewertung; jede Punktzahl je Kriterium genau einmal) und *tragen* Sie Punkte, gewichtete Werte und Summen in die Tabelle *ein*.

| Kriterium | Faktor | Angebot 1 Punkte | Angebot 1 Wert | Angebot 2 Punkte | Angebot 2 Wert | Angebot 3 Punkte | Angebot 3 Wert |
|---|---|---|---|---|---|---|---|
| Lieferweg zum Hersteller | 0,15 | | | | | | |
| Service | 0,25 | | | | | | |
| Nachhaltigkeit | 0,30 | | | | | | |
| Qualität | 0,30 | | | | | | |
| Summe | 1,00 | | | | | | |

> **Formeln:**
> - gewichteter Wert = Punkte · Faktor
> - Nutzwert = Summe der gewichteten Werte

**C2 (3 P):** *Entscheiden* Sie sich für ein Angebot und *begründen* Sie Ihre Entscheidung.

**C3 (4 P):** Kunden können die Drucker kaufen oder mieten. *Beschreiben* Sie **zwei** Vorteile des Kaufmodells für den Kunden.

**C4 (2 P):** *Beschreiben* Sie **einen** Vorteil des Kaufmodells für den Nordholz Eventservice.

**C5 (5 P):** Ein Kunde überlegt, einen Etikettendrucker zu kaufen statt zu mieten. Der Drucker kostet **252,00 EUR**, seine Nutzungsdauer wird mit **vier Jahren** angesetzt. Je Monat werden **3.600 Etiketten** gedruckt. Eine Etikettenrolle mit 600 Etiketten kostet **6,50 EUR**, ein Farbband für 1.200 Etiketten **12,00 EUR**. Die Miete beträgt **95,00 EUR** je Monat einschließlich aller Verbrauchsmaterialien. *Berechnen* Sie die Kosten je Monat im Kaufmodell und *entscheiden* Sie auf dieser Grundlage, ob der Kunde kaufen oder mieten sollte.

> **Formel:** Kosten je Monat (Kauf) = Anschaffungspreis / Nutzungsdauer in Monaten + Verbrauchsmaterial je Monat

## Block D – Rücknahme gemieteter Geräte (27 P)

Gemietete MDE-Geräte kommen nach der Veranstaltung zurück in das Servicelager. Ein Mitarbeiter hat die Schritte der Rücknahme in Stichworten festgehalten:

- Gerät trifft im Servicelager ein
- Sichtprüfung
- Wenn kein Mangel festgestellt wurde:
  - Daten löschen, auf Werkseinstellungen zurücksetzen, reinigen
  - Funktionstest
  - Einlagern und im Bestand buchen
- Wenn ein Mangel festgestellt wurde:
  - Fehlerdiagnose in der Werkstatt
  - Reparatur möglich: Ersatzteil bestellen und einbauen; Funktionstest; einlagern und im Bestand buchen
  - Reparatur nicht möglich: Gerät aussondern

**D1 (16 P):** *Erstellen* Sie aus dieser Beschreibung eine **ereignisgesteuerte Prozesskette (EPK)**. Der Anfang ist vorgegeben: Ereignis „Gerät ist eingetroffen“, danach Funktion „Sichtprüfung durchführen“.

**D2 (4 P):** Im laufenden Betrieb beschweren sich Kunden, dass sich die Geräte mitten im Einsatz abschalten und lange geladen werden müssen. Bei der Ausgabe von Leihartikeln kam es dadurch mehrfach zu Staus. *Beschreiben* Sie **zwei** mögliche Ursachen für dieses Problem.

**D3 (4 P):** *Beschreiben* Sie **zwei** Maßnahmen, mit denen dem Problem begegnet werden kann.

**D4 (3 P):** *Erläutern* Sie, an welcher Stelle der Rücknahmeprozess aus D1 geändert werden muss, um das Problem dauerhaft zu lösen.

## Lernziel-Check (am Ende des Themas alles mit Ja beantworten)

- [ ] Ich nenne Methoden der Ist-Aufnahme und beschreibe Merkmale, in denen sich mobile Erfassungsgeräte unterscheiden.
- [ ] Ich beschreibe Vor- und Nachteile von Eigenentwicklung und Fremdvergabe mit Bezug zur Situation.
- [ ] Ich beschreibe konstruktive und analytische Maßnahmen der Software-Qualitätssicherung.
- [ ] Ich ergänze ein Sequenzdiagramm aus einer Ablaufbeschreibung mit synchronen und asynchronen Nachrichten und Antworten.
- [ ] Ich leite Warte- und Gesamtzeiten aus einem synchronen Aufruf ab und begründe sie.
- [ ] Ich berechne den Gerätebedarf aus Menge, Zeit je Vorgang und verfügbarer Zeit mit Reserve.
- [ ] Ich führe eine Nutzwertanalyse mit eigener Punktvergabe durch und begründe die Entscheidung.
- [ ] Ich vergleiche Kauf und Miete je Monat und nenne Vorteile für Kunde und Anbieter.
- [ ] Ich erstelle aus Stichworten eine EPK mit XOR-Verzweigungen und Zusammenführung.
- [ ] Übungsklausur mit ≥ 92 Punkten bestanden.
