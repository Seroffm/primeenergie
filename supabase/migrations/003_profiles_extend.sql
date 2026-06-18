-- Fehlende Spalten in profiles ergänzen
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone      text,
  ADD COLUMN IF NOT EXISTS avatar_url text;
