# Vollständiger Abnahmetest vom 25.08.2026

## Umfang

Geprüft wurden die öffentliche Webseite auf Desktop und Mobilgeräten, Navigation, Tarifrechner, Angebotsstrecke, Chat Oberfläche, Mitarbeiterzugang, öffentliche und geschützte API Endpunkte, Datenbankzugriffe, E Mail Konfiguration, Sicherheitsheader, Build und Abhängigkeiten.

## Ergebnis

Der geprüfte Stand ist technisch baubar und die öffentlich erreichbaren Funktionen arbeiten ohne kritische Fehler. Während der Abnahme gefundene Fehler wurden im selben Stand korrigiert.

### Automatisierte Prüfungen

| Prüfung | Ergebnis |
| --- | --- |
| TypeScript | bestanden |
| Unit Tests | 18 von 18 bestanden |
| Produktionsbuild | bestanden |
| Abhängigkeiten | 0 bekannte Schwachstellen |
| Git Diff Prüfung | bestanden |

### Öffentliche Webseite

Alle öffentlichen Seiten und alle veröffentlichten Ratgeberartikel liefern einen erfolgreichen Status und wurden in Desktop und Mobilansicht geprüft. Es wurden keine kaputten Bilder, doppelten IDs, unbenannten Schaltflächen oder horizontalen Überläufe gefunden. Pflichtfelder, Postleitzahlprüfung und die acht Schritte der Angebotsstrecke reagieren korrekt.

### Backend und Sicherheit

Der Gesundheitsendpunkt meldet API, Datenbank und E Mail Dienst als verfügbar. Geschützte Endpunkte lehnen nicht angemeldete Zugriffe ab. Anonyme direkte Datenbankzugriffe auf Kunden, Leads, Dokumente, Tarife und interne Inhalte werden blockiert. Sicherheitsheader, Anfragebegrenzung und Eingabevalidierung sind aktiv. Datenbankbeziehungen wurden auf verwaiste Datensätze geprüft und sind konsistent.

### Korrekturen aus diesem Test

* Beim Wechsel auf Gas wird jetzt ein gültiger Gas Verbrauch vorausgewählt.
* In der mobilen Navigation ist nur noch ein Untermenü gleichzeitig geöffnet.
* Cookie Einstellungen können im Footer jederzeit erneut geöffnet werden.
* Ausschließlich per POST erreichbare API Endpunkte antworten bei GET korrekt mit Status 405.
* Dokumente können im Mitarbeiterbereich nach einer Sicherheitsabfrage gelöscht werden.
* Eine funktionslose Benachrichtigungsschaltfläche im Dashboard wurde entfernt.
* Kleine Touch Ziele im Footer wurden vergrößert.
* Die Überschrift auf der Seite Über uns hat wieder den korrekten Wortabstand.
* Robots Datei, Sitemap und Favicon wurden ergänzt.

## Noch erforderliche manuelle Abnahmen

Die folgenden Prüfungen verändern Produktionsdaten oder erfordern einen angemeldeten Mitarbeiter und werden deshalb erst nach ausdrücklicher Freigabe durchgeführt:

1. Eine gekennzeichnete Testanfrage absenden und den Eingang beider E Mails bestätigen.
2. Eine Chat Nachricht an den KI Dienst senden und die vollständige Antwort prüfen.
3. Im Mitarbeiterkonto Lead Suche, Lead Details, Upload, Vorschau und Löschung eines Testdokuments prüfen.

## Konfiguration

Die Cloudflare Turnstile Schlüssel sind in der Produktionsumgebung noch nicht hinterlegt. Anfragebegrenzung und serverseitige Validierung sind aktiv, ein zusätzliches CAPTCHA wird aber erst nach Eintragung dieser beiden Schlüssel wirksam.

Die dynamischen Ratgeberseiten verwenden serverseitig noch einen allgemeinen Seitentitel. Die Inhalte und URLs funktionieren; individuelle Titel sind eine verbleibende Suchmaschinenoptimierung.
