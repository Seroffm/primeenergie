import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Headphones,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  Gift,
  Wrench,
  HelpCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-service.jpg";
import imgWechsel from "@/assets/solution-autostrom.jpg";
import imgDocs from "@/assets/page-wissen.jpg";
import ctaBg from "@/assets/final-cta-bg.jpg";

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Service: Persönliche Hilfe rund um Energie | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Kontakt, Wechselservice, Dokumente, FAQ und Empfehlungsprogramm. Alles, was Sie nach dem Abschluss von uns brauchen.",
      },
      { property: "og:title", content: "Service | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Persönliche Hilfe rund um Ihren Energievertrag. Schnell, freundlich, kostenlos.",
      },
      { property: "og:image", content: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=630&fit=crop&q=80" },
    ],
  }),
  component: ServicePage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const services = [
  {
    icon: Phone,
    title: "Persönliche Beratung",
    desc: "Kostenlos, deutschlandweit, echte Menschen. Mo–Fr 8–20 Uhr, Sa 10–16 Uhr.",
    to: "/kontakt",
    cta: "Berater anrufen",
  },
  {
    icon: HelpCircle,
    title: "Hilfe & FAQ",
    desc: "Antworten auf die häufigsten Fragen zu Wechsel, Tarifen, Datenschutz und mehr.",
    to: "/faq",
    cta: "Zur FAQ",
  },
  {
    icon: Wrench,
    title: "Wechsel-Service",
    desc: "Wir übernehmen Kündigung, Anmeldung und alle Termine. Sie unterschreiben einmal.",
    to: "/ablauf",
    cta: "So läuft's ab",
  },
  {
    icon: FileText,
    title: "Dokumente & Verträge",
    desc: "Vertragskopien, Widerrufsformulare und Datenschutzunterlagen auf einen Klick.",
    to: "/widerruf",
    cta: "Dokumente",
  },
  {
    icon: Gift,
    title: "Freunde werben",
    desc: "Empfehlen Sie uns weiter und sichern Sie sich 30 € Amazon-Gutschein pro erfolgreichem Wechsel.",
    to: "/freunde-werben",
    cta: "Mehr erfahren",
  },
  {
    icon: MessageCircle,
    title: "Rückruf-Service",
    desc: "Sagen Sie uns, wann es Ihnen am besten passt. Wir melden uns pünktlich.",
    to: "/kontakt",
    cta: "Rückruf anfragen",
  },
];

const promises = [
  {
    icon: Clock,
    title: "Antwort < 24 h",
    desc: "Auf jede Anfrage antworten wir spätestens am nächsten Werktag.",
  },
  {
    icon: ShieldCheck,
    title: "DSGVO & Made in Germany",
    desc: "Daten bleiben in Deutschland. Keine Weitergabe an Dritte ohne Einwilligung.",
  },
  {
    icon: Headphones,
    title: "Echte Menschen",
    desc: "Keine Warteschleifen, keine Bots. Persönliche Ansprechpartner für Sie.",
  },
];

function ServicePage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Wir sind für Sie da"
        title={<>Service, der den Namen verdient.</>}
        lead="Vom ersten Anruf bis zum Wechsel und darüber hinaus. Wir kümmern uns. Persönlich, geduldig und kostenlos."
        image={heroImg}
        imageAlt="Freundlicher Kundenberater mit Headset im hellen Büro"
        Icon={Headphones}
        primaryCta={{ to: "/kontakt", label: "Kontakt aufnehmen" }}
        secondaryCta={{ to: "/faq", label: "FAQ ansehen" }}
      />

      {/* SERVICES GRID */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Alle Services auf einen Blick
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sechs Wege, wie wir Ihnen weiterhelfen können. Wählen Sie den passenden.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.04 }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-success/40 hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success/15 to-success/5 text-success ring-1 ring-success/20">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>
              <Link
                to={s.to}
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-success hover:underline"
              >
                {s.cta}{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WECHSEL-SERVICE */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <motion.div {...fadeUp}>
              <div className="text-xs font-bold uppercase tracking-wider text-success">
                Wechsel-Service
              </div>
              <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
                Wir übernehmen die Arbeit. Sie genießen die Ersparnis.
              </h2>
              <p className="mt-5 text-muted-foreground">
                Kündigung beim alten Anbieter, Anmeldung beim neuen, fristgerechte Übergabe,
                lückenlose Versorgung. Das alles erledigen wir für Sie. Sie unterschreiben genau ein
                Dokument.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Kündigung fristgerecht zum nächsten Termin",
                  "Anmeldung beim neuen Anbieter inkl. Datenübermittlung",
                  "Schriftliche Wechselbestätigung per E-Mail",
                  "Keine Versorgungslücke. Gesetzlich garantiert",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-foreground/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" /> {b}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="overflow-hidden rounded-3xl border border-border shadow-card"
            >
              <img
                src={imgWechsel}
                alt="Vertrag wird unterzeichnet"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* DOKUMENTE */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <motion.div
            {...fadeUp}
            className="overflow-hidden rounded-3xl border border-border shadow-card md:order-2"
          >
            <img
              src={imgDocs}
              alt="Dokumente und Verträge"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="md:order-1"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-success">
              Dokumente & Verträge
            </div>
            <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
              Alles griffbereit, wenn Sie es brauchen.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Wir bewahren Vertragskopien und Bestätigungen sicher für Sie auf. Eine kurze E-Mail
              genügt. Sie bekommen das gewünschte Dokument innerhalb eines Werktags.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Vertragskopie", icon: FileText },
                { label: "Widerrufsformular", icon: FileText },
                { label: "Wechselbestätigung", icon: FileText },
                { label: "Datenschutzerklärung", icon: ShieldCheck },
              ].map((d) => (
                <div
                  key={d.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft"
                >
                  <d.icon className="h-5 w-5 text-success" />
                  <span className="text-sm font-semibold text-primary">{d.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:service@energieclever.de"
                className="inline-flex items-center gap-2 text-sm font-bold text-success hover:underline"
              >
                <Mail className="h-4 w-4" /> service@energieclever.de
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary md:text-4xl">
              Unser Service-Versprechen
            </h2>
            <p className="mt-4 text-muted-foreground">
              Drei Dinge, auf die Sie sich verlassen können.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {promises.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-7 text-center shadow-soft"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-success/15 to-success/5 text-success ring-1 ring-success/20">
                  <p.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-primary">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden">
        <img
          src={ctaBg}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-primary/85" />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center text-primary-foreground md:py-28">
          <h2 className="text-3xl font-bold md:text-5xl">Eine Frage. Eine Antwort.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
            Rufen Sie an, schreiben Sie uns oder lassen Sie sich zurückrufen. Wir sind für Sie da.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="tel:08001234567"
              className="inline-flex items-center gap-2 rounded-full bg-success px-6 py-3 text-sm font-bold text-success-foreground transition hover:bg-success/90"
            >
              <Phone className="h-4 w-4" /> 0800 123 4567
            </a>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-white/10"
            >
              Kontaktformular <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
