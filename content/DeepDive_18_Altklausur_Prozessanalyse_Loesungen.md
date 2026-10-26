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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 950" width="760" height="950" role="img" aria-label="EPK Reklamationsbearbeitung: UND-Split nach dem Eingang, XOR-Split nach der Mangelprüfung, zweiter XOR-Split nach der Reparaturprüfung, XOR-Join vor dem Schließen; Reklamationssystem und Produktdokumentation als Informationsobjekte">
<defs><marker id="dd18e-pfeil" viewBox="0 0 10 10" markerWidth="10" markerHeight="10" refX="10" refY="5.0" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5.0 L0,10 z" class="dg-voll"/></marker></defs>
<polygon points="287,12 473,12 487,30 473,48 287,48 273,30" class="dg-rot"/>
<text x="380" y="30" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reklamation ist eingegangen</text>
<line x1="380" y1="48" x2="380" y2="71" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<circle cx="380" cy="86" r="15" class="dg-form"/>
<text x="380" y="86" text-anchor="middle" dominant-baseline="middle" class="dg-fett">∧</text>
<text x="402" y="86" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">UND-Split</text>
<line x1="380" y1="101" x2="380" y2="124" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<path d="M365,86 H130 V124" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<rect x="23" y="124" width="214" height="36" rx="10" class="dg-gut"/>
<text x="130" y="142" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Kunden über Eingang informieren</text>
<rect x="273" y="124" width="214" height="36" rx="10" class="dg-gut"/>
<text x="380" y="142" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Sachbearbeiter zuweisen</text>
<line x1="130" y1="160" x2="130" y2="180" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<line x1="380" y1="160" x2="380" y2="180" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<polygon points="37,180 223,180 237,198 223,216 37,216 23,198" class="dg-rot"/>
<text x="130" y="198" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Kunde ist informiert</text>
<polygon points="287,180 473,180 487,198 473,216 287,216 273,198" class="dg-rot"/>
<text x="380" y="198" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Sachbearbeiter ist zugewiesen</text>
<line x1="380" y1="216" x2="380" y2="236" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<rect x="273" y="236" width="214" height="36" rx="10" class="dg-gut"/>
<text x="380" y="254" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reklamation im System erfassen</text>
<line x1="487" y1="254" x2="545" y2="254" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<rect x="545" y="237" width="170" height="34" class="dg-akzent"/>
<text x="630" y="254" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reklamationssystem</text>
<line x1="380" y1="272" x2="380" y2="292" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<polygon points="287,292 473,292 487,310 473,328 287,328 273,310" class="dg-rot"/>
<text x="380" y="310" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reklamation ist erfasst</text>
<line x1="380" y1="328" x2="380" y2="348" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<rect x="273" y="348" width="214" height="36" rx="10" class="dg-gut"/>
<text x="380" y="366" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Mangel prüfen</text>
<rect x="545" y="349" width="170" height="34" class="dg-akzent"/>
<text x="630" y="366" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Produktdokumentation</text>
<line x1="545" y1="366" x2="487" y2="366" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<line x1="380" y1="384" x2="380" y2="407" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<circle cx="380" cy="422" r="15" class="dg-form"/>
<text x="380" y="422" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">XOR</text>
<text x="402" y="422" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Split 1</text>
<line x1="380" y1="437" x2="380" y2="460" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<path d="M365,422 H130 V460" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<polygon points="37,460 223,460 237,478 223,496 37,496 23,478" class="dg-rot"/>
<text x="130" y="478" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Mangel liegt nicht vor</text>
<polygon points="287,460 473,460 487,478 473,496 287,496 273,478" class="dg-rot"/>
<text x="380" y="478" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Mangel liegt vor</text>
<line x1="130" y1="496" x2="130" y2="516" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<line x1="380" y1="496" x2="380" y2="516" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<rect x="23" y="516" width="214" height="36" rx="10" class="dg-gut"/>
<text x="130" y="534" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ablehnung senden</text>
<rect x="273" y="516" width="214" height="36" rx="10" class="dg-gut"/>
<text x="380" y="534" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reparaturmöglichkeit prüfen</text>
<line x1="130" y1="552" x2="130" y2="572" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<line x1="380" y1="552" x2="380" y2="575" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<polygon points="37,572 223,572 237,590 223,608 37,608 23,590" class="dg-rot"/>
<text x="130" y="590" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ablehnung ist gesendet</text>
<circle cx="380" cy="590" r="15" class="dg-form"/>
<text x="380" y="590" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">XOR</text>
<text x="358" y="590" text-anchor="end" dominant-baseline="middle" class="dg-klein dg-leise">Split 2</text>
<line x1="380" y1="605" x2="380" y2="628" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<path d="M395,590 H630 V628" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<polygon points="287,628 473,628 487,646 473,664 287,664 273,646" class="dg-rot"/>
<text x="380" y="646" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reparatur möglich</text>
<polygon points="537,628 723,628 737,646 723,664 537,664 523,646" class="dg-rot"/>
<text x="630" y="646" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reparatur nicht möglich</text>
<line x1="380" y1="664" x2="380" y2="684" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<line x1="630" y1="664" x2="630" y2="684" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<rect x="273" y="684" width="214" height="36" rx="10" class="dg-gut"/>
<text x="380" y="702" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reparatur beauftragen</text>
<rect x="523" y="684" width="214" height="36" rx="10" class="dg-gut"/>
<text x="630" y="702" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ersatz liefern</text>
<line x1="380" y1="720" x2="380" y2="740" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<line x1="630" y1="720" x2="630" y2="740" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<polygon points="287,740 473,740 487,758 473,776 287,776 273,758" class="dg-rot"/>
<text x="380" y="758" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reparatur beauftragt</text>
<polygon points="537,740 723,740 737,758 723,776 537,776 523,758" class="dg-rot"/>
<text x="630" y="758" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Ersatz ist geliefert</text>
<line x1="380" y1="776" x2="380" y2="799" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<path d="M630,776 V814 H395" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<path d="M130,608 V814 H365" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<circle cx="380" cy="814" r="15" class="dg-form"/>
<text x="380" y="814" text-anchor="middle" dominant-baseline="middle" class="dg-klein dg-fett">XOR</text>
<text x="392" y="838" text-anchor="start" dominant-baseline="middle" class="dg-klein dg-leise">Join</text>
<line x1="380" y1="829" x2="380" y2="852" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<rect x="273" y="852" width="214" height="36" rx="10" class="dg-gut"/>
<text x="380" y="870" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reklamation im System schließen</text>
<line x1="487" y1="870" x2="545" y2="870" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<rect x="545" y="853" width="170" height="34" class="dg-akzent"/>
<text x="630" y="870" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reklamationssystem</text>
<line x1="380" y1="888" x2="380" y2="908" class="dg-linie" marker-end="url(#dd18e-pfeil)"/>
<polygon points="287,908 473,908 487,926 473,944 287,944 273,926" class="dg-rot"/>
<text x="380" y="926" text-anchor="middle" dominant-baseline="middle" class="dg-klein">Reklamation ist geschlossen</text>
</svg>
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
