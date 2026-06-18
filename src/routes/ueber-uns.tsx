import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  Heart,
  Award,
  Sparkles,
  ArrowRight,
  Handshake,
  Leaf,
  Target,
  Compass,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title: "Über uns: Unabhängige Energieberatung | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Wir sind ein unabhängiges Beratungsteam für Strom- und Gastarife mit Sitz in Deutschland. Persönlich, transparent, ohne Provisionsdruck.",
      },
      { property: "og:title", content: "Über uns | PRIME ENERGIE" },
      {
        property: "og:description",
        content:
          "Unabhängige Energieberatung aus Deutschland. Persönlich, transparent, ohne Provisionsdruck.",
      },
    ],
  }),
  component: UeberUnsPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Unabhängig",
    desc: "Kein Versorger besitzt uns Anteile. Wir empfehlen, was wirklich passt. Nicht, was am meisten Provision bringt.",
  },
  {
    icon: Heart,
    title: "Persönlich",
    desc: "Echte Menschen am Telefon, die zuhören. Keine Warteschleifen, keine Bots, keine Verkaufsmasche.",
  },
  {
    icon: Sparkles,
    title: "Verständlich",
    desc: "Wir übersetzen Tarif-Kleingedrucktes in klare Empfehlungen. Sie verstehen, was Sie unterschreiben.",
  },
  {
    icon: Leaf,
    title: "Nachhaltig",
    desc: "Auf Wunsch finden wir geprüfte Ökotarife. Ohne versteckte Aufpreise.",
  },
];

const stats = [
  { value: "15+", label: "Jahre Branchenerfahrung" },
  { value: "50.000+", label: "Beratungen durchgeführt" },
  { value: "Ø 480 €", label: "Ersparnis pro Haushalt" },
  { value: "4,8 / 5", label: "Kundenbewertung" },
];

const team = [
  {
    name: "Markus Hoffmann",
    role: "Geschäftsführung & Beratung",
    bio: "12 Jahre Energievertrieb, davon 6 bei einem großen Versorger. Wechselte 2019 die Seite. Heute steht er auf Kundenseite.",
  },
  {
    name: "Sandra Lehmann",
    role: "Leitung Kundenberatung",
    bio: "Zertifizierte Energieberaterin (HWK). Spezialistin für komplexe Verbrauchsprofile und Gewerbetarife.",
  },
  {
    name: "Jonas Vogel",
    role: "Tarifanalyse & Datenschutz",
    bio: "Sorgt dafür, dass Tarifdaten täglich aktuell sind und Ihre Daten DSGVO-konform verarbeitet werden.",
  },
];

const milestones = [
  {
    year: "2018",
    title: "Gründung in Berlin",
    desc: "Drei Branchenprofis starten PRIME ENERGIE mit einer Idee: Beratung ohne Provisionsdruck.",
  },
  {
    year: "2020",
    title: "10.000 Kunden",
    desc: "Erster großer Meilenstein. Inklusive TÜV-zertifiziertem Beratungsprozess.",
  },
  {
    year: "2022",
    title: "Krisen-Hotline",
    desc: "Während der Energiekrise: kostenlose Soforthilfe für überforderte Haushalte.",
  },
  {
    year: "2025",
    title: "50.000 Beratungen",
    desc: "Heute beraten wir täglich Haushalte und Gewerbe in ganz Deutschland.",
  },
];

function UeberUnsPage() {
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
            <MapPin className="h-3.5 w-3.5" /> Made in Germany · Sitz in Berlin
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="mt-6 text-4xl font-bold leading-tight text-primary md:text-6xl"
          >
            Energieberatung,
            <br />
            wie sie sein sollte.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Wir sind ein unabhängiges Team aus Energieprofis. Ohne Versorger im Rücken, ohne
            Provisionsdruck, mit einer einzigen Aufgabe: dass Sie weniger zahlen.
          </motion.p>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft"
            >
              <div className="text-3xl font-bold text-success md:text-4xl">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <Target className="h-3.5 w-3.5" /> Unsere Mission
            </div>
            <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
              Energieverträge sollen verständlich sein.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Tarife mit drei Sternchentexten, Boni, die im zweiten Jahr verfallen, Preisgarantien,
              die keine sind. Das System ist gemacht, um zu verwirren. Wir machen es einfach.
            </p>
            <p className="mt-4 text-muted-foreground">
              Unser Anspruch: Sie verstehen am Ende des Telefonats, warum dieser eine Tarif für Sie
              der richtige ist. Und warum sich der Wechsel rechnet. Schwarz auf weiß.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 p-8 text-primary-foreground shadow-card md:p-10"
          >
            <Compass className="h-10 w-10 text-success" />
            <h3 className="mt-6 text-2xl font-semibold">Unser Versprechen</h3>
            <ul className="mt-6 space-y-3">
              {[
                "Die Beratung kostet Sie keinen Cent. Wir werden vom neuen Anbieter vergütet.",
                "Wir empfehlen ausschließlich Anbieter, die wir geprüft haben.",
                "Sie entscheiden. Immer. Wir machen niemals Druck.",
                "Keine Daten ohne Ihre Einwilligung an Dritte.",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-primary-foreground/90">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" /> {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary md:text-4xl">Was uns leitet</h2>
            <p className="mt-4 text-muted-foreground">
              Vier Werte, die wir jeden Tag in jedem Telefonat ernst nehmen.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-success/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success/15 to-success/5 text-success ring-1 ring-success/20">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-primary">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <Users className="h-3.5 w-3.5" /> Das Team
          </div>
          <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
            Menschen, die Energie verstehen
          </h2>
          <p className="mt-4 text-muted-foreground">
            Zertifizierte Energieberater, ehemalige Vertriebsprofis großer Versorger und
            Service-Spezialisten. Zusammen über 15 Jahre Branchenerfahrung.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {team.map((m, i) => (
            <motion.article
              key={m.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-7 shadow-soft"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-success/20 to-success/5 text-2xl font-bold text-success ring-1 ring-success/20">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-primary">{m.name}</h3>
              <div className="text-sm font-medium text-success">{m.role}</div>
              <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-20 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <Award className="h-3.5 w-3.5" /> Unser Weg
            </div>
            <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
              Sieben Jahre PRIME ENERGIE
            </h2>
          </div>
          <ol className="relative mt-14 space-y-8 border-l-2 border-success/20 pl-8">
            {milestones.map((m, i) => (
              <motion.li
                key={m.year}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="relative"
              >
                <span className="absolute -left-[42px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-success text-[10px] font-bold text-success-foreground">
                  ●
                </span>
                <div className="text-sm font-bold text-success">{m.year}</div>
                <div className="mt-1 text-lg font-semibold text-primary">{m.title}</div>
                <p className="mt-1 text-muted-foreground">{m.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 md:py-24">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 p-8 text-primary-foreground shadow-card md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <Handshake className="h-10 w-10 text-success" />
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">Lernen Sie uns kennen.</h2>
              <p className="mt-3 text-primary-foreground/80">
                Ein Anruf, eine ehrliche Einschätzung. Keine Verpflichtung.
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
                <Link to="/kontakt">Kontakt aufnehmen</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
