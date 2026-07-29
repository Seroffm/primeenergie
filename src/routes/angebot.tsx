import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, ShieldCheck, Lock, ArrowRight, ChevronDown, ChevronUp, Users } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MultiStepForm } from "@/components/lead/MultiStepForm";
import { energyTypes } from "@/lib/lead-schema";
import { BrandLogo } from "@/components/site/BrandLogo";

const search = z
  .object({
    start: z.enum(energyTypes).optional(),
    plz: z.coerce.string().optional(),
    kwh: z.coerce.number().int().positive().optional(),
    ref: z.string().max(20).optional(),
  })
  .optional();

export const Route = createFileRoute("/angebot")({
  validateSearch: (s) => search.parse(s) ?? {},
  head: () => ({
    meta: [
      { title: "Kostenlose Tarifprüfung | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "In 2 Minuten zum persönlichen Strom- oder Gasangebot. Unverbindlich und kostenlos.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AngebotPage,
});

const steps = [
  {
    label: "Verbrauch angeben",
    desc: "PLZ und Jahresverbrauch eintragen. Dauert unter 2 Minuten.",
  },
  {
    label: "Angebot erhalten",
    desc: "Wir vergleichen alle 100+ Anbieter und melden uns persönlich.",
  },
  {
    label: "Wir erledigen alles",
    desc: "Kündigung, Ummeldung, Übergabe - kein Papierkram für Sie.",
  },
];

const faqs = [
  {
    q: "Ist der Vergleich wirklich komplett kostenlos?",
    a: "Ja, vollständig. Wir erhalten eine Provision vom neuen Anbieter - nicht von Ihnen. Für Sie entstehen zu keinem Zeitpunkt Kosten.",
  },
  {
    q: "Muss ich selbst beim alten Anbieter kündigen?",
    a: "Nein. Wir übernehmen die gesamte Abwicklung inklusive Kündigung beim bisherigen Anbieter und die Anmeldung beim neuen.",
  },
  {
    q: "Gibt es eine Versorgungsunterbrechung beim Wechsel?",
    a: "Ausgeschlossen. Das Energierecht garantiert einen nahtlosen Übergang. Ihre Versorgung läuft ohne eine einzige Minute Unterbrechung weiter.",
  },
  {
    q: "Was passiert mit meinen persönlichen Daten?",
    a: "Ihre Daten werden ausschließlich für den Tarifvergleich genutzt und DSGVO-konform in Deutschland verarbeitet. Keine Weitergabe ohne Ihre ausdrückliche Einwilligung.",
  },
  {
    q: "Bin ich verpflichtet, ein Angebot anzunehmen?",
    a: "Nein. Das Angebot ist völlig unverbindlich. Sie entscheiden selbst, ob und wann Sie wechseln.",
  },
];

function AngebotPage() {
  const search = Route.useSearch();
  const start = search?.start;
  const plz = search?.plz;
  const kwh = search?.kwh;
  const referralCode = search?.ref;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link
            to="/"
            aria-label="PRIME ENERGIE Startseite"
            className="rounded-md transition-opacity hover:opacity-80"
          >
            <BrandLogo priority className="w-36 sm:w-44" />
          </Link>

          <div className="hidden items-center gap-5 text-xs text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-success" />
              SSL-verschlüsselt
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              DSGVO-konform
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-success" />
              Persönliche Tarifprüfung
            </span>
          </div>

          <Link
            to="/kontakt"
            className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-success/20"
          >
            <Phone className="h-4 w-4 text-success" />
            <span className="hidden sm:inline">Rückruf anfordern</span>
          </Link>
        </div>
      </header>

      {/* ─── HERO — Badge · H1 · Sub (max 20 words) | Sticky Form ─── */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:grid md:grid-cols-[1fr_minmax(0,520px)] md:items-start md:gap-12 md:py-16">
        {/* Left: max 4 elements: badge + h1 + sub + (form is the CTA on right) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-0"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3.5 py-1.5 text-xs font-semibold text-success">
            <Users className="h-3.5 w-3.5" />
            Persönliche Empfehlung
          </div>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-primary md:text-5xl">
            Strom & Gas: Hören Sie auf, zu viel zu zahlen.
          </h1>

          {/* ≤ 20 words */}
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Deutsche Haushalte zahlen im Schnitt{" "}
            <strong className="text-primary">380 € zu viel</strong> - jährlich. Prüfen Sie jetzt
            kostenlos Ihren Tarif.
          </p>

          {/* 4th hero element: lifestyle image */}
          <div className="mt-7 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&q=80"
              alt="Zuhause in Deutschland"
              width={800}
              height={500}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Right: form sticky */}
        <motion.div
          id="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="md:sticky md:top-20 md:self-start"
        >
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card md:p-8">
            {referralCode && (
              <div className="mb-4 rounded-lg border border-success/20 bg-success/10 p-3 text-sm text-success">
                🎁 <strong>Empfehlung aktiv:</strong> Sie wurden von einem Kunden empfohlen!
              </div>
            )}
            <MultiStepForm
              initialEnergy={start}
              initialPlz={plz}
              initialKwh={kwh}
              referralCode={referralCode}
            />
          </div>
          {/* DSGVO below the form — trust info at the point of data entry */}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-success" />
            SSL-verschlüsselt · DSGVO-konform · Kostenlos & unverbindlich
          </p>
        </motion.div>
      </section>

      {/* ─── TRUST BAR — 4-stat grid ─── */}
      <div className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border/50 md:grid-cols-4">
          {[
            { v: "100+", l: "Tarife im Vergleich" },
            { v: "24 h", l: "bis zur ersten Rückmeldung" },
            { v: "1:1", l: "persönliche Beratung" },
            { v: "0 €", l: "Kosten für Sie" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center bg-surface px-4 py-7 text-center">
              <span className="font-display text-2xl font-extrabold text-primary">{s.v}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── PROCESS — 3-col hairline grid ─── */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-2xl font-extrabold text-primary md:text-3xl">
            So einfach funktioniert der Wechsel.
          </h2>

          <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.label}
                className={[
                  "flex flex-col bg-background py-8",
                  i === 0 ? "md:pr-8" : i === 2 ? "md:pl-8" : "md:px-8",
                ].join(" ")}
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-success">
                  {s.label}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ — single-col accordion ─── */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="font-display text-2xl font-extrabold text-primary md:text-3xl">
            Häufige Fragen.
          </h2>

          <div className="mt-8 divide-y divide-border">
            {faqs.map((f, i) => (
              <div key={i} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-primary"
                >
                  {f.q}
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 flex-none text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 flex-none text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA — centered (single-focus close) ─── */}
      <section className="bg-primary py-16 md:py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="mx-auto mb-8 w-fit rounded-2xl bg-white px-5 py-3 shadow-xl">
            <BrandLogo className="w-44 sm:w-52" />
          </div>
          <h2 className="font-display text-3xl font-extrabold text-primary-foreground md:text-4xl">
            Bereit, zu wechseln?
          </h2>
          <p className="mt-3 text-primary-foreground/70">
            Es dauert 2 Minuten. Wir erledigen den Rest - kostenlos.
          </p>
          <a
            href="#form"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-success px-8 py-4 text-base font-bold text-success-foreground transition hover:bg-success/90 active:scale-[0.98]"
          >
            Jetzt Tarif prüfen <ArrowRight className="h-5 w-5" />
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-primary-foreground/40">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> SSL-verschlüsselt
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> DSGVO-konform
            </span>
            <span>Kostenlos & unverbindlich</span>
          </div>
        </div>
      </section>
    </div>
  );
}
