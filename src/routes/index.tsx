import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Flame,
  Layers,
  Briefcase,
  Home,
  Building2,
  TrendingDown,
  AlertTriangle,
  FileSearch,
  Star,
  ShieldCheck,
  BadgeCheck,
  Award,
  Phone,
  MapPin,
  PhoneCall,
  FileSignature,
  PlugZap,
  Users,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { cn } from "@/lib/utils";
import solutionAutostrom from "@/assets/solution-autostrom.jpg";
import solutionWaermestrom from "@/assets/solution-waermestrom.jpg";
import solutionSolar from "@/assets/solution-solar.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import finalCtaBg from "@/assets/final-cta-bg.jpg";
import comparisonHero from "@/assets/comparison-hero.jpg";

import { z } from "zod";

const homeSearchSchema = z
  .object({
    start: z.enum(["strom", "gas", "beides", "gewerbe"]).optional(),
    plz: z.string().optional(),
    kwh: z.coerce.number().int().positive().optional(),
  })
  .optional();

export const Route = createFileRoute("/")({
  validateSearch: (s) => homeSearchSchema.parse(s) ?? {},
  head: () => ({
    meta: [
      { title: "PRIME ENERGIE | Strom & Gas vergleichen, bis zu 850 € sparen" },
      {
        name: "description",
        content:
          "Kostenloser Strom- und Gasvergleich mit persönlicher Beratung. Geprüfte Anbieter, einfacher Wechsel, keine Versorgungslücke.",
      },
      {
        property: "og:title",
        content: "PRIME ENERGIE | Strom & Gas vergleichen, bis zu 850 € sparen",
      },
      {
        property: "og:description",
        content:
          "Kostenloser Strom- und Gasvergleich mit persönlicher Beratung. Geprüfte Anbieter, einfacher Wechsel, keine Versorgungslücke.",
      },
    ],
  }),
  component: HomePage,
});

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

type Energy = "strom" | "gas" | "beides";

function LazyLottie({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    if (idle) idle(() => setReady(true));
    else setTimeout(() => setReady(true), 150);
  }, [visible]);

  return (
    <div ref={ref} className="h-full w-full">
      {ready && <DotLottieReact src={src} loop autoplay className="h-full w-full" />}
    </div>
  );
}

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <BenefitsSection />
      <AudienceSection />
      <StatsBand />
      <PriceBreakdown />
      <Testimonials />
      <MoreSolutions />
      <RatgeberSection />
      <FaqSection />
      <ContactSection />
      <WechselCta />
      <FinalCta />
    </SiteLayout>
  );
}

/* ---------------------------------- HERO ---------------------------------- */

function Hero() {
  const [bgReady, setBgReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = heroBg;
    if (img.decode) {
      img
        .decode()
        .then(() => setBgReady(true))
        .catch(() => setBgReady(true));
    } else {
      img.onload = () => setBgReady(true);
      img.onerror = () => setBgReady(true);
    }
    // Failsafe
    const t = setTimeout(() => setBgReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 38%, rgba(255,255,255,0.4) 70%, rgba(255,255,255,0.15) 100%), linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(255,255,255,0.95) 100%), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-success/20 blur-3xl"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 md:pt-20 md:pb-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: bgReady ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <BadgeCheck className="h-3.5 w-3.5" /> TÜV-geprüfte Anbieter · Kostenlos
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-primary md:text-6xl">
              Strom & Gas in 2 Minuten <span className="text-success">vergleichen.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Bis zu <strong className="text-primary">850 € pro Jahr</strong> sparen. Mit
              persönlicher Beratung statt Tariflotterie. Unabhängig, transparent und ohne versteckte
              Kosten.
            </p>

            <ul className="mt-6 grid max-w-md gap-2.5 text-sm">
              {[
                "Persönlicher Berater statt anonymes Vergleichsportal",
                "Komplette Wechselabwicklung inkl. Kündigung",
                "Keine Versorgungslücke. Garantiert",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-success" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["S", "M", "L", "K"].map((c, i) => (
                  <div
                    key={i}
                    className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary text-xs font-semibold text-primary-foreground"
                  >
                    {c}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-success">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <div className="text-xs">
                  <strong className="text-primary">4,8 / 5</strong> · 12.400 zufriedene Kunden
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Calculator (Check24-Style) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: bgReady ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
          >
            <QuickCalculator />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function QuickCalculator() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { start?: Energy; plz?: string; kwh?: number } | undefined;
  const [energy, setEnergy] = useState<Energy>(
    search?.start === "gas" || search?.start === "beides" ? search.start : "strom",
  );
  const [plz, setPlz] = useState((search?.plz ?? "").replace(/\D/g, "").slice(0, 5));
  const [kwh, setKwh] = useState<number>(search?.kwh ?? 2500);
  const [plzError, setPlzError] = useState<string | null>(null);

  const tabs: { k: Energy; label: string; icon: typeof Zap }[] = [
    { k: "strom", label: "Strom", icon: Zap },
    { k: "gas", label: "Gas", icon: Flame },
    { k: "beides", label: "Strom & Gas", icon: Layers },
  ];

  const kwhPresets =
    energy === "gas" ? [5000, 12000, 18000, 25000, 35000] : [1500, 2500, 3500, 4500, 5500];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}$/.test(plz)) {
      setPlzError("Bitte gib deine 5-stellige Postleitzahl ein.");
      return;
    }
    setPlzError(null);
    navigate({
      to: "/angebot",
      search: { start: energy, plz, kwh: kwh || undefined } as never,
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-1.5 shadow-hero">
      <div className="rounded-xl bg-card p-5 md:p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-lg font-bold text-primary">Tarifrechner</div>
            <div className="text-xs text-muted-foreground">Vergleich in unter 2 Minuten</div>
          </div>
          <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            bis 850 € sparen
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-3 rounded-lg bg-surface p-1">
          {tabs.map((t) => {
            const active = energy === t.k;
            return (
              <button
                key={t.k}
                type="button"
                onClick={() => setEnergy(t.k)}
                className="relative flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium"
              >
                {active && (
                  <motion.div
                    layoutId="energy-tab-pill"
                    className="absolute inset-0 rounded-md bg-background shadow-soft"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <t.icon
                  className={cn(
                    "relative z-10 h-4 w-4 transition-colors duration-200",
                    active ? "text-success" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "relative z-10 transition-colors duration-200",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} noValidate className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Postleitzahl <span className="text-success">*</span>
            </label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                inputMode="numeric"
                maxLength={5}
                aria-required="true"
                aria-invalid={!!plzError}
                value={plz}
                onChange={(e) => {
                  setPlz(e.target.value.replace(/\D/g, ""));
                  if (plzError) setPlzError(null);
                }}
                placeholder="z. B. 10115"
                className={cn(
                  "h-12 pl-9 text-base",
                  plzError && "border-destructive focus-visible:ring-destructive",
                )}
              />
            </div>
            {plzError && <p className="mt-1.5 text-xs font-medium text-destructive">{plzError}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Jahresverbrauch · {kwh.toLocaleString("de-DE")} kWh
            </label>

            <div className="mt-2 flex flex-wrap gap-2">
              {kwhPresets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setKwh(p)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition",
                    kwh === p
                      ? "border-success bg-success/10 text-success"
                      : "border-border text-muted-foreground hover:border-success/50 hover:text-primary",
                  )}
                >
                  {p.toLocaleString("de-DE")} kWh
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full bg-success text-base font-semibold text-success-foreground shadow-soft hover:bg-success/90"
          >
            Tarife vergleichen <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <p className="text-[11px] text-muted-foreground">
            <span className="text-success">*</span> Pflichtfeld
          </p>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-success" /> SSL-verschlüsselt
          </span>
          <span className="inline-flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5 text-success" /> DSGVO-konform
          </span>
          <span className="inline-flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-success" /> Geprüfte Anbieter
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- TRUST STRIP ------------------------------ */

function TrustStrip() {
  const items = [
    { icon: BadgeCheck, label: "Kostenlos" },
    { icon: ShieldCheck, label: "TÜV-zertifizierter Vergleich" },
    { icon: Award, label: "Über 1.200 geprüfte Tarife" },
    { icon: CheckCircle2, label: "Keine Versorgungsunterbrechung" },
    { icon: Star, label: "4,8 / 5 (12.400 Bewertungen)" },
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-sm text-muted-foreground">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2">
            <i.icon className="h-4 w-4 text-success" />
            <span className="font-medium">{i.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ HOW IT WORKS ------------------------------ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: FileSearch,
      t: "Daten eingeben",
      k: "~ 90 Sek.",
      d: "PLZ, Jahresverbrauch und Wunsch. Fertig. Keine Registrierung, keine Zwangsfelder.",
      bullets: ["Online oder telefonisch", "Auch ohne alte Rechnung", "Verschlüsselte Übertragung"],
    },
    {
      n: "02",
      icon: PhoneCall,
      t: "Persönliches Angebot",
      k: "≤ 24 Std.",
      d: "Ein echter Berater prüft 1.200+ Tarife manuell und ruft mit dem besten Vorschlag zurück.",
      bullets: [
        "Vergleich inkl. Kleingedrucktem",
        "Lockboni ausgeschlossen",
        "Festpreisgarantie möglich",
      ],
    },
    {
      n: "03",
      icon: FileSignature,
      t: "Wechseln & sparen",
      k: "Ø 380 €/Jahr",
      d: "Wir übernehmen Kündigung beim Altanbieter und Anmeldung beim Neuen. Sie machen nichts.",
      bullets: ["Lückenlose Versorgung", "Schriftliche Bestätigung", "Erinnerung vor Vertragsende"],
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          <Sparkles className="h-3.5 w-3.5" /> So funktioniert es
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl">
          Drei Schritte. <span className="text-success">Null</span> Papierkram.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Links siehst du, was wir kombinieren. Rechts, wie es im Detail abläuft.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* LEFT — 3 clean step cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center rounded-3xl bg-success-soft p-6 sm:p-10"
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {steps.map((s, i) => {
              const Ic = s.icon;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative grid aspect-square w-full max-w-[110px] place-items-center rounded-2xl bg-card shadow-soft ring-1 ring-border/40">
                    <Ic className="h-7 w-7 text-success sm:h-9 sm:w-9 md:h-10 md:w-10" />
                  </div>
                  <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-success sm:text-xs">
                    Schritt {s.n}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-primary sm:text-base">{s.t}</div>
                </motion.div>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-sm text-center text-sm text-muted-foreground">
            Dein Wunsch + unser Marktcheck + persönliche Betreuung. Alles in einem Paket.
          </p>
        </motion.div>

        {/* RIGHT. Accordion card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"
        >
          <h3 className="font-display text-xl font-bold text-primary sm:text-2xl">
            So läuft dein Wechsel:
          </h3>

          <Accordion type="single" collapsible defaultValue="step-0" className="mt-4 flex-1">
            {steps.map((s, i) => {
              const Ic = s.icon;
              return (
                <AccordionItem
                  key={s.n}
                  value={`step-${i}`}
                  className="border-b border-border last:border-b-0"
                >
                  <AccordionTrigger className="py-4 text-left hover:no-underline">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-success/10 font-display text-sm font-bold text-success">
                        {s.n}
                      </span>
                      <span className="min-w-0 truncate font-display text-base font-bold text-primary sm:text-lg">
                        {s.t}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success text-success-foreground">
                        <Ic className="h-5 w-5" />
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                    </div>
                    <ul className="mt-4 grid gap-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span className="min-w-0">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary">
                      <span className="uppercase tracking-wider text-muted-foreground">Dauer</span>
                      <span>{s.k}</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <Button
            asChild
            className="mt-6 w-full bg-success text-success-foreground hover:bg-success/90 sm:w-auto sm:self-start"
          >
            <Link to="/angebot">
              Jetzt passendes Angebot sichern <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- BENEFITS -------------------------------- */

function BenefitsSection() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <TrendingDown className="h-3.5 w-3.5" /> Spar-Rechner
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl">
            Wie viel <span className="text-success">sparst du</span>?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Verschieben Sie die Regler. Wir rechnen live.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <SavingsCalculator />
          <ComparisonCard />
        </div>
      </div>
    </section>
  );
}

function SavingsCalculator() {
  const [persons, setPersons] = useState(3);
  const [kwh, setKwh] = useState(3500);
  const [energy, setEnergy] = useState<"strom" | "gas">("strom");

  const result = useMemo(() => {
    const pricePerKwh = energy === "strom" ? 0.41 : 0.12;
    const cleverPrice = energy === "strom" ? 0.31 : 0.085;
    const base = energy === "strom" ? 145 : 110;
    const grund = Math.round(base + kwh * pricePerKwh);
    const portal = Math.round(grund * 0.87);
    const clever = Math.round(base + kwh * cleverPrice);
    const saved = grund - clever;
    return { grund, portal, clever, saved };
  }, [kwh, energy]);

  const max = Math.max(result.grund, result.portal, result.clever);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card md:p-9">
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-success/10 blur-3xl"
        aria-hidden
      />

      {/* Energy switch */}
      <div className="relative flex items-center justify-between">
        <div className="inline-flex rounded-full bg-surface p-1">
          {(["strom", "gas"] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                setEnergy(e);
                setKwh(e === "gas" ? 14000 : 3500);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition",
                energy === e
                  ? "bg-card text-primary shadow-soft"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              {e === "strom" ? <Zap className="h-3.5 w-3.5" /> : <Flame className="h-3.5 w-3.5" />}
              {e === "strom" ? "Strom" : "Gas"}
            </button>
          ))}
        </div>
        <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          Live-Rechnung
        </div>
      </div>

      {/* Persons slider */}
      <div className="relative mt-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Users className="h-4 w-4 text-success" /> Personen im Haushalt
          </div>
          <div className="font-display text-xl font-extrabold tabular-nums text-primary">
            {persons}
          </div>
        </div>
        <Slider
          value={[persons]}
          min={1}
          max={6}
          step={1}
          onValueChange={(v) => {
            const p = v[0];
            setPersons(p);
            const map =
              energy === "gas"
                ? { 1: 5000, 2: 9000, 3: 14000, 4: 18000, 5: 22000, 6: 26000 }
                : { 1: 1500, 2: 2500, 3: 3500, 4: 4500, 5: 5500, 6: 6500 };
            setKwh(map[p as 1 | 2 | 3 | 4 | 5 | 6]);
          }}
          className="mt-4"
        />
        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6+</span>
        </div>
      </div>

      {/* kWh slider */}
      <div className="relative mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <PlugZap className="h-4 w-4 text-success" /> Jahresverbrauch
          </div>
          <div className="font-display text-xl font-extrabold tabular-nums text-primary">
            {kwh.toLocaleString("de-DE")}{" "}
            <span className="text-sm font-bold text-muted-foreground">kWh</span>
          </div>
        </div>
        <Slider
          value={[kwh]}
          min={energy === "gas" ? 3000 : 1000}
          max={energy === "gas" ? 30000 : 8000}
          step={energy === "gas" ? 500 : 100}
          onValueChange={(v) => setKwh(v[0])}
          className="mt-4"
        />
      </div>

      {/* Live bar chart */}
      <div className="relative mt-8 space-y-3">
        {[
          {
            label: "Grundversorger",
            value: result.grund,
            color: "bg-primary/70",
            text: "text-primary",
          },
          {
            label: "Portal-Tarif",
            value: result.portal,
            color: "bg-primary/40",
            text: "text-primary",
          },
          {
            label: "PRIME ENERGIE",
            value: result.clever,
            color: "bg-success",
            text: "text-success",
            highlight: true,
          },
        ].map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-xs">
              <span
                className={cn(b.highlight ? "font-semibold text-success" : "text-muted-foreground")}
              >
                {b.label}
              </span>
              <span className={cn("font-semibold tabular-nums", b.text)}>
                {b.value.toLocaleString("de-DE")} €/Jahr
              </span>
            </div>
            <div className="mt-1 h-2.5 rounded-full bg-border/60">
              <div
                className={cn("h-full rounded-full transition-all duration-500 ease-out", b.color)}
                style={{ width: `${(b.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Saving callout */}
      <div className="relative mt-7 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-success/15 via-success/10 to-transparent p-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-success">
            Deine Ersparnis
          </div>
          <div className="font-display text-4xl font-extrabold tabular-nums text-primary">
            {result.saved.toLocaleString("de-DE")} €
            <span className="text-base font-bold text-muted-foreground"> / Jahr</span>
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-success text-success-foreground hover:bg-success/90"
        >
          <Link to="/angebot">
            Sichern <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ComparisonCard() {
  const us = [
    "Ein fester Berater begleitet dich. Per Telefon, kein Chatbot.",
    "Wir kündigen deinen Altvertrag und übernehmen den Wechsel komplett.",
    "Tarife werden manuell auf Preisgarantie, Lockboni und Laufzeit geprüft.",
  ];

  return (
    <div className="grid gap-4">
      {/* Wir */}
      <article className="relative overflow-hidden rounded-3xl border border-success/30 bg-card shadow-card">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={comparisonHero}
            alt="Zufriedene Kunden mit persönlicher Energieberatung"
            className="h-full w-full object-cover"
            loading="lazy"
            width={800}
            height={512}
          />
        </div>
        <div className="p-7 md:p-8">
          <header className="flex items-baseline justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-success">
                Mit uns
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold text-primary">PRIME ENERGIE</h3>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-extrabold tabular-nums text-primary">
                100 %
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                kostenlos
              </div>
            </div>
          </header>
          <ul className="mt-5 space-y-3">
            {us.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-foreground">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-success" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>

      {/* Vertrauenssignal */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-muted-foreground">
        <span className="font-semibold tracking-wide text-primary">4,8 / 5</span>
        <span>aus 1.240 verifizierten Bewertungen</span>
        <span className="hidden h-3 w-px bg-border sm:block" />
        <span>Berater Mo–Fr, 8–20 Uhr</span>
      </div>
    </div>
  );
}

/* -------------------------------- AUDIENCE -------------------------------- */

function AudienceSection() {
  const items = [
    {
      icon: Home,
      t: "Privathaushalte",
      d: "Singles, Familien, WGs. Den passenden Tarif für jeden Verbrauch.",
      img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=70",
    },
    {
      icon: Briefcase,
      t: "Gewerbe",
      d: "Sondertarife für Selbstständige, Praxen und kleine Betriebe.",
      img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=70",
    },
    {
      icon: Building2,
      t: "Hausverwaltungen",
      d: "Effizienz für Mehrobjektportfolios mit Bündelung mehrerer Standorte.",
      img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=70",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">
          Für wen wir arbeiten
        </h2>
      </motion.div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((z) => (
          <motion.div
            key={z.t}
            {...fadeUp}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-card"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              <img
                src={z.img}
                alt={z.t}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-card/95 text-success shadow-soft">
                <z.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold text-primary">{z.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{z.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- STATS ------------------------------- */

function StatsBand() {
  const stats = [
    { v: "50.000+", l: "Erfolgreiche Wechsel", sub: "seit 2018" },
    { v: "380 €", l: "Ø Ersparnis pro Jahr", sub: "pro Haushalt" },
    { v: "4,8 ★", l: "Kundenzufriedenheit", sub: "2.400+ Bewertungen" },
    { v: "100 %", l: "Kostenlos & unverbindlich", sub: "kein Risiko, kein Haken" },
  ];

  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-6xl px-4">
        {/* Headline only — no eyebrow, no split */}
        <div className="border-b border-white/[0.08] py-14">
          <h2 className="font-display text-3xl font-extrabold text-primary-foreground md:text-4xl">
            Zahlen, die für sich sprechen.
          </h2>
        </div>

        {/* Stats — gap-px creates 1 px hairline dividers between all cells */}
        <div className="grid grid-cols-2 gap-px bg-white/[0.06] lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col bg-primary px-6 py-12 md:px-8 md:py-16"
            >
              <span className="font-display text-5xl font-extrabold leading-none text-success md:text-[3.25rem]">
                {s.v}
              </span>
              <span className="mt-5 text-sm font-semibold text-primary-foreground/80">
                {s.l}
              </span>
              <span className="mt-1.5 text-xs text-primary-foreground/40">
                {s.sub}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- PRICE BREAKDOWN ---------------------------- */

type Slice = {
  key: string;
  label: string;
  short: string;
  value: number;
  color: string;
  desc: string;
};

function PriceBreakdown() {
  const slices: Slice[] = [
    {
      key: "beschaffung",
      label: "Beschaffung & Vertrieb",
      short: "Energiekosten",
      value: 43,
      color: "#00c389",
      desc: "Einkauf der Energie an der Strombörse, Vertrieb, Service und Marge des Versorgers. Hier liegt das größte Sparpotenzial beim Anbieterwechsel.",
    },
    {
      key: "netz",
      label: "Netzentgelte & Messung",
      short: "Netz & Messung",
      value: 26,
      color: "#0b3b2e",
      desc: "Regulierte Gebühren für die Nutzung der Strom- und Gasnetze sowie Messstellenbetrieb. Fix pro Region. Unabhängig vom Anbieter.",
    },
    {
      key: "steuern",
      label: "Steuern, Abgaben & Umlagen",
      short: "Steuern & Abgaben",
      value: 31,
      color: "#e8a64b",
      desc: "Stromsteuer, Konzessionsabgabe, KWKG-, Offshore- und §19-Umlage sowie Mehrwertsteuer. Gesetzlich festgelegt, für alle Anbieter gleich.",
    },
  ];

  const [active, setActive] = useState<string>("beschaffung");
  const current = slices.find((s) => s.key === active) ?? slices[0];

  // Donut geometry
  const size = 320;
  const stroke = 46;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = slices.map((s) => {
    const len = (s.value / 100) * circumference;
    const seg = {
      ...s,
      dasharray: `${len} ${circumference - len}`,
      dashoffset: -offset,
    };
    offset += len;
    return seg;
  });

  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-success">
            Transparenz
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Wie setzt sich dein Strompreis zusammen?
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Nur ein Bruchteil deiner Stromrechnung geht an den Anbieter selbst. Der Rest sind Netze
            und Steuern. Genau hier setzen wir an.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="grid items-center gap-12 rounded-3xl border border-border bg-background p-6 md:grid-cols-2 md:p-12"
        >
          {/* Donut */}
          <div className="relative mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth={stroke}
              />
              {segments.map((s) => {
                const isActive = s.key === active;
                return (
                  <circle
                    key={s.key}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={stroke}
                    strokeDasharray={s.dasharray}
                    strokeDashoffset={s.dashoffset}
                    strokeLinecap="butt"
                    className="cursor-pointer transition-opacity duration-300"
                    style={{ opacity: isActive ? 1 : 0.35 }}
                    onMouseEnter={() => setActive(s.key)}
                    onClick={() => setActive(s.key)}
                  />
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-bold tracking-tight md:text-6xl">
                {current.value}
                <span className="text-2xl md:text-3xl">%</span>
              </div>
              <div className="mt-1 max-w-[55%] text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {current.short}
              </div>
            </div>
          </div>

          {/* Legend / details */}
          <div>
            <div className="space-y-2">
              {slices.map((s) => {
                const isActive = s.key === active;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onMouseEnter={() => setActive(s.key)}
                    onClick={() => setActive(s.key)}
                    className={cn(
                      "group flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all",
                      isActive
                        ? "border-foreground/15 bg-muted/60 shadow-sm"
                        : "border-transparent hover:bg-muted/40",
                    )}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="flex-1 text-sm font-semibold md:text-base">{s.label}</span>
                    <span className="text-base font-bold tabular-nums md:text-lg">{s.value}%</span>
                  </button>
                );
              })}
            </div>

            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-2xl bg-muted/50 p-5 text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              {current.desc}
            </motion.div>

            <p className="mt-6 text-xs text-muted-foreground">
              Beispielhafte Aufteilung für einen Jahresverbrauch von 2.900 kWh. Anteile variieren je
              nach Tarif und Netzgebiet.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------- TESTIMONIALS ----------------------------- */

function Testimonials() {
  const items = [
    {
      n: "Sandra K.",
      c: "Familie, München",
      t: "Innerhalb eines Tages hatte ich ein passendes Angebot. Spare jetzt 520 € im Jahr. Ohne Stress.",
    },
    {
      n: "Markus B.",
      c: "Inhaber Café, Köln",
      t: "Endlich Klartext statt Klick-Strecke. Die Gewerbeberatung war Gold wert.",
    },
    {
      n: "Familie Weiß",
      c: "Hannover",
      t: "Komplett ohne Aufwand. Kündigung beim alten Anbieter haben sie für uns übernommen.",
    },
  ];
  return (
    <section className="bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">
            Was Kunden über uns sagen
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((r) => (
            <motion.div
              key={r.n}
              {...fadeUp}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex gap-0.5 text-success">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">„{r.t}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {r.n.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">{r.n}</div>
                  <div className="text-xs text-muted-foreground">{r.c}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- MORE SOLUTIONS ----------------------------- */

function MoreSolutions() {
  const items = [
    {
      img: solutionAutostrom,
      title: "Autostrom",
      bullets: [
        "Zuhause und unterwegs laden",
        "Sondertarif für E-Auto-Halter",
        "100 % Ökostrom aus Europa",
      ],
      cta: "Zum Autostrom",
      to: "/angebot",
    },
    {
      img: solutionWaermestrom,
      title: "Wärmestrom",
      bullets: [
        "Günstiger heizen mit Strom",
        "Für Wärmepumpe & Nachtspeicher",
        "Alternativ zum Haushaltsstrom",
      ],
      cta: "Zum Wärmestrom",
      to: "/angebot",
    },
    {
      img: solutionSolar,
      title: "Solaranlage",
      bullets: [
        "Solaranlage kaufen oder mieten",
        "Mit geprüften Fach-Partnern",
        "Nachhaltig und unabhängig",
      ],
      cta: "Jetzt beraten lassen",
      to: "/kontakt",
    },
  ];

  return (
    <section className="bg-success-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.h2
          {...fadeUp}
          className="max-w-3xl font-display text-3xl font-extrabold leading-tight text-primary md:text-5xl"
        >
          Noch mehr clevere Energie-Lösungen<span className="text-success">.</span>
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="aspect-[4/3] overflow-hidden bg-success-soft">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display text-3xl font-extrabold text-primary">
                  {it.title}
                  <span className="text-success">.</span>
                </h3>
                <ul className="mt-6 space-y-3 text-[15px] text-foreground">
                  {it.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-success" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-2">
                  <Link
                    to={it.to}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-success px-6 py-3 text-sm font-semibold text-primary transition hover:bg-success hover:text-success-foreground"
                  >
                    {it.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- RATGEBER -------------------------------- */

function RatgeberSection() {
  const items = [
    {
      t: "Anbieterwechsel: Schritt für Schritt",
      d: "So läuft Ihr Wechsel reibungslos. Von der Kündigung bis zur ersten Abrechnung.",
      img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=70",
      to: "/ablauf",
    },
    {
      t: "Strompreise verstehen",
      d: "Grundpreis, Arbeitspreis, Boni: Was wirklich in Ihrem Tarif steckt.",
      img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=70",
      to: "/faq",
    },
    {
      t: "Über PRIME ENERGIE",
      d: "Warum wir unabhängig sind und wie wir Geld verdienen. Transparent erklärt.",
      img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=70",
      to: "/ueber-uns",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
      <motion.div {...fadeUp} className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-success">
            Ratgeber
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">
            Wissen, das spart
          </h2>
        </div>
        <Link
          to="/wissen"
          className="hidden text-sm font-semibold text-primary hover:text-success md:inline-flex"
        >
          Alle Artikel <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </motion.div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((r) => (
          <motion.div key={r.t} {...fadeUp}>
            <Link
              to={r.to}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-card"
            >
              <div className="aspect-[16/10] overflow-hidden bg-surface">
                <img
                  src={r.img}
                  alt={r.t}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-primary group-hover:text-success">
                  {r.t}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.d}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-success">
                  Weiterlesen <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------- FAQ ---------------------------------- */

function FaqSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div {...fadeUp} className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-success">FAQ</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl">
            Häufige Fragen rund um Ihren Tarifwechsel
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-x-12 md:grid-cols-2">
          {[faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))].map(
            (col, ci) => (
              <Accordion
                key={ci}
                type="single"
                collapsible
                className="divide-y divide-border border-t border-border"
              >
                {col.map((f, i) => (
                  <AccordionItem key={i} value={`c${ci}-${i}`} className="border-b-0">
                    <AccordionTrigger className="py-5 text-left text-base font-semibold text-primary hover:text-success hover:no-underline [&[data-state=open]]:text-success">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- CONTACT --------------------------------- */

function ContactSection() {
  const cards = [
    {
      title: (
        <>
          Du hast Fragen zu deinem <span className="text-success">Strom- oder Gasvertrag</span>?
        </>
      ),
      items: [
        {
          icon: PhoneCall,
          text: (
            <>
              <div>Ruf uns an Montag bis Freitag, 9:00 bis 17:00 Uhr</div>
              <a
                href="tel:08001234567"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                0800 123 4567
              </a>
            </>
          ),
        },
        {
          icon: FileSignature,
          text: (
            <>
              <div>Schreib uns jederzeit</div>
              <a
                href="mailto:hallo@energieclever.de"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                hallo@energieclever.de
              </a>
            </>
          ),
        },
        {
          icon: FileSearch,
          text: (
            <>
              <div>Oft gestellte Fragen (FAQ)</div>
              <Link
                to="/faq"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                Zu den Antworten
              </Link>
            </>
          ),
        },
      ],
      footer: (
        <p className="mt-6 text-sm text-primary-foreground/80">
          Bevor du uns kontaktierst, lies dir gerne unsere Gedanken zu einem{" "}
          <Link to="/service" className="font-semibold text-success underline-offset-4 hover:underline">
            respektvollen Service
          </Link>{" "}
          durch.
        </p>
      ),
    },
    {
      title: (
        <>
          Du hast Fragen zu deiner <span className="text-success">Wärmepumpe</span>?
        </>
      ),
      items: [
        {
          icon: PhoneCall,
          text: (
            <>
              <div>Ruf uns an Montag bis Freitag, 9:00 bis 17:00 Uhr</div>
              <a
                href="tel:08938031600"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                089 38031 600
              </a>
            </>
          ),
        },
        {
          icon: FileSignature,
          text: (
            <>
              <div>Schreib uns jederzeit:</div>
              <a
                href="mailto:waermepumpe@energieclever.de"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                waermepumpe@energieclever.de
              </a>
            </>
          ),
        },
        {
          icon: Users,
          text: (
            <>
              <div>Sprich direkt mit uns auf unseren Wärmepumpen-Events.</div>
              <Link to="/kontakt" className="font-semibold text-success underline-offset-4 hover:underline">
                Jetzt Termin anfragen.
              </Link>
            </>
          ),
        },
        {
          icon: FileSearch,
          text: (
            <>
              <div>Oft gestellte Fragen (FAQ)</div>
              <Link
                to="/faq"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                Zu den Antworten
              </Link>
            </>
          ),
        },
      ],
      footer: (
        <p className="mt-6 text-sm text-primary-foreground/80">
          Unsere Wärmepumpen-AGB findest du{" "}
          <Link to="/widerruf" className="font-semibold text-success underline-offset-4 hover:underline">
            hier.
          </Link>
        </p>
      ),
    },
  ];

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fadeUp} className="grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <div
              key={i}
              className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-card md:p-10"
            >
              <h3 className="font-display text-xl font-bold md:text-2xl">{c.title}</h3>
              <ul className="mt-6 space-y-5">
                {c.items.map((it, j) => {
                  const Icon = it.icon;
                  return (
                    <li key={j} className="flex gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 text-sm leading-relaxed text-primary-foreground/90">
                        {it.text}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {c.footer}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- FINAL CTA ------------------------------- */

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <motion.div
        {...fadeUp}
        className="relative overflow-hidden rounded-3xl p-10 text-white shadow-2xl md:p-14"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${finalCtaBg})` }}
          aria-hidden
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        {/* Decorative glows */}
        <div
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-success/20 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl"
          aria-hidden
        />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">
              Bereit, weniger zu zahlen?
            </h2>
            <p className="mt-3 max-w-xl opacity-95">
              Starten Sie jetzt Ihre kostenlose Tarifprüfung. 2 Minuten. Mehr brauchen wir nicht.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm opacity-95">
              <Phone className="h-4 w-4" /> Lieber persönlich?{" "}
              <a className="font-semibold underline" href="tel:08001234567">
                0800 123 4567
              </a>
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="h-12 bg-white text-base font-semibold text-primary hover:bg-white/90"
          >
            <Link to="/angebot">
              Persönliches Angebot erhalten <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

/* ----------------------------- WECHSEL CTA -------------------------------- */

function WechselCta() {
  const [plz, setPlz] = useState("");
  const navigate = useNavigate();
  const valid = plz.length >= 4;
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fadeUp} className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-success">
            <Sparkles className="h-3.5 w-3.5" /> Jetzt wechseln
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-primary md:text-5xl">
            Einmal wechseln, <span className="text-success">für immer faire Preise</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Wechsle in 2 Minuten zu Deutschlands smartem Strom- und Gasanbieter.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="relative mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-primary/90 p-6 text-primary-foreground shadow-2xl md:p-12"
        >
          {/* decorative glows */}
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-success/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-success/20 blur-3xl"
            aria-hidden
          />

          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_1.05fr]">
            {/* Lottie scene */}
            <div className="relative mx-auto h-64 w-full max-w-md md:h-80">
              <LazyLottie src="https://assets-v2.lottiefiles.com/a/03a93c50-117f-11ee-84bc-ab12043c0786/Npcd1vaZXc.lottie" />
            </div>

            {/* Form */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-success">
                <Zap className="h-4 w-4" /> Ökostrom · Gas
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                Hol' dir jetzt dein persönliches Angebot
              </h3>
              <p className="mt-2 text-sm text-primary-foreground/75">
                Gib deine Postleitzahl ein. Wir zeigen dir in Sekunden die besten Tarife in deiner
                Region.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (valid) navigate({ to: "/angebot", search: { plz } as never });
                }}
                className="mt-6"
              >
                <div className="group relative flex items-center gap-2 rounded-2xl p-2 shadow-xl ring-1 ring-white/10 transition focus-within:ring-2 focus-within:ring-success">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-success/10 text-success">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <Input
                    value={plz}
                    onChange={(e) => setPlz(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    placeholder="Deine Postleitzahl"
                    inputMode="numeric"
                    aria-label="Postleitzahl"
                    className="h-11 flex-1 border-0 bg-transparent px-0 text-base font-semibold text-primary-foreground placeholder:font-normal placeholder:text-primary-foreground/50 focus-visible:ring-0"
                  />
                  <Button
                    type="submit"
                    disabled={!valid}
                    className="h-11 shrink-0 rounded-xl bg-success px-5 text-sm font-semibold text-success-foreground shadow-md transition hover:bg-success/90 hover:shadow-lg disabled:opacity-60"
                  >
                    Angebot einholen <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-primary-foreground/80">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> 100% kostenlos
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Unverbindlich
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Wechsel in 2 Min.
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Ist die Beratung wirklich kostenlos?",
    a: "Ja. Wir werden vom neuen Anbieter vergütet, nicht von Ihnen. Für Sie entstehen keinerlei Kosten.",
  },
  {
    q: "Wie lange dauert ein Wechsel?",
    a: "Der Wechselprozess dauert in der Regel 4–8 Wochen. Die Versorgung läuft währenddessen lückenlos weiter.",
  },
  {
    q: "Gibt es eine Versorgungsunterbrechung?",
    a: "Nein. Strom und Gas fließen ohne Unterbrechung. Nur der Vertragspartner wechselt.",
  },
  {
    q: "Welche Daten brauchen Sie von mir?",
    a: "Postleitzahl, ungefährer Jahresverbrauch und Kontaktdaten reichen aus. Eine alte Jahresabrechnung beschleunigt die Prüfung.",
  },
  {
    q: "Was passiert mit meinen Daten?",
    a: "Alle Daten werden DSGVO-konform in Deutschland verarbeitet und nur zur Tarifprüfung verwendet.",
  },
  {
    q: "Bin ich verpflichtet, das Angebot anzunehmen?",
    a: "Nein. Die Beratung ist komplett unverbindlich. Sie entscheiden, ob Sie wechseln möchten.",
  },
  {
    q: "Auch für Gewerbekunden?",
    a: "Ja, wir betreuen Selbstständige, kleine Unternehmen und Hausverwaltungen mit Sondertarifen.",
  },
  {
    q: "Wie kündige ich meinen alten Vertrag?",
    a: "Auf Wunsch übernehmen wir die Kündigung beim alten Anbieter komplett für Sie.",
  },
];
