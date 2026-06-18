-- ============================================================
-- 001_initial_schema.sql — EnergieClever CRM
-- Ausführen in: Supabase SQL Editor (einmalig)
-- ============================================================

-- ============================================================
-- Enums
-- ============================================================

create type public.lead_status as enum (
  'new', 'in_review', 'question_open', 'offer_created', 'offer_sent',
  'interested', 'contract_prepared', 'contract_sent', 'completed',
  'rejected', 'unreachable', 'follow_up', 'disqualified', 'lost'
);

create type public.product_type as enum ('electricity', 'gas', 'both');
create type public.customer_type as enum (
  'private', 'business', 'property_management', 'multi_location_company'
);
create type public.user_role as enum ('employee', 'manager', 'admin');
create type public.address_type as enum ('delivery', 'billing', 'contact');
create type public.energy_type as enum ('electricity', 'gas');
create type public.comm_direction as enum ('inbound', 'outbound', 'internal');
create type public.offer_status_type as enum (
  'draft', 'sent', 'accepted', 'rejected', 'expired', 'superseded'
);

-- ============================================================
-- Sequences
-- ============================================================

create sequence if not exists public.lead_number_seq;
create sequence if not exists public.offer_number_seq;

-- ============================================================
-- Helper-Functions
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- profiles
-- ============================================================

create table if not exists public.profiles (
  id            uuid             primary key default gen_random_uuid(),
  auth_user_id  uuid             not null unique references auth.users(id) on delete cascade,
  role          public.user_role not null default 'employee',
  full_name     text             not null default '',
  email         text             not null default '',
  is_active     boolean          not null default true,
  created_at    timestamptz      not null default now(),
  updated_at    timestamptz      not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile when Supabase user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (auth_user_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.email, '')
  )
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- leads
-- ============================================================

create table if not exists public.leads (
  id              uuid                  primary key default gen_random_uuid(),
  lead_number     text                  not null unique
                    default ('L-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.lead_number_seq')::text, 4, '0')),
  first_name      text                  not null,
  last_name       text                  not null,
  email           text                  not null,
  phone           text,
  status          public.lead_status    not null default 'new',
  score           int                   not null default 0,
  score_label     text                  not null default 'cold',
  product_type    public.product_type   not null,
  customer_type   public.customer_type  not null default 'private',
  assigned_to     uuid                  references auth.users(id),
  privacy_consent boolean               not null default false,
  contact_consent boolean               not null default false,
  created_at      timestamptz           not null default now(),
  updated_at      timestamptz           not null default now()
);

create index if not exists leads_status_created_idx on public.leads(status, created_at desc);
create index if not exists leads_assigned_to_idx    on public.leads(assigned_to);
create index if not exists leads_email_idx          on public.leads(email);

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================
-- lead_addresses
-- ============================================================

create table if not exists public.lead_addresses (
  id               uuid                 primary key default gen_random_uuid(),
  lead_id          uuid                 not null references public.leads(id) on delete cascade,
  address_type     public.address_type  not null default 'delivery',
  street           text,
  house_number     text,
  address_addition text,
  postal_code      text,
  city             text,
  state            text,
  country          text                 not null default 'DE',
  created_at       timestamptz          not null default now(),
  updated_at       timestamptz          not null default now()
);

create trigger lead_addresses_updated_at
  before update on public.lead_addresses
  for each row execute function public.set_updated_at();

-- ============================================================
-- energy_demands
-- ============================================================

create table if not exists public.energy_demands (
  id                     uuid                primary key default gen_random_uuid(),
  lead_id                uuid                not null references public.leads(id) on delete cascade,
  energy_type            public.energy_type  not null,
  annual_consumption_kwh numeric,
  consumption_known      boolean,
  household_size         int,
  living_area_sqm        numeric,
  heating_type           text,
  hot_water_with_gas     boolean,
  current_provider       text,
  current_tariff         text,
  monthly_payment        numeric,
  contract_end_date      date,
  meter_number           text,
  created_at             timestamptz         not null default now(),
  updated_at             timestamptz         not null default now()
);

create trigger energy_demands_updated_at
  before update on public.energy_demands
  for each row execute function public.set_updated_at();

-- ============================================================
-- lead_notes
-- ============================================================

create table if not exists public.lead_notes (
  id          uuid        primary key default gen_random_uuid(),
  lead_id     uuid        not null references public.leads(id) on delete cascade,
  created_by  uuid        references auth.users(id),
  note        text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists lead_notes_lead_id_idx on public.lead_notes(lead_id, created_at desc);

create trigger lead_notes_updated_at
  before update on public.lead_notes
  for each row execute function public.set_updated_at();

-- ============================================================
-- lead_documents
-- ============================================================

create table if not exists public.lead_documents (
  id              uuid        primary key default gen_random_uuid(),
  lead_id         uuid        not null references public.leads(id) on delete cascade,
  uploaded_by     uuid        references auth.users(id),
  document_type   text        not null default 'other',
  file_name       text        not null,
  storage_path    text        not null,
  storage_bucket  text        not null default 'lead-documents',
  mime_type       text,
  file_size_bytes bigint,
  ocr_status      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger lead_documents_updated_at
  before update on public.lead_documents
  for each row execute function public.set_updated_at();

-- ============================================================
-- lead_communications
-- ============================================================

create table if not exists public.lead_communications (
  id                 uuid                    primary key default gen_random_uuid(),
  lead_id            uuid                    not null references public.leads(id) on delete cascade,
  offer_id           uuid,
  created_by         uuid                    references auth.users(id),
  communication_type text                    not null default 'email',
  direction          public.comm_direction   not null default 'outbound',
  subject            text,
  content_summary    text,
  status             text                    not null default 'pending',
  external_id        text,
  created_at         timestamptz             not null default now(),
  updated_at         timestamptz             not null default now()
);

create trigger lead_communications_updated_at
  before update on public.lead_communications
  for each row execute function public.set_updated_at();

-- ============================================================
-- lead_offers
-- ============================================================

create table if not exists public.lead_offers (
  id                uuid                    primary key default gen_random_uuid(),
  lead_id           uuid                    not null references public.leads(id) on delete cascade,
  energy_demand_id  uuid                    references public.energy_demands(id),
  created_by        uuid                    references auth.users(id),
  offer_number      text                    not null unique
                      default ('O-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.offer_number_seq')::text, 4, '0')),
  version           int                     not null default 1,
  provider_name     text                    not null,
  tariff_name       text                    not null,
  energy_type       public.energy_type      not null,
  monthly_price     numeric,
  annual_price      numeric,
  estimated_savings numeric,
  status            public.offer_status_type not null default 'draft',
  valid_until       date,
  notes             text,
  created_at        timestamptz             not null default now(),
  updated_at        timestamptz             not null default now()
);

create trigger lead_offers_updated_at
  before update on public.lead_offers
  for each row execute function public.set_updated_at();

-- ============================================================
-- lead_status_history
-- ============================================================

create table if not exists public.lead_status_history (
  id          uuid               primary key default gen_random_uuid(),
  lead_id     uuid               not null references public.leads(id) on delete cascade,
  old_status  public.lead_status,
  new_status  public.lead_status not null,
  changed_by  uuid               references auth.users(id),
  reason      text,
  created_at  timestamptz        not null default now()
);

create index if not exists lead_status_history_lead_id_idx on public.lead_status_history(lead_id, created_at desc);

-- ============================================================
-- RLS
-- ============================================================

alter table public.profiles             enable row level security;
alter table public.leads                enable row level security;
alter table public.lead_addresses       enable row level security;
alter table public.energy_demands       enable row level security;
alter table public.lead_notes           enable row level security;
alter table public.lead_documents       enable row level security;
alter table public.lead_communications  enable row level security;
alter table public.lead_offers          enable row level security;
alter table public.lead_status_history  enable row level security;

-- profiles: jeder Nutzer sieht/aktualisiert nur sein eigenes Profil
create policy "profiles: eigenes Profil lesen"
  on public.profiles for select
  using (auth.uid() = auth_user_id);

create policy "profiles: eigenes Profil aktualisieren"
  on public.profiles for update
  using (auth.uid() = auth_user_id);

-- leads: anon darf inserieren (öffentliches Formular); auth-Nutzer dürfen lesen
create policy "leads: anon insert"
  on public.leads for insert to anon
  with check (true);

create policy "leads: auth read"
  on public.leads for select to authenticated
  using (true);

create policy "leads: auth update"
  on public.leads for update to authenticated
  using (true);

-- Alle abgeleiteten Lead-Tabellen: auth-Nutzer dürfen lesen
create policy "lead_addresses: auth read"     on public.lead_addresses     for select to authenticated using (true);
create policy "energy_demands: auth read"     on public.energy_demands     for select to authenticated using (true);
create policy "lead_notes: auth read"         on public.lead_notes         for select to authenticated using (true);
create policy "lead_notes: auth insert"       on public.lead_notes         for insert to authenticated with check (true);
create policy "lead_documents: auth read"     on public.lead_documents     for select to authenticated using (true);
create policy "lead_comms: auth read"         on public.lead_communications for select to authenticated using (true);
create policy "lead_offers: auth read"        on public.lead_offers        for select to authenticated using (true);
create policy "lead_status_hist: auth read"   on public.lead_status_history for select to authenticated using (true);
create policy "lead_status_hist: auth insert" on public.lead_status_history for insert to authenticated with check (true);

-- ============================================================
-- Storage Buckets (in Supabase Dashboard anlegen ODER via API)
-- Bucket "lead-documents" (privat), "offer-pdfs" (privat), "provider-logos" (public)
-- ============================================================
