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
  Upload,
  FileText,
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
import { BrandLogo } from "@/components/site/BrandLogo";
import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import dotLottieWasmUrl from "@lottiefiles/dotlottie-web/dotlottie-player.wasm?url";
import { cn } from "@/lib/utils";
import solutionAutostrom from "@/assets/solution-autostrom.jpg";
import solutionWaermestrom from "@/assets/solution-waermestrom.jpg";
import solutionSolar from "@/assets/solution-solar.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import finalCtaBg from "@/assets/final-cta-bg.jpg";
import comparisonHero from "@/assets/comparison-hero.jpg";
import { setPendingInvoice, validateInvoice } from "@/lib/pending-invoice";

import { z } from "zod";
import { getOfferStartForQuickCalculator } from "@/lib/offer-selection";

const homeSearchSchema = z
  .object({
    start: z.enum(["strom", "gas", "beides", "gewerbe"]).optional(),
    kunde: z.enum(["privat", "gewerbe"]).optional(),
    plz: z.coerce.string().optional(),
    kwh: z.coerce.number().int().positive().optional(),
  })
  .optional();

export const Route = createFileRoute("/")({
  validateSearch: (s) => homeSearchSchema.parse(s) ?? {},
  head: () => ({
    meta: [
      { title: "PRIME ENERGIE | Tarife für Strom und Gas persönlich prüfen" },
      {
        name: "description",
        content:
          "PRIME ENERGIE prüft Tarife für Strom und Gas für private Haushalte und Unternehmen. Persönliche Beratung, verständliche Konditionen und Begleitung beim Wechsel.",
      },
      {
        property: "og:title",
        content: "PRIME ENERGIE | Tarife für Strom und Gas persönlich prüfen",
      },
      {
        property: "og:description",
        content:
          "PRIME ENERGIE prüft Tarife für Strom und Gas für private Haushalte und Unternehmen. Persönliche Beratung, verständliche Konditionen und Begleitung beim Wechsel.",
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

// Ship the player runtime with our own build. The library CDN fallback can be
// blocked by browser privacy settings, which otherwise leaves this area empty.
setWasmUrl(dotLottieWasmUrl);

type Energy = "strom" | "gas" | "beides";
type Audience = "privat" | "gewerbe";

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
      <FaqSection />
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

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 md:pt-20 md:pb-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: bgReady ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <BadgeCheck className="h-3.5 w-3.5" /> Persönliche Tarifprüfung
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] text-primary md:mt-5 md:text-6xl">
              Energie neu denken. <span className="text-success">Persönlich entscheiden.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:mt-5 md:text-lg">
              PRIME ENERGIE prüft Ihre Angaben und erklärt passende Tarife verständlich.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground md:mt-6">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" /> Kostenlos und unverbindlich
              </span>
              <span className="inline-flex items-center gap-1.5">
                <PhoneCall className="h-4 w-4 text-success" /> Persönlich beraten
              </span>
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
  const search = Route.useSearch() as
    | { start?: Energy | "gewerbe"; kunde?: Audience; plz?: string; kwh?: number }
    | undefined;
  const [audience, setAudience] = useState<Audience>(
    search?.kunde === "gewerbe" || search?.start === "gewerbe" ? "gewerbe" : "privat",
  );
  const [energy, setEnergy] = useState<Energy>(
    search?.start === "gas" || search?.start === "beides" ? search.start : "strom",
  );
  const [plz, setPlz] = useState((search?.plz ?? "").replace(/\D/g, "").slice(0, 5));
  const [kwh, setKwh] = useState<number>(search?.kwh ?? 2500);
  const [plzError, setPlzError] = useState<string | null>(null);
  const [invoiceName, setInvoiceName] = useState<string | null>(null);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  const tabs: { k: Energy; label: string; icon: typeof Zap }[] = [
    { k: "strom", label: "Strom", icon: Zap },
    { k: "gas", label: "Gas", icon: Flame },
    { k: "beides", label: "Strom & Gas", icon: Layers },
  ];

  const kwhPresets =
    energy === "gas" ? [5000, 12000, 18000, 25000, 35000] : [1500, 2500, 3500, 4500, 5500];

  function selectInvoice(file?: File) {
    if (!file) return;
    const validationError = validateInvoice(file);
    if (validationError) {
      setInvoiceError(validationError);
      setInvoiceName(null);
      setPendingInvoice([]);
      return;
    }
    setPendingInvoice([file]);
    setInvoiceName(file.name);
    setInvoiceError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}$/.test(plz)) {
      setPlzError("Bitte geben Sie Ihre 5-stellige Postleitzahl ein.");
      return;
    }
    if (audience === "gewerbe" && !invoiceName) {
      setInvoiceError("Bitte laden Sie Ihre letzte Jahresabrechnung hoch.");
      return;
    }
    setPlzError(null);
    navigate({
      to: "/angebot",
      search: {
        start: getOfferStartForQuickCalculator(audience, energy),
        kunde: audience,
        plz,
        kwh: audience === "privat" && !invoiceName ? kwh || undefined : undefined,
      } as never,
    });
  }

  return (
    <div className="form-contrast rounded-2xl border border-border bg-card p-1.5 shadow-hero">
      <div className="rounded-xl bg-card p-5 md:p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-lg font-bold text-primary">Tarifrechner</div>
            <div className="text-xs text-muted-foreground">Anfrage in wenigen Schritten</div>
          </div>
          <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            kostenlos anfragen
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-lg border border-border bg-surface p-1">
          {[
            { value: "privat" as const, label: "Privat", icon: Home },
            { value: "gewerbe" as const, label: "Gewerbe", icon: Briefcase },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setAudience(option.value);
                setInvoiceError(null);
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                audience === option.value
                  ? "bg-background text-primary shadow-soft"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <option.icon className="h-4 w-4 text-success" />
              {option.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="mt-5 space-y-4">
          {audience === "privat" && (
            <div className="grid grid-cols-3 rounded-lg bg-surface p-1">
              {tabs.map((t) => {
                const active = energy === t.k;
                return (
                  <button
                    key={t.k}
                    type="button"
                    onClick={() => setEnergy(t.k)}
                    className="relative flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium"
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
          )}

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

          {audience === "privat" && !invoiceName && (
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
          )}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-success/50 bg-success/5 p-3 transition hover:bg-success/10">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-success/10 text-success">
              {invoiceName ? <FileText className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-primary">
                {invoiceName
                  ? invoiceName
                  : audience === "gewerbe"
                    ? "Letzte Jahresabrechnung hochladen"
                    : "Verbrauch unbekannt? Rechnung hochladen"}
              </span>
              <span className="block text-xs text-muted-foreground">
                PDF, JPG oder PNG · maximal 10 MB
              </span>
            </span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="hidden"
              onChange={(event) => selectInvoice(event.target.files?.[0])}
            />
          </label>
          {invoiceError && <p className="text-xs font-medium text-destructive">{invoiceError}</p>}

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full bg-success text-base font-semibold text-success-foreground shadow-soft hover:bg-success/90"
          >
            {audience === "gewerbe" ? "Rechnung manuell prüfen lassen" : "Tarife vergleichen"}{" "}
            <ArrowRight className="ml-1 h-4 w-4" />
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
            <Award className="h-3.5 w-3.5 text-success" /> Transparente Konditionen
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
    { icon: ShieldCheck, label: "DSGVO-konforme Anfrage" },
    { icon: Award, label: "Manuelle Tarifprüfung" },
    { icon: CheckCircle2, label: "Begleitung beim Wechsel" },
    { icon: PhoneCall, label: "Persönlicher Ansprechpartner" },
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
      t: "Bedarf angeben",
      k: "wenige Minuten",
      d: "Sie übermitteln Postleitzahl, Verbrauch und Ihre Wünsche über das Formular oder telefonisch.",
      bullets: [
        "Online oder telefonisch",
        "Rechnung optional hochladen",
        "Verschlüsselte Übertragung",
      ],
    },
    {
      n: "02",
      icon: PhoneCall,
      t: "Tarife prüfen",
      k: "individuell",
      d: "Das Team von PRIME ENERGIE prüft verfügbare Optionen und ordnet Preis, Laufzeit und Konditionen ein.",
      bullets: [
        "Gesamtkosten im Blick",
        "Boni und Laufzeiten erklärt",
        "Preisgarantien klar eingeordnet",
      ],
    },
    {
      n: "03",
      icon: FileSignature,
      t: "Entscheiden & wechseln",
      k: "nach Ihrer Freigabe",
      d: "Sie entscheiden in Ruhe. Wenn das Angebot passt, begleitet PRIME ENERGIE die nächsten Schritte.",
      bullets: ["Angebot in Ruhe prüfen", "Wechselprozess begleitet", "Unterlagen nachvollziehbar"],
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          <Sparkles className="h-3.5 w-3.5" /> So funktioniert es
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl">
          Drei Schritte zu Ihrer <span className="text-success">Tarifentscheidung.</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          Von der ersten Angabe bis zum Wechsel bleibt der Ablauf klar und persönlich.
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
            Ihre Angaben, unsere Tarifprüfung und eine persönliche Einordnung aus einer Hand.
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
            So läuft Ihre Tarifprüfung:
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
              Persönliches Angebot anfragen <ArrowRight className="ml-1 h-4 w-4" />
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
            <TrendingDown className="h-3.5 w-3.5" /> Beispielrechnung
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl">
            Was könnte ein <span className="text-success">Tarifwechsel verändern?</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Unverbindliche Modellrechnung mit transparenten Beispielpreisen.
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
    const comparisonPrice = energy === "strom" ? 0.31 : 0.085;
    const base = energy === "strom" ? 145 : 110;
    const grund = Math.round(base + kwh * pricePerKwh);
    const portal = Math.round(grund * 0.87);
    const comparison = Math.round(base + kwh * comparisonPrice);
    const saved = grund - comparison;
    return { grund, portal, clever: comparison, saved };
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
            label: "Grundversorgung (Beispiel)",
            value: result.grund,
            color: "bg-primary/70",
            text: "text-primary",
          },
          {
            label: "Portal-Tarif (Beispiel)",
            value: result.portal,
            color: "bg-primary/40",
            text: "text-primary",
          },
          {
            label: "Geprüfter Sondertarif (Beispiel)",
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
            Rechnerischer Unterschied
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
            Tarif prüfen <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <p className="relative mt-4 text-xs leading-relaxed text-muted-foreground">
        Grundlage der Modellrechnung: Strom 41 ct/kWh in der Grundversorgung und 31 ct/kWh im
        Sondertarif, Gas 12 ct/kWh bzw. 8,5 ct/kWh, jeweils zuzüglich Beispiel-Grundpreis. Der
        tatsächliche Vergleich wird nach Eingabe Ihrer PLZ mit regionalen Tarifen erstellt.
      </p>
    </div>
  );
}

function ComparisonCard() {
  const us = [
    "Eine persönliche Ansprechperson ordnet das Angebot mit Ihnen ein.",
    "Auf Wunsch begleiten wir die Abstimmung mit dem bisherigen und dem neuen Anbieter.",
    "Preis, Laufzeit, Boni und Preisgarantie werden nachvollziehbar dargestellt.",
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
        <span className="font-semibold tracking-wide text-primary">Transparent gerechnet</span>
        <span>Keine Lockboni als Dauerpreis dargestellt</span>
        <span className="hidden h-3 w-px bg-border sm:block" />
        <span>Persönliche Rücksprache vor jedem Wechsel</span>
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
    { v: "1:1", l: "Persönliche Beratung", sub: "direkter Austausch mit unserem Team" },
    { v: "Klar", l: "Konditionen im Blick", sub: "Preis, Laufzeit und Boni verständlich" },
    { v: "Sicher", l: "Begleiteter Wechsel", sub: "Unterstützung bei den nächsten Schritten" },
    { v: "0 €", l: "Kostenlose Anfrage", sub: "Sie entscheiden unverbindlich" },
  ];

  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-6xl px-4">
        {/* Headline only — no eyebrow, no split */}
        <div className="border-b border-white/[0.08] py-10 md:py-14">
          <h2 className="font-display text-2xl font-extrabold text-primary-foreground sm:text-3xl md:text-4xl">
            Was PRIME ENERGIE für Sie auszeichnet.
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
              className="flex min-w-0 flex-col bg-primary px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-16"
            >
              <span className="whitespace-nowrap font-display text-4xl font-extrabold leading-none text-success sm:text-5xl md:text-[3.25rem]">
                {s.v}
              </span>
              <span className="mt-4 text-[13px] font-semibold leading-snug text-primary-foreground/80 sm:mt-5 sm:text-sm">
                {s.l}
              </span>
              <span className="mt-1.5 text-xs text-primary-foreground/40">{s.sub}</span>
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
      desc: "Regulierte Gebühren für die Nutzung der Netze für Strom und Gas sowie den Messstellenbetrieb. Diese Kosten hängen vom jeweiligen Netzgebiet ab.",
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
            Wie setzt sich Ihr Strompreis zusammen?
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Der Endpreis besteht aus Beschaffung, Vertrieb, Netzentgelten, Steuern und Abgaben. Wir
            zeigen, welche Tarifbestandteile für Ihre Entscheidung relevant sind.
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
      t: "Die Konditionen wurden verständlich erklärt und ich konnte das Angebot in Ruhe prüfen.",
    },
    {
      n: "Markus B.",
      c: "Inhaber Café, Köln",
      t: "Für unseren Betrieb wurden Verbrauch und Vertragsbedingungen nachvollziehbar eingeordnet.",
    },
    {
      n: "Familie Weiß",
      c: "Hannover",
      t: "Bei den nächsten Schritten hatte ich eine feste Ansprechperson an meiner Seite.",
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
        "Bedarf und Möglichkeiten einordnen",
        "Nächste Schritte persönlich abstimmen",
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
          Weitere Energielösungen für Ihren Bedarf<span className="text-success">.</span>
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
      d: "Wie PRIME ENERGIE arbeitet und wie sich unsere Beratung finanziert.",
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
          Sie haben Fragen zu Ihrem <span className="text-success">Vertrag für Strom oder Gas</span>
          ?
        </>
      ),
      items: [
        {
          icon: PhoneCall,
          text: (
            <>
              <div>Rufen Sie das Team von PRIME ENERGIE direkt an</div>
              <a
                href="tel:+4923139989390"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                0231 39989390
              </a>
            </>
          ),
        },
        {
          icon: FileSignature,
          text: (
            <>
              <div>Schreiben Sie uns eine E Mail</div>
              <a
                href="mailto:info@primeenergie.de"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                info@primeenergie.de
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
          Mehr über unseren persönlichen und transparenten{" "}
          <Link
            to="/service"
            className="font-semibold text-success underline-offset-4 hover:underline"
          >
            Service von PRIME ENERGIE
          </Link>{" "}
          erfahren Sie auf unserer Serviceseite.
        </p>
      ),
    },
    {
      title: (
        <>
          Sie möchten Ihre <span className="text-success">Energielösung</span> besprechen?
        </>
      ),
      items: [
        {
          icon: PhoneCall,
          text: (
            <>
              <div>Rufen Sie das Team von PRIME ENERGIE direkt an</div>
              <a
                href="tel:+4923139989390"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                0231 39989390
              </a>
            </>
          ),
        },
        {
          icon: FileSignature,
          text: (
            <>
              <div>Schreiben Sie uns eine E Mail</div>
              <a
                href="mailto:info@primeenergie.de"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                info@primeenergie.de
              </a>
            </>
          ),
        },
        {
          icon: Users,
          text: (
            <>
              <div>Stimmen Sie Ihren Beratungsbedarf direkt mit uns ab.</div>
              <Link
                to="/kontakt"
                className="font-semibold text-success underline-offset-4 hover:underline"
              >
                Beratung anfragen
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
          Unsere Vertragsinformationen finden Sie{" "}
          <Link
            to="/widerruf"
            className="font-semibold text-success underline-offset-4 hover:underline"
          >
            in den AGB.
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
    <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <motion.div
        {...fadeUp}
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl sm:p-8 md:p-14"
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
            <div className="mb-6 w-full max-w-[15rem] sm:mb-7 sm:max-w-[17.25rem]">
              <BrandLogo variant="white" className="w-full" />
            </div>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl md:text-4xl">
              Bereit, weniger zu zahlen?
            </h2>
            <p className="mt-3 max-w-xl opacity-95">
              Starten Sie jetzt Ihre kostenlose Tarifprüfung mit wenigen Angaben.
            </p>
            <div className="mt-4 flex items-start gap-2 text-sm opacity-95">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Lieber persönlich? Rufen Sie uns direkt an und lassen Sie sich telefonisch beraten.
              </span>
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="h-auto min-h-12 w-full justify-center whitespace-normal bg-white px-4 py-3 text-center text-sm font-semibold leading-snug text-primary hover:bg-white/90 sm:text-base md:w-auto"
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
  const valid = /^\d{5}$/.test(plz);
  return (
    <section className="bg-background py-14 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fadeUp} className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-success">
            <Sparkles className="h-3.5 w-3.5" /> Jetzt wechseln
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-primary md:text-5xl">
            Tarif prüfen, <span className="text-success">bewusst entscheiden.</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Starten Sie Ihre Anfrage bei PRIME ENERGIE in wenigen Schritten.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="relative mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-primary/90 p-5 text-primary-foreground shadow-2xl sm:p-6 md:mt-12 md:p-12"
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

          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_1.05fr] md:gap-10">
            {/* Lottie scene */}
            <div className="relative mx-auto h-44 w-full max-w-md sm:h-56 md:h-80">
              <LazyLottie src="https://assets-v2.lottiefiles.com/a/03a93c50-117f-11ee-84bc-ab12043c0786/Npcd1vaZXc.lottie" />
            </div>

            {/* Form */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-success">
                <Zap className="h-4 w-4" /> Ökostrom · Gas
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                Ihr persönliches Energieangebot
              </h3>
              <p className="mt-2 text-sm text-primary-foreground/75">
                Geben Sie Ihre Postleitzahl ein. Anschließend ergänzen Sie die Angaben, die wir für
                Ihre persönliche Tarifprüfung benötigen.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (valid) navigate({ to: "/angebot", search: { plz } as never });
                }}
                className="mt-6"
              >
                <div className="group relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-2xl p-2 shadow-xl ring-1 ring-white/10 transition focus-within:ring-2 focus-within:ring-success sm:flex">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-success/10 text-success">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <Input
                    value={plz}
                    onChange={(e) => setPlz(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    placeholder="Ihre Postleitzahl"
                    inputMode="numeric"
                    aria-label="Postleitzahl"
                    className="h-11 min-w-0 flex-1 border-0 bg-transparent px-0 text-base font-semibold text-primary-foreground placeholder:font-normal placeholder:text-primary-foreground/50 focus-visible:ring-0"
                  />
                  <Button
                    type="submit"
                    disabled={!valid}
                    className="col-span-2 h-11 w-full shrink-0 rounded-xl bg-success px-5 text-sm font-semibold text-success-foreground shadow-md transition hover:bg-success/90 hover:shadow-lg disabled:opacity-60 sm:w-auto"
                  >
                    Angebot einholen <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-primary-foreground/80">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Kostenlose Anfrage
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Unverbindlich
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Persönlich geprüft
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
    a: "Die Dauer hängt von Kündigungsfrist, Vertragslaufzeit und dem gewählten Anbieter ab. PRIME ENERGIE erklärt Ihnen den voraussichtlichen Ablauf vor der Beauftragung.",
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
    a: "Wir verarbeiten Ihre Angaben zweckgebunden und nach den geltenden Datenschutzvorgaben. Details zu eingesetzten Diensten und Empfängern finden Sie in unserer Datenschutzerklärung.",
  },
  {
    q: "Bin ich verpflichtet, das Angebot anzunehmen?",
    a: "Nein. Die Beratung ist komplett unverbindlich. Sie entscheiden, ob Sie wechseln möchten.",
  },
  {
    q: "Auch für Gewerbekunden?",
    a: "Ja. PRIME ENERGIE prüft auch Anfragen von Selbstständigen, Unternehmen und Hausverwaltungen anhand des jeweiligen Verbrauchsprofils.",
  },
  {
    q: "Wie kündige ich meinen alten Vertrag?",
    a: "Auf Wunsch übernehmen wir die Kündigung beim alten Anbieter komplett für Sie.",
  },
];
