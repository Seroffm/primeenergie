import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function TopicHero({
  kicker,
  title,
  lead,
  image,
  imageAlt,
  primaryCta = { to: "/angebot", label: "Jetzt Tarif prüfen" },
  secondaryCta,
  Icon,
}: {
  kicker: string;
  title: ReactNode;
  lead: string;
  image: string;
  imageAlt: string;
  primaryCta?: { to: string; label: string };
  secondaryCta?: { to: string; label: string };
  Icon?: LucideIcon;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-14 md:py-24">
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-xs font-medium text-success">
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null} {kicker}
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-primary md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              <Link to={primaryCta.to}>
                {primaryCta.label} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {secondaryCta && (
              <Button asChild size="lg" variant="outline">
                <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-success/20 via-success/5 to-transparent blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-border shadow-card">
            <img
              src={image}
              alt={imageAlt}
              width={1600}
              height={900}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function FeatureGrid({
  title,
  intro,
  items,
}: {
  title: string;
  intro?: string;
  items: { icon: LucideIcon; title: string; desc: string }[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-primary md:text-4xl">{title}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.05 }}
            className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-success/40 hover:shadow-card"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success/15 to-success/5 text-success ring-1 ring-success/20">
              <it.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-primary">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ImageSplit({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  bullets,
  reverse = false,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  bullets?: string[];
  reverse?: boolean;
}) {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div
          className={`grid items-center gap-10 md:grid-cols-2 md:gap-14 ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}
        >
          <motion.div {...fadeUp}>
            {eyebrow && (
              <div className="text-xs font-bold uppercase tracking-wider text-success">
                {eyebrow}
              </div>
            )}
            <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">{title}</h2>
            <p className="mt-5 text-muted-foreground">{body}</p>
            {bullets && (
              <ul className="mt-6 space-y-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-foreground/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" /> {b}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="overflow-hidden rounded-3xl border border-border shadow-card"
          >
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              width={1600}
              height={1200}
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ title, body, image }: { title: string; body: string; image: string }) {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={image}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-primary/85" />
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-primary-foreground md:py-28">
        <motion.h2 {...fadeUp} className="text-3xl font-bold md:text-5xl">
          {title}
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="mx-auto mt-4 max-w-2xl text-primary-foreground/90"
        >
          {body}
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="bg-success text-success-foreground hover:bg-success/90"
          >
            <Link to="/angebot">
              Jetzt Tarif prüfen <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
          >
            <Link to="/kontakt">Berater kontaktieren</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
