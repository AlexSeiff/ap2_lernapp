# Musterlösungen Übungsklausur Altklausur-Training Prozessanalyse (Deep Dive 18)
## Mit Prüferkommentaren zur Punktevergabe

**Selbstbewertung:** Die Lösungen sind **Korrekturhilfen**; andere sach- und fachgerechte Antworten werden gleichwertig bewertet. Zähle bei Nennungen **nur die geforderte Anzahl** – überzählige Antworten zählen nicht. 92+ P = sehr gut.

---

## Block A – Zeiterfassung: Datenschutz und Akzeptanz (22 P)

**A1 (4 P):** Erwartet werden Erläuterungen zu Inhalten wie *(je 2 P pro Maßnahme: Nennung 1 P + Beschreibung 1 P)*:
- Erstellung der **TOM** (technische und organisatorische Maßnahmen): Zugriffskontrolle, Verschlüsselung, Protokollierung, Backup.
- **Schulung und Sensibilisierung** der Mitarbeiter im Umgang mit den Zeitdaten.
- **Verzeichnis von Verarbeitungstätigkeiten** und Festlegung des Zwecks (Lohnabrechnung).
- **Löschkonzept**: Löschfristen für Zeitdaten festlegen und automatisiert einhalten.
- **Datenschutz-Folgenabschätzung** bzw. Einbindung des Datenschutzbeauftragten, **Betriebsvereinbarung**.

*Prüferkommentar: Nur „Datenschutz beachten“ oder „Daten sichern“ ohne Konkretisierung bringt keinen Punkt.*

**A2 (6 P):** Erwartet werden Anforderungen mit Begründung *(je 2 P)*, z. B.:
- **Manipulationsschutz/Datenintegrität:** Zeitstempel werden systemseitig gesetzt und sind nicht nachträglich änderbar; Änderungen werden protokolliert.
- **Eindeutige Authentifizierung:** Chipkarte mit PIN oder Mitarbeiter-ID, damit niemand für andere stempeln kann.
- **Verschlüsselte Datenübertragung** vom Terminal zum Server in Echtzeit.
- **Verfügbarkeit:** Terminals puffern Buchungen bei Netzausfall und gleichen sie später ab.
- **Rollen- und Rechtekonzept:** Nur berechtigte Personen sehen oder korrigieren Zeiten.
- **Schnittstelle zur Lohnabrechnung** ohne manuelle Zwischenschritte.

**A3 (12 P):** *1 P je Befürchtung, 2 P je Gegenmaßnahme.*

| Betroffener | Befürchtungen | Gegenmaßnahmen |
|---|---|---|
| Beschäftigte im Lager | Leistungs- und Verhaltenskontrolle (Pausen, Wege werden ausgewertet) · Fehler bei der Zeiterfassung führen zu Lohnkürzung | Betriebsvereinbarung mit Zweckbindung: Daten dienen nur der Lohnabrechnung, keine personenbezogene Leistungsauswertung · Korrekturverfahren: Beschäftigte können ihre Zeiten einsehen und Korrekturen beantragen |
| Betriebsrat | Das Mitbestimmungsrecht bei technischen Überwachungseinrichtungen (§ 87 Abs. 1 Nr. 6 BetrVG) wird übergangen · unklarer Umfang der gespeicherten Daten | Betriebsrat von Beginn an in Planung und Auswahl einbinden und Betriebsvereinbarung abschließen · Transparente Dokumentation der gespeicherten Daten, Zugriffe und Löschfristen |

*Auch andere Antworten sind möglich. Prüferkommentar: Die Gegenmaßnahme muss die genannte Befürchtung entkräften – „Schulung“ gegen „Überwachungsangst“ erhält keine Punkte.*

---

## Block B – Reklamationsmanagement mit eEPK (25 P)

**B1 (4 P):** *(je 2 P)* Mögliche Vorteile:
- **Eindeutige Dokumentation und Nachverfolgbarkeit:** Jede Reklamation hat Status und Historie, nichts geht verloren.
- **Zeitersparnis durch Automatisierung:** automatische Eingangsbestätigung, Zuweisung und Erinnerungen.
- **Bessere Kommunikation** durch zentrale Plattform statt verteilter E-Mails.
- **Auswertbarkeit:** Reporting über Bearbeitungszeiten, Mängelarten, Häufungen.
- **Wissensdatenbank:** Lösungen werden wiederverwendet.

**B2 (3 P):** *(je 1 P)*

| Konnektor | Welche Ereignisse müssen eintreten? |
|---|---|
| ∧ (UND) | Ereignis 1 **und** Ereignis 2 (beide) |
| ∨ (ODER) | Ereignis 1 **oder** Ereignis 2 **oder** beide (mindestens ein Ereignis) |
| XOR | Ereignis 1 **oder** Ereignis 2 (genau ein Ereignis) |

**B3 (18 P):** *Je Ereignis, Funktion und Objekt 0,5 P (max. 12 P), je Konnektor 1,5 P (max. 6 P).*

```
(E) Reklamation ist eingegangen
        │
      (∧) UND-Split
     ┌───┴─────────────────────────┐
[F] Kunden über Eingang       [F] Sachbearbeiter zuweisen
    informieren                       │
     │                         (E) Sachbearbeiter ist zugewiesen
(E) Kunde ist informiert              │
                               [F] Reklamation im System erfassen  ──►  [Objekt] Reklamationssystem
                                      │
                               (E) Reklamation ist erfasst
                                      │
                               [F] Mangel prüfen  ◄── [Objekt] Produktdokumentation
                                      │
                                    (XOR) Split 1
                            ┌─────────┴──────────┐
              (E) Mangel liegt nicht vor    (E) Mangel liegt vor
                       │                            │
              [F] Ablehnung senden          [F] Reparaturmöglichkeit prüfen
                       │                            │
              (E) Ablehnung ist gesendet          (XOR) Split 2
                       │                    ┌───────┴────────┐
                       │       (E) Reparatur möglich   (E) Reparatur nicht möglich
                       │                    │                  │
                       │       [F] Reparatur beauftragen  [F] Ersatz liefern
                       │                    │                  │
                       │       (E) Reparatur beauftragt   (E) Ersatz ist geliefert
                       │                    │                  │
                       └────────────────────┴──────────────────┘
                                          (XOR) Join
                                               │
                              [F] Reklamation im System schließen ──► [Objekt] Reklamationssystem
                                               │
                              (E) Reklamation ist geschlossen
```

**Elemente der Musterlösung:** 12 Ereignisse, 9 Funktionen, 2 Objekte (= 23 Elemente × 0,5 P, maximal 12 P) und 4 Konnektoren (UND-Split, XOR-Split 1, XOR-Split 2, XOR-Join = 6 P).

*Prüferkommentar – die häufigsten Punktverluste:*
1. **XOR direkt nach einem Ereignis** („Reklamation ist erfasst“ → XOR) – die Entscheidung geht von der Funktion „Mangel prüfen“ aus. → −1,5 P je falschem Konnektor.
2. **Kein Ereignis zwischen zwei Funktionen** (z. B. „Mangel prüfen“ → „Ablehnung senden“) – Ereignis und Funktion müssen sich abwechseln.
3. **Objekte vergessen** oder nur an einer Funktion eingezeichnet. Das Reklamationssystem gehört mindestens an die Funktionen *erfassen* und *schließen*.
4. **Join mit UND** statt XOR: Nur **ein** der drei Zweige läuft; ein UND würde ewig warten (Deadlock).
5. Der Zweig „Kunde ist informiert“ endet bewusst ohne weitere Funktion – er ist ein eigener Abschluss und braucht keinen Join.

---

## Block C – Digitalisierung der Eingangsrechnungen (28 P)

**C1 (6 P):** *2 P je Nachteil (Nennung + Folge)*, z. B.:
- **Zeitaufwand:** Sammeln, Transportieren und Abheften von Papier verlängern die Durchlaufzeit.
- **Fehleranfälligkeit:** Manuelles Übertragen der Rechnungsdaten ins System führt zu Tippfehlern und Nacharbeit.
- **Mangelnde Transparenz:** Der Bearbeitungsstand ist nur an der Mappe erkennbar; Rückfragen sind nötig.
- **Medienbrüche und Mehrfacherfassung:** Daten werden mehrfach erfasst.
- **Schwierige Nachverfolgung:** Rechnungen in Ordnern sind schwer zu finden und nicht auswertbar.

**C2 (18 P):** *2 P je Aktivität, 9 Aktivitäten erwartet.*

| Prozess 1: Eingangsrechnung papiergesteuert | Prozess 2: Eingangsrechnung digital unterstützt |
|---|---|
| **1. Rechnungseingang** – Post öffnen, sortieren, Eingangsdatum stempeln, in Mappe sammeln, in Fachabteilung bringen | scannen die Rechnung mit dem Scanner ein · lassen die Texterkennung (OCR) Rechnungsnummer, Betrag und Lieferant auslesen · prüfen die automatisch erkannten Daten am Bildschirm und korrigieren sie bei Bedarf · das System setzt Eingangsdatum und Zeitstempel automatisch und legt den Vorgang im Workflow ab |
| **2. Sachliche Prüfung** – Rechnung mit Lieferschein vergleichen, Menge und Preis von Hand prüfen, unterschreiben, an Buchhaltung weitergeben | rufen die Rechnung am Bildschirm auf · das System gleicht Rechnung automatisch mit Bestellung und Wareneingang ab und markiert Abweichungen · bestätigen die Prüfung digital oder erfassen eine Beanstandung im System · die Buchhaltung sieht das Ergebnis sofort, kein Transport von Papier nötig |
| **3. Freigabe und Buchung** – Freigabe durch Abteilungsleiter einholen, Daten von Hand ins Buchhaltungssystem übertragen, abheften | bestätigen die Freigabe im System (digitale Freigabe/Signatur) · das System übergibt die geprüften Rechnungsdaten automatisch über die Schnittstelle an das Buchhaltungssystem · prüfen die Buchung auf Vollständigkeit und lösen Zahlung aus · das Dokument wird revisionssicher im Dokumentenmanagementsystem archiviert |

*Auch andere sinnvolle Aktivitäten sind möglich. Prüferkommentar: Die Aktivitäten müssen sich **aus den Hilfsmitteln** ergeben. „Rechnung digital abgeben“ als reine Umbenennung wird nicht gewertet.*

**C3 (4 P):** Mögliches Vorgehen:
- Mit Prozess 1: **Zeit vom Rechnungseingang bis zur Buchung** messen, mit **ausreichend großer Stichprobe** (z. B. 100 Rechnungen) und **Durchschnitt** bilden.
- Prozess 2 einführen (z. B. zunächst in einem Pilotbereich).
- Mit Prozess 2 die gleiche Zeit messen, ebenfalls Stichprobe und Durchschnitt.
- **Vergleichen:** (Ist − Soll) ÷ Ist × 100. Ist die Zeit um **mindestens 30 %** gesunken, wurde das Ziel erreicht.

---

## Block D – Kosten der Kundenhotline (25 P)

**D1 (2 P):** Die Kosten sind in den letzten neun Jahren von 400.000 € (2016) auf 1.000.000 € (2025) gestiegen, das sind **+150 %**.

*Rechnung: (1.000.000 − 400.000) ÷ 400.000 × 100 = 150 %. Bezugsgröße ist der Anfangswert.*

**D2 (8 P):** *Pro Nennung 1 P – Beschreibung 2 P – Schlussfolgerung 2 P = 8 P*

| Kriterium | Beschreibung |
|---|---|
| Fehlende Kostenarten | keine Aufschlüsselung in Personalkosten, Materialkosten, Energiekosten usw. |
| Mengengerüst | nicht erkennbar, wie viele Anrufe pro Jahr bearbeitet wurden; Kosten je Anruf sind unbekannt |
| Wirtschaftliche Entwicklung / Inflation | steigende Anrufzahlen durch Wachstum oder Preissteigerungen können den Anstieg erklären |

Weitere mögliche Kriterien: Grad der Digitalisierung, veränderte Prozesse, Fremdpersonal, Wartungs- und Energiekosten.

**Schlussfolgerung:** Die Grafik ist **nicht aussagekräftig**. Sie kann nicht als Grundlage für die Bewertung der Hotline-Kosten verwendet werden, solange Kostenarten und Mengengerüst fehlen.

**D3a (2 P):**
- 12 Stunden × 4 Mitarbeiter × 2 Standorte = **96 Stunden/Tag** *(1 P)*
- 96 Stunden × 5 Tage × 52 Wochen = **24.960 Stunden/Jahr** *(1 P)*

**D3b (5 P):**
- 24.960 Stunden/Jahr
- + 24.960 × 0,12 = **2.995,2 Stunden** *(Abwesenheit, 1 P)*
- + 96 Stunden/Tag × 30 Tage = **2.880 Stunden** *(Urlaub, 2 P)*
- = **30.835,2 Stunden/Jahr** *(1 P)*

30.835,2 Stunden/Jahr × 58,00 EUR = **1.788.441,60 EUR/Jahr** *(1 P)*

**D3c (4 P):** *Eintragen des Wertes in die Grafik 1 P, Interpretation 3 P*

Der errechnete Wert von rund **1,79 Mio. €** liegt **oberhalb** der Kurve (2025: 1,0 Mio. €).
- Die in der Grafik dargestellte Gesamtsumme ist **unvollständig**: Sie enthält nicht einmal die Personalkosten der beiden Hotline-Standorte.
- Läge der Wert **unterhalb** der Kurve, wären die Personalkosten enthalten; ob die verbleibende Differenz die übrigen Kosten deckt, wäre ohne weitere Daten nicht beurteilbar.

**D4 (4 P):** *(je 1 P)* Erwartet werden Nennungen wie:
- **Arbeitgeberanteile zur Sozialversicherung** (RV, AV, KV, PV, Unfallversicherung),
- **Sonderzahlungen** wie 13. Monatsgehalt, Urlaubsgeld, Weihnachtsgeld,
- **Arbeitskleidung, Schutzausrüstung** oder Arbeitsmittel,
- **freiwillige Sozialleistungen**, z. B. Zuschuss zur Kantine,
- **Lohnfortzahlung** bei Krankheit und Urlaub, **Arbeitsplatz- und Gemeinkosten** (Raum, Energie, IT).

---

## Auswertung

| Block | Punkte | Typischer Fehler |
|---|---|---|
| A | 22 | zu allgemein, Gegenmaßnahme passt nicht |
| B | 25 | Ereignis/Funktion nicht abwechselnd, Objekte fehlen |
| C | 28 | Aktivitäten nur umbenannt, Zielüberprüfung ohne Messung |
| D | 25 | Prozentwert falsch bezogen, Urlaubsstunden mit Teamstunden |
