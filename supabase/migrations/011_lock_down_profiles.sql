-- Prevent self-service role escalation and accidental staff account creation.
-- All profile reads and writes are performed by server routes with the service role.

DROP POLICY IF EXISTS "profiles: eigenes Profil aktualisieren" ON public.profiles;
DROP POLICY IF EXISTS "profiles: eigenes Profil lesen" ON public.profiles;

REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;

-- New auth users must be explicitly activated by an administrator. This is a
-- second line of defence in case hosted Auth signup is enabled accidentally.
ALTER TABLE public.profiles
  ALTER COLUMN is_active SET DEFAULT false;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, full_name, email, role, is_active)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.email, ''),
    'employee',
    false
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN new;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Cleanup in the durable rate-limit function filters by updated_at on every
-- request. The index prevents that cleanup from degrading into repeated full
-- table scans as identifiers accumulate.
CREATE INDEX IF NOT EXISTS request_rate_limits_updated_at_idx
  ON public.request_rate_limits (updated_at);
