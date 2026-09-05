import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Building2,
  Phone,
  FileText,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt: Persönliche Energieberatung | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Kontaktieren Sie PRIME ENERGIE telefonisch, per E-Mail oder über die Online-Tarifprüfung.",
      },
      { property: "og:title", content: "Kontakt | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Persönliche Energieberatung per Telefon und direkter Kontakt zu unserem Team.",
      },
    ],
  }),
  component: KontaktPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const channels = [
  {
    icon: FileText,
    label: "Tarifprüfung",
    value: "Rechnung hochladen",
    href: "/angebot",
    note: "PDF oder Foto, sicher und unverbindlich",
  },
  {
    icon: ShieldCheck,
    label: "Hilfe",
    value: "Antworten im FAQ",
    href: "/faq",
    note: "Die wichtigsten Fragen direkt geklärt",
  },
];

const hours = [
  { day: "Montag bis Freitag", time: "08:00–16:00 Uhr" },
  { day: "Samstag", time: "10:00–14:00 Uhr" },
];

function KontaktPage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-success/5 via-background to-background">
        <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(60%_50%_at_50%_0%,hsl(var(--success)/0.18),transparent_60%)]" />
        <div className="mx-auto max-w-4xl px-4 py-20 md:py-28 text-center">
          <motion.div
            {...fadeUp}
            className="inline-flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 px-5 py-3 text-left text-xs font-medium text-success"
          >
            <Phone className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <a href="tel:+4923139989390" className="block text-sm font-bold hover:underline">
                0231 39989390
              </a>
              <a
                href="mailto:info@primeenergie.de"
                className="mt-1 block font-medium hover:underline"
              >
                info@primeenergie.de
              </a>
            </span>
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="mt-6 text-4xl font-bold leading-tight text-primary md:text-6xl"
          >
            So erreichen Sie uns
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Unser Team unterstützt Sie persönlich bei Fragen zu Tarifen, Verträgen und Ihrer
            Energieversorgung. Rufen Sie uns bei Fragen einfach an.
          </motion.p>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {channels.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-success/40 hover:shadow-card"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-success/15 to-success/5 text-success ring-1 ring-success/20">
                <c.icon className="h-7 w-7" />
              </div>
              <div className="mt-5 text-xs uppercase tracking-wide text-muted-foreground">
                {c.label}
              </div>
              <div className="mt-1 text-xl font-bold text-primary group-hover:text-success">
                {c.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{c.note}</div>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-success">
                Jetzt nutzen{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* HOURS + ADDRESS + TRUST */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Hours */}
            <motion.div
              {...fadeUp}
              className="rounded-2xl border border-border bg-card p-7 shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-primary">Telefonische Erreichbarkeit</h2>
              <ul className="mt-4 divide-y divide-border">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="shrink-0 text-right font-semibold text-primary">{h.time}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Address */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="rounded-2xl border border-border bg-card p-7 shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-primary">PRIME ENERGIE in Dortmund</h2>
              <p className="mt-4 text-muted-foreground">
                Alpha Energie GmbH
                <br />
                Alter Hellweg 50
                <br />
                44379 Dortmund
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                <MapPin className="h-3.5 w-3.5" /> Beratung deutschlandweit
              </div>
            </motion.div>

            {/* Trust */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="rounded-2xl border border-border bg-gradient-to-br from-primary to-primary/90 p-7 text-primary-foreground shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-success">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold">Datenschutz transparent erklärt</h2>
              <p className="mt-3 text-sm text-primary-foreground/80">
                Wir verarbeiten Ihre Angaben zweckgebunden für Ihre Anfrage. Details zu
                Dienstleistern, Empfängern und Ihren Rechten finden Sie in der Datenschutzerklärung.
              </p>
              <Link
                to="/datenschutz"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-success hover:underline"
              >
                Datenschutz lesen <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 md:py-24">
        <motion.div
          {...fadeUp}
          className="rounded-3xl border border-success/30 bg-gradient-to-br from-success/10 via-card to-card p-8 shadow-card md:p-12"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                <Send className="h-3.5 w-3.5" /> Direkt online starten
              </div>
              <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
                Direkt zur Tarifprüfung
              </h2>
              <p className="mt-3 text-muted-foreground">
                Übermitteln Sie die wichtigsten Eckdaten online. Unser Team prüft Ihre Anfrage und
                meldet sich persönlich.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              <Link to="/angebot">
                Jetzt starten <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
