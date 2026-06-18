# Backend-Spezifikation — EnergieClever

Stand: Juni 2026  
Zielgruppe: Backend-Entwickler, die das aktuelle Frontend-Mockup mit einem produktiven Backend verbinden.  
Empfohlener Stack: **Lovable Cloud** (Supabase) + **TanStack Start Server Functions** (`createServerFn`) + Lovable Cloud Email + Lovable AI Gateway.

---

## 1. Überblick

Das Frontend besteht aus zwei großen Bereichen:

1. **Öffentlicher Bereich** (`/`, `/strom`, `/gas`, `/strom-gas`, `/solar`, `/gewerbestrom`, `/gewerbegas`, `/tarife`, `/wissen`, `/wissen/$slug`, `/ablauf`, `/service`, `/faq`, `/kontakt`, `/ueber-uns`, `/angebot`, `/danke`, `/datenschutz`, `/impressum`, `/widerruf`) — Marketing + 8-Step-Funnel.
2. **Mitarbeiterbereich** (`/mitarbeiter/*`) — internes CRM für Lead-Bearbeitung, Anbieter-/Tarif-/Team-Verwaltung, E-Mail-Vorlagen, Wiedervorlagen.

Daten werden aktuell aus `src/lib/mock-leads.ts` und `src/lib/mock-auth.ts` geladen. Diese Datei beschreibt das Ziel-Backend, das den Mock 1:1 ersetzt.

---

## 2. Datenbank (Supabase / Postgres)

### 2.1 Enums

```sql
create type lead_status as enum (
  'neu','in_pruefung','rueckfrage','angebot_erstellt','angebot_gesendet',
  'interessiert','vertrag_vorbereitet','vertrag_gesendet','abgeschlossen',
  'abgelehnt','nicht_erreichbar','wiedervorlage'
);
create type lead_type   as enum ('strom','gas','strom_gas','gewerbe');
create type app_role    as enum ('admin','manager','mitarbeiter');
create type doc_kind    as enum ('rechnung','angebot','vertrag','sonstiges');
create type email_dir   as enum ('in','out');
create type offer_status as enum ('entwurf','gesendet','angenommen','abgelehnt');
create type tariff_segment as enum ('privat','gewerbe');
create type energy_kind as enum ('strom','gas');
```

### 2.2 Tabellen (Public Schema – mit GRANTs + RLS)

> Pflicht: jede Tabelle bekommt nach `CREATE TABLE` zuerst die GRANTs, dann RLS aktivieren, dann Policies. Roles **niemals** in `profiles` speichern — eigene `user_roles`-Tabelle (siehe 2.3).

- **profiles** — `id uuid PK references auth.users on delete cascade`, `full_name`, `phone`, `created_at`. Auto-Erstellung per Trigger auf `auth.users` insert.
- **user_roles** — `(user_id, role app_role)` unique. Quelle der Wahrheit für RBAC.
- **leads** — alle Felder aus `Lead`-Interface: `id text PK` (Format `L-YYYY-XXXX`), `name`, `email`, `phone`, `city`, `plz`, `type lead_type`, `consumption int`, `current_provider`, `monthly_payment numeric`, `status lead_status default 'neu'`, `score int default 0`, `assignee_id uuid references auth.users`, `expected_savings numeric`, `source`, `has_invoice bool`, `created_at`, `updated_at`, `wiedervorlage_at timestamptz`, `consent_contact bool`, `consent_partner_share bool`, `tracking_meta jsonb` (UTM/GA-Client-ID).
- **lead_notes** — `id`, `lead_id`, `author_id`, `text`, `created_at`.
- **lead_documents** — `id`, `lead_id`, `kind doc_kind`, `name`, `storage_path`, `size_bytes`, `uploaded_by`, `uploaded_at`. Dateien in Supabase Storage Bucket `lead-documents` (privat).
- **lead_emails** — `id`, `lead_id`, `subject`, `from_addr`, `to_addr`, `direction email_dir`, `body_html`, `body_text`, `sent_at`, `provider_message_id`. Bei Inbound: per Webhook von Mail-Provider gefüllt.
- **lead_offers** — `id`, `lead_id`, `provider_id`, `tariff_id`, `monthly_price`, `yearly_price`, `savings`, `status offer_status`, `pdf_path`, `sent_at`, `created_by`, `created_at`.
- **lead_status_history** — `id`, `lead_id`, `from_status`, `to_status`, `changed_by`, `changed_at`. Per Trigger auf `leads.status`-Update gefüllt — Basis für Timeline.
- **providers** — `id`, `name`, `type energy_kind|beide`, `partner bool`, `rating numeric`, `logo_path`, `notes`, `active`.
- **tariffs** — `id`, `provider_id`, `name`, `type energy_kind`, `segment tariff_segment`, `price_per_kwh numeric`, `base_price numeric`, `duration_months int`, `price_guarantee_months int`, `eco bool`, `active`, `valid_from`, `valid_until`.
- **email_templates** — `id`, `name`, `subject`, `trigger text` (z. B. `lead_created`, `status:angebot_gesendet`, `wiedervorlage_reached`), `body_mjml`, `active bool`, `last_edited_by`, `last_edited_at`.
- **suppressed_emails** — append-only Bounces/Complaints/Unsubscribes (von Lovable Cloud Email gefüllt).
- **audit_log** — `id`, `actor_id`, `entity`, `entity_id`, `action`, `diff jsonb`, `created_at`. Für DSGVO-Nachweis.

### 2.3 RBAC

```sql
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;
```

Genutzt in allen RLS-Policies für `_authenticated`-Routen. **Niemals** Rollencheck im Client/Profil.

### 2.4 RLS-Policies (Kurzfassung)

| Tabelle | anon | authenticated | mitarbeiter | manager | admin |
|---|---|---|---|---|---|
| `providers` (active=true) | SELECT | SELECT | full | full | full |
| `tariffs` (active=true) | SELECT | SELECT | full | full | full |
| `leads` | INSERT (Formular) | — | SELECT/UPDATE wo `assignee_id = auth.uid()` | full | full |
| `lead_notes/documents/emails/offers` | — | — | wo Lead zugewiesen | full | full |
| `user_roles` | — | SELECT eigene | — | — | full |
| `email_templates` | — | — | SELECT | full | full |
| `audit_log` | — | — | — | SELECT | SELECT/INSERT |

Anonyme Leadanlage über `INSERT` auf `leads` mit Spalten-Whitelist; alles Sensible (Score, Assignee, Status) bleibt Default.

### 2.5 Storage

- Bucket `lead-documents` (privat) — Pfad: `{lead_id}/{uuid}-{filename}`. Upload aus Funnel-Step 7 als signed-upload-URL aus Server-Function.
- Bucket `provider-logos` (public).
- Bucket `offer-pdfs` (privat) — generierte Angebots-/Vertrags-PDFs.

---

## 3. Server Functions (`createServerFn`)

Alle App-internen Lese-/Schreib-Operationen laufen über TanStack Server Functions. Pfad: `src/lib/*.functions.ts`, Auth über `requireSupabaseAuth`-Middleware.

### 3.1 Öffentlich (kein Auth)

- `submitLeadForm({ step1..step8 })` → erstellt Lead + Storage-Upload-URL für Rechnung, sendet Anfrage-Bestätigung (Queue), gibt `{ leadId }` zurück. Validierung mit Zod, Spam-Schutz (hCaptcha/Turnstile), Rate-Limit per IP.
- `getPublicTariffs({ kind, segment, ecoOnly, kwh })` → sortierte Tarifliste mit berechneten Jahreskosten.
- `getProvidersPublic()` → Partneranbieter-Liste.
- `getArticle(slug)` → optional, falls Artikel aus DB statt statisch.

### 3.2 Authentifiziert (`requireSupabaseAuth`)

**Leads**
- `listLeads({ status?, q?, assignee?, dateRange?, page })` — Mitarbeiter sehen nur eigene, Admin/Manager alle.
- `getLead(id)` — inkl. notes/documents/emails/offers/status-history.
- `updateLeadStatus(id, newStatus, comment?)` — schreibt `lead_status_history`, triggert Template-E-Mail wenn aktiv.
- `assignLead(id, userId)` — Admin/Manager.
- `addLeadNote(id, text)`.
- `setWiedervorlage(id, date, reason)`.
- `uploadLeadDocument(id, kind)` → signed upload URL.

**Angebote / Verträge**
- `createOffer(leadId, tariffId, customPricing?)` → PDF-Generierung (siehe 4.2), `lead_offers` insert, Status → `angebot_erstellt`.
- `sendOffer(offerId)` → E-Mail mit PDF-Link versenden, Status → `angebot_gesendet`.
- `prepareContract(leadId, offerId)` → Vertrags-PDF generieren, Status → `vertrag_vorbereitet`.
- `sendContract(leadId)` → E-Mail mit Signatur-Link, Status → `vertrag_gesendet`.
- `markContractSigned(leadId)` → Webhook von Signatur-Provider → Status `abgeschlossen`.

**Verwaltung (Admin/Manager)**
- `listProviders`, `upsertProvider`, `toggleProviderActive`.
- `listTariffs`, `upsertTariff`, `importTariffsCsv`.
- `listTeam`, `inviteEmployee(email, role)`, `setRole(userId, role)`, `deactivateEmployee(userId)` — nur Admin.
- `listEmailTemplates`, `upsertTemplate`, `toggleTemplate`, `previewTemplate(id, leadId)`.
- `getStats({ from, to, assignee? })` — KPIs: Leads pro Status, Conversion, Ø Bearbeitungszeit, Ersparnis pro Vertrag.

**Profile / Auth**
- `getMe()`, `updateProfile(data)`.

### 3.3 Server-Routes (`src/routes/api/public/*`)

Nur für externe Aufrufer:

- `POST /api/public/email/inbound` — Mail-Provider Webhook für Antworten an `lead-{id}@`-Adresse → erzeugt `lead_emails` direction=`in`.
- `POST /api/public/signature/callback` — Signatur-Provider-Webhook (Signatur-Status).
- `POST /api/public/email/bounce` — Bounce/Complaint von Mail-Provider → `suppressed_emails`.
- `POST /api/public/cron/wiedervorlage` — Cron (pg_cron) → triggert Template `wiedervorlage_reached` für fällige Leads.
- `POST /api/public/cron/lead-scoring` — Cron → neuberechnet Score aller offenen Leads (siehe 4.3).

Alle Webhooks: Signature-Verify (HMAC) Pflicht.

---

## 4. Automationen

### 4.1 E-Mail-Versand

Lovable Cloud Email mit eigener Versand-Domain (z. B. `notify.energieclever.de`). Templates als MJML in `email_templates`. Variablen: `{{lead.name}}`, `{{lead.id}}`, `{{offer.yearly_price}}`, `{{assignee.name}}`, `{{unsubscribe_url}}`.

Trigger-Events (Funktion `enqueue_template(template_trigger, lead_id)` schreibt in pgmq):

| Trigger | Auslöser |
|---|---|
| `lead_created` | nach `submitLeadForm` |
| `status:rueckfrage` | Statuswechsel zu `rueckfrage` |
| `status:angebot_gesendet` | `sendOffer` |
| `status:vertrag_gesendet` | `sendContract` |
| `48h_no_reaction` | Cron, wenn `status=neu` und `created_at < now() - 48h` |
| `wiedervorlage_reached` | Cron, wenn `wiedervorlage_at <= now()` |

DLQ + Retry per Lovable Cloud Email Queue (5x, dann manuell).

### 4.2 PDF-Generierung

In Server-Function (Worker-kompatibel — **kein** `puppeteer`/`sharp`). Empfehlung: React-PDF (`@react-pdf/renderer`) oder `pdf-lib`. Templates für Angebot und Vertrag mit Variablen aus Lead + Tariff + Provider. Speicherung in `offer-pdfs`-Bucket, signed URL in E-Mail.

### 4.3 Lead-Scoring

Server-Function `recomputeScore(leadId)`:

```
score = w1 * verbrauch_norm
      + w2 * ersparnis_eur_pro_jahr_norm
      + w3 * hasInvoice
      + w4 * source_quality (Empfehlung > Direkt > Ads)
      + w5 * recency
- penalty * (rückfragen, bounce, dnc)
```

Initial nach `submitLeadForm`, danach per Cron + bei Status-Wechsel. A/B/C-Klassifizierung: ≥80 = A (Heiß), 50–79 = B, <50 = C.

### 4.4 Tracking

GTM-Container im SSR-Layout einbinden (nur wenn Cookie-Consent `analytics === true`). Funnel-Events:

- `lead_form_started` (Step 1)
- `lead_form_step` (`step` Property)
- `lead_form_submitted` (mit `lead_id`)
- `offer_sent`, `contract_sent`, `contract_signed`

Meta Pixel + GA4 via GTM. Lovable Cloud kann Server-Side-Events triggern (Conversions API für Meta), wenn DSGVO-Banner zugestimmt.

---

## 5. Sicherheit & DSGVO

- **Auth**: Supabase Auth, Magic Link für Mitarbeiter, optional Google SSO. Passwort-Reset-Route `/reset-password` Pflicht.
- **RLS überall** + Service-Role nur in Server-Routes/Webhooks.
- **Consent**:
  - Formular-Step 7 erzwingt `consent_contact` + zeigt Hinweis auf `consent_partner_share`. Beides als bool in `leads` + Timestamp in `audit_log`.
  - Cookie-Banner (bereits im Frontend) steuert GTM-Load.
- **AV-Verträge** mit: Supabase, Mail-Provider, Signatur-Provider, GTM/GA, Meta — als Liste in `/datenschutz`.
- **Löschkonzept** (Cron):
  - Leads ohne Vertragsabschluss: nach **18 Monaten** Inaktivität anonymisieren (`name`, `email`, `phone` → `[gelöscht]`, Dokumente löschen).
  - Vertragsleads: **10 Jahre** aufbewahren (HGB/AO), danach löschen.
  - User-DSAR-Endpoint: `requestMyData()` + `deleteMyData()` als Server-Functions.
- **Rate-Limits** auf öffentliche Endpoints (Lead-Submit: 5/h pro IP).
- **Audit-Log** bei jedem Schreibvorgang im CRM.
- **Storage**: alle Lead-Dokumente privat, signed URLs mit ≤15 min TTL.

---

## 6. Migrationspfad vom Mockup

1. **Lovable Cloud aktivieren** (Supabase Setup).
2. Migration 1: Enums + Tabellen + GRANTs + RLS + `has_role` + Trigger (profile, status_history, audit).
3. Migration 2: Seed `providers`, `tariffs`, `email_templates` aus `src/lib/mock-leads.ts`.
4. Auth-Seite `/auth` (Login/Signup) + `/_authenticated`-Layout. `mitarbeiter.login.tsx` ersetzen.
5. `src/lib/mock-auth.ts` durch echten Auth-Context ersetzen (`supabase.auth.getUser()` + `user_roles`-Query).
6. `mock-leads.ts` durch Server-Function-Calls + TanStack-Query ersetzen (eine Route nach der anderen: Dashboard → Leads → Lead-Detail → Verwaltung).
7. `submitLeadForm` in `src/routes/angebot.tsx` anbinden.
8. Lovable Cloud Email aktivieren, Versand-Domain einrichten, Templates aus DB rendern.
9. PDF-Generator + Signatur-Provider integrieren.
10. pg_cron Jobs für Scoring, Wiedervorlage, Lösch-Konzept anlegen.
11. GTM/GA4/Meta Pixel hinter Cookie-Consent einbauen.
12. Penetrationstest + DSGVO-Audit vor Go-Live.

---

## 7. Nicht-funktionale Anforderungen

- **Performance**: Lead-Liste muss bei 50.000 Leads <500 ms laden — Pagination + Status-Index (`create index on leads(status, created_at desc)`).
- **Verfügbarkeit**: Supabase + Cloudflare Workers, Ziel 99,9 %.
- **Backup**: Supabase Daily Backups + Point-in-Time-Recovery.
- **Monitoring**: Server-Function-Logs in Lovable Dashboard, Fehler-Alerts via E-Mail an Admin.
- **i18n**: aktuell nur DE; alle UI-Strings in DE belassen.

---

## 8. Offene Punkte / spätere Entscheidungen

- Signatur-Provider: DocuSign vs. SignNow vs. Eigenbau mit `pdf-lib` + IP-Signatur.
- Inbound-Mail: pro Lead eigene Reply-Address (`lead-L-2026-0412@...`) — braucht Mail-Provider mit Catch-All.
- Real-time-Updates im CRM (neue Leads ohne Reload) via Supabase Realtime auf `leads`-Channel.
- Optional: AI-Assistent im Lead-Detail (Lovable AI Gateway) — automatische Tarif-Vorschläge, Antwortvorschläge auf eingehende Mails.
