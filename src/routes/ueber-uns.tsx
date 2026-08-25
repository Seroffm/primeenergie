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
      { title: "Über PRIME ENERGIE | Persönliche Tarifberatung" },
      {
        name: "description",
        content:
          "PRIME ENERGIE unterstützt private Haushalte und Unternehmen dabei, Tarife für Strom und Gas verständlich zu prüfen und passende Entscheidungen zu treffen.",
      },
      { property: "og:title", content: "Über uns | PRIME ENERGIE" },
      {
        property: "og:description",
        content:
          "Persönliche Tarifberatung aus Dortmund: verständlich, transparent und unverbindlich.",
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
    title: "Transparent",
    desc: "Wir erläutern Preise, Laufzeiten, Boni und Kündigungsfristen so, dass Sie die Unterschiede nachvollziehen können.",
  },
  {
    icon: Heart,
    title: "Persönlich",
    desc: "Ihre Situation steht am Anfang der Beratung. Wir hören zu, fragen nach und erklären verständlich.",
  },
  {
    icon: Sparkles,
    title: "Verständlich",
    desc: "Wir übersetzen Tarifbedingungen in klare Sprache, damit Sie bewusst entscheiden können.",
  },
  {
    icon: Leaf,
    title: "Verantwortungsvoll",
    desc: "Wir versprechen nur, was wir tatsächlich leisten können, und behandeln Ihre Daten mit Sorgfalt.",
  },
];

const stats = [
  { value: "Strom", label: "Tarife verständlich prüfen" },
  { value: "Gas", label: "Konditionen klar vergleichen" },
  { value: "Privat", label: "Persönlich beraten lassen" },
  { value: "Gewerbe", label: "Bedarf individuell einordnen" },
];

const team = [
  {
    name: "Tarifberatung",
    role: "Bedarf verstehen",
    bio: "Wir erfassen Verbrauch, Vertragssituation und Wünsche, bevor wir Tarifoptionen einordnen.",
  },
  {
    name: "Kundenservice",
    role: "Persönlich begleiten",
    bio: "Unser Team beantwortet Rückfragen und begleitet die nächsten Schritte bis zum gewünschten Wechsel.",
  },
  {
    name: "Qualität & Datenschutz",
    role: "Sorgfältig arbeiten",
    bio: "Wir achten auf nachvollziehbare Angaben, sichere Prozesse und einen verantwortungsvollen Umgang mit Daten.",
  },
];

const milestones = [
  {
    year: "01",
    title: "Zuhören",
    desc: "Wir klären, was Ihnen bei Preis, Laufzeit, Service und Energieart wichtig ist.",
  },
  {
    year: "02",
    title: "Prüfen",
    desc: "Wir betrachten verfügbare Tarifoptionen und ordnen die Konditionen verständlich ein.",
  },
  {
    year: "03",
    title: "Erklären",
    desc: "Sie erhalten eine klare Übersicht und können Rückfragen direkt mit uns besprechen.",
  },
  {
    year: "04",
    title: "Begleiten",
    desc: "Wenn Sie sich entscheiden, unterstützen wir Sie bei den vereinbarten nächsten Schritten.",
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
            <MapPin className="h-3.5 w-3.5" /> PRIME ENERGIE · Persönlich aus Dortmund
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="mt-6 text-4xl font-bold leading-tight text-primary md:text-6xl"
          >
            Energieberatung,
            <br />
            {" "}die Sie verstehen.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            PRIME ENERGIE verbindet digitale Tarifprüfung mit persönlicher Beratung. Unser Ziel:
            klare Informationen, passende Optionen und eine Entscheidung, die zu Ihnen passt.
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
              Energieverträge enthalten viele Einzelheiten: Arbeitspreis, Grundpreis, Laufzeit,
              Preisgarantie, Bonus und Kündigungsfrist. Wir bringen diese Punkte in eine
              verständliche Reihenfolge.
            </p>
            <p className="mt-4 text-muted-foreground">
              Unser Anspruch: Sie kennen die entscheidenden Konditionen, verstehen mögliche
              Unterschiede und entscheiden ohne Zeitdruck.
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
                "Die erste Tarifprüfung ist für Sie kostenlos und unverbindlich.",
                "Wir erklären die wichtigen Konditionen in nachvollziehbarer Sprache.",
                "Sie entscheiden selbst, ob Sie ein Angebot annehmen möchten.",
                "Daten werden nur im erforderlichen und vereinbarten Umfang verarbeitet.",
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
            Beratung, Service und Qualität arbeiten zusammen, damit Ihre Anfrage verständlich,
            sorgfältig und persönlich bearbeitet wird.
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
              So arbeitet PRIME ENERGIE
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
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Lernen Sie PRIME ENERGIE kennen.
              </h2>
              <p className="mt-3 text-primary-foreground/80">
                Stellen Sie Ihre Fragen und erhalten Sie eine klare erste Einschätzung.
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
