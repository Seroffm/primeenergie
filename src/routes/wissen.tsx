import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Zap, Flame, Sun, TrendingDown, FileText, Leaf } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-wissen.jpg";
import { getPublishedArticles } from "@/lib/api-client";
import type { BlogArticle } from "@/lib/api-types";

export const Route = createFileRoute("/wissen")({
  head: () => ({
    meta: [
      { title: "Wissen: Ratgeber rund um Energie | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Ratgeber, Erklärartikel und Marktupdates rund um Strom, Gas, Solar und Wärmepumpe. Verständlich geschrieben, sorgfältig recherchiert.",
      },
      { property: "og:title", content: "Energie-Wissen & Ratgeber | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Verständlich erklärt: Strom, Gas, Solar, Wärmepumpe und mehr.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1488998527040-85054a85150e?w=1200&h=630&fit=crop&q=80",
      },
    ],
  }),
  component: WissenPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const categories = [
  { icon: Zap, label: "Strom", to: "/strom", color: "from-amber-400/20 to-amber-400/5" },
  { icon: Flame, label: "Gas", to: "/gas", color: "from-orange-400/20 to-orange-400/5" },
  { icon: Sun, label: "Solar", to: "/solar", color: "from-yellow-400/20 to-yellow-400/5" },
  { icon: TrendingDown, label: "Sparen", to: "/faq", color: "from-success/20 to-success/5" },
  { icon: FileText, label: "Verträge", to: "/ablauf", color: "from-primary/20 to-primary/5" },
  {
    icon: Leaf,
    label: "Nachhaltig",
    to: "/ueber-uns",
    color: "from-emerald-400/20 to-emerald-400/5",
  },
];

type ArticleCard = {
  title: string;
  teaser: string;
  image: string;
  tag: string;
  read: string;
  slug: string;
};

function mapDbArticle(a: BlogArticle): ArticleCard {
  return {
    slug: a.slug,
    title: a.title,
    teaser: a.teaser,
    tag: a.tag,
    image: a.image,
    read: `${a.read_time_min} min`,
  };
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card animate-pulse">
      <div className="aspect-[16/10] bg-muted" />
      <div className="p-6 space-y-2">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-5 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>
    </div>
  );
}

function WissenPage() {
  const { location } = useRouterState();
  if (location.pathname !== "/wissen") return <Outlet />;

  const { data: dbArticles, isLoading } = useQuery({
    queryKey: ["blog-articles"],
    queryFn: () => getPublishedArticles(),
    retry: false,
  });

  const articles: ArticleCard[] = (dbArticles ?? []).map(mapDbArticle);
  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <SiteLayout>
      <TopicHero
        kicker="Energie verstehen"
        title={<>Wissen, das wirklich Strom spart.</>}
        lead="Ratgeber, Marktanalysen und Erklärartikel. Verständlich geschrieben, sorgfältig recherchiert. Damit Sie wissen, was Sie unterschreiben."
        image={heroImg}
        imageAlt="Aufgeschlagenes Buch und Lesebrille auf Holztisch"
        Icon={BookOpen}
        primaryCta={{ to: "/", label: "Direkt zur Tarifprüfung" }}
        secondaryCta={{ to: "/faq", label: "Zur FAQ" }}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <motion.div
              key={c.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.03 }}
            >
              <Link
                to={c.to}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-success/40"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-success ring-1 ring-success/20`}
                >
                  <c.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-semibold text-primary group-hover:text-success">
                  {c.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Article */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-primary md:text-3xl">Im Fokus</h2>
          <Link to="/wissen" className="text-sm font-semibold text-success hover:underline">
            Alle Themen <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-card md:grid-cols-2 animate-pulse">
            <div className="aspect-video bg-muted md:aspect-auto" />
            <div className="flex flex-col justify-center p-8 space-y-4 md:p-12">
              <div className="h-4 w-28 rounded-full bg-muted" />
              <div className="h-8 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </div>
        ) : featured ? (
          <motion.article
            {...fadeUp}
            className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-card md:grid-cols-2"
          >
            <div className="overflow-hidden">
              <img
                src={featured.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                {featured.tag} · {featured.read}
              </div>
              <h3 className="mt-5 text-2xl font-bold text-primary md:text-3xl">{featured.title}</h3>
              <p className="mt-4 text-muted-foreground">{featured.teaser}</p>
              <Link
                to="/wissen/$slug"
                params={{ slug: featured.slug }}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-success hover:underline"
              >
                Artikel lesen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        ) : null}
      </section>

      {/* Article Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-primary md:text-3xl">Beliebte Artikel</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : rest.map((a, i) => (
                <motion.article
                  key={a.slug}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:border-success/40 hover:shadow-card"
                >
                  <Link to="/wissen/$slug" params={{ slug: a.slug }} className="block">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={a.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-success">
                        {a.tag} · {a.read}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold leading-snug text-primary group-hover:text-success">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.teaser}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20 md:pb-24">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 p-8 text-primary-foreground shadow-card md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <BookOpen className="h-10 w-10 text-success" />
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">Lieber direkt sparen?</h2>
              <p className="mt-3 text-primary-foreground/80">
                Lassen Sie Ihren Tarif in nur 2 Minuten prüfen. Möglich sind bis zu 850 € Ersparnis
                pro Jahr.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-success px-6 py-3 text-sm font-bold text-success-foreground transition hover:bg-success/90"
            >
              Jetzt Tarif prüfen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-5xl px-4 pb-20 md:pb-24">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-12">
          <div className="max-w-xl">
            <BookOpen className="h-10 w-10 text-success" />
            <h2 className="mt-4 text-2xl font-bold text-primary md:text-3xl">
              Newsletter: Energie-Tipps direkt ins Postfach
            </h2>
            <p className="mt-3 text-muted-foreground">
              Keine Werbung, kein Spam — nur relevante Energietipps und Marktentwicklungen. Monatlich, abbestellbar jederzeit.
            </p>
          </div>
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Danke! Sie erhalten bald unseren Newsletter.");
            }}
          >
            <input
              type="email"
              required
              placeholder="Ihre E-Mail-Adresse"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-success/40"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-success px-6 py-3 text-sm font-bold text-success-foreground transition hover:bg-success/90"
            >
              Anmelden <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
