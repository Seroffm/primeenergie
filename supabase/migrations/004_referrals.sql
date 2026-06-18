-- Referral-Codes: ein Code pro Lead (generiert nach status=completed)
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  code text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz NOT NULL DEFAULT (now() + INTERVAL '90 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT referral_codes_code_unique UNIQUE (code)
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_lead_id ON public.referral_codes(lead_id);

-- Referral-Transaktionen
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  referred_lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  code_used text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'qualified', 'paid', 'expired')),
  reward_amount_cents integer NOT NULL DEFAULT 3000,
  reward_type text NOT NULL DEFAULT 'amazon_voucher',
  payout_after timestamptz,
  paid_at timestamptz,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_lead_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_lead_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(code_used);

CREATE OR REPLACE FUNCTION public.update_referrals_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_referrals_updated_at ON public.referrals;
CREATE TRIGGER trg_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_referrals_updated_at();
