CREATE TABLE IF NOT EXISTS public.blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title text NOT NULL,
  teaser text NOT NULL,
  tag text NOT NULL DEFAULT 'Allgemein',
  image text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'EnergieClever Redaktion',
  body jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_title text,
  seo_description text,
  read_time_min integer NOT NULL DEFAULT 5,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_articles_slug_unique UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON public.blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON public.blog_articles(is_published, published_at DESC);

CREATE OR REPLACE FUNCTION public.update_blog_articles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_blog_articles_updated_at ON public.blog_articles;
CREATE TRIGGER trg_blog_articles_updated_at
  BEFORE UPDATE ON public.blog_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_blog_articles_updated_at();
