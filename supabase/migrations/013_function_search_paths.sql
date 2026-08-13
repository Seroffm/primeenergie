-- Pin trigger function lookup paths so object names cannot be redirected through
-- a caller-controlled schema.
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.update_referrals_updated_at() SET search_path = public;
ALTER FUNCTION public.update_blog_articles_updated_at() SET search_path = public;
