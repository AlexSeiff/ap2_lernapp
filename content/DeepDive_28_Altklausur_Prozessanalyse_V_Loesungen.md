# Musterlösungen Übungsklausur Altklausur-Training Prozessanalyse V (Deep Dive 28)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen** wie im echten Lösungsschlüssel – andere sach- und fachgerechte Antworten zählen gleichwertig. Bewerte nur so viele Nennungen, wie verlangt sind. Diagramme bewertest du mit der Checkliste. 92+ P = sehr gut.

---

## Block A – Ist-Analyse und Softwarebeschaffung (23 P)

**A1 (3 P):** *(je Methode 1 P)* Dokumentenanalyse (Lieferscheine, Inventarlisten, Datenblätter) · Interview mit Kunden und Servicetechnikern · Fragebogen an die Kunden · Beobachtung im Einsatz · automatisches Auslesen der Geräte (Inventarisierungssoftware) · Workshop mit dem Serviceteam.

**A2 (6 P):** *(je Merkmal 1 P Nennung, 1 P Beschreibung)*, z. B.:
- **Betriebssystem und Version:** Android, Windows oder herstellereigenes System – bestimmt, welche Software lauffähig ist und ob es noch Sicherheitsupdates gibt.
- **Erfassungstechnik:** Barcode- oder QR-Scanner, RFID/NFC-Leser, Kartenleser – legt fest, welche Kennzeichnungen und Zahlungsmittel das Gerät verarbeiten kann.
- **Funkverbindung:** WLAN, Mobilfunk oder nur Bluetooth – entscheidet, ob das Gerät auf einem Festgelände ohne WLAN online arbeiten kann.
- **Akku:** Kapazität und Laufzeit, wechselbar oder fest verbaut – bestimmt die Einsatzdauer ohne Ladepause.
- **Robustheit:** Schutzart gegen Staub und Wasser, Sturzfestigkeit – wichtig für den Einsatz im Freien.
- **Bedienung:** Displaygröße, Touchscreen oder Tastatur.

*Prüferkommentar: Merkmale ohne Bedeutung für Betrieb oder Software („Gehäusefarbe“) bringen keinen Punkt.*

**A3 (8 P):** *(je Vor- und Nachteil 2 P)*

Vorteile der Eigenentwicklung:
- **Know-how bleibt im Haus:** Die IT-Abteilung kennt den Code und kann ihn selbst warten und erweitern.
- **Passgenau:** Die Software wird genau auf die Abläufe des Eventservice und die vorhandenen Gerätetypen zugeschnitten.
- **Kurze Wege:** Änderungen werden ohne Angebot, Vertrag und Abstimmung mit einem Dritten umgesetzt; keine Abhängigkeit von einem Softwarehaus.

Nachteile der Eigenentwicklung:
- **Kapazität:** Die Entwickler fehlen in anderen Projekten und im Tagesgeschäft.
- **Fehlende Erfahrung:** Ohne Routine mit Gerätesoftware steigen Termin- und Qualitätsrisiko; es gibt keinen Festpreis und keine Gewährleistung eines Lieferanten.
- **Dauerhafte Verpflichtung:** Wartung, Updates und Support bleiben für die gesamte Nutzungsdauer im eigenen Team.

*Prüferkommentar: Gefragt ist die **Eigenentwicklung**. Wer die Vor- und Nachteile der Fremdvergabe aufschreibt, hat die Aufgabe gespiegelt beantwortet und erhält höchstens die Hälfte der Punkte.*

**A4 (6 P):** *(je Maßnahme 2 P: Nennung + Wirkung)*, z. B.:
- **Code-Reviews / Vier-Augen-Prinzip:** Jede Änderung wird von einer zweiten Person geprüft; Fehler und unklare Stellen fallen vor dem Test auf.
- **Automatisierte Tests** (Unit- und Regressionstests) bei jeder Änderung: Bestehende Funktionen bleiben nachweislich intakt.
- **Integrationstests mit allen Gerätetypen:** Zeigt, ob die Software mit jedem Scanner und Kartenleser aus der Ist-Aufnahme arbeitet.
- **Abnahmetest gegen das Lastenheft** mit festgelegten Kriterien und **Pilotbetrieb** bei einer kleinen Veranstaltung.
- **Programmierrichtlinien, Versionsverwaltung und Fehlerverfolgung** mit Prioritäten.

---

## Block B – Abrechnung nach Nutzung (27 P)

**B1 (14 P):** *(je Zeile 2 P: Sender und Empfänger 1 P, Art und Beschriftung 1 P)*

| Nr. | von | an | Art | Beschriftung |
|---|---|---|---|---|
| 1 | :Geraet | :API | synchron | POST /api/login {benutzer, passwort} |
| 2 | :API | :AuthServer | synchron | pruefeZugang(benutzer, passwort) |
| 3 | :AuthServer | :API | Antwort | TRUE |
| 4 | :API | :Geraet | Antwort | 200 – OK, Token |
| 5 | :Geraet | :API | synchron | POST /api/sitzung?id=… {token} |
| 6 | :API | :Abrechnungsserver | asynchron | starteAbrechnung(id) |
| 7 | :API | :Geraet | Antwort | 200 – OK |

*Prüferkommentar: Zeile 6 ist die einzige asynchrone Nachricht; eine Antwort wird nicht eingezeichnet – „auf eine Rückmeldung wird nicht gewartet“. Häufige Fehler: Das Gerät spricht den AuthServer direkt an (es kennt nur die API), oder die Antwort `TRUE` fehlt, sodass die API das Token ohne Prüfung zurückgibt.*

**B2 (4 P):** *(je Wert 1 P, Begründung 1 P)*

| Bezeichnung | Beschreibung | API | AuthServer |
|---|---|---|---|
| t_laufend | Prozess rechnet | 4 ms | 7 ms |
| t_wartend | Prozess wartet | 7 ms | 0 ms |
| t_token | Gesamtzeit der Token-Erzeugung | 11 ms | 7 ms |

Begründung: Die API ruft den AuthServer **synchron** auf und wartet, bis dieser fertig ist – ihre Wartezeit entspricht der Gesamtzeit des AuthServers.

- AuthServer gesamt: $7 + 0$ = **7 ms**
- API wartend = Gesamtzeit des AuthServers = **7 ms**
- API gesamt: $4 + 7$ = **11 ms**

**B3 (7 P):** *(Vorgänge je Gerät 2 P, Geräte je Ausgabestelle 2 P, Geräte gesamt 1 P, Reserve mit Aufrunden 2 P)*

- Vorgänge je Gerät in einer Stunde: $\frac{3.600\ \text{s}}{4\ \text{s}}$ = **900 Ausgaben**
- Besucher je Ausgabestelle: $\frac{36.000}{8} = 4.500$
- Geräte je Ausgabestelle: $\frac{4.500}{900}$ = **5 Geräte**
- Geräte ohne Reserve: $8 \cdot 5$ = **40 Geräte**
- Mit 10 % Reserve: $40 \cdot 1{,}1$ = **44 Geräte**

Antwort: Es werden mindestens **44 MDE-Geräte** benötigt, davon vier als Reserve.

*Prüferkommentar: Die Ausgabezeit in Sekunden umrechnen (1 h = 3.600 s). Ergibt die Reserve keine ganze Zahl, wird aufgerundet – ein halbes Gerät gibt es nicht.*

**B4 (2 P):** *(Maßnahme 1 P, Wirkung 1 P)*, z. B.: Die Geräte melden sich **vor Beginn der Ausgabe** an und behalten ihr Token für die Dauer der Veranstaltung – während der Ausgabe ist dann kein Zugriff auf den AuthServer nötig. Ebenfalls richtig: **redundanter zweiter AuthServer** mit automatischer Umschaltung (Failover) · Offline-Modus, in dem das Gerät Buchungen zwischenspeichert und später überträgt.

---

## Block C – Etikettendrucker: Angebote und Preismodell (23 P)

**C1 (9 P):** *(Punkte je Angebot nachvollziehbar vergeben je 1 P, gewichtete Werte je Angebot 1 P, Summen je 1 P)*

| Kriterium | Faktor | Angebot 1 Punkte | Angebot 1 Wert | Angebot 2 Punkte | Angebot 2 Wert | Angebot 3 Punkte | Angebot 3 Wert |
|---|---|---|---|---|---|---|---|
| Lieferweg zum Hersteller | 0,15 | 1 | 0,15 | 2 | 0,30 | 3 | 0,45 |
| Service | 0,25 | 2 | 0,50 | 3 | 0,75 | 1 | 0,25 |
| Nachhaltigkeit | 0,30 | 1 | 0,30 | 3 | 0,90 | 2 | 0,60 |
| Qualität | 0,30 | 1 | 0,30 | 3 | 0,90 | 2 | 0,60 |
| Summe | 1,00 | | 1,25 | | 2,85 | | 1,90 |

- Angebot 1: $1 \cdot 0{,}15 + 2 \cdot 0{,}25 + 1 \cdot 0{,}30 + 1 \cdot 0{,}30$ = **1,25**
- Angebot 2: $2 \cdot 0{,}15 + 3 \cdot 0{,}25 + 3 \cdot 0{,}30 + 3 \cdot 0{,}30$ = **2,85**
- Angebot 3: $3 \cdot 0{,}15 + 1 \cdot 0{,}25 + 2 \cdot 0{,}30 + 2 \cdot 0{,}30$ = **1,90**

*Prüferkommentar: Die Punkte werden im Vergleich vergeben – je Kriterium das beste Angebot 3, das schlechteste 1. Eine abweichende, begründbare Bewertung wird akzeptiert, wenn danach richtig gerechnet wurde (Folgefehler).*

**C2 (3 P):** *(Entscheidung 1 P, Begründung 2 P)* **Angebot 2** – es erreicht mit 2,85 den höchsten Nutzwert und liegt in den beiden am stärksten gewichteten Kriterien **Nachhaltigkeit** und **Qualität** vorn, auf die der Eventservice besonderen Wert legt. Der Vor-Ort-Service mit Austauschgerät verringert zudem Ausfälle bei Veranstaltungen. Der etwas längere Lieferweg gegenüber Angebot 3 fällt bei einem Faktor von 0,15 kaum ins Gewicht.

**C3 (4 P):** *(je Vorteil 2 P)*, z. B.:
- **Auf Dauer günstiger:** Nach der Anschaffung fallen nur noch Verbrauchsmaterialien an, keine laufende Miete.
- **Eigentum und freie Verfügung:** Der Kunde kann den Drucker beliebig lange und an jedem Ort nutzen, verändern oder weiterverkaufen.
- **Keine Vertragsbindung:** Keine Mindestlaufzeit, keine Kündigungsfristen, freie Wahl beim Verbrauchsmaterial.

**C4 (2 P):** Der Eventservice erhält den **Kaufpreis sofort** (Liquidität) und trägt **kein Risiko** für Ausfall, Beschädigung oder Wertverlust des Geräts; Rücknahme, Prüfung und Lagerung entfallen.

**C5 (5 P):** *(Abschreibung je Monat 1 P, Etiketten 1 P, Farbband 1 P, Summe 1 P, Entscheidung 1 P)*

- Anschaffung je Monat: $\frac{252{,}00}{48}$ = **5,25 €**
- Etikettenrollen: $\frac{3.600}{600} = 6$ Rollen, $6 \cdot 6{,}50$ = **39,00 €**
- Farbbänder: $\frac{3.600}{1.200} = 3$ Bänder, $3 \cdot 12{,}00$ = **36,00 €**
- Kosten je Monat im Kaufmodell: $5{,}25 + 39{,}00 + 36{,}00$ = **80,25 €**

Entscheidung: Der Kunde sollte **kaufen** – das Kaufmodell ist je Monat $95{,}00 - 80{,}25$ = **14,75 €** günstiger als die Miete. Bei höherem Druckvolumen kann die Pauschalmiete günstiger werden, weil das Verbrauchsmaterial enthalten ist.

*Prüferkommentar: Vier Jahre sind 48 Monate. Wer den Kaufpreis nicht verteilt, vergleicht 327 € mit 95 € und kommt zum falschen Ergebnis.*

---

## Block D – Rücknahme gemieteter Geräte (27 P)

**D1 (16 P):** Erwartete Elemente der EPK:

| Element | P |
|---|---|
| Ereignis „Gerät ist eingetroffen“ und Funktion „Sichtprüfung durchführen“ (vorgegeben) richtig fortgesetzt | 1 |
| **XOR-Split** nach der Sichtprüfung mit den Ereignissen „Kein Mangel festgestellt“ / „Mangel festgestellt“ | 2 |
| Funktion „Daten löschen, zurücksetzen und reinigen“ mit Folgeereignis „Gerät ist zurückgesetzt“ | 2 |
| Funktion „Fehlerdiagnose in der Werkstatt durchführen“ | 1 |
| **XOR-Split** nach der Diagnose mit den Ereignissen „Reparatur möglich“ / „Reparatur nicht möglich“ | 2 |
| Funktion „Ersatzteil bestellen und einbauen“ mit Folgeereignis „Gerät ist repariert“ | 2 |
| Funktion „Gerät aussondern“ und Endereignis „Gerät ist ausgesondert“ | 1 |
| **XOR-Join** der Zweige „zurückgesetzt“ und „repariert“ vor dem Funktionstest | 2 |
| Funktion „Funktionstest durchführen“ mit Ereignis „Funktionstest bestanden“ | 1 |
| Funktion „Gerät einlagern und im Bestand buchen“ und Endereignis „Gerät ist eingelagert“ | 1 |
| Ereignisse und Funktionen wechseln sich durchgehend ab; Kontrollfluss vollständig | 1 |

Ablauf in Textform: (E) Gerät ist eingetroffen → (F) Sichtprüfung durchführen → XOR → (E) Kein Mangel festgestellt → (F) Daten löschen, zurücksetzen und reinigen → (E) Gerät ist zurückgesetzt → XOR-Join · (E) Mangel festgestellt → (F) Fehlerdiagnose durchführen → XOR → (E) Reparatur möglich → (F) Ersatzteil bestellen und einbauen → (E) Gerät ist repariert → XOR-Join · (E) Reparatur nicht möglich → (F) Gerät aussondern → (E) Gerät ist ausgesondert. Nach dem XOR-Join: (F) Funktionstest durchführen → (E) Funktionstest bestanden → (F) Gerät einlagern und im Bestand buchen → (E) Gerät ist eingelagert.

*Prüferkommentar: Wer Funktionstest und Einlagerung in beiden Zweigen getrennt zeichnet, erhält die Punkte ebenfalls, wenn jeder Zweig mit einem Ereignis endet. Eine XOR-Verzweigung direkt nach einem Ereignis oder zwei Funktionen ohne Ereignis dazwischen kosten je einen Punkt. Ein XOR-Join darf die Ereignisse „zurückgesetzt“ und „repariert“ zusammenführen. Der Fall „Funktionstest nicht bestanden“ steht nicht in der Beschreibung und ist nicht verlangt.*

**D2 (4 P):** *(je Ursache 2 P)*, z. B.:
- **Gealterte Akkus:** Nach vielen Ladezyklen ist die Kapazität deutlich gesunken; die Laufzeit reicht nicht mehr für eine ganze Veranstaltung.
- **Geräte werden nicht voll geladen ausgegeben:** Bei der Rücknahme wird der Ladezustand nicht geprüft, die Geräte lagern teilentladen und entladen sich weiter.
- **Hoher Verbrauch im Einsatz:** Dauerbetrieb von Scanner, Display auf voller Helligkeit und Funk; schwaches WLAN erhöht die Sendeleistung.
- **Keine Lademöglichkeit vor Ort:** Zu wenige Ladestationen oder keine Wechselakkus an den Ausgabestellen.

**D3 (4 P):** *(je Maßnahme 2 P)*, z. B.:
- **Akkuzustand regelmäßig messen** und Akkus unter einer festgelegten Restkapazität (z. B. 80 %) austauschen.
- **Geräte nur voll geladen ausliefern** und **Wechselakkus oder Ladestationen** in ausreichender Zahl mitgeben.
- **Energieeinstellungen anpassen** (Displayhelligkeit, Standby) und den Kunden eine **Warnung bei niedrigem Ladestand** anzeigen.
- **Reservegeräte** je Ausgabestelle bereitstellen.

**D4 (3 P):** *(Stelle 2 P, Begründung 1 P)* Im Rücknahmeprozess muss **vor dem Einlagern** – beim oder direkt nach dem Funktionstest – eine Funktion „**Akkuzustand prüfen und Akku laden bzw. tauschen**“ ergänzt werden, mit einer XOR-Verzweigung „Akku in Ordnung“ / „Akku zu schwach“. So gelangen nur Geräte mit geprüftem und geladenem Akku in den Bestand, und schwache Akkus werden aussortiert, bevor sie im Einsatz ausfallen.

*Prüferkommentar: Die Sichtprüfung erkennt einen gealterten Akku nicht. „Besser aufpassen“ ist keine Prozessänderung – verlangt ist ein konkreter zusätzlicher Schritt an einer benannten Stelle.*
