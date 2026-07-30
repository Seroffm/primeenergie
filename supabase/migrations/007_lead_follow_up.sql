-- Persistente Wiedervorlage für die bestehende Lead-Statuslogik.
-- Keine eigene Aufgaben-Tabelle: `follow_up` bleibt der maßgebliche Lead-Status.

alter table public.leads
  add column if not exists wiedervorlage_at timestamptz,
  add column if not exists wiedervorlage_note text;

create index if not exists leads_follow_up_due_idx
  on public.leads (wiedervorlage_at asc)
  where status = 'follow_up';
