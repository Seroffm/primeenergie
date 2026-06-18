import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileSearch,
  PhoneCall,
  FileSignature,
  PlugZap,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ablauf")({
  head: () => ({
    meta: [
      { title: "Ablauf: So funktioniert der Tarifwechsel | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "In 4 Schritten zum besseren Strom- oder Gastarif: Anfrage, Prüfung, Angebot, Wechsel. Persönlich, kostenlos, ohne Versorgungslücke.",
      },
      { property: "og:title", content: "Ablauf: So funktioniert der Tarifwechsel | PRIME ENERGIE" },
      {
        property: "og:description",
        content:
          "In 4 Schritten zum besseren Strom- oder Gastarif. Persönlich, kostenlos, ohne Versorgungslücke.",
      },
    ],
  }),
  component: AblaufPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const steps = [
  {
    icon: FileSearch,
    kicker: "Schritt 1",
    title: "Anfrage senden",
    duration: "ca. 2 Minuten",
    desc: "Sie füllen unser kurzes Online-Formular aus. PLZ, ungefährer Verbrauch, Kontaktdaten. Mehr brauchen wir nicht, um loszulegen.",
    bullets: ["100 % unverbindlich", "Keine Registrierung", "Auf Wunsch mit alter Rechnung"],
  },
  {
    icon: PhoneCall,
    kicker: "Schritt 2",
    title: "Persönliche Prüfung",
    duration: "innerhalb von 24 Std.",
    desc: "Ein zertifizierter Berater prüft Ihre Verbrauchs- und Vertragsdaten und filtert passende Tarife aus unserem Pool geprüfter Anbieter.",
    bullets: [
      "Echte Menschen, kein Bot",
      "Unabhängig & ohne Provisionsdruck",
      "Auf Ihre Situation zugeschnitten",
    ],
  },
  {
    icon: FileSignature,
    kicker: "Schritt 3",
    title: "Angebot erhalten",
    duration: "schriftlich & klar",
    desc: "Sie erhalten ein konkretes Angebot per E-Mail oder Telefon. Mit Sparpotenzial, Vertragsdetails und allen wichtigen Konditionen auf einen Blick.",
    bullets: [
      "Transparente Konditionen",
      "Inkl. Sparberechnung",
      "Bedenkzeit so lange Sie möchten",
    ],
  },
  {
    icon: PlugZap,
    kicker: "Schritt 4",
    title: "Wechsel auf Wunsch",
    duration: "4–8 Wochen",
    desc: "Sagen Sie ja, übernehmen wir den kompletten Wechsel. Inklusive Kündigung beim alten Anbieter. Sie merken davon nichts außer der Ersparnis.",
    bullets: ["Keine Versorgungslücke", "Komplette Abwicklung durch uns", "Bestätigung per E-Mail"],
  },
];

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Versorgungsgarantie",
    desc: "Der Wechsel ist gesetzlich abgesichert. Sie haben jederzeit Strom und Gas.",
  },
  {
    icon: BadgeCheck,
    title: "Geprüfte Anbieter",
    desc: "Wir empfehlen ausschließlich Versorger mit nachweislich gutem Service.",
  },
  {
    icon: Clock,
    title: "Wir halten Fristen ein",
    desc: "Kündigungsfristen und Wechseltermine werden punktgenau eingehalten.",
  },
];

function AblaufPage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-success/5 via-background to-background">
        <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(60%_50%_at_50%_0%,hsl(var(--success)/0.18),transparent_60%)]" />
        <div className="mx-auto max-w-5xl px-4 py-20 md:py-28 text-center">
          <motion.div
            {...fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-xs font-medium text-success"
          >
            <Sparkles className="h-3.5 w-3.5" /> So einfach geht Tarifwechsel heute
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="mt-6 text-4xl font-bold leading-tight text-primary md:text-6xl"
          >
            In 4 Schritten zum besseren Tarif
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Transparent, persönlich und ohne versteckte Schritte. Wir nehmen Ihnen die ganze Arbeit
            ab. Sie genießen die Ersparnis.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              <Link to="/angebot">
                Jetzt Tarifprüfung starten <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/kontakt">Fragen? Sprechen Sie uns an</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* STEPS */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Ihr Weg zur Ersparnis</h2>
          <p className="mt-4 text-muted-foreground">
            Vier klare Etappen. Sie investieren wenige Minuten. Den Rest erledigen wir.
          </p>
        </div>

        <div className="relative mt-14 grid gap-6 md:grid-cols-2">
          {steps.map((s, i) => (
            <motion.article
              key={s.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-success/40 hover:shadow-card md:p-8"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-success/5 transition-all group-hover:bg-success/10" />
              <div className="relative flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-success/15 to-success/5 text-success ring-1 ring-success/20">
                  <s.icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-success/10 px-2.5 py-0.5 font-semibold text-success">
                      {s.kicker}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {s.duration}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-primary md:text-2xl">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* GUARANTEES */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary md:text-4xl">
              Was wir Ihnen garantieren
            </h2>
            <p className="mt-4 text-muted-foreground">
              Drei Versprechen, die für jeden Wechsel über PRIME ENERGIE gelten.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {guarantees.map((g, i) => (
              <motion.div
                key={g.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <g.icon className="h-8 w-8 text-success" />
                <h3 className="mt-4 text-lg font-semibold text-primary">{g.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE / TIME EXPECTATION */}
      <section className="mx-auto max-w-5xl px-4 py-20 md:py-24">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 p-8 text-primary-foreground shadow-card md:p-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                <Clock className="h-3.5 w-3.5" /> Ihr Zeiteinsatz
              </div>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                2 Minuten Ihrer Zeit. Bis zu 850 € Ersparnis pro Jahr
              </h2>
              <p className="mt-3 text-primary-foreground/80">
                Mehr ist es nicht. Alles Weitere übernehmen wir. Von der Prüfung bis zur Kündigung
                beim alten Anbieter.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                <Link to="/angebot">
                  Tarifprüfung starten <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <a href="mailto:hallo@energieclever.de">
                  <Mail className="mr-2 h-4 w-4" /> Per E-Mail anfragen
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
