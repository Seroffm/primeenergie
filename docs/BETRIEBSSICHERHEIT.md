# Betriebssicherheit

## Healthcheck

`GET /api/health` prüft die Erreichbarkeit der API, die Verbindung zu Supabase und die notwendige Mailkonfiguration. Ein gesunder Betrieb liefert HTTP `200`, eine Störung HTTP `503`.

Der Endpunkt gibt niemals Schlüssel, Empfängeradressen oder interne Fehlermeldungen aus. Er eignet sich für einen externen Verfügbarkeitsmonitor.

Ein autorisierter `POST /api/health` mit `Authorization: Bearer <OPS_HEALTH_SECRET>` sendet zusätzlich eine echte Testmail an `NOTIFICATION_EMAIL`. Pro Stunde wird wegen der eindeutigen Versandkennung höchstens eine solche Testmail erzeugt.

## Mailversand

Der Mailversand nutzt eine eindeutige Versandkennung. Temporäre Transportfehler, Rate Limits und Fehler ab HTTP 500 werden höchstens dreimal wiederholt. Resend verarbeitet Wiederholungen mit derselben Kennung nur einmal, damit keine doppelten Kundenmails entstehen.

Fehler erscheinen strukturiert in den Vercel Runtime Logs als `email_send_failed` oder `email_transport_failed`. Für neue Leads wird der Versand zusätzlich in `lead_communications` mit `success` oder `failed` protokolliert.

## Änderung von Schlüsseln

Vercel bindet Umgebungsvariablen beim Deployment ein. Nach jeder Änderung von `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFICATION_EMAIL`, `OPS_HEALTH_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` oder anderen Servervariablen ist deshalb zwingend ein neues Production Deployment erforderlich.

Danach sind diese Prüfungen durchzuführen:

1. `/api/health` muss HTTP `200` liefern.
2. Eine interne Testanfrage muss eine Kundenbestätigung und eine interne Benachrichtigung erzeugen.
3. Die beiden Einträge in `lead_communications` müssen den Status `success` und eine externe Versand ID besitzen.
4. Die Vercel Runtime Logs dürfen keine neuen Mailfehler enthalten.

## Störungsdiagnose

Jede Serverantwort enthält `X-Request-Id`. Diese ID zusammen mit Zeitpunkt und betroffener Funktion dokumentieren. Damit lässt sich eine einzelne Anfrage in den Runtime Logs zuordnen, ohne persönliche Daten in Fehlermeldungen aufzunehmen.

Bei einem gestörten Healthcheck zuerst den letzten Deploymentzeitpunkt mit der letzten Änderung der Umgebungsvariablen vergleichen. Danach Datenbankstatus, Resend Konfiguration und Runtime Logs prüfen.
