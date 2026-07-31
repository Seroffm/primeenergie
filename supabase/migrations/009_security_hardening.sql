-- Security hardening for the CRM and public endpoints.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_prefs jsonb NOT NULL DEFAULT '{
    "new_lead": true,
    "no_reaction": true,
    "contract_signed": true,
    "weekly_report": false
  }'::jsonb;

-- CRM data is accessed through server routes using the service role.
DROP POLICY IF EXISTS "leads: anon insert" ON public.leads;
DROP POLICY IF EXISTS "leads: auth read" ON public.leads;
DROP POLICY IF EXISTS "leads: auth update" ON public.leads;
DROP POLICY IF EXISTS "lead_addresses: auth read" ON public.lead_addresses;
DROP POLICY IF EXISTS "energy_demands: auth read" ON public.energy_demands;
DROP POLICY IF EXISTS "lead_notes: auth read" ON public.lead_notes;
DROP POLICY IF EXISTS "lead_notes: auth insert" ON public.lead_notes;
DROP POLICY IF EXISTS "lead_documents: auth read" ON public.lead_documents;
DROP POLICY IF EXISTS "lead_comms: auth read" ON public.lead_communications;
DROP POLICY IF EXISTS "lead_offers: auth read" ON public.lead_offers;
DROP POLICY IF EXISTS "lead_status_hist: auth read" ON public.lead_status_history;
DROP POLICY IF EXISTS "lead_status_hist: auth insert" ON public.lead_status_history;
DROP POLICY IF EXISTS "auth_users_read_lead_docs" ON storage.objects;

REVOKE ALL ON TABLE public.leads FROM anon, authenticated;
REVOKE ALL ON TABLE public.lead_addresses FROM anon, authenticated;
REVOKE ALL ON TABLE public.energy_demands FROM anon, authenticated;
REVOKE ALL ON TABLE public.lead_notes FROM anon, authenticated;
REVOKE ALL ON TABLE public.lead_documents FROM anon, authenticated;
REVOKE ALL ON TABLE public.lead_communications FROM anon, authenticated;
REVOKE ALL ON TABLE public.lead_offers FROM anon, authenticated;
REVOKE ALL ON TABLE public.lead_status_history FROM anon, authenticated;

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.referral_codes FROM anon, authenticated;
REVOKE ALL ON TABLE public.referrals FROM anon, authenticated;
REVOKE ALL ON TABLE public.blog_articles FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.request_rate_limits (
  scope text NOT NULL,
  identifier_hash text NOT NULL,
  window_started_at timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, identifier_hash, window_started_at)
);

ALTER TABLE public.request_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.request_rate_limits FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_request_rate_limit(
  p_scope text,
  p_identifier_hash text,
  p_limit integer,
  p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window timestamptz;
  v_count integer;
BEGIN
  IF p_limit < 1 OR p_window_seconds < 1 THEN
    RETURN false;
  END IF;

  v_window := to_timestamp(
    floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds
  );

  INSERT INTO public.request_rate_limits (
    scope, identifier_hash, window_started_at, request_count, updated_at
  )
  VALUES (p_scope, p_identifier_hash, v_window, 1, now())
  ON CONFLICT (scope, identifier_hash, window_started_at)
  DO UPDATE SET
    request_count = public.request_rate_limits.request_count + 1,
    updated_at = now()
  RETURNING request_count INTO v_count;

  DELETE FROM public.request_rate_limits
  WHERE updated_at < now() - interval '7 days';

  RETURN v_count <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_request_rate_limit(text, text, integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_request_rate_limit(text, text, integer, integer)
  TO service_role;
