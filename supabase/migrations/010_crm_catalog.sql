CREATE TABLE IF NOT EXISTS public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  energy_type text NOT NULL CHECK (energy_type IN ('strom', 'gas', 'beide')),
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  is_partner boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tariffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE RESTRICT,
  name text NOT NULL,
  energy_type text NOT NULL CHECK (energy_type IN ('strom', 'gas')),
  segment text NOT NULL CHECK (segment IN ('privat', 'gewerbe')),
  price_per_kwh numeric(10,4) NOT NULL DEFAULT 0 CHECK (price_per_kwh >= 0),
  base_price numeric(10,2) NOT NULL DEFAULT 0 CHECK (base_price >= 0),
  duration_months integer NOT NULL DEFAULT 12 CHECK (duration_months BETWEEN 0 AND 120),
  price_guarantee_months integer NOT NULL DEFAULT 0 CHECK (price_guarantee_months BETWEEN 0 AND 120),
  is_eco boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, name)
);

CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  subject text NOT NULL,
  trigger_name text NOT NULL,
  body text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tariffs_provider_idx ON public.tariffs(provider_id);
CREATE INDEX IF NOT EXISTS tariffs_type_segment_idx ON public.tariffs(energy_type, segment);

DROP TRIGGER IF EXISTS providers_updated_at ON public.providers;
CREATE TRIGGER providers_updated_at BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS tariffs_updated_at ON public.tariffs;
CREATE TRIGGER tariffs_updated_at BEFORE UPDATE ON public.tariffs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS email_templates_updated_at ON public.email_templates;
CREATE TRIGGER email_templates_updated_at BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.providers FROM anon, authenticated;
REVOKE ALL ON TABLE public.tariffs FROM anon, authenticated;
REVOKE ALL ON TABLE public.email_templates FROM anon, authenticated;

INSERT INTO public.providers (name, energy_type, rating, is_partner) VALUES
  ('E.ON', 'beide', 4.2, true),
  ('EnBW', 'beide', 4.4, true),
  ('Vattenfall', 'beide', 4.0, true),
  ('Yello', 'strom', 4.5, true),
  ('eprimo', 'beide', 4.1, true),
  ('LichtBlick', 'strom', 4.7, true),
  ('Naturstrom', 'beide', 4.6, true),
  ('RheinEnergie', 'beide', 3.9, false),
  ('Stadtwerke München', 'beide', 4.3, false)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.tariffs (
  provider_id, name, energy_type, segment, price_per_kwh, base_price,
  duration_months, price_guarantee_months, is_eco
)
SELECT p.id, seed.name, seed.energy_type, seed.segment, seed.price_per_kwh,
  seed.base_price, seed.duration_months, seed.price_guarantee_months, seed.is_eco
FROM (VALUES
  ('E.ON', 'PrivatStrom Plus', 'strom', 'privat', 28.4, 11.9, 12, 12, false),
  ('EnBW', 'Gewerbestrom 24 Fix', 'strom', 'gewerbe', 24.1, 14.5, 24, 24, false),
  ('Yello', 'Klassik Strom 12', 'strom', 'privat', 27.8, 10.5, 12, 12, false),
  ('LichtBlick', 'ÖkoStrom Premium', 'strom', 'privat', 30.2, 12.9, 12, 12, true),
  ('Naturstrom', 'Bio Erdgas Komfort', 'gas', 'privat', 11.4, 9.9, 24, 24, true),
  ('Vattenfall', 'EasyGas 24', 'gas', 'privat', 9.8, 8.9, 24, 24, false),
  ('eprimo', 'Gas Direkt 12', 'gas', 'privat', 9.1, 8.0, 12, 12, false),
  ('EnBW', 'Gewerbegas Fix 24', 'gas', 'gewerbe', 8.6, 12.5, 24, 24, false)
) AS seed(provider_name, name, energy_type, segment, price_per_kwh, base_price,
  duration_months, price_guarantee_months, is_eco)
JOIN public.providers p ON p.name = seed.provider_name
ON CONFLICT (provider_id, name) DO NOTHING;

INSERT INTO public.email_templates (name, subject, trigger_name, is_active) VALUES
  ('Anfrage Bestätigung', 'Ihre Anfrage für Strom oder Gas ist eingegangen', 'Lead erstellt', true),
  ('Rückfrage Jahresrechnung', 'Uns fehlt noch Ihre letzte Jahresrechnung', 'Status: Rückfrage offen', true),
  ('Angebot versendet', 'Ihr persönliches Energieangebot ist da', 'Status: Angebot gesendet', true),
  ('Vertrag zur Unterschrift', 'Hier können Sie Ihr Angebot bestätigen', 'Status: Vertrag gesendet', true),
  ('Erinnerung nicht erreichbar', 'Wir versuchen, Sie zu erreichen', '48 Stunden ohne Reaktion', true),
  ('Wiedervorlage', 'Wir melden uns wie vereinbart zurück', 'Wiedervorlage erreicht', false)
ON CONFLICT (name) DO NOTHING;
