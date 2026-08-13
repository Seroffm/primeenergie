-- A lead may have only one active referral code. Without this constraint,
-- concurrent requests can both pass the read check and create duplicate codes.

UPDATE public.referral_codes
SET is_active = false
WHERE is_active = true
  AND expires_at <= now();

WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY lead_id
      ORDER BY expires_at DESC, created_at DESC, id DESC
    ) AS position
  FROM public.referral_codes
  WHERE is_active = true
)
UPDATE public.referral_codes AS codes
SET is_active = false
FROM ranked
WHERE codes.id = ranked.id
  AND ranked.position > 1;

CREATE UNIQUE INDEX IF NOT EXISTS referral_codes_one_active_per_lead_idx
  ON public.referral_codes (lead_id)
  WHERE is_active = true;
