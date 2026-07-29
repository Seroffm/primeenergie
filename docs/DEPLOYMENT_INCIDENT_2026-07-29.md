# Deployment-Incident vom 29.07.2026

## Status

- **Incident:** Produktionsseite teilweise bzw. vollständig ohne sichtbaren Inhalt
- **Betroffene Seite:** `https://project-gqhfy.vercel.app`
- **Status:** Behoben durch Rollback
- **Stabiler Vercel-Stand:** `energie-l375rp3sq-parkenvsgmbh-cybers-projects.vercel.app`
- **Stabiler Quellcode-Stand:** `e9560016cc8cbba587b556371b0c0af992565ba2`
- **Rollback-Commit auf `main`:** `648dceeb44d0ff0dd1d28da5693dc68e6582556a`

## Kurzfassung

Die beschädigte Produktionsseite entstand nicht durch eine einzelne normale UI-Änderung, sondern durch den verwendeten Deployment-Weg. Mehrere Produktionen wurden mit lokal unter Windows erzeugten Vercel-Artefakten und `vercel deploy --prebuilt --prod` veröffentlicht.

Diese vorgebauten Artefakte verhielten sich in der Produktion nicht wie ein regulärer Vercel-Build unter Linux:

- Bei zwei Deployments fehlten notwendige Vite-/Supabase-Umgebungsvariablen, sodass die Anwendung gar nicht geladen werden konnte.
- Bei einem späteren Deployment wurde das HTML ausgeliefert, das erzeugte Stylesheet war im Browser jedoch nicht als verwendbare CSS-Regeln verfügbar.
- Ein anschließender Versuch, kritische Styles direkt in das HTML einzubauen, stellte CSS teilweise wieder her, ließ aber durch fehlende bzw. fehlerhafte JavaScript-Hydration unsichtbare Framer-Motion-Container mit `opacity: 0` zurück.

Die Seite wurde deshalb auf den letzten nachweislich funktionierenden, von Vercel selbst gebauten Stand zurückgesetzt. Der stabile Stand lädt wieder vollständiges HTML, JavaScript und 103 CSS-Regeln.

## Auswirkungen

- Wesentliche Inhalte der Startseite waren nicht sichtbar.
- Zeitweise erschien nur eine allgemeine Fehlermeldung.
- Navigation, Animationen und interaktive Komponenten waren nicht zuverlässig benutzbar.
- Nach dem Inline-CSS-Versuch blieben animierte Inhaltsbereiche unsichtbar.
- Die nach dem stabilen Stand vorgenommenen Optimierungen mussten beim Rollback zunächst zurückgenommen werden.

## Beobachtete Symptome

| Symptom | Technischer Befund |
|---|---|
| „This page didn’t load“ | Erforderliche `VITE_SUPABASE_*`-Variablen fehlten in lokal erzeugten Artefakten. |
| Seite war fast vollständig ungestylt | Das Stylesheet antwortete zwar mit HTTP 200 und `text/css`, erschien im Browser aber mit `0` CSSOM-Regeln. |
| Inhalt blieb trotz Inline-CSS unsichtbar | JavaScript/Hydration war nicht zuverlässig aktiv; Framer-Motion-Wrapper blieben bei `opacity: 0`. |
| Cache-Busting änderte nichts | Auch das neu benannte Stylesheet hatte im Browser `0` Regeln. Ein normaler Browser-Cache war daher nicht die Ursache. |
| Rollback funktionierte sofort | Der ältere, direkt auf Vercel gebaute Stand lud CSS, JavaScript und den vollständigen Seiteninhalt korrekt. |

## Ursache

### Bestätigte Hauptursache

Der Produktionsfehler wurde durch das Veröffentlichen lokal unter Windows erzeugter `.vercel/output`-Artefakte mit `--prebuilt` ausgelöst. Dieser Build- und Deployment-Weg war nicht mit dem funktionierenden Remote-Build auf Vercel gleichwertig.

Der funktionierende Vercel-Build benötigte ungefähr 37 Sekunden. Die problematischen Prebuilt-Deployments benötigten nur ungefähr 8 Sekunden, weil Vercel den Quellcode nicht selbst neu gebaut hat.

### Bestätigte Teilursachen

- Eine lokale `.env.local` wurde im Zuge der Vercel-Arbeiten überschrieben bzw. enthielt nicht alle für den Frontend-Build benötigten Variablen.
- `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` müssen bereits während des Vite-Builds verfügbar sein.
- Ein Build kann HTTP 200 liefern und trotzdem visuell defekt sein. Ein reiner Erreichbarkeitstest reicht nicht aus.
- Der Inline-CSS-Workaround behandelte nur das sichtbare CSS-Symptom, nicht die fehlende bzw. fehlerhafte JavaScript-Ausführung.

### Wahrscheinlicher technischer Hintergrund

Die lokal unter Windows erzeugte Kombination aus Vite 7.3.5, Tailwind CSS 4.3.1 und `@tailwindcss/vite` 4.3.1 erzeugte andere Produktionsartefakte als der Vercel/Linux-Build. Die genaue interne Ursache innerhalb dieser Toolchain ist nicht abschließend bewiesen. Operativ ist jedoch eindeutig nachgewiesen, dass der lokale Prebuilt-Pfad fehlschlug und der Remote-Build funktionierte.

### Nicht die Ursache

- Das neue CSS-Dateinamen-Hashing bzw. der Browser-Cache
- Das Logo
- Eine einzelne responsive CSS-Klasse
- Ein Ausfall der Produktionsdomain
- Ein genereller Vercel-Ausfall

## Fehlerhafte Gegenmaßnahmen, die nicht wiederhergestellt werden dürfen

| Commit | Maßnahme | Ergebnis |
|---|---|---|
| `99baddd` | Stylesheet-Cache-Busting | Behob den Fehler nicht; das neue Stylesheet hatte weiterhin `0` CSSOM-Regeln. |
| `37f73f8` | Kritische Styles direkt in HTML eingebaut | Verschlechterte die sichtbare Seite, weil animierte Container ohne funktionierende Hydration unsichtbar blieben. |

Diese beiden Commits dürfen nicht erneut auf den Produktionsstand übernommen werden.

## Lösung und Rollback

1. Der letzte nachweislich funktionierende Vercel-Remote-Build wurde identifiziert.
2. Die Produktionsdomain wurde auf diesen Stand zurückgesetzt.
3. Startseite, Stylesheet, JavaScript und sichtbarer Hero-Bereich wurden im Browser geprüft.
4. Der GitHub-Branch `main` wurde mit einem nachvollziehbaren Rollback-Commit auf denselben Quellcode-Stand gebracht.
5. Der lokale Projektordner und die Nextcloud-Kopie wurden auf diesen Stand synchronisiert.
6. Noch nicht veröffentlichte Dokumenten-Arbeiten wurden separat in einem lokalen Git-Stash gesichert.

## Verbindlicher Deployment-Ablauf

### Grundregel

**Produktionsdeployments dürfen für dieses Projekt nicht mit lokal unter Windows erzeugten `--prebuilt`-Artefakten durchgeführt werden.**

Vercel muss den Quellcode selbst in seiner Build-Umgebung bauen.

### 1. Vor dem Deployment

- Der Arbeitsbaum ist sauber.
- Alle vorgesehenen Änderungen sind bewusst committed.
- Der Commit wurde zu GitHub auf `main` gepusht.
- Notwendige Vercel-Umgebungsvariablen sind für die Zielumgebung vorhanden.
- Geheimwerte werden weder in Markdown noch in Git-Commits gespeichert.
- Jede Funktionsgruppe erhält einen eigenen Commit.

Erforderliche Variablennamen prüfen, ohne deren Werte auszugeben:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- alle weiteren serverseitigen Variablen der betroffenen API-Routen

`vercel env pull .env.local` darf nicht unkontrolliert ausgeführt werden, weil die vorhandene Datei überschrieben werden kann. Vorher muss die lokale Datei gesichert und anschließend auf Vollständigkeit geprüft werden.

### 2. Preview direkt aus dem Quellcode bauen

```powershell
npx vercel deploy --yes
```

Nicht verwenden:

```powershell
npx vercel deploy --prebuilt
npx vercel deploy --prebuilt --prod
```

### 3. Preview technisch prüfen

```powershell
npx vercel curl / --deployment <PREVIEW-URL> --yes
npx vercel curl /kontakt --deployment <PREVIEW-URL> --yes
npx vercel curl /mitarbeiter/login --deployment <PREVIEW-URL> --yes
```

Danach im echten Browser prüfen:

- Startseite zeigt Hero-Text, Tarifformular, Bilder und Logo.
- Das App-Stylesheet besitzt mehr als `0` CSSOM-Regeln.
- Der übergeordnete Hero-Container hat effektiv `opacity: 1`.
- Navigation und mobile Menüschaltfläche funktionieren.
- JavaScript-Konsole enthält keine Asset-, Modul- oder Hydration-Fehler.
- `/kontakt` und `/mitarbeiter/login` werden sichtbar und gestylt gerendert.
- Die konkret geänderte Funktion wird auf Desktop und Mobilgerät getestet.

### 4. Erst nach Abnahme auf Produktion schalten

Bevorzugt wird die bereits geprüfte Preview promoted:

```powershell
npx vercel promote <PREVIEW-URL> --yes
```

Ein direktes Produktionsdeployment ist nur zulässig, wenn trotzdem aus dem Quellcode gebaut und anschließend vollständig geprüft wird:

```powershell
npx vercel deploy --prod --yes
```

### 5. Produktion nach dem Promote erneut prüfen

- `https://project-gqhfy.vercel.app/` im neuen Browser-Tab öffnen.
- Hard-Reload durchführen.
- Startseite, Kontaktseite und Mitarbeiter-Login prüfen.
- Geänderte Funktion mit realistischen Daten testen.
- Vercel-Deployment-ID und zugehörigen Git-Commit dokumentieren.

## Rollback-Anleitung

### 1. Letzte Deployments anzeigen

```powershell
npx vercel ls energie --yes
```

### 2. Kandidaten prüfen

```powershell
npx vercel inspect <DEPLOYMENT-URL>
npx vercel curl / --deployment <DEPLOYMENT-URL> --yes
```

Ein Kandidat darf erst als stabil gelten, wenn er zusätzlich visuell im Browser geprüft wurde.

### 3. Vercel zurückrollen

```powershell
npx vercel rollback <STABILE-DEPLOYMENT-URL> --yes --timeout 3m
```

### 4. GitHub nachvollziehbar angleichen

- Keine Force-Pushes auf `main`.
- Fehlerhafte Änderungen mit einem normalen Revert- bzw. Rollback-Commit zurücknehmen.
- Sicherstellen, dass der GitHub-Quellcode exakt dem produktiven Vercel-Stand entspricht.
- Lokalen Projektordner und Nextcloud danach per Fast-Forward synchronisieren.

## Durch den Rollback verlorene Optimierungen

### Übersicht

| Priorität | Bereich | Status nach Rollback | Ursprüngliche Quelle | Empfohlene Wiederherstellung |
|---:|---|---|---|---|
| 1 | Dashboard-Suche und Suche nach Lead-Nr. | Offen/verloren | Commit `e748650` | Isoliert neu übernehmen und als eigene Preview testen. |
| 2 | Dokumentenvorschau für PDF/Bilder | Offen/verloren | Teil von Commit `c27c75b` | Isoliert übernehmen und mit echten Dateien testen. |
| 3 | Mehrfach-Upload und Löschen von Dokumenten | Offen, nie veröffentlicht | lokaler `stash@{0}` | Erst Code-Review und API-/Berechtigungstests, dann eigener Commit. |
| 4 | Responsive Verbesserungen der Startseite | Offen/verloren | Teil von Commit `c27c75b` | Abschnittsweise wiederherstellen und auf mehreren Mobilbreiten prüfen. |
| 5 | Kompaktes, tastatursicheres mobiles Chatfenster | Teilweise offen | Teil von Commit `c27c75b` | Separat wiederherstellen und auf Android sowie iOS testen. |

### 1. Dashboard-Suche und Lead-Nummer

Zurückgerollte Funktionen:

- Das obere Suchfeld im Mitarbeiter-Dashboard leitete Suchbegriffe an `/mitarbeiter/leads?q=...` weiter.
- Die Lead-Seite übernahm den Suchparameter.
- Eine exakte gültige Lead-Nummer konnte den passenden Lead direkt öffnen.

Betroffene Dateien:

- `src/components/mitarbeiter/AdminShell.tsx`
- `src/routes/mitarbeiter.leads.tsx`

Erforderliche Tests:

- Suche nach Vorname, Nachname, E-Mail und Telefonnummer
- Suche nach vollständiger Lead-Nummer
- Verhalten bei ungültiger bzw. nicht vorhandener Nummer
- Enter-Taste und Suchformular auf Desktop und Mobilgerät

### 2. Dokumentenvorschau

Zurückgerollte Funktionen:

- Bilder und PDF-Dateien konnten innerhalb des Dashboards als Vorschau geöffnet werden.
- Signed URLs wurden als Blob geladen.
- Download und Öffnen in einem separaten Tab blieben zusätzlich verfügbar.
- Die Dokumentenliste war auf kleinen Bildschirmen responsiver.

Betroffene Datei:

- `src/routes/mitarbeiter.leads.$id.tsx`

Erforderliche Tests:

- PDF-Vorschau
- JPG-/PNG-Vorschau
- abgelaufene bzw. ungültige Signed URL
- fehlende Berechtigung
- große Dateien und langsame Verbindung
- Vorschau auf Mobilgerät

### 3. Mehrere Dokumente hochladen und falsche Uploads löschen

Diese Arbeit war beim Rollback noch nicht produktiv und wurde deshalb nicht verworfen, sondern im lokalen `stash@{0}` mit der Beschreibung `wip documents before stable rollback` geparkt.

Enthaltene, noch zu prüfende Arbeit:

- Mehrfachauswahl und Batch-Upload
- Statusanzeige bei teilweise fehlgeschlagenen Uploads
- eindeutige Storage-Pfade per UUID
- Korrektur von `file_size` auf `file_size_bytes`
- geschützte DELETE-API für Storage-Objekt und Datenbankzeile
- Löschschaltfläche und Bestätigungsdialog

Betroffene Dateien:

- `src/lib/api-client.ts`
- `src/routeTree.gen.ts`
- `src/routes/api/leads.$id.documents.$docId.ts`
- `src/routes/api/leads.$id.documents.upload.ts`
- `src/routes/mitarbeiter.leads.$id.tsx`

Vor der Wiederherstellung:

- Stash nicht blind auf `main` anwenden.
- Änderungen in einem eigenen Arbeitszweig bzw. isolierten Commit prüfen.
- Authentifizierung und Lead-Zugriffsrechte für Upload und Löschen testen.
- Sicherstellen, dass beim Fehler keine verwaisten Storage-Dateien oder Datenbankzeilen entstehen.
- Mehrere Dateien, doppelte Dateinamen, Teilfehler und falsche Dateitypen testen.

### 4. Responsive Verbesserungen der Startseite

Zurückgerollte Änderungen:

- kompaktere Statistiksektion auf kleinen Bildschirmen
- kein unerwünschter Umbruch von `100 %` und anderen Kennzahlen
- kleinere responsive Abstände und Schriftgrößen im finalen CTA
- responsives Logo und umbrechbare Telefonzeile
- gestapeltes PLZ-Feld und Angebotsbutton auf Mobilgeräten
- angepasste mobile Animationen und Innenabstände

Betroffene Datei:

- `src/routes/index.tsx`

Erforderliche Tests:

- 320, 360, 390, 412 und 768 Pixel Breite
- Android Chrome und iOS Safari
- Hoch- und Querformat
- kein horizontaler Seiten-Scroll
- keine abgeschnittenen Überschriften, Logos, Buttons oder Formularfelder

### 5. Mobiles Chatfenster

Der bereits zuvor umgesetzte Schutz gegen automatisches Hineinzoomen beim Antippen des Eingabefelds ist im stabilen Stand erhalten. Offen bzw. zurückgerollt sind:

- Reaktion auf `visualViewport` beim Öffnen der Bildschirmtastatur
- kleinere mobile Fensterhöhe
- angepasster Abstand zur Tastatur
- kompaktere Abstände in Kopfbereich und Eingabeformular
- Vermeidung der Überlappung durch die Bildschirmtastatur

Betroffene Datei:

- `src/components/site/AiChatWidget.tsx`

Erforderliche Tests:

- Samsung Internet bzw. Android Chrome
- iOS Safari
- Bildschirmtastatur öffnen und schließen
- Scrollen innerhalb des Verlaufs
- Eingabe mehrzeiliger Nachrichten
- Hoch- und Querformat

## Empfohlene Reihenfolge für die Wiederherstellung

1. Dashboard-Suche und Lead-Nummer
2. Dokumentenvorschau
3. Mehrfach-Upload und Dokumente löschen
4. Responsive Startseitenkorrekturen
5. Tastatursicheres mobiles Chatfenster

Jeder Punkt wird als eigener Commit umgesetzt, über einen von Vercel gebauten Preview-Stand getestet und erst danach separat auf Produktion promoted. Mehrere große Funktionsgruppen dürfen nicht mehr gemeinsam ohne Zwischenabnahme deployed werden.

## Abnahmekriterien für künftige Änderungen

Eine Änderung gilt erst als abgeschlossen, wenn:

- der Code auf GitHub liegt,
- der Preview-Build von Vercel selbst erstellt wurde,
- Build und Routenchecks erfolgreich sind,
- die geänderte Funktion praktisch getestet wurde,
- Startseite, Kontaktseite und Mitarbeiter-Login weiterhin vollständig sichtbar sind,
- CSS und JavaScript im Browser nachweislich geladen wurden,
- die mobile Ansicht geprüft wurde, sofern Layout oder Eingaben betroffen sind,
- der geprüfte Preview-Stand promoted wurde,
- Produktion danach erneut geprüft wurde,
- die Nextcloud-Kopie auf denselben Git-Stand synchronisiert ist.

## Dauerhafte Schutzmaßnahmen

- Kein `--prebuilt` für Produktionsdeployments von Windows.
- Kein unkontrolliertes Überschreiben von `.env.local`.
- Keine Geheimwerte in Repository, Dokumentation, Screenshots oder Chatprotokollen.
- Preview vor Produktion, auch bei vermeintlich kleinen CSS-Änderungen.
- Visuelle Browserprüfung zusätzlich zu HTTP- und Build-Prüfungen.
- Kleine, thematisch getrennte Commits und Deployments.
- Bei einem Produktionsfehler zuerst auf den letzten stabilen Stand zurückrollen; Experimente erfolgen anschließend nur in Preview-Deployments.
- GitHub, Vercel-Produktion, lokaler Projektordner und Nextcloud müssen denselben nachvollziehbaren Stand abbilden.
