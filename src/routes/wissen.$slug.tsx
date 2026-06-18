import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { getArticleBySlug, getPublishedArticles, ApiError } from "@/lib/api-client";

export const Route = createFileRoute("/wissen/$slug")({
  head: () => ({
    meta: [
      { title: "Energie-Wissen & Ratgeber | PRIME ENERGIE" },
      {
        name: "description",
        content: "Ratgeber, Erklärartikel und Marktupdates rund um Strom, Gas, Solar und Wärmepumpe.",
      },
    ],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-primary">Artikel nicht gefunden</h1>
        <p className="mt-4 text-muted-foreground">Diesen Beitrag gibt es leider nicht (mehr).</p>
        <Button asChild className="mt-6">
          <Link to="/wissen">Zur Wissens-Übersicht</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = useParams({ from: "/wissen/$slug" });

  const { data: article, isError, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => getArticleBySlug(slug),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 2;
    },
  });

  const { data: allArticles } = useQuery({
    queryKey: ["blog-articles"],
    queryFn: () => getPublishedArticles(),
    retry: false,
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-20 animate-pulse space-y-6">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="aspect-[16/9] w-full rounded-3xl bg-muted" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/6 rounded bg-muted" />
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!article || isError) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-primary">Artikel nicht gefunden</h1>
          <p className="mt-4 text-muted-foreground">Diesen Beitrag gibt es leider nicht (mehr).</p>
          <Button asChild className="mt-6">
            <Link to="/wissen">Zur Wissens-Übersicht</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date(article.created_at).toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const relatedArticles = allArticles
    ? allArticles
        .filter((x) => x.slug !== slug && x.tag === article.tag)
        .slice(0, 4)
    : [];

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div className="flex items-center gap-3">
          <Link
            to="/wissen"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-success"
          >
            <ArrowLeft className="h-4 w-4" /> Alle Artikel
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            {article.tag}
          </div>
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-primary md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{article.teaser}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {article.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {article.read_time_min} min Lesezeit
          </span>
        </div>
        {article.image && (
          <div className="mt-8 overflow-hidden rounded-3xl">
            <img src={article.image} alt="" className="w-full" />
          </div>
        )}

        <div className="prose prose-lg mt-10 max-w-none">
          {article.body.map((section) => (
            <div key={section.heading} className="mt-8 first:mt-0">
              <h2 className="font-display text-2xl font-bold text-primary">{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-foreground/90">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary to-primary/90 p-8 text-primary-foreground md:p-12">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Lieber direkt sparen?</h2>
          <p className="mt-3 text-primary-foreground/80">
            2 Minuten Tarifprüfung. Bis zu 850 € Ersparnis pro Jahr.
          </p>
          <Button asChild className="mt-6 bg-success text-success-foreground hover:bg-success/90">
            <Link to="/angebot">
              Jetzt Tarif prüfen <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-xl font-bold text-primary">Weitere Artikel</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {relatedArticles.map((o) => (
                <Link
                  key={o.slug}
                  to="/wissen/$slug"
                  params={{ slug: o.slug }}
                  className="group rounded-xl border bg-card p-4 transition hover:border-success/40"
                >
                  <div className="text-xs font-semibold text-success">{o.tag}</div>
                  <div className="mt-1 font-semibold text-primary group-hover:text-success">
                    {o.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </SiteLayout>
  );
}
